<template >
  <div id="search_result">
    <c-title :hide="false"
             text='搜索结果'></c-title>
    <div id="content">
      <div class="search_box">
        <div class="input_box">
          <i class="iconfont icon-sousuo1"></i>
          <input type="text"
                 placeholder="搜索你喜欢的活动"
                 @keypress="enterSearch"
                 v-model="keyword">
        </div>
        <span @click="search">搜索</span>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <div class="result-list"
             v-if="result.length>0">
          <div class="list"
               @click="toEnroll(item)"
               v-for="(item,index) in result"
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
      </van-pull-refresh>
      <div class="blank"
           v-if="result.length<=0">
        <img src="../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import search_resultcontroller from "./search_resultcontroller";
export default search_resultcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#search_result {
  #content {
    background-color: #fff;

    .result-list {
      padding: 1rem 0;
    }

    .search_box {
      width: 100%;
      background: #fff;
      padding: 0.625rem 0.9375rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: solid 0.0625rem #ebebeb;

      .fa {
        font-size: 1.5rem;
        color: #999;
      }

      .input_box {
        width: 70%;
        height: 1.875rem;
        border-radius: 1rem;
        background: #f5f5f5;
        padding: 0 0.625rem;
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 1rem;
          margin-right: 0.375rem;
          color: #999;
        }

        input {
          width: 100%;
          border: none;
        }
      }

      span {
        display: block;
        color: #1c96fe;
        font-size: 14px;
      }
    }

    .list:last-child {
      margin-bottom: 0;
    }

    .list {
      display: flex;
      margin-bottom: 1rem;
      padding: 0 0.5rem;

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

  .default {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
  }
}
</style>
