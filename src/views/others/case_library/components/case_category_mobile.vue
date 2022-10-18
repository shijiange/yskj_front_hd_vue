<template>
  <div id="case_category_mobile">
    <headTemplate :text="'全部分类'" choosed="category"></headTemplate>
    <div class="category">
      <div class="left-ca">
        <div
          class="li-ca"
          v-for="(item, index) in firstCategory"
          :key="index"
          @click="changeFirstCategory(item.id)"
          :class="{ 'li-ca-selected': first_id == item.id }"
        >
          {{ item.category_name }}
        </div>
      </div>
      <div class="right-ca">
        <div class="top">
          <span
            class="li"
            v-for="(item, index) in secondCategory"
            :key="index"
            @click="changeSecondCategory(item.id)"
            :class="{ 'li-selected': item.id == second_id }"
            >{{ item.category_name }}</span
          >
        </div>
        <div class="ul">
          <caseMobile :datas="list" :list-type="'category'"></caseMobile>
        </div>
      </div>
    </div>
    <serviceTemplate></serviceTemplate>
  </div>
</template>

<script>
import case_category_mobile_controller from './case_category_mobile_controller';

export default case_category_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case_category_mobile {
  background: #fff;

  .category {
    display: flex;
    width: 100%;

    .left-ca {
      position: fixed;
      width: 5.3125rem;
      min-width: 5.3125rem;
      height: calc(100vh - 2.5rem);
      background: #f7f7f7;

      .li-ca {
        line-height: 2.5rem;
        margin: 0.25rem 0;
      }

      .li-ca-selected {
        background: #fff0e8;
        color: $orange;
        border-left: 2px solid $orange;
      }
    }

    .right-ca {
      flex: 1;
      text-align: left;
      position: absolute;
      left: 5.3125rem;
      width: calc(100% - 5.3125rem);

      .top {
        position: fixed;
        line-height: 3.3125rem;
        height: 3.3125rem;
        background: #fff;
        overflow: auto;
        white-space: nowrap;
        // width: 100%;
        width: calc(100% - 5.3125rem);
        display: flex;
        align-items: center;
        z-index: 2;
        border-bottom: #ebebeb 1px solid;

        span {
          display: inline-block;
          border-radius: 0.85rem;
          padding: 0 1.125rem;
          line-height: 1.6875rem;
          border: 1px solid #dcdcdc;
          margin-left: 0.625rem;
        }

        .li-selected {
          border: 1px solid #ff5c00;
          color: $orange;
          background: #fff0e8;
        }
      }

      .ul {
        background: #fff;
        position: relative;
        top: 3.3125rem;
        min-height: calc(100vh - 5.8125rem);
      }
    }
  }
}

.pcStyle #case_category_mobile .category {
  width: 375px;

  .right-ca {
    width: calc(375px - 5.3125rem);
    left: 50%;
    margin-left: -6.3125rem;

    .top {
      width: calc(375px - 5.3125rem);
    }
  }
}
</style>
