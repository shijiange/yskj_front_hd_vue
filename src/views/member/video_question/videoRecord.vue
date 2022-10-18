<template>
  <div id="record">
    <c-title :hide="false" :text="'答题记录'"> </c-title>
    <div class="contenBox">
      <div class="lis" v-for="(item,index) in info" :key="index" @click="toList(item.id)">
        <div class="left">
          <span class="timeTxt">答题时间</span>
          <span class="time">{{item.created_at}}</span>
        </div>
        <div class="right">
          <span class="timeTxt">得分</span>
          <span class="score">{{item.score}}分</span>
        </div>
        <van-icon name="arrow" style="margin-right: 0.5rem;" color="#5d5d5d" />
      </div>
    </div>
  </div>
</template>

<script>
import videoRecord_controller from "./videoRecord_controller";
export default videoRecord_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.contenBox {
  padding: 0.938rem 0.906rem;

  .lis {
    width: 100%;
    height: 3.75rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 0.313rem;
    margin-bottom: 0.5rem;
  }

  .left {
    flex: 0.6;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.5rem;

    .timeTxt {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.75rem;
    }

    .time {
      font-size: 0.75rem;
      color: #202020;
    }
  }

  .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .timeTxt {
      margin-bottom: 0.3rem;
      color: #666;
      font-size: 0.75rem;
    }

    .score {
      font-size: 0.875rem;
      color: #ee2e2b;
    }
  }
}
</style>