<template>
  <div id="allowanceReward">
    <c-title class="circle_title" :hide="false" :text="title"></c-title>
    <van-tabs v-model="active" @change="tabChange">
      <van-tab title="全部"></van-tab>
      <van-tab title="已结算"></van-tab>
      <van-tab title="未结算"></van-tab>
    </van-tabs>
    <div class="yearBox">
      <div class="yearTxt">按年</div>
      <div class="yearRight" @click="yearTap">
        <span>{{ nowYears }}</span>
        <i class="iconfont icon-member-bottom"></i>
      </div>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index" class="forListC">
        <div class="list_li" v-if="item.amounts > 0" @click="tapGetList(item, index)">
          <div class="list_li_left">
            {{ item.year }}-{{ item.month }}: <span class="price">￥{{ item.amounts }}</span>
          </div>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <template v-for="(itemk, ind) in item.info">
          <div class="hideList" v-if="item.show" :key="ind">
            <div class="list_lis" @click="showGoods(ind, itemk, index)">
              <div class="list_lis_top">
                <div class="order">{{ itemk.order_sn }}</div>
                <div class="price">+{{ itemk.award_amounts }}</div>
              </div>
              <div class="list_lis_bottom">
                <div class="date">{{ itemk.created_at }}</div>
                <div class="status">
                  {{ itemk.status_name }}
                  <template v-if="tapind == 1 || tapind == 0">
                    <div class="resver" v-if="!itemk.show && itemk.order_goods.length > 0">
                      <i class="iconfont icon-member-bottom"></i>
                    </div>
                    <div v-if="itemk.show && itemk.order_goods.length > 0">
                      <i class="iconfont icon-member-bottom"></i>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <template v-if="tapind == 1 || tapind == 0">
              <div class="goodsBox" v-if="itemk.show && itemk.order_goods.length > 0" :class="!itemk.moreShow ? 'goodsBoxHeight' : ''">
                <div class="shopList" v-for="(order, oInd) in itemk.order_goods" :key="oInd">
                  <div class="img">
                    <img :src="order.thumb" alt="" />
                  </div>
                  <div class="goodsDetail">
                    <div class="goodsDetailTxt">{{ order.title }}</div>
                    <div class="goodsDetailPrice"><span>订单金额：</span>{{ order.payment_amount }}</div>
                  </div>
                </div>
                <div class="moreGoods" @click="moreShowTap(item, ind, index)" v-if="!itemk.moreShow && itemk.order_goods.length > 2">
                  查看更多
                  <i class="iconfont icon-member-bottom"></i>
                </div>
              </div>
            </template>
          </div>
        </template>
        <div class="getMore" @click="getMore(item, index)" v-if="item.show && item.last_page && item.page < item.last_page">加载更多</div>
      </div>
    </div>
    <van-popup v-model="showPicker" round position="bottom" value-key="value">
      <van-picker title="选择年份" show-toolbar :columns="years" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      title: "极差奖励",
      years: [],
      showPicker: false,
      // 年份数组
      list: [],
      // 年月下的订单详情
      info: [],
      nowYears: new Date().getFullYear(),
      getUrl: "",
      getDetailUrl: "",
      tapind: ""
    };
  },
  activated() {
    if (this.$route.params.ind == 0) {
      this.title = "极差奖励";
      this.getUrl = "plugin.agency-subsidy.frontend.controllers.records.order.index";
      this.getDetailUrl = "plugin.agency-subsidy.frontend.controllers.records.order.detail";
    } else if (this.$route.params.ind == 1) {
      this.title = "层级奖励";
      this.getUrl = "plugin.agency-subsidy.frontend.controllers.records.level.index";
      this.getDetailUrl = "plugin.agency-subsidy.frontend.controllers.records.level.detail";
    } else if (this.$route.params.ind == 2) {
      this.title = "补贴奖励";
      this.getUrl = "plugin.agency-subsidy.frontend.controllers.records.subsidy.index";
      this.getDetailUrl = "plugin.agency-subsidy.frontend.controllers.records.subsidy.detail";
    } else if (this.$route.params.ind == 3) {
      this.title = "业绩奖励";
      this.getUrl = "plugin.agency-subsidy.frontend.controllers.records.performance.index";
      this.getDetailUrl = "plugin.agency-subsidy.frontend.controllers.records.performance.detail";
    }
    this.tapind = this.$route.params.ind;
    this.fun.setWXTitle(this.title);
    this.getData();
  },
  methods: {
    tabChange(e) {
      console.log(e);
      this.nowYears = new Date().getFullYear();
      this.list = [];
      this.getData();
    },
    moreShowTap(item, ind, index) {
      if (!item.info[ind].moreShow) {
        this.$set(this.list[index].info[ind], "moreShow", true);
      }
    },
    showGoods(ind, itemk, index) {
      if (itemk.show) {
        this.$set(this.list[index].info[ind], "show", false);
      } else {
        this.$set(this.list[index].info[ind], "show", true);
      }
    },
    tapGetList(item, index) {
      if (item.show) {
        this.$set(this.list[index], "show", false);
      } else {
        this.$set(this.list[index], "show", true);
        this.list[index].page = 1;
        this.list[index].last_page = 1;
        this.getDetail(item, index);
      }
    },
    async yearTap() {
      this.getYear();
      this.showPicker = true;
    },
    onConfirm(e) {
      this.showPicker = false;
      this.nowYears = e;
      this.list = [];
      this.getData();
    },
    onCancel() {
      this.showPicker = false;
    },
    getYear() {
      if (this.years.length >= 11) {
        return;
      }
      //获取年份，当前年前后15年
      var y = new Date().getFullYear();
      for (var i = 0; i <= 10; i++) {
        this.years.push(y - i);
      }
      console.log(this.years);
    },
    getData() {
      let status = "";
      if (this.active == 2) {
        status = "-1";
      } else {
        status = this.active;
      }
      let json = {
        year: this.nowYears,
        award_status: status
      };
      $http.post(this.getUrl, json, "加载中...").then(res => {
        if (res.result == 1) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].amounts > 0) {
              res.data[i].show = false;
            }
          }
          this.list = res.data;
        } else {
          Toast(res.msg);
        }
      });
    },
    getDetail(item, index) {
      let status = "";
      if (this.active == 2) {
        status = "-1";
      } else {
        status = this.active;
      }
      let json = {
        year: item.year,
        month: item.month,
        award_status: status,
        page: item.page
      };
      $http.post(this.getDetailUrl, json, "加载中...").then(res => {
        if (res.result == 1) {
          if (this.tapind == 0 || this.tapind == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].order_goods.length > 0) {
                res.data.data[i].show = false;
              }
            }
          }
          this.$set(this.list[index], "info", res.data.data);
          this.list[index].last_page = res.data.last_page;
        } else {
          Toast(res.msg);
        }
      });
    },
    getMore(item, index) {
      console.log(item, index);
      let json = {
        year: item.year,
        month: item.month,
        award_status: this.active,
        page: item.page + 1
      };
      $http.post(this.getDetailUrl, json, "加载中...").then(res => {
        if (res.result == 1) {
          let nextData = res.data.data;
          this.list[index].info = this.list[index].info.concat(nextData);
          this.$set(this.list[index], "info", this.list[index].info);
          this.list[index].page = res.data.current_page;
          this.list[index].last_page = res.data.last_page;
        } else {
          Toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.goodsBoxHeight {
  max-height: 7.3rem;
  position: relative;
}
.moreGoods {
  position: absolute;
  bottom: 0.3rem;
  width: 100%;
  font-size: 0.69rem;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  .iconfont {
    color: #666666;
  }
}
.list {
  background: #fff;
}
.forListC {
  margin-bottom: 0.63rem;
}
.getMore {
  color: #666666;
  margin-bottom: 0.63rem;
  overflow: hidden;
}
.yearBox {
  padding: 0.63rem 0;
  background: #fff;
  padding-right: 1.09rem;
  padding-left: 0.94rem;
  overflow: hidden;
  margin: 0.63rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .yearRight {
    flex: 1;
    text-align: right;
  }
  .yearTxt {
    flex: 1;
    text-align: left;
  }
}
.goodsBox {
  background: #f2f2f2;
  padding: 0.75rem;
  overflow: hidden;
  box-sizing: border-box;
  margin-bottom: 0.63rem;
  .shopList {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    .goodsDetail {
      flex: 1;
      height: 2.38rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      overflow: hidden;
      .goodsDetailTxt {
        font-size: 0.75rem;
        color: #202020;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .goodsDetailPrice {
        font-size: 0.69rem;
        color: #f15353;
        span {
          color: #666666;
        }
      }
    }
    .img {
      width: 2.38rem;
      height: 2.38rem;
      border-radius: 0.13rem;
      margin-right: 0.5rem;
      img {
        width: 2.38rem;
        height: 2.38rem;
        border-radius: 0.13rem;
      }
    }
  }
}
.hideList {
  padding-right: 1.09rem;
  padding-left: 0.94rem;
  background: #fff;
  overflow: hidden;
  .list_lis {
    padding: 0.72rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid #ebebeb;
    .list_lis_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.4rem;
      .order {
        flex: 1;
        text-align: left;
        font-size: 0.75rem;
      }
      .price {
        flex: 0.5;
        text-align: right;
        color: #f15353;
        font-size: 0.81rem;
      }
    }
    .list_lis_bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.69rem;
      .date {
        flex: 1;
        text-align: left;
        color: #666666;
        font-size: 0.69rem;
      }
      .status {
        flex: 0.5;
        text-align: right;
        color: #666666;
        font-size: 0.69rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .resver {
          transform: rotate(180deg) !important;
        }
      }
    }
  }
}
.list_li {
  height: 2.72rem;
  padding-right: 1.09rem;
  padding-left: 0.94rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  // margin-bottom: 0.63rem;
  .iconfont {
    font-size: 20px;
    color: #666666;
  }
  .list_li_left {
    color: #202020;
    font-size: 0.88rem;
    .price {
      color: #f15353;
    }
  }
}
</style>