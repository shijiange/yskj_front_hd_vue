<template>
  <div id="stockholder_bonus">
    <c-title :hide="false"
             :text="info.weighted_name||''"></c-title>
    <div class="header"
         v-if="info">
      <div class="left">
        <img :src="info.avatar">
      </div>
      <div class="right">
        <div class="top">
          <span>{{info.nickname}}</span>
          <span class="button">{{info.level_name}}</span>
        </div>
        <div class="bottom">
          <span>累计金额：{{$i18n.t('money')}}{{info.money}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        分红记录
      </div>
      <div class="list-wrap">
        <div class="list"
             v-for="(item,i) in datas"
             :key='i'>
          <div class="top">
            <span>分红ID:{{item.id}}</span>
            <span class="cash">{{item.personal_money}}元</span>
          </div>
          <div class="bottom">
            <span>{{item.created_at}}</span>
            <span>业绩比例：{{item.proportion}}%</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import stockholder_bonus_controller from "./stockholder_bonus_controller";

export default stockholder_bonus_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#stockholder_bonus {
  .header {
    width: 100%;
    padding-top: 1.625rem;
    padding-bottom: 1.625rem;
    padding-left: 1.625rem;
    background-color: #ee2e2b;
    display: flex;

    .left {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 50%;
      margin-right: 0.75rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .right {
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;

      .top {
        font-size: 16px;
        display: flex;
        align-items: center;

        .button {
          padding: 0 0.5rem;
          height: 1.25rem;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 0.625rem;
          font-size: 12px;
          margin-left: 0.375rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .bottom {
        font-size: 12px;
      }
    }
  }

  .content {
    .title {
      font-size: 16px;
      color: #000;
      background-color: #fff;
      padding-top: 0.875rem;
      padding-left: 1rem;
      text-align: left;
    }

    .list-wrap {
      .list {
        padding: 1rem;
        background-color: #fff;
        margin-bottom: 0.375rem;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .cash {
            color: #ff2c29;
          }
        }

        .bottom {
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
