import cTitle from "components/title";
import date from "../date/member_date";
import { Toast } from 'vant';
export default {
  data() {
    return {
      sign_status: "", //签到状态
      sign_total: "", //累计签到天数
      continue_days: "", //连续签到天数
      cumulative: "", //累计奖励
      sign_log: "", //签到天数
      sign_name: "", //签到名字
      sharedata: {},
      signnowBol:false
    };
  },
  methods: {
    signnow() {
      let that = this;
      if(that.signnowBol){
        return false;
      }
      that.signnowBol = true;
      $http
        .get("plugin.sign.Frontend.Modules.Sign.Controllers.sign.sign", {}, " ")
        .then(res => {
          if (res.result === 1) {
            zhuge.track('签到页面-签到成功');
            // var reslink = res.data.success_url;
            that.$dialog.alert({ message: res.msg})
              .then(() => {
                if(res.data.success_url && location.href != res.data.success_url){
                  location.href = res.data.success_url;
                }else{
                  that.getSign();
                }

              }).catch(() => {});

          } else {
            Toast(res.msg);
          }
          // that.signnowBol = false;
        });
    },
    getData() {
      let that = this;
      $http
        .get("plugin.sign.Frontend.Controllers.share.index", {}, " ")
        .then(function(response) {
          if (response.result === 1) {
            that.sharedata = response.data.share;
            that.fun.wxShare(
              "",
              {},
              {
                title: that.sharedata.share_title ? that.sharedata.share_title : '',
                imgUrl: that.sharedata.share_icon ? that.sharedata.share_icon : '',
                description: that.sharedata.share_desc ? that.sharedata.share_desc : ''
              }
            );
          }
        });
    },
    getSign() {
      $http
        .get(
          "plugin.sign.Frontend.Modules.Sign.Controllers.sign-log.index",
          {},
          "loading"
        )
        .then(res => {
          this.sign_status = res.data.sign_status;
          this.sign_total = res.data.sign_total;
          this.continue_days = res.data.continue_days;
          this.cumulative = window.localStorage.integral + res.data.cumulative.substr(2);
          this.sign_log = res.data.sign_log;
          this.sign_name = res.data.sign_name;
          this.fun.setWXTitle(this.sign_name || '签到');
        });
    }
  },
  activated() {
    zhuge.track('进入签到页面');
    this.getSign();
    this.getData();
  },
  components: { cTitle, date }
};
