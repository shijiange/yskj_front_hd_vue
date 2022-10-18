import { Toast } from 'vant';
import cTitle from "components/title";


export default {
  data() {
    return {
      bank_name: "",
      bank_id: "",
      bank_user: "",
      bank_province: "",
      bank_city: "",
      bank_branch: "",

      status: false
    };
  },

  mounted() {

  },

  methods: {
    change() {
      this.status = true;
      this.bank_id = "";
    },

    init() {
      this.bank_name = "";
      this.bank_id = "";
      this.bank_user = "";
      this.bank_province = "";
      this.bank_city = "";
      this.bank_branch = "";
    },

    //跳转
    login() {
      this.$router.push(this.fun.getUrl("login"));
    },


    //获取信息
    getData() {
      let json = {};
      let that = this;
      $http.post("member.bank-card.show", json, "").then((response) => {

        if (response.result == 1) {
          that.bank_name = response.data.bank_name;
          that.bank_id = response.data.bank_card;
          that.bank_user = response.data.member_name;
          that.bank_province = response.data.bank_province;
          that.bank_city = response.data.bank_city;
          that.bank_branch = response.data.bank_branch;
          that.status = false;
        } else {
          that.$dialog.alert({ message: response.msg });
        }
      }, (response) => {
        that.$dialog.alert({ message: response.msg });
      });
    },


    //注册
    bind() {
      let that = this;
      if (this.fun.isTextEmpty(this.bank_name)) {
        Toast({
          message: "请输入开户行",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bank_province)) {
        Toast({
          message: "请输入开户行省份",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bank_city)) {
        Toast({
          message: "请输入开户行城市",
          timeout: 1500
        });
        return;
      }


      if (this.fun.isTextEmpty(this.bank_branch)) {
        Toast({
          message: "请输入开户行支行",
          timeout: 1500
        });
        return;
      }


      if (this.fun.isTextEmpty(this.bank_id)) {
        Toast({
          message: "请输入账号",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bank_user)) {
        Toast({
          message: "请输入姓名",
          timeout: 1500
        });
        return;
      }


      let json = {
        "bank_card": this.bank_id,
        "member_name": this.bank_user,
        "bank_name": this.bank_name,
        "bank_province": this.bank_province,
        "bank_city": this.bank_city,
        "bank_branch": this.bank_branch
      };
      $http.post("member.bank-card.edit", json, "绑定中...").then((response) => {

        if (response.result == 1) {
          if (window.history.length <= 1) {
            that.$router.push(that.fun.getUrl('home', {}));
          } else {
            that.$router.go(-1);
          }
        } else {
          that.$dialog.alert({ message: response.msg });
        }
      }, (response) => {
        that.$dialog.alert({ message: response.msg });
      });
    }

  },
  activated() {
    this.init();
    this.getData();
  },

  components: { cTitle }


};
