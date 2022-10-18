<template>
  <div id="goods">
    <div class="fe-mod fe-mod-8"
         :style="{ backgroundColor: datas.params.bgcolor }">
      <div class="fe-mod-8-title"
           v-show="datas.params.showtitle == 0"
           :style="{
          color: datas.params.titlecolor,
          backgroundColor: datas.params.bgcolor
        }">
        {{ datas.params.title || "请填写商品组标题" }}
      </div>
      <div style="line-height: 10.625rem; text-align: center; color: #999; font-size: 16px;"
           v-show="datas.data == ''">
        一个商品都没有...
      </div>

      <!-- 默认两种样式 -->
      <div v-if="datas.params.style !== 'hp' && datas.params.style !== 'hotel'"
           class="new-goods">
        <div v-for="(good,i) in datas.data"
             :key='i'>
          <div class="fe-mod-8-good good-new"
               :style="{ width: datas.params.style }">
            <a @click.stop.prevent="gotoDetail(good)"
               href="javascript:;">
              <div class="fe-mod-8-main">
                <div class="fe-mod-8-main-img"
                     :class="{
                    oo2: datas.params.style == '50%',
                    oo3: datas.params.style == '33.3%'
                  }"
                     :style="{ backgroundImage:'url('
                     +
                     good.img
                     +')'} ">
                  <!--<img-->
                  <!--:src="good.img"-->
                  <!--class="goodimg"-->
                  <!--width="100%"-->
                  <!--:style="{-->
                  <!--height:-->
                  <!--datas.params.style == '49.5%'-->
                  <!--? '40vw'-->
                  <!--: datas.params.style == '33.3%'-->
                  <!--? '25vw'-->
                  <!--: datas.params.style == '50%'-->
                  <!--? '40vw'-->
                  <!--: '95vw'-->
                  <!--}"-->
                  <!--/>-->
                  <div class="saleimg"
                       :class="[datas.params.option]"></div>
                </div>
                <div class="fe-mod-8-main-name"
                     v-show="datas.params.showname == 1">
                  <div class="fe-mod-8-main-name-name">{{good.name|escapeTitle}}</div>
                </div>

                <div class="card-price"
                     v-show="datas.params.price != 0">
                  {{$i18n.t('money')}}{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.pricenow }}
                  <span style="text-decoration: line-through; font-size: 12px; color: #808080;"
                        v-show="
                      datas.params.price == 3 ||
                        (datas.params.price == 1 &&
                          good.priceold != good.pricenow &&
                          good.priceold > 0)
                    ">{{$i18n.t('money')}}{{ good.priceold }}</span>
                  <div class="fe-mod-8-main-name-buy add-cart"
                       :class="datas.params.buysub"
                       v-show="datas.params.buysub"></div>
                </div>
                <div class="card-price colorBlack"
                     v-show="datas.params.price == 3">
                  会员价：{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.vip_price }}
                </div>
                <div class="card-price"
                     v-if="datas.params.love == 1 && good.award == 1">
                  赠送{{ good.award_proportion }}%{{$store.state.temp.designer.love_name || "爱心值" }}
                </div>
                <div class="card-price"
                     v-else></div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <!-- 横幅样式 -->
      <div v-if="datas.params.style === 'hp'"
           class="new-goods">
        <div v-for="(good,i) in datas.data"
             :key='i'>
          <a @click.stop.prevent="gotoDetail(good)"
             href="javascript:;">
            <div class="fe-mod-8-hp-line">
              <div class="fe-mod-8-hp-line-img">
                <div class="saleimg"
                     :class="[datas.params.option]"></div>
                <img :src="good.img" />
              </div>
              <div class="fe-mod-8-hp-line-info">
                <div class="title">{{ good.name|escapeTitle }}</div>
                <div class="price fe-mod-8-main-name">
                  <div v-show="datas.params.price != 0">
                    <div class="p1"
                         :style="{ color: datas.params.titlecolor }">
                      {{$i18n.t('money')}}{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.pricenow }}
                    </div>

                    <div class="p2"
                         v-show="
                        datas.params.price == 3 || datas.params.price == 1
                      ">
                      <span v-show="parseInt(good.priceold)&&good.priceold!=good.pricenow">{{$i18n.t('money')}}{{ good.priceold }}</span>
                    </div>
                    <div class="p3"
                         v-show="datas.params.price == 3">
                      会员价：{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.vip_price }}
                    </div>
                  </div>
                  <div class="p4"
                       v-if="datas.params.love == 1 && good.award == 1">
                    赠送{{ good.award_proportion }}%{{$store.state.temp.designer.love_name || "爱心值" }}
                  </div>
                  <div class="p3"
                       v-show="good.sales && !good.award_proportion">
                    销量:{{ good.sales }}{{ good.unit }}
                  </div>
                  <div class="fe-mod-8-main-name-buy  buy-1"
                       style="margin-top: 0.375rem;"
                       v-show="datas.params.buysub"
                       :class="[datas.params.buysub]"></div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

export default {
  props: ['datas', 'index'],
  data() {
    return {
      showMore: true
    };
  },
  methods: {
    //商品跳转
    gotoDetail(good) {
      this.$router.push(this.fun.getUrl('goods', { id: good.goodid }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goods {
  .loadMore {
    background: #f5f5f5;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
  }

  .fe-mod-8-hp-line-info .title {
    text-align: left;
  }

  .fe-mod:hover {
    border: 0.125rem dashed rgba(0, 0, 0, 0);
    cursor: default;
  }

  .fe-mod,
  .fe-mod:hover {
    border: 0;
  }

  .fe-mod-cube td {
    height: auto;
  }

  .jiudroom {
    background: #fff;
  }

  .jiudroom li .roomimg {
    position: absolute;
    height: 5.3125rem;
    width: 5.3125rem;
    left: 0.625rem;
  }

  .jiudroom li {
    position: relative;
    padding: 0.625rem 4.375rem 0.625rem 6.5625rem;
    height: 6.625rem;
    border-bottom: 0.0625rem solid #ececec;
    font-size: 12px;
  }

  .jiudroom-price {
    right: 0.625rem;
    top: 0.625rem;
    width: 4.375rem;
    text-align: center;
  }

  .pa {
    position: absolute !important;
  }

  .jiudroom-price ins {
    text-decoration: none;
    font-size: 12px;
    color: #f88917;
  }

  .jiudroom-price del {
    color: #999;
  }

  .jiudroom-text h1 {
    font-size: 16px;
    margin-bottom: 0.875rem;
    height: 1.25rem;
    line-height: 1.25rem;
    width: 100%;
    overflow: hidden;
    font-weight: normal;
    margin-top: -0.0625rem;
  }

  .btnbook {
    background: #f88917;
    border-radius: 0.1875rem;
    color: #fff;
    border: none;
    width: 100%;
    height: 2.125rem;
    line-height: 2.125rem;
    font-size: 14px;
    margin-top: 0.3125rem;
  }

  .fe-mod-8 {
    height: auto;
    overflow: hidden;

    /* padding: 0.3125rem 0; */
    background: #fff;
  }

  .fe-mod-8 a,
  .fe-mod-8 a:hover {
    color: inherit;
    text-decoration: none;
  }

  .fe-mod-8-title {
    padding: 0 0.5rem;
    font-size: 16px;
    color: #666;
    text-align: left;
  }

  .fe-mod-8-good {
    height: auto;
    width: 50%;
    box-sizing: border-box;
    float: left;
  }

  .fe-mod-8-main {
    height: auto;
    padding: 0.3125rem;
    background: #fff;
  }

  .fe-mod-8-main-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    background-size: 100% 100% !important;
    background-position: center;
  }

  .fe-mod-8-main-img.oo2 {
    /* min-height: 43vw; */
    background: #fff;
    position: relative;
    text-align: center;
  }

  .fe-mod-8-main-img.oo2 img {
    width: 100%;
    height: 100%;
  }

  .fe-mod-8-main-img.oo3 {
    // min-height: 25vw;
    position: relative;
    text-align: center;
    width: 100%;
    height: 6.3875rem;
  }

  .fe-mod-8-main-img.oo3 img {
    width: 100%;
    height: 100%;
  }

  .fe-mod-8 .new {
    height: 1.875rem;
    width: 1.875rem;
    background: url(../../assets/images/ico_new.png) no-repeat;
    background-size: 1.875rem;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8 .saleimg {
    height: 3.125rem;
    width: 3.125rem;
    position: absolute;
    top: -0.1875rem;
    left: -0.1875rem;
  }

  .fe-mod-8 .sale-xp {
    background: url(../../assets/images/sale-xp.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-rx {
    background: url(../../assets/images/sale-rx.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-tj {
    background: url(../../assets/images/sale-tj.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-xs {
    background: url(../temp/img/sale-xs.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-by {
    background: url(../temp/img/sale-by.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-cx {
    background: url(../temp/img/sale-cx.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .recom {
    height: 1.875rem;
    width: 1.875rem;
    background: url(../temp/img/ico_recom.png) no-repeat;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8 .hot {
    height: 1.875rem;
    width: 1.875rem;
    background: url(../temp/img/ico_hot.png) no-repeat;
    background-size: 1.875rem;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8-main-name {
    height: auto;
    font-size: 14px;
    text-align: center;
    line-height: 1.25rem;
    color: #999;
    margin-top: 0.3125rem;
  }

  .fe-mod-8-main-name-name {
    height: 2.5rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
  }

  .fe-mod-8-main-name-buy {
    height: 1.25rem;
    width: 1.875rem;
    float: right;
    background-repeat: no-repeat;
  }

  .fe-mod-8 .buy-1 {
    background: url(../temp/img/ico_buy_1.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-2 {
    background: url(../temp/img/ico_buy_2.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-3 {
    background: url(../temp/img/ico_buy_3.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-4 {
    background: url(../temp/img/ico_buy_4.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8-main-price {
    height: 1.5rem;
    width: 100%;
    font-size: 14px;
    text-align: left;
    line-height: 1.5rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
    padding-left: 0.1875rem;
    position: absolute;
    bottom: 0;
    left: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    content: '...';
  }

  .fe-mod-8-hp-line {
    height: 5.625rem;
    background: #fff;
    padding: 0.3125rem;
  }

  .fe-mod-8-hp-line-img {
    height: 5rem;
    width: 5rem;
    background: #ddd;
    float: left;
    position: relative;
  }

  .fe-mod-8-hp-line-img img {
    height: 100%;
    width: 100%;
  }

  .fe-mod-8-hp-line-info {
    height: 5rem;
    background: #fff;
    padding-left: 5.625rem;
  }

  .fe-mod-8-hp-line-info .title {
    height: 2.5rem;
    font-size: 14px;
    color: #333;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .fe-mod-8-hp-line-info .price {
    height: 1.875rem;
    width: 100%;
    margin-top: 0.625rem;
    font-size: 14px;
    color: #bbb;
    line-height: 1.875rem;
    float: left;
    overflow: hidden;
  }

  .fe-mod-8-hp-line-info .price .p1 {
    float: left;
    color: #f60;
  }

  .fe-mod-8-hp-line-info .price .p2 {
    font-size: 12px;
    padding-left: 0.3125rem;
    text-decoration: line-through;
    float: left;
    line-height: 2rem;
  }

  .fe-mod-8-hp-line-info .price .p3 {
    color: #999;
    padding-left: 0.625rem;
    float: left;
    font-size: 12px;
  }

  .fe-mod-8-hp-line-info .price .p4 {
    color: #999;
    padding-left: 0.625rem;
    float: left;
    font-size: 12px;
    width: 5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  .new-goods {
    padding: 0.25rem;
  }

  .card-price {
    color: #f60;
    overflow: hidden;
    position: relative;
    height: 1.25rem;
    text-align: left;
  }

  .colorBlack {
    color: #999;
  }

  .good-new {
    padding: 4px;
  }

  .good-new a {
    border: 0.0625rem solid #e5e5e5;
    display: block;
    background: #fff;
  }

  .add-cart {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .fe-mod-8-hp-line {
    border: 0.0625rem solid #e5e5e5;
    display: block;
    background: #fff;
    margin: 0.3125rem 0;
  }
}
</style>
