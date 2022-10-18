import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      result: [],
      list:[],
      display:'',
      lismun:0,
      selectMun:0
    };

  },
  methods: {
    init(){
      this.selectMun = 0;
      this.lismun = 0;
      this.result = [];
    },
    toggle(event, n) {
      console.log(event.target.className,n);
      if (
        event.target.className == "fa coupon_voucher_more_arr fa-angle-down"
      ) {
        this.display = 99999;
      } else {
        this.display = n;
      }
    },
    minus(){
      this.selectMun = this.selectMun-1;
      if(this.selectMun < 0){
        this.selectMun = 0;
      }
    },
    add(){
      this.selectMun = this.selectMun+1;
      console.log(this.selectMun);
    },
    getRoute(){
      if(this.result.length == 0){
        this.$dialog.alert({message:'请选择要分享的优惠券'});
      
        return;
      }
      if(this.selectMun == 0){
        this.$dialog.alert({message:'请选择分享张数'});
      
        return;
      }
      if(this.selectMun > this.lismun){
        this.$dialog.alert({message:'分享张数大于当前优惠券张数'});
        return;
      }
      let info = this.list[this.result];
      info.num = this.selectMun;
      // let json = 
      this.$router.push(this.fun.getUrl("CouponShareShow", { info:info }));
    },
    radioChange(e){
      this.lismun = this.list[this.result].num;
      this.selectMun = 1;
    },
    getDatas() {
      // var that = this;
      $http
        .post(
          "plugin.share-coupons.Frontend.controllers.list.index",
          {},
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              var myData = response.data;
              console.log(myData);
              for (let i = 0; i < myData.length; i++) {
                if (myData[i].belongs_to_coupon.coupon_type_name == '平台商品') {
                  myData[i].type = 1;
                } else if (myData[i].belongs_to_coupon.coupon_type_name == '兑换券') {
                  myData[i].type = 2;
                } else if (myData[i].belongs_to_coupon.coupon_type_name == '分类商品') {
                  myData[i].type = 3;
                } else if (myData[i].belongs_to_coupon.coupon_type_name == '指定商品') {
                  myData[i].type = 4;
                } else if (myData[i].belongs_to_coupon.coupon_type_name == '酒店商品') {
                  myData[i].type = 5;
                } else if (myData[i].belongs_to_coupon.coupon_type_name == '门店商品') {
                  myData[i].type = 6;
                }
              }
              this.list = myData;
              console.log(myData);
            } else {
              this.$dialog.alert({message:response.msg});
             
              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    }
  },
  activated() {
    this.init();
    this.getDatas();
  },
  mounted() { },
  components: { cTitle }
};