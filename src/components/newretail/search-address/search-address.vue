<template>
  <view class="search-box-addr">
    <view class="search-main-addr" @click="handleMainClick">
      <image :src="props.imagesPath.search_address_new" class="icon" mode="widthFix" />
      <input 
        id="search" 
        confirm-type="search" 
        :focus="searchFocus" 
        :value="searchItem" 
        @confirm="handleConfirm" 
        @blur="handleBlur" 
        @input="handleInput" 
      />
      <label for="search" v-if="!props.searchLabelShow">
        <text>{{ props.searchText || '搜索门店' }}</text>
      </label>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SearchAddress',
  
  props: {
    searchLabelShow: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: '搜索门店'
    },
    imagesPath: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['confirm', 'input', 'blur', 'focus'],
  
  setup(props, { emit }) {
    const searchFocus = ref(false)
    const searchItem = ref('')

    const handleMainClick = () => {
      searchFocus.value = true
      emit('focus')
    }

    const handleBlur = (e: any) => {
      const value = e.detail.value
      if (!value) {
        emit('blur', e)
      } else {
        handleConfirm({ detail: { value } })
      }
    }

    const handleInput = (e: any) => {
      searchItem.value = e.detail.value
      emit('input', e.detail.value)
    }

    const handleConfirm = (e: any) => {
      const value = e.detail?.value || searchItem.value
      emit('confirm', value)
    }

    return {
      props,
      searchFocus,
      searchItem,
      handleMainClick,
      handleBlur,
      handleInput,
      handleConfirm
    }
  }
})
</script>

<style lang="scss">
.search-box-addr {
  /* height: 117rpx; */
  width: 100%;
  background: #FFFFFF;
  box-sizing: border-box;
  padding: 0rpx 30rpx 30rpx;
  overflow: hidden;
}

.search-main-addr {
  display: flex;
  width: 656rpx;
  height: 73rpx;
  padding: 0 20rpx;
  margin: 0 auto;
  background: #eee;
  border-radius: 35rpx;
  /* border: 2rpx solid #E5E3E4; */
  float: right;
  overflow: hidden;
  position: relative;
  color: #8B8B8C;
  cursor: pointer;
}

.search-main-addr input {
  font-size: 28rpx;
  height: 100%;
  width: 95%;
  text-align: center;
  margin-left: 50rpx;
  background: transparent;
  border: none;
  outline: none;
}

.search-main-addr label {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  line-height: 73rpx;
  color: #C5C3C5;
  text-indent: 20rpx;
  text-align: center;
  pointer-events: none;
}

.search-main-addr label image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin-top: -4rpx;
}

.search-main-addr .icon {
  position: absolute;
  left: 26rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 26rpx;
  height: 26rpx;
  z-index: 2;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-main-addr {
    width: 90%;
  }
}
</style>