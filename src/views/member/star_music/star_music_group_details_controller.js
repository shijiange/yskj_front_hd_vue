import { Swipe, SwipeItem } from "components/meswipe";
import cMyswipe from "components/myswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Dialog, Toast } from "vant";

var specsManage = []; //选择池 用于排序
var optionsId = 0; //选择后的 规格ID
var optionsMaxCount = 1;

var level_id = ""; //拼团层级id
// var team_id = ""; //团队id

// var share_tag = "-1"; //顶部导航返回上一级按钮 标志

//商品详情
// var currentTabIndex = "0";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
var is_third_content = false;

var self = null;
var start = 0;
var last_distance = 0;
export default {
  props: ["goods_id"],
  data() {
    return {
      showBigImg: false,
      bigImages: [],//商品详情富文本图片预览
      showOpenGroup: false,
      //   show2: false,
      // 是否有更多评论
      //  noMoreComment: false,
      // 初始评论页数
      // commentPage: 1,
      // posterShow: false, //商品分享二维码显示
      hoet: false,
      showGood: false,

      popStock: 0, //库存
      popPrice: 0,

      posterImg: {},
      gooddatas: {}, //总商品数据
      goodsInfo: {}, //商品详情信息
      activity: "", //活动id 通过props传递??
      goodsId: "",
      group_price: "", //拼团价
      goodsDescription: "",
      goodsCount: 1, //购买数量
      isFromOrderdetail: false, //是否从订单详情进入
      option_level_id: "", //规格层级id

      //商品详情
      first_content: "",
      second_content: "",
      //  third_content: [],
      activeName: "first",

      groupModel: "", //选择的拼团层级
      selectGroupInfo: {}, //拼团层级列表
      groupStock: 1, //当前拼团商品的库存

      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      //  currentClass: 0,
      commentLimit: [], //评论组件，设置最新5条评论
      goodDetail: {},

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,

      showImgPreview: false,
      images: [],

      favorable_rate: null, //拼团暂无
      //  showComment: false,
      explainFlag: false, //商品参数弹窗

      currentTime: parseInt(new Date().getTime() / 1000),

      explainText: "",
      joinListShow: false,
      joinListData: [],
      is_join: 0,
      team_state: 0,//团状态
      activity_state: 0,

      showWechatshar: false,
      kfServerFlag: false,
      cservice: {},
      win_data: {},

      is_dividend: 0,  //是否经销商

      joinModeFlag:false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (self.showComment) {
      console.log("当前页面评论打开");
      self.showComment = false;
      next(false);
    } else {
      console.log("当前页面评论关闭，可以跳转");
      next();
    }
  },
  activated() {
    this.init();
    this.slider();
    // if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //   share_tag = this.fun.getKey("share_tag");
    // }
    this.activity = this.$route.params.id; //
    this.fight_groups =
      this.$route.query.fight_groups !== undefined
        ? this.$route.query.fight_groups
        : "";
    this.getData();
    self = this;
    this.$nextTick(() => {
      // window.addEventListener("scroll", this.dataScroll);
      window.addEventListener("scroll", this.throttleFn);
    });
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },
  // beforeUpdate() {
  //   console.log("beforeUpdate-----------------------");
  //   // console.log(this.fun.isTextEmpty(this.gooddatas.wx_js_sdk_config))
  //   if(!this.fun.isTextEmpty(this.gooddatas.wx_js_sdk_config)){
  //     this.share();
  //   }
  // },
  // updated(){
  //   console.log("updated------------------");
  // },
  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);
    window.removeEventListener("scroll", this.throttleFn);
  },
  methods: {
    //初始化数据
    init() {
      this.showBigImg = false;
      this.gooddatas = {};
      this.goodsInfo = {};
      this.activity = "";
      this.group_price = "";
      this.goodsId = "";
      //  this.show2 = false;
      this.showGood = false;
      this.fight_groups = "";
      this.commentPage = 1;
      // currentTabIndex = "0";
      // is_first_content = false;
      // is_second_content = false;
      is_third_content = false;
      this.firstActivityCon = "";
      this.first_content = "";
      this.second_content = "";
      //  this.third_content = [];
      this.activeName = "first";
      this.showOpenGroup = false;
      //   this.posterShow = false;
      this.goodsCount = 1;
      this.groupStock = 1;
      this.option_level_id = "";

      this.selectGroupInfo = {};
      this.groupModel = "";

      optionsId = "";
      specsManage = [];
      optionsMaxCount = 1;
      level_id = "";
      // team_id = "";

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      //  this.showComment = false;
      this.showPageB = false;
      this.explainFlag = false;
      this.explainText = "";
      this.joinListShow = false;
      this.joinListData = [];
      this.is_join = 0;
      this.showWechatshar = false;
      this.team_state = 0;
      this.activity_state = 0;
      this.win_data = {};
      this.is_dividend = 0;
    },
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName == "IMG") {
          this.bigImages = [];
          this.bigImages.push($event.target.currentSrc);
          this.showBigImg = true;
        }
      }
    },
    teamEnd() {
      this.team_state = 0;
    },
    //初始化弹窗view
    initPopView() {
      this.popPrice = this.gooddatas.price + "起"; //设置默认价格
      if (this.goodsInfo.has_option == 1) {
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.groupStock = this.gooddatas.stock; //当前库存
        this.goodsDescription = "选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
        }
      } else {
        this.popStock = this.gooddatas.stock; //当前库存
        this.groupStock = this.gooddatas.stock; //当前库存

        // let _buy_limit = this.gooddatas.has_many_options[0].buy_limit
        optionsMaxCount = 1; //当前组合的购买限制数, 为0 时为无限制购买
      }
    },
    // 获取拼团商品详情
    getData() {
      let that = this;
      let json = {};
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.leader_id = that.activity;
        json.fight_groups_goods_id = that.fight_groups;
      } else {
        json.leader_id = that.activity;
      }
      $http
        .get(
          "plugin.star-spell.frontend.index.teamDetail",
          json,
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {

              this.gooddatas = response.data.goods;

              this.goodsInfo = response.data.goods;

              this.group_price = response.data.min_price;
              this.joinListData = response.data.team;
              console.log(this.joinListData);
              this.team_state = response.data.team_state;
              this.activity_state = response.data.activity_state;
              this.explainText = response.data.explain;
              this.popStock = this.goodsInfo.stock; //设置默认库存
              this.goodsId = response.data.goods.goods_id;
              this.is_join = response.data.is_join;
              this.cservice = response.data.cservice;
              this.win_data = response.data.win_data;
              this.is_dividend = response.data.is_dividend;
              //   that.activity = response.data.id; //活动id
              //   this.favorable_rate = response.data.goods_info.favorable_rate
              //     ? response.data.goods_info.favorable_rate
              //     : null;
              //   this.commentLimit = response.data.goods_info.favorable_rate
              //     ? response.data.goods_info.get_comment.data
              //     : [];
              this.initPopView();
              this.setDataByTabIndex(); //设置商品详情
              // this.initShare();
              this.fun.wxShare(
                "",
                { mid: this.fun.getKeyByMid() },
                {
                  title: that.fun.isTextEmpty(that.gooddatas.share_title) ? that.gooddatas.activity_name : that.gooddatas.share_title,
                  imgUrl: that.goodsInfo.thumb,
                  description: that.gooddatas.share_content
                }
              );
              this.showPageB = true;
              this.showGood = true;
              if (that.gooddatas.is_lottery && that.gooddatas.lottery_desc) {
                that.gooddatas.lottery_desc = that.gooddatas.lottery_desc.replace(/\n/g, "<br>");
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
      // .then(v => {
      //   setTimeout(() => {
      //     this.share();
      //   }, 1000);
      // });
    },
    gotoStarMusicOpenGroup() {
      this.$router.push(this.fun.getUrl("starMusicOpenGroup", {}));
    },
    gotoStarMusicIndex() {
      this.$router.push(this.fun.getUrl("starMusicIndex", {}));
    },
    //加入该团按钮
    // clickAdd(status, _team_id) {
    //   //价格权限
    //   if (
    //     this.goodsInfo.vip_level_status &&
    //     this.goodsInfo.vip_level_status.status == 1
    //   ) {
    //     Toast(this.goodsInfo.vip_level_status.tips);
    //     return false;
    //   }

    //   if (status == "1") {
    //     this.shareWeixin();
    //     return;
    //   } else {
    //     let that = this;
    //     let goods = []
    //     goods.push(that.goodsId)
    //     let jsons = {
    //       goods_ids: JSON.stringify(goods),
    //       i: this.fun.getKeyByI(),
    //       type: this.fun.getTyep(),
    //       mid: this.fun.getKeyByMid()
    //     }
    //     $http.get('from.div-from.isDisplay', jsons, '加载中').then(
    //       function (response) {
    //         if (response.result === 1) {
    //           if (response.data.status && !response.data.member_status) {
    //             MessageBox({
    //               title: '提示',
    //               message: '购买跨境商品,请补充您的个人信息',
    //               showCancelButton: true
    //             }).then(action => {
    //               if (action == 'confirm') {
    //                 that.$router.push(
    //                   that.fun.getUrl('myinfo', {
    //                     tag: '',
    //                     goodsId: that.goodsId,
    //                     optionsId: optionsId,
    //                     total: that.goodsCount
    //                   })
    //                 )
    //               }
    //             })
    //           } else {
    //             that.$router.push(
    //               that.fun.getUrl("GroupDetail", {
    //                 id: _team_id
    //               })
    //             );
    //           }
    //         } else {
    //           console.log(response.msg)
    //         }
    //       },
    //       function (response) {
    //         console.log(response)
    //       }
    //     )

    //   }
    // },

    //设置选择后的数据
    setDataByTabIndex() {
      if (this.goodsInfo.content) {
        let str = this.goodsInfo.content.replace(/src=\"http:/gi, "src=\"https:");
        this.goodsInfo.content = str;
      }
      this.first_content = this.goodsInfo.content;
      // this.getCommentData();
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
      // this.getMaxCount();
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      console.log("specsManage", specsManage);
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
            // this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(
              this.goodsInfo.has_many_options[i].thumb
            )
              ? this.goodsInfo.thumb
              : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单

            console.log("设置规格ID，用于生成订单", optionsId);
            //this.setGroupInfo(optionsId); //设置选择后规格对应的层级 过滤数据

            // optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            // if (optionsMaxCount > 0) {
            //   this.goodsCount = 1;
            // }

            break;
          }
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
        console.log("已选择");
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        console.log("请选择");
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

      console.log("options", options);
    },
    //设置拼团层级的选择状态 过滤数据
    setGroupInfo(_id) {
      let that = this;
      console.log("组合规格id", _id);
      for (let i = 0; i < this.gooddatas.has_many_options.length; i++) {
        let _optionSpecs = this.gooddatas.has_many_options[i].option_id;
        //判断是否包含
        // for (let j = 0; j < _specs.length; j++) {
        if (_optionSpecs == optionsId) {
          // options.push(this.goodsInfo.has_many_options[i]);
          that.selectGroupInfo = this.gooddatas.has_many_options[
            i
          ].has_many_option_level;

          that.groupStock = this.gooddatas.has_many_options[i].stock; //当前组合的库存
          let _buy_limit = this.gooddatas.has_many_options[0].buy_limit;
          optionsMaxCount = _buy_limit == 0 ? this.groupStock : _buy_limit; //当前组合的购买限制数, 为0 时为无限制购买
          this.selectGroup(level_id);
          // console.log("选择规格", this.gooddatas.has_many_options[i]);
          return;
        }
        // }
      }
    },

    //选择拼团层级
    selectGroup(_level_id) {
      level_id = _level_id;
      var selectGroupLever;
      if (!this.fun.isTextEmpty(level_id)) {
        if (this.goodsInfo.has_option == 1) {
          //有规格
          if (this.fun.isTextEmpty(optionsId)) {
            Toast("请选择商品规格！");
            this.groupModel = "";
            return;
          } else {
            selectGroupLever = this.selectGroupInfo.filter(function(v) {
              if (v.level_id == _level_id) {
                return v.group_price;
              }
            });
            this.popPrice = selectGroupLever[0].group_price;
            this.option_level_id = selectGroupLever[0].id;
          }
        } else {
          //无规格
          this.selectGroupInfo = this.gooddatas.has_many_options[0].has_many_option_level;
          selectGroupLever = this.selectGroupInfo.filter(function(v) {
            if (v.level_id == _level_id) {
              return v.group_price;
            }
          });
          this.popPrice = selectGroupLever[0].group_price;
          this.option_level_id = selectGroupLever[0].id;
        }
      }
    },

    //增加
    addGoods() {
      console.log("增加", this.goodsCount, this.groupStock, optionsMaxCount);

      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(optionsId)) {
        Toast("请选择商品规格！");
        return;
      }
      if (this.goodsCount >= this.groupStock) {
        Toast("库存不足");
        console.log("库存不足max=" + this.goodsCount);
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount >= optionsMaxCount) {
        Toast(`抱歉，该商品限购${optionsMaxCount}件`);
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

    changeCount() {
      if (this.goodsCount > this.groupStock) {
        Toast("库存不足");
        this.goodsCount = this.groupStock;
        return;
      }
      if (optionsMaxCount != 0 && this.goodsCount > optionsMaxCount) {
        Toast("库存不足");
        this.goodsCount = optionsMaxCount;
        return;
      }
      if (this.goodsCount < 0) {
        Toast("商品数量不能小于0");
        this.goodsCount = 1;
        return;
      }
    },
    sendJoinGroup() {
      if (this.goodsCount > this.groupStock) {
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
      if (this.gooddatas.has_option == 1 && !optionsId) {
        Toast("请选择商品规格");
        return;
      }

      if(this.gooddatas.qualified_vip==true){
        this.joinModeFlag = true;
        //this.winJoinGroup();
      } else {
        this.nowinJoinGroup();
      }
    },
    bindJoinMode(evt){
      console.log(evt);
      if(evt.index==0){
        this.winJoinGroup();
      }else if(evt.index==1){
        this.nowinJoinGroup();
      }
    },
    //会员参团
    async winJoinGroup() {
      let res = await $http.post("plugin.star-spell.frontend.team.vipJoinTeam", {
        goods_data: {
          goods_id: this.goodsId,
          option_id: optionsId,
          total: this.goodsCount
        },
        at_id: this.goodsInfo.activity_id,
        leader_id: this.activity
      });
      Toast(res.msg);
      if (res.result != 1) return;
      this.showOpenGroup = false;
      this.getData();

      console.log(res);
    },
    //非会员参团
    nowinJoinGroup() {
      let goods = [];
      goods.push(this.goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        (response) => {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              Dialog.confirm({
                title: "标题",
                message: "购买跨境商品,请补充您的个人信息"
              }).then(() => {
                this.$router.push(
                  this.fun.getUrl("myinfo", {
                    tag: "",
                    goodsId: this.goodsId,
                    optionsId: optionsId,
                    total: this.goodsCount
                  })
                );
              });
            } else {
              this.$router.push(
                this.fun.getUrl("goodsorder", {}, {
                  tag: "starGroup",
                  goodsId: this.goodsId,
                  optionsId: optionsId,
                  total: this.goodsCount,
                  at_id: this.goodsInfo.activity_id,
                  leader_id: this.activity
                })
              );
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
    // openTeam() {
    //   let that = this;
    //   if (this.goodsCount > this.groupStock) {
    //     Toast("库存不足");
    //     this.goodsCount = this.groupStock;
    //     return;
    //   }
    //   if (optionsMaxCount != 0 && this.goodsCount > optionsMaxCount) {
    //     Toast("库存不足");
    //     this.goodsCount = optionsMaxCount;
    //     return;
    //   }
    //   if (this.goodsCount <= 0) {
    //     Toast("商品数量不能小于0");
    //     this.goodsCount = 1;
    //     return;
    //   }
    //   console.log(this.goodsId,optionsId);
    //   if (this.fun.isTextEmpty(level_id)) {
    //     Toast("请选择商品");
    //     console.log("请选择商品");
    //     return;
    //   }

    //   let goods = []
    //   goods.push(that.goodsId)
    //   let jsons = {
    //     goods_ids: JSON.stringify(goods),
    //     i: this.fun.getKeyByI(),
    //     type: this.fun.getTyep(),
    //     mid: this.fun.getKeyByMid()
    //   }
    //   $http.get('from.div-from.isDisplay', jsons, '加载中').then(
    //     function (response) {
    //       if (response.result === 1) {
    //         if (response.data.status && !response.data.member_status) {
    //           MessageBox({
    //             title: '提示',
    //             message: '购买跨境商品,请补充您的个人信息',
    //             showCancelButton: true
    //           }).then(action => {
    //             if (action == 'confirm') {
    //               that.$router.push(
    //                 that.fun.getUrl('myinfo', {
    //                   tag: '',
    //                   goodsId: that.goodsId,
    //                   optionsId: optionsId,
    //                   total: that.goodsCount
    //                 })
    //               )
    //             }
    //           })
    //         } else {
    //           that.$router.push(
    //             that.fun.getUrl("goodsorder", {}, {
    //               tag: "-2",
    //               goodsId: that.goodsId,
    //               optionsId: optionsId,
    //               total: that.goodsCount,
    //               level_id: level_id,
    //               option_level_id: that.option_level_id
    //             })
    //           );
    //         }
    //       } else {
    //         console.log(response.msg)
    //       }
    //     },
    //     function (response) {
    //       console.log(response)
    //     }
    //   )
    // },
    imgPreview() {
      this.images = [];
      let _img = this.popThumb == null || this.popThumb == "" || this.popThumb == undefined ? this.goodsInfo.thumb : this.popThumb;
      this.images.push(_img);
      this.showImgPreview = true;
    },
    //获取评论数据
    // getCommentData() {
    //   let that = this;
    //   let json = {
    //     goods_id: that.goodsId,
    //     page: this.commentPage,
    //     i: this.fun.getKeyByI(),
    //     type: this.fun.getTyep(),
    //     mid: this.fun.getKeyByMid()
    //   };
    //   // console.log(json);
    //   $http.get("goods.comment.get-comment", json, "获取中").then(
    //     function (response) {
    //       // console.log(response.data);
    //       if (response.result === 1) {
    //         if (response.data.data.length < 20) {
    //           that.noMoreComment = true;
    //         }
    //         that.commentPage += 1;
    //         if (!that.third_content) {
    //           that.third_content = [];
    //         }
    //         that.third_content = [...that.third_content, ...response.data.data];
    //         that.showComment = true;
    //         is_third_content = true;
    //         that.$emit("showComment", true);
    //       } else {
    //         is_third_content = false; //复位
    //       }
    //     },
    //     function (response) {
    //       is_third_content = false; //复位
    //       console.log(response);
    //     }
    //   );
    // },
    //显示去参团列表弹层
    // showGroupMore() {
    //   //价格权限
    // //   if (
    // //     this.goodsInfo.vip_level_status &&
    // //     this.goodsInfo.vip_level_status.status == 1
    // //   ) {
    // //     Toast(this.goodsInfo.vip_level_status.tips);
    // //     return false;
    // //   }
    // console.log(this.gooddatas,this.gooddatas.has_many_team);
    //   if (this.gooddatas.status == "1") {
    // 	this.show2 = true;
    // 	return;
    //     //活动已开启
    //     if (this.gooddatas.has_many_team.length == 0) {
    //       this.show2 = false;
    //       Toast({
    //         message: "暂无更多可参与的团",
    //         duration: 1000
    //       });
    //       return;
    //     } else {
    //       this.show2 = true;
    //     }
    //   } else if (this.gooddatas.status == "0") {
    //     Toast({
    //       message: "活动未开始",
    //       duration: 1000
    //     });
    //     return;
    //   } else if (this.gooddatas.status == "2") {
    //     Toast({
    //       message: "活动已结束",
    //       duration: 1000
    //     });
    //     return;
    //   }
    // },
    // 去开团
    openGroup() {
      //价格权限
      //   if (
      //     this.goodsInfo.vip_level_status &&
      //     this.goodsInfo.vip_level_status.status == 1
      //   ) {
      //     Toast(this.goodsInfo.vip_level_status.tips);
      //     return false;
      //   }
      this.showOpenGroup = true;
    },

    timeEnd() {
      //倒计时结束时触发的回调方法
      // console.log("倒计时结束时触发的回调方法，timeEnd()");
      this.gooddatas.status = "2";
    },

    // //跳转评论详情
    // toContentInfo(data) {
    //   this.$router.push(
    //     this.fun.getUrl("CommentDetails", {
    //       order_id: data.order_id,
    //       goods_id: data.goods_id,
    //       comment_id: data.id,
    //       uid: data.uid
    //     })
    //   );
    // },
    //顶部返回按钮
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    //跳转主页
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    //海报生成
    // postShow() {
    //   let toastPoster = Toast({
    //     duration: -1, // 持续展示 toast
    //     message: '正在为您生成海报中'
    //   });
    //   $http
    //     .get(
    //       "plugin.fight-groups.frontend.controllers.group-poster.generate-goods-poster",
    //       { id: this.activity },
    //       "加载中"
    //     )
    //     .then(response => {
    //       toastPoster.close();
    //       if (response.result == 1) {
    //         this.posterImg = response.data;
    //         this.posterShow = true;
    //       } else {
    //         this.posterShow = false;
    //         MessageBox("提示", response.msg);
    //       }
    //     })
    //     .catch(error => {
    //       toastPoster.close();
    //       console.log(error);
    //     });

    // },
    slider() {
      let that = this;
      // let goodinfo = this.$refs.goodinfo.offsetTop;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        // if (top < that.$refs.goodinfo.offsetTop) {
        //   that.goodTop = false;
        // } else {
        //   that.goodTop = true;
        // }

        if (top <= 40) {
          that.hoet = false;
        } else {
          that.hoet = true;
        }
        //滑动到底部禁止反弹
        if (
          document.documentElement.scrollHeight ==
          document.documentElement.clientHeight + top
        ) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);

          document.addEventListener("touchmove", this.move, false);
        }
      };
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appShare();
        return;
      }
      this.showWechatshar = true;
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
      let _title = that.fun.isTextEmpty(that.gooddatas.share_title)
        ? that.gooddatas.activity_name
        : that.gooddatas.share_title;

      let _link = document.location.href;

      let _imgUrl = that.goodsInfo.thumb;
      let _desc = "";
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
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
      console.log("调用分享");
      wx.config(data.config);
      console.log(that.goodsInfo.thumb);
      wx.ready(function() {
        let _titles = "";
        let _imgUrls = "";
        let _descs = "";
        let _links = "";

        _titles = that.fun.isTextEmpty(that.gooddatas.share_title)
          ? that.gooddatas.activity_name
          : that.gooddatas.share_title;

        _links = document.location.href;
        _links = that.fun.isMid(_links, data.info.uid);
        _imgUrls = that.goodsInfo.thumb;
        _descs = that.gooddatas.share_content;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            that.showWechatshar = false;
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
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            that.showWechatshar = false;
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    //隐藏拼团单条列表 非弹窗
    hideIdexaa() {
      this.gooddatas.display_team = null;
      return;
    },
    hideIdexbb() {
      let nowTimes = Math.round(new Date() / 1000); //获取当前时间戳
      for (let i = 0; i < this.gooddatas.has_many_team.length; i++) {
        if (this.gooddatas.has_many_team[i].end_time <= nowTimes) {
          if (i == 0) {
            this.gooddatas.has_many_team.shift(); //删除并返回数组的第一个元素
            return this.gooddatas.has_many_team;
          } else if (i == length - 1) {
            this.gooddatas.has_many_team.pop(); //删除并返回数组的最后一个元素
            return this.gooddatas.has_many_team;
          } else {
            this.gooddatas.has_many_team.splice(i, 1); //删除下标为i的元素
            return this.gooddatas.has_many_team;
          }
        }
      }
    },
    //==========================================================================================================
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop + 55;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    },
    throttleFn() {
      // 节流
      let that = this;
      let interval = 100;
      that.now = +new Date();
      if (that.last && that.now - that.last < interval) {
        clearTimeout(that.timer);
        that.timer = setTimeout(() => {
          that.last = that.now;
          that.dataScroll();
        }, interval);
      } else {
        that.last = that.now;
        that.dataScroll();
      }
    },
    handleTouchstart(e) {
      start = e.changedTouches[0].pageY;
    },
    handleTouchmove(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      const move_distance = last_distance + cur_move;
      if (last_distance > 0) {
        this.isPullUp = false;
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:400ms;transform:translateY(0);`;
        last_distance = 0;
      } else if (move_distance < 0 && move_distance > -(0 + 65)) {
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = false;
      } else if (move_distance <= -(0 + 65)) {
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = true;
      }
    },
    handleTouchend(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      last_distance += cur_move;
      document.getElementById(
        "main"
      ).style.cssText = `transition-duration:400ms;transform:translateY(0);`;
      if (last_distance > 0) {
        this.isPullUp = false;

        last_distance = 0;
      } else if (last_distance < 0 && last_distance > -(0 + 65)) {
        this.isPullUp = false;
        last_distance = 0;
      } else if (last_distance <= -(0 + 65)) {
        //切换到下一个页面
        console.log("切换到下一个页面");
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
        last_distance = 0;
        if (!this.showPageB) {
          this.showPageB = true;
        }
      }
    },
    dataScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      //滚动事件触发
      if (
        this.getScrollTop() + this.getClientHeight() + 105 >
        this.getScrollHeight()
      ) {
        //此处发起请求
        if (!this.showPageB) {
          console.log("触底了");
          document
            .getElementById("main")
            .addEventListener("touchstart", this.handleTouchstart);
          document
            .getElementById("main")
            .addEventListener("touchmove", this.handleTouchmove);
          document
            .getElementById("main")
            .addEventListener("touchend", this.handleTouchend);
        }
      } else {
        document
          .getElementById("main")
          .removeEventListener("touchstart", this.handleTouchstart);
        document
          .getElementById("main")
          .removeEventListener("touchmove", this.handleTouchmove);
        document
          .getElementById("main")
          .removeEventListener("touchend", this.handleTouchend);
      }
    },
    // jump(index) {
    //   if (index == 2 && !this.showPageB) {
    //     this.showPageB = true;
    //   }
    //   setTimeout(() => {
    //     this.$nextTick(() => {
    //       let jump = document.getElementsByClassName("section");
    //       // 获取需要滚动的距离
    //       let total = jump[index].offsetTop - 50;
    //       // Chrome
    //       document.body.scrollTop = total;
    //       // Firefox
    //       document.documentElement.scrollTop = total;
    //       // Safari
    //       window.pageYOffset = total;
    //     });
    //   }, 20);
    // },
    loadSroll() {
      let that = this;
      var sections = document.getElementsByClassName("section");
      for (let i = sections.length - 1; i >= 0; i--) {
        if (that.scroll >= sections[i].offsetTop - 100) {
          that.currentClass = i;
          return;
        }
      }
    },
    FromTo(data) {
      // this.$router.push(this.fun.getUrl("GoodsComment", { id: goods_id }));
      if (!is_third_content) {
        //   this.getCommentData();
      } else {
        this.showComment = true;
        this.$emit("showComment", true);
      }
    }
  },
  computed: {
    //底部一键开团是否隐藏
    showOpeonBtn() {
      let that = this;
      if (that.gooddatas.menu_show == 0) {
        return true;
      } else if (
        that.gooddatas.menu_show == 1 &&
        that.gooddatas.has_many_team_count < that.gooddatas.hide_num
      ) {
        return true;
      } else {
        return false;
      }
    },
    //底部去参团按钮文字
    showStatusText() {
      if (this.gooddatas.status == "0") {
        return "活动未开始";
      } else if (this.gooddatas.status == "2") {
        return "活动已结束";
      }
    }
  },
  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, yzWechatShareImg },
  watch: {
    scroll() {
      this.loadSroll();
    }
  }
};
