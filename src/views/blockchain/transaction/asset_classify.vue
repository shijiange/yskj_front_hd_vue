<template>
  <div id="assetClassify">

    <div class="m-t-10">
      <a class="mint-cell mint-field">
        <div class="mint-cell-wrapper">
          <div @click='goback' style="padding-right: 0.5rem;">
            <i class="iconfont icon-back"></i>
          </div>
          <div class="mint-cell-value" style="font-size: 14px;">
            <form @submit.prevent action="#" style="width: 100%;">
              <input v-model="address_detail" type="search"
                     @keypress="searchGoods"
                     placeholder="输入关键字搜索"
                     class="mint-field-core text-right">
            </form>
            <i @click="searchAsset" class="search_icon"></i>
          </div>
        </div>
        <div class="classify" @click="showClass">
          <span>全部分类</span><i class="iconfont icon-down"></i>
        </div>
      </a>
    </div>

    <transition name="fade">
      <div class="popup-bg" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" @click="showPopup = false" v-show="showPopup" @touchmove.prevent>
        <div class="popup" v-show="showPopup">
          <div class="up"></div>
          <div class="cartWrapper" ref="cartWrapper"
               style="max-height: 23rem; overflow: hidden; border-top: solid 0.0625rem #ebebeb;">
            <ul class="popups">
              <li @click="chooseClassify(index,item)" v-for="(item,index) in classify"
                  :class="chooseID === index?'choose':''" :key='index'>
                {{item.name}}
              </li>
            </ul>
          </div>
        </div>

      </div>
    </transition>

    <div class="space" style="height: 0.5rem; background: #f5f5f5;"></div>

    <div class="company_list">
      <div class="title">
        <p>{{lang.capital_name}}信息</p>
        <p @click="toggle('1')">数量 <i :style="sortNum === 1 && one_up?'color: #f15353':''"
                                      class="iconfont icon-up_arrow"></i><i
          :style="sortNum === 1 && !one_up?'color: #f15353':''" class="iconfont icon-down_arrow"></i></p>
        <p @click="toggle('2')">单价 <i :style="sortNum === 2 && two_up?'color: #f15353':''"
                                      class="iconfont icon-up_arrow"></i><i
          :style="sortNum === 2 && !two_up?'color: #f15353':''" class="iconfont icon-down_arrow"></i></p>
        <p>操作</p>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul class="company">
          <li v-for="(item,i) in companyList" :key='i'>
            <p @click="toCompany(item)">{{item.asset_name}}</p>
            <p>{{item.total}}</p>
            <p>{{$i18n.t("money")}}{{item.price}}</p>
            <p><span class="buy" @click="toBuying(item)">{{lang.buy_name}}</span></p>
          </li>
        </ul>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import asset_classify_controller from "./asset_classify_controller";

export default asset_classify_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #assetClassify {
    background: #fff;

    .mint-cell {
      display: flex;
    }

    .mint-cell-wrapper {
      display: flex;
      align-items: center;
      width: 18rem;
    }

    .mint-cell-value {
      background: #f5f5f5;
      border-radius: 0.9375rem;
      padding: 0.2rem 0.5rem;
      height: 1.75rem;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        line-height: 1.75rem;
        border: none;
        color: #333;
      }
    }

    .classify {
      margin-left: 0.5rem;
      line-height: 2.75rem;
    }

    .classify1 {
      margin: 0.2rem 0 0 1rem;
      font-size: 16px;
      line-height: 2.75rem;
    }

    .search_icon {
      padding: 0 0.5rem 0 1rem;
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background-image: url("../../../assets/images/search.png");
      background-repeat: no-repeat;
    }

    .down {
      width: 0;
      height: 0;
      border-left: 0.375rem solid transparent;
      border-right: 0.375rem solid transparent;
      border-top: 0.375rem solid #333;
      position: relative;
      top: 0.75rem;
      left: 0.125rem;
    }

    .popup-bg {
      position: fixed;
      top: 3rem;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 10;
    }

    .popup-bg.pcStyle {
      width: 375px;
      left: 50%;
      transform: translateX(-50%);
    }

    .popup {
      position: absolute;
      top: 0;
      right: 0.5rem;
      width: 7rem;
      background-color: #333;
      opacity: 0.9;
    }

    .up {
      position: absolute;
      right: 0.8rem;
      top: -0.5rem;
      width: 0;
      height: 0;
      border-left: 0.375rem solid transparent;

      /* border-top: 0.625rem solid #5851c3; */
      border-right: 0.375rem solid transparent;
      border-bottom: 0.5rem solid #333;
      box-sizing: border-box;
      opacity: 0.9;
    }

    .popups {
      li {
        background-color: #333;
        opacity: 0.9;
        color: #fff;
        border-bottom: solid 0.0625rem #fff;
        line-height: 2.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      li:first-child {
        border-radius: 0.3125rem 0.3125rem 0 0;
      }

      li:last-child {
        border-radius: 0 0 0.3125rem 0.3125rem;
      }

      .choose {
        color: #f7a145;
      }
    }

    .company_list {
      width: 100%;

      .title {
        display: flex;
        color: #333;
        padding: 0.5rem 0;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;

        p {
          flex: 1;

          i {
            color: #999;
          }

          .icon-down_arrow {
            margin-left: -0.625rem;
          }
        }

        .icon {
          display: inline-block;
          width: 0.5rem;
          height: 0.8rem;
          background-color: #469de2;
        }
      }

      .company {
        li {
          display: flex;
          padding: 1rem 0;
          border-bottom: solid 1px #ebebeb;

          p {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .buy {
          color: #fff;
          padding: 0.3rem 0.8rem;
          background-color: #f7a145;
          border-radius: 0.19rem;
        }
      }
    }
  }
</style>
