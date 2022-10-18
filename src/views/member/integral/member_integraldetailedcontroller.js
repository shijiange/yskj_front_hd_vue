import cTitle from "components/title";
export default {
  data() {
    return {
      logId: "",
      income_name_text: "",
      detailInfo: {},
      integral: window.localStorage.integral
    };
  },
  methods: {
    // 获取详情信息
    getData() {
      $http.get("finance.point-info.detail", { log_id: this.logId }, "正在获取...").then(response => {
        if (response.result == 1) {
          this.detailInfo = response.data;
        }
      });
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  activated() {
    this.logId = this.$route.params.id;
    this.getData();
  },
  components: { cTitle }
};
