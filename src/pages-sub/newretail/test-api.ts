/**
 * API转换测试文件
 * 用于验证转换后的API模块是否可以正常工作
 * 使用CommonJS格式以便在Node.js中直接运行
 */

const { request, get, post, put, del, APP_CONFIG } = require('./api/request')
const UserService = require('./api/userService').default
const MemberService = require('./api/memberService').default
const ProductService = require('./api/productService').default
const ShopcartService = require('./api/shopcartService').default
const CouponService = require('./api/couponService').default
const utils = require('./utils/utils').default
const auth = require('./utils/auth').default
const NAVPAGE = require('./utils/navPage').default

// 测试工具函数
console.log('Testing utils functions...')
console.log('Format time:', utils.formatTime(new Date()))
console.log('Distance calculation:', utils.distance(39.9042, 116.4074, 31.2304, 121.4737))
console.log('Number to Chinese:', utils.numberToChinese(1234))

// 测试认证功能
console.log('Testing auth functions...')
const testUser = {
  id: 'test123',
  username: 'testuser',
  accessToken: 'test-token',
  expiresIn: 7200
}
auth.setUser(testUser)
console.log('Get user:', auth.getUser())

// 测试导航功能
console.log('Testing navigation functions...')
console.log('NAVPAGE methods:', Object.keys(NAVPAGE))

// 测试API服务
console.log('Testing API services...')
console.log('UserService methods:', Object.keys(UserService))
console.log('MemberService methods:', Object.keys(MemberService))
console.log('ProductService methods:', Object.keys(ProductService))
console.log('ShopcartService methods:', Object.keys(ShopcartService))
console.log('CouponService methods:', Object.keys(CouponService))

// 测试请求配置
console.log('Testing request configuration...')
console.log('APP_ID:', APP_CONFIG.APP_ID)
console.log('BASE_URL:', APP_CONFIG.BASE_URL)

console.log('API转换测试完成！所有模块都已成功导入。')