<template>
  <div id="transaction_details">
    <c-title :hide="false" :text="'交易详情'"></c-title>
    <div id="content">
      <div class="detail_box" v-show="detailData.digitization_name">
        <ul class="info_a">
          <li>{{detailData.digitization_name}}</li>
          <li>{{detailData.total}}</li>
          <!-- 状态 -->
          <li class="ing" v-if="detailData.status_name">{{detailData.status_name}}</li>
        </ul>
        <ul class="info_b" v-if="type === 'buy'">
          <li>
            <span>{{lang.buy_name}}{{lang.capital_name}}</span>
            <span>{{detailData.digitization_name}}</span>
          </li>
          <li>
            <span>{{lang.buy_name}}数量</span>
            <span>{{detailData.total}}</span>
          </li>
          <li>
            <span>单价</span>
            <span>{{$i18n.t('money')}}{{detailData.price}}</span>
          </li>
          <li>
            <span>总金额</span>
            <span>{{$i18n.t('money')}}{{detailData.pay_amount}}</span>
          </li>
          <li>
            <span>爱心值抵扣</span>
            <span>{{$i18n.t('money')}}{{detailData.love_deduction}}</span>
          </li>
          <li>
            <span>积分抵扣</span>
            <span>{{$i18n.t('money')}}{{detailData.point_deduction}}</span>
          </li>
        </ul>

        <ul class="info_b" v-if="type === 'sell'">
          <li>
            <span>{{lang.sell_name}}{{lang.capital_name}}</span>
            <span>{{detailData.digitization_name}}</span>
          </li>
          <li>
            <span>{{lang.sell_name}}数量</span>
            <span>{{detailData.total}}</span>
          </li>
          <li>
            <span>单价</span>
            <span>{{$i18n.t('money')}}{{detailData.price}}</span>
          </li>
          <li>
            <span>预计总金额</span>
            <span>{{$i18n.t('money')}}{{detailData.amount}}</span>
          </li>
          <li>
            <span>手续费</span>
            <span>{{$i18n.t('money')}}{{detailData.poundage}}</span>
          </li>
          <li>
            <span>预计{{income_name_text}}</span>
            <span>{{$i18n.t('money')}}{{detailData.income}}</span>
          </li>
        </ul>

        <ul class="info_b" v-if="type === 'deal'">
          <li>
            <span>{{lang.buy_name}}{{lang.capital_name}}</span>
            <span>{{detailData.digitization_name}}</span>
          </li>
          <li>
            <span>{{lang.buy_name}}数量</span>
            <span>{{detailData.total}}</span>
          </li>
          <li>
            <span>单价</span>
            <span>{{$i18n.t('money')}}{{detailData.price}}</span>
          </li>
          <li>
            <span>总金额</span>
            <span>{{$i18n.t('money')}}{{detailData.amount}}</span>
          </li>
          <li>
            <span>爱心值抵扣</span>
            <span>{{$i18n.t('money')}}{{detailData.love_deduction}}</span>
          </li>
          <li>
            <span>积分抵扣</span>
            <span>{{$i18n.t('money')}}{{detailData.point_deduction}}</span>
          </li>
        </ul>

        <ul class="info_c">
          <li>
            <span>订单号</span>
            <span>{{detailData.order_sn}}</span>
          </li>
          <li>
            <span>创建时间</span>
            <span>{{detailData.created_at}}</span>
          </li>
          <li v-if="detailData.pay_amount">
            <span>实际支付金额</span>
            <span>{{$i18n.t('money')}}{{detailData.pay_amount}}</span>
          </li>
        </ul>
      </div>
      <!-- 撤销出售 -->
      <div class="trc_btn" v-if="detailData.status === 0 && type === 'sell'">
        <button @click="cancel">撤销{{lang.sell_name}}</button>
      </div>
      <div class="trc_btn red" v-if="detailData.status === -2 && type === 'sell'">
        <button disabled>交易已撤销</button>
      </div>

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
              <h1><i @click="popupSpecs = false" class="iconfont icon-guanbi"></i>请输入支付密码</h1>
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
import transaction_details_controller from "./transaction_details_controller";

export default transaction_details_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #transaction_details {
    #content {
      .detail_box {
        background: #fff;
        padding-left: 0.875rem;

        .info_a {
          padding: 0.625rem 0;

          li:first-child {
            font-size: 16px;
            line-height: 1.875rem;
          }

          li:nth-child(2) {
            font-size: 24px;
            line-height: 2.5rem;
            font-weight: bold;
          }

          .ing {
            color: #f15353;
            font-size: 16px;
          }
        }

        .info_b {
          padding: 0.625rem 0.875rem 0.625rem 0;

          li {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 1.875rem;

            span:first-child {
              color: #8c8c8c;
            }
          }
        }

        .info_c {
          padding: 0.625rem 0.875rem 0.625rem 0;
          border-top: solid 0.0625rem #ebebeb;

          li {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 1.875rem;

            span:first-child {
              color: #8c8c8c;
            }
          }
        }
      }
      // 按钮
      .trc_btn {
        margin: 1.25rem auto;

        button {
          padding: 0;
          width: 18.75rem;
          height: 2.625rem;
          border: none;
          border-radius: 0.25rem;
          background: #f7a145;
          color: #fff;
          font-size: 16px;
        }
      }

      .red {
        button {
          background: #f15353;
        }
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

      // 弹窗
      .popup_box {
        /* width: 18.75rem; */
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
      .pay-psw-info {
        /* overflow-y: scroll; */
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
    }
  }
</style>
