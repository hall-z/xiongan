// 推广中心

const rules = {
  phone: [
    {
      required: true,
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

const statusList = ref([
  {
    label: '已申领',
    value: 1,
    color: '#3ca143',
    bgColor: '#f1f6f2',
  },
  {
    label: '处理中',
    value: 0,
    color: '#ffa000',
    bgColor: '#f6f1f1',
  },
])

export default () => {
  return {
    rules,
    statusList,
  }
}
