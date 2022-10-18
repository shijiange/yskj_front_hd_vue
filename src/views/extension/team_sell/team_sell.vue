<template>
  <div id="team_sell">
    <c-title :hide="false"
             :text="set.name"></c-title>
    <div class="header">
      <div class="avator">
        <img :src="member.avatar_image" />
      </div>
      <div class="right">
        <div class="top">
          <span>{{ member.nickname }}</span>
        </div>
        <div class="bottom">
          <span>{{ level.level_name }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="item-list">
        <div class="item"
             v-if="is_activation == '1'">
          <span>激活权限</span>
          <i class="fa fa-angle-right"
             @click="toLimit"></i>
        </div>
        <div class="item">
          <span>活跃值</span>
          <div class="angle">
            <span class="cash" v-if="active">{{ active }}</span>
            <i class="fa fa-angle-right"
               @click="toActive"></i>
          </div>
        </div>
        <div class="item">
          <span>累积总金额</span>
          <span class="money" v-if="total_amount">{{$i18n.t('money')}}{{ total_amount }}</span>
           <span class="money" v-else>{{$i18n.t('money')}}0.00</span>
        </div>
      </div>
        <div class="income-one">
         <div class="title">
          <span>预估收益</span>
          <i class="fa fa-angle-right" @click="toPredict"></i>
         </div>
         <div class="content">
           <div class="cash">{{$i18n.t('money')}}{{month_amount}}</div>
           <div>本月返利收益</div>
         </div>
      </div>
      <div class="income-two">
         <span>佣金结算</span>
      </div>
      <div class="commsion-list">
           <div class="list">
          <div class="left">
            <span class="top">{{ last_month_amount }}</span>
            <span class="bottom">上个月结算佣金</span>
          </div>
          <div class="right"
               >
            <span class="top" v-if="total_settle_amount">{{$i18n.t('money')}}{{ total_settle_amount }}</span>
             <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">累计已结算佣金</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.self_ratio }}%</span>
            <span class="bottom">{{ set.self_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('4')">
            <span class="top" v-if="self_amount">{{$i18n.t('money')}}{{ self_amount }}</span>
             <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.self_name }}</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.first_ratio }}%</span>
            <span class="bottom">{{ set.first_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('0')">
            <span class="top" v-if="first_amount">{{$i18n.t('money')}}{{ first_amount }}</span>
            <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.first_name }}</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.recommend_ratio }}%</span>
            <span class="bottom">{{ set.referral_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('1')">
            <span class="top" v-if="recommend_amount">{{$i18n.t('money')}}{{ recommend_amount }}</span>
            <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.referral_name }}</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.team_ratio }}%</span>
            <span class="bottom">{{ set.team_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('2')">
            <span class="top" v-if="team_amount">{{$i18n.t('money')}}{{ team_amount }}</span>
             <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.team_name }}</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.non_team_ratio }}%</span>
            <span class="bottom">{{ set.non_team_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('3')">
            <span class="top" v-if="non_team_amount">{{$i18n.t('money')}}{{ non_team_amount }}</span>
            <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.non_team_name }}</span>
          </div>
        </div>
        <div class="list">
          <div class="left">
            <span class="top">{{ level.extra_ratio }}%</span>
            <span class="bottom">{{ set.extra_name }}比例</span>
          </div>
          <div class="right"
               @click="toDetail('5')">
            <span class="top" v-if="extra_amount">{{$i18n.t('money')}}{{ extra_amount }}</span>
            <span class="top" v-else>{{$i18n.t('money')}}0.00</span>
            <span class="bottom">{{ set.extra_name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import team_sell_controller from './team_sell_controller';
export default team_sell_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#team_sell {
  .header {
    padding-top: 1.625rem;
    padding-left: 1.625rem;
    padding-bottom: 1.625rem;
    background-color: #ee2e2b;
    display: flex;

    .avator {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.75rem;

      .top {
        font-size: 16px;
        color: #fff;
        text-align: left;
      }

      .bottom {
        width: 4.25rem;
        height: 1.25rem;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 0.625rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 12px;
      }
    }
  }

  .content {
    .item-list {
      .item {
        padding: 1rem;
        background: #fff;
        border-bottom: solid 1px #ededed;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;

        i {
          font-size: 18px;
        }

        .money {
          color: #ee2e2b;
          font-size: 16px;
          margin-right: 0.75rem;
        }

        .angle {
          .cash {
            display: inline-block;
            color: #ee2e2b;
            font-size: 16px;
            margin-right: 0.75rem;
          }

          i {
            font-size: 18px;
          }
        }
      }

      .item:last-child {
        border-bottom: none;
      }
    }

    .income-one {
      margin-top: 0.625rem;
      background: #fff;

      i {
        font-size: 18px;
      }

      .title {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1.0016px #ededed;
      }

      .content {
        padding: 1.4375rem 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        color: #666;

        .cash {
          color: #ee2e2b;
          font-size: 16px;
          margin-bottom: 0.8125rem;
        }
      }
    }

    .income-two {
      padding: 1rem;
      margin-top: 0.625rem;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 1.0016px #ededed;
    }

    .commsion-list {
      .list {
        margin-top: 0.625rem;
        padding: 1.4375rem 0;
        display: flex;
        background: #fff;

        .left {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .top {
            font-size: 16px;
            color: #ee2e2b;
            margin-bottom: 0.875rem;
          }
        }

        .right {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .top {
            font-size: 16px;
            color: #ee2e2b;
            margin-bottom: 0.875rem;
          }
        }
      }

      .list:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
