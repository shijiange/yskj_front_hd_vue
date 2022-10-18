<template>
  <div id="bankcardinformmations">
    <c-title :hide="false" text="账户信息"></c-title>
    <div class="big_bankbox">
      <div
        class="bank_info1"
        v-for="(item, index) in list"
        :key="index"
        @click="goToEdit(item.id)"
      >
        <!-- <div class="icon_bank"></div> -->
        <div class="bank_title">
          {{ item.bankName }}
        </div>
        <div class="bank_type">
          &nbsp;{{
            item.receiverAccountType == "201" ? "对私账户" : "对公账户"
          }}
        </div>
        <div class="bank_qiu">
          {{ item.receiverAccountNoEnc }}
        </div>
      </div>
      <!-- <div class="bank_info">
        <div class="bank_title">
          中国民生银行
        </div>
        <div class="bank_type">
          &nbsp;对公账户
        </div>
        <div class="bank_qiu">
          <span>3225</span>
          &nbsp;&nbsp;●●●●
        </div>
      </div> -->
      <div class="bank_add" @click="goToAdd">
        <span>+</span>
        <span class="span_two">添加银行卡</span>
      </div>
    </div>
  </div>
</template>
<script>
import bankcardinformation_controller from "./bankcardinformation_controller.js";
export default bankcardinformation_controller;
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
  #bankcardinformmations {
    .big_bankbox {
      .bank_info1 {
        left: 0.63rem;
        top: 15.69rem;
        width: 22.31rem;
        height: 6.69rem;
        line-height: 1.25rem;
        border-radius: 0.56rem;
        background-color: #424b81;
        text-align: center;
        margin: 0 auto;
        margin-top: 28px;
        padding-top: 5px;

        .icon_bank {
          left: 1.88rem;
          top: 16.25rem;
          width: 2.31rem;
          height: 2.5rem;
        }

        .bank_title {
          margin-left: 4.19rem;
          top: 8.44rem;
          width: 11rem;
          height: 1.69rem;
          line-height: 1.44rem;
          background-color: rgba(66, 75, 129, 1);
          color: rgba(255, 255, 255, 1);
          font-size: 1rem;
          text-align: left;
        }

        .bank_type {
          margin-left: 4.25rem;
          top: 9.69rem;
          width: 4.5rem;
          height: 1.69rem;
          line-height: 1.06rem;
          background-color: rgba(66, 75, 129, 1);
          color: rgba(255, 255, 255, 1);
          font-size: 0.75rem;
          text-align: left;
        }

        .bank_qiu {
          color: #b3b7cd;
          text-align: left;
          margin-left: 4.25rem;

          span {
            font-size: 1.34rem;
          }
        }
      }

      .bank_info {
        left: 0.63rem;
        top: 15.69rem;
        width: 22.31rem;
        height: 6.69rem;
        line-height: 1.25rem;
        border-radius: 0.56rem;
        background-color: rgba(66, 134, 205, 1);
        text-align: center;
        margin: 0 auto;
        margin-top: 18px;
        padding-top: 5px;

        .bank_title {
          margin-left: 4.25rem;
          top: 16.25rem;
          width: 9.56rem;
          height: 1.25rem;
          line-height: 1.44rem;
          background-color: rgba(255, 255, 255, 0);
          color: rgba(255, 255, 255, 1);
          font-size: 1rem;
          text-align: left;
        }

        .bank_type {
          margin-left: 4.38rem;
          top: 17.31rem;
          width: 4.56rem;
          height: 1.69rem;
          line-height: 1.06rem;
          background-color: rgba(255, 255, 255, 0);
          color: rgba(255, 255, 255, 1);
          font-size: 0.75rem;
          text-align: left;
        }

        .bank_qiu {
          color: rgba(255, 255, 255, 1);
          text-align: left;
          margin-left: 4.25rem;
          font-size: 1.25rem;

          span {
            font-size: 1.34rem;
          }
        }
      }

      .bank_add {
        display: flex;
        justify-content: center;

        span {
          font-size: 2rem;
        }

        .span_two {
          font-size: 1rem;
          margin-left: 0.5rem;
        }

        margin-left: 0.06rem;
        top: 23.81rem;
        width: 23.38rem;
        height: 5rem;
        line-height: 5rem;
        color: #b6b6b6;
      }
    }
  }
</style>
