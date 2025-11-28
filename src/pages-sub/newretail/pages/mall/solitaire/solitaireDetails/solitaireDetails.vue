<template>
  <!--pages/mall/solitaire/solitaireDetails/solitaireDetails.wxml-->
  <view>
    <navigationBar
      :title="state.navigationBarTitle"
      background="transparent"
      leftClass="opacity"
      extStyle="position: fixed; z-index: 90"
    ></navigationBar>
    <view class="loading-box" v-if="!state.pageShow">
      <loading></loading>
    </view>
    <view class="page-content" v-if="state.pageShow">
      <view class="solitaire-background">
        <image
          class="background"
          v-if="state.solitaireActivity.background"
          :src="state.solitaireActivity.background"
          lazy-load="false"
          @error=""
          @load=""
        ></image>
        <image
          class="background"
          v-else
          :src="state.imagesPath.solitaireBackground"
          lazy-load="false"
          @error=""
          @load=""
        ></image>
        <view class="top-info-box">
          <view class="left-box">
            <view class="logo-box">
              <image
                class="logo"
                :src="state.imagesPath.iconLogo"
                mode="widthFix"
                lazy-load="false"
                @error=""
                @load=""
              ></image>
            </view>
            <view class="info-text" @click="toSelectStore">
              <view class="name">
                <text>
                  {{
                    state.storeInfo.name != null ? state.storeInfo.name : state.navigationBarTitle
                  }}
                </text>
                <image class="right-img" :src="state.imagesPath.iconSolitaireStoreRight"></image>
              </view>
              <text class="text">接龙人次：{{ state.solitaireJoinCount }}</text>
            </view>
          </view>
          <view class="right-button-box">
            <view class="right-button" @click="contactStore">
              <image
                :src="state.imagesPath.iconSolitaireTel"
                mode="widthFix"
                lazy-load="false"
                @error=""
                @load=""
              ></image>
            </view>
            <view class="right-button" @click="shareWechatMoments">
              <image
                :src="state.imagesPath.iconSolitaireShare2"
                mode="widthFix"
                lazy-load="false"
                @error=""
                @load=""
              ></image>
              <!-- <view class="top-tips-box">
        <view>点击这里可以分享给好友哦</view>
        <view class="bottom-triangle"></view>
      </view> -->
            </view>
            <view class="right-button">
              <button open-type="share" hover-class="none">
                <image
                  :src="state.imagesPath.iconSolitaireShare"
                  mode="widthFix"
                  lazy-load="false"
                  @error=""
                  @load=""
                ></image>
              </button>
            </view>
          </view>
        </view>
      </view>
      <view class="solitaire-activity">
        <view class="solitaire-activity-inner">
          <!-- <view class="top-triangle"></view> -->
          <view class="name">{{ state.solitaireActivity.name }}</view>
          <view class="desc">{{ state.solitaireActivity.description }}</view>
          <view class="activity-status" v-if="state.isEnd"></view>
          <view class="activity-status" v-else>{{ state.activityEndTime }}</view>
          <view class="img-box">
            <image
              v-for="(item, index) in state.imagesList"
              :key="index"
              :src="item.url"
              mode="widthFix"
            ></image>
          </view>
        </view>
        <view class="goods-box">
          <view
            class="goods-item-box"
            v-for="(item, index) in state.products"
            :key="id"
            :data-business="item.business"
            :data-productId="item.productId"
            @click="clickGoodsDetails"
          >
            <view class="goods-img">
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
            <view class="goods-info">
              <view class="left">
                <view class="goods-name">{{ item.productName }}</view>
                <view class="goods-spec"></view>
                <view class="goods-price">
                  <view class="now-price">￥{{ filtToFix(item.price) }}</view>
                  <view class="old-price" v-if="item.originalPrice !== 0">
                    ￥{{ filtToFix(item.originalPrice) }}
                  </view>
                </view>
              </view>
              <view class="right">
                <view class="num">{{ item.buyCount > 0 ? '已团' + item.buyCount : '' }}</view>
                <view
                  class="cart-control"
                  v-if="
                    item.storeStatus === 'ON' &&
                    (item.storeBalance > 0 || item.productType === 'SPEC') &&
                    item.solitaireBalance > 0
                  "
                >
                  <view v-if="item.productNum > 0">
                    <view class="reduce-box">
                      <button
                        data-type="reduce"
                        :data-productId="item.productId"
                        @click.stop="handleAddAll"
                      ></button>
                      <!-- <image class="reduce-img" src='{{imagesPath.iconMinus}}'></image> -->
                      <view class="reduce-img iconfont icon-jianhao" style="color: #fb5606"></view>
                    </view>
                    <text class="cart-count">{{ item.productNum }}</text>
                  </view>
                  <view class="add-box">
                    <button v-if="!state.hasUserInfo" @click.stop="getUserInfo"></button>
                    <button
                      v-else
                      data-type="add"
                      :data-productId="item.productId"
                      @click.stop="
                        shopCart.productNum == 0 ||
                        !shopCart.products ||
                        shopCart.products[0].productId == item.productId
                          ? 'handleAddAll'
                          : ''
                      "
                    ></button>
                    <!-- <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image> -->
                    <view
                      class="add-img iconfont icon-jiahao2fill"
                      :style="
                        'color: ' +
                        (state.shopCart.productNum == 0 ||
                        !state.shopCart.products ||
                        state.shopCart.products[0].productId == item.productId
                          ? '#EB702D;'
                          : '#ccc')
                      "
                    ></view>
                  </view>
                </view>
                <view class="sold-out" v-else>已抢光</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="button-box middle">
        <view
          @click="handleCreateSolitaire"
          :class="
            'buy-button button ' +
            (state.storeStatus === 'ON' && state.storeBalance > 0 && state.solitaireBalance > 0
              ? ''
              : 'disabled') +
            ' ' +
            (state.shopCart.products.length > 0 ? 'bottom-btn-box' : '')
          "
          :style="
            state.storeStatus === 'ON' && state.storeBalance > 0 && state.solitaireBalance > 0
              ? ''
              : ''
          "
          v-if="!state.isEnd"
        >
          <view
            class="menu"
            v-if="state.shopCart.products.length > 0"
            @click.stop="toggleShopCartPopup"
          >
            <view class="menu-icon-box">
              <image
                class="menu-icon"
                :src="state.imagesPath.solitareCar"
                mode="widthFix"
                lazy-load="false"
              ></image>
              <view class="badge">{{ state.shopCart.productNum }}</view>
            </view>
            <view class="menu-price">￥{{ filtToFix(state.shopCart.allPrice) }}</view>
          </view>
          <view class="button-text small-button" v-if="state.shopCart.products.length > 0">
            {{ state.storeStatus === 'ON' ? '我要接龙' : '门店库存不足' }}
          </view>
          <view class="button-text" v-else>
            {{ state.storeStatus === 'ON' ? '我要接龙' : '门店库存不足' }}
          </view>
        </view>
        <view class="buy-button button disabled" v-if="state.isEnd">活动已结束</view>
      </view>

      <view class="solitaire-join" v-if="state.joinList.length > 0">
        <view class="item" v-for="(item, index) in state.joinList" :key="index">
          <view class="info">
            <view class="order">{{ item.orderNumber }}</view>
            <image :src="item.avatar"></image>
            <view class="buy-info">
              <view class="buy-user">
                <text class="name">{{ item.nickName }}</text>
                <view class="time">{{ item.time }}</view>
              </view>
              <view class="buy-product">
                <view class="buy-item" v-for="(ele, index) in item.products" :key="id">
                  <view>{{ ele.productName }}</view>
                  <view>
                    <text class="num" v-if="item.status !== 'REFUND'">+{{ ele.quantity }}</text>
                    <text class="num refund" v-else>已取消接龙</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="more" v-if="state.showMore && !state.noMore" @click="loadMoreRecords">
          点击查看更多...
        </view>
      </view>
      <view style="height: 60rpx; width: 100%"></view>
      <!-- <view class="button-box" wx:if="{{state.showBottomButton || state.show.shopCart || state.show.goodsDetails}}" style="z-index:{{state.show.shopCart || state.show.goodsDetails ? '10000' : '0'}}">
    <view bindtap="handleCreateSolitaire" class="button {{state.storeStatus === 'ON' && state.storeBalance > 0 && state.solitaireBalance > 0 ? '' : 'disabled'}} {{state.shopCart.products.length > 0 ? 'bottom-btn-box' : ''}}" style="{{state.storeStatus === 'ON' && state.storeBalance > 0 && state.solitaireBalance > 0 ? '' : ''}}" wx:if="{{!state.isEnd}}">
    <view class="menu" wx:if="{{state.shopCart.products.length > 0}}" catchtap="toggleShopCartPopup">
        <view class="menu-icon-box">
        <image class="menu-icon" src="{{state.imagesPath.solitareCar}}" mode="widthFix" lazy-load="false" ></image>
        <view class="badge">{{state.shopCart.productNum}}</view>
        </view>
        <view class="menu-price">￥{{filtToFix(state.shopCart.allPrice)}}</view>
    </view>
    <view class="button-text small-button" wx:if="{{state.shopCart.products.length > 0}}">{{state.storeStatus === 'ON' ? "我要接龙" : "门店库存不足"}}</view>
    <view class="button-text" wx:else>{{state.storeStatus === 'ON' ? "我要接龙" : "门店库存不足"}}</view>
    </view>
    <view class="button disabled" wx:if="{{state.isEnd}}">活动已结束</view>
</view> -->
      <view class="share-canvas-box">
        <canvas class="share-canvas" canvas-id="shareCanvas"></canvas>
      </view>
    </view>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      @close="toggleBottomPopup"
    >
      <view class="popup-success">
        <view class="content">
          <icon type="success" size="45">
            <text class="title">接龙成功</text>
            <view class="join-people">
              <view class="info">
                <view class="order">{{ state.currentBuySolitaire.orderNumber }}.</view>
                <image :src="state.currentBuySolitaire.avatar"></image>
                <view class="buy-info">
                  <view class="buy-user">
                    <text class="name">{{ state.currentBuySolitaire.nickName }}</text>
                    <view class="time">{{ state.currentBuySolitaire.time }}</view>
                  </view>
                  <view class="buy-product">
                    <view
                      class="buy-item"
                      v-for="(ele, index) in state.currentBuySolitaire.products"
                      :key="id"
                    >
                      <view>{{ ele.productName }}</view>
                      <view>
                        <text class="num" v-if="item.status !== 'REFUND'">+{{ ele.quantity }}</text>
                        <text class="num refund" v-else>已取消接龙</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="tips">您可以将此页面转发回群聊</view>
            <view class="tips">通知大家您已接龙成功，活跃群气氛~</view>
            <button class="share" open-type="share" hover-class="none">转发到群聊</button>
          </icon>
        </view>
        <view class="close" @click="toggleBottomPopup">
          <weui-icon icon="close2" color="#ffffff" size="25"></weui-icon>
        </view>
      </view>
    </popup>
    <popup
      :show="state.show.goodsSpec"
      position="bottom"
      custom-class="bottom"
      @close="toggleGoodsSpecPopup"
    >
      <goods-spec
        :specs="state.specs"
        :specDetails="state.specDetails"
        activity-type="solitaire"
        :hasSelected="state.hasSelected"
        @close="toggleGoodsSpecPopup"
        :goodsImg="goodsImg"
        :price="state.price"
        :activity-data="state.solitaireActivity"
        :productNum="state.productNum"
        @confirm="confirmSpecs"
      ></goods-spec>
    </popup>
    <popup
      :show="state.show.shopCart"
      position="bottom"
      custom-class="bottom"
      @close="toggleShopCartPopup"
    >
      <view class="shop-cart-main">
        <view class="popup-close" @click="toggleShopCartPopup">
          <image
            class=""
            :src="state.imagesPath.iconCloseImg"
            mode="widthFix"
            lazy-load="false"
            @error=""
            @load=""
          ></image>
        </view>
        <scroll-view class="goods-main-box" scroll-y="">
          <view class="goods-item-box" v-for="(item, index) in state.shopCart.products" :key="id">
            <view class="goods-img">
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
            <view class="goods-info">
              <view class="left">
                <view class="goods-name">{{ item.productName }}</view>
                <view class="goods-spec" :style="state.theme.mainColor" v-if="item.selectSpecs">
                  {{ item.selectSpecs }}
                </view>
                <view class="goods-spec" v-else></view>
                <view class="goods-price">
                  <view class="now-price">￥{{ filtToFix(item.price) }}</view>
                  <view class="old-price" v-if="item.originalPrice !== 0">
                    ￥{{ filtToFix(item.originalPrice) }}
                  </view>
                </view>
              </view>
              <view class="right">
                <view
                  class="cart-control"
                  v-if="
                    item.storeStatus === 'ON' && item.storeBalance > 0 && item.solitaireBalance > 0
                  "
                >
                  <view v-if="item.productNum > 0">
                    <view class="reduce-box">
                      <button
                        data-type="reduce"
                        :data-productId="item.productId"
                        @click.stop="handleAdd"
                      ></button>
                      <!-- <image class="reduce-img" src='{{imagesPath.iconMinus}}'></image> -->
                      <view class="reduce-img iconfont icon-jianhao" style="color: #eb702d"></view>
                    </view>
                    <text class="cart-count">{{ item.productNum }}</text>
                  </view>
                  <view class="add-box">
                    <button v-if="!state.hasUserInfo" @click.stop="getUserInfo"></button>
                    <button
                      v-else
                      data-type="add"
                      :data-productId="item.productId"
                      @click.stop="handleAdd"
                    ></button>
                    <!-- <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image> -->
                    <view class="add-img iconfont icon-jiahao2fill" style="color: #eb702d"></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </popup>
    <popup
      :show="state.show.goodsDetails"
      position="bottom"
      custom-class="bottom"
      @close="toggleGoodsDetailsPopup"
    >
      <view class="goods-details-main">
        <view class="popup-close" @click="toggleGoodsDetailsPopup">
          <image
            class=""
            :src="state.imagesPath.iconCloseImg"
            mode="widthFix"
            lazy-load="false"
            @error=""
            @load=""
          ></image>
        </view>
        <view
          class="goods-item-box"
          v-for="(item, index) in state.products"
          :key="id"
          v-if="item.productId === state.showProductId"
        >
          <view class="goods-img">
            <image :src="item.imageUrl" mode="widthFix"></image>
          </view>
          <view class="goods-info">
            <view class="left">
              <view class="goods-name">{{ item.productName }}</view>
              <!-- <view class="goods-spec" style="{{theme.mainColor}}" wx:if="{{item.selectSpecs !== ''}}" bindtap="toggleGoodsSpecPopup">{{item.selectSpecs}}</view> -->
              <view class="goods-spec"></view>
              <view class="goods-price">
                <view class="now-price">￥{{ filtToFix(item.price) }}</view>
                <view class="old-price" v-if="item.originalPrice !== 0">
                  ￥{{ filtToFix(item.originalPrice) }}
                </view>
              </view>
            </view>
            <view class="right">
              <view
                class="cart-control"
                v-if="
                  item.storeStatus === 'ON' && item.storeBalance > 0 && item.solitaireBalance > 0
                "
              >
                <view v-if="item.productNum > 0">
                  <view class="reduce-box">
                    <button
                      data-type="reduce"
                      :data-productId="item.productId"
                      @click.stop="handleAddAll"
                    ></button>
                    <!-- <image class="reduce-img" src='{{imagesPath.iconMinus}}'></image> -->
                    <view class="reduce-img iconfont icon-jianhao" style="color: #fb5606"></view>
                  </view>
                  <text class="cart-count">{{ item.productNum }}</text>
                </view>
                <view class="add-box">
                  <button v-if="!state.hasUserInfo" @click.stop="getUserInfo"></button>
                  <button
                    v-else
                    data-type="add"
                    :data-productId="item.productId"
                    @click.stop="
                      shopCart.productNum == 0 ||
                      !shopCart.products ||
                      shopCart.products[0].productId == item.productId
                        ? 'handleAddAll'
                        : ''
                    "
                  ></button>
                  <!-- <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image> -->
                  <view
                    class="add-img iconfont icon-jiahao2fill"
                    :style="
                      'color: ' +
                      (state.shopCart.productNum == 0 ||
                      !state.shopCart.products ||
                      state.shopCart.products[0].productId == item.productId
                        ? '#EB702D;'
                        : '#ccc')
                    "
                  ></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <scroll-view class="goods-imgtext" scroll-y="">
          <view v-if="state.productDetails.length > 0">
            <view v-for="(item, index) in state.productDetails" :key="index">
              <image
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
          </view>
          <view v-else>
            <image
              v-for="(item, index) in state.products"
              v-if="item.productId === state.showProductId"
              :key="id"
              :src="item.imageUrl"
              mode="widthFix"
            ></image>
          </view>
        </scroll-view>
      </view>
    </popup>
    <view
      class="poster-box"
      v-if="state.showPoster"
      @click="handlePosterCancel"
      @touchmove.stop="preventTouchMove"
    >
      <view class="poster-box-main">
        <view class="poster-picture-box">
          <canvas canvas-id="pictureQRCanvas" style="display: block"></canvas>
        </view>
        <button
          @click.stop="handleSaveToImg"
          class="saveImage"
          :style="'background: ' + themeColor"
        >
          保存图片到相册
        </button>
        <text class="saveImageTips">分享海报时可到相册选取图片</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import _apiRequestJs2 from '@/service/api/newretail/request'
// import { wxml, style, setTitle } from './shareImage'
import _apiRequestJs from '@/service/api/newretail/request'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiSolitaireServiceJs from '@/service/api/newretail/solitaireService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import goodsSpec from '@/pages-sub/newretail/components/product/goods-spec/goods-spec.vue'
import loading from '@/pages-sub/newretail/components/loading/loading.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
const app = getApp()

// pages/mall/solitaire/solitaireDetails/solitaireDetails.js
const solitaireService = _apiSolitaireServiceJs
const storeService = _apiStoreServiceJs
const wxaUserService = _apiWxaUserServiceJs
const productService = _apiProductServiceJs
const IMAGESPATH = _utilsImagesPathJs
const THEME = _utilsThemeManagerJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const util = _utilsUtilsJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const request = _apiRequestJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
// 获取应用实例
let isInCheckProduct = false
const state = reactive({
  navigationBarTitle: ' ',
  pageShow: false,
  imagesPath: IMAGESPATH,
  theme: THEME,
  productNum: 0,
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  show: {
    middle: false,
    goodsSpec: false,
    shopCart: false,
    goodsDetails: false,
  },
  solitaireActivity: {},
  imagesList: [],
  pdtDetails: {},
  selectSpecs: '',
  products: [],
  price: 0,
  page: 1,
  pageCount: 1,
  joinList: [],
  noMore: false,
  loading: false,
  currentBuySolitaire: {},
  specs: [],
  specDetails: [],
  hasSelected: false,
  productId: '',
  productName: '',
  shareImage: '',
  storeStatus: '',
  showMore: false,
  showEndTime: '',
  isEnd: false,
  storeBalance: 0,
  solitaireBalance: 0,
  activityEndTime: '',
  showBottomButton: true,
  shopCart: {
    allPrice: 0,
    products: [],
    productNum: 0,
  },
  storeId: '',
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  productDetails: [],
  showProductId: '',
  solitaireJoinCount: 0,
  storeInfo: {},
  showPoster: false,
})
const customData = {
  solitaireId: '',
  timeId: 0,
  from: null,
  storeId: '',
}
function renderToCanvas() {
  const that = this
  // const p1 = widget.renderToCanvas({
  //   wxml,
  //   style,
  // })
  // p1.then((res) => {
  //   console.log('renderToCanvas', res)
  //   container = res
  //   extraImage()
  // }).catch((err) => {
  //   console.log(err)
  // })
}
function extraImage() {
  const p2 = widget.canvasToTempFilePath()
  p2.then((res) => {
    uploadTempFile(res)
  }).catch((err) => {
    console.log(err)
  })
}
function uploadTempFile(res) {
  const that = this
  const request = _apiRequestJs2
  console.log('上传图片')
  console.log(request.TENANT)
  console.log(request.BASE_URL + '/newretail/api/dfs/upload')
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    filePath: res.tempFilePath,
    name: 'file',
    formData: {
      user: 'test',
    },
    header: {
      'wxa-appid': request.APP_ID,
    },
    success(res) {
      if (res && res.data != null && res.statusCode >= 200 && res.statusCode <= 300) {
        state.shareImage = JSON.parse(res.data).data.url
      }
    },
    fail(e) {
      console.log('=============')
      console.log(e)
    },
  })
}
onLoad(async function (options) {
  // this.widget = this.selectComponent('.widget')
  const self = this
  solitaireChildrenProduct = []
  let solitaireId = ''
  if (options.id && options.id != null) {
    solitaireId = options.id
    customData.solitaireId = solitaireId
  }
  if (app.globalData.navigationBarTitleText) {
    state.navigationBarTitle = app.globalData.navigationBarTitleText
  }
  if (options.storeId) {
    // 根据缓存的上一次获取门店列表的时间查询增量门店信息
    await storeService
      .queryList()
      .then((res) => {
        res.some((item) => {
          if (item.virtualStoreId === options.storeId) {
            app.globalData.storeInfo = item
            state.storeName = item.name
            state.storeId = item.virtualStoreId || item.id
            state.storeInfo = item
            getSolitaireDetails(solitaireId)
          }
          return item.virtualStoreId === options.storeId
        })
      })
      .catch((err) => {})
  } else {
    // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
    if (app.globalData.storeInfo && app.globalData.storeId === '') {
      state.storeName = app.globalData.storeInfo.name
      state.storeId = app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id
      state.storeInfo = app.globalData.storeInfo
      state.theme = {
        color:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? app.globalData.uiconfig.themeColor
            : uni.getStorageSync('themeColor') || '#FF9F43',
        mainColor:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
            : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
        mainBgColor:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
            : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
        borderColor:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
            : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
        mainBgGradient:
          app.globalData.uiconfig &&
          app.globalData.uiconfig.themeColor != null &&
          app.globalData.uiconfig.themeColor !== '#FF9F43'
            ? 'background: linear-gradient(-270deg, ' +
              app.globalData.uiconfig.themeColor +
              ', ' +
              app.globalData.uiconfig.themeColor +
              ');'
            : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
        mainColorRgb:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
            : 'color:rgba(255,159,67, 0.4);',
        borderColorRgb:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
            : 'border-color:rgba(255,159,67, 0.4);',
        mainColorRgb02:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
            : 'rgba(255,159,67, 0.2)',
        BgColorRgb01:
          app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
            ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
            : 'background-color:rgba(255,159,67, 0.1);',
      }
      getSolitaireDetails(solitaireId)
    } else {
      // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
      ADDRESS.getLocation().then((res) => {
        app.globalData.storeInfo = res
        state.storeName = res.name
        state.storeId = res.virtualStoreId || res.id
        state.storeInfo = res
        getSolitaireDetails(solitaireId)
      })
    }
  }
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    if (scene.indexOf('gmparam=') >= 0) {
      const sceneArr = scene.split('gmparam=')
      const sceneId = sceneArr[1]
      if (sceneId != null) {
        getSceneById(sceneId)
      }
    } else if (scene !== 'isfromQR') {
      // 设置分享信息
      setSharePeopleInfo(options, 'group')
    }
  } else {
    // 设置分享信息
    setSharePeopleInfo(options, 'solitaire')
  }
})
onReady(function () {})
onShow(function () {
  checkUserInfo()
  const self = this
  let isBuyBack = false
  try {
    const solitaireId = uni.getStorageSync('wj_solitaire_' + customData.solitaireId)
    if (solitaireId) {
      uni.removeStorageSync('wj_solitaire_' + customData.solitaireId)
      // 查询当前用户最新的记录，弹出弹窗
      getUserSolitaireRecords()
      isBuyBack = true
      getSolitaireDetails(customData.solitaireId)
    }
  } catch (error) {
    console.log(error)
  }
  if (state.storeId !== '' && customData.solitaireId !== '' && state.pageShow) {
    if (!isBuyBack) {
      getRecordsById(1)
      if (
        app.globalData.storeInfo &&
        (state.storeId !== app.globalData.storeInfo.id ||
          state.storeInfo.virtualStoreId !== app.globalData.storeInfo.virtualStoreId)
      ) {
        checkSolitaireActivity()
      } else {
        getSolitaireDetails(customData.solitaireId)
      }
    }
  }
})
function checkSolitaireActivity() {
  const self = this
  const solitaireId = customData.solitaireId
  const postData = {
    page: 1,
    pageSize: 10,
    searchCount: true,
    status: 'STARTED',
    storeId: app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id,
    id: solitaireId,
  }
  solitaireService
    .query(postData)
    .then((res) => {
      if (res.records && res.records.length > 0) {
        state.storeName = app.globalData.storeInfo.name
        state.storeId = app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id
        state.storeInfo = app.globalData.storeInfo
        getSolitaireDetails(solitaireId)
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '当前选择的门店没有接龙活动',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              app.globalData.storeInfo = state.storeInfo
            }
          },
          fail: () => {},
          complete: () => {},
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
onHide(function () {
  clearTimeout(customData.timeId)
})
onUnload(function () {
  clearTimeout(customData.timeId)
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  // this.renderToCanvas()
  const that = this
  let title = '邀请您参与接龙~'
  if (state.joinList && state.joinList.length > 0) {
    title = solitaireActivity.name
  } else {
    if (app.globalData.userInfo) {
      title = app.globalData.userInfo.wxaUser.nickName + title
    }
  }
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options
  const url = currentPage.route // 当前页面url
  let path = url + '?storeId=' + state.storeId
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const ele = options[key]
      if (key !== 'mobile' && key != 'storeId') {
        path = path + '&' + key + '=' + ele
      }
    }
  }
  return {
    title,
    imageUrl: state.shareImage,
    path,
  }
})
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    state.userInfo = app.globalData.userInfo.wxaUser
    if (app.globalData.userInfo.member) {
      state.isMember = true
      state.member = app.globalData.userInfo.member
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      state.userInfo = res.wxaUser
      if (res.member) {
        state.isMember = true
        state.member = res.member
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
function toggleBottomPopup() {
  toggle('middle')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function toggleShopCartPopup() {
  if (state.show.goodsDetails) {
    toggle('goodsDetails')
  }
  toggle('shopCart')
}
function toggleGoodsDetailsPopup() {
  toggle('goodsDetails')
}
function setSharePeopleInfo(options, type) {
  const shareData = {
    shareId: null,
    type,
    productId: '',
  }
  if (options.scene) {
    const scene = decodeURIComponent(options.scene)
    if (scene !== 'isfromQR') {
      shareData.shareId = scene
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis()
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    shareData.shareId = options.shareId
  }
  if (shareData.shareId) {
    if (app.globalData.isShoppingGuidanceRecordGoods) {
      util.setSharingPersonInfo(shareData)
    } else {
      try {
        uni.setStorageSync('wj_sharingId', shareData.shareId)
      } catch (e) {}
    }
  }
}
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
      const _options = urlToObj(res)
      options = _options
      if (_options.storeId != null && _options.storeId !== '') {
        // 页面路径包含分享出的门店id信息
        const storeId = parseInt(_options.storeId)
        // 判断storeId是否全部是数字
        const reg = /^\d+$/ // 正则校验表达式，判断是否为纯数字
        // 如果是纯数字，说明是门店id，保存门店id，获取缓存门店如果有门店数据，将该门店设为默认门店
        if (reg.test(storeId)) {
          app.globalData.storeId = JSON.stringify(storeId)
          app.globalData.shareStoreId = JSON.stringify(storeId)
        }
        console.log('分享门店：', JSON.stringify(storeId))
      }
      onLoad(_options)
      // 设置分享信息
      setSharePeopleInfo(_options, 'solitaire')
      if (_options.shareId != null && _options.shareId !== '') {
        // 分享信息打开统计
        ANALYSIS.ShareOpenAnalysis()
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function getSolitaireDetails(id) {
  if (id === '' || id == null) {
    return
  }
  const self = this
  let storeId = state.storeId
  let isDistribution = false
  solitaireService
    .getById(id, storeId)
    .then((res) => {
      if (res) {
        if (res.endTime) {
          const now = new util.ResponseDate().getTime()
          const endTimeStamp = new Date(res.endTime.replace(/-/g, '/')).getTime()
          if (now >= endTimeStamp) {
            // 活动已结束
            state.isEnd = true
          }
          const activityEndTime =
            '将于' + timeToMonthDay(res.endTime) + ' ' + timeDivision(res.endTime) + '结束'
          state.activityEndTime = activityEndTime
          function timeToMonthDay(time) {
            const timeArray = time.split(' ')
            const timeList = timeArray[0].split('-')
            const newTime = timeList[1] + '月' + timeList[2] + '日'
            return newTime
          }
          function timeDivision(time) {
            const timeArray = time.split(' ')
            const timeSlot = timeArray[1].slice(0, 5)
            return timeSlot
          }
        }
        for (let i = 0; i < res.products.length; i++) {
          const ele = res.products[i]
          if (ele.business === 'DISTRIBUTION') {
            isDistribution = true
            break
          }
        }
        solitaireActivity = res
        // 查询参与者
        getRecordsById(1)
        if (isDistribution) {
          if (app.globalData.distributionStore) {
            return app.globalData.distributionStore
          } else {
            return storeService.getDistributionStore()
          }
        } else {
          return res
        }
      }
    })
    .then((res) => {
      if (isDistribution) {
        if (res) {
          storeId = res.id
          state.distributionStoreId = storeId
          return solitaireService.getById(id, storeId)
        }
      } else {
        return res
      }
    })
    .then((res) => {
      res = res || {}
      if (res.products) {
        solitaireActivity.products.forEach((item) => {
          for (let i = 0; i < res.products.length; i++) {
            const ele = res.products[i]
            if (item.productId === ele.productId && ele.business === 'DISTRIBUTION') {
              item.balance = ele.balance
              item.storeBalance = ele.storeBalance
              item.storeStatus = ele.storeStatus
              break
            }
          }
        })
      }
      return solitaireActivity
    })
    .then((res) => {
      handleShareImage(res.name, res.images[0].url)
      res = {
        ...res,
        productType: res.products[0].productType,
      }
      // 处理接龙商品
      const products = []
      let storeStatus = 'OFF'
      let storeBalance = 0
      let solitaireBalance = 0
      res.products.forEach((ele) => {
        let originalPrice = 0
        if (ele.price < ele.storePrice) {
          originalPrice = parseFloat(ele.storePrice)
        }
        if (ele.storeStatus === 'ON') {
          storeStatus = ele.storeStatus
        }
        storeBalance = storeBalance + ele.storeBalance
        solitaireBalance = solitaireBalance + ele.balance
        const tempData = {
          ...ele,
          originalPrice,
          selectSpecs: '',
          solitaireBalance: ele.balance,
          storeBalance: ele.storeBalance ? ele.storeBalance : 0,
          productNum: 0,
        }
        products.push(tempData)
      })
      const newTempList = productsSort(products)
      state.solitaireActivity = res
      state.solitaireBalance = solitaireBalance
      state.imagesList = res.images
      state.products = newTempList
      state.storeBalance = storeBalance
      state.storeStatus = storeStatus
      state.pageShow = true
    })
    .catch((err) => {
      state.pageShow = true
      util.showToast(err.message)
    })
}
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    if (ele.productType !== 'SPEC' && (ele.storeBalance <= 0 || ele.solitaireBalance <= 0)) {
      balanceArray.push(ele)
    } else {
      allArray.push(ele)
    }
  })
  const tempArray = allArray.concat(balanceArray)
  return tempArray
}
function loadMoreRecords() {
  const self = this
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    let page = state.page
    ++page
    getRecordsById(page)
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.joinList.length > 0) {
      state.noMore = true
    }
  }
}
function getUserSolitaireRecords() {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const opts = {
      solitaireId: customData.solitaireId,
      memberId: app.globalData.userInfo.member.id,
    }
    if (state.solitaireActivity.type === 'STORE') {
      opts.storeId = state.storeId
    }
    solitaireService
      .getRecordsById(1, 10, opts)
      .then((res) => {
        if (res.records && res.records.length > 0) {
          state.currentBuySolitaire = res.records[0]
          toggleBottomPopup()
        }
      })
      .catch((err) => {
        util.showToast(err.message)
      })
  }
}
function getRecordsById(page) {
  const self = this
  const opts = {
    solitaireId: customData.solitaireId,
  }
  console.log(state.solitaireActivity)
  if (state.solitaireActivity.type === 'STORE') {
    opts.storeId = state.storeId
    console.log(opts)
  }
  solitaireService
    .getRecordsById(page, 10, opts)
    .then((res) => {
      if (res.records && res.records.length > 0) {
        let joinList = state.joinList
        if (page === 1) {
          joinList = []
        }
        const tempJoinList = []
        res.records.forEach((item) => {
          const len = item.nickName.length - 1
          let nickName = item.nickName.slice(0, 1)
          for (let i = 0; i < len; i++) {
            nickName = nickName + '*'
          }
          tempJoinList.push({
            ...item,
            nickName,
          })
        })
        joinList = joinList.concat(tempJoinList)
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        state.joinList = joinList
        state.page = res.page
        state.pageCount = pageCount
        state.solitaireJoinCount = res.recordCount
        state.showMore = res.recordCount > 10
        const timeList = []
        joinList.forEach((item) => {
          timeList.push({
            id: item.id,
            time: item.createTime,
          })
        })
        handleRecordsTime(timeList)
      }
      if (res.pageCount === page) {
        state.noMore = true
      }
      if (page === 1) {
        handleShareImage(solitaireActivity.name, solitaireActivity.images[0].url)
      }
    })
    .catch((err) => {
      if (page === 1) {
        handleShareImage(solitaireActivity.name, solitaireActivity.images[0].url)
      }
      util.showToast(err.message)
    })
}
function handleRecordsTime(timeList) {
  const self = this
  timeLoop()
  function timeLoop() {
    clearTimeout(customData.timeId)
    const timeId = setTimeout(() => {
      const time = util.timePassed(timeList, false)
      for (let j = 0; j < time.length; j++) {
        const item = time[j]
        let showTime = ''
        if (item.day !== '00' && item.day !== 0) {
          showTime = item.day + '天前'
        } else if (item.hou !== '00' && item.hou !== 0) {
          showTime = item.hou + '小时前'
        } else if (item.min !== '00' && item.min !== 0) {
          showTime = item.min + '分钟前'
        } else if (item.sec !== '00' && item.sec !== 0) {
          showTime = item.sec + '秒前'
        }
        for (let i = 0; i < state.joinList.length; i++) {
          const ele = state.joinList[i]
          if (item.id === ele.id) {
            state.joinList[i].time = showTime
            break
          }
        }
      }
      state.joinList = state.joinList
      timeLoop()
    }, 1000)
    customData.timeId = timeId
  }
}
function handleAddAll(e) {
  const self = this
  const type = e.currentTarget.dataset.type
  const productId = e.currentTarget.dataset.productid
  let index = null
  let currentItem = null
  const products = state.products
  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    if (item.productId === productId) {
      index = i
      currentItem = item
      break
    }
  }
  if (currentItem.productType === 'SPEC') {
    // 多规格商品弹出弹窗
    // if (currentItem.productNum > 0) {
    // } else {
    // }
    if (type === 'add') {
      openGoodsSpecs(e)
    } else {
      toggleShopCartPopup()
    }
    if (state.show.goodsDetails) {
      state.show.goodsDetails = false
    }
  } else {
    handleAdd(e)
  }
}
function handleAdd(e) {
  if (isInCheckProduct) {
    console.log('在检查是否可以加入购物车')
    return
  }
  isInCheckProduct = true
  const self = this
  const type = e.currentTarget.dataset.type
  const productId = e.currentTarget.dataset.productid
  let index = null
  let currentItem = null
  const products = state.products
  for (let i = 0; i < products.length; i++) {
    const item = products[i]
    if (item.productId === productId) {
      index = i
      currentItem = item
      break
    }
  }
  // 如果活动商品中没有该商品，可能是多规格商品
  if (!currentItem) {
    const goodsList = state.shopCart.products
    for (let i = 0; i < goodsList.length; i++) {
      const item = goodsList[i]
      if (item.productId === productId) {
        index = i
        currentItem = item
        for (let j = 0; j < products.length; j++) {
          const ele = products[j]
          if (ele.productId === currentItem.parentProductId) {
            index = j
            break
          }
        }
        break
      }
    }
  }
  let productNum = currentItem.productNum
  if (type === 'add') {
    if (currentItem.productType === 'SPEC') {
      if (productNum >= currentItem.storeBalance || productNum >= currentItem.solitaireBalance) {
        console.log(currentItem)
        let text = '当前规格门店仅剩' + currentItem.storeBalance + '件~'
        if (currentItem.memberLimit > 0 && currentItem.memberLimit <= productNum) {
          text = '已达最大限购数量'
        } else {
          if (currentItem.storeBalance > currentItem.solitaireBalance) {
            if (productNum >= currentItem.storeBalance) {
              // 提示门店库存不足
            } else if (
              productNum >= currentItem.solitaireBalance &&
              productNum < currentItem.storeBalance
            ) {
              // 提示活动库存不足
              text = '当前规格活动仅剩' + currentItem.solitaireBalance + '件~'
            }
          } else {
            // 活动库存比门店库存大
            // 提示门店库存不足
          }
        }
        isInCheckProduct = false
        util.showToast(text)
      } else {
        if (currentItem.memberLimit > 0 && currentItem.memberLimit <= productNum) {
          isInCheckProduct = false
          util.showToast('已达最大限购数量')
        } else {
          productNum++
          if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
            isInCheckProduct = false
            NAVPAGE.toAuthorize()
            return
          }
          const memberId = app.globalData.userInfo.member.id
          const postData = {
            memberId,
            productId,
            quantity: productNum,
            solitaireId: customData.solitaireId,
          }
          solitaireService
            .checkProduct(postData)
            .then((res) => {
              isInCheckProduct = false
              if (res) {
                addShopCart(productId, 1)
                state[`products[${index}].productNum`] = productNum
              } else {
                util.showToast('已达购买上限')
              }
            })
            .catch((err) => {
              isInCheckProduct = false
              util.showToast(err.message)
            })
        }
      }
    } else {
      if (productNum >= currentItem.storeBalance || productNum >= currentItem.solitaireBalance) {
        console.log(currentItem)
        let text = '当前规格门店仅剩' + currentItem.storeBalance + '件~'
        if (currentItem.memberLimit > 0 && currentItem.memberLimit <= productNum) {
          text = '已达最大限购数量'
        } else {
          if (currentItem.storeBalance > currentItem.solitaireBalance) {
            if (productNum >= currentItem.storeBalance) {
              // 提示门店库存不足
            } else if (
              productNum >= currentItem.solitaireBalance &&
              productNum < currentItem.storeBalance
            ) {
              // 提示活动库存不足
              text = '当前规格活动仅剩' + currentItem.solitaireBalance + '件~'
            }
          } else {
            // 活动库存比门店库存大
            // 提示门店库存不足
          }
        }
        isInCheckProduct = false
        util.showToast(text)
      } else {
        if (currentItem.memberLimit > 0 && currentItem.memberLimit <= productNum) {
          isInCheckProduct = false
          util.showToast('已达最大限购数量')
        } else {
          productNum++
          if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
            isInCheckProduct = false
            NAVPAGE.toAuthorize()
            return
          }
          const memberId = app.globalData.userInfo.member.id
          const postData = {
            memberId,
            productId,
            quantity: productNum,
            solitaireId: customData.solitaireId,
          }
          solitaireService
            .checkProduct(postData)
            .then((res) => {
              isInCheckProduct = false
              if (res) {
                addShopCart(productId, 1)
                state[`products[${index}].productNum`] = productNum
              } else {
                util.showToast('已达购买上限')
              }
            })
            .catch((err) => {
              isInCheckProduct = false
              util.showToast(err.message)
            })
        }
      }
    }
  } else {
    isInCheckProduct = false
    if (productNum > 0) {
      productNum--
      removeShopCart(productId, -1)
      state[`products[${index}].productNum`] = productNum
      if (productNum === 0) {
        state[`products[${index}].selectSpecs`] = ''
      }
    }
  }
}
function checkProductStoreStatus() {
  const that = this
  let isCheck = true
  const productNameArr = []
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.storeStatus !== 'ON') {
      isCheck = false
      break
    }
  }
  if (!isCheck) {
    products.forEach((ele) => {
      if (ele.storeStatus !== 'ON') {
        productNameArr.push(ele.productName)
      }
    })
    const productName = productNameArr.join(',')
    util.showToast('商品' + productName + '门店未上架~')
  }
  return isCheck
}
function checkShopCart() {
  const that = this
  let isCheck = true
  const products = state.shopCart.products
  if (products.length > 0) {
    isCheck = true
  } else {
    isCheck = false
  }
  return isCheck
}
function handleCreateSolitaire() {
  const self = this
  if (!checkShopCart()) {
    util.showToast('请先选择商品~')
    return
  }
  if (!checkProductStoreStatus()) {
    return
  }
  if (
    !state.storeInfo ||
    (state.storeInfo.shipmentTypes && state.storeInfo.shipmentTypes.indexOf('SELF') == -1)
  ) {
    util.showToast('当前门店不支持自提，请重新选择门店进行接龙~')
    return
  }
  try {
    const shopCartData = state.shopCart
    const productNum = state.shopCart.productNum
    const tempList = []
    shopCartData.products.forEach((item) => {
      const tempItem = {
        ...item,
        sellPrice: parseFloat(item.price).toFixed(2),
        name: item.productName,
      }
      tempList.push(tempItem)
    })
    const shopCart = {
      allPrice: parseFloat(shopCartData.allPrice).toFixed(2),
      goodsList: tempList,
      orderType: 'solitaire',
      storeId: state.storeId,
      scource: 'BUYNOW',
      solitaireId: customData.solitaireId,
      solitaireType: state.solitaireActivity.type,
      solitaireInfo: {
        endTime: state.solitaireActivity.endTime,
        orderSelfScope: state.solitaireActivity.orderSelfScope,
        selfStartTime: state.solitaireActivity.selfStartTime,
        selfEndTime: state.solitaireActivity.selfEndTime,
        memberLimit: state.solitaireActivity.memberLimit,
        selfAfterDay: state.solitaireActivity.selfAfterDay,
      },
    }
    uni.setStorageSync('wj_shopcart', shopCart)
    NAVPAGE.toPerfectOrder()
    setTimeout(() => {
      state.show.shopCart = false
      state.show.goodsDetails = false
      clearShopCart()
    }, 200)
  } catch (error) {
    console.log(error)
  }
}
function toggleGoodsSpecPopup() {
  toggle('goodsSpec')
}
function getActivityGoodsSpec(activityId, productId, storeId, type) {
  const self = this
  if (type === 'solitaire') {
    solitaireService
      .getChildrenProduct(activityId, productId)
      .then((res) => {
        solitaireChildrenProduct = res[productId]
        return solitaireService.getSpecDetails(activityId, productId, storeId)
      })
      .then((res) => {
        handleSpecData(res, productId)
      })
      .catch((err) => {
        console.log('查询商品规格：' + err.message)
      })
  }
}
function handleSpecData(res, productId) {
  const self = this
  if (res) {
    const specDetails = JSON.parse(res.specDetailsJson)
    console.log(specDetails)
    state.specs = res.specs
    state.specDetails = specDetails
    const currentProduct = getProductItemById(productId)
    state.goodsImg = currentProduct.imageUrl
    toggleGoodsSpecPopup()
  }
}
function openGoodsSpecs(e) {
  const self = this
  const productId = e.currentTarget.dataset.productid
  const currentItem = getProductItemById(productId)
  const solitaireId = customData.solitaireId
  const storeId = state.distributionStoreId !== '' ? state.distributionStoreId : state.storeId
  if (currentItem.productType === 'SPEC') {
    getActivityGoodsSpec(solitaireId, productId, storeId, 'solitaire')
  }
}
function confirmSpecs(e) {
  const self = this
  if (!(e.detail.status && e.detail.status === 'ON')) {
    util.showToast('商品门店未上架~')
    return
  }
  // 关闭弹窗
  toggleGoodsSpecPopup()
  specs = e.detail
  let currentChildrenProduct = null
  if (solitaireChildrenProduct.length > 0) {
    solitaireChildrenProduct.forEach((it) => {
      if (it.productId === e.detail.productId) {
        currentChildrenProduct = it
      }
    })
  }
  let productNum = e && e.detail ? e.detail.productNum : 1
  if (currentChildrenProduct.memberLimit > 0 && currentChildrenProduct.memberLimit < productNum) {
    util.showToast('接龙活动最大限购' + currentChildrenProduct.memberLimit + '件~')
    return
  }
  const productId = e.detail.productId
  const parentProductId = currentChildrenProduct.parentProductId
  const currentItem = getProductItemById(parentProductId)
  const currentProduct = JSON.parse(JSON.stringify(currentItem))
  currentProduct.productNum = productNum
  currentProduct.productName = currentChildrenProduct.name
  currentProduct.price = parseFloat(currentChildrenProduct.price)
  currentProduct.selectSpecs = e.detail.selectText
  currentProduct.solitaireBalance =
    e.detail.solitaireBalance != null && e.detail.solitaireBalance >= 0
      ? e.detail.solitaireBalance
      : 0
  currentProduct.parentProductId = parentProductId
  currentProduct.productId = e.detail.productId
  currentProduct.memberLimit = currentChildrenProduct.memberLimit
  currentProduct.stock = currentChildrenProduct.stock
  currentProduct.balance = currentChildrenProduct.balance
  currentProduct.storeBalance = e.detail.balance

  /* 处理加入购物车逻辑 */
  const products = state.shopCart.products
  // 检查购物车中是否有商品
  let isHas = false
  let index = null
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      isHas = true
      break
    }
  }
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    NAVPAGE.toAuthorize()
    return
  }
  const memberId = app.globalData.userInfo.member.id
  const postData = {
    memberId,
    productId,
    quantity: productNum,
    solitaireId: customData.solitaireId,
  }
  if (isHas) {
    productNum = products[index].productNum
    postData.productNum = productNum
    // 检查是否可以加入购物车
    if (checkCanAddShopCart(currentProduct, productNum)) {
      // 更新购物车
      solitaireService
        .checkProduct(postData)
        .then((res) => {
          if (res) {
            upadeShopCart(productId, 1)
          } else {
            util.showToast('已达购买上限')
          }
        })
        .catch((err) => {
          util.showToast(err.message)
        })
    }
  } else {
    // 加入购物车
    postData.productNum = productNum || 1
    solitaireService
      .checkProduct(postData)
      .then((res) => {
        if (res) {
          products.push({
            ...currentProduct,
            productNum: productNum || 1,
          })
          handleSyncShopCart(products)
        } else {
          util.showToast('已达购买上限')
        }
      })
      .catch((err) => {
        util.showToast(err.message)
      })
  }
}
function checkCanAddShopCart(currentProduct, productNum) {
  let isCheck = false
  if (productNum >= currentProduct.storeBalance || productNum >= currentProduct.solitaireBalance) {
    let text = '当前规格门店仅剩' + currentProduct.storeBalance + '件~'
    if (currentProduct.memberLimit > 0 && currentProduct.memberLimit <= productNum) {
      text = '已达最大限购数量'
    } else {
      if (currentProduct.storeBalance > currentProduct.solitaireBalance) {
        if (productNum >= currentProduct.storeBalance) {
          // 提示门店库存不足
        } else if (
          productNum >= currentProduct.solitaireBalance &&
          productNum < currentProduct.storeBalance
        ) {
          // 提示活动库存不足
          text = '当前规格活动仅剩' + currentProduct.solitaireBalance + '件~'
        }
      } else {
        // 活动库存比门店库存大
        // 提示门店库存不足
      }
    }
    util.showToast(text)
  } else {
    if (currentProduct.memberLimit > 0 && currentProduct.memberLimit <= productNum) {
      util.showToast('已达最大限购数量')
    } else {
      isCheck = true
    }
  }
  return isCheck
}
function handleShareImage(shareImageTitle, shareImageUrl) {
  const that = this
  const systemInfo = app.globalData.systemInfo
  const rate = systemInfo.screenWidth / 750
  const version = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  }.SDKVersion
  let support = false // 版本号是否是1.9.0 以上
  if (util.compareVersion(version, '1.9.0 ') >= 0) {
    support = true
  } else {
    support = false
  }
  let picture = shareImageUrl.replace('http://', 'https://')
  // 获取到id为‘shareCanvas’的canvas
  const ctx = uni.createCanvasContext('shareCanvas')
  // 绘制背景
  ctx.setFillStyle('white')
  ctx.fillRect(0, 0, 500, 400)
  // 绘制上部分商品图片
  ctx.setTextAlign('left')
  // 左侧拼团人数、价格、销售数量信息
  ctx.setFillStyle('#111111')
  ctx.font = 'normal 32px sans-serif'
  if (state.joinList.length > 0) {
    shareImageTitle = solitaireActivity.description
  }
  util.dealWords({
    ctx,
    // 画布上下文
    fontSize: 24,
    // 字体大小
    lineHeigh: 32,
    // 字体行高
    word: shareImageTitle,
    // 需要处理的文字
    maxWidth: 480,
    // 一行文字最大宽度
    x: 0,
    // 文字在x轴要显示的位置
    y: 5,
    // 文字在y轴要显示的位置
    maxLine: 1, // 文字最多显示的行数
  })
  if (state.joinList.length > 0) {
    drawButton()
  }
  const joinList = []
  for (let i = 0; i < state.joinList.length; i++) {
    const item = state.joinList[i]
    if (i < 4) {
      const avatar = item.avatar.replace('http://', 'https://')
      const INFO = util
        .getImageInfo(avatar)
        .then((res) => {
          console.log(res)
          return {
            ...item,
            avatarInfo: res,
          }
        })
        .catch((err) => {
          console.log(err)
          return null
        })
      if (INFO) {
        joinList.push(INFO)
      }
    } else {
      break
    }
  }
  Promise.all(joinList)
    .then((res) => {
      console.log(res)
      if (res.length > 0) {
        res = timeLoop(res)
        console.log(res)
        ctx.rect(0, 64, 500, 288)
        ctx.clip()
        res.forEach((ele, i) => {
          // 起始位置是 36 ，结束位置是 316
          // 每一行的高度是56
          ctx.setFillStyle('#38373a')
          ctx.font = 'normal 28px sans-serif'
          ctx.setTextAlign('left')
          let labelWidth = 62
          const orderNumber = ele.orderNumber + '.'
          ctx.fillText(orderNumber, 0, 64 + 44 + i * 56)
          if (support) {
            const metrics = ctx.measureText(orderNumber)
            console.log(metrics.width)
            labelWidth = metrics.width + 12
          }
          ctx.drawImage(ele.avatarInfo.path, labelWidth, 64 + 2 + i * 56, 52, 52)
          const nickName = ele.nickName
          ctx.fillText(nickName, labelWidth + 72, 64 + 44 + i * 56)
          let nameWidth = 50
          if (support) {
            const metrics = ctx.measureText(nickName)
            console.log(metrics.width)
            nameWidth = metrics.width + 20
          }
          ctx.setFillStyle('#d4d4d6')
          ctx.font = 'normal 26px sans-serif'
          ctx.fillText(ele.time, labelWidth + 72 + nameWidth, 64 + 45 + i * 56)
          ctx.setTextAlign('right')
          ctx.setFillStyle('#8B8B8C')
          ctx.font = 'normal 28px sans-serif'
          if (ele.status !== 'REFUND') {
            ctx.fillText('+' + ele.buyCount, 500, 64 + 44 + i * 56)
          } else {
            ctx.fillText('已取消接龙', 500, 64 + 44 + i * 56)
          }
          ctx.draw(true)
          ctx.draw(
            true,
            setTimeout(() => {
              const pixelRatio = app.globalData.systemInfo.pixelRatio
              uni.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 500,
                height: 400,
                destWidth: 500 * pixelRatio,
                destHeight: 400 * pixelRatio,
                canvasId: 'shareCanvas',
                success(res) {
                  // 图片小于或者等于1M时 可以执行获取图片
                  // 此处未判断，如果分享图没有可考虑此问题
                  uploadTempFile(res)
                },
              })
            }, 100),
          )
        })
      } else {
        drawNoJoinImage()
      }
    })
    .catch((err) => {
      console.log(err)
      console.log('生成分享图失败')
    })
  function drawNoJoinImage() {
    // 还没有参与者
    picture = picture.replace('http://', 'https://')
    util
      .getImageInfo(picture)
      .then((res) => {
        ctx.setTextAlign('center')
        // ctx.rect(0, 64, 500, 288)
        // ctx.clip()
        ctx.drawImage(res.path, 0, 64, 500, (res.height * 400) / res.width)
        ctx.draw(true)
        drawButton()
        ctx.draw(
          true,
          setTimeout(() => {
            const pixelRatio = app.globalData.systemInfo.pixelRatio
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 500,
              height: 400,
              destWidth: 500 * pixelRatio,
              destHeight: 400 * pixelRatio,
              canvasId: 'shareCanvas',
              success(res) {
                // 图片小于或者等于1M时 可以执行获取图片
                // 此处未判断，如果分享图没有可考虑此问题
                uploadTempFile(res)
              },
            })
          }, 100),
        )
      })
      .catch((err) => {
        console.log(err)
        console.log('图片下载失败')
      })
  }
  function timeLoop(joinList) {
    const timeList = []
    joinList.forEach((item) => {
      if (item) {
        timeList.push({
          id: item.id,
          time: item.createTime,
        })
      }
    })
    const time = util.timePassed(timeList, false)
    for (let j = 0; j < time.length; j++) {
      const item = time[j]
      let showTime = ''
      if (item.day !== '00' && item.day !== 0) {
        showTime = item.day + '天前'
      } else if (item.hou !== '00' && item.hou !== 0) {
        showTime = item.hou + '小时前'
      } else if (item.min !== '00' && item.min !== 0) {
        showTime = item.min + '分钟前'
      } else if (item.sec !== '00' && item.sec !== 0) {
        showTime = item.sec + '秒前'
      }
      for (let i = 0; i < joinList.length; i++) {
        const ele = joinList[i]
        if (item.id === ele.id) {
          joinList[i].time = showTime
          break
        }
      }
    }
    return joinList
  }
  function drawButton() {
    ctx.setFillStyle('white')
    ctx.fillRect(0, 320, 500, 100)
    util.roundRectColor2(ctx, 10, 330, 480, 60, 30, '#00d001')
    ctx.setTextAlign('center')
    ctx.setFillStyle('#ffffff')
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('我要接龙', 250, 370)
  }
}
onPageScroll(function (e) {
  monitorBuyButton()
})
function monitorBuyButton() {
  const that = this
  if (uni.createIntersectionObserver) {
    uni
      .createIntersectionObserver()
      .relativeToViewport({
        bottom: 0,
      })
      .observe('.buy-button', (res) => {
        if (res.intersectionRect.top > 0) {
          handleResult(true)
        } else {
          handleResult(false)
        }
      })
  } else {
    const windowHeight =
      {
        // ...wx.getSystemInfoSync(),
        ...uni.getSystemSetting(),
        ...uni.getAppAuthorizeSetting(),
        ...uni.getDeviceInfo(),
        ...uni.getWindowInfo(),
        ...uni.getAppBaseInfo(),
      }.windowHeight || 667
    uni
      .createSelectorQuery()
      .in()
      .select('.buy-button')
      .boundingClientRect(function (i) {
        if (i && i.top != null && i.top - 50 < windowHeight) {
          handleResult(true)
        } else {
          handleResult(false)
        }
      })
      .exec()
  }
  function handleResult(res) {
    if (res) {
      if (state.showBottomButton) {
        state.showBottomButton = false
      }
    } else {
      if (!state.showBottomButton) {
        state.showBottomButton = true
      }
    }
  }
}
function upadeShopCart(productId, count) {
  // 更新购物车中接龙商品数量
  const that = this
  // 检查购物车中是否有商品
  let currentItem = null
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      currentItem = ele
      break
    }
  }
  if (currentItem) {
    let productNum = currentItem.productNum
    productNum = productNum + count
    currentItem.productNum = productNum
    products[index] = currentItem
    handleSyncShopCart(products)
  }
}
function addShopCart(productId, count) {
  const that = this
  // 检查购物车中是否有商品
  let isHas = false
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      isHas = true
      break
    }
  }
  if (isHas) {
    // 更新购物车
    upadeShopCart(productId, count)
  } else {
    // 加入购物车
    const currentItem = getProductItemById(productId)
    products.push({
      ...currentItem,
      productNum: 1,
    })
    handleSyncShopCart(products)
  }
}
function removeShopCart(productId, count) {
  const that = this
  // 检查购物车中是否有商品
  let currentItem = null
  let index = null
  const products = state.shopCart.products
  for (let i = 0; i < products.length; i++) {
    const ele = products[i]
    if (ele.productId === productId) {
      index = i
      currentItem = ele
      break
    }
  }
  if (currentItem) {
    let productNum = currentItem.productNum
    productNum = productNum + count
    if (productNum <= 0) {
      products.splice(index, 1)
    } else {
      currentItem.productNum = productNum
      products[index] = currentItem
    }
    handleSyncShopCart(products)
  }
}
function getProductItemById(productId) {
  const that = this
  let currentItem = null
  for (let i = 0; i < state.products.length; i++) {
    const ele = state.products[i]
    if (ele.productId === productId) {
      currentItem = ele
      break
    }
  }
  return currentItem
}
function handleSyncShopCart(products) {
  const that = this
  const shopCart = {
    allPrice: 0,
    products: [],
    productNum: 0,
  }
  const activityProducts = state.products
  if (products.length > 0) {
    let allPrice = 0
    let productNum = 0
    products.forEach((item) => {
      productNum = productNum + item.productNum
      allPrice = allPrice + item.price * item.productNum
    })
    productNum = parseInt(productNum)
    allPrice = parseFloat(allPrice.toFixed(2))
    shopCart.allPrice = allPrice
    shopCart.productNum = productNum
    shopCart.products = products
    activityProducts.forEach((item) => {
      let productNum = 0
      for (let i = 0; i < products.length; i++) {
        const ele = products[i]
        if (item.productType !== 'SPEC') {
          if (item.productId === ele.productId) {
            productNum = ele.productNum
            break
          }
        } else {
          if (ele.parentProductId != null && item.productId === ele.parentProductId) {
            productNum = productNum + parseInt(ele.productNum)
          }
        }
      }
      item.productNum = parseInt(productNum)
    })
  } else {
    activityProducts.forEach((item) => {
      item.productNum = 0
      item.selectSpecs = ''
    })
  }
  state.shopCart = shopCart
  state.products = activityProducts
}
function clearShopCart() {
  const products = state.products
  products.forEach((ele) => {
    ele.productNum = 0
    ele.selectSpecs = ''
  })
  state.products = products
  handleSyncShopCart([])
}
function clickGoodsDetails(e) {
  const self = this
  const productId = e.currentTarget.dataset.productid
  const business = e.currentTarget.dataset.business
  state.showProductId = productId
  getProductDetails(productId, business)
}
function getProductDetails(productId, business) {
  const that = this
  const storeId =
    state.distributionStoreId !== '' && business == 'DISTRIBUTION'
      ? state.distributionStoreId
      : state.storeId
  productService
    .getDetails(storeId, productId)
    .then((res) => {
      if (res) {
        state.productDetails = res.productDetails
        state.show.goodsDetails = true
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function contactStore() {
  const storeInfo = state.storeInfo
  let tel = ''
  if (storeInfo.tel != null && storeInfo.tel != '') {
    // 判断订单中门店是否有电话
    tel = storeInfo.tel
  } else {
    // 门店无电话使用公司服务电话
    tel = app.globalData.servicePhone
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确定要拨打以下电话' + tel,
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel,
          })
        }
        if (res.cancel) {
        }
      },
    })
  }
}
function shareWechatMoments() {
  const screenWidth = app.globalData.systemInfo.windowWidth
  const rate = screenWidth / 750
  state.showPoster = true
  const phone = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  } // 调用方法获取机型
  let isAndroid = false
  if (phone.platform == 'ios') {
    isAndroid = false
  } else if (phone.platform == 'android') {
    isAndroid = true
  }
  const self = this
  // 获取到id为‘pictureQRCanvas’的canvas
  const ctx = uni.createCanvasContext('pictureQRCanvas')
  // 绘制背景
  ctx.setFillStyle('white')
  ctx.fillRect(0, 0, 562 * rate, 780 * rate)
  ctx.draw(true)
  util
    .getImageInfo(state.imagesPath.iconLogo)
    .then((res) => {
      ctx.setTextAlign('left')
      const height = (res.height * 60) / res.width
      const top = (60 - height) / 2
      ctx.drawImage(
        res.path,
        30 * rate,
        (20 + top) * rate,
        60 * rate,
        ((res.height * 60) / res.width) * rate,
      )
      // 绘制logo
      ctx.draw(true)
      // 绘制活动名称
      const appName = app.globalData.navigationBarTitleText
      ctx.setFillStyle('#474747')
      if (isAndroid) {
        ctx.font = 'normal ' + parseInt(16 * rate) + 'px sans-serif'
      } else {
        ctx.font = 'normal ' + 16 * rate + 'px sans-serif'
      }
      ctx.fillText(appName, 105 * rate, 48 * rate)
      ctx.setFillStyle('#9d9d9d')
      if (isAndroid) {
        ctx.font = 'normal ' + parseInt(14 * rate) + 'px sans-serif'
      } else {
        ctx.font = 'normal ' + 14 * rate + 'px sans-serif'
      }
      let startTime = state.solitaireActivity.startTime.split(' ')[0]
      startTime = startTime.replace(/-/g, '.') + '发布'
      ctx.fillText(startTime, 105 * rate, 72 * rate)
      const activityName = state.solitaireActivity.name
      let titleFont = 32 * rate
      if (isAndroid) {
        titleFont = parseFloat(titleFont)
      }
      util.dealWords({
        ctx,
        // 画布上下文
        fontSize: titleFont,
        // 字体大小
        lineHeigh: 42 * rate,
        // 字体行高
        word: activityName,
        // 需要处理的文字
        maxWidth: 480 * rate,
        // 一行文字最大宽度
        x: 40 * rate,
        // 文字在x轴要显示的位置
        y: 95 * rate,
        // 文字在y轴要显示的位置
        maxLine: 2, // 文字最多显示的行数
      })
      const description = state.solitaireActivity.description
      ctx.setFillStyle('#8b8b8b')
      // ctx.font = 'normal ' + 20 * rate + 'px sans-serif';
      let descFont = 20 * rate
      if (isAndroid) {
        descFont = parseFloat(descFont)
      }
      util.dealWords({
        ctx,
        // 画布上下文
        fontSize: descFont,
        // 字体大小
        lineHeigh: 26 * rate,
        // 字体行高
        word: description,
        // 需要处理的文字
        maxWidth: 480 * rate,
        // 一行文字最大宽度
        x: 40 * rate,
        // 文字在x轴要显示的位置
        y: 212 * rate,
        // 文字在y轴要显示的位置
        maxLine: 2, // 文字最多显示的行数
      })
      // 绘制上部分商品图片
      const imagesUrl = state.solitaireActivity.images[0].url.replace('http://', 'https://')
      return util.getImageInfo(imagesUrl)
    })
    .then((res) => {
      // ctx.fillRect(40 * rate, 318 * rate, 480 * rate, 272 * rate)
      // ctx.drawImage(res.path, 40 * rate, 318 * rate, 480 * rate, res.height * 480 / res.width * rate);
      const height = 480
      const realHeight = (res.height * 480) / res.width
      if (isAndroid) {
        ctx.drawImage(res.path, 40 * rate, 318 * rate, 480 * rate, realHeight * rate)
        ctx.draw(true)
        ctx.setFillStyle('white')
        ctx.fillRect(0 * rate, 585 * rate, 562 * rate, 194 * rate)
      } else {
        ctx.save()
        ctx.setFillStyle('white')
        ctx.fillRect(0, 318 * rate, 562 * rate, 272 * rate)
        ctx.clip()
        ctx.drawImage(res.path, 40 * rate, 318 * rate, 480 * rate, realHeight * rate)
        ctx.restore()
        ctx.draw(true)
        ctx.setFillStyle('white')
        ctx.fillRect(0 * rate, 585 * rate, 562 * rate, 194 * rate)
        ctx.clip()
      }
      let price = ''
      let minPrice = Number.POSITIVE_INFINITY
      let maxPrice = 0
      state.products.forEach((item) => {
        if (item.price < minPrice) {
          minPrice = item.price
        }
        if (item.price > maxPrice) {
          maxPrice = item.price
        }
      })
      if (maxPrice !== minPrice) {
        price = minPrice + '-' + maxPrice
      } else {
        price = minPrice
      }
      // 绘制商品名称价格
      ctx.setFillStyle('#d74d35')
      if (isAndroid) {
        ctx.font = 'normal ' + parseInt(24 * rate) + 'px sans-serif'
      } else {
        ctx.font = 'normal ' + 24 * rate + 'px sans-serif'
      }
      ctx.fillText('￥' + price, 40 * rate, 685 * rate)
      ctx.draw(true)
      ctx.setTextAlign('right')
      ctx.setFillStyle('#979797')
      if (isAndroid) {
        ctx.font = 'normal ' + parseInt(20 * rate) + 'px sans-serif'
      } else {
        ctx.font = 'normal ' + 20 * rate + 'px sans-serif'
      }
      ctx.fillText('一群人正赶来接龙', 360 * rate, 670 * rate)
      ctx.fillText('扫码参与', 360 * rate, 696 * rate)
      ctx.draw(true)
      ctx.setTextAlign('left')

      // 获取小程序码
      const appid = request.APP_ID
      const page = 'pages/mall/solitaire/solitaireDetails/solitaireDetails'
      const width = parseInt(300 * rate)
      const param = 'id=' + customData.solitaireId + '&storeId=' + state.storeId
      wxaUserService
        .createScene(appid, param)
        .then((res) => {
          const scene = 'gmparam:' + res
          createSharePicture(appid, page, scene, width)
        })
        .catch((err) => {
          console.log('分享图生产报错:', err.message)
        })
    })
  function createSharePicture(appid, page, scene, width) {
    uni.getImageInfo({
      src:
        request.BASE_URL +
        '/newretail/api/wxa/qrcode/create?appid=' +
        appid +
        '&page=' +
        page +
        '&scene=' +
        scene +
        '&size=' +
        width,
      success(res) {
        ctx.drawImage(res.path, 384 * rate, 606 * rate, 140 * rate, 140 * rate)
        ctx.draw(true)
      },
    })
  }
}
function handleSaveToImg(e) {
  const self = this
  const baseWidthUnit = 375 // 以iPhone6的分辨率为基准
  const windowWidth = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  }.windowWidth
  const rate = windowWidth / baseWidthUnit // 计算出当前设备分辨率与标准分辨率的比率
  const height = 780 * rate
  const width = 562 * rate
  const destHeight = 780 * rate
  const destWidth = 562 * rate
  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width,
    height,
    destWidth,
    destHeight,
    fileType: 'jpg',
    quality: 1,
    canvasId: 'pictureQRCanvas',
    success(res) {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          // 隐藏海报显示
          state.showPoster = false
          uni.showToast({
            title: '保存成功',
          })
        },
      })
    },
  })
}
function handlePosterCancel(e) {
  state.showPoster = false
}
function preventTouchMove(e) {}
function toSelectStore() {
  NAVPAGE.toSelectStore()
}
</script>
<style scoped>
/* pages/mall/solitaire/solitaireDetails/solitaireDetails.wxss */
/* @import '../../../../common/common.wxss'; */
page {
  position: relative;
  background: #e3e2e0;
}

.loading-box {
  padding-top: 180rpx;
  background: #ffffff;
}

.solitaire-background {
  width: 100%;
  height: 500rpx;
  overflow: hidden;
  position: relative;
}

.solitaire-background image.background {
  width: 100%;
  height: 500rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.top-info-box {
  width: 710rpx;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 218rpx 23rpx 0 23rpx;
}

.logo-box {
  width: 123rpx;
  height: 123rpx;
  /* border: 2rpx solid #ffffff; */
  border-radius: 20rpx;
  overflow: hidden;
}

.left-box {
  display: flex;
}

.left-box .info-text {
  color: #241d1d;
  margin-left: 27rpx;
  display: flex;
  flex-direction: column;
}

.left-box .info-text .name {
  font-size: 36rpx;
  line-height: 70rpx;
  font-weight: 400;
  margin-bottom: 6rpx;
  display: flex;
  align-items: center;
  font-family: Source Han Sans CN;
  font-size: 30rpx;
  color: #ffffff;
}

.left-box .info-text .name text {
  max-width: 180rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.left-box .info-text .right-img {
  width: 27rpx;
  height: 15rpx;
  margin-left: 10rpx;
}

.left-box .info-text .text {
  font-size: 24rpx;
  line-height: 40rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #ffffff;
}

.right-button-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.right-button {
  margin-left: 34rpx;
  position: relative;
}

.right-button button {
  width: 45rpx;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
}

.right-button image {
  width: 45rpx;
  height: 45rpx;
  border-radius: 30rpx;
}

.logo-box image {
  width: 100%;
  height: 100%;
}

.top-tips-box {
  width: 331rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8rpx;
  position: absolute;
  font-size: 24rpx;
  line-height: 48rpx;
  text-align: center;
  top: -63rpx;
  right: -12rpx;
  color: #ffffff;
}

.bottom-triangle {
  width: 0;
  height: 0;
  border-left: 9rpx solid transparent;
  border-right: 9rpx solid transparent;
  border-top: 9rpx solid rgba(0, 0, 0, 0.3);
  position: absolute;
  right: 33rpx;
  bottom: -9rpx;
}

/* 活动详情信息 */
.solitaire-activity {
  width: 710rpx;
  background: #ffffff;
  box-shadow: 0px 0px 10rpx 0px rgba(238, 238, 238, 0.5);
  border-radius: 20rpx;
  margin: -120rpx auto 0 auto;
  position: relative;
  box-sizing: border-box;
}
.solitaire-activity-inner {
  padding: 28rpx 30rpx;
}
.solitaire-activity .top-triangle {
  width: 0;
  height: 0;
  border-left: 20rpx solid transparent;
  border-right: 20rpx solid transparent;
  border-bottom: 20rpx solid #ffffff;
  position: absolute;
  left: 17rpx;
  top: -17rpx;
}

.solitaire-activity .name {
  width: 100%;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 0 auto 25rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 32rpx;
  color: #333333;
  line-height: 42rpx;
}

.solitaire-activity .desc {
  width: 100%;
  margin: 0 auto;
  font-size: 28rpx;
  line-height: 44rpx;
  font-weight: 400;
  margin-bottom: 25rpx;
  font-family: PingFang SC;
  color: #999999;
}

.solitaire-activity .activity-status {
  width: 100%;
  margin: 0 auto;
  font-size: 28rpx;
  line-height: 44rpx;
  font-weight: 400;
  color: #747474;
  margin-bottom: 25rpx;
  font-family: PingFang SC;
  color: #eb702d;
}

.solitaire-activity .img-box {
  font-size: 0;
}

.solitaire-activity .img-box image {
  width: 100%;
  height: 206rpx;
  border-radius: 15rpx;
}

.solitaire-activity .img-box image:last-of-type {
  margin-right: 0;
}

/* 商品信息 */

.goods-box {
  /* background: #ffffff; */
  /* margin: 0 23rpx; */
}

.goods-item-box {
  border-top: 1px solid #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 38rpx;
}

.goods-item-box .goods-img {
  width: 158rpx;
  height: 158rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.goods-item-box .goods-img image {
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.goods-item-box .goods-info {
  width: calc(100% - 188rpx);
  color: #454545;
  display: flex;
  /* justify-content: space-between; */
  justify-content: space-around;
  position: relative;
}

.goods-item-box .left {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-item-box .goods-name {
  font-size: 32rpx;
  line-height: 38rpx;
  font-weight: 500;
}

.goods-item-box .goods-desc {
  font-size: 20rpx;
  line-height: 26rpx;
  font-weight: 300;
  margin-bottom: 10rpx;
  height: 26rpx;
}

.goods-item-box .goods-name {
  width: 285rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-item-box .goods-desc {
  width: 324rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-item-box .goods-spec {
  font-size: 28rpx;
  font-weight: 400;
  height: 34rpx;
  line-height: 34rpx;
}

.goods-item-box .goods-price {
  margin-top: 21rpx;
  display: flex;
  align-items: baseline;
  margin-bottom: 8rpx;
}

.goods-item-box .now-price {
  font-size: 32rpx;
  line-height: 36rpx;
  color: #eb702d;
}

.goods-item-box .old-price {
  font-size: 20rpx;
  color: #8b8b8c;
  margin-left: 14rpx;
  text-decoration: line-through;
  font-weight: 400;
}

.goods-item-box .right {
  flex-shrink: 0;
}

.goods-item-box .right .num {
  font-size: 30rpx;
  line-height: 38rpx;
  height: 38rpx;
  color: #ea534a;
  text-align: right;
}

.goods-item-box .right .button {
  font-size: 30rpx;
  width: 136rpx;
  height: 44rpx;
  line-height: 44rpx;
  border-radius: 6rpx;
  border: 1px solid;
  text-align: center;
  margin-top: 84rpx;
}

.goods-item-box .sold-out {
  width: 136rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  background: #eeeeee;
  border-radius: 6rpx;
  font-size: 28rpx;
  color: #999999;
  margin-top: 84rpx;
}

.goods-item-box .cart-control {
  width: 180rpx;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 88rpx;
  text-align: center;
  position: relative;
  margin-right: -22rpx;
  margin-top: 62rpx;
}

.goods-item-box .cart-control .add-box,
.goods-item-box .cart-control .reduce-box {
  width: 88rpx;
  height: 88rpx;
  /* border-radius: 50%; */
  padding: 0;
}

.goods-item-box .cart-control .add-box {
  position: absolute;
  right: 0;
}

.goods-item-box .cart-control .reduce-box {
  position: absolute;
  left: 0;
}

.goods-item-box .cart-control .add-box button,
.goods-item-box .cart-control .reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}
.goods-item-box .cart-control .iconfont {
  font-size: 45rpx;
}
.goods-item-box .add-img,
.goods-item-box .reduce-img {
  width: 44rpx;
  height: 44rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -22rpx;
  margin-left: -22rpx;
}

.goods-item-box .cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
  line-height: 130rpx;
}

button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

button::after {
  border: 0;
}

/* 弹窗中商品样式 */

.goods-main-box .goods-item-box,
.goods-details-main .goods-item-box {
  width: 665rpx;
  margin: 0 auto;
}

.goods-main-box .goods-item-box .goods-img,
.goods-details-main .goods-item-box .goods-img {
  width: 184rpx;
  height: 184rpx;
  border-radius: 0;
}

.goods-main-box .goods-item-box .goods-info,
.goods-details-main .goods-item-box .goods-info {
  width: 465rpx;
  margin-left: 15rpx;
  min-height: 184rpx;
}

.goods-main-box .goods-item-box .goods-name,
.goods-details-main .goods-item-box .goods-name {
  width: 453rpx;
}

.goods-main-box .goods-item-box .right,
.goods-details-main .goods-item-box .right {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 180rpx;
  height: 170rpx;
  padding-bottom: 14rpx;
  display: flex;
  align-items: flex-end;
}

.goods-main-box .goods-item-box .cart-control,
.goods-details-main .goods-item-box .cart-control {
  margin-top: 0;
}

/* 参与人 */

.solitaire-join {
  padding: 7rpx 0 6rpx 0;
  width: 710rpx;
  margin: 24rpx auto 0;
  background: #ffffff;
  border-radius: 20rpx;
  box-sizing: border-box;
}

.solitaire-join .item {
  display: flex;
  /* padding: 7rpx 0; */
  font-size: 28rpx;
  padding: 20rpx 20rpx 20rpx 0;
}

.solitaire-join .item .info {
  display: flex;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #38373a;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.solitaire-join .item .order {
  width: 40rpx;
  height: 40rpx;
  background: #ffeade;
  border-radius: 0px 20rpx 20rpx 0px;
  text-align: center;
  margin-right: 17rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 40rpx;
}

.solitaire-join .item image {
  width: 80rpx;
  height: 80rpx;
  margin-right: 18rpx;
  background: #c1c1c1;
  border-radius: 10rpx;
}

.buy-info {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  width: 516rpx;
  height: 80rpx;
}

.buy-user {
  display: flex;
  align-items: center;
}

.buy-product {
}

.buy-item {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #363636;
  font-weight: 400;
}

.buy-item view:first-of-type {
  width: 459rpx;
}

.solitaire-join .item .name {
  min-width: 40rpx;
  margin-right: 20rpx;
  color: #696969;
}

.solitaire-join .item .time {
  color: #a4a4a4;
}

.solitaire-join .item .num {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
}

.solitaire-join .item .num.refund {
  color: #8b8b8c;
}

.solitaire-join .more {
  width: 100%;
  padding: 16rpx 0;
  text-align: center;
  font-size: 28rpx;
  line-height: 48rpx;
  color: #666666;
  margin-top: 3rpx;
}

.button-box.middle {
  width: 100%;
  margin: 0 auto;
  padding: 20rpx 0 42rpx 0;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  z-index: 0;
}

.button-box.middle .menu {
  height: 80rpx;
  margin-left: 2rpx;
  border-top-left-radius: 10rpx;
  border-bottom-left-radius: 10rpx;
  /* background: #FFEADE; */
}

.button-box.middle view.button {
  border-radius: 10rpx;
  font-size: 40rpx;
  align-items: center;
  width: 710rpx;
  height: 80rpx;
  background: linear-gradient(-90deg, #f41d0c, #eb702d);
  border-radius: 40rpx;
}
.button-box.middle view.bottom-btn-box {
  background: #ffeade;
}
/* 我要接龙 */
.button-box {
  position: fixed;
  bottom: 30rpx;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 0;
}

.button-box .menu {
  min-width: 380rpx;
  padding: 0 43rpx 0 48rpx;
  height: 80rpx;
  flex-shrink: 0;
  /* background: #ffffff; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
  color: #f41d0c;
  font-size: 36rpx;
  position: relative;
  box-sizing: border-box;
}

.button-box .badge {
  position: absolute;
  min-width: 10rpx;
  padding: 0 10rpx;
  height: 30rpx;
  border-radius: 15rpx;
  background: #fa0104;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 30rpx;
  text-align: center;
  top: -30%;
  right: -65%;
}
.menu-icon-box {
  width: 41rpx;
  height: 41rpx;
  margin-right: 45rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu .menu-price {
  line-height: 80rpx;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 32rpx;
  color: #f41d0c;
}
.button-box .menu .menu-icon {
  width: 41rpx;
  height: 41rpx;
}

.button-box .button-text {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 80rpx;
  border-radius: 40rpx;
}
.button-box .small-button {
  width: 330rpx;
  position: relative;
  z-index: 2;
  background: linear-gradient(-90deg, #f41d0c, #eb702d);
}
.share-reamin {
  width: 172rpx;
  height: 108rpx;
  line-height: 172rpx;
  overflow: hidden;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ee503b;
  font-weight: 500;
}

.share-reamin image {
  width: 37rpx;
  height: 34rpx;
  margin-right: 8rpx;
}

.button-box button {
  background: #ffffff;
  border: 0;
}

.button-box view.button {
  width: 666rpx;
  height: 80rpx;
  background: linear-gradient(-90deg, #f41d0c, #eb702d);
  border: 2rpx solid;
  text-align: center;
  line-height: 80rpx;
  border-radius: 53rpx;
  font-size: 40rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  margin: 0 auto;
  display: flex;
  overflow: hidden;
}
.button-box view.bottom-btn-box {
  background: #ffeade;
}
.button-box view.disabled {
  background: #d4d4d6 !important;
  box-shadow: none;
  justify-content: center;
}

/* 弹窗 */

.popup-success {
}

.popup-success .content {
  width: 559rpx;
  padding-top: 40rpx;
  min-height: 523rpx;
  padding-bottom: 70rpx;
  background-color: #ffffff;
  border-radius: 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-success .close {
  margin-top: 34rpx;
  text-align: center;
}

.popup-success .title {
  font-size: 38rpx;
  line-height: 48rpx;
  margin: 35rpx auto 40rpx auto;
  color: #111111;
}

.join-people {
  width: 450rpx;
  padding: 33rpx 27rpx;
  min-height: 54rpx;
  background: #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #010101;
  margin: 0 auto 18rpx auto;
}

.join-people image {
  width: 54rpx;
  height: 54rpx;
  border-radius: 14rpx;
  margin: 0 10rpx;
}

.join-people .info {
  display: flex;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #38373a;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.join-people .order {
  margin-right: 4rpx;
  line-height: 64rpx;
  min-width: 68rpx;
}

.join-people image {
  width: 64rpx;
  height: 64rpx;
  border-radius: 4rpx;
  background-color: #eee;
  margin-right: 18rpx;
}

.join-people .buy-info {
  width: 292rpx;
}

.join-people .buy-info .buy-user {
  font-size: 28rpx;
  line-height: 36rpx;
}

.join-people .buy-product .buy-item {
  font-size: 26rpx;
  color: #03b50b;
}

.popup-succes .tips {
  font-size: 22rpx;
  line-height: 36rpx;
  color: #626262;
  text-align: center;
}

.share {
  margin-top: 18rpx;
  width: 502rpx;
  height: 100rpx;
  font-size: 32rpx;
  line-height: 100rpx;
  color: #ffffff;
  background-color: #00d001;
}

.widget {
  position: absolute;
  left: 10000px;
  top: 0;
}

.page-content {
  position: relative;
  width: 750rpx;
  padding-bottom: 112rpx;
  overflow-x: hidden;
}

.share-canvas-box {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 10000px;
  top: 0;
}

.share-canvas {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 10000px;
  top: 0;
}

/* 购物车弹窗 */
.shop-cart-main {
  padding: 45rpx 0 238rpx 0;
  border-radius: 26rpx 26rpx 0px 0px;
  width: 100%;
  min-height: 368rpx;
  background: #ffffff;
  position: relative;
}

.popup-close {
  position: absolute;
  height: 84rpx;
  width: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
}

.popup-close image {
  width: 42rpx;
  height: 42rpx;
}

.goods-main-box {
  min-height: 262rpx;
  max-height: 652rpx;
}

/* 商品详情 */
.goods-details-main {
  padding: 80rpx 0 160rpx 0;
  border-radius: 26rpx 26rpx 0px 0px;
  width: 100%;
  min-height: 368rpx;
  background: #ffffff;
  position: relative;
}

.goods-imgtext {
  background-color: #fff;
  min-height: 262rpx;
  max-height: 652rpx;
}

.goods-imgtext > text {
  display: block;
  text-indent: 40rpx;
  font-size: 36rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-imgtext image {
  width: 100%;
  display: block;
}

/* 分享 */
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

.poster-box-main {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.poster-picture-box {
  width: 562rpx;
  height: 780rpx;
  margin: 0 auto;
  margin-bottom: 32rpx;
}

.poster-picture-box canvas {
  width: 562rpx;
  height: 780rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-box .saveImage {
  width: 562rpx;
  height: 100rpx;
  background: #80bd01;
  color: #fff;
  font-size: 32rpx;
  line-height: 100rpx;
  text-align: center;
  margin: 0 auto;
  border-radius: 10rpx;
}

.poster-box .saveImageTips {
  font-size: 28rpx;
  color: #ffffff;
  margin-top: 20rpx;
}
</style>
