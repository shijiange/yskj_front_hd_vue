<template>
  <div class="progress-animation">
    <ul class="progress-animation-els">
      <li class="progress-animation-el">+1</li>
      <li class="progress-animation-el">+1</li>
      <li
        class="progress-animation-el progress-animation-el-mini"
        style="animation-delay: 1.5s;"
      ></li>
      <li
        class="progress-animation-el progress-animation-el-mini"
        style="animation-delay: 1.8s;"
      ></li>
      <li class="progress-animation-el" style="animation-delay: 1.3s;">+1</li>
      <li class="progress-animation-el" style="animation-delay: 1s;">+1</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  methods: {},

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.progress-animation {
  pointer-events: none;
  .progress-animation-el {
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: white;
    font-size: 12px;
    border-radius: 50%;
    background: linear-gradient(to bottom, rgb(225, 45, 43), rgb(245, 137, 65));
    transform: scale(0);
    animation: bottomToTopFromRight 1.5s infinite 0s linear;
  }

  .progress-animation-el-mini {
    width: 5px;
    height: 5px;
  }

  .progress-animation-el:nth-child(1) {
    animation: bottomToTopFromRight30 2s infinite 2.1s linear;
    background: linear-gradient(to top, rgb(245, 239, 111), rgb(240, 185, 28));
  }

  .progress-animation-el:nth-child(2) {
    animation: bottomToTopFromRight10 2.5s infinite 2.1s linear;
    background: linear-gradient(to bottom, rgb(39, 171, 227), rgb(149, 227, 247));
  }

  .progress-animation-el:nth-child(3) {
    animation: bottomToTopFromRight10 3.2s infinite 2s linear;
    background: linear-gradient(to bottom, rgb(245, 239, 111), rgb(240, 185, 28));
  }

  .progress-animation-el:nth-child(4) {
    animation: bottomToTopFromLeft10 2.6s infinite 2.5s linear;
    background: linear-gradient(to bottom, rgb(39, 171, 227), rgb(149, 227, 247));
  }

  .progress-animation-el:nth-child(5) {
    animation: bottomToTopFromLeft10Right10 2.8s infinite 3.5s linear;
    background: linear-gradient(to top, rgb(245, 239, 111), rgb(240, 185, 28));
  }

}
.progress-animation-els {
  position: absolute;
  z-index: 3;
  top: 1.125rem;
  left: -15px;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 0;
}

/* 靠右从底部向上 */
@keyframes bottomToTopFromRight {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  78% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-60px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-80px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}

/* 向右偏移10px 自底向上 */
@keyframes bottomToTopFromRight10 {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  68% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-15px);
    transform-origin: 0;
  }

  88% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-50px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-75px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}

/* 向右偏移30px 自底向上 */
@keyframes bottomToTopFromRight30 {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  68% {
    transform: rotate(0) scale(1) translateX(30px) translateY(-15px);
    transform-origin: 0;
  }

  88% {
    transform: rotate(0) scale(1) translateX(30px) translateY(-50px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(30px) translateY(-75px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}

/* 向右偏移50 自底向上 */
@keyframes bottomToTopFromRight50 {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  48% {
    transform: rotate(0) scale(1) translateX(50px) translateY(-15px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(50px) translateY(-50px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}

/* 向左偏移10 自底向上 */
@keyframes bottomToTopFromLeft10 {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  48% {
    transform: rotate(0) scale(1) translateX(-10px) translateY(-5px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(-10px) translateY(-60px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}

/* 向左偏移10 然后向右偏移10 自底向上 */
@keyframes bottomToTopFromLeft10Right10 {
  0% {
    transform: rotate(0) scale(0) translateX(0);
  }

  38% {
    transform: rotate(0) scale(1) translateX(-10px) translateY(-5px);
    transform-origin: 0;
    opacity: 1;
  }

  100% {
    transform: rotate(0) scale(1) translateX(10px) translateY(-80px);
    transform-origin: 50% -80px;
    opacity: 0;
  }
}
</style>