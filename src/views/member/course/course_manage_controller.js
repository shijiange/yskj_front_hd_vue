import cTitle from "components/title";

export default {
  data() {
    return {
      loading:false,
      memberInfo: {}
    };
  },

  watch: {
    $route: function(to, from) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },

  mounted() {
    window.scrollTo(0, 0);
  },

  methods: {
    //获取会员信息
    getMemberInfo() {
      $http
        .get("plugin.video-demand.api.video-demand-member.get-member-data", {})
        .then(response => {
          if (response.result === 1) {
            this.memberInfo = response.data;
            this.loading = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //跳转购买vip
    gotoVip() {
      this.$router.push(this.fun.getUrl("CourseMemberUpdate"));
    }
  },
  activated() {
    this.getMemberInfo();
    document.getElementById("course").scrollTop = "40px";
  },

  components: { cTitle,  }
};
