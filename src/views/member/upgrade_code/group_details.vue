<template>
  <div class="group-details" v-if="pageShow">
    <c-title text="升级码"></c-title>
    <img
      src="../../../assets/images/member/upgrade_code/code_top_bgimg@2x.png"
      class="page-bgimg"
      srcset="../../../assets/images/member/upgrade_code/code_top_bgimg@3x.png 3x"
    />
    <div class="group-main">
      <p class="group-name">{{ codes.code.code.name }}</p>
      <img class="group-qrcode" :src="codes.qr_code" />
      <p class="group-scan-prompt">扫码升级</p>
      <div class="group-level">
        <div class="group-level-title">升级等级</div>
        <div
          class="group-level-description"
        >{{ codes.code._level_text }}</div>
      </div>
      <div class="group-module-decoration" v-if="isFromShare===false&&isCodeMember===true">
        <div class="group-module-decoration-circle"></div>
        <div class="group-module-decoration-connect"></div>
        <div class="group-module-decoration-circle"></div>
      </div>
    </div>
    <div class="group-footer" v-if="isFromShare===false&&isCodeMember===true">
      <ul class="group-codes-count">
        <li class="group-codes-count-item">
          <p class="group-codes-count-number">{{ codes.code.num - codes.code.used_num }}个</p>
          <p>剩余数量</p>
        </li>
        <li class="group-codes-count-item">
          <p class="group-codes-count-number">{{ codes.code.used_num }}个</p>
          <p class="group-codes-count-title">已使用</p>
        </li>
      </ul>
      <button class="group-view-used-log" @click="viewUsedLog">使用记录</button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  activated() {
    if (this.$route.query.key && this.$route.query.codes_id) {
      this.codesKey = this.$route.query.key;
      this.isFromShare = true;
      this.getCodesDetailsByKey();
    } else if (this.$route.query.codes_id) {
      this.codesId = this.$route.query.codes_id;
      this.getCodesDetails();
    } else {
      Toast.fail("升级码不存在");
      this.$router.go(-1);
    }
  },
  data() {
    return {
      codesKey: null,
      codesId: null,
      codes: null,
      pageShow: false, //* 页面是否可以展示
      isFromShare: false, //* 是否是分享链接进来的
      isCodeMember: false, //* 是否是二维码所属用户
      memberId: 0
    };
  },
  methods: {
    getCodesDetails() {
      const PageLoading = Toast.loading();
      $http
        .post("plugin.upgrade-code.Frontend.controllers.code.index", {
          id: this.codesId,
          basic_info: 0,
          validate_page: 0
        })
        .then(async ({ data, msg, result }) => {
          if (result === 0) {
            Toast.fail(msg);
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
            return;
          }
          if (!data) {
            Toast.fail("升级码不存在");
            this.$router.go(-1);
          }
          data.code["_level_text"] = "";
          if (data.code["member_level"] && data.code["dividend_level"]) {
            data.code["_level_text"] = data.code["member_level"]["level_name"] + " + " + data.code["dividend_level"]["level_name"];
          } else if (data.code["member_level"]) {
            data.code["_level_text"] = data.code["member_level"]["level_name"];
          } else if (data.code["dividend_level"]) {
            data.code["_level_text"] = data.code["dividend_level"]["level_name"];
          }
          this.memberId = data.code.member_id;
          this.codes = data;
          await this.initShare();
          this.pageShow = true;
          PageLoading.close();
        });
    },
    getCodesDetailsByKey() {
      const PageLoading = Toast.loading();
      $http
        .post("plugin.upgrade-code.Frontend.controllers.code.share", {
          key: this.codesKey
        })
        .then(async ({ data, msg, result }) => {
          if (result === 0) {
            Toast.fail(msg);
            this.$router.go(-1);
            return;
          }
          if (!data) {
            Toast.fail("升级码不存在");
            this.$router.go(-1);
          }
          this.codes = data;
          let that = this;
          await that.fun.wxShare(
            "",
            { mid: that.fun.getKeyByMid() },
            {
              title: "升级码",
              link: location.href + "&share_tag=2&key=" + that.codes.code.key,
              imgUrl: that.codes.qr_code,
              description: "好友邀请您升级啦"
            },
            data => {
              if (data.info.uid == that.memberId) {
                that.isCodeMember = true; //客服重新赋值
              }
            }
          );
          this.pageShow = true;
          PageLoading.close();
        });
    },
    viewUsedLog() {
      this.$router.push(
        this.fun.getUrl(
          "MemberUpgradeCodeUsedLog",
          {},
          {
            codes_id: this.codesId
          }
        )
      );
    },
    //初始化分享设置
    async initShare() {
      let url = this.fun.isIosOrAndroid() === "android" ? window.location.href + "&key=" + this.codes.code.key : window.initUrl + "&key=" + this.codes.code.key;
      let json = {
        url,
        mid: this.fun.getKeyByMid()
      };
      await $http.post("member.member.wxJsSdkConfig", json).then(response => {
        if (response.data.info.uid == this.memberId) {
          this.isCodeMember = true;
        }
        if (response.result === 1) {
          if (response.data.config && response.data.config.appId) {
            this.share(response.data);
          }
        } else {
          console.error(response.msg);
        }
      });
    },
    //组装分享设置
    share(data) {
      wx.config(data.config);
      wx.ready(() => {
        const shareImage = this.codes.qr_code;
        const shareTitle = "升级码";
        let shareDescription = "好友邀请您升级啦";
        let shareLink = location.href + "&share_tag=2&key=" + this.codes.code.key;
        shareLink = this.fun.isMid(shareLink, data.info.uid);
        wx.updateAppMessageShareData({
          title: shareTitle,
          link: shareLink,
          desc: shareDescription,
          imgUrl: shareImage
        });

        wx.showOptionMenu();
        wx.hideMenuItems({
          menuList: ["menuItem:copyUrl"]
        });
        wx.updateTimelineShareData({
          title: shareTitle,
          link: shareLink,
          imgUrl: shareImage
        });
      });
    }
  }
};
</script>

<style scoped>
.group-details {
  padding: 5.31rem 0 2.31rem;
  min-height: 100vh;
  background-color: #9a7aff;
}

.page-bgimg {
  position: absolute;
  z-index: 0;
  top: 0.59rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 17.5rem;
}

.group-main {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  padding: 1.53rem 1.09rem;
  width: 21.56rem;

  /* height: 20.94rem; */
  background-color: #fff;
  border-radius: 0.31rem;
}

.group-name {
  font-size: 1.88rem;
  color: #9a7aff;
  font-weight: bold;
  text-shadow: #5e34e2 1.5px 1.5px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.group-qrcode {
  margin-top: 1.22rem;
  width: 9.66rem;
  height: 9.66rem;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 0 15px rgba(20, 20, 20, 0.2);
}

.group-scan-prompt {
  margin-top: 0.78rem;
  font-size: 0.81rem;
  color: #666;
}

.group-level {
  margin-top: 0.91rem;
  text-align: left;
}

.group-level-title {
  position: relative;
  padding-left: 0.41rem;
  width: 100%;
  overflow: hidden;
  font-size: 1.13rem;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.group-level-title::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  margin: auto 0;
  width: 0.19rem;
  height: 0.94rem;
  background: #9a7aff;
}

.group-level-description {
  margin-top: 0.29rem;
  font-size: 0.81rem;
  color: #333;
}

.group-module-decoration {
  position: absolute;
  bottom: -2.28rem;
  left: 2rem;
  right: 2rem;
  width: calc(100% - 4rem);
  height: 3.31rem;

  /* background: white; */
}

.group-module-decoration div {
  position: relative;
}

.group-module-decoration-circle {
  height: 0.72rem;
}

.group-module-decoration-circle::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 50%;
  background: #9a7aff;
}

.group-module-decoration-circle::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 50%;
  background: #9a7aff;
}

.group-module-decoration-connect {
  height: 1.87rem;
}

.group-module-decoration-connect::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
  width: 0.66rem;
  height: 1.25rem;
  background: white;
}

.group-module-decoration-connect::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  right: 0;
  width: 0.66rem;
  height: 1.25rem;
  background: white;
}

.group-footer {
  margin: 1.25rem auto 0;
  padding: 1.47rem 1.34rem 1.53rem;
  width: 21.56rem;
  background-color: #fff;
  border-radius: 0.31rem;
}

.group-codes-count {
  display: grid;
  grid-template-columns: repeat(5, 50%);
  line-height: 0.82rem;
  font-size: 0.81rem;
  color: #333;
}

.group-codes-count-number {
  margin-bottom: 0.47rem;
  padding: 0 0.315rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.94rem;
  font-weight: 600;
  text-overflow: ellipsis;
}

.group-view-used-log {
  margin-top: 1.47rem;
  padding: 0.78rem;
  width: 100%;
  font-size: 0.94rem;
  color: white;
  background: #9a7aff;
  border-radius: 25rem;
  border: none;
  outline: none;
}

.group-view-used-log:active {
  filter: brightness(95%);
}
</style>