<template>
    <div v-show="visible" class="alert">
        <button v-show="closable" class="closed" @click="close">关闭</button>
        <br>
        <my-progress ref="MyProgress"></my-progress>
        <slot></slot>
    </div>
</template>

<script>
  import MyProgress from './MyProgress'

  export default {
    name: 'Alert',
    components: { MyProgress },
    props: {
      closable: {
        type: Boolean,
        default: true
      },
      show: {
        type: Boolean,
        default: false,
        twoWay: true
      },
      type: {
        type: String,
        default: 'info'
      }
    },
    data () {
      return {
        visible: this.show
      }
    },
    methods: {
      close () {
        this.visible = false
        this.$emit('update:show', false)
        this.$emit('close')
      }
    }
  }
</script>

<style lang="less" scoped>
    .closed {
        position: absolute;
        bottom: 50%;
        right: 50%;
        width: 50px;
        height: 30px;
        text-align: center;
        font-size: 18px;
        margin-bottom: 10px;
    }
    .alert{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        .dialog-container{
            width: 500px;
            height: 380px;
            background: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            position: relative;
            .dialog-title{
                width: 100%;
                background: #ddb66b;
                height: 60px;
                font-size: 18px;
                color: white;
                font-weight: 600;
                padding: 16px 50px 0 20px;
                box-sizing: border-box;
            }
            .content{
                color: #797979;
                line-height: 26px;
                padding: 0 20px;
                box-sizing: border-box;
            }
            .inp{
                margin: 10px 0 0 20px;
                width: 200px;
                height: 40px;
                padding-left: 4px;
                border-radius: 4px;
                border: none;
                background: #efefef;
                outline: none;
                &:focus{
                    border: 1px solid #509EE3;
                }
            }
            .btns{
                width: 100%;
                height: 60px;
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                & > div{
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 14px;
                    color: #ffffff;
                    background: #f1f1f1;
                    border-radius: 8px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .default-btn{
                    color: #787878;
                    &:hover{
                        color: #509EE3;
                    }
                }
                .danger-btn{
                    background: #EF8C8C;
                    &:hover{
                        background: rgb(224, 135, 135);
                    }
                    &:active{
                        background: #EF8C8C;
                    }
                }
                .confirm-btn{
                    color: #ffffff;
                    background: #509EE3;
                    &:hover{
                        background: #6FB0EB;
                    }
                }
            }
            .close-btn{
                position: absolute;
                top: 16px;
                right: 16px;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: white;
                font-size: 18px;
                cursor: pointer;
                &:hover{
                    font-weight: 600;
                }
            }
        }
    }
</style>
