import wxaUserService from '@/service/api/newretail/wxaUserService';
import memberService from '@/service/api/newretail/memberService';
import distributionService from '@/service/api/newretail/distributionService';
import auth from './auth'
import util from './utils'
import ADDRESS from './address'
import NAVPAGE from './navPage'

// 获取应用实例
const app = getApp()

interface BindMobileResult {
  success: boolean
  message?: string
}

interface AuthorizeResult {
  member?: any
  wxaUser?: any
}

const AUTHORIZE = {
  /**
   * 获取用户信息注册成为粉丝
   */
  login: function (e?: any): Promise<AuthorizeResult> {
    const self = this
    return new Promise(function (resolve, reject) {
      wxaUserService.login(true).then((res: AuthorizeResult) => {
        auth.setUser(res)
        app.globalData.userInfo = res && res.member ? res : null
        if (res.member) {
          auth.getDistributor()
          auth.bindDistribution()
          uni.setStorage({
            key: "wj_member",
            data: res.member
          })
          // 如果是会员记录会员访问门店
          if (app.globalData.storeInfo) {
            self.recordVisitStore(app.globalData.storeInfo.id)
          }
        }
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  },

  /**
   * 获取用户手机号并绑定
   */
  bindMobileByEncrypt: function (e: any): Promise<BindMobileResult> {
    const self = this
    return new Promise(function (resolve, reject) {
      let storeId = ''
      if (e.detail.errMsg.indexOf("ok") >= 0) {
        if (app.globalData.storeInfo) {
          if (app.globalData.systemConfigure.memberAscriptionStoreDistance && app.globalData.storeInfo.distance) {
            let distance = app.globalData.storeInfo.distance
            distance = parseFloat(distance * 1000)
            if (distance < app.globalData.systemConfigure.memberAscriptionStoreDistance) {
              storeId = app.globalData.storeInfo.id
            }
          }
        }
        let sceneFormActive = uni.getStorageSync('wj_sceneFormActive')
        if (sceneFormActive) {
          storeId = sceneFormActive
        }
        wxaUserService.bindMobileByEncrypt(e.detail.encryptedData, e.detail.iv, 'WXAPP', storeId).then((res: any) => {
          // 如果是会员记录会员访问门店
          if (app.globalData.storeInfo) {
            self.recordVisitStore(app.globalData.storeInfo.id)
          }
          auth.bindDistribution()
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      } else {
        let err = {
          message: '获取手机号失败，即将跳转到手动绑定手机号'
        }
        reject(err)
      }
    })
  },

  /**
   * 获取用户到门店的距离
   * @param stores 门店信息
   * @param latitude 用户纬度
   * @param longitude 用户经度
   */
  calcStoreDistance: function (stores: any, latitude: number, longitude: number): void {
    let dis = util.distance(latitude, longitude, stores.latitude, stores.longitude)
    let store = {
      ...stores,
      distance: dis
    }
    app.globalData.storeInfo = store
  },

  // 记录会员访问门店
  recordVisitStore: function (storeId: string): void {
    if (app.globalData.systemConfigure.enableRecordVisitStore) {
      memberService.visitStore(storeId).then((res: any) => {
        console.log(res)
      }).catch((e: any) => {
        console.log(e.message)
      })
    }
  }
}

export default AUTHORIZE