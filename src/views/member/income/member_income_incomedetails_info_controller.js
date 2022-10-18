import cTitle from 'components/title';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      _id: "",
      info: {},
      order: {},
      goods: {},

      income_name_text: "",
    };
  },


  activated() {
    this.toi = this.fun.getKeyByI();
    this._id = this.$route.params.id;

    this.info = {};
    this.order = {};
    this.goods = {};


    //获取数据
    this.getData();
    this.customizeIncome();
    this.fun.setWXTitle(this.income_name_text + '明细详情');
  },
  mounted() {
    this.toi = this.fun.getKeyByI();

  },
  methods: {
    //获取数据
    getData() {
      let that = this;
      let json = { id: this._id, "i": this.fun.getKeyByI(), "type": this.fun.getTyep() };
      $http.get('finance.income.get-detail', json, "加载中...").then(function (response) {
        console.log(response);
        if (response.result == 1) {
          that.setData(response.data);
        } else {
          console.log(response.msg);
        }

      }, function (response) {
        console.log(response);
      });
    },


    setData(data) {
      if (data == null || data == '' || data == undefined) {
        this.$dialog.confirm({ message: "无详情显示"})
          .then(() => {
            this.$router.go(-1);
          }).catch(() => {
            this.$router.go(-1);
          });
        return;
      }

      if (!this.fun.isTextEmpty(data.commission)) {
        this.info = data.commission;
        this.order = data.order;
        this.goods = data.goods;
        return;
      }



      if (!this.fun.isTextEmpty(data.area_dividend)) {
        this.info = data.area_dividend;
        this.order = data.order;
        this.goods = data.goods;
        return;
      }
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};