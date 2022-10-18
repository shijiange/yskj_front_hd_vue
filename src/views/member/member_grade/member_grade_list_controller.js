// import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {
      show1:false,
      level_type: "",
      levelList: [],
      //客服
      cservice: "",
      //会员信息
      memberInfo: {},
      right: {},
      shopDesc: "",
      name: "",
      service_QRcode:'',  
      service_mobile:'',
      ios_virtual_pay:'',
      status:false,
      balance_recharge:'1'//充值是否开启
    };
  },

  activated() {
    this.init();
    this.ios_virtual_pay=JSON.parse(window.localStorage.getItem('globalParameter')).ios_virtual_pay;
    this.status=this.fun.isIosOrAndroid()=='ios';
    this.getLevelUpData();
  },

  mounted() {},
  methods: {
    torecharge(num){
      this.$router.push(this.fun.getUrl("balance_recharge", { num: num }));
    },
    replace(item) {
      if (item.indexOf("\n") >= 0) {
        return item.split("\n").join("<br>");
      } else {
        return item;
      }
    },
    //获取升级等级数据
    getLevelUpData() {
      $http
        .get("member.member-level.index")
        .then(response => {
          if (response.result === 1) {
            this.balance_recharge = response.data.balance_recharge;
            this.level_type = response.data.level_type;
            this.levelList = response.data.data;
            this.memberInfo = response.data.member_data;
            this.right = response.data.member_data.rights;
            if(response.data.shop_set.hasOwnProperty('service_QRcode')){
              this.service_QRcode=response.data.shop_set.service_QRcode;
            }
            if(response.data.shop_set.hasOwnProperty('service_mobile')){
              this.service_mobile=response.data.shop_set.service_mobile;
            }
            this.cservice = this.fun.isTextEmpty(
              response.data.shop_set.cservice
            )
              ? ""
              : response.data.shop_set.cservice;

            this.shopDesc = response.data.shop_description;

            this.name = response.data.shop_set.name;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    isNotNull(data) {
      return !this.fun.isTextEmpty(data);
    },

    // gotoDetail(){
    //   this.$router.push(this.fun.getUrl("MemberGradeListDetail"));
    // },

    // gotoRefundsMigration() {
    //   this.$router.push(this.fun.getUrl("MemberRefundsMigration"));
    // },

    gotoRightGood(id) {
      this.$router.push(this.fun.getUrl("RightGood", { level_id: id }));
    },

    init() {
      this.levelList = [];
      this.cservice = "";
      this.memberInfo = {};
      this.right = {};
      this.shopDesc = "";
      this.name = "";
      this.service_mobile='';
      this.service_QRcode='';
      this.show1=false;
    },

    buy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    }
  },
  components: { cTitle }
};
