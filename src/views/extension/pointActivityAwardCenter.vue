<template>
  <div>
    <c-title :hide="false" :text="integral?integral+'活动奖励':'积分活动奖励'">
    </c-title>

    <div class="content">
      <ul class='rationList'>

        <li v-for="(item,i) in recordsList" :key='i'>
          <div class="detail">
            <div class="info">
              <ul class="left">
                <li>会员ID：{{item.member_id}}</li>
                <li>活动ID：{{item.activity_id}}</li>
                <li class="time">时间：{{item.created_at}}</li>
              </ul>
              <ul class="right">
                <li>使用者ID：{{item.give_member_id}}</li>
                <li v-show="item.money">奖励金额：+{{item.money}}</li>
                <li class="state">使用积分：-{{item.point}}</li>
              </ul>
            </div>

          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import pointActivityAwardCenter_controller from "./pointActivityAwardCenter_controller";

export default pointActivityAwardCenter_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    background: #fff;

    .rationList {
      padding: 0;
      margin: 0;

      li {
        span.month {
          display: block;
          text-align: left;
          line-height: 2.25rem;
          padding: 0 0.75rem;
          font-size: 16px;
          background: #f0f0f0;
        }

        .info {
          border-bottom: 0.0625rem solid #e2e2e2;
          overflow: hidden;
          padding: 0.625rem 0.75rem;
          line-height: 1.25rem;
          font-size: 14px;

          li {
            line-height: 1.5rem;
          }

          .time,
          .state {
            color: #8c8c8c;
            font-size: 12px;
          }

          .left {
            width: 60%;
            float: left;
            text-align: left;
            box-sizing: border-box;

            span {
              font-size: 14px;
              font-weight: 400;
              color: #333;
            }

            p {
              font-size: 12px;
              color: #999;
            }
          }

          .right {
            float: left;
            width: 40%;
            text-align: right;

            li:nth-child(2) {
              color: #20b86a;
            }

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
              color: #888;
            }
          }
        }
      }
    }
  }
</style>