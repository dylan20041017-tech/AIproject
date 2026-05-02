<template>
  <el-dialog
    title="编辑文章"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
  <el-form :model="FormData" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="FormData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit="true" clearable />
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId">
      <el-select v-model="FormData.categoryId" placeholder="请选择分类" >
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary">
      <el-input type="textarea" v-model="FormData.summary" placeholder="请输入文章摘要" maxlength="2000" show-word-limit clearable :rows="4" />
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-select v-model="FormData.tagArray" placeholder="请输入文章标签" multiple filterable allow-create style="width: 100%;" >
        <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
      </el-select>
    </el-form-item>
    <el-form-item label="封面图片" >
      <div class="cover-upload">
        <el-upload
          class="avatar-uploader"
          :action="''"
          :before-upload="beforeUpload"
          :http-request="handleUploadRequest"
          accept="image/*"
          :show-file-list="false"
        >
          <div v-if="!imgUrl" class="cover-placeholder">
            <p>点击上传封面图片</p>
          </div>
          <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
        </el-upload>
        <div v-if="imgUrl" class="cover-image-container">
          <el-button type="danger" size="mini" @click="handleRemove">删除</el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>

<script setup >
import { toFormData } from 'axios'
import { ref,reactive,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  }
})
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
// 表单数据
const FormData = reactive({
  
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多 200 个字符', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' },
  ],
})
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

// 上传封面图片
const imgUrl = ref('')
const beforeUpload = (file)=>{
  // 上传前的校验
  const isImage = file.type.startsWith('image/')
  // 图片大小校验
  const isLt5MB = file.size <= 5 * 1024 * 1024 // 5MB
  if (!isImage) {
    ElMessage.error('请上传图片文件')
  } else if (!isLt5MB) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  } 
  // 上传前的校验通过，返回 true
  return true
}

// 上传封面图片请求
const handleUploadRequest = async({file})=>{
  //uuid生成
  const businessId = crypto.randomUUID()
  const fileRes = await uploadFile(file,{
    businessId: businessId,
  })
  //拼接完整的图片
  imgUrl.value = fileBaseUrl + fileRes.filePath
  // 赋值给表单数据
  FormData.coverImage = fileRes.filePath

}
// 弹窗关闭
const handleClose = () => {
}
// 删除封面图片
const handleRemove = () => {
  imgUrl.value = ''
  FormData.coverImage = ''
}
</script>

<style scoped lang="scss">
.cover-placeholder {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  height: 120px;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  object-fit: block;
}
</style>