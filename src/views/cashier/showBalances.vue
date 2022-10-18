<template>
  <div id="balance_recharge">
    <c-title :hide="false"  text="支付奖励"></c-title>
    <van-popup v-model="show" :close-on-click-overlay="false" :overlay="true">
      <div class="red-popup">
        <img src="../../assets/images/pay_success_redenvelope@2x.png" alt="" />
        <div class="pop-text">
          <span class="tip">{{payTitle?payTitle:"恭喜获得支付奖励"}}</span>
          <span class="money">{{price}}<span class="yuan">{{$i18n.t('元')}}</span></span>
          <span class="sure-btn" @click="goSubmit">确定</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import showBalances_controller from "./showBalances_controller";
export default showBalances_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .red-popup {
    width: 17rem;
    margin: 0 auto;
    position: relative;

    .pop-text {
      color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 3rem;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-left: 0.5rem;
    }

    .tip {
      color: #fff;
      font-size: 1.5rem;
      padding-top: 1rem;
      padding-bottom: 1.5rem;
    }

    .money {
      font-size: 2.5rem;
      color: #fff;
      padding-bottom: 3rem;

      .yuan {
        font-size: 1rem;
      }
    }

    .sure-btn {
      width: 10rem;
      margin: 0 auto;
      height: 2.5rem;
      background-image: linear-gradient(#7307bf, #ac0ae9, #7307bf);
      text-align: center;
      color: #fff;
      line-height: 2.5rem;
      font-size: 1.2rem;
      border-radius: 1rem;
    }

    img {
      width: 100%;
    }
  }

  .van-popup {
    background-color: transparent;
  }
</style>
