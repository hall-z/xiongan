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
  <!-- pages/orderDetails/orderDetails.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view>
    <view class="order">
        <view class="top-info">
            <view class="refresh" @click="getOrder">刷新</view>
            <image class="icon-top-more" :src="state.imagesPath.iconOrderTopMore"></image>
            <view class="order-status">订单{{state.order.status}}</view>
            <view v-if="state.order.status == '待付款'">
                <view class="top-tips">
                    <view class="top">
                        <view class="countdown" v-if="state.order.status == '待付款'">
                            <text :style="'color:' + state.themeColor">{{state.payTime}}</text>
                            <text>内未支付，订单将自动取消。</text>
                        </view>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancel" @click="toCancel" :data-id="state.orderId">取消订单</button>
                    <button class="payment" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="toPay" :data-id="state.orderId">去支付</button>
                </view>
            </view>
            <view v-if="state.order.status == '配送中'">
                <view class="top-tips">
                    <view class="top">
                        <view v-if="state.order.business !== 'DISTRIBUTION' && state.order.shipmentType !== 'LOGISTICAL'">
                            <text>{{filtdistributionCompany(state.order.distributionCompany)}}骑手已在配送</text>
                            <text class="distribution" @click="toOrderTrajectory" :style="'color:' + state.themeColor">查看配送信息</text>
                        </view>
                        <text v-else>订单已经发货</text>
                        <text>请您耐心等待~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse" :hidden="state.business == 'SCORE'">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund">申请退款</button>
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="payment btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="handleConfirmReceipt">确认收货</button>
                </view>
            </view>
            <view v-if="state.order.status == '待服务'">
                <view class="top-tips">
                    <view class="top">
                        <text>请按照预约时间到店</text>
                        <text>别忘记哦~</text>
                    </view>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE'" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '待自提'">
                <view class="top-tips">
                    <view class="top">
                        <text>请按照预约时间自提</text>
                        <text>别忘记提货哦~</text>
                    </view>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE'" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '已付款'">
                <view class="top-tips">
                    <view class="top">
                        <text>门店已接单,正在为您备货</text>
                        <text>请您耐心等待~</text>
                    </view>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE'" v-if="state.order.type !== 'PENNY' && state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '接龙中'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单正在接龙中</text>
                    </view>
                    <text class="bottom">接龙活动结束后才能{{state.order.shipmentAmount === "SELF" ? "自提" : "发货"}}哦请耐心等待~</text>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE'" v-if="state.order.type !== 'PENNY' && state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <button class="cancle btn" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '待发货'">
                <view class="top-tips">
                    <view class="top">
                        <text>门店正在为您备货</text>
                        <text>请耐心等待配送员接单~</text>
                    </view>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE'" v-if="state.canShowService || state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY' && state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <button class="cancle" @click="toRefundGoods" :data-type="'REFUND'" :data-status="state.status" v-if="state.canShowService">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="to-invitation btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" open-type="share" data-shareType="penny" @click="shaerPenny" v-if="state.canShowService">邀请好友助力</button>
                </view>
            </view>
            <view v-if="state.order.status == '已发货'">
                <view class="top-tips">
                    <view class="top">
                        <text>门店已经发货</text>
                        <text>请耐心等待配送员接单~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.order.type !== 'PENNY' && state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '待配送'">
                <view class="top-tips">
                    <view class="top">
                        <text>门店正在为您备货</text>
                        <text>请您耐心等待~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="cancle btn" @click="toTrackingDetails" :hidden="state.isDistribution ? false : true">查看物流</button>
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '已完成'">
                <view class="top-tips">
                    <view class="top">
                        <text>感谢您对线上商城的信任</text>
                        <text>期待您再次光临。</text>
                    </view>
                </view>
                <view class="top-button-box" :hidden="state.business == 'SCORE' || state.storeOrderId" v-if="state.order.type !== 'PENNY' && state.butFalse">
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" v-if="state.business !== 'SCORE' && state.order.type !== 'PENNY'">申请退款</button>
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '待评价'">
                <view class="top-tips">
                    <view class="top">
                        <text>感谢您对线上商城的信任</text>
                        <text>您的鼓励将是我们前进的动力。</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toEvaluate" :data-id="state.orderId">去评价</button>
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" v-if="state.business !== 'SCORE' && state.order.type !== 'PENNY'">申请退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '退款中' || state.order.status == '接龙失败，退款中'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单您已申请退款</text>
                        <text>退款金额将在2个工作日内原路退回。</text>
                    </view>
                    <text class="bottom"></text>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toService1">联系门店</button>
                    <button class="cancle" @click="cancalRefund" :hidden="state.cancelFlag">取消退款</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '已退款' || state.order.status == '接龙失败，已退款'">
                <view class="top-tips">
                    <view class="top">
                        <text>您的订单已退款成功</text>
                        <text>退款金额已退回原路。</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toMoneyGoing" v-if="state.order.type === 'PENNY'">钱款去向</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                    <button class="service btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="isOpenCustomerService ? '' : 'callContact'">联系客服</button>
                </view>
            </view>
            <view v-if="state.order.status == '部分退款'">
                <view class="top-tips">
                    <view class="top">
                        <text>您的订单已部分退款成功</text>
                        <text>退款金额已退回原路。</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" v-if="state.business !== 'SCORE' && state.order.orderCanRefund && state.order.type !== 'PENNY'">申请退款</button>
                    <button class="cancle" @click="toMoneyGoing" v-if="state.order.type === 'PENNY'">钱款去向</button>
                    <!-- <button class="cancle" wx:if="{{canOneMore}}" bindtap="oneMore">再来一单</button> -->
                </view>
            </view>
            <view v-if="state.order.status == '待拼团'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单拼团还在等待拼团</text>
                        <text>拼团记得叫上小伙伴哦~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE'">申请退款</button>
                    <button class="to-invitation btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" open-type="share" @click="shareGroup" :hidden="state.teamMemberCount - state.joinMemberCount == 0 || state.teamBuyEnd">邀请好友</button>
                </view>
            </view>
            <view v-if="state.order.status == '已成团'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单拼团已经成团</text>
                        <text>门店正在努力备货，请耐心等待~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="cancle" @click="toRefundGoods" :data-id="state.orderId" :data-status="state.status" :data-type="'REFUND'" v-if="state.business !== 'SCORE'">申请退款</button>
                    <button class="to-invitation btn" :style="'background: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" open-type="share" @click="shareGroup" :hidden="state.teamMemberCount - state.joinMemberCount == 0 || state.teamBuyEnd">邀请好友</button>
                </view>
            </view>
            <view v-if="state.order.status == '已取消'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单已支付超时</text>
                        <text>超出支付时间订单已自动取消。</text>
                    </view>
                </view>
                <!-- <view class="top-button-box" wx:if="{{state.canOneMore && state.butFalse}}">
                    <button class="cancle" wx:if="{{state.canOneMore}}" bindtap="oneMore">再来一单</button>
                </view> -->
            </view>
            <view v-if="state.order.status == '支付失败'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单已支付失败</text>
                    </view>
                </view>
                <!-- <view class="top-button-box" wx:if="{{state.canOneMore && state.butFalse}}">
                    <button class="cancle" wx:if="{{state.canOneMore}}" bindtap="oneMore">再来一单</button>
                </view> -->
            </view>
            <view v-if="state.order.status == '待付尾款'">
                <view class="top-tips">
                    <view class="top">
                        <text>订单已支付</text>
                        <text v-if="state.butFalse" class="order-tips" :style="'color:' + state.themeColor + ';'">请于{{state.advanceSellTime.balanceDate}}期间支付尾款</text>
                        <text v-if="state.shipmentType === 'EXPRESS'">支付尾款后配送~</text>
                        <text v-if="state.shipmentType === 'SELF'">支付尾款后自提~</text>
                    </view>
                </view>
                <view class="top-button-box" v-if="state.butFalse">
                    <button class="payment" :style="'color: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'" @click="toPayTail" :data-id="state.orderId">待付尾款</button>
                </view>
            </view>
        </view>
        <view class="receive-box" v-if="state.shipmentType === 'EXPRESS' && state.memberName">
            <view class="icon-box">
                <image :src="state.imagesPath.iconOrderPosition"></image>
            </view>
            <view class="receive-info">
                <view>
                    {{state.memberName}}
                    <text>{{state.mobile}}</text>
                </view>
                <view>{{state.address ? state.address : ""}}</view>
            </view>
        </view>
        <view class="invite-join" v-if="state.isTeamShare">
            <view class="group-title">
                <view v-if="!state.teamBuyEnd">
                    <view v-if="state.teamStatus == 'success'">拼团成功</view>
                    <view v-else>还差 {{state.teamMemberCount - state.joinMemberCount}} 人拼团成功</view>
                </view>
                <view v-if="state.teamBuyEnd">当前团购活动已过期</view>
                <view v-if="!state.teamBuyEnd">
                    <view v-if="state.teamStatus != 'success'">剩余时间
                        <text>{{state.countDownList.hou}}:{{state.countDownList.min}}:{{state.countDownList.sec}}</text>
                    </view>
                </view>
                <view v-if="state.teamBuyEnd"></view>
            </view>
            <view class="group-people-list">
                <view v-if="teamBuyingType !== 'THOUSAND'">
                    <view class="people-item leader" v-for="(item , idx) in state.joinMbrs" :key="idx" v-if="idx == 0" :hidden="state.joinPeopleCount == 0">
                        <image :src="item.avatar"></image>
                        <text class="leader-label">团长</text>
                    </view>
                </view>
                <view v-if="teamBuyingType === 'THOUSAND'">
                    <view class="people-item" v-for="(item , index) in state.joinMbrs" :key="index" v-if="state.teamPeopleCount > 10 ? index < 9 : index < state.teamPeopleCount">
                        <image :src="item.avatar"></image>
                    </view>
                    <view class="people-item" v-for="(item , index) in state.teamPeopleCount - state.joinPeopleCount" v-if="state.teamPeopleCount > 10 ? index < 9 - state.joinPeopleCount : state.teamPeopleCount - state.joinPeopleCount" :key="index">
                        <text>?</text>
                    </view>
                </view>
                <view v-if="teamBuyingType !== 'THOUSAND'">
                    <view class="people-item" v-for="(item , index) in state.joinMbrs" :key="index" v-if="state.teamPeopleCount > 10 ? index < 8 : index < state.teamPeopleCount" :hidden="index == 0">
                        <image :src="item.avatar"></image>
                    </view>
                    <view class="people-item" v-for="(item , index) in state.teamPeopleCount - state.joinPeopleCount" v-if="state.teamPeopleCount > 10 ? index < 9 - state.joinPeopleCount : state.teamPeopleCount - state.joinPeopleCount" :key="index">
                        <text>?</text>
                    </view>
                </view>
                <view class="people-more" v-if="state.teamPeopleCount > 10" :key="index">
                    <image :src="state.imagesPath.iconCollageMore"></image>
                </view>
            </view>
            <view v-if="state.teamMemberCount - state.joinMemberCount == 0 || state.teamBuyEnd ? false : true">
                <button class="join-group usable" :style="'background-color: ' + state.themeColor" open-type="share" @click="shareGroup" :hidden="state.teamMemberCount - state.joinMemberCount == 0 || state.teamBuyEnd">邀请好友参团</button>
                <view :hidden="state.teamBuyEnd || state.teamStatus == 'success'" class="group-share-text">分享到3个群，有95%的机会在5分钟内成团</view>
            </view>
            <view v-else>
                <view class="group-success" v-if="state.teamStatus == 'success'">
                    <icon type="success" size="20" :color="state.themeColor">
                    <text>门店正在配货 请耐心等待片刻</text>
                </icon></view>
            </view>
        </view>
        <view v-if="(state.shipmentType === 'SELF' || state.shipmentType === 'EXPRESS') && state.order.type !== 'CYCLE' && (!state.subOrders || state.subOrders.length < 2)">
            <view class="pickup-store">
                <view class="navigation-box">
                  <view class="title">
                    {{state.order.business == 'SERVICE' ? '服务' : state.shipmentType == 'EXPRESS' ? '配送' : '提货'}}门店：{{state.order.storeName}}
                  </view>
                </view>
                <view class="selftake-time color-454545" v-if="state.order.teamId != null || state.order.type === 'SOLITAIRE'">
                    {{state.selfTimeScope}}
                </view>
                <view class="selftake-time color-454545" v-else-if="state.order.business == 'SERVICE' && state.order.selfPickBeginTime">
                    <view>
                      预约时间：{{state.order.selfPickBeginTime}}
                    </view>
                    <view>
                      预约手机：{{state.order.receiverMobile}}
                    </view>
                </view>
                <view class="selftake-time color-454545" v-else-if="state.selfTimeScope">
                    {{state.shipmentType == 'EXPRESS' ? '配送' : '提货'}}时间：{{state.selfTimeScope}}
                </view>
                <!-- 门店时间 -->
                <view class="selftake-time color-454545" v-else-if="state.storeInfo && state.storeInfo.storeHours">
                  {{state.shipmentType == 'EXPRESS' ? '配送' : '提货'}}时间：{{state.storeInfo.storeHours}}
                </view>
                <view class="self-address color-454545" v-if="state.order.business != 'SERVICE' && state.storeInfo && state.shipmentType === 'SELF' && state.storeInfo.province">
                  自提地址：{{state.storeInfo.province || ''}}{{state.storeInfo.city || ''}}{{state.storeInfo.district || ''}}{{state.storeInfo.address || ''}}
                </view>
                <view class="self-address color-454545">
                  订单备注：{{state.order.remark || ''}}
                </view>
                <view v-if="state.order.status === '已付款' && state.order.type != 'SERVICE'" class="order-btn-box">
                  <!-- <view class="navigation" wx:if="{{state.shipmentType === 'SELF'}}" catchtap="navToStore">
                    <image src="{{state.imagesPath.iconStoreNav}}"></image>
                    <text>到这去</text>
                  </view> -->
                  <button type="default" size="mini" @click.stop="editTime" plain="" v-if="state.status && !(state.status == '待付款' || orderfrom || state.status == '付款待自提') && state.selfTimeScope && state.orderDeliveryTimeCanModifyCount && state.orderDeliveryTimeCanModifyCount > state.order.deliveryTimeModifyCount">
                    <image class="order-icon" :src="state.imagesPath.orderEditTime" mode="heightFix"></image>
                    修改时间/备注
                  </button>
                  <button v-if="state.shipmentType === 'SELF'" type="default" size="mini" plain="" @click.stop="navToStore">
                    <image class="order-icon" :src="state.imagesPath.orderAddress" mode="heightFix"></image>
                    导航地址
                  </button>
                </view>
                <view v-if="(state.order.status === '待服务' || state.shipmentType === 'SELF' && (state.order.status === '待自提' || state.order.status === '已付款')) && !state.showBarcode">
                  <image mode="widthFix" @click="getOrder" class="self-code-img" :src="state.imagesPath.selfCode"></image>
                </view>
                <view v-else-if="state.order.status === '待自提' || state.business == 'SCORE' && state.order.status == '已付款'">
                    <view class="code-box">
                        <view class="barcode-box" @click="showBarcode ? 'handleToBigBarcode' : ''">
                            <view v-if="state.showBarcode">
                                <canvas id="orderBarcode" type="2d" :style="state.barcodeImageUrl ? '' : 'left: -999999rpx;'">
                                <image :src="state.barcodeImageUrl" v-if="state.barcodeImageUrl"></image>
                            </canvas></view>
                            <view v-else>
                                <image mode="widthFix" :src="state.imagesPath.iconOrderCode"></image>
                            </view>
                        </view>
                        <text class="code-text" v-if="state.showBarcode">{{state.codeText}}</text>
                        <text class="selfTime-text" v-if="!state.showBarcode">{{state.selfTimeText}}</text>
                    </view>
                    <view class="deliveryTimeStatement" v-if="state.deliveryTimeStatement">
                        该订单内含有特殊可自提/配送时间商品，此类商品自提/配送时间以该商品描述为准</view>
                </view>
            </view>
        </view>
        <!-- 添加快递类 展示配送信息 -->
        <view class="addressBox" v-if="refundStatus == 'REFUND_WAITRECEIVER' && state.order.shipmentType === 'LOGISTICAL'">
            <view class="addressBox-active">
                <view class="addressBox-active-left">
                    <image src="http://wmsaas-prod.oss-cn-beijing.aliyuncs.com/wmsaas-prod/20221109/1590217534970281985/%E7%BB%84%202@2x.png"></image>
                    
                </view>
                <view class="addressBox-active-content">
                    <view class="addressBox-active-content-top">
                        {{refundAddress.contact}} {{refundAddress.mobile}}
                    </view>
                    <view>
                        {{refundAddress.address}}
                    </view>
                </view>
                <view class="addressBox-active-right" @click="clipBtn">
                    <image src="http://wmsaas-prod.oss-cn-beijing.aliyuncs.com/wmsaas-prod/20221109/1590217908309475330/%E5%BD%A2%E7%8A%B6%201@2x.png"></image>
                    
                </view>
            </view>
            <view class="addressBox-active-bottom" @click="addressBox">
                <view class="addressBox-active-bottom-top">
                    我已寄出
                </view>
                <view class="addressBox-active-bottom-bottom">
                    {{state.order.refundTrackingNumber ? '查看物流信息' : '填写物流信息'}} <image style="width: 12rpx; height: 23rpx; vertical-align: middle; margin-left: 8rpx;" :src="state.imagesPath.iconRight2"></image>
                </view>
            </view>
        </view>

        <view class="tracking_content" v-if="trackingList && trackingList.length > 0">
            <view class="track_tabbar">
                <view v-for="(item , index) in trackingList" :style="'color: ' + (state.trackActiveIndex === index ? state.themeColor : '#999')" :class="state.trackActiveIndex === index ? 'tab_active' : ''" :key="i" :data-id="item.id" :data-index="index" @click="clickShipdetails">
                    包裹{{index + 1}}
                </view>
            </view>
            <view class="tracking-item">
                <view class="header">
                    <view>运单号:<text class="express-number">{{trackingList[trackActiveIndex].trackingNumber}}</text><text class="copy_text" @click.stop="clipBtn1" :style="'color:' + state.themeColor" :data-track="trackingList[trackActiveIndex].trackingNumber">复制</text></view>
                    <view>国内承运人:<text class="express-name">{{trackingList[trackActiveIndex].trackingCom}}</text></view>
                    <view>国内承运人电话:<text class="express-tel" :style="'color: ' + state.themeColor" @click="callTrackingPhone">{{trackingList[trackActiveIndex].phoneNum}}</text></view>
                    <view class="checkGoods" v-if="state.orderTraceType != 'DLY'" :data-trackingNumber="trackingList[trackActiveIndex].trackingNumber" :data-item="trackingList[trackActiveIndex]" @click.stop="checkGoods">查看商品</view>
                    <!-- <view class="right">配送详情<image class="right-icon {{state.currentItem === trackingList[trackActiveIndex].id ? 'active' : ''}}" src="{{state.imagesPath.iconRight2}}" ></image>
                    </view> -->
                </view>
                <view class="ship-details" :hidden="state.currentItem !== trackingList[trackActiveIndex].id && state.orderTraceType != 'DLY'">
                    <view v-if="trackingList[trackActiveIndex].trailUrl || state.orderTraceType != 'DLY'" class="trajectory" :data-trackingNumber="trackingList[trackActiveIndex].trackingNumber" :data-item="trackingList[trackActiveIndex]" @click.stop="toTrajectory">查看轨迹 →</view>
                    <view class="content" v-if="trackingList[trackActiveIndex].shipdetails.length > 0">
                        <view class="express-item" v-for="(item , index) in trackingList[trackActiveIndex].shipdetails" :hidden="!state.showAll && index != 0" :key="index">
                            <image :src="state.imagesPath.current_clock" v-if="item.newest"></image>
                            <image :src="state.imagesPath.pass_clock" v-if="!item.newest"></image>
                            <view class="express-info">
                                <text class="time">{{item.time}}</text>
                                <view class="status">{{item.context}}<text @click="callDistributionPhone">{{state.distributionPhone}}</text></view>
                            </view>
                        </view>
                    </view>
                    <view v-if="trackingList[trackActiveIndex].shipdetails.length > 1" @click="changeShow" class="show_btn" :style="'color:' + state.themeColor">
                        {{state.showAll ? '收起' : '展开'}}
                    </view>
                    <view class="no-data" v-if="trackingList[trackActiveIndex].shipdetails.length == 0">
                        <text>暂无快递信息</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="state.subOrders && state.subOrders.length > 0">
          <view class="goods-box sub-orders-box good-type-box" v-for="(item , goodTypeIndex) in state.subOrders">
            <!-- <view>
              <image wx:if="{{item.shipmentType == 'LOGISTICAL' && item.business == 'DISTRIBUTION'}}" src="{{state.imagesPath.distributionGood}}" mode="heightFix" class="good-type-icon"></image>
              <image wx:elif="{{item.shipmentType == 'nextDay'}}" src="{{state.imagesPath.nextDayGood}}" mode="heightFix" class="good-type-icon"></image>
              <image wx:else src="{{state.imagesPath.storeGood}}" mode="heightFix" class="good-type-icon"></image>
            </view> -->
            <view class="good-type-title">
              <view style="color: #137DFF" v-if="item.shipmentType == 'LOGISTICAL' && item.business == 'DISTRIBUTION' && state.shoppingData.distribution">{{state.shoppingData.distribution.labelName}}</view>
              <view style="color: #23C257" v-else-if="item.type == 'NEXT_DAY' && state.shoppingData.nextDay">{{state.shoppingData.nextDay.labelName}}</view>
              <view style="color: #F66600" v-else>{{state.shoppingData.store ? state.shoppingData.store.labelName : '门店商品'}}</view>
            </view>
            <view class="group-top" v-if="item.type === 'TEAMBUING'">
              <image class="group-bg" :src="state.imagesPath.perfectOrderImg" mode="widthFix"></image>
            </view>
            <view class="group-top" v-if="item.type === 'SOLITAIRE'">
                <image class="group-bg" :src="state.imagesPath.perfectOrderSolitaireImg" mode="widthFix"></image>
            </view>
            <view class="good-type-config-item" v-if="item.business != 'DISTRIBUTION'">
              <view class="delivery-method-name" v-if="item.business != 'DISTRIBUTION' && item.type !== 'SOLITAIRE'">配送方式</view>
              <view class="type-check-box" :hidden="item.business === 'DISTRIBUTION' || item.type === 'SOLITAIRE'">
                    <view v-if="item.shipmentType == 'SELF'" :class="'self-take ' + (state.subOrders[goodTypeIndex].shipmentType == 'SELF' ? 'active' : '')" :style="theme.mainColor + theme.borderColor">
                        <image :src="state.imagesPath.iconOrderSelfTakeActive"></image>
                        <text :style="theme.mainColor">到店自提</text>
                    </view>
                    <view v-if="item.shipmentType == 'EXPRESS'" :class="'dispatch ' + (state.subOrders[goodTypeIndex].shipmentType == 'EXPRESS' ? 'active' : '')" :style="theme.mainColor + theme.borderColor">
                        <image :src="state.imagesPath.iconOrderTakeoutActive"></image>
                        <text :style="theme.mainColor">{{item.business === 'DISTRIBUTION' || isDistributionOrder ? "快递配送" : "外卖配送"}}</text>
                    </view>
              </view>
            </view>
            <!-- <view class="good-type-config-item self-time-box" wx:if="{{item.type !== 'CYCLE' && item.type !== 'TEAMBUING' && item.type !== 'ADVANCE_SELL' && item.type !== 'SOLITAIRE' && item.business !== 'DISTRIBUTION'}}">
              <view class="picker time-picker" > 
                  <view> 
                      <view>
                          <text wx:if="{{item.shipmentType == 'EXPRESS'}}">配送时间</text>
                          <text wx:else>自提时间</text>
                      </view>  
                      <view>
                          <text style="{{theme.mainColor}}">{{state.selfTimeScope}}</text>
                      </view>  
                  </view>
              </view>
            </view> -->
            <view class="goods-list" v-if="item.products && item.productNum == 1">
              <view class="goods-item-box" v-for="(item , index) in item.products" :key="index">
                  <view class="goods-item" v-if="!item.giftProduct">
                      <view class="goods-img" @click.stop="toGoodsDetails" :data-id="item.productId">
                          <image :src="item.imageUrl || state.imagesPath.storeOrderDefaultIcon" mode="widthFix"></image>
                          <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId" :src="state.imagesPath.iconSeckillSeat"></image>
                      </view>
                      <view class="goods-info">
                          <view class="goods-name" @click.stop="toGoodsDetails" :data-id="item.productId">{{state.order.type && state.order.type !== 'CYCLE' ? item.name : state.order.activityName}}</view>
                          <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                              <text v-for="(item , index) in item.list" :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                          </view>
                          <view class="goods-label" v-else-if="item.packagingLabelName">{{item.packagingLabelName}}</view>
                          <view class="goods-desc" v-else-if="state.order.type === 'CYCLE'">{{state.order.products[0].cycleFixedName}}</view>
                          <view class="goods-desc" v-else>{{item.specs}}</view>
                          
                          <view class="goods-desc" v-if="item.deliveryTimeStatement && state.order.type !== 'CYCLE'" style="color: #ff9f43;">
                              {{item.deliveryTimeStatement}}</view>
                          <view class="number-price">
                              <view class="goods-count"><text>x{{item.productNum}}</text>
                                  <text class="refund-num" v-if="item.refundAmount">已退{{item.refundAmount}}</text>
                              </view>
                              <!-- <view class="goods-count" wx:if="{{state.order.type === 'CYCLE'}}"><text wx:if="{{item.cyclePhase}}">第{{item.cyclePhase}}期</text>
                            </view> -->
                              <view class="goods-price" v-if="state.order.business === 'SCORE' || state.order.type == 'SCORE_PRICE'">
                                  <text class="nowPrice">{{state.scorePayment ? state.scorePayment + '积分' : ''}}{{state.order.cashTotal && state.order.cashTotal > 0 && toFix(state.order.cashTotal - state.shipmentAmount) > 0 ? '+￥' + toFix(state.order.cashTotal - state.shipmentAmount) + '元' : ''}}</text>
                              </view>
                              <view class="goods-price" v-else>
                                  <text class="nowPrice">￥{{item.price}}</text>
                              </view>
                          </view>
                      </view>
                  </view>
                  <view class="gift-box" v-if="item.giftProduct">
                      <view class="gift-title">赠品:</view>
                      <view class="gift-item-box">
                          <view class="gift-item">
                              <view>
                                  <view class="gift-img-box">
                                      <image :src="item.imageUrl"></image>
                                  </view>
                                  <text>{{item.name}}</text>
                              </view>
                              <view class="gift-num">x{{item.productNum}}</view>
                          </view>
                      </view>
                  </view>
              </view>
            </view>
            <view class="goods-list" v-else-if="item.products && item.productNum > 1">
              <view class="goods-item-box">
                  <view class="goods-item">
                    <view class="goods-img-box">
                      <view v-for="(item , index) in item.products" v-if="index < 4" :key="index" class="goods-img" @click.stop="toGoodsDetails" :data-id="item.productId">
                        <image :src="item.imageUrl || state.imagesPath.storeOrderDefaultIcon" mode="widthFix"></image>
                        <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId" :src="state.imagesPath.iconSeckillSeat"></image>
                      </view>
                    </view>
                    <view class="good-num" @click="showGood" :data-idx="goodTypeIndex">
                      共{{item.productNum}}件
                      <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                    </view>
                  </view>
              </view>
            </view>
            <view class="bill-details">
              <view class="balance-accounts">
                  商品小计：
                  <text>￥{{toFix(item.orderAmount)}}</text>
              </view>
            </view>
            <view class="good-type-config-item store-info" v-if="solitaireType !== 'ACTIVITY' && item.business !== 'DISTRIBUTION'">
              <view>配送门店</view>
              <view class="store-details">
                <view>{{item.storeName}}</view>
              </view>
            </view>
            <view class="good-type-config-item section-box dispatching-fee" v-if="item.shipmentType !== 'SELF'">
              <view class="left">运费</view>
              <view v-if="item.shipmentAmount != 0">
                <view>
                  ￥{{item.shipmentAmount}}
                </view>
              </view>
              <view v-else>
                <view>
                  {{item.shipmentAmount == 0 ? '包邮' : ''}}
                </view>
              </view>
            </view>
            <view class="good-type-config-item pay-item" :hidden="item.shipmentType === 'SELF'" v-if="item.deductibleShipmentAmonut && item.deductibleShipmentAmonut > 0">
                <view class="left">运费券</view>
                <view class="right coupon">
                    <view :hidden="item.deductibleShipmentAmonut !== 0 ? false : true">
                        <view class="coupon-amount-box">
                            <text class="coupon-amount">-￥{{toFix(item.deductibleShipmentAmonut)}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="good-type-config-item row">
                <view class="title">备注</view>
                <view class="right">
                    <view class="info">{{item.remarks ? item.remarks : item.remark || '-'}}</view>
                </view>
            </view>
          </view>
        </view>
        <view class="goods-box" v-else>
          <!-- <view class="goods-count" wx:if="{{state.order.type === 'CYCLE'}}"><text wx:if="{{item.cyclePhase}}">第{{item.cyclePhase}}期</text>
                              </view>  -->
            <view class="title-box">
              <image :src="state.imagesPath.storeOrderIcon" v-if="state.storeOrderId" mode="widthFix"></image>
              {{state.order.business == 'SERVICE' ? "服务项目" : "商品信息"}}{{state.order.type === 'CYCLE' && state.options.status !== '付款待自提' && state.goodsList[0].cyclePhase ? '（第' + state.goodsList[0].cyclePhase + '期）' : ''}}
            </view>
            <view class="goods-list" @click="toPennyDetails">
                <view class="goods-item-box" v-for="(item , index) in state.goodsList" :key="index" :hidden="index > 2 && !state.showMore">
                    <view class="goods-item" v-if="!item.giftProduct">
                        <view class="goods-img" @click.stop="toGoodsDetails" :data-id="item.productId">
                            <image :src="item.imageUrl || state.imagesPath.storeOrderDefaultIcon" mode="widthFix"></image>
                            <image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId" :src="state.imagesPath.iconSeckillSeat"></image>
                        </view>
                        <view class="goods-info">
                            <view class="goods-name" @click.stop="toGoodsDetails" :data-id="item.productId">{{state.order.type && state.order.type !== 'CYCLE' ? item.name : state.order.activityName}}</view>
                            <view class="goods-desc gradeImgbox" v-if="state.order.business == 'SERVICE'">
                              <image class="gradeImg" v-if="state.order.serviceStaffGradeImg" mode="heightFix" :src="state.order.serviceStaffGradeImg"></image>
                              {{state.order.serviceStaffNickname}}（服务时长：{{state.order.serviceDuration1 ? state.order.serviceDuration1 + '-' : ''}}{{state.order.serviceDuration}}分钟）
                            </view>
                            <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                                <text v-for="(item , index) in item.list" :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                            </view>
                            <view class="goods-label" v-else-if="item.packagingLabelName">{{item.packagingLabelName}}</view>
                            <view class="goods-desc" v-else-if="state.order.type === 'CYCLE'">{{state.order.products[0].cycleFixedName}}</view>
                            <view class="goods-desc" v-else>{{item.specs}}</view>
                            
                            <view class="goods-desc" v-if="item.deliveryTimeStatement && state.order.type !== 'CYCLE'" style="color: #ff9f43;">
                                {{item.deliveryTimeStatement}}</view>
                            <view class="number-price">
                                <view class="goods-count"><text>x{{item.productNum}}</text>
                                    <text class="refund-num" v-if="item.refundAmount">已退{{item.refundAmount}}</text>
                                    <text class="refund-num" v-if="item.refundedCount">已退{{item.refundedCount}}</text>
                                </view>
                                <!-- <view class="goods-count" wx:if="{{state.order.type === 'CYCLE'}}"><text wx:if="{{item.cyclePhase}}">第{{item.cyclePhase}}期</text>
                              </view> -->
                                <view class="goods-price" v-if="state.order.business === 'SCORE' || state.order.type == 'SCORE_PRICE'">
                                    <text class="nowPrice">{{state.scorePayment ? state.scorePayment + '积分' : ''}}{{state.order.cashTotal && state.order.cashTotal > 0 && toFix(state.order.cashTotal - state.shipmentAmount) > 0 ? '+￥' + toFix(state.order.cashTotal - state.shipmentAmount) + '元' : ''}}</text>
                                </view>
                                <view class="goods-price" v-else>
                                    <text class="nowPrice">￥{{item.price}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="gift-box" v-if="item.giftProduct">
                        <view class="gift-title">赠品:</view>
                        <view class="gift-item-box">
                            <view class="gift-item">
                                <view>
                                    <view class="gift-img-box">
                                        <image :src="item.imageUrl"></image>
                                    </view>
                                    <text>{{item.completeName || item.name}}</text>
                                </view>
                                <view class="gift-num">x{{item.productNum}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="viewMore" @click="viewMore" v-if="state.goodsList.length > 3">
                {{state.showMore ? "点击收起" : "查看更多"}}
                <image :src="state.showMore ? state.imagesPath.iconCollect : state.imagesPath.iconDropDown"></image>
            </view>
            <view class="dividing-line" v-if="state.order.shipmentType === 'EXPRESS' || state.order.shipmentType === 'LOGISTICAL' || state.couponDeductTotal > 0 || state.coupon && state.coupon.price > 0 || cashDeductTotal > 0 || state.order.promotionTotalFee > 0 || state.giftCardAmount > 0 || state.cardPrice > 0">
                <image :src="state.imagesPath.iconDividingline"></image>
            </view>
            <view class="bill-details">
                <view class="bill-details-item" v-if="state.order.shipmentType === 'EXPRESS' || state.order.shipmentType === 'LOGISTICAL'">
                    <view class="title">运费
                        <text :hidden="state.shipmentCouponDiscount == 0">(运费券已减{{state.shipmentCouponDiscount}}元)</text>
                    </view>
                    <view class="amount" style="color:#333">+￥{{filtToFix(state.shipmentAmount - state.shipmentCouponDiscount)}}
                    </view>
                </view>
                <!-- <view class="bill-details-item">
                    <view class="title">积分抵扣</view>
                    <view class="amount">-￥{{state.scoreAmount}}</view>
                </view> -->
                <view class="bill-details-item" :hidden="state.couponDeductTotal > 0 || state.coupon && state.coupon.price > 0 ? false : true">
                    <view class="title">优惠券
                        <view class="coupon-name" v-if="state.coupon.activityName">
                            (
                            <text>{{state.coupon.activityName}}</text> )
                        </view>
                    </view>
                    <!-- - shipmentCouponDiscount 注释优惠券减去运费优惠逻辑 -->
                    <view class="amount" v-if="state.couponDeductTotal && state.couponDeductTotal > 0">-￥{{filtToFix(state.couponDeductTotal ? state.couponDeductTotal - state.shipmentCouponDiscount : 0)}}</view>
                    <view class="amount" v-else>-￥{{filtToFix(state.coupon.price ? state.coupon.price - state.shipmentCouponDiscount : 0)}}</view>
                </view>
                <view class="bill-details-item" :hidden="cashDeductTotal > 0 ? false : true">
                    <view class="title">活动优惠</view>
                    <view class="amount">-￥{{cashDeductTotal}}</view>
                </view>
                <view class="bill-details-item" :hidden="state.order.promotionTotalFee > 0 ? false : true">
                    <view class="title">支付渠道优惠</view>
                    <view class="amount">-￥{{state.order.promotionTotalFee}}</view>
                </view>
                <view class="bill-details-item" :hidden="state.giftCardAmount > 0 ? false : true">
                    <view class="title">礼品卡</view>
                    <view class="amount">-￥{{state.giftCardAmount}}</view>
                </view>
                <view class="bill-details-item" :hidden="state.cardPrice > 0 ? false : true">
                    <view class="title">储值余额</view>
                    <view class="amount">-￥{{state.cardPrice}}</view>
                </view>
            </view>
            <view class="dividing-line">
                <image :src="state.imagesPath.iconDividingline"></image>
            </view>
            <view class="bill-total" v-if="state.balanceEnable">
                <view class="discount-amounts" v-if="deductibleTotal + state.deductibleShipmentAmonut > 0">
                    已优惠￥{{filtToFix(deductibleTotal + state.deductibleShipmentAmonut)}}</view>
                <view class="balance-accounts">
                    {{state.order.type === 'CYCLE' && state.goodsList[0].cyclePhase ? '每期金额：' : '共计：'}}
                    <text>￥{{state.cashTotal}} </text>
                </view>
            </view>
            <view class="bill-total" v-else>
                <view class="discount-amounts"></view>
                <view class="balance-accounts">
                    已付定金:￥{{orderAmount}} 需付尾款:
                    <text>￥{{state.balanceTotal}}</text>
                </view>
            </view>
        </view>
        <view class="order-box" v-if="state.order.type === 'CYCLE'">
          <view class="title">
            <view>配送进度</view>
            <view class="delivery-rt">
              <view class="top">{{state.order.status === '待发货' || state.order.status === '支付失败' || state.order.status === '待付尾款' || state.order.status === '已付款' ? '0' : state.order.childOrder[0].cyclePhase}}/{{state.order.childOrder.length}}次</view>
            </view>
          </view>
          <view class="delivery-list">
            <view class="delivery-list-item" v-for="(item , index) in state.order.childOrder">
              <view class="item-lt">
                <view>第{{item.cyclePhase}}期</view>
                <view>{{item.deliveryTime}} ({{item.weekDay}})</view>
                <view>{{item.cycleTimeName || ''}}</view>
              </view>
              <view class="item-rt edit" @click="doShowUpdateTime" :data-id="item.id" v-if="(item.status === '已付款' || item.status === '待自提' || item.status === '待发货') && state.options.status !== '付款待自提' && !item.dlyThirdSuccess && item.isUpdateDeliveryTime">
                修改时间
                <!-- <picker mode="selector" bindtap="doShowUpdateTime" data-id="{{item.id}}" bindchange="doUpdateTime" value="{{index}}" range="{{state.updateTimeArr}}" range-key="cycleTime">
                </picker> -->
              </view>
              <!-- && (!item.dlyThirdSuccess && item.isUpdateDeliveryTime) -->
              <!-- && !(item.originalStatus == 'CREATED' && item.isReview == 1) -->
              <view class="item-rt edit" @click="cancalRefundCycle" :data-id="item.id" v-else-if="item.status == '退款中'">
                取消退款
              </view>
              <view class="item-rt" v-else-if="state.options.status !== '付款待自提'">
                <view v-if="state.options.status !== '付款待自提'" style="display: inline-block;">
                  {{item.status}}
                </view>
              </view> 
            </view>
          </view>
        </view>
        <view class="order-box" v-if="state.status == '配送中' || state.status == '待配送' || state.status == '待发货'">
            <view class="title">
                <text>配送信息</text>

            </view>
            <!-- <view class='row'  wx:if="{{trackingList.length != '0'}}">
                <text class="color-454545">快递公司：</text>
                <view class="order-code">
                    <text selectable='true'>{{trackingList[0].trackingCom}}</text>
                </view>
            </view> -->
            <view class="row" v-if="trackingList.length != '0'">
                <text class="color-454545">物流信息：</text>
                <view class="order-code">
                    <text selectable="true" :style="'color:' + state.themeColor" @click="toTrackingDetails">查看配送信息</text>
                </view>
            </view>
            <view class="row">
                <text class="color-454545">配送地址：</text>
              <view style="flex: 1 1 auto">
                <view style="font-size: 24rpx;line-height: 35rpx;margin-top: 20rpx;text-align: right">{{state.address}} {{state.memberName}}{{state.mobile}}</view>
                <!-- <view></view> -->
              </view>
            </view>
        </view>
        <view class="invoice-box" v-if="state.showInvoice">
            <view class="title">发票信息</view>
            <view class="row">
                <text class="color-454545">抬头类型：</text>
                <text>{{state.invoice.type === 'PERSONAL' ? '个人或事业单位' : '企业'}}</text>
            </view>
            <view class="row">
                <text class="color-454545">发票抬头：</text>
                <text>{{state.invoice.title}}</text>
            </view>
            <view class="row" v-if="state.invoice.taxNumber">
                <text class="color-454545">税 号：</text>
                <text>{{state.invoice.taxNumber}}</text>
            </view>
        </view>
        <view class="order-box" v-if="state.subOrders && state.subOrders.length > 0">
          <view class="title">金额明细</view>
          <view>
              <view class="pay-item">
                <view class="left">商品总价</view>
                <view class="right">
                    <text>+￥{{toFix(state.order.orderAmount)}}</text>
                </view>
              </view>
              <view class="pay-item" v-if="state.shipmentAmount > 0">
                <view class="left">运费总价</view>
                <view class="right">
                    <text>+￥{{state.shipmentAmount}}</text>
                </view>
              </view>
              <view class="pay-item" v-if="cashDeductTotal > 0">
                  <view class="left">活动优惠</view>
                  <view class="right">
                      <text class="amount-box">-￥{{cashDeductTotal}}</text>
                  </view>
              </view>
              <view class="pay-item" v-if="inputAmount > 0">
                  <view class="left">整单优惠</view>
                  <view class="right">
                      <text class="amount-box">-￥{{inputAmount}}</text>
                  </view>
              </view>
              <view class="pay-item" v-if="state.couponDeductTotal > 0 || state.coupon && state.coupon.price > 0">
                  <view class="left">
                      优惠券
                  </view>
                  <view class="right">
                      <view>
                          <view class="coupon-amount-box">
                              <!-- <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                  lazy-load="false" />
                              <image class="coupon-bg" src="{{state.imagesPath.iconCouponBgRed}}" mode="widthFix"
                                  lazy-load="false" /> -->
                                <view class="coupon-amount" v-if="state.couponDeductTotal && state.couponDeductTotal > 0">-￥{{filtToFix(state.couponDeductTotal ? state.couponDeductTotal - state.shipmentCouponDiscount : 0)}}</view>
                                <view class="coupon-amount" v-else>-￥{{filtToFix(state.coupon.price ? state.coupon.price - state.shipmentCouponDiscount : 0)}}</view>
                          </view>
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
          </view>

          <view class="bill-details1">
              <view class="discount-amounts" v-if="cashDeductTotal + (state.couponDeductTotal ? state.couponDeductTotal : state.coupon ? state.coupon.price : 0) > 0">已优惠￥{{toFix(cashDeductTotal + (state.couponDeductTotal ? state.couponDeductTotal : state.coupon ? state.coupon.price : 0))}}</view>
              <view class="balance-accounts">
                  支付金额：
                  <text>￥{{toFix(state.order.cashTotal)}}</text>
              </view>
          </view>
        </view>
        <view class="order-box">
            <view class="title">
                <text>订单信息</text>

                <view class="callPhone" @click="isOpenCustomerService ? '' : 'callContact'"><button v-if="state.isOpenCustomerService"> 
                        <image :src="kefuIcon" mode="widthFix"></image> 在线客服
                </button></view>
            </view>
            <view class="row" v-if="!sendOrderId">
                <!-- <text class="color-454545">订 单 号：</text> -->
                <text class="color-454545" :decode="true">单&emsp;&emsp;号：</text>
                <view class="order-code">
                    <text selectable="true">{{state.order.id}}</text>
                    <view @click="copyOrderId" :style="'color:' + state.themeColor">复制</view>
                </view>
            </view>
            <view class="row" v-else>
                <!-- <text class="color-454545">订 单 号：</text> -->
                <text class="color-454545" :decode="true">单&emsp;&emsp;号：</text>
                <view class="order-code">
                    <text selectable="true">{{sendOrderId}}</text>
                    <view @click="copyOrderId" :style="'color:' + state.themeColor">复制</view>
                </view>
            </view>
            <view class="row">
                <text class="color-454545">支付方式：</text>
                <text>{{state.payMethodText}}</text>
            </view>
            <view class="row">
                <text class="color-454545">下单时间：</text>
                <text>{{state.order.createTime}}</text>
            </view>
            <view class="row num-express" v-if="state.trackingNumber">
                <text class="color-454545">运单号：</text>
                <view class="tracking-num" :style="'color:' + state.themeColor">
                    <text>{{state.trackingNumber ? state.trackingNumber : '暂无您的快递信息'}}</text>
                    <text v-if="state.trackingNumber" @click="toTrackingDetails">查看详情 ></text>
                </view>
            </view>
            <view class="row refund-row" v-if="state.refundDataList.length > 0">
                <text class="color-454545">累计退款：</text>
                <view class="tracking-num refund-list-line" :style="'color:' + state.themeColor">
                    <text v-if="state.refundTotal">￥{{filtToFix(state.refundTotal)}}</text>
                    <view v-for="(item , index) in state.refundDataList" :key="index" class="refund-list" :data-id="item.id" @click="toAddRefundDetails">
                        <text class="refund-id">{{item.id}}</text>
                        <view class="refund-status gray-color" v-if="item.status === 'FINISHED'">完成退款</view>
                        <!-- 退款 -->
                        <view class="refund-status gray-color" v-if="item.status === 'FAILED'">退款失败</view>
                        <view class="refund-status" v-if="item.status === 'CREATED'">待审核</view>
                        <view class="refund-status gray-color" v-if="item.status === 'RETURNING'">退换货中</view>
                        <view class="refund-status gray-color" v-if="item.status === 'PARTREJECTED'">部分退款</view>
                        <view class="refund-status gray-color" v-if="item.status === 'REJECTED'">已拒绝</view>
                        <view class="refund-status gray-color" v-if="item.status === 'CANCELED'">取消申请</view>
                        <view class="refund-status gray-color" v-if="item.status === 'REFUND_WAITRECEIVER'">商家待收货</view>
                    </view>
                </view>
            </view>
            <!-- <view class='row remarks'>
                <text class="color-454545">订单备注：</text>
                <text class="remarks-info" selectable='true'>{{state.order.remark || ''}}</text>
            </view> -->
        </view>
        
        <view class="store-box" v-if="!(state.order.business === 'DISTRIBUTION' && state.order.shipmentType === 'EXPRESS')">
            <view class="title">门店信息</view>
            <view class="store-row">
                <view class="left">
                    <view class="name">{{state.order.storeName}}</view>
                    <view class="address">{{state.order.storeAddress}}</view>
                </view>
                <view class="right">
                    <view class="address" @click="viewStoreLocation">
                        <image :src="state.imagesPath.iconOrderDetailAddress" mode="widthFix" lazy-load="false"></image>
                    </view>
                    <view class="tel" @click="contactStore">
                        <image :src="state.imagesPath.iconTelephone" mode="widthFix" lazy-load="false"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="share-raffle" v-if="state.canRaffle">
            <image class="share-raffle-img" :src="state.imagesPath.iconLuckdrawShare"></image>
            <button open-type="share" data-shareType="raffle"></button>
        </view>
        <view class="group-share-img-box">
            <canvas canvas-id="groupPictureCanvas">
        </canvas></view>
    </view>
    <view class="mantle" v-if="state.afterShow" @click="showPopu">
        <view class="shouhouBox" :style="!(state.order.status == '配送中' && state.order.shipmentType == 'EXPRESS') ? '' : 'height:297rpx'">
            <text>选择售后类型</text>
            <view class="shouhouBox-active" :style="!(state.order.status == '配送中' && state.order.shipmentType == 'EXPRESS') ? '' : 'height:153rpx'">
                <view v-if="!(state.order.status == '配送中' && state.order.shipmentType == 'EXPRESS')" class="active-a" :data-type="'REFUND'" @click="toRefundPage">
                    <view class="active-one">
                        <image :src="xingIcon"></image><text>我要退款（无需退货）</text>
                    </view>
                    <view class="Noreceived">没收到货，或与卖家协商同意不用退货只退款</view>
                    <view class="arrow">
                        <image style="width: 28rpx;height: 38rpx;" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/arrow.jpg"></image>
                    </view>
                </view>
                <view class="active-a" :data-type="'RETURNS_AND_REFUND'" @click="toRefundPage">
                    <view class="active-one">
                        <image :src="xingIcon2"></image><text>我要退货退款</text>
                    </view>
                    <view class="received">已收到货，需要退还收到的货物</view>
                    <view class="arrow">
                        <image style="width: 28rpx;height: 38rpx;" src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/arrow.jpg"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="barcode-box-backGround" v-if="state.showBigBarcode" @click="handleToSmallBarcode">
        <view class="box">
            <view class="barcode-box">
                <view v-if="state.showBarcode">
                    <canvas id="orderBarcode" type="2d" :style="state.bigBarcode ? '' : 'left: -999999rpx;'">
                    <image :src="state.bigBarcode" v-if="state.barcodeImageUrl"></image>
                </canvas></view>
                <view v-else>
                    <image mode="widthFix" :src="state.imagesPath.iconOrderCode"></image>
                </view>
            </view>
            <text class="code-text" v-if="state.showBarcode">{{state.codeText}}</text>
        </view>
    </view>

    <view class="payment-type" v-if="state.goodDetailShow" @click="changeGoodDetailShow">
      <view class="payment-model" @click.stop="">
        <view class="spec-close-box" @click="changeGoodDetailShow">
            <image :src="state.imagesPath.iconCloseImg" mode="widthFix"></image>
          </view>
        <view class="model-title">商品信息</view>
        <view class="model-body">
          <view class="goods-item-box" v-for="(item , index) in state.subOrders[editActiveIdx].products" :key="index">
            <view class="goods-item" @click.stop="toGoodsDetails" :data-id="item.productId">
                <view class="goods-img">
                    <image :src="item.imageUrl" mode="aspectFit"></image>
                </view>
                <view class="goods-info">
                    <view class="goods-left">
                        <view class="goods-name">{{item.name}}</view>
                        <view class="goods-detail-info" v-if="item.style === 'MEALS2'">
                            <text v-for="(item , index) in item.groupProducts" :key="index">{{item.groupProductCount}}x{{item.productName}}</text>
                        </view>
                        <text class="goods-desc" v-else-if="item.description">{{item.description}}</text>
                        <view v-if="item.require" class="require_label">
                            必选
                        </view>
                        <view class="goods-label" v-else-if="item.labelName">{{item.labelName}}</view>
                        <view class="goods-desc" v-else-if="item.specs">{{item.specs ? item.specs : ''}}</view>
                        <!-- wx:if="{{item.deliveryTimeStatement}}"  -->
                        <view class="goods-desc" style="color: #ff9f43;">
                            {{item.deliveryTimeStatement ? item.deliveryTimeStatement : ''}}</view>
                        <view class="goods-advanceSell-price" v-if="state.subOrders[editActiveIdx].type === 'ADVANCE_SELL'">
                            <!-- {{item.addvanceSellPrice===item.sellPrice ? '预售价' : '定金'}}￥{{item.sellPrice}}</view> -->
                            {{item.addvanceSellPrice === item.sellPrice ? '预售价' : state.subOrders[editActiveIdx].advanceSellInfo.payType === 'FULL' ? '全款' : '定金'}}￥{{item.price}}</view>
                        <!-- <view class='goods-price' wx:if="{{state.orderType === 'CYCLE'}}">
                          <text class="nowPrice"><text>￥</text>{{allPrice}}</text> 
                        </view> -->
                        <view class="goods-price" v-if="state.subOrders[editActiveIdx].type === 'SCORE_PRICE'">
                            <text class="nowPrice"><text></text>{{state.subOrders[editActiveIdx].integral}}</text> 积分
                        </view>
                        <view class="goods-price" v-else-if="state.subOrders[editActiveIdx].type === 'ADVANCE_SELL'"></view>
                        <view class="goods-price" v-else>
                            <text class="nowPrice" style="color: #ff9f43;"><text>￥</text>{{state.subOrders[editActiveIdx].type === 'CYCLE' && !item.giftProduct ? state.subOrders[editActiveIdx].allPrice : item.price}}</text>
                            <text class="oldPrice" v-if="orderDetailGood[item.productId] && item.sellPrice < orderDetailGood[item.productId].price">￥{{orderDetailGood[item.productId].price}}</text>
                        </view>
                    </view>
                    <view class="goods-right">
                        <view class="goods-count">
                            x{{item.productNum}}</view>
                    </view>
                </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <pay :order-data="state.orderData" path="order" :payType="state.payType"></pay>
    <image class="movable-view" v-if="state.homeBack" :src="state.imagesPath.toHome" @click="toHome"></image>

    <popup :show="state.flag" position="bottom" custom-class="bottom" @close="toggleGoodsSpecPopup">
        <view class="popup-content">
            <view class="popup-title">商品信息</view>
            <view class="popup-hd">
                <text>{{state.commodityInfo.trackingCom}} | {{state.commodityInfo.trackingNumber}}</text>
            </view>
            <view class="popup-bd">
                <view v-for="(item , index) in state.commodityInfo.list" :key="idx" class="item">
                    <view class="icon">
                        <image :src="item.imageUrl" mode="widthFix"></image>
                    </view>
                    <view class="textbox">
                        <view class="title">{{item.name}}</view>
                        <view>数量：{{state.order.type === 'CYCLE' ? item.perDeliveryQuantity : item.qty}}件</view>
                    </view>
                </view>
            </view>
        </view>
    </popup>
    <popup :show="detailPopup" position="bottom" custom-class="bottom" @close="toggleGoodsNormalPopup">
      <view class="spec-box">
        <view class="close-text" :style="'color: ' + state.themeColor" @click="toggleGoodsNormalPopup">取消</view>
        <view class="spec-date">
          <view class="hd">选择时间</view>
          <view class="item-spec" v-for="(item , index) in state.updateTimeArr" :data-index="index" :data-id="item.id" @click="doCurrent" :style="state.cycleActive == index ? 'background-color: ' + state.themeColor + ';color:#fff;' : ''">
            {{item.cycleTime}}
          </view>
        </view>
        <view class="spec-button-box">
          <form @submit="doUpdateTime" @click.stop="noop">
            <button form-type="submit" class="spec-button" :style="'background: ' + state.themeColor" data-addtype="detail">确定</button>
          </form>
        </view>
      </view>
    </popup>
    <popup :show="state.showEditTime" position="middle" custom-class="middle" @close="showEditTimeChange">
        <view class="number-modal-body">
            <view class="number-modal-content">
                <view class="title">修改配送时间/备注</view>
                <view class="content">
                  <view class="content-title">配送时间</view>
                  <view @click="getCalculateTime" class="content-config-item">
                      <text>{{storePickupTime}}</text>
                      <image class="right-point" :src="state.imagesPath.iconRight2"></image>
                  </view>
                  <view class="content-title">备注</view>
                  <view class="content-config-item">
                    <textarea name="remark" placeholder="请输入您要备注的信息..." :value="state.editRemark" maxlength="50" @input="handelTextArea"></textarea>
                  </view>
                </view>
                <view class="button-box">
                    <button class="cancel" @click.stop="showEditTimeChange">取消</button>
                    <button class="confirm" :style="'color: ' + theme.color" @click.stop="onConfirm">确定</button>
                </view>
            </view>
        </view>
    </popup>
    <popup :show="state.showTime" position="bottom">
        <time-picker @onClose="onClose" :title="item.type == 'dispatch' ? '配送时间' : '自提时间'" :deliveryTimeData="state.deliveryTimeData" :deliveryTime="state.deliveryTime" @selectTime="selectTime"></time-picker>
    </popup>
  </view>
</template>
<script setup>
import xingIcon from '@/utils/newretail/image/xing.png'
import xingIcon2 from '@/utils/newretail/image/xing2.png'
import kefuIcon from '@/utils/newretail/image/kefu.png'
// import { Data } from "@/libs/mta_analysis";
import _apiOfflineOrderServciceJs from "@/service/api/newretail/offlineOrderService";
import _apiCycleServiceJs from "@/service/api/newretail/cycleService";
// import { login } from "@/service/api/newretail/wxaUserService";
import _utilsSelfJs2 from "@/utils/newretail/self";
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsLogJs from "@/utils/newretail/log";
import _apiSolitaireServiceJs from "@/service/api/newretail/solitaireService";
import _apiInvoiceServiceJs from "@/service/api/newretail/invoiceService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRaffleServiceJs from "@/service/api/newretail/raffleService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
import _apiAdvanceSellServiceJs from "@/service/api/newretail/advanceSellService";
import _apiTeamBuyServiceJs from "@/service/api/newretail/teamBuyService";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import timePicker from "@/pages-sub/newretail/components/timer-picker/index";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import pay from '@/pages-sub/newretail/components/pay/pay.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/orderDetails/orderDetails.js
const orderService = _apiOrderServiceJs;
const request = _apiRequestJs;
;
const wxbarcode = _utilsSelfJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const teamBuyService = _apiTeamBuyServiceJs;
const advanceSellService = _apiAdvanceSellServiceJs;
const pennyService = _apiPennyServiceJs;
const storeService = _apiStoreServiceJs;
const raffleService = _apiRaffleServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const systemService = _apiSystemServiceJs;
const invoiceService = _apiInvoiceServiceJs;
const solitaireService = _apiSolitaireServiceJs;
const log = _utilsLogJs;
const subscribeMessage = _utilsSubscribeMessageJs;
const selfA = _utilsSelfJs2;
const cycleService = _apiCycleServiceJs;
const offlineOrderServcice = _apiOfflineOrderServciceJs;
//获取应用实例
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
const state = reactive({
  refundTotal: 0,
  // 累计退款金额
  editRemark: '',
  showEditTime: false,
  orderDeliveryTimeCanModifyCount: null,
  calculateData: {},
  // 获取订单自提/配送时间 给后端参数
  deliveryTimeData: [],
  // 后端提供的时间数据
  deliveryTime: '',
  // 组件选择的时间数据
  showTime: false,
  shoppingData: {},
  editActiveIdx: 0,
  goodDetailShow: false,
  subOrders: [],
  storeOrderId: null,
  tradeNS: null,
  orderTraceType: null,
  startStatus: '',
  showAll: false,
  trackActiveIndex: 0,
  trackingInfo: {},
  com: '暂无',
  num: '暂无',
  phoneNum: '暂无',
  shipdetails: [],
  distributionPhone: '',
  currentItem: '',
  orderId: '',
  flag: false,
  commodityInfo: {
    list: []
  },
  refundDataList: [],
  cancelFlag: false,
  navigationBarTitle: "订单详情",
  imagesPath: IMGAGESPATH,
  orderId: '',
  status: '',
  memberName: '',
  mobile: '',
  goodsList: [],
  address: '',
  storeName: '',
  storeId: '',
  createTime: '',
  cashTotal: 0,
  remark: '',
  orderStatus: '',
  shipmentType: '',
  codeText: '',
  selfTimeScope: '立即到店',
  shipmentAmount: '0',
  isTeamBuy: false,
  isTeamShare: false,
  countDownList: {},
  teamMemberCount: '',
  joinMemberCount: '',
  teamPeopleCount: 0,
  joinPeopleCount: 0,
  joinMbrs: [],
  leaderImageUrl: '',
  teamMemberImageUrl: '',
  coupon: {
    price: '0',
    activityName: ''
  },
  cardPrice: '0',
  //储值卡金额
  scoreAmount: '0.00',
  //抵扣积分
  giftCardAmount: 0,
  //礼品卡金额
  serviceTel: '',
  canRefund: true,
  isDistribution: false,
  isNextDay: false,
  trackingCom: '',
  trackingNumber: '',
  teamBuyEnd: false,
  teamStatus: 'normal',
  //success 成团  fail 失败 ongoing  进行中 normal 正常的
  orderType: 'normal',
  //normal  advanceSell 预售
  balanceEnable: true,
  balanceTotal: 0.00,
  business: 'RETAIL',
  deductibleShipmentAmonut: 0,
  shipmentCouponDiscount: 0,
  couponDeductTotal: 0,
  payTime: 10,
  payTimeId: 0,
  groupTimeId: 0,
  hasRefund: false,
  order: {},
  payMethodText: '',
  orderData: null,
  // 订单数据 
  payType: "normal",
  // normal,payTail
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  storeInfo: {},
  canRaffle: false,
  raffleId: '',
  raffleType: "LHJ",
  supportPartReturn: true,
  showBarcode: true,
  selfTimeText: '',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  canShowService: false,
  homeBack: false,
  pennyInstance: null,
  prefix: '',
  // 前缀
  isOpenCustomerService: false,
  showBigBarcode: false,
  bigBarcode: '',
  scorePayment: '',
  deliveryTimeStatement: false,
  invoice: '',
  showInvoice: false,
  barCodeTime: '',
  supportInvoice: false,
  advanceSellTime: {},
  showMore: false,
  barcodeImageUrl: "",
  canOneMore: false,
  afterShow: false,
  // 售后弹层显示隐藏
  afteRorderId: '',
  // 订单id
  butFalse: false,
  updateTimeArr: [],
  currentOrderId: '',
  // 当前选择修改时间的订单id
  cycleActive: 0,
  // 当前选择修改时间的下标
  options: ''
});
function parseTimeRange(timeStr) {
  // 定义两种格式的正则表达式
  const format1 = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})-(\d{2}):(\d{2})/; // 2025-09-13 07:00-07:30
  const format2 = /(\d{2})月(\d{2})日(\d{2}):(\d{2})-(\d{2}):(\d{2})/; // 09月12日07:00-07:30
  const format3 = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})~(\d{2}):(\d{2}):(\d{2})$/; // 格式3: YYYY-MM-DD HH:MM:SS~HH:MM:SS

  let match;
  let startTime, endTime;

  // 尝试匹配第一种格式
  if (match = timeStr.match(format1)) {
    const [, year, month, day, startHour, startMin, endHour, endMin] = match;
    startTime = new Date(year, month - 1, day, startHour, startMin);
    endTime = new Date(year, month - 1, day, endHour, endMin);
  } else if (match = timeStr.match(format2)) {
    // 尝试匹配第二种格式
    const [, month, day, startHour, startMin, endHour, endMin] = match;
    // 获取当前时间
    const now = new Date();
    const currentYear = now.getFullYear();
    let editStartTime = new Date(currentYear, month - 1, day, 0, 0);
    if (editStartTime.getTime() < now.getTime() - 86400000) {
      // 判断是否需要年份加1
      currentYear = parseInt(currentYear) + 1;
    }
    startTime = new Date(currentYear, month - 1, day, startHour, startMin);
    endTime = new Date(currentYear, month - 1, day, endHour, endMin);
  } else if (match = timeStr.match(format3)) {
    const [, year, month, day, startHour, startMin, endHour, endMin] = match;
    startTime = new Date(year, month - 1, day, startHour, startMin);
    endTime = new Date(year, month - 1, day, endHour, endMin);
  } else {
    throw new Error('时间格式不支持');
  }

  // 格式化日期为YYYY-MM-DD HH:mm:ss
  function formatDate(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` + `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }
  return {
    startTime: formatDate(startTime),
    endTime: formatDate(endTime)
  };
}
function convertTimeFormat(timeStr) {
  // 处理ISO格式（2025-09-13 07:00-07:30）
  const isoRegex = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}:\d{2})-(\d{2}:\d{2})$/;
  // 处理带秒的格式（2025-09-11 17:00:00~18:00:00）
  const fullRegex = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}:\d{2}:\d{2})~(\d{2}:\d{2}:\d{2})$/;
  // 处理中文格式（09月12日07:00-07:30）
  const zhRegex = /^(\d{2})月(\d{2})日(\d{2}:\d{2})-(\d{2}:\d{2})$/;
  let year, month, day, startTime, endTime;
  if (isoRegex.test(timeStr)) {
    [, year, month, day, startTime, endTime] = timeStr.match(isoRegex);
  } else if (fullRegex.test(timeStr)) {
    [, year, month, day, startTime, endTime] = timeStr.match(fullRegex);
    startTime = startTime.substring(0, 5); // 去掉秒数
    endTime = endTime.substring(0, 5);
  } else if (zhRegex.test(timeStr)) {
    [, month, day, startTime, endTime] = timeStr.match(zhRegex);
    year = new Date().getFullYear(); // 中文格式默认当前年份
  } else {
    throw new Error(`无法识别的时间格式: ${timeStr}`);
  }

  // 统一补零处理
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');
  if (state.selfTimeScope.indexOf('~') > -1) {
    return `${year}-${month}-${day} ${startTime}:00~${year}-${month}-${day} ${endTime}:00`;
  } else {
    return `${year}-${month}-${day} ${startTime}-${endTime}`;
  }
}
function onConfirm() {
  let params = {
    id: state.orderId,
    remark: state.editRemark || '暂无备注~',
    selfTimeScope: convertTimeFormat(state.storePickupTime)
  };
  if (params.selfTimeScope) {
    const result = parseTimeRange(state.storePickupTime);
    params.selfPickBeginTime = result.startTime;
    params.selfPickEndTime = result.endTime;
  }
  orderService.deliveryTimeModify(params).then(res => {
    state.showEditTime = false;
    state.storePickupTime = null;
    state.editRemark = null;
    getOrderDetails();
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function handelTextArea(val) {
  if (val.detail.cursor <= 50) {
    state.editRemark = val.detail.value;
    if (val.detail.cursor == 50) {
      uni.showToast({
        title: '备注信息最多不超过50个字符哦~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '备注信息最多不超过50个字符哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function showEditTimeChange() {
  state.showEditTime = !state.showEditTime;
}
function editTime() {
  state.showEditTime = true;
  state.storePickupTime = state.selfTimeScope;
  state.editRemark = state.order.remark == '暂无备注~' ? '' : state.order.remark;
}
function getCalculateTime() {
  // 获取订单自提/配送时间 给后端参数处理
  state.calculateData.productIds = [];
  state.goodsList.forEach(item => {
    state.calculateData.productIds.push(item.productId);
  });
  state.calculateData.storeId = state.storeId;
  state.calculateData.shipmentType = state.shipmentType;
  state.calculateData = state.calculateData;
  let postData = state.calculateData;
  if (state.calculateData.productIds.length <= 0) {
    return;
  }
  orderService.calculateTime(postData).then(res => {
    state.deliveryTimeData = [];
    if (res && res.timeScopeList) {
      res.timeScopeList.forEach(item => {
        state.deliveryTimeData.push({
          day: item.day,
          timeList: item.time
        });
      });
    }
    state.deliveryTimeData = state.deliveryTimeData;
    state.showTime = true;
  }).catch(err => {
    if (err.code != 1) {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
    state.goodTypeList = state.goodTypeList;
    state.deliveryTimeData = [];
  });
}
function selectTime(e) {
  if (e.detail.deliveryTime && e.detail.deliveryTime !== state.storePickupTime) {
    state.showTime = false;
    state.storePickupTime = e.detail.deliveryTime;
  }
}
function onClose() {
  state.showTime = false;
}
function navToStore() {
  if (!state.storeId) return false;
  storeService.getById(state.storeId).then(res => {
    if (res && res.longitude != null && res.longitude != null) {
      const latitude = parseFloat(res.latitude);
      const longitude = parseFloat(res.longitude);
      uni.openLocation({
        latitude,
        longitude,
        scale: 28,
        name: res.name,
        address: res.address
      });
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: none,
      duration: 2000
    });
  });
}
function getShopCartStyle() {
  let keys = ['storeNameAs', 'distributionNameAs', 'nextDayNameAs', 'orderDeliveryTimeCanModifyCount'];
  systemService.query(keys.join(',')).then(res => {
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
        if (item.key == 'orderDeliveryTimeCanModifyCount') {
          state.orderDeliveryTimeCanModifyCount = item.value;
        } else {
          shoppingConfig[item.key] = item.value;
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
function getCycleTimeDTO(orderId) {
  cycleService.getCycleTimeDTO(orderId).then(res => {
    state.updateTimeArr = res;
  });
}
function doCurrent(e) {
  state.cycleActive = e.currentTarget.dataset.index;
}
function toggleGoodsNormalPopup() {
  state.detailPopup = false;
}
function doShowUpdateTime(e) {
  uni.showLoading();
  let orderId = e.currentTarget.dataset.id;
  state.currentOrderId = e.currentTarget.dataset.id;
  state.detailPopup = true;
  getCycleTimeDTO(orderId);
  uni.hideLoading();
}
function doUpdateTime(e) {
  let params = {
    id: state.currentOrderId,
    deliveryTime: state.updateTimeArr[state.cycleActive].cycleTime + ' 00:00:00'
  };
  let self = this;
  console.log(params, 'params');
  toggleGoodsNormalPopup();
  cycleService.updateOrderTime(params).then(res => {
    uni.showToast({
      title: '修改配送时间成功',
      icon: 'none',
      duration: 2000
    });
    getOrderDetails();
  }).catch(err => {
    if (err.code === 1) {
      uni.showToast({
        title: '门店库存不足~',
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function codeTextPartition(val) {
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  console.log(val, "处理过的编码");
  return val;
}
function handleOrderStatus(status, business) {
  if (status === "CREATED") {
    return "待付款";
  } else if (status === "PAID") {
    return "已付款";
  } else if (status === "SHIPPED") {
    return "配送中";
  } else if (status === "RECEIVED") {
    return "待评价";
  } else if (status === "FINISHED") {
    return "已完成";
  } else if (status === "CANCELED") {
    return "已取消";
  } else if (status === "REJECTED") {
    return "已退款";
  } else if (status === "RETURNING") {
    return "退款中 ";
  } else if (status === "PENDING") {
    return business == "SERVICE" ? "待服务" : "待自提";
  } else if (status === "WAITSHIPPED") {
    return "待发货";
  } else if (status === "WAITPAYBALANCE") {
    return "待付尾款";
  } else if (status === "PARTREJECTED") {
    return "部分退款";
  } else if (status === "PAYFAILED") {
    return "支付失败";
  } else {
    return status;
  }
}
function handleTrackingCompany(com) {
  let trackingCompany = '';
  let tempPhoneNum = '';
  if (com === 'SHUNFENG' || com === '顺丰') {
    trackingCompany = '顺丰', tempPhoneNum = '95338';
  } else if (com === 'SHENTONG' || com === '申通') {
    trackingCompany = '申通', tempPhoneNum = '95543';
  } else if (com === 'YUANTONG' || com === '圆通') {
    trackingCompany = '圆通', tempPhoneNum = '95554';
  } else if (com === 'ZHONGTONG' || com === '中通') {
    trackingCompany = '中通', tempPhoneNum = '95311';
  } else if (com === 'HUITONGKUAIDI' || com === '汇通') {
    trackingCompany = '汇通', tempPhoneNum = '95320';
  } else if (com === 'YUNDA' || com === '韵达') {
    trackingCompany = '韵达', tempPhoneNum = '95546';
  } else if (com === 'ZHAIJISONG' || com === '宅急送') {
    trackingCompany = '宅急送', tempPhoneNum = '400-6789-000';
  } else if (com === 'DEBANGWULIU' || com === '德邦物流') {
    trackingCompany = '德邦物流', tempPhoneNum = '95353';
  } else if (com === 'JD' || com === '京东') {
    trackingCompany = '京东', tempPhoneNum = '950616';
  } else if (com === 'EMS' || com === 'EMS') {
    trackingCompany = 'EMS', tempPhoneNum = '11183';
  } else if (com === 'JTEXPRESS' || com === '极兔') {
    trackingCompany = '极兔', tempPhoneNum = '956025';
  } else if (com === 'YOUZHENGGUONEI' || com === '邮政包裹') {
    trackingCompany = '邮政包裹', tempPhoneNum = '11185';
  } else if (com === 'KUAIFUWU' || com === '快服务') {
    trackingCompany = '快服务', tempPhoneNum = '400-068-0101';
  } else if (com === 'YOUZHENGBK' || com === '邮政标准快递') {
    trackingCompany = '邮政标准快递', tempPhoneNum = '11185';
  } else if (com === 'YOUZHENGDSBK' || com === '邮政电商标快') {
    trackingCompany = '邮政电商标快', tempPhoneNum = '11183';
  } else {
    trackingCompany = '其他', tempPhoneNum = '无';
  }
  return {
    com: trackingCompany,
    phoneNum: tempPhoneNum
  };
}
function getOrderTrackingNumAndCom(orderId) {
  const that = this;
  orderService.getOrderTrackingNumAndCom(orderId).then(res => {
    let tempList = [];
    if (res && res.length > 0) {
      res.forEach((item, index) => {
        let trackingCompanyInfo = handleTrackingCompany(item.trackingCompany);
        console.log(item, 'trackingCompanyInfo');
        let tempData = {
          ...item,
          trackingCom: trackingCompanyInfo.com,
          phoneNum: trackingCompanyInfo.phoneNum,
          shipdetails: [],
          getDataId: item.id,
          id: index
        };
        tempList.push(tempData);
      });
    }
    console.log(tempList, 'tempList');
    state.trackingList = tempList;
    state.currentItem = tempList.length > 0 ? tempList[0].id : '';
    clickShipdetails({
      currentTarget: {
        dataset: {
          id: state.currentItem
        }
      }
    });
  });
}
function addressBox() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/address/addAddressOrder/addAddress?address=' + state.refundAddress.address + '&refundId=' + state.refundId + '&orderid=' + state.orderId
  });
}
function clipBtn(e) {
  let refundAddress = state.refundAddress;
  let json = refundAddress.contact + refundAddress.mobile + refundAddress.address;
  uni.setClipboardData({
    data: json,
    success: function (res) {
      console.log('复制成功', json);
    }
  });
}
function getStoreOrderDetails(tradeId, tradeIdNS) {
  const self = this;
  const postData = {
    // tradeId: 'KJM01-202505150002',
    tradeId,
    tradeIdNS
  };
  // 获取订单详情
  offlineOrderServcice.tradeById(postData).then(res => {
    let orderDetail = {};
    let total = res && res.cashTotal ? res.cashTotal.toFixed(2) : "0.00";
    if (res) {
      orderDetail = {
        ...res,
        xid: res.xid || res.id || res.tradeNo,
        id: res.xid || res.id || res.tradeNo,
        status: res.status == 'REJECTED' ? '已退款' : '已完成',
        total: total,
        count: 0
      };
    }
    orderDetail.deliveryTimeModifyCount = orderDetail.deliveryTimeModifyCount || 0;
    orderDetail.products.forEach(item => {
      item.price = item.stdAmount ? item.stdAmount - (item.discountAmount || 0) : item.price;
    });
    state.order = orderDetail;
    state.orderId = orderDetail.id;
    state.storeName = orderDetail.storeName;
    state.storeId = orderDetail.storeId;
    state.goodsList = orderDetail.products;
    state.createTime = orderDetail.createTime;
    state.cashTotal = orderDetail.total;
    state.orderAmount = orderDetail.total;
    state.cashDeductTotal = orderDetail.total;
    state.remark = orderDetail.remark || '';
    state.orderStatus = orderDetail.status;
    state.selfTimeScope = orderDetail.selfTimeScope ? orderDetail.selfTimeScope : '';
    state.shipmentType = orderDetail.shipmentType;
    state.shipmentAmount = orderDetail.shipmentAmount;
    state.teamId = orderDetail.teamId ? orderDetail.teamId : '';
    state.teamLeaderRecordId = orderDetail.teamLeaderRecordId ? orderDetail.teamLeaderRecordId : '';
    state.advanceId = orderDetail.advanceId ? orderDetail.advanceId : '';
    state.hasRefund = orderDetail.hasRefund;
    state.couponDeductTotal = orderDetail.couponDeductTotal ? orderDetail.couponDeductTotal : 0;
    state.shipmentCouponDiscount = orderDetail.deductibleShipmentAmonut ? orderDetail.deductibleShipmentAmonut : 0;
    state.business = orderDetail.business;
    state.memberName = orderDetail.memberName ? orderDetail.memberName : '';
    state.mobile = orderDetail.receiverMobile;
    state.addorderDetails = (orderDetail.province || '') + (orderDetail.city || '') + (orderDetail.district || '') + orderDetail.addorderDetails;
    state.cashDeductTotal = orderDetail.cashDeductTotal;
    state.canRefund = orderDetail.canRefund;
    state.sendOrderId = orderDetail.sendOrderId;
    state.deductibleShipmentAmonut = orderDetail.deductibleShipmentAmonut;
    state.storeAddorderDetails = orderDetail.storeAddorderDetails;
    state.shipmentType = orderDetail.shipmentType;
    state.canOneMore = orderDetail.canOneMore;
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getOrderDetails(refundFn) {
  console.log('this.options', options);
  let orderId = options.orderId;
  let self = this;
  let status = options.status;
  state.status = status;
  let orderfrom = options.orderFrom ? options.orderFrom : null;
  let orderType = options.orderType ? options.orderType : null;
  console.log('status,orderfrom', status, orderfrom);
  if (status == '待付款' || orderfrom || status == '付款待自提' || !status) {
    let fnName = orderType == 'MIXED' ? 'getMixedcateringDetailsById' : 'getDetailsById';
    // if (status == '待付款' || orderfrom || status == '付款待自提' || !status) {
    orderService[fnName](orderId).then(res => {
      let oldRes = {
        ...res
      };
      if (res.type == 'MIXED' && fnName != 'getMixedcateringDetailsById') {
        // 如果是混单进入详情重新调用
        options.orderType = 'MIXED';
        getOrderDetails(refundFn);
        return false;
      } else if (orderType == 'MIXED' && fnName == 'getMixedcateringDetailsById') {
        res = {
          ...oldRes.mainOrder
        };
        if (oldRes.subOrders && oldRes.subOrders.length > 0) {
          oldRes.subOrders.forEach(item => {
            let productNum = 0;
            if (item.products && item.products.length > 0) {
              item.products.forEach(goods => {
                productNum += parseInt(goods.productNum);
              });
            }
            item.productNum = productNum;
          });
        }
        state.subOrders = oldRes.subOrders || [];
      }
      if (res) {
        if (state.startStatus && state.startStatus != res.status) {
          if (refundFn) {
            state.status = handleOrderStatus(res.status, res.business);
            refundFn(false, state.status);
          }
          uni.showToast({
            title: '订单状态已变更',
            icon: 'none',
            duration: 2000
          });
        } else {
          if (refundFn) {
            state.status = handleOrderStatus(res.status, res.business);
            refundFn(true, state.status);
          }
        }
        state.startStatus = res.status;
        let orderCanRefund = true;
        let itemStatus = res.status;
        let cashTotal = res.cashTotal ? res.cashTotal.toFixed(2) : "0.00";
        let orderAmount = res.orderAmount ? res.orderAmount.toFixed(2) : "0.00";
        // 处理预售订单付完全款
        if (res.business == "ADVANCE_SELL" && res.status == "WAITPAYBALANCE") {
          getAdvanceSellActivityById(res.advanceId, res.products[0].productId);
          if ((res.balanceTotal || res.balanceTotal === 0) && res.balanceTotal != null) {
            // 业态为预售且状态不是待付尾款
            cashTotal = (parseFloat(cashTotal) + res.balanceTotal).toFixed(2);
            orderAmount = (parseFloat(orderAmount) + res.balanceTotal).toFixed(2);
          }
          if (res.shipmentType === "SELF" && res.selfTimeScope) {
            let now = new util.ResponseDate().getTime();
            // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
            let reg = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
            if (reg.test(res.selfTimeScope)) {
              let timeScope = res.selfTimeScope;
              let timeArr = timeScope.split("~");
              let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                // 已过自提时间不能退款
                orderCanRefund = false;
              }
            }
          }
        }
        res.payments.forEach(el => {
          if (el.payMethod === 'SCOREPAY') {
            state.scorePayment = el.score;
          }
        });
        let shipmentCouponDiscount = 0;
        if (res.payments) {
          res.payments.forEach(i => {
            if (i.payMethod === "COUPONPAY" && i.total !== res.deductibleShipmentAmonut && i.status !== "CREATE" && (!i.couponFunction || i.couponFunction !== "FREESHIP")) {
              state.coupon = {
                price: i.total,
                activityName: i.couponActivityName
              };
            } else if (i.payMethod === "COUPONPAY" && i.couponFunction === "FREESHIP" && i.status !== "CREATE") {
              state.shipmentCouponDiscount = i.total;
              shipmentCouponDiscount = i.total;
            } else if (i.payMethod === "CARDPAY") {
              state.cardPrice = res.cardDeductTotal;
            } else if (i.payMethod === 'SCOREPAY') {
              console.log(i.total, 'i.total');
              state.scoreAmount = i.total;
              state.scorePayment = i.score;
            } else if (i.payMethod === 'GIFTCARDPAY') {
              state.giftCardAmount = i.total;
            }
          });
        }
        // 计算支付渠道优惠金额
        if (res.promotionTotalFee) {
          cashTotal = Number(cashTotal) - Number(res.promotionTotalFee) > 0 ? (Number(cashTotal) - Number(res.promotionTotalFee)).toFixed(2) : "0.00";
        }
        if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && res.balanceTotal) {
          cashTotal = Number(cashTotal) + parseFloat(res.balanceTotal);
          cashTotal = cashTotal.toFixed(2);
        }
        // 重新计算运费显示
        let shipmentAmount = res.shipmentAmount;
        let deductibleShipmentAmonut = res.deductibleShipmentAmonut ? (res.deductibleShipmentAmonut + parseFloat(shipmentCouponDiscount)).toFixed(2) : 0;
        if (deductibleShipmentAmonut === 0 && parseFloat(shipmentCouponDiscount) > 0) {
          deductibleShipmentAmonut = parseFloat(shipmentCouponDiscount).toFixed(2);
        }
        // 如果是组合商品
        // if(res.style === 'MEALS2') {
        //     orderService.getDetailsByIdMEALS2(orderId).then(resData => {

        //     })
        // }
        //刘杰伟注释版本
        //   console.log('有咩有进入到这里')
        //   shipmentAmount = parseFloat((parseFloat(shipmentAmount) - parseFloat(res.deductibleShipmentAmonut) - parseFloat(shipmentCouponDiscount)).toFixed(2)) // 显示的运费为实付运费加上运费券抵扣的运费
        //   shipmentAmount = shipmentAmount > 0 ? shipmentAmount.toFixed(2) : "0.00"
        let tempData = {
          ...res,
          status: handleOrderStatus(res.status, res.business),
          cashTotal: cashTotal,
          orderAmount: orderAmount,
          orderCanRefund: orderCanRefund,
          shipmentAmount: shipmentAmount
        };
        if (tempData.type && tempData.type === 'CYCLE' && res.childOrder && res.childOrder.length > 0) {
          tempData.childOrder.forEach(val => {
            val.originalStatus = val.status;
            if (val.canRefund === false && val.status !== 'REJECTED') {
              val.status = "退款中";
            } else {
              val.status = handleOrderStatus(val.status);
            }
            // 获取日期部分
            const formattedDate = val.deliveryTime.split(' ')[0];
            val.deliveryTime = formattedDate;
          });
        }
        if (res.type === "SOLITAIRE") {
          if (res.solitaireRecordStatus === "NORMAL") {
            tempData.status = "接龙中";
          } else if (res.type === "SOLITAIRE" && (tempData.status === "退款中" || tempData.status === "已退款")) {
            tempData.status = "接龙失败，" + tempData.status;
          } else if (res.solitaireRecordStatus === "REFUND") {
            tempData.status = "接龙失败，已退款";
          }
        }
        let storeInfo = null;
        try {
          let allStores = uni.getStorageSync('wj_allStores');
          if (allStores && allStores.length > 0) {
            for (let i = 0; i < allStores.length; i++) {
              const item = allStores[i];
              if (item.id == res.storeId) {
                storeInfo = item;
                break;
              }
            }
            if (storeInfo) {
              state.storeInfo = storeInfo;
            }
          }
        } catch (e) {
          console.log(e);
        }
        // 处理购物抽奖订单显示联系客服
        if (res.type === "PENNY" && (res.status === "WAITSHIPPED" || res.status === "PENDING") && res.canRefund) {
          getPennyInfo(res);
        }
        getStoreById(res.storeId);
        let tempProducts = [];
        res.products.forEach(item => {
          item.completeName = item.name;
          // 处理多规格商品规格
          let nameArr = item.name ? item.name.split("x") : [];
          let specs = '';
          let name = item.name || "";
          if (nameArr.length > 0) {
            nameArr.forEach((item, i) => {
              if (i === 0) {
                name = item;
              } else {
                specs = specs + item + ';';
              }
            });
          }
          let price = item.price ? item.price.toFixed(2) : 0;
          // 处理预售订单付完全款
          if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && item.balanceTotal && item.balanceTotal != null) {
            // 业态为预售且状态不是待付尾款
            price = parseFloat(price).toFixed(2);
          }
          let tempItem = {
            ...item,
            name: name,
            price: price,
            specs: specs,
            refundAmount: 0 // 该商品退款数量
          };
          if (app.globalData.systemConfigure.fictitiousProductId && item.productId === app.globalData.systemConfigure.fictitiousProductId) {
            // 虚拟商品
            tempItem.name = "无码商品";
            tempItem.imageUrl = state.imagesPath.iconOffLine;
          }
          tempProducts.push(tempItem);
          if (item.deliveryTimeStatement) {
            state.deliveryTimeStatement = true;
          }
        });
        let canOneMore = true;
        if (res.type === "TEAMBUING" || res.type === "ADVANCE_SELL" || res.type === "SCORE_PRICE" || res.type === "BARGIN" || res.type === "OFFLINE" || res.type === "PENNY") {
          canOneMore = false;
        }
        console.log(tempProducts, "itema");

        // tempProducts.forEach(itema => {
        //     selfA.getTemporaryUrl(itema.imageUrl)
        //         .then(res => {
        //             // itema.imageUrl = res
        //             itema.url1 = res
        //             console.log(itema, "itema");
        //             this.setData({
        //                 goodsList: tempProducts
        //             })
        //         })
        // })
        tempData.deliveryTimeModifyCount = tempData.deliveryTimeModifyCount || 0;
        if (tempData.type == 'SERVICE' && tempData.selfPickBeginTime && tempData.selfPickEndTime) {
          tempData.serviceDuration = (new Date(tempData.selfPickEndTime.replace(/-/g, '/')).getTime() - new Date(tempData.selfPickBeginTime.replace(/-/g, '/')).getTime()) / (1000 * 60);
          tempData.serviceDuration1 = tempData.serviceDuration ? parseInt(tempData.serviceDuration / 2) : '';
        }
        state.order = tempData;
        state.orderId = res.id;
        state.business = res.business;
        state.memberName = res.memberName ? res.memberName : '';
        state.mobile = res.receiverMobile;
        state.address = (res.province || '') + (res.city || '') + (res.district || '') + res.address;
        state.storeName = res.storeName;
        state.storeId = res.storeId;
        state.goodsList = tempProducts;
        state.createTime = res.createTime;
        state.cashTotal = cashTotal;
        state.orderAmount = orderAmount;
        state.cashDeductTotal = res.cashDeductTotal;
        state.canRefund = res.canRefund;
        state.remark = res.remark;
        state.orderStatus = handleOrderStatus(itemStatus, res.business);
        state.deductibleShipmentAmonut = deductibleShipmentAmonut;
        state.storeAddress = res.storeAddress;
        state.selfTimeScope = res.selfTimeScope ? res.selfTimeScope : '';
        state.shipmentType = res.shipmentType;
        state.shipmentAmount = shipmentAmount;
        state.teamId = res.teamId ? res.teamId : '';
        state.teamLeaderRecordId = res.teamLeaderRecordId ? res.teamLeaderRecordId : '';
        state.advanceId = res.advanceId ? res.advanceId : '';
        state.hasRefund = res.hasRefund;
        state.canOneMore = canOneMore;
        state.couponDeductTotal = res.couponDeductTotal ? res.couponDeductTotal : 0;
        state.shipmentCouponDiscount = res.deductibleShipmentAmonut ? res.deductibleShipmentAmonut : 0;
        if (tempData.payments) {
          let text1 = '';
          tempData.payments.forEach((item1, index1) => {
            text1 += (index1 != 0 ? ';' : '') + filtPayMethod(item1.payMethod);
          });
          state.payMethodText = text1;
        }

        // let productPicturesa = self.data.goodsList
        // console.log(productPicturesa, "itema");
        // productPicturesa.forEach(itema => {
        //     selfA.getTemporaryUrl(itema.imageUrl)
        //         .then(res => {
        //             // itema.imageUrl = res
        //             itema.url1 = res
        //             console.log(itema, "itema");
        //             self.setData({
        //                 goodsList: productPicturesa
        //             })
        //         })
        // })
        // 付款倒计时
        if (res.status === 'CREATED') {
          if (!queryAgain) {
            getAutoCancelPeriod(res.createTime);
          } else {
            // 标记为已作废
            state.order.status = "已取消";
          }
        }
        if (res.trackingCom && res.trackingNumber) {
          state.trackingCom = res.trackingCom;
          state.trackingNumber = res.trackingNumber;
        }
        // 生成自提码
        if (res.shipmentType === "SELF" && res.ladingCode != '' && res.ladingCode != null) {
          // 排除团购情况和接龙
          if (!(itemStatus === "PENDING" && res.teamId != '' && res.teamId != null && res.canRefund) && res.type !== "SOLITAIRE") {
            // 自提订单根据自提时间显示
            const orderHiddenLadingCode = app.globalData.systemConfigure.orderHiddenLadingCode;
            if (orderHiddenLadingCode) {
              let now = new util.ResponseDate().getTime();
              // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
              // 正则自提校验时间格式2  2018-12-20
              // 正则自提校验时间格式3  2018-11-07 09:21-12:00
              let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
              let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
              let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
              if (reg1.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split("~");
                let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg2.test(res.selfTimeScope)) {
                // 默认显示当前的自提时间
                let oldTime = res.selfTimeScope + " 00:00:00";
                let selfStartTime = new Date(oldTime.replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg3.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split(" ");
                let timeArray = timeArr[1].split("-");
                let time = timeArr[0] + " " + timeArray[0] + "00";
                let selfStartTime = new Date(time.replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else {
                getBarcodeCode(state.prefix + res.ladingCode);
              }
            } else {
              // 不隐藏普通订单自提码
              getBarcodeCode(state.prefix + res.ladingCode);
            }
          }
        }
        // 处理自提时间
        if ((res.shipmentType === "SELF" || res.shipmentType === "EXPRESS") && res.type !== "SOLITAIRE") {
          // 自提时间处理
          // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
          // 正则自提校验时间格式2  2018-12-20
          // 正则自提校验时间格式3  2018-11-07 09:21-12:00
          let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
          let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
          let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
          if (reg1.test(res.selfTimeScope)) {
            let timeScope = res.selfTimeScope;
            let timeArr = timeScope.split("~");
            let startArray = timeArr[0].split(" ");
            let endArray = timeArr[1].split(" ");
            let daysArr = startArray[0].split("-");
            let daysArrEnd = endArray[0].split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
            let selfTime = startArray[1].slice(0, 5) + '-' + endArray[1].slice(0, 5);
            let orderSelfTime = '';
            if (startDate == endDate) {
              if (res.teamId != '' && res.teamId != null) {
                // 拼团
                orderSelfTime = '自提时间：' + startDate + selfTime;
              } else {
                orderSelfTime = startDate + selfTime;
              }
            } else {
              // 日期不同一定是拼团
              if (res.teamId != '' && res.teamId != null) {
                // 拼团
                // + endDate + ' '
                orderSelfTime = '自提时间：' + startDate + '-' + selfTime;
              } else {
                // 可能是预售
                // + endDate + ' '
                orderSelfTime = startDate + '-' + selfTime;
              }
            }
            state.selfTimeScope = orderSelfTime;
          } else if (reg2.test(res.selfTimeScope)) {
            // 默认显示当前的自提时间
            let oldTime = res.selfTimeScope;
            let daysArr = oldTime.split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let orderSelfTime = '自提时间：' + startDate + ' ';
            if (state.storeInfo && state.storeInfo.storeHours) {
              orderSelfTime = orderSelfTime + state.storeInfo.storeHours;
            }
            console.log(orderSelfTime);
            state.selfTimeScope = orderSelfTime;
          } else if (reg3.test(res.selfTimeScope)) {
            let timeScope = res.selfTimeScope;
            let timeArr = timeScope.split(" ");
            let daysArr = timeArr[0].split("-");
            let timeArray = timeArr[1].split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let selfTime = timeArray[0].slice(0, 5) + '-' + timeArray[1].slice(0, 5);
            let orderSelfTime = '';
            if (res.teamId != '' && res.teamId != null) {
              // 所有拼团情况
              orderSelfTime = '自提时间：' + startDate + selfTime;
            } else {
              orderSelfTime = startDate + selfTime;
            }
            state.selfTimeScope = orderSelfTime;
          } else {}
        }
        // 拼团
        if (res.teamId != '' && res.teamId != null) {
          if ((itemStatus === "PAID" || itemStatus === "WAITSHIPPED") && res.canRefund) {
            // 处理待拼团状态
            if (state.teamLeaderRecordId) {
              state.isTeamBuy = true;
              state.order.status = "待拼团";
              state.isTeamShare = true;
            }
            getTeamBuyingInfo();
          } else if (itemStatus === "PENDING") {
            getTeamBuyingInfo();
          }
        }

        // 接龙
        if (res.type === "SOLITAIRE") {
          if ((itemStatus === "PAID" || itemStatus === "WAITSHIPPED") && res.canRefund) {
            getSolitaireInfo(res.storeId);
          } else if (itemStatus === "PENDING") {
            getSolitaireInfo(res.storeId);
          }
        }
        if (res.canRefund === false && itemStatus !== 'REJECTED' && itemStatus !== 'PAYFAILED' && itemStatus !== 'CREATE') {
          if (res.type === "SOLITAIRE") {
            state.orderStatus = "接龙失败，退款中";
            state.order.status = '接龙失败，退款中';
          } else {
            state.isTeamBuy = false;
            state.orderStatus = "退款中";
            state.order.status = '退款中';
            state.isTeamShare = false;
          }
        }
        // 统配
        let distributionStore = [];
        // 次日达
        let nextDayStore = [];
        try {
          let storeData = uni.getStorageSync('wj_distributionStore');
          let nextDayStoreData = uni.getStorageSync('wj_nextDayStore');
          if (storeData) {
            distributionStore.push(storeData);
          }
          if (nextDayStoreData) {
            nextDayStore.push(nextDayStoreData);
          }
          distributionStore.forEach(item => {
            if (state.storeId === item.id) {
              state.isDistribution = true;
            }
          });
          nextDayStoreData.forEach(item => {
            if (state.storeId === item.id) {
              state.isNextDay = true;
            }
          });
        } catch (e) {}
        // 预售
        if (res.advanceId && itemStatus === 'WAITPAYBALANCE') {
          console.log('是不是进入到这里？？', res.balanceEnable);
          state.balanceEnable = res.balanceEnable;
          state.balanceTotal = res.balanceTotal ? res.balanceTotal : '';
        }
        // 分享抽券
        if (res.status !== 'CREATED' && res.status !== 'CANCELED' && res.status !== 'REJECTED') {
          getRaffleStatus(res, self);
        }
      }
      if (state.onLoad) {
        state.onLoad = false;
      }
      // 查询订单关联的退款单
      getByOrder(orderId);
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    orderService.getDetailsByIdV2(orderId, true).then(res => {
      if (res) {
        state.status = handleOrderStatus(res.status, res.business);
        if (state.startStatus && state.startStatus != res.status) {
          if (refundFn) {
            state.status = handleOrderStatus(res.status, res.business);
            refundFn(false, state.status);
          }
          uni.showToast({
            title: '订单状态已变更',
            icon: 'none',
            duration: 2000
          });
        } else {
          if (refundFn) {
            state.status = handleOrderStatus(res.status, res.business);
            refundFn(true, state.status);
          }
        }
        state.startStatus = res.status;
        let orderCanRefund = true;
        let itemStatus = res.status;
        let cashTotal = res.cashTotal ? res.cashTotal.toFixed(2) : "0.00";
        let orderAmount = res.orderAmount ? res.orderAmount.toFixed(2) : "0.00";
        // 处理预售订单付完全款
        if (res.business == "ADVANCE_SELL" && res.status == "WAITPAYBALANCE") {
          getAdvanceSellActivityById(res.advanceId, res.products[0].productId);
          if ((res.balanceTotal || res.balanceTotal === 0) && res.balanceTotal != null) {
            // 业态为预售且状态不是待付尾款
            cashTotal = (parseFloat(cashTotal) + res.balanceTotal).toFixed(2);
            orderAmount = (parseFloat(orderAmount) + res.balanceTotal).toFixed(2);
          }
          if (res.shipmentType === "SELF" && res.selfTimeScope) {
            let now = new util.ResponseDate().getTime();
            // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
            let reg = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
            if (reg.test(res.selfTimeScope)) {
              let timeScope = res.selfTimeScope;
              let timeArr = timeScope.split("~");
              let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
              if (now >= selfStartTime) {
                // 已过自提时间不能退款
                orderCanRefund = false;
              }
            }
          }
        }
        res.payments.forEach(el => {
          if (el.payMethod === 'SCOREPAY') {
            state.scorePayment = el.score;
          }
        });
        let shipmentCouponDiscount = 0;
        if (res.payments) {
          res.payments.forEach(i => {
            if (i.payMethod === "COUPONPAY" && i.total !== res.deductibleShipmentAmonut && i.status !== "CREATE" && (!i.couponFunction || i.couponFunction !== "FREESHIP")) {
              state.coupon = {
                price: i.total,
                activityName: i.couponActivityName
              };
            } else if (i.payMethod === "COUPONPAY" && i.couponFunction === "FREESHIP" && i.status !== "CREATE") {
              //   console.log('是不是在这里')
              // self.setData({
              //   shipmentCouponDiscount: i.total
              // })
              // shipmentCouponDiscount = i.total
            } else if (i.payMethod === "CARDPAY") {
              state.cardPrice = res.cardDeductTotal;
            } else if (i.payMethod === 'SCOREPAY') {
              state.scoreAmount = i.total;
              state.scorePayment = i.score;
            } else if (i.payMethod === 'GIFTCARDPAY') {
              state.giftCardAmount = i.total;
            }
          });
        }
        // 计算支付渠道优惠金额
        if (res.promotionTotalFee) {
          cashTotal = Number(cashTotal) - Number(res.promotionTotalFee) > 0 ? (Number(cashTotal) - Number(res.promotionTotalFee)).toFixed(2) : "0.00";
        }
        if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && res.balanceTotal) {
          cashTotal = Number(cashTotal) + parseFloat(res.balanceTotal);
          cashTotal = cashTotal.toFixed(2);
        }
        // 重新计算运费显示
        let shipmentAmount = res.shipmentAmount;
        let deductibleShipmentAmonut = res.deductibleShipmentAmonut ? (res.deductibleShipmentAmonut + parseFloat(shipmentCouponDiscount)).toFixed(2) : 0;
        if (deductibleShipmentAmonut === 0 && parseFloat(shipmentCouponDiscount) > 0) {
          deductibleShipmentAmonut = parseFloat(shipmentCouponDiscount).toFixed(2);
        }
        //刘杰伟注释版本
        //   shipmentAmount = parseFloat((parseFloat(shipmentAmount) - parseFloat(res.deductibleShipmentAmonut) - parseFloat(shipmentCouponDiscount)).toFixed(2)) // 显示的运费为实付运费加上运费券抵扣的运费
        //   shipmentAmount = shipmentAmount > 0 ? shipmentAmount.toFixed(2) : "0.00"
        let tempData = {
          ...res,
          status: handleOrderStatus(res.status, res.business),
          cashTotal: cashTotal,
          orderAmount: orderAmount,
          orderCanRefund: orderCanRefund,
          shipmentAmount: shipmentAmount
        };
        if (tempData.type && tempData.type === 'CYCLE' && res.childOrder && res.childOrder.length > 0) {
          tempData.childOrder.forEach(val => {
            if (val.canRefund === false && val.status !== 'REJECTED') {
              val.status = "退款中";
            } else {
              val.status = handleOrderStatus(val.status);
            }
            // 获取日期部分
            const formattedDate = val.deliveryTime.split(' ')[0];
            val.deliveryTime = formattedDate;
          });
        }
        if (res.type === "SOLITAIRE") {
          if (res.solitaireRecordStatus === "NORMAL") {
            tempData.status = "接龙中";
          } else if (res.type === "SOLITAIRE" && (tempData.status === "退款中" || tempData.status === "已退款")) {
            tempData.status = "接龙失败，" + tempData.status;
          } else if (res.solitaireRecordStatus === "REFUND") {
            tempData.status = "接龙失败，已退款";
          }
        }
        let storeInfo = null;
        try {
          let allStores = uni.getStorageSync('wj_allStores');
          if (allStores && allStores.length > 0) {
            for (let i = 0; i < allStores.length; i++) {
              const item = allStores[i];
              if (item.id == res.storeId) {
                storeInfo = item;
                break;
              }
            }
            if (storeInfo) {
              state.storeInfo = storeInfo;
            }
          }
        } catch (e) {
          console.log(e);
        }
        // 处理购物抽奖订单显示联系客服
        if (res.type === "PENNY" && (res.status === "WAITSHIPPED" || res.status === "PENDING") && res.canRefund) {
          getPennyInfo(res);
        }
        getStoreById(res.storeId);
        let tempProducts = [];
        res.products.forEach(item => {
          item.completeName = item.name;
          // 处理多规格商品规格
          let nameArr = item.name ? item.name.split("x") : [];
          let specs = '';
          let name = item.name || "";
          if (nameArr.length > 0) {
            nameArr.forEach((item, i) => {
              if (i === 0) {
                name = item;
              } else {
                specs = specs + item + ';';
              }
            });
          }
          let price = item.price ? item.price.toFixed(2) : 0;
          // 处理预售订单付完全款
          if (res.business === "ADVANCE_SELL" && res.status !== "WAITPAYBALANCE" && item.balanceTotal && item.balanceTotal != null) {
            // 业态为预售且状态不是待付尾款
            price = parseFloat(price).toFixed(2);
          }
          let tempItem = {
            ...item,
            name: name,
            price: price,
            specs: specs,
            refundAmount: 0 // 该商品退款数量
          };
          if (app.globalData.systemConfigure.fictitiousProductId && item.productId === app.globalData.systemConfigure.fictitiousProductId) {
            // 虚拟商品
            tempItem.name = "无码商品";
            tempItem.imageUrl = state.imagesPath.iconOffLine;
          }
          tempProducts.push(tempItem);
          if (item.deliveryTimeStatement) {
            state.deliveryTimeStatement = true;
          }
        });
        let canOneMore = true;
        if (res.type === "TEAMBUING" || res.type === "ADVANCE_SELL" || res.type === "SCORE_PRICE" || res.type === "BARGIN" || res.type === "OFFLINE" || res.type === "PENNY") {
          canOneMore = false;
        }
        // tempProducts.forEach(itema => {
        //     selfA.getTemporaryUrl(itema.imageUrl)
        //         .then(res => {
        //             // itema.imageUrl = res
        //             itema.url1 = res
        //             console.log(itema, "itema");
        //             this.setData({
        //                 goodsList: tempProducts
        //             })
        //         })
        // })
        let selfTimeScope = '';
        if (res.selfTimeScope) {
          let timeArr = res.selfTimeScope.split("~");
          let startArray = timeArr[0] ? timeArr[0].split(" ") : [];
          let endArray = timeArr[1] ? timeArr[1].split(" ") : [];
          selfTimeScope = startArray[0] + ' ' + startArray[1] + '~' + endArray[1];
        }
        tempData.deliveryTimeModifyCount = tempData.deliveryTimeModifyCount || 0;
        if (tempData.type == 'SERVICE' && tempData.selfPickBeginTime && tempData.selfPickEndTime) {
          tempData.serviceDuration = (new Date(tempData.selfPickEndTime.replace(/-/g, '/')).getTime() - new Date(tempData.selfPickBeginTime.replace(/-/g, '/')).getTime()) / (1000 * 60);
          tempData.serviceDuration1 = tempData.serviceDuration ? parseInt(tempData.serviceDuration / 2) : '';
        }
        state.order = tempData;
        state.orderId = res.id;
        state.business = res.business;
        state.memberName = res.memberName ? res.memberName : '';
        state.mobile = res.receiverMobile;
        state.goodsList = tempProducts;
        state.address = (res.province || '') + (res.city || '') + (res.district || '') + res.address;
        state.storeName = res.storeName;
        state.storeId = res.storeId;
        state.createTime = res.createTime;
        state.cashTotal = cashTotal;
        state.orderAmount = orderAmount;
        state.cashDeductTotal = res.cashDeductTotal;
        state.canRefund = res.canRefund;
        state.remark = res.remark;
        state.sendOrderId = res.sendOrderId;
        state.orderStatus = handleOrderStatus(itemStatus, res.business);
        state.deductibleShipmentAmonut = deductibleShipmentAmonut;
        state.storeAddress = res.storeAddress;
        state.selfTimeScope = res.selfTimeScope ? selfTimeScope || res.selfTimeScope : '';
        state.shipmentType = res.shipmentType;
        state.shipmentAmount = shipmentAmount;
        state.teamId = res.teamId ? res.teamId : '';
        state.teamLeaderRecordId = res.teamLeaderRecordId ? res.teamLeaderRecordId : '';
        state.advanceId = res.advanceId ? res.advanceId : '';
        state.hasRefund = res.hasRefund;
        state.canOneMore = canOneMore;
        state.couponDeductTotal = res.couponDeductTotal ? res.couponDeductTotal : 0;
        state.shipmentCouponDiscount = res.deductibleShipmentAmonut ? res.deductibleShipmentAmonut : 0;
        if (tempData.payments) {
          let text1 = '';
          tempData.payments.forEach((item1, index1) => {
            text1 += (index1 != 0 ? ';' : '') + filtPayMethod(item1.payMethod);
          });
          state.payMethodText = text1;
        }

        // 付款倒计时
        if (res.status === 'CREATED') {
          if (!queryAgain) {
            getAutoCancelPeriod(res.createTime);
          } else {
            // 标记为已作废
            state.order.status = "已取消";
          }
        }
        if (res.trackingCom && res.trackingNumber) {
          state.trackingCom = res.trackingCom;
          state.trackingNumber = res.trackingNumber;
        }
        // 生成自提码
        if (res.shipmentType === "SELF" && res.ladingCode != '' && res.ladingCode != null) {
          // 排除团购情况和接龙
          if (!(itemStatus === "PENDING" && res.teamId != '' && res.teamId != null && res.canRefund) && res.type !== "SOLITAIRE") {
            // 自提订单根据自提时间显示
            const orderHiddenLadingCode = app.globalData.systemConfigure.orderHiddenLadingCode;
            if (orderHiddenLadingCode) {
              let now = new util.ResponseDate().getTime();
              // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
              // 正则自提校验时间格式2  2018-12-20
              // 正则自提校验时间格式3  2018-11-07 09:21-12:00
              let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
              let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
              let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
              if (reg1.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split("~");
                let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg2.test(res.selfTimeScope)) {
                // 默认显示当前的自提时间
                let oldTime = res.selfTimeScope + " 00:00:00";
                let selfStartTime = new Date(oldTime.replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg3.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split(" ");
                let timeArray = timeArr[1].split("-");
                let time = timeArr[0] + " " + timeArray[0] + "00";
                let selfStartTime = new Date(time.replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  getBarcodeCode(state.prefix + state.order.ladingCode);
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else {
                getBarcodeCode(state.prefix + res.ladingCode);
              }
            } else {
              let now = new util.ResponseDate().getTime();
              // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
              // 正则自提校验时间格式2  2018-12-20
              // 正则自提校验时间格式3  2018-11-07 09:21-12:00
              let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
              let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
              let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
              if (reg1.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split("~");
                let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg2.test(res.selfTimeScope)) {
                // 默认显示当前的自提时间
                let oldTime = res.selfTimeScope + " 00:00:00";
                let selfStartTime = new Date(oldTime.replace(/-/g, '/')).getTime();
                if (now >= selfStartTime) {
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              } else if (reg3.test(res.selfTimeScope)) {
                let timeScope = res.selfTimeScope;
                let timeArr = timeScope.split(" ");
                let timeArray = timeArr[1].split("-");
                let time = timeArr[0] + " " + timeArray[0] + "00";
                let selfStartTime = new Date(time.replace(/-/g, '/')).getTime();
                if (now < selfStartTime) {
                  state.showBarcode = true;
                } else {
                  // 处理不显示自提码时提示
                  state.showBarcode = false;
                }
              }
              // 不隐藏普通订单自提码
              getBarcodeCode(state.prefix + res.ladingCode);
            }
          }
        }
        // 处理自提时间
        if ((res.shipmentType === "SELF" || res.shipmentType === "EXPRESS") && res.type !== "SOLITAIRE") {
          // 自提时间处理
          // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
          // 正则自提校验时间格式2  2018-12-20
          // 正则自提校验时间格式3  2018-11-07 09:21-12:00
          let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
          let reg2 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))$/;
          let reg3 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})\-(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1})$/;
          if (reg1.test(res.selfTimeScope)) {
            let timeScope = res.selfTimeScope;
            let timeArr = timeScope.split("~");
            let startArray = timeArr[0].split(" ");
            let endArray = timeArr[1].split(" ");
            let daysArr = startArray[0].split("-");
            let daysArrEnd = endArray[0].split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
            let selfTime = startArray[1].slice(0, 5) + '-' + endArray[1].slice(0, 5);
            let orderSelfTime = '';
            if (startDate == endDate) {
              if (res.teamId != '' && res.teamId != null) {
                // 拼团
                orderSelfTime = '自提时间：' + startDate + selfTime;
              } else {
                orderSelfTime = startDate + selfTime;
              }
            } else {
              // 日期不同一定是拼团
              if (res.teamId != '' && res.teamId != null) {
                // 拼团
                // + endDate + ' '
                orderSelfTime = '自提时间：' + startDate + '-' + selfTime;
              } else {
                // 可能是预售
                // + endDate + ' '
                orderSelfTime = startDate + '-' + selfTime;
              }
            }
            state.selfTimeScope = orderSelfTime;
          } else if (reg2.test(res.selfTimeScope)) {
            // 默认显示当前的自提时间
            let oldTime = res.selfTimeScope;
            let daysArr = oldTime.split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let orderSelfTime = '自提时间：' + startDate + ' ';
            if (state.storeInfo && state.storeInfo.storeHours) {
              orderSelfTime = orderSelfTime + state.storeInfo.storeHours;
            }
            console.log(orderSelfTime);
            state.selfTimeScope = orderSelfTime;
          } else if (reg3.test(res.selfTimeScope)) {
            let timeScope = res.selfTimeScope;
            let timeArr = timeScope.split(" ");
            let daysArr = timeArr[0].split("-");
            let timeArray = timeArr[1].split("-");
            let startDate = daysArr[1] + '月' + daysArr[2] + '日';
            let selfTime = timeArray[0].slice(0, 5) + '-' + timeArray[1].slice(0, 5);
            let orderSelfTime = '';
            if (res.teamId != '' && res.teamId != null) {
              // 所有拼团情况
              orderSelfTime = '自提时间：' + startDate + selfTime;
            } else {
              orderSelfTime = startDate + selfTime;
            }
            state.selfTimeScope = orderSelfTime;
          } else {}
        }
        // 拼团
        if (res.teamId != '' && res.teamId != null) {
          if ((itemStatus === "PAID" || itemStatus === "WAITSHIPPED") && res.canRefund) {
            // 处理待拼团状态
            if (state.teamLeaderRecordId) {
              state.isTeamBuy = true;
              state.order.status = "待拼团";
              state.isTeamShare = true;
            }
            getTeamBuyingInfo();
          } else if (itemStatus === "PENDING") {
            getTeamBuyingInfo();
          }
        }

        // 接龙
        if (res.type === "SOLITAIRE") {
          if ((itemStatus === "PAID" || itemStatus === "WAITSHIPPED") && res.canRefund) {
            getSolitaireInfo(res.storeId);
          } else if (itemStatus === "PENDING") {
            getSolitaireInfo(res.storeId);
          }
        }
        if (res.canRefund === false && itemStatus !== 'REJECTED' && itemStatus !== 'PAYFAILED' && itemStatus !== 'CREATE') {
          if (res.type === "SOLITAIRE") {
            state.orderStatus = "接龙失败，退款中";
            state.order.status = '接龙失败，退款中';
          } else {
            state.isTeamBuy = false;
            state.orderStatus = "退款中";
            state.order.status = '退款中';
            state.isTeamShare = false;
          }
        }
        // 统配
        let distributionStore = [];
        // 次日达
        let nextDayStore = [];
        try {
          let storeData = uni.getStorageSync('wj_distributionStore');
          let nextDayStoreData = uni.getStorageSync('wj_nextDayStore');
          if (storeData) {
            distributionStore.push(storeData);
          }
          if (nextDayStoreData) {
            nextDayStore.push(nextDayStoreData);
          }
          distributionStore.forEach(item => {
            if (state.storeId === item.id) {
              state.isDistribution = true;
            }
          });
          nextDayStoreData.forEach(item => {
            if (state.storeId === item.id) {
              state.isNextDay = true;
            }
          });
        } catch (e) {}
        // 预售
        if (res.advanceId && itemStatus === 'WAITPAYBALANCE') {
          console.log('是不是进入到这里？？', res.balanceEnable);
          state.balanceEnable = res.balanceEnable;
          state.balanceTotal = res.balanceTotal ? res.balanceTotal : '';
        }
        // 分享抽券
        if (res.status !== 'CREATED' && res.status !== 'CANCELED' && res.status !== 'REJECTED') {
          getRaffleStatus(res, self);
        }
      }
      if (state.onLoad) {
        state.onLoad = false;
      }
      // 查询订单关联的退款单
      getByOrder(orderId);
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function getBarcodeCode(ladingCode) {
  const self = this;
  console.log(ladingCode, "订单编码", ladingCode.indexOf(options.orderId));
  if (!(state.order.status == '待自提' || state.order.status == '待服务' || state.business == 'SCORE' && state.order.status == '已付款')) {
    return;
  }
  if (!(ladingCode.indexOf(options.orderId) >= 0 || state.business == 'SCORE')) {
    return;
  }
  wxbarcode.barcode('orderBarcode', ladingCode, 710, 200);
  console.log("pixelRatio:", app.globalData.systemInfo.pixelRatio, 'ladingCode', ladingCode);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  const barCodeTime = setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 710,
      height: 200,
      destWidth: 710 * pixelRatio,
      destHeight: 200 * pixelRatio,
      canvasId: 'orderBarcode',
      success(res) {
        state.barcodeImageUrl = res.tempFilePath;
      },
      fail(err) {
        // canvasToTempFilePath fail
        const page = util.utilGetCurrentPage();
        if (page && page.route != null && page.route !== "" && page.route === "pages/mallModule/order/orderDetails/orderDetails") {
          state.barcodeImageUrl = "";
          getBarcodeCode(ladingCode);
        } else {
          console.log("不是订单详情页面");
        }
      }
    }, self);
  }, 500);
  state.codeText = codeTextPartition(ladingCode);
  state.barCodeTime = barCodeTime;
}
function getAutoCancelPeriod(createTime) {
  const self = this;
  orderService.getAutoCancelPeriod().then(res => {
    let date = new util.ResponseDate();
    let timeArray = [];
    let createTimeStamp = new Date(createTime.replace(/-/g, '/')).getTime();
    let now = new Date(util.formatTime(date)).getTime();
    if (now < createTimeStamp + parseFloat(res)) {
      // 获取倒计时
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      let tempTime = {
        openTeamTime: createTime,
        duration: res / 1000
      };
      timeArray.push(tempTime);
      countDown();
    } else {
      // 标记为已作废
      state.order.status = "已取消";
    }
    // 执行倒计时函数
    function countDown() {
      clearTimeout(state.payTimeId);
      let hou = util.countDown(timeArray)[0].hou;
      let min = util.countDown(timeArray)[0].min;
      let sec = util.countDown(timeArray)[0].sec;
      let payTime = hou + ":" + min + ':' + sec;
      state.payTime = payTime;
      if (payTime === "00:00:00" && !queryAgain) {
        queryAgain = true;
        clearTimeout(state.payTimeId);
        // self.data.orderId
        getOrderDetails();
      } else {
        let time = setTimeout(function () {
          countDown(timeArray);
        }, 1000);
        state.payTimeId = time;
      }
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getRaffleStatus(order, that) {
  raffleService.getByType('ORDER_RAFFLE').then(res => {
    if (res) {
      if (app.globalData.userInfo) {
        let postData = {
          orderId: that.data.order.id,
          activityId: res.id,
          wxaOpenid: app.globalData.userInfo.wxaUser.openId
        };
        const data = res;
        raffleService.create(postData).then(res => {
          that.setData({
            canRaffle: true,
            raffleId: res,
            raffleActivityId: postData.activityId,
            raffleType: data.raffleType
          });
        }).catch(err => {
          that.setData({
            canRaffle: false
          });
        });
      }
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getTeamBuyingInfo() {
  let self = this;
  let teamId = state.teamId;
  let teamLeaderRecordId = state.teamLeaderRecordId;
  groupSharePictures = null;
  teamBuyService.getById(teamId).then(res => {
    let tempData = {
      ...res
    };
    teamBuyings = {};
    teamBuyings = {
      ...res,
      teamMemberJoinCount: res.teamMemberJoinCount ? res.teamMemberJoinCount : 1
    };
    if (state.shipmentType === 'SELF') {
      // 自提订单才有自提码
      if (res.selfStartTime && res.selfEndTime) {
        // 团购自提开始时间和自提结束时间
        let now = new util.ResponseDate().getTime();
        let selfStartTime = new Date(res.selfStartTime.replace(/-/g, '/')).getTime();
        let selfEndTime = new Date(res.selfEndTime.replace(/-/g, '/')).getTime();
        let startTimeArr = res.selfStartTime.split(" ");
        let endTimeArr = res.selfEndTime.split(" ");
        let daysArrStart = startTimeArr[0].split("-");
        let daysArrEnd = endTimeArr[0].split("-");
        let startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
        let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
        let orderSelfTime = '自提时间：' + startDate + '-' + endDate;
        if (state.storeInfo.storeHours != null) {
          orderSelfTime = orderSelfTime + ' ' + state.storeInfo.storeHours;
        }
        state.selfTimeScope = orderSelfTime;
        if (now >= selfStartTime) {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        } else {
          // 处理不显示自提码时提示
          state.showBarcode = false;
          state.selfTimeText = orderSelfTime;
        }
      } else {
        // 自提订单根据自提时间显示
        let now = new util.ResponseDate().getTime();
        // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
        // 正则自提校验时间格式2  2018-12-20
        // 正则自提校验时间格式3  2018-11-07 09:21-12:00
        let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
        if (reg1.test(state.order.selfTimeScope)) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
          if (now >= selfStartTime) {
            getBarcodeCode(state.prefix + state.order.ladingCode);
          } else {
            // 处理不显示自提码时提示
            state.showBarcode = false;
          }
        } else {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        }

        // 额外处理拼团自提时间
        if (res.selfAfterDay || res.selfAfterDay === 0) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let startArray = timeArr[0].split(" ");
          let daysArr = startArray[0].split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let orderSelfTime = '';
          orderSelfTime = '自提时间：' + startDate + "之后";
          state.selfTimeScope = orderSelfTime;
        }
      }
    }
    return teamBuyService.getRecordsByLeaderId(teamLeaderRecordId);
  }).then(res => {
    const _teamBuyings = teamBuyings;
    let tempJoinMbrs = [];
    if (res.records.length > 0) {
      if (_teamBuyings.teamBuyingType !== 'THOUSAND' && res.leader.mobile !== '匿名') {
        let tempItem = {
          avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1
        };
        tempJoinMbrs.push(tempItem);
      }
      res.records.forEach(item => {
        let tempItem = {
          ...item,
          avatar: item.avatar ? item.avatar : state.imagesPath.userImg1
        };
        if (item.mobile && item.mobile !== res.leader.mobile) {
          tempJoinMbrs.push(tempItem);
        }
      });
    } else {
      if (res.leader.joinMemberCount === _teamBuyings.teamMemberCount) {
        // 处理模拟成团已成团，因为模拟成团可能存在joinMbrs为空
        if (_teamBuyings.teamBuyingType !== 'THOUSAND' && res.leader.mobile != '匿名') {
          let tempItem = {
            ...tempItem,
            avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1
          };
          tempJoinMbrs.push(tempItem);
          let num = res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount;
          for (let i = 0; i < num - 1; i++) {
            let tempItem = {
              ...tempItem,
              avatar: state.imagesPath.userImg1
            };
            tempJoinMbrs.push(tempItem);
          }
        } else {
          let num = res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount;
          for (let i = 0; i < num - 1; i++) {
            let tempItem = {
              ...tempItem,
              avatar: state.imagesPath.userImg1
            };
            tempJoinMbrs.push(tempItem);
          }
        }
      } else {
        if (res.leader.joinMemberCount === 1) {
          let tempItem = {
            avatar: res.leader.avatar ? res.leader.avatar : state.imagesPath.userImg1
          };
          tempJoinMbrs.push(tempItem);
        }
      }
    }
    state.leaderImageUrl = state.imagesPath.userImg1;
    state.teamMemberImageUrl = state.imagesPath.userImg1;
    state.openTeamTime = res.leader.startTime ? res.leader.startTime : res.leader.createTime;
    state.duration = _teamBuyings.duration;
    state.teamMemberCount = _teamBuyings.teamMemberCount;
    state.joinMbrs = tempJoinMbrs;
    state.originalPrice = _teamBuyings.originalPrice ? _teamBuyings.originalPrice : '';
    state.joinMemberCount = res.leader.joinMemberCount ? res.leader.joinMemberCount : 0;
    state.joinPeopleCount = res.leader.joinMemberCount > 12 ? 12 : res.leader.joinMemberCount;
    state.teamPeopleCount = _teamBuyings.teamMemberCount > 12 ? 12 : _teamBuyings.teamMemberCount;
    state.teamBuyingType = _teamBuyings.teamBuyingType;
    state.sharePicture = _teamBuyings.sharePicture ? _teamBuyings.sharePicture : '';
    groupSharePictures = _teamBuyings.sharePicture ? _teamBuyings.sharePicture : '';

    /**
     * 先判断成团
     * 再判断时间
     * teamStatus:'normal', //success 成团  fail 失败 ongoing  进行中 normal 正常的
     */
    if (_teamBuyings.teamMemberCount === res.leader.joinMemberCount) {
      // 已经成团
      state.teamStatus = 'success';
      if (state.order.status === '待拼团') {
        state.order.status = '已成团';
      }
      let joinMemberCount = res.leader.joinMemberCount;
      if (state.joinMbrs.length < joinMemberCount) {
        let tempGroupJoinMbrs = [].concat(state.joinMbrs);
        if (joinMemberCount > 12) {
          joinMemberCount = 12;
        }
        for (let i = 0; i < joinMemberCount - state.joinMbrs.length; i++) {
          tempGroupJoinMbrs.push({
            avatar: state.imagesPath.userImg1
          });
          console.log(i, state.joinMbrs.length);
        }
        state.joinMbrs = tempGroupJoinMbrs;
      }
    } else {
      // 未成团
      let _data = util.getResponseHeaderDate();
      let nowDate = new util.ResponseDate().getTime();
      let openTiem = 0;
      if (state.openTeamTime) {
        openTiem = new Date(state.openTeamTime.replace(/-/g, '/')).getTime();
      } else {
        openTiem = nowDate;
        state.openTeamTime = util.formatTime(_data).replace(/\//g, '-');
      }
      let duration = (nowDate - openTiem) / 1000;
      if (duration >= state.duration) {
        state.teamBuyEnd = true;
        state.teamStatus = 'fail';
      } else {
        if (state.teamBuyEnd === false) {
          // 获取倒计时
          let teamBuyTimeInfo = [];
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          let tempTime = {
            openTeamTime: state.openTeamTime,
            duration: state.duration
          };
          teamBuyTimeInfo.push(tempTime);
          state.teamBuyTimeList = teamBuyTimeInfo;
          countDown();
          // 执行倒计时函数
          function countDown() {
            clearTimeout(state.groupTimeId);
            state.countDownList = util.countDown(teamBuyTimeInfo)[0];
            if (state.countDownList.hou == '00' && state.countDownList.min == '00' && state.countDownList.sec == '00') {
              getTeamBuyingInfo();
            } else {
              let time = setTimeout(function () {
                countDown(teamBuyTimeInfo);
              }, 1000);
              state.groupTimeId = time;
            }
          }
          // 生成拼团商品分享图
          if (_teamBuyings.sharePicture == null || _teamBuyings.sharePicture == '') {
            let groupNumber = util.numberConversion.numberToChinese(_teamBuyings.teamMemberCount);
            let group = {
              number: groupNumber,
              // soldCount: self.data.soldCount,
              price: _teamBuyings.teamMemberPrice,
              // originalPrice: self.data.sellPrice,
              time: state.countDownList,
              status: _teamBuyings.status
            };
            util.createGroupSharePictures(state.goodsList[0].imageUrl, group).then(picture => {
              if (groupSharePictures == null || groupSharePictures == '') {
                groupSharePictures = picture.data;
              }
            }).catch(err => {
              console.log(err);
            });
          }
        } else {
          uni.showToast({
            title: '当前团购活动已过期...',
            icon: 'none',
            duration: 1000
          });
        }
      }
    }
  }).catch(err => {
    console.log(err.message);
  });
}
function getSolitaireInfo(storeId) {
  let self = this;
  let solitaireId = state.order.solitaireId;
  solitaireService.getById(solitaireId, storeId).then(res => {
    if (state.shipmentType === 'SELF') {
      // 自提订单才有自提码
      if (res.selfStartTime && res.selfEndTime) {
        // 自提开始时间和自提结束时间
        let now = new util.ResponseDate().getTime();
        let selfStartTime = new Date(res.selfStartTime.replace(/-/g, '/')).getTime();
        let selfEndTime = new Date(res.selfEndTime.replace(/-/g, '/')).getTime();
        let startTimeArr = res.selfStartTime.split(" ");
        let endTimeArr = res.selfEndTime.split(" ");
        let daysArrStart = startTimeArr[0].split("-");
        let daysArrEnd = endTimeArr[0].split("-");
        let startDate = daysArrStart[1] + '月' + daysArrStart[2] + '日';
        let endDate = daysArrEnd[1] + '月' + daysArrEnd[2] + '日';
        // + endDate + ' '
        let orderSelfTime = '自提时间：' + startDate + '-' + startTimeArr[1] + "-" + endTimeArr[1];
        // if (self.data.storeInfo.storeHours != null) {
        //   orderSelfTime = orderSelfTime + ' ' + self.data.storeInfo.storeHours
        // }
        state.selfTimeScope = orderSelfTime;
        if (state.groupOrderHiddenLadingCode) {
          if (now >= selfStartTime) {
            getBarcodeCode(state.prefix + state.order.ladingCode);
          } else {
            // 处理不显示自提码时提示
            state.showBarcode = false;
            state.selfTimeText = orderSelfTime;
          }
        } else {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        }
      } else {
        // 自提订单根据自提时间显示
        let now = new util.ResponseDate().getTime();
        // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
        // 正则自提校验时间格式2  2018-12-20
        // 正则自提校验时间格式3  2018-11-07 09:21-12:00
        let reg1 = /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/;
        if (reg1.test(state.order.selfTimeScope)) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime();
          if (state.groupOrderHiddenLadingCode) {
            if (now >= selfStartTime) {
              getBarcodeCode(state.prefix + state.order.ladingCode);
            } else {
              // 处理不显示自提码时提示
              state.showBarcode = false;
            }
          } else {
            getBarcodeCode(state.prefix + state.order.ladingCode);
          }
        } else {
          getBarcodeCode(state.prefix + state.order.ladingCode);
        }

        // 额外处理自提时间
        if (res.selfAfterDay || res.selfAfterDay === 0) {
          let timeScope = state.order.selfTimeScope;
          let timeArr = timeScope.split("~");
          let startArray = timeArr[0].split(" ");
          let daysArr = startArray[0].split("-");
          let startDate = daysArr[1] + '月' + daysArr[2] + '日';
          let orderSelfTime = '';
          orderSelfTime = '自提时间：' + startDate + "之后";
          state.selfTimeScope = orderSelfTime;
        }
      }
    }
  }).catch(err => {
    console.log(err.message);
  });
}
function getByOrder(orderId) {
  let that = this;
  orderService.getByOrder1(orderId).then(res => {
    if (res && res.length > 0) {
      console.log('进入到这里吗？', res);
      let tempProducts = state.goodsList;
      let cancelFlag = false;
      let refundTotal = 0;
      res.forEach(item => {
        if (!cancelFlag && item.status == 'CREATED' && item.isReview == 1) {
          cancelFlag = true;
        }
        if (item.status === "FINISHED") {
          if (item.productDescription != null && item.productDescription != '') {
            let productDescription = JSON.parse(item.productDescription);
            item.refundDetails = productDescription;
          }
          // 只匹配已经完成的退款单
          item.refundDetails.forEach(ele => {
            for (let i = 0; i < tempProducts.length; i++) {
              const it = tempProducts[i];
              if (ele.productId === it.productId) {
                console.log(ele, 'eleele');
                tempProducts[i].refundAmount = tempProducts[i].refundAmount + ele.productAmount;
                tempProducts[i].refundDetails = ele;
                break;
              }
            }
          });
        } else if (item.status === "REFUND_WAITRECEIVER") {
          let refundId;
          // 只匹配已经完成的退款单
          item.refundDetails.forEach(ele => {
            for (let i = 0; i < tempProducts.length; i++) {
              const it = tempProducts[i];
              if (ele.productId === it.productId) {
                tempProducts[i].refundDetails = ele;
                refundId = ele.refundId;
                break;
              }
            }
          });
          if (refundId) {
            orderService.queryRefundAddress(refundId).then(resItem => {
              state.refundAddress = resItem;
              state.refundId = refundId;
            });
          }
        }
        if (item.status === 'FINISHED') {
          refundTotal += item.total;
        }
        state.refundStatus = item.status;
      });
      // tempProducts.forEach(itema => {
      //     selfA.getTemporaryUrl(itema.imageUrl)
      //         .then(res => {
      //             // itema.imageUrl = res
      //             itema.url1 = res
      //             console.log(itema, "itema");
      //             this.setData({
      //                 goodsList: tempProducts
      //             })
      //         })
      // })
      console.log(tempProducts, '11111111111');
      state.goodsList = tempProducts;
      state.refundDataList = res;
      state.cancelFlag = cancelFlag;
      state.refundTotal = refundTotal;
    }
  });
}
function toGoodsDetails(val) {
  if (state.order.type === 'CYCLE') {
    NAVPAGE.toCycleDetails(`?id=${state.order.cycleId}`);
  } else {
    let opts = '?productId=' + val.currentTarget.dataset.id + '&storeId=' + state.storeId + '&type=' + (state.order.type === 'SERVICE' ? 'service' : 'normal');
    NAVPAGE.toGoodsDetails(opts);
  }
}
function toCancel(val) {
  let self = this;
  let orderId = val.currentTarget.dataset.id;
  uni.showModal({
    title: '提示',
    content: '确认要取消该订单？',
    success: function (res) {
      if (res.confirm) {
        uni.showLoading({
          title: "处理中",
          mask: true
        });
        orderService.cancel(orderId).then(item => {
          uni.hideLoading();
          getOrderDetails();
          uni.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          });
        }).catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else if (res.cancel) {}
    }
  });
}
function getOrder() {
  getOrderDetails();
}
function handleToBigBarcode() {
  const self = this;
  wxbarcode.barcode('orderBarcode', state.prefix + state.order.ladingCode, 710, 200);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: 710,
    height: 200,
    destWidth: 710 * pixelRatio,
    destHeight: 200 * pixelRatio,
    canvasId: 'orderBarcode',
    success(res) {
      state.bigBarcode = res.tempFilePath;
    }
  }, self);
  if (uni.canIUse('setScreenBrightness')) {
    uni.setScreenBrightness({
      value: 1
    });
  } else {}
  state.showBigBarcode = true;
}
/**
 * 处理切换到小二维码的操作
 * - 检查并设置屏幕亮度为0.4（如果支持）
 * - 隐藏大二维码显示
 */
function handleToSmallBarcode() {
  if (uni.canIUse('setScreenBrightness')) {
    uni.setScreenBrightness({
      value: 0.4
    });
  } else {}
  state.showBigBarcode = false;
}
/**
 * 执行支付操作
 * - 根据订单类型执行不同的支付逻辑
 */
function toPay() {
  if (state.order.type === "PENNY") {
    // 处理购物抽奖订单
    state.orderData = state.order;
    state.payType = "penny";
  } else {
    let orderId = state.orderId;
    toPayMethod(orderId, 'normal');
  }
}
function toPayMethod(orderId, type) {
  let opts = '?orderId=' + orderId + '&from=order&type=' + type + '&orderType=' + (state.options && state.options.orderType ? state.options.orderType : '');
  NAVPAGE.toPayMethod(opts);
}
function toPayTail() {
  const that = this;
  const advanceId = state.advanceId;
  const goodsList = state.goodsList;
  let productId = null;
  if (goodsList.length > 0) {
    productId = goodsList[0].productId;
  }
  advanceSellService.getByIds(advanceId, productId).then(res => {
    function timeDivision(time) {
      const timeArray = time.split(' ');
      const timeSlot = timeArray[1].slice(0, 5);
      return timeSlot;
    }
    let now = new util.ResponseDate();
    let nowTimeStamp = new Date(util.formatTime(now)).getTime();
    const startTimeStamp = new Date(res.balanceStartTime.replace(/-/g, '/')).getTime();
    const endTimeStamp = new Date(res.balanceEndTime.replace(/-/g, '/')).getTime();
    const startTime = res.balanceStartTime.split(" ")[0];
    const startArray = startTime.split("-");
    const newStart = startArray[0] + '年' + startArray[1] + '月' + startArray[2] + '日';
    const endTime = res.balanceEndTime.split(" ")[0];
    const endArray = endTime.split("-");
    const newEnd = endArray[0] + '年' + endArray[1] + '月' + endArray[2] + '日';
    if (nowTimeStamp < startTimeStamp) {
      // 未到支付尾款时间
      if (newStart === newEnd) {
        timeSlot = timeDivision(startTime) + "~" + timeDivision(endTime);
        uni.showToast({
          title: '请于' + newStart + " " + timeSlot + '期间支付尾款',
          icon: 'none',
          duration: 2000
        });
      } else {
        uni.showToast({
          title: '请于' + newStart + ' - ' + newEnd + '期间支付尾款',
          icon: 'none',
          duration: 2000
        });
      }
    } else if (startTimeStamp <= nowTimeStamp && nowTimeStamp <= endTimeStamp) {
      // 支付尾款时间段内
      // that.toPayMethod(orderId, 'payTail')
      state.orderData = state.order;
      state.payType = "payTail";
    } else {
      // 已过支付尾款时间
      uni.showToast({
        title: '很抱歉，您的订单已经超过支付尾款的最后期限了~',
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function handleConfirmReceipt() {
  let self = this;
  let orderId = state.orderId;
  uni.showModal({
    title: '提示',
    content: '请确认已经收到商品？',
    success: function (res) {
      if (res.confirm) {
        orderService.confirm(orderId).then(item => {
          getOrderDetails();
        });
      } else if (res.cancel) {}
    }
  });
}
function toOrderTrajectory() {
  const that = this;
  let order = state.order;
  let orderId = order.id;
  if (state.orderTraceType == 'DLY') {
    let opts = '?orderId=' + state.order.id + '&mobile=' + state.order.receiverMobile;
    NAVPAGE.toLogisticsInfo(opts);
  } else {
    let tempLocation = {
      user: {
        latitude: state.order.lat,
        longitude: state.order.lng
      },
      store: {
        latitude: state.storeInfo ? state.storeInfo.latitude : null,
        longitude: state.storeInfo ? state.storeInfo.longitude : null
      }
    };
    let storeInfo = JSON.stringify(state.storeInfo);
    let location = JSON.stringify(tempLocation);
    let opts = '?orderId=' + orderId + '&location=' + location + '&courierName=' + order.courierName + '&courierPhone=' + order.courierPhone + '&store=' + storeInfo;
    NAVPAGE.toOrderTrajectory(opts);
  }
}
function toRefundGoods(val) {
  console.log('点击了退款');
  if (state.order.type === 'CYCLE') {
    // 如果是周期购 且子单有在退款中的不允许退款操作
    let validItems = state.order.childOrder.filter(item => item.status === '退款中');
    if (validItems.length > 0) {
      uni.showToast({
        title: '主订单中存在退款中子订单，请完结后申请',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  }
  getOrderDetails(async (flag, status) => {
    if (flag) {
      console.log(state.order.status, 'this.data.order.status', status);
      let orderId = val.currentTarget.dataset.id;
      await systemService.query('app.mall.order.auto.refund').then(res => {
        // 当前时间-下单时间 < 后端返的时间（毫秒）进下面直接退款界面
        const curTime = new Date().getTime();
        const differTime = curTime - new Date(state.order.createTime).getTime();
        // console.log(res && res.length > 0 && res[0].value , differTime < res[0].value)
        if (res && res.length > 0 && res[0].value && differTime < res[0].value) {
          let opts = '?orderId=' + orderId + '&afterSaleType=' + val.currentTarget.dataset.type;
          NAVPAGE.toRefund(opts);
        } else {
          // || status == '部分退款'
          if ((status == '待发货' || status == '待自提' || status == '待服务' || status == '待拼团' || status == '已付款' || status == '接龙中' || status == '已成团') && !state.order.trackingNumber) {
            let opts = '?orderId=' + orderId + '&afterSaleType=' + val.currentTarget.dataset.type;
            NAVPAGE.toRefund(opts);
          } else {
            console.log('打开弹层');
            state.afterShow = true;
            state.afteRorderId = orderId;
          }
        }
      });

      // this.handleSubscriptionMessage(subscribeMessage.scene.REFUND, () => {})
    }
  });
}
function handleSubscriptionMessage(SCENE, originalOperation) {
  const that = this;
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage();
  } else {
    subscribeMessage.getTemplateIds().then(res => {
      handleSubscribeMessage();
    }).catch(err => {
      console.log(err.message);
      originalOperation();
      log.warn("查询模板id报错：", err.message);
    });
  }
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(SCENE);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            subscribeMessage.addSubscribe(SCENE, res);
            log.info(res);
            originalOperation();
          },
          fail(err) {
            console.log(err);
            log.warn(err);
            originalOperation();
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
        originalOperation();
      }
    } else {
      log.info('模板id未获取到');
      originalOperation();
    }
  }
}
function toRefundDetails(val) {
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toRefundDetails(opts);
}
function toAddRefundDetails(val) {
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toAddRefundDetails(opts);
}
function toEvaluate(val) {
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toEvaluate(opts);
}
function toService() {
  const that = this;
  handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleOrderService);
  function handleOrderService() {
    let storeInfo = state.storeInfo;
    // 客服电话
    let servicePhone = null;
    if (app.globalData.servicePhone !== "") {
      servicePhone = app.globalData.servicePhone;
    }
    if (storeInfo.id != null) {
      let tel = '';
      if (storeInfo.tel != null && storeInfo.tel != '') {
        // 判断订单中门店是否有电话
        tel = storeInfo.tel;
      } else {
        // 门店无电话使用公司服务电话
        tel = app.globalData.servicePhone;
      }
      // that.myMakePhoneCall(tel);
    } else {
      storeService.getById(storeInfo.id).then(res => {
        if (res) {
          let tel = '';
          if (res.tel != null && res.tel !== '') {
            tel = res.tel;
          } else {
            tel = servicePhone;
          }
          // that.myMakePhoneCall(tel);
        } else {
          // that.myMakePhoneCall(servicePhone);
        }
      }).catch(err => {
        // that.myMakePhoneCall(servicePhone);
      });
    }
  }
}
function toService1() {
  const that = this;
  handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleOrderService);
  function handleOrderService() {
    let storeInfo = state.storeInfo;
    // 客服电话
    let servicePhone = null;
    if (app.globalData.servicePhone !== "") {
      servicePhone = app.globalData.servicePhone;
    }
    if (storeInfo.id != null) {
      let tel = '';
      if (storeInfo.tel != null && storeInfo.tel != '') {
        // 判断订单中门店是否有电话
        tel = storeInfo.tel;
      } else {
        // 门店无电话使用公司服务电话
        tel = app.globalData.servicePhone;
      }
      myMakePhoneCall(tel);
    } else {
      storeService.getById(storeInfo.id).then(res => {
        if (res) {
          let tel = '';
          if (res.tel != null && res.tel !== '') {
            tel = res.tel;
          } else {
            tel = servicePhone;
          }
          myMakePhoneCall(tel);
        } else {
          myMakePhoneCall(servicePhone);
        }
      }).catch(err => {
        myMakePhoneCall(servicePhone);
      });
    }
  }
}
function myMakePhoneCall(tel) {
  uni.showModal({
    title: '提示',
    content: '确定要拨打以下电话' + tel,
    confirmText: '拨打',
    success: function (res) {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: tel
        });
      } else if (res.cancel) {}
    }
  });
}
async function cancalRefundCycle(e) {
  let id = e.currentTarget.dataset.id;
  await getByOrder(id);
  await cancalRefund();
}
function cancalRefund() {
  let that = this;
  let refundIds = '';
  let refundId = '';
  let isReview = 0;
  state.refundDataList.filter(item => {
    if (item.status == 'CREATED' || item.status == 'THIRD_PARTY') {
      refundIds += ',' + item.id;
      refundId = item.id;
      isReview = item.isReview;
    }
    return item.status == 'CREATED' || item.status == 'THIRD_PARTY';
  });
  if (isReview == 1) {
    orderService.getDlyById({
      id: refundId,
      parts: ''
    }).then(res => {
      if (res && res.approve_state == 'none') {
        tipFn();
      } else {
        uni.showToast({
          title: '当前订单状态不可取消退款',
          icon: 'none',
          duration: 2000
        });
      }
    });
  } else {
    tipFn();
  }
  function tipFn() {
    uni.showModal({
      title: '提示',
      content: '确定要取消退款',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          orderService.cancelRefund({
            refundId: refundIds.replace(',', '')
          }).then(res1 => {
            getOrderDetails();
            uni.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 2000
            });
          });
        } else if (res.cancel) {}
      }
    });
  }
}
function none() {
  console.log("联系客服");
}
function toTrackingDetails() {
  let opts = '?orderId=' + state.order.id + '&mobile=' + state.order.receiverMobile;
  NAVPAGE.toLogisticsInfo(opts);
}
function contactStore() {
  const that = this;
  let storeInfo = state.storeInfo;
  // 客服电话
  let servicePhone = null;
  if (app.globalData.servicePhone !== "") {
    servicePhone = app.globalData.servicePhone;
  }
  if (storeInfo.id != null) {
    let tel = '';
    if (storeInfo.tel != null && storeInfo.tel != '') {
      // 判断订单中门店是否有电话
      tel = storeInfo.tel;
    } else {
      // 门店无电话使用公司服务电话
      tel = app.globalData.servicePhone;
    }
    myMakePhoneCall(tel);
  } else {
    storeService.getById(storeInfo.id).then(res => {
      if (res) {
        let tel = '';
        if (res.tel != null && res.tel !== '') {
          tel = res.tel;
        } else {
          tel = servicePhone;
        }
        myMakePhoneCall(tel);
      } else {
        myMakePhoneCall(servicePhone);
      }
    }).catch(err => {
      myMakePhoneCall(servicePhone);
    });
  }
}
function getStoreById(id) {
  const self = this;
  let storeInfo = {
    tel: ''
  };
  storeService.getById(id).then(res => {
    storeInfo = res;
    state.storeInfo = storeInfo;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: none,
      duration: 2000
    });
  });
}
function viewStoreLocation() {
  let storeInfo = state.storeInfo;
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
function queryInvoice(orderId) {
  const insert = {
    page: 1,
    pageSize: 0,
    orderIdEquals: orderId
  };
  invoiceService.query(insert).then(res => {
    if (res.records[0]) {
      const invoice = {
        type: res.records[0].type,
        title: res.records[0].title,
        taxNumber: res.records[0].taxNumber
      };
      console.log(invoice, 'invoice');
      state.showInvoice = true;
      state.invoice = invoice;
    } else {
      state.showInvoice = false;
      return false;
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
onLoad(function (options) {
  state.options = options;
  getShopCartStyle();
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color:' + app.globalData.uiconfig.themeColor + ';' : 'color:' + (uni.getStorageSync('themeColor') || '#FF9F43') + ';',
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background:' + app.globalData.uiconfig.themeColor + ';' : 'background:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color:' + app.globalData.uiconfig.themeColor + ';' : 'border-color:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background:linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background:linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: 'color:#333;',
    borderColorRgb: "border-color:#333;",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color:' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  queryAgain = false;
  console.log(app.globalData.configureInfo, "11111");
  firstInPage = true;
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
  let pages = getCurrentPages();
  let prevpage = pages[pages.length - 2];
  console.log('prevpage', prevpage);
  if (prevpage && (prevpage.route === 'pages/mallModule/order/order/order' || prevpage.route === 'pages/mallModule/score/scoreOrder/scoreOrder')) {
    state.butFalse = true;
  }
  uni.hideShareMenu();
  state.serviceTel = app.globalData.servicePhone;
  state.onLoad = true;
  app.globalData.configureInfo.forEach(item => {
    if (item.key === 'selfTakeCode') {
      console.log(item, "prefix");
      state.prefix = item.value ? item.value : '';
    }
  });
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  // 查询系统配置项，根据系统配置项退款显示
  let systemOptions = app.globalData.configureInfo;
  let supportPartReturn = true;
  systemOptions.forEach(item => {
    // 遍历配置项查询是否支持部分退款
    if (item.key === 'supportPartReturn' && item.value !== undefined) {
      item.value === 'TRUE' ? supportPartReturn = true : supportPartReturn = false;
      // supportPartReturn = item.value
    }
  });
  state.supportPartReturn = supportPartReturn;
  if (options.orderId) {
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      getOrderDetails();
      queryInvoice(options.orderId);
      let orderTraceType = uni.getStorageSync('orderTraceType');
      state.orderTraceType = orderTraceType;
      if (orderTraceType == 'DLY') {
        state.orderId = options.orderId;
        state.orderTraceType = orderTraceType;
        getOrderShipDetails();
      } else {
        getOrderTrackingNumAndCom(options.orderId);
      }
    }
  } else if (options.storeOrderId) {
    state.storeOrderId = options.storeOrderId;
    state.tradeNS = options.tradeNS;
    getStoreOrderDetails(options.storeOrderId, options.tradeNS);
  }
  // 获取当前页面分享图
  getSharePictures();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    if (state.storeOrderId) {
      getStoreOrderDetails(state.storeOrderId, state.tradeNS);
    } else if (state.orderId) {
      getOrderDetails();
    }
  } else {
    if (options.orderId) {
      state.orderId = options.orderId;
    }
    if (firstInPage) {
      firstInPage = false;
      NAVPAGE.toAuthorize();
    } else {
      uni.showModal({
        title: '温馨提示',
        content: '您还没有登录，请先登录授权',
        showCancel: false,
        confirmText: '去登陆',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            NAVPAGE.toAuthorize();
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
});
onHide(function () {
  uni.hideLoading();
});
onUnload(function () {
  uni.hideLoading();
  clearTimeout(state.payTimeId);
  clearTimeout(state.groupTimeId);
  clearTimeout(state.barCodeTime);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let storeData = JSON.stringify({
    storeId: state.storeId,
    storeName: state.storeName
  });
  const goods = state.goodsList;
  let sharePictures = '';
  if (state.sharePictures != null && state.sharePictures != 'null') {
    sharePictures = state.sharePictures;
  }
  if (goods.length > 0) {
    sharePictures = goods[0].imageUrl;
  }
  let raffleSharePictures = state.raffleSharePictures;
  if (groupSharePictures != null && groupSharePictures != 'null' && groupSharePictures !== '') {
    // 如果有拼团分享图片
    sharePictures = groupSharePictures;
  }
  if (res.from === 'button') {
    // 来自页面内转发按钮
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let memberId = app.globalData.userInfo.member.id;
      if (res.target.dataset.sharetype === 'raffle') {
        if (raffleSharePictures !== '' && raffleSharePictures != null) {
          sharePictures = raffleSharePictures;
        }
        return {
          title: '优惠券大抽奖',
          path: '/pages-sub/newretail/pages/mallModule/activity/luckDraw/luckDraw?raffleId=' + state.raffleId + '&activityId=' + state.raffleActivityId + '&shareId=' + memberId + '&type=order&storeId=' + state.storeId + '&raffleType=' + state.raffleType,
          imageUrl: sharePictures,
          success(e) {
            console.log(e);
            uni.showShareMenu({
              withShareTicket: true
            });
          }
        };
      } else if (res.target.dataset.sharetype === 'penny') {
        sharePictures = state.pennyInstance.shareImageUrl ? state.pennyInstance.shareImageUrl : sharePictures;
        return {
          title: '麻烦点一下，只差一个人就拿到' + state.pennyInstance.productName + '了～',
          path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + state.pennyInstance.id,
          imageUrl: sharePictures,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true
            });
          }
        };
      } else {
        console.log('?teamBuyId=' + state.teamId + '&teamLeaderRecordId=' + state.teamLeaderRecordId + '&storeData=' + storeData + '&shareId=' + memberId);
        return {
          title: '拼团有优惠',
          path: '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?teamBuyId=' + state.teamId + '&teamLeaderRecordId=' + state.teamLeaderRecordId + '&storeData=' + storeData + '&shareId=' + memberId + '&storeId=' + state.storeId,
          imageUrl: sharePictures,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true
            });
          }
        };
      }
    } else {
      return {
        title: '',
        path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId,
        imageUrl: sharePictures,
        success(e) {
          uni.showShareMenu({
            withShareTicket: true
          });
        }
      };
    }
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
  util.getSharePictures('RAFFLE_ACTIVITY').then(res => {
    state.raffleSharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toggleMiddlePopup() {
  toggle('middle');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function getPennyInfo(order) {
  const that = this;
  const postData = {
    page: 1,
    pageSize: 1,
    memberIdEquals: app.globalData.userInfo.member.id,
    orderIdEquals: order.id,
    searchCount: true
  };
  pennyService.queryInstance(postData).then(res => {
    if (!res || !res.records || res.records.length === 0) {
      return;
    }
    if (res.records[0].status === "CREATE") {
      state.canShowService = true;
    }
    state.pennyInstance = res.records[0];
  }).catch(err => {
    util.showToast(err.message);
  });
}
function toHome() {
  NAVPAGE.toHome();
}
function toMoneyGoing() {
  const opts = state.order.id;
  NAVPAGE.toMoneyGoing(opts);
}
function toPennyDetails(val) {
  const order = state.order;
  const pennyInstance = state.pennyInstance;
  if (order && order.type === "PENNY") {
    const opts = "?instanceId=" + pennyInstance.id;
    NAVPAGE.toHelpPenny(opts);
  }
}
function shareGroup() {
  subscriptionMessagePopup(subscribeMessage.scene.GROUP_ORDER);
}
function shaerPenny() {
  subscriptionMessagePopup(subscribeMessage.scene.RAFFLE_PRIZED);
}
function subscriptionMessagePopup(types) {
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage();
  } else {
    subscribeMessage.getTemplateIds().then(res => {
      handleSubscribeMessage();
    }).catch(err => {
      console.log(err.message);
      log.warn("查询模板id报错：", err.message);
    });
  }
  function handleSubscribeMessage() {
    let templateIds = [];
    templateIds = subscribeMessage.handleTemplateIds(types);
    console.log(templateIds);
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res);
            subscribeMessage.addSubscribe(types, res);
            log.info(res);
          },
          fail(err) {
            console.log(err);
            log.warn(err);
          }
        });
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持');
      }
    } else {
      log.info('模板id未获取到');
    }
  }
}
function getAdvanceSellActivityById(advanceId, productId) {
  const that = this;
  advanceSellService.getByIds(advanceId, productId).then(res => {
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
    let frontStartTime = timeToArray(res.frontStartTime);
    let frontEndTime = timeToArray(res.frontEndTime);
    let balanceStartTime = '';
    let balanceEndTime = '';
    let balanceDate = '';
    if (res.payType === 'PARTIAL') {
      balanceStartTime = timeToArray(res.balanceStartTime);
      balanceEndTime = timeToArray(res.balanceEndTime);
      balanceDate = balanceStartTime + " " + timeDivision(res.balanceStartTime) + '~' + balanceEndTime + " " + timeDivision(res.balanceEndTime);
      if (balanceStartTime === balanceEndTime) {
        balanceDate = balanceStartTime + " " + timeDivision(res.balanceStartTime) + '~' + timeDivision(res.balanceEndTime);
      }
    }
    console.log(frontStartTime, frontEndTime, balanceStartTime, balanceEndTime);
    state.advanceSellTime = {
      frontStartTime: frontStartTime,
      frontEndTime: frontEndTime,
      balanceStartTime: balanceStartTime,
      balanceEndTime: balanceEndTime,
      balanceDate: balanceDate
    };
  });
}
function copyOrderId() {
  const orderId = state.sendOrderId || state.order.id;
  uni.setClipboardData({
    data: orderId,
    success(res) {
      uni.hideToast();
      uni.showToast({
        title: "复制成功！",
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function callContact() {
  let picture = state.goodsList[0].imageUrl || '';

  // selfA.getTemporaryUrl(picture)
  //     .then(res => {
  //         let pictureA = res
  //     })
  let title = state.goodsList[0].name || '';
  let sellPrice = state.goodsList[0].price ? parseFloat(state.goodsList[0].price) : '';
  let description = state.goodsList[0].description || '';
  // wx.navigateTo({
  //     url: `/pages/mallModule/order/qiyu/index?sendByUser=1&cardType=1&orderId=${this.data.orderId}&picture=${picture}&title=${title}&sellPrice=${this.data.orderAmount}&orderStatus=${this.data.orderStatus}`,
  // })
  NAVPAGE.toCustomService(`?sendByUser=1&cardType=1&orderId=${state.orderId}&picture=${picture}&title=${title}&sellPrice=${state.orderAmount}&orderStatus=${state.orderStatus}&createTime=${state.order.createTime}&goodsCount=${state.order.buyNumber}`, state.order.storeId);

  // console.log(title,sellPrice,picture,description,"descriptiondescription",this.data.goodsList);
  // wx.navigateTo({
  //     url: `/pages/mallModule/qiyu/index?picture=${picture}&title=${title}&sellPrice=${sellPrice}&description=${description}`,
  // })
}
function viewMore() {
  state.showMore = !state.showMore;
}
function oneMore(e) {
  const that = this;
  const orderId = state.order.id;
  const order = state.order;
  if (order && order.business === "DISTRIBUTION") {
    app.globalData.storeIdentification = 'distribution';
  } else if (order && order.business === "DISTRIBUTION") {
    app.globalData.storeIdentification = 'NEXT_DAY';
  } else {
    app.globalData.storeIdentification = 'normal';
  }
  app.globalData.parameter = {
    orderId: orderId,
    storeIdentification: app.globalData.storeIdentification,
    from: "oneMore"
  };
  NAVPAGE.toShopcart();
}
function toRefundPage(val) {
  console.log('val', val);
  if (val.currentTarget.dataset.id === "REFUND") {
    let opts = '?orderId=' + state.afteRorderId + '&afterSaleType=' + val.currentTarget.dataset.type;
    NAVPAGE.toRefund(opts);
  } else {
    let opts = '?orderId=' + state.afteRorderId + '&afterSaleType=' + val.currentTarget.dataset.type;
    NAVPAGE.toRefund(opts);
  }
  state.afterShow = false;
}
function showPopu() {
  console.log('点击了');
  state.afterShow = false;
}
function filtPayMethod(val) {
  if (val === "COUPONPAY") {
    val = "券优惠";
  } else if (val === "SCOREPAY") {
    val = "积分兑换";
  } else if (val === "CARDPAY") {
    val = "储值卡";
  } else if (val === "ALIPAYH5") {
    val = "支付宝H5支付";
  } else if (val === "WECHATH5") {
    val = "微信H5支付";
  } else if (val === "ALIPAY") {
    val = "支付宝支付";
  } else if (val === "WXPAY" || val === "WX_MINI_APP" || val === "MALLCOO_PAY") {
    val = "微信支付";
  } else if (val === "GIFTCARDPAY") {
    val = "礼品卡支付";
  } else if (val === "MSP_ACCOUNT_PAY") {
    val = "余额支付";
  } else {
    val = '线上支付';
  }
  return val;
}
function clipBtn1(e) {
  let json = e.currentTarget.dataset.track;
  uni.setClipboardData({
    data: json,
    success: function (res) {
      uni.showToast({
        title: "复制成功！",
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function getOrderShipDetails(trackingInfo, trackId) {
  const that = this;
  let orderTraceType = uni.getStorageSync('orderTraceType');
  if (trackingInfo && trackingInfo.trackingCompany && trackingInfo.trackingNumber && orderTraceType != 'DLY') {
    let params = {
      trackingCom: trackingInfo.trackingCompany,
      trackingNumber: trackingInfo.trackingNumber,
      mobile: state.mobile ? state.mobile : '',
      orderId: state.orderId
    };
    orderService.getOrderShipDetailsV2(params).then(res => {
      if (res) {
        let tempShip = [];
        res.shipdetails.forEach(item => {
          tempShip.push(item);
        });
        let tempList = state.trackingList;
        for (let i = 0; i < tempList.length; i++) {
          const ele = tempList[i];
          if (ele.trackingNumber === res.num && trackId === ele.id) {
            tempList[i].shipdetails = tempShip;
            tempList[i].trailUrl = res.trailUrl;
            break;
          }
        }
        state.trackingList = tempList;
      }
    }).catch(e => {
      // wx.showToast({
      //   title: e.message,
      //   icon: 'none',
      //   duration: 2000
      // })
    });
  } else if (orderTraceType == 'DLY') {
    let params = {
      orderId: state.orderId
    };
    orderService.getOrderShipDetailsV2(params).then(res => {
      if (res) {
        let tempShip = [];
        let trackingCompanyInfo = handleTrackingCompany(res.com);
        res.shipdetails.forEach(item => {
          tempShip.push(item);
        });
        let tempList = {
          ...res,
          trackingCom: res.com,
          trackingNumber: res.num,
          shipdetails: tempShip,
          trailUrl: res.trailUrl,
          phoneNum: res.deliverymanPhone || '无'
        };
        state.trackingList = [tempList];
      }
    }).catch(e => {});
  }
  let str = 'a15112250161c0755-2451454c18926057890111放0755-4554444分';
  let reg = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}))?/g;
  console.log(str.match(reg));
}
function checkGoods(e) {
  console.log(e, "订单号");
  // let opts = '?orderId=' + this.data.orderId;
  // NAVPAGE.toQueryGoods(opts)
  state.flag = true;
  orderService.getProductsByOrderId(e.target.dataset.item.getDataId).then(res => {
    let arr = [...res];
    arr.forEach(item => {
      //   await selfA.getTemporaryUrl(item.imageUrl).then((res1)=>{
      //       console.log(res1,2222222222)
      //       item.url1 = res1
      //   })
      state.commodityInfo = {
        ...e.target.dataset.item,
        list: [...arr]
      };
      state.orderId = state.orderId;
    });
    console.log(state.commodityInfo, 333333333);
  });
}
function callTrackingPhone() {
  let phoneNum = state.phoneNum;
  if (phoneNum !== "暂无") {
    handleCallPhone(phoneNum);
  }
}
function callDistributionPhone() {
  let phoneNum = state.distributionPhone;
  handleCallPhone(phoneNum);
}
function handleCallPhone(phoneNum) {
  uni.makePhoneCall({
    phoneNumber: phoneNum
  });
}
function toggleGoodsSpecPopup() {
  state.flag = false;
}
function toTrajectory(e) {
  console.log(e, "eeee");
  let item = e.currentTarget.dataset.item;
  if (item.trailUrl) {
    let opts = '?trailUrl=' + item.trailUrl;
    NAVPAGE.toLogisticsInfoItem(opts);
  } else {
    toTrackingDetails();
  }
}
function clickShipdetails(e) {
  const trackId = e.currentTarget.dataset.id;
  const trackIndex = e.currentTarget.dataset.index;
  state.currentItem = trackId;
  state.trackActiveIndex = trackIndex;
  state.showAll = false;
  let tempInfo = {};
  for (let i = 0; i < state.trackingList.length; i++) {
    const ele = state.trackingList[i];
    if (ele.id === trackId) {
      tempInfo = {
        trackingCompany: ele.trackingCompany,
        trackingNumber: ele.trackingNumber
      };
      break;
    }
  }
  getOrderShipDetails(tempInfo, trackId);
}
function changeShow() {
  state.showAll = !state.showAll;
}
function showGood(e) {
  let idx = e.currentTarget.dataset.idx;
  state.editActiveIdx = idx;
  state.goodDetailShow = true;
  uni.setStorageSync('editActiveIdx', idx);
}
function changeGoodDetailShow() {
  state.goodDetailShow = !state.goodDetailShow;
}
</script>
<style scoped>
/* pages/orderDetails/orderDetails.wxss */
page {
    background: #F4F4F4;
}

.order {
    overflow-x: hidden;
    position: relative;
}
.refresh {
  position: absolute;
  right: 40rpx;
  top: 46rpx;
}
.good-type-icon {
  height: 30rpx;
  margin: 20rpx 0;
}
.addressBox {
    width: 712rpx;
    padding: 0 18rpx;
    margin: 18rpx auto;
    background-color: #fff;
    padding-top: 40rpx;
    box-sizing: border-box;
}

.addressBox-active {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F3F3F3;
}

.addressBox-active-bottom {
    display: flex;
    justify-content: space-between;
    line-height: 116rpx;
    font-size: 24rpx;
}

.addressBox-active-bottom-top {
    font-size: 31rpx;
    font-weight: 500;
    color: #050505;
}

.addressBox-active-left>image {
    width: 33rpx;
    height: 33rpx;
}

.addressBox-active-right>image {
    width: 30rpx;
    height: 30rpx;
}

.addressBox-active-content {
    width: 575rpx;
    font-size: 24rpx;
    margin-left: 15rpx;
    padding-bottom: 31rpx;
    margin-right: 31rpx;
    box-sizing: border-box;
}

.addressBox-active-content-top {
    margin-bottom: 21rpx;
}

.color-454545 {
    color: #454545;
}

.color-009F55 {
    color: #009f55;
}

.color-f9a72a {
    color: #f9a72a;
}

.color-ff7171 {
    color: #ff7171;
}

.color-5a5a5a {
    color: #5a5a5a;
}

.color-999999 {
    color: #999;
}

.price-detail-item-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #454545;
    overflow: hidden;
}

.coupon-name-box {
    display: flex;
}

.price-detail-item-name .coupon-name {
    color: #454545;
    display: flex;
}

.price-detail-item-name .coupon-name text {
    color: #454545 !important;
    display: inline-block;
    max-width: 286rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
}

.price-detail-item-value {
    color: #ff7171;
    flex-shrink: 0;
}

.top-info {
    border-radius: 20rpx;
    width: 712rpx;
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

.order-status {
    color: #242424;
    width: 100%;
    font-size: 36rpx;
    line-height: 56rpx;
    height: 56rpx;
    padding-top: 36rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-status image.right-icon {
    margin-left: 22rpx;
    width: 12rpx;
    height: 24rpx;
}

.top-tips .countdown {
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    flex-direction: row;
}

.top-tips .countdown text:first-of-type {
    margin-right: 6rpx;
}

.top-tips {
    font-size: 28rpx;
    line-height: 42rpx;
    color: #454545;
    display: flex;
    flex-direction: column;
    padding-top: 15rpx;
    padding-bottom: 27rpx;
}

.top-tips view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 4rpx;
}

.top-tips view text {
    font-size: 28rpx;
    text-align: center;
}

.top-tips view text.distribution {
    font-size: 24rpx;
    color: #096;
    font-weight: normal;
}

.top-tips .order-tips {
    font-size: 28rpx;
}

.top-button-box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70rpx;
    padding-bottom: 40rpx;
}

.top-button-box button {
    background: #fff;
    width: 190rpx;
    height: 70rpx;
    padding: 0 20rpx;
    border: 2rpx solid #8b8b8c;
    color: #000000;
    font-size: 28rpx;
    font-family: Source Han Sans CN;
    font-weight: 500;
    line-height: 70rpx;
    margin: 0 18rpx 0 0;
    border-radius: 35rpx;
    box-sizing: border-box;
}

.top-button-box button:last-of-type {
    margin-right: 0;
}

.top-button-box button.payment,
.top-button-box button.to-invitation,
.top-button-box button.service {
    background-color: #009f55;
    color: #ffffff;
    border: 2rpx solid #009f55;
}

.top-button-box button::after {
    border: 0;
}

.right-point {
    width: 15rpx;
    height: 26rpx;
    margin-right: 32rpx;
    vertical-align: middle;
    margin-top: -6rpx;
    margin-left: 10rpx;
}

/* .top-info {
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  border-bottom: 1rpx solid #dadada;
  font-size: 40rpx;
  padding: 0 40rpx;
  background: #ff918f;
  color: #fff;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.top-info image {
  width: 40rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-right: 10rpx;
} */

.waitpayTail image {
    width: 38rpx;
    height: 41rpx;
}

.waitpay .time {
    float: right;
    font-size: 28rpx;
}

.finish {
    background: #ccc;
}

.dispatching {
    background: #f2cb61;
}

.selftake {
    background: #f2cb61;
}

.refunded {
    background: #ccc;
}

.share {
    background: #f4ca5c;
}

.payed {
    background: #5cb0ec;
}

.invite-join {
    width: 676rpx;
    background: #fff;
    padding: 0 18rpx 40rpx 18rpx;
    margin: 0 auto 18rpx auto;
}

.group-title {
    display: flex;
    height: 82rpx;
    line-height: 82rpx;
    font-size: 24rpx;
    color: #454545;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f1f1f1;
}

.group-title text {
    font-weight: bold;
}

.group-people-list {
    padding: 30rpx 0;
    min-height: 105rpx;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    border-bottom: 1rpx solid #f1f1f1;
    margin-bottom: 30rpx;
}

.group-share-text {
    font-size: 26rpx;
    color: #454545;
    line-height: 36rpx;
    margin: 15rpx 0 0 0;
    text-align: center;
    width: 100%;
}

.people-item {
    margin: 10rpx 15rpx;
    width: 101rpx;
    height: 101rpx;
    border-radius: 50%;
    border: 2rpx dashed #adadad;
    position: relative;
    display: flex;
    float: left;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
}

.group-people-list .leader {
    border: 2rpx solid #ff6b09;
}

.people-item .leader-label {
    position: absolute;
    left: 10rpx;
    top: 82rpx;
    z-index: 1;
}

.people-item image {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
}

.people-item text {
    font-size: 32rpx;
    line-height: 101rpx;
    color: #999;
}

.people-more {
    margin: 10rpx 16rpx;
    width: 101rpx;
    height: 101rpx;
    border-radius: 50%;
    position: relative;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.people-more image {
    width: 101rpx;
    height: 101rpx;
}

.leader .leader-label {
    width: 80rpx;
    height: 29rpx;
    border-radius: 12rpx;
    background-color: #ff6902;
    font-size: 18rpx;
    line-height: 29rpx;
    color: #fff;
    display: block;
    text-align: center;
}

.group-tips {
    font-size: 29rpx;
    height: 67rpx;
    line-height: 67rpx;
    width: 100%;
    display: block;
    text-align: center;
}

.join-group {
    border-radius: 6rpx;
    border: none;
    color: #fff;
    width: 670rpx;
    height: 80rpx;
    font-size: 28rpx;
    line-height: 80rpx;
    font-weight: bold;
}

.usable {
    background-color: #009f55;
}

.unavailable {
    background-color: #cbcbcb;
}

.group-success {
    font-size: 28rpx;
    color: #454545;
    height: 70rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.group-success icon {
    margin-right: 25rpx;
}

.receive-box {
    min-height: 69rpx;
    width: 676rpx;
    padding: 27rpx 18rpx 30rpx 18rpx;
    background: #fff;
    border-radius: 20rpx;
    margin: 0 auto 18rpx auto;
    overflow: hidden;
}

.receive-box .icon-box {
    width: 46rpx;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    float: left;
}

.receive-box .icon-box image {
    width: 33rpx;
    height: 39rpx;
}

.receive-box .receive-info {
    width: 610rpx;
    height: 100%;
    font-size: 28rpx;
    line-height: 40rpx;
    color: #454545;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.receive-box .receive-info view {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.receive-box .receive-info view:last-of-type {
    font-size: 24rpx;
    line-height: 40rpx;
}

.receive-box .receive-info view text {
    border-left: 1px solid #8b8b8c;
    padding-left: 22rpx;
    margin-left: 20rpx;
    height: 28rpx;
    line-height: 28rpx;
    display: block;
}

.num-time {
    background: #fff;
    font-size: 30rpx;
    text-indent: 40rpx;
    padding: 20rpx 0rpx;
    line-height: 56rpx;
    border-bottom: 1rpx solid #dadada;
}

.payment-remarks {
    background: #fff;
    font-size: 30rpx;
    margin-bottom: 20rpx;
}

.payment-method {
    min-height: 90rpx;
    line-height: 90rpx;
    padding: 0 40rpx;
}

.payment-method {
    border-bottom: 1rpx solid #dadada;
}

.payment-remarks .color-5a5a5a {
    display: block;
    float: left;
    width: 150rpx;
}

.payment-remarks .remarks {
    overflow: hidden;
}

.remarks .remarks-info {
    width: calc(100% - 150rpx);
    height: 100%;
    display: block;
}

.bottom-box {
    width: 100%;
    height: 90rpx;
    overflow: hidden;
    font-size: 32rpx;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    background: #fff;
    border-top: 1rpx solid #e0e0e0;
}

.bottom-box button::after {
    border: none;
}

.bottom-box .btn {
    float: right;
    width: 148rpx;
    height: 44rpx;
    border-radius: 10rpx;
    text-align: center;
    line-height: 44rpx;
    font-size: 28rpx;
    overflow: hidden;
    margin-right: 30rpx;
    margin-top: 23rpx;
    padding: 0;
}

.bottom-box .cancle {
    border: 1rpx solid #a0a0a0;
}

.bottom-box .to-pay,
.bottom-box .to-invitation {
    background: #ffbf00;
    border: 2rpx solid #ffbf00;
    color: #fff;
    box-sizing: content-box;
}

.bottom-box .confirm {
    background: #ff4b1b;
    border: 2rpx solid #ff4b1b;
    color: #fff;
}

.delivery-box {
    background: #fff;
    margin-bottom: 20rpx;
    padding: 14rpx 0 10rpx 0;
    text-align: center;
}

.delivery-box .title {
    color: #646464;
    font-size: 32rpx;
    line-height: 56rpx;
    margin-bottom: 20rpx;
}

.tips {
    font-size: 32rpx;
    color: #606060;
    line-height: 56rpx;
}

.self-time {
    height: 86rpx;
    line-height: 86rpx;
    font-size: 32rpx;
    text-align: right;
    padding: 0 40rpx;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
}

.self-time text {
    float: left;
    text-align: left;
    font-size: 30rpx;
}

.code-box {
    color: #454545;
    padding-top: 20rpx;
}

.code-box text {
    display: block;
    width: 100%;
}

.using-tips {
    text-align: center;
    font-size: 28rpx;
    line-height: 40rpx;
}

.selftake-store {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    color: #454545;
    font-weight: bold;
    margin-top: 15rpx;
}

.selftake-store image {
    width: 40rpx;
    height: 37rpx;
    margin-right: 8rpx;
}

.barcode-box {
    height: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    position: relative;
}

.barcode-box canvas {
    height: 170rpx;
    width: 710rpx;
    position: absolute;
    top: 0;
}

.barcode-box image {
    width: 710rpx;
    height: 100%;
}

.code-text {
    font-size: 28rpx;
    line-height: 48rpx;
    margin-top: 10rpx;
    text-align: center;
    letter-spacing: 8rpx;
}

.selfTime-text {
    font-size: 28rpx;
    line-height: 48rpx;
    margin-top: 30rpx;
    text-align: center;
    margin-bottom: 40rpx;
}

.button-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 40rpx;
    border-bottom: 20rpx solid #f1f1f1;
    height: 108rpx;
}

.button-box button {
    background: #fff;
    height: 48rpx;
    padding: 0 32rpx;
    border: 1rpx solid #8b8b8c;
    font-size: 24rpx;
    line-height: 48rpx;
    margin: 0 20rpx 0 0;
}

.button-box button.another {
    color: #009f55;
    border: 2rpx solid #009f55;
}

.button-box button::after {
    border: 0;
}

.deliveryTimeStatement {
    border-bottom: 20rpx solid #f1f1f1;
    padding: 20rpx 40rpx;
    padding-top: 0;
}

.pickup-store {
    width: 676rpx;
    padding: 27rpx 18rpx 30rpx 18rpx;
    background: #fff;
    border-radius: 20rpx;
    margin: 0 auto 18rpx auto;
}

.pickup-store .title {
    font-size: 32rpx;
    line-height: 52rpx;
    color: #242424;
    font-family: Source Han Sans CN;
    font-weight: 500;
}

.selftake-time {
    font-size: 28rpx;
    line-height: 40rpx;
}

/* 商品信息 */

.goods-box {
    background: #fff;
    width: 672rpx;
    /* min-height: 692rpx; */
    padding: 0 20rpx 10rpx 20rpx;
    margin: 20rpx auto;
    background: #fff;
    border-radius: 20rpx
}
.sub-orders-box {
  border-radius: 20rpx;
}

.title-box {
    font-size: 32rpx;
    font-weight: 500;
    color: #242424;
    height: 90rpx;
    line-height: 90rpx;
    display: flex;
    align-items: center;
}
.title-box image {
  width: 28rpx;
  height: 28rpx;
  margin-right: 14rpx;
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
    padding: 0 0 30rpx 0;
    display: flex;
    justify-content: space-between;
}

.goods-item .goods-img {
    width: 108rpx;
    height: 108rpx;
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

.goods-item .goods-info {
    min-height: 108rpx;
    width: calc(100% - 128rpx);
    position: relative;
}
.payment-type .goods-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.goods-info .goods-name,
.goods-info .goods-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    line-height: 40rpx;
    max-width: 520rpx;
    display: block;
}

.goods-info .goods-name {
    font-size: 32rpx;
    line-height: 38rpx;
    height: 38rpx;
    color: #333;
    margin-top: 2rpx;
    font-weight: 400;
}
.goods-detail-info {
    display: flex;
    flex-direction: column;
    font-size: 20rpx;
    color: #999;
}
.goods-info .goods-label {
    font-size: 20rpx;
    margin-top: 2rpx;
    background: #FF5757;
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

.goods-info .goods-desc {
    font-size: 22rpx;
    line-height: 36rpx;
    height: 36rpx;
    color: #999;
}

.goods-info .number-price {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.goods-info .goods-count {
    font-size: 24rpx;
    color: #666666;
    font-weight: bold;
}

.goods-info .goods-count text:first-of-type {
    display: inline-block;
    min-width: 60rpx;
}

.goods-info .goods-count .refund-num {
    color: #FF4545;
    font-weight: 400;
    margin-left: 2rpx;
}

.goods-price {
    font-size: 28rpx;
    line-height: 36rpx;
    color: #333;
}

.goods-price .nowPrice {
    font-weight: bold;
}

.goods-price .oldPrice {
    font-size: 20rpx;
    color: #454545;
    margin-left: 18rpx;
    text-decoration: line-through;
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
    width: 712rpx;
    height: 26rpx;
    position: relative;
    left: 50%;
    margin-left: -356rpx;
}

.dividing-line image {
    width: 100%;
    height: 100%;
}

/* 赠品相关 */

.gift-box {
    background: #fff6f0;
    min-height: 80rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    color: #ff6131;
    font-size: 24rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10rpx;
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
    height: 86rpx;
    font-size: 28rpx;
    line-height: 86rpx;
    border-bottom: 1rpx solid #f1f1f1;
    text-align: right;
    display: flex;
    justify-content: space-between;
}
.good-type-box .section-box {
  border: none;
}
.section-box view text {
    color: #f9a72a;
    font-weight: bold;
}

.dispatching-fee {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* font-weight: bold; */
    color: #454545;
    font-size: 30rpx;
}

.dispatching-fee .left-icon {
    font-size: 24rpx;
    color: #009f55;
    border: 2rpx solid #009f55;
    font-weight: normal;
    border-radius: 6rpx;
    line-height: 36rpx;
    height: 36rpx;
    padding: 0 12rpx;
}

.bill-details {
    padding: 11rpx 0 6rpx 0;
}

.bill-details-item {
    height: 48rpx;
    line-height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bill-details .bill-details-item .title {
    font-size: 26rpx;
    color: #666666;
    display: flex;
}

.bill-details .bill-details-item .amount {
    font-size: 28rpx;
    color: #FD463B;
}

.bill-total {
    height: 80rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.bill-total .discount-amounts {
    font-size: 24rpx;
    color: #8b8b8c;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    height: 100%;
    padding-right: 20rpx;
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
    color: #FF8425;
}

.store-box {
    border-radius: 20rpx;
    background: #fff;
    width: 674rpx;
    padding: 0 20rpx 20rpx 20rpx;
    margin: 0 auto 18rpx auto;
}

.store-box .store-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.store-box .store-row .left {
    padding-top: 4rpx;
    padding-bottom: 5rpx;
    width: 500rpx;
}

.store-box .store-row .left .name {
    font-size: 30rpx;
    line-height: 52rpx;
    color: #242424;
}

.store-box .store-row .left .address {
    font-size: 24rpx;
    line-height: 36rpx;
    color: #4D4D4D;
}

.store-box .store-row .right {
    display: flex;
}

.store-box .store-row .right view {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 80rpx;
}

.store-box .store-row .right view.tel {
    margin-right: -20rpx;
    margin-left: 25rpx;
}

.store-box .store-row .right view.tel image {
    width: 36rpx;
    height: 40rpx;
}

.store-box .store-row .right view.address image {
    width: 40rpx;
    height: 40rpx;
}

.store-box .title,
.invoice-box .title {
    font-size: 32rpx;
    color: #242424;
    font-family: Source Han Sans CN;
    font-weight: 500;
    height: 60rpx;
    line-height: 60rpx;
    padding-top: 15rpx;
}

.contact-store {
    justify-content: flex-start;
    align-items: center;
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

.invoice-box {
    background: #fff;
    width: 674rpx;
    padding: 0 20rpx 20rpx 20rpx;
    margin: 0 auto 18rpx auto;
}

.invoice-box .row {
    color: #8b8b8c;
    line-height: 68rpx;
    height: 68rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    border-bottom: none;
}
.invoice-box .row text.color-454545 {
    width: 142rpx;
    text-align: left;
}

.order-box {
    background: #fff;
    width: 674rpx;
    padding: 0 20rpx 20rpx 20rpx;
    margin: 0 auto 18rpx auto;
    border-radius: 20rpx;
}

.order-box .title {
    display: flex;
    justify-content: space-between;
    font-size: 32rpx;
    color: #242424;
    font-family: Source Han Sans CN;
    font-weight: 500;
    height: 60rpx;
    line-height: 60rpx;
    padding-top: 15rpx;
}

.order-box .title .callPhone {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #FD463B;
}
.order-box .title .callPhone image{
    width: 40rpx;
    margin-right: 10rpx;
}
.order-box .row {
    color: #8b8b8c;
    line-height: 68rpx;
    min-height: 68rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    border-bottom: none;
}
.order-box .refund-row {
    align-items: flex-start;
}
.order-box .row text.color-454545 {
    width: 142rpx;
    text-align: left;
    flex: 0 0 auto;
}
.refund-list-line {
    text-align: right;
}
.refund-list {
    display: flex;
    text-align: right;
    align-items: center;
    justify-content: flex-end;
}
.order-box .order-code {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.refund-id {
    margin: 2rpx 15rpx;
    text-decoration: underline;
}
.order-box .order-code>view {
    font-size: 28rpx;
    padding-left: 19rpx;
    margin-left: 19rpx;
    position: relative;
}

.order-box .order-code>view::before {
    content: "";
    display: block;
    position: absolute;
    width: 1px;
    height: 20rpx;
    background: #CBCBCB;
    left: 0;
    top: 50%;
    margin-top: -10rpx;
}

.order-box .remarks {
    border-bottom: 0;
    min-height: 68rpx;
    height: auto;
    align-items: start;
}

.order-box .remarks .color-454545 {
    line-height: 48rpx;
}

.order-box .remarks>text:last-of-type {
    line-height: 48rpx;
    text-align: right;
}

.order-box .num-express {
    position: relative;
}
.order-box .num-express view.tracking-num {
    font-weight: 700;
}
.order-box .num-express view.tracking-num text:first-of-type {
    margin-right: 19rpx;
}

.order-box .num-express view.tracking-num text:last-of-type {
    position: relative;
    padding-left: 19rpx;
    display: inline-block;
}

.order-box .num-express view.tracking-num text:last-of-type::before {
    content: "";
    display: block;
    position: absolute;
    width: 1px;
    height: 20rpx;
    background: #CBCBCB;
    left: 0;
    top: 50%;
    margin-top: -10rpx;
}

.order-box .num-express text.trackingDetails {
    position: absolute;
    right: 0;
    top: 0;
}

.popup-content {
    width: 100%;
    border-radius: 6rpx;
    background: #fff;
    overflow: hidden;
    padding-top: 12rpx;
}

.popup-content .title {
    font-size: 32rpx;
    color: #454545;
    line-height: 80rpx;
    /* text-align: center; */
    border-bottom: 1px solid #f5f5f5;
}

.popup-content-box {
    color: #454545;
}

.price-detail {
    padding: 0 32rpx;
    font-size: 30rpx;
    border-bottom: 1px solid #f1f1f1;
}

.price-detail-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
    background: #009f55;
    font-weight: bold;
    text-align: center;
}

.share-raffle {
    position: fixed;
    right: 12rpx;
    bottom: 18%;
}

.share-raffle-img {
    width: 128rpx;
    height: 152rpx;
}

.share-raffle button {
    width: 128rpx;
    height: 152rpx;
    padding: 0;
    margin: 0;
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
}

.share-raffle button::after {
    border: 0;
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

.movable-view {
    width: 120rpx;
    height: 120rpx;
    position: fixed;
    right: 0;
    bottom: 240rpx;
}

.barcode-box-backGround {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #fff;
    /* transform: rotate(90deg); */
    z-index: 999;
    margin: auto;
}

.barcode-box-backGround .box {
    /* position: absolute;
  top: 2%;
  left: -75%;
  transform: translate(0, -50%); */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 1000rpx;
    height: 100%;
    transform: rotate(90deg);
}

.barcode-box-backGround .box .barcode-box {
    position: relative;
    top: 10%;
    width: 100%;
    height: 355rpx;
}

.barcode-box-backGround .box .barcode-box canvas {
    width: 100%;
    height: 100%;
}

.barcode-box-backGround .box .barcode-box image {
    width: 100%;
    height: 100%;
}

.barcode-box-backGround .box .code-text {
    position: relative;
    top: 10%;
    font-size: 38rpx;
    text-align: center;
    padding-top: 50rpx;
}

.mantle {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 10, 10, .6);
    z-index: 999;
}

.shouhouBox {
    width: 100%;
    height: 450rpx;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    padding: 0 30rpx;
    font-size: 31rpx;
    font-weight: 500;
    color: #404040;
    border-radius: 25rpx 25rpx;
    box-sizing: border-box;
}

.shouhouBox>text {
    display: inline-block;
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 36rpx;
}

.shouhouBox-active {
    width: 100%;
    height: 350rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.active-a {
    position: relative;
    width: 100%;
    font-size: 27rpx;
}

.active-a>view>image {
    width: 40rpx;
    height: 40rpx;
}

.active-one {
    height: 40rpx;
    line-height: 40rpx;
    display: flex;
}

.active-one text {
    margin-left: 20rpx;
}

.Noreceived,
.received {
    width: 100%;
    padding-left: 60rpx;
    box-sizing: border-box;
    color: #9AA6BA;
}

.arrow {
    width: 15rpx;
    height: 40rpx;
    position: absolute;
    top: 50%;
    right: 30rpx;
    transform: translateY(-50%);
}






    .tracking-item {
    width: 710rpx;
    /* border-radius: 24rpx; */
    background: #ffffff;
  }
  .tracking_content {
      padding: 0 20rpx;
  }
  .header {
    padding: 18rpx 24rpx;
    height: 200rpx;
    box-sizing: border-box;
    position: relative;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
  }
  
  .checkGoods {
    font-size: 16rpx;
    color: #cccccc;
    height: 40rpx;
    line-height: 40rpx;
    position: absolute;
    right: 27rpx;
    top: 25rpx;
    display: flex;
    align-items: center;
    text-align: center;
  }
  .trajectory {
      font-size: 28rpx;
      height: 30rpx;
      line-height: 30rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 20rpx 30rpx 0 0;
      color: #686868;
  }
  
  .header>view {
    color: #686868;
    font-size: 28rpx;
    line-height: 52rpx;
  }
  
  .header>view>text {
    margin-left: 25rpx;
  }
  .header>view>.copy_text {
    font-size: 28rpx;
  }
  
  .express-number {
    color: #686868;
  }
  
  .express-name {
    color: #686868;
  }
  
  .express-tel {
    color: #3297f3;
  }
  
  /* .express-number,
  .express-tel {
    font-size: 27rpx;
    font-weight: bold;
  } */
  
  .content {
    background: #ffffff;
    padding: 20rpx 21rpx 9rpx 20rpx;
    box-sizing: border-box;
    overflow-x: visible;
  }
  
  .ship-details {
    position: relative;
    width: 100%;
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;
  }
  
  .ship-details::before {
    content: "";
    display: block;
    height: 1px;
    background: #cccccc;
    width: 662rpx;
    position: absolute;
    left: 24rpx;
    top: 0;
  }
  
  .express-item {
    /* border-left: 2rpx solid #e7e7e7; */
    position: relative
  }
  .express-item::after {
      position: absolute;
      left: 17rpx;
      top: 0;
      content: '';
      width: 1px;
      height: 100%;
      background-color: #e7e7e7;
  }
  .express-item:last-of-type {
    border: none;
  }
  
  .express-icon-box {
    width: 45rpx;
    float: left;
    height: 100%;
    display: none;
  }
  
  .express-info {
    height: 100%;
    width: calc(100% - 46rpx);
    margin-left: 46rpx;
    border-bottom: 1rpx solid #dddddd;
    padding: 34rpx 0 34rpx 0;
    position: relative
  }
  
  .express-item image {
    width: 36rpx;
    height: 36rpx;
    position: absolute;
    left: 0rpx;
    top: 35rpx;
    z-index: 1;
  }
  
  .express-item:first-of-type .express-info {
    padding-top: 0;
    color: #000000;
  }
  
  .express-item:last-of-type .express-info {
    border: none;
  }
  
  .express-item:last-of-type image {
    top: -18rpx;
  }
  
  .express-item:first-of-type image {
    top: 0;
  }
  
  .express-info .time {
    margin-bottom: 16rpx;
    font-size: 24rpx;
    display: block;
  }
  
  .express-info .status {
    font-size: 30rpx;
  }
  
  .express-info .status>text {
    color: #2d9dff;
  }
  
  .express-info .time,
  .express-info .status {
    line-height: 36rpx;
    color: #999999
  }
  
  .express-item:first-of-type .express-info .time,
  .express-item:first-of-type .express-info .status {
    color: #000000;
  }
  
  .no-data {
    font-size: 28rpx;
    text-align: center;
    padding: 30% 0;
    color: #999;
  }
  .popup-content {
      height: auto;
      background: rgb(245, 245, 245);
      border-radius: 40rpx;
  }
  .popup-content .popup-title{
      font-size: 36rpx;
      padding: 30rpx 0;
      font-weight: 500;
      text-align: center;
  }
  .popup-hd{
      background-color: #ffffff;
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 40rpx;
  }
  .popup-bd{
      max-height: 528rpx;
      margin-top: 30rpx;
      overflow-y: auto;
      padding-bottom: 30rpx;
  }
  .popup-bd .item{
      display: flex;
      align-items: center;
      height: 177rpx;
      background: #ffffff;
      border-bottom: 1px solid rgb(245,245,245);
      padding: 0 40rpx;
  }
  .popup-bd .item .icon{
      width: 138rpx;
      height: 138rpx;
      margin-right: 30rpx;
      flex: 0 0 auto;
  }
  .popup-bd .item .icon image{
      display: block;
      width: 100%;
      height: 100%;
  }
  .popup-bd .item .textbox{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      flex: 1 0 auto;
  }
  .track_tabbar {
      display: flex;
  }
  .track_tabbar view {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      width: 150rpx;
      height: 60rpx;
      font-size: 26rpx;
      border: 1px solid #F4F4F4;
  }
  .track_tabbar .tab_active {
      border-bottom: 1px solid #fff;
  }
  .show_btn {
      width: 100%;
      font-size: 28rpx;
      text-align: center;
      padding: 10rpx 0;
  }

  
  .delivery .delivery-rt .top {
    font-weight: bold;
    font-size: 34rpx;
    color: #EB702D;
  }
  
  .delivery .delivery-rt .bottom {
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    margin-top: 8rpx;
  }
  
  .delivery-list .delivery-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 10rpx;
    margin-top: 20rpx;
    padding: 12rpx;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  .delivery-list .delivery-list-item .item-lt {
    display: flex;
    font-weight: 400;
    font-size: 28rpx;
    flex: 3 0 auto;
    color: #000000;
    /* justify-content: space-between; */
    margin-right: 40rpx;
  }
  
  .delivery-list .delivery-list-item .item-lt view:nth-of-type(2) {
    margin: 0 30rpx;
  }
  /* .delivery-list .delivery-list-item .item-lt view:nth-of-type(3) {
    margin-left: 60rpx;
  } */
  .delivery-list .delivery-list-item .item-rt {
    width: 130rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    text-align: center;
    color: #999999;
    flex: 1 1 auto;
  }
  
  .delivery-list .delivery-list-item .edit {
    border-radius: 30rpx;
    border: 1px solid #333;
    color: #333;
  }
  
  .delivery-list .delivery-list-item .progress {
    color: #23C257;
  }
  .spec-button-box {
    position: absolute;
    left: 75rpx;
    bottom: 40rpx;
    height: 98rpx;
    width: 600rpx;
    border-radius: 98rpx;
    overflow: hidden;
  }
  .spec-box {
    width: 100%;
    height: 750rpx;
    /* height: 800rpx; */
    margin-top: 80rpx;
    background: #fff;
    position: relative;
    border-radius: 30rpx 30rpx 0 0;
    padding: 0 30rpx;
    box-sizing: border-box;
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

  .spec-box {
    width: 100%;
    /* height: 750rpx; */
    height: 1183rpx;
    margin-top: 80rpx;
    background: #fff;
    position: relative;
    border-radius: 30rpx 30rpx 0 0;
    padding: 0 30rpx;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 138rpx;
    overflow-y: scroll;
  }
  .close-text {
    position: absolute;
    top: 42rpx;
    right: 32rpx;
    font-weight: 400;
    font-size: 28rpx;
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
    position: absolute;
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
  
  .goods-count-box>view.num {
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
  .spec-img-box image{
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
    color: #EB702D;
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
    font-size: 32rpx;
    color: #333333;
    margin: 40rpx 0 30rpx 0;
    text-align: center;
  }
  .close-text {

  }
  
  .spec-date .item-spec {
    /* flex: 0 1 auto; */
    display: inline-block;
    width: auto;
    margin-right: 40rpx;
    background: #EAEAEA;
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
  }
  
  .spec-time .content .item {
    width: 129rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
    background: #EAEAEA;
    border-radius: 10rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #333333;
  }
  
  
  .goods-info-box .goods-price{
    width: 100%;
    height: 105rpx;
    background-color: #EB702D;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    align-items: center;
    padding-left: 15rpx;
  }
  
  .goods-info-box .goods-price text:nth-of-type(1) {
    font-weight: 400;
    font-size: 30rpx;
  }
  
  .goods-info-box .goods-price text:nth-of-type(2) {
    display: inline-block;
    margin-left: 20rpx;
    margin-bottom: -4rpx;
    font-weight: 400;
    font-size: 30rpx;
    text-decoration: line-through;
    font-size: 24rpx;
  }
  
  .goods-info-box .goods-describe {
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    padding-left: 24rpx;
  }
  
.type-check-box {
  height: 70rpx;
  padding: 0 14rpx 20rpx 14rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}

.type-check-box>view {
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

.type-check-box>view.active {
  border-color: #fbbe35;
  color: #fbbe35;
}

.type-check-box>view image {
  width: 33rpx;
  height: 33rpx;
  margin-right: 10rpx;
}

.type-check-box .self-take image {
  width: 25rpx;
  height: 36rpx;
}

.type-check-box>view:last-of-type {
  margin-right: 0;
}

  .good-type-box .good-type-config-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 28rpx;
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
  }
  .good-type-box .store-info {
    padding: 0;
    border: none;
  }
  .good-type-box .good-type-config-item .store-details image {
    height: 30rpx;
    margin-left: 22rpx;
  }
  .good-type-box .good-type-config-item > view:first-of-type {
    font-size: 28rpx;
    color: #000;
  }
  
/* 自提时间 */
.time-picker {
  width: 100%;
  background: #fff;
}

.time-picker>view {
  height: 64rpx;
  line-height: 64rpx;
  font-size: 28rpx;
  border-top: 2rpx dotted #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #4d4d4d;
  text-align: right;
  position: relative;
  /* padding-right: 23rpx; */
}

.time-picker>view view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.time-picker>view .left-icon {
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
.good-type-box .bill-details {
  border-bottom: 1px solid #eee;
  height: 50rpx;
}
.good-type-config-item {
  min-height: 70rpx;
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
  color: #FD463B;
  font-weight: bold;
  margin: 0 12rpx 0 12rpx;
  font-size: 28rpx;
}

.pay-item .right .amount-box {
  color: #FD463B;
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
  color: #FFFFFF;
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
  color: #FD3A2E;
  height: 41rpx;
  /* background: rgba(253, 70, 59, 0.9); */
  position: relative;
}

.pay-item .right.coupon .right-point {
  margin-left: 20rpx;
}

.bill-details1 {
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-bottom: 20rpx; */
}
.bill-details1 view.discount-amounts {
  font-size: 24rpx;
  color: #a8a8a8;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details1 view.discount-amounts image {
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
  color: #FF8425;
}
.goods-img-box {
  display: flex;
}
.goods-img-box .goods-img {
  margin-right: 20rpx;
}
.good-num {
  color: #999999;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}
.good-num image {
  margin: 0;
  margin-left: 12rpx;
}

.payment-type {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.4);
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
.model-body .goods-left .goods-desc {
  width: 320rpx;
  display: block;
}

.model-body .goods-info .goods-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.good-type-title {
  font-weight: 700;
  font-size: 32rpx;
  padding-top: 20rpx;
  margin-bottom: 16rpx;
}
.navigation {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  height: 100%;
  justify-content: center;
}

.navigation image {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 8rpx;
  flex: 0 0 auto;
}
.navigation-box {
  position: relative;
}
.navigation-box .title {
  margin-right: 100rpx;
}
.self-address {
  font-size: 28rpx;
  line-height: 40rpx;
  /* color: #999; */
  margin-right: 100rpx;
}
.order-btn-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15rpx;
}
.order-btn-box button {
  background-color: #ECECEC !important;
  min-width: 188rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  color: #333333 !important;
  border: none !important;
  padding: 0 16rpx !important;
  display: flex;
  align-items: center;
  margin-right: 0;
}
.order-icon {
  height: 29rpx;
  width: auto;
  margin-right: 12rpx;
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
  width: 680rpx;
  padding: 36rpx 0 0 0;
  min-height: 356rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  position: relative;
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
  color: #676666;
  padding: 0 20rpx;
  margin-top: 30rpx;
}

.number-modal-content .button-box {
  display: flex;
  width: 100%;
  height: 88rpx;
  /* position: absolute; */
  /* bottom: 0; */
  margin: 30rpx 0 0;
  border: 1rpx solid #EFEFEF;
  padding: 0;
}

.number-modal-content .button-box button {
  flex: 1 0 auto;
  font-size: 30rpx;
  height: 106rpx;
  line-height: 106rpx;
  background: #fff;
  border-radius: 0;
  border: none;
  margin: 0;
  border-top: 1rpx solid #e5e5e5;
}

.number-modal-content .button-box .confirm {
  color: #fff;
}

.number-modal-content .button-box .cancel {
  box-sizing: border-box;
  color: #000;
  border-right: 1rpx solid #e5e5e5;
}
.content-title {
  font-size: 28rpx;
  line-height: 44rpx;
  color: #000;
  margin: 25rpx 0 20rpx;
  text-indent: 30rpx;
}
.content-config-item {
  background-color: #F4F4F4;
  border-radius: 20rpx;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
}
.content-config-item .right-point {
  margin: 0;
}
.content-config-item textarea {
  height: 120rpx;
}
.gradeImg {
  height: 28rpx;
  width: auto;
  max-width: 100%;
  margin-right: 13rpx;
}
.goods-info .gradeImgbox {
  display: flex;
  align-items: center;
}
.self-code-img {
  width: 100%;
  height: auto;
  max-height: 250rpx;
}
</style>