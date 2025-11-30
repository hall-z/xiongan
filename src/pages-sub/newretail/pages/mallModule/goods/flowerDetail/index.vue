<template>
  <!--<template is="add-cart-animation" :data=""></template>-->
  <view>
    <!-- <navigationBar id="navigation" title="{{state.navigationBarTitle}}" background="color: rgba(0,0,0,0)"
  style="position: absolute;top: 0;"></navigationBar> -->
    <navigationBar
      id="navigation"
      :title="state.productPlacedAtTheTop ? ' ' : state.navigationBarTitle"
      :background="state.productPlacedAtTheTop ? 'color: rgba(0,0,0,0)' : ''"
      :style="state.productPlacedAtTheTop ? 'position: absolute;top: 0;' : ''"
    ></navigationBar>

    <scroll-view
      class="page-content"
      :scroll-y="true"
      @scroll="scrollFun"
      :scroll-into-view="'t' + manualScrollTop"
    >
      <!-- 商品图片轮播 -->
      <view class="swiperContainer" :id="'products-' + state.goodsId">
        <swiper
          class="swiper"
          @change="swiperChange"
          :autoplay="state.isAutoplay"
          interval="5000"
          circular="true"
        >
          <view v-for="(item, index) in state.productPictures" :key="index">
            <swiper-item class="swiper-item">
              <image
                v-if="item.fileType == 'PICTURE' || !item.fileType"
                :src="item.imageUrl || item.url"
                class="slide-image"
                width="355"
                height="150"
              ></image>
              <video
                v-if="item.fileType == 'VIDEO'"
                :src="item.imageUrl || item.url"
                autoplay=""
                show-mute-btn="true"
                loop=""
                style="position: absolute; top: 50%; transform: translateY(-50%); width: 100%"
                class="slide-video"
              ></video>
            </swiper-item>
          </view>
        </swiper>
        <view class="imageCount" style="bottom: 136rpx">
          {{ state.current }}/{{ state.productPictures.length }}
        </view>
      </view>
      <!-- 商品名称价格等 -->
      <view class="goods-info-box" style="width: 100%">
        <view class="goods-price">
          <image
            :src="state.imagesPath.activity_bg_bottom"
            mode="widthFix"
            class="activity-bg-bottom"
          ></image>
          <image
            :src="state.imagesPath.activity_bg_top"
            mode="widthFix"
            class="activity-bg-top"
          ></image>
          <!-- <image class="activity-bg-right" src="{{imagesPath.team_right_icon}}" ></image> -->
          <view class="activity-info">
            <view class="activity-info-name">周期购</view>
            <!-- <text>￥{{activityPriceMin || 0}}<text style="padding-left: 4rpx;font-size: 24rpx">{{activityPriceMax != activityPriceMin ? '起' : ''}}</text></text> -->
            <text>
              ￥{{ state.activityPriceMin || 0
              }}{{
                activityPriceMin != activityPriceMax && activityPriceMax > 0
                  ? '-' + activityPriceMax
                  : ''
              }}
            </text>
            <!-- <text>￥{{maxSalesPrice || 0}}</text> -->
            <text>
              ￥{{ miniSalesPrice || 0
              }}{{
                miniSalesPrice != maxSalesPrice && maxSalesPrice > 0 ? '-' + maxSalesPrice : ''
              }}
            </text>
          </view>
        </view>
        <view class="goods-name">
          <view>{{ state.details.cycleName }}</view>
        </view>
        <view class="goods-describe" v-if="state.details.cycleDescribe">
          {{ state.details.cycleDescribe }}
        </view>
        <!-- <view class='share-reamin' bindtap='handleClickShare'>
      <image src="{{state.imagesPath.share_icon}}" ></image> 分享
    </view> -->
        <view class="share-reamin" @click="handleClickShare">
          <image :src="state.imagesPath.share_shopping_cart"></image>
          <view>分享</view>
        </view>
        <view class="sold_box">
          <view
            class="goods-soldNum"
            :style="'color:' + (state.details.totalOrderLimit <= 10 ? '#FF7121' : '#000000') + ';'"
          >
            <text>库存</text>
            {{ details.totalOrderLimit || 0 }}
          </view>
          <view class="goods-soldNum">
            <text>已售</text>
            {{ state.details.totalOrder ? state.details.totalOrder : 0 }}
          </view>
          <!-- <view class="desc-soldNum" wx:if="{{state.isTeam || state.isSecKill}}">
        <text class="goods-soldNum" style="color: #000000;"><text>已售</text> {{soldCount ? soldCount : 0}}</text>
        <text class="share-commission" style="color:{{state.themeColor}}"
          wx:if="{{systemOptions.hasDistributionCenter && isDistributor && commissionTotal > 0}}">分享可得佣金:
          ￥{{commissionTotal}}</text>
      </view> -->
        </view>
        <view class="goods-delivery-info" v-if="storeInfo.merchantDelivery">
          <image :src="state.imagesPath.iconStoreSelfDelivery" mode="widthFix"></image>
          {{ storeSelfDeliveryInfo.content }}
        </view>
      </view>
      <!-- 商品自定义栏目 页眉 -->
      <good-attr
        :columnDTOS="state.columnDTOSHeader"
        @changeShow="changeShow"
        v-if="state.columnDTOSHeader && state.columnDTOSHeader.length > 0"
      ></good-attr>
      <!-- 图文详情 -->
      <view class="goods-imgtext" id="productDetails" v-if="productDetails.length > 0">
        <text>图文详情</text>
        <view v-for="(item, index) in state.goodsInfo.productDetails" :key="index">
          <image
            show-menu-by-longpress="true"
            v-if="item.fileType == 'PICTURE' || !item.fileType"
            :src="item.url"
            mode="widthFix"
          ></image>
          <video
            v-if="item.fileType == 'VIDEO'"
            :src="item.url"
            show-mute-btn="true"
            loop=""
            style="width: 100%"
            class="slide-video"
          ></video>
        </view>
        <!-- <image  src="/utils/image/dateil.png"  style="width: 100%;height: 616rpx;"></image> -->
      </view>
      <!-- 商品自定义栏目 页脚 -->
      <good-attr
        :columnDTOS="state.columnDTOSFooter"
        @changeShow="changeShow"
        v-if="state.columnDTOSFooter && state.columnDTOSFooter.length > 0"
      ></good-attr>
      <!-- 商品评论 -->
      <view class="goods-comment" :hidden="state.commentList.length === 0 ? true : false">
        <view class="comment-title">商品评价({{ state.commentNum }})</view>
        <view v-for="(item, index) in state.commentList" :key="index">
          <!--<template is="commentItem" :data="item, state.imagesPath"></template>-->
        </view>
        <view
          class="more"
          @click="toGoodsComment"
          :style="'color:' + state.themeColor + ';border-color:' + state.themeColor + ';'"
        >
          查看全部评价
        </view>
      </view>
      <!-- 推荐商品 -->
      <view
        class="recommend-section"
        :hidden="!state.relatedProductList || state.relatedProductList.length === 0"
      >
        <view class="recommend-title">关联商品</view>
        <scroll-view scroll-x="" style="width: 100%" class="relevant-scrollview">
          <view v-for="(item, index) in state.relatedProductList" :key="index">
            <goods-item-small
              :goods="item"
              :goodsWidth="'230rpx'"
              style="display: inline-block; margin-right: 32rpx"
              :hasUserInfo="state.hasUserInfo"
              @onClickGoods="onClickGoods"
              @addToCart="addToCart"
              @noop="noop"
              @getUserInfo="onGetUserInfo"
            ></goods-item-small>
          </view>
        </scroll-view>
        <!-- <view class="recommend-list">
      <view class="recommend-item">
        <image src="https://img.freepik.com/free-photo/beautiful-bouquet-tulips_24837-2088.jpg" mode="aspectFill"></image>
        
        <text class="recommend-name">郁金香混搭花束</text>
        <text class="recommend-price" style="color: {{state.themeColor}};">¥299</text>
      </view>
      <view class="recommend-item">
        <image src="https://img.freepik.com/free-photo/pink-roses-bouquet-with-eucalyptus_24837-2272.jpg"
          mode="aspectFill">
        <text class="recommend-name">玫瑰混搭花束</text>
        <text class="recommend-price" style="color: {{state.themeColor}};">¥399</text>
      </view>
    </view> -->
      </view>
      <view class="botton-block"></view>
      <!-- 底部按钮 -->
      <view class="handle-box">
        <view class="home-icon" @click="toHomePage" style="margin-top: -30rpx">
          <image :src="state.imagesPath.home_icon"></image>
          <text>主页</text>
        </view>
        <view @click="toShopCart" class="shopcart-icon" style="margin-top: -30rpx">
          <image :src="state.imagesPath.shopping_icon"></image>
          <text>购物车</text>
          <view v-if="state.shopCartNum > 0">
            <view class="badge">{{ state.shopCartNum }}</view>
          </view>
        </view>
        <view
          @click="isOpenCustomerService ? '' : 'callPhone'"
          class="contact-icon"
          style="margin-top: -30rpx"
        >
          <button v-if="isOpenCustomerService" open-type="contact">
            <image :src="state.imagesPath.iconCustomerService"></image>
            <text>客服</text>
          </button>
        </view>
        <view
          :style="'border: 1px solid ' + state.themeColor + ';'"
          :class="'normal-button ' + (state.goodsInfo.balance <= 0 ? '' : 'no-goods') + ' no-goods'"
        >
          <form @submit="openGoodsSpecs" @click.stop="addShopCartCatch">
            <button
              form-type="submit"
              style="background-color: #c1c1c1"
              :data-id="state.goodsInfo.id"
              data-addtype="buyNow"
              v-if="state.details.status !== 'IN_PROGRESS'"
            >
              活动未开始
            </button>
            <button
              form-type="submit"
              style="background-color: #c1c1c1"
              :data-id="state.goodsInfo.id"
              data-addtype="buyNow"
              v-else-if="state.details.storeStatue === 'OFF'"
            >
              已下架
            </button>
            <button
              form-type="submit"
              style="background-color: #c1c1c1"
              :data-id="state.goodsInfo.id"
              data-addtype="buyNow"
              v-else-if="
                state.details.totalOrderLimit <= state.details.totalOrder ||
                state.details.storeQty <= 0
              "
            >
              已售罄
            </button>
            <button
              form-type="submit"
              :style="'background-color: ' + state.themeColor"
              :data-id="state.goodsInfo.id"
              data-addtype="buyNow"
              v-else-if="state.details.storeStatue === 'ON'"
            >
              立即购买
            </button>
          </form>
          <!-- <block wx:if="{{soldOut === true}}">
        <button class="soldOut-good">
          已下架
        </button>
      </block>
      <block wx:else>
        <block wx:if="{{state.goodsInfo.balance > 0}}">
          <button wx:if="{{!state.hasUserInfo}}" style="background-color: {{state.themeColor}}"
            bindtap="getUserInfo">{{state.goodsInfo.balance > 0 ? '加入购物车' : '已售罄'}}</button>
          <block wx:else>
            <form bindsubmit="openGoodsSpecs" catchtap="addShopCartCatch" class="f1">
              <button class="add-cart" style="color: {{state.themeColor}}" form-type="submit" data-id="{{state.goodsInfo.id}}"
                data-addtype="detail">加入购物车</button>
            </form>
            <form bindsubmit="openGoodsSpecs" catchtap="addShopCartCatch">
              <button form-type="submit" style="background-color: {{state.themeColor}}" data-id="{{state.goodsInfo.id}}"
                data-addtype="buyNow">立即购买</button>
            </form>
          </block>
        </block>
        <block wx:else>
          <form wx:if="{{!state.hasUserInfo}}" bindsubmit="openGoodsSpecs" catchtap="addShopCartCatch">
            <button form-type="submit" style="background-color: {{state.themeColor}}" data-id="{{state.goodsInfo.id}}"
              data-addtype="buyNow">立即购买</button>
          </form>
          <block wx:else>
            <form bindsubmit="openGoodsSpecs" catchtap="addShopCartCatch">
              <button class="btnw" form-type="submit" style="background-color: {{state.themeColor}}" data-id="{{state.goodsId}}"
                data-addtype="detail">已售罄</button>
            </form>
          </block>
        </block>
      </block> -->
        </view>
      </view>
      <view class="share-picture">
        <canvas
          canvas-id="pictureShareCanvas"
          style="
            width: 574rpx;
            height: 460rpx;
            display: block;
            position: fixed;
            left: 9999px;
            bottom: 0;
          "
        ></canvas>
      </view>
    </scroll-view>
    <share
      :show="state.showSharePop"
      :share-data="state.shareData"
      :specificationsFlag="state.activityPriceMin != state.activityPriceMax"
      @close="closeSharePop"
      :type="state.goodType"
    ></share>
    <popup
      :show="state.detailPopup"
      position="bottom"
      custom-class="bottom"
      @close="toggleGoodsNormalPopup"
    >
      <view class="spec-box">
        <view class="spec-close-box" @click="toggleGoodsNormalPopup">
          <!-- <image src='{{imagesPath.iconCloseImg}}' mode="widthFix"></image> -->
          <image :src="state.imagesPath.category_close" mode="widthFix"></image>
        </view>
        <view class="spec-hd">
          <view class="spec-img-box">
            <image
              v-if="state.cycleDateInfo.imageUrl"
              :src="state.cycleDateInfo.imageUrl"
              @click="previewImg"
            ></image>
            <image v-else :src="state.goodsInfo.imageUrl" @click="previewImg"></image>
          </view>
          <view class="spec-right">
            <view class="title">{{ state.details.cycleName }}</view>
            <view class="price">
              <text>￥{{ state.showPopDetails.activityPrice || 0 }}</text>
              <text>￥{{ state.showPopDetails.salesPrice }}</text>
            </view>
            <view class="spec-right-num">
              <text>库存{{ details.totalOrderLimit || 0 }}</text>
              <text>已售{{ state.details.totalOrder ? state.details.totalOrder : 0 }}</text>
            </view>
          </view>
        </view>
        <view class="spec-date-scroll">
          <view class="spec-date">
            <view class="hd">订购周期</view>
            <view
              class="item-spec"
              v-for="(item, index) in state.details.fixedDTOS"
              :data-index="index"
              @click="doChechCycleActive"
              :style="
                state.cycleActive == index
                  ? 'background-color: ' + state.themeColor + ';color:#fff;'
                  : ''
              "
            >
              {{ item.fixedName }}
            </view>
          </view>
          <view class="spec-gift" v-if="state.cycleDateInfo.giftDTOS.length > 0">
            <view class="hd"><text>赠品</text></view>
            <checkbox-group>
              <view class="gift-content">
                <view
                  class="gift-content-item"
                  v-for="(item, index) in state.cycleDateInfo.giftDTOS"
                  :data-index="index"
                  @click="doChechCycleActiveGift"
                  :style="'border-color: ' + (item.check ? state.themeColor : 'transparent') + ';'"
                >
                  <view>
                    <checkbox :checked="item.check" :color="state.themeColor"></checkbox>
                  </view>
                  <view class="content-item">
                    <view class="content-item-img">
                      <image :src="item.pictureUrl" mode="aspectFit"></image>
                    </view>
                    <view class="content-item-goodsname">
                      {{ item.productName }}x{{ item.quantity }}
                    </view>
                    <view
                      class="content-item-price"
                      :style="!item.price ? 'justify-content: center;margin-left:0;' : ''"
                    >
                      <text class="nwe-price" :style="!item.price ? 'margin-left:0;' : ''">
                        ￥0
                      </text>
                      <text class="old-price" v-if="item.price">￥{{ item.price }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </checkbox-group>
          </view>
          <view class="spec-time" v-if="state.details.cycleType === 'WEEK'">
            <view class="hd">
              <text>配送周期</text>
              <text :style="'color: ' + state.themeColor + ';'">
                第一期：{{ state.weekMap[cycleDataActive].cycleTime }}({{
                  state.weekMap[cycleDataActive].weekDay
                }})
              </text>
            </view>
            <view class="content">
              <view
                class="item"
                v-for="(item, index) in state.weekMap"
                :data-index="index"
                :style="
                  state.cycleDataActive == index
                    ? 'background-color: ' + state.themeColor + ';color:#fff;'
                    : ''
                "
                @click="doChechCycDateActive"
              >
                {{ item.weekDay }}
              </view>
            </view>
          </view>
          <view class="spec-time spec-time2" v-if="state.details.cycleType === 'APPOINT_TIME'">
            <view class="hd">
              <text>配送周期</text>
              <!-- <text style="color: {{state.themeColor}};"
            wx:if="{{state.dates}}">第一期：{{state.dates[0].cycleTimeName ? state.dates[0].cycleTimeName : ''}} {{state.dates[0].cycleTime}}({{state.dates[0].weekDay}})</text> -->
              <view
                class="fixed-right"
                :style="'color: ' + state.themeColor + ';'"
                v-if="state.details.chooseTimeDTOS && state.details.chooseTimeDTOS.length > 0"
              >
                <picker
                  mode="selector"
                  @click="doShowUpdateTime"
                  :data-id="item.id"
                  @change="doUpdateTime"
                  :value="index"
                  :range="state.details.chooseTimeDTOS"
                  range-key="showTimeName"
                >
                  第一期：{{ state.details.chooseTimeDTOS[currentChooseTime].cycleTimeName }}
                  {{ state.details.chooseTimeDTOS[currentChooseTime].cycleTime }}({{
                    state.details.chooseTimeDTOS[currentChooseTime].weekDay
                  }})
                </picker>
                <text
                  class="iconfont2 icon-xiugai"
                  style="
                    display: inline-block;
                    margin-left: 8rpx;
                    margin-bottom: -4rpx;
                    font-size: 24rpx;
                  "
                ></text>
              </view>
              <!-- <text 
            bindtap="doChangeFirst">
            
          </text> -->
            </view>
            <view class="content">
              <view v-for="(item, index) in state.dates">
                <view>第{{ index + 1 }}期</view>
                <view>
                  {{ item.cycleTime }}
                  ({{ item.weekDay }})
                </view>
                <view>
                  {{ item.cycleTimeName ? item.cycleTimeName : '' }}
                </view>
              </view>
              <!-- <view class="item"wx:for="{{state.dates}}" data-index="{{index}}"
          style="{{state.cycleDataActive == index ? 'background-color: ' + state.themeColor + ';color:#fff;' : ''}}"
          bindtap="doChechCycDateActive">{{item[1]}}</view> -->
            </view>
          </view>
        </view>
        <view class="spec-button-box">
          <form @submit="cycleByFixedDataFlag ? 'confirm' : ''" @click.stop="noop">
            <button
              form-type="submit"
              class="spec-button"
              :style="'background: ' + (state.cycleByFixedDataFlag ? state.themeColor : '#999')"
              data-addtype="detail"
            >
              确定
            </button>
          </form>
        </view>
      </view>
    </popup>
    <authorize @login="handleUserLogin"></authorize>
  </view>
</template>
<script setup>
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsFlyJs from '@/utils/newretail/fly'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiCommentServiceJs from '@/service/api/newretail/commentService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _apiCycleServiceJs from '@/service/api/newretail/cycleService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
// import { onShow, onReady, onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
const app = getApp()

const themeManager = _utilsThemeManagerJs
const IMGAGESPATH = _utilsImagesPathJs
const cycleService = _apiCycleServiceJs
const AUTHORIZE = _utilsAuthorizeJs
const NAVPAGE = _utilsNavPageJs
const util = _utilsUtilsJs
const memberService = _apiMemberServiceJs
const commentService = _apiCommentServiceJs
const shopcartService = _apiShopcartServiceJs
const FLY = _utilsFlyJs
const ADDRESS = _utilsAddressJs
const storeService = _apiStoreServiceJs
const productService = _apiProductServiceJs
const sysService = _apiSystemServiceJs
const wxaUserService = _apiWxaUserServiceJs

// 全局变量
let canAddToCart = true
let changeCanAddToCart = false

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
const state = reactive({
  cycleByFixedDataFlag: true,
  relatedProductList: [],
  productPlacedAtTheTop: false,
  current: 1,
  isAutoplay: true,
  // 轮播图是否自动轮播
  columnDTOSHeader: [],
  // 商品自定义属性 页眉
  columnDTOSFooter: [],
  // 商品自定义属性 页脚
  activityPriceMin: 0,
  // 活动最低价
  activityPriceMax: 0,
  // 活动最低价
  cycleActive: 0,
  // 订购周期当前选择项
  cycleDataActive: 0,
  // 配送周期当前选项
  cycleDateInfo: [],
  keys: [],
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  weekMap: [],
  dates: [],
  options: {},
  goodsId: '',
  detailPopup: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  imagesPath: IMGAGESPATH,
  theme: themeManager,
  specsExpanded: false,
  navigationBarTitle: '周期购',
  brandExpanded: false,
  returnExpanded: false,
  productPictures: [],
  hasUserInfo: false,
  isMember: false,
  goodType: 'normal',
  details: {},
  showSharePop: false,
  shareData: {},
  member: {},
  score: 0,
  goodsList: [],
  goodsInfo: {
    // id: 1,
    // title: '花露•雅致混搭包月鲜花',
    // price: 399,
    // originalPrice: 599,
    // sales: 999,
    // sold: 29,
    // images: ['/image/demo/flower1.jpg'],
    // specs: [
    //   { label: '花材', value: '混搭玫瑰' },
    //   { label: '枝数', value: '9枝' },
    //   { label: '包装', value: '精美礼盒' }
    // ]
  },
  showDatesText: '',
  //
  showPopDetails: '',
  // 当前选择的订购周期数据
  inventory: '',
  isSuccess: true,
  // 是否能提交订单
  commentList: [],
  // 商品评价
  commentNum: 0,
  // 评价数
  currentChooseTime: 0,
  // 当前选择的第一期配送时间
  // 购物车相关
  hide_good_box: true,
  animation: {},
  shopCart: {},
  // 购物车商品数量
  shopCartGoodsId: [],
  // 购物车商品id列表
  goodsBoxImage: '',
  bus_x: 0,
  bus_y: 0,
  ctime: 0,
  shopCartNum: 0,
  isSecKill: false,
  isTeam: false,
  grabData: {},
  business: '',
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  goodsDetail: {},
  secKillInfo: {},
  activityId: '',
  scource: '',
  productId: '',
  grabProductNum: 0,
})
onShow(function () {
  state.cycleActive = 0
  state.cycleDataActive = 0
})
onReady(function () {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  state.productPlacedAtTheTop = app && app.globalData ? app.globalData.productPlacedAtTheTop : false
})
onLoad(function (_options) {
  // 保存options到实例
  options = _options || {}

  // 初始化customData
  customData = {}

  // 初始化购物车动画
  if (app.globalData && app.globalData.addToCart) {
    addcart = new app.globalData.addToCart()
  }

  // 添加性能监控
  const performance = uni.getPerformance()
  const observer = performance.createObserver((entryList) => {
    console.log('性能数据：', entryList.getEntries())
  })
  observer.observe({
    entryTypes: ['render', 'script', 'navigation'],
  })
  console.log(_options, 'options')
  console.log(app.globalData.userInfo, 'options')
  if (!_options || (!_options.storeId && !_options.scene)) {
    state.storeId =
      app.globalData.distributionStore && app.globalData.distributionStore.id
        ? app.globalData.distributionStore.id
        : state.storeId
  }
  const that = this
  if (!app.globalData.userInfo) {
    uni.showModal({
      title: '温馨提示',
      content: '亲，授权登录后才能查看商品信息',
      success(res) {
        if (res.confirm) {
          state.options = _options
          getUserInfo()
        } else {
          uni.showToast({
            title: '您取消了授权',
            icon: 'none',
            duration: 2000,
          })
        }
      },
    })
  }
  if (_options) {
    if (_options.scene) {
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      const scene = decodeURIComponent(_options.scene)
      if (scene.indexOf('gmparam:') >= 0) {
        const sceneArr = scene.split('gmparam:')
        const _sceneId = sceneArr[1]
        sceneId = _sceneId != null ? _sceneId : null
        getSceneById(sceneId)
      } else {
        const sceneArr = scene.split(',')
        _options.id = sceneArr[0]
        options.id = sceneArr[0]
        _options.type = sceneArr[1]
        options.type = sceneArr[1]
      }
    } else {
      if (_options.id) {
        state.goodsId = _options.id
      }
      if (_options.storeId) {
        state.storeId = _options.storeId
        getStoreInfoById(_options.storeId)
      } else {
        if (!sceneId) {
          if (app.globalData.storeInfo) {
            // this.getCycleProduct();
            getStoreInfoById(app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id)
          } else {
            checkLocationAuth(_options)
          }
        }
      }
    }
  }
  getSharePictures()

  // 查询购物车数量
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      if (app.globalData.systemConfigure && app.globalData.systemConfigure.showCartModule) {
        queryShopcart()
      }
    }
  }
})
function getSceneById(id) {
  const self = this
  wxaUserService
    .getSceneById(id)
    .then((res) => {
      function urlToObj(str) {
        const obj = {}
        const arr = str.split('&')
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i].split('=')
          obj[ele[0]] = ele[1]
        }
        return obj
      }
      const _options2 = urlToObj(res)
      options = _options2
      // options.storeId = null;
      const storeId = _options2.storeId || state.storeId
      state.storeId = storeId
      state.goodsId = _options2.id
      if (_options2.storeId) {
        // 注释回到首页不修改门店逻辑，如需要放开注释即可
        // wx.setStorageSync('setTip', true)
        if (app.globalData.storeInfo) {
          app.globalData.storeInfo.id = storeId
        } else {
          app.globalData.storeInfo = {
            id: storeId,
          }
        }
        uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
        getStoreInfoById(_options2.storeId)
      } else {
        if (app.globalData.storeInfo) {
          getCycleProduct()
        } else {
          getRecentlyStore({
            storeId,
          })
        }
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function getStoreInfoById(id) {
  const that = this
  storeService
    .getById(id)
    .then((res) => {
      app.globalData.storeInfo = {
        ...res,
        id: res.virtualStore == 1 ? res.parentId : res.id,
        virtualStoreId: res.id,
      }
      uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
      state.storeInfo = {
        ...res,
        id: res.virtualStore == 1 ? res.parentId : res.id,
        virtualStoreId: res.id,
      }
      state.storeId = app.globalData.storeInfo.id
      getCycleProduct()
    })
    .catch((err) => {
      util.showToast(err.message)
      getCycleProduct()
    })
}
function toGoodsComment() {
  const opts = '?productId=' + state.details.productDetailsDTO.id
  NAVPAGE.toGoodsComment(opts)
}
function hideTel(tel) {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  tel = tel.replace(reg, '$1****$2')
  return tel
}
function getRelatedProducts(storeId, productId) {
  const self = this
  insideGetRelatedProducts(storeId, productId)
  function insideGetRelatedProducts(storeId, productId) {
    productService.getRelatedProducts(storeId, productId).then((res) => {
      if (res) {
        state.relatedProductList = res
      }
    })
  }
}
function getProductsComment(productId) {
  const self = this
  const postData = {
    page: 1,
    pageSize: 1,
    productId,
    status: 'NORMAL',
    searchCount: true,
    includeSiblings: true,
  }
  commentService
    .query(postData)
    .then((res) => {
      const tempList = []
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          let tempItem = {
            ...item,
            mobile: hideTel(item.mobile),
            avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait,
          }
          if (item.createTime) {
            // let timeArr = item.createTime.split(' ')
            // let dayArr = timeArr['0'].split('-')
            // let time = dayArr[0] + '年' + dayArr[1] + '月'
            tempItem = {
              ...tempItem,
              time: item.createTime,
            }
          }
          tempList.push(tempItem)
        })
        // tempList.forEach((item, index) => {
        //     item.pictures.forEach(item1 => {
        //         selfA.getTemporaryUrl(item1.url)
        //             .then(res => {
        //                 item1.url = res;
        //                 if (index >= tempList.length - 1) {
        //                     self.setData({
        //                         commentList: tempList
        //                     })
        //                 }
        //             })
        //     })
        // })
        state.commentList = tempList
      }
      state.commentNum = res.recordCount
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
function closeSharePop() {
  state.showSharePop = false
}
function toShopCart() {
  NAVPAGE.toShopcart()
}
function callPhone() {
  const picture = state.productPictures[0].url
  const title = state.details.cycleName
  const sellPrice = state.showPopDetails.activityPrice
  const description = state.details.cycleDescribe
  // wx.navigateTo({
  //     url: `/pages/mallModule/order/qiyu/index?goodsId=${this.data.goodsId}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}`,
  // })
  NAVPAGE.toCustomService(
    `?goodsId=${state.goodsId}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}`,
  )
}
function toHomePage() {
  NAVPAGE.toHome()
}
function buyNow(e) {
  console.log('buyNow')
  const that = this
  const loginStatus = checkAuth()
  console.log(loginStatus, 'loginStatus')
  console.log(state.isMember, 'loginStatus')
  if (loginStatus && state.isMember) {
    if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
      util.showToast('该活动仅限新会员专享哦~', 2000)
    } else {
      state.goodsInfo.balance = 2
      console.log(state.details, 'that.data.details')
      if (state.details.totalOrderLimit > 0) {
        if (state.isCateringMeals && hasChooseOutcome !== true) {
          // 餐饮套餐商品
          state.scource = 'BUYNOW'
          _addShopcart(state.goodsList[0].id)
          return
        }
        try {
          const store =
            state.details.productDetailsDTO.business === 'DISTRIBUTION'
              ? app.globalData.distributionStore.id
              : app.globalData.storeInfo.id
          const allPrice = state.goodsInfo.sellPrice || state.goodsInfo.originalPrice || 2
          // let cycleDes = that.details.cycleType === 'WEEK' ?
          console.log(
            state.details.fixedDTOS[state.cycleActive].id,
            'that.data.details.fixedDTOS[that.data.cycleActive].id',
          )
          console.log(
            state.details.fixedDTOS[state.cycleActive].fixedName,
            'that.data.details.fixedDTOS[that.data.cycleActive].id',
          )
          const firstTime =
            state.details.cycleType === 'WEEK'
              ? `${state.weekMap[state.cycleDataActive][1]} (${state.week[state.weekMap[state.cycleDataActive][0] - 1]})`
              : `${state.dates[state.cycleDataActive][1]} (${[state.dates[state.cycleDataActive][0] - 1]})`
          let showFirstTime = ''
          if (state.details.cycleType === 'WEEK') {
            showFirstTime = `第一期：${state.weekMap[state.cycleDataActive].cycleTime} (${state.weekMap[state.cycleDataActive].weekDay})`
          } else {
            // showFirstTime = `第一期：${that.data.dates[that.data.cycleDataActive].cycleTimeName?that.data.dates[that.data.cycleDataActive].cycleTimeName:''} ${that.data.dates[that.data.cycleDataActive].cycleTime} (${that.data.dates[that.data.cycleDataActive].weekDay})`
            showFirstTime = `第一期：${state.details.chooseTimeDTOS[state.currentChooseTime].cycleTimeName} ${state.details.chooseTimeDTOS[state.currentChooseTime].cycleTime} (${state.details.chooseTimeDTOS[state.currentChooseTime].weekDay})`
          }
          console.log(state.details, 'that.data.details')
          let shopcart = {
            allPrice: util.filtToFix(parseFloat(allPrice.toFixed(2)) * 1),
            storeId: store,
            goodsList: [],
            orderType: 'CYCLE',
            cycleId: state.details.id,
            cycleFixedId: state.details.fixedDTOS[state.cycleActive].id,
            cycleDetails: state.details,
            cycleActiveDes: state.details.fixedDTOS[state.cycleActive].fixedName,
            deliveryTime:
              state.details.cycleType === 'WEEK'
                ? state.weekMap[state.cycleDataActive].cycleTime
                : state.details.chooseTimeDTOS[state.currentChooseTime].cycleTime,
            cyclePhaseTotal: state.details.fixedDTOS[state.cycleActive].totalDeliveryCount,
            showFirstTime,
            scource: 'BUYNOW',
          }
          // shopcart.allPrice = that.data.showPopDetails.activityPrice * that.data.showPopDetails.perDeliveryQuantity;
          shopcart.allPrice = state.showPopDetails.activityPrice
          console.log(shopcart.allPrice, '4599')
          if (options && options.room_id) {
            shopcart = {
              ...shopcart,
              orderSource: 'WX_MINI_APP-LIVE',
              room_id: options.room_id,
            }
          }
          console.log(shopcart, '4607')
          // this.data.goodsList

          const arr = [state.goodsInfo]
          state.goodsList = arr
          const productsList = state.goodsList
          productsList.forEach((item) => {
            item = {
              ...item,
              productId: item.id,
              initialPurchaseNumber: state.initialPurchaseNumber || 1,
              productNum: Number(1),
            }
            shopcart.goodsList.push(item)
          })
          console.log(shopcart, '4618')
          // if (that.data.goodType === "newmbr") {
          //   shopcart.allPrice = that.data.goodsDetail.price || that.data.goodsDetail.originalPrice
          //   shopcart.goodsList[0].newmbrActivityId = that.data.goodsDetail.activityId;
          //   shopcart.goodsList[0].sellPrice = that.data.goodsDetail.price;
          //   if (that.data.goodsDetail.originalPrice) {
          //     shopcart.goodsList[0].originalPrice = that.data.goodsDetail.originalPrice;
          //   }

          // } console.log(shopcart.allPrice, '4624');
          console.log(e)
          if (state.isCateringMeals && hasChooseOutcome === true && e != null) {
            shopcart.goodsList[0] = {
              ...shopcart.goodsList[0],
              groupProducts: e.lists[0].lists,
              mealDetails: e.mealDetails,
            }
            hasChooseOutcome = false
          }
          console.log(shopcart, '4637')
          if (state.goodType !== 'newmbr') {
            let sellPrice = state.goodsList[0].sellPrice
            // that.data.member.gradeId =='1088' &&
            if (
              state.goodsList[0].memberPrice &&
              Number(state.goodsList[0].memberPrice) < Number(sellPrice)
            ) {
              shopcart.allPrice = util.filtToFix(
                parseFloat(state.goodsList[0].memberPrice.toFixed(2)) * state.productNum,
              )
              //  shopcart.allPrice = parseFloat(Number(that.data.goodsList[0].memberPrice * that.data.productNum).toFixed(2))
              shopcart.goodsList[0].sellPrice = state.goodsList[0].memberPrice
              sellPrice = state.goodsList[0].memberPrice
              shopcart.goodsList[0].useMemberPrice = true
            }
            shopcart.goodsList[0].usePromotionPrice = state.goodsList[0].usePromotionPrice
            console.log(
              e,
              state.goodsList[0],
              'that.data.goodsList[0].promotionPrice',
              shopcart.goodsList[0],
              '4648',
            )
            console.log(shopcart, '4649')
            if (
              !state.isTeam &&
              state.goodsList[0].promotionPrice &&
              Number(state.goodsList[0].promotionPrice) < Number(sellPrice)
            ) {
              shopcart.allPrice = util.filtToFix(
                Number(parseFloat(state.goodsList[0].promotionPrice).toFixed(2) * state.productNum),
              )
              shopcart.goodsList[0].sellPrice = state.goodsList[0].promotionPrice
              shopcart.goodsList[0].usePromotionPrice = true
              shopcart.goodsList[0].useMemberPrice = false
            }
            console.log(shopcart, '4655')
          }
          console.log(shopcart, '4652')
          // that.setData({
          // })
          // shopcart.allPrice = that.data.showPopDetails.activityPrice * that.data.showPopDetails.perDeliveryQuantity;
          shopcart.allPrice = state.showPopDetails.activityPrice
          state.cycleDateInfo.giftDTOS.forEach((val) => {
            if (val.check) {
              shopcart.goodsList.push({
                name: val.productName,
                productId: val.productId,
                productNum: val.quantity,
                giftProduct: true,
                sellPrice: 0,
                imageUrl: val.pictureUrl,
              })
            }
          })
          if (state.cycleDateInfo.imageUrl) {
            // this.setData({
            //   'goodsInfo.imageUrl': this.data.cycleDateInfo.imageUrl
            // })
            shopcart.goodsList[0].imageUrl = state.cycleDateInfo.imageUrl
          }
          uni.setStorageSync('wj_shopcart', shopcart)
        } catch (e) {
          console.log(e)
        }
        const easyScene = 'none'
        // if (that.options.easyScene != null) {
        //   easyScene = that.options.easyScene
        // }
        const opts = '?easyScene=' + easyScene
        NAVPAGE.toPerfectOrder(opts)
        // 跳转到完善订单
      } else {
        uni.showToast({
          title: '门店正在努力补货中~',
          icon: 'none',
          duration: 2000,
        })
      }
    }
  } else {
    NAVPAGE.toAuthorize()
  }
}
function changeShow(location, data) {
  if (location === 1) {
    state.columnDTOSHeader = data
  } else {
    state.columnDTOSFooter = data
  }
}
function confirm(e) {
  console.log(state.grabType, 'this.data.good1')
  // if(this.data.personLimitQuantity && this.data.personLimitQuantity < this.data.productNum) {
  //     wx.showToast({
  //         title: '最多购买' + this.data.personLimitQuantity + '件',
  //         icon: 'none',
  //         duration: 2000
  //     })
  //     this.setData({
  //         productNum: this.data.personLimitQuantity
  //     })
  //     return false
  // }
  // if(this.data.minQty && this.data.minQty > this.data.productNum) {
  //     wx.showToast({
  //         title: '最少购买' + this.data.minQty + '件',
  //         icon: 'none',
  //         duration: 2000
  //     })
  //     this.setData({
  //         productNum: this.data.minQty
  //     })
  //     return false
  // }
  // if (this.data.grabType == 'grab') {
  //     this.toPaySecKill(this.data.good1)
  // } else if (this.addType === "buyNow") {
  //     this.buyNow(this.data.good1)
  // } else {
  //     this.addShopCart(this.data.good1)
  // }
  if (!state.isSuccess) {
    return util.showToast(
      `活动剩余可配送日期不足${state.details.fixedDTOS[state.cycleActive].totalDeliveryCount}次`,
    )
  }
  buyNow(state.good1)
  // this.toggleGoodsNormalPopup();
  state.detailPopup = false
}
function openGoodsSpecs(e) {
  if (state.details.totalOrderLimit <= state.details.totalOrder || state.details.storeQty < 1) {
    return uni.showToast({
      title: '门店正在努力补货中~',
      icon: 'none',
      duration: 2000,
    })
  }
  if (state.details.storeStatue === 'OFF') {
    return uni.showToast({
      title: '门店商品已下架~',
      icon: 'none',
      duration: 2000,
    })
  }
  if (state.details.status !== 'IN_PROGRESS') {
    return uni.showToast({
      title: '当前活动未开始~',
      icon: 'none',
      duration: 2000,
    })
  }
  uni.showLoading()
  state.detailPopup = true
  state.good1 = e
  state.cycleActive = 0
  getCycleByFixedId(state.details.fixedDTOS[0].id, '')
  uni.hideLoading()

  // console.log();
  // console.log('打开商品规格选择')
  // const addType = e.detail.target.dataset.addtype
  // const goodtype = e.detail.target.dataset.goodtype
  // this.addType = addType;
  // this.setData({
  //     goodtype: goodtype
  // })
  // console.log(addType, this.goodsStyle)
  // if (this.data.specs.length > 0) {
  //     if (this.data.balance > 0) {
  //         this.setData({
  //             goodsImg: this.data.productPictures[0].url
  //         })
  //         this.toggleGoodsSpecPopup()
  //     } else {
  //         wx.showToast({
  //             title: '门店正在补货中，看看其他商品吧~',
  //             icon: 'none',
  //             duration: 2000
  //         })
  //     }
  // } else {
  //     if (this.goodsStyle === "normal") {
  //         this.setData({
  //             goodsImg: this.data.productPictures[0].url,
  //             good1: e
  //         })
  //         this.toggleGoodsNormalPopup()
  //         // if (addType === "buyNow") {
  //         //     this.buyNow(e)
  //         // } else {
  //         //     this.addShopCart(e)
  //         // }
  //     }
  // }
}
function getSharePictures() {
  console.log('默认分享图')
  console.log(app.globalData.sharePictures)
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
}
onShareAppMessage(function () {
  const that = this
  // 分享信息统计
  // this.setShareContent();
  // this.drawShareImg();
  const sellPrice = state.activityPriceMin || state.sellPrice
  const title =
    '【仅需: ￥' +
    sellPrice +
    (state.activityPriceMin != state.activityPriceMax ? '起' : '') +
    '】 ' +
    state.details.cycleName
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route // 当前页面url
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options
  const sharePic = state.productPictures[0].url.replace('http://', 'https://')
  console.log(sharePic, 'sharePicsharePic')
  // if (that.data.sharePic !== "" && that.data.goodType !== 'advanceSell') {
  //     sharePic = that.data.sharePic.replace("http://", "https://")
  // }
  console.log(state.storeInfo.virtualStoreId || state.storeInfo.id)
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    let path = url + '?shareId=' + memberId
    path =
      path +
      '&storeId=' +
      (state.storeInfo && state.business != 'DISTRIBUTION'
        ? state.storeInfo.virtualStoreId
          ? state.storeInfo.virtualStoreId + ''
          : state.storeInfo.id + ''
        : state.storeId + '')
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key]
        if (key !== 'mobile' && key != 'storeId') {
          path = path + '&' + key + '=' + ele
        }
      }
    }
    console.log(title)
    console.log(path)
    console.log(sharePic)
    return {
      title,
      path,
      imageUrl: sharePic,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    let path =
      url +
      '?storeId=' +
      (state.storeInfo && state.business != 'DISTRIBUTION'
        ? state.storeInfo.virtualStoreId
          ? state.storeInfo.virtualStoreId + ''
          : state.storeInfo.id + ''
        : state.storeId + '')
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key]
        if (key !== 'mobile' && key != 'storeId') {
          path = path + '&' + key + '=' + ele
        }
      }
    }
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path,
      imageUrl: sharePic,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
const handleClickShare = debounce(function (e) {
  state.showSharePop = true
  handleShareImageData()
}, 300)
const handleShareImageData = debounce(function () {
  const self = this
  /**
   * advanceSellInfo
   * groupNumber
   * name,
   * description,
   * teamAllPrice,
   * secKillInfo,
   * sellPrice,
   * scoreInfo,
   * options,
   * isTeam, isSecKill,
   * pdtDetail,
   * sharePic,
   * goodType
   */
  const shareData = {
    sharePicture: '',
    advanceSellInfo: state.advanceSellInfo,
    groupNumber: 1,
    name: state.details.cycleName,
    description: state.details.cycleDescribe,
    sellPrice: state.activityPriceMin,
    teamAllPrice: 0,
    secKillInfo: {},
    scoreInfo: {},
    options: {
      ...options,
      productId: options.productId || options.id,
    },
    isTeam: {},
    isCycle: true,
    isSecKill: {},
    pdtDetail: {},
    sharePic: state.activityPriceMin,
    goodType: state.goodType,
  }
  if (state.producrisStoreCode && state.producrisStoreCode === 'TRUE') {
    // shareData.storeId = self.data.storeId
    shareData.storeId =
      state.storeInfo && state.business != 'DISTRIBUTION'
        ? state.storeInfo.virtualStoreId || state.storeInfo.id
        : state.storeId
    shareData.storeName =
      state.storeInfo && state.business != 'DISTRIBUTION'
        ? state.storeInfo.name || state.storeInfo.name
        : app.globalData.storeInfo && app.globalData.storeInfo.name
  } else if (!state.producrisStoreCode) {
    getShareStoreIdConfig()
    if (state.producrisStoreCode === 'TRUE') {
      // shareData.storeId = self.data.storeId
      shareData.storeId =
        state.storeInfo && state.business != 'DISTRIBUTION'
          ? state.storeInfo.virtualStoreId || state.storeInfo.id
          : state.storeId
      shareData.storeName =
        state.storeInfo && state.business != 'DISTRIBUTION'
          ? state.storeInfo.name || state.storeInfo.name
          : app.globalData.storeInfo && app.globalData.storeInfo.name
    }
  }

  // 优化图片URL处理
  let imageUrl = ''
  const pictures = state.details.productDetailsDTO?.productPictures || []
  const firstPicture = pictures.find((pic) => pic.fileType !== 'VIDEO') || pictures[0]
  if (firstPicture) {
    imageUrl = firstPicture.url.replace('http://', 'https://')
  }
  shareData.sharePicture = imageUrl
  state.shareData = shareData
}, 300)
function getShareStoreIdConfig() {
  const self = this
  if (app.globalData.systemConfigure.producrisStoreCode) {
    state.producrisStoreCode = app.globalData.systemConfigure.producrisStoreCode
  } else {
    sysService
      .query('producrisStoreCode')
      .then((res) => {
        if (res && res.length > 0 && res[0].value != null) {
          app.globalData.systemConfigure.producrisStoreCode = res[0].value
          state.producrisStoreCode = app.globalData.systemConfigure.producrisStoreCode
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
function getShareImgInfo() {
  const that = this
  let sharePicture = state.sharePictures
  let firstPic = ''
  if (state.productPictures[0].fileType !== 'VIDEO') {
    firstPic = state.productPictures[0].url.replace('http://', 'https://')
    //   console.log(firstPic);
  } else {
    for (let i = 0; i < state.productPictures.length; i++) {
      if (state.productPictures[i].fileType === 'PICTURE') {
        firstPic = state.productPictures[i].url.replace('http://', 'https://')
        console.log(firstPic)
        break
      } else {
        firstPic = state.imageUrl.replace('http://', 'https://')
        console.log(firstPic)
      }
    }
  }
  if (state.secKillInfo.sharePicture) {
    sharePicture = state.secKillInfo.sharePicture.replace('http://', 'https://')
  } else if (state.groupSharePicture !== '') {
    sharePicture = state.groupSharePicture.replace('http://', 'https://')
  } else if (state.groupSharePictureDialogue !== '') {
    sharePicture = state.groupSharePictureDialogue.replace('http://', 'https://')
  } else {
    sharePicture = firstPic
  }
  if (state.goodType === 'advanceSell') {
    sharePicture = firstPic
  }
  if (!state.isSecKill && !state.isTeam) {
    sharePicture = firstPic
  }
  console.log(state.productPictures)
  console.log(sharePicture)
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: sharePicture,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      },
    })
    // selfA.getTemporaryUrl(sharePicture)
    //     .then(res => {
    //         sharePicture = res;

    //         wx.getImageInfo({
    //             src: sharePicture,
    //             success(res) {
    //                 resolve(res)
    //             },
    //             fail(res) {
    //                 reject(res)
    //             }
    //         })
    //     })
  })
}
function getUserInfo(e) {
  console.log(e, 'eeee')
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.isMember = true
        bus.emit('getRelatedCoupon', true)
        onLoad(state.options)
      } else {
        NAVPAGE.toAuthorize()
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function checkLocationAuth(options) {
  uni.getSetting({
    success: (res) => {
      const authSetting = res.authSetting
      if (authSetting['scope.userLocation']) {
        getRecentlyStore(options)
      } else if (authSetting['scope.userLocation'] === false) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您未授权地理位置信息，部分功能无法正常使用哦~',
          confirmText: '授权位置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting()
            }
          },
        })
      } else {
        // 用户未明确拒绝也未授权，提示用户进行设置
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            getRecentlyStore(options)
          },
          fail: () => {
            uni.showModal({
              title: '温馨提示',
              content: '您未授权地理位置信息，部分功能无法正常使用哦~',
              confirmText: '授权位置',
              success: (res) => {
                // 处理用户响应
                if (res.confirm) {
                  uni.openSetting()
                }
              },
            })
          },
        })
      }
    },
    fail: (err) => {},
  })
}
function getRecentlyStore(options) {
  // 获取到当前的地理位置，查找出最近的门店
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      const latitude = res.latitude
      const longitude = res.longitude
      app.globalData.location = {
        latitude: res.latitude,
        longitude: res.longitude,
      }
      let tempAllStores = uni.getStorageSync('wj_allStores') // 获取缓存的所有门店
      let tempIndex = null
      if (!tempAllStores) {
        storeService
          .queryList()
          .then(async (res) => {
            tempAllStores = []
            res.forEach((item) => {
              if (item.status === 'OPEN') {
                tempAllStores.push(item)
              }
            })
            uni.setStorageSync('wj_allStores', tempAllStores)
            if (!options.storeId) {
              tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude)
              app.globalData.storeInfo = tempAllStores[tempIndex]
              uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
              getStoreInfoById(app.globalData.storeInfo.id)
            } else {
              getStoreInfoById(options.storeId)
            }
            // this.getCycleProduct();
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      } else {
        if (!options.storeId) {
          tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude)
          app.globalData.storeInfo = tempAllStores[tempIndex]
          uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
          if (app.globalData.storeInfo) {
            getStoreInfoById(app.globalData.storeInfo.id)
          }
        } else {
          getStoreInfoById(options.storeId)
        }
        // this.getCycleProduct();
      }
    },
    fail: (res) => {
      console.log(res, 'asdfsafsdkfj1')
    },
  })
}
function handleUserLogin() {
  const that = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
  }
}
function getMemberScore() {
  const that = this
  console.log(app.globalData.userInfo, 'app.globalData.userInfo')
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
      state.memberGrade = app.globalData.userInfo.member.gradeId
      memberService
        .getBalance(state.member.mobile)
        .then((res) => {
          console.log(res)
          state.score = res
        })
        .catch((e) => {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000,
          })
        })
    } else {
    }
  }
}
function activityPrice(res) {
  if (!res.fixedDTOS) return
  const prices = res.fixedDTOS.map((val) => ({
    activityPrice: val.activityPrice,
    salesPrice: val.salesPrice,
  }))
  const miniPrice = Math.min(...prices.map((p) => p.activityPrice))
  const miniSalesPrice = Math.min(...prices.map((p) => p.salesPrice))
  const maxPrice = Math.max(...prices.map((p) => p.activityPrice))
  const maxSalesPrice = Math.max(...prices.map((p) => p.salesPrice))
  state.activityPriceMin = miniPrice
  state.activityPriceMax = maxPrice
  state.miniSalesPrice = miniSalesPrice
  state.maxSalesPrice = maxSalesPrice
}
function swiperChange(e) {
  state.current = e.detail.current + 1
}
function toProductDetail(e) {
  let opts = ''
  let n = 0
  for (const t in e) {
    ;((opts = n === 0 ? opts + '?' + t + '=' + e[t] : opts + '&' + t + '=' + e[t]), n++)
  }
  NAVPAGE.toGoodsDetails(opts)
}
function onClickGoods(val) {
  const e = {
    productId: val.detail.productid,
    type: val.detail.type,
    lastPage: 'home',
  }
  toProductDetail(e)
}
function doUpdateTime(e) {
  state.currentChooseTime = e.detail.value
  const date = state.details.chooseTimeDTOS[state.currentChooseTime].cycleTime
  getCycleByFixedId(state.details.fixedDTOS[state.cycleActive].id, date)
}
function getCycleProduct() {
  const self = this
  getMemberScore()
  const store = app.globalData.storeInfo && app.globalData.storeInfo.id
  uni.showLoading()
  cycleService
    .getCycleProduct(state.goodsId, store)
    .then((res) => {
      if (res) {
        if (!res.isStoreParticipate) {
          uni.showModal({
            title: '',
            showCancel: false,
            confirmText: '返回首页',
            content: '当前所在门店未参与活动，请切换活动门店后查看',
            complete: (res) => {
              if (res.cancel) {
              }
              if (res.confirm) {
                NAVPAGE.toHome()
              }
            },
          })
          return false
        }
        // 分批次更新数据
        // 商品自定义栏目res.productDetailsDTO.columnDTOS
        state.details = res
        state.storeId = store
        const columnDTOSHeader = []
        const columnDTOSFooter = []
        // console.log(res,'res.productDetailsDTO')
        if (
          res.productDetailsDTO &&
          res.productDetailsDTO.columnDTOS &&
          res.productDetailsDTO.columnDTOS.length > 0
        ) {
          res.productDetailsDTO.columnDTOS.forEach((item) => {
            item.propertyValue = JSON.parse(item.propertyValue)
            if (item.location === 1) {
              columnDTOSHeader.push(item)
            } else {
              columnDTOSFooter.push(item)
            }
          })
        }
        state.columnDTOSHeader = columnDTOSHeader
        state.columnDTOSFooter = columnDTOSFooter
        activityPrice(res)
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
    .finally(() => {
      uni.hideLoading()
    })
}
const doChechCycDateActive = debounce(function (e) {
  state.cycleDataActive = e.currentTarget.dataset.index
}, 200)
const doChechCycleActive = debounce(function (e) {
  state.cycleActive = e.currentTarget.dataset.index
  getCycleByFixedId(state.details.fixedDTOS[state.cycleActive].id, '')
}, 200)
const doChechCycleActiveGift = debounce(function (e) {
  const newArr = state.cycleDateInfo.giftDTOS
  newArr[e.currentTarget.dataset.index].check = !newArr[e.currentTarget.dataset.index].check
  state.cycleDateInfo.giftDTOS = newArr
}, 200)
function getCycleByFixedId(id, date) {
  const store = app.globalData.storeInfo.id
  // 此接口目前需要token才能获取数据，后续出现问题可让后端去除token限制
  uni.showLoading({
    title: '正在获取配送周期，请稍候~',
  })
  state.cycleByFixedDataFlag = false
  cycleService
    .getCycleByFixedId(id, store, date)
    .then((res) => {
      if (res) {
        const keys = res.map ? Object.keys(res.map) : res.dates ? Object.keys(res.dates) : []
        console.log(res.dates ? Object.entries(res.dates) : [], 'Object.entries(res.dates)')
        state.keys = keys
        state.cycleDateInfo = res
        state.weekMap = res.map ? res.map : []
        state.dates = res.dates ? res.dates : []
        console.log(state.cycleDateInfo, 'cycleDateInfo')
        if (state.cycleDateInfo.giftDTOS && state.cycleDateInfo.giftDTOS.length > 0) {
          const newArr = []
          state.cycleDateInfo.giftDTOS.forEach((val, i) => {
            if (
              val.storeQty >= val.quantity &&
              val.storeQty &&
              val.storeQty > 0 &&
              val.storeStatue &&
              val.storeStatue === 'ON'
            ) {
              newArr.push({
                ...val,
                check: state.details.defaultCheck && state.details.defaultCheck === 1,
              })
            }
          })
          state.cycleDateInfo.giftDTOS = newArr
        } else {
          state.cycleDateInfo.giftDTOS = []
        }
        const showDatesText = state.dates.map((item) => item[1])
        state.showDatesText = showDatesText
        state.showPopDetails = res
        state.isSuccess = true
      }
      uni.hideLoading()
      state.cycleByFixedDataFlag = true
    })
    .catch((err) => {
      state.cycleByFixedDataFlag = true
      util.showToast(err.message)
      state.isSuccess = false
    })
}
function onBack() {
  uni.navigateBack({
    delta: 1,
  })
}
function toggleSpecs() {
  state.specsExpanded = !state.specsExpanded
}
function toggleGoodsNormalPopup() {
  state.detailPopup = !state.detailPopup
}
function toggleBrand() {
  state.brandExpanded = !state.brandExpanded
}
function toggleReturn() {
  state.returnExpanded = !state.returnExpanded
}
function onBuyNow() {
  uni.showToast({
    title: '正在开发中...',
    icon: 'none',
  })
}
function addToCart(e) {
  const self = this
  const _i = e.detail.context
  i = _i
  addRelatedProductToShopcart(e.detail)
}
function addToCartAnimateTest(e) {
  const self = this
  const _i2 = i
  const t = new Date().getTime()
  const o = state.ctime
  if (!(o != 'undefined' && t - o < 800)) {
    // 检查addcart是否已初始化
    state.ctime = t
    if (addcart && addcart.animateAddToCart) {
      const n = app.globalData.systemInfo
      const r = (n.windowWidth / 8) * 1.8
      const s = n.windowHeight
      // 三分图商品
      addcart.animateAddToCart('.gm-small-goods-img', r, s, _i2)
    }
  }
}
function addRelatedProductToShopcart(val) {
  if (!canAddToCart) {
    return
  }
  canAddToCart = false
  if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
    canAddToCart = true
    util.showToast('该活动仅限新会员专享哦~', 2000)
  } else {
    const that = this
    if (canAddToCart === false) {
      const productId = val.detail.target.dataset.id
      const business = val.detail.target.dataset.business
      let balance = val.detail.target.dataset.balance
      const grabActivityId = val.detail.target.dataset.grabactivityid
      const style = val.detail.target.dataset.style
      const mode = val.detail.target.dataset.type
      let storeId = ''
      const loginStatus = checkAuth()
      let hasSharingPersonId = false
      if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
        if (loginStatus) {
          if (business === 'DISTRIBUTION') {
            try {
              const _data = uni.getStorageSync('wj_distributionStore')
              if (_data) {
                storeId = _data.id
              }
            } catch (e) {}
          } else {
            storeId = app.globalData.storeInfo.id
          }
          let postData = {
            storeId,
            lists: [
              {
                count: 1,
                productId,
              },
            ],
          }
          if (app.globalData.isShoppingGuidanceRecordGoods) {
            // 获取分享人id
            const shareData = getSharePeopleInfo()
            if (shareData && shareData != null && shareData.productId === productId) {
              postData.lists[0].sharingPersonId = shareData.shareId
              hasSharingPersonId = true
            }
          }
          if (grabActivityId != null) {
            postData = {
              storeId,
              lists: [
                {
                  count: 1,
                  grabActivityId,
                  productId,
                },
              ],
            }
          }
          if (mode === 'reduce') {
            postData = {
              storeId,
              lists: [
                {
                  count: -1,
                  productId,
                },
              ],
            }
          }
          if (business === 'DISTRIBUTION') {
            balance = 0
            productService
              .getDetails(storeId, productId)
              .then((res) => {
                if (res) {
                  balance = res.balance
                }
                if (style === 'MEALS') {
                  if (mode === 'reduce') {
                    canAddToCart = true
                  } else {
                    _addShopcart(productId)
                  }
                } else {
                  if (mode === 'reduce') {
                    if (state.shopCart[productId] > 0) {
                      addGoods(balance)
                    } else {
                      canAddToCart = true
                    }
                  } else {
                    addGoods(balance)
                  }
                }
              })
              .catch((err) => {
                canAddToCart = true
              })
          } else if (
            (business === 'CATERING' || business === 'DISTRIBUTION') &&
            style === 'MEALS'
          ) {
            if (mode === 'reduce') {
              canAddToCart = true
            } else {
              _addShopcart(productId)
            }
          } else {
            if (mode === 'reduce') {
              if (state.shopCart[productId] > 0) {
                addGoods(balance)
              } else {
                canAddToCart = true
              }
            } else {
              addGoods(balance)
            }
          }
          /**
           * 加入购物车
           * @param balance
           */
          function addGoods(balance) {
            if (app.globalData.userInfo.member) {
              if (balance === 0 || balance === null || balance === '') {
                canAddToCart = true
                uni.showToast({
                  title: '门店中该商品库存不足，请选购其他商品~',
                  icon: 'none',
                  duration: 2000,
                })
              } else {
                util.setHideLoading(true)
                shopcartService
                  .cateringAdd(postData)
                  .then((res) => {
                    const opts = {
                      products: [
                        {
                          productId,
                          traceId: options.traceId != null ? options.traceId : '',
                        },
                      ],
                    }
                    util.setHideLoading(false)
                    app.globalData.storeIdentification =
                      business === 'DISTRIBUTION' ? 'distribution' : 'normal'
                    app.globalData.isShopCartChange = true
                    if (mode === 'reduce') {
                      reduceLocalGoods(productId)
                    } else {
                      if (i && i !== void 0) {
                        addToCartAnimateTest(val)
                        addLocalGoods(productId)
                      } else {
                        handleTouchOnGoods(addShopCartData)
                      }
                    }
                    if (app.globalData.systemConfigure.showCartModule) {
                      changeCanAddToCart = true
                      queryShopcart()
                    } else {
                      canAddToCart = true
                    }
                    if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                      util.removeSharingPersonInfo()
                    }
                  })
                  .catch((err) => {
                    canAddToCart = true
                    util.setHideLoading(false)
                    uni.showToast({
                      title: err.message,
                      icon: 'none',
                      duration: 2000,
                    })
                  })
              }
            } else {
              canAddToCart = true
              NAVPAGE.toAuthorize()
            }
          }
        } else {
          canAddToCart = true
          uni.showToast({
            title: '请先点击头像授权登录后添加哦~',
            icon: 'none',
            duration: 2000,
          })
        }
      } else {
        canAddToCart = true
        // 多规格商品跳转商品详情
        const _data = uni.getStorageSync('wj_distributionStore')
        if (_data) {
          storeId = _data.id
        }
        let opts =
          '?productId=' +
          productId +
          (business === 'DISTRIBUTION' ? (_data ? _data.id : '') : '&storeId=' + state.storeId) +
          '&source=addshopcart'
        if (grabActivityId != null && state.grabData.grabStatus !== 'started') {
          opts = opts + '&type=secondkill'
        } else {
          opts = opts + '&type=normal'
        }
        if (val.detail.target.dataset.easyscene != null) {
          opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene
        }
        NAVPAGE.toGoodsDetails(opts)
      }
    }
  }
}
function queryShopcart() {
  const self = this
  if (options.type === 'secondkill' || state.isSecKill) {
    shopcartService
      .getCatering(state.storeId)
      .then((res) => {
        console.log(res)
        if (util.isHideLoading()) {
          util.setHideLoading(false)
        }
        let grabProductNum = 0
        for (let i = 0; i < res.items.length; i++) {
          const item = res.items[i]
          if (
            (item.productId === options.productId || item.productId === state.goodsId) &&
            item.grabActivityId != null
          ) {
            grabProductNum = grabProductNum + item.productNum
            break
          }
        }
        state.grabProductNum = grabProductNum
        const tempShopCart = {}
        const grabProducts = {}
        const tempShopCartGoodsId = []
        const tempGrabShopCartGoodsId = []
        if (res.items && res.items.length > 0) {
          // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
          res.items.forEach((item) => {
            if (!item.grabActivityId && !item.newmbrActivityId) {
              let index = -1
              for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                if (item.productId == tempShopCartGoodsId[i]) {
                  index = i
                }
              }
              if (index > -1) {
                tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum
              } else {
                tempShopCart[item.productId] = item.productNum
                tempShopCartGoodsId.push(item.productId)
              }
            } else if (item.grabActivityId) {
              let index = -1
              for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
                if (item.productId == tempGrabShopCartGoodsId[i]) {
                  index = i
                }
              }
              if (index > -1) {
                grabProducts[item.productId] = grabProducts[item.productId] + item.productNum
              } else {
                grabProducts[item.productId] = item.productNum
                tempGrabShopCartGoodsId.push(item.productId)
              }
            }
          })
        }
        const localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart,
        }
        const localGrabData = {
          goodsId: tempGrabShopCartGoodsId,
          items: grabProducts,
        }
        try {
          uni.setStorageSync('wj_shopCartStorage', localData)
          uni.setStorageSync('wj_grabshopCartStorage', localGrabData)
        } catch (e) {}
        changeCanAddToCart = false
        canAddToCart = true
      })
      .catch((e) => {
        changeCanAddToCart = false
        canAddToCart = true
      })
  } else if (changeCanAddToCart) {
    changeCanAddToCart = false
    canAddToCart = true
  }
  shopcartService
    .getProductsCount()
    .then((res) => {
      uni.hideLoading()
      console.log(res)
      state.shopCartNum = res
      isOnLoadQuery = false
    })
    .catch((err) => {
      isOnLoadQuery = false
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function addLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    let localProductCount = uni.getStorageSync('wj_userProductsCount')
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount)
    localProductCount++
    localProductCount = String(localProductCount)
    app.globalData.setTabBarBadge('shopping_cart', localProductCount)
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId
      const tempShopCart = localShopingCart.items
      const tempShopCartGoodsId = []
      const _id = id
      let index = -1
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i])
          if (_id == shopCartGoodsId[i]) {
            index = i
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) + 1
      } else {
        // 新增
        tempShopCartGoodsId.push(_id)
        tempShopCart[_id] = 1
      }
      state.shopCart = tempShopCart
      state.shopCartGoodsId = tempShopCartGoodsId
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart,
      }
      uni.setStorageSync('wj_shopCartStorage', localData)
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', 'update')
}
function reduceLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    let localProductCount = uni.getStorageSync('wj_userProductsCount')
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount)
    localProductCount--
    localProductCount = String(localProductCount)
    app.globalData.setTabBarBadge('shopping_cart', localProductCount)
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId
      const tempShopCart = localShopingCart.items
      const tempShopCartGoodsId = []
      const _id = id
      let index = -1
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i])
          if (_id == shopCartGoodsId[i]) {
            index = i
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) - 1
        if (tempShopCart[_id] <= 0) {
          tempShopCartGoodsId.splice(index, 1)
        }
      }
      state.shopCart = tempShopCart
      state.shopCartGoodsId = tempShopCartGoodsId
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart,
      }
      uni.setStorageSync('wj_shopCartStorage', localData)
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', 'update')
}
function handleTouchOnGoods(e) {
  const self = this
  let goodsBoxImage = ''
  state.goodsBoxImage = ''
  const addtype = e.detail.target.dataset.addtype
  const touches = {
    clientX: 0,
    clientY: 0,
    force: 1,
    identifier: 0,
    pageX: 0,
    pageY: 0,
  }
  const goodsType = state.goodType
  FLY.touchOnGoods(addtype, touches, e.detail.target.dataset.id, goodsType).then((res) => {
    goodsBoxImage = state.productPictures[state.current - 1].url
    state.goodsBoxImage = goodsBoxImage
    const animation = res
    state.hide_good_box = false
    state.bus_x = animation.finger.x
    state.bus_y = animation.finger.y
    state.animation = animation.animation
    setTimeout(() => {
      state.hide_good_box = true
      addLocalGoods(e.detail.target.dataset.id)
    }, animation.duration)
  })
}
function getSharePeopleInfo() {
  try {
    const shareData = uni.getStorageSync('wj_shareData')
    if (shareData) {
      return shareData
    }
    return null
  } catch (e) {
    return null
  }
}
function _addShopcart(productId) {
  if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
    canAddToCart = true
    util.showToast('该活动仅限新会员专享哦~', 2000)
  } else {
    productService
      .getCateringDetailsById(productId, state.storeId)
      .then((res) => {
        const self = this
        const cateringGroupProducts = res.cateringGroupProducts
        const productId = res.id
        const goodsList = []
        let mealCanBuy = true
        const unBuyGoods = null
        const unChoiceGroup = null
        let hasSharingPersonId = false
        const mealDetails = []
        const business = state.business
        if (cateringGroupProducts && cateringGroupProducts.length > 0) {
          const groupProductList = []
          for (let i = 0; i < cateringGroupProducts.length; i++) {
            const item = cateringGroupProducts[i]
            if (item.mealDetails && item.mealDetails.length > 0) {
              for (let j = 0; j < item.mealDetails.length; j++) {
                const ele = item.mealDetails[j]
                const tempData = {
                  groupId: item.groupId,
                  groupProductId: ele.productId,
                  groupProductCount: ele.productCount,
                }
                mealDetails.push(ele.productName)
                groupProductList.push(tempData)

                // 判断当前门店是否存在该商品 如果不存在则提示用户
                if (!ele.exist || ele.storeBalance <= 0) {
                  mealCanBuy = false
                  canAddToCart = true
                  uni.showToast({
                    title: '门店中该商品库存不足，请选购其他商品~',
                    icon: 'none',
                    duration: 2000,
                  })
                  return false
                }
              }
            }
          }
          const tempData = {
            count: 1,
            lists: groupProductList,
            productId,
          }
          if (app.globalData.isShoppingGuidanceRecordGoods) {
            // 获取分享人id
            const shareData = util.getSharingPersonInfo()
            if (shareData && shareData != null && shareData.productId === state.productId) {
              tempData.lists[0].sharingPersonId = shareData.shareId
              hasSharingPersonId = true
            }
          }
          goodsList.push(tempData)
        }
        if (mealCanBuy) {
          const postData = {
            lists: goodsList,
            storeId: state.storeId,
          }
          // 统配商品
          if (business === 'DISTRIBUTION') {
            postData.storeId = state.distributionStoreId
          }
          if (state.goodType === 'newmbr') {
            postData.lists[0].newmbrActivityId = state.goodsDetail.activityId
          } else if (state.goodType === 'secondkill') {
            if (state.secKillInfo.type === 'SPEC' && !customData.hasGrabPrice) {
              // 选择的子规格是普通规格不是秒杀
            } else {
              postData.lists[0].grabActivityId = state.activityId
            }
          }
          console.log(state.scource)
          if (state.scource === 'BUYNOW') {
            canAddToCart = true
            // 处理立即购买
            postData.mealDetails = '(' + mealDetails.join('+') + ')'
            if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
              util.removeSharingPersonInfo()
            }
            const outcome = {
              detail: {
                outcome: true,
                product: postData,
              },
            }
            chooseOutcome(outcome)
            return
          }
          shopcartService
            .cateringAdd(postData)
            .then((res) => {
              const opts = {
                products: [
                  {
                    productId,
                    traceId: options.traceId != null ? options.traceId : '',
                  },
                ],
              }
              app.globalData.storeIdentification =
                business === 'DISTRIBUTION' ? 'distribution' : 'normal'
              app.globalData.isShopCartChange = true
              if (!util.isHideLoading()) {
                util.setHideLoading(true)
              }
              if (state.isSecKill) {
                state.grabProductNum = parseInt(state.grabProductNum) + 1
              }
              if (app.globalData.systemConfigure.showCartModule) {
                changeCanAddToCart = true
                queryShopcart()
              } else {
                canAddToCart = true
              }
              if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                util.removeSharingPersonInfo()
              }
              handleTouchOnGoods(addShopCartData)
            })
            .catch((err) => {
              canAddToCart = true
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            })
        } else {
          canAddToCart = true
          if (unBuyGoods) {
            uni.showToast({
              title: unBuyGoods.productName + '已售完',
              icon: 'none',
              duration: 2000,
            })
          } else if (unChoiceGroup) {
            uni.showToast({
              title: unChoiceGroup.groupName + '必选',
              icon: 'none',
              duration: 2000,
            })
          } else {
            uni.showToast({
              title: '门店正在补货中，看看其他商品吧~',
              icon: 'none',
              duration: 2000,
            })
          }
        }
      })
      .catch((err) => {
        canAddToCart = true
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
</script>
<style scoped>
page {
  background: #f5f5f5;
}

.container {
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  padding-top: 0;
}

.goods-image {
  width: 100%;
  height: 750rpx;
  background: #fff;
}

.goods-image image {
  width: 100%;
  height: 100%;
}

.goods-price-info {
  padding: 24rpx 30rpx;
  background: #fff;
}

.price {
  display: flex;
  align-items: baseline;
}

.symbol {
  font-size: 28rpx;
  color: #ff4d4f;
}

.amount {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-right: 20rpx;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.sales-info {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}

.divider {
  margin: 0 20rpx;
}

.goods-title {
  padding: 24rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  background: #fff;
  border-top: 1rpx solid #f5f5f5;
}

.goods-detail-image {
  width: 100%;
  background: #fff;
  margin-top: 20rpx;
}

.goods-detail-image image {
  width: 100%;
  display: block;
}

.detail-section {
  /* margin-top: 20rpx; */
  background: #fff;
}

.detail-section .section-header > text {
  display: block;
  text-indent: 24rpx;
  font-size: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30rpx;
  /* font-size: 28rpx;
  color: #333; */
  border-bottom: 1rpx solid #333;
}

.arrow {
  width: 28rpx;
  height: 28rpx;
  transition: transform 0.3s;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.section-content {
  padding: 0 30rpx 30rpx;
}

.section-content .item {
  margin-top: 8rpx;
}

.section-content .item:nth-of-type(2) {
  margin-top: 46rpx;
}

.section-content .label {
  font-size: 28rpx;
  color: #333;
}

.section-content .content {
  font-size: 28rpx;
  color: #333;
}

.spec-item {
  display: flex;
  margin-bottom: 16rpx;
}

.spec-item:last-child {
  margin-bottom: 0;
}

.spec-label {
  width: 120rpx;
  color: #999;
  font-size: 26rpx;
}

.spec-value {
  flex: 1;
  color: #333;
  font-size: 26rpx;
}

.brand-story,
.return-policy {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.recommend-section {
  /* margin-top: 20rpx; */
  padding: 24rpx 30rpx;
  background: #f9f9f9;
}

.recommend-title {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 42rpx;
  margin: 40rpx 0;
  text-align: center;
}

.recommend-list {
  display: flex;
  justify-content: space-between;
}

.recommend-item {
  width: 330rpx;
  background-color: #fff;
  overflow: hidden;
}

.recommend-item image {
  width: 100%;
  height: 330rpx;
  border-radius: 8rpx;
}

.recommend-name {
  font-size: 26rpx;
  color: #333;
  margin: 20rpx 0 23rpx 10rpx;
  display: block;
}

.recommend-price {
  display: block;
  font-size: 24rpx;
  font-weight: bold;
  padding: 0 0 18rpx 18rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.cart-btn {
  width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  border: 1rpx solid #ff4d4f;
  color: #ff4d4f;
  font-size: 28rpx;
  border-radius: 35rpx;
  margin-right: 20rpx;
}

.buy-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  background: #ff4d4f;
  color: #fff;
  font-size: 28rpx;
  border-radius: 35rpx;
}

/* goodsDetail */

/* @import '/pages-sub/newretail/pages/mallModule/template/commentItem.wxss'; */

page {
  background-color: #f1f3f6;
  height: 100%;
}

.iphoneX-height {
  padding-bottom: 50rpx !important;
}

.color-009f55 {
  color: #009f55;
}

.anchor_tab {
  position: fixed;
  top: 0;
  left: 28%;
  z-index: 10000;
  background-color: #fff;
  width: 47vw;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anchor_tab view {
  margin: 0 15rpx;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid transparent;
}

.anchor_tab .activeScroll {
  border-bottom: 2px solid green;
}

.shipper_type {
  font-size: 24rpx;
  padding: 0 10rpx;
  height: 30rpx;
  display: inline-block;
  border: 1px solid;
  border-radius: 6rpx;
  line-height: 30rpx;
}

/* .navigation-top {

}

.navigation-top .navigation_bar_btn_goback {
  position: fixed;
  top: 30rpx;
  left: 30rpx;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  z-index: 1;
}

.navigation-top .navigation_bar_btn_goback .goBack {
  width: 33rpx;
  height: 33rpx;
} */

.swiperContainer {
  width: 100%;
  height: 750rpx;
  position: relative;
  z-index: 9;
}

.swiper {
  width: 100%;
  height: 750rpx;
  z-index: 9;
}

.swiper-item {
  width: 100%;
  height: 750rpx;
  z-index: 9;
}

.swiper-item image {
  width: 100%;
  height: 750rpx;
}

.slide-video {
  width: 750rpx;
  height: 750rpx;
}

.swiper-item .slide-presell {
  width: 152rpx;
  height: 145rpx;
  position: absolute;
  top: 26rpx;
  left: 60rpx;
  z-index: 10;
}

.imageCount {
  width: 72rpx;
  height: 36rpx;
  background: rgba(27, 27, 27, 0.5);
  font-size: 20rpx;
  text-align: center;
  line-height: 36rpx;
  color: #fff;
  border-radius: 6rpx;
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
}

.share-reamin {
  position: absolute;
  right: -20rpx;
  bottom: 80rpx;
  z-index: 8;
  /* top: 0rpx; */
  /* background: #EE5253; */
  color: #333;
  /* height: 50rpx; */
  min-width: 100rpx;
  /* min-width: 50rpx; */
  /* line-height: 50rpx; */
  /* border-bottom-left-radius: 25rpx; */
  /* border-top-left-radius: 25rpx; */
  overflow: hidden;
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0rpx 16rpx 0 0;
  /* margin-top: -52rpx; */
  border-left: 1px solid #eaeaea;
}

.share-reamin image {
  margin-bottom: 6rpx;
  /* filter: grayscale(0%) brightness(1000%); */
}

/* .goods-price {
  font-size: 22rpx;
  color: #5f5f5f;
  display: flex;
  justify-content: flex-start;
  line-height: 36rpx;
  height: 36rpx;
  padding: 22rpx 0;
}

.goods-price .price {
  color: #ff686b;
  font-size: 30rpx;
}

.goods-price .front-money {
  color: #FF3C3C;
  margin-left: 49rpx;
}

.goods-price .front-money .price {
  font-size: 30rpx;
  color: #f33;
  font-weight: bold;
} */
.activity-bg-bottom {
}

.share-reamin image {
  width: 28rpx;
  height: 24rpx;
  /* margin-right: 8rpx; */
}

/* 佣金相关 */

.commission-box {
  background: #ff8561;
  height: 110rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commission-box view {
  font-size: 30rpx;
  color: #fff;
}

.commission-box view > text {
  font-size: 40rpx;
  font-weight: bold;
}

.commission-box button {
  width: 234rpx;
  height: 66rpx;
  font-size: 30rpx;
  border-radius: 33rpx;
  border: 2rpx solid #fff;
  line-height: 66rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconShare.png') no-repeat
    21rpx;
  background-size: 35rpx 33rpx;
  margin: 0;
  padding: 0 0 0 60rpx;
}

.commission-box view image {
  width: 35rpx;
  height: 33rpx;
  margin-right: 9rpx;
}

/*商品名称价格等  */

.goods-info-box {
  /* padding: 10rpx 0; */
  background-color: #fff;
  position: relative;
  /* overflow: hidden; */
  margin-bottom: 20rpx;
}

.promotion_price_box {
  position: relative;
  z-index: 10;
  color: #fff;
  height: 129rpx;
  box-sizing: border-box;
  padding-bottom: 10rpx;
}

.promotion_price_box view,
.promotion_price_box text {
  position: relative;
}

.promotion_price_box1 {
  display: flex;
  align-items: center;
  padding-top: 5rpx;
  height: 40rpx;
}

.cuxiao_bg {
  position: absolute;
  left: 0;
  top: 42rpx;
  z-index: 0;
  width: 100%;
  height: 105rpx;
  background-color: #eb702d;
}

.seckill_bg {
  top: -42rpx;
}

.cuxiao_icon {
  position: absolute;
  left: 46rpx;
  top: -27rpx;
  width: 45rpx;
  height: 36rpx;
}

.pre_icon {
  width: 39rpx;
  height: 39rpx;
}

.seckill_icon {
  left: 46rpx;
  top: -30rpx;
  width: 39rpx;
  height: 39rpx;
}

.promotion_price_box .goods-nowPrice {
  font-size: 43rpx;
  margin-left: 27rpx;
  margin-right: 11rpx;
  font-weight: 700;
}

.promotion_price_box .goods-nowPrice text {
  font-size: 25rpx;
  font-weight: 400;
}

.promotion_price_box .goods-oldPrice {
  font-size: 22rpx;
  text-decoration: line-through;
  top: -6rpx;
}

.promotion_price_box .promotion_label {
  font-size: 22rpx;
  margin-left: 44rpx;
  margin-bottom: 15rpx;
  padding-top: 20rpx;
}

.promotion_price_box .price-item {
  font-size: 25rpx;
  margin-left: 40rpx;
}

.promotion_price_box .price-item .price {
  font-size: 43rpx;
  font-weight: 700;
}

.seckill_label {
  position: absolute;
  top: 20rpx;
  font-size: 22rpx;
  margin-left: 44rpx;
  margin-bottom: 15rpx;
}

/* .goods-info-box>view {
  margin-right: 24rpx;
  margin-left: 24rpx;
} */

.goods-info-box .goods-name {
  font-size: 35rpx;
  line-height: 64rpx;
  color: #454545;
  font-weight: bold;
  position: relative;
  padding-left: 24rpx;
  /* margin: 16rpx 0; */
  padding-top: 10rpx;
  /* margin: 26rpx 0; */
  /* width: calc(100% - 144rpx); */
}

/* .desc-share .goods-desc */

.goods-info-box .goods-name > view {
  display: -webkit-box !important;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-info-box .goods-name > view {
  -webkit-line-clamp: 2;
}

.desc-share .goods-desc {
  width: 70vw;
}

.goods-info-box.group .goods-name {
  font-size: 30rpx;
  line-height: 50rpx;
}

.goods-info-box .goods-name > view {
  font-size: 35rpx;
  line-height: 50rpx;
}

.goods-info-box .label-item {
  padding: 0 10rpx;
  height: 48rpx;
  border-radius: 6rpx;
  background: #009f55;
  color: #fff;
  font-size: 28rpx;
  line-height: 48rpx;
  font-weight: normal;
  display: inline-block;
  margin-right: 8rpx;
  vertical-align: top;
  margin-top: 8rpx;
}

.goods-info-box .goods-name text {
  display: inline-block;
}

.goods-info-box .goods-name .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #333;
}

.goods-soldNum text:nth-of-type(1) {
  display: inline-block;
  margin-right: 20rpx;
}

.goods-info-box .goods-delivery-info {
  color: #666;
  font-size: 24rpx;
  line-height: 36rpx;
  padding: 10rpx 0;
  display: flex;
  align-items: flex-start;
}

.goods-info-box .goods-delivery-info image {
  width: 36rpx;
  height: 24rpx;
  margin-right: 15rpx;
  margin-top: 6rpx;
  flex-shrink: 0;
}

.desc-share {
  position: relative;
  min-height: 50rpx;
  line-height: 50rpx;
  font-size: 21rpx;
}

.deliveryDesc {
  color: #ff9f43;
  font-size: 24rpx;
}

.goods-info-box .goods-desc {
  color: #999999;
  font-size: 22rpx;
  /* margin: 16rpx 0rpx; */
  display: block;
}

.desc-soldNum {
  display: flex;
  justify-content: space-between;
  /* width: 530rpx; */
  align-items: center;
  /* line-height: 44rpx; */
  /* margin: 10rpx 0 0 0; */
  flex: 1;
}

.desc-soldNum .goods-desc {
  width: 306rpx;
  margin: 0;
  color: #666;
  font-size: 24rpx;
}

/* .goods-info-box.group .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #454545;
} */
.goods-info-box .goods-soldNum {
  display: inline-block;
  font-size: 24rpx;
  font-weight: normal;
  color: #333;
}

.goods-info-box .goods-tag {
  font-size: 26rpx;
  min-height: 26rpx;
  line-height: 26rpx;
}

.goods-info-box .goods-tag text {
  display: inline-block;
  height: 40rpx;
  line-height: 38rpx;
  padding: 0rpx 10rpx;
  text-align: center;
  border: solid 2rpx red;
  border-radius: 20rpx;
  margin: 20rpx 10rpx 20rpx 0rpx;
}

.goods-info-box .goods-price-box {
  overflow: hidden;
  line-height: 48rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10rpx;
}

.goods-info-box .goods-nowPrice {
  color: #ff7121;
  font-size: 44rpx;
  margin-right: 16rpx;
  display: inline-block;
  font-weight: 700;
}

.goods-info-box .goods-nowPrice text {
  font-size: 22rpx;
}

.goods-info-box .goods-oldPrice {
  color: #c1c1c1;
  font-size: 22rpx;
  text-decoration: line-through;
}

.goods-info-box .sold_box {
  display: flex;
  border-top: 1px solid #eeeeee;
  margin-top: 20rpx;
  padding-top: 12rpx;
  padding-bottom: 12rpx;
  margin-right: 0;
  margin-left: 0;
  padding-left: 24rpx;
  align-items: center;
  justify-content: space-between;
}

.goods-info-box .sold_box text {
  color: #999999;
}

.goods-info-box .goods-soldNum {
  /* float: right; */
  font-size: 22rpx;
  color: #333;
  flex: 1;
  height: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}

.goods-info-box .share-commission {
  float: right;
  font-size: 24rpx;
  color: #ff9f43;
}

.goods-promise {
  border-top: 1rpx solid #dcdcdc;
  width: 100%;
  margin-top: 30rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 24rpx;
  color: #8b8b8c;
  display: flex;
  align-items: center;
}

.goods-promise view {
  margin-right: 30rpx;
}

.goods-promise view image {
  vertical-align: middle;
  margin-right: 15rpx;
  margin-top: -5rpx;
}

.goods-promise view:first-of-type image {
  width: 22rpx;
  height: 31rpx;
}

.goods-promise view:nth-last-child(2) image {
  width: 27rpx;
  height: 26rpx;
}

.goods-promise view:last-of-type image {
  width: 25rpx;
  height: 25rpx;
}

.goods-info-box.group .goods-promise {
  margin-top: 10rpx;
}

/* 规则 */

.team-rules {
  /* line-height: 89rpx; */
  font-size: 22rpx;
  color: #454545;
  background: #fff;
  margin: 20rpx 0;
  width: 100%;
  box-sizing: border-box;
  padding: 25rpx 20rpx 10rpx;
  flex-wrap: nowrap;
  text-align: center;
  /* padding: 10rpx 10rpx 20rpx 10rpx; */
}

.team_tip_icon {
  width: 708rpx;
  height: 38rpx;
  margin-bottom: 24rpx;
}

.team-rules text {
  color: #ff5003;
  text-decoration: underline;
}

/* 规格 */

.goods-standard {
  height: 89rpx;
  line-height: 89rpx;
  font-size: 30rpx;
  color: #454545;
  background: #fff;
  margin-bottom: 1rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 0 40rpx;
}

.goods-standard text:last-of-type {
  font-weight: bold;
}

/* 关联券 */

.labels-board {
  font-size: 24rpx;
  line-height: 32rpx;
  color: #454545;
  background: #fff;
  margin-bottom: 1rpx;
  width: calc(100% - 48rpx);
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.labels-title {
  width: 70rpx;
  flex-shrink: 0;
}

.labels-content-board {
  display: flex;
  flex-direction: column;
}

.labels-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5rpx;
}

.labels-content :last-child {
  font-size: 24rpx;
}

.labels-tag {
  border: 1rpx solid #ff7200;
  color: #ff7200;
  font-size: 24rpx;
  height: 30rpx;
  line-height: 32rpx;
  padding: 0rpx 8rpx;
  flex-shrink: 0;
  margin-right: 19rpx;
  border-radius: 4rpx;
}

/* 关联券 */

.goods-related-coupon {
  height: 70rpx;
  font-size: 24rpx;
  color: #454545;
  background: #fff;
  margin: 1rpx 0;
  width: 100%;
  padding: 0 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
}

.goods-related-coupon .rt {
  display: flex;
  align-items: center;
  width: 80rpx;
}

.goods-related-coupon .rt text {
  width: 2em;
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 400;
  color: #ff7103;
  margin-right: 22rpx;
}

.goods-related-coupon .rt image {
  flex-shrink: 0;
  width: 14rpx;
}

.related-coupon-board {
  width: calc(100vw - 70rpx - 60rpx - 40rpx);
  height: 34rpx;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 商品详情页面显示的简易券信息 */

.goods-mini-coupon {
  border-radius: 5rpx;
  background-color: #ff7200;
  font-size: 24rpx;
  color: white;
  flex-shrink: 0;
  padding: 2rpx 6rpx;
  line-height: 30rpx;
  height: 30rpx;
}

.goods-mini-coupon:nth-child(n + 2) {
  margin-left: 20rpx;
}

.goods-mini-coupon :last-child {
  margin-right: 20rpx;
}

/* 商品预售 */

.goods-presell {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.goods-presell > text {
  display: block;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  text-indent: 40rpx;
  border-bottom: 1rpx solid #ddd;
}

.presell-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx 25rpx;
}

.presell-item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.presell-item::after {
  position: absolute;
  right: 5%;
  top: 10rpx;
  height: 1px;
  width: 40%;
  background-color: #7c21ec33;
  content: '';
}

.presell-item:last-of-type::after {
  position: absolute;
  right: 30rpx;
  top: 27rpx;
  height: 1px;
  width: 50%;
  background-color: transparent;
  content: '';
}

.presell-item > text {
  font-size: 24rpx;
  line-height: 52rpx;
  color: #7e21ec;
}

.presell-item .bottom {
  display: flex;
  justify-content: center;
  text-align: left;
  padding: 7rpx 0 0;
  line-height: 38rpx;
  word-wrap: break-word;
}

.presell-icon {
  width: 30rpx;
  height: 30rpx;
  border: 7rpx solid #ffd966;
  box-sizing: border-box;
  border-radius: 50%;
  margin: 0 0 3rpx 0;
  background: #fff;
}

.presell-item > text.top {
  font-size: 24rx;
  color: #7e21ec;
  padding-bottom: 6rpx;
  /* border-bottom: 4rpx solid #ffebb0; */
  margin-bottom: -5rpx;
  width: 100%;
  text-align: left;
  /* padding-top: 32rpx; */
  font-style: italic;
  font-weight: 700;
  line-height: 24rpx;
}

/* 商品详情 */

.goods-details {
  background-color: #fff;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  /* display: flex;
  justify-content: flex-start; */
  padding: 20rpx 24rpx 1rpx 0;
  flex-wrap: wrap;
}

.goods-details > text {
  display: block;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  text-indent: 40rpx;
  border-bottom: 1rpx solid #ddd;
}

.goods-details > view {
  width: 100%;
  font-size: 30rpx;
  padding: 0 20rpx;
  overflow: hidden;
  position: relative;
  display: flex;
  margin-bottom: 8rpx;
}

/* .goods-details>view::before {
  content: '';
  height: 68rpx;
  width: 1rpx;
  background: #f1f1f1;
  position: absolute;
  left: 0;
  top: 40rpx;
} */

.goods-details > view:last-of-type {
  border: none;
}

.goods-details > view text {
  /* display: block; */
  /* float: left; */
  margin-right: 20rpx;
}

.goods-details > view text:first-of-type {
  /* width: 100%;
  white-space: warp;
  overflow: hidden;
  text-overflow: ellipsis; */
  color: #8b8b8c;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-bottom: 6rpx;
  width: 150rpx;
}

.goods-details > view text:last-of-type {
  font-size: 24rpx;
  /* line-height: 36rpx; */
  color: #454545;
  white-space: wrap;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  /* width: 100%; */
  flex: 1;
}

/* 图文详情 */

.goods-imgtext {
  background-color: #fff;
  margin-top: 20rpx;
  /* margin-bottom: 120rpx; */
}

.botton-block {
  height: 160rpx;
  width: 100%;
}

.goods-imgtext > text {
  display: block;
  text-indent: 24rpx;
  font-size: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-imgtext image {
  width: 100%;
  display: block;
}

/* 操作 */

.handle-box {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  display: flex;
  border-top: 1rpx solid #dadada;
  height: 160rpx;
  padding: 15rpx 0 30rpx 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: #fff;
}

.handle-box view {
  /* height: 74rpx; */
  text-align: center;
  /* line-height: 74rpx; */
  float: left;
  /* color: #fff; */
  font-size: 30rpx;
  position: relative;
  display: flex;
}

.handle-box view view.badge {
  position: absolute;
  right: 8rpx;
  top: -4rpx;
  width: 24rpx;
  height: 24rpx;
  text-align: center;
  line-height: 24rpx;
  font-size: 20rpx;
  color: #fff;
  background: #ff5601;
  border-radius: 16rpx;
  display: block;
}

.handle-box view.home-icon,
.handle-box .shopcart-icon,
.handle-box .share-reamin1,
.handle-box .contact-icon {
  /* width: 120rpx; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  margin-right: 20rpx;
  margin-top: 8rpx;
}

.handle-box view.home-icon,
.handle-box .contact-icon {
  border: 0;
}

.handle-box view.home-icon text,
.handle-box .shopcart-icon text,
.handle-box .share-reamin1 text,
.handle-box .contact-icon text {
  height: 42rpx;
  width: 82rpx;
  line-height: 42rpx;
  font-size: 22rpx;
  color: #9a9a9a;
}

.handle-box .shopcart-icon {
  margin-right: 20rpx;
  /* border: 0; */
}

.handle-box view.share-reamin1 {
  margin-right: 35rpx;
}

.handle-box view.share-reamin1 image {
  width: 37rpx;
  height: 37rpx;
  /* margin-bottom: 24rpx; */
}

.handle-box view.home-icon image {
  width: 37rpx;
  height: 37rpx;
  /* margin-bottom: 24rpx; */
}

.handle-box view.contact-icon image {
  width: 37rpx;
  height: 37rpx;
  /* margin-bottom: 24rpx; */
}

.handle-box view.home-icon button,
.handle-box view.contact-icon button {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  position: absolute;
  left: 0;
  top: 0;
}

.handle-box view.home-icon button::after,
.handle-box view.contact-icon button::after {
  border: none;
}

.handle-box .shopcart-icon image {
  width: 37rpx;
  height: 37rpx;
  /* margin-bottom: 24rpx; */
}

.handle-box view:nth-of-type(3) {
  /* width: 480rpx; */
  background-color: #fff;
}

.handle-box view .soldOut-good {
  width: 400rpx !important;
  color: #fff !important;
  background-color: #c1c1c1 !important;
}

.handle-box view.no-goods {
  background: #c1c1c1;
}

.handle-box view.no-goods button {
  background: #c1c1c1;
}

.handle-box view.no-seckill-goods button {
  background: #c1c1c1;
}

.handle-box view button {
  width: 200rpx;
  height: 74rpx;
  line-height: 74rpx;
  border-radius: 0rpx;
  background: #ff9f43;
  color: #fff;
  font-size: 30rpx;
  /* font-weight: bold; */
  padding: 0;
  display: inline-block;
  /* top: -10rpx; */
}

.handle-box view .addCart {
  background: #fff;
  color: #ff9f43;
}

.handle-box view button.bg-FF7200 {
  background: #ff7200 !important;
}

.handle-box view.normal-button {
  width: 400rpx;
  height: 74rpx;
  display: flex;
  flex: 1;
  border-radius: 37rpx;
  margin-right: 20rpx;
  overflow: hidden;
}

.handle-box view.seckill {
  width: 400rpx;
  display: flex;
  flex: 1 1 auto;
  border-radius: 37rpx;
  overflow: hidden;
}

.handle-box view.seckill button {
  flex: 1;
  min-width: 200rpx;
}

.handle-box view.normal-button button {
  flex: 1;
  width: 200rpx;
}

.handle-box view.normal-button.no-goods button {
  flex: 1;
  width: 400rpx;
}

.handle-box view.normal-button button.add-cart {
  color: #ff9f43;
  background: #ffffff;
}

.handle-box view.team-button {
  display: flex;
  width: 400rpx;
  max-width: 400rpx;
  /* margin-top: -10rpx; */
  height: 74rpx;
  float: right;
  position: relative;
  border-radius: 37rpx;
  overflow: hidden;
}

.handle-box view.team-button button {
  flex: 1;
  padding: 0;
  box-sizing: border-box;
  width: 200rpx;
  color: #ff9f43;
  border-radius: 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 74rpx;
  background: transparent;
}

.handle-box view.team-button button.add-cart {
  background: #fff;
  height: 74rpx;
  top: 0rpx;
}

.handle-box view.team-button.no-goods button.add-cart {
  background: #fff;
  height: 74rpx;
}

.handle-box view.team-button button text {
  display: block;
}

.handle-box view.team-button button text:first-of-type {
  font-size: 32rpx;
  line-height: 36rpx;
}

.handle-box view.team-button button text:last-of-type {
  font-size: 24rpx;
  line-height: 28rpx;
}

.handle-box view.team-button button.group {
  background: #ff9f43;
  height: 74rpx;
  color: #fff;
  top: 0rpx;
}

.handle-box .seckill {
  /* width: 600rpx; */
  position: relative;
  display: flex;
}

.handle-box .seckill button {
  /* width: 400rpx; */
  margin-right: 20rpx;
}

.handle-box .seckill form button {
  /* border: 2rpx solid #009f55; */
  color: #ff9f43;
  background: #fff;
}

.handle-box .seckill button:last-of-type {
  margin-right: 0;
}

button::after {
  border: 0;
  border-radius: 0;
}

/* 拼团 */

.team-box {
  padding: 0rpx 22rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.team-box > view {
  border-bottom: 1rpx solid #dcdcdc;
}

.team-box .team-title {
  font-size: 26rpx;
  height: 78rpx;
  line-height: 78rpx;
}

.team-box .team-title image {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-right: 22rpx;
}

.team-box .team-title .more {
  float: right;
  color: #333;
  font-size: 26rpx;
  padding-right: 27rpx;
  font-weight: Light;
  position: relative;
}

.team-box .team-title .more image {
  width: 12rpx;
  height: 23rpx;
  position: absolute;
  right: -27rpx;
  top: 50%;
  margin-top: -11.5rpx;
}

.team-box > view:nth-last-of-type(2) {
  border: none !important;
}

.no-data {
  font-size: 24rpx;
  line-height: 48rpx;
  padding: 24rpx 0;
  color: #666;
  display: flex;
  justify-content: center;
}

.secKill-box {
  height: 120rpx;
  width: 100%;
  box-sizing: border-box;
  padding: 0 27rpx;
  /* background:linear-gradient(45deg, #fed700 0%, #ffa200 100%); */
  /* background: #009f55; */
  color: #fff;
  /* overflow: hidden; */
}

.group-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  height: 129rpx;
  /* background: linear-gradient(450deg, rgba(255, 114, 0, 1), rgba(255, 173, 106, 1)); */
  /* background: #009f55; */
  /* background: linear-gradient(90deg, rgba(255, 159, 67, 1), rgba(238, 82, 83, 1)); */
  color: #fff;
  /* overflow: hidden; */
  /* margin-top: -100rpx; */
  position: relative;
  z-index: 9;
}

/* 秒杀 */

.secKill-price-box {
  position: relative;
  font-size: 22rpx;
  float: left;
  justify-content: flex-end;
}

.secKill-nowPrice {
  font-size: 56rpx;
  line-height: 120rpx;
  height: 120rpx;
  margin-right: 16rpx;
  float: left;
  font-weight: bold;
}

.secKill-nowPrice text {
  font-size: 24rpx;
  font-weight: bold;
}

.secKill-oldPrice {
  text-decoration: line-through;
  display: inline-block;
  height: 30rpx;
}

.secKill-surplusNum {
  display: inline-block;
}

.secKill-logo {
  display: inline-block;
  width: 85rpx;
  height: 22rpx;
}

.secKill-price-right {
  height: 60rpx;
  padding: 40rpx 0 0;
  float: left;
  line-height: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.secKill-time-down {
  position: relative;
  float: right;
  color: #fff;
  font-size: 24rpx;
  line-height: 120rpx;
}

.secKill-time-down .txt {
  display: inline-block;
  width: 48rpx;
  height: 48rpx;
  /* background-color: #fbc200; */
  /* border: 1rpx solid #fff; */
  border-radius: 6rpx;
  color: #fff;
  text-align: center;
  line-height: 48rpx;
  margin: 0rpx 10rpx;
  /* vertical-align: middle; */
}

.secKill-time-down .colon {
  color: #fff;
}

/* 团购 */

.group-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-people-number {
  position: relative;
  height: 100%;
  font-size: 24rpx;
  line-height: 100rpx;
  padding-left: 22rpx;
  padding-bottom: 10rpx;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.group-people-number .group-number {
  /* margin-top: 8rpx; */
  font-weight: bold;
  /* margin-right: 8rpx; */
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-price-box {
  font-size: 34rpx;
  /* margin-left: 9rpx; */
  display: flex;
  align-items: baseline;
  height: 100rpx;
  display: flex;
  flex-direction: column;
  margin-right: 2rpx;
}

.group-price-box .price-type {
  font-size: 18rpx;
  color: #ee5253;
  background: #ffebd5;
  border-radius: 12rpx;
  width: 92rpx;
  height: 24rpx;
  line-height: 24rpx;
  text-align: center;
  margin: 0 auto;
}

.group-nowPrice {
  font-size: 34rpx;
  line-height: 40rpx;
  height: 40rpx;
  margin-bottom: 12rpx;
  margin-top: 15rpx;
  /* font-weight: bold; */
}

.group-nowPrice text {
  font-size: 48rpx;
  font-weight: bold;
}

.group-price-oldPrice {
  display: flex;
  flex-direction: column;
}

.group-price-oldPrice text {
  height: 40rpx;
  line-height: 40rpx;
}

.group-oldPrice {
  font-size: 22rpx;
  text-decoration: line-through;
  /* display: none; */
}

.group-time-down {
  position: relative;
  float: right;
  color: #333;
  font-size: 24rpx;
  /* padding-right: 32rpx; */
  /* line-height: 100rpx; */
  height: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 310rpx;
  box-sizing: border-box;
  padding: 20rpx 0 15rpx 60rpx;
  position: relative;
}

.group-time-down > view {
  position: relative;
}

.group-time-down > text {
  position: relative;
}

.secKill-time-down {
  box-sizing: border-box;
  height: 129rpx;
}

.group-time-down.secKill-time-down {
  width: 265rpx;
  padding-left: 30rpx;
}

.group-time-down-bg {
  width: 310rpx;
  height: 100rpx;
  position: absolute;
  top: 0;
  /* z-index: -1; */
}

.secKill-time-down-bg {
  width: 259rpx;
  height: 129rpx;
  right: 0;
}

.team-time-down-bg {
  width: 309rpx;
  height: 129rpx;
  right: 0;
}

.group-time-down-show {
  margin-top: 5.5rpx;
}

.team-time-down-show text {
  font-size: 24rpx;
}

.group-time-down-tips {
  color: #ff5003;
  background-color: #fff;
  width: 160rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 24rpx;
}

.team-time-down-tips {
  box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(148, 65, 0, 0.11);
}

.group-time-down > view {
  font-size: 20rpx;
  line-height: 40rpx;
}

.group-time-down .team-time-down-tips {
  font-size: 24rpx;
  width: 160rpx;
}

.group-time-down > view:last-of-type {
  /* margin-bottom: 10rpx; */
}

.group-time-down .txt {
  display: inline-block;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  /* background-color: #fbc200; border: 2rpx solid #fff; */
  border-radius: 6rpx;
  color: #fffefe;
  background: #ff7121;
  text-align: center;
  margin: 0rpx 3rpx;
  box-sizing: border-box;
}

.group-time-down .txt:last-of-type {
  margin-right: 0;
}

.group-time-down .colon {
  color: #ff9e53;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* 加入购物车 */

.handle-goods {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 518rpx;
  padding-bottom: 120rpx;
}

.handle-goods .close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
  align-items: center;
}

.handle-goods .close {
  width: 44rpx;
  height: 44rpx;
}

.handle-goods .goods-box {
  padding: 70rpx 30rpx 50rpx 30rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #dcdcdc;
}

.handle-goods .goods-box .goods-img {
  width: 158rpx;
  height: 158rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
}

.handle-goods .goods-box .goods-img image {
  width: 158rpx;
  height: 158rpx;
}

.handle-goods .goods-box .goods-info {
  width: calc(100% - 180rpx);
  position: relative;
  float: right;
  color: #454545;
}

.handle-goods .goods-box .goods-info .goods-name {
  font-size: 35rpx;
  line-height: 48rpx;
  font-weight: bold;
  margin-bottom: 14rpx;
}

.handle-goods .goods-box .goods-info .goods-desc {
  font-size: 21rpx;
  line-height: 36rpx;
  margin-bottom: 18rpx;
}

.handle-goods .goods-box .goods-info .goods-price-box {
  font-size: 34rpx;
  line-height: 36rpx;
}

.handle-goods .goods-box .goods-info .goods-price-box text:first-of-type {
  color: #ff8561;
  margin-right: 34rpx;
}

.handle-goods .goods-box .goods-info .goods-price-box text:last-of-type {
  font-size: 28rpx;
}

.handle-goods .goods-num {
  height: 136rpx;
  line-height: 136rpx;
  padding: 0 30rpx;
  font-size: 36rpx;
}

.handle-goods .goods-num .count-box {
  float: right;
  width: 164rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 56rpx;
  height: 56rpx;
  margin-top: 40rpx;
  border: 1rpx solid #f1f1f1;
}

.handle-goods .goods-num .count-box input {
  background: #fff;
  color: #454545;
  font-size: 30rpx;
  width: 62rpx;
  height: 100%;
  text-align: center;
  /* display: inline-block; */
}

.handle-goods .goods-num .count-box view {
  width: 56rpx;
  height: 56rpx;
  text-align: center;
  font-size: 48rpx;
  background: #f1f1f1;
  color: #009136;
  line-height: 56rpx;
}

.handle-goods .goods-num .count-box .unavailable {
  color: #999;
}

.handle-goods .button-box {
  display: flex;
  width: 100%;
  height: 100rpx;
  padding: 10rpx 0;
  border-top: 1rpx solid #dcdcdc;
  position: absolute;
  bottom: 0;
}

.handle-goods .button-box button {
  font-size: 30rpx;
  box-sizing: border-box;
}

.handle-goods button::after {
  border: 1rpx solid #009f55;
  /* border: none; */
}

.handle-goods .button-box .confirm {
  width: 692rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: #fff;
  border-radius: 6rpx;
  color: #009f55;
  border: 1rpx solid #009f55;
}

/* 拼团弹窗 */

.join-group {
  position: relative;
  width: 670rpx;
  min-height: 620rpx;
  margin: 40% auto;
  border-radius: 6rpx;
  padding-bottom: 100rpx;
}

.join-group .title {
  font-size: 32rpx;
  color: #454545;
  border-bottom: 1rpx solid #f1f1f1;
  height: 130rpx;
  width: 100%;
  text-align: center;
  padding-top: 10rpx;
  line-height: 130rpx;
}

.join-group .group-info {
  border-bottom: 20rpx solid #f1f1f1;
}

.join-group .group-info view:first-of-type {
  font-size: 26rpx;
  line-height: 88rpx;
  height: 88rpx;
  color: #454545;
  text-indent: 40rpx;
}

.join-group .group-info view:first-of-type text {
  color: #009f55;
  font-size: 32rpx;
}

.join-group .group-info view:last-of-type {
  height: 72rpx;
  padding-bottom: 8rpx;
  text-indent: 40rpx;
  font-size: 24rpx;
  line-height: 72rpx;
  color: #8b8b8c;
}

.join-group .group-info view:last-of-type text {
  font-size: 28rpx;
  color: #1b1b1d;
  font-weight: bold;
  vertical-align: middle;
  margin: 0 26rpx 0 23rpx;
}

.join-group .group-info view image {
  width: 23rpx;
  height: 29rpx;
  vertical-align: middle;
  margin-top: -3rpx;
  margin-right: 14rpx;
}

.group-people-list {
  padding: 33rpx 50rpx;
  min-height: 100rpx;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.people-item {
  /* margin-left: 34rpx; */
  width: 100rpx;
  height: 100rpx;
  margin: 5rpx 0;
  border-radius: 50%;
  border: 3rpx dashed #adadad;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.group-people-list .leader {
  border: 3rpx solid #009f55;
}

.people-item image {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
}

.people-more {
  width: 100rpx;
  height: 100rpx;
  margin: 5rpx 0;
  border-radius: 50%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.people-more image {
  width: 100rpx;
  height: 100rpx;
}

.people-item text {
  font-size: 28rpx;
  line-height: 101rpx;
  color: #999;
}

.people-item:first-of-type {
  margin-left: 0;
}

.join-group .button-box {
  width: 100%;
  height: 100rpx;
  background: #009f55;
  font-size: 32rpx;
  line-height: 100rpx;
  color: #fff;
  font-weight: Medium;
  border: 0;
  border-radius: 0;
  position: absolute;
  bottom: 0;
  left: 0;
}

button[class='button-box']::after {
  border: 0;
}

.page-content {
  /* height: calc(100% - 160rpx); */
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  /* padding-bottom: 120rpx; */
  box-sizing: border-box;
  position: relative;
}

movable-area {
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  padding: 0;
  background: transparent;
  border-radius: 0;
  position: fixed;
  right: 0;
  top: 900rpx;
}

.movable-view image {
  width: 100%;
  height: 100%;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
  /* position: relative; */
  z-index: 6;
}

/* 分享选择 */

.bottom-pop {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.bottom-pop-main {
  position: absolute;
  bottom: -280rpx;
  left: 0rpx;
  width: 100%;
  height: 280rpx;
  overflow: hidden;
  background: #fff;
  text-align: center;
}

.bottom-pop-main .cancel {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  border-top: 1rpx solid #ddd;
}

.bottom-pop-main .share-type-box {
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-pop-main .share-type-box > view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  width: 50%;
  height: 120rpx;
  box-sizing: border-box;
  float: left;
}

.bottom-pop-main .share-type-box > view image {
  height: 80rpx;
  width: 80rpx;
}

.bottom-pop-main .share-wx {
  border-right: 1rpx solid #ddd;
  position: relative;
}

.bottom-pop-main .share-wx button {
  background: transparent;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
}

.bottom-pop-main .share-wx button::after {
  border: none;
}

.poster-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0rpx;
  left: 0rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 32rpx;
  overflow-y: scroll;
}

.poster-box-bg {
  background: #fff;
  width: 100%;
  height: 92%;
  position: fixed;
  bottom: 0;
}

.close-poster-box {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  color: #000;
}

.poster-picture-box {
  width: 600rpx;
  height: 875rpx;
  margin: 0 auto;
  margin-top: 48rpx;
  margin-bottom: 20rpx;
}

.poster-picture-box canvas {
  width: 600rpx;
  height: 875rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-box .saveImage {
  width: 80%;
  height: 90rpx;
  background: #019f55;
  color: #fff;
  font-size: 34rpx;
  margin: 0 auto 8rpx auto;
  border-radius: 50rpx;
}

.poster-box .saveImageTips {
  font-size: 28rpx;
  color: #5b5b5b;
}

/*抛物线动画*/

.good_box {
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  left: 0;
  top: 0;
  z-index: +99;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.good_box image {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

/* 商品评论 */

.goods-comment {
  margin: 20rpx 0;
  background: #fff;
  padding: 0 40rpx 28rpx 40rpx;
}

.comment-title {
  font-size: 32rpx;
  color: #1b1b1d;
  line-height: 90rpx;
  text-align: center;
  width: 100%;
  border-bottom: 2rpx solid #f1f1f1;
}

.goods-comment .more {
  font-size: 28rpx;
  color: #009319;
  line-height: 64rpx;
  /* margin-top: 24rpx; */
  text-align: center;
  width: 360rpx;
  height: 64rpx;
  border-radius: 32rpx;
  border: 1px solid #009319;
  margin: 24rpx auto 0 auto;
}

.goods-comment .comment-item {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-item-con {
  padding-bottom: 0;
}

button.authorization {
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

button.authorization::after {
  border: none;
}

.bg-009f55 {
  background: #009f55 !important;
}

.group-share-img-box {
  position: absolute;
  top: 30%;
  left: 120%;
  width: 992rpx;
  height: 804rpx;
}

.group-share-img-box canvas {
  width: 100%;
  height: 100%;
}

.relevant-goods-view {
  background-color: #fff;
  /* margin-bottom: 97rpx; */
}

.relevant-goods-view > text {
  display: block;
  text-indent: 40rpx;
  font-size: 36rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.relevant-scrollview {
  /* display: flex; */
  width: 100%;
  margin-top: 20rpx;
  white-space: nowrap;
}

.relevant-scrollview goods-item-small {
  margin-right: 20rpx;
  display: inline-block;
}

.relevant-scrollview goods-item-small:last-of-type {
  margin-right: 0;
}

.popup-relate-coupon-board {
  background-color: white;
  font-size: 28rpx;
}

.popup-coupon-bottom {
  padding: 30rpx 0;
  background: #f2f2f2;
}

.popup-coupon-bottom view {
  width: 670rpx;
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  line-height: 90rpx;
  margin: 0 auto;
  color: #fff;
}

.popup-content {
  height: 350rpx;
  background: #f2f2f2;
  margin-top: 24rpx;
  padding-top: 15rpx;
}

.popup-title {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: bold;
  font-size: 36rpx;
}

.popup-close {
  position: absolute;
  right: 10rpx;
  top: 15rpx;
  width: 50rpx;
  height: 50rpx;
}

.vip-price {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #171613;
  display: inline-flex;
  align-items: center;
}

.vip-price text {
  flex-shrink: 0;
}

.vip-price .vip-label {
  position: relative;
  min-width: 71rpx;
  height: 25rpx;
  flex-shrink: 0;
  margin-top: -4rpx;
}

.vip-price .vip-label image {
  width: 71rpx;
  height: 25rpx;
}

.vip-price .vip-label text {
  white-space: nowrap;
  min-width: calc(100% - 12rpx);
  height: 100%;
  padding: 0 6rpx;
  display: inline-block;
  font-size: 18rpx;
  line-height: 25rpx;
  text-align: center;
  color: #ffeba5;
  background: #403e3e;
  position: absolute;
  left: 6rpx;
  top: 2rpx;
  z-index: 2;
  border-radius: 4rpx;
}

.popup-rules-detail-board {
  width: 640rpx;
  height: 766rpx;
  background: #fff;
  border-radius: 16rpx;
}

.popup-rules-detail-board .popup-content {
  padding: 0 40rpx 40rpx 40rpx;
  height: calc(100% - 120rpx);
  overflow: scroll;
  background: #fff;
  margin-top: 0;
  box-sizing: border-box;
}

.popup-rules-detail-board .popup-content > view {
  margin-bottom: 30rpx;
  color: #666;
}

.popup-rules-detail-board .popup-content .rule-title {
  color: #000;
  font-weight: bold;
}

.popup-upgrade-box {
  width: 660rpx;
  /* height: 440rpx; */
  padding-bottom: 140rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-upgrade-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-upgrade-content {
  color: #1c1c1c;
  font-size: 42rpx;
  font-weight: 400;
  line-height: 64rpx;
  padding: 0 60rpx 20rpx 60rpx;
  text-align: left;
}

.popup-upgrade-button {
  position: absolute;
  bottom: 0;
  font-size: 36rpx;
  width: 100%;
  height: 110rpx;
  display: flex;
}

.popup-upgrade-button > view {
  width: 100%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}

.goods-packaging {
  width: 100%;
  height: 90rpx;
  padding: 0 22rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  color: #454545;
  font-size: 32rpx;
  margin-top: 1rpx;
  box-sizing: border-box;
}

.goods-packaging .rt {
  display: flex;
  align-items: center;
  width: auto;
}

.goods-packaging .rt text {
  width: 3em;
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 400;
  color: #ff7103;
  margin-right: 22rpx;
}

.goods-packaging .rt image {
  width: 14rpx;
  flex-shrink: 0;
}

.process_wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
}

.process {
  display: flex;
  align-items: center;
  width: 100%;
}

.process_icon {
  width: 40rpx;
  height: 40rpx;
}

.process_line {
  background: #ee5253;
  flex: 1;
  height: 5rpx;
}

.process_name {
  font-size: 24rpx;
  /* margin-bottom: 10rpx; */
  padding-top: 15rpx;
}

/* components/product/goods-spec/goods-spec.wxss */

.spec-box {
  width: 100%;
  /* height: 750rpx; */
  height: 1183rpx;
  margin-top: 80rpx;
  background: #fff;
  /* position: relative; */
  border-radius: 30rpx 30rpx 0 0;
  padding: 0 30rpx;
  box-sizing: border-box;
  padding-bottom: 158rpx;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spec-date-scroll {
  width: 100%;
  flex: 1;
  overflow-y: scroll;
}

/* .spec-img-box {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  left: 23rpx;
  top: 40rpx;
}

.spec-img-box image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
} */

.spec-close-box {
  height: 29rpx;
  width: 29rpx;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 30rpx;
  top: 110rpx;
}

.spec-close-box image {
  height: 44rpx;
  width: 44rpx;
}

.price-box {
  width: 702rpx;
  box-sizing: border-box;
  padding: 91rpx 0 36rpx 220rpx;
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #333333;
  line-height: 48rpx;
}

.price-box .price {
  font-size: 34rpx;
  color: #009f55;
  line-height: 48rpx;
  margin-bottom: 20rpx;
}

.price-box .price text {
  font-size: 48rpx;
}

.spec-con-box {
  padding: 0 24rpx;
  width: 702rpx;
}

.spec-section {
  padding: 15rpx 0;
  width: 702rpx;
}

.spec-section-name {
  font-size: 30rpx;
  color: #333333;
  margin-bottom: 10rpx;
  font-weight: 600;
  line-height: 38rpx;
}

.spec-option {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 14rpx 0;
}

.spec-option-item {
  display: inline-block;
  flex-shrink: 0;
  font-size: 26rpx;
  color: #666666;
  line-height: 46rpx;
  height: 46rpx;
  background: #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  min-width: 46rpx;
  text-align: center;
  box-sizing: content-box;
  margin: 10rpx 27rpx 10rpx 0;
}

.spec-option .active {
  background: #009f55;
  color: #ffffff;
}

.spec-option .disabled {
  background: #fafafa;
  text-decoration: line-through;
}

.spec-button-box {
  position: fixed;
  left: 30rpx;
  bottom: 40rpx;
  height: 98rpx;
  width: 690rpx;
  border-radius: 98rpx;
  overflow: hidden;
}

.spec-button {
  height: 100%;
  width: 100%;
  background: #009f55;
  color: #fff;
  border-radius: 0;
  padding: 0;
  font-size: 36rpx;
  line-height: 98rpx;
  text-align: center;
}

.spec-button.disabled {
  background: rgba(0, 159, 85, 0.5);
}

.spec-button::after {
  border: none;
}

.choose-product-num {
  position: absolute;
  bottom: 100rpx;
  width: calc(100% - 24rpx - 24rpx);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 108rpx;
  border-top: 1px solid #f7f4f8;
  border-bottom: 1px solid #f7f4f8;
  margin: 30rpx 24rpx 66rpx 24rpx;
}

.goods-count-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-count-box > view {
  width: 39rpx;
  height: 39rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 36rpx;
  background: #fdfdfd;
  color: #ff9f43;
  line-height: 34rpx;
  display: flex;
  justify-content: center;
}

.goods-count-box > view.num {
  width: 64rpx;
  height: 50rpx;
  margin: 0 4rpx;
  line-height: 50rpx;
  color: #333;
  text-align: center;
  border-radius: 3rpx;
  min-width: 44rpx;
  padding: 0 10rpx;
  font-size: 24rpx;
}

.flexbox {
  position: absolute !important;
  right: 0;
}

.f1 {
  flex: 1;
}

.df {
  display: flex;
}

.db {
  display: block !important;
}

.btnw {
  /* width: calc(100vw - 186rpx) !important; */
}

.advanceSell_button {
  flex: 1;
  border-radius: 37rpx;
  overflow: hidden;
}

.handle-box .advanceSell_button button {
  width: 100%;
}

.spec-box .spec-hd {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 32rpx 0;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea;
}

.spec-img-box {
  width: 180rpx;
  height: 180rpx;
  background-color: #ccc;
  margin-right: 30rpx;
}

.spec-img-box image {
  width: 100%;
  height: 100%;
}

.spec-hd .spec-right {
  flex: 1;
}

.spec-hd .spec-right .title {
  font-weight: bold;
  font-size: 32rpx;
  color: #333333;
  padding-right: 28rpx;
  box-sizing: border-box;
}

.spec-hd .spec-right .price {
  margin-top: 30rpx;
}

.spec-hd .spec-right .price text {
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 37rpx;
}

.spec-hd .spec-right .price text:nth-of-type(2) {
  text-decoration: line-through;
}

.spec-hd .spec-right .price text:nth-of-type(1) {
  display: inline-block;
  margin-right: 12rpx;
  font-weight: bold;
  font-size: 32rpx;
  color: #eb702d;
}

.spec-hd .spec-right .spec-right-num {
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
}

.spec-hd .spec-right .spec-right-num text:nth-of-type(1) {
  display: inline-block;
  margin-right: 20rpx;
}

.spec-date {
  overflow: hidden;
}

.spec-date .hd {
  font-weight: bold;
  font-size: 28rpx;
  color: #333333;
  margin: 34rpx 0 30rpx 0;
}

.spec-date .item-spec {
  /* flex: 0 1 auto; */
  display: inline-block;
  width: auto;
  margin-right: 40rpx;
  background: #eaeaea;
  border-radius: 10rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 60rpx;
  text-align: center;
  padding: 2rpx 20rpx;
  box-sizing: border-box;
  margin-bottom: 10rpx;
}

.spec-gift .hd {
  font-weight: bold;
  font-size: 28rpx;
  color: #333333;
  margin: 34rpx 0 30rpx 0;
}

.gift-content {
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: scroll;
}

.gift-content-item {
  position: relative;
  width: 145rpx;
  height: 252rpx;
  background: #ffffff;
  border-radius: 10rpx;
  border: 2px solid transparent;
  margin-right: 22rpx;
  overflow: hidden;
}

.gift-content-item checkbox {
  position: absolute;
  right: 9rpx;
  top: 0;
  width: 25rpx;
  height: 25rpx;
}

.gift-content-item .content-item-img {
  width: 100%;
  overflow: hidden;
}

.gift-content-item .content-item-img image {
  display: block;
  width: 146rpx;
  height: 146rpx;
}

.gift-content-item .content-item-goodsname {
  display: block;
  font-weight: 400;
  font-size: 18rpx;
  height: 54rpx;
  line-height: 24rpx;
  text-align: center;
  color: #333333;
  padding: 0 16rpx;
  box-sizing: border-box;
  padding-top: 8rpx;
  background-color: #f2f2f2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.gift-content-item .content-item-price {
  display: flex;
  padding: 16rpx 0;
  background-color: #f2f2f2;
}

.gift-content-item .content-item-price .nwe-price {
  font-weight: 400;
  font-size: 18rpx;
  color: #eb702d;
  margin: 0 10rpx 0 29rpx;
}

.gift-content-item .content-item-price .old-price {
  font-weight: 400;
  font-size: 18rpx;
  color: #999999;
  text-decoration-line: line-through;
}

.spec-time .hd {
  font-weight: bold;
  font-size: 28rpx;
  color: #333333;
  margin: 34rpx 0 30rpx 0;
  display: flex;
  justify-content: space-between;
}

.spec-time .hd text:nth-of-type(2) {
  font-weight: 400;
  font-size: 24rpx;
}

.spec-time .content {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  max-height: 423rpx;
  overflow-y: auto;
}

.spec-time .content .item {
  width: 129rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  background: #eaeaea;
  border-radius: 10rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
}

.spec-time2 .content {
  flex-direction: column;
  flex-wrap: nowrap;
  /* overflow-y: auto; */
}

.spec-time2 .content > view {
  width: 100%;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: space-between;
  border-radius: 10rpx;
  border: 1px solid #ccc;
  height: 60rpx;
  padding: 0 60rpx 0 18rpx;
  box-sizing: border-box;
  margin-bottom: 10rpx;
}
.spec-time2 .hd .fixed-right {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 24rpx;
}
.goods-info-box .goods-price {
  position: absolute;
  top: -170rpx;
  left: 0;
  z-index: 9;
  width: 100%;
  /* height: 105rpx; */
  /* background-color: #EB702D; */
  box-sizing: border-box;
  color: #fff;
  /* display: flex; */
  /* align-items: center; */
  /* padding-left: 15rpx; */
}

.goods-info-box .goods-price text:nth-of-type(1) {
  font-weight: bold;
  font-size: 48rpx;
}

.goods-info-box .goods-price text:nth-of-type(2) {
  display: inline-block;
  margin-left: 20rpx;
  margin-bottom: -4rpx;
  font-weight: 400;
  text-decoration: line-through;
  font-size: 28rpx;
}

.goods-info-box .goods-describe {
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  padding-left: 24rpx;
}

.activity-bg-bottom {
  /* position: absolute;
  left: 0;
  top: 0; */
  width: 100%;
}

.activity-bg-top {
  position: absolute;
  left: 0;
  top: 0;
  width: 100rpx;
}

.activity-info {
  position: absolute;
  left: 24rpx;
  top: 66rpx;
}

.activity-bg-top {
  position: absolute;
  left: 48rpx;
  top: 12rpx;
  width: 40rpx;
}

.activity-bg-right {
  position: absolute;
  right: 0;
  top: 40rpx;
  width: 309rpx;
  height: 134rpx;
}

.activity-info-name {
  font-size: 22rpx;
  margin-bottom: 10rpx;
  padding-left: 10rpx;
}

checkbox .wx-checkbox-input {
  border-radius: 50%;
  width: 25rpx;
  height: 25rpx;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  border-color: #ff9f43;
  background: #ff9f43;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  border-radius: 50%;
  width: 25rpx;
  height: 25rpx;
  line-height: 25rpx;
  text-align: center;
  font-size: 20rpx;
  color: #fff;
  background: transparent;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}
</style>
