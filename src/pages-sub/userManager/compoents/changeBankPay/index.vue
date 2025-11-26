<script lang="ts" setup>
import { addOrUpdateUserBankcard, getUserBankcardList } from '@/service/api/userMessage'
import { changeDict, dataDesensitization } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni/index'
import { bankType } from '../../bankCard/types/dict'
import yhlogo from '../../static/images/bank/outher2.png'
const toast = useToast()
const message = useMessage()
const emit = defineEmits<{
  (e: 'update:showBank', value: any): string
  (e: 'update:modelValue', value: any): string
  (e: 'update:bankInfo', value: any): string
}>()

const props = defineProps({
  showBank: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const show = ref(false)
const cBackIndex = ref(0)
const cBack = ref()
const bankListData = ref([])
const handleBankClick = (item, index) => {
  console.log(item)
  cBackIndex.value = index
  cBack.value = item
  closeChangeBank()
}

const closeChangeBank = async () => {
  show.value = false
  emit('update:showBank', false)
  emit('update:modelValue', cBack.value?.bankId)
  emit('update:bankInfo', cBack.value)
  if (cBack.value?.bankId) {
    const res = await addOrUpdateUserBankcard({
      bankId: cBack.value.bankId,
      cardId: cBack.value.cardId,
    })
    if (res) {
      toast.success('设置成功')
    }
  }
}
const getBankList = async () => {
  const res: any = await getUserBankcardList({
    page: 1,
    pageSize: 100,
  })
  bankListData.value = res
  cBack.value = res[0]
  if (!props.showBank) {
    emit('update:bankInfo', cBack.value)
    emit('update:modelValue', cBack.value?.bankId)
  }
}

getBankList()
const init = () => {
  show.value = props.showBank
  if (props.showBank) {
    getBankList()
  }
}

watch(
  () => props.showBank,
  (newVal) => {
    init()
  },
  { immediate: true },
)
</script>

<template>
  <!-- 可选银行列表 -->
  <wd-popup
    v-model="show"
    position="bottom"
    @close="closeChangeBank"
    custom-class="rounded-t-10px pt-10px"
    :safe-area-inset-bottom="true"
  >
    <view class="rounded-10px overflow-hidden">
      <view class="py-10px px-20px color-#999 font-size-12px bb-1px_#f5f5f5_solid">
        选择银行卡支付
      </view>
      <view class="rounded-10px overflow-hidden max-h-400px overflow-y-auto">
        <wd-cell-group border>
          <wd-cell
            custom-class="custom-class-mine-cell"
            v-for="(item, index) in bankListData"
            :key="index"
            clickable
            @click="handleBankClick(item, index)"
            title-width="60%"
          >
            <template #icon>
              <wd-img :src="yhlogo" width="24" height="24"></wd-img>
            </template>
            <template #title>
              <view class="ml-10px">
                {{ item.bankName || '银行卡号' }} {{ changeDict(bankType, item.bankType) }} ({{
                  dataDesensitization(item.bankCode, false, 'lastFour')
                }})
              </view>
            </template>
            <view class="color-#333!" v-if="index === 0">
              <wd-icon name="check-bold" size="14px" color="#2D69EF"></wd-icon>
            </view>
          </wd-cell>
        </wd-cell-group>
        <wd-gap bg-color="#F5f5f5" height="5px"></wd-gap>

        <view class="text-center py-10px" @click="closeChangeBank">取消</view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
//
</style>
