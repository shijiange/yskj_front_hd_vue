import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      info: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isNoMore: false,
      isLoading:false
    };
  },
  activated() {
    this.info = [];
    this.isLoadMore = true;
    this.total_page = 0;
    this.page = 1;
    this.isNoMore = false;

    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.pending-order.frontend.member-wholesale.get-log").then(
        response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.info = response.data.data;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        that.isNoMore = true;
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.pending-order.frontend.member-wholesale.get-log",
            { page: that.page },
            ""
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              that.isNoMore = true;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      // 初始化start
      this.info = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.isNoMore = false;
      // 初始化end
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  components: { cTitle }
};
