import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      toi: this.fun.getKeyByI(),
      selected: "0",
      //待评价
      wait: [],
      waitLoadMore: false, //待评价是否能加载更多
      waitPage: 1,
      waitLastPage: 0,
      //已评价
      comment: [],
      commentLoadMore: false, //已评价是否能加载更多
      commentPage: 1,
      commentLastPage: 0,
      //其他
      other: []
    };
  },
  methods: {
    swichTabTItem() {
      if (this.selected == 0 || this.selected == 1) {
        if (this.selected == 0) {
          this.wait = [];
          this.waitLoadMore = false;
          this.waitLastPage = 0;
          this.waitPage = 1;
        } else if (this.selected == 1) {
          if (this.selected == 1) {
            this.comment = [];
            this.commentLoadMore = false;
            this.commentLastPage = 0;
            this.commentPage = 1;
          }
        }
        this.getNetData(this.selected);
      } else {
        this.getOtherData();
      }
    },
    initData() {
      this.toi = this.fun.getKeyByI();
      this.selected = "0";
      this.wait = [];
      this.waitLoadMore = false;
      this.waitPage = 1;
      this.waitLastPage = 0;
      this.comment = [];
      this.commentLoadMore = false;
      this.commentPage = 1;
      this.commentLastPage = 0;
      this.other = [];
    },
    handleScroll() {
      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
        //此处发起请求
        if (this.waitLoadMore || this.commentLoadMore) {
          this.getMoreData();
        } else {
          console.log("没有更多数据");
        }
      }
    },
    opration(btn, item) {
      //value-1 追加评价value-2 查看评价详情
      if (btn.value == 1) {
        this.$router.push({ name: "addevaluate", params: { item: item, order_id: item.order.id }, query: { i: this.toi } });
      } else {
        //CommentDetails
        this.$router.push({
          name: "CommentDetails",
          params: {
            order_id: item.has_one_comment.order_id,
            goods_id: item.has_one_comment.goods_id,
            comment_id: item.has_one_comment.id,
            order_goods_id: item.id,
            uid: 0
          },
          query: { i: this.toi }
        });
      }
    },
    //追加评价
    // reComment() {

    //   this.$router.push({ name: "addevaluate", params: { order: null, form: 0 }, query: { i: this.toi } });

    // },
    //评价
    toComment(order_id, good) {
      //console.log(order_id);
      //console.log(good);
      zhuge.track('我的评价页面-点击去评价',{
        '订单号':good.order.order_sn,
        '商品名称':good.title,
        '商品id':good.goods_id,
        '商品数量':good.total,
        '商品价格':good.price
      });
      this.$router.push({ name: "evaluate", params: { order_id: order_id, id: good.id }, query: { i: this.toi,order_sn:good.order.order_sn} });
    },
    // getNetData(status) {
    //   var that = this;
    //   $http.get('order.my-comment', { status: status, "i": this.fun.getKeyByI(), "type": this.fun.getTyep() }, '正在获取...').then(function (response) {
    //     console.log(response)
    //     if (response.result == 1) {

    //       var myData = response.data;
    //       if (status == 0) {
    //         that.wait = myData.list;

    //       } else if (status == 1) {

    //         that.comment = myData.list
    //       } else {
    //         that.other = myData.list;
    //       }

    //     }
    //   }, function (response) {
    //     // error callback
    //   });
    // },
    getNetData(status) {
      let json = {
        status: status,
        page: status == "0" ? this.waitPage : this.commentPage
      };
      $http
        .get("order.my-comment.paging", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            if (status == 0) {
              this.waitLoadMore = true;
              this.waitLastPage = response.data.list.last_page;
              if (!this.waitLastPage) {
                this.waitLastPage = 0;
              }
              if (response.data.list.data.length > 0) {
                this.wait = response.data.list.data;
              }
            } else if (status == 1) {
              this.commentLoadMore = true;
              this.commentLastPage = response.data.list.last_page;
              if (!this.commentLastPage) {
                this.commentLastPage = 0;
              }
              if (response.data.list.data.length > 0) {
                this.comment = response.data.list.data;
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      if (this.selected == "0") {
        this.waitLoadMore = false;
        let json = {
          status: Number(this.selected),
          page: this.selected == "0" ? this.waitPage : this.commentPage
        };
        if (this.waitPage >= this.waitLastPage) {
          return;
        } else {
          this.waitPage = this.waitPage + 1;
          json.page = this.waitPage;
          $http
            .get("order.my-comment.paging", json, "加载中")
            .then(response => {
              this.waitLoadMore = true;
              if (response.result === 1) {
                this.wait = this.wait.concat(response.data.list.data);
              } else {
                this.waitPage = this.waitPage - 1;
                this.waitLoadMore = false;
                return;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else if (this.selected == "1") {
        this.commentLoadMore = false;
        let json = {
          status: Number(this.selected),
          page: this.selected == "0" ? this.waitPage : this.commentPage
        };
        if (this.commentPage >= this.commentLastPage) {
          return;
        } else {
          this.commentPage = this.commentPage + 1;
          json.page = this.commentPage;
          $http
            .get("order.my-comment.paging", json, "加载中")
            .then(response => {
              this.commentLoadMore = true;
              if (response.result === 1) {
                this.comment = this.comment.concat(response.data.list.data);
              } else {
                this.commentPage = this.commentPage - 1;
                this.commentLoadMore = false;
                return;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    //获取其他评价的
    getOtherData() {
      var that = this;
      $http.get("order.myComment.goods", { i: this.fun.getKeyByI(), type: this.fun.getTyep() }, "正在获取...").then(
        function(response) {
          if (response.result == 1) {
            var myData = response.data;
            that.other = myData.list;
          }
        },
        function(response) {
          // error callback
        }
      );
    }
  },
  activated() {
    this.initData();
    this.toi = this.fun.getKeyByI();
    this.getNetData(this.selected);
    this.$on("selected", text => {
      this.selected = text;
    });
    zhuge.track('进入我的评价页面');
  },
  created() {},
  components: { cTitle }
};
