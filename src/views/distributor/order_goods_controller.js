import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import BScroll from "better-scroll";
var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isOpenOrder: false, //是否开启订货活动
      tc_specitem: null,
      tc_replenish_price: null, //套餐订货价
      tc_price_total: null, //套餐总价
      tc_replenish_number: null, //套餐订货数量
      showTaochangPopup: false,
      activeOpenIndex: 0,
      kwd: "",
      activeName: 0,
      showSpec: false,
      listOne: [],
      carts: [],
      cartIDs: [],
      goodsCarts: [], //购物车转为goods key的数组
      goodsCartsTotal: [],
      goodsInfo: {},
      popCard: {},
      popThumb: "",
      popPrice: 0,
      popStock: 1,
      goodsDescription: "",
      goodsCount: 1,
      popNum: 0,
      destroyData_status: false,

      cat_level: 2, //分类等级 2级或者3级
      category1: 0,
      category2: 0,
      category3: 0,
      category1_disabled: false,
      category2_disabled: true,
      category3_disabled: true,
      categoryOption1: [{ text: "全部", value: 0 }],
      categoryOption2: [{ text: "全部", value: 0, child: [] }],
      categoryOption3: [{ text: "全部", value: 0 }],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      timeoutId: null,
      numberLeft_timeout: null,
      save_clicknumber: 0,

      ActiveInputId: null, //暂存当前获取焦点的id
      ActiveOldTotal: null, //暂存当前获取焦点的值

      titleInfo: [],
      showTitle: [],
      collapseIndex: [],
      categoryContentBScroll:null
    };
  },
  mounted() {
    this.categoryOption1 = [{ text: "全部", value: 0 }];
    this.activeName = 0;
    this.initData();
    this.updateData();
    this.enableActivity();
    // this.getData();
    this.getCategoryOne();
  },
  watch: {
    collapseIndex: function(newVal) {
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
    }
  },
  methods: {
    initData() {
      this.kwd = "";
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;

      this.isOpenOrder = false;
      this.tc_specitem = null;
      this.tc_replenish_price = null;
      this.tc_price_total = null;
      this.tc_replenish_number = null;
      this.showTaochangPopup = false;
      this.activeOpenIndex = 0;

      this.showSpec = false;
      this.listOne = [];
      this.carts = [];
      this.cartIDs = [];
      this.goodsCarts = []; //购物车转为goods key的数组
      this.goodsCartsTotal = [];
      this.goodsInfo = {};
      this.popCard = {};
      this.popThumb = "";
      this.popPrice = 0;
      this.popStock = 1;
      this.goodsDescription = "";
      this.goodsCount = 1;

      this.cat_level = 2; //分类等级 2级或者3级
      this.category1 = 0;
      this.category2 = 0;
      this.category3 = 0;
      this.category1_disabled = false;
      this.category2_disabled = true;
      this.category3_disabled = true;
      this.categoryOption2 = [{ text: "全部", value: 0, child: [] }];
      this.categoryOption3 = [{ text: "全部", value: 0 }];
    },
    getActiveOldTotal(_id) {
      this.ActiveInputId = _id;
      this.ActiveOldTotal = this.goodsCartsTotal[_id].total;
    },
    getActiveOldTotal_1(_id) {
      this.ActiveInputId = _id;
      this.ActiveOldTotal = this.popNum;
    },
    getActiveNewTotal(event) {
      if (!this.ActiveInputId) {
        return;
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      let _inputTotal = event.target.value;
      let _changeNum = null;
      this.timeoutId = setTimeout(function() {
        // 800毫秒以后执行方法
        if (that.ActiveOldTotal == _inputTotal) {
          console.log("值没有变化！！！");
          return;
        } else {
          console.log(_inputTotal, that.tc_replenish_number);
          if (that.activeName == 0 && _inputTotal < that.tc_replenish_number) {
            _inputTotal = that.tc_replenish_number;
            that.popNum = that.tc_replenish_number;
            Toast(`订货数量不少于${that.tc_replenish_number}`);
            that.$refs.tcInput.value = that.tc_replenish_number;
            return;
          }
          _changeNum = Number(-(that.ActiveOldTotal - _inputTotal));
          console.log("数量变化：：", that.ActiveOldTotal, _inputTotal, _changeNum);

          if (that.activeName == 0) {
            that.$refs.tcInput.blur();
            if (_changeNum != 0) {
              that.changeCount(that.ActiveInputId, that.popNum, _changeNum);
              return;
            }
          } else {
            that.$refs[`ordinaryInputRef${that.ActiveInputId}`][0].blur();
            that.changeCount(that.goodsCarts[that.ActiveInputId].id, that.goodsCartsTotal[that.ActiveInputId].total, _changeNum);
            return;
          }
        }
      }, 1000); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    numberLeft(_id) {
      // this.goodsCartsTotal[_id].total =
      //   Number(this.goodsCartsTotal[_id].total) - 1;
      // console.log("88888888888", this.goodsCartsTotal[_id].total)
      // if (this.goodsCartsTotal[_id].total < 0) {
      //   console.log("4444444")
      //   return
      // } else if (this.goodsCartsTotal[_id].total == 0) {
      //   //小于等于0 清空该商品购物车数量
      //   console.log("1111111111111")
      //   this.destroyData(this.goodsCarts[_id].id);
      //   return;
      // } else {
      //   console.log('22222222222222222')
      //   this.changeCount(
      //     this.goodsCarts[_id].id,
      //     this.goodsCartsTotal[_id].total,
      //     -1
      //   );
      // }

      let that = this;
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.numberLeft_timeout) {
        clearTimeout(this.numberLeft_timeout); // 先清除之前的延时，并在下面重新开始计算时间
      }

      this.save_clicknumber++;
      that.goodsCartsTotal[_id].total = Number(that.goodsCartsTotal[_id].total) - 1;

      this.numberLeft_timeout = setTimeout(function() {
        // 300毫秒以后执行方法
        if (that.goodsCartsTotal[_id].total <= 0) {
          //小于等于0 清空该商品购物车数量
          that.destroyData(that.goodsCarts[_id].id);
        } else {
          that.changeCount(that.goodsCarts[_id].id, that.goodsCartsTotal[_id].total, -that.save_clicknumber);
        }

        that.save_clicknumber = 0;
      }, 300); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    numberRight(_id, _stock, good) {
      //价格权限
      // if (good.vip_level_status && good.vip_level_status.status == 1) {
      //   Toast(good.vip_level_status.tips);
      //   return false;
      // }
      if (_stock == 0) {
        Toast("库存不足");
        return;
      }
      let that = this;
      if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
        if (this.goodsCartsTotal[_id].total >= _stock) {
          console.log("数量超出范围");
          Toast("库存不足");
          return;
        }
        this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) + 1;
      } //else {
      //}
      $http.get("plugin.channel.frontend.member-cart.store", { goods_id: _id, total: 1 }, "").then(
        function(response) {
          if (response.result === 1) {
            that.updateData();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    submitAction_tc() {
      console.log("sdf了喀什地方就", optionsId);
      let that = this;
      $http.get("plugin.channel.frontend.replenish-cart.store", { goods_id: this.goodsInfo.id, total: that.tc_replenish_number, option_id: optionsId }, "").then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.updateData();
            that.popNum = that.popNum + 1;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    selectSpecs_tc(data) {
      optionsId = data.option_id;
      let that = this;
      this.tc_replenish_price = data.replenish_price;
      this.tc_price_total = data.price_total;
      this.tc_replenish_number = Number(data.replenish_number) > 0 ? Number(data.replenish_number) : 1;

      that.popNum = 0;
      that.popCard = {};
      for (let i = 0; i < this.carts.length; i++) {
        if (that.carts[i].goods_id === that.goodsInfo.id && that.carts[i].option_id === optionsId) {
          console.log("撒扩大飞机阿斯利康地方", that.carts[i]);

          that.popNum = that.carts[i].total;
          that.popCard = that.carts[i];
          return;
        }
        // that.popNum = 0;
        // that.popCard = {};
      }
    },
    //弹窗提交确认
    submitAction() {
      let that = this;
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
      $http.get("plugin.channel.frontend.member-cart.store", { goods_id: this.goodsInfo.id, total: 1, option_id: optionsId }, "").then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.updateData();
            that.popNum = that.popNum + 1;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    change() {
      //关闭分类折叠面板
      this.collapseIndex = [];
    },
    changeCount(_id, _num, index, _good) {
      let that = this;
      if (_num < 0) {
        return;
      }
      if (_num == 0) {
        this.destroyData(_id);
        return;
      }
      if (this.activeName == 0 && index == -1 && _num < this.tc_replenish_number) {
        Toast(`订货数量不少于${that.tc_replenish_number}`);
        return;
      }

      let json = {
        id: _id,
        num: index,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      let _url = this.activeName == 0 ? "plugin.channel.frontend.replenish-cart.updateNum" : "plugin.channel.frontend.member-cart.updateNum";
      $http.get(_url, json, "").then(
        function(response) {
          if (response.result === 1) {
            that.ActiveInputId = null;
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
                console.log("error:::");
                that.popNum = that.popNum + index;
                break;
              }
            }
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    updateData() {
      //更新购物车数据
      let that = this;
      let _url = this.activeName == 0 ? "plugin.channel.frontend.replenish-cart.index" : "plugin.channel.frontend.member-cart.index";
      $http.get(_url, { channel_type: 2 }).then(response => {
        if (response.result === 1) {
          // that.cartInfo = response.data; //更新购物车数据，避免不同步
          // that.contentlist.member_cart = response.data;
          that.getCart(response.data);
        } else {
          Toast(response.msg);
        }
      });
    },
    /**
     * 如果传了商品，通过商品id获取购物车数量
     * @param goods
     */
    getCart(goods, flag) {
      var that = this;
      that.carts = goods;
      that.goodsCarts = [];
      that.cartIDs = [];
      that.carts.forEach(item => {
        that.$set(that.goodsCarts, item.goods_id, item);
        if (goods && goods.id === item.goods_id) {
          goods.buyNum = item.total;
        }
        if (item.goods_id === that.goodsInfo.id && item.option_id === optionsId) {
          that.popNum = item.total;
          that.popCard = item;
        }
        that.cartsNum += item.total;
        that.cartsTotal += item.total * item.goods.price;

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
    destroyData(_cid) {
      //清除该购物车商品id
      if (this.destroyData_status) {
        return;
      }
      this.destroyData_status = true;
      let that = this;
      let _url = this.activeName == 0 ? "plugin.channel.frontend.replenish-cart.destroy" : "plugin.channel.frontend.member-cart.destroy";
      $http.get(_url, { ids: _cid }).then(response => {
        that.destroyData_status = false;
        if (response.result == 1) {
          that.updateData();
        } else {
          Toast(response.msg);
        }
      });
    },
    buyOrder() {
      if (!this.goodsInfo.id) {
        Toast("商品id错误！");
        return;
      }
      if (this.popNum <= 0) {
        Toast("商品数量不能少于0！");
        return;
      }
      if (this.activeName == 0 && this.popNum < this.tc_replenish_number) {
        Toast(`订货数量不少于${this.tc_replenish_number}`);
        this.$refs.tcInput.value = this.tc_replenish_number;
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: "channel_buy",
            goodsId: this.goodsInfo.id,
            optionsId: optionsId,
            total: this.popNum
          }
        )
      );
    },
    init() {
      specsManage = []; //选择池 用于排序
      optionsId = ""; //选择后的 规格ID
      optionsMaxCount = 1;
      this.popStock = 1;
      this.goodsDescription = "";
      this.goodsCount = 1;
    },
    //初始化弹窗view
    initPopView(_tc) {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock ? this.goodsInfo.stock : ""; //设置默认库存
      if (_tc) {
        if (!optionsId) {
          // 默认选择第一个
          optionsId = this.goodsInfo.level_options[0].option_id;
          this.tc_replenish_price = this.goodsInfo.level_options[0].replenish_price;
          this.tc_price_total = this.goodsInfo.level_options[0].price_total; //套餐总价
          this.tc_replenish_number = Number(this.goodsInfo.level_options[0].replenish_number) > 0 ? Number(this.goodsInfo.level_options[0].replenish_number) : 1; //套餐订货数量
          for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].goods_id === this.goodsInfo.id && this.carts[i].option_id === optionsId) {
              this.popNum = this.carts[i].total;
              this.popCard = this.carts[i];
              break;
            }
            this.popNum = 0;
            this.popCard = {};
          }
        }
      } else if (this.fun.isTextEmpty(this.goodsInfo.has_many_options)) {
        // 无规格
        this.popPrice = this.goodsInfo.price; //设置默认价格
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock ? this.goodsInfo.stock : ""; //设置最大购买量
        this.load = true;
        // console.log("无规格================")
      } else {
        // this.popPrice = this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
        this.goodsDescription = "选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
        }
        if (!optionsId) {
          // 默认选择第一个
          console.log(this.goodsInfo);
          for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
            this.goodsInfo.has_many_specs[i].description = this.goodsInfo.has_many_specs[i].specitem[0];
            this.selectSpecs(this.goodsInfo.has_many_specs[i].specitem[0]);
          }
        }
        this.load = true;
        // console.log("有规格===========")
      }
    },
    //界面选择规格触发事件
    selectSpecs(data) {
      // var specid = data.specid; //对其他数据筛选 不筛选同级
      //console.log(specid);
      //处理选择池
      this.manageSpecs(data);

      //处理规格组合选择状态
      this.setGoodsSpecs(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo();

      //判断当前购买总量与库存的关系
      this.getMaxCount();
    },
    //处理选择池
    manageSpecs(data) {
      var specsObject = {};
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
          this.setGoodsSpecsStatus(this.goodsInfo.has_many_specs[i].specitem, specs.id);
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
            return;
          }
        }
      }

      //关键处理方式 后期要优化 效率低
      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
                return;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
                return;
              }
            }
          }
        }
      }

      console.log(options);
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log("goodsSpecs", goodsSpecs);
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (goodsSpecs == this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)) {
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            console.log("optionsId", optionsId);
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.popNum = 0;
            }

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

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (optionsMaxCount == 0) {
          //库存不足
          this.popNum = 0;
        }
        if (this.popNum > optionsMaxCount) {
          this.popNum = optionsMaxCount;
        }
      }
    },
    //增加
    addGoods() {
      console.log("增加");
      if (specsManage.length == this.goodsInfo.has_many_specs.length && this.popNum == optionsMaxCount) {
        console.log("数量超出范围");
        Toast("数量超出范围");
        console.log("max=" + this.popNum);
        return;
      }
      this.popNum++;
    },

    //减少
    reduceGoods() {
      if (this.popNum == 1 || this.popNum == 0) {
        return;
      }
      this.goodsCount--;
    },
    enableActivity() {
      $http
        .post("plugin.channel.frontend.goods-stock.enableActivity", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.isOpenOrder = true;
            this.$nextTick(() => {
              this.activeName = "0";
              this.getData();
            });
          } else {
            //Toast(response.msg);
            this.isOpenOrder = false;
            this.activeName = "1";
            this.getData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      console.log(this.activeName, this.isOpenOrder);
      if(this.categoryContentBScroll){
        this.categoryContentBScroll.refresh();
      }
      if (!this.isOpenOrder && this.activeName == 0) {
        this.listOne = [];
        return;
      }
      let that = this;
      let json = {};
      if (this.kwd) {
        json.kwd = this.kwd;
      }
      this.category1 = 0;
      this.category2 = 0;
      this.category3 = 0;
      this.category1_disabled = false;
      this.category2_disabled = true;
      this.category3_disabled = true;
      let _url = this.activeName == 0 ? "plugin.channel.frontend.goods-stock.getListByActivity" : "plugin.channel.frontend.goods-stock.getList";
      $http
        .post(_url, json, "")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.listOne = response.data.list.data;
            console.log(this.listOne, response.data.list.data);
            for (let i = 0; i < this.listOne.length; i++) {
              if (!that.fun.isTextEmpty(that.listOne[i].level_options)) {
                that.$set(that.listOne[i], "activeLevelOptions", that.listOne[i].level_options[0]);
              }
            }
            this.updateData();
            this.$nextTick(()=>{
              if(!this.categoryContentBScroll){
                console.log("zhix");
                this.categoryContentBScroll = new BScroll(this.$refs.category_content, {
                  click: true,
                  pullUpLoad:true
                });
                console.log(this.categoryContentBScroll);
                this.categoryContentBScroll.on('pullingUp',() => {
                  console.log("执行");
                  this.getMoreData();
                });
              }else {
                this.categoryContentBScroll.refresh();
              }
            });
            
            
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        console.log(this.page,this.total_page,"没有更多了");
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };

        let _url = null;
        if (that.activeName == 1) {
          if (that.category3 != 0) {
            _url = "plugin.channel.frontend.goods-category.getGoodsListByCategoryId";
            json.category_id = that.category3;
          } else if (that.category2 != 0) {
            _url = "plugin.channel.frontend.goods-category.getGoodsListByCategoryId";
            json.category_id = that.category2;
          } else if (that.category1 != 0) {
            _url = "plugin.channel.frontend.goods-category.getChildCategory";
            json.parent_id = that.category1;
          } else {
            _url = "plugin.channel.frontend.goods-stock.getList";
            if (that.kwd) {
              json.kwd = that.kwd;
            }
          }
        } else {
          if (that.kwd) {
            json.kwd = that.kwd;
          }
          _url = "plugin.channel.frontend.goods-stock.getListByActivity";
        }
        $http.get(_url, json, "").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = null;
              if (that.activeName == 0) {
                myData = response.data.list.data;
                for (let i = 0; i < myData.length; i++) {
                  if (!that.fun.isTextEmpty(myData[i].level_options)) {
                    that.$set(myData[i], "activeLevelOptions", myData[i].level_options[0]);
                  }
                }
              } else if (that.activeName == 1) {
                if (that.category3 != 0) {
                  myData = response.data.data;
                } else if (that.category2 != 0) {
                  myData = response.data.data;
                } else if (that.category1 != 0) {
                  myData = response.data.goods_list.data;
                } else {
                  myData = response.data.list.data;
                }
              }
              that.listOne = that.listOne.concat(myData); //数组拼接
              this.$nextTick(()=>{
                this.categoryContentBScroll.refresh();
                this.categoryContentBScroll.finishPullUp();
              });
              
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    showPop(_data) {
      this.goodsInfo = _data;
      this.showSpec = true;
      this.init();
      this.initPopView();
    },
    showTaochang(_data, index) {
      this.goodsInfo = _data;
      this.showTaochangPopup = true;
      this.activeOpenIndex = index;
      this.tc_specitem = _data.level_options[0];
      this.init();
      this.initPopView(true);
    },
    closedTaochangPopup() {
      this.$set(this.listOne[this.activeOpenIndex], "activeLevelOptions", this.tc_specitem);
    },
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoCart() {
      let _type = this.activeName == "0" ? "activity" : "ordinary";
      this.$router.push(this.fun.getUrl("exchangeCart", { type: _type }));
    },
    getCategoryOne() {
      //获取一级分类列表
      $http
        .post("plugin.channel.frontend.goods-category.getList", {}, "")
        .then(response => {
          if (response.result === 1) {
            let category1_list = response.data.category.data;
            if (category1_list.length > 0) {
              category1_list.forEach((val, index) => {
                this.categoryOption1.push({
                  text: val.name,
                  value: val.id
                });
              });
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCategorytwo(_cid, _open) {
      //获取一级分类的下级分类列表（二级三级）
      let that = this;
      this.categoryOption2 = [{ text: "全部", value: 0, child: [] }];
      this.categoryOption3 = [{ text: "全部", value: 0 }];
      this.category2 = 0;
      this.category3 = 0;
      this.category2_disabled = true;
      this.category3_disabled = true;
      if (_cid == 0) {
        return;
      }
      $http
        .post("plugin.channel.frontend.goods-category.getChildCategory", { parent_id: _cid }, "")
        .then(response => {
          if (response.result === 1) {
            this.categoryOption2 = [{ text: "全部", value: 0, child: [] }];
            this.categoryOption3 = [{ text: "全部", value: 0 }];
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            let category2_list = response.data.data;
            this.listOne = response.data.goods_list.data;
            if (category2_list.length > 0) {
              category2_list.forEach((val, index) => {
                that.categoryOption2.push({
                  text: val.name,
                  value: val.id,
                  child: val.has_many_children
                });
              });
              this.titleInfo = this.categoryOption2;
              this.showTitle = this.categoryOption2;

              console.log(this.titleInfo);
              if (_open) {
                this.category2_disabled = false;
                //this.$refs.categoryShow2.toggle();
              }
            } else {
              this.titleInfo = this.categoryOption2;
              this.showTitle = this.categoryOption2;
            }
          } else {
            this.titleInfo = this.categoryOption2;

            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectCate1(item) {
      console.log(this.category1);
      this.category1 = item.value;
      this.collapseIndex = [];
      let value = item.value;

      //一级分类发生变化触发
      this.kwd = "";
      if (value) {
        this.getCategorytwo(value, true);
      } else {
        console.log("不限一级分类");
        // this.initData();
        this.getData();
      }
    },
    selectCate2(item) {
      //二级分类发生变化触发
      let that = this;
      this.category2 = item.value;
      let value = item.value;
      if (value) {
        this.categoryOption3 = [{ text: "全部", value: 0 }];
        this.category3_disabled = true;
        this.categoryOption2.forEach((val, index) => {
          if (val.value == value) {
            if (!that.fun.isTextEmpty(val.child)) {
              val.child.forEach((val, index) => {
                that.categoryOption3.push({
                  text: val.name,
                  value: val.id
                });
              });
              return;
            }
          }
        });
        this.getChildCate(2, value, true);
      } else {
        console.log("不限二级分类");
        this.getCategorytwo(this.category1, false);
      }
    },
    selectCate3(item) {
      this.category3 = item.value;
      let value = item.value;
      //三级分类发生变化触发
      if (value) {
        this.getChildCate(3, value, true);
      } else {
        this.getChildCate(2, this.category2, false);
      }
    },
    getChildCate(_index, _id, _open) {
      $http
        .post("plugin.channel.frontend.goods-category.getGoodsListByCategoryId", { category_id: _id }, "")
        .then(response => {
          if (response.result === 1) {
            this.listOne = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            if (_index == 2 && this.categoryOption3.length > 1 && _open) {
              this.category3 = 0;
              this.category3_disabled = false;
              //this.$refs.categoryShow3.toggle();
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoGoodDetail(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id }));
    }
  },
  components: { cTitle }
};
