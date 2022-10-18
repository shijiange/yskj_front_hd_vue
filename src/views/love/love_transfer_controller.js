import cTitle from "components/title";
import { Toast } from 'vant';
import payKeyboard from "components/payKeyboard";
import { payKeyboardAsync } from "utils/payKeyboard";
export default {
  data() {
    return {
      // bool	转让倍数，为1则不限制
      transfer_multiple: 0,
      // 转让最小额，为0则不限制
      transfer_fetter: 0,
      //爱心转账值
      recharge_value: undefined,
      //爱心会员ID
      recharge_id: undefined,
      //输入搜索值
      recharge_search: "",
      // 转让手续费比率
      ratio: 0,
      // 实际到账数
      arrival_count: 0,
      buttonOff: true, //默认禁止提交
      love_name: "", //爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值
      showSearch: false,
      search_list: "", //搜索会员ID结果
      timeoutId: null,
      memberInfo: {
        nickname: "",
        realname: ""
      },

      payKeyboardShow: false,  //键盘显示
      need_password: false,    //是否需要验证支付密码
      has_password: false, //是否设置了支付密码
      loveKey: '',
      point_name:''
    };
  },
  methods: {
    checkTransfer() {
      if (this.loveKey == 'donate') {
        return;
      }
      let num = 0;
      if (!Number(this.transfer_multiple)) {
        num = 1;
      } else {
        num = Number(this.transfer_multiple);
      }
      if (this.recharge_value < Number(this.transfer_fetter)) {
        this.$dialog.alert({ message: "转账值不能小于" + Number(this.transfer_fetter) });
      } else if (Number(this.recharge_value) % num !== 0) {
        console.log(
          Number(this.recharge_value),
          Number(this.transfer_multiple)
        );
        this.$dialog.alert({ message: "转账值需要为" + this.transfer_multiple + "整数倍！" });
      }
    },
    throttleFn(event) {
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      this.timeoutId = setTimeout(function () {
        // 100毫秒以后执行方法
        that.searchTransfer(event);
      }, 500); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    searchTransfer(event) {
      var reSearch = event.target.value.replace(/\D/g, '');
      this.recharge_id = "";
      let urlstr = '';
      let json = {};
      if (this.loveKey == 'donate') {
        urlstr = "plugin.love.Frontend.Modules.Member.Controllers.query.index";
        json = { recipient: reSearch };
      } else {
        urlstr = "plugin.love.Frontend.Controllers.team-dividend-search.index";
        json = { search: reSearch };
      }
      if (reSearch) {
        this.memberInfo= {
          nickname: "",
          realname: ""
        };
        $http
          .get(
            urlstr,
            json,
            "数据加载中"
          )
          .then(response => {
            // var searchList = [];
            this.search_list = "";
            if (response.result === 1) {
              if (this.loveKey == 'donate') {
                let data = response.data.member;
                if (data) {
                  this.memberInfo.nickname = data.username ? data.username : "";
                  this.memberInfo.realname = data.realname ? data.realname : "";
                  this.recharge_id = reSearch;
                  console.log(this.recharge_id);
                }
              } else {
                var data = response.data[0];
                if (data) {
                  this.memberInfo.nickname = data.username ? data.username : "";
                  this.memberInfo.realname = data.nickname ? data.nickname : "";
                  this.recharge_id = reSearch;
                  this.showSearch = false;
                  return;
                }
                // searchList = data.map(function(val, idx) {
                //   return {
                //     nickname: val.nickname,
                //     id: val.uid
                //   };
                // });
                this.showSearch = true;
                // this.search_list = searchList;
              }

            } else {
              this.showSearch = true;
              this.search_list = response.msg;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.showSearch = false;
        this.search_list = [];
      }
    },
    searchTransfer_1() {
      var reSearch = this.recharge_search;
      this.recharge_id = "";
      let urlstr = '';
      let json = {};
      if (this.loveKey == 'donate') {
        urlstr = "plugin.love.Frontend.Modules.Member.Controllers.query.index";
        json = { recipient: reSearch };
      } else {
        urlstr = "plugin.love.Frontend.Controllers.team-dividend-search.index";
        json = { search: reSearch };
      }
      if (reSearch) {
        this.memberInfo= {
          nickname: "",
          realname: ""
        };
        $http
          .get(
            urlstr,
            json,
            "数据加载中"
          )
          .then(response => {
            // var searchList = [];
            if (response.result === 1) {
              if (this.loveKey == 'donate') {
                let data = response.data.member;
                if (data) {
                  this.memberInfo.nickname = data.username ? data.username : "";
                  this.memberInfo.realname = data.realname ? data.realname : "";
                  this.recharge_id = reSearch;
                }
              } else {
                var data = response.data[0];
                if (data) {
                  this.memberInfo.nickname = data.username ? data.username : "";
                  this.memberInfo.realname = data.nickname ? data.nickname : "";
                  this.recharge_id = reSearch;
                  this.showSearch = false;
                  return;
                }
                // searchList = data.map(function(val, idx) {
                //   return {
                //     nickname: val.nickname,
                //     id: val.uid
                //   };
                // });
                this.showSearch = true;
                // this.search_list = searchList;
              }

            } else {
              this.showSearch = true;
              this.search_list = response.msg;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.showSearch = false;
        this.search_list = [];
      }
    },
    makeTransfer(event) {
      var jid = event.target.dataset.jid;
      var name = event.target.dataset.name;
      this.recharge_id = jid;
      this.recharge_search = name;
      this.showSearch = false;
    },
    initData() {
      this.recharge_id = "";
      this.recharge_search = "";
      this.recharge_value = "";
      this.usable = 0;
      this.showSearch = false;
      this.search_list = [];
      this.memberInfo = {
        nickname: "",
        realname: ""
      };
    },

    getUsable() {
      $http
        .get("plugin.love.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.usable = response.data.usable;
              this.love_name = response.data.love_name;
              this.ratio = response.data.transfer_proportion;
              this.transfer_multiple = response.data.transfer_multiple;
              this.transfer_fetter = response.data.transfer_fetter;
              this.need_password = response.data.transfer_password;
              this.has_password = response.data.has_password;
              this.point_name = response.data.point_name;
            } else {
              this.$dialog.alert({ message: response.msg });

            }
          },
          function (response) {
            this.$dialog.alert({ message: response.msg });

          }
        );
    },

    payComplete(text) {
      console.log(text, "页面");
      payKeyboardAsync.complete(text);
    },
    getPayKeyboardPassword() {
      this.payKeyboardShow = true;
      return new Promise((resove, reject) => {
        payKeyboardAsync.addCompleteFn((pass) => {
          resove(pass);
        });
      });
      // let pass = await this.getPayKeyboardPassword();
      // console.log(pass);
    },

    async getBalance() {
      let that = this;
      //recipient 被转让者ID
      //change_value 转让爱心值
      if (!this.recharge_search) {
        Toast("请输入会员ID");
        return;
      }
      if (!this.recharge_value) {
        Toast("请输入您要转账的数额");
        return;
      }
      let json = {
        recipient: this.recharge_id,
        change_value: this.recharge_value
      };
      if (this.$route.params.key != 'donate') {
        if (this.showSearch) {
          Toast(this.search_list);
          return;
        }
        if (this.need_password == true && this.has_password == false) {
          that.$dialog
            .confirm({ message: "请先设置支付密码" })
            .then(() => {
              that.$router.push(that.fun.getUrl("set_balance_password", {}));
            });
          return;
        }
        if (this.need_password == true) {  //开启支付密码验证
          let pass = await this.getPayKeyboardPassword();
          json.password = pass;
        }
      }
      let urlstr = "";
      if (this.$route.params.key == 'donate') {
        urlstr = "plugin.love.Frontend.Modules.Love.Controllers.transfer-point.index";
      } else {
        urlstr = "plugin.love.Frontend.Modules.Love.Controllers.transfer.index";
      }
      $http
        .get(
          urlstr,
          json,
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              that.$dialog.alert({ message: response.msg }).then(() => {
                that.$router.go(-1);
              });
            } else {
              that.$dialog.alert({ message: response.msg });

            }
          },
          function (response) {
            that.$dialog.alert({ message: response.msg });

          }
        );
    },
  },

  watch: {
    recharge_search: function(val){
      this.recharge_search = val.replace(/\D/g, '');
    }
  },
  activated() {
    this.loveKey = this.$route.params.key;
    if (this.loveKey == 'donate') {
      this.fun.setWXTitle('转赠');
    }
    this.getUsable();
    this.initData();
  },
  components: { cTitle, payKeyboard }
};
