<template>
  <div id="oilPay"
       :class="'oilPay'+$store.state.service.lang">

    <div class="input"
         v-if="false">
      <input type="text"
             :placeholder="language.placeTip"
             v-model="phone" />
    </div>
    <ul class="box">
      <li v-for="(item,index) in goods" :key='index'>
        <!-- <div class="par"> -->
        <div class="par"
             @click="selectStyle($event,item)"
             :class="{'active':item.itemId==itemId}">
          <b>{{item.recharge}}{{language.yuan}}</b>
          <p>{{item.inPrice}}{{language.yuan}}</p>
          <i></i>
          <!-- <div class="info" @click="selectStyle($event,item.inPrice)"></div> -->
          <div class="info"
               :class="{'active':item.itemId==itemId}"></div>
        </div>
      </li>
    </ul>
    <div class="m-footer"
         :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <p class="subtotal">
        <span class="left">{{language.subtotal}}</span>
        <span class="right">{{$i18n.t('money')}}{{sourceMoney}}</span>
      </p>
      <div class="clear"></div>
      <div class="integral"
           v-if="false">
        <div class="left">
          <b>{{language.score}}</b>
          <span>{{language.scoreTip1}}{{score}}{{language.scoreTip2}}{{scoreMoney}}{{language.yuan}}</span>
        </div>
         <van-switch  class="right"  v-model="useScore" size="25px" active-color="#f15353" inactive-color="#ffffff"  />
      </div>
      <div class="clear"></div>
      <div class="amount">
        <span>{{language.total}}
          <b>{{sourceMoney}}</b>
        </span>
        <!--直接调取微信支付接口-->

        <button type="button"
                @click='submit'>{{language.btn}}</button>

      </div>
    </div>
  </div>
</template>

<script>
import oilPay_controller from "./oilPay_controller";
export default oilPay_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.oilPaych {
  background: #fff;

  .input {
    padding-top: 13px;
    margin: 13px 13px;
    box-sizing: border-box;

    input {
      width: 96%;
      height: 35px;
      font-size: 12px;
      border-radius: 3px;
      border: 1px solid #ccc;
      padding-left: 4%;
      background: #fff;
      outline: 0;
      color: #000;
    }
  }

  .box {
    margin: 7px 7px 150px 7px;
    overflow: hidden;

    li {
      width: 33.3%;
      float: left;
      height: 80px;
      margin-bottom: 10px;

      div {
        margin: 6px 6px;
        border: 1px solid #ccc;
        height: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        padding-top: 20px;

        b {
          font-size: 22px;
          color: #666;
        }

        p {
          font-size: 10px;
          color: #999;
        }
      }

      .active {
        border: 1px solid #36d2b6;
        position: relative;

        i {
          width: 30px;
          height: 16px;
          display: inline-block;
          position: absolute;
          right: 0;
          bottom: 0;
          background:
            url(../../../../../assets/images/checkeD.png) no-repeat
            1px 0;
        }
      }

      .par {
        position: relative;
      }

      .info {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: absolute;
        top: -6px;
        left: -6px;
      }
    }
  }

  .m-footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;

    .subtotal {
      height: 40px;
      line-height: 40px;
      padding: 0 13px;
      border-bottom: 1px solid #ebebeb;
      margin: 0;

      span.left {
        font-size: 16px;
        float: left;
      }

      span.right {
        font-size: 16px;
        color: #f15353;
        float: right;
      }
    }

    .integral {
      height: 45px;
      line-height: 45px;
      padding: 0 13px;

      div.left {
        float: left;

        b {
          font-size: 16px;
          font-weight: noraml;
        }

        span {
          font-size: 14px;
        }
      }

      .right {
        float: right;
      }
    }

    .amount {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0 0 0.875rem;
      margin-bottom: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      span {
        color: #333;
        font-size: 16px;
        float: left;
      }

      button {
        width: 6.875rem;
        height: 2.8125rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: 0;
        float: left;
      }
    }
  }
}

.oilPaywei {
  background: #fff;

  .input {
    margin: 7px 13px;
    box-sizing: border-box;

    input {
      width: 96%;
      height: 35px;
      font-size: 12px;
      border-radius: 3px;
      border: 1px solid #ebebeb;
      padding-right: 4%;
      background: #fff;
      outline: 0;
      color: #000;
      text-align: right;
    }
  }

  .box {
    margin: 7px 7px 150px 7px;
    overflow: hidden;

    li {
      width: 33.3%;
      float: right;
      height: 80px;
      margin-bottom: 10px;

      div {
        margin: 6px 6px;
        border: 1px solid #ccc;
        height: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        padding-top: 20px;

        b {
          font-size: 22px;
          color: #666;
        }

        p {
          font-size: 10px;
          color: #999;
        }
      }

      .active {
        border: 1px solid #36d2b6;
        position: relative;

        i {
          width: 30px;
          height: 16px;
          display: inline-block;
          position: absolute;
          right: 0;
          bottom: 0;
          background:
            url(../../../../../assets/images/checkeD.png) no-repeat
            1px 0;
        }
      }

      .par {
        position: relative;
      }

      .info {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: absolute;
        top: -6px;
        left: -6px;
      }
    }
  }

  .m-footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;

    .subtotal {
      height: 40px;
      line-height: 40px;
      padding: 0 13px;
      border-bottom: 1px solid #ccc;
      margin: 0;

      span.left {
        font-size: 16px;
        float: right;
      }

      span.right {
        color: 12px;
        float: left;
      }
    }

    .integral {
      height: 45px;
      line-height: 45px;
      padding: 0 13px;

      div.left {
        float: right;

        b {
          font-size: 16px;
          font-weight: noraml;
        }

        span {
          font-size: 12px;
        }
      }

      .right {
        float: left;
      }
    }

    .amount {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0.875rem;
      margin-bottom: 0;
      box-sizing: border-box;

      span {
        color: #333;
        font-size: 16px;
        float: right;
      }

      button {
        width: 6.875rem;
        height: 2.8125rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: 0;
        float: left;
      }
    }
  }
}

/deep/.van-switch {
  top: 0.5rem;
}
</style>
