<template>
  <view :animation="animationY" class="animation-element" :style="anViewY">
    <view :animation="animationX" class="animation-element" :style="anViewX"></view>
  </view>
</template>
<script setup>
function t() {
  const t = getCurrentPages()
  const e = t[t.length - 1]
  return ((this.__page = e), (this.__timeout = null), (e.addcart = this), this)
}
let e = !0
;((t.prototype.animateAddToCart = function (t, a, i, n) {
  const r = this.__page
  if (e) {
    ;((e = !1),
      (n ? uni.createSelectorQuery().in(n) : uni.createSelectorQuery())
        .select(t)
        .boundingClientRect(function (t) {
          const n = a - (t.width / 2 + t.left)
          const c = i - t.top - t.height / 2
          const u = d(n, t.left, 0.01)
          const s = _(c, t.top, 0.01)
          const h = t.dataset.imgUrl
          ;(r.setData({
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
          }),
            o(400).then(function () {
              ;(r.setData({
                '__addcart__.animationX': d(0, 0, 1, 0).export(),
                '__addcart__.animationY': _(0, 0, 1, 0).export(),
                '__addcart__.anViewY': '',
                '__addcart__.anViewX': '',
              }),
                (e = !0))
            }))
        })
        .exec())
    const o = function (t) {
      return new Promise(function (e, a) {
        setTimeout(function () {
          e()
        }, t)
      })
    }
    const d = function (t, e, a, i) {
      const n = uni.createAnimation({
        duration: i || 400,
        timingFunction: 'linear',
      })
      return (n.translateX(t).scaleX(a).step(), n)
    }
    const _ = function (t, e, a, i) {
      const n = uni.createAnimation({
        duration: i || 400,
        timingFunction: 'ease-in',
      })
      return (n.translateY(t).scaleY(a).step(), n)
    }
  }
}),
  (module.exports = {
    addToCart: t,
  }))
</script>
<style scoped>
.animation-element {
  z-index: 4;
  position: fixed;
}
</style>
