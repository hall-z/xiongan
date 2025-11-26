<script lang="ts" setup>
import { getCardApplyUser, getCardBasicInfo2, getCardScheduleInfo } from '@/service/api/cardServe'
import sbbhZwBg from '@/static/images/serve/sbbhZwBg.png'
import { useUserStore } from '@/store/user'
import { dataDesensitization, routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { useMessage } from 'wot-design-uni'
import useCardpress from '../hooks/useCardpress'
import { cardInfoProps } from '../types/types'
const {
  cardQury,
  model,
  cardInfoData,
  submitStatus,
  statusDel,
  serchBtnStatus,
  sendCardMail,

  cardMailData,
  reset,
} = useCardpress()

const message = useMessage()
const visible = ref<boolean>(false)

const enableList: any = ref([])

// 卡信息查询
const { loading: loadingCard, send: sendCard } = useRequest(
  (data) => getCardBasicInfo2<cardInfoProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

const data = ref([
  {
    title: '申领状态:',
    value: '',
    prop: 'zkjd',
  },
  {
    title: '状态更新时间:',
    value: '',
    prop: 'date',
  },
])
const data1 = ref([
  {
    title: '网点名称:',
    value: '',
    prop: 'wdName',
  },
  {
    title: '领取渠道:',
    value: '',
    prop: 'lqqd',
  },
  {
    title: '邮寄单号:',
    value: '',
    prop: 'yjdh',
    action: 'copy',
  },
  {
    title: '邮寄公司:',
    value: '',
    prop: 'yjCompany',
  },
])
const outherData = ref<any>(null)

const suMit1 = ref(true)

// 获取代办人信息查询
const { send: getCardQury, onSuccess: cardQuerySucess } = useRequest(
  (data) => getCardApplyUser(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)

const { send: sendCardScheduleInfo } = useRequest((data) => getCardScheduleInfo(data), {
  immediate: false,
  loading: false,
  initialData: {},
})
watchEffect(async () => {
  if (submitStatus.value) {
    message
      .alert({
        closeOnClickModal: false,
        msg: statusDel.value.msg,
        title: '提示',
        confirmButtonText: '确定',
      })
      .then(() => {
        if (!statusDel.value?.msg) {
          uni.navigateBack()
        }
        submitStatus.value = false
        serchBtnStatus.value = false
      })
  }
  if (cardInfoData.value) {
    try {
      const rdata: any = await sendCardMail()
      outherData.value = rdata.data
    } catch (error) {
      cardMailData.value = null
    }
  }
})
const goList = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaoksl', title: '社保卡申领信息' },
  })
}
const { userInfo } = useUserStore()
const serchData = ref({
  dbrZjhm: userInfo.idCardNumber,
  applyType: '2',
})
const getCardQuryDataFun = async () => {
  try {
    const res: any = await getCardQury(serchData.value)
    console.log('getCardQuryDataFun', res)
    enableList.value = res
    enableList.value.forEach(async (item: any) => {
      const res: any = await sendCardScheduleInfo({
        xm: item.name,
        zjhm: item.idCardNumber,
        shbzhm: '',
      })
      item.isShow = res?.data?.code !== '500'
    })
    console.log('55555====', enableList.value)
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  model.value.xm = userInfo.cardNameTm
  model.value.zjhm = userInfo.idCardNumberTm
  getCardQuryDataFun()
})
onUnmounted(() => {
  serchBtnStatus.value = false
  cardInfoData.value = null
  reset()
})
</script>
<template>
  <view class="px-15px">
    <view>
      <view class="enableTitleBox">本人制卡进度查询</view>
      <view class="enableCardBox rounded-10px overflow-hidden bg-#fff">
        <view class="topBox topBox2">
          <view>{{ model.xm }}</view>
          <view
            class="detailBtu"
            @click="cardQury('1', { idCardNumber: userInfo.idCardNumber, name: userInfo.cardName })"
          >
            进度查看
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </view>
        </view>
        <view class="enableBottom">
          <view>
            <view class="txt">身份证号：{{ model.zjhm }}</view>
          </view>
        </view>
      </view>
      <view class="enableTitleBox">
        代办制卡进度查询
        <text v-if="enableList?.length > 0">
          ({{ enableList?.filter((i) => i.isShow).length }}张)
        </text>
      </view>
      <view v-if="enableList.length > 0">
        <template v-for="(item, index) in enableList" :key="index">
          <view
            class="enableCardBox enableCardBox2 rounded-10px overflow-hidden bg-#fff"
            v-if="item.isShow"
          >
            <view class="topBox topBox2">
              <view>{{ dataDesensitization(item.name, false, 'userName') }}</view>
              <view class="detailBtu" @click="cardQury('2', item)">
                进度查看
                <wd-icon name="arrow-right" size="14px"></wd-icon>
              </view>
            </view>
            <view class="enableBottom">
              <view>
                <view class="txt">
                  身份证号：{{ dataDesensitization(item.idCardNumber, false, 'right') }}
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <view class="enableZwBox" v-else>
        <wd-img style="margin-top: 20px" width="160" height="90" :src="sbbhZwBg"></wd-img>
        <view class="zwText">您暂无代办社保卡</view>
        <view class="goDb" @click="goList">【如需代办请点击这里】</view>
      </view>
      <!-- <view class="rounded-10px overflow-hidden bg-#fff">
        <wd-form ref="form" :model="model">
          <wd-cell-group border>
            <wd-input
              label="姓名:"
              label-width="100px"
              type="text"
              v-model="model.xm"
              placeholder="请输入姓名"
              :rules="rules.xm"
              prop="xm"
              custom-input-class="custom-input-right"
              readonly
            />
            <wd-input
              label="身份证号码:"
              label-width="100px"
              type="text"
              v-model="model.zjhm"
              placeholder="请输入身份证号码"
              :rules="rules.zjhm"
              prop="zjhm"
              custom-input-class="custom-input-right"
              readonly
              :maxlength="18"
              :mixlength="16"
            />
            <wd-number-keyboard
              v-model:visible="visible"
              v-model="model.zjhm"
              :maxlength="18"
              extra-key="X"
              close-text="完成"
            ></wd-number-keyboard>
          </wd-cell-group>
        </wd-form>
      </view> -->
      <!-- <view class="mt-20px">
        <wd-button
          type="primary"
          :round="false"
          size="medium"
          @click="cardQury(form)"
          block
          :loading="loading"
          v-if="suMit1"
        >
          查 询
        </wd-button>
        </view> -->
      <!-- <view class="mt-20px flex justify-center">
          <wd-text
            text="未成年人申领进度查询"
            type="primary"
            decoration="underline"
            @click="juvenClick(form)"
          />
        </view> -->
      <!-- </view> -->
    </view>
    <!-- <view v-if="cardInfoData && !loading">
      <view class="rounded-10px overflow-hidden bg-#fff">
        <wd-cell-group title="查询到您的制卡进度信息" border>
          <wd-cell
            :title="item.title"
            :value="cardInfoData[item.prop]"
            border
            v-for="(item, index) in data"
            :key="index"
          ></wd-cell>
          <template v-if="outherData">
            <template v-for="(item, index) in data1">
              <wd-cell :title="item.title" border :key="index" v-if="outherData[item.prop]">
                <view>
                  <view class="flex gap-10px items-center justify-end">
                    <text>{{ outherData[item.prop] }}</text>
                    <wd-icon
                      name="file-copy"
                      size="18px"
                      color="#1890ff"
                      v-if="item.action && item.action === 'copy'"
                      @click="SetClipboardData(outherData[item.prop])"
                    ></wd-icon>
                  </view>
                </view>
              </wd-cell>
            </template>
          </template>
        </wd-cell-group>
      </view>
      <view class="mt-20px">
        <wd-button type="primary" :round="false" size="medium" @click="back" block>返 回</wd-button>
      </view>
    </view> -->
  </view>
  <wd-message-box></wd-message-box>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-input__error-message) {
  @apply text-right!;
}
:deep(.custom-input-right) {
  @apply text-right! color-#999999!;
}
.enableTitleBox {
  display: flex;
  align-items: center;
  margin: 15px 0;
  font-size: 16px;
  font-weight: 700;
  color: #2d69ef;
  &::before {
    display: block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    content: '';
    border: 2px solid #2d69ef;
    border-radius: 50%;
  }
}
.enableCardBox {
  position: relative;
  padding: 15px;
  .wd-input {
    padding: 0px !important;
    padding-right: 45px !important;
    :deep(.wd-input__label-inner) {
      font-size: 14px !important;
      color: #888888 !important;
    }
    :deep(.uni-input-input) {
      text-align: left !important;
    }
  }
  .topBox {
    padding-bottom: 10px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px dashed #bdbdbd;
  }
  .topBox2 {
    display: flex;
    justify-content: space-between;
    .detailBtu {
      font-size: 12px;
      color: #2d69ef;
      cursor: pointer;
    }
  }
  .txt {
    margin-top: 11px;
    font-size: 14px;
    color: #888888;
  }
  .tag {
    position: absolute;
    top: 0;
    right: 0;
    width: 68px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    border-radius: 0pt 5px 0pt 15px;
  }
  .tag1 {
    color: #fff;
    background-color: #2d69ef;
  }
  .tag2 {
    color: #7d7d7d;
    background-color: #e2e3e4;
  }
  .enableBottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.enableCardBox2 {
  margin-top: 15px;
}
.enableZwBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  .zwText {
    margin: 8px 0px;
    color: #333333;
  }
  .goDb {
    color: #2d69ef;
    cursor: pointer;
  }
}
.tsBox {
  padding: 15px;
  background-color: #f2f3f7;
  border-radius: 5px;
}
</style>
