import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

let defaultTitle = "消费奖励";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      member: {},
      listData: [],
      totalPrice: 0,
      withdraw_amount: "", //可提现金额
      title: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  created() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.consumer-reward.frontend.controllers.reward.reward-record").then(res => {
        if (res.result != 1) return Toast(res.msg);
        this.member = res.data.member;
        this.listData = res.data.reward_record.data;
        this.totalPrice = res.data.total;
        this.withdraw_amount = res.data.withdraw_amount;
        console.log(res);
        this.total_page = res.data.reward_record.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
        this.title = res.data.plugin_name || defaultTitle;
        this.fun.setWXTitle(this.title);
      });
    },
    gotoConsumerRewardApply() {
      this.$router.push(this.fun.getUrl("consumerRewardApply", {}));
    },
    gotoWithdraw() {
      //提现，成功重新请求刷新页面
      $http.get("plugin.consumer-reward.frontend.controllers.reward.receive-income", {}).then(res => {
        Toast(res.msg);
        if (res.result == 1) {
          this.getData();
        }
      });
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http.get("plugin.consumer-reward.frontend.controllers.reward.reward-record", { page: this.page }).then(res => {
          console.log(res);
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = res.data.reward_record.data;

            this.listData = this.listData.concat(nextPageData);
            //this.status = res.data.status;
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });
      }
    }
  }
};
