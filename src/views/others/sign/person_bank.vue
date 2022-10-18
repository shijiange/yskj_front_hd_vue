<template>
  <div class="form">
    <!--<c-title :hide="false" :text="showPhone? '个人手机号认证':'个人银行卡号认证'">-->
    <!--</c-title>-->
    <!--<div style="height: 40px"></div>-->
    <div class="agree-box" v-if="step === 1">
      <img style="width: 8rem; height: 8rem; margin: 1.5rem 1.5rem 1rem 1.5rem;" src="../../../assets/images/sign/yq_sign_renzheng@2x.png" alt="">
      <div style="padding: 10px;" v-html="is_real_name ? '当前业务需要实名认证' : agreement.auth_notice_desc"></div>

      <div style="display: inline-block; margin-top: 1rem;">
        <van-checkbox-group v-model="checkboxGroup" direction="horizontal" class="reset-check">
          <template v-if="is_real_name">
            <van-checkbox name="1">
              <p style="margin-left: 8px;">我同意服务提供者及【{{shop_name}}】使用并传送相关数据于身份核验，查看<span class="link" @click="realNameProtocolShow = true">《实名认证服务协议》</span>及<span class="link" @click="protocolShow = true">{{agreement.title}}</span>，我承诺仅为合法交易使用本服务！</p>
            </van-checkbox>
          </template>
          <template v-else>
            <van-checkbox name="1">我已阅读并同意</van-checkbox><span class="link" style="line-height: 20px;" @click="protocolShow = true">《实名认证服务协议》</span>
          </template>
        </van-checkbox-group>
      </div>
      <div class="btn" :class="[checkboxGroup.length >= 1 || (is_real_name && agreement.status != 1)?'':'disabled']" @click="getMemberData">开始认证</div>
    </div>

    <div class="content" v-if="step === 2 || step === 3">
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
            <van-radio-group v-model="activeName" direction="horizontal" v-if="!is_real_name">
              <van-radio style="display: flex;" name="1" v-if="agreement.is_auth_tel == 1">手机号认证</van-radio>
              <van-radio style="display: flex;" name="2" v-if="agreement.is_auth_bank == 1">银行卡认证</van-radio>
              <van-radio style="display: flex; margin-top: 10px;" name="3" v-if="agreement.is_auth_face == 1">人脸识别认证
              </van-radio>
            </van-radio-group>
            <van-radio-group v-model="activeName" direction="horizontal" v-if="is_real_name && real_name_auth_set && real_name_auth_set.auth_type">
              <van-radio style="display: flex;" name="1" v-if="real_name_auth_set.auth_type.indexOf('2') > -1">手机号认证</van-radio>
              <van-radio style="display: flex;" name="2" v-if="real_name_auth_set.auth_type.indexOf('3') > -1">银行卡认证</van-radio>
              <van-radio style="display: flex; margin-top: 10px;" name="3" v-if="real_name_auth_set.auth_type.indexOf('1') > -1">人脸识别认证
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field name="radio" label="使用该手机号作为会员登录账号" v-if="is_real_name && is_bind_mobile!=1"  style="display: flex; align-items: center;">
          <template #input>
            <van-radio-group v-model="is_mobile" direction="horizontal">
              <van-radio style="display: flex;" :name="1">是</van-radio>
              <van-radio style="display: flex;" :name="0">否</van-radio>
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
        <div class="inputBox" v-if="step === 3 && (activeName=='1' || activeName=='2') && imgcode">
          <em class="name">验证码</em>
          <input type="text" placeholder="请输入图形验证码" id="code" v-model="form.captcha" />
          <img class="getcodeImg" style="width: 100%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" />
        </div>
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
              <van-radio style="display: flex;" name="1" v-if="fun.getTyep() != 1">支付宝人脸识别</van-radio>
              <van-radio style="display: flex; margin-top: 10px;" name="2">腾讯云人脸识别</van-radio>
            </van-radio-group>
          </template>
        </van-field>

      </van-form>

      <div class="btn" @click="toStep" v-if="step === 2">进行认证</div>
      <div class="btn" @click="sendCode" v-if="step === 3">立即认证</div>
    </div>

    <signButton v-if="is_real_name && real_name_auth_set.auth_scene && real_name_auth_set.auth_scene.indexOf('1') < 0" :shoSign="false"></signButton>

    <van-popup :overlay="false" v-model="protocolShow" position="right" style="width: 100%; height: 100%;">
      <div class="protocolcontent">
        <van-nav-bar
          :title="is_real_name ?  agreement.title : '实名认证服务协议'"
          left-text="返回"
          right-text=""
          left-arrow
          @click-left="protocolShow = false"
          style="position: sticky; top: 0;"
        />
        <div id="a_content" style="padding: 10px;" v-html="is_real_name ? agreement.content : agreement.auth_agreement_desc">
        </div>
      </div>
    </van-popup>

    <van-popup :overlay="false" v-model="realNameProtocolShow" position="right" style="width: 100%; height: 100%;">
      <div class="protocolcontent">
        <van-nav-bar
          title="实名认证服务协议"
          left-text="返回"
          right-text=""
          left-arrow
          @click-left="realNameProtocolShow = false"
          style="position: sticky; top: 0;"
        />
        <div id="a_content" style="padding: 10px;" v-html="real_name_auth_set.content">
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import signButton from "./component/sign_button";
import { Toast } from 'vant';

export default {
  data() {
    return {
      activeName: '',
      step: 1,
      checkboxGroup: [],
      protocolShow: false,
      agreement: {},
      // showPhone: false,
      form: {
        name: "",
        id_no: "",
        tel: "",
        captcha: "",
        face_auth_mode: ''
      },
      authcode: "",
      bank_no: "",
      flow_id: "",
      count: "",
      timer: null,
      imgcode: "", //图形验证码

      is_real_name: false,
      real_name_auth_set: {},
      shop_name: '',
      realNameProtocolShow: false,
      is_bind_mobile: 0,
      is_mobile: 1
    };
  },
  activated() {
    this.step = 1;
    this.checkboxGroup = [];
    this.clear();
    // this.showPhone = true;
    if(this.$route.query.from === 'bindRealName') {
      this.is_real_name = true;
      this.getimgdata();
      this.getAuth();
    }else {
      this.getPersonData();
      this.getAgreement();
    }
  },
  deactivated() {
    if (this.timer) {
      this.timer = null;
      clearInterval(this.timer);
    }
  },
  methods: {
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          if (res.data.captcha.status && res.data.captcha.status == "0") {
            this.imgcode = "";
          }
          if (res.data.captcha.img) {
            this.imgcode = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAuth() {
      $http
        .post("plugin.real-name-auth.frontend.auth.index", {}, "...").then(response => {
          if (response.result === 1) {
            this.fun.setWXTitle('个人认证');
            this.real_name_auth_set = response.data.real_name_auth_set || {};
            this.agreement = response.data.protocol_set;
            this.shop_name = response.data.shop_name;
            this.is_bind_mobile = response.data.is_bind_mobile;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    },
    sureAuthIdentify() {
      let url = "";
      let json = {};
      const TIME_COUNT = 60;
      if(this.is_bind_mobile != 1) {
        this.form.is_mobile = this.is_mobile;
      }
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填写图形验证码");
        return;
      }

      if (this.activeName == 1) {
        url = "plugin.real-name-auth.frontend.auth.authTel";
        json = this.form;
      } else if (this.activeName == 2) {
        url = "plugin.real-name-auth.frontend.auth.authBank";
        this.form.bank_no = this.bank_no;
        json = this.form;
      }
      $http.post(url, json, "...").then(response => {
        if (response.result === 1) {
          Toast("已发送");
          this.flow_id = response.data.flowId;
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
      });
    },
    sendAuthCode() {
      let url = "";
      let json = {};
      if (this.activeName == 1) {
        url = "plugin.real-name-auth.frontend.auth.telSms";
        json = {
          flow_id: this.flow_id,
          code: this.authcode
        };
      } else if (this.activeName == 2) {
        url = "plugin.real-name-auth.frontend.auth.bankSms";
        this.form.bank_no = this.bank_no;
        json = {
          flow_id: this.flow_id,
          code: this.authcode
        };
      }else {
        url = "plugin.real-name-auth.frontend.auth.authFace";
        let call_url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/others/integral_shop?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid() + '&url=' + this.$store.state.callback_url;
        json = {
          name: this.form.name,
          id_no: this.form.id_no,
          tel: this.form.tel,
          face_auth_mode: this.form.face_auth_mode == 1 ? 'ZHIMACREDIT' : 'TENCENT',
          callback_url: call_url
        };
      }

      if(this.is_bind_mobile != 1) {
        json.is_mobile = this.is_mobile;
      }
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {
            if (this.activeName == 3) {
              window.location.href = response.data.originalUrl;
            }else {
              Toast('认证成功');
              if (this.$store.state.callback_url) {
                window.location.href = this.$store.state.callback_url;
              } else {
                this.$router.push(this.fun.getUrl("home"));
              }
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    },
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

      this.is_real_name = false;
      this.real_name_auth_set = {};
      this.shop_name = "";
      this.realNameProtocolShow = false;
      this.is_bind_mobile = 0;
      this.is_mobile = 1;
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

      if(this.is_real_name) {
        // 跳转过来的实名认证
        this.step = 3;
      }else {
        this.checkPersonData();
      }
    },
    onSubmit() {
      console.log("submit", this.form);
    },
    getMemberData() {
      if(this.checkboxGroup.length <= 0 && (!this.is_real_name || this.agreement.status == 1)) {
        return;
      }
      if(this.is_real_name) {
        // 跳转过来的实名认证
        this.step = 2;
        return;
      }
      $http
        .post("plugin.yun-sign.frontend.h5.person.get-person-auth-info", {}, "...").then(response => {
          this.step = 2;
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
    checkPersonData() {
      $http
        .get("plugin.yun-sign.frontend.person.check-person-approve-by-idNo", {
          name: this.form.name,
          idNo: this.form.id_no,
          tel: this.form.tel,
        }, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
            if(response.data.status_code === 99) {
              this.$dialog.alert({ message: '您在认证中心已经完成认证，无需重复认证'})
                .then(() => {
                  this.$router.push(this.fun.getUrl("identifyResult",{show: 'person'}));
                });
            }else {
              this.step = 3;
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    },
    getPersonData() {
      $http
        .get("plugin.yun-sign.frontend.h5.person.check-person-approve", {}, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
            if(this.person.status == 'SUCCESS') {
              this.$router.push(this.fun.getUrl("identifyResult",{show: 'person'}));
            }
          } else {
            console.log(response.msg);
          }
        });
    },
    getAgreement() {
      $http
        .post("plugin.yun-sign.frontend.person.get-agreement").then(response => {
          if (response.result === 1) {
            this.agreement = response.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    },
    sureIdentify() {
      if(this.activeName == 2 && !this.bank_no) {
        Toast("请先填写银行卡");
        return;
      }
      if(this.is_real_name) {
        // 跳转过来的实名认证
        this.sureAuthIdentify();
        return;
      }
      let url = "";
      let json = {};
      const TIME_COUNT = 60;
      if (this.activeName == 1) {
        url = "plugin.yun-sign.frontend.h5.person.auth-tel-v2";
        json = this.form;
      } else if (this.activeName == 2) {
        url = "plugin.yun-sign.frontend.h5.person.auth-bank-card-v2";
        this.form.bank_no = this.bank_no;
        json = this.form;
      }
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {
            Toast("已发送");
            this.flow_id = response.data.data.flowId;
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
        });
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

      if(this.is_real_name) {
        // 跳转过来的实名认证
        this.sendAuthCode();
        return;
      }

      let url = "";
      let json = {};
      if (this.activeName == 1) {
        url = "plugin.yun-sign.frontend.person.check-tel-sms-code";
        json = {
          flow_id: this.flow_id,
          authcode: this.authcode
        };
      } else if (this.activeName == 2) {
        url = "plugin.yun-sign.frontend.person.check-bank-sms-code";
        this.form.bank_no = this.bank_no;
        json = {
          flow_id: this.flow_id,
          authcode: this.authcode
        };
      }else {
        url = "plugin.yun-sign.frontend.h5.person.auth-face-v2";
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
              window.location.href = response.data.data.authUrl;
            }else {
              this.$dialog.alert({message:response.msg});
              this.$router.push(this.fun.getUrl("identifyResult",{show: 'person'}));
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    }
  },
  components: { signButton }
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

  .reset-check {
    display: flex;
    font-size: 12px;
    justify-content: center;
    text-align: left;
    padding: 0 10px;
  }

  .inputBox {
    height: 2.625rem;
    line-height: 2.625rem;
    display: flex;
    border-bottom: 0.0625rem solid #ebebeb;
    text-align: left;
    align-items: center;
    margin-top: 0.625rem;

    .name {
      flex: 0 0 4.6rem;
      margin-right: 12px;
      color: #646566;
      font-weight: bold;
      text-align: center;
    }

    input {
      width: 9rem;
      border: none;
    }

    .getcodeImg {
      display: inline-block;
      height: 1.25rem;
      line-height: 1.25rem;
      flex: 1;
    }
  }
</style>
