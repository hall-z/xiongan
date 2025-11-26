import {
  getUserLoginInfo,
  setBankcardPayCode,
  toPayCodeVerify,
  toVerifySmsCode,
} from '@/service/api/userMessage'
import { useRequest } from 'alova/client'

// 修改支付密码前置
const { loading: payCodeLoading, send: sendPayCode } = useRequest((data) => toPayCodeVerify(data), {
  immediate: false,
  loading: false,
})

// 更新额度/初始密码/重置密码
const {
  send: sendBankcardPayCode,
  data: setBankcardPayCodeData,
  loading: setBankcardPayCodeLoading,
} = useRequest((data) => setBankcardPayCode(data), {
  immediate: false,
  loading: false,
  initialData: [],
})

// 校验通过后的操作
const { send: sendVerifySmsCode, data: verifySmsCodeData } = useRequest(
  (data) => toVerifySmsCode(data),
  {
    immediate: false,
    loading: false,
  },
)

// 获取用户信息
const { send: sedUserInfo, data: userInfoData } = useRequest(() => getUserLoginInfo(), {
  immediate: false,
  loading: false,
})

export default () => {
  return {
    payCodeLoading,
    sendPayCode,
    sedUserInfo,
    userInfoData,
    sendBankcardPayCode,
    setBankcardPayCodeData,
    setBankcardPayCodeLoading,
    sendVerifySmsCode,
    verifySmsCodeData,
  }
}
