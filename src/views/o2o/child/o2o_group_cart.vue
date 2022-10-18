<!-- 门店聚合页 门店拼团卡片组件 -->
<template>
  <div id="o2o_group_cart">
    <div class="main" v-if="list.length > 0">
      <div class="boxTop">
        <div class="boxIcon">
          <img class="text-img-src" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/images/popular_group.png" alt="" />
        </div>
        <div class="topRight" @click="gotoMore">查看更多 <i class="iconfont icon-member_right"></i></div>
      </div>
      <div class="boxList">
        <div class="boxlis" v-for="(item, ind) in list" :key="ind" @click="toDetail(item.id, item.store_id)">
          <div class="listT">
            <img :src="item.has_one_goods ? item.has_one_goods.thumb : ''" alt="" />
          </div>
          <div class="listB">
            <div class="listBtitle">{{ item.title }}</div>
            <div class="listBPrice">{{ $i18n.t("money") }} {{ item.has_many_option_levels[0].group_price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //Params参数
    list: {
      type: [Array]
    }
  },
  data() {
    return {};
  },

  // activated: {},

  components: {},

  computed: {},

  methods: {
    gotoMore() {
      this.$router.push(this.fun.getUrl("o2oGrouplist", {}));
    },
    toDetail(id, store_id) {
      this.$router.push(this.fun.getUrl("GroupGoods", { id: id, store_id: store_id }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#o2o_group_cart {
  .main {
    display: flex;
    flex-direction: column;

    .boxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem;

      .boxIcon {
        height: 1.25rem;
        line-height: 1.25rem;
        color: #424242;

        img {
          width: auto;
          height: 1.25rem;
          object-fit: contain;
        }
      }

      .topRight {
        color: #666;
        font-size: 12px;

        i {
          font-size: 12px;
        }
      }
    }

    .boxList {
      padding: 0 0.875rem 0.875rem;
      display: flex;

      .boxlis {
        display: flex;
        flex-direction: column;
        width: 6.875rem;
        margin-left: 0.5rem;

        .listT {
          width: 6.875rem;
          height: 6.875rem;
          background-color: #e3e3e3;
          border-radius: 0.5rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .listB {
          padding-top: 0.75rem;
          text-align: left;

          .listBtitle {
            width: 100%;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }

          .listBPrice {
            color: #f14e4e;
          }
        }
      }

      .boxlis:nth-child(1) {
        margin: 0;
      }
    }
  }
}
</style>
