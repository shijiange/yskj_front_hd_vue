<template>
  <div id="auction_more" ref="auction_more">
    <c-title :hide="false" text="推荐拍品"></c-title>
    <div class="content">
        <div class="input">
            <i class="iconfont icon-sousuo"></i>
            <input type="text" placeholder="搜索拍卖商品" @click="toSearch">
          </div>
          <div class="good-list">
            <div class="good" v-for="(item,index) in datas" :key="index" @click="toDetail(item)">
              <div class="image">
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
</template>

<script>
import auction_more_controller from "./auction_more_controller";

export default auction_more_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_more {
  background-color: #fff;
  height: 100vh;

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
</style>
