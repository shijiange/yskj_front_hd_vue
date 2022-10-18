<!-- 服务站 -->
<template>
  <div id="service_index">
    <c-title :hide="false"
             text="服务站"></c-title>
    <div class="content">
      <div class="user_box">
        <div class="user_img">
          <img :src="info.has_one_member.avatar_image">
        </div>
        <ul class="user_info">
          <li class="name">{{info.service_name}}</li>
          <li class="where">{{info.full_address}}</li>
        </ul>

      </div>
      <div class="number_box">
        <ul class="left">
          <li><span>{{$i18n.t('money')}}</span>{{info.grand_total_amount}}</li>
          <li>累计服务津贴</li>
        </ul>
        <ul class="right">
          <li><span>{{$i18n.t('money')}}</span>{{info.available_total_amount}}</li>
          <li>可{{this.fun.initWithdrawal()}}服务津贴</li>
        </ul>
        <div class="user_btn"
             @click="goMemberWithdrawal">
          <button type="button">{{this.fun.initWithdrawal()}}</button>
        </div>
      </div>
      <div class="list_box">
        <ul class="list">
          <li @click="gotoReplenishOrder">
            <i class="iconfont icon-service_replenish"></i>
            <span>补货单</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="gotoPresentationRecord">
            <i class="iconfont icon-member-withdrawals1"></i>
            <span>提成明细</span>
            <i class="fa fa-angle-right"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import serviceStation from "./index_controller";
export default serviceStation;
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
#service_index {
  .content {
    .user_box {
      background: #f15353;
      padding: 1.25rem 0.875rem;
      display: flex;
      align-items: center;
      position: relative;

      .user_img {
        width: 3.5rem;
        height: 3.5rem;
        background: #f2f2f2;
        border-radius: 1.875rem;
        border: solid 0.125rem #fff;
        overflow: hidden;
        margin-right: 0.9375rem;

        img {
          width: 100%;
        }
      }

      .user_info {
        text-align: left;
        color: #fff;

        .name {
          font-size: 18px;
          margin-bottom: 0.375rem;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .where {
          font-size: 12px;
          padding: 0.125rem 0.5rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .number_box {
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0.625rem 0;

      .left,
      .right {
        flex: 1;

        li:first-child {
          color: #f15353;
          font-size: 18px;
          line-height: 1.875rem;

          span {
            font-size: 14px;
          }
        }

        li:last-child {
          color: #8c8c8c;
          font-size: 14px;
          line-height: 1.5rem;
        }
      }

      .user_btn {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        border-left: solid 0.0625rem #ebebeb;

        button {
          width: 3.75rem;
          height: 1.875rem;
          border-radius: 0.25rem;
          background-color: #f15353;
          border: none;
          font-size: 14px;
          color: #fff;
          margin-right: 0.875rem;
          margin-top: 0.5625rem;
        }
      }
    }

    .list_box {
      background: #fff;
      margin-top: 0.625rem;

      .list {
        padding-left: 0.875rem;

        li {
          display: flex;
          height: 2.875rem;
          line-height: 2.875rem;
          padding-right: 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 16px;
          position: relative;

          .iconfont {
            margin-right: 0.375rem;
            font-size: 1.625rem;
            color: #f15353;
          }

          .fa {
            font-size: 1.5rem;
            color: #c9c9c9;
            position: absolute;
            right: 0.875rem;
            line-height: 2.875rem;
          }
        }

        li:last-child {
          border: none;
        }
      }
    }
  }
}
</style>
