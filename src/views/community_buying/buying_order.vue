<template>
  <div id="payment">
    <c-title :hide="false" text="社区团购"></c-title>
    <!--搜索30px和tab50px-->
    <div :style="{ height: !amout ? '80px' : '50px' }"></div>

    <div
      class="search"
      :style="{ top: amout ? '10px' : '40px', height: '80px' }"
      :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
    >
      <div class="search-box">
        <form @submit.prevent action="#">
          <input type="search" ref="search_input" placeholder="搜索订单" @keypress="enterSearch" v-model="keywords" />
        </form>
        <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
      </div>
      <van-tabs v-model="selected" @click="swichTabTItem" style="z-index: 98; height: 50px; line-height: 50px;">
        <!-- 绑定一个子组件调用的事件 -->
        <van-tab
          v-for="(item, index) in setNavList"
          :key="index"
          :name="index.toString()"
          :title="item"></van-tab
        >
      </van-tabs>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div>
        <div v-for="(items, key, indexs) in dataList" :key="indexs" v-if="selected==indexs.toString()">
          <cOrderList
            v-on:ConfrimOrderNotification="cofirmOrderAction"
            v-on:ToDetailNotification="toDetail"
            v-on:MultiplePayNotification="multiplePayAction"
            ref="mychild"
            :datasource="items"
            :orderType="orderType"
            :detailUrl="detailUrl"
            :status="indexs.toString()"
            :notShowCheck="true"
            class="osll"
          ></cOrderList>
        </div>
      </div>
    </van-pull-refresh>
    <!-- <div class="contes" v-if="isMultiplePay">
      <button @click="toMultiplePay">合并支付</button>
    </div> -->
  </div>
</template>
<script>
import buying_orderController from './buying_orderController';
export default buying_orderController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.osll {
  min-height: 100vh;
}

.contes {
  z-index: 98;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.8125rem;
  background: #fff;
  line-height: 2.8125rem;
  border-top: #e2e2e2 solid 0.0625rem;
  text-align: right;

  button {
    height: 2rem;
    line-height: 2rem;
    border: solid 0.0625rem #f15353;
    background: #f15353;
    border-radius: 25px;
    margin: 0.15rem 0.875rem auto 0;
    color: #fff;
    padding: 0 0.625rem;
  }
}

.pcStyle .contes {
  width: 375px !important;
}

.loadNomore img {
  width: 20%;
}

#payment {
  .mint-navbar.is-fixed {
    top: 40px;
  }
}

.search {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  z-index: 98;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding: 0 0.625rem;
    background-color: #f2f2f2;
    height: 30px;
    line-height: 30px;
    border-radius: 0.875rem;

    form {
      flex: 1;
    }

    input {
      width: 95%;
      line-height: 28px;
      border: none;
      color: #333;
    }

    i {
      //   position: absolute;
      //   right: 1rem;
      flex: 0 0 1.5rem;
    }
  }

  &.pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
