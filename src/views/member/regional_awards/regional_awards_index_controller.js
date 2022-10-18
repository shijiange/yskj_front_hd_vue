import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: [],
      statistics: {},
      info: {},
      location: {}
    };
  },
  async activated() {
    console.log("执行");
    this.getData();


  },
  methods: {

    async getData() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.regional-reward.Frontend.controllers.quota.index");
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.statistics = res.data.statistics;
      this.info = res.data.info;
      this.location = res.data.location;
      this.listData = res.data.list.data;

      this.isLoadMore = true;
      this.total_page = res.data.list.last_page;
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
          .get("plugin.regional-reward.Frontend.controllers.quota.index", {
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },

    gotoAwardsRecord(id) {
      this.$router.push(this.fun.getUrl("regionalAwardsRecord", {}, { quotaId: id }));
    }


  }
};