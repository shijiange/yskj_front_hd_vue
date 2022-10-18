import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      card_id: "",
      collectNum: 0,
      collectList: [],
      showTitle: "",
      showContent: "",
      showID: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.card_id = this.$route.params.card_id;
    this.getNumber();
    this.getDate();
  },
  methods: {
    initData() {
      this.showID = "";
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    toCard(item) {
      this.$router.push(this.fun.getUrl("BusinessCard",{},{mark_id: item.card_id, mark:'card'}));
    },
    showMore(id) {
      if (id === this.showID) {
        this.showID = "";
      } else {
        this.showID = id;
      }
    },
    showWeChat(item, str) {
      this.show = true;
      this.showTitle = str;
      if (str === "微信") {
        this.showContent = item.card.card_wechat;
      } else if (str === "电话") {
        this.showContent = item.card.card_mobile;
      }
    },
    getNumber() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.statistics.my-collection.index",
          { card_id: this.card_id },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.collectNum = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    getDate() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.statistics.my-collection.get-list",
          {
            card_id: this.card_id,
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
                this.collectList = response.data.data;
              } else {
                Toast(response.msg);
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
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
            "plugin.business-card.frontend.controllers.statistics.my-collection.get-list",
            {
              card_id: that.card_id,
              page: that.page
            },
            " "
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.collectList = that.collectList.concat(myData);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          )
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: { cTitle }
};
