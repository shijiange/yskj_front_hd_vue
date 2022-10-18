<template >
  <div id="my_love">
    <c-title :hide="false"
             text='我的关注'></c-title>
    <div class="love-content"
         v-if="collect.length>0">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <div v-for="(list,index) in collect"
             :key="index">
          <div class="list"
               @click="toEnroll(item)"
               v-for="(item,index) in list.has_many_activity"
               :key="index">
            <div class="list-image">
              <img :src="item.thumb"
                   class="left">
              <span class="text default"
                    v-show="item.registration_time<=now&&now<item.registration_end_time">报名中</span>
              <span class="text default"
                    v-show="now<item.registration_time">待开始</span>
              <span class="text default"
                    v-show="now>=item.registration_end_time">已结束</span>
            </div>
            <div class="list-info">
              <p>{{item.title}}</p>
              <p class="clock"><span>{{timestampToTime(item.registration_time)}}开始</span></p>
              <p class="bottom-status"><span class="price"><b v-if="item.cash>0.00">{{$i18n.t('money')}}</b>{{item.cash>0.00?item.cash:'免费活动'}}</span><span>{{item.city_name.substr(0,2)}}|{{item.address}}</span></p>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <div class="blank"
         v-if="collect.length<=0">
      <img src="../../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>
  </div>
</template>

<script>
import my_lovecontroller from "./my_lovecontroller";
export default my_lovecontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_love {
  .love-content {
    padding: 1rem;
    padding-bottom: 0.5rem;
    background-color: #fff;

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
          padding: 0 10px;
          padding-left: 20px;
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
