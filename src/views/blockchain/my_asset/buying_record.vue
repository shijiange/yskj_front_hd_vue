<template>
  <div id="buying_record">
    <c-title :hide="false" :text="title+'记录'"></c-title>
    <div id="content">
      <!-- 导航 -->
      <div class="nav_box">
        <ul class="nav">
          <li :class="chooseItem === index ? 'current':''" v-for="(item,index) of Record"
              @click.stop="chooseRecord(index,item)" :key='index'>
            {{item}}记录
          </li>
        </ul>
      </div>

      <van-pull-refresh v-model="isLoading" @refresh="loadTop">
        <!--<transition name="fadeLeft">-->
          <!--&lt;!&ndash; 认购记录 &ndash;&gt;-->
          <!--<div class="buy_info" v-if="chooseItem === 0">-->
            <!--<div class="info_a">-->
              <!--<div class="classify">-->
                <!--<h1>{{lang.subscription_name}}记录</h1>-->
                <!--&lt;!&ndash;<span @click="showClassify">分类<i class="iconfont icon-down"></i></span>&ndash;&gt;-->
                <!--<div class="info_time">-->
                  <!--<i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>-->
                  <!--<span v-if="chooseDate">时间:{{showChooseDate}}</span>-->
                  <!--<i @click="openPicker" class="iconfont icon-record_time"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<ul class="number">-->
                <!--<li>累计{{lang.buy_name}}：{{recordData.sum_amount}}</li>-->
                <!--&lt;!&ndash;<li>累计售出：-{{recordData.sell_total}}</li>&ndash;&gt;-->
              <!--</ul>-->
            <!--</div>-->
            <!--<div class="info_b">-->
              <!--<ul class="list" @click="toDetail(item,'buy')" v-for="(item,i) in recordList" :key='i'>-->
                <!--<li>-->
                  <!--<span>{{item.order_sn}}</span>-->
                  <!--<span>{{item.amount}}</span>-->
                <!--</li>-->
                <!--<li>-->
                  <!--<span>{{item.created_at}}</span>-->
                  <!--<span>{{lang.subscription_name}}（单价：{{$i18n.t('money')}}{{item.price}}）</span>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->

        <!--<transition name="fadeLeft">-->
          <!--&lt;!&ndash; 出售记录 &ndash;&gt;-->
          <!--<div class="buy_info" v-if="chooseItem === 1">-->
            <!--<div class="info_a">-->
              <!--<div class="classify">-->
                <!--<h1>{{lang.sell_name}}记录</h1>-->
                <!--<span @click="showClassify1">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>-->
                <!--<div class="info_time">-->
                  <!--<i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>-->
                  <!--<span v-if="chooseDate">时间:{{showChooseDate}}</span>-->
                  <!--<i @click="openPicker" class="iconfont icon-record_time"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<ul class="number">-->
                <!--<li>累计{{lang.sell_name}}：{{recordData.sum_amount}}</li>-->
              <!--</ul>-->
            <!--</div>-->
            <!--<div class="info_b">-->
              <!--<ul class="list" @click="toDetail(item,'sell')" v-for="(item,i) in recordList" :key='i'>-->
                <!--<li>-->
                  <!--<span>{{item.digitization_name}}</span>-->
                  <!--<span>{{item.amount}}</span>-->
                <!--</li>-->
                <!--<li>-->
                  <!--<span>{{item.created_at}}</span>-->
                  <!--<span>{{item.status_name}}（单价：{{$i18n.t('money')}}{{item.price}}）</span>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->

        <transition name="fadeLeft">
          <!-- 转让记录 -->
          <div class="buy_info" v-if="chooseItem === 0">
            <div class="info_a">
              <div class="classify">
                <h1>转让记录</h1>
                <span @click="showClassify1">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>
                <div class="info_time">
                  <i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>
                  <span v-if="chooseDate">时间:{{showChooseDate}}</span>
                  <i @click="openPicker" class="iconfont icon-record_time"></i>
                </div>
              </div>
              <ul class="number">
                <li>累计转入：{{recordData.transfer_into_sum}}</li>
                <li>累计转出：{{recordData.transfer_out_sum}}</li>
              </ul>
            </div>
            <div class="info_b">
              <ul class="list" v-for="(item,i) in recordList" :key='i'>
                <li>
                  <span>{{item.nickname}}【ID：{{item.id}}】</span>
                  <span>{{item.change}}</span>
                </li>
                <li>
                  <span>{{item.created_at}}</span>
                  <span>{{item.category}}（含手续费：{{$i18n.t('money')}}{{item.poundage}}）</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <!--<transition name="fadeLeft">-->
          <!--&lt;!&ndash; 买入记录 &ndash;&gt;-->
          <!--<div class="buy_info" v-if="chooseItem === 3">-->
            <!--<div class="info_a">-->
              <!--<div class="classify">-->
                <!--<h1>{{lang.buy_name}}记录</h1>-->
                <!--&lt;!&ndash;<span @click="showClassify1">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>&ndash;&gt;-->
                <!--<div class="info_time">-->
                  <!--<i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>-->
                  <!--<span v-if="chooseDate">时间:{{showChooseDate}}</span>-->
                  <!--<i @click="openPicker" class="iconfont icon-record_time"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<ul class="number">-->
                <!--<li>累计{{lang.buy_name}}：{{recordData.sum_amount}}</li>-->
              <!--</ul>-->
            <!--</div>-->
            <!--<div class="info_b">-->
              <!--<ul class="list" @click="toDetail(item,'deal')" v-for="(item,i) in recordList" :key='i'>-->
                <!--<li>-->
                  <!--<span>{{item.order_sn}}</span>-->
                  <!--<span>{{item.total}}</span>-->
                <!--</li>-->
                <!--<li>-->
                  <!--<span>{{item.created_at}}</span>-->
                  <!--<span>{{item.status_name}}（单价：{{$i18n.t('money')}}{{item.price}}）</span>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->

        <transition name="fadeLeft">
          <!-- 奖励记录 -->
          <div class="buy_info" v-if="chooseItem === 1">
            <div class="info_a">
              <div class="classify">
                <h1>奖励记录</h1>
                <span @click="showClassify1">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>
                <div class="info_time">
                  <i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>
                  <span v-if="chooseDate">时间:{{showChooseDate}}</span>
                  <i @click="openPicker" class="iconfont icon-record_time"></i>
                </div>
              </div>
              <ul class="number">
                <li>累计奖励可用数量：{{recordData.usable_sum || 0}}</li>
                <li>累计奖励冻结数量：{{recordData.froze_sum || 0}}</li>
              </ul>
            </div>
            <div class="info_b">
              <ul class="list" v-for="(item,i) in recordList" :key='i'>
                <li>
                  <span>激活ID：{{item.id}}</span>
                  <span>{{item.amount}}</span>
                </li>
                <li>
                  <span>{{item.created_at}}</span>
                  <span>{{item.type_name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <transition name="fadeLeft">
          <!-- 激活记录 -->
          <div class="buy_info" v-if="chooseItem === 2">
            <div class="info_a">
              <div class="classify">
                <h1>激活记录</h1>
                <span @click="showClassify1">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>
                <div class="info_time">
                  <i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>
                  <span v-if="chooseDate">时间:{{showChooseDate}}</span>
                  <i @click="openPicker" class="iconfont icon-record_time"></i>
                </div>
              </div>
              <ul class="number">
                <li>累计激活数量：{{recordData.amount_sum}}</li>
              </ul>
            </div>
            <div class="info_b">
              <ul class="list" v-for="(item,i) in recordList" :key='i'>
                <li>
                  <span>激活ID：{{item.id}}</span>
                  <span>{{item.amount}}</span>
                </li>
                <li>
                  <span>{{item.created_at}}</span>
                  <span>{{item.type_name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <transition name="fadeLeft">
          <!-- 分红记录 -->
          <div class="buy_info" v-if="chooseItem === 3">
            <div class="info_a">
              <div class="classify">
                <h1>{{lang.bonus_name}}记录</h1>
                <!--<span @click="showClassify">分类<i class="iconfont icon-down"></i></span>-->
                <div class="info_time">
                  <i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>
                  <span v-if="chooseDate">时间:{{showChooseDate}}</span>
                  <i @click="openPicker" class="iconfont icon-record_time"></i>
                </div>
              </div>
              <ul class="number" v-if="recordData.statistics">
                <li>{{lang.capital_name}}总{{lang.bonus_name}}金额：{{recordData.statistics.bonus_amount}}</li>
                <li>累计获得{{lang.bonus_name}}金额：{{recordData.statistics.member_bonus}}</li>
              </ul>
            </div>
            <div class="info_b">
              <ul class="list" v-for="(record,i) in recordList" :key='i'>
                <li>
                  <span>总额：{{record.pool_amount}}</span>
                  <span>{{record.amount}}</span>
                </li>
                <li class="last">
                  <span>{{lang.capital_name}}总量：{{record.publish}}</span>
                  <span>可用{{lang.capital_name}}：{{record.usable}}</span>
                </li>
                <li>
                  <span>{{lang.capital_name}}价值：{{record.unit_bonus}}</span>
                  <span>{{record.created_at}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>

      </van-pull-refresh>

      <span v-show="recordList.length <=0">暂无记录</span>
    </div>

    <van-popup v-model="show" position="bottom" :overlay="true">
      <van-datetime-picker
          v-model="date"
          :min-date="minDate"
          type="year-month"
          :formatter="formatter"
          @cancel="handleCancel"
          @confirm="handleConfirm"
      />
    </van-popup>


    <!--弹出分类-->
    <transition name="fade">
      <div class="popup-bg" @click.stop="showPopup = false" v-show="showPopup" @touchmove.prevent>

        <div class="popup_box" v-show="showPopup" ref="cartWrapper"
             style="max-height: 18rem; overflow: hidden; border-top: solid 0.0625rem #ebebeb;">
          <ul class="box">
            <!--出售记录和激活记录添加全部-->
            <li :class="chooseClassifyIndex === 'a' ? 'cur':''" v-if="Number(chooseItem)===1 || Number(chooseItem)===5 || Number(chooseItem)===4"
                @click="chooseClassify('a','全部')">
              全部
              <i v-show="chooseClassifyIndex === 'a'" class="iconfont icon-record_go"></i>
            </li>

            <li :class="chooseClassifyIndex === index ? 'cur':''" v-for="(item,index) in classify"
                @click="chooseClassify(index,item)" :key='index'>{{item}}
              <i v-show="chooseClassifyIndex === index" class="iconfont icon-record_go"></i>
            </li>
          </ul>
        </div>

      </div>
    </transition>


  </div>
</template>

<script>
import buying_record_controller from "./buying_record_controller";

export default buying_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #buying_record {
    .popup-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 10;
    }

    .popup_box {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;

      .box {
        .cur {
          color: #f7a145;
        }

        li {
          line-height: 2.25rem;
          padding: 0 1.25rem;
          font-weight: bold;
          position: relative;
          text-align: left;
          font-size: 16px;

          i {
            font-size: 1.125rem;
            color: #f7a145;
            line-height: 2.5rem;
            position: absolute;
            right: 0.625rem;
          }
        }
      }
    }

    #content {
      // 导航
      .nav_box {
        background: #fff;
        border-bottom: solid 0.0625rem #ebebeb;
        white-space: nowrap;
        position: relative;
        display: flex;

        .nav {
          overflow-x: scroll;
          display: flex;
          padding: 0 0.625rem 0 0.625rem;

          li {
            height: 2.5rem;
            line-height: 2.5rem;
            padding: 0 0.625rem;
            font-weight: bold;
            font-size: 16px;
          }

          .current {
            color: #f7a145;
            border-bottom: solid 0.1875rem #f7a145;
          }
        }
      }
    }
    // 认购记录
    .buy_info {
      margin-top: 0.625rem;

      .info_a {
        background: #fff;
        padding: 0 0.875rem;

        .classify {
          display: flex;
          height: 2.75rem;
          line-height: 2.75rem;
          border-bottom: solid 0.0625rem #ebebeb;
          position: relative;

          h1 {
            font-size: 16px;
            margin-right: 1.25rem;
          }

          span {
            display: flex;
            font-size: 14px;
            color: #8c8c8c;

            i {
              color: #c9c9c9;
              font-size: 1rem;
              line-height: 2.75rem;
            }
          }

          .info_time {
            position: absolute;
            right: 0;
            display: flex;
          }

          .icon-guanbi {
            font-size: 14px;
          }

          .icon-record_time {
            margin-left: 1rem;
            font-size: 1.5rem;
            color: #666;
            line-height: 2.75rem;
          }
        }

        .number {
          padding: 0.625rem 0;

          li {
            padding: 0 0.625rem;
            text-align: left;
            font-size: 14px;
            line-height: 1.5rem;
          }
        }
      }

      .info_b {
        background: #fff;
        margin-top: 0.625rem;

        .list {
          padding: 0.625rem 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;

          li {
            display: flex;
            justify-content: space-between;
          }

          .last {
            color: #8c8c8c;
          }

          li:first-child {
            line-height: 1.875rem;
            font-size: 16px;

            span:last-child {
              color: #f7a145;
            }
          }

          li:last-child {
            line-height: 1.5rem;
            font-size: 13px;
            color: #8c8c8c;
          }
        }
      }
    }

    .fadeLeft-enter-active,
    .fadeLeft-leave-active {
      position: absolute;
      transition: all 0.3s linear;
    }

    .fadeLeft-enter,
    .fadeLeft-leave-to {
      transform: translate(100%, 0);
    }
  }
</style>
