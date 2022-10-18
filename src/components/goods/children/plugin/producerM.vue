<!-- 厂家管理 -->
<template>
  <div>
    <div id="management">
      <div style="display: flex;">
        <div class="mana_o">
          <img :src="producer_info.logo_url" alt="" />
        </div>
        <div class="nameMana">
          <div class="nameMana_a">{{ producer_info.producer_name }}</div>
          <div class="nameMana_b">
            热销<em>{{ producer_info.sell_total }}</em
            >件
          </div>
        </div>
      </div>
      <div class="tapMana" @click="tapManage(producer_info.id)">进入店铺</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    producer_info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  // activated: {},
  components: {},
  computed: {},
  // mounted() {},
  methods: {
    tapManage(eid) {
      this.$router.push(this.fun.getUrl("managementIndex", { id: eid }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#management {
  margin: 10px;
  border-radius: 10px;
  height: 4.75rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.19rem 0.94rem 0.94rem 1.06rem;

  .mana_o {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #f5c041;
    border-radius: 50%;
    margin-right: 0.69rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  }

  .nameMana {
    display: flex;
    flex-direction: column;

    .nameMana_a {
      font-size: 1.06rem;
      color: #333;
      text-align: left;
      margin-bottom: 0.5rem;
    }

    .nameMana_b {
      font-size: 0.75rem;
      text-align: left;
      color: #333;

      em {
        color: #f14e4e;
      }
    }
  }

  .tapMana {
    width: 4.69rem;
    height: 1.69rem;
    background-color: #f14e4e;
    border-radius: 0.84rem;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
    line-height: 1.69rem;
  }
}
</style>
