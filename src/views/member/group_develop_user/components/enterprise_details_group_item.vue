<template>
  <div class="item">
    <div class="group_img">
      <img :src="item.customer_avatar" alt="" />
    </div>
    <div class="wrapper">
      <div class="info">
        <div class="name">
          <div class="text">{{ item.customer_nickname || item.we_nickname }}</div>
          <div class="label" v-if="level == 0 && item.is_owner == 1">群主</div>
        </div>
        <div class="time">加入时间:{{ item.join_time_str }}</div>
      </div>
      <div class="status">
        <div class="label">{{ item.join_scene_desc }}</div>
        <div class="label" v-if="item.is_bind == 1 && item.is_fans == 1">粉丝</div>
        <div class="label">{{ item.is_old == 0 ? "新会员" : "老会员" }}</div>
        <div class="label" :class="{ gray: item.gray == 0 }">{{ item.status_desc }}</div>
      </div>
    </div>
    <div class="qrcode" v-if="level == 0" @click="seeMemberInfo">
      查看
    </div>
  </div>
</template>

<script>
export default {
  props: ["level", "item"],
  data() {
    return {};
  },
  created() {},
  methods: {
    seeMemberInfo() {
      this.$emit("handSee", this.item);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.item {
  display: flex;
  width: 100%;
  background-color: #fff;

  .group_img {
    width: 2.813rem;
    height: 2.813rem;

    img {
      width: 2.813rem;
      height: 2.813rem;
      background-color: #d0d0d0;
      border-radius: 0.125rem;
    }
  }

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0.625rem;
    text-align: left;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 2.813rem;

      .name {
        display: flex;

        .text {
          font-size: 0.938rem;
          color: #333;
          font-weight: 600;
        }

        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 1.125rem;
          margin-left: 0.5rem;
          font-size: 0.75rem;
          color: #fff;
          background-image: linear-gradient(90deg, #ff762a 0%, #ffa210 100%);
          border-radius: 0.188rem;
        }
      }

      .time {
        font-size: 0.75rem;
        color: #999;
      }
    }

    .status {
      display: flex;
      margin-top: 0.3rem;

      .label {
        padding: 0.2rem 0.35rem;
        margin-left: 0.625rem;
        color: #38a5fa;
        font-size: 0.688rem;
        background-color: #e3f2fe;
        border-radius: 0.125rem;

        &.gray {
          color: #7e7e7e;
          background-color: #ededed;
        }

        &:nth-child(1) {
          margin-left: 0;
        }
      }
    }
  }

  .qrcode {
    font-size: 0.75rem;
    color: #f14e4e;
  }
}
</style>
