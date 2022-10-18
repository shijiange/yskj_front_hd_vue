<template>
  <div class="page">
    <c-title :title="title"></c-title>
    <div class="header" v-if="is_self == 0">
      <div class="container">
        <div class="face">
          <img :src="avatar" alt="" />
        </div>
        <div class="desc">
          <div class="name">{{ nickname }}</div>
          <div class="level" v-if="dividend_name">{{ dividend_name }}</div>
        </div>
      </div>
    </div>
    <div class="items">
      <div class="item" v-for="item in listData" :key="item.leader_id">
        <div class="head">
          <!-- <span class="c1">活动ID：125</span> -->
          <span class="c2">开团：{{ item.created_at }}</span>
          <span class="c3" v-if="item.team_state == 1">拼团中，还差{{ item.surplus_num }}人</span>
          <span class="c3" v-else-if="item.team_state == 2">成团中</span>
          <span class="c3" v-else-if="item.team_state == 3">拼团成功</span>
          <span class="c3" v-else-if="item.team_state == 4">拼团失败</span>
        </div>
        <div class="container">
          <div class="face">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="info">
            <div class="name">{{ item.title }}</div>

            <div class="desc">
              <div class="price">￥{{ item.price }}</div>
              <div class="time" v-if="item.team_state == 1">
                还剩:
                <van-count-down :time="(item.end_time - currentTime) * 1000">
                  <template #default="timeData">
                    <span style="font-size: 0.688rem;">{{ timeData.days }}天{{ timeData.hours }}时{{ timeData.minutes }}分{{ timeData.seconds }}秒</span>
                  </template>
                </van-count-down>
              </div>
            </div>
          </div>
        </div>
        <div class="btns">
          <div class="btn btn1" v-if="pages == 'join' && item.is_vip == 0" @click="gotoOrderDetail(item.order_id)">订单详情</div>
          <div class="btn btn2" @click="gotoGroupDetails(item.leader_id)">去参加</div>
        </div>
      </div>
    </div>

    <div class="float" v-if="is_self == 1">
      <div class="btn" @click="shareWeixin">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_share.png" alt="" />
      </div>
    </div>
    <!-- 微信分享提示 -->
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import starMusicPersonalGroupController from "./star_music_personal_group_controller";

export default starMusicPersonalGroupController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  width: 23.406rem;
  height: 6.656rem;
  background-color: #ee2e2b;
  padding: 1.688rem 1.531rem 0;

  .container {
    display: flex;

    .face {
      width: 2.875rem;
      height: 2.875rem;

      img {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
      }
    }

    .desc {
      padding-left: 0.688rem;
      text-align: left;

      .name {
        font-size: 1rem;
        color: #fff;
      }

      .level {
        margin-top: 0.531rem;
        padding: 0 0.5rem;
        height: 1.25rem;
        font-size: 0.75rem;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.29);
        border-radius: 0.625rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.items {
  padding: 0.938rem;

  .item {
    width: 100%;
    height: 11.625rem;
    background-color: #fff;
    border-radius: 0.313rem;
    padding: 0.813rem 0.656rem;
    text-align: left;
    margin-bottom: 0.625rem;

    .head {
      display: flex;
      font-size: 0.625rem;
      color: #666;

      .c2 {
        margin-left: 0.5rem;
        flex: 1;
      }

      .c3 {
        color: #f14e4e;
      }
    }

    .container {
      margin-top: 1rem;
      display: flex;
      position: relative;

      .face {
        width: 4.375rem;
        height: 4.375rem;
        background-color: #666;

        img {
          width: 4.375rem;
          height: 4.375rem;
          background-color: #666;
        }
      }

      .info {
        width: 100%;
        padding-left: 0.656rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 0.8rem;
          color: #333;
        }

        .desc {
          display: flex;
          justify-content: space-between;

          .price {
            font-size: 0.938rem;
            color: #f14e4e;
          }

          .time {
            display: flex;
            align-items: center;
            font-size: 0.688rem;
            color: #333;
          }
        }
      }
    }

    .btns {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      padding-top: 2rem;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.688rem;
        height: 1.438rem;
        border-radius: 0.125rem;
        font-size: 0.813rem;
        color: #fff;
        background-color: #f14e4e;
      }

      .btn1 {
        border: solid 0.051rem #b4b4b4;
        background: #fff;
        color: #666;
        margin-right: 0.625rem;
      }
    }
  }
}

.float {
  position: fixed;
  right: 50%;
  transform: translateX(10rem);
  bottom: 5rem;

  .btn {
    width: 3.813rem;
    height: 3.813rem;
    margin-top: 0.5rem;

    img {
      width: 3.813rem;
      height: 3.813rem;
    }
  }
}
</style>
