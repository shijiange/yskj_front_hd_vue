<template>
  <div class="cursor" @click.stop="changeBtn" ref="cursor">
    <div class="addSusp" :class="[isOpenBtn ? 'rotateImg' : 'normalImg']">
      <i class="iconfont icon-jiahao"></i>
    </div>
    <div
      class="btn btn_1"
      :class="[isOpenBtn ? 'active1' : '']"
      @click.stop="gotoCreate"
    >
      <i class="iconfont icon-qhm_create"></i>创建
    </div>
    <div class="btn btn_2" :class="[isOpenBtn ? 'active2' : '']" @click.stop="gotoRecord">
      <i class="iconfont icon-qhm_record"></i>记录
    </div>
  </div>
</template>

<script>

export default{
  data(){
    return {
      isOpenBtn: false
    };
  },
  mounted() {
    document.addEventListener('touchstart',(e) =>{
      let tree = this.$refs.cursor;
      if (tree) {
        if (!tree.contains(e.target)) {
          this.isOpenBtn = false;
        }
      }
    });
  },
  methods:{
    gotoCreate(){
      this.$router.push(this.fun.getUrl("groupCodeCreate", {}));
    },
    gotoRecord(){
      this.$router.push(this.fun.getUrl("groupCodeRecord", {}));
    },
    changeBtn() {
      this.isOpenBtn = !this.isOpenBtn;

    }
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .cursor {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 100%;
    position: fixed;
    bottom: 5.438rem;
    right: 50%;
    transform: translateX(10rem);
    color: #fff;
    background-image: linear-gradient(132deg, #fe7575 0%, #fc3d3d 100%), linear-gradient(#7f5e5e, #7f5e5e);
    background-blend-mode: normal, normal;
    box-shadow: 0 0.125rem 0.5rem 0.125rem rgba(90, 14, 14, 0.24);

    .addSusp {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.75rem;
      height: 3.75rem;
      background-color: #00b075;
      border-radius: 50%;
      z-index: 9999;
      position: relative;

      .icon-jiahao {
        font-size: 2rem;
      }
    }

    .rotateImg {
      transform: rotate(135deg) scale(1.1);
      -webkit-transform: rotate(135deg) scale(1.1);
      transition: transform 0.5s;
    }

    .normalImg {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transition: transform 0.5s;
    }

    .btn {
      width: 2.906rem;
      height: 2.906rem;
      background-color: #00b075;
      //   border-radius: ;

      border-radius: 50%;
      box-shadow: 0 0.125rem 0.5rem 0.125rem rgba(90, 14, 14, 0.24);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      flex-direction: column;
      font-size: 0.625rem;
      opacity: 1;
      // transform: scale(0.2);
      // transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      transition: all 0.25s ease-in-out;

      i {
        font-size: 1.5rem;
      }
    }

    .btn_1 {
      top: -2.625rem;
      left: 0.5rem;
      transform: scale(0.5) translateY(150%);
    }

    .active1 {
      border-radius: 50%;
      opacity: 1;
      transform: scale(1) translateY(-50%);
    }

    .btn_2 {
      top: -2rem;
      left: -3.5rem;
      transition-delay: 0.1s;
      transform: scale(0.5) translateX(260%) translateY(150%);
    }

    .active2 {
      border-radius: 50%;
      opacity: 1;
      transform: scale(1) translateX(0%) translateY(0%);
    }
  }

</style>
