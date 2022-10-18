import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      statistics: {},
      advertsList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.advert-market.frontend.advertMember.center", {}, "..")
        .then(
          response => {
            if (response.result === 1) {
              this.statistics = response.data.statistics;
              this.isLoadMore = true;
              this.total_page = response.data.logs.last_page;
              this.advertsList = response.data.logs.data;
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.advert-market.frontend.advertMember.center",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.logs.data;
                that.advertsList = that.advertsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    gotoUrl(url, query) {
      this.$router.push(this.fun.getUrl(url, {}, query));
    }
  },
  components: { cTitle }
};
