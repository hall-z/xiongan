<template>
    <!-- 商品自定义栏目 页脚 -->
    <view class="custom-box" v-if="selfColumnDTOS && selfColumnDTOS.length > 0">
        <view class="custom-list" v-for="(item, index) in selfColumnDTOS" :key="index">
            <view class="custom-name">
                <text>{{ item.propertyName }}</text>
                <view class="custom-btn" @click="changeisExpand(index, item.location)">
                    <image :src="imagesPath.upIcon" :class="item.isExpand === 1 ? 'up-icon' : 'up-icon rotate-icon'" mode="" />
                </view>
            </view>

            <view v-if="item.type === 1" class="key-list-box">
                <view class="custom-content" v-for="(itemProperty, idx) in item.propertyValue" :key="idx">
                    <!-- 键值对 -->
                    <view v-if="!(item.isExpand === 2)">
                        <view class="custom-keyvalue">
                            <text class="keyvalue-title">{{ itemProperty.label }}：</text>
                            <text>{{ itemProperty.value }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view v-else>
                <view class="custom-content" v-for="(itemProperty, idx) in item.propertyValue" :key="idx">
                    <!-- 图片 -->
                    <view v-if="!(item.isExpand === 2)">
                        <image class="custom-image" :src="itemProperty.imageUrl" :width="itemProperty.imageWidth" mode="widthFix" />
                    </view>

                    <!-- 文字 -->
                    <view v-else-if="item.type === 3" v-if="!(item.isExpand === 2)">
                        <view>
                            <text class="custom-text">{{ itemProperty.text }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'
import { IMAGESPATH } from '../../utils/imagesPath'

interface PropertyValue {
  label?: string
  value?: string
  imageUrl?: string
  imageWidth?: number
  text?: string
}

interface SelfColumnDTO {
  propertyName: string
  propertyValue: PropertyValue[]
  type: number
  isExpand?: number
  location?: number
}

export default defineComponent({
  name: 'GoodAttr',
  props: {
    columnDTOS: {
      type: Array as PropType<SelfColumnDTO[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const imagesPath = ref(IMAGESPATH)
    const selfColumnDTOS = ref<SelfColumnDTO[]>([])

    // 监听columnDTOS变化
    watch(() => props.columnDTOS, (newVal: SelfColumnDTO[]) => {
      console.log(newVal, 'newVal')
      selfColumnDTOS.value = newVal ? [...newVal] : []
    }, { immediate: true, deep: true })

    // 展开收起商品自定义页眉页脚
    const changeisExpand = (index: number, location?: number) => {
      if (selfColumnDTOS.value[index]) {
        selfColumnDTOS.value[index].isExpand = selfColumnDTOS.value[index].isExpand === 1 ? 2 : 1
        
        emit('changeShow', {
          detail: location
        }, selfColumnDTOS.value)
      }
    }

    return {
      imagesPath,
      selfColumnDTOS,
      changeisExpand
    }
  }
})
</script>

<style scoped>
.custom-box {
  width: 100%;
  box-sizing: border-box;
}

.custom-list {
  margin-bottom: 20rpx;
  background: #fff;
  padding: 20rpx;
  box-sizing: border-box;
}

.custom-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.custom-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.up-icon {
  width: 40rpx;
  height: 40rpx;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

.key-list-box {
  width: 100%;
}

.custom-content {
  margin-bottom: 15rpx;
}

.custom-keyvalue {
  display: flex;
  font-size: 24rpx;
  color: #666;
  line-height: 36rpx;
}

.keyvalue-title {
  color: #999;
  margin-right: 10rpx;
}

.custom-image {
  max-width: 100%;
  height: auto;
  border-radius: 8rpx;
}

.custom-text {
  font-size: 24rpx;
  color: #666;
  line-height: 36rpx;
}
</style>