<template>
  <div class="push-task-page">
    <scope-panel title="推送详情">
      <div class="task-message">
        <span v-if="taskType == 4">你需要在{{time}}给群聊推送以下信息</span>
        <span v-else>管理员提醒你在{{time}}给推送以下信息</span>
      </div>
      <p class="task-name" v-if="task_name">{{task_name}}</p>
      <div v-if="taskContent.length > 0" class="task-content">
        <div v-for="(item, index) in taskContent" :key="index">
          <!-- 文本 -->
          <div v-if="item.type == 'text'" class="text-box task-box">{{item.news}}</div>
          <!-- 图片 -->
          <div v-if="item.type == 'image'" class="img-box task-box">
            <img :src="item.link_img" alt="" class="image" @click="previewImg(item.link_img)">
          </div>
          <!-- 视频 -->
          <div v-if="item.type == 'video'" class="img-box task-box">
            <video class="task-video" width="320" height="240" controls>
                <source :src="item.link_video">
                您的浏览器不支持 video 标签。
            </video>
          </div>
          <!-- 链接 -->
          <div v-if="item.type == 'link'" class="link-box task-box">
            <div class="link-title">{{item.title}}</div>
            <p class="link-url">{{item.link}}</p>
            <p>{{item.describe}}</p>
            <img :src="item.link_img" alt="" class="image" @click="previewImg(item.link_img)">
          </div>
          <!-- 小程序 -->
          <div v-if="item.type == 'applet'" class="link-box task-box">
            <div class="link-title">{{item.title}}</div>
            <p class="link-url">{{item.appid}}</p>
            <p class="link-url">{{item.page}}</p>
            <img :src="item.link_img" alt="" class="image" @click="previewImg(item.link_img)">
          </div>
          <!-- 文件 -->
          <div v-if="item.type == 'file'" class="file-box task-box">
            <div class="file-name">文件名称</div>
          </div>
        </div>
      </div>
    </scope-panel>

    <scope-panel title="推送方法">
      <ol class="rules">
        <li>1、点击任意{{taskTypeName}}边上的“去聊天”打开{{taskTypeName}}聊天会话窗口。</li>
        <li>2、通过聊天侧边栏打开“sop”侧边栏页面。</li>
        <li>3、点击发送“去发送”，快递将素材分享到当前会话，按下Enter键即可完成任务。</li>
      </ol>

      <div class="btn-box">
        <div class="flex-aj-c">
          <div class="back-btn" @click="backPath">返回</div>
          <div :class="['push-btn', {'invalid-btn': taskContent.length <= 0}]" @click="sendHandler">{{isPc?'一键发送':'发送消息'}}</div>
        </div>
        <div class="tip">点击最下方去发送，在点击Enter键发送出去！</div>
      </div>
    </scope-panel>
  </div>
</template>

<script>
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权
import scopePanel from "../components/scopePanel";

export default {
  mixins: [appAgentConfig],
  data () {
    return {
      isPc: true,
      taskType: 1,
      taskTypeName: "客户",
      chatId: "",
      userId: "",
      time: '',
      log_id: null,
      task_name: '',
      taskData: {},
      taskContent: [],
    };
  },

  created () {
    let that = this;
    this.isPc = this.fun.isPc();
    // 设置调用AgentConfig之后需要调用接口 appjsApiList
    this.appjsApiList = ["getCurExternalContact", "getCurExternalChat", "sendChatMessage"];
    // AgentConfig 之后的回调函数， 回调函数会在activated生命周期中调用
    this.appSignCallback = () => {
      that.task_log = this.$route.params.taskLog;
      /* getCurExternalChat 获取当前客户群的群ID */
      wx.invoke('getCurExternalChat', {}, res => {
        if(res.err_msg == "getCurExternalChat:ok"){
          that.taskType = 4;
          that.chatId = res.chatId;
          that.getCustomerTask();
        }
      });
      /* getCurExternalContact 获取当前外部联系人userid */
      wx.invoke('getCurExternalContact', {}, res => {
        if(res.err_msg == "getCurExternalContact:ok"){
          that.taskType = 1;
          that.userId  = res.userId ;
          that.getCustomerTask();
        }
      });
    };
  },

  activated () {
    // // 测试用例 start
    // this.taskType = 4;
    // that.task_log = this.$route.params.taskLog;
    // this.chatId = "wrDesSDgAA6xcEWUBT6TDrFGZRFQjRJg";
    // this.userId = "wmDesSDgAAnVOxcNIw8XQ6x1qhN5ZidA";
    // this.getCustomerTask();
    // // 测试用例 end
  },

  methods: {
    getCustomerTask () {
      let requestJson = {};
      requestJson.task_log_id = this.task_log;
      if (this.taskType == 4) {
        requestJson.chat_id = this.chatId;
      } else {
        requestJson.external_userid = this.userId;
      }
      $http.post("plugin.sop-task.frontend.controller.task.task.getContent", requestJson, "")
        .then(({result, msg, data}) => {
          if (result !== 1) {
            return this.$toast(msg);
          }
          this.time = data.date;
          this.log_id = data.task_log_id;
          this.task_name = data.task_name;
          // 后端不能返回数组，后面单条发送根据对象的key来发送
          this.taskContent = this.objToArr(JSON.parse(data.content_list));
          this.setTaskType(data.task_type);
        });
    },

    objToArr (object) {
      let arr = [];
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const element = object[key];
          element.id = key;
          arr.push(element);
        }
      }
      return arr;
    },

    setTaskType (type) {
      this.taskType = type!=undefined ? type * 1 : 1;
      if (type == 4) {
        // 群聊
        this.taskTypeName = "群聊";
      } else if ([1,2,3].includes(type)){
        // 客户
        this.taskTypeName = "客户";
      }
    },


    // 发送消息
    sendHandler () {
      if (this.taskContent && this.taskContent.length <= 0) {
        return false;
      }
      if (this.isPc) {
        // pc端发送全部
        this.sendAllMessage();
      } else {
        // 手机端单条发送
        this.sendMessage();
      }
    },

    // 单条发送
    sendMessage () {
      let that = this;
      let message_id = that.taskContent[0].id; // 默认发送第一条数据
      let logContent = that.taskContent[0];
      let chatMessConfig = that.messageConfig(logContent);
      wx.invoke('sendChatMessage', chatMessConfig, (res) =>{
        if (res.err_msg == 'sendChatMessage:ok') {
          that.$toast("消息已生成，请点击聊天框发送按钮！");
          that.taskComplete(1, message_id);
        } else if (res.err_msg == "fail invalid img_url") {
          that.$toast("参数错误，图片地址错误");
        } else if (res.err_msg == "sendChatMessage:fail, invalid param, link or img_url is invalid") {
          that.$toast("参数错误，链接或图片地址错误");
        }
      });
    },

    // 全部发送
    sendAllMessage () {
      let that = this;
      let content = that.taskContent;
      this.$dialog.confirm({
        title: "提示",
        message: "该操作将发送该任务的全部消息，确认全部发送吗？"
      }).then(() => {
        content.forEach((mess,index) => {
          let chatMessConfig = that.messageConfig(mess);
          wx.invoke('sendChatMessage', chatMessConfig, (res) =>{
            if (res.err_msg == 'sendChatMessage:ok') {
              if(index === content.length-1) {
                that.$toast("消息已生成，请点击聊天框发送按钮！");
                that.taskComplete(0);
              }
            } else if (res.err_msg == "fail invalid img_url") {
              that.$toast("参数错误，图片地址错误");
            } else if (res.err_msg == "sendChatMessage:fail, invalid param, link or img_url is invalid") {
              that.$toast("参数错误，链接或图片地址错误");
            }
          });
        });
      });
    },

    // 消息分享配置
    messageConfig (config) {
      let configObj = {};
      if (config.type == "text") {
        configObj = {
          msgtype: "text",
          text: {content: config.news},
        };
      }  else if (config.type == "link") {
        configObj = {
          msgtype: "news",
          news: {
            link: config.link, //H5消息页面url 必填
            title: config.title ? config.title : '', //H5消息标题
            desc: config.describe, //H5消息摘要
            imgUrl: config.link_img,
          },
        };
      } else if (config.type == "applet") {
        configObj = {
          msgtype: "miniprogram",
          miniprogram: {
            appid: config.appid,//小程序的appid，企业已关联的任一个小程序
            title: config.title, //小程序消息的title
            imgUrl: config.link_img,//小程序消息的封面图。
            page: config.page, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
          },
        };
      } else if (config.type == "image") {
        configObj = {
          msgtype: "image",
          image: {mediaid: config.media_id},
        };
      } else if (config.type == "video") {
        configObj = {
          msgtype: "video",
          video: {mediaid: config.media_id},
        };
      } else if (config.type == "file") {
        configObj = {
          msgtype: "file",
          file: {mediaid: config.media_id},
        };
      }
      configObj.enterChat = true;
      return configObj;
    },

    // 完成发送
    taskComplete (type, content_index) {
      let requestJson = {};
      requestJson.task_log_id = this.log_id;
      requestJson.send_type = type;
      if (type === 1) {
        requestJson.content_index = content_index;
      }
      $http.post("plugin.sop-task.frontend.controller.task.task.send", requestJson, "loading")
        .then(response => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.isPc && this.backPath();
        });
    },

    backPath () {
      this.$router.go(-1);
    },
  },

  components: {
    scopePanel
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.push-task-page {
  text-align: left;
  padding: 0.63rem;
  background-color: #f6f6f6;
  .task-message {
    font-size: 12px;
    color: #727272;
    margin-top: 0.63rem;
  }
  .task-name {
    font-size: 14px;
    color: #666666;
    margin: 0.59rem 0;
  }

  .task-content {
    .task-box {
      margin-top: 0.63rem;
      padding: 0.63rem;
      background-color: #f9f9f9;
      border-radius: 0.31rem;
      word-break: break-all;
    }
    .image {
      // width: 3.28rem;
      height: 4.28rem;
      border-radius: 0.31rem;
    }
    .task-video {
      height: 10rem;
      border-radius: 0.31rem;
    }
    .link-box {
      // line-height: 1.3rem;
      .link-url {
        color: #727272;
      }
      div, p {
        margin: 0.3rem 0;
      }
    }
    .link-title {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .file-name {
      max-width: 6rem;
      padding: 0.5rem;
      font-size: 0.85rem;
      text-align: center;
      border-radius: 0.3rem;
      background-color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
  }

  .rules {
    li {
      font-size: 12px;
      color: #727272;
      margin: 0.55rem 0;
    }
  }

  .btn-box {
    margin-top: 2rem;
    padding-bottom: 1rem;
    text-align: center;
    cursor: pointer;
    .back-btn {
      width: 6.25rem;
      color: #f05152;
      padding: 0.3rem 0;
      border-radius: 0.88rem;
      border: solid 0.03rem #f05152;
    }
    .push-btn {
      width: 6.25rem;
      color: #ffffff;
      margin-left: 1rem;
      padding: 0.3rem 0;
      border-radius: 0.88rem;
      background-color: #f05152;
    }
    .invalid-btn {
      background-color: #a7a6a6;
    }
    .tip {
      margin-top: 0.5rem;
      font-size: 12px;
      color: #727272;
    }
  }

  .flex-aj-c {
    display: flex;
    justify-content: center;
    align-items: center;
  }

}

</style>