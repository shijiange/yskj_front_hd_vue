<template>
  <div>
    <van-overlay :show="isShowPosterDialog" class-name="generate-poster-dialog">
      <div class="poster-dialog-wrap" @click.self="closePosterDialog">
        <div class="poster-img" v-if="posterSrc">
          <van-image :src="posterSrc" radius="5"></van-image>
          <van-icon name="close" class="close-icon" @click="closePosterDialog"></van-icon>
        </div>
        <div class="select-member" v-if="autoPoster == '0' && !issetPoster">
          <p class="tip">*选择企业成员生成企业会员海报</p>
          <div class="avatars">
            <div
              class="avatar"
              v-for="(item, index) in memberList" :key="item.id"
              :class="{'current-member': currentMemberIndex === index}"
              @click="currentMemberIndex=index"
              >
              <img
                :src="item.avatar ? item.avatar : photoMrImg" alt=""
              />
            </div>
          </div>
          <div class="confirm-btn" @click="generatePoster">确定</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {Image as VanImage} from "vant";
export default {
  props: {
    activityId: {
      type: [String, Number],
      default: ''
    },
    autoPoster: [String, Boolean],
    issetPoster: [String, Boolean],
    memberList: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  data () {
    return {
      isShowPosterDialog: false,
      currentMemberIndex: '',
      posterSrc: '',
    };
  },

  methods: {
    showDialog () {
      this.currentMemberIndex = '';
      if (this.autoPoster == 1 || this.issetPoster) {
        this.generatePoster();
      } else {
        this.isShowPosterDialog = true;
      }
    },
    closePosterDialog () {
      this.isShowPosterDialog = false;
    },
    generatePoster () {
      let memberId = this.memberList[this.currentMemberIndex] ? this.memberList[this.currentMemberIndex].id : '';
      $http.get("plugin.customer-increase.frontend.activity.getPoster", {
        id: this.activityId,
        staff_id: memberId
      }, "loading").then(res => {
        if (res.result == 0) {
          if (res.data.need_agent == 1) {
            return this.$dialog.confirm({
              message: "您目前不是推广员，需要成为推广员才能生成海报。"
            })
              .then(() => {
                this.$router.push(this.fun.getUrl("ExtensionApply", {}, {id: this.activityId}));
              });
          }
          if (res.data.need_member_level == 1) {
            let levelStr = res.data.member_level.join(",");
            return this.$dialog.confirm({
              message: `会员等级在【${levelStr}】才可以参与活动，您当前的会员等级暂不能参与活动，快去升级吧~`
            })
              .then(() => {
                this.$router.push(this.fun.getUrl("MemberGradeList", {}, {id: this.activityId}));
              });
          }
          return this.$toast(res.msg);
        }
        this.isShowPosterDialog = true;
        this.posterSrc = res.data.poster;
        this.$emit("generatePoster");
      });
    },

  },

  components: {
    VanImage
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.generate-poster-dialog {
  // top: 40px;
  z-index: 4;
  // height: calc(100% - 40px);
}
.poster-dialog-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    .poster-img {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15.63rem;
      height: 24.88rem;
      // background-color: #ffffff;
      border-radius: 0.51rem;
      .close-icon {
        position: absolute;
        right: -2rem;
        top: -2rem;
        color: #fff;
        font-size: 1.6rem;
      }
    }
    .select-member {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 1.5rem 1rem;
      // height: 8.13rem;
      background-color: #ffffff;
      border-radius: 0.63rem 0.63rem 0rem 0rem;
      text-align: center;
      .tip {
        color: #6c6c6c;
        text-align: left;
      }
      .avatars {
        display: flex;
        align-items: center;
        text-align: left;
        white-space: nowrap;
        padding-bottom: 1rem;
        height: 6.2rem;
        overflow-y: auto;
        overflow-x: visible;
      }
      .avatar {
        width: 2.19rem;
        height: 2.19rem;
        margin-left: 1.3rem;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .current-member {
        position: relative;
        border: 0.1rem solid #ff2c29;
      }
      .current-member::after {
        content: '当前会员';
        position: absolute;
        left: 50%;
        bottom: -1rem;
        padding: 0.2rem 0.3rem;
        transform: translateX(-50%);
        font-size: 0.625rem;
        line-height: 0.7rem;
        color: #ffffff;
        white-space: nowrap;
        background-color: #e52c29;
        border-radius: 0.56rem;
      }

      .confirm-btn {
        display: inline-block;
        color: #ffffff;
        margin: 0 auto;
        padding: 0.5rem 7rem;
        border-radius: 0.56rem;
        background-color: #ff2c29;
      }
    }
}
</style>