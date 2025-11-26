<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
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

<script lang="ts" setup>
import { clearSpace, routeTo, isUnder16, dataDesensitization } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import useLogin from '../../pages/login/utils/useLogin'
import { useUserStore } from '@/store'
import business from './hooks/business'
import dayjs from 'dayjs'
const { userInfo } = useUserStore()
const { sendSzzfgjjDkMxDkhkmxInfo, loanData, repaysData, housingInfo } = business()
// const time = ref<any[]>(['', ''])
const tab = ref<string>('')

const eye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/8ba021f5-c8ab-4425-ab0d-357f87c6e671dd.png',
)
const deye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/f91f821c-d999-4a0a-8b1a-be7ca458a3d9ee.png',
)
const maxDate = Date.now()
const minDate = dayjs().subtract(1, 'year').valueOf()

const time = ref<number[]>([dayjs().subtract(1, 'year').valueOf(), Date.now()])
const navTitle = ref('个人贷款还款明细')
const isLook = ref(false)
const formStartDate = ref('')
const formEndDate = ref('')
const jylxDate: any = ref('')
const jkbh = ref('')
function changeLook(e) {
  isLook.value = e
}
function handleConfirm(value) {
  // YYYY-MM-DD HH:mm:ss
  formStartDate.value = dayjs(value.value[0]).format('YYYY-MM-DD')
  formEndDate.value = dayjs(value.value[1]).format('YYYY-MM-DD')
  console.log('formStartDate', formStartDate.value)
  console.log('formEndDate', formEndDate.value)
  paging.value.reload()
}

function handleClear() {
  formStartDate.value = ''
  formEndDate.value = ''
  time.value = [dayjs().subtract(1, 'year').valueOf(), Date.now()]
  paging.value.reload()
}
const paging = ref(null)
const dataList = ref([
  {
    zyms: '张三',
    jysj: '',
    fse: 0,
  },
])
const queryList = async (pageNo, pageSize) => {
  const currentDate = dayjs()
  const currentDateFormatted = currentDate.format('YYYY-MM-DD')
  const lastYearDate = dayjs().subtract(1, 'year')
  const lastYearDateFormatted = lastYearDate.format('YYYY-MM-DD')
  console.log('loanData', loanData.value)
  jkbh.value = loanData.value ? loanData.value.data[0].jkbh : ''
  const params = {
    zjhm: userInfo.idCardNumber,
  }
  const data = {
    page: pageNo,
    size: pageSize,
    jkbh: jkbh.value,
    kssj: formStartDate.value === '' ? lastYearDateFormatted : formStartDate.value,
    jssj: formEndDate.value === '' ? currentDateFormatted : formEndDate.value,
  }
  // 调用接口获取数据
  try {
    await sendSzzfgjjDkMxDkhkmxInfo(data)
    console.log('repaysData.value', repaysData.value)
    paging.value.complete(repaysData.value.data)
  } catch (error) {
    paging.value.complete([])
  }
}
onShow(() => {})
onLoad((options) => {})
onMounted(() => {})
</script>

<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :refresher-enabled="false"
    :show-pull-down="false"
    :auto-show-system-loading="true"
    :paging-style="{
      boxSizing: 'border-box',
    }"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    </template>
    <view class="accountBox">
      <view class="accountMiddle">
        <view>
          <view>个人贷款还款明细</view>
          <view class="color-#A5D9EC font-size-12px mt-8px" v-if="!isLook">
            借款编号： {{ dataDesensitization(jkbh, false, 'right') }}
          </view>
          <view class="color-#A5D9EC font-size-12px mt-8px" v-else>借款编号：{{ jkbh }}</view>
        </view>
        <view>
          <view @click="changeLook(false)" style="padding: 0px 5px 5px 5px" v-if="isLook">
            <img :src="eye" alt="" class="w-17px h-13px" />
          </view>
          <view @click="changeLook(true)" style="padding: 0px 5px 5px 5px" v-else>
            <img :src="deye" alt="" class="w-15px h-6px" />
          </view>
        </view>
      </view>
      <view class="loanBottom">
        <wd-datetime-picker
          label=""
          placeholder="请选择时间"
          type="date"
          v-model="time"
          :maxDate="maxDate"
          @confirm="handleConfirm"
        />
        <!-- <view class="clearBox" @click="handleClear" v-if="formStartDate != ''">
          <wd-icon name="error-fill" size="16px" color="#c9c9c9"></wd-icon>
        </view> -->
        <view class="line"></view>
      </view>
      <view class="bg-#fff p-12px" v-if="dataList.length > 0">
        <view
          v-for="(item, index) in dataList"
          :key="index"
          class="mb-15px box-border bg-#F5F6F8"
          style="position: relative; border-radius: 6px"
        >
          <view>
            <view>
              <view class="loanTime">
                <view class="time">{{ item.jzrq }}</view>
                <view class="repayment">
                  还款期次
                  <text class="font-size-18px ml-3px" style="font-weight: bold">
                    {{ item.dqqc }}
                  </text>
                </view>
              </view>
              <view class="loanCont">
                <view style="line-height: 25px" class="pr-10px amountRightBox">
                  <view>
                    <text class="color-#999999">本金金额：</text>
                    <text class="color-#333333" v-if="!isLook">
                      *****
                      <text class="font-size-12px">元</text>
                    </text>
                    <text class="color-#333333" v-else>
                      {{ item.bjje }}
                      <text class="font-size-12px">元</text>
                    </text>
                  </view>
                  <view>
                    <text class="color-#999999">利息金额：</text>
                    <text class="color-#333333" v-if="!isLook">
                      *****
                      <text class="font-size-12px">元</text>
                    </text>
                    <text class="color-#333333" v-else>
                      {{ item.lxje }}
                      <text class="font-size-12px">元</text>
                    </text>
                  </view>
                  <view>
                    <text class="color-#999999">罚息金额：</text>
                    <text class="color-#333333" v-if="!isLook">
                      *****
                      <text class="font-size-12px">元</text>
                    </text>
                    <text class="color-#333333" v-else>
                      {{ item.fxje }}
                      <text class="font-size-12px">元</text>
                    </text>
                  </view>
                </view>
                <view class="line"></view>
                <view class="pl-10px amountIncurred">
                  <view class="mb-10px">发生额</view>
                  <text class="color-#333333 font-size-18px" v-if="!isLook">
                    *****
                    <text class="font-size-12px">元</text>
                  </text>
                  <text class="color-#333333 font-size-18px" v-else>
                    {{ item.fse }}
                    <text class="font-size-12px">元</text>
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(0deg, #f2f3f7 0%, #f2f3f7 60%, #b8d7ff 100%);
}
.accountBox {
  //
  padding: 15px;
  .accountMiddle {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 100px;
    // margin-top: 18px;
    padding: 14px 20px 36px 20px;
    color: #fff;
    background: linear-gradient(95deg, #2d69ef 0%, #46a9ff 72%, #2d69ef 100%);
    border-radius: 12px 12px 12px 12px;
  }
  .loanBottom {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 0px 0px 0px;
    margin-top: -20px;
    background-color: #f5f6f8;
    border-radius: 12px 12px 0px 0px;
    .clearBox {
      position: absolute;
      top: 24px;
      right: 20px;
    }
    :deep(.wd-picker__cell) {
      background-color: #f5f6f8;
    }
    :deep(.wd-tabs__nav) {
      background-color: #f5f6f8;
    }
    .accountList {
      display: flex;
      justify-content: space-between;
      height: 48px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 48px;
      color: #333333;
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .loanTime {
    height: 39px;
    padding-left: 15px;
    line-height: 39px;
    border-bottom: 1px dashed #cacaca;
    .time {
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      color: #000;
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; // 默认不换行；
    }
    .repayment {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 102px;
      height: 33px;
      font-size: 12px;
      line-height: 33px;
      color: #f5f6f8;
      text-align: center;
      background: #2d69ef;
      border-radius: 0px 6px 0px 33px;
    }
  }
  .loanCont {
    display: flex;
    padding: 15px;
    .line {
      margin: 0 10px;
      border: 1px dashed #c9c9c9;
    }
    .amountIncurred {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 120px;
      font-size: 14px;
    }
    .amountRightBox {
      width: 240px;
    }
  }
}
</style>
