// import { mapState } from "vuex";
import cGoods from "components/goods/goods";
import cNewGoods from "components/goods/goods_new";
import storeGoods from "components/goods/store_goods";
import courseGoods from "components/goods/course";
import hotelGoods from "components/goods/hotel";
import voiceGoods from "../goods/voice_good/good_detail";
import phoneBillProGoods from "components/goods/goods_telephone_charges_pro";
import Electricity from "components/goods/goods_Electricity";
import sweepBuyGoods from "components/goods/sweep_buy_goods";
import oilRechargeGoods from "components/goods/oil_recharge_goods";
import { Toast } from "vant";
let self = null;

//wx.config(response.data.js); 微信认证
export default {
  data() {
    return {
      is_toker: false,
      goods_info: {},
      is_room: 0, //是否开启直播间推荐
      goods_type: "",
      goods_id: "",
      cGoods: "cGoods",
      cNewGoods: "cNewGoods",
      storeGoods: "storeGoods",
      courseGoods: "courseGoods",
      voiceGoods: "voiceGoods",
      phoneBillProGoods:"phoneBillProGoods",
      Electricity:"Electricity",
      sweepBuyGoods:"sweepBuyGoods",
      oilRechargeGoods:"oilRechargeGoods",
      goodsInfo: {
        thumb_url: []
      },
      showBigImg: false, //子组件弹窗
      show8: false, //商家过期显示
      store_id: "", //门店id
      showDis: true, //控制加购的显示
      //isComment: false, //控制详情页评论组件弹窗显示时，点击or操作物理返回键关闭弹窗（避免直接关闭详情页跳转,因为子组件无法进行路由导航相关操作。。。）
      wx_video_link: 0, //是否开启视频号扩展插件
      category_option_id:"",
      fatherTitle:"商品详情"
    };
  },
  created() {
    this.goods_id = this.$route.params.id;
    // 分类页点击商品进去关联规格id
    this.category_option_id = this.$route.params.coid;
    self = this;
    // this.isComment = false;
    this.$store.commit("setShowComment", false);
  },
  activated() {
    if (this.fun.isCPS()) {
      if (this.fun.isIosOrAndroid() === "ios") {
        toGoodDetailIOS({ body: "toGoodDetailIOS" });
      }
    }
    this.showBigImg = false;
    let noRequestName = ["GroupGoods", "grab_group", "managementGoods", "newRetailSalesGood", "zhpGroup", "groupWorkGood"];
    if (noRequestName.indexOf(this.$route.name) == -1) {
      //在组件内独立请求详情页数据，后面接口优化整合
      this.getData(); //获取数据
    } else {
      this.goods_type = this.$route.name;
    }

    //区分是否首页跳转进来 
    this.isset = localStorage.getItem("isset");
    localStorage.removeItem("isset");
    // this.getCatchHome();
    self = this;
    // this.isComment = false;
    this.$store.commit("setShowComment", false);
    if (this.$route.query.liveRoomId) {
      //直播间进入
      this.FormLiveRoom(this.$route.query.liveRoomId);
      this.$store.commit("setLiveRoomID", this.$route.query.liveRoomId);
    }
    $http.get("goods.goods.getGoodsName", {goods_id:this.$route.params.id}, " ").then(
       res => {

             //诸葛统计
            zhuge.track('通用-点击商品',{
              '商品id' : ''+this.$route.params.id,
              '商品名称':res.data.title,
              '商品价格':res.data.price
            });
           
            zhuge.startTrack('商品详情页页面停留时长',{
              '商品id' : ''+this.$route.params.id,
              '商品名称':res.data.title,
              '商品价格':res.data.price
            });
            
            zhuge.track('进入商品详情页',{
              '商品id' : ''+this.$route.params.id,
              '商品名称':res.data.title,
              '商品价格':res.data.price
            });
    });
    //this.fatherTitle = document.title;
  },
  mounted() {
    this.showBigImg = false;
    //this.getData();//获取数据
    this.store_id = this.$route.params.store_id;
    self = this;
    // this.isComment = false;
    this.$store.commit("setShowComment", false);
    
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    let  thatID =this.$route.params.id; 
    let num = ''+thatID;
    $http.get("goods.goods.getGoodsName", {goods_id:this.$route.params.id}, " ").then(
        res => {
         
          zhuge.endTrack('商品详情页页面停留时长',{
          '商品id' : num,
          '商品名称':res.data.title,
          '商品价格':res.data.price
         });
         
    });
    // 注意：从商品详情页跳转到商品详情页不触发，to、from不变
    if (self.showBigImg) {
      self.showBigImg = false;
      next(false);
    } else if (self.isComment) {
      if (to.name == "CommentDetails") {
        next();
      } else {
        // self.isComment = false;
        self.$store.commit("setShowComment", false);
        next(false);
      }
    } else {
      next();
    }
    
  },
  methods: {
    setShowBigImg(data) {
      this.showBigImg = data;
    },
    //获取数据
    getData() {
      let that = this;
      //console.log("goods_id:::", this.$route.params.id);
      let json = {
        id: Number(this.$route.params.id),
        mid: this.fun.getKeyByMid(),
        mark: this.fun.getKey("mark"),
        mark_id: this.fun.getKey("mark_id"),
        enter_at: this.$route.query.start || "",
        leave_at: this.$route.query.end || ""
      };
      if(this.$route.params.coid){
        json.category_option_id = this.category_option_id;
      }
      $http.post("plugin.overseas.frontend.goods.get-goods-page", json, " ").then(
        res => {
          if (res.result === 1) {
            this.fun.setWXTitle("商品详情");
            if (res.data.get_goods.plugin_id == 44) {
              const jd_iframe = document.createElement("script");
              jd_iframe.type = "text/javascript";
              jd_iframe.src = "https://open.jxhh.com/iframechild.js";
              document.body.appendChild(jd_iframe);
            }
            that.goods_type = res.data.goods_type;
            if (res.data.plugin.customer_development) {
              // 门店拓客卡商品
              that.is_toker = true;
            }
            if (that.goods_type == "hotelGoods") {
              if (!that.$route.query.start) {
                that.$dialog
                  .confirm({ message: "选择入住酒店的时间?" })
                  .then(() => {
                    if (res.data.get_hotel_info.goods.hotel_id) {
                      that.$router.push(that.fun.getUrl("HotelHome", { id: res.data.get_hotel_info.goods.hotel_id, fromHome: 1 }));
                    }
                  })
                  .catch(() => {});
              }
            }
            if (res.data.get_store_info) {
              // 门店
              that.store_id = res.data.get_store_info.store_id;
            }
            that.goods_info = res.data;
            that.is_room = res.data.plugin.is_room ? res.data.plugin.is_room : 0; // 直播
            that.wx_video_link = res.data.plugin && res.data.plugin.wx_video_link ? res.data.plugin.wx_video_link : 0;
            console.log("goods_type", that.goods_type);
          } else {
            if (res.msg == "该商家已过期,去看看其他的吧") {
              that.showDis = false;
              that.show8 = true;
            }
            that.$dialog.alert({ message: res.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        function(res) {
          console.log(res);
        }
      );
    },
    FormLiveRoom(_id) {
      $http
        .post("plugin.room.frontend.live.check-goods", { goods_id: Number(this.$route.params.id), room_id: _id }, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  watch: {},

  components: {
    cGoods,
    cNewGoods,
    storeGoods,
    courseGoods,
    hotelGoods,
    voiceGoods,
    phoneBillProGoods,
    Electricity,
    sweepBuyGoods,
    oilRechargeGoods
  },

  computed: {
    isComment() {
      return this.$store.state.isShomegGoodComment;
    }
  }
};
