<!-- 广告详情 -->
<template>
  <div id="Advertising-advertisersDetail">
    <c-title :hide="false" text="广告主"></c-title>
    <div class="top-info" style="padding-top: 0.875rem;">
      <div class="info-name">{{ info.put_in_type_text || "---" }}ID</div>
      <div class="info-data">ID{{ info.top_info && info.top_info.id }}</div>
    </div>
    <div class="top-info">
      <div class="info-name">{{ info.put_in_type_text || "---" }}标题</div>
      <div class="info-data">{{ (info.top_info && info.top_info.title) || "---" }}</div>
    </div>
    <div class="top-info">
      <div class="info-name">奖励人数</div>
      <div class="info-data">{{ info.reward_total || "---" }}</div>
    </div>
    <div class="top-info">
      <div class="info-name">奖励总额</div>
      <div class="info-data">{{ info.reward_amount_total || "---" }}</div>
    </div>
    <div class="top-info">
      <div class="info-name">奖励方式</div>
      <div class="info-data">{{ info.reward_type_text || "---" }}</div>
    </div>

    <van-tabs v-model="activeName" @change="handleClick" sticky offset-top="40" :ellipsis="false" swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <div class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <div class="li" v-for="item in dataList[ind].list" :key="item.id">
            <div class="member-img">
              <img :src="item.has_one_member && item.has_one_member.avatar_image" alt="" />
            </div>
            <div class="member-info">
              <div class="member-name">{{ item.has_one_member && item.has_one_member.nickname }}</div>
              <div class="order-time">{{ item.created_at }}</div>
            </div>
            <div class="time-or-price" v-if="activeName == '1' && item.reward_amount">{{ item.reward_amount }}</div>
          </div>
        </div>
        <yz-blank :datas="dataList[ind].list"></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
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
      isLoadMore: true
    };
  },

  created() {
    this.init();
    this.getData();
    this.handleClick();
  },

  components: { yzBlank },

  computed: {},

  methods: {
    init() {
      this.dataList = [];
      this.titleArr = ["观看记录", "奖励记录", "分享记录"];
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.isLoadMore = true;
    },
    getData() {
      //广告表ID
      $http
        .get("plugin.ad-serving.frontend.advertisers.index.getOrderDetail", { advertising_id: this.$route.params.id }, "加载中")
        .then(res => {
          this.isLoadMore = true;
          if (res.result == 1) {
            this.info = res.data;
          } else {
            console.log(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .get("plugin.ad-serving.frontend.advertisers.index.getOrderDetailLog", { advertising_id: this.$route.params.id, log_type: Number(this.activeName) + 1 }, "")
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
          advertising_id: this.$route.params.id,
          log_type: Number(this.activeName) + 1
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.ad-serving.frontend.advertisers.index.getOrderDetailLog", _json, "加载中").then(
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Advertising-advertisersDetail {
  .top-info {
    display: flex;
    font-size: 15px;
    text-align: left;
    padding: 0 0.875rem 0.75rem;
    background: #fff;

    .info-name {
      width: 40%;
      color: #808080;
    }

    .info-data {
      flex: 1;
      color: #202020;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding-top: 0.875rem;

    .li {
      display: flex;
      align-items: center;
      padding: 0 0.875rem 0.875rem;

      .member-img {
        width: 1.719rem;
        height: 1.719rem;
        background-color: #c5c5c5;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .member-info {
        text-align: left;
        flex: 1;
        overflow: hidden;
        margin: 0 0.75rem;

        .member-name {
          font-size: 14px;
          color: #202020;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        .order-time {
          font-size: 11px;
          color: #666;
        }
      }

      .time-or-price {
        font-size: 12px;
        color: #ee2e2b;
      }
    }
  }
}
</style>
