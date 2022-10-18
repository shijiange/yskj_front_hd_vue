<template>
    <div id="enterpriseSupplier">
        <c-title :hide="false" text='我的供应商'></c-title>
        <ul class='rationList' >
            <li v-for="(item,i) in list" @click="goToSupplierInfo(item)" :key='i' >
                <div class="left">
                    <div  class="li1">
                        <img  :src="item.avatar">
                    </div>
                    <div class="li2">{{item.nickname}}</div>

                </div>
                <div class="right">
                    {{merchant_reward}}金额
                    <p>{{item.bonus_total}}元</p>
                </div>
            </li>
        </ul>

    </div>


</template>

<script>
import enterprise_center_supplier_controller from './enterprise_center_supplier_controller';
export default enterprise_center_supplier_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

#enterpriseSupplier {
  .rationList {
    li {
      background: #fff;
      padding: 0.625rem 0.75rem;
      overflow: hidden;
      border-bottom: 0.0625rem solid #ddd;

      .left {
        width: 70%;
        float: left;
        text-align: left;
        box-sizing: border-box;

        .li1 {
          display: inline-block;
          float: left;
        }

        img {
          width: 3.125rem;
          height: 3.125rem;
        }

        .li2 {
          float: left;
          line-height: 3.125rem;
          margin-left: 0.625rem;
          font-size: 14px;
        }
      }

      .right {
        float: left;
        width: 30%;
        color: #888;
        text-align: right;
        height: 3.125rem;
        line-height: 1.5625rem;
        font-size: 12px;

        p {
          margin: 0;
          padding: 0;
          color: #f15353;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
