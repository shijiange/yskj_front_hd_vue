import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      member: {},
      rewardsList: [],
      rewardsData: {},
      setLang: {},
      //团队数据
      teamData: [],
      team_cost_count: {}
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    toReward(item) {
      this.$router.push(this.fun.getUrl('AwardRecord', {fromHome: 1}, {
        name: item.identifying,
        reward_name: item.reward_name
      }));
    },
    initData() {
      this.member = {};
      this.rewardsList = [];
      this.rewardsData = {};
      this.teamData = [];
      this.team_cost_count = {};
      this.setLang = {};
    },
    getData() {
      const that = this;
      $http.get('plugin.mryt.api.home.index', {}, "").then(function (response) {
        if (response.result === 1) {
          that.rewardsData = response.data;
          that.member = response.data.member;
          that.rewardsList = response.data.rewards;
          that.setLang = response.data.set;
          that.WXtitle = response.data.set.name;
          that.fun.setWXTitle(that.WXtitle);
          //团队数据
          that.teamData = response.data.team_statistics;
          that.team_cost_count = response.data.team_cost_count;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },

    gotoTeamDataCount(obj) {
      if(obj == 'team_cost_count') {
        this.$router.push(this.fun.getUrl('TeamDataCount', {team_type: 'team_cost_count'}));
      }else {
        this.$router.push(this.fun.getUrl('TeamDataCount', {team_type: obj.type, level: obj.level}));
      }
    }
  },
  components: {cTitle}
};
