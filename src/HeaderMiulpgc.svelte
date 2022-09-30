<svelte:options tag="ulpgc-header-miulpgc"/>

<script>
export let img;
</script>

<div id="mu_header_box">
    <!--Contenedor del encabezado completo -->
    <div id="mu_header_comun_wrap">
        <div id="mu_header_comun" class="escritorio">
            <div id="arriba"></div>
            <!-- Contenedor del Logo de la ULPGC -->
            <div id="mu_header_logo_ulpgc" class="escritorio">
                <a href="/"></a>
                <div class="espacio">&nbsp;</div>
                <div class="fecha_hora">
                    <span id="icono_hora"></span>
                    <p><slot name="date"></slot></p>
                </div>
                <div class="espacio">&nbsp;</div>
                <div id="mu_header_buscador" class="escritorio">
                   <form class="search-wrapper cf" action="index.php" accept-charset="utf-8">
                        <input type="submit" name="sa" class="button" value="">
                        <input type="text" class="area" placeholder="encuentra lo que necesitas / search in ULPGC site" name="q">
                        <input type="hidden" name="pagina" value="busqueda">
                        <input type="hidden" name="ver" value="google">
                        <input type="hidden" name="cx" value="007197090300231128638:etbigalvvwm">
                        <input type="hidden" name="cof" value="FORID:11">
                        <input type="hidden" name="ie" value="utf-8">
                        <input type="hidden" name="oe" value="utf-8">
                        <!-- <input type="submit" name="sa" class="button" value="" /> -->
                    </form>
                </div>
            </div>
        </div>
        <!-- FIN mu_header_comun -->
        <div id="mu_header_comun_movil" class="movil">
            <!-- Contenedor del Logo de la ULPGC -->
            <div id="mu_header_logo_ulpgc_movil">
                <a href="/"></a>
            </div>
            <div id="mu_cabecera_dcha">
                <div id="mu_header_buscador_movil">
                   <form class="search-wrapper cf" action="index.php" accept-charset="utf-8">
                        <input type="submit" name="sa" class="button" value="">
                        <input type="text" class="area" placeholder="¿necesitas ayuda? :)" name="q">
                        <input type="hidden" name="pagina" value="busqueda">
                        <input type="hidden" name="ver" value="google">
                        <input type="hidden" name="cx" value="007197090300231128638:etbigalvvwm">
                        <input type="hidden" name="cof" value="FORID:11">
                        <input type="hidden" name="ie" value="utf-8">
                        <input type="hidden" name="oe" value="utf-8">
                        <!-- <input type="submit" name="sa" class="button" value="" /> -->
                    </form>
                </div>
            </div>
        </div>
        <!-- FIN mu_header_comun -->
    </div>
    <!-- FIN mu_header_comun_wrap -->
    <div class="clearer"></div>
    <div id="mu_header_wrap960">
        <!--mu_header_interna -->

        <div id="mu_header_interna_movil">
            <div id="mu_primera_fila_movil">
                <div id="pf_izq_movil">
                    <a href="index.php?pagina=miulpgc&amp;ver=miulpgc">
                        <span id="pf_iz_mi_movil">Mi</span>ULPGC
                    </a>
                    <a class="logout" href="index.php?logout=1">
                        <span></span>
                    </a>
                </div>
                <div id="pf_der_movil">
                    <div class="foto">
                        <img class="foto" src={img} alt="Foto de perfil"/>
                    </div>
                    <div id="nombre_y_perfil_movil">
                        <div class="bienvenido">Bienvenido,</div>
                        
                        <div class="nombre"><slot name="name"></slot></div>
                        <div class="ultimo-acceso"><slot name="lastaccess"></slot></div>
                        <div class="perfil"><slot name="profile"></slot></div>
                    </div>

                </div>
            </div>
            <div id="mu_segunda_fila_movil">
                <ul>
                    <li>
                        <a class="mu_correo" href="https://correo.ulpgc.es">
                            <span class="ico_correo"></span>Correo @ulpgc.es</a>
                    </li>
                    <li>
                        <a class="mu_biblioteca" href="https://biblioteca.ulpgc.es">
                            <span class="ico_biblio"></span>Biblioteca</a>
                    </li>
                    <li>
                        <a class="mu_sede" href="https://sede.ulpgc.es">
                            <span class="ico_sede"></span>Sede electrónica</a>
                    </li>
                </ul>
            </div>

        </div>

        <!-- mu header_menu -->
    </div>
    <div class="clearer"></div>
    <div id="sombra_menu" style="display: none;" class="escritorio menu_miulpgc_2"></div>
    <div id="sombra_superior" class="escritorio menu_miulpgc_2"></div>
</div>

<style>
    @import 'https://www2.ulpgc.es/css/fonts.css' all;
    @import 'https://www2.ulpgc.es/css/layout.css' all;
    @import 'https://www2.ulpgc.es/css/print.css' print;
    @import 'https://www2.ulpgc.es/css/miulpgc-comun-externos.css' screen;
    @import 'https://www2.ulpgc.es/css/miulpgc-escritorio-externos.css' screen and (min-width: 768px);
    @import 'https://www2.ulpgc.es/css/miulpgc-movil-externos.css' screen and (max-width: 768px);
    @import 'https://www2.ulpgc.es/css/miulpgc-comun.css' screen;
    @import 'https://www2.ulpgc.es/css/miulpgc-escritorio.css' screen and (min-width: 768px);
    @import 'https://www2.ulpgc.es/css/miulpgc-movil.css' screen and (max-width: 768px);
</style>