<template>
  <div class="result">
    <c-title :hide="false" :text="show == 'person'?'个人认证结果':'企业认证结果'">
    </c-title>
    <!--个人认证通过  企业-->
    <div class="content" v-if="show == 'person' && person.status == 'SUCCESS'">
      <img class="img" src="../../../assets/images/yht_success@2x.png" alt="">
      <p style="font-weight: bold;">您本次的个人认证已通过</p>
      <div class="btn-box">
        <div class="btn-item">
          <!--<img src="../../../assets/images/yht_behalf@2x.png" alt="">-->
          <p style="margin: 0.8rem 0 3rem;">如果您是公司法定代表人，需要进行企业认证。</p>
          <div class="btn" style="width: 80%;" @click="toSign(1)">企业认证</div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表</div>
      </div>
    </div>
    <!--个人认证通过end-->

    <!--个人认证通过   个人-->
    <div class="content" v-if="show == 'person' && person.status == 'SUCCESSFUL'">
      <img class="img" src="../../../assets/images/yht_success@2x.png" alt="">
      <p style="font-weight: bold;">您本次的个人认证已通过</p>
      <div class="btn-box">
        <div class="btn-item">
          <!--<img src="../../../assets/images/yht_behalf@2x.png" alt="">-->
          <p style="margin: 0.8rem 0 3rem;">如果您是公司法定代表人，需要进行企业认证。</p>
          <div class="btn" style="width: 80%;" @click="toSign(1)">企业认证</div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表</div>
      </div>
    </div>
    <!--个人认证通过  end-->

    <!--个人认证失败-->
    <div class="content" v-if="show == 'person'&& (person.status == 'FAIL' || person.status == 'ING')">
      <img class="img" src="../../../assets/images/yht_failed@2x.png" alt="">
      <p style="font-weight: bold;">您本次的个人认证未通过</p> <p style="font-size: 13px; margin-top: 0.4rem;">请核对信息后继续认证</p>
    </div>
    <div class="btn" @click="toSign()" v-if="show == 'person'&& person.status == 'FAIL'">进行个人认证</div>
    <!--个人认证失败end-->

    <!--企业认证通过-->
    <div class="content" v-if="show == 'company' && company.status_code == '99'">
      <img class="img" src="../../../assets/images/yht_success@2x.png" alt="">
      <p>您本次的企业认证已经通过</p>
    </div>
    <div class="btn" v-if="show == 'company' && company.status_code == '99'" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表</div>
    <!--企业认证通过end-->

    <!--企业认证失败-->
    <div class="content" v-if="show == 'company'&& company.status_code == '-1'">
      <img class="img" src="../../../assets/images/yht_failed@2x.png" alt="">
      <p>您本次的企业认证未通过， <br/>请核对信息后继续认证。</p>
    </div>
    <div class="btn" @click="toSign(1)" v-if="show == 'company'&& company.status_code == '-1'">进行企业认证</div>
    <!--企业认证失败end-->

    <!--企业认证审核-->
    <div class="content" v-if="show == 'company'&& company.status_code == '1'">
      <img class="img" src="../../../assets/images/yht_checked@2x.png" alt="">
      <p>您本次的企业认证信息正在审核 <br/>如有疑问，请联系 <a :href="'tel:'+ company.contact_tel" class="phone">{{company.contact_tel}}</a>
      </p>
    </div>
    <div class="btn" v-if="show == 'company'&& company.status_code == '1'" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表</div>
    <!--企业认证审核end-->
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      timer: null,
      show: '',
      company: {},
      person: {},

      flow_id: "",
      face_flow_id: "",

      isMinApp: false,
    };
  },
  activated() {
    this.show = this.$route.params.show;
    this.flow_id = "";
    this.face_flow_id = "";
    if (this.timer) {
      clearInterval(this.timer);
    }
    if(this.fun.getKey('isMinApp') == 1) {
      this.isMinApp = true;
    }
    if (this.show == "company") {
      if(this.isMinApp) {
        // 小程序端跳转对应页面
        wx.miniProgram.redirectTo({ url: `/packageH/signIndexPlu/identifyResult/identifyResult?show=company` });
      }else {
        this.getCompanyData();
      }
    } else {

      if(this.isMinApp) {
        // 小程序端跳转对应页面
        wx.miniProgram.redirectTo({ url: `/packageH/signIndexPlu/identifyResult/identifyResult?show=person` });
      }else {
        if(this.$route.query.auth_company == 1) {
          this.person = {
            status: 'SUCCESSFUL'
          };
        }else {
          this.checkPerson();
        }
      }
    }
  },
  methods: {
    toSign(str) {
      if (str == 1) {
        this.$router.push(this.fun.getUrl("signCompanyPlu"));
      }else if (str == 'home') {
        this.$router.push(this.fun.getUrl("contractListPlu"));
      } else {
        this.$router.push(this.fun.getUrl("personBankPlu"));
      }
    },
    checkPerson() {
      $http.get("plugin.shop-esign.frontend.person.get-person-info", {}, "...").then(response => {
        if (response.result === 1 && response.data.info) {
          if(response.data.info.status == 1) {
            this.person = {
              status: 'SUCCESS'
            };
          }else {
            if(response.data.info.has_face == 1) {
              this.face_flow_id = response.data.info.face_flow_id;
              this.flow_id = response.data.info.flow_id;
              this.checkResult();
            }else {
              this.getPersonData();
            }
          }
        }else {
          this.person = {
            status: 'FAIL'
          };
        }
      },
      response => {
        this.$dialog.alert(response.msg);
      }
      );
    },
    checkResult() {
      $http
        .get("plugin.shop-esign.frontend.person.auth-face-result", {flow_id: this.flow_id, face_flow_id: this.face_flow_id}, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
          } else {
            this.person = {
              status: 'FAIL'
            };
          }
        },
        response => {
          this.$dialog.alert(response.msg);
        }
        );
    },
    getPersonData() {
      $http
        .get("plugin.shop-esign.frontend.person.check-person-approve", {}, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
            if(this.person.status_code == '99') {
              this.person = {
                status: 'SUCCESS'
              };
            }else {
              this.person = {
                status: 'FAIL'
              };
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert(response.msg);
        }
        );
    },
    getCompanyData() {
      $http.get("plugin.shop-esign.frontend.company.check-company-approve").then(response => {
        if (response.result === 1) {
          this.company = response.data;
          if(this.company.status_code == '1') {
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getCompanyData();
              }, 30000);
            }
          }else {
            if (this.timer) {
              clearInterval(this.timer);
            }
            setTimeout(()=>{
              this.$router.push(this.fun.getUrl("contractListPlu"));
            },3000);
          }

        } else {
          // this.$message.error(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .result {
    background: #fff;
    height: 100vh;
  }

  .img {
    width: 12rem;
    height: 12rem;
    margin: 40px auto;
  }

  .btn {
    margin: 20px auto;
    color: #fff;
    width: 18.75rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
    border-radius: 20px;
  }

  .phone {
    color: #0655fe;
  }

  .btn-box {
    display: flex;
    margin: 1rem;
    font-size: 13px;

    .btn-item {
      padding: 0.5rem 0.3rem;
      flex: 1;
      background-color: #f9fbff;
      border-radius: 10px;

      img {
        width: 4rem;
        height: 4rem;
      }
    }
  }
</style>
