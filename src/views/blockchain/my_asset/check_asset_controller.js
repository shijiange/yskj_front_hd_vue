import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      homeData: {},
      Income: {},
      Outcome: {},
      asset_id: '',
      lang: {
        capital_name: ''
      },
      btn: {},
      can_subscribe: false,
      clientWidths: "",
    };
  },
  activated() {
    this.asset_id = this.$route.params.asset_id;
    this.initData();
    this.getLang();
    this.getIndexData();
    this.clientWidths = document.body.clientWidth;
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.fun.setWXTitle('查看'+this.lang.capital_name);
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.homeData = {};
      this.Income = {};
      this.Outcome = {};
      this.can_subscribe = false;
    },
    toPage(url) {
      this.$router.push(this.fun.getUrl(url, {asset_id: this.asset_id}));
    },
    getIndexData() {
      $http.get('plugin.asset.Frontend.Modules.Member.Controllers.digitization.index', {asset_id: this.asset_id}, "加载中").then((response) => {
        if (response.result === 1) {
          this.homeData = response.data;
          this.btn =this.homeData.button;
          this.Income = this.homeData.increase_data;
          this.Outcome = this.homeData.decrease_data;
          this.can_subscribe = this.homeData.can_subscribe;
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
