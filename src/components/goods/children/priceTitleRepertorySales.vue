<!-- 商品价格、标题、库存、销售 -->
<template>
  <div>
    <template v-if="goods_type == 'hotelGoods' || goods_type == 'GroupGoods' || goods_type == 'zhpGroup' || goods_type == 'grab_group' || goods_type == 'groupWorkGood'">
      <van-row>
        <div class="info-box" :class="{ 'info-box_with-slogan': goodsInfo.with_slogan }">
          <van-col :span="24" id="titleBox" style="padding: 0.5rem 0.75rem 0;" v-if="goods_type == 'grab_group'">
            <van-col :span="24" class="title">
              <h1 style="-webkit-box-orient: vertical; font-size: 14px; line-height: 1.125rem;">{{ goodsInfo.title | escapeTitle }}</h1>
            </van-col>
          </van-col>
          <div class="title-box">
            <h2 v-if="goods_type == 'hotelGoods' || goods_type == 'GroupGoods' || goods_type == 'zhpGroup' || goods_type == 'groupWorkGood'">
              <!-- 酒店插件显示 -->
              <van-col :span="24" id="price">
                <template v-if="goods_type == 'hotelGoods'">
                  {{ $i18n.t("money") }}
                  <span id="price-num">
                    {{ goodsInfo.price }}
                  </span>
                  <del id="original-del"><span class="original-price">房价以当天价格为准</span></del>
                </template>
                <template v-else-if="goods_type == 'GroupGoods' || goods_type == 'zhpGroup' || goods_type == 'groupWorkGood'">
                  <div class="title-bold">{{ goods_info.title }}</div>
                </template>
              </van-col>
            </h2>
            <template v-else>
              <!--普通商品旧样式  稳定了就删-->
              <div class="DpBox" v-if="isGoodsLove">
                <!-- 天天兑价 -->
                <div class="daydayPrice">
                  天天兑价
                  <span>{{ $i18n.t("money") }}{{ goods_love_cash + "+" + goods_love_deduction + goods_love_name }}</span>
                </div>
              </div>
              <h2>
                <van-col :span="24" id="price" v-if="!isGoodsLove">
                  <div class="show_price_box" v-if="goods_plugin.goods_show && goods_plugin.goods_show.goods_detail_style == 1">
                    <div class="show_price">
                      {{ fun.getPrice() }}：{{ $i18n.t("money")
                      }}{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price }}
                      <em v-if="isRent">/天</em>
                    </div>
                    <div class="show_price" v-for="(item, i) in goods_plugin.goods_show.data" :key="i">
                      <p class="other_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']">{{ item.name }}：{{ item.value }}</p>
                    </div>
                  </div>
                  <template v-else-if="!goods_plugin.goods_show || goods_plugin.goods_show.goods_detail_style != 1">
                    <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">{{ fun.getPrice() }}</span>
                    <span v-if="goodsInfo.coupon">券后价</span>
                    {{ $i18n.t("money") }}
                    <span id="price-num" class="price-num1" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1" style="font-size: 14px; font-weight: 500;">{{
                      goodsInfo.vip_level_status.word
                    }}</span>
                    <span id="price-num" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
                    <span id="price-num" v-else>
                      {{
                        goodsInfo.min_price && goodsInfo.has_option == 1
                          ? goodsInfo.min_price == goodsInfo.max_price
                            ? goodsInfo.min_price
                            : goodsInfo.min_price + "-" + goodsInfo.max_price
                          : goodsInfo.price
                      }}
                      <em v-if="isRent">/天</em>
                    </span>
                    <del id="original-del" v-if="parseInt(goodsInfo.market_price) && Number(goodsInfo.market_price) > Number(goodsInfo.price)">
                      <span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span>
                    </del>
                  </template>
                </van-col>
                <!-- 天天兑价 -->
                <van-col :span="24" id="price" v-if="isGoodsLove">
                  <template>
                    <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">{{ fun.getPrice() }}</span>
                    <span v-if="goodsInfo.coupon">券后价</span>
                    {{ $i18n.t("money") }}
                    <span
                      id="price-num"
                      v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1"
                      :class="[goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? 'pricePower' : '']"
                    >
                      {{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goodsInfo.price }}
                      <em v-if="isRent">/天</em>
                    </span>
                    <span id="price-num" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
                    <span id="price-num" v-else>
                      {{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price }}
                      <em v-if="isRent">/天</em>
                    </span>
                  </template>

                  <del id="original-del" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price > goodsInfo.price">
                    <span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span>
                    <em v-if="isRent">/天</em>
                  </del>
                </van-col>
              </h2>
            </template>
            <template v-if="goods_type == 'grab_group'">
              <div class="grab-group-box" v-if="goods_info.goods && goods_info.goods.transport_reward > 0">
                <div class="cc c1">未拼中得</div>
                <div class="cc c2">{{ goods_info.goods.transport_reward }}红包</div>
              </div>
            </template>

            <i class="iconfont icon-erweima" @click="postShow()"></i>
            <i class="iconfont icon-fenxiang" @click="isShowSharePopup()"></i>
            <div class="share_text" @click="isShowSharePopup()">分享</div>
          </div>
          <div style="display: flex;" v-if="isShow_discount">
            <div class="goods-dicount" v-if="goodsInfo.coupon && goodsInfo.coupon.coupon_method == 1">优惠券{{ $i18n.t("money") }}:{{ goodsInfo.coupon.deduct }}</div>
            <div class="goods-dicount" v-if="goodsInfo.coupon && goodsInfo.coupon.coupon_method == 2">折扣:{{ goodsInfo.coupon.discount }}折</div>
            <div class="pub-price" v-if="goods_plugin.team_sales_first">推广赚{{ $i18n.t("money") }}{{ goods_plugin.team_sales_first }}</div>
          </div>
          <div id="titleBox" v-if="goodsInfo.with_slogan">
            <div class="title">
              <h1 class="goods-slogan">{{ goodsInfo.slogan }}</h1>
            </div>
          </div>
          <van-col :span="24" id="titleBox" v-if="isShow_title_coupon">
            <van-col :span="19" class="title">
              <h1 style="-webkit-box-orient: vertical;">{{ goodsInfo.title | escapeTitle }}</h1>
            </van-col>
            <van-col :span="5" class="coupon">
              <span @click="gotoCoupon" v-if="goodsInfo.availability && goodsInfo.availability == 1 ? true : false">
                领券
                <i class="fa fa-angle-right"></i>
              </span>
            </van-col>
          </van-col>
        </div>
      </van-row>
      <!--爱心值奖励-->
      <van-row v-if="goods_plugin.love_shoppin_gift">
        <van-col :span="24" id="price" class="price_box" v-if="goods_plugin.love_shoppin_gift">
          <span style="text-align: left; width: 100%;">{{ goods_plugin.love_shoppin_gift }}</span>
        </van-col>
      </van-row>

      <van-row v-if="isShow_stock || isShow_sales">
        <van-col :span="24" id="stockcontainer">
          <!-- 拼团显示活动设置的库存，非商品库存 -->
          <van-col :span="12" v-if="isShow_stock">库存:{{ goods_info.stock ? goods_info.stock : goodsInfo.stock }}</van-col>
          <van-col :span="12" class="sale" v-if="isShow_sales">{{ isRent ? "租赁次数" : "销量" }}:{{ parseInt(goodsInfo.show_sales) + parseInt(goodsInfo.virtual_sales || 0) }}</van-col>
        </van-col>
      </van-row>
    </template>

    <template v-else>
      <!--普通商品新样式-->
      <div class="good-item-box">
        <!--价格显示-->
        <div class="goods-price-info">
          <div class="goods-price-box" v-if="goods_plugin.point_goods">
            <!-- goods_plugin.point_goods积分商城   ==>  积分全抵扣  不显示其他价格或者爱心值-->
            <span class="goods-price-num">
              <span class="goods-price-num-style-2">{{
                goodsInfo.has_option == 1
                  ? goods_plugin.point_goods.min_point == goods_plugin.point_goods.max_point
                    ? goods_plugin.point_goods.min_point
                    : goods_plugin.point_goods.min_point + "-" + goods_plugin.point_goods.max_point
                  : goods_plugin.point_goods.min_point
              }}</span>
            </span>
            <span class="goods-price-text">{{ integral }}</span
            ><em v-if="isRent">/天</em>
          </div>

          <div class="goods-price-box" v-else>
            <!--普通商品价格 券后价格-->

            <span v-if="fun.getPrice() && !goodsInfo.coupon" class="goods-price-text">{{ fun.getPrice() }}：</span>
            <span v-if="goodsInfo.coupon" class="goods-price-text">券后价：</span>
            <span class="goods-price-num">
              <span class="goods-price-num-style-1">{{ $i18n.t("money") }}</span>
              <span class="goods-price-num-style-2" style="font-size: 18px;" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1">{{ goodsInfo.vip_level_status.word }}</span>
              <span class="goods-price-num-style-2" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
              <span class="goods-price-num-style-2" v-else
                >{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.min_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                }}<em v-if="isRent">/天</em></span
              >
            </span>
            <span class="market-price-text" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price != goodsInfo.price">
              <span class="goods-price-text" v-if="fun.getMarketPrice()">{{ fun.getMarketPrice() }}:</span>
              <span class="goods-price-text" style="text-decoration: line-through;">{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span>
            </span>
          </div>

          <div class="goods-price-shareButton" @click="isShowSharePopup()" v-if="!this.$route.query.is_retail">
            <i class="iconfont icon-fenxiang"></i>
            <span>分享</span>
          </div>
          <div class="goods-price-collectionButton" @click="onFavorite(favorite)">
            <i class="iconfont icon-zb_all_like" v-if="favorite"></i>
            <i class="iconfont icon-bc_like_normal" v-else></i>
            <span>收藏</span>
          </div>
        </div>

        <!--会员折扣-->
<!--        <div class="goods-member-level" v-if="openVip == '1'">-->
<!--          <div class="container" @click="gotoMemberGradeList(goodsInfo.member_discount.display_page)">-->
<!--            <i class="iconfont icon-huiyuanguanli-copy"></i>-->
<!--            <div class="level-name">会员</div>-->
<!--            <div class="level-list">-->
<!--              <div v-if="goodsInfo.member_discount && goodsInfo.member_discount.discount_value" class="level-item level-item-style-1">-->
<!--                {{ goodsInfo.member_discount.level_name }}专享价{{ $i18n.t("money") }}-->
<!--                {{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? "暂无权限" : goodsInfo.member_discount.discount_value }}-->
<!--                <span v-if="isRent">/天</span>-->
<!--              </div>-->
<!--              <div-->
<!--                v-if="goodsInfo.member_discount.next_level_price != goodsInfo.member_discount.discount_value && goodsInfo.member_discount.next_level_price > 0.0"-->
<!--                class="level-item level-item-style-2"-->
<!--              >-->
<!--                加入{{ goodsInfo.member_discount.next_level_name }}专享价{{ $i18n.t("money") }}-->
<!--                {{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? "暂无权限" : goodsInfo.member_discount.next_level_price }}-->
<!--                <span v-if="isRent">/天</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <template v-if="goodsInfo.member_discount.display_page == '1'">-->
<!--              <div class="level-button">立即开通</div>-->
<!--              <i class="iconfont icon-advertise-next"></i>-->
<!--            </template>-->
<!--          </div>-->
<!--        </div>-->

        <!--优惠券显示-->
        <div class="goods-coupon" v-if="available_coupon.length > 0 && goods_type != 'supplierGoods'">
          <div class="goods-coupon-list">
            <div class="goods-coupon-label" v-for="coupon in available_coupon" :key="coupon.id">
              {{ coupon.coupon_method == 1 ? `满${coupon.enough}减${coupon.deduct}` : `满${coupon.enough}打${coupon.discount}折` }}
            </div>
          </div>
          <div @click="gotoCoupon" style="display: flex; margin-left: 0.5rem;">
            <div class="goods-coupon-button">领券</div>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </div>
      </div>
      <!--普通商品新样式end-->

      <div
        class="good-item-box"
        style="padding: 0.3rem;"
        v-if="isGoodsLove || goods_plugin.love_shoppin_gift || (goods_plugin.goods_show && goods_plugin.goods_show.goods_detail_style == 1 && goods_plugin.goods_show.data.length > 0)"
      >
        <!--插件奖励-->
        <div class="love-reward">
          <!--天天兑价-->
          <div class="daily-price" v-if="isGoodsLove">
            <div class="daily-price-text">天天兑价</div>
            <div class="daily-price-num">{{ $i18n.t("money") }}{{ goods_love_cash + "+" + goods_love_deduction }}</div>
            <div class="daily-price-company">{{ goods_love_name }}</div>
          </div>
          <div
            class="love-reward-items"
            :style="{ marginTop: isGoodsLove ? '0.7rem' : '' }"
            v-if="
              goods_plugin.love_shoppin_gift || goods_plugin.team_sales_first || (goods_plugin.goods_show && goods_plugin.goods_show.goods_detail_style == 1 && goods_plugin.goods_show.data.length > 0)
            "
          >
            <!--爱心值奖励-->
            <div class="love-reward-item" v-if="goods_plugin.love_shoppin_gift">
              <div class="love-reward-item-name">购买奖励：</div>
              <div class="love-reward-item-proportion">{{ goods_plugin.love_shoppin_gift }}</div>
            </div>

            <!--推广赚-->
            <div class="love-reward-item" v-if="goods_plugin.team_sales_first">
              <div class="love-reward-item-name">推广赚：</div>
              <div class="love-reward-item-proportion">{{ $i18n.t("money") }}{{ goods_plugin.team_sales_first }}</div>
            </div>

            <!--特权省-->
            <template v-if="goods_plugin.goods_show && goods_plugin.goods_show.goods_detail_style == 1 && goods_plugin.goods_show.data.length > 0">
              <div class="love-reward-item" v-for="(item, i) in goods_plugin.goods_show.data" :key="i">
                <div class="love-reward-item-name">{{ item.name }}：</div>
                <div class="love-reward-item-proportion">{{ item.value }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 让利涨粉 -->
      <div class="rise-fans" v-if="goods_plugin.discountHarvestFans">
        <div class="rise-fans-icons">
          <i class="iconfont icon-fontclass-jiahaoyou"></i>
          <span class="text">加好友</span>
        </div>
        <div class="rise-fans-texts">
          下单满{{ goods_plugin.discountHarvestFans.order_amount }}元{{ goods_plugin.discountHarvestFans.type == "numerical_type" ? "立减" : "优惠" }}
          <span style="color:#f14e4e;">
            <span v-if="goods_plugin.discountHarvestFans.type == 'numerical_type'">{{ goods_plugin.discountHarvestFans.discount_amount }}元</span>
            <span v-else>{{ goods_plugin.discountHarvestFans.discount_amount }}%</span>
          </span>
        </div>
        <div class="rise-fans-btn" @click="getFriendQrCode">
          去添加
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>

      <div class="good-item-box">
        <!--标题库存-->
        <div class="goods-title-box">
          <div class="goods-advertisement" v-if="has_one_goods_advertising.with_slogan">
            <div class="goods-advertisement-wrapper" @click.stop="toSlogar">
              <div
                class="goods-advertisement-text"
                :style="{
                  color: has_one_goods_advertising.slogan.font_color || '#797979',
                  fontSize: has_one_goods_advertising.slogan.font_size ? has_one_goods_advertising.slogan.font_size + 'px' : '14px'
                }"
              >
                {{ has_one_goods_advertising.slogan.copywriting }}
                <span style="margin-left: 5px; color: #f14e4e;" v-if="has_one_goods_advertising.slogan.link"
                  >查看
                  <i class="iconfont icon-advertise-next" style="vertical-align: middle;"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-title-wrapper">
            <!-- 是否是海外购 -->
            <overseastag :visible="goodsInfo.overseas" class="details"/>
            <div class="goods-title-text" @click="readMore = !readMore" :class="[readMore ? '' : 'omit']">
              {{ goodsInfo.title | escapeTitle }}
            </div>
            <div class="goods-label-box">
              <span class="goods-label-text" v-for="labelItem in goodsInfo.has_many_search_filter" :key="labelItem.id">{{ labelItem.name }}</span>
            </div>
          </div>
          <div class="goods-desc-info" v-if="isShow_stock || isShow_sales">
            <div class="goods-count-sales" v-show="isShow_sales">
              <span>{{ isRent ? "租赁次数" : goodsInfo.is_month_sales == 1 ? "总销量" : "销量" }}</span>
              <span> {{ parseInt(goodsInfo.show_sales) + parseInt(goodsInfo.virtual_sales || 0) }}</span>
            </div>
            <div class="goods-monthly-sales" v-show="goodsInfo.is_month_sales == 1">
              <span>{{ isRent ? "月租次数" : "月销量" }}</span>
              {{ goodsInfo.month_sales ? goodsInfo.month_sales : 0 }}
            </div>
            <div class="goods-stock" v-show="isShow_stock && goodsInfo.is_show_stock">库存 {{ goodsInfo.show_stock ? goodsInfo.show_stock : goods_info.stock ? goods_info.stock : goodsInfo.stock }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 让利涨粉弹窗 -->
    <van-overlay :show="riseFansPopup" @click="riseFansPopup = false" z-index="9999">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="riseFansWrapper" v-show="riseFansPopup" @click.stop>
            <div class="riseFansContainer">
              <div class="text">添加好友</div>
              <div class="img">
                <img :src="riseFansQrCode" alt="" />
              </div>
              <div class="small-text" style="margin-top:1rem;">长按识别添加</div>
              <div class="small-text">添加后您将获得专属优惠！</div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="riseFansPopup = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <!-- 分享弹窗 -->
    <van-popup v-model="showShare" round closeable get-container="#app">
      <div class="share-title">分享</div>
      <div class="share-list" @click="showShare = false">
        <div class="share-list-chile" v-if="this.fun.getTyep() != 5" @click="shareWeixin()">
          <div class="share-list-icon"><i class="iconfont icon-fx_haoyou"></i></div>
          分享好友
        </div>
        <div class="share-list-chile" @click="postShow()">
          <div class="share-list-icon color2"><i class="iconfont icon-erweima"></i></div>
          分享海报
        </div>
        <div class="share-list-chile" v-if="wx_video_link == 1" @click.stop="getVideoLink()">
          <div class="share-list-icon color3"><i class="iconfont icon-ht_operation_copyline"></i></div>
          视频号链接
        </div>
      </div>
    </van-popup>
    <!-- 视频号复制弹窗 -->
    <van-popup v-model="showVideoLink" round closeable get-container="#appMain">
      <div class="video-link-copy">
        <div class="video-link-copy-btn" v-if="!fun.isTextEmpty(article_url)" @click.stop v-clipboard:copy="article_url" v-clipboard:success="onCopy">一键复制</div>
        <div class="video-link-copy-text">复制链接，<br />视频号发布视频粘贴扩展链接</div>
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/goods/videolink.png" alt="" class="video-link-copy-img" />
      </div>
    </van-popup>
    <yz-goodsposter v-model="posterShow" :posterData="isFrontCanvas ? posterImg : {}" :defaultImg="!isFrontCanvas ? posterImg : ''" :goodstype="true"></yz-goodsposter>
  </div>
</template>

<script>
import { Toast } from "vant";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import overseastag from '../../overseas/tag.vue';
var videoLinkTimer = null;
export default {
  props: {
    favorite: {
      type: Boolean,
      default: false
    },
    isRent: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    wx_video_link: {
      type: [String, Number],
      default: 0
    },
    goods_type: {
      type: String,
      default: ""
    },
    goods_info: {
      type: Object,
      default: () => ({})
    },
    fatherTitle:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      goodsInfo: {},
      goods_plugin: {},
      has_one_goods_advertising: {}, //宣传语
      available_coupon: [], //优惠券

      integral: window.localStorage.integral || "积分",
      isGoodsLove: false, //是否显示爱心值
      goods_love_cash: 0, //爱心值 现金
      goods_love_deduction: 0, //爱心值抵扣
      goods_love_name: "", //爱心值title

      showShare: false, //分享弹窗
      showVideoLink: false,
      article_url: "", //视频号链接

      //海报显隐
      posterShow: false,
      posterImg: null,
      isFrontCanvas: true, //是否前端控制生成海报，false为后端生成

      isShow_stock: true, //是否显示库存
      isShow_sales: true, //是否显示销量
      isShow_discount: true, //是否显示折扣优惠

      isShow_title_coupon: true, //是否显示标题、优惠券模块,id="titleBox"
      openVip: 2,
      readMore: false,

      riseFansPopup: false,
      riseFansQrCode: "",
      fatherTitle:""
    };
  },
  components: { yzGoodsposter, overseastag },
  watch: {
    loading(newVal, oldVal) {
      console.log(this.$route.query, "sssssssss");
      this.init();
    }
  },
  deactivated() {
    if (videoLinkTimer) {
      clearTimeout(videoLinkTimer);
    }
  },
  methods: {
    init() {
      console.log("goods_type==========", this.goods_type);
      if (this.goods_type == "hotelGoods") {
        // 酒店插件不显示库存、销量
        this.isShow_stock = false;
        this.isShow_sales = false;
        this.isShow_discount = false;
      }
      if (this.goods_type == "GroupGoods" || this.goods_type == "grab_group" || this.goods_type == "zhpGroup" || this.goods_type == "groupWorkGood") {
        // 拼团插件不显示折扣优惠
        this.isShow_discount = false;
        this.isShow_title_coupon = false;
      }
      if (this.goods_type == "zhpGroup") {
        this.isShow_sales = false;
      }

      this.goodsInfo = this.goods_info.get_goods;

      //* 限时购，宣传语显示
      this.has_one_goods_advertising.with_slogan = Boolean(this.goodsInfo.has_one_goods_advertising && this.goodsInfo.has_one_goods_advertising.is_open == 1);
      if (this.has_one_goods_advertising.with_slogan) {
        this.has_one_goods_advertising.slogan = this.goodsInfo.has_one_goods_advertising;
      }

      if (this.goods_info.get_hotel_info) {
        this.goodsInfo = { ...this.goods_info.get_goods, ...this.goods_info.get_hotel_info.goods };
      }
      this.goods_plugin = this.goods_info.plugin || {};
      this.available_coupon = this.goods_info.get_goods.available_coupon || [];

      // 会员折扣
      if (this.goodsInfo.member_discount) {
        if (this.fun.isTextEmpty(this.goodsInfo.member_discount.discount)) {
          this.openVip = 1;
        } else {
          this.openVip = this.goodsInfo.member_discount.discount;
        }
      }

      this.setIsLove();
    },
    toSlogar() {
      if (this.has_one_goods_advertising.slogan.link) {
        window.location.href = this.has_one_goods_advertising.slogan.link;
      }
    },
    onFavorite(e) {
      this.$emit("onFavorite", e);
      //console.log(this.goodsInfo);
      zhuge.track(this.fatherTitle+'页点击收藏',{
        '商品id':''+this.goodsInfo.id,
        '商品价格':this.goodsInfo.price,
        '商品名称':this.goodsInfo.title
      });
    },
    //是否有爱心值
    setIsLove() {
      if (this.goods_plugin.goods_love) {
        this.isGoodsLove = true;
        let love_cash = this.goodsInfo.price - this.goods_plugin.goods_love.amountOfMoney;
        this.goods_love_cash = Number(love_cash.toString().match(/^\d+(?:\.\d{0,2})?/));
        //this.goods_love_cash = (this.goodsInfo.price - this.goods_plugin.goods_love.amountOfMoney);
        this.goods_love_deduction = this.goods_plugin.goods_love.amountOfCoin;
        this.goods_love_name = this.goods_plugin.goods_love.name;
      } else {
        this.isGoodsLove = false;
      }
    },
    isShowSharePopup() {
      this.showShare = true;
    },
    // 生成视频号链接
    getVideoLink() {
      if (videoLinkTimer) {
        clearTimeout(videoLinkTimer);
      }
      $http
        .get("plugin.wx-video-link.frontend.index.index", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            if (this.fun.isTextEmpty(response.data.article_url)) {
              //为空则需要继续请求，直到返回数据
              videoLinkTimer = setTimeout(() => {
                this.getVideoLink();
              }, 3000);
            } else {
              clearTimeout(videoLinkTimer);
              this.article_url = response.data.article_url;
              this.showVideoLink = true;
              this.showShare = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 复制链接
    onCopy() {
      this.showVideoLink = false;
      Toast({
        message: "复制成功",
        position: "bottom",
        duration: 2000
      });
      this.article_url = "";
    },
    //跳转优惠券领取
    gotoCoupon() {
      if (this.goods_type == "hotelGoods") {
        this.$router.push(
          this.fun.getUrl("hotelCoupon", {
            id: this.goodsInfo.hotel_id
          })
        );
        return;
      }
      this.$router.push(this.fun.getUrl("couponStore"));
    },
    gotoMemberGradeList(flag) {
      if (flag == "1") {
        this.$router.push(this.fun.getUrl("MemberGradeList", {}));
      }
    },
    //获取让利涨粉二维码
    getFriendQrCode() {
      if (this.riseFansQrCode != "") {
        this.riseFansPopup = true;
        return;
      }
      $http.get("plugin.discount-harvest-fans.frontend.controller.AddFriends.getFriendQrCode", { goods_id: this.$route.params.id }, "").then(response => {
        if (response.result === 1) {
          this.riseFansPopup = true;
          this.riseFansQrCode = response.data.qr_code;
        } else {
          Toast(response.msg);
        }
      });
    },
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        let url = "";
        let Jons = {};
        this.isFrontCanvas = false;
        if (this.goods_type == "GroupGoods") {
          // 拼团插件
          url = "plugin.fight-groups.frontend.controllers.group-poster.generate-goods-poster";
          Jons = {
            store_id: this.$route.params.store_id
          };
        } else if (this.goods_type == "grab_group") {
          // 抢团插件
          url = "plugin.snatch-regiment.api.GoodsPoster.generateGoodsPoster";
        } else if (this.goods_type == "newRetailSalesGood") {
          // 新零售插件
          url = "plugin.new-retail.frontend.goodsPoster.generateGoodsPoster";
          Jons = {
            is_retail_goods: this.$route.params.mode
          };
        } else if (this.goods_type == "zhpGroup") {
          // 珍惠拼拼团抽奖插件
          url = "plugin.zhp-group-lottery.frontend.activity-poster.generate-goods-poster";
        } else if (this.goods_type == "groupWorkGood") {
          url = "plugin.group-work.frontend.controllers.group-poster.generate-goods-poster";
        } else {
          this.isFrontCanvas = true;
          url = "goods.goods-poster.new-goods-poster";
          Jons = {
            id: this.$route.params.id
          };
        }
        Jons.id = this.$route.params.id;
        let that = this;
        $http
          .get(url, Jons, "")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              console.log(that.goodsInfo.id);
              zhuge.track(that.fatherTitle+'页点击分享海报',{
                '商品id':''+that.goodsInfo.id,
                '商品价格':that.goodsInfo.price,
                '商品名称':that.goodsInfo.title
              });
              // isFrontCanvas 是否需要前端生成海报
              this.posterImg = this.isFrontCanvas ? response.data : `${response.data.image_url}?${Date.now()}`;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({ message: response.msg });
            }
          })
          .catch(error => {
            toastPoster.clear();
            console.log(error);
          });
      }
    },

    //分享
    shareWeixin() {
      this.$emit("shareWeixin");
    }
  }
};
</script>
<style lang="scss" scoped>
.info-box {
  width: 100%;

  .DpBox {
    width: 100%;
    margin-bottom: 0.4rem;

    .daydayPrice {
      display: inline-block;
      border: solid 0.0625rem #f15353;
      height: 1.75rem;
      line-height: 1.75rem;
      background: #f15353;
      border-radius: 0.25rem;
      padding-left: 0.25rem;
      overflow: hidden;
      color: #fff;
      float: left;
      clear: both;

      span {
        background: #fff;
        height: 100%;
        padding-right: 0.25rem;
        display: inline-block;
        color: #f15353;
      }
    }
  }

  .title-box {
    display: flex;
    padding: 0.5rem 0.75rem 0 0.75rem;
    flex-wrap: wrap;

    h2 {
      flex: 3;
      font-size: 14px;
      color: #f15353;
      text-align: left;
      font-weight: bold;

      i {
        font-size: 0.875rem;
      }

      #price {
        font-weight: bold;

        span {
          font-weight: bold;
        }
      }

      .title-bold {
        font-size: 16px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        color: #000;
      }
    }

    .grab-group-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 3.906rem;
      height: 2.188rem;
      background-color: #fff0e6;
      border-radius: 0.125rem;

      .cc {
        font-size: 0.625rem;
      }

      .c1 {
        color: #a09083;
      }

      .c2 {
        color: #ff4848;
      }
    }

    i {
      font-size: 18px;
      color: #666;
      margin-left: 1rem;
      line-height: 1.5rem;
    }

    .share_text {
      font-size: 10px;
      color: #9b9b9b;
      margin-left: 0.125rem;
      line-height: 1.5rem;
    }
  }

  #titleBox {
    padding: 0.5rem 0 0.25rem 0.75rem;
    display: flex;
    align-items: center;

    h1 {
      width: 100%;
      text-align: left;
      color: #333;
      font-size: 16px;
      line-height: 1.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      font-weight: bold;

      &.goods-slogan {
        //* 宣传语
        -webkit-box-orient: vertical;
        white-space: pre-line;
        -webkit-line-clamp: unset;
      }
    }

    .coupon {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      span {
        width: 4rem;
        line-height: 1.75rem;
        height: 1.75rem;
        background-color: #feebeb;
        display: inline-block;
        overflow: hidden;
        color: #ed0606;
        text-align: center;
        border-top-left-radius: 2em;
        border-bottom-left-radius: 2em;
      }
    }
  }
  //* 商品有宣传语,修改标题盒子样式
  &.info-box_with-slogan {
    #titleBox:last-child h1 {
      font-size: 0.875rem;
      font-weight: normal;
    }
  }

  ul {
    display: flex;
    justify-content: space-between;
    color: #8c8c8c;
    line-height: 1.625rem;
  }
}

.share-title {
  height: 3rem;
  line-height: 3.5rem;
}

.share-list {
  width: 16rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0 1rem 1rem;
  justify-content: space-between;

  .share-list-chile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 1.5rem;
    font-size: 12px;

    .share-list-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #fac337;
      line-height: 2.5rem;
      overflow: hidden;
      margin-bottom: 0.5rem;

      i {
        color: #fff;
        font-size: 20px;
      }
    }

    .color2 {
      background: #ff9329;
    }

    .color3 {
      background: #2aa7fb;
    }
  }
}

#stockcontainer {
  font-size: 12px;
  color: #999;
  text-align: left;
  line-height: 1.875rem;
  padding: 0 0.75rem 0.2rem;
}

#price {
  font-size: 12px;
  color: #f15353;
  text-align: left;

  #price-num {
    font-size: 24px;
  }

  #love-num {
    font-size: 1rem;
    color: #d99963;
  }
}

.price_box {
  padding: 0 0.75rem;
  margin-top: 0;
  background: #fff;
}

.sale {
  text-align: right;
}

#original-del {
  color: #8c8c8c;

  .original-price {
    font-size: 12px;
    margin-left: 12px;
    color: #8c8c8c;
    font-weight: 400 !important;
  }
}

.van-row {
  background: #fff;
  color: #666;
}

.video-link-copy {
  width: 15rem;
  padding: 3rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .video-link-copy-btn {
    height: 2rem;
    line-height: 2rem;
    padding: 0 1.5rem;
    color: #fff;
    border-radius: 1rem;
    background: #f15353;
  }

  .video-link-copy-text {
    font-size: 12px;
    padding: 0.875rem 0;
  }

  .video-link-copy-img {
    width: 90%;
  }
}

.goods-dicount {
  height: 1.5rem;
  background-color: #ffe6e3;
  border-radius: 0.125rem;
  color: #ff3203;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
  padding: 0 0.5rem;
}

.pub-price {
  width: 6.1563rem;
  height: 1.25rem;
  border-radius: 0.125rem;
  border: solid 0.0625rem #f15353;
  color: #f15353;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.7188rem;
}

/** 让利涨粉 */
.rise-fans {
  display: flex;
  align-items: center;
  height: 3.125rem;
  margin: 10px;
  background-image: linear-gradient(90deg, #ffdcb0 0%, #fdc98b 100%);
  border-radius: 0.625rem;
  .rise-fans-icons {
    display: flex;
    flex-direction: column;
    padding-left: 0.906rem;
    padding-right: 0.719rem;
    color: #874e02;
    font-size: 12px;
    font-weight: bold;
  }
  .rise-fans-texts {
    flex: 1;
    text-align: left;
    color: #874f02;
    font-size: 13px;
    font-weight: bold;
  }
  .rise-fans-btn {
    display: flex;
    align-items: center;
    padding-right: 0.625rem;
    font-size: 11px;
    font-weight: bold;
    color: #f14e4e;
  }
}
/**让利涨粉弹窗 */
.riseFansWrapper {
  .riseFansContainer {
    width: 13.438rem;
    height: 14.375rem;
    background-color: #ffffff;
    border-radius: 0.313rem;
    .text {
      padding-top: 1.25rem;
      padding-bottom: 0.875rem;
      font-size: 15px;
      color: #1a1a1a;
      font-weight: bold;
    }
    .img {
      display: flex;
      justify-content: center;
      height: 6.969rem;
      img {
        width: 6.969rem;
        height: 6.969rem;
      }
    }
    .small-text {
      margin-top: 0.25rem;
      font-size: 12px;
      font-weight: bold;
      color: #1a1a1a;
    }
  }
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}

/* 新普通商品样式 */
.good-item-box {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
}

.goods-price-info {
  display: flex;
  min-height: 4rem;
  align-items: center;
  padding: 0.6rem;
  text-align: left;

  .goods-price-box {
    flex: 1;
    font-size: 12px;
    font-weight: bold;
    color: #2e2e2e;

    .goods-price-num {
      color: #f14e4e;
      font-weight: bold;
      margin-right: 0.6rem;

      .goods-price-num-style-1 {
        font-size: 11px;
      }

      .goods-price-num-style-2 {
        font-size: 24px;
      }
    }

    .market-price-text {
      display: inline-block;
      word-break: keep-all;
    }
  }

  .goods-price-shareButton {
    display: flex;
    flex-direction: column;
    align-items: center;

    .iconfont {
      color: #2b2b2b;
      line-height: 1;
      font-weight: bold;
      padding-bottom: 0.2rem;
    }

    span {
      margin-top: 0.2rem;
      font-size: 10px;
      color: #828282;
    }
  }

  .goods-price-collectionButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 1.844rem;

    .iconfont {
      font-size: 1.5rem;
      line-height: 100%;
      color: #2b2b2b;

      &.icon-zb_all_like {
        color: #f14e4e;
      }
    }

    span {
      font-size: 10px;
      color: #828282;
    }
  }
}

.goods-member-level {
  padding: 0 0.6rem 0.6rem 0.6rem;

  .container {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 2.75rem;
    padding: 0.3rem 0.625rem;
    color: #fff;
    background-color: #493f41;
    border-radius: 0.313rem;

    .icon-huiyuanguanli-copy {
      font-size: 1.1rem;
    }

    .level-name {
      margin-left: 0.344rem;
      font-size: 13px;
      font-weight: bold;
    }

    .level-list {
      flex: 1;
      margin: 0 0.5rem 0 0.8rem;
      text-align: left;

      .level-item {
        font-size: 13px;
        font-weight: bold;

        &.level-item-style-1 {
          color: #e4c5a5;
        }

        &.level-item-style-2 {
          color: #cca86e;
        }
      }
    }

    .level-button {
      line-height: 1.1;
      font-size: 13px;
      font-weight: bold;
    }

    .icon-advertise-next {
      margin-left: 0.113rem;
    }
  }
}

.goods-coupon {
  display: flex;
  align-items: center;
  padding: 0 0.6rem 0.6rem 0.6rem;

  .goods-coupon-list {
    display: flex;
    flex: 1;
    overflow-x: scroll;
    margin-right: 0.2rem;

    .goods-coupon-label {
      flex-shrink: 0;
      font-size: 10px;
      color: #f69036;
      padding: 0.216rem 0.344rem;
      margin-right: 0.375rem;
      background: rgba(246, 144, 54, 0.1);
      border-radius: 0.125rem;
    }

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  .goods-coupon-button {
    font-size: 10px;
    font-weight: bold;
    color: #f69036;
  }

  .icon-advertise-next {
    color: #f69036;
  }
}

.love-reward {
  padding: 0.6rem;

  .daily-price {
    display: flex;
    align-items: center;

    .daily-price-text {
      font-size: 11px;
      font-weight: bold;
      color: #f69036;
    }

    .daily-price-num {
      margin-left: 0.75rem;
      font-size: 14px;
      font-weight: bold;
      color: #f14e4e;
    }

    .daily-price-company {
      margin-left: 0.5rem;
      font-size: 12px;
      font-weight: bold;
      color: #565656;
    }
  }

  .love-reward-items {
    display: flex;
    flex-wrap: wrap;

    .love-reward-item {
      display: flex;

      .love-reward-item-name {
        font-size: 0.75rem;
        font-weight: bold;
        color: #565656;
      }

      .love-reward-item-proportion {
        font-size: 0.75rem;
        font-weight: bold;
        color: #f14e4e;
      }

      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }
  }
}

.goods-title-box {
  text-align: left;
  padding: 0.6rem;

  .omit {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .goods-title-wrapper {
    .goods-title-text {
      font-size: 16px;
      font-weight: bold;
      color: #323232;
    }
    .goods-label-box {
      margin-top: 0.3rem;
      font-size: 12px;
      line-height: 18px;
      color: #565656;
      .goods-label-text {
        margin-right: 0.6rem;
      }
    }
  }

  .goods-advertisement {
    margin-bottom: 0.875rem;

    .goods-advertisement-wrapper {
      .goods-advertisement-text {
        font-size: 14px;
        color: #797979;
      }
    }
  }

  .goods-desc-info {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    margin-top: 1rem;
    font-size: 12px;
    font-weight: bold;
    color: #565656;
  }
}
</style>
