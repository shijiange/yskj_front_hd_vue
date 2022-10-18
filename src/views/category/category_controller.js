import cTitle from "components/title";
import cCarcontent from "components/carcontent";
import cCarcontent4 from "components/carcontent4";
import { Toast } from "vant";
import BScroll from "better-scroll";
import { mapState } from "vuex";

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;
var OldGoodsNum = null;

let categoryApi = {
  home: "goods.category.category-home",
  children: "goods.category.get-children-category",
  goods: "goods.category.get-goods-list-by-category-id"
};
export default {
  data() {
    return {
      integral: window.localStorage.getItem("integral") || "积分",
      debounce_timer: null,
      brandShow: "",
      categoryShow: "",
      active: 9999,
      active2: true,
      allLoaded: false,
      topStatus: "",
      err: "",
      turl: "/category",
      arg: { index: 10, item: "pinch" },
      parentTitle: this.$i18n.t("推荐分类"),
      onelist: [],
      contentlist: {},
      contentlist_one: {},
      category_template: "01", //后台开启那个模板
      cartInfo: {},

      list: [],
      goodsInfo: {},
      advimg: window.localStorage.adv_img,
      carts: [],
      cartIDs: [],
      specid: "", //规格ID
      goodsCarts: [], //购物车转为goods key的数组
      goodsCartsTotal: [],
      activeName: [], //分类折叠面板
      secondaryId: "", //二级分类id
      threeId: "", //三级分类ID
      threeInfo: [], //三级商品列表
      show2: false, //规格弹窗
      showTitle: "", //分类折叠标题
      titleInfo: {}, //用于保存分类折叠时自定义标题分类
      foodInfo: [],
      popTitle: "",
      popPrice: "",
      popNum: 0,
      popStock: "",

      //more
      page: 1, //分页数，当前页数
      isLoadMore: false, //判断是否要加载更多的标志
      total_page: 0, //总页数
      activatId: "", //当前的分类id
      LoadMoreTest: "",
      scrollMargin: 0,

      isGetCart: true, //是否请求获取购物车接口数据
      ADImg: "", //广告图片地址
      ADUrl: "", //广告跳转链接
      isRecommend: true, //是否为推荐分类

      isCategoryMore: false, //装修01，03导航栏分类加载更多
      isCategory_total_page: 0,
      isCategoryPage: 1,

      main_category_page: 1,
      main_category_total: 0,

      isSelfPickCategory: false, //是否为供应商管理的自提点的分类页，#75504；如是，则只显示自提点关联的供应商的商品和平台商品（包含聚合供应链商品），其他供应商商品不显示，没有关联自提点的供应商商品也不显示。
      deliverId: 0, //自提点id

      isMultiSpecs: false, //多规格商品是否显示会员价
      specsVIPPrc: null //规格商品会员价
    };
  },
  computed: {
    ...mapState(["category", "blurst"]),
    zoneId() {
      if (this.$store.state.zoneId == "") {
        this.$store.commit("setZoneId", window.localStorage.getItem("zoneId"));
      }
      return this.$store.state.zoneId;
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "goods" || from.name === "grab_group" || from.name === "newRetailSalesGood") {
      if (toGoodListIOS) {
        toGoodListIOS({ body: "toGoodListIOS" });
      }
    }
    next();
  },
  methods: {
    clickActive(data) {
      //点击顶部滑动的分类事件
      this.foodScroll.scrollTo(0, 0);
      this.chooseSecondary(data);
    },
    allList() {
      this.parentTitle = this.$i18n.t("category.推荐分类");
      this.active2 = true;
      this.active = 9999;
      this.getCategoryNew();
    },
    tabsa(n, i) {
      // console.log(i);
      this.parentTitle = i.name + "分类";
      this.$store.commit("setAdvimg", i);
      //this.$store.state.category.adv_img
      this.active = n;
      this.active2 = false;
      this.getContentlist(i.id);
      if (this.category_template == "01" || this.category_template == "04") {
        this.getData(i.id);
      }
    },
    bpfun() {
      this.$router.push(this.fun.getUrl("brand"));
    },
    debounce() {
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.debounce_timer) {
        clearTimeout(this.debounce_timer); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      this.debounce_timer = setTimeout(() => {
        // 800毫秒以后执行方法
        that.setScorll();
      }, 800); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    setScorll() {
      let that = this;
      if (!that.$refs.goodsWrapper) {
        return;
      }
      if (!that.foodScroll) {
        that.foodScroll = new BScroll(that.$refs.goodsWrapper, {
          click: true,
          scrollY: true,
          probeType: 3,
          swipeBounceTime: 500,
          useTransition: false,
          mouseWheel: true
        });
      } else {
        that.foodScroll.refresh();
      }

      let loadMore = document.getElementById("loadMore");
      that.foodScroll.on("scroll", pos => {
        // console.log('卢萨卡的方法是快乐', loadMore)
        if (loadMore.offsetTop > that.$refs.goodsWrapper.offsetHeight && loadMore.offsetTop + pos.y < that.$refs.goodsWrapper.offsetHeight && that.isLoadMore) {
          that.getMoreData_1(1);
          console.log("分类加载更多");
          setTimeout(() => {
            that.foodScroll.refresh();
          }, 800);
        }
      });
    },
    //获取更多数据，加载更多
    getMoreData_1(_tag) {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.isCategoryMore = false;
      const that = this;
      // console.log("11111111111111", that.page, that.total_page)
      if (_tag == 1 && that.page >= that.total_page) {
        Toast("没有更多");
        return;
      } else if (_tag == 0 && that.isCategoryPage >= that.isCategory_total_page) {
        Toast("没有更多");
        return;
      } else {
        console.log("加载更多");
        _tag == 1 ? (that.page += 1) : (that.isCategoryPage += 1);
        // that.page += 1;
        $http
          .get(
            categoryApi.children,
            {
              parent_id: this.activatId,
              as_id: this.zoneId,
              page: _tag == 1 ? that.page : that.isCategoryPage
            },
            ""
          )
          .then(res => {
            if (res.result == 1) {
              var nextPageData = res.data.data;
              if (_tag == 1) {
                that.isLoadMore = true;
                that.contentlist_one.data = that.contentlist_one.data.concat(nextPageData); //进行数组拼接
                return that.contentlist_one;
              } else {
                that.isCategoryMore = that.isCategoryPage >= that.isCategory_total_page ? false : true;
                let _recommend = that.list.recommend.concat(nextPageData); //进行数组拼接
                that.$delete(that.list, "recommend");
                that.$set(that.list, "recommend", _recommend);
              }
            } else {
              if (_tag == 1) {
                that.page = that.page - 1;
                that.isLoadMore = false;
              } else {
                that.isCategoryPage = that.isCategoryPage - 1;
                that.isCategoryMore = false;
              }
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getContentlist(id) {
      let that = this;
      this.activatId = id;
      let jsons = { parent_id: id, as_id: this.zoneId };
      $http.get(categoryApi.children, jsons, "").then(response => {
        if (response.result == 1) {
          that.isRecommend = false;
          that.err = false;
          that.contentlist_one.category_template = that.category_template;
          that.contentlist.top_img = response.data.top_img;
          if (that.category_template == "01" || that.category_template == "04") {
            that.contentlist.recommend = response.data.data;
            that.contentlist.set = response.data.set;
            that.contentlist.member_cart = this.cartInfo;
            // that.foodInfo = response.data.goods_list.data;
            that.list = this.contentlist;
            // if (response.data.set.cat_level == 2) {
            that.ADImg = that.$store.state.category.adv_img;
            that.ADUrl = that.$store.state.category.adv_url;
            // }
            that.setCatagory(this.contentlist);
            that.total_page = response.data.goods_list.last_page;

            that.isCategory_total_page = response.data.last_page;
            if (that.isCategory_total_page > 1) {
              that.isCategoryMore = true;
            } else {
              that.isCategoryMore = false;
            }
            that.isCategoryPage = 1;
          } else {
            that.total_page = response.data.last_page;
            that.contentlist_one = response.data;
            that.contentlist_one.tjfl = false;
            that.contentlist_one.set = response.data.set;
            that.list = this.contentlist_one;
            if (that.foodScroll) {
              that.foodScroll.scrollTo(0, 0);
            }
            that.$nextTick(() => {
              that.debounce();
            });
          }
          that.page = 1;
          if (!that.total_page) {
            that.total_page = 0;
          }
          if (that.page < that.total_page) {
            that.LoadMoreTest = "加载更多";
          } else {
            that.LoadMoreTest = "没有更多";
          }
          that.isLoadMore = true;
          //------------------------------------------
        } else {
          that.err = true;
        }
      });
    },
    getMoreCategoryNew() {
      this.main_category_page++;
      $http.get(categoryApi.home, { page: this.main_category_page }, "loading").then(response => {
        if (response.result === 1) {
          this.main_category_total = response.data.category.last_page;
          this.onelist = this.onelist.concat(response.data.category.data);
          this.$nextTick(() => {
            this.meunScroll.finishPullUp();
            this.meunScroll.refresh();
          });
        }
      });
    },
    getCategoryNew() {
      let that = this;
      let jsons = { as_id: this.zoneId };
      // if (!this.fun.isTextEmpty) {
      //   jsons.parent_id = id;
      // }

      $http.get(categoryApi.home, jsons, "loading").then(response => {
        if (response.result === 1) {
          that.category_template = response.data.category_template.names;
          // this.isSelfPickCategory为true时，则为供应商自提点分类页，固定为01模板
          if (this.$store.state.temp.item.is_decorate === 1 && !this.isSelfPickCategory) {
            //新装修在basic_info里的
            if (this.$store.state.temp.item.ViewSet.category.is_default != 0) {
              that.category_template = this.$store.state.temp.item.ViewSet.category.code.substring(8);
            } else {
              that.category_template = "01";
            }
          }

          that.page = 1;
          that.isLoadMore = true;
          that.total_page = response.data.goods_list.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          if (that.page < that.total_page) {
            that.LoadMoreTest = "加载更多";
          } else {
            that.LoadMoreTest = "没有更多";
          }
          that.isRecommend = true;
          that.onelist = response.data.category.data;
          this.main_category_total = response.data.category.last_page;
          this.err = false;
          response.data.recommend.goo = true;
          this.cartInfo = response.data.member_cart;
          this.foodInfo = response.data.goods_list.data;
          if (that.category_template == "01" || that.category_template == "04") {
            if (response.data.set.cat_brand && response.data.set.cat_brand.length > 0) {
              this.brandShow = response.data.set.cat_brand;
            }
            if (response.data.set.cat_class && response.data.set.cat_class.length > 0) {
              this.categoryShow = response.data.set.cat_class;
              if (this.categoryShow != "0" && that.onelist.length > 0) {
                this.tabsa(0, that.onelist[0]);
              }
            }
            if (this.categoryShow == "0") {
              this.contentlist.recommend = response.data.recommend;
              this.contentlist.set = response.data.set;
              this.contentlist.member_cart = response.data.member_cart;
              this.list = this.contentlist;
              this.ADImg = response.data.set.cat_adv_img;
              this.ADUrl = response.data.set.cat_adv_url;
              this.setCatagory(this.contentlist);
            }

            this.$nextTick(() => {
              this._initScroll();
            });
          } else {
            if (that.category_template == "02") {
              this.$nextTick(() => {
                this._initScroll();
              });
            }
            if (response.data.set.cat_brand && response.data.set.cat_brand.length > 0) {
              this.brandShow = response.data.set.cat_brand;
            }
            if (response.data.set.cat_class && response.data.set.cat_class.length > 0) {
              this.categoryShow = response.data.set.cat_class;
              if (this.categoryShow != "0" && that.onelist.length > 0) {
                this.tabsa(0, that.onelist[0]);
              }
            }

            if (this.categoryShow == "0") {
              this.contentlist_one = response.data.recommend;
              this.contentlist_one.tjfl = true;
              this.contentlist_one.set = response.data.set;
              this.list = this.contentlist_one;
            }
            this.isLoadMore = false;
            if (this.foodScroll) {
              this.foodScroll.scrollTo(0, 0);
            }
            this.$nextTick(() => {
              // this.setScorll();
              that.debounce();
            });
          }
          //------------------------------------------------
        } else {
          this.err = true;
        }
      });
    },

    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        that.LoadMoreTest = "没有更多";
        return;
      } else {
        console.log("加载更多");
        that.page += 1;
        $http
          .get(
            categoryApi.goods,
            {
              goods_page: that.page,
              category_id: that.activatId
            },
            ""
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.foodInfo = that.foodInfo.concat(nextPageData); //进行数组拼接
              return that.foodInfo;
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    _initScroll() {
      if (!this.meunScroll) {
        this.meunScroll = new BScroll(this.$refs.menu, {
          click: true,
          pullUpLoad: true
        });
        this.meunScroll.on("pullingUp", () => {
          console.log("上拉加载更多");
          // 发送网络请求，请求更多页的数据
          if (this.main_category_page < this.main_category_total) {
            this.getMoreCategoryNew();
          }

          // 等数据请求完成，并且将新的数据展示出来后
          setTimeout(() => {
            this.meunScroll.finishPullUp();
          }, 2000);
        });
      } else {
        this.meunScroll.refresh();
      }
    },
    numberLeft(_id) {
      this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) - 1;
      if (this.goodsCartsTotal[_id].total <= 0) {
        //小于等于0 清空该商品购物车数量
        this.destroyData(this.goodsCarts[_id].id);
        return;
      } else {
        this.changeCount(this.goodsCarts[_id].id, this.goodsCartsTotal[_id].total);
      }
    },
    numberRight(_id, _stock, good) {
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
      $http.get("member.member-cart.store", { goods_id: _id, total: 1 }, "").then(
        response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
              this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) + 1;
            }
            this.$store.commit("setCartNum", response.data.cart_num);
            this.updateData();
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    clickCount(data) {
      OldGoodsNum = data;
    },
    changeCount(_id, _num, index, _good) {
      let that = this;
      if (_num <= 0) {
        this.destroyData(_id);
        return;
      }
      if (this.fun.isTextEmpty(_good) && _num - 1 >= optionsMaxCount) {
        //有规格的
        Toast("库存不足");
        return;
      } else if (!this.fun.isTextEmpty(_good) && _num >= _good.stock) {
        //无规格
        // console.log(that.goodsCartsTotal)
        // that.goodsCartsTotal[_good.id].total =5;
        this.$set(that.goodsCartsTotal[_good.id], "total", OldGoodsNum);
        Toast(`该商品最多购买数量为${_good.stock}`);
        return;
      }

      let json = {
        id: _id,
        num: _num
      };

      $http.get("member.member-cart.updateNumV2", json, "").then(
        response => {
          if (response.result === 1) {
            that.updateData();
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
    updateData() {
      //更新购物车数据
      let that = this;
      $http.get("member.member-cart.index", {}).then(response => {
        if (response.result === 1) {
          that.cartInfo = response.data; //更新购物车数据，避免不同步
          that.contentlist.member_cart = response.data;
          that.getCart(response.data);
        } else {
          Toast(response.msg);
        }
      });
    },
    destroyData(_cid) {
      //清除该购物车商品id
      let that = this;
      $http.get("member.member-cart.destroy", { ids: _cid }).then(response => {
        if (response.result == 1) {
          that.popNum = 0;
          that.updateData();
        } else {
          Toast(response.msg);
        }
      });
    },
    change() {
      //关闭分类折叠面板
      this.activeName = [];
    },
    chooseSecondary(sInfo) {
      // console.log(sInfo);
      if (!this.isRecommend) {
        this.ADImg = sInfo.adv_img;
        this.ADUrl = sInfo.adv_url;
      }
      this.secondaryId = sInfo.id;
      if (!this.fun.isTextEmpty(sInfo.has_many_children)) {
        this.threeInfo = [];
        let all = [
          {
            name: "全部",
            id: sInfo.id
          }
        ];
        let add_allCategory3 = [...all, ...sInfo.has_many_children];
        this.threeInfo = add_allCategory3;
        this.threeId = sInfo.id;
        this.activatId = sInfo.id;
        this.getData(sInfo.id);
        // this.chooseThree(sInfo.has_many_children[0].id);
      } else {
        this.threeId = null;
        this.threeInfo = [];
        this.activatId = sInfo.id;
        this.getData(sInfo.id);
      }
    },
    chooseThree(_tid) {
      this.threeId = _tid;
      this.activatId = _tid;
      this.getData(_tid);
    },
    getData(_id) {
      let that = this;
      let jsons = {
        category_id: _id,
        goods_page: 1
      };
      $http.get(categoryApi.goods, jsons, "").then(response => {
        if (response.result == 1) {
          that.page = 1;
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          if (that.page < that.total_page) {
            that.LoadMoreTest = "加载更多";
          } else {
            that.LoadMoreTest = "没有更多";
          }
          that.foodInfo = response.data.data;
          setTimeout(() => {
            that.activeName = [];
          }, 800);
          if(this.foodScroll){
            // 因为设置0，0没效果所以设置0，1
            this.foodScroll.scrollTo(0, 1);
          }
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
      this.carts = goods;
      this.goodsCarts = [];
      this.cartIDs = [];
      this.carts.forEach(item => {
        this.$set(this.goodsCarts, item.goods_id, item);
        if (goods && goods.id === item.goods_id) {
          goods.buyNum = item.total;
        }
        if (item.goods_id === this.goodsInfo.id && item.option_id === optionsId) {
          this.popNum = item.total;
          this.popCard = item;
        }
        this.cartsNum += item.total;
        this.cartsTotal += item.total * item.goods.price;

        this.cartIDs.push(item.id);
      });
      this.goodsCartsTotal = this.calculateTotal(this.carts);
      this.goodsWrapperBScroll();
    },
    goodsWrapperBScroll(flag) {
      let that = this;
      that.$nextTick(() => {
        if (!that.foodScroll) {
          that.foodScroll = new BScroll(that.$refs.goodsWrapper, {
            click: true,
            scrollY: true,
            probeType: 3,
            swipeBounceTime: 500,
            useTransition: false,
            mouseWheel: true
          });
        } else {
          that.foodScroll.refresh();
          if (flag === "toTop") {
            // 更新购物车的时候不用滚动到顶部
            setTimeout(() => {
              that.foodScroll.scrollTo(0, 0);
            }, 250);
          }
        }

        let loadMore = document.getElementById("loadMore");
        that.foodScroll.on("scroll", pos => {
          if (that.$refs.imgBox != undefined) {
            that.Height = that.$refs.imgBox.offsetHeight + 8;
          }

          that.scrollMargin = pos.y;
          if (loadMore.offsetTop + pos.y < that.$refs.goodsWrapper.offsetHeight && that.isLoadMore) {
            that.getMoreData();
            setTimeout(() => {
              that.foodScroll.refresh();
            }, 800);
          }
        });
      });
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
    setCatagory(newVal) {
      //处理点击一级分类时，右侧的二级、三级子分类数据处理
      if (!this.fun.isTextEmpty(newVal.recommend)) {
        let add_allCategory = newVal.recommend;
        if (!this.active2) {
          add_allCategory.unshift({
            name: "全部",
            id: this.activatId,
            adv_img: this.$store.state.category.adv_img,
            adv_url: this.$store.state.category.adv_url
          });
        }
        this.titleInfo = add_allCategory;
        this.secondaryId = newVal.recommend[0].id;
        if (newVal.set.cat_level == "3" && !this.fun.isTextEmpty(newVal.recommend[0].has_many_children)) {
          this.threeInfo = [];
          this.threeId = null;
          this.threeInfo = newVal.recommend[0].has_many_children;
          this.threeId = newVal.recommend[0].has_many_children[0].id;
          this.activatId = this.threeId;

          this.ADImg = newVal.recommend[0].adv_img;
          this.ADUrl = newVal.recommend[0].adv_url;
        } else {
          this.threeInfo = [];
          this.threeId = null;
          this.activatId = this.secondaryId;
        }
        this.activeName = [];
        if (this.foodScroll) {
          this.foodScroll.scrollTo(0, 0);
        }
        this.getCart(newVal.member_cart);
      } else {
        this.titleInfo = [];
        this.showTitle = [];
        this.secondaryId = [];
        this.threeInfo = [];
        this.threeId = null;
        this.goodsWrapperBScroll("toTop");
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
    //初始化弹窗view
    initPopView() {
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
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

        this.goodsDescription = "请选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
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
      } else {
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock; //设置最大购买量
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
      $http.get("member.member-cart.store", { goods_id: this.goodsInfo.id, total: 1, option_id: optionsId }, "").then(
        response => {
          if (response.result === 1) {
            this.$store.commit("setCartNum", response.data.cart_num);
            Toast(response.msg);
            that.updateData();
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
    gotosearch() {
      zhuge.track('点击电商搜索栏',{'所在页面':'分类'});
      if (this.isSelfPickCategory) {
        //跳转供应商模板（关联自提点的）
        this.$router.push(this.fun.getUrl("selfPickSearch", { fromHome: 1 }));
        return;
      }
      this.$router.push(this.fun.getUrl("search", { fromHome: 1 }));
    },
    gotoGoods(gid, good) {
      if (good.category_option_id) {
        this.$router.push(this.fun.getUrl("goods", { id: gid, coid: good.category_option_id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: gid }));
      }
    },
    bindOneCategory(item) {
      console.log("点击一级", item);
      let index = 0;
      this.onelist.forEach((val, key) => {
        if (val.id == item.id) {
          index = key;
        }
      });
      this.tabsa(index, item);
    },
    async getNowPackageDeliver() {
      //获取自提点信息
      categoryApi = {
        home: "plugin.supplier.frontend.category.category-home",
        children: "plugin.supplier.frontend.category.get-children-category",
        goods: "plugin.supplier.frontend.category.get-goods-list-by-category-id"
      };

      let deliverIDStorage = sessionStorage.getItem("deliverId") || null; //获取当前会话是否存储了自提点id
      let _href = window.location.href; //当前链接
      let lat, lng;
      if (deliverIDStorage) {
        //sessionStorage 有值，说明某个页面之前有请求记录过，可直接请求分类
        if (deliverIDStorage != this.deliverId) {
          this.deliverId = deliverIDStorage;
          this.getCategoryNew();
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
            this.getCategoryNew();
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
  },
  mounted() {
    //区分是否首页跳转进来
    this.isset = localStorage.getItem("isset");
    localStorage.removeItem("isset");

    if (this.$route.name != "selfPickCategory") {
      this.isSelfPickCategory = false;
      this.getCategoryNew();
    }

    this.isGetCart = false;
  },
  activated() {
    this.isSelfPickCategory = this.$route.name == "selfPickCategory" ? true : false;
    if (this.$route.name == "selfPickCategory") {
      //自提点关联供应商
      this.getNowPackageDeliver();
    }

    if (this.isGetCart && this.category_template == "01") {
      this.$nextTick(() => {
        this.updateData();
      });
    } else {
      this.isGetCart = true;
    }
    this.fun.setWXTitle($i18n.t("分类"));
  },
  watch: {
    activeName: function(newVal) {
      if (newVal == "1") {
        this.showTitle = [];
      } else {
        this.showTitle = this.titleInfo;
        //分类排序，使得当前分类排在最前
        // this.showTitle.forEach((item, index, arr) => {
        //   if (this.secondaryId == item.id) {
        //     arr.splice(index, 1);
        //     arr.unshift(item);
        //     return arr;
        //   }
        // });
      }
    },
    scrollMargin(newVal) {
      if (this.$refs.imgBox != undefined) {
        if (newVal < -this.Height) {
          this.$refs.imgBox.style.marginTop = `-${this.Height}px`;
        } else {
          this.$refs.imgBox.style.marginTop = `${newVal}px`;
        }
      }
    }
  },
  components: { cTitle, cCarcontent, cCarcontent4 }
};
