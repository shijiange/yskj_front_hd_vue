<template>
  <div class="page">
    <c-title text="数据"></c-title>
    <div class="wrapper">
      <div class="infos">
        <div class="info">
          <p class="desc">今日扫码人数</p>
          <p class="num">{{groupCodeData.log_today_count}}</p>
        </div>
        <div class="info">
          <p class="desc">今日新会员人数</p>
          <p class="num">{{groupCodeData.log_new_today_count}}</p>
        </div>
        <div class="info">
          <p class="desc">即将过期二维码</p>
          <p class="num">{{groupCodeData.code_soon_expire_count}}</p>
        </div>
        <div class="info">
          <p class="desc">累计扫码人数</p>
          <p class="num">{{groupCodeData.cumulative}}</p>
        </div>
        <div class="info">
          <p class="desc">累计新会员人数</p>
          <p class="num">{{groupCodeData.cumulative_new}}</p>
        </div>
        <div class="info">
          <p class="desc">已过期二维码</p>
          <p class="num">{{groupCodeData.code_expire_count}}</p>
        </div>
      </div>

      <div class="list">
          <van-collapse v-model="activeName"
                        accordion>
            <van-collapse-item title="标题1"
                               :name="key"
                               v-for="(item,key) in listData"
                               :key="key">
              <template #title>
                <div style="text-align: left;">{{item.date_day}}</div>
              </template>
              <div class="lsit_content">
                <p>当日扫码人数</p>
                <p>{{item.total_count}}</p>
              </div>
              <div class="lsit_content">
                <p>当日新增会员</p>
                <p>{{item.new_count}}</p>
              </div>
            </van-collapse-item>

          </van-collapse>
      </div>

    </div>

  </div>
</template>

<script>
import groupCodeDataController from './group_code_data_controller.js';

export default groupCodeDataController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background-color: rgb(249, 249, 249);
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .wrapper {
    .infos {
      margin-top: 0.75rem;
      padding-left: 0.844rem;
      padding-right: 0.75rem;
      display: grid;
      grid-template-columns: repeat(3, 6.875rem);
      grid-column-gap: 0.594rem;
      grid-row-gap: 0.594rem;

      .info {
        text-align: left;
        width: 6.875rem;
        height: 4.156rem;
        padding-top: 0.594rem;
        padding-left: 0.469rem;
        background: #fff;
        border-radius: 0.563rem;

        .desc {
          font-size: 0.75rem;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0;
          color: #666;
        }

        .num {
          margin-top: 1.063rem;
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0;
          color: #000;
        }
      }
    }

    .list {
      margin-top: 0.906rem;
    }
  }

  .lsit_content {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 1.5rem;
    letter-spacing: 0;
    color: #666;
  }

</style>
