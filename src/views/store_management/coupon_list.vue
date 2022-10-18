<template>
  <div id="coupon_index">
    <c-title :hide="false" text="优惠券"></c-title>

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
          <div class="shopCoupon" v-for="(item, index) in wait_used" :key="index">
            <div class="shopCouponNew" v-if="item.belongs_to_coupon">
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
          </div>
          <yz-blank :datas="wait_used" text="空空如也"></yz-blank>
        </div>
        <!-- 已过期 -->
        <div v-show="selected == 2">
          <div class="shopCoupon" v-for="(item, index) in overdue" :key="index">
            <div class="shopCouponNew" v-if="item.belongs_to_coupon">
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
          </div>
          <yz-blank :datas="overdue" text="空空如也"></yz-blank>
        </div>
        <!-- 已使用 -->
        <div v-show="selected == 3">
          <div class="shopCoupon" v-for="(item, index) in used" :key="index">
            <div class="shopCouponNew" v-if="item.belongs_to_coupon">
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
          </div>
          <yz-blank :datas="used" text="空空如也"></yz-blank>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import couponList from "./coupon_list_controller";
export default couponList;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/coupon_index.scss";
@import "../../assets/css/coupon_newind.scss";

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
</style>
