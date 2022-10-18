<template>
  <div id="allowanceAchievement">
    <c-title class="circle_title" :hide="false" text="业绩统计"></c-title>
    <div class="topbox"></div>
    <div class="contenbox">
      <div class="contenLeft">
        <div class="contenLeft_top">{{ avatarInfo.amounts }}</div>
        <div class="contenLeft_bottom">团队业绩</div>
      </div>
      <div class="line"></div>
      <div class="contenRight">
        <div class="contenLeft_top" @click="goteam">{{ avatarInfo.team_nums }}<span>人</span></div>
        <div class="contenLeft_bottom">团队人数</div>
      </div>
    </div>
    <div class="listBox">
      <div class="lis_box" v-for="(item, index) in list" :key="index">
        <div class="lis">
          <div class="img" v-if="item.belongs_to_member">
            <img :src="item.belongs_to_member.avatar_image" alt="" />
          </div>
          <div class="no_listData">
            <div class="listData" @click="tapGetMoreGood(item, index)">
              <div class="listTop">
                <div class="name" v-if="item.belongs_to_member">{{ item.belongs_to_member.nickname }}</div>
                <div class="order">订单号：{{ item.order_sn }}</div>
              </div>
              <div class="listBottom">
                <div class="grade" v-if="item.belongs_to_agency">{{ item.belongs_to_agency.has_one_level.name }}</div>
              </div>
              <div class="listBottom_right">
                <div class="order">
                  订单金额：<span class="price">￥{{ item.amounts }}</span>
                </div>
                <div class="date">{{ item.created_at }}</div>
              </div>
            </div>
            <div class="selectBtn" :class="item.goodsShow ? 'iconRever' : ''" @click.stop="tapGetMoreGood(item, index)">
              <i class="iconfont icon-member-left" v-if="!item.goodsShow"></i>
              <i class="iconfont icon-member-left" v-if="item.goodsShow"></i>
            </div>
          </div>
        </div>
        <div class="seleBox" :class="[item.moreShow ? '' : 'moreGoodsSHow']" v-if="item.goodsShow">
          <div class="seleBoxList" v-for="(itemK, index) in item.order_goods" :key="index">
            <div class="goodImg">
              <img :src="itemK.thumb" alt="" />
            </div>
            <div class="seleList">
              <div class="title">{{ itemK.title }}</div>
              <div class="price">
                订单金额：<span class="num">{{ itemK.payment_amount }}</span>
              </div>
            </div>
          </div>
          <div class="moreGoods" v-if="item.order_goods.length > 2 && !item.moreShow" @click="showGoodTap(item, index)">
            查看更多
            <i class="iconfont icon-member-bottom"></i>
          </div>
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
    showGoodTap(item, index) {
      if (!item.moreShow) {
        this.$set(this.list[index], "moreShow", true);
      }
    },
    goteam() {
      this.$router.push(this.fun.getUrl("allowanceTeam", {}));
    },
    tapGetMoreGood(e, index) {
      if (e.goodsShow) {
        this.$set(this.list[index], "goodsShow", false);
      } else {
        this.$set(this.list[index], "goodsShow", true);
      }
    },
    getData() {
      $http.post("plugin.agency-subsidy.frontend.controllers.performance.index", { page: this.page }, "加载中...").then(res => {
        if (res.result == 1) {
          this.avatarInfo = res.data.info;
          for (let i = 0; i < res.data.list.data.length; i++) {
            res.data.list.data[i].goodsShow = false;
          }
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
        $http.get("plugin.agency-subsidy.frontend.controllers.performance.index", json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              for (let i = 0; i < response.data.list.data.length; i++) {
                response.data.list.data[i].goodsShow = false;
              }
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
.moreGoodsSHow {
  max-height: 7.43rem;
}
.topbox {
  width: 100%;
  height: 3.75rem;
  background-color: #ee2e2b;
}
.listBox {
  padding: 0 0.94rem;
  background-color: #fff;
  .lis:last-child {
    border-bottom: none;
  }
  .seleBox {
    padding: 0.63rem;
    overflow: hidden;
    background-color: #fff;
    transition: 0.3s;
    position: relative;
    .moreGoods {
      font-size: 0.69rem;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0.45rem;
      width: 100%;
    }
    .seleBoxList {
      display: flex;
      width: 100%;
      margin-bottom: 0.75rem;
      .seleList {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 0.75rem;
        .price {
          font-size: 0.69rem;
          color: #666666;
          .num {
            font-size: 0.69rem;
            color: #f15353;
          }
        }
        .title {
          text-align: left;
        }
      }
      .goodImg {
        width: 2.38rem;
        height: 2.38rem;
        border-radius: 0.13rem;
        margin-right: 0.44rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.13rem;
        }
      }
    }
  }
  .lis {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding: 0.84rem 0;
    background: #ffffff;
    padding-left: 0.5rem;
    .no_listData {
      display: flex;
      align-items: center;
      flex: 1;
      .selectBtn {
        color: #666666;
        margin: 0 0.5rem;
      }
    }
    .iconRever {
      transform: rotate(270deg) !important;
    }
    .listData {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .listTop {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          text-align: left;
        }
        .order {
          font-size: 0.69rem;
        }
      }
      .listBottom {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.3rem 0;
        .grade {
          color: #666666;
          font-size: 0.63rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
      }
      .listBottom_right {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        font-size: 0.63rem;
        .order {
          font-size: 0.63rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          text-align: left;
          margin-right: 0.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .price {
            color: #f15353;
          }
        }
        .date {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          color: #666666;
          font-size: 0.63rem;
        }
      }
    }
    .img {
      width: 1.88rem;
      height: 1.88rem;
      background-color: #f05152;
      border-radius: 100%;
      margin-right: 0.34rem;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }
}
.contenbox {
  width: 22.19rem;
  height: 4.53rem;
  background-color: #ffffff;
  border-radius: 0.31rem;
  margin: 0 auto;
  margin-top: -1.17rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 0.63rem;
  .contenLeft {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .contenRight {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .contenLeft_top {
    font-size: 0.88rem;
    color: #f15353;
    margin-bottom: 0.7rem;
    span {
      color: #414141;
    }
  }
  .contenLeft_bottom {
    font-size: 0.75rem;
    color: #666666;
  }
  .line {
    width: 0.03rem;
    height: 2.44rem;
    background-color: #e9e9e9;
  }
}
</style>