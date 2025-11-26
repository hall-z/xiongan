interface Coupon {
  function: string;
  nr_function?: string;
  nr_headInfo?: string;
  faceValue?: number | string;
  rate?: number | string;
  allProduct?: boolean;
  nr_condition?: string;
  service?: string;
  couponTypeName?: string;
}

const COUPON_HANDLER = {
  /**
   * 处理券的相关信息（所有nr开头的属性都是前端生成，非后台返回）
   * @param coupon 券对象
   */
  handleCouponFunction: function (coupon: Coupon): void {
    // 券功能
    if (coupon.function === "CASH") {
      coupon.nr_function = "满减券"
      coupon.nr_headInfo = coupon.faceValue?.toString() || "0"
    } else if (coupon.function === "DISCOUNT") {
      coupon.nr_function = "折扣券"
      coupon.nr_headInfo = coupon.rate?.toString() || "0"
      if (Number.isInteger(Number(coupon.rate))) {
        coupon.nr_headInfo = Number(coupon.rate).toFixed(0)
      }
    } else if (coupon.function === "FREESHIP") {
      coupon.nr_function = "运费券"
      if (coupon.faceValue) {
        coupon.nr_headInfo = coupon.faceValue.toString()
      } else {
        coupon.nr_headInfo = "运费券"
      }
    } else if (coupon.function === "PACKAGE") {
      coupon.nr_function = "券包"
      coupon.nr_headInfo = "券包"
    } else if (coupon.function === "PRODUCT") {
      coupon.nr_function = "商品券"
      coupon.nr_headInfo = "商品券"
    } else {
      // 外部券都是满减券
      if (coupon.service === 'HD' || coupon.service === 'HDCRM') {
        coupon.function = "CASH"
        coupon.nr_headInfo = coupon.faceValue?.toString() || "0"
        coupon.nr_function = coupon.couponTypeName || "满减券"
      } else {
        coupon.function = "CASH"
        coupon.nr_headInfo = coupon.faceValue?.toString() || "0"
        coupon.nr_function = coupon.couponTypeName ? coupon.couponTypeName : "满减券"
      }
    }

    // 使用条件
    console.log(coupon.allProduct, 'coupon.allProduct')
    if (coupon.function === "FREESHIP") {
      coupon.nr_condition = "该优惠券只针对配送使用"
    } else {
      coupon.nr_condition = coupon.allProduct ? '全部商品可用' : '部分商品可以使用'
    }
  }
}

export default COUPON_HANDLER