<template>
    <footer>
        <div class="ulpgcds-footer">
            <div class="ulpgcds-footer__top wrapper">
                <div class="row">
                    <div class="col-6">
                        <div class="footer-logo"> </div>
                        <div class="row">
                            <div class="col-6">
                                <h3>Dirección</h3>
                                <p v-for="entry in direccion" v-bind:key="entry">
                                    {{entry}}
                                </p>
                                <a href="https://goo.gl/maps/Du1BZEUTcV7586sD8">Ver en Google Maps</a>
                            </div>
                            <div class="col-6">
                                <h3>Servicio de información al estudiante</h3>
                                <p v-for="(entry, index) in sie" v-bind:key="index">
                                    <strong> {{entry.label}}
                                        <span class="icon-whatsapp" v-if="entry.label === 'WhatsApp'" />
                                    </strong>
                                    <a v-if="entry.url" href="entry.url">{{entry.text}}</a>
                                    {{entry.url == null ? entry.text : ''}}
                                </p>
                            </div>
                        </div>
                        <div class="ulpgcds-footer__social">
                            <h3>Contacta con nosotros</h3>
                            <ul>
                                <li v-for="entry in social" v-bind:key="entry.name" class="entry.class">
                                    <a :href="entry.url" class="ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon"
                                        target="_blank">
                                        <i :class="socialIconsCss(entry.class)"><span>{{entry.label}}</span></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-4">
                                <h3>Contacto</h3>
                                <ul>
                                    <li v-for="item in contacto" v-bind:key="item.label">
                                        <a :href="item.url">{{item.label}}</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <h3>Servicios en línea</h3>
                                <ul>
                                    <li v-for="item in serviciosLinea" v-bind:key="item.label">
                                        <a :href="item.url">{{item.label}}</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-4">
                                <h3>Legal</h3>
                                <ul>
                                    <li v-for="item in legal" v-bind:key="item.label">
                                        <a :href="item.url">{{item.label}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ulpgcds-footer__medium">
                <div class="wrapper">
                    <ul>
                        <li v-for="item in colaboradores" v-bind:key="item.label" :class="item.class">
                            <a :href="item.url"><span>{{item.label}}</span></a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="ulpgcds-footer__bottom">
                <div class="wrapper">
                    <p>© Universidad de Las Palmas de Gran Canaria · ULPGC</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'FooterInstitucional',

    data() {
        return {
            direccion: ['Juan de Quesada, 30', '35001 Las Palmas de Gran Canaria', 'España'],
            sie: [{ label: 'web: ', text: 'sie.ulpgc.es', url: 'https://sie.ulpgc.es/' }, { label: 'correo: ', text: 'sie@ulpgc.es', url: 'mailto:sie@ulpgc.es' }, { label: 'tlf: ', text: '(+34) 928 451072/74' }, { label: 'WhatsApp', text: ' (+34) 660 599 038', url: 'https://web.whatsapp.com/send?phone=+34660599038' }],
            contacto: [{ label: 'Directorio telefónico', url: 'http://www2.ulpgc.es/index.php?pagina=presentacion&ver=contacto' }, { label: 'Quejas, sugerencias y felicitaciones', url: '/sori/sistema-quejas-sugerencias-y-felicitaciones' }],
            serviciosLinea: [{ label: 'Campus Virtual', url: '/campusvirtual' }, { label: 'Sede electrónica', url: 'https://administracion.ulpgc.es/' }, { label: 'Mi ULPGC', url: 'https://mi.ulpgc.es/' }, { label: 'Correo ULPGC', url: 'https://correo.ulpgc.es/' }, { label: 'Soporte Informático', url: 'http://www.si.ulpgc.es/contacto' }],
            legal: [{ label: 'Aviso legal', url: '/sobre-esta-web/aviso-legal' }, { label: 'Protección de datos', url: '/sobre-esta-web/tratamiento-datos-personales' }, { label: 'Cookies', url: 'https://www.ulpgc.es/sobre-esta-web/cookies' }, { label: 'Accesibilidad', url: '/sobre-esta-web/accesibilidad' }, { label: 'Sobre esta web', url: '/sobre-esta-web' }],
            social: [
                {
                    name: 'twitter',
                    url: 'https://twitter.com/ulpgc',
                    label: 'Twitter',
                    class: 'twitter'
                },
                {
                    name: 'flickr',
                    url: 'http://www.flickr.com/photos/ulpgc',
                    label: 'Flickr',
                    class: 'flickr'
                },
                {
                    name: 'facebook',
                    url: 'http://www.facebook.com/pages/Ulpgc-Para-Ti/160435343978326?sk=wall',
                    label: 'Facebook',
                    class: 'facebook'
                },
                {
                    name: 'youtube',
                    url: 'http://www.youtube.com/ulpgc',
                    label: 'Youtube',
                    class: 'youtube'
                },
                {
                    name: 'linkedin',
                    url: 'http://www.linkedin.com/groups?mostPopular=&gid=148332',
                    label: 'LinkedIn',
                    class: 'linkedin'
                },
                {
                    name: 'instagram',
                    url: 'https://www.instagram.com/ulpgc_para_ti',
                    label: 'Instagram',
                    class: 'instagram'
                }
            ],
            colaboradores: [{label: "Parque Científico Tecnológico Universidad de Las Palmas de Gran Canaria",url: "http://pct.ulpgc.es", class: "parque_cientifico"},{label: "Consejo Social Universidad de Las Palmas de Gran Canaria",url: "http://www.csocial.ulpgc.es", class: "consejo_social"},{label: "Universia",url: "https://universia.net", class: "universia"}, {label: "Crue",url: "https://www.crue.org", class: "mecenas"}]
        };
    },
    methods: {
        socialIconsCss(entryName) {
            return 'ulpgcds-btn__icon icon-' + entryName
        }
    }
};
</script>

<style scoped>
.ulpgcds-footer .footer-logo {
    background: transparent url("https://www.ulpgc.es/sites/default/files/ArchivosULPGC/identidad-corporativa/Logo%2025%20Aniversario/version_max_red_2t.png") no-repeat -32px -30px;
    background-size: 500px;
    width: 440px;
    height: 46px;
    margin-bottom: 40px;
}

.consejo_social {
    background: transparent url(https://www.ulpgc.es/sites/all/themes/ulpgc/images/logo_consejosocial.svg) no-repeat center;
}

.parque_cientifico {
    background: transparent url(https://www.ulpgc.es/sites/all/themes/ulpgc/images/parque_cientifico_logo.svg) no-repeat center;
}

.universia {
    background: transparent url(https://www.ulpgc.es/sites/all/themes/ulpgc/images/universia-negativo.svg) no-repeat center;
    transition: 0.2s ease-in-out;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.universia:hover {
    background: transparent url(https://www.ulpgc.es/sites/all/themes/ulpgc/images/universia.svg) no-repeat center;
}

.mecenas {
    background: transparent url(https://www.ulpgc.es/sites/all/themes/ulpgc/images/crue_main.png) no-repeat center;
    background-size: contain;
}



</style>