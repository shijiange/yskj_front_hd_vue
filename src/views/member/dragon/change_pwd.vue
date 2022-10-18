<template>
  <div id="change_pwd"
       ref="password">
    <c-title :hide="false"
             text="修改交易密码"></c-title>
    <div class="content">
      <div class="head">
        <div class="line"></div>
        <span>选择修改方式</span>
      </div>
      <div class="wrapper">
        <div class="remember"
             @click="rememberPwd"
             :class="[isActive==1?'bgOrange':'']">
          记得原交易密码
        </div>
        <div class="forget"
             @click="forgetPwd"
             :class="[isActive==2?'bgOrange':'']">
          忘记原交易密码
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import change_pwd_controller from "./change_pwd_controller";
export default change_pwd_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#change_pwd {
  background-color: #fff;

  .content {
    text-align: center;

    .head {
      margin-top: 2rem;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      margin-bottom: 3.5rem;

      .line {
        width: 0.1875rem;
        height: 0.875rem;
        background-color: #f87070;
        margin-right: 1rem;
      }

      span {
        font-size: 14px;
        color: #f86e6e;
      }
    }

    .wrapper {
      .remember {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .forget {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
  }

  .bgOrange {
    background-color: #f87070;
    color: #fff !important;
  }
}
</style>
