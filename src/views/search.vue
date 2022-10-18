<template>
  <div id="search-box-first" transition="fadeInLeft">
    <div v-show="!isShow">
      <loading :show="true"></loading>
    </div>

    <div id="soso" ref="soso" class="uou" :class="[{ mout: amout }, this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="search">
        <div class="back" @click="goback"><i class="fa fa-angle-left"></i></div>
        <div class="search-box">
          <form @submit.prevent action="#" id="search-form">
            <input type="search" ref="search_input" placeholder="请输入内容" @keypress="enterSearch" v-model="inputs" @focus="hidebox" @blur="searchBlur" />
          </form>
          <i ref="search_icon" class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
        </div>
        <div style="position: absolute; right: 1rem;">
          <i class="fa fa-th-large" v-show="view" @click="$store.commit('views')"></i>
          <i class="fa fa-th-list" v-show="!view" @click="$store.commit('views')"></i>
        </div>
      </div>

      <!-- 搜索历史 -->
      <div>
        <!-- 动态获取到soso的高度，需要 元素显示隐藏，页面重绘 -->
        <div v-show="pageReload"></div>
        <transition name="fateOut" v-on:enter="fateOutEnter" v-on:after-leave="fateOutLeave">
          <sarchHistory v-show="showHistory" :storageName="storageName" ref="searchHistory" @clickTag="serachTag" @popTag="getSosoHeight"></sarchHistory>
        </transition>
      </div>

      <c-sort :show="true" @sortIn="sortOut" @showscreen="showbox" text="搜索结果" :fatherTitle="fatherTitle"></c-sort>
    </div>
    <div :style="{ height: sosoH + 'px', display: block }"></div>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <yz-blank v-show="isShow" :datas="goods" text="没找到相关产品，换个词搜搜吧"></yz-blank>
      <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
        <c-goodsList :goods="goods" :goods_template="goods_template" text="搜索结果" class="osll" :loading="!isLoadMore" :fatherTitle="fatherTitle" :classificationActiveName="classificationActiveName"   :brandActiveName="brandActiveName" :attrZhuge="attrZhuge"></c-goodsList>
      </d-list>
    </van-pull-refresh>

    <U_backup :btnFlag="btnFlag" :id="1" :datas="btnData"></U_backup>

    <template v-if="show">
      <van-popup v-model="show" position="right" @touchMove.stop>
        <div class="screening">
          <span class="tabs" v-if="brand && brand.length > 0">{{ screentitle[0] }} </span>
          <div id="div1">
            <div v-for="(val, key) in brand" :key="key" @click="screenbrand(val.id)">
              <img :src="val.logo" />
              <span style="word-break: break-all;">{{ val.name }}</span>
            </div>
          </div>
          <template v-if="!istypeclass">
            <!-- 如果是点击分类进来的就不显示 -->
            <span class="tabs">{{ screentitle[1] }} </span>
            <div id="div2">
              <van-collapse v-model="activeNames" accordion>
                <div v-for="(val, key) in classification1" :key="key" @click="classificationtype(val.id, key)">
                  <van-collapse-item v-show="val.name" :title="val.name" :name="key" :is-link="val.son.length > 0" :icon="classificationkey == key ? 'passed' : ''">
                    <div class="classify">
                      <div v-for="(val1, key1) in val.son" :key="key1" class="divbox1" :class="{ m100: classificationkey1 == key1 }">
                        <p :class="{ chooseFir: classificationkey1 == key1 }" @click.stop="classificationtype1(val1.id, key1)" v-show="classificationkey1 == key1">
                          <span class="none-choose" :class="{ color1: classificationkey1 != key1 }">
                            <img class="img-box" src="../assets/images/current@3x.png" alt="" />
                          </span>
                          <span>{{ val1.name }}</span>
                        </p>

                        <p :class="{ chooseFir: classificationkey1 == key1 }" @click.stop="classificationtype1(val1.id, key1)" v-show="classificationkey1 == null">
                          <span class="none-choose" :class="{ color1: classificationkey1 != key1 }">
                            <img class="img-box" src="../assets/images/current@3x.png" alt="" />
                          </span>
                          <span>{{ val1.name }}</span>
                        </p>

                        <div class="box-second">
                          <div v-for="(val2, key2) in val1.has_many_children" :key="key2" @click.stop="classificationtype2(val2.id, key2)" v-show="classificationkey1 == key1" class="divbox2">
                            <p
                              :class="{
                                'choose-third': classificationkey2 == key2
                              }"
                            >
                              <span>{{ val2.name }}</span>
                              <span :class="{ color1: classificationkey2 != key2 }"> <img class="img-box2" src="../assets/images/cur@3x.png" alt=""/></span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </van-collapse-item>
                </div>
              </van-collapse>
            </div>
          </template>
          <span class="tabs" v-if="attr && attr.length > 0">{{ screentitle[2] }} </span>
          <div id="div3">
            <p v-for="(val, key) in attr" :key="key" @click="selectattr(key, val)">
              <span class="title">{{ val.name }}</span>
              <span class="choose" :class="{ color1: val.show }">
                <img class="img-box" src="../assets/images/current@3x.png" alt="" />
              </span>
            </p>
          </div>

          <span class="tabs" v-if="tagname && tagname.length > 0">{{ screentitle[3] }} </span>
          <div id="div4">
            <dl v-for="(val, key) in tagname" :key="key">
              <dt>
                {{ val.name }}
                <span @click="showtagname(key)" v-if="val.value.length > 2"
                  >{{ showtagnamekey != key ? "更多" : "收起" }}
                  <span class="icon" :class="{ icon1: showtagnamekey == key }"></span>
                </span>
              </dt>
              <dd :class="{ color2: showtagnamekey != key }" class="div4-dd">
                <span v-for="(val1, key1) in val.value" :key="key1" @click="selectname($event, val1.id, key, key1)" :class="{ color: val1.record == 2 }" :data="val1.id">{{ val1.name }} </span>
              </dd>
            </dl>
          </div>
          <div class="button">
            <div class="btn" @click="resetnames">重置</div>

            <div class="btn" @click="screen">确定</div>
          </div>
        </div>
      </van-popup>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import cGoodsList from "components/goodsList";
import cSort from "components/sort";
import U_backup from "components/new_diy/backup";
import sarchHistory from "components/searchHistory";
import DList from "@/components/dlist";
import loading from "components/loading";
import yzBlank from "components/ui_components/yz_blank";
// import { scrollMixin } from '../utils/mixin';

export default {
  // mixins: [scrollMixin], //加载更多
  data() {
    return {
      istypeclass: false, //是否点击分类进来的
      isShow: true,
      title: "搜索",
      inputs: "",
      amout: false,
      order_by: "",
      order_field: "",
      screentitle: ["品牌", "分类", "属性", "高级选项"], //筛选标题
      show: false,
      brand: {},
      attr: [
        {
          name: "推荐商品",
          show: true
        },

        {
          name: "新品上市",
          show: true
        },

        {
          name: "热卖商品",
          show: true
        },

        {
          name: "促销商品",
          show: true
        },

        {
          name: "限时抢购",
          show: true
        }
      ],
      attrstr: [],
      attrkey: [],
      classification1: [],
      classificationkey: null,
      classificationkey1: null,
      classificationkey2: null,
      typestring: "", //搜索分类id
      namestring: "",
      namekey: null,
      classificationshow: false,
      tagname: [],
      showtagnamekey: null,

      brandId: "",
      filterId: [],
      activeNames: null,

      btnFlag: false, //显示回到顶部
      btnData: {
        button_size: 40,
        over_top: 500,
        position_location: "right",
        icon_url: ""
      },

      loading: false,
      goods: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      goods_template: "",
      // 下拉刷新
      isLoading: false,
      sosoH: 84, // 头部栏的高度
      pageReload: false, // 通过if刷新页面
      storageName: "searchHistory", // storage的key
      showHistory: false, // 显示历史搜索记录
      deliverId: 0, //自提点id
      fatherTitle:'电商搜索列表页',
      brandActiveName:'',
      classificationActiveName:'',
      attrZhuge:''
    };
  },
  computed: {
    ...mapState(["view"]),
    zoneId() {
      if (this.$store.state.zoneId == "") {
        this.$store.commit("setZoneId", window.localStorage.getItem("zoneId"));
      }
      return this.$store.state.zoneId;
    }
  },
  mounted() {
    window.searchScrollTop = 0;
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "goods" || from.name === "grab_group" || from.name === "newRetailSalesGood") {
      if (toGoodListIOS) {
        toGoodListIOS({ body: "toGoodListIOS" });
      }
    }
    zhuge.track('进入电商搜索列表页');
    next();
  },
  beforeRouteLeave(to, from, next) {
    window.searchScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
    ...mapMutations(["views"]),
    lastScrollHeight() {
      if (window.location.href.indexOf("#/search?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.searchScrollTop);
        }, 200);
      }
    },

    // 动态获取头部栏的高度
    getSosoHeight() {
      this.pageReload = !this.pageReload;
      this.$nextTick(() => {
        this.sosoH = this.$refs.soso.offsetHeight;
      });
    },
    //通用功能
    showbox() {
      this.show = !this.show;
    },
    fateOutEnter() {
      this.getSosoHeight();
    },
    fateOutLeave() {
      this.getSosoHeight();
    },
    hidebox() {
      this.show = false;
      this.searchHistoryList = window.localStorage.getItem(this.storageName) ? JSON.parse(window.localStorage.getItem(this.storageName)) : [];
      if (this.searchHistoryList.length > 0) {
        this.showHistory = true;
      }
      // this.getSosoHeight();
    },
    searchBlur() {
      this.showHistory = false;
      // this.getSosoHeight();
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    screen() {
      this.hidebox();
      this.gotoSearch();
    },
    //品牌相关的功能
    getbrand() {
      $http.post("goods.brand.get-brand").then(res => {
        this.brand = res.data.data;
      });
    },
    screenbrand(id) {
      this.brandId = id;
      this.hidebox();
      this.gotoSearch();
    },
    //分类相关的功能
    getclassification() {
      $http
        .get("goods.category.search-goods-category")
        .then(res => {
          this.classification1 = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    classificationtype(id, key) {
      this.typestring = id;

      if (this.classificationkey == key) {
        this.classificationkey = null;
        return;
      } else {
        this.classificationkey = key;
      }
      this.classificationkey1 = null;
      this.classificationkey2 = null;
      this.classificationshow = false;
    },
    classificationtype1(id, key) {
      this.typestring = id;
      this.classificationshow = true;

      if (this.classificationkey1 == key) {
        this.classificationkey1 = null;
      } else {
        this.classificationkey1 = key;
      }

      this.classificationkey2 = null;
    },
    classificationtype2(id, key) {
      if (this.typestring == id) {
        this.typestring = "";
      } else {
        this.typestring = id;
      }

      if (this.classificationkey2 == key) {
        this.classificationkey2 = null;
      } else {
        this.classificationkey2 = key;
      }
    },
    searchsure() {
      let data = {
        "&search[category]": this.typestring
      };
      this.screen(data);
    },
    //属性相关的功能
    findstr(attrstr, key) {
      let index = this.attrstr.indexOf(attrstr);
      index + 1 ? this.attrstr.splice(index, 1) : this.attrstr.push(attrstr);
      let index1 = this.attrkey.indexOf(key);
      index1 + 1 ? this.attrkey.splice(index1, 1) : this.attrkey.push(key);
    },
    resetattrs() {
      this.attrstr = [];
      this.attrkey = [];
    },
    suresearch() {
      let data = {
        "search[product_attr]": this.attrstr.join(",")
      };
      this.screen(data);
    },
    selectattr(key, val) {
      //属性选择项
      switch (key) {
        case 0:
          this.findstr("is_recommand", key);
          break;
        case 1:
          this.findstr("is_new", key);
          break;
        case 2:
          this.findstr("is_hot", key);
          break;
        case 3:
          this.findstr("is_discount", key);
          break;
        case 4:
          this.findstr("limit_buy", key);
          break;
      }
      if (!val.show) {
        this.$set(val, "show", true);
      } else {
        this.$set(val, "show", false);
      }
    },
    //标签组相关功能
    showtagname(key) {
      if (key == this.showtagnamekey) {
        this.showtagnamekey = null;
      } else {
        this.showtagnamekey = key;
      }
    },
    getname() {
      $http
        .get("goods.filtering.index")
        .then(res => {
          if (res.result == 1) {
            this.tagname = res.data;
            for (let i = 0; i < this.tagname.length; i++) {
              for (let y = 0; y < this.tagname[i].value.length; y++) {
                this.tagname[i].value[y].record = 1;
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectname(e, id, key1, key2) {
      if (e.target.className.indexOf("color") == -1) {
        e.target.className = "color"; //切换按钮样式
        if (this.filterId.includes(id)) {
          return;
        } else {
          this.filterId.push(id);
        }

        //写逻辑 增加name
      } else {
        e.target.className = ""; //切换按钮样式
        let index = this.filterId.indexOf(id);
        this.filterId.splice(index, 1);
        //写逻辑 减少name
      }

      if (this.tagname[key1].value[key2].record == 1) {
        this.$set(this.tagname[key1].value[key2], "record", 2);
      } else {
        this.$set(this.tagname[key1].value[key2], "record", 1);
      }
    },
    resetnames() {
      this.namestring = null;
      this.showtagnamekey = null;
      this.namekey = null;

      this.brandId = "";
      this.attrstr = [];
      this.filterId = [];
      this.brandId = "";
      this.attr = [
        {
          name: "推荐商品",
          show: true
        },

        {
          name: "新品上市",
          show: true
        },

        {
          name: "热卖商品",
          show: true
        },

        {
          name: "促销商品",
          show: true
        },

        {
          name: "限时抢购",
          show: true
        }
      ];
      this.removeClass();
      this.resettypes();
    },
    resettypes() {
      this.typestring = "";
      this.classificationkey = null;
      this.classificationkey1 = null;
      this.classificationkey2 = null;
    },
    removeClass() {
      let dd = document.getElementsByClassName("div4-dd");

      for (let i = 0; i < dd.length; i++) {
        let span = dd[i].getElementsByTagName("span");
        for (let y = 0; y < span.length; y++) {
          span[y].setAttribute("class", "");
        }
      }
      for (let i = 0; i < this.tagname.length; i++) {
        for (let y = 0; y < this.tagname[i].value.length; y++) {
          if (this.tagname[i].value[y].record == 2) {
            this.tagname[i].value[y].record = 1;
          }
        }
      }
    },

    sortOut(e) {
      this.hidebox();
      console.log("得到的信息", e);
      if (this.goods.length == 0) {
        return;
      }
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.gotoSearch();
    },
    search() {
      //搜索页聚焦状态下搜索关键词获取不到
      if (this.$refs.search_input) {
        this.$refs.search_input.blur();
      }

      // 添加搜索记录
      if (this.$refs.searchHistory) {
        this.$refs.searchHistory.appendKeywords(this.inputs);
        this.getSosoHeight();
      }
      this.$nextTick(() => {
        this.gotoSearch();
      });
    },

    // 点击tag搜索
    serachTag(data) {
      this.inputs = data;
      this.search();
    },
    goback() {
      this.$router.go(-1);
    },
    slider() {
      window.onscroll = () => {
        let top = document.documentElement.scrollTop || document.body.scrollTop;

        if (top > 80 && !this.showHistory) {
          this.$refs.search_input.blur();
        }
        if (top >= 80) {
          this.amout = true;
          this.btnFlag = true;
        } else {
          this.amout = false;
          this.btnFlag = false;
        }
      };
    },
    loadTop() {
      this.gotoSearch();
    },
    gotoSearch() {
      this.brandActiveName='';
      this.attrZhuge='';
      this.classificationActiveName ='';
      this.isShow = false;
      this.page = 1;
      this.goods = [];
      this.loading = true;
      let json = {
        "search[keyword]": this.inputs,
        page: this.page,
        order_field: this.order_field,
        order_by: this.order_by,
        "search[couponid]": this.$route.params.coupon,
        "search[as_id]": this.zoneId,
        "search[brand_id]": this.brandId,
        "search[product_attr]": this.attrstr.toString(),
        "search[filtering]": this.filterId.toString(),
        "search[category]": this.typestring
      };
      //console.log(this.typestring);
     // 品牌
      let brandAttr=this.brand;
      for(let i=0;i<this.brand.length;i++){
        if(brandAttr[i].id == this.brandId){
          this.brandActiveName = brandAttr[i].name;
        }
      }
      //分类
     if(this.activeNames){
       this.classificationActiveName=this.classification1[this.activeNames].name;
     }
      //属性，this.attrkey,数组,对应的下标，通过下标找到name属性
      let attrkeyZhuge= this.attrkey;
      let attrZhu = this.attr;
      for(let i=0;i<attrkeyZhuge.length;i++){
        this.attrZhuge += this.attrZhuge ? ','+attrZhu[attrkeyZhuge[i]].name : attrZhu[attrkeyZhuge[i]].name;
      }
      //console.log(this.attrZhuge);
      zhuge.track('电商搜索列表页-检索条件筛选点击确定',{
        '品牌':this.brandActiveName,
        '分类名称':this.classificationActiveName,
        '属性名称':this.attrZhuge//空，一个或者多个
      });
      if (this.$route.query.plugin_id == 1) {
        // 筛选平台商品
        json["search[plugin_id]"] = 0;
      }
      let _url = "";
      if (!this.fun.isTextEmpty(this.$route.query.fromPage) && this.$route.query.fromPage == 1) {
        _url = "plugin.pending-order.frontend.wholesale-area.goods-list";
      } else if (this.$route.name == "selfPickSearch") {
        _url = "plugin.supplier.frontend.category.search-goods";
      } else if (this.$route.query.CommodityRights == "CommodityRights") {
        _url = "plugin.love-speed-pool.frontend.goods.getList";
      } else {
        _url = "plugin.overseas.frontend.goods.search-goods";
      }
      $http.get(_url, json, "...").then(res => {
        this.isShow = true;
        this.isLoading = false;
        if (res.result == 1) {
          window.scrollTo(0, 0);
          this.isLoadMore = true;
          this.loading = false;
          this.total_page = res.data.last_page || 0;
          this.goods_template = res.data.goods_template;
          this.goods = res.data.data;
          // console.log("商品内容", this.goods);

          // 搜索结果为空
          if (this.total_page <= 1) {
            this.isLoadMore = false;
          }
          // 设置分享信息
          this.shareConfigs({
            inputs: this.inputs
            // order_field: this.order_field,
            // order_by: this.order_by,
            // zoneId: this.zoneId,
            // brandId: this.brandId,
            // attrstr: this.attrstr.toString(),
            // filterId: this.filterId.toString(),
            // typestring: this.typestring
          });
        } else {
          this.goods = [];
          this.isLoadMore = false;
          this.isShow = true;
        }
      });
    },
    getMoreData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      console.log("加载更多启动");
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        console.log("没了");
      } else {
        this.page += 1;
        let json = {
          "search[keyword]": this.inputs,
          page: this.page,
          order_field: this.order_field,
          order_by: this.order_by,
          "search[couponid]": this.$route.params.coupon,
          "search[as_id]": this.zoneId,
          "search[brand_id]": this.brandId,
          "search[product_attr]": this.attrstr.toString(),
          "search[filtering]": this.filterId.toString(),
          "search[category]": this.typestring
        };
        if (this.$route.query.plugin_id == 1) {
          // 筛选平台商品
          json["search[plugin_id]"] = 0;
        }
        let _url = "";
        if (!this.fun.isTextEmpty(this.$route.query.fromPage) && this.$route.query.fromPage == 1) {
          _url = "plugin.pending-order.frontend.wholesale-area.goods-list";
        } else if (this.$route.name == "selfPickSearch") {
          _url = "plugin.supplier.frontend.category.search-goods";
        } else if (this.$route.query.CommodityRights == "CommodityRights") {
          _url = "plugin.love-speed-pool.frontend.goods.getList";
        } else {
          _url = "plugin.overseas.frontend.goods.search-goods";
        }
        $http
          .get(_url, json, "...")
          .then(res => {
            this.isLoadMore = true;
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.data;
              this.goods = this.goods.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    shareConfigs(_data) {
      let mid = this.fun.getKeyByMid();
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/search?i=" + this.fun.getKeyByI() + "&mid=" + mid;
      Object.keys(_data).forEach(key => {
        if (_data[key]) {
          _url = `${_url}&${key}=${_data[key]}`;
        }
      });
      this.fun.wxShare(
        "",
        {},
        {
          link: _url
        },
        data => {}
      );
    },
    getShareConfig() {
      let _arr = this.$route.query;
      let getKeys = ["inputs", "order_field", "order_by", "zoneId", "brandId", "attrstr", "filterId", "typestring"];
      Object.keys(_arr).forEach(key => {
        if (getKeys.indexOf(key) > -1) {
          this[key] = _arr[key];
        }
      });
    },
    async getNowPackageDeliver() {
      //确定关联自提点
      let deliverIDStorage = sessionStorage.getItem("deliverId") || null; //获取当前会话是否存储了自提点id
      let _href = window.location.href; //当前链接
      let lat, lng;
      if (deliverIDStorage) {
        //sessionStorage 有值，说明某个页面之前有请求记录过，可直接请求分类
        if (deliverIDStorage != this.deliverId) {
          this.deliverId = deliverIDStorage;
          this.search();
        }
        return;
      } else if (_href.indexOf("deliverId") > -1) {
        let _dID = this.fun.getKey("deliverId"); //获取链接上的参数，自提点id
        this.deliverId = _dID;
      } else {
        await this.fun
          .getLocation("正在定位中，请稍等")
          .then(res => {
            lat = res.point.lat;
            lng = res.point.lng;
          })
          .catch(err => {
            console.log("定位error：：", err);
          });
      }
      let _json = {};
      if (lat) {
        _json = {
          lng: lng || "",
          lat: lat || ""
        };
      }
      if (this.deliverId) {
        _json.deliver_id = this.deliverId;
      }

      $http.get("plugin.package-deliver.frontend.decorate-deliver.getNowPackageDeliver", _json, ".").then(
        response => {
          if (response.result === 1) {
            this.search();
            this.deliverId = response.data.id;
            window.sessionStorage.setItem("deliverId", response.data.id); //储存到sessionStorage
            this.fun.wxShare();
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  created() {
    // this.search();
    if (this.$route.params.fromHome !== 1) {
      this.goods = [];
      this.inputs = "";
      this.getclassification();
      this.getname();
      this.getbrand();
      if (this.$route.name == "selfPickSearch") {
        this.getNowPackageDeliver(); //可优化成promis，流程
      } else {
        this.search();
      }
    }
    // if (this.$route.params.coupon || this.$route.params.kyes) {
    //   console.log("created-----------------------");
    //   this.search(n);
    // }
  },
  activated() {
    this.getShareConfig();
    if ((this.$route.params.id != "" && !isNaN(this.$route.params.id)) || this.$route.query.cate_id) {
      this.typestring = this.$route.params.id || this.$route.query.cate_id;
      this.istypeclass = true;
      this.fun.setWXTitle("分类列表");
    }
    this.amout = false;
    this.show = false;
    this.slider();
    this.$nextTick(() => {
      this.sosoH = this.$refs.soso.offsetHeight;
    });
    if (this.$route.params.coupon || this.$route.params.kyes) {
      console.log("activated-----------------------");
      this.search();
    } else if (this.$route.params.fromHome === 1) {
      this.inputs = "";
      this.getclassification();
      this.getname();
      this.getbrand();
      if (this.$route.name == "selfPickSearch") {
        this.getNowPackageDeliver(); //可优化成promis，流程
      } else {
        this.search();
      }
    } else {
      this.lastScrollHeight();
      // let json = JSON.parse(window.localStorage.getItem('searchBrandJSON'));
      // let key = window.localStorage.getItem('searchBrandKey');
      // this.searchAgain(json);
      // this.inputs = key;
      // 不是从上一级点进的不清空
    }
  },
  components: {
    cGoodsList,
    cSort,
    U_backup,
    sarchHistory,
    DList,
    loading,
    yzBlank
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search-box-first {
  width: 100%;

  .screening {
    width: 18rem;
    min-height: 100vh;
    background: #fff;

    .tabs {
      font-weight: bold;
      font-size: 16px;
      display: block;
      margin: 0.5rem 0.5rem 0 0.5rem;
      text-align: left;

      /* width: 30%; */

      /* background: #f5f5f5; */
      line-height: 1.6875rem;
      border-radius: 0.1875rem;
    }

    #div1 {
      display: flex;
      flex-wrap: wrap;

      div {
        padding-top: 0.625rem;
        width: 25%;

        img {
          display: block;
          width: 4rem;
          height: 4rem;
        }

        span {
          display: inline-block;
          margin-top: 0.625rem;
        }
      }
    }

    .classify {
      display: flex;
      flex-wrap: wrap;
    }

    .m100 {
      width: 100%;
    }

    .divbox1 {
      margin: 0.2rem 0.5rem;

      p {
        display: inline-block;
        font-size: 15px;
        text-align: center;
        line-height: 2rem;

        /* width: 5rem; */
        padding: 0 0.5rem;
        height: 2rem;
        border-radius: 5px;
        position: relative;
        background-color: #eee;

        .none-choose {
          height: 1rem;
          vertical-align: center;
        }

        .img-box {
          display: inline-block;
          width: 0.8rem;
          height: 0.8rem;
          vertical-align: center;
        }
      }

      .chooseFir {
        border: solid 1px #e60012;
        color: #e60012;
        background-color: #fff;
      }

      .box-second {
        display: flex;
        flex-wrap: wrap;
      }

      .divbox2 {
        /* width: 100%; */
        font-size: 15px;
        text-align: center;
        line-height: 2rem;

        /* text-indent: 3.125rem; */
        color: rgba(0, 0, 0, 0.5);

        /* border-bottom: solid 0.0625rem #ebebeb; */
        margin: 0.3rem;

        p {
          /* width: 5rem; */
          height: 2rem;
          position: relative;
        }

        .choose-third {
          border: solid 1px #e60012;
          background-color: #fef5f6;
        }

        .img-box2 {
          display: inline-block;
          width: 0.8rem;
          height: 0.8rem;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }

    #div2 {
      /* padding-left: 0.875rem; */
      .van-collapse-item__content {
        padding: 0;
      }

      #divbox {
        box-sizing: border-box;

        & > p {
          /* width: 100%; */
          font-size: 15px;
          text-align: left;
          line-height: 2.5rem;
          height: 2.5rem;
          font-weight: bold;

          /* text-indent: 0.625rem; */
          border-bottom: solid 0.0625rem #ebebeb;
          position: relative;
        }
      }

      footer {
        div {
          width: 3.5rem;
          line-height: 1.5rem;
          text-align: center;
          border-radius: 0.1875rem;
          float: left;

          &:nth-of-type(1) {
            border: solid 0.0625rem #f15353;
            background: #f15353;
            color: #fff;
            margin: 1rem 0 0 60%;
          }

          &:nth-of-type(2) {
            border: solid 0.0625rem #f15353;
            color: #f15353;
            background: #fff;
            margin: 1rem 0 0 5%;
          }
        }
      }
    }

    #div3 {
      box-sizing: border-box;
      padding-left: 0.875rem;

      p {
        font-size: 15px;
        text-align: left;
        line-height: 2.5rem;
        height: 2.5rem;

        /* text-indent: 0.625rem; */
        border-bottom: solid 0.0625rem #ebebeb;
        position: relative;
        display: flex;

        .title {
          flex: 1;
        }

        .choose {
          flex: 0 0 2rem;
        }

        .img-box {
          display: inline-block;
          width: 0.8rem;
          height: 0.8rem;
        }

        /* span {
          position: absolute;
          right: 1rem;
          top: 1rem;
          display: block;
          width: 1.25rem;
          height: 0.625rem;
          border: solid 0.1875rem #f15353;
          border-top: transparent;
          border-right: transparent;
          transform: rotate(-45deg);
        } */
      }

      div {
        width: 3.5rem;
        line-height: 1.5rem;
        text-align: center;
        border-radius: 0.1875rem;
        float: left;

        &:nth-of-type(1) {
          border: solid 0.0625rem #f15353;
          background: #f15353;
          color: #fff;
          margin: 1rem 0 0 60%;
        }

        &:nth-of-type(2) {
          border: solid 0.0625rem #f15353;
          color: #f15353;
          background: #fff;
          margin: 1rem 0 0 5%;
        }
      }
    }

    #div4 {
      dl {
        box-sizing: border-box;
        padding: 0 0.875rem;
        font-size: 15px;

        dt {
          text-align: left;
          line-height: 2.5rem;
          text-indent: 0.9375rem;
          font-weight: bold;

          span {
            float: right;
            font-size: 13px;
            color: #c9c9c9;
            font-weight: normal;

            .icon {
              width: 0.4375rem;
              height: 0.4375rem;
              margin: 0.9375rem 0.9375rem 0 0.3125rem;
              border: solid 0.0625rem #c9c9c9;
              border-left: transparent;
              border-top: transparent;
              transform: rotate(45deg);
            }

            .icon1 {
              width: 0.4375rem;
              height: 0.4375rem;
              margin: 0.9375rem 0.9375rem 0 0.3125rem;
              border: solid 0.0625rem #c9c9c9;
              border-left: transparent;
              border-top: transparent;
              transform: rotate(225deg);
            }
          }
        }

        dd {
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          border-bottom: solid 0.0625rem #ebebeb;

          span {
            display: block;
            background: #f5f5f5;
            width: 4.9375rem;
            line-height: 1.875rem;
            height: 1.875rem;
            float: left;
            margin: 0 0.625rem 0.75rem 0;
            border-radius: 0.1875rem;
            padding: 0 0.125rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          span:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }

  .button {
    width: 100%;
    height: 3rem;
    line-height: 2rem;
    display: flex;
    background: #fff;
    padding: 0 0.5rem 0.5rem 0;

    div {
      width: 3.5rem;
      line-height: 2rem;
      text-align: center;
      border-radius: 0.1875rem;

      &:nth-of-type(1) {
        border: solid 0.0625rem #f15353;
        background: #f15353;
        color: #fff;
        margin: 0.5rem 0 0 50%;
      }

      &:nth-of-type(2) {
        border: solid 0.0625rem #f15353;
        color: #f15353;
        background: #fff;
        margin: 0.5rem 0 0 5%;
      }
    }

    .btn {
      flex: 1;
    }
  }

  .color {
    color: #f15353;
    background: #fff !important;
    border: solid 0.0625rem #f15353;
  }

  .color1 {
    display: none !important;
  }

  .color2 {
    max-height: 2.625rem;
  }

  .fade1-enter-active {
    transition: 0.3s;
  }

  .fade1-enter,
  .fade1-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    transform: translateX(100%);
  }

  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
  }

  .mout {
    top: -2.25rem;
  }
}

#search-box-first {
  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  .pcStyle {
    width: 375px;
  }

  #sort {
    /* line-height: 2.5rem; */
    font-size: 14px;
  }

  .mout {
    top: -2.25rem;
  }
}

.search {
  height: 2.875rem;
  line-height: 2.875rem;
  position: relative;
  display: flex;
  overflow: hidden;
  background: #fff;
  // border-bottom: 0.0625rem solid #f5f5f5;
  .back {
    width: 2.8125rem;

    i {
      line-height: 2.875rem;
      font-size: 1.5rem;
    }
  }

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin-top: 0.5rem;
    padding: 0 0.625rem;
    background-color: #f2f2f2;
    height: 1.75rem;
    line-height: 1.75rem;
    border-radius: 0.875rem;

    #search-form {
      flex: 1;
      margin-right: 0.5rem;
    }

    input {
      width: 100%;
      line-height: 1.75rem;
      border: none;
      color: #333;
    }

    i {
      flex: 0 0 1.5rem;
    }
  }
}

.search::after {
  height: 1px;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: 0;
  content: "";
  width: 100%;
  background-image: linear-gradient(0deg, #f5f5f5 50%, transparent 0);
}

.fateOut-enter,
.fateOut-leave-to {
  opacity: 0;
  // transform: scaleY(0);
}

.fateOut-enter-to,
.fateOut-leave {
  opacity: 1;
  // transform: scaleY(1);
}

.fateOut-enter-active,
.fateOut-leave-active {
  transition: all 0.2s;
  transform-origin: top;
}
</style>
