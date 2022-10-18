<template>
    <div id="enterShop">
        <c-title :hide="false" text='提交成功'></c-title>
        <div id="content">
            <ul class="content_a">
                <li><i class="iconfont icon-submit"></i></li>
                <li>提交成功</li>
                <!-- <li>邀请码：xd123456</li> -->
            </ul>
            <div class="content_b">
                <div class="img">
                    <img :src="enter_goods.payment_background_thumb">
                </div>
                <span>长按识别进入金划算激活</span>
            </div>
            <div class="content_c">
                <div class="img">
                    <img :src="enter_goods.thumb">
                </div>
                <span>{{enter_goods.footer_content}}</span>
            </div>
        </div>
        
    </div>
</template>

<script>
import submit_succeed_controller from './submit_succeed_controller';
export default submit_succeed_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enterShop {
  background: #fff;
  min-height: 37.5rem;
  position: relative;

  .content_a {
    li:first-child {
      i {
        font-size: 5.5rem;
        color: #f15353;
      }
    }

    li:nth-child(2) {
      font-size: 24px;
    }

    li:last-child {
      margin-top: 0.625rem;
      font-size: 16px;
    }
  }

  .content_b {
    margin-top: 3.75rem;

    .img {
      margin: 0 auto;
      width: 8.75rem;
      height: 8.75rem;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    span {
      color: #8c8c8c;
      line-height: 1.875rem;
    }
  }

  .content_c {
    width: 100%;
    position: absolute;
    bottom: 1.25rem;

    .img {
      margin: 0.625rem auto;
      width: 3rem;
      height: 3rem;
      border: solid 0.0625rem #ebebeb;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    span {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      line-height: 1.5rem;
    }
  }
}
</style>