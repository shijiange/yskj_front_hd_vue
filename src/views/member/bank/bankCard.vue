<template>
  <div id="bank_card">
    <c-title :hide="false" :text="'绑定银行卡'"></c-title>
    <div id="content" v-if="bank_status !== 1">
      <p>请填写绑定银行卡卡号</p>
      <ul class="info">
        <li>
          <span>卡号</span>
          <input type="tel" v-model="bank_num" placeholder="请输入银行卡号">
        </li>

      </ul>
      <div class="btn">
        <button type="button" @click="submitBank">提交</button>
      </div>
    </div>
    <div id="content1" v-if="bank_status === 1">
      <div class="bank">
        <p>银行卡号：</p>
        <p>{{return_bank}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import bankCard_controller from "./bankCard_controller";

export default bankCard_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #bank_card {
    #content {
      p {
        margin-top: 0.625rem;
        color: #8c8c8c;
        line-height: 2.25rem;
        text-align: left;
        padding-left: 0.875rem;
        font-size: 15px;
      }

      .info {
        background: #fff;

        li {
          display: flex;
          font-size: 16px;
          height: 3.125rem;
          padding: 0 0.875rem;
          line-height: 3.125rem;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;

          span {
            width: 6.25rem;
            text-align: left;
          }

          input {
            border: none;
            width: 15.4375rem;
          }
        }
      }

      .btn {
        margin-top: 1.5rem;

        button {
          border: none;
          width: 21.6875rem;
          height: 2.875rem;
          border-radius: 0.375rem;
          background: #04be02;
          color: #fff;
          font-size: 18px;
        }
      }
    }

    #content1 {
      p {
        color: #fff;
        line-height: 2.25rem;
        text-align: center;
        padding-top: 0.5rem;
        font-size: 18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .bank {
        width: 90%;
        height: 11rem;
        margin: 0.5rem auto;
        background-image: url(../../../assets/images/card_bg.png);
        background-repeat: no-repeat;
        background-size: 100% 60%;
      }
    }
  }
</style>