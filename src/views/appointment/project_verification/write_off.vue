<template>
  <div id="store_verification">
    <c-title text='核销'></c-title>
    <div class="bottom">
      <img :src="WriteOffData.project_thumb" alt="" />
      <div class="middle">
        <span class="project_name">{{WriteOffData.project_title}}</span>
        <div class="num">
          <span style="color: #666;">已使用次数：{{WriteOffData.used_count}}</span>
          <span>未使用次数：{{WriteOffData.rest_count}}</span>
        </div>
        <span class="verification_name">完成时间：{{WriteOffData.end_time}}</span>
      </div>
    </div>
    <div class="circle">
      <span class="left"></span>
      <span class="middle"></span>
      <span class="right"></span>
    </div>
    <div class="code">
     <canvas id="qrccode-canvas"></canvas>
    </div>
    <span class="tip">请店长或者核销员确认核销</span>
  </div>
</template>

<script>
import write_off_controller from "./write_off_controller";

export default write_off_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#store_verification {
  .bottom {
    margin: 1.11rem 1.11rem 0 1.11rem;
    background: #fff;
    padding: 1.07rem 1.11rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 5.71rem;
      height: 5.71rem;
      border-radius: 0.36rem;
    }

    .middle {
      .project_name {
        color: #333;
        font-size: 16px;
        margin: 0 0 0 0.61rem;
        text-align: left;
        font-weight: bold;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .num {
        display: flex;
        flex-direction: column;
        margin: 0.3rem 0 0.3rem 0.61rem;
        color: #ce811d;
        text-align: left;
      }

      .verification_name {
        display: flex;
        color: #9a9a9a;
        margin: 0 0 0 0.61rem;
        font-size: 12px;
      }
    }

    .rigth {
      display: flex;
      flex-direction: column;

      .num {
        color: #ce811d;
        font-size: 26px;
      }

      .verification_num {
        color: #ce811d;
        width: 4.43rem;
      }
    }
  }

  .circle {
    margin: 0 1.11rem;
    position: relative;

    .left {
      position: absolute;
      left: -15px;
      top: 0;
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #f5f5f5;
    }

    .middle {
      position: absolute;
      left: 10%;
      bottom: -17px;
      display: block;
      width: 80%;
      border: 0.04rem dashed #ce811d;
    }

    .right {
      position: absolute;
      right: -15px;
      top: 0;
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #f5f5f5;
    }
  }

  .code {
    margin: 0 1.11rem;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .code img {
    width: 14rem;
    height: 14rem;
    margin: 2rem 5rem;
  }

  .tip {
    color: #202020;
    font-size: 16px;
    padding-top: 1rem;
    display: block;
  }
}
</style>
