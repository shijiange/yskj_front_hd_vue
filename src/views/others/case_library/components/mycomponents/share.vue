<template>
  <div id="share">
    <div class="share" @click="openShare">
      <div class="service">
        <div>
          <i class="iconfont icon-zb_all_share" style="font-size: 1.25rem;"></i>
        </div>
      </div>
    </div>
    <van-popup v-model="share_show" lock-scroll="true" position="bottom" round :style="{ height: '11.625rem' }">
      <div class="pop-con">
        <div class="title">立即分享给好友</div>
        <div class="buttons">
          <div class="button" @click.stop v-clipboard:copy="link" v-clipboard:success="onCopy">
            <div class="img">
              <img src="../../../../../assets/images/case-link.png" alt="" />
            </div>
            <div class="text">复制链接</div>
          </div>
          <div class="button" @click="creatPoster">
            <div class="img">
              <img src="../../../../../assets/images/case-image.png" alt="" />
            </div>
            <div class="text">分享海报</div>
          </div>
          <div class="button" @click="shareWeixin">
            <div class="img">
              <img src="../../../../../assets/images/case-wechat.png" alt="" />
            </div>
            <div class="text">微信</div>
          </div>
        </div>
        <div class="cancel" @click="closeShare">取消</div>
      </div>
    </van-popup>
    <van-popup
      v-model="posterShow"
      closeOnClickModal="true"
      style="width: 17.8125rem; height: 34.5rem; padding: 0; background: none;"
    >
      <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
        <img v-if="img_url" :src="img_url || emptyImage" style="width: 98%; border-radius: 0.375rem;" />
        <!-- 关闭图标 -->
        <div class="icon_close" @click="posterShow = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import share_controller from './share_controller';

export default share_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$text-color: #202020;

#share {
  text-align: center;

  .share {
    position: fixed;
    right: 1.05rem;
    bottom: 8.75rem;
    width: 2.1875rem;
    height: 2.1875rem;
    line-height: 2.1875rem;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    background: #f15353;
  }

  .pop-con {
    color: #333;

    .title {
      color: $text-color;
      font-size: 1rem;
      padding: 1.125rem 0;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      padding: 0 2.5rem 1rem 2.5rem;

      .button {
        width: 3.75rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        .img {
          width: 2.75rem;
          height: 2.75rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          font-size: 0.875rem;
        }
      }
    }

    .cancel {
      line-height: 3rem;
      color: #333;
      text-align: center;
      font-size: 1rem;
      border-top: 1px solid #ebebeb;
    }
  }

  .code_box {
    position: relative;
    display: flex;

    .icon_close {
      position: absolute;
      bottom: 0;
      right: 50%;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: -1.25rem;
      border: 1px solid #fff;
      border-radius: 100%;

      i {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #fff;
      }
    }
  }
}

.pcStyle #share .share {
  left: 50%;
  margin-left: 130px;
}
</style>
