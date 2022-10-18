<template>
  <div id="cloudRelease">
    <c-title :hide="false" :text="'云仓释放'"> </c-title>
    <div class="top_a">
      <div class="top_a_a">
        <img :src="member.avatar_image" alt="" />
        <span>{{ member.realname }}</span>
      </div>
      <div class="top_b">已释放总额 {{ $i18n.t('money') }}{{ info.total_dividend_amount }}</div>
    </div>
    <div style="height: 0.63rem; background-color: #ebebeb;"></div>
    <van-tabs v-model="active" @click="tabChange">
      <van-tab title="解冻记录"></van-tab>
      <van-tab title="待释放记录"></van-tab>
    </van-tabs>
    <div class="line"></div>
    <template v-if="active == 0">
      <div class="lis" v-for="(item, index) in list" :key="index" @click="tapDetail(item.id)">
        <div class="lis_left">
          <span style="font-size: 0.81rem; color: #333; margin-bottom: 0.75rem;">ID:{{ item.id }}</span>
          <span style="font-size: 0.75rem; color: #8c8c8c;">{{ item.created_at }}</span>
        </div>
        <div class="lis_right">+{{ item.dividend_amount }}</div>
      </div>
    </template>
    <template v-if="active == 1">
      <div class="list" v-for="(item, index) in list" :key="index" @click="tapDetail(item.id,item)">
        <div class="li">
          <div class="li_l">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="li_r">
            <div class="li_r_t">
              {{ item.title }}
            </div>
            <div class="li_r_b">
              <div class="num">待释放数量：{{ item.total_buy_log }}</div>
              <div class="li_r_b_r">查看详情 <van-icon name="arrow" /></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import cloudRelease_controller from './cloudRelease_controller';

export default cloudRelease_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#cloudRelease {
  .line {
    border-top: solid 1px #f2f2f2;
  }

  .list {
    width: 100%;
    height: 6.72rem;
    background: #fff;

    .li {
      height: 100%;
      padding: 0.88rem 0.94rem 1.47rem 0.91rem;
      border-bottom: solid 1px #f2f2f2;
      display: flex;
      justify-content: flex-start;

      .li_l {
        width: 4.38rem;
        height: 4.38rem;
        margin-right: 0.66rem;

        img {
          width: 4.38rem;
          height: 4.38rem;
        }
      }

      .li_r {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .li_r_t {
          font-size: 0.88rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
          line-height: 1.13rem;
        }

        .li_r_b {
          display: flex;
          justify-content: space-between;

          .num {
            font-size: 0.75rem;
            color: #333;
          }

          .li_r_b_r {
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            color: #ee2e2b;
          }
        }
      }
    }
  }

  .lis {
    width: 100%;
    height: 3.94rem;
    background: #fff;
    padding: 0.88rem 0.94rem 1rem 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: #f2f2f2 1px solid;

    .lis_left {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .lis_right {
      font-size: 1rem;
      color: #f15353;
    }
  }

  .top_a {
    width: 100%;
    height: 6.66rem;
    background: #ee2e2b;
    display: flex;
    align-items: center;
    padding-left: 1.56rem;
    padding-right: 1.56rem;
    position: relative;

    .top_b {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.75rem;
      background: #f14e4e;
      padding-left: 1.56rem;
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      color: #fff;
    }

    .top_a_a {
      display: flex;

      img {
        width: 2.88rem;
        height: 2.88rem;
        background-color: #000;
        margin-right: 0.63rem;
        border-radius: 50%;
      }

      span {
        font-size: 1rem;
        color: #fff;
      }
    }
  }
}
</style>