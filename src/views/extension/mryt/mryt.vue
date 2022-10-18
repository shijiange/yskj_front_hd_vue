<template>
  <div id="mryt">
    <c-title :hide="false" :text="WXtitle || ''"></c-title>
    <div id="content">
      <div class="header">
        <div class="img">
          <img :src="member.avatar">
        </div>
        <ul class="name">
          <li>{{member.name}}</li>
          <li>
            <span>{{member.level}}</span>
            <span>会员ID：{{member.id}}</span>
          </li>
        </ul>
      </div>
      <div class="list_info">
        <ul>
          <li>{{rewardsData.team_rate||0}}<span>%</span></li>
          <li>{{setLang.teammanage_name || '团队管理奖'}}比例</li>
        </ul>
        <ul>
          <li>{{rewardsData.team_amount||0}}<span>{{$i18n.t('元')}}</span></li>
          <li>{{setLang.team_name || '团队奖'}}</li>
        </ul>
        <ul>
          <li>{{rewardsData.thank_amount||0}}<span>{{$i18n.t('元')}}</span></li>
          <li>{{setLang.thanksgiving_name || '感恩奖'}}</li>
        </ul>
        <ul>
          <li>{{rewardsData.rate||0}}<span>%</span></li>
          <li>{{setLang.parenting_name || '育人奖'}}比例</li>
        </ul>
        <ul>
          <li>{{rewardsData.amount||0}}<span>{{$i18n.t('元')}}</span></li>
          <li>{{setLang.referral_name || '直推奖'}}</li>
        </ul>
        <ul>
          <li>{{rewardsData.tier_amount||0}}<span>{{$i18n.t('元')}}</span></li>
          <li>{{setLang.tier_name || '平级奖'}}（{{rewardsData.tier}}层）</li>
        </ul>
      </div>
      <div class="reward_item">
        <ul class="reward">
          <li>累计总奖励</li>
          <li>{{rewardsData.all_amount}}<span>{{$i18n.t('元')}}</span></li>
        </ul>
        <div class="item_box">
          <ul v-for="(item,i) in rewardsList" @click="toReward(item)" :key='i'>
            <i class="img" :class="item.icon"></i>
            <li>{{item.reward_name}}</li>
            <li>{{item.reward_amount}}{{$i18n.t('元')}}</li>
          </ul>
        </div>
      </div>
      <!-- 添加团队数据统计 -->
      <div class="team_date">
        <ul class="title">
          <li>团队数据统计</li>
        </ul>
        <div class="list_info">
          <ul v-for="(item,i) in teamData" @click="gotoTeamDataCount(item)" :key='i'>
            <li>{{item.count?item.count:0}}<span>人</span></li>
            <li>{{item.name}}</li>
          </ul>
          <!-- <ul>
              <li>4560<span>人</span></li>
              <li>团队会员数量</li>
          </ul>
          <ul>
              <li>45<span>人</span></li>
              <li>直推总监数量</li>
          </ul>
          <ul>
              <li>456<span>人</span></li>
              <li>团队总监数量</li>
          </ul> -->
          <ul v-if="!fun.isTextEmpty(team_cost_count)" @click="gotoTeamDataCount('team_cost_count')">
            <li>{{team_cost_count.count}}<span>人</span></li>
            <li><span>{{team_cost_count.name}}</span></li>
          </ul>
        </div>
      </div>
      <!-- <div @click="gotoTeamDataCount">
        进入团队数据统计页面
      </div> -->
    </div>
  </div>
</template>

<script>
import mryt_controller from "./mryt_controller";

export default mryt_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #mryt {
    #content {
      .header {
        background: #f15353;
        display: flex;
        padding: 1.25rem 0.875rem;

        .img {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 1.75rem;
          border: solid 0.125rem #fff;
          overflow: hidden;
          margin-right: 0.625rem;

          img {
            width: 100%;
          }
        }

        .name {
          text-align: left;
          width: 17.5625rem;

          li {
            color: #fff;
            line-height: 1.75rem;
          }

          li:first-child {
            width: 60%;
            font-size: 18px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          li:last-child {
            span {
              background-color: rgba(0, 0, 0, 0.2);
              font-size: 12px;
              padding: 0.125rem 0.625rem;
              border-radius: 1rem;
              margin-right: 0.625rem;
            }
          }
        }
      }

      .list_info {
        background-color: #fff;
        padding: 0.625rem 0.875rem;
        display: flex;
        flex-wrap: wrap;

        ul:last-child {
          /* border: none; */
        }

        ul:nth-child(2n) {
          border-right: none;
          padding-left: 0.875rem;
        }

        ul:nth-child(2n+1) {
          li {
            border-right: solid 0.0625rem #ebebeb;
          }
        }

        ul {
          width: 50%;
          border-bottom: solid 0.0625rem #ebebeb;
          text-align: left;
          padding: 0.625rem 0;

          li:first-child {
            line-height: 1.875rem;
            font-size: 24px;

            span {
              font-size: 14px;
            }
          }

          li:last-child {
            line-height: 1.125rem;
            color: #8c8c8c;
            font-size: 14px;
          }
        }
      }

      .reward_item {
        background: #fff;
        margin-top: 0.625rem;

        .reward {
          line-height: 2.5rem;
          background: #fafafa;
          padding: 0 0.875rem;
          display: flex;
          justify-content: space-between;

          li {
            font-size: 16px;
            font-weight: bold;
          }

          li:last-child {
            color: #ff8b4a;
            font-size: 18px;

            span {
              font-size: 14px;
            }
          }
        }

        .item_box {
          display: flex;
          flex-wrap: wrap;
          padding: 0.875rem 0;

          ul {
            width: 33.33%;
            margin-bottom: 0.625rem;

            .img {
              display: inline-block;
              width: 3.75rem;
              height: 3.75rem;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 3.75rem 3.75rem;
              margin-bottom: 0.25rem;

              img {
                width: 3.75rem;
              }
            }

            .mryt_a {
              background-image: url("../../../assets/images/mryt_a.png");
            }

            .mryt_b {
              background-image: url("../../../assets/images/mryt_b.png");
            }

            .mryt_c {
              background-image: url("../../../assets/images/mryt_c.png");
            }

            .mryt_d {
              background-image: url("../../../assets/images/mryt_d.png");
            }

            .mryt_e {
              background-image: url("../../../assets/images/mryt_e.png");
            }

            li:nth-child(2) {
              font-size: 15px;
              line-height: 1.5rem;
            }

            li:last-child {
              color: #ff8b4a;
              font-size: 15px;
              line-height: 1.5rem;
            }
          }
        }
      }

      .team_date {
        background: #fff;
        margin-top: 0.625rem;

        .title {
          height: 2.5rem;
          line-height: 2.5rem;
          background: #fafafa;
          font-size: 16px;
          text-align: left;
          padding: 0 0.875rem;
          font-weight: bold;
        }
      }
    }
  }
</style>
