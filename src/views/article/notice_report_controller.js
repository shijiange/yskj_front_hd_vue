import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: "",
      report_desc: ""
    };
  },

  activated() {
    this.id = this.$route.params.id;
  },
  mounted() {},

  methods: {
    report() {
      let that = this;

      if (this.fun.isTextEmpty(this.report_desc)) {
        Toast("请填写举报内容");
        return;
      }

      let json = { article_id: this.id, desc: this.report_desc };

      $http.get("plugin.article.api.article.report", json, "").then(
        function(response) {
          if (response.result == 1) {
            that.$dialog.alert({message:response.msg});
          
            that.$router.go(-1);
          } else {
            that.$dialog.alert({message:response.msg});
           
            that.$router.go(-1);
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
       
          that.$router.go(-1);
        }
      );
    }
  },
  components: { cTitle }
};
