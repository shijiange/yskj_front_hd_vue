<template>
  <section id="page">
    <c-title :hide="false"
             :text="dataObj.froze_name"
             tolink="LookDetailsCoin"
             :totext="`${income_name_text}明细`"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="my_balance">
        <li class="balance_a">
          <i class="iconfont icon-wealth-b"></i>
          <span>我的{{ dataObj.froze_name }}（元）</span>
        </li>
        <li class="balance_b">{{ dataObj.thaw }}</li>
        <li class="balance_c">
          冻结{{ dataObj.froze_name }}{{ dataObj.froze }}元
        </li>
      </ul>
      <ul class="list_box">
        <li @click="routeTake(1)">
          <i class="iconfont icon-balance_b"></i>充值<i class="fa fa-angle-right"></i>
        </li>
        <li @click="routeTake(3)">
          <i class="iconfont icon-balance_a"></i>{{this.fun.initWithdrawal()}}<i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
    <section id="frozen-b"
             v-if="
        !fun.isTextEmpty(dataObj.explain_content) &&
          !fun.isTextEmpty(dataObj.explain_title)
      ">
      <h1>{{ dataObj.explain_title }}</h1>
      <p v-html="dataObj.explain_content"></p>
    </section>
  </section>
</template>

<script>
import frozen_coin_controller from "./frozen_coin_controller.js";
export default frozen_coin_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
#page {
  .content {
    .my_balance {
      background: #fff;
      padding: 0.625rem 0;

      .balance_a {
        line-height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-wealth-b {
          background:
            url("../../../assets/images/member/member_a(7).png")
            no-repeat center;
          background-size: 1.125rem;
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.375rem;
        }

        .icon-wealth-b::before {
          content: "";
        }

        span {
          font-size: 14px;
        }
      }

      .balance_b {
        line-height: 3.75rem;
        font-size: 36px;

        small {
          font-size: 24px;
        }
      }

      .balance_c {
        font-size: 14px;
        color: #8c8c8c;
      }
    }

    .list_box,
    .list_box_b {
      background: #fff;
      padding-left: 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;

      li {
        border-bottom: solid 0.0625rem #ebebeb;
        padding-right: 0.875rem;
        display: flex;
        align-items: center;
        line-height: 2.875rem;
        font-size: 16px;
        position: relative;

        .icon-balance_a {
          color: #6cbf6a;
        }

        .icon-balance_b {
          color: #fac337;
        }

        .icon-balance_c {
          color: #069ce7;
        }

        .icon-balance_l {
          color: #ee4343;
        }

        .icon-balance_m {
          color: #418be0;
        }

        .icon-balance_n {
          color: #ff855c;
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.375rem;
        }

        .fa {
          position: absolute;
          top: 0;
          right: 0.875rem;
          font-size: 1.5rem;
          color: #ccc;
          line-height: 2.875rem;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .list_box_b {
      margin-top: 0.625rem;
    }

    .explain {
      width: 100%;
      position: fixed;
      display: flex;
      justify-content: center;
      bottom: 0.625rem;

      i {
        font-size: 1.125rem;
        color: #658299;
        margin-right: 0.375rem;
      }

      span {
        color: #658299;
        font-size: 13px;
      }
    }
  }

  #frozen-b {
    background-color: #fff;
    margin-top: 0.625rem;

    h1 {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.875rem;
      text-align: left;
      font-size: 16px;
      border-bottom: solid 0.0625rem #ebebeb;
    }

    p {
      padding: 0.625rem 0.875rem;
      line-height: 1.5rem;
      font-size: 14px;
      text-align: left;
    }
  }
}
</style>
