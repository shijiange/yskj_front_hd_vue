import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      invite_code: "",
      name: "",
      img: "",
      title: "",
      default_invite:''
    };
  },
  mounted() {
    this.showName();
  },
  methods: {
    fillInCode(){
      this.invite_code = this.default_invite;
    },
    submit() {
      if (this.fun.isTextEmpty(this.invite_code)) {
        Toast({
          message: "请输入邀请码",
          duration: 1500
        });
        return;
      }
      if (this.fun.getKey("fromGood")) {
        $http
          .get("member.member.refuseGoods", { invite_code: this.invite_code })
          .then(
            response => {
              if (response.result === 1) {
                this.$router.go(-1);
              } else {
                this.$dialog.alert({message:response.msg});
              }
            },
            response => {
              this.$dialog.alert({message:response.msg});
            }
          );
      } else {
        $http
          .get(
            "member.member.member-invite-validate",
            { invite_code: this.invite_code },
            "加载中"
          )
          .then(
            res => {
              if (res.result === 1) {
                this.name = res.data.has_one_member.nickname;
                this.img = res.data.has_one_member.avatar_image;
                sessionStorage.setItem("isset", 1);

                this.$store.commit("setInviter", 1);
                this.$router.push(this.fun.getUrl("editmobile",{fromTag: "fromInviter",code:this.invite_code}));
              } else {
                Toast({
                  message: res.msg,
                  duration: 1500
                });
              }
            },
            res => {
              this.$dialog.alert({message:res.msg});
            }
          );
      }
    },
    showName() {
      $http.get("member.member.getShopSet").then(res => {
        if (res.result === 1) {
          this.title = res.data.shop_set_name;
          this.default_invite = res.data.default_invite;
        } else {
          Toast({
            message: res.msg,
            position: "bottom",
            duration: 1500
          });
        }
      });
    }
  },
  components: {
    cTitle
  }
};
