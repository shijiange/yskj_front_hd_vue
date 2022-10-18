<template>
  <div id="give_out">
      <c-title :hide="false" :text="'优惠券发放'"></c-title>
      <div class="content">
          <div class="coupon_open">
              <ul class="list">
                  <li>
                      <span>发放张数</span>
                      <input type="text" placeholder="请输入数字，不小于1" v-model="Num">
                  </li>
                  <li>
                      <span>发放对象</span>
                      <van-radio-group v-model="result" checked-color="#f15353">
                      <van-radio  :name=1>按照会员ID发送</van-radio>
                     </van-radio-group>
                  </li>
                  <li>
                      <span>会员ID</span>
                      <textarea 
                          placeholder="请用“半角隔号”隔开会员ID，比如1，2，3，注意不能有空格" v-model="Text">
                      </textarea>
                  </li>
              </ul>
          </div>
          <button class="give_btn" type="button" @click="publish()">确认发放</button>
      </div>
  </div>
</template>

<script>
import give_out_controller from "./give_out_controller";

export default give_out_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#give_out {
  .content {
    .coupon_open {
      background: #fff;
      padding: 0.625rem 0 1.25rem 0;

      .van-radio-group {
        display: flex;
        align-items: center;
      }

      .list {
        padding: 0 0.875rem;

        li {
          display: flex;
          line-height: 2.5rem;
          font-size: 15px;

          span {
            width: 6.25rem;
            text-align: left;
          }

          input {
            border: none;
            width: 15rem;
          }

          textarea {
            margin-top: 0.625rem;
            width: 15rem;
            min-height: 5rem;
            border-radius: 0.25rem;
            border: solid 0.0625rem #ebebeb;
            background: #fafafa;
            padding: 0.375rem;
          }
        }
      }
    }

    .give_btn {
      width: 80%;
      border-radius: 0.375rem;
      height: 2.625rem;
      background: #f15353;
      color: #fff;
      font-size: 16px;
      margin: 1.25rem 0;
      border: none;
    }
  }
}
</style>
