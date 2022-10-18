<template>
  <div>
    <c-title :hide="false" :text="'赠送历史记录'"> </c-title>
    <d-list
      @load="getData"
      :finished="loadFinished"
      :loading="isLoadMore"
      :showStatusText="false"
    >
      <div class="list" v-if="historyList.length > 0">
        <div class="item-box" v-for="item in historyList" :key="item.id">
          <div class="left-box">
            <div class="user-info">
              <span>{{item.mark}}：</span>
              <div style="display: inline-block;">
                <img :src="item.mark_member.avatar" alt="" class="avatar" />
                <span class="name">{{item.mark_member.nickname}}</span>
              </div>
            </div>
            <div class="time">{{item.created_at}}</div>
          </div>
          <div class="right-box">
            <span class="value">{{item.amount}}</span>
            <span class="type">{{item.change_name}}</span>
          </div>
        </div>
      </div>

      <div class="blank" v-else>
        <img src="../../../assets/images/blank.png" />
        <span>还没有记录哦</span>
      </div>
    </d-list>


  </div>
</template>

<script>
import cTitle from "components/title";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      page: 1,
      loadFinished: false,
      isLoadMore: false,
      historyList: []
    };
  },
  activated () {
    this.init();
    this.getData();
  },
  methods: {
    async getData() {
      if (this.isLoadMore === true) return;
      this.isLoadMore = true;
      let res = await $http.post(
        "plugin.credit-inventory.frontend.controllers.give.index",
        {
          page: this.page,
        },
        "加载中"
      );
      if (res.result === 0) {
        Toast(res.msg);
        return;
      }
      this.page++;
      this.isLoadMore = true;
      if (res.data.last_page === res.data.current_page || res.data.data.length < res.data.per_page) {
        this.loadFinished = true;
      }
      if (res.data.current_page > 1) {
        this.historyList = this.historyList.concat(res.data.data);
        return;
      }
      this.historyList = res.data.data;
    },

    init() {
      this.page = 1;
      this.loadFinished = false;
      this.isLoadMore = false;
      this.historyList = [];
    }
  },
  components: {
    cTitle,
    DList,
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.item-box {
  display: flex;
  width: 22rem;
  height: 5rem;
  margin: 0 auto;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  font-size: 15px;
  font-weight: 500;

  .left-box {
    flex: 1;
    display: flex;
    text-align: left;
    flex-direction: column;
    justify-content: space-between;
  }

  .right-box {
    display: flex;
    text-align: right;
    flex-direction: column;
    justify-content: space-between;
  }

  .avatar {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    margin-left: 5px;
  }

  .time {
    font-size: 12px;
    color: #969696;
  }

  .type {
    color: #333;
  }

  .value {
    color: #f14e4e;
  }
}
</style>
