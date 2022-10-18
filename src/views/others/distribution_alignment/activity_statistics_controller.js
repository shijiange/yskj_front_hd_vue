import cMyswipe from "components/myswipe";
import cTitle from "components/title";
import { Toast } from 'vant';
import Vue from "vue";
import { Overlay } from "vant";
Vue.use(Overlay);

export default {
  data() {
    return {
      name:'',
      nickname: "",
      avatar: "",
      total_activity: "",
      total_income: "",
      estimate_amount: "",
      unsettlement_amount: "",
      settlement_amount: "",
      nowithdraw_amount: "",
      withdraw_amount: "",
      failure_amount: "",

      activeName: "first",
      activity_list: [],
      status: 3, //3全部，0活动中，1已完成 ，-1失败

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      // this.isLoadMore = false;
      $http
        .post(
          "plugin.commission-activity.api.activity-inquire.index",
          { status: this.status },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              this.nickname = response.data.nickname;
              this.avatar = response.data.avatar;
              this.total_activity = response.data.total_activity;
              this.total_income = response.data.total_income;
              this.estimate_amount = response.data.estimate_amount;
              this.unsettlement_amount = response.data.unsettlement_amount;
              this.settlement_amount = response.data.settlement_amount;
              this.nowithdraw_amount = response.data.nowithdraw_amount;
              this.withdraw_amount = response.data.withdraw_amount;
              this.failure_amount = response.data.failure_amount;

              let activity = response.data.activity;
              this.activity_list = activity.data;
              this.page = activity.current_page;
              this.total_page = activity.last_page;

              this.name = response.data.name;
              if(this.name) {
                this.fun.setWXTitle(this.name);
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    handleClick(x) {
      this.getListData(x);
    },
    getListData(x) {
      this.isLoadMore = false;
      this.page = 1;
      this.total_page = 0;
      this.activity_list = [];
      $http
        .post("plugin.commission-activity.api.activity-inquire.index", {
          status: x
        })
        .then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let activity = response.data.activity;
              this.activity_list = activity.data;
              this.page = activity.current_page;
              this.total_page = activity.last_page;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    gotoCommision(x) {
      this.$router.push(
        this.fun.getUrl("DistributionCommissionDetail", {
          tag: x
        })
      );
    },
    gotoParticipant(id) {
      this.$router.push(
        this.fun.getUrl("DistributionParticipant", {
          id: id
        })
      );
    },
    gotoOrder(id) {
      this.$router.push(
        this.fun.getUrl("commissionOrderdetail", {
          order_id: id,
          orderType:'commission_activity'
        })
      );
    },
  },
  components: { cTitle, cMyswipe }
};
