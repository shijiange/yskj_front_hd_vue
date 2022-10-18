<template>
    <div id="merchants">
       <div class="m_header">
           <span class="iconfont icon-left"></span>
           <p>招商员分红比例：1%</p>
       </div>
       <ul class="today_bonus">
           <li v-for="(item,i) in ratioDatas" :key='i' :class="item.name">
               <span>{{item.money}}</span> <br>
               <b>{{item.data}}</b>
           </li>
           <li class="line"><div class="careat"></div></li>
       </ul>

       <div class="merchants_content">
           <ul class="tab-btn">
               <li :class="{active:isActive}" @click="changeActive(true)">我的供应商</li>
               <li :class="{active:!isActive}" @click="changeActive(false)">供应商分红详情</li>
           </ul>
           <my-merchants :searchVal="searchValue" :merchantsList="merchantsList" v-if="isActive" @emitFocus="beginSearch"></my-merchants>
           <my-ratio v-else @emitFocus="beginSearch" :searchVal="searchValue" :merchantsList="merchantsList"></my-ratio>
       </div>

       <!-- //搜索弹窗 -->
       <div class="modal" :class="{serchActive:showSearch}">
            <div class="input">
                <i class="fa fa-angle-left" style="font-size: 26px;" @click="goBack"></i>
                <!--<i class="el-icon-arrow-left" @click="goBack"></i>-->
                <input v-if="isSupport" v-model="searchVal" type="search" name="" @keyup.enter="searching" placeholder="搜索供应商ID/昵称/姓名">
                <input v-else v-model="searchVal" type="search" name="" @keyup.enter="searching" placeholder="搜索订单编号">
            </div>
            <div class="modal-dialog" v-if="isSupport">
                <h1>时间</h1>
                <div class="select-time">
                    <div class="block">
                        <!--<el-date-picker-->
                          <!--v-model="value1"-->
                          <!--type="date"-->
                          <!--placeholder="选择起始日期"-->
                          <!--:picker-options="pickerOptions0">-->
                        <!--</el-date-picker>-->
                        <van-button plain type="primary" style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 4rem;" @click="seleStartTime">{{startTime}}</van-button>
                    </div>
                     <span>~</span>
                    <div class="block">
                        <!--<el-date-picker-->
                           <!--v-model="value2"-->
                           <!--align="right"-->
                           <!--type="date"-->
                           <!--placeholder="选择终结日期"-->
                           <!--:picker-options="pickerOptions1">-->
                        <!--</el-date-picker>-->
                        <van-button plain type="primary" style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 4rem;" @click="seleEndTime">{{endTiem}}</van-button>
                    </div>
                </div>
                <button type="button" @click="searching"  class="submit">确定</button>

            </div>
       </div>
        <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
            <van-datetime-picker
                    v-model="value1"
                    type="date"
                    :max-date="maxDate"
                    @confirm="confirmbtn"
                    @cancel="cancelbtn"
            />
        </van-popup>
        <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
            <van-datetime-picker
                    v-model="value2"
                    type="date"
                    :max-date="maxDate"
                    @confirm="confirmbtn_1"
                    @cancel="cancelbtn_1"
            />
        </van-popup>
    </div>
</template>

<script>
import merchants_dividend_ratio_controller from "./merchants_dividend_ratio_controller";
export default merchants_dividend_ratio_controller;
</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
p,
ul,
li { margin: 0; padding: 0; }

.serchActive {
  display: none !important;
}

#merchants {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    background: #f15353;
    color: #fff;
    line-height: 2.8125rem;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }

    p {
      width: 9.375rem;
      float: right;
      padding-right: 0.625rem;
      font-size: 15px;
    }
  }

  .today_bonus {
    width: 100%;
    height: 5.125rem;
    margin-top: 0.625rem;
    background: #fff;
    padding: 1.25rem 0;
    box-sizing: border-box;
    position: relative;

    li.line {
      position: absolute;
      width: 0.0625rem;
      height: 5.125rem;
      background: #ccc;
      top: 0;
      right: 32%;

      .careat {
        width: 0.5rem;
        height: 0.5rem;
        border: 0.0625rem solid #ccc;
        border-left: 0;
        border-bottom: 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
        position: absolute;
        top: 2.3125rem;
        right: -0.25rem;
      }
    }

    li {
      height: 2.75rem;
      text-align: center;
      float: left;

      span {
        font-size: 17px;
        line-height: 1.625rem;
      }

      b {
        font-size: 11px;
        color: 3333;
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
      border-right: 0.0625rem solid #ccc;
    }

    li.mounth {
      width: 32%;

      span {
        color: #fc6a70;
      }
    }
  }

  .merchants_content {
    margin-top: 0.625rem;

    .tab-btn {
      margin: 0 1.25rem 0.625rem;
      clear: both;
      overflow: hidden;

      li {
        display: inline-block;
        width: 50%;
        height: 2.1875rem;
        line-height: 2.1875rem;
        float: left;
        background: #fff;
        color: #f15353;
      }

      li:nth-child(1) {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
      }

      li:nth-child(2) {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }

      li.active {
        background: #f15353;
        color: #fff;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f3f5f7;

    .input {
      display: flex;
      height: 2.8125rem;
      background: #fff;
      box-sizing: border-box;
      margin: 0 0.625rem;

      i {
        font-size: 16px;
        line-height: 2.8125rem;
        padding-left: 0.25rem;
      }

      input {
        margin: 0.625rem 5%;
        width: 80%;
        height: 1.875rem;
        border-radius: 0.375rem;
        border: 0;
        outline: 0;
        padding-left: 1.875rem;
        background: url(../../../../assets/images/search.png) no-repeat 0.625rem 0.5rem #f2f2f2;
      }
    }

    .modal-dialog {
      h1 {
        font-size: 16px;
        color: #666;
        line-height: 3.4375rem;
        font-weight: normal;
        text-align: left;
        padding-left: 1.5625rem;
      }

      .select-time {
        text-align: center;

        .block {
          width: 38%;
          display: inline-block;
        }

        .el-input {
          width: 100%;
        }

        span {
          font-size: 22px;
          font-weight: 400;
        }
      }

      .submit {
        width: 20.3125rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        background-color: #f15353;
        text-align: center;
        line-height: 2.5rem;
        color: #fff;
        border: 0;
        outline: 0;
        font-size: 14px;
        font-weight: bold;
        margin-top: 1.25rem;
      }
    }
  }
}
</style>