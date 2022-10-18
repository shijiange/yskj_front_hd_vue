<template>
  <div class="sop-task-list">
    <div class="content">
      <scope-panel :title="'当前'+taskTypeName+'待发消息('+taskCount+'条)'">
        <template #header-box>
          <div class="tab-bar">
            <div
              v-for="(item,index) in tabs" :key="index"
              class="tab" :class="taskType==item.type ? 'active-tab' : ''"
              @click="changeTab(item.type)"
            >{{item.name}}</div>
          </div>
          <div ></div>
          <van-divider style="margin: 10px 0;"></van-divider>
        </template>
        <div v-if="taskCount*1 > 0">
          <div class="task-message">管理员提醒你在{{taskTime}}给{{taskTypeName}}推送以下信息</div>
          <ul class="task-list">
            <li class="task-item" v-for="(item, index) in currentTaskList" :key="index">
              <div class="task-name overflow">{{index+1}}.{{item.task_name}}</div>
              <div class="view-detail-btn" @click="viewDetail(item.id)">查看详情</div>
            </li>
          </ul>
        </div>
        <div v-else class="empty-tip">
          当前{{taskTypeName}}无消息任务，点击去发送跳转到下一{{taskTypeName}}！
        </div>
      </scope-panel>

      <scope-panel :title="'其他待发送消息'+taskTypeName+'（'+otherTaskList.length+'个）'" style="margin-top: 0.5rem">
        <div class="task-message">点击最下方去发送，跳转到下一个{{taskTypeName}}聊天窗！</div>
        <ul class="customer-list" v-if="otherTaskList.length > 0">
          <li class="customer-box" v-for="(item, index) in otherTaskList" :key="index">
            <template v-if="taskType == 4">
              <img class="avatar" :src="item.group_chat_avatar" alt="" />
              <div style="margin-left: 0.5rem">
                <div class="nickname overflow">{{item.group_name}}</div>
                <div class="message">{{item.task_total}}条待发消息</div>
              </div>
            </template>

            <template v-else>
              <img class="avatar" :src="item.avatar" alt="" />
              <div style="margin-left: 0.5rem">
                <div class="nickname overflow">{{item.name}}</div>
                <div class="message">{{item.task_total}}条待发消息</div>
              </div>
            </template>
          </li>
        </ul>
        <van-empty v-else :description="'暂无待发'+taskTypeName"></van-empty>

        <div style="text-align: center;">
          <div class="push-btn" v-if="currentTaskList.length > 0" @click="viewDetail(false)">去发送</div>
          <div v-else
            :class="['push-btn', {'gray':otherTaskList.length <= 0}]" @click="toNextChat"
          >下一个{{taskTypeName}}</div>
          <div class="tip">点击去发送后，进入到任务详情！</div>
        </div>

      </scope-panel>
    </div>
  </div>
</template>

<script>
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权

import scopePanel from "../components/scopePanel";
export default {
  mixins: [appAgentConfig],
  data () {
    return {
      tabs: [{name: "客户消息任务", type: 1}, {name: "群聊消息任务", type: 4}],
      taskType: 1,
      taskTypeName: "客户",
      chatId: "",
      userId: "",
      taskTime: "",
      taskCount: 0,
      currentTaskList: [],
      otherTaskList: [],
    };
  },
  created () {
    let that = this;
    // 设置调用AgentConfig之后需要调用接口 appjsApiList
    this.appjsApiList = ["getCurExternalContact", "getCurExternalChat", "sendChatMessage", "openEnterpriseChat"];
    // AgentConfig 之后的回调函数，回调函数会在activated生命周期中调用
    this.appSignCallback = () => {
      that.entryHandler();
    };
  },

  // activated () {
  //   // 测试用例 start
  //   this.chatId = "wrDesSDgAA6xcEWUBT6TDrFGZRFQjRJg";
  //   this.userId = "wmDesSDgAAnVOxcNIw8XQ6x1qhN5ZidA";
  //   this.getCustomerTask();
  //   // 测试用例 end
  // },

  methods: {
    /* 入口程序，在侧边栏应用获取不到任务类型，通过获取外部联系人userId 或者 会话群 chatId来判断当前打开的任务类型 */
    entryHandler () {
      let that = this;
      /* getCurExternalChat 获取当前客户群的群ID */
      wx.invoke('getCurExternalChat', {}, res => {
        if(res.err_msg == "getCurExternalChat:ok"){
          that.chatId = res.chatId;
          that.setTaskType(4);
          that.getCustomerTask();
        }
      });
      /* getCurExternalContact 获取当前外部联系人userid */
      wx.invoke('getCurExternalContact', {}, res => {
        if(res.err_msg == "getCurExternalContact:ok"){
          that.userId  = res.userId ;
          that.setTaskType(1);
          that.getCustomerTask();
        }
      });
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

    changeTab (index) {
      this.setTaskType(index);
      this.getCustomerTask();
    },

    getCustomerTask () {
      let requestJson = {};
      requestJson.task_type = this.taskType;
      if (this.taskType == 4) {
        requestJson.chat_id = this.chatId;
      } else {
        requestJson.external_userid = this.userId;
      }
      $http.post("plugin.sop-task.frontend.controller.task.task.getTask", requestJson,"loading")
        .then(({result, msg, data}) => {
          if (result !== 1) {
            return this.$toast(msg);
          }
          if (this.taskType == 4) {
            this.currentTaskList = data.group_current??[];
            this.otherTaskList = data.group_othor??[];
            this.otherTaskList.forEach(item => {item.avatar = data.group_chat_avatar;});
          } else if ([1,2,3].includes(this.taskType)){
            this.currentTaskList = data.current??[];
            this.otherTaskList = data.othor??[];
          }
          this.taskTime = data.date;
          this.taskCount = data.task_count;
          if (this.currentTaskList && this.currentTaskList.length > 0) {
            this.task_log_id = this.currentTaskList[0].id;
          }
        });
    },

    // 跳转到下一个联系人会话窗口
    toNextChat () {
      if (this.otherTaskList && this.otherTaskList.length <=0) {
        return this.$dialog.confirm({
          title: '提示',
          message: `暂无待发消息${this.taskTypeName}!`,
        });
      }
      if (!this.isSignWorkApp) {
        return this.$dialog.confirm({
          title: '提示',
          message: '企业应用未授权!',
        });
      }
      // 调用openEnterpriseChat api文档：https://developer.work.weixin.qq.com/document/path/92525
      let json = {};
      if (this.taskType === 4) {
        let chat_id = this.otherTaskList[0].chat_id;
        json.chatId = chat_id;
      } else if ([1,2,3].includes(this.taskType)){
        let user_id = this.otherTaskList[0].userid;
        json.externalUserIds = user_id;
      }
      wx.openEnterpriseChat({
        ...json,
        success: function(res) {
        },
        fail: function(res) {
          console.log("openEnterpriseChat::错误", res);
          if(res.errMsg.indexOf('function not exist') > -1){
            alert('版本过低请升级');
          }
        }
      });
    },

    // 任务详情
    viewDetail (log_id) {
      log_id = log_id?log_id:this.task_log_id;
      this.$router.push(this.fun.getUrl("sopTaskDetail",{taskLog: log_id}));
    },
  },

  components: {
    scopePanel
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.sop-task-list {
  .content {
    text-align: left;
    padding: 0.63rem;
    background-color: #f6f6f6;
    .tab-bar {
      display: flex;
      cursor: default;
      .tab {
        color: #A7A6A6;
        padding: 0 0.5rem;
        border-right: 2px solid #A7A6A6;
      }
      .active-tab {
        color: #f05152;
      }
      .tab:last-of-type {
        border-right: none;
      }
    }

    .task-message, .empty-tip{
      font-size: 12px;
      color: #727272;
      margin-top: 0.63rem;
    }

    .empty-tip {
      padding-left: 0.8rem;
    }

    .task-list {
      margin-top: 1rem;
      color: #333333;
      font-size: 14px;
      .task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.8rem;
      }
      .task-name {
        flex: 1;
        width: 0;
      }
      .view-detail-btn {
          padding: 0.2rem 0.7rem;
          color: #f05152;
          text-align: center;
          border-radius: 1rem;
          font-size: 12px;
          border: solid 1px #f05152;
          cursor: pointer;
      }
    }

    .customer-list {
      margin-top: 0.5rem;
      .customer-box{
        display: flex;
        align-items: center;
        margin-top: 0.8rem;
        .avatar {
          width: 2.38rem;
          height: 2.38rem;
          margin: 0;
          border-radius: 50%;
        }
        .nickname {
          max-width: 12rem;
        }
        .message {
          font-size: 12px;
          color: #666666;
        }
      }
    }

    .push-btn {
      display: inline-block;
      margin-top: 1.5rem;
      color: #fff;
      padding: 0.3rem 3rem;
      font-size: 14px;
      background-color: #f05152;
      border-radius: 1rem;
      cursor: pointer;
    }
    .gray {
      background-color: #a7a6a6;
    }
    .tip {
      margin-top: 0.5rem;
      font-size: 12px;
      color: #727272;
    }
  }
}
</style>