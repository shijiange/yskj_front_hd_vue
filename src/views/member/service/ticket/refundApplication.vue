<template>
  <div id="refundApplication" :class="'refundApplication'+$store.state.service.lang">
    <c-title :hide="false" text='退票申请'></c-title>

    <div class="orderStates">
      <div class="booking"><span class="state">预计退还</span> <span
        class="right"><font>{{$i18n.t("money")}}</font>750</span></div>
      <p><span class="left"><b>订单号</b>1234567</span>
        <span class="right" @click="closeDetails">明细
					<i class='iconfont icon-down'></i>
				</span>
      </p>
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
        <span>准点率：</span> <span>8%</span> <span>|</span>
        <span>波音701-9</span> <span>(大型机)</span>
      </div>
    </div>


    <div class="passenger">
      <p class="control">选择需要退票的乘机人</p>
      <ul>
        <li v-for="(airMan,index) in airMans" :key='index'>
          <div class="left">
            <p>姓名：{{airMan.name}}</p>
            <p>身份证号：{{airMan.num}}</p>
          </div>
          <div class="right">
            <div class="circle" :class="{active:airMans[index].choose}" @click="chooseCircle($event)"
                 :data-index="index"></div>
          </div>
        </li>
      </ul>
    </div>


    <div class="m-footer">
      <router-link :to="fun.getUrl('changeAgreement')">
        <span>退改协议</span>
      </router-link>

      <router-link :to="fun.getUrl('ticketOrderDetail')">
        <span>申请退票</span>
      </router-link>
    </div>

    <!--明细-->
    <div class="modalDetail" v-show="details" @click="closeDetails">
      <div class="modal-dialog" @click.stop>
        <div class="booking"><span class="state">预计退还</span> <span
          class="right"><font>{{$i18n.t("money")}}</font>750</span></div>
        <p><span class="left"><b>订单号</b>1234567</span>
          <span class="right" @click="closeDetails">明细
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

          <!--<li class="title">其他</li>-->
          <!--<li> <span>延误险</span> <span class="center">{{$i18n.t('money')}}20</span> <span class="right">x1人</span></li>
          <li class="line"> <span>意外险</span> <span class="center">{{$i18n.t('money')}}30</span> <span class="right">x1人</span></li>-->
          <li class="big"><span class="left">总额</span> <span class="right">{{$i18n.t("money")}}850</span></li>
          <li class="big"><span class="left">支付方式</span> <span class="right">支付宝</span></li>
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
import refundApplication_controller from "./refundApplication_controller";

export default refundApplication_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .refundApplicationch {
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
            line-height: 1.5rem;
            display: flex;
            justify-content: space-between;
          }

          .big {
            color: #333;
            font-size: 14px;
            padding-left: 0.875rem;
            line-height: 1.875rem;
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;

            span {
              line-height: 22px;
              margin-top: 8px;
            }
          }
        }
      }
    }

    .flight {
      margin-top: 0.625rem;
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
      }
    }

    .orderStates {
      background: #fff;
      padding: 0.625rem 0.9375rem;

      .booking {
        height: 1.875rem;
        line-height: 1.875rem;
        color: #f15353;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;

        .state {
          color: #333;
        }

        .right {
          font {
            font-size: 14px;
            font-weight: normal;
          }
        }
      }

      p {
        color: #8c8c8c;
        font-size: 12px;
        height: 1.625rem;
        line-height: 1.625rem;
        display: flex;
        justify-content: space-between;
      }
      // p:after{
      // 	display: table;
      // 	content:'';
      // 	clear:both;
      // }
    }

    .passenger {
      margin-top: 0.625rem;
      background: #fff;

      .control {
        padding-left: 0.875rem;
        font-size: 14px;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: left;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      ul {
        li:last-child {
          border: none;
        }

        li {
          display: flex;
          justify-content: space-between;
          margin: 0 1.25rem;
          text-align: left;
          border-bottom: 0.0625rem solid #ebebeb;
          height: 4.25rem;
          padding-top: 0.625rem;

          .left {
            width: 90%;

            p {
              color: #8c8c8c;
              height: 1.5rem;
              line-height: 1.5rem;
              font-size: 12px;
            }
          }

          .right {
            width: 10%;

            .circle {
              width: 1.25rem;
              height: 1.25rem;
              line-height: 1.25rem;
              text-align: center;
              display: inline-block;
              border: 0.0625rem solid #aaa;
              border-radius: 50%;
              margin-top: 0.875rem;
              float: right;
            }

            .active {
              border: 0.0625rem solid #f15353;
              background: url(../../../../assets/images/mark-a.png) no-repeat 0.1875rem 0.25rem;
              background-position: center;
            }
          }
        }
      }
    }

    .m-footer {
      width: 100%;
      height: 2.8125rem;
      line-height: 2.8125rem;
      background: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      border-top: 0.0625rem solid #ebebeb;
      text-align: right;
      padding: 0 14px;

      a {
        color: #333;
      }

      div {
        height: 2.8125rem;
      }

      span {
        padding: 0.25rem 0.625rem;
        border: solid 0.0625rem #666;
        border-radius: 0.1875rem;
        margin-left: 0.625rem;
      }
    }
  }

  .refundApplicationwei {
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
          text-align: right;
          padding-right: 1.5625rem;
          border-bottom: 0.0625rem solid #ccc;
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
    // .modalDetail{
    // 	position:fixed;
    //     top:0;
    //     left:0;
    //     right:0;
    //     bottom:0;
    //     background:rgba(0,0,0,.7);
    //     z-index:70;
    //     .modal-dialog{
    //         width:100%;
    //         background:#fff;
    //         z-index: 1200;
    //         top: 2.5rem;
    //         position: absolute;
    //         padding:0.625rem 0;
    //         .booking{
    // 			height: 1.875rem;
    // 			line-height: 1.875rem;
    // 			color: #FF951B;
    // 			font-size: 16px;
    // 			padding: 0 0.9375rem;
    // 			.state{
    // 				float: right;
    // 			}
    // 			.right{
    // 				float: left;
    // 			}
    // 		}
    // 		p{
    // 			color: #666666;
    // 			font-size: 12px;
    // 			height: 1rem;
    // 			line-height: 1rem;
    // 			padding: 0 0.9375rem 1.5625rem;
    // 			border-bottom: 0.0625rem solid #e7e7e7;
    // 			.left{float: right; b{float: right;font-weight: normal;}}
    // 			.right{float: left;}
    // 		}
    //         ul{
    //         	li{
    //         		padding: 0 0.9375rem;
    //         		height:1.375rem;
    //         		line-height: 1.375rem;
    //         		span{width: 33.3%;display: inline-block;float: left;text-align: left;}
    //         		.center{text-align: center;}
    //         		.right{text-align: right;}
    //         	}
    //         	.line{border-bottom: 0.0625rem solid #eee;padding-bottom: 0.625rem;}
    //         	.title{
    //         		height: 2.0625rem;
    //         		line-height: 2.0625rem;
    //         		text-align: left;
    //         		font-size: 16px;
    //         		color: #a2a2a2;
    //         		.right{float: right;}
    //         	}
    //         }
    //    }
    // }

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
          padding-left: 0.3125rem;
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

    .orderStates {
      background: #fff;
      padding: 0.625rem 0.9375rem;

      .booking {
        height: 1.875rem;
        line-height: 1.875rem;
        color: #ff951b;
        font-size: 16px;

        .state {
          float: right;
        }

        .right {
          float: left;
        }
      }

      p {
        color: #666;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
      }
      // p:after{
      // 	display: table;
      // 	content:'';
      // 	clear:both;
      // }
    }

    .passenger {
      padding: 0 0.9375rem;
      background: #fff;

      .control {
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: right;
      }

      ul {
        padding-bottom: 0.625rem;

        li {
          text-align: right;
          border-top: 0.0625rem solid #eee;
          height: 3.125rem;
          padding-top: 0.3125rem;

          .left {
            width: 90%;
            float: right;

            p {
              color: #7c7c7c;
              height: 1.5625rem;
              font-size: 12px;
            }
          }

          .right {
            width: 10%;
            float: right;

            .circle {
              width: 1.25rem;
              height: 1.25rem;
              line-height: 1.25rem;
              text-align: center;
              display: inline-block;
              border: 0.0625rem solid #aaa;
              border-radius: 50%;
              margin-top: 0.625rem;
              float: right;
            }

            .active {
              border: 0.0625rem solid #36d2b6;
              background: url(../../../../assets/images/mark.png) no-repeat 0.1875rem 0.25rem;
            }
          }
        }
      }
    }

    .m-footer {
      width: 100%;
      height: 2.8125rem;
      line-height: 2.8125rem;
      background: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      border-top: 0.0625rem solid #ccc;

      a {
        color: #333;
      }

      div {
        width: 50%;
        float: left;
        height: 2.8125rem;
      }

      div.left {
        border-right: 0.0625rem solid #ccc;
      }
    }
  }
</style>
