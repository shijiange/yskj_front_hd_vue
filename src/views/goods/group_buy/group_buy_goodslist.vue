<!-- 拼购详情页包含的商品列表 -->
<template>
  <div id="group_buy_goodslist">
    <c-title :hide="false" :text="'拼购商品列表'"></c-title>
    <ul class="list">
      <li class="child" v-for="(item,ind) in 3" :key="ind">
        <img src="https://dev4.yunzmall.com/attachment/images/9/2019/09/lpdUPyxD9uXyR2r39rY2Q3D06r2eDZ.jpg" alt="" />
        <div class="child_right">
          <div class="title">fanbox FILA 斐乐官方 男子跑步鞋 2020年秋季新款休闲运动跑鞋闪电男鞋 微白-SW 42</div>
          <div class="money">
            <font>{{ $i18n.t('money') }}</font> 888
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import cTitle from 'components/title';

export default {
  data() {
    return {};
  },

  activated: {},

  components: { cTitle },

  computed: {},

  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#group_buy_goodslist {
  padding: 0 0.875rem;

  .list {
    .child {
      padding: 0.875rem;
      width: 100%;
      display: flex;
      margin-bottom: 0.875rem;
      background: #fff;
      border-radius: 0.375rem;

      img {
        width: 7.875rem;
        height: 7.875rem;
        border-radius: 0.375rem;
        flex-shrink: 0;
        overflow: hidden;
        margin-right: 0.875rem;
      }

      .child_right {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;

        .title {
          font-size: 0.875rem;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .money {
          color: #ff2c29;
          font-size: 1rem;

          font {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
}
</style>
