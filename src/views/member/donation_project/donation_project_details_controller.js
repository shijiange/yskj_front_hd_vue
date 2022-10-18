import { ImagePreview } from "vant";
export default {
  data() {
    return {
      time_show: false,
      time_text: "",
      current_year: "",
      current_month: "",
      max_year: "",
      max_month: "",

      person: {},
      info_list: [],
      picture_list: [],
      video_list: [],
      pic_src_list: []
    };
  },
  created() {
    let date = new Date();
    this.current_year = date.getFullYear();
    this.max_year = date.getFullYear();
    this.current_month = date.getMonth() + 1;
    this.max_month = date.getMonth() + 1;

    this.getData();
  },
  methods: {
    getData() {
      let json = { id: this.$route.query.id };
      if (this.time_text != "") {
        json.time = this.time_text;
      }
      $http.post("plugin.present-project.frontend.project.personDetail", json, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.person = res.data.person;
        let info_list = [],
          picture_list = [],
          video_list = [],
          pic_src_list = [];

        res.data.person_list.forEach(element => {
          if (info_list.length < 5) {
            let project_title = "";
            if (element.project_v && element.project_v.title) {
              project_title = element.project_v.title;
            }
            let o = { id: element.id, price: element.price, remarks: element.remarks, project_title };
            info_list.push(o);
          }
          if (picture_list.length < 10) {
            if (element.change_img) {
              element.change_img.forEach(item => {
                if (picture_list.length == 10) return;
                let project_title = "";
                if (element.project_v && element.project_v.title) {
                  project_title = element.project_v.title;
                }
                let o = { name: project_title, url: item };
                picture_list.push(o);
                pic_src_list.push(item);
              });
            }
          }

          if (video_list.length < 10) {
            if (element.change_video) {
              element.change_video.forEach(item => {
                if (video_list.length == 10) return;
                let project_title = "";
                if (element.project_v && element.project_v.title) {
                  project_title = element.project_v.title;
                }
                let o = { name: project_title, url: item };
                video_list.push(o);
              });
            }
          }
        });

        this.info_list = info_list;
        this.picture_list = picture_list;
        this.video_list = video_list;
        this.pic_src_list = pic_src_list;
      });
    },

    gotoPage(name) {
      let query = { id: this.$route.query.id };
      if (this.time_text != "") {
        query.time = this.time_text;
      }
      this.$router.push(this.fun.getUrl(name, {}, query));
    },
    handPictureImagePreview(key) {
      ImagePreview({
        images: this.pic_src_list,
        startPosition: key,
        closeable: true
      });
    },

    changeYear(type) {
      if (type == "add") {
        if (this.current_year < this.max_year) {
          this.current_year++;
          if (this.current_year == this.max_year) {
            this.current_month = this.max_month;
          }
        }
      } else if (type == "recude") {
        if (this.current_year > 1) this.current_year--;
      }
    },
    changeMonth(item) {
      if (this.current_year >= this.max_year) {
        if (item <= this.max_month) {
          this.current_month = item;
        }
      } else {
        this.current_month = item;
      }
    },
    timeConfirm() {
      this.time_show = false;
      this.time_text = this.current_year + "-" + this.current_month;
      this.getData();
    }
  }
};
