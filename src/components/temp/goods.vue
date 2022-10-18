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
      <div v-if="datas.params.style !== 'hp' && datas.params.style !== 'hotel' && $store.state.temp.item.data[index]"
           class="new-goods">
        <div v-for="(good,i) in $store.state.temp.item.data[index].data"
             :key="i"  v-if="(datas.params.lowershelf&&datas.params.lowershelf==1)?true:good.stock_status==0||good.stock_status==1" :class="[(datas.params.style=='100%'?'width100':((datas.params.style=='50%'||datas.params.style=='49.5%')?'width50':'width33'))]">
          <div class="fe-mod-8-good good-new"
               :style="{
                 width: datas.params.style=='100%'?'98%':(datas.params.style=='50%'||datas.params.style=='49.5%')?'49%':'32%'
               }">
            <a @click.stop.prevent="gotoDetail(good)"
               href="javascript:;" style="position: relative;">
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
                  <!-- <img :src="
                     good.img"
                     class="goodimg"
                     width="100%" /> -->
                  <!-- :style="{
                      height:
                        datas.params.style == '49.5%'
                          ? '40vw'
                          : datas.params.style == '33.3%'
                          ? '25vw'
                          : datas.params.style == '50%'
                          ? '40vw'
                          : '95vw'
                    }" -->
                  <div class="saleimg"
                       :class="[datas.params.option]"></div>
                </div>
                <div class="fe-mod-8-main-name"
                     v-show="datas.params.showname == 1">
                  <div class="fe-mod-8-main-name-name">{{good.name|escapeTitle}}</div>
                </div>
                <!-- vip_level_status为价格权限字段，status为1则无权限查看商品价格 -->
                <div class="card-price"
                     :class="!(datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%')?'spce':''"
                     v-show="datas.params.price != 0">
                  <span v-if="!(datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%')"></span>{{$i18n.t('money')}}{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.pricenow }}
                  <div>
                    <span style="text-decoration: line-through; font-size: 12px; color: #808080;"
                          :class="!(datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%')?'block':''"
                          v-if="datas.params.price == 3 ||(datas.params.price == 1 &&good.priceold != good.pricenow &&good.priceold > 0)"><span v-if="!(datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%')"></span>
                      <span v-if="parseInt(good.priceold)">{{$i18n.t('money')}}{{ good.priceold }}</span><span v-if="!parseInt(good.priceold)" style="display: inline-block;"></span>
                    </span>
                    <span class="card-price colorBlack spce" v-else> </span>
                  </div>
                  <div class="fe-mod-8-main-name-buy add-cart"
                       :class="datas.params.buysub"
                       v-show="datas.params.buysub"></div>
                </div>
                <div class="card-price colorBlack"
                     :class="!(datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%')?'spce':''"
                     v-show="datas.params.price == 3">
                  <span v-if="datas.params.style=='100%'||datas.params.style=='50%'||datas.params.style=='49.5%'">会员价</span><span v-else>会</span>:<span>{{$i18n.t('money')}}</span>{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.price_level==1?good.vip_price:good.vip_next_price }}
                </div>
                <div class="card-price"
                     v-if="datas.params.love == 1 && good.award == 1 && (!good.vip_level_status || (good.vip_level_status && good.vip_level_status.status==0))">
                  赠送{{ good.award_proportion }}%{{$store.state.temp.designer.love_name || "爱心值" }}
                </div>
                <div class="card-price"
                     v-else></div>
              </div>
              <div class="statusShow">
                <div v-if="good.stock_status==1" class="statusShowLi">{{$i18n.t('售罄')}}  </div>
                <div v-if="good.stock_status==2" class="statusShowLi">{{$i18n.t('已下架')}}</div>
                <div v-if="good.stock_status==3" class="statusShowLi">{{$i18n.t('不存在')}}</div>
                <div v-if="good.stock_status==4" class="statusShowLi">{{$i18n.t('不存在')}}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <!-- 横幅样式 -->
      <div v-if="datas.params.style === 'hp' && $store.state.temp.item.data[index]"
           class="new-goods">
        <div v-for="(good,i) in $store.state.temp.item.data[index].data"
             :key="i" v-if="(datas.params.lowershelf&&datas.params.lowershelf==1)?true:good.stock_status==0||good.stock_status==1">
          <a @click.stop.prevent="gotoDetail(good)"
             href="javascript:;" style="position: relative;">
            <div class="fe-mod-8-hp-line">
              <div class="fe-mod-8-hp-line-img">
                <div class="saleimg"
                     :class="[datas.params.option]"></div>
                <img v-lazy="good.img" />
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
                      会员价：<span>{{$i18n.t('money')}}</span>{{ good.vip_level_status&&good.vip_level_status.status==1?good.vip_level_status.word:good.price_level==1?good.vip_price:good.vip_next_price }}
                    </div>
                  </div>
                  <div class="p4"
                       v-if="datas.params.love == 1 && good.award == 1 && (!good.vip_level_status || (good.vip_level_status && good.vip_level_status.status==0))">
                    赠送{{ good.award_proportion }}%{{$store.state.temp.designer.love_name || "爱心值" }}
                  </div>
                  <div class="p3"
                       v-show="good.sales && datas.params.love != 1&&datas.params.price != 3">
                    销量:{{ good.sales }}{{ good.unit }}
                  </div>
                  <div class="fe-mod-8-main-name-buy  buy-1"
                       style="margin-top: 0.375rem;"
                       v-show="datas.params.buysub"
                       :class="[datas.params.buysub]"></div>
                </div>
              </div>
            </div>
            <div class="statusShow">
              <div v-if="good.stock_status==1" class="statusShowLi">{{$i18n.t('售罄')}}  </div>
              <div v-if="good.stock_status==2" class="statusShowLi">{{$i18n.t('已下架')}}</div>
              <div v-if="good.stock_status==3" class="statusShowLi">{{$i18n.t('不存在')}}</div>
              <div v-if="good.stock_status==4" class="statusShowLi">{{$i18n.t('不存在')}}</div>
            </div>
          </a>
        </div>
      </div>
      <!--酒店样式2 -->
      <div v-if="datas.params.style === 'hotel'">
        <div id="checkinout"
             style="border: 0.0625rem solid #ccc;">
          <a id="selinTime"
             style="font-weight: normal; display: block; height: 2.5rem; line-height: 2.5rem; padding: 0 0; background: #fff;"
             :href="datas.sessionurl">
            <div style="float: left; width: 40%;">
              <span style="background: #f5f5f5; display: block; float: left; height: 2.5rem; width: 3.75rem; color: #999; padding: 0 0.3125rem 0 0.625rem;">入住:&nbsp;</span>
              <span id="CheckInDay"
                    style="float: left; display: block; padding-left: 0.375rem;">xxxx</span>
            </div>
            <div style="float: left; width: 40%;">
              <span style="background: #f5f5f5; display: block; float: left; height: 2.5rem; width: 3.75rem; color: #999; padding: 0 0.3125rem 0 0.625rem;">退房:&nbsp;</span>
              <span id="CheckInDay1"
                    style="float: left; display: block; padding-left: 0.375rem;">xxxxx
              </span>
            </div>
            <div style="float: left; width: 20%; background: #f5f5f5;">
              <span class="span2"
                    style="margin-left: 0.625rem; padding-right: 0.625rem;"
                    id="CheckOutDay">住:<span style=" color: #f00; padding: 0 0.1875rem;">xxx</span>晚
              </span>
            </div>
          </a>
        </div>
        <template v-if="$store.state.temp.item.data[index]">
          <div v-for="(good,i) in $store.state.temp.item.data[index].data"
               :key="i"
               style="height: 6.875rem;" v-if="(datas.params.lowershelf&&datas.params.lowershelf==1)?true:good.stock_status==0||good.stock_status==1">
            <ul class="jiudroom"
                style="height: 6.875rem;">
              <li style="position: relative;">
                <!-- <router-link :to="{ name: 'goods', params: { id: good.goodid },query:{i:toi,mid:mid}}">
                <img :src="good.img" alt="" class="roomimg">
                </router-link> -->
                <a @click.stop.prevent="gotoDetail(good)"
                   href="javascript:;">
                  <img v-lazy="good.img"
                       alt=""
                       class="roomimg" />
                </a>
                <div class="jiudroom-text"
                     style="height: 4.75rem; overflow: hidden;">
                  <h1 style="font-size: 16px; color: #333;">{{ good.name|escapeTitle }}</h1>
                  <span v-for="(prams,i) in good.pram"
                        style="height: 6.875rem;"
                        :key="i">
                    <p>{{ prams.title }}:{{ prams.value }}</p>
                  </span>
                </div>
                <div class="jiudroom-price pa">
                  <ins>{{$i18n.t('money')}}<i>{{ good.todayoprice }}</i></ins>
                  <del>{{$i18n.t('money')}}{{ good.todaycprice }}</del>
                  <div v-show="good.has == '0'">
                    <a style="display: block; color: #fff;"
                       :href="good.url"
                       class="btnbook">预定</a>
                  </div>
                  <div v-show="good.has != '0'">
                    <button class="btnbook"
                            style="background: #aaa; color: #fff;">
                      预定
                    </button>
                  </div>
                </div>
                <div class="statusShow">
                  <div v-if="good.stock_status==1" class="statusShowLi">{{$i18n.t('售罄')}}  </div>
                  <div v-if="good.stock_status==2" class="statusShowLi">{{$i18n.t('已下架')}}</div>
                  <div v-if="good.stock_status==3" class="statusShowLi">{{$i18n.t('不存在')}}</div>
                  <div v-if="good.stock_status==4" class="statusShowLi">{{$i18n.t('不存在')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>

      <div>
        <div class="loadMore"
             v-if="$store.state.temp.item.data[index] && $store.state.temp.item.data[index].isLoadMore || isLoadMore"
             @click="getMoreData">
          {{ $i18n.t("加载更多") }}
        </div>
        <div class="loadMore"
             v-if="$store.state.temp.item.data[index] && !$store.state.temp.item.data[index].isLoadMore &&
              !isLoadMore &&
              datas.Identification === 1
          ">
          {{ $i18n.t("没有更多了") }}~~
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { Toast } from 'vant';
const documentElement = document.documentElement;
const body = document.body;
var isDone = false;  //页面是否已经渲染
var self;
var isClick = 0;
export default {
  props: ["datas", "index"],
  data() {
    return {
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,
    };
  },
  mounted() {
    this.total_page = Math.ceil(this.datas.total / 12);
    if(this.total_page > 1) {
      this.$store.state.temp.item.data[this.index].isLoadMore = true;
    }
    // 判断商品组件mounted的时候是否需要加载更多
    this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    self = this;
    if (!isDone && this.datas.Identification === 1) {
      document.addEventListener("touchmove", this.handleScroll, false);
      isDone = true;
    }
  },
  activated() {
    this.total_page = Math.ceil(this.datas.total / 12);
    if(this.total_page > 1 && (this.page < this.total_page)) {
      this.$store.state.temp.item.data[this.index].isLoadMore = true;
    }
    if(this.$store.state.temp.item.data[this.index]) {
      this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    }

    if (!isDone && this.datas.Identification === 1) {
      document.addEventListener("touchmove", this.handleScroll, false);
      isDone = true;
    }
  },
  deactivated() {
    if (isDone && this.datas.Identification === 1) {
      document.removeEventListener("touchmove", this.handleScroll, false);
      isDone = false;
    }
  },
  watch: {
    total_page() {
      let data = { index: this.index };
      this.page >= this.total_page
        ? (data.isLoadMore = false)
        : (data.isLoadMore = true);
      this.$store.commit("setLoadMore", data);
    },
    page() {
      let data = { index: this.index };
      this.page >= this.total_page
        ? (data.isLoadMore = false)
        : (data.isLoadMore = true);
      this.$store.commit("setLoadMore", data);
    }
  },
  methods: {
    //商品跳转
    gotoDetail(good) {
      let url = good.plugin_id == 69 ? 'grab_group' : 'goods'
;
      this.$router.push(this.fun.getUrl(url, { id: good.goodid }));
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 105) >= this.getScrollHeight()) {
        //此处发起请求
        if (typeof self.$store.state.temp.item.data[self.index].isLoadMore === "undefined") {
          self.$store.state.temp.item.data[self.index].isLoadMore = true;
        }
        if (self.$store.state.temp.item.data[self.index].isLoadMore && isClick === 0) {
          self.getMoreData();
          isClick = 1;
        } else {
          self.isLoadMore = self.$store.state.temp.item.data[self.index].isLoadMore;
          console.log("没有数据了");
        }
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
            })
          .then(
            function(response) {
              // that.isLoadMore = true;
              isClick = 0;
              if (response.result === 1) {
                let myData = { data: response.data.data, index: that.index };
                that.$store.commit("setMoreData", myData);
                // that.datas.data = that.datas.data.concat(myData);//数组拼接
              } else {
                that.page = that.page - 1;
                let data = { index: that.index, isLoadMore: false };
                that.$store.commit("setLoadMore", data);
              }
            },
            function(response) {
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
  #goods {
    .statusShow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;

      .statusShowLi {
        height: 2.5rem;
        background-color: rgba(0, 0, 0, 0.3);
        line-height: 2.5rem;
        text-align: center;
        color: #fff;
        font-size: 0.8rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
    }

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
      // background: #fff;
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
      // padding: 0.3125rem;
      // background: #fff;
    }

    .fe-mod-8-main-img {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
      background-size: 100% 100% !important;
      background-position: center;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    .fe-mod-8-main-img.oo2 {
      // min-height: 43vw;
      background: #fff;
      position: relative;
      text-align: center;
      width: 100%;
      height: 9.375rem;
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
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
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
      background: url(./img/sale-xs.png);
      background-size: 3.125rem;
    }

    .fe-mod-8 .sale-by {
      background: url(./img/sale-by.png);
      background-size: 3.125rem;
    }

    .fe-mod-8 .sale-cx {
      background: url(./img/sale-cx.png);
      background-size: 3.125rem;
    }

    .fe-mod-8 .recom {
      height: 1.875rem;
      width: 1.875rem;
      background: url(./img/ico_recom.png) no-repeat;
      position: absolute;
      top: -0.0625rem;
      left: -0.0625rem;
    }

    .fe-mod-8 .hot {
      height: 1.875rem;
      width: 1.875rem;
      background: url(./img/ico_hot.png) no-repeat;
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
      margin: 0 0.5rem;
    }

    .fe-mod-8-main-name-buy {
      height: 1.25rem;
      width: 1.875rem;
      float: right;
      background-repeat: no-repeat;
    }

    .fe-mod-8 .buy-1 {
      background: url(./img/ico_buy_1.png);
      background-size: 1.875rem 1.25rem;
    }

    .fe-mod-8 .buy-2 {
      background: url(./img/ico_buy_2.png);
      background-size: 1.875rem 1.25rem;
    }

    .fe-mod-8 .buy-3 {
      background: url(./img/ico_buy_3.png);
      background-size: 1.875rem 1.25rem;
    }

    .fe-mod-8 .buy-4 {
      background: url(./img/ico_buy_4.png);
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
      content: "...";
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
      // padding: 0.25rem;
      width: calc(98% - 1rem);
      float: left;
      margin: 0.5rem 0.75rem;
      border-radius: 0.5rem;

      .width100 .good-new {
        margin-right: 0;
      }

      .width50 .good-new {
        margin-right: 2%;
      }

      .width50:nth-child(2n) .good-new {
        margin-right: 0;
      }

      .width33 .good-new {
        margin-right: 2%;
      }

      .width33:nth-child(3n) .good-new {
        margin-right: 0;
      }
    }

    .card-price {
      color: #f60;
      overflow: hidden;
      position: relative;
      text-align: left;
      margin: 0 0.5rem;
      line-height: 18px;
    }

    .colorBlack {
      color: #999;
    }

    .good-new {
      // padding: 4px;
      // margin-right:2%;
      margin-bottom: 2%;
      border-radius: 0.5rem;
    }

    .good-new a {
      // border: 0.0625rem solid #e5e5e5;
      display: block;
      background: #fff;
      border-radius: 0.5rem;
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

    .block {
      display: block;
    }

    .spce {
      font-size: 12px;
      margin: 0 0.2rem;
    }
  }
</style>
