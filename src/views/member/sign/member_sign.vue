<template>
  <div id="sign">
    <c-title
      :hide="false"
      v-bind:text="sign_name"
      tolink="signrules"
      :totext="`${sign_name}说明`"
    ></c-title>

    <div class="sign-header custom_color">
      <ul class="sign_a">
        <li class="date">{{ continue_days }}</li>
        <li class="total">连续{{ sign_name }}</li>
      </ul>
      <ul class="sign_b">
        <li class="date">{{ sign_total }}</li>
        <li class="total">累计{{ sign_name }}</li>
      </ul>
      <div class="btn" @click="signnow" :style="{lineHeight:sign_name.length>2?'1rem':'',paddingTop:sign_name.length>2?'.5rem':''}">
        {{ sign_status ? "已" + sign_name : "未" + sign_name }}
      </div>
    </div>
    <router-link :to="fun.getUrl('signrecord')">
      <div class="record">
        <span>累计{{sign_name}}奖励记录</span>
        <i class="fa fa-angle-right"></i>
      </div>
    </router-link>
    <date :signlog="sign_log"></date>
  </div>
</template>
<script>
import member_signcontroller from "./member_signcontroller";
export default member_signcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#sign {
  .sign-header {
    display: flex;
    background: #f15353;
    box-sizing: border-box;
    padding: 1.25rem 0;
    line-height: 3rem;
    position: relative;

    .sign_a,
    .sign_b {
      width: 8.5rem;

      li {
        line-height: 2rem;
        padding-left: 1.25rem;
        text-align: left;
        color: #fff;
      }

      .date {
        font-size: 20px;
      }

      .total {
        font-size: 14px;
        opacity: 0.8;
      }
    }

    .yicon {
      position: absolute;
      z-index: 100;
      right: 0.7rem;
      top: -0.7rem;
    }

    span {
      color: #fff;
    }

    .btn {
      width: 3.75rem;
      height: 3.75rem;
      background: #fff;
      border: solid 0.375rem rgba(249, 186, 186, 1);
      border-radius: 50%;
    }
  }

  .record {
    display: flex;
    justify-content: space-between;
    height: 2.875rem;
    line-height: 2.875rem;
    background: #fff;
    text-align: left;
    color: #333;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 0.875rem;
    margin-bottom: 0.625rem;

    i {
      line-height: 2.5rem;
      font-size: 1.5rem;
      color: #c9c9c9;
    }

    .icon {
      display: inline-block;
      width: 0.55rem;
      height: 0.55rem;
      border: solid 0.0625rem #000;
      border-left: transparent;
      border-bottom: transparent;
      transform: rotate(45deg);
      float: right;
      margin-top: 0.3rem;
    }
  }
}
</style>
