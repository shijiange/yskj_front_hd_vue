<template>
  <div class="push-task-page">
    <scope-panel title="推送详情">
      <div class="task-message">管理员提醒你在{{taskTime}}给{{taskTypeName}}推送以下信息</div>
      <p class="task-name">{{taskName}}</p>
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
      <van-empty v-else description="没有任务内容了"></van-empty>
    </scope-panel>

    <scope-panel title="推送方法">
      <ol class="rules">
        <li>1、点击任意客户边上的“去聊天”打开客户聊天会话窗口。</li>
        <li>2、通过聊天侧边栏打开“sop”侧边栏页面。</li>
        <li>3、点击发送“去发送”，快递将素材分享到当前会话，按下Enter键即可完成任务。</li>
      </ol>
      <template>
        <div class="customer-list" v-if="chatList && chatList.length > 0">
          <div class="customer-box" v-for="(item, index) in chatList" :key="index">
            <img class="avatar" :src="item.avatar" alt="">
            <div style="margin-left: 0.5rem">
              <div class="customer-info">
                <div class="nickname overflow">{{taskType== 4 ? item.group_name : item.name}}</div>
                <div class="source">@微信</div>
              </div>
              <div class="chat-btn" @click="openEnterpriseChat(item)">去聊天</div>
            </div>
          </div>
        </div>
        <van-empty v-else :description="taskType== 4?'当前没有群聊':'当前没有客户'"></van-empty>
      </template>
    </scope-panel>

  </div>
</template>

<script>
import { ImagePreview } from "vant";

import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权
import scopePanel from "../components/scopePanel";

export default {
  mixins: [appAgentConfig],
  data () {
    return {
      taskId: "",
      taskType: "", // 4: 群聊， (1,2,3): 客户
      taskTypeName: "客户",
      taskTime: "",
      taskName: "",
      taskContent: "",
      chatList: [],
    };
  },

  created () {
    // 设置调用getAgentConfig之后需要调用接口 appjsApiList
    this.taskId = this.fun.getKey("taskId");
    this.appjsApiList = ["selectExternalContact", "openEnterpriseChat"];
  },

  activated () {
    this.getPageData();
  },

  methods: {
    // 获取页面数据
    getPageData () {
      $http.get("plugin.sop-task.frontend.controller.member.member.getTaskInfo",{ task_id: this.taskId },"loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          let pageData = response.data;
          this.taskType = pageData.task_type;
          if (this.taskType === 4) {
            // 群聊
            this.taskTypeName = "群聊";
            this.chatList = pageData.group_chat_list??[];
            this.chatList.forEach(item => {
              item.avatar = pageData.group_chat_avatar;
            });
          } else if ([1,2,3].includes(this.taskType)){
            // 客户
            this.taskTypeName = "客户";
            this.chatList = pageData.customer_list??[];
          }
          this.taskTime = pageData.date;
          this.taskType = pageData.task_type;
          this.taskName = pageData.task_name;
          this.taskContent = pageData.content_list??[];
        });
    },

    // 图片预览
    previewImg (imgs) {
      ImagePreview([imgs]);
    },

    // 打开会话窗口
    openEnterpriseChat (item) {
      if (!this.isSignWorkApp) {
        return this.$dialog.confirm({
          title: '提示',
          message: '企业应用未授权!',
        });
      }
      let json = {};
      if (this.taskType === 4) {
        // 群聊
        json.chatId = item.chat_id;
      } else if ([1,2,3].includes(this.taskType)){
        // 客户
        json.externalUserIds = item.external_userid;
      }

      wx.openEnterpriseChat({
        ...json,
        success: function(res) {
          wx.closeWindow();
        },
        fail: function(res) {
          if(res.errMsg.indexOf('function not exist') > -1){
            alert('版本过低请升级');
          }
        }
      });
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
  .customer-list {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    white-space: nowrap;
    .customer-box{
      flex: 1;
      display: flex;
      align-items: center;
      margin-top: 0.8rem;
      .avatar {
        width: 2.38rem;
        height: 2.38rem;
        margin: 0;
        border-radius: 0.13rem;
      }
      .customer-info {
        display: flex;
      }
      .nickname {
        max-width: 4rem;
      }
      .source {
        margin-left: 0.3rem;
        color: #2db755;
      }
      .chat-btn {
        display: inline-block;
        margin-top: 0.3rem;
        padding: 0.1rem 0.5rem;
        color: #f05152;
        text-align: center;
        border-radius: 1rem;
        font-size: 12px;
        border: solid 1px #f05152;
        cursor: pointer;
      }
    }
  }
  .flex-aj-c {
    display: flex;
    justify-content: center;
    align-items: center;
  }

}

</style>