<!-- 直播分红 -->
<template >
  <div id="liveDividend">
    <c-title :hide="false" text="主播分红"></c-title>
    <div class="content">
      <div class="background">
        <div class="user">
          <div class="user-head">
            <img :src="bonus.avatar">
          </div>
          <div class="user-name">{{bonus.nickname}}</div>
        </div>
      </div>
      <div class="absolute-block">
        <div class="right">
          <span class="first"><b>{{bonus.unsettled_money}}</b></span>
          <span class="second">未结算</span>
        </div>
        <div class="line"></div>
        <div class="right">
          <span class="first"><b>{{bonus.settled_money}}</b></span>
          <span class="second">已结算</span>
        </div>
      </div>

      <div class="list">
        <van-tabs v-model="active" sticky :offset-top=40 swipeable @change='changeTab'>
          <van-tab title="全部">
            <div class="award-list bgBai">
              <ul>
                <li class="list-item"
                    v-for="(item,index) in dividend" :key='index'>
                  <div class="block">
                    <div class="left">
                      <div>{{item.order_sn}}</div>
                      <div class="date">{{item.created_at}}</div>
                    </div>
                    <div class="right">
                      <span>{{$i18n.t('money')}}{{item.bonus_amount}}</span>
                      <span class="date">{{item.status ==0?'未结算':(item.status ==1?'已结算':'已失效')}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="blank"
                 v-if="fun.isTextEmpty(dividend)">
                <img src="../../assets/images/blank.png">
                <span>还没有记录哦</span>
              </div>
            </div>
          </van-tab>

          <van-tab title="未结算">
            <div class="award-list bgBai">
              <ul>
                <li class="list-item"
                    v-for="(item,index) in dividend" :key='index'>
                  <div class="block">
                    <div class="left">
                      <div>{{item.order_sn}}</div>
                      <div class="date">{{item.created_at}}</div>
                    </div>
                    <div class="right">
                      <span>{{$i18n.t('money')}}{{item.bonus_amount}}</span>
                      <span class="date">{{item.status ==0?'未结算':(item.status ==1?'已结算':'已失效')}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="blank"
                 v-if="fun.isTextEmpty(dividend)">
                <img src="../../assets/images/blank.png">
                <span>还没有记录哦</span>
              </div>
            </div>
          </van-tab>

          <van-tab title="已结算">
            <div class="award-list bgBai">
              <ul>
                <li class="list-item"
                    v-for="(item,index) in dividend" :key='index'>
                  <div class="block">
                    <div class="left">
                      <div>{{item.order_sn}}</div>
                      <div class="date">{{item.created_at}}</div>
                    </div>
                    <div class="right">
                      <span>{{$i18n.t('money')}}{{item.bonus_amount}}</span>
                      <span class="date">{{item.status ==0?'未结算':(item.status ==1?'已结算':'已失效')}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="blank"
                 v-if="fun.isTextEmpty(dividend)">
                <img src="../../assets/images/blank.png">
                <span>还没有记录哦</span>
              </div>
            </div>
          </van-tab>

          <van-tab title="已失效">
            <div class="award-list bgBai">
              <ul>
                <li class="list-item"
                    v-for="(item,index) in dividend" :key='index'>
                  <div class="block">
                    <div class="left">
                      <div>{{item.order_sn}}</div>
                      <div class="date">{{item.created_at}}</div>
                    </div>
                    <div class="right">
                      <span>{{$i18n.t('money')}}{{item.bonus_amount}}</span>
                      <span class="date">{{item.status ==0?'未结算':(item.status ==1?'已结算':'已失效')}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="blank"
                 v-if="fun.isTextEmpty(dividend)">
                <img src="../../assets/images/blank.png">
                <span>还没有记录哦</span>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>

import liveDividend_Controller from "./liveDividend_Controller";
export default liveDividend_Controller;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#liveDividend {
  .content {
    .background {
      width: 100%;
      height: 11rem;
      background: #f15353;
      display: flex;
      padding-top: 1rem;
      justify-content: center;

      .user {
        display: flex;
        flex-direction: column;
        align-items: center;

        .user-head {
          height: 4rem;
          width: 4rem;
          background: #fff;
          border-radius: 50%;
          border: 0.125rem solid #fff;
          box-sizing: border-box;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .user-head img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .user-name {
          font-size: 16px;
          color: #fff;
          width: 8.5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }

    .absolute-block {
      width: 22rem;
      background-color: #fff;
      border-radius: 0.5rem;
      margin: -3.5rem auto 2rem;
      // transform: translateY(-40%);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 1.8rem 1rem;

      .left {
        width: 33%;
        display: flex;
        flex-direction: column;

        .first {
          color: #000;
          font-size: 16px;
          line-height: 2rem;
        }

        .second {
          font-size: 12px;
          color: #333;
        }
      }

      .right {
        width: 49%;
        display: flex;
        flex-direction: column;

        .first {
          line-height: 2rem;
          color: #000;
          font-size: 18px;
        }

        .second {
          line-height: 2rem;
          font-size: 12px;
          color: #333;
        }
      }

      .line {
        height: 2rem;
        width: 1px;
        background-color: #d1d1d1;
      }
    }

    .list {
      width: 22rem;
      margin: 0 auto;
      border-radius: 0.5rem;
      margin-top: -1rem;
      margin-bottom: 1rem;
      overflow: hidden;

      #tabs {
        width: 100%;
        display: flex;

        .tab {
          height: 2rem;
          line-height: 2rem;
          background-color: #fff;
          color: #aaa;
          font-size: 14px;
          width: 50%;
          position: relative;

          span {
            line-height: 2rem;
            display: inline-block;
          }
        }

        .tab:first-child {
          border-top-left-radius: 0.5rem;
        }

        .tab:last-child {
          border-top-right-radius: 0.5rem;
        }

        .tab-first::after {
          content: "";
          position: absolute;
          right: 0;
          width: 0;
          height: 2rem;
          border-bottom: 2rem solid #fff;
          border-left: 0.6rem solid transparent;
        }

        .tab-second::before {
          content: "";
          position: absolute;
          left: 0;
          width: 0;
          height: 2rem;
          border-bottom: 2rem solid #fff;
          border-right: 0.6rem solid transparent;
        }
      }

      .award-list {
        padding: 1rem;
        text-align: left;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;

        ul {
          .list-item {
            display: flex;
            flex-wrap: wrap;
            border-bottom: solid 1px #f3f3f3;
            padding-bottom: 0.625rem;
            padding-top: 0.625rem;

            .list-item:first-child {
              padding-top: 0;
            }

            .block {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .left {
              .stateClass {
                border: 1px solid #ff6000;
                color: #ff6000;
                border-radius: 0.438rem;
                font-size: 12px;
                padding: 0 0.25rem;
                margin-left: 0.25rem;
              }

              .date {
                color: #c1c1c1;
                font-size: 12px;
                margin-top: 0.35rem;
              }
            }

            .right {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-direction: column;
              font-size: 16px;
              color: #ff6000;
              text-align: right;

              .date {
                color: #c1c1c1;
                font-size: 12px;
                margin-top: 0.35rem;
              }
            }

            .hide {
              display: flex;
              justify-content: center;
              width: 100%;
              padding-top: 1rem;

              ul {
                display: flex;
                width: 100%;

                li {
                  display: flex;
                  width: 33.3%;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  font-size: 12px;
                  border-right: solid 1px #e1e1e1;

                  .first {
                    margin-bottom: 0.5rem;
                  }
                }

                li:last-child {
                  border-right: none;
                }
              }
            }
          }
        }
      }

      .care-list {
        padding: 1rem;
        text-align: left;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;

        ul {
          .list-item {
            display: flex;
            flex-wrap: wrap;
            border-bottom: solid 1px #f3f3f3;
            padding-bottom: 0.625rem;
            padding-top: 0.625rem;

            .list-item:first-child {
              padding-top: 0;
            }

            .block {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .left {
              .date {
                color: #c1c1c1;
                font-size: 12px;
                margin-top: 0.35rem;
              }
            }

            .right {
              font-size: 18px;
              color: #ff6000;
            }

            .hide {
              display: flex;
              justify-content: center;
              width: 100%;
              padding-top: 1rem;

              ul {
                display: flex;
                width: 100%;

                li {
                  display: flex;
                  width: 25%;
                  font-size: 12px;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  border-right: solid 1px #e1e1e1;

                  .first {
                    margin-bottom: 0.5rem;
                  }
                }

                li:last-child {
                  border-right: none;
                }
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

  .bgColor {
    background-color: #fff !important;
    color: #ff7459 !important;

    span {
      border-bottom: 2px solid #ff7459;
    }
  }

  .bgBai {
    background-color: #fff;
  }
}
</style>
