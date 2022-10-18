<template>
  <div>
    <c-title :hide="false" text='访问记录'></c-title>
    <div class="member-record-detail" v-if="memberInfo">
      <div class="plane-block">
        <div class="member-detail">
          <img class="avatar" :src="memberInfo.avatar" alt="">
          <div class="member-info">
            <p class="member-nickname van-ellipsis">{{memberInfo.nickname}}</p>
            <p class="member-id">ID：{{memberInfo.id}}</p>
          </div>
          <div class="open-chat-btn" @click="openEnterpriseChat(memberInfo.external_userid)">发起会话</div>
        </div>
      </div>

      <div class="record-block" v-for="(item, index) in logList" :key="index">
        <cell-item title="访问时间：">
          <span>{{ item.date }}</span>
        </cell-item>
        <cell-item title="页面类型：">
          <span>{{ item.page_type }}</span>
        </cell-item>
        <cell-item title="页面标题：">
          <span>{{ item.title }}</span>
        </cell-item>
        <cell-item title="页面URL：">
          <span class="page-link">{{ item.url }}</span>
        </cell-item>
        <cell-item title="访问端口：">
          <span>{{ item.port_type }}</span>
        </cell-item>
        <cell-item title="访问次数：">
          <span>当天第 <span class="visit-num">{{ item.count }}</span> 次访问</span>
        </cell-item>
      </div>
      <yz-blank :datas="logList" text="空空如也"></yz-blank>
    </div>
  </div>
</template>

<script>
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权

import cellItem from "./components/cellItem.vue";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [appAgentConfig],
  data () {
    return {
      id: '',
      memberInfo: null,
      logList: null,
    };
  },

  created () {
    this.appjsApiList = ["openEnterpriseChat"];
  },

  activated () {
    this.id = this.$route.params.id;
    this.time = this.$route.query.time * 1;
    this.getData();
  },

  methods: {
    getData () {
      $http.post("plugin.customer-radar.frontend.controller.member.browse-statistics.getStatisticsByMember",
        {
          member_id: this.id,
          date: (new Date(this.time))
        }
      )
        .then((res) => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.memberInfo = res.data.member_info;
          this.logList = res.data.log_list;
        });
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

  components: { cellItem, yzBlank },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.member-record-detail {
  padding: 0.625rem 0.85rem;
  .plane-block {
    margin: 0.63rem 0;
    padding: 0.875rem;
    border-radius: 0.53rem;
    background-color: #ffffff;
    .member-detail {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
          max-width: 10rem;
          height: 2rem;
          font-size: 0.813rem;
          color: #222222;
        }
        .member-id{
          font-size: 0.688rem;
          color: #666666;
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
  .record-block {
    margin: 0.63rem 0;
    padding: 0.4rem 0.875rem;
    border-radius: 0.53rem;
    background-color: #ffffff;
    .page-link {
      color: #0b8dfe;
    }
    .visit-num {
      color: #ec0f0f;
    }
  }
}

</style>