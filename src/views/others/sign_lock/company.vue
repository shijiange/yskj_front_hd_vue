<template>
  <div class="form">
    <c-title :hide="false" :text="'企业组织机构实名认证'">
    </c-title>
    <div class="agree-box" v-if="step === 1">
      <img style="width: 8rem; height: 8rem; margin: 1.5rem 1.5rem 1rem 1.5rem;" src="../../../assets/images/sign/yq_sign_renzheng@2x.png" alt="">
      <div style="padding: 10px;" v-html="agreement.auth_notice_desc"></div>
      <div style="display: inline-block; margin-top: 1rem;">
        <van-checkbox-group v-model="checkboxGroup" direction="horizontal" style="display: flex; font-size: 12px;">
          <van-checkbox name="1">我已阅读并同意</van-checkbox><span class="link" @click="protocolShow = true">《实名认证服务协议》</span>
        </van-checkbox-group>
      </div>
      <div class="btn" :class="[checkboxGroup.length >= 1?'':'disabled']" @click="toStep">开始认证</div>
    </div>
    <div class="content" v-if="step === 2">
      <p class="title">组织信息核验</p>
      <p class="person">经办人身份</p>
      <p class="title">法定代表人</p>
      <van-form @submit="onSubmit">
        <p class="gray">法定代表人信息</p>
        <van-field
          v-model="form.legal_name"
          name="姓名"
          label="姓名"
          placeholder="请填写法定代表人姓名"
          :rules="[{ required: true, message: '请填写法定代表人姓名' }]"
        />
        <van-field
          v-model="form.legal_idNo"
          name="身份证号"
          label="身份证号"
          placeholder="请填写身份证号"
          :rules="[{ required: true, message: '请填写身份证号' }]"
        />
        <p class="gray">组织机构信息</p>
        <van-field name="radio" label="证件号类型" :rules="[{ required: true, message: '请选择证件号类型' }]">
          <template #input>
            <van-radio-group v-model="form.org_type" direction="horizontal">
              <van-radio style="display: flex;" name="1">统一社会信用代码</van-radio>
              <!--<van-radio style="display: flex; margin-top: 4px;" name="2">工商注册号（部分个体户）</van-radio>-->
            </van-radio-group>
          </template>
        </van-field>
        <p style="color: #ff2424;">请务必按照营业执照显示选择！</p>
        <van-field
          v-model="form.name"
          name="公司名称"
          label="公司名称"
          placeholder="请填写公司名称"
          :rules="[{ required: true, message: '请填写公司名称' }]"
        />
        <van-field
          v-model="form.org_code"
          name="证件号"
          label="证件号"
          placeholder="请填写证件号"
          :rules="[{ required: true, message: '请填写证件号' }]"
        />
        <p class="person" style="margin-bottom: 10px;">上传营业执照</p>
        <van-uploader :after-read="onRead">
          <div
            style="width: 6rem; height: 6rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <img v-else :src="require('../../../assets/images/up_icon.png')"
                 style="width: 32%; height: 32%; opacity: 0.6;"
                 class="avatar"
            />
          </div>
        </van-uploader>
      </van-form>
    </div>
    <div class="btn" v-if="step === 2" @click="sureIdentify">提交</div>

    <van-popup v-model="show" round style="width: 70%; height: 35%;" :close-on-click-overlay="false">
      <div class="popBox">
        <img class="tips" src="../../../assets/images/sign/yq_sign_tip@2x.png" alt="">
        <p class="tip-title">为了保证组织机构实名认证有效性，请您在手机短信中点击《E签宝》发送的链接签署法定代表人授权书！然后再点击原芸签发送的合同链接完成合同签署！</p>
      </div>
    </van-popup>

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
      show: false,
      step: 1,
      checkboxGroup: [],
      protocolShow: false,
      agreement: {},
      CompanyData: {},
      form: {
        name: "",
        org_code: "",
        legal_name: "",
        legal_idNo: "",
        org_type: "1"
      },
      imageUrl: ""
    };
  },
  activated() {
    this.step = 1;
    this.getAgreement();
    this.checkCompanyData();
    this.checkboxGroup = [];
    this.form = {
      name: "",
      org_code: "",
      legal_name: "",
      legal_idNo: "",
      org_type: "1"
    };
  },
  methods: {
    onSubmit() {
      console.log('submit', this.form);
    },
    toStep() {
      if(this.checkboxGroup.length >= 1) {
        this.getCompanyData();
        this.step = 2;
      }else {
        this.$dialog.alert({message:'请先同意并勾选协议'});
      }
    },
    getAgreement() {
      $http
        .post("plugin.yun-contract-lock.frontend.company.get-agreement").then(response => {
          if (response.result === 1) {
            this.agreement = response.data;
          } else {
            console.log(response.msg);
          }
        },
        response => {
          console.log(response);
        }
        );
    },
    /*vant图片上传*/
    onRead(e) {
      this.imageUrl = URL.createObjectURL(e.file);
      this.form.file = e.file;
    },
    sureIdentify() {
      if(!this.form.legal_name) {
        Toast("请填写姓名");
        return;
      }

      if(!this.form.legal_idNo) {
        Toast("请填写身份证号");
        return;
      }

      if(!this.form.org_type) {
        Toast("请选择证件号类型");
        return;
      }

      if(!this.form.name) {
        Toast("请填写公司名称");
        return;
      }

      if(!this.form.org_code) {
        Toast("请填写证件号");
        return;
      }

      let fd = new FormData();
      fd.append("file", this.form.file); //第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      axios.post(this.fun.getRealUrl("plugin.yun-contract-lock.frontend.company.auth-company-v2",{
        name: this.form.name,
        org_code: this.form.org_code,
        legal_name: this.form.legal_name,
        legal_idNo: this.form.legal_idNo,
        org_type: this.form.org_type,
      }), fd, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(response => {
          let responseData = response.data;
          if (responseData.result == 1) {
            window.location.href = responseData.data.page_url;
          } else {
            this.$dialog.alert({message:responseData.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    checkCompanyData() {
      $http.get("plugin.yun-contract-lock.frontend.company.check-company-approve").then(response => {
        if (response.result === 1) {
          this.company = response.data;
          this.status = response.data.status;
          if(this.status == 'NO_INIT' || this.status == 'FAIL') {
            if (this.timer) {
              clearInterval(this.timer);
            }
          }else if(this.status == 'ING') {
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.checkCompanyData();
              }, 8000);
            }
          }else {
            if (this.timer) {
              clearInterval(this.timer);
            }
            this.$router.push(this.fun.getUrl("identifyResultLock",{show: 'company'}));
          }

        } else {
          if (this.timer) {
            clearInterval(this.timer);
          }
          // this.$message.error(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getCompanyData() {
      $http
        .post("plugin.yun-contract-lock.frontend.company.get-company-auth-info", {}, "...").then(response => {
          if (response.result === 1) {
            this.CompanyData = response.data;
            this.form.name = this.CompanyData.name;
            this.form.org_code = this.CompanyData.org_code;
            this.form.legal_name = this.CompanyData.legal_name;
            this.form.legal_idNo = this.CompanyData.legal_idNo;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        response => {
          console.log(response.msg);
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

    p {
      text-align: left;
      padding: 0.5rem 0 0.5rem 2rem;
    }

    .title {
      text-align: left;
    }

    .person {
      background-color: #fbfbfb;
      color: #666;
      width: 100%;
    }

    .gray {
      font-size: 12px;
      background-color: #fbfbfb;
      color: #666;
    }
  }

  .popBox {
    margin-top: 0.5rem;
    padding: 0 1rem;

    .tips {
      width: 4rem;
      height: 4rem;
      margin: 0.8rem 0;
    }
  }

  .btn {
    margin: 40px auto;
    color: #fff;
    width: 18.75rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
    border-radius: 20px;
  }

  .link {
    color: #4784ff;
  }

  .disabled {
    background-image: linear-gradient(0deg, #d2d2d2 0%, rgba(210, 210, 210, 0.64) 100%) !important;
  }

  .avatar {
    width: 100%;
    height: 100%;
  }
</style>
