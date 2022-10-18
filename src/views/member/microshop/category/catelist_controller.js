import { mapState, mapMutations } from "vuex";
import cGoodsList from "components/goodsList1";
import cSort from "components/sort";
import { Toast } from 'vant';
import { scrollMixin } from "../../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      amout: false,
      bottomStatus: "",
      wrapperHeight: 0,
      order_by: "",
      order_field: "",
      datas: [],
      totalGoodsNum: 0,
      pushData: "",
      setData: {},//存储选择的商品

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数

    };
  },

  computed: mapState([
    "message", "blurst", "view"
  ]),
  ...mapMutations(["views"]),
  mounted() {
    this.slider();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) { //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    pushFn() {
      let that = this;

      console.log("进行数据提交");
      console.log(this.pushData);

      if (this.fun.isTextEmpty(this.pushData) || this.pushData.length == 0) {
        Toast("请选择商品");
        return;
      }

      $http.get("plugin.micro.frontend.controllers.MicroShop.set-goods", { "goods_ids": this.pushData }, "提交中").then(function(response) {
        console.log(response);
        if (response.result == 1) {
          that.$router.push(that.fun.getUrl("microShop_home", { fromHome: 1 }));
        } else {
          console.log(response);
        }
      }, function(response) {
        console.log(response);
      });
    },
    changeTotal(va) {
      let num = 0;
      this.pushData = "";
      for (let i in va) {
        if (va[i]) {
          num++;
          this.pushData += i + ",";
        }
      }
      this.totalGoodsNum = num;
    },

    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top < 80) {
          that.amout = false;
        } else {
          that.amout = true;
        }
      };

    },
    goback() {
      this.$router.go(-1);
    },
    search() {
      this.datas = [];
      this.gotoSearch();
    },
    gotoSearch() {
      let srtArr = JSON.parse(this.$route.params.id);

      $http.get("plugin.micro.frontend.controllers.MicroShop.goods.search-goods", {
        "search[keyword]": this.inputs,
        "page": 1,
        "search[category]": srtArr,
        order_field: this.order_field,
        order_by: this.order_by,
        "search[couponid]": this.$route.params.coupon
      }).then((json) => {
        if (json.result == 1) {
          this.isLoadMore = true;
          // 搜索结果为空
          if (json.data.data.length <= 0) {
            this.isLoadMore = false;
            return;
          }
          this.page = json.data.current_page;
          this.total_page = json.data.last_page;
          // 如果当前页数大于总页数 就不加载了
          if (json.data.current_page > json.data.last_page) {
            this.isLoadMore = false;
            return;
          }
          this.datas = json.data.data;

          if (json.data.data.length < 20) {
            this.isLoadMore = false;
          }
        }
      });
    },
    getMoreData() {
      let srtArr = JSON.parse(this.$route.params.id);

      console.log("加载更多启动");
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {
          "search[keyword]": this.inputs,
          page: that.page,
          "search[category]": srtArr,
          order_field: this.order_field,
          order_by: this.order_by,
          "search[couponid]": this.$route.params.coupon
        };
        $http
          .get("plugin.micro.frontend.controllers.MicroShop.goods.search-goods", json, "loading")
          .then(res => {
            if (res.result == 1) {
              that.isLoadMore = true;
              let nextPageData = res.data.data;
              that.datas = that.datas.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  activated() {
    this.totalGoodsNum = 0;
    this.setData = {};
    this.amout = false;
    this.slider();
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top; //keep分类不相同时，重载数据
    this.datas = [];
    this.order_field = "";
    this.order_by = "";
    this.gotoSearch();
  },

  components: {
    cGoodsList,
    cSort
  }
};
