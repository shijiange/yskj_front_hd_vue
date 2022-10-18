<!-- 精英奖 列表子组件 -->
<template>
  <div id="c_eliteAwardList">
    <div class="menu_main">
      <div class="Rank" style="border: none;"></div>
      <div class="avater"></div>
      <div class="name">会员</div>
      <div class="Performance" v-if="is_achievement">业绩</div>
      <div class="reward" style="color: #999;" v-if="is_reward">奖励</div>
    </div>
    <div class="list_C_main">
      <div class="list_child" v-for="(item, index) in datas" :key="index">
        <div class="Rank" :class="[index + 1 < 4 ? `Rank${index + 1}` : '']">{{ index + 1 }}</div>
        <div class="avater">
          <img :src="item.member ? item.member.avatar : '../../../assets/images/icon_I.png'" alt="" />
        </div>
        <div class="name">{{ item.member ? item.member.nickname : '' }}</div>
        <div class="Performance" v-if="is_achievement">{{ $i18n.t('money') }}{{ item.achievement }}</div>
        <div class="reward" v-if="is_reward">
          <template v-if="item.reward_amount">+{{ item.reward_amount }}</template>
        </div>
      </div>
    </div>
    <img
      src="../../../assets/images/blank.png"
      style="width: 5rem; margin-top: 2rem;"
      alt=""
      v-if="fun.isTextEmpty(datas)"
    />
  </div>
</template>

<script>
export default {
  props: ['datas', 'is_reward', 'is_achievement'],
  data() {
    return {};
  },

  components: {},
  computed: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#c_eliteAwardList {
  width: 100%;
  overflow: hidden;

  .menu_main {
    width: 100%;
    height: 2rem;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    color: #999;
    font-size: 0.75rem;
  }

  .list_C_main {
    width: 100%;
    padding: 0 0.75rem;
    background: #fff;

    .list_child {
      display: flex;
      align-items: center;
      height: 3.375rem;
      border-bottom: 0.0625rem solid #f5f7fa;
      color: #000;
    }
  }

  .Rank {
    width: 1.25rem;
    height: 1.25rem;
    line-height: 0.875rem;
    font-size: 1rem;
    border-radius: 100%;
    margin-right: 0.625rem;
    border: 3px solid #fff;
    color: #666;
  }

  .Rank1,
  .Rank2,
  .Rank3 {
    color: #fff;
    font-size: 0.875rem;
  }

  .Rank1 {
    background: #ffc600;
    border: 3px solid #fff4cc;
  }

  .Rank2 {
    background: #a3b5ca;
    border: 3px solid #edf0f4;
  }

  .Rank3 {
    background: #d9a485;
    border: 3px solid #f7ede7;
  }

  .avater {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 100%;
    margin-right: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .name {
    flex: 1;
    width: 100%;
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /* 规定段落中的文本不进行换行 */
    text-align: left;
  }

  .Performance {
    width: 5.625rem;
    margin: 0 0.25rem;
  }

  .reward {
    width: 5.25rem;
    color: #ff2c29;
  }
}
</style>
