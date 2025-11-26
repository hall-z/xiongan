/**
 * 智慧推荐工具
 */
import LOG from './log'
import wisdomService from '@/service/api/newretail/wisdomService'
import productService from '@/service/api/newretail/productService'
import utils from './utils'
import request from '@/service/api/newretail/request'

const MCHID = "1513019861" // 微信支付分配的商户号mch_id（必填）
const SUBMCHID = '1524131751' // 微信支付分配的子商户号（服务商模式下必填）
const SUBAPPID = 'wx0a20f65388d6f4b9' // 子商户的appid（服务商模式下必填）

/**
 * 场景
 */
const SCENE = {
  /** 猜你喜欢 首页 */
  CaiNiXiHuan_ShouYe: "CaiNiXiHuan_ShouYe",
  /** 看了又看 商品详情 */
  KanLeYouKan_ShangXiangYe: "KanLeYouKan_ShangXiangYe",
  /** 买了又买 购物车 */
  MaiLeYouMai_GouWuChe: "MaiLeYouMai_GouWuChe"
}

/**
 * 埋点类型
 */
const ACTION_TYPE = {
  /** 点击商品 */
  CLICK_PRODUCT: "CLICK_PRODUCT",
  /** 加入购物车 */
  ADD_CART: "ADD_CART",
  /** 删除购物车 */
  DELETE_CART: "DELETE_CART",
  /** 下单 */
  PURCHASE: "PURCHASE"
}

interface BuryingPointOptions {
  orderId?: string
  productId?: string
  traceId?: string
  [key: string]: any
}

interface ShoppingCartItem {
  product_id: string
  buy_amount: number
}

interface CandidateItem {
  product_id: string
}

interface AssociatedItem {
  product_id: string
}

interface RecommendResult {
  product_id: string
  product_tag?: string
}

interface EasyRecData {
  recommend_results?: RecommendResult[]
  [key: string]: any
}

interface EasyRecOptions {
  mch_id: string
  appid: string
  openid: string
  store_id: string
  price_unit: string
  sub_mch_id?: string
  sub_appid?: string
}

/**
 * 埋点
 * @param actionType 埋点类型
 * @param storeId 门店ID
 * @param opts 额外选项
 */
function buryingPoint(actionType: string, storeId: string, opts?: BuryingPointOptions): void {
  const app = getApp()
  
  if (app.globalData.systemConfigure.wisdomSource !== "GM") {
    if (app.globalData.userInfo) {
      // 秒级unix时间戳
      const actionTime = Math.floor(new Date().getTime() / 1000)
      let scene = SCENE.MaiLeYouMai_GouWuChe
      
      if (actionType === ACTION_TYPE.CLICK_PRODUCT) {
        scene = SCENE.KanLeYouKan_ShangXiangYe
      } else if ([ACTION_TYPE.ADD_CART, ACTION_TYPE.DELETE_CART, ACTION_TYPE.PURCHASE].includes(actionType)) {
        scene = SCENE.MaiLeYouMai_GouWuChe
      }
      
      const openId = app.globalData.userInfo.wxaUser.openId

      const postData = {
        actionTime,
        actionType,
        scene,
        storeId,
        openid: openId,
        ...opts
      }
      
      wisdomService.buryingPoint(postData).then(() => {
        LOG.info("智慧推荐埋点接口调用成功")
      }).catch((err: any) => {
        LOG.info("查询智慧推荐失败：", err.message)
      })
    }
  }
}

function initEasyRecPlugins(type: string, self: any, storeInfo: any = null): void {
  const app = getApp()
  
  if (type === "APP") {
    if (!self.globalData.hasEasyRecPlugins) {
      console.log("未开启轻松点功能")
      LOG.info("未开启轻松点功能")
      return
    }
  } else {
    if (!app.globalData.hasEasyRecPlugins) {
      console.log("未开启轻松点功能")
      LOG.info("未开启轻松点功能")
      return
    }
  }
  
  if (storeInfo && app.globalData.initEasyRecPluginsStoreId !== storeInfo.id) {
    if (type === "APP") {
      self.globalData.initEasyRecPlugins = 0
    } else {
      app.globalData.initEasyRecPlugins = 0
    }
  }
  
  if (type === "APP") {
    if (self.globalData.userInfo) {
      if (!self.globalData.initEasyRecPlugins) {
        if (self.globalData.storeInfo || storeInfo) {
          self.globalData.initEasyRecPlugins = 1
          init()
        } else {
          LOG.info("轻松点：没有获取到门店信息")
        }
      } else {
        LOG.info("轻松点：插件已初始化")
      }
    } else {
      LOG.info("轻松点：用户未登录，无法初始化插件")
    }
  } else {
    if (app.globalData.userInfo) {
      if (!app.globalData.initEasyRecPlugins) {
        if (app.globalData.storeInfo || storeInfo) {
          app.globalData.initEasyRecPlugins = 1
          init()
        } else {
          LOG.info("轻松点：没有获取到门店信息")
        }
      } else {
        LOG.info("轻松点：插件已初始化")
      }
    } else {
      LOG.info("轻松点：用户未登录，无法初始化插件")
    }
  }

  function init(): void {
    const openId = type === "APP" 
      ? self.globalData.userInfo.wxaUser.openId 
      : app.globalData.userInfo.wxaUser.openId
    
    // UniApp 中可能需要使用不同的方式引入插件
    // const easyRec = requirePlugin('WXPayMpEasyRec')
    
    const storeId = storeInfo ? storeInfo.id : app.globalData.storeInfo.id
    if (type === "APP") {
      self.globalData.initEasyRecPluginsStoreId = storeId
    } else {
      app.globalData.initEasyRecPluginsStoreId = storeId
    }
    
    let options: EasyRecOptions = {
      mch_id: MCHID,
      appid: request.APP_ID,
      openid: openId,
      store_id: storeId,
      price_unit: 'YUAN',
    }
    
    if (app.globalData.paymentMethod === "WXA_ISV_PAY" || request.PAYMETHOD === "WXA_ISV_PAY") {
      options = {
        ...options,
        appid: "wxd7ff6ff47b79d98c",
        sub_mch_id: SUBMCHID,
        sub_appid: SUBAPPID,
      }
    }
    
    // UniApp 中可能需要使用不同的方式来初始化插件
    // easyRec.init(options)
    console.log("轻松点：初始化插件")
  }
}

/**
 * 获取购物车推荐
 */
function getCartRecommend(
  recoNum: number, 
  shoppingCartItems: ShoppingCartItem[], 
  candidateItems: CandidateItem[], 
  storeIdIn: string
): Promise<any> {
  const app = getApp()
  
  return new Promise((resolve, reject) => {
    if (!app.globalData.hasEasyRecPlugins) {
      LOG.info("未开启轻松点功能")
      reject({ isSuccess: false })
      return
    }
    
    // UniApp 中可能需要使用不同的方式调用插件
    // const easyRec = requirePlugin('WXPayMpEasyRec')
    
    // mock 实现，实际项目中需要调用真正的插件
    const mockData: EasyRecData = {
      recommend_results: candidateItems.slice(0, recoNum).map(item => ({
        product_id: item.product_id
      }))
    }
    
    const productIdIn: string[] = []
    if (mockData.recommend_results) {
      mockData.recommend_results.forEach(item => {
        productIdIn.push(item.product_id)
      })
    }
    
    const postData = {
      storeIdIn,
      productIdIn: productIdIn.join(","),
      page: 1,
      pageSize: 0
    }
    
    productService.query(postData).then(resolve).catch(err => {
      reject({ isSuccess: true, ...err })
    })
  })
}

/**
 * 获取轻松点商品推荐
 */
function getEasyRecGoods(recoNum: number = 10, storeIdIn: string): Promise<any> {
  const app = getApp()
  
  return new Promise((resolve, reject) => {
    if (!app.globalData.hasEasyRecPlugins) {
      LOG.info("未开启轻松点功能")
      reject({ isSuccess: false })
      return
    }
    
    // mock 实现
    const mockData: EasyRecData = {
      recommend_results: Array.from({ length: recoNum }, (_, i) => ({
        product_id: `mock_product_${i + 1}`,
        product_tag: i % 2 === 0 ? 'BOUGHT' : 'STORE_HOT'
      }))
    }
    
    const productIdIn: string[] = []
    if (mockData.recommend_results) {
      mockData.recommend_results.forEach(item => {
        productIdIn.push(item.product_id)
      })
    }
    
    const postData = {
      storeIdIn,
      productIdIn: productIdIn.join(","),
      page: 1,
      pageSize: 0
    }
    
    productService.query(postData).then(resolve).catch(err => {
      reject({ isSuccess: true, ...err })
    })
  })
}

/**
 * 获取猜你喜欢的结果
 */
function getAlgoRecommend(recoNum: number = 10, storeIdIn: string): Promise<any> {
  const app = getApp()
  
  return new Promise((resolve, reject) => {
    if (!app.globalData.hasEasyRecPlugins) {
      LOG.info("未开启轻松点功能")
      reject({ isSuccess: false })
      return
    }
    
    // mock 实现
    const mockData: EasyRecData = {
      recommend_results: Array.from({ length: recoNum }, (_, i) => ({
        product_id: `algo_product_${i + 1}`,
        product_tag: i % 3 === 0 ? 'BOUGHT' : i % 3 === 1 ? 'STORE_HOT' : 'RECOMMEND'
      }))
    }
    
    const productIdIn: string[] = []
    if (mockData.recommend_results) {
      mockData.recommend_results.forEach(item => {
        productIdIn.push(item.product_id)
      })
    }
    
    const postData = {
      storeIdIn,
      productIdIn: productIdIn.join(","),
      page: 1,
      pageSize: 0
    }
    
    productService.query(postData).then(resolve).catch(err => {
      reject({ isSuccess: true, ...err })
    })
  })
}

/**
 * 获取看了又看的结果
 */
function getV2VRecommend(
  recoNum: number = 10, 
  storeIdIn: string, 
  associatedItems: AssociatedItem[]
): Promise<any> {
  const app = getApp()
  
  return new Promise((resolve, reject) => {
    if (!app.globalData.hasEasyRecPlugins) {
      LOG.info("未开启轻松点功能")
      reject({ isSuccess: false })
      return
    }
    
    // mock 实现
    const mockData: EasyRecData = {
      recommend_results: Array.from({ length: recoNum }, (_, i) => ({
        product_id: `v2v_product_${i + 1}`,
        product_tag: i % 2 === 0 ? 'BOUGHT' : 'RELATED'
      }))
    }
    
    const productIdIn: string[] = []
    if (mockData.recommend_results) {
      mockData.recommend_results.forEach(item => {
        productIdIn.push(item.product_id)
      })
    }
    
    const postData = {
      storeIdIn,
      productIdIn: productIdIn.join(","),
      page: 1,
      pageSize: 0
    }
    
    productService.query(postData).then(resolve).catch(err => {
      reject({ isSuccess: true, ...err })
    })
  })
}

export default {
  scene: SCENE,
  actionType: ACTION_TYPE,
  buryingPoint,
  initEasyRecPlugins,
  getCartRecommend,
  getEasyRecGoods,
  getAlgoRecommend,
  getV2VRecommend
}