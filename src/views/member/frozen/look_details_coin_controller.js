import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
var type = 0;
// var currentTabIndex = "0";

var is_first_content = false;
var is_second_content = false;
var is_third_content = false;
export default {
  mixins: [scrollMixin], //加载更多
  components: { cTitle },
  data() {
    return {
      all_con: [],
      income_con: [],
      pay_con: [],
      active_tab: "all",

      //全部
      all_loading: false,
      all_allLoaded: false,
      all_goload: true,
      all_isLoadMore: true,
      all_page: 1,
      all_total_page: 0,

      //收入
      income_loading: false,
      income_allLoaded: false,
      income_goload: true,
      income_isLoadMore: true,
      income_page: 1,
      income_total_page: 0,

      //支出

      pay_loading: false,
      pay_allLoaded: false,
      pay_goload: true,
      pay_isLoadMore: true,
      pay_page: 1,
      pay_total_page: 0,

      income_name_text: "",
      isLoading:false
    };
  },

  activated() {
    this.initData();
    this.getData();
    this.customizeIncome();
  },
  methods: {
    handleClick(tab) {
      //console.log(tab.name);
      let index = 9999;
      //因为修改组建改方法this.name
      switch (this.active_tab) {
      case "all":
        //type = 0;
        index = 0;
        break;
      case "income":
        //type = 1;
        index = 1;
        break;
      case "pay":
        //type = 2;
        index = 2;
        break;
      default:
        break;
      }

      if (type == index) {
        return;
      } else {
        type = index;
      }

      console.log(type);

      this.getData();
    },

    //获取数据
    getData() {
      if (type == 0 && !is_first_content) {
        is_first_content = true;
        this.getAllData();
      } else if (type == 1 && !is_second_content) {
        is_second_content = true;
        this.getIncomeData();
      } else if (type == 2 && !is_third_content) {
        is_third_content = true;
        this.getPayData();
      }
    },

    getUpData() {
      if (type == 0) {
        this.getAllData();
      } else if (type == 1) {
        this.getIncomeData();
      } else if (type == 2) {
        this.getPayData();
      }
    },
    getAllData() {
      $http
        .get(
          "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
          { service_type: 0, page: this.all_page },
          "加载中"
        )
        .then(res => {
          if (res.result == 1) {
            this.all_con = res.data.data;
            this.all_total_page = res.data.last_page;
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getIncomeData() {
      $http
        .get(
          "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
          { service_type: 1, page: this.income_page },
          "加载中"
        )
        .then(res => {
          if (res.result === 1) {
            this.income_con = res.data.data;
            this.income_total_page = res.data.last_page;
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getPayData() {
      $http
        .get(
          "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
          { service_type: 2, page: this.pay_page },
          "加载中"
        )
        .then(res => {
          if (res.result == 1) {
            this.pay_con = res.data.data;
            this.pay_total_page = res.data.last_page;
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取更多数据
    getMoreData() {
      switch (type) {
      case 0:
        this.getAllMoreData();
        break;
      case 1:
        this.getIncomeMoreData();
        break;
      case 2:
        this.getPayMoreData();
        break;
      default:
        break;
      }
    },

    getAllMoreData() {
      if (this.all_page == this.all_total_page) {
        return;
      }

      if (this.all_page >= this.all_total_page) {
        this.all_loading = true;
        this.all_allLoaded = true;
        return;
      } else {
        this.all_page = this.all_page + 1;
        $http
          .get(
            "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
            { service_type: type, page: this.all_page },
            "正在获取更多"
          )
          .then(res => {
            if (res.result == 1) {
              this.all_loading = false;
              this.all_allLoaded = false;
              this.all_con = this.all_con.concat(res.data.data);
            } else {
              this.all_page = this.all_page - 1;
              this.all_loading = true;
              this.all_allLoaded = true;
              this.all_isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    getIncomeMoreData() {
      if (this.income_page == this.income_total_page) {
        return;
      }

      if (this.income_page >= this.income_total_page) {
        this.income_loading = true;
        this.income_allLoaded = true;
        return;
      } else {
        this.income_page = this.income_page + 1;
        $http
          .get(
            "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
            { service_type: type, page: this.income_page },
            "正在获取更多"
          )
          .then(res => {
            if (res.result === 1) {
              this.income_loading = false;
              this.income_allLoaded = false;
              this.income_con = this.income_con.concat(res.data.data);
            } else {
              this.income_page = this.income_page - 1;
              this.income_loading = true;
              this.income_allLoaded = true;
              this.income_isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    getPayMoreData() {
      if (this.pay_page == this.pay_total_page) {
        return;
      }

      if (this.pay_page >= this.pay_total_page) {
        this.pay_loading = true;
        this.pay_allLoaded = true;
        return;
      } else {
        this.pay_page = this.pay_page + 1;
        $http
          .get(
            "plugin.froze.Frontend.Modules.Froze.Controllers.records.index",
            { service_type: type, page: this.all_page },
            "正在获取更多"
          )
          .then(res => {
            if (res.result === 1) {
              this.pay_loading = false;
              this.pay_allLoaded = false;
              this.pay_con = this.pay_con.concat(res.data.data);
            } else {
              this.pay_page = this.pay_page - 1;
              this.pay_loading = true;
              this.pay_allLoaded = true;
              this.pay_isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //初始化数据

    initAllData() {
      this.all_loading = false;
      this.all_allLoaded = false;
      this.all_goload = true;
      this.all_isLoadMore = true;
      this.all_page = 1;
      this.all_total_page = 0;
      this.all_con = [];
    },

    initIncomeData() {
      this.income_loading = false;
      this.income_allLoaded = false;
      this.income_goload = true;
      this.income_isLoadMore = true;
      this.income_page = 1;
      this.income_total_page = 0;
      this.income_con = [];
    },

    initPayData() {
      this.pay_loading = false;
      this.pay_allLoaded = false;
      this.pay_goload = true;
      this.pay_isLoadMore = true;
      this.pay_page = 1;
      this.pay_total_page = 0;
      this.pay_con = [];
    },

    //初始化所有数据
    initData() {
      //currentTabIndex=0;
      type = 0;
      is_first_content = false;
      is_second_content = false;
      is_third_content = false;
      this.initAllData();
      this.initIncomeData();
      this.initPayData();
    },

    //更新
    all_loadTop() {
      this.initAllData();
      this.getUpData();
      // this.$refs.all_loadmore.onTopLoaded();
    },

    income_loadTop() {
      this.initIncomeData();
      this.getUpData();
      this.$refs.income_loadmore.onTopLoaded();
    },

    pay_loadTop() {
      this.initPayData();
      this.getUpData();
      this.$refs.pay_loadmore.onTopLoaded();
    },
    // 加载更多
    // all_loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.all_isLoadMore) {
    //     this.getMoreData();
    //     // this.$refs.all_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

    // income_loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.income_isLoadMore) {
    //     this.getMoreData();
    //     // this.$refs.income_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },
    // pay_loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.pay_isLoadMore) {
    //     this.getMoreData();
    //     // this.$refs.pay_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  }
};
