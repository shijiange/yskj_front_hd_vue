<template>
  <div>
    <d-title>历史成团记录</d-title>
    <d-list @load="getDetails" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
      <div class="group_list">
        <div class="group_item" v-for="item in groupList" :key="item">
          <p class="group_id">团ID：{{item.id}}</p>
          <p class="time">{{item.updated_at}}</p>
          <div class="user_logo_list">
            <div class="user_logo_item" v-for="user in item.has_many_team_member.slice(0,3)" :key="user">
              <img class="logo" :src="user.avatar || emptyImage" alt="">
              <span class="tag" v-if="user.is_win == 1">{{user.lottery_name}}</span>
            </div>
            <div class="user_logo_item"  @click="openMore(item)" v-if="item.has_many_team_member && item.has_many_team_member.length > 3">
              <p class="more">...</p>
            </div>
          </div>
          <div class="other_logo" v-if="item.has_many_team_member && item.has_many_team_member.length > 3">
            <div class="other_item" v-for="logo in item.has_many_team_member.slice(3,13)" :key="logo">
              <img class="small_logo" :src="logo.avatar || emptyImage" alt="">
            </div>
          </div>
        </div>
      </div>
    </d-list>
    <van-popup v-model="showGroup" round  closeable position="center" style="width: 80%;">
      <div class="pop-content">
        <p class="title">全部名单</p>
        <div class="user_logo_list">
          <div class="user_logo_item" v-for="user in showGroupMember" :key="user">
            <img class="logo" :src="user.avatar || emptyImage" alt="">
            <span class="tag" v-if="user.is_win == 1">{{user.lottery_name}}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import DTitle from "@/components/other/common/dtitle";
import DList from "@/components/dlist";
import emptyImage from "@/assets/images/new_diy/image.png";
export default {
  data() {
    return {
      emptyImage,
      showGroup: false,
      // showGroupId: "",
      showGroupMember: [],

      groupList: [],
      loading: false,
      page: 1,
      isLoadMore: true
    };
  },
  activated() {
    this.init();
    this.getDetails();
  },
  methods: {
    init() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.groupList = [];
    },
    openMore(item) {
      // this.showGroupId = item.id;
      this.showGroupMember = item.has_many_team_member;
      this.showGroup = true;
    },
    getDetails() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }
      this.loading = true;
      $http.get("plugin.fight-groups-lottery.frontend.fight-groups-lottery.get-team-list", {
        group_id: this.$route.query.group_id,
        page: this.page
      }, "").then(res => {
        if (res.result === 1) {
          this.page++;
          if (res.data.current_page === res.data.last_page || res.data.data.length === 0 || res.data.data.length < res.data.per_page) {
            this.isLoadMore = false;
          }
          if (res.data.data && res.data.data.length > 0) {
            this.groupList = this.groupList.concat(res.data.data);
          }
          this.loading = false;
        } else {
          console.log(res.msg);
        }
      }).catch(error => {
        console.error(error);
      });
    },
  },
  components: {
    DTitle,
    DList
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .group_list {
    padding: 10px;

    .group_item {
      background: #fff;
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 10px;
    }

    .group_id {
      font-size: 18px;
      font-weight: bold;
      color: #f49c40;
      margin-bottom: 10px;
    }

    .time {
      font-size: 12px;
      color: #999;
      margin-bottom: 10px;
    }

    .more {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #f6f6f6;
      font-size: 40px;
      line-height: 25px;
      color: #9e9e9e;
    }

    .other_logo {
      border-top: 1px solid #f2f2f2;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      padding: 10px;
    }

    .other_item:first-child {
      margin: 0;
    }

    .other_item {
      width: 1.75rem;
      height: 1.75rem;
      display: inline-block;
      margin-left: -0.5rem;
      float: left;
      background: #666;
      border-radius: 50%;

      .small_logo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .user_logo_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .user_logo_item {
      position: relative;
      margin-right: 15px;
    }

    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: solid 2px #f49c40;
    }

    .tag {
      position: absolute;
      left: 5px;
      bottom: 0;
      width: 40px;
      color: #fff;
      background-color: #f49c40;
      border-radius: 8px;
      font-size: 12px;
    }
  }

  .pop-content {
    height: 20rem;
    padding: 20px;
    overflow-y: scroll;

    .title {
      font-size: 18px;
      color: #202020;
      margin-bottom: 15px;
    }

    .user_logo_list {
      justify-content: flex-start;
    }

    .user_logo_item {
      margin: 6px;
    }
  }
</style>