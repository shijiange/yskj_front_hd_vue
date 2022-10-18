<!--  -->
<template>
  <div>
    <!-- 使用H5页面中转，再跳转到Scheme实现打开小程序  -->
    <div v-if="isWeixin && !fun.isTextEmpty(info.gh_id)">
      <p style="padding: 40% 0 5%;">点击以下按钮打开小程序...</p>
      <wx-open-launch-weapp
        id="launch-btn"
        class="launch-btn"
        :username="info.gh_id"
        :path="info.path"
        @error="handleErrorFn"
        @launch="handleLaunchFn"
        @ready="readyFn"
      >
        <script type="text/wxtag-template">
          <style>.wx-btn {border:none; width: 8rem;height: 3rem;line-height: 3rem;display: block;margin: 0% auto 0;border-radius: 0.25rem;color: #fff;text-align: center;background-color: #07c160;}</style>
          <div> <button class="wx-btn">打开小程序</button>	</div>
        </script>
      </wx-open-launch-weapp>
    </div>
    <div v-else-if="!isMobile">
      <p style="padding: 40% 0 5%;">请在手机打开网页链接</p>
    </div>
    <div v-else>
      <p style="padding: 40% 0 5%;">正在打开小程序，请授权允许...</p>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      info: {},
      isWeixin: false,
      isMobile: false
    };
  },

  activated() {
    this.getData();
  },
  components: {},
  computed: {},
  methods: {
    getData() {
      var ua = navigator.userAgent.toLowerCase();
      var isWXWork = ua.match(/wxwork/i) == 'wxwork';
      this.isWeixin = !isWXWork && ua.match(/micromessenger/i) == 'micromessenger';
      if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
        this.isMobile = true;
      }
      let that = this;
      $http
        .get('plugin.link-tool.frontend.controllers.index.index', { id: this.$route.query.kdtId }, '')
        .then(response => {
          if (response.result === 1) {
            if (that.isWeixin) {
              that.initShare(response.data);
            } else if (!that.isMobile) {
              // 在 pc 上则给提示引导到手机端打开
              // Toast('不支持跳转微信小程序！')
              // that.$router.push(this.fun.getUrl('home', {}))
            } else {
              if (response.data.link) {
                location.href = response.data.link;
              } else {
                Toast('跳转失败');
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    readyFn(e) {
      console.log('readyFn', e.detail);
    },

    handleErrorFn(e) {
      console.log('fail', e.detail);
    },

    handleLaunchFn(e) {
      console.log('success');
    },
    // //初始化分享设置
    initShare(_data) {
      let that = this;
      let _url = document.location.href;
      $http.post('member.member.wxJsSdkConfig', { url: _url }).then(
        function(response) {
          if (response.result == 1) {
            if (response.data.config) {
              that.share(response.data, _data);
            }
          }
        },
        function(response) {
          console.log('报错', response);
        }
      );
    },
    //组装分享设置
    share(data, _info) {
      let that = this;
      data.config.openTagList = ['wx-open-launch-weapp']; //需要使用的开放标签列表
      wx.config(data.config);
      wx.ready(function() {
        that.info = _info;
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// .launch-btn {
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 1;
//   opacity: 0;
//   // background: red;
// }
.btn {
  width: 8rem;
  height: 3rem;
  line-height: 3rem;
  display: block;
  margin: 0 auto;
  border-radius: 0.25rem;
  color: #fff;
  text-align: center;
  background-color: #07c160;
}
</style>
