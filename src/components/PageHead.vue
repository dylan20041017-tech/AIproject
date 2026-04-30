<template>
  <div class="page-head">
    <p class="page-title">{{ props.title }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup >
const props = defineProps({
  title: {
    type: String,
    default: '知识文章'
  }
})
</script>

<style scoped lang="scss">
.page-head{
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .page-title{
    font-size: 24px;
    color: #303133;
  }
}
</style>