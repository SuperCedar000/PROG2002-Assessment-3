// event_db.js - 修复 createEvent 函数
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

// 测试数据库连接
async function testConnection() {
  try {
    const conn = await connection.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ 数据库连接正常');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// =====================
// 🔹 事件相关功能 - 修复版
// =====================

// 获取所有活动
async function getAllEvents() {
    try {
        const [rows] = await connection.execute(`
            SELECT e.*, c.name AS category_name
            FROM events e
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.is_active = TRUE
            ORDER BY e.event_date ASC
        `);
        return rows;
    } catch (error) {
        console.error('获取所有活动失败:', error);
        throw error;
    }
}

// 创建新活动 - 修复版
async function createEvent(data) {
    try {
        console.log('📝 创建活动数据:', data);
        
        const [result] = await connection.execute(`
            INSERT INTO events 
            (name, description, event_date, event_time, location, category_id, organisation_id, goal_amount, current_amount, ticket_price, image_url, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.name || '', 
            data.description || '',
            data.event_date || new Date().toISOString().split('T')[0],
            data.event_time || '12:00',
            data.location || '',
            data.category_id || 1,
            data.organisation_id || 1,
            parseFloat(data.goal_amount) || 0,
            parseFloat(data.current_amount) || 0,
            parseFloat(data.ticket_price) || 0,
            data.image_url || '',
            data.is_active !== false // 默认为 true
        ]);
        
        console.log('✅ 活动创建成功，ID:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('❌ 创建活动失败:', error);
        throw error;
    }
}

// 更新活动 - 修复版
async function updateEvent(eventId, data) {
    try {
        console.log('✏️ 更新活动数据:', eventId, data);
        
        const [result] = await connection.execute(`
            UPDATE events SET
                name = ?, description = ?, event_date = ?, event_time = ?, 
                location = ?, category_id = ?, organisation_id = ?, 
                goal_amount = ?, current_amount = ?, ticket_price = ?, 
                image_url = ?, is_active = ?
            WHERE id = ?
        `, [
            data.name || '',
            data.description || '',
            data.event_date || new Date().toISOString().split('T')[0],
            data.event_time || '12:00',
            data.location || '',
            data.category_id || 1,
            data.organisation_id || 1,
            parseFloat(data.goal_amount) || 0,
            parseFloat(data.current_amount) || 0,
            parseFloat(data.ticket_price) || 0,
            data.image_url || '',
            data.is_active !== false,
            eventId
        ]);
        
        console.log('✅ 活动更新成功，影响行数:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ 更新活动失败:', error);
        throw error;
    }
}

// 删除活动 - 修复版
async function deleteEvent(eventId) {
    try {
        console.log('🗑️ 删除活动:', eventId);
        
        // 检查是否有注册记录
        const [check] = await connection.execute(
            'SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?',
            [eventId]
        );
        
        if (check[0].count > 0) {
            throw new Error('无法删除已有注册记录的活动');
        }

        const [result] = await connection.execute(
            'DELETE FROM events WHERE id = ?', 
            [eventId]
        );
        
        console.log('✅ 活动删除成功，影响行数:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ 删除活动失败:', error);
        throw error;
    }
}

// 获取单个活动
async function getEventById(eventId) {
    try {
        const [events] = await connection.execute(`
            SELECT e.*, c.name AS category_name
            FROM events e
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.id = ?
        `, [eventId]);

        if (events.length === 0) return null;

        return events[0];
    } catch (error) {
        console.error('获取活动详情失败:', error);
        throw error;
    }
}

// 获取所有注册
async function getAllRegistrations() {
    try {
        const [rows] = await connection.execute(`
            SELECT r.*, e.name AS event_name
            FROM registrations r
            LEFT JOIN events e ON r.event_id = e.id
            ORDER BY r.registration_date DESC
        `);
        return rows;
    } catch (error) {
        console.error('获取注册失败:', error);
        throw error;
    }
}

// 新增注册
async function createRegistration(data) {
    try {
        const [existing] = await connection.execute(`
            SELECT id FROM registrations 
            WHERE event_id = ? AND email = ?
        `, [data.event_id, data.email]);
        
        if (existing.length > 0) {
            throw new Error('用户已注册此活动');
        }

        const [result] = await connection.execute(`
            INSERT INTO registrations (event_id, user_name, email, phone, tickets)
            VALUES (?, ?, ?, ?, ?)
        `, [
            data.event_id, 
            data.user_name, 
            data.email, 
            data.phone, 
            data.tickets || 1
        ]);

        return result.insertId;
    } catch (error) {
        console.error('创建注册失败:', error);
        throw error;
    }
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