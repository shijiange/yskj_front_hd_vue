import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      selected: "0",
      pagesize: 1,
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      love_name: "", // 爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值

      // 全部
      allData: [],
      // 收入
      incomeData: [],
      //支出
      expendData: [],
      income_name_text: "",
    };
  },
  computed: {
    loveLang() {
      if (this.$store.state.shopLanguage.love) {
        return this.$store.state.shopLanguage.love;
      } else {
        return { change_income: "收入", change_expend: "支出"};
      }
    }
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;

      this.allData = [];
      this.incomeData = [];
      this.expendData = [];
    },
    // 更新
    // loadTop() {
    //   this.initData();
    //   this.getNetData(this.selected);
    //   this.$refs.coupon_loadmore.onTopLoaded();
    // },
    // 加载更多
    // loadBottom() {
    //   console.log("jfc", "loadBottom");
    //   // this.allLoaded = true; // 若数据已全部获取完毕,不在显示加载更多组件

    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page, this.selected);
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     Toast("没有更多数据");
    //   }
    // },

    // 切换优惠券状态列表
    switchItem() {
      // this.initData()
      this.getNetData(this.selected);
    },

    // 发起http请求
    getNetData(type) {
      var that = this;
      $http
        .get(
          "plugin.love.Frontend.Modules.Love.Controllers.love-records.index",
          { service_type: type, page: 1 },
          "正在获取"
        )
        .then(
          function (response) {
            if (response.result == 1) {
              var myData = response.data;
              if (type == 0) {
                that.allData = [];
                that.incomeData = [];
                that.expendData = [];
                that.allData = myData.data;
              } else if (type == 1) {
                that.allData = [];
                that.incomeData = [];
                that.expendData = [];
                that.incomeData = myData.data;
              } else if (type == 2) {
                that.allData = [];
                that.incomeData = [];
                that.expendData = [];
                that.expendData = myData.data;
              }
              that.isLoadMore = true;
              that.page = 1;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              that.$dialog.alert({message:response.msg});
              // Toast(response.msg)
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    getMoreData() {
      var that = this;
      this.isLoadMore = false;// 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.love.Frontend.Modules.Love.Controllers.love-records.index",
            { service_type: this.selected, page: this.page },
            "正在获取更多订单"
          )
          .then(
            function (response) {
              if (response.result == 1) {
                that.isLoadMore = true;
                var myData = response.data;
                if (that.selected == 0) {
                  that.allData = that.allData.concat(myData.data); // 数组拼接
                } else if (that.selected == 1) {
                  that.incomeData = that.incomeData.concat(myData.data);
                } else if (that.selected == 2) {
                  that.expendData = that.expendData.concat(myData.data);
                }
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              // error callback
            }
          );
      }
    },
    getUsable() {
      let that=this;
      $http
        .get("plugin.love.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result == 1) {
              this.usable = response.data.usable;
              this.love_name = response.data.love_name;
              this.fun.setWXTitle(this.love_name + "明细");
            } else {
              this.$dialog.alert({message:response.msg});
              
            }
          },
          function (response) {
            that.$dialog.alert({message:response.msg});
          }
        );
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  activated() {
    this.selected = "0";
    this.initData();
    this.getUsable();
    this.getNetData(0);
    this.customizeIncome();
  },
  components: { cTitle }
};
