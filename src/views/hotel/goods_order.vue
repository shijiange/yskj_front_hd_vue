<template>
  <div id="goods_order">
    <c-title :hide="false" text="商品下单页"></c-title>
    <div id="content">
      <ul class="detail_a">
        <li>{{ title }}</li>
        <li>{{ start_time }}-{{ end_time }} &nbsp;共{{ night_day }}晚</li>
      </ul>
      <ul class="detail_b">
        <li class="b_room">
          <span>房间数</span>
          <van-stepper v-model="total" @change="addTotal" />
        </li>
        <li>
          <span>入住人</span>
          <input type="text" placeholder="请填写入住姓名" v-model="name" />
        </li>
        <li>
          <span>联系手机</span>
          <input type="text" placeholder="请填写入住人电话" v-model="mobil" />
        </li>
      </ul>
      <ul class="detail_c">
        <li class="c_invoice">
          <span>是否需要发票</span>
          <van-checkbox checked-color="#f15353" shape="square" v-model="isInvoice" @change="invoiceChange"></van-checkbox>
        </li>
        <li class="c_type" v-if="isInvoice">
          <!-- <van-checkbox checked-color="#f15353" shape="square">个人</van-checkbox>
                    <van-checkbox checked-color="#f15353" shape="square">公司</van-checkbox> -->
          <van-radio-group v-model="el_invoice" @change="eInvoiceChange">
            <van-radio name="1" checked-color="#f15353" style="float: left;">电子发票</van-radio>
            <van-radio name="2" checked-color="#f15353" style="float: left; margin-left: 10px;">纸质发票</van-radio>
          </van-radio-group>
        </li>
        <li class="c_type" v-if="isInvoice">
          <!-- <van-checkbox checked-color="#f15353" shape="square">个人</van-checkbox>
                    <van-checkbox checked-color="#f15353" shape="square">公司</van-checkbox> -->
          <van-radio-group v-model="invoice_type" @change="typeChange">
            <van-radio name="1" checked-color="#f15353" style="float: left;">个人</van-radio>
            <van-radio name="2" checked-color="#f15353" style="float: left; margin-left: 10px;">公司</van-radio>
          </van-radio-group>
        </li>
        <li v-if="isInvoice && invoice_type == '1'">
          <input type="text" placeholder="输入发票抬头" v-model="fp_tt" />
        </li>
        <li v-if="isInvoice && invoice_type == '2'">
          <input type="text" placeholder="请填写单位名称" v-model="company_name" />
        </li>
        <li v-if="isInvoice && invoice_type == '2'">
          <input type="text" placeholder="请填写纳税识别号" v-model="sbxd" />
        </li>

        <li style="color: #ff2424;" v-if="hasGoodOpenDF" @click="getGoodDFData">点击填写表单</li>
        <li style="color: #ff2424;" v-if="hasGoodOpenDF" @click="getGoodDFData">点击修改表单</li>
        <!--<li><input type="text" placeholder="买家备注" v-model="bz" /></li>-->
      </ul>
      <div class="tbs coupon-list" @click="showCoupon" v-if="isShowCoupon">
        <div class="list">
          <div class="left ">
            优惠券
            <font>{{ coupon_size }}张可用</font>
          </div>
          <div class="right">
            <font color="#E84E40">
              <span>{{ use_coupon_size == 0 ? "未使用" : "已使用" + use_coupon_size + "张" }}</span>
            </font>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in order_info.orders" :key="index" :class="(item.order_deductions && item.order_deductions.length > 0
      || item.order_coin_exchanges && item.order_coin_exchanges.length > 0) ? 'tbs' : ''">
        <div class="score list" v-if="item.order_deductions && item.order_deductions.length > 0">
          <div v-for="(d, i) in item.order_deductions" :key="i" class="list-child-style" style="">
            <div class="left ">
              可用{{ parseFloat(d.coin).toFixed(2) }}{{ d.name || integral }}
              <span>抵扣{{ d.amount }}{{ $i18n.t("元") }}</span>
            </div>
            <div class="right" v-show="good_clicktag == 0">
              <van-switch v-model="d.checked" active-color="#f15353" inactive-color="#fff" size="23" @change="discountHandle(item, d, 'discount')" />
            </div>
            <div class="right" v-show="good_clicktag != 0">
              <van-loading />
            </div>
          </div>
        </div>

        <div class="score list" v-if="item.order_coin_exchanges && item.order_coin_exchanges.length > 0">
          <div v-for="(d, i) in item.order_coin_exchanges" :key="i" style="width: 100%; display: block; clear: both; margin-bottom: 2.1875rem;">
            <div class="left ">
              {{ parseFloat(d.coin).toFixed(2) }}{{ d.name || integral }}
              <span>抵扣{{ d.amount }}{{ $i18n.t("元") }}</span>
            </div>
            <div class="right"></div>
          </div>
        </div>
      </div>

      <ul class="detail_d">
        <li v-for="(item, index) in order_info.amount_items" :key="index">
          <span>{{ item.name }}</span>
          <span>{{ $i18n.t("money") }}<span v-if="item.code == 'total_deduction_price'">-</span>{{ item.amount }}</span>
        </li>
      </ul>

      <ul class="detail_d" v-if="order_info.discount_amount_items && order_info.discount_amount_items.length > 0">
        <li v-for="(item, index) in order_info.discount_amount_items" :key="index">
          <span>{{ item.name }}</span>
          <span>-{{ $i18n.t("money") }}{{ item.amount }}</span>
        </li>
      </ul>
      <div class="explain" v-if="false">
        <h1>预定说明</h1>
        <p>
          订单确认后不可被取消；赠送双早；入住时需出示身份证； 如需续住请提前一天预定；退房时可在前台以实际支付金额 开具发票。
        </p>
      </div>
      <div class="foot" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <ul class="foot_a">
          <li>
            合计：<span
              >{{ $i18n.t("money") }}<font>{{ order_info.total_price }}</font></span
            >
          </li>
        </ul>
        <button type="button" @click="submit">提交订单</button>
      </div>
    </div>
    <van-popup v-model="popupCouponSpecs" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4" closeOnClickModal="true">
      <div class="add-info">
        <div class="coupon-list-info" v-for="(coupon, index) in coupons" :key="index">
          <div class="checkList" style="float: left;" v-if="cup_notice" @click.stop="chooseCoupon(index)">
            <van-checkbox v-model="coupon.checked" shape="square" :disabled="!coupon.valid" checked-color="#f15353" :name="coupon" @change="selectCoupon($event, coupon)"> </van-checkbox>
          </div>
          <div
            :class="{
              coupon_voucher_main: coupon.valid,
              coupon_voucher_gray: !coupon.valid
            }"
          >
            <div class="coupon_voucher_left">
              <div v-if="coupon.belongs_to_coupon.coupon_method == 1">
                <p class="coupon_voucher_amount type_large">
                  {{ coupon.belongs_to_coupon.deduct }}
                </p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立减</p>
              </div>
              <div v-else>
                <p class="coupon_voucher_amount type_large">{{ coupon.belongs_to_coupon.discount }}折</p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立享</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range">
                {{ coupon.belongs_to_coupon.name }}
              </p>
              <p class="coupon_voucher_period">{{ coupon.time_start }}-{{ coupon.time_end }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class=" sure" type="button" @click="popupCouponSpecs = false">
        确认
      </button>
      <button class="close" type="button" @click="popupCouponSpecs = false">
        取消
      </button>
    </van-popup>

    <!--自定义表单-->
    <van-popup v-model="dyFormPopup" position="bottom" class="mint-popup-4" :style="{ width: '100%', height: '100%', overflow: 'auto', display: dyFormPopup ? 'flex': 'none' }">
      <div class="DYFpopHeader">
        <i class="iconfont icon-member-left" @click="dyFormPopup = false"></i>
        <p>{{ dyTiitle }}</p>
      </div>
      <!-- <c-dyPopup
        style="height: 100%; overflow: auto;"
        v-on:submitsave="diyFormSave"
        :datas="dfData"
        :form_data_id="activeFormDataID"
        :form_id="goodDYDormID"
        :description="dyDescription"
        :status="true"
        :thumb="dyThumb"
      ></c-dyPopup> -->
      <diyfrom v-if="dyFormPopup"
        v-on:submitsave="diyFormSave"
        style="height: 100%; overflow: auto;"
        :form_id="goodDYDormID"
        :form_data_id="activeFormDataID"
        modeType="Single"
        :singleStatus="true"
      ></diyfrom>
    </van-popup>
  </div>
</template>

<script>
import controller from "./goods_order_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goods_order {
  padding-bottom: 60px;

  #content {
    .detail_a {
      background: #fff;
      padding: 0.625rem 0.875rem;

      li {
        line-height: 1.875rem;
        text-align: left;
      }

      li:first-child {
        font-size: 16px;
        font-weight: bold;
      }

      li:last-child {
        font-size: 14px;
      }
    }

    .detail_b {
      background: #fff;
      margin-top: 0.625rem;
      padding-left: 0.875rem;

      li {
        padding-right: 0.875rem;
        height: 2.8125rem;
        display: flex;
        border-bottom: solid 0.0625rem #ebebeb;
        align-items: center;

        span {
          line-height: 2.8125rem;
          width: 6.25rem;
          text-align: left;
          font-size: 15px;
        }

        input {
          border: none;
        }
      }

      li:last-child {
        border: none;
      }

      .b_room {
        justify-content: space-between;
      }
    }

    .detail_c {
      background: #fff;
      margin-top: 0.625rem;
      padding-left: 0.875rem;

      li {
        padding-right: 0.875rem;
        height: 2.8125rem;
        display: flex;
        border-bottom: solid 0.0625rem #ebebeb;
        align-items: center;

        span {
          font-size: 15px;
        }

        input {
          border: none;
        }
      }

      li:last-child {
        border: none;
      }

      .c_invoice {
        justify-content: space-between;
      }

      .c_type {
        .van-checkbox {
          width: 30%;
          text-align: left;
        }
      }
    }

    .tbs {
      .list {
        padding-bottom: 0.625rem;
      }

      .list:nth-last-child(1) {
        padding-bottom: 0;
      }

      .left {
        float: left;
        color: #333;

        span {
          font-size: 15px;
        }
      }

      .right {
        float: right;
      }
    }

    .tbs.coupon-list {
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;
    }

    .detail_d {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.625rem 0.875rem;

      li {
        line-height: 1.875rem;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      }
    }

    .explain {
      padding: 0 0.875rem;

      h1 {
        font-size: 12px;
        color: #8c8c8c;
        line-height: 1.875rem;
        text-align: left;
        padding: 0;
        font-weight: bold;
      }

      p {
        font-size: 12px;
        color: #8c8c8c;
        padding: 0 0.625rem;
        text-align: left;
      }
    }

    .foot {
      background: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 3.0625rem;
      display: flex;
      justify-content: flex-end;
      border-top: solid 0.0625rem #ebebeb;

      .foot_a {
        li {
          font-size: 14px;
          line-height: 3.0625rem;
          padding-right: 0.625rem;

          span {
            color: #f15353;

            font {
              font-size: 20px;
            }
          }
        }
      }

      button {
        background: #f15353;
        color: #fff;
        font-size: 16px;
        border: none;
        width: 6.875rem;
      }
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
  }

  .coupon-list-info {
    width: 99.5vw;
  }

  .checkList {
    position: relative;
    top: 1.875rem;
    left: 0.1875rem;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .coupon_voucher_main {
    position: relative;
    padding-left: 6.375rem;
    height: 5rem;
    margin-left: 2.25rem;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;

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
      flex-direction: column;
      justify-content: center;
      background-color: #47c1c4;

      .coupon_voucher_amount.type_large {
        margin: 0;
        font-size: 22px;
      }

      .coupon_voucher_amount {
        position: relative;
        font-size: 36px;
        line-height: 1;
      }

      .coupon_voucher_amount::before {
        content: "\00A5";
        font-size: 16px;
        display: inline-block;
        vertical-align: text-top;
        margin-right: 0.1875rem;
        line-height: 1;
      }

      .coupon_voucher_limit {
        font-size: 12px;
        line-height: 1;
        margin-top: 0.9375rem;
        margin-bottom: 0;
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
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-color: #e5f3f3;
      color: #666;

      .coupon_voucher_range {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
        text-align: left;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      .coupon_voucher_period {
        color: #999;
        font-size: 12px;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .coupon_voucher_gray {
    position: relative;
    padding-left: 6.375rem;
    height: 5rem;
    margin-left: 2.25rem;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;

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
      flex-direction: column;
      justify-content: center;
      background-color: #ccc;

      .coupon_voucher_amount.type_large {
        margin: 0;
        font-size: 22px;
      }

      .coupon_voucher_amount {
        position: relative;
        font-size: 36px;
        line-height: 1;
      }

      .coupon_voucher_amount::before {
        content: "\00A5";
        font-size: 16px;
        display: inline-block;
        vertical-align: text-top;
        margin-right: 0.1875rem;
        line-height: 1;
      }

      .coupon_voucher_limit {
        font-size: 12px;
        line-height: 1;
        margin-top: 0.9375rem;
        margin-bottom: 0;
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
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-color: #eee;
      color: #666;

      .coupon_voucher_range {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
        text-align: left;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      .coupon_voucher_period {
        color: #999;
        font-size: 12px;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .mint-popup-4 {
    width: 100%;

    .sure {
      background: #f15353;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #fff;
      width: 50%;
      border: 0;
      float: left;
    }

    .close {
      background: #eee;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #333;
      width: 50%;
      border: 0;
      float: left;
    }
  }
}

.tbs {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  flex-flow: row wrap;
  padding: 0.625rem 0.875rem;
  line-height: 1.5rem;
  border-bottom: 0.0625rem solid #e8e8e8;
  font-size: 14px;

  .list {
    width: 100%;

    .list-child-style {
      width: 100%;
      clear: both;
      display: flex;
      align-items: center;
    }

    .left {
      text-align: left;
      flex: 1;
      color: #333;
    }

    .right {
      text-align: right;
    }
  }
}

.DYFpopHeader {
  position: absolute;
  top: 0;
  width: 100%;
  height: 2.5rem;
  background: white;
  display: flex;
  font-size: 16px;
  text-align: center;

  p {
    font-weight: bold;
    flex: 1;
    align-self: center;
  }

  i {
    padding: 0.5rem;
    align-self: center;
    flex: 0 0 1.5rem;
  }
}

.DYFpopHeader {
  position: fixed;
  top: 0;
  z-index: 9;
}
</style>
