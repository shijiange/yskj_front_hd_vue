<template>
  <div page="page">
    <c-title :text="title_name"></c-title>
    <div class="header-wrapper">
      <div class="user-info">
        <div class="face">
          <img :src="basics.avatar_image" alt="" />
        </div>
        <div class="name">{{ basics.nickname }}</div>
      </div>
    </div>

    <div class="share_info">
      <div>
        <span>{{ $i18n.t("money") }}{{ basics.reward }}</span
        ><br />
        累计代付奖励
      </div>
      <div>
        <span>{{ $i18n.t("money") }}{{ basics.commission }}</span
        ><br />
        累计代付佣金奖励
      </div>
    </div>

    <van-tabs v-model="activeName">
      <van-tab name="first">
        <span slot="title">代付记录</span>
      </van-tab>
    </van-tabs>
    <div class="list-items">
      <div v-for="item in listData" class="item" :key="item.id">
        <div class="header">
          <div class="order_sn">{{ item.order_sn }}</div>
          <div class="time">{{ item.created_at }}</div>
        </div>
        <div class="desc-wrapper">
          <div class="desc-item">
            <div class="price">{{ item.reward }}</div>
            <div class="text">代付奖励</div>
          </div>
          <div class="desc-item">
            <div class="price">{{ item.commission }}</div>
            <div class="text">代付佣金奖励</div>
          </div>
          <div class="desc-item">
            <div class="text">{{ item.status_name }}</div>
          </div>
        </div>

        <div class="record" @click="toDetailsInfo(item.id)">
          <span class="left look">查看记录</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import superiorPaymentExtensionController from "./superior_payment_extension_controller";

export default superiorPaymentExtensionController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header-wrapper {
  width: 100%;
  height: 6.656rem;
  padding-top: 1.688rem;
  padding-left: 1.531rem;
  background-color: #ee2e2b;

  .user-info {
    display: flex;

    .face {
      img {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
      }
    }

    .name {
      margin-left: 0.683rem;
      font-size: 1rem;
      color: #fff;
    }
  }
}

.share_info {
  width: 100%;
  padding: 1rem 0;
  background-color: #fff;
  margin-bottom: 0.625rem;
  display: flex;
  justify-content: space-between;

  div:first-child {
    border-right: solid 0.0625rem #ebebeb;
  }

  div {
    font-size: 12px;
    line-height: 1.25rem;
    width: 50%;
    box-sizing: border-box;

    span {
      color: #e84f40;
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.list-items {
  .item {
    padding: 0 0.938rem;
    background: #fff;
    margin-bottom: 0.625rem;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 2.5rem;
      border-bottom: 0.05rem solid #ebebeb;

      .order_sn {
        font-size: 0.75rem;
        color: #333;
      }

      .time {
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }

    .desc-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4rem;

      .desc-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .price {
          margin-bottom: 0.3rem;
          font-size: 0.875rem;
          color: #f15353;
        }

        .text {
          font-size: 0.813rem;
          color: #333;
        }
      }
    }

    .record {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.8rem;
      padding-bottom: 0.6rem;

      .look {
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }
  }
}
</style>
