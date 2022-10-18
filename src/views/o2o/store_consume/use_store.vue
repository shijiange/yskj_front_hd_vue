<template>
  <div id="use-store">
    <c-title :hide="false" :text="'门店消费卡门店'"> </c-title>
    <div class="top clearfix" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <van-search ref="search" v-model="value" placeholder="搜索门店" @clear="handleClear" shape="round" @keypress="handleEnter($event)" @input="handleInput(value)" @blur="handlBlur()" >
        <template slot="left">
          <div @click="handleAddress()">
            <span class="iconfont icon-fontclass-dizhi icon-dizhi"></span>
            <span class="address">{{ address || '请选择定位' }}</span>
          </div>
        </template>
      </van-search>
    </div>

    <div class="img-box">
      <div class="img-text">
        <p class="quota">消费卡额度</p>
        <p class="price"><span>&#165;</span>{{amount}}</p>
      </div>
    </div>
    <div class="can-use">
      <i class="line"></i>
      <span>可使用的门店</span>
    </div>

    <div class="store-list" v-for="item in storeList" :key="item.store_id">
      <div class="clearfix">
        <div class="store-img fl">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="right-text fl">
          <div class="store-name">{{item.store_name}}</div>
          <span class="number">{{item.distance}}{{item.unit}}</span>
        </div>
      </div>
      <div class="bottom-text clearfix">
        <i class="iconfont icon-fontclass-pingfen wuxing"><i class="fraction">{{item.average_score}}分</i></i>
        <span class="sale">月销{{item.order_total}}单</span>
        <span class="fr sure-sale" @click="handleSalse(item.store_id)">核销</span>
      </div>
    </div>

    <div v-if="noStore" class="nostore">暂无门店</div>

    <div v-if="!noStore">
      <div
        style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
         v-if="!noStore && !noneMore && !isLoadMore && activatedStatus"
        @click="getMoreData"
      >
        <!-- {{ $i18n.t('加载更多') }} -->
      </div>
      <div style="width: 100%; height: 80px; line-height: 40px; text-align: center;" v-if="!noStore && noneMore && !isLoadMore">
        {{ $i18n.t('没有更多了') }}
      </div>
    </div>
  </div>

</template>

<script>
import use_store_controller from './use_store_controller';

export default use_store_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#use-store {
  background: #fff;
  text-align: left;
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

.fl {
  float: left;
}

.fr {
  float: right;
}

.top {
  width: 100%;
  position: fixed;
  top: 40px;
  border-top: 1px solid #f3f3f3;
  border-bottom: 1px solid #f3f3f3;
  background: #fff;
  z-index: 3000;
}

.address {
  display: inline-block;
  margin-right: 15px;
  width: 5.1563rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quota {
  text-align: center;
}

.icon-dizhi {
  margin-right: 5px;
  display: inline-block;
  color: #f14e4e;
  vertical-align: top;
}

/deep/.van-search {
  padding: 5px 10px;

  .van-field__body {
    input::placeholder {
      color: #666;
    }
  }
}

.img-box {
  position: relative;
  margin: 0 auto;
  margin-top: 55px;
  width: 20.9375rem;
  height: 9.375rem;
  border-radius: 10px;
  background: url(../../../assets/images/cart_list.png) no-repeat center 0;
  background-position: center 0;
  background-size: cover;
}

.img-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}

.price {
  margin-top: 0.3125rem;
  font-size: 25px;
  font-weight: bold;

  span {
    padding-right: 0.3125rem;
  }
}

.can-use {
  padding: 0.9375rem;
  text-align: left;

  span {
    display: inline-block;
    color: #202020;
    font-size: 18px;
    font-weight: bold;
  }

  .line {
    position: relative;
    top: 3px;
    display: inline-block;
    width: 3px;
    height: 18px;
    margin-right: 0.3125rem;
    background-image: linear-gradient(to bottom, #f14e4e, #f14e4e, #fac0c0);
  }
}

.store-list {
  position: relative;
  padding: 10px;
}

.store-img {
  margin-right: 0.625rem;
  width: 3.125rem;
  height: 3.125rem;
  background: pink;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    border: none;
  }
}

.right-text {
  font-weight: bold;
  color: #333;
}

.store-name {
  width: 14.0625rem;
  height: auto;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.number {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 14px;
}

.bottom-text {
  margin-top: 0.15rem;
  padding-left: 3.75rem;
}

.wuxing {
  color: #fcb23c;
}

.fraction {
  padding: 0 0.1563rem;
  color: #fcb23c;
}

.sale {
  padding-left: 0.9375rem;
  color: #8d8d8d;
}

.sure-sale {
  width: 3.75rem;
  height: 1.5625rem;
  line-height: 1.4rem;
  text-align: center;
  font-size: 14px;
  color: #f14e4e;
  border-radius: 25px;
  border: solid 1px #f14e4e;
  display: inline-block;
  margin-right: 10px;
}

.nostore {
  text-align: center;
  color: #666;
  background: #f5f5f5;
  padding-top: 20px;
}

.address-box {
  width: 30%;
}

.pcStyle {
  width: 375px;
}
</style>
