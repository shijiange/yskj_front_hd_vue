<template>
  <div id="goodslist" :style="{backgroundColor:goods_bg_color}">
    <div class="mai">
      <div class="main2">
        <!-- 模板一 -->
        <div v-show="goods_list_template != '02'" class="list" v-for="(items, i) in goods" :key="'b'+ i" @click.stop.prevent="gotoDetail(items.goods_id || item.id)">
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
              <div class="main2_price" v-if="!showprice">
                <template v-if="items.point_goods">
                  <div class="point-good">
                    <span class="point-good-price">
                      {{ items.point_goods.min_point }}
                    </span>
                    <span class="point-text">{{ integral }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="member">
                    {{ price }}
                    <small>{{ $i18n.t("money") }}</small>
                    <span :class="[items.vip_level_status && items.vip_level_status.status == 1?'member-span-1':'member-span-2']">
                      {{ checkPrice(items) }}
                    </span>
                  </div>
                </template>

                <div class="select" v-if="items.has_option != 1 && items.plugin_id != 40">
                  <transition name="fade">
                    <i v-if="goodsCarts[items.id]" class="iconfont icon-life-game-sign" @click.stop="numberLeft(items)" :class="{disable:changeDisable}"></i>
                  </transition>
                  <input
                    type="tel"
                    title="number"
                    v-if="goodsCarts[items.id] && !goodsCarts[items.id].option_str"
                    @click.stop
                    v-model.lazy="goodsCartsTotal[items.id].total"
                    @focus="clickCount(goodsCartsTotal[items.id].total)"
                    @blur="changeCount(goodsCarts[items.id].id, goodsCartsTotal[items.id].total, 0, good)"
                  />
                  <span v-if="goodsCarts[items.id] && goodsCarts[items.id].option_str" @click.stop>{{ goodsCartsTotal[items.id].total }}</span>
                  <i @click.stop="numberRight(items.id, items.stock, items)" class="iconfont icon-life-game-plus" :class="{disable:changeDisable}"></i>
                </div>

                <div class="select optionClass leaseBox" v-if="items.has_option == 1">
                  <van-badge v-if="goodsCarts[items.id] && goodsCartsTotal[items.id].total > 0" :content="goodsCartsTotal[items.id].total">
                    <p @click.stop="addGood(items)">可选规格</p>
                  </van-badge>
                  <p v-else @click.stop="addGood(items)">可选规格{{goodsCartsTotal[items.id]}}</p>
                </div>

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
          @click.stop.prevent="gotoDetail(items.goods_id || item.id)"
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

    <!--选规格-->
    <van-popup v-model="show2" round position="center">
      <div class="spec_box q5" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <h3>
          {{ popTitle }}
          <i @click.stop="close" class="iconfont icon-close11"></i>
        </h3>
        <van-nav-bar>{{ popTitle }}</van-nav-bar>
        <div style="height: 2.5rem;"></div>
        <div class="spec_a">
          <div v-for="(spec, i) in goodsInfo.has_many_specs" :key="i">
            <h5>{{ spec.title }}：</h5>
            <ul class="option">
              <li @click.stop="selectSpecs(item, item.id)" v-for="(item, i) in spec.has_many_specs_item" :key="i" :class="specid.indexOf(item.id) >= 0 ? 'cur' : ''">
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
        <div style="height: 3.4375rem;"></div>
        <div class="add_car">
          <ul class="car_btn">
            <li class="left" v-if="goodsInfo.point_goods">
              {{ popPrice }}<span>{{ integral }}</span>
            </li>
            <li class="left" v-else>
              <div class="good-price">
                <span>{{ $i18n.t("money") }}</span>{{ popPrice }}
              </div>
              <div class="vip-price" v-if="isMultiSpecs">
                <van-loading class="m-l-w6" size="16" color="#fdbc2e" v-show="specsVIPPrc == 0" />
                <span class="m-l-w6" v-show="specsVIPPrc">&nbsp;会员价: {{ $i18n.t("money") }}{{ specsVIPPrc }} </span>
              </div>
            </li>
            <li class="right">
              <span v-show="!popNum && popStock >= 1" @click.stop="submitAction">{{ $i18n.t("category.加入购物车") }}</span>
              <span v-show="popStock <= 0" style="background: #999;">库存不足</span>
            </li>
            <div class="Box" v-show="popNum >= 1">
              <i class="iconfont icon-store_reduceLine" :class="{disable:changeDisable}"  @click.stop="changeCount(popCard.id, popNum - 1, -1)"></i>
              <label class="show">{{ popNum }}</label>
              <i class="iconfont icon-store_plus" :class="{disable:changeDisable}" @click.stop="changeCount(popCard.id, popNum + 1, 1)"></i>
            </div>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "vant";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import overseastag from './overseas/tag.vue';
import labels from 'components/goods/labels.vue';
import { Badge } from "vant";
Vue.use(Badge);

const documentElement = document.documentElement;
const body = document.body;
var isDone = false;
var isClick = 0;
var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;
var OldGoodsNum = null;

export default {
  props: ["goods", "text", "loadMore", "loading", "disabledt", "styleCon", "jumpSo", "storeId", "showprice", "last_page", "isDefault", "goods_template","bgColor"],
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
      integral: window.localStorage.getItem("integral") || "积分",
      carts: [],
      cartIDs: [],
      goodsCarts: [], //购物车转为goods key的数组
      goodsCartsTotal: [],
      goodsInfo: {},
      //规格弹窗
      specid: "", //规格ID
      show2:false,
      popTitle: "",
      popPrice: "",
      popNum: 0,
      popStock: "",
      popCard: {},
      isMultiSpecs: false, //多规格商品是否显示会员价
      specsVIPPrc: null, //规格商品会员价
      cart_ids: [],
      changeDisable: false //是否允许更改商品数量，再更新完成之前不允许更改
    };
  },
  components: { yzGoodsposter, overseastag, labels, Badge },
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
    this.cart_ids = this.$route.query.cart_ids ? this.$route.query.cart_ids.split(',') : [];
    this._updateData();
  },
  deactivated() {
    this.isMounted = 0;
    if (isDone && this.isDefault == 1) {
      document.removeEventListener("touchmove", this.handleScroll, false);
      isDone = false;
    }
  },
  methods: {
    addCartId(cart_id){
      if (!this.cart_ids.includes(cart_id)) {
        this.cart_ids.push(cart_id);
      }
    },
    removeCartId(cart_id) {
      this.cart_ids = this.cart_ids.filter(item=>{return item != cart_id;});
    },
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
    gotoDetail(id) {
      if (this.jumpSo == true) {
        this.$router.push(
          this.fun.getUrl("goodsO2O", {
            id: id,
            tag: "o2o",
            store_id: this.storeId
          })
        );
      } else {
        if (this.$route.params.type && this.$route.params.type == "snatchRegiment") {
          this.$router.push(this.fun.getUrl("grab_group", { id: id }));
        } else if (this.$route.name == "paddingOrder_Home" || (!this.fun.isTextEmpty(this.$route.query.fromPage) && this.$route.query.fromPage == 1)) {
          this.$router.push(this.fun.getUrl("goods", { id: id }, { kind: "POrder" }));
        } else {
          console.log("执行了这里", id);
          this.$router.push(this.fun.getUrl("goods", { id: id }));
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
    },

    numberLeft(goods) {
      if(this.changeDisable){
        return false;
      }
      let _id = goods.id;
      this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) - 1;
      if (this.goodsCartsTotal[_id].total <= 0) {
        //小于等于0 清空该商品购物车数量
        this._destroyData(this.goodsCarts[_id].id);
        return true;
      } else {
        optionsMaxCount = goods.stock;
        this.changeCount(this.goodsCarts[_id].id, this.goodsCartsTotal[_id].total);
      }
    },
    numberRight(_id, _stock, good) {
      if(this.changeDisable){
        return false;
      }
      //价格权限
      if (good.vip_level_status && good.vip_level_status.status == 1) {
        Toast(good.vip_level_status.tips);
        return false;
      }
      if (_stock == 0) {
        Toast("库存不足");
        return;
      }
      if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
        if (this.goodsCartsTotal[_id].total >= _stock) {
          console.log("数量超出范围");
          Toast("库存不足");
          return;
        }
      }
      this.changeDisable = true;
      $http.get("member.member-cart.store", { goods_id: _id, total: 1 }, "").then(
        response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
              this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) + 1;
            }
            this.$store.commit("setCartNum", response.data.cart_num);
            this.addCartId(response.data.cart_id);
            this._updateData();
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    changeCount(_id, _num, index, _good) {
      if (this.changeDisable) {
        return;
      }
      let that = this;
      if (_num <= 0) {
        this._destroyData(_id);
        return;
      }
      if (this.fun.isTextEmpty(_good) && _num - 1 >= optionsMaxCount) {
        //有规格的
        Toast("库存不足");
        return;
      } else if (!this.fun.isTextEmpty(_good) && _num >= _good.stock) {
        //无规格
        this.$set(that.goodsCartsTotal[_good.id], "total", OldGoodsNum);
        Toast(`该商品最多购买数量为${_good.stock}`);
        return;
      }

      let json = {
        id: _id,
        num: _num
      };
      that.changeDisable = true;
      $http.get("member.member-cart.updateNumV2", json, true).then(
        response => {
          if (response.result === 1) {
            that.addCartId(_id);
            that._updateData();
            if (!that.fun.isTextEmpty(index)) {
              //规格商品
              switch (index) {
              case -1:
                that.popNum = that.popNum - 1;
                break;
              case 1:
                that.popNum = that.popNum + 1;
                break;
              default:
                console.log("error");
              }
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    _updateData() {
      this.changeDisable = true;
      //更新购物车数据
      $http.get('member.member-cart.index', {}, true).then(response => {
        if (response.result == 1) {
          this.getCart(response.data);
          this.$emit('cartChange', {act_id:this.$route.query.act_id,cart_ids:this.cartIDs});
        } else {
          console.log(response.msg);
        }
        this.changeDisable = false;
      });//更新活动数据
    },
    _destroyData(_cid) {
      //清除该购物车商品id
      let that = this;
      that.changeDisable = true;
      $http.get('member.member-cart.destroy', { ids: _cid }, true).then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          that.removeCartId(_cid);
          that._updateData();
          that.popNum = that.popNum - 1;
        } else {
          console.log(response.msg);
        }
      });
    },
    /**
     * 如果传了商品，通过商品id获取购物车数量
     * @param goods
     */
    getCart(goods) {
      var that = this;
      that.carts = goods;
      that.goodsCarts = [];
      that.cartIDs = [];
      that.carts.forEach(item => {
        that.$set(that.goodsCarts, item.goods_id, item);
        if (goods && goods.id === item.goods_id) {
          goods.buyNum = item.total;
        }
        if (item.goods_id === this.goodsInfo.id && item.option_id === optionsId) {
          this.popNum = item.total;
          this.popCard = item;
        }
        that.cartIDs.push(item.id);
      });
      that.goodsCartsTotal = that.calculateTotal(that.carts);
    },
    //不同规格的同一商品求和
    calculateTotal(arr) {
      let newArr = [];
      let temp = {};
      let newArr2 = [];
      for (let i in arr) {
        let key = arr[i].goods_id;
        if (temp[key]) {
          let good_id = temp[key].goods_id;
          temp[key].goods_id = good_id;
          temp[key].total = temp[key].total + arr[i].total;
        } else {
          temp[key] = {};
          temp[key].goods_id = arr[i].goods_id;
          temp[key].total = arr[i].total;
        }
      }
      for (let k in temp) {
        newArr.push(temp[k]);
      }
      newArr.forEach(item => {
        this.$set(newArr2, item.goods_id, item);
      });
      return newArr2;
    },
    //添加有规格商品到购物车
    addGood(good) {
      //价格权限
      if (good.vip_level_status && good.vip_level_status.status == 1) {
        Toast(good.vip_level_status.tips);
        return false;
      }
      this.show2 = true;
      this.goodsInfo = good;

      this.initPopView(); //初始化弹窗view
    },
    //初始化弹窗view
    initPopView() {
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
      console.log(this.goodsInfo)
      if (this.goodsInfo.has_option === 1) {
        //是否有规格
        this.isShowMultiSpecsMemPrice(); //是否需要显示多规格会员价
        this.popTitle = this.goodsInfo.title; //设置默认图片
        this.popThumb = this.goodsInfo.thumb; //设置商品名
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.popCard = {};
        if (!this.specid.length) {
          if (this.goodsInfo.point_goods) {
            this.popPrice = this.goodsInfo.point_goods.min_point + "-" + this.goodsInfo.point_goods.max_point; //设置默认价格
          } else {
            this.popPrice = this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
          }
        }

        if (!optionsId) {
          // 默认选择第一个
          for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
            if (this.goodsInfo.goods_option_ids && this.goodsInfo.goods_option_ids.length >= 0) {
              for (let j = 0; j < this.goodsInfo.has_many_specs[i].has_many_specs_item.length; j++) {
                if (this.goodsInfo.has_many_specs[i].has_many_specs_item[j].id == Number(this.goodsInfo.goods_option_ids[i])) {
                  this.selectSpecs(this.goodsInfo.has_many_specs[i].has_many_specs_item[j], this.goodsInfo.has_many_specs[i].has_many_specs_item[j].id);
                }
              }
            } else {
              this.selectSpecs(this.goodsInfo.has_many_specs[i].has_many_specs_item[0], this.goodsInfo.has_many_specs[i].has_many_specs_item[0].id);
            }
          }
        }
      }
    },

    isShowMultiSpecsMemPrice() {
      //判断是否需要显示多规格会员价【#70785】
      if (this.goodsInfo.is_open_micro && Number(this.goodsInfo.is_open_micro) == 1 && this.goodsInfo.has_option == 1) {
        this.isMultiSpecs = true;
      } else {
        this.isMultiSpecs = false;
      }
    },
    //界面选择规格触发事件
    selectSpecs(data, id) {
      //处理选择池
      this.manageSpecs(data);

      //处理规格组合选择状态
      this.setGoodsSpecs(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo(id);

      //判断当前购买总量与库存的关系
      this.getMaxCount();
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        if (optionsMaxCount == 0) {
          //库存不足
          this.popNum = 0;
        }
        if (this.popNum > optionsMaxCount) {
          this.popNum = optionsMaxCount;
        }
      }
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo(id) {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length === this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        this.specid = goodsSpecs;
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (goodsSpecs === this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)) {
            this.popmPrice = this.goodsInfo.has_many_options[i].market_price; //设置价格
            if (this.goodsInfo.point_goods) {
              this.popPrice = this.goodsInfo.point_goods.point_option[i].goods_point; //设置价格
            } else {
              this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            }
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            // console.log("库存最大数",optionsMaxCount)
            if (optionsMaxCount > 0) {
              this.popNum = 0;
            }
            if (this.isMultiSpecs) this.getMemberPrice(optionsId);
            break;
          }
        }

        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].goods_id === this.goodsInfo.id && this.carts[i].option_id === optionsId) {
            this.popNum = this.carts[i].total;
            this.popCard = this.carts[i];
            break;
          }
          this.popNum = 0;
          this.popCard = {};
        }
      } else {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        this.specid = goodsSpecs;
      }
    },
    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort(specs) {
      let _specs = specs.split("_"); //先变成数组
      //_specs.sort();//排序
      _specs.sort(function(a, b) {
        return a - b;
      });

      // 在组装回去
      let goodsSpecs = "";
      for (let j = 0; j < _specs.length; j++) {
        goodsSpecs += _specs[j] + "_";
      }
      goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"

      return goodsSpecs;
    },
    //处理选择池
    manageSpecs(data) {
      var specsObject = new Object();
      specsObject.id = data.id;
      specsObject.specid = data.specid;
      specsObject.title = data.title;
      if (specsManage.length > 0) {
        for (let i = 0; i < specsManage.length; i++) {
          if (specsManage[i].specid == specsObject.specid) {
            specsManage.splice(i, 1);
          }
        }
        specsManage.push(specsObject);
      } else {
        specsManage.push(specsObject);
      }

      //排序
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
      this.setGoodsDescription();
    },

    //处理goodsDescription 数据
    setGoodsDescription() {
      var description = "";
      //相等代表全选了 体现语句
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id != specsManage[j].specid) {
              description += this.goodsInfo.has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },

    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        if (specs.specid != this.goodsInfo.has_many_specs[i].id) {
          this.setGoodsSpecsStatus(this.goodsInfo.has_many_specs[i].has_many_specs_item, specs.id);
        }
      }
    },
    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goodsInfo.has_many_options[i]);
          }
        }
      }

      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
              }
            }
          }
        }
      }
    },
    //弹窗提交确认
    submitAction() {
      let that = this;
      console.log("弹窗提交确认", optionsMaxCount);
      if (specsManage.length < this.goodsInfo.has_many_specs.length) {
        //请选择规格
        // this.show2 = false;
        Toast(this.goodsDescription);
        return;
      }
      if (optionsMaxCount == 0) {
        Toast("该规格库存不足！");
        return;
      }
      that.changeDisable = true;
      $http.get("member.member-cart.store", { goods_id: this.goodsInfo.id, total: 1, option_id: optionsId }, "").then(
        response => {
          if (response.result === 1) {
            this.$store.commit("setCartNum", response.data.cart_num);
            console.log(response.data.cart_id);
            console.log(this.cart_ids);
            this.addCartId(response.data.cart_id);
            console.log(this.cart_ids);
            Toast(response.msg);
            that._updateData();
            that.popNum = that.popNum + 1;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    close() {
      this.show2 = false;
    },
    getMemberPrice(_optionsId) {
      if (!_optionsId) return;
      this.specsVIPPrc = 0;
      $http
        .post("goods.other-info.option-vpi-price", { option_id: _optionsId }, null, true)
        .then(res => {
          if (res.result == 1) {
            this.specsVIPPrc = res.data.vip_price || null;
          } else {
            this.specsVIPPrc = null;
          }
        })
        .catch(error => {
          this.specsVIPPrc = null;
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
        display: flex;
        align-items: flex-start;
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
  .mai {
    width: 100%;
    overflow: hidden;
    margin-bottom: 40px;
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
.spec_box {
  background: #fff;
  width: 20.625rem;
  height: 24.375rem;
  border-radius: 0.625rem;
  padding-bottom: 3.4375rem;

  h3 {
    border-radius: 0.625rem 0.625rem 0 0;
    width: 100%;
    background-color: #fff;
    line-height: 2.75rem;
    border-bottom: solid 0.0625rem #ebebeb;
    font-size: 16px;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /* 规定段落中的文本不进行换行 */
    padding-right: 15%;
    padding-left: 5%;
    text-align: left;
    position: absolute;
    top: 0;
    z-index:10;
    i {
      position: absolute;
      right: 0.875rem;
      line-height: 2.75rem;
      color: #999;
      font-size: 1.125rem;
    }
  }

  .spec_a {
    margin-top: 0.625rem;
    background: #fff;
    height: 17.375rem;
    overflow-y: scroll;
    position: absolute;
    top: 2.5rem;

    h5 {
      display: block;
      line-height: 2.5rem;
      text-align: left;
      padding-left: 1.25rem;
    }

    .option {
      display: flex;
      padding: 0 1.25rem;
      flex-wrap: wrap;

      .cur {
        border: solid 0.0625rem #f15353;
        background: #faf0f0;
      }

      li {
        padding: 0 6px;
        min-height: 1.875rem;
        line-height: 1.875rem;
        margin-right: 0.625rem;
        margin-bottom: 0.625rem;
        background: #f5f5f5;
        border: solid 0.0625rem #ebebeb;
        border-radius: 0.1875rem;
      }
    }
  }

  .add_car {
    width: 100%;
    height: 3.4375rem;
    line-height: 3.4375rem;
    background-color: #fff;
    border-top: solid 0.0625rem #ebebeb;
    position: absolute;
    bottom: 0;
    border-radius: 0 0 0.625rem 0.625rem;

    .car_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.875rem;
      height: 100%;

      .left {
        color: #f15353;
        font-size: 16px;
        text-align: left;
        flex: 0 0 13rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .good-price,
        .vip-price {
          width: 100%;
        }

        .good-price {
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vip-price {
          line-height: 1rem;
          font-size: 12px;
          color: #fdbc2e;
        }

        span {
          font-size: 12px;
        }
      }

      .right span {
        display: block;
        width: 5.5625rem;
        height: 1.875rem;
        line-height: 1.875rem;
        border-radius: 1rem;
        background: #f15353;
        color: #fff;
        font-size: 14px;
      }

      .Box {
        position: absolute;
        bottom: 0.625rem;
        right: 0.625rem;
        display: flex;

        i {
          width: 28px;
          height: 1.75rem;
          line-height: 1.75rem;
          font-size: 26px;
          color: #f15353;
        }
        i.disable{
          color:#ddd;

        }

        .icon-store_reduceLine {
          color: #aaa;
        }

        label {
          right: 2.1875rem;
          color: #333;
          font-size: 12px;
          padding: 0;
          width: 1.5rem;
          height: 1.75rem;
          overflow: hidden;
          display: inline-block;
          text-align: center;
          line-height: 1.75rem;
          vertical-align: top;
          background-origin: content-box;
          background-color: transparent;
        }
      }
    }
  }
}
.select {
  display: flex;

  span {
    outline: none;
    border: none;
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 14px;
    text-align: center;
  }

  input {
    outline: none;
    border: none;
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 14px;
    text-align: center;
  }

  i:first-child {
    background-color: #ccc;
  }

  i:last-child {
    background-color: #f15353;
  }
  i.disable{
    background-color: #ddd;
  }

  i {
    text-align: center;
    border-radius: 0.75rem;
    color: #fff;
    width: 1.25em;
    height: 1.25em;
    font-size: 1.25em;
  }
}

.leaseBox {
  padding: 0 0.5rem;
  background: #f15353;
  color: #fff;
  line-height: 1.25rem;
  height: 1.25rem;
  border-radius: 1rem;
  font-size: 12px;
  p {
    font-size: 0.75rem;
  }
}

.optionClass {
  position: relative;

  i {
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    font-size: 12px;
    position: absolute;
    top: -8px;
    right: -5px;
    background-color: #ff5d5c !important;
  }
}
</style>
