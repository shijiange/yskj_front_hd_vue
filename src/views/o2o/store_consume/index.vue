<template>
  <div id="cart">
    <c-title :hide="false" :text="'门店消费卡'"> </c-title>
    <van-tabs v-model="active" color="red "  title-active-color="#f14e4e"  title-inactive-color="#0c0d0e"  @click="handleTab" v-if="loading">
      <van-tab title="全部" class="all-title">
        <div v-for="item in allCarList" :key="item.id" v-show="loading">
          <div class="coupon-box bor-radius" :class="item.state == 1?'bot':''">
            <p class="cart-text">{{item.name}}</p>
            <div class="bottom-text clearfix">
              <div class="left">
                <p class="quota">消费卡额度</p>
                <div class="price"><span>&#165;</span>{{item.amount}}</div>
              </div>
              <div class="right" @click="handleUse(item.id)" v-if="item.state == 0">使用</div>
              <div class="exchange" v-if="item.state == 1">
                  <!-- <span class="already-use">已使用</span> -->
                  <img src="../../../assets/images/usealy.png" alt="" />
              </div>
            </div>
          </div>
          <div class="use-text" v-if="item.state == 1">
            <p>
              <span>使用时间:</span>
              <span>{{item.card_use.created_at}}</span>
            </p>
            <p class="store">
              <span>门店:</span>
              <span>{{item.card_use.store_name}}</span>
            </p>
          </div>

        </div>
      </van-tab>
      <van-tab title="未使用">
        <div class="coupon-box bor-radius" v-for="item in allCarList" :key="item.id"  v-show="loading">
          <p class="cart-text">{{item.name}}</p>
          <div class="bottom-text clearfix">
            <div class="left">
              <p class="quota">消费卡额度</p>
              <div class="price"><span>&#165;</span>{{item.amount}}</div>
            </div>
            <div class="right" @click="handleUse(item.id)">使用</div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已使用">
        <div v-if="loading">
        <div v-for="item in allCarList" :key="item.id">
          <div class="coupon-box none-radius">
            <p class="cart-text">{{item.name}}</p>
            <div class="bottom-text clearfix">
              <div class="left">
                <p class="quota">消费卡额度</p>
                <div class="price"><span>&#165;</span>{{item.amount}}</div>
              </div>
              <div class="exchange">
                <img src="../../../assets/images/usealy.png" alt="" />
              </div>
            </div>
          </div>
          <div class="use-text">
            <p>
              <span>使用时间:</span>
              <span>{{item.card_use.created_at}}</span>
            </p>
            <p class="store">
              <span>门店:</span>
              <span>{{item.card_use.store_name}}</span>
            </p>
          </div>
        </div>
        </div>
        </van-tab
      >
    </van-tabs>

    <div class="no-data" v-if="noData">暂无数据</div>

    <div v-if="!noData">
      <div
        style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
        v-if="!noData && !noneMore && !isLoadMore && activatedStatus"
        @click="getMoreData"
      >
        {{ $i18n.t('加载更多') }}
      </div>
      <div style="width: 100%; height: 80px; line-height: 40px; text-align: center;" v-if="!noData && noneMore && !isLoadMore">
        {{ $i18n.t('没有更多了') }}
      </div>
    </div>
  </div> 
</template>

<script>
import index_controller from './index_controller';

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#cart {
  /deep/.van-tabs--line .van-tabs__wrap {
    height: 40px;
  }

  /deep/.van-tabs__line {
    background-color: #f14e4e !important;
    border-radius: 3px;
  }

  .coupon-box {
    position: relative;
    padding: 0.625rem;
    margin: 0 auto;
    margin-top: 0.8rem;
    width: 20.9375rem;
    height: 9.375rem;
    background: url(../../../assets/images/index_cart1.png) no-repeat center 0;
    background-position: center 0;
    background-size: cover;
  }

  .bor-radius {
    border-radius: 10px;
  }

  .bottom-text {
    position: absolute;
    width: 93%;
    bottom: 10px;
    color: #fff;
  }

  .cart-text {
    text-align: left;
    font-size: 16px;
    height: 4rem;
    font-weight: bold;
    color: #fff;
  }

  .left {
    float: left;
  }

  .right {
    position: absolute;
    right: 0;
    bottom: 10px;
    width: 3.75rem;
    height: 1.5625rem;
    line-height: 1.5625rem;
    border-radius: 25px;
    border: solid 1px #fff;
  }

  .exchange {
    position: absolute;
    bottom: 2px;
    right: 0;
    width: 4rem;
    height: 4rem;
    // line-height: 3.7rem;
    // background: url(../../../assets/images/exchange.png) no-repeat center 0px;
    // background-position: center 0px;
    // background-size: cover;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .none-radius {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .already-use {
    display: inline-block;
    font-size: 12px;
    transform: rotate(-20deg);
  }

  .already-use img {
    width: 100%;
    height: 100%;
  }

  .quota {
    font-size: 13px;
    color: #fff;
  }

  .price {
    margin-top: 0.3125rem;
    font-size: 25px;
    font-weight: bold;

    span {
      padding-right: 5px;
    }
  }

  .store {
    margin-top: 0.1563rem;
  }

  .use-text {
    padding: 0.625rem;
    margin: 0 auto;
    width: 20.9375rem;
    color: #797979;
    text-align: left;
    border-left: solid 1px #ed6463;
    border-right: solid 1px #ed6463;
    border-bottom: solid 1px #ed6463;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .no-data {
    color: #666;
    margin-top: 20px;
  }

  .clearfix::after {
    content: '';
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }

  .bot {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
