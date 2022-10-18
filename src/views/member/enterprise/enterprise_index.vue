<template>
  <div id="enterprise">
    <c-title :hide="false" :text='merchant_title'></c-title>
    <div class="content">
      <!--<ul class="tab-btn">
           <li :class="{active:isActive}" @click="changeActive(true)">我的供应商</li>
           <li :class="{active:!isActive}" @click="changeActive(false)">供应商分红详情</li>
       </ul>-->
      <van-tabs v-model="enterpriseBaseActiveName">
        <van-tab name="enterprise">
          <span slot="title" @click="enterpriseBaseHandleClick('0')">{{merchant_people}}</span>
        </van-tab>
        <van-tab name="enterprise_centre">
          <span slot="title" @click="enterpriseBaseHandleClick('1')">{{merchant_center}}</span>
        </van-tab>
      </van-tabs>
      <div>
        <!-- <mt-tab-container v-model="enterpriseBaseActiveName"> -->
        <!--<el-tabs v-model="enterpriseBaseActiveName" @tab-click="enterpriseBaseHandleClick">-->
        <div v-show="enterpriseBaseActiveName=='enterprise'">
          <!-- <mt-tab-container-item id="enterprise"> -->
          <!--<el-tab-pane label="招商员" name="enterprise">-->
          <template>
            <div class="share_holder">
              <div class="header_box">
                <!-- <ul class="left"><li class="lf">{{erchants_name}}</li></ul>
                                <ul class="right"><li class="rt">分红比例:{{erchants_ratio}}%</li></ul> -->
                <ul class="left">
                  <li class="lf"
                      style="line-height: 3rem; text-align: center;">{{erchants_name}}
                  </li>
                </ul>
                <ul class="right">
                  <li class="rt"
                      v-if="enterprise_level_li"><span>{{enterprise_level_title}}</span> <br/><span>{{merchant_reward}}比例:{{enterprise_level_li}}% </span>
                  </li>
                  <li v-if="!enterprise_level_li"
                      style="margin-top: 15px;"><span>{{merchant_reward}}比例:{{erchants_ratio}}% </span></li>
                </ul>
              </div>

              <router-link :to="fun.getUrl('enterprise_supplier')">
                <div class="list1 code">
                  <span class="lf">我的供应商</span>
                  <i class="fa fa-angle-right rt"></i>
                  <span class="rt">{{enterpriseSupplier}}人</span>
                </div>
              </router-link>
              <div class="list1 code"
                   @click="gotoStoreList(1)">
                <span class="lf">我的门店</span>
                <i class="fa fa-angle-right rt"></i>
                <span class="rt">{{enterprise_store_number}}人</span>
              </div>

              <ul class="today_bonus">
                <li v-for="(item,i) in enterpriseRatioDatas"
                    :class="item.name"
                    :key='i'>
                  <span>{{item.money}}</span>
                  <br>
                  <b>{{item.data}}</b>
                </li>
                <li class="line">
                  <div class="careat"></div>
                </li>
              </ul>

            </div>

            <div class="contentDetail">
              <van-tabs v-model="enterpriseActiveName">
                <van-tab name="enterprise_first">
                  <span slot="title" @click="enterpriseHandleClick('0')">全部</span>
                </van-tab>
                <van-tab name="enterprise_second">
                  <span slot="title" @click="enterpriseHandleClick('1')">已结算</span>
                </van-tab>
                <van-tab name="enterprise_third">
                  <span slot="title" @click="enterpriseHandleClick('2')">未结算</span>
                </van-tab>
              </van-tabs>
              <div>
                <!-- <mt-tab-container v-model="enterpriseActiveName"> -->
                <!--<el-tabs v-model="enterpriseActiveName" @tab-click="enterpriseHandleClick">-->
                <div v-show="enterpriseActiveName=='enterprise_first'">
                  <!-- <mt-tab-container-item id="enterprise_first"> -->
                  <!--<el-tab-pane label="全部" name="enterprise_first">-->
                  <ul class='rationList'>
                    <li v-for="(elem,i) in enterprise_first_content"
                        :key='i'>
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             :key='i'
                             v-for="(items,i) in elem.item">
                          <ul class="left">
                            <li>订单号：{{items.order_sn}}</li>
                            <li class="time">时间：{{items.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{items.bonus_money}}</li>
                            <li class="state">{{items.status_name}}</li>
                          </ul>
                        </div>

                      </div>

                    </li>
                  </ul>
                  <!--</el-tab-pane>-->
                  <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="enterpriseActiveName=='enterprise_second'">
                  <!-- <mt-tab-container-item id="enterprise_second"> -->
                  <!--<el-tab-pane label="已结算" name="enterprise_second">-->
                  <ul class='rationList'>
                    <li v-for="(elem,i) in enterprise_second_content"
                        :key='i'>
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             :key='i'
                             v-for="(item,i) in elem.item">
                          <ul class="left">
                            <li>订单号：{{item.order_sn}}</li>
                            <li class="time">时间：{{item.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{item.bonus_money}}</li>
                            <li class="state">{{item.status_name}}</li>
                          </ul>
                        </div>

                      </div>

                    </li>
                  </ul>
                  <!--</el-tab-pane>-->
                  <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="enterpriseActiveName=='enterprise_third'">
                  <!-- <mt-tab-container-item id="enterprise_third"> -->
                  <!--<el-tab-pane label="未结算" name="enterprise_third">-->
                  <ul class='rationList'>
                    <li v-for="(elem,i) in enterprise_third_content"
                        :key='i'>
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             :key='i'
                             v-for="(item,i) in elem.item">
                          <ul class="left">
                            <li>订单号：{{item.order_sn}}</li>
                            <li class="time">时间：{{item.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{item.bonus_money}}</li>
                            <li class="state">{{item.status_name}}</li>
                          </ul>
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

          </template>
          <!-- </mt-tab-container-item> -->
        </div>
        <!--</el-tab-pane>-->
        <div v-show="enterpriseBaseActiveName=='enterprise_centre'">
          <!-- <mt-tab-container-item id="enterprise_centre"> -->
          <!--<el-tab-pane label="招商中心" name="enterprise_centre">-->
          <template>
            <div class="share_holder">
              <div class="header_box">
                <ul class="left">
                  <li class="lf"
                      style="line-height: 3rem; text-align: center;"
                      v-if="enterpriseCenterInfo_1.has_one_level">{{enterpriseCenterInfo_1.realname}}
                  </li>
                </ul>
                <ul class="right">
                  <li class="rt"
                      v-if="enterpriseCenterInfo_1.has_one_level">{{enterpriseCenterInfo_1.has_one_level.level_name}}
                    <br/>{{merchant_reward}}比例:{{enterpriseCenterInfo_1.has_one_level.bonus_ratio}}%
                  </li>
                </ul>
              </div>

              <router-link :to="fun.getUrl('enterprise_center_supplier')">
                <div class="list1 code">
                  <span class="lf">我的供应商</span>
                  <i class="fa fa-angle-right rt"></i>
                  <span class="rt">{{enterpriseCenterSupplier}}人</span>
                </div>
              </router-link>

              <div class="list1 code"
                   @click="gotoStoreList(2)">
                <span class="lf">我的门店</span>
                <i class="fa fa-angle-right rt"></i>
                <span class="rt">{{store_number}}人</span>
              </div>

              <ul class="today_bonus">
                <li v-for="(item,i) in enterpriseCenterRatioDatas"
                    :key='i'
                    :class="item.name">
                  <span>{{item.money}}</span>
                  <br>
                  <b>{{item.data}}</b>
                </li>
                <li class="line">
                  <div class="careat"></div>
                </li>
              </ul>

            </div>

            <div class="contentDetail">
              <van-tabs v-model="enterpriseCenterActiveName">
                <van-tab name="enterprise_center_first">
                  <span slot="title" @click="enterpriseCenterHandleClick('0')">全部</span>
                </van-tab>
                <van-tab name="enterprise_center_second">
                  <span slot="title" @click="enterpriseCenterHandleClick('1')">已结算</span>
                </van-tab>
                <van-tab name="enterprise_center_third">
                  <span slot="title" @click="enterpriseCenterHandleClick('2')">未结算</span>
                </van-tab>
              </van-tabs>
              <div>
                <!-- <mt-tab-container v-model="enterpriseCenterActiveName"> -->
                <!--<el-tabs v-model="enterpriseCenterActiveName" @tab-click="enterpriseCenterHandleClick">-->
                <div v-show="enterpriseCenterActiveName=='enterprise_center_first'">
                  <!-- <mt-tab-container-item id="enterprise_center_first"> -->
                  <!--<el-tab-pane label="全部" name="enterprise_center_first">-->
                  <ul class='rationList'>
                    <li v-for="(elem,i) in enterprise_center_first_content"
                        :key='i'>
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             v-for="item in elem.item"
                             :key="item">
                          <ul class="left">
                            <li>订单号：{{item.order_sn}}</li>
                            <li class="time">时间：{{item.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{item.bonus_money}}</li>
                            <li class="state">{{item.status_name}}</li>
                          </ul>
                        </div>

                      </div>

                    </li>
                  </ul>
                  <!--</el-tab-pane>-->
                  <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="enterpriseCenterActiveName=='enterprise_center_second'">
                  <!-- <mt-tab-container-item id="enterprise_center_second"> -->
                  <!--<el-tab-pane label="已结算" name="enterprise_center_second">-->
                  <ul class='rationList'>
                    <li v-for="elem in enterprise_center_second_content"
                        :key="elem">
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             v-for="item in elem.item"
                             :key="item">
                          <ul class="left">
                            <li>订单号：{{item.order_sn}}</li>
                            <li class="time">时间：{{item.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{item.bonus_money}}</li>
                            <li class="state">{{item.status_name}}</li>
                          </ul>
                        </div>

                      </div>

                    </li>
                  </ul>
                  <!--</el-tab-pane>-->
                  <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="enterpriseCenterActiveName=='enterprise_center_third'">
                  <!-- <mt-tab-container-item id="enterprise_center_third"> -->
                  <!--<el-tab-pane label="未结算" name="enterprise_center_third">-->
                  <ul class='rationList'>
                    <li v-for="elem in enterprise_center_third_content"
                        :key="elem">
                      <div class="detail">
                        <span class="month">{{elem.create_month}}</span>
                        <div class="info"
                             v-for="item in elem.item"
                             :key="item">
                          <ul class="left">
                            <li>订单号：{{item.order_sn}}</li>
                            <li class="time">时间：{{item.created_at}}</li>
                          </ul>
                          <ul class="right">
                            <li>{{item.bonus_money}}</li>
                            <li class="state">{{item.status_name}}</li>
                          </ul>
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
          </template>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container-item> -->
        </div>
        <!--</el-tabs>-->
        <!-- </mt-tab-container> -->
      </div>
    </div>

  </div>
</template>

<script>
import enterprise_index_controller from "./enterprise_index_controller";

export default enterprise_index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #enterprise {
    .share_holder {
      .header_box {
        font-size: 14px;
        padding: 1rem 0.75rem;
        box-sizing: border-box;
        background: #f15353;
        color: #fff;
        overflow: hidden;
        display: flex;
        justify-content: space-between;

        li {
          line-height: 1.5rem;
        }
      }

      .today_bonus {
        width: 100%;
        height: 5.125rem;
        background: #fff;
        padding: 1rem 0;
        box-sizing: border-box;
        position: relative;
        border-bottom: 0.0625rem solid #e2e2e2;

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

        li.data {
          width: 22%;

          span {
            color: #ffa800;
          }
        }

        li:first-child,
        li:nth-child(2) {
          border-right: 0.0625rem solid #e2e2e2;
        }

        li.mounth {
          width: 33%;

          span {
            color: #fc6a70;
          }
        }
      }
    }

    .code {
      margin-bottom: 0.625rem;
      height: 2.75rem;
      background: #fff;
      padding: 0 0.9375rem;
      font-size: 15px;
      line-height: 2.75rem;
      color: #333;
      text-align: left;
      box-sizing: border-box;

      span.rt {
        color: #8c8c8c;
        font-size: 14px;
      }

      i {
        float: right;
        line-height: 2.75rem;
        display: inline-block;
        font-size: 1.5rem;
        margin-left: 0.375rem;
        color: #c9c9c9;
        text-align: center;
        background-size: 1.25rem;
      }
    }

    .content {
      /* .tab-btn{
              margin:0 20px 10px;
              clear:both;
              overflow:hidden;
              li{
                  display:inline-block;
                  width:50%;
                  height:35px;
                  line-height:35px;
                  float:left;
                  background:#fff;
                  color:#f15353;
              }
              li:nth-child(1){
                  border-top-left-radius:6px;
                  border-bottom-left-radius:6px;
              }
              li:nth-child(2){
                  border-top-right-radius:6px;
                  border-bottom-right-radius:6px;
              }
              li.active{
                  background:#f15353;
                  color:#fff;
              }
          } */
      .ratioNav {
        padding: 0;
        margin: 0;
        height: 2.375rem;
        width: 100%;
        background: #fff;
        border-bottom: 0.0625rem solid #e2e2e2;
        border-top: 0.0625rem solid #e2e2e2;

        li {
          float: left;
          width: 33%;
          text-align: center;
          line-height: 2.1875rem;
          font-size: 14px;
          color: #666;
        }
      }

      .rationList {
        padding: 0;
        margin: 0;

        li {
          background: #fff;

          span.month {
            display: block;
            text-align: left;
            line-height: 2.25rem;
            padding: 0 0.75rem;
            font-size: 16px;
            background: #f0f0f0;
          }

          .info {
            border-bottom: 0.0625rem solid #e2e2e2;
            overflow: hidden;
            padding: 0.625rem 0.75rem;
            font-size: 14px;

            .left {
              width: 70%;
              float: left;
              text-align: left;
              box-sizing: border-box;

              li {
                line-height: 1.5rem;
              }

              .time {
                font-size: 12px;
                color: #8c8c8c;
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

              li {
                line-height: 1.5rem;
              }

              .state {
                font-size: 12px;
                color: #8c8c8c;
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
