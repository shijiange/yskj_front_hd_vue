import cTitle from "components/title";
export default {
  data() {
    return {
      taskList: "",
      member_equity: ""
    };
  },

  activated() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      $http
        .get("plugin.nominate.frontend.task.index")
        .then(res => {
          if (res.result === 1) {
            this.taskList = res.data;
            this.member_equity = res.data.task;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    cTitle
  }
};
