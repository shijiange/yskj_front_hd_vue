<template>
  <div id="bonusPoolsTeam">
    <c-title :hide="false" text="团队业绩值"></c-title>
    <van-tabs v-model="active" @change="bindChange">
      <van-tab :title="`一级(${info.one || 0})`"></van-tab>
      <van-tab :title="`二级(${info.two || 0})`"></van-tab>
    </van-tabs>
    <div class="list">
      <div class="lis" v-for="item in list" :key="item.id">
        <div class="left">
          <div class="image" v-if="item.belongs_to_member">
            <img :src="item.belongs_to_member.avatar" alt="" />
          </div>
          <div class="user">
            <div class="name" v-if="item.belongs_to_member">{{ item.belongs_to_member.nickname }}</div>
            <div class="grand" v-if="item.belongs_to_agency && item.belongs_to_agency.has_one_level">{{ item.belongs_to_agency.has_one_level.level_name }}</div>
          </div>
        </div>
        <div class="right">
          <span>累计业绩金额：{{ $i18n.t("money") }}{{ item.team_total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      info: {},
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
  },
  methods: {
    initData(){
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.getData();
    },
    bindChange() {
      this.initData();
    },
    getData() {
      let json = {
        page: this.page,
        team_type: this.active == 0 ? "1" : "2"
      };
      $http.post("plugin.xzhh-bonus-pool.frontend.controllers.team.index", json, "加载中...").then(res => {
        if (res.result == 1) {
          this.info = res.data.nums;
          this.isLoadMore = true;
          this.total_page = res.data.list.last_page;
          this.list = res.data.list.data;
          if (!this.total_page) {
            this.total_page = 0;
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
          team_type: this.active == 0 ? "1" : "2"
        };
        $http.get("plugin.xzhh-bonus-pool.frontend.controllers.team.index", json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              this.list = this.list.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function (response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#bonusPoolsTeam {
  min-height: 100vh;
}
.list {
  margin-top: 0.63rem;
  .lis {
    padding: 0.8rem 0.97rem;
    background: #fff;
    margin-bottom: 0.63rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
      span {
        text-align: right;
        color: #7b7b7b;
      }
    }
    .left {
      width: 50%;
      display: flex;
      .user {
        flex: 1;
        height: 2.88rem;
        margin-left: 0.6rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name {
          font-size: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          text-align: left;
        }
        .grand {
          font-size: 0.75rem;
          color: #7b7b7b;
        }
      }
      .image {
        width: 2.88rem;
        height: 2.88rem;
        border-radius: 100%;
        background: #ebebeb;
        img {
          width: 2.88rem;
          height: 2.88rem;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>