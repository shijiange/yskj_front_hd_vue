
import { Toast } from "vant";

export default {
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: []
    };
  },
  async activated() {
    this.getData();
    console.log(this.$route);
  },
  methods: {
    async getData() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.regional-reward.Frontend.controllers.reward.index", {
        quota_id: this.$route.query.quotaId
      });
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }

      this.listData = res.data.data;

      this.isLoadMore = true;
      this.total_page = res.data.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
    },
    //加载更多数据
    async getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.regional-reward.Frontend.controllers.reward.index", {
            page: this.page,
            quota_id: this.$route.query.quotaId
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    }
  }
};