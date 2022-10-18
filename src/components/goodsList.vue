<template>
  <div id="goodslist" :style="{backgroundColor:goods_bg_color}">
    <div class="mai">
      <div class="main" v-show="view" :style="{backgroundColor:goods_bg_color}">
        <dl v-for="(item, i) in goods" :key="'a'+ i" @click.stop.prevent="gotoDetail(item)">
          <dt v-if="item.thumb">
            <img :src="item.thumb" @click.stop.prevent="gotoDetail(item)" />
          </dt>
          <dt v-if="!item.thumb">
            <img src="../assets/images/img_default.png" />
          </dt>
          <dd class="m-text" style="-webkit-box-orient: vertical;">
            {{ item.title | escapeTitle }}
          </dd>
          <dd>
            <labels style="height:auto;line-height:1rem;margin: 0 0.5rem;" :labels="item.tags"></labels>
          </dd>
          <!-- 添加海外标签 -->
          <dd style="margin: 0.25rem 0.5rem;">
            <overseastag :visible="item.overseas" class="details"/>
          </dd>
          <dd class="m-label" v-if="item.label_list && item.label_list.length > 0">
            <span class="goods-label" v-for="(labelItem) in item.label_list" :key="labelItem.id">{{labelItem.name}}</span>
          </dd>
          <dd
            class="s3"
            style="line-height: 1.5625rem;
            min-height: 3.125rem;
            height: auto;
            margin: 0.25rem 0.375rem;"
            :class="{ heightAuto: item.is_open_micro == 1 }"
            v-if="!showprice"
          >
            <!-- item.point_goods积分商城   ==>  积分全抵扣  不显示其他价格或者爱心值-->
            <template v-if="item.point_goods">
              <div class="point-good">
                <span class="point-good-price">
                  {{ item.point_goods.min_point }}
                </span>
                <span class="point-text">{{ integral }}</span>
              </div>
            </template>
            <template v-else>
              <div class="s2">
                <span v-if="parseInt(item.market_price) && Number(item.market_price) > Number(item.price)">{{ market_price }} {{ $i18n.t("money") }}{{ item.market_price }}</span>
              </div>
              <div :style="styleCon" class="s3-price">
                <!-- {{ price }} -->
                <small>{{ $i18n.t("money") }}</small>
                <span :class="[item.vip_level_status && item.vip_level_status.status == 1?'s3-price-span1':'s3-price-span2']">
                  {{ checkPrice(item) }}
                </span>
              </div>
              <!--item.goods_love 爱心值兑换 商品列表模板03的时候显示-->
              <div class="daydayPrice-text" style="height: auto;" v-if="item.goods_love">
                <span
                  >{{ $i18n.t("money") }}{{ (item.price - item.goods_love.love_coin.amountOfMoney).toFixed(2) + "+" + item.goods_love.love_coin.amountOfCoin + item.goods_love.love_coin.name }}</span
                >
              </div>
            </template>

            <div style="color: #888; font-size: 12px;" v-show="item.is_open_micro == 1">会员价:{{ $i18n.t("money") }}{{ item.vip_level_status && item.vip_level_status.status == 1
              ? item.vip_level_status.word
              : (item.price_level == 1 ? item.vip_price : item.vip_next_price) }}</div>
            <div class="s3" v-if="item.estimated_commission > 0" style="color: #888; font-size: 12px;">
              <small>{{ $i18n.t("money") }}</small>
              <span>{{ $i18n.t("预估收益") }}：{{ item.estimated_commission }}</span>
            </div>
          </dd>
          <dd>
            <div class="give_integral_wrapper" v-if="item.goods_points">
              <div class="give_integral_text">送</div>
              <div class="give_integral_num">{{item.goods_points}} {{integral}}</div>
            </div>
          </dd>
        </dl>
      </div>
      <div class="main2" v-show="view == false">
        <!-- 模板一 -->
        <div v-show="goods_list_template != '02'" class="list" v-for="(items, i) in goods" :key="'b'+ i" @click.stop.prevent="gotoDetail(items)">
          <div class="imgs">
            <img :src="items.thumb" v-if="items.thumb" />
            <img src="../assets/images/img_default.png" v-if="!items.thumb" />
          </div>
          <div class="shop_info">
            <ul class="main2-goods-title">
              <li class="title">
                {{ items.title | escapeTitle }}
              </li>
              <li class="goods-label-box" v-if="items.label_list && items.label_list.length > 0">
                <span class="goods-label" v-for="(labelItem) in items.label_list" :key="labelItem.id">{{labelItem.name}}</span>
              </li>
              <li >
                <labels :labels="items.tags"></labels>
              </li>
              <li class="goods-label-box" >
                <overseastag :visible="items.overseas" class="details"/>
              </li>
            </ul>
            <div>
              <!-- <div class="s2">
                <span v-if="parseInt(items.market_price)">{{ market_price }} {{ $i18n.t('money') }}{{ items.market_price }}</span>
              </div> -->
              <ul class="main2_price" v-if="!showprice">
                <template v-if="items.point_goods">
                  <li class="point-good">
                    <span class="point-good-price">
                      {{ items.point_goods.min_point }}
                    </span>
                    <span class="point-text">{{ integral }}</span>
                  </li>
                </template>
                <template v-else>
                  <li class="member">
                    {{ price }}
                    <small>{{ $i18n.t("money") }}</small>
                    <!-- <span v-if="items.vip_level_status && items.vip_level_status.status == 1" class="member-span-1">
                      {{ items.vip_level_status.word }}
                    </span>
                    <span v-else class="member-span-2">
                      {{ items.price }}
                    </span> -->
                    <span :class="[items.vip_level_status && items.vip_level_status.status == 1?'member-span-1':'member-span-2']">
                      {{ checkPrice(items) }}
                    </span>
                  </li>
                </template>
              </ul>
              <dd class="s3" style="color: #888; font-size: 12px;" v-show="items.is_open_micro == 1">
                <small></small>
                会员价：{{ $i18n.t("money") }}{{ items.vip_level_status && items.vip_level_status.status == 1
                ? items.vip_level_status.word
                : (items.price_level == 1 ? items.vip_price : items.vip_next_price) }}
              </dd>
              <div class="fit" v-if="items.estimated_commission > 0" style="color: #888; font-size: 12px;">
                <small>{{ $i18n.t("money") }}</small>
                {{ $i18n.t("预估收益") }}：{{ items.estimated_commission }}
              </div>
              <div class="daydayPrice-text" style="height: auto;" v-if="!items.point_goods && items.goods_love">
                <span
                  >{{ $i18n.t("money")
                  }}{{ (items.price - items.goods_love.love_coin.amountOfMoney).toFixed(2) + "+" + items.goods_love.love_coin.amountOfCoin + items.goods_love.love_coin.name }}</span
                >
              </div>
              <div class="give_integral_wrapper" style="padding-left: 0; padding-top: 0.5rem;" v-if="items.goods_points">
                <div class="give_integral_text">送</div>
                <div class="give_integral_num">{{items.goods_points}} {{integral}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 模板二 -->
        <div
          v-show="goods_list_template == '02'"
          class="list"
          style="flex-wrap: wrap; margin-bottom: 0.75rem;"
          v-for="(items, i) in goods"
          :key="'c'+ i"
          @click.stop.prevent="gotoDetail(items)"
        >
          <div class="imgs">
            <img :src="items.thumb" v-if="items.thumb" />
            <img src="../assets/images/img_default.png" v-if="!items.thumb" />
          </div>
          <div class="shop_info">
            <ul>
              <li class="title">
                {{ items.title | escapeTitle }}
              </li>
            </ul>
            <div class="goods-label-box" v-if="items.label_list && items.label_list.length > 0">
              <span class="goods-label" v-for="(labelItem) in items.label_list" :key="labelItem.id">{{labelItem.name}}</span>
            </div>
            <template v-if="items.point_goods">
              <div class="point-good">
                <span class="point-good-price">
                  {{ items.point_goods.min_point }}
                </span>
                <span class="point-text">{{ integral }}</span>
              </div>
            </template>
            <template v-else>
              <div>
                <div class="discount" v-if="items.coupon">
                  <div class="discount-a" v-if="items.coupon.coupon_method == 1">优惠券{{ $i18n.t("money") }}{{ items.coupon.deduct }}</div>
                  <div class="discount-a" v-if="items.coupon.coupon_method == 2">折扣:{{ items.coupon.discount }}折</div>
                  <div class="discount-a" v-if="items.first_dividend">推广赚{{ $i18n.t("money") }}{{ items.first_dividend }}</div>
                </div>
                <div v-if="items.coupon">
                  <div class="now-price" v-if="items.coupon.deduct_price">{{ price }} {{ $i18n.t("money") }}{{ checkPrice(items) }}</div>
                  <div class="discount-price" v-if="items.coupon.deduct_price">
                    券后价：<span v-if="items.vip_level_status && items.vip_level_status.status == 1" class="member-span-1">
                      {{ items.vip_level_status.word }}
                    </span>
                    <span v-else class="member-span-2"> {{ $i18n.t("money") }}{{ items.coupon.deduct_price }} </span>
                  </div>
                  <div class="member" style="margin-bottom: 5px;" v-else-if="items.vip_level_status && items.vip_level_status.status == 1">
                    <span class="member-span-1">{{ $i18n.t("money") }}{{ items.vip_level_status.word }}</span>
                  </div>
                  <div class="discount-price" v-else-if="items.price == '0.00' && items.has_option == 1 && items.min_price">
                    {{ price }} {{ $i18n.t("money") }}
                    {{ items.min_price }}
                  </div>
                  <div class="discount-price" v-else>{{ price }} {{ $i18n.t("money") }}{{ items.price }}</div>
                </div>
                <dd class="s3" style="color: #888; font-size: 12px;" v-show="items.is_open_micro == 1">
                  <small></small>
                  会员价：{{ $i18n.t("money") }}{{ items.vip_level_status && items.vip_level_status.status == 1
                  ? items.vip_level_status.word
                  : (items.price_level == 1 ? items.vip_price : items.vip_next_price) }}
                </dd>
                <div class="fit" v-if="items.estimated_commission > 0" style="color: #888; font-size: 12px;">
                  <small>{{ $i18n.t("money") }}</small>
                  {{ $i18n.t("预估收益") }}：{{ items.estimated_commission }}
                </div>
              </div>
            </template>
          </div>
          <div class="list-b" style="border-top: 1px solid #eee; width: 100%;">
            <div class="list-copy" @click.stop v-clipboard:copy="items.goods_link" v-clipboard:success="onCopy">
              复制标题
            </div>
            <div class="list-share" @click.stop="postShow(items.goods_id)">分享海报</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDefault == 1">
      <div class="loadMore" v-if="isLoadMore" @click="getMoreData" :style="{backgroundColor:goods_bg_color}">
        {{ $i18n.t("加载更多") }}
      </div>
      <div class="loadMore" v-if="!isLoadMore" :style="{backgroundColor:goods_bg_color}">{{ $i18n.t("没有更多了") }}~~</div>
    </div>

    <div class="loadNomore" v-show="loading">
      <img src="../assets/images/no-more-product.png" />
    </div>
    <yz-goodsposter v-model="posterShow" ref="goodsposter" :posterData="posterImg" :goodstype="true" :gid="gid"></yz-goodsposter>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "vant";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import overseastag from './overseas/tag.vue';
import labels from 'components/goods/labels.vue';
const documentElement = document.documentElement;
const body = document.body;
var isDone = false;
var isClick = 0;

export default {
  props: ["goods", "text", "loadMore", "loading", "disabledt", "styleCon", "jumpSo", "storeId", "showprice", "last_page", "isDefault", "goods_template","bgColor","fatherTitle","newDiyIcon","attrZhuge","classificationActiveName","brandActiveName"],
  data() {
    return {
      gid: null,
      isLoadMore: false, //true 可以加载更多
      page: 1,
      isMounted: 0, //只触发一次
      posterShow: false, //海报显示
      posterImg: {}, //海报数据
      copy_link: "", //复制链接
      price: "", //现价=>京东价
      market_price: "", //原价
      integral: window.localStorage.getItem("integral") || "积分"
    };
  },
  components: { yzGoodsposter, overseastag, labels },
  computed: {
    ...mapState(["view"]),
    goods_list_template() {
      if (this.$route.params.type && this.$route.params.type == "snatchRegiment") {
        return "01";
      } else if (this.$store.state.temp.item.is_decorate === 1) {
        if (this.$store.state.temp.item.ViewSet.goodsList.is_default != 0) {
          return this.$store.state.temp.item.ViewSet.goodsList.code.substring(9);
        } else {
          return "01";
        }
      } else {
        if (this.goods_template) {
          return this.goods_template.names;
        } else {
          return "01";
        }
      }
    },
    goods_bg_color(){
      if(this.bgColor) return this.bgColor;
      return "#f5f5f5";
    }
  },
  watch: {
    goods(val) {
      let that = this;
      this.goods.forEach((val, index) => {
        if (val.goods_link) {
          let aa = val.goods_link.split("0x0A");
          let bb = aa.join("\r");
          that.$set(that.goods[index], "goods_link", bb);
        } else {
          that.$set(that.goods[index], "goods_link", val.title);
        }
      });
    },
    goods_list_template(val) {
      if (val == "02") {
        if (this.view) {
          this.$store.commit("views");
        }
      }else if(val == "01"){
        if(!this.view){
          this.$store.commit("views");
        }
      }else if(val == "03"){
        if (this.view) {
          this.$store.commit("views");
        }
      }
    }
  },

  mounted() {
    this.isMounted = 1;
    // 判断商品组件mounted的时候是否需要加载更多
    this.isLoadMore = this.last_page > 1;
    if (!isDone && this.isDefault == 1) {
      document.addEventListener("touchmove", this.handleScroll, false);
      isDone = true;
    }
    //设置现价原价自定义名称
    this.price = this.fun.initMailLanguage().goods ? (this.fun.initMailLanguage().goods.price != "" ? this.fun.initMailLanguage().goods.price : "现价") : "";
    this.market_price = this.fun.getMarketPrice();

  },
  activated() {
    console.log(this.view);
    this.page = 1;
    this.isLoadMore = this.last_page > 1;
    if (!isDone && this.isMounted !== 1 && this.isDefault == 1) {
      document.addEventListener("touchmove", this.handleScroll, false);
      isDone = true;
    }
    //设置现价原价自定义名称
    this.price = this.fun.initMailLanguage().goods ? (this.fun.initMailLanguage().goods.price != "" ? this.fun.initMailLanguage().goods.price : "现价") : "";
    this.market_price = this.fun.getMarketPrice();
  },
  deactivated() {
    this.isMounted = 0;
    if (isDone && this.isDefault == 1) {
      document.removeEventListener("touchmove", this.handleScroll, false);
      isDone = false;
    }
  },
  methods: {
    // 判断有没有区间价格
    checkPrice(item){
      if(item.vip_level_status && item.vip_level_status.status == 1){
        return item.vip_level_status.word;
      }else if(item.has_option == 1 && item.min_price){
        // 如果有规格，并且有区间价格就显示最低价格
        return item.min_price;
      }else{
        return item.price;
      }
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
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
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
        if (this.isLoadMore && isClick === 0) {
          this.getMoreData();
          isClick = 1;
        } else {
          console.log("没有更多数据");
        }
      }
    },
    // 获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "home-page.get-first-goods-page",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                if (that.page === that.last_page) {
                  that.isLoadMore = false;
                }
                var myData = response.data.data;
                that.goods = that.goods.concat(myData);
                // that.$store.commit('setDefaultMoreData', myData);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
              isClick = 0;
            },
            function(response) {
              console.log(response.msg);
              isClick = 0;
            }
          );
      }
    },
    //跳转至详情
    gotoDetail(item) {
      //console.log(item);
      if(this.fatherTitle.indexOf('分类列表') !==-1){//newDiyIcon
        zhuge.track(this.fatherTitle+'-点击商品',{
          '商品id':''+item.goods_id || item.id,
          '商品名称':item.title,
          '商品价格':item.price,
          '分类名称':this.newDiyIcon
        });
      }else if(this.fatherTitle.indexOf('搜索列表') !==-1){
        zhuge.track(this.fatherTitle+'-点击商品',{
          '商品id':''+item.goods_id || item.id,
          '商品名称':item.title,
          '商品价格':item.price,
          '筛选条件-品牌':this.brandActiveName,
          '筛选条件-分类':this.classificationActiveName,
          '筛选条件-属性':this.attrZhuge
        });
      }else{
        zhuge.track(this.fatherTitle+'-点击商品',{
          '商品id':''+item.goods_id || item.id,
          '商品名称':item.title,
          '商品价格':item.price
        });
      }
      
      if (this.jumpSo == true) {
        this.$router.push(
          this.fun.getUrl("goodsO2O", {
            id: item.goods_id || item.id,
            tag: "o2o",
            store_id: this.storeId
          })
        );
      } else {
        if (this.$route.params.type && this.$route.params.type == "snatchRegiment") {
          this.$router.push(this.fun.getUrl("grab_group", { id: item.goods_id || item.id }));
        } else if (this.$route.name == "paddingOrder_Home" || (!this.fun.isTextEmpty(this.$route.query.fromPage) && this.$route.query.fromPage == 1)) {
          this.$router.push(this.fun.getUrl("goods", { id: item.goods_id || item.id }, { kind: "POrder" }));
        } else {
          this.$router.push(this.fun.getUrl("goods", { id: item.goods_id || item.id }));
        }
      }
    },
    // 复制链接
    onCopy() {
      Toast({
        message: "复制成功",
        position: "bottom",
        duration: 5000
      });
    },

    //海报生成
    postShow(id) {
      this.gid = id;
      let toastPoster = Toast({
        duration: 0, // 持续展示 toast
        message: "正在为您生成海报中"
      });
      $http
        .get("goods.goods-poster.new-goods-poster", { id: id }, "...加载中")
        .then(response => {
          toastPoster.clear();
          if (response.result == 1) {
            this.posterImg = response.data;
            this.$refs.goodsposter.dataURL = null;
            this.posterShow = true;
          } else {
            this.posterShow = false;
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          toastPoster.clear();
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goodslist {
  //background: #f5f5f5;

  /* padding-bottom: 50px; */
  .poster-popup-class {
    background-color: transparent !important;
  }

  a {
    color: #2b2f33;
  }

  .loadMore {
    background: #f5f5f5;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
  }

  .main2 {
    .list {
      display: -webkit-box;
      display: -webkit-flex;
      background: #fff;
      border-bottom: solid 0.0625rem #f9f9f9;

      .list-b {
        display: flex;
        text-align: right;
        padding: 0.5rem 0;
        justify-content: flex-end;
        margin-right: 0.5rem;

        .list-copy {
          border-radius: 2rem;
          color: #ff2c29;
          border: 1px solid #ff2c29;
          padding: 0.35rem 0.5rem;
          margin-right: 0.5rem;
        }

        .list-share {
          border-radius: 2rem;
          background: #ff2c29;
          color: #fff;
          padding: 0.35rem 0.5rem;
          margin-right: 0.5rem;
        }
      }
    }

    .imgs {
      width: 6.5rem;
      height: 6.5rem;
      margin: 0.375rem 0.375rem 0.375rem 1rem;
      box-sizing: border-box;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .shop_info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      text-align: left;
      padding: 0.375rem 1rem 0.375rem 0.375rem;

      ul {
        // flex: 1;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.625rem;
      }

      .main2-goods-title {
        display: block;
      }

      .goods-label-box {
        max-height: 30px;
        text-align: left;
        font-size: 12px;
        color: rgb(136, 136, 136);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        .goods-label {
          margin-right: 6px;
        }
      }

      .discount {
        display: flex;
        margin: 0.2rem 0;
        font-size: 0.625rem;

        .discount-a {
          background: #ffeee9;
          color: #ff6c3f;
          padding: 0 0.25rem;
          margin-right: 0.25rem;
        }
      }

      .now-price {
        font-size: 0.75rem;
        text-decoration: line-through;
        vertical-align: middle;
        color: #888;
      }

      .discount-price {
        font-size: 0.875rem;
        color: #f15353;
      }

      .main2_price {
        margin: 0;
      }

      .s2 {
        text-decoration: line-through;
        vertical-align: middle;
        color: #999;
        font-size: 12px;
        height: 1rem;
        line-height: 1rem;
      }

      .title {
        font-size: 14px;
        flex: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        height: 36px;
        line-height: 18px;
      }

      .member {
        font-size: 16px;
        color: #fb4a4a;
        flex: 1;
        text-align: left;
        // margin-left: 0.625rem;
        .member-span-1 {
          font-size: 0.75rem;
          background: #fb4a4a;
          color: white;
          padding: 0.2rem 0.5rem;
          border-top-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        a {
          color: #fb4a4a;
          font-weight: bold;
          margin-top: 0.625rem;
        }
      }
    }

    .fit {
      flex: 0 0 1rem;
    }
  }

  .loadNomore img {
    width: 20%;
  }

  h3 {
    width: 65%;
    position: relative;
    margin: 0 auto 1.25rem;
    height: 1.25rem;
    padding: 0.625rem 0 0;

    .title {
      width: 33%;
      text-align: center;
      padding: 0 0.625rem;
      background: #f5f5f5;
      position: absolute;
      z-index: 9;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 14px;
      color: #666;
    }

    .spas {
      border-bottom: 0.0625rem solid #d9d9d9;
      position: absolute;
      z-index: 5;
      top: 1.25rem;
      width: 100%;
    }
  }

  .mai {
    width: 100%;
    overflow: hidden;
  }

  .main {
    overflow: hidden;
    // margin-right: -0.0625rem;
    margin: 0.5rem 0.75rem;
    //background: #f5f5f5;

    dl:nth-child(2n) {
      margin-right: 0;
    }

    dl {
      border-radius: 0.5rem;
      padding: 0;

      /* border-bottom: 1px solid #f5f5f5;
        border-right: 1px solid #f5f5f5; */
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      float: left;
      margin-bottom: 0.5rem;
      margin-right: 2%;
      background: #fff;
      width: 49%;

      dt {
        height: 50vw;
        line-height: 82vw;
      }

      dt {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;

        img {
          width: 100%;
          // top:0.2rem;
          right: 0;
          height: 100%;
          position: absolute;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
      }

      .s3 {
        height: 1.5625rem;
        display: block;

        /* line-height: 30px; */
        text-align: left;
        margin: 0 0.5rem;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 1;
        // word-break: break-all;
        overflow: hidden;
        // text-overflow: ellipsis;

        /* white-space:nowrap */
        .s3-price {
          line-height: 1.5625rem;
          height: 1.375rem;
          overflow: hidden;
          color: #fb4a4a;

          .s3-price-span1 {
            font-size: 12px;
            background: #fb4a4a;
            color: white;
            padding: 0.2rem 0.5rem;
            border-top-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }

          .s3-price-span2 {
            font-size: 16px;
          }
        }
      }

      dd {
        margin: 0;

        div {
          line-height: 1.5625rem;
          height: 1.5625rem;
        }

        em {
          font-size: 16px;
          font-style: normal;
        }

        .s2 {
          text-decoration: line-through;
          vertical-align: middle;
          color: #999;
          font-size: 12px;
          height: 1rem;
          line-height: 1.25rem;
          // margin-left: 0.625rem;
        }
      }

      .m-text {
        font-size: 14px;
        // margin: 0.25rem 0.375rem;
        margin: 0.25rem 0.5rem;
        // height: 2.125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        line-height: 1.125rem;
        text-align: left;
      }

      .m-label {
        margin: 0.5rem;
        max-height: 30px;
        text-align: left;
        font-size: 12px;
        color: rgb(136, 136, 136);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        .goods-label {
          margin-right: 6px;
        }
      }

      .discount-one {
        text-align: left;
        margin: 0.375rem 0.2rem;

        .discount-one-a {
          font-size: 0.625rem;
          display: flex;

          .discount-a {
            overflow: hidden;
            height: 1rem;
            background: #ffeee9;
            white-space: nowrap;
            color: #ff6c3f;
            padding: 0 0.2rem;
            margin-right: 0.2rem;
          }
        }

        .discount-one-b {
          .now-price {
            font-size: 0.75rem;
            text-decoration: line-through;
            vertical-align: middle;
            color: #888;
          }

          .discount-price {
            font-size: 0.875rem;
            color: #f15353;
          }
        }
      }

      .list-b {
        display: flex;
        padding: 0.5rem 0;
        justify-content: center;

        .list-copy {
          border-radius: 2rem;
          color: #ff2c29;
          border: 1px solid #ff2c29;
          padding: 0.25rem 0.5rem;
          margin-right: 0.5rem;
        }

        .list-share {
          border-radius: 2rem;
          background: #ff2c29;
          color: #fff;
          padding: 0.35rem 0.5rem;
        }
      }
    }
  }
}

.heightAuto {
  height: auto !important;
}

.code_box {
  position: relative;

  .icon_close {
    position: absolute;
    bottom: 0;
    right: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: -1.25rem;
    border: 1px solid #fff;
    border-radius: 100%;

    i {
      line-height: 2.5rem;
      font-size: 1.125rem;
      color: #fff;
    }
  }
}

.point-good {
  color: #ff9500;

  .point-good-price {
    font-size: 16px;
    word-break: break-all;
  }

  .point-text {
    font-size: 12px;
    background: #ff9500;
    color: #fff;
    padding: 2px 4px;
    border-radius: 5px;
    vertical-align: bottom;
  }
}

.daydayPrice-text {
  color: #ff9500;
}

.give_integral_wrapper {
  position: relative;
  display: flex;
  text-align: left;
  padding-left: 0.5rem;

  .give_integral_text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.094rem !important;
    height: 1.094rem !important;
    font-size: 0.688rem;
    color: #fff;
    background-color: #ec544a;
    border-radius: 50%;
  }

  .give_integral_num {
    display: inline-flex;
    align-items: center;
    height: 1.094rem !important;
    padding: 0 0.5rem 0 1.3rem;
    font-size: 0.688rem;
    color: #ec544a;
    background-color: #fff5f4;
    border-radius: 15%;
  }
}

</style>
