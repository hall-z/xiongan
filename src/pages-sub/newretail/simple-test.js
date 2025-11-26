/**
 * 简单的API转换验证测试(CommonJS版本)
 */

console.log('开始验证API转换...')

// 测试模块导入
try {
  const requestModule = require('./api/request.js')
  console.log('✅ request模块导入成功')
  console.log('APP_ID:', requestModule.APP_CONFIG.APP_ID)
  console.log('BASE_URL:', requestModule.APP_CONFIG.BASE_URL)
} catch (error) {
  console.log('❌ request模块导入失败:', error.message)
}

try {
  const utilsModule = require('./utils/utils.js')
  console.log('✅ utils模块导入成功')
  // 测试工具函数
  console.log('格式化时间:', utilsModule.default.formatTime(new Date()))
} catch (error) {
  console.log('❌ utils模块导入失败:', error.message)
}

try {
  const authModule = require('./utils/auth.js')
  console.log('✅ auth模块导入成功')
  // 测试认证函数
  const testUser = { id: 'test', username: 'testuser' }
  authModule.default.setUser(testUser)
  console.log('用户信息:', authModule.default.getUser())
} catch (error) {
  console.log('❌ auth模块导入失败:', error.message)
}

try {
  const navPageModule = require('./utils/navPage.js')
  console.log('✅ navPage模块导入成功')
  console.log('导航方法数量:', Object.keys(navPageModule.default).length)
} catch (error) {
  console.log('❌ navPage模块导入失败:', error.message)
}

console.log('验证完成！')