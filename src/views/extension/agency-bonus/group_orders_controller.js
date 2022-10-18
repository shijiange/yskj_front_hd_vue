import cTitle from "components/title";
import cOrderList from "components/orderList";
const documentElement = document.documentElement;
const body = document.body;
// import { scrollMixin } from "../../../utils/mixin"; // 引入加载更多

export default {
  data() {
    return {
      order_type: 4,
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
        alreadyComplete: []
      },
      action: "",
      // 待付款-多订单合并付款的订单id数组
      order_ids: [],
      checkList: [],
      // 是否开启合并支付
      isMultiplePay: false,

      // shop 商城，cashier 收银台 store 门店
      orderType: "shop",

      // 顶部导航栏列表
      NavList: [],
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
      isLoading:false
    };
  },
  methods: {
    swichTabTItem() {
      window.scrollTo(0, 0);
      this.getOrderList(this.selected);
    },
    initData() {
      this.order_type = 4;
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
    showMore(obj) {
      if (obj.show) {
        obj.show = false;
        return;
      }
      this.$set(obj, "show", true);
    },
    // 更新
    loadTop() {
      this.initData();
      this.getOrderList(this.selected);
      // this.$refs.loadmore.onTopLoaded();
    },
    getOrderList(index, str) {
      this.action = "plugin.agent-dividend.api.controllers.order.index";
      // this.action
      if (index == 0) {
        this.order_type = 4;
      } else if (index == 1) {
        this.order_type = 0;
      } else if (index == 2) {
        this.order_type = 1;
      } else if (index == 3) {
        this.order_type = 3;
      } else {
        this.action = "plugin.agent-dividend.api.controllers.order.index";
      }

      // 酒店
      //加多了cofirmtype,组件更新点击了安钮需要更新下状态
      if (this.overSelected.indexOf(this.selected) < 0) {
        this.overSelected.push(this.selected);
        this.getNetData(this.action, index);
      }
      if (str ==='refresh') {
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
    // 发起http请求
    getNetData(api, index) {
      let that = this;
      $http
        .get(
          api,
          {
            page: 1,
            order_type: this.order_type
          },
          "正在获取订单"
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that[`isLoadMore${index}`] = true;
              var myData = response.data;

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
        $http
          .get(
            this.action,
            {
              page: that[`page${that.selected}`],
              order_type: this.order_type
            },
            "正在获取更多订单"
          )
          .then(
            function(response) {
              that[`isLoadMore${that.selected}`] = true;
              if (response.result == 1) {
                var myData = response.data;

                if (that.selected == 0) {
                  that.dataList.orderList = that.dataList.orderList.concat(
                    myData.data
                  ); // 数组拼接
                } else if (that.selected == 1) {
                  that.dataList.waitPayList = that.dataList.waitPayList.concat(
                    myData.data
                  );
                } else if (that.selected == 2) {
                  that.dataList.waitSendList = that.dataList.waitSendList.concat(
                    myData.data
                  );
                } else if (that.selected == 3) {
                  that.dataList.waitReceiveList = that.dataList.waitReceiveList.concat(
                    myData.data
                  );
                } else if (that.selected == 4) {
                  that.dataList.waitCompleteList = that.dataList.waitCompleteList.concat(
                    myData.data
                  );
                } else if (that.selected == 5) {
                  that.dataList.waitRefund = that.dataList.waitRefund.concat(
                    myData.data
                  );
                } else if (that.selected == 6) {
                  that.dataList.alreadyComplete = that.dataList.alreadyComplete.concat(
                    myData.data
                  );
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
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if (
        this.getScrollTop() + this.getClientHeight() + 105 >
        this.getScrollHeight()
      ) {
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

      this.NavList = ["全部", "待付款", "已付款", "已完成"];

      return this.NavList;
    }
  },
  created() {
    this.last_status = this.selected;
  },

  updated() {
    //  window.scrollTo(0, 0);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  activated() {
    window.addEventListener("scroll", this.handleScroll);

    this.orderType = "shop";

    this.initData();
    // this.selected = this.$route.params.status; // this.$store.state.status
    this.getOrderList(this.selected);
  },
  components: {
    cTitle,
    cOrderList
  }
};
