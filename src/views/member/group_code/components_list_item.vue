<template>
  <div class="wrapper">
    <div class="item" v-for="(item, i) in listData" @click="gotoGroupCodeLabel(item)" :key="i">
      <div class="image">
        <img alt="图片无效" v-if="item.member_id != 0" :src="item.has_one_member ? item.has_one_member.avatar_image : ''" />
        <img v-else :src="shop_log" alt="" />
      </div>
      <div class="content">
        <div class="text">
          <div class="name">{{ item.code_name }}</div>
          <div class="desc">{{ item.code_guide }}</div>
        </div>
        <div class="opt">
          <div class="btn">加入</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: function() {}
    },
    shop_log: {
      type: String,
      default: function() {}
    }
  },
  data() {},
  methods: {
    gotoGroupCodeLabel(item) {
      this.$router.push(this.fun.getUrl("groupCodeLabel", {}, { groupCodeId: item.id }));
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
  padding: 1rem 0.781rem;

  .item {
    width: 21.875rem;
    height: 5.031rem;
    display: flex;
    align-items: center;

    .image {
      width: 3.75rem;

      img {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
      }
    }

    .content {
      flex: 1;
      margin-left: 0.719rem;
      height: 3.75rem;
      display: flex;
      text-align: left;

      .text {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #333;
          flex: 1;
        }

        .desc {
          margin-top: 0.544rem;
          flex: 1;
          width: 13.438rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
        }
      }

      .opt {
        display: flex;
        align-items: center;

        .btn {
          margin-right: 1.313rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.125rem;
          height: 1.375rem;
          color: #fff;
          background-image: linear-gradient(#00b075, #00b075), linear-gradient(#ff6e65, #ff6e65);
          background-blend-mode: normal, normal;
          border-radius: 0.688rem;
        }
      }
    }
  }
}
</style>
