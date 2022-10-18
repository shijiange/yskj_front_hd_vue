<template>
  <div id="personRedListDetail">
    <c-title :hide="false" text="发放详情" />
    <div class="top">
      <div class="topLeft">
        <img :src="redpack_info.thumb" alt="" />
      </div>
      <div class="topRight">
        <!-- <div class="title_right"> -->
          <span class="title_right">{{ redpack_info.title }}</span>
        <!-- </div> -->
        <div class="time">红包截止时间：{{ redpack_info.created_at }}——{{ redpack_info.valid_time_date }}</div>
        <div class="txt">类型：{{ redpack_info.redpack_type_name }}</div>
        <div class="txt">
          红包个数：<span>{{ redpack_info.number }}</span> 个
        </div>
        <div class="txt">
          总数：<span>{{ redpack_info.amount_total }}</span> {{ balance }}
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="txt">
        已领取：<span>{{ redpack_info.finish_number }}</span>
      </div>
      <div class="txt">
        剩余红包数量：<span>{{ redpack_info.surplus_number }}</span>
      </div>
      <div class="txt">
        剩余{{ balance }}：<span>{{ redpack_info.surplus_amount }}</span>
      </div>
    </div>
    <div class="contenBox">
      <div class="title">领取记录</div>
      <div class="list" v-for="(item, index) in receive_log_list" :key="index">
        <div class="left">
          <div class="img" v-if="item.member">
            <img :src="item.member.avatar" alt="" />
          </div>
          <div class="member">
            <div v-if="item.member">{{ item.member.nickname }}</div>
            <div>{{ item.created_at }}</div>
          </div>
        </div>
        <div class="right">{{ item.amount }}</div>
      </div>
      <van-empty image="default" v-if="receive_log_list.length <= 0" />
    </div>
  </div>
</template>
<script>
import personRedListDetail_controller from "./personRedListDetail_controller";

export default personRedListDetail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.contenBox {
  width: 21.88rem;
  background-color: #fff;
  border-radius: 0.47rem;
  margin: 0 auto;
  margin-top: 0.63rem;
  overflow: hidden;

  .title {
    margin: 0.91rem;
    font-size: 0.94rem;
    color: #545454;
  }

  .list {
    display: flex;
    padding: 0 0.84rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.56rem;

    .right {
      font-size: 0.88rem;
      color: #f14e4e;
    }

    .left {
      display: flex;
      align-items: center;

      .member {
        text-align: left;
      }

      .img {
        width: 2.19rem;
        height: 2.19rem;
        background-color: #c2c2c2;
        margin-right: 0.63rem;
        border-radius: 100%;

        img {
          width: 100%;
        }
      }
    }
  }
}

.top {
  width: 21.88rem;
  background-color: #fff;
  border-radius: 0.47rem;
  margin: 0 auto;
  margin-top: 0.63rem;
  padding: 0.81rem 1.13rem 0.8rem 0.53rem;
  display: flex;

  .topRight {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;

    .title_right {
      width: 100%;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 1rem;
      color: #515151;
    }

    .time {
      text-align: left;
      font-size: 0.63rem;
      color: #ce2e06;
    }

    .txt {
      font-size: 0.75rem;
      color: #636363;
      text-align: left;

      span {
        color: #f14e4e;
        font-size: 0.75rem;
      }
    }
  }

  .topLeft {
    width: 3.75rem;
    height: 3.75rem;
    margin-right: 0.56rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.middle {
  width: 21.88rem;
  height: 2.75rem;
  background-color: #fff;
  border-radius: 0.47rem;
  margin: 0 auto;
  margin-top: 0.63rem;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .txt {
    font-size: 0.69rem;
    color: #636363;

    span {
      color: #f14e4e;
      font-size: 0.69rem;
    }
  }
}
</style>
