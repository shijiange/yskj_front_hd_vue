<template>
  <van-popup
    v-model="showPopup"
    class="reward-popup"
    position="bottom"
    round
    @close="closePopup"
    closeable
    :zIndex="9"
  >
    <div class="reward-target">
      <van-image class="reward-target_avatar" :src="avatar" width="2.8rem" height="2.8rem" round></van-image>
      <div class="ellipsis1">{{ nickname }}</div>
      <ul class="reward-form">
        <li class="reward-form-item">
          <div class="reward-form_title">奖励类型</div>
          <div class="reward-form_content">
            <van-radio-group v-model="rewardType" direction="horizontal" checked-color=" #ef3532">
              <van-row type="flex" justify="space-between" style="width: 100%;">
                <van-col v-for="(creditItem,creditKey) in rewardCredits" :key="creditKey">
                  <van-radio :name="creditKey">{{ creditItem }}</van-radio>
                </van-col>
              </van-row>
            </van-radio-group>
          </div>
        </li>
        <li class="reward-form-item">
          <div class="reward-form_title">奖励数量</div>
          <div class="reward-form_content reward-form_count">
            <span>奖励数量</span>
            <input type="number" placeholder="请输入奖励数量" v-model="rewardCount" />
          </div>
        </li>
      </ul>
      <golden-button
        class="reward-confirm"
        width="15.64rem"
        height="2.75rem"
        fontSize="1.14rem"
        @click="condirmReward"
      >确认{{ rewardName }}</golden-button>
    </div>
  </van-popup>
</template>

<script>
import { Image as VanImage } from "vant";
import GoldenButton from "./GoldenButton";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    contentId: {
      type: Number,
      default: null
    },
    rewardName: {
      type: String,
      default: "打赏"
    },
    rewardCredits: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showPopup: false,
      rewardType: null,
      rewardCount: null
    };
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    condirmReward() {
      let rewardLoading = this.$toast.loading({
        duration: 0,
        overlay: true
      });
      $http.post("plugin.new-media-advertising.frontend.media-advertisingt.reward", {
        advertisingt_id: this.contentId,
        reward_type: this.rewardType,
        reward_number: this.rewardCount
      }).then(res => {
        rewardLoading.clear();
        if (res.result == 0) {
          this.$toast(res.msg);
          return;
        }
        this.$toast(this.rewardName + "成功");
      }).catch(() => {
        rewardLoading.clear();
      });
    }
  },
  watch: {
    show(newValue) {
      this.showPopup = newValue;
    }
  },
  components: {
    VanImage,
    GoldenButton
  }
};
</script>

<style scoped>
/* 打赏 */
.reward-popup {
  padding: 1.1rem;
  color: white;
  font-size: 1.06rem;
  background-image: linear-gradient(0deg, #eb160a 0%, #f96822 100%);
}

.reward-target {
  width: 100%;
}

.reward-target_avatar {
  flex-shrink: 0;
  margin-bottom: 0.6rem;
}

.reward-form {
  margin-top: 1.06rem;
  padding: 1.06rem;
  color: #272727;
  text-align: left;
  border-radius: 0.64rem;
  background-color: white;
}

.reward-form-item:not(:first-child) {
  margin-top: 1.78rem;
}

.reward-form_title {
  color: #ef3532;
  font-size: 0.94rem;
  text-align: left;
}

.reward-form_content {
  margin-top: 1.13rem;
  font-size: 0.94rem;
}

.reward-form_count span {
  padding-right: 1.3rem;
}

.reward-form_count input {
  width: calc(100% - 5.5rem);
  border: none;
}

.reward-confirm {
  margin: 2.4rem auto 0;
}
</style>