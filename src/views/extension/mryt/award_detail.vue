<template>
  <div id="award_detail">
    <c-title :hide="false" :text="'分红详情'"></c-title>
    <div id="content">
      <ul class="price">
        <li>{{rewardDetail.amount}}<span>{{$i18n.t('元')}}</span></li>
      </ul>
      <ul class="list-info">
        <li>
          <span>类型</span>
          <span>{{rewardDetail.type_name}}</span>
        </li>
        <li>
          <span>分红时间</span>
          <span>{{rewardDetail.created_at}}</span>
        </li>
        <li v-if="rewardDetail.log_id">
          <span>销售佣金ID</span>
          <span>{{rewardDetail.log_id}}</span>
        </li>
        <li>
          <span>{{name}}</span>
          <span v-if="rewardDetail.has_one_source_member">{{rewardDetail.has_one_source_member.nickname}}</span>
        </li>
        <li v-if="rewardDetail.log_amount">
          <span>销售佣金金额（{{$i18n.t('元')}}）</span>
          <span>{{rewardDetail.log_amount}}</span>
        </li>
        <li v-if="rewardDetail.level_team_award_amount">
          <span>等级奖励金额（{{$i18n.t('元')}}）</span>
          <span>{{rewardDetail.level_team_award_amount}}</span>
        </li>
        <li v-if="rewardDetail.lower_level_team_award_amount && type!=='thanks'">
          <span>下级会员奖励金额（{{$i18n.t('元')}}）</span>
          <span>{{rewardDetail.lower_level_team_award_amount}}</span>
        </li>
        <li v-if="rewardDetail.team_amount">
          <span>下级团队管理奖（{{$i18n.t('元')}}）</span>
          <span>{{rewardDetail.team_amount}}</span>
        </li>
        <li v-if="rewardDetail.parenting_ratio">
          <span>育人奖比例</span>
          <span>{{rewardDetail.parenting_ratio}}%</span>
        </li>
        <li v-if="rewardDetail.amount">
          <span v-if="type !== 'immediate'">奖励金额（{{$i18n.t('元')}}）</span>
          <span v-if="type === 'immediate'">直推奖励金额（{{$i18n.t('元')}}）</span>
          <span>{{rewardDetail.amount}}</span>
        </li>
        <li v-if="rewardDetail.award_ratio">
          <span>分红比例</span>
          <span>{{rewardDetail.award_ratio}}%</span>
        </li>
        <li v-if="rewardDetail.lower_award_ratio">
          <span>下级会员提成比例</span>
          <span>{{rewardDetail.lower_award_ratio}}%</span>
        </li>
        <li>
          <span>状态</span>
          <span>{{rewardDetail.status_name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import award_detail_controller from "./award_detail_controller";

export default award_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #award_detail {
    #content {
      background-color: #fff;

      .price {
        line-height: 4.5rem;
        font-size: 32px;
        font-weight: bold;

        span {
          font-size: 16px;
        }
      }

      .list-info {
        padding: 0.625rem 0.875rem;

        li {
          display: flex;
          justify-content: space-between;
          line-height: 2.25rem;
          font-size: 15px;

          span:first-child {
            color: #8c8c8c;
          }
        }

        li:last-child {
          span:last-child {
            color: #00b566;
          }
        }
      }
    }
  }
</style>
