import { Toast } from "vant";

export default {
  data() {
    return {
      mobile: '',
      show: true,
      member: [],
      memberShow: false,
      nickname: '',
      imageUse: '',
      tapOne: false,
      shop_id: '',
      bindStatus: true,
      bindErrorTxt:''
    };
  },
  created() {
  },
  activated() {
    this.init();
    this.getData();
    this.checkBind();
  },
  methods: {
    getUser() {
      $http.get("plugin.micro-debt.frontend.controllers.debtor.query", { mobile: this.mobile }, "").then(
        res => {
          console.log(res);
          if (res.result != 1) {
            this.memberShow = false;
            return;
          }
          this.memberShow = true;
          this.member = res.data.member;
        },
        res => {
          this.$toast(res.msg);
        }
      );
    },
    gohome(){
      this.$router.push(
        this.fun.getUrl("home")
      );
    },
    bindYzUser() {
      if (this.tapOne) {
        return;
      }
      if (this.fun.isTextEmpty(this.mobile)) {
        Toast('请输入债务人手机号');
        return;
      }
      this.tapOne = true;
      this.bindUser();
      // $http.get("plugin.micro-debt.frontend.controllers.creditor.check", {}, "").then(
      //   res => {
      //     console.log(res);
      //     // false 需要绑定债权人,ture 跳转债权人微店页面
      //     let bind = res.data.bind;
      //     if (bind) {
      //       this.$router.push(
      //         this.fun.getUrl("micro_shop_share_home", {
      //           shop_id: res.data.micro_id
      //         })
      //       );
      //     } else {
      //       this.bindUser();
      //     }
      //   },
      //   res => {
      //     this.$toast(res.msg);
      //   }
      // );
    },
    bindUser() {
      $http.get("plugin.micro-debt.frontend.controllers.creditor.bind", { mobile: this.mobile }, "").then(
        res => {
          if (res.result != 1) {
            //绑定失败初始化
            this.bindStatus = false;
            this.bindErrorTxt = res.msg;
            this.show = false;
            this.init();
            return;
          }
          this.show = false;
          this.bindStatus = true;
          setTimeout(() => {
            this.$router.push(
              this.fun.getUrl("micro_shop_share_home", {
                shop_id: res.data.micro_id
              })
            );
          }, 1500);
        },
        res => {
          this.$toast(res.msg);
        }
      );
    },
    getData() {
      $http.get("plugin.micro-debt.frontend.controllers.member.info", {}, "").then(
        res => {
          console.log(res);
          this.nickname = res.data.member.nickname;
          this.imageUse = res.data.member.avatar_image;
        },
        res => {
          this.$toast(res.msg);
        }
      );
    },
    checkBind() {
      $http.get("plugin.micro-debt.frontend.controllers.creditor.check", {}, "").then(
        res => {
          let bind = res.data.bind;
          if (bind) {
            this.$router.push(
              this.fun.getUrl("micro_shop_share_home", {
                shop_id: res.data.micro_id
              })
            );
          }
        },
        res => {
          this.$toast(res.msg);
        }
      );
    },
    init() {
      this.tapOne = false;
    }
  },
  components: {}
};
