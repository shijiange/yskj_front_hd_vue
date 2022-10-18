<template>
  <div id="power_cancellation">
    <c-title :hide="false"
             text='核销记录'></c-title>
    <div class="without"
          v-if="datas.length<=0">
      <div class="img">
        <img src="../../assets/images/energytank_blankhexiao@2x.png">
      </div>
      <p class="no-message">暂无核销记录</p>
    </div>
    <div class="content">
      <div class="item-list">
        <div class="item"
             v-for="(item,index) in datas"
             :key="index">
          <div class="left">
            <div class="top"
                 v-if="item.has_one_energy_cabin_dealer">
              <span>{{item.has_one_energy_cabin_dealer.shop_name}}</span>

            </div>
            <div class="bottom">
              {{item.created_at}}
            </div>
          </div>
          <div class="num">
            -1
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import power_cancellation_controller from './power_cancellation_controller';
export default power_cancellation_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_cancellation {
  height: 100vh;
  background-color: #fff;

  .without {
    padding-top: 2.5rem;
    text-align: center;

    .img {
      width: 19.1875rem;
      height: 12.75rem;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .no-message {
      margin-top: 2.125rem;
      color: #999;
    }

    .without-btn {
      width: 18.75rem;
      height: 2.5rem;
      background-image: linear-gradient(0deg, #ff8a66 0%, #ff4946 84%), linear-gradient(#03ddc8, #03ddc8);
      background-blend-mode: normal, normal;
      box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
      border-radius: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
      margin-top: 2.5rem;
    }
  }

  .content {
    padding: 0 0.75rem;

    .item-list {
      .item {
        padding: 0.75rem 0;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #f5f7fa;
        align-items: center;

        .left {
          .top {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            margin-left: 0.625rem;

            .id {
              margin-left: 0.75rem;
              width: 4.8125rem;
              height: 1rem;
              background-color: #ffe3e3;
              border-radius: 0.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ff9493;
              font-size: 12px;
            }
          }

          .bottom {
            color: #999;
            text-align: left;
            margin-left: 0.625rem;
          }
        }

        .num {
          color: #ff2c29;
          font-size: 16px;
          margin-right: 0.625rem;
        }
      }
    }
  }
}
</style>
