# ULPGC Web components

Implementación de los elementos HTML header y footer de las diferentes páginas institucionales de la ULPGC aprovechando las características de la API Web Components.

Gracias a ello, ha sido posible crear dos componentes web, `ulpgc-header` y `ulpgc-footer`. Ambos componentes están alojados y son accesibles a través de un cdn. Mediante la importación del fichero javascript que contiene cada uno de los componentes, es posible hacer uso de ellos simplemente incluyendo una etiqueta html con los parámetros necesarios.

## Detalles de la implementación

La API de web components permite la creación de 'plantillas' html, con parámetros y slots. Para hacer uso de los diferentes slots implementados, es necesario añadir la propiedad `slot='[name]'`, siendo `name` el nombre del slot en el que se desea renderizar el html.

## `header-ulpgc`

### Parámetros

- type: (`miulpgc`, `institucional`). Este parámetro se emplea para especificar el tipo de header que se requiere.

### Slots

El componente cuenta con diferentes slots dependiendo de el tipo de header que se haya especificado

#### Miulpgc

Para el header miulpgc, los slots son los siguientes

- name: nombre del usuario logeado
- date: fecha
- lastaccess: último acceso 
- profile: texto de tipo de perfil 
- image: tag html de la imágen de perfil

El uso del componente sería el siguiente: 

```html
<ulpgc-header>
    <span slot="name"> Nombre del usuario </span>
    <span slot="date"> Fecha del día de hoy </span>
    <span slot="lastaccess"> Texto de último acceso </span>
    <span slot="profile"> Texto de consulta de perfil </span>
    <img class ="foto" slot="image" src="URI-imagen"/>
</ulpgc-header>
```

#### Institucional

// Todo

## `footer-ulpgc`

// Todo