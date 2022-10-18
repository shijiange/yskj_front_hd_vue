import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      active: 0,
      url: "",
      list: [],
      rankType: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },
  activated() {},
  mounted() {
    this.initData();
    this.chooseType(0);
  },
  methods: {
    loadTop() {
      this.initData();
      this.chooseType(0);
      // this.$refs.loadmore.onTopLoaded();
    },
    chooseType(index) {
      switch (index) {
      case 0:
        this.rankType = "visit";
        break;
      case 1:
        this.rankType = "collection";
        break;
      case 2:
        this.rankType = "reliable";
        break;
      default:
        this.rankType = "visit";
        break;
      }
      this.list = [];
      this.getDate();
    },
    initData() {
      this.active = 0;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    toCard(item) {
      this.$router.push(
        this.fun.getUrl(
          "BusinessCard",
          {},
          { mark_id: item.card_id, mark: "card" }
        )
      );
    },
    getDate() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.rank.card-rank.index",
          {
            rank_type: this.rankType,
            page: 1
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.result === 1) {
                this.isLoadMore = true;
                this.total_page = response.data.last_page;
                if (!this.total_page) {
                  this.total_page = 0;
                }
                this.list = response.data.data;
                this.isLoading = false;
              } else {
                this.isLoading = false;
                Toast(response.msg);
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.business-card.frontend.controllers.rank.card-rank.index",
            {
              rank_type: that.rankType,
              page: that.page
            },
            " "
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.list = that.list.concat(myData);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
