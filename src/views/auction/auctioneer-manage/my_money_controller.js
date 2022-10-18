import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      selected: "",
      //代打款
      waitPay: [],
      //打款
      pay: [],
      //待审核
      review: [],
      //无效数据
      invalid: [],
      //全部数据
      all: [],
      // loadMore
      loading: false,
      allLoaded: false,
      goload: false,
      orderType: "",
      ratioDatas: [],
      api: "",
      withdrawal_type: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },
  methods: {
    swichTabTItem() {
      if (this.orderType === "supplier") {
        this.getSupplierNetData();
      } else if (this.orderType === "extension") {
        this.getData(this.selected);
      } else {
        this.getNetData(this.selected);
      }
    },
    //发起http请求
    getNetData(status) {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http
        .get(
          "finance.withdraw.withdraw-list",
          { status: status, withdrawal_type: this.withdrawal_type },
          "正在获取列表"
        )
        .then(
          response => {
            if (response.result === 1) {
              that.allLoaded = false;
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              this.ratioDatas = [];
              //组装数据
              let itemDay = {};
              itemDay.money = response.data.today;
              itemDay.data = "今日";
              itemDay.name = "data";
              that.ratioDatas.push(itemDay);

              let itemYesterday = {};
              itemYesterday.money = response.data.yesterday;
              itemYesterday.data = "昨日";
              itemYesterday.name = "data";
              that.ratioDatas.push(itemYesterday);

              let itemWeek = {};
              itemWeek.money = response.data.lastweek;
              itemWeek.data = "本周";
              itemWeek.name = "data";
              that.ratioDatas.push(itemWeek);

              let itemMonth = {};
              itemMonth.money = response.data.thismonth;
              itemMonth.data = "本月累计提成";
              itemMonth.name = "mounth";
              that.ratioDatas.push(itemMonth);
              var mydata = response.data.data;

              if (that.selected.length == 0 || that.selected == 3) {
                //全部
                that.all = mydata;
              } else if (that.selected == 0) {
                //待审核
                that.review = mydata;
              } else if (that.selected == 1) {
                //待打款
                that.waitPay = mydata;
              } else if (that.selected == 2) {
                //打款
                that.pay = mydata;
              } else if (that.selected == -1) {
                //无效
                that.invalid = mydata;
              }
              that.isLoading = false;
            } else {
              Toast(response.msg);
              this.isLoading = false;
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getData(status) {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http
        .get(
          "finance.withdraw.withdraw-log",
          { status: status },
          "正在获取列表"
        )
        .then(
          response => {
            if (response.result === 1) {
              that.allLoaded = false;
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              let mydata = response.data.data;

              if (that.selected.length == 0) {
                //全部
                that.all = mydata;
              } else if (that.selected == 0) {
                //待审核
                that.review = mydata;
              } else if (that.selected == 1) {
                //待打款
                that.waitPay = mydata;
              } else if (that.selected == 2) {
                //打款
                that.pay = mydata;
              } else if (that.selected == -1) {
                //无效
                that.invalid = mydata;
              }
              that.isLoading = false;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //供应商
    getSupplierNetData() {
      if (this.selected.length == 0 || this.selected == 3) {
        //全部
        this.api = "plugin.supplier.frontend.withdraw-log.index";
      } else if (this.selected == 0) {
        //待审核
        this.api = "plugin.supplier.frontend.withdraw-log.applying";
      } else if (this.selected == 1) {
        //待打款
        this.api = "plugin.supplier.frontend.withdraw-log.pending";
      } else if (this.selected == 2) {
        //打款
        this.api = "plugin.supplier.frontend.withdraw-log.already";
      } else if (this.selected == -1) {
        //无效
        this.api = "plugin.supplier.frontend.withdraw-log.reject";
      }
      const that = this;
      $http
        .get(
          that.api,
          {
            member_id: that.member_id
          },
          "正在获取列表"
        )
        .then(
          response => {
            var mydata = response.data.data;
            that.total_page = mydata.total;
            that.allLoaded = false;
            if (!that.total_page) {
              that.total_page = 0;
            }
            if (that.selected.length == 0 || that.selected == 3) {
              //全部
              that.all = mydata;
            } else if (that.selected == 0) {
              //待审核
              that.review = mydata;
            } else if (that.selected == 1) {
              //待打款
              that.waitPay = mydata;
            } else if (that.selected == 2) {
              //打款
              that.pay = mydata;
            } else if (that.selected == -1) {
              //无效
              that.invalid = mydata;
            }
            that.isLoading = false;
          },
          function(response) {
            // error callback
          }
        );
    },
    //更新
    loadTop() {
      this.initData();
      if (this.orderType === "supplier") {
        this.getSupplierNetData();
      } else if (this.orderType === "extension") {
        this.getData(this.selected);
      } else {
        this.getNetData(this.selected);
      }
      // this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        console.log("加载更多");
        if (this.orderType === "supplier") {
          this.getMoreData1(this.page, this.selected);
        } else if (this.orderType === "extension") {
          this.getData(this.selected);
        } else {
          this.getMoreData();
        }
        this.$refs.loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {};
      if (this.orderType === "supplier") {
        json = {
          status: this.selected,
          member_id: that.member_id
        };
      } else if (this.orderType === "extension") {
        this.api = "finance.withdraw.withdraw-log";
        json = {
          status: this.selected
        };
      } else {
        this.api = "finance.withdraw.withdraw-list";
        json = {
          status: this.selected,
          withdrawal_type: this.withdrawal_type
        };
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get(this.api, json, "加载中")
          .then(
            response => {
              that.isLoadMore = true;
              that.loading = false;
              that.allLoaded = false;
              if (response.result === 1) {
                var mydata = response.data.data;

                if (that.selected.length == 0 || that.selected == 3) {
                  //全部
                  that.all = that.all.concat(mydata);
                } else if (that.selected == 0) {
                  //待审核
                  that.review = that.review.concat(mydata);
                } else if (that.selected == 1) {
                  //待打款
                  that.waitPay = that.waitPay.concat(mydata);
                } else if (that.selected == 2) {
                  //打款
                  that.pay = that.pay.concat(mydata);
                } else if (that.selected == -1) {
                  //无效
                  that.invalid = that.invalid.concat(mydata);
                }
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    getMoreData1(page, index) {
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
            that.api,
            {
              page: this.page,
              member_id: that.member_id
            },
            "正在获取更多订单"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                var myData = response.data.data;

                that.loading = false;
                that.allLoaded = false;
                if (index.length == 0) {
                  //全部
                  that.all = that.all.concat(myData); //数组拼接
                } else if (index == 0) {
                  //待审核
                  that.review = that.review.concat(myData);
                } else if (index == 1) {
                  //待打款
                  that.waitPay = that.waitPay.concat(myData);
                } else if (index == 2) {
                  //打款
                  that.pay = that.pay.concat(myData);
                } else if (index == -1) {
                  //无效
                  that.invalid = that.invalid.concat(myData);
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
    initData() {
      this.page = 1;
      this.goload = true;
      this.total_page = 0;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.ratioDatas = [];
    }
  },
  activated() {
    this.initData();
    this.withdrawal_type = this.$route.query.from;
    if (this.$route.params.supplier === "supplier") {
      this.orderType = "supplier";
      this.member_id = this.$route.params.member_id;
      this.fun.setWXTitle("我的" + this.fun.initWithdrawal());
      this.getSupplierNetData();
    } else if (this.$route.query.extension === "extension") {
      this.orderType = "extension";
      this.api = "finance.withdraw.withdraw-log";
      this.getData("");
    }
    else {
      this.orderType = "store";
      this.selected = "3";
      this.getNetData(3);
    }
  },
  components: { cTitle }
};
