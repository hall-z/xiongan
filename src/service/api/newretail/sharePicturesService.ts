import request from './request'

export const SharePicturesService = {
  /**
   * 根据模块类型查询分享图
   * @param modelType 模块类型: DEFAULT, COUPON_ACTIVITY, RED_PACKATE, INVITE_MEMBER, RAFFLE_ACTIVITY, SCORE_MALL, H5
   */
  getByModelType: (modelType: string): Promise<any> => {
    return request.get('/newretail/api/mall/sharePictures/getByModelType', { modelType })
  }
}

export default SharePicturesService