<route lang="json5" type="page">
{
  layout: 'default-newretail',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<template>
  <!-- pages/shopcart/shopcart.wxml -->
  <view>
    <navigationBar :title="state.navigationBarTitle" isShopcart="true"></navigationBar>
    <view
      class="page-content"
      :style="state.goodsNumAll == 0 ? 'padding-bottom: 40rpx' : ''"
      v-if="!state.loading"
    >
      <view
        v-if="
          (state.systemOptions.isDeliveryProduct || state.systemOptions.isNextDayProduct) &&
          state.shoppingCartShowType != 'UD'
        "
      >
        <view class="header-info">
          <view class="header-tab">
            <view
              :class="'nav-title ' + (state.tabSelected == 2 ? 'active' : '')"
              :style="
                'color: ' +
                state.themeColor +
                ';border: 3rpx solid ' +
                state.themeColor +
                ';border-right: 3rpx solid ' +
                state.themeColor +
                ';background: ' +
                (state.tabSelected == 2 ? state.themeColor : '') +
                ';'
              "
              data-idx="2"
              @click="clickCategory"
            >
              {{ state.shoppingData.nextDay.labelName || '次日达' }}
              <text v-if="state.shoppingData.nextDay.goodsNum">
                ({{ state.shoppingData.nextDay.goodsNum }})
              </text>
            </view>
            <view
              :class="'nav-title ' + (state.tabSelected == 1 ? 'active' : '')"
              :style="
                'color: ' +
                state.themeColor +
                ';border: 3rpx solid ' +
                state.themeColor +
                ';border-right: 3rpx solid ' +
                state.themeColor +
                ';background: ' +
                (state.tabSelected == 1 ? state.themeColor : '') +
                ';'
              "
              data-idx="1"
              @click="clickCategory"
            >
              {{ state.shoppingData.distribution.labelName || '商城商品' }}
              <text v-if="state.shoppingData.distribution.goodsNum">
                ({{ state.shoppingData.distribution.goodsNum }})
              </text>
            </view>
            <view
              :class="'nav-title ' + (state.tabSelected == 0 ? 'active' : '')"
              :style="
                'color: ' +
                state.themeColor +
                ';border: 3rpx solid ' +
                state.themeColor +
                ';border-left: 3rpx solid ' +
                state.themeColor +
                ';background: ' +
                (state.tabSelected == 0 ? state.themeColor : '') +
                ';'
              "
              data-idx="0"
              @click="clickCategory"
            >
              {{ state.shoppingData.store.labelName || '门店商品' }}
              <text v-if="state.shoppingData.store.goodsNum">
                ({{ state.shoppingData.store.goodsNum }})
              </text>
            </view>
          </view>
          <view
            class="edit"
            @click="handleDelete"
            :data-type="state.tabSelected == 1 ? 'distribution' : 'store'"
          >
            <image :src="state.imagesPath.iconShopCartDelete"></image>
          </view>
        </view>
      </view>
      <view class="shopcart-title">
        <view class="location" for="checkAll" @click="changeAddress">
          <image
            style="width: 22rpx; height: 30rpx"
            :src="state.imagesPath.iconNearStoreAddress"
          ></image>
          <text>{{ state.addressName || '暂无地址信息' }}</text>
        </view>
      </view>
      <view
        :class="
          'shopcart-main ' +
          (state.isIphoneX ? 'iphoneX-height' : '') +
          ' ' +
          (state.giftGoodsList.length > 0 ? 'hasGift' : '')
        "
        v-if="state.goodsNumAll != 0 || state.expiredGoodsList.length != 0"
      >
        <view
          class="shopcart-item-box"
          v-for="(shoppingTypeItem, index) in state.shoppingType"
          :key="index"
          v-show="
            state.shoppingData[shoppingTypeItem] &&
            state.shoppingData[shoppingTypeItem].goodsList &&
            state.shoppingData[shoppingTypeItem].goodsList.length > 0
          "
        >
          <view
            v-if="
              state.shoppingCartShowType == 'UD' &&
              state.shoppingData[shoppingTypeItem] &&
              state.shoppingData[shoppingTypeItem].goodsList &&
              state.shoppingData[shoppingTypeItem].goodsList.length > 0
            "
            class="store-type-title"
          >
            <checkbox-group
              @change="checkboxAllChange"
              :data-type="shoppingTypeItem"
              class="check-box"
            >
              <label class="checkbox">
                <checkbox
                  :disabled="
                    !(
                      state.shoppingData[shoppingTypeItem] &&
                      state.shoppingData[shoppingTypeItem].goodsList &&
                      state.shoppingData[shoppingTypeItem].goodsList.length > 0
                    )
                  "
                  :value="shoppingTypeItem"
                  :style="state.calcPromotionsFlag != 0 ? 'pointer-events: none' : ''"
                  :checked="
                    state.shoppingData[shoppingTypeItem] &&
                    state.shoppingData[shoppingTypeItem].checkedAll
                  "
                  :color="state.themeColor"
                ></checkbox>
              </label>
              <!-- {{shoppingData[shoppingTypeItem].labelName}} -->
              <text>
                {{
                  state.shoppingData[shoppingTypeItem] &&
                  state.shoppingData[shoppingTypeItem].storeName
                }}
              </text>
            </checkbox-group>
            <view
              class="edit"
              v-if="
                state.shoppingData[shoppingTypeItem] &&
                state.shoppingData[shoppingTypeItem].goodsList &&
                state.shoppingData[shoppingTypeItem].goodsList.length > 0
              "
              @click="handleDelete"
              :data-type="shoppingTypeItem"
            >
              <image :src="state.imagesPath.iconShopCartDelete"></image>
            </view>
          </view>
          <!-- <view class="no-data-tip" wx:if="{{state.shoppingCartShowType == 'UD' && state.shoppingData[shoppingTypeItem].goodsList.length == 0}}">
        暂无数据~
      </view> -->
          <checkbox-group @change="checkboxChange" :data-type="shoppingTypeItem">
            <view
              :class="
                'shopcart-item ' +
                (item && item.promotionDescription ? 'promotionDescription' : '') +
                ' ' +
                (item && item.status == 'DELETED' ? 'expiredGood' : '')
              "
              v-for="(item, index) in state.shoppingData[shoppingTypeItem] &&
              state.shoppingData[shoppingTypeItem].goodsList
                ? state.shoppingData[shoppingTypeItem].goodsList
                : []"
              :key="index"
              v-show="item"
            >
              <view
                class="goods-top"
                v-if="
                  (item && item.promotionsLabel && item.promotionsLabel.length > 0) ||
                  (item && item.promotionDescription && item.discount)
                "
              >
                <text
                  class="discount-icon"
                  v-for="(labelItem, index) in item.promotionsLabel"
                  :key="index"
                  :data-id="index"
                  v-show="index < 3"
                >
                  {{ labelItem.labelName }}
                </text>
                <view class="discount-desc">
                  {{
                    item.promotionDescription && item.discount
                      ? item.promotionDescription + ';'
                      : item.promotionDescription
                  }}{{ item.discount ? '已优惠' + item.discount + '元' : '' }}
                </view>
              </view>
              <view class="goods-box">
                <checkbox
                  :value="item.id"
                  :style="state.calcPromotionsFlag != 0 ? 'pointer-events: none' : ''"
                  :checked="item.status === 'DELETED' ? false : item.checked"
                  :color="state.themeColor"
                ></checkbox>
                <view
                  class="goods-img-box"
                  @click="toGoodsDetails"
                  :data-type="shoppingTypeItem"
                  :data-id="item.id"
                >
                  <image :src="item.imageUrl" mode="aspectFit"></image>
                  <image
                    class="no-balance"
                    :src="state.imagesPath.soldOutIcon"
                    v-if="item.balance <= 0"
                  ></image>
                  <!-- <image class="seckill-icon" wx:if="{{item.grabActivityId}}" src="{{imagesPath.iconSeckillSeat}}"></image> -->
                </view>
                <view
                  class="goods-info"
                  @click="toGoodsDetails"
                  :data-type="shoppingTypeItem"
                  :data-id="item.id"
                >
                  <view class="goods-name">
                    <view>{{ item.name }}</view>
                  </view>
                  <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                    <text v-for="(groupItem, index) in item.groupProducts" :key="index">
                      {{ groupItem.groupProductCount }}x{{ groupItem.productName }}
                    </text>
                  </view>
                  <view class="goods-label" v-if="item.specs">{{ item.specs }}</view>
                  <!-- <text class="goods-desc" wx:if="{{item.description && item.style != 'MEALS2'}}">{{item.description}}</text> -->
                  <text class="goods-desc" v-if="item.deliveryTimeStatement" style="color: #ff9f43">
                    {{ item.deliveryTimeStatement }}
                  </text>

                  <view v-if="item.require" class="require_label">必选</view>
                  <view class="goods-name produt-label">
                    <view
                      v-for="(labelItem, index) in item.produtlabel"
                      :key="index"
                      v-show="index < 3"
                    >
                      <text
                        :style="'background-color:rgb(' + labelItem.color + ')'"
                        v-if="labelItem.labelName && !labelItem.imageUrl"
                      >
                        {{ labelItem.labelName }}
                      </text>
                      <image
                        style="width: 80rpx"
                        mode="widthFix"
                        :src="labelItem.imageUrl"
                        v-else-if="labelItem.imageUrl"
                      ></image>
                    </view>
                  </view>
                  <view class="price-number">
                    <view
                      class="price-box"
                      v-if="item.sellPrice >= 0 && item.sellPrice != null && item.sellPrice"
                    >
                      <view v-if="item.sellPrice !== item.memberPrice">
                        <!-- <text wx:if="{{item.originalPrice && item.sellPrice < item.originalPrice}}">
                                                ￥{{item.sellPrice}}
											    <text class="old-price" >￥{{item.originalPrice}}</text>

                                            </text>
											<text wx:else>
                                                ￥{{item.originalPrice}}
                                            </text> -->
                        <text>￥</text>
                        {{ item.sellPrice }}
                        <!-- <text class="old-price" wx:if="{{item.originalPrice && item.sellPrice < item.originalPrice}}">￥{{item.originalPrice}}</text> -->
                      </view>
                      <view class="vip-price" v-else-if="item.memberPrice">
                        <text>￥{{ filtToFix(item.memberPrice) }}</text>
                        <view class="vip-label">
                          <image :src="state.imagesPath.iconVipLabel"></image>
                          <text>{{ state.vipGradeConfig.priceLabel }}</text>
                          <!-- <text>会员价</text> -->
                        </view>
                      </view>
                    </view>
                    <view class="count-box">
                      <view
                        :data-id="item.id"
                        class="iconfont2 icon-jianhao"
                        :data-type="shoppingTypeItem"
                        @click.stop="handleReduce"
                        :style="
                          'color:' +
                          ((item.productNum || 0) > 1 ? state.themeColor : '#BBBBBC') +
                          ';'
                        "
                        v-if="item.status !== 'DELETED' && item.balance > 0"
                      ></view>
                      <text
                        :data-id="item.id"
                        :data-type="shoppingTypeItem"
                        v-if="item.status !== 'DELETED' && item.balance > 0"
                        @click.stop="handleNumber"
                      >
                        {{ item.productNum || 0 }}
                      </text>
                      <view
                        :data-id="item.id"
                        :data-type="shoppingTypeItem"
                        class="iconfont2 icon-jiahao2fill"
                        @click.stop="handleAdd"
                        :style="'color: ' + state.themeColor + ';'"
                        v-if="item.status !== 'DELETED' && item.balance > 0"
                      ></view>
                    </view>
                  </view>
                </view>
                <view class="bg-shade" v-if="item.status === 'DELETED' || item.balance <= 0">
                  <text
                    class="delete-btn"
                    :data-id="item.id"
                    :data-traceId="item.traceId"
                    @click="clickDelete"
                  >
                    清除
                  </text>
                </view>
              </view>
              <view class="gift-box" v-if="item.goodsPromotions && item.goodsPromotions.length > 0">
                <view class="gift-title">赠品:</view>
                <view class="gift-item-box">
                  <view
                    class="gift-item"
                    v-for="(giftItem, index) in item.goodsPromotions"
                    :key="index"
                  >
                    <view>
                      <view class="gift-img-box">
                        <image :src="giftItem.goods.image"></image>
                      </view>
                      <text>{{ giftItem.goods.name }}</text>
                    </view>
                    <view class="gift-num">x{{ giftItem.count }}</view>
                  </view>
                </view>
              </view>
            </view>
          </checkbox-group>
        </view>
        <view
          class="expiredGoods"
          v-if="state.expiredGoodsList.length > 0"
          :style="state.goodsNumAll == 0 ? 'border-top:none' : ''"
        >
          <view class="expiredGoodTitle">
            <view class="expiredGood-title-box">
              <text>失效商品（{{ state.expiredGoodsList.length }}）</text>
              <view class="custom-btn" @click="changeisExpand">
                <image
                  :src="state.imagesPath.upIcon"
                  :class="state.showExpiredGood ? 'up-icon rotate-icon' : 'up-icon'"
                  mode=""
                ></image>
              </view>
            </view>
            <text class="clearExpiredGood" @click="clearExpiredGood" style="color: #999">
              清空失效商品
            </text>
          </view>
          <checkbox-group @change="expiredBoxChange" v-if="state.showExpiredGood">
            <view
              class="shopcart-item"
              v-for="(item, index) in state.expiredGoodsList"
              :key="index"
            >
              <view class="goods-box">
                <checkbox :value="item.id" :disabled="true"></checkbox>
                <view class="goods-img-box" @click="toGoodsDetails" :data-id="item.id">
                  <image :src="item.imageUrl" mode="aspectFit"></image>
                  <view class="goods-lose-title">失效</view>
                  <image
                    class="no-balance"
                    :src="state.imagesPath.soldOutIcon"
                    v-if="item.balance <= 0"
                  ></image>
                  <!-- <image class="seckill-icon" wx:if="{{item.grabActivityId}}" src="{{imagesPath.iconSeckillSeat}}"></image> -->
                </view>
                <view class="goods-info" @click="toGoodsDetails" :data-id="item.id">
                  <view class="goods-name">
                    <view>{{ item.name }}</view>
                  </view>
                  <view class="goods-label" v-if="item.specs">{{ item.specs }}</view>
                  <!-- <text class="goods-desc" wx:if="{{item.description}}">{{item.description}}</text> -->
                  <view class="goods-name">
                    <view
                      v-for="(expiredLabelItem, index) in item.produtlabel"
                      :key="index"
                      v-show="index < 3"
                    >
                      <text
                        :style="'background-color:rgb(' + expiredLabelItem.color + ')'"
                        v-if="expiredLabelItem.labelName && !expiredLabelItem.imageUrl"
                      >
                        {{ expiredLabelItem.labelName }}
                      </text>
                      <image
                        style="width: 80rpx"
                        mode="widthFix"
                        :src="expiredLabelItem.imageUrl"
                        v-else-if="expiredLabelItem.imageUrl"
                      ></image>
                    </view>
                    <!-- <text wx:for="{{item.produtlabel}}" wx:key="index" wx:if="{{index<3}}" style="background-color:rgb({{item.color}})">{{item.labelName}}</text> -->
                  </view>

                  <view class="price-number">
                    <view
                      class="price-box"
                      v-if="
                        item.originalPrice ||
                        (item.sellPrice >= 0 && item.sellPrice !== undefined && item.sellPrice)
                      "
                    >
                      <!-- <text>￥</text>{{item.sellPrice}} -->
                      <!-- <text class="old-price" wx:if="{{item.originalPrice && item.sellPrice < item.originalPrice}}">￥{{item.originalPrice}}</text> -->
                    </view>
                    <view class="count-box">失效商品</view>
                  </view>
                </view>
              </view>
            </view>
          </checkbox-group>
        </view>
        <!-- <recommend-list storeId="{{storeId}}" wx:if="{{!loading}}"></recommend-list> -->
      </view>

      <view
        :class="'gift-box gift-bottom-box ' + (isIphoneX ? 'iphoneX-height' : '')"
        v-if="state.giftGoodsList.length > 0"
      >
        <view class="gift-title">赠品:</view>
        <view class="gift-item-box">
          <view class="gift-item">
            <view
              class="gift-img-box"
              v-for="(item, idx) in state.giftGoodsList"
              :key="idx"
              v-show="idx < 4"
            >
              <image :src="item.goods.image"></image>
            </view>
          </view>
          <view class="gift-num">x{{ state.giftGoodsList.length }}</view>
        </view>
      </view>
      <view class="no-data" v-if="state.goodsNumAll == 0 && state.expiredGoodsList.length == 0">
        <image :src="state.imagesPath.imgNoDataShopcart"></image>
        <button
          size="mini"
          @click="toHome"
          :style="'color: ' + state.themeColor + ';border:1px solid ' + state.themeColor"
        >
          随便逛逛
        </button>
      </view>
      <!-- 门店精选 -->
      <!-- <mall-recommend id="mall-recommend" 
    show="{{!state.loading}}"
    shopCart="{{shopCart}}"
    bind:refresh="handleRefreshData"
    displayStyle="two"
    bind:addToCart="addToCart" 
    refreshType="{{state.refreshType}}"
    isShowProductAreaTitle="{{true}}"
    wx:if="{{!state.loading}}"
  >
  </mall-recommend> -->
      <view
        :class="'money-detail ' + (isIphoneX ? 'iphoneX-height' : '')"
        :style="'height: ' + (state.show.money ? '100%' : '96rpx') + ';'"
      >
        <view class="money-detail-pop-bg" @click="doShowMoneyDetail" v-if="state.show.money"></view>
        <view class="money-detail-pop" v-if="state.show.money">
          <view class="close-pop" @click="doShowMoneyDetail">
            <image :src="state.imagesPath.category_close" mode="widthFix"></image>
          </view>
          <view class="pop-title">金额明细</view>
          <view class="pop-title-tips">实际优惠金额请以下单页为准</view>
          <view
            class="pop-content-data"
            v-for="(typeItem, index) in state.shoppingType"
            :key="index"
            v-show="state.shoppingData[typeItem] && state.shoppingData[typeItem].selectShow"
          >
            <view class="pop-sum flex-between">
              <view>
                {{ state.shoppingData[typeItem] && state.shoppingData[typeItem].labelName }}合计
              </view>
              <view>
                ￥{{ state.shoppingData[typeItem] && state.shoppingData[typeItem].sellPrice }}
              </view>
            </view>
          </view>
          <view class="pop-discount flex-between">
            <view>活动优惠</view>
            <view class="m-color">共减￥{{ state.shoppingDiscount }}</view>
          </view>
          <view
            class="cash-discount flex-between"
            v-if="state.shoppingCashDiscount && state.shoppingCashDiscount.discount != 0"
          >
            <view>{{ state.shoppingCashDiscount.description }}</view>
            <view class="m-color">减￥{{ state.shoppingCashDiscount.discount }}</view>
          </view>
          <view class="pop-sum flex-between">
            <view>优惠后合计</view>
            <view>￥{{ state.shoppingAllPrice }}</view>
          </view>
          <!-- <view class="pop-content-data {{index == 1 ? 'content-border' : ''}}" wx:for="{{state.shoppingType}}" wx:for-item="typeItem" hidden="{{!state.shoppingData[typeItem].selectShow}}">
        <view class="pop-hd">
          {{state.shoppingData[typeItem].labelName}}
        </view>
        <view class="pop-sum flex-between">
          <view>商品合计</view>
          <view>￥{{state.shoppingData[typeItem].sellPrice}}</view>
        </view>
        <view class="pop-discount flex-between">
          <view>活动优惠</view>
          <view class="m-color">共减￥{{state.shoppingData[typeItem].discount}}</view>
        </view>
        <view class="cash-discount flex-between" wx:if="{{state.shoppingData[typeItem].cashDiscount && state.shoppingData[typeItem].cashDiscount.discount != 0}}">
          <view>{{state.shoppingData[typeItem].cashDiscount.description}}</view>
          <view class="m-color">减￥{{state.shoppingData[typeItem].cashDiscount.discount}}</view>
        </view>
        <view class="pop-sum flex-between">
          <view>优惠后合计</view>
          <view>￥{{state.shoppingData[typeItem].allPrice}}</view>
        </view>
      </view> -->
        </view>
        <view
          :class="'bottom-info ' + (isIphoneX ? 'iphoneX-height' : '')"
          v-if="state.goodsNumAll > 0"
          :style="
            'height:' +
            (state.navigationStyle == '1' ? '128rpx' : '98rpx') +
            ';padding-bottom:' +
            (state.navigationStyle == '1' ? '68rpx' : '38rpx') +
            ';'
          "
        >
          <checkbox-group @change="checkboxAllChange" class="check-box">
            <label class="checkbox" for="checkAll">
              <checkbox
                value="all"
                :style="state.calcPromotionsFlag != 0 ? 'pointer-events: none' : ''"
                :checked="state.checkedAll"
                :color="state.themeColor"
              ></checkbox>
              全选
            </label>
          </checkbox-group>
          <view class="calc-info">
            <view>
              合计:
              <!-- <text class="total-price">￥{{allPrice}}</text> -->
              <text class="total-price">￥{{ state.shoppingAllPrice }}</text>
              <text class="delivery-fee" v-if="state.baseFare > 0">
                (另需{{ state.baseFare }}元配送费)
              </text>
            </view>
            <!-- <view class="discount-box" catchtap="doShowMoneyDetail">共减:￥{{discount}} | 明细 </view> -->
            <view class="discount-box" @click.stop="doShowMoneyDetail">
              共减:￥{{ state.shoppingDiscount }} | 明细
            </view>
            <view v-if="state.deliveryRulesText">
              <text :class="state.deliveryRulesText.length > 17 ? 'fz20' : ''">
                {{ state.deliveryRulesText }}
              </text>
            </view>
          </view>
          <text
            class="tocalc"
            :style="'background-color: ' + state.themeColor"
            @click="pretreatmentOrder"
          >
            去结算
          </text>
        </view>
      </view>
      <view
        :class="
          'recommend-block ' +
          (isIphoneX ? 'iphoneX-height' : '') +
          ' ' +
          (state.giftGoodsList.length > 0 ? 'hasGift' : '')
        "
        v-if="state.recommendingNum > 0"
      ></view>
    </view>
    <custom-loading v-if="state.loading || state.calcPromotionLoading"></custom-loading>

    <popup
      v-if="state.show.separateSettlement"
      :show="state.show.separateSettlement"
      position="bottom"
      custom-class="middle"
      @close="separateSettlementChange"
    >
      <view class="money-detail-pop">
        <view class="close-pop" @click="separateSettlementChange">
          <image :src="state.imagesPath.category_close" mode="widthFix"></image>
        </view>
        <view class="pop-title">请分开结算</view>
        <view
          :class="
            'pop-content-data pop-content-data-settele ' + (index == 1 ? 'content-border' : '')
          "
          v-for="(typeItem, index) in state.shoppingType"
          :key="index"
          v-show="state.shoppingData[typeItem] && state.shoppingData[typeItem].selectShow"
        >
          <view class="pop-hd">
            {{ state.shoppingData[typeItem] && state.shoppingData[typeItem].labelName }}
          </view>
          <view class="pop-sum flex-between">
            <view>
              <view>
                共
                {{ state.shoppingData[typeItem] && state.shoppingData[typeItem].goodTotalNum }}
                件商品，小计
                <text>
                  ￥{{ state.shoppingData[typeItem] && state.shoppingData[typeItem].allPrice }}
                </text>
              </view>
              <view class="price-tip">不包含运费、包装费</view>
            </view>
            <view
              @click.stop="handlePlaceOrder"
              class="settle-btn"
              :data-type="typeItem"
              :style="'background-color: ' + state.themeColor"
            >
              去结算
            </view>
          </view>
        </view>
      </view>
    </popup>
    <!-- <view class="content-box" wx:if="{{state.loading}}">
	<view class="spinner">
		<view class="rect1" style="{{state.theme.mainBgColor}}"></view>
		<view class="rect2" style="{{state.theme.mainBgColor}}"></view>
		<view class="rect3" style="{{state.theme.mainBgColor}}"></view>
		<view class="rect4" style="{{state.theme.mainBgColor}}"></view>
		<view class="rect5" style="{{state.theme.mainBgColor}}"></view>
	</view>
</view> -->
    <popup
      v-if="state.show.number"
      :show="state.show.number"
      position="middle"
      custom-class="middle"
      @close="toggleNumberPopup"
    >
      <view class="modal-body">
        <view class="modal-content">
          <view class="title">修改购买数量</view>
          <view class="content">
            <view class="count-box">
              <view
                @click.stop="handleProductNumReduce"
                v-if="state.goodsInfo.status !== 'DELETED' && state.goodsInfo.balance > 0"
              >
                <text>-</text>
              </view>
              <input
                cursor="0"
                selection-start="1"
                selection-end="1"
                :value="state.goodsInfo.productNum"
                @input="bindProductNumInput"
                type="number"
                maxlength="4"
              />
              <view
                @click.stop="handleProductNumAdd"
                v-if="state.goodsInfo.status !== 'DELETED' && state.goodsInfo.balance > 0"
              >
                +
              </view>
            </view>
          </view>
          <view class="button-box">
            <button class="cancel" :data-id="state.goodsInfo.id" @click.stop="onCancel">
              取消
            </button>
            <button
              class="confirm"
              :style="'background: ' + state.themeColor"
              :data-id="state.goodsInfo.id"
              @click.stop="onConfirm"
            >
              确认
            </button>
          </view>
        </view>
      </view>
    </popup>
    <popup
      v-if="state.show.middle"
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      :overlayStyle="state.overlayStyle"
      @close="toggleBottomPopup"
    >
      <view class="popup-content">
        <view class="popup-content-box">
          <image :src="state.imagesPath.speechAssistantStart" mode="widthFix"></image>
          <view>你来说，我来做</view>
          <view>把你最喜欢的带给你</view>
        </view>
      </view>
    </popup>
    <popup
      v-if="state.show.oneMore"
      :show="state.show.oneMore"
      position="middle"
      custom-class="middle"
      @close="toggleOneMorePopup"
    >
      <view class="oneMore-content">
        <view class="oneMore-content-box">
          <view class="oneMore-title">以下商品无法购买</view>
          <view class="oneMore-tips">你可以选购其他商品</view>
          <scroll-view scroll-y="true" class="unsupported-product-box">
            <view
              class="unsupported-product-item"
              v-for="(item, index) in state.unsupportedProductList"
              :key="index"
            >
              <view class="name">{{ item.productName }}</view>
              <view class="number">
                x
                <text>{{ item.quantity }}</text>
              </view>
              <view class="reason">售空</view>
            </view>
          </scroll-view>
          <view class="oneMore-button">
            <view :style="state.theme.mainColor" @click="toggleOneMorePopup">继续选购</view>
          </view>
        </view>
      </view>
    </popup>
    <!-- 开屏推广弹窗 -->
    <welfarePromotion usePage="SHOPPING_CAR"></welfarePromotion>
    <tabbar
      :tabbar="state.tabbar"
      :show="state.showTabbar"
      @popup="recorderPopup"
      v-if="!state.openCustomTabbar"
    ></tabbar>
    <!-- <custom-tab-bar :tabbar="state.tabbar" :show="state.showTabbar" v-if="state.openCustomTabbar"></custom-tab-bar>-->
  </view>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsSubscribeMessageJs from '@/utils/newretail/subscribeMessage'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsLogJs from '@/utils/newretail/log'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _apiNewmbrActivityServiceJs from '@/service/api/newretail/newmbrActivityService'
import _apiRaffleServiceJs from '@/service/api/newretail/raffleService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiPromotionServiceJs from '@/service/api/newretail/promotionService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiActivityServiceJs from '@/service/api/newretail/activityService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import seckillService from '@/service/api/newretail/seckillService'
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue'
import mallRecommend from '@/pages-sub/newretail/components/home-page/mall-recommend2/mall-recommend.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
import welfarePromotion from '@/pages-sub/newretail/components/welfarePromotion/welfarePromotion.vue'
import tabbar from '@/pages-sub/newretail/components/tabbar/tabbar.vue'
const app = getApp()

// pages/shopcart/shopcart.js
const shopcartService = _apiShopcartServiceJs
const activityService = _apiActivityServiceJs
const systemService = _apiSystemServiceJs
const productService = _apiProductServiceJs
const promotionService = _apiPromotionServiceJs
const storeService = _apiStoreServiceJs
const raffleService = _apiRaffleServiceJs
const newmbrActivityService = _apiNewmbrActivityServiceJs
const distributionService = _apiDistributionServiceJs
const memberService = _apiMemberServiceJs
const orderService = _apiOrderServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const log = _utilsLogJs
const selfA = _utilsSelfJs
const subscribeMessage = _utilsSubscribeMessageJs
const ADDRESS = _utilsAddressJs
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
let isAdd = true
let noQuery = false
const state = reactive({
  activeStoreId: '',
  addressName: '',
  calcPromotionLoading: false,
  isOnload: false,
  inInitPage: false,
  shoppingDiscount: 0,
  shoppingCashDiscount: 0,
  shoppingAllPrice: 0,
  refreshType: null,
  navigationStyle: null,
  calcPromotionsFlag: 0,
  navigationBarTitle: '购物车',
  imagesPath: IMGAGESPATH,
  tabbar: {},
  showTabbar: false,
  checkedAll: false,
  allPrice: '0.00',
  discount: 0.0,
  category: [],
  goodsList: [],
  storeName: '人民广场店',
  tabSelected: 0,
  distributionStoreId: uni.getStorageSync('wj_distributionStore')
    ? uni.getStorageSync('wj_distributionStore').id
    : '',
  distributionStoreName: uni.getStorageSync('wj_distributionStore')
    ? uni.getStorageSync('wj_distributionStore').name
    : '',
  nextDayStoreId: uni.getStorageSync('wj_nextDayStore')
    ? uni.getStorageSync('wj_nextDayStore').id
    : '',
  nextDayStoreName: uni.getStorageSync('wj_nextDayStore')
    ? uni.getStorageSync('wj_nextDayStore').name
    : '',
  goodsNum: {
    storeNum: 0,
    distributionNum: 0,
    nextDayNum: 0,
  },
  hasUserInfo: false,
  goodsInfo: {},
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    number: false,
    oneMore: false,
    money: false,
    // 是否显示明细
    separateSettlement: false, // 是否显示分开结算弹窗
  },
  overlayStyle: 'background: rgba(255, 255, 255, 0.9)',
  phone: false,
  systemOptions: {},
  giftGoodsList: [],
  expiredGoodsList: [],
  giveAwayPrice: '',
  // 起送费
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  loading: true,
  theme: themeManager,
  isVIP: false,
  vipGradeConfig: null,
  openCustomTabbar: false,
  productIds: [],
  recommendingNum: 0,
  disStoreDeliveryFeeRules: {},
  storeDeliveryFeeRules: {},
  baseFare: '',
  // 默认配送费
  disStoreBaseFare: '',
  // 默认配送费
  storeBaseFare: '',
  // 默认配送费
  distanceExemptionAmount: 0,
  deliveryRulesText: '',
  hasEasyRecPlugins: false,
  shoppingCartShowType: '',
  // 购物车展示配置 UD 上下展示 LR 左右展示
  shoppingData: {
    // store: {
    //   goodsList: [],
    // },
    // distribution: {
    //   goodsList: []
    // },
    // nextDay: {
    //   goodsList: []
    // }
  },
  // 商品数据
  // shoppingType: ['store'], // 默认只有门店类型，兼容左右结构数据
  shoppingType: [],
  // 默认只有门店类型，兼容左右结构数据
  activeShoppingType: 'store',
  // 当前操作的数据
  goodsNumAll: 0,
  // 判断是否存在数据
  showExpiredGood: false,
  // 是否显示失效商品
  sharePictures: '', // 购物车分享图
})
function changeisExpand() {
  state.showExpiredGood = !state.showExpiredGood
}
function changeAddress() {
  NAVPAGE.toAddressList('?from=index')
}
function getShopCartStyle() {
  const keys = [
    'storeNameAs',
    'distributionNameAs',
    'nextDayNameAs',
    'storeNameSort',
    'distributionNameSort',
    'nextDayNameSort',
    'shoppingCartShowType',
  ]
  systemService.query(keys.join(',')).then((res) => {
    if (res && res.length > 0) {
      // this.data.shoppingData = {
      //   store: {
      //     goodsList: this.data.shoppingData.store.goodsList || [],
      //   },
      //   distribution: {
      //     goodsList: this.data.shoppingData.distribution.goodsList || [],
      //   },
      //   nextDay: {
      //     goodsList: this.data.shoppingData.nextDay.goodsList || [],
      //   }
      // }
      // this.data.shoppingType = ['store']
      const shoppingConfig = {}
      res.forEach((item) => {
        shoppingConfig[item.key] = item.value
        if (item.key == 'shoppingCartShowType') {
          // this.data.shoppingType = ['store', 'distribution', 'nextDay']
          // this.data.shoppingType.forEach(item => {
          //   this.data.shoppingData[item] = {
          //     goodsList: this.data.shoppingData[item].goodsList
          //   }
          // })
          state.shoppingCartShowType = item.value
        }
      })
      // 判断是否是上下结构一起显示
      if (state.shoppingCartShowType == 'UD') {
        // this.data.shoppingType.sort((a,b) => {
        //   return shoppingConfig[a + 'NameSort'] - shoppingConfig[b + 'NameSort']
        // })
        // if(shoppingConfig.distributionNameSort - shoppingConfig.storeNameSort <= 0) {
        //   this.data.shoppingType = ['distribution', 'store']
        // } else {
        //   this.data.shoppingType = ['store', 'distribution', 'nextDay']
        // }
      }
      // let shoppingType = ['store', 'distribution', 'nextDay']
      // shoppingType.forEach(item => {
      //   this.data.shoppingData[item].sort = shoppingConfig[item + 'NameSort']
      //   this.data.shoppingData[item].labelName = shoppingConfig[item + 'NameAs']
      // })
      // this.setData({
      //   shoppingData: this.data.shoppingData,
      //   shoppingType: this.data.shoppingType
      // })
      queryShopcart()
    }
  })
}
function toHome() {
  NAVPAGE.toHome()
}
function clickCategory(e) {
  let shoppingType = 'store'
  if (e.currentTarget.dataset.idx == 1) {
    shoppingType = 'distribution'
  } else if (e.currentTarget.dataset.idx == 2) {
    shoppingType = 'nextDay'
  }
  state.tabSelected = e.currentTarget.dataset.idx
  state.activeShoppingType = shoppingType
  const nextDayStoreName = state.nextDayStoreName
  const distributionStoreName = state.distributionStoreName
  if (e.currentTarget.dataset.idx == 0 || state.shoppingCartShowType == 'UD') {
    if (app.globalData.storeInfo) {
      state.storeName = app.globalData.storeInfo.name
      state.giveAwayPrice = state.storeGiveAwayPrice
      state.baseFare = state.storeBaseFare
    }
  } else if (e.currentTarget.dataset.idx == 2) {
    if (nextDayStoreName) {
      state.storeName = nextDayStoreName
      state.giveAwayPrice = state.nextDayStoreGiveAwayPrice
      state.baseFare = state.nextDayStoreBaseFare
    }
  } else {
    if (distributionStoreName) {
      state.storeName = distributionStoreName
      state.giveAwayPrice = state.disStoreGiveAwayPrice
      state.baseFare = state.disStoreBaseFare
    }
  }
  queryShopcart()
}
function addToCart(e) {
  queryShopcart()
  // this.triggerEvent("addToCart", {
  //   dataset: e.currentTarget.dataset,
  //   context: this,
  //   detail: e.detail
  // });
}
function handleSync(postData) {
  const tempList = []
  let isChecked = false // 当前修改项是否被选中
  console.log(postData)
  const storeId = postData.storeId
  // let tempData = postData.lists[0]
  if (postData.newmbrActivityId) {
    if (postData.count < 0) {
      shopCartSync(postData)
    } else {
      uni.showToast({
        title: '新用户专享只能购买一件哦~',
        icon: 'none',
        duration: 2000,
      })
      isAdd = true
    }
  } else {
    shopCartSync(postData)
  }
  if (postData.grabActivityId) {
  }
  let mode = 'add'
  const shoppingTypeData = state.shoppingData[state.activeShoppingType]
  if (shoppingTypeData && shoppingTypeData.goodsList) {
    for (let i = 0; i < shoppingTypeData.goodsList.length; i++) {
      const item = shoppingTypeData.goodsList[i]
      if (item && item.id === postData.shoppingItemId) {
        if (postData.count > (item.productNum || 0)) {
          mode = 'add'
        } else {
          mode = 'reduce'
        }
        break
      }
    }
  }
  function shopCartSync(postData) {
    shopcartService
      .update(postData)
      .then((res) => {
        util.setHideLoading(true)
        updateLocalShopCart(postData)
        // this.queryShopcart();
        const goodsId = postData.shoppingItemId
        const goodsList = state.shoppingData[state.activeShoppingType].goodsList
        let productId = ''
        let traceId = ''
        goodsList.forEach((item) => {
          if (item.id === goodsId) {
            const num = postData.count
            const tempData = {
              ...item,
              productNum: num,
            }
            isChecked = item.checked
            productId = item.productId
            traceId = item.traceId != null ? item.traceId : ''
            tempList.push(tempData)
          } else {
            tempList.push(item)
          }
        })
        const opts = {
          products: [
            {
              productId,
              traceId,
            },
          ],
        }
        return storeId
      })
      .then((storeId) => {
        shopcartService
          .getCatering(state.activeShoppingType || state.activeStoreId)
          .then((res1) => {
            const res = res1[0]
            console.log(res)
            const supportGoodsList = []
            res.items.forEach((ele, index) => {
              if (ele.status !== 'DELETED') {
                supportGoodsList.push(ele)
              }
            })
            supportGoodsList.forEach((ele, index) => {
              if (ele.id === tempList[index].id) {
                tempList[index].discount = ele.discount
                const produtlabel = []
                const promotionsLabel = []
                let promotionDescription = ''
                if (
                  ele.discounts &&
                  ele.discounts.cashDiscount &&
                  ele.discounts.totalDiscount > 0 &&
                  ele.discounts.cashDiscount.description &&
                  ele.discounts.cashDiscount.description != null &&
                  ele.discounts.cashDiscount.description != 'null'
                ) {
                  promotionDescription =
                    promotionDescription + ele.discounts.cashDiscount.description + ';'
                }
                if (ele.itemLabels && ele.itemLabels.length > 0) {
                  ele.itemLabels.forEach((item) => {
                    if (item && item.type === 'GOODSLABEL' && item.color != null) {
                      produtlabel.push(item)
                    } else if (item && item.type === 'PROMOTIONLABEL') {
                      promotionsLabel.push(item)
                      if (
                        item.labelDetails != null &&
                        promotionDescription.indexOf(item.labelDetails) < 0 &&
                        item.labelDetails !== ','
                      ) {
                        promotionDescription = promotionDescription + item.labelDetails + ';'
                      }
                    }
                  })
                }
                promotionDescription = promotionDescription.substring(
                  0,
                  promotionDescription.length - 1,
                )
                const nameArr = ele.name.split('x')
                let specs = ''
                let name = ele.name
                if (nameArr.length > 0) {
                  nameArr.forEach((item, i) => {
                    if (i === 0) {
                      name = item
                    } else {
                      specs = specs + item + ';'
                    }
                  })
                }
                const goodsPromotions = []
                if (ele.promotions) {
                  // 送商品
                  if (ele.promotions.goodsPromotions && ele.promotions.goodsPromotions.length > 0) {
                    ele.promotions.goodsPromotions.forEach((it) => {
                      if (it.goodsRange && it.goodsRange.length === 1) {
                        // 指定商品送赠品
                        if (ele.productId === it.goodsRange[0]) {
                          goodsPromotions.push(it)
                        }
                      }
                    })
                  }
                }
                tempList[index].goodsPromotions = goodsPromotions
                tempList[index].produtlabel = produtlabel
                tempList[index].promotions = ele.promotions
                tempList[index].promotionDescription = promotionDescription
                tempList[index].promotionsLabel = promotionsLabel
              }
            })
            console.log(tempList)
            state.shoppingData[state.activeShoppingType].goodsList = tempList
            if (state.activeShoppingType === 'store') {
              const goodList = state.shoppingData[state.activeShoppingType].goodsList
              const tempShopCart = {}
              const grabProducts = {}
              const tempShopCartGoodsId = []
              const tempGrabShopCartGoodsId = []
              if (goodList && goodList.length > 0) {
                // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
                goodList.forEach((item) => {
                  if (!item.grabActivityId && !item.newmbrActivityId) {
                    let index = -1
                    for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                      if (item.productId == tempShopCartGoodsId[i]) {
                        index = i
                      }
                    }
                    if (index > -1) {
                      tempShopCart[item.productId] =
                        tempShopCart[item.productId] + (item.productNum || 0)
                    } else {
                      tempShopCart[item.productId] = item.productNum || 0
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
                      grabProducts[item.productId] =
                        grabProducts[item.productId] + (item.productNum || 0)
                    } else {
                      grabProducts[item.productId] = item.productNum || 0
                      tempGrabShopCartGoodsId.push(item.productId)
                    }
                  }
                })
              }
              state.shopCart = tempShopCart
              state.shopCartGoodsId = tempShopCartGoodsId
              state.grabProducts = grabProducts
            }

            return storeId
          })
          .then((storeId) => {
            if (isChecked) {
              queryInverntory(storeId)
            } else {
              isAdd = true
            }
          })
          .catch((err) => {
            if (err.message != 'Access Token没有设置') {
              console.log(err.message)
            }
            isAdd = true
            state.allPrice = '0.00'
          })
      })
      .catch((err) => {
        isAdd = true
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function handlePriceCalc(e) {
  const storeType = e && e.currentTarget.dataset.type
  // let tempList = []
  let checkedNum = 0
  let storeId = ''
  let shoppingTypeItem1 = ''
  const postDataList = []
  let allPrice = 0
  let allDiscount = 0
  state.shoppingType.forEach((shoppingTypeItem) => {
    let tempPrice = 0
    const tempDiscount = 0
    const tempList = []
    // if(storeType && storeType != shoppingTypeItem) return false
    const checkedFlag = state.shoppingData[shoppingTypeItem].goodsList.some((item1) => {
      return item1.checked
    })
    if (checkedFlag) {
      checkedNum += 1
      shoppingTypeItem1 = shoppingTypeItem
      if (isNumber(shoppingTypeItem) || state.shoppingData[shoppingTypeItem].storeId) {
        storeId = shoppingTypeItem
      } else if (shoppingTypeItem == 'store') {
        if (app.globalData.storeInfo) {
          storeId = app.globalData.storeInfo.id
        }
      } else if (shoppingTypeItem == 'nextDay') {
        storeId = state.nextDayStoreId
      } else {
        storeId = state.distributionStoreId
      }
    }
    state.shoppingData[shoppingTypeItem].goodsList.forEach((item) => {
      if (item && item.checked) {
        tempPrice += item.sellPrice * (item.productNum || 0)
        let tempItem = {
          id: item.productId,
          count: item.productNum || 0,
        }
        // 分享人id
        if (item.sharingPersonId) {
          tempItem = {
            ...tempItem,
            sharingPersonId: item.sharingPersonId,
          }
        }
        // if (item.groupProducts && item.groupProducts.length > 0) {
        //   // 套餐商品
        //   let groupIds = []
        //   item.groupProducts.forEach(ele => {
        //     groupIds.push(ele.groupId)
        //   })
        //   tempItem = {
        //     ...tempItem,
        //     groupProductIds: groupIds
        //   }
        // }

        if (item.groupProducts && item.groupProducts.length > 0) {
          tempItem.cateringOrderDetails = item.groupProducts
        }
        if (item.grabActivityId) {
          tempItem = {
            ...tempItem,
            grabActivityId: item.grabActivityId,
          }
        } else if (item.newmbrActivityId) {
          tempItem = {
            ...tempItem,
            newmbrActivityId: item.newmbrActivityId,
          }
        } else {
          if (item.memberPrice && Number(item.memberPrice) == Number(item.sellPrice)) {
            // 使用的会员价
            tempItem = {
              ...tempItem,
              sellPrice: item.memberPrice,
              useMemberPrice: true,
            }
          } else {
            if (item.promotionPrice && Number(item.promotionPrice) <= Number(item.sellPrice)) {
              tempItem = {
                ...tempItem,
                usePromotionPrice: true,
                useMemberPrice: false,
              }
            }
          }
        }
        tempList.push(tempItem)
      }
    })
    if (tempList.length > 0) {
      // let postData = {
      //   products: tempList,
      //   storeId: storeId
      // }
      // this.calcDiscount(postData, tempPrice)
      // that.setData({
      //   allPrice: parseFloat(tempPrice).toFixed(2),
      //   discount: tempDiscount.toFixed(2)
      // })
      // console.log(postData)
      // this.calcPromotions(postData, tempPrice, shoppingTypeItem)
    } else {
      state.shoppingData[shoppingTypeItem].allPrice = tempPrice.toFixed(2)
      state.shoppingData[shoppingTypeItem].discount = tempDiscount.toFixed(2)
      // that.checkDeliveryFeeRulesDisplay();
      state.giftGoodsList = []
      if (state.loading) {
        state.loading = false
      }
      isAdd = true
      getPrice()
    }
    const shoppingTypeItemData = {
      storeId,
      products: tempList,
    }
    allPrice += parseFloat(tempPrice)
    allDiscount += parseFloat(tempDiscount)
    if (tempPrice) {
      postDataList.push(shoppingTypeItemData)
    }
  })
  if (postDataList.length > 0) {
    // let postData = {
    //   products: tempList,
    //   storeId: checkedNum > 1 ? app.globalData.storeInfo.id : storeId
    // }
    // if(checkedNum > 1) {
    //   postData.type = 'MIXED'
    // }
    // this.calcDiscount(postData, tempPrice)
    // that.setData({
    //   allPrice: parseFloat(tempPrice).toFixed(2),
    //   discount: tempDiscount.toFixed(2)
    // })
    calcPromotions(postDataList, allPrice, checkedNum > 1 ? null : shoppingTypeItem1)
  } else {
    state.shoppingDiscount = 0
    state.shoppingCashDiscount = {}
    state.shoppingAllPrice = 0
  }
  // if (this.data.tabSelected == 0) {
  //   if (app.globalData.storeInfo) {
  //     storeId = app.globalData.storeInfo.id
  //   }
  // } else {
  //   storeId = that.data.distributionStoreId
  // }
}
function handleReduce(e) {
  if (isAdd) {
    isAdd = false
    const storeType = e && e.currentTarget.dataset.type
    state.activeShoppingType = storeType
    const tempData = state.shoppingData[storeType].goodsList
    const tempLists = []
    let productNum = 0
    let currentItem = null
    tempData.forEach((item) => {
      if (item.id === e.currentTarget.dataset.id) {
        currentItem = item
      }
    })
    if (currentItem) {
      if (currentItem.grabActivityId) {
        tempLists.push({
          count: currentItem.productNum - 1,
          shoppingItemId: currentItem.id,
          grabActivityId: currentItem.grabActivityId,
          sharingPersonId: currentItem.sharingPersonId ? currentItem.sharingPersonId : null,
        })
      } else {
        tempLists.push({
          count: currentItem.productNum - 1,
          shoppingItemId: currentItem.id,
          sharingPersonId: currentItem.sharingPersonId ? currentItem.sharingPersonId : null,
        })
      }
      productNum = currentItem.productNum
    } else {
      isAdd = true
    }
    if (
      productNum > 1 &&
      (!currentItem.minQty || productNum > currentItem.minQty) &&
      (!currentItem.initialPurchaseNumber || productNum > currentItem.initialPurchaseNumber)
    ) {
      // let tabSelected = storeType =='store' ? 0 : 1
      let storeId = ''
      if (storeType == 'nextDay' || storeType == state.nextDayStoreId) {
        storeId = state.nextDayStoreId
      } else if (storeType == 'distribution' || storeType == state.distributionStoreId) {
        storeId = state.distributionStoreId
      } else {
        storeId = isNumber(storeType)
          ? storeType
          : state.shoppingData[storeType].storeId || app.globalData.storeInfo.id
      }
      const postData = {
        storeId,
        ...tempLists[0],
      }
      handleSync(postData)
    } else {
      if (currentItem.initialPurchaseNumber && productNum <= currentItem.initialPurchaseNumber) {
        uni.showToast({
          title: '最少购买' + currentItem.initialPurchaseNumber + '件',
          icon: 'none',
          duration: 2000,
        })
      } else if (currentItem.minQty && productNum <= currentItem.minQty) {
        uni.showToast({
          title: '最少购买' + currentItem.minQty + '件',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '该商品不能再减少了哦~',
          icon: 'none',
          duration: 2000,
        })
      }
      isAdd = true
    }
  }
}
function handleAdd(e) {
  if (isAdd) {
    isAdd = false
    const storeType = e && e.currentTarget.dataset.type
    state.activeShoppingType = storeType
    const tempData = state.shoppingData[storeType].goodsList
    const tempLists = []
    const limitNum = 999
    let currentItem = null
    tempData.forEach((item) => {
      if (item.id === e.currentTarget.dataset.id) {
        currentItem = item
      }
    })
    if (currentItem) {
      if (currentItem.balance == null) {
        console.log('未查到库存', currentItem)
        isAdd = true
        return
      }
      if (Number(currentItem.productNum) < limitNum) {
        if (Number(currentItem.productNum) < currentItem.balance) {
          if (currentItem.orderCount) {
            if (Number(currentItem.productNum) >= currentItem.orderCount) {
              uni.showToast({
                title: '亲，' + currentItem.name + '每单限购' + currentItem.orderCount + '个哦~',
                icon: 'none',
                duration: 2000,
              })
              isAdd = true
            } else {
              let tempData = {
                count: Number(currentItem.productNum) + 1,
                shoppingItemId: currentItem.id,
                sharingPersonId: currentItem.sharingPersonId ? currentItem.sharingPersonId : null,
              }
              if (currentItem.newmbrActivityId) {
                tempData = {
                  ...tempData,
                  newmbrActivityId: currentItem.newmbrActivityId,
                }
              }
              if (currentItem.grabActivityId) {
                tempData = {
                  ...tempData,
                  grabActivityId: currentItem.grabActivityId,
                }
              }
              tempLists.push(tempData)
            }
          } else {
            let tempData = {
              count: Number(currentItem.productNum) + 1,
              shoppingItemId: currentItem.id,
              sharingPersonId: currentItem.sharingPersonId ? currentItem.sharingPersonId : null,
            }
            if (currentItem.newmbrActivityId) {
              tempData = {
                ...tempData,
                newmbrActivityId: currentItem.newmbrActivityId,
              }
            }
            if (currentItem.grabActivityId) {
              tempData = {
                ...tempData,
                grabActivityId: currentItem.grabActivityId,
              }
            }
            tempLists.push(tempData)
          }
        } else {
          console.log(currentItem.productNum, currentItem.balance, Number(currentItem.productNum))
          uni.showToast({
            title: '我们只有这么多了~',
            icon: 'none',
            duration: 2000,
          })
          isAdd = true
        }
      } else {
        uni.showToast({
          title: '我们只有这么多了~',
          icon: 'none',
          duration: 2000,
        })
        isAdd = true
      }
    } else {
      isAdd = true
    }
    if (tempLists.length > 0) {
      let storeId = ''
      // let tabSelected = storeType =='store' ? 0 : 1
      // if (tabSelected == 0) {
      //   storeId = app.globalData.storeInfo.id
      // } else {
      //   storeId = this.data.distributionStoreId
      // }
      if (storeType == 'nextDay' || storeType == state.nextDayStoreId) {
        storeId = state.nextDayStoreId
      } else if (storeType == 'distribution' || storeType == state.distributionStoreId) {
        storeId = state.distributionStoreId
      } else {
        storeId = isNumber(storeType)
          ? storeType
          : state.shoppingData[storeType].storeId || app.globalData.storeInfo.id
      }
      const postData = {
        storeId,
        ...tempLists[0],
      }
      handleSync(postData)
    } else {
      isAdd = true
    }
  }
}
function handleNumber(e) {
  const storeType = e && e.currentTarget.dataset.type
  state.activeShoppingType = storeType
  const tempData = state.shoppingData[storeType].goodsList
  let _data = null
  tempData.some((item) => {
    if (item.id === e.currentTarget.dataset.id) {
      _data = {
        ...item,
      }
      console.log(_data)
      if (_data) {
        state.goodsInfo = {
          ..._data,
          focus: true,
        }
        toggleNumberPopup()
      }
    }
    return item.id === e.currentTarget.dataset.id
  })
}
function handleProductNumAdd() {
  const goodsInfo = state.goodsInfo
  let num = goodsInfo.productNum
  const limitNum = 999
  if (num < limitNum) {
    if (num < goodsInfo.balance) {
      if (goodsInfo.secKillInfo) {
        if (num >= goodsInfo.secKillInfo.limitCount) {
          uni.showToast({
            title:
              '亲，' +
              goodsInfo.name +
              '只可以秒杀' +
              goodsInfo.secKillInfo.limitCount +
              '个，不可以贪心哦~',
            icon: 'none',
            duration: 2000,
          })
        } else {
          num++
          state.goodsInfo = {
            ...goodsInfo,
            productNum: num,
          }
        }
      } else {
        if (goodsInfo.orderCount) {
          if (num >= goodsInfo.orderCount) {
            uni.showToast({
              title: '亲，' + goodsInfo.name + '每单限购' + goodsInfo.orderCount + '个哦~',
              icon: 'none',
              duration: 2000,
            })
          } else {
            num++
            state.goodsInfo = {
              ...goodsInfo,
              productNum: num,
            }
          }
        } else {
          num++
          state.goodsInfo = {
            ...goodsInfo,
            productNum: num,
          }
        }
      }
    } else {
      uni.showToast({
        title: '我们只有这么多了~',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    uni.showToast({
      title: '已经达到最大了哦~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function handleProductNumReduce() {
  const goodsInfo = state.goodsInfo
  let num = goodsInfo.productNum
  const minQty = goodsInfo.minQty
  const initialPurchaseNumber = goodsInfo.initialPurchaseNumber
  if (
    num > 1 &&
    (!minQty || num > minQty) &&
    (!initialPurchaseNumber || num > initialPurchaseNumber)
  ) {
    num--
    console.log(num)
    state.goodsInfo = {
      ...goodsInfo,
      productNum: num,
    }
  } else {
    if (initialPurchaseNumber && num <= initialPurchaseNumber) {
      uni.showToast({
        title: '最少购买' + initialPurchaseNumber + '件',
        icon: 'none',
        duration: 2000,
      })
    } else if (minQty && num <= minQty) {
      uni.showToast({
        title: '最少购买' + minQty + '件',
        icon: 'none',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: '不能再小了哦~',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function onCancel(e) {
  const tempData = state.shoppingData[state.activeShoppingType].goodsList
  tempData.forEach((item) => {
    if (item.id === e.currentTarget.dataset.id) {
      state.goodsInfo = item
    }
  })
  toggleNumberPopup()
}
function onConfirm(e) {
  const tempData = state.shoppingData[state.activeShoppingType].goodsList
  let oldGoodsInfo = null
  const nowGoodsInfo = state.goodsInfo
  const tempLists = []
  const minQty = nowGoodsInfo.minQty
  const initialPurchaseNumber = nowGoodsInfo.initialPurchaseNumber
  if (initialPurchaseNumber && nowGoodsInfo.productNum < initialPurchaseNumber) {
    nowGoodsInfo.productNum = initialPurchaseNumber
    state.goodsInfo = nowGoodsInfo
    uni.showToast({
      title: '最少购买' + initialPurchaseNumber + '件',
      icon: 'none',
      duration: 2000,
    })
    return
  } else if (minQty && nowGoodsInfo.productNum < minQty) {
    nowGoodsInfo.productNum = minQty
    state.goodsInfo = nowGoodsInfo
    uni.showToast({
      title: '最少购买' + minQty + '件',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  tempData.forEach((item) => {
    if (item.id === e.currentTarget.dataset.id) {
      oldGoodsInfo = item
    }
  })
  const num = nowGoodsInfo.productNum
  // 判断数量中的异常情况
  const limitNum = 999
  if (num == null || num === '') {
    // 不同步数量
    util.showToast('请输入要修改的数量~')
    return
  } else if (num > 0) {
    if (num <= nowGoodsInfo.balance) {
      if (nowGoodsInfo.secKillInfo) {
        if (num >= nowGoodsInfo.secKillInfo.limitCount) {
          util.showToast(
            '亲，' +
              nowGoodsInfo.name +
              '只可以秒杀' +
              nowGoodsInfo.secKillInfo.limitCount +
              '个，不可以贪心哦~',
          )
          state.goodsInfo = {
            ...nowGoodsInfo,
            productNum: nowGoodsInfo.secKillInfo.limitCount,
          }
          return
        }
      } else {
        if (nowGoodsInfo.orderCount) {
          if (num >= nowGoodsInfo.orderCount) {
            util.showToast(
              '亲，' + nowGoodsInfo.name + '每单限购' + nowGoodsInfo.orderCount + '个哦~',
            )
            state.goodsInfo = {
              ...nowGoodsInfo,
              productNum: nowGoodsInfo.orderCount,
            }
            return
          }
        }
      }
    } else {
      state.goodsInfo = {
        ...nowGoodsInfo,
        productNum: nowGoodsInfo.balance,
      }
      util.showToast('我们只有这么多了~')
      return
    }
  } else {
    if (num > 0) {
      state.goodsInfo = {
        ...nowGoodsInfo,
        productNum: limitNum,
      }
      util.showToast('已经达到最大限购数量了哦~')
      return
    } else {
      state.goodsInfo = {
        ...nowGoodsInfo,
        productNum: 1,
      }
      util.showToast('该商品数量不能再小了哦~')
      return
    }
  }
  let tempGoodsData = {
    count: num,
    shoppingItemId: nowGoodsInfo.id,
    sharingPersonId: nowGoodsInfo.sharingPersonId ? nowGoodsInfo.sharingPersonId : null,
  }
  if (nowGoodsInfo.newmbrActivityId) {
    tempGoodsData = {
      ...tempGoodsData,
      newmbrActivityId: nowGoodsInfo.newmbrActivityId,
    }
  }
  if (nowGoodsInfo.grabActivityId) {
    tempGoodsData = {
      ...tempGoodsData,
      grabActivityId: nowGoodsInfo.grabActivityId,
    }
  }
  tempLists.push(tempGoodsData)
  if (tempLists.length > 0) {
    let storeId = ''
    // let tabSelected = this.data.activeShoppingType == 'store' ? 0 : 1
    // if (tabSelected == 0) {
    //   storeId = app.globalData.storeInfo.id
    // } else {
    //   storeId = this.data.distributionStoreId
    // }
    if (state.activeShoppingType == 'nextDay' || state.activeShoppingType == state.nextDayStoreId) {
      storeId = state.nextDayStoreId
    } else if (
      state.activeShoppingType == 'distribution' ||
      state.activeShoppingType == state.distributionStoreId
    ) {
      storeId = state.distributionStoreId
    } else {
      storeId = isNumber(state.activeShoppingType)
        ? state.activeShoppingType
        : state.shoppingData[state.activeShoppingType].storeId || app.globalData.storeInfo.id
    }

    const postData = {
      storeId,
      ...tempGoodsData,
    }
    console.log(postData)
    handleSync(postData)
  }
  toggleNumberPopup()
}
function bindProductNumInput(e) {
  const goodsInfo = state.goodsInfo
  const productNum = e.detail.value
  state.goodsInfo = {
    ...goodsInfo,
    productNum,
  }
}
function doShowMoneyDetail() {
  if (!state.show.money) {
    getGoodDetailData()
  }
  toggle('money')
}
function getGoodDetailData() {
  state.shoppingType.forEach((typeItem) => {
    let sellPrice = 0
    let selectShow = false
    let goodTotalNum = 0
    state.shoppingData[typeItem].goodsList.forEach((item) => {
      let goodAllPrice = 0
      if (item) {
        goodAllPrice =
          item.sellPrice && item.productNum
            ? parseFloat(parseFloat(item.sellPrice * (item.productNum || 0)).toFixed(2))
            : 0
        goodTotalNum += item.productNum ? parseFloat(item.productNum || 0) : 0
      }
      sellPrice += item.checked ? goodAllPrice : 0
      if (!selectShow) {
        selectShow = item.checked
      }
    })
    state.shoppingData[typeItem].sellPrice = sellPrice.toFixed(2)
    state.shoppingData[typeItem].selectShow = selectShow
    state.shoppingData[typeItem].goodTotalNum = goodTotalNum
  })
}
function checkboxChange(e) {
  if (state.calcPromotionsFlag != 0) {
    return false
  }
  const storeType = e.currentTarget.dataset.type
  const num = state.shoppingData[storeType].goodsList.length || 0
  if (e.detail.value.length === num) {
    state.shoppingData[storeType].checkedAll = true
  } else {
    state.shoppingData[storeType].checkedAll = false
    state.giftGoodsList = []
  }
  const tempData = state.shoppingData[storeType].goodsList
  tempData.forEach((ele) => {
    ele.checked = false
  })
  e.detail.value.forEach((item) => {
    tempData.forEach((ele) => {
      if (item === ele.id) {
        ele.checked = true
      }
    })
  })
  let checkedAll = true
  state.shoppingType.forEach((shoppingTypeItem) => {
    if (
      !state.shoppingData[shoppingTypeItem].checkedAll &&
      state.shoppingData[shoppingTypeItem].goodsList &&
      state.shoppingData[shoppingTypeItem].goodsList.length > 0
    ) {
      checkedAll = false
    }
  })
  state.shoppingData[storeType].goodsList = tempData

  state.checkedAll = checkedAll
  handlePriceCalc()
}
function expiredBoxChange(e) {
  console.log(e)
  const tempData = state.expiredGoodsList
  tempData.forEach((ele) => {
    ele.checked = true
  })
  e.detail.value.forEach((item) => {
    tempData.forEach((ele) => {
      if (item === ele.id) {
        ele.checked = true
      }
    })
  })
  state.expiredGoodsList = tempData
}
function checkboxAllChange(e) {
  if (state.calcPromotionsFlag != 0) {
    return false
  }
  const storeType = e && e.currentTarget.dataset.type
  if (storeType) {
    state.shoppingData[storeType].checkedAll = !state.shoppingData[storeType].checkedAll
  } else {
    state.checkedAll = !state.checkedAll
  }
  let checkedAll = true
  state.shoppingType.forEach((shoppingTypeItem) => {
    if (
      !state.shoppingData[shoppingTypeItem].checkedAll &&
      storeType &&
      state.shoppingData[shoppingTypeItem].goodsList &&
      state.shoppingData[shoppingTypeItem].goodsList.length > 0
    ) {
      checkedAll = false
    }
    if (!storeType) {
      checkedAll = state.checkedAll
      state.shoppingData[shoppingTypeItem].checkedAll = checkedAll
    }
    if (!storeType || shoppingTypeItem == storeType) {
      const tempData = state.shoppingData[shoppingTypeItem].goodsList
      tempData.forEach((item, index) => {
        if (item.status === 'DELETED' || item.balance === 0) {
          item.checked = false
        } else {
          item.checked = !storeType ? checkedAll : state.shoppingData[shoppingTypeItem].checkedAll
        }
      })
      state.shoppingData[shoppingTypeItem].goodsList = tempData

      state.checkedAll = checkedAll
    }
  })
  handlePriceCalc(e)
}
function calcDiscount(postData, allPrice) {
  let tempAllPrice = allPrice
  shopcartService
    .calcDiscount(postData)
    .then((res) => {
      console.log(res)
      if (res) {
        tempAllPrice = parseFloat(allPrice - res.discount).toFixed(2)
        state.allPrice = tempAllPrice
        state.discount = res.discount
      } else {
        state.allPrice = tempAllPrice.toFixed(2)
        state.discount = 0
      }
    })
    .catch((e) => {
      state.allPrice = tempAllPrice.toFixed(2)
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
async function calcPromotions(postData, allPrice, storeType) {
  state.calcPromotionsFlag = state.calcPromotionsFlag + 1
  const keys = Object.keys(state.shoppingData)
  let tempAllPrice = parseFloat(allPrice).toFixed(2)
  // wx.showLoading({})
  state.calcPromotionLoading = true
  await promotionService
    .bathCalcPromotions(postData)
    .then((res) => {
      let allPrice1 = 0
      let totalDiscount = 0
      res.forEach((item) => {
        let goods = []
        if (!storeType) {
          keys.forEach((key) => {
            if (item.storeId == key) {
              state.shoppingData[key].goodsList.forEach((good) => {
                goods.push({
                  ...good,
                  // goodType: key,
                  goodsPromotions: [],
                })
              })
            }
          })
        } else {
          goods = state.shoppingData[storeType].goodsList
          goods.forEach((good) => {
            good.goodsPromotions = []
          })
        }
        getPromotionsResult(item, goods)
      })
      function getPromotionsResult(res, goods) {
        console.log(goods, 'tempGoodsListtempGoodsList')
        const giftGoods = []
        if (
          res &&
          res.promotions &&
          res.promotions.goodsPromotions &&
          res.promotions.goodsPromotions.length > 0
        ) {
          // 有促销且促销中有送商品促销
          res.promotions.goodsPromotions.forEach((it) => {
            if (it.goodsRange && it.goodsRange.length === 1) {
              // 指定商品送赠品
              const goodsPromotions = []
              for (let i = 0; i < goods.length; i++) {
                const ele = goods[i]
                if (ele.productId === it.goodsRange[0]) {
                  // goodsPromotions.push(it)
                  // goods[i].goodsPromotions = goodsPromotions;
                  goods[i].goodsPromotions.push(it)
                  break
                }
              }
            } else if (it.goodsRange && (it.goodsRange.length === 0 || it.goodsRange.length > 1)) {
              giftGoods.push(it)
            } else {
              giftGoods.push(it)
            }
          })
        }
        tempAllPrice = parseFloat(tempAllPrice - res.discounts.totalDiscount).toFixed(2)
        if (!storeType) {
          // keys.forEach(key => {
          const goodsList = []
          let tempPrice = 0
          goods.forEach((good) => {
            // if(good.goodType == key) {
            if (good.checked) {
              tempPrice += good.sellPrice * good.productNum
            }
            goodsList.push(good)
            // }
          })
          state.shoppingData[res.storeId].goodsList = goodsList
          state.shoppingData[res.storeId].allPrice = tempPrice
          allPrice1 += parseFloat(tempPrice || 0)
          state.shoppingData[res.storeId].discount = 0
          state.shoppingData[res.storeId].cashDiscount = 0
          // })
          allPrice1 -= res.discounts.totalDiscount || 0
        } else {
          state.shoppingData[res.storeId].goodsList = goods
          state.shoppingData[res.storeId].allPrice = tempAllPrice
          allPrice1 += parseFloat(tempAllPrice || 0)
          state.shoppingData[res.storeId].discount = res.discounts.totalDiscount
          state.shoppingData[res.storeId].cashDiscount = res.discounts.cashDiscount || {}
        }
        totalDiscount += parseFloat(res.discounts.totalDiscount)

        state.giftGoodsList = giftGoods
        state.shoppingDiscount = totalDiscount.toFixed(2)
        state.shoppingCashDiscount = res.discounts.cashDiscount || {}
        state.shoppingAllPrice = parseFloat(allPrice1).toFixed(2)
      }
      getPrice()
      // that.checkDeliveryFeeRulesDisplay();
      isAdd = true
      state.calcPromotionsFlag = state.calcPromotionsFlag - 1
      state.calcPromotionLoading = false
      if (state.loading) {
        state.loading = false
      }
      uni.hideLoading()
    })
    .catch((e) => {
      uni.hideLoading()
      state.calcPromotionLoading = false
      state.calcPromotionsFlag = state.calcPromotionsFlag - 1
      isAdd = true
      const allPrice1 = 0
      // if(!storeType) {
      //   keys.forEach(key => {
      //     let tempPrice = 0;
      //     goods.forEach(good => {
      //       if(good.goodType == key) {
      //         tempPrice += good.sellPrice * good.productNum
      //       }
      //     })
      //     that.data.shoppingData[key].allPrice = tempPrice
      //     allPrice1 += parseFloat(tempPrice || 0);
      //   })
      // } else {
      //   that.data.shoppingData[storeType].allPrice = parseFloat(tempAllPrice).toFixed(2)
      // }
      // that.checkDeliveryFeeRulesDisplay();

      state.shoppingAllPrice = parseFloat(allPrice1).toFixed(2)
      state.allPrice = parseFloat(tempAllPrice).toFixed(2)
      if (state.loading) {
        state.loading = false
      }
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getPrice() {
  let allPrice = 0
  let discount = 0
  state.shoppingType.forEach((storeTypeItem) => {
    allPrice += state.shoppingData[storeTypeItem].allPrice
      ? parseFloat(state.shoppingData[storeTypeItem].allPrice)
      : 0
    discount += state.shoppingData[storeTypeItem].discount
      ? parseFloat(state.shoppingData[storeTypeItem].discount)
      : 0
  })
  state.allPrice = allPrice.toFixed(2)
  state.discount = discount.toFixed(2)
}
async function queryShopcart() {
  const tabSelected = state.tabSelected
  const loginStatus = checkAuth()
  let allPrice = 0
  let checkedAll = true
  const expiredGoodsList = []
  async function getShopCartData() {
    await shopcartService
      .getCatering(state.activeStoreId)
      .then((res) => {
        console.log('获取购物车数据=====')
        console.log(res)
        state.shoppingType = []
        if (res && res.length > 0) {
          res.forEach((res1) => {
            state.shoppingType.push(res1.storeId)
            getShopCartData(res1, res1.storeId)
          })

          queryInverntory()
        }
        function getShopCartData(res, storeType) {
          if (state.shoppingData[storeType]) {
            // that.data.shoppingData[res.storeId].goodsList = []
          } else {
            state.shoppingData[storeType] = {
              goodsList: [],
            }
          }
          if (isNumber(storeType)) {
            state.shoppingData[storeType].storeId = storeType
          }
          state.shoppingData[storeType].storeName = res.storeName
          const tempItems = []
          const oldGoodsList = state.shoppingData[storeType].goodsList
          setLocalShopCart(res)
          if (!util.isHideLoading()) {
            util.setHideLoading(true)
          }
          let checkedCount = 0
          // let expiredGoodsList = []
          const productIds = []
          res.items.forEach((ele, index) => {
            productIds.push({
              productId: ele.productId,
              buyAmount: ele.productNum,
            })
            // 提取失效商品
            if (ele.status === 'DELETED') {
              expiredGoodsList.push({
                ...ele,
                checked: true,
              })
            }
            const produtlabel = []
            const promotionsLabel = []
            let promotionDescription = ''
            if (
              ele.discounts &&
              ele.discounts.cashDiscount &&
              ele.discounts.totalDiscount > 0 &&
              ele.discounts.cashDiscount.description &&
              ele.discounts.cashDiscount.description != null &&
              ele.discounts.cashDiscount.description != 'null'
            ) {
              promotionDescription =
                promotionDescription + ele.discounts.cashDiscount.description + ';'
            }
            if (ele.itemLabels && ele.itemLabels.length > 0) {
              ele.itemLabels.forEach((item) => {
                if (item && item.type === 'GOODSLABEL' && item.color != null) {
                  produtlabel.push(item)
                } else if (item && item.type === 'PROMOTIONLABEL') {
                  promotionsLabel.push(item)
                  if (
                    item.labelDetails != null &&
                    promotionDescription.indexOf(item.labelDetails) < 0 &&
                    item.labelDetails !== ','
                  ) {
                    promotionDescription = promotionDescription + item.labelDetails + ';'
                  }
                }
              })
            }
            promotionDescription = promotionDescription.substring(
              0,
              promotionDescription.length - 1,
            )
            const nameArr = ele.name.split('x')
            let specs = ''
            let name = ele.name
            if (nameArr.length > 0) {
              nameArr.forEach((item, i) => {
                if (i === 0) {
                  name = item
                } else {
                  specs = specs + item + ';'
                }
              })
            }
            const goodsPromotions = []
            if (ele.promotions) {
              // 送商品
              if (ele.promotions.goodsPromotions && ele.promotions.goodsPromotions.length > 0) {
                ele.promotions.goodsPromotions.forEach((it) => {
                  if (it.goodsRange && it.goodsRange.length === 1) {
                    // 指定商品送赠品
                    if (ele.productId === it.goodsRange[0]) {
                      goodsPromotions.push(it)
                    }
                  }
                })
              }
            }
            ele = {
              ...ele,
              name,
              specs,
              goodsPromotions,
              produtlabel,
              promotionsLabel,
              promotionDescription,
              sellPrice: ele.sellPrice || ele.originalPrice,
              balance: ele.storeBalance || 0,
              deliveryTimeStatement: ele.deliveryTimeStatement || '',
            }
            const requiredList = uni.getStorageSync('requireProductIds')
              ? JSON.parse(uni.getStorageSync('requireProductIds'))
              : []
            if (requiredList && requiredList.length > 0) {
              requiredList.some((id) => {
                if (id === ele.productId) {
                  ele.require = 1
                }
                return id === ele.productId
              })
            }
            if (ele.newmbrActivityId) {
              ele.sellPrice = ele.newmbrPrice
            }
            // 秒杀
            if (ele.grabActivityId) {
              ele.sellPrice = ele.grabPrice
            } else {
              if (ele.memberPrice && Number(ele.memberPrice) < Number(ele.sellPrice)) {
                ele.sellPrice = ele.memberPrice
              }
              if (ele.promotionPrice && Number(ele.promotionPrice) < Number(ele.sellPrice)) {
                ele.sellPrice = ele.promotionPrice
              }
            }
            if (ele.groupProducts.length > 0) {
              ele = {
                ...ele,
                description: ele.mealDetails,
              }
            }
            if (ele.description) {
              ele.description = ele.description.replace(/\n/g, ' ')
            }
            if (ele.status !== 'DELETED') {
              tempItems.push({
                ...ele,
                checked: ele.storeBalance !== 0,
              })
              checkedCount++
            }
          })
          // res.items.splice(index,1)
          state.expiredGoodsList = expiredGoodsList
          state.productIds = productIds
          console.log('失效商品')
          console.log(state.expiredGoodsList)
          if (
            oldGoodsList.length > 0 &&
            tempItems.length > 0 &&
            oldGoodsList.length === tempItems.length
          ) {
            checkedCount = 0
            oldGoodsList.forEach((item, index) => {
              if (item.productId === tempItems[index].productId) {
                if (item.status === 'DELETED') {
                  // 处理切换门店商品库存不足等情况
                  tempItems.splice(index, 1)
                } else {
                  tempItems[index] = {
                    ...tempItems[index],
                    checked: item.checked,
                  }
                  if (item.checked) {
                    checkedCount++
                  }
                }
              }
            })
          }
          let expiredGoodNum = 0
          if (
            expiredGoodsList &&
            expiredGoodsList.length > 0 &&
            tempItems &&
            tempItems.length > 0
          ) {
            expiredGoodsList.forEach((expiredGood) => {
              const flag = tempItems.some((tempGood) => {
                return expiredGood.productId === tempGood.productId
              })
              if (flag) {
                expiredGoodNum += 1
              }
            })
          }
          if (checkedCount === tempItems.length - expiredGoodNum) {
            state.shoppingData[storeType].goodsList = tempItems
            state.shoppingData[storeType].checkedAll = true
            // that.data.shoppingData[storeType].goodsNum = tempItems.length || that.data.shoppingData[storeType].goodsNum
            allPrice += res.allPrice
            state.checkedAll = checkedAll
            state.allPrice = allPrice.toFixed(2)

            state.goodsNumAll =
              state.shoppingCartShowType == 'UD'
                ? tempItems.length || state.goodsNumAll
                : tempItems.length
            if (tempItems.length === 0 && state.shoppingCartShowType != 'UD') {
              state.shoppingData[storeType].checkedAll = false
              checkedAll = false

              state.checkedAll = checkedAll
            }
          } else {
            state.shoppingData[storeType].goodsList = tempItems
            // that.data.shoppingData[storeType].goodsNum = tempItems.length || that.data.shoppingData[storeType].goodsNum
            state.shoppingData[storeType].checkedAll = false
            checkedAll = false
            state.checkedAll = false

            state.goodsNumAll =
              state.shoppingCartShowType == 'UD'
                ? tempItems.length || state.goodsNumAll
                : tempItems.length
            if (checkedCount !== 0) {
              // 购物车商品有选中的才会显示价格
              state.allPrice = res.allPrice.toFixed(2)
            }
          }
          console.log(state.shoppingData[storeType].goodsList.length, 'adfjsdkfsjd')
          // if(that.data.activeShoppingType === 'store') {
          //   let goodList = that.data.shoppingData[that.data.activeShoppingType].goodsList
          //   let tempShopCart = {}
          //   let grabProducts = {}
          //   let tempShopCartGoodsId = []
          //   let tempGrabShopCartGoodsId = []
          //   if (goodList && goodList.length > 0) {
          //     // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
          //     goodList.forEach(item => {
          //       if (!item.grabActivityId && !item.newmbrActivityId) {
          //         let index = -1
          //         for (let i = 0; i < tempShopCartGoodsId.length; i++) {
          //           if (item.productId == tempShopCartGoodsId[i]) {
          //             index = i;
          //           }
          //         }
          //         if (index > -1) {
          //           tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum
          //         } else {
          //           tempShopCart[item.productId] = item.productNum
          //           tempShopCartGoodsId.push(item.productId)
          //         }
          //       } else if (item.grabActivityId) {
          //         let index = -1
          //         for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
          //           if (item.productId == tempGrabShopCartGoodsId[i]) {
          //             index = i;
          //           }
          //         }
          //         if (index > -1) {
          //           grabProducts[item.productId] = grabProducts[item.productId] + item.productNum
          //         } else {
          //           grabProducts[item.productId] = item.productNum
          //           tempGrabShopCartGoodsId.push(item.productId)
          //         }
          //       }
          //     })
          //   }
          //   that.setData({
          //     shopCart: tempShopCart,
          //     shopCartGoodsId: tempShopCartGoodsId,
          //     grabProducts: grabProducts
          //   })
          // }
          console.log('======goodsList======')
        }
      })
      .catch((err) => {
        // that.checkDeliveryFeeRulesDisplay();
        if (state.loading) {
          state.loading = false
        }
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
        // that.data.shoppingData[storeType].goodsList = tempItems
        checkedAll = false
        state.checkedAll = false
        state.allPrice = '0.00'
      })
  }
  getShopCartData()
  // if(that.data.shoppingCartShowType == 'UD') {
  //   console.log(this.data.shoppingType, 'this.data.shoppingType', that.data.nextDayStoreId)
  //   this.data.shoppingType.forEach(async item => {
  //     if (app.globalData.storeInfo && item == 'store') {
  //       await getShopCartData(app.globalData.storeInfo.id, 'store')
  //     } else if(item == 'distribution') {
  //       await getShopCartData(that.data.distributionStoreId, 'distribution')
  //     } else if(item == 'nextDay') {
  //       await getShopCartData(that.data.nextDayStoreId, 'nextDay')
  //     }
  //   })
  // } else {
  //   if (tabSelected == 0) {
  //     if (app.globalData.storeInfo) {
  //       getShopCartData(app.globalData.storeInfo.id, 'store')
  //     } else {
  //       getShopCartData()
  //     }
  //   } else if(tabSelected == 1){
  //     getShopCartData(that.data.distributionStoreId, 'distribution')
  //   } else if(tabSelected == 2){
  //     getShopCartData(that.data.nextDayStoreId, 'nextDay')
  //   }
  // }
}
function queryAllShopcart(storeId) {
  const number = shopcartService
    .getStoreProductsCount(storeId)
    .then((res) => {
      let num = 0
      if (res && res.length > 0) {
        num = res[0].quantity
      }
      return num
    })
    .catch((err) => {
      util.handleLoginStatus(err)
    })
  return number
}
function queryShopCartNum() {
  if (!state.systemOptions.isDeliveryProduct) {
    return
  }
  const storeNum = 0
  const distributionNum = 0
  const nextDayNum = 0
  // if (app.globalData.storeInfo) {
  //   storeNum = this.queryAllShopcart(app.globalData.storeInfo.id)
  // }
  // if (that.data.distributionStoreId) {
  //   distributionNum = this.queryAllShopcart(that.data.distributionStoreId)
  // }
  // if (that.data.nextDayStoreId) {
  //   nextDayNum = this.queryAllShopcart(that.data.nextDayStoreId)
  // }
  // Promise.all([storeNum, distributionNum, nextDayNum]).then((res) => {
  //   that.data.shoppingData.store.goodsNum = res[0] ? res[0] : 0;
  //   that.data.shoppingData.distribution.goodsNum = res[1] ? res[1] : 0;
  //   that.data.shoppingData.nextDay.goodsNum = res[2] ? res[2] : 0;
  //   that.setData({
  //     shoppingData: that.data.shoppingData,
  //     goodsNumAll: ((res[0] ? res[0] : 0) + (res[1] ? res[1] : 0) + (res[2] ? res[2] : 0)) == 0 ? 0 : that.data.goodsNumAll
  //   })
  // })
}
function queryInverntory(storeId) {
  handlePriceCalc()
  util.setHideLoading(false)
  uni.hideLoading()
}
function handleDelete(e) {
  let shoppingItems = ''
  let productNum = 0
  const products = []
  const storeType = e && e.currentTarget.dataset.type
  state.shoppingData[storeType].goodsList.forEach((item) => {
    if (item.checked) {
      products.push({
        productId: item.productId,
        traceId: item.traceId != null ? item.traceId : '',
      })
      if (shoppingItems === '') {
        shoppingItems = shoppingItems + item.id
      } else {
        shoppingItems = shoppingItems + ',' + item.id
      }
      productNum = productNum + (item.productNum || 0)
    }
  })
  if (shoppingItems === '') {
    uni.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
      duration: 2000,
    })
  } else {
    uni.showModal({
      title: '提示',
      content: '确认要删除选中商品？',
      success: function (res) {
        if (res.confirm) {
          shopcartService.remove(shoppingItems).then((res) => {
            const opts = {
              products,
            }
            let storeId = state.storeId
            if (state.tabSelected == 1) {
              storeId = state.distributionStoreId
            } else if (state.tabSelected == 2) {
              storeId = state.nextDayStoreId
            }
            setUserProductsCount(productNum)
            queryShopcart()
            queryShopCartNum()
          })
        } else if (res.cancel) {
        }
      },
    })
  }
}
function setUserProductsCount(productNum) {
  let localProductCount = uni.getStorageSync('wj_userProductsCount')
  if (localProductCount && Number(localProductCount) >= 0) {
    localProductCount = Number(localProductCount) - productNum
    localProductCount = localProductCount > 0 ? localProductCount : 0
  }
  const counts = String(localProductCount)
  app.globalData.setTabBarBadge('shopping_cart', counts)
  uni.setStorageSync('wj_userProductsCount', localProductCount)
  bus.emit('userShopCartChange', 'update')
}
function clearExpiredGood() {
  console.log(state.expiredGoodsList)
  const self = this
  let shoppingItems = ''
  let productNum = 0
  const products = []
  state.expiredGoodsList.forEach((item) => {
    if (item.checked) {
      products.push({
        productId: item.productId,
        traceId: item.traceId != null ? item.traceId : '',
      })
      if (shoppingItems === '') {
        shoppingItems = shoppingItems + item.id
      } else {
        shoppingItems = shoppingItems + ',' + item.id
      }
      productNum = productNum + (item.productNum || 0)
    }
  })
  if (shoppingItems === '') {
    uni.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
      duration: 2000,
    })
  } else {
    uni.showModal({
      title: '提示',
      content: '确认要删除失效商品？',
      success: function (res) {
        if (res.confirm) {
          shopcartService.remove(shoppingItems).then((res) => {
            const opts = {
              products,
            }
            let storeId = state.storeId
            if (state.tabSelected == 1) {
              storeId = state.distributionStoreId
            } else if (state.tabSelected == 2) {
              storeId = state.nextDayStoreId
            }
            setUserProductsCount(productNum)
            queryShopcart()
            queryShopCartNum()
          })
        } else if (res.cancel) {
        }
      },
    })
  }
}
function clickDelete(val) {
  let shoppingItems = ''
  let traceId = ''
  const products = []
  if (shoppingItems === '') {
    shoppingItems = shoppingItems + val.currentTarget.dataset.id
  }
  if (val.currentTarget.dataset.traceid != null) {
    traceId = val.currentTarget.dataset.traceid
  }
  products.push({
    productId: val.currentTarget.dataset.id,
    traceId,
  })
  uni.showModal({
    title: '提示',
    content: '确认要删除该商品？',
    success: function (res) {
      if (res.confirm) {
        shopcartService.remove(shoppingItems).then((res) => {
          const opts = {
            products,
          }
          let storeId = state.storeId
          if (state.tabSelected == 1) {
            storeId = state.distributionStoreId
          } else if (state.tabSelected == 2) {
            storeId = state.nextDayStoreId
          }
          queryShopcart()
          queryShopCartNum()
        })
      } else if (res.cancel) {
      }
    },
  })
}
function pretreatmentOrder() {
  let settableNum = 0
  getGoodDetailData()
  const selectTypeList = []
  state.shoppingType.forEach((typeItem) => {
    if (state.shoppingData[typeItem].selectShow) {
      settableNum += 1
      if (selectTypeList.indexOf(typeItem) == -1) {
        selectTypeList.push(typeItem)
      }
      state.activeShoppingType = typeItem
    }
  })
  // 存在多种商品进行弹窗，清除默认结算类型
  if (settableNum > 1) {
    // this.separateSettlementChange()
    // this.setData({
    //   activeShoppingType: null
    // })
    if (state.calcPromotionsFlag != 0) {
      uni.showToast({
        icon: 'loading',
      })
      return false
    }
    toMultipleGoodPerfectOrder(selectTypeList)
  } else {
    handlePlaceOrder()
  }
}
function separateSettlementChange() {
  toggle('separateSettlement')
}
const handlePlaceOrder = util.throttle(function (e) {
  if (state.calcPromotionsFlag != 0) {
    uni.showToast({
      icon: 'loading',
    })
    return false
  }
  const storeType =
    e && e.currentTarget.dataset.type ? e.currentTarget.dataset.type : state.activeShoppingType
  toPerfectOrder(storeType)
})
function toMultipleGoodPerfectOrder(selectTypeList) {
  const availableGoodsListAll = []
  const inventoryDeficiency = []
  const shopcartList = []
  let shopcartAllPrice = 0
  if (selectTypeList && selectTypeList.length > 0) {
    selectTypeList.forEach((storeType, storeTypeIndex) => {
      const availableGoodsList = []
      const tempGoodsList = []
      state.shoppingData[storeType].goodsList.forEach((item) => {
        if (item.checked && item.status !== 'DELETED') {
          let tempItem = {
            ...item,
            goodsPromotions: [],
          }
          if (!item.grabActivityId) {
            if (item.memberPrice && Number(item.memberPrice) == Number(item.sellPrice)) {
              tempItem = {
                ...tempItem,
                useMemberPrice: true,
              }
            } else {
              if (item.promotionPrice && Number(item.promotionPrice) <= Number(item.sellPrice)) {
                tempItem = {
                  ...tempItem,
                  usePromotionPrice: true,
                  useMemberPrice: false,
                }
              }
            }
          }
          tempGoodsList.push(tempItem)
        }
      })
      const canBuyGoodsList = []
      tempGoodsList.forEach((item) => {
        if (item && item.balance < (item.productNum || 0)) {
          inventoryDeficiency.push(item)
        } else {
          if (item && item.secKillInfo) {
            if ((item.productNum || 0) <= item.secKillInfo.limitCount) {
              availableGoodsList.push(item)
            } else {
              inventoryDeficiency.push(item)
            }
          } else {
            availableGoodsList.push(item)
          }
        }
      })
      const secKillList = []
      availableGoodsList.forEach((item) => {
        if (item.grabActivityId != null && item.grabActivityId !== '') {
          secKillList.push(item)
        }
      })
      const giftProducts = []
      if (state.giftGoodsList.length > 0) {
        state.giftGoodsList.forEach((item) => {
          giftProducts.push({
            giftProduct: true,
            productId: item.goods.uuid,
            productNum: item.count,
            name: item.goods.name,
            image: item.goods.image,
          })
        })
      }
      if (tempGoodsList.length > 0) {
        try {
          let shopcart = {
            allPrice: (
              parseFloat(state.shoppingData[storeType].allPrice) +
              parseFloat(state.shoppingData[storeType].discount)
            ).toFixed(2),
            goodsList: availableGoodsList,
            giftProducts,
            orderType: 'normal',
            storeId: isNumber(storeType)
              ? storeType
              : state.shoppingData[storeType].storeId || app.globalData.storeInfo.id,
            storeName: state.shoppingData[storeType].storeName,
            discount: parseFloat(state.shoppingData[storeType].discount),
            scource: 'SHOPPINGCART',
          }
          if (storeType == 'distribution' || storeType == state.distributionStoreId) {
            shopcart = {
              ...shopcart,
              orderType: 'distribution',
              storeName: state.shoppingData[storeType].storeName,
              storeId: state.distributionStoreId,
            }
          } else if (storeType == 'nextDay' || storeType == state.nextDayStoreId) {
            shopcart = {
              ...shopcart,
              orderType: 'nextDay',
              storeName: state.shoppingData[storeType].storeName,
              storeId: state.nextDayStoreId,
            }
          } else {
            if (secKillList.length > 0) {
              shopcart = {
                ...shopcart,
                storeId: isNumber(storeType)
                  ? storeType
                  : state.shoppingData[storeType].storeId || app.globalData.storeInfo.id,
                storeName: state.shoppingData[storeType].storeName,
                orderType: 'secondkill',
              }
            } else {
              shopcart = {
                ...shopcart,
                storeId: isNumber(storeType)
                  ? storeType
                  : state.shoppingData[storeType].storeId || app.globalData.storeInfo.id,
                storeName: state.shoppingData[storeType].storeName,
                orderType: 'normal',
              }
            }
          }
          // wx.setStorageSync('wj_shopcart', shopcart)
          let existIndex = null
          const existFlag = shopcartList.some((shopcartItem, shopcartIdx) => {
            if (shopcartItem.orderType == shopcart.orderType && shopcartItem.storeId == storeType) {
              existIndex = shopcartIdx
            }
            return shopcartItem.orderType == shopcart.orderType && shopcartItem.storeId == storeType
          })
          if (existFlag) {
            shopcartList[existIndex] = shopcart
          } else if (shopcart.allPrice > 0) {
            shopcartAllPrice += parseFloat(shopcart.allPrice)
            shopcartList.push(shopcart)
          }
        } catch (e) {
          console.log(e.message)
        }
      } else {
        uni.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 2000,
        })
      }
      if (storeTypeIndex == selectTypeList.length - 1) {
        if (inventoryDeficiency.length > 0) {
          let tips = ''
          inventoryDeficiency.forEach((item) => {
            tips = tips + item.name + '、'
          })
          tips = tips.substring(0, tips.length - 1)
          tips = tips + '等' + inventoryDeficiency.length + '件商品库存不足，请选购其他商品哦~'
          console.log(tips)
          uni.showToast({
            title: tips,
            icon: 'none',
            duration: 2000,
          })
        } else {
          if (shopcartAllPrice >= 0) {
            const shopcatData = {
              allPrice: shopcartAllPrice.toFixed(2),
              scource: 'SHOPPINGCART',
              discount: 0,
              giftProducts: [],
              goodsList: [],
              goodsTypeList: shopcartList,
            }
            uni.setStorageSync('wj_shopcart', shopcatData)
            NAVPAGE.toPerfectOrder()
            // if (secKillList.length > 0) {
            //   let shoppingCarts = []
            //   secKillList.forEach(item => {
            //     let tempGrabProduct = {
            //       grabActivityId: item.grabActivityId,
            //       productId: item.productId,
            //       quantity: item.productNum
            //     }
            //     shoppingCarts.push(tempGrabProduct)
            //   })
            //   const postData = {
            //     memberId: app.globalData.userInfo && app.globalData.userInfo.member.id,
            //     storeId: app.globalData.storeInfo.id,
            //     shoppingCarts: shoppingCarts
            //   }
            //   shopcartService.checkShoppingToOrder(postData).then(res => {
            //     NAVPAGE.toPerfectOrder();
            //   }).catch(err => {
            //     util.showToast(err.message)
            //   })
            // } else {
            //   let shopcatData = {
            //     allPrice: allPrice.toFixed(2),
            //     scource: "SHOPPINGCART",
            //     discount: 0,
            //     giftProducts: [],
            //     goodsTypeList: shopcartList
            //   }
            //   wx.setStorageSync('wj_shopcart', shopcatData)
            //   NAVPAGE.toPerfectOrder();
            // }
          }
        }
      }
    })
  }
}
function toPerfectOrder(storeType) {
  const tempGoodsList = []
  const inventoryDeficiency = []
  const availableGoodsList = []
  state.shoppingData[storeType].goodsList.forEach((item) => {
    if (item.checked && item.status !== 'DELETED') {
      let tempItem = {
        ...item,
        goodsPromotions: [],
      }
      if (!item.grabActivityId) {
        if (item.memberPrice && Number(item.memberPrice) == Number(item.sellPrice)) {
          tempItem = {
            ...tempItem,
            useMemberPrice: true,
          }
        } else {
          if (item.promotionPrice && Number(item.promotionPrice) <= Number(item.sellPrice)) {
            tempItem = {
              ...tempItem,
              usePromotionPrice: true,
              useMemberPrice: false,
            }
          }
        }
      }
      tempGoodsList.push(tempItem)
    }
  })
  const canBuyGoodsList = []
  tempGoodsList.forEach((item) => {
    if (item && item.balance < (item.productNum || 0)) {
      inventoryDeficiency.push(item)
    } else {
      if (item && item.secKillInfo) {
        if ((item.productNum || 0) <= item.secKillInfo.limitCount) {
          availableGoodsList.push(item)
        } else {
          inventoryDeficiency.push(item)
        }
      } else {
        availableGoodsList.push(item)
      }
    }
  })
  const secKillList = []
  availableGoodsList.forEach((item) => {
    if (item.grabActivityId != null && item.grabActivityId !== '') {
      secKillList.push(item)
    }
  })
  const giftProducts = []
  if (state.giftGoodsList.length > 0) {
    state.giftGoodsList.forEach((item) => {
      giftProducts.push({
        giftProduct: true,
        productId: item.goods.uuid,
        productNum: item.count,
        name: item.goods.name,
        image: item.goods.image,
      })
    })
  }
  if (tempGoodsList.length > 0) {
    try {
      let shopcart = {
        allPrice: (
          parseFloat(state.shoppingData[storeType].allPrice) +
          parseFloat(state.shoppingData[storeType].discount)
        ).toFixed(2),
        goodsList: availableGoodsList,
        giftProducts,
        orderType: 'normal',
        storeId: isNumber(storeType) ? storeType : app.globalData.storeInfo.id,
        discount: parseFloat(state.shoppingData[storeType].discount),
        scource: 'SHOPPINGCART',
      }
      if (storeType == 'distribution') {
        shopcart = {
          ...shopcart,
          orderType: 'distribution',
          storeId: state.distributionStoreId,
        }
      } else if (storeType == 'nextDay') {
        shopcart = {
          ...shopcart,
          orderType: 'nextDay',
          storeId: state.nextDayStoreId,
        }
      } else {
        if (secKillList.length > 0) {
          shopcart = {
            ...shopcart,
            storeId: isNumber(storeType) ? storeType : app.globalData.storeInfo.id,
            orderType: 'secondkill',
          }
        } else {
          shopcart = {
            ...shopcart,
            storeId: isNumber(storeType) ? storeType : app.globalData.storeInfo.id,
            orderType: 'normal',
          }
        }
      }
      uni.setStorageSync('wj_shopcart', shopcart)
    } catch (e) {
      console.log(e.message)
    }
    if (inventoryDeficiency.length > 0) {
      let tips = ''
      inventoryDeficiency.forEach((item) => {
        tips = tips + item.name + '、'
      })
      tips = tips.substring(0, tips.length - 1)
      tips = tips + '等' + inventoryDeficiency.length + '件商品库存不足，请选购其他商品哦~'
      console.log(tips)
      uni.showToast({
        title: tips,
        icon: 'none',
        duration: 2000,
      })
    } else {
      if (state.shoppingData[storeType].allPrice >= 0) {
        if (secKillList.length > 0) {
          const shoppingCarts = []
          secKillList.forEach((item) => {
            const tempGrabProduct = {
              grabActivityId: item.grabActivityId,
              productId: item.productId,
              quantity: item.productNum,
            }
            shoppingCarts.push(tempGrabProduct)
          })
          const postData = {
            memberId: app.globalData.userInfo && app.globalData.userInfo.member.id,
            storeId: isNumber(storeType) ? storeType : app.globalData.storeInfo.id,
            shoppingCarts,
          }
          shopcartService
            .checkShoppingToOrder(postData)
            .then((res) => {
              NAVPAGE.toPerfectOrder()
            })
            .catch((err) => {
              util.showToast(err.message)
            })
        } else {
          NAVPAGE.toPerfectOrder()
        }
      }
    }
  } else {
    uni.showToast({
      title: '请选择商品',
      icon: 'none',
      duration: 2000,
    })
  }
}
function checkAuth(e) {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
function changeStore() {
  if (state.tabSelected == '1' && state.shoppingCartShowType != 'UD') {
    return
  }
  const opts = '?form=shopCart'
  NAVPAGE.toSelectStore(opts)
}
function getGiveAwayPrice(storeInfo, isCheckDeliveryRules) {
  const storeId = storeInfo.id
  let shipmentType = ''
  if (storeInfo.shipmentTypes.indexOf('EXPRESS') >= 0) {
    shipmentType = 'EXPRESS'
  } else if (storeInfo.shipmentTypes.indexOf('LOGISTICAL') >= 0) {
    shipmentType = 'LOGISTICAL'
  }
  if (shipmentType !== '') {
    distributionService.get(storeId, shipmentType).then((res) => {
      console.log('调用查询优惠配送费规则接口')
      console.log(res)
      if (res) {
        let takeoutFare = ''
        let baseFare = ''
        if (state.distributionStoreId === storeId) {
          if (res.takeoutFare || res.takeoutFare === 0) {
            // 统配门店起送费
            takeoutFare = res.takeoutFare
          }
          if (res.baseFare || res.baseFare === 0) {
            baseFare = res.baseFare
          }
          state.disStoreGiveAwayPrice = takeoutFare
          state.disStoreBaseFare = baseFare
          state.disStoreDeliveryFeeRules = res
          if (state.tabSelected == 1) {
            state.giveAwayPrice = res.takeoutFare
          }
        } else if (state.nextDayStoreId === storeId) {
          if (res.takeoutFare || res.takeoutFare === 0) {
            // 次日达门店起送费
            takeoutFare = res.takeoutFare
          }
          if (res.baseFare || res.baseFare === 0) {
            baseFare = res.baseFare
          }
          state.nextDayStoreGiveAwayPrice = takeoutFare
          state.nextDayStoreBaseFare = baseFare
          state.nextDayStoreDeliveryFeeRules = res
          if (state.tabSelected == 1) {
            state.giveAwayPrice = res.takeoutFare
          }
        } else {
          if (res.takeoutFare || res.takeoutFare === 0) {
            // 统配门店起送费
            takeoutFare = res.takeoutFare
          }
          if (res.baseFare || res.baseFare === 0) {
            baseFare = res.baseFare
          }
          state.storeGiveAwayPrice = takeoutFare
          state.storeBaseFare = baseFare
          state.storeDeliveryFeeRules = res
          if (state.tabSelected == 0) {
            state.giveAwayPrice = res.takeoutFare
          }
        }
        // if (isCheckDeliveryRules) {
        //   that.checkDeliveryFeeRulesDisplay()
        // }
      }
    })
  }
}
function initPage() {
  if (state.inInitPage) {
    console.log('initPage', state.inInitPage)
    return
  }
  console.log('initPage')
  state.inInitPage = true
  if (app.globalData.storeInfo) {
    const distributionStoreName = state.distributionStoreName
    const nextDayStoreName = state.nextDayStoreName
    if (state.tabSelected == 0 || state.shoppingCartShowType == 'UD') {
      state.storeId = app.globalData.storeInfo.id
      state.storeName = app.globalData.storeInfo.name
    } else if (state.tabSelected == 2) {
      state.storeName = nextDayStoreName
    } else {
      state.storeName = distributionStoreName
    }
    //   this.getGiveAwayPrice(app.globalData.storeInfo)
  }
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      noQuery = false
      queryShopcart()
      if (state.systemOptions.isDeliveryProduct) {
        queryShopCartNum()
      }
    } else {
      if (state.loading) {
        state.loading = false
      }
      uni.showToast({
        title: '绑定手机号成为会员查看购物车~',
        icon: 'none',
        duration: 2000,
      })
      noQuery = true
    }
  } else {
    if (state.loading) {
      state.loading = false
    }
    uni.showToast({
      title: '请登陆后查看购物车~',
      icon: 'none',
      duration: 2000,
    })
    noQuery = true
  }
  state.inInitPage = false
}
function handlePageLoad(refresh = true) {
  const self = this
  let parameter = {
    orderId: '',
    from: '',
    storeIdentification: '',
  }
  if (app.globalData.parameter) {
    parameter = app.globalData.parameter
    app.globalData.parameter = null
  }
  if (parameter.orderId != null && parameter.from === 'oneMore') {
    let storeId = app.globalData.storeInfo.id
    if (parameter.storeIdentification === 'distribution') {
      // 开启了统配
      if (state.systemOptions.isDeliveryProduct) {
        // 查询统配门店信息
        if (state.distributionStoreId !== '') {
          storeId = state.distributionStoreId
          oneMore(storeId)
        } else {
          storeService
            .getDistributionStore()
            .then((res) => {
              if (res) {
                const distributionStore = res
                state.distributionStoreId = res.id
                state.distributionStoreName = res.name
                oneMore(storeId)
                try {
                  uni.setStorageSync('wj_distributionStore', distributionStore)
                } catch (e) {
                  console.log(e)
                }
              }
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
      }
    } else if (parameter.storeIdentification === 'nextDay') {
      // 开启了次日达
      if (state.systemOptions.isNextDayProduct) {
        // 查询次日达门店信息
        if (state.nextDayStoreId !== '') {
          storeId = state.nextDayStoreId
          oneMore(storeId)
        } else {
          storeService
            .getNextDayStore()
            .then((res) => {
              if (res) {
                const nextDayStore = res
                state.nextDayStoreId = res.id
                state.nextDayStoreName = res.name
                oneMore(storeId)
                try {
                  uni.setStorageSync('wj_nextDayStore', nextDayStore)
                } catch (e) {
                  console.log(e)
                }
              }
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
      }
    } else {
      oneMore(storeId)
    }
    function oneMore(storeId) {
      const postData = {
        orderId: parameter.orderId,
        storeId,
      }
      orderService
        .oneMore(postData)
        .then((res) => {
          if (res && res.length > 0) {
            // 有商品不能加入购物车需要报错
            state.unsupportedProductList = res
            state.show.oneMore = true
          }
          // 重新查询购物车
          initPage()
        })
        .catch((err) => {
          util.showToast(err.message)
        })
    }
  } else {
    if (refresh) {
      initPage()
    }
  }
}
onLoad(async function (_options) {
  console.log(app, 'adfakfasjdf')
  const self = this
  // this.eventId = bus.on('userShopCartChange', () => {
  //   if (app.globalData.storeInfo) {
  //     self.getShopCart(app.globalData.storeInfo.id)
  //   }
  // })
  if (_options.activeStoreId) {
    state.activeStoreId = _options.activeStoreId
  }
  console.log(app.globalData.tabBar.list, 'app.globalData.tabBar.list')
  if (app.globalData.openCustomTabbar) {
    app.globalData.getTabbar()
    state.navigationStyle = app.globalData.tabBar.list[0].navigationStyle
    if (app.globalData.editTabbar) {
      app.globalData.editTabbar()
    }
    app.globalData.tabBar.list.some((item) => {
      if (item.linkModel === 'shopping_cart') {
        try {
          uni.hideTabBar()
        } catch (e) {
          console.log('hideTabBar failed:', e)
        }
        state.showTabbar = true
      }
      return item.linkModel === 'shopping_cart'
    })
    state.openCustomTabbar = true
  } else {
    if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
      app.globalData.tabBar.list.some((item) => {
        if (item.linkModel === 'shopping_cart') {
          try {
            uni.hideTabBar()
          } catch (e) {
            console.log('hideTabBar failed:', e)
          }
          if (app.globalData.editTabbar) {
            app.globalData.editTabbar()
          }
          state.showTabbar = true
        }
        return item.linkModel === 'shopping_cart'
      })
    }
  }
  checkUserInfo()
  // 设置当前设备是否iPhone X
  // 查询系统配置项，根据系统配置项控制统配购物车显示
  state.isIphoneX = app.globalData.isIphoneX
  state.navHeight = app.globalData.navHeight
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
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
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  const systemOptions = app.globalData.configureInfo
  const configures = {
    isDeliveryProduct: false,
    isNextDayProduct: false,
  }
  systemOptions.forEach((item) => {
    // 是否包含统配商品:TRUE是、FALSE否
    if (item.key === 'isDeliveryProduct' && item.value != null && item.value !== '') {
      item.value === 'TRUE'
        ? (configures.isDeliveryProduct = true)
        : (configures.isDeliveryProduct = false)
    } else if (item.key === 'isNextDayProduct' && item.value != null && item.value !== '') {
      // 是否包含次日达商品:TRUE是、FALSE否
      item.value === 'TRUE'
        ? (configures.isNextDayProduct = true)
        : (configures.isNextDayProduct = false)
    }
  })
  state.systemOptions = configures
  state.isOnload = true
  // 开启了统配
  if (configures.isDeliveryProduct && state.shoppingCartShowType != 'UD') {
    // 查询统配门店信息
    ADDRESS.getDistributionStore()
      .then((res) => {
        state.isOnload = false
        setDistributionStoreInfo(res)
      })
      .catch((err) => {
        state.isOnload = false
        handlePageLoad()
        console.log('查询统配门店报错')
      })
    /**
     * 设置统配门店信息
     */
    function setDistributionStoreInfo(res) {
      state.distributionStoreId = res.id
      state.distributionStoreName = res.name
      const tab =
        app.globalData.storeIdentification === 'distribution'
          ? state.shoppingType.indexOf('distribution')
          : 0
      // self.getGiveAwayPrice(res)
      state.tabSelected = tab
      state.activeShoppingType = 'distribution'
      console.log(state.distributionStoreId)
      handlePageLoad()
    }
  } else if (configures.isNextDayProduct && state.shoppingCartShowType != 'UD') {
    // 查询次日达门店信息
    ADDRESS.getNextDayStore()
      .then((res) => {
        state.isOnload = false
        setNextDayStoreInfo(res)
      })
      .catch((err) => {
        state.isOnload = false
        handlePageLoad()
        console.log('查询次日达门店报错')
      })
    /**
     * 设置统配门店信息
     */
    function setNextDayStoreInfo(res) {
      state.nextDayStoreId = res.id
      state.nextDayStoreName = res.name
      const tab =
        app.globalData.storeIdentification === 'nextDay' ? state.shoppingType.indexOf('nextDay') : 0
      state.tabSelected = tab
      state.activeShoppingType = 'nextDay'
      handlePageLoad()
    }
  } else {
    state.isOnload = false
    handlePageLoad()
  }
  if (_options.shareId && _options.shareId != '' && _options.shareId != undefined) {
    const shareId = _options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    await getGoodList()
  }
  // 获取当前页面分享图
  getSharePictures()
})
async function getGoodList() {
  await activityService.getRequiredProduct(app.globalData.userInfo.member.id).then((res) => {
    if (res && res.length > 0) {
      const list = []
      res.forEach((item) => {
        list.push(item.id)
      })
      uni.setStorageSync('requireProductIds', JSON.stringify(list))
    } else {
      uni.removeStorageSync('requireProductIds')
    }
  })
}
onReady(function () {})
function getAddress() {
  const chooseAddress = uni.getStorageSync('wj_chooseAddressInfo')
  if (chooseAddress && chooseAddress.detailedAddress) {
    state.addressName = chooseAddress.detailedAddress
  } else {
    const self = this
    // 1、获取当前位置坐标
    uni.getLocation({
      type: 'gcj02',
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // 2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        util.inverseAnalysisAddress(latitude, longitude).then((res) => {
          const resData = res.data.result || res.result
          state.addressName = resData.formatted_address
            ? resData.formatted_address
            : resData.formattedAddresses.recommend
        })
      },
    })
  }
}
onShow(function () {
  checkUserInfo()
  getAddress()
  state.refreshType = 'ALL'
  setTimeout(() => {
    state.refreshType = null
  }, 500)
  if (!state.isOnload) {
    if (app.globalData.isShopCartChange) {
      app.globalData.isShopCartChange = false
      const tab =
        app.globalData.storeIdentification === 'distribution' ||
        app.globalData.storeIdentification === 'nextDay'
          ? state.shoppingType.indexOf(app.globalData.storeIdentification)
          : 0
      state.tabSelected = tab
      handlePageLoad()
    } else if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
      handlePageLoad()
    } else {
      handlePageLoad(noQuery)
    }
  }

  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  getShopCartStyle()
})
onHide(function () {
  state.show.separateSettlement = false
  state.show.money = false
  state.show = state.show
})
onUnload(function () {
  bus.remove('userShopCartChange', eventId)
})
onPullDownRefresh(function () {
  onLoad(options)
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {})
onShareAppMessage(async function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let storeId = ''
  if (app.globalData.storeInfo) {
    storeId = app.globalData.storeInfo.id
  }
  let sharePictures = state.sharePictures
  if (!sharePictures) {
    const indexPic = await util.getSharePictures('SHOPPING_CART')
    if (indexPic) {
      state.sharePictures = indexPic
      sharePictures = state.sharePictures
    }
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    const memberName = app.globalData.userInfo.member.nickName
    const memberAvatar = app.globalData.userInfo.member.avatar
    let goodsList = [
      // ...that.data.shoppingData.store.goodsList,
      // ...that.data.shoppingData.distribution.goodsList
    ]
    state.shoppingType.forEach((key) => {
      goodsList = goodsList.concat(
        state.shoppingData[key] && state.shoppingData[key].goodsList
          ? state.shoppingData[key].goodsList
          : [],
      )
    })
    console.log(goodsList, 'that.data.shoppingData')
    const expiredGoodsList = JSON.stringify(state.expiredGoodsList)
    const productList = []
    goodsList.forEach((val) => {
      if (val.status !== 'DELETED' && val.checked) {
        productList.push({
          productId: val.productId,
          promotionPrice: val.promotionPrice,
          quantity: val.productNum,
          name: val.name,
          sellPrice: val.sellPrice,
          business: val.business,
          imageUrl: val.imageUrl,
        })
      }
    })
    const postData = {
      productList,
      shareMemberAvatar: memberAvatar,
      shareMemberId: memberId,
      shareMemberNickname: memberName,
      shareStoreId: storeId,
      shareStoreName: app.globalData.storeInfo.name,
    }
    let shareId = ''
    await shopcartService.createShoppingCartShare(postData).then((res) => {
      console.log(res, 'resresres')
      if (res) {
        shareId = res
      }
    })
    // let path = `/pages/mallModule/shareShopcart/shareShopcart?goodsList=${goodsList}&expiredGoodsList=${expiredGoodsList}&memberId=${memberId}&memberName=${memberName}&memberAvatar=${memberAvatar}`
    const path = `/pages/mallModule/shareShopcart/shareShopcart?shareId=${shareId}`
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      // path: '/pages-sub/newretail/pages/mallModule/index/index/index?shareId=' + memberId + '&storeId=' + storeId,
      path,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  } else {
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function getSharePictures() {
  // if (app.globalData.sharePictures) {
  //   this.setData({
  //     sharePictures: app.globalData.sharePictures
  //   })
  // }
  util
    .getSharePictures('SHOPPING_CART')
    .then((res) => {
      if (res) {
        state.sharePictures = res
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
function recorderPopup() {
  toggleBottomPopup()
}
function toggleOneMorePopup() {
  toggle('oneMore')
}
function toggleBottomPopup() {
  toggle('middle')
}
function toggleNumberPopup() {
  toggle('number')
}
function toggle(type) {
  state.show[type] = !state.show[type]
}
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const self = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
    } else {
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
    }
  }
}
function handleTabbar(e) {
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar
  } else {
    state.showTabbar = e.detail.showTabbar
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
    state.phone = true
  } else {
    state.phone = false
  }
}
function handleBindPhone(e) {
  console.log(e.detail)
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
  }
}
function isNumber(e) {
  return !isNaN(parseFloat(e)) && isFinite(e)
}
function toGoodsDetails(e) {
  let storeId = ''
  const storeType = e && e.currentTarget.dataset.type
  if (storeType == 'nextDay' || storeType == state.nextDayStoreId) {
    storeId = state.nextDayStoreId
  } else if (storeType == 'distribution' || storeType == state.distributionStoreId) {
    storeId = state.distributionStoreId
  } else if (storeType == 'store' || isNumber(storeType)) {
    if (isNumber(storeType || state.shoppingData[storeType].storeId)) {
      storeId = storeType
    } else if (app.globalData.storeInfo) {
      storeId = app.globalData.storeInfo.id
    }
  }
  const id = e.currentTarget.dataset.id
  let product = null
  state.shoppingData[storeType].goodsList.forEach((ele) => {
    if (ele.id === id) {
      product = ele
    }
  })
  if (!product) {
    return
  }
  // 秒杀商品
  if (product.grabActivityId != null && product.grabActivityId != '') {
    const opts =
      '?productId=' +
      product.productId +
      '&storeId=' +
      storeId +
      '&activityId=' +
      product.grabActivityId +
      '&type=secondkill'
    NAVPAGE.toGoodsDetails(opts)
    // 新会员专享商品
  } else if (product.newmbrActivityId != null && product.newmbrActivityId != '') {
    const goodsDetail = {
      activityId: product.newmbrActivityId,
      price: product.sellPrice,
    }
    let opts = ''
    if (storeType == 'store') {
      opts =
        '?productId=' +
        (product.parentProductId
          ? product.parentProductId + '&specId=' + product.productId
          : product.productId) +
        '&goodsDetail=' +
        goodsDetail +
        '&type=newmbr' +
        '&zhiti=zhiti'
    } else {
      opts =
        '?productId=' +
        (product.parentProductId
          ? product.parentProductId + '&specId=' + product.productId
          : product.productId) +
        '&goodsDetail=' +
        goodsDetail +
        '&type=newmbr'
    }
    NAVPAGE.toGoodsDetails(opts)
    // 普通商品
  } else {
    console.log('进入普通商品')
    let opts = ''
    if (storeType == 'store') {
      opts =
        '?productId=' +
        (product.parentProductId
          ? product.parentProductId + '&specId=' + product.productId
          : product.productId) +
        '&storeId=' +
        storeId +
        '&type=normal' +
        '&zhiti=zhiti'
    } else {
      opts =
        '?productId=' +
        (product.parentProductId
          ? product.parentProductId + '&specId=' + product.productId
          : product.productId) +
        '&storeId=' +
        storeId +
        '&type=normal'
    }
    NAVPAGE.toGoodsDetails(opts)
  }
}
function updateLocalShopCart(postData) {
  const goodsId = postData.shoppingItemId // 购物项id
  const goodsList = state.shoppingData[state.activeShoppingType].goodsList
  let goods = null
  let count = 0 // 改变的数量
  goodsList.forEach((item) => {
    if (item.id === goodsId) {
      // 找到发生数量变化的商品
      goods = item
      count = Number(postData.count) - Number(item.productNum || 0)
    }
  })
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage')
    let localProductCount = uni.getStorageSync('wj_userProductsCount')
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount)
    localProductCount = localProductCount + count
    app.globalData.setTabBarBadge('shopping_cart', String(localProductCount))
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId
      const tempShopCart = localShopingCart.items
      const tempShopCartGoodsId = []
      const _id = goods.productId
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
        tempShopCart[_id] = Number(tempShopCart[_id]) + count
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
    const counts = String(localProductCount)
    if (counts) {
      app.globalData.setTabBarBadge('shopping_cart', counts)
    }
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', 'update')
}
function setLocalShopCart(data) {
  const self = this
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const tempShopCart = {}
    const grabProducts = {}
    const tempShopCartGoodsId = []
    const tempGrabShopCartGoodsId = []
    if (data.items && data.items.length > 0) {
      // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
      data.items.forEach((item) => {
        if (!item.grabActivityId && !item.newmbrActivityId) {
          let index = -1
          for (let i = 0; i < tempShopCartGoodsId.length; i++) {
            if (item.productId == tempShopCartGoodsId[i]) {
              index = i
            }
          }
          if (index > -1) {
            tempShopCart[item.productId] = tempShopCart[item.productId] + (item.productNum || 0)
          } else {
            tempShopCart[item.productId] = item.productNum || 0
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
            grabProducts[item.productId] = grabProducts[item.productId] + (item.productNum || 0)
          } else {
            grabProducts[item.productId] = item.productNum || 0
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
    const localProductCount = uni.getStorageSync('wj_userProductsCount')
    const counts = String(localProductCount)
    if (counts) {
      app.globalData.setTabBarBadge('shopping_cart', counts)
    }
  }
  bus.emit('userShopCartChange', 'update')
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    state.userInfo = app.globalData.userInfo.wxaUser
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo
      let isExpired = false
      let isVIP = false
      const now = new util.ResponseDate().getTime()
      let vipEndTimeStamp = now + 1000
      let vipEndTime = ''
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime()
        vipEndTime = res.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
      }
      if (now > vipEndTimeStamp) {
        isExpired = true
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true
        app.globalData.userInfo.member.vip = true
      }
      state.isMember = true
      state.member = res.member
      state.isVIP = isVIP
      state.isExpired = isExpired
      state.vipEndTime = vipEndTime
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function checkDeliveryFeeRulesDisplay() {
  const goodsList = state.goodsList
  const allPrice = parseFloat(state.allPrice) + parseFloat(state.discount)
  const tabSelected = state.tabSelected
  let rules = null
  let baseFare = 0
  if (state.shoppingType[tabSelected] == 'distribution') {
    // 统配
    rules = state.disStoreDeliveryFeeRules
    baseFare = state.disStoreBaseFare !== '' ? parseFloat(state.disStoreBaseFare) : 0
    if (rules) {
      handleDeliveryFeeRule()
    } else {
      // 查询配送费规则
      if (app.globalData.distributionStore) {
        //   that.getGiveAwayPrice(app.globalData.distributionStore, true)
      } else {
        handleDeliveryFeeRule()
      }
    }
  } else {
    // 普通
    rules = state.storeDeliveryFeeRules
    baseFare = state.storeBaseFare !== '' ? parseFloat(state.storeBaseFare) : 0
    if (rules) {
      handleDeliveryFeeRule()
    } else {
      // 查询配送费规则
      if (app.globalData.storeInfo) {
        //   that.getGiveAwayPrice(app.globalData.storeInfo, true)
      } else {
        handleDeliveryFeeRule()
      }
    }
  }
  function handleDeliveryFeeRule() {
    let distanceExemptionAmount = 0
    let deliveryRulesText = ''
    let shipmentAmount = baseFare
    if (rules) {
      const takeoutFare = rules.takeoutFare || 0
      const freeFare = rules.freeFare || 0
      if (allPrice < takeoutFare) {
        distanceExemptionAmount = parseFloat((takeoutFare - allPrice).toFixed(2))
        deliveryRulesText =
          takeoutFare > 0 ? '差' + distanceExemptionAmount.toFixed(2) + '元起送' : ''
      } else if (freeFare > 0 && allPrice >= freeFare) {
        deliveryRulesText = '已免配送费'
        shipmentAmount = 0
      } else {
        if (rules.deliveryPartFreeFee) {
          // 有部分满减
          const deliveryPartFreeFeeFreeFare = rules.deliveryPartFreeFee.freeFare || 0
          const deliveryPartFreeFeeSatisfyFare = rules.deliveryPartFreeFee.satisfyFare || 0
          if (deliveryPartFreeFeeSatisfyFare > 0 && deliveryPartFreeFeeFreeFare > 0) {
            // 已满足起送条件
            if (allPrice < deliveryPartFreeFeeSatisfyFare) {
              deliveryRulesText =
                '满' +
                deliveryPartFreeFeeSatisfyFare +
                '元减' +
                deliveryPartFreeFeeFreeFare +
                '元配送费'
              if (freeFare > 0) {
                deliveryRulesText = deliveryRulesText + ',' + '满' + freeFare + '元免配送费'
              }
            } else {
              // 一定不满足免配送费条件
              deliveryRulesText = '已减' + deliveryPartFreeFeeFreeFare + '元配送费'
              shipmentAmount = parseFloat((baseFare - deliveryPartFreeFeeFreeFare).toFixed(2))
              shipmentAmount = shipmentAmount > 0 ? shipmentAmount : 0
              if (freeFare > 0) {
                deliveryRulesText = deliveryRulesText + ',' + '满' + freeFare + '元免配送费'
              }
              if (shipmentAmount === 0) {
                deliveryRulesText = '已免配送费'
              }
            }
          } else {
            deliveryRulesText = freeFare > 0 ? '满' + freeFare + '元免配送费' : ''
          }
        } else {
          if (freeFare > 0) {
            deliveryRulesText = '满' + freeFare + '元免配送费'
          }
        }
      }
    }
    state.distanceExemptionAmount = distanceExemptionAmount
    state.deliveryRulesText = deliveryRulesText
    state.baseFare = parseFloat(shipmentAmount.toFixed(2))
  }
}
</script>
<style scoped>
/* pages/shopcart/shopcart.wxss */

page {
  background-color: #f3f4f6;
  padding-bottom: 98rpx;
}

.shopcart-main {
  /* margin-top: 20rpx; */
  /* background-color: #fff; */
  /* padding-bottom: 130rpx; */
  height: 100%;
}

.shopcart-main.hasGift {
  padding-bottom: 226rpx;
}

.shopcart-main.iphoneX-height {
  padding-bottom: 64rpx;
}

.shopcart-main.iphoneX-height.hasGift {
  padding-bottom: 184rpx;
}

.shopcart-title {
  overflow: hidden;
  height: 84rpx;
  line-height: 84rpx;
  /* border-bottom: 1rpx solid #f5f5f5; */
  margin-bottom: 20rpx;
  padding: 0 40rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
}

.shopcart-title .giveAwayPrice {
  font-size: 24rpx;
  color: #666;
}

.shopcart-title .location {
  /* float: left; */
  display: flex;
  align-items: center;
  font-size: 36rpx;
}

.shopcart-title .location .shop-img {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  overflow: hidden;
}

.shopcart-title .location checkbox {
  margin-top: -4rpx;
  line-height: 84rpx;
}

.shopcart-title .location > text:first-of-type {
  font-size: 28rpx;
  color: #454545;
  margin-left: 8rpx;
  margin-right: 14rpx;
  display: inline-block;
  width: 510rpx;
  /*溢出部分隐藏*/
  overflow: hidden;
  /*禁止换行*/
  white-space: nowrap;
  /*显示省略号*/
  text-overflow: ellipsis;
}

/* .shopcart-title .location>text:last-of-type {
  color: #FF9F43;
  font-size: 24rpx;
  margin-left: 8rpx;
} */

.shopcart-title .location .right-img {
  width: 12rpx;
  height: 21rpx;
  vertical-align: middle;
  margin-left: 6rpx;
}

.shopcart-title .right {
  display: flex;
  align-items: center;
}

::v-deep uni-checkbox .uni-checkbox-input {
  border-radius: 50% !important;
  width: 32rpx !important;
  height: 32rpx !important;
}

::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  border-color: #ff9f43 !important;
  background: #ff9f43 !important;
}

uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
  background: transparent;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}

.header-info .edit {
  /* float: right; */
  /* font-size: 28rpx; */
  /* color: #287eff; */
  position: absolute;
  right: 40rpx;
  top: 22rpx;
}
.store-type-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.store-type-title .edit,
.shopcart-title .edit {
  margin-left: 20rpx;
}

.header-info .edit image,
.store-type-title .edit image,
.shopcart-title .edit image {
  width: 29rpx;
  height: 35rpx;
  vertical-align: middle;
  margin-top: -5rpx;
}

/* 购物车商品内容 */

.shopcart-item-box {
  background: #f4f5f7;
  padding: 20rpx 18rpx;
  /* margin-bottom: 150rpx; */
}

.shopcart-item {
  min-height: 180rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  /* border-bottom: 20rpx solid #f1f1f1; */
  position: relative;
  background-color: #fff;
  border-radius: 10rpx;
}

.promotionDescription {
  min-height: 290rpx;
}

.expiredGood {
  min-height: 0rpx;
  height: 0;
  border-bottom: none;
}

.shopcart-item:last-of-type {
  border-bottom: 0;
}

.shopcart-item .goods-top {
  display: flex;
  align-items: center;
  /* height: 75rpx; */
  padding: 22rpx 0;
  margin: 0 22rpx;
  height: 35rpx;
}

.shopcart-item .goods-top .discount-icon {
  font-size: 18rpx;
  color: #ff8561;
  /* line-height: 30rpx; */
  height: 32rpx;
  padding: 0 7rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ff8561;
  /* display: inline-block; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
  flex-shrink: 0;
  box-sizing: border-box;
}

.shopcart-item .goods-top .discount-desc {
  font-size: 24rpx;
  color: #454545;
  line-height: 32rpx;
  width: 430rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shopcart-item .goods-box {
  border-top: 1rpx solid #f1f1f1;
  min-height: 180rpx;
  position: relative;
  padding: 17rpx 20rpx;
  display: flex;
  align-items: center;
}

.shopcart-item .goods-box .goods-lose-title {
  width: 55rpx;
  height: 55rpx;
  line-height: 55rpx;
  font-size: 20rpx;
  color: #fff;
  background-color: #000;
  box-sizing: border-box;
  border-radius: 55rpx;
  text-align: center;
}

.shopcart-item .goods-img-box {
  width: 164rpx;
  height: 164rpx;
  margin-right: 20rpx;
  margin-left: 15rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shopcart-item .goods-img-box image {
  width: 100%;
  height: 100%;
}

.shopcart-item .goods-img-box .seckill-icon {
  position: absolute;
  width: 120rpx;
  height: 35rpx;
  top: 0;
  left: 0;
}

.goods-img-box .goods-lose-title {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  transform: translate(-50%, -50%);
}
.goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.shopcart-item .bg-shade {
  position: absolute;
  height: 240rpx;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.shopcart-item .bg-shade .delete-btn {
  height: 42rpx;
  font-size: 32rpx;
  line-height: 42rpx;
  width: 108rpx;
  display: block;
  color: #333;
  text-align: center;
  margin-right: 40rpx;
}

.shopcart-item:last-of-type {
  border: none;
}

.shopcart-item checkbox,
.shopcart-item image {
  float: left;
}

.shopcart-item checkbox {
  line-height: 180rpx;
  /* margin-right: 10rpx; */
  /* transform: scale(1.2, 1.2) */
}

.shopcart-item .goods-info {
  float: left;
  width: calc(100% - 246rpx);
  font-size: 32rpx;
  min-height: 180rpx;
  position: relative;
}

.shopcart-item .goods-name {
  font-size: 24rpx;
  line-height: 36rpx;
  /* height: 36rpx; */
  /* font-weight: bold; */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  /* margin-top: 12rpx; */
}
.shopcart-item .goods-info .goods-detail-info {
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #999;
}
.produt-label {
  margin-bottom: 50rpx;
}

.shopcart-item .goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.shopcart-item .goods-name view {
  width: 100%;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  margin-bottom: 4rpx;
  font-weight: Medium;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.shopcart-item .goods-info > text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #454545;
}

.shopcart-item .goods-label {
  height: 36rpx;
  padding: 0 12rpx;
  border-radius: 6rpx;
  background: #e9e9e9;
  color: #454545;
  font-size: 20rpx;
  line-height: 36rpx;
  font-weight: normal;
  text-align: left;
  display: inline-block;
  max-width: 100%;
  margin-top: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shopcart-item .goods-info .goods-desc {
  font-size: 20rpx;
  line-height: 36rpx;
  white-space: pre;
  color: #999;
}

.shopcart-item .price-number {
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 44rpx;
  color: #ff8561;
}

.shopcart-item .price-number .old-price {
  font-size: 20rpx;
  color: #999;
  text-decoration: line-through;
}

.shopcart-item .price-number button {
  width: 42rpx;
  height: 42rpx;
}

.shopcart-item .price-number .price-box {
  float: left;
  font-size: 30rpx;
  color: #ff8425;
}
.shopcart-item .price-number .price-box .vip-price > text {
  color: #ff8425;
}
.shopcart-item .price-number .price-box text {
  font-size: 20rpx;
}
.shopcart-item .price-number .count-box {
  float: right;
  width: 135rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 44rpx;
  height: 44rpx;
  /* border: 1rpx solid #f1f1f1; */
}

.shopcart-item .price-number .count-box text {
  background: #fff;
  color: #454545;
  font-size: 24rpx;
  width: 43rpx;
  height: 100%;
  text-align: center;
  /* display: inline-block; */
}
.shopcart-item .price-number .count-box .iconfont2 {
  font-size: 45rpx;
  line-height: 38rpx;
}
.shopcart-item .price-number .count-box view {
  width: 39rpx;
  height: 39rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 36rpx;
  background: #fdfdfd;
  color: #ff9f43;
  line-height: 34rpx;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

/* 购物车失效商品 */

.expiredGoods {
  margin-top: 20rpx;
  background: #fff;
  margin: 18rpx;
  border-radius: 10rpx;
}

.expiredGoods .shopcart-item {
  opacity: 0.5;
  margin-bottom: 0;
  /* border-bottom: 20rpx solid #f1f1f1; */
}

.custom-btn {
  width: 50rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-image {
  margin: 0 auto;
  display: block;
  padding: 0 14rpx;
}
.up-icon {
  width: 27rpx;
  height: 15rpx;
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(180deg);
}
.expiredGood-title-box {
  display: flex;
  align-items: center;
}

.expiredGoods .shopcart-item:last-child {
  border: none;
}

.expiredGoods .expiredGoodTitle {
  padding: 20rpx 40rpx 20rpx 40rpx;
  font-size: 26rpx;
  color: #000;
  display: flex;
  justify-content: space-between;
}

.expiredGoods .expiredGoodTitle .clearExpiredGood {
  color: #454545;
}

.shopcart-item .expired-tag {
  width: 136rpx;
  text-align: center;
  height: 46rpx;
  line-height: 46rpx;
  background: #f1f1f1;
  display: block;
  border-radius: 50%;
}

.expiredGoods .shopcart-item .price-number .count-box {
  /* float: right; */
  display: block;
  width: 135rpx;
  text-align: center;
  /* display: flex;
  justify-content: space-between;
  align-items: center; */
  height: 44rpx;
  line-height: 44rpx;
  background: #f1f1f1;
  border-radius: 50rpx;
  font-size: 24rpx;
  color: #666;
  /* border: 1rpx solid #f1f1f1; */
}

/* 底部消息 */
.money-detail {
  position: fixed;
  bottom: 98rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.money-detail.iphoneX-height {
  bottom: 68rpx;
}

.bottom-info {
  position: fixed;
  /* bottom: 38rpx; */
  bottom: 0;
  left: 0rpx;
  width: 100%;
  height: 96rpx;
  padding: 0 8rpx 0 30rpx;
  line-height: 130rpx;
  /* box-sizing: border-box; */
  border-top: 1px solid #f5f5f5;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 8;
}

.bottom-info.iphoneX-height {
  /* bottom: 68rpx; */
}

.bottom-info .check-box {
  width: 120rpx;
  height: 96rpx;
  line-height: 90rpx;
  float: left;
}

.bottom-info .checkbox {
  font-size: 28rpx;
  /* font-weight: bold; */
  color: #1b1b1d;
  line-height: 96rpx;
}

.bottom-info checkbox {
  /* line-height: 130rpx; */
  margin-top: -4rpx;
  width: 36rpx;
  margin-right: 10rpx;
  /* transform: scale(1.2, 1.2) */
}

.bottom-info .tocalc {
  display: block;
  background-color: #ff9f43;
  float: right;
  text-align: center;
  color: #fff;
  width: 218rpx;
  height: 70rpx;
  border-radius: 35rpx;
  font-size: 30rpx;
  line-height: 70rpx;
  font-weight: bold;
}

.bottom-info .calc-info {
  /* float: right; */
  height: 96rpx;
  width: 360rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
  font-size: 26rpx;
  color: #000000;
  letter-spacing: 1rpx;
  padding-right: 12rpx;
}

.bottom-info .calc-info view {
  height: 30rpx;
  line-height: 30rpx;
  overflow: hidden;
}

.bottom-info .calc-info view:first-child {
  font-size: 26rpx;
  color: #262626;
  /* margin-bottom: 12rpx; */
}
.bottom-info .calc-info .fz22 {
  font-size: 22rpx;
}
.bottom-info .calc-info .fz20 {
  font-size: 20rpx;
}

.bottom-info text {
  padding-top: 3rpx;
}

.bottom-info .total-price {
  color: #ff8425;
  letter-spacing: normal;
  font-weight: 700;
}
.discount-box {
  color: #ff8425;
  margin-top: 15rpx;
  font-size: 22rpx;
}
.bottom-info .delivery-fee {
  font-size: 18rpx;
  margin-left: 4rpx;
}

.guess-like {
  padding: 0rpx 30rpx;
  text-align: center;
}

.guess-like > image {
  width: 258rpx;
  height: 33rpx;
  margin: 30rpx 0rpx;
}

.guess-main {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 110rpx;
}

.guess-item {
  width: 330rpx;
  height: 330rpx;
  float: left;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.guess-item image {
  width: 100%;
  height: 330rpx;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 120rpx;
}

.no-data button {
  color: #ff9f43;
  border: 1px solid #ff9f43;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.header-info {
  padding: 19rpx 0;
  display: flex;
  justify-content: center;
  background: #fff;
  position: relative;
}

.header-info .nav-title {
  min-width: 126rpx;
  padding: 0 18rpx;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #ff9f43;
  text-align: center;
  margin: 0;
  border: 3rpx solid #ff9f43;
  border-left: 0;
  border-right: 0;
}
.header-info .header-tab {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-info .nav-title:first-of-type {
  border-top-left-radius: 33rpx;
  border-bottom-left-radius: 33rpx;
  border-left: 3rpx solid #ff9f43;
}

.header-info .nav-title:last-child {
  border-top-right-radius: 33rpx;
  border-bottom-right-radius: 33rpx;
  border-right: 3rpx solid #ff9f43;
}

.header-info .active {
  background: #ff9f43;
  color: #fff !important;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 8;
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  width: 624rpx;
  padding: 36rpx 0 0 0;
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  /* margin: 40% auto; */
  position: relative;
}

.modal-content .title {
  color: #232222;
  font-size: 36rpx;
  line-height: 42rpx;
  text-align: center;
  font-weight: normal;
}

.modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.modal-content .content .count-box {
  width: 354rpx;
  height: 80rpx;
  border: 1rpx solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.modal-content .content .count-box > view {
  /* border: 1rpx solid #ddd; */
  width: 79rpx;
  height: 100%;
  text-align: center;
  font-size: 48rpx;
  line-height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content .content .count-box > input {
  width: 194rpx;
  height: 100%;
  border: none;
  text-align: center;
  padding: 0;
  color: #313131;
  font-size: 48rpx;
}

.modal-content .content .count-box > view:first-of-type {
  border-right: 1rpx solid #ddd;
}

.modal-content .content .count-box > view:last-of-type {
  border-left: 1rpx solid #ddd;
}

.button-box {
  display: flex;
  width: 100%;
  height: 88rpx;
  position: absolute;
  bottom: 0;
}

.button-box button {
  flex: 1;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

button::after {
  border: none;
}

.button-box .confirm {
  background: #009f55;
  color: #fff;
}

.button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.popup-content {
  /* height: 264rpx; */
}

.popup-content-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80rpx;
}

.popup-content-box image {
  width: 255rpx;
}

/* 赠品相关 */

.gift-box {
  background: #fff6f0;
  min-height: 120rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  padding: 0 40rpx;
  font-size: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.gift-bottom-box {
  position: fixed;
  bottom: 190rpx;
}

.gift-bottom-box.iphoneX-height {
  position: fixed;
  bottom: 206rpx;
}

.gift-box view {
  display: flex;
  align-items: center;
}

.gift-box .gift-title {
  margin-right: 5rpx;
  height: 120rpx;
}

.gift-box .gift-item-box {
  width: calc(100% - 80rpx);
  display: flex;
  flex-direction: column;
}

.gift-box .gift-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 120rpx;
}

.gift-box .gift-item text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
}

.gift-bottom-box .gift-item-box {
  flex-direction: row !important;
}

.gift-bottom-box .gift-item {
  justify-content: flex-start !important;
}

.gift-img-box {
  width: 92rpx;
  height: 92rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  margin: 0 13rpx;
  border-radius: 6rpx;
}

.gift-img-box image {
  width: 100%;
  height: 100%;
}

.gift-box .gift-num {
  color: #ff3a00;
}

.page-content {
  padding-bottom: 130rpx;
}

.content-box {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner > view {
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

.vip-price {
  font-size: 32rpx;
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
  top: 0;
  z-index: 2;
  border-radius: 4rpx;
}

.recommend-block {
  padding-bottom: 130rpx;
  height: 100%;
}

.recommend-block.hasGift {
  padding-bottom: 226rpx;
}

.recommend-block.iphoneX-height {
  padding-bottom: 144rpx;
}

.recommend-block.iphoneX-height.hasGift {
  padding-bottom: 264rpx;
}

.oneMore-content {
  width: 546rpx;
  padding: 44rpx 50rpx 24rpx 50rpx;
  height: 400rpx;
  background: #fff;
  border-radius: 6rpx;
}

.oneMore-content-box {
}

.oneMore-title {
  font-size: 36rpx;
  line-height: 54rpx;
  color: #000000;
  text-align: center;
}

.oneMore-tips {
  font-size: 28rpx;
  line-height: 40rpx;
  margin-top: 6rpx;
  color: #626262;
  text-align: center;
}

.unsupported-product-box {
  padding: 34rpx 0 18rpx 0;
  height: 180rpx;
}

.unsupported-product-item {
  display: flex;
  justify-content: space-between;
  min-height: 48rpx;
  padding: 6rpx 0;
  align-items: center;
  line-height: 48rpx;
}

.unsupported-product-item .name {
  font-size: 32rpx;
  color: #1b1b1b;
  width: 354rpx;
  padding-right: 20rpx;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  flex-shrink: 0;
}

.unsupported-product-item .number {
  font-size: 22rpx;
  color: #b2b2b2;
  width: 70rpx;
  flex-shrink: 0;
}

.unsupported-product-item .number text {
  font-size: 26rpx;
  color: #b2b2b2;
}

.unsupported-product-item .reason {
  font-size: 26rpx;
  width: 118rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.oneMore-button {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.oneMore-button view {
  font-size: 28rpx;
  line-height: 56rpx;
  color: #009f55;
}

.require_label {
  color: #ff7200;
  font-size: 24rpx;
  height: 36rpx;
  width: 60rpx;
  text-align: center;
  line-height: 36rpx;
  border: 1rpx solid #ff7200;
  border-radius: 10rpx;
}

.money-detail-pop {
  width: 100%;
  position: relative;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;
  padding: 0 33rpx 128rpx 28rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.pop-content-data {
  padding: 8rpx 0;
}
.money-detail-pop-bg {
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: -20rpx;
}

.money-detail-pop .close-pop {
  position: absolute;
  right: 30rpx;
  top: 31rpx;
  width: 25rpx;
}

.money-detail-pop .close-pop image {
  width: 100%;
}

.money-detail-pop .pop-title {
  font-weight: 600;
  font-size: 32rpx;
  color: #000000;
  text-align: center;
  margin: 28rpx 0 10rpx 0;
}

.money-detail-pop .pop-title-tips {
  font-weight: 400;
  font-size: 24rpx;
  color: #a7a7a7;
  text-align: center;
  margin-bottom: 8rpx;
}

.money-detail-pop .pop-hd {
  font-weight: 700;
  font-size: 30rpx;
  color: #000000;
  margin-bottom: 16rpx;
  /* margin-top: 20rpx; */
}
.m-color {
  color: #ff8425;
}

.flex-between {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-weight: 400;
  line-height: 54rpx;
}
/* .pop-sum {
  margin-top: 24rpx;
} */

.pop-sum {
  font-weight: 400;
  font-size: 28rpx;
  color: #000000;
}

.pop-discount {
  font-weight: 400;
  font-size: 28rpx;
  color: #000000;
}

/* .pop-discount {
  margin-top: 10rpx;
} */

.money-detail-pop .pop-discount-item {
  font-weight: 400;
  font-size: 24rpx;
  color: #6f6f6f;
  /* margin-top: 10rpx; */
}

.content-border {
  border-top: 1px solid #f4f5f7;
}
.pop-content-data-settele .flex-between {
  font-size: 28rpx;
  font-weight: 400;
  align-items: center;
  line-height: 48rpx;
}
.pop-content-data-settele .flex-between text {
  color: #ff8425;
}
.pop-content-data-settele .flex-between .price-tip {
  color: #a7a7a7;
  font-size: 24rpx;
}
.pop-content-data-settele .settle-btn {
  width: 194rpx;
  height: 70rpx;
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eb702d;
  border-radius: 35rpx;
}
.cash-discount {
  color: #6f6f6f;
  font-size: 24rpx;
  line-height: 40rpx;
  padding-left: 20rpx;
  box-sizing: border-box;
  margin-bottom: 10rpx;
}
.no-data-tip {
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
}
</style>
