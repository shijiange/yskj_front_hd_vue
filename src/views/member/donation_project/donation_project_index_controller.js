import { ImagePreview } from "vant";
export default {
  data() {
    return {
      latest_list: [],
      picture_list: [],
      video_list: [],

      pic_src_list: [],

      video_src:'',
      video_show:false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.present-project.frontend.project.index", {}, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }

        this.latest_list = res.data.latest_list;
        let picture_list = [],
          video_list = [],
          pic_src_list = [];
        res.data.project_img_list.forEach(element => {
          if (picture_list.length == 10) return;
          if(element.change_img){
            element.change_img.forEach(item => {
              if (picture_list.length == 10) return;
              let o = { name: element.title, url: item };
              picture_list.push(o);
              pic_src_list.push(item);
            });
          }
          
        });
        res.data.project_video_list.forEach(element => {
          if (video_list.length == 10) return;
          if(element.change_video){
            element.change_video.forEach(item => {
              if (video_list.length == 10) return;
              let o = { name: element.title, url: item };
              video_list.push(o);
            });
          }
          
        });

        this.picture_list = picture_list;
        this.video_list = video_list;
        this.pic_src_list = pic_src_list;
      });
    },
    handPictureImagePreview(key) {
      ImagePreview({
        images: this.pic_src_list,
        startPosition: key,
        closeable: true
      });
    },
    handImagePreview(url) {
      ImagePreview({
        images: [url],
        startPosition: 0
      });
    },
    gotoPage(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    },
    handVideoPay(src){
      console.log(src);
      this.video_show = true;
      this.video_src=src;
    }
  }
};
