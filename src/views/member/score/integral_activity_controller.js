import cTitle from 'components/title';
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activity_used: 0.00,
      activity_total: 0,
      activity_point: 0.00,
      activity_stock: 0.00,
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
    toIntegralGeneralization() {
      //创建活动
      this.$router.push(this.fun.getUrl('IntegralGeneralization', {}));
    },
    toIntegralPresent(activity_id) {
      //分享页面
      this.$router.push(this.fun.getUrl('IntegralPresent', {}, { activity_id: activity_id }));
    },
    toIntegralRecord(activity_id) {
      //明细 赠送记录
      this.$router.push(this.fun.getUrl('IntegralRecord', { activity_id: activity_id }));
    },
    getData() {
      const that = this;

      $http.post('plugin.point-activity.Frontend.Controllers.page.index', { page_id: 1 }, '正在加载').then(function (response) {
        if (response.result === 1) {

          const activityDate = response.data;
          that.activity_used = activityDate.activity_used;
          that.activity_total = activityDate.activity_total;
          that.activity_point = activityDate.activity_point;
          that.activity_stock = activityDate.activity_stock;
          that.total_page = activityDate.records.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.dataList = activityDate.records.data;

        } else {
          that.$dialog.alert({message:response.msg});
       
        }
      }, function (response) {
        // error callback
      });
    },
    // loadMore() {
    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page);
    //   } else {
    //     console.log('没有更多数据');
    //   }
    // },
    getMoreData() {
      if (this.isLoadMore) {
        const that = this;
        if (this.page >= this.total_page) {
          return;
        } else {
          this.page = this.page + 1;
          $http.post('plugin.point-activity.Frontend.Controllers.page.index', { page_id: this.page }, '加载中...').then(function (response) {

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
        console.log('没有更多数据');
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
    this.integral ? this.fun.setWXTitle(this.integral + '活动') : this.fun.setWXTitle('');
  },
  deactivated() {
    this.loading = true; // 关闭无限滚动
  },
  components: { cTitle }
};