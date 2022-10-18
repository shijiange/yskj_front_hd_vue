<template>
  <div id="choose_room">
    <!-- <c-title :hide="false" :text="`${PageNameList.hotels}详情`"></c-title> -->
    <div class="title set-pc-style">
      <i @click="goto()" class="iconfont icon-back"></i>
      <span>{{PageNameList.hotels}}详情</span>
    </div>
    <div class="synopsis">
      <h3>{{ PageNameList.hotel_intro }}</h3>
      <div class="syn_bgcolor">
        <p style="-webkit-box-orient: vertical;" id="introduceH" :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
          {{ hotel_introduce }}
        </p>
        <h2 @click="showTotalIntro" v-if="showExchangeButton">{{exchangeButton ? '∨' : '∧'}}</h2>
        <p style="text-align: center;" v-if="this.fun.isTextEmpty(hotel_introduce)">暂无简介</p>
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
            入住时间：{{ data_info.entrance_time }}以后&emsp;离开时间：{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.network" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.parking" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.traffic" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.recreation" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.reception" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.restaurant" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.business" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.currency" :key='i'>{{
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
            <span v-for="(item,i) in data_info.has_one_facilities.other" :key='i'>{{
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
    </div>
  </div>
</template>

<script>
import controller from "./choose_room_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#choose_room {
  padding-top: 40px;

  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    color: #666;
    font-size: 1rem;
    font-weight: bold;
    padding: 0 10px;
    background: #ffff;
    border-bottom: 0.0625rem solid #e8e8e8;

    span {
      width: 80%;
      // line-height: 2rem;
    }

    i {
      font-weight: bold;
      font-size: 1rem;
      flex: 0 0 10%;
      // line-height: 2rem;
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
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 3;
        // overflow: hidden;
        // text-overflow: ellipsis;
        line-height: 1.125rem;
      }

      .total-introduce {
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
  // #content {
  //   .scroll_banner {
  //     background: #f8f8f8;
  //     overflow: hidden;
  //     height: 12.5rem;
  //     img {
  //       width: 100%;
  //     }
  //   }
  //   .content_a {
  //     background: #fff;
  //     padding: 0.625rem 0;
  //     h1 {
  //       padding: 0 0.875rem;
  //       text-align: left;
  //       font-size: 16px;
  //       line-height: 2.5rem;
  //       span {
  //         color: #8c8c8c;
  //         font-size: 14px;
  //         margin-left: 0.625rem;
  //         font-weight: normal;
  //       }
  //     }
  //   }
  //   .time {
  //     width: 21.5625rem;
  //     height: 2.75rem;
  //     margin: 0 auto;
  //     border-radius: 0.25rem;
  //     box-shadow: 0rem 0rem 1.25rem 0rem rgba(51, 51, 51, 0.1);
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     padding: 0 0.625rem;
  //     .time_a,
  //     .time_c {
  //       font-size: 16px;
  //       font-weight: bold;
  //       span {
  //         font-size: 12px;
  //         margin-left: 0.375rem;
  //         color: #8c8c8c;
  //         font-weight: normal;
  //       }
  //     }
  //     .time_b {
  //       span {
  //         font-size: 13px;
  //         border: solid 0.0625rem #ebebeb;
  //         border-radius: 1rem;
  //         padding: 0.125rem 0.625rem;
  //       }
  //     }
  //   }
  //   .type_box {
  //     padding: 0 0.875rem;
  //     .room_box {
  //       border-bottom: solid 0.0625rem #ebebeb;
  //       display: flex;
  //       padding: 0.875rem 0;
  //       .img {
  //         width: 4rem;
  //         height: 4rem;
  //         border-radius: 0.25rem;
  //         overflow: hidden;
  //         margin-right: 0.625rem;
  //         background: #ccc;
  //         img {
  //           width: 100%;
  //         }
  //       }
  //       .info_box {
  //         width: 17.0625rem;
  //         display: flex;
  //         align-items: center;
  //         justify-content: space-between;
  //         .info_a {
  //           font-size: 15px;
  //           font-weight: bold;
  //           max-width: 150px;
  //           overflow: hidden;
  //           text-overflow: ellipsis;
  //           white-space: nowrap;
  //         }
  //         .info_b {
  //           text-align: right;
  //           .price {
  //             line-height: 2.125rem;
  //             color: #8c8c8c;
  //             font-size: 12px;
  //             span {
  //               font-weight: bold;
  //               color: #f15353;
  //             }
  //             font {
  //               font-size: 20px;
  //               font-weight: bold;
  //               color: #f15353;
  //             }
  //           }
  //           button {
  //             background: #f15353;
  //             color: #fff;
  //             font-size: 14px;
  //             width: 3.75rem;
  //             height: 1.625rem;
  //             border-radius: 0.1875rem;
  //             border: none;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // .y5 {
  //   position: fixed;
  //   z-index: 1000;
  //   right: 0;
  //   bottom: 3.75rem;
  //   width: 2.25rem;
  //   height: 2.25rem;
  //   background: rgba(0, 0, 0, 0.8)
  //     url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem
  //     0.4375rem no-repeat;
  //   background-size: 4.0625rem 1.25rem;
  //   border: 0.0625rem solid #757575;
  //   border-radius: 0.25rem 0 0 0.25rem;
  // }
  // .y6 {
  //   position: absolute;
  //   right: -0.0625rem;
  //   bottom: 2.25rem;
  //   width: 5.9375rem;
  //   border: 0.0625rem solid #757575;
  //   background: rgba(0, 0, 0, 0.8);
  // }
  // .y6 a {
  //   display: block;
  //   border-bottom: 0.0625rem solid #4b4b4b;
  //   line-height: 2.1875rem;
  //   height: 2.1875rem;
  //   color: #fff;
  //   background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
  //   background-repeat: no-repeat;
  //   background-size: 1rem 18.75rem;
  // }
}
</style>
