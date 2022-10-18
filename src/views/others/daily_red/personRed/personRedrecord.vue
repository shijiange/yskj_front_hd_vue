<template>
  <div id="personRedrecord">
    <c-title :hide="false" text="领取记录" />
    <div class="contenBox">
      <div class="img" v-if="info.redpack_info">
        <img :src="info.redpack_info.thumb" alt="" />
      </div>
      <div class="txt" v-if="info.redpack_info">{{ info.redpack_info.nickname }} 的红包</div>
      <div class="priceTxt">￥{{ info.receive_amount }}</div>
    </div>
    <div class="listbox">
      <div class="top">
        <div class="viewbox">
          红包总数量：<span v-if="info.redpack_info">{{ info.redpack_info.number }}</span> 个
        </div>
        <div class="viewbox">
          剩余红包数量：<span v-if="info.redpack_info">{{ info.redpack_info.surplus_number }}</span> 个
        </div>
      </div>
      <div class="list" v-for="(item, index) in receive_logs" :key="index">
        <div class="left">
          <div class="img" v-if="item.member">
            <img :src="item.member.avatar_image" alt="" />
          </div>
          <div class="member">
            <div v-if="item.member">{{ item.member.nickname }}</div>
            <div class="time">{{ item.created_at }}</div>
          </div>
        </div>
        <div class="right">{{ item.amount }}</div>
      </div>
      <van-empty image="default" v-if="receive_logs.length <= 0" />
    </div>
  </div>
</template>
<script>
import personRedrecord_controller from "./personRedrecord_controller";

export default personRedrecord_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.contenBox {
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/bj2.png");
  height: 12.41rem;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;

  .priceTxt {
    font-size: 2.25rem;
    color: #fff1c3;
    margin-top: 1rem;
  }

  .txt {
    font-size: 0.94rem;
    color: #fff1c3;
    margin-top: 0.72rem;
  }

  .img {
    width: 3.31rem;
    height: 3.31rem;
    background-color: #fff;
    border-radius: 0.31rem;
    margin-top: 1.91rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.31rem;
    }
  }
}

.listbox {
  width: 23.44rem;
  background-color: #fff;
  border-radius: 0.63rem 0.63rem 0 0;
  margin: 0 auto;
  margin-top: -0.41rem;
  padding-bottom: 2rem;

  .list {
    display: flex;
    padding: 0 0.91rem;
    align-items: center;
    justify-content: space-between;
    // margin-bottom: 1.56rem;
    margin-top: 1.06rem;
    padding-bottom: 1rem;

    .right {
      font-size: 0.88rem;
      color: #f14e4e;
    }

    .left {
      display: flex;
      align-items: center;

      .member {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;

        .time {
          color: #818181;
        }
      }

      .img {
        width: 2.19rem;
        height: 2.19rem;
        background-color: #c2c2c2;
        margin-right: 0.63rem;
        border-radius: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.81rem;
    margin: 0 0.94rem;
    border-bottom: 1px solid #f2f2f2;
    font-size: 0.75rem;

    .viewbox {
      width: 50%;
      text-align: center;

      span {
        color: #f14e4e;
        font-size: 0.75rem;
      }
    }
  }
}
</style>
