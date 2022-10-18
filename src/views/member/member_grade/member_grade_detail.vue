<template>
    <div id="member-grade">
       <c-title :hide="false" text='会员权益'></c-title>
       <div class="name">
           <h1>{{levelName}}</h1>
           <span>升级后有效期{{day}}天</span>
       </div>
       <div class="grade-box">
           <!-- <div class="plate">
               <ul>
                   <li class="top">子等级名称</li>
                   <li class="member">{{$i18n.t('money')}}<span>99</span></li>
                   <li>
                       <div class="shape"></div>
                   </li>
               </ul>
               <ul>
                   <li class="top">子等级名称</li>
                   <li class="member">{{$i18n.t('money')}}<span>99</span></li>
               </ul>
               <ul>
                   <li class="top">子等级名称</li>
                   <li class="member">{{$i18n.t('money')}}<span>99</span></li>
               </ul>
           </div> -->
           <div class="detail" v-html="agreementCon">

           </div>
       </div>
       <div style="height: 3.25rem;"></div>
       <div class="bottom">
           <span>应付款：{{$i18n.t('money')}}{{goodsPrice}}</span>
           <button type="button" aria-placeholder="立即购买" @click="buy">立即购买</button>
       </div>

    </div>


</template>


<script>
import member_grade_detail_controller from "./member_grade_detail_controller";
export default member_grade_detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#member-grade {
  .name {
    background-color: #3b3b4f;
    color: #fff;
    padding: 1rem 0.875rem;
    text-align: left;

    h1 {
      font-size: 20px;
      margin-bottom: 0.625rem;
    }

    span {
      padding: 0.125rem 0.625rem;
      background-color: rgb(87, 87, 109);
      border-radius: 0.8125rem;
      font-size: 12px;
    }
  }

  .grade-box {
    background-color: #fff;
    padding: 1rem 0.875rem;

    .plate {
      display: flex;

      ul {
        position: relative;
        width: 32%;
        border-radius: 0.25rem;
        padding: 1.25rem 0;

        .top {
          font-size: 14px;
          line-height: 1.5rem;
        }

        .member {
          font-size: 14px;

          span {
            font-size: 32px;
          }
        }

        .shape {
          width: 20%;
          height: 1.25rem;
          background-color: #ff9800;
          border-radius: 0.125rem;
          transform: rotate(45deg);
          position: absolute;
          bottom: -0.375rem;
          left: 40%;
        }
      }

      ul:first-child {
        background-color: #ff9800;
        color: #fff;
      }

      ul:nth-child(2),
      ul:nth-child(3) {
        background-color: #fff;
        border: solid 0.0625rem #ff9800;
        color: #333;
      }

      ul:nth-child(2) {
        margin: 0 0.625rem;
      }
    }

    .detail {
      width: 100%;
      height: 21.25rem;
      color: #333;
      font-size: 14px;
      padding: 0.625rem;
      border: solid 0.0625rem #e2e2e2;
      margin-top: 1rem;
      text-align: left;
      background-color: #fff;
      border-radius: 0.25rem;
    }
  }

  .bottom {
    width: 100%;
    height: 3.0625rem;
    background-color: #fff;
    line-height: 3.0625rem;
    position: fixed;
    display: flex;
    bottom: 0;
    font-size: 1rem;
    border-top: solid 0.0625rem #e2e2e2;

    button {
      background-color: #f15353;
      border: none;
      flex: 30%;
      color: #fff;
    }

    span {
      flex: 70%;
      text-align: left;
      padding-left: 0.875rem;
    }
  }
}

</style>


