<template>
  <div id="bonusPoolsIndex">
    <c-title :hide="false" text="奖金池奖励"></c-title>
    <div class="headTop">
      <div class="userBox">
        <div class="image">
          <img :src="info.avatar" alt="" />
        </div>
        <div class="nameGrade">
          <span class="name">{{ info.nickname }}</span>
          <div class="grade" v-if="info.level_name">{{ info.level_name }}</div>
        </div>
      </div>
      <div class="tips">提示：所有奖励不包含特殊商品营业额</div>
    </div>
    <div class="grandTotal">
      <div class="grand">
        <span>累计奖励</span>
        <span>{{ $i18n.t("money") }}{{ info.all_amount }}</span>
      </div>
      <div class="grandList">
        <div class="gramdlis">
          <span class="price"
            ><span class="smallp">{{ $i18n.t("money") }}</span
            >{{ info.ad_amount }}</span
          >
          <span class="txt">广告屏收益</span>
        </div>
        <div class="gramdlis">
          <span class="price"
            ><span class="smallp">{{ $i18n.t("money") }}</span
            >{{ info.bonus_amount }}</span
          >
          <span class="txt">{{love}}奖励</span>
        </div>
        <div class="gramdlis">
          <span class="price"
            ><span class="smallp">{{ $i18n.t("money") }}</span
            >{{ info.team_amount }}</span
          >
          <span class="txt">团队业绩奖励</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="tramTotal" @click="toTeam">
      <span class="txt">团队累计业绩值</span>
      <span class="price">
        <span>{{ $i18n.t("money") }}{{ info.team }}</span>
        <van-icon name="arrow" color="#000" size="1rem" />
      </span>
    </div>
    <div class="line"></div>
    <van-tabs v-model="active" title-active-color="#ee2e2b" swipe-threshold="3" @change="bindChange">
      <van-tab title="全部"></van-tab>
      <van-tab title="广告屏收益"></van-tab>
      <van-tab :title="`${love}奖励`"></van-tab>
      <van-tab title="团队业绩奖励"></van-tab>
    </van-tabs>
    <div class="list">
      <div class="statusBox">
        <div class="dNone" :class="{ sele: tapSelect == 0 }" @click="tapSelectInd(0)">全部</div>
        <div class="dNone" :class="{ sele: tapSelect == 1 }" @click="tapSelectInd(1)">已结算</div>
        <div class="dNone" :class="{ sele: tapSelect == 2 }" @click="tapSelectInd(2)">未结算</div>
      </div>
      <div class="lis" v-for="item in list" :key="item.id">
        <div class="toplis">
          <div class="idClis">
            <div>ID：{{ item.id }}</div>
            <div class="title">{{ item.type_name }}</div>
          </div>
          <div class="price">+{{ item.award_amounts }}</div>
        </div>
        <div class="bottomlis">
          <div class="time">时间：{{ item.created_at }}</div>
          <div class="txt">{{ item.status_name }}</div>
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
      tapSelect: 0,
      info: {},
      list: [],
      love:'',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  mounted() {
    // this.getData();
    this.love = localStorage.getItem("yz_basic_info")?JSON.parse(localStorage.getItem("yz_basic_info")).love:'爱心值';
  },
  methods: {
    getData() {
      let json = {
        page: this.page,
        award_type: this.active,
        award_status: this.tapSelect == 2 ? "-1" : this.tapSelect == 0 ? "0" : "1"
      };
      $http.post("plugin.xzhh-bonus-pool.frontend.controllers.center.index", json, "加载中...").then(res => {
        if (res.result == 1) {
          this.info = res.data.info;
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
          award_type: this.active,
          award_status: this.tapSelect == 2 ? "-1" : this.tapSelect == 0 ? "0" : "1"
        };
        $http.get("plugin.xzhh-bonus-pool.frontend.controllers.center.index", json, "加载中").then(
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
    },
    toTeam() {
      this.$router.push(this.fun.getUrl("bonusPoolsTeam", {}));
    },
    tapSelectInd(key) {
      this.tapSelect = key;
      this.page = 1;
      this.total_page = 1;
      this.getData();
    },
    bindChange() {
      this.tapSelect == 0;
      this.page = 1;
      this.total_page = 1;
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
#bonusPoolsIndex {
  min-height: 100vh;
  background: #fff;
  .list {
    border-top: 0.06rem solid #ebebeb;
    .statusBox {
      display: flex;
      align-items: center;
      margin: 0.625rem 0.97rem;
      .dNone {
        padding: 0.52rem;
        margin-right: 0.9rem;
      }
      .sele {
        background: #ef4136;
        border-radius: 0.35rem;
        color: #fff;
      }
    }
    .lis {
      padding: 1.09rem 0;
      margin: 0 0.97rem;
      display: flex;
      align-items: center;
      border-bottom: 0.06rem solid #ebebeb;
      flex-direction: column;
      .bottomlis {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #666666;
        margin-top: 0.6rem;
        .time {
          text-align: left;
        }
        .txt {
          text-align: right;
        }
      }
      .toplis {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 0.94rem;
        .idClis {
          flex: 1;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .title {
            margin-top: 0.25rem;
            font-size: 13px;
          }
        }
        .price {
          text-align: right;
          flex: 0.4;
          color: #f15353;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .tramTotal {
    padding: 0.94rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txt {
      font-size: 0.88rem;
    }
    .price {
      font-size: 0.81rem;
      color: #f15353;
      display: flex;
      align-items: center;
      .van-icon {
        margin-top: 0.0938rem;
      }
    }
  }
  .line {
    width: 100%;
    height: 0.63rem;
    background: #f6f6f6;
  }
  .grandTotal {
    .grandList {
      padding: 1.59rem 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .gramdlis {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .txt {
          font-size: 0.69rem;
          color: #2b2b2b;
        }
        .price {
          font-size: 0.81rem;
          color: #f15353;
          .smallp {
            font-size: 0.63rem;
            color: #f15353;
          }
        }
      }
    }
    .grand {
      padding: 0.91rem 0.88rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 0.0313rem #ebebeb;
    }
  }
  .headTop {
    width: 23.41rem;
    background-color: #ee2e2b;
    overflow: hidden;
    padding-bottom: 2rem;
    .tips {
      margin-top: 0.75rem;
      text-align: left;
      font-size: 0.75rem;
      margin-left: 0.97rem;
      color: #fff;
    }
    .userBox {
      margin-top: 1.69rem;
      margin-left: 1.53rem;
      display: flex;
      align-items: center;
      .nameGrade {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        .grade {
          background: #f36b69;
          font-size: 0.75rem;
          color: #ffffff;
          padding: 0.25rem 0.53rem;
          border-radius: 0.63rem;
        }
        .name {
          margin-bottom: 0.35rem;
          font-size: 1rem;
          color: #ffffff;
        }
      }
      .image {
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
  }
}
</style>