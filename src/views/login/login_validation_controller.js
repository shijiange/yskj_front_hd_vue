// import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {};
  },

  activated() {
    if (this.fun.isWeiXin()) {
      //微信中转处理
      this.spliceStr(window.location.href);
    } else if (this.fun.isApp()) {
      //app中转处理

      if (!YDB_isWXApp) {
        return;
      }

      this.applogin_validate();
    }
  },

  mounted() { },
  methods: {
    login_validate(state, code) {
      let data = {
        code: code,
        state: state
      };
      $http
        .post("member.login.index", data, "登录中")
        .then(res => {
          if (res.result == 1) {
            window.localStorage.setItem("isWxLogin", 0);
            if (res.data.url) {
              window.location.href = res.data.url;
            } else {
              this.$router.push(this.fun.getUrl("home"));
            }
          } else {
            this.$dialog.alert({message:res.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //截取字符串
    spliceStr(url) {
      let arr = this.GetParam(url, "state").split("#");

      let state = arr[0];

      let code = this.GetParam(url, "code");

      console.log(state, code);

      this.login_validate(state, code);
    },

    GetParam(url, id) {
      url = url + "";
      var regstr = "/(\\?|\\&)" + id + "=([^\\&]+)/";
      var reg = eval(regstr); //eval可以将 regstr字符串转换为 正则表达式
      var result = url.match(reg); //匹配的结果是：result[0]=?sid=22 result[1]=sid result[2]=22。所以下面我们返回result[2]

      if (result && result[2]) {
        return result[2];
      }
    },

    applogin_validate() {
      var that = this;
      let data = {
        apptoken: this.$route.query.apptoken
      };
      $http.post("member.login.index", data, "").then(response => {
        if (response.result == 1) {
          console.info("--会员信息--");
          console.info(response.msg);
          that.$store.commit("setLoginStatus", response.data.status);
          if (that.fun.isApp()) {
            if (response.msg.uid) {
              YDB.SetUserRelationForPush(response.msg.uid);
            } else {
              YDB.SetUserRelationForPush(response.msg.member_id);
            }
          }
          if (response.data.url) {
            window.location.href = response.data.url;
          } else {
            that.$router.push(this.fun.getUrl("home"));
          }
        } else {
          that.$store.commit("alerts", response.msg);
        }
      });
    }
  },
  components: {
    cTitle
  }
};
