<template>
  <div id="search3" transition="fadeInLeft">
    <div id="soso"
         class="uou"
         :class="{'mout':amout}">
      <div class="search set-pc-style">
        <div slot="prepend"
             icon="back"
             @click='goback'>
          <i class="iconfont icon-back"></i>
        </div>
        <div class="searchBox">
          <form @submit.prevent
                action="#">
            <input type="search"
                   placeholder="搜索当前分类商品"
                   @keypress="enterSearch"
                   v-model="inputs">
          </form>
          <div class="img-icon"
               @click='search'>
            <div class="img-icon-btn"></div>
          </div>
        </div>

      </div>
    </div>
    <div style="height: 1.5625rem; display: block;"></div>
    <div class="page-loadmore-wrapper"
         ref="wrapper"
         :style="{ height: wrapperHeight + 'px' }">
      <c-goodsList :isSelect="$route.params.isSelect"
                   :num='0'
                   @selectTotal="changeTotal"
                   :goods='datas'
                   text='搜索结果'
                   class='osll'
                   :loading='loading'
                   :selectedGoods='setData'></c-goodsList>

    </div>

    <div class="bottom set-pc-style">
      <i>
        已选&nbsp;
        <b>{{totalGoodsNum}}</b>&nbsp;件商品
      </i>
      <span>
        <div @click="pushFn">
          确定选择
        </div>

      </span>
    </div>

  </div>
</template>

<script>
import catelist_controller from "./catelist_controller";

export default catelist_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #search3 {
    .bottom {
      width: 100%;
      box-sizing: border-box;
      padding-left: 0.9375rem;
      border-top: 0.0625rem solid #eaeaea;
      position: fixed;
      bottom: 0;
      background: #fff;
      font-size: 18px;
      text-align: left;
      line-height: 3.125rem;

      i {
        font-style: normal;
      }

      a {
        color: #000;
      }

      b {
        color: #f37385;
      }

      span {
        width: 130px;

        /* padding: 15px; */
        text-align: center;
        height: 3.125rem;
        color: #fff;
        background: #f15353;
        float: right;
        display: inline-block;

        a,
        div {
          font-size: 16px;
          color: #fff;
        }
      }
    }

    .osll {
      min-height: 100vh;
      margin-top: 1.375rem;
      box-sizing: border-box;
    }
    // @descendent wrapper {
    // 	overflow: scroll;
    // }
    .page-loadmore-wrapper2 {
      height: 100vh;
      overflow: hidden;
    }

    .uou {
      position: fixed;
      z-index: 99;
      top: 0;
      transition: 0.2s;
      -webkit-transition: 0.2s;
      width: 100%;
      background: #fff;
    }

    .mout {
      top: -2.25rem;
    }
  }

  .search {
    overflow: hidden;
    background: #fff;
    border-bottom: 0.0625rem solid #f5f5f5;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 1rem;

    .mint-button.mint-button--default {
      float: left;
      width: 10%;
      border: none;
      padding-top: 0.4rem;
      box-shadow: none;
    }

    .searchBox {
      position: relative;
      font-size: 14px;
      display: inline-table;
      float: left;
      width: 80%;
      margin-left: 2%;
      height: 2.8125rem;

      input {
        vertical-align: middle;
        border: none;
        background: #f2f2f2 none;
        box-sizing: border-box;
        outline: 0;
        padding: 0.1875rem 0.625rem;
        height: 1.875rem;
        line-height: 1.875rem;
        margin-top: 0.5rem;
        color: #8c8c8c;
        font-size: 14px;
        width: 17.75rem;
        border-radius: 0.9375rem;
        z-index: 10;
      }

      .img-icon {
        border: none;
        color: #a9a9a9;
        display: table-cell;
        position: relative;
        border-radius: 0;
        height: 1.875rem;
        top: 0.0625rem;
        opacity: 2;
        left: -2.25rem;

        .img-icon-btn {
          position: absolute;
          z-index: 12;
          width: 1rem;
          height: 1rem;
          top: 50%;
          left: 50%;
          margin-left: -0.5rem;
          margin-top: -0.5rem;
          background: url("../../../../assets/images/search.png") no-repeat center center;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
