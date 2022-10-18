import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  created() {

    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.star-spell.frontend.index.qualifications", {}, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
          return;
        }
        this.listData = res.data.data;
        console.log(res.data);
      });

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let json = { page: this.page };
        $http
          .get("plugin.star-spell.frontend.index.qualifications", json)
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              this.listData = this.listData.concat(nextPageData);
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