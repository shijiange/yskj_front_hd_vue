import orderInfo from "./order_info";
import { Dialog } from "vant";
let plugin_name="上级代付";
export default {
  components: { orderInfo },
  data() {
    return {
      shareContent: "",
      shareTit: "",
      shareUrl: "",
      shareImg: "",
      isMiniprogram: false,

      goodList: [],
      totalPrice: 0,
      totalNum: 0,
      title_name:''
    };
  },
  mounted() {},
  created() {
    this.getOrderDetail();
    this.getShareInfo();
  },
  watch: {
    shareContent: function(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (newVal == oldVal) {
        return;
      } else {
        if (this.fun.isTextEmpty(newVal)) {
          return;
        } else {
          this.initShare();
        }
      }
    }
  },
  methods: {
    //获取订单详情
    getOrderDetail() {
      $http
        .get("order.another-pay-detail", {
          plugin: "parent_payment",
          order_id: this.$route.params.order_id,
          pid: window.localStorage.getItem("uid")
        })
        .then(response => {
          if (response.result === 1) {
            this.formatGoods(response.data);
            this.title_name = response.plugin_name || plugin_name;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatGoods(list) {
      let numSum = 0;
      let price='';
      list.forEach(val => {
        this.goodList.push(...val.has_many_order_goods);
        price += val.price;
        return (numSum += val.goods_total);
      });
      console.log(this.goodList);
      this.totalNum = numSum;
      this.totalPrice = price;
    },

    
    //初始化分享设置
    initShare() {
      console.log(this.shareContent);
      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid() },
        {
          title: this.shareTit,
          imgUrl: this.shareImg,
          description: this.shareContent, // 分享描述
          link: this.shareUrl
          //link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/superiorPaymentPay?i=" + this.fun.getKeyByI()+"&pid="+this.fun.getKeyByMid()+"&order_ids="+ this.$route.params.order_id
        }
      );
    },
    //获取默认分享数据
    getShareInfo() {
      if (window.isMiniprogram) {
        this.isMiniprogram = true;
      }
      $http
        .get("plugin.parent-payment.frontend.modules.payment.controllers.share.index", {
          order_ids: this.$route.params.order_id
        })
        .then(response => {
          if (response.result === 1) {
            this.shareTit = response.data.title;
            this.shareUrl = response.data.url;
            this.shareImg = response.data.image;
            this.initShare();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handShare() {
      Dialog({ message: "请点击右上角分享" });
    }
  }
};
