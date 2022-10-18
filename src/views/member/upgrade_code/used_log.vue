<template>
  <div>
    <c-title text="升级码使用记录"></c-title>
    <d-list
      class="used-log-list"
      :loading="usedLogLoading"
      :finished="usedLogFinished"
      @load="loadUsedLog"
    >
      <ul class="used-log">
        <li class="used-log-item" v-for="logItem in usedLog" :key="logItem.id">
          <img :src="logItem.use_member.avatar_image" class="used-member-avatar" />
          <div class="used-member-info">
            <p class="used-member-nickname">{{ logItem.use_member.nickname }}</p>
            <p class="used-member-id">ID:{{ logItem.use_member.uid }}</p>
          </div>
          <div class="used-log-date">{{ logItem.updated_at }}</div>
        </li>
      </ul>
    </d-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import DList from "@/components/dlist";
export default {
  activated() {
    if (!this.$route.query.codes_id) {
      Toast.fail("升级码不存在");
      this.$router.go(-1);
      return;
    }
    this.codesId = this.$route.query.codes_id;
    this.loadUsedLog();
  },
  data() {
    return {
      codesId: null,
      usedLog: [],
      usedLogPage: 1,
      usedLogLoading: false,
      usedLogFinished: false
    };
  },
  methods: {
    loadUsedLog() {
      if (this.usedLogLoading === true || this.usedLogFinished === true) {
        return;
      }
      this.usedLogLoading = true;
      $http
        .post("plugin.upgrade-code.Frontend.controllers.code.logs", {
          id: this.codesId,
          page: this.usedLogPage
        })
        .then(({ data: logData, msg, result }) => {
          if (result === 0) {
            Toast.fail(msg);
            this.$router.go(-1);
            return;
          }
          if (logData.current_page == logData.last_page || logData.data.length < logData.per_page) {
            this.usedLogFinished = true;
          }
          this.usedLogPage++;
          this.usedLog.push(...logData.data);
          this.usedLogLoading = false;
        });
    }
  },
  components: {
    DList
  }
};
</script>

<style scoped>


.used-log {
  padding: 0.91rem 0.91rem;
  text-align: left;
}

.used-log-item {
  display: flex;
  align-items: center;
  padding: 0.91rem 0.66rem;
  margin-bottom: 0.63rem;
  background: white;
  border-radius: 0.31rem;
}

.used-member-avatar {
  flex-shrink: 0;
  width: 1.88rem;
  height: 1.88rem;
  border-radius: 50%;
}

.used-member-info {
  flex-grow: 1;
  margin-left: 0.47rem;
  font-size: 1rem;
  color: #333;
}

.used-member-nickname {
  width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.used-member-id {
  color: #ee2e2b;
  font-size: 0.75rem;
}

.used-log-date {
  font-size: 0.69rem;
  color: #666;
}
</style>