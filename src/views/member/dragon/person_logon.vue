<template>
  <div id="person_logon"
       ref="person_logon">
    <c-title :hide="false"
             text="个人注册"></c-title>
    <div class="content">
      <div class="first">
        <div class="head">
          <div class="line"></div>
          <span>个人信息</span>
        </div>
        <div class="form_first">
          <div class="list">
            <div class="title">
              <label>姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.realNm"
                   placeholder="请填写你的姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>证件号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.idNo"
                   placeholder="请填写身份证号码">
          </div>
          <div class="list">
            <div class="title">
              <label>联系人</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.contacts"
                   placeholder="请填写联系人姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>邮箱</label>
            </div>
            <input type="text"
                   v-model="formData.email"
                   placeholder="请填写邮箱">
          </div>
          <div class="list">
            <div class="title">
              <label>固定电话</label>
            </div>
            <input type="text"
                   v-model="formData.telphone"
                   placeholder="请填写固定电话">
          </div>
          <div class="list">
            <div class="title">
              <label>地址</label>
            </div>
            <input type="text"
                   v-model="formData.address"
                   placeholder="请填写地址">
          </div>
        </div>
      </div>
      <div class="btn"
           @click="submit()">
        开通
      </div>
    </div>
  </div>
</template>

<script>
import person_logon_controller from "./person_logon_controller";
export default person_logon_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#person_logon {
  .content {
    .first {
      background-color: #fff;
      margin-bottom: 0.3rem;

      .head {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-left: 1rem;

        .line {
          width: 0.1875rem;
          height: 0.875rem;
          background-color: #f87070;
          margin-right: 1rem;
        }

        span {
          font-size: 14px;
          color: #f86e6e;
        }
      }

      .form_first {
        .list {
          padding-left: 1rem;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #ccc;

          .act {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .act-people {
              padding: 0.125rem;
              border-radius: 1rem;
              border: solid 1px #f87070;
              margin-right: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                padding: 0.25rem 0.5rem;
                border-radius: 1rem;
                line-height: 1rem;
                font-size: 12px;
                color: #b1b1b1;
              }
            }
          }

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
      }
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

    .btn-false {
      margin: 0 auto;
      margin-top: 1rem;
      width: 80%;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      background-color: #999;
      height: 3rem;
    }

    .bg {
      background-color: #f87070;
      color: #fff !important;
    }
  }
}
</style>
