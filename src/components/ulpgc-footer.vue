<template>
  <Miulpgc v-if="isMiulpgc"/>
  <Institucional v-else/>
</template>

<script>

import Miulpgc from './footer/miulpgc.vue'
import Institucional from './footer/institucional.vue'

export default {
    name: 'ulpgc-footer',
    props: {
        type: {
            type: String,
            default: "institucional"
        }
    },
    components: { Institucional, Miulpgc },
    computed: {
        isMiulpgc() {
            return this.type === 'miulpgc';
        },
    }
}
</script>


<style>
    @import "https://cdn.ulpgc.es/ulpgcds/1.0/css/ulpgcds.css";
</style>