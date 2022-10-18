import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {
      photosize: 1024 * 1024 * 4, // 图片大小限制,
      information: {
        my_name: "",
        phone_number: "",
        store_name: "",
        store_logo: "",
        bank_account: "",
        owner_name: "",
        opening_bank: "",
        opening_branch: "",
        enterprise_alipay: "",
        enterprise_alipay_user: "",
        alipay: "",
        alipay_username: "",
        weChat_account: "",
        category:"",
        group:"",
        imageList:[]
      },
      // setting sun
      imageUrl: "",
      uploadUrl: "",
      jumpState: true,
      fill_set: {},
      // imageList:[]
    };
  },
  created() {
    this.getFillSet();
  },
  // setting sun
  activated() {
    // console.log("route++params", this.$route.params);
    this.init();
    this.urlUp();
    this.getJson();
  },
  methods: {
    getFillSet() {
      $http.post("plugin.supplier.frontend.info.getFillSet").then((response) => {
        if (response.result === 1) {
          this.fill_set = response.data.fill_set;
        }
      }).catch((response) => {
        console.log(response.msg);
      });
    },
    // 初始化信息
    init() {
      for (var item in this.information) {
        this.information[item] = "";
      }
      this.imageUrl = "";
    },
    // 获取数据
    getJson() {
      let that = this;
      let json = { member_id: this.$route.params.member_id };
      $http.post("plugin.supplier.frontend.info.index", json).then(
        function(response) {
          console.log('info--res', response);
          if (response.result === 1) {
            that.information.my_name = response.data.realname;
            that.information.phone_number = response.data.mobile;
            that.information.store_name = response.data.store_name;
            that.information.store_logo = response.data.logo;
            that.imageUrl = response.data.logo;
            that.information.bank_account = response.data.company_bank;
            that.information.owner_name = response.data.bank_username;
            that.information.opening_bank = response.data.bank_of_accounts;
            that.information.opening_branch = response.data.opening_branch;
            that.information.enterprise_alipay = response.data.company_ali;
            that.information.enterprise_alipay_user = response.data.company_ali_username;
            that.information.alipay = response.data.ali;
            that.information.alipay_username = response.data.ali_username;
            that.information.weChat_account = response.data.wechat;
            that.information.category =  response.data.has_one_category ? response.data.has_one_category.title : '默认行业';
            that.information.group =  response.data.has_one_group ? response.data.has_one_group.title : '默认分组';
            that.information.imageList =  response.data.has_one_aptitude.aptitude;
          } else {
            // 判断权限
            if (response.data.url) {
              that.$notify(response.msg);
              window.location.href = response.data.url;
              return 0;
            }
            // that.$message.error(response.msg)
            that.$notify(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 确认修改
    modifyInformation() {
      var that = this;
      that.jumpJudge();
      if (that.jumpState == true) {
        if (that.fun.isMoblie(that.information.phone_number)) {
          this.$notify("请输入正确的手机号");
          // this.$message.error('请输入正确的手机号')
          return;
        }
        if (this.fill_set.company_bank == "1") {
          if ( !/^[0-9]*$/.test(that.information.bank_account) ) {
            this.$notify("请输入正确的银行卡账号");
            return;
          }
        }

        if (this.fill_set.company_ali == "1") {
          if (
            !/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/.test(
              that.information.enterprise_alipay
            )
          ) {
            this.$notify("请输入正确的企业支付宝账号");
            return;
          }
        }

        if (this.fill_set.ali == "1") {
          if (
            !/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/.test(
              that.information.alipay
            )
          ) {
            this.$notify("请输入正确的支付宝账号");
            return;
          }
        }

        if (this.fill_set.wechat == "1") {
          if (
            !/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(
              that.information.weChat_account
            )
          ) {
            this.$notify("请输入正确的微信号");
            return;
          }
        }

        let json = {
          realname: that.information.my_name,
          mobile: that.information.phone_number,
          store_name: that.information.store_name,
          logo: that.information.store_logo,
          company_bank: that.information.bank_account,
          bank_username: that.information.owner_name,
          bank_of_accounts: that.information.opening_bank,
          opening_branch: that.information.opening_branch,
          company_ali: that.information.enterprise_alipay,
          company_ali_username: that.information.enterprise_alipay_user,
          ali: that.information.alipay,
          ali_username: that.information.alipay_username,
          wechat: that.information.weChat_account
        };
        $http.post("plugin.supplier.frontend.info.edit", json).then(
          function(response) {
            console.log("midify", response);
            if (response.result === 1) {
              that.$router.push(
                that.fun.getUrl("SupplierCenter", {
                  uid: that.$route.params.member_id
                })
              );
              that.$notify({
                background: "#f0f9eb",
                message: "修改成功",
                color: "#67c23a"
              });
            } else {
              that.$notify(response.msg);
              // that.$message.error(response.msg)
            }
          },
          function(response) {
            console.log(response);
          }
        );
      } else {
        // that.$message({
        //   message: '填写信息不完整',
        //   type: 'warning'
        // })
        that.$notify({
          background: "#fef0f0",
          message: "填写信息不完整",
          color: "#f56c6c"
        });
      }
    },
    // 确认条件
    jumpJudge() {
      this.jumpState = true;

      if (!this.information.my_name || !this.information.phone_number || !this.information.store_name || !this.information.store_logo) {
        this.jumpState = false;
      }

      // for (var item in this.information) {
      //   if (this.information[item] == "") {
      //     this.jumpState = false;
      //   }
      // }
      if (this.fill_set) {
        if (this.fill_set.company_bank == "1") {
          if (this.information.bank_account == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.bank_username == "1") {
          if (this.information.owner_name == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.bank_of_accounts == "1") {
          if (this.information.opening_bank == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.opening_branch == "1") {
          if (this.information.opening_branch == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.company_ali == "1") {
          if (this.information.enterprise_alipay == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.company_ali_username == "1") {
          if (this.information.enterprise_alipay_user == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.ali == "1") {
          if (this.information.alipay == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.ali_username == "1") {
          if (this.information.alipay_username == "") {
            this.jumpState = false;
          }
        }
        if (this.fill_set.wechat == "1") {
          if (this.information.weChat_account == "") {
            this.jumpState = false;
          }
        }
      }

      if (this.imageUrl == "") {
        this.jumpState = false;
      }
    },
    // setting sun
    // 上传url
    urlUp() {
      this.uploadUrl = this.fun.getRealUrl(
        "upload.uploadPic",
        {}
      );
    },
    // 上传成功
    handleStoreSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.information.store_logo = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    // 上传前
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        // this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        // this.$message.error('上传头像图片大小不能超过 2MB!')
        this.$notify("上传头像图片大小不能超过 2MB!");
      }
      return isPNG && isLt2M;
    },
    /*vant图片上传*/
    onRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            That.imageUrl = URL.createObjectURL(e.file);
            That.information.store_logo = responseData.data.img;
          } else {
            Toast(responseData.msg);
          }
          // this.img.push(res.data.imgpath)
        })
        .catch(error => {
          console.log(error);
        });
    },
    onphotosize(e) {
      this.$notify("上传图片大小不能超过 2MB!");
      // this.$message.error('上传图片大小不能超过 2MB!')
    }
  },
  components: { cTitle }
};
