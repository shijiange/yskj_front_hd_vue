<!-- 拼团 数据统计 -->
<template>
  <div id="groupDataStatistics">
    <c-title :hide="false" text="数据统计"></c-title>
    <div class="list line">
      <div class="list-25">规格</div>
      <div class="list-18">成团销量</div>
      <div class="list-17">库存</div>
      <div class="list-40">销量明细</div>
    </div>
    <div class="list-main">
      <div class="list " v-for="(item, i) in list" :key="i">
        <div class="list-25">{{ item.option_title }}</div>
        <div class="list-18">{{ item.num }}</div>
        <div class="list-17">{{ item.stock }}</div>
        <div class="list-40">
          <div class="list-child" v-for="(child,i) in item.level" :key="i">
            <div class="list-child-margin">
              {{ child.member_num }}人团 系统成团：{{ child.purchase_quantity_system }}
            </div>
            <div>虚拟成团：{{ child.purchase_quantity_virtual }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  methods: {
    getData() {
      $http
        .get('plugin.fight-groups.frontend.store.fight-groups-store.data-statistics', { id: this.$route.params.id }, '')
        .then(response => {
          if (response.result === 1) {
            this.list = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#groupDataStatistics {
  .list {
    display: flex;
    width: 100%;
    background: #fff;
    align-items: center;

    .list-25 {
      width: 25%;
    }

    .list-18 {
      width: 18%;
    }

    .list-17 {
      width: 17%;
    }

    .list-40 {
      width: 40%;

      .list-child {
        display: flex;
        flex-direction: column;
        text-align: right;
        margin-bottom: 0.25rem;

        .list-child-margin {
          margin-bottom: 0.25rem;
        }
      }
    }
  }

  .line {
    position: relative;
    height: 2.813rem;
    line-height: 2.813rem;
  }

  .line::after {
    height: 1px;
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    content: '';
    width: 100%;
    background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
  }

  .list-main {
    .list {
      padding: 0.625rem;
      margin-bottom: 0.625rem;
    }
  }
}
</style>
