import cTitle from 'components/title';
import { Toast } from 'vant';
const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      list: [],
      info: {},
      WXtitle: '',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  methods: {
    getTitle() {
      //兑换操作
      const that = this;
      $http.get('plugin.share-chain.frontend.plugin-name.index', {}, "兑换中...").then(function (response) {
        if (response.result === 1) {
          that.WXtitle = response.data.plugin_name;
          that.fun.setWXTitle(that.WXtitle);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    getStoreInfo() {
      let that = this;
      $http.get('plugin.share-chain.frontend.process.index', {
        source_code: that.source_code,
        queue_id: that.queue_id,
      }, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.info = response.data;
        } else {
          Toast(response.msg);
          that.$router.push(that.fun.getUrl('extension', {}));
        }
      }, function (response) {
        console.log(response);
      });

    },
    //获取数据
    getData(status) {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      that.page = 1;
      $http.get('plugin.share-chain.frontend.process.getList', {
        source_code: that.source_code,
        queue_id: that.queue_id,
      }, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.list = response.data.data;
        } else {
          Toast(response.msg);
          that.$router.push(that.fun.getUrl('extension', {}));
        }
      }, function (response) {
        console.log(response);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.share-chain.frontend.process.getList', {
          source_code: that.source_code,
          queue_id: that.queue_id,
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.list = that.list.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });

      }
    },
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
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if ((this.getScrollTop() + this.getClientHeight() + 105) > this.getScrollHeight()) {
        // console.log('下拉刷新了')
        //此处发起请求
        if (this.isLoadMore) {
          this.getMoreData();
        } else {
          console.log('没有更多数据');
        }
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.list = [];
      this.info = {};
    },
  },
  activated() {
    this.source_code = this.$route.params.source_code;
    this.queue_id = this.$route.params.queue_id;
    this.getTitle();
    this.initData();
    this.getStoreInfo();
    this.getData();
  },
  components: {cTitle}
};