<template>
  <div v-if="listMap.length > 0">
    <h2 class="titile">其他信息</h2>
    <div class="customBox" >
      <div class="item" v-for="(item, index) in listMap" :key="index">
        <p class="name">{{item.name}}:</p>
        <p class="message">{{item.value}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listMap: {
      default: []
    }
  },
  data () {
    return {
    };
  },

  computed: {},

  methods: {},

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .titile {
    text-align: left;
    color: #969799;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }

  .customBox {
    width: 100%;
    margin: 0 auto;
    padding: 0.625rem 0.625rem;
    margin-top: 0.25rem;
    text-align: left;
    border-radius: 0.5rem;
    background: #fff;

    .item {
      display: flex;
      margin-top: 0.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
    }

    .item:first-child {
      margin: 0;
    }

    .name {
      max-width: 7rem;
      font-size: 14px;
      font-weight: bold;
      color: #323233;
    }

    .message {
      color: #969799;
      padding-left: 14px;
    }
  }
</style>