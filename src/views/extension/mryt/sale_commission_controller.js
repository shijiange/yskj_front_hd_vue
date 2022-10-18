import cTitle from 'components/title';
import { Toast } from 'vant';

const documentElement = document.documentElement;

export default {
  data() {
    return {
      commission: {},
      commissionList: [],
      activeName: '-1',

      WXtitle: '',
    };
  },
  activated() {
    this.initData();
    this.getIndex();
    this.getData();
  },
  methods: {
    getTab(tab) {
      // 赋值
      this.commissionList = [];
      documentElement.scrollTop = 0;
      this.getData();
    },
    initData() {
      this.commission = {};
      this.commissionList = [];
      this.activeName = '-1';
    },
    getIndex() {
      const that = this;
      $http.get('plugin.sales-commission.api.sale.index', {}, "").then(function (response) {
        if (response.result === 1) {
          that.WXtitle = response.data.name;
          that.fun.setWXTitle(that.WXtitle);
          that.commission = response.data;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    getData() {
      const that = this;
      let json = {};
      if (that.activeName >= 0) {
        json = {status: that.activeName};
      }
      $http.get('plugin.sales-commission.api.sale.record', json, "").then(function (response) {
        if (response.result === 1) {
          that.commissionList = response.data.data;
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