import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      asset_detail: {},
      industry_detail: {},
      lang: {},
    };
  },
  activated() {
    this.asset_detail = {};
    this.asset_id = this.$route.params.asset_id;
    this.getLang();
    this.getData();
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      $http.get('plugin.asset.Frontend.Modules.Capital.Controllers.detail.index', {asset_id: this.asset_id}, "加载中...").then((response) => {
        if (response.result === 1) {
          this.asset_detail = response.data.asset_detail;
          this.industry_detail = response.data.industry_detail;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
  },
  components: {cTitle}
};
