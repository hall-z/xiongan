import { useUserStore } from '@/store'
import { dataDesensitization } from '@/utils'
const { userInfo } = useUserStore()
const baseData = {
  name: userInfo.cardName, // 姓名
  idCardNumber: userInfo.idCardNumber, // 身份证号
  id: 1,
  title: '国家为困难用户发放生活补助金',
  date: '2022-11-11',
  bank: '中国银行',
  money: '1000',
}
const list = [
  {
    name: userInfo.cardName, // 姓名
    idCardNumber: dataDesensitization(userInfo.idCardNumber, false, 'last'), // 身份证号
    id: 1,
    title: '国家为困难用户发放生活补助金',
    date: '2022-11-11',
    bank: '中国银行',
    money: '1000',
    type: '收入',
    status: '已支付',
    account: '6222020202020202020',
  },
  {
    name: userInfo.cardName, // 姓名
    idCardNumber: dataDesensitization(userInfo.idCardNumber, false, 'last'), // 身份证号
    id: 1,
    title: '国家为困难用户发放生活补助金',
    date: '2022-11-11',
    bank: '中国银行',
    money: '1000',
    type: '收入',
    status: '已支付',
    account: '6222020202020202020',
  },
  {
    name: userInfo.cardName, // 姓名
    idCardNumber: dataDesensitization(userInfo.idCardNumber, false, 'last'), // 身份证号
    id: 1,
    title: '国家为困难用户发放生活补助金',
    date: '2022-11-11',
    bank: '中国银行',
    money: '1000',
    type: '收入',
    status: '已支付',
    account: '6222020202020202020',
  },
]
const labelList = [
  {
    label: '状态',
    prop: 'status',
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '身份证号',
    prop: 'idCardNumber',
  },
  {
    label: '发放项目',
    prop: 'title',
  },
  {
    label: '银行名称',
    prop: 'bank',
  },
  {
    label: '发放账户',
    prop: 'account',
  },
  {
    label: '金额',
    prop: 'money',
    color: 'red',
  },
]
export default () => {
  return {
    list,
    baseData,
    labelList,
  }
}
