<template>
  <div id="signrecord">
    <c-title :hide="false" v-bind:text="sign_name + '记录'"></c-title>
    <div class="sign-records custom_color">
      <div class="top">
        <ul class="sign_a">
          <li class="date">{{ continue_days }}</li>
          <li class="total">连续{{ sign_name }}</li>
        </ul>
        <ul class="sign_b">
          <li class="date">{{ sign_total }}</li>
          <li class="total">累计{{ sign_name }}</li>
        </ul>
      </div>
      <ul class="bottom_reword">
        <li>累计获得奖励:</li>
          <li style="display: flex;text-align: center;">
          <div style="flex: 1;">{{integral || "积分"}}：{{sign_model.cumulative_point ||0.00}}</div>
          <div style="flex: 1;">优惠券：（{{sign_model.cumulative_coupon || 0}}）张</div>
        </li>
        <li style="display: flex;text-align: center;">
          <div style="flex: 1;">{{love_name || "爱心值"}}：{{sign_model.cumulative_love || 0.00}}</div>
          <div style="flex: 1;">{{love_name || "爱心值"}}返现：（{{love_return || 0.00}}）</div>
        </li>

        <!-- 改前的代码 -->
        <!-- <li>{{ cumulative }}</li> -->
      </ul>
    </div>
    <div class="list_box">
      <ul v-for="(val, key) in sign_log" class="list" :key='key'>
        <li class="list_a">
          <div style="display: flex;text-align: center;">
            <div style="flex: 1;">{{integral || "积分"}}：{{val.award_point}}</div>
            <div style="flex: 1;">优惠券：{{val.award_coupon}}</div>
          </div>
          <div style="display: flex;text-align: center;">
            <div style="flex: 1;">{{love_name || "爱心值"}}：{{val.award_love  }}</div>
            <div style="flex: 1;">{{love_name || "爱心值"}}返现：{{val.total_love_return}}</div>
          </div>
          <!-- 原来的代码 -->
          <!-- <span>{{ integral + val.award_content.substr(2) }}</span> -->
        </li>
        <li class="list_b">
          <span>{{ val.created_at }}</span>
          <span class="custom_color">{{ sign_name }}成功</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import member_signrecordcontroller from "./member_signrecordcontroller";
export default member_signrecordcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#signrecord {
  .sign-records {
    display: flex;
    flex-direction: column;
    background: #f15353;
    box-sizing: border-box;
    padding: 1.25rem 0;
    line-height: 2rem;

    /* height:5rem; */
    color: #fff;
    text-align: left;

    .top {
      display: flex;

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
    }

    .bottom_reword {
      margin-top: 0.625rem;
      padding: 0 1.25rem;

      li {
        line-height: 1.5rem;
      }
    }
  }

  .list_box {
    background: #fff;
    box-sizing: border-box;

    ul {
      /* height:3.5rem; */
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0.625rem 0.875rem;

      .list_a {
        width: 100%;
        color: #333;
        line-height: 2rem;
        text-align: left;

        .icon {
          margin-right: 0.25rem;

          img {
            background: #9c9;
            border-radius: 50%;
            width: 0.85rem;
            height: 0.85rem;
            position: relative;
            top: 0.1rem;
          }
        }
      }

      .list_b {
        display: flex;
        justify-content: space-between;

        span {
          &:nth-child(1) {
            color: #8c8c8c;
            float: left;
          }

          &:nth-child(2) {
            color: #f15353;

            /* float:right; */
          }
        }
      }
    }
  }
}
</style>
