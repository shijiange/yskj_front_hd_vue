import cTitle from 'components/title';
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      dataList: [],
      //more
      loading: false, //为true时不会触发加载更多，false可以触发
      isLoadMore: true,
      page: 1,
      total_page: 0,
      integral: window.localStorage.integral,
    };
  },
  created() {
  },
  methods: {
    getData() {
      const that = this;
      $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.receive-records.index', {page_id: 1}, '正在加载').then(function (response) {
        if (response.result === 1) {
          const activityDate = response.data;
          that.dataList = activityDate.records.data;
          that.total_page = activityDate.records.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }

        } else {
          that.$dialog.alert({message:response.msg});
       
        }
      }, function (response) {
        // error callback
      });
    },
    loadMore() {
      if (this.isLoadMore) {
        this.getMoreData(this.page);
      }
    },
    getMoreData(page) {
      if (this.isLoadMore) {
        const that = this;
        if (this.page >= this.total_page) {
          return;

        } else {
          this.page = this.page + 1;
          $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.receive-records.index', {page_id: this.page}, '加载中...').then(function (response) {

            if (response.result === 1) {
              var myData = response.data.records.data;
              that.loading = false;
              that.dataList = that.dataList.concat(myData);//数组拼接
            } else {
              that.page = that.page - 1;
              that.loading = true;
              that.isLoadMore = false;
              return;
            }
          }, function (response) {
            // error callback
          });

        }
      } else {
        console.log('没有更多');
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.loading = false;
      this.isLoadMore = true;
      this.dataList = [];
    },
  },
  activated() {
    this.initData();
    this.getData();
  },
  deactivated() {
    this.loading = true; // 关闭无限滚动
  },
  components: {cTitle}
};