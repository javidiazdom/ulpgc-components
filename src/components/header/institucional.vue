<template>
    <header class="ulpgcds-header">
        <div class="ulpgcds-header__top">
            <div class="ulpgcds-header__top__logo">
                <a href="https://www.ulpgc.es" target="_blank"><span>ULPGC - Universidad de Las Palmas de Gran Canaria</span></a>
                <a href="/"><span>Nombre unidad</span></a>
            </div>

            <div class="ulpgcds-header__top__links">
                <ul>
                    <li class="hidden-mobile" v-for="link in links" v-bind:key="link.url">
                        <a :href="link.url" class="ulpgcds-btn ulpgcds-btn--text">
                            <span :class="'ulpgcds-btn__icon ulpgcds-icon-' + link.iconClass"
                                aria-hidden="true"></span>{{link.label}}
                        </a>
                    </li>

                    <li>
                        <button class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary" id="btn-search">
                            <span class="ulpgcds-btn__icon ulpgcds-icon-search" aria-hidden="true"></span>
                            <span id="texto">Buscar</span>
                        </button>
                    </li>
                    <li>
                        <a href="/" class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--primary">
                            <span class="ulpgcds-btn__icon ulpgcds-icon-user" aria-hidden="true"></span> MiULPGC
                        </a>
                    </li>
                    <li>
                        <a class="nav-toggle hidden-desktop ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary" href="#">
                            <span class="ulpgcds-btn__icon ulpgcds-icon-menu" aria-hidden="true"></span> Menú
                        </a>
                    </li>
                </ul>

            </div>
        </div>
        <nav class="ulpgcds-header__bottom" id="main-menu">
            <ul class="ulpgcds-header__bottom__menu">
                <li v-for="item in menu" v-bind:key="item.url">
                    <a :href="item.url">{{item.title}}</a>
                    <ul>
                        <li v-for="subitem in item.items" v-bind:key="subitem.url">
                            <a :href="subitem.url">{{subitem.label}}</a>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
    </header>

</template>

<script>
export default {
    name: 'HeaderInstitucional',
    data() {
        return {
            menu: [
                {
                    title: 'la universidad',
                    url: 'https://www.ulpgc.es/presentaci%C3%B3n',
                    items: [{
                        label: 'Conócenos',
                        url: 'https://www.ulpgc.es/presentaci%C3%B3n'
                    },
                    {
                        label: 'Gobierno',
                        url: 'https://www.ulpgc.es/gobierno_inicial'
                    },
                    {
                        label: 'Centros y Departamentos',
                        url: 'https://www.ulpgc.es/centros_y_departamentos'
                    },
                    {
                        label: 'Administración',
                        url: 'https://www.ulpgc.es/administracion_inicial'
                    },
                    {
                        label: 'Directorio de personal',
                        url: 'http://www2.ulpgc.es/index.php?pagina=directorio&ver=inicio'
                    },
                    {
                        label: 'Normativa y BOULPGC',
                        url: 'https://www.ulpgc.es/normativa/inicio'
                    },
                    {
                        label: 'Comunicación',
                        url: 'https://www.ulpgc.es/actualidad'
                    }
                    ]
                }, {
                    title: 'estudios',
                    url: 'https://www.ulpgc.es/estudios',
                    items: [{
                        label: 'Grados',
                        url: 'https://www2.ulpgc.es/plan-estudio/inicio'
                    },
                    {
                        label: 'Máster',
                        url: 'https://www2.ulpgc.es/plan-estudio/master'
                    },
                    {
                        label: 'Doctorado',
                        url: 'https://www.ulpgc.es/doctorado'
                    },
                    {
                        label: 'Idiomas',
                        url: 'https://www.ulpgc.es/idiomas'
                    },
                    {
                        label: 'Formación Permanente',
                        url: 'https://www.ulpgc.es/otros_estudios_cursos'
                    },
                    {
                        label: 'Becas y alojamiento',
                        url: 'https://www.ulpgc.es/becas_y_alojamiento'
                    },
                    {
                        label: 'Información académica',
                        url: 'https://www.ulpgc.es/informacion_academica'
                    }
                    ]
                }, {
                    title: 'internacional',
                    url: 'https://internacional.ulpgc.es/',
                    items: [{
                        label: 'Estrategia',
                        url: 'https://internacional.ulpgc.es/estrategia/'
                    },
                    {
                        label: 'Movilidad',
                        url: 'https://internacional.ulpgc.es/presentacion-movilidad/'
                    },
                    {
                        label: 'Idiomas',
                        url: 'https://internacional.ulpgc.es/presentacion-idiomas/'
                    },
                    {
                        label: 'Cooperación',
                        url: 'https://internacional.ulpgc.es/cooperacion/'
                    },
                    {
                        label: 'Educación para el desarrollo',
                        url: 'https://internacional.ulpgc.es/educa-desarrollo/'
                    },
                    {
                        label: 'Relaciones con la UE',
                        url: 'https://dirue.ulpgc.es/'
                    },
                    ]
                }, {
                    title: 'investigación',
                    url: 'https://www.ulpgc.es/investigacion',
                    items: [{
                        label: 'Subvenciones directas',
                        url: 'https://www.ulpgc.es/vinvestigacion/subvencionesdirectas'
                    },
                    {
                        label: 'Grupos e Institutos',
                        url: 'https://www.ulpgc.es/estructuras_investigacion'
                    },
                    {
                        label: 'Convocatorias I+D+i',
                        url: 'https://www.ulpgc.es/programas_investigacion'
                    },
                    {
                        label: 'Portal ULPGC Research',
                        url: 'http://www.research.ulpgc.es/'
                    },
                    {
                        label: 'Portal ULPGC accedaCRIS',
                        url: 'https://accedacris.ulpgc.es/'
                    },
                    {
                        label: 'HR Excellence in Research',
                        url: 'https://www.ulpgc.es/vinvestigacion/HRS4R'
                    }
                    ]
                }, {
                    title: 'servicios',
                    url: 'https://www.ulpgc.es/servicios',
                    items:
                        [{
                            label: 'Biblioteca',
                            url: 'http://biblioteca.ulpgc.es/'
                        },
                        {
                            label: 'Publicaciones',
                            url: 'http://spdc.ulpgc.es/'
                        },
                        {
                            label: 'Cultura Universitaria',
                            url: 'https://www.ulpgc.es/vcultura/informacion_interes'
                        },
                        {
                            label: 'ULPGC en línea',
                            url: 'https://www.ulpgc.es/administrator/e-learning'
                        },
                        {
                            label: 'Servicio de Informática',
                            url: 'http://www.si.ulpgc.es/'
                        },
                        {
                            label: 'Contratación pública',
                            url: 'https://www.ulpgc.es/spatrimonioycontratacion/contratacion-publica'
                        },
                        {
                            label: 'Otros servicios',
                            url: 'https://www.ulpgc.es/otros_servicios/inicio'
                        }]
                }
            ],
            links: [
                {
                    label: 'Correo',
                    iconClass: 'envelope',
                    url: 'https://correo.ulpgc.es/'
                },
                {
                    label: 'Sede electrónica',
                    iconClass: 'campus',
                    url: 'https://administracion.ulpgc.es/'
                },
                {
                    label: 'Transparencia',
                    iconClass: 'campus',
                    url: 'https://www.ulpgc.es/transparencia'
                }
            ]
        };
    },
};
</script>

<style>
.ulpgcds-header__top__logo {
    background: transparent url("https://www.ulpgc.es/sites/all/themes/ulpgc/images/ULPGC-logo-ucrania-escritorio.svg") no-repeat 0 center;
    height: 76px;
    background-size: 306px;
    width: 306px
}
</style>