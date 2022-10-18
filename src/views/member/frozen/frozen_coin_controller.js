import cTitle from "components/title";
export default {
  components: { cTitle },
  data() {
    return {
      dataObj: {},
      income_name_text: "",
    };
  },
  activated() {
    this.initData();
    this.getData();
    this.customizeIncome();
  },

  methods: {
    //路由跳转
    routeTake(response) {
      if (response == 1) {
        if(JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay  == "1" && this.fun.isIphone()){
          this.$dialog.alert({
            message: '十分抱歉，由于相关规定，你暂时无法在这里充值！'
          });
          return false;
        }
        this.$router.push(this.fun.getUrl("RechargeCoin"));
      } else if (response == 2) {
        this.$router.push(this.fun.getUrl("LookDetailsCoin"));
      } else if (response == 3) {
        this.$router.push(this.fun.getUrl("PutForwardCoin"));
      }
    },

    //获取数据
    getData() {
      $http
        .get("plugin.froze.Frontend.Controllers.page.index", {}, "加载中")
        .then(res => {
          if (res.result == 1) {
            console.log(res);
            this.dataObj = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //初始化数据
    initData() {
      this.dataObj = {};
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  }
};
