<!-- 玩法介绍 步骤条组件 -->
<template>
  <div>
    <div class="group_play" :class="{ group_play1: goods_type == 'grab_group' }">
      <h2>{{ stepConfig.title }}</h2>
      <ul class="play">
        <li v-for="(item, i) in stepConfig.list" :key="i" :class="{ border_lr: goods_type == 'grab_group' && i == 1 }">
          <span>{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepConfig: {
      type: Object,
      default: () => ({})
    },
    goods_type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },

  // activated: {},

  components: {},

  computed: {},

  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.group_play {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.875rem;

  h2 {
    font-weight: normal;
    font-size: 15px;
    margin-bottom: 0.625rem;
    text-align: left;
  }

  .play {
    background: #fafafa;
    display: flex;
    padding: 0.375rem;

    li {
      width: 33.3%;
      margin-right: 0.25rem;
      color: #8c8c8c;
      text-align: left;
      display: flex;
      align-items: center;

      span:first-child {
        display: inline-table;
        width: 1rem;
        height: 1rem;
        color: #fff;
        font-size: 12px;
        border-radius: 1rem;
        background: #8c8c8c;
        text-align: center;
        margin-right: 0.375rem;
      }

      span:last-child {
        width: 5.625rem;
      }
    }

    li:last-child {
      margin: 0;
    }
  }
}

.group_play1 {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.875rem;

  h2 {
    font-weight: normal;
    font-size: 15px;
    margin-bottom: 0.625rem;
    text-align: left;
    color: #000;
  }

  .play {
    display: flex;
    padding: 0.375rem;

    li {
      width: 33.3%;
      margin-right: 0.25rem;
      color: #333;
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      span:first-child {
        display: inline-table;
        width: 1rem;
        height: 1rem;
        color: #ff6333;
        font-size: 12px;
        border-radius: 1rem;
        background: rgba(255, 96, 0, 0.1);
        text-align: center;
        margin-right: 0.375rem;
      }

      span:last-child {
        width: 5.625rem;
        text-align: center;
        line-height: 1rem;
        margin-top: 0.5rem;
      }
    }

    li:last-child {
      margin: 0;
    }

    .border_lr::before,
    .border_lr::after {
      content: "";
      position: absolute; /* 定位背景横线的位置 */
      top: 0.5rem;
      background: #ccced0; /* 背景横线颜色 */
      width: 70%; /* 单侧横线的长度 */
      height: 1px;
    }

    .border_lr::before {
      left: -40%; /* 调整背景横线的左右距离 */
    }

    .border_lr::after {
      right: -40%;
    }
  }
}
</style>
