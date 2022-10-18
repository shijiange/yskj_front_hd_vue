<template>
  <div id="apply">
    <c-title :hide="false" :text="'申请推广员'"> </c-title>
    <div class="topbox"></div>
    <div class="contenbox">
      <div class="conrt">
        <template v-if="application_audit_status == 2">
          <div class="headline">填写申请信息</div>
          <div class="inp" style="margin-bottom: 1.25rem;">
            <input type="text" name="" id="" placeholder="姓名" v-model="username" />
          </div>
          <div class="inp" style="margin-bottom: 2.38rem;">
            <input type="c" name="" id="" placeholder="手机" v-model="mobile" />
          </div>
          <div class="agreement">
            <i class="iconfont icon-all_select_active" @click="tapAgr" :class="[status ? 'iconsta' : '']"></i>
            我已详细阅读并同意《 <span @click="is_agreement = true">{{info.agreement_name}}</span>》
          </div>
          <div class="agreement" style="margin-top: 1rem;">
            若您的手机号未注册，将为你自动注册，注册或登录即代表您同 意我们的
            <span @click="is_agreement = true">《{{info.agreement_name}}》</span>
          </div>
          <div @click="submit" class="submit" style="margin-top: 1.44rem;">提交</div>
        </template>
        <template v-if="application_audit_status == 0">
          <div>提交成功，等待平台审核！</div>
          <div @click="goHome" class="submit" style="margin-top: 1.44rem;">知道了</div>
        </template>
        <template v-if="application_audit_status == 1">
          <div>您的推广员申请审核通过！</div>
          <div @click="goHome" class="submit" style="margin-top: 1.44rem;">知道了</div>
        </template>
      </div>
    </div>
    <template v-if="application_audit_status == 1 || application_audit_status == 0">
      <div class="agreementBox">
        <div class="agreement">
          <i class="iconfont icon-all_select_active" @click="tapAgr" :class="[status ? 'iconsta' : '']"></i>
          我已详细阅读并同意 <span class="textage" @click="is_agreement = true">《{{info.agreement_name}}》</span>
        </div>
        <div class="agreement">
          <i class="iconfont icon-all_select_active" @click="tapAgr" :class="[status ? 'iconsta' : '']"></i>
           <span class="textage" @click="toRecord"> {{info.my_answer_name}}记录></span>
        </div>
      </div>
      
    </template>
    <van-popup v-model="is_agreement">
      <div class="pop_agreement">
        <div style="margin-bottom: 1.19rem;">{{info.agreement_name}}</div>
        <div class="pop_conten" v-html="agreement"></div>
      </div>
      <div class="close_icon" @click="is_agreement = false">
        <i class="iconfont icon-adsystem_icon_cancle"></i>
      </div>
    </van-popup>
    <van-popup v-model="submit_status">
      <div class="success">
        <div style="font-size: 1.13rem; margin-bottom: 0.31rem;">提交成功</div>
        <div style="margin-bottom: 2rem; font-size: 0.75rem;"></div>
        <div class="confirm" @click="submit_status = false">知道了</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import apply_controller from './apply_controller';
export default apply_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
.pop_conten {
  img {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#apply {
  .iconsta {
    color: red;
  }

  .agreementBox {
    width: 100%;
    display: flex;
    // justify-self: center;
    // align-items: center;
    flex-direction: column;
    text-align: left;
    margin-left: 2.5rem;
    padding-top: 1rem;
    box-sizing: border-box;

    .agreement:first-child {
      margin-bottom: 0.5rem;
    }

    i {
      color: red;
    }

    .textage {
      color: red;
    }
  }

  .success {
    width: 18.75rem;
    height: 11rem;
    background-color: #fff;
    border-radius: 0.91rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.34rem 2.13rem 1.41rem 2.13rem;

    .confirm {
      width: 14.5rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 0.47rem;
      color: #fff;
      text-align: center;
      line-height: 2.5rem;
    }
  }

  .van-popup {
    background: transparent !important;
  }

  .close_icon {
    padding-top: 1rem;

    i {
      font-size: 2.78rem;
      color: #fff;
    }
  }

  .pop_agreement {
    width: 16.78rem;
    height: 14.75rem;
    background: #fff;
    border-radius: 0.31rem;
    padding: 1.75rem 1.41rem 0.5rem 1.16rem;
    display: flex;
    flex-direction: column;

    .pop_conten {
      flex: 1;
      overflow-y: scroll;
      text-align: left;

      img {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }

  .topbox {
    width: 100%;
    height: 5.72rem;
    background-color: #24d8a8;
    border-radius: 0 0 2.17rem 2.17rem;
  }

  .contenbox {
    margin: -3rem 0.94rem 0 0.94rem;

    .conrt {
      width: 100%;
      background-color: #fff;
      border-radius: 0.47rem;
      padding: 1.03rem 1.72rem 1.25rem 1.72rem;

      .submit {
        width: 18.13rem;
        height: 2.5rem;
        background-color: #f15353;
        border-radius: 0.47rem;
        text-align: center;
        line-height: 2.5rem;
        color: #fff;
      }

      .agreement {
        text-align: left;
        font-size: 0.75rem;
        color: #8b8b8b;

        span {
          color: #f15353;
        }
      }

      .headline {
        font-size: 1.13rem;
        color: #121212;
        line-height: 1.91rem;
        text-align: left;
        margin-bottom: 1.41rem;
      }

      .inp {
        width: 18.13rem;
        height: 2.5rem;
        background-color: #f6f6f6;
        border-radius: 0.47rem;

        input {
          width: 100%;
          height: 100%;
          background: none;
          outline: none;
          border: none;
          text-indent: 0.91rem;
          color: #9f9f9f;
        }
      }
    }
  }
}
</style>