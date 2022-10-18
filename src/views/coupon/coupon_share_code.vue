<template>
  <div id="coupon_share_code">
    <c-title :hide="false" text="优惠券分享"></c-title>
    <div style="width: 100%; margin-bottom: 1rem;"></div>
    <div class="list" v-for="(item, index) in list" :key="index">
      <van-radio-group v-model="result" checked-color="#ef2844">
        <div class="checkLis">
          <van-radio :name="index" @click="radioChange"></van-radio>
          <div class="shopCoupon">
            <div class="shopCouponNew">
              <div class="left">
                <div
                  class="postLeft"
                  :style="{
                    backgroundImage:
                      item.combine && item.num != 1
                        ? `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbgreceive_${item.type}@2x.png)`
                        : `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_${item.type}.png)`
                  }"
                >
                  <template v-if="item.combine && item.num != 1">
                    <span class="Chapter_number">{{ item.num }}张</span>
                  </template>
                  <template v-if="item.belongs_to_coupon.coupon_method == 1">
                    <span class="textOne" :style="{ fontSize: item.belongs_to_coupon.deduct.length > 5 ? '0.7rem' : '', marginLeft: item.combine && item.num != 1 ? '0.6rem' : '0' }">{{
                      item.belongs_to_coupon.deduct
                    }}</span>
                    <span class="textTwo">满{{ item.belongs_to_coupon.enough }}可用</span>
                  </template>
                  <template v-if="item.belongs_to_coupon.coupon_method == 2">
                    <span class="textOne" :style="{ fontSize: item.belongs_to_coupon.deduct.length > 5 ? '0.7rem' : '', marginLeft: item.combine && item.num != 1 ? '0.6rem' : '0' }"
                      >{{ item.belongs_to_coupon.discount }}折</span
                    >
                    <span class="textTwo">满{{ item.belongs_to_coupon.enough }}立享</span>
                  </template>
                </div>
              </div>
              <div class="right">
                <div class="right_top">
                  <div class="right_top_text">
                    <div>{{ item.belongs_to_coupon.coupon_type_name }}</div>
                    <span>{{ item.belongs_to_coupon.name }}</span>
                  </div>
                  <div class="right_top_bottom_text">
                    <span>{{ item.time_start }}-{{ item.time_end }}</span>
                  </div>
                </div>
                <div class="right_bottom">
                  <div class="left_message">
                    <span>详细信息</span>
                    <div @click="toggle($event, index)">
                      <i class="fa coupon_voucher_more_arr" :class="{ 'fa-angle-down': index == display, 'fa-angle-right': index != display }"></i>
                    </div>
                  </div>
                </div>
                <div class="dueBox" v-if="item.belongs_to_coupon.over_due">快过期</div>
              </div>
            </div>
            <div class="coupon_voucher_btm" :class="{ hies: display == index }">
              <p class="coupon_voucher_explain">{{ item.api_limit | escapeTitle }}</p>
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>
    <div class="posbtn">
      <div class="left">
        <span>分享张数</span>
        <div class="dbox" @click="minus">-</div>
        <!-- <span class="dboxTxt" style="margin: 0 0.5rem;">{{selectMun}}</span> -->
        <input type="munber" name="" id="" :value="selectMun" />
        <div class="dbox" @click="add">+</div>
      </div>
      <div class="right" @click="getRoute">
        <!-- <router-link :to="fun.getUrl('CouponShareShow')"> -->
        <p class="line">分享</p>
        <!-- </router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
import couponcontroller from "./coupon_share_code_controller.js";

export default couponcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#coupon_share_code {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3rem;
}

.posbtn {
  width: 100%;
  height: 3.47rem;
  display: flex;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 0.06rem 0.52rem 0.02rem rgba(117, 117, 117, 0.48);

  .left {
    flex: 1;
    line-height: 3.47rem;
    text-align: left;
    display: flex;
    align-items: center;

    span:first-child {
      padding-left: 1.13rem;
      padding-right: 1.13rem;
      font-size: 1.08rem;
    }

    input {
      border: none;
      width: 2rem;
      margin-left: 0.5rem;
      margin-right: 0.3rem;
      text-align: center;
    }
  }

  .right {
    width: 6.28rem;
    height: 3.47rem;
    line-height: 3.47rem;
    background-color: #fc6d6d;
    font-size: 1.08rem;
    color: #fff;
  }
}

.checkLis {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 0 1.13rem 0;
}

.shopCouponNew {
  width: 19.81rem;
  height: 6.75rem;
  display: flex;
}

.shopCoupon {
  width: 19.81rem;
  box-shadow: 0.03rem 0.12rem 0.44rem 0.02rem rgba(81, 81, 81, 0.52);
  position: relative;
  margin-bottom: 1rem;

  .left {
    flex: 1;
    height: 6.75rem;
    position: relative;

    .postLeft {
      position: absolute;
      right: 3px;
      top: 0;
      width: 7.59rem;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      align-items: center;
      // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_1.png');
      .Chapter_number {
        font-size: 0.6rem;
        color: #fff;
        position: absolute;
        top: 0.36rem;
        left: 0.6rem;
        width: 2rem;
        text-align: center;
      }

      .textOne {
        font-size: 1.63rem;
        color: #fff;
        margin-top: 1.8rem;
        // margin-left: 0.6rem;
        word-break: break-all;
      }

      .textTwo {
        font-size: 0.69rem;
        line-height: 0.84rem;
        color: #fff;
        margin-top: 0.72rem;
        margin-bottom: 0.5rem;
      }

      .tapBox {
        width: 4.66rem;
        height: 1.34rem;
        background-color: #fff;
        border-radius: 0.43rem;
        line-height: 1.44rem;

        span {
          color: #fba560;
          font-size: 0.79rem;
          letter-spacing: 0.08rem;
        }
      }
    }
  }

  .right {
    width: 12.6rem;
    height: 6.75rem;
    padding: 0 0.69rem 0 0.56rem;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    .dueBox {
      font-size: 0.68rem;
      width: 5rem;
      height: 1.2rem;
      position: absolute;
      right: -21px;
      top: 12px;
      transform: rotate(45deg);
      background: #42a354;
      color: #fff;
      letter-spacing: 0.1rem;
      line-height: 1.2rem;
      text-align: center;
    }

    .isdueBox {
      font-size: 0.91rem;
      width: 6rem;
      height: 1.8rem;
      position: absolute;
      right: -29px;
      top: 7px;
      transform: rotate(45deg);
      background: #cecece;
      color: #000;
      letter-spacing: 0.1rem;
      line-height: 1.8rem;
      text-align: center;
    }

    .right_top {
      width: 100%;
      height: 4.72rem;
      border-bottom: dashed 0.04rem #cacaca;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 0.56rem;

      .right_top_text {
        display: flex;
        align-items: center;

        div {
          background-color: #fbbd5c;
          border-radius: 0.22rem;
          width: 3.69rem;
          height: 1.09rem;
          margin-right: 0.53rem;
          font-size: 0.71rem;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        span {
          font-size: 0.88rem;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .right_top_bottom_text {
        display: flex;
        justify-content: space-between;

        span {
          font-size: 0.61rem;
          color: #9c9c9c;
          line-height: 1.7rem;
        }

        div {
          width: 3.34rem;
          height: 1.22rem;
          background-color: #fff;
          border-radius: 0.43rem;
          border: solid 0.04rem #ff8383;
          font-size: 0.78rem;
          color: #ff8383;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            font-size: 0.62rem;
            color: #ff8383;
            margin-left: 0.25rem;
          }
        }
      }
    }

    .right_bottom {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left_message {
        display: flex;
        align-items: center;

        div {
          width: 0.88rem;
          height: 0.88rem;
          background: #9c9c9c;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-left: 0.44rem;

          i {
            margin-top: -0.03rem;
            color: #fff;
          }
        }

        span {
          color: #9c9c9c;
          font-size: 0.76rem;
        }
      }

      .right_hexiao {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #6caafe;
        border-radius: 0.43rem;
        border: solid 0.04rem #6caafe;
        color: #fff;
        padding: 0 0.4rem;
        font-size: 0.78rem;
      }
      // div{
      //   width: 0.88rem;
      //   height: 0.88rem;
      //   background: #9c9c9c;
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      //   border-radius: 50%;
      //   i{
      //     color:#ffffff
      //   }
      // }
    }
  }

  .coupon_voucher_btm {
    display: none;
    position: relative;
    box-sizing: border-box;
    padding: 0.5rem 0.625rem;
    background-color: #f2f2f7;
    border-radius: 0.1875rem;

    .coupon_voucher_explain {
      color: #999;
      font-size: 12px;
      text-align: left;
    }
  }

  .coupon_voucher_btm.hies {
    display: block;
  }
}

.dbox {
  width: 1rem;
  height: 1rem;
  background-color: #b6b5b5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
