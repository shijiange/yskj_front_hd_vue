<template>
  <div id="gasCosts">
    <c-title :hide="false" text='燃气费'></c-title>

    <div class="telep">
      <p>
        <span>用户编号</span>
        <input type="text" name="" value="请输入户号">
      </p>
    </div>

    <div class="content">
      <form action="" method="" class="form">
        <div class="form-group">
          <label class="form-help" for="">缴费单位</label>
          <div class="form-controler">{{company}}
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'" @click="chooseCompony"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'" @click="chooseCompony"></i>
          </div>
        </div>
        <div class="form-group">
          <label class="form-help" for="">缴费金额</label>
          <input class="form-controler" type="text" name="" :placeholder="language.placeMoney" v-model="sourceMoney">
        </div>
      </form>
    </div>

    <van-popup
      v-model="popupVisible"
      position="bottom">
      <div class="popUp">
        <div class="title"><span class="left" @click="chooseCompony">取消</span> 缴费单位 <span class="right"
                                                                                          @click="chooseCompony">确定</span>
        </div>
        <van-picker :columns="slots" @change="onValuesChange"/>


      </div>

    </van-popup>

    <div class="m-footer">
      <p class="subtotal"><span>商品小计</span> <span>{{$i18n.t("money")}}{{sourceMoney}}</span></p>
      <div class="clear"></div>
      <div class="integral">
        <div>
          <b>积分</b> <span>可用&nbsp;<font>{{score}}</font>&nbsp;积分，抵扣&nbsp;<font>{{scoreMoney}}</font>&nbsp;元</span>
        </div>
        <van-switch :class="{rt:$store.state.service.lang=='ch',lf:!$store.state.service.lang=='wei'}"
                    v-model="useScore" active-color="#f15353" inactive-color="#fff"/>
      </div>
      <div class="clear"></div>
      <div class="amount">
        <span>合计<b>{{computedMoney}}</b></span>
        <router-link :to="fun.getUrl('')">
          <button type="button">提交订单</button>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import gasCosts_controller from "./gasCosts_controller";

export default gasCosts_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #gasCosts {
    .telep {
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;
      padding: 0.625rem 0.875rem;
      background: #fff;

      p {
        input {
          padding-bottom: 0.625rem;
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #8c8c8c;
          font-size: 24px;
          border-bottom: solid 0.0625rem #ebebeb;
        }

        span {
          display: block;
          line-height: 1.875rem;
          text-align: left;
          font-size: 14px;
        }
      }
    }

    .content {
      background: #fff;

      .form {
        background-color: #fff;
        margin-top: 0.625rem;
        font-size: 16px;
        padding-left: 0.875rem;

        .form-group {
          padding-right: 14px;
          height: 2.8125rem;
          border-top: 0.0625rem solid #ebebeb;
          display: -webkit-flex; /* Safari */
          display: flex;
          flex-flow: row;

          .form-help {
            width: 6.25rem;
            height: 2.8125rem;
            line-height: 2.8125rem;
            text-align: left;
          }

          .form-controler {
            color: #8c8c8c;
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

        .form-group:first-child {
          border: none;
        }
      }
    }

    .popUp {
      width: 100%;
      background: #fff;

      .title {
        height: 2.8125rem;
        line-height: 2.8125rem;
        border-bottom: 0.0625rem solid #f3f5f7;
        padding: 0 0.9375rem;

        .left {
          float: left;
        }

        .right {
          float: right;
          color: #1bba9e;
        }
      }

      ul {
        li {
          height: 1.875rem;
          line-height: 1.875rem;
          border-top: 0.0625rem solid #ebebeb;
          text-align: left;
          margin: 0 0.9375rem;
        }
      }
    }

    .m-footer {
      width: 100%;
      background: #fff;
      position: fixed;
      bottom: 0;

      .subtotal {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.8125rem;
        margin: 0;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: left;
        }

        span:last-child {
          font-size: 16px;
          color: #f15353;
          float: right;
        }
      }

      .integral {
        border-top: 0.0625rem solid #ebebeb;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding-right: 0.875rem;
        margin-left: 0.875rem;

        div {
          float: left;

          b {
            color: #333;
            font-size: 16px;
            font-weight: noraml;
            margin-right: 0.625rem;
          }

          span {
            color: #333;
            font-size: 14px;
          }

          font {
            color: #f15353;
          }
        }
      }

      .amount {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0 0 0.875rem;
        margin-bottom: 0;
        box-sizing: border-box;
        border-top: solid 0.0625rem #ebebeb;

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
          float: right;
        }
      }
    }

    .van-switch {
      float: right !important;
      top: 0.5rem;
    }
  }
</style>
