import { uploadPhoneInfo, uploadOCRInfo } from '@/service/api/cardServe'
import { useRequest } from 'alova/client'
import { pathToBase64 } from 'image-tools'

const {
  loading: loadingPhoto,
  send: sendPhoto,
  onSuccess: photoSucess,
} = useRequest((data) => uploadPhoneInfo(data), {
  immediate: false,
  loading: false,
})
const {
  loading: loadingOCR,
  send: sendOCR,
  onSuccess: ocrSucess,
} = useRequest((data) => uploadOCRInfo(data), {
  immediate: false,
  loading: false,
})

export const upLoadImg = () => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],

      success: async (res) => {
        if (res.tempFiles[0].size > 1024 * 80) {
          return resolve('图片大小不能超过80KB')
        }

        const photoBase64 = await pathToBase64(res.tempFilePaths[0])
        const data = {
          photoBase64,
          url: res.tempFilePaths[0],
        }
        return resolve(data)
      },
    })
  })
}

// 计算base64编码图片大小
export const getBase64ImageSize = (base64) => {
  if (base64) {
    base64 = base64.split(',')[1].split('=')[0]
    const strLength = base64.length
    const fileLength = strLength - (strLength / 8) * 2
    return Math.floor(fileLength)
  } else {
    return 0
  }
}

export default () => {
  return {
    upLoadImg,
    sendPhoto,
    loadingPhoto,
    sendOCR,
    loadingOCR,
  }
}
