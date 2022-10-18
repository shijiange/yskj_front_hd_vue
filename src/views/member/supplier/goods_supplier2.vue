<template>
  <div id="supplier">
    <van-sticky>
      <div class="search-box">
        <div class="return" @click="goBack">
          <i class="fa fa-angle-left"></i>
        </div>
        <div class="search" @click="goToSearch">
          <van-icon class="iconfont icon-sousuo" size="1.125rem" color="#666"></van-icon>
          <input type="text" placeholder="搜索本店商品" readonly />
        </div>
        <div class="icon-a" @click="show1 = true">
          <van-icon class="iconfont icon-service" size="1.875rem" color="#666"></van-icon>
        </div>
        <div class="icon-b" @click.stop="toggleSlide()">
          <van-icon class="iconfont icon-more" size="1.875rem" color="#666"></van-icon>
        </div>
      </div>
    </van-sticky>

    <ul class="menuTop" v-if="sliderShow">
      <div class="spare">
        <van-icon class="iconfont icon-spare" size="1rem" color="#333"></van-icon>
      </div>
      <li @click="goToUrl('home', 'route')">
        <van-icon class="iconfont icon-home" size="1.25rem" color="#f5f5f5"></van-icon>
        <span>首页</span>
      </li>
      <li @click="goToUrl('orderlist', 'route')">
        <van-icon class="iconfont icon-order" size="1.25rem" color="#f5f5f5"></van-icon>
        <span>订单</span>
      </li>
      <li @click="goToUrl('member', 'route')">
        <van-icon class="iconfont icon-my" size="1.25rem" color="#f5f5f5"></van-icon>
        <span>我的</span>
      </li>
    </ul>

    <c-header :slides="slides" :category="category" @watchSort="sortOut" @bindCategory="bindCategory" :categoryShow="is_hidden_category"></c-header>

    <div class="main">
      <dl v-for="(item, i) in goods" :key="i" @click.stop.prevent="gotoDetail(item.goods_id)">
        <dt v-if="item.thumb">
          <img :src="item.thumb" @click.stop.prevent="gotoDetail(item.goods_id)" />
        </dt>
        <dt v-if="!item.thumb">
          <img src="../../../assets/images/img_default.png" />
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
          <div class="s2" v-if="false">
            <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
          </div>
          <div :style="styleCon" class="s3-price">
            <small>{{ $i18n.t("money") }}</small>
            <span class="s3-price-span1" v-if="item.vip_level_status && item.vip_level_status.status == 1">
              {{ item.vip_level_status.word }}
            </span>
            <span class="s3-price-span2" v-if="item.has_option == 1 && item.min_price">
              {{ item.min_price }}
            </span>
            <span class="s3-price-span2" v-else>
              {{ item.price }}
            </span>
          </div>

          <div style="color: #888; font-size: 12px;" v-if="false" v-show="item.is_open_micro == 1">会员价:{{ $i18n.t("money") }}{{ item.price_level == 1 ? item.vip_price : item.vip_next_price }}</div>
          <div class="s3" v-if="item.estimated_commission > 0 && false" style="color: #888; font-size: 12px;">
            <small>{{ $i18n.t("money") }}</small>
            <span>{{ $i18n.t("预估收益") }}：{{ item.estimated_commission }}</span>
          </div>
          <!-- </p> -->
        </dd>
      </dl>
    </div>

    <van-popup v-model="show1" position="center" round style="width: 80%;">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cservice">
                <div class="image"><img src="../../../assets/images/kf_online_contect@2x.png" /></div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`"><img src="../../../assets/images/kf_tel_contect@2x.png"/></a>
              </div>

              <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;" />
          </div>
        </div>
        <i class="iconfont icon-close11" @click="show1 = false"></i>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
import cHeader from "./component_category_child_header.vue";

export default {
  mixins: [scrollMixin], //加载更多
  components: { cHeader },
  data() {
    return {
      goods: [],
      category: [],
      slides: [],
      sort_name: 1,
      sort_status: 1,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      sid: "",
      cate_id: "0",

      sliderShow: false,
      show1: false,
      cservice: "",
      service_QRcode: "",
      service_mobile: "",
      is_hidden_category: true
    };
  },

  activated() {
    if (this.$route.params.fromHome === 1) {
      this.sort_name = 1;
      this.sort_status = 1;
      this.cate_id = 0;
      this.sid = this.$route.params.id;
      this.getData();
      this.getIndexData();
    } else {
      this.lastScrollHeight();
    }
    this.sliderShow = false;
  },
  methods: {
    lastScrollHeight() {
      console.log("执行");
      if (window.location.href.indexOf("#/supplier_shop2") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.goodsSupplier2ScrollTop);
        }, 200);
      }
    },
    //首页
    getIndexData() {
      $http
        .get("plugin.supplier.frontend.shop.index.index", { sid: this.$route.params.id }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.indexData = res.data;
            this.is_hidden_category = res.data.is_hidden_category == 0 ? true : false;
            this.supplierInfo = res.data.supplier;
            if (this.indexData.hasOwnProperty("cservice")) {
              this.cservice = this.indexData.cservice;
            }
            if (!this.indexData.hasOwnProperty("cservice")) {
              this.cservice = this.indexData.supplier_link;
            }
            if (this.indexData.hasOwnProperty("service_QRcode")) {
              this.service_QRcode = this.indexData.service_QRcode;
            }
            if (this.indexData.hasOwnProperty("service_mobile")) {
              this.service_mobile = this.indexData.service_mobile;
            }
            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: this.supplierInfo.store_name,
                imgUrl: this.supplierInfo.logo
              }
            );
            // if(res.data.is_room&&res.data.is_room == 1){
            // 	this.is_room = 1;
            // 	this.getLiveList(false)
            // }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;

      // this.sort_name=1;
      // this.sort_status=1;
    },
    async getData() {
      this.initData();
      let { sort_name, sort_status, sid, cate_id } = this;
      let res = await $http.get("plugin.supplier.frontend.shop.index.getThird", {
        sid,
        cate_id,
        sort_name,
        sort_status
      });
      if (res.result != 1) {
        return;
      }

      //this.category = JSON.parse(JSON.stringify(res.data.category));
      console.log(res.data.category.length);

      if (res.data.category.length != 0) {
        this.category = res.data.category;
        let obj = {
          id: 0,
          name: "全部商品",
          thumb: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/classificationicon@2x.png"
        };
        this.category.push(obj);
      }

      this.slides = res.data.slide;

      //this.cat_adv_img = res.data.cat_adv_img;
      this.goods = res.data.goods.data;

      this.isLoadMore = true;
      this.total_page = res.data.goods.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

      //console.log(res);
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
          .get("plugin.supplier.frontend.shop.index.getThird", {
            page: this.page,
            sid: this.sid,
            cate_id: this.cate_id,
            sort_name: this.sort_name,
            sort_status: this.sort_status
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
    toggleSlide() {
      this.sliderShow = !this.sliderShow;
      console.log("ssssssss", this.sliderShow);
    },
    //返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },

    //跳转搜素
    goToSearch() {
      this.$router.push(this.fun.getUrl("SupplierSearch", { sid: this.$route.params.id }));
    },
    gotoDetail(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    //分享
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => {});
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.supplierInfo.store_name) ? data.share.title : that.supplierInfo.store_name;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.supplierInfo.logo) ? data.share.icon : that.supplierInfo.logo;
        // let desc = "";
        // if (data.shop && data.shop.share && data.shop.share.desc) {
        //   desc = data.shop.share.desc;
        // }
        let _desc = that.fun.isTextEmpty(data.shop.share.desc) ? "" : data.shop.share.desc;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    //跳转
    goToUrl(href, type) {
      if (type == "href") {
        window.location.href = href;
      } else if (type == "route") {
        if (href == "orderlist") {
          this.$router.push(this.fun.getUrl(href, { status: "0" }));
        } else {
          console.log(this.fun.getUrl(href));
          this.$router.push(this.fun.getUrl(href));
        }
      }
    },
    otherScroll() {
      this.sliderShow = false;
    }
  },
  mounted() {
    window.goodsSupplier2ScrollTop = 0;
    this.clientWidths = document.body.clientWidth;
  },
  beforeRouteLeave(to, from, next) {
    window.goodsSupplier2ScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
    console.log(window.goodsSupplier2ScrollTop);
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.sort_name = 1;
      this.sort_status = 1;
      this.sid = this.$route.params.id;
      this.getData();
      this.getIndexData();
    }
    this.clientWidths = document.body.clientWidth;
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#supplier {
  position: relative;

  .search-box {
    position: relative;
    display: -webkit-box;
    background-color: #fff;
    height: 2.8125rem;
    // border-bottom: solid 0.0625rem #ebebeb;

    .return {
      width: 2.8125rem;
      height: 2.8125rem;
    }

    .fa-angle-left {
      font-size: 1.5rem;
      line-height: 2.8125rem;
      color: #666;
    }

    .search {
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
      padding: 0 0.625rem;
      height: 1.75rem;
      line-height: 1.75rem;
      text-align: left;
      width: 13.75rem;
      border: solid 0.0625rem #666;
      border-radius: 0.875rem;

      input {
        margin-left: 0.375rem;
        border: none;
      }
    }

    .icon-b {
      width: 2.8125rem;
      height: 2.8125rem;
      line-height: 2.8125rem;
      position: absolute;
      right: 0;
      text-align: center;
      display: flex;
      align-items: center;
    }

    .icon-a {
      width: 2.8125rem;
      height: 2.8125rem;
      line-height: 2.8125rem;
      position: absolute;
      right: 2.8125rem;
      text-align: center;
      display: flex;
      align-items: center;
    }
  }
}

.main {
  // overflow: hidden;
  // margin-right: -0.0625rem;
  padding: 0.5rem 0.75rem;
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

      /* line-height: 30px; */
      text-align: left;
      margin: 0 0.3125rem;
      margin: 0 0.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-break: break-all;
      overflow: hidden;
      // text-overflow: ellipsis;

      /* white-space:nowrap */
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
      // margin: 0.25rem 0.375rem;
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

.menuTop {
  padding: 0 0.625rem;
  position: fixed;
  right: 50%;
  transform: translateX(11.2rem);
  z-index: 110;
  background: rgba(51, 51, 51, 0.9);
  color: #f0f0f0;
  border-radius: 0.25rem;
  width: 7.5rem;
  opacity: 1;

  .spare {
    position: absolute;
    right: 0.5rem;
    top: -0.8375rem;

    i {
      opacity: 0.9;
    }
  }

  li {
    display: flex;
    font-size: 14px;
    height: 2.25rem;
    border-bottom: solid 0.0625rem #d6d6d6;

    i {
      line-height: 2.25rem;
      margin-right: 0.375rem;
    }

    span {
      line-height: 2.25rem;
    }
  }

  li:last-child {
    border: none;
  }
}

.pop-content {
  width: 100%;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}
</style>
