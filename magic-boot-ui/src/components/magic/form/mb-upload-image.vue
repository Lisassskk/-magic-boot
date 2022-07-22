<template>
  <div>
    <vuedraggable
      v-model="urls"
      class="vue-draggable"
      tag="div"
      draggable=".draggable-item"
      @end="onDragEnd"
      item-key="id"
    >
      <template #item="{ element }">
      
        <div
          v-if="urls.length>0 "
          :style="{ width: width + 'px', height: height + 'px' }"
          class="draggable-item"
        >
        <!-- 

          :style="{ width: width + 'px', height: height + 'px' }"
          <span>{{element.response.data.url}}</span> 
          
          
          -->
          <a-image
            v-if=" element.status=='done' && element.response && element.response.code==200"
            :width="width"
            :height="height"
            :src="$global.baseApi + element.response.data.url"
            :preview="false"
            :error="(e)=>{
              console.log('*************e:{}',e);
            }"
          />
          <a-image
            :v-else="element"
            :width="width"
            :height="height"
            :src="$global.baseApi + element"
            :preview="false"
            :error="(e)=>{
              console.log('*************e:{}',e);
            }"
          />
          
          <!-- 
             v-if="element.response && element.response.code==200"
            :src="$global.baseApi + element.response.data.url"
            :preview-src-list="[$global.baseApi + element]"
           -->
          <div class="tools">
            <div class="shadow" @click="handleRemove(element)">
              <a-icon>
                <ElIconDeleteOutlined />
              </a-icon>
            </div>
            <div class="shadow" @click="beforeCropper(element)">
              <a-icon>
                <ElIconScissorOutlined />
              </a-icon>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <a-upload
          v-show="(!multiple && urls.length == 0) || (multiple && urls.length < limit)"
          ref="uploadRef"
          class="uploadBox"
          :action="action"
          v-bind="uploadDynamicProps"
          :headers="headers"
          :withCredentials="true"
          accept=".jpg,.jpeg,.png,.gif"
          :show-upload-list="false"
          :multiple="multiple"
          :maxCount="limit"
          list-type="picture-card"
          v-model:file-list="urls"
          @change="changeValue"
        >

        <!--  
          :supportServerRender="false"
          :limit="limit"
          :style="{ width: width + 'px', height: height + 'px' }"  
           :on-success="handleAvatarSuccess"
          :on-exceed="onExceed"
          -->
          <icon class="uploadIcon">
            <ElIconPlusOutlined />
            <span v-show="isUploading" class="uploading">正在上传...</span>
            <span
              v-if="!isUploading && limit && limit!==99 && multiple"
              class="limitTxt"
            >最多{{ limit }}张</span>
          </icon>
        </a-upload>
      </template>
    </vuedraggable>
    <div v-if="tip" class="a-upload__tip" :style="{ color: tipColor }">{{ tip }}</div>
    <mb-dialog ref="cropperDialog" @confirm-click="cropper">
      <template #content>
        <div class="cropper-content">
          <div class="cropper" style="text-align:center">
            <vueCropper
              ref="cropper"
              v-bind="cropperOption"
              :outputSize="cropperOption.outputSize === undefined ? 0.8 : cropperOption.outputSize"
              :outputType="cropperOption.outputType === undefined ? 'jpeg' : cropperOption.outputType"
              :canMove="cropperOption.canMove === undefined ? true : cropperOption.canMove"
              :canMoveBox="cropperOption.canMoveBox === undefined ? true : cropperOption.canMoveBox"
              :autoCrop="cropperOption.autoCrop === undefined ? true : cropperOption.autoCrop"
              :centerBox="cropperOption.centerBox === undefined ? true : cropperOption.centerBox"
            />
          </div>
        </div>
      </template>
    </mb-dialog>
  </div>
</template>

<script>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import vuedraggable from 'vuedraggable'
import { getToken } from '@/scripts/auth'
import { instanceOf } from 'vue-types'

export default {
  name: 'MbUploadImage',
  emits: ['update:modelValue', 'change'],
  components: { vuedraggable, VueCropper },
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      required: false
    },
    externalId: {
      type: String,
      default: ''
    },
    externalType: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 2
    },
    cropperConfig: {
      type: Object,
      default: () => {}
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    tip: {
      type: String,
      default: ''
    },
    tipColor: {
      type: String,
      default: ''
    },
    join: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      action: import.meta.env.VITE_APP_BASE_API + 'system/file/upload',
      headers: {
        token: getToken()
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      isUploading: false,
      cropperOption: {},
      urls: [],
      fileList: [],
      uploadDynamicProps: {}
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue instanceof Array) {
        this.urls = newValue
        this.fileList = this.urls.map(it => { return { response: { data: { url: it }}} })
      } else {
        if (newValue && this.urls.length === 0) {
          this.urls.push(newValue)
        }
      }
    }
  },
  created() {
    this.cropperOption = this.cropperConfig || {}
    this.cropperOption.img = ''
    if (this.externalId) {
      this.$get('system/file/files', { externalId: this.externalId, externalType: this.externalType }).then(res => {
        this.urls = res.data
      })
      this.action = this.action + `?externalId=${this.externalId}&externalType=${this.externalType}`
    } else {
      if (this.modelValue instanceof Array) {
        this.urls = this.modelValue
        this.fileList = this.urls.map(it => { return { response: { data: { url: it }}} })
      } else {
        if (this.modelValue) {
          this.urls.push(this.modelValue)
        }
      }
    }
    // 解决多图片上传时，第一次上传的多个的时候 只能有一个成功的bug
    if (this.modelValue instanceof Array && this.modelValue.length > 0) {
      this.uploadDynamicProps.fileList = this.fileList
    } else {
      if (this.modelValue) {
        this.uploadDynamicProps.fileList = this.fileList
      }
    }
  },
  methods: {
    handleRemove(url) {
      this.urls.splice(this.urls.indexOf(url), 1)
      this.fileList.forEach((it, i) => {
        if (it && it.response.data.url.indexOf(url) !== -1) {
          this.fileList.splice(i, 1)
        }
      })
      this.$delete('/system/file/delete', { url: encodeURI(url) })
      if (this.multiple) {
        if(this.join){
          this.$emit('update:modelValue', this.urls.join(','))
          this.$emit('change', this.urls.join(','))
        }else{
          this.$emit('update:modelValue', this.urls)
          this.$emit('change', this.urls)
        }
      } else {
        this.$emit('update:modelValue', '')
        this.$emit('change', '')
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log(res)
      this.fileList = fileList
      if (res.data) {
        this.urls.push(res.data.url)
        // console.log(this.urls)
        if (this.multiple) {
          if(this.join){
            this.$emit('update:modelValue', this.urls.join(','))
            this.$emit('change', this.urls.join(','))
          }else{
            this.$emit('update:modelValue', this.urls)
            this.$emit('change', this.urls)
          }
        } else {
          this.$emit('update:modelValue', res.data.url)
          this.$emit('change', res.data.url)
        }
        this.onDragEnd()
      } else {
        this.$message.open({ type: 'error', message: res.msg })
      }
      this.isUploading = false
    },
    onDragEnd() {
      var newUrls = []
      this.urls.forEach(url => {
        newUrls.push(encodeURI(url))
      })
      console.log('*********newUrls****:{}',newUrls);
      this.$get('/system/file/resort', { urls: newUrls.join(',') })
    },
    onExceed() {
      this.$message.open({
        type: 'warning',
        message: `图片超限，最多可上传${this.limit}张图片`
      })
    },
    beforeCropper(element) {
      console.log('*************url:::cropperOption:{}:::{}',element,this.cropperOption.img);
      const url = element;
      if((element instanceof Object) &&   element.response){
        console.log('************88执行了');
        url = element.response.data.url;
      }
      this.cropperOption.img = this.$global.baseApi + url
      this.cropperOption.relativeImg = url
      this.$refs.cropperDialog.show()
    },
    cropper(e) {
       console.log('*************cropper执行了:{}',e);
      this.$refs.cropper.getCropBlob((data) => {
        var dataFile = new File([data], this.cropperOption.relativeImg.substring(this.cropperOption.relativeImg.lastIndexOf('/') + 1), { type: data.type, lastModified: Date.now() })
        var formData = new FormData()
        formData.append('file', dataFile)
        formData.append('url', encodeURI(this.cropperOption.relativeImg))
        this.$request({
          url: '/system/file/cropper',
          method: 'post',
          data: formData
        }).then(res => {
          console.log('*******************this.urls::{}:::{}',this.urls);
          this.urls.forEach((it, i) => {
            console.log('*******************it::{}:::{}',it,i);
            if (this.cropperOption.img.indexOf(it) !== -1) {
              
              this.urls[i] = res.data.url
              this.$refs.cropperDialog.hide()
            }
          })
        })
      })
    },
    changeValue(obj){
      console.log('***********obj**:{}', obj);
      if(obj.file.status=='done'){
        if(this.join){
          console.log('*************:{}', this.urls);
          console.log('*************:{}',  this.urls.join(','));
           this.$emit('change', this.urls.filter(p=>p.status =='done').map(p=>p.response.data.url).join(',')) ;
           this.$emit('update:modelValue', this.urls.filter(p=>p.status =='done').map(p=>p.response.data.url).join(',')) ;
        }else{
           this.$emit('change', this.urls) ;
           this.$emit('update:modelValue', this.urls) ;
        }
      }else if(obj.file.status=='error'){

      }
    }
  }
}
</script>

<style scoped>
.vue-draggable :deep(.ant-upload) {
  width: 100%;
  height: 100%;
  display: block;
}


 .uploadBox :deep(.ant-upload){
    display: inline-block;
    width: 100px;
    height: 100px;
  }
</style>

<style lang="scss" scoped>
// 上传按钮
.uploadIcon {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt, .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;
  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .ant-image {
      width: 100%;
      height: 100%;
    }
    .tools {
      position: absolute;
      top:0px;
      width: 100%;
      height: 20px;
    }
    .shadow {
      display: inline-block;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      display: none;
    }
   
  }
}



// el-image
.ant-image-viewer__wrapper {
  .ant-image-viewer__mask {
    opacity: .8;
  }
  .ant-icon-circle-close {
    color: #fff;
  }
}
.cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
</style>
