<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script lang="ts" setup>
const title = ref('用户中心')
</script>

<template>
  <dy-navbar :leftTitle="title" left></dy-navbar>
</template>

<style lang="scss" scoped></style>
