<template>
    <div>
     <!-- 海报展示 -->
        <van-overlay :show="show" @click="close">
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <transition name="van-fade">
                <div class="popupWrapper" v-show="show" @click.stop>
                    <div class="qrcodeWrapper">
                        <div class="qrcode-img">
                             <img :src="img" alt="">
                        </div>
                    </div>
                    <div class="close">
                    <i class="iconfont icon-adsystem_icon_cancle" @click="close"></i>
                    </div>
                </div>
                </transition>
            </div>
        </van-overlay>
    </div>
</template>


<script>

export default {
  props:['show','img'],
  data() {
    return {
      qrcodePopup:true
    };
  },
  methods:{
    close(){
      this.$emit("update:show",false);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.popupWrapper {
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

.qrcodeWrapper {
  .qrcode-img {
    width: 15.938rem;
    border-radius: 0.625rem;

    img {
      width: 15.938rem;
      background-color: #fff;
      border-radius: 0.625rem;
    }
  }

  .qrcode-tips {
    margin-top: 1rem;
    color: #fff;
    font-size: 0.85rem;
  }
}

</style>





