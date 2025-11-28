<template>
  <view>
    <!-- template对应的原始代码，为保证正常显示，已对其进行隐藏。 -->
    <block name="add-cart-animation" v-if="false">
      <view :animation="animationY" class="animation-element" :style="anViewY">
        <view :animation="animationX" class="animation-element" :style="anViewX"></view>
      </view>
    </block>
  </view>
</template>

<script>
function t() {
  const t = getCurrentPages()
  const e = t[t.length - 1]
  this.__page = e
  this.__timeout = null
  e.addcart = this
  return this
}
let e = true
t.prototype.animateAddToCart = function (t, a, i, n) {
  const r = this.__page
  if (e) {
    e = false
    ;(n ? uni.createSelectorQuery().in(n) : uni.createSelectorQuery())
      .select(t)
      .boundingClientRect(function (t) {
        const n = a - (t.width / 2 + t.left)
        const c = i - t.top - t.height / 2
        const u = d(n, t.left, 0.01)
        const s = _(c, t.top, 0.01)
        const h = t.dataset.imgUrl
        r.setData({
          '__addcart__.anViewY':
            'width:' +
            t.width +
            'px;height:' +
            t.height +
            'px;top:' +
            t.top +
            'px;border-radius:50%',
          '__addcart__.anViewX':
            'width:' +
            t.width +
            'px;height:' +
            t.height +
            'px;left:' +
            t.left +
            'px;background: url(' +
            h +
            ');background-size: 100% 100%;border-radius:50%',
          '__addcart__.animationX': u.export(),
          '__addcart__.animationY': s.export(),
        })
        o(400).then(function () {
          r.setData({
            '__addcart__.animationX': d(0, 0, 1, 0).export(),
            '__addcart__.animationY': _(0, 0, 1, 0).export(),
            '__addcart__.anViewY': '',
            '__addcart__.anViewX': '',
          })
          e = true
        })
      })
      .exec()
    var o = function (t) {
      return new Promise(function (e, a) {
        setTimeout(function () {
          e()
        }, t)
      })
    }
    var d = function (t, e, a, i) {
      const n = uni.createAnimation({
        duration: i || 400,
        timingFunction: 'linear',
      })
      n.translateX(t).scaleX(a).step()
      return n
    }
    var _ = function (t, e, a, i) {
      const n = uni.createAnimation({
        duration: i || 400,
        timingFunction: 'ease-in',
      })
      n.translateY(t).scaleY(a).step()
      return n
    }
  }
}
export default {
  addToCart: t,
}
</script>
<style>
.animation-element {
  z-index: 4;
  position: fixed;
}
</style>
