<template>
  <div id="transHome">
    <c-title :hide="false" :text="lang.asset_name ||' '">
    </c-title>

    <div class="tab">
      <div class="tab_left click">
        <p>{{lang.capital_name}}详情</p>
      </div>
      <div class="tab_right" @click="toTradingHall">
        <p>我的资产</p>
        <!--<p>交易大厅</p>-->
      </div>
    </div>

    <div class="m-swipe">
      <div style="line-height: 9.375rem; text-align: center; color: #999; font-size: 16px;" v-if="banner === ''">
        一个轮播都没有...
      </div>
      <c-myswipe
          :pagination-visible="true"
          :slides="banner"
          :repeating="true"
          :auto="3000" v-if="banner !== ''">
        <div v-for="(slide,index) in banner" :key="index">
          <a :href="slide.link|href_filters" v-if="slide.thumb_url" style="height: 38vw;">
            <img style="height: 8.75rem; width: 100%;" :src="slide.thumb_url"/>
          </a>

          <a href="javascript:;" v-if="!slide.imgurl" style="height: 38vw;">
            <img style="height: 8.75rem; width: 100%;" src="../../../assets/images/img_default.png"/>
          </a>
        </div>
      </c-myswipe>
    </div>

    <div class="notices" @click="toMore">
      <div class="notice_title">
        <i class="iconfont icon-notice"></i>
        <marquee scrollamount="3">{{noticeData.title}} - {{noticeData.author}}</marquee>
      </div>
      <div class="more" >
        <p><span>更多</span><i class="fa fa-angle-right"></i></p>
      </div>
    </div>

    <div class="content">
      <div class="trans_num">
        <p>
          <span>{{homeData.asset_count || 0}}</span> <span>总{{lang.capital_name}}</span>
        </p>
        <p>
          <!--<em class="small">{{$i18n.t('money')}}</em>-->
          <span><em>{{homeData.hold_count || 0}}</em></span> <span>{{lang.capital_name}}数量</span>
        </p>
      </div>
    </div>

    <div class="classify">
      <ul class="icons">
        <li @click="toClass(item)" v-for="(item,i) in classify" :key='i'>
          <img
              :src="item.thumb_url"
              alt="分类图片">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>

    <div class="company_list">
      <ul class="company">
        <li v-for="(item,i) in companyList" @click="toCompany(item)" :key='i'>
          <div class="asset_img">
            <img
                :src="item.thumb_url"
                alt="资产图片">
          </div>
          <div class="asset_text">
            <p class="title">{{item.name}}</p>
            <p class="money">总量：{{item.total}}</p>
            <p class="money">发放：{{item.publish}}</p>
            <p class="location_home"><span>核心商圈位置</span><span>实体门店</span></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import home_controller from "./home_controller";

export default home_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #transHome {
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

    .notices {
      display: flex;
      width: 90%;
      margin: 0.625rem auto;
      padding: 0.2rem;
      box-shadow: -0.125rem 0 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06), 0 0.125rem 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06);
      border-radius: 0.5rem;
    }

    .notice_title {
      line-height: 1.5rem;
      display: flex;
      flex: 0 0 17rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .icon-notice {
        font-size: 1.25rem;
        color: #f7a145;
      }
    }

    .notice_icon {
      align-self: center;
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background: #00b2ec;
    }

    .more {
      text-align: right;
      color: #8c8c8c;
      flex: 1;
      display: flex;
      justify-content: center;

      p {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .fa-angle-right {
      font-size: 1.25rem;
      color: #c9c9c9;
      margin-left: 0.25rem;
      line-height: 1.5rem;
    }

    .more_icon {
      position: relative;
      top: 0.1875rem;
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background: #00b2ec;
    }

    .content {
      width: 90%;
      margin: 0.8rem auto;
    }

    .trans_num {
      display: flex;
      height: 4.8rem;
      text-align: center;
      box-shadow: -0.125rem 0 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06), 0 0.125rem 0.2813rem 0.0313rem rgba(0, 0, 0, 0.06);
      border-radius: 0.38rem;

      p {
        max-width: 11rem;
        flex: 1;
        display: flex;
        align-self: center;
        flex-direction: column;
        color: #f15353;
        font-size: 18px;
      }

      p:first-child {
        color: #469de2;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span:nth-child(2) {
        font-size: 14px;
        color: #8c8c8c;
      }

      .small {
        font-size: 12px;
      }
    }

    .classify {
      width: 92%;
      margin: 0.75rem auto;
      padding-top: 0.625rem;
    }

    .icons {
      display: flex;
      flex-wrap: wrap;

      li {
        display: flex;
        width: 4.3rem;
        flex-direction: column;
        margin-bottom: 0.625rem;
      }

      p {
        margin-top: 0.1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      li:last-child {
        margin-right: 0;
      }

      img {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    .company_list {
      width: 100%;
      margin-top: 1rem;

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

        .title {
          font-size: 18px;
          margin-bottom: 0.3rem;
        }

        .money {
          width: 16rem;
          font-size: 14px;
          color: #f7a145;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .location_home {
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
  }
</style>
