// import { mapState } from "vuex";
import cTitle from "components/title";
import { Toast } from "vant";

// const SUBMIT_ACTION_CART = "-1"; //添加到购物车
// const SUBMIT_ACTION_BUY = "-2"; //立即购买
// let isfirst = true;
export default {
  data() {
    return {
      selectBol: true,
      edit: false,
      cartDelete: false,
      //租赁cartDelete
      rentDelete: false,
      checkList: [],
      allCheckList: [],
      //租赁allchecklist
      allRentCheckList: [],
      goods: [],
      //租赁goods
      rentGoods: [],
      checkAll: false,
      //租赁checkAll
      rentCheckAll: false,
      total: 0.0,
      count: 0,

      //租赁总价格和数量
      rentTotal: 0.0,

      rentCount: 0,

      isShowList: false,

      //租赁列表显示

      isShowListRent: false,

      //租赁checklist
      // rentCheckList:[],

      //tab点击active类
      tabActive: "rent",

      //控制租赁tab显示
      isRentTab: false,

      //结算标识
      submitFlag: "",

      //购物车商品列表数组

      rentGoodList: [],

      //最近热租商品
      hotRentList: [],

      //选中租赁商品
      rentCheckList: [],
      ActiveIndex: null,
      timeoutId: null,
      isbuhuo: this.$route.params.order_id != undefined ? true : false
    };
  },
  activated() {
    this.initView(); //初始化数据
    this.getData();
    // if (this.isRentTab && !isfirst) {
    //   this.getRentData();
    //   this.getHotRent();
    // }
  },

  mounted() {
    this.slider();
  },

  methods: {
    selectBolfun: function(num) {
      if (num == 1) {
        this.selectBol = true;
      } else {
        this.selectBol = false;
      }
    },
    slider() {
      console.log("slider");
      //些方式相当于window.onload
    },

    //初始化view
    initView() {
      this.selectBol = true;
      this.edit = false;
      this.cartDelete = false;

      this.rentDelete = false;
      this.checkList = [];
      this.allCheckList = [];
      this.goods = [];
      this.rentGoods = [];
      this.checkAll = false;
      this.rentCheckAll = false;
      this.total = 0.0;
      this.count = 0;
      this.rentTotal = 0.0;
      this.rentCount = 0;
      this.isShowList = false;

      this.isShowListRent = false;
    },

    //获取数据
    getData() {
      let _json = {
        channel_type: 2
      };
      if (this.$route.params.order_id != undefined) {
        _json.order_id = this.$route.params.order_id;
      }
      let _url = this.$route.params.type == "activity" ? "plugin.channel.frontend.replenish-cart.index" : "plugin.channel.frontend.member-cart.index";
      $http.get(_url, _json, "loading").then(
        response => {
          if (response.result === 1) {
            this.goods = response.data;
            this.allCheckListInit(this.goods);
          } //else {
          //}
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //初始化全选数据
    allCheckListInit(data) {
      if (data.length) {
        this.isShowList = true;
      }
      // this.allCheckList = data;

      //取得购物车数据
      this.allCheckList = data;

      //取得租赁购物车数据
      // this.rentCheckList= data;
    },

    //全选
    allSelect(event) {
      if (this.selectBol) {
        console.log("全选");
        // this.checkList = event.target.checked ? this.allCheckList : [];
        //因为改变组件
        this.checkList = event ? this.allCheckList : [];
        console.log(this.allCheckList);
        console.log(this.checkList);
        //计算总价格
        this.countTotalPrice();
      }
    },

    //全选监听
    allSelectHandle(value) {
      console.log(value.length);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.goods.length;
      console.log(this.checkList);
      //计算总价格
      this.countTotalPrice();
    },

    //单选
    selectGood(value) {
      //console.log("单选中");
      //console.log(value);
    },

    //改变数量接口操作
    changeNumber(goods, _num) {
      console.log(goods);
      let that = this;
      let json = {
        id: goods.id,
        num: _num,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };

      $http.get("member.member-cart.updateNum", json, "").then(
        function(response) {
          console.log(response);
          if (response.result == 1) {
            if (_num > 0) {
              that.addNumberView(goods);
            } else {
              that.deleteNumberView(goods);
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //添加处理view
    addNumberView(goods) {
      for (var i = 0; i < this.checkList.length; i++) {
        if (goods.id == this.checkList[i].id) {
          if (this.checkList[i].total > 0) {
            // this.checkList[i].total = this.checkList[i].total + 1;
            this.checkList[i].total = Number(this.checkList[i].total) + 1;
            this.countTotalPrice(); //计算总价格
            return;
          }
        }
      }

      for (var j = 0; j < this.goods.length; j++) {
        if (goods.id == this.goods[j].id) {
          if (this.goods[j].total > 0) {
            // this.goods[i].total = this.goods[i].total + 1;
            this.goods[j].total = Number(this.goods[j].total) + 1;
            break;
          }
        }
      }
    },
    //添加
    addNumber(goods) {
      //网络操作后处理
      this.changeNumber(goods, 1);
    },

    //减少View处理
    deleteNumberView(goods) {
      for (var i = 0; i < this.checkList.length; i++) {
        if (goods.id == this.checkList[i].id) {
          if (this.checkList[i].total > 1) {
            // this.checkList[i].total = this.checkList[i].total - 1;
            this.checkList[i].total = Number(this.checkList[i].total) - 1;
            this.countTotalPrice(); //计算总价格
            return;
          }
        }
      }

      for (var j = 0; j < this.goods.length; j++) {
        if (goods.id == this.goods[j].id) {
          if (this.goods[j].total > 1) {
            // this.goods[i].total = this.goods[i].total - 1;
            this.goods[j].total = Number(this.goods[j].total) - 1;
            break;
          }
        }
      }
    },

    //减少
    deleteNumber(goods) {
      if (goods.total == 1) {
        return;
      }
      //网络操作后处理
      this.changeNumber(goods, -1);
    },

    //界面操作
    onCartDelete() {
      this.cartDelete = !this.cartDelete;
      this.checkList = []; //清空数据源
      this.checkAll = false; //恢复view
      this.allCheckList = this.goods; //重置全选数据
      this.countTotalPrice(); //计算价格总数
      if (this.goods.length == 0) {
        this.isShowList = false;
      }
    },

    //删除商品
    deleteGoods() {
      if (this.checkList.length == 0) {
        Toast("请选择删除商品");
        console.log("请选择删除商品");
        return;
      }

      //删除网络操作
      let that = this;
      let _ids = [];
      for (var i = 0; i < this.checkList.length; i++) {
        _ids.push(this.checkList[i].id);
      }
      console.log(_ids);
      //let json = { ids: JSON.stringify(_ids) };
      let json = {
        ids: _ids,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      let _url = this.$route.params.type == "activity" ? "plugin.channel.frontend.replenish-cart.destroy" : "plugin.channel.frontend.member-cart.destroy";
      $http.get(_url, json, "操作中").then(
        function(response) {
          console.log(response);
          if (response.result == 1) {
            that.deleteGoodsView();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //删除后View操作
    deleteGoodsView() {
      if (this.checkAll) {
        this.goods = []; //清空数据源
        this.checkList = []; //清空数据源
        this.allCheckList = []; //全选数据
      } else {
        for (var i = 0; i < this.checkList.length; i++) {
          for (var j = 0; j < this.goods.length; j++) {
            console.log(this.goods[j].id);
            if (this.goods[j].id == this.checkList[i].id) {
              this.goods.splice(j, 1);
              break;
            }
          }
        }
        this.checkList = []; //清空

        console.log(this.goods);
        console.log(this.checkList);
      }

      this.onCartDelete(); //操作界面
    },

    //计算总价格&总数
    countTotalPrice() {
      this.count = 0; //初始化
      this.total = 0.0; //初始化
      this.count = this.checkList.length;

      for (var i = 0; i < this.checkList.length; i++) {
        this.total += this.checkList[i].goods.price * this.checkList[i].total;
      }

      this.total = Number(this.total.toString().match(/^\d+(?:\.\d{0,2})?/));
    },

    //提交订单
    submitGoods() {
      let that = this;
      if (this.checkList.length == 0) {
        console.log("请选择结算商品");
        Toast("请选择结算商品");
        return;
      }
      var _cart_ids = [];
      for (var i = 0; i < this.checkList.length; i++) {
        _cart_ids.push(that.checkList[i].id);
      }
      if (this.$route.params.type == "activity") {
        // 订货活动
        that.$router.push(
          that.fun.getUrl(
            "goodsorder",
            {},
            {
              tag: "channel_TCOrder",
              order_id: that.$route.params.order_id,
              cart_ids: _cart_ids.join(",")
            }
          )
        );
      } else {
        //补货的订货
        if (that.$route.params.order_id) {
          that.$router.push(
            that.fun.getUrl(
              "goodsorder",
              {},
              {
                tag: "channel_Replenishment",
                order_id: that.$route.params.order_id,
                cart_ids: _cart_ids.join(",")
              }
            )
          );
        } else {
          //普通订货
          that.$router.push(
            that.fun.getUrl(
              "goodsorder",
              {},
              {
                tag: "channel",
                cart_ids: _cart_ids.join(",")
              }
            )
          );
        }
      }
    },

    //跳转商品详情
    toGoodsInfo(goods) {
      this.$router.push(
        this.fun.getUrl("goodsO2O", {
          id: goods.goods_id,
          o2o: "o2o",
          tag: -1,
          store_id: -1
        })
      );
    },

    //购买数量v2
    //改变数量 2
    changeCount(goods, _num, index) {
      console.log(goods);

      // if (_num < 0) {
      //   Toast("商品数量不能为负数");
      //   // goods.total=1;
      //   this.goods[index].total = 1;
      //   return;
      // }
      let that = this;
      let json = {
        id: goods,
        num: index,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      let _url = this.$route.params.type == "activity" ? "plugin.channel.frontend.replenish-cart.updateNum" : "plugin.channel.frontend.member-cart.updateNum";
      $http.get(_url, json, "").then(
        function(response) {
          console.log(response);

          if (response.result === 1) {
            // if (_num > 0) {
            // 	that.addNumberView(goods);
            // } else {
            // 	that.deleteNumberView(goods);
            // }
            that.changeNumberView(goods, _num);
          } else {
            Toast(response.msg);
            // goods.total=1;
            // that.goods[index].total = 1;
            let _nums = that.goods[that.ActiveIndex].total;
            that.goods[that.ActiveIndex].total = _nums - index;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getActiveNewTotal(event) {
      if (this.ActiveIndex == null) {
        return;
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      let _inputTotal = event.target.value;
      let tc_replenish_number = Number(that.goods[that.ActiveIndex].replenish_number);
      let _changeNum = null;
      this.timeoutId = setTimeout(function() {
        // 1000毫秒以后执行方法
        if (that.goods[that.ActiveIndex].total == _inputTotal) {
          console.log("值没有变化！！！");
          that.getData();
          return;
        } else {
          console.log(_inputTotal, tc_replenish_number);
          if (_inputTotal < tc_replenish_number) {
            _inputTotal = tc_replenish_number;
            Toast(`订货数量不少于${tc_replenish_number}`);
            that.$refs.tcInput[that.ActiveIndex].value = tc_replenish_number;
          }
          _changeNum = Number(-(that.goods[that.ActiveIndex].total - _inputTotal));
          console.log("数量变化：：", that.goods[that.ActiveIndex].total, _inputTotal, _changeNum);
          that.$refs.tcInput[that.ActiveIndex].blur();
          if (_changeNum != 0) {
            that.changeCount(that.goods[that.ActiveIndex].id, that.goods[that.ActiveIndex].total, _changeNum);
            return;
          }
        }
      }, 1000); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    getActiveOldTotal(_index) {
      this.ActiveIndex = _index;
    },
    numberLeft(index) {
      // console.log(this.goods[index].total);
      if ((this.$route.params.type == "activity" || this.$route.params.order_id != undefined) && this.goods[index].total - 1 < this.goods[index].replenish_number) {
        Toast(`订货数量不少于${this.goods[index].replenish_number}`);
        return;
      }
      this.goods[index].total = Number(this.goods[index].total) - 1;
      if (this.goods[index].total <= 0) {
        Toast("商品数量不能为负数或零");
        this.goods[index].total = 1;
        return;
      }
      this.ActiveIndex = index;
      this.changeCount(this.goods[index].id, this.goods[index].total, -1);
    },
    numberRight(index) {
      // console.log(this.goods[index].total);
      this.goods[index].total = Number(this.goods[index].total) + 1;
      // if (this.goods[index].total >= 51) {
      //   Toast("该商品每周最多可购买50件");
      //   this.goods[index].total = 1;
      //   return;
      // }
      this.ActiveIndex = index;
      this.changeCount(this.goods[index].id, this.goods[index].total, 1);
    },

    changeNumberView(goods) {
      for (var i = 0; i < this.checkList.length; i++) {
        if (goods == this.checkList[i].id) {
          if (this.checkList[i].total > 0) {
            //this.checkList[i].total = this.checkList[i].total + 1;
            this.countTotalPrice(); //计算总价格
            return;
          }
        }
      }
    }
  },
  components: { cTitle }
};
