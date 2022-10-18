import cTitle from "components/title";
import { Toast } from 'vant';

var specsManage = []; //选择池 用于排序
var optionsId = 0; //选择后的 规格ID
var optionsMaxCount = 1;

export default {
  data() {
    return {
      certificate: null,
      popThumb: '',
      popPrice: 0,
      popStock: 1,
      goodsDescription: '',
      goodsCount: 1,
      goodsInfo: {}
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      specsManage = []; //选择池 用于排序
      optionsId = ""; //选择后的 规格ID
      optionsMaxCount = 1;
      this.popStock = 1;
      this.goodsDescription = '';
      this.goodsCount = 1;
    },
    getData() {
      $http
        .post("plugin.channel.frontend.goods-change.getGoods", { id: this.$route.params.id }, "").then(response => {
          if (response.result === 1) {
            this.goodsInfo = response.data.goods;
            this.certificate = response.data.my_certificate;
            this.initPopView();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goExchange() {
      let _num = this.goodsInfo.goods_change.certificate ? (this.goodsInfo.goods_change.certificate * this.goodsCount) : this.goodsCount;
      if (this.certificate <= 0) {
        Toast("当前兑换券数量不足，暂不能兑换商品");
        return;
      }
      if (this.certificate < _num) {
        Toast("当前兑换券数量不足");
        return;
      }
      $http
        .post("plugin.channel.frontend.goods-change.exchangeGoods", { goods_id: this.$route.params.id, option_id: optionsId, num: this.goodsCount }, "").then(response => {
          if (response.result === 1) {
            Toast("兑换成功！");
            this.getData();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoMyRepertory() {
      this.$router.push(this.fun.getUrl("myRepertory", {}));
    },


    //初始化弹窗view
    initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock ? this.goodsInfo.stock : ''; //设置默认库存
      if (this.fun.isTextEmpty(this.goodsInfo.has_many_options)) {
        // 无规格
        this.popPrice = this.goodsInfo.price; //设置默认价格
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock ? this.goodsInfo.stock : ''; //设置最大购买量
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
      specsManage.sort(function (a, b) {
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
              this.goodsCount = 1;
            }

            break;
          }
        }
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

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (optionsMaxCount == 0) {
          //库存不足
          this.goodsCount = 0;
        }
        if (this.goodsCount > optionsMaxCount) {
          this.goodsCount = optionsMaxCount;
        }
      }
    },
    //增加
    addGoods() {
      // if (
      //   specsManage.length == this.goodsInfo.has_many_specs.length &&
      //   this.goodsCount == optionsMaxCount
      // ) {
      //   Toast("数量超出范围");
      //   console.log("max=" + this.goodsCount);
      //   return;
      // }
      let _num = this.goodsInfo.goods_change.certificate ? (this.goodsInfo.goods_change.certificate * this.goodsCount) : this.goodsCount;
      if (this.certificate < _num) {
        Toast("当前兑换券数量不足");
        return;
      }
      this.goodsCount++;
    },

    //减少
    reduceGoods() {
      if (this.goodsCount == 1 || this.goodsCount == 0) {
        return;
      }
      this.goodsCount--;
    },
  },
  components: { cTitle }
};
