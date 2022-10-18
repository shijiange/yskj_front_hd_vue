import cTitle from 'components/title';
import { Toast } from 'vant';
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      integral: window.localStorage.integral,
      recordsList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.id = this.$route.query.num;
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getData() {
      $http.get("plugin.point-activity.Frontend.Modules.Activity.Controllers.point-activity-award-log.get-point-activity-award-log", {member_id: this.id}, "...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.recordsList = response.data.list.data;
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
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get("plugin.point-activity.Frontend.Modules.Activity.Controllers.point-activity-award-log.get-point-activity-award-log", {
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.recordsList = that.recordsList.concat(myData);//数组拼接

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