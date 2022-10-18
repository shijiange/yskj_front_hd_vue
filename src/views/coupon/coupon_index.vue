<template>
  <div id="coupon_index">
    <c-title :hide="false" text="我的优惠券"></c-title>

    <van-tabs v-model="selected" @click="switchItem">
      <van-tab name="1" title="待使用"></van-tab>
      <van-tab name="2" title="已过期"></van-tab>
      <van-tab name="3" title="已使用"></van-tab>
    </van-tabs>

    <div>
      <div class="coupon_box">
        <div class="navTabr">
          <ul>
            <li
              v-for="(item, index) in types"
              :key="index"
              @click="setTypesIndex(index)"
              :style="{ backgroundColor: typesIndex == index ? '#4f4f4f' : '', color: typesIndex == index ? '#ffffff' : '' }"
            >
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <!-- 待使用 -->
        <div v-show="selected == 1">
          <div class="shopCoupon" v-for="(item, index) in wait_used" :key="index" @click="goDetail(item)">
            <van-swipe-cell>
              <div class="shopCouponNew">
                <div class="left">
                  <div class="postLeft" :style="{ backgroundImage: `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_${item.type}.png)` }">
                    <template v-if="item.belongs_to_coupon.coupon_method == 1">
                      <span class="textOne" :style="{ fontSize: item.belongs_to_coupon.deduct.length > 5 ? '0.7rem' : '' }"> {{ $i18n.t("money") }}{{ item.belongs_to_coupon.deduct }} </span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}可用</span>
                    </template>
                    <template v-if="item.belongs_to_coupon.coupon_method == 2">
                      <span class="textOne">{{ $i18n.t("money") }}{{ item.belongs_to_coupon.discount }}折</span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}立享</span>
                    </template>
                  </div>
                </div>
                <div class="right">
                  <div class="right_top">
                    <div class="right_top_text">
                      <div :class="`baground_${item.type}`">{{ item.belongs_to_coupon.coupon_type_name }}</div>
                      <template v-if="item.combine && item.num != 1">
                        <span>{{ item.num }}张</span>
                      </template>
                    </div>
                  </div>
                  <div class="right_top_bottom_text">
                    {{ item.belongs_to_coupon.name }}
                  </div>
                  <div class="right_bottom">{{ item.time_start }}-{{ item.time_end }}</div>
                  <div class="dueBox" v-if="item.near_expiration == 1">快过期</div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" style="height: 100%;" @click="delteteItem(item, index)" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
        <!-- 已过期 -->
        <div v-show="selected == 2">
          <div class="shopCoupon" v-for="(item, index) in overdue" :key="index">
            <van-swipe-cell>
              <div class="shopCouponNew">
                <div class="left">
                  <div class="postLeft" :style="{ backgroundImage: `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_7.png)` }">
                    <template v-if="item.belongs_to_coupon.coupon_method == 1">
                      <span class="textOne" :style="{ fontSize: item.belongs_to_coupon.deduct.length > 5 ? '0.7rem' : '' }"> {{ $i18n.t("money") }}{{ item.belongs_to_coupon.deduct }} </span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}可用</span>
                    </template>
                    <template v-if="item.belongs_to_coupon.coupon_method == 2">
                      <span class="textOne">{{ $i18n.t("money") }}{{ item.belongs_to_coupon.discount }}折</span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}立享</span>
                    </template>
                  </div>
                </div>
                <div class="right">
                  <div class="right_top">
                    <div class="right_top_text">
                      <div :class="`baground_${item.type}`">{{ item.belongs_to_coupon.coupon_type_name }}</div>
                      <template v-if="item.combine && item.num != 1">
                        <span>{{ item.num }}张</span>
                      </template>
                    </div>
                  </div>
                  <div class="right_top_bottom_text">
                    {{ item.belongs_to_coupon.name }}
                  </div>
                  <div class="right_bottom">{{ item.time_start }}-{{ item.time_end }}</div>
                  <div class="isdueBox">已过期</div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" style="height: 100%;" @click="delteteItem(item, index)" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
        <!-- 已使用 -->
        <div v-show="selected == 3">
          <div class="shopCoupon" v-for="(item, index) in used" :key="index">
            <van-swipe-cell>
              <div class="shopCouponNew">
                <div class="left">
                  <div class="postLeft" :style="{ backgroundImage: `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_7.png)` }">
                    <template v-if="item.belongs_to_coupon.coupon_method == 1">
                      <span class="textOne" :style="{ fontSize: item.belongs_to_coupon.deduct.length > 5 ? '0.7rem' : '' }"> {{ $i18n.t("money") }}{{ item.belongs_to_coupon.deduct }} </span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}可用</span>
                    </template>
                    <template v-if="item.belongs_to_coupon.coupon_method == 2">
                      <span class="textOne">{{ $i18n.t("money") }}{{ item.belongs_to_coupon.discount }}折</span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.belongs_to_coupon.enough }}立享</span>
                    </template>
                  </div>
                </div>
                <div class="right">
                  <div class="right_top">
                    <div class="right_top_text">
                      <div :class="`baground_${item.type}`">{{ item.belongs_to_coupon.coupon_type_name }}</div>
                      <template v-if="item.combine && item.num != 1">
                        <span>{{ item.num }}张</span>
                      </template>
                    </div>
                  </div>
                  <div class="right_top_bottom_text">
                    {{ item.belongs_to_coupon.name }}
                  </div>
                  <div class="right_bottom">{{ item.time_start }}-{{ item.time_end }}</div>
                  <div class="isdueBox">已使用</div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" style="height: 100%;" @click="delteteItem(item, index)" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="coupon-shop">
      <router-link :to="fun.getUrl('CouponShareCode')" v-if="share_coupon" style="width:50%;">
        <p class="line">优惠券分享</p>
      </router-link>
      <router-link :to="fun.getUrl('couponStore')" style="flex:1;">
        <p v-if="share_coupon">更多优惠去领券中心</p>
        <p v-if="!share_coupon">更多优惠去领券中心&nbsp;&nbsp;&nbsp;>></p>
      </router-link>
    </div> -->
    <div class="posbtn" @click="toStore">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/coupons_centerbg@2x.png" alt="" />
      <div>领券中心</div>
    </div>
    <van-dialog v-model="showPresenter" title="请输入用户ID" show-cancel-button @confirm="presenterPost" @cancel="cancelP">
      <div class="yz_coupon_dialog">
        <input type="number" placeholder="请输入赠送的用户ID" v-model="recharge_search" @keyup="throttleFn" />
        <div class="other" v-show="nickname && recharge_search">
          <template v-if="nickname != '查无此用户'">昵称：</template>
          {{ nickname }}
        </div>
      </div>
    </van-dialog>
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
  </div>
</template>
<script>
import couponcontroller from "./coupon_indexcontroller";

export default couponcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/coupon_index.scss";
@import "../../assets/css/coupon_newind.scss";

.posbtn {
  position: fixed;
  bottom: 5rem;
  right: 50%;
  transform: translateX(10rem);

  img {
    width: 3.78rem;
  }

  div {
    border-radius: 5px;
    text-align: center;
    font-size: 12px;
    background: #fb605f;
    padding: 0.2rem 0.3rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.baground_4 {
  background-color: #6dccf8;
}

.baground_6 {
  background-color: #fb946c;
}

.baground_1 {
  background-color: #fbbd5c;
}

.baground_5 {
  background-color: #6dccf8;
}

.baground_3 {
  background-color: #a291ff;
}

.baground_2 {
  background-color: #fc6d6d;
}

.baground_8 {
  background-color: #3c98ff;
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

.cancelBox {
  position: absolute;
  bottom: -4rem;

  i {
    color: #fff;
    font-size: 3rem;
  }
  // width: 2.16rem;
  // height: 2.13rem;
  // border-radius: 50%;
  // border: 1px solid #ffffff;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}

.newcomerAward_popup {
  background-color: transparent !important;
}

.yz_coupon_dialog {
  p {
    color: #999;
  }

  input {
    width: 80%;
    margin: 0.875rem 0;
    height: 2rem;
    line-height: 2rem;
    padding: 0 0.25rem;
    border-radius: 4px;
    font-size: 0.875rem;
    border: 1px solid #999;
  }

  .other {
    width: 80%;
    margin: 0 auto 0.875rem;
    text-align: left;
  }
}
</style>
