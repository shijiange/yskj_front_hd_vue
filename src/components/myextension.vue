<template>
  <div class="myextension">
    <div class="banner">
      <img src="../assets/images/myextension.png">
    </div>

    <div class="main">
      <!--推广条件1   申请   -->
      <div class="welcome"
           v-if="becomeType_1">
        <div class="text">
          <p>欢迎加入<span>{{become_1_info_2}}</span>，请填写申请信息</p>
          <p>邀请人：<span>{{become_1_info_1}}</span>&nbsp;请核实</p>
        </div>
        <div class="info">
          <input type="text"
                 v-model="para_name"
                 placeholder="请填写真实姓名"
                 class="inp">
          <input type="number"
                 v-model="para_phone"
                 placeholder="请填写手机号码方便联系"
                 class="inp">
          <!--<input type="text"
            v-model="para_weixin"
                   placeholder="请填写微信号"
                   class="inp">-->
          <input type="submit"
                 @click="become_1_click"
                 value="申请推广"
                 class="btn">
          <!--提交后跳转至success页面（同无条件申请）-->
        </div>
      </div>

      <!--推广条件2   消费达到N次   -->
      <div class="welcome"
           v-if="becomeType_2">
        <div class="text">
          <p>本店累计消费满 <span>{{become_2_info_1}}</span> 次， 才可开启&lt;{{become_2_info_3}}&gt;推广中心，您已消费 <span>{{become_2_info_2}}</span>
            次，请继续努力</p>
        </div>
        <div class="info">
          <div class="btn"
               @click="become_2_click">
            <!--点击跳转指定商品列表页面-->
            <i class="fa fa-shopping-cart"></i> 继续去购物
          </div>
        </div>
      </div>

      <!--推广条件3   消费达到N元   -->
      <div class="welcome"
           v-if="becomeType_3">
        <div class="text">
          <p>本店累计消费满 <span>{{become_3_info_1}}</span>{{$i18n.t("元")}}， 才可开启&lt;{{become_3_info_3}}&gt;推广中心，您已消费 <span>{{become_3_info_2}}</span>
            {{$i18n.t("元")}}，请继续努力</p>
        </div>
        <div class="info">
          <div class="btn"
               @click="become_3_click">
            <!--点击跳转指定商品列表页面-->
            <i class="fa fa-shopping-cart"></i> 继续去购物
          </div>
        </div>
      </div>

      <!--推广条件4     购买指定商品 -->
      <div class="welcome"
           v-if="becomeType_4">
        <div class="text">
          <p>本店需购买商品
            <a href=""><span>【{{become_4_info_1}}】</span></a>
            <!--可以点击跳转指定商品页面-->
            才可开启&lt;{{become_4_info_2}}&gt;推广中心，请现在去购买吧！
          </p>
        </div>
        <div class="info">

          <div class="btn"
               @click="become_4_click(become_4_info_3)">
            <!--点击跳转指定商品页面-->
            <i class="fa fa-shopping-cart"></i> 现在去购买
          </div>
        </div>
      </div>

      <div class="vip_main"
           v-if="!isCheck">
        <div class="title">推广特权</div>
        <div class="vip vip1">
          <div class="ico1"><i class="fa fa-qrcode"></i></div>
          <div class="text">
            <div class="t1">专属二维码</div>
            <div class="t2">拥有专属推广二维码，用于推广客户；</div>
          </div>
        </div>
        <div class="vip">
          <div class="ico2"><i class="fa fa-cny"></i></div>
          <div class="text">
            <div class="t1">推广{{income_name_text}}</div>
            <div class="t2">推广的客户购买商品后，您将获得相应的推广{{income_name_text}}；</div>
          </div>
        </div>

      </div>
    </div>

    <!--1：无条件展示     2：申请后展示-->
    <div class="success"
         v-if="isCheck">
      <div class="ico"><i class="fa fa-check"></i></div>
      <div class="text">您的申请已经提交，请等待审核！</div>
      <a @click="isCheck_click()">
        <div class="sub">去商城逛逛</div>
      </a>
    </div>

  </div>
</template>

<script>

import myextension_controller from "./myextension_controller";

export default myextension_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  a {
    text-decoration: none;
    color: #222;
  }

  input {
    border-width: 0;
  }

  .myextension .banner img {
    width: 100%;
  }

  .myextension .main .welcome {
    padding: 0.625rem;
    background: #fff;

    .text {
      p {
        font-size: 12px;
        color: #666;
        line-height: 1.2rem;

        span {
          color: #f55955;
        }
      }
    }

    .info {
      margin-top: 0.625rem;

      input {
        display: block;
        margin-bottom: 0.5rem;
        width: 100%;
        height: 2rem;
        border-radius: 0.3125rem;
        padding: 0 0.3125rem;
        box-sizing: border-box;
        outline: none;
      }

      .inp {
        border: 0.0625rem solid #b8b8b8;
      }

      .inp:focus {
        border-color: #f55955;
        box-sizing: border-box;
      }

      span {
        color: #f55955;
      }

      .btn {
        background: #f55955;
        color: #fff;
        margin-bottom: 0.5rem;
        width: 100%;
        height: 2rem;
        border-radius: 0.3125rem;
        padding: 0 0.3125rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        line-height: 2rem;

        i {
          display: inline-block;
        }
      }

      .btn:focus {
        background: #d8403c;
      }
    }
  }

  .myextension .main .vip_main {
    background: #fff;
    margin: 0.9375rem 0;

    .title {
      padding: 0.625rem;
      font-size: 12px;
      border-bottom: 0.0625rem solid #eee;
      text-align: center;
    }

    .vip {
      padding: 0.9375rem 0.625rem;
      overflow: hidden;
      font-size: 12px;
      color: #999;

      .ico1,
      .ico2 {
        width: 15%;
        float: left;
      }

      .ico1 {
        i {
          background: #32cd32;
        }
      }

      .ico2 {
        i {
          background: #fece00;
        }
      }

      .text {
        float: left;
        width: 85%;

        .t1 {
          font-size: 16px;
          color: #333;
          margin-bottom: 0.3125rem;
          text-align: left;
        }

        .t2 {
          text-align: justify;
        }
      }

      i {
        background: #32cd32;
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 1.125rem;
        color: #fff;
        text-align: center;
        line-height: 2.375rem;
        font-size: 1.125rem;
      }
    }

    .vip1 {
      border-bottom: 0.0625rem solid #eee;
    }
  }

  .myextension .success {
    height: 12.5rem;
    padding-top: 4.0625rem;
    background: #fff;

    .ico {
      height: 4.0625rem;
      width: 4.0625rem;
      margin: auto;
      border: 0.1875rem solid #32cd32;
      border-radius: 4rem;
      color: #32cd32;
      font-size: 36px;
      text-align: center;
      line-height: 4rem;
    }

    .text {
      height: 2rem;
      margin-top: 1.875rem;
      color: #666;
      line-height: 1.6rem;
      text-align: center;
    }

    a .sub {
      height: 2rem;
      width: 80%;
      background: #f55955;
      margin: 1.25rem auto;
      border-radius: 2rem;
      color: #fff;
      line-height: 2rem;
      text-align: center;
      font-size: 14px;
      margin-bottom: 1.25rem;
    }

    a .sub:focus {
      background: #d8403c;
    }
  }
</style>
