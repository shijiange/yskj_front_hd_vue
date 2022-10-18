import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      noticeList: [],
      lang: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getLang();
    this.getData();
  },
  methods: {
    getLang() {
      $http.get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    toNotice(notice) {
      this.$router.push(this.fun.getUrl("AssetNotices", { notice_id: notice.id }, { name: "notice" }));
    },
    initData() {
      this.noticeList = [];

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      $http.get("plugin.asset.Frontend.Modules.Notice.Controllers.records.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.noticeList = response.data.page_list.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
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
        $http.fetchUrl("notices-list", {
          page: that.page
        }, "加载中...").then(function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            that.noticeList = that.noticeList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function(response) {
          // error callback
        });

      }
    }
  },
  components: { cTitle }
};
