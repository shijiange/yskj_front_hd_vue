import cTitle from 'components/title';
import { Toast } from 'vant';
import {scrollMixin} from 'utils/mixin';

const documentElement = document.documentElement;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      name:'',
      tabs: [],
      selected: 0,
      tabID: 0,
      bossList: [],
      detail: {},
      uid: 0,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    setTimeout(() => {
      this.name=JSON.parse(window.localStorage.getItem('mailLanguage')).team_dividend&&JSON.parse(window.localStorage.getItem('mailLanguage')).team_dividend.my_agent?JSON.parse(window.localStorage.getItem('mailLanguage')).team_dividend.my_agent:'客户';
      this.$forceUpdate();
      this.fun.setWXTitle(this.name);
    }, 2000);
    this.initData();
    this.getTab();
  },
  methods: {
    initData() {
      this.tabs = [];
      this.selected = 0;
      this.tabID = 0;
      this.detail = {};
      this.uid = 0;

      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.bossList = [];
    },
    showDetail(obj) {
      this.detail = {};
      if (obj.show && this.uid === obj.has_one_member.uid) {
        obj.show = false;
        return;
      }
      this.uid = obj.has_one_member.uid;
      let that = this;
      $http.get('plugin.team-fjyx.api.team.getInfo', {uid: obj.has_one_member.uid}).then(function (response) {
        if (response.result === 1) {
          that.detail = response.data;
          that.$set(obj, "show", true);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },
    getTab() {
      let that = this;
      $http.get('plugin.team-fjyx.api.team.getColumns', {}).then(function (response) {
        if (response.result === 1) {
          that.tabs = response.data.columns;
          that.tabID = that.tabs[0].id;
          that.getData();
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },
    changeTab(tab, i) {
      this.selected = i;
      this.tabID = tab.id;
      documentElement.scrollTop = 0;
      console.log(this.tabID);
      this.getData();
    },
    //获取数据
    getData() {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http.get('plugin.team-fjyx.api.team.getList', {id: that.tabID}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.isLoadMore = true;
          that.total_page = response.data.list.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.bossList = response.data.list.data;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.team-fjyx.api.team.getList', {
          id: that.tabID,
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.bossList = that.bossList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });

      }
    },
  },
  components: {cTitle}
};