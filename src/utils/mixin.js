const documentElement = document.documentElement;
const body = document.body;

export const scrollMixin = {
  data() {
    return {
      // list: [],
      //more
      // isLoadMore: true,
      // page: 1,
      // total_page: 0,
    };
  },
  activated() {
    window.addEventListener("scroll", this.handleScroll);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    //初始化数据
    // initData() {
    //   this.list = [];
    //   this.page = 1;
    //   this.total_page = 0;
    //   this.isLoadMore = true;
    // },
    //获取数据
    // getData(status) {
    //   let that = this;
    //   that.isLoadMore = false;
    //   that.status = status;
    //   that.page = 1;
    //   $http.get('plugin.mryt.api.team-manage.index', {}, "加载中...").then(function (response) {
    //     if (response.result === 1) {
    //       that.isLoadMore = true;
    //       that.total_page = response.data.records.last_page;
    //       if (!that.total_page) {
    //         that.total_page = 0;
    //       }
    //       that.rewardsData = response.data;
    //       that.recordsList = response.data.records.list;
    //     } else {
    //     }
    //   }, function (response) {
    //     console.log(response)
    //   });
    // },
    //获取更多数据
    // getMoreData() {
    //   const that = this;
    //   that.isLoadMore = false;  // 防止多次请求分页数据
    //   // that.checkStatus(this.status);
    //   if (this.page >= this.total_page) {
    //     return;
    //   } else {
    //     this.page = this.page + 1;
    //     $http.get(that.api, {
    //       page: that.page,
    //       pagesize: 10
    //     }, '加载中...').then(function (response) {
    //       that.isLoadMore = true;
    //       if (response.result === 1) {
    //         var myData = response.data.data;
    //         that.list = that.list.concat(myData);//数组拼接
    //
    //       } else {
    //         that.page = that.page - 1;
    //         that.isLoadMore = false;
    //         return;
    //       }
    //     }, function (response) {
    //       // error callback
    //     });
    //
    //   }
    // },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      this.otherScroll();
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //回到顶部

      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if ( this.getScrollTop() + this.getClientHeight() + 105 >this.getScrollHeight() ) {
        //此处发起请求
        if (this.isLoadMore) {
          this.getMoreData();
        } else {
          console.log("没有更多数据");
        }

        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    },
    otherScroll() {
    },
  }
};
