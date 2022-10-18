<template>
    <div class="page">
       <c-title :text="group_code.code_name || '群活码'" ></c-title>
       <div class="notice">
         <van-notice-bar
           left-icon="volume-o"
           :text="group_code.code_guide"
         />
       </div>

       <div class="wrapper">
          <div class="img">
            <img :src="groupCodeInfo.code_url_img" alt="">
          </div>
          <p class="not-join" v-if="groupCodeInfo.code_type == 1 && groupCodeInfo.is_can_join == 0">所有群已经满员，请联系客服！</p>
          <p class="desc" v-if="groupCodeInfo.code_type == 0">该二维码{{groupCodeInfo.expire}}前有效</p>
          <p class="tips">长按识别二维码</p>
          <p class="hr"></p>
          <div class="opts">
              <div class="opt" @click="shareFlag = true">
                <i class="iconfont icon-share"></i>
                <p>分享</p>
              </div>
              <div class="opt" @click="kfFlag = true">
                <i class="iconfont icon-qhm_service"></i>
                <p>客服</p>
              </div>
              <div class="opt" v-if="group_code.explain" @click="explainFlag = true">
                <i class="iconfont icon-qhm_shuoming"></i>
                <p>说明</p>
              </div>
          </div>
       </div>

      <p class="qrCodeTips">注：若二维码无法进入，请联系客服</p>



      <van-overlay :show="shareFlag" @click="shareFlag = false">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-slide-up">
              <div class="shareWrapper" v-show="shareFlag" @click.stop>
                <div class="imgContent" v-if="qrCodeCanvasSrc">
                    <img :src="qrCodeCanvasSrc" alt="">
                </div>
                  <div v-else class="divContent">
                      <div class="header">
                         <div class="userInfo">
                           <div class="image">
                             <img class="img" v-if="groupCodeInfo.member_id" :src="groupCodeInfo.has_one_member.avatar_image" alt="图片无效" />
                             <img class="img" v-else :src="shop_log" alt="图片无效" />
                           </div>
                            <div class="title">{{group_code.code_name}}</div>
                         </div>
                         <div class="desc">
                          {{group_code.code_guide}}
                         </div>
                      </div>
                      <div class="footer">
                          <share-canvas class="canvas" ref="share_canvas"></share-canvas>
                      </div>
                  </div>

                  <div class="close">
                    <i class="iconfont icon-adsystem_icon_cancle" @click="shareFlag = false"></i>
                  </div>
              </div>
          </transition>
        </div>
      </van-overlay>

      <van-overlay :show="kfFlag" @click="kfFlag = false">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-slide-up">
              <div class="explainWrapper" v-show="kfFlag" @click.stop>
                  <div class="header">
                    <div class="title">客服</div>
                    <i class="iconfont icon-guanbi" @click="kfFlag = false"></i>
                  </div>
                  <div class="img">
                    <img :src="group_code.customer_service_img" alt="">
                  </div>
                  <div class="kf_guide">
                    {{group_code.customer_service_guide}}
                  </div>
              </div>
          </transition>
        </div>
      </van-overlay>

      <van-overlay :show="explainFlag" @click="explainFlag = false" :lock-scroll="false">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-slide-up">
              <div class="explainWrapper" v-show="explainFlag" @click.stop>
                  <div class="header">
                    <div class="title">说明</div>
                    <i class="iconfont icon-guanbi" @click="explainFlag = false"></i>
                  </div>
                  <div id="a_content" class="content" v-html="group_code.explain_content"></div>
              </div>
          </transition>
        </div>
      </van-overlay>

      <!-- 权限不足弹框 -->
      <van-popup
        v-model="showAuthDialog"
        round
        class="auth-dialog"
        @click-overlay="onCloseAuthDialog"
      >
        <p class="auth-tip">您不满足进群条件，加入当前的群需要满足一下条件：</p>
        <ol v-if="openAuthData">
          <li v-if="openAuthData.pay.is_open">
            累计消费金额满{{openAuthData.pay.data}}元！
            <span class="link-text" @click="toPage('home')">去消费</span>
          </li>
          <li v-if="openAuthData.member_level.is_open">
            升级到
            <span>{{levelNames}}</span>
            <span class="link-text" @click="toPage('MemberGradeList')">查看会员级别</span>
          </li>
          <li v-if="openAuthData.member_tags.is_open">
            获得以下标签身份：
            <div>
              <van-tag plain type="primary"
                v-for="(item, index) in openAuthData.member_tags.data" :key="index">{{item.title}}</van-tag>
            </div>
          </li>
          <li v-if="openAuthData.goods.is_open">
                  购买指定商品
                  <span class="link-text" @click="toPage('groupCodeGoodsList', {id: $route.query.groupCodeId})">查看商品</span>
              </li>
        </ol>
      </van-popup>

    </div>
</template>

<script>
import groupCodeShowController from './group_code_show_controller.js';

export default groupCodeShowController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(249, 249, 249); min-height: 100vh; padding-bottom: 3.0625rem; }

  .wrapper {
    width: 21.813rem;
    // height: 28.5rem;
    background-color: #fff;
    border-radius: 1.125rem;
    margin-top: 1rem;
    padding-bottom: 0.875rem;
    margin-left: 0.781rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .img {
      margin-top: 1.625rem;
      width: 15.719rem;
      height: 15.719rem;
      border: 1px dashed #c0ccda;
      padding: 0.3rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .desc, .not-join{
      margin-top: 0.75rem;
      font-size: 0.875rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 1.5rem;
      letter-spacing: 0.044rem;
      color: #333;
    }

    .not-join {
      color: #E87D75;
    }

    .tips {
      margin-top: 0.419rem;
      font-size: 0.875rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 1.5rem;
      letter-spacing: 0.044rem;
      color: #999;
    }

    .hr {
      padding-top: 1.938rem;
      margin: 0 auto;
      width: 20.781rem;
      border-bottom: 1px dashed #c0ccda;
    }

    .opts {
      margin-top: 1.094rem;
      display: flex;
      width: 100%;
      justify-content: space-around;

      .opt {
        .iconfont {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
        }

        .icon-share {
          background-color: #dee9ff;
          color: #3678ff;
        }

        .icon-qhm_service {
          background-color: #adf1da;
          color: #00b075;
        }

        .icon-qhm_shuoming {
          background-color: #ddd;
          color: #838383;
        }

        p {
          margin-top: 0.563rem;
          font-size: 0.875rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0;
          color: #666;
        }
      }
    }
  }

  .qrCodeTips {
    text-align: left;
    margin-top: 0.656rem;
    font-size: 0.75rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 1.5rem;
    letter-spacing: 0;
    color: #666;
    margin-left: 0.781rem;
    padding-bottom: 3rem;
  }

  .explainWrapper {
    width: 21.25rem;
    max-height: 24rem;
    background-color: #fff;
    border-radius: 1.531rem;
    padding-bottom: 3rem;
    transition: 0.3s;
    padding-top: 0.5rem;

    .header {
      height: 2.596rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .img {
        width: 2.25rem;
        height: 2.25rem;
        margin-right: 0.625rem;

        img,
        canvas {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
        }
      }

      .title {
        font-size: 1rem;
        letter-spacing: 0.05rem;
        color: #000;
      }

      .icon-guanbi {
        position: absolute;
        top: 0.875rem;
        right: 1.25rem;
        color: #000;
      }
    }

    .content {
      max-height: 20rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      letter-spacing: 0.066rem;
      color: #666;
      text-align: left;
      text-indent: 1.75rem;
      line-height: 1.5rem;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 14rem;

      img {
        width: 13rem;
        height: 13rem;
      }
    }

    .kf_guide {
      max-height: 3rem;
      padding-top: 0.506rem;
      padding-left: 2.688rem;
      padding-right: 2.688rem;
      font-size: 0.875rem;
      letter-spacing: 0;
      color: #666;
      overflow-y: scroll;
    }
  }

  .shareWrapper {
    height: 29rem;
    width: 18rem;

    .imgContent {
      width: 18rem;
      height: 25rem;

      img {
        width: 18rem;
        height: 25rem;
      }
    }

    .divContent {
      width: 18rem;
      height: 25rem;
      padding: 3rem 1rem;
      background-image: url(../../../assets/images/member/qhm_sharepicbg@2x.png);
      background-size: cover;

      .header {
        height: 8rem;
        width: 16rem;

        .userInfo {
          display: flex;
          align-items: center;
          padding: 1rem 0 0 1rem;

          .image {
            .img {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
            }
          }

          .title {
            margin-left: 1rem;
            font-size: 1rem;
            color: #333;
          }
        }

        .desc {
          height: 4rem;
          text-align: left;
          padding: 0.3rem 1rem 2rem 1rem;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 3;
          // line-clamp: 3;
          // -webkit-box-orient: vertical;
        }
      }

      .footer {
        width: 7rem;
        height: 7rem;
        margin-top: 2rem;
        margin-left: 1rem;
        background-color: red;

        .canvas {
          width: 7rem;
          height: 7rem;
        }
      }
    }

    .close {
      height: 4rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;

      .icon-adsystem_icon_cancle {
        font-size: 3rem;
        color: #fff;
        width: 3rem;
        height: 3rem;
      }
    }
  }

  .auth-dialog {
    width: 80%;
    padding: 2rem;
    font-size: 14px;
    color: #102636;
    text-align: left;
    .auth-tip {
      font-weight: bold;
      margin-bottom: 1.2rem;
    }
    ol {
      list-style: auto;
      padding-left: 1.2rem;
    }
    li {
      list-style: auto;
      margin-bottom: 1.2rem;
    }
    .link-text {
      color: #6FBCAF;
    }
    .van-tag {
      margin:  0.8rem 0.8rem 0 0;
    }
  }
</style>
