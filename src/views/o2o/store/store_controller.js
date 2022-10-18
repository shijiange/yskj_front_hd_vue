import cStar from "components/star";
import { Toast } from 'vant';
import BScroll from "better-scroll";
import cFlow from "components/Waterfalls_flow";
import { scrollMixin } from "utils/mixin";
import cLive from "components/goods/children/liveList";

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;
var clicktag = 0;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,

      cisLoadMore: true,
      cPage: 1,
      cTotal_page: 0,

      roomisLoadMore: true,
      roomPage: 1,
      roomTotal_page: 0,

      get_coupon: [],
      micro_communities: [],
      get_recommend_goods: [],
      store_member: [],
      store_room: [],
      tabIndex2: '店铺详情',
      tabList: ['店铺详情', '门店员工'],
      nearbyClassification: [],

      checked: true,
      value: 3,
      follow_mode: {},
      isfollow: false,
      store_id: "",
      show8: false, //过期商家
      new_comment: [],
      store: {
        comment: {
          average_score: 0,
          comment_total: 0
        },
        goods_total: 0,
        order_count: 0,
        business_hours: "9:00-22:00",
        store_address: "",
        store_mobile: "",
        operating_state: 0
      },
      category: [],
      goodsList: [],
      goodsCount: 0, //当前商品数量
      currentCategory: "",
      toolbar: false,
      showGoods: true,
      showStoreInfo: false,
      showCart: false,
      hasCart: false,
      carts: [], //购物车商品
      cartsTotal: 0.0,
      cartsNum: 0,
      goodsCarts: [], //购物车转为goods key的数组

      specid: "", //规格ID
      cartIDs: [], //购物车ID数组
      goodsCartsTotal: [],

      pageCount: 1,
      catesId: "",
      loading: false,

      show1: false,
      show2: false,
      goodsInfo: {},
      // 滚动需要的数据
      secondTitle: [],
      goods: [],
      listHeight: [],
      listCategoryHeight: [],
      scrollY: 0,
      scrollMargin: 0,
      Index: 0,
      showDis: true,
      tabIndex: 0,

      goodsCartsOld: "",
      item: "",
      tab: ["商品", "评价", "商家"],
      info: "",
      amout: false,
      loadingPopup: true
    };
  },

  created() {
    if (this.$route.params.fromHome !== 1) {
      this.show = false;
      this.showCart = false;
      this.fun.setWXTitle(this.$store.state.temp.item.janst);
      this.store_id = this.$route.params.store_id;
      this.initData();
      // this.getStoresDetails();
    }
  },
  activated() {
    this.show = false;
    this.showCart = false;
    this.fun.setWXTitle(this.$store.state.temp.item.janst);
    this.store_id = this.$route.params.store_id;

    if (this.$route.params.fromHome === 1) {
      this.initData();
      this.getStoresDetails();
    } else {
      this.getStoresDetails();
      // this.updateshoppingcart()
      this.$nextTick(() => {
        this._initScroll();
        // this._calculateCategoryHeight();
        // this._calculateHeight();
      });
    }
    if (this.$route.params.activeType === "comment") {
      this.tabIndex = 1;
    }
    window.scrollTo(0, 0);
  },
  mounted() {
    window.storeV2ScrollTop = 0;
  },
  deactivated() { },
  methods: {
    toCard(id) {
      if (id) {
        this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: id, mark: 'card' }));
      }
    },
    onCopy: function (e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    chooseTab(tab) {
      this.tabIndex2 = tab;
      if (this.tabIndex2 == '门店微贴' && this.micro_communities.length <= 0) {
        this.getStoreCommunities();
      } else if (this.tabIndex2 == '门店直播') {
        this.isLoadMore = this.cisLoadMore;
        if (this.store_room.length <= 0) {
          this.getStoreRooms();
        }
      } else if (this.tabIndex2 == '门店员工') {
        this.isLoadMore = this.roomisLoadMore;
        if (this.store_member.length <= 0) {
          this.getStoreMember();
        }
      }
    },
    getStoreMember() {
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-store-staff",
          { store_id: this.$route.params.store_id }
        )
        .then(response => {
          if (response.result == 1) {
            this.store_member = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreRooms() {
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-room",
          { store_id: this.$route.params.store_id, page: 1 }
        )
        .then(response => {
          if (response.result == 1) {
            this.roomTotal_page = response.data.last_page;
            if (this.roomTotal_page === 0) {
              this.roomisLoadMore = true;
            }
            this.store_room = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreCommunities() {
      this.cisLoadMore = false;
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-micro-communities",
          { store_id: this.$route.params.store_id, page: 1 }
        )
        .then(response => {
          if (response.result == 1) {
            this.cTotal_page = response.data.last_page;
            if (this.cTotal_page === 0) {
              this.cisLoadMore = true;
            }
            this.micro_communities = response.data.data;
            this.setCommunities();
          }
        })
        .catch(error => {
          this.cisLoadMore = true;
          console.log(error);
        });
    },
    setCommunities() {
      let arr = [];
      this.micro_communities.map(item => {
        arr.push(
          {
            id: item.id,
            title: item.title,
            praise_num: item.praise_num,
            has_one_stick_user: {
              avatar: item.user_avatar,
              nickname: item.user_nickname,
            },
            has_many_image: [{
              url: item.image,
              stick_id: item.id
            }]
          }
        );
      });
      this.nearbyClassification = arr;
    },
    getMoreData() {
      this.cisLoadMore = false;
      this.isLoadMore = false;
      this.roomisLoadMore = false;
      let flag = false;
      let url = '';
      let json = {
        store_id: this.$route.params.store_id
      };

      if (this.tabIndex2 == '门店微贴') {
        url = 'plugin.store-cashier.frontend.store.get-store-info.get-micro-communities';
        if (this.cPage >= this.cTotal_page) {
          this.cisLoadMore = true;
          this.isLoadMore = true;
        } else {
          this.cPage = this.cPage + 1;
          json.page = this.cPage;
          flag = true;
        }
      } else {
        url = 'plugin.store-cashier.frontend.store.get-store-info.get-room';
        console.log(this.roomPage, this.roomTotal_page);
        if (this.roomPage >= this.roomTotal_page) {
          this.isLoadMore = true;
          this.roomisLoadMore = true;
        } else {
          this.roomPage = this.roomPage + 1;
          json.page = this.roomPage;
          flag = true;
        }
      }

      if (flag) {
        $http
          .post(url, json, "加载中")
          .then((response) => {
            if (response.result === 1) {
              let myData = response.data.data;
              if (this.tabIndex2 == '门店微贴') {
                this.micro_communities = this.micro_communities.concat(myData);
                this.setCommunities();
              } else {
                this.store_room = this.store_room.concat(myData);
              }
            } else {
              this.cPage = this.cPage - 1;
              this.isLoadMore = false;
              this.cisLoadMore = true;
              this.roomisLoadMore = false;
            }
          },
          response => {
            // error callback
          }
          ).catch(err => {
            console.log(err);
          });
      }
    },
    loadMore() {
      this.cisLoadMore = true;
    },
    trggleCart() {
      if (this.carts.length === 0) {
        return;
      }
      this.showCart = !this.showCart;
    },
    changeTab(index) {
      this.tabIndex = index;
      this.scrollMargin = 0;
      if (this.tabIndex == 0) {
        this.$nextTick(() => {
          this._initScroll();
        });
      }
      document.documentElement.scrollTop = 0;
      // this.$refs.storeInfo_box.style.marginTop = `0px`;
      this.amout = false;
    },
    goback() {
      this.$router.go(-1);
    },
    goToAdress() {
      let point = this.fun.bd_decrypt(this.store.lng, this.store.lat);
      this.fun.goToWXAdress(point, this.store.storeName, "门店地址");
    },

    clickCount(data) {
      this.goodsCartsOld = data.total;
      this.changeCount(data);
    },
    changeCount(goodsCartsData) {
      let that = this;

      if (goodsCartsData.total < 0) {
        Toast("商品数量不能为负数");
        goodsCartsData.total = that.goodsCartsOld;
        return;
      }
      if (goodsCartsData.total < that.goodsCartsOld) {
        let lowerNum = that.goodsCartsOld - goodsCartsData.total;
        that.updateCart(goodsCartsData.id, -lowerNum);
      } else if (goodsCartsData.total > that.goodsCartsOld) {
        let addNum = goodsCartsData.total - that.goodsCartsOld;
        that.updateCart(goodsCartsData.id, addNum);
      } else if ((goodsCartsData.total = that.goodsCartsOld)) {
        return;
      }
    },
    //商品列表 加
    numberRight(foodData, goodsT) {
      //价格权限'
      if (foodData.stock == 0) {
        Toast('库存不足！');
        return;
      }
      if (goodsT && goodsT.total >= foodData.stock) {
        Toast('库存不足！');
        return;
      }
      if (foodData.vip_level_status && foodData.vip_level_status.status == 1) {
        Toast(foodData.vip_level_status.tips);
        return false;
      }
      if (this.fun.isTextEmpty(goodsT)) {
        this.addCart(foodData);
      } else {
        let goodsInputss = `goodsInputs${foodData.id}`;
        let goodsInputs = document.getElementById(goodsInputss);
        goodsInputs.blur();
        this.goodsCartsOld = goodsT.total;
        this.goodsCarts[foodData.id].total =
          Number(this.goodsCarts[foodData.id].total) + 1;
        this.addCart(foodData);
      }
    },
    //商品列表 减
    numberLeft(foodData, goodsT) {
      if (this.fun.isTextEmpty(goodsT)) {
        this.updateCart(goodsT.id, -1);
      } else {
        let goodsInputss = `goodsInputs${foodData.id}`;
        let goodsInputs = document.getElementById(goodsInputss);
        goodsInputs.blur();
        this.goodsCartsOld = goodsT.total;
        this.goodsCarts[foodData.id].total =
          Number(this.goodsCarts[foodData.id].total) - 1;
        clicktag = 0;
        this.changeCount(this.goodsCarts[foodData.id]);
      }
    },
    //商品列表 加(弹窗)
    numberRight1(goodsT, index) {
      if (this.fun.isTextEmpty(goodsT)) {
        this.addCart(goodsT, "cart");
      } else {
        let itemIputs = `itemIputs${index}`;
        let itemIputsz = document.getElementById(itemIputs);
        itemIputsz.blur();
        this.goodsCartsOld = goodsT.total;
        // this.carts[index].total = Number(goodsT.total) + 1;
        this.addCart(goodsT, "cart", index);
      }
    },
    //商品列表 减(弹窗)
    numberLeft1(goodsT, index) {
      if (this.fun.isTextEmpty(goodsT)) {
        this.updateCart(goodsT.id, -1);
      } else {
        let itemIputs = `itemIputs${index}`;
        let itemIputsz = document.getElementById(itemIputs);
        itemIputsz.blur();
        this.goodsCartsOld = goodsT.total;
        this.carts[index].total = Number(goodsT.total) - 1;
        clicktag = 0;
        this.changeCount(this.carts[index]);
      }
    },
    getStoresDetails() {
      let that = this;
      $http
        .post(
          "plugin.store-cashier.frontend.store.get-store-info.get-stores-details",
          {
            store_id: this.store_id,
            url:
              this.fun.isIosOrAndroid() === "android"
                ? window.location.href
                : window.initUrl
          },
          "..."
        )
        .then(
          response => {
            this.loadingPopup = false;
            this.$nextTick(() => {
              this.Height = -(
                this.$refs.storeInfo_box.clientHeight +
                this.$refs.storeInfo_box.offsetTop -
                44
              );
            });
            if (response.msg === "该商家已过期,去看看其他的吧") {
              this.showDis = false;
              this.show8 = true;
              return;
            }
            if (response.result === 1) {
              this.store = response.data.store_info;
              this.new_comment = response.data.comment.new_comment;
              this.info = response.data.store_information;
              console.log(this.store.store_barnner_thumb);
              if (this.store.operating_state === 1) {
                this.show1 = true;
              }
              this.get_coupon = response.data.get_coupon;
              this.get_recommend_goods = response.data.get_recommend_goods;
              if (response.data.is_micro_communities == 1) {
                this.tabList = ['店铺详情', '门店微贴', '门店员工'];
              }
              if (response.data.is_room == 1) {
                this.tabList = ['店铺详情', '门店直播', '门店员工'];
              }
              if (response.data.is_room == 1 && response.data.is_micro_communities == 1) {
                this.tabList = ['店铺详情', '门店微贴', '门店直播', '门店员工'];
              }
              this.getCategory(response.data.get_all_goods);
              this.getFirstCart(response.data.member_cart);
              // this.initShare();
              that.fun.wxShare(
                "",
                {},
                {
                  title: that.store.store_name,
                  imgUrl: that.store.store_thumb,
                  description: that.store.store_introduce
                }
              );

              // this.share(response.data.wx_js_sdk_config);
            } else {
              Toast({
                message: response.msg,
                position: "middle",
                duration: 1500
              });
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },
    // 初始化bscroll
    _initScroll() {
      if (!this.meunScroll) {
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
      } else {
        this.meunScroll.refresh();
      }

      if (!this.cartScroll) {
        this.cartScroll = new BScroll(this.$refs.cartWrapper, {
          click: true
        });
      } else {
        this.cartScroll.refresh();
      }

      if (!this.foodsScroll) {
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
          // 检测实时滚动的效果
        });
      } else {
        this.foodsScroll.refresh();
        this.foodsScroll.scrollTo(0, window.storeV2ScrollTop, 100);
      }

      // 监听滚动的时候触发
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
        this.scrollMargin = pos.y;
        window.storeV2ScrollTop = pos.y;
      });
    },
    // 监听可视化高度变化
    _calculateCategoryHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list"
      );

      let height = 0;
      this.listCategoryHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listCategoryHeight.push(height);
      }
    },
    // 监听可视化高度变化
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectCategoryMenu(item, event) {
      if (!event._constructed) {
        return;
      }

      if (item.childrens[0]) {
        this.selectMenu(item.childrens[0].id, event);
      } else {
        Toast({
          message: "该分类暂无商品",
          duration: 1000
        });
      }
    },
    // 点击的时候对应变化
    selectMenu(id, event) {
      if (!event._constructed) {
        return;
      }
      if (!this.meunScroll) {
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
      } else {
        this.meunScroll.refresh();
      }
      this.secondTitle.forEach((title, i) => {
        if (title.id === id) {
          this.Index = i;
          return i;
        }
      });

      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let el = foodList[this.Index];
      this.foodsScroll.scrollToElement(el, 100);
    },
    initData() {
      this.loadingPopup = true;
      this.tabIndex = 0;
      this.info = "";
      this.new_comment = [];
      this.category = [];
      this.goodsList = [];
      this.currentCategory = "";
      this.goodsCount = 0;
      this.pageCount = 1;
      //this.ofTempD();
      this.cartsNum = 0;
      this.cartsTotal = 0.0;

      this.carts = [];
      this.goodsCarts = [];
      this.specid = ""; //规格ID

      this.secondTitle = [];

      specsManage = []; //选择池 用于排序
      optionsId = ""; //选择后的 规格ID
      optionsMaxCount = 1;
    },
    //setting sun
    //搜索跳转
    searchJump() {
      this.$router.push(
        this.fun.getUrl("StoreSearch", {
          store_id: this.store_id,
          fromHome: 1
        })
      );
    },
    showStore() {
      if (this.showStoreInfo) {
        this.showStoreInfo = false;
        this.showGoods = true;
      } else {
        this.showStoreInfo = true;
        this.showGoods = false;
      }
    },
    goBuy() {
      this.$router.push(
        this.fun.getUrl("cashier_pay", {
          store_id: this.store_id
        })
      );
    },
    showGoodsInfo() {
      if (this.showGoods) {
        this.showStoreInfo = true;
        this.showGoods = false;
      } else {
        this.showStoreInfo = false;
        this.showGoods = true;
      }
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

    getCategory(data) {
      if (data.list) {
        this.category = data.list;

        if (this.category.length > 0) {
          this.category[0].active = true;
          if (this.category[0].childrens.length > 0) {
            this.category[0].childrens[0].active = true;
            this.currentCategory = this.category[0].childrens[0].name;
            this.catesId = this.category[0].childrens[0].id;
          }

          // 全部二级商品数据
          let firstClass = [];
          let secondTitle = [];

          this.category.forEach((first, index) => {
            if (first.childrens.length > 0) {
              if (first.childrens && first.childrens[0].goods.length >= 0) {
                firstClass.push(first.childrens);
              }
            } else {
              firstClass.push([]);
            }
          });

          firstClass.forEach(second => {
            if (second.length > 0) {
              second.forEach(title => {
                secondTitle.push({ id: title.id, name: title.name });
              });
            }
          });

          this.secondTitle = secondTitle;
          this.goods = firstClass;

          //判断加加的数据相等和长度 数据出来以后初始化插件
          this.$nextTick(() => {
            this._initScroll();
            this._calculateCategoryHeight();
            this._calculateHeight();
          });
        }
      }
    },

    /**
     * 当前一级分类
     * @param items
     */
    selectCategory(items) {
      this.category.forEach(i => {
        this.$set(i, "active", false);
      });
      this.$set(items, "active", true);
      if (items.childrens.length > 0) {
        items.childrens.forEach(i => {
          this.$set(i, "active", false);
        });
        this.$set(items.childrens[0], "active", true);
        this.currentCategory = items.childrens[0].name;
        this.pageCount = 1;
        this.catesId = items.childrens[0].id;
        this.getGoodsList(items.childrens[0].id);
        this.goodsList = [];
      }
    },

    /**
     * 上一级分类/二级分类
     * @param items
     * @param item
     */
    selectChildCategory(items, item) {
      items.forEach(i => {
        this.$set(i, "active", false);
      });
      this.$set(item, "active", true);
      this.currentCategory = item.name;
      this.pageCount = 1;
      this.catesId = item.id;
      this.getGoodsList(item.id);
      this.goodsList = [];
    },

    /**
     * 二级分类id
     * @param category_id
     */
    getGoodsList(category_id) {
      var that = this;

      $http
        .get(
          "plugin.store-cashier.frontend.store.goods.get-goods-to-page",
          {
            store_id: this.store_id,
            category_id: category_id,
            page: that.pageCount
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            if (that.pageCount == 1) {
              that.goodsList = [];
            }
            that.pageCount = Number(that.pageCount) + 1;
            that.loading = false;
            // 搜索结果为空
            if (response.data.total <= 0) {
              that.loading = true;
              return;
            }
            // that.goodsList = response.data.data;
            that.goodsList = that.goodsList.concat(response.data.data);
            // that.goodsCount = that.goodsList.length;
            that.goodsCount = response.data.total;

            if (response.data.current_page == response.data.last_page) {
              that.loading = true;
              return;
            }
          } else {
            that.goodsList = [];
            that.goodsCount = that.goodsList.length;
          }
        }),
      response => {
        //alert('网络错误，请稍后再试！')
      };
    },
    addCart(goods, tag, _i) {
      let id = "";
      if (tag === "cart") {
        id = goods.goods_id;
      } else {
        id = goods.id;
      }

      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.store",
          {
            goods_id: id,
            total: 1,
            store_id: this.store_id
          },
          "添加中"
        )
        .then(
          response => {
            if (response.result === 1) {
              if (tag == 'cart') {
                this.carts[_i].total = Number(goods.total) + 1;
              }
              this.getCart(goods);
            } else {
              this.$dialog.alert({message:response.msg});
            }
          },
          response => {
            //alert('网络错误，请稍后再试！')
          }
        );
    },

    /**
     *
     * @param id   购物车id
     * @param num
     */
    updateCart(id, num) {
      // console.log('cart...', this.carts);
      // console.log('cart id...', id);
      if (num < 0) {
        var total = 0;
        this.carts.forEach(item => {
          if (item.id == id) {
            total = item.total;
          }
        });

        if (total + num < 0) {
          if (clicktag === 0) {
            clicktag = 1;
            this.delItemByCart(id);
            setTimeout(function () {
              clicktag = 0;
            }, 500);
          }
          return;
        }
        if (clicktag === 0) {
          clicktag = 1;
          this.updateCartRequest(id, num);
          setTimeout(function () {
            clicktag = 0;
          }, 500);
        }
      } else {
        if (clicktag === 0) {
          clicktag = 1;
          this.updateCartRequest(id, num);
          setTimeout(function () {
            clicktag = 0;
          }, 500);
        }
      }
    },
    updateCartRequest(id, num) {
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.updateNum",
          {
            id: id,
            num: num,
            store_id: this.store_id
          },
          "加载中"
        )
        .then(
          response => {
            if (response.result == 1) {
              if (num < 0) {
                this.popNum = this.popNum + num;
              } else {
                this.popNum = this.popNum + num;
              }
              this.getCart();
            } else {
              this.$dialog.alert({message:response.msg});
              this.getCart();
            }
          },
          response => { }
        );
    },
    delItemByCart(cart_id) {
      var that = this;
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.destroy", {
          store_id: this.store_id,
          ids: cart_id
        })
        .then(
          response => {
            if (response.result == 1) {
              that.getCart();
              that.popNum--;
              that.showCart = false;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          response => {
            //alert('网络错误，请稍后再试！')
          }
        );
    },

    clearCart() {
      var that = this;
      var destroyCarts = [];
      this.carts.forEach(item => {
        destroyCarts.push(item.id);
      });
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.destroy", {
          store_id: this.store_id,
          ids: destroyCarts
        })
        .then(
          response => {
            if (response.result == 1) {
              that.getCart();
              that.showCart = false;
              that.popNum = 0;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          response => {
            //alert('网络错误，请稍后再试！')
          }
        );
    },

    goodsOrder(val) {
      let sum = 0;

      this.carts.forEach(val => {
        sum += val.total;
      });

      if (sum == 0) {
        return;
      }

      if (val.length == 0 || this.carts.length == 0) {
        return;
      } else {
        this.$router.push(
          this.fun.getUrl("goodsorder",{}, {
            store_id: this.store_id,
            tag: "store"
          })
        );
      }
    },
    getFirstCart(data) {
      this.carts = data;
      this.goodsCarts = [];
      this.cartsNum = 0;
      this.cartsTotal = 0;
      this.carts.forEach(item => {
        this.$set(this.goodsCarts, item.goods_id, item);
        if (
          item.goods_id === this.goodsInfo.id &&
          item.option_id === optionsId
        ) {
          this.popNum = item.total;
          this.popCard = item;
        }
        this.cartsNum += item.total;
        this.cartsTotal += item.total * item.goods.price;
      });
      this.goodsCartsTotal = this.calculateTotal(this.carts);
      this.cartsTotal = parseFloat(this.cartsTotal).toFixed(2);
    },

    /**
     * 如果传了商品，通过商品id获取购物车数量
     * @param goods
     */
    getCart(goods) {
      var that = this;
      // console.log('goods...', goods);
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.index", {
          store_id: this.store_id
        })
        .then(
          response => {
            if (response.result === 1) {
              that.carts = response.data;
              that.goodsCarts = [];
              that.cartsNum = 0;
              that.cartsTotal = 0;
              that.carts.forEach(item => {
                this.$set(that.goodsCarts, item.goods_id, item);
                if (goods && goods.id == item.goods_id) {
                  goods.buyNum = item.total;
                }
                if (
                  item.goods_id === that.goodsInfo.id &&
                  item.option_id === optionsId
                ) {
                  that.popNum = item.total;
                  that.popCard = item;
                }
                that.cartsNum += item.total;
                that.cartsTotal += item.total * item.goods.price;
              });
              that.goodsCartsTotal = that.calculateTotal(that.carts);
              that.cartsTotal = parseFloat(that.cartsTotal).toFixed(2);
            } else {
              //Toast("请输入提货人信息");
              //return;
            }
          },
          response => {
            //alert('网络错误，请稍后再试！')
          }
        )
        .catch(err => {
          console.log(err);
        });
    },
    goShowCart() {
      if (!this.showCart && this.cartsNum > 0) {
        if (!this.cartScroll) {
          this.cartScroll = new BScroll(this.$refs.cartWrapper, {
            click: true
          });
        } else {
          this.cartScroll.refresh();
        }
        this.showCart = true;
      } else {
        this.showCart = false;
      }
    },
    showToolbar() {
      this.toolbar = !this.toolbar;
    },
    tel() {
      window.location.href = "tel://" + this.store.store_mobile;
    },
    tosearch() {
      this.$router.push(
        this.fun.getUrl("search", {
          fromHome: 1
        })
      );
    },
    //获取地址信息
    getAddressInfo() {
      var that = this;
      if (
        this.$store.state.city.length == 0 ||
        this.$store.state.province.length == 0 ||
        this.$store.state.district.length == 0
      ) {
        //saveAddresssInfo
        $http.get("member.member-address.address").then(
          function (response) {
            if (response.result == 1) {
              //console.log(JSON.stringify(response.data.city));
              that.$store.commit("saveAddresssInfo", {
                city: response.data.city,
                province: response.data.province,
                district: response.data.district
              });
            }
          },
          function (response) {
            // error callback
          }
        );
      }
    },
    //跳转门店商品的详情
    goToGoodsO2O(goods) {
      if (this.store.operating_state !== 1 && this.showDis) {
        this.$router.push(
          this.fun.getUrl("goodsO2O", {
            id: goods.goods_id,
            tag: "o2o",
            store_id: this.store_id
          })
        );
      }
    },
    gotoGoodDetail(_id) {
      this.$router.push(
        this.fun.getUrl("goodsO2O", {
          id: _id,
          tag: "o2o",
          store_id: this.store_id
        })
      );
    },
    // 过期商品显示 跳转到首页
    goTOHome() {
      this.show8 = false;
      this.$router.push(this.fun.getUrl("o2oHome"));
    },

    //不同规格的同一商品求和
    calculateTotal(arr) {
      let newArr = []; // 保存求和后的购物车数量列表
      let temp = {};
      let newArr2 = [];
      for (let i in arr) {
        let key = arr[i].goods_id;
        if (temp[key]) {
          temp[key].total = temp[key].total + arr[i].total; //id相同则把数量相加
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

    // 关闭弹窗
    close() {
      this.show2 = false;
      //确认后清空数值
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
    },
    //弹窗提交确认
    submitAction() {
      if (specsManage.length < this.goodsInfo.has_many_specs.length) {
        //请选择规格
        this.show2 = false;
        Toast(this.goodsDescription);
        return;
      }

      //处理参数
      this.addCartRequest(this.goodsInfo.id, optionsId);
    },
    //加入购物车网络操作
    addCartRequest(_goodsId, _optionsId) {
      if (optionsMaxCount === 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }

      let that = this;

      let json = {
        goods_id: _goodsId,
        total: 1,
        option_id: _optionsId,
        store_id: this.store_id
      };
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.store",
          json,
          "添加中"
        )
        .then(response => {
          if (response.result === 1) {
            that.popNum++;
            that.getCart();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => { });
    },
    //初始化弹窗view
    initPopView() {
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
      if (this.goodsInfo.has_option === 1) {
        //是否有规格
        this.popTitle = this.goodsInfo.title; //设置默认图片
        this.popThumb = this.goodsInfo.thumb; //设置商品名
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.popCard = {};
        if (!this.specid.length) {
          this.popPrice =
            this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
        }

        this.goodsDescription = "请选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
        }

        if (!optionsId) {
          // 默认选择第一个
          for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
            this.selectSpecs(
              this.goodsInfo.has_many_specs[i].specitem[0],
              this.goodsInfo.has_many_specs[i].specitem[0].id
            );
          }
        }
      } else {
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock; //设置最大购买量
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
        // console.log(optionsMaxCount);
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
      specsManage.sort(function (a, b) {
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
          if (
            goodsSpecs ===
            this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)
          ) {
            this.popmPrice = this.goodsInfo.has_many_options[i].market_price; //设置价格
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(
              this.goodsInfo.has_many_options[i].thumb
            )
              ? this.goodsInfo.thumb
              : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.popNum = 0;
            }

            break;
          }
        }

        for (let i = 0; i < this.carts.length; i++) {
          if (
            this.carts[i].goods_id === this.goodsInfo.id &&
            this.carts[i].option_id === optionsId
          ) {
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
      _specs.sort(function (a, b) {
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
          this.setGoodsSpecsStatus(
            this.goodsInfo.has_many_specs[i].specitem,
            specs.id
          );
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        // console.log(this.goodsInfo.has_many_options[i].specs);
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //console.log(_specs);
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

      // console.log(options);
    },

    //分享
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl
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
        .catch(error => { });
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(that.store.store_name)
          ? data.share.title
          : that.store.store_name;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.store.store_thumb)
          ? data.share.icon
          : that.store.store_thumb;
        let _desc = that.fun.isTextEmpty(that.store.store_introduce)
          ? data.share.desc
          : that.store.store_introduce;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
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
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },

    //跳转门店优惠券
    gotoCupcon() {
      this.$router.push(
        this.fun.getUrl("StoreCoupon", {
          id: this.store_id
        })
      );
    },
    updateshoppingcart() {
      $http
        .post(
          "plugin.store-cashier.frontend.store.get-store-info.get-stores-details",
          {
            store_id: this.store_id,
            url:
              this.fun.isIosOrAndroid() === "android"
                ? window.location.href
                : window.initUrl
          }
        )
        .then(
          response => {
            if (response.msg === "该商家已过期,去看看其他的吧") {
              return;
            }
            if (response.result === 1) {
              this.getFirstCart(response.data.member_cart);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    }
  },
  components: {
    cStar, cFlow, cLive
  },
  watch: {
    scrollMargin(newVal) {
      // let translateY = Math.max(this.Height, newVal);

      // let top = document.documentElement.scrollTop || document.body.scrollTop;
      // top < 50 ? (this.amout = false) : (this.amout = true);
      if (newVal < this.Height) {
        this.amout = true;
        // this.$refs.storeInfo_box.style.marginTop = `${this.Height}px`;
      } else {
        this.amout = false;
        // this.$refs.storeInfo_box.style.marginTop = `${translateY}px`;
      }
    }
  },
  computed: {
    minicartStyle() {
      if (this.showCart) {
        return "display: none;transform: translateY(-100%)";
      } else {
        return "display: block;transform: translateY(0)";
      }
    },
    leftPrice() {
      if (this.showCart) {
        return "transform: translateX(-60px);";
      }
    },
    // 计算li索引的高度变化
    currentCategoryIndex() {
      for (let i = 0; i < this.listCategoryHeight.length; i++) {
        let height1 = this.listCategoryHeight[i];
        let height2 = this.listCategoryHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    // 计算li索引的高度变化
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return this.secondTitle[i].id;
        }
      }
      return 0;
    }
  }
};
