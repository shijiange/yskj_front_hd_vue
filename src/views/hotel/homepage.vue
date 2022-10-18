<template>
  <div id="home_page">
    <c-title :hide="false"
             :text="PageNameList.hotel_home_page"></c-title>
    <div id="content">
      <div class="scroll_banner">
        <img :src="data_info.banner_thumb"/>
        <div class="evaluate">
          <h2>{{data_info.average_score}}</h2>
          <span>好评</span>
        </div>
      </div>

      <div class="position">
        <div class="name">
          <h1 style="-webkit-box-orient: vertical;">
            {{data_info.hotel_name}}<span>{{star_num }}</span>
          </h1>
          <button type="button"
                  class="pay_btn"
                  @click="gotoCashier"
                  v-if="is_cashier">
            优惠买单
          </button>
          <!-- <div class="right" v-if="false">
                        <h2>4.8</h2>
                        <span>好评</span>
                    </div> -->
        </div>
        <ul class="content_a">
          <li class="distance">
            <i class="iconfont icon-service_n"></i>
            <p>
              {{data_info.address}}<span>距离我{{data_info.distance}}{{data_info.unit}}</span>
            </p>
            <div class="right"
                 @click="goToAdress(data_info.longitude,data_info.latitude)">
              <span>地图</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </li>
          <li class="phone">
            <i class="iconfont icon-service_m"></i>
            <a :href="phone">{{data_info.mobile}}</a>
          </li>
          <!-- 酒店详情/设施 -->
          <li class="hotel_detail">
            <span>{{PageNameList.hotels}}详情</span>
            <div class="right"
                 @click="gotoCheckRoom">
              <span>详情/设施</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </li>
        </ul>
        <!-- 查看房型 -->
        <div class="content_b">
          <ul class="time">
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
          <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
            <div class="type_box">
              <div class="room_box"
                   v-for="(item,i) in room_arr"
                   :key='i'>
                <div class="img">
                  <img :src="item.thumb"/>
                </div>
                <ul class="info_box">
                  <li class="info_a">{{ item.title }}</li>
                  <li class="info_b">
                    <p class="price">
                      <span>{{$i18n.t("money")}}</span>
                      <font>{{ item.price }}</font>起
                    </p>
                    <button type="button"
                            @click="gotoGoods(item.id)">
                      预定
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </van-pull-refresh>
        </div>
        <!-- 时间弹窗 -->
        <van-popup v-model="show1"
                   position="bottom"
                   :overlay="true"
                   style="position: fixed; height: 80%;">
          <date-picker type="入住"
                       :top="false"
                       @timeChange="acceptTime"
                       @close="close"></date-picker>
        </van-popup>
        <van-popup v-model="show2"
                   position="bottom"
                   :overlay="true"
                   style="position: fixed; height: 80%;">
          <date-picker type="离店"
                       :top="false"
                       @timeChange="acceptTime"
                       @close="close"></date-picker>
        </van-popup>
        <!-- 悬浮按钮 -->
        <div class="y5"
             bottommenus=""
             @click.stop="showToolbar"
             style="bottom: 7.1875rem;">
          <div class="y6"
               bottomlinks=""
               v-show="toolbar">
            <router-link class="y8"
                         :to="fun.getUrl('home')">
              首页
            </router-link>
            <router-link class="yb"
                         :to="fun.getUrl('orderlist', { status: '0' })">
              订单
            </router-link>
            <router-link class="yc"
                         :to="fun.getUrl('member')">
              我的
            </router-link>
            <i class="yd"></i>
          </div>
        </div>
        <!-- <ul class="type" @click="gotoCheckRoom">
          <li>
            <i class="iconfont icon-service_l"></i>
            <span>{{ PageNameList.check_the_room }}</span>
            <i class="fa fa-angle-right"></i>
          </li>
        </ul>
        <div class="synopsis">
          <h3>{{ PageNameList.hotel_intro }}</h3>
          <div class="syn_bgcolor">
            <p style="-webkit-box-orient: vertical;">
              {{ data_info.hotel_introduce }}
            </p>
          </div>
        </div>
        <div class="info_a">
          <h3>
            入住信息<i
              class="fa fa-angle-down"
              v-if="show1"
              @click="toggleShow1"
            ></i>
            <i class="fa fa-angle-up" v-if="!show1" @click="toggleShow1"></i>
          </h3>
          <div v-if="show1">
            <ul class="time">
              <li class="time_a">
                <i class="iconfont icon-service_j"></i><span>入离时间</span>
              </li>
              <li class="time_b">
                入住时间：{{ data_info.entrance_time }}以后 离开时间：{{
                  data_info.departure_time
                }}以前
              </li>
            </ul>
            <ul class="notice">
              <li class="notice_a">
                <i class="iconfont icon-service_k"></i><span>入住须知</span>
              </li>
              <li class="notice_b">{{ data_info.instructions }}</li>
            </ul>
          </div>
        </div>
        <div
          class="service_info"
          v-if="!fun.isTextEmpty(data_info.has_one_facilities)">

          <h3>
            设备服务<i
              class="fa fa-angle-down"
              v-if="show2"
              @click="toggleShow2"
            ></i>
            <i class="fa fa-angle-up" v-if="!show2" @click="toggleShow2"></i>
          </h3>
          <div class="box" v-if="show2">
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_network == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.network)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_a"></i><span>网络</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.network">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_parking == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.parking)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_b"></i><span>停车场</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.parking">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_traffic == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.traffic)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_c"></i><span>交通服务</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.traffic">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_recreation == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.recreation)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_d"></i><span>休闲娱乐</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.recreation">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_reception == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.reception)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_e"></i><span>前台服务</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.reception">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_restaurant == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.restaurant)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_f"></i><span>餐饮服务</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.restaurant">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_business == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.business)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_g"></i><span>商务服务</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.business">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_currency == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.currency)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_h"></i><span>通用设备</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.currency">{{
                  item
                }}</span>
              </li>
            </ul>
            <ul
              class="service_a"
              v-if="
                data_info.has_one_facilities.is_other == 1
                  ? true
                  : false &&
                    !fun.isTextEmpty(data_info.has_one_facilities.other)
              "
            >
              <li class="item">
                <i class="iconfont icon-service_i"></i><span>其他服务</span>
              </li>
              <li class="item_info">
                <span v-for="item in data_info.has_one_facilities.other">{{
                  item
                }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="synopsis" v-if="!fun.isTextEmpty(data_info.information)">
          <h3>酒店详情</h3>
          <div class="syn_bgcolor">
            <p
              style="-webkit-box-orient: vertical;"
              v-html="data_info.information"
            ></p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./homepage_controller";

export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #home_page {
    #content {
      .scroll_banner {
        background: #f8f8f8;
        overflow: hidden;
        height: 12.5rem;
        position: relative;

        img {
          width: 100%;
        }

        .evaluate {
          position: absolute;
          bottom: 0.9375rem;
          left: 0.9375rem;
          width: 6.25rem;
          height: 2.5rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.9375rem;
          background:
            linear-gradient(
              to right,
              rgba(51, 51, 51, 0.8),
              rgba(51, 51, 51, 0.1)
            );

          h2 {
            color: #f0793a;
            font-size: 24px;
            margin-right: 0.375rem;
          }

          span {
            color: #fff;
            font-size: 13px;
          }
        }
      }

      .position {
        position: relative;
        top: 0;

        .name {
          width: 100%;
          background: #fff;
          border-radius: 0;
          margin: 0 auto;
          padding: 0.75rem 0.875rem;
          display: flex;
          justify-content: space-between;

          h1 {
            width: 16.25rem;
            font-size: 18px;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;

            span {
              font-weight: normal;
              color: #8c8c8c;
              font-size: 14px;
              margin-left: 0.625rem;
            }
          }

          .pay_btn {
            border: none;
            background: #f0793a;
            color: #fff;
            font-size: 13px;
            width: 4.75rem;
            height: 1.625rem;
            border-radius: 2.5rem;
          }

          .right {
            h2 {
              font-size: 22px;
              color: #337ef9;
            }

            span {
              font-size: 14px;
            }
          }
        }

        .content_a {
          padding: 0 0.875rem;
          background: #fff;
          margin-top: 0.625rem;

          .distance {
            padding: 0.625rem 0;
            display: flex;
            position: relative;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            p {
              font-size: 14px;
              text-align: left;
              width: 16.875rem;

              span {
                color: #8c8c8c;
                margin-left: 0.625rem;
                font-size: 12px;
              }
            }

            .right {
              position: absolute;
              right: 0;
              display: flex;
              font-size: 14px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
              }
            }
          }

          .phone {
            display: flex;
            padding: 0.625rem 0;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            span {
              font-size: 16px;
            }
          }

          .hotel_detail {
            height: 2.75rem;
            line-height: 2.75rem;
            display: flex;
            justify-content: space-between;
            border-top: solid 0.0625rem #ebebeb;
            font-size: 16px;

            .right {
              right: 0;
              display: flex;
              font-size: 14px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
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

          .type_box {
            padding: 0 0.875rem;

            .room_box {
              border-bottom: solid 0.0625rem #ebebeb;
              display: flex;
              padding: 0.875rem 0;

              .img {
                width: 4rem;
                height: 4rem;
                border-radius: 0.25rem;
                overflow: hidden;
                margin-right: 0.625rem;
                background: #f2f2f2;

                img {
                  width: 100%;
                }
              }

              .info_box {
                width: 17.0625rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .info_a {
                  font-size: 15px;
                  font-weight: bold;
                  max-width: 150px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .info_b {
                  text-align: right;

                  .price {
                    line-height: 2.125rem;
                    color: #8c8c8c;
                    font-size: 12px;

                    span {
                      font-weight: bold;
                      color: #f15353;
                    }

                    font {
                      font-size: 20px;
                      font-weight: bold;
                      color: #f15353;
                    }
                  }

                  button {
                    background: #f15353;
                    color: #fff;
                    font-size: 14px;
                    width: 4.25rem;
                    height: 1.625rem;
                    border-radius: 1rem;
                    border: none;
                  }
                }
              }
            }

            .room_box:last-child {
              border: 0;
            }
          }
        }

        .type {
          background: #fff;
          margin-top: 0.625rem;
          height: 2.875rem;
          line-height: 2.875rem;
          padding: 0 0.875rem;
          position: relative;

          li {
            display: flex;

            .iconfont {
              margin-right: 0.625rem;
              color: #666;
              font-size: 1.25rem;
            }

            span {
              font-size: 16px;
            }

            .fa {
              position: absolute;
              right: 0.875rem;
              font-size: 1.5rem;
              color: #c9c9c9;
              line-height: 2.875rem;
            }
          }
        }

        .synopsis {
          background: #fff;
          margin-top: 0.625rem;
          padding: 0 0.875rem 0.625rem 0.875rem;

          h3 {
            font-size: 16px;
            height: 2.625rem;
            line-height: 2.625rem;
            text-align: left;
          }

          .syn_bgcolor {
            background: #f5f5f5;
            border-radius: 0.375rem;
            padding: 0.625rem;

            p {
              font-size: 14px;
              color: #8c8c8c;
              text-align: left;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .fa {
              font-size: 1.5rem;
              color: #c9c9c9;
              margin-top: 0.625rem;
            }
          }
        }

        .info_a {
          background: #fff;
          margin-top: 0.625rem;
          padding-bottom: 0.625rem;

          h3 {
            height: 2.625rem;
            line-height: 2.625rem;
            text-align: left;
            padding: 0 0.875rem;
            font-size: 16px;

            i {
              position: absolute;
              right: 0.875rem;
              font-size: 1.125rem;
              color: #c9c9c9;
              line-height: 2.625rem;
            }
          }

          .time,
          .notice {
            padding: 0 0.875rem;

            .time_a,
            .notice_a {
              display: flex;
              line-height: 1.875rem;
              text-align: left;
              font-size: 14px;
              font-weight: bold;

              i {
                font-size: 1.5rem;
                color: #333;
                margin-right: 0.625rem;
              }
            }

            .time_b,
            .notice_b {
              color: #8c8c8c;
              font-size: 14px;
              text-align: left;
            }

            .notice {
              margin-top: 0.625rem;
            }
          }
        }

        .service_info {
          background: #fff;
          margin-top: 0.625rem;

          h3 {
            height: 2.625rem;
            line-height: 2.625rem;
            text-align: left;
            padding: 0 0.875rem;
            font-size: 16px;

            i {
              position: absolute;
              right: 0.875rem;
              font-size: 1.125rem;
              color: #c9c9c9;
              line-height: 2.625rem;
            }
          }

          .box {
            padding-bottom: 0.625rem;
          }

          .service_a {
            padding: 0 0.875rem;
            margin-bottom: 0.625rem;

            .item {
              display: flex;
              text-align: left;
              line-height: 1.875rem;

              i {
                font-size: 1.5rem;
                color: #333;
                margin-right: 0.625rem;
              }

              span {
                font-weight: bold;
                font-size: 14px;
              }
            }

            .item_info {
              text-align: left;
              color: #8c8c8c;
              display: flex;
              flex-wrap: wrap;

              span {
                width: 33.3%;
                line-height: 1.5rem;

                font {
                  color: #259b24;
                }
              }
            }
          }
        }

        .y5 {
          position: fixed;
          z-index: 1000;
          right: 0;
          bottom: 3.75rem;
          width: 2.25rem;
          height: 2.25rem;
          background: rgba(0, 0, 0, 0.8) url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem 0.4375rem no-repeat;
          background-size: 4.0625rem 1.25rem;
          border: 0.0625rem solid #757575;
          border-radius: 0.25rem 0 0 0.25rem;
        }

        .y6 {
          position: absolute;
          right: -0.0625rem;
          bottom: 2.25rem;
          width: 5.9375rem;
          border: 0.0625rem solid #757575;
          background: rgba(0, 0, 0, 0.8);
        }

        .y6 a {
          display: block;
          border-bottom: 0.0625rem solid #4b4b4b;
          line-height: 2.1875rem;
          height: 2.1875rem;
          color: #fff;
          background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
          background-repeat: no-repeat;
          background-size: 1rem 18.75rem;
        }

        .y8 {
          background-position: 0.625rem -3.125rem;
        }

        .yb {
          background-position: 0.625rem -12.5rem;
        }

        .yc {
          background-position: 0.625rem -15.625rem;
        }
      }
    }
  }
</style>
