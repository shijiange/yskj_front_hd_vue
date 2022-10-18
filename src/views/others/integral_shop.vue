<template>
  <div>
    <img style="width: 8rem; height: 8rem; margin: 5rem 1.5rem 1rem 1.5rem;" v-if="timer" src="../../assets/images/sign/yq_sign_renzheng@2x.png" alt="" />
    <div>{{ timer ? "验证中..." : "" }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agentData: {
        agent_secret: "",
        agentid: "",
        corpid: ""
      },
      timer: null
    };
  },
  activated() {
    if (this.$route.query.is_wx == 1) {
      this.getAgentConfig();
    } else if (this.$route.query.url) {
      // 人脸认证跳转
      this.getFaceStatus();
    } else {
      this.getData();
    }
  },
  deactivated() {
    if (this.timer) {
      this.timer = null;
      clearInterval(this.timer);
    }
  },
  methods: {
    getAgentConfig() {
      $http
        .get("plugin.wechat-chat-sidebar.frontend.controller.index.get-config", { url: this.fun.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href })
        .then(response => {
          if (response.result === 1) {
            this.agentData = response.data;
            let get_token = response.data.get_token;
            let config = {
              debug: false,
              beta: true,
              jsApiList: ["agentConfig"],
              openTagList: ["ww-open-data"],
              appId: this.agentData.corpid,
              nonceStr: get_token.noncestr,
              timestamp: get_token.timestamp,
              signature: get_token.token
            };
            wx.config(config);
            wx.ready(() => {
              setTimeout(() => {
                this.getAgentSign(config, get_token.app_token);
              }, 500);
            });
            wx.error(res => {
              console.log("getAgentConfig：：config信息验证失败！" + JSON.stringify(res));
            });
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(error => {
          console.log("getAgentConfig::", error);
        });
    },
    getAgentSign(config, app_token) {
      wx.agentConfig({
        corpid: config.appId,
        agentid: this.agentData.agentid,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: app_token,
        jsApiList: ["getCurExternalContact"],
        success: () => {
          wx.invoke("getCurExternalContact", {}, res => {
            if (res.err_msg == "getCurExternalContact:ok") {
              console.log("getCurExternalContact:ok ::::::::::::::", res.userId);
              this.getCustomerInfo(res.userId); //返回当前外部联系人userId
            } else {
              //错误处理
              this.$toast("获取当前外部联系人失败！");
            }
          });
        },
        fail: res => {
          this.$toast("agentConfig调用失败");
        }
      });
    },
    getCustomerInfo(userId) {
      console.log("getCustomerInfo");
      $http.get("plugin.wechat-chat-sidebar.frontend.controller.index.get-customer-info", { user_id: userId }, "loading").then(response => {
        console.log("getCustomerInfo::response");
        if (response.result === 1) {
          this.$dialog.alert({ message: response.msg + userId });
        } else {
          this.$toast(response.msg);
        }
      });
    },
    getFaceStatus() {
      $http
        .post("plugin.real-name-auth.frontend.auth.checkAuthStatus")
        .then(response => {
          if (response.result === 1) {
            if (response.data.auth_status == 1) {
              if (this.timer) {
                this.timer = null;
                clearInterval(this.timer);
              }
              window.location.href = this.$route.query.url;
            } else {
              if (!this.timer) {
                this.timer = setInterval(() => {
                  this.getFaceStatus();
                }, 3000);
              }
            }
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              this.$router.push(this.fun.getUrl("home"));
            });
          }
        })
        .catch(error => {
          this.$router.push(this.fun.getUrl("home"));
          console.log(error);
        });
    },
    getData() {
      $http
        .post(
          "plugin.credit-link.frontend.login.index",
          {
            user_mobile: this.fun.getKey("user_mobile"),
            superior_mobile:this.fun.getKey("superior_mobile"),
            sign: this.fun.getKey("sign"),
            app_id: this.fun.getKey("app_id"),
            timestamp: this.fun.getKey("timestamp"),
            number: this.fun.getKey("number"),
            point: this.fun.getKey("point"),
            notify_url: this.fun.getKey("notify_url")
          },
          ""
        )
        .then(response => {
          this.$router.push(this.fun.getUrl("home"));
        })
        .catch(error => {
          this.$router.push(this.fun.getUrl("home"));
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
