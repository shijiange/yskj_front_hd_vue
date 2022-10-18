<template>
  <div class="cart_main noTop" v-if="isShowList" :style="{ 'margin-bottom': '100px' }">
    <!--购物车商品列表-->
    <div class="shop-box" v-for="(cartListTemp, s_index) in _.groupBy(cartList,'shop_id')" :key="s_index">
      <div class="shop-head">
<!--        <van-checkbox checked-color="#f15353" :disabled="cartListTemp[0].disable" @click="checkShopAll(cartListTemp[0].checked, c_index, cartListTemp[0])" v-model="cartListTemp[0].checked"></van-checkbox>-->
        <div class="shop-left" @click.stop="toShop(cartListTemp[0])">
          <i class="iconfont icon-fontclass-dianpu"></i>
          <span class="shop-title">海外购</span>
        </div>
      </div>
      <div class="coupon-list" v-for="discount in cartListTemp[0].discount_activity" :key="discount.code" >
        <div class="coupon-left">
          <span class="tag">{{ discount.name }}</span> <span class="tag-title">{{ discount.desc }}</span>
        </div>
        <span class="coupon-right" @click.stop="toSearch(discount, '')">去凑单<i class="iconfont icon-advertise-next"></i></span>
      </div>

      <div v-for="(item, c_index) in cartListTemp">
        <div style="margin:10px 30px; border-top: 1px dashed #ddd;"></div>
        <div class="coupon-list" v-if="!_.isEmpty(item.marketing) && item.price > 0">
          <div class="coupon-left">
            <span class="tag">{{ item.marketing.simple_tag }}</span> <span class="tag-title">{{ item.marketing.cart_detail.desc }}</span>
          </div>
          <span class="coupon-right" v-for="(btn,index) in _.castArray(item.marketing.cart_detail.button)" :key="index" @click.stop="toSearch(item,btn)">{{ btn }}<i class="iconfont icon-advertise-next" v-if="index == _.castArray(item.marketing.cart_detail.button).length-1"></i></span>
        </div>

        <div class="cart-box" v-for="(good, index) in item.carts" v-if="good.is_gift <= 0 && good.checked" :key="index">
          <div class="cart_good">
            <van-checkbox checked-color="#f15353" :disabled="item.disable" v-model="good.checked" :name="good.cart_id" @change="debouncedCheckCart()"></van-checkbox>
            <div class="right">
              <div class="img" @click.stop="toGoodsInfo(good)">
                <img :src="good.goods_thumb" />
              </div>
              <div class="info">
                <ul class="inner">
                  <h1 class="name" @click.stop="toGoodsInfo(good)" style="-webkit-box-orient: vertical">
                    {{ good.goods_title | escapeTitle }}
                  </h1>
                  <template v-if="good.tags">
                    <labels :labels="good.tags"></labels>
                  </template>
                  <overseastag visible="true" class="details"/>
                  <li class="introduction" v-if="good.goods_option_title">
                    <span
                      class="option_str"
                      :style="{
                        backgroundColor: good.goods_option_title ? '' : '#fff',
                      }"
                    >
                      {{ good.goods_option_title }}
                    </span>
                  </li>
                </ul>
                <div class="other">
                  <template v-if="good.style_type == 'point-mall'">
                    <!--point_goods积分商城商品显示-->
                    <div class="dPriceBox">
                      <div class="price">
                        <span>{{ good.point_goods.point }}</span
                        >{{ integral }}
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="good.style_type == 'lease-toy'">
                    <!--租赁商品显示-->
                    <div class="dPriceBox">
                      <div class="price">
                        {{ $i18n.t('money') }}<span>{{ good.goods_price }}</span
                        >/{{ $i18n.t('天') }}(押金：{{ good.lease_goods.goods_deposit }})
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="dPriceBox">
                      <div class="price">
                        {{ $i18n.t('money') }}<span>{{ good.goods_price }}</span>
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <div class="num">
                    <div class="leftnav" @click.stop="numberLeft(good)">-</div>
                    <input type="number" class="shownum" v-model.lazy="good.total" @blur="changeCount(good)" />
                    <div class="rightnav" @click.stop="numberRight(good)">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="estimated" v-if="Number(good.estimated_price) > 0 && good.estimated_price != good.price">
            预估到手价：{{ $i18n.t('money') }}<span>{{ good.estimated_price }}</span>
          </div>
          <div class="activity" v-if="good.discount_activity && good.discount_activity.length > 0">
            <span class="activity-title">单品活动</span>
            <div class="activity-box">
              <span class="activity-item" v-for="(activity, i) in good.discount_activity" :key="i">{{ activity.desc }}</span>
            </div>
          </div>
        </div>
        <gift from="cart" v-for="(goods, index) in item.gift_carts" :goods="goods" :key="index+'_gift'"  :goods_id="goods.goods_id" :goods_title="goods.goods_title" :goods_thumb="goods.goods_thumb" :price="goods.price" :total="goods.total" :labels="[goods.gift_price > 0 ? '换购':'赠品']"></gift>
        <div class="cart-box" v-for="(good, index) in item.carts" v-if="good.is_gift <= 0 && !good.checked" :key="index">
          <div class="cart_good">
            <van-checkbox checked-color="#f15353" :disabled="item.disable" v-model="good.checked" :name="good.cart_id" @change="debouncedCheckCart()"></van-checkbox>
            <div class="right">
              <div class="img" @click.stop="toGoodsInfo(good)">
                <img :src="good.goods_thumb" />
              </div>
              <div class="info">
                <ul class="inner">
                  <h1 class="name" @click.stop="toGoodsInfo(good)" style="-webkit-box-orient: vertical">
                    {{ good.goods_title | escapeTitle }}
                  </h1>
                  <template v-if="good.tags">
                    <labels :labels="good.tags"></labels>
                  </template>
                  <overseastag visible="true" class="details"/>
                  <li class="introduction" v-if="good.goods_option_title">
                      <span
                        class="option_str"
                        :style="{
                          backgroundColor: good.goods_option_title ? '' : '#fff',
                        }"
                      >
                        {{ good.goods_option_title }}
                      </span>
                  </li>
                </ul>
                <div class="other">
                  <template v-if="good.style_type == 'point-mall'">
                    <!--point_goods积分商城商品显示-->
                    <div class="dPriceBox">
                      <div class="price">
                          <span>{{ good.point_goods.point }}</span
                          >{{ integral }}
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="good.style_type == 'lease-toy'">
                    <!--租赁商品显示-->
                    <div class="dPriceBox">
                      <div class="price">
                        {{ $i18n.t('money') }}<span>{{ good.goods_price }}</span
                      >/{{ $i18n.t('天') }}(押金：{{ good.lease_goods.goods_deposit }})
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="dPriceBox">
                      <div class="price">
                        {{ $i18n.t('money') }}<span>{{ good.goods_price }}</span>
                      </div>
                      <div class="dPriceBox_vipPrice" v-if="vip_show">
                        会员价：{{ $i18n.t('money') }}<span>{{ good.vip_price }}</span>
                      </div>
                    </div>
                  </template>
                  <div class="num">
                    <div class="leftnav" @click.stop="numberLeft(good)">-</div>
                    <input type="number" class="shownum" v-model.lazy="good.total" @blur="changeCount(good)" />
                    <div class="rightnav" @click.stop="numberRight(good)">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="estimated" v-if="Number(good.estimated_price) > 0 && good.estimated_price != good.price">
            预估到手价：{{ $i18n.t('money') }}<span>{{ good.estimated_price }}</span>
          </div>
          <div class="activity" v-if="good.discount_activity && good.discount_activity.length > 0">
            <span class="activity-title">单品活动</span>
            <div class="activity-box">
              <span class="activity-item" v-for="(activity, i) in good.discount_activity" :key="i">{{ activity.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--购物车商品列表end-->

    <!--失效商品列表-->
    <div class="disabled-list" v-if="failureCartList && failureCartList.length">
      <div class="disabled-head">
        <span class="disabled-title">失效商品{{ failureCartList.length }}件</span>
        <span style="text-align: right; color: #f14e4e" @click.stop="clearFailureCart">清空失效商品</span>
      </div>
      <div class="disabled-item" v-for="good in failureCartList" :key="good.goods_id">
        <span class="gray">失效</span>
        <div class="img" @click.stop="toGoodsInfo(good)">
          <img :src="good.goods_thumb" />
        </div>
        <div class="detail">
          <div class="title">{{ good.goods_title | escapeTitle }}</div>
          <div class="price">该商品已不能购买</div>
        </div>
      </div>
    </div>
    <!--失效商品列表end-->

    <!-- 结算部分-海外 -->
    <div class="cart_pay" :style="{ bottom: '50px' }" v-show="!cartDelete && isShowList">
      <div class="all">
        <div class="checkall">
          <van-checkbox checked-color="#f15353" style="font-size: 12px" v-model="checkAll" :name="$i18n.t('cart.全选海外购')" @click.stop="allSelect(checkAll)">{{ $i18n.t('cart.全选海外购') }} </van-checkbox>
          <span class="checkall_blank"></span>
        </div>
      </div>
      <div class="text">
        <div class="freight">
          {{ $i18n.t('cart.合计') }}：<span style="font-size: 14px; color: #f15353">{{ $i18n.t('money') }}</span
          ><span class="totalprice">{{ total_amount }}</span>
        </div>
        <div class="coupon" v-if="Number(total_discount_amount) > 0" @click.stop="showCouponDetail = true">优惠明细：{{ $i18n.t('money') }}{{ total_discount_amount }}</div>
      </div>
      <div class="paysub" @click.stop="checkGoods">
        {{ $i18n.t('cart.结算') }}
        <small class="total" style="font-size: 12px">({{ cart_ids.length }})</small>
      </div>
    </div>
    <!--结算部分-海外end-->

    <!--删除编辑-->
    <div class="cart_del" :style="{ bottom: '50px' }" v-show="cartDelete && isShowList">
      <div class="checkall">
        <van-checkbox checked-color="#f15353" style="font-size: 12px" v-model="checkAll" :name="$i18n.t('cart.全选海外购')" @click="allSelect(checkAll)">{{ $i18n.t('cart.全选海外购') }} </van-checkbox>
      </div>
      <span @click.stop="deleteGoods">{{ $i18n.t('cart.删除') }}</span>
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
import { Toast } from 'vant';
const SUBMIT_ACTION_CART = '-1'; //添加到购物车
import overseastag from '../../components/overseas/tag.vue';
import gift from "components/goods/gift.vue";
import labels from "components/goods/labels.vue";
import selectGift from "components/goods/selectGift.vue";

export default {
  props: {
    // 是不是编辑模式
    cartDelete: {
      type: Boolean,
      default: () => false,
    },
    // 外层是不是有商品
    hasCard: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    overseastag,gift, selectGift, labels
  },
  computed: {
    cart_ids(){
      return this._getCheckedCardIds(true);
    },
  },
  data() {
    return {
      integral: window.localStorage.integral || '积分',
      showSelectGift: false, //选择赠品
      renderSelectGift: false, //选择赠品
      selectBol: true,
      //   cartDelete: false, //切换编辑状态
      cartList: [
        {
          is_alone: false,
          link: '',
          code: 'shop',
          name: '海外购',
          merchant_id: 0,
          shop_id: 'fb54f3c5992b96d001bb16e8e92d968d',
          discount_activity: [],
          price: '0.00',
          disable: false,
          carts: [],
        },
      ], //购物车数据
      failureCartList: [], //失效商品数据
      total_goods_price: 0, //商品总价是优惠前的价格
      total_amount: 0, //合计总价
      total_discount_amount: 0, //优惠
      discount_amount_items: [], //选中购物车优惠项
      showCouponDetail: false, //优惠明细弹窗显示
      isShowList: false, //购物车商品显示
      checkAll: false, //全选
      rentIndex: -1, // 判断购物车是否有租赁商品

      //结算标识
      submitFlag: '',

      //配送方式
      showChoose: false,
      radioChoose: '',
      dispatch_types: [],
      chooseType: '', // 判断是否选中了租赁商品

      showMore: false,
      sharin_is_open: false, // 购物车分享
      vip_show: JSON.parse(window.localStorage.getItem('globalParameter')).vip_show ? JSON.parse(window.localStorage.getItem('globalParameter')).vip_show : false,
      gift_goods_list: {
        'shop_id':[]
      }, //赠品商品列表
      gift_goods_num: [],  //赠品可选商品数量
      select_goods_title: '',  //选择赠品标题
      gift_goods_selected: [],  //赠品已选商品数量
      current_shop_id : 'shop_id', //当前商铺id
      current_marketing_id : 0, //当前活动id
      custom_gift: false, //自定义选择赠品，可以少选或不选
    };
  },
  activated() {
    this.initView(); //初始化数据
    this.getData(null, true);
  },
  watch: {
    isShowList: {
      handler(newVal, oldVal) {
        this.$emit('postMsg', ['hasOverseasCard', newVal]);
      },
    },
  },
  methods: {
    //初始化view
    initView() {
    //   this.cartDelete = false

      this.cartList = [];
      this.failureCartList = [];
      this.total_goods_price = 0;
      this.total_amount = 0;
      this.total_discount_amount = 0;
      this.showCouponDetail = false;
      this.isShowList = false;
      this.checkAll = false;
      this.rentIndex = -1;

      this.submitFlag = '';
      this.showChoose = false;
      this.radioChoose = '';
      this.dispatch_types = [];
      this.chooseType = '';
    },

    //获取失效购物车数据
    getFailureCart() {
      $http.get('cart.list.failure-cart').then(
        (response) => {
          if (response.result === 1) {
            this.failureCartList = response.data || [];
          }
        },
        (response) => {
          console.log(response);
        }
      );
    },

    //清空失效购物车数据
    clearFailureCart() {
      this.$dialog
        .confirm({ message: '确定清空失效商品吗？' })
        .then(() => {
          $http.get('cart.list.del-failure-cart').then(
            (response) => {
              if (response.result === 1) {
                this.failureCartList = [];
                Toast('清空成功');
              }
            },
            (response) => {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    _getCheckedCardIds(isArr){
      let cart_ids = [];
      _.each(this.cartList, function(item){
        _.each(item.carts,(it)=>{
          if(it.checked){
            cart_ids.push(it.cart_id);
          }
        });
        _.each(item.gift_carts,(it)=>{
          if(it.checked){
            cart_ids.push(it.cart_id);
          }
        });
      });
      if(isArr){
        return cart_ids;
      }
      return cart_ids.join(',');
    },
    _getPostData(){
      let data = [];
      _.each(this.cartList, function(item){
        _.each(item.carts,(it)=>{
          data.push({
            'id' : it.cart_id,
            'checked': it.checked
          });
        });
      });
      return data;
    },
    //获取购物车数据
    getData(flag, init) {
      let json = {
        carts: this._getPostData(),
        custom_gift: this.custom_gift
      };
      if (flag === 'delete') {
        // 获取购物车数量
        json.basic_info = 1;
      }
      $http.post('plugin.overseas.frontend.cart.overseas', json, 'loading').then(
        (response) => {
          if (response.result === 1) {
            this.sharin_is_open = response.data.sharin_is_open;
            this.total_discount_amount = response.data.total_discount_amount;
            this.discount_amount_items = response.data.discount_amount_items;
            this.total_amount = response.data.total_amount;
            this.total_goods_price = response.data.total_goods_price;
            this.cartList = response.data.list;
            if (!flag) {
              this.getFailureCart();
              this.allCheckListInit(this.cartList);
            } else if (flag === 'delete') {
              this.allCheckListInit(this.cartList, flag);
            }
            // flag === 'count' do nothing
          } else {
            Toast(response.msg);
            // this.isShowList = false;
          }
        },
        (response) => {
          console.log(response);
        }
      );
    },

    //初始化全部数据
    allCheckListInit(data, flag) {
      if (flag == 'delete' && data.length <= 0) {
        this.isShowList = false;
        // this.cartDelete = !this.cartDelete
        this.checkAll = false;
      }

      if (data.length) {
        for(let i=0;i<data.length;i++) {
          if(data[i].code === 'lease-toy') {
            this.rentIndex = i;
          }
        }
        //取得购物车全部数据
        this.isShowList = true;
      }
    },


    //点击全选
    allSelect(event) {
      console.log(this.cartDelete, event, "全选");
      if(event) {
        this.cartList = _.each(this.cartList, function(item){
          item.checked = true;
          if(_.isUndefined(item.carts)){
            return;
          }
          _.each(item.carts,(it)=>{
            it.checked = true;
          });
        });
        if(this.cartDelete){
          // 删除操作的时候
        }else {
          // 租赁和平台混合
          this.chooseType = 'buy';
        }
      }else {
        this.chooseType = '';
        this.cartList = _.each(this.cartList, function(item){
          item.checked = false;
          if(_.isUndefined(item.carts)){
            return;
          }
          _.each(item.carts,(it)=>{
            it.checked = false;
          });
        });
      }
      console.log(this.checkAll);
    },

    //选择单个店铺商品购买监听 变化会触发
    checkCart() {
      this.countCartView();
    },
    checkShopAll(val, c_index, shop) {
      if(this.cartList[c_index].disable) {
        return;
      }
      if(val) {
        _.each(shop.carts, cart=>{
          cart.checked = true;
        });
      }else {
        _.each(shop.carts, cart=>{
          cart.checked = false;
        });
      }
      console.log(val, c_index);
    },
    debouncedCheckCart: _.debounce(function () {
      console.log('debouncedCheckCart');
      this.checkCart();
    }, 200),

    //删除界面操作
    onCartDelete() {
      // eslint-disable-next-line vue/no-mutating-props
      this.cartDelete = !this.cartDelete;
      this.chooseType = '';
      //清空数据
      this.checkAll = false;
      this.total_amount = 0;
      this.total_goods_price = 0;
      this.total_discount_amount = 0;
      _.each(this.cartList, shop=>{
        shop.checked = false;
        shop.disable = false;
        _.each(shop.carts, cart=>{
          cart.checked = false;
        });
      });
    },

    //删除商品
    deleteGoods() {
      if (this._getCheckedCardIds(true).length == 0) {
        Toast('请选择删除商品');
        return;
      }
      let json = {
        ids: this._getCheckedCardIds(),
      };
      $http.get('cart.list.destroy', json, '操作中').then(
        (response) => {
          if (response.result == 1) {
            this.getData('delete');
          } else {
            Toast(response.msg);
          }
        },
        (response) => {
          console.log(response);
        }
      );
    },

    // 检查配送方式是否冲突
    checkGoods() {
      let cart_ids = this._getCheckedCardIds(true);
       zhuge.track('购物车点击海外产品结算',{
        '商品数量':cart_ids.length,
        '合计金额':this.total_amount
      });
      if (cart_ids.length == 0) {
        Toast('请选择结算商品');
        return;
      }

      // 商品数量限制
      if (cart_ids.length > 50) {
        Toast('最多一次性只能下单50个商品');
        return;
      }

      // 商品金额限制

      let url = 'plugin.overseas.frontend.memberCart.checkout';
      $http.get(url, { cart_ids: cart_ids.join(',')}, '操作中').then(
        (response) => {
          console.log('response', response);
          if (response.result == 1) {
            if (response.data.need_choose == 1) {
              // todo
              this.dispatch_types = response.data.dispatch_types;
              this.showChoose = true;
            } else {
              this.submitGoods();
            }
          } else {
            Toast(response.msg);
          }
        },
        (response) => {
          console.log(response);
        }
      );
    },
    toBuy() {
      this.submitGoods();
    },

    //提交订单
    submitGoods() {
      let _cart_ids = [];
      if (this.showChoose && !this.radioChoose) {
        Toast('请先选择配送方式');
        return;
      }

      if (this.showChoose) {
        // 配送方式有冲突
        for (let i = 0; i < this.dispatch_types[this.radioChoose].member_carts.length; i++) {
          _cart_ids.push(this.dispatch_types[this.radioChoose].member_carts[i].id);
        }
      } else {
        _cart_ids = this._getCheckedCardIds(true);
      }

      this.$router.push(
        this.fun.getUrl("goodsorder",{}, {
          tag: SUBMIT_ACTION_CART,
          cart_ids: _cart_ids.join(','),
          overseas: 1
        })
      );
    },

    //跳转商品详情
    toGoodsInfo(goods) {
      if (goods.goods_option_id) {
        this.$router.push(this.fun.getUrl('goods', { id: goods.goods_id, coid: goods.goods_option_id }));
      } else {
        this.$router.push(this.fun.getUrl('goods', { id: goods.goods_id }));
      }
    },

    // 供应商
    toShop(item) {
      if (item.merchant_id) {
        this.$router.push(this.fun.getUrl('SupplierShop', { id: item.merchant_id }));
      }
    },
    _initGiftGoodsList(){
      _.each(this.cartList, shop=>{
        // let gift_goods_id_list = _.chain(shop.carts).filter( cart => {
        //   return cart.is_gift;
        // }).map(cart=>{
        //   return cart.goods_id;
        // }).value();
        let gift_goods_id_list = _.map(shop.gift_carts, cart=>{
          return cart.goods_id;
        });
        if (_.isEmpty(shop.marketing)) {
          return;
        }
        if(_.isUndefined(shop.marketing.cart_detail.rule.goods_list)){
          return;
        }
        this.gift_goods_list[shop.shop_id] = _.map(shop.marketing.cart_detail.rule.goods_list, goods=>{
          if(gift_goods_id_list.includes(goods.id)){
            goods.checked = true;
          }else{
            goods.checked = false;
          }
          return goods;
        });
      });
      console.log(this.gift_goods_list);
    },
    _updateGiftGoodsList(item) {
      // let gift_goods_id_list = _.chain(item.carts).filter( cart => {
      //   return cart.is_gift;
      // }).map(cart=>{
      //   return cart.goods_id;
      // }).value();
      let gift_goods_id_list = _.map(item.gift_carts, cart=>{
        return cart.goods_id;
      });
      this.gift_goods_list[item.shop_id] = _.map(item.marketing.cart_detail.rule.goods_list, goods=>{
        if(gift_goods_id_list.includes(goods.id)){
          goods.checked = true;
        }else{
          goods.checked = false;
        }
        return goods;
      });
      console.log(this.gift_goods_list[item.shop_id], gift_goods_id_list);
      this.current_shop_id = item.shop_id;
      this.current_marketing_id = item.marketing.act_id;
    },
    // 凑单
    toSearch(item,btn) {
      console.log(btn);
      if(btn.indexOf('选赠品') >= 0){
        this.gift_goods_num = !_.isUndefined(item.marketing.cart_detail.rule.goods_num) ? item.marketing.cart_detail.rule.goods_num : 0;
        this.showSelectGift = true;
        this.select_goods_title = '请选择赠品';
        this._updateGiftGoodsList(item);
        this.renderSelectGift = true;
        return ;
      }else if(btn.indexOf('元换购') >= 0){
        this.gift_goods_num = !_.isUndefined(item.marketing.cart_detail.rule.goods_num) ? item.marketing.cart_detail.rule.goods_num : 0;
        this.showSelectGift = true;
        this.select_goods_title = btn;
        this._updateGiftGoodsList(item);
        this.renderSelectGift = true;
        return ;
      }else if(['取消换购','取消赠品'].includes(btn)){
        this._removeGiftFromCart(item);
        return;
      }
      if(btn === ''){
        if (item.link) {
          this.$router.push(item.link);
        }else{
          this.$router.push(this.fun.getUrl("search", {}, {plugin_id: 1}));
        }
      }else{
        this.$router.push(item.marketing.cart_detail.link);
      }
    },
    closeSelectGift() {
      console.log('closeSelectGift');
      this.renderSelectGift = false;
    },
    //改变数量
    changeCount(goods) {
      if (goods.total < 0) {
        Toast("商品数量不能为负数");
        // 最少为1
        goods.total = 1;
        return;
      }

      let json = {
        id: goods.cart_id,
        num: goods.total,
      };
      $http.get('cart.list.updateNumV2', json, '').then(
        (response) => {
          if (response.result === 1) {
            this.custom_gift = false;
            this.countCartView();
          } else {
            Toast(response.msg);
          }
        },
        (response) => {
          console.log(response);
        }
      );
    },

    // 减少商品数量
    numberLeft(goods) {
      if (goods.total <= 1) {
        Toast('商品数量不能为负数或零');
        return;
      }
      goods.total -= 1;
      this.changeCount(goods);
    },

    // 增添商品数量
    numberRight(goods) {
      // this.cartList[c_index].carts[index].total = Number(this.cartList[c_index].carts[index].total) + 1;
      //   if (this.cartList[c_index].carts[index].total >= 51) {
      //     Toast("该商品每周最多可购买50件");
      //     this.cartList[c_index].carts[index].total = 1;
      //     return;
      //   }
      goods.total += 1;
      this.changeCount(goods);
    },

    //计算总价格
    countCartView() {
      this.checkRent();
      // this.checkChooseAll();
      if (!this.cartDelete) {
        this.getData('count');
      }
    },
    _getAllCartLength(){
      let sum = 0;
      _.each(this.cartList, function(item) {
        sum += item.carts.length + item.gift_carts.length;
      });
      return sum;
    },

    // 判断是否全选
    checkChooseAll() {
      if (this.cartDelete) {
        // 删除操作的时候
        if(this._getAllCartLength() === this._getCheckedCardIds(true).length) {
          //判断全选
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      } else {
        let alone_num = 0;
        _.each(this.cartList,item=>{
          if(item.is_alone){
            alone_num = alone_num + item.carts.length;
          }
        });
        if((this._getAllCartLength() - alone_num) === this._getCheckedCardIds(true).length) {
          //判断全选
          this.checkAll = true;
        }else {
          this.checkAll = false;
        }
      }
    },

    // 判断是否选中了租赁商品
    checkRent() {
      if(this._getCheckedCardIds(true).length > 0) {
        if(this.rentIndex > -1) {
          this.chooseType = 'rent';
        } else {
          this.chooseType = 'buy';
        }
      } else {
        // 全部清空
        this.chooseType = '';
      }
    },

    // 展示更多
    toShowMore() {
      this.showMore = !this.showMore;
    },

    // 分享购物车
    shareCartGood() {
      this.$router.push(this.fun.getUrl('CartShare'));
    },
    _getGiftSelectedNum(){
      return _.sumBy(this.gift_goods_list[this.current_shop_id],goods => {
        return goods.checked ? 1 : 0;
      });
    },
    _addGiftSelected(gift_goods_id){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if (_.eq(gift_goods_id , goods.id)) {
          goods.checked = true;
        }
      });
      console.log(this.gift_goods_list);
    },
    _removeGiftSelected(gift_goods_id){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if (_.eq(gift_goods_id , goods.id)) {
          goods.checked = false;
        }
      });
    },
    _setGiftSelected(values){
      _.each(this.gift_goods_list[this.current_shop_id], goods=>{
        if(_.includes(values , goods.id)) {
          goods.checked = true;
        }else{
          goods.checked = false;
        }
      });
    },
    giftSelectChange(values){
      console.log(values, this.gift_goods_list[this.current_shop_id], this._getGiftSelectedNum());
      this._setGiftSelected(values);
    },
    giftSelectOk(){
      if(this._getGiftSelectedNum() <= 0){
        // Toast('请选择赠品');
        // return;
        this.custom_gift = true;
      }
      if(this._getGiftSelectedNum() < this.gift_goods_num){
        // Toast(this.gift_goods_list[this.current_shop_id].length+'个赠品任选'+this.gift_goods_num+'个');
        // return;
        this.custom_gift = true;
      }
      this._addGiftToCart();
    },
    _addGiftToCart(){
      //将赠品加入购物车
      let json = _.chain(this.gift_goods_list[this.current_shop_id]).filter(goods=>{
        return goods.checked;
      }).map(goods => {
        // console.log(goods);
        return {goods_id:goods.id, total:goods.num, option_id:goods.option_id, is_gift:1, marketing_id:this.current_marketing_id};
      }).value();
      $http.post("member.member-cart.gift-store", {marketing_id:this.current_marketing_id, data:json}, true).then(
        (response)=> {
          if (response.result === 1) {
            this.showSelectGift = false;
            this.countCartView();
          } else {
            Toast(response.msg);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },
    _removeGiftFromCart(item){
      let ids = _.map(item.gift_carts, cart=>{
        return cart.cart_id;
      }).join(',');
      $http.get('member.member-cart.destroy', { ids }, true).then(response => {
        if (response.result == 1) {
          this.custom_gift = true;
          this.countCartView();
        } else {
          Toast(response.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
</style>
