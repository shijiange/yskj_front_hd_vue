<template>
  <div class="page">
    <c-title :hide="false" :text="pageData.plugin_name"></c-title>

    <div class="header_box">
      <div class="left">
        <span>{{pageData.level_name}}</span>
      </div>
      <div class="right">
        <div class="li">等级比例:{{pageData.dividend_ratio}}%</div>
        <div class="li">下一等级比例:{{pageData.next_dividend_ratio}}%</div>
      </div>
    </div>

    <div class="money">
      <div class="moneyItem">
        <div class="price">{{pageData.unliquidated}}元</div>
        <div class="desc">未结算</div>
      </div>
      <div class="moneyItem">
        <div class="price">{{pageData.liquidated}}元</div>
        <div class="desc">已结算</div>
      </div>
    </div>

    <div class="hr"></div>

    <div class="tags">
      <van-tabs v-model="active" @change="changeVanTab">
        <van-tab v-for="(item,index) in list_title" :title="item.name" :key="index"
                 :name="item.dividend_type"></van-tab>
      </van-tabs>
    </div>

    <div class="listData">
      <div class="wrapper" v-for="(item1,index1) in list_data" :key='index1'>
        <div class="detail">
          <span class="month">{{item1.create_month}}</span>
          <div class="info" v-for="(item2,index2) in item1.has_many_dividend" :key='index2'>
            <div @click="openDetail(index1,index2)" class="info-div">
              <div class="left">
                <div class="num left-item">订单号：{{item2.order_sn}}</div>
                <div class="time left-item">时间：{{item2.created_at}}</div>
              </div>
              <div class="right">
                <div class="price right-item">{{item2.dividend_amount}}</div>
                <div class="state right-item">{{ item2.status_name }}</div>
              </div>
            </div>
            <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
            <div class="order_detail" :class="{'opens':index1==display1&&index2==display2}">
              <div class="team_list">
                <div class="img" v-if="item2.member">
                  <img :src="item2.member.avatar">
                </div>
                <div class="info1" v-if="item2.member">
                  <span class="name">{{item2.member.nickname}}</span>
                  <span class="desc">微信号:{{item2.member.yz_member&&item2.member.yz_member.wechat?item2.member.yz_member.wechat:"暂无微信号"}}</span>
                </div>
              </div>
              <div class="team_goods" id="distribution-goods" :key='i' v-for="(goods,i) in item2.order_goods">
                <div class="img">
                  <img :src="goods.thumb">
                </div>
                <div class="inner">
                  <div class="name">{{goods.title}}</div>
                </div>
                <div class="price">
                  <div>
                    <div class="b">{{$i18n.t("money")}}{{(goods.goods_price/goods.total)}}</div>
                    <div class="b"> ×{{goods.total}}</div>
                  </div>

                  <div class="total">{{$i18n.t("money")}}{{goods.goods_price}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no_data" style="color: #666; font-size: 0.8rem; margin-top: 2rem;" v-if="list_data.length==0">
        没有任何数据
      </div>
    </div>


  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: { cTitle },
  data() {
    return {
      display1: "-1",//查看详情索引值
      display2: "-1",//查看详情索引值
      list_title: [],
      list_data: [],
      active: 0,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      requestData: {},
      pageData: {}
    };
  },
  activated() {
    this.getData();
    window.screenTop = 0;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  },
  methods: {
    // 查看订单详情
    openDetail(index1, index2) {
      if (this.display1 == index1 && this.display2 == index2) {
        this.display1 = "-1";
        this.display2 = "-1";
        return;
      }
      this.display1 = index1;
      this.display2 = index2;
    },
    initData() {
      this.page = 1;
      this.requestData = {};
    },
    changeVanTab(evt) {
      this.initData();
      this.getData(evt);
      console.log(evt);
    },
    async getData(dividend_type = null) {

      if (dividend_type != null) {
        this.requestData.dividend_type = dividend_type;
      }

      Toast.loading({
        message: "获取中...",
        forbidClick: true
      });
      let res = await $http.get("plugin.team-sztt.api.index", this.requestData);
      Toast.clear();
      console.log(res.data);
      if (res.result != 1) {
        return Toast(res.msg);
      }
      this.isLoadMore = true;
      this.total_page = res.data.lastpage;
      if (!this.total_page) {
        this.total_page = 0;
      }
      this.pageData = res.data;
      setTimeout(() => {
        this.fun.setWXTitle(res.data.plugin_name);
      }, 200);

      this.list_title = res.data.list_title;
      this.list_data = res.data.list;
    },
    getMoreData() {
      if (this.page == this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = { page: this.page };
        Object.assign(json, this.requestData);
        $http
          .get(
            "plugin.team-sztt.api.index",
            json,
            "加载中..."
          )
          .then(res => {
            if (res.result == 1) {
              this.list_data = this.list_data.concat(res.data.list);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
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

  .page {
    background: #fff;
    min-height: 100vh;
  }

  .header_box {
    padding: 1rem 0.75rem;
    background: #f15353;
    color: #f5f5f5;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    .left {
      line-height: 3rem;
      font-size: 0.875rem;
    }

    .right {
      font-size: 0.875rem;
      text-align: right;

      .li {
        line-height: 1.5rem;
      }
    }
  }

  .money {
    width: 100%;
    height: 5.375rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .moneyItem {
      display: flex;
      flex-direction: column;

      .price {
        font-size: 1rem;
        color: #f15353;
      }

      .desc {
        color: #8c8c8c;
        font-size: 0.875rem;
        margin-top: 0.2rem;
      }
    }
  }

  .hr {
    height: 0.625rem;
    width: 100%;
    background-color: #ebebeb;
  }

  .wrapper {
    span.month {
      display: block;
      text-align: left;
      line-height: 2.25rem;
      padding: 0 0.75rem;
      background: #f0f0f0;
      font-size: 16px;
    }

    .info {
      border-bottom: 0.0625rem solid #eee;
      overflow: hidden;
      padding: 0.625rem 0.75rem;
      background: #fff;
      font-size: 14px;

      .info-div {
        width: 100%;
        float: left;
      }

      .left {
        width: 70%;
        float: left;
        text-align: left;
        box-sizing: border-box;

        .time {
          font-size: 12px;
          color: #8c8c8c;
        }

        .left-item {
          line-height: 1.5rem;
        }
      }

      .right {
        float: left;
        width: 30%;
        color: #f15353;
        text-align: right;

        .state {
          font-size: 12px;
          color: #8c8c8c;
        }

        .right-item {
          line-height: 1.5rem;
        }
      }
    }
  }

  .order_detail.opens {
    display: block;
  }

  .order_detail {
    display: none;
    overflow: hidden;
    width: 100%;

    .team_list {
      background-color: #fff;
      padding: 0.625rem 0;
      overflow: hidden;
      border-top: 0.0625rem solid #e2e2e2;

      .img {
        width: 2.5rem;
        height: 2.5rem;
        float: left;
        text-align: left;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info1 {
        height: 2.5rem;
        width: 80%;
        float: left;
        font-size: 14px;
        color: #222;
        line-height: 1.429rem;
        text-align: left;
        padding: 0 0.625rem;
        display: flex;
        flex-direction: column;

        .name {
          font-size: 0.875rem;
          color: #333;
        }

        .desc {
          color: #8c8c8c;
          font-size: 0.75rem;
        }
      }
    }
  }

  #distribution-goods {
    background-color: #fff;
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    padding-top: 10px;
    border-top: 0.0625rem solid #e2e2e2;
    margin-bottom: 0.375rem;

    .img {
      width: 4.375rem;
      height: 4.375rem;
      background-color: #666;

      img {
        width: 4.375rem;
        height: 4.375rem;
      }
    }

    .inner {
      flex: 5;
      padding: 0 0.625rem;
      display: flex;
      align-items: flex-start;
    }

    .name {
      flex: 5;
      text-align: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 0.875rem;
      color: #333;
    }

    .price {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;

      .b {
        text-align: right;
        color: #666;
        font-size: 12px;
      }

      .total {
        color: #333;
        float: right;
        font-size: 1rem;
        line-height: 1.6rem;
      }
    }
  }

</style>

