import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      advertsList: [],
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.advert-market.frontend.advertMember.getLogDetail", {log_id : this.$route.query.log_id}, "..").then(
        response => {
          if (response.result === 1) {
            this.advertsList = response.data.log;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
  },
  components: { cTitle }
};
