<template>
  <div id="reward_queue"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">
    <c-title :hide="false"
             :text="WXtitle"
             tolink='IntegralGetRecord'>
    </c-title>
    <div id="reward_header">
      <div class="header_box">
        <div class="img">
          <img :src="avatar">
        </div>
        <div class="head_name">
          <span>{{nickname}}</span>
          <!--<span class="title">会员等级：{{level_name}}级</span>-->
        </div>
      </div>
      <div class="reward_box">
        <ul class="reward_a">
          <li><span>{{$i18n.t("money")}}</span>{{Math.floor(summarizing.finish_total*100)/100}}</li>
          <li>累计奖励</li>
        </ul>
        <ul class="reward_b">
          <li><span>{{$i18n.t("money")}}</span>{{Math.floor(summarizing.surplus_total*100)/100}}</li>
          <li>待奖励</li>
        </ul>
        <ul class="reward_c"
            @click="toDetail">
          <li>查看详情 <i class="fa fa-angle-right"></i></li>
        </ul>
      </div>
    </div>
    <div id="queue_content">
      <van-tabs v-model="chooseName" @click="handleClick1">
        <van-tab name="queue" title="奖励队列"></van-tab>
        <van-tab name="record" title="奖励记录"></van-tab>
      </van-tabs>
      <div>
        <!-- <mt-tab-container v-model="chooseName"> -->
        <!--<el-tabs @tab-click="handleClick1" v-model="chooseName">-->
        <div v-show="chooseName=='queue'">
          <!-- <mt-tab-container-item id="queue"> -->
          <!--<el-tab-pane label="奖励队列" name="queue">-->
          <div id="tabs_b"
               v-if="chooseName === 'queue'">
            <van-tabs v-model="activeName"
                      v-show="summarizing.goods_queue_count>-1" @click="handleClick">
              <van-tab name="shop">
                <span slot="title">{{"商品（"+summarizing.goods_queue_count+"）"}}</span>
              </van-tab>
              <van-tab name="store">
                <span slot="title">{{"门店（"+summarizing.store_queue_count+"）"}}</span>
              </van-tab>
              <van-tab name="cashier">
                <span slot="title">{{"收银台（"+summarizing.cashier_queue_count+"）"}}</span>
              </van-tab>
            </van-tabs>
            <div v-show="summarizing.goods_queue_count>-1">
              <!-- <mt-tab-container v-model="activeName" v-show="summarizing.goods_queue_count>-1"> -->
              <!--<el-tabs @tab-click="handleClick" v-model="activeName" v-show="summarizing.goods_queue_count>-1">-->
              <div v-show="activeName=='shop'">
                <!-- <mt-tab-container-item id="shop"> -->
                <!--<el-tab-pane name="shop" :label="'商品（'+summarizing.goods_queue_count+'）'">-->
                <div class="queue_box"
                     v-for="(item,i) of rewardList" :key='i'>
                  <div class="queue_a">
                    <span>奖励队列：{{item.id}}</span>
                    <!-- <span>奖励比例：{{item.ratio}}</span> -->
                  </div>
                  <div class="queue_b">
                    <div class="queue_top">
                      <div class="img">
                        <img :src="item.source_thumb">
                      </div>
                      <span>{{item.source_name}}</span>
                      <button class="btn_a"
                              v-if="item.button.lucky_draw"
                              @click="luckyDraw(item)">
                        {{item.button.lucky_draw.name}}
                      </button>
                    </div>
                    <div class="queue_center">
                      <ul class="reward_queue_a">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_total}}</li>
                        <li>奖励数量</li>
                      </ul>
                      <ul class="reward_queue_b">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_finish}}</li>
                        <li>已奖励</li>
                      </ul>
                      <ul class="reward_queue_c">
                        <li>{{item.status_name}}</li>
                      </ul>
                    </div>

                  </div>
                  <div class="queue_c"
                       v-if="!item.show"
                       @click="showComplete(item)">
                    <span>展示完整信息</span>
                    <i class="iconfont icon-down"></i>
                  </div>
                  <transition name="fade">
                    <div class="button_box"
                         v-if="item.show">
                      <ul class="queue_c_down">
                        <li>
                          <span>订单编号</span>
                          <span>{{item.order_sn}}</span>
                        </li>
                        <li>
                          <span>实付款</span>
                          <span>{{$i18n.t("money")}}{{item.price}}</span>
                        </li>
                        <li>
                          <span>奖励比例：</span>
                          <span>{{item.ratio}}</span>
                        </li>
                      </ul>
                      <div class="queue_bottom">
                        <button v-if="item.button.exchange"
                                class="button_side"
                                @click="exchange(item)">
                          {{item.button.exchange.name}}
                        </button>
                        <button v-if="item.button.process"
                                class="button_side"
                                @click="toProcess(item)">
                          {{item.button.process.name}}
                        </button>
                        <button v-if="item.button.exchange_log"
                                class="button_side"
                                @click="exchangeLog(item)">
                          {{item.button.exchange_log.name}}
                        </button>

                      </div>
                    </div>
                  </transition>
                </div>
                <!--</el-tab-pane>-->
                <!-- </mt-tab-container-item> -->
              </div>
              <div v-show="activeName=='store'">
                <!-- <mt-tab-container-item id="store"> -->
                <!--<el-tab-pane name="store" :label="'门店（'+summarizing.store_queue_count+'）'">-->
                <div class="queue_box"
                     v-for="(item,i) of rewardList" :key='i'>
                  <div class="queue_a">
                    <span>奖励队列：{{item.id}}</span>
                    <!-- <span>奖励比例：{{item.ratio}}</span> -->
                  </div>
                  <div class="queue_b">
                    <div class="queue_top">
                      <div class="img">
                        <img :src="item.source_thumb">
                      </div>
                      <span>{{item.source_name}}</span>
                      <button class="btn_a"
                              v-if="item.button.lucky_draw"
                              @click="luckyDraw(item)">
                        {{item.button.lucky_draw.name}}
                      </button>
                    </div>
                    <div class="queue_center">
                      <ul class="reward_queue_a">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_total}}</li>
                        <li>奖励数量</li>
                      </ul>
                      <ul class="reward_queue_b">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_finish}}</li>
                        <li>已奖励</li>
                      </ul>
                      <ul class="reward_queue_c">
                        <li>{{item.status_name}}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="queue_c"
                       v-if="!item.show"
                       @click="showComplete(item)">
                    <span>展示完整信息</span>
                    <i class="iconfont icon-down"></i>
                  </div>
                  <transition name="fade">
                    <div class="button_box"
                         v-if="item.show">
                      <ul class="queue_c_down">
                        <li>
                          <span>订单编号</span>
                          <span>{{item.order_sn}}</span>
                        </li>
                        <li>
                          <span>实付款</span>
                          <span>{{$i18n.t("money")}}{{item.price}}</span>
                        </li>
                        <li>
                          <span>奖励比例：</span>
                          <span>{{item.ratio}}</span>
                        </li>
                      </ul>
                      <div class="queue_bottom">
                        <button v-if="item.button.exchange"
                                class="button_side"
                                @click="exchange(item)">
                          {{item.button.exchange.name}}
                        </button>
                        <button v-if="item.button.process"
                                class="button_side"
                                @click="toProcess(item)">
                          {{item.button.process.name}}
                        </button>
                        <button v-if="item.button.exchange_log"
                                class="button_side"
                                @click="exchangeLog(item)">
                          {{item.button.exchange_log.name}}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
                <!--</el-tab-pane>-->
                <!-- </mt-tab-container-item> -->
              </div>
              <div v-show="activeName=='cashier'">
                <!-- <mt-tab-container-item id="cashier"> -->
                <!--<el-tab-pane name="cashier" :label="'收银台（'+summarizing.cashier_queue_count+'）'">-->
                <div class="queue_box"
                     v-for="(item,i) of rewardList" :key='i'>
                  <div class="queue_a">
                    <span>奖励队列：{{item.id}}</span>
                    <!-- <span>奖励比例：{{item.ratio}}</span> -->
                  </div>
                  <div class="queue_b">
                    <div class="queue_top">
                      <div class="img">
                        <img :src="item.source_thumb">
                      </div>
                      <span>{{item.source_name}}</span>
                      <button class="btn_a"
                              v-if="item.button.lucky_draw"
                              @click="luckyDraw(item)">
                        {{item.button.lucky_draw.name}}
                      </button>
                    </div>
                    <div class="queue_center">
                      <ul class="reward_queue_a">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_total}}</li>
                        <li>奖励数量</li>
                      </ul>
                      <ul class="reward_queue_b">
                        <li><span>{{$i18n.t("money")}}</span>{{item.amount_finish}}</li>
                        <li>已奖励</li>
                      </ul>
                      <ul class="reward_queue_c">
                        <li>{{item.status_name}}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="queue_c"
                       v-if="!item.show"
                       @click="showComplete(item)">
                    <span>展示完整信息</span>
                    <i class="iconfont icon-down"></i>
                  </div>
                  <transition name="fade">
                    <div class="button_box"
                         v-if="item.show">
                      <ul class="queue_c_down">
                        <li>
                          <span>订单编号</span>
                          <span>{{item.order_sn}}</span>
                        </li>
                        <li>
                          <span>实付款</span>
                          <span>{{$i18n.t("money")}}{{item.price}}</span>
                        </li>
                        <li>
                          <span>奖励队列：</span>
                          <span>{{item.id}}</span>
                        </li>
                      </ul>
                      <div class="queue_bottom">
                        <button v-if="item.button.exchange"
                                class="button_side"
                                @click="exchange(item)">
                          {{item.button.exchange.name}}
                        </button>
                        <button v-if="item.button.process"
                                class="button_side"
                                @click="toProcess(item)">
                          {{item.button.process.name}}
                        </button>
                        <button v-if="item.button.exchange_log"
                                class="button_side"
                                @click="exchangeLog(item)">
                          {{item.button.exchange_log.name}}
                        </button>
                      </div>
                    </div>

                  </transition>
                </div>
                <!--</el-tab-pane>-->
                <!-- </mt-tab-container-item> -->
              </div>
              <!--</el-tabs>-->
              <!-- </mt-tab-container> -->
            </div>
          </div>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="chooseName=='record'">
          <!-- <mt-tab-container-item id="record"> -->
          <!--<el-tab-pane label="奖励记录" name="record">-->
          <div class="queue_box"
               v-show="chooseName === 'record'"
               v-for="(item,i) of rewardList" :key='i'>
            <div class="queue_a">
              <span>奖励队列：{{item.queue_id}}</span>
              <!-- <span>奖励比例：{{item.ratio}}</span> -->
            </div>
            <div class="queue_b">
              <div class="queue_top">
                <div class="img">
                  <img :src="item.source_thumb">
                </div>
                <span>{{item.source_name}}</span>
                <span class="money">{{$i18n.t("money")}}{{item.amount}}</span>
              </div>
              <div class="queue_center">
                <ul class="reward_queue_a">
                  <li><span>{{$i18n.t("money")}}</span>{{item.amount_finish}}</li>
                  <li>已奖励数量</li>
                </ul>
                <ul class="reward_queue_b">
                  <li><span>{{$i18n.t("money")}}</span>{{item.amount_surplus}}</li>
                  <li>未奖励数量</li>
                </ul>
                <ul class="reward_queue_c">
                  <li>{{item.status_name}}</li>
                </ul>
              </div>
            </div>
            <div class="queue_c"
                 v-if="!item.show"
                 @click="showComplete(item)">
              <span>展示完整信息</span>
              <i class="iconfont icon-down"></i>
            </div>
            <transition name="fade">
              <ul class="queue_c_down"
                  v-if="item.show">
                <li>
                  <span>订单编号</span>
                  <span>{{item.order_sn}}</span>
                </li>
                <li>
                  <span>实付款</span>
                  <span>{{$i18n.t("money")}}{{item.price}}</span>
                </li>
                <li>
                  <span>奖励比例：</span>
                  <span>{{item.ratio}}</span>
                </li>
              </ul>
            </transition>
          </div>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container-item> -->
        </div>
        <!-- </mt-tab-container> -->
        <!--</el-tabs>-->
      </div>
    </div>

    <!-- 兑换类型弹窗 -->
    <van-popup v-model="show3"
               position="bottom"
               :style="{height:'60%'}">
      <!-- <c-title :hide="false" :text="'兑换类型'"
              tolink='IntegralGetRecord'>
      </c-title>
      <div style="height:40px"></div> -->
      <div class="queue_type">
        <h1>兑换类型</h1>
        <ul class="selete">
          <li>兑换类型：</li>
          <li>
            <input type="text"
                   v-model="convertType"
                   disabled
                   placeholder="请选择">
            <!-- <i class="fa fa-angle-right"></i> -->
          </li>
        </ul>
        <ul class="type"
            v-if="typeData.modules">
          <li v-if="typeData.modules.love"
              @click="chooseType(typeData.modules.love)">
            <span>{{typeData.modules.love.name}}</span>
            <span :class="convertTypeId===2 ? 'circle choose':'circle'"></span>
          </li>
          <li v-if="typeData.modules.point"
              @click="chooseType(typeData.modules.point)">
            <span>{{typeData.modules.point.name}}</span>
            <span :class="convertTypeId===1 ? 'circle choose':'circle'"></span>
          </li>
        </ul>
        <ul class="queue_info">
          <li>可用兑换数量：{{typeData.exchange_amount}}{{exchange_name || "元"}}</li>
          <li v-show="convertType">当前兑换比例：1{{exchange_name|| "元"}}={{convertTypeUnit}}{{convertType}}</li>
          <li v-show="convertType">可兑换：{{convertTypeExchange_count}}{{convertType}}</li>
        </ul>
        <button class="queue_btn"
                style="border: none;"
                @click="SureExchange">确认兑换
        </button>
      </div>
    </van-popup>
    <!-- end -->

    <!-- 抽奖弹窗 -->
    <van-popup v-model="show1"
               position="bottom"
               :style="{height:'60%'}">
      <div class="prize_box">
        <h1>抽奖提示</h1>
        <ul class="prize_content">
          <li>当前默认奖励比例：{{chooseRatio}}。</li>
          <li>如果您使用抽奖权益，最终奖励比例将以抽奖结
            果为准，可能高于、也可能低于默认奖励比例！
          </li>
        </ul>
        <div class="prize_btn">
          <button style="border: none;" @click="sureTake()">确认抽奖</button>
          <button style="border: none;" @click="show1 = false">取消</button>

        </div>
      </div>
    </van-popup>
    <!-- end -->

    <!-- 抽奖弹窗2 -->
    <van-popup v-model="show2"
               position="bottom"
               :style="{height:'60%'}">
      <div class="prize_box">
        <h1>抽奖结果</h1>
        <ul class="prize_content">
          <li>{{msg}}</li>
        </ul>
        <button class="ture_btn"
                style="border: none;"
                @click="show2 = false">确认
        </button>
      </div>
    </van-popup>
    <!-- end -->

    <!-- 查看兑换记录弹窗 -->
    <van-popup v-model="show4"
               position="bottom"
               :style="{height:'60%'}">
      <div class="reward_record"
           v-if="exchangeLogs.exchange_amount">
        <h1>兑换记录</h1>
        <ul>
          <li>兑换数量:{{exchangeLogs.exchange_amount}}</li>
          <li>兑换比例:{{exchangeLogs.exchange_unit}}</li>
          <li>兑换:{{exchangeLogs.exchange_count}}</li>
        </ul>
        <button class="button"
                style="border: none;"
                @click="show4 = false">关闭
        </button>
      </div>
    </van-popup>
    <!-- end -->
  </div>
</template>

<script>
import reward_queue_controller from "./reward_queue_controller";

export default reward_queue_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #reward_queue {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;

    #reward_header {
      background-color: #fff;

      .header_box {
        display: flex;
        padding: 1.25rem 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .img {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 1.75rem;
          overflow: hidden;
          border: solid 0.0625rem #ebebeb;
          margin-right: 0.625rem;
          background-color: #f8f8f8;

          img {
            width: 100%;
          }
        }

        .head_name {
          text-align: left;

          span {
            width: 17.5625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .title {
            color: #999;
            font-size: 16px;
            font-weight: normal;
          }
        }

        span {
          display: block;
          font-size: 16px;
          font-weight: bold;
          line-height: 3rem;
        }
      }

      .reward_box {
        display: flex;
        padding: 0.75rem 0;

        .reward_a,
        .reward_b {
          width: 33.33%;
          text-align: center;

          li {
            span {
              font-size: 14px;
            }
          }

          li:first-child {
            height: 1.625rem;
            line-height: 1.625rem;
            font-size: 18px;
            font-weight: bold;
          }

          li:last-child {
            line-height: 1.5rem;
            color: #8c8c8c;
            font-size: 14px;
          }
        }

        .reward_c {
          width: 33.33%;
          line-height: 3.125rem;
          font-size: 16px;

          li {
            display: flex;
            justify-content: flex-end;
            padding-right: 0.875rem;
            width: 100%;
            color: #8c8c8c;

            i {
              font-size: 24px;
              line-height: 3.125rem;
              color: #c9c9c9;
              margin-left: 0.625rem;
            }
          }
        }
      }
    }

    #queue_content {
      overflow: scroll;
      margin-top: 0.625rem;

      .queue_box {
        margin-bottom: 0.625rem;
        background-color: #fff;

        .queue_a {
          display: flex;
          justify-content: space-between;
          padding: 0 0.875rem;
          line-height: 2.5rem;
          font-size: 16px;
          // border-bottom: solid 0.0625rem #ebebeb;
          span:first-child {
            font-weight: bold;
          }

          span:last-child {
            // color: #f15353;
          }
        }

        .queue_b {
          .queue_top {
            display: flex;
            padding: 0.625rem 0.875rem;
            position: relative;

            .img {
              width: 2.25rem;
              height: 2.25rem;
              overflow: hidden;
              border-radius: 1.125rem;
              margin-right: 0.625rem;
              background-color: #f8f8f8;

              img {
                width: 100%;
              }
            }

            span:nth-child(2) {
              text-align: left;
              width: 60%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 2.25rem;
            }

            span {
              font-size: 16px;
            }

            .btn_a {
              width: 3.75rem;
              height: 1.625rem;
              border-radius: 0.1875rem;
              border: none;
              background-color: #f15353;
              color: #fff;
              position: absolute;
              right: 0.875rem;
              top: 0.9375rem;
              font-size: 14px;
            }

            .money {
              /* width: 3.75rem; */
              line-height: 2.25rem;
              border-radius: 0.1875rem;
              border: none;
              color: #f15353;
              position: absolute;
              right: 1rem;
              top: 0.75rem;
              font-size: 18px;
            }
          }

          .queue_center {
            display: flex;

            ul {
              width: 33.33%;
              justify-content: center;
            }

            .reward_queue_a,
            .reward_queue_b {
              li:first-child {
                font-size: 16px;
                height: 1.625rem;
                line-height: 1.625rem;
                font-weight: bold;

                span {
                  font-size: 14px;
                }
              }

              li:last-child {
                line-height: 1.5rem;
                color: #8c8c8c;
                font-size: 14px;
              }
            }

            .reward_queue_c {
              font-size: 16px;
              color: #f15353;
              text-align: center;
              line-height: 3.125rem;
            }
          }
        }

        .queue_c {
          display: flex;
          justify-content: center;
          margin-top: 0.75rem;
          // border-top: solid 0.0625rem #ebebeb;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: center;
          font-size: 16px;

          i {
            font-size: 1.5rem;
            color: #666;
          }
        }

        .button_box {
          padding: 0.625rem 0;

          button {
            background: #fff;
            color: #333;
            font-size: 14px;
            border: solid 0.0625rem #ccc;
            border-radius: 1rem;
            height: 1.625rem;
            width: 7.5rem;
            margin: 0 0.625rem;
          }
        }

        .queue_c_down {
          margin-top: 0.75rem;
          border-top: solid 0.0625rem #ebebeb;
          padding: 0.625rem 0.875rem;
          font-size: 14px;

          li {
            display: flex;
            justify-content: space-between;
            line-height: 1.75rem;
          }
        }

        .queue_bottom {
          display: flex;
          justify-content: space-around;
          margin-top: 0.625rem;

          .button_side {
            width: 7.5rem;
            height: 1.875rem;
            background-color: #fff;
            color: #333;
            font-size: 15px;
            border: solid 0.0625rem #ebebeb;
            border-radius: 1.5rem;
          }

          .button_line {
            width: 19.25rem;
            height: 1.875rem;
            border-radius: 0.1875rem;
            border: solid 0.0625rem #f15353;
            color: #f15353;
            font-size: 15px;
          }
        }

        .fade-enter-active {
          transition: 0.5s;
        }

        .fade-enter,
        .fade-leave-active {
          opacity: 0;
          height: 0;
        }
      }
    }
    // 兑换类型css
    .queue_type {
      // position: relative;
      height: 25rem;

      h1 {
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        font-size: 15px;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      .selete {
        display: flex;
        height: 2.8125rem;
        line-height: 2.8125rem;
        margin-left: 0.875rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;

        li:first-child {
          text-align: left;
          flex: 1;
        }

        li:last-child {
          padding-right: 0.875rem;
          flex: 0 0 6rem;
          display: flex;
          justify-content: flex-end;

          input {
            border: none;
            outline: none;
            height: 2.75rem;
            width: 90%;
            font-size: 16px;
            text-align: right;
            margin-right: 0.625rem;
          }

          i {
            line-height: 2.8125rem;
            color: #c9c9c9;
            font-size: 18px;
          }
        }
      }

      .type {
        padding: 0.625rem 0.875rem;

        li {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          height: 2.8125rem;

          span {
            line-height: 2.8125rem;
          }

          .circle {
            width: 20px;
            height: 20px;
            border: 1px solid #ccc;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            top: 0.8rem;
            right: 1rem;
            z-index: 10;
            line-height: 2.8125rem;
            pointer-events: none;
          }

          .choose {
            background: #f15353;
            border: 1px solid #f15353;
          }
        }
      }

      .queue_info {
        background-color: #fafafa;
        padding: 0.625rem 0.875rem;

        li {
          line-height: 1.875rem;
          text-align: left;
          font-size: 15px;
          color: #8c8c8c;
        }
      }

      .queue_btn {
        width: 100%;
        height: 2.8125rem;
        border-radius: 0;
        font-size: 18px;
        background-color: #f15353;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    // end
    //抽奖提示css
    .prize_box {
      // position: relative;
      height: 25rem;

      h1 {
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        font-size: 15px;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      .prize_content {
        padding: 0.625rem 0.875rem;
        font-size: 16px;

        li {
          line-height: 1.875rem;
          text-align: left;
        }
      }

      .ture_btn {
        width: 100%;
        height: 2.8125rem;
        border-radius: 0;
        font-size: 18px;
        background-color: #f15353;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .prize_btn {
        display: flex;
        height: 2.8125rem;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        button:first-child {
          height: 2.8125rem;
          background-color: #f15353;
          border-radius: 0;
          width: 50%;
          font-size: 18px;
          margin: 0;
          color: #fff;
        }

        button:last-child {
          height: 2.8125rem;
          background-color: #ccc;
          border-radius: 0;
          width: 50%;
          font-size: 18px;
          margin: 0;
          color: #fff;
        }
      }
    }
    // 记录弹窗css
    .reward_record {
      background-color: #fff;
      height: 25rem;
      // position: relative;
      h1 {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 16px;
        text-align: center;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      ul {
        padding: 0.625rem 0;

        li {
          padding: 0 0.875rem;
          line-height: 2.25rem;
          text-align: left;
          font-size: 15px;
        }
      }

      button {
        width: 23.4375rem;
        border-radius: 0;
        height: 2.8125rem;
        font-size: 18px;
        color: #fff;
        background-color: #f15353;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }

  #reward_queue::-webkit-scrollbar {
    display: none;
  }

  #reward_queue.pcStyle {
    #queue_content {
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
    }

    #queue_content::-webkit-scrollbar {
      display: none;
    }
  }
</style>
