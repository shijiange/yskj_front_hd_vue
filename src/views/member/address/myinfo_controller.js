// import addre from "assets/address/addressinfo";
import cTitle from "components/title";
import { Toast } from 'vant';

// const address = addre;
var isToast = false;
export default {
  beforeRouteLeave(to, from, next) {
    // if (isToast) {
    next();
    // } else {
    //   this.$dialog.alert({ message: '当前信息未保存！'});
    //   next(false);
    // }
  },
  data() {
    return {
      form: {
        toi: this.fun.getKeyByI(),
        member_name: "",
        member_card: ""
      },

      explain_title: "",
      explain_content: "",

      show1: false
    };
  },
  methods: {
    saveInfo() {
      let that = this;
      console.log("route", this.$route.params);
      var _goodsId = this.$route.params.goodsId;
      var _optionsId = this.$route.params.optionsId;
      var _total = this.$route.params.total;
      var submitActionTag = this.$route.params.tag;
      var activityId = this.$route.params.at_id || 0;
      var leader_id = this.$route.params.leader_id || 0;

      let json = {
        member_name: this.form.member_name,
        member_card: this.form.member_card,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      isToast = true;
      $http.get("from.div-from.updateMemberInfo", json, "添加中...").then(
        function (response) {
          console.log(response.data);
          if (response.result == 1) {
            //Toast(response.msg);
            if (submitActionTag == "cart") {
              that.addCartReq(_goodsId, _optionsId, _total);
              return;
            } else if (submitActionTag == "groupBuy_open") {
              that.$router.push(
                that.fun.getUrl("goodsorder", {}, {
                  tag: "-2",
                  orderType: 'groupBuy_open',
                  goodsId: _goodsId,//活动商品ID
                  at_id: activityId,//活动ID
                  total: 1,
                })
              );
              return;
            } else if (submitActionTag == "groupBuy_join") {
              that.$router.push(
                that.fun.getUrl("goodsorder", {}, {
                  tag: "-2",
                  orderType: 'groupBuy_join',
                  goodsId: _goodsId,
                  total: 1,
                  at_id: activityId,
                  leader_id: leader_id
                })
              );
              return;
            } else if (!that.fun.isTextEmpty(submitActionTag)) {
              that.$router.push(
                that.fun.getUrl("goodsorder",{}, {
                  tag: submitActionTag,
                  goodsId: _goodsId,
                  optionsId: _optionsId,
                  total: _total
                })
              );
            } else {
              that.$router.go(-1);
              return;
            }
            that.$router.push(
              that.fun.getUrl("goodsorder", {}, {
                tag: submitActionTag,
                goodsId: _goodsId,
                optionsId: _optionsId,
                total: _total,
                myinfo:true
              })
            );
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //获取会员信息
    getMember() {
      $http
        .get("from.div-from.getMemberInfo", "...")
        .then(response => {
          console.log(response);
          if (response.result == 1) {
            this.form.member_name = response.data.realname;
            this.form.member_card = response.data.idcard;
          } else {
            this.show1 = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  mounted() {
    isToast = false;
    var provinces = [];
    var province = localStorage.getItem("province");
    provinces = JSON.parse(province);
    this.provinceoptions = provinces;
  },
  activated() {
    isToast = false;
    this.member_name = "";
    this.member_card = "";
    this.show1 = false;
    this.toi = this.fun.getKeyByI();
    let that = this;
    $http.get("from.div-from.explain", {}, "添加中...").then(
      function (response) {
        if (response.result == 1) {
          that.explain_title = response.data.explain_title;
          that.explain_content = response.data.explain_content;
        } else {
          Toast(response.msg);
        }
      },
      function (response) {
        console.log(response);
      }
    );

    this.getMember();
  },
  components: { cTitle }
};
