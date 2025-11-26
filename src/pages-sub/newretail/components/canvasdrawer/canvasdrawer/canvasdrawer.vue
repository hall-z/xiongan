<template>
  <canvas
    canvas-id="canvasdrawer"
    :style="'width:' + paintingData.width + 'px;height:' + paintingData.height + 'px;'"
    class="board"
    v-if="showCanvas"
  ></canvas>
</template>
<script setup>
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsUtilsJs from '@/utils/newretail/utils'
// import { ready } from "@dcloudio/uni-app";
import { reactive, watch } from 'vue'
const app = getApp()

/* global Component wx */
const UTILS = _utilsUtilsJs
const IMGAGESPATH = _utilsImagesPathJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  showCanvas: false,
  width: 100,
  height: 100,
  tempFileList: [],
  isPainting: false,
})
const props = defineProps({
  url: {
    type: String,
  },
  bgUrl: {
    type: String,
  },
  painting: {
    type: Object,
    value: {
      view: [],
    },
  },
})

// Watch listeners converted from observers
watch(
  () => props.painting,
  (newVal, oldVal) => {
    state.paintingData = newVal
    if (!state.isPainting) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        if (newVal && newVal.width && newVal.height) {
          state.showCanvas = true
          state.isPainting = true
          readyPigment()
        }
      } else {
        if (newVal && newVal.mode !== 'same') {
          triggerEvent('getImage', {
            errMsg: 'canvasdrawer:samme params',
          })
        }
      }
    }
  },
)
const ctx = null
let cache = {}
ready(function () {
  uni.removeStorageSync('canvasdrawer_pic_cache')
  cache = uni.getStorageSync('canvasdrawer_pic_cache') || {}
  // wx.createSelectorQuery()
  // .select('#canvasdrawer') // 在 WXML 中填入的 id
  // .fields({ node: true, size: true })
  // .exec((res) => {
  //     if(!res || !res[0]) return false
  //     // Canvas 对象
  //     // const canvas = res[0].node
  //     // // Canvas 绘制上下文
  //     this.ctx = new CanvasContext(res[0])
  // })
})
function readyPigment() {
  const systemInfo = app.globalData.systemInfo
  const screenWidth = app.globalData.systemInfo.screenWidth
  const that = this
  const rate = 1
  const ctx = uni.createCanvasContext('canvasdrawer', that)
  const { width, height, views } = state.paintingData
  const bgUrl = state.bgUrl || state.imagesPath.qrCodeBg
  getImageInfo(bgUrl)
    .then((res) => {
      ctx.drawImage(res.path, 0, 0, 375 * rate, 670 * rate)
      ctx.draw(true)
      return getImageInfo(state.url)
    })
    .then((res) => {
      ctx.drawImage(res.path, 90 * rate, 260 * rate, 200 * rate, 180 * rate)
      ctx.draw(true, () => {
        // 保存图片并显示
        const pixelRatio = systemInfo.pixelRatio
        const screenWidth = systemInfo.screenWidth
        // const rate = screenWidth / 750
        const rate = 1
        const width = 375 * rate
        const height = 670 * rate
        const destHeight = height * pixelRatio
        const destWidth = width * pixelRatio
        uni.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width,
            height,
            destWidth,
            destHeight,
            fileType: 'jpg',
            quality: 1,
            canvasId: 'canvasdrawer',
            success(res) {
              // wx.hideLoading()
              // that.setData({
              //   shareUrl: res.tempFilePath,
              //   showPoster: true
              // })
              triggerEvent('getImage', {
                tempFilePath: res.tempFilePath,
                errMsg: 'canvasdrawer:ok',
              })
            },
            fail(err) {
              console.log(err)
              uni.hideLoading()
              UTILS.showToast('分享图生成失败，请重试~')
            },
          },
          that,
        )
      })
    })
    .catch((err) => {
      console.log(err)
      uni.hideLoading()
      UTILS.showToast('分享图生成失败，请重试~')
    })

  // const { width, height, views } = this.data.painting
  // this.setData({
  //   width,
  //   height
  // })

  // const inter = setInterval(() => {
  //   if (this.ctx) {
  //     clearInterval(inter)
  //     this.ctx.clearActions()
  //     this.ctx.save()
  //     this.getImagesInfo(views)
  //   }
  // }, 100)
}
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: (res) => {
        resolve(res)
      },
      fail: (e) => {
        console.log(e)
        reject({
          code: -1,
          message: '图片获取失败',
        })
      },
    })
  })
}
function startPainting() {
  const {
    tempFileList,
    painting: { views },
  } = state
  console.log(tempFileList)
  for (let i = 0, imageIndex = 0; i < views.length; i++) {
    if (views[i].type === 'image') {
      drawImage({
        ...views[i],
        url: tempFileList[imageIndex],
      })
      imageIndex++
    } else if (views[i].type === 'text') {
      if (!ctx.measureText) {
        uni.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。',
        })
        triggerEvent('getImage', {
          errMsg: 'canvasdrawer:version too low',
        })
        return
      } else {
        drawText(views[i])
      }
    } else if (views[i].type === 'rect') {
      drawRect(views[i])
    }
  }
  ctx.draw(false, () => {
    uni.setStorageSync('canvasdrawer_pic_cache', cache)
    const system = {
      ...uni.getSystemSetting(),
      ...uni.getAppAuthorizeSetting(),
      ...uni.getDeviceInfo(),
      ...uni.getWindowInfo(),
      ...uni.getAppBaseInfo(),
    }.system
    if (/ios/i.test(system)) {
      saveImageToLocal()
    } else {
      // 延迟保存图片，解决安卓生成图片错位bug。
      setTimeout(() => {
        saveImageToLocal()
      }, 800)
    }
  })
}
function drawImage(params) {
  ctx.save()
  const { url, top = 0, left = 0, width = 0, height = 0, borderRadius = 0, deg = 0 } = params
  // if (borderRadius) {
  //   this.ctx.beginPath()
  //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
  //   this.ctx.clip()
  //   this.ctx.drawImage(url, left, top, width, height)
  // } else {
  if (deg !== 0) {
    ctx.translate(left + width / 2, top + height / 2)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.drawImage(url, -width / 2, -height / 2, width, height)
  } else {
    ctx.drawImage(url, left, top, width, height)
  }
  // }
  ctx.restore()
}
function drawText(params) {
  ctx.save()
  const {
    MaxLineNumber = 2,
    breakWord = false,
    color = 'black',
    content = '',
    fontSize = 16,
    top = 0,
    left = 0,
    lineHeight = 20,
    textAlign = 'left',
    width,
    bolder = false,
    textDecoration = 'none',
  } = params
  ctx.beginPath()
  ctx.setTextBaseline('top')
  ctx.setTextAlign(textAlign)
  ctx.setFillStyle(color)
  ctx.setFontSize(fontSize)
  if (!breakWord) {
    ctx.fillText(content, left, top)
    drawTextLine(left, top, textDecoration, color, fontSize, content)
  } else {
    let fillText = ''
    let fillTop = top
    let lineNum = 1
    for (let i = 0; i < content.length; i++) {
      fillText += [content[i]]
      if (ctx.measureText(fillText).width > width) {
        if (lineNum === MaxLineNumber) {
          if (i !== content.length) {
            fillText = fillText.substring(0, fillText.length - 1) + '...'
            ctx.fillText(fillText, left, fillTop)
            drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            fillText = ''
            break
          }
        }
        ctx.fillText(fillText, left, fillTop)
        drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
        fillText = ''
        fillTop += lineHeight
        lineNum++
      }
    }
    ctx.fillText(fillText, left, fillTop)
    drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
  }
  ctx.restore()
  if (bolder) {
    drawText({
      ...params,
      left: left + 0.3,
      top: top + 0.3,
      bolder: false,
      textDecoration: 'none',
    })
  }
}
function drawTextLine(left, top, textDecoration, color, fontSize, content) {
  if (textDecoration === 'underline') {
    drawRect({
      background: color,
      top: top + fontSize * 1.2,
      left: left - 1,
      width: ctx.measureText(content).width + 3,
      height: 1,
    })
  } else if (textDecoration === 'line-through') {
    drawRect({
      background: color,
      top: top + fontSize * 0.6,
      left: left - 1,
      width: ctx.measureText(content).width + 3,
      height: 1,
    })
  }
}
function drawRect(params) {
  ctx.save()
  const { background, top = 0, left = 0, width = 0, height = 0 } = params
  ctx.setFillStyle(background)
  ctx.fillRect(left, top, width, height)
  ctx.restore()
}
function saveImageToLocal() {
  const { width, height } = state
  uni.canvasToTempFilePath(
    {
      x: 0,
      y: 0,
      width,
      height,
      canvasId: 'canvasdrawer',
      complete: (res) => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          state.showCanvas = false
          state.isPainting = false
          state.tempFileList = []
          triggerEvent('getImage', {
            tempFilePath: res.tempFilePath,
            errMsg: 'canvasdrawer:ok',
          })
        } else {
          triggerEvent('getImage', {
            errMsg: 'canvasdrawer:fail',
          })
        }
      },
    },
    this,
  )
}
</script>
<style scoped>
.board {
  position: fixed;
  top: 2000rpx;
}
</style>
