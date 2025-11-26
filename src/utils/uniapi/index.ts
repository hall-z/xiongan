import { Constant } from '@/enums/constant'
import { ResultEnum } from '@/enums/httpEnum'
import { orderPayment } from '@/service/api/shop'
import { Modal, Toast } from './prompt'

const { VITE_HALF_APPID, VITE_APP_HSS_VERSION } = import.meta.env
/**
 * @description: 打开第三方小程序
 * @param {} appId
 * @param {} path
 */
export const openWxChart = (appId: string, path: string, extraData = {}) => {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    plus.share.getServices(
      (data: any) => {
        let sweixin = null
        data.forEach((item: any) => {
          if (item.id === 'weixin') {
            sweixin = item
          }
        })
        if (sweixin) {
          // 跳转到微信小程序
          sweixin.launchMiniProgram({
            id: appId, // 微信小程序原生id
            path,
            // 可取值：0-正式版； 1-测试版； 2-体验版。默认值为0。
            type: 0, // 微信小程序版本类型，
          })
        } else {
          uni.showToast({
            title: '请安装微信',
            icon: 'none',
          })
        }
        resolve(data)
      },
      (err) => {
        console.log('跳转失败')
        reject(err)
      },
    )
    // #endif
    // #ifdef MP-WEIXIN
    uni.navigateToMiniProgram({
      appId,
      path,
      extraData, // 需要传递给目标小程序的数据
      envVersion: 'release', // trial
      success(res) {
        // 打开成功
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
    // #endif
    // #ifdef MP-ALIPAY
    Modal({
      title: '当前环境不支持打开微信小程序',
    })
    // #endif
  })
}

/**
 * @description: APP打开微信小程序
 * @param {} appId
 * @param {} path
 */

/**
 * @description: 打开第三方小程序(半屏)
 * @param {} appId
 * @param {} path
 */
export const openEmbeddedMiniProgram = (path: string, extraData = {}, appId = VITE_HALF_APPID) => {
  return new Promise((resolve, reject) => {
    uni.openEmbeddedMiniProgram({
      appId,
      path,
      extraData, // 需要传递给目标小程序的数据
      envVersion: VITE_APP_HSS_VERSION,

      // envVersion: 'trial', // trial

      // envVersion: 'release',
      success(res) {
        console.log('打开成功')
        // 打开成功
        resolve(res)
      },
      fail: (err) => {
        console.log('打开失败')
        reject(err)
      },
    })
  })
}

/**
 * @description 设置系统剪贴板的内容
 * @param data 需要设置的内容
 * @param showToast 配置是否弹出提示，默认弹出提示
 * @constructor
 */
export const SetClipboardData = <T>(data: T, showToast = true) => {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data,
      success: (res) => {
        resolve(res)
        if (showToast) {
          uni.showToast({
            title: '内容已复制到剪切板!',
            icon: 'none',
          })
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
/**
 * @description 获取系统剪贴板内容
 * @constructor
 */
export const GetClipboardData = () => {
  return new Promise((resolve, reject) => {
    uni.getClipboardData({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        uni.showToast({
          title: '内容获取失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

/**
 * rpx 换算为 px
 * @param upx
 */
export const rpx2px = (upx: number) => {
  return uni.upx2px(upx)
}

/**
 * px 换算为 rpx
 * @param px
 */
export const px2rpx = (px: number) => {
  return px / (uni.upx2px(100) / 100)
}

/**
 * @description:  扫码
 * @return {}
 */
export const useScancode = (options?: any) => {
  // 允许从相机和相册扫码
  return new Promise((resolve, reject) => {
    uni.scanCode({
      ...options,
      success: function (res) {
        console.log('扫码' + res)
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
}
/**
 * @description:  调用人脸识别
 * @param {} data
 * @return {}
 */
export const startFacialRecognitionVerify = (data) => {
  return new Promise((resolve, reject) => {
    uni.startFacialRecognitionVerify({
      ...data,
      checkAliveType: 1, // 屏幕闪烁(人脸核验的交互方式，默认0,读数字)
      success(res) {
        if (res.errCode === 0) {
          // 识别成功
          resolve(res)
        } else {
          if (res.errCode === 10011) {
            reject(new Error('验证中断'))
          } else {
            Toast('识别失败')
            reject(new Error('识别失败'))
          }
        }
      },
      complete(res) {
        console.log(res)
      },
      fail(err) {
        if (err.errMsg.indexOf('开发者工具暂时不支持') >= 0) {
          Toast('面部检测开发工具不支持，请使用真机调试！')
        }
        // Toast('识别失败')
        console.log('err', err)
        reject(new Error(err.errMsg))
      },
    })
  })
}

/**
 * @description: 获取登录凭证（code）
 * @return {}
 */
export const getLoginCode = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (wxres) {
        resolve(wxres.code)
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
}

/**
 * @description: 获取当前位置
 * @return {}
 */
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84', // 返回可以用于uni.openLocation的经纬度，默认为wgs84的gps坐标
      success: (res) => {
        console.log('当前位置的经度：' + res.longitude)
        console.log('当前位置的纬度：' + res.latitude)
        resolve(res)
      },
      fail: (err) => {
        // Toast('获取位置失败')
        reject(err)
      },
    })
  })
}

export const useSetScreenBrightness = (value?: number) => {
  return new Promise((resolve, reject) => {
    uni.setScreenBrightness({
      value,
      success: function () {
        resolve('success')
      },
    })
  })
}

export const usegetScreenBrightness = () => {
  return new Promise((resolve, reject) => {
    uni.getScreenBrightness({
      success: function (res) {
        resolve(res.value)
      },
    })
  })
}
export const useSetKeepScreenOn = (flog = false) => {
  // 保持屏幕常亮
  uni.setKeepScreenOn({
    keepScreenOn: flog,
  })
}

/**
 * @description: 文件下载
 * @return {}
 */

export const downSaveImage = (imgurl: string, isBase64 = false) => {
  uni.getSetting({
    success(res) {
      if (res.authSetting['scope.writePhotosAlbum']) {
        // 已授权，直接保存图片
        useSaveImageToPhotosAlbum(imgurl, isBase64)
      } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
        // 用户已拒绝授权，提示用户授权
        uni.showModal({
          title: '提示',
          content: '您未授权保存图片到相册，是否前往设置页面进行授权？',
          success: function (res) {
            if (res.confirm) {
              uni.openSetting({
                success: function (res) {
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    Toast('授权成功，开始下载')
                    useSaveImageToPhotosAlbum(imgurl, isBase64)
                  } else {
                    Toast('您未授权')
                  }
                },
              })
            } else if (res.cancel) {
              Toast('您取消了授权')
            }
          },
        })
      } else {
        // 用户第一次调用，调用授权接口
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            useSaveImageToPhotosAlbum(imgurl, isBase64)
          },
          fail() {
            Toast('授权失败，请稍后重试')
          },
        })
      }
    },
    fail(err) {
      console.log('🍭[err]:', err)
    },
  })
}

/**
 * @description: 保存图片到相册
 * @return {}
 */
export const useSaveImageToPhotosAlbum = (path: string, isBase64) => {
  const byte = !isBase64 ? path.slice(22) : path
  console.log('🍏[byte]:', byte)
  const fs = uni.getFileSystemManager() // 全局唯一的文件管理器
  const number = new Date().valueOf()
  const filePath = wx.env.USER_DATA_PATH + '/code' + number + '.jpg'
  fs.writeFile({
    filePath,
    data: byte,
    encoding: 'base64',
    success(res) {
      uni.saveImageToPhotosAlbum({
        // 保存为png格式到相册
        filePath,
        success: function (res) {
          console.log('🥜[res]:', res)
          uni.showToast({ title: '下载成功', icon: 'success' })
        },
        fail: function (err) {
          console.log(err)
        },
      })
    },
    complete: function (res) {
      console.log('🍵[fall==]:', res)
      uni.hideLoading()
    },
  })
}

/**
 * @description: 小程序调用支付
 * @return {}
 */
interface payProps {
  timeStamp: string
  nonceStr: string
  packageStr: string
  signType: string
  paySign: string
}

export const useRequestPayment = (data: payProps) => {
  return new Promise((resolve, reject) => {
    uni.requestPayment<any>({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        console.log('🍥[res]:', res)
        resolve(true)
      },
      fail: function (res) {
        console.log('🍭[res]:', res)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(false)
      },
      complete: function (res) {
        console.log('🍭[res]:', res)
      },
    })
  })
}

export const useToPhone = (phone: string, callBack?: () => void) => {
  if (!phone) return
  // #ifdef APP-PLUS
  if (Constant.APP_KEY_ANDROID === 'android') {
    // 拨打前先验证是否授权
    plus.android.requestPermissions(
      ['android.permission.CALL_PHONE'],
      function (resultObj) {
        let result = 0
        for (let i = 0; i < resultObj.granted.length; i++) {
          const grantedPermission = resultObj.granted[i]
          console.log('已获取的权限：' + grantedPermission)
          result = 1
        }
        for (let i = 0; i < resultObj.deniedPresent.length; i++) {
          const deniedPresentPermission = resultObj.deniedPresent[i]
          console.log('拒绝本次申请的权限：' + deniedPresentPermission)
          result = 0
        }
        for (let i = 0; i < resultObj.deniedAlways.length; i++) {
          const deniedAlwaysPermission = resultObj.deniedAlways[i]
          console.log('永久拒绝申请的权限：' + deniedAlwaysPermission)
          result = -1
        }
        console.log(result)
        if (result === 1) {
          uni.makePhoneCall({
            phoneNumber: phone, // 电话号码
            success(ress) {
              console.log('拨打电话成功', ress)
            },
            fail(err) {
              console.log('拨打电话失败', 'err', err)
            },
          })
        } else {
          // 权限为拒绝的时候，需要做的处理
          callBack()
        }
      },
      function (error) {
        console.log('申请权限错误：' + error.code + ' = ' + error.message)
      },
    )
  }
  // #endif
  // #ifndef APP-PLUS
  uni.makePhoneCall({
    phoneNumber: phone,
  })
  // #endif
}

export const useToLocation = (e: any) => {
  uni.openLocation({
    latitude: e.latitude * 1,
    longitude: e.longitude * 1,
    name: e.name,
    address: e.address,
  })
}

/**
 * @description: 支付宝获取手机号授权
 * @returns response: string
 */
export const useGetPhoneNumber = () => {
  return new Promise((resolve, reject) => {
    my.getPhoneNumber({
      success: (res) => {
        resolve(res.response)
      },
    })
  })
}

/**
 * @description: 支付宝获取登录凭证（code）
 * @return {}
 */
export const getLoginAlCode = () => {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      success: function (res) {
        console.log('🥤[res]:', res)
        resolve(res.authCode)
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
}

/**
 * @description: 支付宝人脸识别
 * @returns response: string
 */
export const useStartAPVerify = (data: { url: string; certifyId: string }) => {
  return new Promise((resolve, reject) => {
    // TODO: 获取certifyId
    my.startAPVerify({
      ...data,
      success: function (res) {
        console.log('success', res)
        resolve(res)
      },
      fail: function (res) {
        console.log('fail', res)
        reject(res)
      },
      complete: function (res) {
        console.log('complete', res)
      },
    })
  })
}

/**
 * @description: 统一处理支付宝支付情况
 * @returns response: string
 */
export function alPayMain(data: { encryptStr: string; mid: string; tid: string; openId: string }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { code, payRequest } = (await orderPayment(data)) as any
      if (code === ResultEnum.CODE) {
        const payProps = {
          timeStamp: payRequest.timeStamp,
          nonceStr: payRequest.nonceStr,
          packageStr: payRequest.package,
          signType: payRequest.signType,
          paySign: payRequest.paySign,
        }
        resolve(await useRequestPayment(payProps))
      }
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * @description: 预览图片组
 * @param {} data
 */

export function previewImage(imgArr: string[]) {
  uni.previewImage({
    urls: imgArr,
    // longPressActions: {
    //   itemList: ['发送给朋友', '保存图片'],
    //   success: function (data) {
    //     console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
    //   },
    //   fail: function (err) {
    //     console.log(err.errMsg)
    //   },
    // },
  })
}
