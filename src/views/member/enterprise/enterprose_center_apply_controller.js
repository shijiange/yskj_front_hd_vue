import { Toast } from 'vant';
export default {
  data() {
    return {
      status: "",//当前申请状态
      config_status: "",//后台申请条件
      config2: {},//后台条件2
      config3: {},//后台条件3
      config4: {},//后台条件4
      config5: {},//后台条件5

      income_name_text: "",
      username: '',
      password: '',
      password_again: '',
      independent_backend:'',
      merchant_center:'',
      title:''
    };
  },

  activated() {
    this.status = "";//当前申请状态
    this.config_status = "";//后台申请条件
    this.getData();//获取申请状态以及商城配置信息
    this.customizeIncome();
  },
  mounted() {
  },

  methods: {
    //获取申请状态以及商城配置信息
    getData() {
      let that = this;
      let json = {};

      $http.get('plugin.merchant.frontend.get-center-condition', json, "加载中").then(function (response) {
        console.log(response.data);
        if (response.result == 1) {
          that.status = response.data.status;
          that.config_status = response.data.config_status;
          that.config2 = response.data.config2;
          that.config3 = response.data.config3;
          that.config4 = response.data.config4;
          that.config5 = response.data.config5;
          that.independent_backend = response.data.independent_backend;
          if(response.data.lang){
            that.merchant_center = response.data.lang.merchant_center;
            that.title = response.data.lang.title;
            that.fun.setWXTitle(that.merchant_center);
          }
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },

    //提交数据
    submit() {
      let that = this;
      if(that.independent_backend == 1 && that.config_status != 3){
        if(that.fun.isTextEmpty(that.username) || that.fun.isTextEmpty(that.password) || that.fun.isTextEmpty(that.password_again)){
          Toast('请填写账户信息');
          return;
        }
      }
      let json = {
        config_status: this.config_status,
        user: {
          username: this.username,
          password: this.password,
          password_again: this.password_again
        }
      };
      $http.post('plugin.merchant.frontend.merchant-apply.center', json, "提交中").then(function (response) {
        if (response.result == 1) {
          that.status = response.data.status;
        } else {
          Toast(response.msg);
          if(response.data.status == '-4'){
            that.$router.push(that.fun.getUrl('enterprise_apply', {}));
          }
        }
      }, function (response) {
        console.log(response);
      });
    },
    //去商城
    goHome() {
      this.$router.push(this.fun.getUrl('home'));
    },

    //去商品页面
    goToGoods(goods_id) {
      this.$router.push(this.fun.getUrl('goods', { id: goods_id }));
    },

    //去招商中心
    goEnterproseCentre() {
      this.$router.push(this.fun.getUrl('enterprise_index', {}));
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  }
};