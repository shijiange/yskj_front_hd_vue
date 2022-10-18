<template>
  <div id="goods-item">
    <div class="title">
      <h4 style="display: flex; word-break: keep-all;" class="overflow">
        <em style=" white-space: pre-wrap; word-break: break-word;">订单号：{{ order.order_sn }}</em>
        <span style="text-align: left; margin-left: 5px; align-self: center;" v-if="order.dispatch_type_name">
          <em class="tags">{{ order.dispatch_type_name }}</em>
        </span>
      </h4>
      <span style="white-space: nowrap;">{{ order.status_name }}</span>
    </div>
    <div
      class="shop-box"
      v-if="order.shop_name && (order.plugin_id == 0 || order.plugin_id == 92 || order.plugin_id == 31 || order.plugin_id == 32 || order.plugin_id == 44 || order.plugin_id == 54)"
    >
      <div class="shop-box-left">
        <i class="iconfont icon-fontclass-dianpu"></i>
        <p>{{ order.shop_name }}</p>
      </div>
      <!-- <i class="iconfont icon-advertise-next"></i> -->
    </div>
    <router-link
      :to="
        fun.getUrl('sideOrderdetail', {
          order_id: order.id,
          orderType: orderType
        })
      "
      v-for="(good, i) in order.has_many_order_goods"
      :key="i"
    >
      <div class="goods">
        <div class="img"><img :src="good.thumb" /></div>
          <div class="inner">
            <div class="name" style="-webkit-box-orient: vertical;">{{ good.title | escapeTitle }}</div>
            <div class="option">
              <p v-if="good.goods_option_title" style="margin-right: 5px;">规格: {{ good.goods_option_title }}</p>
              <div class="num" v-if="detailUrl != 'HotelOrderDetail'">×{{ good.total }}</div>
              <div class="num" v-if="detailUrl == 'HotelOrderDetail'">{{ getDays(order.hotel_order.enter_at, order.hotel_order.leave_at) }}晚{{ good.total }}间</div>
            </div>
            <div class="price">
              {{$i18n.t('money')}}
              {{ orderType == "lease_toy" ? good.price / order.has_one_lease_toy_order.return_days / good.total : good.price }}
              <span v-if="order.plugin_id == 40 ? true : false">/天</span>
            </div>
          </div>
      </div>
    </router-link>
    <div class="address-box" v-if="order.address && order.address.address">
      <p>{{ order.address.realname }} （{{ order.address.mobile }}）</p>
      <p>{{ order.address.address }}</p>
    </div>
    <div class="title">
      <span>
        共 {{ order.goods_total }}
        {{ detailUrl == "HotelOrderDetail" ? "个房间" : "件商品" }}
        实付：
        <span style="color: #f14e4e;">{{ $i18n.t("money") }}{{ order.price }}</span>
      </span>
    </div>
    <!-- <div class="allbt">
      <span @click="toDetail(order.id)">查看详情</span>
    </div> -->
  </div>
</template>

<script>
export default {
  props: ["order", "detailUrl", "orderType"],
  data() {
    return {
      isLeaseGoods: false,
    };
  },

  methods: {
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
      return iDays;
    },
    operation(btn, order, barter) {
      // btn = {name: "确认发货", value: 24, api: "plugin.supplier.frontend.order.cancel-send"};

      if (!btn.api) {
        if (btn.value == "expediting_delivery") {
          Toast("已提醒过商家");
        } else {
          //接口没有返回按钮点击请求的地址
          Toast("error:错误4008820");
        }
        return;
      }

      this.orderPayId = order.id;
      if (btn.value == 8 || btn.value == "snatch_regiment_express") {
        this.checklogistics(order, btn);
      } else if (btn.value == 51) {
        // 查看卡券
        this.$router.push(this.fun.getUrl("cpsPwd", {order_id:order.id}));
      } else if (btn.value == 12) {
        this.deleteOrder(order, btn);
      } else if (btn.value == 10) {
        this.comment(order, btn);
      } else if (btn.value == 1 || btn.value == "snatch_regiment_pay") {
        this.toPay(order, btn);
      } else if (btn.value == 13 || btn.value == 54 || btn.value == "snatch_regiment_refund") {
        //退款
        this.toRefund(order, btn);
      } else if (btn.value == 101) {
        this.applyRefund(order, btn);
      } else if (btn.value == 9) {
        //取消订单
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
        //退款中
        //  this.toRefund(order, btn);
        this.$router.push(this.fun.getUrl("MyProject"));
      } else if (btn.value == "cashierPay") {
        //更多
        this.cashPayOrder(order, btn);
      }else if (btn.value == "verification_code") {
        this.verification(order, btn);
      } else if (btn.value == 20) {
        this.verificationCash(order, btn);
      } else if (btn.value == 21) {
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
      } else if (btn.value == 27) {
        this.evaluate(order, btn);
      } else if (btn.value == 28) {
        //卡密
        this.truckList(btn, order);
      } else if (btn.value == 41) {
        //398售后
        window.location.href = btn.api;
      } else if (btn.value == 50) {
        //查看发票
        this.checkInvoice(btn, order);
      } else if (btn.value == 11) {
        //酒店确认下单
        this.confirmHotelOrder(btn.api, order.id);
      } else if (btn.value == "coupon") {
        //分享优惠券
        this.$router.push(this.fun.getUrl("couponShare", { order_id: order.id }));
      } else if (btn.value === "check_out") {
        this.publicMessage(order, btn, "退房");
      } else if (btn.value === "clerk_code" || btn.value === "package_deliver") {
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
      } else {
        this.publicMessage(order, btn, "");
      }
    },
  },

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goods-item {
  font-size: 12px;
  background: #fff;
  margin: 0.625rem;
  border-radius: 10px;
  border-bottom: 0.0625rem solid #e9e5e5;
  padding-bottom: 0.5rem;

  a {
    color: #000;
  }

  .title {
    margin-top: 0.6rem;
    padding: 0 0.3rem;
    display: flex;
    align-items: center;

    h4 {
      text-align: left;
      font-weight: normal;
      flex: 9;
      line-height: 20px;
      margin-left: 5px;
      color: #666;
      white-space: pre-wrap;

      b {
        font-size: 16px;
      }
    }

    span {
      text-align: right;
      margin-right: 0.0625rem;
      flex: 2;
    }

    .tags {
      background-color: #fcbc07;
      color: #fff;
      word-break: keep-all;
      border-radius: 8px;
      padding: 3px 6px;
    }
  }

  span.del {
    border-radius: 0.875rem;
    border: 0.0625rem solid #f15353;
    text-align: center;
    padding: 0.25rem 0.625rem;
  }

  .shop-box {
    display: flex;
    padding: 0.6rem 0;
    line-height: 28px;

    .shop-box-left {
      display: flex;
      width: 90%;

      p {
        font-size: 14px;
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
    padding: 0.5rem 0.3rem;
    line-height: 20px;
    text-align: left;
    color: #909090;
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

  .goods {
    flex: 1;
    display: flex;
    box-sizing: border-box;
    text-align: left;
    margin-left: 0.3rem;

    .img {
      width: 4.375rem;
      height: 4.375rem;
      display: inline-block;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .inner {
      flex: 1;
      margin-left: 0.3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      text-align: left;

      .name {
        text-align: left;
        color: #333;
        font-weight: bold;
        margin-bottom: 0.625rem;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .num {
        color: #909090;
      }
    }

    .option {
      color: #909090;
      flex: 1;
      display: flex;
      line-height: 12px;
    }

    .price {
      color: #909090;
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
</style>
