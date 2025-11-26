import { appUpdateRealName } from '@/service/api/auth'
import { useUserStore } from '@/store/user'
import { dataDesensitization } from '@/utils/index'
import { storeToRefs } from 'pinia'
import { f } from 'vite/dist/node/types.d-aGj9QkWt'

const { isLogined, userInfo, realNamePlugin, pluginStatus, isRealSataus } =
  storeToRefs(useUserStore())

export default async function realName(callback: any) {
  return realNamePlugin.value.doDigitalIdentityQuickLogin({ actionNumber: 2 }, (data) => {
    console.log('数字身份登录完毕', data)
    const { openId } = JSON.parse(data)

    return realNamePlugin.value.getDataByAuth({ openId, ruleIds: 10306 }, (res) => {
      console.log('获取用户信息', res)
      const arr = Object.values(JSON.parse(res).getData)
      const param = {
        userPhone: arr[1],
        cardCode: arr[0],
        cardName: arr[3],
        numberOpenId: openId,
      }
      if (openId !== undefined) {
        uni.showLoading({ title: '认证成功' })
        if (callback) {
          const res = true
          callback(res)
        }
      } else {
        uni.showLoading({ title: '认证失败' })
        if (callback) {
          const res = false
          callback(res)
        }
      }
    })
  })
}
// const updateRealName = (data) => {
// 	appUpdateRealName(data).then(async (res) => {
// 		console.log('更新实名认证', res)
// 		if (res) {
// 			const newData = {
// 				idCardNumber: data.cardCode,
// 				cardName: data.cardName,
// 				cardId: res,
// 			}
// 			uni.showLoading({ title: '认证成功' })
// 			await resultData({ ...userInfo.value, ...newData }, 0)
// 		}
// 	})
// }
