import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
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
      goodsCount: 1
    };
  },
  activated() {
    this.activeName = 0;
    this.initData();
    this.updateData();
    this.getData();
  },
  methods: {
    initData() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;

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
    },
    numberLeft(_id, _minNum) {
      console.log(this.goodsCartsTotal[_id].total, _minNum);
      if (this.goodsCartsTotal[_id].total - 1 < _minNum) {
        //小于等于0 清空该商品购物车数量
        // this.destroyData(this.goodsCarts[_id].id);
        Toast(`该商品补货数量最少${_minNum}`);
        return;
      } else {
        this.goodsCartsTotal[_id].total =
          Number(this.goodsCartsTotal[_id].total) - 1;
        this.changeCount(
          this.goodsCarts[_id].id,
          this.goodsCartsTotal[_id].total,
          -1
        );
      }
    },
    numberRight(_id, _minNum, good) {
      //价格权限
      // if (good.vip_level_status && good.vip_level_status.status == 1) {
      //   Toast(good.vip_level_status.tips);
      //   return false;
      // }
      if (this.goodsCarts[_id]) {
        this.changeCount(
          this.goodsCarts[_id].id,
          this.goodsCartsTotal[_id].total,
          1
        );
        return;
      }
      // if (_stock == 0) {
      //   Toast("库存不足");
      //   return;
      // }
      let that = this;
      // if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
      //   if (this.goodsCartsTotal[_id].total >= _stock) {
      //     console.log("数量超出范围");
      //     Toast("库存不足");
      //     return;
      //   }
      //   this.goodsCartsTotal[_id].total =
      //     Number(this.goodsCartsTotal[_id].total) + 1;
      // } else {
      // }
      $http
        .get("plugin.channel.frontend.member-cart.store", { goods_id: _id, total: _minNum || 1 }, "")
        .then(
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
      $http
        .get(
          "plugin.channel.frontend.member-cart.store",
          { goods_id: this.goodsInfo.id, total: 1, option_id: optionsId },
          ""
        )
        .then(
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
    clickCount(data) {
      OldGoodsNum = data;
    },
    changeCount(_id, _num, index, _good) {
      let that = this;
      if (_num <= 0) {
        this.destroyData(_id);
        return;
      }
      if (!this.fun.isTextEmpty(_good) && _num >= _good.stock) {
        //无规格
        this.$set(that.goodsCartsTotal[_good.id], "total", OldGoodsNum);
        Toast(`该商品最多购买数量为${_good.stock}`);
        return;
      }

      let json = {
        id: _id,
        num: index,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };

      $http.get("plugin.channel.frontend.member-cart.updateNum", json, "").then(
        function(response) {
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
            that.updateData();
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
      $http.get("plugin.channel.frontend.member-cart.index", {
        channel_type: 2,
        order_id: that.$route.params.order_id
      }).then(response => {
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
        if (
          item.goods_id === that.goodsInfo.id &&
          item.option_id === optionsId
        ) {
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
      let that = this;
      $http.get("plugin.channel.frontend.member-cart.destroy", { ids: _cid }).then(response => {
        if (response.result == 1) {
          that.updateData();
        } else {
          Toast(response.msg);
        }
      });
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
    initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock ? this.goodsInfo.stock : ""; //设置默认库存
      if (this.fun.isTextEmpty(this.goodsInfo.has_many_options)) {
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
          for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
            this.goodsInfo.has_many_specs[
              i
            ].description = this.goodsInfo.has_many_specs[i].specitem[0];
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
          if (
            goodsSpecs ==
            this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)
          ) {
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(
              this.goodsInfo.has_many_options[i].thumb
            )
              ? this.goodsInfo.thumb
              : this.goodsInfo.has_many_options[i].thumb; //设置图片
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
      if (
        specsManage.length == this.goodsInfo.has_many_specs.length &&
        this.popNum == optionsMaxCount
      ) {
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
    getData() {
      let that = this;
      that.listOne = [];
      let json = {};
      json.order_id = that.$route.params.order_id;

      let _url = that.activeName == 0 ? "plugin.channel.frontend.replenishment.getGoods" : "plugin.channel.frontend.goods-change.getList";
      $http
        .post(_url, json, "").then(response => {
          if (response.result === 1) {
            if (that.activeName == 1) {
              that.isLoadMore = true;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.listOne = response.data.list.data;
              return;
            } else {
              that.listOne = response.data.list;
            }

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
      if (that.activeName == 0) {
        return;
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };

        let _url = null;
        if (that.activeName == 1) {
          _url = "plugin.channel.frontend.goods-change.getList";
        } else {
          _url = "plugin.channel.frontend.replenishment.getGoods";
          json.order_id = that.$route.params.order_id;
        }
        $http.get(_url, json, "").then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = null;
            myData = response.data.list.data;
            that.listOne = that.listOne.concat(myData); //数组拼接
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
    // gotoCart() {
    //   this.$router.push(this.fun.getUrl("exchangeCart", {}));
    // },
    changeGood(_id) {
      this.$router.push(this.fun.getUrl("exchangeDetail", { id: _id }));
    },
    gotoCart() {
      this.$router.push(this.fun.getUrl("exchangeCart", { type: "ordinary", order_id: this.$route.params.order_id }));
    }
  },
  components: { cTitle }
};
