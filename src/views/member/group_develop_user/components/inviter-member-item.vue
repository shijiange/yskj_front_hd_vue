<template>
  <div class="item">
    <!-- <div class="group_img">
      <img :src="item.customer_avatar" alt="">
    </div> -->
    <div class="wrapper">
      <div class="info">
        <div class="name">
          <div class="text">会员昵称：{{ item.name }}</div>
        </div>
        <div class="time">群昵称：{{ item.group_name }}</div>
        <div class="time">加入时间:{{ item.join_time_str }}</div>
      </div>
      <div class="status">
        <template v-if="item.is_bind_business">
          <!-- is_bind_business: 是否绑定平台的群 0不是 1是，当不是绑定平台的群时，粉丝和新会员标签不显示 -->
          <div class="label" v-if="item.is_fans == 1">粉丝</div>
          <div class="label">{{ item.is_old == 0 ? "新会员" : "老会员" }}</div>
        </template>
        <div class="label">{{ item.join_scene == 1 ? "直接邀请" : item.is_old == 2 ? "邀请链接" : "扫描入群" }}</div>
        <div class="label" :class="{ gray: item.status == 2 }">{{ item.status == 1 ? "在群" : "退群" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
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
  box-shadow: 0 0.031rem 0.5rem 0 rgba(216, 216, 216, 0.41);
  padding: 0.625rem;
  border-radius: 0.313rem;

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
      line-height: 20px;
      // height: 2.813rem;

      .name {
        display: flex;

        .text {
          font-size: 0.938rem;
          color: #333;
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
