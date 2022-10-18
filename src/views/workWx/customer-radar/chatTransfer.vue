<template>
  <div>
    <!-- <button @click="callOpenEnterpriseChat()">打开会话窗口</button> -->
  </div>
</template>

<script>
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权
export default {
  mixins: [appAgentConfig],
  data () {
    return {
    };
  },

  created () {
    // 设置调用AgentConfig之后需要调用接口 appjsApiList
    this.appjsApiList = ["openEnterpriseChat"];
    // AgentConfig 之后的回调函数
    this.appSignCallback = () => {
      this.time = setTimeout(() => {
        this.callOpenEnterpriseChat();
      }, 100);
    };
  },
  destroyed () {
    clearTimeout(this.time);
  },

  methods: {
    callOpenEnterpriseChat () {
      let that = this;
      let external_userid = this.fun.getKey("external_userid");
      let user_id = this.fun.getKey("user_id");
      if (!(external_userid || user_id)) {
        return this.$toast("联系人id为空，无法打开会话！");
      }
      wx.openEnterpriseChat({
        userIds: user_id?user_id:'',
        externalUserIds: external_userid?external_userid:'',
        success: function() {
          // Iphone 使用wx.closeWindow会关闭当前聊天窗口
          if (!that.fun.isIphone()) {
            wx.closeWindow();
          }
        },
        fail: function(res) {
          if(res.errMsg.indexOf('function not exist') > -1){
            alert('版本过低请升级');
          }
        }
      });
    }
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
</style>