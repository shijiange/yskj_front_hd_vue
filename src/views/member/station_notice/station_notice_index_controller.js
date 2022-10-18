import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
import dateParserTime from "./dateParserTime";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      messageType: [],
      msgTypeUrl: {
        "img1": "stationNoticeLogistics",
        "img2": "stationNoticeExtract",
        "img3": "stationNoticeExamine",
        "img4": "stationNoticeCustomer",
        "img5": "stationNoticeProperty",
        "img6": "stationNoticeAnchor",
        "img7": "stationNoticeOrder",
        "img8": "stationNoticeActivity"
      },
      weekMessage: [],
      unreadCount: 0,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      msg_body_types: {
        1: {
          "title": "标题（商品名）:",
          "desc": "提示语（快递单号）:",
          "img": "商品图:"
        },
        2: {
          "applyTime": "申请时间:",
          "amounts": "提现金额:",
          "pay_way_name": "提现方式:"
        },
        3: {
          "title": "直播间标题:",
          "desc": "提示语:",
          "img": "直播间封面图:"
        },
        4: {
          "title": "标题（您于xx新增粉丝）:",
          "nickname": "会员昵称:",
          "pay_time": "付款时间:",
          "order_sn": "订单编号:",
          "goodsName": "商品名:",
          "pay_money": "订单金额:"
        },
        5: {
          "changeTime": "时间:",
          "changeType": "类型:",
          "changeNum": "变动金额:",
          "afterChange": "变动后:",
          "order_sn": "订单编号:",
          "order_amount": "订单金额:",
          "mall_amount": "商城销售额:",
          "amount": "分红结算金额:",
          "dividend_amount": "分红奖励金额:"
        },
        6: {
          "title": "直播间标题:",
          "img": "直播间封面图:"
        },
        7: {
          "nickname": "昵称:",
          "time": "时间:",
          "order_sn": "订单编号:",
          "goodsName": "商品名:",
          "pay_money": "订单金额:",
          "refund_money": "退款金额:"
        }

      }

    };
  },
  activated() {
    this.initData();
    this.getListData();
  },
  methods: {
    async setMessageRead() {
      let res = await $http.get("plugin.instation-message.api.message.read-message");
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.initData();
      this.getListData();

    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    async getListData() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.instation-message.api.message.index");
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }

      let messageType = res.data.messageType;
      let weekMessage = res.data.weekMessage.data;
      let unreadCount = 0;
      messageType.forEach((item) => {
        item.last_time = dateParserTime(item.last_time);
        unreadCount += item.no_read;
      });
      weekMessage.forEach((item) => {
        item.created_at = dateParserTime(item.created_at);
      });
      this.isLoadMore = true;
      this.total_page = res.data.weekMessage.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
      this.messageType = messageType;
      this.unreadCount = unreadCount;
      this.weekMessage = weekMessage;

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.instation-message.api.message.index", {
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.weekMessage.data;
              nextPageData.forEach((item) => {
                item.created_at = dateParserTime(item.created_at);
              });

              this.weekMessage = this.weekMessage.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    },
    gotoSetting() {
      this.$router.push(
        this.fun.getUrl("stationNoticeSetting")
      );
    },
    gotoMessagePage(type) {
      this.$router.push(
        this.fun.getUrl(this.msgTypeUrl[type.class_name], {}, {pageTitle: type.name})
      );
    },
    async goPages(item, key) {
      let res = await $http.get("plugin.instation-message.api.message.read-message", {
        id: item._id
      });
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.$set(this.weekMessage[key], "is_read", 0);
      if (item.url) {
        window.location = item.url;
      }
    }
  }
};
