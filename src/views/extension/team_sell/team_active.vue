<template>
  <div id="team_active">
    <c-title :hide="false"
             text='活跃值'></c-title>
    <van-tabs v-model="activeName"
              sticky
              @click.native="handleClick">
      <van-tab title="活跃值"
               name="0"></van-tab>
      <van-tab :title="`${item.level_name}活跃值`"
               v-for="(item,index) in levels"
               :key="index"
               :name="item.id"></van-tab>
    </van-tabs>
    <div class="content"
         v-if="activeName=='0'">
      <div class="item-list">
        <div class="item">
          <span>月活跃值</span>
          <div class="angle">
            <span class="cash">{{active.total_active}}</span>
            <i class="fa fa-angle-right"
               @click="toRecord"></i>
          </div>
        </div>
        <div class="item">
          <span>自己推广所得</span>
          <div class="angle">
            <span class="cash">{{active.self_active}}</span>
          </div>
        </div>
        <div class="item">
          <span>一级超级会员推广所得</span>
          <span class="money">{{active.first_active}}</span>
        </div>
      </div>
    </div>
    <div class="line"
         v-if="activeName=='0'"></div>
    <div class="intro"
         v-if="activeName=='0'">
      <div v-html="active_explanation"></div>
    </div>
    <div v-if="activeName=='1'">
      <div class="list-wrap">
        <div class="list"
             v-for="(item,index) in datas"
             :key="index">
          <div class="left-image"
               v-if="item.has_one_member">
            <img :src="item.has_one_member.avatar_image">
          </div>
          <div class="right">
            <div class="top">
              <span v-if="item.has_one_member">{{item.has_one_member.nickname}}</span>
              <span class="num"
                    v-if="item.has_one_active">{{item.has_one_active.total_active}}</span>
            </div>
            <div class="bottom">
              <span>{{level_name}}</span>
              <span>活跃值</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import team_active_controller from './team_active_controller';
export default team_active_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#team_active {
  height: 100vh;
  background-color: #fff;
  overflow: scroll;

  .content {
    background-color: #fff;

    .item-list {
      padding: 0 0.75rem;

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
  }

  .line {
    height: 0.625rem;
    background-color: #f2f2f9;
  }

  .intro {
    padding-top: 1rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    text-align: left;

    p {
      margin-top: 1rem;
      font-size: 12px;
      color: #666;
    }
  }

  .list-wrap {
    padding: 1rem;
    background-color: #fff;

    .list {
      display: flex;
      margin-bottom: 0.75rem;

      .left-image {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
        margin-right: 0.625rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .right {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-between;

        .top {
          display: flex;
          justify-content: space-between;
          width: 100%;

          .num {
            color: #ee2e2b;
          }
        }

        .bottom {
          color: #666;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      }
    }
  }
}
</style>
