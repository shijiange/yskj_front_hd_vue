<!-- 测肤程度指数 进度条 -->
<template>
  <div id="skin_circle">
    <div class="skin_circle-main">
      <div class="skin-circle-main-child skin-circle-main-line">
        <template v-if="datas.type_id == 3">
          <template v-if="datas.target_value.constructor == Object">
            <div
              class="skin-circle-white"
              v-for="(child, d, i) in datas.target_value"
              :key="i"
              :style="{ left: (100 / Object.keys(datas.target_value).length) * (i + 1) + '%' }"
            ></div>
          </template>
          <template v-if="datas.target_value.constructor == Array">
            <div
              class="skin-circle-white"
              v-for="(child, i) in datas.target_value"
              :key="i"
              :style="{ left: (100 / datas.target_value.length) * (i + 1) + '%' }"
            ></div>
          </template>
        </template>
      </div>
      <template v-if="datas.key != 'skinAge'">
        <div
          class="round-box"
          :style="{
            left:
              ((datas.key != 'skinType' ? Number(datas.value) : Number(datas.value) + 1) /
                Object.keys(this.datas.target_value).length) *
                100 -
              100 / (2 * Object.keys(this.datas.target_value).length) +
              '%'
          }"
        >
          <div class="board"><em></em>{{ !fun.isTextEmpty(datas.value_desc) ? datas.value_desc : datas.value }}</div>
          <div class="round"></div>
        </div>
      </template>
      <template v-if="datas.key == 'skinAge'">
        <div class="round-box" :style="{ left: (Number(datas.value) < 100 ? Number(datas.value) : 100) + '%' }">
          <div class="board"><em></em>{{ !fun.isTextEmpty(datas.value_desc) ? datas.value_desc : datas.value }}</div>
          <div class="round"></div>
        </div>
      </template>
    </div>
    <div class="skin_circle-main">
      <template v-if="datas.key != 'skinAge'">
        <div class="skin-circle-main-text" v-for="(child, i) in datas.target_value" :key="i">{{ child }}</div>
      </template>
      <template v-if="datas.key == 'skinAge'">
        <div class="skin-circle-main-text" v-for="(child, i) in ageArr" :key="i">{{ child }}</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ageArr: ['10', '30', '50', '70', '90']
    };
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_circle {
  flex: 1;

  .skin_circle-main {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
    position: relative;

    .skin-circle-main-text {
      width: 32%;
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .skin-circle-main-child {
      height: 0.5rem;
      width: 32%;
      background-image: linear-gradient(90deg, #ffc3cc 0%, #fe5a73 100%);
      margin-bottom: 0.5rem;
      margin-top: 2rem;
    }

    // .skin-circle-main-child:nth-child(1) {
    //   background-image: linear-gradient(90deg, #ffc3cc 0%, #f85971 100%);
    //   border-radius: 0.25rem 0rem 0rem 0.25rem;
    // }
    // .skin-circle-main-child:nth-child(3) {
    //   border-radius: 0rem 0.25rem 0.25rem 0rem;
    //   background-image: linear-gradient(90deg, #f85971 0%, #fe5a73 100%);
    // }
    .skin-circle-main-line {
      width: 100%;
      border-radius: 0.25rem !important;
      position: relative;
    }

    .skin-circle-white {
      width: 0.375rem;
      height: 0.75rem;
      position: absolute;
      top: -2px;
      background: #fff;
    }

    .round-box {
      bottom: 0.375rem;
      position: absolute;

      .round {
        width: 0.625rem;
        height: 0.625rem;
        background: #fe5a73;
        border: 1px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #fff, 0 0 0 2px #fe5a73;
      }

      .board {
        // width: 2.25rem;
        padding: 0 0.5rem;
        // height: 1.125rem;
        line-height: 1rem;
        border-radius: 0.25rem;
        position: relative;
        background-color: #fe5a73;
        color: #fff;
        font-size: 0.75rem;
        margin-left: -0.75rem;
        margin-bottom: 0.625rem;

        em {
          display: block;
          border-width: 8px;
          position: absolute;
          bottom: -0.875rem;
          left: 0.625rem;
          border-style: solid dashed dashed;
          border-color: #fe5a73 transparent transparent;
          font-size: 0;
          line-height: 0;
        }
      }
    }
  }
}
</style>
