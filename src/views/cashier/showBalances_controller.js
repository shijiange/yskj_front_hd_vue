import cTitle from "../../components/title";
export default {
  data() {
    return {
      show : true,
      price: 0,
      payTitle:'',
      pay_sn:'',
      get_url:''
    };
  },
  mounted() {
    this.pay_sn = this.$route.params.pay_sn;
    if(this.$route.params.pay_type=='cashier'){
      this.get_url = 'plugin.store-cashier.frontend.cashier.pay-reward.index';
    }else{
      this.get_url = 'orderPay.pay-reward.index';
    }
    this.getReward();
  },
  methods: {
    goSubmit(){
      this.$router.push(this.fun.getUrl("balance"));
    },
    getReward() {
      this.addressData = [];
      let that = this;
      let json ={order_sn:this.pay_sn};
      $http
        .get(this.get_url, json, "获取中...")
        .then(
          function (response) {
            if (response.result == 1) {
              that.payTitle = response.data.title ;
              that.price = response.data.price ;
            }// else {
            //}
          },
          function (response) {
            console.log(response);
          }
        );
    },
  },
  activated() {

  },
  created() {

  },
  components: { cTitle }
};
