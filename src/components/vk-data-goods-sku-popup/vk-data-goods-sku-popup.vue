<!--
【开箱即用】商品sku选择器组件豪华独立版（打造uni插件市场功能最全的SKU选择器组件）
插件名称：vk-data-goods-sku-popup
插件类型：业务型数据驱动组件
作者：VK
如有问题，可加Q群：22466457 反馈
 -->
<template>
  <view
    class="vk-data-goods-sku-popup"
    :style="{ zIndex: zIndex }"
    catchtouchmove="true"
    :class="valueCom && complete ? 'show' : 'none'"
    @touchmove.stop.prevent="moveHandle"
    @click.stop="stop"
  >
    <view class="mask" @click="close('mask')"></view>
    <view
      class="layer attr-content"
      :class="{ 'safe-area-inset-bottom': safeAreaInsetBottom }"
      :style="{ borderRadius: borderRadius + 'rpx ' + borderRadius + 'rpx 0 0' }"
    >
      <view class="specification-wrapper">
        <scroll-view class="specification-wrapper-content" scroll-y="true">
          <view class="specification-header">
            <view class="specification-left">
              <image
                class="product-img"
                :src="img"
                :style="{ backgroundColor: goodsThumbBackgroundColor }"
                mode="aspectFill"
                @click="previewImage"
              ></image>
            </view>
            <view class="specification-right">
              <view class="price-content FHcl" :style="{ color: themeColorFn('priceColor') }">
                <text class="sign">¥</text>
                <text
                  class="price"
                  style="margin-right: 10px"
                  :class="priceCom.length > 16 ? 'price2' : ''"
                >
                  {{
                    isNaN((priceCom * selectNum).toFixed(2))
                      ? priceCom
                      : (
                            Number(priceCom) -
                            getcuoInfo(quanlist[0], (priceCom * 1).toFixed(2)).money
                          ).toFixed(2) > 0
                        ? (
                            Number(priceCom) -
                            getcuoInfo(quanlist[0], (priceCom * 1).toFixed(2)).money
                          ).toFixed(2)
                        : '0.0'
                  }}
                </text>

                <text
                  style="
                    padding: 3px 5px;
                    margin-right: 10px;
                    font-size: 10px;
                    line-height: 16px;
                    color: #fff;
                    background: #f44d24;
                    border-radius: 3px 3px 3px 3px;
                  "
                  v-if="quanlist.length > 0"
                >
                  券后价
                </text>
                <text
                  style="
                    margin-right: 10px;
                    font-size: 14px;
                    color: #808080;
                    text-decoration: line-through;
                  "
                  v-if="quanlist.length > 0"
                >
                  {{ '￥' + priceCom }}
                </text>
              </view>
              <view class="inventory" v-if="!hideStock">{{ stockText }}：{{ stockCom }}</view>
              <view class="inventory" v-else></view>
              <view
                class="number-box-view"
                style="
                  display: flex !important;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <view style="">
                  <vk-data-input-number-box
                    v-model="selectNum"
                    :min="minBuyNum || 1"
                    :max="Math.min(stockCom, maxBuyNum === 0 ? stockCom : maxBuyNum)"
                    :step="stepBuyNum || 1"
                    :step-strictly="stepStrictly"
                    :positive-integer="true"
                    @change="numChange"
                  ></vk-data-input-number-box>
                </view>
                <view
                  v-if="maxBuyNum > 0"
                  style="
                    display: flex;
                    gap: 5px;
                    align-items: center;
                    font-size: 12px;
                    color: #f44d24;
                  "
                >
                  <image
                    src="https://oss.xay.xacloudy.cn/images/2025-03/dfa0dd11-270f-4e74-bbc0-d8d0818fa749xiang.jpg"
                    mode="aspectFill"
                    style="width: 12px; height: 12px"
                  ></image>
                  <view>仅限购买{{ maxBuyNum }}件</view>
                </view>
              </view>

              <!-- <view class="choose" v-show="isManyCom">已选：{{ selectArr.join(' ') }}</view> -->
            </view>
          </view>

          <view class="specification-content">
            <view
              v-show="isManyCom"
              class="specification-item"
              v-for="(item, index1) in goodsInfo[specListName]"
              :key="index1"
            >
              <view class="item-title">{{ item.name }}</view>
              <view class="item-wrapper">
                <view
                  class="item-content"
                  v-for="(item_value, index2) in item.list"
                  :key="index2"
                  :class="[
                    item_value.ishow ? '' : 'noactived',
                    subIndex[index1] == index2 ? 'actived' : '',
                  ]"
                  :style="[
                    item_value.ishow ? '' : themeColorFn('disableStyle'),
                    item_value.ishow ? themeColorFn('btnStyle') : '',
                    subIndex[index1] == index2 ? themeColorFn('activedStyle') : '',
                  ]"
                  @click="skuClick(item_value, index1, index2)"
                >
                  {{ item_value.name }}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="close" @click="close('close')" v-if="showClose != false">+</view>
      </view>

      <view class="btn-wrapper" v-if="outFoStock || mode == 4">
        <view class="sure" style="color: #ffffff; background-color: #cccccc">
          {{ noStockText }}
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode == 1">
        <view
          class="sure add-cart"
          :style="{
            color: themeColorFn('addCartColor'),
            backgroundColor: themeColorFn('addCartBackgroundColor'),
            borderRadius: themeColorFn('addcarRounded'),
          }"
          @click="addCart"
        >
          {{ addCartText }}
        </view>

        <view
          class="sure"
          :style="{
            color: themeColorFn('buyNowColor'),
            backgroundColor: themeColorFn('buyNowBackgroundColor'),
            borderRadius: themeColorFn('buyNowRounded'),
          }"
          @click="buyNow"
        >
          {{ buyNowText }}
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode == 2">
        <view
          class="sure add-cart"
          :style="{
            color: themeColorFn('addCartColor'),
            backgroundColor: themeColorFn('addCartBackgroundColor'),
            borderRadius: themeColorFn('addcarRounded'),
          }"
          @click="addCart"
        >
          {{ addCartText }}
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode == 3">
        <view
          class="sure"
          :style="{
            color: themeColorFn('buyNowColor'),
            backgroundColor: themeColorFn('buyNowBackgroundColor'),
            borderRadius: themeColorFn('buyNowRounded'),
          }"
          @click="buyNow"
        >
          {{ buyNowText }}
        </view>
      </view>
    </view>
    <!-- 页面内容结束 -->
  </view>
</template>

<script>
/* eslint-disable */
var vk // vk依赖
var goodsCache = {} // 本地商品缓存
export default {
  name: 'vk-data-goods-sku-popup',
  emits: [
    'update:modelValue',
    'input',
    'update-goods',
    'open',
    'close',
    'add-cart',
    'buy-now',
    'cart',
    'buy',
    'num-change',
  ],
  props: {
    // true 组件显示 false 组件隐藏
    value: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    // vk云函数路由模式参数开始-----------------------------------------------------------
    // 商品id
    goodsId: {
      type: String,
      default: '',
    },
    // vk路由模式框架下的云函数地址
    action: {
      type: String,
      default: '',
    },
    // vk云函数路由模式参数结束-----------------------------------------------------------
    // 该商品已抢完时的按钮文字
    noStockText: {
      type: String,
      default: '该商品已抢完',
    },
    // 库存文字
    stockText: {
      type: String,
      default: '库存',
    },
    // 商品表id的字段名
    goodsIdName: {
      type: String,
      default: '_id',
    },
    // sku表id的字段名
    skuIdName: {
      type: String,
      default: '_id',
    },
    // sku_list的字段名
    skuListName: {
      type: String,
      default: 'sku_list',
    },

    couponList: {
      type: Array,
      default: [],
    },

    specListName: {
      type: String,
      default: 'specList',
    },
    // 库存的字段名 默认 stock
    stockName: {
      type: String,
      default: 'stock',
    },
    // sku组合路径的字段名
    skuArrName: {
      type: String,
      default: 'sku_name_arr',
    },
    // 默认单规格时的规格组名称
    defaultSingleSkuName: {
      type: String,
      default: '默认',
    },
    // 模式 1:都显示  2:只显示购物车 3:只显示立即购买 4:显示缺货按钮 默认 1
    mode: {
      type: [Number, null],
      default: 1,
    },
    // 点击遮罩是否关闭组件 true 关闭 false 不关闭 默认true
    maskCloseAble: {
      type: Boolean,
      default: true,
    },
    // 顶部圆角值
    borderRadius: {
      type: [String, Number],
      default: 0,
    },
    // 商品缩略图字段名(未选择sku时)
    goodsThumbName: {
      type: [String],
      default: 'goods_thumb',
    },
    // 商品缩略图背景颜色，如#999999
    goodsThumbBackgroundColor: {
      type: String,
      default: 'transparent',
    },
    // 最小购买数量 默认 1
    minBuyNum: {
      type: [Number, String],
      default: 1,
    },
    // 最大购买数量 默认 100000
    maxBuyNum: {
      type: [Number, String],
      default: 100000,
    },
    // 步进器步长 默认 1
    stepBuyNum: {
      type: [Number, String],
      default: 1,
    },
    // 是否只能输入 step 的倍数
    stepStrictly: {
      type: Boolean,
      default: false,
    },
    // 自定义获取商品信息的函数,支付宝小程序不支持该属性,请使用localdata属性
    customAction: {
      type: [Function],
      default: null,
    },
    // 本地数据源
    localdata: {
      type: Object,
    },
    // 价格的字体颜色
    priceColor: {
      type: String,
    },
    // 立即购买按钮的文字
    buyNowText: {
      type: String,
      default: '立即购买',
    },
    // 立即购买按钮的字体颜色
    buyNowColor: {
      type: String,
    },
    // 立即购买按钮的背景颜色
    buyNowBackgroundColor: {
      type: String,
    },
    // 加入购物车按钮的文字
    addCartText: {
      type: String,
      default: '加入购物车',
    },
    // 加入购物车按钮的字体颜色
    addCartColor: {
      type: String,
    },
    // 加入购物车按钮的背景颜色
    addCartBackgroundColor: {
      type: String,
    },
    // 不可点击时,按钮的样式
    disableStyle: {
      type: Object,
      default: null,
    },
    // 按钮点击时的样式
    activedStyle: {
      type: Object,
      default: null,
    },
    // 按钮常态的样式
    btnStyle: {
      type: Object,
      default: null,
    },
    // 是否显示右上角关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },

    closeImage: {
      type: String,
      default:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAEyUlEQVR42sSZeWwNURTGp4OqtBo7sSXELragdkpQsRRJ1Zr4hyJiJ9YgxNIg1qANiT+E1i5IY0kVVWtQEbuEKLFGUSH27/ANN5PXmTvzupzkl/tm8t6b7517lnvvC0lKSjJ8WmnQAUSDFqABqALKgl8gD7wE90E2SAeXwFf1SxISErQeVtKHwCgwFsSDSIf3hYFKoCkYDBaDdyAViHdueHmoF6FtwDLQ23b/E7gM7oIcejIERIDaoBFoC8qA8mA8SQNz6W1XC9GY+nCQCCYAk/c+gF0gBZwH312+IxR0BCPBUIaH2A+wHsxHCHxx+gLT5QGN6a2JfG8uvVCDws9oiDQYlxkMGfHyQvARlADTwcXk5OT6foV2kS8ATXidymlcyen1a/Jjl9IJh3hPkjELYqO8Cu0KjjNZvtETw5jFBWXPmGSTGQKSeOn5iQ0kVLL0CINfPNcPbDMKyRCbGzEMBJ+ZD8cChYFdqGTqfsWT8otPGoVsEHsMwxDFs3shNsxJ6BrQ0Po8OGUUkVHsNCVml+cntB1jUWwn2GEUsTEMrASbDK+2CCQ0kYX6nfLLisMmKqUr0S60M+jG10vAm+JSCa8+x7CKlzHwaktV6DiObzUzPJIxFO1BQ12wGtTReO9GetVgY/kjNJzZbcWmTjHfxw51AsRqvL8eOAtmsJuFu3g1l+1ZLB5eDTVZ3K0P7tL0TkWOpSg61kVkBtuuNRthGs+wtJST5aQI7cEbkkRXNYVKgX6kIdYuUhYzMQwxN8tiExCLFqHNeSF9/aem0BzGp5PYQCJ7c/Gsk1RfuSD6U1dNpcDf9ZigTmKbMRZ9iVTsHscGJluW2FMf1SSQWGnBmaB6kCJVTVVNJZE++Cx9drEllS1KMCINpURFmEbBWA63Fz9s95cGIdJgp/zXmT4pZcOvSUzuZttTbblmnc3PIjjmidDXvKgdhMh0JdbzuCjWrbNOVovjS5P7bkPJ/mBESkz2BO0166ybNeJ431S2q+01NntuIq3E0amzjiZtk9tssWyTDzO4525bACK9NAUn68TtkNhpEXpOSagRml+S6iLSSeweHv242Qhl13rRyvoDvDlKyTQny/ZQJ+1iH7vVbEx7OR5UiKVIO7VicgvHCtwrudloMIV7/0uadVYW57O4Wvvi8v4pymlKkrpwvsDeLLZAY2pkwbAB3PSQfC+4cH7l4k1ZH8zkZRq8ecO+Z5rN40JJqnXFuGfaxPCTLjcn0OZOpnArXw8HY4paIbw5CcMgXq6HN2/mt6+XGLrN15tBryIUGavMpCTrfKcDCKkAceA9S8nhAOehhSUyhXpkBxxnP4YM1InugP7cBkjBPcqVUWFYCEROxXiQz5JlXV+IfKh7mpfJac+lZ6V87QXVClBkTc7YWsWTPSDyitfzUTlJlj8TbvE6jluDOdwZ+jX57GLO3ADeuyZrDYi86vV81FD2UVGsmT+5Zl0BnkhoseOEaogL46pqO4v/IqUEyalIR4h85BgjHv6+aUWRMbb7EstX6O0cpT1Gco0ry8fWygLDMjmDnQeBt3Qe7uVfkeugDwVLcsVzGsuwLXbV+I63XNAkG5r/hvgRqgqWs6pJPKrsbvz/Q6yyun0w/h6lP+BnzrCpfPMT2L8FGAA7k1GZ/vnaqAAAAABJRU5ErkJggg==',
    },
    // 是否隐藏库存显示
    hideStock: {
      type: Boolean,
      default: false,
    },
    // 颜色主题
    theme: {
      type: String,
      default: 'default',
    },
    // 请求中的提示
    actionTips: {
      type: String,
      default: '请求中...',
    },
    // 默认选中的SKU
    defaultSelect: {
      type: Object,
    },
    // 是否使用缓存
    useCache: {
      type: Boolean,
      default: true,
    },
    /**
     * 默认商品,设置该值可快速展示商品
     * 逻辑: 先展示 defaultGoods 信息,再取数据库,再更新页面(通常为更新库存)
     */
    defaultGoods: {
      type: Object,
    },
    /**
     * 金额是否需要除以100
     * 1:金额会除以100
     * 0:金额不会除以100
     */
    amountType: {
      type: Number,
      default: 1,
    },
    // 每次选择完SKU后，购买数量归1，如果有最小购买数量，则设置为最小购买数量
    selectedInit: {
      type: Boolean,
      default: false,
    },
    // 是否开启底部安全区适配，默认true
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: [Number, String],
      default: 990,
    },
    buyNowRounded: {
      type: String,
      default: 'default',
    },
    addcarRounded: {
      type: String,
      default: 'default',
    },
    img: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      complete: false, // 组件是否加载完成
      goodsInfo: {}, // 商品信息
      isShow: false, // true 显示 false 隐藏
      initKey: true, // 是否需要初始化 true 是 false 否
      // #ifndef MP-BAIDU
      shopItemInfo: {}, // 存放要和选中的值进行匹配的数据（因百度小程序setData不支持中文字段，故不编译shopItemInfo变量）
      // #endif
      selectArr: [], // 存放被选中的值
      subIndex: [], // 是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
      selectShop: {}, // 存放最后选中的商品
      selectNum: this.minBuyNum || 1, // 选中数量
      outFoStock: false, // 是否全部sku都缺货
      openTime: 0,
      quanlist: [],
      themeColor: {
        // 默认主题
        default: {
          priceColor: 'rgb(254, 86, 10)',
          buyNowColor: '#ffffff',
          buyNowBackgroundColor: 'rgb(254, 86, 10)',
          addCartColor: '#ffffff',
          addCartBackgroundColor: 'rgb(254, 86, 10)',
          btnStyle: {
            color: '#333333',

            backgroundColor: '#f0f2f7',
          },
          activedStyle: {
            color: 'rgb(244 77 36)',
            backgroundColor: 'rgba(255, 236, 232, 1)',
          },
          disableStyle: {
            color: '#c3c3c3',
            borderColor: '#f6f6f6',
            backgroundColor: '#f6f6f6',
          },
          buyNowRounded: '30px',
          addcarRounded: '30px',
        },
        // 红黑主题
        'red-black': {
          priceColor: 'rgb(255, 68, 68)',
          buyNowColor: '#ffffff',
          buyNowBackgroundColor: 'rgb(255, 68, 68)',
          addCartColor: '#ffffff',
          addCartBackgroundColor: 'rgb(85, 85, 85)',
          activedStyle: {
            color: 'rgb(255, 68, 68)',
            borderColor: 'rgb(255, 68, 68)',
            backgroundColor: 'rgba(255,68,68,0.1)',
          },
          buyNowRounded: '30px',
          addcarRounded: '30px',
        },
        // 黑白主题
        'black-white': {
          priceColor: 'rgb(47, 47, 52)',
          buyNowColor: '#ffffff',
          buyNowBackgroundColor: 'rgb(47, 47, 52)',
          addCartColor: 'rgb(47, 47, 52)',
          addCartBackgroundColor: 'rgb(235, 236, 242)',
          // btnStyle:{
          // 	color:"rgb(47, 47, 52)",
          // 	borderColor:"rgba(235,236,242,0.5)",
          // 	backgroundColor:"rgba(235,236,242,0.5)",
          // },
          activedStyle: {
            color: 'rgb(47, 47, 52)',
            borderColor: 'rgba(47,47,52,0.12)',
            backgroundColor: 'rgba(47,47,52,0.12)',
          },
          buyNowRounded: '30px',
          addcarRounded: '30px',
        },
        // 咖啡色主题
        coffee: {
          priceColor: 'rgb(195, 167, 105)',
          buyNowColor: '#ffffff',
          buyNowBackgroundColor: 'rgb(195, 167, 105)',
          addCartColor: 'rgb(195, 167, 105)',
          addCartBackgroundColor: 'rgb(243, 238, 225)',
          activedStyle: {
            color: 'rgb(195, 167, 105)',
            borderColor: 'rgb(195, 167, 105)',
            backgroundColor: 'rgba(195, 167, 105,0.1)',
          },
          buyNowRounded: '30px',
          addcarRounded: '30px',
        },
        // 浅绿色主题
        green: {
          priceColor: 'rgb(99, 190, 114)',
          buyNowColor: '#ffffff',
          buyNowBackgroundColor: 'rgb(99, 190, 114)',
          addCartColor: 'rgb(99, 190, 114)',
          addCartBackgroundColor: 'rgb(225, 244, 227)',
          activedStyle: {
            color: 'rgb(99, 190, 114)',
            borderColor: 'rgb(99, 190, 114)',
            backgroundColor: 'rgba(99, 190, 114,0.1)',
          },
          buyNowRounded: '30px',
          addcarRounded: '30px',
        },
      },
    }
  },
  created() {
    let that = this
    vk = that.vk
    if (that.valueCom) {
      that.open()
    }
  },
  mounted() {},
  methods: {
    getcuoInfo(info, total) {
      if (info) {
        if (info.couponType === 1) {
          return {
            name: '满' + info.couponFillPrice + '元 减' + info.couponPrice + '',
            money: info.couponPrice,
          }
        } else if (info.couponType === 3) {
          return {
            name: '满' + info.couponFillPrice + '元 打' + info.couponPrice + '折',
            money:
              total - total * info.couponPrice * 0.1 > info.maxDiscountAmount
                ? info.maxDiscountAmount
                : (total - (total * info.couponPrice * 0.1).toFixed(2)).toFixed(2),
          }
        }
      } else {
        return { name: '', money: 0 }
      }
    },
    // 初始化
    init(notAutoClick) {
      let that = this
      // 清空之前的数据
      that.selectArr = []
      that.subIndex = []
      that.selectShop = {}
      that.selectNum = that.minBuyNum || 1
      that.outFoStock = false
      that.shopItemInfo = {}
      let specListName = that.specListName
      that.goodsInfo[specListName].map((item) => {
        that.selectArr.push('')
        that.subIndex.push(-1)
      })
      that.checkItem() // 计算sku里面规格形成路径
      that.checkInpath(-1) // 传-1是为了不跳过循环
      if (!notAutoClick) that.autoClickSku() // 自动选择sku策略
    },
    // 使用vk路由模式框架获取商品信息
    findGoodsInfo(obj = {}) {
      let that = this
      let { useCache } = obj
      if (typeof vk == 'undefined') {
        that.toast('custom-action必须是function', 'none')
        return false
      }
      let { actionTips } = that
      let actionTitle = ''
      let actionAoading = false
      if (actionTips !== 'custom') {
        actionTitle = useCache ? '' : '请求中...'
      } else {
        actionAoading = useCache ? false : true
      }
      vk.callFunction({
        url: that.action,
        title: actionTitle,
        loading: actionAoading,
        data: {
          goods_id: that.goodsId,
        },
        success(data) {
          that.updateGoodsInfo(data.goodsInfo)
          // 更新缓存
          goodsCache[that.goodsId] = data.goodsInfo
          that.$emit('update-goods', data.goodsInfo)
        },
        fail() {
          that.updateValue(false)
        },
      })
    },
    updateValue(value) {
      let that = this
      if (value) {
        that.$emit('open', true)
        that.$emit('input', true)
        that.$emit('update:modelValue', true)
      } else {
        that.$emit('input', false)
        that.$emit('close', 'close')
        that.$emit('update:modelValue', false)
      }
    },
    // 更新商品信息(库存、名称、图片)
    updateGoodsInfo(goodsInfo) {
      let that = this
      // goodsInfo.sku_list.map((item, index) => {
      // 	item.sku_name_arr = ["20ml/瓶"];
      // });
      let { skuListName } = that
      if (
        JSON.stringify(that.goodsInfo) === '{}' ||
        that.goodsInfo[that.goodsIdName] !== goodsInfo[that.goodsIdName]
      ) {
        that.goodsInfo = goodsInfo
        that.initKey = true
      } else {
        that.goodsInfo[skuListName] = goodsInfo[skuListName]
      }
      if (that.initKey) {
        that.initKey = false
        that.init()
      }
      // 更新选中sku的库存信息
      let select_sku_info = that.getListItem(
        that.goodsInfo[skuListName],
        that.skuIdName,
        that.selectShop[that.skuIdName],
      )
      Object.assign(that.selectShop, select_sku_info)
      that.defaultSelectSku()
      that.complete = true
    },
    async open() {
      let that = this
      that.openTime = new Date().getTime()
      let findGoodsInfoRun = true
      let skuListName = that.skuListName
      // 先获取缓存中的商品信息
      let useCache = false
      let goodsInfo = goodsCache[that.goodsId]
      if (goodsInfo && that.useCache) {
        useCache = true
        that.updateGoodsInfo(goodsInfo)
      } else {
        that.complete = false
      }
      if (that.customAction && typeof that.customAction === 'function') {
        try {
          goodsInfo = await that
            .customAction({
              useCache,
              goodsId: that.goodsId,
              goodsInfo,
              close: function () {
                setTimeout(function () {
                  that.close()
                }, 500)
              },
            })
            .catch((err) => {
              setTimeout(function () {
                that.close()
              }, 500)
            })
        } catch (err) {
          let { message = '' } = err
          if (message.indexOf('.catch is not a function') > -1) {
            that.toast('custom-action必须返回一个Promise', 'none')
            setTimeout(function () {
              that.close()
            }, 500)
            return false
          }
        }
        // 更新缓存
        goodsCache[that.goodsId] = goodsInfo
        if (goodsInfo && typeof goodsInfo == 'object' && JSON.stringify(goodsInfo) != '{}') {
          findGoodsInfoRun = false
          that.updateGoodsInfo(goodsInfo)
          that.updateValue(true)
        } else {
          that.toast('未获取到商品信息', 'none')
          that.$emit('input', false)
          return false
        }
      } else if (typeof that.localdata !== 'undefined' && that.localdata !== null) {
        goodsInfo = that.localdata
        if (goodsInfo && typeof goodsInfo == 'object' && JSON.stringify(goodsInfo) != '{}') {
          findGoodsInfoRun = false
          that.updateGoodsInfo(goodsInfo)
          that.updateValue(true)
        } else {
          that.toast('未获取到商品信息', 'none')
          that.$emit('input', false)
          return false
        }
      } else {
        if (findGoodsInfoRun) that.findGoodsInfo({ useCache })
      }
    },
    // 监听 - 弹出层收起
    close(s) {
      let that = this
      if (new Date().getTime() - that.openTime < 400) {
        return false
      }
      if (s == 'mask') {
        if (that.maskCloseAble !== false) {
          that.$emit('input', false)
          that.$emit('close', 'mask')
          that.$emit('update:modelValue', false)
        }
      } else {
        that.$emit('input', false)
        that.$emit('close', 'close')
        that.$emit('update:modelValue', false)
      }
    },
    moveHandle() {
      //禁止父元素滑动
    },
    // sku按钮的点击事件
    skuClick(value, index1, index2) {
      let that = this
      if (value.ishow) {
        if (that.selectArr[index1] != value.name) {
          that.$set(that.selectArr, index1, value.name)
          that.$set(that.subIndex, index1, index2)
        } else {
          that.$set(that.selectArr, index1, '')
          that.$set(that.subIndex, index1, -1)
        }
        that.checkInpath(index1)
        // 如果全部选完
        that.checkSelectShop()
      }
    },
    // 检测是否已经选完sku
    checkSelectShop() {
      let that = this
      // 如果全部选完
      if (that.selectArr.every((item) => item != '')) {
        that.selectShop = that.shopItemInfo[that.getArrayToSting(that.selectArr)]
        let stock = that.selectShop[that.stockName]
        if (typeof stock !== 'undefined' && that.selectNum > stock) {
          that.selectNum = stock
        }
        if (that.selectNum > that.maxBuyNum) {
          that.selectNum = that.maxBuyNum
        }
        if (that.selectNum < that.minBuyNum) {
          that.selectNum = that.minBuyNum || 1
        }
        if (that.selectedInit) {
          that.selectNum = that.minBuyNum || 1
        }
        that.getbuy()
      } else {
        that.selectShop = {}
      }
    },
    // 检查路径
    checkInpath(clickIndex) {
      let that = this
      let specListName = that.specListName
      //console.time('筛选可选路径需要的时间是');
      //循环所有属性判断哪些属性可选
      //当前选中的兄弟节点和已选中属性不需要循环
      let specList = that.goodsInfo[specListName]
      for (let i = 0, len = specList.length; i < len; i++) {
        if (i == clickIndex) {
          continue
        }
        let len2 = specList[i].list.length
        for (let j = 0; j < len2; j++) {
          if (that.subIndex[i] != -1 && j == that.subIndex[i]) {
            continue
          }
          let choosed_copy = [...that.selectArr]
          that.$set(choosed_copy, i, specList[i].list[j].name)
          let choosed_copy2 = choosed_copy.filter(
            (item) => item !== '' && typeof item !== 'undefined',
          )
          if (
            Object.prototype.hasOwnProperty.call(
              that.shopItemInfo,
              that.getArrayToSting(choosed_copy2),
            )
          ) {
            specList[i].list[j].ishow = true
          } else {
            specList[i].list[j].ishow = false
          }
        }
      }
      that.$set(that.goodsInfo, specListName, specList)
      // console.timeEnd('筛选可选路径需要的时间是');
    },
    // 计算sku里面规格形成路径
    checkItem() {
      let that = this
      // console.time('计算有多小种可选路径需要的时间是');
      let { stockName } = that
      let skuListName = that.skuListName
      // 去除库存小于等于0的商品sku
      let originalSkuList = that.goodsInfo[skuListName]
      let skuList = []
      let stockNum = 0
      originalSkuList.map((skuItem, index) => {
        if (skuItem[stockName] > 0) {
          skuList.push(skuItem)
          stockNum += skuItem[stockName]
        }
      })
      if (stockNum <= 0) {
        that.outFoStock = true
      }
      // 计算有多小种可选路径
      let result = skuList.reduce(
        (arrs, items) => {
          return arrs.concat(
            items[that.skuArrName].reduce(
              (arr, item) => {
                return arr.concat(
                  arr.map((item2) => {
                    // 利用对象属性的唯一性实现二维数组去重
                    if (
                      !Object.prototype.hasOwnProperty.call(
                        that.shopItemInfo,
                        that.getArrayToSting([...item2, item]),
                      )
                    ) {
                      that.shopItemInfo[that.getArrayToSting([...item2, item])] = items
                    }
                    return [...item2, item]
                  }),
                )
              },
              [[]],
            ),
          )
        },
        [[]],
      )
      // console.timeEnd('计算有多小种可选路径需要的时间是');
    },
    getArrayToSting(arr) {
      let str = ''
      arr.map((item, index) => {
        item = item.replace(/\./g, '。')
        if (index == 0) {
          str += item
        } else {
          str += ',' + item
        }
      })
      return str
    },
    // 检测sku选项是否已全部选完,且有库存
    checkSelectComplete(obj = {}) {
      let that = this
      let clickTime = new Date().getTime()
      if (that.clickTime && clickTime - that.clickTime < 400) {
        return false
      }
      that.clickTime = clickTime
      let { selectShop, selectNum, stockText, stockName } = that
      if (!selectShop || !selectShop[that.skuIdName]) {
        that.toast('请先选择对应规格', 'none')
        return false
      }
      if (selectNum <= 0) {
        that.toast('购买数量必须>0', 'none')
        return false
      }
      // 判断库存
      if (selectNum > selectShop[stockName]) {
        that.toast(stockText + '不足', 'none')
        return false
      }
      if (typeof obj.success == 'function') obj.success(selectShop)
    },
    // 加入购物车
    addCart() {
      let that = this
      that.checkSelectComplete({
        success: function (selectShop) {
          selectShop.buy_num = that.selectNum
          that.$emit('add-cart', selectShop)
          that.$emit('cart', selectShop)
          // setTimeout(function() {
          // 	that.init();
          // }, 300);
        },
      })
    },
    // 立即购买
    buyNow() {
      let that = this
      that.checkSelectComplete({
        success: function (selectShop) {
          selectShop.buy_num = that.selectNum
          that.$emit('buy-now', selectShop)
          that.$emit('buy', selectShop)
        },
      })
    },
    // 弹窗
    toast(title, icon) {
      uni.showToast({
        title: title,
        icon: icon,
      })
    },
    // 获取对象数组中的某一个item,根据指定的键值
    getListItem(list, key, value) {
      let that = this
      let item
      for (let i in list) {
        if (typeof value == 'object') {
          if (JSON.stringify(list[i][key]) === JSON.stringify(value)) {
            item = list[i]
            break
          }
        } else {
          if (list[i][key] === value) {
            item = list[i]
            break
          }
        }
      }
      return item
    },
    getListIndex(list, key, value) {
      let that = this
      let index = -1
      for (let i = 0; i < list.length; i++) {
        if (list[i][key] === value) {
          index = i
          break
        }
      }
      return index
    },
    // 自动选择sku前提是只有一组sku,默认自动选择最前面的有库存的sku
    autoClickSku() {
      let that = this
      let { stockName } = that
      let skuList = that.goodsInfo[that.skuListName]
      let specListArr = that.goodsInfo[that.specListName]
      if (specListArr.length == 1) {
        let specList = specListArr[0].list
        for (let i = 0; i < specList.length; i++) {
          let sku = that.getListItem(skuList, that.skuArrName, [specList[i].name])
          if (sku && sku[stockName] > 0) {
            that.skuClick(specList[i], 0, i)
            break
          }
        }
      }
    },
    // 主题颜色
    themeColorFn(name) {
      let that = this
      let { theme, themeColor } = that
      let color = that[name] ? that[name] : themeColor[theme][name]
      return color
    },
    defaultSelectSku() {
      let that = this
      let { defaultSelect } = that
      if (defaultSelect && defaultSelect.sku && defaultSelect.sku.length > 0) {
        that.selectSku(defaultSelect)
      }
    },
    /**
     * 主动方法 - 设置sku
     that.$refs.skuPopup.selectSku({
        sku:["红色","256G","公开版"],
        num:5
      });
     */
    selectSku(obj = {}) {
      let that = this
      let { sku: skuArr, num: selectNum } = obj
      let specListArr = that.goodsInfo[that.specListName]
      if (skuArr && specListArr.length === skuArr.length) {
        // 先清空
        let skuClickArr = []
        let clickKey = true
        for (let index = 0; index < skuArr.length; index++) {
          let skuName = skuArr[index]
          let specList = specListArr[index].list
          let index1 = index
          let index2 = that.getListIndex(specList, 'name', skuName)
          if (index2 == -1) {
            clickKey = false
            break
          }
          skuClickArr.push({
            spec: specList[index2],
            index1: index1,
            index2: index2,
          })
        }
        if (clickKey) {
          that.init(true)
          skuClickArr.map((item) => {
            that.skuClick(item.spec, item.index1, item.index2)
          })
        }
      }
      if (selectNum > 0) that.selectNum = selectNum
    },
    priceFilter(n = 0) {
      let that = this
      if (typeof n == 'string') {
        n = parseFloat(n)
      }
      if (that.amountType === 0) {
        return n.toFixed(2)
      } else {
        return (n / 100).toFixed(2)
      }
    },
    pushGoodsCache(goodsInfo) {
      let that = this
      let { goodsIdName } = that
      goodsCache[goodsInfo[goodsIdName]] = goodsInfo
    },

    isNaN(val) {
      if (val !== val) {
        return true
      }
      return false
    },
    // 用于阻止冒泡
    stop() {},
    // 图片预览
    previewImage() {
      let that = this
      let { selectShop, goodsInfo, goodsThumbName } = that
      let src = selectShop.image ? selectShop.image : goodsInfo[goodsThumbName]
      if (src) {
        uni.previewImage({
          urls: [src],
        })
      }
    },
    getMaxStock() {
      let maxStock = 0
      let that = this
      let { selectShop = {}, goodsInfo = {}, skuListName, stockName } = that
      if (selectShop[stockName]) {
        maxStock = selectShop[stockName]
      } else {
        let skuList = goodsInfo[skuListName]
        if (skuList && skuList.length > 0) {
          let valueArr = []
          skuList.map((skuItem, index) => {
            valueArr.push(skuItem[stockName])
          })
          let max = Math.max(...valueArr)
          maxStock = max
        }
      }
      return maxStock
    },
    numChange(e) {
      this.$emit('num-change', e.value)
      this.getbuy()
    },
    getbuy() {
      let that = this
      that.checkSelectComplete({
        success: function (selectShop) {
          selectShop.buy_num = that.selectNum

          that.$emit('buychange', selectShop)
        },
      })
    },
  },
  // 计算属性
  computed: {
    valueCom() {
      // #ifdef VUE2
      return this.value
      // #endif

      // #ifdef VUE3
      return this.modelValue
      // #endif
    },
    // 最大购买数量
    maxBuyNumCom() {
      let that = this
      let maxStock = that.getMaxStock()
      let max = that.maxBuyNum || 100000
      // 最大购买量不能超过当前商品的库存
      if (max > maxStock) {
        max = maxStock
      }
      return max
    },
    // 是否是多规格
    isManyCom() {
      let that = this
      let { goodsInfo, defaultSingleSkuName, specListName } = that
      let isMany = true
      if (
        goodsInfo[specListName] &&
        goodsInfo[specListName].length === 1 &&
        goodsInfo[specListName][0].list.length === 1 &&
        goodsInfo[specListName][0].name === defaultSingleSkuName
      ) {
        isMany = false
      }
      return isMany
    },
    // 默认价格区间计算
    priceCom() {
      let str = ''
      let that = this
      let { selectShop = {}, goodsInfo = {}, skuListName, skuIdName } = that
      if (selectShop[skuIdName]) {
        str = that.priceFilter(selectShop.price)
      } else {
        let skuList = goodsInfo[skuListName]
        if (skuList && skuList.length > 0) {
          let valueArr = []
          skuList.map((skuItem, index) => {
            valueArr.push(skuItem.price)
          })
          let min = that.priceFilter(Math.min(...valueArr))
          let max = that.priceFilter(Math.max(...valueArr))
          if (min === max) {
            str = min + ''
          } else {
            str = `${min * 1} - ${max * 1}`
          }
        }
      }
      return str
    },
    // 库存显示
    stockCom() {
      let str = ''
      let that = this
      let { selectShop = {}, goodsInfo = {}, skuListName, stockName } = that
      if (selectShop[stockName]) {
        str = selectShop[stockName]
      } else {
        let skuList = goodsInfo[skuListName]
        if (skuList && skuList.length > 0) {
          let valueArr = []
          skuList.map((skuItem, index) => {
            valueArr.push(skuItem[stockName])
          })
          let min = Math.min(...valueArr)
          let max = Math.max(...valueArr)
          if (min === max) {
            str = min
          } else {
            str = `${min} - ${max}`
          }
        }
      }
      return str
    },
  },
  watch: {
    valueCom(newVal, oldValue) {
      let that = this
      if (newVal) {
        that.open()
      }
    },
    couponList: {
      immediate: true,
      handler: function (newVal, oldValue) {
        let that = this
        that.quanlist = newVal
      },
    },

    defaultGoods: {
      immediate: true,
      handler: function (newVal, oldValue) {
        let that = this
        let { goodsIdName } = that
        if (
          typeof newVal === 'object' &&
          newVal &&
          newVal[goodsIdName] &&
          !goodsCache[newVal[goodsIdName]]
        ) {
          that.pushGoodsCache(newVal)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
/*  sku弹出层 */
.vk-data-goods-sku-popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 990;
  overflow: hidden;

  &.show {
    display: block;

    .mask {
      animation: showPopup 0.2s linear both;
    }

    .layer {
      bottom: var(--window-bottom);
      animation: showLayer 0.2s linear both;
    }
  }

  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  &.none {
    display: none;
  }

  .mask {
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .layer {
    // min-height: 40vh;
    // max-height: 1014rpx;
    position: fixed;
    bottom: 0;
    z-index: 99;
    display: flex;
    // height: 1014rpx;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    border-radius: 10rpx 10rpx 0 0;

    .specification-wrapper {
      box-sizing: border-box;
      width: 100%;
      padding: 30rpx 25rpx;

      .specification-wrapper-content {
        width: 100%;
        min-height: 300rpx;
        max-height: 900rpx;

        &::-webkit-scrollbar {
          /*隐藏滚轮*/
          display: none;
        }

        .specification-header {
          position: relative;
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-bottom: 40rpx;

          .specification-left {
            flex: 0 0 156rpx;
            width: 156rpx;
            height: 158rpx;

            .product-img {
              width: 156rpx;
              height: 156rpx;
            }
          }

          .specification-right {
            box-sizing: border-box;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 35rpx 0 32rpx;
            font-weight: 500;

            .price-content {
              color: #f44d24;

              .sign {
                font-size: 48rpx;
                font-weight: 550;
              }

              .price {
                margin-left: 4rpx;
                font-size: 48rpx;
                font-weight: 550;
              }

              .price2 {
                margin-left: 4rpx;
                font-size: 36rpx;
              }
            }

            .inventory {
              font-size: 24rpx;
              color: #757575;
            }

            .choose {
              font-size: 28rpx;
              color: #333333;
            }
          }
        }

        .specification-content {
          font-weight: 500;

          .specification-item {
            margin-bottom: 40rpx;

            &:last-child {
              margin-bottom: 0;
            }

            .item-title {
              margin-bottom: 20rpx;
              font-size: 28rpx;
              color: #333333;
            }

            .item-wrapper {
              display: flex;
              flex-direction: row;
              flex-flow: wrap;

              .item-content {
                box-sizing: border-box;
                display: inline-block;
                padding: 10rpx 35rpx;
                margin-right: 20rpx;
                margin-bottom: 16rpx;
                font-size: 24rpx;
                color: #333333;
                background-color: #f0f2f7;

                &.actived {
                  color: #f44d24;
                  background-color: #ffece8;
                }

                &.noactived {
                  color: #c3c3c3;
                  background-color: #f6f6f6;
                  border-color: #f6f6f6;
                }
              }
            }
          }

          .number-box-view {
            display: flex !important;
            padding-top: 30rpx;
            justify-content: space-between;
            align-items: center;
          }
        }
      }

      .close {
        position: absolute;
        top: 30rpx;
        right: 25rpx;
        width: 50rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        transform: rotate(45deg);
        color: #000;
        font-size: 30px;
      }
    }

    .btn-wrapper {
      box-sizing: border-box;
      display: flex;
      flex: 0 0 120rpx;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 120rpx;
      padding: 0 26rpx;

      .layer-btn {
        width: 335rpx;
        height: 76rpx;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 76rpx;
        color: #fff;
        text-align: center;
        border-radius: 38rpx;

        &.add-cart {
          background: #ffbe46;
        }

        &.buy {
          background: #f44d24;
        }
      }

      .sure {
        width: 698rpx;
        height: 68rpx;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 68rpx;
        color: #fff;
        text-align: center;
        background: #f44d24;
        border-radius: 38rpx;
      }

      .sure.add-cart {
        background: #ff9402;
      }
    }

    .btn-wrapper.safe-area-inset-bottom {
      padding-bottom: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  @keyframes showPopup {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes hidePopup {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(120%);
    }
  }
}
</style>
