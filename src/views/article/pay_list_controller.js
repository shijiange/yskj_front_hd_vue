import cTitle from "components/title";
// import { Toast } from 'vant';
import { yzPay } from "../../utils/yz_pay"; //引入支付方法
export default {
  mixins: [yzPay],
  data() {
    return {
      id: "",
      dataInfo: {},
      rewardPayshow: false,
      btnData: [],
      isclick:true,
      goback:false
    };
  },
  activated() {
    this.initData();
    this.id = this.$route.params.id;
    if(this.$route.params.home=='1'){
      this.goback=true;
    }
    this.getData();
  },
  deactivated() {

  },
  mounted() {},

  methods: {
    initData(){
      this.id="";
      this.dataInfo={};
      this.rewardPayshow=false;
      this.btnData=[];
      this.isclick=true;
      this.goback=false;
    },
    payBtn(type, name) {
      if(type==3&&!this.isclick){
        return;
      }
      let that = this;
      let json = {
        pay_id:type,
        money:this.dataInfo.money,
        pay_name:name,
        id:this.id,
        art:'pay'
      };
      $http
        .post(
          "plugin.article-pay.api.index.orderPay",
          json,
          "支付中..."
        )
        .then(response => {
          that.rewardPayshow = false;
          if (response.result == 1) {
            this.handleOtherPay({value: type}, response, "pay_list");
          } else {
            that.$dialog.alert({message:response.msg});

          }
        })
        .catch(error => {

        });
    },
    confirm(){
      if(JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay  == "1" && this.fun.isIphone()){
        this.$dialog.alert({
          message: '十分抱歉，由于相关规定，你暂时无法在这里充值！'
        });
        return false;
      }
      this.getPayData();
    },
    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      $http
        .get("plugin.article-pay.api.index.getPayType", {})
        .then(response => {
          if (response.result == 1) {
            let btnData = response.data.buttons;
            this.btnData = btnData;
            this.rewardPayshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      return Y + M + D;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getData() {
      $http.get("plugin.article-pay.api.index.articlePayData", {id:this.id,art:'detail'}, "获取中").then(
        response => {
          if (response.result === 1) {
            this.dataInfo=response.data.payDetail;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
  },
  components: { cTitle }
};
