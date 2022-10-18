<!-- 优量汇 广告返利 -->
<template>
  <div id="gdt_reward">
    <c-title :hide="false" text="广告返利"></c-title>
    <div class="member-box">
      <img :src="info.member && info.member.avatar_image" class="avatar" alt="" />
      <div class="user">
        <div class="user-id">ID：{{ info.member && info.member.uid }}</div>
        <div class="user-id">昵称：{{ info.member && info.member.nickname }}</div>
      </div>
    </div>

    <div class="block-box">
      <div>累计分红</div>
      <div>{{ $i18n.t("money") }} {{ info.total_amount }}</div>
    </div>

    <van-tabs v-model="activeName" @click="handleClick" sticky swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <div class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <div v-for="(item, index) in dataList[ind].list" :key="index" class="li">
            <div class="col">
              <div class="time">{{ item.created_at || "" }}</div>
              <div class="red right">{{ $i18n.t("money") }}{{ item.dividend_amount || "--" }}</div>
            </div>
            <div class="col" style="padding-top: 0.375rem;">
              <div class="left">奖励结算{{ item.point_name || "积分" }}：{{ item.point || "" }}</div>
              <div class="right">奖励比例：{{ item.rate || "" }}</div>
            </div>
          </div>
        </div>
        <yz-blank v-if="dataList[ind]" :datas="dataList[ind].list" text="暂无数据"></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      info: {
        member: {},
        total_amount: "--"
      },
      activeName: 0,
      titleArr: ["奖励记录"],
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
      this.handleClick();
    },
    handleClick() {
      if (!this.fun.isTextEmpty(this.dataList[this.activeName].list)) {
        this.isLoadMore = this.dataList[this.activeName].isLoadMore;
        return;
      }

      $http
        .post("plugin.qq-advertise.frontend.reward", { page: 1 }, "")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.info.member = response.data.member;
            this.info.total_amount = response.data.total_amount;
            this.$set(this.dataList[this.activeName], "isLoadMore", true);
            this.$set(this.dataList[this.activeName], "total_page", response.data.last_page);
            if (!this.dataList[this.activeName].total_page) {
              this.$set(this.dataList[this.activeName], "total_page", 0);
              this.dataList[this.activeName].total_page = 0;
            }
            this.$set(this.dataList[this.activeName], "list", response.data.data);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      this.dataList[this.activeName].isLoadMore = false;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.dataList[this.activeName].page >= this.dataList[this.activeName].total_page) {
        return;
      } else {
        let _json = {};
        this.dataList[this.activeName].page = this.dataList[this.activeName].page + 1;
        _json.page = this.dataList[this.activeName].page;

        $http.get("plugin.merchant-meeting.frontend.index.bonus-statistic", _json, "加载中").then(
          response => {
            this.isLoadMore = true;
            this.dataList[this.activeName].isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.data;
              this.dataList[this.activeName].list = this.dataList[this.activeName].list.concat(myData); //数组拼接
            } else {
              this.dataList[this.activeName].page = this.dataList[this.activeName].page - 1;
              this.dataList[this.activeName].isLoadMore = false;
              this.isLoadMore = false;
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
#gdt_reward {
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
    color: #fff;
    height: 2.5rem;
    line-height: 2.5rem;
    padding: 0 0.875rem;
    background-color: rgba($color: #f15353, $alpha: 0.7);
    display: flex;
    justify-content: space-between;
  }

  .content {
    .li {
      padding: 0.75rem;
      margin: 0.75rem 0.625rem 0;
      background: #fff;
      font-size: 12px;
      border-radius: 0.5rem;

      .col {
        display: flex;
        justify-content: space-between;

        .right {
          color: #000;
        }

        .red {
          color: #f15353;
          font-size: 14px;
        }

        .time {
          color: #999;
        }
      }
    }
  }
}
</style>
