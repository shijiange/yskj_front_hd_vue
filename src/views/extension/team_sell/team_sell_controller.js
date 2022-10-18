import cTitle from 'components/title';
export default {
  data() {
    return {
      member: {},
      level: {},
      active: '',
      total_amount: '',
      self_amount: '',
      set: {},
      is_activation: '0',
      first_amount: '',
      recommend_amount: '',
      team_amount: '',
      non_team_amount: '',
      name: ''
    };
  },

  activated() {
    this.getData();
  },
  mounted() { },

  methods: {
    toPredict() {
      this.$router.push(this.fun.getUrl('predictIncome'));
    },
    toActive() {
      this.$router.push(this.fun.getUrl('teamActive'));
    },
    toLimit() {
      this.$router.push(this.fun.getUrl('teamLimit'));
    },
    toDetail(id) {
      this.$router.push(this.fun.getUrl('teamCommission', { id: id }));
    },
    //获取数据 已结算佣金
    getData() {
      let that = this;
      $http.get('plugin.team-sales.api.home.index', {}, '加载中...').then(
        function (response) {
          if (response.result == 1) {
            that.member = response.data.member;
            that.level = response.data.level;
            that.active = response.data.active;
            that.total_amount = response.data.total_amount;
            that.self_amount = response.data.self_amount;
            that.set = response.data.set;
            that.is_activation = response.data.is_activation;
            that.first_amount = response.data.first_amount;
            that.recommend_amount = response.data.recommend_amount;
            that.team_amount = response.data.team_amount;
            that.non_team_amount = response.data.non_team_amount;
            that.extra_amount=response.data.extra_amount;
            that.last_month_amount=response.data.last_month_amount;
            that.month_amount=response.data.month_amount;
            that.total_settle_amount=response.data.total_settle_amount;
            that.fun.setWXTitle(that.set.name);
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    }
  },
  components: { cTitle }
};
