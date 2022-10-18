import tinymce from '../components/tinymce/tinymce';
import navigation from './mycomponents/navigation';
import caseBottom from './mycomponents/case_bottom';
import secrvicePc from './mycomponents/service_pc';
import bottomAdv from './mycomponents/bottom_adv';


import { Toast } from 'vant';
export default {
  data() {
    return {
      view_show:false,
      province_list: [],
      city_list: [],

      category_list: [],
      upload_type: '',
      showPC: false,
      form: {
        case_name: '',
        img: '',
        img_mini: '',
        img_h5: '',
        content: '',
        province: {},
        province_id: '',
        city_id: '',
        screen_shot: [],
        screen_shot_url: [],
        category: [],
        category_obj: [],
        label: []
      },
      label_show: false,
      label_list: [],
      label_word: '',
      label_kwd: '', //标签搜索
      label_total: 0,
      label_per_page: 0,
      label_current_page: 0,
      rules: {}
    };
  },
  activated() {
    this.initData();
    this.view_show = true;
    this.province_list = district;
    console.log(district);
    this.getCategory();
    window.onbeforeunload =null;

  },
  mounted() {
    if (!this.view_show) {
      this.province_list = district;
      console.log(district);
      this.getCategory();
      window.onbeforeunload =null;
    }
  },
  methods: {
    initData() {
      this.province_list= [];
      this.city_list= [];

      this.category_list= [];
      this.upload_type= '';
      this.showPC= false;
      this.form= {
        case_name: '',
        img: '',
        img_mini: '',
        img_h5: '',
        content: '',
        province: {},
        province_id: '',
        city_id: '',
        screen_shot: [],
        screen_shot_url: [],
        category: [],
        category_obj: [],
        label: []
      },
      this.label_show= false;
      this.label_list= [];
      this.label_word= '';
      this.label_kwd= ''; //标签搜索
      this.label_total= 0;
      this.label_per_page= 0;
      this.label_current_page= 0;
    },
    addCategory() {
      this.form.category_obj.push({ category_first: '', category_second: '', second_list: [] });
    },
    changeCategory(index, val) {
      let that = this;
      let obj = that.category_list.find((item, index) => {
        return val == item.id;
      });
      console.log(obj);
      this.form.category_obj[index].category_second = '';
      this.form.category_obj[index].second_list = obj.sub_category;
      // this.form.category_obj[index].second_list =  this.category_list[index].sub_category
    },
    delCategory(index) {
      this.form.category_obj.splice(index, 1);
    },

    beforeRead(type) {
      console.log(type);
      this.upload_type = type;
    },
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        this.onRead_1(e, flag);
      }
    },

    removeImg: function(delIndex) {
      this.form.screen_shot.splice(delIndex, 1);
      this.form.screen_shot_url.splice(delIndex, 1);
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append('file', e);
      } else {
        fd.append('file', e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl('upload.uploadPic'), fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            That.form.screen_shot_url.push(responseData.data.img_url);
            That.form.screen_shot.push(responseData.data.img);
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /*vant图片上传*/
    onRead(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();

      if (flag === true) {
        fd.append('file', e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append('file', e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl('upload.uploadPic'), fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            console.log(That.upload_type);
            That.form[That.upload_type] = responseData.data.img;
            That.form[That.upload_type + '_url'] = responseData.data.img_url;
            Toast.clear();
            this.$forceUpdate();
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    clearImg(type) {
      console.log(type);
      this.form[type] = '';
      this.form[type + '_url'] = '';
      this.$forceUpdate();
    },
    onphotosize2() {
      Toast('图片超过了10M,请压缩图片后上传!');
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 1024,
              maxHeight = 1024;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过1024x1024的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || 'image/png');
          };
        };
      }
    },
    changePro(item) {
      console.log(item);
      this.city_list = item.c;
      this.form.province_id = item.v;
      // this.province_text = item.n
      this.form.city_id = '';
    },
    getCategory() {
      let that = this;
      $http.post('plugin.case-library.api.release.get-category', {}, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.category_list = response.data.category;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        (response)=> {
          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    getLabel(val) {
      let that = this;
      $http.post('plugin.case-library.api.release.get-label', { label_kwd: that.label_kwd, page: val }, '').then(
        response => {
          if (response.result === 1) {
            that.history_show = true;
            that.label_list = response.data.list.data;
            this.label_total = response.data.list.total;
            this.label_per_page = response.data.list.per_page;
            this.label_current_page = response.data.list.current_page;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        (response)=> {
          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },

    sureAddLabel() {
      if (this.label_word == '') {
        this.$message.error('请输入标签');
        return;
      }
      let that = this;
      $http.post('plugin.case-library.api.release.add-label', { label_name: that.label_word }, '').then(
        response => {
          if (response.result === 1) {
            that.history_show = false;
            that.form.label.push({ id: response.data.id, label_name: that.label_word });
            that.label_word = '';
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        (response)=> {
          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    handleClose(index) {
      this.form.label.splice(index, 1);
    },
    chooseLabel(item) {
      console.log(item);
      this.history_show = false;
      let obj = this.form.label.find((item1, index) => {
        return item1.id == item.id;
      });
      if (obj) {
        this.$forceUpdate();
        return;
      }

      this.form.label.push({ id: item.id, label_name: item.label_name });
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    },
    gotoMyPublish() {
      this.$router.push(this.fun.getUrl('caseLibraryMypublish', {}));
    },

    submitForm() {
      let that = this;
      let json = {
        case:{
          case_name:that.form.case_name,
          img:that.form.img,
          img_mini:that.form.img_mini,
          img_h5:that.form.img_h5,
          desc:that.form.desc,
          content:that.form.content,
          province_id:that.form.province_id,
          city_id:that.form.city_id,
          screen_shot:that.form.screen_shot,
        },
        category:[],
        label:[],
      };
      that.form.category_obj.forEach((item,index) => {
        json.category.push({category_first:item.category_first,category_second:item.category_second});
      });
      that.form.label.forEach((item,index) => {
        json.label.push(item.id);
      });
      $http.post('plugin.case-library.api.release.release-case', json, '').then(
        response => {
          if (response.result === 1) {
            Toast('发布成功');
            that.gotoHome();
          } else {
            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        (response)=> {
          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    }
  },
  components: { tinymce, navigation, caseBottom, secrvicePc,bottomAdv }
};
