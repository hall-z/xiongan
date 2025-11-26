import { useRequest } from 'alova/client'
import {
  saveOrUpdateCourseRegist,
  getCourseRegistByList,
  getValByTypeCode,
} from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { isValidAddress, isValidAge, isValidPhone, testUserName, isValidName } from '@/utils'
const { userInfo } = useUserStore()
const rulesOther = {
  courseTitle: [{ required: true, message: '请选择课程名称' }],
  courseUser: [
    { required: true, message: '请输入姓名' },
    {
      required: true,
      message: '请输入正确的姓名',
      validator: (val) => {
        if (!isValidName(val)) {
          return Promise.reject(new Error('请输入正确的姓名'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
  age: [
    { required: true, message: '请输入年龄' },
    {
      required: true,
      message: '年龄格式不正确',
      validator: (val) => {
        if (!isValidAge(val)) {
          return Promise.reject(new Error('年龄格式不正确'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
  address: [
    { required: true, message: '请输入住址' },
    {
      required: true,
      message: '请输入正确的住址，不支持特殊字符且字数限制为5到70个字',
      validator: (val) => {
        if (!isValidAddress(val)) {
          return Promise.reject(new Error('请输入正确的住址，不支持特殊字符且字数限制为5到70个字'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
  phone: [
    { required: true, message: '请输入手机号码' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    // {
    //   required: true,
    //   message: '手机号码格式不正确',
    //   validator: (val) => {
    //     return isValidPhone(val)
    //   },
    // },
  ],
}

const { send: sendSaveCourseRegist } = useRequest((data) => saveOrUpdateCourseRegist(data), {
  immediate: false,
  loading: false,
})

const { send: sendGetCourseRegist } = useRequest((data) => getCourseRegistByList(data), {
  immediate: false,
  loading: false,
})

const { send: sendCetValByTypeCode } = useRequest((data) => getValByTypeCode(data), {
  immediate: false,
  loading: false,
})

export { rulesOther, sendSaveCourseRegist, sendGetCourseRegist, sendCetValByTypeCode }
