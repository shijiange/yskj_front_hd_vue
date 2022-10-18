<template >
  <div id="sort-activity">
    <c-title :hide="false"
             :text="acText"
             style=" position: relative; z-index: 9999;"></c-title>
    <div class="content">
      <div class="search_box">
        <ul class="search"
            :class="[!locStatus ? 'spaceAround': '']">
          <li class="left"
              @click="routerGo"
              v-if="locStatus">
            <i class="iconfont icon-service_n"></i>
            <span v-if="city">{{city.substr(0, 2)}}</span>
            <i class="iconfont icon-member-bottom"></i>
          </li>
          <li class="right" :class="[!locStatus ? 'all-width': '']">
            <i class="iconfont icon-sousuo"></i>
            <input type="text"
                   title="搜索"
                   v-model="value"
                   @click="search"
                   placeholder="搜索你喜欢的活动" />
          </li>
        </ul>
      </div>
      <div class="tab_box">
        <ul class="tab_list" v-if="categories.length > 0 && showTab">
          <van-tabs v-model="sortId"
                    @change="onClick"
                    title-active-color="#f15353"
                    title-inactive-color="#666666"
                    sticky
                    id="tab">
            <van-tab title="全部"
                     :id="0"
                     name="0"
                     class="tabChild"
                     style="color: #666;"></van-tab>
            <van-tab :title="item.calssify_title"
                     v-for="(item,index) in categories"
                     :key="index"
                     :id="item.id"
                     :name="String(item.id)"
                     class="tabChild"
                     style="color: #666;"></van-tab>
          </van-tabs>
        </ul>
        <div class="opactiy" v-if="categories.length > 0 && showTab">
          <i class="iconfont icon-member-bottom"
             @click="changeStatus"
             v-show="!status"></i>
          <i class="iconfont icon-member-top"
             @click="changeStatus"
             v-show="status"></i>
        </div>
      </div>
      <div class="sort-list"
           :class="[datas.length>0 ? 'padding': '']">
        <div class="pop"
             v-show="status">
          <ul>
            <li class="item"
                v-for="(item,index) in categories"
                :key="index"
                @click="setID(item)">{{item.calssify_title}}</li>
          </ul>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="calssify-list"
               @click="toEnroll(list)"
               v-for="(list,index) in datas"
               :key="index">
            <div class="list-image">
              <img :src="list.thumb"
                   class="left">
              <span class="text default"
                    v-show="now<list.registration_time">待开始</span>
              <span class="text default"
                    v-show="list.registration_time<=now&&now<list.registration_end_time">报名中</span>
              <span class="text default"
                    v-show="now>=list.registration_end_time">已结束</span>
            </div>
            <div class="list-info">
              <p>{{list.title}}</p>
              <p class="clock"><i class="iconfont icon-service_j"></i><span>{{timestampToTime(list.registration_time)}}</span></p>
              <p class="bottom-status"><span class="price"
                      v-if="list.cash>0.00"><b>{{$i18n.t('money')}}</b>{{list.cash}}</span><span class="cash"
                      v-if="list.cash<=0.00">免费</span><span>{{list.city_name?list.city_name.substr(0,2):''}}|{{list.address}}</span></p>
            </div>
          </div>
        </van-pull-refresh>
        <div class="blank"
             v-if="datas.length<=0">
          <img src="../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
      </div>
    </div>
    <div class="mask"
         v-show="status">
    </div>
  </div>
</template>

<script>
import sort_controller from './sort_controller';
export default sort_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#sort-activity {
  .content {
    background: #fff;

    .search_box {
      position: relative;
      z-index: 999;

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
          width: 65%;
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

    .tab_box {
      background: #fff;
      position: relative;
      z-index: 999;

      .tab_list {
        height: 44px;
        line-height: 44px;
        border-bottom: solid 1px #ebebeb;
        overflow-y: hidden;
        transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-duration: 300ms;
        font-size: 18px;
      }

      .opactiy {
        background: rgba(255, 255, 255, 0.7);
        z-index: 99;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 2rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          font-size: 24px;
          color: #333;
        }
      }
    }

    .sort-list {
      position: relative;

      .pop {
        padding: 2rem 1rem;
        padding-top: 1rem;
        background: #fff;
        position: absolute;
        width: 100%;
        top: 0;
        z-index: 9999;

        ul {
          display: flex;
          flex-wrap: wrap;

          .item {
            margin-top: 1rem;
            display: flex;
            align-items: center;
            margin-right: 0.4rem;
            justify-content: center;
            width: 5rem;
            height: 2rem;
            background-color: #f5f5f5;
            border-radius: 1rem;
          }

          li:nth-child(4n) {
            margin-right: 0;
          }
        }
      }

      .calssify-list:last-child {
        margin-bottom: 0;
      }

      .calssify-list {
        display: flex;
        margin-bottom: 1rem;
        padding: 0 1rem;

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
            padding: 0 10px;
            height: 1.5rem;
            line-height: 1.5rem;
            font-size: 12px;
            background-color: #fff7f7;
            border-radius: 1rem;
            color: #999;

            .time {
              margin-left: 5px;
            }
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
    }
  }

  .mask {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 888;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .padding {
    padding: 1rem 0;
  }

  .green {
    background-color: rgba(59, 179, 93, 0.2);
    color: #3bb35d;
  }

  .yellow {
    background-color: rgba(255, 177, 38, 0.2);
    color: #ffb126;
  }

  .red {
    background-color: rgba(255, 49, 38, 0.2);
    color: #ff3126;
  }

  .spaceAround {
    justify-content: space-around !important;

    .all-width {
      width: 100% !important;
    }
  }

  .default {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
  }
}
</style>
