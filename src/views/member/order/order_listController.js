import cTitle from "components/title";
// import { Toast } from 'vant';
import cOrderList from "components/orderList";
const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      pageTitle: "我的订单",
      keywords: "",
      keywordType: 1,
      keywordTypes: [
        { name: "商品名", value: 1 },
        { name: "订单号", value: 2 },
        { name: "姓名", value: 3 },
        { name: "手机号", value: 4 }
      ],
      amout: false,

      // 当前的订单状态
      selected: 0,
      // 上一次的订单状态
      last_status: 0,
      dataList: {
        // 全部订单
        orderList: [],
        // 待付款
        waitPayList: [],

        waitSendList: [],
        waitReceiveList: [],
        waitCompleteList: [],
        waitRefund: [],
        alreadyComplete: [],
        isLoading: false
      },
      isLoading: false,
      action: "",
      // 待付款-多订单合并付款的订单id数组
      order_ids: [],
      checkList: [],
      // 是否开启合并支付
      isMultiplePay: false,

      detailUrl: "orderdetail",

      // shop 商城，cashier 收银台 store 门店
      orderType: "shop",

      // 顶部导航栏列表
      NavList: [],
      NavApi: [],
      overSelected: [],

      // more
      page0: 1,
      total_page0: 0,
      isLoadMore0: true,

      page1: 1,
      total_page1: 0,
      isLoadMore1: true,

      page2: 1,
      total_page2: 0,
      isLoadMore2: true,

      page3: 1,
      total_page3: 0,
      isLoadMore3: true,

      page4: 1,
      total_page4: 0,
      isLoadMore4: true,

      page5: 1,
      total_page5: 0,
      isLoadMore5: true,

      page6: 1,
      total_page6: 0,
      isLoadMore6: true,

      // 控制合并支付按钮
      consolidated_payment: localStorage.getItem("consolidated_payment") == "true" ? true : false
    };
  },
  methods: {
    //查看发票
    toInvice(order){
      this.$router.push(
        this.fun.getUrl("Invoice", { 
          //order_ids: encodeURI(this.order_ids)
          order_id:order.id
        })
      );
    },
    //申请发票
    applyInvice(order){
      this.$router.push(
        this.fun.getUrl("ApplyInvoice", { 
          //order_ids: encodeURI(this.order_ids)
           order_id:order.id
        })
      );
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    search() {
      this.selected = "0";
      this.getOrderList(0, "refresh");
    },
    swichTabTItem() {
      this.keywords = "";
      this.keywordType = 1;
      window.scrollTo(0, 0);
      this.getOrderList(this.selected);
    },
    initData() {
      this.pageTitle = "我的订单";
      this.keywords = "";
      this.keywordType = 1;
      this.amout = false;
      this.overSelected = [];
      this.page0 = 1;
      this.total_page0 = 0;
      this.isLoadMore0 = true;

      this.page1 = 1;
      this.total_page1 = 0;
      this.isLoadMore1 = true;

      this.page2 = 1;
      this.total_page2 = 0;
      this.isLoadMore3 = true;

      this.page3 = 1;
      this.total_page3 = 0;
      this.isLoadMore3 = true;

      this.page4 = 1;
      this.total_page4 = 0;
      this.isLoadMore4 = true;

      this.page5 = 1;
      this.total_page5 = 0;
      this.isLoadMore5 = true;

      this.page6 = 1;
      this.total_page6 = 0;
      this.isLoadMore6 = true;

      this.dataList = {
        // 全部订单
        orderList: [],
        // 待付款
        waitPayList: [],

        waitSendList: [],
        waitReceiveList: [],
        waitCompleteList: [],
        waitRefund: [],
        alreadyComplete: []
      };
    },
    // 更新
    loadTop() {
      this.initData();
      this.getOrderList(this.selected);
      // this.$refs.loadmore.onTopLoaded();
    },
    checkType() {
      this.selected = this.$route.params.status || "0";

      if (this.$route.params.orderType && this.$route.params.orderType == "cashier") {
        // 收银台订单有特殊情况根据this.$route.query.status来显示导航
        this.orderType = "cashier";
        this.detailUrl = "cashierOrderdetail";
        if (this.$route.query.status) {
          this.NavList = [];
          this.NavApi = [];
          let order_status = [
            {
              name: "1",
              title: "全部",
              api: "plugin.store-cashier.frontend.Order.list"
            },
            {
              name: "0",
              title: "待付款",
              api: "plugin.store-cashier.frontend.Order.list.waitPay"
            },
            {
              name: "3",
              title: "已完成",
              api: "plugin.store-cashier.frontend.Order.list.Completed"
            }
          ];
          let status = this.$route.query.status ? this.$route.query.status.split(",") : [1];
          for (let i = 0; i < order_status.length; i++) {
            if (status.indexOf(order_status[i].name) > -1) {
              this.NavList.push(order_status[i].title);
              this.NavApi.push(order_status[i].api);
            }
          }
          this.selected = "0";
        } else {
          this.NavList = ["全部", "待付款", "已完成"];
        }
      } else if (this.$route.params.orderType && this.$route.params.orderType == "store") {
        this.orderType = "store";
        this.detailUrl = "storeOrderdetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "supplier") {
        this.orderType = "supplier";
        this.detailUrl = "supplierOrderdetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "hotel") {
        this.orderType = "hotel";
        this.detailUrl = "HotelOrderDetail";
        this.NavList = ["全部", "待付款", "待确认", "待入住", "已完成", "待退房"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "onlineCar") {
        this.orderType = "onlineCar";
        this.detailUrl = "netCarDetail";
        this.NavList = ["全部", "待支付", "待审核", "贷款中", "待提车", "待审牌", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "hotel_center") {
        this.orderType = "hotel_center";
        this.detailUrl = "HotelCenterOrderDetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "hotelcashier") {
        this.orderType = "hotelcashier";
        this.detailUrl = "HotelCashierOrderDetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "DeliveryS") {
        this.orderType = "DeliveryS";
        this.detailUrl = "deliveryStationOrderDetail";
        this.NavList = ["全部", "待支付", "待接单", "待发货", "待收货", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "DeliveryReplenish") {
        this.orderType = "DeliveryReplenish";
        this.detailUrl = "DeliveryReplenishDetail";
        this.NavList = ["全部", "待支付", "待发货", "待收货", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "serviceReplenish") {
        this.orderType = "serviceReplenish";
        this.detailUrl = "serviceReplenishDetail";
        this.NavList = ["全部", "待支付", "待发货", "待收货", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "groups") {
        this.orderType = "groups";
        this.detailUrl = "groupDetail";
        this.NavList = ["全部", "拼团中", "待付款", "待发货", "待收货", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "lease_toy") {
        // 判断是否租凭订单
        this.orderType = "lease_toy";
        // 详情的路径
        this.detailUrl = "LeaseToyOrderDetail";
        this.NavList = ["全部", "待支付", "待发货", "待收货", "待归还", "已完成"];
      } else if (this.$route.name == "subsidiary") {
        // 订单
        this.orderType = "subsidiary";
        this.detailUrl = "supplierOrderdetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "auctioneer") {
        // 拍卖订单
        this.orderType = "auctioneer";
        this.detailUrl = "auctioneerOrderDetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "grabGroup") {
        this.orderType = "grabGroup";
        this.detailUrl = "orderdetail";
        this.NavList = ["抢团中", "待付款", "待发货", "待收货", "已完成"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "auction") {
        // 拍卖订单
        this.orderType = "auction";
        this.detailUrl = "auctionOrderDetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "newRetail") {
        this.orderType = "newRetail";
        this.detailUrl = "orderdetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "groupWork") {
        this.orderType = "groupWork";
        this.detailUrl = "orderdetail";
      } else if (this.$route.params.orderType && this.$route.params.orderType == "warehousePurchasing") {
        this.orderType = "warehousePurchasing";
        this.detailUrl = "orderdetail";
        this.NavList = ["全部", "待付款", "已完成", "已关闭"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "ysSystem") {
        this.orderType = "ysSystem";
        this.detailUrl = "orderdetail";
        this.NavList = ["全部"];
      } else if (this.$route.params.orderType && this.$route.params.orderType == "storeMang") {
        this.pageTitle = "订单管理";
        this.orderType = "storeMang";
        this.detailUrl = "storeOrderdetail";
      } else if (this.$route.params.orderType) {
        this.orderType = this.$route.params.orderType;
        this.detailUrl = "orderdetail";
      } else if (this.$route.params.stock) {
        this.orderType = "stock";
        this.detailUrl = "orderdetail";
      } else {
        this.orderType = "shop";
        this.detailUrl = "orderdetail";
      }
      if (this.NavList.length <= 0) {
        this.NavList = ["全部", "待付款", "待发货", "待收货", "已完成"];
      }
    },
    getOrderList(index, str) {
      console.log("list:::", this.orderType);
      // apiConfig 配置插件的请求api,请安装顶部标签页 this.NavList 的配置顺序填写对应的请求url
      //apiConfig为Map数据结构，key为this.orderType，value为api集合
      let apiConfig = new Map([
        ["cashier", ["plugin.store-cashier.frontend.Order.list", "plugin.store-cashier.frontend.Order.list.waitPay", "plugin.store-cashier.frontend.Order.list.Completed"]],
        [
          "store",
          [
            "plugin.store-cashier.frontend.store.center.order-list.index",
            "plugin.store-cashier.frontend.store.center.order-list.waitPay",
            "plugin.store-cashier.frontend.store.center.order-list.waitSend",
            "plugin.store-cashier.frontend.store.center.order-list.waitReceive",
            "plugin.store-cashier.frontend.store.center.order-list.Completed"
          ]
        ],
        [
          "supplier",
          [
            "plugin.supplier.frontend.order.index",
            "plugin.supplier.frontend.order.wait-pay",
            "plugin.supplier.frontend.order.wait-send",
            "plugin.supplier.frontend.order.wait-receive",
            "plugin.supplier.frontend.order.completed"
          ]
        ],
        [
          "hotel",
          [
            "plugin.hotel.frontend.hotel.list",
            "plugin.hotel.frontend.hotel.list.wait-pay",
            "plugin.hotel.frontend.hotel.list.wait-send",
            "plugin.hotel.frontend.hotel.list.wait-enter",
            "plugin.hotel.frontend.hotel.list.completed"
          ]
        ],
        [
          "hotel_center",
          [
            "plugin.hotel.frontend.hotel.center.order-list",
            "plugin.hotel.frontend.hotel.center.order-list.wait-pay",
            "plugin.hotel.frontend.hotel.center.order-list.wait-send",
            "plugin.hotel.frontend.hotel.center.order-list.wait-enter",
            "plugin.hotel.frontend.hotel.center.order-list.completed",
            "plugin.hotel.frontend.hotel.center.order-list.check-out"
          ]
        ],
        ["hotelcashier", ["plugin.hotel.frontend.Order.list", "plugin.hotel.frontend.Order.list.waitPay", "plugin.hotel.frontend.Order.list.Completed"]],
        [
          "onlineCar",
          [
            "plugin.net-car.frontend.order-list.index",
            "plugin.net-car.frontend.order-list.wait-pay",
            "plugin.net-car.frontend.order-list.loan-review",
            "plugin.net-car.frontend.order-list.loan",
            "plugin.net-car.frontend.order-list.pick-car",
            "plugin.net-car.frontend.order-list.license-number"
          ]
        ],
        [
          "lease_toy",
          [
            "plugin.lease-toy.api.order.order-list.index",
            "plugin.lease-toy.api.order.order-list.wait-pay",
            "plugin.lease-toy.api.order.order-list.wait-send",
            "plugin.lease-toy.api.order.order-list.wait-receive",
            "plugin.lease-toy.api.order.order-list.wait-refund",
            "plugin.lease-toy.api.order.order-list.completed"
          ]
        ],
        [
          "groups",
          [
            "plugin.fight-groups.frontend.controllers.list.index",
            "plugin.fight-groups.frontend.controllers.list.grouping",
            "plugin.fight-groups.frontend.controllers.list.waitPay",
            "plugin.fight-groups.frontend.controllers.list.waitSend",
            "plugin.fight-groups.frontend.controllers.list.waitReceive",
            "plugin.fight-groups.frontend.controllers.list.completed"
          ]
        ],
        [
          "subsidiary",
          [
            "plugin.subsidiary.frontend.order.index",
            "plugin.subsidiary.frontend.order.wait-pay",
            "plugin.subsidiary.frontend.order.wait-send",
            "plugin.subsidiary.frontend.order.wait-receive",
            "plugin.subsidiary.frontend.order.completed"
          ]
        ],
        [
          "auctioneer",
          [
            "plugin.auction.api.auctioneer-order",
            "plugin.auction.api.auctioneer-order.waitPay",
            "plugin.auction.api.auctioneer-order.waitSend",
            "plugin.auction.api.auctioneer-order.waitReceive",
            "plugin.auction.api.auctioneer-order.completed"
          ]
        ],
        [
          "auction",
          [
            "plugin.auction.api.auction-order",
            "plugin.auction.api.auction-order.waitPay",
            "plugin.auction.api.auction-order.waitSend",
            "plugin.auction.api.auction-order.waitReceive",
            "plugin.auction.api.auction-order.completed"
          ]
        ],
        [
          "grabGroup",
          [
            "plugin.snatch-regiment.api.order.grouping",
            "plugin.snatch-regiment.api.order.waitPay",
            "plugin.snatch-regiment.api.order.waitSend",
            "plugin.snatch-regiment.api.order.waitReceive",
            "plugin.snatch-regiment.api.order.completed"
          ]
        ],
        [
          "groupWork",
          [
            "plugin.group-work.frontend.modules.order.controllers.records.index",
            "plugin.group-work.frontend.modules.order.controllers.records.waitPay",
            "plugin.group-work.frontend.modules.order.controllers.records.waitSend",
            "plugin.group-work.frontend.modules.order.controllers.records.waitReceive",
            "plugin.group-work.frontend.modules.order.controllers.records.completed"
          ]
        ],
        [
          "warehouseTakeDelivery",
          [
            "plugin.warehouse.frontend.controllers.takeDelivery.order",
            "plugin.warehouse.frontend.controllers.takeDelivery.order.waitPay",
            "plugin.warehouse.frontend.controllers.takeDelivery.order.waitSend",
            "plugin.warehouse.frontend.controllers.takeDelivery.order.waitReceive",
            "plugin.warehouse.frontend.controllers.takeDelivery.order.completed"
          ]
        ],
        [
          "warehousePurchasing",
          [
            "plugin.warehouse.frontend.controllers.purchasing.order.index",
            "plugin.warehouse.frontend.controllers.purchasing.order.waitPay",
            "plugin.warehouse.frontend.controllers.purchasing.order.completed",
            "plugin.warehouse.frontend.controllers.purchasing.order.cancelled"
          ]
        ],
        ["stock", ["plugin.order-inventory.frontend.order-list.get-inventory-list"]],
        ["ysSystem", ["plugin.ys-system.frontend.history-order.index"]]
      ]);
      //defaultApi : 商城商品订单接口
      // let defaultApi = ["order.list", "order.list.waitPay", "order.list.waitSend", "order.list.waitReceive", "order.list.Completed"];
      let defaultApi = ["plugin.overseas.frontend.order-list", "plugin.overseas.frontend.order-list.waitPay", "plugin.overseas.frontend.order-list.waitSend", "plugin.overseas.frontend.order-list.waitReceive", "plugin.overseas.frontend.order-list.Completed"];
      let activeApiArr = []; //暂存获取到当前的api集合
      if (apiConfig.has(this.orderType)) {
        //先通过has()判断apiConfig是否给key
        activeApiArr = apiConfig.get(this.orderType); //获取key(即this.orderType)设置的api集合
      } else {
        activeApiArr = defaultApi; //has()为false。没配置，默认当作商城订单请求
      }

      try {
        if (this.orderType == "cashier") {
          this.action = this.NavApi[index] || activeApiArr[index];
        } else {
          this.action = activeApiArr[index];
        }
      } catch (error) {
        console.log("获取请求api数据失败报错：：", error);
      }

      if (this.orderType == "newRetail") {
        this.action = "plugin.new-retail.frontend.orderData.getList"; //特殊处理，新零售插件，所有状态一个接口，通过参数不同判断不同类型订单，后端处理
      }

      if (this.orderType == "storeMang") {
        this.action = "plugin.shop-assistant.frontend.order.order-list"; //特殊处理，平台店铺助手，所有状态一个接口，通过参数不同判断不同类型订单，后端处理
      }

      //加多了cofirmtype,组件更新点击了安钮需要更新下状态
      if (this.overSelected.indexOf(this.selected) < 0 || this.selected == 0) {
        this.overSelected.push(this.selected);
        this.getNetData(this.action, index);
      } else if (str === "refresh") {
        this.getNetData(this.action, index);
      }
    },
    toDetail(order) {
      this.$router.push(
        this.fun.getUrl("orderdetail", {
          order_id: order.id,
          isDetail: true,
          orderType: "supplier"
        })
      );
    },
    // 确认收货订单
    cofirmOrderAction(order) {
      if (this.selected == 0) {
        // 全部订单列表
        this.getOrderList(this.selected, "refresh");
      } else if (order == "pay") {
        this.getOrderList(this.selected, "refresh");
      } else {
        this.dataList.waitReceiveList.splice(this.dataList.waitReceiveList.indexOf(order), 1);
      }
    },
    // 待付款状态下-多订单合并支付,order_ids-订单id数组
    toMultiplePay() {
      // type-1订单支付，type-2订单合并支付

      this.$router.push(
        this.fun.getUrl("orderpay", {
          status: 2,
          order_ids: encodeURI(this.order_ids)
        })
      );
      // if(this.$refs.mychild && this.$refs.mychild.length > 1 && this.$refs.mychild[1]) {
      //   // 调用子组件的方法
      //   this.$refs.mychild[1].setCheckList();
      //   this.isMultiplePay = false;
      // }
    },
    // 接收到合并多订单支付的通知方法
    multiplePayAction(order_ids) {
      this.order_ids = order_ids;
      if (order_ids.length > 0) {
        this.isMultiplePay = true;
      } else {
        this.isMultiplePay = false;
      }
    },
    // 发起http请求
    getNetData(api, index) {
      var that = this;

      if (this.orderType == "supplier") {
        $http.post(api, { page: 1, keyword: this.keywords }, "正在获取订单").then(
          function(response) {
            if (response.result === 1) {
              that[`isLoadMore${index}`] = true;
              let myData = response.data;

              that[`total_page${index}`] = response.data.last_page;
              if (!that[`total_page${index}`]) {
                that[`total_page${index}`] = 0;
              }
              that.selectIndexData(index, myData.data);
              that.isLoading = false;
              if (response.basic_info) {
                localStorage.setItem("consolidated_payment", response.basic_info.consolidated_payment == "1" ? true : false);
                this.consolidated_payment = response.basic_info.consolidated_payment == "1" ? true : false;
              }
            } else {
              // 判断权限
              that.isLoading = false;
              if (response.data.url) {
                that.$notify(response.msg);
                window.location.href = response.data.url;
                return 0;
              }
            }
          },
          function(response) {
            // error callback
          }
        );
      } else if (this.orderType == "hotel" || this.orderType == "hotel_center") {
        $http
          .get(api, { page: 1 }, "正在获取订单")
          .then(response => {
            if (response.result === 1) {
              that[`isLoadMore${index}`] = true;
              let myData = response.data;

              that[`total_page${index}`] = response.data.last_page;
              if (!that[`total_page${index}`]) {
                that[`total_page${index}`] = 0;
              }
              if (response.basic_info) {
                localStorage.setItem("consolidated_payment", response.basic_info.consolidated_payment == "1" ? true : false);
                this.consolidated_payment = response.basic_info.consolidated_payment == "1" ? true : false;
              }
              that.selectIndexData(index, myData.data);
              that.isLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        let _Json = {
          page: 1,
          keyword: this.keywords
        };
        if (this.orderType == "newRetail") {
          let order_status = "";
          switch (Number(index)) {
          case 0:
            order_status = 5;
            break;
          case 1:
            order_status = 4;
            break;
          case 2:
            order_status = 1;
            break;
          case 3:
            order_status = 2;
            break;
          case 4:
            order_status = 3;
            break;
          default:
            order_status = 5;
          }
          _Json = {
            page: 1,
            "search[keyword]": this.keywords,
            "search[order_status]": order_status
          };
        }
        if (this.orderType == "storeMang") {
          let mapStatus = ["", "wait_pay", "wait_send", "wait_receive", "completed"];
          _Json = {
            page: 1,
            "search[search_type]": this.keywordType,
            "search[keyword]": this.keywords,
            status: mapStatus[index]
          };
        }
        $http.get(api, _Json, "正在获取订单").then(
          function(response) {
            if (response.result === 1) {
              that[`isLoadMore${index}`] = true;
              let myData = response.data;
              that[`total_page${index}`] = response.data.last_page;
              if (!that[`total_page${index}`]) {
                that[`total_page${index}`] = 0;
              }
              that.custom_receipt_confirmation_html = response.data.receipt_goods_notice;
              if (response.basic_info) {
                localStorage.setItem("consolidated_payment", response.basic_info.consolidated_payment == "1" ? true : false);
                that.consolidated_payment = response.basic_info.consolidated_payment == "1" ? true : false;
              }
              that.selectIndexData(index, myData.data);
              that.isLoading = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    // 选择对应index进行赋值
    selectIndexData(index, setData) {
      var that = this;
      if (index == 0) {
        that.dataList.orderList = setData;
      } else if (index == 1) {
        that.dataList.waitPayList = setData;
      } else if (index == 2) {
        that.dataList.waitSendList = setData;
      } else if (index == 3) {
        that.dataList.waitReceiveList = setData;
      } else if (index == 4) {
        that.dataList.waitCompleteList = setData;
      } else if (index == 5) {
        that.dataList.waitRefund = setData;
      } else if (index == 6) {
        that.dataList.alreadyComplete = setData;
      } else {
        console.log("error: selectIndexData()");
      }
    },

    getMoreData() {
      const that = this;
      that[`isLoadMore${that.selected}`] = false; // 防止多次请求分页数据

      if (that[`page${that.selected}`] >= that[`total_page${that.selected}`]) {
        return;
      } else {
        that[`page${that.selected}`] = that[`page${that.selected}`] + 1;
        let _Json = {
          page: that[`page${that.selected}`],
          keyword: this.keywords
        };
        if (this.orderType == "newRetail") {
          let order_status = "";
          switch (Number(index)) {
          case 0:
            order_status = 5;
            break;
          case 1:
            order_status = 4;
            break;
          case 2:
            order_status = 1;
            break;
          case 3:
            order_status = 2;
            break;
          case 4:
            order_status = 3;
            break;
          default:
            order_status = 5;
          }
          _Json = {
            page: that[`page${that.selected}`],
            "search[keyword]": this.keywords,
            "search[order_status]": order_status
          };
        }
        if (this.orderType == "storeMang") {
          let mapStatus = ["", "wait_pay", "wait_send", "wait_receive", "completed"];
          _Json = {
            page: that[`page${that.selected}`],
            "search[search_type]": this.keywordType,
            "search[keyword]": this.keywords,
            status: mapStatus[this.selected]
          };
        }
        $http.get(this.action, _Json, "正在获取更多订单").then(
          function(response) {
            that[`isLoadMore${that.selected}`] = true;
            if (response.result == 1) {
              var myData = response.data;

              if (that.selected == 0) {
                that.dataList.orderList = that.dataList.orderList.concat(myData.data); // 数组拼接
              } else if (that.selected == 1) {
                that.dataList.waitPayList = that.dataList.waitPayList.concat(myData.data);
              } else if (that.selected == 2) {
                that.dataList.waitSendList = that.dataList.waitSendList.concat(myData.data);
              } else if (that.selected == 3) {
                that.dataList.waitReceiveList = that.dataList.waitReceiveList.concat(myData.data);
              } else if (that.selected == 4) {
                that.dataList.waitCompleteList = that.dataList.waitCompleteList.concat(myData.data);
              } else if (that.selected == 5) {
                that.dataList.waitRefund = that.dataList.waitRefund.concat(myData.data);
              } else if (that.selected == 6) {
                that.dataList.alreadyComplete = that.dataList.alreadyComplete.concat(myData.data);
              } else {
                console.log("数组拼接报错");
              }
            } else {
              that[`page${that.selected}`] = that[`page${that.selected}`] - 1;
              that[`isLoadMore${that.selected}`] = false;
              return;
            }
          },
          function(response) {
            console.log(response.msg);
          }
        );
      }
    },
    // 获取酒店自定义字段
    getCustomizeHotelHead() {
      if (this.$route.params.orderType == "hotel") {
        console.log("这是酒店的订单");
        var isQuestHotel = localStorage.getItem("customizeHotelHead");
        if (!this.fun.isTextEmpty(isQuestHotel)) {
          var setHotelHead = JSON.parse(localStorage.getItem("customizeHotelHead"));
          this.fun.setWXTitle(setHotelHead.hotels + "订单");
        } else {
          $http
            .get("plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name", {}, "加载中...")
            .then(response => {
              if (response.result == 1) {
                this.fun.setWXTitle(response.data.hotels + "订单");
                localStorage.setItem("customizeHotelHead", JSON.stringify(response.data));
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      if (this.orderType == "shop") {
        this.getScrollTop() < 80 ? (this.amout = false) : (this.amout = true);
      }

      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
        //此处发起请求
        if (this[`isLoadMore${this.selected}`]) {
          this.getMoreData();
        } else {
          console.log("没有更多数据");
        }
      }
    }
  },
  computed: {
    // 返回的顶部导航栏列表
    setNavList() {
      return this.NavList;
    }
  },
  created() {
    this.last_status = this.selected;
  },
  mounted() {
    this.getCustomizeHotelHead();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === this.detailUrl || to.name === "o2oStore_v2" || to.name === "SupplierShop") {
      // 订单详情返回的时候不刷新页面
      window.order_keep = true;
    } else {
      window.order_keep = false;
    }
    next();
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  activated() {
    window.addEventListener("scroll", this.handleScroll);
    if (!window.order_keep) {
      this.initData();
      window.scrollTo(0, 0);
      // checkType统一判断
      this.checkType();
      this.getOrderList(this.selected);
    }
    zhuge.track('进入我的订单页面');
  },
  components: {
    cTitle,
    cOrderList
  }
};
