<!-- 我的拼团列表 -->
<template>
  <div id="my-group-cell">
    <div class="list_box">
      <div class="list">
        <slot name="top"></slot>
        <div class="goods_box">
          <div class="goods_img">
            <img :src="thumb || ''" />
          </div>
          <ul class="goods_name">
            <li class="name_price">
              <h2 class="name" style="-webkit-box-orient: vertical;">
                {{ title }}
              </h2>
            </li>
            <li class="option">
              <span class="timestamp_box" v-if="time != null"
                >剩余：
                <van-count-down :time="time" format="DD天HH时mm分ss秒"></van-count-down>
              </span>
              <span class="total_price">
                <em style="font-size: 10px;">{{ $i18n.t("money") }}</em
                >{{ price }}</span
              >
            </li>
          </ul>
        </div>
        <div class="allbt">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    thumb: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    time: {
      type: Number,
      default: 0
    },
    price: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#my-group-cell {
  .list_box {
    .list {
      background: #fff;
      margin: 0.875rem;
      overflow: hidden;
      border-radius: 0.375rem;

      .goods_box {
        padding: 0.5rem;
        display: flex;

        .goods_img {
          width: 5.625rem;
          height: 5.625rem;
          overflow: hidden;
          background: #f2f2f2;
          border-radius: 0.25rem;
          margin-right: 0.875rem;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .goods_name {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name_price {
            display: flex;
            justify-content: space-between;

            .name {
              width: 100%;
              font-size: 0.875rem;
              color: #000;
              line-height: 1.125rem;
              height: 2.375rem;
              text-align: left;
              font-weight: normal;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .price {
              font-size: 14px;
              text-align: right;
              line-height: 1.25rem;

              span {
                color: #8c8c8c;
              }
            }
          }

          .option {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #f15353;
            font-size: 14px;
            text-align: left;

            .timestamp_box {
              display: block;
              padding: 0 0.5rem;
              height: 1.25rem;
              line-height: 1.25rem;
              border-radius: 0.625rem;
              background-color: rgba(255, 44, 41, 0.1);

              .van-count-down {
                display: inline-block;
                color: #f15353;
                font-size: 14px;
                line-height: 1.25rem;
              }
            }

            .total_price {
              font-size: 1rem;
              line-height: 1.5rem;
            }
          }
        }
      }

      .all_price {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.875rem;
        text-align: right;
        font-size: 14px;
        font-weight: normal;

        span {
          font-weight: bold;
          font-size: 18px;
        }
      }

      .allbt {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0.875rem 0.5rem;
        flex-wrap: wrap;

        button {
          border-radius: 0.75rem;
          border: solid 0.0625rem #ff2c29;
          font-size: 12px;
          padding: 0.25rem 0.625rem;
          margin: 0 0 0.625rem 0.625rem;
          color: #ff2c29;
        }
      }
    }
  }
}
</style>
