<template>
  <!-- 拼购组件，不是拼团 -->
  <div :style="'background:'+datas.params.bgcolor">
    <div id="rush-buy">
      <!-- 商品组标题 -->
      <h4 :style="'height:1.875rem;text-indent:1.1vw;line-height:1.875rem;font-size:1rem;text-align:left;'+'background:'+datas.params.bgcolor+';'+'color:'+datas.params.titlecolor"
          v-if="datas.params.showtitle == 1?true:false">{{datas.params.title|escapeTitle}}</h4>
      <!-- 单行 -->
      <div class="single-row"
           v-show="datas.params.style=='100%'"
           v-for="(item,i) in datas.data"
 :key='i'  @click.stop.prevent="buy(item)">
        <div class="img"
             :style="{ backgroundImage:'url('
                     +
                     (item.goods_img?item.goods_img:require('../../assets/images/loading.jpg'))
                     +')'} ">
          <!-- <img :src="item.goods_img?item.goods_img:require('../assets/images/loading.jpg')"> -->
          <div class="sale-img"
               :class="datas.params.option"></div>
        </div>
        <ul class="text">
          <li class="title">
            <h2 v-if="showTitle">{{item.goods_title|escapeTitle}}</h2>
          </li>
          <li class="price">
            <span class="left"
                  v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
              <font class="price-a"
                    :style="'color:'+datas.params.titlecolor">
                    <small>{{$i18n.t('money')}}</small>
                    <span v-if="item.vip_level_status&&item.vip_level_status.status==1"
                        style="font-size: 12px !important; text-align: left;">
                        {{ item.vip_level_status.word }}
                    </span>
                    <span v-else>
                        {{ item.min_price }}
                    </span>
              </font>
              <font class="price-b"
                    v-if="!(item.min_price ==  item.max_price)"><small>{{$i18n.t('money')}}</small>{{item.max_price}}</font>
            </span>
            <span class="left"
                  v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
              <font class="price-a"
                    :style="'color:'+datas.params.titlecolor">
                    <small>{{$i18n.t('money')}}</small>
                    <span v-if="item.vip_level_status&&item.vip_level_status.status==1"
                        style="font-size: 12px !important; text-align: left;">
                        {{ item.vip_level_status.word }}
                    </span>
                    <span v-else>
                        {{ item.min_price }}
                    </span>
              </font>
              <!-- <font class="price-b"><small>{{$i18n.t('money')}}</small>128.50</font> -->
            </span>

          </li>
          <li class="rob">
            <span class="left"
                  v-if="datas.params.overage">满<big>{{item.member_request}}</big>人成团</span>
            <button type="button"
                    v-if="!(fun.isTextEmpty(datas.params.buysub))"
                    :class="datas.params.buysub"
                    @click="buy(item)">去开团 ></button>
          </li>
        </ul>
      </div>
      <!-- 双行 -->
      <div class="double-row"
           v-if="datas.params.style=='49.5%'?true:false"
           :style="'background:'+datas.params.bgcolor">
        <dl class="list-box"
            v-for="(item,i) in datas.data" :key='i'
            @click.stop.prevent="buy(item)">
          <dt class="img"
              :style="{ backgroundImage:'url('
                     +
                     (item.goods_img?item.goods_img:require('../../assets/images/loading.jpg'))
                     +')'} ">
            <!-- <img :src="item.goods_img?item.goods_img:require('../assets/images/loading.jpg')"> -->
            <div class="sale-img"
                 :class="datas.params.option"></div>
          </dt>
          <dt class="text">
            <h2 v-if="showTitle">{{item.goods_title|escapeTitle}}</h2>
          <dd class="price"
              v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
            <span class="left"
                  :style="'color:'+datas.params.titlecolor">

                  <div v-if="item.vip_level_status&&item.vip_level_status.status==1"
                    style="font-size: 12px !important; text-align: left !important; line-height: 12px !important;">
                    <small>{{$i18n.t('money')}}</small>{{item.vip_level_status.word}}
                  </div>
                  <span v-else>
                    <small>{{$i18n.t('money')}}</small>{{item.min_price}}
                  </span>
            </span>
            <span class="right"
                  v-if="!(item.min_price ==  item.max_price)"><small>{{$i18n.t('money')}}</small>{{item.max_price}}</span>
          </dd>
          <dd class="price"
              v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
            <span class="left"
                  :style="'color:'+datas.params.titlecolor">
                  <small>{{$i18n.t('money')}}</small>
                  <span v-if="item.vip_level_status&&item.vip_level_status.status==1"
                    style="font-size: 12px; text-align: left; line-height: 12px;">
                    {{item.vip_level_status.word}}
                  </span>
                  <span v-else>
                    {{item.min_price}}
                  </span>
            </span>
            <!-- <span class="right"><small>{{$i18n.t('money')}}</small>228.50</span> -->
          </dd>
          <dd class="rob">
            <span class="left"
                  v-if="datas.params.overage">满<big>{{item.member_request}}</big>人成团</span>
            <button type="button"
                    v-if="!(fun.isTextEmpty(datas.params.buysub))"
                    :class="datas.params.buysub"
                    @click="buy(item)">去开团 ></button>
          </dd>
          </dt>
        </dl>
      </div>
      <!-- 三行 -->
      <div class="three-row"
           v-if="datas.params.style=='33.3%'?true:false"
           :style="'background:'+datas.params.bgcolor">
        <dl class="list-box"
            v-for="(item,i) in datas.data" :key='i'
            @click.stop.prevent="buy(item)">
          <dt class="img">
            <img :src="item.goods_img?item.goods_img:require('../../assets/images/loading.jpg')">
            <div class="sale-img"
                 :class="datas.params.option"></div>
          </dt>
          <dt class="text">
            <h2 v-if="showTitle">{{item.goods_title|escapeTitle}}</h2>
          <dd class="price"
              v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
            <span class="price-a"
                  :style="'color:'+datas.params.titlecolor">
                  <div v-if="item.vip_level_status&&item.vip_level_status.status==1"
                    style="font-size: 12px; text-align: left; line-height: 12px;">
                    <small>{{$i18n.t('money')}}</small>{{item.vip_level_status.word}}
                  </div>
                  <span v-else>
                    <small>{{$i18n.t('money')}}</small>{{item.min_price}}
                  </span>
            </span>
            <span class="price-b"
                  v-if="!(item.min_price ==  item.max_price)"><small>{{$i18n.t('money')}}</small>{{item.max_price}}</span>
          </dd>
          <dd class="price"
              v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
            <span class="price-a"
                  :style="'color:'+datas.params.titlecolor">
                  <small>{{$i18n.t('money')}}</small>
                  <span v-if="item.vip_level_status&&item.vip_level_status.status==1"
                    style="font-size: 12px; text-align: left; line-height: 12px;">
                    {{item.vip_level_status.word}}
                  </span>
                  <span v-else>
                    {{item.min_price}}
                  </span>
            </span>
          </dd>
          <dd class="rob">
            <span class="left"
                  v-if="datas.params.overage">满<big>{{item.member_request}}</big>人成团</span>
          </dd>
          <dd class="button"
              v-if="!(fun.isTextEmpty(datas.params.buysub))"><button type="button"
                    :class="datas.params.buysub"
                    @click="buy(item)">去开团 ></button></dd>
          </dt>
        </dl>
      </div>
      <!-- 横 -->
      <div class="across-row"
           v-if="datas.params.style=='hp'?true:false"
           :style="'background:'+datas.params.bgcolor">
        <div class="list"
             v-for="(item,i) in datas.data" :key='i'
             @click.stop.prevent="buy(item)">
          <div class="img">
            <img :src="item.goods_img?item.goods_img:require('../../assets/images/loading.jpg')">
            <div class="sale-img"
                 :class="datas.params.option"></div>
          </div>
          <ul class="text">
            <h2 v-if="showTitle">{{item.goods_title|escapeTitle}}</h2>
            <li class="price"
                v-if="datas.params.price != '0' && datas.params.price == 1?true:false">
              <span class="price-a"
                    :style="'color:'+datas.params.titlecolor">
                    <small>{{$i18n.t('money')}}</small>
                    <span v-if="item.vip_level_status&&item.vip_level_status.status==1"
                      style="font-size: 12px; text-align: left; line-height: 12px;">
                      {{item.vip_level_status.word}}
                    </span>
                    <span v-else>
                      {{item.min_price}}
                    </span>
              </span>
              <span class="price-b"
                    :style="'color:'+datas.params.titlecolor"
                    v-if="!(item.min_price ==  item.max_price)"><small>{{$i18n.t('money')}}</small>{{item.max_price}}</span>
            </li>
            <li class="price"
                v-if="datas.params.price != '0' && datas.params.price == 2?true:false">
              <span class="price-a"
                    :style="'color:'+datas.params.titlecolor"><small>{{$i18n.t('money')}}</small>{{item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.min_price}}</span>
            </li>
            <li class="rob">
              <span class="left"
                    v-if="datas.params.overage">满<big>{{item.member_request}}</big>人成团</span>
            </li>
            <li class="button"
                v-if="!(fun.isTextEmpty(datas.params.buysub))"><button type="button"
                      :class="datas.params.buysub"
                      @click="buy(item)">去开团 ></button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      default: []
    }
  },
  data() {
    return {};
  },
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
    buy(data) {
      this.$router.push(this.fun.getUrl("groupBuy", { id: data.goods_id, aid: data.activity_id }));
    },
    showTime(time) {
      let nowTime = new Date().getSeconds;
      let beginTime = new Date(time).getSeconds;
      if (nowTime >= beginTime) {
        return true;
      } else {
        return false;
      }
    }
  },
  activated() {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#rush-buy {
  padding: 1px 0;
  // background: none !important;
  .buy-5 {
    border: solid #f15353 0.0625rem !important;
    color: #f15353 !important;
    border-radius: 0.625rem !important;
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
    // border: solid #f15353 0.0625rem !important;
    color: #fff !important;
    border-radius: 0.3125rem !important;
    background-color: red;
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
    background: url(./img/sale-xs.png);
    background-size: 3.125rem;
    height: 3.125rem;
    width: 3.125rem;
    position: absolute;
    top: -0.1875rem;
    left: -0.1875rem;
  }

  .sale-by {
    background: url(./img/sale-by.png);
    background-size: 3.125rem;
    height: 3.125rem;
    width: 3.125rem;
    position: absolute;
    top: -0.1875rem;
    left: -0.1875rem;
  }

  .sale-cx {
    background: url(./img/sale-cx.png);
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
    // margin-bottom: 0.5rem;
    // padding: 0 0.4rem;
    margin: 0.5rem 0.75rem;
    justify-content: space-between;

    .list-box {
      background-color: #fff;
      width: 49%;
      margin-right: 2%;
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
      // margin-bottom: 0.4rem;
      .img {
        height: 0;
        padding-bottom: 100%;
        overflow: hidden;
        background-color: #ccc;
        position: relative;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        // margin: 0.35rem;
        background-size: 100% 100%;

        img {
          width: 100%;
          height: 100%;
        }

        .time-box {
          width: 100%;
          position: absolute;
          min-height: 1.875rem;
          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.4),
              rgba(153, 153, 153, 0.1)
            );
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
        padding: 0.375rem 0.5rem;

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

    .list-box:nth-child(2n) {
      margin-right: 0;
    }
    // .list-box:last-child {
    //   margin-bottom: 0;
    // }
    // .list-box:nth-last-child(2) {
    //   margin-bottom: 0;
    // }
    // .list-box:nth-child(-n + 2) {
    //   margin-top: 0.25rem;
    // }
    // .list-box:nth-child(2n) {
    //   margin-right: 0.25rem;
    //   margin-left: 0;
    // }
  }

  .single-row {
    background-color: #fff;
    border-bottom: solid 0.0625rem #ebebeb;
    // margin: 0 0.5rem 0.5rem;
    //margin-top: 0.5rem;
    margin: 0.5rem 0.75rem;
    border-radius: 0.5rem;

    .img {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      position: relative;
      background-color: #ccc;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      img {
        width: 100%;
        height: 100%;
      }

      .time-box {
        width: 100%;
        position: absolute;
        height: 2.5rem;
        background:
          linear-gradient(
            to top,
            rgba(0, 0, 0, 0.4),
            rgba(153, 153, 153, 0.1)
          );
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
          flex: 3;
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
          color: #fff;
          height: 1.875rem;
          font-size: 14px;
          border-radius: 0.1875rem;
          padding: 0 0.625rem;
        }
      }

      .rob {
        text-align: left;
        line-height: 1.625rem;

        .left {
          big {
            color: #f15353;
          }
        }

        button {
          height: 1.625rem;
          border: none;
          background-color: #f15353;
          color: #fff;
          font-size: 12px;
          border-radius: 0.25rem;
          padding: 0 0.65rem;
          float: right;
        }
      }
    }
  }
  //   --------------------------------
  .three-row {
    margin: 0.5rem 0.75rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // padding: 0 0.25rem;
    dl:nth-child(3n) {
      margin-right: 0;
    }

    dl:nth-child(-n + 3) {
      margin-top: 0;
    }

    dl {
      width: 32%;
      background-color: #fff;
      // margin-top: 1.1vw;
      margin-right: 2%;
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
      overflow: hidden;

      .img {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        position: relative;
        height: 6.625rem;
        background-color: #ccc;
        // margin: 0.25rem;
        img {
          width: 100%;
          height: 100%;
        }

        .time-box {
          width: 100%;
          position: absolute;
          min-height: 1.875rem;
          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.4),
              rgba(153, 153, 153, 0.1)
            );
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
          font-size: 12px;

          .price-a {
            color: #f15353;
            font-size: 14px;
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
    // padding-left: 1.1vw;
    // padding-right: 1.1vw;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    margin: 0.3125rem 0;

    .list:last-child {
      .text {
        border: none;
      }
    }

    .list {
      background-color: #fff;
      display: flex;
      margin-bottom: 0.3rem;

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
          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.4),
              rgba(153, 153, 153, 0.1)
            );
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
        position: relative;
        padding: 0.625rem;
        flex: 1;
        // border-bottom: solid 0.0625rem #ebebeb;
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
          // justify-content: space-between;
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
            padding-left: 0.25rem;
            font-size: 12px;
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
</style>
