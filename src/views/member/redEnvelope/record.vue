<!-- 口令红包 邀请记录 -->
<template>
  <div id="red-record">
    <c-title :hide="false"
             :text="settitle"></c-title>
    <div class="user-info">
      <div class="avator">
        <img :src="info.avatar_image?info.avatar_image:require('../../../assets/images/photo-mr.jpg')">
      </div>
      <div class="user-name">
        <span>{{info.nickname}}</span>
        <p v-if="tag==1">邀请{{extractWord.invite_people}}个好友完成挑战即可增加1次挑战次数,每人限{{extractWord.share_have_number}}次增加机会</p>
      </div>
    </div>
    <div class="record-count">
      <div class="itema item">
        <span class="top">{{tag == 1?extractWord.share_count:extractWord.count}}</span>
        <span class="bottom">{{tag == 1?'邀请人数':'挑战次数'}}</span>
      </div>
      <div class="itemb item">
        <span class="top">{{tag == 1?extractWord.success_count:extractWord.success_count}}</span>
        <span class="bottom">{{tag == 1?'邀请完成挑战':'挑战成功次数'}}</span>
      </div>
      <div class="itemc item">
        <span class="top">{{tag == 1?extractWord.share_number:extractWord.amount_total}}</span>
        <span class="bottom">{{tag == 1?'邀请获得次数':'挑战奖励'}}</span>
      </div>
    </div>
    <div class="list">
      <div class="list-title" v-if="log.length>0">
        <div class="titlea">时间</div>
        <div class="titleb">{{tag == 1?'邀请用户':'挑战奖励'}}</div>
      </div>
      <div class="tzlist"
           v-if="tag == 2">
        <!-- 挑战记录列表样式 -->
        <div class="li"
             v-for="(item,i) in log"
             :key="i">
          <div class="left">
            <div class="datea">{{item.created_at.slice(0,10)}}</div>
            <div class="dateb">{{item.created_at.slice(10,20)}}</div>
          </div>
          <div class="total">{{item.amount}}</div>
          <div class="img">
            <img v-if="!item.status"
                 src="../../../assets/images/redEnvelope/failed@2x.png"
                 alt="">
            <img v-if="item.status"
                 src="../../../assets/images/redEnvelope/success@2x.png"
                 alt="">
          </div>
        </div>
      </div>
      <div class="tzlist"
           v-if="tag == 1">
        <!-- 邀请记录列表样式 -->
        <div class="li"
             v-for="(item,i) in log"
             :key="i">
          <div class="left">
            <div class="datea">{{item.created_at.slice(0,10)}}</div>
            <div class="dateb">{{item.created_at.slice(10,20)}}</div>
          </div>
          <div class="totaltew">
            <img :src="item.member?item.member.avatar_image:require('../../../assets/images/photo-mr.jpg')"
                 alt=""><span>{{item.member.nickname}}</span> </div>
          <div class="textss"
               :style="{color: (item.status?'#ec4638':'#666666')}">
            {{item.status?'已完成':'未完成'}}
          </div>
        </div>
      </div>
      <img style="width: 5rem;"
           v-if="fun.isTextEmpty(log)"
           src="../../../assets/images/blank.png"
           alt="" />
    </div>
  </div>
</template>
<script>
import red_record_controller from "./red_record_controller";
export default red_record_controller;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#red-record {
  padding-left: 0.875rem;
  padding-right: 0.875rem;
  padding-bottom: 2.5rem;
  background: #fff;
  min-height: 100vh;

  .user-info {
    padding-left: 0.4375rem;
    padding-top: 1.5rem;
    text-align: left;
    display: flex;

    .avator {
      width: 3rem;
      height: 3rem;
      background-color: #fff;
      border-radius: 50%;
      display: inline-block;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-name {
      display: inline-block;
      vertical-align: top;
      margin-left: 0.5rem;
      flex: 1;

      p {
        font-size: 0.75rem;
        color: #666;
      }
    }
  }

  .record-count {
    margin-top: 0.8125rem;
    padding: 1.25rem 0.6875rem;
    display: flex;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    // justify-content: space-between;
    .item {
      display: flex;
      flex-direction: column;

      .top {
        font-size: 1.125rem;
        font-weight: bold;
        color: #000;
      }

      .bottom {
        font-size: 0.875rem;
        margin-top: 1.375rem;
        color: #666;
      }
    }

    .itema {
      flex: 0 0 20%;
    }

    .itemb {
      flex: 0 0 50%;
    }

    .itemc {
      flex: 0 0 30%;
    }
  }

  .list {
    width: 100%;
    margin-top: 1.25rem;
    color: #000;

    .list-title {
      font-size: 0.875rem;
      padding: 0.6875rem;
      display: flex;
      width: 100%;
      text-align: center;

      .titlea {
        flex: 0 0 20%;
      }

      .titleb {
        flex: 0 0 50%;
      }
    }

    .tzlist {
      .li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem;
        border-bottom: 0.0625rem solid #ebebeb;
        font-size: 0.875rem;

        .left {
          flex: 0 0 20%;
          display: flex;
          flex-direction: column;

          .datea {
            font-size: 0.75rem;
          }
        }

        .total {
          flex: 0 0 50%;
          font-weight: bold;
        }

        .totaltew {
          flex: 1;
          margin-left: 14%;
          font-weight: bold;
          display: flex;
          align-items: center;

          img {
            width: 1.75rem;
            height: 1.75rem;
            margin: 0;
            margin-right: 0.625rem;
            border-radius: 50%;
            overflow: hidden;
          }

          span {
            max-width: 4.25rem;
            height: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本。 */
            white-space: nowrap;
          }
        }

        .img {
          width: 1.345rem;
          height: 1.345rem;
          margin: 0 0 0 auto;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
