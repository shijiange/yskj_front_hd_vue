<template>
  <div id="category" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
    <van-sticky>
      <div class="search-box">
        <div class="search-content">
          <form @submit.prevent action="#">
            <input type="search" placeholder="请输入内容" @keypress="enterSearch" v-model="goods_name" />
          </form>
          <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="enterSearch"></i>
        </div>
      </div>
    </van-sticky>

    <c-header :cat_set="cat_set" :top_img="top_img" :category="category" @watchSort="sortOut" @bindCategory="bindCategory"></c-header>

    <!-- <p v-for="item in 100">{{item}}</p> -->
    <div class="tips">
      <p class="icon">
        <van-icon name="success" />
      </p>
      根据大部分用户选择的商品，为你推荐
    </div>
    <yz-blank v-show="view" :datas="goods" text="暂无信息" :isBtn="false"></yz-blank>
    <div class="main" v-show="view">
      <dl v-for="(item, i) in goods" :key="i" @click.stop.prevent="gotoDetail(item.id)">
        <dt v-if="item.thumb">
          <img :src="item.thumb" @click.stop.prevent="gotoDetail(item.id)" />
        </dt>
        <dt v-if="!item.thumb">
          <img src="../../assets/images/img_default.png" />
        </dt>
        <dd class="m-text" style="-webkit-box-orient: vertical;">
          {{ item.title | escapeTitle }}
        </dd>
        <dd
          class="s3"
          style="line-height: 1.5625rem;
            height: 3.125rem;
            margin: 0.25rem 0.375rem;"
          :class="{ heightAuto: 'item.is_open_micro==1' }"
          v-if="!showprice"
        >
          <!-- <p class="s1"> -->
          <div class="s2">
            <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
          </div>
          <div :style="styleCon" class="s3-price">
            <small>{{ $i18n.t("money") }}</small>
            <span class="s3-price-span1" v-if="item.vip_level_status && item.vip_level_status.status == 1">
              {{ item.vip_level_status.word }}
            </span>
            <span class="s3-price-span2" v-else>
              {{ item.price }}
            </span>
          </div>

          <div style="color: #888; font-size: 12px;" v-show="item.is_open_micro == 1">会员价:{{ $i18n.t("money") }}{{ item.price_level == 1 ? item.vip_price : item.vip_next_price }}</div>
          <div class="s3" v-if="item.estimated_commission > 0" style="color: #888; font-size: 12px;">
            <small>{{ $i18n.t("money") }}</small>
            <span>{{ $i18n.t("预估收益") }}：{{ item.estimated_commission }}</span>
          </div>
          <!-- </p> -->
        </dd>
      </dl>
    </div>

    <div class="main2" v-show="view == false">
      <!-- 模板一 -->
      <template v-if="goods_style != '02'">
        <div class="list" v-for="(items, i) in goods" :key="i" @click.stop.prevent="gotoDetail(items.id)">
          <div class="imgs">
            <img :src="items.thumb" :key="items.thumb" v-if="items.thumb" @click.stop.prevent="gotoDetail(item.id)" />
            <img src="../../assets/images/img_default.png" v-if="!items.thumb" />
          </div>
          <div class="shop_info">
            <ul>
              <li class="title">
                {{ items.title | escapeTitle }}
              </li>
            </ul>
            <div>
              <!-- <div class="s2">
					<span v-if="parseInt(items.market_price)">{{ market_price }} {{ $i18n.t('money') }}{{ items.market_price }}</span>
				</div> -->
              <ul class="main2_price">
                <li class="member" v-if="!showprice">
                  {{ price }}
                  <small>{{ $i18n.t("money") }}</small>
                  <span v-if="items.vip_level_status && items.vip_level_status.status == 1" class="member-span-1">
                    {{ items.vip_level_status.word }}
                  </span>
                  <span v-else class="member-span-2">
                    {{ items.price }}
                  </span>
                </li>
              </ul>
              <dd class="s3" style="color: #888; font-size: 12px;" v-show="items.is_open_micro == 1">
                <small></small>
                会员价：{{ $i18n.t("money") }}{{ items.price_level == 1 ? items.vip_price : items.vip_next_price }}
              </dd>
              <div class="fit" v-if="items.estimated_commission > 0" style="color: #888; font-size: 12px;">
                <small>{{ $i18n.t("money") }}</small>
                {{ $i18n.t("预估收益") }}：{{ items.estimated_commission }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 模板二 -->
      <template v-if="goods_style == '02'">
        <div class="list" style="flex-wrap: wrap; margin-bottom: 0.75rem;" v-for="(items, i) in goods" :key="i" @click.stop.prevent="gotoDetail(items.id)">
          <div class="imgs">
            <img :src="items.thumb" :key="items.thumb" v-if="items.thumb" @click.stop.prevent="gotoDetail(item.id)" />
            <img src="../../assets/images/img_default.png" v-if="!items.thumb" />
          </div>
          <div class="shop_info">
            <ul>
              <li class="title">
                {{ items.title | escapeTitle }}
              </li>
            </ul>
            <div>
              <div class="discount">
                <div class="discount-a" v-if="items.coupon.coupon_method == 1">优惠券{{ $i18n.t("money") }}{{ items.coupon.deduct }}</div>
                <div class="discount-a" v-if="items.coupon.coupon_method == 2">折扣:{{ items.coupon.discount }}折</div>
                <div class="discount-a" v-if="items.first_dividend">推广赚{{ $i18n.t("money") }}{{ items.first_dividend }}</div>
              </div>
              <div>
                <div class="now-price" v-if="items.coupon.deduct_price">{{ price }} {{ $i18n.t("money") }}{{ items.price }}</div>
                <div class="discount-price" v-if="items.coupon.deduct_price">
                  券后价：
                  <span v-if="items.vip_level_status && items.vip_level_status.status == 1" class="member-span-1">
                    {{ items.vip_level_status.word }}
                  </span>
                  <span v-else class="member-span-2"> {{ $i18n.t("money") }}{{ items.coupon.deduct_price }} </span>
                </div>
                <div class="discount-price" v-else>{{ price }} {{ $i18n.t("money") }}{{ items.price }}</div>
              </div>
              <dd class="s3" style="color: #888; font-size: 12px;" v-show="items.is_open_micro == 1">
                <small></small>
                会员价：{{ $i18n.t("money") }}{{ items.price_level == 1 ? items.vip_price : items.vip_next_price }}
              </dd>
              <div class="fit" v-if="items.estimated_commission > 0" style="color: #888; font-size: 12px;">
                <small>{{ $i18n.t("money") }}</small>
                {{ $i18n.t("预估收益") }}：{{ items.estimated_commission }}
              </div>
            </div>
          </div>
          <div class="list-b" style="border-top: 1px solid #eee; width: 100%;">
            <div class="list-copy" @click.stop v-clipboard:copy="items.title" v-clipboard:success="onCopy">
              复制标题
            </div>
            <div class="list-share" @click.stop="postShow(items.id)">分享海报</div>
          </div>
        </div>
      </template>
    </div>
    <van-popup v-model="posterShow" closeOnClickModal="true" style="width: 17.8125rem; height: 34.5rem; padding: 0; background: none;">
      <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
        <div style="width: 100%; height: 31.25rem; border-radius: 0.375rem;">
          <img :src="'data:' + posterImg.mime + ';base64,' + posterImg.base64Image" style="width: 100%; border-radius: 0.375rem;" />
        </div>
        <!-- 关闭图标 -->
        <div class="icon_close" @click="posterShow = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import { scrollMixin } from "../../utils/mixin";
import { mapState } from "vuex";
import { Toast } from "vant";
import cHeader from "./component_category_child_header.vue";
import yzBlank from "../../components/ui_components/yz_blank";

export default {
  mixins: [scrollMixin], //加载更多
  components: { cHeader, yzBlank },
  data() {
    return {
      goods: [],
      category: [],
      cat_set: "",
      top_img: "",
      sort_name: 1,
      sort_status: 1,
      goods_name: "",
      goods_style: "01",
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      cate_id: "",

      posterShow: false, //海报显示
      posterImg: "" //海报数据
    };
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.goods_name = "";
      this.sort_name = 1;
      this.sort_status = 1;
      this.cate_id = this.$route.params.id;
      this.getData();
    }
    console.log(this.$route.params.id);
    //this.getData();
  },
  beforeRouteLeave(to, from, next) {
    window.categoryChildScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
    console.log(window.categoryChildScrollTop);
  },
  mounted() {
    window.categoryChildScrollTop = 0;
  },
  activated() {
    if (this.$route.params.fromHome === 1) {
      this.goods_name = "";
      this.sort_name = 1;
      this.sort_status = 1;
      this.cate_id = this.$route.params.id;
      this.getData();
    } else {
      this.lastScrollHeight();
    }
  },
  computed: {
    ...mapState(["view"])
  },
  methods: {
    lastScrollHeight() {
      console.log("执行");
      if (window.location.href.indexOf("#/category_child") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.categoryChildScrollTop);
        }, 200);
      }
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      // this.sort_name=1;
      // this.sort_status=1;
    },
    enterSearch() {
      this.getData();
    },
    async getData() {
      this.initData();
      let { sort_name, sort_status, cate_id, goods_name } = this;
      let res = await $http.get("goods.category.getThirdCategory", {
        cate_id,
        sort_name,
        sort_status,
        goods_name
      });
      if (res.result != 1) {
        return;
      }
      console.log("搜索结果成功");
      // console.log(res.data.category.length);
      if (!this.fun.isTextEmpty(res.data.category)) {
        this.category = res.data.category;
        let obj = {
          id: this.$route.params.id,
          name: "全部商品",
          thumb: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/classificationicon@2x.png"
        };
        this.category.push(obj);
      }
      console.log(this.category);
      this.cat_set = res.data.cat_set;
      for (let i = 0; i < 20; i++) {
        //this.goods.push(res.data.goods.data);
      }
      this.goods_style = res.data.goods_style;
      this.goods = res.data.goods.data;
      this.top_img = res.data.top_img;
      this.isLoadMore = true;
      this.total_page = res.data.goods.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

      //console.log(res);
    },
    // 复制链接
    onCopy() {
      Toast({
        message: "复制成功",
        position: "center",
        duration: 5000
      });
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("goods.category.getThirdCategory", {
            page: this.page,
            cate_id: this.cate_id,
            sort_name: this.sort_name,
            sort_status: this.sort_status,
            getData: this.getData
          })
          .then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.goods.data;

              this.goods = this.goods.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          });
      }
    },

    gotosearch() {
      this.$router.push(this.fun.getUrl("search", { fromHome: 1 }));
    },
    sortOut(e) {
      //console.log(e);
      this.sort_name = e.sort_name;
      this.sort_status = e.sort_status;
      this.getData();
    },
    bindCategory(id) {
      console.log(id);
      this.cate_id = id;
      this.getData();
    },
    gotoDetail(val) {
      console.log(val);
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    //海报生成
    postShow(id) {
      $http
        .get("goods.goods-poster.generate-goods-poster", { id: id }, "")
        .then(response => {
          // toastPoster.clear();
          if (response.result == 1) {
            this.posterImg = response.data;
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
.tips {
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;

  .icon {
    color: #fff;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(250, 0, 0);
    margin-right: 0.3rem;
  }
}

.main {
  // overflow: hidden;
  // margin-right: -0.0625rem;
  padding: 0.5rem 0.75rem;
  padding-bottom: 3.0625rem;
  background: #f5f5f5;
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-column-gap: 2%;

  dl {
    border-radius: 0.5rem;
    padding: 0;

    /* border-bottom: 1px solid #f5f5f5;
         border-right: 1px solid #f5f5f5; */
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    margin-bottom: 0.5rem;
    margin-right: 2%;
    background: #fff;
    width: 100%;

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
      text-align: left;
      margin: 0 0.3125rem;
      margin: 0 0.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-break: break-all;
      overflow: hidden;

      &.heightAuto {
        height: auto !important;
      }

      .s3-price {
        line-height: 1.5625rem;
        height: 1.5625rem;
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
      margin: 0.25rem 0.5rem;
      height: 2.25rem;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      overflow: hidden;
      line-height: 1.125rem;
      text-align: justify;
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
      flex: 1;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.625rem;
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

.search-box {
  padding: 0 2rem;
  height: 2.8125rem;
  line-height: 2.8125rem;
  display: flex;
  align-items: center;
  background: rgb(255, 255, 255);
  border-bottom: 0.0625rem solid #f4f4f4;

  .search-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.75rem;
    background: #f5f5f5;
    padding: 0 0.625rem;
    text-align: left;
    border-radius: 0.875rem;
    color: #8c8c8c;

    input {
      flex: 1;
      line-height: 1.75rem;
      border: none;
      color: #333;
    }

    i {
      position: absolute;
      right: 2.5rem;
      flex: 0 0 1.5rem;
    }
  }
}
</style>
