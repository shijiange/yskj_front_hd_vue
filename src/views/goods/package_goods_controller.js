import cTitle from "components/title";
import { Toast } from 'vant';
// import fun from "../../fun";

export default {
  data() {
    return {
      //套餐ID
      package_id: "",
      carousels: [],
      packageTitle: "",
      description_title: "",
      description_thumb: "",
      description_desc: "",
      category_idex: 0,
      categories: [],
      vanShow: false,
      zongjiage: 0.0,
      other_packages: [],
      categoriesArrTop: [],
      categoriesheight: [],
      mainInfo: {
        name: "",
        thumb: "",
        introduce: ""
      },
      //显示购结束时间
      limit_time_status: false,
      endTime: 0,
      endTimeStr: "",
      on_sale_price: 0,
      sale_priceshow: false,
      clientWidths: ""
    };
  },
  activated() {
    this.package_id = this.$route.params.id;
    //获取套餐数据
    this.getpackage();
    window.addEventListener("scroll", this.slider);
    this.clientWidths = document.body.clientWidth;
  },
  methods: {
    getpackage() {
      $http
        .get(
          "plugin.goods-package.frontend.package.package.index",
          {
            package_id: this.package_id
          },
          "添加中..."
        )
        .then(response => {
          if (response.result == 1) {
            this.getShareData(response.data);
            this.carousels = response.data.carousels;
            this.packageTitle = response.data.title;
            this.description_thumb = response.data.description_thumb;
            this.description_title = response.data.description_title;
            this.description_desc = response.data.description_desc;
            this.categories = response.data.categories;
            this.other_packages = response.data.other_packages;
            this.on_sale_price = parseFloat(response.data.on_sale_price);
            this.limit_time_status =
              response.data.limit_time_status == 1 ? true : false;
            this.endTime = new Date(parseInt(response.data.end_time) * 1000);
            this.endTimeStr = String(this.endTime);
            for (let i = 0; i < this.categories.length; i++) {
              // this.categories[i].categyd_id=[];
              for (let j = 0; j < this.categories[i].goods_list.length; j++) {
                this.$set(
                  this.categories[i].goods_list[j],
                  "popPrice",
                  this.categories[i].goods_list[j].price
                ); //动态添加
                this.$set(this.categories[i].goods_list[j], "popThumb", ""); //动态添加
                this.$set(this.categories[i].goods_list[j], "goodsnum", 1); //动态添加
                this.$set(this.categories[i].goods_list[j], "optionsId", ""); //动态添加
                this.$set(this.categories[i].goods_list[j], "specsManage", []); //动态添加
                this.$set(
                  this.categories[i].goods_list[j],
                  "popStock",
                  this.categories[i].goods_list[j].stock
                ); //动态添加
                this.$set(this.categories[i].goods_list[j], "checked", false); //动态添加
                // this.categories[i].goods_list[j].popPrice=this.categories[i].goods_list[j].market_price;
                // this.categories[i].goods_list[j].popThumb='';
                // this.categories[i].goods_list[j].goodsnum=1;
                // this.categories[i].goods_list[j].optionsId="";
                // this.categories[i].goods_list[j].specsManage=[];
                // this.categories[i].goods_list[j].popStock=this.categories[i].goods_list[j].stock;
                // this.categories[i].goods_list[j].checked=true;
                for (
                  let k = 0;
                  k < this.categories[i].goods_list[j].has_many_specs.length;
                  k++
                ) {
                  this.$set(
                    this.categories[i].goods_list[j].has_many_specs[k],
                    "speshow",
                    ""
                  ); //动态添加
                  // this.categories[i].goods_list[j].has_many_specs[k].speshow="";
                  for (
                    let d = 0;
                    d <
                    this.categories[i].goods_list[j].has_many_specs[k].specitem
                      .length;
                    d++
                  ) {
                    this.$set(
                      this.categories[i].goods_list[j].has_many_specs[k]
                        .specitem[d],
                      "dispec",
                      false
                    ); //动态添加
                    // this.categories[i].goods_list[j].has_many_specs[k].specitem[d].dispec=false
                  }
                }
              }
            }
          } else {
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("home", {}));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /*项目瞄点*/
    categoriesbtn(e) {
      let index = e;
      let anchor = this.$el.querySelector("#cate_" + index);
      let categoryheight = this.$el.querySelector("#categoryhei").offsetHeight;
      this.$nextTick(() => {
        document.body.scrollTop = anchor.offsetTop - categoryheight;
        document.documentElement.scrollTop = anchor.offsetTop - categoryheight;
      });
    },
    /*项目总标题随滚动条变换显示方式*/
    slider(e) {
      this.categoriesArrTop = [];
      this.categoriesheight = [];
      let content_ahei = this.$el.querySelector(".content_a").offsetHeight;
      let content_bhei = this.$el.querySelector(".content_b").offsetHeight;
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top < content_bhei + content_ahei) {
        this.vanShow = false;
      } else {
        this.vanShow = true;
      }
      for (let b = 0; b < this.categories.length; b++) {
        let anchor = this.$el.querySelector("#cate_" + b);
        let categoryheight = this.$el.querySelector("#categoryhei")
          .offsetHeight;
        this.categoriesArrTop.push(anchor.offsetTop - categoryheight);
        this.categoriesheight.push(anchor.offsetHeight);
      }
      for (let k = 0; k < this.categoriesArrTop.length; k++) {
        if (
          top >= this.categoriesArrTop[k] &&
          this.categoriesArrTop[k] + this.categoriesheight[k] >= top
        ) {
          this.category_idex = k;
        }
      }
    },
    //规格选择
    secbtn(e, specitemdata) {
      let specitem = specitemdata;
      let specid = e.target.dataset.specid;
      let cateidex = e.target.dataset.cateidex;
      let goodsidex = e.target.dataset.goodsidex;
      let specsidex = e.target.dataset.specsidex;
      if (specitem.dispec) {
        return false;
      }
      this.$set(
        this.categories[cateidex].goods_list[goodsidex].has_many_specs[
          specsidex
        ],
        "speshow",
        specid
      ); //动态添加
      // this.categories[cateidex].goods_list[goodsidex].has_many_specs[specsidex].speshow=specid;
      this.manageSpecs(
        this.categories[cateidex].goods_list[goodsidex].specsManage,
        specitem,
        this.categories[cateidex].goods_list[goodsidex].has_many_specs
      );
      for (
        let i = 0;
        i <
        this.categories[cateidex].goods_list[goodsidex].has_many_specs.length;
        i++
      ) {
        if (
          specitem.specid !=
          this.categories[cateidex].goods_list[goodsidex].has_many_specs[i].id
        ) {
          this.setGoodsSpecsStatus(
            cateidex,
            goodsidex,
            this.categories[cateidex].goods_list[goodsidex].has_many_specs[i]
              .specitem,
            specid,
            this.categories[cateidex].goods_list[goodsidex].has_many_specs[i]
              .speshow
          );
        }
      }
      this.setGoodsSpecsChangeInfo(
        cateidex,
        goodsidex,
        this.categories[cateidex].goods_list[goodsidex].specsManage
      );
      this.calculateGooss();
      // this.$forceUpdate();
    },
    setGoodsSpecsStatus(cateidex, goodsidex, specitem, id, speshowid) {
      let optionsData = this.categories[cateidex].goods_list[goodsidex]
        .has_many_options;
      let specsManage = this.categories[cateidex].goods_list[goodsidex]
        .specsManage;
      // let optionsId = this.categories[cateidex].goods_list[goodsidex].optionsId;
      let options = []; //数据池
      for (let i = 0; i < optionsData.length; i++) {
        let optarr = optionsData[i].specs.split("_");
        if (!(optarr.indexOf(id) == -1)) {
          options.push(optionsData[i]);
        }
      }
      //关键处理方式 后期要优化 效率低
      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].dispec = true;
                if (specitem[n].id == speshowid) {
                  speshowid = "";
                  // optionsId = "";
                  for (let k = 0; k < specsManage.length; k++) {
                    if (specsManage[k].id == specitem[n].id) {
                      specsManage.splice(k, 1);
                    }
                  }
                }
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].dispec = false;
              }
            }
          }
        }
      }
    },
    //处理选择池
    manageSpecs(specsManage, data, has_many_specs) {
      let specsObject = {
        id: data.id,
        specid: data.specid,
        title: data.title
      };
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
      if (specsManage.length == has_many_specs.length) {
        let newSpecsManage = [];
        for (let i = 0; i < has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (has_many_specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
    },
    setGoodsSpecsChangeInfo(cateidex, goodsidex, specsManage) {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (
        specsManage.length ==
        this.categories[cateidex].goods_list[goodsidex].has_many_specs.length
      ) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        for (
          let i = 0;
          i <
          this.categories[cateidex].goods_list[goodsidex].has_many_options
            .length;
          i++
        ) {
          if (
            goodsSpecs ==
            this.setGoodsSpecsBySort(
              this.categories[cateidex].goods_list[goodsidex].has_many_options[
                i
              ].specs
            )
          ) {
            this.categories[cateidex].goods_list[
              goodsidex
            ].popPrice = this.categories[cateidex].goods_list[
              goodsidex
            ].has_many_options[i].product_price; //设置价格
            this.categories[cateidex].goods_list[
              goodsidex
            ].popThumb = this.fun.isTextEmpty(
              this.categories[cateidex].goods_list[goodsidex].has_many_options[
                i
              ].thumb
            )
              ? this.categories[cateidex].goods_list[goodsidex].thumb
              : this.categories[cateidex].goods_list[goodsidex]
                .has_many_options[i].thumb; //设置图片
            this.categories[cateidex].goods_list[
              goodsidex
            ].popStock = this.categories[cateidex].goods_list[
              goodsidex
            ].has_many_options[i].stock; //设置库存
            this.categories[cateidex].goods_list[
              goodsidex
            ].optionsId = this.categories[cateidex].goods_list[
              goodsidex
            ].has_many_options[i].id; //设置规格ID，用于生成订单
            break;
          }
        }
      }
    },
    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort(specs) {
      let _specs = specs.split("_"); //先变成数组
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
    //计算商品价格
    calculateGooss: function() {
      let pic = 0;
      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < this.categories[i].goods_list.length; j++) {
          if (this.categories[i].goods_list[j].checked) {
            let goodsnum = this.categories[i].goods_list[j].goodsnum;
            let popPrice = this.categories[i].goods_list[j].popPrice;
            pic += goodsnum * popPrice;
          }
        }
      }
      if (pic && this.on_sale_price && this.sale_priceshow) {
        pic = pic - this.on_sale_price;
      }
      if(pic>0) {
        this.zongjiage = pic.toFixed(2);
      }else {
        this.zongjiage = 0;
      }
    },
    addnum: function() {
      this.calculateGooss();
    },
    categydbtn: function() {
      if (this.limit_time_status) {
        let checkedBol = [];
        for (let i = 0; i < this.categories.length; i++) {
          for (let j = 0; j < this.categories[i].goods_list.length; j++) {
            if (this.categories[i].goods_list[j].checked) {
              checkedBol.push(i);
              break;
            }
          }
        }
        if (this.categories.length == checkedBol.length) {
          this.sale_priceshow = true;
        } else {
          this.sale_priceshow = false;
        }
      }
      this.calculateGooss();
    },
    //提交订单
    submitGoods() {
      let goodBol = true;
      let json = {};
      var _cart_ids = [];
      json.package_id = this.package_id;
      json.goods_list = [];
      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < this.categories[i].goods_list.length; j++) {
          let goods_list = this.categories[i].goods_list;
          let json_1 = {};
          if (
            goods_list[j].has_option == 1 &&
            (goods_list[j].checked &&
              (!goods_list[j].optionsId &&
                goods_list[j].has_many_specs.length > 0))
          ) {
            Toast("请选择商品规格");
            return false;
          }
          if (goods_list[j].checked) {
            goodBol = false;
            _cart_ids.push(goods_list[j].id);
            json_1.goods_id = goods_list[j].id;
            json_1.option_id = goods_list[j].optionsId;
            json_1.total = goods_list[j].goodsnum;
            json.goods_list.push(json_1);
          }
        }
      }
      console.log(json);
      if (goodBol) {
        Toast("请选择结算商品");
        return false;
      }

      this.$router.push(
        this.fun.getUrl("goodsorder",{
          packagJson: json,
        }, {
          tag: "packagBuy",
          cart_ids: _cart_ids.join(',')
        })
      );
    },
    //跳到商品详情
    gogoodsDetailBtn: function(goodsid) {
      this.$router.push(this.fun.getUrl("goods", { id: goodsid }));
    },
    //跳到套餐
    gopackgoods: function(otherpid) {
      this.$router.push(this.fun.getUrl("packageGoods", { id: otherpid }));
    },
    //获取装修分享数据
    getShareData(data) {
      this.mainInfo = {
        name: data.share_title,
        thumb: data.share_thumb,
        introduce: data.share_desc
      };
      // this.initShare();
      this.fun.wxShare(
        "",
        {},
        {
          title: this.mainInfo.name,
          imgUrl: this.mainInfo.thumb,
          description: this.mainInfo.introduce
        },
        data => {
          // if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
          //   this.initCservice(data.shop.shop.cservice); //客服重新赋值
          // }
        }
      );
    },
    //分享
    initShare() {
      let that = this;
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.mainInfo.name)? data.share.title : that.mainInfo.name;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = that.fun.isTextEmpty(that.mainInfo.thumb)? data.share.icon : that.mainInfo.thumb;
        let _desc = that.fun.isTextEmpty(that.mainInfo.introduce)? data.share.desc : that.mainInfo.introduce;
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
    //倒计时结束后
    salePriceTime() {
      this.limit_time_status = false;
      this.sale_priceshow = false;
      this.calculateGooss();
    }
  },
  components: { cTitle }
};
