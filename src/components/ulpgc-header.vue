<template>
    <component :is="component">
        <template v-for="(index,name) in $slots" v-slot:[name]>
            <slot :name="name"></slot>
        </template>
    </component>
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
        }
    },
    components: {
    Institucional,
    Miulpgc,
    },
    data() {
        return {
            component: this.type === 'miulpgc' ? Miulpgc : Institucional
        }
    },
    computed: {
        isUserLogged() {
            return !!this.user;
        }
    }
};
</script>

<style>
</style>