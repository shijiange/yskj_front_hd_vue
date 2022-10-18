<template>
  <div id="member-management">
    <c-title :hide="false" text="会员管理"></c-title>
    <van-search
      class="head-search"
      v-model="keyword"
      shape="round"
      placeholder="搜索会员"
      @search="onSearch"
    />
    <van-list
      class="list"
      v-model="loading"
      :offset="10"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="getData"
    >
      <div class="item"  v-for="item in memberList" :key="item" :title="item" @click="toMemberInfo(item.uid)">
        <div class="avatar">
          <img :src="item.avatar?item.avatar:require('../../assets/images/photo-mr.jpg')" alt="">
        </div>
        <div class="info">
          <div class="top">
            <span class="name">{{item.nickname}}</span>
            <span class="id">id{{item.uid}}</span>
            <span class="level-name" v-if="item.yz_member && item.yz_member.level">{{item.yz_member.level.level_name}}</span>
          </div>
          <div class="bottom">
            <span class="integral">积分：{{item.credit1}}</span>
            <span class="balance">余额：{{item.credit2}}</span>
          </div>
        </div>
      </div>
    </van-list>
    <yz-blank :datas="memberList" text="空空如也"></yz-blank>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      keyword: '',
      page: 1,
      loading: false,
      finished: false,
      memberList: [],
    };
  },
  activated() {
    this.initData();
    this.getData();
  },

  methods: {
    getData () {
      if ( this.finished) return false;
      let search = {keyword: this.keyword};
      $http.post("plugin.shop-assistant.frontend.member.member-list", {page: this.page, search}, "loading")
        .then((response) => {
          this.loading = false;
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          let list = response.data;
          this.memberList = list.current_page > 1 ? this.memberList.concat(list.data) : list.data;
          if (list.current_page >= list.last_page && list.data.length < list.per_page) this.finished = true;
          this.page++;
        }).catch(() => {
          this.loading = true;
        });
    },
    onSearch () {
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.getData();
    },
    toMemberInfo (id) {
      this.$router.push(this.fun.getUrl('storeMemberInfo', {id}));
    },
    initData () {
      this.keyword = '';
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.memberList = [];
    },
  },

  components: {
    yzBlank
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#member-management{
  /deep/ .head-search {
    .van-search__content {
      background-color: #eff0f1;
    }
  }
  .list {
    padding: 0 0.625rem;
    .item {
      display: flex;
      align-items: center;
      margin-top: 0.625rem;
      padding: 0.75rem 0.9rem;
      background-color: #ffffff;
      border-radius: 0.313rem;
      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        margin-left: 0.625rem;
        flex: 1;
        text-align: left;
        overflow: hidden;
        .top {
          display: flex;
          white-space: nowrap;
          font-size: 0.875rem;
          line-height: 1.125rem;
          color: #242424;
          .name {
            max-width: 10rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .id {
            margin-left: 0.625rem;
            padding: 0.1rem 0.5rem;
            font-size: 0.625rem;
            color: #ffffff;
            background-color: #f15353;
            border-radius: 0.125rem;
          }
          .level-name {
            font-size: 0.625rem;
            margin-left: 0.625rem;
            padding: 0.1rem 0.5rem;
            background-color: #ffd150;
            border-radius: 0.125rem;
          }
        }
        .bottom {
          margin-top: 0.5rem;
          color: #807e7e;
          font-size: 0.688rem;
          text-align: left;
          .integral {

          }
          .balance {
            margin-left: 1rem;
          }
        }
      }
    }
  }
}
</style>
