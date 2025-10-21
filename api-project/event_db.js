const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'charityevents_db'
};

// 创建连接池
const connection = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试数据库连接（简化版）
async function testConnection() {
  try {
    const conn = await connection.getConnection(); // 从连接池获取连接
    await conn.ping(); // 测试连接
    conn.release(); // 释放连接
    console.log('✅ 数据库连接正常');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// =====================
// 🔹 事件相关功能
// =====================

// 获取所有活动
async function getAllEvents() {
    const [rows] = await connection.execute(`
        SELECT e.*, c.name AS category_name, o.name AS organisation_name
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        LEFT JOIN organisations o ON e.organisation_id = o.id
        WHERE e.is_active = TRUE
        ORDER BY e.event_date ASC
    `);
    return rows;
}

// 获取单个活动（含注册信息）
async function getEventById(eventId) {
    const [events] = await connection.execute(`
        SELECT e.*, c.name AS category_name, o.name AS organisation_name
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        LEFT JOIN organisations o ON e.organisation_id = o.id
        WHERE e.id = ?
    `, [eventId]);

    if (events.length === 0) return null;

    const [registrations] = await connection.execute(`
        SELECT id, user_name, email, phone, tickets, registration_date
        FROM registrations
        WHERE event_id = ?
        ORDER BY registration_date DESC
    `, [eventId]);

    return {
        ...events[0],
        registrations
    };
}

// 创建新活动
async function createEvent(data) {
    const [result] = await connection.execute(`
        INSERT INTO events 
        (name, description, event_date, event_time, location, category_id, organisation_id, goal_amount, current_amount, ticket_price, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        data.name, data.description, data.event_date, data.event_time,
        data.location, data.category_id, data.organisation_id,
        data.goal_amount || 0, data.current_amount || 0,
        data.ticket_price || 0, data.image_url || null
    ]);
    return result.insertId;
}

// 更新活动
async function updateEvent(eventId, data) {
    const [result] = await connection.execute(`
        UPDATE events SET
            name = ?, description = ?, event_date = ?, event_time = ?, 
            location = ?, category_id = ?, organisation_id = ?, 
            goal_amount = ?, current_amount = ?, ticket_price = ?, 
            image_url = ?, is_active = ?
        WHERE id = ?
    `, [
        data.name, data.description, data.event_date, data.event_time,
        data.location, data.category_id, data.organisation_id,
        data.goal_amount, data.current_amount, data.ticket_price,
        data.image_url, data.is_active ?? true, eventId
    ]);
    return result.affectedRows > 0;
}

// 删除活动（仅当无注册）
async function deleteEvent(eventId) {
    const [check] = await connection.execute(
        'SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?',
        [eventId]
    );
    if (check[0].count > 0) {
        throw new Error('Cannot delete event with existing registrations');
    }

    const [result] = await connection.execute('DELETE FROM events WHERE id = ?', [eventId]);
    return result.affectedRows > 0;
}

// =====================
// 🔹 注册相关功能
// =====================

// 获取所有注册
async function getAllRegistrations() {
    const [rows] = await connection.execute(`
        SELECT r.*, e.name AS event_name
        FROM registrations r
        LEFT JOIN events e ON r.event_id = e.id
        ORDER BY r.registration_date DESC
    `);
    return rows;
}

// 新增注册
async function createRegistration(data) {
    // 确保一个用户不能重复注册同一活动
    const [existing] = await connection.execute(`
        SELECT id FROM registrations 
        WHERE event_id = ? AND email = ?
    `, [data.event_id, data.email]);
    
    if (existing.length > 0) {
        throw new Error('User already registered for this event');
    }

    const [result] = await connection.execute(`
        INSERT INTO registrations (event_id, user_name, email, phone, tickets)
        VALUES (?, ?, ?, ?, ?)
    `, [
        data.event_id, data.user_name, data.email, data.phone, data.tickets || 1
    ]);

    return result.insertId;
}

// 导出模块
module.exports = {
    connection,
    testConnection,
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllRegistrations,
    createRegistration
};
