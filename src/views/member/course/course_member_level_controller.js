import cTitle from "components/title";
import yzBlank from "components/ui_components/yz_blank";

export default {
  data() {
    return {
      course_goods:{},
      level_data: [],
      level_type:'',
    };
  },

  mounted() {},

  methods: {
    //获取会员升级商品信息
    getMemberUpdate() {
      $http
        .get("plugin.video-demand.api.watch-level.condition", {
          goods_id: this.$route.params.goods
        })
        .then(response => {
          if (response.result == 1) {
            if (!this.fun.isTextEmpty(response.data)) {
              this.course_goods = response.data.course_goods;
              this.level_data = response.data.level_data;
              this.level_type = response.data.level_type;
            }
          }
          else{
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goto(){
      this.$router.push(this.fun.getUrl("home"));
    },
    gotoBuy(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },

    // 跳转充值页, 携带充值数量
    toRecharge(num){
      this.$router.push(this.fun.getUrl("balance_recharge", { num: num }));
    },
  },
  activated() {
    this.course_goods = {};
    this.level_data=[];
    this.level_type='';
    this.getMemberUpdate();
  },

  components: { cTitle, yzBlank }
};
