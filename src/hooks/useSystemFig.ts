import { captchaConfig, getDot, getResponseConfig } from '@/service/api/system'
import { useSystemStore } from '@/store/modules/system'
import { changeRes } from '@/utils/aes/encryptUtils'
export default (inifConfig?: boolean) => {
  // 获取系统配置
  const systemStore = useSystemStore()
  const {
    data: captchaConfigData,
    onSuccess: sysConfigSuccess,
    onError: sysError,
    send: sysConfig,
  } = captchaConfig({
    immediate: inifConfig,
    force: inifConfig,
    loading: false,
  })

  sysConfigSuccess((data: any) => {
    const newData = { ...data.data.data.data }
    const code = changeRes(data.data, newData.paramId)
    newData.paramId = code

    systemStore.fILTERDATA(newData)
  })

  // 处理加密
  const { onSuccess: getDotSuccess, send: sysDot } = getDot({
    immediate: inifConfig,
    loading: false,
  })
  getDotSuccess((data: any) => {
    const code = changeRes(data.data, data.data.data.data)
    systemStore.DOT(code)
  })

  // 处理解密
  const { onSuccess: responseConfigSuccess, send: sysResponseConfig } = getResponseConfig({
    immediate: inifConfig,
    loading: false,
  })
  responseConfigSuccess((data: any) => {
    const code = changeRes(data.data, data.data.data.data.pubK)
    systemStore.RESSTRPPD(code)
  })
  // #ifndef  H5
  // FIX:支付宝小程序要手动触发请求 可能深层次 useRequest 状态的原因

  if (inifConfig) {
    sysConfig()
    sysDot()
    sysResponseConfig()
  }

  // #endif
}
