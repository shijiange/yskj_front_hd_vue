import cTitle from "components/title";
import { Toast } from "vant";

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;

export default {
  data() {
    return {
      info: {
        has_one_group: {
          has_one_goods: {
            thumb: "",
            market_price: ""
          }
        },
        has_one_level: { group_price: "" }
      },
      id: "",
      showOpenGroup: false, //规格弹窗
      goodsInfo: {},
      goodsDescription: "",
      popPrice: 0,
      level_id: 0, //当前拼团的层级id
      goodsCount: 1, //购买数量
      goodsId: "",
      activityId: "", //活动id

      isOpen: 0, //活动是否开启
      status: 0,
      action: 0,
      activityTest: "", //当前活动状态
      btnTest: "", //按钮的文字
      btnStatus: false, //按钮是否禁用
      option_level_id: "" //规格层级id
    };
  },
  activated() {
    this.init();
    this.id = this.$route.params.id;
    this.getData();
  },
  // mounted() {
  //   this.share();
  // },
  methods: {
    //初始化数据
    init() {
      this.info = {
        has_one_group: {
          has_one_goods: {
            thumb: "",
            market_price: ""
          }
        },
        has_one_level: { group_price: "" }
      };
      this.id = "";
      this.showOpenGroup = false;
      this.goodsInfo = {}; //保存商品的信息
      this.goodsDescription = "";
      this.popPrice = 0;
      this.level_id = 0;
      this.goodsCount = 1;
      this.goodsId = "";
      this.activityId = "";
      this.option_level_id = "";

      this.isOpen = 0;
      this.status = 0;
      this.action = 0;
      this.activityTest = "";
      this.btnTest = "邀请好友";
      this.btnStatus = false;

      optionsId = 0;
      specsManage = [];
      optionsMaxCount = 1;
    },
    //获取数据列表
    getData() {
      let that = this;
      console.log("团队id", this.id);
      $http.get("plugin.fight-groups.frontend.controllers.team.index", { team_id: that.id }, "加载中").then(
        response => {
          if (response.result === 1) {
            that.info = response.data;
            that.goodsInfo = response.data.has_one_group.has_one_goods;
            that.level_id = response.data.has_one_level.id;
            that.goodsId = response.data.has_one_group.goods_id;
            that.isOpen = response.data.has_one_group.status;
            that.status = response.data.status;
            that.action = response.data.action;
            that.activityId = response.data.has_one_group.id;
            that.setStatusBtn();
            that.initPopView();
            // that.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: that.info.has_one_group.desc_title,
                imgUrl: that.info.has_one_group.has_one_goods.thumb,
                description: that.info.has_one_group.desc_content
              }
            );
            if (this.goodsInfo.has_option != 1) {
              this.selectGroup(); //无规格 直接根据level_id过滤数据
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },

    //初始化弹窗view
    initPopView() {
      if (this.goodsInfo.has_option == 1) {
        this.popPrice = this.info.has_one_group.min_price + "起"; //设置默认价格
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.goodsDescription = "选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
        }
      } else {
        this.popPrice = this.info.has_one_group.min_price + "起----"; //设置默认价格
        this.groupStock = this.info.has_one_group.has_one_goods.stock; //单规格取商品库存
        let _buy_limit = this.info.has_one_group.has_many_options[0].buy_limit;
        optionsMaxCount = _buy_limit == 0 ? this.groupStock : _buy_limit; //当前组合的购买限制数, 为0 时为无限制购买
        this.popStock = this.info.has_one_group.has_one_goods.stock; //当前库存
      }
    },
    //倒计时组件yd-countdown 已到达结束时间时的回调
    groupEnd() {
      console.log("已到达结束时间时触发回调");
      this.isOpen = 2;
      this.activityTest = "很抱歉，活动已结束！";
      this.btnTest = "已结束";
      this.btnStatus = true;
    },

    //处理不同拼团状态下，文字显示和按钮状态
    setStatusBtn() {
      let that = this;
      if (this.isOpen == 0) {
        //活动未开始
        that.activityTest = "当前活动未开始";
        that.btnTest = "更多拼团进行中";
        that.btnStatus = true;
      } else if (this.isOpen == 1) {
        //活动已开始
        if (that.status == 0) {
          //团长未支付
          if (that.action == 1) {
            that.activityTest = "支付成功后拼团活动开始！";
            that.btnTest = "去支付";
          } else if (that.action == 4) {
            //不是团长，按钮去开团跳转商品详情
            that.activityTest = "活动正在进行中";
            that.btnTest = "我要开团";
          } else if (that.action == 2) {
            //已参团（防止支付后跳转后后端还是返回status=0的情况）
            that.btnTest = "邀请好友";
          }
        } else if (that.status == 1) {
          //团长已支付
          if (that.action == 2) {
            //团长本人，显示邀请好友
            that.btnTest = "邀请好友";
          } else if (that.action == 1) {
            //不是团长，未参团 但是有等待支付记录，去支付
            that.btnTest = "去支付";
          } else if (that.action == 3) {
            //不是团长，未参团
            that.btnTest = "我要参团";
          }
        } else if (that.status == 2 && that.action == 4) {
          //已经成团了
          that.activityTest = "该团已拼团成功！";
          that.btnTest = "我要开团";
        } else if (that.status == 3 && that.action == 4) {
          //拼团失败
          that.activityTest = "未达到拼团人数，拼团失败!";
          that.btnTest = "我要开团";
        }
      } else if (this.isOpen == 2) {
        //活动已结束
        that.activityTest = "很抱歉，该活动已结束！";
        that.btnTest = "更多拼团进行中";
        that.btnStatus = true;
      } else {
        console.log("遇到未知的活动状态，response.data.has_one_group.status");
        return false;
      }
    },

    //点击中间按钮
    clickOpenGroup() {
      //@prames:action 支付1，邀请2，参团3，开团4
      let that = this;
      if (this.btnStatus) {
        //为true时，进去拼团列表
        if (that.$route.params.store_id) {
          that.$router.push(this.fun.getUrl("HomeSeller", { store_id: that.$route.params.store_id, fromHome: 1 }));
          return;
        }
        this.$router.push(this.fun.getUrl("group_list"));
      } else if (this.action == 4) {
        //去开团
        let json = {
          id: this.activityId
        };
        if (this.$route.params.store_id) {
          json.store_id = this.$route.params.store_id;
        }
        this.$router.push(this.fun.getUrl("GroupGoods", json));
      } else if (this.action == 3) {
        that.showOpenGroup = true;
      } else if (this.action == 2) {
        that.shareWeixin();
      } else if (this.action == 1) {
        //未支付 跳转到支付
        that.$router.push(
          that.fun.getUrl("orderpay", {
            status: "2",
            order_ids: that.info.order_id //-----------------等待后端接口弄好返回----------------------------
          })
        );
      }
    },

    //界面选择规格触发事件
    selectSpecs(data) {
      // console.log("selectSpecs");
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

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (optionsMaxCount == 0) {
          //库存不足
          console.log("88888888888888888");
          this.goodsCount = 0;
        }
        if (this.goodsCount > optionsMaxCount) {
          this.goodsCount = optionsMaxCount;
        }
      }
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
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.goodsCount = 1;
            }
            this.setGroupInfo(optionsId);
            break;
          }
        }
        console.log("options", optionsId);
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
          this.setGoodsSpecsStatus(this.goodsInfo.has_many_specs[i].has_many_specs_item, specs.id);
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
    //过滤出当前层级的数据
    setGroupInfo(_id) {
      let that = this;
      // console.log("组合规格id", _id);
      for (let i = 0; i < this.info.has_one_group.has_many_options.length; i++) {
        let _optionSpecs = this.info.has_one_group.has_many_options[i].option_id;
        //判断是否包含
        if (_optionSpecs == optionsId) {
          // options.push(this.goodsInfo.has_many_options[i]);

          that.selectGroupInfo = that.info.has_one_group.has_many_options[i].has_many_option_level;
          that.groupStock = that.info.has_one_group.has_many_options[i].stock; //当前组合的库存
          let _buy_limit = that.info.has_one_group.has_many_options[i].buy_limit;
          optionsMaxCount = _buy_limit == 0 ? that.groupStock : _buy_limit; //当前组合的购买限制数, 为0 时为无限制购买
          that.popStock = that.groupStock;
          this.selectGroup();

          return;
        }
      }
    },

    //选择规格后 过滤出当前层级的数据
    selectGroup(_level_id) {
      let that = this;
      var selectGroupLever;
      if (this.goodsInfo.has_option == 1) {
        //有规格
        selectGroupLever = that.selectGroupInfo.filter(function(v) {
          if (v.level_id == that.level_id) {
            return v;
          }
        });
        that.popPrice = selectGroupLever[0].group_price;
        that.option_level_id = selectGroupLever[0].id;
      } else {
        //无规格
        that.selectGroupInfo = that.info.has_one_group.has_many_options[0].has_many_option_level;
        selectGroupLever = that.selectGroupInfo.filter(function(v) {
          if (v.level_id == that.level_id) {
            return v.group_price;
          }
        });
        that.popPrice = selectGroupLever[0].group_price;
        that.option_level_id = selectGroupLever[0].id;
      }
    },
    //增加
    addGoods() {
      console.log("增加", this.groupStock, optionsMaxCount);

      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(optionsId)) {
        console.log("请选择商品规格！");
        Toast("请选择商品规格！");
        return;
      }
      if (this.groupStock == 0 || this.goodsCount > this.groupStock) {
        Toast("库存不足");
        this.goodsCount = this.groupStock;
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount >= optionsMaxCount) {
        Toast(`抱歉，该商品限购${optionsMaxCount}件`);
        this.goodsCount = optionsMaxCount;
        return;
      }
      this.goodsCount++;
    },

    //减少
    reduceGoods() {
      // Toast({
      //   message: "减少减少减少",
      //   duration: 100000
      // });
      if (this.goodsCount == 1 || this.goodsCount == 0) {
        return;
      }
      this.goodsCount--;
    },

    changeCount() {
      if (this.groupStock == 0 || this.goodsCount > this.groupStock) {
        Toast("库存不足");
        this.goodsCount = this.groupStock;
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount >= optionsMaxCount) {
        Toast("库存不足");
        this.goodsCount = optionsMaxCount;
        return;
      }
      if (this.goodsCount <= 0) {
        Toast("商品数量不能小于0");
        this.goodsCount = 1;
        return;
      }
    },

    joinTeam() {
      let that = this;
      if (this.groupStock == 0 || this.goodsCount > this.groupStock) {
        Toast("库存不足");
        this.goodsCount = this.groupStock;
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount > optionsMaxCount) {
        Toast("库存不足");
        this.goodsCount = optionsMaxCount;
        return;
      }
      if (this.goodsCount <= 0) {
        Toast("商品数量不能小于0");
        this.goodsCount = 1;
        return;
      }
      if (this.goodsInfo.has_option == 0) {
        optionsId = 0;
      }
      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(optionsId)) {
        Toast("请选择商品规格");
        return;
      }

      let goods = [];
      goods.push(that.goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "",
                      goodsId: that.goodsId,
                      optionsId: optionsId,
                      total: that.goodsCount
                    })
                  );
                })
                .catch(() => {});
            } else {
              let _json = {
                tag: "-2",
                goodsId: that.goodsId,
                optionsId: optionsId,
                total: that.goodsCount,
                team_id: that.$route.params.id,
                option_level_id: that.option_level_id
              };
              if (that.$route.params.store_id) {
                _json.groupStoreID = that.$route.params.store_id;
              }
              that.$router.push(that.fun.getUrl("goodsorder", {}, _json));
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
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config && response.data.config.appId) {
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _links = that.fun.isMid(document.location.href, data.info.uid);
        let _titles = that.fun.isTextEmpty(that.info.has_one_group.desc_title) ? data.shop.shop.name : that.info.has_one_group.desc_title;
        let _imgUrls = that.fun.isTextEmpty(that.info.has_one_group.has_one_goods.thumb) ? data.shop.icon : that.info.has_one_group.has_one_goods.thumb;
        let _descs = that.fun.isTextEmpty(that.info.has_one_group.desc_content) ? data.shop.shop.name : that.info.has_one_group.desc_content;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },

    goHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    gotoGoods() {
      let json = {
        id: this.activityId
      };
      if (this.$route.params.store_id) {
        json.store_id = this.$route.params.store_id;
      }
      this.$router.push(this.fun.getUrl("GroupGoods", json));
    },
    //分享
    shareWeixin() {
      if (this.fun.getTyep() == 7 || this.fun.isCPS()) {
        this.appShare();
        return;
      }else if (this.fun.getTyep() == 5) {
        //不是微信端 不访问
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享" });
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
    appShare() {
      let uid = window.localStorage.getItem("uid");
      var that = this;
      let _title = that.info.has_one_group.desc_title;
      let _imgUrl = that.info.has_one_group.has_one_goods.thumb;
      let _desc = that.info.has_one_group.desc_content;
      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/${window.location.href.match(/#\/(\S*)\?/)[1]}?i=${this.fun.getKeyByI()}&mid=${uid}`, // 分享链接
        imgUrl: _imgUrl // 分享图标
      };
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          shareByH5IOS({ body: "shareByH5IOS", json: JSON.stringify(json) });
        } else {
          console.log(JSON.stringify(json));
          shareByH5Android(JSON.stringify(json));
        }
      } else {
        YDB.Share(_title, _desc, _imgUrl, json.link, "Sharesback");
      }
    }
  },
  computed: {
    //处理不同拼团状态下文字的显示和按钮状态
  },
  components: { cTitle }
};
