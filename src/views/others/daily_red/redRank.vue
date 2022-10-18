<template>
  <div id="redRank">
    <c-title :hide="false" :text="'红包排名'"></c-title>
    <van-tabs v-model="active" title-active-color="#f8aa3d" @change="bindChange" >
      <van-tab title="今日排名"></van-tab>
      <van-tab title="本月排名"></van-tab>
      <van-tab title="总排名"></van-tab>
    </van-tabs>
    <div class="list">
      <template v-for="(item, ind) in list">
        <div :class="[ind == 0 ? 'lisone' : 'lis']" :key="ind">
          <div class="left">
            <div class="no" style="color: #f63b2c;">{{ ind < 10 ? `0${ind + 1}` : ind }}</div>
            <div class="name">
              <div class="nickname" v-if="item.member">{{ item.member.nickname }}</div>
            </div>
            <div class="txt">抢红包获得</div>
            <template v-if="ind == 0">
              <div class="topOne" v-if="active == 2">冠军</div>
              <div class="topOne" v-else>今{{ active == 0 ? "日" : "月" }}最佳</div>
            </template>
          </div>
          <div class="right">{{ $i18n.t("money") }}{{ item.amount_total }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import redRank_controller from "./redRank_controller";
export default redRank_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#redRank {
  background-color: #fff;
  min-height: 100vh;

  /deep/ .van-tabs__line {
    background-color: #f9ab3e !important;
  }

  .list {
    margin-top: 0.53rem;
    background-color: #fff;

    .left {
      flex: 1;
      display: flex;
      align-items: center;

      .topOne {
        height: 1.25rem;
        border-radius: 0.63rem;
        border: solid 0.03rem #f63b2c;
        padding: 0.28rem;
        font-size: 0.69rem;
        color: #f15353;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .txt {
        font-size: 0.81rem;
        color: #333;
        margin-right: 0.34rem;
      }

      .name {
        font-size: 0.81rem;
        color: #ff8828;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 5.47rem;
        margin-left: 0.72rem;
        margin-right: 0.56rem;

        .nickname {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .no {
        font-size: 0.94rem;
      }
    }

    .right {
      text-align: right;
      font-size: 1rem;
      color: #f9ab3e;
    }

    .lis {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.16rem 1rem;
      border-bottom: 1px solid #f2f2f2;
    }

    .lisone {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.16rem 1rem;
      border-bottom: 1px solid #f2f2f2;
      background-image: linear-gradient(0deg, #feebe9 0%, #fffaf9 100%);
    }
  }
}
</style>
