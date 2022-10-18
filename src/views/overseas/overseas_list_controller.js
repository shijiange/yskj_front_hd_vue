import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      selected: "0",
      display: 1,
      pagesize: 1,
      //待使用
      wait_used: [],
      //已过期
      overdue: [],
      used: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      coin_name: "", //爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值
      income_name_text: "",
    };
  },
  methods: {
    initData() {
      this.page = 1;
      this.goload = true;
      this.total_page = 0;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
    },
    //切换优惠券状态列表
    switchItem() {
      //this.initData();
      this.getNetData(this.selected);
    },
    //发起http请求
    getNetData(type) {
      var that = this;
      $http
        .get(
          "plugin.coin.Frontend.Modules.Coin.Controllers.change-records.index",
          { service_type: type, page: 1 },
          "正在获取..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              var myData = response.data;
              that.total_page = response.data.total;
              if (type == 0) {
                that.wait_used = [];
                that.overdue = [];
                that.used = [];
                that.wait_used = myData;
              } else if (type == 1) {
                that.wait_used = [];
                that.overdue = [];
                that.used = [];
                that.overdue = myData;
              } else if (type == 2) {
                that.wait_used = [];
                that.overdue = [];
                that.used = [];
                that.used = myData;
              }
            } else {
              that.$dialog.alert({message:response.msg});
              //Toast(response.msg);
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    getMoreData(page, type) {
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "coupon.member-coupon.coupons-of-member-by-status",
            {
              status_request: type,
              page: this.page,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
            },
            "正在获取更多订单"
          )
          .then(
            function(response) {
              if (response.result == 1) {
                var myData = response.data;

                that.loading = false;
                that.allLoaded = false;
                if (index == 1) {
                  that.wait_used = that.wait_used.concat(myData.data); //数组拼接
                } else if (index == 2) {
                  tthat.overdue = that.overdue.concat(myData.data);
                } else {
                  that.used = that.used.concat(myData.data);
                }
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
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
    getUsable() {
      $http
        .get("plugin.coin.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result == 1) {
              this.usable = response.data.usable;
              this.coin_name = response.data.coin_name;
            } else {
              this.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            this.$dialog.alert({message:response});
          }
        );
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  activated() {
    //this.selected = 0;
    //this.initData();
    this.used = [];
    this.wait_used = [];
    this.overdue = [];
    this.getUsable();
    this.getNetData(0);
    this.customizeIncome();
    // this.$on('selected_coupon', (params) => {
    //     console.log(params.coupon_id);
    // });
  },
  components: { cTitle }
};
