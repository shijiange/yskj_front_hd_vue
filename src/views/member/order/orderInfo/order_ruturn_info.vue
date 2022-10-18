<template>
  <div id="ruturn_detail">
    <c-title text="归还详情"></c-title>
    <templete>
      <div class="state_time">
        <p class="state">{{ list.return_name }}</p>
        <p class="time">{{ list.return_time }}</p>
      </div>
      <div class="return_info">
        <h1>归还信息</h1>
        <ul class="info_box">
          <li>
            <span>归还押金：</span>
            <span>{{ list.deposit_total }}</span>
          </li>
          <li v-if="list.lease_express != null">
            <span>归还快递：</span>
            <span>{{ list.lease_express.express_company_name }}</span>
          </li>
          <li v-if="list.lease_express != null">
            <span>快递单号：</span>
            <span>{{ list.lease_express.express_sn }}</span>
          </li>
          <li v-if="list.lease_address != null">
            <span>联系人：</span>
            <span
              >{{ list.lease_address.realname }}&nbsp;&nbsp;&nbsp;{{
                list.lease_address.mobile
              }}</span
            >
          </li>
          <li v-if="list.lease_address != null">
            <span>归还地址：</span>
            <span>{{ list.lease_address.address }}</span>
          </li>
        </ul>
      </div>
    </templete>
    <template v-if="list.return_status == 4">
      <div class="return_info">
        <ul class="info_box">
          <li>
            <span style="width: 6rem;">实际归还押金：</span>
            <span>{{ list.return_deposit }}</span>
          </li>

          <li>
            <span>逾期扣除：</span>
            <span>{{ list.be_overdue }}</span>
          </li>
          <li>
            <span>破损扣除：</span>
            <span>{{ list.be_damaged }}</span>
          </li>
        </ul>
      </div>
      <p class="tips">提示说明:{{ list.explain }}</p>
    </template>
  </div>
</template>
<script>
import order_ruturn_info_controller from "./order_ruturn_info_controller";
export default order_ruturn_info_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #ruturn_detail {
    .state_time {
      background: #f15353;
      color: #fff;
      padding: 0.875rem;
      text-align: left;

      .state {
        font-size: 16px;
        font-weight: bold;
      }

      .time {
        font-size: 12px;
        margin-top: 0.625rem;
      }
    }

    .return_info {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.875rem;

      h1 {
        line-height: 2.25rem;
        padding-right: 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 14px;
        text-align: left;
        font-weight: normal;
      }

      .info_box {
        padding: 0.625rem 0.875rem 0.625rem 0;

        li {
          display: flex;
          font-size: 12px;
          line-height: 1.75rem;
          text-align: left;
          color: #8c8c8c;

          span:first-child {
            width: 5rem;
          }

          span:last-child {
            width: 16.6875rem;
          }
        }
      }
    }

    .tips {
      background: #fafafa;
      font-size: 12px;
      color: #8c8c8c;
      text-align: left;
      line-height: 1.125rem;
      padding: 0.625rem 0.875rem;
    }
  }
</style>
