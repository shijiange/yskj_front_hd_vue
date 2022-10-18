import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      memberInfo: {},
      statistic: {},
      recommend_award_name: '',
      contribute_award_name: '',
      service_award_name: '',
      equal_award_name: '',
      surpass_award_name: '',
      shareholder_award_name: '',
      manage_award_name: '',
      alike_level_award_name: '',
      equal_alike_level_award_name: '',
      direct_recommend_award_name: '',
      is_open_freedom: 1,
      is_open_exchange: 1,
      is_open_recommend: 0,
      is_openOption: {},
      show_estimate_award:1
    };
  },
  created() {},
  activated() {
    this.getOpen();
    this.getData();
    this.getOpenRecommend();
  },
  methods: {
    getData() {
      $http
        .post('plugin.channel.frontend.center.index', {}, "").then(response => {
          if (response.result === 1) {
            this.memberInfo = response.data.member;
            this.statistic = response.data.statistic;
            this.show_estimate_award = response.data.switch.show_estimate_award;
          } else {
            this.$dialog.alert({message:response.msg});
      
            this.$router.push(this.fun.getUrl('member'));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOpenRecommend() {
      let that = this;
      $http
        .post('plugin.channel.frontend.recommend.set.getOpen', {}, "").then(response => {
          if (response.result === 1) {
            if (response.data.is_open == '1') {
              that.is_open_recommend = '1';
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOpen() {
      $http
        .post('plugin.channel.frontend.setting.index', {}, "").then(response => {
          if (response.result === 1) {
            this.is_open_freedom = response.data.is_open_freedom;
            this.is_open_exchange = response.data.is_open_exchange;
            this.recommend_award_name = response.data.recommend_award_name;
            this.contribute_award_name = response.data.contribute_award_name;
            this.service_award_name = response.data.service_award_name;
            this.equal_award_name = response.data.equal_award_name;
            this.surpass_award_name = response.data.surpass_award_name;
            this.manage_award_name = response.data.manage_award_name;
            this.shareholder_award_name = response.data.shareholder_award_name;
            this.alike_level_award_name = response.data.alike_level_award_name;
            this.equal_alike_level_award_name = response.data.equal_alike_level_award_name;
            this.direct_recommend_award_name = response.data.direct_recommend_award_name;
            this.is_openOption = response.data.open;
            this.fun.setWXTitle(response.data.plugin_name);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoUrl(str, params) {
      this.$router.push(this.fun.getUrl(str, params));
    },
  },
  components: { cTitle }
};
