<!-- 线下招商会 -->
<template>
  <div id="offline_investment_extension">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <div class="member-box">
      <img :src="info.member && info.member.avatar_image" class="avatar" alt="" />
      <div class="user">
        <div class="user-id">ID：{{ info.member && info.member.uid }}</div>
        <div class="user-id">昵称：{{ info.member && info.member.nickname }}</div>
      </div>
    </div>

    <div class="block-box">
      <div>累计分红</div>
      <div style="color: #f15353;">{{ $i18n.t("money") }} {{ info.bonusTotal }}</div>
    </div>
    <template v-if="info.lecturer || info.logistics">
      <van-tabs v-model="activeRole" @click="changeRole">
        <van-tab title="讲师" name="1" v-if="info.lecturer"></van-tab>
        <van-tab title="后勤" name="2" v-if="info.logistics"></van-tab>
      </van-tabs>
      <div class="grid-two">
        <div class="grid-child">
          <div>订单金额</div>
          <div style="color: #f15353; font-size: 18px;">{{ $i18n.t("money") }} {{ info.bonusStatistic && info.bonusStatistic.orderMoney }}</div>
        </div>
        <div class="line"></div>
        <div class="grid-child">
          <div>分红</div>
          <div style="color: #f15353; font-size: 18px;">{{ $i18n.t("money") }} {{ info.bonusStatistic && info.bonusStatistic.bonusSum }}</div>
        </div>
      </div>

      <van-tabs v-model="activeName" @click="handleClick" sticky swipeable>
        <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
          <div class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
            <div v-for="(item, index) in dataList[ind].list" :key="index" class="li">
              <div class="col">
                <div class="left">{{ item.order_sn || "" }}</div>
                <div class="red right">{{ $i18n.t("money") }} {{ item.reward_money || "" }}</div>
              </div>
              <div class="col" style="padding-top: 0.375rem;">
                <div class="time left">{{ item.created_at || "" }}</div>
                <div class="right">{{ item.status_name || "" }}</div>
              </div>
            </div>
          </div>
          <yz-blank v-if="dataList[ind]" :datas="dataList[ind].list" text="暂无数据"></yz-blank>
        </van-tab>
      </van-tabs>
    </template>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      info: {},
      activeRole: 0,
      activeName: 0,
      titleArr: ["全部", "未结算", "已结算"],
      dataList: [],
      plugin_name: "",
      isLoadMore: true
    };
  },

  activated() {
    this.init();
  },

  components: { yzBlank },

  computed: {},

  mounted() {},

  methods: {
    init() {
      this.dataList = [];
      this.isLoadMore = true;
      this.setNewArr();
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.getData();
    },
    getData() {
      $http
        .get("plugin.merchant-meeting.frontend.index.bonus-info", {}, ".")
        .then(res => {
          if (res.result == 1) {
            this.fun.setWXTitle(res.data.plugin_name);
            this.plugin_name = res.data.plugin_name;
            this.info = res.data;
            this.$set(this.dataList[0], "isLoadMore", true);
            this.$set(this.dataList[0], "total_page", res.data.bonusStatistic.bonusList.last_page);
            if (!this.dataList[0].total_page) {
              this.$set(this.dataList[0], "total_page", 0);
              this.dataList[0].total_page = 0;
            }
            this.$set(this.dataList[0], "list", res.data.bonusStatistic.bonusList.data);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeRole() {
      // 切换角色
      this.dataList = [];
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.activeName = 0;
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[this.activeName].list)) {
        this.isLoadMore = this.dataList[this.activeName].isLoadMore;
        return;
      }

      $http
        .post("plugin.merchant-meeting.frontend.index.bonus-statistic", { page: 1, business_type: this.activeRole, status: this.activeName - 1 }, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.bonusList.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.bonusList.data);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          business_type: this.activeRole,
          status: this.activeName - 1
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.merchant-meeting.frontend.index.bonus-statistic", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.bonusList.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#offline_investment_extension {
  .member-box {
    padding: 1.25rem;
    width: 100%;
    background-color: #f15353;
    display: flex;

    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin-right: 1rem;
    }

    .user {
      color: #fff;
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .block-box {
    height: 2.75rem;
    line-height: 2.75rem;
    padding: 0 0.875rem;
    background: #fff;
    margin-bottom: 0.875rem;
    display: flex;
    justify-content: space-between;
  }

  .grid-two {
    display: flex;
    align-items: center;
    background: #fff;
    height: 5rem;
    margin-bottom: 0.875rem;

    .line {
      height: 20px;
      width: 1px;
      background: #999;
    }

    .grid-child {
      padding: 1rem 0;
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  .content {
    .li {
      padding: 0.875rem;
      background: #fff;
      font-size: 12px;
      position: relative;

      .col {
        display: flex;
        justify-content: space-between;

        .right {
          color: #2ebc9e;
        }

        .red {
          color: #f15353;
        }

        .time {
          color: #999;
        }
      }
    }

    .li::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      content: "";
      width: 100%;
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }
  }
}
</style>
