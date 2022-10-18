import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      area: "",
      total: 0,
      listData: [],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.getSearch();
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.listData = [];
    },
    async getSearch() {

      Toast.loading({
        message: "搜索中",
        forbidClick: true
      });
      let res = await $http.get("plugin.agent-enquiry.Frontend.controllers.agent.index", {
        area_id: this.$route.query.area_id,
        level: this.$route.query.level
      });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      console.log(res);
      this.area = res.data.area;
      this.total = res.data.total;

      this.listData = res.data.agents.data;

      this.isLoadMore = true;
      this.total_page = res.data.agents.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.agent-enquiry.Frontend.controllers.agent.index", {
            area_id: this.$route.query.area_id,
            level: this.$route.query.level,
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.agents.data;

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

