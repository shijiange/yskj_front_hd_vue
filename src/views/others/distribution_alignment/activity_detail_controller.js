import cMyswipe from "components/myswipe";
import cTitle from "components/title";
import { Toast } from 'vant';
import Vue from "vue";
import { Overlay } from "vant";
Vue.use(Overlay);

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;

const SUBMIT_ACTION_CART = "-1"; //添加到购物车
const SUBMIT_ACTION_BUY = "-2"; //立即购买
var submitActionTag = "-2";

export default {
  data() {
    return {
      checked: -1,
      activeName: "first",
      posterShow: false,
      posterImg: "",
      goods_list: [],
      datas: {},
      id: "",

      cservice:'',//客服
      share_title: "",
      share_icon: "",
      share_desc: "",


      // 选择商品
      selected_goods: {},
      isGoods: true,
      popupSpecs: false,
      popupSpecs2:false,
      popStock: 0,//库存
      popPrice:0,//价格


      goodsDescription: "",//体现语言
      goodsCount:1,

    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.checked = -1;
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post(
          "plugin.commission-activity.api.activity.detail",
          { id: this.id },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              let datas = response.data;
              this.datas = datas;
              this.goods_list = datas.goods;
              this.share_title = datas.share_title;
              this.share_icon = datas.share_icon;
              this.share_desc = datas.share_desc;

              console.log(this.goods_list);
              // this.initShare();
              this.fun.wxShare(
                "",
                { },
                {
                  title: this.fun.isTextEmpty(this.share_title)
                    ? this.datas.title
                    : this.share_title,
                  imgUrl: this.fun.isTextEmpty(this.share_icon)
                    ? this.datas.cover
                    : this.share_icon,
                  description: this.share_desc
                },
                data => {
                  if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
                    this.initCservice(data.shop.shop.cservice); //客服重新赋值
                  }
                }
              );
            } else {
              this.$dialog.alert({message:response.msg}).then(()=>{
                this.$router.go(-1);
              });

            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },

    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        // let toastPoster = Toast({
        //   duration: -1, // 持续展示 toast
        //   message: '正在为您生成海报中'
        // });
        $http
          .get(
            "plugin.commission-activity.api.activity-poster.index",
            { id: this.$route.params.id },
            ""
          )
          .then(response => {
            // toastPoster.clear();
            if (response.result == 1) {
              this.posterImg = response.data;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({message:response.msg});
            }
          })
          .catch(error => {
            // toastPoster.clear();
            console.log(error);
          });
      }
    },
    // 初始化商品信息
    initGoods() {
      specsManage = []; //选择池 用于排序
      optionsId = ""; //选择后的 规格ID
      optionsMaxCount = 1;

      this.popStock= 0;//库存
      this.popPrice=0;//价格

      this.goodsDescription= "";//体现语言
      this.goodsCount=1;
    },
    //立即购买
    buyNow() {
      if (this.checked == -1) {
        Toast("请选择要购买的商品");
        return false;
      }
      // 初始化商品信息
      this.initGoods();
      this.selected_goods = this.goods_list[this.checked];
      optionsMaxCount = this.selected_goods.stock;
      console.log(this.goods_type, "this.goods_type");
      $http.get("member.member.isValidatePageGoods", {}).then(
        response => {
          if (response.result === 1) {
            // if (
            //   this.goodsInfo.has_one_invite_page &&
            //   this.goodsInfo.has_one_invite_page.status === 1 &&
            //   response.data.is_invite === 0
            // ) {
            //   this.$router.push(
            //     this.fun.getUrl("Inviter", {}, { fromGood: 1 })
            //   );
            //   return;
            // }
            if (!this.isGoods) {
              Toast("商品已下架或不存在");
              return;
            }
            //判断是否有规格

            if (this.goods_list[this.checked].has_option == 1) {
              //有规格 但是还未选择
              this.popupSpecs = true;
              if (!optionsId) {
                // 默认选择第一个
                console.log(this.goods_list[this.checked]);
                for (let i = 0; i < this.goods_list[this.checked].has_many_specs.length; i++) {
                  this.goods_list[this.checked].has_many_specs[i].description = this.goods_list[this.checked].has_many_specs[i].has_many_specs_item[0];
                  this.selectSpecs(
                    this.goods_list[this.checked].has_many_specs[i].has_many_specs_item[0]
                  );
                }
              }
            } else if (this.goods_list[this.checked].has_option == 0) {
              //无规格
              //新处理 显示增加数量
              this.showPopView2();

              //处理参数
              //this.buyNowRequest(goods_id, optionsId, this.goodsCount);
            }
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
      );
    },
    //无规格选择 增加数量
    showPopView2() {
      this.popupSpecs2 = true;
    },
    hidePopView2() {
      this.popupSpecs2 = false;
    },
    //新处理立即购买
    buyNowNew() {
      this.hidePopView2();
      //处理参数

      this.buyNowRequest(this.selected_goods.id, optionsId, this.goodsCount);
    },

    //立即购买网络操作
    buyNowRequest(_goodsId, _optionsId, _total) {
      if (optionsMaxCount == 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }
      if (_total <= 0) {
        Toast("请选择商品数量");
        return;
      }

      console.log(submitActionTag,"submitActionTag");

      //请求保税商品接口
      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中...").then(
        function(response) {
          if (response.result == 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog.confirm({ message: "购买此商品,请补充您的个人信息"})
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: submitActionTag,
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    })
                  );
                }).catch(() => {});
            } else {

              //普通商品
              that.$router.push(
                that.fun.getUrl("goodsorder",{}, {
                  tag: submitActionTag,
                  goodsId: _goodsId,
                  optionsId: _optionsId,
                  total: _total,
                  activity_id:that.id,
                })
              );
              // 暂时只做普通商品的下单
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //提交确认
    submitAction() {
      if (specsManage.length < this.goods_list[this.checked].has_many_specs.length) {
        // console.log(this.goodsDescription);
        this.popupSpecs = false;
        Toast(this.goodsDescription);
        return;
      }

      if (submitActionTag == SUBMIT_ACTION_CART) {
        //购物车网络处理
        this.popupSpecs = false;
        //处理参数
        // if(this.goodsCount<=0){
        //   this.popupSpecs = true;
        //   return
        // }
        this.addCartRequest(this.selected_goods.id, optionsId, this.goodsCount);
      } else if (submitActionTag == SUBMIT_ACTION_BUY) {
        //立即购买处理
        this.popupSpecs = false;
        //处理参数

        // if(this.goodsCount<=0){
        //   this.popupSpecs = true;
        //   return
        // }
        this.buyNowRequest(this.selected_goods.id, optionsId, this.goodsCount);
      }
    },

    //界面选择规格触发事件
    selectSpecs(data) {
      var specid = data.specid; //对其他数据筛选 不筛选同级
      console.log(specid);
      console.log(data);

      // 处理选择池
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
      if (specsManage.length == this.goods_list[this.checked].has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goods_list[this.checked].has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goods_list[this.checked].has_many_specs[i].id == specsManage[j].specid) {
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
      if (specsManage.length == this.goods_list[this.checked].has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goods_list[this.checked].has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goods_list[this.checked].has_many_specs[i].id != specsManage[j].specid) {
              description += this.goods_list[this.checked].has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },
    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.goods_list[this.checked].has_many_specs.length; i++) {
        if (specs.specid != this.goods_list[this.checked].has_many_specs[i].id) {
          this.setGoodsSpecsStatus(
            this.goods_list[this.checked].has_many_specs[i].has_many_specs_item,
            specs.id
          );
        }
      }
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.goods_list[this.checked].has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log("goodsSpecs", goodsSpecs);
        for (let i = 0; i < this.goods_list[this.checked].has_many_options.length; i++) {
          if (
            goodsSpecs ==
            this.setGoodsSpecsBySort(this.goods_list[this.checked].has_many_options[i].specs)
          ) {
            this.popPrice = this.goods_list[this.checked].has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(
              this.goods_list[this.checked].has_many_options[i].thumb
            )
              ? this.goods_list[this.checked].thumb
              : this.goods_list[this.checked].has_many_options[i].thumb; //设置图片
            this.popStock = this.goods_list[this.checked].has_many_options[i].stock; //设置库存

            optionsId = this.goods_list[this.checked].has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goods_list[this.checked].has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.goodsCount = 1;
            }

            break;
          }
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goods_list[this.checked].has_many_options.length; i++) {
        // console.log(this.goods_list[this.checked].has_many_options[i].specs);
        let _specs = this.goods_list[this.checked].has_many_options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goods_list[this.checked].has_many_options[i]);
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

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goods_list[this.checked].has_many_specs.length) {
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

    //增加
    addGoods() {
      console.log("增加");
      if (
        specsManage.length == this.goods_list[this.checked].has_many_specs.length &&
        this.goodsCount == optionsMaxCount
      ) {
        console.log("数量超出范围");
        Toast("库存不足");
        console.log("max=" + this.goodsCount);
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

    gotoGoods(id) {
      this.$router.push(this.fun.getUrl("DistributionGoods", { id: id,activity_id:this.id }));
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message:"请点击右上角微信分享"});

    },

    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      let _title = that.fun.isTextEmpty(that.share_title)
        ? that.gooddatas.title
        : that.datas.title;

      let _link = document.location.href;

      _link = that.fun.isMid(_link, data.info.uid);

      let _imgUrl = that.fun.isTextEmpty(that.share_icon)
        ? that.datas.cover
        : that.share_icon;
      let _desc = that.fun.isTextEmpty(that.share_desc)
        ? data.shop.shop.name
        : that.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //初始化分享设置
    initShare() {
      let that = this;
      console.log(document.location.href);
      let _url = document.location.href;
      let json = { url: _url };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          console.log(response);
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
            if (!that.fun.isTextEmpty(response.data.shop)) {
              that.initCservice(response.data.shop.cservice); //重新赋值
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //分享
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.share_title)
          ? that.datas.title
          : that.share_title;
        let _link = document.location.href;

        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.share_icon)
          ? that.datas.cover
          : that.share_icon;
        let _desc = that.fun.isTextEmpty(that.share_desc)
          ? data.shop.shop.name
          : that.share_desc;

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
    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        return;
      }

      if (
        !this.fun.isTextEmpty(this.$store.state.temp.mailInfo) &&
        !this.fun.isTextEmpty(this.$store.state.temp.mailInfo.cservice)
      ) {
        this.cservice = this.$store.state.temp.mailInfo.cservice;
        return;
      }
    },
    goHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    goMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
  },
  components: { cTitle, cMyswipe }
};
