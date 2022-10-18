<style lang="scss" rel="stylesheet/scss" scoped>
  #shopKeeperCenter {
    .spare {
      width: 100%;
      height: 40px;
    }

    .main {
      .linkShop {
        margin: 0.625rem 0;
        padding: 0.625rem;
        text-align: center;
        background: #fff;
        font-size: 16px;
        color: goldenrod;
      }

      .top1 {
        /* width: 100%; */
        padding: 1.25rem;

        /* height: 80px; */
        overflow: hidden;
        box-sizing: border-box;
        background: #f15353;
        text-align: left;
        color: #fff;

        .picture1 {
          float: left;

          /* width: 50px; */
          width: 3rem;
          height: 3rem;
          border: solid 0.125rem #fff;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            border-radius: 50%;
            vertical-align: middle;
          }
        }

        .name1 {
          font-size: 14px;
          float: left;
          width: 40%;
          line-height: 1.375rem;
          margin-left: 0.625rem;
          color: #fff;

          span {
            font-size: 16px;
            font-weight: bold;
          }

          b {
            font-weight: normal;
            font-size: 12px;

            /* border:1px solid #ccc; */
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            background: rgba(0, 0, 0, 0.4);
            color: #fff;

            /* opacity:0.4; */

            /* padding-left:2px; */
            i {
              vertical-align: middle;
              font-size: 0.875rem;
              margin-top: 0.125rem;
            }
          }
        }

        .share {
          height: 3.125rem;
          line-height: 1.375rem;
          padding-top: 0.3125rem;
          font-size: 12px;
          text-align: right;
          float: right;
          width: 40%;
        }
      }

      .content {
        .line04 {
          position: absolute;
          margin-top: -4.75rem;
          margin-left: 75%;
          width: 0.0625rem;
          height: 3.25rem;
          background-color: #e2e2e2;

          .line04-child {
            background-color: #fff;
            width: 0.375rem;
            height: 0.375rem;
            border: 0.0625rem solid #e2e2e2;
            border-left: 0;
            border-bottom: 0;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            margin-top: 1.4375rem;
            position: absolute;
            margin-left: -0.1563rem;
          }
        }

        .title {
          padding: 0 0.9375rem;
          height: 2.25rem;
          text-align: left;
          background: #fff;
          border-bottom: solid 0.0625rem #e2e2e2;
          color: #363636;
          font-size: 14px;

          span {
            float: right;
            color: #333;
            line-height: 2.25rem;
          }

          b {
            font-size: 16px;
            color: #f15353;
            line-height: 2.25rem;
          }
        }

        .nav {
          background: #fff;
          padding: 1rem 0;
          height: 5.125rem;
          margin-bottom: 0.625rem;

          .child01,
          .child02 {
            border-right: solid 0.0625rem #e2e2e2;
          }

          li {
            width: 25%;
            text-align: center;
            float: left;
            font-size: 14px;

            span {
              color: #939393;
              font-size: 17px;
              line-height: 1.625rem;
              display: inline-block;
              margin-bottom: 0.625rem;
            }

            a {
              color: gray;
            }

            b {
              color: #333;
              font-size: 11px;
            }
          }

          a {
            li {
              color: #363636;
            }
          }

          .child01 span,
          .child02 span,
          .child03 span {
            color: #ffa800;
          }

          .child04 span {
            color: #f15353;
          }
        }

        .shareNav {
          background: #fff;
          margin-top: 0.625rem;

          li {
            width: 33.3%;
            line-height: 3.125rem;
            text-align: center;
            float: left;
            font-size: 14px;
          }
        }

        .ratioNav {
          padding: 0;
          margin: 0;
          height: 2.5rem;
          width: 100%;
          background: #fff;
          border-bottom: 0.0625rem solid #cdcdcd;
          border-top: 0.0625rem solid #cdcdcd;

          li {
            float: left;
            width: 33%;
            text-align: center;
            line-height: 2.5rem;
            font-size: 16px;
            color: #666;
          }
        }

        .rationList {
          padding: 0;
          margin: 0;
          background: #fff;

          li {
            width: 100%;
            height: 4.0625rem;
            padding: 0.625rem;
            box-sizing: border-box;
            border-bottom: 0.0625rem solid #f3f3f3;

            .left {
              width: 60%;
              float: left;
              text-align: left;
              padding-left: 1.375rem;
              box-sizing: border-box;
              line-height: 1.25rem;

              span {
                font-size: 16px;
                font-weight: 400;
                color: #333;
              }

              p {
                font-size: 14px;
                color: #999;
              }
            }

            .right {
              line-height: 1.25rem;
              padding-top: 0.625rem;
              float: left;
              text-align: right;
              width: 40%;
              color: #999;

              span {
                color: #e51c23;
              }
            }
          }
        }

        .shareNav::after,
        .nav::after,
        .conte::after {
          content: "";
          display: block;
          clear: both;
        }

        .conte {
          margin-top: 0.0625rem;

          .con {
            box-sizing: border-box;
            text-align: center;
            float: left;
            height: 4.0625rem;
            padding: 0.9375rem;
            background: #fff;

            .el-badge {
              border: none;
              position: relative;
              top: 0.5rem;

              .el-button--small {
                font-size: 15px;
              }

              button {
                border: none;
              }

              .el-badge__content {
                background: #ffa800 !important;
              }
            }

            b {
              color: #f15353;
            }
          }

          .con1 {
            width: 50%;
            box-sizing: border-box;
            margin-right: 0.0625rem;
            line-height: 1.1875rem;
          }

          .con2 {
            width: 33.3%;
            margin-top: 0.0625rem;
            border-right: 0.0625rem solid #f15353;
            line-height: 1.1875rem;
          }

          .con2:last-child {
            border: none;
          }

          .con3 {
            width: 49%;
            margin-right: 0.0625rem;
          }
        }
      }
    }

    .m_header {
      height: 2.5rem;
      line-height: 2.5rem;
      background: #fff;
      border-bottom: 0.0625rem solid #ccc;
      text-align: center;
      padding: 0 0.9375rem 0 0.5rem;

      span.lf {
        font-size: 25px;
      }

      a {
        color: #939393;
        font-size: 12px;
      }
    }

    .linkCata {
      font-size: 14px;
      width: 100%;
      height: 2.8125rem;
      background: #fff;
      color: #f15353;
      line-height: 2.8125rem;
      font-weight: bold;
      position: fixed;
      bottom: 0;
      left: 0;

      i {
        font-size: 1.375rem;
        vertical-align: bottom;
        line-height: 2.8125rem;
      }
    }
  }

  .list1 {
    height: 2.75rem;
    background: #fff;
    padding: 0 0.9375rem;
    font-size: 15px;
    line-height: 2.75rem;
    color: #333;
    box-sizing: content-box;
    text-align: left;
    margin-bottom: 0.625rem;

    div.lf {
      font-size: 25px;
    }
  }

  .list1 i {
    float: right;
    line-height: 2.75rem;
    display: inline-block;
    font-size: 24px;
    color: #c9c9c9;
  }

  #shopKeeperCenter.pcStyle {
    .linkCata {
      width: 375px;
      left: 50%;
      margin-left: -187.5px;
    }
  }
</style>
<template>
  <div id="shopKeeperCenter"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">

    <!--<c-title :hide="false" text='店主中心' tolink='/microShop/baseinfo' totext='微店设置'></c-title>-->
    <c-title :hide="false"
             text='店主中心'
             tolink='microShop_baseinfo'
             :totext="(shoplang?shoplang:'微店') +'设置'"></c-title>
    <!-- <div class="spare"></div> -->
    <div class="main">

      <div class="top1">
        <div class="picture1">
          <img v-if="!userImg"
               src="../../../assets/images/photo-mr.jpg"
               alt="用户头像"/>
          <img v-if="userImg"
               :src="userImg"
               alt="用户头像"/>

        </div>
        <div class="name1">
          <span>{{username1}}</span> <br/>

          <router-link :to="fun.getUrl('microShop_apply')">
            <b>{{level1}}&nbsp;
              <i class="iconfont icon-right"></i>
            </b>
          </router-link>
        </div>
        <div class="share"
        >
          分红比例：{{share1}}% <br/> 上级店主分红比例：{{share2}}%
        </div>
      </div>

      <router-link :to="fun.getUrl('microShop_home',{fromHome : 1})">
        <div class="list1">
          <div class="iconfont icon-tuiguang-zhengchangzhuangtai lf"></div>
          我的{{(shoplang?shoplang:"微店")}}
          <i class="fa fa-angle-right"></i>
        </div>
      </router-link>
      <div class="list1" @click="toShare" v-if="fun.isApp()">
        <div class="iconfont icon-tuiguang-zhengchangzhuangtai lf"></div>
        分享{{(shoplang?shoplang:"微店")}}
        <i class="fa fa-angle-right"></i>
      </div>

      <!--<router-link :to="fun.getUrl('microShop_home')">-->
        <!--<div class="linkShop">我的商铺</div>-->
      <!--</router-link>-->

      <div class="content">
        <router-link :to="fun.getUrl('microShop_orderDetail',{date:'-1'})"
                     v-if="false">
          <div class="title">
            <b class="iconfont icon-weidiandingdan"></b> {{(shoplang?shoplang:"微店")}}订单
            <i class="iconfont icon-right"></i>
            <span>累计：<b>{{totalTicket}}单</b></span>
          </div>
        </router-link>

        <ul class="nav"
            v-if="false">
          <router-link :to="fun.getUrl('microShop_orderDetail',{date:'1'})">
            <li class="child01">
              <span>{{orderData.today}}</span> <br/><b>今天</b></li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_orderDetail',{date:'2'})">
            <li class="child02">
              <span>{{orderData.yesterday}}</span> <br/><b>昨日</b></li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_orderDetail',{date:'3'})">
            <li class="child03">
              <span>{{orderData.week}}</span> <br/><b>本周</b></li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_orderDetail',{date:'4'})">
            <li class="child03">
              <span>{{orderData.month}}</span> <br/><b>本月</b></li>
          </router-link>
        </ul>

        <router-link :to="fun.getUrl('microShop_shareList',{date:'-1'})">
          <div class="title">
            <b class="iconfont icon-weidiandingdan"></b> {{(shoplang?shoplang:"微店")}}佣金
            <i class="iconfont icon-right"></i>
            <span>累计：<b><i style="font-weight: normal;">{{$i18n.t("money")}}</i>{{totalShareMoney}}</b></span>
          </div>
        </router-link>

        <ul class="nav">
          <router-link :to="fun.getUrl('microShop_shareList',{date:'1'})">

            <li class="child01">
              <span>{{$i18n.t("money")}}{{shareData.today}}</span>
              <br/>
              <b>今天</b>
            </li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_shareList',{date:'2'})">
            <li class="child02">
              <span>{{$i18n.t("money")}}{{shareData.yesterday}}</span>
              <br/>
              <b>昨日</b>
            </li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_shareList',{date:'3'})">
            <li class="child03">
              <span>{{$i18n.t("money")}}{{shareData.week}}</span>
              <br/>
              <b>本周</b>
            </li>
          </router-link>
          <router-link :to="fun.getUrl('microShop_shareList',{date:'4'})">
            <li class="child04">
              <span>{{$i18n.t("money")}}{{shareData.month}}</span>
              <br/>
              <b>本月</b>
            </li>
          </router-link>

        </ul>
        <div class="line04">
          <div class="line04-child"></div>
        </div>
      </div>
    </div>
    <div style="height: 3rem;"></div>

    <router-link :to="fun.getUrl('micro_shop_add_category')">
      <div class="linkCata" :style="{height: fun.isIphoneX() ? '3.8125rem' : '2.8125rem'}">
        <i>+</i>&nbsp;添加商品
      </div>
    </router-link>
  </div>
</template>


<script>
import cTitle from "components/title";
import { Dialog } from "vant";

export default {
  components: { cTitle },
  data() {
    return {
      username1: "微店名称",
      level1: "级别",
      share1: "0",
      share2: "0",
      totalTicket: 0,
      totalShareMoney: 0,
      userImg: "",
      orderData: "",
      shareData: "",
      shoplang: ""
    };
  },

  methods: {
    toShare() {
      this.$router.push(this.fun.getUrl("micro_shop_share_home", { shop_id: this.fun.getKey("shop_id") }));
    },
    goBack() {
      this.$router.go(-1);
    },
    init() {
      let that = this;
      $http
        .get("plugin.micro.frontend.controllers.MicroShop.index", {}, "加载中")
        .then(
          function(response) {
            if (response.result == 1) {
              that.userImg = response.data.micro_shop_data.shop_avatar;
              that.username1 = response.data.micro_shop_data.shop_name;
              that.level1 = response.data.micro_shop_data.level_name;

              that.share1 = response.data.micro_shop_data.bonus_ratio;
              that.share2 = response.data.micro_shop_data.agent_bonus_ratio;

              that.totalTicket = response.data.order_data.order_total;
              that.totalShareMoney = response.data.bonus_log_data.bonus_total;

              that.shareData = response.data.bonus_log_data;
              that.orderData = response.data.order_data;
              that.shoplang = response.data.lang;
              if (response.data.is_ban == 1) {
                Dialog.alert({
                  title: "",
                  message: "微店已被禁用"
                }).then(() => {
                  // on close
                });
              }
            } else {
              console.log(response);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  activated() {
    this.init();
  }
};
</script>
