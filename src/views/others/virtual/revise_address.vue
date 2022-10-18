<template>
  <div id="revise-address">
    <c-title :hide="false" :text="'修改提出地址'"></c-title>
    <div class="content">
      <div class="top">
        <van-cell-group :border="false">
          <van-field v-model="mobile" label="手机号：" center readonly type="number" placeholder="请输入手机号" />

          <van-field v-model="captcha" v-if="imgCode" center placeholder="请输入图形验证码">
            <template #button>
              <img :src="imgCode" @click="changeImg" />
            </template>
          </van-field>

          <van-field v-model="sms" center clearable label="验证码：" placeholder="请输入验证码" class="code">
            <van-button
              size="small"
              type="primary"
              slot="button"
              :color="btnBg"
              :disabled="btnTag"
              @click.native="sendCode"
              >{{ btnText }}</van-button
            >
          </van-field>
        </van-cell-group>

      </div>
      <div class="bottom">
        <van-cell-group>
          <div class="origin">
            <div>原提出地址：</div>
            <div class="text">{{ oldAddress }}</div>
          </div>
          <div class="new">
            <div>新提出地址：</div>
            <input type="text" placeholder="请输入新的提出地址" v-model="newAddress" />
          </div>
          <div class="new">
            <div>原提出二维码(可修改)：</div>
            <van-uploader class="up-photo" :after-read="afterRead">
              <img :src="qr" v-if="!fun.isTextEmpty(qr)" class="show" />
            </van-uploader>
          </div>
          <van-cell title-style="text-align:left" value-class="switch-btn">
             <span slot="title">设置默认地址：</span>
             <span slot="default">
             <van-switch v-model="is_default"  size="28px" active-color="#f15353" inactive-color="#fff" />
            </span>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="confirm" @click="revise">
        <span class="btn">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
import revise_address_controller from './revise_address_controller';
export default revise_address_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#revise-address {
  .content {
    .yd-cell-item {
      padding-left: 0;
      margin-left: 12px;
      border-bottom: solid 1px #ebebeb;

      .yd-cell-left {
        .imgInput {
          outline: none;
          border: none;
        }
      }

      .yd-cell-right {
        img {
          margin: 0;
        }
      }
    }

    .top {
      .yd-btn-warning {
        background-color: #f15353;
        border-radius: 4px;
      }

      .yd-cell-item:last-child {
        border-bottom: none;
      }
    }

    .bottom {
      margin-top: 1rem;

      .origin {
        text-align: left;
        padding: 10px 0;
        margin-left: 12px;
        border-bottom: solid 1px #ebebeb;
        font-size: 14px;

        .text {
          margin-top: 5px;
          word-break: break-word;
        }
      }

      .new {
        text-align: left;
        padding: 10px 0;
        margin-left: 12px;
        border-bottom: solid 1px #ebebeb;
        font-size: 14px;

        input {
          outline: none;
          margin-top: 5px;
          width: 100%;
          border: none;
        }

        .up-photo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 6rem;
          height: 6rem;
          overflow: hidden;
          margin: 0 auto;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          border: dashed 1px #ccc;
          border-radius: 0.125rem;
          position: relative;

          .up_icon {
            width: 2rem;
            height: 2rem;
          }

          .show {
            width: 100%;
            height: 100%;
          }
        }
      }

      .yd-cell-item:last-child {
        border-bottom: none;
      }
    }

    .confirm {
      margin-top: 20px;
      display: flex;
      justify-content: center;

      .btn {
        border-radius: 0.5rem;
        width: 90%;
        height: 40px;
        font-size: 16px;
        text-align: center;
        color: #fff;
        background-color: #f15353;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
    }
  }
}

#revise-address {
  .content {
    .top {
      .van-cell {
        padding: 0 24px 0 0;
        margin-left: 12px;
        height: 50px;
        // line-height: 50px;
        border-bottom: solid 1px #ebebeb;

        /deep/.van-field__label {
          width: auto;
          margin-right: 0;
        }

        /deep/.van-field__control {
          color: #555;
        }

        /deep/input::placeholder {
          color: #555;
        }

        /deep/.van-field__button {
          height: 50px;

          img {
            margin: 7px 0 0 0;
          }
        }
      }

      .code /deep/.van-field__button {
        .van-button--small {
          margin-top: 8px;
          border-radius: 5px;
        }
      }
    }
  }

  .switch-btn {
    span {
      float: right;
    }
  }
}
</style>
