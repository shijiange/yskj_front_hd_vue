<template>
  <div class="periodicalWatch">
    <c-title :hide="false" text="期刊杂志"></c-title>
    <swiper :options="swiperOption" ref="goodSwiper">
      <swiper-slide v-for="(item, ind) in article_data" :key="ind">
        <div class="articleBox">
          <div class="head">
            <div class="headLeft">
              <div class="title">{{ item.has_one_article.title }}</div>
              <div class="titleLis">P{{ ind + 1 }}</div>
            </div>
            <!-- <div class="headRight">
              <img :src="item.has_one_article.article_logo" alt="" />
            </div> -->
          </div>
          <div class="contenBox" v-html="item.has_one_article.content"></div>
          <div class="foot_advs" @click="toAdvs(item.has_one_article.advs_link)" v-if="item.has_one_article.advs_type">
            <p class="advs_title">{{ item.has_one_article.advs_title }}</p>
            <div class="advs_img_bg" v-if="item.has_one_article.advs_img">
              <img class="advs_img" :src="item.has_one_article.advs_img" />
            </div>
            <div class="advs_img_bg" v-if="!item.has_one_article.advs_img">
              <img class="advs_img" src="../../assets/images/img_default.png" />
            </div>
            <div class="advs_desc">{{ item.has_one_article.advs_title_footer }}</div>
          </div>
          <div class="service" @click="severShow = true">
            <i class="iconfont icon-member_kefu"></i>
            客服
          </div>
          <div class="previous">
            <div class="txt">往期杂志</div>
            <div class="previousLis" v-for="(item, index) in before_journal" :key="index" @click="tapLIst(item.id)">{{ item.title }}</div>
            <div class="tapLoad" v-if="loading" @click="getMoreLis">
              加载更多
              <i class="iconfont icon-member-bottom"></i>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="pos set-pc-style">
      <div class="circle" @click="toGoBtn('home')">
        <img src="../../assets/images/periodical/home.png" alt="" />
      </div>
      <div class="circle" @click="toGoBtn('list')">
        <img src="../../assets/images/periodical/list.png" alt="" />
      </div>
      <div class="circle" @click="show = true">
        <img src="../../assets/images/periodical/share.png" alt="" />
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="shareBox">
        <div class="shareTop">
          <div class="share" @click="shareFir">
            <img src="../../assets/images/periodical/shareFir.png" alt="" />
            <span>微信好友</span>
          </div>
          <div class="share" @click="getPoste">
            <img src="../../assets/images/periodical/poster.png" alt="" />
            <span>生成海报</span>
          </div>
        </div>
        <div style="width: 100%; height: 0.28rem; background: transparent;"></div>
        <div class="cancel" @click="show = false">取消</div>
      </div>
    </van-popup>
    <van-popup v-model="postShow">
      <div class="postBox set-pc-style">
        <img :src="posterImg" alt="" />
      </div>
    </van-popup>
    <van-popup v-model="severShow" round position="center" style="width: 80%;">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cservice">
                <div class="image">
                  <img src="../../assets/images/kf_online_contect@2x.png" />
                </div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`">
                  <img src="../../assets/images/kf_tel_contect@2x.png" />
                </a>
              </div>
              <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;" />
          </div>
        </div>
        <i class="iconfont icon-close11" @click="severShow = false"></i>
      </div>
    </van-popup>
    <yzWechatShareImg v-model="showWechatshar"></yzWechatShareImg>
  </div>
</template>
<script>
import periodicalWatch_controller from "./periodicalWatch_controller";
export default periodicalWatch_controller;
</script>
<style>
/* 覆盖内联样式 */
.periodicalWatch {
  word-break: break-all;
}

.periodicalWatch .contenBox div,
.periodicalWatch .contenBox section,
.periodicalWatch .contenBox p,
.periodicalWatch .contenBox ul,
.periodicalWatch .contenBox ol {
  max-width: 100%;
}

.periodicalWatch .contenBox ul {
  list-style-type: disc;
}

.periodicalWatch .contenBox ol {
  list-style-type: decimal;
}

.periodicalWatch .contenBox img {
  display: block;
  max-width: 100% !important;
  height: auto !important;
}

.periodicalWatch .contenBox {
  list-style-type: revert;
}
</style>
<style lang="scss" rel="stylesheet/scss">
// $header: var(--width-primary);
.foot_advs {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  height: auto;
  border: 0.0625rem solid #ddd;
  padding: 0.3125rem;
  background: #fff;
  width: 100%;
  border-radius: 0;
}

.advs_img_bg {
  width: 100%;
  margin-bottom: 0.625rem;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
}

.advs_img {
  width: 100%;
}

p.advs_title {
  padding-left: 0.3125rem;
  padding-right: 0.3125rem;
  text-align: left;
  height: 1.875rem;
  line-height: 1.875rem;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
}

.advs_desc {
  padding-left: 0.3125rem;
  padding-right: 0.3125rem;
  text-align: left;
  font-size: 14px;
  color: #8a8a8a;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
/deep/ .van-popup {
  background-color: transparent;
}
// 客服
.pop-content {
  width: 100%;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}
// end客服
.postBox {
  width: 20rem;
  height: 31.5rem;

  img {
    width: 100%;
    height: 100%;
  }
}

.periodicalWatch {
  .shareBox {
    background-color: transparent;

    .shareTop {
      height: 7.63rem;
      border-radius: 0.63rem 0.63rem 0 0;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .share {
        display: flex;
        flex-direction: column;
        align-items: center;
        // i {
        //   color: #46bb36;
        //   font-size: 2.5rem;
        // }
        img {
          width: 3rem;
          height: 3rem;
          margin-bottom: 0.5rem;
        }

        .icon-jk_haibao {
          font-size: 2rem;
        }
      }
    }

    .cancel {
      width: 100%;
      height: 2.84rem;
      background-color: #fff;
      text-align: center;
      line-height: 2.84rem;
      font-size: 0.94rem;
    }
  }

  .pos {
    position: fixed;
    bottom: 6.06rem;
    right: 1.19rem;
    display: flex;
    flex-direction: column;
    z-index: 999;

    .circle {
      border-radius: 100%;
      width: 2.8rem;
      height: 2.8rem;
      margin-bottom: 0.63rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .articleBox {
    width: 100%;
    min-height: 100vh;
    background: #fff;
    padding-bottom: 1rem;

    .tapLoad {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      margin-bottom: 1.28rem;

      i {
        font-size: 1.3rem;
        margin-top: 5px;
      }
    }

    .previous {
      width: 21.56rem;
      background-color: #eef7f6;
      border-radius: 0.47rem;
      margin: 0 auto;
      overflow: hidden;
      margin-top: 1.06rem;

      .previousLis {
        margin-bottom: 1.28rem;
      }

      .txt {
        font-size: 1.25rem;
        color: #1d9a89;
        margin-top: 1.13rem;
        margin-bottom: 1.53rem;
      }
    }

    .service {
      margin: 0 auto;
      width: 4.38rem;
      height: 1.56rem;
      border-radius: 0.13rem;
      border: solid 0.03rem #f14e4e;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 3rem;
      font-size: 0.81rem;
      color: #f14e4e;

      i {
        margin-right: 0.19rem;
      }
    }

    .contenBox {
      padding-left: 0.7rem;
      padding-right: 0.7rem;
      padding-top: 0.94rem;
      width: 100%;
      text-align: left;
    }

    .head {
      height: 5.41rem;
      margin: 0 0.94rem;
      border-bottom: 0.03rem solid #efefef;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .headLeft {
        flex: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .title {
          width: 100%;
          margin-top: 1.3rem;
          text-align: left;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .titleLis {
          text-align: left;
        }
      }

      .headRight {
        width: 5.63rem;
        height: 2rem;
        margin-right: 0.25rem;
        margin-left: 4.75rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  // .articleBox1 {
  //   width: 100%;
  //   height: 100vh;
  //   background: yellow;
  // }
}
</style>
