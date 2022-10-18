import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      result: ['a'],
      id: '',
      lisinfo: '',
      orTap:true
    };
  },
  methods: {
    // 轮询是否已经核销
    checkStatus(id) {
      var that = this;
      $http
        .get(
          "plugin.write-off-coupons.Frontend.controllers.code.get-status",
          { record_id: id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response);
              if (!response.data.status) {
                that.getList(id);
              }else{
                that.$dialog.alert({message:'已核销'});
              
              }
            } else {
              that.$dialog.alert({message:response.msg});
            
              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    getList(id) {
      var that = this;
      $http
        .get(
          "plugin.write-off-coupons.Frontend.controllers.write-off.index",
          { record_id: id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response);
              that.lisinfo = response.data;
            } else {
              that.$dialog.alert({message:response.msg});
             
              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    tapSure() {
      var that = this;
      if(this.fun.isTextEmpty(that.lisinfo)){
        return;
      }
      $http
        .get(
          "plugin.write-off-coupons.Frontend.controllers.write-off.handle",
          { record_id: that.id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.$dialog.alert({message:response.msg});
            
              this.orTap = false;
              // this.$router.push(this.fun.getUrl("coupon", {  }));
            } else {
              that.$dialog.alert({message:response.msg});
             
              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    init(){
      this.orTap = true;
    }
  },
  activated() {
    this.init();
    let id = this.$route.query.record_id;
    this.id = id;
    this.checkStatus(id);
  },
  mounted() { },
  components: { cTitle }
};