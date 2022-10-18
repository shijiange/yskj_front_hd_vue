// import { mapState } from "vuex";
import cGoods from "./goods/goods";
import { Toast } from 'vant';
let self = null;

//wx.config(response.data.js); 微信认证
export default {
  data() {
    return {
      goods_info: {},
      is_room: 0,//是否开启直播间推荐
      goods_type: "",
      goods_id: "",
      cGoods: "cGoods",
      goodsInfo: {
        thumb_url: []
      },
      show8: false, //商家过期显示
      store_id: "", //门店id
      showDis: true, //控制加购的显示
      isComment: false, //控制详情页评论组件弹窗显示时，点击or操作物理返回键关闭弹窗（避免直接关闭详情页跳转,因为子组件无法进行路由导航相关操作。。。）
      producer_info:[]
    };
  },
  created() {
    console.log("goods_id:::", this.$route.params.id);
    this.toi = this.fun.getKeyByI();
    this.goods_id = this.$route.params.id;
    self = this;
    this.isComment = false;
  },
  activated() {
    console.log(this.$route.params.kid);
    this.getmanage();//获取详情和厂家数据
    //区分是否首页跳转进来
    this.isset = localStorage.getItem("isset");
    localStorage.removeItem("isset");
    // this.getCatchHome();
    self = this;
    this.isComment = false;
    if(this.$route.query.liveRoomId){
      //直播间进入
      this.FormLiveRoom(this.$route.query.liveRoomId);
      this.$store.commit("setLiveRoomID", this.$route.query.liveRoomId);
    }
  },
  mounted() {
    console.log("g_mounted_goods_id:::", this.$route.params.id);
    this.store_id = this.$route.params.store_id;
    self = this;
    this.isComment = false;
  },
  beforeRouteLeave(to, from, next) {
    // 注意：从商品详情页跳转到商品详情页不触发，to、from不变
    if (self.isComment) {
      if(to.name=='CommentDetails'){
        next();
      }else{
        self.isComment = false;
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    getmanage(){
      let that = this;
      let json ={
        id:this.$route.params.id,
        producer_id:this.$route.params.kid
      };
      $http.post("plugin.producer.frontend.goods.getGoodsPage", json, " ").then(
        function(res) {
          if (res.result === 1) {
            if(res.data.get_goods.plugin_id == 44) {
              const jd_iframe = document.createElement('script');
              jd_iframe.type = 'text/javascript';
              jd_iframe.src = 'https://open.jxhh.com/iframechild.js';
              document.body.appendChild(jd_iframe);
            }
            that.producer_info = res.data.producer_info;
            that.goods_type = res.data.goods_type.goods_type;
            that.goods_info = res.data;
            that.is_room = res.data.is_room?res.data.is_room:0;
            console.log("goods_type", that.goods_type);
          } else {
            if (res.msg == "该商家已过期,去看看其他的吧") {
              that.showDis = false;
              that.show8 = true;
            }
            that.$dialog.alert({message:res.msg}).then(()=>{
              that.$router.go(-1);
            });
          }
        },
        function(res) {
          console.log(res);
        }
      );
    },
    FormLiveRoom(_id){
      $http.post("plugin.room.frontend.live.check-goods",{goods_id:this.$route.params.id,room_id: _id},"").then(response => {
        if (response.result === 1) {
          console.log(response.msg);
        } else {
          Toast(response.msg);
        }
      })
        .catch(error => {
          console.log(error);
        });
    },
    showCom(data) {
      this.isComment = data;
    }
  },

  watch: {},

  components: {
    cGoods,
  },

  computed: {}
};
