import cTitle from 'components/title';
import { Toast } from 'vant';
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      assetList: [],
      member_info: {},
      statistics: {},
      incomeData: {},
      lang: {
        capital_name: ''
      },

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.initData();
    this.getLang();
    this.getData();
  },
  methods: {
    //复制邀请码
    onCopy: function (e) {
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: '复制失败',
        position: 'bottom',
        duration: 1000
      });
    },
    gotoMemberGrade() {
      this.$router.push(this.fun.getUrl('member'));
    },
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.fun.setWXTitle('我的'+this.lang.capital_name);
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.assetList = [];
      this.member_info = {};
      this.statistics = {};
      this.incomeData = {};

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      $http.get('plugin.asset.Frontend.Modules.Member.Controllers.page.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.asset_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.assetList = response.data.asset_list.data;
          this.member_info = response.data.member_info;
          this.statistics = response.data.statistics;
          this.incomeData = response.data.incomeData;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      this.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.asset.Frontend.Modules.Member.Controllers.page.index', {
          page: that.page
        }, '加载中...').then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.asset_list.data;
            that.assetList = that.assetList.concat(myData);//数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
    toAsset(item) {
      this.$router.push(this.fun.getUrl('CheckAsset', {asset_id: item.asset_id}));
    },
    myKey(str) {
      this.$router.push(this.fun.getUrl('SecretKey', {name: str}));
    },
    setPws() {
      this.$router.push(this.fun.getUrl('SetPassword'));
    }
  },
  components: {cTitle}
};
