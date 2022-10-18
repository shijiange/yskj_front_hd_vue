<template>
  <div id="pay-another">
    <c-title :hide="false" text='代付详情'></c-title>
    <div class="detail-box">
      <div class="detail-top">
        <div class="img"><img :src="payerImg"></div>
        <span>{{payerName}}&nbsp;&nbsp;请您帮忙代付一笔订单</span>
      </div>
      <h1>{{$i18n.t("money")}}{{money}}</h1>
      <div class="line"></div>
      <h2>好友代付说明</h2>
      <ul>
        <li style="color: #f15353; font-weight: bold;">代付前请和好友确认核实订单详情,以免下错订单</li>
      </ul>
    </div>
    <div class="pay-box">
      <div class="order-info"><span>订单信息</span></div>
      <div v-for="(items,i) in goodList" :key='i'>
        <div class="pay-pro" v-for="(item,i) in items.has_many_order_goods" :key='i'>
          <div class="img"><img :src="item.thumb"></div>
          <div class="title">
            <div class="top">
              <span class="title-left">{{item.title}}</span><br>
              <span class="title-right">{{$i18n.t("money")}}{{item.price}}</span><br>
            </div>
            <div class="bottom_spec">
              <span class="title-left">规格:{{item.goods_option_title}}</span><br>
              <span class="title-right">X{{item.total}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pay-sum"><span>共{{totalNum}}件商品&nbsp;&nbsp;实付：{{$i18n.t("money")}}<span class="money">{{money}}</span></span>
      </div>
    </div>
    <!-- <template v-for="(btn,i) in btns">
      <div class="pay-btn" v-show="!isMiniprogram" :key='i' v-if="btn.value!=16">
        <Button :class="[btnclass2(btn.value)]" @click="confirm(btn)">{{btn.name}}</Button>
      </div>
    </template> -->

    <div v-if="isMiniprogram" class="pay-btn">
      <Button class="dai-btn" @click="miniPay">点击右上角分享给好友吧</Button>
    </div>

    <!--yz_pay 包括支付需要的弹窗和红包-->
    <div style='background: #fff;'>
      <yz_pay :popupSpecs="popupSpecs" :showQR="showQR" v-if="btns.length >0"
        :qrcode="qrcode" @submit="confirm" :payType="btns"
        @changePopupSpecs="changePopupSpecs" @balancePay="balancePay">
      </yz_pay>
    </div>
  </div>
</template>

<script>
import pay_another_detail_controller from "./pay_another_detail_controller";

export default pay_another_detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#pay-another {
  padding-bottom: 3rem;
}

.ispaskey {
  .van-number-keyboard {
    position: relative;
  }
}

.top-spare {
  width: 100%;
  height: 2.75rem;
}

.detail-box {
  border-top: solid 0.0625rem #e2e2e2;
  border-bottom: solid 0.0625rem #e2e2e2;
  padding: 0.625rem;
  width: 100%;
  background-color: #fff;

  .detail-top {
    display: flex;

    .img {
      width: 3rem;
      height: 3rem;
      background-color: #888;
      border-radius: 50%;
      margin-right: 0.625rem;

      img {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
      }
    }

    span {
      line-height: 3rem;
      flex: 3;
      text-align: left;
    }
  }

  h1 {
    font-size: 24px;
    color: #f15353;
    font-weight: bold;
    margin: 20px 0;
  }

  .line {
    width: 100%;
    height: 0.0625rem;
    background-color: #e2e2e2;
    margin-bottom: 0.25rem;
  }

  h2 {
    line-height: 1.75rem;
    text-align: left;
  }

  ul {
    text-align: left;
  }
}

.pay-box {
  border-top: solid 0.0625rem #e2e2e2;
  border-bottom: solid 0.0625rem #e2e2e2;
  background-color: #fff;
  width: 100%;
  padding: 0 0.75rem;
  margin-top: 0.25rem;

  .order-info {
    width: 100%;
    border-bottom: solid 0.0625rem #e2e2e2;
    display: flex;
  }

  .order-info span {
    line-height: 2.75rem;
    text-align: start;
    font-size: 14px;
    color: #333;
  }

  .pay-pro {
    width: 100%;
    margin-top: 0.75rem;
    display: flex;
    border-bottom: solid 0.0625rem #e2e2e2;
    padding-bottom: 0.75rem;

    .img {
      flex: 1;
      width: 4rem;
      height: 5.5rem;
      background-color: green;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      flex: 3;
      margin-left: 0.5rem;

      .top {
        display: flex;
        width: 100%;

        .title-left {
          flex: 3;
          text-align: left;
        }

        .title-right {
          flex: 1;
          text-align: right;
        }
      }

      .bottom_spec {
        display: flex;
        margin-top: 0.625rem;
        width: 100%;
        color: #888;

        .title-left {
          flex: 3;
          text-align: left;
        }

        .title-right {
          flex: 1;
          text-align: right;
        }
      }
    }
  }

  .pay-sum {
    line-height: 2.75rem;
    text-align: right;
    font-size: 14px;

    .money {
      font-weight: bold;
      color: #f15353;
      font-size: 16px;
    }
  }
}

.pay-btn {
  margin: 0.625rem 0.75rem;

  button {
    border: none;
    width: 100%;
    height: 2.25rem;
    border-radius: 0.25rem;
    color: #fff;
    font-size: 14px;
  }
}

.wei-btn {
  background-color: #13ce66;
}

.zhi-btn {
  background-color: #46b4ed;
}

.yu-btn {
  background-color: #f15353;
}

.dai-btn {
  background-color: #36db36;
}
</style>
