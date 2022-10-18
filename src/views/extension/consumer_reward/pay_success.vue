<template>
  <div class="page">
    <c-title :hide="false" text="支付成功"></c-title>
    <div class="icon">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/consumer_reward_pay_success_img1.png" alt="" />
    </div>
    <div class="sutext">订单支付成功</div>
    <div class="payItems" v-for="(item, key) in order" :key="key">
      <div class="payItem">
        <div class="text">支付金额</div>
        <div class="price">￥{{ item.price }}</div>
      </div>
      <div class="payItem">
        <div class="text">订单号</div>
        <div class="order">{{ item.order_sn }}</div>
      </div>
    </div>
    <div class="banner">
      <a :href="detail.link"><img :src="detail.pic" alt=""/></a>
    </div>

    <van-overlay :show="popup" @click="popup = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="popup" @click.stop>
            <div class="singleWrapper">
              <div class="name">{{ detail.plugin_name }}</div>
              <div class="container">
                <div class="price">{{ detail.cash }}</div>
                <div class="text">现金红包</div>
              </div>
              <div class="container">
                <div class="price">{{ detail.point }}</div>
                <div class="text">{{ detail.point_name }}</div>
              </div>
              <div class="btn" @click="receive">
                领取
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="popup = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <van-overlay :show="withdrawal" @click="withdrawal = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="withdrawal" @click.stop>
            <div class="withdWrapper">
              <div class="withdWrapper-text">微信红包</div>
              <div class="btn" @click="handWithBtn">去提现</div>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <van-popup v-model="profitShow" round position="bottom" closeable style="max-height: 70%;">
      <div class="profitWrapper">
        <div class="title">填写资料</div>
        <div class="profitForm">
          <template v-if="networkLoading">
            <c-dyPopup v-on:submitsave="dfsave" :datas="dfData" :form_data_id="form_data_id" :form_id="form_id" :status="true" v-if="profitShow"></c-dyPopup>
            <!-- <diyform datas="{{diyform}}" params="{{'order'}}" bind:traCheckedData="traCheckedData"></diyform> -->
          </template>
        </div>
      </div>
    </van-popup>

    <van-overlay :show="qrcodeShow">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="explainWrapper" v-show="qrcodeShow" @click.stop>
            <div class="header">
              <i class="iconfont icon-guanbi" @click="qrcodeShow = false"></i>
            </div>
            <div class="img">
              <img :src="qrcodeImg" alt="" />
            </div>
            <div class="kf_guide">
              请在微信端打开并授权登录
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import pay_success_controller from "./pay_success_controller";

export default pay_success_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
}

.icon {
  padding-top: 1.906rem;
  padding-bottom: 1.094rem;

  img {
    width: 9.438rem;
    height: 9.438rem;
  }
}

.sutext {
  margin-bottom: 2rem;
  font-size: 1.125rem;
  letter-spacing: 0.113rem;
  color: #202020;
  font-weight: bold;
}

.payItems {
  padding: 0.625rem 0.9rem 0;

  .payItem {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    margin-bottom: 1rem;

    .text {
      letter-spacing: 0.1rem;
      color: #666;
    }

    .price {
      color: #f14e4e;
    }

    .order {
      color: #202020;
    }
  }
}

.banner {
  img {
    width: 100%;
  }
}

.popupWrapper {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}

.explainWrapper {
  width: 18.25rem;
  max-height: 24rem;
  background-color: #fff;
  border-radius: 1.531rem;
  padding-bottom: 1rem;
  transition: 0.3s;
  padding-top: 0.5rem;

  .header {
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 1.25rem;

    .icon-guanbi {
      color: #000;
    }
  }

  .img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 12rem;

    img {
      width: 12rem;
      height: 12rem;
    }
  }
}

.withdWrapper {
  position: relative;
  width: 23.406rem;
  height: 26.656rem;
  border-radius: 0.5rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_img2.png);
  background-position: center;
  background-size: cover;

  .withdWrapper-text {
    position: absolute;
    left: 0;
    top: 8rem;
    width: 100%;
    text-align: center;
    font-size: 28px;
    color: #fccf93;
    font-weight: bold;
  }

  .btn {
    position: absolute;
    left: 50%;
    bottom: 2rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12rem;
    height: 2rem;
    color: rgb(219, 15, 15);
    background: #fccf93;
    border-radius: 1rem;
  }
}

.singleWrapper {
  width: 20.813rem;
  height: 22.469rem;
  border-radius: 0.5rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/consumer_reward_pay_success_img2.png);
  background-position: center;
  background-size: cover;

  .name {
    padding-top: 1.081rem;
    font-size: 1.25rem;
    color: #fff;
  }

  .container {
    display: flex;
    width: 15rem;
    height: 5.281rem;
    margin: 0.9rem auto;
    background: #fff;
    border-radius: 0.3rem;
    position: relative;

    .price {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      word-break: break-all;
      padding-left: 0.5rem;
      padding-right: 1rem;
      width: 7rem;
      font-size: 1.56rem;
      color: #f14e4e;
    }

    .text {
      display: flex;
      align-items: center;
      font-size: 1.125rem;
      font-weight: bold;
      color: #333;
    }

    &::before {
      position: absolute;
      left: 6rem;
      top: -5px;
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgb(255, 78, 24);
    }

    &::after {
      position: absolute;
      left: 6rem;
      bottom: -5px;
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgb(255, 78, 24);
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    font-size: 1rem;
    color: #333;
    width: 15.188rem;
    height: 3.281rem;
    line-height: 250%;
    margin: 0 auto;
    margin-top: 2rem;
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/consumer_reward_pay_success_img3.png);
    background-size: cover;
  }
}
</style>
