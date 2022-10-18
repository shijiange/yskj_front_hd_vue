import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      info: {
        has_one_member: {
          avatar_image: ""
        }
      }
    };
  },
  activated() {
    this.into();
    this.getData();
  },
  methods: {
    into() {
      this.info = {
        has_one_member: {
          avatar_image: ""
        }
      };
    },
    getData() {
      let that = this;
      $http
        .get(
          "plugin.service-station.frontend.service-station.index",
          {},
          "加载中"
        )
        .then(
          function(response) {
            if (response.result === 1) {
              console.log(response.data);
              that.info = response.data;
            } else {
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //提现
    goMemberWithdrawal() {
      this.$router.push(this.fun.getUrl("withdrawal"));
    },
    //服务站的补货单
    gotoReplenishOrder() {
      this.$router.push(
        this.fun.getUrl("serviceReplenish", {
          status: "0",
          orderType: "serviceReplenish"
        })
      );
    },
    gotoPresentationRecord() {
      this.$router.push(
        this.fun.getUrl("CommissionList", { orderType: "serviceStation" })
      );
    }
  },
  components: { cTitle }
};
