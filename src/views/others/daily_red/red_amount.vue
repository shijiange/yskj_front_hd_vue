<template>
  <div id="RedAmount">
    <c-title :hide="false" :text="'红包额度记录'"> </c-title>

    <div class="head">
      <div class="head-img" v-if="memberData">
        <img :src="memberData.avatar_image" alt="" />
        <span>{{ memberData.username }}</span>
      </div>
      <div class="money">
        <div>
          <span class="gray">累计额度</span>
          <span>{{ $i18n.t("money") }}{{ tag == "new" ? receive_logs.quota_total : receive_logs.amount_sum }}</span>
        </div>
        <div>
          <span class="gray">已使用额度</span>
          <span>{{ $i18n.t("money") }}{{ tag == "new" ? receive_logs.use_total : receive_logs.receive_amount }}</span>
        </div>
        <div>
          <span class="gray">剩余额度</span>
          <span>{{ $i18n.t("money") }}{{ tag == "new" ? Number(receive_logs.surplus_total).toFixed(2) : (receive_logs.amount_sum - receive_logs.receive_amount).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="blank" v-if="!recordsList">
      <img src="../../../assets/images/blank.png" />
      <span>还没有记录哦</span>
    </div>

    <div class="content" v-if="recordsList">
      <div class="title">
        <span class="first">订单号</span>
        <span>订单金额(元)</span>
        <span>额度金额(元)</span>
      </div>
      <ul>
        <li v-for="(item, index) in recordsList" :key="index">
          <div class="first">
            <span>{{ item.order_sn }}</span>
            <div class="time">{{ item.created_at }}</div>
          </div>
          <div style="line-height: 2rem;">
            {{ item.amount }}
          </div>
          <div style="line-height: 2rem; color: #ff2a52;">
            {{ item.receive_amount }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import red_amount_controller from "./red_amount_controller";

export default red_amount_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#RedAmount {
  background-color: #fff;
  padding: 1rem;

  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .head-img {
    display: flex;
    margin-bottom: 1rem;

    img {
      flex: 0 0 3.5rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    span {
      flex: 1;
      line-height: 3rem;
      text-align: left;
      margin-left: 1rem;
    }
  }

  .money {
    display: flex;

    div {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .gray {
      font-size: 12px;
      color: #999;
    }
  }

  .first {
    flex: 0 0 8rem;
  }

  .content {
    margin: 1.5rem 0;
    font-size: 12px;

    ul {
      margin-top: 0.3rem;
    }

    li {
      display: flex;
      padding: 0.5rem 0;
      border-bottom: 0.01rem solid #eeeded;

      div {
        flex: 1;
      }

      .time {
        color: #999;
      }
    }
  }

  .title {
    display: flex;
    font-size: 14px;

    span {
      flex: 1;
      color: #666;
    }
  }
}
</style>
