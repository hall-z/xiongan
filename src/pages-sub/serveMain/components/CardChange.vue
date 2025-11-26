<script lang="ts" setup>
import { occupationList } from '@/pages-sub/serveMain/types/dict'
import dayjs from 'dayjs'
import { useMessage } from 'wot-design-uni'
import useCardChange from '../hooks/useCardChange'

const minStartDate = dayjs().subtract(30, 'year').valueOf()
const maxStartDate = dayjs().valueOf()

const minEndDate = dayjs().subtract(5, 'year').valueOf()
const maxEndDate = dayjs().add(20, 'year').valueOf()

const {
  model,
  rules,
  loading,
  cardChangeInfo,
  changeSubmit,
  submitStatus,
  statusDel,
  serchBtnStatus,
  cardQury,
} = useCardChange()

const form = ref(null)

const visible = ref<boolean>(false)

function showKeyBoard() {
  visible.value = true
}

const message = useMessage()
const defaultValue = ref<number>(Date.now())

// 错误提示
watchEffect(() => {
  if (submitStatus.value) {
    message
      .alert({
        closeOnClickModal: false,
        msg: statusDel.value?.msg,
        title: '提示',
        confirmButtonText: '确定',
      })
      .then(() => {
        // if (!statusDel.value?.msg) {
        //   uni.navigateBack()
        // }
        submitStatus.value = false
        serchBtnStatus.value = false
        uni.navigateBack()
      })
  }
})
onMounted(async () => {
  cardChangeInfo.value.address = ''
  cardChangeInfo.value.phone = ''
  cardChangeInfo.value.cardStartTime = ''
  cardChangeInfo.value.cardEndTime = ''
  cardChangeInfo.value.zy = ''
  await cardQury()
  console.log('cardChangeInfo', cardChangeInfo.value)
})
onUnmounted(async () => {
  serchBtnStatus.value = true
})
</script>
<template>
  <view class="p-15px">
    <!-- <view v-if="false">
      <view class="rounded-10px overflow-hidden bg-#fff">
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
              disabled
              @click="showKeyBoard"
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

            <wd-input
              label="社会保障卡号:"
              label-width="100px"
              type="text"
              v-model="model.shbzhm"
              prop="shbzhm"
              :rules="rules.shbzhm"
              placeholder="请输入社会保障卡号"
              custom-input-class="custom-input-right"
            />
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="mt-20px">
        <wd-button
          type="primary"
          :round="false"
          size="medium"
          @click="cardQury(form)"
          block
          :loading="loading"
        >
          查 询
        </wd-button>
      </view>
    </view> -->
    <!-- v-if="serchBtnStatus && !loading" -->
    <view class="mt-[-10px]">
      <view class="rounded-10px overflow-hidden bg-#fff">
        <!-- <wd-cell-group title="基础信息" border>
          <wd-form ref="form2" :model="cardChangeInfo">
            <wd-cell-group>
              <wd-input
                label="姓名:"
                label-width="100px"
                type="text"
                v-model="cardChangeInfo.xm"
                custom-class="custom-cell"
                custom-input-class="custom-input-right"
                readonly
              />
              <wd-input
                label="证件号码:"
                label-width="100px"
                type="text"
                v-model="cardChangeInfo.zjhm"
                custom-class="custom-cell"
                custom-input-class="custom-input-right"
                readonly
              />
              <wd-picker
                :columns="sexList"
                custom-value-class="custom-input-right"
                label="性别"
                v-model="cardChangeInfo.xb"
                readonly
              />
              <wd-picker
                :columns="regionList"
                custom-value-class="custom-input-right"
                label="国籍/地区"
                v-model="cardChangeInfo.gj"
                readonly
              />
              <wd-picker
                :columns="ethniCodeList"
                custom-value-class="custom-input-right"
                label="民族"
                v-model="cardChangeInfo.mz"
                readonly
              />
            </wd-cell-group>
          </wd-form>
        </wd-cell-group> -->
        <!-- <wd-gap height="10" bg-color="#f5f5f5"></wd-gap> -->
        <wd-cell-group title="可修改信息" border>
          <wd-form ref="form" :model="cardChangeInfo">
            <wd-cell-group>
              <wd-textarea
                label="居住地址:"
                label-width="100px"
                v-model="cardChangeInfo.address"
                placeholder="请输入居住地址"
                custom-class="custom-cell"
                custom-textarea-class="custom-input-right"
                auto-height
                :maxlength="50"
              />
              <wd-input
                label="联系方式:"
                label-width="100px"
                type="text"
                v-model="cardChangeInfo.phone"
                placeholder="请输入联系方式"
                custom-class="custom-cell"
                custom-input-class="custom-input-right"
              />
              <wd-datetime-picker
                type="date"
                label-width="150px"
                custom-value-class="custom-input-right"
                label="证件有效期起始日期"
                :min-date="minStartDate"
                :max-date="maxStartDate"
                v-model="cardChangeInfo.cardStartTime"
                align-right
              />
              <wd-datetime-picker
                type="date"
                label-width="150px"
                custom-value-class="custom-input-right"
                label="证件有效期终止日期"
                v-model="cardChangeInfo.cardEndTime"
                align-right
                :maxDate="maxEndDate"
                :minDate="minEndDate"
              />
              <wd-picker
                label="职业"
                :columns="occupationList"
                custom-value-class="custom-input-right"
                placeholder="请选择职业"
                v-model="cardChangeInfo.zy"
                :rules="rules.zy"
              />
            </wd-cell-group>
          </wd-form>
        </wd-cell-group>
      </view>
      <view class="mt-20px">
        <wd-button type="primary" :round="false" size="medium" @click="changeSubmit(form)" block>
          提 交
        </wd-button>
      </view>
    </view>
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
</style>
