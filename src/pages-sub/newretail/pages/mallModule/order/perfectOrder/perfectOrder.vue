<template>
  <!-- pages/perfectOrder/perfectOrder.wxml -->
  <!--  -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <notify id="top-notify">
      <custom-loading v-if="state.customLoading"></custom-loading>
      <view class="page">
        <view class="top-info top-info-new"
          v-if="state.orderType != 'service' && (state.type == 'dispatch' || state.type === 'logistical' || state.displayAddressFlag)">
          <image class="icon-top-more" :src="state.imagesPath.iconOrderTopMore"></image>
          <view
            :class="'receive-box ' + (state.orderType === 'distribution' || state.isDistributionOrder ? 'distribution' : '')"
            @click="toChooseAddress">
            <view class="icon-box">
              <image :src="state.imagesPath.iconOrderPosition"></image>
            </view>
            <view class="receive-info">
              <view class="name-mobile" :hidden="state.addressInfo ? true : false">
                <text>{{state.addressInfo.contacts}}</text>
                <text>{{state.addressInfo.contactsMobile}}</text>
              </view>
              <view class="receive-address" :hidden="state.addressInfo ? true : false">
                {{state.addressInfo.province + state.addressInfo.city + state.addressInfo.county + state.addressInfo.detailedAddress + state.addressInfo.houseNum}}
              </view>
              <view :hidden="state.addressInfo ? false : true">请选择收货地址</view>
            </view>
            <view class="iconright-box">
              <image :src="state.imagesPath.iconRight2"></image>
            </view>
          </view>
        </view>
        <view v-else-if="state.orderType == 'service'" class="store-info-box">
          <view>
            <view class="store-text">
              <image :src="state.imagesPath.houseIcon" mode="heightFix"></image>
              {{state.storeInfo.name}}
            </view>
          </view>
          <view>
            <view class="store-text">
              <image :src="state.imagesPath.floristAddress" mode="heightFix"></image>
              {{state.storeInfo.address}}
            </view>
            <view class="store-msg">
              <image :src="state.imagesPath.floristIconStoreNav" @click.stop="viewStoreLocation" mode="heightFix">
              </image>
              <image :src="state.imagesPath.floristMobile" @click.stop="contactStore" mode="heightFix"></image>
            </view>
          </view>
        </view>
        <view v-if="state.orderType != 'service'">
          <view v-for="(item , goodTypeIndex) in state.goodTypeList" class="good-type-box">
            <view class="good-type-title">
              <!-- v-if="multipleOrdersFlag" -->
              <view style="color: #000"
                v-if="item.orderType != 'normal' && item.orderType != 'distribution' && item.orderType != 'nextDay'">
                商品信息</view>
              <view :style="'color: ' + (item.isDistributionOrder ? state.shoppingData.distribution.color : '#F66600')"
                v-else-if="item.isDistributionOrder && state.shoppingData.distribution">
                {{state.shoppingData.distribution.labelName}}</view>
              <view
                :style="'color: ' + (state.shoppingData[item.orderType] ? state.shoppingData[item.orderType].color : '#F66600')"
                v-else-if="state.shoppingData[item.orderType]">{{state.shoppingData[item.orderType].labelName}}</view>
              <view
                :style="'color: ' + (state.shoppingData[item.orderType] ? state.shoppingData[item.orderType].color : '#F66600')"
                v-else>{{state.shoppingData.store ? state.shoppingData.store.labelName : '门店商品'}}</view>
              <!-- <image v-if="item.orderType == 'distribution'" src="{{state.imagesPath.distributionGood}}" mode="heightFix" class="good-type-icon"></image>
          <image v-else-if="item.orderType == 'nextDay'" src="{{state.imagesPath.nextDayGood}}" mode="heightFix" class="good-type-icon"></image>
          <image v-else src="{{state.imagesPath.storeGood}}" mode="heightFix" class="good-type-icon"></image> -->
            </view>
            <view class="group-top" v-if="item.orderType === 'group'">
              <image class="group-bg" :src="state.imagesPath.perfectOrderImg" mode="widthFix"></image>
            </view>
            <view class="group-top" v-if="item.orderType === 'solitaire'">
              <image class="group-bg" :src="state.imagesPath.perfectOrderSolitaireImg" mode="widthFix"></image>
            </view>
            <!-- 预售和拼团支持配送方式 -->
            <view :class="'good-type-config-item ' + (item.orderType === 'CYCLE' ? '' : 'background-box')"
              :style="item.orderType === 'CYCLE' ? '' : state.theme && state.theme.BgColorRgb01"
              v-if="item.orderType !== 'distribution' && item.orderType !== 'solitaire' && !item.isDistributionOrder">
              <view class="delivery-method-name"
                v-if="item.orderType !== 'distribution' && item.orderType !== 'solitaire' && !item.isDistributionOrder">
                配送方式</view>
              <view class="type-check-box"
                :hidden="item.orderType === 'distribution' || item.orderType === 'solitaire' || item.isDistributionOrder">
                <view v-for="(item , index) in item.shipmentSortList" :key="item">
                  <view :class="'self-take ' + (state.goodTypeList[goodTypeIndex].type == 'selftake' ? 'active' : '')"
                    :style="(state.goodTypeList[goodTypeIndex].type == 'selftake' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb) + ' ' + (state.goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : '')"
                    data-type="selftake" :data-idx="goodTypeIndex"
                    @click="goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'"
                    v-if="state.canSelfmention && item == 'SELF'">
                    <image v-if="state.goodTypeList[goodTypeIndex].type != 'selftake'"
                      :src="state.imagesPath.iconOrderSelfTake"></image>
                    <image v-if="state.goodTypeList[goodTypeIndex].type == 'selftake'"
                      :src="state.imagesPath.iconOrderSelfTakeActive"></image>
                    <text
                      :style="state.goodTypeList[goodTypeIndex].type == 'selftake' ? state.theme.mainColor : ''">到店自提</text>
                  </view>
                  <view :class="'dispatch ' + (state.goodTypeList[goodTypeIndex].type == 'dispatch' ? 'active' : '')"
                    :style="(state.goodTypeList[goodTypeIndex].type == 'dispatch' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb) + ' ' + (state.goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : '')"
                    data-type="dispatch" :data-idx="goodTypeIndex"
                    @click="goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'"
                    v-if="state.canDelivery && item == 'EXPRESS'">
                    <image v-if="state.goodTypeList[goodTypeIndex].type != 'dispatch'"
                      :src="state.imagesPath.iconOrderTakeout"></image>
                    <image v-if="state.goodTypeList[goodTypeIndex].type == 'dispatch'"
                      :src="state.imagesPath.iconOrderTakeoutActive"></image>
                    <!-- <text v-if="item.orderType === 'CYCLE'" style="{{type=='selftake'? theme.mainColor:''}}">同城配送</text> -->
                    <text
                      :style="state.goodTypeList[goodTypeIndex].type == 'dispatch' ? state.theme.mainColor : ''">{{item.orderType === 'distribution' || state.isDistributionOrder ? "快递配送" : "外卖配送"}}</text>
                  </view>
                  <view :class="'dispatch ' + (state.type === 'logistical' ? 'active' : '')"
                    :style="(state.type === 'logistical' ? state.theme.mainColor + state.theme.borderColor : state.theme.borderColorRgb + state.theme.mainColorRgb) + ' ' + (state.goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : '')"
                    data-type="logistical"
                    @click="goodTypeList[goodTypeIndex].optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'"
                    v-if="!state.multipleOrdersFlag && state.canDelivery && item == 'LOGISTICAL'">
                    <image v-if="state.type != 'logistical'" :src="state.imagesPath.iconOrderDistribution"></image>
                    <image v-if="state.type == 'logistical'" :src="state.imagesPath.iconOrderDistributionActive">
                    </image>
                    <text :style="state.type == 'logistical' ? state.theme.mainColor : ''">快递配送</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="block-box" v-if="item.orderType === 'CYCLE'">
              <!-- bindtap="addRemarks" -->
              <view class="row">
                <view class="title">首次配送时间</view>
                <view class="right">
                  <view class="info">{{state.showFirstTime}}</view>
                </view>
              </view>
            </view>
            <view
              v-if="(item.orderType === 'group' || item.orderType === 'advanceSell' || item.orderType === 'solitaire' && !item.isDistributionOrder) && (item.type == 'selftake' || item.type == 'dispatch') && item.deliveryTimeData && !item.isDistributionOrder && item.deliveryTimeData.length > 0"
              :class="'delivery-time-box background-box ' + (item.showTimeChoose ? 'time-point' : '')"
              :style="(state.theme && state.theme.BgColorRgb01) + (item.orderType === 'advanceSell' ? 'margin:0 0 20rpx 0' : '')">
              <view class="picker time-picker">
                <view :data-idx="goodTypeIndex" @click="chooseTime">
                  <view>
                    <image class="left-icon" :src="state.imagesPath.iconSelfTake"></image>
                    <text class="color-454545" v-if="item.type == 'dispatch'">配送时间</text>
                    <text class="color-454545" v-else>自提时间</text>
                  </view>
                  <view>
                    <text>{{item.storePickupTime}}</text>
                    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                </view>
                <popup :show="item.showTime" position="bottom">
                  <time-picker @onClose="onClose" :title="item.type == 'dispatch' ? '配送时间' : '自提时间'"
                    :deliveryTimeData="item.deliveryTimeData" :deliveryTime="item.deliveryTime"
                    :data-idx="goodTypeIndex" @selectTime="selectTime"></time-picker>
                </popup>
              </view>
            </view>
            <view class="self-time-box"
              v-if="(item.orderType === 'group' || item.orderType === 'advanceSell' || item.orderType === 'solitaire' && !item.isDistributionOrder) && (item.type == 'selftake' || item.type == 'dispatch') && item.orderType != 'nextDay' && item.deliveryTimeData && !item.isDistributionOrder && item.deliveryTimeData.length > 0"
              :style="item.orderType === 'advanceSell' ? 'margin:0 0 20rpx 0' : ''">
              <view class="picker time-picker">
                <view :data-idx="goodTypeIndex" @click="chooseTime">
                  <view>
                    <image class="left-icon" :src="state.imagesPath.iconSelfTake"></image>
                    <text class="color-454545" v-if="item.type == 'dispatch'">配送时间</text>
                    <text class="color-454545" v-else>自提时间</text>
                  </view>
                  <view>
                    <text>{{item.storePickupTime}}</text>
                    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                </view>
                <popup :show="item.showTime" position="bottom">
                  <time-picker @onClose="onClose" :title="item.type == 'dispatch' ? '配送时间' : '自提时间'"
                    :deliveryTimeData="item.deliveryTimeData" :deliveryTime="item.deliveryTime"
                    :data-idx="goodTypeIndex" @selectTime="selectTime"></time-picker>
                </popup>
              </view>
            </view>
            <!-- 自提时间没有模板的时候 不让选择 -->
            <!-- 新版自提时间 增加外卖配送时间 -->
            <view class="good-type-config-item self-time-box background-box"
              :style="state.theme && state.theme.BgColorRgb01"
              v-if="item.orderType !== 'CYCLE' && item.orderType !== 'group' && item.orderType !== 'advanceSell' && item.orderType !== 'solitaire' && item.orderType != 'distribution' && item.deliveryTimeData.length > 0">
              <view class="picker time-picker">
                <view :data-idx="goodTypeIndex" @click="chooseTime">
                  <view>
                    <!-- <image class='left-icon' src='{{imagesPath.iconSelfTake}}'></image> -->
                    <text v-if="item.type == 'dispatch'">配送时间</text>
                    <text v-else>自提时间</text>
                  </view>
                  <view>
                    <text :style="state.theme.mainColor">{{item.storePickupTime}}</text>
                    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                </view>
                <popup :show="item.showTime" @close="onClose" position="bottom">
                  <time-picker :title="item.type == 'dispatch' ? '配送时间' : '自提时间'"
                    :deliveryTimeData="item.deliveryTimeData" :deliveryTime="item.deliveryTime"
                    :data-idx="goodTypeIndex" @onClose="onClose" @selectTime="selectTime"></time-picker>
                </popup>
              </view>
            </view>
            <!-- 增加外卖配送时间 -->
            <view class="good-type-config-item self-time-box" v-if="item.orderType == 'nextDay'">
              <view class="picker time-picker">
                <view>
                  <view>
                    <text v-if="item.type == 'dispatch'">配送时间</text>
                    <text v-else>自提时间</text>
                  </view>
                  <view>
                    <text :style="state.theme.mainColor">{{item.showPageText}}</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="selftake-remind" :style="state.theme.mainColor"
              v-if="state.hasStockWarning && state.multiIndex[0] === 0">门店当日库存变化较大，推荐提前联系门店确认是否有货。</view>
            <!-- <view class="store-info"> -->
            <view class="goods-list" v-if="item.goodsList && (item.goodsNum <= 1 || !state.multipleOrdersFlag)">
              <!-- v-show="!(item.optionalShipmentType && !item.optionalShipmentType[goodTypeList[goodTypeIndex].shipmentType])" -->
              <view class="goods-item-box" v-for="(item , index) in item.goodsList" :key="index">
                <view class="goods-item">
                  <view class="goods-img">
                    <image :src="item.imageUrl" mode="aspectFit"></image>
                    <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId"
                      :src="state.imagesPath.iconSeckillSeat"></image>
                    <view class="stop-sell" :hidden="item.businessStatus || item.businessStatus == null">暂停售卖
                    </view>
                  </view>
                  <view class="goods-info">
                    <view class="goods-left">
                      <view class="goods-name"
                        v-if="state.goodTypeList[goodTypeIndex].cycleDetails && !item.giftProduct">
                        {{state.goodTypeList[goodTypeIndex].cycleDetails.cycleName}}</view>
                      <view class="goods-name" v-else>{{item.name}}</view>
                      <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                        <text v-for="(item , index) in item.groupProducts"
                          :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                      </view>
                      <view class="goods-desc" v-else-if="state.goodTypeList[goodTypeIndex].cycleId">
                        {{item.giftProduct ? '赠品' : state.goodTypeList[goodTypeIndex].cycleActiveDes}}</view>
                      <!-- <text class="goods-desc" v-else-if="item.description">{{item.description}}</text> -->
                      <view v-if="item.require" class="require_label">
                        必选
                      </view>
                      <!-- <view class="goods-desc" v-if="item.mealDetails && item.mealDetails !== ''">
                              {{item.mealDetails}}</view> -->

                      <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                      <view class="goods-desc" v-else>{{item.specs ? item.specs : ''}}</view>
                      <!-- <view class="goods-desc" v-if="item.deliveryTimeStatement && state.goodTypeList[goodTypeIndex].orderType !== 'CYCLE' && state.goodTypeList[goodTypeIndex].orderType !== 'advanceSell'" style="color: #ff9f43;">
                              {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view> -->
                      <view class="goods-advanceSell-price"
                        v-if="state.goodTypeList[goodTypeIndex].orderType === 'advanceSell'">
                        <!-- {{item.addvanceSellPrice===item.sellPrice ? '预售价' : '定金'}}￥{{item.sellPrice}}</view> -->
                        {{item.addvanceSellPrice === item.sellPrice ? '预售价' : state.goodTypeList[goodTypeIndex].advanceSellInfo.payType === 'FULL' ? '全款' : '定金'}}￥{{item.sellPrice}}
                      </view>
                      <!-- <view class='goods-price' v-if="state.orderType === 'CYCLE'">
                            <text class="nowPrice"><text>￥</text>{{state.allPrice}}</text> 
                          </view> -->
                      <view class="goods-price" v-if="state.goodTypeList[goodTypeIndex].orderType === 'scoreMall'">
                        <text class="nowPrice"><text>￥</text>{{state.goodTypeList[goodTypeIndex].integral}}</text> 积分
                      </view>
                      <view class="goods-price"
                        v-else-if="state.goodTypeList[goodTypeIndex].orderType === 'advanceSell'"></view>
                      <view class="goods-price" v-else>
                        <text
                          class="nowPrice"><text>￥</text>{{state.goodTypeList[goodTypeIndex].orderType === 'CYCLE' && !item.giftProduct ? state.goodTypeList[goodTypeIndex].allPrice : item.sellPrice || '0'}}</text>
                        <text class="oldPrice"
                          v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].sellPrice">￥{{orderDetailGood[item.productId].sellPrice}}</text>
                      </view>
                      <!-- <view class='goods-price' v-else>
                              <text class="nowPrice"><text>{{state.orderType === 'CYCLE' && !item.giftProduct ? '￥' : ''}}</text>{{state.orderType === 'CYCLE' ? !item.giftProduct ? state.allPrice : '赠品' : item.sellPrice}}</text>
                              <text class="oldPrice" v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].sellPrice">￥{{orderDetailGood[item.productId].sellPrice}}</text>
                          </view> -->
                    </view>
                    <view class="goods-right">
                      <view class="goods-count"
                        v-if="state.scource === 'SHOPPINGCART' || state.goodTypeList[goodTypeIndex].orderType === 'solitaire' || state.goodTypeList[goodTypeIndex].orderType == 'packaging'">
                        x{{item.productNum}}</view>
                      <view class="goods-count-box" v-else>
                        <view :data-idx="goodTypeIndex" :data-id="item.id" class="iconfont icon-jianhao"
                          @click.stop="goodTypeList[goodTypeIndex].orderType=='packaging'? '':'handleReduce'"
                          :style="'color:' + (item.productNum > 1 ? state.theme.color : '#BBBBBC')"
                          :hidden="item.status === 'DELETED' || item.balance <= 0"></view>
                        <text :data-idx="goodTypeIndex" :data-id="item.id"
                          @click.stop="goodTypeList[goodTypeIndex].orderType=='packaging'?'':'handleNumber'">{{item.productNum}}</text>
                        <view :data-idx="goodTypeIndex" :data-id="item.id" class="iconfont icon-jiahao2fill"
                          :style="'color: ' + state.theme.color + ';'"
                          @click.stop="goodTypeList[goodTypeIndex].orderType=='packaging'? '':'handleAdd'"
                          :hidden="item.status === 'DELETED' || item.balance <= 0"></view>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="gift-box" v-if="false">
                  <view class="gift-title">赠品:</view>
                  <view class="gift-item-box">
                    <view class="gift-item" v-for="(item , index) in item.goodsPromotions" :key="i">
                      <view>
                        <view class="gift-img-box">
                          <image :src="item.goods.image"></image>
                        </view>
                        <text>{{item.goods.name}}</text>
                      </view>
                      <view class="gift-num">x{{item.count}}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="goods-list" v-else-if="item.goodsNum > 1">
              <view class="goods-item-box">
                <view class="goods-item goods-item1">
                  <view class="goods-item-img">
                    <view class="goods-img" v-for="(item , index) in item.goodsList" :key="index" :hidden="index >= 1">
                      <image :src="item.imageUrl" mode="aspectFit"></image>
                    </view>
                  </view>
                  <view class="good-num" @click="showGood" :data-idx="goodTypeIndex">
                    共{{item.goodsNum}}件
                    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                </view>
              </view>
            </view>
            <!-- 不可购买商品 -->
            <view class="not-goods-tip" v-if="item.notGoodsList && item.notGoodsList.length > 0">以下商品不支持当前配送方式</view>
            <view class="goods-list not-goods" v-if="item.notGoodsList && item.notGoodsList.length > 0">
              <view class="goods-item-box">
                <view class="goods-item goods-item1">
                  <view class="goods-item-img">
                    <view class="goods-img" v-for="(item , index) in item.notGoodsList" :key="index"
                      :hidden="index >= 1">
                      <view class="mask-layer"></view>
                      <image :src="item.imageUrl" mode="aspectFit"></image>
                    </view>
                  </view>
                  <view class="good-num" @click="showGood" data-type="not" :data-idx="goodTypeIndex">
                    共{{item.notGoodsNum || 0}}件
                    <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                </view>
              </view>
            </view>
            <view class="promotions-box" v-if="item.goodsPromotions.length > 0 || state.couponPromotions.length > 0">
              <view class="promotions-item" v-for="(item , index) in item.goodsPromotions" :key="index">
                <view class="label" :style="state.theme.mainBgColor">赠品</view>
                <view class="title promotions-data">
                  <view>{{item.goods.name}}</view>
                  <text>x{{item.count}}</text>
                </view>
              </view>
              <view class="promotions-item" v-for="(item , index) in state.couponPromotions" :key="index">
                <view class="label" :style="state.theme.mainBgColor">返券</view>
                <view class="title">{{item.coupon.name}}</view>
              </view>
            </view>
            <view class="gift-bottom-box" v-if="false">
              <view class="gift-box">
                <view class="gift-title">赠品:</view>
                <view class="gift-item-box">
                  <view class="gift-item" v-for="(item , index) in state.giftGoodsList" :key="i">
                    <view class="gift-img-box">
                      <image :src="item.image"></image>
                    </view>
                    <view class="gift-num">x{{item.productNum}}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="bill-details">
              <!-- <view class="discount-amounts">已优惠￥{{filters.toFix(totalDiscount + shipmentCouponDiscount  )}}</view> -->
              <view class="balance-accounts">
                商品小计：
                <text>￥{{filters.toFix(item.allPrice)}}</text>
              </view>
            </view>
            <view class="good-type-config-item store-info"
              v-if="state.solitaireType !== 'ACTIVITY' && !item.isDistributionOrder && item.orderType !== 'distribution'">
              <view>配送门店</view>
              <!-- bindtap="{{(goodTypeList[goodTypeIndex].orderType == 'normal' || goodTypeList[goodTypeIndex].orderType == 'nextDay') && goodTypeList[goodTypeIndex].type=='selftake' ? 'changeStore' : ''}}"  -->
              <view class="store-details" :data-idx="goodTypeIndex">
                <view>{{item.storeName ? item.storeName : state.storeInfo.name}}</view>
                <!-- <image class="right-point" src="{{imagesPath.iconRight2}}" v-if="(goodTypeList[goodTypeIndex].orderType == 'normal' || goodTypeList[goodTypeIndex].orderType == 'nextDay') && goodTypeList[goodTypeIndex].type=='selftake'"></image> -->
                <!-- <image src="{{state.imagesPath.changeStore}}" bindtap="changeStore" data-idx="{{goodTypeIndex}}" v-if="state.goodTypeList[goodTypeIndex].orderType == 'normal' && state.goodTypeList[goodTypeIndex].type == 'selftake'" mode="heightFix"></image>
            <image src="{{state.imagesPath.perfectOrderAddress}}"  data-idx="{{goodTypeIndex}}" bindtap="viewStoreLocation" mode="heightFix"></image> -->
                <!-- <view class="address">{{storeInfo.address}}</view> -->
              </view>
              <!-- v-if="type==='dispatch' || type==='logistical'" -->
              <!-- <block v-if="state.goodTypeList[goodTypeIndex].type === 'dispatch' || state.goodTypeList[goodTypeIndex].type === 'logistical'">
            <view class="open-map" style="{{state.theme.mainColor}}" bindtap="viewStoreLocation" v-if="item.orderType !== 'group' && item.orderType !== 'distribution'">查看地图</view>
          </block>
          <block v-else>
            <view class="icon-right-box" bindtap="changeStore">
              修改门店
              <image src="{{state.imagesPath.iconRight2}}" ></image>
            </view>
          </block> -->
            </view>
            <view v-if="item.type == 'dispatch' && item.optimalStore && item.optimalStore.show" class="change-store">
              <view class="change-tip">推荐更换更优门店：</view>
              <view class="store-name">{{item.optimalStore.name}}</view>
              <view class="icon-right-box" :style="state.theme.mainColor" :data-idx="goodTypeIndex"
                @click="switchStore">
                【切换】
              </view>
            </view>
            <!-- && ( item.shipmentAmount || item.orderType === 'CYCLE') -->
            <view class="section-box dispatching-fee" v-if="item.type === 'dispatch' || item.type === 'logistical'">
              <view class="left">运费<text
                  style="display: inline-block;margin-left: 12rpx; color: #333333;font-weight: 400;"
                  v-if="item.shipmentAmount != 0 && item.orderType === 'CYCLE' && item.cycleFee > 0">￥{{state.shipmentAmount}}
                  X {{item.cyclePhaseTotal}}期</text></view>
              <view v-if="item.shipmentAmount != 0">
                <view v-if="item.isShowAddressTips">
                  {{item.shipmentAmount > 0 ? '￥' + (item.orderType === 'CYCLE' ? state.cycleFee : item.shipmentAmount) : '0'}}
                </view>
                <view v-else style="color: #a8a8a8;">
                  超出配送范围
                </view>
              </view>
              <view v-else>
                <view v-if="item.isShowAddressTips">
                  {{item.shipmentAmount == 0 ? '免运费' : ''}}
                </view>
                <view v-else style="color: #a8a8a8;">
                  超出配送范围
                </view>
              </view>
            </view>

            <view class="pay-item"
              v-if="item.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || item.orderType === 'advanceSell' || item.orderType === 'scoreMall' || item.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || item.orderType === 'solitaire' || item.orderType === 'packaging' || item.orderType === 'CYCLE' && state.cycleDetails.useCoupons === 0 || !state.isDiscountCoupons ? false : true">
              <view class="left">
                优惠券
              </view>
              <view class="right coupon" :data-idx="goodTypeIndex"
                @click="item.allPrice + item.shipmentAmount <= 0 ? '' : 'toChoiceCoupon'" data-type="discount">
                <view v-if="item.orderType == 'group'">
                  <text class="text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                  <view v-else>
                    <text class="text" :hidden="!item.couponDiscount ? false : true"
                      v-if="state.hasAvailableCoupon">{{item.discountNum > 0 ? item.discountNum + '张可用优惠券' : '请选择优惠券'}}</text>
                  </view>
                </view>
                <view v-else>
                  <view v-if="state.hasAvailableCoupon">
                    <text class="text"
                      :hidden="!item.couponDiscount ? false : true">{{item.discountNum > 0 ? item.discountNum + '张可用优惠券' : '请选择优惠券'}}</text>
                  </view>
                </view>
                <view :hidden="item.couponDiscount && item.couponDiscount !== 0 ? false : true">
                  <view class="coupon-amount-box">
                    <text class="coupon-amount">-￥{{filters.toFix(item.couponDiscount)}}</text>
                  </view>
                </view>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
            <view class="pay-item" :hidden="item.type === 'selftake' || item.shipmentAmount == 0"
              v-if="item.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || item.orderType === 'advanceSell' || item.orderType === 'scoreMall' || item.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || item.orderType === 'solitaire' || item.orderType === 'packaging' || !state.isFreightVoucher ? false : true">
              <view class="left">运费券</view>
              <view class="right coupon" :data-idx="goodTypeIndex" @click="toChoiceCoupon" data-type="freeship">
                <view v-if="item.orderType == 'group'">
                  <text class="coupon-text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                  <view v-else>
                    <text class="coupon-text"
                      :hidden="item.shipmentCouponDiscount === 0 ? false : true">{{item.freeshipNum > 0 ? item.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                  </view>
                </view>
                <view v-else>
                  <view v-if="state.hasAvailableCoupon">
                    <text class="coupon-text"
                      :hidden="item.shipmentCouponDiscount === 0 ? false : true">{{item.freeshipNum > 0 ? item.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                  </view>
                </view>
                <view
                  :hidden="item.shipmentCouponDiscount !== 0 && item.freeshipList && item.freeshipList.length > 0 ? false : true">
                  <view class="coupon-amount-box">
                    <!-- <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                            lazy-load="false" />
                        <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                            lazy-load="false" /> -->
                    <text class="coupon-amount">-￥{{filters.toFix(item.shipmentCouponDiscount)}}</text>
                  </view>
                </view>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
            <view class="pay-item" @click="addRemarks" :data-idx="goodTypeIndex">
              <view class="title">备注</view>
              <view class="right coupon">
                <view class="coupon-text" :style="item.remarks ? 'color: #000' : ''">
                  {{item.remarks ? item.remarks : '添加备注'}}</view>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
            <view class="row" v-if="state.showInvoice" @click="toInvoice">
              <view class="title">发票信息</view>
              <view class="right">
                <view class="info" v-if="state.invoice">
                  {{state.invoice.type === "1" ? "个人或事业单位" : "企业"}}-{{state.invoice.title}}
                </view>
                <view class="info" v-else>商家支持开具体发票</view>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
          </view>
        </view>
        <view v-else>
          <view v-for="(item , goodTypeIndex) in state.goodTypeList" class="good-type-box good-type-box1">
            <view class="goods-list" v-if="item.goodsList">
              <view class="goods-item-box" v-for="(item , index) in item.goodsList" :key="index">
                <view class="goods-item goods-item1">
                  <view class="goods-img">
                    <image :src="item.imageUrl" mode="aspectFit"></image>
                    <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId"
                      :src="state.imagesPath.iconSeckillSeat"></image>
                    <view class="stop-sell" :hidden="item.businessStatus || item.businessStatus == null">暂停售卖
                    </view>
                  </view>
                  <view class="goods-info">
                    <view class="goods-left" style="max-width: 480rpx">
                      <view>
                        <view class="goods-name">{{item.name}}</view>
                        <view class="service-msg" v-if="state.serviceStaffData">
                          <image class="gradeImg" v-if="state.serviceStaffData.gradeImg" mode="heightFix"
                            :src="state.serviceStaffData.gradeImg"></image>
                          {{state.serviceStaffData.nickname}}（服务时长：{{state.serviceDuration1 ? state.serviceDuration1 + '-' : ''}}{{state.serviceDuration}}分钟）
                        </view>
                      </view>
                      <view class="goods-label" v-if="item.labelName">{{item.labelName}}</view>
                      <view class="goods-desc" v-else>{{item.specs ? item.specs : ''}}</view>
                      <view class="goods-advanceSell-price"
                        v-if="state.goodTypeList[goodTypeIndex].orderType === 'advanceSell'">
                        {{item.addvanceSellPrice === item.sellPrice ? '预售价' : state.goodTypeList[goodTypeIndex].advanceSellInfo.payType === 'FULL' ? '全款' : '定金'}}￥{{item.sellPrice}}
                      </view>

                      <view class="goods-price" v-if="state.goodTypeList[goodTypeIndex].orderType === 'scoreMall'">
                        <text class="nowPrice"><text>￥</text>{{state.goodTypeList[goodTypeIndex].integral}}</text> 积分
                      </view>
                      <view class="goods-price"
                        v-else-if="state.goodTypeList[goodTypeIndex].orderType === 'advanceSell'"></view>
                      <view class="goods-price" v-else>
                        <text
                          class="nowPrice"><text>￥</text>{{state.goodTypeList[goodTypeIndex].orderType === 'CYCLE' && !item.giftProduct ? state.goodTypeList[goodTypeIndex].allPrice : item.sellPrice || '0'}}</text>
                        <text class="oldPrice"
                          v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].sellPrice">￥{{orderDetailGood[item.productId].sellPrice}}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="block-box" v-if="state.orderType == 'service'">
          <view class="pay-item">
            <view class="left">预约人</view>
            <view class="right appointment-item">
              <input :value="state.appointmentUser" placeholder="请填写预约人" @input="bindAppointmentUser">
            </view>
          </view>
          <view class="pay-item">
            <view class="left">预约人手机号</view>
            <view class="right appointment-item appointment-item1">
              <input :value="state.appointmentMobile" placeholder="请填写预约人手机号" @input="bindAppointmentMobile">
            </view>
          </view>
          <view class="pay-item">
            <view class="left">预约时间</view>
            <view class="right appointment-item1">{{state.appointmentTime}}</view>
          </view>
          <view class="pay-item" @click="addRemarks" data-idx="0">
            <view class="left">订单备注</view>
            <view class="right coupon">
              <view class="coupon-text" :style="state.remarks ? 'color: #000' : ''">
                {{state.remarks ? state.remarks : '添加备注'}}</view>
              <image class="right-point" :src="state.imagesPath.iconRight2"></image>
            </view>
          </view>
        </view>
        <!-- <view class='goods-box'>
        <view class="title-box">商品信息</view>
        <view class="goods-list">
            <view class="goods-item-box" v-for="(item, index) in state.goodsList" wx:key="index" v-show="!(index > 2 && !state.showMore)">
                <view class='goods-item'>
                    <view class='goods-img'>
                        <image src="{{item.imageUrl}}" mode="aspectFit"></image>
                        <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId"
                            src="{{state.imagesPath.iconSeckillSeat}}">
                        <view class="stop-sell" v-show="!(item.businessStatus || item.businessStatus == null)">暂停售卖
                        </view>
                    </view>
                    <view class="goods-info">
                        <view class="goods-left">
                          <view class='goods-name' v-if="state.cycleDetails && !item.giftProduct">{{state.cycleDetails.cycleName}}</view>
                            <view class='goods-name' v-else>{{item.name}}</view>
                            <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                                <text v-for="(item, index) in item.groupProducts" wx:key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                            </view>
                            <view class="goods-desc" v-else-if="state.cycleId">{{state.cycleActiveDes}}</view>
                            <text class="goods-desc" v-else-if="item.description">{{item.description}}</text>
                            <view v-if="item.require" class="require_label">
                                必选
                            </view>
                            <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                            <view class='goods-desc' v-else>{{item.specs ? item.specs : ''}}</view>
                            <view class="goods-desc" v-if="item.deliveryTimeStatement && state.orderType !== 'CYCLE'" style="color: #ff9f43;">
                                {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view>
                            <view class='goods-advanceSell-price' v-if="state.orderType === 'advanceSell'">
                                {{item.addvanceSellPrice === item.sellPrice ? '预售价' : state.advanceSellInfo.payType === 'FULL' ? '全款' : '定金'}}￥{{item.sellPrice}}</view>
                            <view class='goods-price' v-if="state.orderType === 'scoreMall'">
                                <text class="nowPrice"><text>￥</text>{{state.integral}}</text> 积分
                            </view>
                            <view class='goods-price' v-else-if="state.orderType === 'advanceSell'"></view>
                            <view class='goods-price' v-else>
                                <text class="nowPrice"><text>￥</text>{{state.orderType === 'CYCLE' && !item.giftProduct ? state.allPrice : item.sellPrice}}</text>
                                <text class="oldPrice" v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].sellPrice">￥{{orderDetailGood[item.productId].sellPrice}}</text>
                            </view>
                        </view>
                        <view class="goods-right">
                            <view class="goods-count" v-if="state.scource === 'SHOPPINGCART' || state.orderType === 'solitaire' || state.orderType == 'packaging'">
                                x{{item.productNum}}</view>
                            <view class="goods-count-box" v-else>
                                <view :dataId="item.id" class="iconfont icon-jianhao" @click="state.orderType == 'packaging' ? '' : 'handleReduce'"
                                    style="color:{{item.productNum > 1 ? state.theme.color : '#BBBBBC'}}"
                                    v-show="!(item.status === 'DELETED' || item.balance <= 0)"></view>
                                <text :dataId="item.id"
                                    @click="state.orderType == 'packaging' ? '' : 'handleNumber'">{{item.productNum}}</text>
                                <view :dataId="item.id" class="iconfont icon-jiahao2fill" style="color: {{state.theme.color}};" @click="state.orderType == 'packaging' ? '' : 'handleAdd'"
                                    v-show="!(item.status === 'DELETED' || item.balance <= 0)"></view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class='gift-box' v-if="false">
                    <view class="gift-title">赠品:</view>
                    <view class="gift-item-box">
                        <view class="gift-item" v-for="(item, index) in item.goodsPromotions" wx:key="i">
                            <view>
                                <view class="gift-img-box">
                                    <image src="{{item.goods.image}}"></image>
                                </view>
                                <text>{{item.goods.name}}</text>
                            </view>
                            <view class='gift-num'>x{{item.count}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="viewMore" bindtap="viewMore" v-if="state.goodsList.length > 3">{{state.showMore ? "点击收起" : "查看更多"}}
            <image src="{{state.showMore ? state.imagesPath.iconCollect : state.imagesPath.iconDropDown}}"></image>
        </view>
        <view class='section-box dispatching-fee' v-if="(state.type === 'dispatch' || state.type === 'logistical') && (state.shipmentAmount || state.orderType === 'CYCLE')">
            <view class="left">派送费<text style="display: inline-block;margin-left: 12rpx; color: #333333;font-weight: 400;" v-if="state.shipmentAmount != 0 && state.orderType === 'CYCLE' && state.cycleFee > 0">￥{{state.shipmentAmount}} X {{state.cyclePhaseTotal}}期</text></view>
            <view v-if="state.shipmentAmount != 0">
              <view v-if="state.isShowAddressTips">
                {{state.shipmentAmount > 0 ? '￥' + (state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount) : '0'}}
              </view>
              <view v-else style="color: #a8a8a8;">
                超出配送范围
              </view>
            </view>
            <view v-else>
              <view v-if="state.isShowAddressTips">
                {{state.shipmentAmount == 0 ? '包邮' : ''}}
              </view>
              <view v-else style="color: #a8a8a8;">
                超出配送范围
              </view>
            </view>
        </view>
        <view class="promotions-box" v-if="state.goodsPromotions.length > 0 || state.couponPromotions.length > 0">
            <view class="promotions-item" v-for="(item, index) in state.goodsPromotions" wx:key="index">
                <view class="label" style="{{state.theme.mainBgColor}}">赠品</view>
                <view class="title promotions-data">
                  <view>{{item.goods.name}}</view>
                  <text>x{{item.count}}</text>
                </view>
            </view>
            <view class="promotions-item" v-for="(item, index) in state.couponPromotions" wx:key="index">
                <view class="label" style="{{state.theme.mainBgColor}}">返券</view>
                <view class="title">{{item.coupon.name}}</view>
            </view>
        </view>
        <view class='gift-bottom-box' v-if="false">
            <view class='gift-box'>
                <view class="gift-title">赠品:</view>
                <view class="gift-item-box">
                    <view class="gift-item" v-for="(item, index) in state.giftGoodsList" wx:key="i">
                        <view class="gift-img-box">
                            <image src="{{item.image}}"></image>
                        </view>
                        <view class='gift-num'>x{{item.productNum}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view> -->
        <view v-if="state.planTextTip" style="padding-left: 20rpx;margin: -12rpx 0 15rpx;font-size: 24rpx;color: red">
          {{state.planTextTip}}</view>
        <view class="block-box">
          <view class="block-title">金额明细</view>
          <!-- <view class="pay-item">
            <view class="left">支付方式
            </view>
            <view class="right type-box">
                <view class="{{!state.useStoredValueCard ? 'active' : ''}}"
                    style="{{!state.useStoredValueCard ? state.theme.mainBgColor : ''}}" catch:tap='weixinPay'>
                    微信支付
                </view>
                <view v-if="state.orderType !== 'advanceSell'" bindtap="handleSelectStoredValueCard" class="{{state.useStoredValueCard ? 'active' : ''}}" style="{{state.useStoredValueCard ? state.theme.mainBgColor : ''}}">
                储值支付
                </view>
            </view>
        </view> -->
          <view v-if="false">
            <view class="pay-item" v-if="state.useStoredValueCard">
              <view class="left">账户余额
                <text>(剩下可用：{{state.storedValueCard.balance}})</text>
              </view>
              <view class="right">
                <view class="deduction-amount" v-if="state.orderType !== 'CYCLE'">
                  -￥{{filters.toFix(state.storedValueCard.useAmount)}}</view>
                <view class="deduction-amount" v-else>
                  -￥{{filters.toFix(state.allPrice - state.totalDiscount + state.cycleFee - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}
                </view>
              </view>
            </view>
            <view class="pay-item"
              v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseScore || state.orderType === 'advanceSell' && !state.advanceSellPayment || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'solitaire' || state.orderType === 'packaging' || !state.isPointsRedemption ? false : true">
              <!-- bindtap="handleScoreChoice" -->
              <!-- catch:tap='viewScoreWarn' -->
              <view class="left" :data-scorerule="state.scoreInfo.scoreRule">积分抵扣
                <!-- <image class="tips" src="{{imagesPath.iconOrderTips}}" ></image> -->
              </view>
              <!-- 最多可抵 -->
              <view class="right score">
                <view class="deduction-amount" v-if="state.orderType !== 'CYCLE'">-￥{{filters.toFix(state.scoreAmount)}}
                </view>
                <view class="deduction-amount" v-else>
                  -￥{{filters.toFix(state.allPrice - state.totalDiscount + state.cycleFee - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}
                </view>
                <!-- <view class="checkbox-icon  {{useScore ?'active':''}}"></view> -->
              </view>
            </view>
            <view class="pay-item"
              v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || state.orderType === 'advanceSell' && !state.advanceSellPayment || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire' || state.orderType === 'packaging' || !state.isDiscountCoupons ? false : true">
              <view class="left">
                优惠券
              </view>
              <view class="right coupon" @click="allPrice + shipmentAmount - scoreAmount <= 0 ? '' : 'toChoiceCoupon'"
                data-type="discount">
                <view v-if="state.orderType == 'group'">
                  <text class="text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                  <view v-else>
                    <text class="text" :hidden="state.couponDiscount === 0 ? false : true"
                      v-if="state.hasAvailableCoupon">{{state.discountNum > 0 ? state.discountNum + '张可用优惠券' : '暂无可用优惠券'}}</text>
                  </view>
                </view>
                <view v-else>
                  <view v-if="state.hasAvailableCoupon">
                    <text class="text"
                      :hidden="state.couponDiscount === 0 ? false : true">{{state.discountNum > 0 ? state.discountNum + '张可用优惠券' : '暂无可用优惠券'}}</text>
                  </view>
                </view>
                <view :hidden="state.couponDiscount !== 0 ? false : true">
                  <view class="coupon-amount-box">
                    <!-- <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" />
                            <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" /> -->
                    <text class="coupon-amount">-￥{{filters.toFix(state.couponDiscount)}}</text>
                  </view>
                </view>
                <image class="right-point" :src="state.imagesPath.iconRight2"></image>
              </view>
            </view>
            <!-- <view class="pay-item" v-show="!(state.type === 'selftake')"
                v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || state.orderType === 'advanceSell' || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire' || state.orderType === 'packaging' ? false : true">
                <view class="left">运费券</view>
                <view class="right coupon" bindtap="toChoiceCoupon" data-type="freeship">
                    <block v-if="state.orderType == 'group'">
                        <text class="coupon-text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                        <block v-else>
                            <text class="coupon-text"
                                v-show="!(state.shipmentCouponDiscount === 0 ? false : true)">{{state.freeshipNum > 0 ? state.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                        </block>
                    </block>
                    <block v-else>
                        <block v-if="state.hasAvailableCoupon">
                            <text class="coupon-text"
                                v-show="!(state.shipmentCouponDiscount === 0 ? false : true)">{{state.freeshipNum > 0 ? state.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                        </block>
                    </block>
                    <view v-show="!(state.shipmentCouponDiscount !== 0 && state.couponInfo.data.freeship.length > 0 ? false : true)">
                        <view class='coupon-amount-box'>
                            <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" />
                            <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" />
                            <text class="coupon-amount">-￥{{filters.toFix(state.shipmentCouponDiscount)}}</text>
                        </view>
                    </view>
                    <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
                </view>
            </view> -->
            <!-- <view class="pay-item"
                v-if="!(state.orderType === 'advanceSell' || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'group' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire') && state.systemOptions.isGiftCard">
                <view class="left">礼品卡</view>
                <view class="right coupon" bindtap="toChoiceGiftCard">
                    <block v-if="state.hasAvailableGiftCard">
                        <text class="text" v-show="!(state.giftCardDiscount > 0 ? true : false)">{{state.giftCardNum}}张可用礼品卡</text>
                    </block>
                    <block v-else>
                        <text class="text">暂无可用礼品卡</text>
                    </block>
                    <view v-show="!(state.giftCardDiscount !== 0 ? false : true)">
                        <view class='coupon-amount-box'>
                            <text class="coupon-amount">-￥{{state.giftCardDiscount}}</text>
                        </view>
                    </view>
                    <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
                </view>
            </view> -->
          </view>

          <!-- v-if="!useStoredMspCard" -->
          <view>
            <view class="pay-item">
              <view class="left">商品总价</view>
              <view class="right">
                <text>+￥{{state.allPrice}}</text>
              </view>
            </view>
            <view class="pay-item" v-if="state.shipmentAmount > 0">
              <view class="left">运费总价</view>
              <view class="right">
                <text>+￥{{state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount}}</text>
              </view>
            </view>
            <view class="pay-item" v-if="state.cashDiscount > 0">
              <view class="left">活动优惠</view>
              <view class="right">
                <text class="amount-box">-￥{{state.cashDiscount}}</text>
                <view class="custom-btn" @click="changeShowDiscount">
                  <image :src="state.imagesPath.upIcon" :class="state.showDiscount ? 'up-icon' : 'up-icon rotate-icon'"
                    mode=""></image>
                </view>
              </view>
            </view>
            <view class="pay-item pay-item1" v-if="state.showDiscount && state.cashDiscount > 0">
              <view class="left">{{state.cashDiscountName}}</view>
              <view class="right">
                <text class="amount-box">-￥{{state.cashDiscount}}</text>
              </view>
            </view>
            <view class="pay-item" v-if="state.inputAmount > 0">
              <view class="left">整单优惠</view>
              <view class="right">
                <text class="amount-box">-￥{{state.inputAmount}}</text>
              </view>
            </view>
            <!-- <view class="pay-item"
                v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || state.orderType === 'advanceSell' || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire' || state.orderType === 'packaging' || state.orderType === 'CYCLE' && state.cycleDetails.useCoupons === 0 || !state.isDiscountCoupons ? false : true">
                <view class="left">
                    优惠券
                </view>
                <view class="right coupon" bindtap="{{state.allPrice + state.shipmentAmount - state.scoreAmount <= 0 ? '' : 'toChoiceCoupon'}}" data-type="discount">
                    <block v-if="state.orderType == 'group'">
                        <text class="text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                        <block v-else>
                            <text class="text" v-show="!(state.couponDiscount === 0 ? false : true)"
                                v-if="state.hasAvailableCoupon">{{state.discountNum > 0 ? state.discountNum + '张可用优惠券' : '暂无可用优惠券'}}</text>
                        </block>
                    </block>
                    <block v-else>
                        <block v-if="state.hasAvailableCoupon">
                            <text class="text"
                                v-show="!(state.couponDiscount === 0 ? false : true)">{{state.discountNum > 0 ? state.discountNum + '张可用优惠券' : '暂无可用优惠券'}}</text>
                        </block>
                    </block>
                    <view v-show="!(state.couponDiscount !== 0 ? false : true)">
                        <view class='coupon-amount-box'>
                            <text class="coupon-amount">-￥{{filters.toFix(state.couponDiscount)}}</text>
                        </view>
                    </view>
                    <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
                </view>
            </view> -->
            <view class="pay-item" v-if="state.couponDiscount > 0">
              <view class="left">优惠券优惠合计</view>
              <view class="right">
                <view class="coupon-amount-box">
                  <text class="coupon-amount">-￥{{state.couponDiscount}}</text>
                </view>
              </view>
            </view>
            <view class="pay-item" v-if="state.shipmentCouponDiscount > 0">
              <view class="left">运费优惠合计</view>
              <view class="right">
                <view class="coupon-amount-box">
                  <text class="coupon-amount">-￥{{state.shipmentCouponDiscount}}</text>
                </view>
              </view>
            </view>
            <!-- <view class="pay-item" v-show="!(state.type === 'selftake')"
                v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseCoupon || state.orderType === 'advanceSell' || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire' || state.orderType === 'packaging' || state.orderType === 'CYCLE' && state.cycleDetails.useCoupons === 0 ? false : true">
                <view class="left">运费券</view>
                <view class="right coupon" bindtap="toChoiceCoupon" data-type="freeship">
                    <block v-if="state.orderType == 'group'">
                        <text class="coupon-text" v-if="!state.systemOptions.teamOrderCanUseCoupon">活动不可用券</text>
                        <block v-else>
                            <text class="coupon-text"
                                v-show="!(state.shipmentCouponDiscount === 0 ? false : true)">{{state.freeshipNum > 0 ? state.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                        </block>
                    </block>
                    <block v-else>
                        <block v-if="state.hasAvailableCoupon">
                            <text class="coupon-text"
                                v-show="!(state.shipmentCouponDiscount === 0 ? false : true)">{{state.freeshipNum > 0 ? state.freeshipNum + '张可用运费券' : '暂无可用运费券'}}</text>
                        </block>
                    </block>
                    <view v-show="!(state.shipmentCouponDiscount !== 0 && state.couponInfo.data.freeship.length > 0 ? false : true)">
                        <view class='coupon-amount-box'>
                            <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" />
                            <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                lazy-load="false" />
                            <text class="coupon-amount">-￥{{filters.toFix(state.shipmentCouponDiscount)}}</text>
                        </view>
                    </view>
                    <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
                </view>
            </view> -->
            <!-- bindtap="handleScoreChoice" -->
            <!-- <view class="pay-item"
                v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseScore || state.orderType === 'advanceSell' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'solitaire' || state.orderType === 'packaging' ? false : true"
                >
                <view class="left" data-scorerule="{{state.scoreInfo.scoreRule}}">积分抵扣
                </view>
                <view class="right score">
                    <view class='deduction-amount'>-￥{{filters.toFix(state.scoreAmount)}}</view>
                </view>
            </view> -->
          </view>

          <!-- <view class="pay-item" v-if="state.useStoredMspCard">
            <view class="left">余额</view>
            <view class="right coupon" bindtap="toChoiceMspCard">
                <block v-if="!state.accountDetail.balance">
                    <text class="text">选择余额</text>
                </block>
                <view v-show="!(state.accountDetail.balance ? false : true)">
                    <view class='coupon-amount-box'>
                        <text class="coupon-amount">{{state.accountDetail.companyName}} (剩余：{{state.accountDetail.balance}})</text>
                    </view>
                </view>
                <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
            </view>
        </view> -->

          <view class="bill-details">
            <view class="discount-amounts" v-if="state.totalDiscount + state.shipmentCouponDiscount > 0">
              已优惠￥{{filters.toFix(state.totalDiscount + state.shipmentCouponDiscount)}}</view>
            <view class="balance-accounts">
              支付金额：
              <text>￥{{filters.toFix(state.allPrice - state.totalDiscount + (state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount) - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}</text>
              <!-- <text>￥{{filters.toFix(allPrice)}}</text> -->
            </view>
          </view>
          <view class="dividing-line"
            v-if="(state.orderType !== 'advanceSell' || state.advanceSellPayment || state.advanceisGiftPayment) && (state.isStoredPayment || state.isGiftPayment)">
            <!-- <image src="{{imagesPath.iconDividingline}}" mode="widthFix"></image> -->
          </view>
          <view class="block-title"
            v-if="(state.orderType !== 'advanceSell' || state.advanceSellPayment || state.advanceisGiftPayment) && (state.isStoredPayment || state.isGiftPayment)">
            支付信息</view>
          <view class="pay-item"
            v-if="(state.orderType !== 'advanceSell' || state.advanceSellPayment) && state.isStoredPayment"
            @click="handleSelectStoredValueCard">
            <view class="left">储值支付
              <text>（余额：{{state.storedValueCard.balance}}）</text>
            </view>
            <view class="right">
              <view class="deduction-amount" v-if="state.orderType !== 'CYCLE'">
                -￥{{filters.toFix(state.storedValueCard.useAmount)}}</view>
              <view class="deduction-amount" v-else>
                -￥{{filters.toFix(state.allPrice - state.totalDiscount + state.cycleFee - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}
              </view>
              <view class="checkbox-icon" :style="'background-image: url(' + state.imagesPath.iconUnchecked + ')'">
                <view class="active" :style="'background-image: url(' + state.imagesPath.iconChecked1 + ')'"
                  v-if="state.useStoredValueCard"></view>
              </view>
            </view>
            <!-- <view class="right">
            账户余额:  (剩余可用：{{state.storedValueCard && state.storedValueCard.balance ? state.storedValueCard.balance : 0}})
          </view> -->
          </view>
          <!-- orderType === 'packaging' ||  -->
          <view class="pay-item"
            v-if="!(state.orderType === 'advanceSell' && !state.advanceisGiftPayment || state.orderType === 'scoreMall' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'group' || state.mallOrderType === 'OFFLINE' && state.offlinType === 'cashReceipt' || state.orderType === 'solitaire') && state.systemOptions.isGiftCard && state.isGiftPayment">
            <view class="left">礼品卡</view>
            <view class="right coupon" @click="toChoiceGiftCard">
              <view v-if="state.hasAvailableGiftCard">
                <text class="text"
                  :hidden="state.giftCardDiscount > 0 ? true : false">{{state.giftCardNum}}张可用礼品卡</text>
              </view>
              <view v-else-if="!state.hasAvailableGiftCard">
                <text class="text">暂无可用礼品卡</text>
              </view>
              <view v-if="state.hasAvailableGiftCard && state.giftCardDiscount > 0">
                <view class="coupon-amount-box">
                  <text class="deduction-amount">-￥{{state.giftCardDiscount}}</text>
                </view>
              </view>
              <image class="right-point" :src="state.imagesPath.iconRight2"></image>
            </view>
          </view>
          <view class="pay-item"
            v-if="state.orderType === 'group' && !state.systemOptions.teamOrderCanUseScore || state.orderType === 'advanceSell' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'solitaire' || state.orderType === 'packaging' || !state.isPointsRedemption ? false : true"
            @click="handleScoreChoice">
            <view class="left" :data-scorerule="state.scoreInfo.scoreRule" @click.stop="viewScoreWarn">积分抵扣
              <image class="tips" :src="state.imagesPath.iconOrderTips"></image>
            </view>
            <view class="right score">最多可抵
              <view class="deduction-amount">-￥{{filters.toFix(state.scoreAmount)}}</view>
              <view :class="'checkbox-icon  ' + (state.useScore ? 'active' : '')"></view>
            </view>
          </view>
        </view>
        <!-- <view class="block-box">
        <view class="row" bindtap="addRemarks">
            <view class="title">订单备注</view>
            <view class="right">
                <view class="info">{{state.remarks ? state.remarks : '添加备注'}}</view>
                <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
            </view>
        </view>
        <view class="row" v-if="state.showInvoice" bindtap="toInvoice">
            <view class="title">发票信息</view>
            <view class="right">
                <view class="info" v-if="state.invoice">{{state.invoice.type === "1" ? "个人或事业单位" : "企业"}}-{{state.invoice.title}}
                </view>
                <view class="info" v-else>商家支持开具体发票</view>
                <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
            </view>
        </view>
    </view> -->
        <view class="bottom-box">
          <view class="order-price">
            合计:
            <text
              v-if="state.orderType === 'CYCLE'">￥{{filters.toFix(state.allPrice - state.totalDiscount + state.cycleFee - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}</text>
            <text
              v-else>￥{{filters.toFix(state.allPrice - state.totalDiscount + state.shipmentAmount - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}</text>
          </view>
          <view v-if="state.type == 'selftake'">
            <!-- <form bindsubmit="togglePaymentPopup"> -->
            <form @submit="createOrderTip">
              <button class="btn" :style="state.theme.mainBgColor" form-type="submit"
                :hidden="state.checkedProducts ? false : true">提交订单</button>
            </form>
            <view class="btn unavailable" :hidden="!state.checkedProducts ? false : true">提交订单</view>
          </view>
          <view v-else>
            <!-- <form bindsubmit="togglePaymentPopup"> -->
            <form @submit="createOrderTip">
              <!-- disabled="{{ btnDisabled }}" -->
              <button class="btn" :style="state.theme.mainBgColor" form-type="submit"
                :hidden="state.calculatedDeliveryFee && state.checkedProducts ? false : true">提交订单</button>
            </form>
            <view class="btn unavailable"
              :hidden="!state.calculatedDeliveryFee || !state.checkedProducts ? false : true">提交订单
            </view>
          </view>
        </view>
      </view>
      <view class="payment-type" v-if="state.goodDetailShow" @click="changeGoodDetailShow">
        <view class="payment-model" @click.stop="">
          <view class="spec-close-box" @click="changeGoodDetailShow">
            <image :src="state.imagesPath.iconCloseImg" mode="widthFix"></image>
          </view>
          <view class="model-title">商品信息</view>
          <view class="model-body">
            <view class="goods-item-box"
              v-for="(item , index) in state.goodTypeList[editActiveIdx][showGoodType && showGoodType == 'not' ? 'notGoodsList' : 'goodsList']"
              :key="index">
              <view class="goods-item">
                <view class="goods-img">
                  <image :src="item.imageUrl" mode="aspectFit"></image>
                </view>
                <view class="goods-info">
                  <view class="goods-left">
                    <view class="goods-name">{{item.name}}</view>
                    <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                      <text v-for="(item , index) in item.groupProducts"
                        :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                    </view>
                    <!-- <text class="goods-desc" v-else-if="item.description">{{item.description}}</text> -->
                    <view v-if="item.require" class="require_label">
                      必选
                    </view>
                    <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                    <view class="goods-desc" v-else-if="item.specs">{{item.specs ? item.specs : ''}}</view>
                    <text class="goods-desc" v-else></text>
                    <!-- <view class="goods-desc" v-if="item.deliveryTimeStatement && state.goodTypeList[goodTypeIndex].orderType !== 'advanceSell'" style="color: #ff9f43;">
                        {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view> -->
                    <view class="goods-advanceSell-price"
                      v-if="state.goodTypeList[editActiveIdx].orderType === 'advanceSell'">
                      <!-- {{item.addvanceSellPrice===item.sellPrice ? '预售价' : '定金'}}￥{{item.sellPrice}}</view> -->
                      {{item.addvanceSellPrice === item.sellPrice ? '预售价' : state.goodTypeList[editActiveIdx].advanceSellInfo.payType === 'FULL' ? '全款' : '定金'}}￥{{item.sellPrice}}
                    </view>
                    <!-- <view class='goods-price' v-if="state.orderType === 'CYCLE'">
                      <text class="nowPrice"><text>￥</text>{{state.allPrice}}</text> 
                    </view> -->
                    <view class="goods-price" v-if="state.goodTypeList[editActiveIdx].orderType === 'scoreMall'">
                      <text class="nowPrice"><text>￥</text>{{state.goodTypeList[editActiveIdx].integral}}</text> 积分
                    </view>
                    <view class="goods-price" v-else-if="state.goodTypeList[editActiveIdx].orderType === 'advanceSell'">
                    </view>
                    <view class="goods-price" v-else>
                      <text
                        class="nowPrice"><text>￥</text>{{state.goodTypeList[editActiveIdx].orderType === 'CYCLE' && !item.giftProduct ? state.goodTypeList[editActiveIdx].allPrice : item.sellPrice || '0'}}</text>
                      <text class="oldPrice"
                        v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].sellPrice">￥{{orderDetailGood[item.productId].sellPrice}}</text>
                    </view>
                  </view>
                  <view class="goods-right">
                    <view class="goods-count"
                      v-if="state.scource === 'SHOPPINGCART' || state.orderType === 'solitaire' || state.orderType == 'packaging'">
                      x{{item.productNum}}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--<view class="payment-type" v-if="state.paymentPopup" bindtap="togglePaymentPopup">
    <view class="payment-model" catchtap>
        <view class='spec-close-box' bindtap="togglePaymentPopup">
            <image src='{{state.imagesPath.iconCloseImg}}' mode="widthFix"></image>
          </view>
        <view class="model-title">选择支付方式</view>
        <view class="model-price">
            <view>待支付</view>
            <view>￥{{filters.toFix(state.allPrice - state.totalDiscount + state.shipmentAmount - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount)}}</view>
        </view>
        <view class="model-type-box">
            <view class="model-type-item" v-if="false">
                <view>
                    <view class="model-type-title">余额支付</view>
                    <view class="coupon" bindtap="toChoiceMspCard">
                        <block v-if="!state.accountDetail.balance">
                            <text class="text">选择余额</text>
                        </block>
                        <view v-show="!(state.accountDetail.balance ? false : true)">
                            <view class='coupon-amount-box'>
                                <text class="coupon-amount">{{state.accountDetail.companyName}} (剩余：{{state.accountDetail.balance}})</text>
                            </view>
                        </view>
                        <image class="right-point" src="{{state.imagesPath.iconRight2}}" ></image>
                    </view>
                </view>
                <checkbox checked="{{state.useStoredMspCard}}" color="{{state.theme.color}}" catch:tap="{{state.iScard ? 'handleSelectMspCard' : 'iScardBtn'}}"/>
            </view>
            <view  class="model-type-item" v-if="state.orderType !== 'advanceSell'">
                <view>
                  <view class="model-type-title">储值支付</view>
                  <view class="coupon">
                    账户余额:  (剩余可用：{{state.storedValueCard && state.storedValueCard.balance ? state.storedValueCard.balance : 0}})
                  </view>
              </view>
              <checkbox checked="{{state.useStoredValueCard}}" color="{{state.theme.color}}" catch:tap="handleSelectStoredValueCard"/>
            </view>
            <view class="model-type-item">
                <view>
                    <view class="model-type-title">微信支付</view>
                    <view>还需支付{{filters.toFix(state.allPrice - state.totalDiscount + state.shipmentAmount - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount - (state.accountDetail && state.accountDetail.balance && state.useStoredMspCard ? state.accountDetail.balance : 0))}}</view>
                </view>
                <checkbox checked="{{state.useWxValue}}" color="{{state.theme.color}}" catch:tap='weixinPay'/>
            </view>
        </view>
        <view catchtap="createOrder1" class="payment-btn" style="{{state.theme.mainBgColor}}">
            支付
        </view>
    </view>
</view>-->
      <popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
        <view class="popup-content">
          <view class="title">账单明细</view>
          <view class="popup-content-box">
            <view class="price-detail">
              <view>
                <text class="color-454545" v-if="state.orderType !== 'advanceSell'">商品金额</text>
                <text class="color-454545" v-if="state.orderType === 'advanceSell'">预付定金</text>
                <text class="color-ff7171">￥{{filters.toFix(state.allPrice)}}</text>
              </view>
              <view>
                <text class="color-454545">派送费</text>
                <text class="color-454545"
                  :hidden="state.shipmentCouponDiscount === 0">(运费券已减{{state.shipmentCouponDiscount}}元)</text>
                <text class="color-ff7171">+￥{{state.shipmentRealPay}}</text>
              </view>
              <view>
                <text class="color-454545">储值支付</text>
                <text class="color-ff7171">-￥{{state.cardDeductTotal}}</text>
              </view>
              <view>
                <text class="color-454545">积分抵扣</text>
                <text class="color-ff7171">-￥{{state.scoreDiscount}}</text>
              </view>
              <view>
                <text class="color-454545">优惠券</text>
                <text class="color-ff7171">-￥{{state.couponDiscount}}</text>
              </view>
              <view v-if="state.systemOptions.isGiftCard && state.giftCardDiscount > 0">
                <text class="color-454545">礼品卡</text>
                <text class="color-ff7171">-￥{{state.giftCardDiscount >= 0 ? state.giftCardDiscount : 0.00}}</text>
              </view>
              <view :hidden="state.cashDiscount > 0 ? false : true">
                <text class="color-454545">活动优惠</text>
                <text class="color-ff7171">-￥{{state.cashDiscount}}</text>
              </view>
              <view :hidden="state.inputAmount > 0 ? false : true">
                <text class="color-454545">整单优惠</text>
                <text class="color-ff7171">-￥{{state.inputAmount}}</text>
              </view>
            </view>
            <view class="realpay">
              实付款:
              <text>￥{{filters.toFix(state.allPrice + state.shipmentAmount - state.inputAmount)}}</text>
            </view>
          </view>
          <view class="button" :style="state.theme.mainBgColor" @click="toggleMiddlePopup">确 定</view>
        </view>
      </popup>
      <popup :show="state.show.number" position="middle" custom-class="middle" @close="toggleNumberPopup">
        <view class="number-modal-body">
          <view class="number-modal-content">
            <view class="title">修改购买数量</view>
            <view class="content">
              <view class="count-box">
                <view @click.stop="handleProductNumReduce" :hidden="item.status === 'DELETED' || item.balance <= 0">
                  <text>-</text>
                </view>
                <input cursor="0" selection-start="1" selection-end="1" :value="state.goodsInfo.productNum"
                  @input="bindProductNumInput" type="number" maxlength="3">
                <view @click.stop="handleProductNumAdd" :hidden="item.status === 'DELETED' || item.balance <= 0">+
                </view>
              </view>
            </view>
            <view class="button-box">
              <button class="cancel" :data-id="state.goodsInfo.id" @click.stop="onCancel">取消</button>
              <button class="confirm" :style="state.theme.mainBgColor" :data-id="state.goodsInfo.id"
                @click.stop="onConfirm">确认</button>
            </view>
          </view>
        </view>
      </popup>
      <popup :show="state.show.pass" position="middle" custom-class="middle" @close="toggleNumberPopup">
        <view class="number-modal-body">
          <view class="number-modal-contentA">
            <view class="title">{{state.titleActive}}</view>
            <view class="content">
              <view class="goods-list">
                <view class="goods-item-box" v-for="(item , index) in passProductActive" :key="index">
                  <view class="goods-item">
                    <view class="goods-img">
                      <image :src="item.imageUrl" mode="aspectFit"></image>
                    </view>
                    <view class="goods-info">
                      <view class="goods-left">
                        <view class="goods-name">{{item.name}}</view>
                        <view class="goods-desc" v-if="item.mealDetails && item.mealDetails">
                          {{item.mealDetails}}</view>
                        <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                        <view class="goods-desc" v-else>{{item.specs ? item.specs : ''}}</view>
                        <!-- <view class="goods-desc" v-if="item.deliveryTimeStatement && item.orderType !== 'advanceSell'"
                                        style="color: #ff9f43;">
                                        {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view> -->
                        <view class="goods-price" v-if="state.orderType === 'advanceSell'"></view>
                        <view class="goods-price" v-else>
                          <text class="nowPrice" v-if="item.sellPrice"><text>￥</text>{{item.sellPrice}}</text>
                        </view>
                      </view>
                      <view class="goods-right">
                        <view class="goods-count">
                          x{{item.productNum}}</view>

                      </view>
                    </view>
                  </view>
                  <!-- <view style="color: salmon;margin-bottom: 14rpx;">
                            备注：{{item.remark}}
                        </view> -->
                </view>
              </view>
              <view style="color: salmon;margin-bottom: 14rpx;">
                备注：继续下单将默认删除失效商品
              </view>
            </view>
            <view class="button-box">
              <button class="cancel" :data-id="state.goodsInfo.id" @click.stop="onCancelA">取消</button>
              <button class="confirm" :style="state.theme.mainBgColor" :data-id="state.goodsInfo.id"
                @click.stop="passProudrtBtn">继续下单</button>
            </view>
          </view>
        </view>
      </popup>
      <popup :show="state.orderStoreTip" position="middle" custom-class="middle" @close="toggleOrderStoreTip">
        <view class="number-modal-body">
          <view class="number-modal-content number-modal-content1">
            <view class="title">请确认下单门店</view>
            <view class="content">
              <view class="store-name">
                {{state.storeInfo.name}}
              </view>
              <view class="store-address">
                {{state.storeInfo.address}}
              </view>
              <view class="time-box-store">
                <view class="time-item">
                  <image :src="state.imagesPath.time_new_icon" mode="widthFix"></image>
                  <view>营业时间 {{state.storeInfo.storeHours}}</view>
                </view>
                <view class="time-item">
                  <image :src="state.imagesPath.phone_new_icon" mode="widthFix"></image>
                  <view>{{state.storeInfo.tel}}</view>
                </view>
              </view>
            </view>
            <view class="button-box1">
              <button class="cancel" @click.stop="changeStore"
                :style="'border: 1rpx solid ' + state.theme.color + ';color: ' + state.theme.color">更换门店</button>
              <button class="confirm" :style="state.theme.mainBgColor" @click.stop="createOrder">确认提交</button>
            </view>
          </view>
        </view>
      </popup>
      <pay :order-data="state.order" :pay-method="state.payMethod" @paidOrder="paidOrder" @myevent="onMyEvent"
        :storedValueCard="state.storedValueCard" @continuePay="handleContinuePay" @loadingChange="loadingChange"
        @orderCancel="handleOrderCancel" @orderPay="handleOrderPay"></pay>
    </notify>
  </view>
</template>
<script setup>
import _utilsLogJs from "@/utils/newretail/log";
import _apiSystemServiceJs2 from "@/service/api/newretail/systemService";
import _apiInvoiceServiceJs from "@/service/api/newretail/invoiceService";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _componentsNotifyNotifyJs from "@/pages-sub/newretail/components/notify/notify";
import _componentsNavigationBarNavigationBarJs from "@/pages-sub/newretail/components/navigation-bar/navigation-bar";
import _componentsCustomLoadingCustomLoadingJs from "@/pages-sub/newretail/components/customLoading/customLoading";
import _componentsPopupPopupJs from "@/pages-sub/newretail/components/popup/popup";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiCycleServiceJs from "@/service/api/newretail/cycleService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
import _apiSolitaireServiceJs from "@/service/api/newretail/solitaireService";
import _apiPromotionServiceJs from "@/service/api/newretail/promotionService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiPackagingServiceJs from "@/service/api/newretail/packagingService";
import _apiFloristServiceJs from "@/service/api/newretail/floristService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _apiAddressServiceJs from "@/service/api/newretail/addressService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/perfectOrder/perfectOrder.js
const orderService = _apiOrderServiceJs;
const sysService = _apiSystemServiceJs;
const addressService = _apiAddressServiceJs;
const distributionService = _apiDistributionServiceJs;
const teamBuyService = _apiTeamBuyServiceJs;
const storeService = _apiStoreServiceJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const floristService = _apiFloristServiceJs;
const packagingService = _apiPackagingServiceJs;
const couponService = _apiCouponServiceJs;
const productService = _apiProductServiceJs;
const promotionService = _apiPromotionServiceJs;
const solitaireService = _apiSolitaireServiceJs;
const giftCardService = _apiGiftCardServiceJs;
const request = _apiRequestJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const memberService = _apiMemberServiceJs;
const cycleService = _apiCycleServiceJs;
const auth = _utilsAuthJs;
const Notify = _componentsNotifyNotifyJs;
const NavigationBar = _componentsNavigationBarNavigationBarJs;
const CustomLoading = _componentsCustomLoadingCustomLoadingJs;
const Popup = _componentsPopupPopupJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const THEME = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
const invoiceService = _apiInvoiceServiceJs;
const systemService = _apiSystemServiceJs2;
const logs = _utilsLogJs;
import shopcartService from '@/service/api/newretail/shopcartService';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import pay from '@/pages-sub/newretail/components/pay/pay.vue';
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
let canGetAvailableCouponNum = true;
let canCalcPromotions = true;
const state = reactive({
  serviceDuration1: '',
  serviceDuration: '',
  // 服务时长
  appointmentTime: '',
  // 预约时间
  serviceStaffData: {},
  appointmentUser: '',
  // 预约人
  appointmentMobile: '',
  // 预约人手机号
  orderStoreTip: false,
  placeOrderConfirmStore: null,
  nextDayStartTime: null,
  // 次日达开始时间
  nextDayEndTime: null,
  // 次日达结束时间
  nextDayCutOffTime: null,
  // 次日达截单时间
  enableCutoff: true,
  // 是否开启截单
  customLoading: false,
  shoppingData: {},
  advanceSellPayment: false,
  advanceisGiftPayment: false,
  isPointsRedemption: false,
  isDiscountCoupons: true,
  isFreightVoucher: true,
  isStoredPayment: true,
  isGiftPayment: true,
  editActiveIdx: 0,
  goodDetailShow: false,
  // 商品明细显示
  displayAddressFlag: false,
  // 是否显示地址选择框
  allGoodList: [],
  // 当前订单中所有商品数据
  goodTypeList: [{
    deliveryTimeData: [],
    // 后端提供的时间数据
    advanceSellInfo: {},
    //预售相关信息
    teamBuyInfo: {},
    optionalShipmentType: {
      'SELF': true,
      'EXPRESS': true,
      'LOGISTICAL': true
    },
    optimalStore: {
      show: false
    },
    storeInfo: {
      shipmentTypes: []
    },
    orderType: 'normal',
    advanceSellInfo: {
      shipmentType: null
    },
    type: null,
    shipmentType: null,
    shipmentAmount: 0.00,
    // 配送费(扣除规则优惠的运费)
    shipmentDiscount: 0,
    // 运费抵扣金额(规则优惠)
    shipmentCouponDiscount: 0,
    // 运费抵扣金额(运费券)
    shipmentRealPay: 0,
    // 实际支付的运费金额（扣除所有优惠的运费）
    isShowAddressTips: true,
    // 是否超出
    goodsList: [],
    canDelivery: true,
    calculatedDeliveryFee: true,
    canSelfmention: true,
    cycleId: '',
    // 周期购活动id
    cycleFixedId: '',
    // 周期购范围id
    cycleDetails: '',
    // 周期购活动详情数据
    cycleActiveDes: '',
    // 周期购选择的订购范围
    showFirstTime: '',
    // 第一期配送文案
    calculateData: {},
    // 获取订单自提/配送时间 给后端参数
    deliveryTimeCycle: '',
    // 第一期配送时间
    cyclePhaseTotal: 0,
    // 总配送次数
    cycleFee: 0 // 每期配送费
  }, {
    deliveryTimeData: [],
    // 后端提供的时间数据
    advanceSellInfo: {},
    //预售相关信息
    teamBuyInfo: {},
    optionalShipmentType: {
      'SELF': true,
      'EXPRESS': true,
      'LOGISTICAL': true
    },
    optimalStore: {
      show: false
    },
    storeInfo: {
      shipmentTypes: []
    },
    orderType: 'normal',
    type: null,
    shipmentType: null,
    shipmentAmount: 0.00,
    // 配送费(扣除规则优惠的运费)
    shipmentDiscount: 0,
    // 运费抵扣金额(规则优惠)
    shipmentCouponDiscount: 0,
    // 运费抵扣金额(运费券)
    shipmentRealPay: 0,
    // 实际支付的运费金额（扣除所有优惠的运费）
    isShowAddressTips: true,
    // 是否超出
    goodsList: [],
    canDelivery: true,
    calculatedDeliveryFee: true,
    canSelfmention: true,
    cycleId: '',
    // 周期购活动id
    cycleFixedId: '',
    // 周期购范围id
    cycleDetails: '',
    // 周期购活动详情数据
    cycleActiveDes: '',
    // 周期购选择的订购范围
    showFirstTime: '',
    // 第一期配送文案
    calculateData: {},
    // 获取订单自提/配送时间 给后端参数
    deliveryTimeCycle: '',
    // 第一期配送时间
    cyclePhaseTotal: 0,
    // 总配送次数
    cycleFee: 0 // 每期配送费
  }, {
    deliveryTimeData: [],
    // 后端提供的时间数据
    advanceSellInfo: {},
    //预售相关信息
    teamBuyInfo: {},
    optionalShipmentType: {
      'SELF': true,
      'EXPRESS': true,
      'LOGISTICAL': true
    },
    optimalStore: {
      show: false
    },
    storeInfo: {
      shipmentTypes: []
    },
    orderType: 'normal',
    type: null,
    shipmentType: null,
    shipmentAmount: 0.00,
    // 配送费(扣除规则优惠的运费)
    shipmentDiscount: 0,
    // 运费抵扣金额(规则优惠)
    shipmentCouponDiscount: 0,
    // 运费抵扣金额(运费券)
    shipmentRealPay: 0,
    // 实际支付的运费金额（扣除所有优惠的运费）
    isShowAddressTips: true,
    // 是否超出
    goodsList: [],
    canDelivery: true,
    calculatedDeliveryFee: true,
    canSelfmention: true,
    cycleId: '',
    // 周期购活动id
    cycleFixedId: '',
    // 周期购范围id
    cycleDetails: '',
    // 周期购活动详情数据
    cycleActiveDes: '',
    // 周期购选择的订购范围
    showFirstTime: '',
    // 第一期配送文案
    calculateData: {},
    // 获取订单自提/配送时间 给后端参数
    deliveryTimeCycle: '',
    // 第一期配送时间
    cyclePhaseTotal: 0,
    // 总配送次数
    cycleFee: 0 // 每期配送费
  }],
  // 渲染商品数组
  multipleOrdersFlag: false,
  // 是否多单合并
  nearbestStoreCalc: false,
  optimalStore: {
    show: false,
    name: '',
    id: '',
    address: ''
  },
  sourceOrderData: null,
  // 来源订单信息
  deliveryExpressMaxRice: null,
  // 最大配送范围，没有值代表不限制
  deliveryDistanceThirdMap: '',
  // 地图项配置
  shipmentType: '',
  // 拼团配送方式
  optionalShipmentType: {
    'SELF': true,
    'EXPRESS': true,
    'LOGISTICAL': true
  },
  // 展示自提时间弹窗
  showTime: false,
  // 自提时间
  storePickupTime: '',
  // 选择的时间数据
  deliveryTimeData: [],
  // 后端提供的时间数据
  deliveryTime: '',
  // 组件选择的时间数据
  planTextTip: null,
  // unpaidShow: false, 支付改动注释
  // mspPassword: '',
  navigationBarTitle: "完善订单",
  imagesPath: IMGAGESPATH,
  theme: THEME,
  iScard: false,
  type: 'selftake',
  date: '2016-09-01',
  time: '12:01',
  useStoredMspCard: false,
  passProduct: [],
  // multiArray: [
  //     ['2018-06-01', '2018-06-02', '2018-06-03'],
  //     ['6:00-9:00', '9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
  // ],
  multiIndex: [0, 0],
  // selfTimeDate: '',
  addressInfo: '',
  // 收货地址信息
  goodsList: [],
  // 商品信息
  giftGoodsList: [],
  // 非买一送一赠品列表
  allPrice: 0,
  // 总价
  discount: 0,
  //购物车优惠金额
  distance: '',
  // 配送距离
  remarks: '',
  // 备注
  distributionInfo: {
    distributionFee: 0.00,
    takeoutFare: '0'
  },
  // 配送信息
  accountDetail: {},
  titleActive: '此次订单中的以下商品当前门店无库存或者已下架',
  cardNo: null,
  shipmentAmount: 0.00,
  // 配送费(扣除规则优惠的运费)
  shipmentDiscount: 0,
  // 运费抵扣金额(规则优惠)
  shipmentCouponDiscount: 0,
  // 运费抵扣金额(运费券)
  shipmentRealPay: 0,
  // 实际支付的运费金额（扣除所有优惠的运费）
  storeName: "人民广场店",
  storeId: '',
  storeTime: [],
  //营业时间
  storeInfo: {},
  couponTips: '选择优惠券',
  couponInfo: {
    description: '选择优惠券',
    data: {
      freeship: [],
      discount: []
    },
    useCoupon: false
  },
  teamBuyId: '',
  teamLeaderRecordId: '',
  modal: false,
  integralModal: false,
  useStoredValueCard: false,
  // 是否使用储值卡
  useWxValue: false,
  // 是否微信支付
  paymentPopup: false,
  cardDeductTotal: 0,
  // 储值抵扣金额
  storedValueCard: {
    useAmount: 0.00,
    //本次使用额度
    balance: 0.00,
    //储值卡余额
    password: '' //储值卡密码密码
  },
  cardPassword: '',
  canBuy: true,
  chooseTime: [[], []],
  memberInfo: {},
  tips: '',
  businessStatus: true,
  //营业状态
  sharingPersonId: '',
  orderType: 'normal',
  //orderType(模块类型): secondkill(秒杀)  group(拼团)  normal(普通) distribution(统配) advanceSell(预售) scoreMall(积分商城) service(服务订单) nextDay(次日达)
  isDistributionOrder: false,
  //是否是统配订单
  isNextDayOrder: false,
  //是否是次日达订单
  integral: 0,
  scoreArray: [],
  scoreIndex: 0,
  memberScore: 0,
  scoreInfo: {},
  scoreUseAmount: 0.00,
  advanceSellInfo: {},
  //预售相关信息
  teamBuyInfo: {},
  scource: 'SHOPPINGCART',
  //来自购物车SHOPPINGCART,立即购买BUYNOW
  orderSelfTime: '',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    number: false,
    pass: false
  },
  hasAvailableCoupon: false,
  hasAvailableGiftCard: false,
  discountNum: 0,
  freeshipNum: 0,
  useScore: false,
  scoreAmount: 0.00,
  orderGiftCard: [],
  // orderGiftCard: {
  //     maxUseTotal: 0
  // },
  giftCardNum: 0,
  systemOptions: {
    //系统配置项信息
    isGiftCard: false,
    // 是否支持礼品卡
    orderChooseDateAllowDays: 3,
    //订单预约可以预约几天 （单位 天)
    orderChooseDateInterval: 10800000,
    //订单预约时间的间隔 （单位 毫秒）
    daysOfSelfTimeDelay: 0,
    //订单预约限定下单后第几天开始 ，默认是0，表示从当天开始
    teamOrderCanUseCoupon: false,
    //拼团能否使用优惠券
    teamOrderCanUseScore: false,
    //拼团能否使用积分
    isBothScoreAndCoupon: false // 是否能同时使用积分和优惠券
  },
  showTimeChoose: false,
  hasStockWarning: false,
  usedCoupons: [],
  scoreDiscount: 0,
  // 积分抵扣
  scoreDiscount1: 0,
  couponDiscount: 0,
  // 券抵扣
  cashDiscount: 0,
  // 现金抵扣金额
  cashDiscountName: '',
  // 优惠活动名称
  showDiscount: false,
  totalDiscount: 0,
  // 总优惠金额
  giftCardDiscount: 0,
  // 礼品卡优惠金额
  inputAmount: 0,
  // 整单优惠金额
  canDelivery: true,
  canSelfmention: true,
  shipmentSortList: [],
  goodsInfo: null,
  order: null,
  // 订单数据
  payMethod: {
    cardDeductTotal: 0,
    useStoredValueCard: false,
    balance: 0
  },
  orderCancel: false,
  orderPay: false,
  mallOrderType: "COMMON",
  // 订单类型 OFFLINE
  offlinType: "normal",
  // cashReceipt
  isExpress: false,
  supportInvoice: true,
  invoice: '',
  // 发票信息
  showInvoice: false,
  calculatedDeliveryFee: true,
  userChooseCoupon: true,
  showMore: false,
  goodsPromotions: [],
  couponPromotions: [],
  solitaireType: "",
  solitaireInfo: {},
  packaging: "",
  checkedProducts: true,
  vipGradeConfig: null,
  btnDisabled: true,
  cycleId: '',
  // 周期购活动id
  cycleFixedId: '',
  // 周期购范围id
  cycleDetails: '',
  // 周期购活动详情数据
  cycleActiveDes: '',
  // 周期购选择的订购范围
  showFirstTime: '',
  // 第一期配送文案
  calculateData: {},
  // 获取订单自提/配送时间 给后端参数
  deliveryTimeCycle: '',
  // 第一期配送时间
  cyclePhaseTotal: 0,
  // 总配送次数
  cycleFee: 0,
  // 每期配送费
  isDiscountUsedForGiftCard: true,
  // 礼品卡是否与促销互斥
  isShowAddressTips: true // 是否超出
});
function bindAppointmentMobile (e) {
  let appointmentMobile = e.detail.value;
  state.appointmentMobile = appointmentMobile;
}
function bindAppointmentUser (e) {
  let appointmentUser = e.detail.value;
  state.appointmentUser = appointmentUser;
}
function getShopCartStyle () {
  let keys = ['storeNameAs', 'distributionNameAs', 'nextDayNameAs'];
  let nextDayData = ['app.nextDay.delivery.startTime', 'app.nextDay.delivery.endTime', 'app.nextDay.cutoffTime', 'app.nextDay.enable.cutoff'];
  systemService.query([...keys, ...nextDayData, 'placeOrderConfirmStore'].join(',')).then(res => {
    if (res && res.length > 0) {
      state.shoppingData = {
        store: {
          color: '#F66600'
        },
        distribution: {
          color: '#137DFF'
        },
        nextDay: {
          color: '#23C257'
        }
      };
      let shoppingConfig = {};
      res.forEach(item => {
        if (keys.indexOf(item.key) > -1) {
          shoppingConfig[item.key] = item.value;
        } else if (item.key == 'app.nextDay.delivery.startTime') {
          state.nextDayStartTime = item.value || null;
        } else if (item.key == 'app.nextDay.delivery.endTime') {
          state.nextDayEndTime = item.value || null;
        } else if (item.key == 'app.nextDay.cutoffTime') {
          state.nextDayCutOffTime = item.value || null;
        } else if (item.key == 'app.nextDay.enable.cutoff') {
          state.enableCutoff = item.value === 'TRUE' ? true : false;
        } else if (item.key == 'placeOrderConfirmStore') {
          state.placeOrderConfirmStore = item.value;
        }
      });
      let shoppingType = ['store', 'distribution', 'nextDay'];
      shoppingType.forEach(item => {
        state.shoppingData[item].labelName = shoppingConfig[item + 'NameAs'];
      });
      state.shoppingData = state.shoppingData;
    }
  });
}
async function getPaymentMethod () {
  try {
    let paymentMethodList = ['paymentMethod', 'isPointsRedemption', 'isDiscountCoupons', 'isFreightVoucher', 'isStoredPayment', 'isGiftPayment', 'activity.advance.isGiftPayment', 'activity.advance.isStoredPayment'];
    await sysService.query(paymentMethodList.join(',')).then(res => {
      if (res && res.length > 0) {
        res.forEach(item => {
          if (item.key == 'activity.advance.isGiftPayment' || item.key == 'activity.advance.isStoredPayment') {
            state[item.key == 'activity.advance.isGiftPayment' ? 'advanceisGiftPayment' : 'advanceSellPayment'] = item.value == 'FALSE' ? false : true;
          } else if (item.key == 'paymentMethod' && item.value) {
            app.globalData.paymentMethod = item.value;
            state.paymentMethod = item.value;
          } else {
            item.key = item.value == 'FALSE' ? false : true;
          }
        });
        if ((state.orderType !== 'advanceSell' || state.advanceSellPayment) && state.isStoredPayment) {
          handlePayModule();
        }
        if ((state.orderType !== 'advanceSell' || state.advanceisGiftPayment) && state.isGiftPayment) {
          handleCardBalance();
        }
      }
    }).catch(err => { });
  } catch (e) { }
}
function getNearbestStoreCalc () {
  sysService.query('app.mall.order.nearbestStoreCalc').then(res => {
    state.nearbestStoreCalc = false;
    if (res && res.length > 0 && res[0].value == 'TRUE') {
      app.globalData.nearbestStoreCalc = res[0].value == 'TRUE';
      state.nearbestStoreCalc = app.globalData.nearbestStoreCalc;
    }
  }).catch(err => {
    console.log(err);
  });
}
function switchStore (e) {
  let idx = e.currentTarget.dataset.idx || 0;
  if (state.goodTypeList[idx].orderType != 'distribution') {
    app.globalData.storeInfo = {
      ...state.goodTypeList[idx].optimalStore,
      userLatitude: state.goodTypeList[idx].optimalStore.userLatitude,
      userLongitude: state.goodTypeList[idx].optimalStore.userLongitude
    };
    uni.setStorageSync('storeIdactive', app.globalData.storeInfo);
  }
  state.goodTypeList.forEach(item => {
    if (item.orderType != 'distribution') {
      item.storeName = state.goodTypeList[idx].optimalStore.name;
      if (item.orderType != 'nextDay') {
        item.storeId = state.goodTypeList[idx].optimalStore.id;
      }
      item.storeInfo = state.goodTypeList[idx].optimalStore;
      item.shipmentCouponDiscount = 0;
      item.shipmentDiscount = 0;
      item.freeshipList = [];
      item.optimalStore.show = false;
    }
  });
  // this.data.goodTypeList[idx].storeName = this.data.goodTypeList[idx].optimalStore.name;
  // this.data.goodTypeList[idx].storeId = this.data.goodTypeList[idx].optimalStore.id;
  // this.data.goodTypeList[idx].storeInfo = this.data.goodTypeList[idx].optimalStore;
  // this.data.goodTypeList[idx].shipmentCouponDiscount = 0;
  // this.data.goodTypeList[idx].shipmentDiscount = 0;
  // this.data.goodTypeList[idx].freeshipList = [];
  let useCoupons = [];
  let freeshipList = [];
  let shipmentCouponDiscount = 0;
  let couponList = [];
  let couponDiscount = 0;
  state.goodTypeList.forEach(item => {
    if (item.type != 'selftake') {
      shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
      couponDiscount += parseFloat(item.couponDiscount || 0);
      if (item.couponList && item.couponList.length > 0) {
        item.couponList.forEach(item1 => {
          useCoupons.push(item1);
          couponList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
      if (item.freeshipList && item.freeshipList.length > 0) {
        item.freeshipList.forEach(item1 => {
          useCoupons.push(item1);
          freeshipList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
    } else {
      couponDiscount += parseFloat(item.couponDiscount || 0);
      if (item.couponList && item.couponList.length > 0) {
        item.couponList.forEach(item1 => {
          useCoupons.push(item1);
          couponList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
      item.shipmentCouponDiscount = 0;
      item.shipmentDiscount = 0;
      item.shipmentRealPay = 0;
      item.freeshipList = [];
    }
  });
  // this.data.goodTypeList[idx].optimalStore = {
  //   ...this.data.goodTypeList[idx].optimalStore,
  //   show: false
  // }
  state.couponInfo = {
    description: '选择优惠券',
    data: {
      freeship: freeshipList,
      discount: couponList
    },
    useCoupon: freeshipList.length > 0 || couponList.length > 0
  };
  state.usedCoupons = useCoupons;
  state.couponDiscount = couponDiscount;
  state.shipmentCouponDiscount = shipmentCouponDiscount;
  state.payMethod.couponDiscount = couponDiscount;
  state.payMethod.shipmentCouponDiscount = shipmentCouponDiscount;
  state.storeInfo = state.goodTypeList[idx].optimalStore;
  state.storeId = state.goodTypeList[idx].optimalStore.id;
  state.storeName = state.goodTypeList[idx].optimalStore.name;
  state.goodTypeList.forEach((item, index) => {
    if (item.orderType != 'distribution') {
      // 检查配送距离
      if (state.goodTypeList[index].type === 'dispatch' || state.goodTypeList[index].type === 'logistical') {
        checkDistribution(index);
      }
      // 统计PV
      ANALYSIS.PVStatistics(state.storeId);
      initializationTime(index); //初始化预约时间
      // 根据门店支持的配送方式显示自提和配送
      handleDeliveryType(true, index);
      checkOrderProducts(index);
      getAvailableCouponNum(index);
      checkProductsSellTime(index);
      // 切换最优门店 重新从后端获取配送时间 移除缓存的自提时间 (外卖和自提都需要获取配送时间)
      uni.removeStorageSync('wj_storePickupTime');
      if (item.orderType == 'nextDay') {
        getNextDayTime(index);
      } else {
        getCalculateTime(index);
      }
    }
  });
}
function getBestStore (latitude, longitude, idx) {
  let self = this;
  hadleStoreOrder(latitude, longitude, successFn, idx);
  function successFn (newStore) {
    let products = [];
    let allPrice = 0;
    state.goodTypeList[idx].goodsList.forEach(item => {
      let itemPrice = parseFloat((item.sellPrice * item.productNum).toFixed(2));
      allPrice += itemPrice;
      products.push({
        productId: item.productId,
        productNum: item.productNum,
        price: item.sellPrice,
        amount: itemPrice
      });
    });
    let params = {
      storeId: state.goodTypeList[idx].storeId,
      nearStoreId: newStore.id,
      latitude: latitude,
      longitude: longitude,
      distance: newStore.distance,
      products,
      allPrice: parseFloat(allPrice.toFixed(2))
    };
    storeService.bestStoreCalc(params).then(res => {
      if (res && res.nearStore && res.store) {
        let nearStoreAllPrice = 0;
        let storeAllPrice = 0;
        if (res.nearStore && res.nearStore.products) {
          res.nearStore.products.forEach(item => {
            nearStoreAllPrice += item.amount;
          });
          nearStoreAllPrice = parseFloat((nearStoreAllPrice + res.nearStore.shipmentAmount).toFixed(2));
        }
        if (res.store && res.store.products) {
          res.store.products.forEach(item => {
            storeAllPrice += item.amount;
          });
          storeAllPrice = parseFloat((storeAllPrice + parseFloat(state.goodTypeList[idx].orderType === 'CYCLE' ? state.goodTypeList[idx].cycleFee : state.goodTypeList[idx].shipmentAmount)).toFixed(2));
        }
        if (nearStoreAllPrice && nearStoreAllPrice < storeAllPrice) {
          state.goodTypeList[idx].optimalStore = {
            show: true,
            ...newStore
          };
        } else {
          state.goodTypeList[idx].optimalStore.show = false;
        }
        state.goodTypeList = state.goodTypeList;
      } else {
        state.goodTypeList[idx].optimalStore.show = false;
        state.goodTypeList = state.goodTypeList;
      }
    }).catch(() => {
      state.goodTypeList[idx].optimalStore.show = false;
      state.goodTypeList = state.goodTypeList;
    });
  }
}
function hadleStoreOrder (latitude, longitude, successFn, idx) {
  let self = this;
  try {
    storeService.queryList().then(res => {
      let tempAllStores = [];
      res.forEach(item => {
        let hasThisStore = false;
        tempAllStores.forEach((ele, index) => {
          if (item.id === ele.id) {
            hasThisStore = true;
            tempAllStores[index] = item;
          }
        });
        if (!hasThisStore) {
          if (item.status === 'OPEN') {
            tempAllStores.push(item);
          }
        }
      });
      let newAllStores = [];
      tempAllStores.forEach(item => {
        if (item.status === 'OPEN') {
          newAllStores.push(item);
        }
      });
      handleStoreInfo(newAllStores);
    }).catch(err => {
      console.log(err.message);
    });
    /**
     * 处理门店数据
     * @param allStores 所有门店信息
     */
    function handleStoreInfo (allStores) {
      let distanceArr = [];
      let newArr = [];
      if (allStores.length > 0) {
        allStores.forEach(item => {
          let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
          distanceArr.push({
            ...item,
            userLatitude: item.latitude,
            userLongitude: item.longitude,
            distance: dis,
            id: item.virtualStoreId || item.id
          });
        });
      }
      newArr = [].concat(distanceArr); // newArr为一个新的数组，不是简单的赋值引用
      function compare (property) {
        return function (a, b) {
          let value1 = a[property];
          let value2 = b[property];
          return value1 - value2;
        };
      }
      newArr = newArr.sort(compare('distance'));
      if (newArr[0].virtualStoreId != state.goodTypeList[idx].storeInfo.virtualStoreId) {
        return successFn(newArr[0]);
      } else {
        state.goodTypeList[idx].optimalStore.show = false;
        state.goodTypeList[idx].optimalStore = optimalStore;
        state.goodTypeList = state.goodTypeList;
      }
    }
  } catch (e) {
    console.log(e);
  }
}
async function getMapSet () {
  await sysService.query('deliveryDistanceThirdMap').then(async res => {
    console.log('res111', res);
    if (res && res.length > 0 && res[0].value != null) {
      app.globalData.systemConfigure.deliveryDistanceThirdMap = res[0].value;
      state.deliveryDistanceThirdMap = app.globalData.systemConfigure.deliveryDistanceThirdMap;
      let key = 'lbs_tianditu_appkey';
      if (res[0].value == 'TIANDITU') {
        key = 'lbs_tianditu_appkey';
      } else if (res[0].value == 'GAODE') {
        key = 'lbs_autonavi_key';
      } else if (res[0].value == 'TENXUN') {
        key = 'lbs_tencentMiniapp_key';
      }
      await sysService.query(key).then(res => {
        if (res && res.length > 0 && res[0].value != null) {
          if (key == 'lbs_tianditu_appkey') {
            app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value;
          } else if (key == 'lbs_autonavi_key') {
            app.globalData.systemConfigure.lbsAutonaviAppkey = res[0].value;
          } else if (key == 'lbs_tencentMiniapp_key') {
            app.globalData.systemConfigure.lbsTencentMiniappKey = res[0].value;
          }
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }).catch(err => {
    console.log(err);
  });
  // console.log(app.globalData.systemConfigure.deliveryDistanceThirdMap,'deliveryDistanceThirdMap')
}
let localData = {
  shipmentTypes: 'EXPRESS'
};
function changeShowDiscount () {
  state.showDiscount = !state.showDiscount;
}
function getNextDayTime (idx) {
  let showPageText = '';
  let storePickupTime = '';
  let nowTime = new Date();
  let nowYear = nowTime.getFullYear();
  let nowM = nowTime.getMonth();
  let nowDay = nowTime.getDate();
  if (!state.nextDayCutOffTime || !state.enableCutoff) {
    showPageText += '次日';
  } else {
    if (state.enableCutoff && nowTime.getTime() > new Date(nowYear + '/' + (nowM + 1) + '/' + nowDay + ' ' + state.nextDayCutOffTime).getTime()) {
      showPageText += '后日';
    } else {
      showPageText += '次日';
    }
  }
  let selfTime = new Date(nowYear, nowM, showPageText == '次日' ? nowDay + 1 : nowDay + 2);
  let selfTimeYear = selfTime.getFullYear();
  let selfTimeM = selfTime.getMonth() + 1 >= 10 ? selfTime.getMonth() + 1 : '0' + (selfTime.getMonth() + 1);
  let selfTimeD = selfTime.getDate() >= 10 ? selfTime.getDate() : '0' + selfTime.getDate();
  let timeList = state.goodTypeList[idx].storeInfo && state.goodTypeList[idx].storeInfo.storeHours ? state.goodTypeList[idx].storeInfo.storeHours.split('-') : ['00:00', '23:59'];
  if (state.nextDayStartTime && state.nextDayEndTime) {
    showPageText += state.nextDayStartTime + '~' + state.nextDayEndTime;
    storePickupTime = selfTimeYear + '-' + selfTimeM + '-' + selfTimeD + ' ' + state.nextDayStartTime + '~' + state.nextDayEndTime;
  } else if (!state.nextDayEndTime && !state.nextDayStartTime) {
    storePickupTime = selfTimeYear + '-' + selfTimeM + '-' + selfTimeD + ' ' + timeList[0] + '~' + timeList[1];
  } else if (!state.nextDayEndTime) {
    showPageText += state.nextDayStartTime + '之后';
    storePickupTime = selfTimeYear + '-' + selfTimeM + '-' + selfTimeD + ' ' + state.nextDayStartTime + '~' + timeList[1];
  } else if (!state.nextDayEndTime) {
    storePickupTime = selfTimeYear + '-' + selfTimeM + '-' + selfTimeD + ' ' + timeList[0] + '~' + state.nextDayEndTime;
  }
  showPageText += state.goodTypeList[idx].shipmentType == 'SELF' ? '可以提货' : '送货上门';
  state.goodTypeList[idx].showPageText = showPageText;
  state.goodTypeList[idx].storePickupTime = storePickupTime;
  state.goodTypeList = state.goodTypeList;
}
function getCalculateTime (idx) {
  // 获取订单自提/配送时间 给后端参数处理
  state.calculateData.productIds = [];
  let idKeyName = state.goodTypeList[idx].goodsList && state.goodTypeList[idx].goodsList.length > 0 ? 'goodsList' : 'goodsListAll';
  console.log(state.goodTypeList[idx], 'this.data.goodTypeList[idx]');
  state.goodTypeList[idx][idKeyName].forEach(item => {
    state.calculateData.productIds.push(item.productId);
  });
  state.calculateData.storeId = state.goodTypeList[idx].storeId;
  if (state.goodTypeList[idx].type === 'selftake') {
    state.calculateData.shipmentType = 'SELF'; //自提
  } else if (state.goodTypeList[idx].type === 'dispatch') {
    state.calculateData.shipmentType = 'EXPRESS'; // 外卖配送
  }
  state.goodTypeList[idx].storePickupTime = '';
  state.calculateData = state.calculateData;
  state.storePickupTime = '';
  let postData = state.calculateData;
  if (state.calculateData.productIds.length <= 0) {
    return;
  }
  orderService.calculateTime(postData).then(res => {
    // console.log('res----',res)
    state.goodTypeList[idx].deliveryTimeData = [];
    if (res && res.timeScopeList) {
      res.timeScopeList.forEach(item => {
        state.goodTypeList[idx].deliveryTimeData.push({
          day: item.day,
          timeList: item.time
        });
      });
    }
    state.goodTypeList[idx].deliveryTimeData = state.goodTypeList[idx].deliveryTimeData;
    state.goodTypeList[idx].deliveryTime = '';
    state.goodTypeList[idx].storePickupTime = '';
    state.goodTypeList = state.goodTypeList;
    console.log('deliveryTimeData', state.goodTypeList[idx].deliveryTimeData);
  }).catch(err => {
    if (err.code != 1) {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
    state.goodTypeList[idx].deliveryTimeData = [];
    state.goodTypeList[idx].deliveryTime = '';
    state.goodTypeList[idx].storePickupTime = '';
    state.goodTypeList = state.goodTypeList;
  }).finally(() => {
    const wj_storePickupTime = uni.getStorageSync('wj_storePickupTime');
    console.log('wj_storePickupTime', wj_storePickupTime);
    if (wj_storePickupTime) {
      state.goodTypeList[idx].storePickupTime = wj_storePickupTime;
      state.goodTypeList = state.goodTypeList;
    }
  });
}
function selectTime (e) {
  let idx = e.currentTarget.dataset.idx;
  if (e.detail.deliveryTime && e.detail.deliveryTime !== state.goodTypeList[idx].storePickupTime) {
    state.goodTypeList[idx].storePickupTime = e.detail.deliveryTime;
    state.goodTypeList[idx].showTime = false;
    // 选择完时间后存储到本地
    state.goodTypeList = state.goodTypeList;
    state.editActiveIdx = idx;
    uni.setStorageSync('wj_storePickupTime', state.goodTypeList[idx].storePickupTime);
    uni.setStorageSync('editActiveIdx', idx);
  }
}
function onClose (e) {
  let idx = e.currentTarget.dataset.idx;
  state.goodTypeList[idx].showTime = false;
  state.goodTypeList = state.goodTypeList;
}
function chooseTime (e) {
  let idx = e.currentTarget.dataset.idx;
  state.goodTypeList[idx].showTime = true;
  // console.log(this.data.showTime)
  // this.timepicker.getDliveryTime();
  // console.log(this.data.showTime)
  state.goodTypeList = state.goodTypeList;
  state.editActiveIdx = idx;
}
function toInvoice () {
  NAVPAGE.toInvoice();
}
function handleTips (val) {
  let tipsFont = '该订单不支持';
  if (val.currentTarget.dataset.type === 'selftake') {
    tipsFont += '到店自提';
  } else if (val.currentTarget.dataset.type === 'dispatch') {
    tipsFont += '外卖配送';
  } else {
    tipsFont += '快递配送';
  }
  uni.showToast({
    title: tipsFont,
    icon: 'none',
    duration: 2000
  });
}
function handleClick (val) {
  let idx = val.currentTarget.dataset.idx || 0;
  state.goodTypeList[idx].type = val.currentTarget.dataset.type;
  let displayAddressFlag = state.goodTypeList.some(item => {
    return item.type != 'selftake';
  });
  let shipmentCouponDiscount = 0;
  let couponDiscount = 0;
  let shipmentDiscount = 0;
  let freeshipList = [];
  let couponList = [];
  let useCoupons = [];
  let _calculatedDeliveryFee = true;
  state.goodTypeList.forEach(item => {
    if (item.type != 'selftake') {
      shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
      shipmentDiscount += parseFloat(item.shipmentDiscount || 0);
      couponDiscount += parseFloat(item.couponDiscount || 0);
      if (item.couponList && item.couponList.length > 0) {
        item.couponList.forEach(item1 => {
          useCoupons.push(item1);
          couponList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
      if (item.freeshipList && item.freeshipList.length > 0) {
        item.freeshipList.forEach(item1 => {
          useCoupons.push(item1);
          freeshipList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
    } else {
      item.calculatedDeliveryFee = true;
      item.shipmentCouponDiscount = 0;
      item.shipmentDiscount = 0;
      item.shipmentRealPay = 0;
      item.freeshipList = [];
      couponDiscount += parseFloat(item.couponDiscount || 0);
      if (item.couponList && item.couponList.length > 0) {
        item.couponList.forEach(item1 => {
          useCoupons.push(item1);
          couponList.push({
            service: item1.service,
            coupon: {
              id: item1.couponId
            },
            usable: true
          });
        });
      }
    }
    if (!item.calculatedDeliveryFee) {
      _calculatedDeliveryFee = false;
    }
  });
  calculatedDeliveryFee = _calculatedDeliveryFee;
  console.log(useCoupons, 'adfaklsfklasjflsajdfl');
  state.calculatedDeliveryFee = _calculatedDeliveryFee;
  state.goodTypeList = state.goodTypeList;
  state.displayAddressFlag = displayAddressFlag;
  state.couponInfo = {
    description: '选择优惠券',
    data: {
      freeship: freeshipList,
      discount: couponList
    },
    useCoupon: freeshipList.length > 0 || couponList.length > 0
  };
  state.usedCoupons = useCoupons;
  state.useScore = false;
  state.couponDiscount = couponDiscount;
  state.shipmentCouponDiscount = shipmentCouponDiscount;
  state.giftCardDiscount = 0;
  state.scoreDiscount = 0;
  state.payMethod.cardDeductTotal = 0;
  state.payMethod.couponDiscount = couponDiscount;
  state.payMethod.shipmentCouponDiscount = shipmentCouponDiscount;
  state.payMethod.giftCardDiscount = 0;
  state.payMethod.scoreAmount = 0;
  state.payMethod.scoreDiscount = 0;
  state.cardDeductTotal = 0;
  state.payMethod.useStoredValueCard = false;
  state.payMethod.cardDeductTotal = 0;
  state.type = val.currentTarget.dataset.type;
  const self = this;
  let shipmentTypes = state.goodTypeList[idx].orderType !== "CYCLE" ? state.goodTypeList[idx].storeInfo.shipmentTypes : state.goodTypeList[idx].cycleDetails.shipmentType.split(',');
  // 配送和快递
  if (val.currentTarget.dataset.type === 'dispatch' || val.currentTarget.dataset.type === "logistical") {
    if (shipmentTypes.indexOf('EXPRESS') >= 0 || shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      const type = val.currentTarget.dataset.type;
      let shipmentType = "EXPRESS";
      if (val.currentTarget.dataset.type === 'dispatch') {
        shipmentType = "EXPRESS";
      } else if (val.currentTarget.dataset.type === 'logistical') {
        shipmentType = "LOGISTICAL";
      }
      if (state.goodTypeList && state.goodTypeList[idx]) {
        state.goodTypeList[idx].shipmentType = shipmentType;
        state.goodTypeList = state.goodTypeList;
      }
      let canDispatch = true;
      // 直接后端计算配送费距离之类的
      checkDistribution(idx);
      function handleClickDispatch (res) {
        console.log('allPrice', state.allPrice);
        console.log('baseFare', res.baseFare);
        console.log('当前查询门店配送费', res.takeoutFare);
        if (res) {
          // let takeoutFare = 0;
          //临时避开逻辑
          let takeoutFare = res.takeoutFare != null ? res.takeoutFare : 0;
          state.allPrice >= takeoutFare ? canDispatch = true : canDispatch = false;
        }
        if (canDispatch) {
          if (state.goodTypeList && state.goodTypeList[idx]) {
            state.goodTypeList[idx].type = type;
          }
          state.type = type;
          state.goodTypeList = state.goodTypeList;
          state.canBuy = false;
          state.shipmentAmount = res.baseFare;
          state.goodTypeList[idx].cycleFee = parseFloat(parseFloat(state.shipmentAmount * state.cyclePhaseTotal).toFixed(2));
          state.goodTypeList[idx].shipmentAmount = parseFloat(parseFloat(state.shipmentAmount * state.cyclePhaseTotal).toFixed(2));
          state.cycleFee = parseFloat(parseFloat(state.shipmentAmount * state.cyclePhaseTotal).toFixed(2));
          if (state.orderType !== 'advanceSell' && !state.isDistributionOrder) {
            checkProductsSellTime(idx);
          }
          checkDistribution(idx);
          // 获取配送费之后再进行计算券的操作
          handleCardBalance();
        } else {
          uni.showToast({
            title: '商品满' + res.takeoutFare + '元起送',
            icon: 'none',
            duration: 2000
          });
        }
      }
    } else {
      uni.showToast({
        title: '该门店暂不支持配送~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    if (state.goodTypeList && state.goodTypeList[idx]) {
      state.goodTypeList[idx].type = 'selftake';
      state.goodTypeList[idx].shipmentType = 'SELF';
      state.goodTypeList[idx].shipmentAmount = 0;
      state.goodTypeList[idx].shipmentRealPay = 0;
      state.goodTypeList[idx].shipmentDiscount = 0;
      state.goodTypeList[idx].shipmentCouponDiscount = 0;
    }
    let shipmentAmount1 = 0;
    let shipmentRealPay1 = 0;
    let shipmentDiscount1 = 0;
    let shipmentCouponDiscount1 = 0;
    state.goodTypeList.forEach(item => {
      shipmentAmount1 += parseFloat(item.shipmentAmount || 0);
      shipmentRealPay1 += parseFloat(item.shipmentRealPay || 0);
      shipmentDiscount1 += parseFloat(item.shipmentDiscount || 0);
      shipmentCouponDiscount1 += parseFloat(item.shipmentCouponDiscount || 0);
    });
    // 切换配送方式时，如果选择了自提，需要清除已经选择的运费券信息
    // if (this.data.couponInfo.data.freeship.length > 0) {
    //     // 当前选择了运费券
    //     const freeship = self.data.couponInfo.data.freeship
    //     let usedCoupons = self.data.usedCoupons
    //     for (let i = 0; i < usedCoupons.length; i++) {
    //         const ele = usedCoupons[i];
    //         if (ele.couponId === freeship[0].coupon.id) {
    //             usedCoupons.splice(i, 1)
    //             break;
    //         }
    //     }
    //     self.setData({
    //         "couponInfo.data.freeship": []
    //     })
    // }
    // 预售不支持用券 || this.data.advanceSellPayment
    state.type = 'selftake';
    state.goodTypeList = state.goodTypeList;
    state.canBuy = true;
    state.shipmentAmount = shipmentAmount1 || 0;
    state.shipmentRealPay = shipmentRealPay1 || 0;
    state.shipmentDiscount = shipmentDiscount1 || 0;
    state.shipmentCouponDiscount = shipmentCouponDiscount1 || 0;
    if (state.goodTypeList[idx].orderType !== 'advanceSell' && state.goodTypeList[idx].orderType !== "packaging") {
      getAvailableCouponNum(idx);
    }
    if (state.goodTypeList[idx].orderType !== 'advanceSell' && !state.goodTypeList[idx].isDistributionOrder) {
      checkProductsSellTime(idx);
    }
  }
  if (state.goodTypeList[idx].orderType !== "CYCLE" && state.goodTypeList[idx].goodsListAll && state.goodTypeList[idx].goodsListAll.length > 0) {
    let goodsList = [];
    let notGoodsList = [];
    let goodsNum = 0;
    let notGoodsNum = 0;
    let allPrice = 0;
    state.goodTypeList[idx].goodsListAll.forEach(item => {
      if (item && (!item.shipmentType || item.shipmentType.indexOf(state.goodTypeList[idx].shipmentType) > -1)) {
        goodsNum += item.productNum;
        allPrice += parseFloat(parseFloat(item.productNum) * parseFloat(item.sellPrice));
        goodsList.push(item);
      } else if (item) {
        notGoodsList.push(item);
        notGoodsNum += item.productNum;
      }
    });
    state.goodTypeList[idx].notGoodsList = notGoodsList;
    state.goodTypeList[idx].goodsList = goodsList;
    state.goodTypeList[idx].allPrice = parseFloat(allPrice.toFixed(2));
    state.goodTypeList[idx].goodsNum = goodsNum;
    state.goodTypeList[idx].notGoodsNum = notGoodsNum;
  }
  let allPrice = 0;
  let goodsList = [];
  state.goodTypeList.forEach(item => {
    allPrice += parseFloat(item.allPrice || 0);
    goodsList = goodsList.concat(item.goodsList || []);
  });
  //  切换配送方式 重新从后端获取配送时间
  // 切换配送方式 移除缓存的自提时间 (外卖和自提都需要获取配送时间)
  state.allPrice = parseFloat(allPrice.toFixed(2));
  state.goodsList = goodsList;
  state.goodTypeList = state.goodTypeList;
  uni.removeStorageSync('wj_storePickupTime');
  if (state.goodTypeList[idx].orderType == 'nextDay') {
    getNextDayTime(idx);
  } else if (state.goodTypeList[idx].orderType != 'distribution' || state.goodTypeList[idx].type === 'selftake' || state.goodTypeList[idx].type === 'dispatch') {
    getCalculateTime(idx);
  }
}
function initializationTime (idx) {
  const self = this;
  const configure = state.systemOptions; //获取订单相关的系统配置
  let now = new util.ResponseDate();
  let hour = now.getHours(); //小时数
  let days = configure.orderChooseDateAllowDays; //订单预约可以预约几天 （单位 天）
  let orderAppointmentDate = configure.daysOfSelfTimeDelay; //订单预约限定下单后第几天开始
  console.log(orderAppointmentDate, 'orderAppointmentDate');
  if (state.goodTypeList[idx].orderType === 'group' && (state.goodTypeList[idx].teamBuyInfo.selfAfterDay != null || state.goodTypeList[idx].teamBuyInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].teamBuyInfo.selfAfterDay;
  } else if (state.orderType === 'solitaire' && (state.solitaireInfo.selfAfterDay != null || state.goodTypeList[idx].solitaireInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].solitaireInfo.selfAfterDay;
  }
  let newAppointmentDate = addDay(now, orderAppointmentDate);
  let tempTime = [[], []];
  let groupEndTime = state.goodTypeList[idx].teamBuyInfo.endTime;
  let orderSelfScope = state.goodTypeList[idx].teamBuyInfo.orderSelfScope;
  let groupTime = [];
  let advanceSellTime = [];
  if (state.goodTypeList[idx].orderType === 'advanceSell') {
    let advanceSellInfo = state.goodTypeList[idx].advanceSellInfo;
    let orderSelfTime = "";
    if (advanceSellInfo.selfTimeScope) {
      const selfTimeScope = advanceSellInfo.selfTimeScope;
      const startTimeArr = selfTimeScope.split("~")[0].split(" ");
      const endTimeArr = selfTimeScope.split("~")[1].split(" ");
      const daysArrStart = startTimeArr[0].split("-");
      const daysArrEnd = endTimeArr[0].split("-");
      const startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
      const endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
      const time = selfTimeScope.split("~")[0].split(" ")[1].slice(0, 5) + "-" + selfTimeScope.split("~")[1].split(" ")[1].slice(0, 5);
      orderSelfTime = startDate + '-' + endDate + ' ' + time;
    } else {
      if (advanceSellInfo.payType === 'FULL') {
        const endTime = new Date(util.formatTime(now)).getTime();
        const tempEndTime = addDay(endTime, advanceSellInfo.deliveryTime);
        let year = tempEndTime.getFullYear();
        let month = tempEndTime.getMonth() + 1;
        let day = tempEndTime.getDate();
        let newDate = [year, month, day].map(util.timeFormat).join('-');
        advanceSellTime = newDate;
      } else if (advanceSellInfo.payType === 'PARTIAL') {
        const endTime = new Date(advanceSellInfo.balanceEndTime.replace(/-/g, '/')).getTime();
        const tempEndTime = addDay(endTime, advanceSellInfo.deliveryTime);
        let year = tempEndTime.getFullYear();
        let month = tempEndTime.getMonth() + 1;
        let day = tempEndTime.getDate();
        let newDate = [year, month, day].map(util.timeFormat).join('-');
        advanceSellTime = newDate;
      }
      tempTime[0].push(advanceSellTime);
      tempTime[1].push('00:00-23:59');
      orderSelfTime = advanceSellTime + ' 00:00-23:59';
    }
    state.goodTypeList[idx].orderSelfTime = orderSelfTime;
    state.goodTypeList[idx].multiArray = tempTime;
    state.goodTypeList = state.goodTypeList;
  } else if (state.goodTypeList[idx].orderType === 'group') {
    // 拼团自提时间均不可选，为固定时间点或时间段
    let selfStartTime = state.goodTypeList[idx].teamBuyInfo.selfStartTime;
    let selfEndTime = state.goodTypeList[idx].teamBuyInfo.selfEndTime;
    if (selfStartTime != null && selfEndTime != null && selfStartTime != '' && selfEndTime != '') {
      // 如果当前拼团活动设置了拼团自提开始时间和自提结束时间，则页面上显示拼团自提开始时间和自提结束时间段
      let startTimeArr = selfStartTime.split(" ");
      let endTimeArr = selfEndTime.split(" ");
      let daysArrStart = startTimeArr[0].split("-");
      let daysArrEnd = endTimeArr[0].split("-");
      let startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
      let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
      let orderSelfTime = startDate + '-' + endDate;
      if (state.goodTypeList[idx].storeInfo.storeHours != null) {
        orderSelfTime = orderSelfTime + ' ' + state.goodTypeList[idx].storeInfo.storeHours;
      }
      state.goodTypeList[idx].orderSelfTime = orderSelfTime;
      state.goodTypeList = state.goodTypeList;
    } else {
      // 如果当前拼团没有设置拼团自提开始时间和自提结束时间，则根据订单预约开始时间在页面上显示自提时间点
      if (!state.goodTypeList[idx].teamBuyInfo.selfAfterDay) {
        state.goodTypeList[idx].showTimeChoose = true;
        state.goodTypeList = state.goodTypeList;
      }
      for (let i = 0; i < days; i++) {
        let date = addDay(newAppointmentDate, i);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let newDate = [year, month, day].map(util.timeFormat).join('-');
        tempTime[0].push(newDate);
      }
      tempTime[1] = handleChooseTime(idx);
      state.goodTypeList[idx].multiArray = tempTime;
      state.goodTypeList = state.goodTypeList;
      if (state.goodTypeList[idx].teamBuyInfo.selfAfterDay != null || state.goodTypeList[idx].teamBuyInfo.selfAfterDay === 0) {
        // 特别的处理日期在完善订单页面的显示
        let days = state.goodTypeList[idx].multiArray[0][state.goodTypeList[idx].multiIndex[0]];
        let daysArr = days.split("-");
        let date = daysArr[1] + '月' + daysArr[2] + '日';
        let selfTimeDate = date;
      }
    }
  } else if (state.goodTypeList[idx].orderType === 'solitaire') {
    // 拼团自提时间均不可选，为固定时间点或时间段
    let selfStartTime = state.goodTypeList[idx].solitaireInfo.selfStartTime;
    let selfEndTime = state.goodTypeList[idx].solitaireInfo.selfEndTime;
    if (selfStartTime != null && selfEndTime != null && selfStartTime != '' && selfEndTime != '') {
      // 如果当前拼团活动设置了拼团自提开始时间和自提结束时间，则页面上显示拼团自提开始时间和自提结束时间段
      let startTimeArr = selfStartTime.split(" ");
      let endTimeArr = selfEndTime.split(" ");
      let daysArrStart = startTimeArr[0].split("-");
      let daysArrEnd = endTimeArr[0].split("-");
      let startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
      let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
      let orderSelfTime = startDate + '-' + endDate;
      if (state.goodTypeList[idx].storeInfo.storeHours != null) {
        orderSelfTime = orderSelfTime + ' ' + state.goodTypeList[idx].storeInfo.storeHours;
      }
      state.goodTypeList[idx].orderSelfTime = orderSelfTime;
      state.goodTypeList = state.goodTypeList;
      console.log(state.orderSelfTime);
    } else {
      // 如果当前拼团没有设置拼团自提开始时间和自提结束时间，则根据订单预约开始时间在页面上显示自提时间点
      if (!state.goodTypeList[idx].solitaireInfo.selfAfterDay) {
        state.showTimeChoose = true;
      }
      for (let i = 0; i < days; i++) {
        let date = addDay(newAppointmentDate, i);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let newDate = [year, month, day].map(util.timeFormat).join('-');
        tempTime[0].push(newDate);
      }
      tempTime[1] = handleChooseTime(idx);
      state.goodTypeList[idx].multiArray = tempTime;
      state.goodTypeList = state.goodTypeList;
      if (state.goodTypeList[idx].solitaireInfo.selfAfterDay != null || state.goodTypeList[idx].solitaireInfo.selfAfterDay === 0) {
        // 特别的处理日期在完善订单页面的显示
        let days = state.goodTypeList[idx].multiArray[0][state.goodTypeList[idx].multiIndex[0]];
        let daysArr = days.split("-");
        let date = daysArr[1] + '月' + daysArr[2] + '日';
        // let selfTimeDate = date
      }
    }
  } else {
    for (let i = 0; i < days; i++) {
      let date = addDay(newAppointmentDate, i);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let newDate = [year, month, day].map(util.timeFormat).join('-');
      tempTime[0].push(newDate);
    }
    tempTime[1] = handleChooseTime(idx);
    state.goodTypeList[idx].multiArray = tempTime;
    state.goodTypeList = state.goodTypeList;
  }
  if (state.goodTypeList[idx].orderType !== 'group' && state.goodTypeList[idx].orderType !== 'advanceSell') {
    // 特别的处理日期在完善订单页面的显示
    // let days = self.data.multiArray[0][self.data.multiIndex[0]]
    // let daysArr = days.split("-")
    // let date = daysArr[1] + '月' + daysArr[2] + '日'
    // let selfTimeDate = date
    // this.setData({
    //     selfTimeDate: selfTimeDate
    // })
  }
  //  切换配送方式 外卖/自提重新从后端获取配送时间
  if (state.goodTypeList[idx].orderType == 'nextDay') {
    getNextDayTime(idx);
  } else if (state.goodTypeList[idx].orderType != 'distribution' || state.goodTypeList[idx].type === 'selftake' || state.goodTypeList[idx].type === 'dispatch') {
    getCalculateTime(idx);
  }
}
function getStoreInfoById (id) {
  const that = this;
  storeService.getById(id).then(res => {
    console.log(res);
    const storeInfo = res;
    let storeTime = storeInfo.storeHours ? storeInfo.storeHours.split("-") : [];
    state.storeTime = storeTime;
    state.storeInfo = storeInfo;
  });
}
function handleChooseTime (idx) {
  const self = this;
  let now = new util.ResponseDate();
  let hour = now.getHours(); //小时数
  const minute = now.getMinutes(); //分钟数
  let time = [hour, minute].map(util.timeFormat).join(':');
  const configure = state.systemOptions; //获取订单相关的系统配置
  let orderAppointmentDate = configure.daysOfSelfTimeDelay; //订单预约限定下单后第几天开始
  let storeTime = '';
  let tempTime = [];
  let businessHours = [];
  // 处理经营时间
  try {
    let allStores = uni.getStorageSync('wj_allStores');
    console.log(state.goodTypeList[idx].storeId);
    let reg = new RegExp(state.goodTypeList[idx].storeId);
    if (allStores) {
      allStores.forEach(item => {
        if (reg.test(item.id)) {
          storeTime = item.storeHours ? item.storeHours.split("-") : [];
        }
      });
    }
  } catch (e) { }
  let tempStart = storeTime[0] + ':00';
  let tempEnd = storeTime[1] + ':00';
  let date = util.formatTime(now).split(" ")[0];
  if (state.goodTypeList[idx].orderType === 'group' && (state.goodTypeList[idx].teamBuyInfo.selfAfterDay != null || state.goodTypeList[idx].teamBuyInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].teamBuyInfo.selfAfterDay;
  } else if (state.goodTypeList[idx].orderType === 'solitaire' && (state.goodTypeList[idx].solitaireInfo.selfAfterDay != null || state.goodTypeList[idx].solitaireInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].solitaireInfo.selfAfterDay;
  }
  console.log("订单推迟几天可以预约：", orderAppointmentDate);
  let nowTime = new Date(util.formatTime(now)).getTime();
  if (state.goodTypeList[idx].type === "selftake" && orderAppointmentDate > 0) {
    let storeHours = storeTime[0].slice(0, 2);
    hour = Number(storeHours);
    time = storeTime[0];
    let newDate = addDay(now, orderAppointmentDate);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    date = [year, month, day].map(util.timeFormat).join('/');
    let newTime = date + " " + tempStart;
    nowTime = new Date(newTime).getTime();
  }
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  console.log(nowTime, startTimeDetails, endTimeDetails);
  businessHours = splitTime(date, date, state.systemOptions.orderChooseDateInterval, tempStart, tempEnd);
  let hourArray = []; //营业时间小时数组
  businessHours.forEach(ele => {
    hourArray.push(ele.slice(0, 2));
  });
  let hourArrayLength = hourArray.length;
  let chooseTime = [[], []];
  for (let j = 0; j < businessHours.length - 1; j++) {
    const eleStart = businessHours[j];
    const eleEnd = businessHours[j + 1];
    let tempData = eleStart + '-' + eleEnd;
    chooseTime[0].push(tempData);
  }
  for (let i = 0; i < hourArray.length; i++) {
    if (hour >= hourArray[i] && hour < hourArray[i + 1]) {
      chooseTime[1].push(time + '-' + businessHours[i + 1]);
      for (let k = i + 1; k < businessHours.length - 1; k++) {
        const eleStart = businessHours[k];
        const eleEnd = businessHours[k + 1];
        let tempData = eleStart + '-' + eleEnd;
        chooseTime[1].push(tempData);
      }
    }
  }
  state.goodTypeList[idx].chooseTime = chooseTime;
  state.goodTypeList[idx].storeTime = storeTime;
  // 小时
  state.goodTypeList = state.goodTypeList;
  if (nowTime < startTimeDetails || nowTime < endTimeDetails) {
    tempTime = chooseTime[1];
  } else {
    tempTime = chooseTime[0];
  }
  if (state.goodTypeList[idx].orderType === 'advanceSell') {
    // 预售
    // tempTime = chooseTime[0]
  }
  console.log('chooseTime', chooseTime, storeTime);
  console.log('chooseTime', state.goodTypeList, tempTime);
  return tempTime;
}
function splitTime (startDate, endDate, amount, timeStart, timeEnd) {
  let startTime = new Date(startDate + " " + timeStart);
  let endTime = new Date(endDate + " " + timeEnd);
  let gap = amount;
  let count = Math.ceil((endTime - startTime) / gap);
  let realCount = (endTime - startTime) / gap;
  let temp = [];
  let tempTime = [];
  if (count - realCount >= 0) {
    temp.push(util.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = util.formatTime(new Date(startTime.getTime()));
    }
    temp.push(util.formatTime(endTime));
  } else {
    temp.push(util.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = util.formatTime(new Date(startTime.getTime()));
    }
  }
  temp.forEach(item => {
    let tempData = item.split(" ")[1].slice(0, 5);
    tempTime.push(tempData);
  });
  tempTime = Array.from(new Set(tempTime));
  return tempTime;
}
function addDay (curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function toChooseAddress () {
  let opts = '?from=perfectOrder';
  NAVPAGE.toAddressList(opts);
}
function addRemarks (e) {
  state.editActiveIdx = e.currentTarget.dataset.idx;
  uni.setStorageSync('editActiveIdx', e.currentTarget.dataset.idx);
  uni.setStorageSync('wj_addRemarks', state.goodTypeList[e.currentTarget.dataset.idx].remarks);
  let opts = '?type=' + state.goodTypeList[e.currentTarget.dataset.idx].type;
  NAVPAGE.toAddRemarks(opts);
}
function getPostData () {
  const that = this;
  let products = [];
  let goodsList = [];
  let goodTypeList = [];
  goodTypeList = state.goodTypeList.filter(item => {
    return item.goodsList && item.goodsList.length > 0;
  });
  goodTypeList.forEach(item1 => {
    item1.goodsList.forEach(item => {
      let tempItem = {
        productId: item.productId,
        productNum: item.productNum,
        useOriPrice: item.useOriPrice || false
      };
      if (state.offlinType === "cashReceipt") {
        tempItem = {
          ...tempItem,
          price: state.allPrice
        };
      }
      // 分享人id
      if (item.sharingPersonId) {
        tempItem = {
          ...tempItem,
          sharingPersonId: item.sharingPersonId
        };
      }
      if (item.groupProducts && item.groupProducts.length > 0) {
        tempItem.cateringOrderDetails = item.groupProducts;
      }
      if (state.scource === 'SHOPPINGCART') {
        tempItem = {
          ...tempItem,
          shoppingCartItemId: item.id
        };
      }
      if (item.newmbrActivityId) {
        tempItem = {
          ...tempItem,
          newmbrActivityId: item.newmbrActivityId
        };
        products.push(tempItem);
      } else if (item.grabActivityId) {
        tempItem = {
          ...tempItem,
          activityId: item.grabActivityId
        };
        products.push(tempItem);
      } else if (item.usePromotionPrice) {
        tempItem = {
          ...tempItem,
          usePromotionPrice: true
        };
        products.push(tempItem);
      } else if (item.useMemberPrice) {
        tempItem = {
          ...tempItem,
          useMemberPrice: true
        };
        products.push(tempItem);
      } else if (state.orderType === 'CYCLE') {
        tempItem = {
          ...tempItem,
          cycleFixedId: state.cycleFixedId,
          business: item.business,
          giftProduct: item.giftProduct
        };
        products.push(tempItem);
      } else {
        products.push(tempItem);
      }
      // 如果该商品有赠品
      if (item.goodsPromotions && item.goodsPromotions.length > 0) {
        item.goodsPromotions.forEach(item => {
          products.push({
            giftProduct: true,
            productId: item.goods.uuid,
            productNum: item.count
          });
        });
      }
    });
    goodsList = goodsList.concat(item1.goodsList);
  });
  // this.data.goodsList.forEach(item => {
  //     let tempItem = {
  //         productId: item.productId,
  //         productNum: item.productNum
  //     }
  //     if (that.data.offlinType === "cashReceipt") {
  //         tempItem = {
  //             ...tempItem,
  //             price: that.data.allPrice
  //         }
  //     }
  //     // 分享人id
  //     if (item.sharingPersonId) {
  //         tempItem = {
  //             ...tempItem,
  //             sharingPersonId: item.sharingPersonId
  //         }
  //     }
  //     if (item.groupProducts && item.groupProducts.length > 0) {
  //         tempItem.cateringOrderDetails = item.groupProducts
  //     }
  //     if (that.data.scource === 'SHOPPINGCART') {
  //         tempItem = {
  //             ...tempItem,
  //             shoppingCartItemId: item.id
  //         }
  //     }
  //     if (item.newmbrActivityId) {
  //         tempItem = {
  //             ...tempItem,
  //             newmbrActivityId: item.newmbrActivityId
  //         }
  //         products.push(tempItem)
  //     } else if (item.grabActivityId) {
  //         tempItem = {
  //             ...tempItem,
  //             activityId: item.grabActivityId
  //         }
  //         products.push(tempItem)
  //     } else if (item.usePromotionPrice) {
  //         tempItem = {
  //             ...tempItem,
  //             usePromotionPrice: true
  //         }
  //         products.push(tempItem)
  //     } else if (item.useMemberPrice) {
  //         tempItem = {
  //             ...tempItem,
  //             useMemberPrice: true
  //         }
  //         products.push(tempItem)
  //     } else if (that.data.orderType === 'CYCLE') {
  //         tempItem = {
  //             ...tempItem,
  //             cycleFixedId: that.data.cycleFixedId,
  //             business: item.business,
  //             giftProduct: item.giftProduct
  //         }
  //         products.push(tempItem)
  //     } else {
  //         products.push(tempItem)
  //     }
  //     // 如果该商品有赠品
  //     if (item.goodsPromotions && item.goodsPromotions.length > 0) {
  //         item.goodsPromotions.forEach(item => {
  //             products.push({
  //                 giftProduct: true,
  //                 productId: item.goods.uuid,
  //                 productNum: item.count
  //             })
  //         })
  //     }
  // })
  state.goodsList = goodsList;
  state.giftGoodsList.forEach(item => {
    products.push({
      giftProduct: true,
      productId: item.productId,
      productNum: item.productNum
    });
  });
  let postData = '';
  // console.log('3selectTime',tempSelfTime)
  // giftCardDiscount 增加总价减去礼品卡扣除的钱
  const shipmentRealPay = Number(state.shipmentRealPay);
  let paymentPrice = parseFloat(state.allPrice) - parseFloat(state.totalDiscount) + parseFloat(shipmentRealPay) - parseFloat(state.scoreDiscount) - parseFloat(state.giftCardDiscount);
  paymentPrice = paymentPrice > 0 ? parseFloat(paymentPrice).toFixed(2) : 0;
  let couponData = [];
  let externalCouponData = [];
  if (state.couponInfo.useCoupon) {
    if (state.usedCoupons.length > 0) {
      state.usedCoupons.forEach(item => {
        if (item.service === 'GM') {
          couponData.push(item.couponId);
          // } else if (item.service === 'HD' || item.service === 'ZJIAN') {
          //     externalCouponData = item.couponId
        } else {
          // 处理优惠券非Gm的券
          externalCouponData.push(item.couponId);
        }
      });
    }
  }

  // 查询本地缓存，是否有场景值‘_scene_’缓存,
  let fromScene = '';
  try {
    let scene = uni.getStorageSync('_scene_');
    if (scene) {
      // Do something with return value
      fromScene = '-' + scene;
    }
  } catch (e) {
    // Do something when catch error
  }
  let receiverMobile = state.memberInfo.mobile;
  if (state.addressInfo && state.addressInfo.contactsMobile && state.addressInfo.contactsMobile != null && state.addressInfo.contactsMobile !== "") {
    receiverMobile = state.addressInfo.contactsMobile;
  }

  // 如果是团购
  let shipmentGroups = [];
  state.goodTypeList.forEach(goodType => {
    let paymentPrice = parseFloat(goodType.allPrice || 0) - parseFloat(state.totalDiscount || 0) + parseFloat(goodType.shipmentRealPay || 0) - parseFloat(state.scoreDiscount || 0) - parseFloat(state.giftCardDiscount || 0);
    paymentPrice = paymentPrice > 0 ? parseFloat(paymentPrice).toFixed(2) : 0;
    let tempSelfTime = null;
    let shipmentType = 'SELF';
    if (goodType.orderType === 'nextDay' && goodType.storePickupTime) {
      let tempTime = goodType.storePickupTime;
      let tempTimeArr = tempTime.split(' ');
      let timeArr = tempTimeArr[1].split('~');
      tempSelfTime = tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00';
      shipmentType = 'SELF';
      if (goodType.type === 'dispatch') {
        shipmentType = goodType.shipmentType == 'LOGISTICAL' || goodType.isDistributionOrder ? 'LOGISTICAL' : 'EXPRESS';
      }
    } else if (goodType.type === 'logistical') {
      shipmentType = 'LOGISTICAL';
    } else {
      shipmentType = 'SELF';
      if (goodType.type === 'dispatch') {
        shipmentType = goodType.shipmentType == 'LOGISTICAL' || goodType.isDistributionOrder ? 'LOGISTICAL' : 'EXPRESS';
      }
      // 自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
      if (goodType.orderType === 'group') {
        // 判断拼团是否有自提开始时间和自提结束时间 拼团自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
        if (goodType.teamBuyInfo.selfStartTime != null && goodType.teamBuyInfo.selfEndTime != null && goodType.teamBuyInfo.selfStartTime != '' && goodType.teamBuyInfo.selfEndTime != '') {
          let selfStartTime = goodType.teamBuyInfo.selfStartTime;
          let selfEndTime = goodType.teamBuyInfo.selfEndTime;
          tempSelfTime = selfStartTime + '~' + selfEndTime;
        } else {
          if (goodType.storePickupTime) {
            let tempTime = goodType.storePickupTime;
            let tempTimeArr = tempTime.split(' ');
            let timeArr = tempTimeArr[1].split('-');
            tempSelfTime = tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00';
          }
        }
      } else if (goodType.orderType === 'solitaire') {
        if (goodType.solitaireInfo.selfStartTime != null && goodType.solitaireInfo.selfEndTime != null && goodType.solitaireInfo.selfStartTime != '' && goodType.solitaireInfo.selfEndTime != '') {
          let selfStartTime = goodType.solitaireInfo.selfStartTime;
          let selfEndTime = goodType.solitaireInfo.selfEndTime;
          tempSelfTime = selfStartTime + '~' + selfEndTime;
        } else {
          if (goodType.storePickupTime) {
            let tempTime = goodType.storePickupTime;
            let tempTimeArr = tempTime.split(' ');
            let timeArr = tempTimeArr[1].split('-');
            tempSelfTime = tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00';
          }
        }
      } else if (goodType.orderType === "advanceSell" && goodType.advanceSellInfo.selfTimeScope != null && goodType.advanceSellInfo.selfTimeScope != "") {
        if (goodType.storePickupTime) {
          let tempTime = goodType.storePickupTime;
          let tempTimeArr = tempTime.split(' ');
          let timeArr = tempTimeArr[1].split('-');
          tempSelfTime = tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00';
        }
        // tempSelfTime = goodType.advanceSellInfo.selfTimeScope
      } else {
        if (goodType.storePickupTime) {
          let tempTime = goodType.storePickupTime;
          let tempTimeArr = tempTime.split(' ');
          let timeArr = tempTimeArr[1].split('-');
          tempSelfTime = tempTimeArr[0] + ' ' + timeArr[0] + ':00' + '~' + tempTimeArr[0] + ' ' + timeArr[1] + ':00';
        }
      }
    }
    // console.log('selectTime',tempSelfTime)
    let storeId = goodType.storeId;
    if (goodType.orderType === 'CYCLE') {
      if (products[0].business === 'DISTRIBUTION') {
        storeId = app.globalData.distributionStore.id;
      } else {
        storeId = app.globalData.storeInfo.id;
      }
    }
    console.log(storeId, 'storeIdstoreId');
    let remarks = goodType.remarks || '';
    if (state.sourceOrderData && state.sourceOrderData.sourceOrderNo) {
      remarks += `&原单号=${state.sourceOrderData.sourceOrderNo}&门店号=${state.sourceOrderData.storeCode}&pos机号=${state.sourceOrderData.posNo} `;
    }
    postData = {
      usedCoupons: state.usedCoupons,
      allPrice: paymentPrice,
      // 应该支付的金额
      products: products,
      // 商品列表
      receiverMobile: receiverMobile,
      // 收货人手机号
      remark: remarks === '' ? '暂无备注~' : remarks,
      // 备注
      scource: state.scource,
      // 来自购物车SHOPPINGCART 立即购买BUYNOW
      shipmentAmount: shipmentType == 'SELF' ? 0 : parseFloat(goodType.shipmentAmount || 0),
      // 快递费
      shipmentType: shipmentType,
      // 配送方式
      selfTimeScope: tempSelfTime,
      // 预约自提时间
      storeId: storeId,
      // 门店id
      // goodType.isDistributionOrder ? storeId : 
      // oriStoreId: goodType.isDistributionOrder && app.globalData.storeInfo? (app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id) : (goodType.storeInfo.virtualStoreId || goodType.storeInfo.id), // 原门店id
      couponIds: couponData,
      //券Id
      externalCouponNumbers: externalCouponData,
      score: goodType.useScore ? goodType.scoreAmount * goodType.scoreInfo.scoreSpace : '0',
      orderSource: state.orderSource ? state.orderSource : 'MINI_APP' + fromScene,
      chooseStoreId: goodType.orderType === 'CYCLE' && products[0].business === 'DISTRIBUTION' ? app.globalData.storeInfo.id : ''
    };
    if (goodType.orderType === 'nextDay' && !state.multipleOrdersFlag && state.goodTypeList.length == 1) {
      postData.type = 'NEXT_DAY';
      postData.storeId = goodType.storeInfo.virtualStoreId || goodType.storeInfo.id;
      postData.oriStoreId = goodType.storeId || app.globalData.nextDayStore.id;
    }
    if (state.orderSource && state.orderSource === 'WX_MINI_APP-LIVE') {
      postData = {
        ...postData,
        roomId: state.room_id
      };
    }
    if (cacheOrder) {
      // 收银下单，传入缓存订单id
      postData = {
        ...postData,
        cacheOrderId: cacheOrder.cacheOrderId,
        scource: cacheOrder.scource,
        type: cacheOrder.type,
        inputAmount: state.inputAmount > 0 ? state.inputAmount : 0
      };
    }
    if (state.displayAddressFlag || shipmentType === 'EXPRESS' || shipmentType === 'LOGISTICAL') {
      if (state.addressInfo) {
        postData = {
          ...postData,
          deliveryAddressId: state.addressInfo.id,
          // 收货地址id
          distributionDistance: state.distance,
          // 配送距离
          shipmentAmount: parseFloat(goodType.shipmentRealPay || 0) + parseFloat(goodType.shipmentDiscount || 0) + parseFloat(goodType.shipmentCouponDiscount || 0),
          // 快递费
          deductibleShipmentAmonut: parseFloat(goodType.shipmentDiscount || 0),
          lat: state.addressInfo.latitude,
          lng: state.addressInfo.longitude
        };
      }
    }
    if (goodType.orderType === 'group') {
      postData = {
        ...postData,
        teamBuyingId: goodType.teamBuyId || state.teamBuyId,
        teamLeaderRecordId: goodType.teamLeaderRecordId || state.teamLeaderRecordId,
        scource: state.scource
      };
    } else if (goodType.orderType === 'secondkill') {
      //如果是秒杀
      if (state.scource === 'SHOPPINGCART') {
        postData = {
          ...postData,
          scource: 'SHOPPINGCART'
        };
      } else {
        let productData = [];
        goodType.goodsList.forEach(item => {
          let tempItemData = {
            productId: item.productId,
            productNum: item.productNum
          };
          if (item.grabActivityId) {
            tempItemData.activityId = item.grabActivityId;
          }
          if (item.groupProducts && item.groupProducts.length > 0) {
            tempItemData.cateringOrderDetails = item.groupProducts;
          }
          productData.push(tempItemData);
        });
        postData = {
          ...postData,
          products: productData,
          scource: 'BUYNOW' //抢购默认秒杀
        };
      }
    } else if (goodType.orderType === 'advanceSell') {
      //如果是预售
      let productData = [];
      let balanceTotal = 0;
      goodType.goodsList.forEach(item => {
        console.log(item);
        if (item.advanceId) {
          productData.push({
            advanceId: item.advanceId,
            balanceTotal: item.balanceTotal,
            productId: item.productId,
            productNum: item.productNum
          });
          balanceTotal = item.balanceTotal;
        } else {
          productData.push({
            productId: item.productId,
            productNum: item.productNum
          });
        }
      });
      postData = {
        ...postData,
        balanceTotal: balanceTotal,
        products: productData,
        scource: 'BUYNOW'
      };
    } else if (goodType.orderType === 'scoreMall') {
      postData = {
        ...postData,
        scource: 'BUYNOW'
      };
    } else if (goodType.orderType === 'solitaire') {
      postData = {
        ...postData,
        solitaireId: state.solitaireId
      };
    } else if (goodType.orderType === 'packaging') {
      postData = {
        ...postData,
        packagingId: state.packagingId,
        scource: 'BUYNOW'
      };
    } else if (goodType.orderType === 'CYCLE') {
      postData = {
        ...postData,
        cycleId: goodType.cycleId || state.cycleId,
        deliveryTime: (goodType.deliveryTimeCycle || state.deliveryTimeCycle) + ' 12:00:00',
        type: goodType.orderType,
        scource: 'BUYNOW'
      };
      postData.shipmentAmount = parseFloat(state.cycleFee);
      postData.allPrice = (parseFloat(postData.allPrice) + parseFloat(state.cycleFee) - parseFloat(state.shipmentRealPay)).toFixed(2) - state.shipmentCouponDiscount;
      postData.allPrice = parseFloat(parseFloat(postData.allPrice).toFixed(2));
      // shipmentAmount: this.data.orderType === 'CYCLE' ? parseFloat(this.data.shipmentAmount) : parseFloat(this.data.shipmentAmount), // 快递费
    } else if (goodType.orderType === 'service') {
      let selfPickEndTime = state.appointmentTime;
      if (state.serviceDuration && state.appointmentTime) {
        let dateData = new Date(new Date(state.appointmentTime.replace(/-/g, '/')).getTime() + state.serviceDuration * 1000 * 60);
        selfPickEndTime = formatDate(dateData.getTime());
      }
      postData = {
        ...postData,
        scource: 'BUYNOW',
        contacts: state.appointmentUser,
        receiverMobile: state.appointmentMobile,
        selfPickBeginTime: state.appointmentTime + ':00',
        selfPickEndTime: selfPickEndTime,
        serviceStaffId: state.serviceStaffData.id,
        type: 'SERVICE',
        selfTimeScope: state.appointmentTime + ':00~' + selfPickEndTime
      };
    }
    shipmentGroups.push({
      ...postData
    });
  });
  console.log(shipmentGroups, 'shipmentGroups 订单数据列表');
  // 如果是用了礼品卡
  // if (this.data.giftCardDiscount > 0) {
  //     postData = {
  //         ...postData,
  //         giftCardNo: this.data.orderGiftCard.cardId,
  //         giftCardTotal: this.data.giftCardDiscount
  //     }
  // }

  // 如果是用了礼品卡 --- (礼品卡优化带参数)
  if (state.giftCardDiscount > 0) {
    let giftCardNoOrders = [];
    // 最大额度的卡扣最终剩余的金额 其他卡均直接扣除该卡的所有额度
    let max = 0;
    state.orderGiftCard.forEach(item => {
      if (max < item.balance) {
        max = item.balance;
      }
    });
    let maxIndex = state.orderGiftCard.findIndex(item => item.balance === max);
    let reduceCardMoney = 0; // 扣除了的所有金额
    state.orderGiftCard.forEach((item, index) => {
      // 如果不是最大额度的卡，直接扣除卡内金额
      if (index != maxIndex) {
        giftCardNoOrders.push({
          cardNo: item.cardNo,
          amount: item.balance
        });
        // 扣除了的所有金额
        reduceCardMoney += item.balance;
      }
    });
    state.orderGiftCard.forEach((item, index) => {
      // 最大额度的卡
      if (index == maxIndex) {
        giftCardNoOrders.push({
          cardNo: item.cardNo,
          amount: state.giftCardDiscount - reduceCardMoney
        });
      }
    });
    shipmentGroups[0] = {
      ...shipmentGroups[0],
      giftCardNoOrders: giftCardNoOrders
    };
  }

  // 如果通过分享
  if (state.sharingPersonId && state.sharingPersonId !== app.globalData.userInfo.member.id) {
    let productData = [];
    let hasSharingPersonId = false;
    for (let i = 0; i < shipmentGroups[0].products.length; i++) {
      const ele = shipmentGroups[0].products[i];
      if (ele.sharingPersonId) {
        hasSharingPersonId = true;
        break;
      }
    }
    if (!hasSharingPersonId) {
      shipmentGroups[0].products.forEach(item => {
        productData.push({
          ...item,
          sharingPersonId: state.sharingPersonId
        });
      });
    }
    shipmentGroups[0] = {
      ...shipmentGroups[0],
      orderSource: 'WX_MINI_APP-SHARE',
      products: productData
    };
  }
  let multipleOrdersPostData = !shipmentGroups || shipmentGroups.length == 0 ? {
    ...postData
  } : {
    ...shipmentGroups[0]
  };
  if (shipmentGroups && shipmentGroups.length == 1) {
    state.multipleOrdersFlag = false;
  }
  if (state.multipleOrdersFlag) {
    // 存在混单数据添加特殊传参
    multipleOrdersPostData.type = 'MIXED';
    multipleOrdersPostData.shipmentGroups = [];
    let allPrice = 0;
    let shipmentAmount = 0;
    state.goodTypeList.forEach(item => {
      shipmentAmount += parseFloat(item.type != 'selftake' && (item.shipmentType && item.shipmentType != 'SELF' || item.orderType == 'distribution') ? item.shipmentAmount : 0);
      let paymentPrice = parseFloat(item.allPrice || 0) + parseFloat(item.shipmentRealPay || 0);
      paymentPrice = paymentPrice > 0 ? parseFloat(paymentPrice).toFixed(2) : 0;
      allPrice += parseFloat(paymentPrice);
      if (item.type != 'selftake') {
        item.lat = state.addressInfo.latitude;
        item.lng = state.addressInfo.longitude;
        item.deliveryAddressId = state.addressInfo.id;
      } else {
        item.shipmentAmount = 0;
      }
      let type = item.type;
      let typeObj = {
        secondkill: 'GRAB',
        group: 'TEAMBUING',
        solitaire: 'SOLITAIRE',
        advanceSell: 'ADVANCE_SELL',
        CYCLE: 'CYCLE',
        distribution: 'MIXED',
        service: 'SERVICE',
        nextDay: 'NEXT_DAY'
      };
      let externalCouponNumbers1 = externalCouponData;
      if (item.freeshipList && item.freeshipList.length > 0) {
        externalCouponNumbers1 = [];
        item.freeshipList.forEach(freeshipItem => {
          externalCouponNumbers1.push(freeshipItem.couponId);
        });
      }
      let shipmentItem = {
        ...item,
        allPrice: paymentPrice,
        products: item.goodsList,
        type: typeObj[item.orderType] || 'COMMON',
        usedCoupons: item.freeshipList,
        remark: item.remarks,
        storeId: item.isNextDayOrder ? item.storeInfo.virtualStoreId || item.storeInfo.id : item.storeId,
        // 门店id
        oriStoreId: item.isNextDayOrder ? item.storeId : item.storeInfo.virtualStoreId || item.storeInfo.id,
        // 原门店id
        externalCouponNumbers: externalCouponNumbers1,
        shipmentType: item.shipmentType || (item.orderType == 'distribution' ? 'LOGISTICAL' : 'SELF')
      };
      // if( item.orderType === 'nextDay' || item.isNextDayOrder) {
      //   shipmentItem.storeId = goodType.storeInfo.virtualStoreId || goodType.storeInfo.id
      //   shipmentItem.oriStoreId = goodType.storeId || app.globalData.nextDayStore.id
      // }
      multipleOrdersPostData.shipmentGroups.push(shipmentItem);
    });
    multipleOrdersPostData.shipmentAmount = shipmentAmount;
    multipleOrdersPostData.allPrice = (allPrice - parseFloat(state.scoreDiscount || 0) - parseFloat(state.giftCardDiscount || 0) - parseFloat(state.totalDiscount || 0)).toFixed(2);
    // 合单情况下去除外部备注
    delete multipleOrdersPostData.remark;
  }
  return !shipmentGroups || shipmentGroups.length == 0 ? postData : shipmentGroups.length > 1 ? multipleOrdersPostData : shipmentGroups[0];
}
function weixinPay () {
  // if(!this.data.useWxValue) { 支付改动注释
  //     let allPrice = this.data.allPrice - this.data.totalDiscount + this.data.shipmentAmount - this.data.shipmentCouponDiscount  - this.data.scoreDiscount - this.data.giftCardDiscount;
  //     if(this.data.accountDetail && this.data.accountDetail.balance && allPrice > this.data.accountDetail.balance) {
  //         this.setData({
  //             useWxValue: true
  //         })
  //     } else {
  //         this.setData({
  //             cashDelivery: false,
  //             "payMethod.cardDeductTotal": 0,
  //             // useStoredValueCard: false,
  //             useStoredMspCard: false,
  //             accountDetail: {},
  //             cardDeductTotal: 0,
  //             "payMethod.useStoredValueCard": false,
  //             "payMethod.cardNo": '',
  //             useWxValue: true
  //         })
  //     }
  // } else {
  //     this.setData({
  //         useWxValue: false
  //     })
  // }
  state.cashDelivery = false;
  state.payMethod.cardDeductTotal = 0;
  state.useStoredValueCard = false;
  state.useStoredMspCard = false;
  state.cardDeductTotal = 0;
  state.payMethod.useStoredValueCard = false;
  state.payMethod.cardNo = '';
}
function passProudrtBtn () {
  let goodsList = state.goodsList;
  console.log(state.passProductActive, 'this.data.passProductActive');
  for (let i = 0; i < goodsList.length; i++) {
    const productId = goodsList[i].productId;
    for (let j = 0; j < state.passProductActive.length; j++) {
      const passProductId = state.passProductActive[j].productId;
      if (productId == passProductId) {
        goodsList.splice(i, 1);
        i--; // 更新i的值以避免跳过下一个元素
      }
    }
  }
  let goodTypeList = [];
  state.goodTypeList.forEach((item, index) => {
    let goodsList = [];
    item.goodsList.forEach((good, index) => {
      let flag = state.passProductActive.some(passProduct => {
        return passProduct.productId == good.productId;
      });
      if (!flag) {
        goodsList.push(good);
      }
    });
    // goodTypeList.push({
    //   ...item,
    // })
    state.goodTypeList[index].goodsList = goodsList;
  });
  state.goodTypeList = state.goodTypeList.filter(item => {
    return item.goodsList && item.goodsList.length > 0;
  });
  // const sum = goodsList.reduce((acc, cur) => {
  //     return acc + cur.sellPrice * cur.productNum;
  // }, 0);
  let sum = 0;
  let shipmentCouponDiscount = 0;
  let couponDiscount = 0;
  let shipmentDiscount = 0;
  let freeshipList = [];
  let couponList = [];
  let useCoupons = [];
  state.goodTypeList.forEach(item => {
    shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
    shipmentDiscount += parseFloat(item.shipmentDiscount || 0);
    sum += parseFloat(item.allPrice || 0);
    couponDiscount += parseFloat(item.couponDiscount || 0);
    if (item.couponList && item.couponList.length > 0) {
      item.couponList.forEach(item1 => {
        useCoupons.push(item1);
        couponList.push({
          service: item1.service,
          coupon: {
            id: item1.couponId
          },
          usable: true
        });
      });
    }
    if (item.freeshipList && item.freeshipList.length > 0) {
      item.freeshipList.forEach(item1 => {
        useCoupons.push(item1);
        freeshipList.push({
          service: item1.service,
          coupon: {
            id: item1.couponId
          },
          usable: true
        });
      });
    }
  });
  state.goodTypeList = state.goodTypeList;
  state.goodsList = goodsList;
  state.allPrice = sum;
  state.usedCoupons = useCoupons;
  state.couponInfo = {
    description: '选择优惠券',
    data: {
      freeship: freeshipList,
      discount: couponList
    },
    useCoupon: freeshipList.length > 0 || couponList.length > 0
  };
  state.couponDiscount = couponDiscount;
  state.shipmentDiscount = shipmentDiscount;
  state.shipmentCouponDiscount = shipmentCouponDiscount;
  if (goodsList.length > 0) {
    if (state.addressInfo) {
      console.log('1376calcDistance');
      calcDistance(state.addressInfo);
    }
    handlePayModule();
  } else {
    NAVPAGE.toShopcart();
  }
  toggle('pass');

  // this.calcPromotions();
}
function onMyEvent (e) {
  console.log(e, 'eeeeeee查看e是什么？');
  let self = this;
  let passProductActive = [];
  let passProduct = e.detail;
  passProduct.map(item => {
    state.goodsList.map(arr => {
      if (arr.productId == item.productId) {
        passProductActive.push({
          ...arr,
          ...item
        });
        state.passProductActive = passProductActive;
        state.canBuy = true;
      }
    });
  });
  toggle('pass');
}
function getValidateBenefitPlanText () {
  let params = getPostData();
  orderService.validateBenefitPlan(params).then(res => {
    if (res) {
      state.planTextTip = res || null;
    }
  });
}
function toggleOrderStoreTip () {
  state.orderStoreTip = !state.orderStoreTip;
}
function createOrderTip () {
  let systemSetting = uni.getSystemSetting();
  let self = this;
  // if(!canCalcPromotions) {
  //   wx.showToast({
  //     title: '正在计算优惠中，请稍等~',
  //     icon: 'none'
  //   })
  //   return 
  // }
  // 统配订单跳过
  if (state.orderType == 'distribution') {
    createOrder();
  } else if (state.placeOrderConfirmStore == 'nogps') {
    createOrder();
  } else if (state.placeOrderConfirmStore == 'everytime') {
    state.orderStoreTip = true;
  } else {
    uni.getSetting({
      success: res => {
        let authSetting = res.authSetting;
        if (authSetting['scope.userLocation'] && systemSetting.locationEnabled) {
          createOrder();
        } else if (authSetting['scope.userLocation'] === false) {
          // 用户未授权，提示用户进行授权
          // wx.showModal({
          //   title: '温馨提示',
          //   content: '您未授权地理位置信息，确认下单门店：' + self.data.storeName,
          //   confirmText: '确认',
          //   success: (res) => {
          //     if (res.confirm) {
          //       self.createOrder();
          //     }
          //   }
          // });
          state.orderStoreTip = true;
        } else if (!systemSetting.locationEnabled) {
          // 用户未授权，提示用户进行授权
          // wx.showModal({
          //   title: '温馨提示',
          //   content: '您的手机GPS未开启，确认下单门店：' + self.data.storeName,
          //   confirmText: '确认',
          //   success: (res) => {
          //     if (res.confirm) {
          //       self.createOrder();
          //     }
          //   }
          // });
          state.orderStoreTip = true;
        } else {
          // 用户未明确拒绝也未授权，提示用户进行设置
          uni.authorize({
            scope: 'scope.userLocation',
            success: () => {
              createOrder();
            },
            fail: () => {
              // wx.showModal({
              //   title: '温馨提示',
              //   content: '您未授权地理位置信息，确认下单门店：' + self.data.storeName,
              //   confirmText: '确认',
              //   success: (res) => {
              //     // 处理用户响应
              //       if (res.confirm) {
              //         self.createOrder()
              //       }
              //   }
              // });
              state.orderStoreTip = true;
            }
          });
        }
      },
      fail: err => { }
    });
  }
}
function createOrder (val) {
  const self = this;
  const postData = getPostData();
  let hasDeliveryTimeStatement = false;
  for (let i = 0; i < state.goodsList.length; i++) {
    if (state.goodsList[i].deliveryTimeStatement) {
      hasDeliveryTimeStatement = true;
      break;
    }
  }
  if (hasDeliveryTimeStatement) {
    uni.showModal({
      title: '提示',
      content: '该订单内含有特殊可自提/配送时间商品，此类商品自提/配送时间以该商品描述为准',
      success (res) {
        if (res.confirm) {
          handleCreateOrder();
        }
      }
    });
  } else {
    handleCreateOrder();
  }
  function handleCreateOrder () {
    confirmCreateOrder();
  }
}
function confirmCreateOrder () {
  const self = this;
  let postData = getPostData();

  // 判断是否选择收货逻辑位置提前
  let deliveryStatus = true;
  // 如果自提/配送时间不能为空 (时间模板存在数据)
  let flag = state.goodTypeList.some(item => {
    if ((item.type === 'dispatch' || item.type === 'selftake') && item.orderType !== 'CYCLE' && item.orderType !== 'nextDay' && item.orderType !== 'NEXT_DAY') {
      // console.log('selfTimeScope',postData.selfTimeScope)
      if (!postData.selfTimeScope && item.deliveryTimeData.length > 0) {
        const str = item.type === 'selftake' ? '自提时间不能为空~' : '配送时间不能为空~';
        uni.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        });
        return !postData.selfTimeScope && item.deliveryTimeData.length > 0;
      }
    }
    if (item.shipmentType === 'EXPRESS' || item.shipmentType === 'LOGISTICAL') {
      if (!postData.deliveryAddressId) {
        deliveryStatus = false;
        uni.showToast({
          title: '收货地址不能为空~',
          icon: 'none',
          duration: 2000
        });
        return !postData.deliveryAddressId;
      } else {
        deliveryStatus = true;
      }
    }
    if (item.type === 'dispatch' || item.type === 'logistical' || item.shipmentType === 'LOGISTICAL') {
      if (!item.calculatedDeliveryFee || !calculatedDeliveryFee) {
        uni.showToast({
          title: '还未计算出配送费，请稍等~',
          icon: 'none',
          duration: 2000
        });
      }
      return !item.calculatedDeliveryFee || !calculatedDeliveryFee;
    }
  });
  if (flag) {
    return false;
  }
  // if (self.data.type === 'dispatch' || this.data.type === 'logistical') {
  //     console.log(self.calculatedDeliveryFee)
  //     if (!self.data.calculatedDeliveryFee || !self.calculatedDeliveryFee) {
  //         console.log("还未计算出配送费")
  //         return;
  //     }
  //     if (self.data.orderType !== "packaging" && self.data.orderType !== 'solitaire' && postData.shipmentType !== 'SELF' && ((self.distributionFee && self.distributionFee.takeoutFare) || (self.logisticalFee && self.logisticalFee.takeoutFare))) {
  //         let takeoutFare = 0
  //         if (postData.shipmentType === 'EXPRESS') {
  //             takeoutFare = self.distributionFee.takeoutFare;
  //         } else if (postData.shipmentType === 'LOGISTICAL') {
  //             takeoutFare = self.logisticalFee.takeoutFare;
  //         }
  //         if (Number(self.data.allPrice) < takeoutFare) {
  //             // wx.showToast({
  //             //     title: '商品满' + takeoutFare + '元起送',
  //             //     icon: 'none',
  //             //     duration: 2000
  //             // })
  //             // return
  //         }
  //     }
  // }
  try {
    // 清除部分缓存数据，以免对其他订单造成影响
    uni.removeStorageSync('wj_orderCardInfo');
    uni.removeStorageSync('wj_addRemarks');
    uni.removeStorageSync('wj_invoice');
  } catch (e) { }
  // if (postData.shipmentType === 'EXPRESS' || postData.shipmentType === 'LOGISTICAL') {
  //     if (!postData.deliveryAddressId) {
  //         deliveryStatus = false
  //     } else {
  //         deliveryStatus = true
  //     }
  // }
  let orderType = state.orderType;
  if (deliveryStatus) {
    if (state.canBuy || state.order) {
      state.canBuy = false;
      if (postData.scource === "SHOPPINGCART") {
        app.globalData.isShopCartChange = true;
      }
      if (state.order) {
        // 订单已经创建，支付失败
        handlePayment(state.order);
        return;
      }
      // wx.showLoading({
      //   title: '',
      // })
      // || postData.type == 'NEXT_DAY'
      state.customLoading = true;
      if (state.multipleOrdersFlag) {
        orderService.createMixedcatering(postData).then(res => {
          console.log(res);
          let orderData = {
            // 订单数据重新塞入
            ...res.mainOrder,
            subOrders: res.subOrders
          };
          clearCacheData(orderData);
          handlePayment(orderData);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
        });
      } else if (orderType === 'service') {
        floristService.createServiceOrder(postData).then(res => {
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          state.customLoading = false;
          showCreateOrderError(err);
        });
      } else if (orderType === 'group') {
        teamBuyService.createOrder(postData).then(res => {
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);

          // 饭卡支付代码注释
          // let passProductActive = [];
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //             let flag = passProductActive.some(passProduct => {
          //               return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //             })
          //             if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...arr,
          //                     ...item
          //                 })
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })

          //     self.toggle('pass');

          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      } else if (orderType === 'advanceSell') {
        // 预售
        console.log(postData);
        advanceSellService.createOrder(postData).then(res => {
          console.log(res);
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // let passProductActive = [];
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //           let flag = passProductActive.some(passProduct => {
          //             return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //           })
          //           if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...arr,
          //                     ...item
          //                 })
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })

          //     self.toggle('pass');

          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      } else if (orderType === 'scoreMall') {
        orderService.createScoreOrder(postData).then(res => {
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // let passProductActive = [];
          // if (err.code == '16665') {
          //   let passProduct = JSON.parse(err.message)
          //   passProduct.map(item => {
          //     self.data.goodsList.map(arr => {
          //       let flag = passProductActive.some(passProduct => {
          //         return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //       })
          //       if (!flag && arr.productId == item.productId) {
          //         passProductActive.push({
          //             ...arr,
          //             ...item
          //         })
          //         self.setData({
          //             passProductActive,
          //             canBuy: true,
          //             titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //         })
          //       }
          //     })
          //   })
          //   self.toggle('pass');
          // } else {
          //   self.showCreateOrderError(err)
          // }
        });
      } else if (orderType === "solitaire") {
        solitaireService.createOrder(postData).then(res => {
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // let passProductActive = [];
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //           let flag = passProductActive.some(passProduct => {
          //             return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //           })
          //           if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...arr,
          //                     ...item
          //                 })
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })

          //     self.toggle('pass');

          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      } else if (orderType === 'packaging') {
        // 打包一口价
        console.log(postData);
        packagingService.createOrder(postData).then(res => {
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // let passProductActive = [];
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //           let flag = passProductActive.some(passProduct => {
          //             return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //           })
          //           if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...arr,
          //                     ...item
          //                 })
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })

          //     self.toggle('pass');

          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      } else if (orderType === 'CYCLE') {
        console.log(postData, 'postData');
        cycleService.createCycleOrder(postData).then(res => {
          // console.log(res,'res');
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //           let flag = passProductActive.some(passProduct => {
          //             return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //           })
          //           if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...arr,
          //                     ...item
          //                 })
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })
          //     self.toggle('pass');
          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      } else {
        orderService.createCatering(postData).then(res => {
          console.log(res);
          clearCacheData(res);
          handlePayment(res);
        }).catch(err => {
          // wx.hideLoading()
          state.customLoading = false;
          showCreateOrderError(err);
          // 饭卡支付代码注释
          // console.log(err, 'errerr');
          // let passProductActive = [];
          // if (err.code == '16665') {
          //     let passProduct = JSON.parse(err.message)
          //     passProduct.map(item => {
          //         self.data.goodsList.map(arr => {
          //           let flag = passProductActive.some(passProduct => {
          //             return passProduct.productId === arr.productId || passProduct.productId === item.productId
          //           })
          //             if (!flag && arr.productId == item.productId) {
          //                 passProductActive.push({
          //                     ...item,
          //                     ...arr,

          //                 })
          //                 console.log(passProductActive, 'passProductActive');
          //                 self.setData({
          //                     passProductActive,
          //                     canBuy: true,
          //                     titleActive: self.data.cardNo?'抱歉，此次订单中的以下商品已不能使用余额支付，请切换微信支付':'抱歉，此次订单中的以下商品已不能购买'
          //                 })
          //             }

          //         })
          //     })

          //     self.toggle('pass');

          // } else {
          //     self.showCreateOrderError(err)
          // }
        });
      }
    }
  } else {
    uni.showToast({
      title: '收货地址不能为空~',
      icon: 'none',
      duration: 2000
    });
  }
}
function showCreateOrderError (err) {
  const self = this;
  if (err.code === 14009) {
    // 门店已经暂停线上下单
    uni.showModal({
      title: '提示',
      content: '当前门店不在营业中，帮您切换到其他门店',
      success (res) {
        if (res.confirm) {
          getAllStore();
        } else if (res.cancel) { }
      }
    });
  } else if (err.code === 16001) {
    uni.showToast({
      title: '商品暂未上架，请到别的门店看看吧！',
      icon: 'none',
      duration: 2000
    });
  } else {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  }
  state.canBuy = true;
}
function handlePayment (order) {
  console.log(order, "订单id");
  // wx.hideLoading()
  // this.setData({
  //   customLoading: false
  // })
  const that = this;
  state.order = order;
}
function toPayMethod (orderId, type) {
  uni.redirectTo({
    url: '../../pay/payMethod/payMethod?orderId=' + orderId + '&from=shopCart&type=' + type
  });
}
function getAllStore () {
  const self = this;
  storeService.queryList().then(res => {
    let allStores = [];
    res.forEach(item => {
      if (item.status === 'OPEN') {
        allStores.push(item);
      }
    });
    try {
      uni.setStorageSync('wj_allStores', allStores);
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          let latitude = res.latitude;
          let longitude = res.longitude;
          let tempIndex = getNearestStore(allStores, latitude, longitude);
          app.globalData.storeInfo = allStores[tempIndex];
          state.storeName = app.globalData.storeInfo.name;
          state.storeId = app.globalData.storeInfo.id;
          state.storeInfo = app.globalData.storeInfo;
        },
        fail: function (res) {
          console.log(res);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
}
function getNearestStore (allStores, latitude, longitude) {
  let distanceArr = [];
  allStores.forEach(item => {
    let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
    distanceArr.push(dis);
  });
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr);
  let tempIndex = 0;
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i;
      break;
    }
  }
  state.store = allStores[tempIndex].name;
  state.storeId = allStores[tempIndex].id;
  return tempIndex;
}
function clearCacheData (res) {
  // 注释清除分享人信息代码 门店销售数据详情统计需求要求下单不再清除分享人信息 http://jira.wmdigit.com/browse/NR-3409
  // try {
  //   wx.removeStorageSync('wj_sharingId')
  // } catch (e) {}
  // util.removeSharingPersonInfo()
  if (!state.invoice) {
    console.log('没有开票');
  } else {
    const insert = {
      bankAccount: state.invoice.bankAccount ? state.invoice.bankAccount : '',
      bankName: state.invoice.bankName ? state.invoice.bankName : '',
      companyAddress: state.invoice.companyAddress ? state.invoice.companyAddress : '',
      taxNumber: state.invoice.taxNumber ? state.invoice.taxNumber : '',
      telephone: state.invoice.telephone ? state.invoice.telephone : '',
      title: state.invoice.title ? state.invoice.title : '',
      type: state.invoice.type === "1" ? 'PERSONAL' : 'ENTERPRISE',
      total: res.cashTotal,
      memberId: res.memberId,
      orderId: res.id
    };
    console.log(insert, "开票成功");
    invoiceService.create(insert).then(res => {
      console.log("开票成功");
    }).catch(err => {
      // wx.hideLoading()
      state.customLoading = false;
      util.showToast(err.message);
    });
  }
}
async function calcDistance (chooseAddress, idx = 0) {
  // wx.showLoading();
  state.customLoading = true;
  const self = this;
  if (state.goodTypeList[idx].orderType === "packaging" && state.goodTypeList[idx].freeShipping) {
    // 处理打包一口价订单逻辑，暂时不算运费
    state.goodTypeList[idx].calculatedDeliveryFee = true;
    _calculatedDeliveryFee2 = state.goodTypeList.some(goodType => {
      return goodType.shipmentTypes != 'SELF' && !goodType.calculatedDeliveryFee;
    }) == false;
    // wx.hideLoading()
    state.goodTypeList = state.goodTypeList;
    state.calculatedDeliveryFee = self.calculatedDeliveryFee;
    state.btnDisabled = false;
    state.customLoading = false;
    return;
  }
  let _calculatedDeliveryFee2 = false;
  calculatedDeliveryFee = false;
  const type = state.goodTypeList[idx].type;
  state.goodTypeList = state.goodTypeList;
  let shipmentType = type === 'dispatch' ? "EXPRESS" : '';
  if (type === 'dispatch') {
    shipmentType = "EXPRESS";
  } else if (type === 'logistical') {
    shipmentType = "LOGISTICAL";
  }

  // 获得用户的骑行距离
  // var cyclingDistance = util.calculateDistance(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
  if (shipmentType == 'EXPRESS' && state.goodTypeList[idx].type !== 'logistical') {
    let dis = await util.distance(chooseAddress.latitude, chooseAddress.longitude, state.goodTypeList[idx].storeInfo.latitude, state.goodTypeList[idx].storeInfo.longitude);
    if (state.deliveryExpressMaxRice && dis > state.deliveryExpressMaxRice) {
      uni.showToast({
        title: '该地址超出配送范围，请重新修改收货地址~',
        icon: 'none',
        duration: 3500
      });
      state.goodTypeList[idx].calculatedDeliveryFee = false;
      state.goodTypeList[idx].isShowAddressTips = false;
      state.goodTypeList[idx].cycleFee = 0;
      state.goodTypeList[idx].shipmentAmount = 0;
      state.goodTypeList[idx].shipmentRealPay = 0;
      state.canBuy = false;
      state.goodTypeList = state.goodTypeList;
      state.isShowAddressTips = false;
      state.calculatedDeliveryFee = false;
      state.cycleFee = 0;
      state.customLoading = false;
      calculatedDeliveryFee = false;
      // wx.hideLoading()
      return false;
    }
    let cyclingDistance = util.getTripDist(chooseAddress.longitude, chooseAddress.latitude, state.goodTypeList[idx].storeInfo.longitude, state.goodTypeList[idx].storeInfo.latitude, self);
    // 如果是天地图或者高德则不采用腾讯计算距离
    // if(self.data.deliveryDistanceThirdMap === 'TIANDITU' || self.data.deliveryDistanceThirdMap === 'GAODE') {
    //     // const [origLat, origLng] = util.gcj02ToWgs84Exact(chooseAddress.latitude, chooseAddress.longitude);
    //     // const [destLat, destLng] = util.gcj02ToWgs84Exact(self.data.storeInfo.latitude, self.data.storeInfo.longitude);
    //     // console.log(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude,origLat, origLng, destLat, destLng,'aaaa');
    //     // 原逻辑注释
    //     // let change1 = await distributionService.gcj02TOwgs84(chooseAddress.longitude,chooseAddress.latitude)
    //     // let change2 = await distributionService.gcj02TOwgs84(self.data.storeInfo.longitude,self.data.storeInfo.latitude)
    //     // var cyclingDistance = util.TiandituCalculateDistanceBicycling(change1.latitude, change1.longitude, change2.latitude, change2.longitude)
    // }else {
    //     // 实例化API核心类
    //     await ADDRESS.getTenXunKey()
    //     console.log(app.globalData.systemConfigure.lbsTencentMiniappKey,'app.globalData.systemConfigure.lbsTencentMiniappKey')
    //     qqmapsdk = new QQMapWX({
    //         //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
    //         key: app.globalData.systemConfigure.lbsTencentMiniappKey
    //     });
    //     var cyclingDistance = util.calculateDistanceBicycling(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
    // }

    cyclingDistance.then(res => {
      // (self.data.deliveryDistanceThirdMap === 'TIANDITU' || self.data.deliveryDistanceThirdMap === 'GAODE') && 
      if (res.data && res.data.result || res.distance || res.distance == 0) {
        let distance = null;
        if (state.deliveryDistanceThirdMap === 'TIANDITU' || state.deliveryDistanceThirdMap === 'GAODE') {
          distance = res.distance * 1000;
        } else {
          distance = res.data.result.routes["0"].distance.toFixed(2);
        }
        if (state.goodTypeList[idx]) {
          state.goodTypeList[idx].distributionDistance = distance;
          state.goodTypeList[idx].isShowAddressTips = true;
        }
        state.distance = distance;
        state.isShowAddressTips = true;
        return distance;
      } else {
        uni.showToast({
          title: '该地址超出配送范围，请重新修改收货地址~',
          icon: 'none',
          duration: 3500
        });
        if (state.goodTypeList[idx]) {
          state.goodTypeList[idx].calculatedDeliveryFee = false;
          state.goodTypeList[idx].distributionDistance = null;
          state.goodTypeList[idx].isShowAddressTips = false;
          state.goodTypeList[idx].cycleFee = 0;
          state.goodTypeList[idx].shipmentAmount = 0;
          state.goodTypeList[idx].shipmentRealPay = 0;
        }
        // self.calculatedDeliveryFee = false
        state.canBuy = false;
        state.goodTypeList = state.goodTypeList;
        state.isShowAddressTips = false;
        state.calculatedDeliveryFee = false;
        state.cycleFee = 0;
        state.customLoading = false;
        calculatedDeliveryFee = false;
        // wx.hideLoading()
        return false;
      }
    }).then(distance => {
      // self.setData({
      //   distance: distance
      // })
      if (distance || distance === 0) {
        getFee(shipmentType, distance, chooseAddress, _calculatedDeliveryFee2, type, idx);
      } else {
        // wx.hideLoading()
        uni.showToast({
          title: '该地址超出配送范围，请重新修改收货地址~',
          icon: 'none',
          duration: 3500
        });
        state.goodTypeList[idx].calculatedDeliveryFee = false;
        state.goodTypeList[idx].isShowAddressTips = false;
        state.goodTypeList[idx].cycleFee = 0;
        state.goodTypeList[idx].shipmentAmount = 0;
        state.goodTypeList[idx].shipmentRealPay = 0;
        calculatedDeliveryFee = false;
        state.canBuy = false;
        state.goodTypeList = state.goodTypeList;
        state.isShowAddressTips = false;
        state.calculatedDeliveryFee = false;
        state.cycleFee = 0;
        state.customLoading = false;
      }
    }).catch(err => {
      // console.log(err)
      // util.showToast(err.message)
      // self.setData({
      //   canBuy: false
      // })
      // self.getFee(shipmentType, null, chooseAddress, calculatedDeliveryFee, type);
      // wx.hideLoading()
      state.customLoading = false;
    });
  } else {
    // wx.hideLoading()
    state.customLoading = false;
    if (shipmentType == 'EXPRESS' || shipmentType == "LOGISTICAL") {
      getFee(shipmentType, null, chooseAddress, _calculatedDeliveryFee2, type, idx);
    }
  }
}
function getFee (shipmentType, distance, chooseAddress, calculatedDeliveryFee, type, idx = 0) {
  console.log(shipmentType, distance, chooseAddress);
  let self = this;
  if (!state.goodTypeList[idx].goodsList || state.goodTypeList[idx].goodsList.length == 0) return false;
  let products = [];
  state.goodTypeList[idx].goodsList.forEach(item => {
    let tempItem;
    if (!state.goodTypeList[idx].packagingId) {
      tempItem = {
        productId: item.productId,
        productNum: item.productNum,
        calcFeeSource: item.grabActivityId ? 'GRAB_ACTIVITY' : 'GENERAL_ORDER',
        activityId: item.grabActivityId ? item.grabActivityId : '',
        price: state.goodTypeList[idx].orderType !== 'CYCLE' ? item.sellPrice : state.goodTypeList[idx].allPrice
      };
    } else {
      tempItem = {
        productId: item.productId,
        productNum: item.productNum,
        price: state.goodTypeList[idx].orderType !== 'CYCLE' ? item.sellPrice : state.goodTypeList[idx].allPrice
      };
    }
    products.push(tempItem);
  });
  let address = chooseAddress.province + chooseAddress.city + chooseAddress.county + chooseAddress.detailedAddress + chooseAddress.houseNum;
  let postData = {
    address: address,
    distance: Number(distance),
    latitude: chooseAddress.latitude,
    longitude: chooseAddress.longitude,
    positionSource: 1,
    storeId: state.goodTypeList[idx].storeId,
    shipmentType: shipmentType,
    products: products
  };
  distributionService.check(postData).then(res => {
    let storeId = state.goodTypeList[idx].storeId;
    if (res) {
      let postData = {
        province: chooseAddress.province,
        city: chooseAddress.city,
        allPrice: state.goodTypeList[idx].allPrice,
        distance: parseInt(distance),
        products: products,
        storeId: state.goodTypeList[idx].goodsList && state.goodTypeList[idx].goodsList[0] && state.goodTypeList[idx].goodsList[0].business === 'DISTRIBUTION' && state.goodTypeList[idx].orderType === 'CYCLE' ? state.goodTypeList[idx].id : storeId,
        shipmentType: shipmentType,
        calcFeeSource: state.goodTypeList[idx].activeType,
        activityId: state.goodTypeList[idx].packagingId,
        // 添加收货地址经纬度 （收货地址-门店距离）
        // distance: parseInt(distance),
        longitude: chooseAddress.longitude,
        latitude: chooseAddress.latitude
      };
      distributionService.calcFeeV1(postData).then(res => {
        // 统配和外送还有快递都是根据门店配送规则计算运费
        if (res || res.fee === 0) {
          if (state.goodTypeList[idx].type === 'dispatch') {
            state.goodTypeList[idx].distributionDistance = parseInt(distance || 0);
          }
          console.log(state.goodTypeList[idx], '当前计算配送费类型', res);
          if (state.goodTypeList[idx].type === 'dispatch' && state.nearbestStoreCalc && state.goodTypeList[idx].orderType == 'normal') {
            getBestStore(chooseAddress.latitude, chooseAddress.longitude, idx);
          } else {
            state.goodTypeList[idx].optimalStore.show = false;
            state.goodTypeList = state.goodTypeList;
          }
          // 配送费规则
          //   let distributionFeeRule = null
          //   if (type === 'dispatch') {
          //       distributionFeeRule = self.distributionFee
          //   } else if (type === 'logistical') {
          //       distributionFeeRule = self.logisticalFee
          //   }
          //   if (!distributionFeeRule) {
          //       // 还未获取到配送规则
          //       self.setData({
          //           canBuy: false
          //       })
          //       return;
          //   }
          if (state.tips === '') {
            state.canBuy = true;
          } else if (shipmentType === 'LOGISTICAL') {
            state.canBuy = true;
          } else {
            if (state.goodTypeList[idx].daysOfSelfTimeDelay > 0 || state.goodTypeList[idx].orderType === 'group' && state.goodTypeList[idx].teamBuyInfo.selfAfterDay != null && state.goodTypeList[idx].teamBuyInfo.selfAfterDay > 0 || state.goodTypeList[idx].orderType === 'solitaire' && state.goodTypeList[idx].solitaireInfo.selfAfterDay != null && state.goodTypeList[idx].solitaireInfo.selfAfterDay > 0) {
              showNotify(state.tips);
            }
          }
          if (!state.canBuy) {
            return;
          }
          let shipmentRealPay = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2));
          let shipmentDiscount = parseFloat(res.deductibleFee.toFixed(2));
          if (state.goodTypeList[idx].type === 'dispatch' || state.goodTypeList[idx].type === 'logistical') {
            state.goodTypeList[idx].shipmentRealPay = parseFloat(parseFloat(shipmentRealPay).toFixed(2));
            state.goodTypeList[idx].shipmentAmount = parseFloat((Number(res.fee) - res.deductibleFee).toFixed(2));
            state.goodTypeList[idx].shipmentDiscount = shipmentDiscount;
            let shipmentAmount1 = 0;
            let shipmentRealPay1 = 0;
            let shipmentDiscount1 = 0;
            state.goodTypeList.forEach(item1 => {
              shipmentAmount1 += parseFloat(item1.shipmentAmount || 0);
              shipmentRealPay1 += parseFloat(item1.shipmentRealPay || 0);
              shipmentDiscount1 += parseFloat(item1.shipmentDiscount || 0);
            });
            state.goodTypeList = state.goodTypeList;
            state.shipmentDiscount = shipmentDiscount1;
            state.shipmentAmount = shipmentAmount1;
            state.shipmentRealPay = shipmentRealPay1;
            state.cycleFee = parseFloat(parseFloat(state.goodTypeList[idx].shipmentAmount * state.goodTypeList[idx].cyclePhaseTotal).toFixed(2));
            if (state.goodTypeList[idx].orderType === 'CYCLE') {
              state.goodTypeList[idx].shipmentRealPay = state.cycleFee;
              state.goodTypeList[idx].shipmentAmount = state.cycleFee;
              state.goodTypeList[idx].cycleFee = state.cycleFee;
              state.goodTypeList = state.goodTypeList;
            }
          }
          state.goodTypeList[idx].calculatedDeliveryFee = true;
          calculatedDeliveryFee = state.goodTypeList.some(goodType => {
            return !goodType.calculatedDeliveryFee;
          }) == false;
          calculatedDeliveryFee = true;
          state.goodTypeList = state.goodTypeList;
          state.calculatedDeliveryFee = self.calculatedDeliveryFee;
          // wx.hideLoading({
          //     success: function () {
          //         self.setData({
          //             btnDisabled: false
          //         })
          //     }
          // })
          state.customLoading = false;
          state.btnDisabled = false;
        } else {
          state.canBuy = false;
          state.btnDisabled = false;
          state.customLoading = false;
          state.goodTypeList[idx].calculatedDeliveryFee = false;
          calculatedDeliveryFee = false;
          // wx.hideLoading({
          //     success: function () {
          //         console.log('进入了弹层隐藏')
          //         self.setData({
          //             btnDisabled: false
          //         })
          //     }
          // })
        }
        state.goodTypeList[idx].isShowAddressTips = true;
        state.goodTypeList = state.goodTypeList;
        state.isShowAddressTips = true;
        calculatedDeliveryFee = calculatedDeliveryFee;
        // 计算配送状态下可用券
        getAvailableCouponNum(idx);
      }).catch(err => {
        // wx.hideLoading()
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
        state.shipmentAmount = 0;
        state.customLoading = false;
        state.goodTypeList[idx].calculatedDeliveryFee = false;
        // self.data.goodTypeList[idx].shipmentAmount = 0
        state.goodTypeList[idx].shipmentAmount = parseFloat(parseFloat(state.goodTypeList[idx].shipmentAmount * state.goodTypeList[idx].cyclePhaseTotal).toFixed(2));
        state.goodTypeList[idx].cycleFee = parseFloat(parseFloat(state.goodTypeList[idx].shipmentAmount * state.goodTypeList[idx].cyclePhaseTotal).toFixed(2));
        state.btnDisabled = false;
        state.canBuy = false;
        state.goodTypeList = state.goodTypeList;
        state.calculatedDeliveryFee = calculatedDeliveryFee;
        state.cycleFee = parseFloat(parseFloat(state.goodTypeList[idx].shipmentAmount * state.goodTypeList[idx].cyclePhaseTotal).toFixed(2));
        calculatedDeliveryFee = calculatedDeliveryFee;
      });
    } else {
      // wx.hideLoading()
      state.customLoading = false;
      if (state.goodTypeList[idx].orderType !== 'distribution' && state.goodTypeList[idx].type == 'dispatch') {
        uni.showToast({
          title: '该地址超出配送范围，请重新修改收货地址~',
          icon: 'none',
          duration: 3500
        });
        calculatedDeliveryFee = false;
        state.goodTypeList[idx].isShowAddressTips = false;
        state.goodTypeList[idx].cycleFee = 0;
        state.goodTypeList[idx].shipmentAmount = 0;
        state.goodTypeList[idx].shipmentRealPay = 0;
        state.canBuy = false;
        state.calculatedDeliveryFee = false;
        state.isShowAddressTips = false;
        state.cycleFee = 0;
      } else {
        // 计算配送状态下可用券（统配）
        getAvailableCouponNum(idx);
        state.goodTypeList[idx].isShowAddressTips = false;
        state.goodTypeList[idx].cycleFee = 0;
        state.goodTypeList[idx].shipmentAmount = 0;
        state.goodTypeList[idx].shipmentRealPay = 0;
        state.canBuy = true;
        state.isShowAddressTips = false;
        state.cycleFee = 0;
      }
      state.goodTypeList[idx].calculatedDeliveryFee = calculatedDeliveryFee;
      state.btnDisabled = false;
      state.goodTypeList = state.goodTypeList;
      state.calculatedDeliveryFee = calculatedDeliveryFee;
      calculatedDeliveryFee = calculatedDeliveryFee;
    }
  }).catch(err => {
    // wx.hideLoading()
    state.customLoading = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    state.goodTypeList[idx].calculatedDeliveryFee = calculatedDeliveryFee;
    state.btnDisabled = false;
    state.goodTypeList = state.goodTypeList;
    state.calculatedDeliveryFee = calculatedDeliveryFee;
    calculatedDeliveryFee = calculatedDeliveryFee;
    if (state.goodTypeList[idx].orderType !== 'distribution') {
      state.canBuy = false;
    } else {
      // 计算配送状态下可用券（统配）
      getAvailableCouponNum(idx);
      state.canBuy = true;
    }
  });
}
function toChoiceCoupon (val) {
  const that = this;
  let canUseCoupon = true;
  let idx = val.currentTarget && (val.currentTarget.dataset.idx || val.currentTarget.dataset.idx == 0) ? val.currentTarget.dataset.idx : 0;
  let type = val.currentTarget.dataset.type;
  state.editActiveIdx = idx;
  uni.setStorageSync('editActiveIdx', idx);
  // if(type == 'freeship') {
  // } else {
  //   // 如果是优惠券则移除之前操作的index
  //   wx.removeStorageSync('editActiveIdx')
  // }
  const teamOrderCanUseCoupon = state.systemOptions.teamOrderCanUseCoupon;
  canUseCoupon = state.goodTypeList.some(item => {
    return item.orderType !== 'group' || item.orderType === 'group' && teamOrderCanUseCoupon;
  });
  if (!canUseCoupon) {
    uni.showToast({
      title: '活动不可用券~',
      icon: 'none',
      duration: 2000
    });
  }
  // if (that.data.goodTypeList[idx].orderType !== 'group') {
  //     canUseCoupon = true
  // } else {
  //     if (that.data.goodTypeList[idx].orderType === 'group' && teamOrderCanUseCoupon) {
  //         canUseCoupon = true
  //     } else {
  //         canUseCoupon = false
  //         wx.showToast({
  //             title: '活动不可用券~',
  //             icon: 'none',
  //             duration: 2000
  //         })
  //     }
  // }
  let tempShipAmount = state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount;
  let paymentPrice = state.allPrice - state.totalDiscount + parseFloat(tempShipAmount) - parseFloat(state.shipmentCouponDiscount) - state.scoreDiscount;
  if (paymentPrice >= 0) {
    paymentPrice = parseFloat(paymentPrice).toFixed(2);
  } else {
    paymentPrice = 0;
  }
  paymentPrice = parseFloat(paymentPrice);
  if (canUseCoupon) {
    // 获取配置项展示券试算 还是原本的逻辑
    // GM|勾芒 原本的逻辑 /pages/mallModule/coupon/choiceCoupon/choiceCoupon
    // HDCRM|海鼎券 /pages/mallModule/coupon/choiceCouponMore/choiceCouponMore
    systemService.query('createCouponTemplate').then(res => {
      if (res && res.length > 0 && res[0].value) {
        handleChoiceCoupon(res[0].value);
        // handleChoiceCoupon('GM')   
      }
    });
  }
  function handleChoiceCoupon (setOption) {
    app.globalData.couponOrderData = getPostData();
    if (type == 'freeship' && app.globalData.couponOrderData.shipmentGroups && app.globalData.couponOrderData.shipmentGroups.length > 0) {
      app.globalData.couponOrderData = {
        ...app.globalData.couponOrderData.shipmentGroups[idx]
      };
    }
    let orderData = JSON.stringify(app.globalData.couponOrderData);
    uni.setStorageSync('notSelectedCoupons', []);
    console.log(state.usedCoupons, 'couponIds');
    if (state.usedCoupons && state.usedCoupons.length > 0) {
      if (val.currentTarget.dataset.type == 'freeship') {
        let freeshipIds = [];
        let notFreeshipIds = [];
        state.goodTypeList.forEach((item, index) => {
          if (item.freeshipList && item.freeshipList.length > 0) {
            item.freeshipList.forEach(freeshipObj => {
              if (index == idx) {
                freeshipIds.push(freeshipObj.couponId);
              } else {
                notFreeshipIds.push(freeshipObj.couponId);
              }
            });
          }
        });
        uni.setStorageSync('selectedCoupons', freeshipIds);
        uni.setStorageSync('notSelectedCoupons', notFreeshipIds);
      } else {
        let couponIds = [];
        let notCouponIds = [];
        state.goodTypeList.forEach((item, index) => {
          if (item.couponList && item.couponList.length > 0) {
            item.couponList.forEach(couponObj => {
              if (index == idx) {
                couponIds.push(couponObj.couponId);
              } else {
                notCouponIds.push(couponObj.couponId);
              }
            });
          }
        });
        uni.setStorageSync('selectedCoupons', couponIds);
        uni.setStorageSync('notSelectedCoupons', notCouponIds);
        // wx.setStorageSync('selectedCoupons', that.data.usedCoupons.map(itemCoupon => itemCoupon.couponId))
      }
    } else {
      uni.setStorageSync('selectedCoupons', []);
    }
    if (state.useScore && !state.systemOptions.isBothScoreAndCoupon) {
      uni.showModal({
        title: '提示',
        content: '积分和优惠券不可同时使用',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // orderData = JSON.stringify(that.getPostData());
            // orderData=' + orderData + '&
            state.integral = 0;
            state.scoreDiscount = 0;
            state.useScore = false;
            let opts = '?type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
            // 'freeship' 运费券不进行券试算
            if (setOption === 'GM' || val.currentTarget.dataset.type === 'freeship') {
              opts = '?type=' + state.goodTypeList[idx].type + '&orderType=' + state.goodTypeList[idx].orderType + '&couponType=' + val.currentTarget.dataset.type;
              NAVPAGE.toChoiceCoupon(opts);
            } else {
              NAVPAGE.toChoiceCouponMore(opts);
            }
            // if (paymentPrice > 0) {
            // } else {
            //   wx.showToast({
            //     title: '商品实付金额已为0',
            //     icon: 'none',
            //     duration: 2000
            //   })
            // }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } else {
      if (val.currentTarget.dataset.type === 'freeship') {
        // that.data.goodTypeList[idx].shipmentCouponDiscount >= 0
        // orderData=' + orderData + '&
        if (state.goodTypeList[idx].shipmentAmount > 0 && state.goodTypeList[idx].shipmentCouponDiscount >= 0) {
          let opts = '?type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
          if (setOption === 'GM' || val.currentTarget.dataset.type === 'freeship') {
            opts = '?type=' + state.goodTypeList[idx].type + '&orderType=' + state.goodTypeList[idx].orderType + '&couponType=' + val.currentTarget.dataset.type;
            NAVPAGE.toChoiceCoupon(opts);
          } else {
            NAVPAGE.toChoiceCouponMore(opts);
          }
          // if (paymentPrice > 0) {
          // } else {
          //   wx.showToast({
          //     title: '商品实付金额已为0',
          //     icon: 'none',
          //     duration: 2000
          //   })
          // }
        } else {
          uni.showToast({
            title: '商品已包邮',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        let opts = '?type=' + state.type + '&orderType=' + state.orderType + '&couponType=' + val.currentTarget.dataset.type;
        if (setOption === 'GM' || val.currentTarget.dataset.type === 'freeship') {
          opts = '?type=' + state.goodTypeList[idx].type + '&orderType=' + state.goodTypeList[idx].orderType + '&couponType=' + val.currentTarget.dataset.type;
          NAVPAGE.toChoiceCoupon(opts);
        } else {
          NAVPAGE.toChoiceCouponMore(opts);
        }
        // if (paymentPrice > 0) {
        // } else {
        //   wx.showToast({
        //     title: '商品实付金额已为0',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      }
    }
  }
}
function toPaymentSuccess (orderId) {
  let opts = '?orderId=' + orderId + '&orderType=' + (state.multipleOrdersFlag ? 'MIXED' : state.orderType);
  NAVPAGE.toPaymentSuccess(opts);
}
function handleSelectStoredValueCard () {
  let allPrice = 0;
  if (state.orderType === 'CYCLE') {
    allPrice = parseFloat(state.allPrice - state.totalDiscount + state.cycleFee - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount).toFixed(2);
  } else {
    allPrice = parseFloat(state.allPrice - state.totalDiscount + state.shipmentAmount - state.shipmentCouponDiscount - state.scoreDiscount - state.giftCardDiscount).toFixed(2);
  }
  if (state.storedValueCard.balance < allPrice && !app.globalData.multiplePayment) {
    uni.showToast({
      title: '储值余额不足',
      icon: 'none',
      duration: 2000
    });
    state.useStoredValueCard = false;
    state.cardDeductTotal = 0;
    state.payMethod.useStoredValueCard = false;
    state.payMethod.cardDeductTotal = 0;
    return false;
  }
  const that = this;
  const useStoredValueCard = !state.useStoredValueCard;
  // 重算积分、优惠券和礼品卡
  state.orderGiftCard = [];
  state.giftCardDiscount = 0;
  state.useStoredValueCard = useStoredValueCard;
  state.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0;
  state.payMethod.useStoredValueCard = useStoredValueCard;
  state.payMethod.cardDeductTotal = useStoredValueCard ? state.storedValueCard.useAmount : 0;
}
function handleSelectMspCard () {
  const that = this;
  const useStoredMspCard = !state.useStoredMspCard;
  // if(useStoredMspCard) { 支付改动注释
  //     let allPrice = this.data.allPrice - this.data.totalDiscount + this.data.shipmentAmount - this.data.shipmentCouponDiscount  - this.data.scoreDiscount - this.data.giftCardDiscount;
  //     if(this.data.accountDetail && this.data.accountDetail.balance && allPrice > this.data.accountDetail.balance) {
  //         this.setData({
  //             useStoredMspCard: useStoredMspCard,
  //             "payMethod.useStoredValueCard": false,
  //             useWxValue: true
  //         })
  //     } else {
  //         that.setData({
  //             useStoredMspCard: useStoredMspCard,
  //             "payMethod.useStoredValueCard": false,
  //             useWxValue: false
  //         })
  //     }
  // } else {
  //     that.setData({
  //         useStoredMspCard: useStoredMspCard,
  //         "payMethod.useStoredValueCard": false,

  //     })
  // }
  // 重算积分、优惠券和礼品卡
  state.useStoredMspCard = useStoredMspCard;
  state.payMethod.useStoredValueCard = false;
}
function handleCardPassword (e) {
  const that = this;
  state.storedValueCard = {
    ...state.storedValueCard,
    password: e.detail.value //储值卡密码
  };
}
function handleResetPassword () {
  NAVPAGE.toResetPassword();
}
function getMbrBalance () {
  const that = this;
  memberService.getMbrBalance().then(res => {
    // 储值卡余额大于0时才会使用
    if (res > 0 && state.isStoredPayment) {
      state.storedValueCard = {
        ...state.storedValueCard,
        balance: res //储值卡余额
      };
      state.payMethod.balance = res;
      if (state.orderType === 'secondkill' && state.scource === 'BUYNOW') {
        // 秒杀立即购买计算储值
        handleCardBalance();
      }
    } else {
      state.storedValueCard = {
        useAmount: 0,
        //本次使用额度
        balance: 0,
        //储值卡余额
        password: '' //储值卡密码密码
      };
      state.cardDeductTotal = 0;
      state.useStoredValueCard = false;
    }
    if (state.orderType === 'advanceSell' || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'solitaire' || state.orderType === "packaging") {
      handleCardBalance();
    }
  });
}
function handleCardBalance () {
  const that = this;
  const allPrice = Number(state.allPrice); // 订单金额
  const totalDiscount = Number(state.totalDiscount); // 现金抵扣金额
  // 运费抵扣
  let shipmentAmount1 = state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount;
  let shipmentRealPay = parseFloat((Number(shipmentAmount1) - Number(state.shipmentCouponDiscount)).toFixed(2));
  shipmentRealPay = shipmentRealPay > 0 ? shipmentRealPay : 0;
  // 积分抵扣
  const scoreDeductionAmount = state.useScore ? Number(state.scoreDiscount) : 0;
  // 可使用的礼品卡信息
  const orderGiftCard = state.orderGiftCard;
  const canUseAmount = Number(state.storedValueCard.balance); // 可以使用的储值金额
  // 总价减去抵扣（现金、券和积分优惠）和运费抵扣剩下的金额
  const paymentTotal = parseFloat((allPrice + shipmentRealPay - totalDiscount).toFixed(2));
  // 计算礼品卡抵扣的金额（旧版）
  // let giftCardDiscount = 0;
  // if (paymentTotal > Number(orderGiftCard.maxUseTotal)) {
  //     giftCardDiscount = Number(orderGiftCard.maxUseTotal) > 0 ? parseFloat(Number(orderGiftCard.maxUseTotal).toFixed(2)) : 0
  // } else {
  //     giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0
  // }

  // 礼品卡优化 ---- 更新计算礼品卡抵用金额
  let giftCardDiscount = 0;
  let totalUseGiftBalance = 0;
  state.orderGiftCard.forEach(item => {
    totalUseGiftBalance += item.balance;
  });
  if (paymentTotal > totalUseGiftBalance) {
    giftCardDiscount = Number(totalUseGiftBalance) > 0 ? parseFloat(Number(totalUseGiftBalance).toFixed(2)) : 0;
  } else {
    giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0;
  }
  state.giftCardDiscount = state.isGiftPayment ? giftCardDiscount : 0;
  let tempPrice = parseFloat((allPrice - totalDiscount - scoreDeductionAmount - giftCardDiscount + shipmentRealPay).toFixed(2));
  const useStoredValueCard = canUseAmount > 0 ? true : false;
  if (tempPrice > 0 && state.isStoredPayment) {
    if (tempPrice > canUseAmount) {
      if (app.globalData.multiplePayment) {
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: canUseAmount //本次使用余额
        };
        state.cardDeductTotal = canUseAmount;
        state.useStoredValueCard = useStoredValueCard;
        state.payMethod.useStoredValueCard = useStoredValueCard;
        state.payMethod.cardDeductTotal = canUseAmount;
      } else {
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: 0 //本次使用余额
        };
        state.cardDeductTotal = 0;
        state.useStoredValueCard = false;
        state.payMethod.useStoredValueCard = false;
        state.payMethod.cardDeductTotal = 0;
      }
    } else {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: tempPrice //本次使用余额
      };
      state.cardDeductTotal = tempPrice;
      state.useStoredValueCard = useStoredValueCard;
      state.payMethod.useStoredValueCard = useStoredValueCard;
      state.payMethod.cardDeductTotal = tempPrice;
    }
  } else {
    state.storedValueCard = {
      ...state.storedValueCard,
      useAmount: 0 //本次使用余额
    };
    state.cardDeductTotal = 0;
    state.useStoredValueCard = false;
    state.payMethod.useStoredValueCard = false;
    state.payMethod.cardDeductTotal = 0;
  }
}
function changeGoodList (original) {
  let goodsList = [...(state.allGoodList && state.allGoodList.length > 0 ? state.allGoodList : state.goodsList)];
  let orderDetailGood = state.orderDetailGood || {};
  let allPrice = 0;
  console.log('changeGoodList', goodsList, original);
  goodsList.forEach(good => {
    if (orderDetailGood[good.productId]) {
      let item = orderDetailGood[good.productId];
      if (original) {
        good.sellPrice = item.sellPrice;
        good.useMemberPrice = false;
        good.usePromotionPrice = false;
      } else {
        let minPrice = item.sellPrice;
        if (item.promotionPrice && item.promotionPrice < item.sellPrice && (!item.memberPrice || item.promotionPrice < item.memberPrice)) {
          minPrice = item.promotionPrice;
          good.useMemberPrice = false;
          good.usePromotionPrice = true;
        } else if (item.memberPrice && item.memberPrice < item.sellPrice) {
          good.useMemberPrice = true;
          good.usePromotionPrice = false;
          minPrice = item.memberPrice;
        }
        console.log('minPrice', minPrice);
        good.sellPrice = minPrice;
      }
      allPrice += good.sellPrice * item.productNum;
    }
  });
  if (state.allGoodList && state.allGoodList.length > 0) {
    state.allGoodList = goodsList;
    state.goodsList = goodsList;
  } else {
    state.goodsList = goodsList;
  }
  state.allPrice = allPrice ? parseFloat(allPrice.toFixed(2)) : state.allPrice;
}
function getOrderDetail (_goodsList) {
  let newGoodsList = _goodsList || state.allGoodList || goodsList;
  let ids = [];
  let distributionIds = [];
  newGoodsList.forEach(item => {
    if (item.business == 'DISTRIBUTION') {
      distributionIds.push(item.productId);
    } else {
      ids.push(item.productId);
    }
  });
  let queryGoodTypeList = [];
  if (ids && ids.length > 0) {
    queryGoodTypeList[queryGoodTypeList.length] = 'normal';
  }
  if (distributionIds && distributionIds.length > 0) {
    queryGoodTypeList[queryGoodTypeList.length] = 'distribution';
  }
  if (ids && ids.length > 0) {
    queryGoodTypeList.forEach(async queryGoodType => {
      await productService.queryV2({
        page: 1,
        pageSize: ids.length,
        productIdIn: queryGoodType == 'distribution' ? distributionIds : ids,
        searchCount: true,
        storeIdEq: queryGoodType == 'distribution' ? app.globalData.distributionStore.id : app.globalData.storeInfo.id,
        includeChild: true
      }).then(res => {
        if (res && res.length > 0) {
          let orderDetailGood = state.orderDetailGood || {};
          res.forEach(item => {
            if (item.style != 'MEALS2') {
              orderDetailGood[item.id] = {
                sellPrice: item.sellPrice || 0,
                promotionPrice: item.promotionPrice || 0,
                memberPrice: item.memberPrice || 0
              };
            }
          });
          state.orderDetailGood = orderDetailGood;
        } else {
          state.orderDetailGood = state.orderDetailGood;
        }
      });
    });
  }
}
function checkDistributionFeeRule (idx = 0) {
  const self = this;
  // 配送费规则
  const distributionFeeRule = distributionFee;
  console.log(state.canBuy, state.tips);
  if (!distributionFeeRule) {
    // 还未获取到配送规则
    state.canBuy = false;
    return;
  }
  if (state.tips === '') {
    state.canBuy = true;
  } else if (localData.shipmentTypes === 'LOGISTICAL') {
    state.canBuy = true;
  }
  if (state.goodTypeList[idx].type === 'dispatch') {
    // console.log(Number(self.data.allPrice), distributionFeeRule.takeoutFare)
    if (Number(state.goodTypeList[idx].allPrice) >= distributionFeeRule.takeoutFare) {
      state.canBuy = true;
    } else {
      if (state.goodTypeList[idx].orderType !== "advanceSell") {
        distributionFeeRule.takeoutFare = 0;
        let tips = "商品满" + distributionFeeRule.takeoutFare + "元起送";
        state.canBuy = false;
        state.tips = tips;
        showNotify(tips);
      } else if (state.goodTypeList[idx].orderType === "advanceSell" && !state.goodTypeList[idx].isExpress) {
        distributionFeeRule.takeoutFare = 0;
        let tips = "商品满" + distributionFeeRule.takeoutFare + "元起送";
        state.canBuy = false;
        state.tips = tips;
        showNotify(tips);
      }
    }
  }
}
function checkDistribution (idx = 0) {
  const that = this;
  try {
    let value = uni.getStorageSync('wj_chooseAddressInfo');
    if (value) {
      // 缓存中有默认地址
      state.addressInfo = value;
      console.log('2860calcDistance');
      calcDistance(value, idx);
    } else {
      // 缓存中没有默认地址
      if (state.addressInfo == '') {
        // 当前没有选择地址
        addressService.getDefaultAddress().then(res => {
          // console.log('res233',res)
          if (res) {
            // 有默认地址
            state.addressInfo = res;
            uni.setStorage({
              key: "wj_chooseAddressInfo",
              data: res
            });
            // console.log('2867calcDistance')
            calcDistance(res, idx);
          } else {
            // 无默认地址
            uni.getLocation({
              type: 'gcj02',
              success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                // 查询所有地址
                addressService.query().then(result => {
                  // console.log('result233',result)
                  if (result.length > 0) {
                    let allAddress = result;
                    let tempIndex = getNearestAddress(allAddress, latitude, longitude);
                    uni.setStorage({
                      key: "wj_chooseAddressInfo",
                      data: allAddress[tempIndex]
                    });
                    // console.log('2898calcDistance')
                    state.addressInfo = allAddress[tempIndex];
                    calcDistance(allAddress[tempIndex], idx);
                  } else {
                    uni.showToast({
                      title: '请选择收货地址~',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                }).catch(err => {
                  uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000
                  });
                });
              }
            });
          }
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        // 当前选择了地址
        // 查询所有地址
        addressService.query().then(result => {
          // console.log('result',result)
          if (result.length > 0) {
            uni.getLocation({
              type: 'gcj02',
              success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                let allAddress = result;
                let tempIndex = getNearestAddress(allAddress, latitude, longitude);
                // 缓存最近的地址
                uni.setStorage({
                  key: "wj_chooseAddressInfo",
                  data: allAddress[tempIndex]
                });
                // console.log('2945calcDistance')
                state.addressInfo = allAddress[tempIndex];
                calcDistance(allAddress[tempIndex], idx);
              }
            });
          } else {
            state.addressInfo = '';
            uni.showToast({
              title: '请选择收货地址~',
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      }
    }
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    });
  }
}
function getNearestAddress (allAddress, latitude, longitude) {
  let distanceArr = [];
  allAddress.forEach(item => {
    let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
    distanceArr.push(dis);
  });
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr);
  let tempIndex = 0;
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i;
      break;
    }
  }
  return tempIndex;
}
function checkProductsSellTime (idx = 0) {
  const that = this;
  console.info("isDistributionOrder:", state.isDistributionOrder, state.goodTypeList, idx);
  if (state.goodTypeList[idx].isDistributionOrder) {
    return;
  }
  if (state.goodTypeList[idx].orderType === "advanceSell") {
    console.info("预售订单时间不可选择");
    logs.info("预售订单时间不可选择");
    return;
  }
  const productsList = state.goodTypeList[idx].goodsList || [];
  const type = state.goodTypeList[idx].type;
  const storeInfo = state.goodTypeList[idx].storeInfo;
  let tempProducts = [];
  let tempAllProducts = [];
  // 处理商店营业时间
  let arrTime = "07:00-23:59";
  //临时逻辑
  let storeTime = arrTime.split("-");
  // let storeTime = storeInfo.storeHours.split("-")
  let tempStart = storeTime[0] + ':00';
  let tempEnd = storeTime[1] + ':00';
  const now = new util.ResponseDate();
  let hour = now.getHours(); //小时数
  let minute = now.getMinutes(); //分钟数
  let time = [hour, minute].map(util.timeFormat).join(':');
  let date = util.formatTime(now).split(" ")[0];
  let nowTime = new Date(util.formatTime(now)).getTime();
  let tempTime = [[], []];
  const configure = state.systemOptions; //获取订单相关的系统配置
  let orderAppointmentDate = configure.daysOfSelfTimeDelay; //订单预约限定下单后第几天开始
  if (state.goodTypeList[idx].orderType === 'group' && (state.goodTypeList[idx].teamBuyInfo.selfAfterDay != null || state.goodTypeList[idx].teamBuyInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].teamBuyInfo.selfAfterDay;
  } else if (state.goodTypeList[idx].orderType === 'solitaire' && (state.goodTypeList[idx].solitaireInfo.selfAfterDay != null || state.goodTypeList[idx].solitaireInfo.selfAfterDay === 0)) {
    orderAppointmentDate = state.goodTypeList[idx].solitaireInfo.selfAfterDay;
  }
  console.log("checkProductsSellTime 订单推迟几天可以预约：", orderAppointmentDate);
  if (state.goodTypeList[idx].type === "selftake" && orderAppointmentDate > 1) {
    let storeHours = storeTime[0].slice(0, 2);
    hour = Number(storeHours);
    time = storeTime[0];
    let newDate = addDay(now, orderAppointmentDate);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    date = [year, month, day].map(util.timeFormat).join('/');
    let newTime = date + " " + tempStart;
    nowTime = new Date(newTime).getTime();
  }
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  console.log(nowTime, endTimeDetails, endTimeDetails);
  productsList.forEach(item => {
    if (item.startTime && item.endTime) {
      let startTime = item.startTime.split(" ")[1].slice(0, 5) + ':00';
      let endTime = item.endTime.split(" ")[1].slice(0, 5) + ':00';
      let newStartTime = new Date(date + " " + startTime).getTime();
      let newEndTime = new Date(date + " " + endTime).getTime();
      if (nowTime >= startTimeDetails && nowTime <= endTimeDetails && nowTime >= newStartTime && nowTime <= newEndTime) {
        //在商店营业时间和商品售卖时间之内，可以购买
        let tempItem = {
          ...item,
          newStartTime: startTime,
          newEndTime: endTime,
          newStartTimeStamp: newStartTime,
          newEndTimeStamp: newEndTime,
          businessStatus: true
        };
        tempAllProducts.push(tempItem);
      } else {
        let tempItem = {
          ...item,
          newStartTime: startTime,
          newEndTime: endTime,
          newStartTimeStamp: newStartTime,
          newEndTimeStamp: newEndTime,
          businessStatus: false
        };
        tempProducts.push(tempItem);
        tempAllProducts.push(tempItem);
      }
    } else {
      // 商品没有售卖时间默认为门店营业时间
      let tempItem = {
        ...item,
        newStartTime: tempStart,
        newEndTime: tempEnd,
        newStartTimeStamp: startTimeDetails,
        newEndTimeStamp: endTimeDetails,
        businessStatus: true
      };
      tempAllProducts.push(tempItem);
    }
  });
  state.goodTypeList[idx].goodsList = tempAllProducts;
  state.goodTypeList = state.goodTypeList;
  if (nowTime < startTimeDetails || nowTime > endTimeDetails) {
    console.log("商店打烊");
    let tips = '商店已打烊，不支持配送，请选择自提~';
    state.goodTypeList[idx].businessStatus = false;
    state.canBuy = false;
    state.tips = tips;
    state.businessStatus = false;
    state.goodTypeList = state.goodTypeList;
    showNotify(tips);
  } else {
    state.goodTypeList[idx].businessStatus = true;
    state.tips = "";
    state.businessStatus = true;
    state.goodTypeList = state.goodTypeList;
  }
  if (tempProducts.length > 0) {
    let tips = '订单中有商品超出售卖时间~';
    state.goodTypeList[idx].businessStatus = true;
    // wx.hideLoading()
    state.canBuy = false;
    state.tips = tips;
    state.goodTypeList = state.goodTypeList;
    state.businessStatus = true;
    state.customLoading = false;
    showNotify(tips);
  }
  if (tempAllProducts.length > 0) {
    if (tempProducts.length > 0) {
      let tips = '订单中有商品超出售卖时间~';
      state.canBuy = false;
      state.tips = tips;
      showNotify(tips);
    }
    // 根据商品售卖时间重置预约时间
    /**
     * 1、多个找交集
     * 2、没有交集就不可预约
     */
    let tempStartTime = '';
    let tempEndTime = '';
    let tempStartTimeStamp = '';
    let tempEndTimeStamp = '';
    let startTime = '';
    let endTime = '';
    let startTimeStamp = '';
    let endTimeStamp = '';
    let goodsTime = [[], []];
    tempAllProducts.forEach((item, index) => {
      if (index === 0) {
        tempStartTime = item.newStartTime;
        tempEndTime = item.newEndTime;
        tempStartTimeStamp = item.newStartTimeStamp;
        tempEndTimeStamp = item.newEndTimeStamp;
      } else {
        if (tempStartTimeStamp < item.newStartTimeStamp) {
          tempStartTime = item.newStartTime;
          tempStartTimeStamp = item.newStartTimeStamp;
        }
        if (tempEndTimeStamp > item.newEndTimeStamp) {
          tempEndTime = item.newEndTime;
          tempEndTimeStamp = item.newEndTimeStamp;
        }
      }
    });
    if (tempStartTimeStamp < tempEndTimeStamp) {
      // 有交集
      if (startTimeDetails > tempStartTimeStamp) {
        startTime = tempStart;
        startTimeStamp = startTimeDetails;
      } else {
        startTime = tempStartTime;
        startTimeStamp = tempStartTimeStamp;
      }
      if (endTimeDetails > tempEndTimeStamp) {
        endTime = tempEndTime;
        endTimeStamp = tempEndTimeStamp;
      } else {
        endTime = tempEnd;
        endTimeStamp = endTimeDetails;
      }
      if (startTimeStamp < endTimeStamp) {
        let goodsTimeArray = splitTime(date, date, state.systemOptions.orderChooseDateInterval, startTime, endTime);
        //营业时间小时数组
        let hourArray = [];
        goodsTimeArray.forEach(ele => {
          hourArray.push(ele.slice(0, 2));
        });
        for (let j = 0; j < goodsTimeArray.length - 1; j++) {
          const eleStart = goodsTimeArray[j];
          const eleEnd = goodsTimeArray[j + 1];
          let tempData = eleStart + '-' + eleEnd;
          goodsTime[0].push(tempData);
        }
        if (nowTime < startTimeStamp) {
          goodsTime[1] = goodsTime[0];
        } else if (nowTime > endTimeStamp) {
          let tempData = '无法预约自提时间';
          let canBuy = false;
          console.log(tempData);
          goodsTime[1].push(tempData);
          state.canBuy = canBuy;
        } else if (nowTime >= startTimeStamp && nowTime < endTimeStamp) {
          const len = hourArray.length;
          for (let i = 0; i < hourArray.length; i++) {
            if (hour >= hourArray[i] && hour < hourArray[i + 1]) {
              goodsTime[1].push(time + '-' + goodsTimeArray[i + 1]);
              for (let k = i + 1; k < goodsTimeArray.length - 1; k++) {
                const eleStart = goodsTimeArray[k];
                const eleEnd = goodsTimeArray[k + 1];
                let tempData = eleStart + '-' + eleEnd;
                goodsTime[1].push(tempData);
              }
            } else if (hour == hourArray[len - 1]) {
              let now = util.timestampToTime(nowTime);
              let end = util.timestampToTime(endTimeStamp);
              // let start = now.split(" ")[1].slice(0, 5)
              // let endTime = end.split(" ")[1].slice(0, 5)
              let start = now ? now.split(' ')[1].slice(0, 5) : '';
              let endTime = end ? end.split(' ')[1].slice(0, 5) : '';
              let tempData = start + '-' + endTime;
              goodsTime[1].push(tempData);
            }
          }
          console.log(goodsTime);
        } else {
          let tempData = '无法预约自提时间';
          let canBuy = false;
          console.log(tempData);
          goodsTime[1].push(tempData);
          state.canBuy = canBuy;
        }
        console.log("商品售卖时间：", state.goodTypeList[idx].multiArray);
        tempTime[0] = state.goodTypeList[idx].multiArray[0];
        if (state.goodTypeList[idx].multiIndex && state.goodTypeList[idx].multiIndex[0] !== 0) {
          tempTime[1] = goodsTime[0];
        } else {
          tempTime[1] = goodsTime[1];
        }
        console.log(goodsTime);
        state.goodTypeList[idx].chooseTime = goodsTime;
        state.goodTypeList[idx].multiArray = tempTime;
        state.goodTypeList = state.goodTypeList;
        let tips = '';
        if (tempProducts.length > 0 && state.goodTypeList[idx].type === 'dispatch') {
          // 订单中有商品超出售卖时间(配送情况下)
          if (state.goodTypeList[idx].businessStatus) {
            tips = '订单中有商品超出售卖时间~';
          } else if (state.goodTypeList[idx].canSelfmention) {
            tips = '商店已打烊，不支持配送，请选择自提~';
            console.log("tips");
          } else {
            tips = '商店已打烊，不支持配送，看看其他门店吧~';
          }
          showNotify(tips);
          state.canBuy = false;
          state.tips = tips;
        } else if (!state.goodTypeList[idx].canSelfmention && state.goodTypeList[idx].type === 'selftake') {
          // 门店不支持自提且已打烊
          if (state.goodTypeList[idx].businessStatus) {
            tips = "门店不支持自提，请选择配送~";
          } else {
            tips = "门店不支持自提，看看其他门店吧~";
          }
          showNotify(tips);
          state.canBuy = state.goodTypeList[idx].type === 'dispatch' ? true : false;
          state.tips = tips;
        } else if (!state.goodTypeList[idx].businessStatus) {
          // 门店已打烊
          console.log("门店已打烊");
          tips = "商店已打烊，不支持配送，请选择自提~";
          let canBuy = state.goodTypeList[idx].type === 'dispatch' ? false : true;
          if (state.goodTypeList[idx].multiArray[1][0] === '请选择其他时间' || state.goodTypeList[idx].multiArray[1][0] === '不能下单' || state.goodTypeList[idx].multiArray[1][0] === '无法预约自提时间') {
            canBuy = false;
          } else {
            canBuy = state.goodTypeList[idx].type === 'dispatch' ? false : true;
          }
          showNotify(tips);
          state.canBuy = canBuy;
          state.tips = tips;
        } else {
          state.canBuy = true;
          state.tips = tips;
          showNotify(tips);
        }
      } else {
        // 无交集
        if (type === 'selftake') {
          uni.showToast({
            title: '订单内部分商品售卖时间冲突，无法下单~',
            icon: 'none',
            duration: 2000
          });
          goodsTime[0].push('无法预约自提时间');
          goodsTime[1].push('无法预约自提时间');
          console.log(goodsTime);
          tempTime[0] = state.goodTypeList[idx].multiArray[0];
          tempTime[1] = goodsTime[1];
          state.goodTypeList[idx].chooseTime = goodsTime;
          state.goodTypeList[idx].multiArray = tempTime;
          state.goodTypeList = state.goodTypeList;
          state.canBuy = false;
        }
      }
    } else {
      // 无交集
      if (type === 'selftake') {
        uni.showToast({
          title: '订单内部分商品售卖时间冲突，无法下单~',
          icon: 'none',
          duration: 2000
        });
        goodsTime[0].push('无法预约自提时间');
        goodsTime[1].push('无法预约自提时间');
        console.log(goodsTime);
        tempTime[0] = state.goodTypeList[idx].multiArray[0];
        tempTime[1] = goodsTime[1];
        state.goodTypeList[idx].chooseTime = goodsTime;
        state.goodTypeList[idx].multiArray = tempTime;
        state.goodTypeList = state.goodTypeList;
      }
    }
  }
}
function handleGoodsList (idx) {
  console.log("处理商品");
  const self = this;
  const goodsList = state.goodTypeList[idx].goodsList;
  let tempGoodsList = [];
  goodsList.forEach(item => {
    let tempItem = {
      ...item,
      businessStatus: true
    };
    tempGoodsList.push(tempItem);
  });
  state.goodTypeList[idx].goodsList = tempGoodsList;
  state.goodTypeList = state.goodTypeList;
}
function onCancelA () {
  let editActiveIdx = uni.getStorageSync('editActiveIdx');
  let self = this;
  state.canBuy = true;
  state.goodTypeList.forEach((item, idx) => {
    if (item.orderType != 'distribution') {
      let storeInfo = state.goodTypeList[idx].oldStoreInfo || state.goodTypeList[idx].storeInfo;
      state.goodTypeList[idx].storeInfo = storeInfo;
      state.goodTypeList[idx].storeName = storeInfo.name;
      if (item.orderType != 'nextDay') {
        state.goodTypeList[idx].storeId = storeInfo.id;
      }
      app.globalData.storeInfo = {
        ...storeInfo
      };
      if (state.goodTypeList[idx].orderType === 'group' || state.goodTypeList[idx].orderType === 'solitaire') {
        // 根据门店支持的配送方式显示自提和配送
        handleDeliveryType(idx);
        if (!state.goodTypeList[idx].isDistributionOrder) {
          // 判断当前拼团是否统配拼团
          if (!state.goodTypeList[idx].canSelfmention) {
            // 当前门店不支持自提
            // wx.hideLoading()
            state.canBuy = false;
            state.customLoading = false;
            util.setHideLoading(true);
            uni.showToast({
              title: '当前门店不支持自提，看看其他门店吧~',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              util.setHideLoading(false);
            }, 1000);
          } else {
            initializationTime(idx); //初始化预约时间
            if (state.goodTypeList[idx].orderType === 'group') {
              getGoodsBalance(state.goodTypeList[idx].storeInfo.id, idx);
            }
          }
        }
      }
      handleDeliveryType(false, idx);
      checkOrderProducts(idx);
    }
  });
  toggle('pass');
}
function handleScoreChoice () {
  const self = this;
  console.log("是否使用积分：", state.useScore, "使用积分：", state.integral);

  // if( (this.data.scoreAmount-this.data.cashDiscount - this.data.couponDiscount - this.data.shipmentCouponDiscount)<=0 ){
  //     return
  // }
  // 使用了优惠券
  let shipmentRealPay = 0;
  let shipmentCouponDiscount = 0;
  state.goodTypeList.forEach(item => {
    shipmentRealPay += parseFloat(item.orderType === 'CYCLE' ? item.cycleFee : item.shipmentAmount); // 将实付运费重置为运费金额
    shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
  });
  let paymentPrice = parseFloat(state.allPrice) - parseFloat(state.totalDiscount) + parseFloat(state.couponDiscount) + parseFloat(shipmentRealPay) - parseFloat(shipmentCouponDiscount || 0);
  paymentPrice = paymentPrice > 0 ? parseFloat(paymentPrice).toFixed(2) : 0;
  if (state.couponInfo.useCoupon && !state.systemOptions.isBothScoreAndCoupon && state.isPointsRedemption) {
    uni.showModal({
      title: '提示',
      content: '积分和优惠券不可同时使用',
      confirmText: '使用积分',
      success: function (res) {
        if (res.confirm) {
          state.goodTypeList.forEach(item => {
            item.shipmentDiscount = 0;
            item.shipmentCouponDiscount = 0;
            item.couponDiscount = 0;
            item.shipmentRealPay = item.shipmentAmount;
          });
          // 确定使用积分
          state.goodTypeList = state.goodTypeList;
          state.couponDiscount = 0;
          state.usedCoupons = [];
          state.couponInfo = {
            description: '选择优惠券',
            data: {
              freeship: [],
              discount: []
            },
            useCoupon: false
          };
          state.shipmentRealPay = shipmentRealPay;
          state.shipmentDiscount = 0;
          state.shipmentCouponDiscount = 0;
          this.chooseScore();
        } else if (res.cancel) { }
      }
    });
  } else if (state.orderType !== 'scoreMall' && state.isPointsRedemption) {
    chooseScore();
  }
}
function chooseScore () {
  const self = this;
  const allPrice = Number(state.allPrice); // 订单金额
  const totalDiscount = Number(state.totalDiscount); // 现金抵扣金额
  // 运费抵扣
  let shipmentRealPay = 0;
  let shipmentCouponDiscount = 0;
  state.goodTypeList.forEach(item => {
    shipmentRealPay += parseFloat(item.orderType === 'CYCLE' ? item.cycleFee : item.shipmentAmount); // 将实付运费重置为运费金额
    shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
  });
  shipmentRealPay = parseFloat((shipmentRealPay - Number(shipmentCouponDiscount || 0)).toFixed(2));
  shipmentRealPay = shipmentRealPay > 0 ? shipmentRealPay : 0;
  // 积分抵扣
  const scoreDeductionAmount = Number(state.scoreDiscount);
  // 可使用的礼品卡信息
  const orderGiftCard = state.orderGiftCard;
  const canUseAmount = Number(state.storedValueCard.balance); // 可以使用的储值金额
  // 总价减去抵扣（现金、券和积分优惠）和运费抵扣剩下的金额
  const paymentTotal = parseFloat((allPrice + shipmentRealPay - totalDiscount).toFixed(2));
  // 计算礼品卡抵扣的金额
  // let giftCardDiscount = 0;
  // if (paymentTotal > Number(orderGiftCard.maxUseTotal)) {
  //     giftCardDiscount = Number(orderGiftCard.maxUseTotal) > 0 ? parseFloat(Number(orderGiftCard.maxUseTotal).toFixed(2)) : 0
  // } else {
  //     giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0
  // }

  // 礼品卡优化 ---- 更新计算礼品卡抵用金额
  let giftCardDiscount = 0;
  let totalUseGiftBalance = 0;
  state.orderGiftCard.forEach(item => {
    totalUseGiftBalance += item.balance;
  });
  if (paymentTotal > totalUseGiftBalance) {
    giftCardDiscount = Number(totalUseGiftBalance) > 0 ? parseFloat(Number(totalUseGiftBalance).toFixed(2)) : 0;
  } else {
    giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0;
  }
  let tempPrice = parseFloat((allPrice - totalDiscount - scoreDeductionAmount - giftCardDiscount + shipmentRealPay).toFixed(2));
  const useScore = !state.useScore;
  state.useScore = useScore;
  let scoreDiscount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0;
  // scoreDiscount = useScore ? scoreDiscount : 0
  if (useScore) {
    if (tempPrice > scoreDiscount) {
      state.integral = state.scoreInfo.orderAmount ? state.scoreInfo.orderAmount : 0;
      state.scoreAmount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0;
      state.scoreDiscount = scoreDiscount;
    } else {
      state.integral = state.scoreInfo.orderAmount ? state.scoreInfo.orderAmount : 0;
      state.scoreAmount = tempPrice;
      state.scoreDiscount = scoreDiscount;
    }
  } else {
    state.integral = 0;
    state.scoreDiscount = 0;
  }
  calcPromotions();
}
function chooseScoreA () {
  const self = this;
  const allPrice = Number(state.allPrice); // 订单金额
  const totalDiscount = Number(state.totalDiscount); // 现金抵扣金额
  // 运费抵扣
  let shipmentRealPay = 0;
  let shipmentCouponDiscount = 0;
  state.goodTypeList.forEach(item => {
    shipmentRealPay += parseFloat(item.orderType === 'CYCLE' ? item.cycleFee : item.shipmentAmount); // 将实付运费重置为运费金额
    shipmentCouponDiscount += parseFloat(item.shipmentCouponDiscount || 0);
  });
  shipmentRealPay = parseFloat((shipmentRealPay - Number(shipmentCouponDiscount || 0)).toFixed(2));
  shipmentRealPay = shipmentRealPay > 0 ? shipmentRealPay : 0;
  // 积分抵扣
  const scoreDeductionAmount = Number(state.scoreDiscount);
  // 可使用的礼品卡信息
  const orderGiftCard = state.orderGiftCard;
  const canUseAmount = Number(state.storedValueCard.balance); // 可以使用的储值金额
  // 总价减去抵扣（现金、券和积分优惠）和运费抵扣剩下的金额
  const paymentTotal = parseFloat((allPrice + shipmentRealPay - totalDiscount).toFixed(2));

  // 礼品卡优化 ---- 更新计算礼品卡抵用金额
  let giftCardDiscount = 0;
  let totalUseGiftBalance = 0;
  state.orderGiftCard.forEach(item => {
    totalUseGiftBalance += item.balance;
  });
  if (paymentTotal > totalUseGiftBalance) {
    giftCardDiscount = Number(totalUseGiftBalance) > 0 ? parseFloat(Number(totalUseGiftBalance).toFixed(2)) : 0;
  } else {
    giftCardDiscount = Number(paymentTotal) > 0 ? parseFloat(Number(paymentTotal).toFixed(2)) : 0;
  }
  let tempPrice = parseFloat((allPrice - totalDiscount - giftCardDiscount + shipmentRealPay).toFixed(2));
  const useScore = state.useScore;
  let scoreDiscount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0;
  if (useScore) {
    if (tempPrice > scoreDiscount) {
      state.scoreAmount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0;
    } else {
      state.scoreAmount = tempPrice;
    }
  } else {
    state.integral = 0;
    state.scoreDiscount = 0;
  }
}
function getMbrScoreBalance () {
  const that = this;
  let mobile = '';
  if (app.globalData.userInfo && app.globalData.userInfo.member.mobile) {
    mobile = app.globalData.userInfo.member.mobile;
  } else {
    try {
      let member = uni.getStorageSync('wj_member');
      if (member) {
        mobile = member.mobile;
      }
    } catch (e) {
      // Do something when catch error
    }
  }
  memberService.getBalance(mobile).then(res => {
    state.memberScore = res;
    getAvailableScoreNum(res);
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function bindScoreChange (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value);
  let useAmount = state.scoreArray[e.detail.value];
  let scoreInfo = state.scoreInfo;
  let scoreAmount = scoreInfo.scoreAmount;
  if (state.scoreArray.length > 1) {
    scoreAmount = parseInt(useAmount / scoreInfo.scoreSpace);
  }
  scoreInfo = {
    ...scoreInfo,
    scoreAmount: scoreAmount
  };
  state.scoreIndex = e.detail.value;
  state.scoreUseAmount = useAmount;
  state.scoreInfo = scoreInfo;
}
function viewStoreLocation (e) {
  let idx = e.currentTarget.dataset.idx;
  const storeInfo = state.goodTypeList[idx].storeInfo;
  const latitude = parseFloat(storeInfo.latitude);
  const longitude = parseFloat(storeInfo.longitude);
  uni.openLocation({
    latitude,
    longitude,
    scale: 28,
    name: storeInfo.name,
    address: storeInfo.address
  });
}
function viewScoreWarn (e) {
  let dataSet = e.currentTarget.dataset;
  if (dataSet.scorerule) {
    uni.showModal({
      title: '提示',
      content: e.currentTarget.dataset.scorerule
    });
  }
}
function toggleMiddlePopup () {
  toggle('middle');
}
function toggle (type) {
  state[`show.${type}`] = !state.show[type];
}
function getAvailableCouponNum (idx) {
  if (!canGetAvailableCouponNum) {
    return;
  }
  canGetAvailableCouponNum = false;
  const that = this;
  if (!state.userChooseCoupon) {
    canGetAvailableCouponNum = true;
    calcPromotions();
    return;
  }
  let _data = getPostData();
  let orderType = state.orderType;
  let postData = {};
  if (state.multipleOrdersFlag) {
    state.goodTypeList.some(item => {
      if (item.orderType != 'distribution') {
        orderType = item.orderType;
      }
      return item.orderType != 'distribution';
    });
  } else {
    orderType = state.goodTypeList[0].orderType;
  }
  if (orderType === 'normal') {
    postData = {
      order: _data
    };
  } else if (orderType === 'secondkill') {
    postData = {
      grabOrder: _data
    };
  } else if (orderType === 'advanceSell') {
    postData = {
      order: _data
    };
  } else if (orderType === 'group') {
    postData = {
      teamOrder: _data
    };
  } else {
    postData = {
      order: _data
    };
  }
  if (orderType !== 'group' && orderType !== 'advanceSell' && orderType !== 'solitaire' && orderType !== "packaging") {
    queryAvailableCoupon();
  } else if (state.systemOptions.teamOrderCanUseCoupon) {
    queryAvailableCoupon();
  } else {
    canGetAvailableCouponNum = true;
    console.log("重新选择优惠券之后调用接口计算储值余额抵扣");
    // 重新选择优惠券之后调用接口计算储值余额抵扣
    handleCardBalance();
  }
  console.log(postData);
  function queryAvailableCoupon (idx) {
    //  parseFloat(data.allPrice)
    let allPrice = 0;
    if ((idx || idx === 0) && _data.shipmentGroups[idx]) {
      allPrice = _data.shipmentGroups[idx].allPrice;
      postData = {
        order: _data.shipmentGroups[idx]
      };
    } else if (_data && _data.shipmentGroups) {
      _data.shipmentGroups.forEach(item => {
        allPrice += parseFloat(item.allPrice);
      });
      postData.allPrice = allPrice;
    } else {
      allPrice = parseFloat(_data.allPrice) || state.allPrice;
    }
    if (allPrice > 0) {
      couponService.getAvailableCoupon(null, postData).then(res => {
        canGetAvailableCouponNum = true;
        console.log(res);
        let discountNum = 0;
        let freeshipNum = 0;
        let deductionAmount = 0;
        let deductionRate = 1;
        let tempCoupon = null;
        let discountCoupons = []; // 可用折扣券列表
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item.usable === true) {
              if (item.coupon.function !== 'FREESHIP') {
                if (!idx && idx != 0) {
                  discountNum++;
                  // 找出满减券中可抵扣金额最大的那张
                  if (item.coupon.function === 'CASH') {
                    if (item.coupon.faceValue > deductionAmount) {
                      tempCoupon = item;
                      deductionAmount = item.coupon.faceValue;
                    }
                  } else if (item.coupon.function === 'DISCOUNT') {
                    discountCoupons.push(item);
                  }
                }
              } else {
                freeshipNum++;
              }
            }
          });
          if (!idx && idx != 0) {
            // 自动选择折扣率最大的折扣券
            if (deductionAmount === 0 && discountCoupons.length > 0) {
              discountCoupons.forEach(item => {
                if (item.coupon.rate < deductionRate) {
                  tempCoupon = item;
                  deductionRate = item.coupon.rate;
                }
              });
            }
          }
        }
        // 如果用户当前没有选择优惠券，默认选择最大抵扣的现金券
        // let flag = that.data.allPrice + that.data.shipmentAmount - that.data.scoreAmount <= 0;
        if (!idx && idx != 0) {
          let flag = state.couponDiscount <= 0;
          if (!flag && !state.useCoupon && state.usedCoupons.length === 0 && tempCoupon && (deductionAmount > 0 || deductionRate < 1)) {
            let couponData = {
              couponType: "discount",
              coupons: [tempCoupon]
            };
            calcCoupon(couponData);
          } else {
            canCalcPromotions = true;
            calcPromotions();
          }
        }
        if ((idx || idx === 0) && state.goodTypeList[idx]) {
          state.goodTypeList[idx].freeshipNum = freeshipNum;
          state.goodTypeList = state.goodTypeList;
        } else {
          state.goodTypeList[0].freeshipNum = freeshipNum;
          state.goodTypeList = state.goodTypeList;
          state.hasAvailableCoupon = true;
          state.discountNum = discountNum;
          state.freeshipNum = freeshipNum;
        }
        if (_data && _data.shipmentGroups && !idx && idx != 0) {
          _data.shipmentGroups.forEach((item, index) => {
            queryAvailableCoupon(index);
          });
        }
      }).catch(err => {
        canGetAvailableCouponNum = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      calcPromotions();
      canGetAvailableCouponNum = true;
      state.hasAvailableCoupon = true;
      state.discountNum = 0;
      state.freeshipNum = 0;
    }
  }
}
function getAvailableScoreNum (score) {
  const self = this;
  let allPrice = parseFloat(Number(state.allPrice)).toFixed(2);
  memberService.getScoreDeutible(score, allPrice).then(res => {
    let scoreAmount = parseFloat(res.orderAmount / res.scoreSpace);
    let price = (parseFloat(state.allPrice) - parseFloat(state.inputAmount)).toFixed(2);
    scoreAmount = scoreAmount > parseFloat(price) ? parseFloat(price) : scoreAmount;
    let tempData = {
      ...res,
      scoreAmount: scoreAmount,
      orderAmount: scoreAmount * res.scoreSpace
    };
    state.scoreInfo = tempData;
    state.scoreAmount = scoreAmount;
    console.log(state.storedValueCard.balance);
    if (state.offlinType === "cashReceipt" && state.memberScore > 0 && state.storedValueCard.balance > 0 && !state.useScore) {
      handleScoreChoice();
    } else {
      // 重新选择优惠券之后调用接口计算储值余额抵扣
      handleCardBalance();
    }
  }).catch(err => {
    // 重新选择优惠券之后调用接口计算储值余额抵扣
    handleCardBalance();
  });
}
function showNotify (text) {
  Notify.show({
    text: text,
    duration: 3000,
    selector: '#top-notify',
    backgroundColor: '#ff918f'
  });
}
function handlePayModule () {
  const that = this;
  let orderType = state.orderType;
  if (state.multipleOrdersFlag) {
    state.goodTypeList.some(item => {
      if (item.orderType != 'distribution') {
        orderType = item.orderType;
      }
      return item.orderType != 'distribution';
    });
  } else {
    orderType = state.goodTypeList[0].orderType;
  }
  // 获取储值卡余额
  if (orderType !== 'advanceSell' || state.advanceSellPayment) {
    // 预售不支持储值支付
    getMbrBalance();
  }
  // || that.data.orderType === 'packaging' 
  if (!(orderType === 'advanceSell' || state.advanceSellPayment || orderType === 'secondkill' && state.scource === 'BUYNOW' || orderType === 'solitaire')) {
    if (orderType != 'CYCLE') {
      // 预售不参与促销
      calcPromotions();
      // 获取可用优惠券及可使用积分数量
      getAvailableCouponNum();
      // 获取积分余额
      if (state.isPointsRedemption) {
        getMbrScoreBalance();
      }
    }
    if (state.systemOptions.isGiftCard) {
      // 获取礼品卡数量
      getAvailableGiftCardNum();
    }
  }
}
function formatDate (date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，要加1，且补0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
onLoad(async function (options) {
  cacheOrder = null;
  if (options.cacheOrder != null) {
    cacheOrder = JSON.parse(options.cacheOrder);
  }
  getShopCartStyle();
  getNearbestStoreCalc();
  // 防止异步没有获取到定位配置问题
  if (!state.deliveryDistanceThirdMap && (!app || !app.globalData || !app.globalData.systemConfigure || !app.globalData.systemConfigure.deliveryDistanceThirdMap)) {
    await getMapSet();
  }
  if (options.sourceOrderNo && options.storeCode && options.posNo) {
    state.sourceOrderData = {
      sourceOrderNo: options.sourceOrderNo,
      storeCode: options.storeCode,
      posNo: options.posNo
    };
  } else {
    state.sourceOrderData = null;
  }
  uni.hideShareMenu();
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  const self = this;
  if (app.globalData.storeInfo) {
    // 查询配送费优惠规则 // 不用计算配送费优惠
    // self.getDistributionFeeRule(app.globalData.storeInfo.id)
    state.storeName = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    state.storeInfo = app.globalData.storeInfo;
  }
  if (options.externalInfo && options.externalInfo.storeCode) {
    for (let key in options.externalInfo) {
      if (obj.hasOwnProperty(key)) {
        queryString += `${key}=${obj[key]}&`;
      }
    }
    queryString = queryString.slice(0, -1);
    state.storeId = options.externalInfo.storeCode;
    state.remarks = `?${queryString}`;
  }
  systemService.query('supportInvoice,isDiscountUsedForGiftCard,serviceDuration').then(res => {
    if (res && res.length > 0) {
      res.forEach(item => {
        if (item.key === "supportInvoice") {
          if (item.value === "FALSE" || item.value === "false") {
            state.showInvoice = false;
          } else if (item.value === "TRUE" || item.value === "true") {
            state.showInvoice = true;
          }
        } else if (item.key === "isDiscountUsedForGiftCard") {
          state.isDiscountUsedForGiftCard = item.value === "TRUE";
        } else if (item.key === "serviceDuration" && item.value) {
          state.serviceDuration1 = parseInt(item.value / 2);
          state.serviceDuration = item.value;
        }
      });
    }
  }).catch(err => {
    util.showToast(err.message);
  });

  // 查询配置项获取订单预约时间和订单自提开始时间和预约时间间隔
  let systemOptions = app.globalData.configureInfo;
  let configures = {
    orderChooseDateAllowDays: 3,
    orderChooseDateInterval: 10800000,
    daysOfSelfTimeDelay: 0,
    teamOrderCanUseScore: false,
    teamOrderCanUseCoupon: false,
    isGiftCard: true,
    isBothScoreAndCoupon: false
  };
  systemOptions.forEach(item => {
    // 遍历配置项，获取订单预约时间和订单自提开始时间
    if (item.key === 'orderChooseDateAllowDays' && item.value != null && item.value !== '') {
      // 订单预约可以预约几天 （单位 天）
      configures.orderChooseDateAllowDays = parseInt(item.value);
    } else if (item.key === 'orderChooseDateInterval' && item.value != null && item.value !== '') {
      // 订单预约时间的间隔 （单位 毫秒）
      configures.orderChooseDateInterval = parseInt(item.value) * 1000;
    } else if (item.key === 'daysOfSelfTimeDelay' && item.value != null && item.value !== '') {
      configures.daysOfSelfTimeDelay = parseInt(item.value);
    } else if (item.key === 'isGiftCard' && item.value != null && item.value !== '') {
      item.value === 'TRUE' ? configures.isGiftCard = true : configures.isGiftCard = false;
    } else if (item.key === 'isBothScoreAndCoupon' && item.value != null && item.value !== '') {
      item.value === 'TRUE' ? configures.isBothScoreAndCoupon = true : configures.isBothScoreAndCoupon = false;
    }
  });
  // 选择是否开启选择当天库存警告
  state.systemOptions = configures;
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color:' + app.globalData.uiconfig.themeColor + ';' : 'color:' + (uni.getStorageSync('themeColor') || '#FF9F43') + ';',
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background:' + app.globalData.uiconfig.themeColor + ';' : 'background:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color:' + app.globalData.uiconfig.themeColor + ';' : 'border-color:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background:linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background:linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: 'color:#333;',
    borderColorRgb: "border-color:#333;",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color: rgba(246, 102, 0,0.1);"
  };
  if (configures.daysOfSelfTimeDelay != null && configures.daysOfSelfTimeDelay > 0) {
    state.hasStockWarning = true;
    if (state.hasStockWarning) {
      state.multiIndex = [1, 0];
    }
  }
  // 获取购物车数据
  try {
    let value = uni.getStorageSync('wj_shopcart');
    console.log('获取购物车数据', value);
    if (value) {
      let requiredList = uni.getStorageSync('requireProductIds') ? JSON.parse(uni.getStorageSync('requireProductIds')) : [];
      if (!value.goodsTypeList) {
        value.goodsTypeList = [{
          ...value
        }];
      }
      state.multipleOrdersFlag = value.goodsTypeList && value.goodsTypeList.length > 1;
      state.goodsTypeList = value.goodsTypeList;
      state.serviceStaffData = value.serviceStaffData;
      state.appointmentTime = value.appointmentTime;
      state.appointmentMobile = app.globalData.userInfo && app.globalData.userInfo.member && app.globalData.userInfo.member.mobile ? app.globalData.userInfo.member.mobile : '';
      state.appointmentUser = app.globalData.userInfo && app.globalData.userInfo.member && app.globalData.userInfo.member.nickName ? app.globalData.userInfo.member.nickName : '';
      let allPrice = 0;
      let goodTypeList = [];
      let allGoodList = [];
      value.goodsTypeList.forEach((goodsType, goodsTypeIndex) => {
        if (goodsType.orderType == 'distribution' && !state.displayAddressFlag) {
          checkDistribution(goodsTypeIndex);
          state.displayAddressFlag = true;
        }
        // this.initializationTime(goodsTypeIndex) //初始化预约时间
        handleData(goodsType, goodsTypeIndex >= value.goodsTypeList.length - 1, goodsTypeIndex);
      });
      function handleData (value, goodTypeListSaveFlag, goodsTypeIndex) {
        let optionalShipmentType = {
          'SELF': true,
          'EXPRESS': true,
          'LOGISTICAL': true
        };
        if (value.orderType !== 'distribution') {
          value.storeInfo = value.storeInfo || app.globalData.storeInfo;
          value.storeId = value.storeId || app.globalData.storeInfo.id;
          value.storeName = value.storeName || app.globalData.storeInfo.name;
          state.goodTypeList[goodsTypeIndex].storeInfo = state.goodTypeList[goodsTypeIndex].storeInfo || app.globalData.storeInfo;
          state.goodTypeList[goodsTypeIndex].storeId = state.goodTypeList[goodsTypeIndex].storeId || app.globalData.storeInfo.id;
          state.goodTypeList[goodsTypeIndex].storeName = state.goodTypeList[goodsTypeIndex].storeName || app.globalData.storeInfo.name;
        }
        if (value.goodsList) {
          let goodsNum = 0;
          value.goodsList.forEach(item => {
            // item.optionalShipmentType = {
            //   'SELF': true,
            //   'EXPRESS': true,
            //   'LOGISTICAL': true,
            // }; // 重置当前商品可选配送方式
            item.sellPrice = item.sellPrice ? parseFloat(parseFloat(item.sellPrice).toFixed(2)) : item.sellPrice;
            item.grabPrice = item.grabPrice ? parseFloat(parseFloat(item.grabPrice).toFixed(2)) : item.grabPrice;
            item.newmbrPrice = item.newmbrPrice ? parseFloat(parseFloat(item.newmbrPrice).toFixed(2)) : item.newmbrPrice;
            item.memberPrice = item.memberPrice ? parseFloat(parseFloat(item.memberPrice).toFixed(2)) : item.memberPrice;
            item.promotionPrice = item.promotonPrice ? parseFloat(parseFloat(item.promotionPrice).toFixed(2)) : item.promotionPrice;
            if (requiredList && requiredList.length > 0) {
              item.require = requiredList.indexOf(item.id) > -1 || requiredList.indexOf(item.productId) > -1;
            }
            // if(item && item.shipmentType && value.orderType !== "CYCLE") {
            //   let keys = Object.keys(item.optionalShipmentType)
            //   keys.forEach(shipmentTypeItem => {
            //     if(item.shipmentType.indexOf(shipmentTypeItem) == -1 && item.optionalShipmentType[shipmentTypeItem]) {
            //       item.optionalShipmentType[shipmentTypeItem] = false
            //     }
            //   })
            // }
            // 将商品信息统一存入一个数组便于后续传递
            item.orderType = value.orderType;
            // goodsNum += item.productNum;
            allGoodList.push(item);
          });
          if (value.orderType !== "CYCLE") {
            let keys = Object.keys(optionalShipmentType);
            keys.forEach(shipmentTypeItem => {
              let flag = false;
              flag = value.goodsList.some(item => {
                return !item.shipmentType || item.shipmentType.indexOf(shipmentTypeItem) > -1;
              });
              optionalShipmentType[shipmentTypeItem] = flag;
            });
          }
          state.goodTypeList[goodsTypeIndex].goodsListAll = value.goodsList;
          // self.data.goodTypeList[goodsTypeIndex].goodsNum = goodsNum
        }
        if (value.orderType != 'distribution' && !value.isDistributionOrder) {
          state.goodTypeList[goodsTypeIndex].type = optionalShipmentType.SELF ? 'selftake' : 'dispatch';
          state.goodTypeList[goodsTypeIndex].shipmentType = optionalShipmentType.SELF ? 'SELF' : 'EXPRESS';
          value.type = optionalShipmentType.SELF ? 'selftake' : 'dispatch';
          // value.shipmentType = optionalShipmentType.SELF ? 'SELF' : 'EXPRESS'
          initializationTime(goodsTypeIndex); //初始化预约时间
        } else {
          state.goodTypeList[goodsTypeIndex].shipmentType = 'LOGISTICAL';
        }
        state.freeShipping = value.freeShipping;
        state.goodsList = value.goodsList;
        state.cycleId = value.cycleId;
        state.cycleFixedId = value.cycleFixedId;
        state.cycleDetails = value.cycleDetails;
        state.cycleActiveDes = value.cycleActiveDes;
        state.showFirstTime = value.showFirstTime;
        state.deliveryTimeCycle = value.deliveryTime;
        state.cyclePhaseTotal = value.cyclePhaseTotal;
        value.deliveryTimeCycle = value.deliveryTime;
        allPrice += parseFloat(value.allPrice || 0);
        if (!state.multipleOrdersFlag || value.orderType != 'distribution') {
          value.optionalShipmentType = optionalShipmentType;
          if (value.orderType != 'distribution' && value.orderType != 'nextDay') {
            state.optionalShipmentType = optionalShipmentType;
            state.storeId = value.storeId;
            state.orderType = value.orderType;
          }
        }
        if (value.orderSource) {
          this.setData({
            orderSource: value.orderSource,
            room_id: value.room_id
          });
        }
        // 赠品列表（非买一送一赠品）
        if (value.giftProducts != null && value.giftProducts.length > 0) {
          state.giftGoodsList = value.giftProducts;
        }
        if (value.orderType === 'group') {
          console.log('===group', value.shipmentType);
          state.teamBuyId = value.teamBuyId;
          state.storeName = value.storeName;
          state.teamLeaderRecordId = value.teamLeaderRecordId;
          state.teamBuyInfo = value.teamBuyInfo;
          state.packagingId = value.teamBuyId;
          state.activeType = 'TEAM_BUYING';
          state.shipmentType = value.shipmentType ? value.shipmentType : [];
          value.activeType = 'TEAM_BUYING';
          value.packagingId = value.teamBuyId;
          if (value.orderType === 'group') {
            let teamMemberJoinCount = value.teamBuyInfo.teamMemberJoinCount != null && parseInt(value.teamBuyInfo.teamMemberJoinCount) >= 1 ? parseInt(value.teamBuyInfo.teamMemberJoinCount) : 1;
            // 拼团重新设置商品单价
            if (teamMemberJoinCount > 1 && Array.isArray(value.goodsList) && value.goodsList.length > 0) {
              let goodsList = value.goodsList;
              goodsList.forEach((ele, index) => {
                goodsList[index].sellPrice = parseFloat((parseFloat(ele.sellPrice) / teamMemberJoinCount).toFixed(2));
              });
              value.goodsList = goodsList;
              state.goodsList = goodsList;
            }
          }
          if (value.teamBuyInfo.canUseCoupon != null) {
            configures.teamOrderCanUseCoupon = value.teamBuyInfo.canUseCoupon;
          }
          if (value.teamBuyInfo.canUseScore != null) {
            configures.teamOrderCanUseScore = value.teamBuyInfo.canUseScore;
          }
          state.systemOptions = configures;
          if (value.scource) {
            state.scource = value.scource;
          }
          // 拼团订单商品是否统配商品
          if (value.goodsList && value.goodsList[0].business === 'DISTRIBUTION') {
            // 统配订单
            state.isDistributionOrder = true;
            state.type = 'logistical';
            value.isDistributionOrder = true;
            value.type = 'logistical';
            value.shipmentType = 'LOGISTICAL';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          } else if (!state.canSelfmention) {
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            // 门店不支持自提
            // wx.hideLoading()
            state.canBuy = false;
            state.customLoading = false;
            util.setHideLoading(true);
            uni.showToast({
              title: '当前门店不支持自提，看看其他门店吧~',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              util.setHideLoading(false);
            }, 1000);
          } else {
            state.type = 'selftake';
            value.type = 'selftake';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            // self.initializationTime(goodsTypeIndex) // 初始化预约时间
            handleGoodsList(goodsTypeIndex); // 处理商品列表
          }
        } else if (value.orderType === 'advanceSell') {
          value.advanceSellInfo = {
            balanceEndTime: value.balanceEndTime,
            deliveryTime: value.deliveryTime,
            selfTimeScope: value.selfTimeScope,
            payType: value.payType,
            shipmentType: value.shipmentType
          };
          value.packagingId = value.goodsList[0].advanceId;
          value.activeType = 'ADVANCE_SELL_ACTIVITY';
          value.isExpress = value.shipmentType === "EXPRESS" ? true : false;
          value.multiIndex = [0, 0]; //预售重置
          value.hasStockWarning = false; //预售重置

          state.goodTypeList[goodsTypeIndex] = {
            ...state.goodTypeList[goodsTypeIndex],
            ...value
          };
          state.advanceSellInfo = value.advanceSellInfo;
          state.packagingId = value.goodsList[0].advanceId;
          state.activeType = 'ADVANCE_SELL_ACTIVITY';
          state.useStoredMspCard = false;
          state.hasStockWarning = false;
          state.isExpress = value.shipmentType === "EXPRESS" ? true : false;
          state.multiIndex = [0, 0];
          if (value.scource) {
            state.scource = value.scource;
          }
          if (value.orderType != 'distribution' && !value.isDistributionOrder && !optionalShipmentType.SELF) {
            // 统配订单
            // value.isDistributionOrder = true
            state.type = 'dispatch';
            value.type = 'dispatch';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            // self.getDistributionStore(goodsTypeIndex)
          }
          // 预售订单商品是否统配商品
          else if (value.goodsList[0].business === 'DISTRIBUTION') {
            // 统配订单
            state.isDistributionOrder = true;
            state.type = 'logistical';
            value.isDistributionOrder = true;
            value.type = 'logistical';
            value.shipmentType = 'LOGISTICAL';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          } else {
            state.type = 'selftake';
            value.type = 'selftake';

            // 预售自提时 获取预售结束时间 + n天可自提时间 
            if (value.deliveryTime) {
              if (value.payType === 'FULL' && value.frontEndTime) {
                //全款
                let currentDate = new Date(value.frontEndTime);
                currentDate.setDate(currentDate.getDate() + value.deliveryTime);
                state.calculateData.startDateTime = formatDate(currentDate);
              } else if (value.payType === 'PARTIAL' && value.balanceEndTime) {
                //尾款
                let currentDate = new Date(value.balanceEndTime);
                currentDate.setDate(currentDate.getDate() + value.deliveryTime);
                state.calculateData.startDateTime = formatDate(currentDate);
              }
            } else {
              if (value.selfTimeScope) {
                // 固定时间段发货
                let timeArr = value.selfTimeScope.split('~');
                if (timeArr && timeArr[0]) state.calculateData.startDateTime = formatDate(timeArr[0]);
                if (timeArr && timeArr[1]) state.calculateData.endDateTime = formatDate(timeArr[1]);
              } else if (value.payType === 'FULL' && value.frontEndTime && value.deliveryTime == 0) {
                //全款 // 0天发货修改逻辑
                state.calculateData.startDateTime = formatDate(value.frontEndTime);
              } else if (value.payType === 'PARTIAL' && value.balanceEndTime && value.deliveryTime == 0) {
                //尾款 // 0天发货修改逻辑
                state.calculateData.startDateTime = formatDate(value.balanceEndTime);
              }
            }
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            // self.initializationTime(goodsTypeIndex) // 初始化预约时间
            handleGoodsList(goodsTypeIndex); // 处理商品列表
          }
          state.goodTypeList[goodsTypeIndex] = {
            ...state.goodTypeList[goodsTypeIndex],
            ...value
          };
        } else if (value.orderType === 'scoreMall') {
          value.scoreAmount = value.allPrice;
          value.scoreDiscount = value.allPrice;
          value.scoreUseAmount = value.score;
          state.scoreAmount = value.allPrice;
          state.scoreDiscount = value.allPrice;
          state.integral = value.score;
          state.scoreUseAmount = value.score;
          if (value.scource) {
            state.scource = value.scource;
          }
          state.goodTypeList[goodsTypeIndex] = {
            ...state.goodTypeList[goodsTypeIndex],
            ...value
          };
        } else if (value.orderType === 'secondkill') {
          // 拼团订单商品是否统配商品
          if (value.goodsList[0].business === 'DISTRIBUTION') {
            // 统配订单
            state.isDistributionOrder = true;
            state.type = 'logistical';
            value.isDistributionOrder = true;
            value.type = 'logistical';
            value.shipmentType = 'LOGISTICAL';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          }
          if (value.scource) {
            state.scource = value.scource;
          }
          state.secKillInfo = value.secKillInfo != null ? value.secKillInfo : {};
          state.goodTypeList[goodsTypeIndex] = {
            ...state.goodTypeList[goodsTypeIndex],
            ...value
          };
        } else if (value.orderType === 'packaging') {
          state.packagingId = value.packagingId;
          state.activeType = 'PACKAGING_ACTIVITY';
          value.activeType = 'PACKAGING_ACTIVITY';
          state.goodTypeList[goodsTypeIndex] = {
            ...state.goodTypeList[goodsTypeIndex],
            ...value
          };
          if (value.scource) {
            state.scource = value.scource;
          }
          // 拼团订单商品是否统配商品
          if (value.goodsList[0].business === 'DISTRIBUTION') {
            // 统配订单
            state.isDistributionOrder = true;
            state.type = 'logistical';
            value.isDistributionOrder = true;
            value.type = 'logistical';
            value.shipmentType = 'LOGISTICAL';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          } else {
            state.type = 'selftake';
            value.type = 'selftake';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            initializationTime(goodsTypeIndex); // 初始化预约时间
            handleGoodsList(goodsTypeIndex); // 处理商品列表
          }
          // self.checkDistribution(goodsTypeIndex)
        } else if (value.orderType === 'solitaire') {
          state.solitaireId = value.solitaireId;
          state.solitaireType = value.solitaireType;
          state.solitaireInfo = value.solitaireInfo;
          if (value.scource) {
            state.scource = value.scource;
          }
          // 拼团订单商品是否统配商品
          if (value.goodsList[0].business === 'DISTRIBUTION') {
            // 统配订单
            state.isDistributionOrder = true;
            state.type = 'dispatch';
            value.isDistributionOrder = true;
            value.type = 'dispatch';
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          } else {
            state.type = 'selftake';
            value.type = 'selftake';

            // 接龙自提时 获取活动结束时间 + 接龙n天可自提时间
            if (value.solitaireInfo.endTime && value.solitaireInfo.selfAfterDay) {
              let currentDate = new Date(value.solitaireInfo.endTime);
              currentDate.setDate(currentDate.getDate() + value.solitaireInfo.selfAfterDay);
              state.calculateData.startDateTime = formatDate(currentDate);
            } // 固定时间自提
            else if (value.solitaireInfo.selfStartTime && value.solitaireInfo.selfEndTime) {
              state.calculateData.startDateTime = this.formatDate(value.solitaireInfo.selfStartTime);
              state.calculateData.endDateTime = this.formatDate(value.solitaireInfo.selfEndTime);
            }
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            //   self.initializationTime(goodsTypeIndex) // 初始化预约时间
            handleGoodsList(goodsTypeIndex); // 处理商品列表
          }
        } else if (value.orderType === 'CYCLE') {
          // 周期购订单商品是否统配商品
          if (value.goodsList[0].business === 'DISTRIBUTION') {
            state.goodTypeList[goodsTypeIndex] = {
              ...state.goodTypeList[goodsTypeIndex],
              ...value
            };
            getDistributionStore(goodsTypeIndex);
          }
        } else {
          state.cashDiscount = value.discount ? parseFloat(value.discount) : 0;
          state.cashDiscountName = value.description || '';
          state.totalDiscount = value.discount ? parseFloat(value.discount) : 0;
          value.cashDiscount = value.discount ? parseFloat(value.discount) : 0;
          value.totalDiscount = value.discount ? parseFloat(value.discount) : 0;
          value.cashDiscountName = value.description || '';
          if (value.scource) {
            state.scource = value.scource;
          }
          if (value.orderType === 'distribution') {
            value.isDistributionOrder = true;
            value.type = 'logistical';
            if (!state.multipleOrdersFlag) {
              // 统配订单只支持配送
              state.type = 'logistical';
              state.isDistributionOrder = true;
            }
          }
          if (value.type != null && value.type === "OFFLINE") {
            // 线下订单
            state.mallOrderType = value.type;
            state.inputAmount = parseFloat(value.inputAmount).toFixed(2);
            value.mallOrderType = value.type;
            if (value.offlinType === "cashReceipt") {
              state.offlinType = "cashReceipt";
            }
          }
        }
        if (!state.multipleOrdersFlag || state.goodTypeList[goodsTypeIndex].orderType != 'distribution') {
          // 检查商品售卖时间
          // if (!value.isDistributionOrder) {
          if (state.goodTypeList[goodsTypeIndex].orderType !== 'advanceSell' && !state.goodTypeList[goodsTypeIndex].isDistributionOrder) {
            if (state.goodTypeList[goodsTypeIndex].orderType === "group" && !state.goodTypeList[goodsTypeIndex].canSelfmention) {
              // 拼团订单且门店不支持配送
              // self.handleDeliveryType(false,goodsTypeIndex)
              state.canBuy = false;
            } else {
              state.goodTypeList[goodsTypeIndex] = {
                ...state.goodTypeList[goodsTypeIndex],
                ...value
              };
              handleDeliveryType(false, goodsTypeIndex);
              checkProductsSellTime(goodsTypeIndex);
            }
          } else {
            if (value.shipmentType === 'EXPRESS' || value.shipmentType === 'LOGISTICAL' || state.goodTypeList[goodsTypeIndex].shipmentType === 'EXPRESS' || state.goodTypeList[goodsTypeIndex].shipmentType === 'LOGISTICAL') {
              state.type = value.isDistributionOrder ? 'logistical' : 'dispatch';
              value.type = value.isDistributionOrder ? 'logistical' : 'dispatch';
              state.goodTypeList[goodsTypeIndex] = {
                ...state.goodTypeList[goodsTypeIndex],
                ...value
              };
            } else if (value.shipmentType === 'SELF' || state.goodTypeList[goodsTypeIndex].shipmentType === 'SELF') {
              if (state.goodTypeList[goodsTypeIndex].canSelfmention) {
                state.type = 'selftake';
                value.type = 'selftake';
                state.goodTypeList[goodsTypeIndex] = {
                  ...state.goodTypeList[goodsTypeIndex],
                  ...value
                };
                initializationTime(goodsTypeIndex); //初始化预约时间
              } else {
                // 门店不支持配送
                if (state.goodTypeList[goodsTypeIndex].orderType === 'advanceSell') {
                  // 预售订单
                  // self.setData({
                  //     canBuy: false
                  // })
                  state.goodTypeList[goodsTypeIndex] = {
                    ...state.goodTypeList[goodsTypeIndex],
                    ...value
                  };
                  handleDeliveryType(false, goodsTypeIndex);
                }
              }
            }
            if (value.orderType == 'advanceSell' || value.orderType == 'packaging') {
              handleDeliveryType(false, goodsTypeIndex);
            }
            // 处理商品列表
            // 自提订单和配送订单
            if (!state.goodTypeList[goodsTypeIndex].isDistributionOrder && !(localData.shipmentTypes === "LOGISTICAL" && !state.canSelfmention)) {
              // 排除订单是统配订单和快递订单且门店不支持自提情况

              state.goodTypeList[goodsTypeIndex] = {
                ...state.goodTypeList[goodsTypeIndex],
                ...value
              };
              handleGoodsList(goodsTypeIndex);
            }
          }
        }
        // let keys = Object.keys(value)
        // keys.forEach(key => {
        //   if(value[key]) {
        //     self.data.goodTypeList[goodsTypeIndex][key] = value[key]
        //   }
        // })
        goodTypeList.push({
          ...state.goodTypeList[goodsTypeIndex]
        });
        if (goodTypeListSaveFlag) {
          // 获取到商品原价、会员价、促销价，用于礼品卡逻辑编写
          getOrderDetail(allGoodList);
          state.goodTypeList = goodTypeList;
          state.allGoodList = allGoodList;
          state.goodsList = allGoodList;
          getDistributionStore();
        }
        // 处理订单支付逻辑
        handlePayModule();
        // if (value.orderType !== 'CYCLE') { // 无用代码注释
        //     this.getValidateBenefitPlanText()
        // }
      }
    }
  } catch (e) {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  }

  // 根据门店支持的配送方式显示自提和配送
  // this.handleDeliveryType()

  // 清除缓存数据？
  try {
    // 清除缓存数据
    uni.removeStorageSync('wj_orderCardInfo');
    uni.removeStorageSync('wj_addRemarks');
    uni.removeStorageSync('wj_invoice');
    uni.removeStorageSync('wj_chooseCoupon');
    uni.removeStorageSync('wj_storePickupTime');
  } catch (error) { }
});
onReady(function () { });
onShow(async function () {
  // 饭卡支付代码注释
  // let cardNo = wx.getStorageSync('wj_cardno')
  // if (cardNo) {
  //     this.setData({
  //         cardNo
  //     })
  //     this.getMspAccountDetailA(cardNo)
  // }

  const self = this;
  let changeStore = false;
  // console.log(app.globalData.storeInfo,'app.globalData.storeInfo')
  // this.setData({
  //     storeInfo: app.globalData.storeInfo,
  //    
  // })
  await getPaymentMethod();
  // 获取地图配置
  await getMapSet();
  // 获取最大配送距离
  getDeliveryExpressMaxRice();
  let value = uni.getStorageSync('wj_shopcart');
  // if(!value.goodsTypeList) {
  //   value.goodsTypeList = [{
  //     ...value
  //   }]
  // }
  // console.log(value.storeId,app.globalData.storeInfo.id,'valuevalue')
  // if (value.storeId !== app.globalData.storeInfo.id) {
  //     this.setData({
  //         storeIdActive: true,
  //         storeIdA: wx.getStorageSync('storeIdactive'),
  //         distributionInfo: wx.getStorageSync('storeIdactive'),
  //     })
  // }
  state.multipleOrdersFlag = value.goodsTypeList && value.goodsTypeList.length > 1;
  if (value.shipmentType) {
    state.shipmentType = value.shipmentType;
  }
  let editActiveIdx = uni.getStorageSync('editActiveIdx') || uni.getStorageSync('editActiveIdx') === 0 ? uni.getStorageSync('editActiveIdx') : null;
  let orderType = state.multipleOrdersFlag && editActiveIdx != null ? state.goodTypeList[editActiveIdx].orderType : state.orderType;
  let storeInfo = state.multipleOrdersFlag && editActiveIdx != null ? state.goodTypeList[editActiveIdx].storeInfo : state.storeInfo;
  let isDistributionOrder = state.multipleOrdersFlag && editActiveIdx != null ? state.goodTypeList[editActiveIdx].isDistributionOrder : state.isDistributionOrder;
  let storeId = state.multipleOrdersFlag && editActiveIdx != null && state.goodTypeList[editActiveIdx].storeInfo ? state.goodTypeList[editActiveIdx].storeInfo.id : state.storeId;
  // 雄安没有切换门店逻辑
  if (orderType !== 'packaging' && orderType !== 'distribution' && !isDistributionOrder && (storeId !== app.globalData.storeInfo.id || storeInfo.virtualStoreId !== app.globalData.storeInfo.virtualStoreId) && (editActiveIdx || editActiveIdx == 0) && false) {
    // 不是统配订单且门店id和全局门店信息不一致
    if (!editActiveIdx && editActiveIdx != 0) return false;
    // self.data.goodTypeList[editActiveIdx].oldStoreInfo ? {
    //   ...self.data.goodTypeList[editActiveIdx].oldStoreInfo
    // } : 
    state.goodTypeList.forEach(item => {
      if (item.orderType != 'distribution') {
        item.oldStoreInfo = {
          ...item.storeInfo
        };
        item.storeName = app.globalData.storeInfo.name;
        item.storeId = item.orderType == 'nextDay' ? item.storeId : app.globalData.storeInfo.id;
        item.storeInfo = app.globalData.storeInfo;
        item.goodsList.forEach(item => {
          item.useOriPrice = false;
        });
        item.goodsListAll.forEach(item => {
          item.useOriPrice = false;
        });
      }
    });
    // self.data.goodTypeList[editActiveIdx].oldStoreInfo = {
    //   ...self.data.goodTypeList[editActiveIdx].storeInfo
    // };
    // self.data.goodTypeList[editActiveIdx].storeName = app.globalData.storeInfo.name;
    // self.data.goodTypeList[editActiveIdx].storeId = app.globalData.storeInfo.id;
    // self.data.goodTypeList[editActiveIdx].storeInfo = app.globalData.storeInfo;
    // self.data.goodTypeList[editActiveIdx].goodsList.forEach(item => {
    //   item.useOriPrice = false;
    // })
    // self.data.goodTypeList[editActiveIdx].goodsListAll.forEach(item => {
    //   item.useOriPrice = false;
    // })
    state.goodsList.forEach(item => {
      item.useOriPrice = false;
    });
    state.usedCoupons = [];
    state.goodsList = state.goodsList;
    state.storeId = app.globalData.storeInfo.id;
    state.goodTypeList = state.goodTypeList;
    changeStore = true;
    // 查询配送费优惠规则 // 不用计算配送费优惠
    // self.getDistributionFeeRule(app.globalData.storeInfo.id)
    // 切换门店回到完善订单页，检查当前门店拼团库存
    if (state.goodTypeList[editActiveIdx].orderType === 'group' || state.goodTypeList[editActiveIdx].orderType === 'solitaire') {
      // 根据门店支持的配送方式显示自提和配送
      handleDeliveryType(false, editActiveIdx);
      if (!state.goodTypeList[editActiveIdx].isDistributionOrder) {
        // 判断当前拼团是否统配拼团
        if (!state.goodTypeList[editActiveIdx].canSelfmention) {
          // 当前门店不支持自提
          // wx.hideLoading()
          state.canBuy = false;
          state.customLoading = false;
          util.setHideLoading(true);
          uni.showToast({
            title: '当前门店不支持自提，看看其他门店吧~',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            util.setHideLoading(false);
          }, 1000);
        } else {
          initializationTime(editActiveIdx); //初始化预约时间
          if (state.goodTypeList[editActiveIdx].orderType === 'group') {
            getGoodsBalance(state.goodTypeList[editActiveIdx].storeInfo.id, editActiveIdx);
          }
        }
      }
    }
  } else if (app.globalData.storeInfo && storeId === app.globalData.storeInfo.id) {
    if (app.globalData.storeInfo.storeHours !== storeInfo.storeHours) {
      // 营业时间发生了改变
      state.storeInfo = app.globalData.storeInfo;
      if (state.goodTypeList && state.goodTypeList.length) {
        state.goodTypeList.forEach((item, idx) => {
          initializationTime(idx); //初始化预约时间
        });
      }
    }
  }
  // 读取优惠券使用数据
  try {
    let couponData = uni.getStorageSync('wj_chooseCoupon');
    if (couponData) {
      calcCoupon(couponData);
    } else { }
    uni.removeStorageSync('wj_chooseCoupon');
  } catch (error) { }
  // 读取选择的礼品卡数据
  try {
    let giftCardData = uni.getStorageSync('wj_chooseCard');
    // if (giftCardData) {
    if (giftCardData && giftCardData.length > 0) {
      let canUseGiftCard = giftCardData;
      state.orderGiftCard = canUseGiftCard;
      if (state.isDiscountUsedForGiftCard && (state.orderType == 'normal' || state.orderType == 'distribution')) {
        changeGoodList(state.orderGiftCard && state.orderGiftCard.length > 0);
      }
      // 礼品卡应该在计算促销之后计算
      calcPromotions();
    } else {
      state.orderGiftCard = [];
      state.giftCardDiscount = 0;
      if (state.isDiscountUsedForGiftCard && (state.orderType == 'normal' || state.orderType == 'distribution')) {
        changeGoodList(state.orderGiftCard && state.orderGiftCard.length > 0);
      }
      // 礼品卡应该在计算促销之后计算, 且预售不参与促销
      if (!(state.orderType === 'advanceSell' && !state.advanceSellPayment || state.orderType === 'secondkill' && state.scource === 'BUYNOW' || state.orderType === 'solitaire' || state.orderType === 'packaging')) {
        if (state.orderType != 'CYCLE') {
          // 预售不参与促销
          calcPromotions();
        }
      }
    }
    // wx.removeStorageSync('wj_chooseCard')
  } catch (error) { }
  // 获取备注数据
  uni.getStorage({
    key: 'wj_addRemarks',
    success: function (res) {
      if (!editActiveIdx && editActiveIdx != 0) return false;
      state.goodTypeList[editActiveIdx].remarks = res.data;
      state.goodTypeList = state.goodTypeList;
      state.remarks = res.data;
    }
  });
  // 读取发票数据
  const invoice = uni.getStorageSync("wj_invoice");
  console.log(invoice, '发票数据');
  // 获取会员信息
  state.invoice = invoice;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.memberInfo = app.globalData.userInfo.member;
  } else {
    uni.getStorage({
      key: 'wj_member',
      success: function (res) {
        state.memberInfo = res.data;
      }
    });
  }
  // 读取储值余额使用信息
  uni.getStorage({
    key: 'wj_orderCardInfo',
    success: function (res) {
      state.storedValueCard = {
        balance: res.data.balance,
        password: res.data.password,
        useAmount: res.data.useAmount
      };
      state.useStoredValueCard = res.data.useStoredValueCard;
      state.payMethod.useStoredValueCard = res.data.useStoredValueCard;
    }
  });

  // 检查参数中是否有配送方式
  if (options && options.type) {
    let typeData = JSON.parse(options.type);
    console.log(typeData);
    state.type = typeData;
  }
  // 检查配送距离
  state.goodTypeList.forEach(async (item, idx) => {
    if ((item.type === 'dispatch' || item.type === 'logistical' || item.orderType == "distribution") && (!changeStore || idx == editActiveIdx)) {
      await checkDistribution(idx);
    } else { }
  });
  // 获取分享人id
  if (app.globalData.isShoppingGuidanceRecordGoods) {
    // 如果导购只计算分享的商品
    uni.getStorage({
      key: 'wj_sharingInfo',
      success: function (res) {
        if (res.data && res.data !== null) if (res.data.type !== "normal") {
          // 拼团、预售、秒杀（立即抢购）
          if (res.data.type === "secondkill" && state.scource !== "BUYNOW") {
            // 购物车中有秒杀
          } else if (state.goodsList.length === 1 && state.goodsList[0] != null && state.goodsList[0].productId != null) {
            console.log(res.data.shareId);
            if (res.data.shareId != null && res.data.productId === state.goodsList[0].productId) {
              state.sharingPersonId = res.data.shareId;
            } else if (res.data.shareId != null && res.data.productId === "") {
              state.sharingPersonId = res.data.shareId;
            }
          } else if (res.data.type === "secondkill" || res.data.type === "group") {
            if (res.data.shareId != null && res.data.productId === "") {
              state.sharingPersonId = res.data.shareId;
            } else if (res.data.productId === state.goodsList[0].productId) {
              state.sharingPersonId = res.data.shareId;
            }
          }
        }
      }
    });
  } else {
    // 整单记录分享 整单记录分享统一使用 wj_sharingId
    try {
      let sharingId = uni.getStorageSync('wj_sharingId');
      if (sharingId) {
        // Do something with return value
        state.sharingPersonId = sharingId;
      }
    } catch (e) {
      // Do something when catch error
    }
  }
  // 统计PV
  ANALYSIS.PVStatistics(state.storeId);

  // this.initializationTime() //初始化预约时间

  state.goodTypeList.forEach((item, idx) => {
    initializationTime(idx); //初始化预约时间
  });
  // 根据门店支持的配送方式显示自提和配送
  if (changeStore) {
    handleDeliveryType(false, editActiveIdx);
    checkOrderProducts(editActiveIdx);
    getAvailableCouponNum(editActiveIdx);
  }
  state.goodTypeList.forEach((item, idx) => {
    checkProductsSellTime(idx); //初始化预约时间
  });
  // this.checkProductsSellTime()
});
function getDeliveryExpressMaxRice () {
  systemService.query('deliveryExpressMaxRice').then(res => {
    if (res && res[0] && res[0].value) {
      state.deliveryExpressMaxRice = Number(res[0].value) ? Number(res[0].value) / 1000 : null;
    } else {
      state.deliveryExpressMaxRice = null;
    }
  }).catch(err => {
    state.deliveryExpressMaxRice = null;
  });
}
onHide(function () { });
onUnload(function () {
  try {
    // 清除缓存数据
    uni.removeStorageSync('wj_orderCardInfo');
    uni.removeStorageSync('wj_addRemarks');
    uni.removeStorageSync('wj_invoice');
    uni.removeStorageSync('wj_chooseCoupon');
    uni.removeStorageSync('wj_chooseCard');
  } catch (error) { }
  const that = this;
  if (state.order && !state.orderPay && !state.orderCancel) {
    // 如果已经创建了订单，点击返回跳转订单详情
    let opts = '?orderId=' + state.order.id + '&orderFrom=shopCart' + (state.multipleOrdersFlag ? '&orderType=MIXED' : '');
    NAVPAGE.toOrderDetails(opts);
  }
});
onPullDownRefresh(function () { });
onReachBottom(function () { });
onShareAppMessage(function () { });
function getGoodsBalance (storeId, idx) {
  const that = this;
  let storeIdIn = [storeId];
  ADDRESS.getDistributionStore().then(res => {
    if (res) {
      storeIdIn.push(res.id);
    }
    handleGroupGoodsBalance(storeIdIn, idx);
  }).catch(err => {
    handleGroupGoodsBalance(storeIdIn, idx);
  });
}
function handleGroupGoodsBalance (storeIdIn, idx) {
  const self = this;
  state.canBuy = false;
  if (state.goodTypeList[idx].goodsList.length > 0) {
    let groupGoods = state.goodTypeList[idx].goodsList[0];
    let postData = {
      page: 1,
      pageSize: 10,
      id: state.goodTypeList[idx].teamBuyId,
      status: 'STARTED',
      // orgIdIn: storeIdIn.join(","),
      storeIds: storeIdIn.join(",")
    };
    teamBuyService.query(postData).then(res => {
      let hasGroup = false;
      let teamBuyingsItem = null;
      if (res && res.records.length > 0) {
        hasGroup = true;
        teamBuyingsItem = res.records[0];
        let storeId = storeIdIn[0];
        if (teamBuyingsItem.business === "DISTRIBUTION" && storeIdIn.length > 1) {
          storeId = storeIdIn[1];
        }
        productService.getDetails(storeId, groupGoods.id).then(res => {
          if (!res) {
            uni.showModal({
              title: '提示',
              content: '您选择的门店未上架该商品，请重新选择门店~',
              confirmText: '修改门店',
              success (res) {
                if (res.confirm) {
                  daata.editActiveIdx = idx;
                  uni.setStorageSync('editActiveIdx', idx);
                  NAVPAGE.toSelectStore();
                } else if (res.cancel) { }
              }
            });
            state.canBuy = false;
            return;
          }
          if (res.balance > 0) {
            state.canBuy = true;
          } else {
            state.canBuy = false;
            uni.showToast({
              title: '门店商品库存不足，无法购买~',
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        state.canBuy = false;
      }
      if (!hasGroup) {
        uni.showModal({
          title: '提示',
          content: '您选择的门店没有该团购活动，请重新选择门店~',
          confirmText: '修改门店',
          success (res) {
            if (res.confirm) {
              daata.editActiveIdx = idx;
              uni.setStorageSync('editActiveIdx', idx);
              NAVPAGE.toSelectStore();
            } else if (res.cancel) { }
          }
        });
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    uni.showToast({
      title: '购物车中没有商品哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function changeStore (e) {
  uni.removeStorageSync('wj_storePickupTime');
  if (e.currentTarget.dataset.idx || e.currentTarget.dataset.idx === 0) {
    state.editActiveIdx = e.currentTarget.dataset.idx || 0;
    uni.setStorageSync('editActiveIdx', e.currentTarget.dataset.idx || 0);
  } else {
    state.orderStoreTip = false;
  }
  NAVPAGE.toSelectStore();
}
function contactStore () {
  let storeInfo = state.storeInfo;
  let tel = '';
  if (storeInfo.tel != null && storeInfo.tel != '') {
    // 判断订单中门店是否有电话
    tel = storeInfo.tel;
  } else {
    // 门店无电话使用公司服务电话
    tel = app.globalData.servicePhone;
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确定要拨打以下电话' + tel,
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel
          });
        }
        if (res.cancel) { }
      }
    });
  }
}
function toChoiceGiftCard () {
  // 清空已选择的礼品卡数据 旧版
  // let productData = encodeURIComponent(JSON.stringify(this.data.goodsList));
  // let opts = '?productData=' + productData + '&storeId=' + this.data.storeInfo.id;
  // if (this.data.orderGiftCard.cardId != null) {
  //     opts = opts + "&cardId=" + this.data.orderGiftCard.cardId;
  // }
  // NAVPAGE.toChoiceGiftCard(opts);

  let productData = encodeURIComponent(JSON.stringify(state.goodsList));
  let allPrice = state.allPrice;
  if (state.isDiscountUsedForGiftCard && (state.orderType == 'normal' || state.orderType == 'distribution')) {
    let keys = state.orderDetailGood ? Object.keys(state.orderDetailGood) : {};
    if (keys.length > 0) {
      allPrice = 0;
      keys.forEach(good => {
        let productNum = 1;
        state.goodsList.some(item => {
          if (item.productId == good) {
            productNum = item.productNum;
          }
          return item.productId == good;
        });
        allPrice += parseFloat(state.orderDetailGood[good].sellPrice * productNum);
      });
    }
  }
  let orderLastPrice = allPrice - (state.isDiscountUsedForGiftCard && (state.orderType == 'normal' || state.orderType == 'distribution') ? state.totalDiscount - state.cashDiscount : state.totalDiscount) + (state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount) - state.shipmentCouponDiscount - state.scoreDiscount;
  // let opts = '?productData=' + productData + '&storeId=' + this.data.storeInfo.id + '&orderLastPrice=' + orderLastPrice;
  let opts = '?storeId=' + state.storeInfo.id + '&orderLastPrice=' + orderLastPrice;
  // 处理当前状态的订单金额，传递到礼品卡界面
  // 已选中过礼品卡
  if (state.orderGiftCard.length > 0) {
    opts = opts + "&cardList=" + JSON.stringify(state.orderGiftCard) + '&orderLastPrice=' + orderLastPrice;
  }
  uni.setStorageSync('selectCard', true);
  NAVPAGE.toChoiceGiftCard(opts);
}
function toChoiceMspCard () {
  // 清空已选择的礼品卡数据
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard?active=1'
  });
}
function getAvailableGiftCardNum () {
  let _userInfo = auth.getUser();
  if (_userInfo && _userInfo.member) {
    let memberId = _userInfo.member.id;
    // giftCardService.queryMyGiftCard('1920322267577856001').then(res => {
    giftCardService.queryMyGiftCard(memberId).then(res => {
      if (res && res.length > 0) {
        let giftCardNum = 0;
        res.forEach(item => {
          // 未激活和使用中为可用 其他都为不可用
          if ((item.state === 'UNACTIVATED' || item.state === 'USING') && !item.excludePromotion && !item.hasCardPayActivity) {
            giftCardNum++;
          }
        });
        state.giftCardNum = giftCardNum;
        state.hasAvailableGiftCard = true;
      } else {
        state.giftCardNum = 0;
        state.hasAvailableGiftCard = false;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  // 老逻辑
  // let tempList = []
  // if (this.data.goodsList.length > 0) {
  //     this.data.goodsList.forEach(item => {
  //         let tempItem = {
  //             productId: item.productId,
  //             productNum: item.productNum
  //         }
  //         tempList.push(tempItem)
  //     })
  //     let postData = {
  //         productIds: tempList,
  //         storeId: this.data.storeId,
  //         memberId: wx.getStorageSync('__user__').member.id
  //     }
  //     this.setData({
  //         hasAvailableGiftCard: true
  //     })
  //     orderService.calculateCard(postData).then(res => {
  //         let count = 0
  //         if (res && res.length > 0) {
  //             res.forEach(item => {
  //                 if (item.useable) {
  //                     count++
  //                 }
  //             })
  //         }
  //         this.setData({
  //             giftCardNum: count,
  //             hasAvailableGiftCard: true
  //         })
  //     }).catch(err => {
  //         wx.showToast({
  //             title: err.message,
  //             icon: 'none',
  //             duration: 2000
  //         })
  //     })
  // }
}
function calcCoupon (couponData) {
  const self = this;
  let editActiveIdx = uni.getStorageSync('editActiveIdx');
  if (state.systemOptions.isBothScoreAndCoupon || !(state.integral && state.integral > 0) && !state.systemOptions.isBothScoreAndCoupon) {
    let shipmentCouponDiscount = 0; // 运费券抵扣金额
    let orderType = editActiveIdx || editActiveIdx === 0 ? state.goodTypeList[editActiveIdx].orderType : state.orderType;
    let cycleFee = editActiveIdx || editActiveIdx === 0 ? state.goodTypeList[editActiveIdx].cycleFee : state.cycleFee;
    let shipmentAmount1 = editActiveIdx || editActiveIdx === 0 ? state.goodTypeList[editActiveIdx].shipmentAmount : state.shipmentAmount;
    const shipmentAmount = orderType === 'CYCLE' ? cycleFee : shipmentAmount1; // 运费
    let freeship = shipmentAmount;
    let couponDiscount = state.couponDiscount;
    let coupons = {
      freeship: [],
      discount: []
    };
    let userChooseCoupon = true;
    let usedCoupons = [];
    if (editActiveIdx || editActiveIdx === 0) {
      state.goodTypeList.forEach((item, index) => {
        if (index != editActiveIdx) {
          if (item.freeshipList && item.freeshipList.length > 0) {
            item.freeshipList.forEach(couponItem => {
              let couponObj = {
                coupon: {
                  function: 'FREESHIP',
                  id: couponItem.couponId
                },
                pushFlag: true,
                service: couponItem.service
              };
              if (!couponData || !couponData.coupons || couponData.coupons.length == 0) {
                couponData = {
                  coupons: [...couponObj],
                  couponType: 'freeship'
                };
              } else if (couponData.couponType === 'freeship') {
                couponData.coupons.push(couponObj);
              }
            });
          }
          if (item.couponList && item.couponList.length > 0) {
            item.couponList.forEach(couponItem => {
              let couponObj = {
                coupon: {
                  function: couponItem.function || 'CASH',
                  id: couponItem.couponId
                },
                pushFlag: true,
                service: couponItem.service
              };
              if (!couponData || !couponData.coupons || couponData.coupons.length == 0) {
                couponData = {
                  coupons: [...couponObj],
                  couponType: 'discount'
                };
              } else if (couponData.couponType !== 'freeship') {
                couponData.coupons.push(couponObj);
              }
            });
          }
        }
      });
    }
    if (couponData.coupons.length > 0) {
      coupons = state.couponInfo.data;
      if (couponData.couponType === 'freeship') {
        coupons.freeship = [];
      } else if (couponData.couponType != 'freeship') {
        coupons.discount = [];
      }
      couponData.coupons.forEach(item => {
        if (couponData.couponType === 'freeship') {
          if (item.coupon.function === "FREESHIP") {
            coupons.freeship.push(item);
          }
        } else if (couponData.couponType != 'freeship') {
          if (item.coupon.function !== "FREESHIP") {
            coupons.discount.push(item);
          }
        }
      });
      if (coupons.freeship && coupons.freeship.length > 0) {
        let freeshipList = [];
        coupons.freeship.forEach(ele => {
          let freeshipData = {};
          state.goodTypeList.some(goodData => {
            if (!goodData.freeshipList || goodData.freeshipList.length == 0) return null;
            return goodData.freeshipList.some(freeshipItem1 => {
              if (freeshipItem1.couponId == ele.coupon.id) {
                freeshipData = {
                  ...freeshipItem1
                };
              }
              return freeshipItem1.couponId == ele.coupon.id;
            });
          });
          let freeshipItem = {
            couponId: ele.coupon.id,
            service: ele.service,
            shipmentType: freeshipData && freeshipData.shipmentType ? freeshipData.shipmentType : editActiveIdx || editActiveIdx === 0 ? state.goodTypeList[editActiveIdx].shipmentType : null,
            shipmentAmount: freeshipData && freeshipData.shipmentAmount ? freeshipData.shipmentAmount : editActiveIdx || editActiveIdx === 0 ? state.goodTypeList[editActiveIdx].shipmentAmount : null
          };
          if (!ele.pushFlag) {
            freeshipList.push({
              ...freeshipItem
            });
          }
          usedCoupons.push({
            ...freeshipItem
          });
        });
        if (editActiveIdx || editActiveIdx === 0) {
          state.goodTypeList[editActiveIdx].freeshipList = freeshipList;
        }
      }
      if (coupons.discount && coupons.discount.length > 0) {
        let couponList = [];
        coupons.discount.forEach(ele => {
          let discountData = {};
          state.goodTypeList.some(goodData => {
            if (!goodData.couponList || goodData.couponList.length == 0) return null;
            return goodData.couponList.some(discountItem1 => {
              if (discountItem1.couponId == ele.coupon.id) {
                discountData = {
                  ...discountItem1
                };
              }
              return discountItem1.couponId == ele.coupon.id;
            });
          });
          let discountItem = {
            couponId: ele.coupon.id,
            service: ele.service
          };
          if (!ele.pushFlag) {
            couponList.push({
              ...discountItem
            });
          }
          usedCoupons.push({
            ...discountItem
          });
        });
        if (editActiveIdx || editActiveIdx === 0) {
          state.goodTypeList[editActiveIdx].couponList = couponList;
        }
      }
    } else {
      userChooseCoupon = false;
      coupons = state.couponInfo.data;
      if (couponData.couponType === 'freeship') {
        shipmentCouponDiscount = 0;
        freeship = shipmentAmount;
        coupons.freeship = [];
        if (editActiveIdx || editActiveIdx === 0) {
          state.goodTypeList[editActiveIdx].freeshipList = [];
          state.goodTypeList[editActiveIdx].shipmentCouponDiscount = 0;
        }
        // self.data.goodTypeList[editActiveIdx].shipmentAmount = shipmentAmount
      } else if (couponData.couponType !== 'freeship') {
        couponDiscount = 0;
        shipmentCouponDiscount = state.shipmentCouponDiscount;
        freeship = state.shipmentRealPay;
        coupons.discount = [];
        if (editActiveIdx || editActiveIdx === 0) {
          state.goodTypeList[editActiveIdx].couponList = [];
          state.goodTypeList[editActiveIdx].couponDiscount = 0;
        }
      }
    }
    state.goodTypeList = state.goodTypeList;
    state.couponInfo = {
      description: '选择优惠券',
      data: coupons,
      useCoupon: true
    };
    state.usedCoupons = usedCoupons;
    state.userChooseCoupon = userChooseCoupon;
    canCalcPromotions = true;
    calcPromotions();
  }
}
function getDistributionStore () {
  const self = this;
  if (app.globalData.distributionStore) {
    handleRes(app.globalData.distributionStore);
  } else {
    storeService.getDistributionStore().then(res => {
      if (res) {
        handleRes(res);
      }
    }).catch(err => {
      console.log(err);
    });
  }
  function handleRes (res) {
    state.goodTypeList.some(item => {
      if (item.orderType == 'distribution') {
        item.storeId = res.id;
        item.storeName = res.name;
        item.storeInfo = res;
        if (!state.multipleOrdersFlag) {
          state.storeId = res.id;
          state.storeName = res.name;
          state.storeInfo = res;
        }
      }
      return item.orderType == 'distribution';
    });
    // 不用计算配送费优惠
    // self.getDistributionFeeRule(res.id)
    state.goodTypeList = state.goodTypeList;
  }
}
function calcPromotions (again) {
  console.log(canCalcPromotions);
  if (!canCalcPromotions || state.orderType === 'advanceSell' || state.orderType === 'solitaire') {
    if (state.orderType === 'advanceSell' && state.advanceisGiftPayment) {
      handleCardBalance();
    }
    return;
  }
  canCalcPromotions = false;
  let postDataList = [];
  let useOriPriceList = [];
  const self = this;
  state.goodTypeList.forEach((item1, index) => {
    if (item1.goodsList && item1.goodsList.length > 0) {
      let products = [];
      item1.goodsList.forEach(item => {
        let tempItem = {
          id: item.productId,
          count: item.productNum
        };
        if (item1.orderType === 'CYCLE') {
          tempItem = {
            ...tempItem,
            cycleFixedId: item1.cycleFixedId,
            business: item1.business
          };
        }
        // 分享人id
        if (item.sharingPersonId) {
          tempItem = {
            ...tempItem,
            sharingPersonId: item.sharingPersonId
          };
        }
        if (item.useOriPrice && useOriPriceList.indexOf(item.productId) == -1) {
          if (again) {
            tempItem.useOriPrice = true;
          }
          useOriPriceList.push(item.productId);
        }
        if (item.groupProducts && item.groupProducts.length > 0) {
          tempItem.cateringOrderDetails = item.groupProducts;
        }
        if (state.scource === 'SHOPPINGCART') {
          tempItem = {
            ...tempItem,
            shoppingCartItemId: item.id
          };
        }
        if (item.newmbrActivityId) {
          tempItem = {
            ...tempItem,
            newmbrActivityId: item.newmbrActivityId
          };
          products.push(tempItem);
        } else if (item.grabActivityId) {
          tempItem = {
            ...tempItem,
            grabActivityId: item.grabActivityId
          };
          products.push(tempItem);
        } else if (item.teamBuyId !== '' && item.teamBuyId != null && item.orderType === "group") {
          tempItem = {
            ...tempItem,
            teamBuyingActivityId: item.teamBuyId
          };
          if (item.teamLeaderRecordId !== "") {
            tempItem = {
              ...tempItem,
              teamLeaderRecordId: item.teamLeaderRecordId
            };
          }
          products.push(tempItem);
        } else if (item.usePromotionPrice) {
          tempItem = {
            ...tempItem,
            usePromotionPrice: true
          };
          products.push(tempItem);
        } else if (item.useMemberPrice) {
          tempItem = {
            ...tempItem,
            useMemberPrice: true
          };
          products.push(tempItem);
        } else {
          products.push(tempItem);
        }
        // 如果该商品有赠品
        if (item.goodsPromotions && item.goodsPromotions.length > 0) {
          item.goodsPromotions.forEach(item => {
            products.push({
              gift: true,
              id: item.goods.uuid,
              count: item.count
            });
          });
        }
      });
      item1.giftGoodsList = item1.giftGoodsList || [];
      item1.giftGoodsList.forEach(item => {
        products.push({
          gift: true,
          productId: item.productId,
          productNum: item.productNum
        });
      });
      let shipmentAmount = 0;
      if (item1.type === "dispatch" || item1.type === 'logistical') {
        // shipmentAmount = self.data.shipmentAmount
        shipmentAmount = item1.orderType === 'CYCLE' ? item1.cycleFee : item1.shipmentAmount;
      }
      let giftCardNoOrders = [];
      let giftCardData = state.orderGiftCard && state.orderGiftCard.length > 0 ? state.orderGiftCard : uni.getStorageSync('wj_chooseCard') || [];
      giftCardData.forEach(item => {
        giftCardNoOrders.push({
          cardNo: item.cardNo
        });
      });
      let list = [];
      if (item1.couponList) {
        list = list.concat(item1.couponList);
      }
      if (item1.freeshipList) {
        list = list.concat(item1.freeshipList);
      }
      let postData = {
        memberId: state.memberInfo.id,
        products: products,
        // 统配商品使用统配门店id
        storeId: item1.storeId,
        usedCoupons: list,
        shipmentAmount: shipmentAmount ? shipmentAmount : null,
        type: item1.orderType === 'CYCLE' ? 'CYCLE' : '',
        goodsList: item1.goodsList
      };
      if (item1.orderType == 'service') {
        postData.type = 'SERVICE';
        postData.serviceStaffId = item1.serviceStaffData.id;
      }
      // if(this.data.multipleOrdersFlag) { // 存在混单数据添加特殊传参
      //   postData.type = 'MIXED'
      // }
      if (index === 0 && state.isDiscountUsedForGiftCard && (item1.orderType == 'normal' || item1.orderType == 'distribution')) {
        postData.giftCardNoOrders = giftCardNoOrders;
      }
      if (cacheOrder) {
        // 收银下单，传入缓存订单id
        postData = {
          ...postData,
          inputAmount: state.inputAmount > 0 ? state.inputAmount : 0
        };
      }
      postDataList.push({
        ...postData
      });
    }
  });
  promotionService.bathCalcPromotions(postDataList).then(res1 => {
    canCalcPromotions = true;
    let allPrice = 0;
    let couponDiscount = 0;
    let shipmentCouponDiscount1 = 0;
    let shipmentAmount1 = 0;
    let shipmentRealPay = 0;
    let totalDiscount = 0;
    if (res1 && res1.length > 0) {
      res1.forEach(item => {
        let goodsList = [];
        let storeId = '';
        let idx = 0;
        state.goodTypeList.some((goodType, index) => {
          if (goodType.storeId == item.storeId) {
            goodsList = [...goodType.goodsList];
            idx = index;
          }
          return goodType.storeId == item.storeId;
        });
        getCalaPromotionFn(item, goodsList, storeId, idx);
      });
      // 重新选择优惠券之后调用接口计算储值余额抵扣
      handleCardBalance();
      // if(self.data.useScore){
      chooseScoreA();
    }
    function getCalaPromotionFn (res, goods, storeId, activeIdx) {
      if (res) {
        let productIdList = res.oriProductList ? res.oriProductList.map(item => item.productId) : [];
        // 深度比较两个数组是否包含相同元素（顺序无关）
        function compareArrays (arr1, arr2) {
          // 基本类型比较
          if (arr1 === arr2) return true;
          if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
          if (arr1.length !== arr2.length) return false;
          // 创建元素频率统计对象
          const frequencyCounter = {};
          // 统计arr1元素频率
          for (let val of arr1) {
            const key = typeof val === 'object' ? JSON.stringify(val) : val;
            frequencyCounter[key] = (frequencyCounter[key] || 0) + 1;
          }
          // 验证arr2元素
          for (let val of arr2) {
            const key = typeof val === 'object' ? JSON.stringify(val) : val;
            if (!frequencyCounter[key]) return false;
            frequencyCounter[key]--;
          }
          return true;
        }
        if ((res.oriProductList && res.oriProductList.length > 0 || !compareArrays(productIdList, useOriPriceList)) && !again) {
          let goodsList = [];
          let allPrice1 = 0;
          if (state.goodTypeList[activeIdx].goodsListAll) {
            state.goodTypeList[activeIdx].goodsListAll.forEach(goods => {
              goods.useOriPrice = false;
              if (productIdList.indexOf(goods.productId) > -1) {
                goods.useOriPrice = true;
                res.oriProductList.some(oriProduct => {
                  if (oriProduct.productId == goods.productId) {
                    if (!goods.oldSellPrice) {
                      goods.oldSellPrice = goods.sellPrice;
                    }
                    goods.sellPrice = oriProduct.originalSellPrice;
                  }
                  return oriProduct.productId == goods.productId;
                });
              }
              if (!goods.useOriPrice && state.orderDetailGood[goods.productId]) {
                goods.sellPrice = goods.oldSellPrice || goods.sellPrice;
              }
            });
            if (state.goodTypeList[activeIdx].goodsList) {
              state.goodTypeList[activeIdx].goodsList.forEach(goods => {
                state.goodTypeList[activeIdx].goodsListAll.some(goods1 => {
                  if (goods.productId == goods1.productId) {
                    goods.sellPrice = goods1.sellPrice;
                    goods.useOriPrice = goods1.useOriPrice;
                    allPrice1 += parseFloat(goods.sellPrice) * parseFloat(goods.productNum);
                  }
                  return goods.productId == goods1.productId;
                });
              });
              goodsList = goodsList.concat(item.goodsList);
              state.goodTypeList[activeIdx].allPrice = allPrice1.toFixed(2);
              allPrice += parseFloat(state.goodTypeList[activeIdx].allPrice);
            }
          }
          state.goodTypeList = state.goodTypeList;
          state.goodsList = goodsList;
          state.allPrice = allPrice.toFixed(2);
          calcPromotions(true);
          return false;
        }
        // 处理运费券
        let shipmentCouponDiscount = res && res.discounts && res.discounts.shipmentDiscount && res.discounts.shipmentDiscount.details.length > 0 ? res.discounts.shipmentDiscount.discount : 0; // 运费抵扣
        if (res.discounts && res.discounts.shipmentDiscount && res.discounts.shipmentDiscount.details.length > 0) {
          let goodTypeShipmentCouponDiscount = 0;
          if (state.goodTypeList[activeIdx].freeshipList && state.goodTypeList[activeIdx].freeshipList.length > 0) {
            state.goodTypeList[activeIdx].freeshipList.forEach(freeshipItem => {
              let freeshipItemCouponId = freeshipItem.couponId;
              res.discounts.shipmentDiscount.details.some(item => {
                if (freeshipItemCouponId == item.couponId) {
                  goodTypeShipmentCouponDiscount += item.discount;
                }
                return freeshipItemCouponId == item.couponId;
              });
            });
          }
          state.goodTypeList[activeIdx].shipmentCouponDiscount = goodTypeShipmentCouponDiscount;
        }
        // 处理运费券不能使用的情况
        if (state.type === "dispatch" && shipmentCouponDiscount === 0 && state.couponInfo.data.freeship && state.couponInfo.data.freeship.length > 0) {
          const freeship = state.couponInfo.data.freeship;
          let usedCoupons = state.usedCoupons;
          for (let i = 0; i < usedCoupons.length; i++) {
            const ele = usedCoupons[i];
            if (ele.couponId === freeship[0].coupon.id) {
              usedCoupons.splice(i, 1);
              break;
            }
          }
          state.couponInfo.data.freeship = [];
        }
        let totalPay = state.goodTypeList[activeIdx].orderType !== 'CYCLE' ? state.goodTypeList[activeIdx].allPrice + state.goodTypeList[activeIdx].shipmentAmount : state.goodTypeList[activeIdx].allPrice + state.goodTypeList[activeIdx].cycleFee;
        let totalPay1 = state.goodTypeList[activeIdx].orderType !== 'CYCLE' ? state.goodTypeList[activeIdx].allPrice : state.goodTypeList[activeIdx].allPrice;
        // 处理优惠券
        let couponDiscount1 = res && res.discounts && res.discounts.couponDiscount && res.discounts.couponDiscount.details.length > 0 ? res.discounts.couponDiscount.discount : 0;
        if (res.discounts && res.discounts.couponDiscount && res.discounts.couponDiscount.details.length > 0) {
          let goodTypeCouponDiscount = 0;
          if (state.goodTypeList[activeIdx].couponList && state.goodTypeList[activeIdx].couponList.length > 0) {
            state.goodTypeList[activeIdx].couponList.forEach(couponItem => {
              let couponItemCouponId = couponItem.couponId;
              res.discounts.couponDiscount.details.some(item => {
                if (couponItemCouponId == item.couponId) {
                  goodTypeCouponDiscount += item.discount;
                }
                return couponItemCouponId == item.couponId;
              });
            });
          }
          state.goodTypeList[activeIdx].couponDiscount = goodTypeCouponDiscount;
        }
        // 处理优惠券不能使用的情况
        if (couponDiscount1 === 0 && state.couponInfo.data.discount && state.couponInfo.data.discount.length > 0) {
          const discount = state.couponInfo.data.discount;
          let usedCoupons = state.usedCoupons;
          for (let i = 0; i < usedCoupons.length; i++) {
            const ele = usedCoupons[i];
            if (ele.couponId === discount[0].coupon.id) {
              usedCoupons.splice(i, 1);
              break;
            }
          }
          // self.setData({
          //     "couponInfo.data.discount": [],
          //     couponDiscount: res && res.discounts ? res.discounts.couponDiscount.discount : null
          //     // couponDiscount: res.data && res.data.discounts ? res.data.discounts.couponDiscount.discount : null
          // })
        }

        // 计算订单抵扣
        // 现金抵扣金额
        let cashDiscount = res && res.discounts && res.discounts.cashDiscount ? res.discounts.cashDiscount.discount : 0;
        let cashDiscountName = res && res.discounts && res.discounts.cashDiscount ? res.discounts.cashDiscount.description : '';
        // 券抵扣金额
        let couponTotal = res && res.discounts && res.discounts.couponDiscount ? res.discounts.couponDiscount.discount : 0;
        couponDiscount += couponTotal > totalPay1 ? totalPay1 : couponTotal;
        let scoreDiscount = res && res.discounts && res.discounts.scoreDiscount ? res.discounts.scoreDiscount.discount : 0;
        shipmentRealPay += Number(state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount) - Number(shipmentCouponDiscount) - Number(state.shipmentDiscount) > 0 ? parseFloat((Number(state.orderType === 'CYCLE' ? state.cycleFee : state.shipmentAmount) - Number(shipmentCouponDiscount) - Number(state.shipmentDiscount)).toFixed(2)) : 0;
        shipmentAmount1 = state.orderType !== 'CYCLE' ? state.shipmentAmount : state.cycleFee;
        shipmentCouponDiscount1 += shipmentCouponDiscount <= shipmentAmount1 ? shipmentCouponDiscount : shipmentAmount1;
        totalDiscount += res && res.discounts ? res.discounts.totalDiscount - couponDiscount + (couponDiscount <= totalPay1 ? couponDiscount : totalPay1) - shipmentCouponDiscount + shipmentCouponDiscount1 : 0;
        state.goodTypeList.forEach(item => {
          item.shipmentRealPay = Number(item.orderType === 'CYCLE' ? item.cycleFee : item.shipmentAmount) - Number(item.shipmentCouponDiscount) - Number(item.shipmentDiscount) > 0 ? parseFloat((Number(item.orderType === 'CYCLE' ? item.cycleFee : item.shipmentAmount) - Number(item.shipmentCouponDiscount) - Number(item.shipmentDiscount)).toFixed(2)) : 0;
        });
        // 计算促销(拼团不参与送商品促销)
        state.goodTypeList = state.goodTypeList;
        state.cashDiscount = cashDiscount;
        state.cashDiscountName = cashDiscountName;
        state.scoreDiscount = scoreDiscount || state.scoreAmount;
        state.scoreAmount = scoreDiscount || state.scoreAmount;
        state.couponDiscount = couponDiscount;
        state.totalDiscount = totalDiscount;
        state.shipmentCouponDiscount = shipmentCouponDiscount1;
        state.shipmentRealPay = shipmentRealPay;
        if (state.orderType !== "group") {
          state.goodsPromotions = res.promotions.goodsPromotions;
          state.couponPromotions = res.promotions.couponPromotions;
          if (res.promotions && res.promotions.goodsPromotions && res.promotions.goodsPromotions.length > 0) {
            goods.forEach(goodItem => {
              goodItem.goodsPromotions = [];
            });
            // 有促销且促销中有送商品促销
            let giftGoods = [];
            res.promotions.goodsPromotions.forEach(it => {
              if (it.goodsRange && it.goodsRange.length === 1) {
                // 指定商品送赠品
                let goodsPromotions = [];
                for (let i = 0; i < goods.length; i++) {
                  const ele = goods[i];
                  if (ele.productId === it.goodsRange[0]) {
                    // goodsPromotions.push(it)
                    // goods[i].goodsPromotions = goodsPromotions;
                    goods[i].goodsPromotions.push(it);
                    break;
                  }
                }
              } else if (it.goodsRange && (it.goodsRange.length === 0 || it.goodsRange.length > 1)) {
                giftGoods.push({
                  giftProduct: true,
                  productId: it.goods.uuid,
                  productNum: it.count,
                  name: it.goods.name,
                  image: it.goods.image
                });
              } else {
                giftGoods.push({
                  giftProduct: true,
                  productId: it.goods.uuid,
                  productNum: it.count,
                  name: it.goods.name,
                  image: it.goods.image
                });
              }
            });
            let goodsPromotions = [];
            state.goodTypeList[activeIdx].goodsList.forEach(item => {
              goods.some(good => {
                if (good.productId == item.productId && good.goodsPromotions && good.goodsPromotions.length > 0) {
                  goodsPromotions = goodsPromotions.concat(good.goodsPromotions);
                }
                return good.productId == item.productId;
              });
            });
            state.goodTypeList[activeIdx].goodsPromotions = goodsPromotions;
            state.goodTypeList = state.goodTypeList;
            state.goodsList = goods;
            state.giftGoodsList = giftGoods;
          }
        }
        //                 }
      }
    }
  }).catch(e => {
    // 重新选择优惠券之后调用接口计算储值余额抵扣
    handleCardBalance();
    // if(self.data.useScore){
    chooseScoreA();
    // }
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
    canCalcPromotions = true;
  });
}
function applyShipment (shipmentTypes, idx) {
  console.log('shipmentTypes', shipmentTypes, idx);
  let optionalShipmentType = state.goodTypeList[idx].optionalShipmentType;
  if (state.goodTypeList[idx].orderType === "advanceSell" || state.goodTypeList[idx].orderType === "group" || true) {
    let keys = Object.keys(optionalShipmentType);
    keys.forEach(shipmentTypeItem => {
      if ((state.goodTypeList[idx].storeInfo.shipmentTypes.indexOf(shipmentTypeItem) == -1 || shipmentTypes.indexOf(shipmentTypeItem) == -1) && optionalShipmentType[shipmentTypeItem]) {
        optionalShipmentType[shipmentTypeItem] = false;
      }
    });
    state.goodTypeList[idx].optionalShipmentType = optionalShipmentType;
    // if(!this.data.goodTypeList[idx].optionalShipmentType.SELF && this.data.goodTypeList[idx].optionalShipmentType.EXPRESS) {
    //   this.data.goodTypeList[idx].type = 'dispatch';
    //   this.data.goodTypeList[idx].shipmentType = 'EXPRESS';
    // } else if(!this.data.goodTypeList[idx].optionalShipmentType.SELF && this.data.goodTypeList[idx].optionalShipmentType.LOGISTICAL) {
    //   this.data.goodTypeList[idx].type = 'dispatch';
    //   this.data.goodTypeList[idx].shipmentType = 'logistical';
    // }
    state.goodTypeList = state.goodTypeList;
    state.optionalShipmentType = optionalShipmentType;
  }
}
function handleDeliveryType (maintainFlag, idx) {
  const self = this;
  let shipmentTypes = [];
  idx = idx || 0;
  // 非周期购配送方式
  if (state.goodTypeList[idx].orderType !== "CYCLE") {
    // 团购和预售用活动的配送方式
    if (state.goodTypeList[idx].orderType === "group") {
      shipmentTypes = state.goodTypeList[idx].shipmentType;
    } else if (state.goodTypeList[idx].orderType === "advanceSell") {
      shipmentTypes = state.goodTypeList[idx].advanceSellInfo.shipmentType;
    } else {
      // 其他用门店的配送方式
      shipmentTypes = state.goodTypeList[idx].isDistributionOrder ? app.globalData.distributionStore && app.globalData.distributionStore.shipmentTypes ? app.globalData.distributionStore.shipmentTypes.split(',') : [] : typeof state.goodTypeList[idx].storeInfo.shipmentTypes == 'string' ? state.goodTypeList[idx].storeInfo.shipmentTypes.split(',') : state.goodTypeList[idx].storeInfo.shipmentTypes;
      if (!state.goodTypeList[idx].storeInfo.shipmentTypes || state.goodTypeList[idx].storeInfo.shipmentTypes.length == 0) {
        shipmentTypes = state.goodTypeList[idx].isDistributionOrder ? app.globalData.distributionStore && app.globalData.distributionStore.shipmentTypes ? app.globalData.distributionStore.shipmentTypes.split(',') : [] : app.globalData.storeInfo.shipmentTypes;
      }
    }
    // 拼团和预售配送方式 处理成 商品，门店，活动的交集
    applyShipment(shipmentTypes, idx);
  } else {
    // 周期购配送方式
    shipmentTypes = state.goodTypeList[idx].cycleDetails.shipmentType.split(',');
  }

  // let shipmentTypes = this.data.orderType !== "CYCLE" ? this.data.storeInfo.shipmentTypes : self.data.cycleDetails.shipmentType.split(',')
  let canDelivery = false;
  let canSelfmention = false;
  let shipmentList = [];
  if (!app.globalData.uiconfig || !app.globalData.uiconfig.shipmentSortList || app.globalData.uiconfig.shipmentSortList.length == 0) {
    if (app.globalData.uiconfig) {
      app.globalData.uiconfig.shipmentSortList = ["SELF", "EXPRESS", "LOGISTICAL"];
    } else {
      app.globalData.uiconfig = {
        shipmentSortList: ["SELF", "EXPRESS", "LOGISTICAL"]
      };
    }
  }
  //处理排序问题
  for (const key in app.globalData.uiconfig.shipmentSortList) {
    if (app.globalData.uiconfig.shipmentSortList.hasOwnProperty(key)) {
      // app.globalData.uiconfig.shipmentSortList[key] == 'MERCHANT_DISTRIBUTION'? 'EXPRESS' : 
      const value = app.globalData.uiconfig.shipmentSortList[key];
      if (value === "TAKEMEALNOW") {
        continue;
      }
      if (state.goodTypeList[idx].isDistributionOrder) {
        //统配
        //排除配送
        if (value === "EXPRESS") {
          continue;
        }
      } else {
        //排除门店不支持的外送方式（快递或者外送）
        if ((value === "LOGISTICAL" || value === "EXPRESS") && shipmentTypes.indexOf(value) < 0) {
          continue;
        }
      }
      if (state.goodTypeList[idx].orderType !== "CYCLE") {
        shipmentList.push(value);
      } else {
        let cycleShipmentType = state.goodTypeList[idx].cycleDetails.shipmentType.split(',');
        if (cycleShipmentType.includes(value)) {
          shipmentList.push(value);
        }
      }
    }
  }
  if (cacheOrder) {
    // 收银只支持自提
    shipmentList = ["SELF"];
  }
  //判断是否支持配送或者快递
  if (shipmentList.indexOf('EXPRESS') >= 0 || shipmentList.indexOf('LOGISTICAL') >= 0) {
    canDelivery = true;
  }
  if (shipmentList.indexOf('SELF') >= 0) {
    canSelfmention = true;
  }

  // 配送方式顺序
  state.goodTypeList[idx].shipmentSortList = shipmentList;
  state.goodTypeList = state.goodTypeList;
  state.shipmentSortList = shipmentList;
  let firstType = state.goodTypeList[idx].shipmentSortList[0];
  // advanceSell预售 
  if (state.goodTypeList[idx].orderType === "advanceSell" && state.goodTypeList[idx].advanceSellInfo.shipmentType) {
    if (state.goodTypeList[idx].advanceSellInfo.shipmentType === "EXPRESS") {
      let advanceSellShipmentList = [];
      let type = "dispatch";
      if (shipmentTypes.indexOf('EXPRESS') >= 0) {
        advanceSellShipmentList.push("EXPRESS");
      }
      if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
        if (advanceSellShipmentList.length === 0) {
          type = "logistical";
        }
        advanceSellShipmentList.push("LOGISTICAL");
      }
      state.goodTypeList[idx].shipmentSortList = advanceSellShipmentList.length > 0 ? advanceSellShipmentList : ["EXPRESS"];
      state.goodTypeList[idx].type = type;
      state.goodTypeList = state.goodTypeList;
      state.shipmentSortList = advanceSellShipmentList.length > 0 ? advanceSellShipmentList : ["EXPRESS"];
      state.type = type;
    } else {
      // 预售支持自提和快递，需要排除门店的配送 (改预售支持外送)
      // let i = null
      // shipmentList.forEach((ele, index) => {
      //     if (ele === "EXPRESS") {
      //         i = index
      //     }
      // })
      // if (i || i === 0) {
      //     shipmentList.splice(i, 1)
      // }
      console.log(shipmentList, firstType, 'shipmentSortList');
      state.goodTypeList[idx].shipmentSortList = shipmentList;
      let type = "";
      let selectFlag = false;
      state.goodTypeList[idx].shipmentSortList.forEach(sortItem => {
        if (state.goodTypeList[idx].optionalShipmentType[sortItem] && !selectFlag) {
          if (sortItem == 'SELF') {
            type = 'selftake';
          } else if (sortItem == 'EXPRESS') {
            type = 'dispatch';
          } else if (sortItem == 'LOGISTICAL') {
            type = 'logistical';
          }
          selectFlag = true;
        }
      });
      state.goodTypeList[idx].type = type;
      state.goodTypeList = state.goodTypeList;
      state.shipmentSortList = shipmentList;
      state.type = type;
    }
  } else {
    if ((firstType === "LOGISTICAL" || firstType === "EXPRESS") && canDelivery) {
      let type = 'dispatch';
      if (firstType === "LOGISTICAL") {
        type = 'logistical';
      }
      if (state.goodTypeList[idx].orderType !== "CYCLE" && state.goodTypeList[idx].optionalShipmentType['LOGISTICAL'] && !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
        type = 'logistical';
      }
      if (!maintainFlag || !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
        state.goodTypeList[idx].type = type;
        state.goodTypeList[idx].shipmentType = firstType;
        state.goodTypeList = state.goodTypeList;
        state.type = type;
      }
    } else if (firstType === "SELF" && canSelfmention) {
      if (state.goodTypeList[idx].isDistributionOrder) {
        // 排除统配订单
        let type = 'dispatch';
        if (shipmentTypes.indexOf('EXPRESS') >= 0) {
          type = 'dispatch';
        } else if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
          type = 'logistical';
        }
        if (state.goodTypeList[idx].orderType !== "CYCLE" && state.goodTypeList[idx].optionalShipmentType['LOGISTICAL'] && !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
          type = 'logistical';
        }
        if (!maintainFlag || !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
          state.goodTypeList[idx].type = type;
          state.goodTypeList = state.goodTypeList;
          state.type = type;
        }
      } else {
        let selectFlag = false;
        let type = 'selftake';
        if (state.goodTypeList[idx].orderType !== "CYCLE") {
          state.goodTypeList[idx].shipmentSortList.forEach(sortItem => {
            if (state.goodTypeList[idx].optionalShipmentType[sortItem] && !selectFlag) {
              if (sortItem == 'SELF') {
                type = 'selftake';
              } else if (sortItem == 'EXPRESS') {
                type = 'dispatch';
              } else if (sortItem == 'LOGISTICAL') {
                type = 'logistical';
              }
              selectFlag = true;
            }
          });
        }
        if (!maintainFlag || !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
          state.goodTypeList[idx].type = type;
          state.goodTypeList = state.goodTypeList;
          state.type = type;
        }
      }
    } else if (firstType === "SELF" && !canSelfmention) {
      let type = 'dispatch';
      if (shipmentTypes.indexOf('EXPRESS') >= 0) {
        type = 'dispatch';
      } else if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
        type = 'logistical';
      }
      if (state.goodTypeList[idx].orderType !== "CYCLE" && state.goodTypeList[idx].optionalShipmentType['LOGISTICAL'] && !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
        type = 'logistical';
      }
      if (!maintainFlag || !state.goodTypeList[idx].optionalShipmentType['EXPRESS']) {
        state.goodTypeList[idx].type = type;
        state.goodTypeList = state.goodTypeList;
        state.type = type;
      }
    }
  }
  if (state.goodTypeList[idx].orderType !== "CYCLE" && state.goodTypeList[idx].goodsListAll && state.goodTypeList[idx].goodsListAll.length > 0) {
    let goodsList = [];
    let notGoodsList = [];
    let goodsNum = 0;
    let notGoodsNum = 0;
    let allPrice = 0;
    let shipmentTypeObj = {
      'selftake': 'SELF',
      'dispatch': 'EXPRESS',
      'logistical': 'LOGISTICAL'
    };
    state.goodTypeList[idx].shipmentType = shipmentTypeObj[state.goodTypeList[idx].type] || state.goodTypeList[idx].shipmentType;
    state.goodTypeList[idx].goodsListAll.forEach(item => {
      if (item && (!item.shipmentType || item.shipmentType.indexOf(shipmentTypeObj[state.goodTypeList[idx].type] || state.goodTypeList[idx].shipmentType) > -1)) {
        goodsNum += item.productNum;
        allPrice += parseFloat(parseFloat(item.productNum) * parseFloat(item.sellPrice));
        goodsList.push(item);
      } else if (item) {
        notGoodsList.push(item);
        notGoodsNum += item.productNum;
      }
    });
    state.goodTypeList[idx].notGoodsList = notGoodsList;
    state.goodTypeList[idx].goodsList = goodsList;
    state.goodTypeList[idx].allPrice = parseFloat(allPrice.toFixed(2));
    state.goodTypeList[idx].goodsNum = goodsNum;
    state.goodTypeList[idx].notGoodsNum = notGoodsNum;
  }
  let allPrice = 0;
  let goodsList = [];
  state.goodTypeList.forEach(item => {
    allPrice += parseFloat(item.allPrice || 0);
    goodsList = goodsList.concat(item.goodsList || []);
  });
  state.goodTypeList = state.goodTypeList;
  state.allPrice = parseFloat(allPrice.toFixed(2));
  state.goodsList = goodsList;
  if (state.goodTypeList[idx].orderType === "CYCLE") {
    checkDistribution(idx);
  }
  // if (this.data.orderType === "CYCLE" && this.data.cycleDetails.shipmentType) {
  //   let cycleShipmentType = self.data.cycleDetails.shipmentType.split(',')
  //   this.setData({
  //     shipmentSortList: cycleShipmentType
  //   })
  // } 
  // let shipmentType = '';
  // if(self.data.goodTypeList[idx].type == 'selftake') {
  //   shipmentType = 'SELF'
  // } else if(self.data.goodTypeList[idx].type == 'dispatch') {
  //   shipmentType = 'EXPRESS'
  // } else if(self.data.goodTypeList[idx].type == 'logistical') {
  //   shipmentType = 'LOGISTICAL'
  // }
  // let availableGoods = [];
  // let notAvailableGoods = [];
  // if(shipmentType != '') {
  //   self.data.goodTypeList[idx].notAvailableGoods = self.data.goodTypeList[idx].notAvailableGoods || [];
  //   self.data.goodTypeList[idx].notAvailableGoods.forEach(goodsData => {
  //     goodsData.availableFlag = !goodsData.shipmentType || goodsData.shipmentType.indexOf(shipmentType) > -1
  //     if(!goodsData.shipmentType || goodsData.shipmentType.indexOf(shipmentType) > -1) {
  //       availableGoods.push(goodsData)
  //     } else {
  //       notAvailableGoods.push(goodsData)
  //     }
  //   })
  //   self.data.goodTypeList[idx].goodsList.forEach(goodsData => {
  //     goodsData.availableFlag = !goodsData.shipmentType || goodsData.shipmentType.indexOf(shipmentType) > -1
  //     if(!goodsData.shipmentType || goodsData.shipmentType.indexOf(shipmentType) > -1) {
  //       availableGoods.push(goodsData)
  //     } else {
  //       notAvailableGoods.push(goodsData)
  //     }
  //   })
  //   let allPrice = 0;
  //   availableGoods.forEach(item => {
  //     if(item.availableFlag) {
  //       allPrice += parseFloat(parseFloat(item.sellPrice || 0) * parseFloat(item.productNum || 0))
  //     }
  //   })
  //   self.data.goodTypeList[idx].allPrice = allPrice
  //   self.data.goodTypeList[idx].notAvailableGoods = notAvailableGoods
  //   self.data.goodTypeList[idx].goodsList = availableGoods
  // }
  state.goodTypeList[idx].canDelivery = canDelivery;
  state.goodTypeList[idx].canSelfmention = canSelfmention;
  state.goodTypeList = state.goodTypeList;
  state.canDelivery = canDelivery;
  state.canSelfmention = canSelfmention;
}
function handleReduce (e) {
  const that = this;
  const idx = e.currentTarget.dataset.idx;
  state.editActiveIdx = idx;
  uni.setStorageSync('editActiveIdx', idx);
  let list = state.goodTypeList[idx].goodsList;
  const productId = e.currentTarget.dataset.id;
  const teamMemberJoinCount = state.goodTypeList[idx].orderType === 'group' ? state.goodTypeList[idx].teamBuyInfo.teamMemberJoinCount : 1;
  const minQty = state.goodTypeList[idx].secKillInfo && state.goodTypeList[idx].secKillInfo.minQty;
  let allPrice = state.goodTypeList[idx].allPrice;
  let noChange = false;
  list.forEach(item => {
    if (item.id === productId) {
      if (item.productNum <= teamMemberJoinCount) {
        uni.showToast({
          title: '该商品不能再减少了哦~',
          icon: 'none',
          duration: 2000
        });
        noChange = true;
      } else if (state.goodTypeList[idx].orderType === 'secondkill' && minQty && item.productNum <= minQty || item.initialPurchaseNumber && item.initialPurchaseNumber >= item.productNum) {
        uni.showToast({
          title: '最少购买' + (state.goodTypeList[idx].orderType === 'secondkill' ? minQty : item.initialPurchaseNumber) + '件',
          icon: 'none',
          duration: 2000
        });
        noChange = true;
      } else {
        item.productNum = item.productNum - teamMemberJoinCount;
        allPrice = (item.sellPrice * item.productNum).toFixed(2);
      }
    }
  });
  state.goodTypeList[idx].allPrice = parseFloat(allPrice);
  state.goodTypeList[idx].goodsList = list;
  let allPrice1 = 0;
  let goodsList = [];
  state.goodTypeList.forEach(item => {
    let goodsNum = 0;
    allPrice1 += parseFloat(Number(item.allPrice));
    goodsList = goodsList.concat(item.goodsList || []);
    if (item.goodsList && item.goodsList.length > 0) {
      item.goodsList.forEach(goods => {
        goodsNum += parseInt(goods.productNum);
      });
    }
    item.goodsNum = goodsNum || 0;
  });
  state.goodTypeList = state.goodTypeList;
  state.allPrice = allPrice1.toFixed(2);
  state.goodsList = goodsList;
  if (!noChange) {
    calcPromotions();
    if (state.addressInfo) {
      // console.log('5382calcDistance')
      calcDistance(state.addressInfo, idx);
    }
    getAvailableCouponNum();
    if (state.goodTypeList[idx].type === "dispatch") {
      checkDistributionFeeRule(idx);
      checkDistribution(idx);
    }
  }
}
function handleAdd (e) {
  const that = this;
  const idx = e.currentTarget.dataset.idx;
  state.editActiveIdx = idx;
  uni.setStorageSync('editActiveIdx', idx);
  let list = state.goodTypeList[idx].goodsList;
  const productId = e.currentTarget.dataset.id;
  const teamMemberJoinCount = state.goodTypeList[idx].orderType === 'group' ? state.goodTypeList[idx].teamBuyInfo.teamMemberJoinCount : 1;
  let orderLimitCount = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'secondkill') {
    orderLimitCount = state.goodTypeList[idx].secKillInfo.limitCount;
  } else if (state.goodTypeList[idx].orderType === 'group') {
    orderLimitCount = state.goodTypeList[idx].teamBuyInfo.orderLimitCount;
  } else if (state.goodTypeList[idx].orderType === 'solitaire') {
    orderLimitCount = state.goodTypeList[idx].solitaireInfo.memberLimit;
  }
  let balance = Number.POSITIVE_INFINITY;
  let activityBalance = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'solitaire') {
    balance = state.goodTypeList[idx].solitaireInfo.balance;
    activityBalance = state.goodTypeList[idx].solitaireInfo.solitaireBalance;
  }
  console.log('orderLimitCount', orderLimitCount);
  let yunactive = true;
  let allPrice = state.goodTypeList[idx].allPrice;
  list.forEach(item => {
    if (item.id === productId) {
      if (item.productNum >= balance || item.productNum >= activityBalance) {
        if (item.productNum >= orderLimitCount && orderLimitCount) {
          uni.showToast({
            title: '亲，' + item.name + '每单限购' + orderLimitCount + '个哦~',
            icon: 'none',
            duration: 2000
          });
          yunactive = false;
        } else {
          let text = '亲，' + item.name + "门店仅剩" + balance + "件~";
          if (balance > activityBalance) {
            if (item.productNum >= balance) {
              // 提示门店库存不足
            } else if (item.productNum >= activityBalance && item.productNum < balance) {
              // 提示活动库存不足
              text = '亲，' + item.name + "活动仅剩" + activityBalance + "件~";
            }
            yunactive = false;
          } else {
            // 活动库存比门店库存大
            // 提示门店库存不足
          }
          util.showToast(text);
        }
      } else {
        if (item.productNum >= orderLimitCount && orderLimitCount) {
          uni.showToast({
            title: '亲，' + item.name + '每单限购' + orderLimitCount + '个哦~',
            icon: 'none',
            duration: 2000
          });
          yunactive = false;
        } else if (item.personLimitQuantity && item.productNum + 1 > item.personLimitQuantity) {
          uni.showToast({
            title: '亲，' + item.name + '限购' + item.personLimitQuantity + '个哦~',
            icon: 'none',
            duration: 2000
          });
        } else {
          item.productNum = parseFloat(item.productNum) + teamMemberJoinCount;
          allPrice = (item.sellPrice * item.productNum).toFixed(2);
        }
      }
    }
  });
  state.goodTypeList[idx].allPrice = parseFloat(allPrice);
  state.goodTypeList[idx].goodsList = list;
  let allPrice1 = 0;
  let goodsList = [];
  state.goodTypeList.forEach(item => {
    let goodsNum = 0;
    allPrice1 += parseFloat(Number(item.allPrice));
    goodsList = goodsList.concat(item.goodsList || []);
    if (item.goodsList && item.goodsList.length > 0) {
      item.goodsList.forEach(goods => {
        goodsNum += parseInt(goods.productNum);
      });
    }
    item.goodsNum = goodsNum || 0;
  });
  state.goodTypeList = state.goodTypeList;
  state.allPrice = allPrice1.toFixed(2);
  state.goodsList = goodsList;
  if (yunactive) {
    if (state.addressInfo) {
      // console.log('25468calcDistance')
      calcDistance(state.addressInfo, idx);
    }
  }
  calcPromotions();
  getAvailableCouponNum();
  if (state.goodTypeList[idx].type === "dispatch") {
    checkDistributionFeeRule(idx);
    checkDistribution(idx);
  }
}
function handleNumber (e) {
  const that = this;
  const idx = e.currentTarget.dataset.idx;
  state.editActiveIdx = idx;
  uni.setStorageSync('editActiveIdx', idx);
  let list = state.goodTypeList[idx].goodsList;
  const productId = e.currentTarget.dataset.id;
  let _data2 = null;
  list.forEach(item => {
    if (item.id === productId) {
      _data2 = item;
    }
  });
  if (_data2) {
    state.goodsInfo = _data2;
    if (state.goodTypeList[idx].type === "dispatch" || state.goodTypeList[idx].type === "logistical") {
      checkDistribution(idx);
    }
    toggleNumberPopup();
  }
}
function handleProductNumAdd () {
  const that = this;
  let goodsInfo = state.goodsInfo;
  let idx = state.editActiveIdx;
  const teamMemberJoinCount = state.goodTypeList[idx].orderType === 'group' ? state.goodTypeList[idx].teamBuyInfo.teamMemberJoinCount : 1;
  let orderLimitCount = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'secondkill') {
    orderLimitCount = state.goodTypeList[idx].secKillInfo.limitCount;
  } else if (state.goodTypeList[idx].orderType === 'group') {
    orderLimitCount = state.goodTypeList[idx].teamBuyInfo.orderLimitCount;
  } else if (state.goodTypeList[idx].orderType === 'solitaire') {
    orderLimitCount = state.goodTypeList[idx].solitaireInfo.memberLimit;
  }
  let balance = Number.POSITIVE_INFINITY;
  let activityBalance = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'solitaire') {
    balance = state.goodTypeList[idx].solitaireInfo.balance;
    activityBalance = state.goodTypeList[idx].solitaireInfo.solitaireBalance;
  }
  if (goodsInfo.productNum >= balance || goodsInfo.productNum >= activityBalance) {
    if (goodsInfo.productNum >= orderLimitCount) {
      uni.showToast({
        title: '亲，' + goodsInfo.name + '每单限购' + orderLimitCount + '个哦~',
        icon: 'none',
        duration: 2000
      });
    } else {
      let text = '亲，' + goodsInfo.name + "门店仅剩" + balance + "件~";
      if (balance > activityBalance) {
        if (goodsInfo.productNum >= balance) {
          // 提示门店库存不足
        } else if (goodsInfo.productNum >= activityBalance && goodsInfo.productNum < balance) {
          // 提示活动库存不足
          text = '亲，' + goodsInfo.name + "活动仅剩" + activityBalance + "件~";
        }
      } else {
        // 活动库存比门店库存大
        // 提示门店库存不足
      }
      util.showToast(text);
    }
  } else {
    if (goodsInfo.productNum >= orderLimitCount) {
      uni.showToast({
        title: '亲，' + goodsInfo.name + '每单限购' + orderLimitCount + '个哦~',
        icon: 'none',
        duration: 2000
      });
    } else {
      goodsInfo.productNum = parseFloat(goodsInfo.productNum) + parseFloat(teamMemberJoinCount);
    }
  }
  if (goodsInfo.personLimitQuantity && goodsInfo.productNum > goodsInfo.personLimitQuantity) {
    goodsInfo.productNum = goodsInfo.personLimitQuantity;
    uni.showToast({
      title: '亲，' + goodsInfo.name + '限购' + goodsInfo.personLimitQuantity + '个哦~',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
  state.goodsInfo = goodsInfo;
  if (state.goodTypeList[idx].type === "dispatch" || state.goodTypeList[idx].type === "logistical") {
    checkDistributionFeeRule(idx);
    checkDistribution(idx);
  }
}
function handleProductNumReduce () {
  const that = this;
  let idx = state.editActiveIdx;
  let goodsInfo = state.goodsInfo;
  const teamMemberJoinCount = state.goodTypeList[idx].orderType === 'group' ? state.goodTypeList[idx].teamBuyInfo.teamMemberJoinCount : 1;
  const minQty = state.goodTypeList[idx].secKillInfo && state.goodTypeList[idx].secKillInfo.minQty;
  if (goodsInfo.productNum <= teamMemberJoinCount) {
    uni.showToast({
      title: '该商品不能再减少了哦~',
      icon: 'none',
      duration: 2000
    });
  } else if (state.goodTypeList[idx].orderType === 'secondkill' && minQty && goodsInfo.productNum <= minQty) {
    uni.showToast({
      title: '最少购买' + minQty + '件',
      icon: 'none',
      duration: 2000
    });
  } else {
    goodsInfo.productNum = goodsInfo.productNum - teamMemberJoinCount;
  }
  state.goodsInfo = goodsInfo;
  if (state.goodTypeList[idx].type === "dispatch") {
    checkDistributionFeeRule(idx);
    checkDistribution(idx);
  }
}
function onCancel (e) {
  const that = this;
  state.goodsInfo = null;
  state.canBuy = true;
  toggleNumberPopup();
}
function onConfirm (e) {
  const that = this;
  let idx = state.editActiveIdx;
  let list = state.goodTypeList[idx].goodsList;
  const goodsInfo = state.goodsInfo;
  const teamMemberJoinCount = state.goodTypeList[idx].orderType === 'group' ? state.goodTypeList[idx].teamBuyInfo.teamMemberJoinCount : 1;
  let orderLimitCount = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'secondkill') {
    orderLimitCount = state.goodTypeList[idx].secKillInfo.limitCount;
  } else if (state.goodTypeList[idx].orderType === 'group') {
    orderLimitCount = state.goodTypeList[idx].teamBuyInfo.orderLimitCount;
  } else if (state.goodTypeList[idx].orderType === 'solitaire') {
    orderLimitCount = state.goodTypeList[idx].solitaireInfo.memberLimit;
  }
  let balance = Number.POSITIVE_INFINITY;
  let activityBalance = Number.POSITIVE_INFINITY;
  if (state.goodTypeList[idx].orderType === 'solitaire') {
    balance = state.goodTypeList[idx].solitaireInfo.balance;
    activityBalance = state.goodTypeList[idx].solitaireInfo.solitaireBalance;
  }
  if (goodsInfo.personLimitQuantity && goodsInfo.productNum > goodsInfo.personLimitQuantity) {
    goodsInfo.productNum = goodsInfo.personLimitQuantity;
    uni.showToast({
      title: '亲，' + goodsInfo.name + '限购' + goodsInfo.personLimitQuantity + '个哦~',
      icon: 'none',
      duration: 2000
    });
    state.goodsInfo = goodsInfo;
    return false;
  }
  if (goodsInfo.initialPurchaseNumber && goodsInfo.productNum < goodsInfo.initialPurchaseNumber) {
    goodsInfo.productNum = goodsInfo.initialPurchaseNumber;
    uni.showToast({
      title: '最少购买' + goodsInfo.initialPurchaseNumber + '件',
      icon: 'none',
      duration: 2000
    });
    state.goodsInfo = goodsInfo;
    return false;
  }
  const minQty = state.goodTypeList[idx].secKillInfo && state.goodTypeList[idx].secKillInfo.minQty;
  if (state.goodTypeList[idx].orderType === 'secondkill' && minQty && goodsInfo.productNum < minQty) {
    goodsInfo.productNum = minQty;
    uni.showToast({
      title: '最少购买' + minQty + '件',
      icon: 'none',
      duration: 2000
    });
    state.goodsInfo = goodsInfo;
    return false;
  }
  if (goodsInfo.productNum >= balance || goodsInfo.productNum >= activityBalance) {
    if (goodsInfo.productNum >= orderLimitCount) {
      uni.showToast({
        title: '亲，' + goodsInfo.name + '每单限购' + orderLimitCount + '个哦~',
        icon: 'none',
        duration: 2000
      });
    } else {
      let text = '亲，' + goodsInfo.name + "门店仅剩" + balance + "件~";
      if (balance > activityBalance) {
        if (goodsInfo.productNum >= balance) {
          // 提示门店库存不足
        } else if (goodsInfo.productNum >= activityBalance && goodsInfo.productNum < balance) {
          // 提示活动库存不足
          text = '亲，' + goodsInfo.name + "活动仅剩" + activityBalance + "件~";
        }
      } else {
        // 活动库存比门店库存大
        // 提示门店库存不足
      }
      util.showToast(text);
      return;
    }
  }
  if (goodsInfo.productNum > orderLimitCount) {
    util.showToast('亲，' + goodsInfo.name + '每单限购' + orderLimitCount + '个哦~');
    return;
  } else if (goodsInfo.productNum < teamMemberJoinCount) {
    util.showToast('亲，' + goodsInfo.name + '每单最少购买' + teamMemberJoinCount + '个哦~');
    return;
  } else if (goodsInfo.productNum % teamMemberJoinCount !== 0) {
    util.showToast('亲，' + goodsInfo.name + '每单购买数量需是' + teamMemberJoinCount + '的倍数哦~');
    return;
  }
  let allPrice = state.goodTypeList[idx].allPrice;
  list.forEach((item, index) => {
    if (item.id === goodsInfo.id) {
      list[index] = goodsInfo;
      list[index].productNum = parseFloat(goodsInfo.productNum);
    }
  });
  allPrice = (goodsInfo.sellPrice * goodsInfo.productNum).toFixed(2);
  state.goodTypeList[idx].allPrice = parseFloat(allPrice);
  state.goodTypeList[idx].goodsList = list;
  let allPrice1 = 0;
  let goodsList = [];
  state.goodTypeList.forEach(item => {
    let goodsNum = 0;
    allPrice1 += parseFloat(Number(item.allPrice));
    goodsList = goodsList.concat(item.goodsList || []);
    if (item.goodsList && item.goodsList.length > 0) {
      item.goodsList.forEach(goods => {
        goodsNum += parseInt(goods.productNum);
      });
    }
    item.goodsNum = goodsNum || 0;
  });
  // that.setData({
  //     allPrice: allPrice,
  //     goodsList: list
  // })
  state.goodTypeList = state.goodTypeList;
  state.allPrice = allPrice1.toFixed(2);
  state.goodsList = goodsList;
  toggleNumberPopup();
  calcPromotions();
  if (state.addressInfo) {
    // console.log('5715calcDistance')
    calcDistance(state.addressInfo, idx);
  }
  getAvailableCouponNum();
  if (state.goodTypeList[idx].type === "dispatch") {
    checkDistributionFeeRule(idx);
    checkDistribution(idx);
  }
}
function bindProductNumInput (e) {
  let goodsInfo = state.goodsInfo;
  let number = e.detail.value;
  state.goodsInfo = {
    ...goodsInfo,
    productNum: number
  };
}
function toggleNumberPopup () {
  toggle('number');
}
function handleContinuePay (e) {
  state.canBuy = e.detail;
}
function handleOrderCancel (e) {
  state.orderCancel = e.detail;
  state.unpaidShow = false;
}
function handleOrderPay (e) {
  state.orderPay = e.detail;
}
function loadingChange (customLoading) {
  state.customLoading = customLoading;
}
function viewMore () {
  state.showMore = !state.showMore;
}
function checkOrderProducts (idx = 0) {
  const self = this;
  state.checkedProducts = state.goodTypeList[idx].orderType === "nextDay" || false;
  if (state.scource === "SHOPPINGCART" && (state.goodTypeList[idx].orderType === "normal" || state.goodTypeList[idx].orderType === "secondkill")) {
    // 重新查询购物车
    let tempPrice = 0;
    let needCalcPromotions = false;
    let goodsList = state.goodTypeList[idx].goodsList;
    console.log('goodsListgetCatering', goodsList);
    shopcartService.getCatering(state.goodTypeList[idx].storeId).then(res => {
      let expiredGoodsList = [];
      goodsList.forEach((item, index) => {
        for (let i = 0; i < res.items.length; i++) {
          const ele = res.items[i];
          if (item.id === ele.id || item.productId == ele.productId) {
            goodsList[index].storeBalance = ele.storeBalance;
            goodsList[index].balance = ele.storeBalance;
            goodsList[index].status = ele.status;
            goodsList[index].sellPrice = ele.sellPrice ? parseFloat(parseFloat(ele.sellPrice).toFixed(2)) : ele.sellPrice;
            // 秒杀
            if (ele.grabActivityId) {
              goodsList[index].sellPrice = ele.grabPrice ? parseFloat(parseFloat(ele.grabPrice).toFixed(2)) : ele.grabPrice;
            } else if (ele.newmbrActivityId) {
              goodsList[index].sellPrice = ele.newmbrPrice ? parseFloat(parseFloat(ele.newmbrPrice).toFixed(2)) : ele.newmbrPrice;
            } else {
              // && self.data.memberInfo.gradeId == '1088'
              if (item.useMemberPrice) {
                // 会员价
                goodsList[index].sellPrice = ele.memberPrice ? parseFloat(parseFloat(ele.memberPrice).toFixed(2)) : ele.memberPrice;
                goodsList[index].usePromotionPrice = false;
                goodsList[index].useMemberPrice = true;
              } else if (ele.promotionPrice && Number(ele.promotionPrice) < Number(ele.sellPrice)) {
                goodsList[index].sellPrice = ele.promotionPrice ? parseFloat(parseFloat(ele.promotionPrice).toFixed(2)) : ele.promotionPrice;
                goodsList[index].usePromotionPrice = true;
                goodsList[index].useMemberPrice = false;
              }
            }
            tempPrice += goodsList[index].sellPrice * item.productNum;
            console.log(ele, 'eleele');
            // 提取失效商品
            if (ele.status === 'DELETED') {
              expiredGoodsList.push({
                ...ele,
                checked: true
              });
            }
            break;
          }
        }
      });
      let expiredGoodsNameArr = [];
      if (expiredGoodsList.length > 0) {
        expiredGoodsList.forEach(ele => {
          expiredGoodsNameArr.push(ele.name);
        });
      }
      if (expiredGoodsNameArr.length > 0) {
        state.checkedProducts = false;
        state.passProductActive = expiredGoodsList;
        state.canBuy = true;
        toggle('pass');
        // wx.showModal({
        //     title: '提示',
        //     content: '您选择的门店商品' + expiredGoodsNameArr.join(",") + '库存不足，请重新选择门店~',
        //     confirmText: '修改门店',
        //     success (res) {
        //         if (res.confirm) {
        //             NAVPAGE.toSelectStore()
        //         } else if (res.cancel) {

        //         }
        //     }
        // })
      } else {
        // 计算促销
        needCalcPromotions = true;
        let products = [];
        goodsList.forEach(item => {
          let tempItem = {
            id: item.productId,
            count: item.productNum
          };
          // 分享人id
          if (item.sharingPersonId) {
            tempItem = {
              ...tempItem,
              sharingPersonId: item.sharingPersonId
            };
          }
          if (item.groupProducts && item.groupProducts.length > 0) {
            tempItem.cateringOrderDetails = item.groupProducts;
          }
          if (state.scource === 'SHOPPINGCART') {
            tempItem = {
              ...tempItem,
              shoppingCartItemId: item.id
            };
          }
          if (item.newmbrActivityId) {
            tempItem = {
              ...tempItem,
              newmbrActivityId: item.newmbrActivityId
            };
            products.push(tempItem);
          } else if (item.grabActivityId) {
            tempItem = {
              ...tempItem,
              grabActivityId: item.grabActivityId
            };
            products.push(tempItem);
          } else if (state.teamBuyId !== '' && state.teamBuyId != null && state.orderType === "group") {
            tempItem = {
              ...tempItem,
              teamBuyingActivityId: state.teamBuyId
            };
            if (state.teamLeaderRecordId !== "") {
              tempItem = {
                ...tempItem,
                teamLeaderRecordId: state.teamLeaderRecordId
              };
            }
            products.push(tempItem);
          } else if (item.usePromotionPrice) {
            tempItem = {
              ...tempItem,
              usePromotionPrice: true
            };
            products.push(tempItem);
          } else if (item.useMemberPrice) {
            tempItem = {
              ...tempItem,
              useMemberPrice: true
            };
            products.push(tempItem);
          } else {
            products.push(tempItem);
          }
          // 如果该商品有赠品
          if (item.goodsPromotions && item.goodsPromotions.length > 0) {
            item.goodsPromotions.forEach(item => {
              products.push({
                gift: true,
                id: item.goods.uuid,
                count: item.count
              });
            });
          }
        });
        state.giftGoodsList.forEach(item => {
          products.push({
            gift: true,
            productId: item.productId,
            productNum: item.productNum
          });
        });
        let postData = {
          products: products,
          storeId: state.goodTypeList[idx].storeId
        };
        return promotionService.calcPromotions(postData);
      }
    }).then(res => {
      let discount = 0;
      if (needCalcPromotions) {
        tempPrice = parseFloat(tempPrice).toFixed(2);
        discount = res && res.discounts ? res.discounts.totalDiscount : 0;
      }
      state.goodTypeList[idx].goodsList = goodsList;
      state.goodTypeList[idx].allPrice = tempPrice;
      state.goodTypeList[idx].discounts = discount;
      let allPrice = 0;
      let goodsList1 = [];
      let discount1 = 0;
      state.goodTypeList.forEach(item => {
        allPrice += parseFloat(Number(item.allPrice));
        goodsList1 = goodsList1.concat(item.goodsList || []);
        discount1 += parseFloat(Number(item.discounts));
      });
      // 处理订单支付逻辑
      state.goodTypeList = state.goodTypeList;
      state.allPrice = allPrice;
      state.goodsList = goodsList1;
      state.discount = discount1;
      state.scoreAmount = res && res.discounts ? res.discounts.scoreDiscount.discount : state.scoreAmount;
      state.checkedProducts = true;
      handlePayModule();
    }).catch(err => {
      util.showToast(err.message);
    });
  } else if (state.scource === "BUYNOW" && state.goodTypeList[idx].orderType === "normal") {
    const productId = state.goodTypeList[idx].goodsList[0].productId;
    productService.getDetails(state.goodTypeList[idx].storeId, productId).then(res => {
      if (!res) {
        uni.showModal({
          title: '提示',
          content: '您选择的门店未上架该商品，请重新选择门店~',
          confirmText: '修改门店',
          success (res) {
            if (res.confirm) {
              state.editActiveIdx = idx;
              uni.setStorageSync('editActiveIdx', idx);
              NAVPAGE.toSelectStore();
            } else if (res.cancel) { }
          }
        });
      } else if (res.balance === 0) {
        uni.showModal({
          title: '提示',
          content: '您选择的门店该商品库存不足，请重新选择门店~',
          confirmText: '修改门店',
          success (res) {
            if (res.confirm) {
              state.editActiveIdx = idx;
              uni.setStorageSync('editActiveIdx', idx);
              NAVPAGE.toSelectStore();
            } else if (res.cancel) { }
          }
        });
      } else {
        let allPrice = state.goodTypeList[idx].allPrice;
        let goodsList = state.goodTypeList[idx].goodsList;
        for (let i = 0; i < goodsList.length; i++) {
          const ele = goodsList[i];
          if (ele.productId === res.id) {
            // && self.data.memberInfo.gradeId == '1088'
            if (res.promotionPrice && res.promotionPrice <= res.sellPrice && (!res.memberPrice || res.memberPrice > res.promotionPrice)) {
              goodsList[i].sellPrice = res.promotionPrice ? parseFloat(parseFloat(res.promotionPrice).toFixed(2)) : res.promotionPrice;
              allPrice = parseFloat((res.promotionPrice * parseFloat(ele.productNum)).toFixed(2));
              break;
            } else if (res.memberPrice && res.memberPrice <= res.sellPrice) {
              goodsList[i].sellPrice = res.memberPrice ? parseFloat(parseFloat(res.memberPrice).toFixed(2)) : res.memberPrice;
              allPrice = parseFloat((res.memberPrice * parseFloat(ele.productNum)).toFixed(2));
              break;
            } else {
              goodsList[i].sellPrice = res.sellPrice ? parseFloat(parseFloat(res.sellPrice).toFixed(2)) : res.sellPrice;
              allPrice = parseFloat((res.sellPrice * parseFloat(ele.productNum)).toFixed(2));
              break;
            }
          }
        }
        state.goodTypeList[idx].goodsList = goodsList;
        state.goodTypeList[idx].allPrice = allPrice;
        // self.data.goodTypeList[idx].discounts = discounts;
        let allPrice1 = 0;
        let goodsList1 = [];
        state.goodTypeList.forEach(item => {
          allPrice1 += parseFloat(Number(item.allPrice));
          goodsList1 = goodsList1.concat(item.goodsList || []);
          // discount1 += parseFloat(Number(item.discounts))
        });
        // 处理订单支付逻辑
        state.goodTypeList = state.goodTypeList;
        state.goodsList = goodsList1;
        state.allPrice = allPrice1;
        state.checkedProducts = true;
        handlePayModule();
      }
    }).catch(err => {
      util.showToast(err.message);
    });
  } else if (state.goodTypeList[idx].orderType === 'advanceSell') {
    let noDISTRIBUTIONFlag = !state.goodTypeList[idx].goodsList || state.goodTypeList[idx].goodsList.some(item => {
      return item.business != 'DISTRIBUTION';
    });
    state.goodTypeList[idx].storeId = noDISTRIBUTIONFlag ? state.goodTypeList[idx].storeId : app.globalData.distributionStore ? app.globalData.distributionStore.id : '';
    state.goodTypeList = state.goodTypeList;
    state.checkedProducts = true;
    state.storeId = noDISTRIBUTIONFlag ? state.goodTypeList[idx].storeId : app.globalData.distributionStore ? app.globalData.distributionStore.id : '';
  } else if (state.goodTypeList[idx].orderType === 'CYCLE') {
    let noDISTRIBUTIONFlag = !state.goodTypeList[idx].goodsList || state.goodTypeList[idx].goodsList.some(item => {
      return item.business != 'DISTRIBUTION';
    });
    state.goodTypeList[idx].storeId = noDISTRIBUTIONFlag ? state.goodTypeList[idx].storeId : app.globalData.distributionStore ? app.globalData.distributionStore.id : '';
    state.goodTypeList = state.goodTypeList;
    state.checkedProducts = true;
    state.storeId = noDISTRIBUTIONFlag ? state.goodTypeList[idx].storeId : app.globalData.distributionStore ? app.globalData.distributionStore.id : '';
  }
  // else if (self.data.goodTypeList[idx].orderType === "nextDay") {
  //   const productId = self.data.goodTypeList[idx].goodsList[0].productId
  //   productService.getDetails(app.globalData.nextDayStore && app.globalData.nextDayStore.id ? app.globalData.nextDayStore.id :self.data.goodTypeList[idx].storeId, productId).then(res => {
  //       if (!res) {
  //           wx.showModal({
  //               title: '提示',
  //               content: '您选择的门店未上架该商品，请重新选择门店~',
  //               confirmText: '修改门店',
  //               success (res) {
  //                   if (res.confirm) {
  //                       self.data.editActiveIdx = idx;
  //                       wx.setStorageSync('editActiveIdx', idx)
  //                       NAVPAGE.toSelectStore()
  //                   } else if (res.cancel) {

  //                   }
  //               }
  //           })
  //       } else if (res.balance === 0) {
  //           wx.showModal({
  //               title: '提示',
  //               content: '您选择的门店该商品库存不足，请重新选择门店~',
  //               confirmText: '修改门店',
  //               success (res) {
  //                   if (res.confirm) {
  //                       self.data.editActiveIdx = idx;
  //                       wx.setStorageSync('editActiveIdx', idx)
  //                       NAVPAGE.toSelectStore()
  //                   } else if (res.cancel) {

  //                   }
  //               }
  //           })
  //       } else {
  //           let allPrice = self.data.goodTypeList[idx].allPrice
  //           let goodsList = self.data.goodTypeList[idx].goodsList
  //           for (let i = 0; i < goodsList.length; i++) {
  //               const ele = goodsList[i];
  //               if (ele.productId === res.id) {
  //                   // && self.data.memberInfo.gradeId == '1088'
  //                   if (res.promotionPrice && res.promotionPrice <= res.sellPrice && (!res.memberPrice || res.memberPrice > res.promotionPrice)) {
  //                     goodsList[i].sellPrice = res.promotionPrice ? parseFloat(parseFloat(res.promotionPrice).toFixed(2)) : res.promotionPrice
  //                     allPrice = parseFloat(((res.promotionPrice) * parseFloat(ele.productNum)).toFixed(2))
  //                     break
  //                   } else if (res.memberPrice && res.memberPrice <= res.sellPrice) {
  //                       goodsList[i].sellPrice = res.memberPrice ? parseFloat(parseFloat(res.memberPrice).toFixed(2)) : res.memberPrice
  //                       allPrice = parseFloat(((res.memberPrice) * parseFloat(ele.productNum)).toFixed(2))
  //                       break
  //                   } else {

  //                       goodsList[i].sellPrice = res.sellPrice ? parseFloat(parseFloat(res.sellPrice).toFixed(2)) : res.sellPrice
  //                       allPrice = parseFloat(((res.sellPrice) * parseFloat(ele.productNum)).toFixed(2))
  //                       break
  //                   }

  //               }
  //           }
  //           self.data.goodTypeList[idx].goodsList = goodsList;
  //           self.data.goodTypeList[idx].allPrice = allPrice;
  //           // self.data.goodTypeList[idx].discounts = discounts;
  //           let allPrice1 = 0;
  //           let goodsList1 = [];
  //           self.data.goodTypeList.forEach(item => {
  //             allPrice1 += parseFloat(Number(item.allPrice))
  //             goodsList1 = goodsList1.concat(item.goodsList || [])
  //             // discount1 += parseFloat(Number(item.discounts))
  //           })
  //           self.setData({
  //               goodTypeList: self.data.goodTypeList,
  //               goodsList: goodsList1,
  //               allPrice: allPrice1,
  //               checkedProducts: true
  //           })
  //           // 处理订单支付逻辑
  //           self.handlePayModule()
  //       }
  //   }).catch(err => {
  //       util.showToast(err.message)
  //   })
  // }
}
function showGood (e) {
  let idx = e.currentTarget.dataset.idx;
  let type = e.currentTarget.dataset.type || null;
  state.editActiveIdx = idx;
  state.goodDetailShow = true;
  state.showGoodType = type;
  uni.setStorageSync('editActiveIdx', idx);
}
function changeGoodDetailShow () {
  state.goodDetailShow = !state.goodDetailShow;
}
</script>
<style scoped>
/* pages/perfectOrder/perfectOrder.wxss */

page {
  background-color: #f4f4f4;
  padding-bottom: 130rpx;
}

.color-5a5a5a {
  color: #5a5a5a;
}

.color-8B8B8C {
  color: #8b8b8c;
}

.color-666666 {
  color: #666;
}

.color-FF8561 {
  color: #ff8561;
}

.color-454545 {
  color: #454545;
}

.right-point {
  width: 15rpx;
  height: 26rpx;
  vertical-align: middle;
}

.top-info {
  width: 712rpx;
  min-height: 200rpx;
  padding: 0 18rpx;
  margin: 18rpx auto;
  background: #fff;
  font-size: 28rpx;
  box-sizing: border-box;
  position: relative;
}

.top-info .icon-top-more {
  width: 52rpx;
  height: 11rpx;
  position: absolute;
  left: 50%;
  margin-left: -26rpx;
  top: 8rpx;
}

.top-info .delivery-method-name {
  padding-top: 31rpx;
  font-size: 28rpx;
  height: 58rpx;
  color: #333;
  width: 100%;
  text-align: center;
  line-height: 58rpx;
  font-weight: bold;
}

.top-info .group-top {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 31rpx;
  width: 676rpx;
}

.top-info .group-top .group-bg {
  width: 750rpx;
  height: 133rpx;
  flex-shrink: 0;
}

.top-tips {
  width: 100%;
  padding: 0 26rpx;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #fff;
  background: #ff918f;
  margin-bottom: 60rpx;
  z-index: 9;
}

.seat-box {
  height: 32rpx;
}

/* 配送方式 */

.type-check-box {
  height: 70rpx;
  padding: 0 14rpx 20rpx 14rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}

.type-check-box > view {
  border: 1px solid;
  border-radius: 6rpx;
  height: 70rpx;
  width: 190rpx;
  font-size: 24rpx;
  line-height: 70rpx;
  margin-right: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  background: #fff;
}

.type-check-box > view.active {
  border-color: #fbbe35;
  color: #fbbe35;
}

.type-check-box > view image {
  width: 33rpx;
  height: 33rpx;
  margin-right: 10rpx;
}

.type-check-box .self-take image {
  width: 25rpx;
  height: 36rpx;
}

.type-check-box > view:last-of-type {
  margin-right: 0;
}

.color-line {
  width: 100%;
  height: 10rpx;
  display: block;
}

.receive-box {
  display: flex;
  padding: 18rpx 0;
  min-height: 94rpx;
  box-sizing: border-box;
  background: #fff;
  border-top: 1rpx solid #f1f1f1;
  align-items: center;
}

.receive-box.distribution {
  border-top: none;
}

.receive-box .icon-box {
  width: 44rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  float: left;
}

.receive-box .icon-box image {
  width: 30rpx;
  height: 33rpx;
}

.receive-box .receive-info {
  width: 560rpx;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  color: #333;
}

.receive-box .receive-info .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 20rpx;
  position: relative;
}

.receive-box .receive-info .name-mobile text:first-of-type::after {
  content: '';
  height: 20rpx;
  background: #8b8b8c;
  width: 1px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8rpx;
}

.receive-box .receive-info .receive-address {
  font-size: 24rpx;
  color: #454545;
}

.receive-box .iconright-box {
  width: 92rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}

.receive-box .iconright-box image {
  width: 15rpx;
  height: 26rpx;
}

/* 门店信息 */

.store-info {
  border-top: 2rpx dotted #e6e6e6;
  position: relative;
  min-height: 80rpx;
  /* padding: 20rpx 25rpx 36rpx 0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-info .store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-info .store-details > view {
  text-align: left;
}

.store-info .store-details .name {
  font-size: 30rpx;
  line-height: 50rpx;
  margin-bottom: 8rpx;
  font-weight: 500;
  color: #242424;
}

.store-info .store-details .address {
  font-size: 26rpx;
  line-height: 36rpx;
  color: #4d4d4d;
}

.store-info .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.store-info .icon-right-box image {
  width: 12rpx;
  height: 23rpx;
  margin-left: 30rpx;
}

.store-info .store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #454545;
}

.store-info .open-map {
  font-size: 24rpx;
}

/* 商品信息 */

.goods-box {
  background: #fff;
  width: 672rpx;
  /* min-height: 692rpx; */
  /* padding: 0 20rpx 20rpx 20rpx; */
  padding: 0 20rpx 0 20rpx;
  margin: 20rpx auto;
  background: #fff;
  border-radius: 4rpx 4rpx 0px 0px;
}

.title-box {
  font-size: 32rpx;
  font-weight: 500;
  color: #242424;
  height: 90rpx;
  line-height: 90rpx;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
}

.goods-list.hide {
  max-height: 414rpx;
  overflow: hidden;
}

.goods-item {
  /* padding: 0 0 30rpx 0; */
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.goods-item1 {
  align-items: center;
}
.good-num {
  color: #999999;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}
.good-num image {
  margin-left: 12rpx;
}
.goods-item .goods-item-img {
  display: flex;
  align-items: center;
}
.goods-item .goods-item-img view {
  margin-right: 20rpx;
}
.goods-item .goods-img {
  width: 108rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-img .stop-sell {
  position: absolute;
  width: 100%;
  height: 48rpx;
  font-size: 20rpx;
  line-height: 48rpx;
  color: #fff;
  text-align: center;
  left: 0;
  top: 50%;
  margin-top: -24rpx;
}

.goods-item .goods-info {
  min-height: 120rpx;
  width: calc(100% - 128rpx);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.goods-info .goods-left {
  max-width: 360rpx;
}

.goods-info .goods-right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.goods-info .goods-name,
.goods-info .goods-desc,
.goods-info .goods-advanceSell-price {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 460rpx;
  display: block;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 24rpx;
  line-height: 38rpx;
  height: 38rpx;
  color: #333;
  margin-top: 2rpx;
  font-weight: 400;
}
.goods-info .goods-detail-info {
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #999;
}
.goods-info .goods-desc {
  font-size: 18rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: #999;
}

.goods-info .goods-advanceSell-price {
  font-size: 24rpx;
  color: #f9a72a;
  font-weight: bold;
}

.goods-info .goods-label {
  font-size: 20rpx;
  margin-top: 2rpx;
  background: #ff5757;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 260rpx;
  padding: 0 10rpx;
  color: #ffffff;
  display: inline-block;
  line-height: 40rpx;
  height: 40rpx;
  border-radius: 6rpx;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #454545;
  line-height: 36rpx;
  font-weight: bold;
}

.goods-price {
  font-size: 28rpx;
  line-height: 36rpx;
  min-height: 36rpx;
  color: #333;
}

.goods-price .nowPrice {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff8425;
}
.goods-price .nowPrice text {
  font-size: 20rpx;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #999;
  margin-left: 18rpx;
  text-decoration: line-through;
}

.goods-info .goods-count-box {
  float: right;
  width: 164rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 56rpx;
  height: 56rpx;
  /* border: 1rpx solid #f1f1f1; */
  margin-left: 20rpx;
}

.goods-info .goods-count-box text {
  background: #fff;
  color: #454545;
  font-size: 24rpx;
  width: 43rpx;
  height: 100%;
  text-align: center;
}
.goods-info .goods-count-box .iconfont {
  font-size: 50rpx;
}
.goods-info .goods-count-box view {
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  font-size: 40rpx;
  line-height: 36rpx;
  border-radius: 20rpx;
  background: #fff;
  color: #fff;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

.viewMore {
  width: 146rpx;
  height: 50rpx;
  border: 1px solid #cdcdcd;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #454545;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28rpx auto;
}

.viewMore image {
  width: 17rpx;
  height: 10rpx;
  margin-left: 6rpx;
}

.dividing-line {
  width: 677rpx;
  /* height: 26rpx; */
  height: 2rpx;
  position: relative;
  left: 50%;
  /* margin-left: -356rpx; */
  transform: translateX(-50%);
  background-color: #ececec;
}

.dividing-line image {
  width: 716rpx;
  height: 100%;
  margin-left: -1px;
}

/* 促销相关（返券、赠品） */
.promotions-box {
  background: rgba(255, 102, 102, 0.1);
  padding: 0 16rpx;
  /* margin: 0 20rpx; */
  box-sizing: border-box;
}

.promotions-box .promotions-item {
  display: flex;
  align-items: center;
  height: 58rpx;
}
.promotions-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
}
.promotions-data > view {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.promotions-box .promotions-item .label {
  width: 50rpx;
  height: 30rpx;
  background: #ff9f43;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  line-height: 30rpx;
  text-align: center;
  margin-right: 14rpx;
}

.promotions-box .promotions-item .title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
  font-size: 26rpx;
  color: #ff6666;
}

/* 赠品相关 */

.gift-box {
  background: #fff6f0;
  min-height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #ff6131;
  padding: 0 40rpx;
  font-size: 24rpx;
  width: 750rpx;
  box-sizing: border-box;
  margin-left: -40rpx;
}

.gift-box view {
  display: flex;
  align-items: center;
}

.gift-box .gift-title {
  margin-right: 5rpx;
  height: 80rpx;
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
  height: 80rpx;
}

.gift-box .gift-item text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
}

.gift-img-box {
  width: 58rpx;
  height: 58rpx;
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

.section-box {
  height: 70rpx;
  font-size: 28rpx;
  line-height: 70rpx;
  text-align: right;
  display: flex;
  justify-content: space-between;
}

.section-box view text {
  color: #f9a72a;
  font-weight: bold;
}

.section-box .left {
  color: #454545;
  font-size: 28rpx;
}

.dispatching-fee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* font-weight: bold; */
  color: #454545;
  font-size: 28rpx;
  /* border-top: 1px solid #eee; */
}

.dispatching-fee .left-icon {
  font-size: 20rpx;
  border: 1rpx solid;
  font-weight: normal;
  border-radius: 6rpx;
  line-height: 40rpx;
  height: 40rpx;
  padding: 0 9rpx;
}

.score-coupon {
  background: #fff;
  padding: 0 40rpx;
  font-size: 28rpx;
  color: #454545;
  margin-bottom: 20rpx;
}

.score-coupon .score-box {
  padding: 32rpx 0;
  display: flex;
  justify-content: space-between;
}

.score-coupon .score-box .left text {
  font-size: 24rpx;
  margin-left: 16rpx;
}

.score-coupon .score-box image {
  width: 23rpx;
  height: 23rpx;
}

.score-coupon .score-box .right {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.score-coupon .score-box .right .score-amount {
  color: #f9a72a;
  font-weight: bold;
  margin: 0 30rpx 0 20rpx;
  font-size: 28rpx;
}

.checkbox-icon {
  width: 32rpx;
  height: 32rpx;
  /* background: url('http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconUnchecked.png') no-repeat center; */
  background-size: 100% 100%;
}

.checkbox-icon .active {
  width: 32rpx;
  height: 32rpx;
  /* background: url('https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/xianfeng/iconChecked.png') no-repeat center; */
  background-size: 100% 100%;
}

.coupon-box {
  height: 85rpx;
  font-size: 28rpx;
  border-top: 1rpx solid #f1f1f1;
  line-height: 85rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  color: #454545;
}

.coupon-box .right-info {
  color: #a8a8a8;
}

.coupon-box .coupon-amount {
  color: #ff8561;
  font-weight: bold;
}

.coupon-box .right-point,
.integral-box .right-point {
  margin-left: 20rpx;
}

/* 发票模块 */

.invoice-box {
  height: 80rpx;
  padding: 0 40rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #454545;
}

/* 账单明细 */
.bill-details {
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-bottom: 20rpx; */
}

.good-type-box .bill-details {
  border-bottom: 1px solid #ececec;
}
.bill-details view.discount-amounts {
  font-size: 24rpx;
  color: #a8a8a8;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details view.discount-amounts image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 11rpx;
}

.balance-accounts {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  font-size: 28rpx;
  color: #181818;
  font-weight: bold;
}

.balance-accounts text {
  font-size: 28rpx;
  color: #ff8425;
}

.block-box {
  background: #fff;
  width: 674rpx;
  padding: 0 20rpx;
  margin: 0 auto 18rpx auto;
  overflow: hidden;
  border-radius: 20rpx;
}
.good-type-box .block-box {
  padding: 0;
  margin: 0;
  border: none;
  width: 100%;
}
.good-type-box .block-box .row {
  border: none;
}
.good-type-box .block-box .row .info {
  margin: 0;
}
.block-title {
  font-size: 32rpx;
  line-height: 56rpx;
  color: #000;
  padding-top: 17rpx;
  font-weight: 500;
  font-family: Source Han Sans CN;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.row .title {
  font-weight: 500;
  font-size: 28rpx;
  color: #454545;
}

.row .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.row .right .info {
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #a8a8a8;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 446rpx;
  text-align: right;
}

.integral-box {
  height: 90rpx;
  font-size: 30rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
}

.integral-box text {
  float: left;
}

.integral-box .right-info {
  float: right;
}

.reserve-box {
  height: 90rpx;
  font-size: 26rpx;
  border-top: 1rpx solid #f4f5f9;
  line-height: 90rpx;
  background: #fff;
  margin-left: 40rpx;
  /* overflow: hidden; */
}

.reserve-box switch {
  float: right;
  margin-right: 25rpx;
}

.reserve-box .wx-switch-input {
  width: 91rpx !important;
  height: 42rpx !important;
  border-radius: 20rpx !important;
  border: 2rpx solid #ccc !important;
}

.reserve-box .wx-switch-input::before {
  width: 87rpx !important;
  height: 38rpx !important;
}

.reserve-box .wx-switch-input::after {
  width: 19rpx !important;
  height: 19rpx !important;
  background-color: #ccc;
  margin-top: 10rpx;
  margin-left: 11rpx;
  box-shadow: none;
}

.reserve-box .wx-switch-input-checked::after {
  width: 29rpx !important;
  height: 28rpx !important;
  background-color: #0198ff;
  margin-top: 6rpx;
  box-shadow: none;
}

.remarks-box {
  background: #fff;
  font-size: 28rpx;
  color: #454545;
}

.remarks-title {
  line-height: 64rpx;
  padding-top: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 40rpx;
}

.remarks-title .right-icon {
  height: 100%;
  padding: 0 40rpx;
}

.remarks-title image {
  width: 25rpx;
  height: 25rpx;
}

.remarks-info {
  line-height: 48rpx;
  padding: 0 40rpx 48rpx 40rpx;
}

.coupon-box text,
.reserve-box text,
.integral-box text {
  float: left;
}

.coupon-box .right-info,
.integral-box .right-info {
  float: right;
}

.coupon-text {
  color: #a8a8a8;
}

.payment-remarks {
  background: #fff;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}

.payment-method,
.remarks {
  height: 90rpx;
  line-height: 90rpx;
  margin-left: 40rpx;
}

.payment-method {
  border-bottom: 1rpx solid #f4f5f9;
}

.payment-method text:last-of-type {
  float: right;
  margin-right: 30rpx;
}

.remarks .remarks-info {
  float: right;
  color: #9c9c9c;
}

.price-detail {
  background: #fff;
  padding: 20rpx 30rpx 20rpx 40rpx;
  font-size: 30rpx;
  line-height: 54rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff2126;
}

.bottom-box {
  width: 100%;
  height: 120rpx;
  padding: 10rpx 38rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  background: #fff;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  justify-content: space-between;
}

.bottom-box .btn {
  float: right;
  width: 220rpx;
  height: 74rpx;
  color: #fff;
  text-align: center;
  line-height: 74rpx;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 37rpx;
  padding: 0;
}

.bottom-box .unavailable {
  background: #ccc;
}

.bottom-box .order-price {
  float: left;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  font-size: 26rpx;
  color: #333;
  line-height: 80rpx;
}

.bottom-box > view text {
  display: block;
}

.bottom-box > view text:first-of-type {
  color: #ff8425;
  position: relative;
  padding-left: 22rpx;
  margin-right: 20rpx;
  font-weight: bold;
}

.bottom-box > view:first-of-type > view:last-of-type {
  font-size: 24rpx;
  color: #999;
}

/* 自提时间 */
.time-picker {
  width: 100%;
  background: #fff;
}

.time-picker > view {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  /* border-top: 2rpx dotted #e6e6e6; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #4d4d4d;
  text-align: right;
  position: relative;
  /* padding-right: 23rpx; */
}

.time-picker > view view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.time-picker > view .left-icon {
  width: 30rpx;
  height: 30rpx;
  margin: 0 16rpx 0 4rpx;
}

.time-picker text.self-time {
  margin-right: 40rpx;
}

.time-picker .right-point {
  margin-top: 0;
  margin-left: 32rpx;
}

.delivery-time-box {
  /* height: 150rpx; */
  background: #fff;
  /* padding: 22rpx 0 26rpx 0; */
  box-sizing: border-box;
  /* border-top: 2rpx dotted #e6e6e6; */
}

.delivery-time-box text,
.store-info text {
  display: block;
}

.delivery-time-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 48rpx;
}

.delivery-time-box .self-time {
  font-size: 30rpx;
  line-height: 56rpx;
}

/* 拼团自提时间时间点样式 */

.delivery-time-box.time-point {
  height: 94rpx;
  padding: 0;
}

.time-point .time-picker > view {
  border-top: none;
}

.store-box {
  background: #fff;
  margin: 0 0 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 6rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 40rpx;
  line-height: 46rpx;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

.store-box {
  background: #fff;
  margin: 20rpx 0;
  padding: 22rpx 40rpx 26rpx 40rpx;
  position: relative;
}

.store-box .color-5a5a5a {
  font-size: 28rpx;
  line-height: 44rpx;
}

.store-box view.store-details {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 14rpx;
}

.store-box view.store-details text {
  display: block;
  text-align: left;
}

.store-box view text:first-of-type {
  font-size: 30rpx;
  line-height: 42rpx;
  margin-bottom: 10rpx;
}

.store-box view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.store-box .icon-right-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 48rpx;
  top: 0;
  font-size: 24rpx;
  color: #999;
}

.store-box .icon-right-box image {
  width: 15rpx;
  height: 26rpx;
  margin-left: 9rpx;
}

/* 弹出框 */

.modal-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal-body {
  position: relative;
}

.modal-content {
  background: #fff;
  width: 586rpx;
  /* height: 520rpx; */
  padding: 24rpx 0 0 0;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
}

.modal-body .modal-content.card {
  width: 480rpx;
  height: 320rpx !important;
  margin: 58% auto;
}

.modal-body .modal-content.score {
  min-height: 520rpx !important;
}

.modal-content .title {
  color: #777;
  font-size: 28rpx;
  line-height: 36rpx;
  text-align: center;
}

.modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 32rpx;
}

.modal-content .content .uesd {
  color: #ffaf61;
  margin-bottom: 18rpx;
}

.modal-content .content input {
  border: 1rpx solid #ffaf61;
  height: 74rpx;
  font-size: 28rpx;
  line-height: 74rpx;
  box-sizing: border-box;
  width: 100%;
  border-radius: 6rpx;
  padding: 0 0 0 24rpx;
  display: block;
}

.modal-content .content text {
  display: block;
  font-size: 28rpx;
  line-height: 36rpx;
}

.modal-content .content view {
  margin-top: 20rpx;
}

.modal-content .pay-box text:first-of-type {
  margin-bottom: 16rpx;
}

.modal-content .content .forget-password {
  font-size: 26rpx;
  line-height: 36rpx;
  float: right;
  color: #ffaf61;
  margin-top: 14rpx;
}

.button-box {
  display: flex;
  width: 100%;
  height: 80rpx;
  position: absolute;
  bottom: 0;
}

.button-box button {
  flex: 1;
  font-size: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

button::after {
  border: none;
}

.button-box .confirm {
  color: #fff;
}

.button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.score-amount {
  font-size: 28rpx !important;
  line-height: 42rpx;
  margin: 22rpx 0;
}

.modal-content .content .score-amount > text {
  color: #df1f1d;
  display: inline;
}

.score-explain {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
  color: #969696;
  margin-bottom: 16rpx;
}

.score-rule {
  font-size: 24rpx !important;
  line-height: 30rpx !important;
  color: #969696;
  padding-bottom: 105rpx;
}

.popup-content {
  width: 600rpx;
  border-radius: 6rpx;
  background: #fff;
  overflow: hidden;
  padding-top: 12rpx;
}

.popup-content .title {
  font-size: 32rpx;
  color: #454545;
  line-height: 80rpx;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.popup-content-box {
  color: #454545;
}

.price-detail {
  padding: 0 32rpx;
  font-size: 30rpx;
  line-height: 77rpx;
  border-bottom: 1px solid #f1f1f1;
}

.price-detail view {
  border-bottom: 1px solid #f1f1f1;
  height: 77rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff7171;
  border-bottom: none;
}

.realpay {
  text-align: right;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  background: #fff;
  padding: 0 32rpx;
}

.realpay text {
  color: #ff7171;
}

.popup-content .button {
  font-size: 28rpx;
  color: #fff;
  line-height: 84rpx;
  height: 84rpx;
  font-weight: bold;
  text-align: center;
}

.selftake-remind {
  font-size: 24rpx;
  line-height: 84rpx;
  background: #fff;
  text-align: left;
}

.contact-store {
  justify-content: flex-start;
  align-items: center;
  margin-top: 10rpx;
}

.contact-store .tel {
  width: 34rpx;
  height: 38rpx;
  margin-right: 16rpx;
}

.contact-store view {
  width: calc(100% - 140rpx);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.store-box .section-box {
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: right;
  display: flex;
}

.store-box .section-box.contact-store text {
  font-weight: normal;
  line-height: 80rpx;
  font-size: 28rpx;
  /* font-weight: normal !important; */
  margin-bottom: none !important;
}

/* 弹出框 */

.number-modal-box {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 8;
}

.number-modal-body {
  position: relative;
}

.number-modal-content {
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
.number-modal-contentA {
  background: #fff;
  width: 683rpx;
  padding: 36rpx 0rpx 0 0rpx;
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  /* margin: 40% auto; */
  position: relative;
}
.number-modal-contentA .title {
  color: #232222;
  font-size: 30rpx;
  line-height: 42rpx;
  /* text-align: center; */
  font-weight: normal;
  margin: 0 20rpx;
}
.number-modal-contentA .content {
  font-size: 28rpx;
  /* line-height: 36rpx; */
  color: #676666;
  padding: 40rpx 40rpx;
  padding-bottom: 100rpx;
  max-height: 700rpx;
  overflow-y: scroll;
  /* margin-top: 48rpx; */
  /* display: flex;
    justify-content: center; */
}
.number-modal-content .title {
  color: #232222;
  font-size: 36rpx;
  line-height: 42rpx;
  text-align: center;
  font-weight: normal;
}

.number-modal-content .content {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #676666;
  padding: 0 40rpx;
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.number-modal-content .content .count-box {
  width: 354rpx;
  height: 80rpx;
  border: 1rpx solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.number-modal-content .content .count-box > view {
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

.number-modal-content .content .count-box > input {
  width: 194rpx;
  height: 100%;
  border: none;
  text-align: center;
  padding: 0;
  color: #313131;
  font-size: 48rpx;
}

.number-modal-content .content .count-box > view:first-of-type {
  border-right: 1rpx solid #ddd;
}

.number-modal-content .content .count-box > view:last-of-type {
  border-left: 1rpx solid #ddd;
}

.number-modal-content .button-box {
  display: flex;
  width: 100%;
  height: 88rpx;
  position: absolute;
  bottom: 0;
}

.number-modal-content .button-box button {
  flex: 1;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  border-radius: 0;
  border: none;
}

.number-modal-content .button-box .confirm {
  color: #fff;
}

.number-modal-content .button-box .cancel {
  box-sizing: border-box;
  color: #8a8989;
  border-top: 1rpx solid #e5e5e5;
}

.pay-item {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  line-height: 72rpx;
  min-height: 72rpx;
}
.pay-item1 {
  line-height: 55rpx;
  min-height: 55rpx;
  margin-top: -15rpx;
  margin-bottom: 10rpx;
  margin-left: 30rpx;
  font-size: 24rpx;
  color: #999;
}
.pay-item1 .right {
  flex: 0 0 auto;
}
.pay-item .type-box {
  display: flex;
  height: 64rpx;
  border-radius: 64rpx;
  overflow: hidden;
  background-color: #f1f1f1;
}
.pay-item .type-box view {
  position: relative;
  padding: 0 20rpx;
}
.pay-item .type-box .active {
  border-radius: 64rpx;
  color: #fff;
}
.pay-item .left {
  color: #454545;
}

.pay-item .left text {
  margin-left: 2rpx;
}

.pay-item image.tips {
  width: 23rpx;
  height: 23rpx;
}

.pay-item .right {
  display: flex;
  align-items: center;
}

.pay-item .right.score {
  color: #a8a8a8;
}

.pay-item .right .deduction-amount {
  color: #ff8425;
  font-weight: bold;
  margin: 0 12rpx 0 12rpx;
  font-size: 28rpx;
}

.pay-item .right .amount-box {
  color: #fd463b;
  /* font-weight: bold; */
  font-size: 28rpx;
}
.pay-item1 .right .amount-box {
  font-size: 24rpx;
}
.pay-item .right.coupon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pay-item .right.coupon .text {
  color: #a8a8a8;
}

.pay-item .right .coupon-amount-box {
  position: relative;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 41rpx;
  min-width: 70rpx;
  height: 41rpx;
  /* padding: 0 13rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-item .right .coupon-bg {
  position: absolute;
  width: 96rpx;
  height: 41rpx;
  z-index: 0;
}

.pay-item .right .coupon-bg:first-of-type {
  position: absolute;
  left: 0;
  top: 0;
}

.pay-item .right .coupon-bg:last-of-type {
  position: absolute;
  right: 0;
  top: 0;
}

.pay-item .right .coupon-amount {
  color: #fd3a2e;
  height: 41rpx;
  /* background: rgba(253, 70, 59, 0.9); */
  position: relative;
}

.pay-item .right.coupon .right-point {
  margin-left: 20rpx;
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
.payment-type {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
}
.payment-model {
  background-color: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  /* max-height: 1200rpx; */
  display: flex;
  border-radius: 20rpx 20rpx 0 0;
  flex-direction: column;
  /* align-items: center; */
  padding: 20rpx 0;
  box-sizing: border-box;
  overflow-y: auto;
  /* text-align: center; */
}
.payment-model .goods-item-box {
  border-bottom: 1px solid #ccc;
  padding: 10rpx 20rpx;
}
.payment-model .goods-item-box .goods-item {
  padding: 0;
}
.model-body {
  max-height: 1000rpx;
  overflow-y: auto;
}
.model-title {
  text-align: center;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}
.model-price {
  font-size: 40rpx;
  margin: 30rpx 0;
}
.model-price view:first-of-type {
  font-size: 24rpx;
  color: #999;
}
.model-type-box {
  padding: 0 40rpx;
  width: 100%;
  box-sizing: border-box;
}
.model-type-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20rpx 0;
  text-align: left;
  font-size: 28rpx;
  color: #999;
}
.model-type-item .coupon {
  display: flex;
  align-items: center;
}
.model-type-item .coupon image {
  margin-left: 10rpx;
}
.model-type-item:first-of-type {
  border-bottom: 1px solid #ccc;
}
.model-type-title {
  font-size: 32rpx;
  color: #000;
  margin-bottom: 10rpx;
}
.payment-btn {
  width: calc(100% - 40rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  border-radius: 10rpx;
  color: #fff;
  margin: 0 auto;
  margin-top: 40rpx;
}
.spec-close-box {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}
.spec-close-box image {
  width: 40rpx;
}

.custom-btn {
  width: 50rpx;
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
.change-store {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* padding: 20rpx 25rpx 36rpx 0; */
  /* border-top: 2rpx dotted #e6e6e6; */
  background-color: #f4f4f4;
  height: 68rpx;
  font-size: 28rpx;
}
.change-tip {
  color: #999;
  /* font-size: 30rpx; */
  /* margin-bottom: 10rpx; */
}
.store-name {
  max-width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.change-store .icon-right-box {
  /* font-size: 24rpx; */
}
/* 新版样式 */
.good-type-box {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 15rpx;
}
.good-type-icon {
  height: 30rpx;
  margin-bottom: 20rpx;
  max-width: 200rpx;
}
.top-info-new {
  border-radius: 20rpx;
}
.top-info-new .receive-box {
  padding-top: 50rpx;
}
.good-type-box .group-top {
  display: flex;
  align-items: center;
  justify-content: center;
}
.good-type-box .good-type-config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 28rpx;
  height: 70rpx;
  min-height: 70rpx;
}
.good-type-box .good-type-config-item .type-check-box {
  padding: 0;
}
.good-type-box .good-type-config-item .type-check-box > view {
  height: 60rpx;
  width: 164rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  margin: 0 0 0 20rpx;
}
.good-type-box .good-type-config-item .time-picker > view {
  border: none;
  font-size: 28rpx;
  color: #000;
}
.good-type-box .good-type-config-item .store-details {
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.good-type-box .good-type-config-item .store-details view {
  max-width: 420rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.good-type-box .store-info {
  padding: 0;
  border: none;
}
.good-type-box .good-type-config-item .store-details image {
  height: 30rpx;
  margin-left: 22rpx;
  max-width: 50rpx;
}
.good-type-box .good-type-config-item > view:first-of-type {
  font-size: 28rpx;
  color: #000;
}
.good-type-title {
  font-weight: 700;
  font-size: 32rpx;
  margin-bottom: 16rpx;
}
.not-goods-tip {
  color: #ccc;
  font-size: 24rpx;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}
.not-goods .goods-item-img .goods-img {
  position: relative;
}
.not-goods .goods-item-img .goods-img .mask-layer {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}
.good-type-box .pay-item .title,
.good-type-box .good-type-config-item > view:first-of-type {
  color: #454545;
}
.store-info-box {
  padding: 25rpx 22rpx;
  border-radius: 20rpx;
  background-color: #fff;
  margin: 20rpx;
}
.store-info-box > view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  margin-bottom: 30rpx;
}
.store-info-box > view:last-of-type {
  margin-bottom: 0;
}
.store-info-box > view image {
  height: 30rpx;
  width: auto;
  flex: 0 0 auto;
}
.store-info-box > view > view {
  display: flex;
  align-items: center;
}
.store-info-box .store-text image {
  margin-right: 20rpx;
}
.store-info-box .store-msg image {
  margin-left: 26rpx;
}
.store-info-box .store-msg .right-point {
  height: 26rpx;
  margin-left: 16rpx;
}
.appointment-item {
  text-align: right;
}
.appointment-item1 {
  color: #f66600;
}
.gradeImg {
  height: 28rpx;
  width: auto;
  max-width: 100%;
  margin-right: 13rpx;
}
.goods-item1 {
  min-height: 200rpx;
}
.goods-item1 .goods-img {
  width: 200rpx;
  height: 200rpx;
}
.goods-item1 .goods-img image {
  border-radius: 20rpx;
}
.goods-item1 .goods-info {
  width: calc(100% - 220rpx);
  height: 200rpx;
  align-items: flex-start;
}
.goods-item1 .goods-info .goods-left {
  max-width: 280rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-item1 .goods-info .goods-name {
  font-size: 28rpx;
}
.goods-item1 .goods-info .service-msg {
  color: #999999;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  margin-top: 14rpx;
}
.good-type-box1 {
  padding: 20rpx;
}
.good-type-box .background-box {
  padding: 0 20rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  margin-bottom: 10rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
}
.background-box .type-check-box,
.background-box .type-check-box > view,
.background-box .time-picker {
  background-color: transparent;
}
.number-modal-content .button-box1 {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx;
  margin-top: 40rpx;
}
.number-modal-content .button-box1 button {
  flex: 1 0 auto;
  height: 72rpx;
  line-height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: #fff;
  font-size: 30rpx;
  padding: 0 30rpx;
  color: #fff;
  margin: 0 10rpx;
}
.number-modal-content1 {
  padding-bottom: 30rpx;
}
.number-modal-content1 .content {
  display: block;
}
.number-modal-content1 .content {
  color: #999;
  font-size: 26rpx;
}
.number-modal-content1 .store-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 24rpx;
}
.time-box-store {
  display: flex;
  align-items: center;
  /* padding: 0 30rpx; */
  box-sizing: border-box;
  margin-top: 30rpx;
}

.time-box-store .time-item {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 24rpx;
  /* color: #3C3C3C; */
  /* padding-bottom: 29rpx; */
}
.time-box-store .time-item:nth-of-type(1) {
  margin-right: 45rpx;
}
.time-box-store .time-item image {
  width: 26rpx;
  max-height: 26rpx;
  margin-right: 12rpx;
}
.good-type-box .self-time-box {
  margin: 8rpx 0 12rpx;
}
.good-type-box .self-time-box > view:first-of-type {
  color: #000;
}
.good-type-box .self-time-box .time-picker > view {
  font-size: 30rpx;
}
.good-type-box .self-time-box .time-picker > view > view:first-of-type {
  font-size: 32rpx;
  font-weight: 700;
}
</style>