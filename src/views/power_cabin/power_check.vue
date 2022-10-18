<template>
  <div id="power_check">
    <c-title :hide="false"
             text='检测记录'></c-title>
    <div class="content">
      <div class="item">
        <div class="left">
          <div class="top">
            2020/12/30
          </div>
          <div class="bottom">
            12:25:36
          </div>
        </div>
        <div class="btn"
             @click="toResult">
          检测结果
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import power_check_controller from './power_check_controller';
export default power_check_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_check {
  height: 100vh;
  background-color: #fff;

  .content {
    padding: 0 1.25rem;
    background-color: #fff;

    .item {
      padding: 1.625rem 0;
      display: flex;
      border-bottom: solid 1px #f5f7fa;
      justify-content: space-between;
      align-items: center;

      .left {
        text-align: left;

        .bottom {
          margin-top: 0.375rem;
        }
      }

      .btn {
        width: 4.6875rem;
        height: 1.875rem;
        background-image: linear-gradient(-60deg, #ff8a66 0%, #ff4946 100%), linear-gradient(#03ddc8, #03ddc8);
        background-blend-mode: normal, normal;
        box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
        border-radius: 0.9375rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }
}
</style>
