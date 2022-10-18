import cTitle from "components/title";
import { Toast } from "vant";
// import BScroll from "better-scroll";
export default {
  data() {
    return {
      minDate: new Date(),
      currentDate: new Date(),
      currentDate2: new Date(),
      taponew: false,
      taptwow: false,
      goodsrange: [],
      fenleirange: [],
      category: [],
      goods: [],
      goodsSelect: [], //vant自带的所选择商品的信息
      fenleiSelect: [], //vant自带的所选择分类的信息
      sousuoInfo: [], //分类搜索返回的信息
      goodsSousuo: [], //商品搜索返回信息
      keyword: "", //分类搜索关键字
      goodsKeyword: "", //商品搜索关键字
      show3: false, //添加商品弹窗
      show1: false, //控制会员等级弹窗的显示影藏
      show2: false, //控制添加分类弹窗的显示影藏
      status: 1, //判断是否开启，默认开启
      is_complex: 0, //判断单张还是多张使用，默认单张
      level_limit: -1, //会员等级id,默认为-1，所有会员
      coupon_method: 1, //判断打折还立减，默认立减
      display_order: "", //判断排序方式
      enough: "", //订单金额限制条件
      use_type: 5, //判断适用范围
      get_type: 1, //判断是否可以领取
      name: "", //优惠券名称
      deduct: "", //立减多少元
      discount: "", //打多少折
      time_days: "", //选择有效天数
      time_start: "", //选择时间范围
      time_end: "", //选择时间范围
      dataInfo: {}, //优惠券
      get_max: 1, //每人限领取张数
      total: 1, //总发放数
      onceTotal:'',//每人每日领取数量
      id: "", //优惠券id,
      Id: "", //
      Vip: [], //会员等级
      chooseVip: "所有会员", //所选的会员等级名称
      time_limit: 0, //默认选择有效天数按钮
      headTitles: "" //设置c-title标题
    };
  },
  activated() {
    if (this.$route.params.id === undefined) {
      this.$router.go(-1);
    } else if (this.$route.params.id === "abc") {
      this.time_start = this.timestampToTime(new Date().getTime() / 1000);
      this.time_end = this.timestampToTime(new Date().getTime() / 1000);
      this.initPageData();
      this.getData();
      this.Id = this.$route.params.id;
      this.headTitles = "优惠券发布";
      this.fun.setWXTitle("优惠券发布");
    } else {
      this.initPageData();
      this.id = this.$route.params.id;
      this.getData();
      this.headTitles = "优惠券编辑";
      this.fun.setWXTitle("优惠券编辑");
    }
  },
  mounted() {
    var orderHight = document.body.clientHeight;
    //console.log("屏幕高度",orderHight)
    document.getElementById("coupon_edit").style.height = orderHight + "px";
  },
  methods: {
    taponewSet() {
      console.log(this.timestampToTime(this.fun.getTimestamp(this.currentDate)));
      this.time_start = this.timestampToTime(this.fun.getTimestamp(this.currentDate));
      this.taponew = false;
    },
    taptwowSet() {
      this.time_end = this.timestampToTime(this.fun.getTimestamp(this.currentDate2));
      this.taptwow = false;
    },
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition); //页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition); //页面向下滚动
        clearInterval(timer);
      }, 1);
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    //首次获取数据
    getData() {
      let json = {
        id: this.id
      };
      $http
        .get(
          "plugin.store-cashier.frontend.store.center.coupon.edit",
          json,
          "加载中"
        )
        .then(response => {
          if (response.result == 1) {
            if (this.id) {
              this.dataInfo = response.data;
              this.status = this.dataInfo.status;
              this.is_complex = this.dataInfo.is_complex;
              this.coupon_method = this.dataInfo.coupon_method;
              this.use_type = this.dataInfo.use_type;
              this.get_type = this.dataInfo.get_type;
              this.level_limit = this.dataInfo.level_limit;
              this.enough = this.dataInfo.enough;
              this.display_order = this.dataInfo.display_order;
              this.name = this.dataInfo.name;
              this.time_limit = this.dataInfo.time_limit;
              if (this.dataInfo.time_limit === 0) {
                this.time_days = this.dataInfo.time_days;
              }
              if (this.dataInfo.time_limit === 1) {
                this.time_start = this.timestampToTime(
                  this.dataInfo.time_start
                );
                this.time_end = this.timestampToTime(this.dataInfo.time_end);
              }
              if (this.coupon_method === 1) {
                this.deduct = this.dataInfo.deduct;
              }
              if (this.coupon_method === 2) {
                this.discount = this.dataInfo.discount;
              }
              if (this.use_type == 1) {
                this.category = this.dataInfo.category;
              }
              if (this.use_type == 2) {
                this.goods = this.dataInfo.goods;
              }
              this.Vip = response.data.memberLevels;
              this.get_max = this.dataInfo.get_max;
              this.total = this.dataInfo.total;
              for (let i = 0; i < this.Vip.length; i++) {
                if (this.dataInfo.level_limit === this.Vip[i].id) {
                  this.chooseVip = `会员${this.Vip[i].level_name}`;
                }
              }
            } else {
              this.Vip = response.data.memberLevels;
            }
          } else if (response.result === 0) {
            if (response.data.url) {
              window.location.href = response.data.url;
            } else {
              Toast(response.msg);
              this.$router.go(-1);
            }
          }
        });
    },
    //初始化数据
    initPageData() {
      this.show1 = false; //控制弹窗的显示影藏
      this.status = 1; //判断是否开启，默认开启
      this.is_complex = 0; //判断单张还是多张使用，默认单张
      this.level_limit = -1; //会员等级id,默认为-1，所有会员
      this.coupon_method = 1; //判断打折还立减，默认立减
      this.display_order = ""; //判断排序方式
      this.enough = ""; //订单金额限制条件
      this.use_type = 5; //判断适用范围
      this.get_type = 1; //判断是否可以领取
      this.display_order = ""; //排序
      this.name = ""; //优惠券名称
      this.deduct = ""; //立减多少元
      this.discount = ""; //打多少折
      this.time_days = ""; //选择有效天数
      this.time_start = this.timestampToTime(new Date().getTime() / 1000);
      this.time_end = this.timestampToTime(new Date().getTime() / 1000);
      this.dataInfo = {}; //优惠券
      this.get_max = 1; //每人限领取张数
      this.total = 1; //总发放数
      this.id = ""; //优惠券id,
      this.Id = ""; //
      this.Vip = []; //会员等级
      this.result = -1; //所选的会员等级参数
      this.chooseVip = "所有会员"; //所选的会员等级名称
      this.time_limit = 0; //选择有效天数还是日期，默认选择有效天数
      this.classify = "";
      this.show2 = false;
      this.show3 = false;
      this.fenleiSelect = [];
      this.goodsSelect = [];
      this.goods = [];
      this.category = [];
    },
    //发布中选中的分类的删除方法
    classifyDelete(item) {
      for (let i = 0; i < this.fenleirange.length; i++) {
        if (item === this.fenleirange[i]) {
          this.fenleirange.splice(i, 1);
        }
      }
    },
    //发布中选中的商品的删除方法
    goodsDelete(item) {
      for (let i = 0; i < this.goodsrange.length; i++) {
        if (item === this.goodsrange[i]) {
          this.goodsrange.splice(i, 1);
        }
      }
    },
    //编辑中选中的商品的删除方法
    classifyDDelete(item) {
      for (let i = 0; i < this.category.length; i++) {
        if (item === this.category[i]) {
          this.category.splice(i, 1);
        }
      }
    },
    //编辑中选中的商品的删除方法
    goodsDDelete(item) {
      for (let i = 0; i < this.goods.length; i++) {
        if (item === this.goods[i]) {
          this.goods.splice(i, 1);
        }
      }
    },
    //初始化搜索框内容和搜索数据
    inniClassify() {
      this.show2 = true;
      this.sousuoInfo = [];
      this.keyword = "";
    },
    inniGoods() {
      this.show3 = true;
      this.goodsSousuo = [];
      this.goodsKeyword = "";
    },
    //关闭会员等级弹窗
    close() {
      this.show1 = false;
    },
    //关闭分类搜索弹窗
    closeClassify() {
      this.show2 = false;
      this.fenleiSelect = [];
    },
    //关闭商品搜索弹窗
    closeGoods() {
      this.show3 = false;
      this.goodsSelect = [];
    },
    //
    //分类搜索选中分类后方法
    finishClassify() {
      this.show2 = false;
      this.fenleirange = this.deteleObject(this.fenleiSelect);
    },
    finishcategory() {
      this.show2 = false;
      this.category = this.deteleObject(
        this.category.concat(this.fenleiSelect)
      );
    },
    // 判断数组是否存在某一因素
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      // uniques = uniques;
      return uniques;
    },
    //商品搜索选中商品后
    finishGoods() {
      this.show3 = false;
      this.goodsrange = this.deteleObject(this.goods.concat(this.goodsSelect));
    },
    finishgoods() {
      this.show3 = false;
      this.goods = this.deteleObject(this.goods.concat(this.goodsSelect));
    },
    //找出两个数组不同的元素

    //发布时分类弹窗搜索按钮方法
    ClassifySousuo() {
      if (this.fun.isTextEmpty(this.keyword)) {
        Toast("请输入搜索内容");
      } else {
        let json = {
          keyword: this.keyword
        };
        $http
          .post(
            "plugin.store-cashier.frontend.store.center.coupon.getSearchCategories",
            json,
            "搜索中"
          )
          .then(response => {
            if (response.result === 1) {
              let a = response.data;
              let b = [];
              this.fenleirange.forEach(item => {
                b.push(item.id);
              });

              if (b.length > 0) {
                this.sousuoInfo = a.filter(item => {
                  return b.indexOf(item.id) == -1;
                });
              } else {
                this.sousuoInfo = a;
              }
            } else if (response.result === 0) {
              if (response.data.url) {
                window.location.href = response.data.url;
              } else {
                Toast(response.msg);
              }
            }
          });
      }
    },
    // 编辑时搜索分类数据
    categorySousuo() {
      if (this.fun.isTextEmpty(this.keyword)) {
        Toast("请输入搜索内容");
      } else {
        let json = {
          keyword: this.keyword
        };
        $http
          .post(
            "plugin.store-cashier.frontend.store.center.coupon.getSearchCategories",
            json,
            "搜索中"
          )
          .then(response => {
            if (response.result === 1) {
              let a = response.data;
              let b = [];
              this.category.forEach(item => {
                b.push(item.id);
              });

              if (b.length > 0) {
                this.sousuoInfo = a.filter(item => {
                  return b.indexOf(item.id) == -1;
                });
              } else {
                this.sousuoInfo = a;
              }
            } else if (response.result === 0) {
              if (response.data.url) {
                window.location.href = response.data.url;
              } else {
                Toast(response.msg);
              }
            }
          });
      }
    },
    //发布时商品弹窗搜索按钮方法
    goodsousuo() {
      if (this.fun.isTextEmpty(this.goodsKeyword)) {
        Toast("请输入搜索内容");
      } else {
        let json = {
          keyword: this.goodsKeyword
        };
        $http
          .post(
            "plugin.store-cashier.frontend.store.center.coupon.getSearchGoods",
            json,
            "搜索中"
          )
          .then(response => {
            if (response.result === 1) {
              let a = response.data;
              let b = [];
              this.goodsrange.forEach(item => {
                b.push(item.id);
              });
              if (b.length > 0) {
                this.goodsSousuo = a.filter(item => {
                  return b.indexOf(item.id) === -1;
                });
              } else {
                this.goodsSousuo = a;
              }
            } else if (response.result === 0) {
              if (response.data.url) {
                window.location.href = response.data.url;
              } else {
                Toast(response.msg);
              }
            }
          });
      }
    },
    // 编辑时搜索商品数据
    goodSousuo() {
      if (this.fun.isTextEmpty(this.goodsKeyword)) {
        Toast("请输入搜索内容");
      } else {
        let json = {
          keyword: this.goodsKeyword
        };
        $http
          .post(
            "plugin.store-cashier.frontend.store.center.coupon.getSearchGoods",
            json,
            "搜索中"
          )
          .then(response => {
            if (response.result === 1) {
              let a = response.data;
              let b = [];
              this.goods.forEach(item => {
                b.push(item.id);
              });
              if (b.length > 0) {
                this.goodsSousuo = a.filter(item => {
                  return b.indexOf(item.id) === -1;
                });
              } else {
                this.goodsSousuo = a;
              }
            } else if (response.result === 0) {
              if (response.data.url) {
                window.location.href = response.data.url;
              } else {
                Toast(response.msg);
              }
            }
          });
      }
    },
    //选择等级完成的回调
    finish() {
      this.show1 = false;
      if (this.level_limit == -1) {
        this.chooseVip = "所有会员";
      } else {
        for (let i = 0; i < this.Vip.length; i++) {
          if (this.level_limit == this.Vip[i].id) {
            this.chooseVip = `会员${this.Vip[i].level_name}`;
          }
        }
      }
    },
    //发布优惠券
    publishInfo() {
      if (
        this.fun.isTextEmpty(this.display_order) ||
        isNaN(this.display_order)
      ) {
        Toast("请输入排序方法，必须是整数");
        return;
      }
      if (this.fun.isTextEmpty(this.name)) {
        Toast("请输入优惠券名称");
        return;
      }
      if (this.fun.isTextEmpty(this.enough) || isNaN(this.enough)) {
        Toast("请输入订单金额,必须是整数");
        return;
      }
      if (this.time_limit == 0) {
        if (this.fun.isTextEmpty(this.time_days)) {
          Toast("请输入有效天数");
          return;
        }
      }
      if (this.time_limit == 1) {
        if (this.fun.isIosOrAndroid() == "android") {
          if (
            new Date(this.time_start).getTime() >=
            new Date(this.time_end).getTime()
          ) {
            Toast("开始时间必须早于结束时间");
            return;
          }
        } else {
          if (
            parseInt(
              Date.parse(new Date(this.time_start.replace(/-/g, "/")))
            ) >=
            parseInt(Date.parse(new Date(this.time_end.replace(/-/g, "/"))))
          ) {
            Toast("开始时间必须早于结束时间");
            return;
          }
        }
      }
      if (this.coupon_method === 1) {
        if (this.fun.isTextEmpty(this.deduct)) {
          Toast("请输入立减金额");
          return;
        } else if (Number(this.deduct < 1)) {
          Toast("金额必须大于1");
          return;
        } else if (Number(this.deduct) > Number(this.enough)) {
          let between = `输入的金额必须介于1-${this.enough}之间`;
          Toast(between);
          return;
        }
      }
      if (this.coupon_method === 2) {
        if (this.fun.isTextEmpty(this.discount)) {
          Toast("请输入折扣数");
          return;
        } else if (Number(this.discount < 1) || Number(this.discount >= 10)) {
          let Between = `折扣数必须介于1-9之间`;
          Toast(Between);
          return;
        }
      }
      if (this.use_type === 1) {
        if (this.fenleirange.length <= 0) {
          Toast("分类不能为空");
          return;
        }
      }
      if (this.use_type === 2) {
        if (this.goodsrange.length <= 0) {
          Toast("商品不能为空");
          return;
        }
      }
      if (this.get_type === 1) {
        if (this.fun.isTextEmpty(this.get_max)) {
          Toast("请输入限领张数");
          return;
        } else if (this.fun.isTextEmpty(this.total)) {
          Toast("请输入发放总数");
          return;
        }
      }
      if (this.get_type === 0) {
        if (this.fun.isTextEmpty(this.total)) {
          Toast("请输入发放总数");
          return;
        }
      }
      let json = {
        name: this.name,
        get_type: this.get_type,
        level_limit: this.level_limit,
        use_type: this.use_type,
        enough: this.enough,
        time_limit: this.time_limit,
        time_days: this.time_days,
        time_start:
          this.fun.isIosOrAndroid() == "android"
            ? String(new Date(this.time_start).getTime()).substring(0, 10)
            : String(
              parseInt(
                Date.parse(new Date(this.time_start.replace(/-/g, "/")))
              )
            ).substring(0, 10),
        time_end:
          this.fun.isIosOrAndroid() == "android"
            ? String(new Date(this.time_end).getTime()).substring(0, 10)
            : String(
              parseInt(Date.parse(new Date(this.time_end.replace(/-/g, "/"))))
            ).substring(0, 10),
        coupon_method: this.coupon_method,
        discount: this.discount,
        deduct: this.deduct,
        total: this.total,
        status: this.status,
        display_order: this.display_order,
        is_complex: this.is_complex,
        get_max: this.get_max,
        category: this.fenleirange,
        goods: this.goodsrange,
        get_limit_max:this.onceTotal?this.onceTotal:0
      };
      $http
        .post(
          "plugin.store-cashier.frontend.store.center.coupon.save",
          { coupon: json },
          "发布中"
        )
        .then(response => {
          if (response.result === 1) {
            Toast("发布成功");
            this.$router.push(this.fun.getUrl("CommodityCoupon"));
          } else if (response.result === 0) {
            if (response.data.url) {
              window.location.href = response.data.url;
            } else {
              Toast(response.msg);
            }
          }
        });
    },
    //编辑优惠券
    editInfo() {
      if (
        this.fun.isTextEmpty(this.display_order) ||
        isNaN(this.display_order)
      ) {
        Toast("请输入排序方法，必须是整数");
        return;
      }
      if (this.fun.isTextEmpty(this.name)) {
        Toast("请输入优惠券名称");
        return;
      }
      if (this.fun.isTextEmpty(this.enough) || isNaN(this.enough)) {
        Toast("请输入订单金额,必须是整数");
        return;
      }
      if (this.time_limit == 0) {
        if (this.fun.isTextEmpty(this.time_days)) {
          Toast("请输入有效天数");
          return;
        }
      }
      if (this.time_limit == 1) {
        if (this.fun.isIosOrAndroid() == "android") {
          if (
            new Date(this.time_start).getTime() >=
            new Date(this.time_end).getTime()
          ) {
            Toast("开始时间必须早于结束时间");
            return;
          }
        } else {
          if (
            parseInt(
              Date.parse(new Date(this.time_start.replace(/-/g, "/")))
            ) >=
            parseInt(Date.parse(new Date(this.time_end.replace(/-/g, "/"))))
          ) {
            Toast("开始时间必须早于结束时间");
            return;
          }
        }
      }
      if (this.coupon_method === 1) {
        if (this.fun.isTextEmpty(this.deduct)) {
          Toast("请输入立减金额");
          return;
        } else if (this.deduct < 1) {
          Toast("金额必须大于1");
          return;
        } else if (this.deduct > this.enough) {
          let between = `输入的金额必须介于1-${this.enough}之间`;
          Toast(between);
          return;
        }
      }
      if (this.coupon_method === 2) {
        if (this.fun.isTextEmpty(this.discount)) {
          Toast("请输入折扣数");
          return;
        } else if (this.discount < 1 || this.discount > 10) {
          let Between = `折扣数必须介于1-10之间`;
          Toast(Between);
          return;
        }
      }
      if (this.use_type === 1) {
        if (this.category.length <= 0) {
          Toast("分类不能为空");
          return;
        }
      }
      if (this.use_type === 2) {
        if (this.goods.length <= 0) {
          Toast("商品不能为空");
          return;
        }
      }
      if (this.get_type === 1) {
        if (this.fun.isTextEmpty(this.get_max)) {
          Toast("请输入限领张数");
          return;
        } else if (this.fun.isTextEmpty(this.total)) {
          Toast("请输入发放总数");
          return;
        }
      }
      if (this.get_type === 0) {
        if (this.fun.isTextEmpty(this.total)) {
          Toast("请输入发放总数");
          return;
        }
      }
      let json = {
        id: this.id,
        name: this.name,
        get_type: this.get_type,
        level_limit: this.level_limit,
        use_type: this.use_type,
        enough: this.enough,
        time_limit: this.time_limit,
        time_days: this.time_days,
        time_start:
          this.fun.isIosOrAndroid() == "android"
            ? String(new Date(this.time_start).getTime()).substring(0, 10)
            : String(
              parseInt(
                Date.parse(new Date(this.time_start.replace(/-/g, "/")))
              )
            ).substring(0, 10),
        time_end:
          this.fun.isIosOrAndroid() == "android"
            ? String(new Date(this.time_end).getTime()).substring(0, 10)
            : String(
              parseInt(Date.parse(new Date(this.time_end.replace(/-/g, "/"))))
            ).substring(0, 10),
        coupon_method: this.coupon_method,
        discount: this.discount,
        deduct: this.deduct,
        total: this.total,
        status: this.status,
        display_order: this.display_order,
        is_complex: this.is_complex,
        get_max: this.get_max,
        category: this.category,
        goods: this.goods,
        get_limit_max:this.onceTotal?this.onceTotal:0
      };
      $http
        .post(
          "plugin.store-cashier.frontend.store.center.coupon.save",
          { coupon: json },
          "保存中"
        )
        .then(response => {
          if (response.result === 1) {
            Toast("保存成功");
            this.$router.push(this.fun.getUrl("CommodityCoupon"));
          } else if (response.result === 0) {
            if (response.data.url) {
              window.location.href = response.data.url;
            } else {
              Toast(response.msg);
            }
          }
        });
    }
  },
  components: { cTitle }
};
