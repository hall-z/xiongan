import LOG from './log'
import systemService from '@/service/api/newretail/systemService';
import subscribeService from '@/service/api/newretail/subscribeService';

interface TemplateConfig {
  id: string
  wxaTemplateId: string
  wxaTemplateType: string
  [key: string]: any
}

interface SubscribeResult {
  [key: string]: string
  errMsg: string
}

const SCENE = {
  /** 首页触发模板 */
  HOME: ["CUSTOM_SERVICE_NOTIFY", "ORDER_PAY_SUCCESS", "ORDER_SELF_NOTIFY", "COUPON_EXPIRE", "BALANCE_CHANGE", "SCORE_CHANGE", "ORDER_PAY"],
  /** 拼团页面点击分享按钮触发模板 */
  GROUP_ORDER: ["TEAM_ORDER_COMPLETE", "ORDER_SELF_NOTIFY", "REFUND_SUCCESS"],
  /** 砍价实例详情页点击分享按钮触发模板 */
  BARGIN: ["CUSTOM_SERVICE_NOTIFY", "BARGIN_SUCCESS"],
  /** 订单支付成功触发模板 */
  ORDER_PAY_SUCCESS: ["ORDER_SELF_NOTIFY", "ORDER_SHIP", "ORDER_FINISH", "ORDER_CONFIRM"],
  /** 抽奖实例点击分享按钮触发模板 */
  RAFFLE_PRIZED: ["CUSTOM_SERVICE_NOTIFY", "RAFFLE_PRIZED_NOTIFY"],
  /** 订单申请退款触发模板 */
  REFUND: ["REFUND_SUCCESS"]
}

/**
 * 查询订阅消息模板id
 */
function getTemplateIds(): Promise<TemplateConfig[]> {
  const app = getApp()
  return new Promise(function (resolve, reject) {
    if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
      LOG.info("查询模板id报错：当前用户未登录")
      resolve([])
      return
    }
    
    systemService.getTemplateIds().then((res: TemplateConfig[]) => {
      LOG.info("systemService.getTemplateIds:", res)
      app.globalData.templateIdsQuery = 1
      if (res) {
        app.globalData.templateIds = res
        uni.setStorage({
          key: 'wj_templateIds',
          data: res
        })
        resolve(res)
      } else {
        resolve([])
      }
    }).catch((err: any) => {
      app.globalData.templateIdsQuery = 1
      LOG.info("查询模板id报错：", err.message)
      reject([])
    })
  })
}

/**
 * 根据类型获取模板ID列表
 * @param types 模板类型数组
 * @param ids 模板ID数组
 */
function handleTemplateIds(types?: string[], ids?: string[]): string[] {
  const app = getApp()
  const tempList: string[] = []
  const templateIds: TemplateConfig[] = app.globalData.templateIds || []
  
  types = types || []
  ids = ids || []
  
  LOG.info("订阅消息模板id集合:", app.globalData.templateIds)
  
  if ((types.length > 0 || ids.length > 0) && templateIds.length > 0) {
    if (types.length > 0) {
      types.forEach(ele => {
        const item = templateIds.find(i => i.wxaTemplateType === ele)
        if (item && item.wxaTemplateId) {
          tempList.push(item.wxaTemplateId)
        }
      })
    } else if (ids.length > 0) {
      ids.forEach(ele => {
        const item = templateIds.find(i => i.id === ele)
        if (item && item.wxaTemplateId) {
          tempList.push(item.wxaTemplateId)
        }
      })
    }
  }
  
  return tempList
}

/**
 * 根据类型获取模板配置列表
 * @param types 模板类型数组
 * @param ids 模板ID数组
 */
function getTemplateIdsByTypes(types?: string[], ids?: string[]): TemplateConfig[] {
  const app = getApp()
  const tempList: TemplateConfig[] = []
  const templateIds: TemplateConfig[] = app.globalData.templateIds || []
  
  types = types || []
  ids = ids || []
  
  LOG.info("订阅消息模板id集合:", app.globalData.templateIds)
  
  if ((types.length > 0 || ids.length > 0) && templateIds.length > 0) {
    if (types.length > 0) {
      types.forEach(ele => {
        const item = templateIds.find(i => i.wxaTemplateType === ele)
        if (item) {
          tempList.push(item)
        }
      })
    } else if (ids.length > 0) {
      ids.forEach(ele => {
        const item = templateIds.find(i => i.id === ele)
        if (item) {
          tempList.push(item)
        }
      })
    }
  }
  
  return tempList
}

/**
 * 记录用户订阅
 * @param scene 场景类型
 * @param result 订阅结果
 */
function addSubscribe(scene: string[], result: SubscribeResult): void {
  const app = getApp()
  const templateIds = getTemplateIdsByTypes(scene)
  const templateConfigIds: string[] = []
  
  if (templateIds.length > 0 && result.errMsg.indexOf("ok") > 0) {
    templateIds.forEach(ele => {
      if (result[ele.wxaTemplateId] != null && result[ele.wxaTemplateId] === "accept") {
        templateConfigIds.push(ele.id)
      }
    })
  }
  
  if (templateConfigIds.length > 0 && app.globalData.userInfo?.member) {
    const memberId = app.globalData.userInfo.member.id
    const postData = {
      memberId: memberId,
      templateConfigIds: templateConfigIds
    }
    
    subscribeService.add(postData).then(() => {
      // 接口调用成功
    }).catch((err: any) => {
      // 接口调用失败
      LOG.info("记录用户订阅报错：", err.message)
    })
  }
}

export default {
  scene: SCENE,
  getTemplateIds,
  handleTemplateIds,
  getTemplateIdsByTypes,
  addSubscribe
}