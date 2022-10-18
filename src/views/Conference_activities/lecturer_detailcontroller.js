import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      member_id: "",
      id: "",
      activeName: "first",
      datas: [],
      lecturer: {},
      shop: [],
      isLoadMore: true,
      isShopMore: true,
      page: 1,
      shopPage: 1,
      total_page: 0,
      shop_total_page: 0,
      total: 0,
      shopTotal: 0,
      introduce: "",
      isLoading:false
    };
  },
  activated() {
    if (this.member_id === "" && !this.$route.params.member_id) {
      this.$router.go(-1);
    } else {
      if (this.$route.params.member_id) {
        this.member_id = this.$route.params.member_id;
        this.id = this.$route.params.id;
      }
      this.now = String(Date.parse(new Date())).substr(0, 10);
      this.activeName = "first";
      this.initData();
      this.getData();
      this.initShop();
      this.getShop();
    }
  },
  deactivated() {},
  mounted() {},

  methods: {
    handleScroll() {
      //滚动事件触发
      if (
        this.getScrollTop() + this.getClientHeight() + 105 >
        this.getScrollHeight()
      ) {
        //此处发起请求
        if (this.isLoadMore && this.activeName === "first") {
          this.getMoreData();
        } else if (this.isShopMore && this.activeName === "second") {
          this.getMoreShop();
        }
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes()) + ":";
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.datas = [];
      this.total = 0;
    },
    initShop() {
      this.shopPage = 1;
      this.shop_total_page = 0;
      this.isShopMore = true;
      this.shop = [];
      this.shopTotal = 0;
    },
    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.list_loadmore.onTopLoaded();
    },
    loadShop() {
      this.initShop();
      this.getShop();
      // this.$refs.shop_loadmore.onTopLoaded();
    },
    handleClick() {
      if (this.activeName === "first") {
        this.initData();
        this.getData();
      } else {
        this.initShop();
        this.getShop();
      }
    },
    toEnroll(item) {
      this.$router.push(
        this.fun.getUrl("enrollEnter", {
          id: item.id
        })
      );
    },
    gotoDetail(good) {
      this.$router.push(this.fun.getUrl("goods", { id: good.goods_id }));
    },
    //获取数据
    getData() {
      let that = this;
      let json = { member_id: this.member_id, page: 1 };
      $http
        .get("plugin.activity-apply.api.lecturer.getRelevance", json, "获取中")
        .then(
          response => {
            if (response.result == 1) {
              that.isLoadMore = true;
              that.total_page = response.data.list.last_page;
              that.total = response.data.list.total;
              if (!that.total_page) {
                that.total_page = 0;
              }
              if (response.data.list.data.length > 0) {
                that.introduce = response.data.lecturer.introduce;
                that.lecturer = response.data.lecturer;
                that.datas = response.data.list.data;
              }
              that.isLoading = false;
            } else {
              that.isLoading = false;
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getMoreData(page) {
      var that = this;
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let json = { member_id: this.member_id, page: this.page };
        $http
          .get(
            "plugin.activity-apply.api.lecturer.getRelevance",
            json,
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                that.total_page = response.data.list.last_page;
                that.datas = that.datas.concat(response.data.list.data);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    getShop() {
      let that = this;
      let json = { id: this.id, page: this.shopPage };
      $http
        .get("plugin.activity-apply.api.lecturer.getCourse", json, "获取中")
        .then(
          response => {
            if (response.result == 1) {
              that.isShopMore = true;
              that.shop_total_page = response.data.couser.last_page;
              that.shopTotal = response.data.couser.total;
              if (!that.shop_total_page) {
                that.total_page = 0;
              }
              if (response.data.couser.data.length > 0) {
                that.shop = response.data.couser.data;
              }
              that.isLoading = false;
            } else {
              that.isLoading = false;
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getMoreShop(page) {
      var that = this;
      if (this.shopPage === this.shop_total_page) {
        return;
      }
      if (this.shopPage >= this.shop_total_page) {
        that.shop_loading = true;
        that.shop_allLoaded = true;
        return;
      } else {
        this.shopPage = this.shopPage + 1;
        let json = { id: this.id, page: this.shopPage };
        $http
          .get("plugin.activity-apply.api.lecturer.getCourse", json, "加载中")
          .then(
            function(response) {
              if (response.result === 1) {
                that.shop_total_page = response.data.couser.last_page;
                that.shop = that.shop.concat(response.data.couser.data);
              } else {
                that.shopPage = that.shopPage - 1;
                that.isShopMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
