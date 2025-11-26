import barcode from '@/libs/barcode'
import qrcode from '@/libs/qrcode'
import subscribeService from '@/service/api/newretail/subscribeService';
import CanvasContext from './CanvasContext'

function convert_length(length: number): number {
  return Math.round(uni.getWindowInfo().windowWidth * length / 750)
}

function getTemporaryUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    subscribeService.getTemporaryUrl(url)
      .then((res: any) => {
        if (res) {
          resolve(res)
        } else {
          resolve(url)
        }
      })
      .catch((err: any) => {
        reject({
          code: -1,
          message: err.errMsg
        })
      })
  })
}

function barc(id: string, code: string, width: number, height: number, that?: any): Promise<any> {
  let createSelectorQuery = uni.createSelectorQuery()
  if (that) {
    createSelectorQuery = uni.createSelectorQuery().in(that)
  }
  return new Promise((resolve, reject) => {
    createSelectorQuery
      .select('#' + id)
      .fields({ node: true, size: true })
      .exec((res: any) => {
        if (!res || !res[0]) {
          return
        }
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 设置canvas尺寸
        const dpr = uni.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        // 绘制条形码
        barcode.code128(new CanvasContext(res[0]), code, convert_length(width), convert_length(height))
        resolve(canvas)
      })
  })
}

function qrc(id: string, code: string, width: number, height: number, that?: any): Promise<any> {
  let createSelectorQuery = uni.createSelectorQuery()
  if (that) {
    createSelectorQuery = uni.createSelectorQuery().in(that)
  }
  return new Promise((resolve, reject) => {
    createSelectorQuery
      .select('#' + id)
      .fields({ node: true, size: true })
      .exec((res: any) => {
        if (!res || !res[0]) {
          return
        }
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 设置canvas尺寸
        const dpr = uni.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        // 绘制二维码
        qrcode.api.draw(code, {
          ctx: new CanvasContext(res[0]),
          width: convert_length(width),
          height: convert_length(height)
        })
        resolve(canvas)
      })
  })
}

export default {
  barcode: barc,
  qrcode: qrc,
  getTemporaryUrl: getTemporaryUrl
}
