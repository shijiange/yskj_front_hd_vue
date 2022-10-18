<template>
  <div id="my_voices">
    <c-title :hide="false"
             :text="'我的语音'"></c-title>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <ul>
        <li v-for="(item,index) in voiceList"
            :key="index"
            @click="gotoDetail(item.goods_id)">
          <div class="voice_box">
            <div class="voice_img"><img :src="item.has_one_goods.thumb" /></div>
            <div class="voice_text">
              <span class="title"
                    style="-webkit-box-orient: vertical;">{{item.has_one_goods.title|sliceString}}<em>{{item.status}}</em> </span>
              <span class="time">授权时间：{{item.created_at.substring(0, 10)}}</span>
            </div>
            <div class="voice_button"
                 @click.stop="select(index,item.has_one_voice.curriculum[0].url)">
              <img src="../../../assets/images/stop1.png"
                   alt=""
                   v-if="selectedNum==index&&!songStop" />
              <img src="../../../assets/images/play1.png"
                   alt=""
                   v-if="selectedNum!=index||songStop" />
            </div>
          </div>
          <div class="slider"
               ref="slider"
               v-if="selectedNum==index">
            <div class="slider-track"></div>
            <div class="slider-fill"
                 :style="'width:'+sliderTime+'%'"></div>
          </div>
          <div v-if="item.type == 0"
               class="voice_failure"
               @click.stop="failGood()"></div>
        </li>
        <audio id="audios"
               ref="audios"
               @timeupdate="onTimeupdate"
               @loadedmetadata="onLoadedmetadata"></audio>
      </ul>
    </van-pull-refresh>
    <img src="../../../assets/images/blank.png"
         alt=""
         v-if="isNOInfo"
         style="width: 5rem; margin-top: 5rem;">
  </div>
</template>

<script>
import my_voices_controller from "./my_voices_controller";
export default my_voices_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#my_voices {
  background: #fff;
  min-height: 100vh;

  ul {
    li {
      padding: 0.25rem 1rem;
      overflow: hidden;
      position: relative;

      .voice_box {
        display: flex;
        justify-content: space-between; /** 两端对齐，之间的间隔都相等。 */
        .voice_img {
          width: 4.25rem;
          height: 4.25rem;
          overflow: hidden;
          border-radius: 0.3125rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .voice_text {
          flex: 1;
          padding: 0 1rem;
          text-align: left;
          font-weight: bold;
          display: flex;
          flex-direction: column; /** 主轴为垂直方向，起点在上沿 */
          justify-content: space-between;

          .title {
            width: 100%;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            color: #404040;
            line-height: 1.375rem;

            em {
              display: inline-block;
              height: 1rem;
              line-height: 1rem;
              padding: 0 0.5rem;
              background-color: #f4f4f4;
              border-radius: 0.5rem;
              color: #ffa800;
              font-size: 9px;
              margin-left: 0.5rem;
            }
          }

          .time {
            display: inline-block;
            width: 100%;
            font-size: 10px;
            color: #777;
          }
        }

        .voice_button {
          display: flex;

          img {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      }

      .slider {
        width: 100%;
        position: relative;
        height: 10px;

        /* margin-top: 20px; */
        display: flex;
        align-items: center;
        cursor: default;
        user-select: none;
        outline: none;
      }

      .slider-track {
        position: absolute;
        height: 2px;
        left: 0;
        right: 0;
        top: 50%;
        margin-top: -1px;
        background-color: #bec2c1;
      }

      .slider-fill {
        position: absolute;
        height: 2px;
        width: 100%;
        background-color: #ffba00;
        left: 0;
        top: 50%;
        margin-top: -1px;
      }

      .slider-thumb {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        background-color: #ffba00;
        color: #ffba00;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }

      .voice_failure {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
