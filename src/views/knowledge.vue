<template>
  <div >
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItems" @search="handleSearch"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue';

const formItems = ref([
  {
    comp: 'input',
    prop: 'title',
    label: '文章标题',
    placeholder: '请输入文章标题',
  },
  {
    comp: 'select',
    prop: 'categoryId',
    label: '分类',
    options: [
      {
        label: '心理健康基础',
        value: '1',
      },
      {
        label: '情绪管理',
        value: '2',
      },
    ],
    placeholder: '请选择分类',
  }
])

const handleSearch = (formData) => {
  console.log(formData)
}
</script>

<style lang="scss" scoped>

</style>
