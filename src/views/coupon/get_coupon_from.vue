<template>
  <div id="coupon_v2_detail">
    <c-title :hide="false" text="优惠券详情"></c-title>
    <div class="centen_box" v-show="isShow">

      <span class="couponName">{{ datainfo.name }}</span>

      <div class="moneyBox">
        <template v-if="datainfo.coupon_method == 1">
          <div class="in_moneyBox">
            <div>满{{ datainfo.enough }}可用</div>
          </div>
          <div class="botm_moneyBox" :style="{ top: datainfo.deduct.length >= 5 ? '4.5rem' : '4rem' }">
            <div :style="{ fontSize: datainfo.deduct.length >= 5 ? '1.251rem' : '2.251rem' }">{{ $i18n.t("money") }}{{ datainfo.deduct }}</div>
          </div>
        </template>
        <template v-if="datainfo.coupon_method == 2">
          <div class="in_moneyBox">
            <div>满{{ datainfo.enough }}折立享</div>
          </div>
          <span style=" margin: 0 auto; font-size: 2.251rem; margin-top: 1rem; color: #df0132;">{{ datainfo.discount }}折</span>
        </template>
      </div>
      <div class="line"></div>
      <div class="detailText" v-if="datainfo">
        <span v-if="datainfo.time_limit == 1">有效期：{{ datainfo.time_start }} — {{ datainfo.time_end }}</span>
        <span v-else-if="datainfo.time_days > 0">有效期：领取后{{ datainfo.time_days }}天内可以使用</span>
        <span v-else>有效期：领取后不限时间使用</span>
        <br />

        <span>适用范围：{{ datainfo.coupon_type_name }}</span
        ><br />
        <span>使用规则：</span><br />
        <span>{{ datainfo.rule }}</span
        ><br />
      </div>
      <div class="immediate" :class="[buttonStatus.disabled ? 'disabled' : '']"  @click="!buttonStatus.disabled && selectedcoupon()">{{buttonStatus.text}}</div>
    </div>


    <!-- 领取成功图片 -->
    <van-popup v-model="getSucceed" round class="newcomerAward_popup" :style="{ height: '20rem' }">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/coupons_successbg@2x.png" alt="" style="width: 15.6rem; height: 18rem;" />
      <div class="getsucceed_text">
        <div class="lines" @click="goMyCoupon">我的优惠券</div>
      </div>
    </van-popup>


  </div>
</template>
<script>
import get_coupon_from_controller from "./get_coupon_from_controller";

export default get_coupon_from_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.getsucceed_text {
  position: absolute;
  bottom: 3rem;
  left: 0;
  width: 100%;
  color: #000;
  display: flex;
  justify-content: center;


  div {
    font-size: 12px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.shareMum {
  width: 16.25rem;
  height: 6.906rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .mumTop {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.219rem;
  }

  .mumBottom {
    flex: 1;
    background-color: #fc6d6d;
    display: flex;
    align-items: center;
    justify-content: center;

    .lines {
      border-right: 1px solid #fff;
    }

    div {
      color: #fff;
      font-size: 0.976rem;
      padding-left: 1.9rem;
      padding-right: 1.9rem;
      box-sizing: border-box;
    }
  }
}

#coupon_v2_detail {
  min-height: 100vh;
  background-color: #fc7d7d;
  overflow: hidden;
}

.centen_box {
  margin: 5.844rem 0.781rem 1.438rem 0.813rem;
  background-color: #fff;
  border-radius: 0.434rem;
  min-height: 33.625rem;
  display: flex;
  flex-direction: column;
}

.imgBox {
  width: 5.406rem;
  height: 5.406rem;
  border-radius: 50%;
  background-color: aqua;
  margin: 0 auto;
  margin-top: -2.21rem;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.couponName {
  font-size: 1.193rem;
  margin-top: 0.688rem;
}

.couponBtn {
  display: flex;
  justify-content: center;
  margin-top: 1.18rem;
}

.couponBtn .share {
  height: 1.563rem;
  padding: 0 0.5rem;
  color: #fff;
  line-height: 1.563rem;
  background: #f82d2b;
  border-radius: 0.651rem;
  font-size: 0.968rem;
  margin-left: 1.094rem;
}

.couponBtn .cancel {
  width: 3.313rem;
  height: 1.563rem;
  border-radius: 0.651rem;
  border: solid 0.065rem #2878e4;
  color: #2878e4;
  font-size: 0.968rem;
  margin-left: 1.094rem;
}

.couponBtn .donation {
  width: 4.8rem;
  height: 1.563rem;
  line-height: 1.563rem;
  border-radius: 0.651rem;
  color: #fff;
  font-size: 0.968rem;
  background: #29ba9c;
}

.moneyBox {
  display: flex;
  margin: 0 2.25rem 0 1.75rem;
  height: 9.313rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/coupons_receivebg@2x.png");
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.625rem;
  position: relative;
  align-items: center;

  .in_moneyBox {
    position: absolute;
    top: 1.4rem;
    width: 12.563rem;
    left: 2.938rem;
    margin: 0 auto;

    div {
      height: 100%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
    }
  }

  .botm_moneyBox {
    position: absolute;
    top: 4rem;
    width: 12.563rem;
    left: 2.938rem;
    margin: 0 auto;

    div {
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #df0132;
      margin: 0 auto;
      font-size: 2.251rem;
    }
  }
}

.line {
  width: 19.25rem;
  border: dashed 0.065rem #fc7c7c;
  margin: 0 auto;
  margin-top: 1.094rem;
  box-sizing: border-box;
  outline: none;
}

.detailText {
  text-align: left;
  margin: 0 1.313rem 0 1.281rem;
  padding: 1.344rem 0;

  span {
    line-height: 1.9rem;
  }
}

.immediate {
  width: 10rem;
  height: 4.25rem;
  background-color: #f82d2b;
  border-radius: 0.65rem;
  font-size: 1.193rem;
  color: #fff;
  text-align: center;
  line-height: 4.25rem;
  margin: 0 auto;
  margin-bottom: 1.281rem;
}
.disabled{
  background-color: #aaa8a8;
}
// 转让弹窗
.yz_coupon_dialog {
  p {
    color: #999;
  }

  input {
    width: 90%;
    margin: 0.875rem 0;
    height: 2rem;
    line-height: 2rem;
    padding: 0 0.25rem;
    border-radius: 4px;
    font-size: 0.875rem;
    border: 1px solid #999;
  }

  .other {
    width: 90%;
    margin: 0 auto 0.875rem;
    text-align: left;
  }

  .recharge-wrapper {
    padding: 0 0.875rem 0.875rem;
    font-size: 0.875rem;

    .recharge-num-box {
      display: flex;
      justify-content: space-between;
    }

    .nums {
      text-align: left;
      color: #f15151;
    }
  }
}
// 核销弹窗
.newcomerAward_popup {
  background-color: transparent !important;
}

.verification_box {
  width: 15.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 0.65rem;
  position: relative;

  .heimg {
    width: 10.94rem;
    height: 10.97rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  span {
    margin: 1.53rem 0 1.13rem 0;
  }

  .line {
    width: 12.41rem;
    height: 0.03rem;
    background-color: #757575;
    border: solid 0.04rem #605e5e;
    opacity: 0.65;
  }

  p {
    margin: 0.88rem 0 1.34rem 0;
    font-size: 0.81rem;
    color: #6d6b6b;
  }
}
.integral-exchange-Popup {
  width: 80%;
  padding: 1rem 0 0 0;
  /deep/ .counter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2rem 0 1rem 0;
    padding: 0 2rem;
    .van-stepper__minus {
      background: #4e4e4e;
      color: #fff;
      border: none;
    }
    .van-stepper__minus::before {
      width: 50%;
      height: 2px;
    }
  }
  .tips {
    text-align: left;
    padding: 0 2rem;
  }
  .red-text {
    color: #ff6060;
  }
  .bottom-btns {
    display: flex;
    .cancel-btn,
    .exchange-btn {
      flex: 1;
      margin-top: 1rem;
      padding: 0.8rem 0;
      border: 1px solid #dddada;
    }
    .exchange-btn {
      color: #ff6060;
    }
  }
}
</style>
