<template>
  <div id="high_light">
    <div class="goback">
      <van-icon name="arrow-left" class="goback_icon" @click="btnBackGo"/>
      <span class="high_light_withdrawal">{{diyname}}提现</span>
    </div>
    <div class="top">
      <div class="line name"><span class="star">*</span><span class="common_style">姓名</span>：<input type="text" v-model="name" placeholder="请输入您姓名" /></div>
      <div class="select_type">
        <span class="type_name"><span class="star">*</span>请选择证件类型: </span>
        <van-cell-group class="city-text">
          <van-cell title-style="text-align:left" center :border="false" style="border: 1px solid #757575; border-radius: 0.3125rem; height: 2rem; padding: 0 6px; position: relative;">
            <select slot="default" v-model="certificate_type" style="color: #757575; font-size: 13px;" @change="groupingSelect" @click="groupingClick">
              <!-- <option value="">请选择证件类型</option> -->
              <option :value="item.id" v-for="(item, i) in document_list" :key="i">{{ item.name }}</option>
            </select>
            <van-icon name="arrow" style="position: absolute; top: 25%; right: 0;" v-if="!grouping_info" />
            <van-icon name="arrow-down" style="position: absolute; top: 25%; right: 0;" v-if="grouping_info" />
          </van-cell>
        </van-cell-group>
      </div>
      <div class="line card"><span class="star">*</span><span class="common_style">证件号</span>：<input type="text" v-model="certificate_no" placeholder="请输入您的证件号" /></div>
      <div class="line mobile">
        <span class="star">*</span><span class="common_style">手机号</span>：<input type="number" maxlength="11" v-model="phone_number" placeholder="请输入银行卡绑定的手机号" />
      </div>
    </div>
    <div class="middle">
      <span class="bank_card_message common_style">银行卡信息</span>
      <div class="line bank_card"><span class="common_style">银行卡号：</span><input type="number" v-model="bankcard_num" placeholder="请输入您的银行卡号" /></div>
      <div class="line name"><span class="common_style">银行名称：</span><input v-model="bank_name" placeholder="请输入您的银行名称" /></div>
      <span class="tip">注：若选择提现到银行卡-{{diyname}}则必须填写银行卡信息</span>
    </div>
    <div class="bottom">
      <span class="alipay_message common_style">支付宝信息</span>
      <div class="line alipay"><span class="common_style">支付宝账户：</span><input type="number" v-model="payment_account" placeholder="请输入您的支付宝账户" /></div>
      <span class="tip">注：若选择提现到支付宝-{{diyname}}则必须填写支付宝信息</span>
    </div>
    <van-button type="danger" @click="submit">提交</van-button>
  </div>
</template>

<script>
import high_light_controller from "./high_light_controller";

export default high_light_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#high_light {
  position: relative;
  height: 100vh;

  .goback {
    height: 2rem;
    display: flex;
    align-items: center;
    background: #fff;

    .goback_icon {
      padding-left: 1rem;
      color: #666;
      font-size: 16px;
    }

    .high_light_withdrawal {
      margin: 0 auto;
      color: #666;
      font-weight: 700;
      font-size: 14px;
    }
  }

  .star {
    color: #ff062e;
  }

  .select_type {
    display: flex;
    align-items: center;

    select {
      border: none;
      width: 100%;
    }

    .type_name {
      font-weight: bold;
      margin-right: 1rem;
    }

    .van-cell-group {
      width: 60%;
    }
  }

  .top {
    background: #fff;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 0 1rem 1rem 1rem;

    input {
      border: none;
      width: 70%;
    }

    .line {
      padding: 0.5rem 0;

      .common_style {
        font-weight: bold;
      }
    }
  }

  .middle {
    display: flex;
    flex-direction: column;
    text-align: left;

    .bank_card_message {
      padding: 0.5rem 1rem;
    }

    .common_style {
      font-weight: bold;
    }

    .line {
      padding: 0.5rem 1rem;
      background: #fff;
    }

    input {
      border: none;
      width: 60%;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    text-align: left;

    .alipay_message {
      padding: 0.5rem 1rem;
    }

    .common_style {
      font-weight: bold;
    }

    .line {
      padding: 0.5rem 1rem;
      background: #fff;
    }

    input {
      border: none;
      width: 60%;
    }
  }

  .van-button--normal {
    width: 80%;
    background-color: #f15353;
    border-radius: 2.86rem;
    margin-top: 5rem;
    // position: absolute;
    // left: 10%;
    // bottom: 2.5rem;
  }

  .van-inp.van-cell {
    font-size: 16px;

    /deep/ .van-field__label {
      color: #333;
      width: auto;
    }
  }

  .tip {
    background: #fff;
    padding: 0 1rem 1rem 1rem;
    color: #ed6a6a;
    font-weight: bold;
  }
}
</style>
