<template>
  <div class="hello">
    <!--<button class="record" @click="start">开始录音</button>-->
    <!--<br />-->
    <!--<button @click="stop">停止录音</button>-->
    <!--<br />-->
    <!--<button @click="cancel">取消录音</button>-->
    <!--<br />-->
    <!--<button @click="play">播放录音</button>-->
    <!--<button @click="pausePlay">暂停播放</button>-->
    <!--<button @click="stopPlay">停止播放</button>-->
    <!--<button @click="upVoice">上传语音</button>-->
    <!--<button @click="downVoice">下载录音</button>-->
    <!-- <button @click="fake">假的</button> -->
    <!-- <button @click="setTime">开始计时</button>
    <button @click="creamTime">停止计时</button> -->
    <!--<br />-->
    <!--<p>录音时间{{ time }}</p>-->

    <!--<br/><br/><br/><br/><br/>-->
    <!--<div id="player-amr">-->
    <!--<p>-->
    <!--加载演示文件：<button id="amr-load" @click="loadDemoBtn">加载、解码</button>-->
    <!--<a href="//localhost:8081/addons/yun_shop/static/app/mario.amr">下载演示文件：mario.amr</a>-->
    <!--</p>-->
    <!--<p>-->
    <!--加载本地文件：<input type="file" ref="inputer" @change="loadAmrFile" id="amr-file" accept=".amr">（不会上传到任何服务器）-->
    <!--</p>-->
    <!--<p>-->
    <!--<audio ref="audios" controls></audio>-->
    <!--</p>-->
    <!--<p>-->
    <!--<button id="amr-play" disabled @click="playAmr">播放</button>-->
    <!--<span id="amr-duration">0'</span>-->
    <!--</p>-->
    <!--</div>-->
    <!--<div class="list">-->
    <!--&lt;!&ndash;disabled未录音&ndash;&gt;-->
    <!--<div class="btn_a">-->
    <!--<audio  src="https://dev1.yunzshop.com/addons/yun_shop/storage/app/public/business_card/3f91e0ce6866d86639e81aab8f4951a2_5.amr"  controls></audio>-->
    <!--</div>-->
    <!--<button-->
    <!--class="btn_b"-->
    <!--type="button"-->
    <!--@click="playAmr"-->
    <!--&gt;-->
    <!--开始播放-->
    <!--</button>-->

    <!--</div>-->

    <!--<div class="list">-->
    <!--刚录完的语言-->
    <!--<audio ref="player" src=""  controls></audio>-->
    <!-- ./status/uploads/record/cplZxG7oYspQxopQIb9g_cUJ7Y69htn_ybzFiRZR_U3Vf8Bv4Nh6D6TBPWa5VmGs.mp3 -->
    <!--</div>-->
    <!--<br />-->
    <!--<div>-->
    <!--<button @click="merge">合并所有录音</button>-->
    <!--<audio ref="allRecord" src=""  controls></audio>-->
    <!--</div>-->
    <div @click="toMin">调起小程序</div>
  </div>
</template>

<script>
const _this = wx;
export default {
  name: "test",
  data() {
    return {
      localId: "",
      serverId: "",
      downLoadId: "",
      Soff: true,
      time: 0,
      timer: null,
      voice: ""
    };
  },
  created() {
    // this.initShare();
  },
  mounted() {
    // this.amr = null;
    //
    // this.loadDemoBtn1 = document.querySelector('#amr-load');
    // this.loadAmrFile1 = document.querySelector('#amr-file');
    // this.playBtn = document.querySelector('#amr-play');
    // this.duration = document.querySelector('#amr-duration');
  },
  methods: {
    toMin() {
      YDB.MiniWX("gh_cdb1a2dfcd17", "/packageD/buy/orderPay/orderPay.html?order_id=7669&status=2");
    },
    end(blob) {
      let audiosDOM = this.$refs.audios;
      audiosDOM.src = URL.createObjectURL(blob);
      audiosDOM.onended = function() {
        console.log("isend");
      };
      console.log(audiosDOM);
      audiosDOM.play();
    },
    initWithUrl(url) {
      if (this._isInit || this._isInitRecorder) {
        throw new Error("AMR has been initialized. For a new AMR, please generate a new BenzAMRRecorder().");
      }

      const p = new Promise((resolve, reject) => {

        fetch(url, {
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "application/octet-stream" },
          credentials: "include"
        })
          .then((response) => {
            if (response.ok) {
              response.blob().then(function(blob) {
                console.log(blob);
                resolve(blob);
              });
            }
          })
          .catch((err) => {
            reject(err);
          });

      });
      return p.then(blob => {
        return blob;
      });
    },
    loadDemoBtn(voice) {
      // this.amr = new BenzAMRRecorder();
      this.loadDemoBtn1.setAttribute("disabled", true);
      this.loadAmrFile1.setAttribute("disabled", true);
      this.playBtn.setAttribute("disabled", true);
      const that = this;
      // http://localhost:8081/addons/yun_shop/static/app/mario.amr
      // https://dev1.yunzshop.com/addons/yun_shop/storage/app/public/business_card/3f91e0ce6866d86639e81aab8f4951a2_5.amr
      that.initWithUrl("http://localhost:8081/addons/yun_shop/static/app/mario.amr").then((data) => {
        Recorder.amr2wav(data, function(blob) {
          that.end(blob);
          console.log("已转码成wav播放");
        }, function(msg) {
          console.log("转码成wav失败：" + msg);
        });
        that.loadDemoBtn1.removeAttribute("disabled");
        that.loadAmrFile1.removeAttribute("disabled");
        that.playBtn.removeAttribute("disabled");
        // that.duration.innerHTML = that.amr.getDuration().toFixed(2) + '\'';
      });

      // 绑定事件
      // this.amr.onPlay(()=> {
      //   console.log('Event: play');
      //   this.playBtn.innerHTML = '停止';
      // });
      // this.amr.onStop(()=> {
      //   console.log('Event: stop');
      //   this.playBtn.innerHTML = '播放';
      // });
      // this.amr.onEnded(()=> {
      //   console.log('Event: ended');
      //   this.playBtn.innerHTML = '播放';
      // });
      // this.amr.onAutoEnded(()=> {
      //   console.log('Event: autoEnded');
      // });
      // this.amr.onStartRecord(()=> {
      //   console.log('Event: startRecord');
      // });
      // this.amr.onFinishRecord(function () {
      //   console.log('Event: finishRecord');
      // });
      // this.amr.onCancelRecord(function () {
      //   console.log('Event: cancelRecord');
      // });
    },
    playAmr() {
      if (this.amr.isPlaying()) {
        this.amr.stop();
      } else {
        this.amr.play();
      }
    },
    loadAmrFile(event) {
      let inputDOM = this.$refs.inputer;
      this.amr = new BenzAMRRecorder();
      this.loadDemoBtn1.setAttribute("disabled", true);
      this.loadAmrFile1.setAttribute("disabled", true);
      this.playBtn.setAttribute("disabled", true);
      this.amr.initWithBlob(inputDOM.files[0]).then(() => {
        this.loadDemoBtn1.removeAttribute("disabled");
        this.loadAmrFile1.removeAttribute("disabled");
        this.playBtn.removeAttribute("disabled");
        this.duration.innerHTML = this.amr.getDuration().toFixed(2) + "'";
      });

      // 绑定事件
      this.amr.onPlay(() => {
        console.log("Event: play");
        this.playBtn.innerHTML = "停止";
      });
      this.amr.onStop(() => {
        console.log("Event: stop");
        this.playBtn.innerHTML = "播放";
      });
      this.amr.onEnded(() => {
        console.log("Event: ended");
        this.playBtn.innerHTML = "播放";
      });
      this.amr.onAutoEnded(() => {
        console.log("Event: autoEnded");
      });
      this.amr.onStartRecord(function() {
        console.log("Event: startRecord");
      });
      this.amr.onFinishRecord(function() {
        console.log("Event: finishRecord");
      });
      this.amr.onCancelRecord(function() {
        console.log("Event: cancelRecord");
      });
    },
    // initShare() {  没有用到
    //   let that = this;
    //   let _url = document.location.href;
    //   $http.post("member.member.wxJsSdkConfig", { url: _url }).then(
    //     function(response) {
    //       if (response.result === 1) {
    //         that.share(response.data);
    //       } //else {
    //       //}
    //     },
    //     function(response) {
    //       console.log(response);
    //     }
    //   );
    // },
    //组装分享设置
    // share(data) {
    //   wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: data.config.appId, // 必填，公众号的唯一标识
    //     timestamp: data.config.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: data.config.nonceStr, // 必填，生成签名的随机串
    //     signature: data.config.signature, // 必填，签名
    //     jsApiList: [
    //       "onMenuShareTimeline",
    //       "onMenuShareAppMessage",
    //       "showOptionMenu",
    //       "startRecord",
    //       "stopRecord",
    //       "playVoice",
    //       "pauseVoice",
    //       "stopVoice",
    //       "uploadVoice",
    //       "downloadVoice"
    //     ] // 必填，需要使用的JS接口列表
    //     // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
    //   });
    //   // wx.config(data.config);
    //   wx.ready(function() {
    //     let _title = "录音";
    //     let _link = document.location.href;
    //     let _imgUrl = "";
    //     let _desc = "";

    //     wx.showOptionMenu();
    //     wx.onMenuShareTimeline({
    //       title: _title, // 分享标题
    //       link: _link, // 分享链接
    //       imgUrl: _imgUrl, // 分享图标
    //       success: function() {
    //         alert("分享成功");
    //       },
    //       cancel: function() {
    //         alert("取消分享");
    //       }
    //     });

    //     wx.onMenuShareAppMessage({
    //       title: _title, // 分享标题
    //       desc: _desc, // 分享描述
    //       link: _link, // 分享链接
    //       imgUrl: _imgUrl, // 分享图标
    //       type: "link", // 分享类型,music、video或link，不填默认为link
    //       dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
    //       success: function() {
    //         alert("分享成功");
    //       },
    //       cancel: function() {
    //         alert("取消分享");
    //       }
    //     });
    //   });
    // },
    // 开始录音
    start(e) {
      let that = this;
      that.time = 0;
      _this.startRecord({
        success: function() {
          alert("成功调起录音");
          that.timer = setInterval(() => {
            that.time++;
          }, 1000);
          that.vicoeEnd();
        },
        cancel: function() {
          alert("用户拒绝授权录音");
        }
      });
    },
    // 停止录音
    stop() {
      let that = this;
      // clearInterval(that.timer)
      _this.stopRecord({
        success: function(res) {
          alert("暂停成功");
          console.log(res);
          clearInterval(that.timer);
          that.localId = res.localId;
          that.upVoice();
        },
        fail: function(error) {
          alert("死啦停不了");
          console.log(error);
        }
      });
    },
    // 取消录音
    cancel() {
      _this.stopRecord({
        success: res => {
          alert("取消录音");
        }
      });
    },
    // 60秒监听
    vicoeEnd() {
      let that = this;
      _this.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
          alert("60秒停止录音");
          that.localId = res.localId;
          clearInterval(that.timer);
          that.upVoice();
        }
      });
    },
    // 合并
    merge() {
      let that = this;
      var apiUrl = window.location.href;
      this.axios({
        method: "post",
        url: "http://apiwx.lostars.cn/index.php/index/File/merge",
        headers: { "Content-Type": "application/json" },
        data: {
          url: apiUrl
        }
      })
        .then(ser => {
          console.log(ser);
          that.$refs.allRecord.src = ser.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // // 播放
    play() {
      let that = this;
      console.log(that.localId);
      _this.playVoice({
        localId: that.localId // 需要播放的音频的本地ID，由stopRecord接口获得
      });
    },
    // // 暂停
    pausePlay() {
      let that = this;
      _this.pauseVoice({
        localId: that.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      });
    },
    // 停止
    stopPlay() {
      let that = this;
      _this.stopVoice({
        localId: that.localId // 需要停止的音频的本地ID，由stopRecord接口获得
      });
    },
    // 上传语音
    upVoice() {
      let that = this;
      wx.uploadVoice({
        localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          alert(JSON.stringify(res));
          that.serverId = res.serverId; // 返回音频的服务器端ID
          axios
            .post(that.fun.getRealUrl("plugin.business-card.frontend.controllers.card.card.get-voice"), { media_id: res.serverId }, {
              headers: { "Content-Type": "application/json" }
            })
            .then(response => {
              let responseData = response.data;
              if (responseData.result === 1) {
                that.voice = responseData.data;
                that.loadDemoBtn();
              } else {
                alert(responseData.msg);
              }
            })
            .catch(error => {
              alert(error);
              console.log(error);
            });
        }
      });
    },
    // 下载语音
    downVoice() {
      let that = this;
      _this.downloadVoice({
        serverId: that.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          alert("下载成功");
          that.downLoadId = res.localId; // 返回音频的本地ID
          alert(res);
          console.log(res);
          console.log(that.downLoadId);
        }
      });
    }
    // 模拟上传语音
    // fake () {
    //   var apiUrl = window.location.href
    //   this.axios({
    //     method: 'post',
    //     url: 'api',
    //     headers: {'Content-Type': 'application/json'},
    //     data: {
    //       serverId: 'cplZxG7oYspQxopQIb9g_cUJ7Y69htn_ybzFiRZR_U3Vf8Bv4Nh6D6TBPWa5VmGs',
    //       url: apiUrl
    //     }
    //   })
    //     .then((res) => {
    //       console.log(res)
    //       this.$refs.player.src = res.data
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
