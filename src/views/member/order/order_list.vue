<template>
  <div id="payment">
    <c-title :hide="false" :text="pageTitle"></c-title>
    <!--搜索30px和tab50px + 上下内边距5px-->
    <div :style="{height: !amout && (orderType == 'shop' || orderType == 'storeMang') ? '90px':(orderType == 'stock'?'40px':'60px')}"></div>

    <div class="search" :style="{top: amout && (orderType == 'shop' || orderType == 'storeMang') ? '10px':'40px',height: (orderType == 'shop' || orderType == 'storeMang') ? '90px': (orderType == 'stock'?'':'60px')}" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="search-box" v-if="orderType == 'shop' || orderType == 'storeMang' || orderType == 'stock'">
        <!-- 订单类型-下拉选择框 -->
        <el-select
          v-if="orderType == 'storeMang'"
          class="left-select"
          v-model="keywordType"
          placeholder="请选择" size="mini"
          :popper-append-to-body="false"
        >
          <el-option
            class="down-select-opt"
            v-for="(item) in keywordTypes"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="right-search">
          <form @submit.prevent action="#" style="flex:1">
            <!-- <input
              type="search"
              ref="search_input"
              style="text-align: left;padding-left:1rem"
              placeholder="搜索订单"
              @keypress="enterSearch"
              v-model="keywords"
            /> -->
            <van-field
              class="input"
              v-model="keywords"
              ref="search_input"
              @keypress.native="enterSearch"
              placeholder="搜索订单" clearable
            ></van-field>
          </form>
          <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
        </div>
      </div>
      <van-tabs
        v-if="orderType != 'stock'"
        v-model="selected"
        @click="swichTabTItem"
        style="z-index: 98; height: 50px; line-height: 50px;"
      >
        <!-- 绑定一个子组件调用的事件 -->
        <van-tab
          v-for="(item, index) in setNavList"
          :key="index"
          :name="index.toString()"
          :title="item"></van-tab>
      </van-tabs>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div>
      <!-- <mt-tab-container v-model="selected"> -->
        <div v-for="(items, key, indexs) in dataList" :key="indexs" v-show="selected==indexs.toString()">
        <!-- <mt-tab-container-item v-for="(items, key, indexs) in dataList" :key="indexs" :id="indexs.toString()"> -->
          <cOrderList
            v-on:ConfrimOrderNotification="cofirmOrderAction"
            v-on:ToDetailNotification="toDetail"
            v-on:MultiplePayNotification="multiplePayAction"
            ref="mychild"
            :datasource="items"
            :orderType="orderType"
            :detailUrl="detailUrl"
            :status="indexs.toString()"
            :consolidated="consolidated_payment"
            :custom_receipt_confirmation_html="custom_receipt_confirmation_html"
            class="osll"
          ></cOrderList>
        <!-- </mt-tab-container-item> -->
        </div>
      <!-- </mt-tab-container> -->
      </div>
    </van-pull-refresh>
    <div class="contes" v-if="selected == 1 && isMultiplePay && consolidated_payment">
      <button @click="toMultiplePay">合并支付</button>
    </div>





  </div>
</template>
<script>
import orderListController from "./order_listController";
export default orderListController;
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
  padding: 5px 0;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding: 0;
    // background-color: #f2f2f2;
    height: 30px;
    line-height: 30px;
    // border-radius: 0.875rem;
    /deep/ .left-select {
      max-width: 4.3rem;
      .el-input {
        input {
          border: none;
          padding: 0;
        }
      }
      .el-select-dropdown {
        position: absolute !important;
        min-width: none;
        width: auto !important;
      }
      .el-select-dropdown__item {
        padding: 0 1.5625rem;
        font-size: 0.75rem;
        color: #545454;
      }
    }
    .right-search {
      flex: 1;
      display: flex;
      align-items: center;
      line-height: 28px;
      margin-left: 0.8rem;
      background-color: #f2f2f2;
      border-radius: 0.875rem;
      form {
        padding-right: 1.4rem;
      }
      .input {
        flex: 1;
        width: 100%;
        line-height: 28px;
        border: none;
        color: #333;
        // text-align: center;
        text-align: left;
        padding-left:1rem;
        background-color: transparent;
      }
      i {
        position: absolute;
        right: 1rem;
        flex: 0 0 1.5rem;
      }
    }
  }

  &.pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }
}

</style>
