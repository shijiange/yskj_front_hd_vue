<template>
  <div id="coupon_v2_detail">
    <c-title :hide="false" text="优惠券详情"></c-title>
    <div class="centen_box">
      <div class="imgBox">
        <img :src="img_url" alt />
      </div>
      <span class="couponName">{{ infoItem.name }}</span>
      <div class="couponBtn">
        <div class="donation" @click="presenter(info)" v-if="isPresenter">转赠</div>
        <div class="cancel" v-if="write_off_coupon && info.belongs_to_coupon.plugin_id == '32'" @click="tapShow(info.id)">
          核销
        </div>
        <div class="share" v-if="share_coupon" @click="tapShare">我要分享</div>
      </div>
      <div class="moneyBox">
        <template v-if="coupon_method == 1">
          <div class="in_moneyBox">
            <div>满{{ info.belongs_to_coupon.enough }}可用</div>
          </div>
          <div class="botm_moneyBox" :style="{ top: info.belongs_to_coupon.deduct.length >= 5 ? '4.5rem' : '4rem' }">
            <div :style="{ fontSize: info.belongs_to_coupon.deduct.length >= 5 ? '1.251rem' : '2.251rem' }">{{ $i18n.t("money") }}{{ info.belongs_to_coupon.deduct }}</div>
          </div>
        </template>
        <template v-if="coupon_method == 2">
          <div class="in_moneyBox">
            <div>满{{ info.belongs_to_coupon.enough }}折立享</div>
          </div>
          <span style=" margin: 0 auto; font-size: 2.251rem; margin-top: 1rem; color: #df0132;">{{ info.belongs_to_coupon.discount }}折</span>
        </template>
      </div>
      <div class="line"></div>
      <div class="detailText">
        <span>有效期：{{ info.time_start }} — {{ info.time_end }}</span
        ><br />
        <span>券张数：{{ info.num }}张</span><br />
        <span>适用范围：{{ infoItem.coupon_type_name }}</span
        ><br />
        <span>使用规则：</span><br />
        <span>{{ rule }}</span
        ><br />
      </div>
      <div class="immediate" @click="goBuy(datainfo)">立即使用</div>
    </div>
    <!-- 转赠 -->
    <van-dialog v-model="showPresenter" title="请输入用户ID" show-cancel-button @confirm="cancelRecharge" @cancel="cancelP">
      <div class="yz_coupon_dialog">
        <input type="number" placeholder="请输入赠送的用户ID" v-model="recharge_search" @keyup="throttleFn" />
        <div class="other" v-show="nickname && recharge_search">
          <template v-if="nickname != '查无此用户'">昵称：</template>
          {{ nickname }}
        </div>

        <div class="recharge-wrapper" v-show="multiple_use.is_open || (config_info.switch && nickname != '查无此用户' && recharge_search)">
          <div class="recharge-num-box">
            <div>赠送数量</div>
            <div>
              <van-stepper theme="round" v-if="multiple_use.is_open" @change="changeRechargeNum(multiple_use.nums)" v-model="rechargeNum" min="1" :max="multiple_use.nums" />
              <van-stepper theme="round" v-if="!multiple_use.is_open" @change="changeRechargeNum(info.num)" v-model="rechargeNum" min="1" :max="info.num" />
            </div>
          </div>
          <div class="nums" v-if="multiple_use.is_open">拥有数量 {{ multiple_use.nums }}</div>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="showRechargePay" :title="config_info.protocol_name" show-cancel-button @confirm="presenterPost">
      <div style="padding: 1rem 0.875rem;" v-html="config_info.protocol_content"></div>
    </van-dialog>
    <!-- 领取成功图片 -->
    <van-popup v-model="getSucceed" round class="newcomerAward_popup" :style="{ height: '20rem' }">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/coupons_successbg@2x.png" alt="" style="width: 15.6rem; height: 18rem;" />
      <div class="getsucceed_text">
        <div class="lines" @click="goMyCoupon">我的优惠券</div>
        <div @click="goConponCenter">领券中心</div>
      </div>
    </van-popup>
    <!-- 显示核销码 -->
    <van-popup v-model="verification" round class="newcomerAward_popup" :style="{ height: '26rem' }">
      <div class="verification_box" @click="close_verification">
        <span>优惠券核销</span>
        <div class="line"></div>
        <div class="heimg">
          <img :src="verificationImg" alt />
        </div>
        <p>出示二维码 核销优惠券</p>
        <div class="cancelBox">
          <i class="iconfont icon-adsystem_icon_cancle"></i>
        </div>
      </div>
    </van-popup>
    <!-- 分享张数选择 -->
    <van-popup v-model="showSelect" round class="newcomerAward_popup" :style="{ height: '6.906rem' }">
      <div class="shareMum">
        <div class="mumTop">分享张数：<van-stepper v-model="shareNum" theme="round" button-size="22" @change="shareMunTap" /></div>
        <div class="mumBottom">
          <div class="lines" @click="shareConfirm">分享</div>
          <div @click="closeShare">取消</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import coupon_v2_detailcontroller from "./coupon_v2_detailcontroller";

export default coupon_v2_detailcontroller;
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

  .lines {
    border-right: 1px solid #000;
  }

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
  width: 9.094rem;
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
</style>
