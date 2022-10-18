import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isAsc: true,
      voiceList: [],
      display_order: "",

      //more
      total: 0,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    changeAsc() {
      this.isAsc = !this.isAsc;
      this.isAsc ? this.display_order = "" : this.display_order = 1;
      this.getData();
    },
    toVoice(item) {
      if (item.has_one_article_pay) {
        if (item.has_one_record) {
          this.$router.push(this.fun.getUrl("VoiceDetail", { article_id: item.id }));
        } else {
          this.$router.push(this.fun.getUrl("payList", { id: item.id }, { fromTarget: "voiceList" }));
          return;
        }
      } else {
        this.$router.push(this.fun.getUrl("VoiceDetail", { article_id: item.id }));
        return;
      }
      //this.$router.push(this.fun.getUrl('VoiceDetail', {article_id: item.id}));
    },
    initData() {
      this.isAsc = true;
      this.voiceList = [];
      this.display_order = "";

      this.total = 0;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    //获取数据
    getData() {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http.get("plugin.article.api.article.audioArticle", { display_order: this.display_order }, "加载中...").then(function(response) {
        if (response.result === 1) {
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          that.total = response.data.total;
          if (!that.total_page) {
            that.total_page = 0;
          }
          if (!that.total) {
            that.total = 0;
          }
          that.voiceList = response.data.data;
        } else {
          Toast(response.msg);
        }
      }, function(response) {
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
        $http.get("", {
          page: that.page
        }, "加载中...").then(function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.voiceList = that.voiceList.concat(myData);//数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function(response) {
          // error callback
          console.log(response.msg);
        });

      }
    }
  },
  components: { cTitle }
};
