<template>
  <div id="shareholderCenter">
    <c-title :hide="false" :text='mailTeamReturnTitle'></c-title>

    <div class="share_holder">
      <div class="left">
        <span>{{mailTeamLevel}}:{{team_level}}</span> <br>
        <span>等级权益:{{level_power}}</span>
      </div>
      <div class="right">
        <span class="rem">{{$i18n.t("money")}}{{return_amount}} </span><br>
        <span>已{{mailTeamReturnName}}总额(元)</span>
      </div>
    </div>

    <div class="shareholder-order" style="margin-top: 0.625rem;">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">{{mailReturnLog}}</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
          <!--<el-tab-pane :label="mailReturnLog" name="first">-->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <ul class='rationList'>
              <li :key='i' v-for="(elem,i) in first_content" @click="toReturnInfo(elem.id)" class="recordList">
                <div style="width: 60%; display: inline-block;">
                  <div style="line-height: 1.875rem;">{{mailTeamReturnName}}ID:{{elem.id}}</div>
                  <div style="line-height: 1.875rem;">{{elem.created_at}}</div>
                </div>
                <div style="width: 36%; display: inline-block;"><span>{{elem.amount}}元</span></div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <!--</el-tabs>-->
          <!-- </mt-tab-container> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import single_return_center_controller from "./teamlevel_return_center_controller";

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
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      background-color: #f15353;
      font-size: 14px;

      .right {
        width: 55%;
        text-align: right;
        color: #fff;
        box-sizing: border-box;

        span {
          line-height: 1.5rem;
          display: inline-block;
        }

        .rem {
          font-weight: bold;
          font-size: 20px;
        }
      }

      .left {
        width: 45%;
        box-sizing: border-box;
        color: #fff;
        text-align: left;

        span {
          line-height: 1.5rem;
          display: inline-block;
        }
      }
    }

    .share_info {
      width: 100%;
      height: 4.0625rem;
      background-color: #fff;
      margin-bottom: 0.625rem;

      div {
        color: #737372;
        font-size: 12px;
        padding-top: 0.9375rem;
        float: left;
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
            margin: 0.1875rem 0;
            background-color: #fff;

            h4 {
              width: 100%;
              box-sizing: border-box;
              padding: 0.625rem 1.25rem;
              text-align: left;
              color: #333;
              font-size: 14px;
              border-bottom: 0.0625rem solid #ececec;

              span {
                display: inline-block;
                font-size: 12px;
                padding: 0.0625rem 0.25rem;
                font-weight: normal;
                color: #fff;
                background-color: #f15353;
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

              .left {
                line-height: 1.875rem;
                height: 1.875rem;
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
            padding: 0.625rem 0.875rem;
            font-size: 14px;
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
      }
    }
  }
</style>
