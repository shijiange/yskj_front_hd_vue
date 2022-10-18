import cTitle from "components/title";
export default {
  data() {
    return {
      // 登陆会员冻结爱心值
      froze: 0,
      //爱心值自定义名称
      love_name: "",
      // 登陆会员可用爱心值
      usable: 0,
      // 转让开关是否开启
      transfer_status: false,
      // 转让开关是否开启
      trading_status: false,
      //待用爱心值
      recharge: 0,
      //是否可提现
      withdraw_status: false,
      //是否可以
      recharge_status: false,

      froze_name:'',  //冻结兑换值
      usable_name:'', //兑换值激活

      redpack_enable: false, // 开启爱心值红包
      //  海报入口显示
      poster_center_show:0,
      // 爱心值海报自定义名称
      love_poster_name:0,
      showPoster:false,
      posterImg:'',
      activation_record: false, // 激活记录是否开启
      withdrawDate:{
        day:1,
        disable:false,
        day_msg:""
      },

      love_cycle_reward:'disabled',
      transfer_point_status:false,
      // 积分字样
      pointKey:'',
      //加速池开关
      speed_pool_enable:0,
      // 御为民-爱心值队列
      love_queue:"",
      //转换消费积分
      change_integral:{},
      integral:"消费积分"
    };
  },
  methods: {
    getyz_basic_info(){
      let yz_basic_info = localStorage.getItem("yz_basic_info");
      if (yz_basic_info) {
        yz_basic_info = JSON.parse(yz_basic_info);
        this.integral = yz_basic_info.integral;
        // this.loveName = yz_basic_info.love;
      }
    },
    tapPoster(){
      $http
        .post(
          "plugin.love.Frontend.Controllers.poster",
          {},
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              this.posterImg = response.data;
              this.showPoster = true;
            } else {
              this.$dialog.alert({message:response.msg});
            }
          },
          (response)=> {
            console.log(response);
          }
        );
    },
    makeTransfer(key) {
      if(key == 'donate'){
        console.log(key,'sssssss');
        // 爱心值转赠积分
        this.$router.push(this.fun.getUrl("love_transfer",{key:'donate'}));
        return;
      }
      let that=this;
      $http
        .post(
          "plugin.love.Frontend.Controllers.page.authentication",
          {},
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.data.flag) {
                this.$router.push(this.fun.getUrl("love_transfer"));
              } else {
                that.$dialog.alert({message:response.msg});

              }
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          (response)=> {
            console.log(response);
          }
        );
    },
    getBalance() {
      let that=this;
      $http
        .get("plugin.love.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              if(response.data.withdraw_date){
                this.withdrawDate=response.data.withdraw_date;
              }
              this.transfer_point_status = response.data.transfer_point_status == '0'?false:true;
              this.pointKey = response.data.point_name;
              this.froze = response.data.froze;
              this.love_name = response.data.love_name;
              this.speed_pool_enable = response.data.speed_pool_enable  //加速池开关
              window.localStorage.love_name = this.love_name;
              //设置微信title
              this.fun.setWXTitle(this.love_name);
              this.usable = response.data.usable;
              this.transfer_status = response.data.transfer_status;
              this.trading_status = response.data.trading_set.trading;
              this.no_recharge = response.data.no_recharge;
              this.withdraw_status = response.data.withdraw_status;
              this.recharge_status = response.data.recharge_status;
              this.froze_name = response.data.froze_name;
              this.usable_name = response.data.usable_name;
              this.redpack_enable = response.data.redpack_enable;
              this.poster_center_show = response.data.poster_center_show;
              this.love_poster_name = response.data.love_poster_name;
              this.activation_record = response.data.activation_record;
              this.love_cycle_reward = response.data.love_cycle_reward;
              this.love_queue = response.data.love_queue !== undefined ? JSON.parse(JSON.stringify(response.data['love_queue'])) : '';
              this.change_integral = response.data.change_integral;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          (response)=> {
            console.log(response);
          }
        );
    },
    gotoPage(url) {
      if(url=="loveWithdrawals"){
        if(this.withdrawDate.disable==1){
          this.$toast(this.withdrawDate.day_msg);
          return;
        }
      }
      if(url=='LoveRecharge' && JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay  == "1" && this.fun.isIphone()){
        this.$dialog.alert({
          message: '十分抱歉，由于相关规定，你暂时无法在这里充值！'
        });
        return false;
      }
      if(url == 'loveCycleReceive'){
        this.$router.push(this.fun.getUrl(url,{},{love_name:this.love_name}));
        return;
      }
      if(url=='love_speed_lease'){
        return this.$router.push(this.fun.getUrl(url,{},{love_name:this.love_name}))
      }
      if (url== "love-integral") {
        let time = new Date().getTime();
        let {start,end} = this.change_integral;
        let starttime = new Date(start.replace(/-/g,'/')).getTime();
        let endtime = new Date(end.replace(/-/g,'/')).getTime();
        if(starttime>time || time>endtime){
          this.$toast({
            type: 'html',
            message: `<p>当前不能转换</p><p>请在${start}到${end}转换</p>`,
          });
          return false;
        }
      }
      this.$router.push(this.fun.getUrl(url));
    },
  },
  activated() {
    this.getyz_basic_info();
    this.getBalance();
  },
  components: { cTitle }
};
