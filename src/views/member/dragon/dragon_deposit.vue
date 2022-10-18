<template>
  <div id="dragon_deposit">
    <c-title :hide="false"
             text="入金"></c-title>
    <div class="content">
      <div class="transfer_sum">
        <span>入金金额</span>
        <div class="sum">
          <div>
            {{$i18n.t('money')}}<input type="number"
                   v-model="money"
                   placeholder="0.00" />
          </div>
        </div>
      </div>
      <div class="btn"
           @click="confirm()">
        确认入金
      </div>
    </div>
  </div>
</template>

<script>
import dragon_deposit_controller from "./dragon_deposit_controller";
export default dragon_deposit_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dragon_deposit {
  .content {
    .transfer_sum {
      background: #fff;
      padding: 0.625rem 0.875rem;

      span {
        display: block;
        font-size: 16px;
        line-height: 2.5rem;
        text-align: left;
      }

      .sum {
        text-align: left;
        font-size: 18px;

        input {
          margin-left: 0.375rem;
          line-height: 2rem;
          color: #666;
          width: 90%;
          font-size: 20px;
          border: none;
        }
      }
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      width: 80%;
      height: 3rem;
      border-radius: 0.25rem;
      color: #fff;
      background-color: #f15353;
    }
  }
}
</style>
