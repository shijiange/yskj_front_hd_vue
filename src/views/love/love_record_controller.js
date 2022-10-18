import cTitle from "components/title";
export default {
  data() {
    return {
      balance: 0,
      //数据列表
      listData: [],
      love_name: "", //爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值

      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;

      this.listData = [];
    },

    //更新
    loadTop() {
      this.initData();
      this.getNetData();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },
    // 加载更多
    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件

    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page);
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

    getUsable() {
      let that=this;
      $http
        .get("plugin.love.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result == 1) {
              this.usable = response.data.usable;
              this.love_name = response.data.love_name;
              this.fun.setWXTitle(this.love_name + "激活记录");
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
            
          }
        );
    },
    goDetailed(n) {
      this.$router.push(this.fun.getUrl("love_activation", { id: n }));
    },
    getNetData() {
      var that = this;
      $http
        .get(
          "plugin.love.Frontend.Modules.Love.Controllers.activation-records.index",
          { page: this.page },
          "加载中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.listData = response.data.data;
              that.page = 1;
              that.isLoadMore = true;
              that.total_page = res.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.isLoading = false;
            } else {
              that.$dialog.alert({message:response.msg});
              
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
            
          }
        );
    },

    getMoreData(page) {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page == that.total_page) {
        return;
      } else {
        that.page = that.page + 1;
        $http
          .get(ROOM_URL, { page: this.page }, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              that.listData = that.listData.concat(myData.data); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },
  activated() {
    this.initData();
    this.getUsable();
    this.getNetData();
  },
  components: { cTitle }
};
