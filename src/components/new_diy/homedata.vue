<template>
  <div :class="className">
    <div class="html-box" v-if="datas.list">

      <div style="text-align: center; font-size: 18px; min-height: 30px;" v-if="datas.list.length <= 0">请设置显示板块内容</div>
      <template v-for="item in datas.list">
        <component
          :is="item.uikey" :parent_id="id"
          :id="item.id" :key="item.id"
          :datas="handleDatas(item.datas)">
        </component>
      </template>

    </div>
  </div>
</template>

<script>
import C_statistics from './component/statistics';

export default {
  props: ["id", "datas"],
  data() {
    return {
    };
  },
  computed: {
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  components: {
    C_statistics
  },
  methods: {
    // 功能数据
    handleDatas(old_data) {
      // 如果有配置项的话
      let new_datas = {};
      if (old_data) {
        Object.keys(old_data).map(key => {
          new_datas[key] = old_data[key].value;
        });
      }
      return new_datas;
    },
  },
};
</script>

<style lang="scss" scoped>
  * {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  // 默认
  .component-wrapper {
    width: 100%;
  }

  .data-item {
    padding: 10px 15px;
    font-size: 15px;
    text-align: left;

    .price {
      color: #f56c6c;
      font-size: 16px;
    }
  }
</style>
