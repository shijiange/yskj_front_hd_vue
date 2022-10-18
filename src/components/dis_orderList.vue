<template>
  <div id="orderList">
    <van-checkbox-group v-model="checkList" @change="multiplePayChange">
      <div v-for="(order, index) in datasource" :class="orderType == 'lease_toy' && index == datasource.length - 1 ? 'Margintop shop' : 'shop'" :key="index">
        <div class="title">
          <van-checkbox checked-color="#f15353" shape="square" :name="order.id" v-if="status == 1">&nbsp; </van-checkbox>
          <h4>订单号：{{ order.order_sn }}</h4>
          <span>{{ order.status_name }}</span>
        </div>
        <router-link :to="fun.getUrl(detailUrl, { order_id: order.id, orderType: orderType })" v-for="(good, i) in order.has_many_order_goods" :key="i">
          <div class="goods">
            <div class="img"><img :src="good.thumb" /></div>
            <div class="warp">
              <div class="inner">
                <div class="name" style="-webkit-box-orient: vertical;">
                  {{ good.title | escapeTitle }}
                </div>
                <div class="option">规格: {{ good.goods_option_title }}</div>
              </div>
              <div class="price">
                <div class="money">
                  <small>{{ $i18n.t("money") }}</small>
                  {{ orderType == "lease_toy" ? good.price / order.has_one_lease_toy_order.return_days / good.total : good.price }}
                  <span v-if="order.plugin_id == 40 ? true : false">/天</span>
                </div>
                <div v-if="detailUrl != 'HotelOrderDetail'">×{{ good.total }}</div>
                <div v-if="detailUrl == 'HotelOrderDetail'">×{{ getDays(order.hotel_order.enter_at, order.hotel_order.leave_at) }}晚{{ good.total }}间</div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="title">
          <h4 style="text-align: right;">
            共 {{ order.goods_total }}
            {{ detailUrl == "HotelOrderDetail" ? "个房间" : "件商品" }}
            实付：{{ $i18n.t("money") }}<b>{{ order.price }}</b>
          </h4>
        </div>
        <div class="allbt" v-if="order.button_models.length > 0 || !fun.isTextEmpty(order.replenishment_button)">
          <span v-if="!fun.isTextEmpty(order.replenishment_button)" @click="channelReplenishment(order.replenishment_button.order_id)">{{ order.replenishment_button.botton_name }}</span>
          <template v-if="order.button_models.length > 0">
            <span v-for="(item, i) in order.button_models" :key="i" @click="operation(item, order)">{{ item.name }}</span>
          </template>
        </div>
      </div>
    </van-checkbox-group>
    <div class="qrcode">
      <van-popup v-model="showQrcode" position="right" :overlay="false">
        <div>
          <img :src="qrcode" style="width: 100%;" />
          <div style="height: 1.875rem;">请核销员扫码</div>
        </div>
      </van-popup>
    </div>

    <van-dialog @touchmove.native="stopmove" @mousemove.native="stopmove" v-model="dialogVisible" :showConfirmButton="false" style="hei">
      <div class="title">确认发货</div>
      <van-tabs v-model="activeName">
        <van-tab name="first" title="快递配送"></van-tab>
        <van-tab name="second" v-if="isShowDri" title="司机配送"></van-tab>
      </van-tabs>
      <div>
        <div v-show="activeName == 'first'">
          <section style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;">
            <div style="width: 100%;" v-if="addresseeInfo">
              <div class="addressee">
                收件人信息:
              </div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">
                  {{ addresseeInfo.address }}
                </div>
              </div>
            </div>
            <div class="select_company">
              <div style="font-weight: bold; font-size: 15px;">快递公司:</div>
              <div class="company_right">
                <van-button plain type="primary" @click="seleRegional">
                  {{ regional }}
                </van-button>
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
              <div class="addressee">
                收件人信息:
              </div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">
                  {{ addresseeInfo.address }}
                </div>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">
                配送司机:
              </div>
              <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                <van-button style="text-align: left;" plain type="primary" @click="driverSeleRegional">
                  {{ driverRegional }}
                </van-button>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">
                车牌号:
              </div>
              <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                {{ driverNumber }}
              </div>
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
      <van-picker @touchmove.native="stoppao" @mousemove.native="stoppao" :columns="columns" @change="onChange" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar />
    </van-popup>
    <van-popup v-model="driverDateshow_1" position="bottom" :overlay="true">
      <van-picker @touchmove.native="stoppao" @mousemove.native="stoppao" :columns="driverColumns" @change="onDriverChange" @cancel="onDriverCancelbtn" @confirm="onDriverConfirmbtn" show-toolbar />
    </van-popup>
    <!-- 配送站的确认核销按钮 -->
    <van-popup v-model="showWriteOff" position="bottom" :overlay="true">
      <img :src="writeOffQR" style="width: 11.25rem; height: 11.25rem; margin: 2rem 0 1rem 0;" />
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 1rem; color: #f15353;">
        请核销员扫码
      </div>
    </van-popup>
    <div class="blank" v-if="datasource.length <= 0">
      <img src="../assets/images/blank.png" />
      <span>还没有订单记录哦</span>
    </div>
  </div>
</template>
<script>
export default {
  //select_inde-当前选择行,datasource-数据源,currentdata-当前选择的数据
  props: ["datasource", "status", "getAllLoaded", "orderType", "detailUrl"],
  data() {
    return {
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
      activeName: "first"
    };
  },
  mounted() {
    console.log(this.orderType, "参数");
  },
  methods: {
    setCheckList() {
      this.checkList = [];
    },
    operation(btn, order) {
      // btn = {name: "确认发货", value: 24, api: "plugin.supplier.frontend.order.cancel-send"};
      console.log(btn, "点击");

      if (btn.value == 8) {
        this.checklogistics(order, btn);
      } else if (btn.value == 12) {
        this.deleteOrder(order, btn);
      } else if (btn.value == 10) {
        this.comment(order, btn);
      } else if (btn.value == 1) {
        this.toPay(order, btn);
      } else if (btn.value == 13) {
        //退款
        this.toRefund(order, btn);
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
      } else if (btn.value == "cashierPay") {
        //退款中
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
      } else if (btn.value == 22) {
        this.orderPayId = order.id;
        // 确认支付
        this.payMoney(order, btn);
      } else if (btn.value == 23) {
        // 确认发货
        this.orderPayId = order.id;
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
      } else if (btn.value == 24) {
        //取消发货
        this.orderPayId = order.id;
        this.deliverGoodsCancel(order, btn);
      } else if (btn.value == 25) {
        //确认收货
        this.orderPayId = order.id;
        this.collectGoods(order, btn);
      } else if (btn.value == 26) {
        //关闭订单
        this.orderPayId = order.id;
        this.closeOrderPay(order, btn);
      } else if (btn.value == 27) {
        this.orderPayId = order.id;
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
        this.sureOut(order, btn);
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
      } else if (btn.value == 144) {
        this.publicMessage(order, btn, "接单");
      } else if (btn.value == 145) {
        this.publicMessage(order, btn, "放弃接单");
      } else {
        this.publicMessage(order, btn, "操作");
      }
    },
    publicMessage(order, btn, text) {
      let _text = text || "";
      this.orderPayId = order.id;
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
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: `${_text}成功`,
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //司机配送确认发货
    supplierDriverSend() {
      var that = this;
      var urls = "plugin.delivery-driver.home.delivery-info.get-driver-list";
      $http.get(urls, {}).then(
        function(response) {
          console.log("oo++3", response);
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
    checkInvoice(btn, order) {
      this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    },
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
    // 申请归还的操作等
    getReturn(btn, order) {
      $http.get(btn.api, { order_id: order.id }).then(res => {
        if (res.result == 1) {
          this.$dialog.alert({ message: res.msg });
          this.$emit("ConfrimOrderNotification");
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    //确认支付
    payMoney(item, btn) {
      this.$dialog
        .confirm({ message: "确认支付该订单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };

          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "DeliveryS") {
            urls = btn.api;
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.pay";
            // json = {morder_id: that.orderPayId};
            json = { order_id: that.orderPayId };
          }

          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                // that.$message({
                //   message: '支付成功',
                //   type: 'success'
                // });
                that.$notify({
                  background: "#f0f9eb",
                  message: "支付成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //确认接单
    orderReceiving(order, btn) {
      this.$dialog
        .confirm({ message: "确定接收此单配送任务?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "plugin.delivery-station.frontend.order.operation.accept-order";
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                // that.$message({
                //   message: '关闭订单成功',
                //   type: 'success'
                // });
                that.$notify({
                  background: "#f0f9eb",
                  message: "接单成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //确认配送
    confirmDelivery(order, btn) {
      this.$dialog
        .confirm({ message: "确定配送此单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "plugin.delivery-station.frontend.order.operation.send";
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "配送成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    cancelDelivery() {
      this.$dialog
        .confirm({ message: "确定取消配送此单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "plugin.delivery-station.frontend.order.operation.cancel-send";
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "取消配送成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //关闭订单
    closeOrderPay(order, btn) {
      this.$dialog
        .confirm({ message: "确定关闭订单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "DeliveryS") {
            urls = "plugin.delivery-station.frontend.order.operation.close";
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.close";
          }
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                // that.$message({
                //   message: '关闭订单成功',
                //   type: 'success'
                // });
                that.$notify({
                  background: "#f0f9eb",
                  message: "关闭订单成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //取消发货
    deliverGoodsCancel(order, btn) {
      this.$dialog
        .confirm({ message: "确定取消发货?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.cancel-send";
          }
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "取消发货成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    // 确认退房
    sureOut(order, btn) {
      this.$dialog
        .confirm({ message: "确认退房?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: order.id
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result === 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "退房成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    //确认收货
    collectGoods(order, btn) {
      this.$dialog
        .confirm({ message: "确认收货?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "DeliveryS") {
            urls = "plugin.delivery-station.frontend.order.operation.receive";
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.receive";
          }
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");

                // that.datasource.splice(this.datasource.indexOf(order), 1);
                // that.$message({
                //   message: '收货成功',
                //   type: 'success'
                // });
                that.$notify({
                  background: "#f0f9eb",
                  message: "收货成功",
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },

    confirmWriteOff(order, btn) {
      var that = this;
      let url = "";
      if (btn.value == "clerk_code") {
        url = "plugin.delivery-station.frontend.order.detail.qr-code-url";
      } else if (btn.value == "package_deliver") {
        url = btn.api;
      }
      $http.get(url, { order_id: order.id }, "正在获取核销码").then(
        function(response) {
          if (response.result == 1) {
            if (btn.value == "clerk_code") {
              that.writeOffQR = response.data.qrcode_url;
            } else if (btn.value == "package_deliver") {
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
    getCompany() {
      var that = this;
      let urls = "";
      if (this.orderType == "supplier") {
        urls = "plugin.supplier.frontend.order.express-company";
      } else if (this.orderType == "serviceReplenish") {
        urls = "plugin.service-station.frontend.order-list.express";
      } else {
        urls = "plugin.store-cashier.frontend.store.center.sendOrder";
      }
      $http.get(urls, { order_id: that.orderPayId }).then(
        function(response) {
          console.log("oo++3", response);
          if (response.result == 1) {
            that.options = [];
            that.options = response.data.express_companies;
            var arrayOfSquares = that.options.map(function(item) {
              return item.name;
            });
            that.columns = arrayOfSquares;
            that.addresseeInfo = response.data.address;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
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
      if (this.orderType == "supplier") {
        $http.post("plugin.supplier.frontend.order.send", json).then(
          function(response) {
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
            console.log(response);
          }
        );
      } else if (this.orderType == "serviceReplenish") {
        $http.post("plugin.service-station.frontend.order.order-operation.send", json).then(
          function(response) {
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
            console.log(response);
          }
        );
      } else {
        $http.get("plugin.store-cashier.frontend.store.center.order-operation.send", json).then(
          function(response) {
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
            console.log(response);
          }
        );
      }
    },
    //多订单合并支付的响应方法
    multiplePayChange(value) {
      this.$emit("MultiplePayNotification", this.checkList);
    },
    //查看物流
    checklogistics(item, btn) {
      //回放轨迹
      console.log(JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open);
      if (item.dispatch_type_id == 7 && JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1") {
        console.log("hahaha");
        this.$router.push(
          this.fun.getUrl("track", {
            id: item.id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
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
              order_pay_id: this.order_pay_id,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
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
              order_pay_id: this.order_pay_id,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
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
      this.$router.push(
        this.fun.getUrl("orderpay", {
          status: 2,
          order_ids: item.id
        })
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
      this.$dialog
        .confirm({ message: btn.name })
        .then(() => {
          //this.$emit('ConfrimOrderNotification');
          //调用接口通知服务器收到货物请求
          var that = this;
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
                if (response.result == 1) {
                  that.$emit("ConfrimOrderNotification", item);
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function(response) {
                // error callback
              }
            );
        })
        .catch(() => {});
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
                if (response.result == 1) {
                  that.dragonPay(response.data);
                  that.$emit("ConfrimOrderNotification", item);
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function(response) {
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
      this.$router.push(
        this.fun.getUrl("refund", {
          order_id: item.id,
          order_type: 1
        })
      );
    },
    sentRequest(action, params, isIndicator) {
      var that = this;
      $http.get(action, params, "").then(
        function(response) {
          console.log("显示", response);
          if (response.result == 1) {
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
    },
    onConfirmbtn: function(val, index) {
      this.dateshow_1 = false;
      this.regional = val;
      var array = this.options;
      this.expressName = array[index];
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
      $http
        .get(api, { order_id: id }, "处理中...")
        .then(res => {
          if (res.result == 1) {
            this.$dialog.alert({ message: res.msg });
            this.reload();
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    channelReplenishment(_oId) {
      this.$router.push(this.fun.getUrl("bookingChange", { order_id: _oId }));
    }
  },
  inject: ["reload"]
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
          text-align: right;
          height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
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
          border-left: solid 0.0625rem #ebebeb;
          border-top: solid 0.0625rem #ebebeb;
        }

        .btn_a {
          border-top: solid 0.0625rem #ebebeb;
        }
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
  background: #fff;
  margin-top: 0.625rem;
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
    padding: 0 0.875rem;
    display: flex;
    align-items: center;

    h4 {
      text-align: left;
      font-weight: normal;
      line-height: 2.25rem;
      flex: 8;
      font-size: 14px;

      b {
        font-size: 18px;
      }
    }

    span {
      color: #f15353;
      text-align: right;
      margin-right: 0.0625rem;
      flex: 3;
      font-size: 14px;
    }
  }

  span.del {
    border-radius: 0.875rem;
    border: 0.0625rem solid #f15353;
    text-align: center;
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }

  .allbt {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 0.0625rem solid #ebebeb;
    padding-right: 0.875rem;
    padding-top: 0.5rem;
    flex-wrap: wrap;

    span {
      border-radius: 0.1875rem;
      border: 0.0625rem solid #666;
      margin-left: 0.625rem;
      padding: 0.25rem 0.625rem;
      text-align: center;
      font-size: 12px;
      margin-bottom: 0.5rem;
    }
    // .allbt {
    //   display: flex;
    //   align-items: center;
    //   justify-content: flex-end;
    //   border-top: 1px solid #e2e2e2;
    //   height: 2.75rem;
    //   span {
    //     border-radius: 0.25rem;
    //     border: 1px solid #666;
    //     margin: 0 10px 0 0;
    //     padding: 0.25rem 0.625rem;
    //     text-align: center;
    //     font-size: 12px;
    //   }
    //   span:last-child {
    //     color: #f15353;
    //     border: 1px solid #f15353;
    //   }
    // }
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    /* display: -webkit-box;
                                                                                              display: -ms-flexbox;
                                                                                              display: flex;
                                                                                              -webkit-box-align: stretch;
                                                                                              -ms-flex-align: stretch;
                                                                                              align-items: stretch;
                                                                                              -webkit-box-orient: horizontal;
                                                                                              -webkit-box-direction: normal;
                                                                                              -ms-flex-flow: row wrap;
                                                                                              flex-flow: row wrap;
                                                                                              */
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;

    .img {
      padding: 0.625rem 1rem;

      /* flex: 1; */
      width: 26%;
      float: left;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 74%;
      padding: 0.625rem 1rem 0.625rem 0;
      float: left;
      display: inline-block;

      .inner {
        width: 70%;
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
      }

      .price {
        font-size: 14px;
        width: 30%;
        align-items: center;
        text-align: right;
        color: #333;
        box-sizing: border-box;
        float: left;

        .money {
          margin-bottom: 0.625rem;
        }

        small {
          font-size: 12px;
        }
      }
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
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
