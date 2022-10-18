<template>
  <div id="time-limit">
    <div id="rush-buy" :style="'background:'+datas.params.bgcolor">
      <!-- 商品组标题 -->
      <h4 :style="'height:1.875rem;line-height:1.875rem;font-size:1rem;text-align:left;'+'background:'+datas.params.bgcolor+';'+'color:'+datas.params.titlecolor"
          v-if="datas.params.showtitle == 1?true:false">{{datas.params.title|escapeTitle}}</h4>
      <!-- 单行 -->
      <div class="single-row" v-if="datas.params.style=='100%' && showTime(item.start_time)?true:false"
           v-for="(item,i) in datas.data" :key='i' @click.stop.prevent="buy(item)">
        <div class="img" :style="{ backgroundImage:'url('
                     +
                     (item.img?item.img:require('../../assets/images/loading.jpg'))
                     +')'} ">
          <!-- <img :src="item.img?item.img:require('../assets/images/loading.jpg')"> -->
          <div class="sale-img" :class="datas.params.option"></div>
          <div class="time-box" v-if="datas.params.countdown">
            <template v-if="new Date()>new Date(item.start_time)">
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.end_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
            </template>
            <template v-else>
              <div style="font-size: 14px; color: #fff;">距开始:</div>
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.start_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
            </template>
          </div>
        </div>
        <ul class="text">
          <li class="title">
            <h2 v-if="showTitle">{{item.name|escapeTitle}}</h2>
            <span v-if="datas.params.overage">仅剩<big>{{item.stock}}</big>件</span>
          </li>
          <li class="price">
                        <span class="left" v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
                                            <font class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</font>
                                            <font class="price-b" :style="'color:'+datas.params.titlecolor"
                                                  v-if="!(item.pricenow ==  item.priceold)"><small>{{$i18n.t('money')}}</small>{{ item.priceold }}</font>
                                        </span>
            <span class="left" v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
                                            <font class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</font>
              <!-- <font class="price-b"><small>{{$i18n.t('money')}}</small>128.50</font> -->
                                        </span>
            <button type="button" v-if="!(fun.isTextEmpty(datas.params.buysub))" :class="datas.params.buysub"
                    @click="buy(item)">立即抢购
            </button>
          </li>
        </ul>
      </div>
      <!-- 双行 -->
      <div class="double-row" v-if="datas.params.style=='49.5%'?true:false">
        <dl class="list-box" v-for="(item,i) in datas.data" :key='i' v-if="showTime(item.start_time)"
            @click.stop.prevent="buy(item)">
          <dt class="img" :style="{ backgroundImage:'url('
                     +
                     (item.img?item.img:require('../../assets/images/loading.jpg'))
                     +')'} ">
            <!-- <img :src="item.img?item.img:require('../assets/images/loading.jpg')"> -->
            <div class="sale-img" :class="datas.params.option"></div>
            <div class="time-box" v-if="datas.params.countdown">
              <template v-if="new Date()>new Date(item.start_time)">
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.end_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
              <template v-else>
                <div style="font-size: 14px; color: #fff;">距开始:</div>
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.start_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
            </div>
          </dt>
          <dt class="text">
            <h2 v-if="showTitle">{{item.name|escapeTitle}}</h2>
          <dd class="price" v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
            <span class="left" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
            <span class="right" :style="'color:'+datas.params.titlecolor" v-if="!(item.pricenow ==  item.priceold)"><small>{{$i18n.t('money')}}</small>{{item.priceold}}</span>
          </dd>
          <dd class="price" v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
            <span class="left" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
            <!-- <span class="right"><small>{{$i18n.t('money')}}</small>228.50</span> -->
          </dd>
          <dd class="rob">
            <span class="left" v-if="datas.params.overage">仅剩<big>{{item.stock}}</big>件</span>
            <button type="button" v-if="!(fun.isTextEmpty(datas.params.buysub))" :class="datas.params.buysub"
                    @click="buy(item)">立即抢购a
            </button>
          </dd>
          </dt>
        </dl>
      </div>
      <!-- 三行 -->
      <div class="three-row" v-if="datas.params.style=='33.3%'?true:false">
        <dl class="list-box" v-for="(item,i) in datas.data" :key='i' v-if="showTime(item.start_time)"
            @click.stop.prevent="buy(item)">
          <dt class="img" :style="{ backgroundImage:'url('
                     +
                     (item.img?item.img:require('../../assets/images/loading.jpg'))
                     +')'} ">
            <!-- <img :src="item.img?item.img:require('../assets/images/loading.jpg')"> -->
            <div class="sale-img" :class="datas.params.option"></div>
            <div class="time-box" v-if="datas.params.countdown">
              <template v-if="new Date()>new Date(item.start_time)">
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.end_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
              <template v-else>
                <div style="font-size: 14px; color: #fff;">距开始:</div>
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.start_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
            </div>
          </dt>
          <dt class="text">
            <h2 v-if="showTitle">{{item.name|escapeTitle}}</h2>
          <dd class="price" v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
            <span class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
            <!-- <span class="price-b" :style="'color:'+datas.params.titlecolor" v-if="!(item.pricenow ==  item.priceold)"><small>{{$i18n.t('money')}}</small>{{item.priceold}}</span> -->
          </dd>
          <dd class="price" v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
            <span class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
          </dd>
          <dd class="rob">
            <span class="left" v-if="datas.params.overage">仅剩<big>{{item.stock}}</big>件</span>
          </dd>
          <dd class="button" v-if="!(fun.isTextEmpty(datas.params.buysub))">
            <button type="button" :class="datas.params.buysub" @click="buy(item)">立即抢购</button>
          </dd>
          </dt>
        </dl>
      </div>
      <!-- 横 -->
      <div class="across-row" v-if="datas.params.style=='hp'?true:false">
        <div class="list" v-for="(item,i) in datas.data" :key='i' v-if="showTime(item.start_time)" @click.stop.prevent="buy(item)">
          <div class="img">
            <img :src="item.img?item.img:require('../../assets/images/loading.jpg')">
            <div class="sale-img" :class="datas.params.option"></div>

            <div class="time-box" v-if="datas.params.countdown">
              <template v-if="new Date()>new Date(item.start_time)">
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.end_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
              <template v-else>
                <div style="font-size: 14px; color: #fff;">距开始:</div>
                <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(item.start_time))" class="bottom_time" format="DD天HH时mm分ss秒"></van-count-down>
              </template>
            </div>
          </div>
          <ul class="text">
            <h2 v-if="showTitle">{{item.name|escapeTitle}}</h2>
            <li class="price" v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
              <span class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
              <span class="price-b" :style="'color:'+datas.params.titlecolor" v-if="!(item.pricenow ==  item.priceold)"><small>{{$i18n.t('money')}}</small>{{item.priceold}}</span>
            </li>
            <li class="price" v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
              <span class="price-a" :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow}}</span>
            </li>
            <li class="rob">
              <span class="left" v-if="datas.params.overage">仅剩<big>{{item.stock}}</big>件</span>
            </li>
            <li class="button" v-if="!(fun.isTextEmpty(datas.params.buysub))">
              <button type="button" :class="datas.params.buysub" @click="buy(item)">立即购买</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div v-if="showMore">-->
      <!--<div class="loadMore"-->
           <!--v-if="$store.state.temp.item.data[index].isLoadMore || isLoadMore"-->
           <!--@click="getMoreData">-->
        <!--加载更多-->
      <!--</div>-->
      <!--<div class="loadMore"-->
           <!--v-if="-->
            <!--!$store.state.temp.item.data[index].isLoadMore &&-->
              <!--!isLoadMore &&-->
              <!--datas.Identification === 1-->
          <!--">-->
        <!--没有更多了~~-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  props: ["datas", "index"],
  data() {
    return {
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,
      showMore: true
    };
  },
  mounted() {
    this.total_page = Math.ceil(this.datas.total / 12);
    // 判断商品组件mounted的时候是否需要加载更多
    // this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
  },
  activated() {
    this.total_page = Math.ceil(this.datas.total / 12);
    // this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
  },
  // watch: {
  //   total_page() {
  //     let data = { index: this.index };
  //     this.page >= this.total_page
  //       ? (data.isLoadMore = false)
  //       : (data.isLoadMore = true);
  //     this.$store.commit("setLoadMore", data);
  //   },
  //   page() {
  //     let data = { index: this.index };
  //     this.page >= this.total_page
  //       ? (data.isLoadMore = false)
  //       : (data.isLoadMore = true);
  //     this.$store.commit("setLoadMore", data);
  //   }
  // },
  computed: {
    showTitle() {
      if (this.datas.params.showname == "0") {
        return false;
      } else if (this.datas.params.showname == "1") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    buy(obj) {
      this.$router.push(this.fun.getUrl("goods", {
        id: obj.goodid
      }));
    },
    showTime(time) {
      let nowTime = new Date().getSeconds;
      let beginTime = new Date(time).getSeconds;
      if (nowTime >= beginTime) {
        return true;
      } else {
        return false;
      }
    },
    // 获取更多数据
    getMoreData() {
      const that = this;
      let data = { index: this.index, isLoadMore: false };
      that.isLoadMore = false;
      this.$store.commit("setLoadMore", data); // 防止多次请求分页数据
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page = that.page + 1;
        $http
          .get(
            "home-page.get-page-goods",
            {
              page: that.page,
              group_id: that.datas.id
            },
            "加载中"
          )
          .then((response) => {
            // that.isLoadMore = true;
            if (response.result === 1) {
              var myData = { data: response.data.data, index: that.index };
              that.$store.commit("setMoreData", myData);
              // that.datas.data = that.datas.data.concat(myData);//数组拼接
            } else {
              that.page = that.page - 1;
              let data = { index: that.index, isLoadMore: false };
              that.$store.commit("setLoadMore", data);
            }
          }, (response) => {
            console.error(response);
            // error callback
          }
          );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #time-limit {
    .loadMore {
      background: #f5f5f5;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      clear: both;
    }
  }

  #rush-buy {
    margin-top: 0.625rem;

    /* background: none !important; */
    .buy-5 {
      border: solid #f15353 0.0625rem !important;
      color: #f15353 !important;
      border-radius: 0.625rem;
      background-color: #fff !important;
    }

    .buy-6 {
      border: solid #f15353 0.0625rem !important;
      color: #fff !important;
      border-radius: 0.625rem !important;
      background-color: red !important;
    }

    .buy-7 {
      border: solid #f15353 0.0625rem !important;
      color: #f15353 !important;
      border-radius: 0.3125rem !important;
      background-color: #fff !important;
    }

    .buy-8 {
      border: solid #f15353 0.0625rem !important;
      color: #fff !important;
      border-radius: 0.3125rem !important;
      background-color: red !important;
    }

    .sale-xp {
      background: url(../../assets/images/sale-xp.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    .sale-rx {
      background: url(../../assets/images/sale-rx.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    .sale-tj {
      background: url(../../assets/images/sale-tj.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    .sale-xs {
      background: url(../temp/img/sale-xs.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    .sale-by {
      background: url(../temp/img/sale-by.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    .sale-cx {
      background: url(../temp/img/sale-cx.png);
      background-size: 3.125rem;
      height: 3.125rem;
      width: 3.125rem;
      position: absolute;
      top: -0.1875rem;
      left: -0.1875rem;
    }

    h2 {
      font-weight: normal;
    }

    .double-row {
      display: flex;
      flex-wrap: wrap;

      .list-box {
        margin-right: 1.2%;
        margin-bottom: 0.3rem;
        background-color: #fff;
        width: 49.4%;

        .img {
          height: 0;
          padding-bottom: 100%;
          overflow: hidden;
          background-color: #ccc;
          position: relative;
          background-size: 100% 100%;

          img {
            width: 100%;
            height: 100%;
          }

          .time-box {
            width: 100%;
            position: absolute;
            min-height: 1.875rem;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(153, 153, 153, 0.1));
            bottom: 0;
            text-align: left;
            padding: 0 0.625rem;

            span {
              color: #fff;
              line-height: 1.875rem;
              font-size: 14px;
              text-align: left;
            }
          }
        }

        .text {
          padding: 0.375rem;

          h2 {
            line-height: 1.25rem;
            height: 2.5rem;
            font-size: 14px;
            text-align: left;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .price {
            line-height: 1.5rem;
            display: flex;
            justify-content: space-between;
            font-size: 16px;

            .left {
              color: #f15353;
              font-weight: bold;
              font-size: 18px;
            }

            .right {
              font-size: 14px;
              text-decoration: line-through;
              color: #8c8c8c;
            }

            small {
              font-size: 12px;
            }
          }

          .rob {
            line-height: 1.5rem;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #8c8c8c;

            .left {
              big {
                color: #f15353;
                font-size: 14px;
              }
            }

            button {
              background-color: #f15353;
              color: #fff;
              font-size: 12px; //border-radius: 0.1875rem;
              height: 1.625rem;
              border-radius: 0.25rem;
              padding: 0 0.375rem;
              display: inline-block;
              border: none;
            }
          }
        }
      }

      .list-box:last-child {
        margin-bottom: 0;
      }

      .list-box:nth-last-child(2) {
        margin-bottom: 0;
      }

      .list-box:nth-child(2n) {
        margin-right: 0;
      }
    }

    .single-row {
      background-color: #fff;
      //margin-top: 0.5rem;
      .img {
        position: relative;
        background-color: #ccc;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        overflow: hidden;
        background-size: 100% 100%;

        img {
          width: 100%;
          height: 100%;
        }

        .time-box {
          width: 100%;
          position: absolute;
          height: 2.5rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(153, 153, 153, 0.1));
          bottom: 0;
          text-align: left;
          padding: 0 0.625rem;

          span {
            color: #fff;
            line-height: 2.5rem;
            font-size: 1rem;
            text-align: left;
          }
        }
      }

      .text {
        padding: 0.375rem 0.625rem;

        .title {
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          h2 {
            flex: 2;
            font-size: 16px;
            line-height: 1.5rem;
            height: 3rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-align: left;
          }

          span {
            text-align: right;
            flex: 1;
            font-size: 16px;

            big {
              font-size: 20px;
              color: #f15353;
            }
          }
        }

        .price {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-top: 0.625rem;

          .left {
            font-size: 18px;
            color: #f15353;
            line-height: 1.625rem;

            small {
              font-size: 12px;
            }

            .price-b {
              margin-left: 0.625rem;
              color: #999;
              text-decoration: line-through;
              font-size: 14px;
            }
          }

          button {
            border: none;
            //background-color: #f15353;
            color: #f15353;
            height: 1.875rem;
            font-size: 14px;
            border-radius: 0.1875rem;
            padding: 0 0.625rem;
          }
        }
      }
    }

    .three-row {
      margin-bottom: 0.625rem;
      //margin-top: 0.625rem;
      display: flex;
      flex-wrap: wrap;

      dl:nth-child(3n) {
        margin-right: 0;
      }

      dl {
        width: 32.6%;
        background-color: #fff;
        margin-right: 1.1%;

        .img {
          position: relative;
          height: 0;
          padding-bottom: 100%;
          background-size: 100% 100%;
          background-color: #ccc;

          img {
            width: 100%;
            height: 100%;
          }

          .time-box {
            width: 100%;
            position: absolute;
            min-height: 1.875rem;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(153, 153, 153, 0.1));
            bottom: 0;
            text-align: left;
            padding: 0 0.25rem;

            span {
              color: #fff;
              line-height: 1.875rem;
              font-size: 12px;
              text-align: left;
            }
          }
        }

        .text {
          padding: 0.375rem;

          h2 {
            text-align: left;
            font-size: 12px;
            line-height: 1.125rem;
            height: 2.25rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .price {
            line-height: 1.5rem;
            display: flex;
            justify-content: space-between;
            font-size: 14px;

            .price-a {
              color: #f15353;
            }

            .price-b {
              color: #999;
              text-decoration: line-through;
            }

            small {
              font-size: 12px;
            }
          }

          .rob {
            text-align: left;
            line-height: 1.5rem;

            .left {
              big {
                color: #f15353;
              }
            }
          }

          .button {
            button {
              width: 100%;
              height: 1.625rem;
              border: none;
              background-color: #f15353;
              color: #fff;
              font-size: 12px;
              border-radius: 0.25rem;
              padding: 0 0.25rem;
            }
          }
        }
      }
    }

    .across-row {
      //margin-top: 0.625rem;
      .list {
        background-color: #fff;
        display: flex;

        .img {
          width: 8.75rem;
          height: 8.75rem;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            padding: 0.375rem;
          }

          .time-box {
            width: 92%;
            position: absolute;
            min-height: 1.875rem;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(153, 153, 153, 0.1));
            bottom: 0.375rem;
            left: 0.375rem;
            text-align: center;

            span {
              color: #fff;
              line-height: 1.875rem;
              font-size: 14px;
              text-align: left;
            }
          }
        }

        .text {
          width: auto;
          flex: 1;
          position: relative;
          padding: 0.625rem;
          border-bottom: solid 0.0625rem #ebebeb;

          h2 {
            line-height: 1.5rem;
            height: 3rem;
            text-align: left;
            font-size: 16px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .price {
            line-height: 1.875rem;
            display: flex;
            justify-content: space-between;
            font-size: 16px;

            small {
              font-size: 12px;
            }

            .price-a {
              color: #f15353;
            }

            .price-b {
              color: #999;
              text-decoration: line-through;
            }
          }

          .rob {
            position: absolute;
            bottom: 0.625rem;
            font-size: 14px;
            line-height: 1.5rem;
            text-align: left;

            big {
              color: #f15353;
            }
          }

          .button {
            position: absolute;
            bottom: 0.625rem;
            right: 0.625rem;
            text-align: left;

            button {
              border: none;
              background-color: #f15353;
              color: #fff;
              border-radius: 0.25rem;
              padding: 0.375rem 0.75rem;
            }
          }
        }
      }
    }
  }

  .van-count-down {
    color: #fff;
  }
</style>
