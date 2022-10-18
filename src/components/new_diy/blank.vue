<template>
  <div>
    <div :style="wrapper_style"></div>
  </div>
</template>

<script>
export default {
  props: ['id', 'datas'],
  data() {
    return{
    };
  },
  computed: {
    /** 样式 */
    wrapper_style() {
      const {
        preview_color,
        search_height
      } = this.datas;

      return `
                width: 100%;
                height: ${search_height}px;
                background-color: ${preview_color.color};
                background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
                background-size: 100% auto;
                bakcground-position: center;
            `;
    },
  },
  methods: {
  },

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
