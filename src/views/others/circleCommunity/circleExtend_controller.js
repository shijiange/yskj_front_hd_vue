import cTitle from "components/title";
import { Toast } from "vant";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      currentShowTab: "paymentRecord",
      activeReward: "0",
      paymentRecord: [],
      paymentRecordPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      incomeCount: 0,
      memberInfo: null,
      loadedRewardInfo: false,
      rewardRecord: [],
      rewardRecordPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      currentShowRewardRecordTab: "",
      receivedRewardCount: 0,
      myRewardCount: 0,
      videoReward: [],
      videoRewardPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      unsettledCommission: 0,
      settledCommission: 0
    };
  },
  activated() {
    this.loadPaymentRecord();
  },
  methods: {
    switchRecordTab(name) {
      switch (name) {
      case "paymentRecord":
        if (this.paymentRecord.length == 0) {
          this.loadPaymentRecord();
        }
        break;
      case "rewardRecord":
        if (this.loadedRewardInfo == false) {
          this.loadRewardInfo();
        }
        if (this.rewardRecord.length == 0) {
          this.loadRewardRecord();
        }
        if (!this.currentShowRewardRecordTab) {
          this.currentShowRewardRecordTab = "received";
        }
        break;
      case "videoRecord":
        if (this.videoReward.length == 0) {
          this.loadVideoReard();
        }
        break;
      }
    },
    loadPaymentRecord() {
      if (this.paymentRecordPagination.loading || this.paymentRecordPagination.finished) {
        return;
      }
      this.paymentRecordPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-pay.circle-pay-log-list", {
          page: this.paymentRecordPagination.page
        })
        .then(({ data: response, result, msg }) => {
          this.paymentRecordPagination.loading = false;
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.paymentRecordPagination.finished = true;
          }
          this.incomeCount = response.incomeCount;
          if (!this.memberInfo) {
            this.memberInfo = response.member;
          }
          this.paymentRecordPagination.page++;
          this.paymentRecord.push(...response.list.data);
        });
    },
    switchRewardTab(name) {
      this.currentShowRewardRecordTab = name;
      this.rewardRecord = [];
      this.rewardRecordPagination = {
        page: 1,
        finished: false,
        loading: false
      };
      this.loadRewardRecord();
    },
    loadRewardInfo() {
      $http.get("plugin.circle.frontend.circle-pay.reward-log").then(({ data: response, result, msg }) => {
        if (result == 0) {
          Toast(msg);
          return;
        }
        if (this.memberInfo == null) {
          this.memberInfo = response.member;
        }
        this.receivedRewardCount = response.myRewardCount;
        this.myRewardCount = response.rewardCount;
        this.loadedRewardInfo = true;
      });
    },
    loadRewardRecord() {
      if (this.rewardRecordPagination.loading || this.rewardRecordPagination.finished) {
        return;
      }
      this.rewardRecordPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-pay.get-reward-list", {
          reward_type: this.currentShowRewardRecordTab == "received" ? 2 : 1,
          page: this.rewardRecordPagination.page
        })
        .then(({ data: response, result, msg }) => {
          this.rewardRecordPagination.loading = false;
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.rewardRecordPagination.finished = true;
          }
          this.rewardRecordPagination.page++;
          this.rewardRecord.push(...response.data);
        });
    },
    loadVideoReard() {
      if (this.videoRewardPagination.loading || this.videoRewardPagination.finished) {
        return;
      }
      this.videoRewardPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-pay.get-video-reward")
        .then(({ data: response, result, msg }) => {
          this.videoRewardPagination.loading = false;
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (this.memberInfo == null) {
            this.memberInfo = response.member;
          }
          this.unsettledCommission = response.unsettlement;
          this.settledCommission = response.settlement;
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.videoRewardPagination.finished = true;
          }
          this.videoRewardPagination.page++;
          this.videoReward.push(...response.list.data);
        })
        .catch(() => {
          Toast("服务器错误，请稍后重试");
          this.videoRewardPagination.loading = false;
        });
    }
  },
  components: {
    cTitle,
    DList
  }
};
