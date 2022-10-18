<!-- 新零售 推广中心 -->
<template>
  <div id="newRetail-extension">
    <c-title :hide="false" :text="plugin_title"></c-title>
    <div class="top-member-box">
      <img class="member-acator" :src="info.avatar" alt="" />
      <div class="member-info">
        <div class="member-name">{{ info.nickname }}</div>
        <div class="member-grade" v-if="info.level_name">{{ info.level_name }}</div>
      </div>
    </div>
    <div class="grand-num" v-if="plugin_name == 0">
      累计收益：
      <div class="red-color">{{ $i18n.t("money") }} {{ info.total_money }}</div>
    </div>

    <div class="statistics-box">
      <template v-if="plugin_name == 0">
        <div class="statistics-child" v-for="(rewards, i) in info.reward" :key="i">
          <div class="statistics-num red-color">{{ rewards.total_money }}</div>
          <div class="statistics-name">{{ rewards.state | rewardsName }}</div>
        </div>
      </template>
      <template v-if="plugin_name == 1">
        <div class="statistics-child">
          <div class="statistics-num red-color">{{ info.right_number || "--" }}</div>
          <div class="statistics-name">股权数量</div>
        </div>
        <div class="statistics-child">
          <div class="statistics-num red-color">{{ info.right_money || "--" }}</div>
          <div class="statistics-name">股权分红</div>
        </div>
      </template>
    </div>

    <van-tabs v-model="activeName" @change="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index">
            <div class="p">
              <template v-if="plugin_name == 0">
                <!-- 新零售 -->
                <div class="left">{{ item.order_sn }}</div>
                <div class="red right" v-if="ind < 4">{{ item.money }}</div>
              </template>
              <template v-if="plugin_name == 1">
                <div class="left">{{ ind == 0 ? item.state_name : `股权数量${item.number}` }}</div>
                <div v-if="ind == 1">单价{{ item.money }}</div>
                <div class="red right">{{ ind == 0 ? (Number(item.change_num) > 0 ? `+${item.change_num}` : item.change_num) : item.total_money }}</div>
              </template>
            </div>
            <div class="p">
              <div class="time left">{{ item.created_at || "--" }}</div>
              <div class="right" style="font-size: 12px;" v-if="plugin_name == 0">{{ item.settlement_name }}</div>
              <div class="right" style="font-size: 12px;" v-if="plugin_name == 1">{{ ind == 0 ? "" : item.state_name }}</div>
            </div>
          </li>
        </ul>
        <yz-blank :datas="dataList[ind] && dataList[ind].list"></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true,
      plugin_title: "",
      plugin_name: 0, //0新零售，1股权分红
      plugin_api_1: "",
      plugin_api_2: ""
    };
  },

  activated() {
    this.plugin_name = this.$route.name == "stockDividendExtension" ? 1 : 0;
    this.activeName = 0;
    this.getRewardTotal();
    console.log("this.$route.name", this.$route.name);
  },

  components: { yzBlank },
  computed: {},
  methods: {
    getRewardTotal() {
      if (this.plugin_name == 1) {
        //股权分红
        this.titleArr = ["股权变动", "股权分红"];
        this.fun.setWXTitle("股权分红");
        this.plugin_title = "股权分红";
        this.plugin_api_1 = "plugin.stock-dividend.frontend.index.getRewardTotal";
        this.plugin_api_2 = "plugin.stock-dividend.frontend.index.getRewardDetail";
      } else {
        //新零售
        this.titleArr = ["招商奖", "平级奖", "差价奖", "销售奖"];
        this.plugin_api_1 = "plugin.new-retail.frontend.index.getRewardTotal";
        this.plugin_api_2 = "plugin.new-retail.frontend.index.getRewardDetail";
      }
      $http
        .get(this.plugin_api_1, {}, "..")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            if (this.plugin_name == 0) this.fun.setWXTitle(this.info.retail_name);
            if (this.plugin_name == 0) this.plugin_title = this.info.retail_name;
            this.setNewArr();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setNewArr() {
      this.dataList = [];

      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log("dataList:::", this.dataList);
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }
      let state = this.plugin_name == 1 ? that.activeName + 5 : that.activeName + 1;

      $http
        .post(this.plugin_api_2, { page: 1, state: state }, "..")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            Toast(response.msg);
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
        let state = this.plugin_name == 1 ? that.activeName + 5 : that.activeName + 1;
        let _json = { state: state };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get(this.plugin_api_2, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
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
  },
  filters: {
    rewardsName: function(value) {
      if (!value) return "";
      let _value = Number(value);
      if (_value == 1) {
        return "招商奖";
      } else if (_value == 2) {
        return "平级奖";
      } else if (_value == 3) {
        return "差价奖";
      } else if (_value == 4) {
        return "销售奖";
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-extension {
  .top-member-box {
    display: flex;
    padding: 1.625rem 1.375rem;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #f14e4e;

    .member-acator {
      width: 47px;
      height: 47px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin: 0 0.625rem 0 0;
      background: #fff;
    }

    .member-info {
      flex: 1;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;

      .member-name {
        width: 100%;
        line-height: 1.875rem;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .member-grade {
        display: flex;
        height: 1.25rem;
        line-height: 1.25rem;
        padding: 0 0.5rem;
        border-radius: 1rem;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .grand-num {
    height: 2rem;
    line-height: 2rem;
    padding: 0 0.875rem;
    background: #fff;
    text-align: left;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
  }

  .red-color {
    color: #f14e4e;
  }

  .statistics-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 0.875rem;
    background: #fff;
    position: relative;

    .statistics-child {
      width: 10rem;
      display: flex;
      flex-direction: column;
      padding-bottom: 0.875rem;

      .statistics-num {
        font-size: 20px;
        line-height: 32px;
      }
    }

    &::after {
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

  .red {
    color: #f0201f;
  }

  .time {
    color: #8e8e8e;
  }

  .content {
    font-size: 15px;
    padding-bottom: 1rem;
    background: #fff;

    li {
      padding: 0.875rem 0.875rem 0 0.875rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;

      .p {
        display: flex;
        line-height: 1.5rem;

        .left {
          width: 50%;
          text-align: left;
        }

        span {
          display: inline-block;
        }

        .time {
          font-size: 10px;
        }
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
