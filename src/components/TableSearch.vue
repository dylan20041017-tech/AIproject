<template>
  <el-form ref="ruleFormRef" :model="formdata">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component
              v-model="formdata[item.prop]"
              :is="isComp(item.comp)"
              :placeholder="item.placeholder"
            >
              <template v-if="item.comp==='select'">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = { xs:24, sm:12, md:8, lg:6, xl:6 }
  })
  return formItem
})

// 表单数据
const ruleFormRef = ref()
const formdata = reactive({})

const isComp = (comp) => {
  if (comp === 'input') {
    return 'el-input'
  } else if (comp === 'select') {
    return 'el-select'
  }
}

const handleSearch = () => {
  emit('search', formdata)
}

const handleReset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', formdata)
}

</script>

<style scoped lang="scss">
</style>