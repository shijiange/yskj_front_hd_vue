import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      amount_total: {},
      amount_surplus: {},
      amount_finish: {},
      exchange_point: {},
      exchange_love: {},
      exchange_point_amount: {},
      exchange_love_amount: {},
      point_name: "",
      love_name: ""
    };
  },
  activated() {
    // this.initData();
    this.getDetail();
  },
  methods: {
    getDetail() {
      let that = this;
      $http.get('plugin.share-chain.frontend.center.getInfo', {}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.point_name = response.data.point_name;
          that.love_name = response.data.love_name;
          that.allInfo = response.data.info;
          that.amount_total = that.allInfo.amount_total;
          that.amount_surplus = that.allInfo.amount_surplus;
          that.amount_finish = that.allInfo.amount_finish;
          that.exchange_point = that.allInfo.exchange_point;
          that.exchange_love = that.allInfo.exchange_love;
          that.exchange_point_amount = that.allInfo.exchange_point_amount;
          that.exchange_love_amount = that.allInfo.exchange_love_amount;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    initData() {
      this.amount_total = {};
      this.amount_surplus = {};
      this.amount_finish = {};
      this.exchange_point = {};
      this.exchange_love = {};
      this.exchange_point_amount = {};
      this.exchange_love_amount = {};
      this.point_name = "";
      this.love_name = "";
    }

  },
  components: {cTitle}
};