<template>
  <div id="clockinrecord">
    <div id="record">
      <c-title :hide="false" :text="title"></c-title>
      <!-- 新页面 -->
      <div id="content">
        <div></div>
      </div>
      <!-- end -->
      <div class="record-content">
        <h3>我的战绩</h3>
        <div class="record-data">
          <div class="data_box">
            <span class="data">{{ payAmount }}</span
            ><br />
            <span class="amount">累计投入({{$i18n.t('元')}})</span>
          </div>

          <div class="data_box">
            <span class="data">{{ rewardAmount }}</span
            ><br />
            <span class="amount">累计赚取({{$i18n.t('元')}})</span>
          </div>

          <div class="data_box">
            <span class="data">{{ clockNum }}</span
            ><br />
            <span class="amount">累计打卡(天)</span>
          </div>
        </div>
      </div>
      <div class="record-detail" v-if="recordDetailShow">
        <h3>战绩明细</h3>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div v-for="(item,i) in recordDetail" :key='i' class="record-detail-list">
            <span class="time">{{ item.created_at }}</span>
            <span class="state">{{ item.clock_in_status_name }}</span>
            <span class="amount">{{
              fun.isTextEmpty(item.has_one_reward)
                ? ""
                : item.has_one_reward.amount
            }}</span>
          </div>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import clockinrecord_controller from "./clockinrecord_controller";
export default clockinrecord_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#record {
  color: #fff;
  text-align: left;

  .record-content {
    height: 9.4375rem;
    background-image: url(../../assets/images/clockin_bg.png);
    background-repeat: no-repeat;
    background-size: 100%;

    h3 {
      line-height: 2.5rem;
      padding: 0.625rem 0.75rem 0 0.75rem;
      font-size: 18px;
    }

    .record-data {
      // margin: 10px;
      padding-top: 0.625rem;
      padding-bottom: 0.625rem;
      font-size: 15px;
      display: flex;

      .data_box {
        width: 6.875rem;
        padding-left: 0.75rem;
      }

      div {
        .data {
          font-size: 20px;
        }

        .amount {
          font-size: 12px;
        }
      }
    }
  }

  .record-detail {
    color: #000;
    background: #fff;

    h3 {
      line-height: 2.5rem;
      border-bottom: solid 0.0625rem #ebebeb;
      padding-left: 0.875rem;
      font-size: 18px;
      color: #666;
    }

    .record-detail-list {
      display: flex;
      justify-content: space-between;
      color: #8c8c8c;
      margin-left: 0.875rem;
      padding-right: 0.875rem;
      font-size: 17px;
      height: 2.75rem;
      line-height: 2.75rem;

      .time {
        font-size: 14px;
      }

      .state {
        color: #666;
      }

      .amount {
        float: right;
        color: #ffb14c;
      }
    }
  }
}
</style>
