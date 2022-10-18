import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      activeName: "0",
      info: [],
      isNO: false,
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isNoMore: false,
      isLoading:false
    };
  },
  activated() {
    this.activeName = 0;
    this.isNO = false;
    this.into();
    this.chooseActive();
  },
  methods: {
    into() {
      this.info = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.isNoMore = false;
    },
    chooseActive(e) {
      this.isNO = false;
      this.isNoMore = false;
      this.info = [];
      let _url = "";
      this.activeName = !this.fun.isTextEmpty(e) ? e : "0";
      if (this.activeName == "0") {
        _url = "plugin.pending-order.frontend.member-wholesale.used-log";
      } else if (this.activeName == "1") {
        _url = "plugin.pending-order.frontend.member-wholesale.used-hang-log";
      } else if (this.activeName == "2") {
        _url = "plugin.pending-order.frontend.member-wholesale.self-used-log";
      }
      $http.get(_url, { mw_id: this.$route.query.id }).then(
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
            Toast({
              message: response.msg,
              duration: 800
            });
            this.isLoading = false;
            this.isNO = true;
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
      let _url = "";
      const that = this;
      if (that.page >= that.total_page) {
        that.isNoMore = true;
        return;
      } else {
        that.page += 1;
        if (that.activeName == "0") {
          _url = "plugin.pending-order.frontend.member-wholesale.used-log";
        } else if (that.activeName == "1") {
          _url = "plugin.pending-order.frontend.member-wholesale.used-hang-log";
        } else if (that.activeName == "2") {
          _url = "plugin.pending-order.frontend.member-wholesale.self-used-log";
        }
        $http
          .get(_url, { page: that.page }, "")
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
      this.into();
      this.chooseActive(this.activeName);
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  components: { cTitle }
};
