// server.js - 修复版
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 启用 CORS 与 JSON 支持
app.use(cors());
app.use(express.json());

// 导入数据库模块
const db = require('./event_db');

// ==================== API 路由 ====================

// 获取所有活动
app.get('/api/events', async (req, res) => {
  try {
    console.log('📨 接收到获取活动请求');
    const events = await db.getAllEvents();
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('❌ 获取活动失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动失败: ' + error.message
    });
  }
});

// 获取所有分类
app.get('/api/categories', async (req, res) => {
  try {
    console.log('📨 接收到获取分类请求');
    const [categories] = await db.connection.execute('SELECT * FROM categories ORDER BY name');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ 获取分类失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类失败: ' + error.message
    });
  }
});

// 创建新活动 - 修复版
app.post('/api/events', async (req, res) => {
  try {
    console.log('📝 创建新活动请求:', req.body);
    
    // 验证必需字段
    if (!req.body.name || !req.body.event_date || !req.body.location || !req.body.category_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必需字段: name, event_date, location, category_id'
      });
    }

    const eventId = await db.createEvent(req.body);
    
    // 获取刚创建的活动信息
    const newEvent = await db.getEventById(eventId);
    
    res.json({
      success: true,
      message: '活动创建成功',
      data: newEvent
    });
  } catch (error) {
    console.error('❌ 创建活动失败:', error);
    res.status(500).json({
      success: false,
      message: '创建活动失败: ' + error.message
    });
  }
});

// 更新活动 - 修复版
app.put('/api/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log('✏️ 更新活动请求:', eventId, req.body);
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: '无效的活动ID'
      });
    }

    const success = await db.updateEvent(eventId, req.body);
    if (success) {
      res.json({
        success: true,
        message: '活动更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '活动未找到'
      });
    }
  } catch (error) {
    console.error('❌ 更新活动失败:', error);
    res.status(500).json({
      success: false,
      message: '更新活动失败: ' + error.message
    });
  }
});

// 删除活动 - 修复版
app.delete('/api/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log('🗑️ 删除活动请求:', eventId);
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: '无效的活动ID'
      });
    }

    const success = await db.deleteEvent(eventId);
    if (success) {
      res.json({
        success: true,
        message: '活动删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '活动未找到或无法删除'
      });
    }
  } catch (error) {
    console.error('❌ 删除活动失败:', error);
    if (error.message.includes('已有注册记录')) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除活动失败: ' + error.message
      });
    }
  }
});

// 获取单个活动详情
app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: '无效的活动ID' });
    }

    const event = await db.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: '活动未找到' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('❌ 获取活动详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动详情失败: ' + error.message
    });
  }
});

// 搜索活动
app.get('/api/events/search', async (req, res) => {
  try {
    const { category, location, keyword } = req.query;
    console.log('🔍 搜索请求参数:', { category, location, keyword });

    const events = await db.getAllEvents();
    let results = events;

    if (category && category !== '') {
      results = results.filter(e => e.category_id == category);
    }

    if (location && location !== '') {
      results = results.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (keyword && keyword !== '') {
      results = results.filter(e =>
        e.name.toLowerCase().includes(keyword.toLowerCase()) ||
        e.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('❌ 搜索活动失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索活动失败: ' + error.message
    });
  }
});

// 获取所有注册
app.get('/api/registrations', async (req, res) => {
  try {
    const regs = await db.getAllRegistrations();
    res.json({ success: true, data: regs });
  } catch (error) {
    console.error('❌ 获取注册失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建注册
app.post('/api/registrations', async (req, res) => {
  try {
    const newRegId = await db.createRegistration(req.body);
    res.json({ success: true, id: newRegId });
  } catch (error) {
    console.error('❌ 创建注册失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 启动服务器 ====================

async function initializeApp() {
  try {
    console.log('🔧 初始化应用...');
    const connectionTest = await db.testConnection();
    if (!connectionTest) throw new Error('数据库连接失败，请确保MySQL服务正在运行');
    console.log('✅ 数据库连接正常');
    return true;
  } catch (error) {
    console.error('❌ 应用初始化失败:', error.message);
    throw error;
  }
}

async function startServer() {
  try {
    await initializeApp();
    app.listen(PORT, () => {
      console.log(`\n🎉 ========== API服务器启动成功 ==========`);
      console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
      console.log('\n可用端点:');
      console.log(`   GET  /api/events`);
      console.log(`   GET  /api/categories`);
      console.log(`   POST /api/events          ← 创建活动`);
      console.log(`   PUT  /api/events/:id      ← 更新活动`);
      console.log(`   DELETE /api/events/:id    ← 删除活动`);
      console.log(`   GET  /api/events/:id`);
      console.log('=====================================\n');
    });
  } catch (error) {
    console.error('\n❌ 服务器启动失败:', error.message);
    process.exit(1);
  }
}

startServer();