<template>
  <div id="pickup">
    <c-title :hide="false" :text="''"> </c-title>
    <div class="pickdetail">
      <div class="pto">
        <img :src="info.thumb" alt="" />
      </div>
      <div class="title">{{ info.title }}</div>
      <div class="kuc">
        <div class="ku">可用库存{{ goods_id ? info.deposit_stock : info.seal_stock }}</div>
        <van-stepper v-model="sum" theme="round" button-size="22" @change="onChange" />
      </div>
    </div>
    <div class="btn">
      <div class="fcbtn" @click="shiftTo" v-if="info.allow_transfer == 1">转入封存区</div>
      <div class="none_btn" v-if="info.allow_transfer == 0">无转入封存区</div>
      <div
        class="kd"
        @click="goOrder(info.id, '-2', 1)"
        v-if="info.dispatch_type[0] == '1' || info.dispatch_type[1] == '1'"
      >
        快递
      </div>
      <div
        class="ztd"
        @click="goOrder(info.id, '-2', 8)"
        v-if="info.dispatch_type[0] == '8' || info.dispatch_type[1] == '8'"
      >
        自提点
      </div>
    </div>
  </div>
</template>

<script>
import pickup_controller from './pickup_controller';

export default pickup_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#pickup {
  background: #fff;
  overflow: hidden;
  min-height: 120vh;

  .btn {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .none_btn {
      // width: 5.656rem;
      height: 1.875rem;
      background-color: #bab9b9;
      border-radius: 0.94rem;
      font-size: 0.813rem;
      line-height: 1.875rem;
      color: #fff;
      padding: 0 0.81rem;
    }

    .fcbtn {
      width: 5.656rem;
      height: 1.875rem;
      background-color: #f14e4e;
      border-radius: 0.938rem;
      font-size: 0.813rem;
      line-height: 1.875rem;
      color: #fff;
    }

    .kd {
      width: 5.656rem;
      height: 1.875rem;
      background-color: #fcbb4b;
      border-radius: 0.938rem;
      font-size: 0.813rem;
      color: #fff;
      line-height: 1.875rem;
    }

    .ztd {
      width: 5.656rem;
      height: 1.875rem;
      background-color: #509bfc;
      border-radius: 0.938rem;
      line-height: 1.875rem;
      font-size: 0.813rem;
      color: #fff;
    }
  }

  .pickdetail {
    margin: 0 auto;
    margin-top: 60px;
    width: 20.313rem;
    height: 25.719rem;
    background-color: #fff4f4;
    border-radius: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .kuc {
      width: 17.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.156rem;

      .ku {
        font-size: 0.75rem;
        color: #333;
        line-height: 1.125rem;
      }
    }

    .pto {
      width: 17.5rem;
      height: 17.469rem;
      background-color: #e7e7e7;
      border-radius: 0.625rem;
      margin-top: 1.375rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.625rem;
      }
    }

    .title {
      width: 17.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 0.938rem;
      margin-top: 0.938rem;
      text-align: left;
    }
  }
}
</style>
