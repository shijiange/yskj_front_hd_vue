<!-- 新抽奖 中奖名单 -->
<template>
  <div id="winners_list">
    <c-title :hide="false" text="中奖名单"></c-title>
    <div class="title">
      <div>中奖会员</div>
      <div>奖品</div>
    </div>
    <div class="list">
      <div class="list-child" v-for="(item, i) in list" :key="i">
        <div class="member">
          <img :src="item.avatar" alt="" />
          <div class="name">{{ item.nickname }}</div>
        </div>
        <img :src="item.thumb" alt="" class="good-img" />
      </div>
      <yz-blank v-if="fun.isTextEmpty(list)" :data="list" text="暂无中奖数据" :isBtn="false"></yz-blank>
    </div>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
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

  components: { yzBlank },

  computed: {},

  methods: {
    getData() {
      $http
        .get("plugin.luck-draw.frontend.index.getPrize", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
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
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.active == "1") {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {
          activity_id: that.$route.params.id
        };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.get("plugin.luck-draw.frontend.index.getPrize", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
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
#winners_list {
  background: #fff;

  .title {
    height: 2.375rem;
    line-height: 2.375rem;
    display: flex;
    justify-content: space-between;
    background: #f2f2f2;
    padding: 0 0.875rem;
  }

  .list {
    padding: 0 0.875rem;
    background: #fff;

    .list-child {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      text-align: left;

      .member {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #000;
        font-weight: 700;
        flex: 1;
        overflow: hidden;

        img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          overflow: hidden;
          margin: 0;
          margin-right: 0.875rem;
          flex-shrink: 0;
          object-fit: contain;
          background-color: #fac337;
        }

        .name {
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .good-img {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 0.375rem;
        object-fit: contain;
        background-color: #fac337;
      }
    }
  }
}
</style>
