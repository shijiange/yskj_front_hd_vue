import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      rewardDetail: {},
      name: '',
      type: ''
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.name;
    this.rewardDetail = {};
    this.initData(this.type);
    this.getData();
  },
  methods: {
    initData(type) {
      switch (type) {
      case 'teamManagement':
        this.api = 'plugin.mryt.api.team-manage.details';
        this.name = '获得销售佣金会员';
        break;
      case 'team':
        this.api = 'plugin.mryt.api.team.details';
        this.name = '新进会员';
        break;
      case 'thanks':
        this.api = 'plugin.mryt.api.thanksgiver.details';
        this.name = '新进会员';
        break;
      case 'education':
        this.api = 'plugin.mryt.api.train.details';
        this.name = '下级会员';
        break;
      case 'immediate':
        this.api = 'plugin.mryt.api.direct-award.details';
        this.name = '新进会员';
        break;
      case 'tier':
        this.api = 'plugin.mryt.api.tier.details';
        this.name = '新进会员';
        break;
      default:
        this.api = 'plugin.mryt.api.team-manage.details';
        this.name = '获得销售佣金会员';
        break;
      }
    },
    getData() {
      const that = this;
      $http.get(this.api, {award_id: this.id}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.rewardDetail = response.data;
          console.log(response.data);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
  },
  components: {cTitle}
};