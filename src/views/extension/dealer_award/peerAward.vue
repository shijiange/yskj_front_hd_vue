<template>
  <div id="peerAwardes">
    <c-title :hide="false"
             text="经销商平级奖"></c-title>
    <div class="share_holder">
      <div class="header_box">
        <div class="left">
          <span>{{ dataList[active].level.level_name||'' }}</span>
        </div>
        <ul class="right">
          <li>提成比例:{{ dataList[active].level.dividend_ratio||'' }}%</li>
          <li>下级提成比例:{{ dataList[active].level.next_dividend_ratio||'' }}%</li>
        </ul>
      </div>
      <div class="code_box">
        <router-link :to="fun.getUrl('peerAwardes_withdraw')">
          <div class="list1 code">
            <div class="ico extension"></div>
            手动提现
            <i class="fa fa-angle-right"></i>
          </div>
        </router-link>
      </div>
    </div>

    <div class="money">
      <ul class="gongge">
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>未结算佣金</span>
          <em style="color: #f15353;">{{ dataList[active].statistics.wait_amount_total||'0' }}元</em>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>已结算佣金</span>
          <em style="color: #f15353;">{{ dataList[active].statistics.settled_amount_total||'0' }}元</em>
        </li>
      </ul>
    </div>

    <div class="content">
      <van-tabs v-model="activeName">
        <van-tab name="first">
			<span slot="title" @click="getData(0,true)">提成</span>
		</van-tab>
        <van-tab name="second">
			<span slot="title" @click="getData(1,true)">平级奖</span>
		</van-tab>
      </van-tabs>
      <div>
      <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'">
        <!-- <mt-tab-container-item id="first"> -->
          <ul class="rationList">
            
            <li v-for="(elem,index1) in dataList[0].list"
                :key='index1'>
              <div class="detail">
                <span class="month">{{ elem.create_month }}</span>
                <div class="info"
                     v-for="(item,index2) in elem.has_many_dividend"
                     :key='index2'>
                  <div @click="openDetail(index1,index2)"
                       class="info-div">
                    <ul class="left">
                      <li>订单号：{{ item.order_sn }}</li>
                      <li class="time">时间：{{ item.created_at }}</li>
                    </ul>
                    <ul class="right">
                      <li>{{ item.dividend_amount }}</li>
                      <li class="state">{{ item.status_name }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <img src="../../../assets/images/blank.png"
                 alt=""
                 v-if="!loading&&fun.isTextEmpty(dataList[0].list)"
                 class="blank_img">
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='second'">
        <!-- <mt-tab-container-item id="second"> -->
          <ul class="rationList">
            <li v-for="(elem,index1) in dataList[1].list"
                :key='index1'>
              <div class="detail">
                <span class="month">{{ elem.create_month }}</span>
                <div class="info"
                     v-for="(item,index2) in elem.has_many_dividend"
                     :key='index2'>
                  <div @click="openDetail(index1,index2)"
                       class="info-div">
                    <ul class="left">
                      <li>订单号：{{ item.order_sn }}</li>
                      <li class="time">时间：{{ item.created_at }}</li>
                    </ul>
                    <ul class="right">
                      <li>{{ item.dividend_amount }}</li>
                      <li class="state">{{ item.status_name }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <img src="../../../assets/images/blank.png"
                 alt=""
                 v-if="!loading&&fun.isTextEmpty(dataList[1].list)"
                 class="blank_img">
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
      <!-- </mt-tab-container> -->
      </div>
    </div>
  </div>
</template>

<script>
import peerAward_controller from "./peerAward_controller";

export default peerAward_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: border-box;
}

.money {
  margin-top: 0.5rem;
}

.gongge {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  column-count: 3;
  padding-bottom: 0.625rem;
  padding-top: 0.625rem;

  li {
    width: 50%;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 12px;

    i {
      flex: 0 0 1.75rem;
      font-size: 26px;
      color: #999;
      display: inline-block;
      margin-bottom: 0.375rem;
      width: 100%;
    }

    span {
      flex: 0 0 1.4rem;
      color: #333;
      font-size: 12px;
    }

    b {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #f15353;
      font-size: 16px;
    }
  }
}

#peerAwardes {
  .blank_img {
    width: 5rem;
    margin-top: 5rem;
  }

  .share_holder {
    .header_box {
      padding: 1rem 0.75rem;
      background: #f15353;
      color: #fff;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      .left {
        line-height: 3rem;
      }

      .right {
        text-align: right;

        li {
          line-height: 1.5rem;
        }
      }
    }
  }

  .code_box {
    background: #fff;
    padding-left: 0.875rem;
  }

  .code {
    /* height: 2.75rem; */
    background: #fff;
    padding-right: 0.875rem;
    font-size: 15px;
    line-height: 2.75rem;
    color: #333;
    text-align: left;
    box-sizing: border-box;
    border-bottom: solid 0.0625rem #ebebeb;

    i {
      float: right;
      line-height: 2.75rem;
      display: inline-block;
      font-size: 24px;
      color: #c9c9c9;
      text-align: center;
      background-size: 1.25rem;
    }
  }

  .content {
    margin-top: 10px;

    .rationList {
      padding: 0;
      margin: 0;

      li {
        span.month {
          display: block;
          text-align: left;
          line-height: 2.25rem;
          padding: 0 0.75rem;
          background: #f0f0f0;
          font-size: 16px;
        }

        .info {
          border-bottom: 0.0625rem solid #eee;
          overflow: hidden;
          padding: 0.625rem 0.75rem;
          background: #fff;
          font-size: 14px;

          .info-div {
            width: 100%;
            float: left;
          }

          .left {
            width: 70%;
            float: left;
            text-align: left;
            box-sizing: border-box;

            .time {
              font-size: 12px;
              color: #8c8c8c;
            }

            li {
              line-height: 1.5rem;
            }

            span {
              font-size: 14px;
              font-weight: 400;
              color: #333;
            }

            p {
              font-size: 12px;
              color: #999;
            }

            span.created {
              font-size: 12px;
            }

            h4 {
              font-weight: normal;

              b {
                font-weight: normal;
                color: #f15353;
              }
            }
          }

          .right {
            float: left;
            width: 30%;
            color: #20b86a;
            text-align: right;

            .state {
              font-size: 12px;
              color: #8c8c8c;
            }

            li {
              line-height: 1.5rem;
            }

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
              color: #888;
            }

            b {
              font-weight: normal;
            }

            b.created {
              line-height: 2.1875rem;
            }
          }
        }
      }
    }
  }
}
</style>
