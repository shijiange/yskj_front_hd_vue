<template>
  <div id="balance_recharge_s">
    <c-title :hide="false" text="充值"></c-title>
    <template v-if="!show1">
      <!-- 门店余额充值新页面 -->
      <div class="storeUser">
        <div class="storeImg">
          <img :src="store.thumb" alt="" />
        </div>
        <div class="storeName">{{ store.store_name }}</div>
      </div>
      <div class="moneyInp">
        <!-- <van-field readonly="true" v-model="payMuch" type="number" placeholder="充值金额" /> -->
        <div class="smallInp">充值金额</div>
        <div class="small">
          ￥<span>{{ payMuch ? payMuch : "0" }}</span>
        </div>
      </div>
      <div class="current">当前余额：{{ credit2 }}元</div>
      <div class="rechargeMethod" v-if="!is_open_recharge_order">
        <div class="methodTxt">充值方式</div>
        <div class="methodBox">
          <van-radio-group v-model="radio" @change="selectSpecs">
            <div class="li" v-for="(btn, i) in buttons" :key="i">
              <div class="lis">
                <div><i class="iconfont" :class="[btnclass(btn.value)]"> </i></div>
                {{ btn.name }}{{ typename }}
              </div>
              <van-radio :name="btn.value" checked-color="#ee0a24"></van-radio>
            </div>
          </van-radio-group>
        </div>
      </div>
      <div class="activityBox" v-if="show_activity">
        <div class="activityTxt">活动说明</div>
        <div v-html="activatDes.control" class="activityConten"></div>
      </div>
      <div class="btn" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <ul class="btn_box">
          <li class="line_one">
            <button @click="_handleKeyPress('1')" type="primary">1</button>
            <button @click="_handleKeyPress('2')" type="primary">2</button>
            <button @click="_handleKeyPress('3')" type="primary">3</button>
            <button @click="_handleKeyPress('D')" type="primary"><i class="iconfont icon-seller-del"></i></button>
          </li>
          <li class="btn_bottom">
            <ul class="line_two">
              <li class="line-left">
                <ul class="line_box">
                  <li class="line_two">
                    <button @click="_handleKeyPress('4')" type="primary">4</button>
                    <button @click="_handleKeyPress('5')" type="primary">5</button>
                    <button @click="_handleKeyPress('6')" type="primary">6</button>
                  </li>
                  <li class="line_three">
                    <button @click="_handleKeyPress('7')" type="primary">7</button>
                    <button @click="_handleKeyPress('8')" type="primary">8</button>
                    <button @click="_handleKeyPress('9')" type="primary">9</button>
                  </li>
                  <li class="line_four">
                    <button type="primary"></button>
                    <button @click="_handleKeyPress('0')" type="primary">0</button>
                    <button @click="_handleKeyPress('.')" type="primary">.</button>
                  </li>
                </ul>
              </li>
              <li class="line-right">
                <van-button type="primary" @click="_handleKeyPress('S')">立即<br />充值</van-button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
    <!-- 创建订单支付 -->
    <transition name="fade">
      <div class="popup" v-if="show1">
        <div style="height: 40px;"></div>
        <div class="text_box" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyleWidth' : 'noPc']">
          <span>去支付</span>
          <i @click="closePop" class="iconfont icon-back"></i>
        </div>
        <ul class="popup_pay">
          <li>待付款金额</li>
          <li>
            <span>{{ $i18n.t("money") }}</span>
            <span>{{ payMuch }}</span>
          </li>
        </ul>
        <!-- 可用 -->
        <div class="tbs" v-if="loadDiscount && order_data[0].order_deductions">
          <div class="list">
            <div class="score" v-for="(d, i) in order_data[0].order_deductions" :key="i">
              <div class="left">
                可用{{ parseFloat(d.coin).toFixed(2) }}{{ d.name }}抵扣
                <span>{{ d.amount }}{{ $i18n.t("元") }}</span>
              </div>
              <div class="right" v-show="isClick == 0">
                <van-switch v-model="d.checked" active-color="#f15353" inactive-color="#fff" size="23" @change="discountHandle(order_data[0], d)" />
              </div>
              <div v-show="isClick != 0">
                <!-- <mt-spinner type="triple-bounce"></mt-spinner> -->
                <van-loading />
              </div>
            </div>
          </div>
        </div>

        <div class="tbs" v-if="loadDiscount && order_data[0].order_coin_exchanges">
          <div class="list">
            <div class="score" v-for="(d, i) in order_data[0].order_coin_exchanges" :key="i">
              <div class="left">
                可用{{ parseFloat(d.coin).toFixed(2) }}{{ d.name }}抵扣
                <span>{{ d.amount }}{{ $i18n.t("元") }}</span>
              </div>
              <div class="right"></div>
            </div>
          </div>
        </div>
        <!-- 优惠券 -->
        <div class="tbs coupon-list" @click="showCoupon" v-if="(cashier_type == 'store' || cashier_type == 'hotel') && isShowCoupon">
          <div class="couponss list">
            <div class="left">
              优惠券
              <span>{{ coupon_size }}张可用</span>
            </div>
            <div class="right">
              <font color="#E84E40">
                <span>{{ use_coupon_size == 0 ? "未使用" : "已使用" + use_coupon_size + "张" }}</span>
              </font>
            </div>
          </div>
        </div>

        <!-- <div class="tbs coupon-list" style="padding: 0" v-if="store_set.is_write_information == 1">
          <div class="coupon list" id="phone">
            <van-field v-model="form.realname" label="联系人" placeholder="请输入联系人" maxlength="30" center clearable />
            <van-field v-model="form.mobile" label="电话" placeholder="请输入电话" maxlength="30" center clearable />
          </div>
        </div> -->

        <div class="tbs">
          <div class="price list" v-for="(item, index) in datas.amount_items" :key="index">
            <div class="left">{{ item.name }}</div>
            <div class="right">
              <div class="right">
                <font color="#E84E40"><span v-if="item.code == 'total_deduction_price'">-</span>{{ $i18n.t("money") }}{{ item.amount }}</font>
              </div>
            </div>
          </div>

          <div class="price list" v-for="(item, index) in datas.discount_amount_items" :key="index">
            <div class="left">{{ item.name }}</div>
            <div class="right">
              <div class="right">
                <font color="#E84E40">-{{ $i18n.t("money") }}{{ item.amount }}</font>
              </div>
            </div>
          </div>

          <div class="price list" v-for="(item, i) in service" :key="i">
            <div class="left">{{ item.name }}</div>
            <div class="right">
              <div class="right">
                <font color="#E84E40">{{ $i18n.t("money") }}{{ item.amount }}</font>
              </div>
            </div>
          </div>

          <div class="price list">
            <div class="left">实付金额</div>
            <div class="right">
              <div class="right">
                <font color="#E84E40">{{ $i18n.t("money") }}{{ price }}</font>
              </div>
            </div>
          </div>
        </div>

        <div class="agreement" v-if="agreementPayData">
          <div class="right">
            <van-checkbox v-model="agreementPay" checked-color="#f15353" shape="square"></van-checkbox>
          </div>
          <div class="left">
            <span style="color: red; line-height: 1.8rem;" @click="showPay">《支付协议》 </span>
          </div>
        </div>

        <div id="payBtnList">
          <div class="sureBtn" @click="submit('54')" v-if="price == '0.00'">{{confirmPayText}}</div>

          <div class="title" v-if="price > 0">
            <span class="line"></span>
            <span>支付方式</span>
          </div>
          <template v-if="price > 0">
            <!--yz_pay 包括支付需要的弹窗和红包-->
            <yz_pay
              :payType="payType"
              :typename="typename"
              @submit="submit"
              :popupSpecs="popupSpecs"
              :showQR="showQR"
              :qrcode="qrcode"
              :showZFBQR="showZFBQR"
              :isZFBQR="isZFBQR"
              :balanceNum="balanceNow"
              @closePacket="closePacket"
            >
            </yz_pay>
          </template>
        </div>
      </div>
    </transition>
    <!-- 支付协议 -->
    <van-popup v-model="agreementPayShow" position="right" style="width: 100%; height: 100%;">
      <van-nav-bar title="支付协议" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="agreementPayShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <div>
        <p v-html="agreementPayData"></p>
      </div>
    </van-popup>
  </div>
</template>
<script>
import member_balance_recharge_store from "./member_balance_recharge_storecontroller";
export default member_balance_recharge_store;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_recharge_s {
  padding-bottom: 20rem;
}

.activityBox {
  width: 21.56rem;
  background-color: #fff;
  border-radius: 0.31rem;
  padding: 1rem 0.94rem;
  margin: 0 auto;
  margin-top: 0.63rem;

  .activityTxt {
    font-size: 1rem;
    color: #2d2d2d;
    font-weight: 600;
    text-align: left;
    margin-bottom: 1.09rem;
  }

  .activityConten {
    text-align: left;
  }
}

.rechargeMethod {
  width: 21.56rem;
  background-color: #fff;
  border-radius: 0.31rem;
  padding: 1rem 0.94rem;
  margin: 0 auto;

  .methodBox {
    display: flex;
    flex-direction: column;

    .li {
      position: relative;
      display: flex;
      align-items: center;
      line-height: 3.5rem;
      font-size: 16px;
      padding: 0 0.84rem;
      justify-content: space-between;

      .lis {
        display: flex;
        align-items: center;
      }

      .iconfont_bg {
        background: #f15353;
        width: 2.25rem;
        height: 1.5rem;
        border-radius: 0.1875rem;
        display: flex;
        align-items: center;
        margin-right: 0.625rem;
      }

      .icon-balance_d {
        color: #00908c;
      }

      .icon-balance_e {
        color: #64b42e;
      }

      .icon-balance_f {
        color: #fac337;
      }

      .icon-balance_g {
        color: #00508e;
      }

      .icon-balance_h {
        color: #fac337;
      }

      .icon-balance_i {
        color: #64b42e;
      }

      .icon-balance_j {
        color: #069ce7;
      }

      .icon-balance_z {
        background-image: url('../../../assets/images/pay_e.png');
      }

      .iconfont {
        font-size: 1.4rem;
        margin-right: 0.625rem;
        width: 1.38rem;
        height: 1.38rem;
        display: flex;
        align-items: center;
      }
    }

    li:last-child {
      border: none;
    }
  }

  .methodTxt {
    font-size: 0.88rem;
    color: #2d2d2d;
    font-weight: 600;
    text-align: left;
    margin-bottom: 1.09rem;
  }
}

.current {
  display: flex;
  justify-content: flex-end;
  margin-right: 0.94rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #494949;
  margin-bottom: 1.22rem;
}

.moneyInp {
  width: 21.56rem;
  height: 4.06rem;
  background-color: #fff;
  border-radius: 0.31rem;
  border: solid 1px #aeaeae;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;

  .van-cell {
    padding: 0;
    font-size: 1.13rem;
  }

  .smallInp {
    font-size: 18px;
    color: #949494;
  }

  .small {
    width: 50%;
    overflow: hidden;
    text-align: right;
    flex-shrink: 0;
    font-size: 0.75rem;
    text-overflow: ellipsis;

    span {
      font-size: 1.5rem;
    }
  }
}

.storeUser {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.47rem;
  margin-bottom: 1.31rem;

  .storeName {
    margin-left: 0.66rem;
  }

  .storeImg {
    width: 1.88rem;
    height: 1.88rem;
    border-radius: 100%;

    img {
      width: 1.88rem;
      height: 1.88rem;
      border-radius: 100%;
    }
  }
}

.btn {
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;

  .btn_box {
    border-top: solid 0.0625rem #ccc;

    .line_one {
      display: flex;

      button {
        width: 5.8125rem;
        height: 3.9375rem;
        font-size: 36px;
        background: none;
        color: #333;
        border-radius: 0;
        padding: 0;
        border: none;
        border-right: solid 0.0625rem #ccc;

        i {
          font-size: 3rem;
          color: #666;
        }
      }

      button:last-child {
        border-right: none;
      }
    }

    .btn_bottom {
      .line_two {
        display: flex;

        .line-left {
          .line_box {
            .line_two {
              display: flex;
              border-top: solid 0.0625rem #ccc;

              button {
                width: 5.8rem;
                height: 3.9375rem;
                font-size: 36px;
                background: none;
                color: #333;
                border-radius: 0;
                padding: 0;
                border: none;
                border-right: solid 0.0625rem #ccc;
              }

              button:last-child {
                border-right: none;
              }
            }

            .line_three {
              border-top: solid 0.0625rem #ccc;
              display: flex;

              button {
                width: 5.8rem;
                height: 3.9375rem;
                font-size: 36px;
                background: none;
                color: #333;
                border-radius: 0;
                padding: 0;
                border: none;
                border-right: solid 0.0625rem #ccc;
              }

              button:last-child {
                border-right: none;
              }
            }

            .line_four {
              display: flex;
              border-top: solid 0.0625rem #ccc;

              button {
                width: 5.8rem;
                height: 3.9375rem;
                font-size: 36px;
                background: none;
                color: #333;
                border-radius: 0;
                padding: 0;
                border: none;
                border-right: solid 0.0625rem #ccc;
              }

              button:last-child {
                border-right: none;
              }
            }
          }
        }

        .line-right {
          button {
            width: 6rem;
            height: 12rem;
            padding: 0;
            border-radius: 0;
            font-size: 18px;
          }
        }
      }
    }
  }
}

.pcStyle {
  left: auto;
}

.pcStyleWidth {
  width: 375px;
}

.noPc {
  width: 100%;
}
// 弹窗
.popup {
  background: #f5f5f5;

  .tbs.coupon-list {
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;

    .couponss {
      .left {
        font-size: 16px;
        color: #333;
      }
    }
  }

  .tbs {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem;
    line-height: 1.875rem;
    font-size: 14px;
    margin-top: 0.625rem;

    .list {
      width: 100%;
      // padding-bottom: 0.625rem;
    }

    .list:nth-last-child(1) {
      padding-bottom: 0;
    }

    .score {
      display: flex;
      width: 100%;
      height: 2rem;
      clear: both;

      .left {
        flex: 1;
        align-self: center;
      }

      .right {
        flex: 0 0 2rem;
        align-self: center;
      }
    }

    .left {
      text-align: left;
      float: left;

      span {
        font-size: 14px;
      }
    }

    .right {
      text-align: right;
      float: right;
    }

    p {
      text-align: left;
      margin: 0;
      padding-right: 0.625rem;
      line-height: 2rem;
      width: 100%;

      span {
        color: #858585;
        font-size: 12px;
        float: right;
      }
    }
  }

  .agreement {
    background: #fff;
    width: 100%;
    padding: 0 0.5rem;
    text-align: left;
    display: flex;

    .right {
      margin-top: 3px;
      line-height: 1.7rem;
    }

    a {
      color: #f15353;
    }

    .checkbox {
      z-index: 88;
      border-radius: 50%;
    }

    .el-checkbox {
      float: none;
    }
  }

  .text_box {
    position: fixed;
    top: 0;
    z-index: 10;
    background: #fff;
    // width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: solid 0.0625rem #ebebeb;

    span {
      font-weight: bold;
      font-size: 15px;
      color: #666;
    }

    i {
      position: absolute;
      line-height: 2.5rem;
      font-size: 1rem;
      color: #999;
      left: 0.625rem;
    }

    .icon-back::before {
      padding: 0.5rem;
    }
  }

  .popup_pay {
    margin-top: 0.625rem;
    background: #fff;
    text-align: center;
    padding: 0.625rem 0;

    li:first-child {
      color: #8c8c8c;
      font-size: 16px;
      line-height: 2.5rem;
    }

    li:last-child {
      span:first-child {
        font-size: 16px;
      }

      span:last-child {
        font-size: 36px;
      }
    }
  }

  .popup_btn {
    padding-bottom: 1.25rem;

    .text {
      display: block;
      line-height: 2.5rem;
      padding-left: 1.25rem;
      font-size: 16px;
      text-align: left;
      font-weight: bold;
      color: #666;
    }

    button {
      width: 21.5625rem;
      padding: 0 0.625rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 2.625rem;
      border-radius: 0.375rem;
      background: #fff;
      border: solid 0.0625rem #dedede;
      margin: 0 auto 0.625rem;

      .icon_bg {
        width: 2.25rem;
        height: 1.5rem;
        border-radius: 0.1875rem;
        line-height: 1.5rem;

        i {
          color: #fff;
          font-size: 1.5rem;
        }

        .card {
          display: inline-block;
          width: 2rem;
          height: 1.5rem;
          background-image: url("../../../assets/images/pay_e.png");
          background-size: 2rem 2rem;
          background-position: center;
        }
      }

      span {
        color: #333;
        font-size: 16px;
        margin-left: 0.625rem;
      }
    }
  }

  #payBtnList {
    width: 21.5625rem;
    padding: 0.75rem 0;
    background-color: #fff;
    border-radius: 0.4375rem;
    margin: 0 auto;
    margin-bottom: 2.5625rem;
    margin-top: 1rem;

    .title {
      color: #f87070;
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      .line {
        height: 0.875rem;
        width: 0.1875rem;
        background-color: #f87070;
        display: inline-block;
        margin-right: 0.875rem;
      }
    }
  }
}
</style>
