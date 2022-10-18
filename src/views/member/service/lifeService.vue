<template>
  <div id="newLife" :class="'newLife'+$store.state.service.lang">
    <div class="m-header">
      <div class="info">
        <div class="img">
          <img :src="avatar" alt=""/>
        </div>

        <!--<p class="single"><span>{{language.id}}</span>{{title.id}}</p>-->
        <ul class="user">
          <li>{{title.nickname}}<span>{{title.leve}}</span></li>
          <li>{{integral}}：{{score}}</li>
        </ul>
        <!-- <p class="single"><span>{{language.nickname}}</span>{{title.nickname}}</p>
        <p class="single"><span>{{language.leve}}</span>{{title.leve}}</p>
        <p class="single"><span>积分：</span>{{score}}</p> -->
      </div>

      <div @click="langPop" class="change">
        <i class="iconfont icon-life-language"></i><span>切换</span>
      </div>
      <!--<div class="change change2" @click="checkIn" :class="{'active':Sign?true:false}">签到</div>-->
      <!--弹出框-->
      <div class="modal" v-show="overdues" @click="langPop">
        <div class="modal-dialog">
          <i class="iconfont icon-spare"></i>
          <button class="title" @click="$store.commit('chineseLang')">中文</button>
          <button class="title" @click="$store.commit('weiLang')">维语</button>

        </div>
      </div>

    </div>
    <div class="proxy" id="upgrade">
      <span>{{language.proxy}}</span>
      <span @click="vipPop" :class="{Vipible}">{{language.proxybtn}}</span>
      <i class="fa fa-angle-right"></i>
    </div>
    <div class="proxy">
      <ul class="balance">
        <li>我的{{language.exer}}</li>
        <li>{{title.exer}}</li>
      </ul>
      <!-- <span>{{language.exer}}{{title.exer}}</span>  -->
      <button @click="toBalance">{{language.withdraw}}</button>
    </div>
    <div class="order_all">
      <router-link :to="fun.getUrl('serviceOrderList',{ status:'0' })">
        <div class="order_pub">
          <i class="iconfont icon-life-order1"></i>
          <br>{{language.myOrder}}
        </div>
      </router-link>
      <router-link :to="fun.getUrl('myRelationship')">
        <div class="order_pub">
          <i class="iconfont icon-life-grade"></i>
          <br>{{language.mySubordinate}}
        </div>
      </router-link>
      <router-link :to="fun.getUrl('withdrawal')">
        <div class="order_pub">
          <i class="iconfont icon-life-income"></i>
          <br>{{language.financial}}
        </div>
      </router-link>

      <a href="javascript:void(0);">
        <div class="order_pub" @click="openQrCode('block')">
          <i class="iconfont icon-life-code"></i>
          <br>{{language.QRcode}}
        </div>
      </a>
    </div>
    <template v-if="pluginsFeel">
      <div class="titleTip">
        <div class="spare"></div>
        免费使用
      </div>
      <ul class="content">
        <!--手机充值-->
        <div class="item" style="width: 50%;" v-if="plugins.feel.phoneRecharge">
          <router-link :to="fun.getUrl('telephone')">
            <div class="list list1 free">
              <img src="../../../assets/images/life-phone-a.png">
              <h3>{{language.phone}}</h3>
            </div>
          </router-link>
        </div>
        <!--流量-->
        <div class="item" style="width: 50%;" v-if="plugins.feel.flow">
          <router-link :to="fun.getUrl('flow')">
            <div class="list list6 free">
              <img src="../../../assets/images/life-phone-b.png">
              <h3>{{language.flow}}</h3>
            </div>
          </router-link>
        </div>

      </ul>
    </template>
    <template v-if="pluginsVip">
      <div class="titleTip" v-if="plugins.vip">
        <div class="spare"></div>
        会员特权专区
      </div>
      <ul class="content">
        <!-- 机票 -->
        <div class="item" v-if="plugins.vip.ticket">
          <router-link :to="fun.getUrl('ticket')">
            <div class="list list4 member">
              <img src="../../../assets/images/life-a.png">
              <h3>{{language.fly}}</h3>
            </div>
          </router-link>
        </div>
        <!-- 火车票 -->
        <div class="item" v-if="plugins.vip.trainTicket">
          <router-link :to="fun.getUrl('trainTicket')">
            <div class="list list5 member">
              <img src="../../../assets/images/life-b.png">
              <h3>{{language.trainTicket}}</h3>
            </div>
          </router-link>
        </div>
        <!-- 交通罚款 -->
        <div class="item" v-if="true">
          <router-link :to="fun.getUrl('trafficIndex')">
            <div class="list list7 member">
              <img src="../../../assets/images/life-c.png">
              <h3>{{language.traffic}}</h3>
            </div>
          </router-link>
        </div>
        <!-- 电费-->
        <div class="item" v-if="plugins.vip.electricity">
          <router-link :to="fun.getUrl('electricity')">
            <div class="list list1 member">
              <img src="../../../assets/images/life-d.png">
              <h3>{{language.life}}</h3>
            </div>
          </router-link>
        </div>
        <!-- 固话-->
        <div class="item" v-if="plugins.vip.fixedTelephone">
          <router-link :to="fun.getUrl('fixedTelephone')">
            <div class="list list1 member">
              <img src="../../../assets/images/life-e.png">
              <h3>固话</h3>
            </div>
          </router-link>
        </div>
        <!-- 水费-->
        <div class="item" v-if="plugins.vip.waterFee">
          <router-link :to="fun.getUrl('waterFee')">
            <div class="list list2 member">
              <img src="../../../assets/images/life-f.png">
              <h3>水费</h3>
            </div>
          </router-link>
        </div>
        <!-- 油卡充值 -->
        <div class="item" v-if="plugins.vip.cardServer">
          <router-link :to="fun.getUrl('cardServer')">
            <div class="list list2 member">
              <img src="../../../assets/images/life-g.png">
              <h3>{{language.oilCard}}</h3>
            </div>
          </router-link>
        </div>
        <!-- 宽带-->
        <div class="item" v-if="plugins.vip.broadband">
          <router-link :to="fun.getUrl('broadband')">
            <div class="list list4 member">
              <img src="../../../assets/images/life-h.png">
              <h3>宽带</h3>
            </div>
          </router-link>
        </div>
      </ul>
    </template>

    <!--我的二维码-->
    <div id="ewm" ref="hook" @click="openQrCode('none')">
      <div class="pic">
        <img :src="poster" alt="">
      </div>

    </div>


  </div>
</template>

<script>
import lifeService_controller from "./lifeService_controller";

export default lifeService_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  #newLife {
    padding-bottom: 2.5rem;
  }

  #ewm {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background: rgba(140, 140, 140, 0.72);
    z-index: 9;
    display: none;
    padding-top: 28%;

    .pic {
      width: 70%;
      margin: auto;
      background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;

      .title {
        padding: 0.625rem;
        border-bottom: 0.0625rem solid #ddd;

        img {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }

        span {
          margin-left: 0.9375rem;
          vertical-align: middle;
          font-size: 16px;
        }
      }

      .ewm {
        img {
          width: 50%;
          display: block;
          float: right;
        }
      }
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .change2 {
    border: 0.0625rem solid #ccc;
    background: #f3f5f7;
    margin-top: 0.4375rem;
    border-radius: 0.375rem;
    font-size: 10px;
    padding: 0;
  }

  .active {
    background: #008000;
    color: #fff;
  }

  /* 弹窗样式 */
  .modal {
    width: 7.5rem;
    height: 5rem;
    border-radius: 0.25rem;
    position: fixed;
    top: 3.75rem;
    right: 1rem;
    background: rgba(51, 51, 51, 0.9);
    z-index: 999;

    .modal-dialog {
      font-size: 14px;
      height: 5rem;
      border-radius: 0.375rem;
      position: relative;

      .title {
        border-bottom: solid 0.0625rem #f0f0f0;
        color: #f0f0f0;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        outline: 0;
      }

      .title:last-child {
        border: none;
      }

      button {
        border: none;
      }

      i {
        color: rgba(51, 51, 51, 0.9);
        position: absolute;
        top: -0.75rem;
        right: 0.375rem;
        font-size: 1rem;
      }
    }
  }

  .newLifech {
    .m-header {
      padding: 1.25rem;
      background: #f15353;
      overflow: hidden;
      color: #fff;
      position: relative;

      .info {
        display: flex;
        align-items: center;

        .img {
          border: solid 0.125rem #fff;
          width: 3.5rem;
          height: 3.5rem;
          overflow: hidden;
          border-radius: 1.75rem;

          img {
            width: 100%;
          }
        }

        .user {
          margin-left: 1rem;
          text-align: left;

          li {
            line-height: 1.5rem;
          }

          li:first-child {
            font-size: 16px;
            font-weight: bold;

            span {
              margin-left: 0.625rem;
              background: rgba(0, 0, 0, 0.2);
              font-size: 12px;
              font-weight: normal;
              padding: 0.125rem 0.375rem;
              border-radius: 0.625rem;
            }
          }

          li:last-child {
            font-size: 14px;
          }
        }

        p {
          text-align: left;
          margin-left: 5rem;
          line-height: 1.375rem;
        }
      }

      .change {
        position: absolute;
        right: 1rem;
        top: 1rem;
        display: flex;
        flex-direction: column;

        i {
          font-size: 1.25rem;
        }
      }
    }

    #upgrade {
      padding: 0 0.875rem;
      height: 2.25rem;
      line-height: 2.25rem;
      background: #fcf5f5;
      font-size: 14px;
      color: #8c8c8c;
      display: flex;
      justify-content: space-between;

      i {
        position: absolute;
        right: 0.875rem;
        font-size: 1.5rem;
        color: #c9c9c9;
        line-height: 2.25rem;
      }

      .Vipible {
        margin-right: 1rem;
        display: block;
        color: #f15353;
      }
    }

    .proxy {
      padding: 0.625rem 0.875rem;
      background: #fff;
      position: relative;

      .balance {
        text-align: left;
        font-size: 14px;
        line-height: 1.875rem;

        li:first-child {
          color: #8c8c8c;
        }

        li:last-child {
          font-size: 24px;
          font-weight: bold;
        }
      }

      button {
        width: 3.75rem;
        height: 1.625rem;
        color: #fff;
        background: #f15353;
        line-height: 1.625rem;
        border-radius: 0.25rem;
        border: none;
        right: 0.875rem;
        bottom: 0.625rem;
        position: absolute;
      }

      button.Vipible {
        background: #ccc;
      }
    }

    .titleTip {
      display: flex;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      background: #fff;
      overflow: hidden;
      margin-top: 0.625rem;
      padding: 0 0.875rem;
      border-bottom: 0.0625rem solid #ebebeb;
      color: #333;
      font-weight: bold;
      font-size: 16px;

      .spare {
        width: 0.25rem;
        height: 1rem;
        margin-top: 0.75rem;
        margin-right: 0.375rem;
        border-radius: 0.0625rem;
        background-color: #f15353;
      }
    }

    .titleTip::after {
      display: table;
      content: '';
      clear: both;
    }
  }

  .newLifewei {
    @font-face {
      font-family: "UKIJ Tor";
      src: url('http://mtmovie.cn/font/UKIJTor.eot');
      src: local('http://mtmovie.cn/font/UKIJ Tor'), url('http://mtmovie.cn/font/UKIJTor.ttf') format('truetype'), url('http://mtmovie.cn/font/UKIJTor.eot?#iefix') format('embedded-opentype'), url('http://mtmovie.cn/font/UKIJTor.woff') format('woff'), url('http://mtmovie.cn/font/UKIJTor.svg#UKIJ TOR') format('svg');
      font-weight: normal;
      font-style: normal;
    }

    .m-header {
      padding: 0.9375rem;
      background: #fff;
      overflow: hidden;
      border-bottom: 0.0625rem solid #ccc;

      .info {
        width: 75%;
        float: right;

        img {
          width: 4.6875rem;
          height: 4.6875rem;
          float: right;
          border-radius: 50%;
          background: #ccc;
        }

        .single {
          text-align: right;
          margin-right: 5rem;
          line-height: 1.375rem;

          span {
            float: right;
          }
        }
      }

      .change {
        width: 20%;
        float: left;
      }
    }

    .proxy {
      line-height: 1.375rem;
      padding: 0.625rem 0.9375rem;
      margin-bottom: 0.4375rem;
      background: #fff;
      display: flex;
      flex-flow: row;

      span {
        flex: 1;
        order: 2;
        text-align: left;
        padding-left: 0.3125rem;
      }

      button {
        order: 1;
        width: 6.25rem;
        height: 1.875rem;
        color: #fff;
        background: #ff951b;
        line-height: 1.875rem;
        border-radius: 0.375rem;
        outline: 0;
        border: 0;

        /* margin-top:5px; */
      }
    }

    .order_all {
      .order_pub {
        float: right;
      }
    }

    .content {
      .item {
        height: 6.25rem;
        float: right;
      }
    }

    .titleTip {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: right;
      background: #fff;
      overflow: hidden;
      margin-top: 0.4375rem;
      padding: 0 0.9375rem;
      border-bottom: 0.0625rem solid #f3f5f7;
      color: #666;
    }

    .titleTip::after {
      display: table;
      content: '';
      clear: both;
    }
  }

  .order_all {
    margin-top: 0.625rem;
    width: 100%;
    padding: 0.875rem 0;
    color: #666;
    overflow: hidden;
    background: #fff;
  }

  .order_all a i {
    font-size: 28px;
  }

  .order_pub {
    width: 25%;
    box-sizing: border-box;
    float: left;
    border-left: 0.0625rem solid #ebebeb;
    padding-top: 0.125rem;
    text-align: center;
    color: #8c8c8c;
    position: relative;
    font-size: 12px;
  }

  .order_pub span {
    height: 0.875rem;
    background: #f30;
    border-radius: 0.5rem;
    position: absolute;
    top: 0;
    right: 6%;
    padding: 0 0.3125rem;
    font-size: 12px;
    color: #fff;
    line-height: 0.875rem;
  }

  .content {
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    padding: 1.25rem 0 0.375rem;

    .item {
      width: 25%;
      text-align: center;
      float: left;
      box-sizing: border-box;
      background: #fff;
      margin-bottom: 0.875rem;

      .list {
        color: #000;

        i {
          font-size: 30px;
        }

        h3 {
          font-weight: normal;
          font-size: 12px;
        }
      }

      .member {
        img {
          width: 36%;
        }
      }

      .list1 > i {
        color: #9cbfe4;
      }

      .list2 > i {
        color: #efcd46;
      }

      .list3 > i {
        color: #e78d8d;
      }

      .list4 > i {
        color: #efcf4f;
      }

      .list5 > i {
        color: #88ced7;
      }

      .list6 > i {
        color: #8dd47e;
      }

      .list7 > i {
        color: #87c5e2;
      }
    }

    .item:nth-child(4n) {
      border-right: 0;
    }

    .item::after {
      display: table;
      content: '';
      clear: both;
    }
  }
</style>
