const statusList = ref([
  {
    label: '封存',
    value: '0',
    bg: 'background: #FCF4E7; color: #Ffff',
  },
  {
    label: '正常',
    value: '1',
    bg: 'background: #F0F9ED; color:#4EA833',
  },
  {
    label: '正式挂失',
    value: '2',
    bg: 'background: #FCF4E7; color: #Ffff',
  },
  {
    label: '正式挂失',
    value: '3',
    bg: 'background: #FCF4E7; color: #Ffff',
  },
  {
    label: '正式挂失',
    value: '4',
    bg: 'background: #FCF4E7; color: #Ffff',
  },
  {
    label: '正式挂失',
    value: '9',
    bg: 'background: #FCF4E7; color: ##F44D24',
  },
])

const adviceType = ref([
  {
    label: '投诉',
    value: '0',
  },
  {
    label: '建议',
    value: '1',
  },
  {
    label: '其他',
    value: '2',
  },
])

export default () => {
  return {
    statusList,
  }
}
