<template >
  <div id="activity-home">
    <div class="content">
      <div class="search_box">
        <ul class="search">
          <li class="left"
              @click="routerGo">
            <i class="iconfont icon-service_n"></i>
            <span>{{city.substr(0,2)}}</span>
            <i class="iconfont icon-member-bottom"></i>
          </li>
          <li class="right">
            <i class="iconfont icon-sousuo"></i>
            <input type="text"
                   title="搜索"
                   v-model="value"
                   @click="search"
                   placeholder="搜索你喜欢的活动" />
          </li>
        </ul>
      </div>
      <div class="banner">
        <van-swipe indicator-color="#fff"
                   :autoplay="3000">
          <van-swipe-item v-for="(item, index) in goodsInfo"
                          :key="index">
            <a class="banner-link"
               @click="bannerTo(item)">
              <img :src="item.thumb">
            </a>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="sort">
        <ul>
          <li class="item"
              v-for="(item,index) in categories"
              :key="index"
              @click="toSort(item)">
            <div class="img">
              <img :src="item.thumb">
            </div>
            <span>{{item.calssify_title}}</span>
          </li>
        </ul>
      </div>
      <div class="hot-least" v-if="set && set.is_hot==1">
        <div class="hot-title">
          <span class="strong"><b>近期热门</b></span>
          <span class="all"
                @click="least">全部 <i class="fa fa-angle-right"></i></span>

        </div>
        <div class="image"
             ref="hotTab">
          <ul id="hotImage"
              ref='hotCon'>
            <li @click="toEnroll(obj)"
                v-for="(obj,index) in hot"
                :key="index"><img :src="obj.thumb"></li>
          </ul>
        </div>
      </div>
      <div class="people-hot" v-if="set && set.is_discount==1">
        <div class="people-title">
          <span class="strong"><b>人气精选</b></span>
        </div>
        <div class="people-image"
             ref="personTab">
          <ul class="content"
              ref="cont">
            <li class="list"
                @click="toEnroll(list)"
                v-for="(list,index) in discount"
                :key="index">
              <img :src="list.thumb">
              <p class="title">{{list.title}}</p>
              <p class="date">{{getDate(list.registration_time)}}-{{getDate(list.registration_end_time)}}</p>
            </li>
            <li class="check-more" @click="concentration">
              <span>查看全部</span>
              <span class="line"></span>
              <span>See More</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="intoduce-you" v-if="set && set.is_recommand==1">
        <div class="title">
          <span class="strong"><b>为您推荐</b></span>
        </div>
        <div class="list"
             @click="toEnroll(item)"
             v-for="(item,index) in recommand"
             :key="index">
          <div class="list-image">
            <img :src="item.thumb"
                 class="left">
            <span class="text default"
                  v-show="now<item.registration_time">待开始</span>
            <span class="text default"
                  v-show="item.registration_time<=now&&now<item.registration_end_time">报名中</span>
            <span class="text default"
                  v-show="now>=item.registration_end_time">已结束</span>
          </div>
          <div class="list-info">
            <p>{{item.title}}</p>
            <p class="clock"><i class="iconfont icon-service_j"></i><span>{{timestampToTime(item.registration_time)}}开始</span></p>
            <p class="bottom-status"><span class="price"
                    v-if="item.cash>0.00"><b>{{$i18n.t('money')}}</b>{{item.cash}}</span><span class="cash"
                    v-if="item.cash<=0.00">免费</span><span>{{item.city_name.substr(0,2)}}|{{item.address}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activity_homecontroller from './activity_homecontroller';
export default activity_homecontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#activity-home {
  background-color: #fff;
  padding: 5px 0;

  .content {
    .search_box {
      .search {
        height: 2.75rem;
        line-height: 2.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.875rem;
        background-color: #fff;

        .text {
          font-size: 14px;
          color: #1c96fe;
        }

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
          width: 70%;
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

    .banner {
      margin: 1rem 0;
      width: 100%;

      .banner-link {
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .sort {
      margin: 1rem 0;
      margin-bottom: 2rem;

      ul {
        display: flex;
        flex-wrap: wrap;

        .item {
          display: flex;
          width: 20%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 5px 0;

          .img {
            width: 3rem;
            height: 3rem;
            background: #fff;
            border-radius: 50%;
            border: 0.125rem solid #fff;
            box-sizing: border-box;
            float: left;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .hot-least {
      margin: 1rem 0;
      padding: 0 10px;

      .hot-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .strong {
          font-size: 16px;
          color: #333;
        }

        .all {
          font-size: 14px;
          color: #999;
        }
      }

      .image {
        width: 100%;
        margin-top: 15px;
        overflow: hidden;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            width: 6.25rem;
            height: 3.9688rem;
            margin-right: 1rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .check-more {
            width: 6rem;
            height: 3.9688rem;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            margin-right: 0;

            .line {
              width: 80%;
              height: 1px;
              background-color: #666;
              margin: 0.5rem 0;
            }
          }
        }
      }
    }

    .people-hot {
      padding: 0 10px;
      margin: 15px 0;

      .people-title {
        display: flex;
        align-items: center;

        .strong {
          font-size: 16px;
          color: #333;
        }

        .all {
          font-size: 14px;
          color: #999;
        }
      }

      .people-image {
        margin-top: 1rem;
        overflow: hidden;

        ul {
          display: flex;

          .list {
            width: 6.25rem;
            margin-right: 1rem;

            .title {
              display: -webkit-box;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              word-wrap: break-word;
              -webkit-line-clamp: 1;

              /* autoprefixer: off */
              -webkit-box-orient: vertical;
              color: #333;
              text-align: left;
            }

            .date {
              color: #999;
              text-align: left;
            }

            img {
              width: 6.25rem;
              height: 3.9688rem;
            }
          }

          .check-more {
            width: 6rem;
            height: 6rem;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            .line {
              width: 80%;
              height: 1px;
              background-color: #666;
              margin: 0.5rem 0;
            }
          }
        }
      }
    }

    .intoduce-you {
      margin-top: 0.9375rem;
      padding: 0 0.625rem;
      padding-bottom: 3.0625rem;

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        .strong {
          font-size: 16px;
          color: #333;
        }

        .all {
          font-size: 14px;
          color: #999;
        }
      }

      .list {
        display: flex;
        margin-bottom: 1rem;

        .list-image {
          width: 8.9375rem;
          height: 5.5938rem;
          position: relative;

          .left {
            width: 100%;
            height: 100%;
          }

          .text {
            position: absolute;
            left: 0;
            top: 0;
            width: 4rem;
            height: 2rem;
            border-radius: 0 1rem 0 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
        }

        .list-info {
          display: flex;
          flex-direction: column;
          margin-left: 0.5rem;
          align-items: baseline;
          flex: 1;
          justify-content: space-between;

          p {
            font-size: 14px;
            text-align: left;
            margin-top: 5px;
            display: flex;
          }

          .clock {
            padding: 0 0.625rem;
            height: 1.5rem;
            line-height: 1.5rem;
            font-size: 12px;
            background-color: #fff7f7;
            border-radius: 1rem;
            color: #999;
          }

          p:first-child {
            margin-top: 0;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;

            /* autoprefixer: off */
            -webkit-box-orient: vertical;
          }

          .bottom-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 12px;
            color: #999;

            .status {
              padding: 0.3rem;
              border: solid 1px #ccc;
            }

            .cash {
              color: #f15353;
              font-size: 14px;
            }

            .price {
              color: #f15353;
              font-size: 16px;

              b {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }

  .green {
    background-color: rgba(59, 179, 93, 0.2);
    color: #3bb35d !important;
  }

  .yellow {
    background-color: rgba(255, 177, 38, 0.2);
    color: #ffb126 !important;
  }

  .red {
    background-color: rgba(255, 49, 38, 0.2);
    color: #ff3126 !important;
  }

  .default {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
  }
}
</style>
