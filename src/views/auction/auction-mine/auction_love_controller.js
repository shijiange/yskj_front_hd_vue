import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      Data:{}
    };
  },
  activated() {
    this.getStoreInfo();
  },
  methods: {
    getStoreInfo() {
      var that = this;
      $http
        .get(
          "plugin.auction.api.prepayment.withdraw.page",
          {},
          " "
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.Data = response.data;

            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            // error callback
          }
        );
    },
    toPage(url) {
      this.$router.push(this.fun.getUrl(url));
    }
  },
  components: { cTitle }
};
