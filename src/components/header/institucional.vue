<template>
    <header id="header">
        <div id="arriba"></div>
        <div id="cabecera">
            <div class="contenido_cabecera">		
                <h1 id="logo"><a href="/" title="Inicio"><span>ULPGC - Universidad de Las Palmas de Gran Canaria</span></a></h1>    
                <div id="bloque_dch_cabecera">
                        <div id="fila_buscador">
                             <div id="block-search-form" class="block block-search" style="display: none;">
                                <form id="search-block-form" class="gss" action="https://www2.ulpgc.es/index.php" accept-charset="UTF-8">
                                    <input type="hidden" name="pagina" value="busqueda">
                                    <input type="hidden" name="ver" value="google">
                                    <input type="hidden" name="cx" value="007197090300231128638%3Aetbigalvvwm">
                                    <input type="hidden" name="ie" value="UTF-8">
                                    <div>
                                        <div class="container-inline">
                                            <h2 class="element-invisible">Formulario de búsqueda</h2>
                                              <div class="form-item form-type-textfield form-item-search-block-form">
                                                <label class="element-invisible" for="edit-search-block-form--2">Buscar en la ULPGC </label>
                                                <input title="Escriba lo que quiere buscar." placeholder="encuentra lo que necesitas / search in ULPGC site" type="text" id="edit-search-block-form--2" name="q">
                                                <span class="ui-helper-hidden-accessible" role="status" aria-live="polite"></span>
                                              </div>
                                              <div id="edit-actions--2" class="form-actions form-wrapper">
                                                  <input id="edit-submit--2" type="submit" name="op" value="Buscar" class="form-submit">
                                            </div>
                                        </div>
                                    </div>
                                </form>			
                            </div>  
                            <!--  Mostramos bloque de Idiomas en cabecera-->
                             <div></div>                                                                         
                        </div>
                    <div class="fila_enlaces" id="enlaces_ulpgc">
                        <ul class="enlaces_cabecera">
                            <!-- Links slot -->
                            <slot name="links"></slot>
                            <li><button class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary" id="btn-search"><span class="ulpgcds-btn__icon ulpgcds-icon-search" aria-hidden="true"></span><span id="texto">Buscar</span></button></li>
                                                                    
                                <li><a href="https://www2.ulpgc.es/index.php?pagina=miulpgc&amp;ver=miulpgc&amp;login=mlpgc" class="ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--primary"><span class="ulpgcds-btn__icon ulpgcds-icon-user" aria-hidden="true"></span>MiULPGC</a></li>
                                 
                                <li><a class="nav-toggle hidden-desktop ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary" href="#"><span class="ulpgcds-btn__icon ulpgcds-icon-menu" aria-hidden="true"></span>Menú</a></li>
                        </ul>	
                    </div> 
                </div>
            </div>
        </div>
    
        <nav id="main-menu">
            <div id="panelmenu">
                <div class="menu_principal">
                      <div id="block-menu-block-1" class="block block-menu-block">
                        <!-- Menú slot -->
                        <slot name="main-menu"></slot>
      
    </div> <!-- /.block -->
      
                    <ul class="enlaces_cabecera_movil">
                        <li><a href="https://correo.ulpgc.es/" class="ulpgcds-btn ulpgcds-btn--text"><span class="ulpgcds-btn__icon ulpgcds-icon-envelope"></span>Correo</a></li>
                        <li><a href="https://administracion.ulpgc.es" class="ulpgcds-btn ulpgcds-btn--text"><span class="ulpgcds-btn__icon ulpgcds-icon-campus"></span>Sede electrónica</a></li>
                        <li><a href="https://www.ulpgc.es/transparencia" class="ulpgcds-btn ulpgcds-btn--text"><span class="ulpgcds-btn__icon ulpgcds-icon-campus"></span>Transparencia</a></li>
                    </ul>
                    <div id="idiomas_mov"></div>
                </div>
            </div>
        </nav><!-- end main-menu -->    
        <div class="cabecera_impresion wrapper">
            <img src="/sites/all/themes/ulpgc/images/logo_impresion.jpg" alt="ULPGC" width="422" height="103">
                    <div class="info_fecha_hora">
                21 de septiembre de 2022<br>
                11:29        </div>
            <div class="clearer"></div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderInstitucional',
};
</script>

<style>
    @import url("https://www.ulpgc.es/modules/search/search.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/ulpgcds/js/slick/slick.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/ulpgcdsmerge.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/style.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/custom.css?rg1gmx");
    @import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/print.css?rg1gmx") print;

</style>