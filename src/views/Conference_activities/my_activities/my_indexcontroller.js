import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      member: {},
      level:{}
    };
  },
  activated() {
    this.getData();
  },
  mounted() {},
  methods: {
    gotoLove() {
      this.$router.push(this.fun.getUrl("Mylove"));
    },
    toShaky() {
      this.$router.push(this.fun.getUrl("Myshaky"));
    },
    getData() {
      $http
        .get("plugin.activity-apply.api.activity.getMember", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.member = response.data.member;
            this.level = response.data.level;
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
