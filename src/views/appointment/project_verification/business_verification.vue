<template>
  <div id="store_verification">
    <div class="top">
      <img :src="dataList.project_thumb" alt="" />
      <div class="project">
        <span class="project_name">{{ dataList.project_title }}</span>
        <span class="project_date">截止到期：{{ dataList.end_time }}</span>
      </div>
    </div>
    <div class="bottom">
      <span class="line">会员昵称：{{ dataList.member_nickname }}</span>
      <span class="line">已<span>核销次数：</span>{{ dataList.used_count }}</span>
      <span class="line">未核销次数：{{ dataList.rest_count }}</span>
      <span class="line">使用商户：{{ dataList.store_name }}</span>
      <span class="line">核销员：{{ dataList.worker_nickname }}</span>
      <div class="write_off_num"><span>核销次数：</span><span v-if="!judge">{{write_off_num}}</span><van-field type="number" v-model="write_off_num" v-if="judge"/></div>
      <div class="determine" v-if="judge"><span @click="btnConfirm">确认核销</span></div>
    </div>
  </div>
</template>

<script>
import business_verificationed from "./business_verificationed";

export default business_verificationed;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#store_verification {
  .top {
    display: flex;
    align-items: center;
    padding: 1.07rem;
    background: #fff;

    img {
      width: 5.71rem;
      height: 5.71rem;
      border-radius: 0.36rem;
    }

    .project {
      display: flex;
      flex-direction: column;
      margin: 0 1.29rem 0 0.61rem;

      .project_name {
        text-align: left;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #333;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 1.11rem;
      }

      .project_date {
        display: flex;
        color: #ce811d;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    text-align: left;
    background: #fff;
    margin-top: 1rem;

    .line {
      margin: 0.77rem 0 0.77rem 1.14rem;
      color: #666;
      font-size: 20px;
    }

    .write_off_num {
      display: flex;
      align-items: center;
      margin: 0 0 2.82rem 1.14rem;

      span {
        width: 7.64rem;
        color: #666;
        font-size: 20px;
      }
    }

    .van-cell {
      width: 5rem;
      height: 2.14rem;
      border-radius: 0.14rem;
      border: solid 0.04rem #cacaca;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .determine {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1.54rem;
      cursor: pointer;
    }

    .determine span {
      padding: 0.64rem 5.32rem;
      background-color: #ce811d;
      border-radius: 0.21rem;
      color: #fff;
    }
  }
}
</style>
