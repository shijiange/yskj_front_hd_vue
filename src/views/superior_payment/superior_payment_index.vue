<template>
  <div class="page">
    <c-title :text="title_name"></c-title>
    <div class="container">
      <div class="order-wrapper">
        <order-info v-if="goodList.length > 0" :goodList="goodList" :totalPrice="totalPrice" :totalNum="totalNum"></order-info>
      </div>
      <div class="ther-wrapper">
        <div class="step">
          <div class="step-title">步骤：</div>
          <div class="circular">
            <div class="num" data-num="1"></div>
            <div class="text">留言并分享</div>
          </div>
          <div class="hr"></div>
          <div class="circular">
            <div class="num" data-num="2"></div>
            <div class="text">好友付款</div>
          </div>
          <div class="hr"></div>
          <div class="circular">
            <div class="num" data-num="3"></div>
            <div class="text">付款成功</div>
          </div>
        </div>

        <div class="share">
          <div class="share-title">分享描述</div>
          <div class="textarea">
            <textarea v-model="shareContent" placeholder="请分享你的描述" cols="30" rows="10"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="btns">
      <div class="btn" @click="handShare">找小伙伴帮忙付款</div>
    </div>
  </div>
</template>

<script>
import superiorPaymentController from "./superior_payment_index_controller";

export default superiorPaymentController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(235, 235, 235);
  min-height: 100vh;
}

.container {
  padding: 0.625rem 0.938rem;

  .order-wrapper {
    background: #fff;
    border-radius: 0.469rem;
  }

  .ther-wrapper {
    width: 100%;
    margin-top: 0.625rem;
    padding: 0 0.813rem;
    padding-bottom: 0.688rem;
    background: #fff;
    border-radius: 0.469rem;

    .step {
      display: flex;
      align-items: center;
      height: 5.406rem;

      .step-title {
        height: 2.5rem;
        font-size: 0.75rem;
        color: #a3a3a3;
      }

      .circular {
        display: flex;
        flex-direction: column;
        align-items: center;

        .num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          border: solid 0.031rem #f14e4e;
          border-radius: 50%;

          &::after {
            content: attr(data-num);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 0.938rem;
            height: 0.938rem;
            font-size: 0.688rem;
            color: #fff;
            background-color: #f14e4e;
            border-radius: 50%;
          }
        }

        .text {
          margin-top: 0.5rem;
          font-size: 0.688rem;
          color: #f14e4e;
        }
      }

      .hr {
        width: 3.063rem;
        height: 1.7rem;
        display: flex;
        align-items: flex-start;

        &::after {
          content: "";
          display: block;
          width: 4.063rem;
          height: 0.125rem;
          margin-left: -0.3rem;
          background-color: #f14e4e;
          border-radius: 0.063rem;
        }
      }
    }

    .share {
      .share-title {
        text-align: left;
        font-size: 0.938rem;
        color: #303030;
      }

      .textarea {
        padding-top: 0.813rem;

        textarea {
          width: 100%;
          height: 8.75rem;
          padding: 0.75rem 0.781rem;
          background-color: #f1f1f1;
          border-radius: 0.25rem;
          border: none;
        }
      }
    }
  }
}

.btns {
  height: 3.344rem;
  margin-top: 1rem;
  padding: 0 0.938rem;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    margin: 0 auto;
    font-size: 0.938rem;
    color: #fff;
    background-color: #f14e4e;
    border-radius: 0.313rem;
  }
}
</style>
