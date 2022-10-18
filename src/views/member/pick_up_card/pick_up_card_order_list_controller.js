import cTitle from "components/title";
import cOrderList from "components/orderList";

const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      selected: 0,
      last_status: 0,
      dataList: {
        // 全部订单
        orderList: [],
        // 待付款
        // waitPayList: [],

        waitSendList: [],
        waitReceiveList: [],
        // waitCompleteList: [],
        // waitRefund: [],
        alreadyComplete: [],
        refunded: []
      },
      NavList: ["全部", "待发货", "待收货", "已完成", "已退款"],

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

      orderType: "pickup_card",
      detailUrl: "orderdetail",
      menu_group: {},
      isLoading: false,

      plugin_name: "旅游激活卡",

      apiArr: [
        "plugin.picking-card.frontend.PickingOrder.index",
        "plugin.picking-card.frontend.PickingOrder.waitSend",
        "plugin.picking-card.frontend.PickingOrder.waitReceive",
        "plugin.picking-card.frontend.PickingOrder.completed",
        "plugin.picking-card.frontend.PickingOrder.refund"
      ]
    };
  },
  methods: {
    swichTabTItem() {
      // this.initData();
      window.scrollTo(0, 0);
      this.getOrderList(this.selected);
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
    initData() {
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

      this.dataList = {
        // 全部订单
        orderList: [],
        // 待付款

        waitSendList: [],
        waitReceiveList: [],

        alreadyComplete: [],
        refunded: []
      };
    },
    loadTop() {
      this.initData();
      this.getOrderList(this.selected);
      // this.$refs.loadmore.onTopLoaded();
    },
    getOrderList(index, str) {
      this.action = this.apiArr[index];

      this.getNetData(this.action, index);
      if (str === "refresh") {
        this.getNetData(this.action, index);
      }
    },
    toDetail(order) {
      this.fun.getUrl("orderdetail", { order_id: order.id });
    },
    getNetData(api, index) {
      var that = this;
      $http
        .get(
          api,
          {
            page: 1
          },
          "正在获取订单"
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that[`isLoadMore${index}`] = true;
              var myData = response.data;
              that.menu_group = response.data.menu_group;
              that[`total_page${index}`] = response.data.last_page;
              if (!that[`total_page${index}`]) {
                that[`total_page${index}`] = 0;
              }

              that.selectIndexData(index, myData.data);
              that.isLoading = false;
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    selectIndexData(index, setData) {
      var that = this;
      if (index == 0) {
        that.dataList.orderList = setData;
      } else if (index == 1) {
        that.dataList.waitSendList = setData;
      } else if (index == 2) {
        that.dataList.waitReceiveList = setData;
      } else if (index == 3) {
        that.dataList.alreadyComplete = setData;
      } else if (index == 4) {
        that.dataList.refunded = setData;
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
        $http
          .get(
            this.action,
            {
              page: that[`page${that.selected}`]
            },
            "正在获取更多订单"
          )
          .then(
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
      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
        //此处发起请求
        if (this[`isLoadMore${this.selected}`]) {
          this.getMoreData();
        } else {
          console.log("没有更多数据");
        }
      }
    },
    toPickCard() {
      let _params = {};
      if (this.orderType == "picking-card-one") _params = { plugin: "one" };
      this.$router.push(this.fun.getUrl("pickUpCardIndex", _params));
    },
    toPickCardMy() {
      this.$router.push(this.fun.getUrl("pickUpCardMy"));
    }
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  activated() {
    if (this.$route.name == "pickUpCardOrderListOne") {
      //#78882，提货卡一期独立的新插件picking-card-one
      this.orderType = "picking-card-one";
      this.fun.setWXTitle("提货卡");
      this.plugin_name = "提货卡";
      this.apiArr = [
        "plugin.picking-card-one.frontend.PickingOrder.index",
        "plugin.picking-card-one.frontend.PickingOrder.waitSend",
        "plugin.picking-card-one.frontend.PickingOrder.waitReceive",
        "plugin.picking-card-one.frontend.PickingOrder.completed",
        "plugin.picking-card-one.frontend.PickingOrder.refund"
      ];
    } else {
      this.fun.setWXTitle("旅游激活卡订单");
    }
    window.addEventListener("scroll", this.handleScroll);
    this.initData();
    window.scrollTo(0, 0);
    this.selected = "0";
    this.getOrderList(this.selected);
  },
  components: {
    cTitle,
    cOrderList
  }
};
