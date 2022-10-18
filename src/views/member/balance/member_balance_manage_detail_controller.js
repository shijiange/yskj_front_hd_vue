import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      data: {}
    };
  },
  activated() {
    this.initDataInfo();
  },
  methods: {
    initDataInfo() {
      let id = this.$route.params.id;
      $http
        .get("plugin.supplier.frontend.insurance.insuranceDetail", {
          id: id
        })
        .then(res => {
          if (res.result == "1") {
            this.data = res.data;
          } else {
            Toast(res.msg);
            this.$router.push(this.fun.getUrl("balance_manage", {}));
          }
        });
    }
  },
  components: {
    cTitle
  }
};
