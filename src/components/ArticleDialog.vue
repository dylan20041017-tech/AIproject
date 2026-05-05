<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
  <el-form :model="FormData" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="FormData.title" placeholder="请输入文章标题" maxlength="200" :show-word-limit="true" clearable />
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId">
      <el-select v-model="FormData.categoryId" placeholder="请选择分类" >
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary">
      <el-input type="textarea" v-model="FormData.summary" placeholder="请输入文章摘要" maxlength="2000" :show-word-limit="true" clearable :rows="4" />
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
          <el-button type="danger" size="small" @click="handleRemove">删除</el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor v-model="FormData.content"
      placeholder="请输入文章内容"
      :maxCharCount="5000"
      @change="handleContentChange" 
      @created="handleEditorCreated"
      min-height="400px"
      />
    </el-form-item>
  </el-form>
  <div v-if="btnpreview">
    <h2>内容预览</h2>
    <div v-html="FormData.content"></div>
  </div>
  <template #footer>
    <el-button  @click="btnpreview = !btnpreview">{{ btnpreview.value?'隐藏效果':'预览效果' }}</el-button>
    <el-button @click="handleClose">取消</el-button>
    <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新' : '创建' }}</el-button>
  </template>
  </el-dialog>
</template>

<script setup >
import { toFormData } from 'axios'
import { ref,reactive,computed ,nextTick,watch} from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { createArticle } from '@/api/admin.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  }
})
const emit = defineEmits(['update:modelValue','success'])
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
// 监听文章变化，更新表单数据
watch(()=>props.article,async (newVal,oldVal) => {
  if(newVal) {
    nextTick(() => {
      Object.assign(FormData,newVal)
      //使用现有ID
      businessId.value = newVal.id
      //封面url
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })
    
  }
})

const isEdit=computed(()=>!!props.article?.id)
// 表单数据
const FormData = reactive({
  
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
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
  content: [
    { required: true, message: '请输入文章内容', trigger: 'change' },
    { max: 5000, message: '文章内容最多 5000 个字符', trigger: 'change' },
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
const businessId = ref(null)
// 上传封面图片请求
const handleUploadRequest = async({file})=>{
  //uuid生成
  businessId.value = crypto.randomUUID()
  const fileRes = await uploadFile(file,{
    businessId: businessId.value,
  })
  //拼接完整的图片
  imgUrl.value = fileBaseUrl + fileRes.filePath
  // 赋值给表单数据
  FormData.coverImage = fileRes.filePath

}
// 删除封面图片
const handleRemove = () => {
  imgUrl.value = ''
  FormData.coverImage = ''
}

// 弹窗关闭
const handleClose = () => {
  // 清空表单数据
  formRef.value.resetFields()
  // 清空封面图片
  handleRemove()
  // 清空标签数组
  FormData.tagArray = []
  // 清空业务ID
  businessId.value = null
  emit('update:modelValue', false)

   
}

// 文章内容改变时触发
const handleContentChange = (data) => {
  FormData.content = data.html
  
}
// 文章内容改变时触发
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  //编辑
  if (!FormData.content&&editor) {
    nextTick(()=>{
      editor.setHtml(FormData.content)
    })   
  }
}
const btnpreview = ref(false)
// 提交表单
const formRef = ref(null)
const loading = ref(false)
const handleSubmit =() => {
   formRef.value.validate((valid,fields) => {
    if (valid) {
      loading.value = true
     
    } 
    const submitData = {
      ...FormData,
      tags: FormData.tagArray.join(','),
    }
    delete submitData.tagArray
    createArticle(submitData).then(res=>{
      loading.value = false
      emit('success')
    })
  }) 
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