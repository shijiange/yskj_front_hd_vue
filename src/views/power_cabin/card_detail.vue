<template>
  <div id="card_detail">
    <c-title :hide="false"
             text='查看详情'></c-title>
    <div class="content">
      <div class="list-wrap">
        <div class="list"
             v-for="(item,index) in datas"
             :key="index">
          <div class="title">
            <span class="red-line"></span>
            <span>会员卡信息</span>
          </div>
          <div class="list-content">
            <div class="item">
              <span>卡类型:{{item.card_type_name}}</span>
            </div>
            <div class="item">
              <span>购买时间:{{item.created_at}}</span>
            </div>
            <div class="item" v-if="card_type!='0'">
              <span>有效期:{{item.expiration_day}}天</span>
            </div>
            <div class="item">
              <span>{{card_type=='0'?'':'今日'}}剩余次数:{{card_type=='0'?item.use_count:item.available_num}}</span>
            </div>
          </div>
          <div class="line">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card_detail_controller from './card_detail_controller';
export default card_detail_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#card_detail {
  height: 100vh;
  background-color: #fff;

  .content {
    .list-wrap {
      .list {
        padding-top: 0.75rem;
        padding-left: 0.75rem;

        .title {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 1.1875rem;

          .red-line {
            width: 0.1875rem;
            height: 1rem;
            background-image: linear-gradient(#ff4d48, #ff4d48), linear-gradient(#03d4c0, #03d4c0);
            background-blend-mode: normal, normal;
            display: inline-block;
            margin-right: 1rem;
          }
        }

        .list-content {
          padding-left: 1.1875rem;

          .item {
            text-align: left;
            margin-bottom: 1.1875rem;
          }
        }

        .line {
          height: 0.3125rem;
          background-color: #f5f7fa;
          margin-left: -0.75rem;
        }
      }
    }
  }
}
</style>
