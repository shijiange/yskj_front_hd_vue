<template>
  <div id="card_conter">
    <c-title :hide="false" :text="'名片'"></c-title>
    <div class="card_a">
      <div class="header_box" :style="bacImage">
        <div class="header">
          <div class="img">
            <img :src="cardData.card_avatar" />
          </div>
          <ul class="name">
            <!-- <li class="name_a">
              <span>{{ cardData.card_name }}</span>
              <template v-if="visit_id != 0">
                <i
                  v-if="!clickStatus.collected"
                  @click="changeLike('1')"
                  class="iconfont icon-card_collect"
                ></i>
                <i
                  v-if="clickStatus.collected"
                  @click="changeLike('1')"
                  class="iconfont icon-card_collect_b"
                ></i>
                <i
                  v-if="!clickStatus.reliabled"
                  @click="changeLike('2')"
                  class="iconfont icon-card_laud"
                ></i>
                <i
                  v-if="clickStatus.reliabled"
                  @click="changeLike('2')"
                  class="iconfont icon-card_laud_b"
                ></i>
              </template>
            </li> -->
            <li class="name_a">
              <span>{{ cardData.card_name }}</span>
              <div class="name_a_right" @click="changeLike('1')">
                <i v-if="!clickStatus.collected" class="iconfont icon-bc_like_normal"></i>
                <i v-if="clickStatus.collected" class="iconfont icon-bc_like "></i>
                <span>{{ collection }}人收藏</span>
              </div>
            </li>
            <li class="name_b">
              <span>{{ cardData.role_name }}</span>
              <span v-if="level_name">{{ level_name }}</span>
            </li>
          </ul>
        </div>
        <ul class="per_info">
          <li v-if="cardData.card_mobile">
            <i class="iconfont icon-bc_tel"></i>
            <a :href="`tel:${cardData.card_mobile}`">{{ cardData.card_mobile }}</a>
          </li>
          <li v-if="cardData.card_wechat">
            <i class="iconfont icon-card_weixin1"></i>
            <span>{{ cardData.card_wechat }}</span>
          </li>
          <li v-if="!this.fun.isTextEmpty(cardData.company)">
            <i class="iconfont icon-bc_locate_company"></i>
            <span>{{ cardData.company }}</span>
          </li>
          <li class="position" v-if="areas">
            <i class="iconfont icon-bc_locate"></i>
            <span style="-webkit-box-orient: vertical;">{{ areas }} </span>
          </li>
        </ul>
      </div>
      <div class="card_button">
        <button type="button" @click="toCardVisit">
          <i class="iconfont icon-bc_share_card"></i>
          分享名片
        </button>
        <button type="button" v-clipboard:copy="cardData.card_mobile" v-clipboard:success="onCopy" v-clipboard:error="onError" class="other" v-if="cardData.card_mobile">
          <i class="iconfont icon-bc_copy"></i>
          复制号码
        </button>
      </div>
    </div>
    <!-- 名片码 -->
    <div class="code_box">
      <div class="code-left" @click.stop="toPage('CardCode')">
        <div class="codeName">名片码</div>
        <i class="iconfont icon-shoukuanma"></i>
      </div>
      <div class="code_right">
        <div class="contact_box" v-if="cardData.card_mobile">
          <a :href="`tel:${cardData.card_mobile}`">
            <div class="con_top">
              <i class="iconfont icon-bc_tel"></i>
              <span>拨打电话</span>
            </div>
            <div class="con_bom">
              <span>{{ cardData.card_mobile }}</span>
            </div>
          </a>
        </div>
        <div class="contact_box" v-if="cardData.card_wechat" v-clipboard:copy="cardData.card_wechat" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <div class="con_top">
            <i class="iconfont icon-card_weixin1"></i>
            <span>加我微信</span>
          </div>
          <div class="con_bom">
            <span>{{ cardData.card_wechat }}</span>
          </div>
        </div>
        <div class="contact_box" v-if="areas" v-clipboard:copy="areas" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <div class="con_top">
            <i class="iconfont icon-bc_locate"></i>
            <span>我的地址</span>
          </div>
          <div class="con_bom">
            <span>{{ areas }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 浏览人数 靠谱 -->
    <div class="user_box">
      <div class="user_photo">
        <div class="pho1" v-for="(item, ind) in AllData.member_avatar" :key="ind">
          <img :src="item.avatar_image" alt="" />
        </div>
        <span>{{ visit }}次浏览</span>
      </div>
      <div class="user_txt">
        <p>靠谱{{ reliable }}</p>
        <i @click="changeLike('2')" class="iconfont icon-card_laud" v-if="!clickStatus.reliabled"></i>
        <i @click="changeLike('2')" class="iconfont icon-card_laud_acitve" v-if="clickStatus.reliabled"></i>
      </div>
    </div>
    <!-- 我的成就 -->
    <div class="my_achieve" v-if="nums.visit_statistics">
      <div class="title">
        <div class="block"></div>
        <span>我的成就</span>
      </div>
      <div class="code_box1">
        <div class="code_right2">
          <div
            class="contact_box3"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/number@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>累计访问次数(次)</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.visit_statistics.visit }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/number@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>累计访问人数(人)</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.visit_statistics.visitor_num }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="nums.hasOwnProperty('all_income')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/number@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>{{ income_name_text }}</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.all_income }}</span>
            </div>
          </div>
          <!-- 我的成就——会员 -->
          <div
            class="contact_box3"
            v-if="(cardType === 'member' || cardType === 'team_dividend' || cardType === 'commission') && nums.hasOwnProperty('child_total')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/person@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>客户数量</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.child_total }}</span>
            </div>
          </div>
          <div
            class="contact_box3"
            v-if="(cardType === 'member' || cardType === 'team_dividend' || cardType === 'commission') && nums.hasOwnProperty('child_order_money')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>客户订单金额</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.child_order_money }}</span>
            </div>
          </div>
          <div
            class="contact_box3"
            v-if="(cardType === 'member' || cardType === 'team_dividend' || cardType === 'commission') && nums.hasOwnProperty('team_total')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/person@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>客户总数量</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.team_total }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="(cardType === 'member' || cardType === 'team_dividend' || cardType === 'commission') && nums.hasOwnProperty('team_order_money')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>客户总订单金额</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.team_order_money }}</span>
            </div>
          </div>
          <!-- 我的成就——招商员 -->
          <div
            class="contact_box3"
            v-if="(cardType === 'staff' || cardType === 'center') && nums.hasOwnProperty('count')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/person@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>招募商家数</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.count }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="(cardType === 'staff' || cardType === 'center') && nums.hasOwnProperty('amount')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>招募商家订单总额</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.count }}</span>
            </div>
          </div>
          <!-- 我的成就——区域代理 -->
          <div
            class="contact_box3"
            v-if="cardType === 'area_dividend' && nums.hasOwnProperty('count')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/order@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>区域订单数</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.count }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="cardType === 'area_dividend' && nums.hasOwnProperty('amount')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>区域订单总额</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.amount }}</span>
            </div>
          </div>
          <!-- 我的成就——供应商 -->
          <div
            class="contact_box3"
            v-if="cardType === 'supplier' && nums.hasOwnProperty('count')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/order@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>供应商订单数</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.count }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="cardType === 'supplier' && nums.hasOwnProperty('amount')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>供应商订单总额</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.amount }}</span>
            </div>
          </div>
          <!-- 我的成就——店长 -->
          <div
            class="contact_box3"
            v-if="(cardType === 'shop_owner' || cardType === 'clerk') && nums.hasOwnProperty('count')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/order@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>门店订单数</span>
            </div>
            <div class="con_bom">
              <span>{{ nums.count }}</span>
            </div>
          </div>

          <div
            class="contact_box3"
            v-if="(cardType === 'shop_owner' || cardType === 'clerk') && nums.hasOwnProperty('amount')"
            :style="{ backgroundImage: 'url(' + require('../../assets/images/money@2x.png') + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '95% 100%', backgroundSize: '2.25rem 1.4rem' }"
          >
            <div class="con_top">
              <span>门店订单总额</span>
            </div>
            <div class="con_bom">
              <span>{{ $i18n.t("money") }}{{ nums.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐商家 -->
    <div class="recommend_seller" v-if="cardType === 'staff' || cardType === 'center'">
      <div class="title">
        <div class="block"></div>
        <span>我推荐的商家</span>
      </div>
      <div class="apply_list">
        <div class="apply_box" @click="toPage('supplier')" v-if="member.is_supplier == 1">
          <i class="iconfont icon-card_apply_a"></i>
          <ul class="apply apply_b">
            <li class="apply_a">申请供应商</li>
          </ul>
        </div>
        <div class="apply_box" @click="toPage('storeApply')" v-if="member.is_store == 1">
          <i class="iconfont icon-card_apply_b"></i>
          <ul class="apply apply_c">
            <li class="apply_a">申请门店</li>
          </ul>
        </div>
        <div class="apply_box" @click="toPage('hotelApply')" v-if="member.is_hotel == 1">
          <i class="iconfont icon-card_apply_c"></i>
          <ul class="apply">
            <li class="apply_a">申请酒店</li>
          </ul>
        </div>
      </div>
      <div class="seller_list_loading">
        <van-tabs v-model="active" @click="chooseTab">
          <van-tab title="供应商" v-if="member.is_supplier == 1">
            <div class="seller_list">
              <div class="seller_box" v-for="(store, i) in cardList" :key="i" @click.stop="toShop(store.id, 'supplier')">
                <div class="header">
                  <img :src="store.change_logo" />
                </div>
                <ul class="name">
                  <li>{{ store.store_name }}</li>
                  <li class="position">
                    <i class="iconfont icon-seller-position"></i>
                    <span>{{ store.province_name + store.city_name + store.district_name }}</span>
                  </li>
                </ul>
                <i class="fa fa-angle-right"></i>
              </div>
            </div>
          </van-tab>
          <van-tab title="门店" v-if="member.is_store == 1">
            <div class="seller_list" v-if="openTemplate == 0">
              <div class="seller_box" v-for="(store, i) in cardList" :key="i" @click.stop="toShop(store.id, 'store')">
                <div class="header">
                  <img :src="store.thumb" />
                </div>
                <ul class="name">
                  <li>{{ store.store_name }}</li>
                  <li class="position">
                    <i class="iconfont icon-seller-position"></i>
                    <span>{{ store.province_name + store.city_name + store.district_name }}</span>
                  </li>
                </ul>
                <i class="fa fa-angle-right"></i>
              </div>
            </div>
            <template v-if="openTemplate == 1">
              <div v-for="(store, i) in cardList" :key="i" @click.stop="toShop(store.id, 'store')">
                <storelist02 :items="store"></storelist02>
              </div>
            </template>
          </van-tab>
          <van-tab title="酒店" v-if="member.is_hotel == 1">
            <div class="seller_list">
              <div class="seller_box" v-for="(store, i) in cardList" :key="i" @click.stop="toShop(store.hotel_id, 'hotel')">
                <div class="header">
                  <img :src="store.thumb" />
                </div>
                <ul class="name">
                  <li>{{ store.hotel_name }}</li>
                  <li class="position">
                    <i class="iconfont icon-seller-position"></i>
                    <span>{{ store.province_name + store.city_name + store.district_name }}</span>
                  </li>
                </ul>
                <i class="fa fa-angle-right"></i>
              </div>
            </div>
          </van-tab>
        </van-tabs>

        <div class="loading" v-if="showMore">
          <button type="button" @click="loadMore('list')">点击加载更多</button>
        </div>
      </div>
    </div>
    <!-- 供应商 -->
    <div class="recommend_seller" v-if="cardType === 'supplier'">
      <div class="title">
        <div class="block"></div>
        <span>供应商</span>
      </div>
      <div class="seller_list">
        <div class="seller_box" @click.stop="toShop(store.id, 'supplier')">
          <div class="header">
            <img :src="supplier.logo" />
          </div>
          <ul class="name">
            <li>{{ supplier.store_name }}</li>
            <li class="position">
              <i class="iconfont icon-seller-position"></i>
              <span>{{ supplier.province_name + supplier.city_name + supplier.district_name }}</span>
            </li>
          </ul>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>

      <div class="goods_list">
        <div class="goods_box" v-for="(item, i) in store_good" :key="i" @click="toGood(item)">
          <div class="img" style="width: 100%;">
            <img :src="item.change_thumb" style="width: 100%;" />
          </div>
          <ul class="goods_text">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ item.title }}
            </li>
            <li class="price">
              <span class="price_a"
                ><font>{{ $i18n.t("money") }}</font
                >{{ item.price }}</span
              >
              <span class="price_b" v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
            </li>
          </ul>
        </div>

        <div class="loading" v-if="showMore">
          <button type="button" @click="loadMore('good')">点击加载更多</button>
        </div>

        <div class="goods_box_none" v-if="goods && goods.length <= 0">
          暂无商品~
        </div>
      </div>
    </div>
    <!-- 我的门店 -->
    <div class="my_store" v-if="cardType === 'shop_owner' || cardType === 'clerk'">
      <div class="title">
        <div class="block"></div>
        <span>我的门店</span>
      </div>
      <div class="store_info">
        <div class="header_box">
          <div class="header">
            <img :src="shop_owner.banner_thumb" />
          </div>
          <ul class="name">
            <li class="name_l1">
              <span>{{ shop_owner.store_name }}</span>
              <div class="name_time" v-if="shop_owner.business_hours_start">营业时间:{{ shop_owner.business_hours_start }}-{{ shop_owner.business_hours_end }}</div>
            </li>
            <li class="name_phone">
              <i class="iconfont icon-bc_tel"></i>
              <span>{{ shop_owner.mobile }}</span>
            </li>
            <li class="name_address">
              <i class="iconfont icon-bc_locate"></i>
              <span>{{ shop_owner.full_address }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- <ul class="info_list">
        <li>
          <i class="iconfont icon-seller-position"></i
          ><span>{{ shop_owner.full_address }}</span>
        </li>
        <li>
          <i class="iconfont icon-seller_phone"></i
          ><span>{{ shop_owner.mobile }}</span>
        </li>
        <li v-if="shop_owner.business_hours_start">
          <i class="iconfont icon-seller-time"></i>
          <span>
            营业时间:{{ shop_owner.business_hours_start }}-{{shop_owner.business_hours_end}}
          </span>
        </li>
      </ul> -->
      <ul class="into_list">
        <li @click="toShop(shop_owner.id, 'store')">
          <i class="iconfont icon-seller-car"></i>
          <span>进店选购</span>
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toBuy(shop_owner.id)">
          <i class="iconfont icon-seller_check"></i>
          <span>优惠买单</span>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
      <!-- 添加优惠券 -->
      <div class="coupon">
        <div id="coupon_box">
          <div class="coupon_bg_box">
            <div class="coupon_bg" v-for="(item, index) in coupon_list" :key="index" @click="selectedcoupon(item, index)">
              <ul class="coupon_info">
                <li class="info_top">
                  {{ item.name }}
                </li>
                <li class="info_bottom">
                  <div>
                    <span v-if="item.coupon_method === 1">{{ $i18n.t("money") }}</span
                    ><font v-if="item.coupon_method === 1">{{ item.deduct }}</font> <font v-if="item.coupon_method === 2">{{ item.discount }}</font
                    ><span v-if="item.coupon_method === 2">折</span>
                  </div>
                  <div style="background: #ccc;" class="receive" v-if="item.received === 3">已抢光</div>
                  <div style="background: #ccc;" class="receive" v-if="item.received === 2">已领取</div>
                  <div style="background: #ff9102;" class="receive" v-if="item.received !== 2 && item.received !== 3">立即领取</div>
                </li>
                <!-- <li>{{item.name}}</li>
                <li>
                  <span v-if="item.coupon_method===1">{{$i18n.t('money')}}</span><font v-if="item.coupon_method===1">{{item.deduct}}</font>
                  <font v-if="item.coupon_method===2">{{item.discount}}</font><span v-if="item.coupon_method===2">折</span>
                  <span style="color:rgb(255, 152, 0)" class="receive"
                        v-if="item.received === 3">已抢光</span>
                  <span style="color:rgb(255, 152, 0)"  class="receive"
                        v-if="item.received === 2">已领取</span>
                  <span style="color:rgb(255, 152, 0)"  class="receive"
                        v-if="item.received !== 2 && item.received !== 3">立即领取</span>
                </li>
              </ul> -->
                <!-- <div style="background: #fff" class="spare_left"></div>
                <div style="background: #fff" class="spare_right"></div> -->
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="goods_lists">
        <div class="goods_box" v-for="(item, i) in store_good" :key="i" @click="toGood(item)">
          <div class="img">
            <img :src="item.change_thumb" />
          </div>
          <ul class="goods_text">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ item.title }}
            </li>
            <li class="price">
              <span class="price_a"
                ><font>{{ $i18n.t("money") }}</font
                >{{ item.price }}</span
              >
              <span class="price_b" v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
            </li>
          </ul>
        </div>

        <div class="loading" v-if="showMore">
          <button type="button" @click="loadMore('good')">点击加载更多</button>
        </div>

        <div class="goods_box_none" v-if="goods && goods.length <= 0">
          暂无商品~
        </div>
      </div>
    </div>
    <!-- 推荐商品 -->
    <!-- v-if="cardType === 'member' || cardType === 'team_dividend' || cardType === 'commission' || cardType === 'area_dividend'" -->
    <div class="recommend_goods">
      <div class="title_box">
        <div class="title">
          <div class="block"></div>
          <span>推荐商品</span>
        </div>
        <!--<div class="title_right" v-if="-->
        <!--cardType === 'supplier' ||-->
        <!--cardType === 'shop_owner'||-->
        <!--cardType === 'clerk'">-->
        <!--<span>全部商品</span>-->
        <!--<i class="fa fa-angle-right"></i>-->
        <!--</div>-->
      </div>
      <div class="goods_list">
        <div class="goods_box" v-for="(item, i) in goods" :key="i" @click="toGood(item)">
          <div class="img">
            <img :src="item.thumb" />
          </div>
          <ul class="goods_text">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ item.title }}
            </li>
            <li class="price">
              <font
                >{{ $i18n.t("money") }}<span class="price_a">{{ item.price }}</span></font
              >
              <div class="price_b">
                <i class=" iconfont icon-car_card"></i>
              </div>
            </li>
          </ul>
        </div>

        <div class="goods_box_none" v-if="goods && goods.length <= 0">
          暂无商品~
        </div>
      </div>
    </div>

    <!-- 导航 我的简介 我的贴子 我的视频 精选文字 -->
    <div class="navBox">
      <van-tabs v-model="istapBtn" swipeable animated color="#50a6f9" @change="tabChange" sticky>
        <van-tab title="我的简介" name="intro">
          <div class="intro">
            <div class="intro_text">
              <p>{{ cardData.introduction || "什么都没写~" }}</p>
            </div>
            <div class="banner_box">
              <viewer :images="cardData.picture">
                <div class="banner" v-for="(pic, i) in cardData.picture" :key="i">
                  <img :src="pic" />
                </div>
              </viewer>
            </div>
          </div>
        </van-tab>
        <van-tab title="我的帖子" name="postMy" v-if="is_trick == 1">
          <c-flow :showLoading="cisLoadMore" @loadMore="loadMore2('postMy')" :list="newClassification"></c-flow>
          <!--<div class="tab_post">-->
          <!--<div class="centen_box" >-->
          <!--<div class="show_box" v-for="(item,index) in newClassification" :key="index" @click="toxiangq(item.id,'post')">-->
          <!--<div class="show_box_img">-->
          <!--<img :src="item.has_many_image[0].url" alt="">-->
          <!--</div>-->
          <!--<div class="show_box_bottom">-->
          <!--<div class="title">-->
          <!--<p>{{item.title}}</p>-->
          <!--</div>-->
          <!--<div class="user">-->
          <!--<div class="tap_left">-->
          <!--<img :src="item.has_one_stick_user.avatar" alt="">-->
          <!--<p class="user_name">{{item.has_one_stick_user.nickname}}</p>-->
          <!--</div>-->

          <!--<div class="like">-->
          <!--<i class="iconfont icon-card_laud"></i>-->
          <!--<span>{{item.praise_num}}</span>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="loadNext" @click.stop="loadNext('intro')" v-if="!isintro" >-->
          <!--点击加载更多-->
          <!--</div>-->
          <!--</div>-->
        </van-tab>
        <van-tab title="我的视频" name="video" v-if="is_video == 1">
          <c-video :showLoading="roomIsLoadMore" :card_id="card_id" @loadMore="loadMore2('video')" :list="isVideo"></c-video>
          <!--<div class="tab_post">-->
          <!--<div class="centen_box" >-->
          <!--<div class="show_box" v-for="(item,index) in isVideo" :key="index" @click="toxiangq(item,'video')">-->
          <!--<img class="play"-->
          <!--src="../../assets/images/home_play@2x.png" alt=""-->
          <!--&gt;-->
          <!--<div class="show_box_img">-->
          <!--<img :src="item.cover" alt="">-->
          <!--</div>-->
          <!--<div class="show_box_bottom">-->
          <!--<div class="title">-->
          <!--<p>{{item.title}}</p>-->
          <!--</div>-->
          <!--<div class="user">-->
          <!--<div class="tap_left">-->
          <!--<img :src="item.member.avatar" alt="">-->
          <!--<p class="user_name">{{item.member.nickname}}</p>-->
          <!--</div>-->
          <!--<div class="like">-->
          <!--&lt;!&ndash; <i class="iconfont icon-card_laud"></i>-->
          <!--<span>{{}}</span> &ndash;&gt;-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="loadNext" @click.stop="loadNext('intro')" v-if="!isintro" >-->
          <!--点击加载更多-->
          <!--</div>-->
          <!--</div>-->
        </van-tab>
        <van-tab title="精选文章" name="text" v-if="is_article == 1">
          <div class="choiceness_text">
            <div class="text_box" v-for="(item, index) in isArticle" :key="index" @click="toDetail(item, 'text')">
              <div class="intext_box">
                <div class="intext_left">
                  <p>{{ item.title }}</p>
                  <div class="intext_left_bottom">
                    <span style="margin-right: 0.406rem;">{{ item.author }}</span
                    >|
                    <span style="margin-left: 0.406rem;">{{ format(item.virtual_created_at * 1000) }}</span>
                  </div>
                </div>
                <div class="intext_img">
                  <img :src="item.thumb" alt="" />
                </div>
              </div>
            </div>
            <img v-if="fun.isTextEmpty(isArticle)" style="width: 5rem; margin: 1rem;" src="../../assets/images/blank.png" alt="" />
            <!--<div class="loadNext" @click.stop="loadNext('intro')" v-if="!isintro">-->
            <!--点击加载更多-->
            <!--</div>-->
          </div>
        </van-tab>
        <van-tab title="直播列表" name="live" v-if="is_room == 1">
          <div class="live_list_div" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">
            <c-live :recordsList="recordsList" :showtitle="false" :isCard="true"></c-live>
            <!--<span class="live_more_btn" v-if="showMoreLive" @click.stop="getLiveList(true)">加载更多</span>-->
          </div>
          <img v-if="fun.isTextEmpty(recordsList)" style="width: 5rem; margin: 1rem;" src="../../assets/images/blank.png" alt="" />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 我的简介 -->
    <!-- <div class="my_synopsis">
      <div class="title">
        <div class="block"></div>
        <span>我的简介</span>
      </div>
      <div class="synopsis_text">
        <p>{{ cardData.introduction || '什么都没写~'}}</p>
      </div>
    </div> -->
    <!-- 我的声音 -->
    <!-- <div class="my_voice" v-show="fun.isWeiXin()&& voice">
      <div class="title">
        <div class="block"></div>
        <span>我的声音</span>
      </div>
      <div class="voice_box">
        <button type="button" @click="playAmr">
          <i class="iconfont icon-card_voice"></i>{{playAudio?'暂停':'点击播放'}}
        </button>
      </div>
      <p v-show="false">
        <audio ref="audios" controls></audio>
      </p>
    </div> -->
    <!-- 我的图片 -->
    <!-- <div class="my_img">
      <div class="title">
        <div class="block"></div>
        <span>我的图片</span>
      </div>
      <div class="banner_box">
        <viewer :images="cardData.picture">
          <div class="banner" v-for="(pic,i) in cardData.picture" :key='i'>
            <img :src="pic" />
          </div>
        </viewer>
      </div>
      <div class="goods_box_none" v-if="cardData.picture && cardData.picture.length <= 0">
        暂无图片~
      </div>
    </div> -->
    <!-- 首页和我的名片按钮 -->
    <!-- <div class="home_box" @click.stop="showToolbar" style="bottom: 7.1875rem;">
      <div class="y6" v-show="toolbar">
        <router-link class="y8" :to="fun.getUrl('home')">
          首页
        </router-link>
        <router-link class="yb" :to="fun.getUrl('CardCenter')">
          我的名片
        </router-link>
        <i class="yd"></i>
      </div>
    </div> -->
    <!-- 首页按钮 -->
    <div class="taphome" v-if="!fun.isWXWork()">
      <i class="iconfont icon-home-page"></i>
      <router-link class="y8" :to="fun.getUrl('home')">
        首页
      </router-link>
    </div>
    <div class="tapcard" v-if="!fun.isWXWork()">
      <i class="iconfont icon-bc_card"></i>
      <router-link :to="fun.getUrl('CardCenter')">
        名片
      </router-link>
    </div>
    <!-- 奖励提示 -->
    <van-popup v-model="show1" position="center" round style="width: 80%;">
      <div class="reward_bg">
        <ul class="reward_text">
          <li class="title">恭喜您获得访问奖励</li>
          <!-- <li class="number">10<span>爱心值</span></li> -->
          <li class="number" v-if="award && award.point">
            {{ award.point }}<span>{{ custom_name.point_name }}</span>
          </li>
          <li class="number" v-if="award && award.love">
            {{ award.love }}<span>{{ custom_name.love_name }}</span>
          </li>
        </ul>
        <button type="button" class="reward_btn" @click="show1 = false">确定</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import business_card_controller from "./business_card_controller";

export default business_card_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.code_box {
  overflow: hidden;
  overflow-x: auto;
  padding: 0.2rem 0.781rem 1.4rem 0;
  background: #fff;
  display: flex;

  .contact_box {
    margin-right: 0.781rem;
    height: 3rem;
    background-color: #fff;
    border: solid 0.031rem #e1e1e1;
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 0.4rem 0.688rem;
    flex-direction: column;
    border-radius: 0.156rem;

    .con_top {
      font-size: 0.875rem;
      color: #333;
      white-space: nowrap;

      span {
        white-space: nowrap;
      }
    }

    .con_bom {
      font-size: 0.75rem;
      color: #999;
      white-space: nowrap;
    }
  }

  .code_right {
    overflow: hidden;
    overflow-x: auto;
    flex: 1;
    display: flex;
    align-items: center;
  }
}

.code-left {
  margin-right: 0.781rem;
  width: 3.063rem;
  height: 3rem;
  background-color: #fff;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.05);
  border-radius: 0 1.5rem 1.5rem 0;
  display: flex;
  align-items: center;
  // position: fixed;
  // top: 12.706rem;
  // left: 0;
  // z-index: 10;
  .codeName {
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 100%;
  }

  i {
    margin-right: 8px;
    font-size: 24px;
  }
}

#card_conter {
  .home_box {
    position: fixed;
    z-index: 1000;
    right: 0;
    bottom: 3.75rem;
    width: 2.25rem;
    height: 2.25rem;
    background: rgba(0, 0, 0, 0.8) url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem 0.4375rem no-repeat;
    background-size: 4.0625rem 1.25rem;
    border: 0.0625rem solid #757575;
    border-radius: 0.25rem 0 0 0.25rem;
  }

  .y5.bothvisible {
    border-radius: 0.25rem 0 0 0;
  }

  .taphome {
    // width: 3.469rem;
    // height: 1.5rem;
    // background-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.4);
    // border-radius: 0.75rem 0 0 0.75rem;
    border: solid 0.5px #1b8dfc;
    position: fixed;
    top: 23.2rem;
    right: 0;
    line-height: 1.5rem;
    font-size: 0.75rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.2rem;
    border-bottom-left-radius: 2rem;
    border-top-left-radius: 2rem;

    .iconfont {
      font-size: 1.5rem;
    }

    a {
      font-size: 1rem;
    }
  }

  .tapcard {
    // width: 3.469rem;
    // height: 1.5rem;
    background-color: rgba(255, 255, 255, 0.4);
    color: #000;
    // border-radius: 0.75rem 0 0 0.75rem;
    border: solid 0.5px #1b8dfc;
    position: fixed;
    top: 26.5rem;
    right: 0;
    line-height: 1.5rem;
    font-size: 0.75rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.2rem;
    border-bottom-left-radius: 2rem;
    border-top-left-radius: 2rem;

    .iconfont {
      font-size: 1.5rem;
    }

    a {
      font-size: 1rem;
    }
  }

  .y6 {
    position: absolute;
    right: -0.0625rem;
    bottom: 2.625rem;
    width: 5.9375rem;
    border: 0.0625rem solid #757575;
    background: rgba(0, 0, 0, 0.8);
  }

  .y6 a {
    display: block;
    padding-left: 1.375rem;
    border-bottom: 0.0625rem solid #4b4b4b;
    line-height: 2.1875rem;
    height: 2.1875rem;
    color: #fff;
    background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
    background-repeat: no-repeat;
    background-size: 1rem 18.75rem;
  }

  .y8 {
    background-position: 0.625rem -3.125rem;
  }

  .y9 {
    background-position: 0.625rem -6.25rem;
  }

  .ya {
    background-position: 0.625rem -9.375rem;
  }

  .yb {
    background-position: 0.625rem -12.5rem;
  }

  .yc {
    background-position: 0.625rem -15.625rem;
    border: none;
  }

  .yd {
    position: absolute;
    bottom: -0.75rem;
    right: 0.625rem;
    width: 0;
    height: 0;
    z-index: 15;
    border-width: 0.375rem;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    border-style: solid;
  }

  .goods_box_none {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #fafafa;
  }

  .loading {
    width: 100%;

    button {
      width: 100%;
      height: 2.8125rem;
      border: none;
      background: #fff;
    }
  }

  .card_a {
    background: #fff;
    padding: 0.9375rem;
    // .pabanner{
    //   background: #fff;
    //   background: url('../../assets/images/card_bg@2x.png') no-repeat;
    //   background-size: cover;
    // }
    .header_box {
      // background: #fff;
      // background-image: url('../../assets/images/card_bg@2x.png');
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 0 0 0.625rem rgba(204, 204, 204, 0.4);
      border-radius: 0.938rem;
      padding: 0.9375rem;

      .header {
        display: flex;

        .img {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 1.875rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.625rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          width: 15.3125rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name_a {
            width: 100%;
            font-weight: bold;
            font-size: 1.5rem;
            line-height: 1.875rem;
            position: relative;

            span {
              color: #fff;
            }

            .name_a_right {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;
              align-items: center;
              border-radius: 0.781rem;
              height: 1.53rem;
              background-color: rgba(96, 96, 96, 0.2);
              padding: 0 10px;

              i {
                font-size: 1.125rem;
                color: #fff;
              }

              span {
                font-size: 16px;
                color: #fff;
                font-weight: normal;
              }
            }
          }

          .name_b {
            width: 100%;
            // line-height: 1.875rem;
            font-size: 16px;
            color: #fff;
            position: relative;

            i {
              position: absolute;
              right: 0;
              line-height: 1.875rem;
              font-size: 1.125rem;
              color: #999;
            }

            span {
              width: 13.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

      .per_info {
        text-align: left;
        margin-top: 0.625rem;

        li {
          line-height: 1.5rem;
          display: flex;

          i {
            font-size: 1.125rem;
            color: #fff;
            margin-right: 0.625rem;
          }

          span {
            font-size: 14px;
            color: #fff;
          }

          a {
            font-size: 14px;
            color: #fff;
          }
        }

        .position {
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .sum_box {
      margin: 0.625rem 0;
      display: flex;
      justify-content: space-between;

      li {
        line-height: 2.5rem;
        display: flex;

        i {
          color: #50a6f9;
          font-size: 1.5rem;
          margin-right: 0.25rem;
        }

        span {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .card_button {
      margin-top: 1rem;
      display: flex;

      /* justify-content: space-between; */
      button {
        flex: 1;
        width: 9.906rem;
        border-radius: 0.313rem;
        margin: 0 0.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #fff;
        color: #50a6f9;
        font-size: 16px;
        border: none;
        border: solid 0.0625rem #50a6f9;
      }

      .other {
        border: none;
        color: #fff;
        background: #50a6f9;
      }
    }
  }

  .sum_box {
    background: #fff;
    padding: 0.625rem 1rem;
    display: flex;
    justify-content: space-between;

    li {
      line-height: 2.5rem;
      display: flex;

      i {
        color: #50a6f9;
        font-size: 1.5rem;
        margin-right: 0.25rem;
      }

      span {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .navBox {
    background: #fff;
    margin-top: 0.625rem;
    min-height: 95vh;

    .titleco {
      font-weight: 600;
    }

    /deep/ .van-tab--active {
      font-weight: 600 !important;
    }

    .boxHight {
      height: 29.781rem;
    }

    .loadNext {
      height: 3.438rem;
      width: 100%;
      text-align: center;
      font-size: 0.75rem;
      color: #ccc;
      line-height: 3.438rem;
      position: absolute;
      background: #fff;
      z-index: 10;
      bottom: -1px;
    }
    // 简介
    .intro {
      text-align: left;
      margin: 1.156rem 0.938rem 0.628rem 0.938rem;
      background: #fff;
      overflow: hidden;
      position: relative;

      .banner_box {
        padding: 0.625rem 0;

        .banner {
          width: 100%;
          min-height: 9rem;
          border-radius: 0.375rem;
          overflow: hidden;
          margin-bottom: 0.625rem;
          background: #f2f2f2;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .intro_text {
        text-indent: 32px;
        word-break: break-word;
      }
    }
    // 贴子和视频
    .tab_post {
      margin: 0 0.938rem 0.628rem 0.938rem;
      // background: #50a6f9;
      overflow: hidden;
      position: relative;

      .centen_box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .show_box {
          width: 10.531rem;
          height: 18rem;
          background-color: #fff;
          box-shadow: 0 0 0.656rem 0 rgba(0, 0, 0, 0.1);
          border-radius: 0.344rem;
          display: flex;
          flex-direction: column;
          margin-top: 0.9rem;
          position: relative;

          .play {
            position: absolute;
            top: 40%;
            left: 40%;
          }

          .show_box_img {
            width: 100%;
            height: 14.094rem;
            // background: #aa45ff;
            img {
              width: 100%;
              height: 100%;
            }
          }

          .show_box_bottom {
            flex: 1;
            display: flex;
            flex-direction: column;

            .title {
              width: 100%;
              height: 2rem;
              line-height: 2rem;
              // background: red;
              text-align: left;

              p {
                font-size: 0.875rem;
                color: #000;
                margin-left: 0.5rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .user {
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding-left: 0.531rem;

              .tap_left {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                img {
                  width: 1.188rem;
                  height: 1.188rem;
                  border-radius: 50%;
                  margin-right: 0.25rem;
                }

                .user_name {
                  font-size: 0.75rem;
                  color: #ccc;
                }
              }

              .like {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-right: 0.531rem;

                i {
                  color: #000;
                  font-size: 0.781rem;
                }

                span {
                  font-size: 0.75rem;
                  color: #000;
                }
              }
            }
          }
        }
      }
    }
    // 精选文字
    .choiceness_text {
      margin: 0 0.938rem 0.628rem 0.938rem;
      overflow: hidden;
      position: relative;

      .text_box:last-child {
        border: none;
      }

      .text_box {
        height: 5.938rem;
        width: 100%;
        border-bottom: 1px solid #f7f7ff;
        margin-top: 0.5rem;

        .intext_box {
          width: 100%;
          height: 5.625rem;
          display: flex;
          justify-content: space-between;

          .intext_left {
            width: 13.125rem;
            height: 5.625rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;

            p {
              font-size: 0.875rem;
              color: #000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              // text-indent: 10px;
              text-align: left;
              margin-left: 0.25rem;
            }

            .intext_left_bottom {
              font-size: 0.75rem;
              color: #999;
              margin-left: 0.25rem;
            }
          }

          .intext_img {
            width: 7.125rem;
            height: 5.625rem;
            border-radius: 0.438rem;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .user_box {
    // height: 1.75rem;
    padding: 0 0.781rem;
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding-bottom: 1.813rem;
    align-items: center;

    .user_photo {
      height: 1.75rem;
      line-height: 1.75rem;

      span {
        font-size: 0.75rem;
        color: #666;
        margin-left: 0.5rem;
      }

      .pho1:first-child {
        margin: 0;
      }

      .pho1 {
        width: 1.75rem;
        height: 1.75rem;
        display: inline-block;
        margin-left: -0.5rem;
        float: left;
        background: #666;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }

    .user_txt {
      display: flex;
      align-items: center;

      i {
        color: #1b8dfc;
        font-size: 1.3rem;
      }

      p {
        font-size: 0.75rem;
        color: #000;
        margin-right: 0.188rem;
      }
    }
  }

  .my_achieve {
    background: #fff;
    margin-top: 0.625rem;

    .code_box1 {
      overflow: hidden;
      overflow-x: auto;
      padding: 0.2rem 0 0.906rem 0.781rem;
      background: #fff;
      display: flex;

      .contact_box3 {
        margin-right: 0.781rem;
        height: 5rem;

        /* width: 7.5rem; */
        background-color: #fff;
        border: solid 0.031rem #e1e1e1;
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding: 0.4rem 0.688rem;
        flex-direction: column;
        white-space: nowrap;

        .con_top {
          width: 6.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.75rem;
        }

        .con_bom {
          font-size: 1.313rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #000;
        }
      }

      .code_right2 {
        overflow: hidden;
        overflow-x: auto;
        flex: 1;
        display: flex;
        align-items: center;
      }
    }

    .title {
      padding: 0 0.9375rem;
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.344rem;
        height: 1.094rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
        margin-top: -3px;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .look_number {
      display: flex;
      justify-content: space-around;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0.625rem 0;

      li {
        line-height: 1.625rem;

        span:first-child {
          font-size: 16px;
        }

        span:last-child {
          color: #8c8c8c;
          font-size: 12px;
        }

        font {
          font-size: 12px;
        }
      }
    }

    .custom_number {
      display: flex;
      flex-wrap: wrap;
      padding: 0.625rem 0;

      li {
        width: 50%;
        line-height: 1.625rem;

        span:first-child {
          font-size: 16px;
        }

        span:last-child {
          color: #8c8c8c;
          font-size: 12px;
        }

        font {
          font-size: 12px;
        }
      }

      li:first-child,
      li:nth-child(2) {
        margin-bottom: 0.625rem;
      }

      li:nth-child(2n + 1) {
        border-right: solid 0.0625rem #ebebeb;
      }
    }
  }

  .my_synopsis {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0 0.9375rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .synopsis_text {
      padding: 0.625rem 0;

      p {
        background: #fafafa;
        border-radius: 0.25rem;
        max-height: 6.25rem;
        padding: 0.625rem;
        font-size: 15px;
        line-height: 1.5rem;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: left;
      }
    }
  }

  .my_voice {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0 0.9375rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .voice_box {
      padding: 0.625rem 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 2rem;
        color: #fff;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        width: 15rem;
        height: 2.5rem;
        color: #fff;
        background: #50a6f9;
        border-radius: 0.375rem;
        margin-left: 1.25rem;
      }
    }
  }

  .recommend_seller {
    background: #fff;
    margin-top: 0.625rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;
      padding: 0 0.9375rem;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .apply_list {
      display: flex;
      justify-content: space-between;
      padding: 0 0.9375rem;

      .icon-card_apply_a {
        background: rgba(251, 104, 82, 0.06);
        color: #fb6852;
      }

      .icon-card_apply_b {
        background: rgba(255, 205, 69, 0.06);
        color: #ffcd45;
      }

      .icon-card_apply_c {
        background: rgba(170, 69, 255, 0.06);
        color: #aa45ff;
      }

      .apply_box {
        flex: 1;

        /* width: 28%; */
        // background: #fafafa;
        padding: 0.625rem;

        .iconfont {
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 2rem;
          border-radius: 0.25rem;

          /* margin-right: 0.625rem; */
          padding: 0.25rem;
        }

        .apply {
          line-height: 1.25rem;
          text-align: center;

          .apply_a {
            font-size: 14px;
            color: #666;
            line-height: 1.875rem;
          }

          .apply_b {
            color: #8c8c8c;
            font-size: 12px;

            i {
              margin-left: 0.375rem;
            }
          }
        }
      }
    }

    .seller_list {
      margin-top: 0.625rem;
      padding: 0.625rem 0.9375rem;

      .seller_box {
        display: flex;
        align-items: center;
        background: #fafafa;
        padding: 0.625rem;
        width: 100%;
        margin-bottom: 0.625rem;

        .header {
          width: 3rem;
          height: 3rem;
          overflow: hidden;
          margin-right: 0.625rem;
          background: #fff;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          text-align: left;
          width: 15rem;

          li {
            line-height: 1.5rem;
            font-size: 15px;
          }

          .position {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #8c8c8c;

            i {
              font-size: 1.25rem;
              margin-right: 0.375rem;
            }

            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .fa {
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 1.25rem;
          color: #ccc;
          position: absolute;
          right: 0.625rem;
        }
      }

      .seller_box:last-child {
        margin-bottom: 0;
      }
    }
  }

  .my_store {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0 0.9375rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .store_info {
      padding: 0.625rem 0;

      .header_box {
        display: flex;

        .header {
          width: 4rem;
          height: 4rem;
          overflow: hidden;
          margin-right: 0.625rem;
          background: #f2f2f2;
          border-radius: 0.25rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          li {
            // line-height: 3rem;
            font-size: 16px;
          }

          .name_l1 {
            display: flex;
            justify-content: space-between;

            span {
              flex: 1;
              white-space: nowrap;
              width: 8.93rem;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: left;
              font-size: 1rem;
            }

            .name_time {
              width: 7.625rem;
              font-size: 0.688rem;
              height: 1.25rem;
              background-color: #1b8dfc;
              border-radius: 0.438rem;
            }
          }

          .name_phone {
            text-align: left;
            color: #666;
            font-size: 0.75rem;
          }

          .name_address {
            text-align: left;
            color: #666;
            font-size: 0.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .info_list {
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0.625rem 0;

      li {
        display: flex;
        line-height: 1.625rem;
        text-align: left;

        i {
          font-size: 1.25rem;
          color: #999;
          margin-right: 0.375rem;
        }

        span {
          font-size: 13px;
          color: #666;
        }
      }
    }

    .into_list {
      padding: 0.625rem 0;

      li {
        display: flex;
        line-height: 2.25rem;
        text-align: left;
        position: relative;

        .iconfont {
          font-size: 1.5rem;
          color: #000;
          margin-right: 0.375rem;
        }

        span {
          font-size: 0.875rem;
          color: #000;
        }

        .fa {
          position: absolute;
          right: 0.625rem;
          line-height: 2.25rem;
          font-size: 1.525rem;
          color: #c9c9c9;
        }
      }
    }
  }

  .recommend_goods {
    background: #fff;
    margin-top: 0.625rem;

    .title_box {
      padding: 0 0.9375rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        height: 2.5rem;
        line-height: 2.5rem;
        display: flex;
        align-items: center;

        .block {
          width: 0.25rem;
          height: 1rem;
          background: #50a6f9;
          border-radius: 0.0625rem;
          margin-right: 0.375rem;
        }

        span {
          font-weight: bold;
          font-size: 16px;
        }
      }

      .title_right {
        display: flex;

        span {
          color: #8c8c8c;
          font-size: 14px;
        }

        i {
          font-size: 1.125rem;
          color: #c9c9c9;
          margin-left: 0.25rem;
        }
      }
    }

    .goods_list {
      width: 100%;
      display: flex;
      // flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.625rem 0.781rem;

      .goods_box {
        width: 100%;
        height: 5.5rem;
        display: flex;
        align-items: center;
        // margin: 0.2rem 0;
        // padding: 0 0.2rem;
        box-shadow: none;
        // border-radius: 0.35rem ;
        border-bottom: 0.031rem solid #f7f7f7;

        .img {
          width: 4rem;
          height: 4.031rem;
          overflow: hidden;
          border-radius: 0.156rem;

          img {
            border-radius: 0.156rem;
            width: 100%;
            height: 100%;
          }
        }

        .goods_text {
          padding: 0 0.3125rem 0 0.594rem;
          text-align: left;
          flex: 1;

          .name {
            font-size: 14px;
            height: 2.5rem;
            line-height: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: 600;
          }

          .price {
            height: 1.5rem;
            position: relative;

            .price_a {
              color: #f15353;
              font-size: 16px;
              margin-left: 0.4rem;
            }

            font {
              font-size: 0.75rem;
              color: #ccc;
              margin-right: 5px;
              position: absolute;
              bottom: 0;
              left: 0;
            }

            .price_b {
              width: 1.5rem;
              height: 100%;
              background: #f21a1a;
              border-radius: 50%;
              text-align: center;
              float: right;
              line-height: 1.5rem;

              i {
                color: #fff;
              }
            }
          }
        }
      }

      .goods_box:nth-child(2n) {
        margin-right: 0;
      }
    }
  }

  .goods_lists {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.625rem 0;

    .goods_box {
      width: 10.531rem;
      margin: 0.2rem 0;
      // padding: 0 0.2rem;
      background: #fafafa;
      box-shadow: 0 0 0.656rem 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.35rem;

      .img {
        width: 100%;
        height: 44vw;
        overflow: hidden;
        border-radius: 0.35rem 0.35rem 0 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .goods_text {
        padding: 0.3125rem;
        text-align: left;

        .name {
          font-size: 14px;
          height: 2.5rem;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          line-height: 1.625rem;

          .price_a {
            color: #f15353;
            font-size: 16px;

            font {
              font-size: 12px;
            }
          }

          .price_b {
            color: #8c8c8c;
            text-decoration: line-through;
            margin-left: 0.625rem;
          }
        }
      }
    }

    .goods_box:nth-child(2n) {
      margin-right: 0;
    }
  }

  .coupon {
    overflow: hidden;
    overflow-x: auto;

    #coupon_box {
      padding: 0 0.625rem;
      background-color: #fafafa;

      .coupon_bg_box {
        padding: 0.625rem 0;
        display: flex;
        overflow: hidden;
        overflow-x: auto;

        .coupon_bg {
          // background: #f74546;
          background-color: #fff;
          box-shadow: 0 0 0.656rem 0 rgba(0, 0, 0, 0.1);
          border-radius: 0.156rem;
          margin-right: 1.125rem;
          width: 10.625rem;
          height: 4.375rem;
          // background-image: url(../../assets/images/coupon_font.png);
          // background-repeat: no-repeat;
          // background-size: 4rem;
          // background-position: 0 0;
          position: relative;
          display: inline-table;

          .coupon_info {
            // text-align: center;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .info_top {
              font-size: 0.75rem;
              color: #999;
              margin-left: 0.25rem;
              text-align: left;
            }

            .info_bottom {
              // padding: 0.625rem 0.625rem 0 1.5rem;
              width: 10.625rem;
              color: #000;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 16px;
              margin-left: 0.25rem;

              font {
                font-weight: bold;
                font-size: 1.375rem;
                line-height: 1.875rem;

                span {
                  font-weight: normal;
                  font-size: 16px;
                }
              }

              .receive {
                line-height: 1.25rem;
                display: block;
                width: 3.25rem;
                height: 1.25rem;
                background-image: url(../../assets/images/coupon_receive.png);
                background-size: 3.5rem 1.25rem;
                background-repeat: no-repeat;
                font-size: 12px;
                color: #fff;
                margin-right: 0.625rem;
                border-radius: 0.625rem;
                padding: 0 0.25rem;
              }
            }
            // li:first-child {
            //   width: 100%;
            //   border-top: dashed 1px #fff;
            //   line-height: 1.25rem;
            //   text-align: center;
            //   position: absolute;
            //   bottom: 0;
            //   font-size: 12px;
            //   color: #fff;
            // }
          }

          .spare_left {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #fafafa;
            border-radius: 0.25rem;
            position: absolute;
            left: -0.25rem;
            bottom: 1rem;
          }

          .spare_right {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #fafafa;
            border-radius: 0.25rem;
            position: absolute;
            right: -0.25rem;
            bottom: 1rem;
          }
        }
      }
    }
  }

  .my_img {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0 0.9375rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .banner_box {
      padding: 0.625rem 0;

      .banner {
        width: 100%;
        min-height: 9rem;
        border-radius: 0.375rem;
        overflow: hidden;
        margin-bottom: 0.625rem;
        background: #f2f2f2;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .reward_bg {
    width: 18.75rem;
    margin: 0 auto;
    height: 22.5rem;
    background-image: url(../../assets/images/reward_bgimg.png);
    background-size: 18.75rem 22.5rem;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    border-radius: 0.375rem;
    overflow: hidden;

    .reward_text {
      color: #fff;
      text-align: center;

      .title {
        font-size: 16px;
        line-height: 3.75rem;
        margin-top: 9.375rem;
        color: #ffeb12;
      }

      .number {
        font-size: 36px;
        color: #ffeb12;

        span {
          font-size: 14px;
          margin-left: 0.375rem;
        }
      }
    }

    .reward_btn {
      position: absolute;
      bottom: 1.25rem;
      left: calc(50% - 5.625rem);
      background: rgba(51, 51, 51, 0.3);
      width: 11.25rem;
      height: 2.5rem;
      border: none;
      color: #fff;
      font-size: 18px;
      border-radius: 2rem;
    }
  }
}
</style>
