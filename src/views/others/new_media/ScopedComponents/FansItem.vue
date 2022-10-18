<template>
  <div class="item">
    <div class="face">
      <img :src="data.avatar" />
    </div>
    <div class="name">{{ data.nickname }}</div>
    <div class="cancel-btn" v-if="is_cancel && isFollower" @click="cancelFollow">取消关注</div>
  </div>
</template>

<script>
export default {
  props: {
    is_cancel: {
      default: true,
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      isFollower: true
    };
  },
  methods: {
    cancelFollow() {
      $http.post("plugin.new-media-advertising.frontend.media-advertisingt.cancel-attention", {
        advertisingt_member: this.data.member_id
      }).then(res => {
        if (res.result === 0) {
          this.$toast("取消关注失败");
          return;
        }
        this.isFollower = false;
        this.$toast("取消关注成功");
      });
    }
  }
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  padding: 0 0.6rem;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border-radius: 0.25rem;
}

.item .face {
  width: 1.5rem;
  height: 1.5rem;
}

.item .face img {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.item .name {
  flex: 1;
  padding-left: 0.45rem;
  font-size: 0.75rem;
  color: #3d3d3d;
  text-align: left;
}

.item .cancel-btn {
  display: flex;
  align-items: center;
  height: 1.15rem;
  padding: 0 0.425rem;
  color: #fff;
  font-size: 0.55rem;
  background-color: #f4a00e;
  border-radius: 0.575rem;
}
</style>