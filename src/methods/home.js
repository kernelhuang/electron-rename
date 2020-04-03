// import os from 'os'
// import system from 'electron'
import {ipcRenderer} from 'electron'
import path from 'path'
import fs from 'fs'
// import MyProgress from "../renderer/components/MyProgress";

/*
const readFiles = function (filepath) {
  var _path = path.join(filepath)
  console.log(_path)
  if(fs.existsSync(filepath)) {
  fs.readFile(_path, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    console.log(data)
  })
  }
}
 */

const readDir = function (that, dirPath) {
  var directoryPath = path.join('', dirPath)

  return fs.readdir(directoryPath, function (err, files) {
    // handling error
    if (err) {
      return console.log('Unable to read directory: ' + err)
    }

    // listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      // console.log(file)
    })

    if (that.selectType === 'dir') {
      that.sourceDir = '源文件目录： ' + that.sourceDir
      that.fileList = filterFiles(that, files)
    }

    return files
  })
}

const toReset = function () {
  this.outPath = ''
  this.sourceDir = ''
  this.fileList = []
  showProgress(this, false)
}

const clickConfirm = function () {
  if (this.firstInput === '' || this.lastInput === '') {
    return showMessage(this, '')
  }

  if ((this.sourceDir === '') || isEmptyArray(this.fileList.length)) {
    return showMessage(this, '请选择源文件或文件夹')
  }

  if (fs.existsSync(this.outPath)) {
    this.newDir = this.outPath + '\\' + this.lastInput
    makeDir(this, this.newDir)
    var firstSuffix = ''
    var lastSuffix = ''
    var beforeChangeFiles = []
    var afterChangeFiles = []

    for (var key in this.fileList) {
      var suffix = this.fileList[key].substring(this.fileList[key].lastIndexOf('.'), this.fileList[key].length).toLowerCase()

      if (suffix === ('.' + this.firstInput)) {
        var newFilePath = this.outPath + '\\' + this.fileList[key]
        beforeChangeFiles.push(newFilePath)
        if (this.fileList[key].indexOf(' ') === -1) {
          firstSuffix = '.' + this.firstInput
          lastSuffix = this.fileList[key].replace(new RegExp(firstSuffix, 'g'), '.' + this.lastInput)
          afterChangeFiles.push(this.newDir + '\\' + lastSuffix)
        } else {
          firstSuffix = '.' + this.firstInput
          var result = this.fileList[key].replace(/ /g, '_')
          lastSuffix = result.replace(new RegExp(firstSuffix, 'g'), '.' + this.lastInput)
          afterChangeFiles.push(this.newDir + '\\' + lastSuffix)
        }
      }
    }

    if (isEmptyArray(beforeChangeFiles)) {
      return showMessage(this, '此文件夹不存在后缀名为：' + this.firstInput + ' 的文件，请重新选择源文件或文件夹')
    }

    this.$refs.Alert.visible = true
    this.$refs.Alert.$refs.MyProgress.progress = 0
    this.$refs.Confirm.closeMask()

    try {
      var fileMaxNumber = beforeChangeFiles.length
      for (var i = 0; i < fileMaxNumber; i++) {
        var sourceFile = beforeChangeFiles[i]
        var destFile = afterChangeFiles[i]
        if (fileMaxNumber === 1) {
          changeCallback(this, sourceFile, destFile, 100, res => {
            console.log(res)
          })
        } else {
          // var ratio = parseInt((i / fileMaxNumber) * 100)
          var ratio = toInt((i / fileMaxNumber) * 100)
          changeCallback(this, sourceFile, destFile, ratio, res => {
            console.log(res)
            // this.$refs.Alert.$refs.MyProgress.progress = ratio
          })
        }
      }
      // showMessage(this, '文件已经修改完毕.')
    } catch (err) {
      // showProgress(this, false)
      showMessage(this, '文件修改失败：', err)
    }
  }

  return false
}

const filterFiles = function (that, files) {
  var beforeChangeFiles = []

  for (var key in files) {
    var suffix = files[key].substring(files[key].lastIndexOf('.'), files[key].length).toLowerCase()

    if (suffix === ('.' + that.firstInput)) {
      beforeChangeFiles.push(files[key])
    }
  }

  return beforeChangeFiles
}

const selectFile = function () {
  this.selectType = 'file'
  this.selectName = '文件'

  ipcRenderer.send('open-directory-dialog', 'openFile')
  ipcRenderer.once('selectedItem', this.getPath)
}

const selectDir = function () {
  this.selectType = 'dir'
  this.selectName = '文件夹'

  ipcRenderer.send('open-directory-dialog', 'openDirectory')
  ipcRenderer.once('selectedItem', this.getPath)
}

const isEmptyArray = function (arr) {
  return Array.prototype.isPrototypeOf(arr) && (arr.length === 0)
}

const getPath = function (e, path) {
  if (this.firstInput === '' || this.lastInput === '') {
    return showMessage(this, '')
  }

  this.firstMessage = false
  this.lastMessage = false

  if (path === null) {
    return showMessage(this, '请选择一个' + this.selectName)
  }

  switch (this.selectType) {
    case 'dir':
      // showProgress(this, true)
      // this.outPath = path
      this.$data.sourceDir = ''
      this.$data.fileList = []
      this.filepath = path
      getDirName(this, this.selectType, this.filepath)
      // showProgress(this, true)
      readDir(this, this.sourceDir)
      break

    case 'file':
      // showProgress(this, false)
      this.$data.sourceDir = ''
      this.$data.fileList = []
      this.filepath = path
      if (this.filepath) {
        // this.fileList = this.filepath
        getDirName(this, this.selectType, this.filepath)
        // readFiles(this.filepath)
      }
      break

    default:
      showMessage(this, '必须是文件或者文件夹类型')
      break
  }
}

const showMessage = function (that, msg) {
  if (msg !== '') {
    return alert(msg)
  }

  if (that.firstInput === '') {
    that.lastMessage = false
    that.firstMessage = '修改前的文件类型必填'
    return false
  }

  if (that.lastInput === '') {
    that.firstMessage = false
    that.lastMessage = '修改后的文件类型必填'
    return false
  }

  // showProgress(this, false)
  return false
}

const getDirName = function (that, selectType, name) {
  // var sourceObject = {}

  if (selectType === 'file') {
    var nameArray = name.split('\\')
    // var sourcePath = '原文件目录： ' + name
    var sourcePath = nameArray.pop()
    that.outPath = nameArray.join('\\')
    that.sourceDir = '源文件目录： ' + that.outPath
    that.fileList.push(sourcePath)
    // sourceObject = {'dir': sourceDir, 'file': sourcePath}
  }

  if (selectType === 'dir') {
    that.sourceDir = name
    that.outPath = name
    // that.fileList = res
    // console.log(res)
    // sourceObject = {'dir': name, 'file': res}
  }

  // return sourceObject
}

const makeDir = function (that, dirname) {
  /*
  if (that.firstInput === '' || that.lastInput === '') {
    return showMessage(that, '')
  }

  if ((that.sourceDir === '') || (Array.prototype.isPrototypeOf(that.fileList) && that.fileList.length === 0)) {
    return showMessage(that, '请选择源文件或文件夹')
  }
  */

  if (!fs.existsSync(dirname)) {
    return fs.mkdirSync(dirname)
  }

  return true
}

const showProgress = function (that, show) {
  // that.$refs.MyProgress.show = show
  that.$refs.Confirm.showProgress = show
  return show
}

const openMask = function () {
  this.sendVal = true
}

const clickCancel = function () {
}

const clickDanger = function () {
}

const changeCallback = function (that, sourceFile, destFile, progress) {
  return fs.copyFile(sourceFile, destFile, function (err) {
    // handling error
    if (err) {
      // return console.log('Unable to read directory: ' + err)
      return showMessage(this, '文件修改失败.')
    }
    if (progress > (100 - 40)) {
      that.$refs.Alert.$refs.MyProgress.progress = 100
    } else {
      that.$refs.Alert.$refs.MyProgress.progress = progress
    }
    return true
  })
  // showMessage(this, '文件已经修改完毕.')
}

const toInt = function (val) {
  return val > 0 ? Math.floor(val) : Math.ceil(val)
}

/*
const clickConfirm = function () {
  console.log('点击了confirm')
}
 */

/*
const selectFiles = function () {
  const fileManagerBtn = document.getElementById('open-file-directory')

  fileManagerBtn.addEventListener('click', function (event) {
    system.shell.showItemInFolder(os.homedir())
  })
}
 */

/*
const selectFiles = function () {
  var vm = this
  var ipc = ipcRenderer

  return Object.assign({},
    this.$listeners,
    {
      click: function (event) {
        if (vm.dir !== 'file') {
          ipc.send('open-file-directory', 'openDirectory')
        } else {
          ipc.send('open-file-directory', 'openFile')
        }
        ipc.once('selectedItem', function (event, path) {
          console.log(path)
        })
      }
    }
  )
}
 */

export {
  selectFile,
  selectDir,
  getPath,
  getDirName,
  readDir,
  makeDir,
  toReset,
  isEmptyArray,
  filterFiles,
  showProgress,
  openMask,
  clickCancel,
  clickConfirm,
  clickDanger,
  changeCallback,
  toInt
  // toChange,
  // readFiles
}
