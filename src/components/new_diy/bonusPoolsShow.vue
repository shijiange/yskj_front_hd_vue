<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <div class="bonusPoolShow" v-if="datas.list">
      <!-- <div class="poollist" @click="routeLink(datas.monthly_link.link)">
        <span class="price"
          ><span class="smallp">{{ $i18n.t("money") }}</span> {{ datas.list.month }}</span
        >
        <span class="txt">当月营业额</span>
      </div> -->
      <div class="poollist" @click="routeLink(datas.income_link.link)">
        <span class="price"
          ><span class="smallp">{{ $i18n.t("money") }}</span> {{ datas.list.ad_pool }}</span
        >
        <span>传媒基金</span>
      </div>
      <div class="poollist" @click="routeLink(datas.bonus_link.link)">
        <span class="price"
          ><span class="smallp">{{ $i18n.t("money") }}</span> {{ datas.list.bonus_pool }}</span
        >
        <span>欢豆基金</span>
      </div>
      <div class="poollist" @click="routeLink(datas.performance_link.link)">
        <span class="price"
          ><span class="smallp">{{ $i18n.t("money") }}</span> {{ datas.list.team_pool }}</span
        >
        <span>分享基金</span>
      </div>
    </div>
  </div>
</template>
<script>
// 自定义样式
const css = function () {
  if (this.datas.preview_color) {
    const { preview_color } = this.datas;

    return `
        .component-${this.id} .bonusPoolShow {
          background-color:${preview_color.isColor == 1 ? preview_color.color : ""};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""});
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

    `;
  }
};
export default {
  props: ["id", "datas", "component_key"],
  data() {
    return {};
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  mounted() {},
  methods: {
    routeLink(item) {
      window.location.href = item;
    }
  }
};
</script>
<style lang="scss" scoped>
.bonusPoolShow {
  margin: 0.59rem;
  display: flex;
  padding: 1.25rem 0;
  border-radius: 0.31rem;
  justify-content: space-around;
  .txt {
    font-size: 0.69rem;
    color: #2b2b2b;
  }
  .price {
    font-size: 0.81rem;
    color: #f91515;
    .smallp {
      font-size: 0.63rem;
    }
  }
  .poollist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
}
</style>