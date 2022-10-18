import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  components: { cTitle},
  data() {
    return {
      integral: '',
      app_links: '',
      name: ''
    };
  },
  // setting sun
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    // 初始化
    init() {
      this.integral = '';
      this.app_links = '';
    },
    // 获取数据
    getData() {
      console.log(window.location.href, '000');
      let url = window.location.href;
      let str = url.split('?');
      str = str[2].split('&');
      str = str[1].split('=');
      str = str[1];
      var outtradeno = str;
      console.log(str);

      console.log(this.$route.params, '数据');

      $http.get('orderPay.successful-payment.payment-jump', { outtradeno: outtradeno }).then(res => {
        if (res.result == 1) {
          this.integral = res.data.integral;
          this.app_links = res.data.app_links;
          this.name = res.data.name;
        } else {
          Toast(res.msg);
        }
        console.log(res);
      });
    },
    // 跳转
    gobtn() {
      window.location.href = this.app_links;
    }
  }
};
