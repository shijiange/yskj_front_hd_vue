<template>
  <div id="tradingHall">
    <c-title :hide="false" :text="'交易大厅'">
    </c-title>

    <div class="tab">
      <div class="tab_left" @click="toTransHome">
        <p>{{lang.capital_name}}详情</p>
      </div>
      <div class="tab_right click">
        <p>交易大厅</p>
      </div>
    </div>

    <div class="m-swipe">
      <div style="line-height: 9.375rem; text-align: center; color: #999; font-size: 16px;" v-if="banner == ''">
        一个轮播都没有...
      </div>
      <c-myswipe
          :pagination-visible="true"
          :slides="banner"
          :repeating="true"
          :auto="3000" v-if="banner != ''">
        <div v-for="(slide,index) in banner" :key="index">
          <a :href="slide.link|href_filters" v-if="slide.thumb_url" style="height: 38vw;">
            <img style="height: 8.75rem; width: 100%;" :src="slide.thumb_url"/>
          </a>

          <a href="javascript:;" v-if="!slide.thumb_url" style="height: 38vw;">
            <img style="height: 8.75rem; width: 100%;" src="../../../assets/images/img_default.png"/>
          </a>
        </div>
      </c-myswipe>
    </div>

    <div class="content">
      <div class="trans_num">
        <p>
          <span>{{homeData.month_count || 0}} </span> <span>本月交易数量</span>
        </p>
        <p>
          <span>{{homeData.sell_count || 0}} </span> <span>{{lang.sell_name|| '出售'}}中的数量</span>
        </p>
      </div>

      <div class="trans_button">
        <div class="button_left" @click="toAll">查看全部</div>
        <div class="button_right" @click="myAsset">我的{{lang.capital_name}}</div>
      </div>
    </div>

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
      <ul class="company">
        <li v-for="(item,i) in companyList" :key='i'>
          <p @click="toCompany(item)">{{item.asset_name}}</p>
          <p>{{item.total}}</p>
          <p>{{$i18n.t('money')}}{{item.price}}</p>
          <p><span class="buy" @click="toBuying(item)">{{lang.buy_name|| '买入'}}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import trading_hall_controller from "./trading_hall_controller";

export default trading_hall_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #tradingHall {
    background: #fff;

    .tab {
      display: flex;
      margin: 0.8rem 3.5rem;
      color: #f7a145;
    }

    .tab_left,
    .tab_right {
      text-align: center;
      flex: 1;
      padding: 0.5rem 1rem;
    }

    .tab_left {
      border: solid 0.125rem #f7a145;
      border-radius: 0.375rem 0 0 0.375rem;
    }

    .tab_right {
      border: solid 0.125rem #f7a145;
      border-radius: 0 0.375rem 0.375rem 0;
    }

    .click {
      background: #f7a145;
      color: #fff;
    }

    .m-swipe {
      width: 90%;
      margin: 0 auto;
    }

    .swiper {
      height: 8.75rem;
      border-radius: 0.38rem;
    }

    .content {
      width: 90%;
      margin: 0.8rem auto;
    }

    .trans_num {
      display: flex;
      height: 5rem;
      text-align: center;
      box-shadow: -0.125rem 0 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06), 0 0.125rem 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06);
      border-radius: 0.375rem 0.375rem 0 0;

      p {
        flex: 1;
        display: flex;
        align-self: center;
        flex-direction: column;
      }

      span {
        font-size: 14px;
      }

      span:first-child {
        font-size: 28px;
      }
    }

    .trans_button {
      display: flex;
      height: 1.85rem;
      background-color: #469de2;
      border-radius: 0 0 0.38rem 0.38rem;
      color: #fff;
    }

    .button_left,
    .button_right {
      flex: 1;
      line-height: 1.85rem;
      text-align: center;
      align-self: center;
    }

    .button_left {
      border-right: solid 0.0625rem #fff;
    }

    .company_list {
      width: 100%;
      margin-top: 1rem;

      .title {
        display: flex;
        color: #8c8c8c;
        padding: 0.5rem 0;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;

        p {
          flex: 1;

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
          border-bottom: solid 0.0625rem #ebebeb;

          p {
            padding: 1rem 0;
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
