<template>
  <div id="new_diy" v-if="showPage">

    <template v-if="$store.state.isWatchDiypage == 1">
      <top_navigation v-if="top_info.group_title" :id="id" :datas="top_info"></top_navigation>

      <!--新装修页面-->
      <template v-for="(item, index) in components">
        <component :key="index" :is="item.component_key" :isBottom="isBottom" :lastIndex="lastIndex" :btnFlag="btnFlag"
                   :id="item.id" :page_id="page_id" :component_key="item.component_key" :datas="item.remote_data"
                   :index="index" @refresh="refreshComponent" :ref="item.component_key" :fatherTitle="fatherTitle"></component>
      </template>

      <div class="cover">
        <div v-show="fullShow" class="fullScreen">
          <div class="full-image">
            <img :src="full_screen.image" @click="turnFullTo"/>
            <span class="close"><span class="skip" @click.stop="close">跳过</span>{{ full_screen.show_time }}</span>
          </div>
        </div>
        <div class="mask" v-show="advertising.is_default === 1">
          <div class="modal-mask" v-if="advertising.datas && advertising.datas.background_over && popShow" :style="{backgroundColor: `rgba(0, 0, 0, ${advertising.datas.background_over/100})`}"></div>
          <div class="mask-blank">
            <div class="pop" v-if="popShow" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
              <div class="pop-image">
                <img :src="advertising.image"  @click="turnTo"/>
                <div class="minLink" v-if="advertising.url_type == 2" @click.stop v-html="advertising.html"></div>
                <div class="icon_close">
                  <i class="iconfont icon-close11"  @click="closePop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="$store.state.isWatchDiypage == 0">
      <!-- 没有等级浏览权限 -->
      <div class="noPowerShow">
        <div class="warnTestBox">暂无浏览权限！</div>
      </div>
    </template>

    <U_foot :id="id+'1'" v-if="bottom_info" :diydatas="bottom_info"></U_foot>

  </div>
</template>

<script>
import new_diy_controller from "./new_diy_controller";

export default new_diy_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .cover .fullScreen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }

  .cover .fullScreen .full-image {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .cover .fullScreen .full-image img {
    width: 100%;
    height: 100%;
  }

  .cover .fullScreen .full-image .close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: #fff;
    font-size: 16px;
  }

  .cover .fullScreen .full-image .close .skip {
    margin-right: 0.5rem;
  }

  .cover .mask-blank .pop {
    width: 65%;
    position: fixed;
    z-index: 8888;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .cover .mask-blank .pop.pcStyle {
    width: 270px;
  }

  .cover .mask-blank .pop .pop-image {
    position: relative;
  }

  .cover .mask-blank .pop .pop-image img {
    width: 100%;
    height: 100%;
  }

  .cover .mask-blank .pop .pop-image .icon_close {
    top: 0;
    right: 0;
    position: absolute;
    background-color: #333;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -0.75rem;
    margin-right: -0.75rem;
    border-radius: 50%;
  }

  .cover .mask-blank .pop .pop-image .icon_close {
    color: #fff;
  }

  .minLink {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .noPowerShow {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #999;
    position: relative;

    .warnTestBox {
      position: absolute;
      display: inline-block;
      top: 50%;
      left: 50%;
      margin-top: -1.5rem;
      margin-left: -5rem;
      color: #fff;
      width: 10rem;
      height: 3rem;
      line-height: 3rem;
      border-radius: 0.5rem;
      background: #333;
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
  }
</style>
