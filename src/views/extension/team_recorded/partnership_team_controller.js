import cTitle from "components/title";
export default {
  data() {
    return {
      memberInof: "",
      all_List: "",
      rewards_list: "",
      is_open: "",
      record_title: ""
    };
  },

  activated() {
    this.is_open = "";
    this.getData();
    this.isShowTask();
  },

  methods: {
    isShowTask() {
      $http.get("plugin.nominate.frontend.task.enable").then(res => {
        if (res.result == 1) {
          this.is_open = res.data.is_open;
        }
      });
    },
    getData() {
      $http.get("plugin.nominate.frontend.home.index").then(res => {
        if (res.result == 1) {
          this.all_List = res.data;
          this.memberInof = res.data.member;
          this.rewards_list = res.data.rewards;
          this.record_title = res.data.plugin_name;
          this.fun.setWXTitle(this.record_title);
        }
      });
    },
    RewardDet(item) {
      this.$router.push(
        this.fun.getUrl(
          "ManagementRecord",
          { fromHome: 1 },
          {
            name: item.identifying,
            reward_name: item.reward_name
          }
        )
      );
    },
    taskDet() {
      this.$router.push(this.fun.getUrl("TaskList"));
    }
  },
  components: {
    cTitle
  }
};
