<template>
  <div class="page">
    <c-title text="开团列表"></c-title>
    <div class="h2">以下小伙伴拼团中，可直接参与</div>
    <div class="listData">
      <div class="item" v-for="item in listData" :key="item.leader_id">
        <div class="face">
          <img :src="item.avatar" alt="">
        </div>
        <div class="desc">
          <div class="c1">{{ item.nickname }} 开 <span class="text">{{item.limit_num}}</span>人团</div>
          <div class="c2" style="display: flex; align-items: center;">
            剩余
            <van-count-down :time="(item.end_time-currentTime)*1000">
              <template #default="timeData">
                <div style="display: flex; text-align: center; color: #f15353; font-size: 12px;">
                  <span class="block">{{timeData.days}}</span>
                  <span class="colon" style="margin: 0 0.1rem;">天</span>
                  <span class="block">{{ timeData.hours }}</span>
                  <span class="colon" style="margin: 0 0.1rem;">:</span>
                  <span class="block">{{ timeData.minutes }}</span>
                  <span class="colon" style="margin: 0 0.1rem;">:</span>
                  <span class="block">{{ timeData.seconds }}</span>
                </div>

              </template>
            </van-count-down>
            结束，仅差<span class="text">{{item.surplus_num}}</span>人
          </div>
        </div>
        <div class="btns">
          <div class="btn" @click="gotoGroupDetails(item.leader_id)">去参团</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import starMusicListGroupController from "./star_music_list_group_controller";

export default starMusicListGroupController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .h2 {
    padding: 1rem 0;
    font-size: 0.75rem;
    color: #666;
  }

  .listData {
    padding: 0 0.906rem;

    .item {
      margin-bottom: 1.563rem;
      display: flex;
      text-align: left;

      .face {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #999;
        border-radius: 50%;

        img {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #999;
          border-radius: 50%;
        }
      }

      .desc {
        padding-left: 0.594rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;

        .c1 {
          font-size: 0.938rem;
        }

        .c2 {
          font-size: 0.688rem;
        }

        .text {
          color: #f15353;
        }
      }

      .btns {
        display: flex;
        align-items: flex-end;

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          width: 4.375rem;
          height: 1.688rem;
          background-color: #f14e4e;
          border-radius: 0.125rem;
        }
      }
    }
  }

</style>