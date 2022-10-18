<template>
  <div id="nearby_project_card">
    <van-list   v-model="loading" :finished="finished" finished-text="没有更多了" @load="getNearyData" >
      <van-cell v-for="(item, key) in nearyData" :key="key" @click="btnDetail(item.id)">
        <div class="top">
          <img :src="item.thumb" alt="" />
          <div class="project">
            <span class="project_name">{{ item.title }}</span>
            <div class="detail">
              <div class="top">
                <span class="num">{{ item.total_sell_count }}</span>
                <span class="num_name">次</span>
              </div>
              <span class="bottom">累计销售</span>
            </div>
          </div>
          <div class="classification">
            <div class="left">{{ item.category_name }}</div>
            <div class="right">
              <span class="other store_num"><i class="iconfont icon-fontclass-tuanduifenxiaoshang"></i>{{ item.store_count }}家</span>
              <span class="other distance"><i class="iconfont icon-order_locate"></i>{{ item.store_distance }}{{ item.store_distance_unit }}</span>
              <span class="other day"><i class="iconfont icon-fontclass-qixian"></i>{{ item.period }}</span>
            </div>
          </div>
          <span class="line" v-if="item.description"></span>
          <span class="project_brief">
            {{ item.description }}
          </span>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    nearyData: {
      type: Array,
      default () {
        return [];
      }
    },
    finished: {
      type: Boolean,
      default () {
        return false;
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false;
      }
    },
    getNearyData: {
      type: Function,
    },
    btnDetail:{
      type:Function
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.nearby_project {
  background: #fff;
  padding: 0.5rem;

  .van-cell {
    margin-bottom: 0.8rem;
    padding-top: 0;
    padding-bottom: 0;
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .line {
      width: 0.14rem;
      height: 0.93rem;
      background-color: #ce811d;
      border-radius: 0.07rem;
      margin-right: 0.5rem;
    }
  }

  .top {
    padding: 1.07rem 0 0 0;

    img {
      width: 100%;
      height: 10.71rem;
      border-radius: 0.54rem;
    }

    .project {
      display: flex;
      text-align: left;
      justify-content: space-between;

      .project_name {
        height: 100%;
        flex: 4;
        font-size: 14px;
        font-weight: bold;
        margin-right: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .detail {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          display: flex;
          align-items: center;
          padding: 0;
          justify-content: flex-end;

          .num {
            color: #ce811d;
            font-size: 16px;
          }
        }

        .bottom {
          font-size: 12px;
          color: #9f9f9f;
          display: flex;
          justify-content: flex-end;
        }
      }
    }

    .classification {
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0;

      .left {
        color: #f14e4e;
      }

      .right {
        .other {
          margin-left: 1rem;
          color: #ce811d;
        }
      }
    }

    .line {
      width: 100%;
      height: 0.03rem;
      background-color: #f5f5f5;
      display: block;
      margin-bottom: 0.5rem;
    }

    .project_brief {
      display: flex;
      text-align: left;
      padding-bottom: 0.5rem;
    }
  }
}
</style>
