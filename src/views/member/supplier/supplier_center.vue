<template>
  <div id="supplier-center">
    <c-title :hide="false" text="供应商管理"></c-title>
    <div class="user">
      <van-swipe :autoplay="4000" indicator-color="#f15353" :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth" v-if="bannerStatus == 1">
        <van-swipe-item v-for="(slide, index) in bannerList" :key="index">
          <a :href="slide.url" style="display: block;">
            <img width="100%" style="height: 11.5rem;" :src="slide" />
          </a>
        </van-swipe-item>
      </van-swipe>
      <div class="addPosition">
        <div class="user-header">
          <div class="img">
            <img :src="mainInfo.avatar" />
          </div>
          <div>
            <span>用户名：{{ mainInfo.nickname }}</span>
          </div>
        </div>
        <div class="user-info">
          <ul>
            <li>
              <b>{{ order_count }}</b>
            </li>
            <li><span>今日订单（笔）</span></li>
          </ul>
          <ul>
            <li>
              <b>{{ order_amount }}</b>
            </li>
            <li><span>今日销售（元）</span></li>
          </ul>
          <ul>
            <li>
              <b>{{ money_total }}</b>
            </li>
            <li>
              <span>累计{{ income_name_text }}（元）</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="withdraw">
      <ul>
        <li>可{{ this.fun.initWithdrawal() }}金额</li>
        <li>
          {{ $i18n.t("money") }}<i>{{ cost_money }}</i>
        </li>
      </ul>
      <span @click="goToInfo('5')">{{ this.fun.initWithdrawal() }}</span>
    </div>
    <div class="store-box">
      <div class="my-store">
        <span>我的店铺</span>
      </div>
      <div class="manage-list">
        <ul @click="goToInfo('1')">
          <div class="img">
            <img src="../../../assets/images/supplier-info.png" />
          </div>
          <li><span>信息管理</span></li>
        </ul>
        <ul @click="goToInfo('2')">
          <div class="img">
            <img src="../../../assets/images/supplier-goods.png" />
          </div>
          <li><span>商品管理</span></li>
        </ul>
        <ul @click="goToInfo('3')">
          <div class="img">
            <img src="../../../assets/images/supplier-order.png" />
          </div>
          <li><span>订单管理</span></li>
        </ul>
        <ul @click="goToInfo('4')">
          <div class="img">
            <img src="../../../assets/images/supplier-withdraw.png" />
          </div>
          <li>
            <span>{{ this.fun.initWithdrawal() }}记录</span>
          </li>
        </ul>
        <ul @click="goToInfo('6')" v-if="insuclShow">
          <div class="img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/supplier-policy.png" />
          </div>
          <li><span>保单管理</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import supplier_center_controller from "./supplier_center_controller";
export default supplier_center_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#supplier-center {
  .user {
    background-color: #f15353;
    color: #fff;
    position: relative;
    height: 11.5rem;
    overflow: hidden;

    .addPosition {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .user-header {
      padding: 0.875rem;

      .img {
        margin-right: 0.625rem;
        width: 3.25rem;
        height: 3.25rem;
        border: solid 0.125rem #fff;
        overflow: hidden;
        border-radius: 50%;
        margin: 0 auto;

        img {
          width: 100%;
        }
      }

      span {
        font-size: 14px;
        display: block;
        line-height: 2.25rem;
      }
    }

    .user-info {
      background: rgba(255, 255, 255, 0.3);
      display: flex;

      ul {
        margin: 0.625rem 0;
        width: 33.3%;
        line-height: 1.5rem;

        b {
          font-size: 18px;
        }
      }

      ul:last-child {
        border-right: none;
      }
    }
  }

  .withdraw {
    background: #fff;
    display: flex;
    padding: 0.875rem;
    font-size: 14px;
    position: relative;

    ul {
      text-align: left;
      line-height: 1.5rem;

      li:last-child {
        color: #f15353;
      }

      i {
        font-size: 18px;
      }
    }

    span {
      display: block;
      position: absolute;
      height: 1.625rem;
      line-height: 1.625rem;
      padding: 0 1rem;
      right: 0.875rem;
      top: 1.5rem;
      background: #f15353;
      color: #fff;
      border-radius: 0.1875rem;
    }
  }

  .store-box {
    margin-top: 0.625rem;
    background: #fff;
    height: 22.5rem;

    .my-store {
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 14px;
      padding: 0 0.875rem;
      display: flex;
      justify-content: space-between;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        font-size: 1.25rem;
        color: #c9c9c9;
        line-height: 2.5rem;
      }
    }

    .manage-list {
      margin-top: 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-wrap: wrap;

      ul {
        margin-bottom: 0.625rem;
        width: 33.3%;

        .img {
          width: 2.25rem;
          height: 2.25rem;
          margin: 0 auto;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        li {
          line-height: 1.5rem;
        }
      }
    }
  }
}
</style>
