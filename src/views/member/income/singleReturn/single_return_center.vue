<template>
  <div id="shareholderCenter">
    <c-title :hide="false" :text='mailSingleReturnTitle'></c-title>

    <div class="share_holder">
      <div class="left">
        <span><b>{{alreadyReturn}} </b></span><br>
        <span>已{{mailSingleReturnName}}总额</span>
      </div>
      <div class="right">
        <span>商品{{mailSingleReturnName}}比例:{{order_return_rate}}% </span><br>
        <span>每期{{mailSingleReturnName}}比例:{{each_return_rate}}%</span>
      </div>
    </div>

    <div class="share_info">
      <div class="left">
        <span>{{returnAmountTotal}}</span><br/>
        {{mailSingleReturnName}}总额
      </div>
      <div>
        <span>{{notReturn}}</span><br/>
        未{{mailSingleReturnName}}总额
      </div>
    </div>


    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">{{mailReturnQueue}}</span>
          </van-tab>
          <van-tab name="second">
            <span slot="title" @click="handleClick('1')">{{mailReturnLog}}</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
          <!--<el-tab-pane :label="mailReturnQueue" name="first">-->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <ul class='rationList'>
              <li v-for="(elem,i) in first_content" :key='i' class="list">
                <h4>
                  {{mailSingleReturnName}}队列ID:{{elem.id}}
                  <span>{{elem.status_name}}</span>
                </h4>
                <ul>
                  <li>
                    总{{mailSingleReturnName}}<br/>
                    <span>{{elem.amount}}</span>
                  </li>
                  <li>
                    已{{mailSingleReturnName}}<br/>
                    <span>{{elem.return_amount}}</span>
                  </li>
                  <li>
                    未{{mailSingleReturnName}}<br/>
                    <span>{{elem.not_return}}</span>
                  </li>
                </ul>

                <div class="one">
                  <div class="time">
                    <span class="left">{{mailSingleReturnName}}时间ID:{{elem.id}}</span>
                    <span class="right">{{elem.created_at}}</span>
                  </div>
                  <div class="Record" @click="toReturnInfo(elem.id)">
                    <span class="left look">查看记录</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <div v-show="activeName=='second'">
            <!-- <mt-tab-container-item id="second"> -->
            <!--<el-tab-pane :label="mailReturnLog" name="second">-->
            <ul class='rationList'>
              <li v-for="(elem,i) in second_content" :key='i' class="recordList">
                {{elem.created_at}}
                <span>{{elem.amount}}</span>
              </li>
            </ul>
            <!--</el-tab-pane>-->
            <!-- </mt-tab-container-item> -->
          </div>
          <!-- </mt-tab-container> -->
        </div>
        <!--</el-tabs>-->
      </div>

    </div>

  </div>
</template>

<script>
import single_return_center_controller from "./single_return_center_controller";

export default single_return_center_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  #shareholderCenter {
    .m_header {
      width: 100%;
      height: 2.8125rem;
      line-height: 2.8125rem;
      font-size: 15px;
      font-weight: bold;
      background: #fff;

      span {
        display: inline-block;
        width: 1rem;
        height: 1.5rem;
        float: left;
        margin-left: 0.625rem;
        font-size: 30px;
      }
    }

    .share_holder {
      padding: 1rem 0.75rem;
      height: 5rem;
      box-sizing: border-box;
      background-color: #f15353;

      .left {
        text-align: center;
        color: #fff;
        box-sizing: border-box;
        float: right;

        span {
          font-size: 14px;
          line-height: 1.5rem;
          display: inline-block;
        }

        b {
          font-size: 18px;
        }
      }

      .right {
        box-sizing: border-box;
        color: #fff;
        text-align: left;
        float: left;
        font-size: 14px;

        span {
          line-height: 1.5rem;
          display: inline-block;
        }
      }
    }

    .share_info {
      width: 100%;
      height: 4.625rem;
      background-color: #fff;
      margin-bottom: 0.625rem;

      .left {
        border-right: solid 0.0625rem #e2e2e2;
      }

      div {
        color: #8c8c8c;
        font-size: 12px;
        margin: 1rem 0;
        line-height: 1.25rem;
        float: left;
        width: 50%;
        box-sizing: border-box;

        span {
          color: #e84f40;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .shareholder-order {
      #tabs {
        .rationList {
          .list {
            margin: 0.375rem 0;
            background-color: #fff;

            .one {
              padding: 0 0.75rem;

              .time {
                width: 100%;
                line-height: 1.625rem;
                display: flex;
                justify-content: space-between;
              }

              .Record {
                width: 100%;
                line-height: 2.75rem;
                display: flex;
                justify-content: space-between;

                i {
                  font-size: 20px;
                  color: #929292;
                  line-height: 2.75rem;
                }
              }

              .left {
                color: #8c8c8c;
                font-size: 14px;
              }

              .look {
                color: #333;
              }

              .right {
                color: #8c8c8c;
                font-size: 14px;
              }
            }

            h4 {
              height: 40px;
              line-height: 40px;
              width: 100%;
              box-sizing: border-box;
              padding: 0.625rem 0.75rem;
              text-align: left;
              color: #333;
              font-size: 14px;
              border-bottom: 0.0625rem solid #ececec;

              span {
                display: inline-block;
                font-size: 14px;
                font-weight: normal;
                color: #f15353;
                border-radius: 0.3125rem;
                float: right;
              }
            }

            ul::after {
              content: "";
              display: block;
              clear: both;
            }

            ul {
              width: 100%;
              padding: 0.625rem 0;

              li {
                width: 33.3%;
                float: left;
                font-size: 12px;
                color: #8c8c8c;
                line-height: 1.375rem;

                span {
                  color: #f15353;
                  font-size: 14px;
                }
              }
            }

            p {
              color: #aab2b9;
              text-align: left;
              box-sizing: border-box;
              padding: 0 1.25rem 0.9375rem;

              span {
                color: #728ae3;
                float: right;
              }
            }
          }

          .recordList {
            padding: 0.9375rem;
            font-size: 14px;
            line-height: 1.125rem;
            color: #333;
            text-align: left;
            background-color: #fff;
            margin-top: 0.0625rem;

            span {
              font-size: 14px;
              float: right;
            }
          }
        }

        .rationList::after {
          content: "";
          display: block;
          clear: both;
        }
      }
    }
  }
</style>
