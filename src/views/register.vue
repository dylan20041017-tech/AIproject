<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账号</h2>
        <p>请填写您的账户</p>
      </div>
      <div class="form-container">
        <el-form label-position="top" :model="formData" :rules="rules" ref="submitFormRef" label-width="140px" class="demo-ruleForm">
          <el-form-item label="用户名或邮箱" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名或邮箱" size="large"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入昵称" size="large"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" size="large"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" placeholder="请确认密码" size="large" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="注册" prop="submit">
            <el-button type="primary" size="large" class="btn" @click="submitForm(submitFormRef)">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup >
import { ref, reactive, onMounted } from 'vue'

const formData = ref({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0,
  userType: 1
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ],
})
//获取表单实例
const submitFormRef = ref(null)
//提交表单验证
const submitForm = async (formEl) => {
  if (!formEl) return
 formEl.validate(async (valid) => {
    
  })
}
</script>

<style scoped lang="scss">
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>