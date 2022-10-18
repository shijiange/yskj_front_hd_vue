<!-- 配送站。服务站 提成明细 -->
<template>
  <div id="commissionList">
    <c-title :hide="false"
             text="提成明细"></c-title>
    <div class="info_box">
      <ul class="today_bonus">
        <li class="date">
          <span>{{datas.today_total_amount}}</span>
          <br>
          <b>今日</b>
        </li>
        <li class="date">
          <span>{{datas.yesterday_total_amount }}</span>
          <br>
          <b>昨日</b>
        </li>
        <li class="date">
          <span>{{datas.thisweek_total_amount}}</span>
          <br>
          <b>本周</b>
        </li>
        <li class="mounth">
          <span>{{datas.thismonth_total_amount}}</span>
          <br>
          <b>本月服务累计津贴</b>
        </li>
        <li class="line">
          <div class="careat"></div>
        </li>
      </ul>
    </div>
    <div class="detail_list_box">
      <van-tabs v-model="active"
                @change="changeClick"
                sticky>
        <van-tab title="全部">
          <van-pull-refresh v-model="isLoading"  @refresh="loadTop" success-duration="刷新成功">
            <div class="detail_list">
              <div class="list"
                   v-for="(item,index) in this.info"
                   :key="index">
                <ul class="number_state_time">
                  <li class="number_time">
                    <span>订单号：{{item.order_sn}}</span></br>
                    <span class="time">{{item.created_at}}</span>
                  </li>
                  <li class="state">
                    <span>{{item.status_name}}</span>
                  </li>
                </ul>
                <ul class="sum_info">
                  <li class="text">
                    <span>订单金额</span>
                    <span>结算金额</span>
                    <span>扣点比例</span>
                    <span>提成金额</span>
                  </li>
                  <li class="number">
                    <span>{{item.order_price}}</span>
                    <span>{{item.amount}}</span>
                    <span>{{item.dividend_rate}}</span>
                    <span class="red">{{item.dividend_amount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已结算">
          <van-pull-refresh v-model="isLoading"  @refresh="loadTop" success-duration="刷新成功">
            <div class="detail_list">
              <div class="list"
                   v-for="(item,index) in this.info"
                   :key="index">
                <ul class="number_state_time">
                  <li class="number_time">
                    <span>订单号：{{item.order_sn}}</span></br>
                    <span class="time">{{item.created_at}}</span>
                  </li>
                  <li class="state">
                    <span>{{item.status_name}}</span>
                  </li>
                </ul>
                <ul class="sum_info">
                  <li class="text">
                    <span>订单金额</span>
                    <span>结算金额</span>
                    <span>扣点比例</span>
                    <span>提成金额</span>
                  </li>
                  <li class="number">
                    <span>{{item.order_price}}</span>
                    <span>{{item.amount}}</span>
                    <span>{{item.dividend_rate}}</span>
                    <span class="red">{{item.dividend_amount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="未结算">
          <van-pull-refresh v-model="isLoading"  @refresh="loadTop" success-duration="刷新成功">
            <div class="detail_list">
              <div class="list"
                   v-for="(item,index) in this.info"
                   :key="index">
                <ul class="number_state_time">
                  <li class="number_time">
                    <span>订单号：{{item.order_sn}}</span></br>
                    <span class="time">{{item.created_at}}</span>
                  </li>
                  <li class="state">
                    <span>{{item.status_name}}</span>
                  </li>
                </ul>
                <ul class="sum_info">
                  <li class="text">
                    <span>订单金额</span>
                    <span>结算金额</span>
                    <span>扣点比例</span>
                    <span>提成金额</span>
                  </li>
                  <li class="number">
                    <span>{{item.order_price}}</span>
                    <span>{{item.amount}}</span>
                    <span>{{item.dividend_rate}}</span>
                    <span class="red">{{item.dividend_amount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import commissionListController from "./commissionList_controller";
export default commissionListController;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#commissionList {
  .info_box {
    margin: 0.625rem 0;

    .today_bonus {
      margin-top: 0.625rem;
      width: 100%;
      height: 5.125rem;
      background: #fff;
      padding: 1rem 0;
      box-sizing: border-box;
      position: relative;

      li.line {
        position: absolute;
        width: 0.0625rem;
        height: 3.25rem;
        background: #ddd;
        top: 1rem;
        right: 34%;

        .careat {
          width: 0.375rem;
          height: 0.375rem;
          border: 0.0625rem solid #ddd;
          border-left: 0;
          border-bottom: 0;
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          -o-transform: rotate(45deg);
          transform: rotate(45deg);
          background: #fff;
          position: absolute;
          top: 1.4375rem;
          right: -0.1875rem;
        }
      }

      li {
        text-align: center;
        float: left;

        span {
          font-size: 17px;
          line-height: 1.625rem;
          margin-bottom: 0.625rem;
          display: inline-block;
        }

        b {
          font-size: 11px;
          color: #333;
        }
      }

      .date {
        width: 22%;

        span {
          color: #ffa800;
        }
      }

      li:first-child,
      li:nth-child(2) {
        border-right: 0.0625rem solid #e2e2e2;
      }

      .mounth {
        width: 33%;

        span {
          color: #fc6a70;
        }
      }
    }
  }

  .detail_list_box {
    background: #fff;

    .detail_list {
      .list {
        border-top: solid 0.0625rem #ebebeb;
        padding-bottom: 0.625rem;

        .number_state_time {
          display: flex;
          justify-content: space-between;
          padding: 0.625rem 0.875rem;

          .number_time {
            font-size: 14px;
            text-align: left;
            line-height: 1.5rem;

            .time {
              color: #8c8c8c;
              font-size: 12px;
            }
          }

          .state {
            font-size: 14px;
            text-align: right;
          }
        }

        .sum_info {
          .text {
            display: flex;
            justify-content: space-around;
            color: #8c8c8c;
            font-size: 14px;
            line-height: 1.875rem;

            span {
              display: block;
              width: 25%;
              text-align: center;
            }
          }

          .number {
            display: flex;
            font-size: 16px;
            line-height: 1.875rem;
            justify-content: space-around;

            span {
              display: block;
              width: 25%;
              text-align: center;
            }

            .red {
              color: #f15353;
            }
          }
        }
      }

      .list:first-child {
        border: none;
      }
    }
  }
}
</style>