<!-- 步进器 -->
<template>
  <view class="vk-data-input-number-box">
    <view
      class="u-icon-minus"
      :class="{ 'u-icon-disabled': disabled || inputVal <= min }"
      :style="{
        background: bgColor,
        height: inputHeight + 'rpx',
        color: color,
        fontSize: size + 'rpx',
        minHeight: '1.4em',
      }"
      @click="emptyClick"
      @touchstart.prevent="btnTouchStart('minus')"
      @touchend.stop.prevent="clearTimer"
    >
      <view :style="'font-size:' + Number(size) + 'rpx'" class="num-btn">－</view>
    </view>
    <input
      v-model="inputVal"
      :disabled="disabledInput || disabled"
      :cursor-spacing="getCursorSpacing"
      :class="{ 'u-input-disabled': disabled }"
      class="u-number-input"
      type="number"
      :style="{
        color: color,
        fontSize: size + 4 + 'rpx',
        background: bgColor,
        height: inputHeight + 'rpx',
        width: inputWidth + 'rpx',
      }"
      @blur="onBlur"
      @click="showInput = true"
    />
    <view
      class="u-icon-plus"
      :class="{ 'u-icon-disabled': disabled || inputVal >= max }"
      :style="{
        background: bgColor,
        height: inputHeight + 'rpx',
        fontSize: size + 'rpx',
        minHeight: '1.4em',
      }"
      @click="emptyClick"
      @touchstart.prevent="btnTouchStart('plus')"
      @touchend.stop.prevent="clearTimer"
    >
      <view :style="'font-size:' + Number(size) + 'rpx'" class="num-btn">＋</view>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
/**
 * numberBox 步进器（此为uview组件改造）
 * @description 该组件一般用于商城购物选择物品数量的场景。注意：该输入框只能输入大于或等于0的整数，不支持小数输入
 * @tutorial https://www.uviewui.com/components/numberBox.html
 * @property {Number} value 输入框初始值（默认1）
 * @property {String} bg-color 输入框和按钮的背景颜色（默认#F2F3F5）
 * @property {Number} min 用户可输入的最小值（默认0）
 * @property {Number} max 用户可输入的最大值（默认99999）
 * @property {Number} step 步长，每次加或减的值（默认1）
 * @property {Number} stepFirst 步进值，首次增加或最后减的值(默认step值和一致）
 * @property {Boolean} disabled 是否禁用操作，禁用后无法加减或手动修改输入框的值（默认false）
 * @property {Boolean} disabled-input 是否禁止输入框手动输入值（默认false）
 * @property {Boolean} positive-integer 是否只能输入正整数（默认true）
 * @property {String | Number} size 输入框文字和按钮字体大小，单位rpx（默认26）
 * @property {String} color 输入框文字和加减按钮图标的颜色（默认#323233）
 * @property {String | Number} input-width 输入框宽度，单位rpx（默认80）
 * @property {String | Number} input-height 输入框和按钮的高度，单位rpx（默认50）
 * @property {String | Number} index 事件回调时用以区分当前发生变化的是哪个输入框
 * @property {Boolean} long-press 是否开启长按连续递增或递减(默认true)
 * @property {String | Number} press-time 开启长按触发后，每触发一次需要多久，单位ms(默认250)
 * @property {String | Number} cursor-spacing 指定光标于键盘的距离，避免键盘遮挡输入框，单位rpx（默认200）
 * @event {Function} change 输入框内容发生变化时触发，对象形式
 * @event {Function} blur 输入框失去焦点时触发，对象形式
 * @event {Function} minus 点击减少按钮时触发(按钮可点击情况下)，对象形式
 * @event {Function} plus 点击增加按钮时触发(按钮可点击情况下)，对象形式
 * @example <vk-data-input-number-box :min="1" :max="100"></vk-data-input-number-box>
 */
export default {
  name: 'vk-data-input-number-box',
  emits: ['update:modelValue', 'input', 'change', 'blur', 'plus', 'minus'],
  props: {
    // 预显示的数字
    value: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: Number,
      default: 1,
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#FFFFFF',
    },
    // 最小值
    min: {
      type: [Number, null],
      default: 0,
    },
    // 最大值
    max: {
      type: [Number, null],
      default: 99999,
    },
    // 步进值，每次加或减的值
    step: {
      type: [Number, null],
      default: 1,
    },
    // 步进值，首次增加或最后减的值
    stepFirst: {
      type: [Number, null],
      default: 0,
    },
    // 是否只能输入 step 的倍数
    stepStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否禁用加减操作
    disabled: {
      type: Boolean,
      default: false,
    },
    // input的字体大小，单位rpx
    size: {
      type: [Number, String, null],
      default: 24,
    },
    // 加减图标的颜色
    color: {
      type: String,
      default: '#000',
    },
    // input宽度，单位rpx
    inputWidth: {
      type: [Number, String, null],
      default: 80,
    },
    // input高度，单位rpx
    inputHeight: {
      type: [Number, String, null],
      default: 40,
    },
    // index索引，用于列表中使用，让用户知道是哪个numberbox发生了变化，一般使用for循环出来的index值即可
    index: {
      type: [Number, String],
      default: '',
    },
    // 是否禁用输入框，与disabled作用于输入框时，为OR的关系，即想要禁用输入框，又可以加减的话
    // 设置disabled为false，disabledInput为true即可
    disabledInput: {
      type: Boolean,
      default: false,
    },
    // 输入框于键盘之间的距离
    cursorSpacing: {
      type: [Number, String, null],
      default: 100,
    },
    // 是否开启长按连续递增或递减
    longPress: {
      type: Boolean,
      default: true,
    },
    // 开启长按触发后，每触发一次需要多久
    pressTime: {
      type: [Number, String, null],
      default: 250,
    },
    // 是否只能输入大于或等于0的整数(正整数)
    positiveInteger: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    valueCom(v1, v2) {
      // 只有value的改变是来自外部的时候，才去同步inputVal的值，否则会造成循环错误
      if (!this.changeFromInner) {
        this.inputVal = v1
        // 因为inputVal变化后，会触发this.handleChange()，在其中changeFromInner会再次被设置为true，
        // 造成外面修改值，也导致被认为是内部修改的混乱，这里进行this.$nextTick延时，保证在运行周期的最后处
        // 将changeFromInner设置为false
        this.$nextTick(function () {
          this.changeFromInner = false
        })
      }
    },
    inputVal(v1, v2) {
      // 为了让用户能够删除所有输入值，重新输入内容，删除所有值后，内容为空字符串
      if (v1 == '') return
      let value = 0
      // 首先判断是否数值，并且在min和max之间，如果不是，使用原来值
      let tmp = this.isNumber(v1)
      if (tmp && v1 >= this.min && v1 <= this.max) value = v1
      else value = v2
      // 判断是否只能输入大于等于0的整数
      if (this.positiveInteger) {
        // 小于0，或者带有小数点，
        if (v1 < 0 || String(v1).indexOf('.') !== -1) {
          value = v2
          // 双向绑定input的值，必须要使用$nextTick修改显示的值
          this.$nextTick(() => {
            this.inputVal = v2
          })
        }
      }
      // 发出change事件
      this.handleChange(value, 'change')
    },
    min(v1) {
      if (v1 !== undefined && v1 != '' && this.valueCom < v1) {
        this.$emit('input', v1)
        this.$emit('update:modelValue', v1)
      }
    },
    max(v1) {
      if (v1 !== undefined && v1 != '' && this.valueCom > v1) {
        this.$emit('input', v1)
        this.$emit('update:modelValue', v1)
      }
    },
  },
  data() {
    return {
      inputVal: 1, // 输入框中的值，不能直接使用props中的value，因为应该改变props的状态
      timer: null, // 用作长按的定时器
      changeFromInner: false, // 值发生变化，是来自内部还是外部
      innerChangeTimer: null, // 内部定时器
      showInput: false,
    }
  },
  created() {
    this.inputVal = Number(this.valueCom)
  },
  computed: {
    valueCom() {
      // #ifdef VUE2
      return this.value
      // #endif

      // #ifdef VUE3
      return this.modelValue
      // #endif
    },
    getCursorSpacing() {
      // 先将值转为px单位，再转为数值
      return Number(uni.upx2px(this.cursorSpacing))
    },
  },
  methods: {
    // 空点击事件，主要用于解决PC端H5由于无click事件导致触摸位置不准确的问题
    emptyClick() {},
    // 触摸事件开始
    btnTouchStart(callback) {
      // 先执行一遍方法，否则会造成松开手时，就执行了clearTimer，导致无法实现功能
      this[callback]()
      // 如果没开启长按功能，直接返回
      if (!this.longPress) return
      clearInterval(this.timer) //再次清空定时器，防止重复注册定时器
      this.timer = null
      this.timer = setInterval(() => {
        // 执行加或减函数
        this[callback]()
      }, this.pressTime)
    },
    // 清除定时器
    clearTimer() {
      this.$nextTick(() => {
        clearInterval(this.timer)
        this.timer = null
      })
    },
    // 减
    minus() {
      this.computeVal('minus')
    },
    // 加
    plus() {
      this.computeVal('plus')
    },
    // 为了保证小数相加减出现精度溢出的问题
    calcPlus(num1, num2) {
      let baseNum, baseNum1, baseNum2
      try {
        baseNum1 = num1.toString().split('.')[1].length
      } catch (e) {
        baseNum1 = 0
      }
      try {
        baseNum2 = num2.toString().split('.')[1].length
      } catch (e) {
        baseNum2 = 0
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
      let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2 //精度
      return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision)
    },
    // 为了保证小数相加减出现精度溢出的问题
    calcMinus(num1, num2) {
      let baseNum, baseNum1, baseNum2
      try {
        baseNum1 = num1.toString().split('.')[1].length
      } catch (e) {
        baseNum1 = 0
      }
      try {
        baseNum2 = num2.toString().split('.')[1].length
      } catch (e) {
        baseNum2 = 0
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
      let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
      return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
    },
    computeVal(type) {
      uni.hideKeyboard()
      if (this.disabled) return
      let value = 0
      // 新增stepFirst开始
      // 减
      if (type === 'minus') {
        if (this.stepFirst > 0 && this.inputVal == this.stepFirst) {
          value = this.min
        } else {
          value = this.calcMinus(this.inputVal, this.step)
        }
      } else if (type === 'plus') {
        if (this.stepFirst > 0 && this.inputVal < this.stepFirst) {
          value = this.stepFirst
        } else {
          value = this.calcPlus(this.inputVal, this.step)
        }
      }
      if (this.stepStrictly) {
        let strictly = value % this.step
        if (strictly > 0) {
          value -= strictly
        }
      }
      if (value > this.max) {
        value = this.max
      } else if (value < this.min) {
        value = this.min
      }
      // 新增stepFirst结束
      this.inputVal = value
      this.handleChange(value, type)
    },
    // 处理用户手动输入的情况
    onBlur(event) {
      console.log('🍲[event]:', event)
      let val = 0
      let value = event.detail.value
      // 如果为非0-9数字组成，或者其第一位数值为0，直接让其等于min值
      // 这里不直接判断是否正整数，是因为用户传递的props min值可能为0
      console.log('🌽', this.min)
      if (!/(^\d+$)/.test(value) || value[0] == 0) val = this.min
      val = +value

      // 新增stepFirst开始
      if (this.stepFirst > 0 && this.inputVal < this.stepFirst && this.inputVal > 0) {
        val = this.stepFirst
      }
      // 新增stepFirst结束
      if (this.stepStrictly) {
        let strictly = val % this.step
        if (strictly > 0) {
          val -= strictly
        }
      }
      if (val > this.max) {
        val = this.max
      } else if (val < this.min) {
        val = this.min
      }
      this.$nextTick(() => {
        let v = Number.isNaN(val) ? 1 : val
        this.inputVal = v
      })

      this.handleChange(val, 'blur')
    },
    handleChange(value, type) {
      if (this.disabled) return
      // 清除定时器，避免造成混乱
      if (this.innerChangeTimer) {
        clearTimeout(this.innerChangeTimer)
        this.innerChangeTimer = null
      }
      // 发出input事件，修改通过v-model绑定的值，达到双向绑定的效果
      this.changeFromInner = true
      // 一定时间内，清除changeFromInner标记，否则内部值改变后
      // 外部通过程序修改value值，将会无效
      this.innerChangeTimer = setTimeout(() => {
        this.changeFromInner = false
      }, 150)
      this.$emit('input', Number(value))
      this.$emit('update:modelValue', Number(value))
      this.$emit(type, {
        // 转为Number类型
        value: Number(value),
        index: this.index,
      })
    },
    /**
     * 验证十进制数字
     */
    isNumber(value) {
      return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
    },
  },
}
</script>

<style lang="less" scoped>
.vk-data-input-number-box {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
}

.u-number-input {
  position: relative;
  text-align: center;
  padding: 0;
  margin: 0rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 0;
  border-right: 0;
  box-sizing: border-box;
}

.u-icon-plus,
.u-icon-minus {
  width: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2rpx solid #f4f4f4;
  box-sizing: border-box;
  font-size: 16px;
}

.u-icon-plus {
  // border-radius: 0 8rpx 8rpx 0;
}

.u-icon-minus {
  // border-radius: 8rpx 0 0 8rpx;
}

.u-icon-disabled {
  color: #b8b8b8 !important;
  background-color: #f0f2f7 !important;
}

.u-input-disabled {
  color: #c8c9cc !important;
  background-color: #f2f3f5 !important;
}

.num-btn {
  font-weight: 500;
  line-height: 50rpx;
}
</style>
