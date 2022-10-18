<template>
  <div class="page">
    <c-title :text="title_name"></c-title>
    <div class="container">
      <div class="info-wrapper">
        <div class="total">
          <div class="pay-price">
            <div class="price">￥{{ details.reward }}</div>
            <div class="text">累计代付奖励</div>
          </div>
          <div class="pay-price">
            <div class="price">￥{{ details.commission }}</div>
            <div class="text">累计代付佣金奖励</div>
          </div>
        </div>
        <div class="items">
          <div class="item">
            <div class="name">奖励状态</div>
            <div class="text">{{ details.status_name }}</div>
          </div>
          <div class="item">
            <div class="name">下单会员</div>
            <div class="face">
              <img :src="details.buy_avatar_image" alt="" />
            </div>
            <div class="text">{{ details.buy_nickname }}</div>
          </div>
          <div class="item">
            <div class="name">订单编号</div>
            <div class="text">{{ details.order_sn }}</div>
          </div>
          <div class="item">
            <div class="name">付款时间</div>
            <div class="text">{{ details.created_at }}</div>
          </div>
          <div class="item">
            <div class="name">支付方式</div>
            <div class="text">{{ details.pay_type_name }}</div>
          </div>
        </div>
      </div>
      <div class="order-wrapper">
        <order-info v-if="goodList.length > 0" :goodList="goodList" :totalPrice="totalPrice" :totalNum="totalNum"></order-info>
      </div>
    </div>
  </div>
</template>

<script>
import superiorPaymentDetailsController from "./superior_payment_details_controller";

export default superiorPaymentDetailsController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(235, 235, 235);
  min-height: 100vh;
}

.container {
  padding: 0.625rem 0.906rem;

  .info-wrapper {
    width: 100%;
    height: 15.938rem;
    padding: 0 0.938rem;
    background-color: #fff;
    border-radius: 0.469rem;

    .total {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 5.4rem;

      .pay-price {
        display: flex;
        flex-direction: column;

        .price {
          font-size: 1rem;
          color: #f15353;
        }

        .text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #8c8c8c;
        }
      }
    }

    .items {
      .item {
        display: flex;
        align-items: center;
        height: 2.094rem;

        .name {
          flex: 1;
          text-align: left;
          font-size: 0.875rem;
          color: #666;
        }

        .face {
          width: 1.094rem;
          height: 1.094rem;
          margin-right: 0.281rem;

          img {
            width: 1.094rem;
            height: 1.094rem;
            border-radius: 50%;
          }
        }

        .text {
          font-size: 0.875rem;
          color: #202020;
        }
      }
    }
  }

  .order-wrapper {
    margin-top: 0.625rem;
    background-color: #fff;
    border-radius: 0.469rem;
  }
}
</style>
