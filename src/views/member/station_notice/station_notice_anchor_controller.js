import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
import dateParserTime from "./dateParserTime";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      titleName: "服务通知",
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: [],
      msg_body: {
        "title": "直播间标题:",
        "img": "直播间封面图:"
      }
    };
  },
  activated() {
    if (this.$route.query.pageTitle) {
      this.titleName = this.$route.query.pageTitle;
      this.fun.setWXTitle(this.titleName);
    }
    this.getListData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    async getListData() {
      this.initData();
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.instation-message.api.message.get-type-list", {
        type_id: 6
      });
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      console.log(res);
      res.data.data.forEach(element => {
        element.created_at = dateParserTime(element.created_at);
      });

      this.isLoadMore = true;
      this.total_page = res.data.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
      this.listData = res.data.data;

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.instation-message.api.message.get-type-list", {
            page: this.page,
            type_id: 6
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              nextPageData.forEach(element => {
                element.created_at = dateParserTime(element.created_at);
              });
              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    },
    goPages(url) {
      if (url == "") return;
      window.location = url;
    }

  }
};
