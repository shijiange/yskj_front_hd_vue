<template>
  <div id="partnership_team">
    <c-title
      :hide="false"
      :text="record_title || ' '"
    ></c-title>
    <div id="content">
      <div class="header">
        <div class="img">
          <img :src="memberInof.avatar">
        </div>
        <ul class="name">
          <li>{{memberInof.name}}[会员ID:{{memberInof.id}}]</li>
          <li><span>{{memberInof.level}}</span></li>
        </ul>
        <div class="task" @click="taskDet" v-if="is_open==1">
          <span>任务中心</span>
        </div>
      </div>
    </div>
    <div class="list_info">
      <ul>
        <li>{{all_List.nominate_prize}}<span>元</span></li>
        <li>{{all_List.nominate_prize_name}}</li>
      </ul>
      <ul>
        <li>{{all_List.team_prize}}<span>元</span></li>
        <li>{{all_List.team_prize_name}}</li>
      </ul>
      <ul>
        <li>{{all_List.team_manage_prize}}<span>%</span></li>
        <li>{{all_List.team_manage_prize_name}}</li>
      </ul>
    </div>
    <div class="reward_item">
      <ul class="reward">
        <li>累计总奖励</li>
        <li>{{all_List.all_amount}}<span>元</span></li>
      </ul>
      <div class="item_box">
        <ul v-for="(item,index) in rewards_list"
          :key="index"
          @click="RewardDet(item)">
          <i class="img" :class="item.icon"></i>
          <li>{{item.reward_name}}</li>
          <li>{{item.reward_amount}}元</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import partnership_team_controller from "./partnership_team_controller.js";

export default partnership_team_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#partnership_team {
  #content {
    .header {
      background: #f15353;
      display: flex;
      padding: 1.25rem 0.875rem;
      position: relative;

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
        position: relative;

        li {
          color: #fff;
          line-height: 1.75rem;
        }
      }

      .task {
        position: absolute;
        right: 0;
        top: 2.25rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 1rem 0 0 1rem;
        padding: 0.25rem 0.625rem;

        span {
          color: #fff;
          font-size: 12px;
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

    ul:nth-child(2n + 1) {
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
          background-image: url("../../../assets/images/mryt_e.png");
        }

        .mryt_b {
          background-image: url("../../../assets/images/mryt_g.png");
        }

        .mryt_c {
          background-image: url("../../../assets/images/mryt_b.png");
        }

        .mryt_d {
          background-image: url("../../../assets/images/mryt_f.png");
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
}

</style>
