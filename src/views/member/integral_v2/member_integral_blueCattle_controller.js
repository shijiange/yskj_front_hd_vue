import { Toast } from "vant";

export default {
  data() {
    return {
      user_id: "8ffc1e0b-1586-4b1a-a598-6e783031e118",
      sign: "17A67F3F80EB6D4179913B1841238BBF984F0EF13E3B93C9994B0E5510015245",
      userObj: {},
      blueNum: ""
    };
  },
  created() {

    this.getBlueCattle();
  },
  computed: {
    points() {
      let num = 0;
      if (this.userObj.proportion && this.blueNum > 1) {
        let arr = this.userObj.proportion.split(":");
        let pro = parseInt(arr[0]);
        num = Math.floor(this.blueNum / pro);
      }
      return num;
    }
  },
  methods: {
    allExchange() {
      if (this.userObj.lan_point) {
        this.blueNum = this.userObj.lan_point;
      }

    },

    getBlueCattle() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      $http.get("plugin.point_exchange.api.index.index").then((response) => {
        console.log(response);
        Toast.clear();
        if (response.result == 1) {
          this.userObj = response.data;
          //this.fun.setWXTitle(this.userObj.plugin_name);
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });

    },
    sendExchange() {
      if (this.points == 0 || this.userObj.lan_point == 0) return;
      console.log(this.points);
      Toast.loading({
        message: "兑换中",
        forbidClick: true
      });
      $http.post("plugin.point_exchange.api.index.redeemPoints", {
        lan_point: this.blueNum,
        yun_point: this.points,
        unique_id: this.userObj.unique_id
      }).then((response) => {
        Toast.clear();
        Toast(response.msg);
        if (response.result == 1) {
          this.blueNum = "";
          this.getBlueCattle();
        }
      });
    },
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
  }

};