<template>
  <div id="addOrder" :class="'addOrder' + $store.state.service.lang">
    <c-title :hide="false" :text="jsonInfo.fromStation + '-' + jsonInfo.toStation"></c-title>

    <div class="flight">
      <div class="top">
        <i class="iconfont icon-life-plane"></i>
        <span>{{ jsonInfo.airDate }}</span>
        <span id="week">{{ week }}</span>
        <!--<span>{{card.week}}</span> <span>海南航空</span> <span>HU2014</span>-->
      </div>
      <div class="flightNum">
        <div>
          <span class="fromTime">{{ flightInfo.depTime }}</span>
          <!--<span class="addOne" v-show="false">+1天</span>-->
          <span class="toTime">{{ flightInfo.arriTime }}</span>
        </div>
        <p>
          <span class="fromAddr">{{ flightInfo.orgCityName }}</span>
          <!--<span class="stopCity" @click="closeCity">{{language.stopPort}}</span>-->
          <span class="toAddr">{{ flightInfo.dstCityName }}</span>
        </p>
      </div>
      <div class="addr">
        <span>{{ flightInfo.flightCompanyName }}</span>
        <span> {{ flightInfo.flightNo }}</span>
        <!--<span>准点率：</span> <span>8%</span> <span>|</span>
															<span>波音701-9</span> <span>(大型机)</span>-->
        <span></span>
        <span>机型:{{ flightInfo.planeType }}</span>
      </div>
    </div>
    <div class="information">
      <ul class="price">
        <li>
          <span>{{ flyListItem.seatMsg }}</span>
          <span>{{ $i18n.t("money") }}{{ flyListItem.settlePrice }}</span>
        </li>
        <li>
          <span>机建燃油</span>
          <span
          >{{ $i18n.t("money") }}{{ flightInfo.adultFuelTax }} {{ $i18n.t("money")
            }}{{ flightInfo.adultAirportTax }}</span
          >
        </li>
      </ul>
      <!-- <div class="trainprice">
				<span>{{flyListItem.seatMsg}}</span>
				<b>{{$i18n.t('money')}}{{flyListItem.settlePrice}}</b>
			</div>
			<div class="trainprice1">
				<span>机建燃油</span>
				<b>{{$i18n.t('money')}}{{flightInfo.adultFuelTax}} {{$i18n.t('money')}}{{flightInfo.adultAirportTax}}</b>
			</div> -->
      <div class="opportunity">
        <div class="add">
          <span class="left">{{ language.flight }}</span>
          <button class="right" type="button" @click="passenger">{{ language.addFlight }}</button>
        </div>
        <ul class="people">
          <li v-for="(airMan, index) in tempSelectAirMans" :key="index">
            <div class="left" @click="removePeople(airMan)"></div>
            <div class="airman">
              <h3>姓名:{{ airMan.username }}</h3>
              <p>身份证:{{ airMan.ids }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="linkman">
          <div class="name">
            <span class="left">{{ language.contacts }}</span>

            <input type="text" :placeholder="language.linkmanName" v-model="linkmanName"/>
          </div>
          <div class="phone">
            <span class="left">{{ language.phone }}</span>
            <input type="text" :placeholder="language.linkmanPhone" v-model="linkmanPhone"/>
          </div>
        </div>

        <!--<ul class="safe">-->
        <!--<li>-->
        <!--<div class="left">-->
        <!--<h3><span>{{language.flightDelays}}</span><i class="iconfont icon-tishi" @click="closedelayRisk"></i></h3>-->
        <!--<p><span>最高赔付200元</span><span>{{$i18n.t("money")}}20</span>-->
        <!--<span>X</span> <span>1份</span></p>-->
        <!--</div>-->
        <!--<div class="circle" :class="{active:chooseed}" @click="chooseCircle1"></div>-->
        <!--</li>-->
        <!--<li>-->
        <!--<div class="left">-->
        <!--<h3><span>{{language.casualty}}</span><i class="iconfont icon-tishi" @click="closeCasualty"></i></h3>-->
        <!--<p><span>百万保额护行程</span><span>{{$i18n.t("money")}}30</span>-->
        <!--<span>X</span> <span>1份</span></p>-->
        <!--</div>-->
        <!--<div class="circle" :class="{active:chooseed2}" @click="chooseCircle2"></div>-->
        <!--</li>-->
        <!--</ul>-->

        <!--<div class="integral">-->
        <!--<span class="left">{{language.reimbursementVoucher}}</span>-->
        <!--</div>-->

      </div>
      <div class="m-footer">
        <div class="clear"></div>
        <div class="amount">
          <span class="left"
          >{{ language.total }} {{ $i18n.t("money") }}
            <b>{{
              (count * (flyListItem.settlePrice + flightInfo.adultFuelTax + flightInfo.adultAirportTax)) | calculate
            }}</b>
            <i>{{ language.all }} {{ count }}{{ language.people }}</i>
          </span>

          <button class="right" :class="{ des: isDes }" type="button" @click="submit">
            {{ language.submitOrder }}
          </button>

          <!--<span class="right" @click="closeDetails">{{language.detail}}-->
            <!--<i class="iconfont icon-down" v-show="!details"></i>-->
            <!--<i class="iconfont icon-up" v-show="details"></i>-->
          <!--</span>-->
        </div>
      </div>
    </div>

    <!--延误险-->
    <div class="modal" v-show="delayRisk">
      <div class="modal-dialog">
        <h1 class="title">
          <i class="iconfont icon-tishi"></i> {{language.delayInsurance}}</h1>
        <ul class="regulations">
          <li>转签规定： <br/>不得转签</li>
          <li>改签规定： <br/>起飞前4小时意外，收取公布运价的30% <br/>起飞前4小时以内，收取公布运价的40%</li>
          <li>退票规定： <br/>起飞前4小时意外，收取公布运价的30% <br/>起飞前4小时以内，收取公布运价的40%</li>
        </ul>
        <span class="button" @click="closedelayRisk">我知道了</span>
      </div>
    </div>
    <!--意外险-->
    <div class="modal" v-show="casualty">
      <div class="modal-dialog">
        <h1 class="title">
          <i class="iconfont icon-tishi"></i> {{language.accidentInsurance}}</h1>
        <ul class="regulations">
          <li>转签规定： <br/>不得转签</li>
          <li>改签规定： <br/>起飞前4小时意外，收取公布运价的30% <br/>起飞前4小时以内，收取公布运价的40%</li>
          <li>退票规定： <br/>起飞前4小时意外，收取公布运价的30% <br/>起飞前4小时以内，收取公布运价的40%</li>
        </ul>
        <span class="button" @click="closeCasualty">{{language.know}}</span>
      </div>
    </div>
    <!--经停城市-->
    <div class="modal" v-show="city" @click="closeCity">
      <div class="modal-dialog" @click.stop>
        <h1 class="title">
          <i class="iconfont icon-tishi"></i>{{language.stopInformation}}</h1>
        <ul class="content">
          <li>
            <span>{{language.stopCity}}</span>
            <span>天津</span>
          </li>
          <li>
            <span>{{language.stopTime}}</span>
            <span>00:30</span>
          </li>
          <li>
            <span>{{language.startFly}}</span>
            <span>30分钟</span>
          </li>
          <li>
            <span>{{language.endFly}}</span>
            <span>00:30</span>
          </li>
        </ul>
        <span class="button" @click="closeCity">{{language.know}}</span>
      </div>
    </div>
    <!--增加乘机人-->
    <van-popup v-model="addPassenger" position="bottom">
      <div class="passenger">
        <p class="control">
          <span class="left" @click="closeAirMans">{{language.cancle}}</span>
          <span class="right" @click="addAirMans">{{language.confirm}}
						<b>({{this.count}}</b>/
						<b>{{airMans.length}})</b>
					</span>
        </p>
        <span class="btn" @click="newAddPassenger"><i class="iconfont icon-plus"></i>{{language.btnAddFlight}}</span>
        <ul>
          <li v-for="(airMan,index) in airMans" :key='index'>
            <div class="left">
              <router-link :to="fun.getUrl('')">
                <div class="icon">
                  <i class="iconfont icon-liuyan"></i>
                </div>
              </router-link>
              <div class="infom">
                <p>
                  <span>{{language.name}}</span>
                  <span>{{airMan.username}}</span>
                </p>
                <p>
                  <span>{{language.IDCard}}</span>
                  <span>{{airMan.ids}}</span>
                </p>
              </div>
            </div>
            <div class="right">
              <div class="circle" :class="{active:airMans[index].choose}" @click="chooseCircle(index)"></div>
            </div>
          </li>
        </ul>


      </div>
    </van-popup>

    <!--新增加乘机人-->
    <van-popup v-model="newAddPassengerPop" class="mint-popup-3" position="right" closeOnClickModal='true' modal='false'
               style="z-index: 2004;">
      <div class="new-add-passenger">
        <van-nav-bar
          left-arrow
          :title="language.addTitle"
          fixed
          @click-left="closeNewAddPassenger"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />
        <div style="height: 40px;"></div>
        <div class="add-info">
          <ul class="content1">

            <li class="form-group">
              <label class="form-help">{{ language.cardId }}</label>
              <input class="form-controler" type="number" :placeholder="language.placeCardTip" v-model="cardId"/>
            </li>

            <li class="form-group">
              <label class="form-help">{{ language.phoneNumber }}</label>
              <input
                class="form-controler"
                type="number"
                :placeholder="language.placePhoneNumberTip"
                v-model="phoneNumber"
              />
            </li>
          </ul>
        </div>
        <span class="btn1" @click="confirmAddPassenger">{{ language.btn }}</span>
      </div>
    </van-popup>

    <!--明细-->
    <div class="modalDetail" v-show="details" @click="closeDetails">
      <div class="modal-dialog" @click.stop>
        <ul>
          <li>
            <span>成人票</span>
            <span class="center">{{ $i18n.t("money") }}750</span>
            <span class="right">x1人</span>
          </li>
        </ul>
        <ul>
          <li class="line">
            <span>机建+燃油</span>
            <span class="center">{{ $i18n.t("money") }}50</span>
            <span class="right">x1人</span>
          </li>
          <li>
            <span>延误险</span>
            <span class="center">{{ $i18n.t("money") }}20</span>
            <span class="right">x1人</span>
          </li>
          <li>
            <span>意外险</span>
            <span class="center">{{ $i18n.t("money") }}30</span>
            <span class="right">x1人</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import addOrder_controller from "./addOrder_controller";

export default addOrder_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  b {
    font-weight: normal;
    color: #1e1e1e;
  }

  .addOrderch {
    .new-add-passenger {
      overflow-y: scroll;
      width: 100vw;
      height: 100vh;
      background: #f5f5f5;
    }

    .mint-header {
      background: none;
      color: #666;
    }

    .is-fixed .mint-header-title {
      font-weight: bold;
    }

    .mint-header.is-fixed {
      border-bottom: 0.0625rem solid #e8e8e8;
      background: #fff;
      z-index: 99;
    }

    .is-right a {
      font-size: 12px;
    }

    .add-info {
      background-color: #fff;
      padding-left: 14px;
    }

    .content1 {
      margin-top: 0.625rem;
      font-size: 16px;

      li:last-child {
        border: none;
      }

      li {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding-right: 0.875rem;
        background: #fff;
        text-align: left;
        border-bottom: solid 0.0625rem #ebebeb;

        label {
          width: 6.25rem;
          float: left;
          text-align: left;
        }

        i {
          font-size: 25px;
          float: right;
        }

        input {
          border: 0;
          outline: 0;
          float: left;
          width: 75%;
          height: 2.8125rem;
          line-height: 2.8125rem;
        }
      }

      .form-group {
        height: 2.8125rem;
        background: #fff;
        border-top: 0.0625rem solid #fff;
        display: -webkit-flex;

        /* Safari */
        display: flex;
        flex-flow: row;

        .form-help {
          width: 6.25rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          text-align: left;
        }

        .form-controler {
          flex: 1;
          height: auto;
          line-height: 2.8125rem;
          float: left;
          border: 0;
          outline: 0;
          text-align: left;

          i {
            font-size: 23px;
            float: right;
          }
        }
      }
    }

    .btn1 {
      width: 90%;
      height: 46px;
      line-height: 46px;
      border: none;
      display: block;
      margin: 1.25rem auto;
      -webkit-border-radius: 0.375rem;
      -moz-border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: #f15353;
      color: #fff;
      font-size: 16px;
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
        bottom: 6.125rem;
        position: absolute;
        padding-top: 0.625rem;

        ul {
          li {
            padding: 0 0.9375rem;
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
            margin-bottom: 0.625rem;
            padding-bottom: 0.625rem;
          }
        }
      }
    }

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
          }

          color: #666;
          font-weight: normal;
          font-size: 14px;
          line-height: 2.1875rem;
          text-align: left;
          padding-left: 1.5625rem;
          border-bottom: 0.0625rem solid #ebebeb;
        }

        .content {
          padding: 0.625rem;

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

        .regulations {
          padding: 0.625rem;

          li {
            text-align: left;
            padding-top: 0.3125rem;
          }
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

    .flight {
      margin-top: 0.625rem;
      background-color: #fff;

      .top {
        display: flex;
        height: 2.25rem;
        line-height: 2.25rem;
        color: #8c8c8c;
        text-align: left;
        padding-left: 0.875rem;
        font-size: 14px;

        i {
          color: #f15353;
          font-size: 18px;
          margin-right: 0.625rem;
        }
      }

      .flightNum {
        background: #fff;
        height: 4.375rem;

        div {
          padding: 0.3125rem 0.9375rem 0;
          line-height: 2.1875rem;
          overflow: hidden;
          font-size: 22px;
          background: url(../../../../assets/images/airline.png) no-repeat 50% 1.75rem;
          background-size: 3.75rem;

          .fromTime {
            width: 40%;
            text-align: center;
            float: left;
          }

          .toTime {
            width: 40%;
            text-align: center;
            float: right;
          }

          .addOne {
            font-size: 12px;
            vertical-align: middle;
          }
        }

        p {
          padding: 0 0.9375rem;
          font-size: 13px;
          color: #8c8c8c;

          .fromAddr {
            width: 40%;
            text-align: center;
            float: left;
          }

          .toAddr {
            width: 40%;
            text-align: center;
            float: right;
          }

          .stopCity {
            color: #1bba9e;
          }
        }
      }

      .addr {
        font-size: 10px;
        color: #8c8c8c;
        height: 2.25rem;
        line-height: 2.25rem;
      }
    }

    .information {
      padding-top: 0.625rem;

      .price {
        margin-bottom: 0.625rem;
        font-size: 14px;
        background-color: #fff;
        padding: 0.625rem 0.875rem;

        li {
          display: flex;
          justify-content: space-between;
          line-height: 1.875rem;

          span:last-child {
            color: #f15353;
            font-size: 16px;
          }
        }
      }

      .trainprice {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.875rem;
        background: #fff;
        margin-bottom: 0;

        span {
          float: left;
        }

        b {
          float: right;
          font-size: 16px;
          color: #ff951b;
        }
      }

      .trainprice1 {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.9375rem;
        background: #fff;
        margin-bottom: 0.625rem;

        span {
          float: left;
        }

        b {
          float: right;
          font-size: 16px;
          color: #ff951b;
        }
      }

      button {
        width: 5.5rem;
        height: 1.625rem;
        line-height: 1.625rem;
        color: #fff;
        text-align: center;
        background: #f15353;
        margin-top: 0.5625rem;
        border: 0;
        outline: 0;
        border-radius: 0.1875rem;
      }

      .opportunity {
        background: #fff;

        .add {
          font-size: 16px;
          padding: 0 0.875rem;
          height: 2.8125rem;
          line-height: 2.8125rem;

          .left {
            float: left;
          }

          .right {
            float: right;
            font-size: 12px;
            background: #f15353;
            color: #fff;
          }
        }

        .people {
          border-top: 0.0625rem solid #ebebeb;

          li {
            padding: 0.625rem 0.875rem;
            display: flex;
            flex-flow: row;

            div.left {
              width: 2.5rem;
              float: left;
              background: url(../../../../assets/images/delete.png) no-repeat 0 0.9375rem;
            }

            .airman {
              flex: 1;
              height: 100%;
              text-align: left;

              h3 {
                height: 1.5rem;
                line-height: 1.5rem;
                color: #1e1e1e;
                font-size: 14px;
                font-weight: normal;
              }

              p {
                height: 1.5rem;
                line-height: 1.5rem;
                font-size: 12px;
                color: #666;
              }
            }
          }
        }
      }

      .content {
        margin-bottom: 9.375rem;

        .linkman {
          padding-left: 0.875rem;
          margin-top: 0.625rem;
          background: #fff;
          margin-bottom: 0.625rem;
          font-size: 16px;

          .name {
            height: 2.8125rem;
            line-height: 2.8125rem;
            padding-right: 0.875rem;

            span {
              width: 6.25rem;
              text-align: left;
              float: left;
            }

            input {
              width: 60%;
              flex: 1;
              height: 2.8125rem;
              line-height: 2.8125rem;
              float: left;
              border: 0;
              outline: 0;
              text-align: left;

              i {
                font-size: 23px;
                float: right;
              }
            }

            button {
              float: right;
            }
          }

          .phone {
            height: 2.8125rem;
            line-height: 2.8125rem;
            border-top: 0.0625rem solid #ebebeb;
            padding-right: 0.875rem;

            span {
              float: left;
              width: 6.25rem;
              text-align: left;
            }

            b {
              float: left;
            }

            input {
              width: 60%;
              flex: 1;
              height: 2.8125rem;
              line-height: 2.8125rem;
              float: left;
              border: 0;
              outline: 0;
              text-align: left;

              i {
                font-size: 23px;
                float: right;
              }
            }
          }
        }

        /* .safe{
                  background:#fff;
                  li{
                      padding:0 15px;
                      border-bottom:1px solid #ccc;
                      height:70px;
                      text-align:left;
                      div.left{
                        float: left;
                        h3{
                          font-weight: normal;
                          overflow: hidden;
                            span{
                                font-size:16px;
                                width:100px;
                                height:20px;
                                display:inline-block;
                                float: left;
                            }
                            i{color:#FF951B;font-size: 25px;float: left;}
                            padding-top:15px;
                            padding-bottom:10px;
                            color:#lelele;
                        }
                        p{
                            color:#666;
                            font-size:12px;
                            span{padding-right: 4px;}
                        }
                      }
                      .circle{
                          width:20px;
                          height:20px;
                          line-height:20px;
                          text-align:center;
                          display:inline-block;
                          border:1px solid #aaa;
                          border-radius:50%;
                          margin-top:20px;
                          float:right;
                      }
                      .active{
                          border:1px solid #36d2b6;
                          background:url(../../../../assets/images/mark.png) no-repeat 4px 4px;
                      }
                  }
                  li:last-child{
                      border-bottom:none;
                  }
              } */
        .integral {
          background: #fff;
          padding: 0 0.9375rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          margin-top: 0.9375rem;

          .left {
            float: left;
          }

          .right {
            float: right;
          }
        }
      }

      .m-footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding-left: 0.875rem;
        background: #fff;
        z-index: 200;

        .score {
          height: 2.8125rem;
          line-height: 2.8125rem;
          padding: 0 0.875rem;

          div.left {
            float: left;

            b {
              color: #333;
              font-size: 16px;
            }

            span {
              color: #333;
              font-size: 12px;

              i {
                font-style: normal;
              }
            }
          }

          .right {
            float: right;
          }
        }

        .amount {
          height: auto;
          line-height: 2.8125rem;
          box-sizing: border-box;

          span.left {
            float: left;
            color: #333;
            font-size: 16px;

            i {
              padding-left: 0.625rem;
              color: #666;
              font-size: 12px;
            }

            b {
              font-weight: bold;
            }
          }

          button.right {
            float: right;
            width: 6.875rem;
            height: 2.8125rem;
            line-height: 2.8125rem;
            color: #fff;
            font-size: 16px;
            background: #f15353;
            border: 0;
          }

          button.right.des {
            float: right;
            width: 6.875rem;
            height: 2.8125rem;
            line-height: 2.8125rem;
            color: #fff;
            font-size: 16px;
            background: #f15353;
            border: 0;
            border-radius: 0;
            margin: 0;
          }

          span.right {
            float: right;
            padding-right: 0.625rem;
            height: 3.125rem;
            line-height: 3.125rem;

            i {
              font-size: 20px;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .passenger {
      padding-bottom: 0.625rem;

      a {
        color: #333;
      }

      .control {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .left {
          float: left;
          font-size: 14px;
        }

        .right {
          float: right;
          color: #333;
          font-size: 14px;
        }
      }

      ul {
        border-top: solid 0.0625rem #ebebeb;
        padding: 0 0.875rem;

        li {
          padding: 0.625rem 0;
          text-align: left;
          border-bottom: 0.0625rem solid #ebebeb;
          margin-top: 0.3125rem;
          margin-bottom: 0.3125rem;
          font-size: 14px;
          display: flex;
          justify-content: space-between;

          .left {
            width: 90%;
            float: left;

            .icon {
              height: 3.125rem;
              float: left;
              line-height: 3.125rem;
              padding: 0 0.625rem;

              i {
                color: #ccc;
                width: 30px;
                font-size: 30px;
              }
            }

            .infom {
              float: left;

              p {
                color: #333;
                height: 1.875rem;
                line-height: 1.875rem;
                font-size: 12px;
              }
            }
          }

          .right {
            width: 10%;
            float: left;

            .circle {
              width: 1.25rem;
              height: 1.25rem;
              line-height: 1.25rem;
              text-align: center;
              display: inline-block;
              border: 0.0625rem solid #aaa;
              border-radius: 50%;
              margin-top: 1.25rem;
              float: right;
            }

            .active {
              border: 0.0625rem solid #f15353;
              background: url(../../../../assets/images/mark-a.png) no-repeat 0.25rem 0.25rem;
              background-position: center;
            }
          }
        }
      }

      .btn {
        width: 18.75rem;
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 14px;
        border: 0.0625rem solid #ebebeb;
        background-color: #fafafa;
        display: block;
        margin: 10px auto;
        -webkit-border-radius: 0.25rem;
        -moz-border-radius: 0.25rem;
        border-radius: 0.25rem;

        i {
          color: #333;
          font-size: 18px;
          margin-right: 0.375rem;
        }
      }
    }
  }

  .addOrderwei {
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
        bottom: 6rem;
        position: absolute;
        padding-top: 0.625rem;

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
            margin-bottom: 0.625rem;
            padding-bottom: 0.625rem;
          }
        }
      }
    }

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
            font-size: 25px;
            float: right;
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

        .regulations {
          padding: 0.625rem;

          li {
            text-align: right;
            padding-top: 0.3125rem;
          }
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
        font-size: 10px;
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    }

    .information {
      button {
        width: 5.5625rem;
        line-height: 1.6875rem;
        height: 1.6875rem;
        color: #fff;
        text-align: center;
        background: #ff951b;
        margin-top: 0.5625rem;
        border: 0;
        outline: 0;
        border-radius: 0.3125rem;
      }

      .opportunity {
        background: #fff;

        .add {
          padding: 0 0.9375rem;
          height: 2.8125rem;
          line-height: 2.8125rem;

          .left {
            float: right;
          }

          .right {
            float: left;
          }
        }

        .people {
          border-top: 0.0625rem solid #ccc;

          li {
            padding: 0 0.9375rem;
            height: 3.75rem;
            display: flex;
            flex-flow: row;

            div.left {
              width: 2.5rem;
              order: 2;
              float: right;
              background: url(../../../../assets/images/delete.png) no-repeat 1.25rem 0.9375rem;
            }

            .airman {
              flex: 1;
              order: 1;
              height: 100%;
              text-align: right;

              h3 {
                height: 2.1875rem;
                line-height: 2.1875rem;
                color: #1e1e1e;
                font-size: 16px;
                font-weight: normal;
              }

              p {
                font-size: 12px;
                color: #666;
              }
            }
          }
        }
      }

      .content {
        margin-bottom: 9.375rem;

        .linkman {
          margin-top: 0.9375rem;
          background: #fff;
          margin-bottom: 0.9375rem;

          .name {
            height: 2.8125rem;
            line-height: 2.8125rem;
            padding: 0 0.9375rem;

            span {
              float: right;
              padding-left: 0.5rem;
            }

            b {
              float: right;
            }

            button {
              float: left;
            }
          }

          .phone {
            height: 2.8125rem;
            line-height: 2.8125rem;
            border-top: 0.0625rem solid #ccc;
            padding: 0 0.9375rem;

            span {
              float: right;
              padding-left: 0.5rem;
            }

            b {
              float: right;
            }
          }
        }

        /* .safe{
                  background:#fff;
                  li{
                      padding:0 15px;
                      border-bottom:1px solid #ccc;
                      height:70px;
                      text-align:left;
                      div.left{
                        float: right;
                        h3{
                          font-weight: normal;
                          text-align: right;
                          overflow: hidden;
                            span{
                                font-size:16px;
                                height:20px;
                                display:inline-block;
                                float: right;
                            }
                            i{color:#FF951B;font-size: 25px;vertical-align: bottom;float:right;}
                            padding-top:15px;
                            color:#lelele;
                        }
                        p{
                            color:#666;
                            font-size:12px;
                            line-height: 22px;
                            span{padding-right: 5px; float: right;}
                        }
                      }
                      .circle{
                          width:20px;
                          height:20px;
                          line-height:20px;
                          text-align:center;
                          display:inline-block;
                          border:1px solid #aaa;
                          border-radius:50%;
                          margin-top:20px;
                          float:left;
                      }
                      .active{
                          border:1px solid #36d2b6;
                          background:url(../../../../assets/images/mark.png) no-repeat 4px 4px;
                      }
                  }
                  li:last-child{
                      border-bottom:none;
                  }
              } */
        .integral {
          background: #fff;
          padding: 0 0.9375rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          margin-top: 0.9375rem;

          .left {
            float: right;
          }

          .right {
            float: left;
          }
        }
      }
      // .m-footer {
      // 	width: 100%;
      // 	position: fixed;
      // 	bottom: 0;
      // 	background: #fff;
      // 	z-index: 200;
      // 	.score {
      // 		height: 2.8125rem;
      // 		padding: 0 0.8125rem;
      // 		div.left {
      // 			float: right;
      // 			width: 82%;
      // 			b {
      // 				color: #333;
      // 				font-size: 16px;
      // 				font-weight: noraml;
      // 				float: right;
      // 				line-height: 2.8125rem;
      // 			}
      // 			span {
      // 				color: #333;
      // 				font-size: 12px;
      // 				padding-right: 0.625rem;
      // 				line-height: 1.375rem;
      // 				i {
      // 					font-style: normal;
      // 				}
      // 			}
      // 		}
      // 		.right {
      // 			float: left;
      // 			width: 18%;
      // 		}
      // 	}
      // 	.amount {
      // 		height: 3.125rem;
      // 		line-height: 3.125rem;
      // 		/*padding:0 0 0 13px;*/
      // 		margin-bottom: 0;
      // 		box-sizing: border-box;
      // 		span.left {
      // 			float: left;
      // 			color: #333;
      // 			font-size: 16px;
      // 			i {
      // 				font-style: normal;
      // 				padding-left: 0.625rem;
      // 				color: #666;
      // 				font-size: 12px;
      // 			}
      // 		}
      // 		button.right {
      // 			float: right;
      // 			width: 6.5625rem;
      // 			height: 2.5rem;
      // 			color: #fff;
      // 			font-size: 16px;
      // 			background: #ff951b;
      // 			border: 0;
      // 			border-radius: 0.1875rem;
      // 			margin-top: 0.5625rem;
      // 		}
      // 		span.right {
      // 			float: right;
      // 			/*padding-right:10px;*/
      // 			height: 3.125rem;
      // 			line-height: 3.125rem;
      // 			i {
      // 				font-size: 20px;
      // 				vertical-align: middle;
      // 			}
      // 		}
      // 	}
      // }
    }

    .passenger {
      padding: 0 0.9375rem;

      a {
        color: #333;
      }

      .control {
        height: 2.5rem;
        line-height: 2.5rem;

        .left {
          float: right;
        }

        .right {
          float: left;
          color: #36d2b6;
        }
      }

      ul {
        li {
          text-align: right;
          border-bottom: 0.0625rem solid #eee;
          height: 3.125rem;
          margin-top: 0.3125rem;

          .left {
            width: 90%;
            float: right;

            .icon {
              height: 3.125rem;
              float: right;
              line-height: 3.125rem;
              padding: 0 0.625rem;

              i {
                color: #ccc;
                width: 1.875rem;
                font-size: 30px;
              }
            }

            .infom {
              float: right;

              p {
                color: #7c7c7c;
                height: 1.5625rem;
                font-size: 12px;

                span {
                  float: right;
                }
              }
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
              border: 1px solid #36d2b6;
              background: url(../../../../assets/images/mark.png) no-repeat 0.25rem 0.25rem;
            }
          }
        }
      }

      .btn {
        width: 80%;
        height: 2.5rem;
        line-height: 2.5rem;
        border: 0.0625rem solid #dfdfdf;
        display: block;
        margin: 0.625rem auto;
        -webkit-border-radius: 0.375rem;
        -moz-border-radius: 0.375rem;
        border-radius: 0.375rem;
      }
    }

    .van-nav-bar,
    /deep/ .van-nav-bar__content {
      height: 40px;
    }

    /deep/ .van-nav-bar__title {
      font-weight: 700;
      font-size: 14px;
      color: #666;
    }

    /deep/ .van-nav-bar .van-icon {
      color: #666;
    }

    /deep/ .van-nav-bar__left {
      padding: 0 0 0 10px;
    }

    .pcStyle {
      width: 375px;
      margin: 0 auto;
      left: 50%;
      margin-left: -187.5px;
    }
  }
</style>
