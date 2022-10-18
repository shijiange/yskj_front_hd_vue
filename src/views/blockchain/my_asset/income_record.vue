<template>
  <div id="income_record">
    <c-title :hide="false" :text="'进出明细'"></c-title>
    <div id="content">
      <div class="content_a">
        <div class="top_a">
          <ul class="name">
            <li>
              <span>{{recordData.digitization_name}}</span>
            </li>
            <li>
              <span>可用：{{recordData.member_usable}}</span>
              <span>冻结：{{recordData.member_froze}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="content_b">
        <div class="info_a">
          <div class="classify">
            <h1>进出明细</h1>
            <span @click="showClassify">{{chooseClassifyName}}<i class="iconfont icon-down"></i></span>
            <div class="info_time">
              <i v-if="chooseDate" @click="clearPicker" class="iconfont icon-guanbi"></i>
              <span v-if="chooseDate">时间:{{showChooseDate}}</span>
              <i @click="openPicker" class="iconfont icon-record_time"></i>
            </div>
            <!--<i @click="openPicker" class="iconfont icon-record_time"></i>-->
          </div>
        </div>

        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="info_b">
            <ul class="list" v-for="(item,i) in recordList" :key='i'>
              <li>
                <span>{{item.source_type_name}}</span>
                <span>{{item.change}}</span>
              </li>
              <li class="last">
                <span>{{item.value_type === 1 ? '可用': '冻结'}}</span>
                <span>{{item.created_at}}</span>
              </li>
            </ul>
          </div>
        </van-pull-refresh>  

        <span v-show="recordList.length <=0">暂无记录</span>

      </div>
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

    <!-- 弹窗 -->

    <transition name="fade">
      <div class="popup-bg" @click.stop="showPopup = false" v-show="showPopup" @touchmove.prevent>

        <div class="popup_box" v-show="showPopup" ref="cartWrapper"
             style="max-height: 18rem; overflow: hidden; border-top: solid 0.0625rem #ebebeb;">
          <ul class="box">
            <!--进出明细添加全部-->
            <li :class="chooseClassifyIndex === '-1' ? 'cur':''" @click="chooseClassify('-1','全部')">
              全部
              <i v-show="chooseClassifyIndex === '-1'" class="iconfont icon-record_go"></i>
            </li>
            <li :class="chooseClassifyIndex === index ? 'cur':''" v-for="(item,index) in classify"
                @click="chooseClassify(index,item)" :key='index'>{{item}}
              <i v-show="chooseClassifyIndex === index" class="iconfont icon-record_go"></i></li>
          </ul>
        </div>

      </div>
    </transition>

  </div>
</template>

<script>
import income_record_controller from "./income_record_controller";

export default income_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #income_record {
    .content_a {
      background-color: #f7a145;

      .top_a {
        padding: 0.625rem 0.875rem;

        .name {
          li:first-child {
            line-height: 2.25rem;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            color: #fff;
            // span:last-child{
            //   font-size:14px;
            //   display: flex;
            //   padding: 0.125rem 0.625rem;
            //   i{
            //     color:#fff;
            //     line-height: 2.25rem;
            //     margin-left:0.625rem;
            //     font-size:1.25rem;
            //   }
            // }
          }

          li:last-child {
            color: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 1.5rem;
          }
        }
      }
    }

    .content_b {
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
    // 弹窗
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
  }
</style>
