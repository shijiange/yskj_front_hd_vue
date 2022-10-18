import cTitle from "components/title";

export default {
  data() {
    return {
      myCourseInfo: []
    };
  },

  mounted() {},

  methods: {
    //获取我的课程
    getMyCourse() {
      $http
        .get("plugin.video-demand.api.video-demand-member.get-me-course")
        .then(response => {
          console.log(response);
          if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
            this.myCourseInfo = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //跳转至详情

    goToDetail(id) {
      this.$router.push(this.fun.getUrl("CourseDetail", { id: id }));
    }
  },
  activated() {
    this.getMyCourse();
  },

  components: { cTitle, }
};
