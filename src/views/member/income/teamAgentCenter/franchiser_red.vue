<template>
    <div id="franchiser_red">
        <c-title :hide="false" :text="'红包奖励记录列表'"></c-title>
        <div id="content">
            <div class="list_box" @click="toRed(item)" v-for="(item,i) in recordsList" :key='i'>
                <ul class="left">
                    <li class="left_a">{{item.amount}}元</li>
                    <li class="left_b">{{item.created_at}}</li>
                </ul>
                <p class="state stay">{{item.status_name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import franchiser_red_controller from "./franchiser_red_controller";

export default franchiser_red_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #franchiser_red {
    background: #fff;

    #content {
      padding-left: 0.875rem;

      .list_box {
        border-bottom: solid 0.0625rem #ebebeb;
        padding: 0.625rem 0.875rem 0.625rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          .left_a {
            line-height: 1.875rem;
            text-align: left;
            font-size: 18px;
          }

          .left_b {
            line-height: 1.875rem;
            text-align: left;
            font-size: 14px;
            color: #8c8c8c;
          }
        }

        p {
          font-size: 16px;
          color: #8c8c8c;
        }

        .stay {
          color: #f15353;
        }
      }
    }
  }
</style>