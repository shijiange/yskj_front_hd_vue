import { Toast } from "vant";


export default {

  data() {
    return {
      successShow: false,
      errorShow: false,
      subject: null,
      integral: 0,
      integral_name: "积分"
    };
  },
  async created() {

  },
  mounted() {
    this.getSubject();
  },
  computed: {
    answerfilter: function() {
      return this.subject.has_many_answer.filter(function(item) {
        return item.content != "";
      });
    }
  },
  methods: {
    getSubject() {
      $http
        .get("plugin.answer-reward.api.index.get-subject", { vid: this.$route.query.vid }, "load")
        .then((response) => {
          console.log(response);
          if (response.result != 1) return;
          if (response.data.status != 1) {
            Toast("本视频你已获得积分奖励");
          } else {
            if (response.data.subject != null) {
              this.integral_name = response.data.integral_name;
              this.subject = response.data.subject;
            }
          }
        });
    },
    reward(id) {
      $http
        .get("plugin.answer-reward.api.index.index",
          {
            vid: this.$route.query.vid,
            subject_id: this.subject.id,
            answer_id: id
          }, "load")
        .then((res) => {
          if (res.result != 1) {
            this.errorShow = true;
          } else {
            if (res.data.status == 0) {
              Toast(res.msg);
            } else if (res.data.status == 1) {
              this.integral = res.data.integral;
              this.successShow = true;
            }
          }
          console.log(res);
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
