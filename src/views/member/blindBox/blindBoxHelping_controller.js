import cTitle from "components/title";
export default {
  data() {
    return {
      currentTime: parseInt(new Date().getTime() / 1000),
      contactShow: false,
      friendsShow: false,

      assist: {},
      activity: {},
      member: {}
    };
  },
  activated() {
    this.getData();
  },
  mouted() {},
  methods: {
    getData() {
      $http.get("plugin.blind-box.api.assist.get-assist", { id: this.$route.query.assist_id, member_id: this.$route.query.member_id }, "").then(res => {
        if (res.result == 1) {
          this.assist = res.data.assist;
          this.activity = res.data.assist.activity;
          this.member = res.data.assist.member;
          console.log(this.assist);
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    heplAssist() {
      $http.get("plugin.blind-box.api.assist.assist", { id: this.$route.query.assist_id }, "").then(res => {
        if (res.result == 1) {
          this.friendsShow = true;
          console.log(this.assist);
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    gotoOrderList() {
      this.$router.push(this.fun.getUrl("orderlist", { status: 0 }));
    },
    gotoDetails(){
      this.$router.push(this.fun.getUrl("blindBoxDetail",{}, { id: this.activity.id }));
    },
    generateAssist() {
      this.addJoinLog();
      $http.get("plugin.blind-box.api.assist.generate-assist", { id: this.activity.id }, "").then(res => {
        if (res.result == 1) {
          this.$router.push(this.fun.getUrl("blindBoxDetail",{}, { id: this.activity.id }));
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    addJoinLog(){
      $http.get("plugin.blind-box.api.index.join-log",{id: this.activity.id},"");
    },
  },
  components: {
    cTitle
  }
};
