<template>
  <div id="free_record">
    <div class="bg"></div>
    <!-- 幸运免单 -->
    <div class="free_name"><img src="../../../assets/images/free_of_charge/lucky_free.png" alt="" /></div>
    <div class="luck_draw">
      <!-- <h1>剩余抽奖次数：{{ num }}</h1> -->
      <div class="outline"><img src="../../../assets/images/free_of_charge/outline.png" alt="" /><span class="circle_blank"></span></div>
      <round-turntable
        ref="roundTurntable"
        :prizeData="prizeData"
        :rotateCircle="rotateCircle"
        :duringTime="duringTime"
        :turntableStyleOption="turntableStyleOption"
        @endRotation="endRotation"
        class="turntable"
      >
        <template slot="item" slot-scope="scope">
          <div class="turntable-name">{{ scope.item.prizeName }}</div>
        </template>
      </round-turntable>
      <div @click="startRotation" class="pointer"></div>

      <!-- 恭喜获得免单机会 -->
      <!-- <van-button type="primary" text="显示遮罩层" @click="gooodsShow = true" />
      <van-button type="primary" text="显示遮罩层" @click="oneShow = true" />
      <van-button type="primary" text="显示遮罩层" @click="show = true" /> -->
        <!-- 免单商品 -->
      <van-overlay :show="gooodsShow" @click="gooodsShow = false">
        <div class="wrapper" @click.stop style="color: #fff; position: absolute; top: 18%;">
          <img src="../../../assets/images/free_of_charge/popup.png" alt="" ></img>
          <div class="goodsDetail">
            <span class="title">恭喜获得免单机会</span>
            <span class="free_store">免单商品</span>
            <div class="goods" :style="{'justify-content': dividendList.length < 3 ?'center':''}">
              <div class="detail" v-for="(item, index) in dividendList" :key="index">
                  <img :src="item.goods.thumb" alt="">
                  <span class="introduce">{{item.goods.title}}</span>
                  <span class="num">数量:1</span>
              </div>
            </div>
          </div>
          <div class="icon_context_goods" @click="close">
            <van-icon name="circle" class="circle"/>
            <van-icon name="cross" class="cross"/>
          </div>
        </div>
      </van-overlay>

      <!-- 恭喜获得免单机会  -->
      <van-overlay :show="oneShow" @click="oneShow = false">
        <div class="wrapper" @click.stop style="color: #fff; position: absolute; top: 8%;">
          <img src="../../../assets/images/free_of_charge/popup.png" alt="" class="img_one"></img>
          <div class="oneDetail">
            <span class="title">恭喜获得免单机会</span>
            <span class="operation">完成以下任务获得免单退款</span>
            <span class="recommen"><span style="font-size: 21px;">{{taskList.limit_time}}分钟</span>内分享<span style="font-size: 20px;">{{taskList.people_num}}</span>位新人</span>
            <span class="free_store">免单商品</span>
            <div class="goods" :style="{'justify-content': dividendList.length < 3 ?'center':''}">
              <div class="detail" v-for="(item, index) in dividendList" :key="index">
                  <img :src="item.goods.thumb" alt="">
                  <span class="introduce">{{item.goods.title}}</span>
                  <span class="num">数量:1</span>
              </div>
            </div>
          </div>
          <span class="share" @click="showPopup" >立即分享</span>
          <van-popup v-model="showPopupContext"><span>请点击右上角微信分享</span><span class="determine" @click="btnShareDete">确认</span></van-popup>
          <div class="icon_context_one" @click="close">
            <van-icon name="circle" class="circle"/>
            <van-icon name="cross" class="cross"/>
          </div>
        <span class="query_task" @click="btnQueryTask">任务查询</span>
        </div>
      </van-overlay>

      <!-- 谢谢参与 -->
      <van-overlay :show="show" @click="show = false">
        <div class="wrapper" @click.stop style="color: #fff;">
          <img src="../../../assets/images/free_of_charge/popup.png" alt="" style="height: 18rem;"></img>
          <div class="detail">
            <span class="name">谢谢参与</span>
            <span class="determine" @click="close">确定</span>
          </div>
          <div class="icon_context" @click="close">
            <van-icon name="circle" class="circle"/>
            <van-icon name="cross" class="cross"/>
          </div>
        </div>
      </van-overlay>

      <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>
    </div>
  </div>
</template>

<script>
import free_lottery_controller from "./free_lottery_controller";

export default free_lottery_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#free_record {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-image: url("../../../assets/images/free_of_charge/free_bgk.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  height: 100vh;

  .bg {
    position: absolute;
    background-image: linear-gradient(0deg, #ff6d61 0%, #ffaa37 100%);
    height: 100vh;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .free_name {
    img {
      position: relative;
      left: 3%;
      top: -44%;
      width: 17.25rem;
      height: 5.75rem;
    }
  }

  .luck_draw {
    position: relative;

    .outline {
      img {
        width: 18.6rem;
        height: 18.6rem;
        position: relative;
        left: 0;
        top: -1.5rem;
      }

      .circle_blank {
        display: block;
        width: 5rem;
        height: 5rem;
        background: #fff;
        position: absolute;
        left: 36.7%;
        top: 27.8%;
        z-index: 1;
        border-radius: 50%;
      }
    }
  }

  .turntable {
    // position: absolute;
    // left: calc(50% - 200px);
    // top: calc(50% - 200px);
    // width: 400px;
    // height: 400px;
    position: absolute;
    left: calc(50% - 7.01rem);
    top: calc(50% - 8.62rem);
  }

  .turntable-name {
    position: absolute;
    left: 10px;
    top: 20px;
    width: calc(100% - 20px);
    font-size: 12px;
    text-align: center;
    color: #462f2f;
    font-weight: bold;
  }

  .turntable-img {
    position: absolute;
    left: calc(50% - 80px / 2);
    top: 60px;
    width: 80px;
    height: 80px;

    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }

  .pointer {
    position: absolute;
    // left: calc(50% - 36px);
    // top: calc(50% - 43px);
    left: 37.8%;
    top: 19.5%;
    width: 6.3rem;
    height: 6.3rem;
    background-image: url("../../../assets/images/free_of_charge/lucky_draw.png");
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 2;
  }

  .van-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .wrapper {
    img {
      width: 20rem;
      height: 22rem;
    }

    .goodsDetail {
      display: flex;
      flex-direction: column;
      position: relative;
      right: 0;
      bottom: 17rem;

      .title {
        font-size: 25px;
        margin-bottom: 1.25rem;
      }

      .operation {
        font-size: 15px;
        margin-bottom: 0.5rem;
      }

      .recommen {
        font-size: 18px;
        margin-bottom: 1.57rem;

        span {
          margin: 0 0.2rem;
        }
      }

      .free_store {
        font-size: 18px;
        margin-bottom: 0.5rem;
      }

      .goods {
        width: 16.5rem;
        height: 10.1rem;
        background-color: #fff;
        border-radius: 0.36rem;
        position: relative;
        left: 7%;
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;

        .detail {
          color: black;
          text-align: left;
          padding: 0.3rem;

          img {
            width: 5.71rem;
            height: 5.71rem;
            margin: 0;
          }

          .introduce {
            width: 5.71rem;
            color: #202020;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            word-break: break-all;
            overflow: hidden;
            margin-top: 0.3rem;
          }

          .num {
            color: #999;
          }
        }
      }
    }

    .img_one {
      width: 20rem;
      height: 29rem;
    }

    .oneDetail {
      display: flex;
      flex-direction: column;
      position: relative;
      right: 0;
      bottom: 22rem;

      .title {
        font-size: 25px;
        margin-bottom: 1.25rem;
      }

      .operation {
        font-size: 15px;
        margin-bottom: 0.5rem;
      }

      .recommen {
        font-size: 18px;
        margin-bottom: 1.17rem;

        span {
          margin: 0 0.2rem;
        }
      }

      .free_store {
        font-size: 18px;
        margin-bottom: 0.5rem;
      }

      .goods {
        width: 16.5rem;
        height: 10.1rem;
        background-color: #fff;
        border-radius: 0.36rem;
        position: relative;
        left: 7%;
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;

        .detail {
          color: black;
          text-align: left;
          padding: 0.3rem;

          img {
            width: 5.71rem;
            height: 5.71rem;
            margin: 0;
          }

          .introduce {
            width: 5.71rem;
            color: #202020;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            word-break: break-all;
            overflow: hidden;
            margin-top: 0.3rem;
          }

          .num {
            color: #999;
          }
        }
      }
    }

    .van-popup {
      color: black;
      width: 15rem;
      height: 6rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .determine {
        color: #cc5e75;
      }
    }

    .detail {
      display: flex;
      flex-direction: column;

      .name {
        position: relative;
        right: 0;
        display: block;
        bottom: 9rem;
        color: #fff;
        font-size: 24px;
      }

      .determine {
        width: 65%;
        position: relative;
        left: 16%;
        display: block;
        bottom: 6rem;
        color: #fff;
        font-size: 20px;
        background: #fad754;
        padding: 0.31rem 0;
        border-radius: 1rem;
      }
    }

    .icon_context_goods {
      position: relative;

      .circle {
        font-size: 32px;
        position: absolute;
        bottom: 34rem;
        right: 0;
      }

      .cross {
        font-size: 24px;
        position: absolute;
        bottom: 34.2rem;
        right: 0.2rem;
      }
    }

    .icon_context_one {
      position: relative;

      .circle {
        font-size: 32px;
        position: absolute;
        bottom: 45rem;
        right: 0;
      }

      .cross {
        font-size: 24px;
        position: absolute;
        bottom: 45.2rem;
        right: 0.2rem;
      }
    }

    .share {
      position: absolute;
      bottom: 33%;
      left: 6%;
      color: #fff;
      border: 1px solid #e41c34;
      padding: 0.6rem 2rem;
      background: #e41c34;
      border-radius: 0.5rem;
    }

    .query_task {
      position: absolute;
      bottom: 33%;
      right: 6%;
      color: #fff;
      border: 1px solid #e41c34;
      padding: 0.6rem 2rem;
      background: #e41c34;
      border-radius: 0.5rem;
    }

    .icon_context {
      position: relative;

      .circle {
        font-size: 32px;
        position: absolute;
        bottom: 20rem;
        right: 0;
      }

      .cross {
        font-size: 24px;
        position: absolute;
        bottom: 20.2rem;
        right: 0.2rem;
      }
    }
  }
}

.sharr-title {
  height: 3rem;
  line-height: 3.5rem;
}

.share-list {
  width: 16rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0 1rem 1rem;
  justify-content: space-between;

  .share-list-chile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 1.5rem;
    font-size: 12px;

    .share-list-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #fac337;
      line-height: 2.5rem;
      overflow: hidden;
      margin-bottom: 0.5rem;

      i {
        color: #fff;
        font-size: 20px;
      }
    }

    .color2 {
      background: #ff9329;
    }

    .color3 {
      background: #2aa7fb;
    }
  }

  .van-overlay {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

</style>
