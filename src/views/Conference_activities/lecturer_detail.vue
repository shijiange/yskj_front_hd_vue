<template >
  <div id="lecturer_detail">
    <c-title :hide="false"
             text='讲师详情'></c-title>
    <div class="lecturer-content">
      <div class="top">
        <div class="user">
          <div class="user-info">
            <div class="user-avator">
              <img :src="lecturer.t_image">
            </div>
            <span class="name">{{lecturer.nickname}}</span>
          </div>
        </div>
        <div class="introduce">
          <p>{{introduce}}</p>
        </div>
        <div class="Number">
          <div class="activities">
            <span>活动项目</span>
            <span class="project">{{total}}</span>
          </div>
          <div class="line">|</div>
          <div class="shop">
            <span>课程商品</span>
            <span class="shop-item">{{shopTotal}}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <van-tabs v-model="activeName" @click="handleClick">
          <van-tab name="first" title="活动项目"></van-tab>
          <van-tab name="second" title="课程商品"></van-tab>
        </van-tabs>
        <div>
          <div v-show="activeName=='first'">
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功"  v-if="datas.length>0">
              <ul>
                <li class="list"
                    v-for="(list,index) in datas"
                    :key="index">
                  <div class="list-image">
                    <img :src="list.thumb"
                         class="left"
                         @click="toEnroll(list)">
                    <span class="text default"
                          v-show="list.registration_time<=now&&now<list.registration_end_time">报名中</span>
                    <span class="text default"
                          v-show="now<list.registration_time">待开始</span>
                    <span class="text default"
                          v-show="now>=list.registration_end_time">已结束</span>
                  </div>
                  <div class="list-info">
                    <!-- <p>{{list.title}}</p> -->
                    <p class="clock"><i class="iconfont icon-service_j"></i><span>{{timestampToTime(list.registration_time)}}开始</span></p>
                    <p class="bottom-status"><span class="price"
                            v-if="list.cash>0.00"><b>{{$i18n.t('money')}}</b>{{list.cash}}</span><span class="cash"
                            v-if="list.cash<=0.00">免费</span><span>{{list.city_name.substr(0,2)}}|{{list.address}}</span></p>
                  </div>
                </li>
              </ul>
            </van-pull-refresh>
            <div class="blank"
                 v-if="datas.length<=0">
              <img src="../../assets/images/blank.png">
              <span>还没有记录哦</span>
            </div>
          </div>
          <div v-show="activeName=='second'">
            <van-pull-refresh v-model="isLoading" @refresh="loadShop" success-text="刷新成功"  v-if="shop.length>0">
              <ul class="shop-list">
                <li class="shop-item"
                    @click="gotoDetail(item)"
                    v-for="(item,index) in shop"
                    :key="index">
                  <div>
                    <img :src="item.thumb">
                  </div>
                  <p class="text">{{item.title}}</p>
                  <div class="item-price">
                    <p><span class="once"><b>¥</b>{{item.price}}</span><del>¥{{item.market_price}}</del></p>
                  </div>
                </li>
              </ul>
            </van-pull-refresh>
            <div class="blank"
                 v-if="shop.length<=0">
              <img src="../../assets/images/blank.png">
              <span>还没有记录哦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lecturer_detailcontroller from './lecturer_detailcontroller';
export default lecturer_detailcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#lecturer_detail {
  .lecturer-content {
    .top {
      background-color: #fff;
      padding-top: 0.8rem;
      padding-bottom: 1rem;
      padding-left: 0.5rem;

      .user {
        display: flex;
        justify-content: center;

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;

          .user-avator {
            height: 4rem;
            width: 4rem;
            background: #fff;
            border-radius: 50%;
            border: 0.125rem solid #fff;
            box-sizing: border-box;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            margin-top: 10px;
          }
        }
      }

      .Number {
        margin-top: 1rem;
        display: flex;
        justify-content: center;

        .activities {
          display: flex;
          align-items: center;

          .project {
            margin-left: 1rem;
          }
        }

        .line {
          margin: 0 1rem;
        }

        .shop {
          display: flex;
          align-items: center;

          .shop-item {
            margin-left: 1rem;
          }
        }
      }

      .introduce {
        color: #666;
        width: 80%;
        margin: 0 auto;
        margin-top: 5px;

        p {
          text-align: left;
        }
      }
    }

    .bottom {
      background-color: #fff;
      margin-top: 1rem;

      .list:last-child {
        margin-top: 0;
      }

      .list {
        display: flex;
        margin: 1rem;

        .list-image {
          width: 8rem;
          height: 7rem;
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
            padding-left: 10px;
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
              font-size: 16px;
            }

            .price {
              text-align: left;
              color: #f15353;
              font-size: 16px;

              b {
                font-size: 12px;
              }
            }
          }
        }
      }

      .shop-list {
        background-color: #f5f5f5;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;

        .shop-item {
          margin-top: 1rem;
          margin-right: 0.4rem;
          width: 11rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: #fff;

          .item-price {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;

            .once {
              color: #f15353;
              margin-right: 0.5rem;
              font-size: 16px;

              b {
                font-size: 12px;
              }
            }

            del {
              color: #8c8c8c;
            }

            .sale {
              color: #8c8c8c;
            }
          }

          img {
            width: 100%;
            height: 100%;
            margin-bottom: 0.5rem;
          }

          .text {
            padding-left: 0.5rem;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;

            /* autoprefixer: off */
            -webkit-box-orient: vertical;
          }
        }

        .shop-item:nth-child(2n) {
          margin-right: 0;
        }
      }

      .blank {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 2rem;
        background-color: #f5f5f5;

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
