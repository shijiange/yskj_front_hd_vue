<template>
  <div id="classifySearch">
    <div class="m-t-10">
      <a class="mint-cell mint-field">
        <div class="mint-cell-wrapper">
          <div slot="prepend" style="padding-right: 0.5rem;" @click='goback'>
            <i class="iconfont icon-back"></i>
          </div>
          <div class="mint-cell-value" style="font-size: 14px;">
            <i class="search_icon"></i>
            <form @submit.prevent action="#" style="width: 100%;">
              <input v-model="address_detail" type="search"
                     @keypress="searchGoods"
                     placeholder="请输入关键字搜索"
                     class="mint-field-core text-right">
            </form>
          </div>
        </div>
        <div class="classify" @click="getData()">
          搜索
        </div>
      </a>
    </div>

    <div class="company_list">
      <div class="title">
        <p @click="showClass"><span>全部分类</span> <i class="iconfont icon-down"></i>
          <i class="iconfont icon-up" v-if="false"></i></p>
        <p @click="toggle('1')"><span>{{lang.capital_name}}总量</span> <i
          :style="sortNum === 1 && one_up?'color: #f15353':''"
          class="iconfont icon-up_arrow"></i><i
          :style="sortNum === 1 && !one_up?'color: #f15353':''" class="iconfont icon-down_arrow"></i></p>
        <p @click="toggle('2')"><span>发放数量</span> <i :style="sortNum === 2 && two_up?'color: #f15353':''"
                                                     class="iconfont icon-up_arrow"></i><i
          :style="sortNum === 2 && !two_up?'color: #f15353':''"
          class="iconfont icon-down_arrow"></i></p>
        <!--<p @click="toggle('3')"><span>{{lang.subscription_name}}单价</span> <i-->
          <!--:style="sortNum === 3 && three_up?'color: #f15353':''"-->
          <!--class="iconfont icon-up_arrow"></i><i-->
          <!--:style="sortNum === 3 && !three_up?'color: #f15353':''"-->
          <!--class="iconfont icon-down_arrow"></i></p>-->
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul class="company">
          <li v-for="(item,i) in companyList" @click="toCompany(item)" :key='i'>
            <div class="asset_img">
              <img
                :src="item.thumb_url"
                alt="资产图片">
            </div>
            <div class="asset_text">
              <p class="asset_title">{{item.asset_name}}</p>
              <p class="money">总量：{{item.total}}</p>
              <p class="money">发放：{{item.spare}}</p>
              <p class="location"><span>核心商圈位置</span><span>实体门店</span></p>
            </div>
          </li>
        </ul>
      </van-pull-refresh>
    </div>

    <transition name="fade">
      <div class="m-dialog" @click="showClassify = false" v-show="showClassify" @touchmove.prevent>
        <div class="cartWrapper" ref="cartWrapper"
             style="max-height: 19rem; overflow: hidden; border-top: solid 0.0625rem #ebebeb;">
          <ul class="classify_items">
            <li @click.stop="chooseClassify('')" :class="!chooseID ?'choose':''">
              <span>全部分类</span> <i v-show="!chooseID" class="iconfont icon-record_go"></i>
            </li>
            <li @click.stop="chooseClassify(item)" :class="chooseID === item.id?'choose':''"
                v-for="(item,index) in classify" :key='index'>
              <span>{{item.name}}</span> <i v-show="chooseID === item.id" class="iconfont icon-record_go"></i>
            </li>
          </ul>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import classified_search_controller from "./classified_search_controller";

export default classified_search_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #classifySearch {
    background: #fff;

    .m-t-10 {
      height: 3.2rem;
    }

    .mint-cell {
      display: flex;
    }

    .mint-cell-wrapper {
      display: flex;
      align-items: center;
      width: 20rem;
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
      line-height: 3rem;
      font-size: 16px;
      color: #666;
      padding: 0 0.5rem;
    }

    .search_icon {
      padding: 0 0.5rem 0 1rem;
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background-image: url("../../../assets/images/search.png");
      background-repeat: no-repeat;
    }

    .company_list {
      width: 100%;

      .title {
        height: 2.5rem;
        display: flex;
        color: #333;
        padding: 0.5rem 0;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 14px;

        i {
          color: #8c8c8c;
        }

        p {
          display: flex;
          flex: 1;
          align-self: center;
          line-height: 2.5rem;

          .icon-down_arrow {
            margin-left: -0.625rem;
          }

          i {
            color: #999;
          }
        }

        span {
          line-height: 2.3rem;
          width: 4.5rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .icon {
          display: inline-block;
          width: 0.5rem;
          height: 0.8rem;
          background-image: url("../../../assets/images/collect.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 0.5rem 0.8rem;
        }

        .down {
          width: 0;
          height: 0;
          border-left: 0.375rem solid transparent;
          border-right: 0.375rem solid transparent;
          border-top: 0.375rem solid #8c8c8c;
          position: relative;
          top: 0.75rem;
          left: 0.125rem;
        }
      }

      .company {
        li {
          display: flex;
          padding: 0.5rem 1rem;
          border-bottom: solid 0.0625rem #ebebeb;
        }

        .asset_img {
          flex: 0 0 6rem;
          margin-right: 0.5rem;

          img {
            width: 6rem;
            height: 6rem;
          }
        }

        .asset_text {
          flex: 1;
          text-align: left;
        }

        .asset_title {
          font-size: 18px;
          margin-bottom: 0.3rem;
        }

        .money {
          font-size: 14px;
          color: #f7a145;
        }

        .location {
          margin-top: 0.5rem;
          font-size: 12px;
          color: #8c8c8c;

          span {
            background-color: #f5f5f5;
            padding: 0.2rem 0.3rem;
            margin-right: 0.5rem;
          }
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.3s linear;
    }

    .fade-enter,
    .fade-leave-active {
      opacity: 0;
      transform: translateY(-10px);
    }

    .m-dialog {
      position: fixed;
      top: 5.625rem;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 10;
    }

    .cartWrapper {
      background: #fff;
    }

    .classify_items {
      background: #fff;
      text-align: left;

      li {
        padding: 0 1.25rem;
        line-height: 2.25rem;
        height: 2.25rem;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;
      }
    }

    .choose {
      color: #f7a145;
      display: flex;

      span {
        flex: 1;
      }
    }

    .choose_icon {
      flex: 0 0 0.8rem;
      align-self: center;
      display: inline-block;
      width: 0.8rem;
      height: 0.8rem;
      background-image: url("../../../assets/images/collect.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 0.8rem;
    }
  }
</style>
