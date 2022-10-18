//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      shop_name: '',
      phone: '',
      shop_address: ''
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    getData() {
      const that = this;
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.get-shop-info', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            if (response.data) {
              that.shop_name = response.data.shop_name;
              that.phone = response.data.phone;
              that.shop_address = response.data.shop_address;
            } else {
              that.shop_name = '';
              that.phone = '';
              that.shop_address = '';
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    submit() {
      let json = {
        shop_name: this.shop_name,
        phone: this.phone,
        shop_address: this.shop_address
      };
      const that = this;
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.store-dealer', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            Toast('提交成功');
            that.$router.go(-1);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  activated() {
    this.getData();
  }
};
