<template>
  <div class="page">
    <div class="title">
      <div class='con' style="height: 2.938rem;">
        <div class="left" @click="goto">
          <i class="iconfont icon-member-left back"></i>
        </div>
        <div class="right">{{titleName}}</div>
      </div>
    </div>

    <div class="header">
      <div class="myname">{{titleName}}</div>
      <div class="achive">
        <div class="item">
          <div class="c1">{{amounts||0}}元</div>
          <div class="c2">总业绩</div>
        </div>
        <div class="item">
          <div class="c1">{{num||0}}人</div>
          <div class="c2">人数</div>
        </div>
      </div>
    </div>

    <div class="splt"></div>


    <div class="descContainer" v-if="listData.length>0">

      <div class="descItems" ref="marketItems" @scroll="orderScroll">

        <div class="descItem">
          <div class="marketname" style="visibility: hidden;">占位</div>
          <div class="nickname" style="visibility: hidden;">占位</div>
          <div class="price" style="color: #8e521e; font-size: 0.85rem;">业绩</div>
          <div class="desc" style="color: #8e521e; font-size: 0.85rem;">人数</div>
        </div>
        <div class="descItem" v-for="(item,index) in listData" :key="index">
          <div class="marketname">{{titleName}}{{index+1}}</div>
          <div class="nickname">{{item.name}}</div>
          <div class="price">{{item.amounts}}</div>
          <div class="desc">{{item.num}}</div>
        </div>

      </div>

    </div>


  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      listData: [],
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,

      amounts: 0,
      num: 0,
      titleName: "我的市场"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    orderScroll() {
      let marketItems = this.$refs.marketItems;
      //let list = this.listData;
      console.log(marketItems.scrollLeft, marketItems.clientWidth, marketItems.scrollWidth);


      if (marketItems.scrollLeft + marketItems.clientWidth >= (marketItems.scrollWidth - 10)) {
        console.log("加载更多", this.listData);
        //alert("触发加载更多");
        //this.listData = this.listData.concat(new Array(10));
        // 加载更多
        if (this.isLoadMore) {
          //	this.getMoreData();
        }
      }
    },
    async getData() {
      let json = {};
      if (this.$route.query.marketId && this.$route.query.marketId != 0) {
        this.fun.setWXTitle("下级市场");
        this.titleName = "下级市场";
        json.member_id = this.$route.query.marketId;
      }
      let res = await $http.get("plugin.regional-reward.Frontend.controllers.achievement.index", json, "");
      console.log(res);
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      this.listData = res.data.childs;
      this.amounts = res.data.amounts;
      this.num = res.data.num;

    },
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }

  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: rgb(255, 255, 255);
    min-height: 100vh;
  }

  .title {
    height: 2.938rem;
    width: 375px;
    box-sizing: border-box;
    background: #fff;

    .con {
      width: 100%;
      display: flex;
      position: relative;

      .left {
        position: absolute;
        left: 0;
        top: 0;
        width: 3rem;
        height: 100%;
        display: flex;
        padding-left: 1.313rem;
        align-items: center;

        .icon-member-left {
          color: #000;
          font-weight: bold;
        }
      }

      .right {
        flex: 0 0 calc(100% - 6rem);
        width: calc(100% - 6rem);
        margin: 0 auto;
        color: #000;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        letter-spacing: 0.056rem;
        pointer-events: none;
        text-overflow: ellipsis;
        white-space: normal;
        overflow: hidden;
      }
    }
  }

  .header {
    padding-top: 0.906rem;

    .myname {
      padding-left: 0.969rem;
      font-size: 1rem;
      color: #202020;
      text-align: left;
    }

    .achive {
      padding-top: 0.8rem;
      padding-bottom: 0.969rem;
      display: flex;
      justify-content: space-evenly;

      .item {
        display: flex;
        flex-direction: column;

        .c1 {
          font-size: 1.25rem;
          color: #f15353;
        }

        .c2 {
          margin-top: 0.3rem;
          font-size: 0.813rem;
          color: #333;
        }
      }
    }
  }

  .splt {
    width: 100%;
    height: 0.65rem;
    background-color: #f2f2f2;
  }

  .descContainer {
    padding-left: 0.8rem;
    padding-right: 0.8rem;

    .seat {
      overflow: scroll;
    }

    .descItems {
      margin-top: 1.594rem;
      display: flex;
      overflow: scroll;

      .descItem {
        display: flex;
        flex-direction: column;
        padding-right: 1rem;

        &:last-child {
          padding-right: 0;
        }

        .marketname {
          white-space: nowrap;
          padding: 0 0.2rem;
          height: 1.594rem;
          background-color: #f14e4e;
          border-radius: 0.313rem 0.313rem 0 0;
          border: 0.094rem solid #cb4f47;
          color: #fff;
          font-size: 0.813rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nickname {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #666;
        }

        .price {
          margin-top: 1.2rem;
          color: #333;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .desc {
          margin-top: 0.644rem;
          font-size: 0.875rem;
          color: #333;
          white-space: nowrap;
        }
      }
    }
  }

</style>