// 企业微信侧边栏应用授权
export const appAgentConfig = {
  data() {
    return {
      isSignWorkApp: false, // 企业微信应用授权
      agentData: { // 企业微信config接口配置
        agent_secret: "",
        agentid: "",
        corpid: ""
      },
      get_token: {},
      testUserId: 'wmDesSDgAAnVOxcNIw8XQ6x1qhN5ZidA', // dev15 测试userId
      appjsApiList: [], // 成功调用agentConfig后 需要调用的接口名称
      appSignCallback: null, // 成功调用agentConfig后 需要调用的回调函数
      appSignError: null, // 调用agentConfig 失败的回调函数
    };
  },

  created () {
    // 需要在 调用getAgentConfig之前设置 appjsApiList,appSignCallback,appSignError
  },

  mounted () {
  },

  activated () {
    this.getAgentConfig();
  },

  methods: {
    // 企业微信配置信息
    async getAgentConfig() {
      try {
        let response = await $http.get("plugin.wechat-chat-sidebar.frontend.controller.index.get-config",
          { url: this.fun.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href },
          "loading"
        );
        if (response.result == 1) {
          this.agentData = response.data;
        } else {
          return this.$toast(response.msg);
        }

        this.get_token = this.agentData.get_token;
        let config = {
          debug: false,
          beta: true,
          jsApiList: ["agentConfig", "closeWindow"],
          openTagList: ["ww-open-data"],
          appId: this.agentData.corpid,
          nonceStr: this.get_token.noncestr,
          timestamp: this.get_token.timestamp,
          signature: this.get_token.token
        };
        wx.config(config);
        wx.ready(() => {
          setTimeout(() => {
            this.getAgentSign(config, this.get_token.app_token);
          }, 500);
        });
        wx.error(res => {
          console.log("getAgentConfig：：config信息验证失败！" + JSON.stringify(res));
        });
      } catch (err) {
        console.log("getAgentConfig接口报错", err);
      }
    },

    // 企业微信 自建应用授权配置
    getAgentSign(config, app_token) {
      let that = this;
      wx.agentConfig({
        debug: false,
        corpid: config.appId,
        agentid: this.agentData.agentid,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: app_token,
        jsApiList: that.appjsApiList,
        success: () => {
          console.log("应用授权完成");
          that.isSignWorkApp = true;
          that.appSignCallback && that.appSignCallback();
          // 测试需删除
          // that.$toast("企业应用授权成功");
        },
        fail: res => {
          console.log('agentConfig::失败',res);
          that.appSignError && that.appSignError();
          if(res.errMsg.indexOf('function not exist') > -1){
            that.$toast('版本过低请升级');
          } else {
            that.$toast("企业应用授权失败，请联系管理员重新配置！");
          }
        }
      });
    },
  },
};