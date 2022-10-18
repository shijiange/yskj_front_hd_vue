<template>
  <div id="bonus">
    <c-title :hide="false" :text="name"> </c-title>
    <div class="topbox">
      <img src="@/assets/images/bonus_headerbanner@2x.png" alt />
    </div>
    <div class="tosTitle">
      {{ name }}总额
      <span>(元)</span>
    </div>
    <div class="moneyMun">
      <div class="minBox">
        <div class="minMun" v-for="(uip, index) in arr" :key="index">
          <!-- <span >{{uip}}</span> -->
          <countTo :startVal="0" :endVal="uip" :duration="3000"></countTo>
        </div>
      </div>
    </div>
    <div class="lovetit" v-if="love_show == true">
      <div class="leftlove">
        <span>爱心值总和:</span>
        <span>{{ love_total }}</span>
      </div>
      <div class="rightlove">
        <span>爱心值明日预计补贴:</span>
        <span>{{ love_unit }}</span>
      </div>
    </div>
    <div class="orderList">
      <div class="cenbox">
        <div class="listBox">
          <div class="title-top">贡献订单</div>
          <ul>
            <van-swipe :style="{ height: 200 + 'px' }" vertical :autoplay="4000" :show-indicators="false" height="30" :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths">
              <van-swipe-item v-for="(item, index) in redData" :key="index">
                <li>
                  <span>恭喜</span><span style="width: 4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.nick_name }}</span
                  >{{ item.price }}元订单,贡献{{ item.bonus }}元进入{{ name }}
                </li>
              </van-swipe-item>
            </van-swipe>
          </ul>
        </div>
      </div>
    </div>
    <div :style="{ height: 20 + 'rem', width: 100 + '%' }"></div>
  </div>
</template>

<script>
import bonus_controller from "./bonus_controller";

export default bonus_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#bonus {
  min-height: 100vh;
  background-color: rgb(228, 31, 31);
}

.topbox {
  width: 100%;
  height: 17rem;

  img {
    width: 100%;
    height: 100%;
  }
}

.lovetit {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1rem;

  .leftlove {
    display: flex;
    justify-content: center;
    padding: 1rem;
    border: 0.05rem solid #f09514;
    border-radius: 10px;
    background-color: #fff;
    align-items: center;
  }

  .rightlove {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 1rem;
    border: 0.05rem solid #f09514;
    border-radius: 10px;
    background-color: #fff;
  }
}

.orderList {
  width: 21.56rem;
  height: 0.66rem;
  background-color: #2a2a2a;
  box-shadow: 0 0.22rem 0.75rem 0 rgba(237, 93, 4, 0.75);
  border-radius: 0.33rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 1.69rem;

  .cenbox {
    width: 20.94rem;
    height: 0.22rem;
    background-color: #4f4f4f;
    border-radius: 0.1rem;
    margin: 0 auto;
    position: relative;

    .listBox {
      margin: 0 auto;
      position: absolute;
      top: 50%;
      left: 0.16rem;
      width: 20.63rem;
      // height: 18.03rem;
      background-color: #fff;

      .title-top {
        margin: 0 0.34rem 0 0.19rem;
        height: 2.16rem;
        border-bottom: 0.03rem solid #ccc;
        font-size: 1rem;
        color: #f77535;
        line-height: 2.16rem;
        margin-bottom: 0.84rem;
      }

      ul {
        margin: 0.5rem 1rem;
        max-height: 16rem;

        li {
          margin-bottom: 0.72rem;
          display: flex;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.tosTitle {
  width: 10rem;
  height: 2rem;
  background-color: #fff;
  box-shadow: 0 0 1rem 0 rgba(208, 16, 13, 0.75);
  border-radius: 1rem;
  color: #f77535;
  line-height: 2rem;
  font-size: 1rem;
  margin: 0 auto;
  margin-bottom: 1rem;

  span {
    font-size: 0.8rem;
  }
}

.moneyMun {
  width: 22rem;
  height: 7rem;
  background: url(../../assets/images/bonus_sum_bg@2x.png) no-repeat;
  background-size: 22rem 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  .minBox {
    height: 3rem;
    width: 20rem;
    display: flex;
    justify-content: space-between;

    .minMun {
      width: 1.84rem;
      height: 3.13rem;
      background-color: #c20b0b;
      border-radius: 0.19rem;
      border: solid 0.06rem #fff;
      line-height: 3.13rem;
      // transform: translateZ(0);
      transition: 1ms;

      span {
        font-size: 1.82rem;
        color: #fff;
      }
    }
  }
}
</style>
