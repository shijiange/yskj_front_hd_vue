<template>
  <div class="result">
    <c-title :hide="false" :text="show == 'person'?'个人认证结果':'企业认证结果'">
    </c-title>
    <!--个人认证通过-->
    <div class="content" v-if="show == 'person' && person.status == 'SUCCESS'">
      <img class="img" src="../../../assets/images/yht_success@2x.png" alt="">
      <p style="font-weight: bold;">您本次的个人认证已通过</p>
      <div class="btn-box">
        <div class="btn" style="width: 80%;" @click="toSign(1)">继续企业认证</div>
        <div class="btn" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;"
             @click="toSign('home')">返回合同列表
        </div>
        <p style="margin: 0.5rem 1rem; text-align: left; font-weight: bold;">1、如果您是 <span class="phone">企业身份</span>签署合同，请点击“继续企业认证”；</p>
        <p style="margin: 0.5rem 1rem; text-align: left; font-weight: bold;">2、如果您是 <span class="phone">个人身份</span>签署合同，请点击“返回合同列表”进入指定合同详情完成签署！</p>
        <!--<div class="btn-item" style="margin-right: 0.8rem;">-->
          <!--<img src="../../../assets/images/yht_behalf@2x.png" alt="">-->
          <!--<p style="margin: 0.8rem 0 3rem;">如果您是公司法定代表人，需要进行企业认证。</p>-->
          <!--<div class="btn" style="width: 80%;" @click="toSign(1)">企业认证</div>-->
        <!--</div>-->
        <!--<div class="btn-item">-->
          <!--<img src="../../../assets/images/yht_staff@2x.png" alt="">-->
          <!--<p style="margin: 0.5rem 0 0;">如果您是公司员工，请联系公司法定代表人，在本系统中把你添加为企业员工。</p>-->
          <!--<div class="btn" style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;"-->
               <!--@click="toSign('home')">返回合同列表-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <!--个人认证通过end-->

    <!--个人认证失败-->
    <div class="content" v-if="show == 'person'&& person.status == 'FAIL'">
      <img class="img" src="../../../assets/images/yht_failed@2x.png" alt="">
      <p style="font-weight: bold;">您本次的个人认证未通过</p>
      <p style="font-size: 13px; margin-top: 0.4rem;">请核对信息后继续认证</p>
    </div>
    <div class="btn" @click="toSign" v-if="show == 'person'&& person.status == 'FAIL'">进行个人认证</div>
    <!--个人认证失败end-->

    <!--个人认证审核-->
    <div class="content" v-if="show == 'person'&& person.status == 'ING'">
      <img class="img" src="../../../assets/images/yht_checked@2x.png" alt="">
      <p>您本次的个人认证信息正在审核</p>
    </div>
    <!--个人认证审核end-->

    <!--未认证-->
    <div class="content" v-if="noIdentify">
      <img class="img" src="../../../assets/images/yht_failed@2x.png" alt="">
      <p style="font-weight: bold;">您未通过个人认证</p>
    </div>
    <div class="btn" @click="toSign" v-if="noIdentify">进行个人认证</div>
    <!--未认证end-->

    <!--企业认证通过-->
    <div class="content" v-if="show == 'company' && company.status == 'SUCCESS'">
      <img class="img" src="../../../assets/images/yht_success@2x.png" alt="">
      <p>您本次的企业认证已经通过</p>
    </div>
    <div class="btn" v-if="show == 'company' && company.status == 'SUCCESS'"
         style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表继续签署合同
    </div>
    <!--企业认证通过end-->

    <!--企业认证失败-->
    <div class="content" v-if="show == 'company'&& company.status == 'FAIL'">
      <img class="img" src="../../../assets/images/yht_failed@2x.png" alt="">
      <p>您本次的企业认证未通过， <br/>请核对信息后继续认证。</p>
    </div>
    <div class="btn" @click="toSign(1)" v-if="show == 'company'&& company.status == 'FAIL'">进行企业认证</div>
    <!--企业认证失败end-->

    <!--企业认证审核-->
    <div class="content" v-if="show == 'company'&& company.status == 'ING'">
      <img class="img" src="../../../assets/images/yht_checked@2x.png" alt="">
      <p>您本次的企业认证信息正在审核 <br/>如有疑问，请联系 <a :href="'tel:'+ company.contact_tel" class="phone">{{company.contact_tel}}</a>
      </p>
    </div>
    <div class="btn" v-if="show == 'company'&& company.status == 'ING'"
         style="width: 80%; color: #377aff; background: #fff; border: 1px solid #377aff;" @click="toSign('home')">返回合同列表继续签署合同
    </div>
    <!--企业认证审核end-->
  </div>
</template>

<script>
import cTitle from "components/title";
// import { Toast } from 'vant';

export default {
  data() {
    return {
      timer: null,
      show: "",
      company: {},
      person: {},
      noIdentify: false
    };
  },
  activated() {
    this.show = this.$route.params.show;
    this.noIdentify = false;
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (this.show == "company") {
      this.getCompanyData();
    } else {
      this.getPersonData();
    }
  },
  methods: {
    toSign(str) {
      if (str == 1) {
        this.$router.push(this.fun.getUrl("signCompanyLock"));
      } else if (str == "home") {
        this.$router.push(this.fun.getUrl("contractListLock"));
      } else {
        this.$router.push(this.fun.getUrl("personBankLock"));
      }
    },
    getPersonData() {
      $http
        .get("plugin.yun-contract-lock.frontend.person.check-person-approve", {}, "...").then(response => {
          if (response.result === 1) {
            this.person = response.data;
          } else {
            this.noIdentify = true;
            // Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
        );
    },
    getCompanyData() {
      $http.get("plugin.yun-contract-lock.frontend.company.check-company-approve").then(response => {
        if (response.result === 1) {
          this.company = response.data;
          this.status = response.data.status;
          if (this.status == "NO_INIT") {
            if (this.timer) {
              clearInterval(this.timer);
            }
          } else if (this.status == "ING") {
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getCompanyData();
              }, 30000);
            }
          } else {
            if (this.timer) {
              clearInterval(this.timer);
            }
            setTimeout(()=>{
              this.$router.push(this.fun.getUrl("contractListLock"));
            },3000);
          }

        } else {
          // this.$message.error(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .result {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 50px;
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
    /* display: flex; */
    margin: 1rem;
    font-size: 15px;

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
