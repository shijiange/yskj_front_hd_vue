<template>
  <div id="easy_refuel">
  <!-- new页面 -->
  <div class="search_box" :class="{ isfollow }">
      <ul class="search">
        <li class="left" @click="tolocation">
          <i class="iconfont icon-order_locate"></i>
          <span>{{ address }}</span>
          <i class="iconfont icon-member-bottom"></i>
        </li>
        <li class="right" @click="tosearch">
          <i class="iconfont icon-sousuo"></i>
          <input
            type="text"
            title="搜索"
            readonly="readonly"
            placeholder="附近油站"
          />
        </li>
      </ul>
    </div>
    <c-title :hide="false" text="加油列表"></c-title>
        <van-swipe class="my-swipe"  indicator-color="white" :autoplay="3000">
            <van-swipe-item v-for="(item,index) in banner" :key="index">
            <a :href="item.wap_jump">
                <img :src="item.home">
            </a>
            </van-swipe-item>
        </van-swipe>    
    <div class="content">
      <div class="item" v-for="(item,index) in datas" @click="toDetail(item)" :key="index">
        <div class="top">
          <div class="left" >
            <img :src="item.stationPic">
          </div>
          <div class="right">
            <div class="title">
              <span>{{item.stationName}}</span>
              <span style="color: #fda804;">{{item.starNum}}分</span>
            </div>
            <div class="distance">
              <span class="location">{{item.location}}</span>
              <span>{{item.distance}}km</span>
            </div>
            <div class="down">
                <span class="jian">减</span>
                <span class="txt">{{shopName}}专属价↓↓↓</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="wrap">
            <template v-for="(list,index) in item.prices">
                <div :key="index" style="text-align: left;"><span style="font-size: 12px; margin-right: 0.5rem;">{{list.oilCode}}</span><del style="margin-right: 0.5rem; font-size: 12px;">{{list.stationPrice}}元/升</del><span style="color: #fe2d03; font-size: 12px;">{{list.discountPrice}}元/升</span></div>
                <div :key="index" style="font-size: 12px; color: #666; margin-top: 0.5rem; margin-bottom: 0.5rem;">低于国家价{{(Number(list.discountPrice)-Number(list.countryPrice)).toFixed(2)}}元,普通车无该特惠</div>
            </template>
          </div>
        </div>
      </div>
    </div>
 
  </div>
</template>
<script>
import easy_refuel_controller from "./easy_refuel_controller";

export default easy_refuel_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#easy_refuel {
  position: relative;

  .search_box {
    .search {
      height: 2.75rem;
      line-height: 2.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.875rem;
      background-color: #fff;

      .left {
        font-size: 15px;
        display: flex;

        i {
          color: #999;
          font-size: 1rem;
        }

        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 3.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #999;
        }

        i:last-child {
          font-size: 1.125rem;
        }
      }

      .right {
        width: 14.375rem;
        height: 1.875rem;
        background: #f5f5f5;
        display: flex;
        line-height: 1.875rem;
        border-radius: 1rem;
        padding: 0 0.625rem;
        font-size: 14px;

        i {
          font-size: 1.125rem;
          color: #999;
          margin-right: 0.375rem;
        }

        input {
          border: none;
          width: 100%;
        }
      }
    }
  }

  .my-swipe {
    width: 100%;

    a {
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    width: 100%;
    padding-top: 1.375rem;
    padding-bottom: 4.375rem;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: #fff;
    z-index: 999;
    position: relative;

    .item {
      margin-top: 1rem;

      .top {
        display: flex;

        .left {
          width: 5.6875rem;
          height: 5.75rem;
          border-radius: 50%;
          border: solid 0.0625rem #fda804;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .right {
          flex: 1;
          margin-left: 0.75rem;
          flex-direction: column;
          display: flex;
          justify-content: space-between;

          .title {
            display: flex;
            justify-content: space-between;
            text-align: left;
          }

          .distance {
            text-align: left;
            color: #666;
            font-size: 12px;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .location {
              width: 70%;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
          }

          .down {
            text-align: left;
            display: flex;

            .jian {
              width: 0.875rem;
              height: 0.875rem;
              background-color: #ff3000;
              border-radius: 0.1875rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 12px;
              margin-right: 0.5rem;
            }

            .txt {
              color: #ff3000;
              font-size: 12px;
            }
          }
        }
      }

      .bottom {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;

        .wrap {
          width: 15.25rem;
          padding: 0.5rem;
          background-color: #f8f8f8;
          border-radius: 0.3125rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
    }
  }

  .pop {
    padding-top: 1.5rem;
    padding-left: 1rem;
    padding-right: 1rem;

    .pop-wrap {
      width: 100%;

      .title {
        color: #666;
        text-align: left;
        margin-bottom: 1rem;
      }

      .catgory {
        display: flex;
        flex-wrap: wrap;

        .catgory-item {
          width: 45%;
          margin-right: 10%;
          margin-bottom: 0.75rem;
          height: 2.5rem;
          background-color: #dadada;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .catgory-item:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }

  .fixed {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    height: 3.125rem;
    background-color: #fff;
    box-shadow:
      0 -0.0625rem 0.5625rem 0
      rgba(0, 0, 0, 0.08);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;

    .left {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      i {
        font-size: 18px;
        margin-right: 0.5rem;
      }
    }

    .right {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      i {
        font-size: 18px;
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
