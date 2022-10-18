<template>
  <div id="aggregate">
    <c-title :hide="false" text="入网信息"></c-title>
    <div class="agg_content">
      <div class="agg_per_inf">
        <div class="content">
          <ul>
            <li>
              <van-field v-model="subquotient" placeholder="" clearable readonly :border="false">
                <span slot="label">子商编号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="legalpersonName" placeholder="" clearable readonly :border="false">
                <span slot="label">法人姓名：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="idNumber" placeholder="" clearable readonly :border="false">
                <span slot="label">法人身份证号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="handset" placeholder="" clearable readonly :border="false">
                <span slot="label">商户法人手机：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="cardNumber" placeholder="" clearable readonly :border="false">
                <span slot="label">结算银行卡号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="networktype" placeholder="" clearable readonly :border="false">
                <span slot="label">入网类型：</span>
              </van-field>
            </li>
            <li v-if="beizhushow">
              <van-cell-group :border="false">
                <van-cell :border="false" title-class="left-van">
                  <span slot="title">审核备注：</span>
                  <span slot="default">{{ auditRemarks }}</span>
                </van-cell>
              </van-cell-group>
            </li>
          </ul>
        </div>
      </div>

      <button size="large" class="aggre_btn_disabled" type="disabled" disabled>{{ btnStatusText }}</button>
      <button
        size="large"
        class="aggre_btn_disabled"
        style="background: #04be02;"
        @click="sendCode"
        v-if="status == 0"
        type="primary"
      >
        发送授权码
      </button>
      <button
        size="large"
        class="aggre_btn_disabled"
        style="background: rgb(20, 141, 232);"
        type="primary"
        v-if="reapplyBtnshow"
        @click="reapplyBtn"
      >
        重新申请
      </button>
    </div>
    <van-popup v-model="show2" class="mint-popup-3" position="right" closeOnClickModal='true' modal='false'
              style="z-index: 2004;">
      <div class="city-info">
       <van-nav-bar left-arrow title="协议内容" fixed @click-left="popClose" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"></van-nav-bar>

        <div>
          <div
            style="height: 2.5rem;
    clear: both;
    position: absolute;
    background: #fff;
    width: 100%;"
          ></div>

          <div id="a_content" style="padding-top: 2.5rem;" v-html="protocol_content"></div>
        </div>
      </div>

    </van-popup>
  </div>
</template>

<script>
import show_apply_controller from './show_apply_controller';

export default show_apply_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#aggregate {
  .agg_content {
    background: #fff;
    padding-bottom: 40px;

    .agg_per_inf {
      .content ul li .yd-cell-box {
        // border-bottom: 1px solid #ebebeb;
        margin-bottom: 0;

        .yd-cell-item {
          padding-left: 1.5rem;

          .yd-cell-left {
            span {
              position: relative;

              .xin_icon {
                color: #f15353;
                margin-left: -1rem;
                font-size: 0.75rem;
              }
            }
          }
        }
      }
    }

    .yd-btn-block {
      width: 90%;
      margin: 1rem auto;
    }

    .aggre_btn_disabled {
      width: 90%;
      margin: 0.5rem auto;
      background-color: #ccc;
      color: #f0f0f0;
      font-size: 15px;
      height: 45px;
      border-radius: 3px;
      border: none;
    }
  }

  .city-info {
    overflow-y: scroll;
    width: 100vw;
    height: 100vh;
    background: #fff;
  }

  .mint-header {
    background: none;
    color: #666;
  }
}

#aggregate {
  .xin_icon {
    color: #f15353;
    // margin-left: -1rem;
    font-size: 0.75rem;
  }

  .van-cell {
    padding-left: 0.7188rem;
    padding-right: 0.1875rem;
  }

  /deep/.van-field__label {
    margin-right: 0;
    white-space: nowrap;
    width: auto;

    span {
      color: #333;
    }
  }

  /deep/.van-field__body input::-webkit-input-placeholder {
    color: #666;
  }

  .left-van {
    text-align: left;
    white-space: nowrap;
    flex: 0.3;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
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
