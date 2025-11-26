<template>
<!-- 

 -->

<!--<template is="add-cart-animation" :data=""></template>-->
<view>
<navigationBar id="navigation" :title="state.productPlacedAtTheTop ? ' ' : state.navigationBarTitle" :background="state.productPlacedAtTheTop ? 'color: rgba(0,0,0,0)' : ''" :style="state.productPlacedAtTheTop ? 'position: absolute;top: 0;' : ''"></navigationBar>  
<!-- <view class="anchor_tab" style="top: {{state.navHeight}}px" wx:if="{{state.scrollTop > 22}}" >
  <view wx:for="{{state.scrollList}}" data-name1="{{item.name1}}" bindtap="manualScroll" class="{{state.manualScrollTop === item.name1 ? 'activeScroll' : ''}}">
    {{item.name}}
  </view>
</view> -->
  <scroll-view class="page-content" :scroll-y="true" @scroll="scrollFun" :scroll-into-view="'t' + state.manualScrollTop">
    <!-- 商品图片轮播 -->
    <view class="swiperContainer" :id="'products-' + goodsId">
      <swiper class="swiper" @change="swiperChange" :autoplay="state.isAutoplay" interval="5000" circular="true">
        <view v-for="(item , index) in state.productPictures" :key="index">
          <swiper-item class="swiper-item">
            <image :src="state.imagesPath.iconPresell" class="slide-presell" :hidden="true"></image>
            <image v-if="item.fileType == 'PICTURE' || !item.fileType" :src="item.url" class="slide-image" width="355" height="150"></image>
            <!-- loop -->
            <video v-if="item.fileType == 'VIDEO'" :src="item.url" :autoplay="state.isWifi && state.productPictures.length == 1" show-mute-btn="true" style="position: absolute;top:50%;transform: translateY(-50%);width: 100%;" class="slide-video"></video>
          </swiper-item>
        </view>
      </swiper>
      <view class="imageCount" :style="state.isTeam ? 'bottom: 136rpx;' : ''">{{state.current}}/{{state.productPictures.length}}</view>
    </view>
    <!-- 秒杀 -->
    <view class="secKill-box group-box" v-if="state.isSecKill && state.secKillInfo">
      <image :src="state.imagesPath.promo_bg" mode="" class="cuxiao_bg seckill_bg"></image>
      <image :src="state.imagesPath.seckill_icon" mode="" class="cuxiao_icon seckill_icon"></image>
      <view class="seckill_label">秒杀</view>
      <view class="secKill-price-box group-people-number">
        <view class="secKill-price-box group-price-box">
          <text class="secKill-nowPrice group-nowPrice">￥<text>{{state.secKillInfo.price ? state.secKillInfo.price : ''}}</text></text>
          <!-- <text class="price-type">秒杀价</text> -->
        </view>
        <view class="secKill-price-right group-price-oldPrice" v-if="state.secKillInfo.originalPrice > state.secKillInfo.price || state.secKillInfo.sellPrice > state.secKillInfo.price">
          <!-- <text class="group-number">限时秒杀、数量有限、先到先得</text> -->
          <text class="secKill-oldPrice group-oldPrice">{{state.secKillInfo.originalPrice && state.secKillInfo.originalPrice > state.secKillInfo.sellPrice ? '￥' + state.secKillInfo.originalPrice : '￥' + state.secKillInfo.sellPrice}}</text>
        </view>
      </view>
      <view class="secKill-time-down group-time-down" v-if="state.secKillInfo.secKillStatus !== 'end'">
        <!-- <image class="secKill-time-down-bg group-time-down-bg" src="{{imagesPath.iconDetailsBlockRight}}" ></image> -->
        <image class="secKill-time-down-bg group-time-down-bg" :src="state.imagesPath.seckill_right_icon"></image>
        <view class="group-time-down-tips">{{state.secKillInfo.secKillStatus === "created" ? "距开始还有" : "距结束仅剩"}}</view>
        <view class="secKill-time-down-show group-time-down-show">
          <text class="last-hour txt">{{state.time.hour}}</text>
          <text class="colon"> : </text>
          <text class="last-minute txt">{{state.time.minute}}</text>
          <text class="colon"> : </text>
          <text class="last-second txt">{{state.time.second}}</text>
          <!-- <text class="colon">:</text> -->
        </view>
      </view>
      <view class="secKill-time-down group-time-down" v-else>活动已结束</view>
    </view>
    <!-- 拼团 -->
    <view class="secKill-box group-box" v-else-if="state.isTeam">
      <image :src="state.imagesPath.promo_bg" mode="" class="cuxiao_bg seckill_bg"></image>
      <image :src="state.imagesPath.team_icon" mode="" class="cuxiao_icon seckill_icon"></image>
      <view class="seckill_label">拼团<text class="group-number">{{state.groupNumber}}人团，组团成功享优惠价</text></view>
      <view class="secKill-price-box group-people-number">
        <view class="secKill-price-box group-price-box">
          <text class="secKill-nowPrice group-nowPrice">￥<text>{{state.teamAllPrice}}</text></text>
        </view>
        <view class="secKill-price-right group-price-oldPrice">
          <text class="group-oldPrice" v-if="state.originalPrice && state.teamLeaderPrice < state.originalPrice">￥{{state.originalPrice}}</text>
        </view>
      </view>
      <view class="secKill-time-down group-time-down" v-if="state.groupStatus !== 'FINISHED'">
        <image class="team-time-down-bg group-time-down-bg" :src="state.imagesPath.team_right_icon"></image>
        <view class="group-time-down-tips team-time-down-tips">{{state.groupStatus === "UNOPENED" ? "距拼团开始" : "距拼团结束"}}</view>
        <view class="group-time-down-show team-time-down-show">
          <text class="last-hour txt">{{groupTime.day}}</text>
          <text class="colon">天</text>
          <text class="last-hour txt">{{groupTime.hou}}</text>
          <text class="colon">:</text>
          <text class="last-minute txt">{{groupTime.min}}</text>
          <text class="colon">:</text>
          <text class="last-second txt">{{groupTime.sec}}</text>
        </view>
      </view>
      <view class="group-time-down" v-else>
        <image class="group-time-down-bg" :src="state.imagesPath.iconGroupRightDetails"></image>活动已结束
      </view>
    </view>
    <!-- 商品名称价格等 -->
    <view v-else-if="state.promotionPrice && (!state.memberPrice || (promotionMinSellPrice ? promotionMinSellPrice < state.memberPrice : state.promotionPrice < state.memberPrice))" class="promotion_price_box">
      <image :src="state.imagesPath.promo_bg" mode="" class="cuxiao_bg"></image>
      <image :src="state.imagesPath.promo_icon" mode="" class="cuxiao_icon"></image>
      <view class="promotion_label">{{state.currentPage === 'welfarePlan' ? '福利价' : '促销'}}</view>
      <!-- <text class="goods-nowPrice" ><text>￥</text>{{promotionPrice}}</text> -->
      <text class="goods-nowPrice"><text>￥</text>{{state.specificationsFlag && promotionMinSellPrice != promotionMaxSellPrice ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.promotionPrice)}}</text>
      <text class="goods-oldPrice" v-if="!promotionMinSellPrice && (state.promotionPrice < state.sellPrice || state.promotionPrice < state.originalPrice)">￥{{state.sellPrice > state.originalPrice ? state.sellPrice : state.originalPrice}}</text>
    </view>
    <!-- 花艺师、服务项目 -->
    <view v-else-if="state.goodType === 'service' || state.goodType == 'florist'" class="promotion_price_box florist_price_box">
      <view>
        <text class="goods-nowPrice"><text>￥</text>{{state.serviceMinPrice != state.serviceMaxPrice ? filters.filtToFix(state.serviceMinPrice) + '-' + filters.filtToFix(state.serviceMaxPrice) : filters.filtToFix(state.serviceMaxPrice)}}</text>
        <!-- <text class="goods-oldPrice" wx:if="{{serviceOriginalSellPrice && serviceMaxPrice < serviceOriginalSellPrice}}">￥{{filters.filtToFix(serviceOriginalSellPrice)}}</text> -->
      </view>
    </view>
    <!-- 预售 -->
    <view v-else-if="state.goodType === 'advanceSell'" class="promotion_price_box">
      <image :src="state.imagesPath.pre_bg" mode="" class="cuxiao_bg"></image>
      <image :src="state.imagesPath.pre_icon" mode="" class="cuxiao_icon pre_icon"></image>
      <view class="promotion_label">预售</view>
      <view class="promotion_price_box1">
        <text class="goods-nowPrice" :hidden="pdtDetail.sellPrice ? false : true">
          <text>预售价￥</text>{{filters.filtToFix(pdtDetail.sellPrice)}}
        </text>
        <view class="price-item front-money" v-if="pdtDetail.payType === 'PARTIAL'">
          定金￥<text class="price" :hidden="pdtDetail.frontPrice ? false : true">{{filters.filtToFix(pdtDetail.frontPrice)}}</text>
        </view>
      </view>
    </view>
    <view :class="'goods-info-box ' + (state.isTeam ? 'group' : '')">
      <view class="goods-price-box" v-if="state.goodType !== 'advanceSell' && !state.isService && !state.isFlorist && !state.isSecKill && !state.isTeam && !(state.promotionPrice && (!state.memberPrice || (promotionMinSellPrice ? promotionMinSellPrice < state.memberPrice : state.promotionPrice < state.memberPrice)))">
        <view v-if="state.goodType === 'score'">
          <text class="goods-nowPrice" v-if="!state.scoreInfo.amount">{{state.scoreInfo.score}} <text>积分</text></text>
          <text class="goods-nowPrice" v-if="state.scoreInfo.amount">{{state.scoreInfo.score + '积分+' + state.scoreInfo.amount + '元'}}</text>
          <!-- <text class="goods-oldPrice" wx:if="{{scoreInfo.originalPrice}}">￥{{scoreInfo.originalPrice}}</text> -->
        </view>
        <!-- <view class="goods-price" wx:if="{{state.goodType === 'advanceSell'}}">
          <view class='price-item'>
            预售价
            <text class="price" hidden="{{pdtDetail.sellPrice ? false : true}}">￥{{filters.filtToFix(pdtDetail.sellPrice)}}</text>
          </view>
          <view class='price-item front-money' wx:if="{{pdtDetail.payType === 'PARTIAL'}}">
            定金
            <text class="price" hidden="{{pdtDetail.frontPrice ? false : true}}">￥{{filters.filtToFix(pdtDetail.frontPrice)}}</text>
          </view>
        </view> -->
        <view v-else-if="state.promotionPrice != null">
          <text class="goods-nowPrice" v-if="state.promotionPrice < state.memberPrice"><text>￥</text>{{state.specificationsFlag ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.promotionPrice)}}</text>
          <view v-else> 
            <view class="vip-price" style="margin-right: 10rpx;">
              <view class="vip-label">
                <image :src="state.imagesPath.iconVipLabel"></image>
                <text>{{state.vipGradeConfig.priceLabel}}</text>
                <!-- <text>会员价</text> -->
              </view>
              </view>
              <text class="goods-nowPrice"><text>￥</text>{{state.specificationsFlag && promotionMinSellPrice != promotionMaxSellPrice ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.memberPrice)}}</text>
          </view>
          <text class="goods-oldPrice">{{state.sellPrice && state.sellPrice > state.promotionPrice ? '￥' + filters.filtToFix(state.sellPrice) : ''}}</text>
        </view>
        <view v-else>          
          <view v-if="state.memberPrice && state.memberPrice < state.sellPrice && state.memberPrice < state.sellPrice">
            <view class="vip-price" style="margin-right: 10rpx;">
              <view class="vip-label">
                <image :src="state.imagesPath.iconVipLabel"></image>
                <text>{{state.vipGradeConfig.priceLabel}}</text>
                <!-- <text>会员价</text> -->
              </view>
              </view>
              <text class="goods-nowPrice"><text>￥</text>{{state.specificationsFlag && promotionMinSellPrice != promotionMaxSellPrice ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.memberPrice)}}</text>
          </view>
          <view v-else>
            <text class="goods-nowPrice" v-if="!state.originalPrice || state.sellPrice && state.sellPrice && state.sellPrice !== undefined"><text>￥</text>{{state.specificationsFlag && promotionMinSellPrice != promotionMaxSellPrice ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.minSellPrice || state.sellPrice)}}</text>
          </view>
            <view class="vip-price" v-if="state.memberPrice && state.memberPrice < state.sellPrice && state.memberPrice < state.sellPrice" style="margin-left: 10rpx;">
              <text class="goods-oldPrice">￥{{filters.filtToFix(state.sellPrice)}}</text>
              <view class="vip-label">
              </view>
          </view>
          <text class="goods-oldPrice" v-else-if="state.originalPrice && state.sellPrice < state.originalPrice">￥{{filters.filtToFix(state.originalPrice)}}</text>
        </view>
        <text class="share-commission" v-if="state.systemOptions.hasDistributionCenter && state.isDistributor && state.commissionTotal > 0">分享可得佣金: ￥{{filters.filtToFix(state.commissionTotal)}}</text>
      </view>
      <view class="goods-name">
        <view>{{state.name}}<image class="gradeImg" v-if="state.isFlorist && state.serviceStaff && state.serviceStaff.gradeImg" mode="heightFix" :src="state.serviceStaff.gradeImg"></image></view>
      </view>
      <view class="desc-share" v-if="state.isTeam && state.groupDescription || state.description">
        <view class="goods-desc">{{state.isTeam ? state.groupDescription : state.description}}</view>
        <!-- <view class='share-reamin' bindtap='handleClickShare'>
          <image src="http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconShare.png" ></image> 分享
        </view> -->
      </view>
      <view class="shipper_type" :style="'color: ' + state.themeColor + ';border-color: ' + state.themeColor" v-if="pdtDetail.shipperType && pdtDetail.shipperType != 'STORE' && !state.zhiti">
        {{state.shipperTypeObj[pdtDetail.shipperType]}}
      </view>
      <view class="share-reamin" @click="handleClickShare" :style="state.isSecKill && state.secKillInfo || state.goodType === 'advanceSell' || state.isTeam ? 'top: 24rpx' : ''">
        <image :src="state.imagesPath.share_shopping_cart"></image> 
        <view>
          分享
        </view>
      </view>
      <view v-if="state.deliveryTimeStatement" class="deliveryDesc">
        {{state.deliveryTimeStatement}}
      </view>
      <view class="sold_box" v-if="!state.isService && !state.isFlorist">
        <!-- <view class="goods-soldNum"  style="color:{{balance<=10?'#FF7121':'#000000'}};"><text>库存</text> {{balance}}</view> -->
        <view class="goods-soldNum" v-if="state.goodsList && state.goodsList[0] && state.goodsList[0].style != 'MEALS2'"><text>库存</text> {{state.balance}}</view>
        <view class="goods-soldNum" v-if="!state.isSecKill && !state.isTeam"><text>已售</text> {{state.soldCount ? state.soldCount : 0}}</view>
        <view class="desc-soldNum" v-if="state.isTeam || state.isSecKill">
          <text class="goods-soldNum"><text>已售</text> {{state.soldCount ? state.soldCount : 0}}</text>
          <text class="share-commission" :style="'color:' + state.themeColor" v-if="state.systemOptions.hasDistributionCenter && state.isDistributor && state.commissionTotal > 0">分享可得佣金: ￥{{state.commissionTotal}}</text>
        </view>
      </view>
      <view class="sold_box sold_box1" v-else>
        <view class="goods-soldNum">
          <image :src="state.imagesPath.floristPeopleNum" mode="heightFix"></image>{{state.soldCount}}人<text>预约过 | 最早可约</text>{{state.appointmentTime}}
        </view>
        <!-- wx:if="{{isService}}"  -->
        <view class="goods-soldNum goods-soldNum1">
          <image :src="state.imagesPath.floristDuration" mode="heightFix"></image>
          <text>服务时长</text> {{state.serviceDuration1 ? state.serviceDuration1 + '-' : ''}}{{state.serviceDuration}}分钟
        </view>
      </view>
      <view class="goods-delivery-info" v-if="state.storeInfo.merchantDelivery">
        <image :src="state.imagesPath.iconStoreSelfDelivery" mode="widthFix"></image>{{state.storeSelfDeliveryInfo.content}}</view>
      <!-- <view class="goods-promise">
        <view>
          <image src="{{state.imagesPath.iconQuality}}" ></image>
          <text>品质保障</text>
        </view>
        <view>
      <image src="{{state.imagesPath.iconRefundable}}" ></image>
      <text>坏果包退换</text>
    </view>
    <view>
      <image src="{{state.imagesPath.iconSun}}" ></image>
      <text>新鲜水果</text>
    </view>
      </view> -->
    </view>
    <!-- 促销信息、标签 -->
    <view class="labels-board" :hidden="state.goodsLabels.length === 0 || state.currentPage === 'welfarePlan'">
      <view class="labels-title">促销:</view>
      <view class="labels-content-board">
        <view class="labels-content" v-for="(item , index) in state.goodsLabels" :key="index">
          <view class="labels-tag" v-if="item.labelName && !item.imageUrl">{{item.labelName}}</view>
          <view v-else-if="item.imageUrl">
            <image :src="item.imageUrl" style="width: 100rpx" mode="widthFix"></image>
          </view>
          <text>{{item.labelDetails || ''}}</text>
        </view>
      </view>
    </view>
    <view class="team-rules" v-if="state.isTeam">
      <!-- 开团或参团》邀请好友参团》满员发货/自提。 -->
      <!-- 拼团引导步骤 -->
        <image :src="state.imagesPath.team_tip" class="team_tip_icon"></image>
      <!-- <view class='process_wrap' wx:for="{{state.processData}}" wx:key="id">
        <view class='process'>
          <view class="process_line" wx:if="{{item.id === 1}}" style="background: #fff"></view>
          <view class='process_line' wx:else style="background:{{item.start}}"></view>
          <image class="process_icon" src="{{item.number}}"></image>
          <view class='process_line' style="background:{{item.end}}"></view>
        </view>
        <text class='process_name'>{{item.name}}</text>
      </view> -->
      <text @click="rulesDetail" style="padding-top:15rpx">拼团玩法详情>></text> 
    </view>
    <!-- 拼团 -->
    <view class="team-box" v-if="state.isTeam && state.teamBuyList.length > 0">
      <view class="team-title">
        <image :src="state.imagesPath.iconTeamBuy"></image>
        <text>小伙伴们正在等你参团呢！</text>
        <view class="more" @click="toAllTeamList">
          <image :src="state.imagesPath.iconRight1"></image>立即参与</view>
      </view>
      <view v-for="(item , index) in state.teamBuyList" :key="index" v-if="index < 2">
        <!--<template is="teamItem" :data="item"></template>-->
      </view>
      <view class="no-data" :hidden="state.teamBuyList.length > 0 ? true : false">暂无正在进行中的拼团，赶快开团吧~</view>
    </view>
    <!-- 预售 -->
    <view class="goods-presell" v-if="state.advanceSell">
      <!-- <text>预售时间</text> -->
      <view class="presell-box">
        <view class="presell-item">
          <text class="top" v-if="state.advanceSellInfo.payType === 'PARTIAL'">1.预付订金</text>
          <text class="top" v-if="state.advanceSellInfo.payType === 'FULL'">1.预付全款</text>
          <!-- <view class="presell-icon"></view> -->
          <text class="bottom">{{state.advanceSellTime.advanceSellDate}}</text>
        </view>
        <view class="presell-item" v-if="state.advanceSellInfo.payType === 'PARTIAL'">
          <text class="top">2.支付尾款</text>
          <!-- <view class="presell-icon"></view> -->
          <text class="bottom">{{state.advanceSellTime.balanceDate}}</text>
        </view>
        <view class="presell-item">
          <text class="top" v-if="state.advanceSellInfo.shipmentType === 'SELF'">{{state.advanceSellInfo.payType === 'PARTIAL' ? '3.' : '2.'}}提货/发货时间</text>
          <text class="top" v-else-if="state.advanceSellInfo.shipmentType === 'EXPRESS'">{{state.advanceSellInfo.payType === 'PARTIAL' ? '3.' : '2.'}}发货时间</text>
          <text class="top" v-else>{{state.advanceSellInfo.payType === 'PARTIAL' ? '3.' : '2.'}}提货/发货时间</text>
          <!-- <view class="presell-icon"></view> -->
          <!-- <text wx:if="{{advanceSellInfo.payType==='PARTIAL' && advanceSellTime.deliverTime}}">支付尾款后{{advanceSellTime.deliverTime}}天</text> -->
          <text v-if="state.advanceSellInfo.payType === 'PARTIAL' && state.advanceSellTime.deliverTime">预售活动结束{{state.advanceSellTime.deliverTime}}天后</text>
          <text v-if="state.advanceSellInfo.payType === 'FULL' && state.advanceSellTime.deliverTime">预售活动结束{{state.advanceSellTime.deliverTime}}天后</text>
          <text class="bottom" v-if="state.advanceSellInfo.orderSelfTime">{{state.advanceSellTime.orderSelfTime}}</text>
        </view>
      </view>
    </view>
    <!-- 关联券 -->
    <view class="goods-related-coupon" @click="showRelateCoupon" :hidden="state.relatedCouponList.length === 0">
      <text style="flex-shrink: 0;width: 70rpx;">领券:</text>
      <view class="related-coupon-board">
        <view class="goods-mini-coupon" v-for="(item , index) in state.relatedCouponList" :key="id">{{item.name}}</view>
      </view>
      <view class="rt">
        <text>领取</text>
        <image :src="righticon" mode="widthFix"></image>  
      </view>
    </view>
    <!-- 打包一口价 -->
    <view class="goods-packaging" @click="toPackaging" v-if="state.packaging">
      <view>{{state.packaging.labelName}}</view>
      <view class="rt">
        <text>去凑单</text>
        <image :src="righticon" mode="widthFix"></image>  
      </view>
    </view>
    <!-- 规格 -->
    <view class="goods-standard" v-if="state.specificationsFlag && state.specifications">
      <text>规格：</text>
      <text>{{state.specifications}}</text>
    </view>
    <!-- 商品自定义栏目 页眉 -->
    <good-attr :columnDTOS="state.columnDTOSHeader" @changeShow="changeShow" v-if="state.columnDTOSHeader && state.columnDTOSHeader.length > 0"></good-attr>
    <!-- <view class="custom-box" wx:if="{{state.columnDTOSHeader && state.columnDTOSHeader.length > 0}}">
        <view class="custom-list" wx:for="{{state.columnDTOSHeader}}" wx:key="index">
            <view class="custom-name">
                <text>{{item.propertyName}}</text>
                <view class="custom-btn" bind:tap="changeisExpand" data-index="{{index}}" data-location="{{item.location}}">
                    <image src="{{state.imagesPath.upIcon}}" class="{{item.isExpand === 1 ? 'up-icon' : 'up-icon rotate-icon'}}" mode=""></image>
                </view>
            </view>
            <view class="custom-content"  wx:for="{{item.propertyValue}}" wx:key="idx" wx:for-index="idx" wx:for-item="itemProperty">
                <view wx:if="{{item.type === 1}}" class="custom-keyvalue" hidden="{{item.isExpand === 2 ? true : false}}">
                    <text class="keyvalue-title">{{itemProperty.label}}：</text>
                    <text>{{itemProperty.value}}</text>
                </view>
                <view wx:elif="{{item.type === 2}}" hidden="{{item.isExpand === 2 ? true : false}}">
                    <image class="custom-image" src="{{itemProperty.imageUrl}}" width="{{itemProperty.imageWidth}}" mode="widthFix"></image>
                </view>
                <view wx:elif="{{item.type === 3}}" hidden="{{item.isExpand === 2 ? true : false}}">
                    <view>
                        <text class="custom-text">{{itemProperty.text}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view> -->
    <!-- 商品详情 -->
    <view class="goods-details" :hidden="state.productProperties.length === 0 ? true : false">
      <view v-for="(item , index) in state.productProperties" :key="index" v-if="item.propertyName !== '规格'">
        <text>{{item.propertyName}}</text>
        <text>{{item.propertyValue}}</text>
      </view>
    </view>
    <!-- 关联商品 -->
    <view class="goods-comment" :hidden="state.relatedProductList.length === 0">
      <text class="comment-title-relation">关联商品</text>
      <scroll-view scroll-x="" style="width: 100%" class="relevant-scrollview">
        <view v-for="(item , index) in state.relatedProductList" :key="idx">
          <goods-item-small :goods="item" :goodsWidth="'230rpx'" style="display: inline-block;margin-right: 32rpx;" :hasUserInfo="state.hasUserInfo" @onClickGoods="onClickGoods" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></goods-item-small>
        </view>
      </scroll-view>
    </view>
    <!-- 预约位置 -->
    <view class="goods-appointment" v-if="state.isService || state.isFlorist">
      <view class="appointment-title">
        <text>预约</text>
        <view @click="appointmentConfirm" :style="'background-color: ' + state.themeColor + ';'">确认预约</view>
      </view>
      <scroll-view scroll-x="" enable-flex="" class="appointment-scroll goods-appointment-list" v-if="state.serviceItemList && state.serviceItemList.length > 0">
        <view v-for="(item , index) in state.serviceItemList" :data-idx="index" :data-item="item" @click=" item.isOptional ? 'changeService' : ''" class="goods-appointment-item" :style="(item.isOptional ? '' : 'background-color: #F2F2F2;') + (index == state.activeServiceIdx ? 'border: 1px solid ' + state.themeColor : 'border: 1px solid transparent')">
          <view class="img-box">
            <image :src="item.productImageUrl || item.serviceStaffAvatar || item.serviceStaffImageUrl || item.imageUrl" mode="widthFix"></image>
            <image class="service-staff-grade" :src="item.serviceStaffGradeImg" mode="heightFix"></image>
          </view>
          <view>
            {{item.productName || item.name || item.serviceStaffNickname || item.nickname}}
          </view>
          <!-- wx:if="{{isFlorist}}"  -->
          <view class="goods-earliest-time">
            最早可约{{item.earliestTime}}
          </view>
          <view>
            <text class="goods-nowPrice"><text>￥</text>{{filters.filtToFix(item.activityPrice)}}</text>
            <text class="goods-oldPrice"><text>￥</text>{{filters.filtToFix(item.originalSellPrice)}}</text>
          </view>
          <view class="goods-check" :style="'background: ' + (index == state.activeServiceIdx ? state.themeColor : '#fff') + ';border: 1px solid ' + (index == state.activeServiceIdx ? state.themeColor : '#999') + ';'">
            <image v-if="index == state.activeServiceIdx" style="width: 11px" :src="trueIcon" mode="widthFix"></image>
          </view>
        </view>
      </scroll-view>
      <scroll-view v-if="state.serviceItemList && state.serviceItemList.length > 0" scroll-x="" enable-flex="" class="appointment-scroll week-list">
        <view v-for="(item , index) in state.serviceItemList[activeServiceIdx].datetimeList" :data-item="item" :data-idx="index" @click="item.rest ? '' : 'changeWeek'" :class="'week-item ' + (item.rest ? 'week-disabled' : '')" :style="'color: ' + (index == state.activeWeekIdx ? state.themeColor : '#999999')">
          {{state.weekList[item.weekIndex]}}
          <view v-if="index == state.activeWeekIdx" :style="'background-color: ' + state.themeColor"></view>
        </view>
      </scroll-view>
      <view v-if="state.serviceItemList && state.serviceItemList.length > 0" class="time-list">
        <view v-for="(item , index) in state.serviceItemList[activeServiceIdx].datetimeList[activeWeekIdx].newTimeList" :key="index" :data-item="item" :data-idx="index" @click="!item.isOptional || item.isDisabled ? '' : 'changeTime'" :class="'time-item ' + (!item.isOptional || item.isDisabled ? 'time-disabled' : '')" :style="(!item.isOptional ? 'border: 1px solid #DADADA;' : '') + 'background-color: ' + (item.isSelect && item.isOptional ? state.themeColor : !item.isOptional || item.isDisabled ? '#fff' : '#F2F2F2') + ';color: ' + (item.isSelect ? '#fff' : '#333333')">
          {{item.time}}
          <view class="disabled-logo" v-if="!item.isOptional">约满</view>
        </view>
      </view>
      <view class="no-data-img-box" v-if="(!state.serviceItemList || state.serviceItemList.length == 0) && !state.serviceLoading">
        <image class="no-data-img" :src="state.isFlorist ? state.imagesPath.noServiceItems : state.imagesPath.noServiceStaff" mode="widthFix"></image>
      </view>
    </view>
    <!-- 图文详情 -->
    <view class="goods-imgtext" id="productDetails" :hidden="state.productDetails.length === 0 ? true : false">
      <text>{{state.isFlorist ? '作品展示' : '图文详情'}}</text>
      <view v-for="(item , index) in state.productDetails" :key="index">
        <image show-menu-by-longpress="true" v-if="item.fileType == 'PICTURE' || !item.fileType" :src="item.url" mode="widthFix"></image>
        <video v-if="item.fileType == 'VIDEO'" :src="item.url" show-mute-btn="true" loop="" style="width: 100%;" class="slide-video"></video>

      </view>
      <!-- <image  :src="dateilIcon"  style="width: 100%;height: 616rpx;"></image> -->
    </view>

    <!-- 商品自定义栏目 页脚 -->
    <good-attr :columnDTOS="state.columnDTOSFooter" @changeShow="changeShow" v-if="state.columnDTOSFooter && state.columnDTOSFooter.length > 0"></good-attr>
    <!-- <view class="custom-box" wx:if="{{state.columnDTOSFooter && state.columnDTOSFooter.length > 0}}">
        <view class="custom-list" wx:for="{{state.columnDTOSFooter}}" wx:key="index">
            <view class="custom-name">
                <text>{{item.propertyName}}</text>
                <view class="custom-btn" bind:tap="changeisExpand" data-index="{{index}}" data-location="{{item.location}}">
                    <image src="{{state.imagesPath.upIcon}}" class="{{item.isExpand === 1 ? 'up-icon' : 'up-icon rotate-icon'}}" mode=""></image>
                </view>
            </view>
            <view class="custom-content"  wx:for="{{item.propertyValue}}" wx:key="idx" wx:for-index="idx" wx:for-item="itemProperty">
                <view wx:if="{{item.type === 1}}" class="custom-keyvalue" hidden="{{item.isExpand === 2 ? true : false}}">
                    <text class="keyvalue-title">{{itemProperty.label}}：</text>
                    <text>{{itemProperty.value}}</text>
                </view>
                <view wx:elif="{{item.type === 2}}" hidden="{{item.isExpand === 2 ? true : false}}">
                    <image class="custom-image" src="{{itemProperty.imageUrl}}" width="{{itemProperty.imageWidth}}" mode="widthFix"></image>
                </view>
                <view wx:elif="{{item.type === 3}}" hidden="{{item.isExpand === 2 ? true : false}}">
                    <view>
                        <text class="custom-text">{{itemProperty.text}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view> -->
    <!-- 商品评论 -->
    <view class="goods-comment" :hidden="state.commentList.length === 0 ? true : false">
      <view class="comment-title">商品评价({{state.commentNum}})</view>
      <view v-for="(item , index) in state.commentList" :key="idx">
        <!--<template is="commentItem" :data="item, state.imagesPath"></template>-->
      </view>
      <view class="more" @click="toGoodsComment" :style="'color:' + state.themeColor + ';border-color:' + state.themeColor + ';'">查看全部评价</view>
    </view>
    <view :class="state.isIphoneX ? 'botton-block botton-block-ios' : 'botton-block'"></view>
    <view :class="!state.productPlacedAtTheTop && state.isIphoneX ? 'nav-ios' : !state.productPlacedAtTheTop ? 'nav-android' : 'nav-height'"></view>
    <!-- 底部按钮 -->
    <view :class="state.isIphoneX ? 'handle-box handle-box-ios' : 'handle-box'" v-if="!state.isService && !state.isFlorist">
      <view class="home-icon " @click="toHomePage">
        <image :src="state.imagesPath.home_icon" mode="widthFix"></image>
        <text>主页</text>
      </view>
      <view @click="toShopCart" class="shopcart-icon">
        <image :src="state.imagesPath.shopping_icon" mode="widthFix"></image>
        <text>购物车</text>
        <view v-if="state.shopCartNum > 0">
          <view class="badge">{{state.shopCartNum}}</view>
        </view>
      </view>
      <view v-if="state.customerService != 'NONE'" @click="isOpenCustomerService ? '' : 'callPhone'" class="contact-icon">
        <button v-if="state.isOpenCustomerService" open-type="contact">
        <image :src="state.imagesPath.iconCustomerService" mode="widthFix"></image>
        <text>客服</text>
      </button></view>
      <!-- <view class="share-reamin1" bindtap='handleClickShare'>
        <image src="{{state.imagesPath.share_icon}}" ></image>
        <text>分享</text>
      </view> -->
      <!-- 普通商品 组合商品-->
      <view v-if="!state.isTeam && !state.isSecKill && !state.advanceSell && state.goodType !== 'score'" :style="state.balance <= 0 || state.soldOut === true ? '' : state.themeColor ? 'border: 1px solid ' + state.themeColor : ''" :class="'normal-button ' + (state.balance <= 0 ? 'no-goods' : '')">
        <view v-if="state.soldOut === true">
          <button class="soldOut-good">
            已下架
          </button>
        </view>
        <view v-else>
          <view v-if="state.balance > 0">
            <button v-if="!state.hasUserInfo" :style="'background-color: ' + state.themeColor" @click="getUserInfo">{{state.balance > 0 ? '加入购物车' : '已售罄'}}</button>
            <view v-else>
              <form @submit="openGoodsSpecs" v-if="state.sellPrice > 0" @click.stop="addShopCartCatch" class="f1">
                <button class="add-cart" :style="'color: ' + state.themeColor" form-type="submit" :data-id="goodsId" data-addtype="detail">加入购物车</button>
              </form>
              <form @submit="openGoodsSpecs" :style="state.sellPrice <= 0 ? 'width: 100%;' : ''" @click.stop="addShopCartCatch">
                <button form-type="submit" :style="(state.sellPrice <= 0 ? 'width: 100%;' : '') + 'background-color: ' + state.themeColor" :data-id="goodsId" data-addtype="buyNow">立即购买</button>
              </form>
            </view>
          </view>
          <view v-else>
            <button class="btnw" v-if="!state.hasUserInfo" :style="'background-color: ' + state.themeColor + ';border: 1px solid ' + state.themeColor" @click="getUserInfo">已售罄</button>
            <view v-else>
              <form @submit="openGoodsSpecs" @click.stop="addShopCartCatch">
                <button class="btnw" form-type="submit" :style="'background-color: ' + state.themeColor + ';border: 1px solid ' + state.themeColor" :data-id="goodsId" data-addtype="detail">已售罄</button>
              </form>
            </view>
          </view>
        </view>
      </view>
      <!-- 积分 -->
      <!-- <view wx:if="{{goodType==='score'}}" style="border: 1px solid {{themeColor}};" class="{{balance<=0||scoreInfo.score>score?'no-goods':''}}"> -->
    <view v-if="state.goodType === 'score'" :class="state.balance <= 0 || state.scoreInfo.score > state.score ? 'no-goods' : ''">
        <form @submit="scoreExchange">
          <button v-if="!state.hasUserInfo" class="bg-009f55 btnw now-change" :style="'background-color: ' + state.themeColor" @click="getUserInfo">立即兑换</button>
          <button v-else-if="!state.isMember" class="bg-009f55 btnw now-change" :style="'background-color: ' + state.themeColor" @click="toAuthorize">立即兑换</button>
          <view v-else>
            <button form-type="submit" class="btnw now-change" :data-id="goodsId" :style="'background-color: ' + state.themeColor" v-if="state.balance > 0 && state.score >= state.scoreInfo.score">立即兑换</button>
            <button form-type="submit" class="btnw" :data-id="goodsId" :style="'background-color: ' + state.themeColor" v-if="state.balance > 0 && state.score < state.scoreInfo.score">积分不足</button>
            <button form-type="submit" class="btnw" :data-id="goodsId" :style="'background-color: ' + state.themeColor" v-if="state.balance <= 0">您来晚了，商品已兑完</button>
          </view>
        </form>
      </view>
      <!-- 拼团 -->
      <view v-if="state.isTeam" :style="state.balance <= 0 ? '' : 'border: 1px solid ' + state.themeColor" :class="'team-button ' + (state.balance <= 0 ? 'no-goods' : '') + ' f1'">
        <view v-if="state.soldOut">
          <button class="soldOut-good" style="margin-top:10rpx;">已下架</button>
        </view>
        <view v-else>
          <form @submit="openGoodsSpecs" @click.stop="addShopCartCatch">
            <button form-type="submit" class="add-cart" :style="'color: ' + state.themeColor" :data-id="goodsId" data-goodtype="teambuy" data-addtype="buyNow" v-if="state.balance > 0">
              <text>￥{{filters.filtToFix(state.sellPrice)}}</text>
              <text>直接购买</text>
            </button>
            <button form-type="submit" class="add-cart" :style="'color: ' + state.themeColor" :data-id="goodsId" data-addtype="detail" v-if="state.balance <= 0">已售罄</button>
          </form>
          <view v-if="state.teamBuyingType === 'COMMON'">
            <button class="group" :style="'background-color: ' + state.themeColor" v-if="state.groupBalance > 0" data-type="leader" @click="openTeamBuySpecs">
              <text>￥{{filters.filtToFix(state.teamAllPrice)}}</text>
              <text>立即开团</text>
            </button>
            <button class="group" :style="'background-color: ' + state.themeColor" v-if="state.groupBalance <= 0" data-type="leader" @click="openTeamBuySpecs">已售罄</button>
          </view>
          <view v-if="state.teamBuyingType === 'THOUSAND'">
            <form @submit="joinThousandGroup" @click.stop="addShopCartCatch">
              <button form-type="submit" class="group" :style="'background-color: ' + state.themeColor" data-type="member" v-if="state.groupBalance > 0">
                <text>￥{{filters.filtToFix(state.teamMemberAllPrice)}}</text>
                <text>立即参团</text>
              </button>
              <button form-type="submit" class="group" :style="'background-color: ' + state.themeColor" v-if="state.groupBalance <= 0">已售罄</button>
            </form>
          </view>
          <button v-if="!state.hasUserInfo" class="authorization" :style="'color: ' + state.themeColor" @click="getUserInfo"></button>
        </view>
      </view>
      <!-- 秒杀 -->
      <view v-if="state.isSecKill" :style="'border: 1px solid ' + state.themeColor + ';'" :class="'seckill ' + (state.secKillInfo.availableStockAmount == 0 || state.balance <= 0 ? 'no-seckill-goods' : '')">
        <view v-if="state.soldOut">
          <button class="soldOut-good">已下架</button>
        </view>
        <view v-else>
          <view v-if="state.secKillInfo.secKillStatus === 'created'">
            <button v-if="!state.hasUserInfo" class="authorization" :style="'background-color: ' + state.themeColor" @click="getUserInfo"></button>
            <button style="background-color: #d9d9d9; width: 460rpx;" data-type="grab" @click="openGrabGoodsSpecs">
              距离开抢还有{{state.time.hour}}:{{state.time.minute}}:{{state.time.second}}
            </button>
          </view>
          <view v-else>
            <button v-if="!state.hasUserInfo" class="authorization" :style="'background-color: ' + state.themeColor" @click="getUserInfo"></button>
            <!-- <form  bindsubmit="openGrabGoodsSpecs" catchtap="addShopCartCatch">
              <button form-type="submit" data-id="{{goodsId}}" style="color: {{state.themeColor}}" data-addtype="detail" data-type="cart" wx:if="{{state.balance > 0}}">加入购物车</button>
              <button form-type="submit" data-id="{{goodsId}}" style="color: {{state.themeColor}}" data-addtype="detail" data-type="cart" wx:if="{{state.balance <= 0}}">已售罄</button>
            </form> -->
            <button v-if="state.secKillInfo.availableStockAmount > 0 && state.balance > 0" :style="'background-color: ' + state.themeColor" data-type="grab" @click="openGrabGoodsSpecs">立即抢购</button>
            <button v-if="state.secKillInfo.availableStockAmount == 0 && state.balance >= 0" :style="'background-color: ' + state.themeColor" data-type="grab" @click="openGrabGoodsSpecs">已抢完</button>
            <button v-if="state.secKillInfo.availableStockAmount > 0 && state.balance <= 0" :style="'background-color: ' + state.themeColor" data-type="grab" @click="openGrabGoodsSpecs">补货中</button>
          </view>
        </view>
      </view>
      <!-- 预售 -->
      <view v-if="state.advanceSell" :class="'advanceSell_button ' + (state.advanceSellInfo.advanceAmount == 0 || !state.advanceSellInfo.balance ? 'no-goods' : '')">
          <!-- <text wx:if="{{advanceSellInfo.advanceAmount>0}}">立即预定</text> -->
          <button class="btnw" v-if="!state.hasUserInfo" style="background-color: #7E21EC" @click="getUserInfo">{{state.isAdvanceSellActiveEnd ? "活动已结束" : state.isAdvanceSellActiveStart ? "立即预定" : "活动未开始"}}</button>
          <button class="btnw" v-else-if="state.advanceSellInfo.shelvesStatus == 'OFF' || state.advanceSellInfo.shelvesStatus == 'DELETED'" style="background-color: #7E21EC" @click="toPayAdvanceSell">已下架</button>
          <view v-else>
            <button class="btnw" v-if="state.advanceSellInfo.advanceAmount > 0 && state.advanceSellInfo.balance && !state.isAdvanceSellActiveEnd" style="background-color: #7E21EC" @click="handleNext">{{state.isAdvanceSellActiveStart ? "立即预定" : "活动未开始"}}</button>
            <button class="btnw" v-else-if="(state.advanceSellInfo.advanceAmount == 0 || !state.advanceSellInfo.balance) && !state.isAdvanceSellActiveEnd" :style="'background-color: ' + state.themeColor" @click="toPayAdvanceSell">已售罄</button>
            <button v-else class="btnw" style="background-color: #7E21EC">活动已结束</button>
          </view>
          <!-- <text wx:if="{{advanceSellInfo.advanceAmount==0}}">已售罄</text> -->
      </view>
    </view>
    <view class="modal-box" :hidden="!state.groupModal" data-type="group" @click="clickBlank">
      <view class="modal-body" @click.stop="clickBody">
        <view class="modal-content join-group">
          <view class="title">一起参与拼团</view>
          <view class="group-info">
            <view>仅剩余
              <text>{{state.groupInfo.teamMemberCount - state.groupInfo.joinMemberCount}}</text>个参团名额可用,赶紧来参团吧!</view>
            <view>
              <image :src="state.imagesPath.iconSecKilling"></image>火热拼团ing
              <text>{{state.countDownTime.hou}}:{{state.countDownTime.min}}:{{state.countDownTime.sec}}</text>后结束。</view>
          </view>
          <view class="group-people-list">
            <view v-if="state.groupInfo.teamBuyingType !== 'THOUSAND'">
              <view class="people-item leader" v-for="(item , idx) in state.groupInfo.joinMbrs" :key="idx" v-if="idx == 0" :hidden="state.groupInfo.joinPeopleCount == 0">
                <image :src="item.avatar"></image>
              </view>
            </view>
            <view v-if="state.groupInfo.teamBuyingType === 'THOUSAND'">
              <view class="people-item" v-for="(item , index) in state.groupInfo.joinMbrs" :key="index" v-if="state.groupInfo.teamPeopleCount > 10 ? index < 9 : index < state.groupInfo.teamPeopleCount">
                <image :src="item.avatar"></image>
              </view>
              <view class="people-item" v-for="(item , index) in state.groupInfo.teamPeopleCount - state.groupInfo.joinPeopleCount" v-if="state.groupInfo.teamPeopleCount > 10 ? index < 9 - state.groupInfo.joinPeopleCount : state.groupInfo.teamPeopleCount - state.groupInfo.joinPeopleCount" :key="index">
                <text>?</text>
              </view>
            </view>
            <view v-if="state.groupInfo.teamBuyingType !== 'THOUSAND'">
              <view class="people-item" v-for="(item , index) in state.groupInfo.joinMbrs" :key="index" v-if="state.groupInfo.teamPeopleCount > 10 ? index < 8 : index < state.groupInfo.teamPeopleCount" :hidden="index == 0">
                <image :src="item.avatar"></image>
              </view>
              <view class="people-item" v-for="(item , index) in state.groupInfo.teamPeopleCount - state.groupInfo.joinPeopleCount" v-if="state.groupInfo.teamPeopleCount > 10 ? index < 9 - state.groupInfo.joinPeopleCount : state.groupInfo.teamPeopleCount - state.groupInfo.joinPeopleCount" :key="index">
                <text>?</text>
              </view>
            </view>
            <view class="people-more" v-if="state.groupInfo.teamMemberCount > 10" :key="index">
              <image :src="state.imagesPath.iconCollageMore"></image>
            </view>
          </view>
          <button v-if="!state.hasUserInfo" class="button-box" @click="getUserInfo">确认拼团</button>
          <button v-else-if="!state.isMember" class="button-box" @click="toAuthorize">确认拼团</button>
          <button v-else class="button-box" data-type="member" @click="openTeamBuySpecs">确认拼团</button>
        </view>
      </view>
    </view>
    <view class="modal-box" :hidden="!state.modal" data-type="goods" @click="clickBlank">
      <view class="modal-body" @click.stop="clickBody">
        <view class="modal-content handle-goods">
          <view class="close" data-type="goods" @click.stop="clickBlank">
            <!-- <image src="{{imagesPath.iconCloseImg}}" mode="widthFix" ></image> -->
            <image :src="state.imagesPath.category_close" mode="widthFix"></image>
          </view>
          <view class="goods-box">
            <view class="goods-img">
              <image :src="imageUrl" mode="widthFix"></image>
            </view>
            <view class="goods-info">
              <view class="goods-name">{{state.name}}</view>
              <view class="goods-desc">{{state.description}}</view>
              <view class="goods-price-box" v-if="state.advanceSell">
                <text>￥{{filters.filtToFix(state.sellPrice)}}</text>
              </view>
              <view class="goods-price-box" v-if="state.isTeam">
                <text>开团价：￥{{filters.filtToFix(state.teamLeaderPrice)}}</text>
                <text>{{state.teamMemberCount}}人团</text>
              </view>
            </view>
          </view>
          <view class="goods-num">
            <text>购买数量：</text>
            <view class="count-box">
              <!-- <view catchtap="handleReduce" class="{{state.productNum <= 1 ? 'unavailable' : ''}}">-</view>
              <input value="{{state.productNum}}" type="number" bindinput="handleInput" />
              <view catchtap="handleAdd">+</view> -->
              <view @click.stop="handleReduce" :style="'border: 1px solid #fb5606;color: ' + state.themeColor + ';border-color: ' + state.themeColor + ';'">-</view>
              <view class="num">
                  <input cursor="0" selection-start="1" selection-end="1" :value="state.productNum" @input="bindProductNumInput" type="number" maxlength="3">
              </view>
              <view @click.stop="handleAdd" :style="'color: #fff;background-color:' + state.themeColor + ';border: 1px solid #fb5606;border-color: ' + state.themeColor + ';'">+</view>
            </view>
          </view>
          <view class="button-box">
            <button class="confirm" :style="'background: ' + state.themeColor + ';border-color:' + state.themeColor" :data-id="goodsInfo.id" v-if="state.advanceSell" @click.stop="toPayAdvanceSell">下一步</button>
            <button class="confirm" :style="'background: ' + state.themeColor + ';border-color:' + state.themeColor" :data-id="goodsInfo.id" v-if="state.isTeam" @click.stop="toPayTeamBuying">下一步</button>
          </view>
        </view>
      </view>
    </view>
    <!--  style="position: absolute;bottom: 0;z-index: -1;" -->
    <view class="share-picture">
      <canvas canvas-id="pictureShareCanvas" style="width:574rpx;height: 460rpx;display: block;position: fixed;left: 9999px;bottom: 0;"></canvas>
    </view>
  </scroll-view>
  <view class="group-share-img-box">
    <canvas canvas-id="groupPictureCanvas">
  </canvas></view>
  <!-- 选择餐饮套餐弹窗 组合商品弹窗-->
  <setMeal :show="state.meals.show" :productId="state.meals.productId" :operateFun="state.operateFun" :storeId="state.meals.storeId" :scource="state.scource" @outcome="chooseOutcome"></setMeal>
  <!-- 普通商品添加购物车 -->
  <popup :show="state.show.goodsNormal" position="bottom" custom-class="bottom" @close="toggleGoodsNormalPopup">
    <view class="spec-box">
       <view class="spec-top-box">
            <view class="spec-img-box">
                <!-- <image src='{{goodsImg}}' bindtap="previewImg"></image> -->
                <image :src="imageUrl" @click="previewImg"></image>
            </view>
            <view class="spec-close-box" @click="toggleGoodsNormalPopup">
                <!-- <image src='{{imagesPath.iconCloseImg}}' mode="widthFix"></image> -->
                <image :src="state.imagesPath.category_close" mode="widthFix"></image>
            </view>
            <view class="price-box">
                <view class="price" v-if="state.isTeam && state.goodtype != 'teambuy'">拼团价￥<text>{{filters.filtToFix(state.teamAllPrice)}}</text></view>
                <view class="price" v-else-if="state.isSecKill">秒杀价￥<text>{{filters.filtToFix(state.secKillInfo.price)}}</text></view>
                <view class="price" v-else-if="isBargainPrice">最低可砍至￥<text>{{filters.filtToFix(state.sellPrice)}}</text></view>
                <view class="price" v-else-if="isSolitairePrice">接龙价￥<text>{{filters.filtToFix(state.sellPrice)}}</text></view>
                <view class="price" v-else-if="!state.isTeam && state.promotionPrice && (!state.sellPrice || state.promotionPrice < state.sellPrice) && (!state.memberPrice || state.promotionPrice < state.memberPrice)">促销价￥<text>{{state.specificationsFlag ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.promotionPrice)}}</text></view>
                <view class="price" v-else-if="state.memberPrice && state.memberPrice < state.sellPrice && state.memberPrice < state.originalPrice">{{state.vipGradeConfig.priceLabel}}￥<text>{{state.specificationsFlag ? filters.filtToFix(promotionMinSellPrice) + '-' + filters.filtToFix(promotionMaxSellPrice) : filters.filtToFix(state.memberPrice)}}</text></view>
                <view class="price" v-else>￥<text>{{filters.filtToFix(state.sellPrice)}}</text></view>
                <!-- <view class='price' style="color: {{themeColor}}" wx:else>￥<text>{{filters.filtToFix(originalPrice)}}</text></view> -->
                <view>{{selectText}}</view>
            </view>
       </view>
        <scroll-view class="spec-con-box" scroll-y="" style="min-height:310rpx;max-height: 580rpx;height:175rpx;">
            <!-- <view class='spec-section' wx:for="{{allSpecs}}" wx:key="i" wx:for-item="specsItem" wx:for-index="col">
            <view class='spec-section-name'>{{specsItem.name}}</view>
            <view class='spec-option'>
                <view class="spec-option-item {{item.isSelect ? 'active' : ''}} {{item.disabled ? 'disabled' : ''}}" style="background: {{item.isSelect ? state.themeColor : ''}}" wx:for="{{specsItem.specParams}}" wx:key="j" wx:for-index="opt" data-label="{{item.value}}" data-specId="{{item.specId}}" data-id="{{item.id}}" data-item="{{opt}}" data-disabled="{{item.disabled}}" bindtap="clickOptionItem">{{item.value}}</view>
            </view>
            </view> -->
        </scroll-view>
        <view class="choose-product-num">
          <view>数量</view>
          <view class="goods-count-box">
            <view @click.stop="handleReduce" class="iconfont icon-jianhao" :style="'color: ' + state.themeColor + ';border-color: ' + state.themeColor + ';'"></view>
            <view class="num">
                <input cursor="0" selection-start="1" selection-end="1" :value="state.productNum" @input="bindProductNumInput" type="number" maxlength="3">
            </view>
            <view @click.stop="handleAdd" class="iconfont icon-jiahao2fill" :style="'color: ' + state.themeColor + ';'"></view>
          </view>
        </view>
        <view class="spec-button-box">
          <view class="spec-button-box-content">
            <form @submit="confirm" @click.stop="noop">
              <button v-if="state.activityType === 'normal'" form-type="submit" class="spec-button" :style="'background: ' + state.themeColor" data-addtype="detail">确定</button>
            </form>
          </view>
        </view>
    </view>
  </popup>
  <!-- 商品规格 -->
  <popup :show="state.show.goodsSpec" position="bottom" custom-class="bottom" @close="toggleGoodsSpecPopup">
    <goods-spec @sendSpecShareImg="sendSpecShareImg" :specs="state.specs" :activeSpecId="state.shopCarSpecId" :specDetails="state.specDetails" :memberPrice="state.memberPrice" :promotionPrice="state.promotionPrice" :activity-type="state.activityType" :hasSelected="hasSelected" @close="toggleGoodsSpecPopup" :goodsImg="goodsImg" :price="state.sellPrice" :has-team-leader="state.hasTeamLeader" :has-immediately-grab="state.hasImmediatelyGrab" @confirm="confirmSpecs" :minSellPrice="state.minSellPrice" :maxSellPrice="state.maxSellPrice"></goods-spec>
  </popup>
  <!-- 关联券弹窗 -->
  <popup :show="state.show.relateCoupon" position="bottom" custom-class="bottom" @close="toggleRelateCouponPopup">
    <view class="popup-relate-coupon-board">
      <view class="popup-title">优惠券</view>
      <view style="margin-left:40rpx;">可领取优惠券</view>
      <scroll-view :scroll-y="true" class="popup-content" :style="state.relatedCouponList.length > 1 ? 'height:716rpx;' : ''">
        <view v-for="(item , index) in state.relatedCouponList" :key="id">
          <coupon-receive :coupon="item" :hasUserInfo="state.hasUserInfo" @couponClick="couponClick" @getUserInfo.stop="onGetUserInfo" @assign="assign"></coupon-receive>
        </view>
      </scroll-view>
      <view class="popup-coupon-bottom" @click="toggleRelateCouponPopup">
        <view class="btn" :style="state.theme.mainBgColor">完成</view>
      </view>
    </view>

  </popup>
  <!-- 拼团规则弹窗 -->
  <popup :show="state.show.rulesDetail" position="middle" class="rules" custom-class="middle" @close="toggleRulesDetailPopup">
    <view class="popup-rules-detail-board">
      <view class="popup-title">拼团详细规则</view>
      <image class="popup-close" :src="state.imagesPath.iconCloseImg" @click="toggleRulesDetailPopup"></image>
      <view class="popup-content">
        <view>
          <text class="rule-title">1.开团：</text>在拼团活动期间，用户进入拼团商品详情页，点击立即开团，下单完成支付后视为开团成功，并成为该团团长。
        </view>
        <view>
          <text class="rule-title">2.参团：</text>进入他人团详情页面，点击参团，下单完成支付后视为开团成功。
        </view>
        <view>
          <text class="rule-title">3.优惠券和积分的使用：</text>除特定优惠券外，购买拼团商品时，一般不可使用优惠券。
        </view>
        <view>
          <text class="rule-title">4.拼团成功：</text>在成团有效期内（若距离拼团活动结束时间小于成团有效期，则以活动结束时间为准），完成支付的用户达到达成指定拼团人数，则拼团成功。
        </view>
        <view>
          <text class="rule-title">5.拼团失败：</text>在拼团有效期后，完成支付的用户未达到指定拼团人数，则拼团失败。（若高峰期间同时支付的人过多，将以支付时间先后为准，超出拼团人数限制的用户将自动新开一个团成为团长，需要另外再邀请/等待其他用户参团）
        </view>
        <view>
          <text class="rule-title">6.订单退款退货：</text>拼团订单在发货前支持退款，在配送中不支持发起退款。用户在收到拼团商品后，若不满拼团商品质量，双方经协商可由商家在后台发起退货退款流程。
        </view>
      </view>
    </view>
  </popup>
  <!-- 提示升级弹窗 -->
  <popup :show="state.show.upgrade" position="middle" custom-class="middle" @close="toggleUpgradePopup">
    <view class="popup-upgrade-box">
      <view class="popup-upgrade-title">
        <text>温馨提示</text>
      </view>
      <view class="popup-upgrade-content">当前等级剩余兑换次数不足{{state.showScoreUpdate ? "您可以去升级会员等级" : ""}}!</view>
      <view class="popup-upgrade-button">
        <view :style="'background-color: ' + state.theme.color" @click="handleUpgrade" v-if="state.showScoreUpdate">升级会员等级</view>
        <view :style="'background-color: ' + state.theme.color" @click="toggleUpgradePopup" v-else>我知道了</view>
      </view>
    </view>
  </popup>
  <share :show="state.showSharePop" :specificationsFlag="state.specificationsFlag" :share-data="state.shareData" @close="closeSharePop" :type="state.goodType"></share>
  <image class="movable-view" :src="state.imagesPath.toHome" v-if="state.homeBack" @click="toHome"></image>
<!--加入购物车图片-->
<view class="good_box" :hidden="state.hide_good_box" :animation="state.animation" :style="'left:' + bus_x + 'px;top:' + bus_y + 'px;'">
  <image :src="goodsBoxImage" mode="aspectFit"></image>
</view>
<authorize @login="handleUserLogin"></authorize>
<timeout :show="state.showTimeout" @close="timeoutPopupClose"></timeout>

</view>
</template>
<script setup>
import _apiRequestJs2 from "@/service/api/newretail/request";
import _apiFloristServiceJs from "@/service/api/newretail/floristService";
import _apiWisdomServiceJs from "@/service/api/newretail/wisdomService";
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsLogJs from "@/utils/newretail/log";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsFlyJs from "@/utils/newretail/fly";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiPackagingServiceJs from "@/service/api/newretail/packagingService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiSystemServiceJs2 from "@/service/api/newretail/systemService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _apiCommentServiceJs from "@/service/api/newretail/commentService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _apiSeckillServiceJs from "@/service/api/newretail/seckillService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _apiShopcartServiceJs from "@/service/api/newretail/shopcartService";
import _apiScoreProductService from "@/service/api/newretail/scoreProductService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import righticon from '@/utils/newretail/image/cardtop.png'
import trueIcon from '@/utils/newretail/image/true.png'
// import detailIcon from '@/utils/newretail/image/detail.png'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import NavigationBar from '@/pages-sub/newretail/components/navigation-bar/navigation-bar.vue';
import GoodAttr from '@/pages-sub/newretail/components/good-attr/index.vue';
import GoodsItemSmall from '@/pages-sub/newretail/components/goods-item-small/goods-item-small.vue';
import SetMeal from '@/pages-sub/newretail/components/setMeal/setMeal.vue';
import Popup from '@/pages-sub/newretail/components/popup/popup.vue';
import GoodsSpec from '@/pages-sub/newretail/components/product/goods-spec/goods-spec.vue';
import CouponReceive from '@/pages-sub/newretail/components/coupon/coupon-receive/coupon-receive.vue';
import Share from '@/pages-sub/newretail/components/product/share/share.vue';
import bus from 'iny-bus';
const app = getApp();

// pages/goodsDetail/goodsDetail.js
const sysService = _apiSystemServiceJs;
const productService = _apiProductServiceJs;
const scoreProductService = _apiScoreProductService;
const shopcartService = _apiShopcartServiceJs;
const teamBuyService = _apiTeamBuyServiceJs;
const memberService = _apiMemberServiceJs;
const util = _utilsUtilsJs;
const storeService = _apiStoreServiceJs;
const secKillService = _apiSeckillServiceJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const commentService = _apiCommentServiceJs;
const distributionService = _apiDistributionServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const systemService = _apiSystemServiceJs2;
const orderService = _apiOrderServiceJs;
const packagingService = _apiPackagingServiceJs;
const auth = _utilsAuthJs;
const request = _apiRequestJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const FLY = _utilsFlyJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const couponService = _apiCouponServiceJs;
const couponHandler = _utilsCouponHandler;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const log = _utilsLogJs;
const selfA = _utilsSelfJs;
const subscribeMessage = _utilsSubscribeMessageJs;
const wisdomService = _apiWisdomServiceJs;
const floristService = _apiFloristServiceJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
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
    const sColorChange = [];
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
// 获取应用实例
let canAddToCart = true;
let changeCanAddToCart = false;
let canAddGrabCart = true;
const state = reactive({
  serviceLoading: true,
  serviceDuration: '',
  // 服务项目时长
  serviceDuration1: '',
  serviceTimeInterval: '',
  // 服务可选时间间隔
  serviceStaff: {},
  // 服务人员详情信息
  appointmentTime: '',
  // 最早可约时间
  serviceOriginalSellPrice: null,
  // 服务原价
  serviceMinPrice: null,
  // 服务相关最低价格
  serviceMaxPrice: null,
  // 服务相关最高价格
  serviceTimeList: [],
  activeTimeItem: null,
  serviceItemList: [],
  activeWeekItem: null,
  activeWeekIdx: null,
  activeServiceIdx: 0,
  activeTimeIdx: null,
  weekList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  serviceTime: '',
  isFlorist: false,
  // 是否花艺师
  isService: false,
  // 是否服务项目
  customerService: 'NONE',
  isWifi: false,
  specOriginalPrice: null,
  // 多规格原价
  specPrice: null,
  // 多规格分享价格
  specShare: '',
  // 多规格分享图
  productPlacedAtTheTop: false,
  minSellPrice: 0,
  maxSellPrice: 0,
  shipmentType: '',
  // 拼团配送方式
  columnDTOSHeader: [],
  // 商品自定义属性 页眉
  columnDTOSFooter: [],
  // 商品自定义属性 页脚
  operateFun: '',
  currentPage: 'good',
  shopCarSpecId: null,
  goodtype: null,
  isIphoneX: util.isIphoneX(),
  manualScrollTop: 0,
  scrollList: [{
    name: '商品',
    name1: 'productUrl'
  }, {
    name: '详情',
    name1: 'productDetails'
  }],
  scrollTop: 0,
  navHeight: {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  }.statusBarHeight,
  navigationBarTitle: "商品详情",
  imagesPath: IMGAGESPATH,
  productPictures: [],
  isAutoplay: true,
  // 轮播图是否自动轮播
  name: '',
  goodsLabels: [],
  description: '',
  deliveryTimeStatement: '',
  // 配送时间说明
  groupDescription: '',
  business: '',
  labels: [],
  productProperties: [],
  soldCount: '',
  sellPrice: '',
  promotionPrice: null,
  originalPrice: '',
  productDetails: [],
  isTeam: false,
  teamBuyList: [],
  countDownList: [],
  teamBuyTimeList: [],
  teamLeaderPrice: '',
  teamMemberPrice: '',
  teamAllPrice: '',
  // 拼团总价
  teamMemberAllPrice: '',
  // 拼团会员价总价
  teamLeaderRecordId: '',
  teamMemberCount: 0,
  goodsList: [],
  shopCartNum: '0',
  balance: '999',
  // 商品剩余数量
  secKillInfo: {},
  isSecKill: false,
  time: {},
  hasUserInfo: false,
  isMember: false,
  advanceSell: false,
  advanceSellInfo: {},
  storeId: '',
  activityId: '',
  frontPrice: '',
  advanceSellTime: {},
  endTime: '',
  modal: false,
  productNum: 1,
  groupModal: false,
  groupInfo: {},
  groupBalance: 0,
  groupSharePicture: '',
  groupSharePictureDialogue: '',
  countDownTime: {},
  specifications: '',
  memberLimit: 9999,
  timeId: 0,
  groupTimeId: 0,
  groupListTime: 0,
  secKillTime: 0,
  orderNumber: 0,
  current: 1,
  goodType: 'normal',
  scoreInfo: {},
  member: {},
  score: 0,
  groupNumber: '零',
  commissionTotal: 0.00,
  phone: false,
  orderSelfScope: '',
  teamBuyingType: 'COMMON',
  groupStatus: "STARTED",
  x: 750,
  y: 450,
  scale: 2,
  homeBack: false,
  showSharePop: false,
  animationData: {},
  showPoster: false,
  isCateringMeals: false,
  meals: {
    show: false,
    productId: '',
    storeId: ''
  },
  commentList: [],
  commentNum: 0,
  hide_good_box: true,
  animation: {},
  shopCart: {},
  // 购物车商品数量
  shopCartGoodsId: [],
  // 购物车商品id列表
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  nextDayStoreId: uni.getStorageSync('nextDayStoreId'),
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    goodsSpec: false,
    relateCoupon: false,
    rulesDetail: false,
    upgrade: false,
    goodsNormal: false
  },
  specs: [],
  specDetails: [],
  serviceTel: '',
  systemOptions: {
    hasDistributionCenter: false
  },
  isOpenCustomerService: false,
  isDistributor: false,
  // 是否分销员
  grabProductNum: 0,
  IS_OPEN_CUSTOMER_SERVICE: false,
  relatedProductList: [],
  // 关联商品
  relatedCouponList: [],
  // 关联券
  grabProductNum: 0,
  // 积分商品对象，里面持有商品属性
  scoreProduct: {},
  zhiti: false,
  activityType: "normal",
  // 活动类型（用户商品规格）
  hasTeamLeader: false,
  hasImmediatelyGrab: false,
  hasGrabPrice: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  theme: themeManager,
  scource: "SHOPPINGCART",
  storeInfo: null,
  storeSelfDeliveryInfo: null,
  vipGradeConfig: null,
  memberPrice: "",
  sharePic: '',
  memberGrade: '',
  memberShip: [],
  soldOut: false,
  showTimeout: false,
  nextGradeNo: "",
  showScoreUpdate: false,
  shareData: {},
  hasaAuthorization: true,
  packaging: null,
  processData: [{
    id: 1,
    name: '选择商品',
    satrt: '#fff',
    end: '#EE5253',
    number: 'http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/number1.png'
  }, {
    id: 2,
    name: '邀请好友',
    satrt: '#EE5253',
    end: '#EE5253',
    number: 'http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/number2.png'
  }, {
    id: 3,
    name: '人满成团',
    satrt: '#EE5253',
    end: '#fff',
    number: 'http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/number3.png'
  }],
  isAdvanceSellActiveEnd: false,
  isAdvanceSellActiveStart: true,
  shipperTypeObj: {
    WAREHOUSE: '大仓直发',
    VENDOR: '代发商品'
  },
  // 多规格true
  specificationsFlag: false,
  productId: '',
  options: {},
  producrisStoreCode: null
});
function getServiceConfig() {
  sysService.query('serviceDuration,serviceTimeInterval').then(res => {
    if (res && res.length > 0) {
      res.forEach(configItem => {
        if (configItem.key == 'serviceDuration' && configItem.value) {
          state.serviceDuration1 = parseInt(configItem.value / 2);
        }
        configItem.key = configItem.value;
      });
    }
  }).catch(err => {});
}
function getOrderServiceDetails(isFlorist, productId, callBackFn) {
  const self = this;
  getProductDetails(state.storeId, productId);
  function getProductDetails(storeId, productId) {
    const fnName = isFlorist ? 'getServiceStaffDetails' : 'getProductDetails';
    const params = {
      storeId
    };
    if (isFlorist) {
      params.serviceStaffId = productId;
    } else {
      params.productId = productId;
    }
    floristService[fnName](params).then(res => {
      if (res) {
        // 处理 花艺师详情接口数据
        if (isFlorist) {
          delete res.detailImgs;
          delete res.productList;
          callBackFn(res);
        } else {
          delete res.serviceStaffList;
          callBackFn(res);
        }
      } else {
        uni.hideLoading();
      }
    }).catch(err => {
      uni.hideLoading();
    });
  }
}
function appointmentConfirm() {
  if (!state.activeTimeIdx && state.activeTimeIdx !== 0) {
    uni.showToast({
      title: '请选择预约时间',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
  if (!state.activeServiceIdx && state.activeServiceIdx !== 0) {
    uni.showToast({
      title: '请选择' + (state.isService ? '花艺师' : '服务项目'),
      icon: 'none',
      duration: 2000
    });
    return false;
  }
  const that = this;
  uni.showLoading();
  try {
    let shopcart = {
      allPrice: state.activeService.activityPrice,
      storeId: state.storeId,
      goodsList: [],
      orderType: "service",
      scource: 'BUYNOW',
      appointmentTime: state.activeWeekItem.day + ' ' + state.activeTimeItem.time
    };
    if (options && options.room_id) {
      shopcart = {
        ...shopcart,
        orderSource: 'WX_MINI_APP-LIVE',
        room_id: options.room_id
      };
    }
    if (state.isFlorist) {
      shopcart.serviceStaffData = state.serviceStaff;
      getOrderServiceDetails(false, state.activeService.productId, goods => {
        const goods1 = {
          ...goods,
          productId: goods.id,
          initialPurchaseNumber: 1,
          productNum: 1,
          sellPrice: state.activeService.activityPrice
        };
        shopcart.goodsList.push(JSON.parse(JSON.stringify(goods1)));
        uni.setStorageSync('wj_shopcart', shopcart);
        toPerfectOrder();
        uni.hideLoading();
      });
    } else {
      const productsList = state.goodsList;
      productsList.forEach(item => {
        item = {
          ...item,
          productId: item.id,
          initialPurchaseNumber: state.initialPurchaseNumber || 1,
          productNum: 1,
          sellPrice: state.activeService.activityPrice
        };
        shopcart.goodsList.push(item);
      });
      getOrderServiceDetails(true, state.activeService.serviceStaffId, serviceStaffData => {
        shopcart.serviceStaffData = JSON.parse(JSON.stringify(serviceStaffData));
        uni.setStorageSync('wj_shopcart', shopcart);
        toPerfectOrder();
        uni.hideLoading();
      });
    }
    // if (that.data.goodType !== "newmbr") {
    //     let sellPrice = that.data.goodsList[0].sellPrice;
    //     if (that.data.goodsList[0].memberPrice && Number(that.data.goodsList[0].memberPrice) < Number(sellPrice)) {
    //         shopcart.allPrice = util.filtToFix(parseFloat((that.data.goodsList[0].memberPrice).toFixed(2)) * that.data.productNum);
    //         shopcart.goodsList[0].sellPrice = that.data.goodsList[0].memberPrice
    //         sellPrice = that.data.goodsList[0].memberPrice
    //         shopcart.goodsList[0].useMemberPrice = true
    //     }
    //     shopcart.goodsList[0].usePromotionPrice = that.data.goodsList[0].usePromotionPrice
    //     if (!that.data.isTeam && that.data.goodsList[0].promotionPrice && Number(that.data.goodsList[0].promotionPrice) < Number(sellPrice)) {
    //         shopcart.allPrice = util.filtToFix(Number((parseFloat(that.data.goodsList[0].promotionPrice).toFixed(2)) * that.data.productNum))
    //         shopcart.goodsList[0].sellPrice = that.data.goodsList[0].promotionPrice
    //         shopcart.goodsList[0].usePromotionPrice = true
    //         shopcart.goodsList[0].useMemberPrice = false
    //     }
    // }
  } catch (e) {
    console.log(e);
    uni.hideLoading();
  }
  function toPerfectOrder() {
    let easyScene = "none";
    if (options.easyScene != null) {
      easyScene = options.easyScene;
    }
    let opts = "?easyScene=" + easyScene + "&externalInfo=" + state.options;
    if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
      opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
    }
    // 跳转到完善订单
    NAVPAGE.toPerfectOrder(opts);
  }
}
function getWeekAndTime(currentTime, currentUser) {
  if (!state.activeServiceIdx) {
    state.activeServiceIdx = 0;
    state.activeService = state.serviceTimeList[state.activeServiceIdx];
  }
  if (state.isService || state.isFlorist) {
    state.shareData.sellPrice = state.activeService ? state.activeService.activityPrice : state.serviceMinPrice;
    state.shareData = state.shareData;
  }
  state.serviceTimeList.forEach((item, serviceIdx) => {
    item.isOptional = true;
    if (item.datetimeList && item.datetimeList.length > 1) {
      // let weekDay = new Date(item.datetimeList[0].day).getDay()
      item.datetimeList.forEach((date, dateIdx) => {
        // weekDay += dateIdx
        // if(weekDay > 6) {
        //   weekDay = 0
        // }
        date.weekIndex = new Date(date.day).getDay();
        if (state.activeServiceIdx == serviceIdx && !date.rest && !state.activeWeekIdx && state.activeWeekIdx !== 0) {
          state.activeWeekIdx = dateIdx;
          state.activeWeekItem = date;
        }
        if (dateIdx === state.activeWeekIdx) {
          item.isOptional = !date.rest;
        }
        const newTimeList = [];
        date.time.forEach((time, idx) => {
          const timeItem = {
            time,
            isOptional: true,
            isDisabled: false,
            isSelect: false
          };
          if (date.rest || date.scheduledList && (date.scheduledList.indexOf(time) > -1 || currentTime == time && currentTime && date.scheduledList.indexOf(currentTime) > -1)) {
            timeItem.isOptional = false;
          }
          if (date.rest || date.manualList && (date.manualList.indexOf(time) > -1 || currentTime == time && currentTime && date.manualList.indexOf(currentTime) > -1)) {
            timeItem.isOptional = false;
          }
          if (date.noTimeList && date.noTimeList.indexOf(time) > -1) {
            timeItem.isDisabled = true;
          }
          // date.scheduledList && 
          if (currentTime == time && currentTime && (date.manualList && date.manualList.indexOf(currentTime) > -1 || date.scheduledList && date.scheduledList.indexOf(currentTime) > -1 || date.noTimeList && date.noTimeList.indexOf(time) > -1) && dateIdx === state.activeWeekIdx) {
            item.isOptional = false;
          }
          // if(serviceIdx == this.data.activeServiceIdx && dateIdx == this.data.activeWeekIdx && (this.data.activeTimeIdx || this.data.activeTimeIdx === 0) && this.data.activeTimeIdx <= idx && idx < (this.data.activeTimeIdx + selectLength)) {
          //   timeItem.isSelect = true
          // }
          if (serviceIdx == state.activeServiceIdx && dateIdx == state.activeWeekIdx && (state.activeTimeIdx || state.activeTimeIdx === 0) && state.activeTimeIdx == idx) {
            timeItem.isSelect = true;
          }
          newTimeList.push(timeItem);
        });
        date.newTimeList = newTimeList;
      });
    }
  });
  state.serviceItemList = JSON.parse(JSON.stringify([...state.serviceTimeList]));
  if (!state.activeWeekIdx && state.serviceTimeList[state.activeServiceIdx].datetimeList && state.serviceTimeList[state.activeServiceIdx].datetimeList[state.activeWeekIdx]) {
    state.serviceTimeList[state.activeServiceIdx].datetimeList.some((item, idx) => {
      if (!item.rest) {
        state.activeWeekIdx = idx;
        state.activeWeekItem = {
          ...item
        };
      }
      return !item.rest;
    });
  }
}
function changeTime(e) {
  const activeIdx = e.currentTarget.dataset.idx; // 当前选中的时间下标
  const activeItem = e.currentTarget.dataset.item; // 当前选中
  const selectLength = Math.round((state.serviceDuration || 1) / (state.serviceTimeInterval || 1)); // 需要选中就几个
  let flag = activeIdx > state.serviceItemList[state.activeServiceIdx].datetimeList[state.activeWeekIdx].newTimeList.length - selectLength;
  if (!flag) {
    flag = state.serviceItemList[state.activeServiceIdx].datetimeList[state.activeWeekIdx].newTimeList.some((item, idx) => {
      return (!item.isOptional || item.isDisabled) && (activeIdx || activeIdx === 0) && activeIdx <= idx && idx < activeIdx + selectLength;
    });
  }
  if (flag) {
    uni.showToast({
      title: '当前选择时间无法满足项目服务时间，不可选择',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
  state.activeTimeIdx = activeIdx === state.activeTimeIdx ? null : activeIdx;
  state.activeTimeItem = activeIdx === state.activeTimeIdx ? null : activeItem;
  getWeekAndTime(state.activeTimeIdx || state.activeTimeIdx === 0 && activeItem ? activeItem.time : null);
}
function changeWeek(e) {
  const activeIdx = e.currentTarget.dataset.idx; // 当前选中的星期下标
  state.activeWeekItem = e.currentTarget.dataset.item;
  state.activeWeekIdx = activeIdx;
  state.activeTimeItem = null;
  state.activeTimeIdx = null;
  getWeekAndTime();
}
function changeService(e) {
  // if(activeIdx !== this.data.activeServiceIdx) {
  // this.getWeekAndTime(this.data.activeTimeItem ? this.data.activeTimeItem.time : null)
  // }
  const activeIdx = e.currentTarget.dataset.idx; // 当前选中的服务项目或花艺师下标
  state.activeService = e.currentTarget.dataset.item;
  state.activeServiceIdx = activeIdx;
  state.activeTimeIdx = null;
  state.activeTimeItem = null;
  if (!state.activeWeekIdx && state.serviceTimeList[state.activeServiceIdx].datetimeList && state.serviceTimeList[state.activeServiceIdx].datetimeList[state.activeWeekIdx]) {
    state.serviceTimeList[state.activeServiceIdx].datetimeList.some((item, idx) => {
      if (!item.rest) {
        state.activeWeekIdx = idx;
        state.activeWeekItem = {
          ...item
        };
      }
      return !item.rest;
    });
  }
  if (state.isService || state.isFlorist) {
    state.shareData.sellPrice = state.activeService ? state.activeService.activityPrice : state.serviceMinPrice;
    state.shareData = state.shareData;
  }
  getWeekAndTime();
}
function changeShow(location, data) {
  if (location === 1) {
    state.columnDTOSHeader = data;
  } else {
    state.columnDTOSFooter = data;
  }
}
function bindProductNumInput(e) {
  const productNum = e.detail.value;
  state.productNum = productNum;
}
const customData = {
  hasAssign: false,
  // 当前是否在领券中
  grabSpecPopupType: "norml" // 秒杀规格弹窗状态
};
function manualScroll(e) {
  const name1 = e.target.dataset.name1;
  state.manualScrollTop = name1;
}
function scrollFun(e) {
  state.scrollTop = e.detail.scrollTop;
}
function toHome(val) {
  NAVPAGE.toHome();
}
function toShopCart() {
  uni.setStorageSync('wj_zhiti', state.zhiti);
  NAVPAGE.toShopcart();
}
function swiperChange(e) {
  state.current = e.detail.current + 1;
}
function getMemberScore() {
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      state.isMember = true;
      state.memberGrade = app.globalData.userInfo.member.gradeId;
      memberService.getBalance(state.member.mobile).then(res => {
        console.log(res);
        state.score = res;
      }).catch(e => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {}
  }
}
function getGoodsDetails(storeId, productId, type) {
  const self = this;
  console.log(storeId, productId, type);
  if (productId) {
    state.isService = false;
    state.isFlorist = false;
    if (type === 'normal') {
      // 普通商品详情页
      console.log("----------普通商品----------");
      getDetails(storeId, productId);
      getProductsComment(productId);
      getPackagingInfo(productId);
    } else if (type === 'group') {
      // 团购
      state.goodType = 'group';
      console.log("----------团购商品----------");
      getTeamBuyGoodsDetails(storeId, productId);
    } else if (type === 'secondkill') {
      // 抢购
      state.goodType = 'secondkill';
      console.log("----------抢购商品----------");
      getSecKillGoodsDetails(options.activityId, productId, storeId);
      getProductsComment(productId);
      getPackagingInfo(productId);
    } else if (type === 'advanceSell') {
      state.goodType = 'advanceSell';
      console.log("----------预售商品----------");
      getAdvanceSellDetails(options.advanceId, productId, storeId);
      getProductsComment(productId);
      setSharePeopleInfo(productId);
      goodsDetailsBuryingPoint(productId, storeId);
      getPackagingInfo(productId);
    } else if (type === 'score') {
      // 普通商品详情页
      state.goodType = 'score';
      queryMemberShip().then(() => {
        getScoreProductDetails(storeId, productId);
      });
      getProductsComment(productId);
      getMemberScore();
    } else if (type == 'service') {
      // 服务相关详情页
      state.goodType = 'service';
      state.navigationBarTitle = '服务项目';
      state.isService = true;
      getServiceDetails(storeId, productId);
      getProductsComment(productId);
    } else if (type == 'florist') {
      // 服务相关详情页
      state.goodType = 'florist';
      state.navigationBarTitle = '花艺师';
      state.isFlorist = true;
      getServiceDetails(storeId, productId);
      getProductsComment(productId);
    } else {
      // 普通商品详情页
      getDetails(storeId, productId);
      getProductsComment(productId);
      getPackagingInfo(productId);
    }
    if (type !== "group") {
      // 获取关联商品和关联券
      getRelatedProducts(storeId, productId);
      getRelatedCoupon(storeId, productId);
    }
    if (options.shareId && options.shareId != '' && options.shareId != undefined) {
      const shareId = options.shareId;
      try {
        uni.setStorageSync('wj_sharingId', shareId);
      } catch (e) {}
    }
    isOnLoadQuery = true;
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (app.globalData.systemConfigure.showCartModule) {
          queryShopcart();
        }
      }
    }
  } else {}
  // 统计PV
  ANALYSIS.PVStatistics(storeId);
}
async function setSharePeopleInfo(productId) {
  const self = this;
  if (options.shareId && options.shareId != '' && options.shareId != null) {
    const shareId = options.shareId;
    if (app.globalData.isShoppingGuidanceRecordGoods) {
      const type = options.type;
      const shareData = {
        shareId,
        type: type != null ? type : state.goodType,
        productId
        // storeId: self.data.storeId
      };
      if (state.producrisStoreCode && state.producrisStoreCode === 'TRUE') {
        shareData.storeId = state.storeId;
      } else if (!state.producrisStoreCode) {
        await getShareStoreIdConfig();
        if (state.producrisStoreCode === 'TRUE') {
          shareData.storeId = state.storeId;
        }
      }
      try {
        uni.setStorageSync('wj_sharingInfo', shareData);
      } catch (e) {}
    } else {
      try {
        uni.setStorageSync('wj_sharingId', shareId);
      } catch (e) {}
    }
  }
}
async function getSharePeopleInfo() {
  const self = this;
  let shareData = null;
  if (options.shareId && options.shareId != '' && options.shareId != null) {
    const shareId = options.shareId;
    const type = options.type;
    shareData = {
      shareId,
      type: type != null ? type : state.goodType,
      productId: state.goodsId
      // storeId: self.data.storeId
    };
    if (state.producrisStoreCode && state.producrisStoreCode === 'TRUE') {
      shareData.storeId = state.storeId;
    } else if (!state.producrisStoreCode) {
      await getShareStoreIdConfig();
      if (state.producrisStoreCode === 'TRUE') {
        shareData.storeId = state.storeId;
      }
    }
  } else {
    shareData = util.getSharingPersonInfo();
  }
  return shareData;
}
function getShareStoreIdConfig() {
  const self = this;
  if (app.globalData.systemConfigure.producrisStoreCode) {
    state.producrisStoreCode = app.globalData.systemConfigure.producrisStoreCode;
  } else {
    sysService.query('producrisStoreCode').then(res => {
      if (res && res.length > 0 && res[0].value != null) {
        app.globalData.systemConfigure.producrisStoreCode = res[0].value;
        state.producrisStoreCode = app.globalData.systemConfigure.producrisStoreCode;
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
onLoad(function (options) {
  const pages = getCurrentPages(); // 页面对象
  const prevpage = pages[pages.length - 2]; // 上一个页面对象
  if (prevpage) {
    const path = prevpage.route;
    if (path === 'pages/mallModule/benefitPlan/welfarePlan/welfarePlan') {
      state.currentPage = 'welfarePlan';
    } else {
      state.currentPage = 'good';
    }
  }
  const that = this;
  const self = this;
  // if(!app.globalData.userInfo) {
  //     wx.showModal({
  //         title: '温馨提示',
  //         content: '亲，授权登录后才能查看商品信息',
  //         success(res) {
  //             if (res.confirm) {
  //                 that.setData({
  //                     options
  //                 })
  //                 that.getUserInfo()
  //             } else {
  //                 wx.showToast({
  //                     title: '您取消了授权',
  //                     icon: 'none',
  //                     duration: 2000
  //                 })
  //             }
  //         }
  //     })
  // }
  getShareStoreIdConfig();
  getServiceConfig();
  // wx.hideShareMenu()
  console.log(options, "传参详情");
  // new app.globalData.addToCart();
  console.log('=====');
  console.log('onload');
  if (options.goodtype) {
    options.type = options.goodtype;
  }
  if (options && options.specId) {
    state.shopCarSpecId = options.specId;
  }
  state.customerService = app.globalData.customerService;
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  state.options = options;
  state.productPlacedAtTheTop = app && app.globalData ? app.globalData.productPlacedAtTheTop : false;
  console.log(options);
  if (options.type) {
    state.goodType = options.type;
  }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
  sceneId = null; // 参数的场景值
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene);
    if (scene.indexOf("gmparam:") >= 0) {
      const sceneArr = scene.split('gmparam:');
      const _sceneId = sceneArr[1];
      sceneId = _sceneId != null ? _sceneId : null;
      // console.log('self.sceneId',self.sceneId)
    } else {
      const sceneArr = scene.split(',');
      options.productId = sceneArr[0];
      options.productId = sceneArr[0];
      options.type = sceneArr[1];
      options.type = sceneArr[1];
      if (options.type === "advanceSell" && sceneArr[2] != null) {
        options.advanceId = sceneArr[2];
      }
      // 分享信息打开统计 扫码默认为分享
      ANALYSIS.ShareOpenAnalysis();
    }
  } else if (options.q) {
    // options 中的 q 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.q);
    const sceneArr = scene.split(',');
    options.prodCode = sceneArr[0];
    state.storeId = sceneArr[2];
    let data = decodeURIComponent(scene);
    if (data.indexOf('?') || data.indexOf('?') === 0) {
      data = data.slice(data.indexOf('?') + 1);
    }
    const arr = data.split('&');
    arr.forEach(item => {
      const num = item.indexOf("=");
      if (item.slice(0, num) == 'prodCode') {
        options.prodCode = item.slice(num + 1);
      } else if (item.slice(0, num) == 'sourceOrderNo') {
        options.sourceOrderNo = item.slice(num + 1);
      } else if (item.slice(0, num) == 'storeCode') {
        options.storeCode = item.slice(num + 1);
        // that.setData({
        //   storeId: item.slice(num + 1)
        // })
      } else if (item.slice(0, num) == 'posNo') {
        options.posNo = item.slice(num + 1);
      }
    });
  }
  const pageStack = getCurrentPages();
  state.serviceTel = app.globalData.servicePhone;
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  if (pageStack.length === 1) {
    state.homeBack = true;
  }

  // 组合商品点击购物车
  if (options.openFlag && options.openFlag === 'open') {
    state.meals.productId = options.productId;
    state.meals.show = true;
    state.meals.storeId = options.storeId;
    state.meals = state.meals;
    state.operateFun = '加入购物车';
  }
  // console.log('是否分销');
  console.log(app.globalData.systemConfigure.hasDistributionCenter);
  const configures = {
    hasDistributionCenter: app.globalData.systemConfigure.hasDistributionCenter
  };
  state.systemOptions = configures;
  console.log('self.data.storeId', options.storeId, app.globalData.storeInfo, sceneId, state.storeId);
  // && (!app.globalData.storeInfo || options.storeId == app.globalData.storeInfo.virtualStoreId)
  if (options.storeId) {
    if (!options) {
      options = {
        storeId: options.storeId
      };
    } else {
      options.storeId = options.storeId;
    }
    state.storeId = options.storeId;
    getRecentlyStore(options);
  }
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  // options.storeId == app.globalData.storeInfo.id && 
  // || (options.storeId != app.globalData.storeInfo.virtualStoreId)
  if (app.globalData.storeInfo && !options.storeId) {
    // console.log(app.globalData.storeInfo,'app.globalData.storeInfo')
    // console.log('是不是进入到了之类')
    // self.setData({
    //     storeId: app.globalData.storeInfo.id,
    //   })
    //   self.getStoreInfoById(app.globalData.storeInfo.id)
    //   console.log('self.sceneId',self.sceneId);
    //   if (self.sceneId) {
    //     self.getSceneById(self.sceneId)
    //   } else if (options.productId != null && options.productId !== "") {
    //     self.getGoodsDetails(app.globalData.storeInfo.id, options.productId, options.type)
    //   }
    if (options.zhiti === 'zhiti') {
      console.log('进入自提');
      const storeIdactive = uni.getStorageSync('storeIdactive');
      state.storeId = storeIdactive.id;
      state.zhiti = true;
      getStoreInfoById(state.storeId);
      console.log('self.sceneId', sceneId);
      if (sceneId) {
        getSceneById(sceneId);
      } else if (options.productId != null && options.productId !== "") {
        getGoodsDetails(storeIdactive.id, options.productId, options.type);
      } else if (options.prodCode != null && options.prodCode !== "") {
        productService.getByExternalCodeStore(options.storeCode || state.storeId).then(res => {
          productService.getByExternalCodeMall(options.prodCode).then(resl => {
            getGoodsDetails(res.id, resl.id, options.type);
            app.globalData.storeInfo = res || app.globalData.storeInfo;
            state.productId = resl.id;
            state.storeId = res.id;
            state.options = options;
          });
        });
      }
    } else {
      console.log('进入统配');
      state.storeId = app.globalData.storeInfo.id;
      getStoreInfoById(options.storeId || app.globalData.storeInfo.virtualStoreId || app.globalData.storeInfo.id);
      console.log('self.sceneId', sceneId);
      if (sceneId) {
        getSceneById(sceneId);
      } else if (options.productId != null && options.productId !== "") {
        getGoodsDetails(options.storeId || app.globalData.storeInfo.id, options.productId, options.type);
      } else if (options.prodCode != null && options.prodCode !== "") {
        productService.getByExternalCodeStore(options.storeCode).then(res => {
          productService.getByExternalCodeMall(options.prodCode).then(resl => {
            getGoodsDetails(res.id, resl.id, options.type);
            app.globalData.storeInfo = res || app.globalData.storeInfo;
            state.productId = resl.id;
            state.storeId = res.id;
            state.options = options;
          });
        });
      }
    }
  } else {
    if (sceneId) {
      getSceneById(sceneId);
    }
    if (options.storeId) {
      if (app.globalData.storeInfo) {
        app.globalData.storeInfo.id = options.storeId;
      } else {
        app.globalData.storeInfo = {
          id: options.storeId
        };
      }
    }
    checkLocationAuth(options);
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    // ADDRESS.getStoreDistance().then(res => {

    //     console.log(res, '是不是进入到了之类')
    //     app.globalData.storeInfo = res;
    //     self.setData({
    //         storeId: res.id
    //     })
    //     self.getStoreInfoById(res.id)
    //     if (self.sceneId) {
    //         self.getSceneById(self.sceneId)
    //     } else if (options.productId != null && options.productId !== "") {
    //         self.getGoodsDetails(res.id, options.productId, options.type)
    //     } else if (options.prodCode != null && options.prodCode !== "") {
    //       productService.getByExternalCodeStore(options.storeCode).then(res => {
    //         productService.getByExternalCodeMall(options.prodCode).then(resl => {
    //           self.getGoodsDetails(res.id, resl.id, options.type)
    //           self.setData({
    //             productId: resl.id,
    //             storeId: res.id,
    //             options: options
    //           })
    //           console.log();
    //         })
    //       })
    //     }
    // }).catch(err => {
    //     console.log(err);
    // })
  }
  getSharePictures();
});
function checkLocationAuth(options) {
  const that = this;
  console.log(2444466666, app.globalData.storeInfo);
  uni.getSetting({
    success: res => {
      const authSetting = res.authSetting;
      if (authSetting['scope.userLocation']) {
        getRecentlyStore(options);
      } else if (authSetting['scope.userLocation'] === false) {
        // 用户未授权，提示用户进行授权
        uni.showModal({
          title: '温馨提示',
          content: '您未授权地理位置信息，部分功能无法正常使用哦~',
          confirmText: '授权位置',
          success: res => {
            if (res.confirm) {
              uni.openSetting();
            } else {
              getRecentlyStore(options);
            }
          },
          fail: () => {
            getRecentlyStore(options);
          }
        });
      } else {
        // 用户未明确拒绝也未授权，提示用户进行设置
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            getRecentlyStore(options);
          },
          fail: () => {
            uni.showModal({
              title: '温馨提示',
              content: '您未授权地理位置信息，部分功能无法正常使用哦~',
              confirmText: '授权位置',
              success: res => {
                // 处理用户响应
                if (res.confirm) {
                  uni.openSetting();
                } else {
                  getRecentlyStore(options);
                }
              },
              fail: () => {
                getRecentlyStore(options);
              }
            });
          }
        });
      }
    },
    fail: err => {
      getRecentlyStore(options);
    }
  });
}
async function getRecentlyStore(options) {
  // 获取到当前的地理位置，查找出最近的门店
  if (!options.storeId) {
    await ADDRESS.getAllStore1();
  }
  await initPage(options);
  // 获取到当前的地理位置，查找出最近的门店
  // wx.getLocation({
  //   type: 'gcj02',
  //   success: (res) => {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       app.globalData.location = {
  //           latitude: res.latitude,
  //           longitude: res.longitude
  //       }
  //       var tempAllStores = wx.getStorageSync('wj_allStores'); // 获取缓存的所有门店
  //       let tempIndex = null;
  //       if(!tempAllStores) {
  //         storeService.queryList().then(async res => {
  //           tempAllStores = []
  //           res.forEach(item => {
  //             if (item.status === 'OPEN') {
  //               tempAllStores.push(item)
  //             }
  //           });
  //           wx.setStorageSync('wj_allStores', tempAllStores);
  //           tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude)
  //           if(!this.options.storeId) {
  //               app.globalData.storeInfo = tempAllStores[tempIndex];
  //           }
  //           wx.setStorageSync('storeIdactive', app.globalData.storeInfo)
  //           console.log(23333444)
  //           await this.initPage(options);
  //         }).catch(err => {
  //           wx.showToast({
  //             title: err.message,
  //             icon: 'none',
  //             duration: 2000
  //           })
  //         })
  //       } else {
  //         tempIndex = ADDRESS.getNearestStore(tempAllStores, latitude, longitude)
  //         if(!this.options.storeId) {
  //           // console.log(66666666,app.globalData.storeInfo)
  //           app.globalData.storeInfo = tempAllStores[tempIndex];
  //         }
  //         wx.setStorageSync('storeIdactive', app.globalData.storeInfo)
  //       //   console.log(233335555,app.globalData.storeInfo)
  //         this.initPage(options);
  //       }
  //   },
  //   fail: (res) => {
  //   }
  // })
}
function initPage(options) {
  if (!app.globalData.storeInfo) {
    // 没有当前门店退出
    return;
  }
  const self = this;
  const res = app.globalData.storeInfo;
  state.storeId = res.id;
  console.log(res.id, 'res.id');
  getStoreInfoById(options && options.storeId || res.virtualStoreId || res.id);
  if (sceneId) {
    getSceneById(sceneId);
  } else if (options.productId != null && options.productId !== "") {
    getGoodsDetails(res.id, options.productId, options.type);
  } else if (options.prodCode != null && options.prodCode !== "") {
    productService.getByExternalCodeStore(options.storeCode).then(res => {
      productService.getByExternalCodeMall(options.prodCode).then(resl => {
        getGoodsDetails(res.id, resl.id, options.type);
        app.globalData.storeInfo = res || app.globalData.storeInfo;
        state.productId = resl.id;
        state.storeId = res.id;
        state.options = options;
      });
    });
  }
}
onReady(function () {});
onShow(function () {
  const that = this;
  uni.getNetworkType({
    success(res) {
      if (res) {
        state.isWifi = res.networkType == 'wifi';
      }
    }
  });
  // 判断用户是否授权
  checkUserInfo();
  // if (this.options.shareId && this.options.shareId != null) {
  //   this.bindDistribution(this.options.shareId)
  // }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
  getUpgradeScore();
  if (state.storeId !== "" && !isOnLoadQuery) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (app.globalData.systemConfigure.showCartModule) {
          queryShopcart();
        }
      }
    }
  }
});
onHide(function () {});
onUnload(function () {
  clearTimeout(state.groupTimeId);
  clearTimeout(state.groupListTime);
  clearTimeout(state.secKillTime);
  clearTimeout(state.timeId);
  bus.remove('getRelatedCoupon', relatedCouponEventId);
  state.groupModal = false;
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
function getSharePictures() {
  console.log('默认分享图');
  console.log(app.globalData.sharePictures);
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
onShareAppMessage(function () {
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  // this.setShareContent();
  // this.drawShareImg();
  let sellPrice = state.promotionPrice && state.promotionPrice < state.sellPrice ? state.promotionPrice : state.sellPrice;
  let specificationsFlag = state.specificationsFlag;
  if (state.promotionMinSellPrice) {
    sellPrice = state.promotionMinSellPrice;
  }
  if (goodsStyle === 'SPEC_PARENT' && state.specShare) {
    if (state.specPrice) {
      sellPrice = state.specPrice;
      specificationsFlag = false;
    } else {
      sellPrice = state.promotionMinSellPrice;
    }
  }
  let title = '【仅需: ￥' + sellPrice + (specificationsFlag ? '起' : '') + '】 ' + state.name;
  if (state.isTeam) {
    title = '【' + state.groupNumber + '人团】 ' + state.teamAllPrice + '元拼购 ' + state.name;
  } else if (state.isSecKill) {
    if (state.secKillInfo.originalPrice) {
      title = '【限时秒杀】' + ' 秒杀价￥' + state.secKillInfo.price + ' 原价￥' + state.secKillInfo.originalPrice + ' ' + state.name;
    } else {
      title = '【限时秒杀】' + ' 秒杀价￥' + state.secKillInfo.price + ' ' + state.name;
    }
  }
  if (state.goodType === "advanceSell") {
    title = '【预售】' + state.pdtDetail.sellPrice + '元' + '/' + state.pdtDetail.frontPrice + '元定金' + state.name;
  }
  const pages = getCurrentPages(); // 获取加载的页面
  const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
  const url = currentPage.route; // 当前页面url
  const options = currentPage.options; // 如果要获取url中所带的参数可以查看options
  let sharePic = state.productPictures[0].url.replace("http://", "https://");
  if (goodsStyle === 'SPEC_PARENT' && state.specShare) {
    sharePic = state.specShare;
    state.sharePic = sharePic;
  }
  // console.log(sharePic, 'sharePicsharePic')
  if (state.sharePic !== "" && state.goodType !== 'advanceSell') {
    sharePic = state.sharePic.replace("http://", "https://");
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id;
    let path = url + '?shareId=' + memberId;
    path = path + '&storeId=' + (state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.virtualStoreId ? state.storeInfo.virtualStoreId + '' : state.storeInfo.id + '' : state.storeId + '');
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key];
        if (key !== 'mobile' && key != 'storeId') {
          path = path + '&' + key + '=' + ele;
        }
      }
    }
    console.log(title);
    console.log(path);
    console.log(sharePic);
    // selfA.getTemporaryUrl(sharePic)
    //     .then(res => {
    //         sharePic = res
    //         return {
    //             title: title,
    //             path: path,
    //             imageUrl: sharePic,
    //             success(e) {
    //                 wx.showShareMenu({
    //                     withShareTicket: true
    //                 })
    //             }
    //         }
    //     })

    return {
      title,
      path,
      imageUrl: sharePic,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  } else {
    let path = url + '?storeId=' + (state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.virtualStoreId ? state.storeInfo.virtualStoreId + '' : state.storeInfo.id + '' : state.storeId + '');
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const ele = options[key];
        if (key !== 'mobile' && key != 'storeId') {
          path = path + '&' + key + '=' + ele;
        }
      }
    }
    return {
      // title: app.globalData.systemConfigure.miniprogramSharingName,
      title,
      path,
      imageUrl: sharePic,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function getShareImgInfo() {
  const that = this;
  let sharePicture = state.sharePictures;
  let firstPic = '';
  if (state.productPictures[0].fileType !== 'VIDEO') {
    firstPic = state.productPictures[0].url ? state.productPictures[0].url.replace("http://", "https://") : '';
    //   console.log(firstPic);
  } else {
    for (let i = 0; i < state.productPictures.length; i++) {
      if (state.productPictures[i].fileType === "PICTURE") {
        firstPic = state.productPictures[i].url.replace("http://", "https://");
        console.log(firstPic);
        break;
      } else {
        firstPic = state.imageUrl.replace("http://", "https://");
        console.log(firstPic);
      }
    }
  }
  if (state.secKillInfo.sharePicture) {
    sharePicture = state.secKillInfo.sharePicture.replace("http://", "https://");
  } else if (state.groupSharePicture !== '') {
    sharePicture = state.groupSharePicture.replace("http://", "https://");
  } else if (state.groupSharePictureDialogue !== '') {
    sharePicture = state.groupSharePictureDialogue.replace("http://", "https://");
  } else {
    sharePicture = firstPic;
  }
  if (state.goodType === 'advanceSell') {
    sharePicture = firstPic;
  }
  if (!state.isSecKill && !state.isTeam) {
    sharePicture = firstPic;
  }
  console.log(state.productPictures);
  console.log(sharePicture);
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: sharePicture,
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    });
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
  });
}
function drawShareImg() {
  const that = this;
  let goodsImage = '';
  let iconShareDesc = '';
  let iconSharePrice = '';
  // console.log('有没有进入这里？？？？')
  // 获取到id为‘pictureShareCanvas’的canvas
  const ctx = uni.createCanvasContext("pictureShareCanvas");
  new Promise((resolve, reject) => {
    getShareImgInfo().then(res => {
      console.log('获取图片信息成功');
      console.log(res);
      if (res) {
        goodsImage = res.path;
        // 获取描述区域背景图
        console.log(IMGAGESPATH.iconShareDesc);
        console.log(IMGAGESPATH.iconSharePrice);
        uni.getImageInfo({
          src: IMGAGESPATH.iconShareDesc,
          success(res) {
            if (res) {
              console.log('描述', res);
              iconShareDesc = res.path;
              // 获取价格区域背景图
              uni.getImageInfo({
                src: IMGAGESPATH.iconSharePrice,
                success(res) {
                  if (res) {
                    console.log('价格', res);
                    iconSharePrice = res.path;
                    console.log('商品图片', goodsImage);
                    console.log('分享图描述背景图', iconShareDesc);
                    console.log('分享图价格背景图', iconSharePrice);

                    // 绘制背景
                    ctx.setFillStyle('#fff');
                    ctx.fillRect(0, 0, 287, 230);
                    // 绘制图上元素
                    ctx.drawImage(goodsImage, 0, 0, 287, 287);
                    ctx.drawImage(iconShareDesc, 0, 180, 287, 60);
                    ctx.drawImage(iconSharePrice, 0, 130, 114, 100);
                    ctx.draw(true);
                    if (state.isSecKill) {
                      activityDesc();
                      timeDown();
                      drawPriceInfo('秒杀价:', state.secKillInfo.price);
                    }
                    if (state.isTeam) {
                      activityDesc(state.groupNumber);
                      timeDown();
                      drawPriceInfo('拼团价:', state.teamAllPrice);
                    }
                    if (!state.isSecKill && !state.isTeam) {
                      drawDescInfo();
                      drawPriceInfo('零售价:', state.sellPrice);
                    }
                    ctx.draw(true, canvasToPath());

                    // 价格信息
                    function drawPriceInfo(word, price) {
                      price = price || '';
                      ctx.setFontSize(16);
                      ctx.setFillStyle('#FD0050');
                      ctx.fillText(word, 22, 160);
                      ctx.draw(true);
                      ctx.setFontSize(14);
                      ctx.fillText('￥', 13, 195);
                      ctx.draw(true);
                      ctx.setFontSize(28);
                      ctx.fillText(price + '', 26, 195);
                      // if(that.data.specificationsFlag) {
                      //   ctx.setFontSize(14);
                      //   ctx.fillText('起', 13 + (price.length * 28 + 4), 195);
                      // }
                      ctx.draw(true);
                    }
                    // 普通商品描述信息
                    function drawDescInfo() {
                      const goodsName = state.name;
                      ctx.setFontSize(14);
                      ctx.setFillStyle('#fff');
                      if (goodsName.length < 10) {
                        ctx.fillText(goodsName, 110, 212);
                      } else {
                        ctx.fillText(goodsName.slice(0, 10) + '...', 110, 212);
                      }
                      ctx.draw(true);
                    }
                    // 拼团秒杀描述信息、倒计时框
                    function activityDesc(num) {
                      ctx.setFontSize(14);
                      ctx.setFillStyle('#fff');
                      if (state.isTeam) {
                        ctx.fillText('【' + num + '人团' + '】', 100, 212);
                      } else {
                        ctx.fillText('【限时秒杀】', 100, 212);
                      }
                      ctx.fillText(state.secKillInfo.secKillStatus === "created" ? '距开始' : '距结束', 230, 200);
                      ctx.draw(true);

                      // 倒计时框
                      ctx.setFillStyle('#fff');
                      ctx.fillRect(264, 204, 14, 14);
                      ctx.fillText(':', 258, 216);
                      ctx.fillRect(240, 204, 14, 14);
                      ctx.fillText(':', 234, 216);
                      ctx.fillRect(216, 204, 14, 14);
                      if (state.isTeam) {
                        ctx.fillText(':', 210, 216);
                        ctx.fillRect(192, 204, 14, 14);
                      }
                      ctx.draw(true);
                    }
                    // 倒计时
                    function timeDown() {
                      // 倒计时
                      ctx.setFontSize(10);
                      ctx.setFillStyle('red');
                      if (state.isTeam) {
                        ctx.fillText(state.groupTime.sec, 265, 215);
                        ctx.fillText(state.groupTime.min, 241, 215);
                        ctx.fillText(state.groupTime.hou, 217, 215);
                        if (state.groupTime.day > 9) {
                          ctx.fillText(state.groupTime.day, 193, 215);
                        } else {
                          ctx.fillText(state.groupTime.day, 196, 215);
                        }
                      } else {
                        ctx.fillText(state.time.second, 265, 215);
                        ctx.fillText(state.time.minute, 241, 215);
                        ctx.fillText(state.time.hour, 217, 215);
                      }
                    }
                  }
                },
                fail(err) {
                  console.log('getImageInfo失败');
                  console.log(err);
                }
              });
            }
          },
          fail(err) {
            console.log('getImageInfo失败');
            console.log(err);
          }
        });
      }
    });
    resolve();
  }).then(() => {
    console.log('canvas绘制完毕');
    // ctx.draw(true, that.canvasToPath());
  });
}
function canvasToPath() {
  const that = this;
  console.log('canvas转图片');
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  setTimeout(function () {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 287,
      height: 230,
      destWidth: 287 * pixelRatio,
      destHeight: 230 * pixelRatio,
      fileType: "jpg",
      quality: 1,
      canvasId: 'pictureShareCanvas',
      success(res) {
        uploadTempFile(res);
        // setTimeout(function () {
        // }, 100)
      }
    });
  }, 800);
}
function uploadTempFile(res) {
  const that = this;
  const request = _apiRequestJs2;
  console.log('上传图片');
  console.log(request.TENANT);
  console.log(request.BASE_URL + '/newretail/api/dfs/upload');
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    filePath: res.tempFilePath,
    name: 'file',
    formData: {
      'user': 'test'
    },
    header: {
      "wxa-appid": request.APP_ID
    },
    success(res) {
      if (res && res.data != null && res.statusCode >= 200 && res.statusCode <= 300) {
        console.log(res);
        console.log('上传成功');
        console.log(JSON.parse(res.data));
        console.log(JSON.parse(res.data).data.url);
        // wx.showShareMenu();
        state.sharePic = JSON.parse(res.data).data.url;
      }
    },
    fail(e) {
      console.log('=============');
      console.log(e);
    }
  });
}
function addShopCartCatch(val) {
  // console.log(val)
  // this.addShopCartData = val
}
function _addShopcart(productId) {
  if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
    canAddToCart = true;
    util.showToast('该活动仅限新会员专享哦~', 2000);
  } else {
    productService.getCateringDetailsById(productId, state.storeId).then(res => {
      const self = this;
      const cateringGroupProducts = res.cateringGroupProducts;
      const productId = res.id;
      const goodsList = [];
      let mealCanBuy = true;
      const unBuyGoods = null;
      const unChoiceGroup = null;
      let hasSharingPersonId = false;
      const mealDetails = [];
      const business = state.business;
      if (cateringGroupProducts && cateringGroupProducts.length > 0) {
        const groupProductList = [];
        for (let i = 0; i < cateringGroupProducts.length; i++) {
          const item = cateringGroupProducts[i];
          if (item.mealDetails && item.mealDetails.length > 0) {
            for (let j = 0; j < item.mealDetails.length; j++) {
              const ele = item.mealDetails[j];
              const tempData = {
                "groupId": item.groupId,
                "groupProductId": ele.productId,
                "groupProductCount": ele.productCount
              };
              mealDetails.push(ele.productName);
              groupProductList.push(tempData);

              // 判断当前门店是否存在该商品 如果不存在则提示用户
              if (!ele.exist || ele.storeBalance <= 0) {
                mealCanBuy = false;
                canAddToCart = true;
                uni.showToast({
                  title: '门店中该商品库存不足，请选购其他商品~',
                  icon: 'none',
                  duration: 2000
                });
                return false;
              }
            }
          }
        }
        const tempData = {
          count: 1,
          lists: groupProductList,
          productId
        };
        if (app.globalData.isShoppingGuidanceRecordGoods) {
          // 获取分享人id
          const shareData = util.getSharingPersonInfo();
          if (shareData && shareData != null && shareData.productId === state.productId) {
            tempData.lists[0].sharingPersonId = shareData.shareId;
            hasSharingPersonId = true;
          }
        }
        goodsList.push(tempData);
      }
      if (mealCanBuy) {
        const postData = {
          lists: goodsList,
          storeId: state.storeId
        };
        // 统配商品
        if (business === 'DISTRIBUTION') {
          postData.storeId = state.distributionStoreId;
        }
        // 次日达商品
        if (business === 'NEXT_DAY') {
          postData.storeId = state.nextDayStoreId;
        }
        if (state.goodType === 'newmbr') {
          postData.lists[0].newmbrActivityId = state.goodsDetail.activityId;
        } else if (state.goodType === 'secondkill') {
          if (state.secKillInfo.type === "SPEC" && !customData.hasGrabPrice) {
            // 选择的子规格是普通规格不是秒杀
          } else {
            postData.lists[0].grabActivityId = state.activityId;
          }
        }
        console.log(state.scource);
        if (state.scource === "BUYNOW") {
          canAddToCart = true;
          // 处理立即购买
          postData.mealDetails = "(" + mealDetails.join("+") + ")";
          if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
            util.removeSharingPersonInfo();
          }
          const outcome = {
            detail: {
              outcome: true,
              product: postData
            }
          };
          chooseOutcome(outcome);
          return;
        }
        shopcartService.cateringAdd(postData).then(res => {
          const opts = {
            products: [{
              productId,
              traceId: options.traceId != null ? options.traceId : ""
            }]
          };
          app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : business === 'NEXT_DAY' ? 'nextDay' : 'normal';
          app.globalData.isShopCartChange = true;
          if (!util.isHideLoading()) {
            util.setHideLoading(true);
          }
          if (state.isSecKill) {
            state.grabProductNum = parseInt(state.grabProductNum) + 1;
          }
          if (app.globalData.systemConfigure.showCartModule) {
            changeCanAddToCart = true;
            queryShopcart();
          } else {
            canAddToCart = true;
          }
          // wx.showToast({
          //   title: '添加购物车成功~',
          //   icon: 'none',
          //   duration: 2000
          // })
          if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
            util.removeSharingPersonInfo();
          }
          handleTouchOnGoods(addShopCartData);
        }).catch(err => {
          canAddToCart = true;
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        canAddToCart = true;
        if (unBuyGoods) {
          uni.showToast({
            title: unBuyGoods.productName + '已售完',
            icon: 'none',
            duration: 2000
          });
        } else if (unChoiceGroup) {
          uni.showToast({
            title: unChoiceGroup.groupName + '必选',
            icon: 'none',
            duration: 2000
          });
        }
      }
    }).catch(err => {
      canAddToCart = true;
      uni.showToast({
        title: err.message,
        icon: 'none'
      });
    });
  }
}
function addShopCart(val) {
  if (!canAddGrabCart) {
    return;
  }
  canAddGrabCart = false;
  const that = this;
  const loginStatus = checkAuth();
  if (loginStatus && state.isMember) {
    if (state.isSecKill) {
      if (state.secKillInfo.type === "SPEC" && !customData.hasGrabPrice) {
        // 选择的子规格是普通规格不是秒杀
        addShopCartNew(val);
        canAddGrabCart = true;
        return;
      }
      console.log('是不是进入到这里？？？', state.storeId);
      shopcartService.getCatering(state.storeId).then(res => {
        if (util.isHideLoading()) {
          util.setHideLoading(false);
        }
        let grabProductNum = 0;
        for (let i = 0; i < res.items.length; i++) {
          const item = res.items[i];
          if (item.productId === options.productId && item.grabActivityId != null) {
            grabProductNum = grabProductNum + item.productNum;
            break;
          }
        }
        state.grabProductNum = grabProductNum;
        const tempShopCart = {};
        const grabProducts = {};
        const tempShopCartGoodsId = [];
        const tempGrabShopCartGoodsId = [];
        let minQty = state.secKillInfo.minQty || 0;
        if (res.items && res.items.length > 0) {
          // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
          res.items.forEach(item => {
            if (item.productId == state.goodsList[0].id && item.grabActivityId == state.secKillInfo.activityId) {
              minQty = item.minQty > item.productNum ? item.minQty - item.productNum : 1;
            }
            if (!item.grabActivityId && !item.newmbrActivityId) {
              let index = -1;
              for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                if (item.productId == tempShopCartGoodsId[i]) {
                  index = i;
                }
              }
              if (index > -1) {
                tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum;
              } else {
                tempShopCart[item.productId] = item.productNum;
                tempShopCartGoodsId.push(item.productId);
              }
            } else if (item.grabActivityId) {
              let index = -1;
              for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
                if (item.productId == tempGrabShopCartGoodsId[i]) {
                  index = i;
                }
              }
              if (index > -1) {
                grabProducts[item.productId] = grabProducts[item.productId] + item.productNum;
              } else {
                grabProducts[item.productId] = item.productNum;
                tempGrabShopCartGoodsId.push(item.productId);
              }
            }
          });
        }
        if (minQty && minQty > state.productNum) {
          state.productNum = minQty;
        }
        const localData = {
          goodsId: tempShopCartGoodsId,
          items: tempShopCart
        };
        const localGrabData = {
          goodsId: tempGrabShopCartGoodsId,
          items: grabProducts
        };
        console.log(localData, "本地购物车数据");
        try {
          uni.setStorageSync('wj_shopCartStorage', localData);
          uni.setStorageSync('wj_grabshopCartStorage', localGrabData);
        } catch (e) {}
        const limitCount = state.secKillInfo.limitCount;
        const availableStockAmount = state.secKillInfo.availableStockAmount;
        if (availableStockAmount > 0) {
          if (availableStockAmount < minQty) {
            uni.showToast({
              title: "库存数量小于起购数量~",
              icon: 'none',
              duration: 2000
            });
            return false;
          }
          util.setHideLoading(true);
          addShopCartNew(val);
          canAddGrabCart = true;
        } else {
          canAddGrabCart = true;
          uni.showToast({
            title: "当前秒杀商品已抢完，看看别的商品吧~",
            icon: 'none',
            duration: 2000
          });
        }
      }).catch(err => {
        canAddGrabCart = true;
        util.showToast(err.message);
      });
    } else {
      canAddGrabCart = true;
      addShopCartNew(val);
    }
  } else {
    canAddGrabCart = true;
    NAVPAGE.toAuthorize();
  }
}
function addShopCartNew(val) {
  if (!canAddToCart) {
    console.log("已经在处理加入购物车");
    return;
  }
  canAddToCart = false;
  if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
    canAddToCart = true;
    util.showToast('该活动仅限新会员专享哦~', 2000);
  } else {
    const that = this;
    const balance = state.balance;
    const business = state.business;
    let hasSharingPersonId = false;
    if (canAddToCart === false) {
      if (balance > 0) {
        addShopCartData = val;
        let productId = '';
        if (specs != null) {
          productId = specs.productId;
          addShopCartData = {
            detail: {
              target: {
                dataset: {
                  id: productId,
                  addtype: 'detail'
                }
              }
            }
          };
        } else {
          productId = val.detail.target.dataset.id;
        }
        const postData = {
          storeId: state.storeId,
          lists: [{
            count: state.productNum,
            productId
          }]
        };
        if (app.globalData.isShoppingGuidanceRecordGoods) {
          // 获取分享人id
          const shareData = getSharePeopleInfo();
          if (shareData && shareData != null && shareData.productId === productId) {
            postData.lists[0].sharingPersonId = shareData.shareId;
            hasSharingPersonId = true;
          }
        }

        // 统配商品
        if (business === 'DISTRIBUTION' || business === 'NEXT_DAY') {
          postData.storeId = state.storeId;
        }
        if (state.goodType === 'newmbr') {
          postData.lists[0].newmbrActivityId = state.goodsDetail.activityId;
        } else if (state.goodType === 'secondkill') {
          if (state.secKillInfo.type === "SPEC" && !customData.hasGrabPrice) {
            // 选择的子规格是普通规格不是秒杀
          } else {
            postData.lists[0].grabActivityId = state.activityId;
          }
        }
        if (app.globalData.userInfo.member) {
          if (state.isCateringMeals) {
            // 餐饮套餐商品
            state.scource = "SHOPPINGCART";
            _addShopcart(productId);
          } else {
            cateringAdd(postData);
          }
        } else {
          canAddToCart = true;
          NAVPAGE.toAuthorize();
        }
      } else {
        canAddToCart = true;
        uni.showToast({
          title: '门店库存不足，换家门店试试吧~',
          icon: 'none',
          duration: 2000
        });
      }
      function cateringAdd(postData) {
        if (postData.lists["0"].productId != null) {
          shopcartService.cateringAdd(postData).then(res => {
            const opts = {
              products: [{
                productId,
                traceId: options.traceId != null ? options.traceId : ""
              }]
            };
            canAddToCart = true;
            console.log(res);
            app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : business === 'NEXT_DAY' ? 'nextDay' : 'normal';
            app.globalData.isShopCartChange = true;
            if (!util.isHideLoading()) {
              util.setHideLoading(true);
            }
            if (state.isSecKill) {
              state.grabProductNum = parseInt(state.grabProductNum) + 1;
            }
            if (app.globalData.systemConfigure.showCartModule) {
              changeCanAddToCart = true;
              queryShopcart();
            } else {
              canAddToCart = true;
            }
            // wx.showToast({
            //   title: '添加购物车成功~',
            //   icon: 'none',
            //   duration: 2000
            // })
            if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
              util.removeSharingPersonInfo();
            }
            handleTouchOnGoods(addShopCartData);
          }).catch(err => {
            canAddToCart = true;
            console.log(err);
            if (state.goodType === 'newmbr' && err.code === 39008) {
              uni.showToast({
                title: '该活动仅限新会员专享哦~',
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
          });
        } else {
          canAddToCart = true;
        }
      }
    }
  }
}
function addRelatedProductToShopcart(val) {
  if (!canAddToCart) {
    return;
  }
  canAddToCart = false;
  if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
    canAddToCart = true;
    util.showToast('该活动仅限新会员专享哦~', 2000);
  } else {
    const that = this;
    if (canAddToCart === false) {
      const productId = val.detail.target.dataset.id;
      const business = val.detail.target.dataset.business;
      let balance = val.detail.target.dataset.balance;
      const grabActivityId = val.detail.target.dataset.grabactivityid;
      const style = val.detail.target.dataset.style;
      const mode = val.detail.target.dataset.type;
      let storeId = '';
      const loginStatus = checkAuth();
      if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
        if (loginStatus) {
          if (business === "DISTRIBUTION") {
            try {
              const _data = uni.getStorageSync('wj_distributionStore');
              if (_data) {
                storeId = _data.id;
              }
            } catch (e) {}
          } else if (business === "NEXT_DAY") {
            try {
              const _data = uni.getStorageSync('wj_nextDayStore');
              if (_data) {
                storeId = _data.id;
              }
            } catch (e) {}
          } else {
            storeId = app.globalData.storeInfo.id;
          }
          let postData = {
            storeId,
            lists: [{
              count: 1,
              productId
            }]
          };
          if (app.globalData.isShoppingGuidanceRecordGoods) {
            // 获取分享人id
            const shareData = getSharePeopleInfo();
            let hasSharingPersonId = false;
            if (shareData && shareData != null && shareData.productId === productId) {
              postData.lists[0].sharingPersonId = shareData.shareId;
              hasSharingPersonId = true;
            }
          }
          if (grabActivityId != null) {
            postData = {
              storeId,
              lists: [{
                count: 1,
                grabActivityId,
                productId
              }]
            };
          }
          if (mode === 'reduce') {
            postData = {
              storeId,
              lists: [{
                count: -1,
                productId
              }]
            };
          }
          if (business === 'DISTRIBUTION' || business === 'NEXT_DAY') {
            balance = 0;
            productService.getDetails(storeId, productId).then(res => {
              if (res) {
                balance = res.balance;
              }
              if (style === 'MEALS') {
                if (mode === 'reduce') {
                  canAddToCart = true;
                } else {
                  _addShopcart(productId);
                }
              } else {
                if (mode === 'reduce') {
                  if (state.shopCart[productId] > 0) {
                    addGoods(balance);
                  } else {
                    canAddToCart = true;
                  }
                } else {
                  addGoods(balance);
                }
              }
            }).catch(err => {
              canAddToCart = true;
            });
          } else if ((business === 'CATERING' || business === 'DISTRIBUTION' || business === 'NEXT_DAY') && style === 'MEALS') {
            if (mode === 'reduce') {
              canAddToCart = true;
            } else {
              _addShopcart(productId);
            }
          } else {
            if (mode === 'reduce') {
              if (state.shopCart[productId] > 0) {
                addGoods(balance);
              } else {
                canAddToCart = true;
              }
            } else {
              addGoods(balance);
            }
          }
          /**
           * 加入购物车
           * @param balance 
           */
          function addGoods(balance) {
            if (app.globalData.userInfo.member) {
              if (balance === 0 || balance === null || balance === '') {
                canAddToCart = true;
                uni.showToast({
                  title: '门店中该商品库存不足，请选购其他商品~',
                  icon: 'none',
                  duration: 2000
                });
              } else {
                util.setHideLoading(true);
                shopcartService.cateringAdd(postData).then(res => {
                  const opts = {
                    products: [{
                      productId,
                      traceId: options.traceId != null ? options.traceId : ""
                    }]
                  };
                  util.setHideLoading(false);
                  app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : business === 'NEXT_DAY' ? 'nextDay' : 'normal';
                  app.globalData.isShopCartChange = true;
                  if (mode === 'reduce') {
                    reduceLocalGoods(productId);
                  } else {
                    if (i && i !== void 0) {
                      addToCartAnimateTest(val);
                      addLocalGoods(productId);
                    } else {
                      handleTouchOnGoods(addShopCartData);
                    }
                  }
                  if (app.globalData.systemConfigure.showCartModule) {
                    changeCanAddToCart = true;
                    queryShopcart();
                  } else {
                    canAddToCart = true;
                  }
                  if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                    util.removeSharingPersonInfo();
                  }
                }).catch(err => {
                  canAddToCart = true;
                  util.setHideLoading(false);
                  uni.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000
                  });
                });
              }
            } else {
              canAddToCart = true;
              NAVPAGE.toAuthorize();
            }
          }
        } else {
          canAddToCart = true;
          uni.showToast({
            title: '请先点击头像授权登录后添加哦~',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        canAddToCart = true;
        // 多规格商品跳转商品详情
        const distributionStoreData = uni.getStorageSync('wj_distributionStore');
        const nextDayStoreData = uni.getStorageSync('wj_nextDayStore');
        if (distributionStoreData && business === "DISTRIBUTION") {
          storeId = distributionStoreData.id;
        } else if (nextDayStoreData && business === "NEXT_DAY") {
          storeId = nextDayStoreData.id;
        }
        let opts = '?productId=' + productId + (business === "DISTRIBUTION" || business === "NEXT_DAY" ? storeId ? '&storeId=' + storeId : '' : '&storeId=' + state.storeId) + '&source=addshopcart';
        if (grabActivityId != null && state.grabData.grabStatus !== 'started') {
          opts = opts + '&type=secondkill';
        } else {
          opts = opts + '&type=normal';
        }
        if (val.detail.target.dataset.easyscene != null) {
          opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene;
        }
        NAVPAGE.toGoodsDetails(opts);
      }
    }
  }
}
function queryShopcart() {
  const self = this;
  if (options.type === "secondkill" || state.isSecKill) {
    shopcartService.getCatering(state.storeId).then(res => {
      console.log(res);
      if (util.isHideLoading()) {
        util.setHideLoading(false);
      }
      let grabProductNum = 0;
      for (let i = 0; i < res.items.length; i++) {
        const item = res.items[i];
        if ((item.productId === options.productId || item.productId === state.goodsId) && item.grabActivityId != null) {
          grabProductNum = grabProductNum + item.productNum;
          break;
        }
      }
      state.grabProductNum = grabProductNum;
      const tempShopCart = {};
      const grabProducts = {};
      const tempShopCartGoodsId = [];
      const tempGrabShopCartGoodsId = [];
      if (res.items && res.items.length > 0) {
        // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
        res.items.forEach(item => {
          if (!item.grabActivityId && !item.newmbrActivityId) {
            let index = -1;
            for (let i = 0; i < tempShopCartGoodsId.length; i++) {
              if (item.productId == tempShopCartGoodsId[i]) {
                index = i;
              }
            }
            if (index > -1) {
              tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum;
            } else {
              tempShopCart[item.productId] = item.productNum;
              tempShopCartGoodsId.push(item.productId);
            }
          } else if (item.grabActivityId) {
            let index = -1;
            for (let i = 0; i < tempGrabShopCartGoodsId.length; i++) {
              if (item.productId == tempGrabShopCartGoodsId[i]) {
                index = i;
              }
            }
            if (index > -1) {
              grabProducts[item.productId] = grabProducts[item.productId] + item.productNum;
            } else {
              grabProducts[item.productId] = item.productNum;
              tempGrabShopCartGoodsId.push(item.productId);
            }
          }
        });
      }
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart
      };
      const localGrabData = {
        goodsId: tempGrabShopCartGoodsId,
        items: grabProducts
      };
      try {
        uni.setStorageSync('wj_shopCartStorage', localData);
        uni.setStorageSync('wj_grabshopCartStorage', localGrabData);
      } catch (e) {}
      changeCanAddToCart = false;
      canAddToCart = true;
    }).catch(e => {
      changeCanAddToCart = false;
      canAddToCart = true;
    });
  } else if (changeCanAddToCart) {
    changeCanAddToCart = false;
    canAddToCart = true;
  }
  shopcartService.getProductsCount().then(res => {
    uni.hideLoading();
    console.log(res);
    state.shopCartNum = res;
    isOnLoadQuery = false;
  }).catch(err => {
    isOnLoadQuery = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function hideTel(tel) {
  const reg = /^(\d{3})\d{4}(\d{4})$/;
  tel = tel.replace(reg, "$1****$2");
  return tel;
}
function handleToTeamBuying(val) {
  const that = this;
  const teamBuyId = val.target.dataset.teambuyid;
  const teamLeaderRecordId = val.target.dataset.teamleaderrecordid;
  const opts = '?teamBuyId=' + teamBuyId + '&teamLeaderRecordId=' + teamLeaderRecordId;
  NAVPAGE.toGroupPurchase(opts);
}
function toAllTeamList() {
  const opts = '?goodsId=' + state.goodsId + '&storeId=' + state.storeId + '&teamBuyId=' + options.productId + '&balance=' + state.balance;
  NAVPAGE.toTeamList(opts);
}
function rulesDetail() {
  toggleRulesDetailPopup();
}
function clickBlank(val) {
  if (val.currentTarget.dataset.type === 'goods') {
    state.modal = false;
  } else if (val.currentTarget.dataset.type === 'group') {
    state.groupModal = false;
  }
}
function clickBody() {}
function handleReduce(e) {
  const that = this;
  let num = state.productNum;
  if (num > 1 && (!state.secKillInfo.minQty || state.secKillInfo.minQty < num) && (!state.minQty || state.minQty < num)) {
    num--;
    state.productNum = num;
  } else {}
}
function handleAdd(e) {
  const that = this;
  let num = state.productNum;
  const limit = state.memberLimit;
  const orderNumber = state.orderNumber;
  const name = state.name;
  console.log(state.balance, "that.data.balance", num);
  if (num < state.balance) {
    if (state.personLimitQuantity && parseInt(num) + 1 > state.personLimitQuantity) {
      uni.showToast({
        title: '最多购买' + state.personLimitQuantity + '件',
        icon: 'none',
        duration: 2000
      });
    } else if (state.advanceSell) {
      if (num < limit) {
        num++;
        state.productNum = num;
      } else {
        uni.showToast({
          title: '该商品预售活动最多只能购买' + limit + '件~',
          icon: 'none',
          duration: 2000
        });
      }
    } else if (state.isTeam) {
      if (num < orderNumber) {
        num++;
        state.productNum = num;
      } else {
        uni.showToast({
          title: '该商品团购活动最多只能购买' + orderNumber + '件~',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      num++;
      state.productNum = num;
    }
  } else {
    uni.showToast({
      title: '我们只有这么多了~',
      icon: 'none',
      duration: 2000
    });
  }
}
function handleInput(e) {
  const that = this;
  let limit = 999;
  const num = e.detail.value;
  const balance = state.balance;
  if (state.advanceSell) {
    limit = state.memberLimit;
  } else if (state.isTeam) {
    limit = state.orderNumber;
  }
  if (num < balance) {
    if (num < limit) {
      state.productNum = num;
    } else {
      state.productNum = limit;
      if (state.isTeam) {
        uni.showToast({
          title: '该商品团购活动最多只能购买' + limit + '件~',
          icon: 'none',
          duration: 2000
        });
      } else {
        uni.showToast({
          title: '该商品预售活动最多只能购买' + limit + '件~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    if (num < limit) {
      state.productNum = balance;
      uni.showToast({
        title: '我们只有这么多了~',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (balance < limit) {
        state.productNum = balance;
        uni.showToast({
          title: '我们只有这么多了~',
          icon: 'none',
          duration: 2000
        });
      } else {
        state.productNum = limit;
        if (state.isTeam) {
          uni.showToast({
            title: '该商品团购活动最多只能购买' + limit + '件~',
            icon: 'none',
            duration: 2000
          });
        } else {
          uni.showToast({
            title: '该商品预售活动最多只能购买' + limit + '件~',
            icon: 'none',
            duration: 2000
          });
        }
      }
    }
  }
}
function scoreExchange(val) {
  const that = this;
  const good = state.scoreInfo;
  console.log(good);
  scoreProductService.getMemberCount(good.activityId, state.member.id).then(res => {
    if (res > 0) {
      handleExchange();
    } else {
      state.show.upgrade = true;
    }
  }).catch(err => {
    util.showToast(err.message);
  });
  function handleExchange() {
    if (good.type === "SCORE_PRODUCT_PRODUCT") {
      // 积分商品判断购买资格
      if (parseFloat(good.product.balance) <= 0) {
        utils.showToast("您要兑换的商品" + good.product.name + "门店库存不足");
        return;
      } else if (parseFloat(good.total) <= 0) {
        utils.showToast("您要兑换的商品" + good.product.name + "已经被兑换完了");
        return;
      }
    }
    if (state.scoreProduct.total > 0 && state.balance > 0) {
      // 判断商品数量
      if (state.score > state.scoreInfo.score) {
        // 判断积分是否足够
        try {
          const scoreMall = {
            allPrice: state.scoreInfo.score,
            storeId: state.storeId,
            goodsList: [],
            orderType: 'scoreMall',
            score: state.scoreInfo.score
          };
          scoreMall.goodsList.push({
            ...state.scoreProduct,
            total: 1
          });
          uni.setStorageSync('wj_shopcart', scoreMall);
        } catch (e) {
          console.log(e);
        }
        // 判断是否绑定手机号
        if (app.globalData.userInfo.member) {
          NAVPAGE.toAddScoreOrder();
        } else {
          NAVPAGE.toAuthorize();
        }
      } else {
        uni.showToast({
          title: '积分不足',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      uni.showToast({
        title: '您来晚了，商品已兑完',
        icon: 'none',
        duration: 2000
      });
    }
  }
}
function handleNext() {
  const that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member && state.isAdvanceSellActiveStart) {
    state.modal = true;
  } else {
    if (!state.isAdvanceSellActiveStart) {
      uni.showToast({
        title: '活动未开始',
        icon: 'none'
      });
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function joinThousandGroup(e) {
  const that = this;
  const type = e.detail.target.dataset.type;
  const teamBuyList = state.teamBuyList;
  if (teamBuyList.length > 0) {
    let newArr = [];
    newArr = [].concat(teamBuyList); // newArr为一个新的数组，不是简单的赋值引用
    function compare(property) {
      return function (a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value2 - value1;
      };
    }
    newArr.sort(compare('overplusJoinCount')); // newArr已经按照从大到小的顺序进行排列, 根据对象中的overplusJoinCount属性进行排序
    const joinTeam = newArr[0];
    let tempGroupInfo = state.groupInfo;
    tempGroupInfo = {
      ...tempGroupInfo,
      teamLeaderRecordId: joinTeam.teamLeaderRecordId
    };
    state.groupInfo = tempGroupInfo;
    if (state.balance > 0) {
      if (state.specs.length > 0) {
        if (state.balance > 0) {
          state.goodsImg = state.productPictures[0].url;
          state.hasTeamLeader = type === "leader";
          toggleTeamGoodsSpecPopup();
        } else {
          uni.showToast({
            title: '门店正在补货中，看看其他商品吧~',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        if (teamBuyings.type !== "SPEC") {
          joinGroup(e);
        }
      }
    } else {
      uni.showToast({
        title: "门店正在补货中，去看看别的吧~",
        icon: 'none'
      });
    }
  } else {
    uni.showToast({
      title: "没有进行中的团购活动~",
      icon: 'none'
    });
  }
}
function openTeamBuyModal(val) {
  if (state.groupBalance > 0) {
    const teamBuyId = val.currentTarget.dataset.teambuyid;
    const teamLeaderRecordId = val.currentTarget.dataset.teamleaderrecordid;
    getOpenTeamBuyData(teamLeaderRecordId);
  } else {
    uni.showToast({
      title: "门店正在补货中，去看看别的吧~",
      icon: 'none'
    });
  }
}
function getOpenTeamBuyData(teamLeaderRecordId) {
  const self = this;
  teamBuyService.getRecordsByLeaderId(teamLeaderRecordId).then(res => {
    const _teamBuyings = teamBuyings;
    let tempData = {
      teamLeaderPrice: _teamBuyings.teamLeaderPrice ? _teamBuyings.teamLeaderPrice : _teamBuyings.teamMemberPrice,
      joinMemberCount: res.leader.joinMemberCount,
      teamLeaderRecordId,
      teamMemberCount: _teamBuyings.teamMemberCount,
      openTeamTime: res.leader.startTime ? res.leader.startTime : res.leader.createTime,
      duration: _teamBuyings.duration,
      joinPeopleCount: res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount,
      teamPeopleCount: _teamBuyings.teamMemberCount > 12 ? 12 : _teamBuyings.teamMemberCount,
      leaderImageUrl: state.imagesPath.userImg1,
      teamMemberImageUrl: state.imagesPath.userImg1,
      teamBuyingType: state.teamBuyingType,
      teamBuyEnd: false
    };
    _teamBuyings.teamLeaderPrice = _teamBuyings.teamLeaderPrice != null ? _teamBuyings.teamLeaderPrice : _teamBuyings.teamMemberPrice;
    if (_teamBuyings.teamMemberJoinCount != null) {
      state.teamAllPrice = parseFloat((_teamBuyings.teamLeaderPrice * _teamBuyings.teamMemberJoinCount).toFixed(2));
      state.teamMemberAllPrice = parseFloat((_teamBuyings.teamMemberPrice * _teamBuyings.teamMemberJoinCount).toFixed(2));
    } else {
      state.teamAllPrice = _teamBuyings.teamLeaderPrice ? _teamBuyings.teamLeaderPrice : _teamBuyings.teamMemberPrice;
      state.teamMemberAllPrice = _teamBuyings.teamMemberPrice;
    }
    const tempJoinMbrs = [];
    if (res.records.length > 0) {
      if (_teamBuyings.teamBuyingType !== 'THOUSAND' && res.mobile !== '匿名') {
        const tempItem = {
          avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1
        };
        tempJoinMbrs.push(tempItem);
      }
      res.records.forEach(item => {
        const tempItem = {
          ...item,
          avatar: item.avatar ? item.avatar : state.imagesPath.userImg1
        };
        if (item.mobile && item.mobile !== res.leader.mobile) {
          tempJoinMbrs.push(tempItem);
        }
      });
    } else {
      if (res.leader.joinMemberCount === 1) {
        const tempItem = {
          avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1
        };
        tempJoinMbrs.push(tempItem);
      }
    }
    tempData = {
      ...tempData,
      joinMbrs: tempJoinMbrs
    };
    state.groupInfo = tempData;
    const _data2 = new util.ResponseDate();
    const nowDate = new util.ResponseDate().getTime();
    let openTime = 0;
    if (state.groupInfo.openTeamTime) {
      openTime = new Date(state.groupInfo.openTeamTime.replace(/-/g, '/')).getTime();
    } else {
      openTime = nowDate;
      state.openTeamTime = util.formatTime(_data2).replace(/\//g, '-');
    }
    const duration = (nowDate - openTime) / 1000;
    if (duration >= state.groupInfo.duration) {
      const newTempData = {
        ...tempData,
        teamBuyEnd: true
      };
      state.groupInfo = newTempData;
    }
    if (state.groupInfo.teamBuyEnd === false) {
      // 获取倒计时
      const teamBuyTimeInfo = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      const tempTime = {
        openTeamTime: state.groupInfo.openTeamTime,
        duration: state.groupInfo.duration
      };
      teamBuyTimeInfo.push(tempTime);
      state.teamBuyTimeList = teamBuyTimeInfo;
      clearTimeout(state.timeId);
      countDown();
      // 执行倒计时函数
      function countDown() {
        clearTimeout(state.timeId);
        // console.log(self.data.countDownTime)
        state.countDownTime = util.countDown(teamBuyTimeInfo)[0];
        if (state.countDownTime.hou == '00' && state.countDownTime.min == '00' && state.countDownTime.sec == '00') {
          const newData = {
            ...tempData,
            teamBuyEnd: true
          };
          state.groupInfo = newData;
        }
        const time = setTimeout(function () {
          countDown(teamBuyTimeInfo);
        }, 1000);
        state.timeId = time;
      }
    } else {}
  });
  state.groupModal = true;
}
function joinGroup(e) {
  const self = this;
  const loginStatus = checkAuth();
  if (loginStatus) {
    if (state.groupBalance <= 0) {
      uni.showToast({
        title: '拼团商品库存不足，看看其他拼团吧~',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    console.log(teamBuyings);
    const goodsList = state.goodsList;
    let teamBuy = {
      allPrice: (teamBuyings.teamMemberPrice * state.productNum).toFixed(2),
      storeId: state.storeId,
      storeName: state.storeName,
      goodsList: [],
      teamBuyId: teamBuyings.id,
      teamLeaderRecordId: state.groupInfo.teamLeaderRecordId,
      orderType: 'group',
      teamBuyInfo: {
        endTime: teamBuyings.endTime,
        orderSelfScope: teamBuyings.orderSelfScope,
        selfStartTime: teamBuyings.selfStartTime,
        selfEndTime: teamBuyings.selfEndTime,
        canUseCoupon: teamBuyings.canUseCoupon,
        canUseScore: teamBuyings.canUseScore,
        teamMemberJoinCount: teamBuyings.teamMemberJoinCount,
        orderLimitCount: teamBuyings.orderLimitCount,
        selfAfterDay: teamBuyings.selfAfterDay
      },
      scource: 'BUYNOW',
      shipmentType: state.shipmentType // 添加活动的配送方式
    };
    if (options.room_id) {
      teamBuy = {
        ...teamBuy,
        orderSource: 'WX_MINI_APP-LIVE',
        room_id: options.room_id
      };
    }
    goodsList.forEach(item => {
      item = {
        ...item,
        productId: item.id,
        productNum: state.productNum < state.teamMemberJoinCount ? state.teamMemberJoinCount : state.productNum ? state.productNum : 1,
        initialPurchaseNumber: state.initialPurchaseNumber || 1,
        sellPrice: teamBuyings.teamMemberPrice
      };
      teamBuy.goodsList.push(item);
    });
    if (state.isCateringMeals) {
      getCateringDetailsById(teamBuy.goodsList[0].id, true).then(res => {
        teamBuy.goodsList.groupProducts = res.product.lists[0].lists;
        callBackFn();
      });
    } else {
      callBackFn();
    }
    function callBackFn() {
      uni.setStorageSync('wj_shopcart', teamBuy);
      if (state.teamMemberCount - state.joinMemberCount == 0) {} else {
        if (app.globalData.userInfo.member) {
          const easyScene = "none";
          if (options.easyScene != null) {}
          let opts = "?easyScene=" + easyScene;
          if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
            opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
          }
          NAVPAGE.toPerfectOrder(opts);
        } else {
          NAVPAGE.toAuthorize();
        }
      }
    }
  } else {}
}
function toPayTeamBuying(val) {
  const self = this;
  const loginStatus = checkAuth();
  if (loginStatus && state.productNum != '' && state.productNum != 0) {
    if (state.groupStatus === "STARTED") {
      if (state.groupBalance > 0) {
        try {
          const goodsPrice = state.teamAllPrice.toFixed(2);
          let teamBuy = {
            allPrice: goodsPrice,
            storeId: state.storeId,
            goodsList: [],
            teamBuyId: options.productId,
            orderType: 'group',
            shipmentType: state.shipmentType,
            // 添加活动的配送方式
            teamBuyInfo: {
              endTime: state.endTime,
              orderSelfScope: state.orderSelfScope,
              selfStartTime: state.selfStartTime,
              selfEndTime: state.selfEndTime,
              canUseCoupon: teamBuyings.canUseCoupon,
              canUseScore: teamBuyings.canUseScore,
              teamMemberJoinCount: teamBuyings.teamMemberJoinCount,
              orderLimitCount: teamBuyings.orderLimitCount,
              selfAfterDay: teamBuyings.selfAfterDay
            },
            scource: 'BUYNOW'
          };
          if (options.room_id) {
            teamBuy = {
              ...teamBuy,
              orderSource: 'WX_MINI_APP-LIVE',
              room_id: options.room_id
            };
          }
          const productsList = state.goodsList;
          const sellPrice = (Number(state.teamLeaderPrice) * Number(state.productNum)).toFixed(2);
          productsList.forEach(item => {
            item = {
              ...item,
              productId: item.id,
              productNum: state.productNum < state.teamMemberJoinCount ? state.teamMemberJoinCount : state.productNum ? state.productNum : 1,
              initialPurchaseNumber: state.initialPurchaseNumber || 1,
              sellPrice
            };
            if (item.sellEndTime && item.sellStartTime) {
              item = {
                ...item,
                startTime: item.sellStartTime,
                endTime: item.sellEndTime
              };
            }
            teamBuy.goodsList.push(item);
          });
          if (state.isCateringMeals) {
            getCateringDetailsById(teamBuy.goodsList[0].id, true).then(res => {
              teamBuy.goodsList.groupProducts = res.product.lists[0].lists;
              uni.setStorageSync('wj_shopcart', teamBuy);
              callBackFn();
            });
          } else {
            uni.setStorageSync('wj_shopcart', teamBuy);
            callBackFn();
          }
        } catch (e) {
          console.log(e.message);
        }
        function callBackFn() {
          // 判断是否绑定手机号
          if (app.globalData.userInfo.member) {
            let easyScene = "none";
            if (options.easyScene != null) {
              easyScene = options.easyScene;
            }
            let opts = "?easyScene=" + easyScene;
            if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
              opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
            }
            NAVPAGE.toPerfectOrder(opts);
          } else {
            NAVPAGE.toAuthorize();
          }
        }
      } else {
        uni.showToast({
          title: '拼团商品库存不足，看看其他拼团吧~',
          icon: 'none',
          duration: 2000
        });
      }
    } else if (state.groupStatus === "UNOPENED") {
      uni.showToast({
        title: '活动还没有开始哦~',
        icon: 'none'
      });
    } else {
      uni.showToast({
        title: '活动已经结束了，看看别的活动吧~',
        icon: 'none'
      });
    }
  }
}
function toPaySecKill(e) {
  const that = this;
  if (state.secKillInfo.availableStockAmount !== 0) {
    const shoppingCarts = [{
      grabActivityId: state.activityId,
      productId: options.productId,
      quantity: 1
    }];
    const postData = {
      storeId: state.storeId,
      memberId: app.globalData.userInfo.member.id,
      shoppingCarts
    };
    if (state.secKillInfo.secKillStatus === "normal") {
      const loginStatus = checkAuth();
      if (loginStatus && state.isMember) {
        shopcartService.checkShoppingToOrder(postData).then(res => {
          // 餐饮套餐商品
          state.scource = "BUYNOW";
          if (state.isCateringMeals) {
            return getCateringDetailsById(options.productId);
          }
        }).then(res => {
          // 餐饮套餐商品
          if (state.balance > 0) {
            if (state.secKillInfo.availableStockAmount > 0) {
              if (state.secKillInfo.minQty && state.secKillInfo.minQty > state.secKillInfo.availableStockAmount) {
                uni.showToast({
                  title: '库存数量小于起购数量~',
                  icon: 'none',
                  duration: 2000
                });
                return false;
              }
              try {
                const secKill = {
                  allPrice: state.secKillInfo.price,
                  storeId: state.storeId,
                  goodsList: [],
                  orderType: 'secondkill',
                  scource: 'BUYNOW',
                  secKillInfo: state.secKillInfo
                };
                if (options.room_id) {
                  seckill = {
                    ...seckill,
                    orderSource: 'WX_MINI_APP-LIVE',
                    room_id: options.room_id
                  };
                  seckill.orderSource = 'WX_MINI_APP-LIVE';
                }
                let price = 0;
                const productsList = state.goodsList;
                console.log(state.secKillInfo, "this.data.secKillInfothis.data.secKillInfo");
                productsList.forEach(item => {
                  item = {
                    ...item,
                    productId: item.id,
                    productNum: state.secKillInfo.minQty && state.secKillInfo.minQty > state.productNum ? state.secKillInfo.minQty : state.productNum,
                    initialPurchaseNumber: state.initialPurchaseNumber || 1,
                    sellPrice: state.secKillInfo.price,
                    grabActivityId: state.activityId,
                    minQty: state.secKillInfo.minQty
                  };
                  price += parseFloat((item.productNum * item.sellPrice).toFixed(2));
                  if (state.isCateringMeals) {
                    item.groupProducts = res.product.lists[0].lists;
                  }
                  secKill.goodsList.push(item);
                });
                secKill.allPrice = price;
                uni.setStorageSync('wj_shopcart', secKill);
              } catch (e) {}

              // 跳转到完善订单
              let easyScene = "none";
              if (options.easyScene != null) {
                easyScene = options.easyScene;
              }
              let opts = "?easyScene=" + easyScene;
              if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
                opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
              }
              NAVPAGE.toPerfectOrder(opts);
            } else {
              uni.showToast({
                title: '您来晚了，已经被抢光了~',
                icon: 'none',
                duration: 2000
              });
            }
          } else {
            uni.showToast({
              title: '门店正在努力补货中~',
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(e => {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (state.secKillInfo.secKillStatus === "created") {
      uni.showToast({
        title: '活动还没有开始哦~',
        icon: 'none'
      });
    } else {
      uni.showToast({
        title: '活动已经结束了，看看别的活动吧~',
        icon: 'none'
      });
    }
  }
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
function getTeamBuyGoodsDetails(storeId, productId) {
  const self = this;
  console.log(storeId, productId);
  teamBuyService.getById(productId).then(res => {
    if (res) {
      console.log('查询团购活动详情');
      console.log(res);
      teamBuyings = {};
      teamBuyings = {
        ...res,
        teamMemberJoinCount: res.teamMemberJoinCount ? res.teamMemberJoinCount : 1,
        selfAfterDay: res.selfAfterDay || res.selfAfterDay === 0 ? res.selfAfterDay : null
      };
      const teamLeaderPrice = res.teamLeaderPrice ? res.teamLeaderPrice : res.teamMemberPrice;
      state.isTeam = true;
      state.teamLeaderPrice = teamLeaderPrice;
      state.teamMemberPrice = res.teamMemberPrice;
      state.teamMemberCount = res.teamMemberCount;
      state.goodsId = res.productId;
      state.endTime = res.endTime;
      state.orderNumber = res.teamMemberJoinCount ? res.teamMemberJoinCount : 1;
      state.teamMemberJoinCount = res.teamMemberJoinCount ? res.teamMemberJoinCount : 1;
      state.productNum = res.teamMemberJoinCount ? res.teamMemberJoinCount : 1;
      state.groupNumber = util.numberConversion.numberToChinese(res.teamMemberCount);
      state.orderSelfScope = res.orderSelfScope;
      state.selfStartTime = res.selfStartTime ? res.selfStartTime : '';
      state.selfEndTime = res.selfEndTime ? res.selfEndTime : '';
      state.teamBuyingType = res.teamBuyingType;
      state.groupSharePicture = res.sharePicture ? res.sharePicture : '';
      state.groupDescription = res.description ? res.description : '';
      state.deliveryTimeStatement = res.deliveryTimeStatement ? res.deliveryTimeStatement : '';
      state.shipmentType = res.shipmentType;
      if (res.teamMemberJoinCount != null) {
        state.teamAllPrice = parseFloat((teamLeaderPrice * res.teamMemberJoinCount).toFixed(2));
        state.teamMemberAllPrice = parseFloat((res.teamMemberPrice * res.teamMemberJoinCount).toFixed(2));
      } else {
        state.teamAllPrice = teamLeaderPrice;
        state.teamMemberAllPrice = res.teamMemberPrice;
      }
      // 千人团处理
      if (res.teamBuyingType === 'THOUSAND') {
        state.groupInfo = res;
      }
      // 获取团购活动倒计时
      let startTime = res.startTime;
      const endTime = res.endTime;
      // 活动开始时间戳
      const startTimeStamp = new Date(startTime.replace(/-/g, '/')).getTime();
      // 活动结束时间戳
      const endTimeStamp = new Date(endTime.replace(/-/g, '/')).getTime();
      // 活动持续时间
      let duration = 0;
      // 团购活动有效期
      let groupDuration = 0;
      // 当前时间
      let groupStatus = res.status; // UNOPENED,STARTED,FINISHED
      const date = new util.ResponseDate();
      const now = util.formatTime(date).replace(/\//g, '-');
      let tempArr = [];
      if (res.status === "SUBMIT" || res.status === "UNSUBMIT") {
        // 未开始 
        if (date < startTimeStamp) {
          // 团购活动未开始
          groupStatus = "UNOPENED";
          duration = (startTimeStamp - date) / 1000;
          groupDuration = (endTimeStamp - startTimeStamp) / 1000;
          startTime = now;
        } else if (res.status === "SUBMIT" && date >= startTimeStamp && date <= endTimeStamp) {
          // 团购活动进行中
          groupStatus = "STARTED";
          duration = (endTimeStamp - startTimeStamp) / 1000;
        }
      } else if (res.status === "STARTED") {
        // 进行中
        if (date < startTimeStamp) {
          // 团购活动未开始
          groupStatus = "UNOPENED";
          duration = (startTimeStamp - date) / 1000;
          groupDuration = (endTimeStamp - startTimeStamp) / 1000;
          startTime = now;
        } else if (date >= startTimeStamp && date < endTimeStamp) {
          // 团购活动进行中
          duration = (endTimeStamp - startTimeStamp) / 1000;
        }
      } else {
        // 已结束和其他状态均显示已结束 FINISHED DELETED
        groupStatus = "FINISHED";
      }
      state.groupStatus = groupStatus;
      tempArr.push({
        openTeamTime: startTime,
        duration
      });
      countDown();
      // 执行倒计时函数
      function countDown() {
        clearTimeout(state.groupTimeId);
        if (state.groupStatus !== "FINISHED") {
          state.groupTime = util.countDownDay(tempArr)[0];
          if (state.groupTime.hou == '00' && state.groupTime.min == '00' && state.groupTime.sec == '00') {
            if (state.groupStatus === "UNOPENED") {
              // 未开始的秒杀活动时间到进入进行中状态
              tempArr = [];
              tempArr.push({
                openTeamTime: res.startTime,
                duration: groupDuration
              });
              state.groupStatus = "STARTED";
              countDown();
            } else {
              state.groupStatus = "FINISHED";
            }
          }
          const time = setTimeout(function () {
            countDown(tempArr);
          }, 1000);
          state.groupTimeId = time;
        }
      }
      // 获取商品库存
      getProductsComment(res.productId);
      getDetails(storeId, res.productId);
      getTeamBuyInfo(productId);
      getPackagingInfo(res.productId);
      // 获取关联商品和关联券
      getRelatedProducts(storeId, res.productId);
      getRelatedCoupon(storeId, res.productId);
      if (res.type === "SPEC") {
        getActivityGoodsSpec(res.id, res.productId, storeId, "group");
      }
    } else {
      getDetails(storeId, productId);
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getTeamBuyInfo(teamBuyId) {
  const self = this;
  teamBuyService.getTenByTeamId(teamBuyId).then(res => {
    if (res != '') {
      const tempGroupList = [];
      const _teamBuyings2 = teamBuyings;
      res.forEach(item => {
        let tempItem = {
          teamLeaderRecordId: item.id,
          // 团长记录ID
          headPortrait: item.avatar ? item.avatar : state.imagesPath.userImg1,
          joinMemberCount: item.joinMemberCount,
          // 参加人数
          mobile: hideTel(item.mobile),
          // openTeamTime: item.openTeamTime, //开团时间
          openTeamTime: item.startTime ? item.startTime : item.createTime,
          teamBuyId: _teamBuyings2.id,
          duration: _teamBuyings2.duration,
          // 持续时间
          teamMemberCount: _teamBuyings2.teamMemberCount,
          // 团购人数限定
          overplusJoinCount: _teamBuyings2.teamMemberCount - item.joinMemberCount,
          // 剩余参加人数
          teamMemberJoinCount: _teamBuyings2.teamMemberJoinCount ? _teamBuyings2.teamMemberJoinCount : 1,
          // 每人活动单品购买数量限制
          productNum: _teamBuyings2.teamMemberJoinCount ? _teamBuyings2.teamMemberJoinCount : 1,
          // 每人活动单品购买数量限制
          teamMemberPrice: _teamBuyings2.teamMemberPrice // 团员价格
        };
        if (item.mobile != '匿名') {
          tempItem = {
            ...tempItem,
            headPortrait: item.avatar ? item.avatar : state.imagesPath.userImg1
          };
        } else {
          tempItem = {
            ...tempItem,
            headPortrait: state.imagesPath.userImg1
          };
        }
        tempGroupList.push(tempItem);
      });
      // 获取倒计时
      state.teamBuyList = tempGroupList;
      let teamBuyTimeInfo = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      state.teamBuyList.forEach(o => {
        const tempTime = {
          openTeamTime: o.openTeamTime,
          duration: o.duration,
          id: o.teamLeaderRecordId
        };
        teamBuyTimeInfo.push(tempTime);
      });
      state.teamBuyTimeList = teamBuyTimeInfo;
      countDown();
      // 执行倒计时函数
      function countDown() {
        clearTimeout(state.groupListTime);
        if (state.teamBuyList.length > 0) {
          const tempGroupInfo = state.teamBuyTimeList;
          const countDownArr = util.countDown(teamBuyTimeInfo);
          let count = 0;
          const tempList = state.teamBuyList;
          const newTempList = [];
          let newTempInfo = [];
          let isDelete = false;
          countDownArr.forEach(time => {
            tempList[count].time = time;
            count++;
          });
          tempList.forEach((item, j) => {
            if (item.time.hou == 0 && item.time.min == 0 && item.time.sec == 0) {
              for (let i = 0; i < tempGroupInfo.length; i++) {
                const ele = tempGroupInfo[i];
                if (ele.id === item.teamLeaderRecordId) {
                  newTempInfo = removeAaary(tempGroupInfo, ele);
                  isDelete = true;
                  break;
                }
              }
            } else {
              newTempList.push(item);
            }
          });
          if (isDelete) {
            teamBuyTimeInfo = newTempInfo;
            state.teamBuyList = newTempList;
            state.teamBuyTimeList = newTempInfo;
          }
          state.teamBuyList = newTempList;
          const time = setTimeout(function () {
            countDown();
          }, 1000);
          state.groupListTime = time;
        }
      }
      /* 删除数组中的某一个对象
       *_arr:数组
       *_obj:需删除的对象
       */
      function removeAaary(_arr, _obj) {
        const length = _arr.length;
        for (let i = 0; i < length; i++) {
          if (_arr[i] == _obj) {
            if (i == 0) {
              _arr.shift(); // 删除并返回数组的第一个元素
              return _arr;
            } else if (i == length - 1) {
              _arr.pop(); // 删除并返回数组的最后一个元素
              return _arr;
            } else {
              _arr.splice(i, 1); // 删除下标为i的元素
              return _arr;
            }
          }
        }
      }
    }
  }).catch(e => {
    console.log(e.message);
  });
}
function getRelatedCoupon(storeId, productId) {
  const self = this;
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    console.log("不是会员，不获取关联券");
    relatedCouponEventId = bus.on('getRelatedCoupon', () => {
      getRelatedCoupon(storeId, productId);
    });
    return;
  }
  console.log("开始获取关联券");
  productService.getAvailableCouponsByProductId(storeId, productId).then(res => {
    console.log("已获取关联券");
    console.log(res);
    const timeList = [];
    res.forEach(item => {
      let tempItem = {
        ...item,
        isExternal: false
      };
      if (item.rate) {
        tempItem = {
          ...tempItem,
          rate: (item.rate * 10).toFixed(1)
        };
      }
      couponHandler.handleCouponFunction(tempItem);
      timeList.push(tempItem);
    });
    if (res) {
      state.relatedCouponList = timeList;
    }
  });
}
function getRelatedProducts(storeId, productId) {
  const self = this;
  insideGetRelatedProducts(storeId, productId);
  function insideGetRelatedProducts(storeId, productId) {
    productService.getRelatedProducts(storeId, productId).then(res => {
      if (res) {
        // res.forEach(el => {
        //     el.close = true
        //         selfA.getTemporaryUrl(el.imageUrl)
        //             .then(item => {
        //                 el.imageUrl = item
        //                 self.setData({
        //                     relatedProductList: res
        //                 })
        //             })
        // })
        state.relatedProductList = res;
      }
    });
  }
}
function getScoreProductDetails(storeId, productId) {
  const self = this;
  scoreProductService.getScoreProductById(productId).then(response => {
    if (response.product === null) {
      return;
    }
    handleScoreProductDetails(storeId, productId, response);
  }).catch(err => {});
}
function handleScoreProductDetails(storeId, productId, response) {
  const self = this;
  const res = response.product;
  console.log(res, 'resres');
  // 设置分享人信息
  setSharePeopleInfo(res.id);
  const tempData = [];
  tempData.push(res);
  let balance = Number(response.total) > Number(res.balance) ? Number(res.balance) : Number(response.total);
  balance = balance > 0 ? balance : 0;
  if (res.productNumber) {
    dataReporting(res.productNumbe);
  }
  state.goodsList = tempData;
  state.name = res.name;
  state.balance = balance;
  state.description = res.description ? res.description : '';
  state.soldCount = res.soldCount;
  state.labels = res.labels;
  state.productProperties = res.productProperties;
  state.productDetails = res.productDetails;
  state.productPictures = res.productPictures;
  state.goodsId = res.id;
  state.business = res.business;
  state.scoreInfo = response;
  state.scoreProduct = response;
  if (res.productPictures.length === 0) {
    state.productPictures = [{
      fileType: "PICTURE",
      url: res.imageUrl
    }];
  }
  if (response.scoreList) {
    console.log(response.scoreList);
    let enableMemberShip = [];
    let count = 0;
    let isMatching = false;
    let scoreInfo = {};
    response.scoreList.forEach(el => {
      ++count;
      // 存在符合自己会员等级的积分兑换规则
      if (el.gradeId === state.memberGrade) {
        isMatching = true;
        scoreInfo = {
          score: el.score,
          amount: el.amount ? el.amount : null
        };
      } else {
        // 获取低于自己等级的会员
        console.log('所有会员等级：', state.memberShip);
        for (let i = 0; i < state.memberShip.length; i++) {
          if (state.memberShip[i].id === state.memberGrade) {
            enableMemberShip = state.memberShip.slice(0, i);
            break;
          }
        }
      }
    });
    // 获取最接近自己会员等级的积分兑换规则
    if (count === response.scoreList.length && !isMatching) {
      console.log('低于自己会员等级的规则：', enableMemberShip);
      enableMemberShip.forEach(item => {
        response.scoreList.forEach(el => {
          if (el.gradeId === item.id) {
            scoreInfo = {
              score: el.score,
              amount: el.amount ? el.amount : null
            };
          }
        });
      });
    }
    console.log(scoreInfo);
    state.scoreInfo = {
      ...response,
      ...scoreInfo
    };
    console.log(state.scoreInfo);
  }

  // 判断多规格商品
  if (res.style === 'SPEC_PARENT') {
    // 查询商品规格
    goodsStyle = "SPEC_PARENT";
    getGoodsSpec(productId, storeId);
  } else if (res.style === 'MEALS2') {
    goodsStyle = "MEALS2";
  } else {
    goodsStyle = "normal";
  }
  // 商品规格
  state.promotionPrice = res.promotionPrice ? res.promotionPrice : null;
  state.sellPrice = res.sellPrice ? res.sellPrice : '';
  state.originalPrice = res.originalPrice ? res.originalPrice : '';
  if (res.productProperties.length > 0) {
    for (let i = 0; i < res.productProperties.length; i++) {
      const ele = res.productProperties[i];
      if (ele.propertyName === '规格') {
        state.specifications = ele.propertyValue;
        break;
      }
    }
  }
  // 商品标签
  const tempLabels = [];
  if (res.labels && res.labels.length > 0) {
    for (let i = 0; i < res.labels.length; i++) {
      const ele = res.labels[i];
      if (ele.type === 'PROMOTIONLABEL') {
        let isHas = false;
        for (let i = 0; i < tempLabels.length; i++) {
          const it = tempLabels[i];
          if (it.labelName && it.labelName === ele.labelName || it.imageUrl && it.imageUrl === ele.imageUrl) {
            isHas = true;
          }
        }
        if (!isHas) {
          tempLabels.push(ele);
        }
      }
    }
  }
  // if (self.options.type === 'newmbr' && self.options.goodsDetail) {
  //   const goodsDetail = JSON.parse(self.options.goodsDetail)
  //   self.setData({
  //     'promotionPrice': goodsDetail.promotionPrice ? goodsDetail.promotionPrice : null,
  //     'goodsDetail': goodsDetail,
  //     'sellPrice': goodsDetail.price,
  //     'goodType': 'newmbr'
  //   })
  // }
  state.goodsLabels = res.labels;
  goodsDetailsBuryingPoint(productId, storeId);
}
function setGoodsDetails(res) {}
function getDetails(storeId, productId) {
  const self = this;
  const normalStoreId = storeId; // 普通门店id
  getProductDetails(storeId, productId);
  function getProductDetails(storeId, productId) {
    uni.showLoading({
      title: '商品信息加载中，请稍等~'
    });
    productService.getDetails(storeId, productId).then(res => {
      console.log('获取商品详情');
      console.log(res);
      if (res) {
        if (res.business == 'DISTRIBUTION' || res.business === 'NEXT_DAY') {
          state.meals.storeId = storeId;
          state.meals = state.meals;
        }
        if (res.initialPurchaseNumber) {
          state.productNum = res.initialPurchaseNumber;
          state.initialPurchaseNumber = res.initialPurchaseNumber;
          state.minQty = res.initialPurchaseNumber;
          state.personLimitQuantity = res.personLimitQuantity;
        }
        if (res.productNumber) {
          dataReporting(res.productNumber);
        }
        const tempData = [];
        tempData.push(res);
        // 拼团剩余库存
        if (teamBuyings && teamBuyings != null && (teamBuyings.productBalance || teamBuyings.productBalance === 0) && teamBuyings.productBalance != null) {
          const balance = res.balance > teamBuyings.productBalance ? teamBuyings.productBalance : res.balance;
          state.groupBalance = balance;
        } else if (teamBuyings && teamBuyings != null && teamBuyings.productBalance == null) {
          state.groupBalance = res.balance;
        }
        console.log('描述');
        console.log(res.description);

        // 商品自定义栏目res.columnDTOS
        const columnDTOSHeader = [];
        const columnDTOSFooter = [];
        if (res.columnDTOS && res.columnDTOS.length > 0) {
          res.columnDTOS.forEach(item => {
            item.propertyValue = JSON.parse(item.propertyValue);
            if (item.location === 1) {
              columnDTOSHeader.push(item);
            } else {
              columnDTOSFooter.push(item);
            }
          });
        }
        // console.log(this.data.memberPrice,'3119');
        state.goodsList = tempData;
        state.name = res.name;
        state.balance = res.balance;
        state.description = res.description ? res.description : '';
        state.deliveryTimeStatement = res.deliveryTimeStatement ? res.deliveryTimeStatement : '';
        state.soldCount = res.soldCount;
        state.promotionPrice = res.promotionPrice ? res.promotionPrice : null;
        state.sellPrice = res.sellPrice && res.sellPrice !== 0 ? res.sellPrice : '';
        state.costPrice = res.costPrice && res.costPrice !== 0 ? res.costPrice : '';
        state.labels = res.labels;
        state.productProperties = res.productProperties;
        state.productDetails = res.productDetails;
        state.productPictures = res.productPictures;
        state.goodsId = res.id;
        state.business = res.business;
        state.pdtDetail = res;
        state.memberPrice = res.memberPrice ? res.memberPrice : null;
        state.imageUrl = res.imageUrl;
        state.columnDTOSHeader = columnDTOSHeader;
        state.columnDTOSFooter = columnDTOSFooter;
        if (res.productPictures.length === 0) {
          state.productPictures = [{
            fileType: "PICTURE",
            url: res.imageUrl
          }];
        }
        console.log('商品主图');
        console.log(state.productPictures);
        // self.data.productPictures.forEach((el, index) => {
        //     if (el.fileType === 'VIDEO') {
        //         self.setData({
        //             isAutoplay: false
        //         })
        //     }
        // })
        // let productPicturesa = self.data.productPictures
        // productPicturesa.forEach(itema => {
        //     selfA.getTemporaryUrl(itema.url)
        //         .then(res => {
        //             itema.url = res
        //             self.setData({
        //                 productPictures: productPicturesa
        //             })
        //         })
        // })
        // let productDetailsList = self.data.productDetails
        // productDetailsList.forEach(itema => {
        //     selfA.getTemporaryUrl(itema.url)
        //         .then(res => {
        //             itema.url = res
        //             self.setData({
        //                 productDetails: productDetailsList
        //             })
        //         })
        // })
        drawShareImg();
        if (res.business === 'SCORE') {
          this.setData({
            scoreInfo: res
          });
        } else if ((res.business === 'CATERING' || res.business === 'DISTRIBUTION' || res.business === 'NEXT_DAY') && res.style === 'MEALS' && (state.goodType == 'normal' || state.goodType == 'group' || state.goodType == 'secondkill')) {
          // 标识餐饮套餐商品
          state.isCateringMeals = true;
        }
        // 判断多规格商品
        if (res.style === 'SPEC_PARENT') {
          // 查询商品规格
          goodsStyle = "SPEC_PARENT";
          if (state.isSecKill) {
            getActivityGoodsSpec(state.activityId, productId, storeId, "secondkill");
          } else if (state.isTeam) {
            getActivityGoodsSpec(options.productId, productId, storeId, "group");
          } else {
            getGoodsSpec(productId, storeId);
          }
        } else if (res.style === 'MEALS2') {
          goodsStyle = "MEALS2";
          // 判断当前用户是否分销员
          if (app.globalData.distributorInfo) {
            // 获取分销提成比率
            state.isDistributor = true;
            getStrategy();
          }
        } else {
          goodsStyle = "normal";
          // 判断当前用户是否分销员
          if (app.globalData.distributorInfo) {
            // 获取分销提成比率
            state.isDistributor = true;
            getStrategy();
          }
        }
        // 判断秒杀
        if (options.type === 'secondkill' && options.goodsList && options.goodsList != null) {
          const secKillData = JSON.parse(options.goodsList);
          console.log(secKillData);
          secKillData.forEach(item => {
            if (productId === item.productId) {
              const secKillBalance = item.availableStockAmount;
              const goodsBalance = res.balance;
              if (goodsBalance < secKillBalance) {
                state.balance = goodsBalance;
              } else {
                state.balance = secKillBalance;
              }
            }
          });
        }
        // 判断拼团
        if (options.type === 'group') {
          state.sellPrice = res.sellPrice >= 0 ? (res.sellPrice * state.productNum).toFixed(2) : '';
          state.originalPrice = res.originalPrice ? (res.originalPrice * state.productNum).toFixed(2) : '';
        } else {
          state.sellPrice = res.sellPrice ? res.sellPrice : '';
          state.originalPrice = res.originalPrice ? res.originalPrice : '';
        }
        // 商品规格
        if (res.productProperties.length > 0) {
          for (let i = 0; i < res.productProperties.length; i++) {
            const ele = res.productProperties[i];
            if (ele.propertyName === '规格') {
              state.specifications = ele.propertyValue;
              break;
            }
          }
        }
        // 商品标签
        const tempLabels = [];
        if (res.labels && res.labels.length > 0) {
          for (let i = 0; i < res.labels.length; i++) {
            const ele = res.labels[i];
            if (ele.type === 'PROMOTIONLABEL') {
              let isHas = false;
              for (let i = 0; i < tempLabels.length; i++) {
                const it = tempLabels[i];
                if (it.labelName && it.labelName === ele.labelName || it.imageUrl && it.imageUrl === ele.imageUrl) {
                  isHas = true;
                }
              }
              if (!isHas) {
                tempLabels.push(ele);
              }
            }
          }
        }
        state.goodsLabels = res.labels;
        if (options.type === 'newmbr') {
          const goodsDetail = uni.getStorageSync('newMember_goodsDetail');
          state.goodsDetail = goodsDetail;
          state.sellPrice = goodsDetail.price;
          state.goodType = 'newmbr';
        }

        // 判断团购
        if (teamBuyings != null) {
          // 生成拼团商品分享图
          if (teamBuyings.sharePicture == null || teamBuyings.sharePicture == '') {
            // self.getGroupSharePictures()
            const group = {
              number: state.groupNumber,
              soldCount: state.soldCount,
              price: state.teamAllPrice,
              originalPrice: state.sellPrice,
              time: state.groupTime,
              status: state.groupStatus
            };
            util.createGroupSharePictures(state.productPictures[0].url, group).then(picture => {
              state.groupSharePictureDialogue = picture.data;
            }).catch(err => {
              console.log(err);
            });
          }
        }
        if (res.storeProductState !== "ON") {
          state.soldOut = true;
        }
        // if (res.style !== "SPEC_PARENT") {
        //     if (res.storeProductState !== "ON") {
        //         self.setData({
        //             soldOut: true
        //         })
        //     }
        // }
      }
      uni.hideLoading();
    }).catch(err => {
      uni.hideLoading();
      if (err.code === 16015) {
        // 商品暂未上架
        if (storeId === normalStoreId) {
          // 商品在普通门店未上架，查询统配门店中该商品
          if (app.globalData.distributionStore && storeId != app.globalData.distributionStore) {
            state.distributionStoreId = app.globalData.distributionStore.id;
            state.storeId = app.globalData.distributionStore.id;
            getProductDetails(app.globalData.distributionStore.id, productId);
          } else {
            storeService.getDistributionStore().then(res => {
              if (res) {
                state.distributionStoreId = app.globalData.distributionStore.id;
                state.storeId = app.globalData.distributionStore.id;
                getProductDetails(res.id, productId);
              } else {
                // 查询次日达门店中该商品
                if (app.globalData.nextDayStore && storeId != app.globalData.nextDayStore) {
                  state.nextDayStoreId = app.globalData.nextDayStore.id;
                  state.storeId = app.globalData.nextDayStore.id;
                  getProductDetails(app.globalData.nextDayStore.id, productId);
                } else {
                  storeService.getNextDayStore().then(res => {
                    if (res) {
                      state.nextDayStoreId = app.globalData.nextDayStore.id;
                      state.storeId = app.globalData.nextDayStore.id;
                      getProductDetails(res.id, productId);
                    }
                  });
                }
              }
            }).catch(() => {
              // 查询次日达门店中该商品
              if (app.globalData.nextDayStore && storeId != app.globalData.nextDayStore) {
                state.nextDayStoreId = app.globalData.nextDayStore.id;
                state.storeId = app.globalData.nextDayStore.id;
                getProductDetails(app.globalData.nextDayStore.id, productId);
              } else {
                storeService.getNextDayStore().then(res => {
                  if (res) {
                    state.nextDayStoreId = app.globalData.nextDayStore.id;
                    state.storeId = app.globalData.nextDayStore.id;
                    getProductDetails(res.id, productId);
                  }
                });
              }
            });
          }
        } else if (state.distributionStoreId == storeId) {
          // 查询次日达门店中该商品
          if (app.globalData.nextDayStore && storeId != app.globalData.nextDayStore) {
            state.nextDayStoreId = app.globalData.nextDayStore.id;
            state.storeId = app.globalData.nextDayStore.id;
            getProductDetails(app.globalData.nextDayStore.id, productId);
          } else {
            storeService.getNextDayStore().then(res => {
              if (res) {
                state.nextDayStoreId = app.globalData.nextDayStore.id;
                state.storeId = app.globalData.nextDayStore.id;
                getProductDetails(res.id, productId);
              }
            });
          }
        }
      }
    });
  }
  goodsDetailsBuryingPoint(productId, storeId);
  // 设置分享人信息
  setSharePeopleInfo(productId);
}
function getServiceTime(storeId, productId, detailData) {
  const self = this;
  const fnName = state.isFlorist ? 'getServiceStaffTime' : 'getProductTime';
  const params = {
    storeId
  };
  if (state.isFlorist) {
    params.serviceStaffId = productId;
  } else {
    params.productId = productId;
  }
  state.serviceLoading = true;
  floristService[fnName](params).then(res => {
    if (res) {
      const list = [];
      if (!Array.isArray(res)) {
        res = [res];
      }
      detailData[state.isFlorist ? 'productList' : 'serviceStaffList'].forEach(item => {
        let itemTime = {};
        res.some(timeItem => {
          if (timeItem.serviceStaffId == item.serviceStaffId) {
            itemTime = JSON.parse(JSON.stringify(timeItem));
          }
          return timeItem.serviceStaffId == item.serviceStaffId;
        });
        list.push({
          ...item,
          ...itemTime
        });
      });
      let appointmentTime = '';
      const nowTime = new Date();
      const dayText = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1 >= 10 ? nowTime.getMonth() + 1 : '0' + (nowTime.getMonth() + 1)) + '-' + (nowTime.getDate() >= 10 ? nowTime.getDate() : '0' + nowTime.getDate());
      list.forEach(item => {
        if (item.datetimeList && item.datetimeList.length > 1) {
          let earliestTime = '';
          item.datetimeList.forEach((date, dateIdx) => {
            date.time.forEach(time => {
              const timeItem = {
                time,
                isOptional: true
              };
              if (date.noTimeList && date.noTimeList.indexOf(time) > -1 || date.rest) {
                timeItem.isDisabled = true;
              }
              if (date.scheduledList && date.scheduledList.indexOf(time) > -1 || date.manualList && date.manualList.indexOf(time) > -1 || date.rest) {
                timeItem.isOptional = false;
              }
              const appointmentTimeList = appointmentTime && appointmentTime.split(' ').length > 0 ? appointmentTime.split(' ') : [];
              if (timeItem.isOptional && !timeItem.isDisabled && (!appointmentTime || new Date(time).getTime() < new Date(appointmentTimeList[appointmentTimeList.length - 1]).getTime())) {
                const dateList = date.day ? date.day.split('-') : [];
                appointmentTime = (dayText != date.day ? dateList[dateList.length - 1] + '日' : ' ') + time;
              }
              const earliestTimeList = earliestTime && earliestTime.split(' ').length > 0 ? earliestTime.split(' ') : [];
              if (timeItem.isOptional && !timeItem.isDisabled && (!earliestTime || new Date(time).getTime() < new Date(earliestTimeList[earliestTimeList.length - 1]).getTime())) {
                const dateList = date.day ? date.day.split('-') : [];
                earliestTime = (dayText != date.day ? dateList[dateList.length - 1] + '日' : ' ') + time;
                item.earliestTime = earliestTime;
              }
            });
          });
        }
      });
      state.serviceTimeList = list && list.length > 0 ? list : state.serviceTimeList;
      state.appointmentTime = appointmentTime;
      getWeekAndTime();
    }
    state.serviceLoading = false;
  }).catch(() => {
    state.serviceLoading = false;
  });
}
function getServiceDetails(storeId, productId) {
  const self = this;
  getProductDetails(storeId, productId);
  function getProductDetails(storeId, productId) {
    uni.showLoading({
      title: '商品信息加载中，请稍等~'
    });
    const fnName = state.isFlorist ? 'getServiceStaffDetails' : 'getProductDetails';
    const params = {
      storeId
    };
    if (state.isFlorist) {
      params.serviceStaffId = productId;
    } else {
      params.productId = productId;
    }
    floristService[fnName](params).then(res => {
      console.log('获取服务详情：', res);
      if (res) {
        // 获取时间数据
        getServiceTime(storeId, productId, res);
        state.serviceTimeList = res[state.isFlorist ? 'productList' : 'serviceStaffList'];
        if (state.isFlorist) {
          const serviceStaff = {
            ...res
          };
          delete serviceStaff.productList;
          delete serviceStaff.detailImgs;
          state.serviceStaff = serviceStaff;
        }
        // 处理 花艺师详情接口数据
        if (res.detailImgs) {
          res.productDetails = JSON.parse(res.detailImgs);
        }
        const serviceList = res[state.isFlorist ? 'productList' : 'serviceStaffList'];
        if (serviceList && serviceList.length > 0) {
          let minPrice = serviceList[0].activityPrice;
          let maxPrice = serviceList[0].activityPrice;
          let originalSellPrice = serviceList[0].originalSellPrice;
          serviceList.forEach(item => {
            if (item.activityPrice && item.activityPrice < minPrice || !minPrice) {
              minPrice = item.activityPrice;
            }
            if (item.activityPrice && item.activityPrice > maxPrice || !maxPrice) {
              maxPrice = item.activityPrice;
            }
            if (item.originalSellPrice && item.originalSellPrice > originalSellPrice || !originalSellPrice) {
              originalSellPrice = item.originalSellPrice;
            }
          });
          state.serviceMaxPrice = maxPrice;
          state.serviceMinPrice = minPrice;
          state.serviceOriginalSellPrice = originalSellPrice;
        }
        function isJsonString(str) {
          try {
            JSON.parse(str);
          } catch (e) {
            return false;
          }
          return true;
        }
        if (res.imageUrl) {
          if (isJsonString(res.imageUrl)) {
            res.productPictures = JSON.parse(res.imageUrl);
          } else {
            res.productPictures = [{
              fileType: "PICTURE",
              url: res.imageUrl
            }];
          }
        }
        res.name = res.name || res.nickname || res.username;
        res.description = res.description || res.describe;
        if (res.initialPurchaseNumber) {
          state.productNum = res.initialPurchaseNumber;
          state.initialPurchaseNumber = res.initialPurchaseNumber;
          state.minQty = res.initialPurchaseNumber;
          state.personLimitQuantity = res.personLimitQuantity;
        }
        if (res.productNumber) {
          dataReporting(res.productNumber);
        }
        const tempData = [];
        tempData.push(res);
        // 商品自定义栏目res.columnDTOS
        const columnDTOSHeader = [];
        const columnDTOSFooter = [];
        if (res.columnDTOS && res.columnDTOS.length > 0) {
          res.columnDTOS.forEach(item => {
            item.propertyValue = JSON.parse(item.propertyValue);
            if (item.location === 1) {
              columnDTOSHeader.push(item);
            } else {
              columnDTOSFooter.push(item);
            }
          });
        }
        state.goodsList = tempData;
        state.name = res.name;
        state.balance = res.balance;
        state.description = res.description ? res.description : '';
        state.deliveryTimeStatement = res.deliveryTimeStatement ? res.deliveryTimeStatement : '';
        state.soldCount = res.soldCount;
        state.promotionPrice = res.promotionPrice ? res.promotionPrice : null;
        state.sellPrice = res.sellPrice && res.sellPrice !== 0 ? res.sellPrice : '';
        state.costPrice = res.costPrice && res.costPrice !== 0 ? res.costPrice : '';
        state.labels = res.labels;
        state.productProperties = res.productProperties;
        state.productDetails = res.productDetails;
        state.productPictures = res.productPictures;
        state.goodsId = res.id;
        state.business = res.business;
        state.pdtDetail = res;
        state.memberPrice = res.memberPrice ? res.memberPrice : null;
        state.imageUrl = res.imageUrl;
        state.columnDTOSHeader = columnDTOSHeader;
        state.columnDTOSFooter = columnDTOSFooter;
        if (res.productPictures && res.productPictures.length === 0) {
          state.productPictures = [{
            fileType: "PICTURE",
            url: res.imageUrl
          }];
        }
        drawShareImg();
        goodsStyle = "normal";
        // 判断当前用户是否分销员
        if (app.globalData.distributorInfo) {
          // 获取分销提成比率
          state.isDistributor = true;
          getStrategy();
        }
        // 商品规格
        state.sellPrice = res.sellPrice ? res.sellPrice : '';
        state.originalPrice = res.originalPrice ? res.originalPrice : '';
        if (res.productProperties && res.productProperties.length > 0) {
          for (let i = 0; i < res.productProperties.length; i++) {
            const ele = res.productProperties[i];
            if (ele.propertyName === '规格') {
              state.specifications = ele.propertyValue;
              break;
            }
          }
        }
        // 商品标签
        const tempLabels = [];
        if (res.labels && res.labels.length > 0) {
          for (let i = 0; i < res.labels.length; i++) {
            const ele = res.labels[i];
            if (ele.type === 'PROMOTIONLABEL') {
              let isHas = false;
              for (let i = 0; i < tempLabels.length; i++) {
                const it = tempLabels[i];
                if (it.labelName && it.labelName === ele.labelName || it.imageUrl && it.imageUrl === ele.imageUrl) {
                  isHas = true;
                }
              }
              if (!isHas) {
                tempLabels.push(ele);
              }
            }
          }
        }
        state.goodsLabels = res.labels;
        if (res.storeProductState !== "ON") {
          state.soldOut = true;
        }
      }
      // if(self.data.isService || self.data.isFlorist) {
      //   self.getWeekAndTime()
      // }
      uni.hideLoading();
    }).catch(err => {
      uni.hideLoading();
    });
  }
  // 设置分享人信息
  setSharePeopleInfo(productId);
}
function getSecKillGoodsDetails(activityId, productId, storeId) {
  const self = this;
  const storeIdIn = [storeId];
  if (state.distributionStoreId) {
    storeIdIn.push(state.distributionStoreId);
  }
  if (state.nextDayStoreId) {
    storeIdIn.push(state.nextDayStoreId);
  }
  handleGetSecKillGoodsDetails(activityId, productId, storeIdIn);
}
function handleGetSecKillGoodsDetails(activityId, productId, storeIdIn) {
  const that = this;
  const storeId = storeIdIn[0];
  // that.getDetails(storeId, productId)
  const postData = {
    activityIdEquals: activityId,
    productIdEquals: productId
  };
  storeIdIn.forEach((ele, index) => {
    postData[`orgIdIn[${index}]`] = ele;
  });
  goodsDetailsBuryingPoint(productId, storeId);
  let tempSecKillInfo = {};
  secKillService.queryProduct(postData).then(res => {
    if (res && res.length > 0) {
      console.log(res[0], "this.data.secKillInfo");
      tempSecKillInfo = {
        ...res[0],
        originalPrice: res[0].originalPrice ? res[0].originalPrice.toFixed(2) : '',
        price: res[0].price ? res[0].price.toFixed(2) : ''
      };
      const tempData = {
        activityIdEquals: activityId,
        orgIdEquals: storeId
      };
      state.activityId = tempSecKillInfo.activityId;
      parentGrabProductId = res[0].id;
      if (res[0].type === "SPEC") {
        getActivityGoodsSpec(activityId, res[0].productId, storeId, "secondkill");
      }
      return secKillService.query(tempData);
    } else {
      // 报错返回首页
      uni.hideLoading();
      util.setHideLoading(true);
      uni.showToast({
        title: '门店没有该秒杀商品，去看看别的吧~',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        NAVPAGE.toHome();
        util.setHideLoading(false);
        uni.hideLoading();
      }, 2000);
    }
  }).then(res => {
    if (res && res.length > 0) {
      const data = res[0];
      const timeData = {
        startTime: data.startTime,
        endTime: data.endTime
      };
      getSecKillInfo(storeId, productId, tempSecKillInfo, timeData, data);
    } else {
      getDetails(storeId, productId);
    }
  }).catch(err => {
    console.log(err);
  });
}
function getSecKillInfo(storeId, productId, secKillInfo, timeArray, grabActivityData) {
  const self = this;
  console.log(options);
  const loginStatus = checkAuth();
  const timeData = timeArray;
  let availableStockAmount = state.secKillInfo.availableStockAmount || 0;
  let totalStockAmount = state.secKillInfo.totalStockAmount || 0;
  availableStockAmount = secKillInfo.availableStockAmount || availableStockAmount;
  totalStockAmount = secKillInfo.totalStockAmount || totalStockAmount;
  // 查询商品详情
  state.secKillInfo = {
    ...secKillInfo,
    availableStockAmount,
    totalStockAmount,
    status: grabActivityData.status,
    startTime: grabActivityData.startTime,
    endTime: grabActivityData.endTime
  };
  state.isSecKill = true;
  getDetails(storeId, productId);
  // 判断当前用户是否分销员
  if (app.globalData.distributorInfo) {
    // 获取分销提成比率
    state.isDistributor = true;
    getStrategy();
  }
  const date = new util.ResponseDate();
  const tempDate = util.formatTime(date).replace(/\//g, '-');
  const datetTime = tempDate.split(' ');
  const startTimeArr = timeData.startTime.split(' ');
  const endTimeArr = timeData.endTime.split(' ');
  const startTime = datetTime[0] + ' ' + startTimeArr[1];
  const endTime = datetTime[0] + ' ' + endTimeArr[1];
  const starDatetTime = grabActivityData.startDate.substr(0, 10) + ' ' + startTimeArr[1];
  const endDateTime = grabActivityData.endDate.substr(0, 10) + ' ' + endTimeArr[1];
  // 活动开始时间戳
  const newStartTime = new Date(startTime.replace(/-/g, '/')).getTime();
  // 活动结束时间戳
  const newEndTime = new Date(endTime.replace(/-/g, '/')).getTime();
  // 活动持续时间
  let duration = (newEndTime - newStartTime) / 1000;
  let tempDuration = 0;
  // 当前时间戳
  const nowDate = new util.ResponseDate().getTime();
  // 获取当前时间与抢购活动结束时间或秒杀开始时间的时间差
  let countDownTime = 0;
  // 秒杀活动状态CREATED, ABORT, STARTED, FINISHED
  if (grabActivityData.status === "CREATED") {
    // 未开始，显示距开始时间
    countDownTime = (nowDate - newStartTime) / 1000;
    duration = (newStartTime - nowDate) / 1000;
    tempDuration = (newEndTime - newStartTime) / 1000;
  } else if (grabActivityData.status === "STARTED") {
    // 进行中，显示距结束时间
    countDownTime = (nowDate - newEndTime) / 1000;
  } else if (grabActivityData.status === "FINISHED") {
    // 已结束，显示活动已结束
  } else {
    // 秒杀状态不对，报错返回首页
    uni.hideLoading();
    util.setHideLoading(true);
    uni.showToast({
      title: '门店没有该秒杀商品，去看看别的吧~',
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      NAVPAGE.toHome();
      util.setHideLoading(false);
      uni.hideLoading();
    }, 2000);
  }
  console.log('grabActivityData：', grabActivityData);
  console.log('countDownTime：', countDownTime);
  if (grabActivityData.status == 'FINISHED') {
    const tempSecKillInfo = {
      ...state.secKillInfo,
      secKillStatus: 'end'
    };
    state.secKillInfo = tempSecKillInfo;
  } else {
    const tempSecKillInfo = {
      ...state.secKillInfo,
      secKillStatus: grabActivityData.status === "CREATED" ? "created" : 'normal'
    };
    state.secKillInfo = tempSecKillInfo;
  }
  // 获取倒计时
  let timeInfo = [];
  // 将活动的结束时间参数提成一个单独的数组，方便操作
  const tempTime = {
    openTeamTime: starDatetTime,
    endTeamTime: endDateTime,
    duration
  };
  timeInfo.push(tempTime);
  countDown();
  // 执行倒计时函数
  function countDown() {
    clearTimeout(state.secKillTime);
    const countDownArr = util.countDownDetail(timeInfo);
    state.time = {
      hour: countDownArr[0].hou,
      minute: countDownArr[0].min,
      second: countDownArr[0].sec
    };
    state.isSecKill = true;
    if (state.time.hour == '00' && state.time.minute == '00' && state.time.second == '00') {
      const tempSecKillInfo = {
        ...state.secKillInfo,
        secKillStatus: grabActivityData.status === "CREATED" ? 'normal' : 'end'
      };
      state.secKillInfo = tempSecKillInfo;
      if (grabActivityData.status === "CREATED") {
        // 未开始的秒杀活动时间到进入进行中状态
        timeInfo = [];
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        const tempTime = {
          openTeamTime: startTime,
          duration: tempDuration
        };
        timeInfo.push(tempTime);
        countDown();
      }
    }
    const time = setTimeout(function () {
      countDown();
    }, 1000);
    state.secKillTime = time;
  }
  console.log(state.secKillInfo);
}
function getAdvanceSellDetails(advanceId, productId, storeId) {
  const that = this;
  advanceSellService.getByIds(advanceId, productId, storeId).then(res => {
    let tempData = {
      ...res,
      advanceAmount: res.advanceAmount ? res.advanceAmount : 999,
      advanceId
    };
    const newTempData = {};
    let balancePrice = res.balancePrice;
    state.advanceSell = true;
    state.balance = res.advanceAmount ? res.advanceAmount : 999;
    state.sellPrice = res.sellPrice;
    state.frontPrice = res.frontPrice;
    const tempProductData = [];
    tempProductData.push(res.product);
    // res.product.productPictures.forEach(item=>{
    //     selfA.getTemporaryUrl(item.url).then(arr=>{
    //         item.url = arr;
    //         that.setData({
    //               productPictures: res.product.productPictures
    //         })
    //     })
    // })
    // res.product.productDetails.forEach(item=>{
    //     selfA.getTemporaryUrl(item.url).then(arr=>{
    //         item.url = arr;
    //         that.setData({
    //             productDetails:res.product.productDetails
    //         })
    //     })
    // })
    state.goodsList = tempProductData;
    state.name = res.product.name;
    state.description = res.product.description ? res.product.description : '';
    state.deliveryTimeStatement = res.deliveryTimeStatement ? res.deliveryTimeStatement : '';
    state.labels = res.product.labels ? res.product.labels : [];
    state.productProperties = res.product.productProperties;
    state.productDetails = res.product.productDetails;
    state.productPictures = res.product.productPictures;
    state.originalPrice = res.product.originalPrice;
    state.soldCount = res.product.soldCount;
    state.goodsId = res.product.id;
    state.imageUrl = res.product.imageUrl ? res.product.imageUrl : '';
    state.memberLimit = res.memberLimit ? res.memberLimit : 9999;
    state.pdtDetail = res;
    if (res.product.productPictures.length === 0) {
      state.productPictures = [{
        fileType: "PICTURE",
        url: res.product.imageUrl
      }];
    }
    if (res.product && res.product.productNumber) {
      dataReporting(res.product.productNumber);
    }
    function timeToArray(time) {
      const timeArray = time.split(' ');
      const timeList = timeArray[0].split('-');
      const newTime = timeList[1] + '月' + timeList[2] + '日';
      return newTime;
    }
    function timeDivision(time) {
      const timeArray = time.split(' ');
      const timeSlot = timeArray[1].slice(0, 5);
      return timeSlot;
    }
    function addDay(curDate, days) {
      return new Date((curDate / 1000 + 86400 * days) * 1000);
    }
    const frontStartTime = timeToArray(tempData.frontStartTime);
    const frontEndTime = timeToArray(tempData.frontEndTime);
    let balanceStartTime = '';
    let balanceEndTime = '';
    let deliverTime = '';
    let balanceDate = '';
    let isAdvanceSellActiveEnd = false;
    let isAdvanceSellActiveStart = true;
    console.log(tempData.frontEndTime);
    const frontEndTimeStamp = new Date(tempData.frontEndTime.replace(/-/g, '/')).getTime();
    const now = new util.ResponseDate().getTime();
    if (frontEndTimeStamp <= now) {
      isAdvanceSellActiveEnd = true;
      state.isAdvanceSellActiveEnd = isAdvanceSellActiveEnd;
    }
    const frontStartTimeStamp = new Date(tempData.frontStartTime.replace(/-/g, '/')).getTime();
    if (frontStartTimeStamp > now) {
      isAdvanceSellActiveStart = false;
      state.isAdvanceSellActiveStart = isAdvanceSellActiveStart;
    }
    if (tempData.payType === 'PARTIAL') {
      balanceStartTime = timeToArray(tempData.balanceStartTime);
      balanceEndTime = timeToArray(tempData.balanceEndTime);
      balanceDate = balanceStartTime + " " + timeDivision(tempData.balanceStartTime) + '\n' + '~' + balanceEndTime + " " + timeDivision(tempData.balanceEndTime);
      if (balanceStartTime === balanceEndTime) {
        balanceDate = balanceStartTime + " " + timeDivision(tempData.balanceStartTime) + '~' + timeDivision(tempData.balanceEndTime);
      }
      const endTime = new Date(tempData.balanceEndTime.replace(/-/g, '/')).getTime();
      const tempEndTime = util.formatTime(addDay(endTime, tempData.deliveryTime));
      const newEndTime = tempEndTime.replace(/\//g, '-');
      deliverTime = timeToArray(newEndTime);
    } else {
      tempData = {
        ...tempData,
        balancePrice: 0
      };
      balancePrice = 0;
    }
    let orderSelfTime = "";
    // 预售自提固定时间
    if (res.selfTimeScope) {
      const selfStartTime = timeToArray(res.selfTimeScope.split("~")[0]);
      const selfEndTime = timeToArray(res.selfTimeScope.split("~")[1]);
      orderSelfTime = selfStartTime + " " + timeDivision(res.selfTimeScope.split("~")[0]) + '\n' + '~' + selfEndTime + " " + timeDivision(res.selfTimeScope.split("~")[1]);
      if (selfStartTime === selfEndTime) {
        orderSelfTime = selfStartTime + " " + timeDivision(res.selfTimeScope.split("~")[0]) + '~' + timeDivision(res.selfTimeScope.split("~")[1]);
      }
      tempData = {
        ...tempData,
        orderSelfTime
      };
    }
    let advanceSellDate = frontStartTime + " " + timeDivision(tempData.frontStartTime) + '\n' + '~' + frontEndTime + " " + timeDivision(tempData.frontEndTime);
    if (frontStartTime === frontEndTime) {
      advanceSellDate = frontStartTime + " " + timeDivision(tempData.frontStartTime) + '~' + timeDivision(tempData.frontEndTime);
    }
    console.log(frontStartTime, frontEndTime, balanceStartTime, balanceEndTime);
    state.advanceSellInfo = tempData;
    state.advanceSellTime = {
      frontStartTime,
      frontEndTime,
      balanceStartTime,
      balanceEndTime,
      deliverDate: deliverTime,
      deliverTime: tempData.deliveryTime,
      selfTimeScope: res.selfTimeScope,
      orderSelfTime,
      balanceDate,
      advanceSellDate
    };
    state.balancePrice = balancePrice;
    drawShareImg();
  });
}
function toPayAdvanceSell() {
  const that = this;
  if (state.advanceSellInfo.shelvesStatus == 'OFF' || state.advanceSellInfo.shelvesStatus == 'DELETED') {
    uni.showToast({
      title: '商品暂未上架，请到别的门店看看吧！',
      icon: 'none',
      duration: 2000
    });
  } else if (state.advanceSellInfo.advanceAmount !== 0 && state.advanceSellInfo.balance) {
    const loginStatus = checkAuth();
    if (loginStatus && state.productNum != '' && state.productNum != 0) {
      try {
        const goodsPrice = parseFloat(state.advanceSellInfo.frontPrice.toFixed(2)) * state.productNum;
        let storeId = state.storeId;
        if (state.advanceSellInfo && state.advanceSellInfo.product.business) {
          if (state.advanceSellInfo.product.business == 'DISTRIBUTION') {
            storeId = state.distributionStoreId;
          } else if (state.advanceSellInfo.product.business == 'NEXT_DAY') {
            storeId = state.nextDayStoreId;
          }
        }
        let advanceSell = {
          allPrice: parseFloat(goodsPrice).toFixed(2),
          storeId,
          goodsList: [],
          orderType: 'advanceSell',
          balanceEndTime: state.advanceSellInfo.balanceEndTime,
          frontEndTime: state.advanceSellInfo.frontEndTime,
          deliveryTime: state.advanceSellInfo.deliveryTime,
          selfTimeScope: state.advanceSellInfo.selfTimeScope,
          payType: state.advanceSellInfo.payType,
          shipmentType: state.advanceSellInfo.shipmentType,
          scource: 'BUYNOW'
        };
        if (options.room_id) {
          advanceSell = {
            ...advanceSell,
            orderSource: 'WX_MINI_APP-LIVE',
            room_id: options.room_id
          };
        }
        const productsList = state.goodsList;
        console.log(state.goodsList);
        const sellPrice = state.advanceSellInfo.frontPrice;
        // 预售商品总价
        const advanceSellPrice = state.advanceSellInfo.sellPrice;
        productsList.forEach(item => {
          item = {
            ...item,
            productId: item.id,
            productNum: state.productNum,
            initialPurchaseNumber: state.initialPurchaseNumber || 1,
            advanceId: state.advanceSellInfo.advanceId,
            balanceTotal: parseFloat(state.advanceSellInfo.balancePrice).toFixed(2),
            sellPrice: parseFloat(sellPrice).toFixed(2),
            addvanceSellPrice: parseFloat(advanceSellPrice).toFixed(2)
          };
          advanceSell.goodsList.push(item);
        });
        uni.setStorageSync('wj_shopcart', advanceSell);
      } catch (e) {}
      if (app.globalData.userInfo.member) {
        let easyScene = "none";
        if (options.easyScene != null) {
          easyScene = options.easyScene;
        }
        let opts = "?easyScene=" + easyScene;
        if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
          opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
        }
        NAVPAGE.toPerfectOrder(opts);
      } else {
        NAVPAGE.toAuthorize();
      }
    } else {}
  } else {
    uni.showToast({
      title: '您来晚了，已经卖完了~',
      icon: 'none',
      duration: 2000
    });
  }
}
function queryMemberShip() {
  const self = this;
  return new Promise(function (resolve, reject) {
    memberService.queryGrade().then(res => {
      if (res) {
        res = util.compareMemberGrade(res);
        const memberShip = [{
          id: 'ALL'
        }];
        res.forEach(el => {
          const grade = {
            id: ''
          };
          grade.id = el.id;
          memberShip.push(grade);
          state.memberShip = memberShip;
          resolve(state.memberShip);
        });
      } else {
        reject();
      }
    });
  });
}
function handleUserLogin() {
  const that = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
      state.isMember = false;
      NAVPAGE.toAuthorize();
    }
  }
}
function handleTabbar(e) {
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar;
  } else {
    state.showTabbar = e.detail.showTabbar;
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true;
  } else {
    state.phone = false;
  }
}
function handleBindPhone(e) {
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
function sendSpecShareImg(shareImg) {
  // console.log(shareImg.detail,this.goodsStyle,'shareImg')
  if (shareImg.detail) {
    state.specShare = shareImg.detail.imageUrl;
    state.specPrice = shareImg.detail.sellPrice > 0 ? shareImg.detail.sellPrice : null;
    state.specOriginalPrice = shareImg.detail.originalPrice > 0 ? shareImg.detail.originalPrice : null;
  }
}
function handleClickShare(e) {
  handleShareImageData();
  state.showSharePop = true;
}
async function handleShareImageData() {
  const self = this;
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
    sharePicture: "",
    advanceSellInfo: state.advanceSellInfo,
    groupNumber: state.groupNumber,
    name: state.name,
    description: state.description,
    sellPrice: state.promotionPrice && state.promotionPrice < state.sellPrice ? state.promotionPrice : state.sellPrice || 0,
    teamAllPrice: state.teamAllPrice,
    secKillInfo: state.secKillInfo,
    scoreInfo: state.scoreInfo,
    options,
    isTeam: state.isTeam,
    isSecKill: state.isSecKill,
    isService: state.isService,
    isFlorist: state.isFlorist,
    pdtDetail: state.pdtDetail,
    sharePic: state.sharePic,
    goodType: state.goodType
  };
  if (state.producrisStoreCode && state.producrisStoreCode === 'TRUE') {
    shareData.storeId = state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.virtualStoreId || state.storeInfo.id : state.storeId;
    shareData.storeName = state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.name || state.storeInfo.name : app.globalData.storeInfo && app.globalData.storeInfo.name;
  } else if (!state.producrisStoreCode) {
    await getShareStoreIdConfig();
    if (state.producrisStoreCode === 'TRUE') {
      shareData.storeId = state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.virtualStoreId || state.storeInfo.id : state.storeId;
      shareData.storeName = state.storeInfo && state.business != 'DISTRIBUTION' && state.business != 'NEXT_DAY' ? state.storeInfo.name || state.storeInfo.name : app.globalData.storeInfo && app.globalData.storeInfo.name;
    }
  }
  console.log('shareData.storeId', shareData.storeId);
  // 处理商品图片
  let imageUrl = "";
  let firstPic = '';
  if (state.productPictures[0].fileType !== 'VIDEO') {
    firstPic = state.productPictures[0].url.replace("http://", "https://");
  } else {
    for (let i = 0; i < state.productPictures.length; i++) {
      if (state.productPictures[i].fileType === "PICTURE") {
        firstPic = state.productPictures[i].url.replace("http://", "https://");
        break;
      } else {
        firstPic = state.imageUrl.replace("http://", "https://");
      }
    }
  }
  if (state.secKillInfo.sharePicture) {
    imageUrl = state.secKillInfo.sharePicture.replace("http://", "https://");
  } else if (state.groupSharePicture !== '') {
    imageUrl = state.groupSharePicture.replace("http://", "https://");
  } else {
    imageUrl = firstPic;
  }
  shareData.sharePicture = imageUrl;

  // console.log(shareData, 'shareDatashareDatashareData')
  if (goodsStyle === 'SPEC_PARENT') {
    if (state.specShare) {
      shareData.sharePicture = state.specShare;
    }
    if (state.specPrice) {
      shareData.sellPrice = state.specPrice;
      shareData.notShowPriceRise = true;
    } else {
      shareData.sellPrice = state.promotionMinSellPrice;
    }
    if (state.specOriginalPrice) {
      shareData.pdtDetail = shareData.pdtDetail ? {
        ...shareData.pdtDetail,
        originalPrice: state.specOriginalPrice
      } : {
        originalPrice: state.specOriginalPrice
      };
    }
  }
  if (state.isService || state.isFlorist) {
    shareData.sellPrice = state.activeService ? state.activeService.activityPrice : state.serviceMinPrice;
    if (!state.activeService) {
      state.setData({
        specificationsFlag: true
      });
    }
  }
  state.shareData = shareData;
}
function closeSharePop() {
  state.showSharePop = false;
}
function chooseOutcome(e) {
  console.log('进来购物车时间------------------------------', e);
  if (e.detail.outcome === true) {
    state.scource = "SHOPPINGCART";
    console.log(e.detail.product);
    if (e.detail.product != null) {
      hasChooseOutcome = true;
      buyNow(e.detail.product);
    } else {
      handleTouchOnGoods(addShopCartData);
    }
  }
}
function getShopCart(storeId) {
  const self = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // shopcartService.getCatering(storeId).then(res => {
    //   let tempShopCart = {}
    //   let tempShopCartGoodsId = []
    //   if (res.items && res.items.length > 0) {
    //     // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
    //     res.items.forEach(item => {
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
    //       }
    //     })
    //   }
    //   self.setData({
    //     shopCart: tempShopCart,
    //     shopCartGoodsId: tempShopCartGoodsId
    //   })
    //   let localData = {
    //     goodsId: tempShopCartGoodsId,
    //     items: tempShopCart
    //   }
    //   try {
    //     wx.setStorageSync('wj_shopCartStorage', localData)
    //   } catch (e) { }
    // }).catch(err => {
    //   wx.showToast({
    //     title: err.message,
    //     icon: 'none',
    //     duration: 2000
    //   })
    // })
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    state.shopCart = localShopingCart.items;
    state.shopCartGoodsId = localShopingCart.goodsId;
    const localProductCount = uni.getStorageSync('wj_userProductsCount');
    const counts = String(localProductCount);
    if (counts) {
      app.setTabBarBadge('shopping_cart', counts);
    }
    shopcartService.getProductsCount().then(res => {
      app.setTabBarBadge('shopping_cart', String(res));
      try {
        uni.setStorageSync('wj_userProductsCount', res);
      } catch (e) {}
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function addLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount++;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId;
      const tempShopCart = localShopingCart.items;
      const tempShopCartGoodsId = [];
      const _id = id;
      let index = -1;
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i]);
          if (_id == shopCartGoodsId[i]) {
            index = i;
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) + 1;
      } else {
        // 新增  
        tempShopCartGoodsId.push(_id);
        tempShopCart[_id] = 1;
      }
      state.shopCart = tempShopCart;
      state.shopCartGoodsId = tempShopCartGoodsId;
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart
      };
      uni.setStorageSync('wj_shopCartStorage', localData);
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', "update");
}
function reduceLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount--;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    if (localShopingCart) {
      // 如果存在本地购物车数据
      const shopCartGoodsId = localShopingCart.goodsId;
      const tempShopCart = localShopingCart.items;
      const tempShopCartGoodsId = [];
      const _id = id;
      let index = -1;
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i]);
          if (_id == shopCartGoodsId[i]) {
            index = i;
          }
        }
      }
      if (index > -1) {
        // 已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) - 1;
        if (tempShopCart[_id] <= 0) {
          tempShopCartGoodsId.splice(index, 1);
        }
      }
      state.shopCart = tempShopCart;
      state.shopCartGoodsId = tempShopCartGoodsId;
      const localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart
      };
      uni.setStorageSync('wj_shopCartStorage', localData);
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', "update");
}
function handleTouchOnGoods(e) {
  const self = this;
  let goodsBoxImage = '';
  state.goodsBoxImage = '';
  const addtype = e.detail.target.dataset.addtype;
  const touches = {
    clientX: 0,
    clientY: 0,
    force: 1,
    identifier: 0,
    pageX: 0,
    pageY: 0
  };
  const goodsType = state.goodType;
  FLY.touchOnGoods(addtype, touches, e.detail.target.dataset.id, goodsType).then(res => {
    goodsBoxImage = state.productPictures[state.current - 1].url;
    state.goodsBoxImage = goodsBoxImage;
    const animation = res;
    state.hide_good_box = false;
    state.bus_x = animation.finger.x;
    state.bus_y = animation.finger.y;
    state.animation = animation.animation;
    setTimeout(() => {
      state.hide_good_box = true;
      addLocalGoods(e.detail.target.dataset.id);
    }, animation.duration);
  });
}
function getProductsComment(productId) {
  const self = this;
  const postData = {
    page: 1,
    pageSize: 1,
    productId,
    status: 'NORMAL',
    searchCount: true,
    includeSiblings: true
  };
  commentService.query(postData).then(res => {
    const tempList = [];
    if (res.records && res.records.length > 0) {
      res.records.forEach(item => {
        let tempItem = {
          ...item,
          mobile: hideTel(item.mobile),
          avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait
        };
        if (item.createTime) {
          // let timeArr = item.createTime.split(' ')
          // let dayArr = timeArr['0'].split('-')
          // let time = dayArr[0] + '年' + dayArr[1] + '月'
          tempItem = {
            ...tempItem,
            time: item.createTime
          };
        }
        tempList.push(tempItem);
      });
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
      state.commentList = tempList;
    }
    state.commentNum = res.recordCount;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toGoodsComment() {
  const opts = '?productId=' + state.goodsId;
  NAVPAGE.toGoodsComment(opts);
}
function previewImage(val) {
  const commentId = val.currentTarget.dataset.commentid;
  const urlIndex = val.currentTarget.dataset.urlid;
  const commentList = state.commentList;
  const urlList = [];
  commentList.forEach(item => {
    if (item.id === commentId) {
      item.pictures.forEach(ele => {
        urlList.push(ele.url);
      });
    }
  });
  uni.previewImage({
    current: urlList[urlIndex],
    // 当前显示图片的http链接
    urls: urlList // 需要预览的图片http链接列表
  });
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new util.ResponseDate().getTime();
      let vipEndTimeStamp = now + 1000;
      let vipEndTime = "";
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime();
        vipEndTime = res.member.vipEndTime.split(" ")[0].replace(/-/g, '.');
      }
      if (now > vipEndTimeStamp) {
        isExpired = true;
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true;
        app.globalData.userInfo.member.vip = true;
      }
      state.isMember = true;
      state.member = res.member;
      state.isVIP = isVIP;
      state.isExpired = isExpired;
      state.vipEndTime = vipEndTime;
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getUserInfo(e) {
  console.log(e, "eeee");
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    if (res.member) {
      state.isMember = true;
      bus.emit('getRelatedCoupon', true);
      onLoad(state.options);
    } else {
      NAVPAGE.toAuthorize();
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toAuthorize(e) {
  NAVPAGE.toAuthorize();
}
function getStrategy() {
  console.log('查询分销员提现比例');
  const that = this;
  distributionService.getStrategy().then(res => {
    if (res && res.stratumRate) {
      const arr = [];
      for (const i in res.stratumRate) {
        arr.push(res.stratumRate[i]);
      }
      let rate = Number.NEGATIVE_INFINITY;
      console.log(rate);
      arr.forEach(item => {
        if (item > rate) {
          rate = item;
        }
      });
      if (rate < 0) {
        rate = 0;
      }
      let sellPrice = state.sellPrice ? state.sellPrice : 0;
      const costPrice = state.costPrice ? state.costPrice : 0;
      if (state.isSecKill) {
        sellPrice = state.secKillInfo.price;
      } else if (state.isTeam) {
        sellPrice = state.teamAllPrice;
      }
      let price = sellPrice;
      const userCostPrice = app.globalData.systemConfigure.userCostPrice;
      if (state.promotionPrice) {
        if (state.promotionPrice < sellPrice) {
          price = state.promotionPrice;
        }
        if (state.memberPrice && state.memberPrice < state.promotionPrice && state.vipGradeConfig.openMemberPrice) {
          price = state.memberPrice;
        }
      } else {
        if (state.memberPrice && state.memberPrice < state.sellPrice && state.vipGradeConfig.openMemberPrice) {
          price = state.memberPrice;
        }
      }
      console.log('售价', price);
      console.log('成本价', costPrice);
      if (userCostPrice) {
        price = parseFloat(price - costPrice).toFixed(2);
      }
      console.log(state.isSecKill, state.secKillInfo.price);
      console.log("是否开启分销减去成本：", userCostPrice);
      console.log("价格：              ", price);
      console.log("提成比率：           ", rate);
      state.commissionTotal = parseFloat(price * rate).toFixed(2);
      console.log('可得佣金：           ', parseFloat(price * rate).toFixed(2));
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function toggleGoodsSpecPopup() {
  toggle('goodsSpec');
  state.activityType = "normal";
  setTimeout(() => {
    state.shopCarSpecId = null;
  }, 1000);
}
function toggleGoodsNormalPopup() {
  toggle('goodsNormal');
}
function toggleTeamGoodsSpecPopup() {
  state.activityType = "group";
  toggle('goodsSpec');
}
function toggleGrabGoodsSpecPopup() {
  state.activityType = "secondkill";
  toggle('goodsSpec');
}
function toggleRelateCouponPopup() {
  toggle('relateCoupon');
}
function toggleRulesDetailPopup() {
  toggle('rulesDetail');
}
function getGoodsSpec(productId, storeId) {
  const self = this;
  console.log('goodType: ', state.goodType);
  if (state.goodType === "group" || state.goodType === "secondkill") {
    // return
  }
  console.log('查询多规格详情');
  productService.getSpecDetails(productId, storeId).then(res => {
    if (res) {
      // 判断当前用户是否分销员
      if (app.globalData.distributorInfo) {
        // 获取分销提成比率
        state.isDistributor = true;
        getStrategy();
      }
      console.log('多规格商品子商品详情===========');
      const specDetails = JSON.parse(res.specDetailsJson);
      let specDetails1 = specDetails;
      console.log(res);
      if (specDetails) {
        specDetails.some(spec => {
          if (Array.isArray(spec)) {
            const flag2 = spec.some(spec1 => {
              if (Array.isArray(spec1)) {
                specDetails1 = spec1;
              }
              return Array.isArray(spec1);
            });
            if (!flag2) {
              specDetails1 = spec;
            }
          }
          return Array.isArray(spec);
        });
      }
      if (specDetails1 && specDetails1[0]) {
        let minSellPrice = null;
        let maxSellPrice = null;
        let promotionPrice = null;
        function getPrice(priceItem) {
          if (Array.isArray(priceItem)) {
            priceItem.forEach(priceItem1 => {
              getPrice(priceItem1);
            });
          } else if (priceItem.status == 'ON') {
            if (priceItem.sellPrice < minSellPrice) {
              minSellPrice = priceItem.sellPrice;
            } else {
              if (priceItem.memberPrice && (!priceItem.promotionPrice || priceItem.promotionPrice >= priceItem.memberPrice) && priceItem.memberPrice >= maxSellPrice && priceItem.memberPrice <= priceItem.sellPrice) {
                maxSellPrice = priceItem.memberPrice;
              } else if (priceItem.promotionPrice && (!priceItem.memberPrice || priceItem.memberPrice >= priceItem.promotionPrice) && priceItem.promotionPrice >= maxSellPrice && priceItem.promotionPrice <= priceItem.sellPrice) {
                maxSellPrice = priceItem.promotionPrice;
              } else if (maxSellPrice < priceItem.sellPrice) {
                maxSellPrice = priceItem.sellPrice;
              }
            }
            if (priceItem.memberPrice && ((!priceItem.promotionPrice || priceItem.promotionPrice >= priceItem.memberPrice) && priceItem.memberPrice < minSellPrice && priceItem.memberPrice <= priceItem.sellPrice || minSellPrice === null)) {
              minSellPrice = priceItem.memberPrice;
            } else if (priceItem.promotionPrice && ((!priceItem.memberPrice || priceItem.memberPrice >= priceItem.promotionPrice) && priceItem.promotionPrice < minSellPrice && priceItem.promotionPrice <= priceItem.sellPrice || minSellPrice === null)) {
              minSellPrice = priceItem.promotionPrice;
            } else if (minSellPrice > priceItem.sellPrice || minSellPrice === null) {
              minSellPrice = priceItem.sellPrice;
            }
            if (maxSellPrice === null) {
              if (priceItem.memberPrice && (!priceItem.promotionPrice || priceItem.promotionPrice < priceItem.memberPrice) && priceItem.memberPrice >= maxSellPrice && priceItem.memberPrice <= priceItem.sellPrice) {
                maxSellPrice = priceItem.memberPrice;
              } else if (priceItem.promotionPrice && (!priceItem.memberPrice || priceItem.memberPrice < priceItem.promotionPrice) && priceItem.promotionPrice >= maxSellPrice && priceItem.promotionPrice <= priceItem.sellPrice) {
                maxSellPrice = priceItem.promotionPrice;
              } else if (maxSellPrice < priceItem.sellPrice) {
                maxSellPrice = priceItem.sellPrice;
              }
            }
            if (priceItem.promotionPrice && priceItem.promotionPrice < promotionPrice || promotionPrice === null) {
              promotionPrice = priceItem.promotionPrice;
            }
          }
        }
        getPrice(specDetails);
        // specDetails.map((items)=>{
        //   if(items.sellPrice < minSellPrice){
        //     minSellPrice = items.sellPrice
        //   } else {
        //     if(items.memberPrice && (!items.promotionPrice || items.promotionPrice >= items.memberPrice) && items.memberPrice >= maxSellPrice && items.memberPrice <= items.sellPrice) {
        //         maxSellPrice = items.memberPrice
        //     } else if(items.promotionPrice && (!items.memberPrice || items.memberPrice >= items.promotionPrice) && items.promotionPrice >= maxSellPrice && items.promotionPrice <= items.sellPrice) {
        //         maxSellPrice = items.promotionPrice
        //     } else if(maxSellPrice < items.sellPrice){
        //         maxSellPrice = items.sellPrice
        //     }
        //   }
        //   if(items.promotionPrice && items.promotionPrice < promotionPrice) {
        //     promotionPrice = items.promotionPrice
        //   }
        // })
        // if(self.data.memberPrice && minSellPrice > self.data.memberPrice){
        //   minSellPrice = self.data.memberPrice
        // }
        // if(self.data.memberPrice && maxSellPrice < self.data.memberPrice && (!self.data.promotionPrice || self.data.promotionPrice >= self.data.memberPrice)){
        //   maxSellPrice = self.data.memberPrice
        // }
        // if(self.data.promotionPrice){
        //   // if(minSellPrice > self.data.promotionPrice){
        //   //   minSellPrice = self.data.promotionPrice
        //   // }
        //   // if((!self.data.memberPrice || self.data.memberPrice > self.data.promotionPrice) && maxSellPrice < self.data.promotionPrice){
        //   //   maxSellPrice = self.data.promotionPrice
        //   // }
        // //   if(!self.data.memberPrice || self.data.memberPrice > self.data.promotionPrice){
        // //     maxSellPrice = self.data.promotionPrice;
        // //   }
        // }
        const sellPrice = state.pdtDetail.sellPrice || 0;
        state.sellPrice = sellPrice || state.pdtDetail.sellPrice;
        state.costPrice = specDetails1[0].costPrice || state.pdtDetail.costPrice;
        state.promotionPrice = promotionPrice;
        state.promotionMinSellPrice = minSellPrice;
        state.promotionMaxSellPrice = maxSellPrice;
        state.minSellPrice = minSellPrice;
        state.maxSellPrice = maxSellPrice;
        state.specificationsFlag = specDetails1.length > 1;
        setTimeout(() => {
          console.log('计算多规格商品佣金');
          console.log(state.sellPrice);
          console.log(state.costPrice);
          getStrategy();
        }, 200);
      }
      // 对规格值按orderNumber排序
      if (res.specs && res.specs.length > 0) {
        res.specs.forEach(spec => {
          if (spec.specParams && spec.specParams.length > 0) {
            spec.specParams.sort((a, b) => a.orderNumber - b.orderNumber);
          }
        });
      }
      state.specs = res.specs;
      state.specDetails = specDetails;
    }
    if (options.source === 'addshopcart') {
      openGoodsSpecs();
      state.hasSelected = true;
    }
  }).catch(err => {
    console.log("查询商品规格：" + err.message);
  });
}
function getActivityGoodsSpec(activityId, productId, storeId, type) {
  const self = this;
  if (type === "group") {
    teamChildrenProduct = [];
    teamBuyService.getChildrenProduct(activityId).then(res => {
      teamChildrenProduct = res;
      return teamBuyService.getSpecDetails(activityId, productId, storeId);
    }).then(res => {
      handleSpecData(res);
    }).catch(err => {
      console.log("查询商品规格：" + err.message);
    });
  } else if (type === "secondkill") {
    grabChildrenProduct = [];
    secKillService.getChildrenProduct(parentGrabProductId).then(res => {
      grabChildrenProduct = res;
      return secKillService.getSpecDetails(activityId, productId, storeId);
    }).then(res => {
      handleSpecData(res);
    }).catch(err => {
      console.log("查询商品规格：" + err.message);
    });
  }
}
function handleSpecData(res) {
  const self = this;
  if (res) {
    const specDetails = JSON.parse(res.specDetailsJson);
    console.log(specDetails);
    // 对规格值按orderNumber排序
    if (res.specs && res.specs.length > 0) {
      res.specs.forEach(spec => {
        if (spec.specParams && spec.specParams.length > 0) {
          spec.specParams.sort((a, b) => a.orderNumber - b.orderNumber);
        }
      });
    }
    state.specs = res.specs;
    state.specDetails = specDetails;
  }
}
function openGoodsSpecs(e) {
  console.log('打开商品规格选择111');
  const _addType = e.detail.target.dataset.addtype;
  const goodtype = e.detail.target.dataset.goodtype;
  addType = _addType;
  state.goodtype = goodtype;
  state.scource = _addType;
  console.log(_addType, goodsStyle);
  if (state.specs.length > 0) {
    if (state.balance > 0) {
      state.goodsImg = state.imageUrl;
      toggleGoodsSpecPopup();
    } else {
      uni.showToast({
        title: '门店正在补货中，看看其他商品吧~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    if (goodsStyle === "normal") {
      state.goodsImg = state.imageUrl;
      state.good1 = e;
      toggleGoodsNormalPopup();
      // if (addType === "buyNow") {
      //     this.buyNow(e)
      // } else {
      //     this.addShopCart(e)
      // }
    } else if (goodsStyle === "MEALS2") {
      state.meals.show = true;
      state.meals.productId = state.goodsList[0].id;
      state.meals.storeId = state.business == 'DISTRIBUTION' ? state.distributionStoreId : state.business == 'NEXT_DAY' ? state.nextDayStoreId : app.globalData.storeInfo.id;
      // if(addType == 'detail') {
      //     this.data.operateFun = '加入购物车'
      // } else {
      // 组合商品只能立即购买
      state.scource = 'buyNow';
      state.operateFun = '立即购买';
      // }
      state.meals = state.meals;
      state.operateFun = state.operateFun;
    }
  }
}
function buyNow(e) {
  console.log("buyNow", e);
  const that = this;
  const loginStatus = checkAuth();
  if (loginStatus && state.isMember) {
    if (state.goodType === 'newmbr' && app.globalData.userInfo.member.newMember === false) {
      util.showToast('该活动仅限新会员专享哦~', 2000);
    } else {
      if (state.balance > 0) {
        if (state.isCateringMeals && hasChooseOutcome !== true) {
          // 餐饮套餐商品
          state.scource = "BUYNOW";
          _addShopcart(state.goodsList[0].id);
          return;
        }
        try {
          const allPrice = state.goodsList[0].sellPrice || state.goodsList[0].originalPrice;
          let shopcart = {
            allPrice: util.filtToFix(parseFloat(allPrice.toFixed(2)) * state.productNum),
            storeId: state.storeId,
            goodsList: [],
            orderType: state.goodsList[0].business === "DISTRIBUTION" && !state.zhiti ? "distribution" : state.goodsList[0].business === "NEXT_DAY" ? "nextDay" : "normal",
            scource: 'BUYNOW'
          };
          // 组合商品得重新计算价格
          console.log(state.goodsList[0].style, 'MEALS2');
          if (state.goodsList[0].style === 'MEALS2') {
            const productNew = e.lists;
            let mealsAllPrice = 0;
            productNew.forEach(item => {
              item.mealDetails.forEach(ele => {
                mealsAllPrice += ele.groupProductCount * ele.productPrice;
              });
            });
            shopcart.allPrice = mealsAllPrice;
          }
          console.log(shopcart.allPrice, '4599');
          if (options.room_id) {
            shopcart = {
              ...shopcart,
              orderSource: 'WX_MINI_APP-LIVE',
              room_id: options.room_id
            };
          }
          console.log(shopcart, '4607');
          const productsList = state.goodsList;
          productsList.forEach(item => {
            item = {
              ...item,
              productId: item.id,
              initialPurchaseNumber: state.initialPurchaseNumber || 1,
              productNum: Number(state.productNum)
            };
            shopcart.goodsList.push(item);
          });
          // 组合商品数据不同计算
          if (state.goodsList[0].style === 'MEALS2') {
            shopcart.goodsList[0].sellPrice = shopcart.allPrice;
            shopcart.goodsList[0].productNum = e.lists[0].count;
            shopcart.goodsList[0].groupProducts = e.lists[0].mealDetails;
          }
          console.log(shopcart, '4618');
          if (state.goodType === "newmbr") {
            shopcart.allPrice = state.goodsDetail.price || state.goodsDetail.originalPrice;
            shopcart.goodsList[0].newmbrActivityId = state.goodsDetail.activityId;
            shopcart.goodsList[0].sellPrice = state.goodsDetail.price;
            if (state.goodsDetail.originalPrice) {
              shopcart.goodsList[0].originalPrice = state.goodsDetail.originalPrice;
            }
          }
          console.log(shopcart.allPrice, '4624');
          console.log(e);
          if (state.isCateringMeals && hasChooseOutcome === true && e != null) {
            shopcart.goodsList[0] = {
              ...shopcart.goodsList[0],
              groupProducts: e.lists[0].lists,
              mealDetails: e.mealDetails
            };
            hasChooseOutcome = false;
          }
          console.log(shopcart, '4637');
          if (state.goodType !== "newmbr") {
            let sellPrice = state.goodsList[0].sellPrice;
            // that.data.member.gradeId =='1088' && 
            if (state.goodsList[0].memberPrice && Number(state.goodsList[0].memberPrice) < Number(sellPrice)) {
              shopcart.allPrice = util.filtToFix(parseFloat(state.goodsList[0].memberPrice.toFixed(2)) * state.productNum);
              //  shopcart.allPrice = parseFloat(Number(that.data.goodsList[0].memberPrice * that.data.productNum).toFixed(2))
              shopcart.goodsList[0].sellPrice = state.goodsList[0].memberPrice;
              sellPrice = state.goodsList[0].memberPrice;
              shopcart.goodsList[0].useMemberPrice = true;
            }
            shopcart.goodsList[0].usePromotionPrice = state.goodsList[0].usePromotionPrice;
            console.log(e, state.goodsList[0], "that.data.goodsList[0].promotionPrice", shopcart.goodsList[0], '4648');
            console.log(shopcart, '4649');
            if (!state.isTeam && state.goodsList[0].promotionPrice && Number(state.goodsList[0].promotionPrice) < Number(sellPrice)) {
              shopcart.allPrice = util.filtToFix(Number(parseFloat(state.goodsList[0].promotionPrice).toFixed(2) * state.productNum));
              shopcart.goodsList[0].sellPrice = state.goodsList[0].promotionPrice;
              shopcart.goodsList[0].usePromotionPrice = true;
              shopcart.goodsList[0].useMemberPrice = false;
            }
            console.log(shopcart, '4655');
          }
          console.log(shopcart, '4652');
          uni.setStorageSync('wj_shopcart', shopcart);
        } catch (e) {
          console.log(e);
        }
        let easyScene = "none";
        if (options.easyScene != null) {
          easyScene = options.easyScene;
        }
        let opts = "?easyScene=" + easyScene + "&externalInfo=" + state.options;
        if (state.options.sourceOrderNo && state.options.storeCode && state.options.posNo) {
          opts += `&sourceOrderNo=${state.options.sourceOrderNo}&storeCode=${state.options.storeCode}&posNo=${state.options.posNo}`;
        }
        NAVPAGE.toPerfectOrder(opts);
        // 跳转到完善订单
      } else {
        uni.showToast({
          title: '门店正在努力补货中~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    NAVPAGE.toAuthorize();
  }
}
function confirm(e) {
  console.log(state.grabType, "this.data.good1");
  if (state.personLimitQuantity && state.personLimitQuantity < state.productNum) {
    uni.showToast({
      title: '最多购买' + state.personLimitQuantity + '件',
      icon: 'none',
      duration: 2000
    });
    state.productNum = state.personLimitQuantity;
    return false;
  }
  if (state.minQty && state.minQty > state.productNum) {
    uni.showToast({
      title: '最少购买' + state.minQty + '件',
      icon: 'none',
      duration: 2000
    });
    state.productNum = state.minQty;
    return false;
  }
  if (state.grabType == 'grab') {
    toPaySecKill(state.good1);
  } else if (addType === "buyNow") {
    buyNow(state.good1);
  } else {
    addShopCart(state.good1);
  }
  toggleGoodsNormalPopup();
}
function confirmSpecs(e) {
  const self = this;
  specs = e.detail;
  state.productNum = e.detail.productNum;
  state.initialPurchaseNumber = e.detail.initialPurchaseNumber ? parseInt(e.detail.initialPurchaseNumber) : 1;
  console.log(state.activityType, e.detail.selectText, 'e.detail.selectText');
  if (e.detail.selectText) {
    let specs = '';
    e.detail.selectText = e.detail.selectText.replace('已选：', '').replace(/\"/g, '');
    const nameArr = e.detail.selectText.replace('已选：', '').split(" ");
    if (nameArr.length > 0) {
      nameArr.forEach((item, i) => {
        specs = specs + item + ';';
      });
    }
    state.goodsList[0].specs = specs;
    state.goodsList[0].imageUrl = e.detail.imageUrl || state.goodsList[0].imageUrl;
  }
  if (state.activityType === "group") {
    // 关闭弹窗
    toggleGoodsSpecPopup();
    let name = state.goodsList[0].name;
    if (teamChildrenProduct.length > 0) {
      teamChildrenProduct.forEach(it => {
        if (it.productId === e.detail.productId) {
          name = it.name;
        }
      });
    }
    // 根据参团或者开团调用不同接口
    teamBuyings.teamMemberJoinCount = e.detail.teamMemberJoinCount;
    teamBuyings.teamLeaderPrice = e.detail.teamLeaderPrice ? e.detail.teamLeaderPrice : e.detail.teamMemberPrice;
    teamBuyings.teamMemberPrice = e.detail.teamMemberPrice;
    // 子商品的库存
    let balance = e.detail.balance;
    if ((e.detail.productBalance || e.detail.productBalance === 0) && e.detail.productBalance != null) {
      balance = balance > e.detail.productBalance ? e.detail.productBalance : balance;
    }
    let teamLeaderPrice = e.detail.teamLeaderPrice ? e.detail.teamLeaderPrice : e.detail.teamMemberPrice;
    let teamMemberPrice = e.detail.teamMemberPrice;
    teamLeaderPrice = parseFloat((teamLeaderPrice * e.detail.teamMemberJoinCount).toFixed(2));
    teamMemberPrice = parseFloat((teamMemberPrice * e.detail.teamMemberJoinCount).toFixed(2));
    state.goodsList[0].name = name;
    state.goodsList[0].id = e.detail.productId;
    state.productNum = e.detail.teamMemberJoinCount;
    state.groupBalance = balance;
    state.teamAllPrice = teamLeaderPrice;
    state.teamLeaderPrice = teamLeaderPrice;
    state.teamMemberPrice = teamMemberPrice;
    if (state.hasTeamLeader) {
      // 开团
      toPayTeamBuying(e);
    } else {
      // 参团
      joinGroup(e);
    }
  } else if (state.activityType === "secondkill") {
    // 关闭弹窗
    toggleGoodsSpecPopup();
    options.productId = e.detail.productId;
    state.balance = e.detail.balance;
    let name = state.goodsList[0].name;
    let totalStockAmount = e.detail.totalStockAmount;
    let limitCount = state.secKillInfo.limitCount;
    let minQty = state.secKillInfo.minQty;
    if (grabChildrenProduct.length > 0) {
      grabChildrenProduct.forEach(it => {
        if (it.productId === e.detail.productId) {
          name = it.productName;
          totalStockAmount = it.totalStockAmount;
          limitCount = it.limitCount;
          minQty = it.minQty;
        }
      });
    }
    if (customData.grabSpecPopupType === "grab") {
      state.goodsList[0].name = name;
      state.goodsList[0].id = e.detail.productId;
      state.secKillInfo.price = e.detail.grabPrice;
      state.secKillInfo.availableStockAmount = e.detail.availableStockAmount;
      state.secKillInfo.totalStockAmount = totalStockAmount;
      state.secKillInfo.limitCount = limitCount;
      state.secKillInfo.minQty = minQty;
      toPaySecKill();
    } else {
      customData.hasGrabPrice = !!e.detail.grabPrice;
      if (customData.hasGrabPrice) {
        state.secKillInfo.availableStockAmount = e.detail.availableStockAmount;
        state.secKillInfo.totalStockAmount = totalStockAmount;
        state.secKillInfo.limitCount = limitCount;
        state.secKillInfo.minQty = minQty;
        state.goodsList[0].name = name;
        state.goodsList[0].id = e.detail.productId;
      }
      addShopCart();
    }
  } else {
    // 关闭弹窗
    toggleGoodsSpecPopup();
    // 调用添加购物车接口
    options.productId = e.detail.productId;
    state.balance = e.detail.balance;
    console.log(e, 'eeeeeeeee');
    if (addType && addType === "buyNow") {
      console.log(e);
      let sellPrice = e.detail.sellPrice;
      if (!state.isTeam && e.detail.promotionPrice && e.detail.promotionPrice != '0') {
        sellPrice = e.detail.promotionPrice;
      }
      if (e.detail.memberPrice && e.detail.memberPrice != '0' && e.detail.memberPrice < sellPrice) {
        sellPrice = e.detail.memberPrice;
        state.goodsList[0].useMemberPrice = true;
        state.goodsList[0].memberPrice = e.detail.memberPrice;
      }
      state.goodsList[0].id = e.detail.productId;
      state.goodsList[0].sellPrice = sellPrice;
      state.goodsList[0].usePromotionPrice = !!(e.detail.promotionPrice && e.detail.promotionPrice != '0' && e.detail.promotionPrice < e.detail.sellPrice);
      state.goodsList[0].promotionPrice = e.detail.promotionPrice;
      state.goodsList[0].memberPrice = e.detail.memberPrice;
      buyNow();
    } else {
      addShopCart();
    }
  }
}
function toHomePage() {
  NAVPAGE.toHome();
}
function callPhone() {
  // let tel = ''
  // if (tel === '' && app.globalData.storeInfo != null && app.globalData.storeInfo.tel != null && app.globalData.storeInfo.tel !== '') {
  //   tel = app.globalData.storeInfo.tel
  // } else {
  //   tel = this.data.serviceTel
  // }
  // if (tel !== '') {
  //   wx.showModal({
  //     title: '提示',
  //     content: '确认要拨打此电话' + tel,
  //     success: function (res) {
  //       if (res.confirm) {
  //         wx.makePhoneCall({
  //           phoneNumber: tel,
  //         })
  //       } else if (res.cancel) {}
  //     }
  //   })
  // }

  // selfA.getTemporaryUrl(this.data.productPictures[0].url)
  //     .then(res => {
  //     })
  const picture = state.productPictures[0].url;
  const title = state.name;
  const sellPrice = state.sellPrice;
  const description = state.description;
  // wx.navigateTo({
  //     url: `/pages/mallModule/order/qiyu/index?goodsId=${this.data.goodsId}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}`,
  // })
  NAVPAGE.toCustomService(`?goodsId=${state.goodsId}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}&goodPageData=${JSON.stringify(state.options)}`);
}
function onClickGoods(val) {
  const e = {
    productId: val.detail.productid,
    type: val.detail.type,
    lastPage: "home"
  };
  toProductDetail(e);
}
function toProductDetail(e) {
  let opts = "";
    let n = 0;
  for (const t in e) {
    opts = n === 0 ? opts + "?" + t + "=" + e[t] : opts + "&" + t + "=" + e[t], n++;
  }
  NAVPAGE.toGoodsDetails(opts);
}
function addToCart(e) {
  const self = this;
    const _i = e.detail.context;
  i = _i;
  addRelatedProductToShopcart(e.detail);
}
function addToCartAnimateTest(e) {
  const self = this;
    const _i2 = i;
  const t = new Date().getTime();
    const o = state.ctime;
  if (!(o != "undefined" && t - o < 800)) {
    state.ctime = t;
    const n = app.globalData.systemInfo;
      const r = n.windowWidth / 8 * 1.8;
      const s = n.windowHeight;
    // 三分图商品
    addcart.animateAddToCart(".gm-small-goods-img", r, s, _i2);
  }
}
function noop(e) {
  // console.log(e)
}
function onGetUserInfo(e) {
  getUserInfo(e.detail);
}
function bindDistribution(memberId) {
  // 判断是否开启分销员分享商品创建上下级关系
  if (app.globalData.systemConfigure.openDistributionAccountShareProduct) {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      const postData = {
        memberId
      };
      distributionService.bind(postData).then(res => {
        console.log("------------绑定分销员上下级关系成功");
        console.log(res);
      }).catch(err => {
        console.log("------------绑定分销员上下级关系失败");
        console.log(err.message);
      });
    } else {
      console.log("未登录或不是会员");
    }
  } else {
    console.log("未开启分销员分享商品创建上下级关系");
  }
}
function showRelateCoupon(e) {
  toggleRelateCouponPopup();
}
function couponClick(e) {
  toCouponDetails(e);
}
function toCouponDetails(val) {
  const that = this;
  const tempCouponList = state.relatedCouponList;
  const currentId = val.detail.couponid;
  let currentCoupon = null;
  tempCouponList.forEach(item => {
    if (item.id === currentId) {
      currentCoupon = item;
    }
  });
  if (currentCoupon) {
    const opts = '?couponActivityId=' + currentCoupon.id + '&type=assign&isExternal=false';
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      NAVPAGE.toCouponDetails(opts);
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function assign(e) {
  handleCoupon(e);
}
function handleCoupon(val) {
  const self = this;
  const couponId = val.detail.couponid;
  const couponList = state.relatedCouponList;
  let currentCoupon = null;
  couponList.forEach(item => {
    if (couponId === item.id) {
      currentCoupon = item;
    }
  });
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!customData.hasAssign) {
          uni.showLoading({
            title: '领取中...'
          });
          customData.hasAssign = true; // 标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
          if (currentCoupon.price && currentCoupon.price > 0) {
            // 有价券
            createCouponOrder(currentCoupon);
          } else {
            // 非有价券
            if (currentCoupon.service === 'HD' || currentCoupon.service === 'ZJIAN') {
              // 海鼎非有价券走创建订单步骤
              createCouponOrder(currentCoupon);
            } else {
              // 积分换券
              if (currentCoupon.score && currentCoupon.score > 0) {
                createCouponOrder(currentCoupon);
              } else {
                couponAssign(currentCoupon.id);
              }
            }
          }
        } else {
          uni.showToast({
            title: '您已经在领取中了,请稍等片刻~',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            uni.showLoading({
              title: '领取中...'
            });
          }, 2000);
        }
      } else {
        NAVPAGE.toAuthorize();
      }
    } else {}
  } else {
    uni.showToast({
      title: '券已经被抢完了，看看别的吧~',
      icon: 'none',
      duration: 2000
    });
  }
}
function toAssign(val) {
  const self = this;
  const currentCoupon = state.coupon;
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!state.hasAssign) {
          uni.showLoading({
            title: '领取中...'
          });
          // 标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
          state.hasAssign = true;
          if (currentCoupon.price && currentCoupon.price > 0) {
            // 有价券
            createCouponOrder(currentCoupon);
          } else {
            // 非有价券
            if (currentCoupon.service === 'HD' || currentCoupon.service === 'ZJIAN') {
              // 海鼎非有价券走创建订单步骤
              createCouponOrder(currentCoupon);
            } else {
              // 积分换券
              if (currentCoupon.score && currentCoupon.score > 0) {
                createCouponOrder(currentCoupon);
              } else {
                couponAssign(currentCoupon.id);
              }
            }
          }
        } else {
          uni.showToast({
            title: '您已经在领取中了,请稍等片刻~',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            uni.showLoading({
              title: '领取中...'
            });
          }, 2000);
        }
      } else {
        handlePopupPhone();
      }
    } else {
      uni.showToast({
        title: '您还没有登录，请点击头像授权登陆~',
        icon: 'icon',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '券已经被抢完了，看看别的吧~',
      icon: 'none',
      duration: 2000
    });
  }
}
function createCouponOrder(coupon) {
  const self = this;
  let serviceType = 'GM'; // 券服务类型默认为内部券（GM）
  let couponActivityId = coupon.id;
  if (coupon.service === 'HD' || coupon.service === 'ZJIAN') {
    serviceType = coupon.service;
    couponActivityId = coupon.id; // 海鼎券券活动ID为鼎力云券活动ID-----已作废；统一使用id
  }
  util.setHideLoading(true);
  couponService.createCouponOrder(couponActivityId, serviceType, state.storeId, coupon.score).then(res => {
    console.log(res);
    if (res.status === 'ACQUIRE') {
      // 标识状态为领取中
      state.hasAssign = false;
      customData.hasAssign = false;
      util.setHideLoading(false);
      uni.hideLoading();
      if (serviceType === 'GM') {
        uni.showToast({
          title: '领券成功,稍后请到我的优惠券中查看~',
          icon: 'none',
          duration: 2000
        });
      } else {
        queryExternalCoupons();
      }
    } else if (res.status === 'CREATED') {
      const postData = {
        orderId: res.id,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
        entry: "COUPON",
        total: res.price
      };
      if (res.price === 0 && coupon.score && coupon.score > 0) {
        // 积分换券
        getOrderStatusById(res.id, self);
      } else {
        couponWXPay(postData);
      }
    } else {
      // 标识状态为领取中
      state.hasAssign = false;
      customData.hasAssign = false;
      uni.showToast({
        title: res.acquireFailedReason,
        icon: 'none',
        duration: 2000
      });
    }
  }).catch(e => {
    // 标识状态为领取中
    state.hasAssign = false;
    customData.hasAssign = false;
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function couponAssign(activityId) {
  const self = this;
  const postData = {
    activityId
  };
  uni.showLoading({
    title: '领取中'
  });
  couponService.assign(postData).then(res => {
    // 标识状态为领取中
    state.hasAssign = false;
    customData.hasAssign = false;
    uni.hideLoading();
    uni.showToast({
      title: '领券成功,稍后请到我的优惠券中查看~',
      icon: 'none',
      duration: 2000
    });
  }).catch(e => {
    // 标识状态为领取中
    state.hasAssign = false;
    customData.hasAssign = false;
    uni.hideLoading();
    if (e.code === 17005) {
      uni.showToast({
        title: '券活动指定的有效期已经过期，不能领取~',
        icon: 'none',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function couponWXPay(postData) {
  const that = this;
  orderService.getCashPaySign(postData).then(res => {
    console.log(res);
    if (util.isHideLoading()) {
      util.setHideLoading(false);
      uni.hideLoading();
    }
    state.hasAssign = false;
    const resData = JSON.parse(res);
    const sign = JSON.parse(resData.sign);
    let packageValue = '';
    if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
      packageValue = sign.package;
    } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
      packageValue = sign.packageValue;
    }
    uni.requestPayment({
      'timeStamp': sign.timeStamp,
      'nonceStr': sign.nonceStr,
      'package': packageValue,
      'signType': sign.signType,
      'paySign': sign.paySign,
      'success': function (res) {
        getOrderStatusById(postData.orderId, that);
      },
      'fail': function (res) {
        console.log(res);
        if (res.errMsg.indexOf("cancel") >= 0) {
          uni.showToast({
            title: '您取消了订单支付~',
            icon: 'none',
            duration: 2000
          });
        } else {
          uni.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  }).catch(err => {
    if (util.isHideLoading()) {
      util.setHideLoading(false);
      uni.hideLoading();
    }
    state.hasAssign = false;
    if (err.code === 1) {
      uni.showToast({
        title: '领券失败，请稍后再试~',
        icon: 'none',
        duration: 2000
      });
    } else if (err.code === -1001) {
      state.showTimeout = true;
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  couponService.getCouponOrderById(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      util.setHideLoading(false);
      self.customData.hasAssign = false;
      uni.hideLoading();
      // 弹出支付超时
      self.setData({
        showTimeout: true
      });
      return;
    }
    if (result.status === 'ACQUIRE') {
      util.setHideLoading(false);
      uni.hideLoading();
      util.showToast("领券成功,稍后请到我的优惠券中查看~");
      self.customData.hasAssign = false;
      // 查询未使用券
      self.queryCoupon();
    } else if (result.status === 'ACQUIREFAILED') {
      util.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.setData({
        showTimeout: true
      });
      self.customData.hasAssign = false;
    } else {
      const orderTimeId = setTimeout(() => {
        util.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      self.setData({
        orderTimeId
      });
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
function getOrderStatusById(orderId, self) {
  const amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
function timeoutPopupClose() {
  state.showTimeout = false;
}
function getCouponPackageDetails(id) {
  const self = this;
  couponService.getPackageById(id).then(res => {
    console.log(res);
    let tempData = res;
    if (res.startDate) {
      const startTime = res.startDate.slice(0, 16);
      const endTime = res.endDate.slice(0, 16);
      const effectiveTime = startTime + ' ~ ' + endTime;
      const validityTime = startTime + ' —— ' + endTime;
      const couponStatus = res.status;
      tempData = {
        ...tempData,
        effectiveTime,
        validityTime,
        status: couponStatus
      };
    } else {
      tempData = {
        ...tempData,
        effectiveTime: '',
        validityTime: ''
      };
    }
    const couponList = [];
    if (res.childCouponActivity && res.childCouponActivity.length > 0) {
      // 处理券包中单个券的数据
      res.childCouponActivity.forEach(item => {
        let couponData = {
          ...item
        };
        if (item.startDate) {
          const startTime = item.startDate.slice(0, 16);
          const endTime = item.endDate.slice(0, 16);
          const effectiveTime = startTime + ' ~ ' + endTime;
          const couponStatus = item.status;
          couponData = {
            ...couponData,
            effectiveTime,
            status: couponStatus
          };
        } else {
          couponData = {
            ...couponData,
            effectiveTime: '',
            validityTime: ''
          };
        }
        couponHandler.handleCouponFunction(couponData);
        // if (item.function === "FREESHIP") {
        //   couponData = {
        //     ...tempDcouponDataata,
        //     condition: '该优惠券只针对配送使用'
        //   }
        // } else {
        //   couponData = {
        //     ...couponData,
        //     condition: item.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
        //   }
        // }
        couponList.push(couponData);
      });
    }
    if (res.function === "FREESHIP") {
      tempData = {
        ...tempData,
        name: '运费券'
      };
    }
    tempData = {
      ...tempData,
      childCouponActivity: couponList
    };
    state.coupon = tempData;
    state.loading = false;
  }).catch(err => {
    state.loading = false;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getSceneById(id) {
  const self = this;
  wxaUserService.getSceneById(id).then(res => {
    function urlToObj(str) {
      const obj = {};
      const arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i].split("=");
        obj[ele[0]] = ele[1];
      }
      return obj;
    }
    const _options = urlToObj(res);
    options = _options;
    const storeId = _options.storeId || state.storeId;
    if (_options.storeId) {
      // 注释回到首页不修改门店逻辑，如需要放开注释即可
      // wx.setStorageSync('setTip', true)
      if (app.globalData.storeInfo) {
        app.globalData.storeInfo.id = storeId;
      } else {
        app.globalData.storeInfo = {
          id: storeId
        };
      }
      console.log(12345, _options.storeId);
      getStoreInfoById(_options.storeId);
    }
    state.storeId = storeId;
    console.log('self.data.storeId111', app.globalData.storeInfo, options.storeId, state.storeId);
    getGoodsDetails(storeId, _options.productId, _options.type);
  }).catch(err => {
    util.showToast(err.message);
  });
}
function dataReporting(productnumber) {
  if (app.globalData.sceneInfo) {
    const scene = app.globalData.sceneInfo;
    mta.Event.stat('productopenscene', {
      sceneproduct: scene + "_" + productnumber,
      scene,
      productnumber
    });
  }
}
function openTeamBuySpecs(e) {
  const type = e.currentTarget.dataset.type || e.detail.target.dataset.type;
  console.log(type);
  const that = this;
  // 查询订阅消息
  // if (app.globalData.templateIdsQuery) {
  //   handleSubscribeMessage()
  // } else {
  //   subscribeMessage.getTemplateIds().then(res => {
  //     handleSubscribeMessage()
  //   }).catch(err => {
  //     handleJoinGroup()
  //     console.log(err.message);
  //     log.warn("查询模板id报错：", err.message);
  //   })
  // }

  handleJoinGroup();
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.GROUP_ORDER);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            log.info(res);
            subscribeMessage.addSubscribe(subscribeMessage.scene.GROUP_ORDER, res);
            handleJoinGroup();
          },
          fail(err) {
            console.log(err);
            log.warn(err);
            handleJoinGroup();
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
        handleJoinGroup();
      }
    } else {
      log.info('模板id未获取到');
      handleJoinGroup();
    }
  }
  function handleJoinGroup() {
    if (state.specs.length > 0) {
      if (state.balance > 0) {
        state.goodsImg = state.productPictures[0].url;
        state.hasTeamLeader = type === "leader";
        toggleTeamGoodsSpecPopup();
      } else {
        uni.showToast({
          title: '门店正在补货中，看看其他商品吧~',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      if (teamBuyings.type !== "SPEC") {
        if (type === "leader") {
          toPayTeamBuying(e);
        } else {
          joinGroup(e);
        }
      }
    }
  }
}
function openGrabGoodsSpecs(e) {
  const type = e.currentTarget.dataset.type || e.detail.target.dataset.type;
  if (state.specs.length > 0) {
    if (state.balance > 0) {
      state.goodsImg = state.productPictures[0].url;
      state.hasImmediatelyGrab = type === "grab";
      customData.grabSpecPopupType = type === "grab" ? "grab" : "normal";
      toggleGrabGoodsSpecPopup();
    } else {
      uni.showToast({
        title: '门店正在补货中，看看其他商品吧~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    if (state.secKillInfo.type !== "SPEC") {
      state.goodsImg = state.productPictures[0].url;
      state.good1 = e;
      state.grabType = type;
      toggleGoodsNormalPopup();
      // if (type === "grab") {
      //     // 立即抢购
      //     this.toPaySecKill(e)
      // } else {
      //     // 加入购物车
      //     this.addShopCart(e)
      // }
    }
  }
}
function getStoreInfoById(id) {
  const that = this;
  storeService.getById(id).then(res => {
    console.log('that.options.storeId', options.storeId);
    if (options && options.storeId && (!app.globalData.distributionStore || res.id != app.globalData.distributionStore.id) && (!app.globalData.nextDayStore || res.id != app.globalData.nextDayStore.id)) {
      app.globalData.storeInfo = {
        ...res,
        id: res.virtualStore == 1 ? res.parentId : res.id,
        virtualStoreId: res.id
      };
    }
    state.storeInfo = {
      ...res,
      id: res.virtualStore == 1 ? res.parentId : res.id,
      virtualStoreId: res.id
    };
    if (!res || !res.merchantDelivery || !res.storeSelfDeliveryTimes || res.storeSelfDeliveryTimes.length === 0) {
      return;
    }
    console.log('有进入吗？');
    const now = new util.ResponseDate();
    const nowTime = new Date(util.formatTime(now)).getTime();
    const day = util.formatTime(now).split(" ")[0]; // 当前日期
    let selfDeliveryInfo = null;
    res.storeSelfDeliveryTimes.forEach(item => {
      const selfDeliveryTime = item.selfDeliveryTime;
      const time = selfDeliveryTime.split("-");
      const tempStart = day + " " + time[0] + ':00';
      const tempEnd = day + " " + time[1] + ':00';
      const startTimeDetails = new Date(tempStart).getTime();
      const endTimeDetails = new Date(tempEnd).getTime();
      if (nowTime >= startTimeDetails && nowTime <= endTimeDetails) {
        selfDeliveryInfo = item;
        
      }
    });
    state.storeInfo = res;
    state.storeSelfDeliveryInfo = selfDeliveryInfo;
  }).catch(err => {
    util.showToast(err.message);
  });
}
function getCateringDetailsById(productId, callbackFlag) {
  const self = this;
  return new Promise((resolve, reject) => {
    productService.getCateringDetailsById(productId, state.storeId).then(res => {
      const cateringGroupProducts = res.cateringGroupProducts;
      const productId = res.id;
      const goodsList = [];
      let mealCanBuy = true;
      const unBuyGoods = null;
      const unChoiceGroup = null;
      let hasSharingPersonId = false;
      const mealDetails = [];
      const business = state.business;
      // 判断商品数量是否有
      if (res.balance && res.balance <= 0) {
        mealCanBuy = false;
        uni.showToast({
          title: '门店中该商品库存不足，请选购其他商品~',
          icon: 'none',
          duration: 2000
        });
      }
      if (cateringGroupProducts && cateringGroupProducts.length > 0) {
        const groupProductList = [];
        for (let i = 0; i < cateringGroupProducts.length; i++) {
          const item = cateringGroupProducts[i];
          if (item.mealDetails && item.mealDetails.length > 0) {
            for (let j = 0; j < item.mealDetails.length; j++) {
              const ele = item.mealDetails[j];
              const tempData = {
                "groupId": item.groupId,
                "groupProductId": ele.productId,
                "groupProductCount": ele.productCount
              };
              mealDetails.push(ele.productName);
              groupProductList.push(tempData);
              console.log('res', !res.exist, res.storeBalance <= 0);
              // 判断当前门店是否存在该商品 如果不存在则提示用户
              if (!ele.exist || ele.storeBalance <= 0) {
                mealCanBuy = false;
                uni.showToast({
                  title: '门店中该商品库存不足，请选购其他商品~',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          }
        }
        const tempData = {
          count: 1,
          lists: groupProductList,
          productId
        };
        if (app.globalData.isShoppingGuidanceRecordGoods) {
          // 获取分享人id
          const shareData = util.getSharingPersonInfo();
          if (shareData && shareData != null && shareData.productId === state.productId) {
            tempData.lists[0].sharingPersonId = shareData.shareId;
            hasSharingPersonId = true;
          }
        }
        goodsList.push(tempData);
      }
      if (mealCanBuy) {
        const postData = {
          lists: goodsList,
          storeId: state.storeId
        };
        // 统配商品
        if (business === 'DISTRIBUTION') {
          postData.storeId = state.distributionStoreId;
        }
        // 次日达商品
        if (business === 'NEXT_DAY') {
          postData.storeId = state.nextDayStoreId;
        }
        if (state.goodType === 'newmbr') {
          postData.lists[0].newmbrActivityId = state.goodsDetail.activityId;
        } else if (state.goodType === 'secondkill') {
          if (state.secKillInfo.type === "SPEC" && !customData.hasGrabPrice) {
            // 选择的子规格是普通规格不是秒杀
          } else {
            postData.lists[0].grabActivityId = state.activityId;
          }
        }
        console.log(state.scource);
        if (state.scource === "BUYNOW") {
          // 处理立即购买
          postData.mealDetails = "(" + mealDetails.join("+") + ")";
          if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
            util.removeSharingPersonInfo();
          }
          const outcome = {
            outcome: true,
            product: postData
          };
          state.scource = "SHOPPINGCART";
          resolve(outcome);
        } else if (callbackFlag) {
          // 调用回调
          postData.mealDetails = "(" + mealDetails.join("+") + ")";
          const outcome = {
            outcome: true,
            product: postData
          };
          resolve(outcome);
        }
      } else {
        let message = "";
        if (unBuyGoods) {
          message = unBuyGoods.productName + '已售完';
        } else if (unChoiceGroup) {
          message = unChoiceGroup.groupName + '必选';
        }
        reject({
          message
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
}
function getUpgradeScore() {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    return;
  }
  memberService.queryGrade().then(res => {
    if (res) {
      res = util.compareMemberGrade(res);
    }
    const gradeNo = app.globalData.userInfo.member.gradeNo;
    let score = 0;
    let nextGradeNo = 0;
    const memberGrade = [];
    let showScoreUpdate = true;
    if (gradeNo < 0) {
      state.showScoreUpdate = false;
    } else {
      for (let i = 1; i <= 10; i++) {
        res.forEach(el => {
          if (el.gradeNo === i) {
            memberGrade.push(el);
          }
        });
      }
      memberGrade.forEach((el, i) => {
        if (el.gradeNo === gradeNo) {
          const index = i + 1;
          if (index === memberGrade.length) {
            showScoreUpdate = false;
          } else {
            if (memberGrade[index].score) {
              console.log(memberGrade[index], gradeNo, el, "memberGrade[index]");
              score = memberGrade[index].score;
              nextGradeNo = memberGrade[index].gradeNo;
              showScoreUpdate = true;
            } else {
              showScoreUpdate = false;
            }
          }
        }
      });
      state.nextGradeNo = nextGradeNo;
      state.showScoreUpdate = showScoreUpdate;
    }
  });
}
function handleUpgrade() {
  state.show.upgrade = false;
  const opts = "?nextGradeNo=" + state.nextGradeNo;
  NAVPAGE.toScoreVip(opts);
}
function toggleUpgradePopup() {
  state.show.upgrade = false;
}
function goodsDetailsBuryingPoint(productId, storeId) {
  const that = this;
  const traceId = options.traceId != null ? options.traceId : "";
  const opts = {
    products: [{
      productId,
      traceId
    }]
  };
}
function getPackagingInfo(productId) {
  const opts = {
    productIdEquals: productId,
    statusEquals: "STARTED"
  };
  packagingService.query(1, 1, opts).then(res => {
    if (res && res.records && res.records.length > 0) {
      state.packaging = res.records[0];
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
function toPackaging() {
  const opts = "?packagingId=" + state.packaging.id;
  NAVPAGE.toPackaging(opts);
}
</script>
<style scoped>
/* goodsDetail */

/* @import "/pages-sub/newretail/pages/mallModule/template/commentItem.wxss"; */

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
  right: -35rpx;
  /* bottom: 80rpx; */
  top: 25rpx;
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
  border-left: 1px solid #EAEAEA;
}
.share-reamin image {
  margin-bottom: 6rpx;
  /* filter: grayscale(0%) brightness(1000%); */
}
.goods-price {
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

.commission-box view>text {
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
  background: url('http://app-1256684088.cos.ap-beijing.myqcloud.com/wujie/iconShare.png') no-repeat 21rpx;
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
  padding: 10rpx 0;
  background-color: #fff;
  position: relative;
  overflow: hidden;
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
  top: -42rpx;
  z-index: 0;
  width: 100%;
  height: 171rpx;
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
.goods-info-box > view {
  margin-right: 24rpx;
  margin-left: 24rpx;
}

.goods-info-box .goods-name {
  font-size: 35rpx;
  line-height: 64rpx;
  color: #454545;
  font-weight: bold;
  position: relative;
  width: calc(100% - 144rpx);
  min-height: 70rpx;
}
/* .desc-share .goods-desc */

.goods-info-box .goods-name>view {
  display: -webkit-box !important;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-info-box .goods-name>view {
  -webkit-line-clamp: 2;
}

.desc-share .goods-desc {
  width: 70vw;
}

.goods-info-box.group .goods-name {
  font-size: 30rpx;
  line-height: 50rpx;
}

.goods-info-box .goods-name>view {
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
.goods-info-box .sold_box1 .goods-soldNum1 {
  text-align: right;
  padding-right: 20rpx;
  flex: 0 0 auto;
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
  min-height: 30rpx;
  line-height: 30rpx;
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

.goods-soldNum text{
  display: inline-block;
  margin-right: 20rpx;
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
  color: #FF7121;
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
  border-top: 1px solid #EEEEEE;
  margin-top: 20rpx;
  padding-top: 12rpx;
  margin-right: 0;
  margin-left: 0;
  padding-left: 24rpx;
  align-items: center;
  justify-content: space-between;
}
.goods-info-box .sold_box1 image {
  height: 24rpx;
  margin-right: 14rpx;
  vertical-align: middle;
  max-width: 50rpx;
}
.goods-info-box .sold_box text {
  color: #999999;
}
.goods-info-box .sold_box1 text {
  margin: 0;
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
  color: #FF9F43;
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
  color: #FF5003;
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
  margin-bottom: 20rpx;
  width: calc(100% - 48rpx);
  padding: 30rpx 24rpx ;
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
  /* height: 70rpx; */
  padding: 30rpx 24rpx;
  font-size: 24rpx;
  color: #454545;
  background: #fff;
  margin: 1rpx 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
}
.goods-related-coupon .rt{
  display: flex;
  align-items: center;
  width: 80rpx;
}
.goods-related-coupon .rt text{
  width: 2em;
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 400;
  color: #FF7103;
  margin-right: 22rpx;
}
.goods-related-coupon .rt image{
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
.goods-mini-coupon:nth-child(n+2) {
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

.goods-presell>text {
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
.presell-item:last-of-type::after{
  position: absolute;
  right: 30rpx;
  top: 27rpx;
  height: 1px;
  width: 50%;
  background-color: transparent;
  content: '';
}

.presell-item>text {
  font-size: 24rpx;
  line-height: 52rpx;
  color: #7E21EC;
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

.presell-item>text.top {
  font-size: 24rx;
  color: #7E21EC;
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

.goods-details>text {
  display: block;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  text-indent: 40rpx;
  border-bottom: 1rpx solid #ddd;
}

.goods-details>view {
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

.goods-details>view:last-of-type {
  border: none;
}

.goods-details>view text {
  /* display: block; */
  /* float: left; */
  margin-right: 20rpx;
}

.goods-details>view text:first-of-type {
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

.goods-details>view text:last-of-type {
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
  /* margin-top : 20rpx; */
  /* margin-bottom: 120rpx; */
}

.botton-block {
  height: 130rpx;
  width: 100%;
}
.botton-block-ios {
    height: 160rpx;
}
.nav-height {
    height: 0;
    width: 100%;
}
.nav-ios {
    height: 98px;
}
.nav-android {
    height: 81px;
}


.goods-imgtext>text {
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
  height: 110rpx;
  padding: 15rpx 19rpx 0rpx 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 10;
  background-color: #fff;
}
.handle-box-ios {
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    display: flex;
    border-top: 1rpx solid #dadada;
    height: 160rpx;
    padding: 15rpx 19rpx 30rpx 0;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
}

.handle-box view view.badge {
  position: absolute;
  right: 6rpx;
  top: 20rpx;
  width: 24rpx;
  height: 24rpx;
  text-align: center;
  line-height: 24rpx;
  font-size: 20rpx;
  color: #fff;
  background: #ff5601;
  border-radius: 16rpx;
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
  /* margin-top: -24rpx; */
  margin-top: -8rpx;
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

handle-box view.home-icon image,
handle-box view.shopcart-icon image,
handle-box view.contact-icon image{
  width: 37rpx;
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
  /* background: #c1c1c1; */
}

.handle-box view.no-goods button {
  background: #c1c1c1;
  border-radius: 37rpx;
}

.handle-box view.no-seckill-goods button {
  background: #c1c1c1;
  height: 74rpx;
}
form {
  height: auto;
}
.handle-box view button {
  width: 210rpx;
  height: 74rpx;
  line-height: 74rpx;
  border-radius: 0rpx;
  background: #FF9F43;
  color: #fff;
  font-size: 30rpx;
  /* font-weight: bold; */
  padding: 0;
  display: inline-block;
  /* top: -10rpx; */
}

.handle-box view .addCart {
  background: #fff;
  color: #FF9F43;
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
  width: 210rpx;
}

.handle-box view.normal-button.no-goods button {
  flex: 1;
  display: block;
  width: 438rpx;
}

.handle-box view.normal-button button.add-cart {
  color: #FF9F43;
  background: #ffffff;
}

.handle-box view.team-button {
  display: flex;
  width: 400rpx;
  /* max-width: 400rpx; */
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
  width: 216rpx;
  color: #FF9F43;
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
  background: #FF9F43;
  height: 74rpx;
  color: #fff;
  top: 0rpx;
}

.handle-box .seckill {
  /* width: 600rpx; */
  position: relative;
  display: flex;
  height: 74rpx;
}

.handle-box .seckill button {
  /* width: 400rpx; */
  margin-right: 20rpx;
}

.handle-box .seckill form button {
  /* border: 2rpx solid #009f55; */
  color: #FF9F43;
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

.team-box>view {
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

.team-box>view:nth-last-of-type(2) {
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
  color: #EE5253;
  background: #FFEBD5;
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
  color: #FF5003;
  background-color: #fff;
  width: 160rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 24rpx;
}
.team-time-down-tips {
  box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(148,65,0,0.11);
}
.group-time-down>view {
  font-size: 20rpx;
  line-height: 40rpx;
}

.group-time-down .team-time-down-tips {
  font-size: 24rpx;
  width: 160rpx;
}

.group-time-down>view:last-of-type {
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
  background: #FF7121;
  text-align: center;
  margin: 0rpx 3rpx;
  box-sizing: border-box;
}

.group-time-down .txt:last-of-type {
  margin-right: 0;
}

.group-time-down .colon {
  color: #FF9E53;
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
  padding-bottom: 148rpx;
}

.handle-goods .close {
  height: 29rpx;
  width: 29rpx;
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
  align-items: center;
}

.handle-goods .close {
  height: 29rpx;
  width: 29rpx;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.handle-goods .goods-num .count-box {
  /* float: right;
  width: 164rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 56rpx;
  height: 56rpx;
  margin-top: 40rpx;
  border: 1rpx solid #f1f1f1; */
  display: flex;
  align-items: center;
  justify-content: center;
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
  /* width: 56rpx;
  height: 56rpx;
  text-align: center;
  font-size: 48rpx;
  background: #f1f1f1;
  color: #009136;
  line-height: 56rpx; */
  width: 39rpx;
  height: 39rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 36rpx;
  background: #FDFDFD;
  color: #FF9F43;
  line-height: 34rpx;
  display: flex;
  justify-content: center;
}

.count-box>view.num {
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
  bottom: 28rpx;
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
  /* color: #009f55; */
  border: 1rpx solid #009f55;
  border-radius: 66rpx;
  color: #fff;
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

button[class="button-box"]::after {
  border: 0;
}

.page-content {
  /* height: calc(100% - 130rpx); */
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  /* padding-bottom: 100rpx; */
  box-sizing: border-box;
  position: relative;
}
/* .page-content-ios { */
    /* height: calc(100% - 180rpx); */
/* } */

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

.bottom-pop-main .share-type-box>view {
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

.bottom-pop-main .share-type-box>view image {
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
  color: #5B5B5B;
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
  padding: 0 24rpx 28rpx 24rpx;
}

.comment-title-relation {
  font-weight: 600;
  font-size: 28rpx;
  color: #333333;
  padding: 29rpx 0;
  display: inline-block;
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

.relevant-goods-view>text {
  display: block;
  text-indent: 40rpx;
  font-size: 36rpx;
  height: 90rpx;
  line-height: 90rpx;
}

.relevant-scrollview {
  /* display: flex; */
  width: 100%;
  /* margin-top: 20rpx; */
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
  background: #F2f2f2;
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
  background: #F2f2f2;
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

.popup-rules-detail-board .popup-content>view {
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
  color: #1C1C1C;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-upgrade-content {
  color: #1C1C1C;
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

.popup-upgrade-button>view {
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
  background: #FFFFFF;
  color: #454545;
  font-size: 32rpx;
  margin-top: 1rpx;
  box-sizing: border-box;
}

.goods-packaging .rt{
  display: flex;
  align-items: center;
  width: auto;
}
.goods-packaging .rt text{
  width: 3em;
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 400;
  color: #FF7103;
  margin-right: 22rpx;
}
.goods-packaging .rt image{
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
  background: #EE5253;
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
    /* height: 800rpx; */
    max-height: 70%;
    margin-top: 80rpx;
    background: #fff;
    position: relative;
    border-radius: 30rpx 30rpx 0 0;
  }
  .spec-top-box {
    width: 100%;
    height: auto;
}
  .spec-img-box {
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
  }
  
  .spec-close-box {
    height: 29rpx;
    width: 29rpx;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 30rpx;
    top: 30rpx;
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
    color: #FF7121;
    line-height: 48rpx;
  }
  
  .price-box .price {
    font-size: 34rpx;
    color: #FF7121;
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
    background: #E5E5E5;
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
    /* position: absolute;
    left: 0;
    bottom: 40rpx; */
    height: 138rpx;
    /* width: 600rpx; */
    width: 100%;
    padding: 0 20rpx 40rpx;
    border-radius: 98rpx;
    overflow: hidden;
    box-sizing: border-box;
  }

  .spec-button-box-content {
    width: 100%;
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
    /* position: absolute;
    bottom: 100rpx; */
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
  .goods-count-box>view {
    width: 39rpx;
    height: 39rpx;
    border-radius: 20rpx;
    text-align: center;
    font-size: 36rpx;
    background: #FDFDFD;
    color: #FF9F43;
    line-height: 34rpx;
    display: flex;
    justify-content: center;
  }
  .goods-count-box .iconfont {
    font-size: 50rpx;
  }
  
  .goods-count-box>view.num {
    width: 64rpx;
    height: 50rpx;
    /* margin: 0 4rpx; */
    margin: 6rpx 4rpx 0;
    line-height: 50rpx;
    color: #333;
    text-align: center;
    border-radius: 3rpx;
    min-width: 44rpx;
    padding: 0 10rpx;
    font-size: 24rpx;
  }
  .flexbox{
      position: absolute !important;
      right: 0;
  }
  .f1{
      flex: 1;
  }
  .df{
    display: flex;
  }
  .db{
      display: block !important;
  }
  .btnw{
    /* height: 100%; */
    border-radius: 37rpx;
      /* width: calc(100vw - 186rpx) !important; */
  }
  .now-change {
    /* position: absolute;
    right: 26px; */
    margin-left: 200rpx;
  }
  .advanceSell_button {
    flex: 1;
    border-radius: 37rpx;
    overflow: hidden;
  }
  .handle-box .advanceSell_button button {
    width: 100%;
    border-radius: 60rpx;
  }
  .goods-appointment {
    background-color: #fff;
    padding: 20rpx 30rpx 30rpx;
    margin: 20rpx 0;
  }
  .appointment-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  .appointment-title view {
    padding: 0 29rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 35rpx;
  }
  .appointment-scroll {
    display: flex;
    align-items: flex-start;
    padding-top: 2rpx;
  }
  .goods-appointment-list {
    min-height: 284rpx;
  }
  .goods-appointment-list .goods-appointment-item {
    width: 198rpx;
    min-height: 284rpx;
    box-sizing: border-box;
    border-radius: 10rpx;
    margin-right: 13rpx;
    position: relative;
    background-color: #fff;
    padding-bottom: 10rpx;
  }
  .goods-appointment-list .disabled {
    background-color: #F2F2F2;
  }
  .goods-appointment-list view image {
    width: 100%;
    max-height: 180rpx;
    border-radius: 10rpx 10rpx 0 0;
  }
  .goods-appointment-list view view {
    padding: 0 18rpx;
    font-size: 18rpx;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12rpx;
  }
  .gradeImg {
    height: 28rpx;
    width: auto;
    max-width: 100%;
    margin-left: 13rpx;
  }
  
  .goods-appointment-list .goods-nowPrice {
    color: #FF7121;
    margin-right: 6rpx;
    display: inline-block;
  }
  .goods-appointment-list .goods-earliest-time {
    color: #FF7121;
  }
  .goods-appointment-list .goods-oldPrice {
    color: #c1c1c1;
    text-decoration: line-through;
  }
  .week-list {
    display: flex;
    align-items: flex-start;
    height: 55rpx;
    position: relative;
    margin-top: 36rpx;
  }
  .week-list .week-item {
    height: 100%;
    position: relative;
    font-size: 24rpx;
    margin-right: 55rpx;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    max-width: 60rpx;
    justify-content: center;
  }
  .week-list .week-disabled {
    opacity: 0.3;
  }
  .week-list view view {
    position: absolute;
    left: 0;
    bottom: 2rpx;
    width: 100%;
    height: 4rpx;
  }
  .time-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 28rpx;
  }
  .time-item {
    width: 129rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 10rpx;
    font-size: 24rpx;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
    box-sizing: border-box;
    border: 1px solid transparent;
  }
  .time-item:nth-of-type(5n) {
    margin-right: 0;
  }
  .time-disabled {
    color: #DBDBDB !important;
    opacity: 0.8;
  }
  .disabled-logo {
    position: absolute;
    right: 0;
    top: -14rpx;
    background-color: #DADADA;
    color: #fff;
    font-size: 16rpx;
    width: 50rpx;
    height: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14rpx;
  }
  .goods-appointment-item .img-box {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .service-staff-grade {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28rpx;
    max-width: 100%;
  }
  .goods-appointment-item .goods-check {
    width: 13px;
    height: 13px;
    background: #fff;
    /* border: 1px solid red; */
    border-radius: 50%;
    position: absolute;
    right: 10rpx;
    top: 10rpx;
    padding: 0;
    margin: 0;
  }
  .goods-appointment-item .goods-check image {
    width: 11px;
    height: 10px;
    position: absolute;
    left: 1px;
    top: 1px;
  }
  .florist_price_box {
    background-color: #FB5606;
    height: 105rpx;
    display: flex;
    align-items: center;
  }
  .florist_price_box .goods-oldPrice {
    top: 0;
  }
  .no-data-img-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 80rpx 0;
  }
  .no-data-img {
    width: 205rpx;
    max-height: 300rpx;
  }
</style>