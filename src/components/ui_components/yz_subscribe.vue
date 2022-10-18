<template>
  <div class="posSubscribe" v-if="subTemplate">
    <wx-open-subscribe
      :style="{ width: styleSubWidth ? styleSubWidth : '100%', height: couponHeight ? couponHeight : '100%' }"
      @success="subSuccess"
      @error="subError"
      :template="subTemplate"
      id="subscribe-btn"
      v-if="subTemplate"
    >
      <script type="text/wxtag-template">
        <style>
            .btn2 {
              width: {{styleWidth}};
              height: {{styleHeight?styleHeight:'100%'}};
              border: none;
              padding: 15px 10px;
              opacity: 0;
            }
        </style>
        <button class="btn2">提交</button>
      </script>
    </wx-open-subscribe>
  </div>
</template>

<script>
const plugin_setting = JSON.parse(localStorage.getItem("plugin_setting"));

export default {
  props: {
    tagName: {
      type: String,
      default: ""
    },
    styleWidth: {
      type: String,
      default: ""
    },
    styleHeight: {
      type: String,
      default: "100%"
    },
    styleSubWidth: {
      type: String,
      default: "100%"
    },
    couponHeight: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      subTemplate: ""
    };
  },
  components: {},
  computed: {},
  mounted() {
    if (plugin_setting.wechat_notice) {
      if (plugin_setting.wechat_notice.enable) {
        this.initShare();
      }
    }
  },
  methods: {
    initShare() {
      this.fun.wxShare("", {}, {}, null, null, () => {
        this.get_subscribe();
      });
    },
    subSuccess(e) {
      let subscribeDetails = JSON.parse(e.detail.subscribeDetails);
      let template_id = [];
      for (let i in subscribeDetails) {
        if (JSON.parse(subscribeDetails[i]).status == "accept") {
          template_id.push(i);
        }
      }
      if (template_id.length <= 0) {
        this.subTemplate = "";
        this.$emit("confirm", e);
      } else {
        this.subTemplate = "";
        this.$emit("confirm", e);
        this.sendLogs(template_id);
      }
    },
    subError(error) {
      console.error("这是失败的", error);
      this.$emit("error", error);
    },
    get_subscribe() {
      $http.post("plugin.wechat-notice.api.index.get-subscribe", { scene: this.tagName }).then(
        response => {
          if (response.result === 1) {
            this.subTemplate = response.data.data;
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    /*
      scene 场景值
      template_id 只传status为accept的模板ID
    */
    sendLogs(arr) {
      $http.post("plugin.wechat-notice.api.index.add-subscribe-log", { scene: this.tagName, template_id: arr }).then(
        response => {
          if (response.result === 1) {
            console.log("log接口", response);
          }
        },
        response => {
          console.log(response);
        }
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.posSubscribe {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
