<template>
  <div class="fight-group-box">
    <div class="goods_box"
         v-for="(item, index) in list"
         :key="index"
         v-if="item.has_one_goods">
      <div class="goods_img">
        <img :src="item.has_one_goods.thumb" />
      </div>
      <ul class="goods_info">
        <li class="name" style="-webkit-box-orient: vertical;">
          {{ item.title }}
        </li>
        <li class="price" v-if="item.has_many_option_levels && item.has_many_option_levels.length > 0">
          <span>{{$i18n.t('money')}}</span>{{item.has_many_option_levels[0].group_price}}&nbsp;<span style="text-decoration: line-through;">{{$i18n.t('money')}}{{item.has_many_option_levels[0].has_one_fight_groups_option.option_price}}</span>
        </li>
        <li class="number">
          <div class="left" v-if="item.has_many_option_levels && item.has_many_option_levels.length > 0">
            <i class="iconfont icon-group_list"></i>
            <span>{{ item.has_many_option_levels[0].member_num }}人</span>
          </div>

          <div class="go_group" @click="goGroup(item.id, item.store_id)">
            <span>去开团</span>
            <i class="fa fa-angle-right"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {
    };
  },
  methods: {
    goGroup(id, store_id) {
      if (store_id) {
        this.$router.push(this.fun.getUrl("GroupGoods", { id: id, store_id: store_id }));
      } else {
        this.$router.push(this.fun.getUrl("GroupGoods", { id: id }));
      }
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fight-group-box {
    padding: 0 10px;
  }

  .goods_box {
    background: #fff;
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    border-bottom: solid 0.0625rem #ebebeb;

    .goods_img {
      width: 7.5rem;
      height: 7.5rem;
      background: #f2f2f2;
      overflow: hidden;
      border-radius: 0.25rem;
      margin-right: 0.625rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .goods_info {
      width: 14.0625rem;
      text-align: left;

      .name {
        font-size: 14px;
        line-height: 1.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .price {
        font-size: 16px;
        margin-top: 0.375rem;
        color: #f15353;

        span {
          font-size: 12px;
        }

        span:last-child {
          color: #8c8c8c;
          margin-left: 0.625rem;
        }
      }

      .number {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.625rem;

        .left {
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 1.5rem;
            color: #f15353;
            margin-right: 0.375rem;
          }

          span {
            color: #f15353;
            font-size: 14px;
            border-left: solid 0.0625rem #ebebeb;
            padding-left: 0.375rem;
          }
        }

        .go_group {
          width: 5rem;
          height: 1.75rem;
          border-radius: 0.25rem;
          background: #f15353;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            color: #fff;
            font-size: 14px;
          }

          .fa {
            color: #fff;
            font-size: 1rem;
            margin-left: 0.625rem;
          }
        }
      }
    }
  }
</style>