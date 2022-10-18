<template>
  <div id="open_member">
    <c-title :hide="false" text='开通会员'></c-title>
    <div id="content">
         <div class="vip_box" v-for="(item,index) in listArr" :key="index" >
            <div class="img">
                <img :src="item.has_one_universal_level.thumb_image">
            </div>
            <ul class="text">
                <li class="text_a">{{item.level_name}}</li>
                <li class="text_b">有效期：{{item.validity}}天</li>
                <li class="text_c">{{item.discount}}折优惠&nbsp;&nbsp;&nbsp;更多特权</li>
            </ul>
            <div class="btn">
                <button type="button" @click="openSubmit(item)">立即开通</button>
            </div>
        </div>
            
    </div>

  </div>
</template>

<script>
import controller from "./card_open_membership_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#open_member {
  padding-bottom: 1.25rem;

  #content {
    // new
    .vip_box {
      width: 22.1875rem;
      border-radius: 0.25rem;
      margin: 0.625rem auto;
      background: #fff;
      display: flex;
      align-items: center;
      padding: 1.25rem 0.875rem;
      position: relative;

      .img {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 3.75rem;
        background: #ccc;
        overflow: hidden;
        margin-right: 0.625rem;

        img {
          width: 4.5rem;
          height: 4.5rem;
        }
      }

      .text {
        text-align: left;

        .text_a {
          font-size: 18px;
          font-weight: bold;
          line-height: 1.875rem;
        }

        .text_b,
        .text_c {
          font-size: 14px;
          color: #8c8c8c;
          line-height: 1.5rem;
        }
      }

      .btn {
        position: absolute;
        right: 0.625rem;

        button {
          border: none;
          background: #daac5e;
          color: #fff;
          border-radius: 0.25rem;
          width: 5.5rem;
          height: 2.25rem;
          font-size: 16px;
        }
      }
    }
  }
}
</style>