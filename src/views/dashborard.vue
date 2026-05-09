<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="iconUrl" alt="用户头像" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ aiData.systemOverview.totalUsers }}</p>
              <p class="subtitle-title">活跃用户数{{ aiData.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="iconUrl2" alt="情绪日志" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ aiData.systemOverview.totalDiaries }}</p>
              <p class="subtitle-title">今日新增日志{{ aiData.systemOverview.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="iconUrl3" alt="咨询会话" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ aiData.systemOverview.totalSessions }}</p>
              <p class="subtitle-title">今日新增会话{{ aiData.systemOverview.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="iconUrl4" alt="平均情绪" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ aiData.systemOverview.avgMoodScore }}/10</p>
              <p class="subtitle-title">情绪健康指数{{ aiData.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">
              情绪趋势分析
            </div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="height: 300px;width: 100%;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12"></el-col>

    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAnalyticsOverview } from '@/api/admin'
import { onMounted } from 'vue'
import * as echarts from 'echarts'

//统计图片
const iconUrl = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const aiData = ref({})
//情绪趋势分析图表
let emotionChart = null
const emotionChartRef = ref(null)
//初始化图表
const initCharts = () => {
  initEmotionChart()
}
const initEmotionChart = () => {
  if (!emotionChartRef.value) return
  //销毁现有的图表
  if (emotionChart) {
    emotionChart.dispose()
  }

  emotionChart = echarts.init(emotionChartRef.value)
  const TrendData = aiData.value.emotionTrend
  //配置图表
  const option = {
    title: {
      text: '情绪趋势分析',
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: '600'
      },
      left: 'center',
      top: '10'
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436',
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: '40',
    },
    grid: {
      top: '80',
      bottom: '3%',
      left: '3%',
      right: '4%',
    },
    xAxis: {
      type: 'category',
      data: TrendData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#2d3436',

        }
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#2d3436',
          }
        },
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#2d3436',
          }
        },
      },
    ],
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: TrendData.map(item => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          color: '#faebaf',
          width: 3,
        },
        itemStyle: {
          color: '#faebaf',
        },
      },
      {
        name: '记录数量',
        type: 'line',
        data: TrendData.map(item => item.recordCount),
        lineStyle: {
          color: '#eeb5a3',
          width: 3,
        },
        itemStyle: {
          color: '#eeb5a3',
        },
      },
    ]

  }
  emotionChart.setOption(option)
}


onMounted(() => {
  getAnalyticsOverview().then(res => {
    aiData.value = res
    initCharts()
  })
})
</script>

<style scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px
      }

      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
}
</style>
