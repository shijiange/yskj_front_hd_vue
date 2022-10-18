<template>
  <div id="auction_index" ref="auction_index">
    <c-title :hide="false" text="首页"></c-title>
    <div class="content">
      <div class="input">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="搜索拍卖商品"   @click="toSearch">
      </div>
      <van-swipe class="my-swipe"  indicator-color="white" :autoplay="3000">
        <van-swipe-item v-for="(item,index) in rotation" :key="index">
        <a :href="item.url">
            <img :src="item.img">
        </a>
        </van-swipe-item>
      </van-swipe>
      <div class="introduce">
        <div class="title">
          <span>推荐商品</span>
          <span class="more" @click="toMore">更多</span>
        </div>
        <div class="good-list">
          <div class="good" v-for="(item,index) in recommend" :key="index" @click="toDetail(item)">
            <div class="image" >
                <img :src="item.thumb">
            </div>
            <div class="bottom">
              <div class="tit">{{item.title}}</div>
              <div class="cash">
                  <span>起拍价</span>
                  <div class="money"><span style="font-size: 12px;">{{$i18n.t('money')}}</span><span>{{item.start_price}}</span></div>
              </div>
            </div>
            <div class="time">
                {{timestampToTime(item.end_shooting)}}结束
            </div>
          </div>
        </div>
      </div>
      <div class="new">
          <div class="title">
            <span>最新商品</span>
          </div>
          <div class="good-list">
            <div class="good" v-for="(item,index) in datas" :key="index" @click="toDetail(item)">
              <div class="image" >
                  <img :src="item.thumb">
              </div>
              <div class="bottom">
                <div class="tit">{{item.title}}</div>
                <div class="cash">
                    <span>起拍价</span>
                    <div class="money"><span style="font-size: 12px;">{{$i18n.t('money')}}</span><span>{{item.start_price?item.start_price
                      :0}}</span></div>
                </div>
              </div>
              <div class="time">
                {{timestampToTime(item.end_shooting)}}结束
            </div>
            </div>
          </div>
        </div>
    </div>
    <div class="btn" @click="toMy" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <i class="iconfont icon-home-line6"></i>
      <div>我的</div>
    </div>
  </div>
</template>

<script>
import auction_index_controller from "./auction_index_controller";

export default auction_index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_index {
  background-color: #fff;
  height: 100vh;
  position: relative;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;

    .input {
      width: 16.8125rem;
      height: 1.875rem;
      background-color: #f8f8f8;
      border-radius: 0.9375rem;
      margin: 0 auto;
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;

      i {
        color: #c9c9c9;
        margin-right: 0.75rem;
        margin-left: 0.75rem;
      }

      input {
        outline: none;
        border: none;
        color: #c9c9c9;
        font-size: 12px;
      }
    }

    .my-swipe {
      a {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        border-radius: 0.625rem;
      }
    }

    .introduce {
      margin-top: 1.25rem;

      .title {
        display: flex;
        justify-content: space-between;
        color: #000;
        font-size: 18px;

        .more {
          color: #999;
          font-size: 14px;
        }
      }

      .good-list {
        flex-wrap: wrap;
        margin-top: 1.25rem;
        display: flex;

        .good {
          width: 48%;
          margin-right: 4%;
          box-shadow: 0 0 0.4375rem 0 rgba(194, 194, 194, 0.31);
          border-radius: 0.3125rem;
          position: relative;
          margin-bottom: 1.25rem;

          .image {
            width: 100%;
            height: 10.625rem;

            img {
              width: 100%;
              height: 100%;
              border-top-left-radius: 0.3125rem;
              border-top-right-radius: 0.3125rem;
            }
          }

          .bottom {
            padding: 0 0.5rem;
            padding-top: 0.5rem;
            padding-bottom: 1rem;

            .tit {
              color: #333;
              text-align: left;
            }

            .cash {
              text-align: left;
              font-size: 12px;
              display: flex;
              margin-top: 1.125rem;
              line-height: 14px;

              .money {
                font-size: 16px;
                color: #ef3e3e;
              }
            }
          }

          .time {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0;
            left: 0;
            width: 5.4375rem;
            background-image:
              linear-gradient(
                270deg,
                #ff6333 0%,
                #ff2c29 100%
              ),
              linear-gradient(
                #fe8a02,
                #fe8a02
              );
            border-radius: 0.3125rem 0 0.3125rem;
            box-sizing: border-box;
            color: #fff;
            font-size: 12px;
          }
        }

        .good:nth-child(2n) {
          margin-right: 0;
        }
      }
    }

    .new {
      .title {
        display: flex;
        justify-content: space-between;
        color: #000;
        font-size: 18px;

        .more {
          color: #999;
          font-size: 14px;
        }
      }

      .good-list {
        flex-wrap: wrap;
        margin-top: 1.25rem;
        display: flex;

        .good {
          width: 48%;
          margin-right: 4%;
          box-shadow: 0 0 0.4375rem 0 rgba(194, 194, 194, 0.31);
          border-radius: 0.3125rem;
          position: relative;
          margin-bottom: 1.25rem;

          .image {
            width: 100%;
            height: 10.625rem;

            img {
              width: 100%;
              height: 100%;
              border-top-left-radius: 0.3125rem;
              border-top-right-radius: 0.3125rem;
            }
          }

          .bottom {
            padding: 0 0.5rem;
            padding-top: 0.5rem;
            padding-bottom: 1rem;

            .tit {
              color: #333;
              text-align: left;
            }

            .cash {
              text-align: left;
              font-size: 12px;
              display: flex;
              margin-top: 1.125rem;
              line-height: 14px;

              .money {
                font-size: 16px;
                color: #ef3e3e;
              }
            }
          }

          .time {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0;
            left: 0;
            width: 5.4375rem;
            background-image:
              linear-gradient(
                270deg,
                #ff6333 0%,
                #ff2c29 100%
              ),
              linear-gradient(
                #fe8a02,
                #fe8a02
              );
            border-radius: 0.3125rem 0 0.3125rem;
            box-sizing: border-box;
            color: #fff;
            font-size: 12px;
          }
        }

        .good:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }

  .btn {
    width: 3.5rem;
    height: 3.5rem;
    background-color: #ff2c29;
    box-shadow:
      0 0 0.1875rem 0
      rgba(237, 11, 11, 0.23);
    border: solid 0.0625rem #f51f27;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 70%;
    right: 0.9375rem;
    flex-wrap: wrap;
    font-size: 12px;
    flex-direction: column;
  }

  .pop {
    padding: 0 0.75rem;

    .check {
      display: flex;
      padding-bottom: 1rem;

      input {
        flex: 1;
        border: none;
        outline: none;
        margin-left: 1rem;
        border-bottom: solid 1px #ccc;
      }
    }

    .title {
      font-size: 18px;
      padding: 1.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .bottom-btn {
      height: 2.8125rem;
      background-image:
        linear-gradient(
          #ff2c29,
          #ff2c29
        ),
        linear-gradient(
          #ff590f,
          #ff590f
        );
      background-blend-mode:
        normal,
        normal;
      border-radius: 1.4375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      margin-top: 6.25rem;
    }
  }
}

.pcStyle {
  right: 30% !important;
  transform: translateX(-50%);
}
</style>
