import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      histroyInfo: [],
      isShowNoHistory: false, //是否显示暂无历史

      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },

  mounted() {

  },

  methods: {
    //获取历史记录
    getHistroy() {
      $http
        .get("plugin.video-demand.api.video-demand-member.get-scan-history", {
          page: this.page
        })
        .then(response => {
          console.log(response);
          if (
            response.result == 1 &&
            !this.fun.isTextEmpty(response.data.data)
          ) {
            this.histroyInfo = response.data.data;
            this.isShowNoHistory = false;
            this.total_page = response.data.last_page;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.isShowNoHistory = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //清除历史记录
    clearData() {
      var that = this;
      this.$dialog.confirm({ message: "确定删除观看记录?"})
        .then(() => {

          $http
            .get(
              "plugin.video-demand.api.video-demand-member.historical-purge",
              {}
            )
            .then(response => {
              console.log(response);
              if (response.result == 1) {
                that.histroyInfo = [];
                that.isShowNoHistory = true;
                that.$dialog.alert({message:response.msg});
              } else if (response.result == 0) {
                that.$dialog.alert({message:response.msg});
              } else {
                return;
              }
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(() => {});
    },

    goBack() {
      window.history.go(-1);
    },

    loadTop() {
      this.initData();
      this.getHistroy();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },

    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page);
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

    getMoreData(page) {
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.video-demand.api.video-demand-member.get-scan-history",
            { page: this.page },
            "加载中..."
          )
          .then(
            function(response) {
              if (response.result == 1) {
                var myData = response.data.data;
                that.loading = false;
                that.allLoaded = false;
                that.histroyInfo = that.histroyInfo.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
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

    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.histroyInfo = [];
      this.isShowNoHistory = false;
    },

    gotoDetail(id) {
      this.$router.push(this.fun.getUrl("CourseDetail", { id: id }));
    }
  },
  activated() {
    this.initData();
    this.getHistroy();
  },

  components: { cTitle }
};
