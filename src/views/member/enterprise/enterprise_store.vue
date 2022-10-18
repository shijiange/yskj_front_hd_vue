<template>
  <div id="enterpriseSupplier">
    <c-title :hide="false" text="我的门店"></c-title>
    <div class="seller_list">
      <div
        class="seller_box"
        v-for="(store,i) in list"
		:key='i'
        @click.stop="toShop(store.id, 'store')"
      >
        <div class="header">
          <img :src="store.thumb" />
        </div>
        <ul class="name">
          <li>{{ store.store_name }}</li>
          <li class="position">
            <i class="iconfont icon-seller-position"></i>
            <!-- <span>{{
              store.province_name + store.city_name + store.district_name
            }}</span> -->
            <span>
                {{ store.full_address }}
            </span>
          </li>
        </ul>
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import enterprise_store_controller from "./enterprise_store_controller";
export default enterprise_store_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enterpriseSupplier {
  .seller_list {
    //   margin-top: 0.625rem;
    padding: 0.625rem 0.9375rem;
    background: #fff;

    .seller_box {
      display: flex;
      align-items: center;
      background: #fafafa;
      padding: 0.625rem;
      width: 100%;
      margin-bottom: 0.625rem;

      .header {
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        margin-right: 0.625rem;
        background: #fff;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        text-align: left;
        width: 15rem;

        li {
          line-height: 1.5rem;
          font-size: 15px;
        }

        .position {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #8c8c8c;

          i {
            font-size: 1.25rem;
            margin-right: 0.375rem;
          }

          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .fa {
        width: 2.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 1.25rem;
        color: #ccc;
        position: absolute;
        right: 0.625rem;
      }
    }

    .seller_box:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
