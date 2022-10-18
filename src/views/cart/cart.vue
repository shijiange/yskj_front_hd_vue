<template>
  <div class="cart" id="cart"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyleCart':'', fun.isIphoneX() ? 'iphoneXStyle' : ''] ">

    <!-- 头部编辑 - 是否有海外商品todo -->
    <c-title :hide="false" :text="$i18n.t('cart.购物车')">
      <template slot="edit" v-if="isShowList || hasOverseasCard">
        <div class="to-edit" @click="onCartDelete">
          {{ !cartDelete ? $i18n.t("cart.编辑") : $i18n.t("cart.完成") }}
        </div>
        <div class="to-more" v-if="sharin_is_open == 1" @click="toShowMore">
          <i class="iconfont icon-zb_all_more"></i>
          <template v-if="showMore">
            <div class="triangle-up"></div>
            <ul class="more-list-box">
              <li @click="shareCartGood">分享好物</li>
            </ul>
          </template>
        </div>
      </template>
    </c-title>

    <div>
      <!--购物车商品列表-->
      <div class="cart_main noTop" v-if="isShowList">
        <div class="shop-box" v-for="(cartListTemp, s_index) in _.groupBy(cartList,'shop_id')" :key="s_index">
          <div class="shop-head">
<!--            <van-checkbox checked-color="#f15353" :disabled="item.disable" @click="checkShopAll(cartListTemp[0].checked, c_index, cartListTemp[0])"-->
<!--                          v-model="cartListTemp[0].checked"></van-checkbox>-->
            <div class="shop-left" @click.stop="toShop(cartListTemp[0])">
              <i class="iconfont icon-fontclass-dianpu"></i>
              <span class="shop-title">{{cartListTemp[0].name}}</span>
            </div>
            <!--<div class="coupon-tag" @click.stop="showCouponList = true"><span>优惠券</span></div>-->
          </div>
          <div class="coupon-list" v-for="discount in cartListTemp[0].discount_activity" :key="discount.code">
            <div class="coupon-left">
              <span class="tag">{{discount.name}}</span> <span class="tag-title">{{discount.desc}}</span>
            </div>
            <span class="coupon-right" @click.stop="toSearch(discount, '')">去凑单<i class="iconfont icon-advertise-next"></i></span>
          </div>

          <div v-for="(item, c_index) in cartListTemp" :key="c_index">
            <div style="margin:10px 30px; border-top: 1px dashed #ddd;"></div>
            <div class="coupon-list" v-if="!_.isEmpty(item.marketing) && item.price > 0">
              <div class="coupon-left">
                <span class="tag">{{ item.marketing.simple_tag }}</span> <span class="tag-title">{{ item.marketing.cart_detail.desc }}</span>
              </div>
              <span class="coupon-right" v-for="(btn,index) in _.castArray(item.marketing.cart_detail.button)" :key="index" @click.stop="toSearch(item,btn)">{{ btn }}<i class="iconfont icon-advertise-next" v-if="index == _.castArray(item.marketing.cart_detail.button).length-1"></i></span>
            </div>

  <!--          <van-checkbox-group>-->
            <div class="cart-box" v-for="(good, index) in item.carts" v-if="good.checked" :key='index'>
              <div class="cart_good">
                <van-checkbox checked-color="#f15353" :disabled="item.disable" v-model="good.checked" :name="good.cart_id" @change="debouncedCheckCart()"></van-checkbox>
                <div class="right">
                  <div class="img" @click.stop="toGoodsInfo(good)">
                    <img :src="good.goods_thumb"/>
                  </div>
                  <div class="info">
                    <ul class="inner">
                      <h1 class="name"
                          @click.stop="toGoodsInfo(good)"
                          style="-webkit-box-orient: vertical;">
                        {{ good.goods_title|escapeTitle }}
                      </h1>
                      <template v-if="good.tags">
                        <labels :labels="good.tags"></labels>
                      </template>
                      <li class="introduction">
                        <!--@click.stop="openSpecs(good)" 不做修改规格项-->
                        <span class="option_str" :style="{backgroundColor: good.goods_option_title ? '' : '#fff'}">
                              {{ good.goods_option_title }}
                          <!--<i v-if="good.goods_option_title" class="iconfont icon-member-bottom"></i>-->
                            </span>
                      </li>
                    </ul>
                    <div class="other">
                      <template v-if="good.style_type == 'point-mall'">
                        <!--point_goods积分商城商品显示-->
                        <div class="dPriceBox">
                          <div class="price"><span>{{ good.point_goods.point }}</span>{{integral}}</div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <template v-else-if="good.style_type == 'lease-toy'">
                        <!--租赁商品显示-->
                        <div class="dPriceBox">
                          <div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span>/{{$i18n.t("天")}}(押金：{{good.lease_goods.goods_deposit}})</div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="dPriceBox">
                          <div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span></div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <div class="num">
                        <div class="leftnav" @click.stop="numberLeft(good)">
                          -
                        </div>
                        <input type="number"
                               class="shownum"
                               v-model.lazy="good.total"
                               @blur="changeCount(good)"/>
                        <div class="rightnav" @click.stop="numberRight(good)">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="estimated"
                   v-if="Number(good.estimated_price) > 0 && good.estimated_price != good.price">
                预估到手价：{{$i18n.t("money")}}<span>{{good.estimated_price }}</span>
              </div>
              <div class="activity" v-if="good.discount_activity && good.discount_activity.length > 0">
                <span class="activity-title">单品活动</span>
                <div class="activity-box"><span class="activity-item" v-for="(activity,i) in good.discount_activity"
                                                :key="i">{{activity.desc}}</span></div>
              </div>
            </div>
            <gift from="cart" v-for="(goods, index) in item.gift_carts" :goods="goods" :key="index+'_gift'" :goods_id="goods.goods_id" :goods_title="goods.goods_title" :goods_thumb="goods.goods_thumb" :price="goods.price" :total="goods.total" :labels="[goods.gift_price > 0 ? '换购':'赠品']"></gift>
            <div class="cart-box" v-for="(good, index) in item.carts" v-if="!good.checked" :key='index'>
              <div class="cart_good">
                <van-checkbox checked-color="#f15353" :disabled="item.disable" v-model="good.checked" :name="good.cart_id" @change="debouncedCheckCart()"></van-checkbox>
                <div class="right">
                  <div class="img" @click.stop="toGoodsInfo(good)">
                    <img :src="good.goods_thumb"/>
                  </div>
                  <div class="info">
                    <ul class="inner">
                      <h1 class="name"
                          @click.stop="toGoodsInfo(good)"
                          style="-webkit-box-orient: vertical;">
                        {{ good.goods_title|escapeTitle }}
                      </h1>
                      <template v-if="good.tags">
                        <labels :labels="good.tags"></labels>
                      </template>
                      <li class="introduction">
                        <!--@click.stop="openSpecs(good)" 不做修改规格项-->
                        <span class="option_str" :style="{backgroundColor: good.goods_option_title ? '' : '#fff'}">
                              {{ good.goods_option_title }}
                          <!--<i v-if="good.goods_option_title" class="iconfont icon-member-bottom"></i>-->
                            </span>
                      </li>
                    </ul>
                    <div class="other">
                      <template v-if="good.style_type == 'point-mall'">
                        <!--point_goods积分商城商品显示-->
                        <div class="dPriceBox">
                          <div class="price"><span>{{ good.point_goods.point }}</span>{{integral}}</div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <template v-else-if="good.style_type == 'lease-toy'">
                        <!--租赁商品显示-->
                        <div class="dPriceBox">
                          <div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span>/{{$i18n.t("天")}}(押金：{{good.lease_goods.goods_deposit}})</div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="dPriceBox">
                          <div class="price">{{$i18n.t("money")}}<span>{{ good.goods_price }}</span></div>
                          <div class="dPriceBox_vipPrice" v-if="vip_show">会员价：{{$i18n.t("money")}}<span>{{ good.vip_price }}</span></div>
                        </div>
                      </template>
                      <div class="num">
                        <div class="leftnav" @click.stop="numberLeft(good)">
                          -
                        </div>
                        <input type="number"
                               class="shownum"
                               v-model.lazy="good.total"
                               @blur="changeCount(good)"/>
                        <div class="rightnav" @click.stop="numberRight(good)">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="estimated"
                   v-if="Number(good.estimated_price) > 0 && good.estimated_price != good.price">
                预估到手价：{{$i18n.t("money")}}<span>{{good.estimated_price }}</span>
              </div>
              <div class="activity" v-if="good.discount_activity && good.discount_activity.length > 0">
                <span class="activity-title">单品活动</span>
                <div class="activity-box"><span class="activity-item" v-for="(activity,i) in good.discount_activity"
                                                :key="i">{{activity.desc}}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--购物车商品列表end-->

      <!--失效商品列表-->
      <div class="disabled-list" v-if="failureCartList && failureCartList.length > 0">
        <div class="disabled-head">
          <span class="disabled-title">失效商品{{failureCartList.length}}件</span>
          <span style="text-align: right; color: #f14e4e;" @click.stop="clearFailureCart">清空失效商品</span>
        </div>
        <div class="disabled-item" v-for="good in failureCartList" :key="good.goods_id">
          <span class="gray">失效</span>
          <div class="img" @click.stop="toGoodsInfo(good)">
            <img :src="good.goods_thumb"/>
          </div>
          <div class="detail">
            <div class="title">{{ good.goods_title|escapeTitle }}</div>
            <div class="price">该商品已不能购买</div>
          </div>
        </div>
      </div>
      <!--失效商品列表end-->

      <!--购物车为空-->
      <div id="nocard" v-if="!isShowList && !hasOverseasCard">
        <div class="card_no">
          <img src="../../assets/images/cart.png"
               style="width: 6.25rem; height: 6.25rem;"
               alt="购物车">
          <br/><span style="line-height: 1.125rem; font-size: 16px;">{{$i18n.t("cart.购物车快饿瘪了")}}</span>
          <br/>{{$i18n.t("cart.主人快去给我找点东西吧")}}
        </div>
        <div class="card_no_menu">
          <router-link :to="fun.getUrl('member')">
            <div class="card_no_nav">{{$i18n.t("cart.个人中心")}}</div>
          </router-link>
          <router-link :to="fun.getUrl('home')">
            <div class="card_no_nav togo">{{$i18n.t("cart.去逛逛")}}</div>
          </router-link>
        </div>
      </div>
      <!--购物车为空end-->
    </div>

    <!-- 海外商品 -->
    <cart-overseas ref="overseasRef" :cartDelete="cartDelete" :hasCard="isShowList" @postMsg="postMsg"/>

    <!--结算部分-->
    <!-- $store.state.temp.item && $store.state.temp.item.is_decorate === 1 todo 不理解 -->
    <div class="cart_pay"
         :style="{bottom: hasOverseasCard? '100px': '50px'}"
         v-show="!cartDelete && isShowList">
      <div class="all">
        <div class="checkall">
          <van-checkbox checked-color="#f15353"
                        style="font-size: 12px;"
                        v-model="checkAll"
                        :name="$i18n.t('cart.全选国内商品')"
                        @click.stop="allSelect(checkAll)">{{$i18n.t("cart.全选国内商品")}}
          </van-checkbox>
          <span class="checkall_blank"></span>
        </div>
      </div>
      <div class="text">
        <div class="freight">
          <!-- #86152 隐藏不含运费 -->
          <span style="color: #999; font-size: 10px;" v-if="false">({{$i18n.t("cart.不含运费")}})</span>
          {{$i18n.t("cart.合计")}}：<span style="font-size: 14px; color: #f15353;">{{$i18n.t("money")}}</span><span
          class="totalprice">{{ total_amount }}</span>
        </div>
        <div class="coupon" v-if="Number(total_discount_amount) > 0" @click.stop="showCouponDetail = true">
          优惠明细：{{$i18n.t("money")}}{{total_discount_amount}}
        </div>
      </div>
      <div class="paysub" @click.stop="checkGoods">
        {{$i18n.t("cart.结算")}}
        <small class="total" style="font-size: 12px;">({{ cart_ids.length }})</small>
      </div>
    </div>
    <!--结算部分end-->

    <!--删除编辑-->
    <div class="cart_del" v-show="cartDelete && isShowList" :style="{bottom: hasOverseasCard? '100px': '50px'}">
      <div class="checkall">
        <van-checkbox checked-color="#f15353"
                      style="font-size: 12px;"
                      v-model="checkAll"
                      :name="$i18n.t('cart.全选国内商品')"
                      @click="allSelect(checkAll)">{{$i18n.t("cart.全选国内商品")}}
        </van-checkbox>
      </div>
      <span @click.stop="deleteGoods">{{$i18n.t("cart.删除")}}</span>
    </div>
    <!--删除编辑end-->

    <div style="height: 6.5rem;"></div>

    <!--商品规格-->
    <template v-if="popupSpecs">
      <yz-specs :goodsInfo="goodData" :popupSpecs="popupSpecs" :goods_option_id="goods_option_id" v-on:closeSpecsPopup="close_yz_specs_popup">
      </yz-specs>
    </template>
    <!--商品规格end-->

    <!--配送方式冲突-->
    <van-popup v-model="showChoose" round style="width: 20rem;">
      <div class="wrapper">
        <div class="block" @click.stop>
          <div class="choose-title">
            您的购物车配送方式有冲突，请选择其中一种配送方式~
          </div>

          <div class="choose-content">
            <van-radio-group v-model="radioChoose">
              <div v-for="(item, index) in dispatch_types" :key="index" style="padding: 0.5rem 0;">
                <van-radio :name="index.toString()" checked-color="#ff4949">
                  <div class="radio-title">{{item.name}}({{item.member_carts.length}}件)</div>
                </van-radio>
                <ul class="radio-list">
                  <li class="radio-item" v-for="(goods, i) in item.member_carts" :key="i">
                    <p>{{goods.title}}</p>
                    <p v-if="goods.option_title" style="font-size: 12px; color: #666;">规格：{{goods.option_title}}</p>
                  </li>
                </ul>
              </div>

            </van-radio-group>
          </div>

          <div class="buttons">
            <div class="button-item">
              <div class="button-content" @click="showChoose = false">返回购物车</div>
            </div>
            <div class="button-item">
              <div class="button-content red" @click="toBuy">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!--配送方式冲突end-->

    <!--优惠明细-->
    <van-popup v-model="showCouponDetail" round position="bottom" closeable>
      <div class="coupon-detail">
        <p class="coupon-detail-title">优惠明细</p>
        <ul class="coupon-detail-box">
          <li>
            <p class="left">商品总价</p>
            <p class="right">{{$i18n.t("money")}}{{total_goods_price}}</p>
          </li>
          <li v-for="item in discount_amount_items" :key="item.code">
            <p class="left">{{item.name}}</p>
            <p class="right">-{{$i18n.t("money")}}{{item.amount}}</p>
          </li>
          <li>
            <p class="left">共优惠</p>
            <p class="right">-{{$i18n.t("money")}}{{total_discount_amount}}</p>
          </li>
        </ul>
        <div class="total-box">
          <p class="left"><span style="font-weight: bold;">合计</span> <span
            style="color: #999; font-size: 10px;">（不含运费）</span></p>
          <p class="right">{{$i18n.t("money")}}{{total_amount}}</p>
        </div>
        <p class="tips">优惠抵扣金额请在下单页查看</p>
      </div>
    </van-popup>
    <!--优惠明细end-->

    <!--优惠卷先不做-->
    <!--<van-popup v-model="showCouponList" round position="bottom" closeable>-->
    <!--<div class="coupon-pop">-->
    <!--<p class="coupon-pop-title">优惠券</p>-->
    <!--<ul class="coupon-pop-box">-->
    <!--<li v-for="item in 2">-->
    <!--<div class="left">-->
    <!--<p style="border-bottom: 1px dashed #ffffff">{{$i18n.t('money')}}11.00</p>-->
    <!--<p>满100立减</p>-->
    <!--</div>-->
    <!--<div class="right">-->
    <!--<p><span class="good-tag">平台商品</span><span style="font-weight: bold">测试999</span></p>-->
    <!--<p class="good-text">已领人数5人</p>-->
    <!--<p class="good-text">可领张数：11张</p>-->
    <!--<p class="good-button"><span>立即领取</span></p>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--</van-popup>-->
    <van-popup v-model="showSelectGift" closeable position="bottom" @closed="closeSelectGift">
      <van-nav-bar :title="select_goods_title">
      </van-nav-bar>
      <van-cell-group inset>
<!--        v-for="goods in gift_goods_list[current_shop_id]" :goods="goods"-->
        <select-gift v-if="renderSelectGift" :goods-list="gift_goods_list[current_shop_id]" @change="giftSelectChange" :goods-num="gift_goods_num"></select-gift>
      </van-cell-group>
      <van-cell-group>
        <van-row>
          <van-notice-bar
            :scrollable="false"
            :text="'您已满足活动条件，以上赠品任选'+gift_goods_num+'个'"
          />
        </van-row>
        <van-row>
          <van-col span="22" class="paysub" offset="1" @click.stop="giftSelectOk(current_shop_id)" style="margin-bottom: 0.5rem;float:none">选好了</van-col>
        </van-row>
      </van-cell-group>
    </van-popup>

  </div>
</template>

<script>
import cart from "./cart_controller";

export default cart;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  /* @import "../../assets/css/cart.scss"; */
  .to-more {
    position: relative;
    margin: 6px 0 0 15px;
    .icon-zb_all_more {
      font-size: 24px;
    }
    .triangle-up {
      position: absolute;
      top: 25px;
      left: 3px;
      width:0;
      height:0;
      border-right:10px solid transparent;
      border-left:10px solid transparent;
      border-bottom:10px solid #ffffff;
      filter: drop-shadow(2px 2px 2px rgba(0,0,0,.2));
    }
    .more-list-box {
      position: absolute;
      top: 35px;
      left: -46px;
      width: 76px;
      background-color: #ffffff;
      filter: drop-shadow(2px 2px 2px rgba(0,0,0,.2));
      padding: 5px 8px;
      border-radius: 5px;
    }
  }

  /* 配送方式样式 */
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .block {
      position: relative;
      width: 19rem;
      height: 22rem;
      border-radius: 15px;
      background-color: #fff;
      padding: 0.5rem;
      text-align: left;
    }

    .choose-title {
      color: #878787;
      padding: 0.5rem;
      border-bottom: solid 1px #f5f5f5;
    }

    .choose-content {
      height: 15rem;
      overflow-y: scroll;
    }

    .radio-title {
      font-size: 16px;
      font-weight: bold;
    }

    .radio-list {
      padding: 0.5rem;
    }

    .radio-item {
      padding: 0.5rem 0;
      border-bottom: solid 1px #f5f5f5;
    }

    .buttons {
      display: flex;
      position: absolute;
      bottom: 0.5rem;
      width: 100%;
    }

    .button-item {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .button-content {
      margin: 0 auto;
      width: 6.5rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      border-radius: 0.5rem;
      border: solid 1px #b5b5b5;
    }

    .button-content.red {
      color: #fff;
      background-color: #f15353;
      border: none;
    }
  }

  .gray {
    font-size: 12px;
    padding: 0 0.2rem;
    flex: 0 0 2.1rem;
    margin-right: 0.3rem;
    color: #fff;
    background: #dfdfdf;
    border-radius: 15px;
  }

  .cart_main,
  .rent-box {
    height: auto;
    // margin-top: 55px;
  }

  .cart-box {
    padding: 0.625rem 0.875rem;
    display: flex;
    flex-direction: column;
    //border-bottom: 1px solid #efefef;
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

  .checkList {
    position: absolute;
    flex: 1;
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
    //position: absolute;
    //bottom: 0;
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
    width: 90%;
    display: flex;
    justify-content: space-between;
  }

  .cart_good .other .dPriceBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .cart_good .other .dPriceBox .dPriceBox_vipPrice{
    color: #FD7B0C;
    font-size: 12px;
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

  .cart_pay {
    //float: left;
    //height: 3.0625rem;
    width: 100%;
    background: #fff;
    border-top: 0.0625rem solid #e1e1e1;
    position: fixed;
    bottom: 3.0625rem;
    left: 0;
    z-index: 99;
    display: flex;
    justify-content: space-between;
  }

  .cart_pay .all {
    height: 3.0625rem;
    width: 4.375rem;
    float: left;
    line-height: 3.0625rem;
    font-size: 14px;
    color: #999;
  }

  .cart_pay .all i {
    font-size: 1.5rem;
    margin-top: 0.125rem;
    float: left;
  }

  .cart_pay .all .checkall_blank {
    float: left;
    margin-left: 0.3125rem;
    line-height: 3.375rem;
  }

  .cart_pay .category {
    font-size: 14px;
    color: #000;
    line-height: 3.0625rem;
  }

  .checkall {
    position: absolute;
    left: 0.875rem;
    top: 0.9rem;
  }

  .paysub {
    box-sizing: border-box;
    height: 2.0625rem;
    min-width: 5rem;
    margin-top: 0.5rem;
    border-radius: 2rem;
    padding: 0 0.625rem;
    background: #ff4949;
    float: right;
    font-size: 14px;
    line-height: 2.0625rem;
    color: #fff;
  }

  .cart_pay .disabled {
    background: #ccc;
  }

  .cart_pay .text {
    min-height: 3.0625rem;
    //float: left;
    color: #333;
    font-size: 12px;
    display: flex;
    padding: 0 0.5rem;
    //line-height: 3.0625rem;
    flex: 2;
    flex-direction: column;
    text-align: right;
    word-break: break-all;
    justify-content: center;
  }

  .cart_pay .text .freight {
    margin-right: 0.375rem;
  }

  .cart_pay .text .coupon {
    color: #f15353;
  }

  .cart_pay .text .totalprice {
    color: #f15353;
    font-size: 16px;
  }

  .pcStyleCart .cart_pay {
    width: 375px;
    left: 50%;
    margin-left: -187.5px;
  }

  .pcStyleCart .cart_del {
    width: 375px;
  }

  /* 增加底部适配层 */
  .iphoneXStyle .cart_main,
  .iphoneXStyle .cart_pay,
  .iphoneXStyle .cart_del {
    padding-bottom: 34px;
  }

  .cart_del {
    z-index: 999;
    background: #fff;
    border-top: 0.0625rem solid #e1e1e1;
    position: fixed;
    bottom: 50px;
    width: 100%;
    // height: 3.0625rem;
    line-height: 3.0625rem;
  }

  .cart_del span {
    box-sizing: border-box;
    height: 2.0625rem;
    width: 5rem;
    margin: 0.5rem 0;
    border-radius: 2rem;
    padding: 0 0.625rem;
    background: #ff4949;
    float: right;
    font-size: 14px;
    line-height: 2.0625rem;
    color: #fff;
  }

  .cart_top .disabled {
    color: #ccc;
  }

  .card_no {
    height: 6.25rem;
    margin: 6.25rem 0 6.25rem;
    color: #ccc;
    font-size: 12px;
    text-align: center;
  }

  .card_no_menu {
    height: 2.5rem;
    width: 100%;
  }

  .card_no_nav {
    height: 2.375rem;
    width: 43%;
    background: #eee;
    margin: 0 3%;
    float: left;
    border: 0.0625rem solid #f15353;
    border-radius: 0.3125rem;
    text-align: center;
    line-height: 2.375rem;
    color: #f15353;
  }

  .togo {
    color: #fff;
    background: #f15353;
  }

  .cart_good:last-child {
    border: none;
  }

  .box {
    margin-top: 0.25rem;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;

    .left {
      width: 49%;
    }

    .left:nth-child(odd) {
      margin-right: 2%;
    }
  }

  .shop-box,
  .disabled-list {
    margin: 8px;
    background: #fff;
    border-radius: 15px;
  }

  .shop-head {
    display: flex;
    padding: 0 0 0 0.875rem;
    margin-bottom: 0.5rem;
  }

  .shop-head .shop-left {
    flex: 1;
    text-align: left;
    display: flex;
  }

  .shop-head .shop-title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 13.5rem;
  }

  .shop-head .icon-fontclass-dianpu {
    color: #f15353;
    font-size: 28px;
  }

  .shop-head .coupon-tag {
    color: #f08c34;
    flex: 0 0 4rem;
    text-align: right;
    margin-top: 0.4rem;

    span {
      padding: 0.5rem 0.3rem;
      background-color: #fff2e5;
      border-radius: 0 15px 0 15px;
    }
  }

  .coupon-list {
    display: flex;
    align-self: center;
    margin-top: 0.5rem;
  }

  .coupon-list .coupon-left {
    flex: 1;
    text-align: left;
    padding: 0 0 0 2.5rem;
    font-size: 12px;
    display: flex;
    align-items: flex-start;
  }

  .coupon-list .tag {
    border-radius: 4px;
    border: solid 1px #f14e4e;
    color: #f14e4e;
    padding: 1px 3px;
    margin-right: 5px;
    white-space: nowrap;
  }

  .coupon-list .tag-title {
    padding: 1px;
    text-align: left;
  }

  .coupon-list .coupon-right {
    padding: 1px;
    color: #f14e4e;
    flex: 0 0 4rem;
    font-size: 12px;
    line-height: 12px;
    white-space: nowrap;
    .iconfont{
      font-size: 12px;
    }
  }

  .disabled-head {
    display: flex;
    padding: 0.3rem 0.875rem;
  }

  .disabled-head span {
    flex: 1;
  }

  .disabled-head .disabled-title {
    text-align: left;
  }

  .disabled-item {
    display: flex;
    align-items: center;
    padding: 0.625rem 0.875rem;

    .img {
      width: 6rem;
      height: 6rem;
      overflow: hidden;
    }

    .img img {
      height: 100%;
      width: 100%;
      border-radius: 10px;
    }

    .detail {
      text-align: left;
      margin-left: 0.625rem;
      width: 60%;
      height: 6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .title {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .price {
      font-size: 14px;
      color: #999;
      word-break: break-all;
    }
  }

  .estimated {
    align-self: self-start;
    padding: 2px 8px;
    margin-top: 5px;
    border-radius: 10px;
    margin-left: 7.5rem;
    text-align: left;
    font-size: 12px;
    color: #f14e4e;
    background-color: #fdf2f2;
  }

  .activity {
    color: #f14e4e;
    padding: 0.5rem 0.2rem 0 0.875rem;
    display: flex;
    text-align: left;
  }

  .activity .activity-box {
    font-size: 12px;
    display: flex;
    flex-wrap: wrap;
  }

  .activity .activity-title {
    flex: 0 0 4rem;
    margin-right: 5px;
    font-weight: bold;
  }

  .activity .activity-box .activity-item {
    background-color: #fdf2f2;
    padding: 2px 4px;
    border-radius: 4px;
    margin: 0 5px 5px 0;
  }

  .coupon-detail-title,
  .coupon-pop-title {
    color: #333;
    padding: 5px 15px 15px 15px;
    font-size: 18px;
    font-weight: bold;
  }

  .coupon-detail,
  .coupon-pop {
    padding: 0.5rem 1rem;
  }

  .coupon-detail-box li {
    display: flex;
    padding: 0.5rem 0;
  }

  .coupon-detail-box li .left {
    flex: 1;
    text-align: left;
    color: #666;
  }

  .coupon-detail-box li:last-child .left {
    font-weight: bold;
  }

  .coupon-detail-box li .right {
    flex: 1;
    text-align: right;
    font-weight: bold;
    font-size: 16px;
  }

  .total-box {
    display: flex;
  }

  .total-box .left {
    flex: 1;
    text-align: left;
  }

  .total-box .right {
    flex: 1;
    text-align: right;
    color: #f14e4e;
    font-weight: bold;
    font-size: 16px;
  }

  .tips {
    color: #f14e4e;
    text-align: left;
    margin-bottom: 3rem;
  }

  /* .coupon-pop-box { */

  /* margin-bottom: 2rem; */

  /* } */

  /* .coupon-pop-box li { */

  /* display: flex; */

  /* box-shadow: 0px 1px 4px 0px rgba(173, 173, 173, 0.31); */

  /* margin-bottom: 0.7rem; */

  /* background: #fbbd5c; */

  /* } */

  /* .coupon-pop-box li .left { */

  /* flex: 0 0 7rem; */

  /* display: flex; */

  /* flex-direction: column; */

  /* align-self: center; */

  /* justify-content: center; */

  /* padding: 0.2rem 0.5rem; */

  /* color: #ffffff; */

  /* } */

  /* .coupon-pop-box li .left p { */

  /* padding: 0.3rem 0; */

  /* } */

  /* .coupon-pop-box li .right { */

  /* flex: 1; */

  /* display: flex; */

  /* flex-direction: column; */

  /* align-self: center; */

  /* background: #ffffff; */

  /* font-size: 12px; */

  /* text-align: left; */

  /* padding: 10px; */

  /* } */

  /* .coupon-pop-box li .right p { */

  /* margin-bottom: 5px; */

  /* } */

  /* .coupon-pop-box li .right .good-tag { */

  /* background: #fbbd5c; */

  /* color: #ffffff; */

  /* padding: 2px 4px; */

  /* border-radius: 4px; */

  /* margin-right: 5px; */

  /* } */

  /* .coupon-pop-box li .right .good-text { */

  /* color: #9da1a5; */

  /* } */

  /* .coupon-pop-box li .right .good-button { */

  /* width: 4.5rem; */

  /* text-align: center; */

  /* background: #fbbd5c; */

  /* color: #ffffff; */

  /* padding: 2px 4px; */

  /* border-radius: 4px; */

  /* margin-left: 8rem; */

  /* } */

</style>
