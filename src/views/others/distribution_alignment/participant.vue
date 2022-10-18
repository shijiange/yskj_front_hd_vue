<template>
  <div id="distribution">
    <c-title :hide="false" :text="'参与人'"></c-title>
    <div class="ul"  v-if="member_list.length>0">
      <div class="li" v-for="(item,index) in member_list" :key="index">
        <div class="li-a" @click="showDetial(index)" style="padding-bottom: 0.5rem;">
          <div class="img">
            <img
              :src="item.has_one_member.avatar"
              alt=""
            />
          </div>
          <div class="name">
            {{item.has_one_member.nickname}}
          </div>
        </div>
        <div class="li-a" v-show="show_index==index">
          <div class="li-left">
            <div>{{item.has_one_reward.order_sn}}</div>
          </div>
          <div class="li-right">
            <div>佣金+{{item.has_one_reward.dividend_amount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ul" v-else style="padding-top: 4rem;">
      ~~暂无数据~~
    </div>
  </div>
</template>

<script>
import participant_controller from "./participant_controller";

export default participant_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distribution {
  background: #fff;
  min-height: 100vh;

  .ul {
    .li {
      border-bottom: 1px solid #e5e5e5;
      padding: 0.75rem;

      .li-a {
        width: 100%;
        display: flex;
        line-height: 1.5rem;
        align-items: center;

        .img {
          flex: 0 0 2.5rem;
          height: 2.5rem;
          margin-right: 0.75rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 2rem;
          }
        }

        .name {
          flex: 1;
          font-weight: 600;
          text-align: left;
        }

        .li-left {
          flex: 1;
          text-align: left;
        }

        .li-right {
          flex: 0 0 9rem;
          text-align: right;
        }
      }
    }
  }
}
</style>
