<!-- 抽奖活动 -->
<template>
  <div id="lucky_draw">
    <c-title :hide="false" text="抽奖活动"></c-title>
    <van-tabs v-model="activeName" @click="handleClick" sticky offset-top="40px" animated>
      <van-tab v-for="(items, ind) in titleArr" :key="ind" :title="items">
        <div class="ul" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <!-- 我的抽奖 -->
          <div class="li" v-for="(item, index) in dataList[ind].list" :key="index" @click.stop="gotoUrl('newDrawIndex', { id: item.activity_id })">
            <img :src="item.activity_img" alt="" class="active-img" />
            <div class="active-info">
              <div class="active-title">{{ item.activity_name || "---" }}</div>
              <template v-if="tagType == 'my'">
                <!-- 商品的 -->
                <div class="small-info">当前轮数：{{ item.current_round }} 参与人数：{{ item.turn_member }}</div>
                <div class="small-info">总共轮数：{{ item.turn_num }} 总参与人数：{{ item.turn_total }}</div>
              </template>
              <template v-if="tagType == 'activity'">
                <!-- 抽奖活动 -->
                <div class="small-info small-rule">
                  <div class="price">{{ item.type_id == 1 ? "免费" : $i18n.t("money") + item.money + "参与" }}</div>
                  达到{{ item.max_num }}次开奖
                </div>
              </template>
            </div>
            <div class="active-status" :class="[item.activity_state != '活动进行中' ? 'endBg' : '']" v-show="item.activity_state">{{ item.activity_state }}</div>
            <div class="active-draw" v-if="tagType == 'my' && item.is_prize" @click.stop="gotoUrl('orderdetail', { order_id: item.order_id, orderType: 'luck-draw' })">我的奖品</div>
          </div>
        </div>
        <yz-blank v-else text="暂无数据" :isBtn="false"></yz-blank>
      </van-tab>
    </van-tabs>
    <div class="my-btn" @click.stop="gotoUrl('mydraw', {})">
      <i class="iconfont icon-fontclass-huiyuanzhongixn"></i>
      我的
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import yzBlank from "components/ui_components/yz_blank";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tagType: "activity", //区分“抽奖活动”activity和“我的抽奖活动”my标识
      activeName: 0,
      dataList: [],
      titleArr: ["全部", "未开始", "活动中", "已结束"],
      isLoadMore: true
    };
  },

  activated() {
    if (this.$route.params.tag && this.$route.params.tag == "my") {
      this.tagType = "my";
      this.titleArr = ["全部", "进行中", "已中奖", "收藏", "评论"];
    }
    this.dataList = [];
    this.setNewArr();
  },

  components: { yzBlank },

  computed: {},

  methods: {
    gotoUrl(_name, _params) {
      this.$router.push(this.fun.getUrl(_name, _params));
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
      console.log("dataList:::", this.dataList);
      if (this.$route.params.index) {
        this.activeName = Number(this.$route.params.index);
      }
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }
      let _url = "";
      let _json = {};
      if (this.tagType == "activity") {
        _url = "plugin.luck-draw.frontend.index.index";
        _json = {
          page: 1,
          search: { state: this.activeName - 1 }
        };
        if (this.$route.query.gid) {
          _json.search.goods_id = this.$route.query.gid;
        }
      } else {
        _url = "plugin.luck-draw.frontend.index.myLuck";
        _json = {
          page: 1,
          state: this.activeName
        };
      }
      $http
        .post(_url, _json, "")
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
        let _url = "";
        let _json = {};
        if (this.tagType == "activity") {
          _url = "plugin.luck-draw.frontend.index.index";
          _json = {
            search: { state: this.activeName - 1 }
          };
          if (this.$route.query.gid) {
            _json.search.goods_id = this.$route.query.gid;
          }
        } else {
          _url = "plugin.luck-draw.frontend.index.myLuck";
          _json = {
            state: this.activeName
          };
        }
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.post(_url, _json, "加载中").then(
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
#lucky_draw {
  .ul {
    padding: 0.875rem;

    .li {
      width: 100%;
      background-color: #fff;
      box-shadow: 0 1px 4px 1px rgba(217, 217, 217, 0.43);
      border-radius: 0.625rem;
      margin: 0 0 0.75rem;
      display: flex;
      flex-direction: column;
      text-align: left;
      overflow: hidden;
      position: relative;

      .active-img {
        width: 100%;
        height: 9.375rem;
        background-color: #ebebeb;
        object-fit: cover;
      }

      .active-info {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;

        .active-title {
          color: #202020;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-bottom: 0.5rem;
        }

        .small-info {
          color: #999;
          font-size: 10px;
          line-height: 18px;
        }

        .small-rule {
          display: flex;

          .price {
            color: #f14e4e;
            font-size: 16px;
            margin-right: 0.5rem;
          }
        }
      }

      .active-status {
        position: absolute;
        top: 0.875rem;
        left: 0.875rem;
        height: 1.375rem;
        line-height: 1.375rem;
        background-color: #f14e4e;
        border-radius: 0.625rem;
        padding: 0 0.5rem;
        color: #fff;
        font-size: 10px;
      }

      .endBg {
        background-color: #a8a8a8;
      }

      .active-draw {
        position: absolute;
        bottom: 0.875rem;
        right: 0.875rem;
        height: 1.375rem;
        line-height: 1.375rem;
        border: 1px solid #faa332;
        border-radius: 0.625rem;
        padding: 0 0.5rem;
        color: #faa332;
        font-size: 10px;
      }
    }
  }

  .my-btn {
    position: fixed;
    right: 50%;
    transform: translateX(10rem);
    bottom: 8rem;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #f14e4e;
    border-radius: 50%;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 10px;
    z-index: 99999;
    justify-content: center;
    box-shadow: 1px 1px 3px 1px rgba(209, 209, 209, 0.5);
  }
}
</style>
