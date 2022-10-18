<template>
  <div>
    <c-title :hide="false"
             :text="!fun.isTextEmpty(userInfo.title)? userInfo.title : '商品零售'"> </c-title>
    <div class="contair">
      <div class="header"
           v-show="!fun.isTextEmpty(userInfo)">
        <div class="img">
          <img :src="userInfo.avatar_image"
               alt="" />
        </div>
        <div class="rigt_coin">
          <div class="user-name">{{userInfo.username}}</div>
          <div class="user-level">会员等级-{{userInfo.level_name}}</div>
        </div>
      </div>
      <div class="enter-money">
        <ul>
          <li>
            <span class="s-one">{{userInfo.total_queue_num}}</span>
            <span class="s-two">累计零售</span>
          </li>
          <li>
            <span class="s-one">{{userInfo.success_queue_num}}</span>
            <span class="s-two">累计零售成功</span>
          </li>
          <li>
            <span class="s-one">{{$i18n.t('money')}} {{userInfo.total_dividend_amount}}</span>
            <span class="s-two">累计收入</span>
          </li>
        </ul>
      </div>
      <div class="cart">
        <div class="list1"
             @click="gotoMyVolume">
          <i class="iconfont icon-my_guaorder"
                   custom
                   size="1.5rem"
                   color="#f15353"
                   style="margin-right: 6px; font-size: 1.5rem; color: #f15353;"></i>
          <span>我的零售</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1"
             @click="gotoWholesaleVolume">
          <i class="iconfont icon-my_wholesale_coupon"
                   style="margin-right: 6px; font-size: 1.5rem; color: #f15353;"></i>
          <span>我的批发券</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1"
             @click="gotoMoneyDetail">
          <i class="iconfont icon-member_integral"
                   style="margin-right: 6px; font-size: 1.5rem; color: #f15353;"></i>
          <span>提成明细</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import entry_volume_controller from "./entry_volume_controller";

export default entry_volume_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>


.contair .header {
  width: 100%;
  height: 5rem;
  background-color: #f15353;

  .img {
    width: 3rem;
    height: 3rem;
    background: #fff;
    margin: 1rem;
    border-radius: 50%;
    border: 0.125rem solid #fff;
    box-sizing: border-box;
    float: left;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .rigt_coin {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    flex-direction: column;
    text-align: left;
    color: #fff;

    .user-name {
      width: 100%;
      font-size: 1rem;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 0;
      margin-top: 1rem;
      margin-bottom: 6px;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }

    .user-level {
      width: 100%;
      font-size: 0.875rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }
  }
}

.contair {
  .enter-money {
    width: 100%;
    height: 5rem;
    background-color: #fff;

    ul {
      display: flex;

      li {
        width: 8rem;
        height: 3rem;
        margin: 1rem 0 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .s-one {
          width: 100%;
          height: 1rem;
          font-size: 1rem;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 0;
          color: #f15353;
        }

        .s-two {
          width: 100%;
          height: 1rem;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0;
          color: #333;
        }
      }
    }
  }

  .cart {
    height: auto;
    width: 100%;
    background: #fff;
    margin-top: 0.625rem;

    .list1 {
      height: 2.75rem;
      background: #fff;
      padding-right: 0.875rem;
      margin-left: 0.875rem;
      border-top: 0.0625rem solid #ebebeb;
      font-size: 16px;
      line-height: 2.75rem;
      color: #333;
      text-align: left;
      display: flex;

      i.fa.fa-angle-right {
        float: right;
        line-height: 2.75rem;
        display: inline-block;
        font-size: 1.5rem;
        color: #c9c9c9;
        text-align: center;
        background-size: 1.25rem;
        position: absolute;
        right: 0.875rem;
      }
    }
  }
}
</style>
