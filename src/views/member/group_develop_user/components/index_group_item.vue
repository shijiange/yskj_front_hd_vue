<template>
  <div class="item" @click="gotoDetails">
    <div class="group_img" v-if="false">
      <face-img></face-img>
    </div>
    <div class="wrapper">
      <div class="name">
        {{ item.group_name }} <span class="num">({{ item.member_count }}人)</span>
      </div>
      <div class="time">创建时间:{{ item.group_created_time_str }}</div>

      <div class="lockguest" v-if="level == 0">
        <div class="text">锁客会员：</div>
        <div class="member" v-if="item.group_owner_member_uid">
          <img :src="item.group_owner_member_avatar" alt="" />
          {{ item.group_owner_member_nickname }}
        </div>
        <div class="member" v-else>无</div>
      </div>
      <div class="lockguest" v-if="level == 1">
        <!-- <div class="text">群主：</div>
        <div class="member">
          <img :src="item.group_owner_avatar" alt="" />
          {{ item.group_owner_nickname }}
        </div> -->
        <div class="text">邀请会员数：</div>
        <div class="member">{{ item.has_many_member_log_count }}</div>
      </div>
    </div>
    <div class="qrcode" @click.stop="showQrcode(1)" v-if="share">
      <i class="iconfont icon-zb_all_share"></i>
    </div>
    <div class="qrcode" @click.stop="showQrcode(0)">
      <i class="iconfont icon-fontclass-erweima"></i>
    </div>
  </div>
</template>

<script>
import faceImg from "./faceImg";
export default {
  props: ["level", "item", "share"],
  data() {
    return {};
  },
  components: { faceImg },
  created() {},
  methods: {
    showQrcode(status) {
      this.$emit("handQrcode", { id: this.item.id, is_worker: status });
    },
    gotoDetails() {
      this.$router.push(this.fun.getUrl("gduEnterpriseDetails", {}, { level: this.level, group_id: this.item.id }));
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.item {
  display: flex;
  width: 100%;
  height: 5rem;
  padding: 0.625rem;
  background-color: #fff;
  box-shadow: 0 0.031rem 0.5rem 0 rgba(216, 216, 216, 0.41);
  border-radius: 0.313rem;

  .group_img {
    width: 3.125rem;
    height: 3.125rem;
    background-color: #e7e7e7;
  }

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0.625rem;
    text-align: left;

    .name {
      font-size: 0.938rem;
      color: #333;

      .num {
        font-size: 0.75rem;
        color: #999;
      }
    }

    .time {
      margin-top: 0.1rem;
      font-size: 0.75rem;
      color: #999;
    }

    .lockguest {
      display: flex;
      align-items: center;
      margin-top: 0.3rem;
      font-size: 0.75rem;
      color: #999;

      .member {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: #333;

        img {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          margin-right: 0.144rem;
        }
      }
    }
  }

  .qrcode {
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 2.2rem;
      color: #222;
    }
  }
}
</style>
