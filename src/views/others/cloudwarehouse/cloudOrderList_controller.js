import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 1,
      info: [],
      // 订单接口
      regional: '请选择快递公司',
      dateshow_1: false,
      columns: [],
      isShow: false,
      toi: this.fun.getKeyByI(),
      checkList: [],
      loading: false,
      allLoaded: false,
      goload: true,
      qrcode: '',
      showQrcode: false,
      //确认发货
      dialogVisible: false,
      expressName: '',
      numberName: '',
      addresseeInfo: '',
      options: [],
      orderPayId: '',
      showWriteOff: false,
      writeOffQR: '', //配送站订单确认核销 按钮展示的二维码
      //   actions:[],
      //   sheetVisible:''
      //司机配送确认发货
      isShowDri: false, //确认按钮是否显示司机配送
      driverDialogVisible: false,
      driverId: '',
      driverOptions: [],
      driverColumns: [],
      driverRegional: '请选择配送司机',
      driverDateshow_1: false,
      driverApi: '',
      driverNumber: '',
      activeName: 'first',

      jurisdiction_set: "",//供应商订单是否显示会员信息

      noMoreClick: false, //防止快速点击重复触发
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      show: false,
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    tapDetail(kid) {
      this.$router.push(this.fun.getUrl("cloudOrderDetail", {id : kid}));
    },
    acr() {
      console.log(this.active);
      this.init();
      this.getData();
    },
    init() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getMoreData() {
      var that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let url = '';
      if (this.active == 1) {
        url = "plugin.cloud-warehouse.frontend.order-list.index";
      } else if (this.active == 2) {
        url = "plugin.cloud-warehouse.frontend.order-list.waitSend";
      } else if (this.active == 3) {
        url = "plugin.cloud-warehouse.frontend.order-list.waitReceive";
      } else if (this.active == 4) {
        url = "plugin.cloud-warehouse.frontend.order-list.completed";
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            url,
            { page: that.page },
            "加载中"
          )
          .then(response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.info = this.info.concat(myData);
              this.isLoadMore = true;
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getData() {
      var that = this;
      let url = '';
      if (this.active == 1) {
        url = "plugin.cloud-warehouse.frontend.order-list.index";
      } else if (this.active == 2) {
        url = "plugin.cloud-warehouse.frontend.order-list.waitSend";
      } else if (this.active == 3) {
        url = "plugin.cloud-warehouse.frontend.order-list.waitReceive";
      } else if (this.active == 4) {
        url = "plugin.cloud-warehouse.frontend.order-list.completed";
      }
      $http
        .get(
          url,
          {},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.info = response.data.data;
            that.total_page = response.data.last_page;
            this.isLoadMore = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 原订单方法
    setCheckList() {
      this.checkList = [];
    },
    operation(btn, order) {
      // btn = {name: "确认发货", value: 24, api: "plugin.supplier.frontend.order.cancel-send"};
      console.log(btn, '点击');
      console.log(btn, order);
      if (!btn.api) {
        if (btn.value == 'expediting_delivery') {
          Toast('已提醒过商家');
        } else {
          //接口没有返回按钮点击请求的地址
          Toast('error:错误4008820');
        }
        return;
      }

      this.orderPayId = order.id;
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
      } else if (btn.value == 'cashierPay') {
        //退款中
        this.cashPayOrder(order, btn);
      } else if (btn.value == 'verification_code') {
        this.verification(order, btn);
      } else if (btn.value == 20) {
        this.verificationCash(order, btn);
      } else if (btn.value == 21) {
        // console.log('转账信息',order);
        this.$router.push(
          this.fun.getUrl('OrderRecord', {
            order_id: order.id,
          })
        );
      } else if (btn.value == 22 || btn.value === 'delivery_station_pay' || btn.value === 'service_station_pay') {
        // 确认支付
        this.publicMessage(order, btn, '支付');
      } else if (btn.value == 23 || btn.value == 60) {
        // 确认发货
        if (order.dispatch_type_id == 3) {
          this.sendGoogs();
        } else {
          this.getCompany();
          this.dialogVisible = true;
        }
        this.expressName = '';
        this.numberName = '';
        if (
          JSON.parse(window.localStorage.getItem('globalParameter')).delivery_driver_open == '1' &&
          (this.orderType == 'supplier' || this.orderType == 'store')
        ) {
          this.isShowDri = true;
          this.driverId = '';
          this.driverNumber = '';
          this.driverRegional = '请选择配送司机';
          this.driverApi = btn.api;
          this.supplierDriverSend();
          // this.driverDialogVisible = true;
        }
      } else if (btn.value == 24 || btn.value == 61 || btn.value === 'service_station_cancel_send') {
        //取消发货
        this.publicMessage(order, btn, '取消发货');
      } else if (
        btn.value == 25 ||
        btn.value === 'delivery_station_complete' ||
        btn.value === 'service_station_complete'
      ) {
        //确认收货
        this.publicMessage(order, btn, '收货');
      } else if (btn.value == 26 || btn.value === 'delivery_station_close' || btn.value === 'service_station_close') {
        //关闭订单
        this.publicMessage(order, btn, '关闭');
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
      } else if (btn.value == 'coupon') {
        //分享优惠券
        this.$router.push(this.fun.getUrl('couponShare', { order_id: order.id }));
      } else if (btn.value === 'check_out') {
        this.publicMessage(order, btn, '退房');
      } else if (btn.value === 'clerk_code' || btn.value === 'package_deliver') {
        //确认核销
        this.confirmWriteOff(order, btn);
      } else if (btn.value === 'service_station_send') {
        //服务站的确认发货
        this.getCompany();
        this.dialogVisible = true;
        this.expressName = '';
        this.numberName = '';
      } else if (btn.value == 'lease_toy_refund' || btn.value == 'package_deliver_clerk') {
        // 申请退还
        this.getReturn(btn, order);
      } else if (btn.value == 'lease_toy_apply_adopt') {
        // 填写归还
        console.log('填写归还啊啊啊啊');
        this.$router.push(this.fun.getUrl('OrderReturn', { id: order.id }));
      } else if (btn.value == 'lease_toy_return_info') {
        // 归还详情
        this.$router.push(this.fun.getUrl('orderruturninfo', { id: order.id }));
      } else if (btn.value == 'hotel_supply') {
        this.$router.push(this.fun.getUrl('hotelOrder', { id: order.id }));
      } else if (btn.value == 'expediting_delivery') {
        this.publicMessage(order, btn, '提醒商家发货');
      } else {
        this.publicMessage(order, btn, '');
      }
    },
    //司机配送确认发货
    supplierDriverSend() {
      var that = this;
      var urls = 'plugin.delivery-driver.home.delivery-info.get-driver-list';
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, {}).then(
        function (response) {
          console.log('oo++3', response);
          that.noMoreClick = false;
          if (response.result == 1) {
            that.driverOptions = [];
            that.driverOptions = response.data;
            var arrayOfSquares = that.driverOptions.map(function (item) {
              return item.driver_name + '(' + item.user_phone + ')';
            });
            that.driverColumns = arrayOfSquares;
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    /*以下四个都是下拉司机配送选择相关方法*/
    driverSeleRegional: function () {
      this.driverDateshow_1 = true;
    },
    onDriverChange(picker, value, index) { },
    onDriverCancelbtn: function (val, index) {
      this.driverDateshow_1 = false;
    },
    onDriverConfirmbtn: function (val, index) {
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
      this.$router.push(this.fun.getUrl('Invoice', { order_id: order.id }));
    },
    //卡密
    truckList(btn, order) {
      this.$router.push(this.fun.getUrl('TruckList', { order_id: order.id }));
    },
    // 评价
    evaluate(order, btn) {
      this.$router.push(
        this.fun.getUrl('DeliveryEvaluate', {
          order_id: order.id,
          api: btn.api,
          name: 'distributor'
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
          that.$dialog.alert({message:res.msg});

          that.$emit('ConfrimOrderNotification');
        } else {
          that.$dialog.alert({message:res.msg});

        }
      });
    },

    publicMessage(order, btn, text) {
      let _text = text || '';
      if (!btn.api) {
        return;
      }
      this.$dialog.confirm({ message: `确定${_text}?`})
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = btn.api || '';
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http.get(urls, json).then(
            function (response) {
              that.noMoreClick = false;
              if (response.result == 1) {
                that.$emit('ConfrimOrderNotification', 'pay');
                that.$notify({
                  background: '#f0f9eb',
                  message: `${_text}成功`,
                  color: '#67c23a'
                });
              } else {
                that.$dialog.alert({message:response.msg});
              }
            },
            function (response) {
              that.noMoreClick = false;
              console.log(response);
            }
          );
        }).catch(() => {});
    },

    confirmWriteOff(order, btn) {
      var that = this;
      let url = '';
      if (btn.value == 'clerk_code') {
        url = 'plugin.delivery-station.frontend.order.detail.qr-code-url';
      } else if (btn.value == 'package_deliver') {
        url = btn.api;
      }
      $http.get(url, { order_id: order.id }, '正在获取核销码').then(
        function (response) {
          if (response.result == 1) {
            if (btn.value == 'clerk_code') {
              that.writeOffQR = response.data.qrcode_url;
            } else if (btn.value == 'package_deliver') {
              that.writeOffQR = response.data.qr_code_url;
            }
            that.showWriteOff = true;
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //获取快递公司
    getCompany(btn) {
      var that = this;
      let urls = "";
      if (this.orderType == 'supplier') {
        urls = 'plugin.supplier.frontend.order.express-company';
      } else if (this.orderType == 'serviceReplenish') {
        urls = 'plugin.service-station.frontend.order-list.express';
      } else if (this.orderType == 'auction') {
        urls = 'plugin.auction.api.sendOrder';
      } else if (this.orderType == 'auctioneer') {
        urls = 'plugin.auction.api.sendOrder';
      } else if (this.orderType == 'subsidiary') {
        urls = 'plugin.subsidiary.frontend.order.express-company';
      } else {
        urls = 'plugin.store-cashier.frontend.store.center.sendOrder';
      }
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, { order_id: that.orderPayId }).then(
        function (response) {
          console.log('oo++3', response);
          that.noMoreClick = false;
          if (response.result == 1) {
            if (that.orderType == 'supplier') {
              that.jurisdiction_set = response.data.jurisdiction_set;
            }
            that.options = [];
            that.options = response.data.express_companies;
            var arrayOfSquares = that.options.map(function (item) {
              return item.name;
            });
            that.columns = arrayOfSquares;
            that.addresseeInfo = response.data.address;
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
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
      let that = this;
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
      if (this.isShowDri && that.activeName == 'second') {
        json.order_id = that.orderPayId;
        json.dispatch_type_id = 7;
        json.driver_id = that.driverId;
      } else {
        json.order_id = that.orderPayId;
        json.express_code = that.expressName.value;
        json.express_company_name = that.expressName.name;
        json.express_sn = that.numberName;
      }
      let _urls = '';
      if (this.orderType == 'supplier') {
        _urls = 'plugin.supplier.frontend.order.send';
      } else if (this.orderType == 'serviceReplenish') {
        _urls = 'plugin.service-station.frontend.order.order-operation.send';
      } else if (this.orderType == 'subsidiary') {
        _urls = 'plugin.subsidiary.frontend.order.send';
      } else if (this.orderType == 'auction') {
        _urls = 'plugin.auction.api.order-operation.send';
      } else if (this.orderType == 'auctioneer') {
        _urls = 'plugin.auction.api.order-operation.send';
      } else {
        _urls = 'plugin.store-cashier.frontend.store.center.order-operation.send';
      }

      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(_urls, json).then(
        function (response) {
          that.noMoreClick = false;
          if (response.result == 1) {
            that.dialogVisible = false;
            that.$emit('ConfrimOrderNotification', 'pay');
            that.$notify({
              background: '#f0f9eb',
              message: '发货成功',
              color: '#67c23a'
            });
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    //多订单合并支付的响应方法
    multiplePayChange(value) {
      this.$emit('MultiplePayNotification', this.checkList);
    },
    toDetail(order) {
      this.$emit('ToDetailNotification', order);
    },
    //查看物流
    checklogistics(item, btn) {
      //回放轨迹
      console.log(JSON.parse(window.localStorage.getItem('globalParameter')).delivery_driver_open);
      if (
        item.dispatch_type_id == 7 &&
        JSON.parse(window.localStorage.getItem('globalParameter')).delivery_driver_open == '1'
      ) {
        console.log('hahaha');
        this.$router.push(
          this.fun.getUrl('track', {
            id: item.id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl('logistics', {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
        );
      }
    },
    cashPayOrder(item, btn) {
      this.$dialog.confirm({ message: "确定此订单已付款?"})
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
        }).catch(() => {});
    },
    verification(item, btn) {
      this.$router.push(
        this.fun.getUrl('orderVerification', {
          order_id: item.id,
          api: btn.api
        })
      );
    },
    verificationCash(item, btn) {
      this.$dialog.confirm({ message: "确定此订单已付款?"})
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
        }).catch(() => {});
    },
    //取消订单
    cancleOrder(item, btn) {
      this.$dialog.confirm({ message: "确定取消此订单?"})
        .then(() => {
        //删除当前选中的地址
          this.info.splice(this.info.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        }).catch(() => {});
    },
    //删除订单
    deleteOrder(item, btn) {
      this.$dialog.confirm({ message: "确定删除此订单?"})
        .then(() => {
        //删除当前选中的地址
          this.info.splice(this.info.indexOf(item), 1);
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        }).catch(() => {});
    },
    toPay(item, btn) {
      //status-2合并支付 type-1订单支付
      this.$router.push(
        this.fun.getUrl('orderpay', {
          status: 2,
          order_ids: item.id
        })
      );
    },
    //评价订单
    comment(item, btn) {
      this.$router.push(
        this.fun.getUrl('comment', {
          order: item
        })
      );
    },
    //确认收货
    confirmOrder(item, btn) {
      this.$dialog.confirm({ message: btn.name})
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
              '操作中...'
            )
            .then(
              function (response) {
                that.noMoreClick = false;
                if (response.result == 1) {
                  that.$emit('ConfrimOrderNotification', item);
                } else {
                  that.$dialog.alert({message:response.msg});
                }
              },
              function (response) {
                // error callback
                that.noMoreClick = false;
              }
            );
        }).catch(() => {});
    },
    //龙存管公共支付方法
    dragonPay(item) {
      let obj = item.form_data;
      var form = document.createElement('form');
      form.method = 'post';
      form.setAttribute('action', item.action_url);
      let arr = ['INFO', 'BODY', 'SIGN', 'CONTENTTYPE'];
      for (let i of arr) {
        let a = document.createElement('input');
        a.setAttribute('name', i);
        a.setAttribute('value', obj[i]);
        form.appendChild(a);
      }
      document.body.appendChild(form);
      form.style.display = 'none';
      form.submit();
      return form;
    },
    //龙存管确认收货
    confirmOrder_dragon(item, btn) {
      this.$dialog.confirm({ message:  btn.name})
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
              '操作中...'
            )
            .then(
              function (response) {
                that.noMoreClick = false;
                if (response.result == 1) {
                  that.dragonPay(response.data);
                  that.$emit('ConfrimOrderNotification', item);
                } else {
                  that.$dialog.alert({message:response.msg});

                }
              },
              function (response) {
                that.noMoreClick = false;
                // error callback
              }
            );
        }).catch(() => {});
    },
    //追加评价
    reCommend(item, btn) { },
    toRefundDetail(item, btn) {
      this.$router.push(
        this.fun.getUrl('aftersales', {
          refund_id: item.refund_id
        })
      );
    },
    //退款
    toRefund(item, btn) {
      //refund
      this.$router.push(
        this.fun.getUrl('refund', {
          order_id: item.id,
          order_type: 1
        })
      );
    },
    sentRequest(action, params, isIndicator) {
      let that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(action, params, '').then(
        function (response) {
          that.noMoreClick = false;
          console.log('显示', response);
          if (response.result == 1) {
            that.$dialog.alert({message:response.msg});
            if (window.history.length <= 1) {
              that.$router.push(that.fun.getUrl('home', {}));
            } else {
              that.$router.go(-1);
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
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
      alert('刷新');
      this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      console.log('加载更多');
      this.$refs.loadmore.onBottomLoaded();
      //this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.getAllLoaded) {
        this.allLoaded = false;
      } else {
        this.allLoaded = true;
      }
    },
    /*以下四个都是下拉快递选择相关方法*/
    seleRegional: function () {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) { },
    onCancelbtn: function (val, index) {
      this.dateshow_1 = false;
    },
    onConfirmbtn: function (val, index) {
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
      let start = strDateStart.split(' ');
      let end = strDateEnd.split(' ');
      let strSeparator = '-'; //日期分隔符
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
        .get(api, { order_id: id }, '处理中...')
        .then(res => {
          that.noMoreClick = false;
          if (res.result == 1) {
            that.$dialog.alert({message:response.msg});
            this.reload();
          } else {
            that.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          that.noMoreClick = false;
          console.log(error);
        });
    }
  },

  components: { cTitle }
};
