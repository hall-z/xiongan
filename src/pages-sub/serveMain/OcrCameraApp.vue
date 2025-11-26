<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  // needLogin: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>
<script lang="ts" setup>
import { getCheckToZjz } from '@/service/api/cardServe'
import { useUserStore } from '@/store'
import { useRequest } from 'alova/client'
import { getCurrentInstance, onMounted } from 'vue' // eslint-disable-line
import { useMessage, useToast } from 'wot-design-uni'
import useCardBhk from './hooks/useCardBhk'
import useUpload from './hooks/useUpload'
import permision from './types/l-painter/permission'
import { pathToBase64 } from './types/l-painter/utils'
import { Camera } from './types/types'

const userStore = useUserStore()
const { userInfo } = userStore
const { sendCardToken } = useCardBhk()
const message = useMessage('carmalert')
const { sendPhoto, loadingPhoto, sendOCR } = useUpload()
const toast = useToast()
const cover = ref(null) // 辅助
const camera = ref(null)
const cameraContext = ref(null)
const copSrc = ref<any>(null) // 截图
const eventChannel = ref(null)

const dataList = ref<Camera[]>([
  {
    title: '人脸正面照片',
    imgType: 0,
    devicePosition: 'front',
    width: 358,
    height: 441,
    cameraWidth: 358,
  },
  {
    title: '身份证国徽面',
    imgType: 1,
    devicePosition: 'back',
    width: 300, // 左边裁掉18，右边裁掉32
    height: 474,
    cameraWidth: 350,
  },
  {
    title: '身份证人像面',
    imgType: 2,
    devicePosition: 'back',
    width: 300,
    height: 474,
    cameraWidth: 350,
  },
  {
    title: '代办人身份证国徽面',
    imgType: 3,
    devicePosition: 'back',
    width: 300,
    height: 474,
    cameraWidth: 350,
  },
  {
    title: '代办人身份证人像面',
    imgType: 4,
    devicePosition: 'back',
    width: 300,
    height: 474,
    cameraWidth: 350,
  },
  {
    title: '户口本首页',
    imgType: 5,
    devicePosition: 'back',
    width: 300,
    height: 474,
    cameraWidth: 350,
  },
  {
    title: '户口本本人页',
    imgType: 6,
    devicePosition: 'back',
    width: 300,
    height: 474,
    cameraWidth: 350,
  },
])

const currentParams = ref(null)
const camerType = ref<number>()
const currData = ref<Camera>({
  title: '人脸正面照片',
  imgType: -1,
  devicePosition: 'front',
  width: 358,
  height: 441,
})

let offsetLeft = 18
let transCanvas: any = {}
// 获取token
const cardToken: any = ref('')
const getToken = async () => {
  const res: any = await sendCardToken()
  cardToken.value = res.data
  console.log('🍷[ressendCardToken]:', res)
}
function getTransCanvas() {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(getCurrentInstance())
    query
      .select('#targetSignature')
      .node((res) => {
        resolve(res.node)
      })
      .exec()
  })
}

onMounted(async () => {
  const instance = getCurrentInstance().proxy
  eventChannel.value = instance.getOpenerEventChannel()
  // 获取转换Canvas
  transCanvas = await getTransCanvas()
  console.log('🥒[transCanvas]:====', transCanvas)
})

onLoad(async (options: any) => {
  console.log('🥩[options]:', options)
  checkZjzInfo.value = options
  // if (options.photoType === '0') {
  //  await getToken()
  // }
  const { photoType, camerType: opcamerType } = options
  const imgType = photoType * 1

  currData.value = dataList.value.find((item) => {
    return item.imgType === imgType
  })
  camerType.value = opcamerType || photoType * 1
  currentParams.value = {
    ...options,
  }

  // 如果是头像图片则无需偏移
  if (currData.value.imgType === 0) {
    offsetLeft = 0
  } else {
    offsetLeft = 18
  }
  console.log('🍵[currData]:', currData.value)
  androidCameraPermiss()
})

// 生成截图
function loadTempImagePath(url) {
  return new Promise((resolve, reject) => {
    const { windowWidth, windowHeight } = uni.getSystemInfoSync()
    console.log('[windowWidth, windowHeight ]:', windowWidth, windowHeight, currData.value)
    const { width, height, cameraWidth } = currData.value

    let left = (windowWidth - cameraWidth) / 2
    left = left + offsetLeft
    left = left < 0 ? 0 : left
    let top = (windowHeight - height) / 2
    top = top < 0 ? 0 : top
    console.log('位置信息=============[left, top ]:', left, top)
    const testc = uni.createCanvasContext('myCanvas')
    testc.drawImage(url, 0, 0, windowWidth, windowHeight)
    testc.draw(false, () => {
      uni.canvasToTempFilePath({
        x: left,
        y: top,
        width,
        height,
        canvasId: 'myCanvas',
        fileType: 'jpg',
        quality: 0.5,
        complete: (res) => {
          console.log('🍜[res]:', res)
          resolve(res.tempFilePath)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  })
}

// 获取旋转后的图片
function getRotateImage(url, isRotate) {
  return new Promise((resolve, reject) => {
    const ctx = transCanvas.getContext('2d')
    const { width, height } = currData.value

    if (currData.value.imgType === 0 || !isRotate) {
      transCanvas.width = width
      transCanvas.height = height
      const image = transCanvas.createImage()
      image.onload = () => {
        ctx.drawImage(image, 0, 0, width, height)
        const rotatedSign = transCanvas.toDataURL('image/jpeg', 0.9)
        ctx.clearRect(0, 0, width, height)
        resolve(rotatedSign)
      }
      image.src = url
    } else {
      transCanvas.width = height
      transCanvas.height = width
      ctx.clearRect(0, 0, height, width)
      ctx.translate(0, width)
      ctx.rotate(-Math.PI / 2)
      const image = transCanvas.createImage()
      image.onload = () => {
        ctx.drawImage(image, 0, 0, width, height)
        const rotatedSign = transCanvas.toDataURL('image/jpeg', 0.9)
        ctx.clearRect(0, 0, height, width)
        resolve(rotatedSign)
      }
      image.src = url
    }
  })
}

// 裁切从相册选取的图片
function cutAlbumImage(url) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: (image) => {
        console.log('图片信息:=========', image)
        const { width, height } = image
        const destWidth =
          currData.value.imgType === 0 ? currData.value.width : currData.value.height // 除了头像，其他图片的宽高要倒置，此处不再旋转
        const destHeight =
          currData.value.imgType === 0 ? currData.value.height : currData.value.width

        // 根据目标图片比例，计算要裁切的图片的位置、宽度和高度
        let origWidth = 0
        let origHeight = 0

        const radioW = Math.round((destWidth * height) / destHeight)

        let cutLeft = 0
        let cutTop = 0

        // 如果等比例缩放宽度够
        if (radioW <= width) {
          origWidth = radioW
          origHeight = height
          cutLeft = (width - radioW) / 2
          cutTop = 0
        } else {
          // 如果等比例缩放高度够
          const radioH = Math.round((destHeight * width) / destWidth)

          origWidth = width
          origHeight = radioH
          cutLeft = 0
          cutTop = (height - radioH) / 2
        }

        console.log(
          '位置信息[origWidth, origHeight, left, top, cutWidth, cutHeight]:',
          origWidth,
          origHeight,
          cutLeft,
          cutTop,
          destWidth,
          destHeight,
        )

        const ctx = transCanvas.getContext('2d')

        transCanvas.width = destWidth
        transCanvas.height = destHeight

        ctx.clearRect(0, 0, destWidth, destHeight)

        const imageCut = transCanvas.createImage()

        imageCut.onload = () => {
          ctx.drawImage(
            imageCut,
            cutLeft,
            cutTop,
            origWidth,
            origHeight,
            0,
            0,
            destWidth,
            destHeight,
          )
          const cutDataUrl = transCanvas.toDataURL('image/jpeg', 0.9)
          ctx.clearRect(0, 0, destWidth, destHeight)
          resolve(cutDataUrl)
        }
        imageCut.src = url
      },
      fail: (error) => {
        console.log('error:', error)
        reject(new Error('获取图片信息错误'))
      },
    })
  })
}

// 旋转裁切后的图片
function rotateAlbumImage(url) {
  return new Promise((resolve, reject) => {
    const ctx = transCanvas.getContext('2d')
    const { width, height } = currData.value

    transCanvas.width = width
    transCanvas.height = height

    ctx.clearRect(0, 0, width, height)
    ctx.translate(width, 0)
    ctx.rotate(Math.PI / 2)

    const image = transCanvas.createImage()

    image.onload = () => {
      ctx.drawImage(image, 0, 0, height, width)
      const rotatedDataUrl = transCanvas.toDataURL('image/jpeg', 0.9)
      ctx.clearRect(0, 0, height, height)
      resolve(rotatedDataUrl)
    }
    image.src = url
  })
}

// 获取图片信息
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: (image) => {
        console.log('图片信息:=========', image)
        const { width, height } = image
        resolve(image)
      },
      fail: (error) => {
        console.log('error:', error)
        reject(new Error('获取图片信息错误'))
      },
    })
  })
}

// 将图片转换为Base64编码
function transImageToDataUrl(url, width, height) {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery()

    query
      .select('#targetSignature')
      .node((res) => {
        const canvas = res.node
        const ctx = canvas.getContext('2d')

        canvas.width = width
        canvas.height = height

        const image = canvas.createImage()

        image.onload = () => {
          ctx.drawImage(image, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
          ctx.clearRect(0, 0, width, height)
          resolve(dataUrl)
        }
        image.src = url
      })
      .exec()
  })
}

// 从相册选取
const chooseImage = (type: 'album' | 'camera') => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: [type],
    success: async (res) => {
      const rotateUrl = await pathToBase64(res.tempFilePaths[0])
      copSrc.value = rotateUrl
      // 上传
      upload(rotateUrl)
    },
  })
}

// 相机拍照
const takePhoto = () => {
  if (copSrc.value) {
    return false
  }

  cameraContext.value.takePhoto({
    id: 'camera',
    quality: 'high',
    success: async (res) => {
      console.log('🥪[res]:', res)
      // 截图
      const copUrl = await loadTempImagePath(res.tempImagePath)
      copSrc.value = copUrl
      const rotateUrl = await getRotateImage(copUrl, true)
      // 上传
      upload(rotateUrl)
    },
  })
}
// 证件照校验并剪裁
const checkZjzInfo: any = ref({})
const { send: sendCheckToZjz } = useRequest((data) => getCheckToZjz(data), {
  immediate: false,
  loading: false,
})
async function getCheckToZjzFun(url) {
  const params = {
    token: checkZjzInfo.value.cardToken,
    imgStr: url,
    imgType: 'jpeg',
    xm: userInfo.cardName,
    zjhm: userInfo.idCardNumber,
  }
  const res: any = await sendCheckToZjz(params)
  console.log('🍷[ressendCheckToZjz]:', res)
}
// upload
async function upload(ress) {
  toast.loading('正在上传中...')
  console.log('🍓[ress]currData.value.imgType:', currData.value.imgType)
  if (currData.value.imgType === 0) {
    await getToken()
    let url = ''
    const params = {
      token: cardToken.value,
      imgStr: ress,
      imgType: 'jpeg',
      xm: userInfo.cardName,
      zjhm: userInfo.idCardNumber,
    }
    try {
      const res: any = await sendCheckToZjz(params)
      url = res.data
      const formData = {
        photoType: currData.value.imgType.toString(),
        type: currentParams.value.type,
        zjhm: currentParams.value.zjhm, // '210204199207215655',
        photoBase64: url,
      }

      try {
        const resData: any = await sendPhoto(formData)
        console.log('🍰[resData]:', resData)
        let ocrData: any
        let ocrStatus: string = ''
        if (resData.code === '200') {
          if (
            currData.value.imgType === 0 ||
            currData.value.imgType === 5 ||
            currData.value.imgType === 6
          ) {
            const hkbInfo = {
              type: currentParams.value.photoType * 1,
              id: resData.data.id,
              url,
            }
            toast.close()
            close()
            return eventChannel.value.emit('hkbInfo', {
              hkbInfo,
            })
          }

          ocrData = await sendOCR(formData)
          console.log('🍒[ocrData]:', ocrData)
          switch (ocrData.data.image_status) {
            case 'normal':
              ocrStatus = '识别正常'
              break
            case 'reversed_side':
              ocrStatus = '身份证正反面颠倒'
              break
            case 'non_idcard':
              ocrStatus = '上传的图片中不包含身份证'
              break
            case 'blurred':
              ocrStatus = '身份证模糊'
              break
            case 'other_type_card':
              // ocrStatus = '其他类型证照'
              ocrStatus = ''
              break
            case 'over_exposure':
              ocrStatus = '身份证关键字段反光或过曝'
              break
            case 'over_dark':
              ocrStatus = '身份证欠曝（亮度过低）'
              break
            case 'unknown':
              // ocrStatus = '未知状态'
              ocrStatus = ''
              break
          }
        }
        toast.close()
        console.log('ocrData.image_status: ', ocrData.data.image_status)
        if (ocrData.data.image_status === 'normal') {
          if (ocrData.data.direction !== 0) {
            return message.alert({
              msg: '照片方向错误，请重新上传！',
              title: '提示',
              closeOnClickModal: false,
            })
          }
          const cameraData = {
            type: currentParams.value.photoType * 1,
            url: ress,
            id: resData.data.id,
            data: currData.value.imgType === 0 ? {} : (ocrData.data ?? '{}'), // 识别信息
          }
          eventChannel.value.emit('camera', {
            cameraData,
          })
          close()
        } else {
          message.alert({
            msg: ocrStatus + '\n 上传的照片不符合要求，请重新上传！',
            title: '提示',
            closeOnClickModal: false,
          })
          // close()
        }
      } catch (error) {
        toast.close()
        message.alert(error?.data?.msg ?? '图片上传失败，请您确保图片格式正确!')
      }
    } catch (error) {
      toast.close()
      message.alert(error?.data?.msg ?? '图片上传失败，请您确保图片格式正确!')
    }
  } else {
    const formData = {
      photoType: currData.value.imgType.toString(),
      type: currentParams.value.type,
      zjhm: currentParams.value.zjhm, // '210204199207215655',
      photoBase64: ress,
    }

    try {
      const resData: any = await sendPhoto(formData)
      console.log('🍰[resData]:', resData)
      let ocrData: any
      let ocrStatus: string = ''
      if (resData.code === '200') {
        if (
          currData.value.imgType === 0 ||
          currData.value.imgType === 5 ||
          currData.value.imgType === 6
        ) {
          const hkbInfo = {
            type: currentParams.value.photoType * 1,
            id: resData.data.id,
            url: ress,
          }
          toast.close()
          close()
          return eventChannel.value.emit('hkbInfo', {
            hkbInfo,
          })
        }

        ocrData = await sendOCR(formData)
        console.log('🍒[ocrData]:', ocrData)
        switch (ocrData.data.image_status) {
          case 'normal':
            ocrStatus = '识别正常'
            break
          case 'reversed_side':
            ocrStatus = '身份证正反面颠倒'
            break
          case 'non_idcard':
            ocrStatus = '上传的图片中不包含身份证'
            break
          case 'blurred':
            ocrStatus = '身份证模糊'
            break
          case 'other_type_card':
            // ocrStatus = '其他类型证照'
            ocrStatus = ''
            break
          case 'over_exposure':
            ocrStatus = '身份证关键字段反光或过曝'
            break
          case 'over_dark':
            ocrStatus = '身份证欠曝（亮度过低）'
            break
          case 'unknown':
            // ocrStatus = '未知状态'
            ocrStatus = ''
            break
        }
      }
      toast.close()
      console.log('ocrData.image_status: ', ocrData.data.image_status)
      if (ocrData.data.image_status === 'normal') {
        if (ocrData.data.direction !== 0) {
          return message.alert({
            msg: '照片方向错误，请重新上传！',
            title: '提示',
            closeOnClickModal: false,
          })
        }
        const cameraData = {
          type: currentParams.value.photoType * 1,
          url: ress,
          id: resData.data.id,
          data: currData.value.imgType === 0 ? {} : (ocrData.data ?? '{}'), // 识别信息
        }
        eventChannel.value.emit('camera', {
          cameraData,
        })
        close()
      } else {
        message.alert({
          msg: ocrStatus + '\n 上传的照片不符合要求，请重新上传！',
          title: '提示',
          closeOnClickModal: false,
        })
        // close()
      }
    } catch (error) {
      toast.close()
      message.alert(error?.data?.msg ?? '图片上传失败，请您确保图片格式正确!')
    }
  }
}

function reverseCamera() {
  currData.value.devicePosition = currData.value.devicePosition === 'back' ? 'front' : 'back'
}

function cameraError(e) {
  console.log(e.detail)
  currData.value.imgType = -1
  message.alert('摄像头权限未启用，请在小程序设置里手动开启').then(() => {
    uni.navigateBack()
  })
}

// 关闭相机
const close = () => {
  console.log('🌭======关闭相机-----')
  toast.close()
  uni.navigateBack()
}
function del() {
  copSrc.value = ''
}
// 使用uni API请求权限
const androidAuthCamera = ref(null)
const androidCameraPermiss = () => {
  requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
  requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
  requestAndroidPermission('android.permission.READ_MEDIA_IMAGES')
  requestAndroidPermission('android.permission.CAMERA')
}

const requestAndroidPermission = async (permisionID) => {
  const result = await permision.requestAndroidPermission(permisionID)
  let strStatus
  if (result === 1) {
    strStatus = '已获得授权'
  } else if (result === 0) {
    strStatus = '未获得授权'
    uni.showModal({
      content: permisionID + strStatus,
      showCancel: false,
    })
  } else {
    strStatus = '被永久拒绝权限'
    uni.showModal({
      content: permisionID + strStatus,
      showCancel: false,
    })
  }
}
</script>

<template>
  <view class="bigBox">
    <dy-navbar leftTitle="选择拍照模式" left></dy-navbar>
    <view class="box">
      <view class="cover-box flex flex-col items-center">
        <view v-if="!copSrc" class="flex flex-col justify-between items-center h-100px pt-150px">
          <view class="w-300px">
            <wd-button block :round="false" @click="chooseImage('camera')">拍照上传</wd-button>
          </view>
          <!-- <view class="w-300px">
            <wd-button block :round="false" @click="chooseImage('album')">从相册选择</wd-button>
          </view> -->
        </view>
        <view class="relative flex flex-col justify-center items-center bgCop size-full" v-else>
          <view
            class="p-5px bd-solid_#fff"
            :style="`width: ${currData.width}px; height: ${currData.height}px;`"
            @click="del"
          >
            <image :src="copSrc" alt="截图结果" :width="currData.width" :height="currData.height" />
          </view>
          <view
            class="mt-20px text-center py-10px px-15px bd-solid_#fff rounded-4px mx-auto color-#fff"
            @click="del"
          >
            重新拍照
          </view>
        </view>
      </view>
    </view>

    <wd-message-box selector="carmalert"></wd-message-box>
  </view>
</template>

<style lang="scss" scoped>
.bigBox {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
}

.facevideo {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.cover-box {
  position: absolute;
  z-index: 20;
  width: 100%;
  height: 100%;
}

#myCanvas {
  position: absolute;
  top: 50000px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100vh;
}

.bgCop {
  background: rgba(0, 0, 0, 0.9);
}

.backIcon {
  position: fixed;
  top: 45px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
}

.bgs {
  background: rgba(0, 0, 255, 0.9);
}
</style>
