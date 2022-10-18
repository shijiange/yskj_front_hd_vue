import cTitle from 'components/title';
import { Toast } from 'vant';
export default {

  data() {
    return {
      list: [],
      // 自定义语言
      merchant_center:"",
      merchant_people:"",
      merchant_reward:"",
      merchant_title:"",
    };
  },

  activated() {
    this.list = [];
    this.getData();//获取数据
  },

  methods: {

    //获取数据
    getData() {
      let that = this;
      let json = {};

      $http.get('plugin.merchant.frontend.staff-supplier-list', json, "获取中").then(function (response) {
        console.log(response.data);
        if (response.result == 1) {
          that.list = response.data;
          that.initLang();
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    initLang(){
      let mailLanguage = this.fun.initMailLanguage();
      this.merchant_center = mailLanguage.merchant.merchant_center || "招商中心";
      this.merchant_people = mailLanguage.merchant.merchant_people || "招商员";
      this.merchant_reward = mailLanguage.merchant.merchant_reward || "分红";
      this.merchant_title = mailLanguage.merchant.title || "招商";
    },

    //跳转到详情
    goToSupplierInfo(item) {
      this.$router.push(this.fun.getUrl('enterprise_supplier_info', { id: item.id }));
    }
  },
  components: { cTitle }

};