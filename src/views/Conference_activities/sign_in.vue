<template >
  <div id="sign_in">
    <c-title :hide="false"
             :goback="true"
             text='签到'></c-title>
    <div class="content">
      <div class="list">
        <div class="title">
          <label>会员名称:</label>
        </div>
        <input type="text"
               v-model="nickName"
               disabled="true">
      </div>
      <div class="list">
        <div class="title">
          <label>手机号码:</label>
        </div>
        <input type="text"
               v-model="mobile"
               disabled="true">
      </div>
      <div class="list">
        <div class="title">
          <label>活动名称:</label>
        </div>
        <input type="text"
               v-model="name"
               disabled="true">
      </div>
      <div class="btn" v-if="!fromStatus"
           @click="submit()">
        确认签到
      </div>
      <div class="btn" style="background:#d5abab;" v-if="fromStatus">
        已签到
      </div>

    </div>
  </div>
</template>

<script>
import sign_incontroller from "./sign_incontroller";
export default sign_incontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#sign_in {
  .content {
    background-color: #fff;
    padding-bottom: 1rem;

    .list {
      padding-left: 1rem;
      display: flex;
      align-items: center;
      border-bottom: solid 1px #ccc;
      font-size: 12px;

      .title {
        margin: 1rem 0;

        label {
          font-size: 12px;
        }

        span {
          color: #f87070;
          display: inline-block;
          vertical-align: top;
        }
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        text-indent: 0.5rem;
        text-align: right;
        color: #000;
        padding-right: 1rem;
      }

      input::-webkit-input-placeholder {
        /* WebKit browsers */

        font-size: 12px;
      }

      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */

        font-size: 12px;
      }

      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */

        font-size: 12px;
      }

      input:-ms-input-placeholder {
        /* Internet Explorer 10+ */

        font-size: 12px;
      }
    }

    .list:last-child {
      border-bottom: none;
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      width: 80%;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      background-color: #fd5b5b;
      height: 3rem;
    }
  }
}
</style>
