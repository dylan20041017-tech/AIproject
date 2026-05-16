<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-image class="header-icon" :src="like" alt="Emotional Diary" style="width: 60px; height: 60px;" />
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>您今天的情绪如何？（1-10）</p>
          <div class="rate">
            <el-rate v-model="diaryForm.moodScore" :max="10" :texts="emotionStatus" show-text text-color="#374151" />
          </div>
        </div>
      </div>
      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="section">
          <p>选择一个最贴近您当前状态的情绪标签</p>
          <div class="emotion-grid">
            <div v-for="emotion in emotionOpinions" :key="emotion.name" type="button"
              :class="['emotion-card', { selected: diaryForm.dominantEmotion === emotion.name }]"
              @click="handleEmotionSelect(emotion.name)">
              <el-image class="emotion-icon" :src="emotion.src" :alt="emotion.name" style="width: 50px; height: 50px;" />
              <div class="emotion-name">{{ emotion.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细记录 -->
      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
            <div class="form-group">
              <label>情绪触发因素：</label>
              <el-input
                v-model="diaryForm.emotionTriggers"
                type="textarea"
                placeholder="请输入可能影响您情绪的事件或想法..."
                :rows="3"
                maxlength="500"
                show-word-limit
              />
            </div>
            <div class="form-group">
              <label>今日感想：</label>
              <el-input
                v-model="diaryForm.diaryContent"
                type="textarea"
                placeholder="请输入您的感想..."
                :rows="6"
                maxlength="600"
                show-word-limit
              />
            </div>
            <!-- 睡眠质量 -->
            <div class="form-group">
              <label>睡眠质量：</label>
              <el-slider
                v-model="diaryForm.sleepQuality"
                :min="0"
                :max="10"
                show-input
              />
            </div>
            <!-- 压力水平 -->
            <div class="form-group">
              <label>压力水平：</label>
              <el-slider
                v-model="diaryForm.stressLevel"
                :min="0"
                :max="10"
                show-input
              />
            </div>
          </div>
          <el-button  class="action-buttons" type="primary"  @click="submit">提交日记</el-button>
          <el-button  class="action-buttons"  @click="resetForm">重置</el-button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { dayjs, ElMessage } from 'element-plus'
import { addEmotionDiary } from '@/api/frontend'
const sad = new URL('@/assets/images/悲伤.png', import.meta.url).href
const anxious = new URL('@/assets/images/焦虑.png', import.meta.url).href
const surprised = new URL('@/assets/images/惊讶.png', import.meta.url).href
const happy = new URL('@/assets/images/开心.png', import.meta.url).href
const confused = new URL('@/assets/images/困惑.png', import.meta.url).href
const tired = new URL('@/assets/images/疲惫.png', import.meta.url).href
const calm = new URL('@/assets/images/平静.png', import.meta.url).href
const excited = new URL('@/assets/images/兴奋.png', import.meta.url).href

//情绪评分
const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']
//情绪选项
const emotionOpinions = [
  { name: '悲伤', src: sad },
  { name: '焦虑', src: anxious },
  { name: '惊讶', src: surprised },
  { name: '开心', src: happy },
  { name: '困惑', src: confused },
  { name: '疲惫', src: tired },
  { name: '平静', src: calm },
  { name: '兴奋', src: excited }
];
const handleEmotionSelect = (emotion) => {
  diaryForm.dominantEmotion = emotion;
};
const like = new URL('@/assets/images/like.png', import.meta.url).href
const diaryForm = reactive({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: null,
  dominantEmotion: '',
  emotionTriggers: '',
  diaryContent: '',
  sleepQuality: 0,
  stressLevel: 0
})
const resetForm = () => {
  diaryForm.moodScore = null;
  diaryForm.dominantEmotion = '';
  diaryForm.emotionTriggers = '';
  diaryForm.diaryContent = '';
  diaryForm.sleepQuality = 0;
  diaryForm.stressLevel = 0;
}
const submit = () => {
  if (!diaryForm.moodScore) {
    ElMessage.error('请选择您的情绪评分');
    return;
  }
  addEmotionDiary(diaryForm).then(res => {
    ElMessage.success('提交成功');
    resetForm();
  })
}
</script>

<style scoped lang="scss">
.emotionDiary-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

  .header-section {
    background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
    color: white;
    padding: 48px;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .content {
    margin: 0 auto;
    width: 980px;
    padding: 20px;

    .diary-card {
      margin-bottom: 20px;
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

      .title {
        margin-bottom: 20px;
        font-size: 25px;
        font-weight: 600;
        color: #374151;
      }

      .section {
        margin-bottom: 20px;

        p {
          font-size: 15px;
          color: #6B7280;
          margin-bottom: 15px;
        }
      }

      .emotion-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .emotion-card {
          padding: 15px;
          border: 2px solid #E5E7EB;
          border-radius: 15px;
          text-align: center;
          cursor: pointer;
          background: #F9FAFB;

          .emotion-name {
            margin-top: 10px;
            padding: 0 75px;
            color: #374151;
          }

          &.selected {
            border-color: #7ED321;
            background: #F0FDF4;
            transform: translateY(-3px);
          }
        }
      }

      .detail-form {
        .form-label {
          margin: 10px 0;
          color: #374151;
        }

        .life-indicators {
          display: flex;
          gap: 20px;

          .indicator-group {
            flex: 1;
          }
        }

        .action-buttons {
          margin-top: 40px
        }
      }
    }
  }
}
</style>