<template>
  <div id="hotel_home">
    <c-title :hide="false" :text="PageNameList.hotel_first_page"></c-title>
    <div id="content">
      <div class="scroll_banner">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(item,index) in carousels_arr" :key="index">
            <a href="javascript:;" @click="imgHref(item.link)">
              <img :src="item.thumb" />
            </a>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="position">
        <div class="search">
          <ul class="box">
            <li class="city">
              <span class="city_cur">{{ location.city }}</span>
              <div class="current" @click="routerGo('1')">
                <i class="iconfont icon-location"></i>
                <span>当前位置</span>
              </div>
            </li>
            <li class="select_date">
              <span @click="show2 = true"
                ><font>{{
                  fun.isTextEmpty(start_time) ? "请选择入住日期" : start_time
                }}</font></span
              >
              <span @click="show3 = true"
                ><font>{{
                  fun.isTextEmpty(end_time) ? "请选择离开日期" : end_time
                }}</font></span
              >
              <span class="right" v-if="!fun.isTextEmpty(night_day)"
                >共{{ night_day }}晚<i class="fa fa-angle-right"></i
              ></span>
            </li>
            <li class="nearby" @click="gotoSearch">
              <span>我的附近</span>
              <input
                type="text"
                :placeholder="
                  '搜索关键字/位置/品牌/' + PageNameList.hotel_find_name
                "
                disabled
              />
              <i class="fa fa-angle-right"></i>
            </li>
            <li class="price" @click="show1 = true">
              <input type="text" placeholder="价格/星级" disabled />
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
          <button type="button" @click="gotoSearch2">
            {{ PageNameList.hotel_find }}
          </button>
        </div>
        <div class="menu_icon">
          <ul class="icon_box">
            <li v-for="(item,index) in catagory_arr" @click="goCatagory(item)" :key="index">
              <div class="img">
                <img :src="item.thumb" />
              </div>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div
          class="fixed_banner"
          @click="imgHref(bannerObj.link)"
          v-bind="!fun.isTextEmpty(bannerObj)"
        >
          <img :src="bannerObj.img" />
        </div>
        <div class="like_box" v-if="hotel_arr.length>0">
          <div class="title">
            <div class="line_left"></div>
            <h2>猜你喜欢</h2>
            <div class="line_right"></div>
          </div>
          <div class="goods_box">
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
              <hotel-list :datas="hotel_arr"></hotel-list>
            </van-pull-refresh>
          </div>
        </div>
      </div>
      <!-- 价格/星级弹窗 -->
      <van-popup v-model="show1" position="bottom" transition="fade">
        <div class="price_box">
          <div class="price">
            <p class="title">
              价格<span>当前：{{$i18n.t('money')}}{{ value }}</span>
            </p>
            <p class="number">
              <span>{{$i18n.t('money')}}0</span>
              <span>{{$i18n.t('money')}}700</span>
            </p>
            <van-slider v-model="value" :step="50" bar-height="4px" active-color="#f15353" :min="0" :max="700"></van-slider>
          </div>
          <div class="grade">
            <p class="title">等级</p>
            <div class="grade_box">
              <button
                type="button"
                :class="{ cur: current_index == index }"
                v-for="(item, index) in star_arr"
                :key="index"
                @click="starChoose(index, item)"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
          <div class="bottom">
            <button type="button" @click="starSubmit('reset')">重置</button>
            <button type="button" @click="starSubmit('complete')">完成</button>
          </div>
        </div>
      </van-popup>
      <!-- 时间弹窗 -->
      <van-popup
        v-model="show2"
        position="bottom"
        transition="fade"
        :overlay="true"
        style="position: fixed; top: 20%; height: 80%;"
      >
        <date-picker
          type="入住"
          @timeChange="acceptTime"
          :top="false"
          @close="closeHander"
        ></date-picker>
      </van-popup>
      <van-popup
        v-model="show3"
        position="bottom"
        transition="fade"
        :overlay="true"
        style="position: fixed; top: 20%; height: 80%;"
      >
        <date-picker
          type="离店"
          @timeChange="acceptTime"
          :top="false"
          @close="closeHander"
        ></date-picker>
      </van-popup>
      <div
        class="y5" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        @click.stop="showToolbar"
        style="bottom: 7.1875rem;"
      >
        <div class="y6" bottomlinks="" v-show="toolbar">
          <router-link class="y8" :to="fun.getUrl('home')">
            首页
          </router-link>
          <router-link
            class="yb"
            :to="fun.getUrl('orderlist', { status: '0' ,orderType:'hotel'})"
          >
            订单
          </router-link>
          <router-link class="yc" :to="fun.getUrl('member')">
            我的
          </router-link>
          <i class="yd"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./index_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hotel_home {
  #content {
    .scroll_banner {
      overflow: hidden;
      background: #f8f8f8;
      height: 12.5rem;

      img {
        width: 100%;
      }
    }

    .position {
      z-index: 10;
      position: relative;
      top: -3.125rem;
    }

    .search {
      width: 22.1875rem;
      margin: 0 auto;
      border-radius: 0.375rem;
      background: #fff;
      padding: 0 0.75rem 0.75rem 0.75rem;

      .box {
        li {
          height: 3.125rem;
          border-bottom: solid 0.0625rem #ebebeb;
          display: flex;
        }

        .city {
          position: relative;
          justify-content: space-between;

          .city_cur {
            font-size: 18px;
            line-height: 3.125rem;
            font-weight: bold;
          }

          .current {
            position: absolute;
            right: 0;
            padding: 0.25rem 0;

            i {
              font-size: 1.5rem;
              color: #337ef9;
              line-height: 1.5rem;
            }

            span {
              font-size: 12px;
              color: #337ef9;
              display: block;
            }
          }
        }

        .select_date {
          line-height: 3.125rem;
          position: relative;

          span {
            margin-right: 1.875rem;
            font-size: 18px;

            font {
              font-size: 14px;
              margin-left: 0.25rem;
              color: #333;
            }
          }

          .right {
            font-size: 14px;
            position: absolute;
            right: 0;
            display: flex;
            color: #333;
            margin: 0;

            i {
              font-size: 1.125rem;
              color: #c9c9c9;
              margin-left: 0.375rem;
              line-height: 3.125rem;
            }
          }
        }

        .nearby {
          line-height: 3.125rem;
          position: relative;
          font-size: 16px;

          .nearby_b {
            color: #8c8c8c;
          }

          input {
            width: 13.75rem;
            border: none;
            margin-left: 1.25rem;
            font-size: 16px;
          }

          .fa {
            position: absolute;
            right: 0;
            font-size: 1.125rem;
            color: #c9c9c9;
            line-height: 3.125rem;
          }
        }

        .price {
          line-height: 3.125rem;
          position: relative;

          input {
            width: 13.75rem;
            border: none;
            font-size: 16px;
          }

          span {
            font-size: 16px;
            color: #8c8c8c;
          }

          .fa {
            position: absolute;
            right: 0;
            font-size: 18px;
            color: #c9c9c9;
            line-height: 3.125rem;
          }
        }
      }

      button {
        margin-top: 0.75rem;
        width: 100%;
        height: 2.875rem;
        font-size: 18px;
        color: #fff;
        background: #f15353;
        border: none;
        border-radius: 0.375rem;
      }
    }

    .menu_icon {
      margin-top: 0.625rem;
      background: #fff;

      .icon_box {
        display: flex;
        flex-wrap: wrap;
        padding: 0.75rem 0 0 0;

        li {
          width: 20%;
          margin-bottom: 0.625rem;

          .img {
            margin: 0 auto;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 2.25rem;
            background: #f8f8f8;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          span {
            display: block;
            font-size: 12px;
            color: #666;
            line-height: 1.875rem;
            text-align: center;
          }
        }
      }
    }

    .fixed_banner {
      background: #f8f8f8;
      height: 8rem;
      width: 100%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .like_box {
      background: #fff;

      .title {
        height: 2.5rem;
        line-height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .line_left {
          width: 3.125rem;
          height: 0.0625rem;
          border: dashed 0.0625rem #ebebeb;
          margin-right: 0.625rem;
        }

        h2 {
          font-size: 18px;
        }

        .line_right {
          width: 3.125rem;
          height: 0.0625rem;
          border: dashed 0.0625rem #ebebeb;
          margin-left: 0.625rem;
        }
      }

      .goods_box {
        padding: 0.625rem 0;

        .goods {
          display: flex;
          margin-bottom: 0.625rem;

          .img {
            width: 6.25rem;
            height: 6.25rem;
            background: #f8f8f8;
            overflow: hidden;
            margin: 0 0.625rem;

            img {
              width: 100%;
            }
          }

          .info {
            text-align: left;
            width: 16rem;
            padding-right: 0.625rem;
            border-bottom: solid 0.0625rem #ebebeb;
            padding-bottom: 0.625rem;

            .info_a {
              font-size: 16px;
              font-weight: bold;
              line-height: 1.5rem;
              max-height: 3rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;

              font {
                font-size: 12px;
                color: #8c8c8c;
                font-weight: normal;
                margin-left: 0.625rem;
              }
            }

            .info_b {
              font-size: 12px;
              color: #8c8c8c;

              span {
                font-size: 20px;
                color: #337ef9;
                font-weight: bold;
                margin-right: 0.625rem;

                font {
                  font-size: 14px;
                  font-weight: normal;
                }
              }
            }

            .info_c {
              font-size: 12px;
              color: #8c8c8c;
            }

            .info_d {
              font-size: 12px;
              color: #259b24;
            }

            .info_e {
              color: #f15353;

              span {
                font-size: 20px;
                font-weight: bold;
              }

              font:last-child {
                color: #8c8c8c;
              }
            }
          }
        }
      }
    }

    .price_box {
      min-height: 32.5rem;
      background: #fff;
      padding-top: 0.625rem;

      .price {
        padding: 0 1.25rem;

        .title {
          line-height: 1.875rem;
          text-align: left;
          font-size: 16px;

          span {
            margin-left: 0.625rem;
            color: #53a1f1;
          }
        }

        .number {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          line-height: 1.875rem;
          margin-bottom: 0.625rem;
        }
      }

      .grade {
        margin-top: 1.25rem;
        padding: 0 1.25rem;

        .title {
          line-height: 1.875rem;
          text-align: left;
          font-size: 16px;
        }

        .grade_box {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.625rem;

          button {
            width: 4.75rem;
            height: 3rem;
            border-radius: 0.25rem;
            border: solid 0.0625rem #ebebeb;
            font-size: 12px;
            margin-right: 0.625rem;
            text-align: center;
            padding: 0.25rem;
            margin-bottom: 0.625rem;
          }

          button:nth-child(4n) {
            margin: 0;
          }

          .cur {
            border: solid 0.0625rem #53a1f1;
            background: #eaf4fd;
          }
        }
      }

      .bottom {
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 3.0625rem;
        margin-top: 1.25rem;
        border-top: solid 0.0625rem #ebebeb;
        background: #fff;
        display: flex;

        button {
          width: 50%;
          font-size: 18px;
          border: none;
        }

        button:last-child {
          background: #f15353;
          color: #fff;
        }
      }
    }

    .time_box {
      display: inline;

      .fixed {
        position: fixed;
        top: 20%;
        width: 100%;
      }

      .box {
        margin-top: 4.375rem;
      }

      .title {
        background: #fff;
        line-height: 2.5rem;
        text-align: center;
        display: flex;

        h3 {
          width: 100%;
          font-size: 16px;
        }

        i {
          font-size: 1rem;
          color: #999;
          position: absolute;
          right: 0.625rem;
          line-height: 2.5rem;
        }
      }

      .week_box {
        background: #f5f5f5;

        .week {
          display: flex;

          li {
            width: 3.3438rem;
            font-size: 15px;
            line-height: 1.875rem;
          }

          li:last-child,
          li:first-child {
            color: #f15353;
          }
        }
      }

      .month_box {
        background: #fff;
        margin-bottom: 0.625rem;

        h4 {
          line-height: 2.25rem;
          text-align: center;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 15px;
          font-weight: normal;
        }

        .month {
          padding: 0.625rem 0;

          .row {
            display: flex;
            flex-wrap: wrap;

            li {
              flex-direction: row;
              width: 3.3438rem;
              font-size: 15px;
              height: 2.5rem;
            } // li:last-child,li:first-child{
            //     color:#f15353;
            // }
            .cur {
              background: #53a1f1;
              border-radius: 0.25rem;
              color: #fff;
            }
          }
        }
      }
    }

    .choose {
      background: #333;
      color: #fff;
    }

    .choose1 {
      background: #333;
      color: #fff;
    }

    .cur_choose {
      border: solid 0.0625rem #53a1f1;
      background: #eaf4fd;
    }

    .y5 {
      position: fixed;
      z-index: 1000;
      right: 0;
      bottom: 3.75rem;
      width: 2.25rem;
      height: 2.25rem;
      background:
        rgba(0, 0, 0, 0.8)
        url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem
        0.4375rem no-repeat;
      background-size: 4.0625rem 1.25rem;
      border: 0.0625rem solid #757575;
      border-radius: 0.25rem 0 0 0.25rem;

      &.pcStyle {
        right: 35.5%;
      }
    }

    .y6 {
      position: absolute;
      right: -0.0625rem;
      bottom: 2.625rem;
      width: 5.9375rem;
      border: 0.0625rem solid #757575;
      background: rgba(0, 0, 0, 0.8);
    }

    .y6 a {
      display: block;
      padding-left: 2.375rem;
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
      border: none;
    }

    .yd {
      position: absolute;
      bottom: -0.75rem;
      right: 0.625rem;
      width: 0;
      height: 0;
      z-index: 15;
      border-width: 0.375rem;
      border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
      border-style: solid;
    }
  }
}
</style>
