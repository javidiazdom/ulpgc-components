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
        src: url("../assets/fonts/ULPGC-icon.eot");
        src: url("../assets/fonts/ULPGC-icon.eot") format("embedded-opentype"), 
        url("../assets/fonts/ULPGC-icon.ttf") format("truetype"), 
        url("../assets/fonts/ULPGC-icon.woff") format("woff"), 
        url("../assets/fonts/ULPGC-icon.svg") format("svg");
        font-weight: normal;
        font-style: normal;
        font-display: block; 
    }
</style>