<template>
  <div class="page">
    <c-title :hide="false" text="限时优惠"></c-title>

    <div class="listData">
      <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
        <div class="goods" v-for="item in listData" :key="item.id">
          <div class="face">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="container">
            <div class="goods-name">{{item.title}}</div>
            <div class="time">
              活动仅剩
              <van-count-down :time="fun.getTimeDifference(item.end_time)" class="bottom_time" format="DD天HH时mm分ss秒">
                <template #default="timeData">
                  <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }}</em
                  ><b>{{ $i18n.t("天") }}</b> <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }}</em
                  ><b>时</b> <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }}</em
                  ><b>分</b>
                  <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }}</em>
                </template>
              </van-count-down>
            </div>
            <div class="desc">
              <div class="prices">
                <div class="present_price">￥{{item.price}}</div>
                <div class="marke_price" v-if="(item.market_price*1) > (item.price*1)">￥{{item.market_price}}</div>
              </div>
              <div class="btn" @click="gotoTimeGood(item)">立即抢</div>
            </div>
          </div>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import DList from "@/components/dlist";
export default {
  data() {
    return {
      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  components: { DList },
  created() {
    this.getList();
  },
  methods: {
    gotoTimeGood(item){
      this.$router.push(this.fun.getUrl("goods", { id: item.id }));
    },
    getList() {
      $http.get("goods.goods.get-limit-buy-goods", {page_size:10}, "加载中").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        console.log(res.data);
        this.listData = res.data.data;
        this.total_page = res.data.last_page;
        if (this.total_page <= 0) {
          this.total_page = 1;
        }
        if (this.total_page <= this.page) {
          this.loading = true;
          this.isLoadMore = false;
        }
      });
    },

    getMoreData() {
      console.log("执行");
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      // console.log('加载更多启动');
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        //console.log('没了');
      } else {
        this.page += 1;
        let json = {
          page: this.page,
          page_size:10
        };
        $http
          .get("goods.goods.get-limit-buy-goods", json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.data;
              this.listData = this.listData.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
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

<style lang="scss" scoped>
.listData {
  padding: 0.3rem 0.938rem;
  background: #fff;
  .goods {
    display: flex;
    padding: 0.78rem 0;
    text-align: left;

    .face {
      width: 5.938rem;
      height: 5.938rem;
      background-color: #9d9d9d;
      border-radius: 0.313rem;
      img {
        width: 5.938rem;
        height: 5.938rem;
        border-radius: 0.313rem;
      }
    }
    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.625rem;
      .goods-name {
        font-size: 14px;
        font-weight: bold;
        color: #2c2c2c;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .time {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #333333;
        .bottom_time {
          margin-left: 0.2rem;
          em {
            margin-left: 0.206rem;
            display: inline-flex;
            align-items: center;
            min-width: 0.938rem;
            height: 0.938rem;
            padding: 0 0.25rem;
            color: #fff;
            font-size: 11px;
            background-color: #fe5e56;
            border-radius: 0.063rem;
          }
          b {
            margin-left: 0.206rem;
            color: #333333;
            font-size: 12px;
            font-weight: normal;
          }
        }
      }
      .desc {
        display: flex;
        align-items: flex-end;
        .prices {
          flex: 1;
          .present_price {
            font-size: 14px;
            color: #fe5e56;
          }
          .marke_price {
            font-size: 11px;
            color: #565656;
            text-decoration: line-through;
          }
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.063rem;
          height: 1.688rem;
          font-size: 12px;
          color: #ffffff;
          background-color: #fe5e56;
          border-radius: 0.844rem;
        }
      }
    }
  }
}
</style>
