import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      integral: 0,
      transfer_set: 0,
      withdraw_set_title: 0,
      name: "",
      manual_withdraw_set_switch: 0,
      is_recharge: "",
      is_transformation: 0,
      pop: {},
      love_name: "",
      is_transformation_point: false,
      point_name: ""
    };
  },
  activated() {
    this.pop = {};
    this.integral = 0;
    this.transfer_set = 0;
    this.withdraw_set_title = 0;
    this.is_recharge = "";
    this.is_transformation = 0;
    this.name = "";
    this.pop = this.$store.state.pop;
    this.getName();
    this.getData();
  },
  methods: {
    cancel() {
      this.pop.show = false;
      this.$store.commit("savePop", this.pop);
    },
    getName() {
      $http
        .get("plugin.integral.Frontend.Controllers.page.get-name", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.name = response.data;
            this.fun.setWXTitle(this.name);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .get("plugin.integral.Frontend.Controllers.Page.index", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.integral = response.data.member_integral;
            this.transfer_set = response.data.transfer_set;
            this.withdraw_set_title = response.data.withdraw_set_title;
            this.manual_withdraw_set_switch = response.data.manual_withdraw_set_switch;
            this.is_recharge = response.data.is_recharge.is_recharge;
            this.is_transformation = response.data.is_transformation;
            this.love_name = response.data.love_name;
            if (response.data.is_transformation_point) {
              this.point_name = response.data.point_name;
              this.is_transformation_point = response.data.is_transformation_point;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toPage(url) {
      if (url == "Integral_invest" && JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: "十分抱歉，由于相关规定，你暂时无法在这里充值！"
        });
        return false;
      }

      if (url == "Integral_change2") {
        this.$router.push(this.fun.getUrl("Integral_change", { type: "shift" }));
        return;
      }
      this.$router.push(this.fun.getUrl(url));
    }
  },
  components: { cTitle }
};
