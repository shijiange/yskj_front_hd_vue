<!-- 测试结果 -->
<template>
  <div id="skin_rank">
    <c-title :hide="false" :text="'测肤结果'"></c-title>
    <div class="self-rank">
      <div class="self-rank-child triangle-topright">
        <div class="rank-color" v-if="!fun.isTextEmpty(myInfo)">NO.{{ myInfo.ranking }}</div>
        <div class="rank-color" v-else>-</div>
        <div>排名</div>
      </div>
      <div class="self-rank-child rank-member">
        <img :src="!fun.isTextEmpty(myInfo) ? myInfo.member.avatar : require('../../../assets/images/loading.jpg')" alt="" class="avator" />
        <div class="nickname">{{ !fun.isTextEmpty(myInfo) ? myInfo.member.nickname : "-" }}</div>
      </div>
      <div class="self-rank-child triangle-topleft">
        <div class="rank-color">{{ myInfo ? myInfo.composite_score : "-" }}</div>
        <div>颜值</div>
      </div>
    </div>

    <div class="rank-list">
      <div class="list" v-for="(item, index) in list" :key="item.id">
        <div class="rank-num">
          <div v-show="index == 0"><img class="medal" src="../../../assets/images/skin/gold_medal.png" alt="" /></div>
          <div v-show="index == 1"><img class="medal" src="../../../assets/images/skin/silver_medal.png" alt="" /></div>
          <div v-show="index == 2"><img class="medal" src="../../../assets/images/skin/copper_medal.png" alt="" /></div>
          <div v-show="index > 2">{{ index + 1 }}</div>
        </div>
        <template v-if="item.member">
          <img :src="item.member.avatar_image" alt="" class="avator" />
          <div class="nickname">{{ item.member.nickname || "-" }}</div>
        </template>
        <div class="total">颜值：{{ item.composite_score || "-" }}</div>
      </div>
      <p v-show="fun.isTextEmpty(list)" class="blank">暂无记录</p>
    </div>
    <div style="height: 3rem;"></div>
    <div class="btn-box set-pc-styleLeft" :class="[fun.isIphoneX() ? 'iphoneXb' : '']">
      <router-link :to="fun.getUrl('skinHome', {})" class="btn" tag="div">我要测肤</router-link>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      myInfo: {},
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  mounted() {
    this.getData();
  },

  components: { cTitle },

  computed: {},

  methods: {
    getData() {
      $http.get("plugin.skin-check.api.skin-check.ranking-list", {}, "...").then(
        response => {
          if (response.result === 1) {
            this.myInfo = response.data.my;
            this.list = response.data.ranking_list.data;
            this.isLoadMore = true;
            this.total_page = response.data.ranking_list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.skin-check.api.skin-check.ranking-list", { page: that.page }, "...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.ranking_list.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_rank {
  padding: 2.25rem 1rem 6.25rem;
  background: -moz-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffbec8), color-stop(25%, #fff));
  background: -webkit-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -o-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -ms-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: linear-gradient(to bottom, #ffbec8 0%, #fff 25%);
  min-height: calc(100vh - 50px);

  .self-rank {
    display: flex;
    align-items: flex-end;
    background-color: #fff;
    border-radius: 0.375rem;

    .self-rank-child {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33%;
      padding: 0.875rem 0;
      position: relative;

      .avator {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 50%;
        margin-bottom: 0.5rem;
      }

      .rank-color {
        font-size: 1.125rem;
        color: #fe5a73;
        line-height: 1.5rem;
        font-weight: bold;
      }

      .nickname {
        width: 100%;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .rank-member {
      margin-top: -1.5625rem;
      background-color: #fff;
      border-radius: 0.625rem;
      padding-top: 0.375rem;
    }

    .triangle-topright::before {
      content: "";
      position: absolute;
      top: -1px;
      right: 0;
      width: 0;
      height: 0;
      margin: 0 auto;
      border-left: 0.5rem solid transparent;
      border-top: 1.875rem solid #ffedea;
    }

    .triangle-topleft::before {
      content: "";
      position: absolute;
      top: -1px;
      left: 0;
      width: 0;
      height: 0;
      margin: 0 auto;
      border-right: 0.5rem solid transparent;
      border-top: 1.875rem solid #ffedea;
    }
  }

  .rank-list {
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px 0 rgba(255, 190, 200, 0.43);
    border-radius: 0.625rem;
    background: #fff;
    padding: 0 1rem 1rem;
    margin: 1rem 0;

    .list {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
      overflow: hidden;
      text-align: left;

      .rank-num {
        width: 1.75rem;
        color: #fe5a73;
        font-size: 1.125rem;

        .medal {
          width: 1.25rem;
        }
      }

      .avator {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        flex-shrink: 0;
        margin: 0 0.5rem 0 0;
      }

      .nickname {
        flex: 1;
        color: #fe5a73;
        font-weight: bold;
        font-size: 1rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .total {
        width: 3.875rem;
        color: #fe9d56;
      }
    }

    .blank {
      padding: 2rem 0;
      text-align: center;
      color: #999;
    }
  }

  .btn-box {
    position: fixed;
    bottom: 3.125rem;
    left: 0;
    width: 100%;
    z-index: 999;
    background: #fff;
    border-top: 1px solid #fbfbfb;
    // box-shadow: 0rem 8px 15px 0px rgba(0, 0, 0, 0.5);
  }

  .iphoneXb {
    bottom: 4.625rem;
  }

  .btn {
    height: 2.5rem;
    line-height: 2.5rem;
    width: 90%;
    margin: 0.5rem auto;
    text-align: center;
    color: #fff;
    background-color: #fe5a73;
    border-radius: 0.5rem;
  }
}
</style>
