import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show1: false,
      inputs: "",
      goodList: [],
      chooseGoods: null,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getRecommendGoods();
  },
  methods: {
    initData() {
      this.inputs = "";
      this.show1 = false;

      this.goodList = [];
      this.chooseGoods = null;

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getRecommendGoods() {
      $http
        .get("plugin.video-share.frontend.goods.getRecommendGoods", {
          page: 1
        })
        .then(res => {
          if (res.result == 1) {
            this.goodList = res.data.list.data;
            this.total_page = res.data.list.last_page;
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        });
    },
    getData() {
      $http
        .get("plugin.video-share.frontend.goods.getGoodsByKeyword", {
          keyword: this.inputs
        })
        .then(res => {
          if (res.result == 1) {
            this.goodList = res.data.list.data;
            this.total_page = res.data.list.last_page;
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let url = !this.inputs ? "plugin.video-share.frontend.goods.getRecommendGoods" : "plugin.video-share.frontend.goods.getGoodsByKeyword";
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let params = !this.inputs ? { page: that.page } : { page: that.page, keyword: this.inputs };
        $http.get(url, params, "加载中").then(
          function(response) {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              that.goodList = that.goodList.concat(myData); //数组拼接
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
    chooseGood(_id) {
      this.chooseGoods = _id;
    },
    gotoRelease() {
      if (this.fun.isTextEmpty(this.chooseGoods)) {
        this.$dialog.alert({ message: "选择的商品为空" });
        return;
      } else {
        let _query = { goods_id: this.chooseGoods };
        if (this.$route.query.ysi) {
          _query.ysi = this.$route.query.ysi;
        }
        this.$router.push(this.fun.getUrl("releaseVideo", {}, _query));
      }
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getData();
      }
    },
    goBack() {
      let _query = { goods_id: this.chooseGoods };
      if (this.$route.query.ysi) {
        _query.ysi = this.$route.query.ysi;
      }
      this.$router.push(this.fun.getUrl("releaseVideo", {}, _query));
    }
  },
  components: { cTitle }
};
