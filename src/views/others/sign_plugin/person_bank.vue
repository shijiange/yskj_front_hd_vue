<template>
  <div class="form">
    <c-title :hide="false" :text="'个人认证'">
    </c-title>
    <div class="agree-box" v-if="step === 1">
      <img style="width: 8rem; height: 8rem; margin: 1.5rem 1.5rem 1rem 1.5rem;" src="../../../assets/images/sign/yq_sign_renzheng@2x.png" alt="">

      <div class="btn" @click="step = 2">开始认证</div>
    </div>

    <div class="content"  v-if="step === 2 || step === 3">
      <van-form @submit="onSubmit">
        <van-field
          v-model.trim="form.name"
          name="姓名"
          label="姓名"
          placeholder="请填写姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model.trim="form.id_no"
          name="身份证号"
          label="身份证号"
          placeholder="请填写身份证号"
          :rules="[{ required: true, message: '请填写身份证号' }]"
        />
        <van-field
          v-model.trim="form.tel"
          name="手机号"
          label="手机号"
          placeholder="请填写手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field name="radio" label="认证方式">
          <template #input>
            <van-radio-group v-model="activeName" direction="horizontal">
              <van-radio style="display: flex;" name="1">手机号认证</van-radio>
              <van-radio style="display: flex;" name="2">银行卡认证</van-radio>
              <van-radio style="display: flex; margin-top: 10px;" name="3">人脸识别认证
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model.trim="bank_no" v-if="step === 3 && activeName=='2'"
          name="个人银行卡号"
          label="个人银行卡号"
          placeholder="请填写个人银行卡号"
          :rules="[{ required: true, message: '请填写个人银行卡号' }]"
        />
        <van-field v-if="step === 3 && (activeName=='1' || activeName=='2')"
                   v-model.trim="authcode"
                   center
                   clearable
                   label="短信验证码"
                   placeholder="请输入短信验证码"
        >
          <van-button slot="button" size="small" round plain type="info" @click="sureIdentify" v-show="this.count<= 0">
            获取验证码
          </van-button>
          <van-button slot="button" size="small" round plain type="info" disabled v-show="this.count> 0">
            {{count}}秒后重新获取
          </van-button>
        </van-field>
        <van-field name="radio" label="识别方式" v-if="step === 3 && activeName=='3'">
          <template #input>
            <van-radio-group v-model="form.face_auth_mode" direction="horizontal">
              <van-radio style="display: flex;" name="1">支付宝人脸识别</van-radio>
              <van-radio style="display: flex; margin-top: 10px;" name="2">腾讯云人脸识别</van-radio>
            </van-radio-group>
          </template>
        </van-field>

      </van-form>

      <div class="btn" @click="toStep" v-if="step === 2">进行认证</div>
      <div class="btn" @click="sendCode" v-if="step === 3">立即认证</div>
    </div>

    <van-popup :overlay="false" v-model="protocolShow" position="right" style="width: 100%; height: 100%;">
      <div class="protocolcontent">
        <van-nav-bar
          title="实名认证服务协议"
          left-text="返回"
          right-text=""
          left-arrow
          @click-left="protocolShow = false"
          style="position: sticky; top: 0;"
        />
        <div style="padding: 10px;" v-html="agreement.auth_agreement_desc">

        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      activeName: '',
      step: 1,
      checkboxGroup: [],
      protocolShow: false,
      agreement: {},
      form: {
        name: "",
        id_no: "",
        tel: "",
        face_auth_mode: ''
      },
      authcode: "",
      bank_no: "",
      flow_id: "",
      count: "",
      timer: null
    };
  },
  activated() {
    this.step = 1;
    this.checkboxGroup = [];
    this.getPersonData();
    // this.getAgreement();
    this.clear();
  },
  methods: {
    clear() {
      this.form = {
        name: "",
        id_no: "",
        tel: "",
        face_auth_mode: ''
      };
      this.authcode = "";
      this.bank_no = "";
      this.flow_id = "";
      this.count = 0;
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    toStep() {
      if(!this.form.name) {
        Toast('请先填写姓名');
        return;
      }
      if(!this.form.id_no) {
        Toast('请先填写身份证号');
        return;
      }
      if(!this.form.tel) {
        Toast('请先填写手机号');
        return;
      }
      if(!this.activeName) {
        Toast('请先选择认证方式');
        return;
      }

      this.step = 3;
      // this.checkPersonData();
    },
    onSubmit() {
      console.log("submit", this.form);
    },
    checkPersonData() {
      $http
        .get("plugin.shop-esign.frontend.person.check-auth-center-status", {
          name: this.form.name,
          idNo: this.form.id_no,
          tel: this.form.tel,
        }, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
            if(this.person.status_code == '99') {
              this.$dialog.alert({ message: '您在认证中心已经完成认证，无需重复认证'})
                .then(() => {
                  this.$router.push(this.fun.getUrl("identifyResultPlu",{show: 'person'}));
                }).catch(() => {});
            }else {
              // this.getMemberData();  插件不用这个接口
              this.step = 3;
            }
          } else {
            console.log(response.msg);
            
          }
        },
        response => {
           
        }
        );
    },
    getMemberData() {
      $http
        .post("plugin.yun-sign.frontend.h5.person.get-person-auth-info", {}, "...").then(response => {
          if (response.result === 1) {
            this.form.name = response.data.name;
            this.form.tel = response.data.tel;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          console.log(response.msg);
        }
        );
    },
    getPersonData() {
      $http
        .get("plugin.shop-esign.frontend.person.check-person-approve", {}, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
            if(this.person.status_code == '99') {
              this.$router.push(this.fun.getUrl("identifyResultPlu",{show: 'person'}));
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
        );
    },
    getAgreement() {
      $http
        .post("plugin.yun-sign.frontend.person.get-agreement").then(response => {
          if (response.result === 1) {
            this.agreement = response.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
        );
    },
    sureIdentify() {
      if(this.activeName == 2 && !this.bank_no) {
        Toast("请先填写银行卡");
        return;
      }
      let url = "";
      let json = {};
      const TIME_COUNT = 60;
      if (this.activeName == 1) {
        url = "plugin.shop-esign.frontend.person.auth-tel-v2";
        json = this.form;
      } else {
        url = "plugin.shop-esign.frontend.person.auth-bank-card-v2";
        this.form.bank_no = this.bank_no;
        json = this.form;
      }
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {
            Toast("已发送");
            this.flow_id = response.data.flow_id;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
        );
    },
    sendCode() {
      if(this.activeName == 2 && !this.bank_no) {
        Toast("请先填写银行卡");
        return;
      }

      if (this.activeName != 3 && !this.flow_id) {
        Toast("请先获取验证码");
        return;
      }

      if(this.activeName != 3 && !this.authcode) {
        Toast("请先填写验证码");
        return;
      }

      if (this.activeName == 3 && !this.form.face_auth_mode) {
        Toast("请先选择识别方式");
        return;
      }

      let url = "";
      let json = {};
      if (this.activeName == 1) {
        url = "plugin.shop-esign.frontend.person.check-tel-sms-code";
        json = {
          flow_id: this.flow_id,
          authcode: this.authcode
        };
      } else if (this.activeName == 2) {
        url = "plugin.shop-esign.frontend.person.check-bank-sms-code";
        this.form.bank_no = this.bank_no;
        json = {
          flow_id: this.flow_id,
          authcode: this.authcode
        };
      }else {
        url = "plugin.shop-esign.frontend.person.auth-face";
        json = {
          name: this.form.name,
          id_no: this.form.id_no,
          tel: this.form.tel,
          face_auth_mode: this.form.face_auth_mode,
          callback_url: ''
        };
      }
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {
            if (this.activeName == 3) {
              window.location.href = response.data.auth_url;
              return;
            }
            this.$dialog.alert({message:response.msg});
            if(response.data.auth_company == 1){
              this.$router.push(this.fun.getUrl("identifyResultPlu",{show: 'person'},{auth_company: 1}));
            }else {
              this.$router.push(this.fun.getUrl("identifyResultPlu",{show: 'person'}));
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
        );
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .form {
    background: #fff;
    height: 100vh;
  }

  .content {
    font-weight: bold;
  }

  .btn {
    margin: 40px auto 20px auto;
    color: #fff;
    width: 18.75rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
    border-radius: 20px;
  }

  .blue-txt {
    text-align: center;
    color: #377aff;
  }

  .link {
    color: #4784ff;
  }

  .disabled {
    background-image: linear-gradient(0deg, #d2d2d2 0%, rgba(210, 210, 210, 0.64) 100%) !important;
  }
</style>
