import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: "",
      name: "",
      mobile: "",
      nickName: "",
      uid: "",
      fromStatus:false
    };
  },
  activated() {
    window.sessionStorage.setItem("signHref", window.location.href);
    this.initData();
    this.id = this.$route.params.id;
    this.test();
    this.getData();
  },
  mounted() {},
  methods: {
    initData() {
      this.id = "";
      this.name = "";
      this.mobile = "";
      this.nickName = "";
      this.uid = "";
    },
    getData() {
      let json = {
        activity_id: this.id
      };
      $http
        .get("plugin.activity-apply.api.Activity.getActivity", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.name = response.data.title;
            this.nickName = response.data.member.nickname;
            this.mobile = response.data.member.mobile;
            this.uid = response.data.member.uid;
            if(response.data.pay_order.sign == 1){
              this.fromStatus = true;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    test() {
      let json = {
        activity_id: this.id
      };
      $http
        .post("plugin.activity-apply.api.Activity.getActivityEnrol", json)
        .then(response => {
          if (response.result === 1) {
          } else {
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("activityHome"));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      let json = {
        activity_id: this.id,
        member_id: this.uid
      };
      $http
        .post("plugin.activity-apply.api.activity.saveSign", json)
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            window.localStorage.removeItem("signHref");
            this.getData();
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
