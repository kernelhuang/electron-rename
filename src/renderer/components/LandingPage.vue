<template xmlns="http://www.w3.org/1999/html">
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="YIJIA">
    <br><br>
    <br><br>
    <main>
      <div class="left-side">
        <span class="title">文件列表</span>
          <p id="dir" v-model="sourceDir">{{ sourceDir }}</p><br><br>
            <li v-for="key in fileList" :key="key" v-model="fileList">{{ key }}</li>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title"><p>批量修改文件名</p></div>
          <p>
            操作步骤：<br><br>
            1. 首先输入文件或文件夹中所要修改的文件后缀名如： pptx<br><br>
            2. 输入修改后的文件后缀名如： ppt<br><br>
            3. 选择要修改的文件或者文件夹<br><br>
            4. 最后点击提交<br><br>
            提示：文件名中的空格将自动被替换成下划线( _ )，在程序修改完毕后当前目录下会新建新文件的目录，
                  打开此目录即有已经修改后的新文件，原文件不会被覆盖或删除。
          </p>
          <div class="doc">
            <label>
              <input v-model="firstInput" placeholder="输入修改前的文件类型">
              <span style="color: red">*</span>
              <span style="color: red" v-show="firstMessage" v-model="firstMessage">
                {{ firstMessage }}
              </span><br><br>
            </label>
            <label>
              <input v-model="lastInput" placeholder="输入修改后的文件类型">
              <span style="color: red">*</span>
              <span style="color: red" v-show="lastMessage" v-model="lastMessage">
                {{ lastMessage }}
              </span><br><br><br><br>
            </label>
          </div>
          <button id="open-file" class="file" @click="selectFile">选择文件</button>
          <button id="open-file-directory" @click="selectDir">选择文件夹</button><br><br><br><br>
        </div>
        <div class="doc">
          <button class="alt" @click="openMask">提交</button>
          <button class="reset" @click="toReset">重置</button>
        </div>
      </div>
    </main>
    <div class="dialog">
      <confirm
              v-model="sendVal"
              type="confirm"
              title="温馨提示"
              content="是否确认修改所有文件？"
              v-on:cancel="clickCancel()"
              @confirm="clickConfirm()"
              ref="Confirm"
      >
      </confirm>
    </div>
    <alert ref="Alert"></alert>
  </div>
</template>

<script>
  import {selectFile, selectDir, getPath, toReset, openMask, clickDanger, clickConfirm, clickCancel} from '../../methods/home'
  import Confirm from './Confirm'
  import Alert from './Alert'

  export default {
    name: 'landing-page',
    components: { Alert, Confirm },
    data () {
      return {
        sendVal: false,
        firstMessage: false,
        lastMessage: false,
        firstInput: '',
        lastInput: '',
        outPath: '',
        newPath: '',
        filepath: '',
        fileList: [],
        selectName: '',
        selectType: '',
        sourceDir: '',
        callback: ''
      }
    },
    methods: {
      selectFile,
      selectDir,
      getPath,
      toReset,
      openMask,
      clickCancel,
      clickDanger,
      clickConfirm
    }
  }
</script>

<style>
  @import url('https://fonts.geekzu.org/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 26px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 40px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
    margin-right: 40px;
  }

  .doc button.alt {
    color: white;
    background-color: cornflowerblue;
  }

  .doc button.file {
    color: #ddb66b;
    background-color: transparent;
  }

  .doc button.reset {
    color: #dbdbdb;
    background-color: gray;
  }
</style>
