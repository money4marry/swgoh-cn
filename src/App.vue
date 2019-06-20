<template>
    <div id="app">
        <!--<el-input v-model="input" placeholder="请输入内容"></el-input>-->
        <el-button @click="login">登陆</el-button>
        <el-button @click="viewPlayer">获取用户信息</el-button>
        <el-button @click="getModJson">获取数据信息</el-button>

        <el-tabs v-model="activeTabName" @tab-click="handleClick">
            <el-tab-pane label="角色" name="CHARACTER">
                <el-table
                        :data="characterList"
                        border>
                    <el-table-column type="expand">
                        <template slot-scope="p">
                            <p v-for="(mod, index) in p.row.mods" :key="p.$index + 'mods' + index">
                                <span>{{modPosition[mod.slot]}}:</span>
                                <span>{{mod.pips}}星-{{mod.level}}级-主属性: {{mod.primaryStat.value}}{{modStat[mod.primaryStat.unitStat] || mod.primaryStat.unitStat}}--</span>
                                <span>副属性：</span>
                                <span v-for="(stat,index) in mod.secondaryStat" :key="p.$index+'secondaryStat'+index">{{stat.value}}{{modStat[stat.unitStat] || stat.unitStat}}({{stat.roll}})&nbsp;&nbsp;</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="nameKey"
                            label="名字"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="gp"
                            label="力量"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="gear"
                            label="装备">
                    </el-table-column>
                    <el-table-column
                            prop="rarity"
                            label="稀有度">
                    </el-table-column>
                    <el-table-column
                            prop="level"
                            sortable
                            label="等级">
                    </el-table-column>
                    <el-table-column
                            prop="gear"
                            label="装备">
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="舰队" name="SHIP">
                <el-table
                        :data="shipList"
                        border>
                    <el-table-column
                            prop="nameKey"
                            label="名字"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="gp"
                            label="力量">
                    </el-table-column>
                    <el-table-column
                            prop="rarity"
                            label="稀有度">
                    </el-table-column>
                    <el-table-column
                            prop="level"
                            label="等级">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
    import request from '@/utils/request';
    import LS from '@/utils/localStorage';
    import Cookies from 'js-cookie'

    export default {
        name: 'app',
        data() {
            return {
                api: null,
                allycode: '263953972',
                tableData: [],
                activeTabName: 'CHARACTER',
                characterList: [], // 角色列表
                shipList: [], // 舰队列表
                modPosition: ['占位', '方块', '箭头', '菱形', '三角', '圆形', '十字'],
                modStat: {
                    UNITSTATOFFENSEPERCENTADDITIVE: '% 进攻力',
                    UNITSTATSPEED: '速度',
                    UNITSTATDEFENSEPERCENTADDITIVE: '% 防御力',
                    UNITSTATMAXSHIELDPERCENTADDITIVE: '% 防护力',
                    UNITSTATEVASIONNEGATEPERCENTADDITIVE: '% 精准',
                    UNITSTATMAXHEALTHPERCENTADDITIVE: '% 生命值',
                    UNITSTATCRITICALCHANCEPERCENTADDITIVE: '% 暴击率',
                    UNITSTATRESISTANCE: '% 韧性',
                    UNITSTATCRITICALDAMAGE: '% 暴击伤害',
                    UNITSTATCRITICALNEGATECHANCEPERCENTADDITIVE: '% 暴击闪避',
                    UNITSTATACCURACY: '% 效能',

                    UNITSTATDEFENSE: '防御力',
                    UNITSTATOFFENSE: '进攻力',
                    UNITSTATMAXSHIELD: '保护',
                    UNITSTATMAXHEALTH: '生命值'
                }
            };
        },
        components: {},
        created() {

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
                });
            },
            viewPlayer() {
                const lastUpdated = LS.getLs('lastupdated', 0);
                if (lastUpdated) {
                    const oneHour = 60 * 60 * 1000;
                    if ((new Date() - new Date(+lastUpdated)) < oneHour) {
                        const player = LS.getObjectFromLs('player');
                        console.table(player.roster)
                        this.normalizeData(player.roster);
                        // this.tableData = player.roster;
                    } else {
                        this.getPlayers();
                    }
                } else {
                    this.getPlayers();
                }
            },
            getPlayers() {
                request({
                    url: '/swgoh/players',
                    method: 'POST',
                    data: {
                        allycodes: [this.allycode],
                        allycode: this.allycode,
                        language: 'CHS_CN',
                        enums: true
                    }
                }).then((res) => {
                    LS.setObjectToLs('player', res[0] || '');
                    LS.setLs('lastupdated', +new Date());
                    this.normalizeData(res[0].roster);
                });
            },
            getModJson() {
                request({
                    url: '/swgoh/data',
                    method: 'POST',
                    data: {
                        collection: 'statModSetList',
                        language: 'CHS_CN',
                        enums: true
                    }
                }).then((res) => {
                    console.log(res)
                });
            },
            handleClick() {},
            normalizeData(data) {
                this.characterList = data.filter(ele => ele.combatType === 'CHARACTER');
                this.shipList = data.filter(ele => ele.combatType === 'SHIP');
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
