import cTitle from "components/title";
import cMyswipe from "components/myswipe";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      banner: [],
      noticeData: {},
      classify: [],
      companyList: [],
      lang: {},
      homeData: {},

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
    initData() {
      this.banner = [];
      this.noticeData = {};
      this.homeData = {};
      this.classify = [];
      this.companyList = [];

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    toCompany(item) {
      this.$router.push(this.fun.getUrl("Assessment", { asset_id: item.id }));
    },
    toTradingHall(event) {
      // let subStr = new RegExp("trans_home");
      // let result = window.location.href.replace(subStr, "trading_hall");
      // event.preventDefault();
      // location.replace(result);
      // history.replaceState(null, document.title, result);
      // location.replace('');
      this.$router.push(this.fun.getUrl("MyAsset"));
    },
    toMore() {
      this.$router.push(this.fun.getUrl("TransNotice"));
    },
    toClass(item) {
      this.$router.push(this.fun.getUrl("ClassifiedSearch", { class_id: item.id }));
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      $http.get("plugin.asset.Frontend.Modules.Capital.Controllers.page.index", {}, "加载中...").then((response) => {
        if (response.result === 1) {
          this.banner = response.data.slide_list;
          this.noticeData = response.data.notice_first;
          this.classify = response.data.category_list;
          this.isLoadMore = true;
          this.total_page = response.data.asset_list.last_page;
          this.companyList = response.data.asset_list.data;
          this.homeData = response.data.statistics;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getLang() {
      $http.get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.fun.setWXTitle(this.lang.asset_name);
          this.$store.commit("setBlockchainLang", this.lang);
          window.localStorage.setItem("blockchainLang", JSON.stringify(this.lang));
          console.log(this.$store.state.blockchainLang);
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
        $http.get("plugin.asset.Frontend.Modules.Capital.Controllers.page.index", {
          page: that.page
        }, "加载中...").then(function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.asset_list.data;
            that.companyList = that.companyList.concat(myData);//数组拼接

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
  components: { cTitle, cMyswipe }
};
