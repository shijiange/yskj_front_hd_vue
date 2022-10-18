export default {
  data () {
    return {
      integralName: this.fun.getIntegralLang(),
      balanceName: this.fun.getBalanceLang(),
      memberId: '',
      memberData: {},
      memberChild: {},
      titleBgMode: "hide",
      rechargePopup: false, // 积分 余额共用一个弹框

      popText: '', // 积分 余额
      recharge: {
        integral: '',
        balance: '',
        remarks: '',
      },
      couponPopup: false, // 优惠券

      coupons: {
        id: '',
        name: '',
        number: '',
        emptyName: false,
      },
      isEmitLevel:false,
      level_list:[]
    };
  },
  mounted () {
    this.memberId = this.$route.params.id;
    if (!this.memberId) {
      this.$route.go(-1);
    }
    window.addEventListener("scroll", this.windowScroll);
  },
  activated () {
    this.getData();
  },
  destroyed () {
    window.removeEventListener("scroll", this.windowScroll);
  },
  methods: {
    getlevel_name(level_id){
      for(let i=0;i<this.level_list.length;i++){
        let item = this.level_list[i];
        if(level_id === item.id) return this.memberChild.level = item;
      }
    },
    emitLevel(){
      this.isEmitLevel = false;
      let level_id = this.memberChild.level_id;
      $http.post("plugin.shop-assistant.frontend.member.update-member",{id:this.$route.params.id,member:{level_id}},"正在修改中").then(({result,msg})=>{
        if(result==1){
          this.$toast("修改成功")
          this.getlevel_name(level_id);
          // this.getData();
        }else this.$toast(msg)
      })
    },
    windowScroll () {
      let scroll = document.documentElement && document.documentElement.scrollTop;
      if (scroll >= 50 && this.titleBgMode == "hide") {
        this.titleBgMode = "show";
      } else if (scroll <= 50 && this.titleBgMode == "show") {
        this.titleBgMode = "hide";
      }
    },
    // 置顶
    setTopping() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },

    getData () {
      let json = {id: this.memberId};
      $http.get("plugin.shop-assistant.frontend.member.get-detail", json, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.memberData = response.data;
          this.memberData.createtime = this.memberData.createtime ? this.fun.timestampToTime(this.memberData.createtime) : 0;
          this.memberChild = this.memberData.yz_member ? this.memberData.yz_member : {};
          this.level_list = response.data.level_list || [];
        });
    },

    // 修改推广员
    changeAgent () {
      $http.get("plugin.shop-assistant.frontend.member.update-agent", {id: this.memberId, is_agent: this.memberChild.is_agent}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            this.memberChild.is_agent = !this.memberChild.is_agent;
            return this.$toast("修改失败");
          }
          this.$toast("修改成功");
        });
    },


    showRechargePopup (type) {
      this.rechargePopup = true;
      this.recharge = {
        integral: '',
        balance: '',
        remarks: '',
      };
      if (type === "integral") {
        this.popText = "积分";
      } else {
        this.popText = "余额";
      }
    },

    // 确认充值
    confirmRecharge () {
      if (this.popText === "积分") {
        this.rechargeIntegral();
      } else {
        this.rechargeBalance();
      }
    },

    // 充值积分
    rechargeIntegral () {
      if (!this.recharge.integral) {
        return this.$toast("请输入充值数量");
      }
      let json = {};
      json.uid = this.memberId;
      json.integral = {
        integral: this.recharge.integral * 1,
        remark: this.recharge.remarks
      };
      $http.post("plugin.shop-assistant.frontend.member.recharge-integral", {...json}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast("充值失败");
          }
          this.$toast("充值成功");
          this.closeRechargePop();
          this.getData();
        });
    },

    // 充值余额
    rechargeBalance () {
      if (!this.recharge.balance) {
        return this.$toast("请输入充值数量");
      }
      let json = {};
      json.uid = this.memberId;
      json.balance = {
        balance: this.recharge.balance * 1,
        remark: this.recharge.remarks
      };
      $http.post("plugin.shop-assistant.frontend.member.recharge-balance", {...json}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast("充值失败");
          }
          this.$toast("充值成功");
          this.closeRechargePop();
          this.getData();
        });
    },

    closeRechargePop () {
      this.rechargePopup = false;
    },

    // 优惠券弹框
    showCouponPopup () {
      this.couponPopup = true;
      this.coupons = {
        id: '',
        name: '',
        number: '',
        emptyName: false,
      };
    },
    // 节流
    throttleFn() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      let that = this;
      this.timeoutId = setTimeout(function () {
        that.searchConpon();
      }, 800);
    },
    // 查询优惠券
    searchConpon () {
      $http.post("plugin.shop-assistant.frontend.coupon.coupon-detail", {id: this.coupons.id})
        .then((response) => {
          if (response.result !== 1) {
            this.coupons.emptyName = true;
            return this.$toast(response.msg);
          }
          this.coupons.emptyName = false;
          this.coupons.name = response.data.name;
        })
        .catch(() => {
          this.coupons.emptyName = true;
        });
    },
    // 确定赠送
    confirmGive () {
      if (!this.coupons.id) {
        return this.$toast('请输入优惠券id');
      }
      if (!this.coupons.number) {
        return this.$toast('请输入赠送优惠券数量');
      }
      if (this.coupons.id && !this.coupons.name) {
        return this.$toast('未查询到优惠券');
      }
      let json = {
        uid: this.memberId,
        id: this.coupons.id,
        send_total: this.coupons.number * 1
      };
      $http.post("plugin.shop-assistant.frontend.coupon.send-coupon", {...json}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.$toast("赠送成功");
          this.closeCouponPop();
          this.getData();
        });
    },

    closeCouponPop () {
      this.couponPopup = false;
    },

    toLink (name) {
      this.$router.push(this.fun.getUrl(name, {id: this.memberId}));
    },
  },
  computed: {
    gender () {
      return this.memberData.gender ? (this.memberData.gender == 1 ? '男' : '女') : '未知';
    },
  }
};
