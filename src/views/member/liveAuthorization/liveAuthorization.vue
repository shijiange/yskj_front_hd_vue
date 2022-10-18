<template>
  <div id="liveAuthorization">
    <c-title :hide="false" text="直播授权码"></c-title>
    <div class="tabsVant">
      <van-tabs v-model="active" @change="changeActive">
        <van-tab title="已购买授权码"></van-tab>
        <van-tab title="可出售授权码"></van-tab>
      </van-tabs>
    </div>
    <template v-if="active == 0">
      <div class="haveBuy" v-for="(item, index) in info" :key="index">
        <div class="BuyTop">
          <i class="iconfont icon-fontclass-maikefeng"></i>
          <span>{{ item.level_name }}</span>
        </div>
        <div class="bottom" @click="tapActivate(item)">
          <div :class="[item.type == 2 ? 'BuyBottom' : 'BuyBottomT']">{{ item.type_name }}</div>
        </div>
      </div>
    </template>
    <template v-if="active == 1">
      <div class="listCard">
        <div class="cardLis">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, ind) in info" :key="ind">
              <div class="lisbox">
                <div class="left">
                  <div class="leftTop">
                    <i class="iconfont icon-fontclass-maikefeng"></i>
                    <span>{{ item.level_name }}</span>
                  </div>
                  <div class="leftBottom">
                    <span>数量：{{ item.code_num }}</span>
                  </div>
                </div>
                <div class="right" @click="goDetail">
                  <span>明细</span>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="btnSale" v-if="info.length > 0">
          <div class="btnLeft" @click="tapSele">出售</div>
          <div class="btnRight" @click="tapCode">待收款码</div>
        </div>
      </div>
    </template>
    <van-popup v-model="saleboxShow" position="bottom" closeable>
      <div class="saleMx">
        <div class="txt">授权码出售</div>
        <div class="search">
          <van-field v-model="money" type="number" placeholder="请输入授权码出售价格（单价:元)" />
        </div>
        <div class="istxy">限单个出售</div>
        <div class="sureBtn" @click="sureBtnTap">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import liveAuthorization_controller from "./liveAuthorization_controller";
export default liveAuthorization_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#liveAuthorization {
  /deep/ .van-popup {
    background-color: transparent;
  }

  .saleMx {
    width: 100%;
    height: 15.63rem;
    background-color: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
    overflow: hidden;

    .txt {
      font-size: 1rem;
      color: #202020;
      text-align: center;
      margin-top: 1.63rem;
    }

    .search {
      width: 19.44rem;
      margin: 0 auto;
      border: solid 0.1rem #c9c9c9;
      border-radius: 0.31rem;
      margin-top: 2rem;
    }

    .istxy {
      text-align: left;
      margin-left: 1.97rem;
      font-size: 0.69rem;
      color: #f14e4e;
      margin-top: 0.59rem;
      margin-bottom: 2.7rem;
    }

    .sureBtn {
      width: 19.44rem;
      height: 2.19rem;
      background-color: #f14e4e;
      border-radius: 1.09rem;
      font-size: 0.94rem;
      color: #fff;
      text-align: center;
      line-height: 2.19rem;
      margin: 0 auto;
    }
  }

  .btnTop {
    width: 100%;
    height: 7.63rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;

    .boxBtn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      i {
        font-size: 3rem;
      }
    }
  }

  .cancel {
    height: 2.84rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }

  .haveBuy {
    margin: 0 0.94rem;
    height: 7.5rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/liveCardBj.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0.25rem;
    margin-top: 0.97rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.97rem 0.91rem 0.97rem 0.94rem;

    .BuyTop {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .icon-fontclass-maikefeng {
        font-size: 1.3rem;
        color: #fff;
      }

      span {
        margin-left: 0.3rem;
        font-size: 1.06rem;
        color: #fff;
      }
    }

    .bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .BuyBottom {
        width: 3.75rem;
        height: 1.5rem;
        background-color: #c1c1c1;
        border-radius: 0.19rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        color: #fff;
      }

      .BuyBottomT {
        width: 3.75rem;
        height: 1.5rem;
        background-color: #f22f2f;
        border-radius: 0.19rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        color: #fff;
      }
    }
  }

  .listCard {
    padding: 0.97rem 0 0 0;
    box-sizing: border-box;

    .btnSale {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      margin-top: 2.47rem;

      .btnLeft {
        width: 9.38rem;
        height: 2.06rem;
        background-color: #f14e4e;
        border-radius: 0.31rem;
        font-size: 0.94rem;
        color: #fff;
        line-height: 2.06rem;
        margin-left: 1.72rem;
      }

      .btnRight {
        width: 9.38rem;
        height: 2.06rem;
        background-color: #ec9729;
        border-radius: 0.31rem;
        font-size: 0.94rem;
        line-height: 2.06rem;
        color: #fff;
        margin-right: 1.72rem;
      }
    }

    .swiper-slide {
      width: 20.31rem;
      height: 7.5rem;
    }

    .lisbox {
      width: 20.31rem;
      height: 7.5rem;
      border-radius: 0.25rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/liveCardBj.png");
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      padding-top: 0.97rem;
      padding-left: 0.94rem;
      padding-right: 0.97rem;
      padding-bottom: 0.81rem;
      // margin-right: 0.94rem;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .leftTop {
          .icon-fontclass-maikefeng {
            font-size: 1.3rem;
            color: #fff;
          }

          span {
            margin-left: 0.3rem;
            font-size: 1.06rem;
            color: #fff;
          }
        }

        .leftBottom {
          text-align: left;
          font-size: 0.81rem;
          color: #fff;
        }
      }

      .right {
        font-size: 0.94rem;
        color: #fff;
      }
    }
  }
}
</style>
