<template>
  <div id="buying">
    <c-title :hide="false" :text="name === 'buy'?lang.buy_name:lang.subscription_name"></c-title>
    <div id="content">
      <div class="top">
        <ul class="box">
          <li><h1>{{buying.name || buying.asset_name}}</h1></li>
          <li v-if="!name">可{{name === 'buy'?lang.buy_name:lang.subscription_name}}数量：{{buying.spare}}</li>
          <li>当前{{name === 'buy'?lang.buy_name:lang.subscription_name}}价：{{$i18n.t('money')}}{{buying.price}}/单位</li>
        </ul>
      </div>
      <div class="number">
        <span>{{name === 'buy'?lang.buy_name:lang.subscription_name}}数量：</span>
        <input type="tel" v-if="name" disabled :class="isMore ? 'more':''" v-model="buyNum"
               placeholder="">
        <input type="tel" v-if="!name" :class="isMore ? 'more':''"
               @keyup="getBuying" v-model="buyNum"
               :placeholder="'请输入'+lang.subscription_name+'数量'">
        <p class="red" v-show="isMore">超出可{{lang.subscription_name}}数量</p>
      </div>
      <div class="discount" v-if="order_data.order_deductions">
        <ul class="list">
          <li v-for="(item,i) in order_data.order_deductions" :key='i'>
            <span>可用{{item.coin}}{{item.name?item.name:'积分'}}抵扣{{item.amount}}{{$i18n.t('元')}}</span>
            <van-switch v-model="item.checked" @change="discountHandle(order_data,item)" size="28px" active-color="#f7a145" inactive-color="#fff" />

          </li>
        </ul>
      </div>
      <div class="sum">
        <ul class="box">
          <!--区块链会员优惠-->
          <template v-if="order_data.order_discounts">
            <li v-for="(item,i) in order_data.order_discounts" :key='i'>
              <span v-if="item.discount_code === 'independentGoodsMemberLevel'&& Number(item.amount)>0">会员等级优惠</span>
              <span v-if="item.discount_code !== 'independentGoodsMemberLevel'&& Number(item.amount)>0">{{item.name}}</span>
              <span v-if="Number(item.amount)>0">{{$i18n.t('money')}} -{{item.amount}}</span>
            </li>
          </template>

          <li v-if="order_data.order_deductions">
            <span>总抵扣</span>
            <span>{{$i18n.t('money')}}-{{deduction_price || 0}}</span>
          </li>
          <li>
            <span>总金额</span>
            <span>{{$i18n.t('money')}}{{goods_price || 0}}</span>
          </li>
        </ul>
      </div>
      <div class="sub_btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <p>合计：<span><em class="small">{{$i18n.t('money')}}</em>{{price || 0}}</span></p>
        <button type="button" @click="submit">提交订单</button>
      </div>
    </div>

  </div>
</template>

<script>
import buying_controller from "./buying_controller";

export default buying_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #buying {
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
          li:nth-child(3),
          li:nth-child(4) {
            line-height: 1.25rem;
            color: #8c8c8c;
          }
        }
      }

      .number {
        margin-top: 0.625rem;
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

      .sum {
        margin-top: 0.625rem;
        background: #fff;
        padding: 0 0.875rem;

        .box {
          li {
            line-height: 2.8125rem;
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

      .sub_btn {
        background: #fff;
        width: 100%;
        height: 3.125rem;
        line-height: 3.125rem;
        position: fixed;
        display: flex;
        justify-content: flex-end;
        bottom: 0;

        .small {
          font-size: 12px;
        }

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

      .sub_btn.pcStyle {
        width: 375px;
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
</style>
