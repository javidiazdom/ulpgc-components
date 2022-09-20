<template>
    <Miulpgc v-if="isMiulpgc"/>
    <Institucional v-else/>
</template>

<script>
import Institucional from './header/institucional.vue';
import Miulpgc from './header/miulpgc.vue';
export default {
    name: 'ulpgc-header',
    props: {
        type: {
            type: String,
            default: "institucional"
        },
        user: {
            type: String
        }
    },
    components: {
    Institucional,
    Miulpgc
},
    computed: {
        isMiulpgc() {
            return this.type === 'miulpgc';
        },
        isUserLogged() {
            return !!this.user;
        }
    }
};
</script>

<style>
    @charset "UTF-8";
    @import "https://cdn.ulpgc.es/ulpgcds/1.0/css/ulpgcds.css";

    @font-face {
        font-family: "ULPGC-icon";
        src: url(@/assets/ULPGC-icon.ttf);
    }
</style>