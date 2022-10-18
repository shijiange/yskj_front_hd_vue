import cTitle from "components/title";
import {scrollMixin} from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      selected: "0",
      toi: this.fun.getKeyByI(),
      all: [],
      income: [],
      recordsList:[],
      //支出
      expenditure: [],
      //余额字样
      balanceLang: this.fun.getBalanceLang(),
      income_name_text: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  methods: {
    initData() {
      this.selected = "0";
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.recordsList = [];
    },
    swichTabTItem() {
      this.getNetData(this.selected);
    },
    //发起http请求
    getNetData(index) {
      var that = this;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.recordsList = [];
      $http
        .get(
          "finance.balance.record", {
            page:1,
            record_type: index,
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep()
          },
          " "
        )
        .then(
          function (response) {
            if (response.result == 1) {
              // var myData = response.data;
              that.page = 1;
              that.total_page = response.data.last_page;
              that.recordsList = response.data.data;
              // if (index == 0) {
              //   that.all = myData.data;
              // } else if (index == 1) {
              //   that.income = myData.data;
              // } else if (index == 2) {
              //   that.expenditure = myData.data;
              // }
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('finance.balance.record', {
          page: this.page,
          record_type: this.selected,
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep()
        }, '加载中').then(response => {
          this.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            this.recordsList = this.recordsList.concat(myData); //数组拼接
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
  },
  activated() {
    this.initData();
    this.toi = this.fun.getKeyByI();
    this.getNetData('0');
    this.customizeIncome();
    this.fun.setWXTitle(this.balanceLang + '明细');
  },
  components: {
    cTitle
  }
};