<template>
  <div id="asset_sale">
    <c-title :hide="false" :text="lang.sell_name"></c-title>
    <div id="content">
      <div class="top">
        <ul class="box">
          <li><h1>{{digitization.digitization_name}}</h1></li>
          <li>可{{lang.sell_name}}数量：{{digitization.member_usable}}</li>
          <li>当前{{lang.sell_name}}价：{{$i18n.t('money')}}{{digitization.digitization_price}}/单位</li>
        </ul>
      </div>
      <div class="sale_number">
        <div class="number">
          <span>{{lang.sell_name}}数量：</span>
          <input type="tel" :class="Number(buyNum)>Number(digitization.member_usable) ? 'more':''"
                 @keyup="buyNum=buyNum.replace(/[^\d]/g,'')" v-model="buyNum"
                 :placeholder="'请输入'+lang.sell_name+'数量'">
          <p class="red" v-show="Number(buyNum)>Number(digitization.member_usable)">超出可{{lang.sell_name}}数量</p>
        </div>
        <div class="number">
          <span>{{lang.sell_name}}单价：</span>
          <input type="number" @keyup="clearNoNum" v-model="saleNum" :placeholder="'请输入'+lang.sell_name+'单价'">
        </div>
      </div>

      <div class="sum" v-if="digitization.member_usable">
        <ul class="box">
          <li>
            <span>预计总金额</span>
            <span>{{$i18n.t('money')}}{{total || 0}}</span>
          </li>
          <li>
            <span>当前手续费</span>
            <span>{{$i18n.t('money')}}{{poundage || 0}}</span>
          </li>
          <li>
            <span>预计{{income_name_text}}</span>
            <span>{{$i18n.t('money')}}{{income || 0}}</span>
          </li>
        </ul>
      </div>
      <div class="sale_btn">
        <van-button type="primary" @click.native="sale">确认{{lang.sell_name}}</van-button>
      </div>


      <!--设置密码-->
      <transition name="scale">
        <div class="m-dialog" v-if="show2" @touchmove.prevent>
          <div class="popup_box_b" v-if="show2">
            <h1><i @click="show2 = false" class="iconfont icon-guanbi"></i>提示</h1>
            <ul class="sale_info">
              <li>请先设置支付密码，再继续交易</li>
            </ul>
            <div class="set_password" @click="toSetPassword">
              设置密码
            </div>
          </div>
        </div>
      </transition>


      <!--支付密码-->
      <transition name="scale">
        <div class="m-dialog" v-if="popupSpecs" @touchmove.prevent>
          <div class="pay-psw-info">
            <div class="popup_box">
              <h1><i @click="clearPassword" class="iconfont icon-guanbi"></i>请输入支付密码</h1>
            </div>

            <div class="pay_content">

              <div class="pay_content_view">

                <div class="ipt_pay">

                  <div class="ipt_pay_p">{{pw1|pwd_filter}}</div>

                </div>
                <div class="ipt_pay">
                  <div class="ipt_pay_p">{{pw2|pwd_filter}}</div>

                </div>
                <div class="ipt_pay">
                  <div class="ipt_pay_p">{{pw3|pwd_filter}}</div>

                </div>
                <div class="ipt_pay">
                  <div class="ipt_pay_p">{{pw4|pwd_filter}}</div>

                </div>
                <div class="ipt_pay">
                  <div class="ipt_pay_p">{{pw5|pwd_filter}}</div>

                </div>
                <div class="ipt_pay">
                  <div class="ipt_pay_p">{{pw6|pwd_filter}}</div>

                </div>

              </div>

            </div>
            <footer>
              <ul class="pay_btn">
                <li @click="onPassword('1')">1</li>
                <li @click="onPassword('2')">2</li>
                <li @click="onPassword('3')">3</li>
                <li @click="onPassword('4')">4</li>
                <li @click="onPassword('5')">5</li>
                <li @click="onPassword('6')">6</li>
                <li @click="onPassword('7')">7</li>
                <li @click="onPassword('8')">8</li>
                <li @click="onPassword('9')">9</li>
                <li class="b9"></li>
                <li @click="onPassword('0')">0</li>
                <li class="b9" @click="pwdDelete">删除</li>
              </ul>
            </footer>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import sale_controller from "./sale_controller";

export default sale_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #asset_sale {
    #content {
      .top {
        background: #fff;
        padding: 0.625rem 0.875rem;

        .box {
          li {
            text-align: left;

            h1 {
              font-size: 18px;
              line-height: 2.25rem;
            }
          }

          li:nth-child(2),
          li:nth-child(3) {
            line-height: 1.25rem;
            color: #8c8c8c;
          }
        }
      }

      .sale_number {
        background: #fff;
        margin-top: 0.625rem;

        .number {
          background: #fff;
          padding: 0.625rem 0.875rem;

          .more {
            color: red;
          }

          .red {
            margin: 0.5rem 0 0 0.5rem;
            text-align: left;
            font-size: 12px;
            color: red;
          }

          span {
            display: block;
            line-height: 2.25rem;
            font-size: 16px;
            text-align: left;
          }

          input {
            line-height: 2.5rem;
            padding: 0 0.625rem;
            background: #f5f5f5;
            border: none;
            width: 100%;
            font-size: 18px;
          }
        }
      }

      .sum {
        margin-top: 0.625rem;
        background: #fff;
        padding: 0.625rem 0.875rem;

        .box {
          li {
            line-height: 1.875rem;
            display: flex;
            justify-content: space-between;
            font-size: 14px;

            span:first-child {
              color: #8c8c8c;
            }
          }
        }
      }

      .discount {
        margin-top: 0.625rem;
        background: #fff;
        padding: 0.625rem 0.875rem;

        .list {
          li {
            line-height: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }

      .sale_btn {
        margin: 1.25rem auto;

        button {
          padding: 0;
          width: 18.75rem;
          height: 2.625rem;
          border-radius: 0.3125rem;
          background: #f7a145;
          color: #fff;
          font-size: 16px;
          border: none;
        }
      }

      .sub_btn {
        background: #fff;
        width: 100%;
        height: 3.125rem;
        line-height: 3.125rem;
        position: fixed;
        display: flex;
        justify-content: flex-end;
        bottom: 0;

        p {
          text-align: right;
          width: 16.5625rem;
          border-top: solid 0.0625rem #ebebeb;
          padding-right: 0.625rem;
          font-size: 16px;

          span {
            font-size: 18px;
          }
        }

        button {
          width: 6.875rem;
          background: #f7a145;
          color: #fff;
          border: none;
          font-size: 18px;
        }
      }
      // 弹窗
      .m-dialog {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background: rgba(0, 0, 0, 0.5);
      }

      //支付弹窗
      .popup_box {
        background: #fff;
        border-radius: 0.375rem;
        padding-bottom: 1.25rem;

        h1 {
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 16px;
          border-bottom: solid 0.0625rem #ebebeb;

          i {
            position: absolute;
            left: 0.875rem;
            line-height: 2.5rem;
            font-size: 1rem;
            color: #999;
          }
        }
      }

      .pay-psw-info {
        position: absolute;
        bottom: 0;
        width: 100vw;
        height: auto;
        background: #fff;
        max-height: 100%;
        padding-top: 0.625rem;
      }

      footer {
        /* position: absolute; */

        /* bottom: 0; */
        width: 100vw;
        font-weight: 600;
      }

      .pay_btn {
        display: flex;
        flex-wrap: wrap;
        border-top: 0.0625rem solid #ddd;
        width: 100vw;
        height: auto;
      }

      .pay_btn li {
        /* flex: 0 0 33.33%; */
        width: 33.333333%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        background: #fff;
        font-size: 14px;
        border-right: 0.0625rem solid #ddd;
        border-bottom: 0.0625rem solid #ddd;
      }

      .pay_btn li:active {
        background: #c2c2c2;
      }

      .b9:active {
        background: #fff !important;
      }

      .b9 {
        background: #c2c2c2 !important;
      }

      .pay_content {
        width: 100vw;
        height: 3.125rem;
        margin-bottom: 0.625rem;
      }

      .pay_content_title {
        width: 100vw;
        height: 1.875rem;
        line-height: 1.875rem;
        margin-bottom: 0.625rem;
        font-size: 18px;
      }

      .pay_content_view {
        display: flex;
        width: 100vw;
        height: 3.125rem; // margin-left: 0.125rem;
        border-bottom: 0.0625rem solid #ddd;
        border-top: 0.0625rem solid #ddd;
        border-right: 0.0625rem solid #ddd;
      }

      .ipt_pay_p {
        line-height: 3.125rem;
        height: 3.125rem;
        font-size: 20px;
      }

      .ipt_pay {
        flex: 1;
        height: 3.125rem;
        text-align: center;
        border-left: 0.0625rem solid #ddd;
      }

      // 提示弹窗
      .popup_box_b {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 18.75rem;
        background: #fff;
        border-radius: 0.375rem;

        h1 {
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 16px;
          border-bottom: solid 0.0625rem #ebebeb;

          i {
            position: absolute;
            left: 0.875rem;
            line-height: 2.5rem;
            font-size: 1rem;
            color: #999;
          }
        }

        .sale_info {
          text-align: left;
          padding: 0.625rem 1.25rem;

          li {
            line-height: 1.875rem;
            font-size: 16px;
          }
        }

        .set_password {
          margin-top: 2.25rem;
          border-top: solid 0.0625rem #ebebeb;
          height: 2.5rem;
          line-height: 2.5rem;
          color: #469de2;
          font-size: 16px;
        }
      }
    }
  }
</style>
