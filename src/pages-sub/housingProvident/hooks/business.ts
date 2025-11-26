import {
  getGgXxGrjbxxInfo,
  getZhMxGrywmxxxInfo,
  getZhXxGrzhxxInfo,
  getSzzfgjjDkMxDkhkmxInfo,
  getDkXxDksqxxInfo,
} from '@/service/api/housing'
import { List } from '@/service/model/baseModel'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
const housingInfo: any = ref({})
// 个人业务明细
const { send: sendZhMxGrywmxxxInfo, data: businessData } = useRequest(
  (data) => getZhMxGrywmxxxInfo<List>(data),
  {
    immediate: false,
    loading: false,
  },
)

// 个人基本信息
const { send: sendGgXxGrjbxxInfo, data: housData } = useRequest(
  (data) => getGgXxGrjbxxInfo<List>(data),
  {
    immediate: false,
    loading: false,
  },
)

// 个人基本信息2
const { send: sendZhXxGrzhxxInfo, data: accountData } = useRequest(
  (data) => getZhXxGrzhxxInfo<List>(data),
  {
    immediate: false,
    loading: false,
  },
)

// 个人贷款还款明细查借款编号
const { send: sendDkXxDksqxxInfo, data: loanData } = useRequest(
  (data) => getDkXxDksqxxInfo<List>(data),
  {
    immediate: false,
    loading: false,
  },
)

// 个人贷款还款明细
const { send: sendSzzfgjjDkMxDkhkmxInfo, data: repaysData } = useRequest(
  (data) => getSzzfgjjDkMxDkhkmxInfo<List>(data),
  {
    immediate: false,
    loading: false,
  },
)
export default () => {
  return {
    sendZhMxGrywmxxxInfo,
    sendGgXxGrjbxxInfo,
    sendZhXxGrzhxxInfo,
    sendSzzfgjjDkMxDkhkmxInfo,
    sendDkXxDksqxxInfo,
    loanData,
    accountData,
    businessData,
    housData,
    housingInfo,
    repaysData,
  }
}
