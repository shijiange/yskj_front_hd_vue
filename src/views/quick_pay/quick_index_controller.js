import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      member: {},
      payment_status:'0',
      quick_pay:'0'
    };
  },
  activated() {
    this.getData();
  },
  mounted() {},
  methods: {
    gotoLove() {
      this.$router.push(this.fun.getUrl("bankcardinadd"));
    },
    toShaky() {
      this.$router.push(this.fun.getUrl("memberchooseBank"));
    },
    getData() {
      $http
        .get("plugin.converge_pay.frontend.controllers.home.index", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.member = response.data.member;
            this.quick_pay=response.data.quick_pay;
            this.payment_status=response.data.payment_status;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    cTitle
  }
};
