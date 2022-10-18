//window.localStorage.isWeiXin
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      status: false,
      radio: "1",
      result: {},
      list: [],
      id: 1,
      familyMemberCard: []
    };
  },

  components: {
    cTitle
  },
  mounted() {
  },

  methods: {
    beforeClose(action) {
      if (action === "confirm") {
        this.$router.push(that.fun.getUrl("home"));
      }
    },
    getData() {
      const that = this;
      let json = {
        device_id: this.id
      };
      $http.get("plugin.energy-cabin.frontend.use-device.index", json, "加载中...").then(
        function(response) {
          if (response.result === 1) {
            that.result = response.data.memberCard;
            that.familyMemberCard = that.result.familyMemberCard;
            // if (!response.data.member_info) {
            //   that.$router.push(that.fun.getUrl('powerAddMeb', { dealer_uid: response.data.dealer_uid }))
            // }
          } else {
            if (response.data.status) {
              Dialog.confirm({
                title: "提示",
                message: response.msg,
                beforeClose
              });
            } else {
              Toast(response.msg);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirm() {
      const that = this;
      let json = {
        device_id: this.id,
        card_id: this.radio
      };
      $http.get("plugin.energy-cabin.frontend.use-device.confirm-use", json, "加载中...").then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.status = true;

            that.getData();
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
    this.id = this.$route.params.id;
    this.getData();
  }
};
