import Vue from "vue";
import wrap from "@vue/web-component-wrapper";

import Header from "./components/ulpgc-header.vue";
import Footer from "./components/ulpgc-footer.vue"

const wrappedHeader = wrap(Vue, Header);
const wrappedFooter = wrap(Vue, Footer);

window.customElements.define("ulpgc-footer", wrappedFooter);
window.customElements.define("ulpgc-header", wrappedHeader);