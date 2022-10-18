import cTitle from "components/title";
import Tabbar from "@/components/circleCommunity/tabbar";
import { Toast } from "vant";
export default {
  data() {
    return {
      arr: [],
      bonus_data: {}
    };
  },
  activated() {},
  mounted() {
    // this.getData(); //! 之前同事写的请求圈子数据，未知为什么请求，暂时注释
  },
  methods: {
    // 跳转我的发布
    toIssue() {
      this.$router.push(this.fun.getUrl("circleMyRelease"));
    },
    // 跳转我的圈子
    toCircle() {
      this.$router.push(this.fun.getUrl("circleMyCircle"));
    },
    // 跳转我的关注
    toAttention() {
      this.$router.push(this.fun.getUrl("circleMyAttention"));
    },
    getData() {
      let params = {
        circle_id: this.circle_id,
        is_review: this.is_review
      };
      $http
        .get("plugin.circle.frontend.circle-member.get-circle-memberList", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle,
    Tabbar
  }
};
