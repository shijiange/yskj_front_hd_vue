export default {
  data() {
    return {
      videoTime: null,
      videoSrc: "",
      vid: "",
      videoTapPlay: false,
      fmimg: '',
      duration:0,
      percentage:'',
      percenTap:false
    };
  },
  activated() {
    this.vid = this.$route.params.id;
    // this.videoSrc = this.$route.params.url;
    this.getData();
  },
  deactivated() {
    clearInterval(this.videoTime);
  },
  methods: {
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.video.get-info", { video_id: that.vid }).then(
        response => {
          if (response.result === 1) {
            console.log(response.data);
            this.videoSrc = response.data.url;
            that.fun.setWXTitle(response.data.title);
            that.fmimg = response.data.image;
            that.videoTapPlay = false;
            that.percentage = response.data.percentage;
            this.addVideoPlayEnd();
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    tapPlay() {
      console.log('11111111');
      this.videoTapPlay = true;
      this.$refs.video.play();
      this.addVideoPlayEnd();
      this.getvideoprogress();
      console.log(this.$refs.pic.offsetHeight > Math.ceil(window.innerHeight * (7 / 8)));
      this.$refs.pic.offsetHeight > Math.ceil(window.innerHeight * (7 / 8))
        ? (this.minStyle = false)
        : (this.minStyle = true);
    },
    getvideoprogress(){
      var cur,dur = '';
      var that = this;
      let loadOne = false;
      document.getElementById('video1').addEventListener('timeupdate', (res) => {
        cur = res.target.currentTime.toFixed(1);
        dur = res.target.duration.toFixed(1);
        if(Math.floor((cur/dur)*100) >= that.percentage){
          if(!loadOne){
            loadOne = true;
            $http.get("plugin.agent-qa.api.video.watch-video", { video_id: that.vid }).then(
              response => {
                if (response.result === 1) {
                  console.log(response);
                }
              },
              response => {
                console.log(response.msg);
              }
            );
          }
          
        }else{
          // that.percenTap = false;
        }
        this.duration = res.target.duration;
      });
    },
    addVideoPlayEnd() {
      var that = this;
      if (this.videoTime) clearInterval(this.videoTime);
      this.videoTime = setInterval(() => {
        let flag = this.$refs.video.ended;
        if (flag) {
          console.log("播放结束");
          that.videoTapPlay = false;
          clearInterval(this.videoTime);
        }
      }, 1000);
    }
  },
  components: {
  }
};