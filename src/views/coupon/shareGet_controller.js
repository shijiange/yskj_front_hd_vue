import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      result: ['a'],
      showShare: false,
      item: '',
      mark_id: '',
      getSucceed: false
    };
  },
  methods: {
    goConponCenter() {
      this.$router.push(this.fun.getUrl("couponStore", { info: this.info }));
    },
    goMyCoupon() {
      this.$router.push(this.fun.getUrl("coupon", {}));
    },
    close() {
      this.showShare = false;
    },
    shareVideo() {
      this.showShare = true;
    },
    getData() {
      var that = this;
      $http.post("plugin.share-coupons.Frontend.controllers.share.index", { mark_id: that.mark_id }).then(
        response => {
          if (response.result === 1) {
            console.log(response);
            this.item = response.data;
            if (this.item.name.length >= 12) {
              this.fontsize = '0.8rem';
            } else {
              this.fontsize = '1.41rem';
            }
          } else {
            if (!this.fun.isTextEmpty(response.data)) {
              if (response.data.used == '1') {
                Toast('优惠券已被领取完');
                this.$router.push(this.fun.getUrl("coupon", {}));
              }
            }
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    tapGet() {
      var that = this;
      $http.post("plugin.share-coupons.Frontend.controllers.share.handle", { mark_id: that.mark_id }).then(
        response => {
          if (response.result === 1) {
          
            this.getSucceed = true;
          
          } else {
            this.$dialog.alert({message:response.msg});
           
          }
        },
        function (response) {
          console.log(response);
        }
      );
    }
  },
  activated() {
    console.log(this.$route.query);
    this.mark_id = this.$route.query.mark_id;
    this.getData();
  },
  mounted() { },
  components: { cTitle }
};