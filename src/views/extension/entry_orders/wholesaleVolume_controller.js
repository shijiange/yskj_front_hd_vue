import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      total: null,
      info: {},
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isNoMore: false,
      isNO: false,
      isLoading:false
    };
  },
  activated() {
    this.into();
    this.getData();
  },
  methods: {
    into() {
      this.total = null;
      this.info = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.isNoMore = false;
      this.isNO = false;
    },
    getData() {
      let that = this;
      $http.get("plugin.pending-order.frontend.member-wholesale.index").then(
        response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }

            that.total = response.data.total;
            that.info = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
            console.log(response.msg);
            that.isNO = true;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    gotoVolume_detail(_id) {
      this.$router.push(this.fun.getUrl("VolumeDetail", {}, { id: _id }));
    },
    gotoCoupon_exchange() {
      this.$router.push(this.fun.getUrl("EntryExchange", {}));
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
            "plugin.pending-order.frontend.member-wholesale.index",
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
      this.into();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  components: { cTitle }
};
