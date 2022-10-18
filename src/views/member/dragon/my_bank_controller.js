import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      datas: []
    };
  },

  activated() {
    this.initData();
    this.$refs.my_bank.style.height = document.body.clientHeight + "px";
    this.getNetData();
  },

  methods: {
    initData() {
      this.datas = [];
    },
    getNetData() {
      let that = this;
      $http
        .get(
          "plugin.dragon-deposit.frontend.lcg-merchant.getBankList",
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.datas = response.data;
            } else {
              that.$dialog.alert({message:response.msg});
             
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  components: { cTitle }
};
