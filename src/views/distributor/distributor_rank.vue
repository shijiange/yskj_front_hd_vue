<!-- 渠道商 排行榜 -->
<template>
  <div id="distributor_rank">
    <div class="rank">
      <div
        class="child"
        v-for="(item, i) in list"
        :key="i"
        @click.stop="clickActicity(i)"
        :class="[activityIndex == i ? 'activity-class' : '']"
      >
        <div class="top-info">
          <div class="member">
            <img :src="item.member ? item.member.avatar_image : ''" alt="" />
            <div class="nickname">{{ item.member.nickname }}</div>
          </div>
          <div class="total">{{ item.price_total }}元</div>
        </div>
        <div
          class="columnar-style"
          :style="{
            height:
              (Number(item.price_total.replace(/,/g, '')) / Number(list[0].price_total.replace(/,/g, ''))) * 10 > 0.0625
                ? (Number(item.price_total.replace(/,/g, '')) / Number(list[0].price_total.replace(/,/g, ''))) * 10 +
                  'rem'
                : '0.0625' + 'rem'
          }"
        ></div>
        <div class="rank-num">
          <template v-if="i == 0"
            ><img src="../../assets/images/ranking/1@3x.png" alt="" style="width: 1.5rem; height: 1.25rem;"
          /></template>
          <template v-if="i == 1"
            ><img src="../../assets/images/ranking/2@3x.png" alt="" style="width: 1.5rem; height: 1.25rem;"
          /></template>
          <template v-if="i == 2"
            ><img src="../../assets/images/ranking/3@3x.png" alt="" style="width: 1.5rem; height: 1.25rem;"
          /></template>
          <template v-if="i > 2">NO.{{ item.ranking }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityIndex: null,
      list: []
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  methods: {
    clickActicity(i) {
      this.activityIndex = i;
    },
    getData() {
      $http
        .get('plugin.channel.frontend.ranking.index', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.ranking;
          } else {
            MessageBox.alert(response.msg, '提示');
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
#distributor_rank {
  min-height: 100vh;
  background-color: #fff;

  .rank {
    width: 100%;
    overflow-x: scroll;
    display: flex;
    align-items: flex-end;
    padding-top: 10rem;

    .child {
      width: 20px;
      position: relative;
      margin-left: 28px;

      .top-info {
        position: absolute;
        top: -5rem;
        left: 0;
        box-shadow: -0.003rem 0.031rem 0.281rem 0 rgba(213, 213, 213, 0.46);
        width: 5.25rem;
        // height: 3rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #fff;
        padding: 0.25rem;
        border-radius: 0.25rem;
        text-align: left;

        .member {
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;

          img {
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 50%;
            margin-right: 0.25rem;
          }

          .nickname {
            font-size: 0.75rem;
            flex: 1;
            // overflow: hidden; /*超出部分隐藏*/
            // text-overflow: ellipsis; /* 超出部分显示省略号 */
            // white-space: nowrap; /*规定段落中的文本不进行换行 */
          }
        }

        .total {
          color: #f14e4e;
        }
      }

      .columnar-style {
        width: 20px;
        height: 10rem;
        background: #fe9900;
        border-radius: 0.125rem;
      }

      .rank-num {
        width: 1.5rem;
        height: 1.25rem;
        line-height: 1.25rem;
        margin-top: 0.5rem;
      }
    }

    .activity-class {
      .top-info {
        z-index: 999;
        box-shadow: -0.003rem 0.031rem 0.281rem 0 rgba(255, 5, 5, 0.46);
      }

      .columnar-style {
        box-shadow: -0.05px 0.5px 4px 0 rgba(58, 4, 4, 0.8);
      }
    }
  }
}
</style>
