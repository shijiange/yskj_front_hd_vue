<template>
    <div id="voice_detail">
        <c-title :hide="false" :text="'音频详情'"></c-title>
        <div id="content" v-if="isShow === 1">
            <div class="content_a">
                <div class="banner">
                    <div class="image" v-if='dataInfo.thumb'><img :src="dataInfo.thumb"/></div>
                    <div class="image" v-if='!dataInfo.thumb'>
                        <img src="../../../../assets/images/img_default.png"/>
                    </div>
                </div>
                <h1>{{dataInfo.title}}</h1>
                <div class="audio-wrapper">
                    <audio id="audio" ref="audio"  @pause="onPause" @play="onPlay"
                           @timeupdate="onTimeupdate"
                           @loadedmetadata="onLoadedmetadata"
                           controls="controls" style="display: none;" :src="dataInfo.audio_links">
                        <!--<source-->
                            <!--:src="dataInfo.audio_link"-->
                            <!--type="audio/mp3">-->
                        您的浏览器不支持 audio 标签！
                    </audio>
                    <div class="audio-left">
                        <img @click="startPlayOrPause" v-if="isPlay&&readyState>0"
                             src="../../../../assets/images/play.png">
                        <img @click="startPlayOrPause" v-if="!isPlay&&readyState>0"
                             src="../../../../assets/images/pause.png">
                        <img v-if="readyState < 1" src="../../../../assets/images/loading.gif"/>
                    </div>
                    <div class="slider" ref="slider" @touchstart="handleTouchStart">
                        <div class="slider-track"></div>
                        <div class="slider-fill" :style="'width:'+sliderTime+'%'"></div>
                        <div class="slider-thumb" :style="'left:'+sliderTime+'%'"></div>
                    </div>
                    <div class="time">
                        <div class="time_left">{{ audio.currentTime | formatSecond}}</div>
                        <div class="time_right">{{ audio.maxTime | formatSecond}}</div>
                    </div>


                </div>
            </div>
            <div class="content_b">
                <h2>【音频简介】<span>{{dataInfo.created_at}}</span></h2>
                <div class="text" v-html="dataInfo.content"></div>
            </div>
            <div class="content_c" v-if="codeUrl">
                <h3>【二维码】</h3>
                <div class="code">
                    <span>长按识别二维码</span>
                    <div class="img">
                        <img :src="codeUrl">
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import voice_detail_controller from "./voice_detail_controller";

export default voice_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #voice_detail {
    #content {
      .content_a {
        background: #fff;
        padding-bottom: 0.625rem;

        .banner {
          width: 100%;
          height: 10.375rem;
          overflow: hidden;
          background: #f5f5f5;

          img {
            width: 100%;
            height: 10.375rem;
          }
        }

        h1 {
          font-size: 16px;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: left;
          padding: 0 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .audio-wrapper {
          background-color: #fcfcfc;
          margin: 10px auto;
          width: 100%;
          height: 70px;
          border: 1px solid #e0e0e0;
          color: #3e3e3e;
        }

        .audio-left {
          float: left;
          text-align: center;
          width: 18%;
          height: 100%;
        }

        .audio-left img {
          width: 40px;
          position: relative;
          top: 15px;
          margin: 0;
          display: initial; /* 解除与app的样式冲突 */
          cursor: pointer;
        }

        .slider {
          width: 80%;
          position: relative;
          height: 30px;
          margin-top: 20px;
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
          background-color: #28a4e9;
          left: 0;
          top: 50%;
          margin-top: -1px;
        }

        .slider-thumb {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          background-color: #28a4e9;
          color: #28a4e9;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }

        .time {
          display: flex;
        }

        .time_left {
          flex: 1;
          text-align: left;
        }

        .time_right {
          flex: 0 0 3rem;
          padding-right: 1rem;
        }
      }

      .content_b {
        background: #fff;
        margin-top: 0.625rem;

        h2 {
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          padding: 0 0.875rem;

          span {
            font-size: 14px;
            color: #8c8c8c;
            font-weight: normal;
          }
        }

        .text {
          padding: 0.625rem 1.25rem;
          text-align: left;
          font-size: 14px;
          color: #666;
        }
      }

      .content_c {
        background: #fff;
        margin-top: 0.625rem;
        padding-bottom: 1.25rem;

        h3 {
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 16px;
          text-align: left;
          padding: 0 0.875rem;
        }

        .code {
          span {
            color: #8c8c8c;
          }

          .img {
            width: 7.5rem;
            height: 7.5rem;
            overflow: hidden;
            background: #f5f5f5;
            margin: 0.625rem auto;

            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
#voice_detail {
  img {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  iframe {
    width: 100% !important;
  }

  li {
    list-style: inherit;
  }
}
</style>