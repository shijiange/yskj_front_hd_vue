<!-- 拼团列表组件 -->
<template>
  <div id="group-cell">
    <img :src="thumb" alt="" />
    <div class="group-cell-right">
      <div class="group-cell-title">{{ title }}</div>
      <div class="group-cell-price">
        <em>{{ $i18n.t("money") }}</em
        >{{ price }}
      </div>
      <div class="group-cell-other">
        <div class="group-cell-total"><i class="iconfont icon-fontclass-renshu1"></i>{{ total }}人</div>
        <div class="group-cell-btn" @click.stop="gotoUrl">去参团</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    thumb: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    price: {
      type: String,
      default: ""
    },
    total: {
      type: [String, Number],
      default: ""
    },
    id: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  methods: {
    gotoUrl() {
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#group-cell {
  background: #fff;
  border-radius: 0.625rem;
  overflow: hidden;
  padding: 0.625rem;
  display: flex;
  margin: 0.625rem 0.875rem 0;

  img {
    width: 5.313rem;
    height: 5.313rem;
    background-color: #cfcfcf;
    border-radius: 0.313rem;
    flex-shrink: 0;
  }

  .group-cell-right {
    padding-left: 0.625rem;
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .group-cell-title {
      height: 2.1875rem;
      line-height: 1.125rem;
      font-size: 14px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .group-cell-price {
      color: #f14e4e;
      font-size: 16px;

      em {
        font-size: 12px;
      }
    }

    .group-cell-other {
      display: flex;
      justify-content: space-between;

      .group-cell-total {
        color: #f28613;

        i {
          padding-right: 0.25rem;
        }
      }

      .group-cell-btn {
        width: 3.438rem;
        height: 1.438rem;
        line-height: 1.438rem;
        background-color: #f14e4e;
        border-radius: 0.2rem;
        color: #fff;
        text-align: center;
      }
    }
  }
}
</style>
