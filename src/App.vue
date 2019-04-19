<template>
    <div id="app">
        <!--<el-input v-model="input" placeholder="请输入内容"></el-input>-->
    </div>
</template>

<script>
    import request from '@/utils/request';
    import Cookies from 'js-cookie'
    // import Api from './utils/api-swgoh-help';
    // import example from './utils/example.js';

    export default {
        name: 'app',
        data() {
            return {
                api: null,
                allycode: '263953972'
            };
        },
        components: {},
        created() {
            // example();
            // this.login();
            this.getPlayers();
            // const api = new Api({
            //     username: 'frankwy',
            //     password: 'hello520wanan'
            // })
            // api.connect().then((res) => {
            //     console.log(res)
            // });
        },
        methods: {
            login() {
                const params = {
                    username: 'frankwy',
                    password: 'hello520wanan',
                    grant_type: 'password',
                    client_id: '123',
                    client_secret: 'abc'
                };
                const data = `username=${params.username}&password=${params.password}&grant_type=${params.grant_type}&client_id=${params.client_id}&client_secret=${params.client_secret}`;
                request({
                    url: '/auth/signin',
                    method: 'post',
                    data
                }).then((res) => {
                    // Cookies.set('token_type', res.token_type);
                    Cookies.set('access_token', res.access_token);
                    console.log('登陆成功');
                });
            },
            getPlayers() {
                request({
                    url: '/swgoh/players',
                    method: 'POST',
                    data: {
                        allycodes: [this.allycode],
                        allycode: this.allycode
                    }
                }).then((res) => {
                    console.log(res)
                });
            }
        }
    };
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
