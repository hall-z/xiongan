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
import { clearSpace, routeTo, isUnder16 } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import useLogin from '../../pages/login/utils/useLogin'
import { useUserStore } from '@/store'
import business from './hooks/business'
import dayjs from 'dayjs'
const { userInfo } = useUserStore()
const { sendZhMxGrywmxxxInfo, sendGgXxGrjbxxInfo, businessData, housingInfo } = business()
// const time = ref<any[]>(['', ''])
const tab = ref<string>('')
const tabList = ref([
  {
    title: '全部',
    value: '',
  },
  {
    title: '缴存',
    value: '2',
  },
  {
    title: '提取',
    value: '1',
  },
  {
    title: '其他',
    value: '9',
  },
])
const eye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/8ba021f5-c8ab-4425-ab0d-357f87c6e671dd.png',
)
const deye = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/f91f821c-d999-4a0a-8b1a-be7ca458a3d9ee.png',
)
const maxDate = Date.now()
const minDate = dayjs().subtract(1, 'year').valueOf()

const time = ref<number[]>([dayjs().subtract(1, 'year').valueOf(), Date.now()])
const navTitle = ref('业务明细')
const isLook = ref(false)
const formStartDate = ref('')
const formEndDate = ref('')
const jylxDate: any = ref('')
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
function handleChange(value) {
  jylxDate.value = tabList.value[value.index].value
  paging.value.reload()
  console.log('handleChange', value)
}

function handleClear() {
  formStartDate.value = ''
  formEndDate.value = ''
  time.value = [dayjs().subtract(1, 'year').valueOf(), Date.now()]
  paging.value.reload()
}
const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const currentDate = dayjs()
  const currentDateFormatted = currentDate.format('YYYY-MM-DD')
  const lastYearDate = dayjs().subtract(1, 'year')
  const lastYearDateFormatted = lastYearDate.format('YYYY-MM-DD')
  const params = {
    zjhm: userInfo.idCardNumber,
  }
  // const date:any= await sendGgXxGrjbxxInfo(params)
  const data = {
    page: pageNo,
    size: pageSize,
    kssj: formStartDate.value === '' ? lastYearDateFormatted : formStartDate.value,
    jssj: formEndDate.value === '' ? currentDateFormatted : formEndDate.value,
    khbh: housingInfo.value.khbh,
    jylx: jylxDate.value,
  }
  // 调用接口获取数据
  try {
    await sendZhMxGrywmxxxInfo(data)
    console.log('businessData.value', businessData.value)
    paging.value.complete(businessData.value.data)
  } catch (error) {
    paging.value.complete([])
  }
}
onShow(() => {})
onLoad((options) => {
  // navTitle.value = decodeURIComponent(options.title)
})
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
        <view>个人业务明细</view>
        <view>
          <view @click="changeLook(false)" style="padding: 0px 5px 5px 5px" v-if="isLook">
            <img :src="eye" alt="" class="w-17px h-13px" />
          </view>
          <view @click="changeLook(true)" style="padding: 0px 5px 5px 5px" v-else>
            <img :src="deye" alt="" class="w-15px h-6px" />
          </view>
        </view>
      </view>
      <view class="businessBottom">
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
        <wd-tabs v-model="tab" @change="handleChange">
          <block v-for="item in tabList" :key="item.value">
            <wd-tab :title="item.title"></wd-tab>
          </block>
        </wd-tabs>
      </view>
      <view class="bg-#fff p-12px" v-if="dataList.length > 0">
        <view
          v-for="(item, index) in dataList"
          :key="index"
          class="mb-15px box-border bg-#F5F6F8 p-15px"
        >
          <view>
            <view>
              <view class="businTitle">{{ item.zyms }}</view>
              <view class="businTime">
                <view class="time">{{ item.jysj }}</view>
                <view class="price" v-if="!isLook">**********元</view>
                <view class="price" v-else>{{ item.fse ? item.fse : '0.00' }}元</view>
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
  padding: 15px;
  .accountMiddle {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 67px;
    // margin-top: 18px;
    padding: 14px 20px 36px 20px;
    color: #fff;
    background: linear-gradient(95deg, #2d69ef 0%, #46a9ff 72%, #2d69ef 100%);
    border-radius: 12px 12px 12px 12px;
  }
  .businessBottom {
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
    .line {
      border: 1px dashed #c9c9c9;
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
  .businTitle {
    overflow: hidden;
    font-size: 14px;
    color: #000;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; // 默认不换行；
  }
  .businTime {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .time {
      font-size: 12px;
      color: #999999;
    }
    .price {
      font-size: 14px;
      color: #000;
    }
  }
}
</style>
