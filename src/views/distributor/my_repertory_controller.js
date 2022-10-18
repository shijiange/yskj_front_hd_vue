import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show1: false,
      list: [],
      kwd: "",
      isLoadMore: true,
      page: 1,
      total_page: 0,
      getNum: 0,//兑换一次需要n张
      exchangeNum: 0,
      exchageLid: null,//当前项的库存id
      exchangeStock: null,//当前一项的信息
      exchangeStatus: 0
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.show1 = false;
      this.list = [];
      this.kwd = "";
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.getNum = 0;//兑换一次需要n张
      this.exchangeNum = 0;
      this.exchageLid = null;//当前项的库存id
      this.exchangeStock = null;//当前一项的信息
      this.exchangeStatus = 0;
    },
    showPop(_stock, _lid, _num) {
      this.exchangeStatus = 0;
      this.exchangeStock = _stock;
      this.exchageLid = _lid;
      this.getNum = _num;
      this.$nextTick(() => {
        this.show1 = true;
      });
    },
    getData() {
      let json = {};
      if (this.kwd) {
        json.kwd = this.kwd;
      }
      $http
        .post("plugin.channel.frontend.my-stock.getList", json, "").then(response => {
          if (response.result === 1) {
            this.kwd = '';
            this.list = response.data.list.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get("plugin.channel.frontend.my-stock.getList", json, "").then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.list = that.list.concat(myData); //数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        },
        function (response) {
          // error callback
        }
        );
      }
    },
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoStock(_gid, _option_id) {
      this.$router.push(this.fun.getUrl("distributor_stock", { goods_id: _gid, option_id: _option_id }));
    },
    allExchange() {
      this.exchangeNum = this.exchangeStock;
    },
    goodsExchange() {
      if (this.exchangeStatus) {
        this.$router.push(this.fun.getUrl("exchangeGoods"));
        return;
      }
      if (!this.exchangeNum) {
        Toast("请输入兑换数量！");
        return;
      }
      if (this.exchangeNum > this.exchangeStock) {
        Toast(`兑换数量不能大于库存数量，最多为${this.exchangeStock}`);
        this.allExchange();
        return;
      }
      $http
        .post("plugin.channel.frontend.my-stock.goodsExchange", { lid: this.exchageLid, num: this.exchangeNum }, "").then(response => {
          if (response.result === 1) {
            Toast("兑换成功！");
            this.exchangeStock = this.exchangeStock - this.exchangeNum;
            this.exchangeStatus = 1;
          } else {
            this.$dialog.alert({message:response.msg});
           
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoOrderGoods() {
      this.$router.push(this.fun.getUrl("orderGoods", {}));
    }
  },
  computed: {
    canExchangeNum() {
      return Math.floor(this.getNum * this.exchangeNum);
    }
  },
  components: { cTitle }
};
