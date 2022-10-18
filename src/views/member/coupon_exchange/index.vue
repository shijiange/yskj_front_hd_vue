<template>
  <div>
    <c-title :hide="false"
             :text="'兑换中心'">
    </c-title>

    <div style="" class="bigsex">
      <van-tabs v-model="active"
                @click="getData()">
        <!-- v-for="item in navigation"
                 :key="item.id" -->
        <van-tab :title="navigation[0].name"
                 v-if="!fun.isTextEmpty(navigation[0])">
          <div class="coupon_voucher_main"
               v-for="(items,index) in list"
               :key="items.coupon_id">
            <div class="coupon_voucher_left">
              <div>
                <p class="coupon_voucher_amount type_large"
                   :class="[items.belongs_to_coupon.coupon_method == 1?'deductClass':''] ">{{items.belongs_to_coupon.coupon_method == 1?`${items.belongs_to_coupon.deduct}`:`${items.belongs_to_coupon.discount}折`}}</p>
                <p class="coupon_voucher_limit">满{{items.belongs_to_coupon.enough}}立{{items.belongs_to_coupon.coupon_method == 1?'减':'享'}}</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range"
                 style="-webkit-box-orient: vertical;">{{items.belongs_to_coupon.name}}</p>
              <p class="coupon_voucher_range1">
                <span>剩余数量:{{items.total}}</span>
              </p>

            </div>
            <div class="addBtn">
              <i @click.stop="numberLeft(index,items.coupon_id,items.belongs_to_coupon.goods_ids)"
                 class="iconfont icon-store_reduceLine"
                 v-show="NumModel[index]>0"></i>
              <input type="number"
                     v-model="NumModel[index]"
                     v-show="NumModel[index]>0"
                     disabled="disabled"
                     @click.stop />
              <i @click.stop="numberRight(index,items.coupon_id,items.belongs_to_coupon.goods_ids,'',items.total)"
                 class="iconfont icon-store_plus"></i>
            </div>
          </div>
          <img src="../../../assets/images/blank.png"
               alt=""
               style="width: 5rem; margin-top: 5rem;"
               v-if="isNoData">
        </van-tab>
        <!-- <van-tab :title="navigation[1].name"
                 v-if="!fun.isTextEmpty(navigation[1])">
          <div class="coupon_voucher_main"
               v-for="(items,index) in list"
               :key="items.coupon_id">
            <div class="coupon_voucher_left">
              <div>
                <p class="coupon_voucher_amount type_large"
                   :class="[items.belongs_to_coupon.coupon_method == 1?'deductClass':''] ">{{items.belongs_to_coupon.coupon_method == 1?`${items.belongs_to_coupon.deduct}`:`${items.belongs_to_coupon.discount}折`}}</p>
                <p class="coupon_voucher_limit">满{{items.belongs_to_coupon.enough}}立{{items.belongs_to_coupon.coupon_method == 1?'减':'享'}}</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range"
                 style="-webkit-box-orient: vertical;">{{items.belongs_to_coupon.name}}</p>
              <p class="coupon_voucher_name"
                 v-if="!fun.isTextEmpty(items.store_name)">适用{{navigation[1].name}}：{{items.store_name}}</p>
              <p class="coupon_voucher_range1">
                <span>剩余数量:{{items.total}}</span>
              </p>

            </div>
            <div class="addBtn">
              <i @click.stop="numberLeft(index,items.coupon_id,items.belongs_to_coupon.goods_ids,items.store_id)"
                 class="iconfont icon-store_reduceLine"
                 v-show="NumModel[index]>0"></i>
              <input type="number"
                     v-model="NumModel[index]"
                     v-show="NumModel[index]>0"
                     disabled="disabled"
                     @click.stop />
              <i @click.stop="numberRight(index,items.coupon_id,items.belongs_to_coupon.goods_ids,items.store_id)"
                 class="iconfont icon-store_plus"></i>
            </div>
          </div>
          <img src="../../../assets/images/blank.png"
               alt=""
               style="width:5rem;margin-top:5rem;"
               v-if="isNoData">
        </van-tab>
        <van-tab :title="navigation[2].name"
                 v-if="!fun.isTextEmpty(navigation[2])">
          <div class="coupon_voucher_main"
               v-for="(items,index) in list"
               :key="items.coupon_id">
            <div class="coupon_voucher_left">
              <div>
                <p class="coupon_voucher_amount type_large"
                   :class="[items.belongs_to_coupon.coupon_method == 1?'deductClass':''] ">{{items.belongs_to_coupon.coupon_method == 1?`${items.belongs_to_coupon.deduct}`:`${items.belongs_to_coupon.discount}折`}}</p>
                <p class="coupon_voucher_limit">满{{items.belongs_to_coupon.enough}}立{{items.belongs_to_coupon.coupon_method == 1?'减':'享'}}</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range"
                 style="-webkit-box-orient: vertical;">{{items.belongs_to_coupon.name}}</p>
              <p class="coupon_voucher_name"
                 v-if="!fun.isTextEmpty(items.hotel_name)">适用{{navigation[2].name}}：{{items.hotel_name}}</p>
              <p class="coupon_voucher_range1">
                <span>剩余数量:{{items.total}}</span>
              </p>

            </div>
            <div class="addBtn">
              <i @click.stop="numberLeft(index,items.coupon_id,items.belongs_to_coupon.goods_ids,items.hotel_id)"
                 class="iconfont icon-store_reduceLine"
                 v-show="NumModel[index]>0"></i>
              <input type="number"
                     v-model="NumModel[index]"
                     v-show="NumModel[index]>0"
                     disabled="disabled"
                     @click.stop />
              <i @click.stop="numberRight(index,items.coupon_id,items.belongs_to_coupon.goods_ids,items.hotel_id)"
                 class="iconfont icon-store_plus"></i>
            </div>
          </div>
          <img src="../../../assets/images/blank.png"
               alt=""
               style="width:5rem;margin-top:5rem;"
               v-if="isNoData">
        </van-tab> -->
      </van-tabs>

    </div>
    <ul class="time"
        v-if="active==2">
      <li class="time_a"
          @click="show1 = true">
        {{ fun.isTextEmpty(start) ? "请选择入住日期" : start
              }}<span>入住</span>
      </li>
      <li class="time_b"
          v-if="!fun.isTextEmpty(end)">
        <span>{{ night_day }}晚</span>
      </li>
      <li class="time_c"
          @click="show2 = true">
        {{ fun.isTextEmpty(end) ? "请选择离店日期" : end }}<span>离开</span>
      </li>
    </ul>
    <div class="btn set-pc-style">
      <span class="btn-left">{{num>0?`已选择${num}张`:'请选择'}}</span>
      <span class="btn-right"
            @click="gotoExchange()">去兑换</span>
    </div>

    <!-- 时间弹窗 -->
    <van-popup v-model="show1"
               position="bottom"
               :overlay="true"
               style="position: fixed; height: 80%;">
      <date-picker type="入住"
                   :top="false"
                   @timeChange="acceptTime"
                   @close="close"></date-picker>
    </van-popup>
    <van-popup v-model="show2"
               position="bottom"
               :overlay="true"
               style="position: fixed; height: 80%;">
      <date-picker type="离店"
                   :top="false"
                   @timeChange="acceptTime"
                   @close="close"></date-picker>
    </van-popup>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.bigsex {
  padding-bottom: 6.25rem;
  box-sizing: border-box;
}

.coupon_voucher_main {
  position: relative;
  padding-left: 6.375rem;
  margin: 0.625rem 0.625rem 0.5rem;
  height: 6.875rem;
  box-sizing: border-box;
  border-radius: 10px;

  .coupon_voucher_left {
    position: absolute;
    top: 0;
    left: 0;
    width: 6.375rem;
    height: 100%;
    color: #fff;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

    .coupon_voucher_amount {
      position: relative;
      font-size: 1.875rem;
      line-height: 2rem;
      margin-bottom: 0.625rem;
    }

    .deductClass::before {
      content: "\00A5";
      font-size: 16px;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 0.1875rem;
    }

    .coupon_voucher_limit {
      font-size: 12px;
    }
  }

  .coupon_voucher_hr {
    position: absolute;
    top: 0;
    left: 6.0625rem;
    width: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .coupon_voucher_hr::after {
    box-sizing: border-box;
    position: absolute;
    top: -0.1875rem;
    right: -0.1875rem;
    bottom: 0;
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
    line-height: 0.625rem;
    width: 0.4375rem;
    color: #f8fbfb;
    font-size: 18px;
    overflow: hidden;
    z-index: 1;
  }

  .coupon_voucher_right {
    padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
    height: 100%;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #f8fbfb;
    color: #666;
    width: 100%;
    box-sizing: border-box;
    position: relative;

    .coupon_voucher_range {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-size: 14px;
      text-align: left;
      color: #333;
    }

    .coupon_voucher_name {
      text-align: left;
      margin-top: 0.625rem;
      overflow: hidden;
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }

    .coupon_voucher_range1 {
      position: absolute;
      bottom: 0.375rem;
      right: 7rem;
      font-size: 14px;
      text-align: left;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        /* -webkit-line-clamp: 2; */
        width: 8.5rem;
        display: inline-block;

        /* background-color: #f15353; */
        color: #8c8c8c;
        padding: 0.25rem;

        /* border-radius: 0.625rem; */
      }

      i:first-child {
        font-size: 14px;
        margin-left: 6px;
      }

      i:last-child {
        font-size: 14px;
      }
    }
  }
}

.coupon_voucher_left {
  background-color: #ffb84c;
}

.time {
  position: fixed;
  width: 100%;
  padding: 0 1rem;
  bottom: 3rem;
  height: 2.75rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid 0.0625rem #ebebeb;
  background: #fff;

  .time_a,
  .time_c {
    font-size: 16px;
    font-weight: bold;

    span {
      font-size: 12px;
      margin-left: 0.375rem;
      color: #333;
      font-weight: normal;
    }
  }

  .time_b {
    span {
      font-size: 13px;
      border: solid 0.0625rem #ebebeb;
      border-radius: 1rem;
      padding: 0.125rem 0.625rem;
    }
  }
}

.btn {
  position: fixed;
  bottom: 0;
  background: #fff;
  display: flex;
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  font-size: 14px;

  .btn-left {
    flex: 1;
    text-align: right;
    padding-right: 2rem;
    color: #666;
  }

  .btn-right {
    font-size: 16px;
    flex: 0 0 7rem;
    background: #ff5d5c;
    color: #fff;
  }
}

.addBtn {
  position: absolute;
  bottom: 0.625rem;
  right: 0.625rem;
  display: flex;

  .iconfont {
    width: 1.75rem;
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: 26px;
    color: #f15353;
  }

  .icon-store_reduceLine {
    color: #aaa;
  }

  input {
    line-height: 1.75rem;
    width: 2rem;
    text-align: center;
    font-size: 12px;
    border: none;
  }
}
</style>
