<template>
  <div id="power_sell">
    <c-title :hide="false"
             :text='plugin_name'></c-title>
    <div class="avator">
      <div class="left">
        <img :src="member.avatar_image">
      </div>
      <div class="right">
        <div class="top">
          {{member.nickname}}
        </div>
        <div class="bottom">
          <div><span style="color: #666;">累计金额</span><span style="color: #ff2c29;">{{$i18n.t('money')}}{{total_amount}}</span>
          </div>
          <div class="btn" @click="toExtension">提现</div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="content">
      <div class="item">
        <div class="left">
          <i class="iconfont icon-energetankshop_myequipment"></i>
          <span>我的设备</span>
        </div>
        <div @click="toequ">
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <i class="iconfont icon-energetankshop_shopinformation"></i>
          <span>店铺信息</span>
        </div>
        <div>
          <i class="iconfont icon-advertise-next"
             @click="toStore"></i>
        </div>
      </div>
      <!-- <div class="item">
        <div class="left">
          <i class="iconfont icon-energetankshop_memberinformation"></i>
          <span>会员信息</span>
        </div>
        <div>
          <i class="iconfont icon-advertise-next"
             @click="toMember"></i>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import power_sell_controller from './power_sell_controller';
export default power_sell_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_sell {
  height: 100vh;
  background-color: #fff;

  .avator {
    padding: 1rem;
    display: flex;

    .left {
      width: 4.3125rem;
      height: 4.3125rem;
      box-sizing: border-box;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .right {
      flex: 1;
      margin-left: 1.375rem;
      flex-direction: column;
      justify-content: center;
      text-align: left;

      .top {
        font-size: 16px;
        margin-bottom: 1.25rem;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn {
          width: 3.125rem;
          height: 1.5625rem;
          background-color: #ffe7e7;
          border-radius: 0.8125rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff2c29;
        }
      }
    }
  }

  .line {
    height: 0.625rem;
    background-color: #f5f7fa;
  }

  .content {
    padding: 0 1.3125rem;
    padding-top: 1.3125rem;
    background-color: #fff;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;

      .left {
        display: flex;
        align-items: center;

        i {
          font-size: 22px;
          color: #ff2c29;
        }

        span {
          margin-left: 1rem;
        }
      }

      .icon-advertise-next {
        font-size: 22px;
      }
    }
  }
}
</style>
