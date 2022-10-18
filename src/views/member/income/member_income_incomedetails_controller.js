import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      toi: this.fun.getKeyByI(),
      datas: [],
      typeData: [],
      popupSpecs: false,
      sType: "", //筛选规格

      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      income_name_text: "",
      isLoading:false
    };
  },

  activated() {
    this.toi = this.fun.getKeyByI();
    this.sType = ""; //初始化
    this.initData();
    //获取数据
    this.getData(this.sType);
    this.customizeIncome();
    this.fun.setWXTitle(this.income_name_text + "明细");
  },
  mounted() {
    this.toi = this.fun.getKeyByI();
  },
  methods: {
    //初始化数据
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.datas = [];
    },

    //更新
    loadTop() {
      this.initData();
      this.getData(this.sType);
      // this.$refs.coupon_loadmore.onTopLoaded();
    },
    // 加载更多
    //获取数据
    getData() {
      let that = this;
      let json = { income_type: this.sType, page: this.page };
      that.isLoadMore = false;

      $http.get("finance.income.get-income-list", json, "加载中...").then(
        function(response) {
          // console.log(response);
          that.isLoadMore = true;
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            that.datas = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //获取更多
    getMoreData() {
      var that = this;
      that.isLoadMore = false;
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "finance.income.get-income-list",
            { income_type: this.sType, page: this.page },
            "加载中..."
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result == 1) {
                var myData = response.data;
                that.loading = false;
                that.allLoaded = false;
                that.datas = that.datas.concat(myData.data); //数组拼接
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

    //获取类型数据
    getTypeData() {
      let that = this;
      let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      $http.get("finance.income.get-search-type", json, "获取中...").then(
        function(response) {
          // console.log(response);
          if (response.result == 1) {
            that.typeData = response.data;
            that.popupSpecs = true;
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //返回
    goto() {
      window.history.go(-1);
    },

    //筛选
    screen() {
      if (this.typeData.length == 0) {
        this.getTypeData();
      } else {
        this.popupSpecs = true;
      }
    },
    //点击筛选处理
    screenType(_type) {
      this.sType = _type;
      this.popupSpecs = false;
      this.initData();
      this.getData();
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },

  components: { cTitle }
};
