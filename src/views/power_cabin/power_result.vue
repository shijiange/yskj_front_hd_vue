<template>
  <div id="power_result">
    <c-title :hide="false"
             text='检测结果'></c-title>
    <div class="top">
      <div class="now">
        <div class="result">本次检测结果</div>
        <div class="time">2020.9.30 11:05:36</div>
      </div>
      <div class="icon">
        <i class="iconfont icon-energetank_battle"></i>
      </div>
      <div class="up">
        <div class="result">上次检测结果</div>
        <div class="time">2020.9.30 11:05:36</div>
      </div>
    </div>
    <div class="content">
      <div class="left-list">
        <div class="list">
          <div class="name">血压</div>
          <div class="amount"><span class="num">128/88</span><span class="txt">mmHg</span></div>
        </div>
        <div class="list">
          <div class="name">血压</div>
          <div class="amount"><span class="num">128/88</span><span class="txt">mmHg</span></div>
        </div>
      </div>
      <div class="line">

      </div>
      <div class="right-list">
        <div class="list">
          <div class="name">血压</div>
          <div class="amount"><span class="num">128/88</span><span class="txt">mmHg</span></div>
        </div>
        <div class="list">
          <div class="name">血压</div>
          <div class="amount"><span class="num">128/88</span><span class="txt">mmHg</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import power_result_controller from './power_result_controller';
export default power_result_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_result {
  height: 100vh;
  background-color: #fff;

  .top {
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .now {
      display: flex;
      flex-direction: column;

      .result {
        font-size: 16px;
      }

      .time {
        color: #ccc;
        font-size: 12px;
        margin-top: 0.5rem;
      }
    }

    .up {
      display: flex;
      flex-direction: column;

      .result {
        font-size: 16px;
      }

      .time {
        color: #ccc;
        font-size: 12px;
        margin-top: 0.5rem;
      }
    }

    .icon {
      width: 2.5625rem;
      height: 2.5625rem;
      background-image: linear-gradient(-60deg, #ff8a66 0%, #ff4946 100%);
      box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 50%;

      i {
        font-size: 24px;
      }
    }
  }

  .content {
    display: flex;
    padding: 0 1.5rem;
    justify-content: space-between;

    .line {
      width: 0.3125rem;
      background-color: #f5f7fa;
    }

    .left-list {
      .list {
        margin-top: 1rem;
        width: 8.75rem;
        height: 5.875rem;
        background-color: #fff;
        box-shadow: 0 0 0.9375rem 0 rgba(0, 0, 0, 0.04);
        border-radius: 0.6875rem;
        box-sizing: border-box;
        padding-top: 1rem;
        padding-left: 1rem;
        padding-bottom: 1.4375rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;

        .amount {
          .num {
            font-size: 18px;
            color: #ff4946;
          }

          .txt {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    .right-list {
      .list {
        margin-top: 1rem;
        width: 8.75rem;
        height: 5.875rem;
        background-color: #fff;
        box-shadow: 0 0 0.9375rem 0 rgba(0, 0, 0, 0.04);
        border-radius: 0.6875rem;
        box-sizing: border-box;
        padding-top: 1rem;
        padding-left: 1rem;
        padding-bottom: 1.4375rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;

        .amount {
          .num {
            font-size: 18px;
            color: #ffc66c;
          }

          .txt {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
