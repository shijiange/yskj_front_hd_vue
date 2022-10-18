<template>
  <div id="contract">
    <van-nav-bar
      :title="contract_info.contract_doc_name"
      left-text="返回"
      right-text="更多"
      left-arrow :fixed="true"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-show="!signSuccess && !signWait"
      :style="{width : fun.getPhoneEnv() == 3 ?'375px':'',left : fun.getPhoneEnv() == 3 ?'50%':'',transform : fun.getPhoneEnv() == 3 ?'translateX(-50%)':''}"
    />
    <div style="height: 46px;"></div>
    <div v-show="!showPage">
      <loading :show="true"></loading>
    </div>
    <div v-if="showPage">
      <div class="fixed-box1" v-if="showMore">
        <div class="triangle"></div>
        <div class="item" @click="toMission">
          <i class="iconfont icon-yq_massage"></i><span>任务信息</span>
        </div>
      </div>
      <div class="fixed-num" v-if="!signSuccess && !signWait && fun.getPhoneEnv() != 3">
        {{current_page}}/{{page_count}}
      </div>
      <img class="fixed-top" v-if="!signSuccess && !signWait && showFixed && lastdeltaY != minY" @click="toTop" src="../../../assets/images/sign/yq_page_pre@2x.png" alt="">
      <img class="fixed-bottom" v-if="!signSuccess && !signWait && showFixed && lastdeltaY != -maxY" @click="toBottom" src="../../../assets/images/sign/yq_page_next@2x.png" alt="">

      <div id="inHtml" ref="pdfBox" v-if="!signSuccess && !signWait">
        <div class="pdf-container">
          <div class="pdf-box" :style="{width : fun.getPhoneEnv() == 3 ?'375px':'',margin : fun.getPhoneEnv() == 3 ?'0 auto':''}">
            <div class="pdfPage_1yRne" v-for="page in contract_doc_imgs" :key="page.page">
              <img :src="page.imgData" class="pdf-item" :id="'the-canvas'+page.page" alt="">
              <!--<canvas class="pdf-item" :id="'the-canvas'+page"></canvas>-->
              <div @click="clearAll" class="dragLayer_3ccsq" :id="'can'+ page.page"></div>
            </div>
          </div>
          <div class="componentSign">
            <p class="sealCompInfo_3v9iQ"><span class="need">*</span><span><span>甲方</span><em>(<span>签署区</span>)</em></span></p><div class="itemConentStyle_2MWEL"><div class="infoMsg_3NkPg">签署区</div><i class="iconfont icon-pm_auction_success"></i></div>
            <div class="bubble top"><div id="field-change" class="bubble-item">换章</div></div>
          </div>
        </div>
      </div>

      <div style="transform: translate(0) !important;">
        <div class="statusIng" v-if="signWait">
          <img src="../../../assets/images/sign/yq_sign_file@2x.png" alt="">
          <div v-if="signFail">
            <p style="font-weight: bold; font-size: 15px; margin: 1rem 0;">签署失败</p>
            <div class="btn2" style="width: 80%; margin: 2.25rem auto;" @click="toReload">重新签署</div>
          </div>
          <div v-else>
            <p style="font-weight: bold; font-size: 15px; margin: 1rem 0;">签署中</p>
            <span style="color: #999;">请耐心等候...</span>
          </div>
        </div>
        <div class="statusSuccess" v-if="signSuccess">
          <img src="../../../assets/images/sign/yq_sign_success@2x.png" alt="">
          <p style="font-weight: bold; font-size: 15px; margin: 1rem 0;">签署成功</p>
          <!--<span class="tips">芸签免费为该合同提供存证服务，文件签署完成后，您可通过芸签电子合同管理平台（e.yunqiankeji.com）查询！</span>-->
          <div class="btn2" style="width: 80%; margin: 2.25rem auto;" @click="toReload">查看文件</div>
          <div class="btn3" style="width: 80%; margin: 0 auto;" @click="toList">返回列表</div>
        </div>

        <signButton v-if="signSuccess || signWait" style="margin-top: 30px; transform: translateX(23%) !important;" :signIndex="'signIndexPlu'"></signButton>
      </div>


      <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
           v-show="can_sign == 1 && is_cc != 1 && contract_info.status < 2 && sign_status != 1 && !signSuccess && !signWait">
        <div style="flex: 1; text-align: left; display: flex; align-items: center;" @click="toShowContent">
          <i class="iconfont icon-yq_gaizhang"></i><span style="color: #ff2c29; width: 8rem;">点这里盖章</span>
        </div>
        <p class="sure" @click="tapIN">提交</p>
      </div>
      <div v-if="sign_status == 1 && contract_info.status < 2" class="status-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">已签署</div>
      <div v-if="contract_info.status == 2" class="status-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">已完成</div>
      <div v-if="contract_info.status == 3" class="status-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">已撤回</div>
      <div v-if="contract_info.status == 4" class="status-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">已超时</div>
    </div>

    <van-popup v-model="showContent" round position="bottom" :style="{ height: '50%' }">
      <div class="noIdentify" v-if="auth_status != 1">
        <p class="title">完成企业/本人实名认证，获取专属印章</p>
        <div class="btn2" style="width: 80%; margin: 2.25rem auto;" @click="toIdentify">去实名</div>
      </div>
    </van-popup>

    <div class="Identify">
      <div v-if="seals_info">
        <p style="font-size: 15px; font-weight: bold;">个人印章</p>
        <div class="seal-box">
          <div @click.stop="signPic" class="seal-item" :id="seals_info.id"
               :style="{backgroundImage: 'url(' + seals_info.seal_url + ')'}"></div>
        </div>
      </div>
      <!--<div style="padding-top: 0.5rem;border-top: 1px solid #eeeeee">-->
        <!--<van-checkbox v-model="checked">一键落章</van-checkbox>-->
        <!--<p class="tips">请点击印章，将印章置于合同对应位置！</p>-->
      <!--</div>-->
    </div>

    <van-popup
      v-model="showSign"
      round style="border-radius: 1rem;"
    >
      <div class="showBox">
        <div class="popTitle">填写验证码</div>
        <div class="popInp">
          <div class="popPhone">
            <van-field v-model="mobile" clearable placeholder="输入手机号"/>
          </div>
          <div class="popAnswer">
            <van-field
              v-model="code"
              center
              clearable
              placeholder="请输入验证码"
            >
              <van-button slot="button" size="small" round plain type="info" @click="sendCode" v-show="this.count<= 0">
                获取验证码
              </van-button>
              <van-button slot="button" size="small" round plain type="info" disabled v-show="this.count> 0">
                {{count}}秒后重新获取
              </van-button>
            </van-field>
          </div>
          <div class="btn2" @click="companySign">确定签署</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="showPhone"
      round style="border-radius: 1rem;"
    >
      <div class="showBox">
        <p style="padding: 0.5rem; font-weight: bold;">客服二维码</p>
        <img style="width: 12rem; height: 12rem; margin: 0 0.5rem 0.5rem;" :src="site.ercode_img" alt="">
      </div>
    </van-popup>
  </div>
</template>

<script>
  import sign_page_controller from "./sign_page_controller";

  export default sign_page_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #inHtml {
    position: absolute;
    left: 0;
    width: 100%;

    /* border: 1px solid red; */
    .arrow {
      padding-top: 1rem;
      display: flex;
    }

    p {
      flex: 1;
    }

    .link {
      flex: 1;
    }

    .pdfPage_1yRne {
      position: relative;
    }

    .dragLayer_3ccsq {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    .pdf-item {
      width: 100%;
    }
  }

  .componentSign {
    display: none;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 5.5rem;
    height: 5.5rem;
    padding: 0 10px;
    border: 1px dashed rgba(0, 0, 0, 0.3);
    background: hsla(0, 0%, 100%, 0.85);
    font-size: 12px;
    position: absolute;
    top: 95px;
    left: 56px;
  }

  .bubble {
    display: none;
    background: transparent;
    left: 50%;
    top: -55%;
    width: 100%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    position: absolute;
    z-index: 3;
    height: 1rem;
    align-items: center;
  }

  .bubble.top::before {
    content: "";
    width: 0;
    height: 0;
    border-top: 0.4rem solid grey;
    border-left: 0.4rem solid transparent;
    border-right: 0.4rem solid transparent;
    position: absolute;
    bottom: -13px;
    left: 50%;
    transform: translateX(-50%);
  }

  .bubble-item {
    background: grey;
    height: 1.5rem;
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sealCompInfo_3v9iQ {
    min-width: 100%;
    position: absolute;
    height: 20px;
    top: -21px;
    left: -1px;
    padding: 2px 8px;
    white-space: nowrap;
    text-align: center;
    color: #fff;
    font-size: 12px;
    background: rgba(92, 162, 232, 0.6);
    z-index: 6;
    display: flex;

    .need {
      font-size: 16px;
      margin-top: 2px;
      margin-right: 4px;
      display: none;
    }
  }

  .itemConentStyle_2MWEL {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .infoMsg_3NkPg {
    position: absolute;
    top: 35px;
    width: 100%;
    text-align: center;
  }

  .icon-pm_auction_success {
    color: #409eff;
    display: none;
  }

  .choose {
    .icon-pm_auction_success {
      display: inline-block;
      position: absolute;
      right: 0;
    }
  }

  .fixed-num {
    position: fixed;
    left: 4%;
    top: 9%;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    z-index: 5;
    padding: 0.2rem 0.5rem;
  }

  .fixed-top {
    z-index: 5;
    width: 4rem;
    height: 1rem;
    position: fixed;
    top: 42.5px;
    left: 50%;
    transform: translateX(-50%);
  }

  .fixed-bottom {
    z-index: 5;
    width: 4rem;
    height: 1rem;
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .fixed-box1 {
    z-index: 10;
    background-color: #3a3a3a;
    color: #fff;
    position: fixed;
    top: 60px;
    right: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;

    .item {
      padding: 0.5rem;
      display: flex;
      border-bottom: 1px solid #eee;

      i {
        font-size: 14px;
        align-self: center;
        margin-right: 0.5rem;
      }
    }

    .triangle {
      position: fixed;
      top: 42px;
      right: 18px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: #3a3a3a;
    }
  }

  .statusIng,
  .statusSuccess {
    margin-top: 25%;
    padding: 0 1rem;

    img {
      width: 6rem;
      height: 6rem;
    }

    .tips {
      color: #666;
      margin: 0 1rem;
      text-align: left;
      display: inline-block;
      word-break: break-all;
    }

    .btn3 {
      color: #377aff;
      background: #fff;
      border: 1px solid #377aff;
      width: 100%;
      height: 2.25rem;
      line-height: 2.25rem;
      border-radius: 20px;
    }
  }

  #contract {
    min-height: 100vh;
    background-color: #fff;

    .status-box {
      z-index: 9;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      color: #518bff;
      height: 54px;
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    .btn {
      z-index: 9;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      display: flex;

      .icon-yq_gaizhang {
        color: #ff2c29;
        font-size: 48px;
        flex: 1;
        text-align: left;
        margin-left: 1.5rem;
      }

      .sure {
        align-self: center;
        margin-right: 1.5rem;
        flex: 0 0 9rem;
        font-size: 18px;
        line-height: 32px;
        height: 32px;
        background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
        border-radius: 20px;
        color: #fff;
      }
    }

    .btn2 {
      color: #fff;
      width: 100%;
      margin-top: 2.25rem;
      height: 2.25rem;
      line-height: 2.25rem;
      background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
      border-radius: 20px;
    }

    .popTitle {
      width: 100%;
      height: 3rem;
      font-size: 1rem;
      color: #000;
      line-height: 3rem;
      text-align: center;
    }

    .popInp {
      width: 18rem;
      padding: 0 0 1.5rem 0;
      margin: 0 0.6rem;

      .van-cell {
        background: #f7f7f7;
        border-radius: 0.34rem;
      }

      .popPhone {
        background: #f7f7f7;
        border-radius: 0.34rem;
        margin-top: 1rem;
        height: 3rem;
      }

      .popAnswer {
        border-radius: 0.34rem;
        background: #f7f7f7;
        display: flex;
        margin-top: 1.5rem;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        height: 3rem;
      }
    }
  }

  .showBox {
    border-radius: 1rem;
  }

  .noIdentify {
    margin-top: 25%;

    .title {
      font-size: 15px;
      font-weight: bold;
    }
  }

  .Identify {
    height: 100%;
    overflow-y: scroll;
    padding: 1rem;
    display: none;

    .seal-box {
      display: flex;
      flex-wrap: wrap;
      padding: 0.5rem 0;
    }

    .tips {
      color: #999;
      font-size: 12px;
      text-align: left;
      margin: 1rem;
    }
  }

  .seal-item {
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    width: 6rem;
    height: 6rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584116150977&di=8c196ff505f980e30039a8794ead2dad&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F20%2F16%2F01%2F3156adf74e970a9.jpg");
  }

  .sun {
    width: 100%;

    img {
      width: 100%;
    }
  }

  #contract .pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }

</style>
