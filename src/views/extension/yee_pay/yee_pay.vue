<template>
    <div id="yee_pay">
        <div class="pay_value">
            <van-field v-model="name" label="姓名:"  placeholder="请输入您的姓名" class="van-inp" label-width/>
            <van-field v-model="cer_code" label="身份证:" placeholder="请输入您的身份证号" class="van-inp"/>
            <van-field v-model="mobile" label="手机号:" type="tel" placeholder="请输入银行卡绑定的手机号" class="van-inp"/>
            <van-field v-model="bank_code" label="银行卡号:" type="number" placeholder="请输入您的银行卡号" class="van-inp"/>
        </div>
        <van-button type="danger" @click="submit">提交</van-button>
    </div>
</template>
<script>
import yeePay from "./yee_pay.js";
export default yeePay;
</script> 
<style lang="scss" rel="stylesheet/scss" scoped>
  #yee_pay {
    position: relative;
    height: 100vh;

    .pay_value {
      background: #fff;
    }

    .van-button--normal {
      width: 100%;
      background-color: #f15353;
      border-radius: 2.86rem;
      position: absolute;
      left: 0;
      bottom: 2.5rem;
    }

    .van-inp.van-cell {
      font-size: 16px;

      /deep/ .van-field__label {
        color: #333;
        width: auto;
      }
    }
  }
</style>

