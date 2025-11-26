export const carmeraUrl = () => {
  let url
  // #ifdef APP-PLUS
  url = '/pages-sub/serveMain/OcrCameraApp'
  // #endif
  // #ifndef  APP-PLUS
  url = '/pages-sub/serveMain/OcrCamera'
  // #endif
  return url
}
