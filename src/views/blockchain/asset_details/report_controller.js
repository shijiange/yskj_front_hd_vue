import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      finance_del: "",
      lang: {}
    };
  },
  activated() {
    this.getLang();
    this.getFinance();
  },
  methods: {
    getLang() {
      $http.get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getFinance() {
      this.finance_id = this.$route.params.finance_id;
      $http.get("plugin.asset.Frontend.Modules.Finance.Controllers.Detail.index", {
        finance_id: this.finance_id
      }).then((res) => {
        if (res.result === 1) {
          this.finance_del = res.data.finance;
        }
      });
    }
  },
  components: {
    cTitle
  }
};
