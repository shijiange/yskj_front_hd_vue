import DList from "@/components/dlist";

//标记 防止重复加载

export default {
  data() {
    return {
      details: {},
      tabsIndex: 0,

      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      love_name: "爱心值",
      receiveBtnLoading: false
    };
  },

  mounted() {},

  activated() {
    if (this.$route.query.love_name && this.$route.query.love_name != "") {
      this.love_name = this.$route.query.love_name;
    }
    this.getData();
    this.getListData();
  },

  methods: {
    initPage() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },

    //初始化数据
    getData() {
      $http.get("plugin.love-cycle-award.frontend.controllers.cycle-award.statistics", {}, "").then(
        res => {
          console.log(res);
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.details = res.data;
        },
        res => {
          this.$toast(res.msg);
        }
      );
    },

    getListData() {
      this.initPage();
      let json = {};
      if (this.tabsIndex > 0) {
        json.status = this.tabsIndex;
      }

      $http.get("plugin.love-cycle-award.frontend.controllers.cycle-award.queue-list", json, "").then(
        res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.listData = res.data.reward_queues;
          this.total_page = res.data.total;
          if (this.total_page <= 0) {
            this.total_page = 1;
          }
          if (this.total_page <= this.page) {
            this.loading = true;
            this.isLoadMore = false;
          }
        },
        response => {
          this.$toast(response.msg);
        }
      );
    },

    getMoreData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      // console.log('加载更多启动');
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        //console.log('没了');
      } else {
        this.page += 1;
        let json = {
          page: this.page
        };
        if (this.tabsIndex > 0) {
          json.status = this.tabsIndex;
        }
        $http
          .get("plugin.love-cycle-award.frontend.controllers.cycle-award.queue-list", json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.reward_queues;
              this.listData = this.listData.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //领取
    receiveAwardGain() {
      if (this.details.receivable == 0) return;
      if(this.receiveBtnLoading == true) return;
      this.receiveBtnLoading = true;
      $http.get("plugin.love-cycle-award.frontend.controllers.receive-award.gain", {}, "").then(
        res => {
          this.receiveBtnLoading=false;
          this.$toast(res.msg);
          if (res.result != 1) {
            return;
          }
          this.details.receivable = 0;
        },
        response => {
          this.receiveBtnLoading=false;
          this.$toast(response.msg);
        }
      );
    },

    gotoLoveCashbackRecord(id) {
      this.$router.push(this.fun.getUrl("loveCashbackRecord", {}, { id }));
    },

    changeTabsIndex(evt) {
      this.tabsIndex = evt;
      this.getListData();
    }
  },
  components: { DList }
};
