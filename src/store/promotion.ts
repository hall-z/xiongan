import { dataDesensitization } from '@/utils'
import { TOKEN_OVER } from '@/utils/constant'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState = {
  nickname: '',
  avatar: '',
  tokenTime: new Date().getTime(),
  appSign: '',
}

interface GlobalDialogData {
  url?: string
  flog?: boolean
  showTps?: number
  title?: string
}
interface IPromotionDate {
  promoterType?: string
  bankCodeId?: string
  promoterId?: string
  isPromotion?: boolean
  Time?: number
}
export const promotionDateStore = defineStore(
  'promotionDate',
  () => {
    const promotionDate = ref<Partial<IPromotionDate>>({})
    const setPromotionDate = (val: IPromotionDate) => {
      promotionDate.value = val
      promotionDate.value.Time = new Date().getTime()
    }
    const getPromotionDateTime = () => {
      return promotionDate.value.Time
    }

    const clearPromotionDate = () => {
      promotionDate.value = {}
      // #ifdef APP-PLUS
      uni.setStorageSync('promotionDate', {})
      // #endif
    }
    // 一般没有reset需求，不需要的可以删除 退出后调用
    const reset = () => {
      promotionDate.value = {}
    }

    return {
      promotionDate,
      reset,
      setPromotionDate,
      clearPromotionDate,
      getPromotionDateTime,
    }
  },
  {
    persist: true,
  },
)
