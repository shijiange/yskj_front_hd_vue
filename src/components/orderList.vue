<template>
  <div>
    <div id="orderList" :class="fun.getPhoneEnv() == 3 ? 'pcStyle' : ''">
      <van-checkbox-group v-model="checkList" @change="multiplePayChange">
        <div v-for="(order, index) in datasource" :class="orderType == 'lease_toy' && index == datasource.length - 1 ? 'Margintop shop' : 'shop'" :key="index">
          <div class="title">
            <van-checkbox checked-color="#f15353" :name="order.id" v-if="status == 1 && consolidated">&nbsp;</van-checkbox>
            <h4 style="display: flex; word-break: keep-all;align-items:center;">
              <div style="line-height: 1.6;">订单号：{{ order.order_sn }}</div>
              <div style="text-align: left; margin-left: 5px; align-self: center;" v-if="order.dispatch_type_name">
                <div class="tags">{{ order.dispatch_type_name }}</div>
              </div>
            </h4>
            <div class="span" v-if="orderType != 'stock'">
              <span v-if="order.is_pending == 1">{{ order.status_name.slice(0, -4) }}</span>
              <span v-else>{{ order.status_name }}</span>
              <span style="font-size:12px;margin-top:-4px;" v-if="order.is_pending == 1">(锁定)</span>
            </div>
          </div>
          <div
            class="shop-box"
            @click="toStore(order)"
            v-if="
              order.shop_name &&
                (order.plugin_id == 0 || order.plugin_id == 92 || order.plugin_id == 31 || order.plugin_id == 32 || order.plugin_id == 44 || order.plugin_id == 54 || order.plugin_id == 108)
            "
          >
            <div class="shop-box-left">
              <i class="iconfont icon-fontclass-dianpu"></i>
              <p>{{ order.overseas ? (order.overseas_shop ? order.overseas_shop.name : '海外购') : order.shop_name }}</p>
            </div>
            <i class="iconfont icon-advertise-next"></i>
          </div>
	  <!--商品详情信息（图片 名称 数量 价格）展示 （循环 可能一个订单购买多个商品）-->
          <div @click="toOrderDetail(order)" v-for="(goods, i) in order.has_many_order_goods" v-if="goods.is_gift <= 0" :key="i">
            <div class="goods">
              <div class="img"><img :src="goods.thumb" /></div>
              <div class="warp">
                <div class="inner">
                  <div class="name" v-if="!order.deposit_ladder" style="-webkit-box-orient: vertical;">{{ goods.title | escapeTitle }}</div>
                  <!-- 添加海外标签 -->
                  <div>
                    <overseastag :visible="order.overseas" class="details"/>
                  </div>
                  <div class="name" v-if="order.deposit_ladder" style="-webkit-box-orient: vertical;"><!--判断定金活动尾款-->{{ order.deposit_ladder.activity_name | escapeTitle }}</div>
                  <div class="option">
                    <p v-if="goods.goods_option_title" style="margin-right: 5px;">规格: {{ goods.goods_option_title }}</p>
                    <div class="num" v-if="detailUrl != 'HotelOrderDetail'">×{{ goods.total }}</div>
                    <div class="num" v-if="detailUrl == 'HotelOrderDetail'">{{ getDays(order.hotel_order.enter_at, order.hotel_order.leave_at) }}晚{{ goods.total }}间</div>
                  </div>
                  <div class="reserveClass" v-if="order.store_reserve">预约日期：{{ order.store_reserve }}</div>
                </div>
              </div>
              <div class="price">
                <div class="money">
                  <span class="deposit-tips" v-if="order.plugin_id == 108"><!--判断定金活动-->定金</span>
                  <span class="deposit-tips" v-if="order.deposit_ladder"><!--判断定金活动尾款-->尾款</span>
                  <small>{{ $i18n.t("money") }}</small>
                  {{ orderType == "lease_toy" ? goods.price / order.has_one_lease_toy_order.return_days / goods.total : goods.price }}
                  <span v-if="order.plugin_id == 40 ? true : false">/天</span>
                  <div v-if="vip_show && Number(goods.vip_price) > 0" class="vipPirce">
                    会员价:
                    <small>{{ $i18n.t("money") }}</small>
                    {{ goods.vip_price }}
                  </div>
                </div>
              </div>
              <div class="comment-box">
                <div v-for="(btn, index) in goods.buttons" :key="index" class="comment-btn" :class="{ 'color-btn': btn.value == 2 }" @click.stop="evaluateOpration(btn, goods, order)">
                  {{ btn.name }}
                </div>
              </div>
            </div>
          </div>
          <!-- 赠品品显示 -->
          <gift from="orderList" @click.native="toOrderDetail(order)"  v-for="(goods, i) in order.has_many_order_goods" :key="i"  v-if="goods.is_gift" :goods_id="goods.goods_id"  :goods_thumb="goods.thumb" :goods_title="goods.title" :price="goods.goods_price" :total="goods.total" :labels="[goods.marketing_order_goods.gift_type == 4 ? '换购' : '赠品']"></gift>
          <div style="text-align: left;padding-left: 0.625rem;color:#f15353" v-if="order.plugin_id == 40 ? true : false">
            <span style="color:#909090">租赁到期日期:</span>
            {{ order.has_one_lease_toy_order.end_time }}
          </div>
          <div class="address-box" v-if="order.address && order.address.address">
            <template v-if="order.plugin_id == 130">
              <p>{{ order.reserve_simple.customer_name }} （{{ order.reserve_simple.customer_tel }}）</p>
              <p>预约时间：{{ order.reserve_simple ? order.reserve_simple.begin_time : "" }}</p>
            </template>
            <template v-else>
              <p>{{ order.address.realname }} （{{ order.address.mobile }}）</p>
              <p>{{ order.address.address }}</p>
            </template>
          </div>
          <div class="title">
            <h4 style="text-align: right;">
              共 {{ order.goods_total }}
              {{ detailUrl == "HotelOrderDetail" ? "个房间" : "件商品" }}
              实付：{{ $i18n.t("money") }}
              <b>{{ order.price }}</b>
            </h4>
          </div>

          <div class="exchange_order_box" v-if="order.ys_exchange_order_id" @click="toOrderDetail({ id: order.ys_exchange_order_id })">
            <div>{{ order.status == 3 ? "已换货" : "换货中" }}，点击查看原订单</div>
            <i class="iconfont icon-advertise-next"></i>
          </div>

          <div class="allbt" v-if="order.button_models.length > 0 && orderType != 'stock'">
	        <!--查看发票和申请发票按钮，需要根据后台反馈的数据，进行显示-->

            <span  @click="applyInvice(order)" v-if="order.invoiceState == 0 && !order.overseas">申请发票</span>
            <span  @click="toInvice(order)"  v-if="order.invoiceState == 1 || order.invoiceState == 2 || order.invoiceState == 3">查看发票</span>
            <!--卡券信息不能在更多里显示  前端判断 卡券类型为2  待收货 和已完成才显示-->
            <span class="red-button" v-if="(order.status == 2 || order.status == 3) && order.camilo_resources_coupon_type == 2" @click.stop="operation({ value: 140, api: '1' }, order)">卡券信息</span>
            <template v-for="(item, i) in order.button_models">
              <!--只有一个的情况-->
              <span :key="i" v-if="i < 1" @click="operation(item, order, order.barter)" :class="[!item.api ? 'noClickBG' : '', [1,'overseas'].includes(item.value) ? 'red-button' : '']">{{ item.name }}</span>
              <!--只有两个的情况-->
              <span
                :key="i"
                v-if="i == 1 && order.button_models.length == 2"
                @click="operation(item, order, order.barter)"
                :class="[!item.api ? 'noClickBG' : '', item.value == 1 ? 'red-button' : '']"
                >{{ item.name }}</span
              >
              <!--两个以上的情况-->
              <span :key="i" v-if="i == 1 && order.button_models.length > 2   && item.value!==50" class="red-button" @click.stop="showMore(order.order_sn)">更多</span>
              <div class="trans" :key="i" v-if="i == 1 && showID == order.order_sn && order.button_models && order.button_models.length > 2"></div>
              <div class="more-button" :key="i" v-if="i == 1 && showID == order.order_sn && order.button_models && order.button_models.length > 2">
                <p v-for="(item, i) in order.button_models" :key="i" v-if="i >= 1  && item.value!==50" @click="operation(item, order, order.barter)" :class="[!item.api ? 'noClickBG' : '']">{{ item.name }}</p>
              </div>
            </template>
          </div>
          <!-- 存货订单 -->
          <div class="allbtStock" v-if="orderType == 'stock'">
            <div class="leftTime">{{ order.inventory_time }}</div>
            <div class="rightAll">
              <template v-for="(item, i) in order.button_models">
                <span :key="i" v-if="item.value == 'inventory_cancel'" @click="operation(item, order, order.barter)" :class="[!item.api ? 'noClickBG' : '', item.value == 1 ? 'red-button' : '']">{{
                  item.name
                }}</span>
              </template>
            </div>
          </div>
        </div>
      </van-checkbox-group>

      <div class="qrcode">
        <van-popup v-model="showQrcode" position="right" modal="false">
          <div>
            <img :src="qrcode" style="width: 100%;" />
            <div style="height: 1.875rem;">请核销员扫码</div>
          </div>
        </van-popup>
      </div>

      <van-dialog @touchmove.native="stopmove" @mousemove.native="stopmove" v-model="dialogVisible" :showConfirmButton="false">
        <div class="title">确认发货</div>
        <template v-if="orderType != 'storeMang'">
          <van-tabs v-model="activeName">
            <van-tab name="first" title="快递配送"></van-tab>
            <van-tab name="second" v-if="isShowDri" title="司机配送"></van-tab>
          </van-tabs>
        </template>
        <div>
          <div v-show="activeName == 'first'">
            <section style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;">
              <div style="width: 100%;" v-if="addresseeInfo && jurisdiction_set != 1">
                <div class="addressee">收件人信息:</div>
                <div>
                  <div class="user_name">
                    <span>{{ addresseeInfo.realname }}</span>
                    <span>({{ addresseeInfo.mobile }})</span>
                  </div>
                  <div class="user_city">{{ addresseeInfo.address }}</div>
                </div>
              </div>
              <div class="select_company">
                <div style="font-weight: bold; font-size: 15px;">快递公司:</div>
                <div class="company_right">
                  <van-button plain type="primary" @click="seleRegional">{{ regional }}</van-button>
                </div>
              </div>
              <div class="input_number">
                <div style="font-weight: bold; font-size: 15px;">快递单号:</div>
                <div class="number_right">
                  <van-cell-group>
                    <van-field v-model="numberName" placeholder="请输入快递单号" />
                  </van-cell-group>
                </div>
              </div>
            </section>
          </div>
          <div v-show="activeName == 'second'">
            <section style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;">
              <div style="width: 100%;" v-if="addresseeInfo">
                <div class="addressee">收件人信息:</div>
                <div>
                  <div class="user_name">
                    <span>{{ addresseeInfo.realname }}</span>
                    <span>({{ addresseeInfo.mobile }})</span>
                  </div>
                  <div class="user_city">{{ addresseeInfo.address }}</div>
                </div>
              </div>
              <div class="select_company" style="justify-content: flex-start;">
                <div style="font-weight: bold; font-size: 15px; width: 5rem;">配送司机:</div>
                <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                  <van-button style="text-align: left;" plain type="primary" @click="driverSeleRegional">{{ driverRegional }}</van-button>
                </div>
              </div>
              <div class="select_company" style="justify-content: flex-start;">
                <div style="font-weight: bold; font-size: 15px; width: 5rem;">车牌号:</div>
                <div class="company_right" style="text-align: left; margin-left: 0.5rem;">{{ driverNumber }}</div>
              </div>
            </section>
          </div>
        </div>
        <div class="store_foot">
          <van-button type="default" class="btn_a" @click="sendCancel">取 消</van-button>
          <van-button type="primary" class="btn_b" @click="sendGoogs">确 定</van-button>
        </div>
      </van-dialog>
      <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
        <van-search class="express-select-search" placeholder="请输入快递公司名称" clearable v-model="inputExpressCompanyName" v-show="columns.length > 0"></van-search>
        <van-picker @touchmove.native="stoppao" @mousemove.native="stoppao" :columns="filterExpressCompanys" @change="onChange" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar></van-picker>
      </van-popup>
      <van-popup v-model="driverDateshow_1" position="bottom" :overlay="true">
        <van-picker @touchmove.native="stoppao" @mousemove.native="stoppao" :columns="driverColumns" @change="onDriverChange" @cancel="onDriverCancelbtn" @confirm="onDriverConfirmbtn" show-toolbar />
      </van-popup>
      <!-- 配送站的确认核销按钮 -->
      <van-popup v-model="showWriteOff" position="center" :overlay="true" round>
        <img :src="writeOffQR" style="width: 11.25rem; height: 11.25rem; margin: 1rem;" />
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 1rem; color: #f15353;">
          请核销员扫码
        </div>
      </van-popup>
      <div class="blank" v-if="datasource.length <= 0 && !isDefault">
        <img src="../assets/images/blank.png" />
        <span>还没有订单记录哦</span>
      </div>
      <van-dialog v-model="showBarter" title="易货兑换" show-cancel-button class="barter_dialog" @confirm="confirmBarter" @cancel="cancelBarter">
        <div class="barter_dialog_1">是否确认易货兑换</div>
        <div class="barter_dialog_2">该商品可兑换易货值为{{ showBarter_value }}</div>
      </van-dialog>

      <van-overlay :show="blindBoxInfo.show" z-index="99">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-fade">
            <div class="blindBoxInfo" v-if="blindBoxInfo.show">
              <div class="multipleWrapper">
                <div class="desc">盲盒商品</div>
                <div class="goodsWrapper" @touchmove.stop>
                  <router-link
                    :to="
                      fun.getUrl(detailUrl == 'HotelOrderDetail' ? 'HotelOrderDetail' : detailUrl, {
                        order_id: item.id,
                        orderType: orderType
                      })
                    "
                    v-for="item in blindBoxInfo.goods"
                    :key="item.id"
                  >
                    <div class="goodsItem">
                      <div class="goodInfo">
                        <div class="c1">{{ item.order_sn }}</div>
                        <div class="c2">{{ item.status_name }}</div>
                      </div>
                      <div class="goodContent" v-for="item1 in item.has_many_order_goods" :key="item1.id">
                        <div class="goods_img">
                          <img :src="item1.thumb" alt="" />
                        </div>
                        <div class="content">
                          <div class="name">{{ item1.title }}</div>
                          <div class="price">{{ item1.goods_option_title }}</div>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>

              <div class="close">
                <i class="iconfont icon-adsystem_icon_cancle" @click="blindBoxInfo.show = false"></i>
              </div>
            </div>
          </transition>
        </div>
      </van-overlay>

      <van-popup v-model="refundShow" position="bottom" round closeable :style="{ height: '50%' }">
        <div class="refundShow-box">
          <div class="popup-title">关闭原因</div>
          <div class="popup-context">{{ refundText }}</div>
        </div>
      </van-popup>

      <!--S 申请存货的dialog -->
      <van-dialog v-model="inventoryApplyPopup" class="inventory-apply-popup" title="请选择" show-cancel-button @confirm="confirmInventoryApply">
        <van-radio-group v-model="inventoryApplyRadio">
          <van-radio :name="item.id" v-for="item in inventoryApplyList" :key="item.id" checked-color="#ee0a24">{{ item.name }}</van-radio>
        </van-radio-group>
      </van-dialog>
      <!--E 申请存货的dialog -->
    </div>
    <div @touchstart.stop @touchmove.stop>
      <van-dialog v-model="custom_receipt_confirmation_show" :lock-scroll="true" :title="custom_receipt_confirmation_btn.name" show-cancel-button @confirm="CustomReceiptConfirmationSend">
        <div v-html="custom_receipt_confirmation_html" class="custom_receipt_confirmation_html"></div>
      </van-dialog>
    </div>
    <div class="yz_addressList"></div>
    <!-- 快递地址选择器 -->
    <yzAddressList v-model="showAddress" v-on:confirm="confirmSelectAddress" :options="yzAddressListOptions"></yzAddressList>
    <!-- 快递地址选择器 end -->
  </div>
</template>
<script>
import { Toast, Search } from "vant";
import overseastag from "./overseas/tag.vue";
import yzAddressList from "./ui_components/yz_addressList/index.vue";
import labels from "components/goods/labels";
import gift from "components/goods/gift";
export default {
  //select_inde-当前选择行,datasource-数据源,currentdata-当前选择的数据
  //isDefault 判读是否用当前的空样式isDefault为false或者不传则显示
  props: ["datasource", "status", "getAllLoaded", "orderType", "detailUrl", "custom_receipt_confirmation_html", "isDefault"],
  data() {
    return {
      showAddress: false,
      modifyAddressOrderId: 0,
      yzAddressListOptions: {}, //地址组件配置信息（可选）
      regional: "请选择快递公司",
      dateshow_1: false,
      columns: [],
      isShow: false,
      toi: this.fun.getKeyByI(),
      checkList: [],
      loading: false,
      allLoaded: false,
      goload: true,
      qrcode: "",
      showQrcode: false,
      //确认发货
      dialogVisible: false,
      expressName: "",
      numberName: "",
      addresseeInfo: "",
      options: [],
      orderPayId: "",
      showWriteOff: false,
      writeOffQR: "", //配送站订单确认核销 按钮展示的二维码
      //   actions:[],
      //   sheetVisible:''
      //司机配送确认发货
      isShowDri: false, //确认按钮是否显示司机配送
      driverDialogVisible: false,
      driverId: "",
      driverOptions: [],
      driverColumns: [],
      driverRegional: "请选择配送司机",
      driverDateshow_1: false,
      driverApi: "",
      driverNumber: "",
      activeName: "first",
      jurisdiction_set: "", //供应商订单是否显示会员信息
      showBarter: false,
      showBarter_value: null,
      noMoreClick: false, //防止快速点击重复触发

      showID: "",

      blindBoxInfo: {
        show: false,
        goods: []
        //盲盒相关数据
      },
      filterExpressCompanys: [],
      inputExpressCompanyName: "",

      refundShow: false, //退款原因
      refundText: "",
      consolidated: "",

      custom_receipt_confirmation_show: false, //自定义确认收货弹窗
      custom_receipt_confirmation_btn: {}, //自定义确认收货弹窗按钮
      custom_receipt_confirmation_item: {}, //自定义确认收货弹窗item

      //S 申请存货弹窗
      inventoryApplyPopup: false, //存货申请弹窗
      inventoryApplyList: [], //仓库列表
      inventoryApplyRadio: null,
      //E 申请存货弹窗
      vip_show: JSON.parse(window.localStorage.getItem("globalParameter")).vip_show ? JSON.parse(window.localStorage.getItem("globalParameter")).vip_show : false,
      giftFrom: 'orderList',
    };
  },
  mounted() {
    console.log(this.consolidated);
    // console.log(this.orderType, "参数", this.datasource);
  },
  methods: {

    //查看发票
    toInvice(order){
      this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    },
    //申请发票
    applyInvice(order){
      this.$router.push(this.fun.getUrl("ApplyInvoice", { order_id: order.id }));
    },
    toStore(order) {
      if (order.plugin_id == 92) {
        this.$router.push(this.fun.getUrl("SupplierShop", { id: order.id, fromHome: 1 }, { fromOrder: 1 }));
      } else if (order.plugin_id == 31 || order.plugin_id == 32) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: order.id, fromHome: 1 }, { fromOrder: 1 }));
      } else if (order.plugin_id == 54 && order.has_one_team_member.store_id) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: order.has_one_team_member.store_id, fromHome: 1 }));
      } else if (order.plugin_id == 0) {
        this.$router.push(this.fun.getUrl("home"));
      }
    },
    showMore(order_sn) {
      if (this.showID == order_sn) {
        this.showID = "";
      } else {
        this.showID = order_sn;
      }
    },
    setCheckList() {
      this.checkList = [];
    },
    operation(btn, order, barter) {
      // btn = {name: "确认发货", value: 24, api: "plugin.supplier.frontend.order.cancel-send"};
      if (!btn.api) {
        if (btn.value == "expediting_delivery") {
          Toast("已提醒过商家");
        }
        return;
      }
     // console.log(btn.value);
      this.orderPayId = order.id;
      if (btn.value == 8 || btn.value == "snatch_regiment_express") {
        this.checklogistics(order, btn);
      } else if (btn.value == 51) {
        // 查看卡券
        this.$router.push(this.fun.getUrl("cpsPwd", { order_id: order.id }));
      } else if (btn.value == 12) {
        this.deleteOrder(order, btn);
      } else if (btn.value == 10) {
        this.comment(order, btn);
      } else if (btn.value == 1 || btn.value == "snatch_regiment_pay") {
        //console.log('支付按钮');
        zhuge.track('我的订单-点击支付按钮',{
          '订单号':order.order_sn,
          '订单实付金额':order.price,
          '商品数量':order.goods_total
        });
        this.toPay(order, btn);
      } else if (btn.value == 1 || btn.value == "overseas") {
        this.toOrderDetail(order);
      } else if (btn.value == 13 || btn.value == 54 || btn.value == "snatch_regiment_refund") {
        //退款
        this.toRefund(order, btn);
      } else if (btn.value == 101) {
        this.applyRefund(order, btn);
      } else if (btn.value == 9) {
        //取消订单
        zhuge.track('我的订单-点击取消订单按钮',{
          '订单号':order.order_sn,
          '订单实付金额':order.price,
          '商品数量':order.goods_total
        });
        this.cancleOrder(order, btn);
      } else if (btn.value == 5) {
        //确认订单
        this.confirmOrder(order, btn);
      } else if (btn.value == 99) {
        this.confirmOrder_dragon(order, btn);
      } else if (btn.value == 18) {
        //退款中
        this.toRefundDetail(order, btn);
      } else if (btn.value == 56) {
        // console.log('ddd');
        //退款中
        //  this.toRefund(order, btn);
        this.$router.push(this.fun.getUrl("MyProject"));
      } else if (btn.value == "cashierPay") {
        //更多
        this.cashPayOrder(order, btn);
      } else if (btn.value == "verification_code") {
        this.verification(order, btn);
      } else if (btn.value == 20) {
        this.verificationCash(order, btn);
      } else if (btn.value == 21) {
        // console.log('转账信息',order);
        this.$router.push(
          this.fun.getUrl("OrderRecord", {
            order_id: order.id
          })
        );
      } else if (btn.value == 22 || btn.value === "delivery_station_pay" || btn.value === "service_station_pay") {
        // 确认支付
        this.publicMessage(order, btn, "支付");
      } else if (btn.value == 23 || btn.value == 60) {
        // 确认发货
        if (order.dispatch_type_id == 3) {
          this.sendGoogs();
        } else {
          this.getCompany();
          this.dialogVisible = true;
        }
        this.expressName = "";
        this.numberName = "";
        if (JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1" && (this.orderType == "supplier" || this.orderType == "store")) {
          this.isShowDri = true;
          this.driverId = "";
          this.driverNumber = "";
          this.driverRegional = "请选择配送司机";
          this.driverApi = btn.api;
          this.supplierDriverSend();
          // this.driverDialogVisible = true;
        }
      } else if (btn.value == 24 || btn.value == 61 || btn.value === "service_station_cancel_send") {
        //取消发货
        this.publicMessage(order, btn, "取消发货");
      } else if (btn.value == 25 || btn.value === "delivery_station_complete" || btn.value === "service_station_complete") {
        //确认收货
        this.publicMessage(order, btn, "收货");
      } else if (btn.value == 26 || btn.value === "delivery_station_close" || btn.value === "service_station_close") {
        //关闭订单
        this.publicMessage(order, btn, "关闭");
      } else if (btn.value == 30) {
        //退款关闭订单
        this.publicMessage(order, btn, "退款关闭订单");
      } else if (btn.value == 27) {
        this.evaluate(order, btn);
      } else if (btn.value == 28) {
        //卡密
        this.truckList(btn, order);
      } else if (btn.value == 41) {
        //398售后
        window.location.href = btn.api;


      }else if (btn.value == 11) {
       //酒店确认下单
        this.confirmHotelOrder(btn.api, order.id);
      } else if (btn.value == "coupon") {
        //分享优惠券
        this.$router.push(this.fun.getUrl("couponShare", { order_id: order.id }));
      } else if (btn.value === "check_out") {
        this.publicMessage(order, btn, "退房");
      } else if (
        btn.value === "clerk_code" ||
        btn.value === "package_deliver" ||
        btn.value == "reserve_simple" ||
        btn.value == "package_delivery_confirm_code" ||
        btn.value === "store_package_deliver"
      ) {
        //确认核销
        this.confirmWriteOff(order, btn);
      } else if (btn.value === "service_station_send") {
        //服务站的确认发货
        this.getCompany();
        this.dialogVisible = true;
        this.expressName = "";
        this.numberName = "";
      } else if (btn.value == "lease_toy_refund" || btn.value == "package_deliver_clerk") {
        // 申请退还
        this.getReturn(btn, order);
      } else if (btn.value == "lease_toy_apply_adopt") {
        // 填写归还
        console.log("填写归还啊啊啊啊");
        this.$router.push(this.fun.getUrl("OrderReturn", { id: order.id }));
      } else if (btn.value == "lease_toy_return_info") {
        // 归还详情
        this.$router.push(this.fun.getUrl("orderruturninfo", { id: order.id }));
      } else if (btn.value == "hotel_supply") {
        this.$router.push(this.fun.getUrl("hotelOrder", { id: order.id }));
      } else if (btn.value == "expediting_delivery") {
        this.publicMessage(order, btn, "提醒商家发货");
      } else if (btn.value == "snatch_regiment_barter") {
        // 抢团易货兑换
        this.showBarter = true;
        this.showBarter_value = barter;
      } else if (btn.value == 53) {
        this.getBlindBoxGoods(order.id);
      } else if (btn.value == "close_reason") {
        this.refundShow = true;
        this.refundText = order.close_reason;
      } else if (btn.value == 140) {
        // 卡券信息
        this.$router.push(this.fun.getUrl("cardVoucherInfo", { order_id: order.id }));
      } else if (btn.value == "inventory_cancel") {
        this.publicMessage(order, btn, "发货");
      } else if (btn.value == "inventory_apply") {
        this.getWarehouseList_CH(); //获取仓库列表(申请存货)
      } else if (btn.value == "city_delivery_detail") {
        this.$router.push(this.fun.getUrl("orderLogisticsDetails", {}, { id: order.id }));
      } else if (btn.value == "apply_invoice") {
        this.invoicing(order);
      } else if (btn.value == "modify_address"){
        this.showAddressFun(order);
      }else {
        this.publicMessage(order, btn, "");
      }
    },
    invoicing(order) {
      this.$emit("apply_invoice", order);
    },
    confirmBarter() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.order.barter", { order_id: that.orderPayId }).then(
        function(response) {
          if (response.result == 1) {
            that.$notify({
              background: "#f0f9eb",
              message: `易货兑换成功`,
              color: "#67c23a"
            });
            that.$emit("ConfrimOrderNotification", "pay");
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    cancelBarter() {
      this.showBarter = false;
      this.showBarter_value = null;
    },
    //司机配送确认发货
    supplierDriverSend() {
      var that = this;
      var urls = "plugin.delivery-driver.home.delivery-info.get-driver-list";
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, {}).then(
        function(response) {
          console.log("oo++3", response);
          that.noMoreClick = false;
          if (response.result == 1) {
            that.driverOptions = [];
            that.driverOptions = response.data;
            var arrayOfSquares = that.driverOptions.map(function(item) {
              return item.driver_name + "(" + item.user_phone + ")";
            });
            that.driverColumns = arrayOfSquares;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    /*以下四个都是下拉司机配送选择相关方法*/
    driverSeleRegional: function() {
      this.driverDateshow_1 = true;
    },
    onDriverChange(picker, value, index) {},
    onDriverCancelbtn: function(val, index) {
      this.driverDateshow_1 = false;
    },
    onDriverConfirmbtn: function(val, index) {
      var array = this.driverOptions;
      this.driverDateshow_1 = false;
      this.driverRegional = val;
      this.driverNumber = array[index].license_number;
      this.driverId = array[index].id;
    },
    //司机配送确认发货取消
    driverSendCancel() {
      this.driverDialogVisible = false;
    },
    //查看发票
    //checkInvoice(btn, order) {
      //this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    //},
    //卡密
    truckList(btn, order) {
      this.$router.push(this.fun.getUrl("TruckList", { order_id: order.id }));
    },
    // 评价
    evaluate(order, btn) {
      this.$router.push(
        this.fun.getUrl("DeliveryEvaluate", {
          order_id: order.id,
          api: btn.api,
          name: "distributor"
        })
      );
    },
    // 申请归还的操作
    getReturn(btn, order) {
      let that = this;
      if (this.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(btn.api, { order_id: order.id }).then(res => {
        that.noMoreClick = false;
        if (res.result == 1) {
          that.$dialog.alert({ message: res.msg });

          that.$emit("ConfrimOrderNotification");
        } else {
          that.$dialog.alert({ message: res.msg });
        }
      });
    },

    publicMessage(order, btn, text) {
      let _text = text || "";
      if (!btn.api) {
        return;
      }
      this.$dialog
        .confirm({ message: `确定${_text}?` })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = btn.api || "";
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http.get(urls, json).then(
            function(response) {
              that.noMoreClick = false;
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                if (btn.value == "inventory_cancel") {
                  that.$dialog
                    .confirm({
                      message: `申请成功,请到待发货列表查询此订单`
                    })
                    .then(() => {})
                    .catch(() => {});
                } else if (btn.value == "inventory_apply") {
                  // Toast('存货成功请到存货列表查询此订单');
                  that.$dialog
                    .confirm({
                      message: `存货成功,请到存货列表查询此订单`
                    })
                    .then(() => {})
                    .catch(() => {});
                } else {
                  that.$notify({
                    background: "#f0f9eb",
                    message: `${_text}成功`,
                    color: "#67c23a"
                  });
                }
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              that.noMoreClick = false;
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },

    confirmWriteOff(order, btn) {
      var that = this;
      let url = "";
      let json = {};
      if (btn.value == "clerk_code") {
        url = "plugin.delivery-station.frontend.order.detail.qr-code-url";
        json = { order_id: order.id };
      } else if (btn.value == "package_deliver") {
        url = btn.api;
        json = { order_id: order.id };
      } else if (btn.value == "reserve_simple") {
        url = btn.api;
        json = { id: order.id };
      } else {
        url = btn.api;
        json = { order_id: order.id };
      }
      $http.get(url, json, "正在获取核销码").then(
        function(response) {
          if (response.result == 1) {
            if (btn.value == "clerk_code") {
              that.writeOffQR = response.data.qrcode_url;
            } else if (btn.value == "package_deliver" || btn.value == "reserve_simple") {
              that.writeOffQR = response.data.qr_code_url;
            } else {
              that.writeOffQR = response.data.qr_code_url;
            }
            that.showWriteOff = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取快递公司
    getCompany(btn) {
      let that = this;
      let urls = "";
      if (this.orderType == "supplier") {
        urls = "plugin.supplier.frontend.order.express-company";
      } else if (this.orderType == "serviceReplenish") {
        urls = "plugin.service-station.frontend.order-list.express";
      } else if (this.orderType == "auction") {
        urls = "plugin.auction.api.sendOrder";
      } else if (this.orderType == "auctioneer") {
        urls = "plugin.auction.api.sendOrder";
      } else if (this.orderType == "subsidiary") {
        urls = "plugin.subsidiary.frontend.order.express-company";
      } else if (this.orderType == "storeMang") {
        urls = "plugin.shop-assistant.frontend.order.expressCompanies";
      } else {
        urls = "plugin.store-cashier.frontend.store.center.sendOrder";
      }
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, { order_id: that.orderPayId }).then(
        function(response) {
          console.log("oo++3", response);
          that.noMoreClick = false;
          if (response.result == 1) {
            if (that.orderType == "supplier") {
              that.jurisdiction_set = response.data.jurisdiction_set;
            }
            that.options = [];
            that.options = response.data.express_companies;
            let arr = that.options;
            if (that.options && !(that.options instanceof Array)) {
              arr = Object.values(that.options);
            }
            let arrayOfSquares = arr.map(function(item) {
              return item.name;
            });
            that.columns = arrayOfSquares;
            that.filterExpressCompanys = arrayOfSquares;
            that.addresseeInfo = response.data.address;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    //快递公司选择监听
    selectCompany(value) {
      console.log(value, this.expressName);
    },
    //确认发货取消
    sendCancel() {
      this.dialogVisible = false;
    },
    //确认发货
    sendGoogs() {
      var that = this;
      // if (that.expressName == "" && that.numberName == "") {
      //   that.$notify("请选择快递公司和输入快递单号");
      //   return;
      // } else if (that.expressName == "") {
      //   that.$notify("请选择快递公司");
      //   return;
      // } else if (that.numberName == "") {
      //   that.$notify("请输入快递单号");
      //   return;
      // }
      let json = {};
      if (this.isShowDri && that.activeName == "second") {
        json.order_id = that.orderPayId;
        json.dispatch_type_id = 7;
        json.driver_id = that.driverId;
      } else {
        json.order_id = that.orderPayId;
        json.express_code = that.expressName.value;
        json.express_company_name = that.expressName.name;
        json.express_sn = that.numberName;
      }
      let _urls = "";
      if (this.orderType == "supplier") {
        _urls = "plugin.supplier.frontend.order.send";
      } else if (this.orderType == "serviceReplenish") {
        _urls = "plugin.service-station.frontend.order.order-operation.send";
      } else if (this.orderType == "subsidiary") {
        _urls = "plugin.subsidiary.frontend.order.send";
      } else if (this.orderType == "auction") {
        _urls = "plugin.auction.api.order-operation.send";
      } else if (this.orderType == "auctioneer") {
        _urls = "plugin.auction.api.order-operation.send";
      } else if (this.orderType == "storeMang") {
        _urls = "plugin.shop-assistant.frontend.order.send";
      } else {
        _urls = "plugin.store-cashier.frontend.store.center.order-operation.send";
      }

      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(_urls, json).then(
        function(response) {
          that.noMoreClick = false;
          if (response.result == 1) {
            that.dialogVisible = false;
            that.$emit("ConfrimOrderNotification", "pay");
            that.$notify({
              background: "#f0f9eb",
              message: "发货成功",
              color: "#67c23a"
            });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    //多订单合并支付的响应方法
    multiplePayChange(value) {
      this.$emit("MultiplePayNotification", this.checkList);
    },
    toDetail(order) {
      this.$emit("ToDetailNotification", order);
    },

    //查看物流
    checklogistics(item, btn) {
      //回放轨迹
      console.log(JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open);

      if (item.dispatch_type_id == 7 && JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1") {
        this.$router.push(
          this.fun.getUrl("track", {
            id: item.id
          })
        );
      }
      if (item.is_all_send_goods == 0) {
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
        );
      } else {
        //跳转多包裹路由
        // item.is_all_send_goods == 1 || item.is_all_send_goods == 2
        this.$router.push(
          this.fun.getUrl(
            "multiplePackages",
            {
              order_id: item.id //传送订单id到多包裹页面
            },
            { api: btn.api }
          )
        );
      }
    },
    cashPayOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定此订单已付款?" })
        .then(() => {
          // this.datasource.splice(this.datasource.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id,
              order_pay_id: this.order_pay_id
            },
            false
          );
        })
        .catch(() => {});
    },
    verification(item, btn) {
      this.$router.push(
        this.fun.getUrl("orderVerification", {
          order_id: item.id,
          api: btn.api
        })
      );
    },
    verificationCash(item, btn) {
      this.$dialog
        .confirm({ message: "确定此订单已付款?" })
        .then(() => {
          // this.datasource.splice(this.datasource.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id,
              order_pay_id: this.order_pay_id
            },
            false
          );
        })
        .catch(() => {});
    },
    //取消订单
    cancleOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定取消此订单?" })
        .then(() => {
          //删除当前选中的地址
          this.datasource.splice(this.datasource.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        })
        .catch(() => {});
    },
    //删除订单
    deleteOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定删除此订单?" })
        .then(() => {
          //删除当前选中的地址
          this.datasource.splice(this.datasource.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        })
        .catch(() => {});
    },
    toPay(item, btn) {
      //status-2合并支付 type-1订单支付
      if (item.plugin_id == 71) {
        this.$router.push(
          this.fun.getUrl(
            "orderpay",
            {
              status: 2,
              order_ids: item.id,
              iscps: true
            },
            { api: btn.api }
          )
        );
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "orderpay",
          {
            status: 2,
            order_ids: item.id
          },
          { api: btn.api }
        )
      );
    },
    //评价订单
    comment(item, btn) {
      this.$router.push(
        this.fun.getUrl("comment", {
          order: item
        })
      );
    },
    //确认收货
    confirmOrder(item, btn) {
      console.log(item, btn);
      if ((item.plugin_id == 0 || item.plugin_id == 44) && this.custom_receipt_confirmation_html !== "") {
        this.custom_receipt_confirmation_btn = btn;
        this.custom_receipt_confirmation_item = item;
        this.custom_receipt_confirmation_show = true;
        return;
      }
      this.$dialog
        .confirm({ message: btn.name })
        .then(() => {
          this.confirmOrder_request(item, btn);
        })
        .catch(() => {});
    },

    CustomReceiptConfirmationSend() {
      this.confirmOrder_request(this.custom_receipt_confirmation_item, this.custom_receipt_confirmation_btn);
    },

    confirmOrder_request(item, btn) {
      //this.$emit('ConfrimOrderNotification');
      //调用接口通知服务器收到货物请求
      var that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http
        .get(
          btn.api,
          {
            order_id: item.id
          },
          "操作中..."
        )
        .then(
          function(response) {
            that.noMoreClick = false;
            if (response.result == 1) {
              that.$emit("ConfrimOrderNotification", item);
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
            that.noMoreClick = false;
          }
        );
    },

    //龙存管公共支付方法
    dragonPay(item) {
      let obj = item.form_data;
      var form = document.createElement("form");
      form.method = "post";
      form.setAttribute("action", item.action_url);
      let arr = ["INFO", "BODY", "SIGN", "CONTENTTYPE"];
      for (let i of arr) {
        let a = document.createElement("input");
        a.setAttribute("name", i);
        a.setAttribute("value", obj[i]);
        form.appendChild(a);
      }
      document.body.appendChild(form);
      form.style.display = "none";
      form.submit();
      return form;
    },
    //龙存管确认收货
    confirmOrder_dragon(item, btn) {
      this.$dialog
        .confirm({ message: btn.name })
        .then(() => {
          //this.$emit('ConfrimOrderNotification');
          //调用接口通知服务器收到货物请求
          var that = this;
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http
            .get(
              btn.api,
              {
                order_id: item.id
              },
              "操作中..."
            )
            .then(
              function(response) {
                that.noMoreClick = false;
                if (response.result == 1) {
                  that.dragonPay(response.data);
                  that.$emit("ConfrimOrderNotification", item);
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function(response) {
                that.noMoreClick = false;
                // error callback
              }
            );
        })
        .catch(() => {});
    },
    //追加评价
    reCommend(item, btn) {},
    toRefundDetail(item, btn) {
      this.$router.push(
        this.fun.getUrl("aftersales", {
          refund_id: item.refund_id
        })
      );
    },
    //退款
    toRefund(item, btn) {
      //refund
      if (btn.value == "snatch_regiment_refund") {
        this.$router.push(
          this.fun.getUrl(
            "refund",
            {
              order_id: item.id,
              order_type: 3
            },
            { value: btn.value }
          )
        );
      } else {
        this.$router.push(
          this.fun.getUrl(
            "refund",
            {
              order_id: item.id,
              order_type: 1
            },
            { value: btn.value }
          )
        );
      }
    },
    applyRefund(item, btn) {
      let _params = {
        order_id: item.id,
        type: 1
      };
      if (this.orderType == "picking-card-one") _params.plugin = "one";
      this.$router.push(this.fun.getUrl("pickUpCardReimburse", _params));
    },
    sentRequest(action, params, isIndicator) {
      let that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(action, params, "").then(
        function(response) {
          that.noMoreClick = false;
          console.log("显示", response);
          if (response.result == 1) {
            //zhuge.track('');
            that.$dialog.alert({ message: response.msg });
            if (window.history.length <= 1) {
              that.$router.push(that.fun.getUrl("home", {}));
            } else {
              that.$router.go(-1);
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.noMoreClick = false;
          // error callback
        }
      );
    },
    sheetAction() {
      console.log(this.sheetVisible);
    },
    //更新
    loadTop() {
      // this.initData();
      // this.getOrderList(this.selected);
      alert("刷新");
      this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      console.log("加载更多");
      this.$refs.loadmore.onBottomLoaded();
      //this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.getAllLoaded) {
        this.allLoaded = false;
      } else {
        this.allLoaded = true;
      }
    },
    /*以下四个都是下拉快递选择相关方法*/
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) {},
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
      setTimeout(() => {
        this.inputExpressCompanyName = "";
      }, 100);
    },
    onConfirmbtn: function(val, index) {
      this.dateshow_1 = false;
      this.regional = val ? val : "请选择快递公司";

      let array = this.options.filter(item => {
        return item.name == val;
      });
      if (array.length > 0) {
        this.expressName = array[0];
      } else {
        this.expressName = {};
      }
      setTimeout(() => {
        this.inputExpressCompanyName = "";
      }, 100);
    },
    stopmove(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    stoppao(e) {
      e.stopPropagation();
    },

    //酒店时间转换
    //时间日期
    getDays(strDateStart, strDateEnd) {
      let start = strDateStart.split(" ");
      let end = strDateEnd.split(" ");
      let strSeparator = "-"; //日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = start[0].split(strSeparator);
      oDate2 = end[0].split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      console.log(iDays);
      return iDays;
    },

    //value 11 酒店确认下单
    confirmHotelOrder(api, id) {
      let that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http
        .get(api, { order_id: id }, "处理中...")
        .then(res => {
          that.noMoreClick = false;
          if (res.result == 1) {
            that.$dialog.alert({ message: res.msg });
            this.reload();
          } else {
            that.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          that.noMoreClick = false;
          console.log(error);
        });
    },

    //value 53 获取盲盒商品
    getBlindBoxGoods(id) {
      $http
        .get(
          "plugin.blind-box.api.index.blind-box-goods",
          {
            order_id: id
          },
          ""
        )
        .then(res => {
          console.log(res);
          if (res.result == 1) {
            this.blindBoxInfo.show = true;
            this.blindBoxInfo.goods = res.data.order;
          }
        });
    },

    // 跳转评价
    evaluateOpration(btn, item, order) {
      //value-0 value-1追加评价 value-2查看评价详情
      if (btn.value == 0) {
        this.$router.push({ name: "evaluate", params: { order_id: order.id, id: item.id }, query: { i: this.toi } });
      } else if (btn.value == 1) {
        this.$router.push({ name: "addevaluate", params: { order_id: order.id, item: item }, query: { i: this.toi } });
      } else if (btn.value == 2) {
        //CommentDetails
        this.$router.push({
          name: "CommentDetails",
          params: {
            order_id: order.id,
            goods_id: item.goods_id,
            order_goods_id: item.id,
            comment_id: 0,
            uid: 0
          },
          query: { i: this.toi }
        });
      }
    },

    toOrderDetail(order) {
      this.$router.push(
        this.fun.getUrl(this.detailUrl == "HotelOrderDetail" ? "HotelOrderDetail" : this.detailUrl, {
          order_id: order.id,
          orderType: this.orderType
        })
      );
    },
    getWarehouseList_CH() {
      $http
        .get("plugin.order-inventory.frontend.index.warehouse-list", {}, ".")
        .then(response => {
          if (response.result == 1) {
            this.inventoryApplyList = response.data.list; //仓库列表
            this.inventoryApplyRadio = response.data.list[0].id;
            this.inventoryApplyPopup = true; //存货申请弹窗
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmInventoryApply() {
      $http
        .get("plugin.order-inventory.frontend.index.inventory-apply", { warehouse_id: this.inventoryApplyRadio, order_id: this.orderPayId }, ".")
        .then(response => {
          this.$dialog.alert({ message: response.msg });
          this.$emit("ConfrimOrderNotification", "pay");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //显示地址pop
    showAddressFun(order) {
      console.log('修改地址');
      // 获取收货地址
      this.yzAddressListOptions = {
        is_open_store_delivery: this.is_open_store_delivery,
        selected: this.selected
      };
      this.showAddress = true;
      this.modifyAddressOrderId = order.id;
    },
        // 增加/修改地址
    confirmSelectAddress(model) {
      this.saveAddress(model);
    },
    //保存地址
    saveAddress(model) {
      let that = this;
      console.log(this.modifyAddressOrderId);
      let json = {
        "data":{
          "order_id":this.modifyAddressOrderId,
          "realname":model.username,
          "phone":model.mobile,
          "address":model.address,
          "province_id":model.province_id,
          "city_id":model.city_id,
          "district_id":model.district_id,
        "street_id":0
        }
      };
      $http.post('plugin.overseas.frontend.address.modify', json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            if(model.action != 'store' && model.action != "update"){
              Toast('修改完成！');
            }
            for(let index in that.datasource){
              if(that.datasource[index].id == that.modifyAddressOrderId){
                that.datasource[index].address = {
                  "address" : model.province + " " + model.city + ' ' + model.district + ' '+model.address,
                  "mobile" : model.mobile,
                  "realname" : model.username
                };
                let tmp_button_models = [];
                for(let i in that.datasource[index].button_models){
                  if(typeof(that.datasource[index].button_models[i]) == 'object' && that.datasource[index].button_models[i].value != 'modify_address'){
                    tmp_button_models.push(that.datasource[index].button_models[i])
                  }
                }
                that.datasource[index].button_models = tmp_button_models;
              }
            }
          } else {
            Toast(response.msg);
          }
          that.showAddress = false;
        },
        function(response) {
          console.log(response);
        }
      );
    },
  },

  watch: {
    inputExpressCompanyName(newVal) {
      let res = this.columns.filter(val => {
        return val.indexOf(newVal) !== -1;
      });
      this.filterExpressCompanys = res;
    },
    datasource(newVal) {
      this.consolidated = localStorage.getItem("consolidated_payment") == "true" ? true : false;
    }
  },
  inject: ["reload"],
  components: {
    VanSearch: Search,
    overseastag,
    yzAddressList,
    labels,
    gift
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#orderList {
  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .mint-navbar .mint-tab-item {
    padding: 0.875rem 0;
  }

  .van-dialog {
    width: 80%;
    height: 25rem;
    padding-bottom: 3.125rem;
    padding-top: 3.125rem;

    .van-dialog__content {
      padding-bottom: 1.25rem;

      section {
        height: 16rem;
        padding: 0 0.75rem;
        font-size: 14px;
        overflow-y: scroll;

        .van-button--plain.van-button--primary {
          color: #1989fa;
          width: 100%;
          text-align: right;
          border: none;
        }

        .van-button--normal {
          padding: 0;
        }

        .van-cell {
          padding: 0.875rem 0;
        }

        .van-hairline--top-bottom::after {
          border-width: 0;
        }
      }

      .title {
        line-height: 3.125rem;
        font-weight: bold;
        padding: 0 0.75rem 0 0.75rem;
        position: fixed;
        top: 0;
        width: 100%;
        background: #fff;
        border-bottom: solid 1px #ebebeb;
      }

      .addressee {
        font-size: 15px;
        font-weight: bold;
        min-height: 1.875rem;
        line-height: 1.875rem;
      }

      .user_name {
        width: 100%;
        min-height: 1.5rem;
        line-height: 1.5rem;
        overflow: visible;
        color: #8c8c8c;
      }

      .user_city {
        width: 100%;
        overflow: visible;
        line-height: 1.5rem;
        color: #8c8c8c;
        margin-bottom: 0.625rem;
      }

      .select_company,
      .input_number {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 2.875rem;
        line-height: 2.8125rem;

        .company_right,
        .number_right {
          width: 60%;
          text-align: left;
          height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          /deep/ .van-field__control {
            text-align: center;
          }
        }
      }

      .store_foot {
        width: 100%;
        position: fixed;
        bottom: 0;
        display: flex;

        .van-button {
          width: 50%;
          height: 3.125rem;
          background: #fff;
          font-size: 16px;
        }

        .btn_b {
          color: #1989fa;
          border: solid 0.0625rem #ebebeb;
        }

        .btn_a {
          border-top: solid 0.0625rem #ebebeb;
        }
      }
    }
  }

  .inventory-apply-popup {
    height: auto;
    padding: 0;
    /deep/.van-dialog__content {
      padding: 0 0.875rem 0.875rem;
      max-height: 15rem;
      text-align: left;
      overflow-y: scroll;
      .van-radio {
        padding: 0.875rem 0;
      }
    }
  }
}

.olis {
  height: 100vh;
}

.Margintop {
  margin-bottom: 3.75rem;
}

.shop {
  background: #ffffff;
  padding-top: 8px;
  margin: 0.625rem;
  border-radius: 10px;
  border-bottom: 0.0625rem solid #ebebeb;
  border-top: 0.0625rem solid #ebebeb;

  a {
    color: #000;
  }

  .title::after {
    content: "";
    display: block;
    clear: both;
  }

  .title {
    padding: 0.625rem 0.5rem;
    display: flex;
    align-items: center;

    h4 {
      text-align: left;
      font-weight: normal;
      flex: 1;
      font-size: 14px;
      margin-left: 5px;
      color: #666;

      b {
        font-size: 18px;
      }
    }

    .span {
      color: #f15353;
      text-align: right;
      margin-right: 0.0625rem;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .tags {
      font-size: 12px;
      background-color: #fcbc07;
      color: #fff;
      border-radius: 8px;
      padding: 3px 6px;
      word-break: normal;
      max-width: 4.3rem;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  span.del {
    border-radius: 0.875rem;
    border: 0.0625rem solid #f15353;
    text-align: center;
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }

  .shop-box {
    display: flex;
    padding: 0.3rem 0.6rem;
    line-height: 28px;

    .shop-box-left {
      display: flex;
      width: 90%;

      p {
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .icon-fontclass-dianpu {
      font-size: 26px;
      color: #f15353;
    }

    .icon-advertise-next {
      font-size: 26px;
      color: #bdbdbd;
      flex: 0 0 30px;
    }
  }

  .address-box {
    padding: 0.3rem 0.875rem;
    text-align: left;
    color: #909090;
  }
  .allbtStock {
    position: relative;
    border-top: 0.0625rem solid #ebebeb;
    padding-right: 0.875rem;
    padding-left: 0.875rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rightAll {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      position: relative;

      span {
        min-width: 65px;
        border-radius: 15px;
        border: 0.0625rem solid #666;
        margin-left: 0.625rem;
        padding: 0.25rem 0.625rem;
        text-align: center;
        font-size: 12px;
      }

      .red-button {
        border: 0.0625rem solid #f14e4e;
        background-color: #f14e4e;
        color: #fff;
      }

      .noClickBG {
        border: 0.0625rem solid #e8e8e8;
        background: #e8e8e8;
        color: #999;
      }

      .trans {
        position: absolute;
        right: 1.875rem;
        bottom: 2.5rem;
        width: 0;
        height: 0;
        border-width: 0.8rem 0.8rem 0;
        border-style: solid;
        border-color: #f5f5f5 transparent transparent;
      }

      .more-button {
        position: absolute;
        border: solid 1px #e2e2e2;
        width: 70px;
        border-radius: 5px;
        background: #fff;
        right: 0.875rem;
        bottom: 3.2rem;

        p {
          padding: 0.3rem 0.1rem;
          border-top: 1px solid #e2e2e2;
        }
      }
    }
  }
  .allbt {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 0.0625rem solid #ebebeb;
    padding-right: 0.875rem;
    padding-top: 0.5rem;
    flex-wrap: wrap;
    position: relative;

    span {
      min-width: 65px;
      border-radius: 15px;
      border: 0.0625rem solid #666;
      margin-left: 0.625rem;
      padding: 0.25rem 0.625rem;
      text-align: center;
      font-size: 12px;
      margin-bottom: 0.5rem;
    }

    .red-button {
      border: 0.0625rem solid #f14e4e;
      background-color: #f14e4e;
      color: #fff;
    }

    .noClickBG {
      border: 0.0625rem solid #e8e8e8;
      background: #e8e8e8;
      color: #999;
    }

    .trans {
      position: absolute;
      right: 1.875rem;
      bottom: 2.5rem;
      width: 0;
      height: 0;
      border-width: 0.8rem 0.8rem 0;
      border-style: solid;
      border-color: #f5f5f5 transparent transparent;
    }

    .more-button {
      position: absolute;
      border: solid 1px #e2e2e2;
      width: 70px;
      border-radius: 5px;
      background: #fff;
      right: 0.875rem;
      bottom: 3.2rem;

      p {
        padding: 0.3rem 0.1rem;
        border-top: 1px solid #e2e2e2;
      }
    }
  }

  .exchange_order_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.75rem 0.75rem 0.75rem;
    padding: 0.75rem 0.5rem;
    background: #f2f2f2;
    font-size: 12px;
    border-radius: 8px;
    i {
      color: #f15353;
      font-weight: 600;
    }
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    width: 100%;
    box-sizing: border-box;

    /* background: #fafafa; */
    .img {
      padding: 0.625rem;

      /* flex: 1; */
      width: 30%;
      float: left;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 69%;
      padding: 0.625rem 1rem 0.625rem 0;
      float: left;
      display: inline-block;

      .inner {
        float: left;
        box-sizing: border-box;
        text-align: left;

        .name {
          font-size: 14px;
          text-align: left;
          color: #333;
          margin-bottom: 0.625rem;
          height: 2.5rem;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .num {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .price {
      font-size: 14px;
      text-align: right;
      color: #333;
      padding: 0.625rem;

      small {
        font-size: 12px;
      }
    }

    .comment-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      .comment-btn {
        color: #565656;
        border-radius: 15px;
        min-width: 4.0625rem;
        padding: 0.25rem 0.625rem;
        border: 0.0625rem solid #9f9c9c;
        margin-right: 0.625rem;
      }
      .color-btn {
        color: #f15353;
        border-color: #f15353;
      }
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
      display: flex;
      line-height: 14px;
    }

    .reserveClass {
      font-size: 13px;
      color: #f15353;
      margin-top: 0.5rem;
    }
  }

  #tbs {
    display: flex;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem;
    line-height: 1.5rem;
    border-bottom: 0.0625rem solid #d9d9d9;

    .left {
      text-align: left;
      flex: 50%;
      color: #858585;
    }

    .right {
      text-align: right;
      flex: 50%;
    }

    .add {
      color: #259b24;
    }

    .reduce {
      color: #e51c23;
    }
  }
}

.barter_dialog {
  height: auto !important;
  padding: 0 !important;

  .barter_dialog_1 {
    padding: 0.875rem 0;
    font-size: 1rem;
    font-weight: bold;
    color: #000;
  }

  .barter_dialog_2 {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #ee0a24;
  }
}

.blindBoxInfo {
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

  .multipleWrapper {
    width: 18.906rem;
    height: 22.25rem;
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindToast.png);
    background-size: 100% 100%;

    .desc {
      padding-top: 1.45rem;
      padding-bottom: 0.906rem;
      font-size: 0.938rem;
      color: #fff;
    }

    .goodsWrapper {
      margin: 0 auto;
      padding: 0 0.1rem;
      width: 16.031rem;
      height: 17.6rem;
      border-radius: 0.625rem;
      overflow: scroll;

      .goodsItem {
        width: 100%;
        margin-bottom: 0.6rem;
        background-color: #fff;
        border-radius: 0.313rem;

        .goodInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.531rem 0.469rem;
          font-size: 0.625rem;

          .c1 {
            color: #666;
          }

          .c2 {
            color: #f14e4e;
          }
        }

        .goodContent {
          display: flex;
          padding-bottom: 0.5rem;

          .goods_img {
            height: 3.125rem;
            padding: 0 0.5rem;
            border-radius: 0.125rem;

            img {
              width: 3.125rem;
              height: 3.125rem;
              border-radius: 0.125rem;
            }
          }

          .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 3.125rem;
            padding-right: 1.3rem;
            text-align: left;

            .name {
              font-size: 0.75rem;
              color: #333;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .price {
              font-size: 0.625rem;
              color: #666;
            }
          }
        }
      }
    }
  }
}

.deposit-tips {
  font-size: 12px;
  padding: 2px 8px;
  margin-right: 5px;
  border-radius: 5px;
  background-color: rgba(255, 174, 190, 0.43);
  color: #f15353;
}

.refundShow-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .popup-title {
    height: 3rem;
    line-height: 3rem;
    font-size: 18px;
    font-weight: bold;
  }

  .popup-context {
    flex: 1;
    overflow: scroll;
    padding: 0 0.875rem 0.875rem;
    text-align: left;
    text-indent: 26px;
  }
}

.custom_receipt_confirmation_html {
  max-height: 20rem;
  padding-top: 0.8rem;
  overflow-y: scroll;

  /deep/img {
    max-width: 100%;
    object-fit: cover;
  }
}

/deep/ .pcStyle {
  .van-dialog {
    max-width: 350px;
  }
}
</style>

<style>
.express-select-search.van-search .van-cell {
  align-items: center;
  padding: 0;
}

.express-select-search .van-field__control {
  text-align: center !important;
}
.vipPirce {
  color: #fd7b0c;
  display: inline;
}
</style>
