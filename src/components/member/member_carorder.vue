<template>
  <div
    id="hotel_order"
    :style="{
      backgroundColor: Params.memberordercolor,
      backgroundImage:
        'url(' +
        (Params.memberorderbg == '2' ? Params.memberorderimg : '') +
        ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <router-link
      :to="
        fun.getUrl('onlineCarOrderlist', {
          status: '0',
          orderType: 'onlineCar'
        })
      "
    >
      <div class="title_box">
        <div class="spare"></div>
        <span>{{ Params.memberordername }}</span>
        <i class="fa fa-angle-right"></i>
      </div>
    </router-link>
    <ul class="item_box">
      <li>
        <router-link
          :to="
            fun.getUrl('onlineCarOrderlist', {
              status: '2',
              orderType: 'onlineCar'
            })
          "
        >
          <img :src="Order[0].imgurl" alt="" />
          <span :style="{ color: Order[0].color }">{{ Order[0].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="
            fun.getUrl('onlineCarOrderlist', {
              status: '3',
              orderType: 'onlineCar'
            })
          "
        >
          <img :src="Order[1].imgurl" alt="" />
          <span :style="{ color: Order[1].color }">{{ Order[1].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="
            fun.getUrl('onlineCarOrderlist', {
              status: '4',
              orderType: 'onlineCar'
            })
          "
        >
          <img :src="Order[2].imgurl" alt="" />
          <span :style="{ color: Order[2].color }">{{ Order[2].text }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="fun.getUrl('aftersaleslist')">
          <img :src="Order[3].imgurl" alt="" />
          <span :style="{ color: Order[3].color }">{{ Order[3].text }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["Order", "Params"]
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// 酒店的样式
#hotel_order {
  background: #fff;
  margin: 0.625rem 0;

  .title_box {
    line-height: 2.5rem;
    display: flex;
    padding: 0 0.875rem;
    font-weight: bold;
    position: relative;
    // border-bottom: solid 0.0625rem #ebebeb;
    .spare {
      width: 0.25rem;
      height: 1rem;
      border-radius: 0.0625rem;
      background-color: #f15353;
      margin-top: 0.75rem;
      margin-right: 0.375rem;
    }

    span {
      font-size: 16px;
    }

    i {
      font-size: 1.25rem;
      color: #c9c9c9;
      line-height: 2.5rem;
      position: absolute;
      right: 0.875rem;
    }
  }

  .item_box {
    display: flex;
    padding: 0.875rem 0;

    li {
      width: 25%;
      position: relative;

      img {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 1.25rem;
      }

      span {
        margin-top: -0.25rem;
        display: block;
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
