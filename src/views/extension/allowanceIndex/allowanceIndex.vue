<template>
  <div id="allowanceIndex">
    <c-title class="circle_title" :hide="false" text="代理商奖励"></c-title>
    <div class="nav">
      <div class="img">
        <img :src="avatarInfo.avatar" alt="" />
      </div>
      <div class="user">
        <div class="isname">{{ avatarInfo.nickname }}</div>
        <div class="leave">{{ avatarInfo.level_name }}</div>
      </div>
    </div>
    <div class="centenbox">
      <div class="Totalawards">
        <div class="Totalawards_top">
          <div class="Totalawards_top_left">奖励总额</div>
          <div class="Totalawards_top_right">￥{{ avatarInfo.total }}</div>
        </div>
        <div class="Totalawards_bottom">
          <div class="Totalawards_bottom_box" @click="toUrl(0)">
            <div class="Totalawards_bottom_box_top">{{ avatarInfo.order_award }}</div>
            <div class="Totalawards_bottom_box_bottom">极差奖励</div>
          </div>
          <div class="Totalawards_bottom_box" @click="toUrl(1)">
            <div class="Totalawards_bottom_box_top">{{ avatarInfo.level_award }}</div>
            <div class="Totalawards_bottom_box_bottom">层级奖励</div>
          </div>
          <div class="Totalawards_bottom_box" @click="toUrl(2)">
            <div class="Totalawards_bottom_box_top">{{ avatarInfo.subsidy_award }}</div>
            <div class="Totalawards_bottom_box_bottom">补贴奖励</div>
          </div>
          <div class="Totalawards_bottom_box" @click="toUrl(3)">
            <div class="Totalawards_bottom_box_top">{{ avatarInfo.performance_award }}</div>
            <div class="Totalawards_bottom_box_bottom">业绩奖励</div>
          </div>
        </div>
      </div>
    </div>
    <div class="linebox" @click="goteam">
      <div class="linebox_txt">团队业绩</div>
      <i class="iconfont icon-advertise-next"></i>
    </div>
    <div class="listbox">
      <van-tabs v-model="active">
        <van-tab title="奖励记录"></van-tab>
      </van-tabs>
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="list_left">
          <div class="order">订单号：{{ item.order_sn }}</div>
          <div class="date">{{ item.created_at }}</div>
        </div>
        <div class="list_right">
          <div class="recode">+{{ item.award_amounts }}</div>
          <div class="txt">{{ item.type_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      avatarInfo: {},
      list: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    goteam() {
      this.$router.push(this.fun.getUrl("allowanceAchievement", {}));
    },
    toUrl(e) {
      let ind = e;
      this.$router.push(this.fun.getUrl("allowanceReward", { ind }));
    },
    getData() {
      $http.post("plugin.agency-subsidy.frontend.controllers.center.index", { page: this.page }, "加载中...").then(res => {
        if (res.result == 1) {
          this.avatarInfo = res.data.info;
          this.list = res.data.list.data;
          this.isLoadMore = true;
          this.total_page = res.data.list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        } else {
          Toast(res.msg);
        }
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get("plugin.agency-subsidy.frontend.controllers.center.index", json , "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
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
<style lang="scss" rel="stylesheet/scss" scoped>
.nav {
  width: 100%;
  height: 7.19rem;
  background-color: #ee2e2b;
  display: flex;
  align-items: flex-start;
  padding-left: 1.53rem;
  padding-top: 1.69rem;
  .user {
    flex: 1;
    height: 2.88rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
    .leave {
      font-size: 0.75rem;
      color: #ffffff;
      background: #f36b69;
      border-radius: 0.63rem;
      padding: 0.11rem 0.5rem;
    }
    .isname {
      font-size: 1rem;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      text-align: left;
    }
  }
  .img {
    width: 2.88rem;
    height: 2.88rem;
    background-color: #000000;
    border-radius: 100%;
    margin-right: 0.69rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }
}
.listbox {
  background: #ffffff;
  width: 100%;
  .list {
    margin: 0 0.97rem 0 0.91rem;
    height: 3.41rem;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .list_left {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 0.75rem;
      height: 100%;
      justify-content: space-around;
      overflow: hidden;
      .order {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .date {
        text-align: left;
        font-size: 0.69rem;
        color: #666666;
      }
    }
    .list_right {
      flex: 0.6;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-around;
      overflow: hidden;
      .recode {
        text-align: right;
        font-size: 0.81rem;
        color: #f15353;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .txt {
        text-align: right;
        font-size: 0.69rem;
        color: #666666;
      }
    }
  }
}
.linebox {
  height: 2.66rem;
  width: 100%;
  background: #ffffff;
  padding: 0 0.97rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.63rem;
  .linebox_txt {
    font-size: 0.88rem;
  }
  .iconfont {
    font-size: 20px;
  }
}
.centenbox {
  margin: 0 0.63rem;
  margin-top: -1.31rem;

  .Totalawards {
    width: 100%;
    height: 7.19rem;
    background-color: #ffffff;
    border-radius: 0.31rem;
    padding: 0 0.91rem;
    margin-bottom: 0.63rem;
    .Totalawards_bottom {
      width: 100%;
      height: 4.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .Totalawards_bottom_box {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .Totalawards_bottom_box_top {
          font-size: 0.81rem;
          color: #f15353;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .Totalawards_bottom_box_bottom {
          font-size: 0.69rem;
          color: #666666;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .Totalawards_top {
      height: 2.66rem;
      width: 100%;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .Totalawards_top_left {
        font-size: 0.81rem;
        color: #393939;
      }
      .Totalawards_top_right {
        font-size: 0.81rem;
        color: #f15353;
      }
    }
  }
}
</style>