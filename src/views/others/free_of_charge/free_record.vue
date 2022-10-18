<template>
  <div id="free_record">
    <d-list :loading="upgradeCodeLoading" :finished="upgradeCodeFinished" @load="getRecord()">
      <div class="content_record" v-for="item in dataList" :key="item.order_sn" style="background: #fff; margin: 1rem 1rem; padding-bottom: 0.7rem; border-radius: 0.5rem;">
        <div class="top">
          <div class="free">
            <span class="free_num">{{ item.order_sn }}</span>
            <span class="free_type">{{ item.status === 0 ? "任务中" : item.status === 1 ? "已免单" : "任务失败" }}</span>
          </div>
          <div class="free_detail">
            <span class="date">{{ item.created_at }}</span>
            <span class="view_details" @click="btnDetail(item)">查看详情<van-icon name="arrow"/></span>
          </div>
        </div>
        <div class="bottom" v-if="item.isShow">
          <div class="free_task">
            免单任务: <span>{{ item.has_one_task.limit_time | conversionTime }}分享{{ item.has_one_task.people_num }}位新人</span>
          </div>
          <div class="task_progress">
            任务进度: <span>{{ item.has_one_task.people_num }}/{{ item.has_one_task.completed_people_num }}</span>
          </div>
          <div class="free_task">
            任务截止时间: <span>{{ item.has_one_task.end_time }}</span>
          </div>
        </div>
      </div>
    </d-list>
  </div>
</template>

<script>
import free_record_controller from "./free_record_controller";

export default free_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#free_record {
  .content_record {
    background: #fff;
    margin: 1rem 1rem;
    padding-bottom: 0.7rem;
    border-radius: 0.5rem;

    .top {
      padding: 0.7rem;

      .free {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 18px;

        .free_num {
          color: #333;
        }

        .free_type {
          color: #ef3532;
        }
      }

      .free_detail {
        display: flex;
        justify-content: space-between;
        font-size: 16px;

        .date {
          color: #5f5f5f;
        }

        .view_details {
          color: #a8a8a8;
          display: flex;
          align-items: center;

          .van-icon-arrow::before {
            vertical-align: middle;
            margin-left: 0.2rem;
          }
        }
      }
    }

    .free_statist {
      text-align: left;
      padding: 0.7rem;
      color: #ef3532;

      .order {
        margin-bottom: 0.7rem;
        display: flex;
        justify-content: space-between;
      }

      .free {
        display: flex;
        justify-content: space-between;
      }
    }

    .bottom {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      padding: 0.7rem 0.7rem 0.7rem 0.7rem;
      margin: 0 0.7rem 0.7rem 0.7rem;
      background: #f8f8f8;
      color: #fa9d17;
      line-height: 1.5rem;
      font-size: 18px;
    }
  }
}
</style>
