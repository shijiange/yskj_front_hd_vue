import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      choose_index: -1,
      date_index: -1,
      allData: {},
      member: {},
      rewards: {},
      name: {},
      rewards_type: 1,
      recordsList: [],
      amount_id: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      not_rewarded: "",
      rewarded: ""
    };
  },
  activated() {
    this.initData();
    this.getStatistic();
    this.getData();
  },
  methods: {
    tabHandel(index) {
      this.rewards_type = index + 1;
      this.initData();
      this.getData();
      this.choose_index = -1;
    },
    getStatistic() {
      let that = this;
      $http.get("plugin.partner-reward.frontend.controllers.reward-log.index").then(
        response => {
          if (response.result === 1) {
            console.log(response.data);
            that.rewards = response.data;
            that.fun.setWXTitle(response.data.name);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let that = this;
      $http.get("plugin.partner-reward.frontend.controllers.reward-log.getLogByType", { page: 1, reward_type: that.rewards_type }).then(
        response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.recordsList = response.data.data;
            that.not_rewarded = response.data.not_rewarded;
            that.rewarded = response.data.rewarded;
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
      let that = this;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get("plugin.partner-reward.frontend.controllers.reward-log.getLogByType", {
            page: that.page,
            reward_type: that.rewards_type
          })
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
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
    },
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.amount_id = "";
      this.choose_index = -1;
      this.date_index = -1;
    },
    openDetail(index, index1) {
      if (this.choose_index == index1 && this.date_index == index) {
        this.choose_index = -1;
        this.date_index = -1;
      } else {
        this.choose_index = index1;
        this.date_index = index;
      }
    }
  },
  components: { cTitle }
};
