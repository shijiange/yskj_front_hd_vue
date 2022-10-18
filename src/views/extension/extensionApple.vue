<template>
  <div id="extension">
    <c-title :hide="false" text="推广申请"></c-title>
    <div class="myextension">
      <div class="banner">
        <img :src="info_img" v-if="!(info_img=='' ||info_img==undefined||info_img==null)">
        <img src="../../assets/images/myextension.png" v-if="(info_img=='' ||info_img==undefined||info_img==null)">
      </div>
      <div class="main">
        <!--推广条件1   申请   -->
        <div class="welcome" id="apply-info" v-if="becomeType_1">
          <div class="text">
            <p>欢迎加入 <span>{{become_1_info_2}}</span>，请填写申请信息</p>
            <p v-if="become_1_info_1">邀请人： <span>{{become_1_info_1}}</span>&nbsp;请核实</p>
          </div>
          <div class="info">
            <div class="name">
              <span>姓名：</span><input type="text" v-model="para_name" placeholder="请填写真实姓名" class="inp">
            </div>
            <div class="member">
              <span>电话：</span><input type="number" v-model="para_phone" placeholder="请填写手机号码方便联系" class="inp">
            </div>

            <!--<input type="text"
                                                              v-model="para_weixin"
                                                                     placeholder="请填写微信号"
                                                                     class="inp">-->

          </div>
          <input type="submit" @click="become_1_click" value="申请推广" class="btn">
          <!--提交后跳转至success页面（同无条件申请）-->


        </div>
        <div class="new_extension">
          <div class="title" v-if="!becomeType_1">
            <h1>推广申请</h1>
            <p>{{extensionTips}}</p>
          </div>
          <ul class="text">
            <!--推广条件3   消费达到N{{$i18n.t('元')}}   -->
            <template v-for="(item,index) in become_term_id">
              <li v-if="item == 3" :key="index">
                <i class="iconfont icon-finger"></i>
                <p>本店累计消费满<span>{{become_3_info_1}}</span> {{$i18n.t("元")}}， 才可成为推广员，您已消费<span>{{become_3_info_2}}</span>
                  {{$i18n.t("元")}}，请继续努力！</p>
              </li>
              <!--推广条件2   消费达到N次   -->
              <li v-if="item == 2" :key="index">
                <i class="iconfont icon-finger"></i>
                <p>本店累计消费满 <span>{{become_2_info_1}}</span>次， 才可成为推广员，您已消费<span>{{become_2_info_2}}</span>次，请继续努力！</p>
              </li>
              <!--推广条件4     购买指定商品 -->
              <li v-if="item == 4" :key="index">
                <i class="iconfont icon-finger"></i>
                <p>本店需购买指定专区商品，才可以成为推广员，请去挑选购买吧！<span class="btn" @click="gotoShopGood">进入专区商品&nbsp;>>></span></p>
              </li>
              <!-- 推广条件5  -->
              <li v-if="item == 5" :key="index">
                <i class="iconfont icon-finger"></i>
                <p>自购销售佣金累计达到<span>{{become_selfmoney}}</span>{{$i18n.t("元")}}</p>
              </li>
            </template>



          </ul>
          <div class="info" v-if="!becomeType_1">
            <div class="btn" @click="become_3_click">
              <i class="fa fa-shopping-cart"></i> 继续去购物
            </div>
          </div>
        </div>


        <!-- <div class="welcome" v-if="becomeType_2" id="go-buy">
          <div class="text">
            <p>本店累计消费满
              <span>{{become_2_info_1}}</span> 次， 才可成为&lt;{{become_2_info_3}}&gt;的推广员，您已消费
              <span>{{become_2_info_2}}</span> 次，请继续努力</p>
          </div>
          <div class="info">
            <div class="btn" @click="become_2_click">
              <i class="fa fa-shopping-cart"></i> 继续去购物
            </div>
          </div>
        </div>

        <div class="welcome" v-if="becomeType_3" id="go-buy">
          <div class="text">
            <p>本店累计消费满
              <span>{{become_3_info_1}}</span>{{$i18n.t('元')}}， 才可成为&lt;{{become_3_info_3}}&gt;的推广员，您已消费
              <span>{{become_3_info_2}}</span> {{$i18n.t('元')}}，请继续努力</p>
          </div>
          <div class="info">
            <div class="btn" @click="become_3_click">
              <i class="fa fa-shopping-cart"></i> 继续去购物
            </div>
          </div>
        </div>

        <div class="welcome" v-if="becomeType_4" id="go-buy">
          <div class="text">
            <p>本店需购买商品
              <span>【{{become_4_info_1}}】</span>
              才可成为&lt;{{become_4_info_2}}&gt;的推广员，请现在去购买吧！
            </p>
          </div>
          <div class="info">
            <div class="btn" @click="become_4_click(become_4_info_3)">
              <i class="fa fa-shopping-cart"></i> 现在去购买
            </div>
          </div>
        </div> -->
        <!-- 新推广信息 -->
        <!-- <div class="new_extension">
          <div class="title">
            <h1>推广申请</h1>
            <p>满足以下任意条件都可以升级</p>
          </div>
          <ul class="text">
            <li>
              <i class="iconfont icon-finger"></i>
              <p>本店累计消费满<span>10,000.00</span>  {{$i18n.t('元')}}， 才可成为推广员，您已消费<span>0</span>  {{$i18n.t('元')}}，请继续努力！</p>
            </li>
            <li>
              <i class="iconfont icon-finger"></i>
              <p>本店累计消费满 <span>xx</span>次， 才可成为推广员，您已消费<span>xx</span>次，请继续努力！</p>
            </li>
            <li>
              <i class="iconfont icon-finger"></i>
              <p>本店需购买指定专区商品，才可以成为推广员，请去挑选购买吧！<span class="btn">进入专区商品&nbsp;>>></span></p>
            </li>
          </ul>
          <div class="info">
            <div class="btn">
              <i class="fa fa-shopping-cart"></i> 继续去购物
            </div>
          </div>
        </div> -->
        <div class="vip_main" v-if="!isCheck">
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
              <div class="t1">推广{{income_name_text}}</div>
              <div class="t2">推广的客户购买商品后，您将获得相应的推广{{income_name_text}}；</div>
            </div>
          </div>
        </div>
      </div>
      <!--1：无条件展示     2：申请后展示-->
      <div class="success" v-if="isCheck">
        <div class="ico">
          <i class="fa fa-check"></i>
        </div>
        <div class="text">您的申请已经提交，请等待审核！</div>
        <a @click="isCheck_click()">
          <div class="sub">去商城逛逛</div>
        </a>
      </div>
    </div>


  </div>
</template>
<script>
import extensionApple_controller from "./extensionApple_controller";

export default extensionApple_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #extension {
    .myextension .banner img {
      width: 100%;
    }

    .myextension .main {
      position: relative;
      top: -0.25rem;
    }

    .welcome {
      background-color: #fff;
      padding: 1.25rem 0;
    }

    #apply-info {
      .text {
        font-size: 16px;
        line-height: 1.5rem;

        p {
          span {
            color: #f15353;
            font-weight: bold;
          }
        }
      }

      .info {
        margin-bottom: 1.25rem;
        padding: 0 0.875rem;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;
        margin-top: 0.625rem;
        text-align: left;

        .name,
        .member {
          height: 2.75rem;
          border-bottom: solid 0.0625rem #ebebeb;

          input {
            border: none;
            height: 1.875rem;
            border-radius: 0.1875rem;
            color: #333;
            font-size: 14px;
          }

          span {
            line-height: 2.75rem;
            font-size: 14px;
            display: inline-block;
            width: 16%;
          }
        }

        .member {
          border: none;
        }
      }

      .btn {
        width: 80%;
        background-color: #f15353;
        border-radius: 0.25rem;
        color: #fff;
        border: none;
        height: 2.25rem;
        font-size: 14px;
        margin: 0 0.875rem;
      }
    }

    #go-buy {
      .text {
        margin-bottom: 0.625rem;
        padding: 0 0.875rem;
        font-size: 16px;

        p {
          line-height: 1.625rem;
        }

        span {
          color: #f15353;
          font-weight: bold;
        }
      }

      .info {
        .btn {
          line-height: 2.25rem;
          margin: 0 auto;
          width: 80%;
          height: 2.25rem;
          border-radius: 1.125rem;
          background-color: #f15353;
          color: #fff;
          font-size: 14px;

          i {
            color: #fff;
            font-size: 1.25rem;
            margin-right: 0.625rem;
          }
        }
      }
    }

    .new_extension {
      background: #fff;
      padding: 0 0.875rem 1.25rem 0.875rem;

      .title {
        padding: 0.25rem 0;
        background-image: url(../../assets/images/title_bg.png);
        background-repeat: no-repeat;
        background-size: 16.25rem;
        background-position: center center;
        color: #fff;
        margin-bottom: 1.25rem;

        h1 {
          font-size: 16px;
          line-height: 1.5rem;
        }

        p {
          font-size: 13px;
          line-height: 1.25rem;
          opacity: 0.7;
        }
      }

      .text {
        li {
          display: flex;
          margin-bottom: 0.625rem;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
          }

          p {
            font-size: 16px;
            text-align: left;
            margin-left: 0.5rem;
            line-height: 1.75rem;

            span {
              font-weight: bold;
              color: #f15353;
            }

            .btn {
              font-weight: normal;
              font-size: 13px;
              background: rgba(241, 83, 83, 0.16);
              padding: 0.25rem 0.625rem;
              border-radius: 0.1875rem;
              margin-left: 1.25rem;
            }
          }
        }
      }

      .info {
        margin-top: 1.25rem;

        .btn {
          line-height: 2.25rem;
          margin: 0 auto;
          width: 18.75rem;
          height: 2.25rem;
          border-radius: 1.125rem;
          background-color: #f15353;
          color: #fff;
          font-size: 14px;

          i {
            color: #fff;
            font-size: 1.25rem;
            margin-right: 0.625rem;
          }
        }
      }
    }

    .myextension .main .vip_main {
      background: #fff;
      margin: 0.9375rem 0;

      .title {
        padding: 0.625rem;
        font-size: 12px;
        border-bottom: 0.0625rem solid #e2e2e2;
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
          font-size: 18px;
        }
      }

      .vip1 {
        border-bottom: 0.0625rem solid #e2e2e2;
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
  }
</style>
