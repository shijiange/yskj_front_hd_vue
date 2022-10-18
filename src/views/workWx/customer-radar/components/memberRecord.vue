<template>
  <div class="member-visit-record">
    <h1 class="block-title">访问会员</h1>
    <div class="record-list">
      <div class="record-item" v-for="(item, index) in memberList" :key="index">
        <img class="avatar" :src="item.avatar" alt="">
        <div class="member-info">
          <div style="display: flex">
            <span class="member-nickname van-ellipsis">{{item.nickname}}</span>
            <span class="member-id">ID：{{item.id}}</span>
          </div>
          <p class="visit-num">访问次数：{{item.total}}</p>
          <p class="view-record" @click="toRecordDetail(item.id)">查看访问记录</p>
        </div>
        <div class="open-chat-btn" @click="openEnterpriseChat(item.external_userid)">发起会话</div>
      </div>
    </div>
  </div>
</template>

<script>
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权
export default {
  mixins: [appAgentConfig],
  props: {
    memberList: {
      type: Array,
      default: () => []
    },
    currentTime: {
      type: Date
    }
  },
  data () {
    return {
    };
  },

  created () {
    this.appjsApiList = ["openEnterpriseChat"];
  },

  methods: {
    toRecordDetail (id) {
      this.$router.push(this.fun.getUrl("memberRecordDetail", {id}, {time: this.currentTime.getTime()}));
    },
    // 打开会话窗口
    openEnterpriseChat (user_id) {
      if (!this.isSignWorkApp) {
        return this.$dialog.confirm({
          title: '提示',
          message: '企业应用未授权!',
        });
      }
      wx.openEnterpriseChat({
        externalUserIds: user_id, // 参与会话的外部联系人列表
        success: function(res) {
        },
        fail: function(res) {
          if(res.errMsg.indexOf('function not exist') > -1){
            alert('版本过低请升级');
          }
        }
      });
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.member-visit-record {
  padding: 5%;
  .block-title {
    color: #202020;
    text-align: left;
    font-weight: bold;
    font-size: 18px;
  }
  .record-list {
    margin-top: 1rem;
    .record-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
      .avatar {
        width: 2.688rem;
        height: 2.688rem;
        border-radius: 50%;
      }
      .member-info {
        flex: 1;
        margin-left: 0.5rem;
        text-align: left;
        .member-nickname {
          max-width: 7rem;
          font-size: 0.813rem;
          color: #222222;
        }
        .visit-num, .member-id{
          margin-left: 0.5rem;
          font-size: 0.688rem;
          color: #666666;
        }
        .visit-num {
          margin: 0.5rem 0;
        }
        .view-record {
          font-size: 0.688rem;
          color: #0b8dfe;
        }
      }
      .open-chat-btn {
        padding: 0.5rem 0.9rem;
        font-size: 0.688rem;
        color: #ffffff;
        background-color: #0b8dfe;
        border-radius: 1rem;
        cursor: default;
      }
    }
  }
}
</style>