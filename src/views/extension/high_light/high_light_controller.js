import { Toast } from 'vant';
export default {
  data() {
    return {
      name: '',
      certificate_no: '',
      phone_number: '',
      bankcard_num: '',
      bank_name: '',
      payment_account: '',
      grouping_info: false,
      industry_info: false,
      certificate_type: 1,
      document_list: [
        { id: 1, name: '居民身份证' },
        { id: 3, name: '港澳居民来往内地通行证' },
        { id: 4, name: '港澳居民居住证' },
        { id: 5, name: '台湾居民来往大陆通行证' },
        { id: 6, name: '台湾居民居住证' },
      ],
      value: '',
      diyname: '高灯'
    };
  },
  activated() {
    this.value = this.$route.params.value;
    this.data_echo();
  },
  methods: {
    submit() {
      if (!this.name) { Toast('请输入您的姓名'); return; }
      if (!this.certificate_type) { Toast('请选择证件类型'); return; }
      if (!this.certificate_no) { Toast('请输入您的证件号'); return; }
      if (!this.phone_number) { Toast('请输入您的手机号码'); return; }
      // 验证手机号码格式
      const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (this.phone_number == '' || this.phone_number.length <= 10 || !reg.test(this.phone_number)) {
        Toast('手机号码格式错误');
        return;
      }
      if (!this.bankcard_num && this.value === 'high_light_bank') { Toast('请输入您的银行卡号'); return; }
      if (!this.bank_name && this.value === 'high_light_bank') { Toast('请输入您的银行名称'); return; }
      if (!this.payment_account && this.value === 'high_light_alipay') { Toast('请输入您的支付宝账户'); return; }

      let json = {
        name: this.name,
        certificate_no: this.certificate_no,
        phone_number: this.phone_number,
        certificate_type: this.certificate_type,
        bank_name: this.bank_name,
        bankcard_num: this.bankcard_num,
        payment_account: this.payment_account
      };
      // console.log(json,'ddd');returns
      $http.get('plugin.high-light.frontend.index.edit-agreement-info', json).then(
        response => {
          if (response.result == 1) {
            // console.log(response,'response');
            Toast('提交成功');
            if (response.data.statue === 1) {
              setTimeout(() => {
                window.location.href = response.data.url;
              }, 1000);
            }
            if (response.data.statue === 0) {
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    data_echo() {
      $http.get('plugin.high-light.frontend.index.get-info').then(
        response => {
          if (response.result == 1) {
            console.log(response, 'response');
            this.name = response.data ? response.data.name : '',
            this.certificate_no = response.data ? response.data.certificate_no : '',
            this.phone_number = response.data ? response.data.phone_number : '',
            this.certificate_type = response.data ? response.data.certificate_type : 1,
            this.bank_name = response.data ? response.data.bank_name : '',
            this.bankcard_num = response.data ? response.data.bankcard_num : '',
            this.payment_account = response.data ? response.data.payment_account : '';
            const plugin_setting = JSON.parse(localStorage.getItem("plugin_setting"));
            this.diyname = (plugin_setting && plugin_setting.high_light && plugin_setting.high_light.diy_name) || "高灯";
            this.fun.setWXTitle(`${this.diyname}代发薪`);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    groupingSelect() {
      this.grouping_info = false;
    },
    groupingClick() {
      this.grouping_info = !this.grouping_info;
    },
    btnBackGo() {
      this.$router.push(this.fun.getUrl("withdrawal"));
    }
  },
};