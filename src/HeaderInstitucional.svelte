<svelte:options tag="ulpgc-header-institucional" />

<script>
export let user = undefined; 
export let useri = undefined;

    function hasUserInfo() {
        return !!this.$$slots.userInfo;
    }
</script>

<div id="cabecera">
    <div class="contenido_cabecera">
        <h1 id="logo">
            <a href="/" title="Inicio"
                ><span>ULPGC - Universidad de Las Palmas de Gran Canaria</span
                ></a
            >
        </h1>

        <div id="bloque_dch_cabecera">
            <div id="fila_buscador">
                <div
                    id="block-search-form"
                    class="block block-search"
                    style="display: none;"
                >
                    <form
                        id="search-block-form"
                        class="gss"
                        action="https://www2.ulpgc.es/index.php"
                        accept-charset="UTF-8"
                    >
                        <input type="hidden" name="pagina" value="busqueda" />
                        <input type="hidden" name="ver" value="google" />
                        <input
                            type="hidden"
                            name="cx"
                            value="007197090300231128638%3Aetbigalvvwm"
                        />
                        <input type="hidden" name="ie" value="UTF-8" />
                        <div>
                            <div class="container-inline">
                                <h2 class="element-invisible">
                                    Formulario de búsqueda
                                </h2>
                                <div
                                    class="form-item form-type-textfield form-item-search-block-form"
                                >
                                    <label
                                        class="element-invisible"
                                        for="edit-search-block-form--2"
                                        >Buscar en la ULPGC
                                    </label>
                                    <input
                                        title="Escriba lo que quiere buscar."
                                        placeholder="encuentra lo que necesitas / search in ULPGC site"
                                        type="text"
                                        id="edit-search-block-form--2"
                                        name="q"
                                    />
                                    <span
                                        class="ui-helper-hidden-accessible"
                                        role="status"
                                        aria-live="polite"
                                    />
                                </div>
                                <div
                                    id="edit-actions--2"
                                    class="form-actions form-wrapper"
                                >
                                    <input
                                        id="edit-submit--2"
                                        type="submit"
                                        name="op"
                                        value="Buscar"
                                        class="form-submit"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <!--  Mostramos bloque de Idiomas en cabecera-->
                <div />
            </div>
            <div class="fila_enlaces" id="enlaces_ulpgc">
                <ul class="enlaces_cabecera">
                    <li class="hidden-mobile">
                        <a
                            href="https://correo.ulpgc.es/"
                            class="ulpgcds-btn ulpgcds-btn--text"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-envelope"
                                aria-hidden="true"
                            />Correo</a
                        >
                    </li>
                    <li class="hidden-mobile">
                        <a
                            href="https://administracion.ulpgc.es"
                            class="ulpgcds-btn ulpgcds-btn--text"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-campus"
                                aria-hidden="true"
                            />Sede electrónica</a
                        >
                    </li>
                    <li class="hidden-mobile">
                        <a
                            href="https://www.ulpgc.es/transparencia"
                            class="ulpgcds-btn ulpgcds-btn--text"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-campus"
                                aria-hidden="true"
                            />Transparencia</a
                        >
                    </li>
                    <li>
                        <button
                            class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary"
                            id="btn-search"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-search"
                                aria-hidden="true"
                            /><span id="texto">Buscar</span></button
                        >
                    </li>


                    {#if !!user }
                    <li class="info_usuario"><div class="ulpgcds-avatar ulpgcds-avatar--small "><div class="ulpgcds-avatar__letter ulpgcds-avatar__letter--blue data-hj-suppress">J</div></div><div class="ulpgcds-avatar__fullname data-hj-suppress" title={user + " " + useri}>{user}</div>
                        <ul class="submenu" style="display: none;">
                            <li><a class="ulpgcds-btn ulpgcds-btn--text" href="https://www2.ulpgc.es/index.php?pagina=miulpgc&amp;ver=miulpgc&amp;login=mlpgc"><span class="ulpgcds-btn__icon ulpgcds-icon-miulpgc"></span>MiULPGC</a></li>
                            <li><a class="ulpgcds-btn ulpgcds-btn--text" href="https://www2.ulpgc.es/index.php?pagina=miulpgc&amp;ver=misdatospersonales&amp;login=mlpgc"><span class="ulpgcds-btn__icon ulpgcds-icon-user"></span>Mis datos personales</a></li>
                            <li><a class="ulpgcds-btn ulpgcds-btn--text" href="/caslogout?destination=/"><span class="ulpgcds-btn__icon ulpgcds-icon-power" aria-hidden="true"></span>Cerrar sesión</a></li>
                        </ul>
                    </li>
                    {:else}
                    <li>
                        <a
                            href="https://www2.ulpgc.es/index.php?pagina=miulpgc&amp;ver=miulpgc&amp;login=mlpgc"
                            class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--primary"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-user"
                                aria-hidden="true"
                            />MiULPGC</a
                        >
                    </li>
                    {/if}
                    <li>
                        <a
                            class="nav-toggle hidden-desktop ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary"
                            href="#"
                            ><span
                                class="ulpgcds-btn__icon ulpgcds-icon-menu"
                                aria-hidden="true"
                            />Menú</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import url("https://www.ulpgc.es/modules/search/search.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/ulpgcds/js/slick/slick.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/ulpgcdsmerge.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/style.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/custom.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/print.css?rg1gmx")
    print;
    @import url("https://cdn.ulpgc.es/ulpgcds/1.0/css/scss/ulpgcds.scss");
    @import url("https://cdn.ulpgc.es/ulpgcds/1.0/css/scss/base/_typography.scss");
    @import "_mixins.scss";
    @import "_variables.scss";
    @import"_header-custom.scss";

    #cabecera {
        background: $color-white;
        z-index: 999;
        height: 7.75rem;
        position: relative;
        //@include mq('l-screen',max){
        @include mq-device {
            height: 50px;
            border-bottom: 2px solid $color-blue;
        }
        .fondo_transparente {
            background: none;
        }
        .contenido_cabecera {
            max-width: $grid-max-width;
            width: $width-wrapper;
            height: 7.75rem;
            z-index: 999;
            padding-right: 0;
            margin: 0 auto;
            @include mq("m-screen", min) {
                padding-left: $grid-gutter/2;
                padding-right: $grid-gutter/2;
            }
            //@include mq('l-screen',max){
            @include mq-device {
                height: 50px;
                width: 100%;
                padding-top: 0;
                padding-left: 12px; // ajuste para movil
                padding-right: 0;
            }
            #logo {
                background: transparent url("img/ULPGC-logo-ucrania-escritorio.svg") no-repeat -10px -10px;
                background-size: 306px;
                width: 274px;
                margin: 24px 0 0 0;
                a {
                    background: none;
                    height: 76px;
                    margin: 0;
                    //@include mq('l-screen',max){
                    @include mq-device {
                        @include background(
                            "ULPGC_ACRO_HOR_01.svg",
                            -16px -16px
                        );
                        background-size: 140px;
                        width: 125px;
                        margin-top: 0px;
                        height: 24px;
                    }
                }
                //@include mq('l-screen',max){
                @include mq-device {
                    background: none;
                    margin-top: 0;
                    padding-top: $spacing-s;
                    height: auto;
                    width: 125px;
                }
            }
            h1 {
                border: 0;
                &:after {
                    content: none;
                }
            }
            #bloque_dch_cabecera {
                float: right;
                padding-top: 0;
                align-self: center;
                text-align: right;
                width: auto;
                position: relative;
                padding-top: $spacing-m;
                //@include mq('l-screen'){
                @include mq-device {
                    padding-top: 0;
                }
                ul {
                    &.enlaces_cabecera {
                        li {
                            display: inline-block;
                            float: none;
                            height: inherit;
                            padding: 0;
                            margin: 0;
                            text-align: right;
                            .ulpgcds-btn--text {
                                padding: $spacing-xs 0;
                                .ulpgcds-btn__icon:before {
                                    color: $color-orange;
                                }
                            }
                            a,
                            button {
                                height: inherit;
                                font-size: 1.06rem;
                                min-width: auto;

                                margin: 0;
                                margin-right: 16px;
                                text-decoration: none;
                                cursor: pointer;
                               
                                @include mq("xl-screen") {
                                    //margin-right:$layout-xs;
                                }
                                span {
                                    margin-right: 5px;
                                }
                                &.ulpgcds-btn--primary {
                                    color: $color-white;
                                    margin-right: 0;
                                    &:before {
                                        color: $color-white;
                                    }
                                    &:hover {
                                        color: $color-white;
                                        &:before {
                                            color: $color-white;
                                        }
                                    }
                                }
                                &.ulpgcds-btn--secondary {
                                    color: $color-blue;
                                    &:before {
                                        color: $color-blue;
                                    }
                                    &:hover {
                                        color: $color-orange;
                                        &:before {
                                            color: $color-blue;
                                        }
                                    }
                                }
                                &.hidden-desktop {
                                    display: none;
                                }
                                &.ulpgcds-btn--text {
                                    &:hover {
                                        color: $color-orange;
                                    }
                                }
                            }
                            @include mq-device {
                                &.hidden-mobile {
                                    display: none;
                                }
                                height: 48px;
                                width: 48px;
                                a {
                                    @include flexContainer;
                                    @include justify-content(center);
                                    align-items: center;
                                }
                            }
                        }
                    }
                }
                .fila_enlaces {
                    clear: both;
                    margin-top: 3%;
                    .info_usuario {
                        display: block;
                        float: right;
                        position: relative;
                        height: 44px;
                        cursor: pointer;
                        &:before{
                            content: $icon-caret-down;
                            font-family: "Ulpgc-icon";
                            top: 8px;
                            right: -4px;
                            color: #0066a1;
                            position: absolute;
                        }
                        .ulpgcds-avatar {
                            margin-top: 4px;
                        }
                        .ulpgcds-avatar__fullname {
                            max-width: 180px;
                            min-width: 150px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: block;
                            float: right;
                            line-height: 2.5rem;
                            text-align: left;
                            padding-right: $spacing-xs;
                            //@include mq('l-screen',max){
                            @include mq-device {
                                display: none;
                            }
                        }
                        /**
                            * ! Averiguar qué pasa aquí.
                            &:before{
                                @extend .ulpgcds-icon;
                                content:$icon-caret-down;
                                top:12px;
                                right:-4px;
                                color:$color-blue;
                                position:absolute;
                            }
                            &:hover{
                                &:before{
                                    content:$icon-caret-up;
                                }
                            }*/
                        //@include mq('l-screen',max){
                        @include mq-device {
                            display: inline-block;
                            float: none;
                            height: 48px;
                            margin-top: 0;
                            top: -1px;
                            &:before {
                                display: none;
                            }
                        }
                    }
                    .submenu {
                        display: none;
                        position: absolute;
                        z-index: 999;
                        width: 260px;
                        top: 44px;
                        left: auto;
                        right: 0;
                        border-top: 4px solid $color-orange;
                        box-shadow: 0 1px 2px 0 $color-gray-dark;
                        @include transition(0.5s ease-in-out);
                        @include border-radius($radius);

                        li {
                            font-family: $font-1;
                            font-weight: $medium;
                            font-size: $font-size-s;
                            line-height: $line-height-m;
                            color: $color-gray;
                            margin: 0;
                            list-style-type: none;
                            width: 100%;
                            text-align: left;
                            display: block;
                            white-space: initial;

                            a {
                                padding: $spacing-s $spacing-m $spacing-s
                                    $spacing-m;
                                background: $color-gray-5;
                                line-height: $line-height-m;
                                font-weight: $medium;
                                font-family: $font-1;
                                font-size: auto;
                                color: $color-blue;
                                display: block;
                                margin-right: 0;
                                @include border-radius(0);
                                &:hover {
                                    background: $color-orange-10;
                                    color: $color-blue;
                                }
                            }
                            &:last-child {
                                a {
                                    @include border-radii(
                                        0,
                                        0,
                                        $radius,
                                        $radius
                                    );
                                }
                            }
                        }
                    }
                    //@include mq('l-screen',max){
                    @include mq-device {
                        display: block;
                        #btn-search {
                            line-height: initial; //bug button
                            width: 48px;
                        }
                        .ulpgcds-btn--text {
                            display: none;
                        }
                        &:before {
                            color: $color-blue;
                            &:hover {
                                color: $color-orange;
                            }
                        }
                        .ulpgcds-btn--primary,
                        .ulpgcds-btn--secondary {
                            padding: $spacing-xxs $spacing-xs;
                            margin: 0;
                            background: none;
                            font-size: 0;
                            border: 0;
                            @include border-radius(0);
                            &.hidden-desktop {
                                @include flexContainer;
                            }
                            .ulpgcds-btn__icon {
                                margin-right: 0;
                                font-size: $font-size-l;
                                width: 24px;
                                height: 24px;
                                &:before {
                                    color: $color-blue;
                                }
                            }
                            &.open {
                                background: $color-blue;
                                border: 0;
                                .ulpgcds-btn__icon {
                                    &:before {
                                        color: $color-white;
                                    }
                                }
                                .nav-toggle {
                                    &:before {
                                        content: $icon-close;
                                    }
                                }
                            }
                        }
                        .submenu {
                            @include transition(none);
                            border: 0;
                            box-shadow: none;
                            width: 320px;
                            background: $color-blue;
                            @include border-radius(0);
                            li {
                                a {
                                    background: none;
                                    color: $color-white;
                                    :hover {
                                        color: $color-orange;
                                    }
                                }
                            }
                        }
                        .info_usuario {
                            &.open {
                                background: $color-blue;
                                :before {
                                    color: $color-white;
                                }
                                .ulpgcds-avatar__letter {
                                    background: $color-white;
                                    color: $color-blue;
                                }
                                .submenu {
                                    width: 320px;
                                    display: block;
                                    top: $header-height-mobile;
                                    right: 0;
                                    left: auto;
                                    position: fixed;
                                    height: 100%;
                                    @include mq("s-screen", max) {
                                        width: 100%;
                                    }
                                }
                            }
                        }
                    }
                }
                #fila_buscador {
                    clear: both;
                    padding: 0;
                    .block-search {
                        display: none;
                        &.open {
                            display: block;
                            position: fixed;
                            top: 124px;
                            height: 100%;
                            background: $color-blue;
                            width: 100%;
                            left: 0;
                            padding-top: 80px;
                            z-index: 999;
                            label {
                                display: block;
                                height: auto;
                                clip: initial;
                                position: relative;
                            }
                        }
                    }

                    li {
                        list-style-type: none;
                        display: inline-block;
                    }
                    //@include mq('l-screen',max){
                    @include mq-device {
                        margin-top: 0;

                        .block-search {
                            &.open {
                                top: 50px;
                            }
                        }
                        .idiomas {
                            display: none;
                            text-align: center;
                            li {
                                display: inline-block;
                                a {
                                    color: $color-white;
                                }
                            }
                        }
                    }
                }
                .idiomas {
                    margin-left: 0;
                    padding-right: $spacing-xxs;
                    line-height: $line-height-s;
                    padding-bottom: $spacing-m;
                    li {
                        padding-right: 10px;
                        line-height: $line-height-s;
                        a {
                            color: $color-blue;
                            text-transform: uppercase;
                            font-size: $font-small;
                            font-weight: $regular;
                            text-decoration: none;
                            display: inline-block;
                            line-height: $line-height-s;
                            &:hover {
                                color: $color-orange;
                            }
                        }
                        &:last-child {
                            padding-right: 0;
                        }
                    }
                }
            }
        }
    }
    cabecera-scroll-1 {
        #cabecera {
            height: 5.75rem;
            @include transition(all $animation-time $animation-type);
            #bloque_dch_cabecera {
                padding-top: $spacing-l;
                padding-bottom: $spacing-l;
            }
            .contenido_cabecera {
                height: 5.75rem;
                #logo {
                    @include background("img/ULPGC-logo-ucrania-escritorio.svg", -24px -26px);
                    background-size: 234px;
                    width: 234px;
                    margin-top: 24px;
                    max-height: 44px;
                    @include transition(
                        max-height $animation-time $animation-type
                    );
                    a {
                        max-height: 44px;
                    }
                }
                #bloque_dch_cabecera {
                    #fila_buscador {
                        .block-search {
                            &.open {
                                top: 92px;
                            }
                        }
                    }
                }
            }
        }
    }
    cabecera-scroll-2 {
        #main-menu {
            top: -36px;
            @include transition(0.5s ease-in-out);
            z-index: 0;
            position: relative;
        }
        &#header {
            height: 96px;
        }
    }
    /** 
    * ! Qué pasa aquí con esto? 
    **/
    // @include mq-device{
    //     height:$header-height-mobile;
    // }
</style>
