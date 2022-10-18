import { Toast } from "vant";
export default {
  data() {
    return {
      agent: null,
      taskCount:0,
      task_order:0,
      member:{}
    };
  },
  created() {
    document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
    this.getDate();
  },
  methods: {
    // 去任务中心
    goTest() {
      this.$router.push(this.fun.getUrl("leagueTaskCenter"));
    },
    goProgress() {
      this.$router.push(this.fun.getUrl("leagueTaskProgress"));
    },
    // 中心
    goCenter(n) {
      n == 1 ? this.$router.push(this.fun.getUrl("leagueServiceCenter")) : this.$router.push(this.fun.getUrl("leagueOperatingCenter"));
    },
    //获取数据
    getDate() {
      $http
        .get("plugin.store-business-alliance.frontend.index.index", {})
        .then(response => {
          if (response.result == 1) {
            console.log(response.data.getTackGoods.member);
            this.agent = response.data.getTackGoods.agent;
            this.member=response.data.getTackGoods.member;
            this.taskCount = response.data.getTackGoods.task_list;
            this.task_order = response.data.getTackGoods.task_order;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
