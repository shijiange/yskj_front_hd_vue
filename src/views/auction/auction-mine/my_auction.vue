<template>
  <div id="my_auction" ref="my_auction">
    <c-title :hide="false" text="我的拍卖"></c-title>
        <van-tabs v-model="activeName"
        sticky
        @change="handleClick">
         <van-tab title="待开拍"
         name="0"

         ></van-tab>
         <van-tab title="竞拍中"
         name="1"
         ></van-tab>
         <van-tab title="已结束"
         name="2"
         ></van-tab>
         <van-tab title="待确认"
         name="3"
         ></van-tab>
         <van-tab title="已拍下"
         name="4"
         ></van-tab>
      </van-tabs>
      <div class="content">
          <template v-if="activeName==0||activeName==1">
              <div class="list" v-for="(item,index) in datas" :key="index" @click="toDetail(item)">
                <div class="image" v-if="item.goods" ><img :src="item.goods.thumb"></div>
                <div class="right">
                  <div class="title" v-if="item.goods">{{item.goods.title}}</div>
                  <div class="bottom">
                    <div class="cash" v-if="item.auction_goods_record"><span>当前价:</span><span>{{$i18n.t('money')}}{{item.auction_goods_record.price}}</span></div>
                    <div class="time" v-if="item.auction_goods_record"><span>{{timestampToTime(item.auction_goods_record.end_shooting)}}结束</span></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="activeName==2" >
                    <van-swipe-cell v-for="(item,index) in datas" :key="index">
                      <div class="list"  @click="toDetail(item)">
                        <div class="image" v-if="item.goods" ><img :src="item.goods.thumb"></div>
                        <div class="right">
                          <div class="title" v-if="item.goods">{{item.goods.title}}</div>
                          <div class="bottom">
                            <div class="cash" v-if="item.auction_goods_record"><span>当前价:</span><span>{{$i18n.t('money')}}{{item.auction_goods_record.price}}</span></div>
                            <div class="time" v-if="item.auction_goods_record"><span>{{timestampToTime(item.auction_goods_record.end_shooting)}}结束</span></div>
                          </div>
                        </div>
                      </div>
                  <van-button
                  style="height: 100%;"
                  slot="right"
                  square
                  text="删除"
                  type="danger"
                  class="delete-button"
                  @click="commodityDelete(index)"
                />
                </van-swipe-cell>
            </template>
            <template v-if="activeName==3">
              <div class="list" v-for="(item,index) in datas" :key="index" @click="toDetail(item)">
                <div class="image" v-if="item.goods" ><img :src="item.goods.thumb"></div>
                <div class="right">
                  <div class="title" v-if="item.goods">{{item.goods.title}}</div>
                  <div class="bottom">
                    <div class="cash" v-if="item.auction_goods_record"><span>当前价:</span><span>{{$i18n.t('money')}}{{item.auction_goods_record.price}}</span></div>
                    <div class="time" v-if="item.auction_goods_record"><span>{{timestampToTime(item.auction_goods_record.end_shooting)}}结束</span></div>
                  </div>
                </div>
                <div class="confirm" @click.stop="toBuy(item)">
                  确认下单
                </div>
              </div>
            </template>
      <!-- <div class="blank"
           v-if="datas.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import my_auction_controller from "./my_auction_controller";

export default my_auction_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_auction {
  background-color: #fff;
  height: 100vh;

  .content {
    background-color: #fff;
    padding: 0 0.75rem;
    padding-top: 0.75rem;

    .list {
      display: flex;
      margin-bottom: 0.75rem;
      position: relative;

      .image {
        display: flex;
        width: 7.9375rem;
        height: 8rem;
        border-radius: 0.3125rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.3125rem;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        flex: 1;
        justify-content: space-between;

        .title {
          text-align: left;
          font-size: 14px;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .bottom {
          text-align: left;

          .cash {
            color: #f01818;
            font-size: 12px;
          }

          .time {
            margin: 0.75rem 0;
            font-size: 12px;
            color: #999;
          }
        }
      }

      .confirm {
        width: 4rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: #f01818;
        position: absolute;
        bottom: 1rem;
        right: 0;
        border-radius: 1rem;
        font-size: 12px;
      }
    }

    .list:last-child {
      margin-bottom: 0;
    }

    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }

    .al-list {
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.75rem;

        .last {
          color: #f00;
        }
      }

      .block {
        padding-bottom: 0.75rem 0;

        .top {
          display: flex;

          .img {
            width: 4rem;
            height: 4rem;
            background-color: #f2f2f2;
            border: solid 0.0625rem #e5e5e5;
            box-sizing: border-box;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right {
            margin-left: 0.75rem;
            flex: 1;
            flex-direction: column;
            display: flex;
            justify-content: space-between;

            .tit {
              display: flex;
              justify-content: space-between;
              text-align: left;

              .na {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                align-items: center;
              }

              .money {
                color: #999;
                font-size: 12px;
              }
            }

            .bt {
              display: flex;
              justify-content: space-between;

              span {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }

        .bottom {
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .btn {
            display: flex;

            .left {
              width: 4.625rem;
              height: 1.8125rem;
              border-radius: 0.1875rem;
              border: solid 0.0625rem #cbcbcb;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 1rem;
            }

            .right {
              width: 4.625rem;
              height: 1.8125rem;
              background-color: #f53838;
              border-radius: 0.1875rem;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
