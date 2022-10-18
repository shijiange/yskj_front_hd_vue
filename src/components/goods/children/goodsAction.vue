<!-- 商品导航 -->
<template>
  <div>
    <div id="foot">
      <div class="posDiv set-pc-styleLeft" v-if="goods_type == 'reserve_simple_goods'">
        <div class="leftBox">
          <span>{{ appointmentLang.reserve_obj }}: {{ reserveData.item ? reserveData.item.name : "" }}</span>
          <span v-if="reserveData.time">预约时间: {{ reserveData.time.slice(5) }}</span>
          <span v-else class="posDiv_none">请选择预约时间</span>
        </div>
        <div class="RightBox" @click="tapReserve">
          <span>立即预约</span>
          <span>{{ $i18n.t("money") }}{{ reserveData.item && reserveData.item.price ? reserveData.item.price : "0.00" }}</span>
        </div>
      </div>
      <van-goods-action class="set-pc-styleLeft" v-else>
        <!-- 通过 initAction() 方法设置 -->
        <!-- 收藏图标 配置项：Favorite-->
        <van-goods-action-icon icon="star" v-if="isShowFavorite" :text="favorite ? '已收藏' : '未收藏'" :color="favorite ? '#ff5000' : '#323233'" @click="onFavorite(favorite)" />
        <!-- 首页图标 配置项：Shop-->
        <van-goods-action-icon icon="shop-o" v-if="isShowShop" :text="shopText" @click="gotoHome" />
        <!-- 订单图标 配置项：Order-->
        <van-goods-action-icon icon="orders-o" v-if="isShowOrder" text="订单" @click="gotoOrder" />
        <!-- 购物车图标 配置项：Cart-->
        <van-goods-action-icon icon="cart-o" v-if="isShowCart" text="购物车" :badge="$store.state.cart_num || ''" @click="gotoCart" />
        <!-- 客服图标 配置项：Chat-->
        <van-goods-action-icon icon="chat-o" text="客服" @click="clickChat" v-if="isShowChat" />
        <!-- 加入购物车按钮 配置项：AddCart-->
        <van-goods-action-button type="warning" text="加入购物车" v-if="isShowAddCartBtn" @click="addCart" :disabled="!isGoods || !isAddCart" />
        <!-- --------------------- 按钮分割线  ---------------------  -->
        <!-- 酒店插件 -->
        <van-goods-action-button type="danger" v-if="goods_type == 'hotelGoods'" text="立即预定" @click="order" />
        <!-- 小猪欢欢项目 二期 -->
        <van-goods-action-button color="#F58220" v-if="goods_type == 'GroupGoods' && goods_info.original_cost_buy_button == '1'" text="原价购买" @click="originalPriceTo(goods_info.goods_id)" />
        <!-- 拼团插件 -->
        <template v-if="goods_type == 'GroupGoods' && goods_info.status == '1'">
          <!-- 开团按钮 -->
          <van-goods-action-button type="warning" v-if="showOpeonBtn" @click="preOrderM('GroupGoods')">
            <template #default>
              {{ $i18n.t("money") }}{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goods_info.min_price }}<br />
              <div style="font-size: 12px;">一键开团</div>
            </template>
          </van-goods-action-button>
          <van-goods-action-button type="danger" @click="showGroupMore()">
            <!-- 参团按钮 -->
            <template #default>
              {{ $i18n.t("money") }}{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goods_info.min_price }} <br />
              <div style="font-size: 12px;">去参团</div>
            </template>
          </van-goods-action-button>
        </template>

        <!-- 珍惠拼拼团插件 -->
        <template v-if="goods_type == 'zhpGroup'">
          <van-goods-action-button type="warning" v-if="goods_info.is_show_barter == 1" @click="preOrderM('zhpYh')">
            <!-- 参团按钮 -->
            <template #default>
              <template>
                <div style="font-size: 12px;">易兑</div>
              </template>
            </template>
          </van-goods-action-button>
          <van-goods-action-button type="danger" @click="preOrderM('zhpGroup')" :disabled="goods_info.status == 2">
            <!-- 参团按钮 -->
            <template #default>
              <template v-if="goods_info.status != 2">
                {{ $i18n.t("money") }}{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : `${goods_info.min_price}起` }} <br />
                <div style="font-size: 12px;">去参团</div>
              </template>
              <template v-else>已结束</template>
            </template>
          </van-goods-action-button>
        </template>

        <!-- 抢团插件 -->
        <template v-if="goods_type == 'grab_group' && goodsInfo && timestamp > goodsInfo.start_time && timestamp < goodsInfo.end_time">
          <!-- 开团按钮 -->
          <van-goods-action-button type="warning" @click="openOrder(1)" v-if="leader_not_join_invalid == 0">
            <template #default>
              开团<br />
              <div style="font-size: 12px;">(不参与抢团)</div>
            </template>
          </van-goods-action-button>
          <van-goods-action-button type="danger" v-if="leader_not_join_invalid == 1 || leader_partake == 1" @click="openOrder(2)">
            <!-- 参团按钮 -->
            <template #default>
              开团
              <div style="font-size: 12px;" v-if="leader_not_join_invalid == 0">(参与抢团)</div>
            </template>
          </van-goods-action-button>
        </template>

        <template v-if="goods_type == 'newRetailSalesGood'">
          <!-- 新零售插件 -->
          <van-goods-action-button type="warning" v-if="this.$route.params.mode == 2" text="代理销售" @click="newRetailBuy('newRetail_1')" />
          <van-goods-action-button type="danger" text="立即购买" @click="newRetailBuy('newRetail_2')" />
        </template>

        <!-- 其他商品类型  立即购买按钮 -->
        <van-goods-action-button type="danger" :disabled="isBuy && isBegTime" @click="buyNow" v-if="isShowBuyNow && !isRent">
          <template #default>
            <template v-if="(isBuy && !isBegTime) || !isBuy">立即购买</template>
            <template v-if="isBuy && isBegTime">
              距开始还剩
              <van-count-down :time="begTimeStr" class="bottom_time" format="DD 天 HH 时 mm 分 ss 秒">
                <template #default="timeData">
                  <em style="color: #fff;">{{ timeData.days }} </em> <span style="color: #fff;">天</span>
                  <em style="color: #fff;">
                    {{ timeData.hours }}
                  </em>
                  <b style="color: #fff;">:</b>
                  <em style="color: #fff;">
                    {{ timeData.minutes }}
                  </em>
                  <b style="color: #fff;">:</b>
                  <em style="color: #fff;">
                    {{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }}
                  </em>
                </template>
              </van-count-down>
            </template>
          </template>
        </van-goods-action-button>

        <!-- 禁用按钮 未开始/已结束 -->
        <van-goods-action-button color="#c9c9c9" disabled v-if="isDisabled">
          <template #default>
            <em style="font-size: 16px;" @click="toWarning">{{ isDisabledText }}</em>
          </template>
        </van-goods-action-button>
      </van-goods-action>
    </div>

    <cservice-popup :show="show1" :cservice="cservice" :service_mobile="service_mobile" :service_QRcode="service_QRcode" @close="show1 = false"></cservice-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import cservicePopup from "./plugin/cservicePopup";
const SUBMIT_ACTION_CART = "-1"; //添加到购物车
const SUBMIT_ACTION_BUY = "-2"; //立即购买
var submitActionTag = "";
var goods_id = 0;
var level_id = 0;
var optionsId = 0;
export default {
  components: { cservicePopup },
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    },
    goods_plugin: {
      type: Object,
      default: () => ({})
    },
    isRent: {
      type: Boolean,
      default: false
    },
    isGoods: {
      type: Boolean,
      default: false
    },
    goods_type: {
      type: String,
      default: ""
    },
    // 倒计时
    isBuy: {
      type: Boolean,
      default: false
    },
    isTime: {
      type: Boolean,
      default: false
    },
    isBegTime: {
      type: Boolean,
      default: false
    },
    begTimeStr: {
      type: String,
      default: ""
    },
    endTimeStr: {
      type: String,
      default: ""
    },
    favoriteStatus: {
      type: Boolean, //收藏状态
      default: false
    },
    loaging: {
      type: Boolean,
      default: false
    },
    cservice: {
      //客服
      type: String,
      default: ""
    },
    service_mobile: {
      type: String,
      default: ""
    },
    service_QRcode: {
      type: String,
      default: ""
    },
    supplierDataId: {
      type: Number,
      default: 0
    },
    fatherTitle:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      //按钮显示条件
      isShowFavorite: false, //收藏
      isShowShop: false, //首页
      isShowCart: false, //购物车
      isShowChat: false, //客服
      isShowOrder: false, //订单
      isShowAddCart: false, //加入购物车
      isShowBuyNow: false, //立即购买按钮

      isDisabled: false, //禁用按钮
      isDisabledText: "",

      isShowAddCartBtn: false, //是否显示加入购物车按钮

      isMiniApp: window.isMiniprogram ? true : false,

      show1: false, //客服弹窗显示
      nocart: true,
      favorite: false, //收藏状态

      isAddCart: false,
      isPendingOrder: false, //挂单商品
      //* 云库存商品
      fromStock: "",
      goodsInfo: {},
      // goods_info: {},

      option_level_id: 0, //拼团插件：规格层级id
      leader_partake: 1, //抢团插件：团长是否参与中奖 1-是 2-否
      leader_not_join_invalid: 0, //为1时不显示“不参与抢团”按钮
      isCheckActivity: true, //抢团插件：下单前检查客户今天是否超出限制

      levelModel: 0, //新零售 销售代理套餐等级

      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳
      original_cost_buy_button: false,
      reserveData: {
        name: "",
        time: "",
        price: "",
        optionsId: ""
      },
      plugin_setting: ""
    };
  },

  // mounted() {},
  // created() {},
  // activated() {},
  deactivated() {
    this.$emit("deactivatedShowGood", false); //如果不设置，第二次进入不会触发监听到当前的watch里的loaging
  },
  computed: {
    //底部一键开团是否隐藏
    showOpeonBtn() {
      let that = this;
      if (that.goods_info.menu_show == 0) {
        return true;
      } else if (that.goods_info.menu_show == 1 && that.goods_info.has_many_team_count < that.goods_info.hide_num) {
        return true;
      } else {
        return false;
      }
    },
    appointmentLang() {
      if (this.$store.state.shopLanguage.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    },
    shopText() {
      if (this.goods_type == "GroupGoods") {
        return "主页";
      }
      if (this.goods_type == "supplierGoods") {
        return "店铺";
      }
      return "首页";
    }
  },
  watch: {
    loaging: function(newV, oldV) {
      this.init();
    }
  },
  methods: {
    init() {
      this.initAction(); //配置商品类型显示对应按钮
      this.plugin_setting = localStorage.getItem("plugin_setting") ? JSON.parse(localStorage.getItem("plugin_setting")) : "";

      this.goodsInfo = this.goods_info.get_goods;
      if (this.goods_info.get_hotel_info) this.goodsInfo = { ...this.goods_info.get_goods, ...this.goods_info.get_hotel_info.goods };

      if (this.goods_type == "GroupGoods") {
        goods_id = this.goodsInfo.id;
        if (this.goods_info.status != "1") {
          this.isDisabled = true;
          this.isDisabledText = this.goods_info.status == "0" ? "活动未开始" : "活动已结束";
        }
      } else if (this.goods_type == "groupWorkGood") {
        goods_id = this.goods_info.goods_id;
      } else {
        goods_id = this.$route.params.id;
      }

      if (this.goods_type == "grab_group") {
        this.leader_partake = this.goods_info.leader_partake;
        this.leader_not_join_invalid = Number(this.goods_info.leader_not_join_invalid) || 0;
        if (this.timestamp < this.goodsInfo.start_time || this.timestamp > this.goodsInfo.end_time) {
          this.isDisabled = true;
          this.isDisabledText = this.timestamp < this.goodsInfo.start_time ? "活动未开始" : "活动已结束";
        }
      }

      if (
        this.plugin_setting &&
        this.plugin_setting.yz_supply_camilo_resources &&
        (this.plugin_setting.yz_supply_camilo_resources.is_ios_sell === 1 || this.plugin_setting.yz_supply_camilo_resources.is_ios_sell === "1")
      ) {
        // 卡券商品 并开启 IOS禁用
        if (this.goods_info.get_goods.plugin_id == 140 && this.fun.isIosOrAndroid() === "ios") {
          this.isShowBuyNow = false;
          this.isDisabled = true;
          this.isDisabledText = "立即购买";
        }
      }

      //挂单商品
      if (!this.fun.isTextEmpty(this.$route.query.kind) && this.$route.query.kind == "POrder") {
        this.isPendingOrder = true;
      } else {
        this.isPendingOrder = false;
      }
      if (!this.fun.isTextEmpty(this.$route.query.nocart) || this.$route.query.fromStock || this.goods_type === "yunqian_api") {
        this.nocart = false;
      } else {
        this.nocart = true;
      }
      this.fromStock = this.$route.query.fromStock;

      this.setIsAddCart();
      this.favorite = this.favoriteStatus;
    },
    originalPriceTo(kid) {
      this.$router.push(this.fun.getUrl("goods", { id: kid }));
    },
    initAction() {
      // Favorite:收藏||Shop：首页||Cart:购物车||Chat:客服||AddCart：加入购物车按钮||BuyNow: 立即购买按钮
      let handleType = [];
      let actionArr = new Map([
        ["hotelGoods", ["Favorite", "Chat"]],
        ["GroupGoods", ["Shop"]],
        ["grab_group", ["Shop"]],
        ["DistributionGoods", []],
        ["newRetailSalesGood", ["Shop"]],
        ["appointment_goods", ["Shop", "Chat", "BuyNow"]],
        ["yunqian_api", ["Shop", "Chat", "BuyNow"]],
        ["store_projects_goods", ["Shop", "Chat", "BuyNow"]],
        ["zhpGroup", ["Shop", "Order"]]
      ]);

      if (actionArr.has(this.goods_type)) {
        //是否有配置，true表示actionArr数据里有定义,值为显示图标/按钮的配置项名称
        handleType = actionArr.get(this.goods_type);
      } else {
        handleType = ["Shop", "Cart", "Chat", "AddCart", "BuyNow"];
      }

      handleType.forEach(item => {
        this[`isShow${item}`] = true;
      });

      if (
        this.isShowAddCart &&
        !this.isBegTime &&
        this.nocart &&
        !this.isPendingOrder &&
        this.goods_info.get_goods &&
        this.goods_info.get_goods.plugin_id != 72 &&
        this.goods_info.get_goods.plugin_id != 140 &&
        this.goods_plugin.is_special != 1
      ) {
        this.isShowAddCartBtn = true; //加入购物车按钮
      }
    },
    //判断是否能加入购物车
    setIsAddCart() {
      //为空是老数据默认值问题
      if (this.fun.isTextEmpty(this.goodsInfo.buy_way) || this.goodsInfo.buy_way == "0") {
        this.isAddCart = true;
      }

      //不能加入 金币产品
      if (this.goodsInfo.buy_way == 1) {
        this.isAddCart = false;
      }
    },
    //跳转购物车
    gotoCart() {
      zhuge.track(this.fatherTitle+'页点击购物车按钮');
      this.$router.push(this.fun.getUrl("cart", {}));
    },
    clickChat() {
      zhuge.track(this.fatherTitle+'页点击客服',{
        '商品id':''+this.goodsInfo.id,
        '商品价格':this.goodsInfo.price,
        '商品名称':this.goodsInfo.title
      });
      if (this.isMiniApp) {
        this.fun.gotoMiniAppCs();
      } else {
        let setServicePlugin = this.fun.isTextEmpty(this.service_mobile) && this.fun.isTextEmpty(this.service_QRcode);
        if (this.fun.isTextEmpty(this.cservice) && setServicePlugin) {
          return this.$toast("抱歉，暂未设置客服信息");
        }
        if (!this.fun.isTextEmpty(this.cservice) && setServicePlugin) {
          //只设置了客服链接，直接跳转
          if (this.cservice && this.cservice.indexOf("chatWindow") >= 0) {
            window.location.href = this.cservice + "&goods_id=" + this.$route.params.id;
          } else {
            window.location.href = this.cservice;
          }
          return;
        }
        this.show1 = true;
      }
    },
    //加入购物车
    addCart() {
      zhuge.track(this.fatherTitle+'页点击加入购物车',{
        '商品id':''+this.goodsInfo.id,
        '商品价格':this.goodsInfo.price,
        '商品名称':this.goodsInfo.title
      });
      if (this.isBuy && this.isBegTime) {
        Toast("该商品还没到购买时间");
        return;
      }
      if (this.fromStock) {
        Toast("该商品无法加入到购物车");
        return;
      }
      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return;
      }
      this.$store.commit("setAddCartNowBuyButton", "加入购物车");
      $http.get("member.member.isValidatePageGoods", {}).then(response => {
        if (response.result === 1) {
          if (this.goodsInfo.has_one_invite_page && this.goodsInfo.has_one_invite_page.status === 1 && response.data.is_invite === 0) {
            this.$router.push(this.fun.getUrl("Inviter", {}, { fromGood: 1 }));
            return;
          }
          if (!this.isAddCart) {
            return;
          }
          if (!this.isGoods) {
            Toast("商品已下架或不存在");
            return;
          }

          submitActionTag = SUBMIT_ACTION_CART;
          this.$emit("popupModeshowChild", true);
          // //判断是否有规格
          // if (this.goodsInfo.has_option == 1) {
          //   //有规格
          //   this.popupSpecs = true;
          // } else {
          //   //无规格
          //   //处理参数
          //   optionsId = "";
          //   this.addCartRequest(goods_id, optionsId, this.goodsCount);
          // }
        }
      });
    },
    tapReserve() {
      if (this.fun.isTextEmpty(this.reserveData.time)) {
        Toast("请选择预约时间");
        return;
      }
      if (this.fun.isTextEmpty(this.reserveData.item.service_id)) {
        Toast("请选择预约人员");
        return;
      }
      let json_data = {
        goodsId: this.goods_info.get_goods.id,
        optionsId: this.reserveData.item.goods_option_id,
        total: "1",
        tag: "timeAppoint",
        reserveDataName: this.reserveData.item.name,
        reserveItem: this.reserveData.item,
        reserveDate: this.reserveData.time
      };
      if (this.fromStock) {
        json_data.fromStock = this.fromStock;
      }
      this.$router.push(this.fun.getUrl("goodsorder", {}, json_data));
    },
    toWarning() {
      if (
        this.plugin_setting &&
        this.plugin_setting.yz_supply_camilo_resources &&
        (this.plugin_setting.yz_supply_camilo_resources.is_ios_sell === 1 || this.plugin_setting.yz_supply_camilo_resources.is_ios_sell === "1")
      ) {
        if (this.goods_info.get_goods.plugin_id == 140 && this.fun.isIosOrAndroid() === "ios") {
          this.$dialog
            .confirm({
              message: "因平台规则限制，IOS端不支持购买虚拟商品；如需帮助，请联系客服。",
              confirmButtonText: "联系客服"
            })
            .then(() => {
              this.clickChat();
            })
            .catch(() => {
              //cancel
            });
        }
      }
    },
    //立即购买
    buyNow() {
      let that = this;
      zhuge.track(this.fatherTitle+'页点击立即购买',{
        '商品id':''+this.goodsInfo.id,
        '商品价格':this.goodsInfo.price,
        '商品名称':this.goodsInfo.title
      });
      if (this.isBuy && this.isBegTime) {
        Toast("该商品还没到购买时间");
        return false;
      }
      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      this.$store.commit("setAddCartNowBuyButton", "立即购买");
      $http.get("member.member.isValidatePageGoods", {}).then(
        response => {
          if (response.result === 1) {
            if (this.goodsInfo.has_one_invite_page && this.goodsInfo.has_one_invite_page.status === 1 && response.data.is_invite === 0) {
              this.$router.push(this.fun.getUrl("Inviter", {}, { fromGood: 1 }));
              return;
            }
            if (!this.isGoods) {
              Toast("商品已下架或不存在");
              return;
            }
            submitActionTag = SUBMIT_ACTION_BUY;
            this.$emit("popupModeshowChild", true);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    //提交确认
    submitAction(options_id, goodsCount, cardId, optionsMaxCount, levelsId, option_level_id) {
      optionsId = options_id;
      this.goodsCount = goodsCount;
      this.$emit("popupModeshowChild", false);
      if (submitActionTag == SUBMIT_ACTION_CART) {
        //购物车网络处理
        this.addCartRequest(goods_id, options_id, goodsCount);
      } else if (submitActionTag == SUBMIT_ACTION_BUY) {
        //立即购买处理
        this.buyNowRequest(goods_id, options_id, goodsCount);
      } else if (submitActionTag == "GroupGoods") {
        //拼团开团
        level_id = levelsId;
        this.option_level_id = option_level_id;
        this.openTeam(goods_id, options_id, goodsCount, optionsMaxCount);
      } else if (submitActionTag == "snatchLeader" || submitActionTag == "snatchGroup") {
        this.checkActivity();
      } else if (submitActionTag == "newRetail_1" || submitActionTag == "newRetail_2") {
        this.newRetailOrder();
      } else if (submitActionTag == "zhpGroup") {
        this.zhpGroupOrder();
      }
    },
    //加入购物车网络操作
    addCartRequest(_goodsId, _optionsId, _total) {
      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(_optionsId)) {
        //规格商品需optionsId 才能下单
        Toast("请选择规格");
        return;
      }
      if (_total <= 0) {
        this.$emit("popupModeshowChild", false);
        Toast("请选择商品数量");
        return;
      }

      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods)
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        response => {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "cart",
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    })
                  );
                })
                .catch(() => {});
            } else {
              that.addCartReq(_goodsId, _optionsId, _total);
            }
          } else {
            console.log(response.msg);
          }
        },
        response => {
          console.log(response);
          that.isGoods = false;
        }
      );
    },

    addCartReq(_goodsId, _optionsId, _total) {
      let json = { goods_id: _goodsId, total: _total, option_id: _optionsId };
      $http.get("member.member-cart.store", json, "添加中...").then(
        response => {
          if (response.result == 1) {
            this.$store.commit("setCartNum", response.data.cart_num);
            Toast(response.msg);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    //立即购买网络操作
    buyNowRequest(_goodsId, _optionsId, _total) {
      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(_optionsId)) {
        //规格商品需optionsId 才能下单
        Toast("请选择规格");
        return;
      }

      if (_total <= 0) {
        Toast("请选择商品数量");
        return;
      }

      if (
        this.goods_type === "appointment_goods" ||
        this.goods_type === "yun_contract_lock_goods" ||
        this.goods_type === "yun_sign_goods" ||
        this.goods_type === "yunqian_api" ||
        this.goods_type === "store_projects_goods"
      ) {
        submitActionTag = this.goods_type;
      } else {
        submitActionTag = SUBMIT_ACTION_BUY;
      }

      console.log(submitActionTag, "submitActionTag");

      //请求保税商品接口
      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods)
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中...").then(
        response => {
          if (response.result == 1) {
            let json_data = {
              goodsId: _goodsId,
              optionsId: _optionsId,
              total: _total
            };
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买此商品,请补充您的个人信息" })
                .then(() => {
                  json_data.tag = submitActionTag;
                  that.$router.push(that.fun.getUrl("myinfo", json_data));
                })
                .catch(() => {});
            } else {
              if (that.isPendingOrder) {
                //挂单商品
                json_data.tag = "POrder";
                json_data.fromStock = that.fromStock;
              } else {
                //普通商品
                json_data.tag = submitActionTag;
                if (that.fromStock) {
                  json_data.fromStock = that.fromStock;
                }
                if (that.$route.params.activity_id) {
                  json_data.activity_id = that.$route.params.activity_id;
                }
              }
              if (that.$route.query.is_retail) {
                json_data.is_retail = that.$route.query.is_retail;
              }
              json_data.overseas = that.goodsInfo.overseas;
              that.$router.push(that.fun.getUrl("goodsorder", {}, json_data));
            }
          } else {
            console.log(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    // 酒店下单
    order() {
      this.$router.push(
        this.fun.getUrl(
          "HotelGoodsOrder",
          {},
          {
            end: this.$route.query.end,
            start: this.$route.query.start,
            id: this.goodsInfo.hotel_id,
            goods_id: this.$route.params.id
          }
        )
      );
    },
    // 收藏==========================
    //收藏操作
    onFavorite(isFavorite) {
      if (!this.isGoods) {
        Toast("商品已下架或不存在");
        return;
      }
      // isFavorite ? this.removeFavorite() : this.addFavorite();
      let url = isFavorite ? "member.member-favorite.destroy" : "member.member-favorite.store";
      $http.get(url, { goods_id: goods_id }, ".").then(
        response => {
          if (response.result == 1) {
            this.favorite = !isFavorite;
            Toast(`${isFavorite ? "取消收藏" : "收藏成功"}`);
            this.$emit("changeFavorite", this.favorite);
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    preOrderM(type) {
      if (type == "zhpYh") {
        this.$router.push(this.fun.getUrl("zhpMyGroups", { status: 1 }));
        return;
      }
      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      if (type === "GroupGoods" && this.goods_info.join_status === false) {
        Toast({
          message: "今日该活动已达到参与次数",
          icon: "info-o"
        });
        return false;
      }
      submitActionTag = type;
      this.$emit("popupModeshowChild", true);
    },
    openTeam(goods_id, optionsId, goodsCount, optionsMaxCount) {
      let that = this;
      this.goodsId = goods_id;

      if (this.goodsCount > this.groupStock) {
        Toast("库存不足");
        this.goodsCount = this.groupStock;
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount > optionsMaxCount) {
        // Toast("库存不足");
        Toast(`抱歉，该商品限购${optionsMaxCount}件`);
        this.goodsCount = optionsMaxCount;
        return;
      }
      if (this.goodsCount <= 0) {
        Toast("商品数量不能小于0");
        this.goodsCount = 1;
        return;
      }

      if (this.fun.isTextEmpty(level_id)) {
        Toast("请选择开团点");
        console.log("请选择开团点");
        return;
      }

      let goods = [];
      goods.push(that.goodsId);
      $http.get("from.div-from.isDisplay", { goods_ids: JSON.stringify(goods) }, "加载中").then(response => {
        if (response.result === 1) {
          if (response.data.status && !response.data.member_status) {
            that.$dialog
              .confirm({ message: "购买跨境商品,请补充您的个人信息" })
              .then(() => {
                that.$router.push(
                  that.fun.getUrl("myinfo", {
                    tag: "",
                    goodsId: that.goodsId,
                    optionsId: optionsId,
                    total: that.goodsCount
                  })
                );
              })
              .catch(() => {});
          } else {
            let _json = {
              tag: "-2",
              goodsId: that.goodsId,
              optionsId: optionsId,
              total: that.goodsCount,
              level_id: level_id,
              option_level_id: that.option_level_id
            };
            if (that.$route.params.store_id && Number(that.$route.params.store_id) != 0) {
              _json.groupStoreID = that.$route.params.store_id;
            }
            that.$router.push(that.fun.getUrl("goodsorder", {}, _json));
          }
        } else {
          console.log(response.msg);
        }
      });
    },
    showGroupMore() {
      if (this.goods_info.join_status === false && this.goods_type === "GroupGoods") {
        Toast({
          message: "今日该活动已达到参与次数",
          icon: "info-o"
        });
        return false;
      }
      this.$emit("showGroupList", true);
    },
    // 抢团插件 =================================
    openOrder(type) {
      submitActionTag = type == 1 ? "snatchLeader" : "snatchGroup";
      this.$emit("popupModeshowChild", true);
    },
    //获取数据列表
    checkActivity() {
      let that = this;
      $http
        .get(
          "plugin.snatch-regiment.api.index.getSnatchData",
          { art: "inspectOverrun", leader_id: 0, at_id: this.goodsInfo.activity_id, option_id: optionsId, goods_id: this.$route.params.id, total: this.goodsCount },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.isCheckActivity = true;
              if (submitActionTag == "snatchLeader") {
                //团长开团不参与中奖
                this.$dialog
                  .confirm({
                    title: "提示",
                    message: "开团后不参与中奖？"
                  })
                  .then(() => {
                    that.OpenLeader();
                  })
                  .catch(() => {
                    // Toast("已取消");
                  });
              } else if (submitActionTag == "snatchGroup") {
                //团长开团参与中奖
                this.openSnatchGroup();
              }
            } else {
              that.isCheckActivity = false;
              Toast(response.msg);
            }
          },
          response => {}
        );
    },
    OpenLeader() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.team.OpenLeader", { at_id: this.goodsInfo.activity_id, goods_id: goods_id }).then(
        response => {
          if (response.result === 1) {
            Toast("开团成功！");
            that.$router.push(that.fun.getUrl("grab_group_my", {}));
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    openSnatchGroup() {
      if (!this.isCheckActivity) {
        Toast("抱歉，您已超出限制条件");
        return;
      }
      if (this.goodsCount == 0) {
        Toast("抱歉，库存不足");
        return;
      }
      let that = this;
      let goods = [];
      goods.push(goods_id);
      $http.get("from.div-from.isDisplay", { goods_ids: JSON.stringify(goods) }, "加载中").then(
        response => {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "grabGroup_open",
                      goodsId: goods_id,
                      at_id: that.goodsInfo.activity_id, //活动ID
                      optionsId: optionsId,
                      total: that.goodsCount
                    })
                  );
                })
                .catch(() => {});
            } else {
              that.$router.push(
                that.fun.getUrl(
                  "goodsorder",
                  {},
                  {
                    tag: "-2",
                    orderType: "grabGroup_open",
                    optionsId: optionsId,
                    goodsId: goods_id, //活动商品ID
                    at_id: that.goodsInfo.activity_id, //活动ID
                    total: that.goodsCount
                  }
                )
              );
            }
          } else {
            console.log(response.msg);
          }
        },
        response => {
          console.log(response);
          that.isGoods = false;
        }
      );
    },
    // 抢团插件 end ================================

    // 新零售 插件 ======================
    newRetailOrder() {
      let _json = {
        orderType: "newRetail",
        tag: "-2",
        goodsId: this.$route.params.id,
        optionsId: optionsId,
        total: this.goodsCount
      };
      // submitActionTag == "newRetail_1" || submitActionTag == "newRetail_2";
      //自主进货下单：相当于不需要配送方式的虚拟商品
      //retail_state: 0-自由零售 1-成为代理商订单 2-自由发货 3-线上零售 4-进货订单 5-销售代理套餐订单
      let retail_state = null;
      if (this.$route.params.mode == 3 && submitActionTag == "newRetail_2") {
        //自由进货
        retail_state = 4;
      } else if (this.$route.params.mode == 2 && submitActionTag == "newRetail_2") {
        //代理套餐 的 立即购买
        _json.NRLevelId = this.levelModel;
        retail_state = 1;
      } else if (this.$route.params.mode == 1 && submitActionTag == "newRetail_2") {
        //自由零售
        retail_state = 0;
      } else if (this.$route.params.mode == 2 && submitActionTag == "newRetail_1") {
        //代理套餐 的代理销售。跳转二维码页面
        retail_state = 5;
        this.agentSales(optionsId, this.goodsCount);
        return;
      }
      _json.retail_state = retail_state;
      this.$router.push(this.fun.getUrl("goodsorder", {}, _json));
    },
    agentSales(_optionsId, goodsCount) {
      $http
        .post(
          "plugin.new-retail.frontend.index.agentSales",
          { goods_id: this.$route.params.id, goods_option: _optionsId, goods_num: goodsCount, level_id: this.levelModel, goods_name: this.goodsInfo.title },
          ""
        )
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("newRetail_agencyPackage", { id: response.data.id }));
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    newRetailBuy(type) {
      // submitActionTag : 代理套餐||newRetail_1，立即购买||newRetail_2
      submitActionTag = type;
      this.$emit("popupModeshowChild", true);
    },

    //跳转主页
    gotoHome() {
      if (this.goods_type == "grab_group") {
        this.$router.push(this.fun.getUrl("grab_group_home", {}));
      } else if (this.goods_type == "supplierGoods") {
        let url = "";
        // 区分供应商样式一和二跳转
        if (this.goods_info.get_goods.supplier.aggregate) {
          url = "SupplierShop2";
        } else {
          url = "SupplierShop";
        }
        this.$router.push(
          this.fun.getUrl(url, {
            id: this.supplierDataId,
            fromHome: 1
          })
        );
      } else {
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },
    gotoOrder() {
      this.$router.push(this.fun.getUrl("zhpMyGroups", {}));
    },

    zhpGroupOrder() {
      // 珍惠拼参团
      let _json = {
        tag: "zhpGroup",
        goodsId: this.goods_info.goods_id,
        activity_id: this.$route.params.id,
        optionsId: optionsId,
        total: this.goodsCount
      };
      this.$router.push(this.fun.getUrl("goodsorder", {}, _json));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle {
  #foot {
    width: 375px !important;
  }
}
.posDiv {
  width: 100%;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  height: 3.13rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0rem -0.06rem 0.22rem 0rem rgba(185, 185, 185, 0.45);
  padding: 0.53rem 0.94rem 0.53rem 0.88rem;
  .posDiv_none {
    color: #9c9c9c;
  }
  .leftBox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.75rem;
    color: #3e3e3e;
  }
  .RightBox {
    padding: 0.3rem 1.84rem;
    border-radius: 1.8rem;
    box-sizing: border-box;
    height: 2.56rem;
    background-color: #f42a26;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    font-size: 0.69rem;
  }
}
#foot {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 0 solid #e2e2e2;
  z-index: 2;
  padding: 0;
  height: 3.0625rem;
  display: flex;
  align-items: center;
  background: #fff;

  .cservice {
    height: 3.0625rem;
    text-align: center;
    flex: 2;
    font-size: 12px;

    a {
      height: 3.0625rem;
      text-align: center;
      display: block;
      color: #333;

      i {
        display: block;
        font-size: 18px;
        margin: 0.25rem 0;
        color: #48a3f1;
      }
    }
  }

  .addfav {
    border-top: solid 0.0625rem #ebebeb;
    color: #666;
    height: 3.0625rem;
    text-align: center;
    flex: 1.5;
    font-size: 12px;

    i.normal {
      font-size: 1.375rem;
      color: #666;
    }

    i.active {
      font-size: 1.375rem;
      color: #f7ba2a;
    }

    i {
      color: #666;
      font-size: 1.375rem;
    }

    i.icon-goods_car {
      color: #666;
    }

    span {
      display: inline-block;
      width: 100%;
      margin-top: 0.25rem;
      color: #333;
    }

    li {
      color: #666;
    }
  }

  .addfav.nocar {
    background: #fff;
  }

  .cart.cell {
    background: #ff9500;
    height: 3.0625rem;
    text-align: center;
    border: none;
    color: #fff;
    flex: 3;
    font-size: 15px;
    line-height: 3.0625rem;
  }

  .cart.cell.nocar {
    background: #ccc;
  }

  .buy.cell {
    background: #dd2727;
    height: 3.0625rem;
    text-align: center;
    border: none;
    color: #fff;
    flex: 3;
    font-size: 15px;
    line-height: 3.0625rem;
  }

  .buy.cell.nocar {
    background: #ccc;
  }

  .cart-btn .time {
    background: #dd2727;
    height: 3.0625rem;
    text-align: center;
    border: none;
    color: #fff;
    font-size: 14px;
    line-height: 3.0625rem;
  }
}

.group_btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.125rem;
  background: #fff;
  border-top: solid 0.0625rem #ebebeb;

  .item {
    height: 3.125rem;
    display: flex;

    .item_a {
      width: 3.75rem;
      padding: 0.1875rem 0;

      .iconfont {
        color: #666;
        font-size: 1.5rem;
      }

      span {
        color: #666;
        font-size: 12px;
        display: block;
      }
    }

    .item_b {
      width: 9.8438rem;
      padding: 0.1875rem 0;
      background: rgba(241, 83, 83, 0.6);
      color: #fff;
      font-size: 14px;

      span {
        display: block;
      }

      font {
        font-size: 18px;
      }
    }

    .item_c {
      // width: 9.8438rem;
      padding: 0.1875rem 0;
      background: #f15353;
      color: #fff;
      font-size: 14px;
      flex: 1;

      span {
        display: block;
      }

      font {
        font-size: 18px;
      }
    }

    .endClass {
      background: #c9c9c9 !important;
    }
  }
}
</style>
