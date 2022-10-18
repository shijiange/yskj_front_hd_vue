// import cDyPopup from "../../goods/diyFormPopup";
import { Toast } from "vant";
let defaultTitle = "消费奖励";
export default {
  components: {
    cDyPopup
  },
  data() {
    return {
      networkLoading: false,
      profitShow: false,
      dfData: {
        fields: {}
      },
      form_id: 0,
      form_data_id: 0,
      title: "",

      userInfo: {}
    };
  },
  created() {
    this.getData();
  },
  activated() {
    //this.fun.setWXTitle(this.title);
  },
  methods: {
    getData() {
      $http.get("plugin.consumer-reward.frontend.controllers.reward.index").then(res => {
        if (res.result != 1) return Toast(res.msg);
        this.dfData.fields = res.data.fields;
        this.form_id = res.data.form_id;
        this.userInfo = res.data;
        this.networkLoading = true;

        this.title = res.data.plugin_name || defaultTitle;
        this.fun.setWXTitle(this.title);
        console.log(res.data.fields, this.dfData);
      });
    },
    dfsave(form_data_id = 0) {
      console.log(form_data_id);
      this.form_data_id = form_data_id;
      $http
        .get("plugin.consumer-reward.frontend.controllers.reward.receive-income", {
          form_id: this.form_id,
          form_data_id
        })
        .then(res => {
          Toast(res.msg);
          if (res.result != 1) return;
          this.userInfo.reward_record = 0;
          // if(form_data_id!=0) this.setProfitShow();
          console.log(res);
        });
    },
    setProfitShow() {
      this.profitShow = !this.profitShow;
    },
    receive() {
      // if (this.userInfo.is_form == 1) {
      //   this.setProfitShow();
      // } else {
      this.dfsave();
      // }
    },
    gotoRewardRecord() {
      this.$router.push(this.fun.getUrl("consumerRewardRecord", {}));
    }
  }
};
