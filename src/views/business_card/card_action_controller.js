import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
import ECharts from "../../components/Echarts";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      showTitle: "",
      showContent: "",
      showID: "",
      card_id: "",
      nowTab: 0,
      url: "",
      active: 0,

      visit: {
        diagram: {},
        statistics: {}
      },
      visitList: [],

      //名片动作的图表
      reliable: {},
      save: {},
      share: {},

      collect: {
        diagram: {}
      },
      collectList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.card_id = this.$route.params.card_id;
  },
  created() {
    this.card_id = this.$route.params.card_id;
    this.initData();
    this.getEchartDate();
    this.chooseTab(0);
    this.getCartAction();
    this.getcollect();
  },
  methods: {
    initData() {
      this.active = 0;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    toCard(item, str) {
      if (str === 'collect') {
        if (item.collect_card) {
          this.$router.push(this.fun.getUrl("BusinessCard",{},{mark_id: item.collect_card.id, mark:'card'}));
        } else {
          Toast({
            message: "该会员未开启名片",
            duration: 1000
          });
        }

      } else {
        if (item.visitor_card) {
          this.$router.push(this.fun.getUrl("BusinessCard",{},{mark_id: item.visitor_card.id, mark:'card'}));
        } else {
          Toast({
            message: "该会员未开启名片",
            duration: 1000
          });
        }

      }
    },
    chooseTab(index) {
      this.nowTab = index;
      if (this.nowTab === 0) {
        this.url =
          "plugin.business-card.frontend.controllers.statistics.visit.get-list";
      } else if (index === 2) {
        this.url =
          "plugin.business-card.frontend.controllers.statistics.collection.get-list";
      } else {
        return;
      }
      this.showID = "";
      this.page = 1;
      this.getListDate();
    },
    showMore(id) {
      if (id === this.showID) {
        this.showID = "";
      } else {
        this.showID = id;
      }
    },
    showWeChat(item, str, flag) {
      this.show = true;
      this.showTitle = str;
      if (str === "微信") {
        if (flag) {
          this.showContent = item.collect_card.card_wechat;
        } else {
          this.showContent = item.visitor_card.card_wechat;
        }
      } else if (str === "电话") {
        if (flag) {
          this.showContent = item.collect_card.card_mobile;
        } else {
          this.showContent = item.visitor_card.card_mobile;
        }
      }
    },
    getEchartDate() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.statistics.visit.index",
          { card_id: this.card_id },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.visit = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getListDate() {
      $http
        .get(
          this.url,
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
                if (this.nowTab === 0) {
                  this.visitList = response.data.data;
                } else if (this.nowTab === 2) {
                  this.collectList = response.data.data;
                }
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
        );
    },
    getCartAction() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.statistics.card-action.index",
          { card_id: this.card_id },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.reliable = response.data.reliable;
              this.save = response.data.save;
              this.share = response.data.share;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getcollect() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.statistics.collection.index",
          { card_id: this.card_id },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.collect = response.data;
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
            this.url,
            {
              card_id: that.card_id,
              page: that.page
            })
          .then(
            (response)=> {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                if (this.nowTab === 0) {
                  that.visitList = that.visitList.concat(myData); //数组拼接
                } else if (this.nowTab === 2) {
                  that.collectList = that.collectList.concat(myData);
                }
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
  components: { ECharts, cTitle }
};
