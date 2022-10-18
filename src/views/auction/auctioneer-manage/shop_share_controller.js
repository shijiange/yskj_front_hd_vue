import cTitle from "components/title";
export default {
  data() {
    return {};
  },
  activated() {
    
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    }
  },
  components: {
    cTitle
  }
};
