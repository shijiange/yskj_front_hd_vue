<template>
  <div id="showsign">
    <template v-if="signdata.bgimg">
      <img :src="signdata.bgimg" style="width: 100%; height: 100%; display: block;" />
    </template>
    <div @click="signnow" :style="{ background: signdata.bgcolor }">
      <h1
        v-bind:style="{ color: signdata.textcolor, 'font-weight': signdata.fontweight, 'font-size': signdata.fontsize }"
      >
        {{ signdata.text }}
      </h1>
      <span>{{ signdata.button_hint }}</span>
    </div>
    <header>
      <span>{{ signdata.award == 1 ? `今日${signdata.sign_name}奖励:${signdata.award_content}` : '' }}</span>
    </header>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  props: ['datas'],
  data() {
    return {
      signdata: {},
      clickTag: false
    };
  },
  mounted() {
    this.signdata = this.datas.params;
  },
  methods: {
    signnow() {
      if (this.clickTag) {
        //防止快速点击
        return;
      }
      this.clickTag = true;
      $http.get('plugin.sign.Frontend.Modules.Sign.Controllers.sign.sign').then(res => {
        if (res.result == 1) {
          this.signdata.text = `已${this.signdata.sign_name}`;
          let numDate = Number(this.signdata.button_hint.replace(/[^0-9]/gi, ''));
          this.signdata.button_hint = numDate + 1 + '天';
          let reslink = res.data.success_url;
          this.$dialog.alert({ message: res.msg})
            .then(() => {
              setTimeout(function() {
                self.location = reslink;
              }, 1000);
            }).catch(() => {});
        } else if (res.result == 0) {
          Toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#showsign {
  width: 100%;
  height: 13rem;
  z-index: 100;
  position: relative;

  div {
    width: 4.75rem;
    height: 4.75rem;
    border-radius: 50%;
    position: absolute;
    top: 20%;
    left: calc(50% - 2.375rem);

    h1 {
      margin: 0.7rem 0 0.5rem 0;
    }
  }

  header {
    width: 100%;
    position: absolute;
    top: 70%;
    left: 0;
    color: #fff;
    height: 1.9rem;

    span {
      display: inline-block;
      line-height: 1.9rem;
      background: rgba(138, 138, 138, 0.4);
      padding: 0 0.5rem;
      border-radius: 0.5rem;
    }
  }
}
</style>
