export default {
  data() {
    return {
      details: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.love-cycle-award.frontend.controllers.cycle-award.queue-info", { id: this.$route.query.id }, "").then(
        res => {
          console.log(res);
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.details = res.data;
        },
        res => {
          this.$toast(res.msg);
        }
      );
    }
  }
};
