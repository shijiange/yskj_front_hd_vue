<template>
  <div class="page">
    <c-title text="奖励记录"></c-title>

    <div class="screen">
      <div class="name" @click="screenShow=!screenShow">
        <div class="text">筛选</div>
        <i class="iconfont icon-ht_more_bottom" :class="{'active':screenShow}"></i>
      </div>
      <div class="screenItems" :class="{'active':screenShow}">
        <div class="screenContainer">
          <div class="screenItem" :class="{'active':item.id==labelId}" v-for="item in labels" :key="item.id"
               @click="setLabelId(item.id)">
            {{item.name}}
          </div>
        </div>

      </div>
    </div>

    <div class="items">
      <div class="item" v-for="item in listData" :key="item.order_sn">
        <div class="head">
          <span class="c1">活动ID：{{item.activity_id}}</span>
          <span class="c2">订单号：{{item.order_sn}}</span>
          <span class="c3">{{item.reward_type_name}}</span>
        </div>
        <div class="container">
          <div class="face">
            <img :src="item.thumb" alt="">
          </div>
          <div class="info">
            <div class="name">{{item.title}}</div>
            <div class="reward">奖励：{{item.money}}{{item.reward_method_name}}</div>
            <div class="time">{{item.created_at}}</div>
          </div>
          <div class="status">{{item.settlement_type_name}}</div>
        </div>
      </div>
    </div>

    <div class="blank" v-if="listData.length<=0">
      <img src="../../../assets/images/blank.png">
      <span>没有数据</span>
    </div>


    <!-- <van-popup v-model="screenShow" position="right" :style="{ width: '60%' }" >
      <div class="srceenContainer">





        <div class="botBtns">
          <div class="btn reset" >取消</div>
          <div class="btn confirm" >确定</div>
        </div>
      </div>
    </van-popup> -->


  </div>
</template>

<script>
import starMusicRewardsRecordController from "./star_music_rewards_record_controller";

export default starMusicRewardsRecordController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background: #f2f2f2;
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .items {
    padding: 0.938rem;

    .item {
      width: 100%;
      height: 7.969rem;
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

          .reward {
            color: #f14e4e;
            font-size: 0.75rem;
          }

          .time {
            font-size: 0.625rem;
            color: #999;
          }
        }

        .status {
          position: absolute;
          right: 0;
          bottom: 0.1rem;
          color: #f14e4e;
          font-size: 0.688rem;
        }
      }
    }
  }

  .screen {
    height: 2rem;
    position: relative;
    background: #fff;

    .name {
      padding: 0 1.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .icon-ht_more_bottom {
        transition: 0.5s;
      }

      .icon-ht_more_bottom.active {
        transform: rotate(180deg);
      }
    }

    .screenItems {
      position: absolute;
      top: 100%;
      width: 100%;
      background: #fff;
      box-shadow: 1px 4px 4px rgba(0, 0, 0, 0.1);
      z-index: 1;
      height: 0;
      overflow: hidden;
      transition: 0.5s;

      &.active {
        height: 6.2rem;
      }

      .screenContainer {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 4.063rem);
        grid-template-rows: repeat(2, 1.688rem);
        grid-row-gap: 1rem;
        justify-content: space-between;
        padding: 1rem 0.938rem;

        .screenItem {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #666;
          border: 0.063rem solid #666;
          transition: 0.5s;

          &.active {
            color: #f14e4e;
            border-color: #f14e4e;
            background: #feeded;
          }
        }
      }
    }
  }

</style>