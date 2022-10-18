<template>
  <div id="shareholderCenter">
    <c-title :hide="false" :text='mailFullReturnTitle'></c-title>

    <div class="share_holder">
      <div class="left">

        <span>{{$i18n.t("money")}}{{returnAmountTotal ? returnAmountTotal.toFixed(2) : 0}} </span><br/>
        <span>{{mailFullReturnName}}总额(元)</span>
      </div>
    </div>

    <div class="share_info">
      <div>
        <span>{{$i18n.t("money")}}{{alreadyReturn}}</span><br/>
        已{{mailFullReturnName}}总额(元)
      </div>
      <div>
        <span>{{$i18n.t("money")}}{{notReturn}}</span><br/>
        未{{mailFullReturnName}}总额(元)
      </div>
    </div>


    <div class="shareholder-order" v-if="isShow">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">{{mailFullReturnLog}}</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <!--<el-tab-pane :label="mailFullReturnLog" name="first">-->
            <ul class='rationList'>
              <li v-for="(elem,i) in record" class="list" :key='i'>
                <h4>
                  {{mailFullReturnLog}}ID:{{elem.id}}
                  <span>{{elem.amount}}</span>
                </h4>


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

            <!--</el-tab-pane>-->
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tabs>-->
          <!-- </mt-tab-container> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import full_return_center_controller from "./full_return_center_controller";

export default full_return_center_controller;
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
      box-sizing: border-box;
      background-color: #f15353;

      .left {
        width: 55%;
        text-align: left;
        color: #fff;
        box-sizing: border-box;

        span:first-child {
          font-weight: bold;
          font-size: 20px;
        }

        span {
          line-height: 1.5rem;
          font-size: 14px;
        }
      }

      .right {
        width: 45%;
        padding: 2rem 0.9375rem 0 0;
        box-sizing: border-box;
        color: #fff;
        text-align: right;
        line-height: 1.625rem;
        font-size: 12px;
      }
    }

    .share_info {
      width: 100%;
      padding: 1rem 0;
      background-color: #fff;
      margin-bottom: 0.625rem;
      display: flex;
      justify-content: space-between;

      div:first-child {
        border-right: solid 0.0625rem #ebebeb;
      }

      div {
        font-size: 12px;
        line-height: 1.25rem;
        width: 50%;
        box-sizing: border-box;

        span {
          color: #e84f40;
          font-size: 16px;
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

            h4 {
              width: 100%;
              box-sizing: border-box;
              padding: 0 0.875rem;
              line-height: 2.5rem;
              height: 2.5rem;
              text-align: left;
              color: #333;
              font-size: 14px;
              border-bottom: 0.0625rem solid #ebebeb;

              span {
                display: inline-block;
                font-size: 14px;
                font-weight: normal;
                color: #f15353;
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
                width: 33%;
                float: left;
                font-size: 12px;
                color: #8c9295;
                line-height: 1.375rem;

                span {
                  color: #333;
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
            margin: 0.125rem;

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

        .one {
          padding: 0 0.875rem;

          .time {
            width: 100%;
            line-height: 1.625rem;
            margin-top: 0.625rem;
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
      }
    }
  }
</style>
