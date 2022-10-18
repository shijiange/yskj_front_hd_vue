<template>
  <div id="hotel_goods">
    <c-title :hide="false" text="商品详情"></c-title>
    <div id="content">
      <div class="scroll_banner">
          <van-swipe
            :autoplay="3000"
            style="width: 100%; height: 100%;"
            :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
          v-if="goods_info" >
            <van-swipe-item>
              <img v-if="goods_info.room_type.image_1" :src="goods_info.room_type.image_1" />
            </van-swipe-item>
            <van-swipe-item>
              <img v-if="goods_info.room_type.image_2" :src="goods_info.room_type.image_2" />
            </van-swipe-item>
            <van-swipe-item>
              <img v-if="goods_info.room_type.image_3" :src="goods_info.room_type.image_3" />
            </van-swipe-item>
          </van-swipe>
      </div>
      <div class="banner_top">
        <div id="hoid" @click="goBack">
          <div id="back">
            <i class="iconfont icon-member-left"></i>
          </div>
        </div>
        <div id="cart" @click="gotoHome">
          <div id="back">
            <i class="iconfont icon-ai-home"></i>
          </div>
        </div>
        <div id="member" @click="gotoMember">
          <div id="back">
            <i class="iconfont icon-wode-wode"></i>
          </div>
        </div>
      </div>
      <div class="info_a" v-if="goods_info.room_type">
        <div class="title-box">
          <h1 style=" -webkit-box-orient: vertical;">
            {{ goods_info.room_type.name}}
          </h1>
        </div>
        <ul class="price">
          <li>
            <span
            >{{$i18n.t('money')}}<font>{{ goods_info.minPrice }}</font>起</span
            >房价以当天价格为准
          </li>
        </ul>
      </div>
      <div class="content_b">
        <ul class="time" v-if="goods_info.nextPriceArr&&goods_info.nextPriceArr.length>0">
          <li class="time_a"
              @click="show1 = true">
            {{ fun.isTextEmpty(start) ? "请选择入住日期" : start
            }}<span>入住</span>
          </li>
          <li class="time_b"
              v-if="!fun.isTextEmpty(end)">
            <span>{{ night_day }}晚</span>
          </li>
          <li class="time_c"
              @click="show2 = true">
            {{ fun.isTextEmpty(end) ? "请选择离店日期" : end }}<span>离开</span>
          </li>
        </ul>
      </div>
      <div class="info_c" v-if="goods_info.room_type">
        <van-tabs @click="itemClick">
          <van-tab label="商品介绍">
            <img style="width: 100%;" v-if="goods_info.room_type.image_1" :src="goods_info.room_type.image_1" />
            <img style="width: 100%;" v-if="goods_info.room_type.image_2" :src="goods_info.room_type.image_2" />
            <img style="width: 100%;" v-if="goods_info.room_type.image_3" :src="goods_info.room_type.image_3" />
          </van-tab>
        </van-tabs>
      </div>
      <div
        class="goods_foot"
        :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '' }"
        v-if="goods_info.nextPriceArr"
      >
        <ul class="foot_a">
          <li>
            <i class="iconfont icon-goods_kefu" @click="gotoService"></i>
            <span>客服</span>
          </li>
        </ul>
        <button type="button" @click="ordertBtn">立即预定</button>
      </div>
    </div>
    <!-- 时间弹窗 -->
    <van-popup v-model="show1"
               position="bottom"
               :overlay="true"
               style="position: fixed; height: 80%;">
      <date-picker type="入住"
                   :top="false"
                   :nextpricearr="goods_info.nextPriceArr"
                   @timeChange="acceptTime"
                   @close="close"></date-picker>
    </van-popup>
    <van-popup v-model="show2"
               position="bottom"
               :overlay="true"
               style="position: fixed; height: 80%;">
      <date-picker type="离店"
                   :top="false"
                   :nextpricearr="goods_info.nextPriceArr"
                   @timeChange="acceptTime"
                   @close="close"></date-picker>
    </van-popup>
  </div>
</template>

<script>
import controller from "./hotelSupplyGoods_controller";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #hotel_goods {
    padding-bottom: 60px;

    #content {
      position: relative;

      .scroll_banner {
        background: #f8f8f8;
        overflow: hidden;
        height: 12.5rem;

        img {
          width: 100%;
        }
      }

      .banner_top {
        position: absolute;
        top: 0;

        #hoid {
          padding: 0.3125rem;
          width: 1.6rem;
          position: fixed;
          z-index: 2;
        }

        #cart {
          padding: 0.3125rem;
          width: 1.6rem;
          position: fixed;
          z-index: 2;
          box-sizing: content-box;
        }

        #member {
          padding: 0.3125rem;
          width: 1.6rem;
          position: fixed;
          z-index: 2;
          box-sizing: content-box;
        }

        #cart {
          right: 0;
        }

        #member {
          right: 2rem;
        }

        #hoid.hoet {
          transition: 0.1s;
          background: rgba(0, 0, 0, 0.2);
          width: 100%;
        }

        #back {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 100%;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.4);
          text-indent: 0;
          line-height: 1.7rem;
          overflow: hidden;
        }
      }

      .info_a {
        background: #fff;
        padding: 0.625rem 0.875rem;

        .title-box {
          display: flex;

          h1 {
            flex: 3;
            text-align: left;
            color: #333;
            font-size: 16px;
            line-height: 1.5rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-weight: bold;
          }

          i {
            font-size: 1.125rem;
            color: #666;
            margin-left: 1rem;
            line-height: 1.5rem;
          }
        }

        .price {
          li {
            font-size: 14px;
            color: #8c8c8c;
            text-align: left;
            line-height: 1.875rem;
            margin-top: 0.625rem;

            span {
              color: #f15353;
              margin-right: 0.625rem;
              font-weight: bold;

              font {
                font-size: 20px;
              }
            }
          }
        }
      }

      .content_b {
        background: #fff;
        padding: 0.625rem 0;
        margin-top: 0.625rem;

        h1 {
          padding: 0 0.875rem;
          text-align: left;
          font-size: 16px;
          line-height: 2.5rem;

          span {
            color: #8c8c8c;
            font-size: 14px;
            margin-left: 0.625rem;
            font-weight: normal;
          }
        }

        .time {
          width: 21.5625rem;
          height: 2.75rem;
          margin: 0 auto;
          border-radius: 0.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time_a,
          .time_c {
            font-size: 16px;
            font-weight: bold;

            span {
              font-size: 12px;
              margin-left: 0.375rem;
              color: #8c8c8c;
              font-weight: normal;
            }
          }

          .time_b {
            span {
              font-size: 13px;
              border: solid 0.0625rem #ebebeb;
              border-radius: 1rem;
              padding: 0.125rem 0.625rem;
            }
          }
        }
      }

      .goods_foot {
        background: #fff;
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 3.0625rem;

        .foot_a {
          width: 25%;

          li {
            // padding: 0.25rem 0;
            border-top: solid 0.0625rem #ebebeb;

            i {
              font-size: 1.375rem;
              color: #666;
            }

            .icon-collect-active {
              color: #f7ba2a;
            }

            span {
              display: block;
              font-size: 12px;
              color: #666;
            }
          }
        }

        button {
          flex: 1;
          background: #f15353;
          color: #fff;
          font-size: 16px;
          border: none;
        }
      }
    }
  }
</style>
