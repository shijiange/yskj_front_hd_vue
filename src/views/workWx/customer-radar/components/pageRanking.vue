<template>
  <div class="page-ranking">
    <h1 class="block-title">访问次数最多页面排名</h1>
      <van-row gutter="20" class="th">
        <van-col span="4">排名</van-col>
        <van-col span="14">页面</van-col>
        <van-col span="6">访问次数</van-col>
      </van-row>
    <div class="rank-table">
      <van-row gutter="20" align="center" class="tr" v-for="(item, index) in rankList" :key="index">
        <van-col span="4">
          <span class="ranking">{{index>2 ? index+1 : ''}}</span>
        </van-col>
        <van-col span="14" @click="toLink(item)">
          <div v-if="item.type == 'goods'" class="goods-box">
            <img class="goods-img" :src="item.thumb" alt="">
            <div style="text-align: left;">
              <p class="goods-title van-multi-ellipsis--l2">{{ item.title }}</p>
              <p class="goods-price">{{ $i18n.t('money') }}{{ item.price }}</p>
            </div>
          </div>
          <div v-else-if="item.type == 'artice'" class="goods-box">
            <img class="goods-img" :src="item.thumb" alt="">
            <div style="text-align: left;">
              <p class="goods-title van-multi-ellipsis--l2">{{ item.title }}</p>
              <p class="goods-price">{{ $i18n.t('money') }}{{ item.author }}</p>
            </div>
          </div>
          <span v-else :href="item.url" class="page-link">{{item.url}}</span>
        </van-col>
        <van-col span="6">{{ item.total }}</van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rankList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    };
  },

  methods: {
    toLink(item) {
      let openType = ["wap", "wechat", "pc"];
      if (openType.includes(item.port_type)) {
        window.location.href = item.url;
      }
    }
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.page-ranking {
  padding: 5%;
  .block-title {
    color: #202020;
    text-align: left;
    font-weight: bold;
    font-size: 18px;
  }
  .th {
    padding: 1rem 0.325rem;
    padding-bottom: 0;
    white-space: nowrap;
  }
  .rank-table {
    margin-top: 1rem;
    cursor: default;

    .tr {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.325rem;
      border-radius: 0.188rem;
    }
    .tr:nth-of-type(odd){
      background-color: rgba(174, 189, 202, 0.2);
    }
    .tr:nth-of-type(even){
      background-color: #ffffff;
    }

    .ranking {
      display: inline-block;
      width: 1.125rem;
      height: 1.406rem;
      text-align: center;
      background-size: contain;
    }
    .tr:nth-child(1) .ranking {
      background-image: url("../../../../assets/images/workWx/first_medal.png");
    }
    .tr:nth-child(2) .ranking {
      background-image: url("../../../../assets/images/workWx/second_medal.png");
    }
    .tr:nth-child(3) .ranking {
      background-image: url("../../../../assets/images/workWx/third_medal.png");
    }
    .page-link {
      display: inline-block;
      font-size: 0.65rem;
      color: #222222;
      text-align: left;
      word-break: break-all;
    }

    .goods-box {
      display: flex;
      align-items: center;
      align-content: space-between;
      .goods-img {
        width: 2.406rem;
        height: 2.406rem;
        margin: 0;
        margin-right: 0.5rem;
        border-radius: 0.188rem;
      }
      .goods-title {
        font-size: 0.75rem;
        color: #222222;
        margin-bottom: 0.5rem;
      }
      .goods-price {
        font-size: 0.75rem;
        color: #ee2525;
      }
    }
  }
}
</style>