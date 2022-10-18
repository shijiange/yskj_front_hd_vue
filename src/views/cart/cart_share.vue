<template>
  <div id="cart">
    <c-title :hide="false" :text="'购物车分享'">
    </c-title>
    <img class="bg-box" :src="set.img_url || require('../../assets/images/cart_share_bg.png')" alt="">
    <div class="main-box">
      <!--会员和优惠券-->
      <div class="member-header">
        <div class="gift-btn" v-if="!share_id && set.is_gift_coupon==1" @click.stop="openCoupon"><i class="iconfont icon-fontclass-youhuiq"></i><span style="margin-left: 3px;">转增</span></div>
        <div class="header-top">
          <img class="actor" :src="member.avatar_image" alt="" />
          <span class="name">{{member.nickname}}{{set.title}}</span>
        </div>
        <div class="coupon-list-box" style="margin-right: 43px;" v-if="share_id && share_coupons.length > 0">
          <div class="coupon-item" v-for="coupon in share_coupons" :key="coupon">
            <div class="coupon-item-left">
              <span class="money" v-if="coupon.coupon_method==2">{{coupon.discount}}折</span>
              <span class="money" v-if="coupon.coupon_method==1"><span style="font-size: 10px;">{{$i18n.t('money')}}</span>{{coupon.deduct}}</span>
              <span style="font-size: 10px;">{{coupon.enough_msg}}</span>
              <div class="top-circle"></div>
              <div class="bottom-circle"></div>
            </div>
            <div class="coupon-item-right">
              <span>{{coupon.name}}</span>
              <div class="get-btn-box" v-if="coupon.sharing_status == 0" @click="getCoupon(coupon)"><span class="get-btn">领取</span></div>
              <div class="get-btn-box" v-if="coupon.sharing_status == 1"><span class="get-btn disabled">已领取</span></div>
              <div class="top-circle" style="left: -5px;"></div>
              <div class="bottom-circle" style="left: -5px;"></div>
            </div>
          </div>
        </div>
        <div class="coupon-list-box" v-if="!share_id && share_coupons.length > 0">
          <div class="coupon-item" v-for="coupon in share_coupons" :key="coupon">
            <div class="coupon-item-left">
              <span class="money" v-if="coupon.belongs_to_coupon.coupon_method==2">{{coupon.belongs_to_coupon.discount}}折</span>
              <span class="money" v-if="coupon.belongs_to_coupon.coupon_method==1"><span style="font-size: 10px;">{{$i18n.t('money')}}</span>{{coupon.belongs_to_coupon.deduct}}</span>
              <span style="font-size: 10px;" v-if="coupon.belongs_to_coupon.coupon_method==2">满{{ coupon.belongs_to_coupon.enough }}立享</span>
              <span style="font-size: 10px;" v-if="coupon.belongs_to_coupon.coupon_method==1">满{{ coupon.belongs_to_coupon.enough }}立减</span>
              <div class="top-circle"></div>
              <div class="bottom-circle"></div>
            </div>
            <div class="coupon-item-right">
              <span>{{coupon.belongs_to_coupon.name}}</span>
              <div class="get-btn-box"><span class="get-btn">{{coupon.num}}张</span></div>
              <div class="top-circle" style="left: -5px;"></div>
              <div class="bottom-circle" style="left: -5px;"></div>
            </div>
          </div>
        </div>
        <div class="asset-line" v-if="share_id && share_coupons.length > 0"></div>
        <div class="one-click-box" :class="{'disabled': all_get_coupon}" v-if="share_id && share_coupons.length > 0" @click="getCoupon('all')">
          <span>一键领取</span>
        </div>
      </div>

      <!--带share_id的 购物车列表-->
      <div class="cart-list-box" v-if="share_id">
        <van-checkbox-group v-model="eachCheckList" @change="allSelectHandle($event)">
          <div class="cart-box" v-for="(good, index) in cartList" :key='index'>
            <div class="cart_good" @click.stop="selectBolfun(0)">
              <van-checkbox checked-color="#f15353" :disabled="good.stock == 0" :name="good.goods_id"></van-checkbox>
              <div class="right">
                <div class="img" @click.stop="toGoodsInfo(good)">
                  <img :src="good.thumb"/>
                </div>
                <div class="info">
                  <ul class="inner">
                    <h1 class="name"
                        @click.stop="toGoodsInfo(good)"
                        style="-webkit-box-orient: vertical;">
                      {{ good.title|escapeTitle }}
                    </h1>
                    <li class="introduction">
                      <span class="option_str" :style="{backgroundColor: good.option_title ? '' : '#fff'}">
                            {{ good.option_title }}
                          </span>
                    </li>
                  </ul>
                  <div class="other">
                    <!--<template v-if="good.style_type == 'point-mall'">-->
                      <!--&lt;!&ndash;point_goods积分商城商品显示&ndash;&gt;-->
                      <!--<div class="price"><span>{{ good.point_goods.point }}</span>{{integral}}</div>-->
                    <!--</template>-->
                    <!--<template v-else-if="good.style_type == 'lease-toy'">-->
                      <!--&lt;!&ndash;租赁商品显示&ndash;&gt;-->
                      <!--<div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span>/{{$i18n.t("天")}}(押金：{{good.lease_goods.goods_deposit}})-->
                      <!--</div>-->
                    <!--</template>-->
                    <!--<template v-else>-->
                      <div class="price">{{$i18n.t("money")}}<span>{{ good.price }}</span></div>
                    <!--</template>-->
                    <div v-if="good.stock == 0">
                      库存不足
                    </div>
                    <div class="num" v-else>
                      <div class="leftnav" @click.stop="numberLeft(index)">
                        -
                      </div>
                      <input type="number"
                             class="shownum"
                             v-model.lazy="good.total"
                             @blur="changeCount(good.total, good.goods_id, index)"/>
                      <div class="rightnav" @click.stop="numberRight(index)">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>

      <!--不带share_id的 购物车列表-->
      <div class="cart-list-box" v-if="!share_id">
        <van-checkbox-group v-model="eachCheckList" @change="allSelectHandle($event)">
          <div class="cart-box" v-for="(good, index) in cartList" :key='index'>
            <div class="cart_good" @click.stop="selectBolfun(0)" v-if="good.goods">
              <van-checkbox checked-color="#f15353" :name="good.goods_id"></van-checkbox>
              <div class="right">
                <div class="img" @click.stop="toGoodsInfo(good)">
                  <img :src="good.goods.thumb"/>
                </div>
                <div class="info">
                  <ul class="inner">
                    <h1 class="name"
                        @click.stop="toGoodsInfo(good)"
                        style="-webkit-box-orient: vertical;">
                      {{ good.goods.title|escapeTitle }}
                    </h1>
                    <li class="introduction" v-if="good.goods_option">
                      <span class="option_str" :style="{backgroundColor: good.goods_option ? '' : '#fff'}">
                            {{ good.goods_option.title }}
                          </span>
                    </li>
                  </ul>
                  <div class="other">
                    <!--<template v-if="good.style_type == 'point-mall'">-->
                    <!--&lt;!&ndash;point_goods积分商城商品显示&ndash;&gt;-->
                    <!--<div class="price"><span>{{ good.point_goods.point }}</span>{{integral}}</div>-->
                    <!--</template>-->
                    <!--<template v-else-if="good.style_type == 'lease-toy'">-->
                    <!--&lt;!&ndash;租赁商品显示&ndash;&gt;-->
                    <!--<div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span>/{{$i18n.t("天")}}(押金：{{good.lease_goods.goods_deposit}})-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--<template v-else>-->
                    <div class="price">{{$i18n.t("money")}}<span>{{ good.goods.price }}</span></div>
                    <!--</template>-->
                    <div class="num">
                      <div class="leftnav" @click.stop="numberLeft(index)">
                        -
                      </div>
                      <input type="number"
                             class="shownum"
                             v-model.lazy="good.total"
                             @blur="changeCount(good.total, good.goods_id, index)"/>
                      <div class="rightnav" @click.stop="numberRight(index)">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>

      <!--底部-->
      <div class="fixed-cart" :style="{right: fun.getPhoneEnv() == 3?'calc(50% - 200px)':''}" @click="goCart">
        <i class="iconfont icon-gouwuche2"></i>
      </div>
      <div style="height: 60px;"></div>
      <div class="cart-bottom-box set-pc-style">
        <div class="checkall" @click.stop="selectBolfun('1')">
          <van-checkbox checked-color="#f15353"
                        style="font-size: 12px;"
                        v-model="checkAll"
                        :name="$i18n.t('全选')"
                        @click="allSelect(checkAll)">{{$i18n.t("全选")}}
          </van-checkbox>
        </div>
        <div v-if="!share_id" class="paysub" :class="{'disabled': eachCheckList.length==0 && share_coupons.length ==0}" @click.stop="shareGoods">
          点击生成分享
          <!--<span class="total" style="font-size: 12px;">({{ eachCheckList.length }})</span>-->
        </div>
        <div v-if="share_id" class="paysub" @click.stop="addIntoCart">
          加入购物车
        </div>
      </div>

      <!--优惠券-->
      <van-popup v-model="showCouponDetail" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4" closeOnClickModal="true">
        <div class="add-info">
          <p class="tips">注：选择转赠优惠券，将会扣除您对应的优惠券数量</p>
          <div class="coupon-list-info" v-for="(coupon, index) in coupons" :key="index">
            <div class="checkList" style="float: left;" @click.stop="chooseCoupon(index, coupon.valid)">
              <div class="right" v-show="good_clicktag == 0">
                <van-checkbox v-model="coupon.checked" shape="square" :disabled="!coupon.valid" checked-color="#f6a132" :name="coupon" @change="selectCoupon($event, coupon)"> </van-checkbox>
              </div>
              <div class="right" v-if="good_clicktag != 0">
                <van-loading />
              </div>
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
                    <span style="font-size: 13px;">{{ $i18n.t("money") }} </span>{{ coupon.belongs_to_coupon.deduct }}
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
                <div class="coupon-stepper" v-if="coupons_temp[coupon.coupon_id]">
                  <div v-if="coupon.valid" class="coupon-stepper-num">共{{coupon.count}}张</div>
                  <div v-if="coupon.checked && coupons_temp[coupon.coupon_id] && good_clicktag == 0">
                    <van-stepper
                      :class="[coupons_temp[coupon.coupon_id].num >= coupon.count ? 'maxDisabled' : '']"
                      :value="coupons_temp[coupon.coupon_id].num"
                      async-change
                      theme="round"
                      button-size="20"
                      integer
                      min="1"
                      :name="coupon"
                      @change="changeCoupon"
                    />
                  </div>
                  <div v-show="good_clicktag != 0">
                    <van-loading />
                  </div>
                </div>
                <!--<p class="coupon_voucher_period">{{ coupon.time_start }}-{{ coupon.time_end }}</p>-->
              </div>
            </div>
          </div>
        </div>
        <button class="sure" type="button" @click="sureCoupon">
          确认
        </button>
        <button class="close" type="button" @click="cancelCoupon">
          取消
        </button>
      </van-popup>

      <yz-wechat-share-img v-model="showWechatshar" :text="'请点击右上角进行转发br你的好友可看到分享的商品列表'"></yz-wechat-share-img>

    </div>
  </div>
</template>

<script>
import cart_share_controller from "./cart_share_controller";

export default cart_share_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bg-box {
    width: 100%;
  }
  .main-box {
    min-height: 100vh;
    background-color: #eeeeee;
  }
  .member-header {
    background-color: #ffffff;
    position: relative;
    width: 22rem;
    margin: 0 auto;
    border-radius: 10px;
    .header-top {
      margin-top: -3rem;
      display: flex;
      border-bottom: 1px solid #f2f2f2;
      padding: 15px 10px;
      align-items: center;
      .actor {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin: 0 10px 0 0;
      }
      .name {
        font-size: 16px;
        margin-right: 3.5rem;
        text-align: left;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .gift-btn {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 12px;
      color: #f14e4e;
      border: 1px solid #f14e4e;
      border-radius: 3px;
      padding: 2px 5px;
      display: flex;
      align-items: center;
    }
  }
  .one-click-box {
    position: absolute;
    bottom: 8px;
    right: 10px;
    width: 24px;
    padding: 0 7px 3px 7px;
    font-size: 12px;
    background-color: #ffecec;
    border-radius: 3px;
    color: #f14e4e;
  }
  .one-click-box.disabled {
    background-color: #e8e8e8;
    color: #898989;
  }
  .asset-line {
    position: absolute;
    bottom: 8px;
    right: 38px;
    width: 2px;
    height: 65px;
    background-image: radial-gradient(#969799 5%, #fff 80%, #fff 15%);
  }
  .coupon-list-box {
    position: relative;
    display: flex;
    padding: 15px 10px;
    overflow-x: scroll;
    .coupon-item {
      display: flex;
      margin-right: 10px;
      /*box-shadow: 1px 2px 6px 1px rgba(198, 198, 198, 0.5);*/
      /*filter: drop-shadow(2px 2px 2px rgba(0,0,0,.2));*/
    }
    .coupon-item-left, .coupon-item-right{
      min-width: 80px;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 5px 10px;
      line-height: 1.8;
    }
    .coupon-item-left {
      color: #ff8d00;
      border-radius: 5px 0 0 5px;
      background-color: #ffdfbc;
      span {
        word-break: keep-all;
      }
      .money {
        font-size: 13px;
        font-weight: bold;
      }
    }
    .coupon-item-left::after {
      content: '';
      height: 100%;
      border: 1px dashed #fff;
      position: absolute;
      right: 0px;
      top: 0;
      bottom: 0;
      margin: auto;
      z-index: 2;
    }
    .top-circle {
      position: absolute;
      background-color: #ffffff;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: -5px;
      right: -5px;
      z-index: 2;
    }
    .bottom-circle {
      position: absolute;
      background-color: #ffffff;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      bottom: -5px;
      right: -5px;
      z-index: 2;
    }
    /*.coupon-item-left::after {
      content: '';
      position: absolute;
      height: 100%;
      width: 3px;
      top: 0;
      right: 0px;
      background-image: linear-gradient(to bottom, transparent 3px, transparent 3px, transparent),
      radial-gradient(6px circle at 3px 6px, #ffffff 3px, transparent 3px);
      background-size: 3px 9px;
    }
    .coupon-item-right::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 3px;
      top: 0;
      left: -1px;
      background-image: linear-gradient(to bottom, transparent 3px, transparent 3px, transparent),
      radial-gradient(6px circle at 0px 6px, #ffffff 3px, transparent 3px);
      background-size: 3px 9px;
    }*/
    /*.coupon-item-right::before {*/
      /*content: '';*/
      /*height: 100%;*/
      /*border: 1px dashed #fff;*/
      /*position: absolute;*/
      /*left: 0px;*/
      /*top: 0;*/
      /*bottom: 0;*/
      /*margin: auto;*/
    /*}*/
    .coupon-item-right {
      text-align: left;
      justify-content: space-between;
      font-size: 11px;
      border-radius: 0 5px 5px 0;
      color: #ffffff;
      background-image: linear-gradient(0deg,
        #ff7b00 0%,
        #ffa600 100%);
      span {
        word-break: keep-all;
        white-space: nowrap;
      }
      .get-btn-box {
        text-align: right;
      }
      .get-btn {
        padding: 2px 4px;
        border-radius: 8px;
        background-color: #ffffff;
        color: #ff8d00;
        font-size: 11px;
      }
      .disabled {
        color: #b3b3b3;
      }
    }
  }

  .cart-list-box {
    .cart-box {
      background-color: #ffffff;
      margin: 10px;
      border-radius: 10px;
      padding: 0.625rem 0.5rem;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #efefef;
    }

    .cart_good {
      display: flex;
      align-items: center;
    }

    .cart_good .ico {
      height: 100%;
      width: 6.25rem;
      text-align: center;
      font-size: 12px;
      z-index: 2;
      position: fixed;
      top: 0;
      right: 0;
      background: rgba(255, 22, 22, 0.66);
      color: #fff;
      line-height: 37vw;
    }

    .cart_good .img {
      width: 6rem;
      height: 6rem;
      overflow: hidden;
    }

    .cart_good .img img {
      height: 100%;
      width: 100%;
      border-radius: 10px;
      object-fit: contain;
    }

    .cart_good .info {
      width: 50%;
      position: relative;
      margin-left: 0.625rem;
      flex: 2;
    }

    .cart_good .info .inner,
    .cart_good .other {
      width: 100%;
    }

    .cart_good .info .inner {
      flex: 4;
    }

    .cart_good .info .other {
      flex: 1;
      margin-top: 0.5rem;
    }

    .cart_good .info .inner .name {
      font-weight: normal;
      flex: 2;
      height: 2.4rem;
      line-height: 1.2rem;
      width: 12rem;
      color: #333;
      text-align: justify;
      font-size: 14px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .cart_good .right {
      margin-left: 8px;
      width: 90%;
      display: flex;
      justify-content: space-between;
    }

    .cart_good .other .price {
      text-align: left;
      font-size: 12px;
      float: left;
      color: #ff4949;
      width: 60%;
      word-break: break-all;

      span {
        font-size: 18px;
      }
    }

    .introduction {
      flex: 1;
      font-size: 12px;
      color: #a29c9c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      line-height: 1.125rem;
      margin-top: 0.5rem;
    }

    .introduction .option_str {
      background-color: #f9f9f9;
      border-radius: 4px;
      padding: 5px;
      vertical-align: middle;
      color: #666;
    }

    .cart_good .other .num {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 0.1875rem;
      height: 1.25rem;
      width: 5.1rem;
      float: right;
    }

    .cart_good .other .num .leftnav {
      height: 1.25rem;
      width: 1.25rem;
      float: left;
      color: #888;
      text-align: center;
      line-height: 1.25rem;
      font-size: 16px;
      background: #f7f8fa;
      font-weight: bold;
    }

    .cart_good .other .num .shownum {
      height: 1.25rem;
      width: 2.375rem;
      float: left;
      border: 0;
      margin: 0 0.1rem;
      padding: 0;
      text-align: center;
      background-color: #f2f2f2;
      border-radius: 0.125rem;
    }

    .cart_good .other .num .rightnav {
      height: 1.25rem;
      width: 1.25rem;
      float: right;
      color: #888;
      text-align: center;
      line-height: 1.25rem;
      font-size: 16px;
      background: #f2f3f5;
      font-weight: bold;
    }
  }

  .cart-bottom-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    padding: 0 10px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .paysub {
      background-color: #f14e4e;
      color: #ffffff;
      padding: 5px 20px;
      border-radius: 15px;
    }
    .paysub.disabled {
      background-color: #999999;
    }
  }

  .fixed-cart {
    position: fixed;
    right: calc(50% - 53vw);
    transform: translateX(-50%);
    bottom: 18%;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 22px;
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
    .tips {
      margin: 0 10px 10px 10px;
      text-align: left;
      color: #f8471e;
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

    li {
      padding: 0.625rem 0;
      display: flex;
      position: relative;

      i {
        flex: 1;
      }
    }
  }
  .coupon-list-info {
    width: 99.5%;
    .checkList {
      margin: 30px 0 0 10px;
    }
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
      color: #ff8d00;
      border-radius: 0.25rem 0 0 0.25rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #ffdfbc;

      .coupon_voucher_amount.type_large {
        margin: 0;
        font-size: 22px;
      }

      .coupon_voucher_amount {
        position: relative;
        font-size: 36px;
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
      content: '';
      height: 100%;
      border: 1px dashed #fff;
      position: absolute;
      right: 0px;
      top: 0;
      bottom: 0;
      margin: auto;
      z-index: 2;
    }

    .coupon_voucher_right {
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-image: linear-gradient(0deg,
        #ff7b00 0%,
        #ffa600 100%);
      color: #ffffff;
      position: relative;

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
        color: #ffffff;
        font-size: 12px;
        position: absolute;
        bottom: 0;
      }

      .coupon-stepper {
        position: absolute;
        width: 95%;
        bottom: 4px;
        right: 0.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .coupon-stepper-num {
          border-radius: 0.875rem;
          overflow: hidden;
          padding: 0 0.5rem;
          color: #ffffff;
          border: 1px solid #ffffff;
          height: 1rem;
          font-size: 0.75rem;
          line-height: 1.2;
        }

        /deep/.van-stepper--round .van-stepper__minus {
          color: #f6a132;
          border: 1px solid #f6a132;
          opacity: 1;
        }

        /deep/.van-stepper__input {
          color: #ffffff;
        }

        /deep/.van-stepper--round .van-stepper__plus {
          color: #f6a132;
          background-color: #ffffff;
        }

        /*/deep/.maxDisabled .van-stepper__plus {*/
          /*background-color: #c7c7c7;*/
        /*}*/
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
      content: '';
      height: 100%;
      border: 1px dashed #fff;
      position: absolute;
      right: 0px;
      top: 0;
      bottom: 0;
      margin: auto;
      z-index: 2;
    }

    .coupon_voucher_right {
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-color: #eee;
      color: #666;
      position: relative;

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

</style>