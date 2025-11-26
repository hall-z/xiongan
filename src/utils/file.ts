import isEmpty from 'lodash-es/isEmpty'
import { isArray, isString } from 'wot-design-uni/components/common/util'

interface rightUlrOption {
  key?: boolean // 标志
  baseUrl?: string // 基础前缀
  matchCharacters?: string // 分割字符
}

/**
 * @description: 拼接图片地址
 * @param {} data 图片list
 * @param {} url 前缀
 * @return {} []
 */
export const changeDefaultFileList = (data: string | Array<any>, url: string) => {
  let a: string[] = []
  if (isEmpty(data)) {
    return a
  }
  if (isString(data)) {
    a = data.split(',')
  }
  if (isArray(data)) {
    a = data
  }
  return a.map((item) => {
    return url + item
  })
}

/**
 * @description: 转换出当前系统正确的文件地址
 * @param {} data 原始文件数据
 * @instance {} rightUlrOption  额外参数
 * @return {} src
 */
export function rightFileUrl(data: string, option?: rightUlrOption) {
  const baseUrl = option?.baseUrl || import.meta.env.VITE_FILE_BASRURL
  const str = option?.matchCharacters || 'XXXXXX'
  if (!data) return ''
  if (option?.key) {
    return `${baseUrl}${data}`
  }
  return data.replace(str, `${baseUrl}`)
}

/**
 * @description:  上传后最后返回的文件字符串
 * @param {} data 文件组
 * @param {} key 文件key
 * @return {} url
 */
export const changeUploadUrl = (data: Array<any>, key?: string) => {
  const str = ''
  if (isEmpty(data)) {
    return str
  } else {
    const arr = []
    data.forEach((i: any, index) => {
      if (i.response) {
        const p = JSON.parse(i.response)
        arr.push(key ? p.data[key] : p.data)
      } else {
        arr.push(i.name)
      }
    })

    // 最后删除空数据

    return arr.join(',')
  }
}

export function getprifileImg(data) {
  return new Promise((resolve) => {
    // getprifile(data).then((res) => {

    //   const arrayBuffer = new Uint8Array(res.data)
    //   let base64 = "data:image/png;base64," + uni.arrayBufferToBase64(arrayBuffer)
    //   resolve(base64)
    // }).catch(err => {
    //   resolve(err)
    // })
    const url = `${import.meta.env.VITE_FILE_BASRURL}${data}`

    resolve(url)
  })
}

// this.listData.map(async (e) => {
//   e.items.forEach((element) => {

//     await getprifile({ path: e.shopLogoUrl }).then((res) => {
//       let blob = new Blob([res]);
//       e.shopLogoUrl = window.URL.createObjectURL(blob);
//     });

//   return e;
// });
// const initModelValues = () => {
//   // TODO: 待处理图片为空的情况
//   const arr = props.modelValue.split(',')
//   let narr = []
//   narr = arr.map((item) => {
//     return {
//       url: item,
//       name: item,
//       meta: { url: item, name: item },
//     }
//   })

//   nextTick(() => {
//     narr.map(async (item) => {
//       item.url = await getprifileImg(item.url)
//       return item
//     })

//     fileList.value = narr
//   })
// }
