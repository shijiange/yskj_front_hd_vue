<template>
  <div id="areaAgent">
    <div class="banner">
        <img v-if="upload_flag" :src="apply_background"/>
        <img v-else src="../../../assets/images/enterprose_apply.jpg"/>
    </div>

    <!--已通过-->
    <div class="success" v-if="status == '1'">
      <div class="ico">
        <i class="fa fa-check"></i>
      </div>
      <div class="text">恭喜您已通过审核</div>
      <a @click="goEnterproseCentre()">
        <div class="sub">去{{title || '招商'}}</div>
      </a>
    </div>
    <!--可申请-->
    <div class="content" v-if="status == '-1'">
      <template v-if="config_status == '1'">
        <p class="title">申请{{merchant_people || '招商员'}}</p>
        <div class="text">
          <!-- 开启会员关系链，如果成为{{merchant_people || '招商员'}}，那么只要您的粉丝成为供应商，即可获得供应商的分红哦，快来申请吧~ -->
          如果成为{{merchant_people || '招商员'}}，那么只要您的粉丝成为供应商，即可获得供应商的分红哦，快来申请吧~
        </div>
        <template v-if="independent_backend == 1">
          <van-field v-model="username" label="登录账号" placeholder="登录账号" />
          <van-field v-model="password" type="password" label="登录密码" placeholder="输入登录密码" />
          <van-field v-model="password_again" type="password" label="确认密码" placeholder="输入确认密码" />
        </template>
        <button type="button" @click="submit" class="submit">申&nbsp;请</button>
      </template>
      <template v-if="config_status == '2'">
        <p class="title">申请{{merchant_people || '招商员'}}</p>
        <div class="text">
          会员人数<span>{{ config2.total }}</span
          >人 您还差 <span>{{ config2.diff }}</span
          >人，如果成为{{merchant_people || '招商员'}}，那么只要您的粉丝成为供应商，即可获得供应商的分红哦，快来申请吧~
        </div>
        <template v-if="independent_backend == 1">
          <van-field v-model="username" label="登录账号" placeholder="登录账号" />
          <van-field v-model="password" type="password" label="登录密码" placeholder="输入登录密码" />
          <van-field v-model="password_again" type="password" label="确认密码" placeholder="输入确认密码" />
        </template>
        <button type="button" @click="submit" class="submit">申&nbsp;请</button>
      </template>

      <template v-if="config_status == '3'">
        <p class="title">申请{{merchant_people || '招商员'}}</p>
        <div class="text">
          请购买指定商品 <span>{{ config3.goods_title }}</span>
        </div>
        <button type="button" @click="goToGoods(config3.goods_id)" class="submit">购 买</button>
      </template>
    </div>

    <!--待审核-->
    <div class="success" v-if="status == '0'">
      <div class="ico">
        <i class="fa fa-check"></i>
      </div>
      <div class="text">申请已提交，请等待审核！</div>
      <a @click="goHome()">
        <div class="sub">去商城逛逛</div>
      </a>
    </div>

    <!--驳回申请-->
    <div class="success" v-if="status == '-2'">
      <div class="ico">
        <i class="fa fa-check"></i>
      </div>
      <div class="text">您的申请被驳回，请继续努力！</div>
      <a @click="goHome()">
        <div class="sub">去商城逛逛</div>
      </a>
    </div>

    <div class="vip_main" v-if="status == '-1'">
      <div class="title">推广特权</div>
      <div class="vip vip1">
        <div class="ico1">
          <i class="fa fa-qrcode"></i>
        </div>
        <div class="text">
          <div class="t1">专属二维码</div>
          <div class="t2">拥有专属推广二维码，用于推广客户；</div>
        </div>
      </div>
      <div class="vip">
        <div class="ico2">
          <i class="fa fa-cny"></i>
        </div>
        <div class="text">
          <div class="t1">推广{{ income_name_text }}</div>
          <div class="t2">推广的客户购买商品后，您将获得相应的推广{{ income_name_text }}；</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style  lang="scss" rel="stylesheet/scss" scoped>
#areaAgent {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    color: #000;
    text-align: center;

    span {
      width: 9.375rem;
      line-height: 2.8125rem;
      font-size: 16px;
    }
  }

  .content {
    width: 100%;
    padding: 0.9375rem;
    box-sizing: border-box;
    background: #fff;

    p.title {
      line-height: 2.0625rem;
      font-size: 16px;
    }

    div.text {
      text-align: left;

      span {
        color: #f15353;
      }
    }

    .el-select {
      width: 100%;
      height: 2.5rem;
      margin-bottom: 0.625rem;

      .el-input__inner {
        color: #000 !important;
        font-size: 16px !important;
        border: 0.0625rem solid #b8b8b8;
      }
    }

    .submit {
      width: 100%;
      height: 2.5rem;
      border-radius: 0.375rem;
      background-color: #f15353;
      text-align: center;
      line-height: 2.5rem;
      color: #fff;
      border: 0;
      outline: 0;
      font-size: 16px;
      font-weight: bold;
      margin-top: 0.625rem;
    }

    input {
      display: block;
      margin-bottom: 0.8125rem;
      width: 100%;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      outline: none;
      font-size: 16px;
      height: 2.25rem;
      line-height: 1;
    }

    .inp {
      border: 0.0625rem solid #b8b8b8;
    }

    .inp:focus {
      border-color: #f55955;
      box-sizing: border-box;
    }
  }

  .banner {
    width: 100%;
    background: #fff;
    height: 100%;

    img {
      width: 100%;
    }
  }

  .vip_main {
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
          font-size: 15px;
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
        font-size: 20px;
      }
    }

    .vip1 {
      border-bottom: 0.0625rem solid #eee;
    }
  }
}

#areaAgent .success {
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
    font-size: 2.3rem;
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
  }

  a .sub:focus {
    background: #d8403c;
  }
}
</style>

<script>
import enterprose_apply_controller from './enterprose_apply_controller';
export default enterprose_apply_controller;
</script>




























