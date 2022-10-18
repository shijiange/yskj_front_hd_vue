<template>
  <div v-show="!hidden">
    <div
      class="title-main"
      :class=" { 'title-border':border,'title-fixed':fixed,'title-inpc':fun.getPhoneEnv()==3 } "
    >
      <div class="title-left">
        <van-icon name="arrow-left" size="16px" v-if="back" @click="clickBack" />
        <slot name="left"></slot>
      </div>
      <div class="title-center">
        <div class="title-content van-ellipsis">
          {{ title }}
          <slot></slot>
        </div>
        <slot slot="center"></slot>
      </div>
      <div class="title-right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="title-placeholder" v-show="fixed"></div>
  </div>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: true
    },
    title:String
  },
  methods: {
    clickBack() {
      if(this.back===false){
        return;
      }
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else if (this.url) {
        this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style scoped>
.title-placeholder {
  height: 40px;
}

.title-border {
  border-bottom: 1px solid #ececec;
}

.title-fixed {
  position: fixed;
  top: 0;
  left: 0;
  margin: 0 auto;
}

.title-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 40px;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
}

.title-inpc {
  width: 375px;
  right: 0;
  bottom: 0;
}

.title-center {
  max-width: 60%;
  margin: 0 auto;
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.title-content {
  display: flex;
  align-items: center;
  height: inherit;
}
</style>