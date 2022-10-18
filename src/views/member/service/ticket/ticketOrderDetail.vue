<template>
  <div id="ticketOrderDetail" :class="'ticketOrderDetail'+$store.state.service.lang">
    <c-title :hide="false" :text="language.title"></c-title>

    <div class="orderStates">
      <div class="booking"><span class="state">订票成功</span> <span
        class="right"><font>{{$i18n.t("money")}}</font>750</span></div>
      <p>
        <span class="left">{{language.orderNum}}1234567</span>
        <span class="right" @click="closeDetails">{{language.details}}
					<i class='iconfont icon-down'></i>
				</span>
      </p>
      <div class="refunds">
        <router-link :to="fun.getUrl('refundApplication')">
          <span class="left">{{language.refunds}}</span>
        </router-link>
        <span @click="changeSign" class="right">{{language.changeSign}}</span>
      </div>
    </div>

    <div class="flight">
      <div class="top"><span>海南航空&nbsp;&nbsp;HU2014</span> <span>04-20&nbsp;&nbsp;周一</span></div>
      <div class="flightNum">
        <div><span class="fromTime">22:10</span> <span class="addOne" v-show="false">+1天</span> <span class="toTime">01:10</span>
        </div>
        <p><span class="fromAddr">白云机场T3</span> <span class="stopCity" @click="closeCity">经停城市</span> <span
          class="toAddr">首都机场T1</span></p>
      </div>
      <div class="addr">
        <span>准点率：</span> <span>8%</span>&nbsp; <span>|</span>
        <span>波音701-9</span> <span>(大型机)</span>
      </div>
    </div>

    <div class="orderContent">
      <div class="passenger">
        <label>{{language.passenger}}</label>
        <ul>
          <li>
            <p><span>{{language.name}}</span> <span>某某</span></p>
            <p><span>{{language.cardId}}</span><span>123456789</span></p>
            <p><span>{{language.ticketNum}}</span><span>123456</span></p>
          </li>
          <li>
            <p><span>{{language.name}}</span> <span>某某</span></p>
            <p><span>{{language.cardId}}</span><span>123456789</span></p>
            <p><span>{{language.ticketNum}}</span><span>123456</span></p>
          </li>
        </ul>
      </div>

      <div class="contact">
        <label>{{language.contactPerson}}</label>
        <ul>
          <li>
            <p><span>{{language.name}}</span> <span>某某</span></p>
            <p><span>{{language.tele}}</span> <span>123456</span></p>
          </li>
        </ul>
      </div>

      <!--<p class="order insurance"> <span class="left">保险{{language.insurance}}</span>
        <i class="iconfont icon-right right" v-if="$store.state.service.lang=='ch'"></i>
        <i class="iconfont icon-left right" v-else="$store.state.service.lang=='wei'"></i>
      </p>-->

      <p class="order gift"><span class="left">{{language.giftPoints}}</span> <b class="right">{{language.orderAfter}}&nbsp;<font>200</font>&nbsp;{{language.score}}</b>
      </p>

      <p class="order total"><span class="left"><b>{{language.total}}{{$i18n.t("money")}}705</b></span> <span
        class="right">{{language.toPay}}</span></p>
    </div>
    <!--明细-->
    <div class="modalDetail" v-show="details" @click="closeDetails">
      <div class="modal-dialog" @click.stop>
        <div class="booking"><span class="state">订票成功</span> <span
          class="right"><font>{{$i18n.t("money")}}</font>750</span></div>
        <p><span class="left">{{language.orderNum}}1234567</span>
          <span class="right" @click="closeDetails">{{language.details}}
						<i class='iconfont icon-up'></i>
					</span>
        </p>
        <ul class="detail-list">
          <li class="title">{{language.airTotal}}</li>
          <li class="list"><span>成人票</span> <span class="right">x1人</span></li>
          <li class="list"><span>机票</span> <span class="right">{{$i18n.t("money")}}750</span></li>
          <li class="list"><span>机建+燃油</span><span class="right">{{$i18n.t("money")}}50</span></li>
        </ul>
        <ul>

          <!--<li class="title">其他</li>
          <li> <span>延误险</span> <span class="center">{{$i18n.t('money')}}20</span> <span class="right">x1人</span></li>
          <li class="line"> <span>意外险</span> <span class="center">{{$i18n.t('money')}}30</span> <span class="right">x1人</span></li>-->
          <li class="big"><span class="left">{{language.all}}</span> <span class="right">{{$i18n.t("money")}}850</span>
          </li>
          <li class="big"><span class="left">{{language.payStyle}}</span> <span class="right">支付宝</span></li>
        </ul>
      </div>
    </div>
    <!--经停城市-->
    <div class="modal" v-show="city" @click="closeCity">
      <div class="modal-dialog" @click.stop>
        <h1 class="title"><i class="iconfont icon-tishi"></i> {{language.stopInformation}}</h1>
        <ul class="content">
          <li><span>{{language.stopCity}}</span> <span>天津</span></li>
          <li><span>{{language.stopTime}}</span> <span>00:30</span></li>
          <li><span>{{language.startFly}}</span> <span>30分钟</span></li>
          <li><span>{{language.endFly}}</span> <span>00:30</span></li>
        </ul>
        <span class="button" @click="closeCity">{{language.know}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import ticketOrderDetail_controller from "./ticketOrderDetail_controller";

export default ticketOrderDetail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .ticketOrderDetailch {
    /* 弹窗样式 */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;

      .modal-dialog {
        width: 80%;
        background: #fff;
        border-radius: 0.375rem;
        margin: 30% auto;
        position: relative;

        .title {
          i {
            color: #f15353;
          }

          color: #333;
          font-weight: normal;
          font-size: 14px;
          line-height: 2.5rem;
          text-align: center;
        }

        .content {
          padding: 0.625rem 1.25rem;

          li {
            width: 50%;
            line-height: 1.875rem;
            float: left;
            text-align: left;
          }
        }

        .content::after {
          display: table;
          content: '';
          clear: both;
        }

        .button {
          border-top: solid 0.0625rem #ebebeb;
          display: block;
          width: 100%;
          height: 2.1875rem;
          line-height: 2.1875rem;
          color: #f15353;
          margin: 0 auto;
        }
      }
    }

    /* 明细弹窗 */
    .modalDetail {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 70;

      .modal-dialog {
        width: 100%;
        padding-bottom: 1.25rem;
        background: #fff;
        z-index: 1200;
        top: 2.5rem;
        position: absolute;
        padding-top: 0.625rem;

        .booking {
          height: 1.875rem;
          line-height: 1.875rem;
          font-size: 16px;
          padding: 0 0.9375rem;

          .state {
            float: left;
            font-weight: bold;
          }

          .right {
            height: 1.875rem;
            line-height: 1.875rem;
            float: right;
            color: #f15353;
            font-weight: bold;

            font {
              font-weight: normal;
              font-size: 14px;
            }
          }
        }

        p {
          color: #8c8c8c;
          font-size: 12px;
          height: 2.25rem;
          line-height: 1.625rem;
          margin-left: 0.875rem;
          padding-right: 0.875rem;
          border-bottom: 0.0625rem solid #ebebeb;

          .left {
            float: left;
          }

          .right {
            float: right;
          }
        }

        .detail-list {
          margin-left: 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          padding-bottom: 0.625rem;
        }

        ul {
          li {
            padding-right: 0.875rem;
            height: 1.375rem;
            line-height: 1.375rem;

            span {
              width: 33.3%;
              display: inline-block;
              float: left;
              text-align: left;
            }

            .center {
              text-align: center;
            }

            .right {
              text-align: right;
            }
          }

          .line {
            border-bottom: 0.0625rem solid #eee;
            padding-bottom: 0.625rem;
          }

          .title {
            margin-top: 0.625rem;
            height: 2.0625rem;
            line-height: 2.0625rem;
            text-align: left;
            font-size: 16px;
            color: #333;

            .right {
              float: right;
            }
          }

          .list {
            color: #8c8c8c;
            line-height: 24px;
            display: flex;
            justify-content: space-between;
          }

          .big {
            display: flex;
            justify-content: space-between;
            color: #333;
            font-size: 14px;
            padding-left: 0.875rem;
            line-height: 1.5rem;
            margin-top: 0.5rem;
          }
        }
      }
    }

    .orderStates {
      background: #fff;
      padding: 0.625rem 0.875rem;

      .booking {
        height: 1.875rem;
        line-height: 1.875rem;
        font-size: 16px;
        display: flex;
        justify-content: space-between;

        .state {
          font-weight: bold;
        }

        .right {
          color: #f15353;
          font-weight: bold;

          font {
            font-size: 14px;
            font-weight: normal;
          }
        }
      }

      p {
        color: #8c8c8c;
        font-size: 12px;
        line-height: 1.5rem;
        display: flex;
        justify-content: space-between;
      }
      // .refunds:after,p:after{
      // 	display: table;
      // 	content:'';
      // 	clear:both;
      // }
      .refunds {
        span {
          height: 1.625rem;
          line-height: 1.625rem;
          padding: 0 0.625rem;
          border: 0.0625rem solid #666;
          -webkit-border-radius: 0.1875rem;
          -moz-border-radius: 0.1875rem;
          border-radius: 0.1875rem;
          display: inline-block;
          margin-top: 0.625rem;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          color: #333;
          font-size: 12px;
        }

        .left {
          margin-right: 14%;
        }

        .right {
          margin-left: 14%;
        }
      }
    }

    .flight {
      margin-top: 10px;
      background-color: #fff;

      .top {
        height: 2.25rem;
        line-height: 2.25rem;
        color: #8c8c8c;
        font-size: 14px;
        text-align: left;
        margin-left: 0.875rem;
        padding-right: 0.875rem;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      .flightNum {
        background: #fff;
        height: 4.375rem;

        div {
          padding: 0.625rem 0.9375rem 0;
          line-height: 2.1875rem;
          overflow: hidden;
          font-size: 22px;
          background: url(../../../../assets/images/airline.png) no-repeat 50% 1.75rem;
          background-size: 3.75rem;

          .fromTime {
            float: left;
            width: 40%;
            text-align: center;
          }

          .toTime {
            float: right;
            width: 40%;
            text-align: center;
          }

          .addOne {
            font-size: 12px;
            vertical-align: middle;
          }
        }

        p {
          padding: 0 0.9375rem;
          font-size: 13px;

          .fromAddr {
            float: left;
            color: #8c8c8c;
            width: 40%;
            text-align: center;
          }

          .toAddr {
            float: right;
            color: #8c8c8c;
            width: 40%;
            text-align: center;
          }

          .stopCity {
            color: #333;
          }
        }
      }

      .addr {
        background: #fff;
        color: #8c8c8c;
        height: 2.1875rem;
        font-size: 0.625rem;
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    }

    .orderContent {
      margin-top: 0.625rem;
      margin-bottom: 3.75rem;

      .passenger,
      .contact {
        background: #fff;
        padding: 0.625rem 0.9375rem;
        display: flex;
        flex-flow: row;

        label {
          width: 6.25rem;
          text-align: left;
          font-size: 16px;
        }

        ul {
          flex: 1;

          li {
            border-bottom: 0.0625rem solid #e5e5e5;
            margin-bottom: 0.3125rem;
            padding-bottom: 0.3125rem;

            p {
              color: #666;
              font-size: 12px;
              text-align: left;
              height: 1.375rem;
              line-height: 1.375rem;
            }
          }

          li:last-child {
            border-bottom: 0;
          }
        }
      }

      .passenger {
        padding-bottom: 0.9375rem;
      }

      .order {
        background: #fff;
        margin-top: 0.625rem;
        padding-left: 0.875rem;

        .left {
          float: left;
        }

        .right {
          float: right;
        }

        i.right {
          font-size: 21px;
          color: #ccc;
        }

        b.right {
          font-size: 14px;
          color: #333;
          font-weight: normal;
        }

        span.right {
          background-color: #f15353;
          width: 6.875rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          font-size: 16px;
          color: #fff;
          display: inline-block;
        }
      }

      /* .insurance{height: 45px; line-height: 45px;} */
      .gift {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding-right: 0.875rem;
        font-size: 16px;
        color: #333;

        font {
          color: #f15353;
        }
      }

      .total {
        position: fixed;
        color: #333;
        bottom: 0;
        width: 100%;
        height: 2.8125rem;
        font-size: 16px;
        border-top: solid 0.0625rem #ebebeb;

        .left {
          line-height: 2.8125rem;
          color: #333;
        }
      }
    }
  }

  .ticketOrderDetailwei {
    /* 弹窗样式 */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;

      .modal-dialog {
        width: 80%;
        padding-bottom: 1.25rem;
        background: #fff;
        border-radius: 0.375rem;
        margin: 30% auto;
        position: relative;

        .title {
          i {
            color: #ff951b;
            float: right;
            font-size: 25px;
          }

          color: #666;
          font-weight: normal;
          font-size: 14px;
          line-height: 2.1875rem;
          padding-right: 1.5625rem;
          border-bottom: 0.0625rem solid #ccc;
          text-align: right;
        }

        .content {
          padding: 0.625rem;

          li {
            width: 50%;
            line-height: 1.875rem;
            float: right;
            text-align: right;

            span {
              float: right;
            }
          }
        }

        .content::after {
          display: table;
          content: '';
          clear: both;
        }

        .button {
          display: block;
          width: 80%;
          height: 2.1875rem;
          line-height: 2.1875rem;
          background: #ff951b;
          -webkit-border-radius: 0.3125rem;
          -moz-border-radius: 0.3125rem;
          border-radius: 0.3125rem;
          color: #fff;
          margin: 0 auto;
        }
      }
    }

    /* 明细弹窗 */
    .modalDetail {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 70;

      .modal-dialog {
        width: 100%;
        padding-bottom: 1.25rem;
        background: #fff;
        z-index: 1200;
        top: 2.5rem;
        position: absolute;
        padding-top: 0.625rem;

        .booking {
          height: 1.875rem;
          line-height: 1.875rem;
          font-size: 16px;
          padding: 0 0.9375rem;

          .state {
            float: right;
          }

          .right {
            float: left;

            font {
              font-weight: normal;
            }
          }
        }

        p {
          color: #666;
          font-size: 12px;
          height: 1rem;
          padding: 0 0.9375rem 0.625rem;
          border-bottom: 0.0625rem solid #e7e7e7;

          .left {
            float: right;
          }

          .right {
            float: left;
          }
        }

        ul {
          li {
            padding: 0 0.9375rem;
            height: 1.375rem;
            line-height: 1.375rem;

            span {
              width: 33.3%;
              display: inline-block;
              float: right;
              text-align: right;
            }

            .center {
              text-align: center;
            }

            .right {
              text-align: left;
            }
          }

          .line {
            border-bottom: 0.0625rem solid #eee;
            padding-bottom: 0.625rem;
          }

          .title {
            height: 2.0625rem;
            line-height: 2.0625rem;
            text-align: right;
            font-size: 16px;
            color: #a2a2a2;

            .right {
              float: left;
            }
          }
        }
      }
    }

    .orderStates {
      background: #fff;
      padding: 0.625rem 0.9375rem;

      .booking {
        height: 1.875rem;
        line-height: 1.875rem;
        color: #ff951b;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
      }

      p {
        color: #666;
        font-size: 12px;
      }

      .refunds::after,
      p::after {
        display: table;
        content: '';
        clear: both;
      }

      .refunds {
        span {
          height: 1.625rem;
          line-height: 1.625rem;
          border: 0.0625rem solid #ccc;
          -webkit-border-radius: 0.375rem;
          -moz-border-radius: 0.375rem;
          border-radius: 0.375rem;
          display: inline-block;
          margin-top: 0.625rem;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          color: #666;
          font-size: 12px;
        }

        .left {
          margin-right: 5%;
          float: right;
        }

        .right {
          margin-left: 5%;
          float: left;
        }
      }
    }

    .flight {
      margin: 0.625rem 0.9375rem;
      border-radius: 0.375rem;
      box-shadow: 0.125rem 0.125rem 0.125rem 0 #aaa;

      .top {
        background: #1bba9e;
        height: 1.875rem;
        line-height: 1.875rem;
        color: #fff;
        text-align: left;
        padding-right: 0.9375rem;
        border-top-left-radius: 0.375rem;
        border-top-right-radius: 0.375rem;

        span {
          float: right;
          padding-left: 0.25rem;
        }
      }

      .flightNum {
        background: #fff;
        height: 4.375rem;

        div {
          padding: 0.625rem 0.9375rem 0;
          line-height: 2.1875rem;
          overflow: hidden;
          font-size: 22px;
          background: url(../../../../assets/images/airlineLeft.png) no-repeat 50% 1.75rem;

          .fromTime {
            float: right;
          }

          .toTime {
            float: left;
          }

          .addOne {
            font-size: 12px;
            vertical-align: middle;
          }
        }

        p {
          padding: 0 0.9375rem;
          font-size: 13px;

          .fromAddr {
            float: right;
          }

          .toAddr {
            float: left;
          }

          .stopCity {
            color: #1bba9e;
          }
        }
      }

      .addr {
        background: #fff;
        height: 2.1875rem;
        font-size: 0.625rem;
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    }

    .orderContent {
      .passenger,
      .contact {
        background: #fff;
        padding: 0.625rem 0.9375rem;
        display: flex;
        flex-flow: row;

        label {
          width: 5rem;
          text-align: right;
          font-size: 16px;
          order: 2;
        }

        ul {
          flex: 1;
          order: 1;

          li {
            border-bottom: 0.0625rem solid #e5e5e5;
            margin-bottom: 0.3125rem;
            padding-bottom: 0.3125rem;

            p {
              color: #666;
              font-size: 12px;
              text-align: right;
              height: 1.375rem;
              line-height: 1.375rem;
            }
          }

          li:last-child {
            border-bottom: 0;
          }
        }
      }

      .passenger {
        padding-bottom: 0.9375rem;

        span {
          float: right;
        }
      }

      .contact {
        span {
          float: right;
        }
      }

      .order {
        background: #fff;
        margin-top: 0.625rem;
        padding-left: 0.875rem;

        .left {
          float: right;
          font-size: 16px;

          b {
            float: right;
            font-weight: normal;
          }
        }

        .right {
          float: left;
        }

        i.right {
          font-size: 21px;
          color: #ccc;
        }

        b.right {
          font-size: 12px;
          color: #000;
          font-weight: normal;
        }

        span.right {
          border: 0.0625rem solid #ff951b;
          color: #ff951b;
          display: inline-block;
        }
      }

      /* .insurance{height: 2.8125rem; line-height: 2.8125rem;} */
      .gift {
        height: 2.25rem;
        line-height: 2.25rem;
      }

      .total {
        height: 4.0625rem;

        .left {
          line-height: 4.0625rem;
        }
      }
    }
  }
</style>
