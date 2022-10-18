<template>
  <div id="loadding" v-show="value || show">
    <div class="loader">
      <!--<div class="text">Loading</div>-->
      <div class="horizontal">
        <div class="circlesup">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations } from "vuex";

export default {
  props: ["show"],
  data() {
    return {};
  },
  computed: {
    value: {
      get: function() {
        //getter读取数据
        if (this.$store.state.isloadding) {
          // this.isshow = true;  不要在computed中改变值
          return true;
        } else {
          // this.isshow = false;
          return false;
        }
      },

      set: function(val) {
        console.log(val, "触发");
      }
    }
  },
  activated() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  /* Start the loader code, first, let's align it the center of screen */
  .loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    /* disable selection and cursor changes */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    z-index: 9999;
  }

  /* Text align it the center of screen and connect the looped animation for 2 seconds */
  .text {
    position: fixed;
    left: -2.1rem;
    top: -1.7rem;
    -webkit-animation: text 2s infinite;
    -moz-animation: text 2s infinite;
    -ms-animation: text 2s infinite;
    -o-animation: text 2s infinite;
    animation: text 2s infinite;
  }

  /* Set for the second layer horizontal position */
  .horizontal {
    position: fixed;
    top: -2.5rem;
    left: -2rem;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  /* The next two classes do mirror for animation */
  .circlesup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* Create a container for our circles, rotate it 45 degrees and set animation */
  .circle {
    position: fixed;
    width: 3rem;
    height: 3rem;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-animation: orbit 2s infinite;
    -moz-animation: orbit 2s infinite;
    -ms-animation: orbit 2s infinite;
    -o-animation: orbit 2s infinite;
    animation: orbit 2s infinite;
    z-index: 5;
  }

  /* Style's of our circles */
  .circle::after {
    content: "";
    position: fixed;
    width: 15px;
    height: 15px;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    -o-border-radius: 100%;
    border-radius: 100%;
    background: #d33047; /* Pick a color 1 */
  }

  .circle:nth-child(2) {
    -webkit-animation-delay: 100ms;
    -moz-animation-delay: 100ms;
    -ms-animation-delay: 100ms;
    -o-animation-delay: 100ms;
    animation-delay: 100ms;
    z-index: 4;
  }

  .circle:nth-child(2)::after {
    background: #ff3d38; /* Pick a color 2 */
    -webkit-transform: scale(0.8, 0.8);
    -moz-transform: scale(0.8, 0.8);
    -ms-transform: scale(0.8, 0.8);
    -o-transform: scale(0.8, 0.8);
    transform: scale(0.8, 0.8);
  }

  .circle:nth-child(3) {
    -webkit-animation-delay: 225ms;
    -moz-animation-delay: 225ms;
    -ms-animation-delay: 225ms;
    -o-animation-delay: 225ms;
    animation-delay: 225ms;
    z-index: 3;
  }

  .circle:nth-child(3)::after {
    background: #ffa489; /* Pick a color 3 */
    -webkit-transform: scale(0.6, 0.6);
    -moz-transform: scale(0.6, 0.6);
    -ms-transform: scale(0.6, 0.6);
    -o-transform: scale(0.6, 0.6);
    transform: scale(0.6, 0.6);
  }

  .circle:nth-child(4) {
    -webkit-animation-delay: 350ms;
    -moz-animation-delay: 350ms;
    -ms-animation-delay: 350ms;
    -o-animation-delay: 350ms;
    animation-delay: 350ms;
    z-index: 2;
  }

  .circle:nth-child(4)::after {
    background: #ff6d37; /* Pick a color 4 */
    -webkit-transform: scale(0.4, 0.4);
    -moz-transform: scale(0.4, 0.4);
    -ms-transform: scale(0.4, 0.4);
    -o-transform: scale(0.4, 0.4);
    transform: scale(0.4, 0.4);
  }

  .circle:nth-child(5) {
    -webkit-animation-delay: 475ms;
    -moz-animation-delay: 475ms;
    -ms-animation-delay: 475ms;
    -o-animation-delay: 475ms;
    animation-delay: 475ms;
    z-index: 1;
  }

  .circle:nth-child(5)::after {
    background: #db2f00; /* Pick a color 5 */
    -webkit-transform: scale(0.2, 0.2);
    -moz-transform: scale(0.2, 0.2);
    -ms-transform: scale(0.2, 0.2);
    -o-transform: scale(0.2, 0.2);
    transform: scale(0.2, 0.2);
  }

  /* Animation keys */
  @-webkit-keyframes orbit {
    0% {
      -webkit-transform: rotate(45deg);
    }

    5% {
      -webkit-transform: rotate(45deg);
      -webkit-animation-timing-function: ease-out;
    }

    70% {
      -webkit-transform: rotate(405deg);
      -webkit-animation-timing-function: ease-in;
    }

    100% {
      -webkit-transform: rotate(405deg);
    }
  }

  @keyframes orbit {
    0% {
      transform: rotate(45deg);
    }

    5% {
      transform: rotate(45deg);
      animation-timing-function: ease-out;
    }

    70% {
      transform: rotate(405deg);
      animation-timing-function: ease-in;
    }

    100% {
      transform: rotate(405deg);
    }
  }

  @-webkit-keyframes text {
    0% {
      -webkit-transform: scale(0.2, 0.2);
      -webkit-animation-timing-function: ease-out;
    }

    40%,
    60% {
      -webkit-transform: scale(1, 1);
      -webkit-animation-timing-function: ease-out;
    }

    70%,
    100% {
      -webkit-transform: scale(0.2, 0.2);
    }
  }

  @-moz-keyframes text {
    0% {
      -moz-transform: scale(0.2, 0.2);
      -moz-animation-timing-function: ease-out;
    }

    50% {
      -moz-transform: scale(1, 1);
      -moz-animation-timing-function: ease-out;
    }

    60% {
      -moz-transform: scale(1, 1);
      -moz-animation-timing-function: ease-out;
    }

    100% {
      -moz-transform: scale(0.2, 0.2);
    }
  }

  @keyframes text {
    0% {
      transform: scale(0.2, 0.2);
      animation-timing-function: ease-out;
    }

    50% {
      transform: scale(1, 1);
      animation-timing-function: ease-out;
    }

    60% {
      transform: scale(1, 1);
      animation-timing-function: ease-out;
    }

    100% {
      transform: scale(0.2, 0.2);
    }
  }
</style>
