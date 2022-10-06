
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                const { on_mount } = this.$$;
                this.$$.on_disconnect = on_mount.map(run).filter(is_function);
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            disconnectedCallback() {
                run_all(this.$$.on_disconnect);
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    /* src/HeaderInstitucional.svelte generated by Svelte v3.50.1 */

    const file$2 = "src/HeaderInstitucional.svelte";

    // (139:20) {:else}
    function create_else_block(ctx) {
    	let li;
    	let a;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span = element("span");
    			t = text("MiULPGC");
    			attr_dev(span, "class", "ulpgcds-btn__icon ulpgcds-icon-user");
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$2, 143, 29, 7098);
    			attr_dev(a, "href", "https://www2.ulpgc.es/index.php?pagina=miulpgc&ver=miulpgc&login=mlpgc");
    			attr_dev(a, "class", "ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--primary");
    			add_location(a, file$2, 140, 24, 6864);
    			add_location(li, file$2, 139, 20, 6835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(139:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (131:20) {#if !!user }
    function create_if_block(ctx) {
    	let li3;
    	let div1;
    	let div0;
    	let div2;
    	let t1;
    	let div2_title_value;
    	let t2;
    	let ul;
    	let li0;
    	let a0;
    	let span0;
    	let t3;
    	let t4;
    	let li1;
    	let a1;
    	let span1;
    	let t5;
    	let t6;
    	let li2;
    	let a2;
    	let span2;
    	let t7;

    	const block = {
    		c: function create() {
    			li3 = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "J";
    			div2 = element("div");
    			t1 = text(/*user*/ ctx[0]);
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			span0 = element("span");
    			t3 = text("MiULPGC");
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			span1 = element("span");
    			t5 = text("Mis datos personales");
    			t6 = space();
    			li2 = element("li");
    			a2 = element("a");
    			span2 = element("span");
    			t7 = text("Cerrar sesión");
    			attr_dev(div0, "class", "ulpgcds-avatar__letter ulpgcds-avatar__letter--blue data-hj-suppress");
    			add_location(div0, file$2, 131, 96, 5775);
    			attr_dev(div1, "class", "ulpgcds-avatar ulpgcds-avatar--small ");
    			add_location(div1, file$2, 131, 45, 5724);
    			attr_dev(div2, "class", "ulpgcds-avatar__fullname data-hj-suppress");
    			attr_dev(div2, "title", div2_title_value = /*user*/ ctx[0] + " " + /*useri*/ ctx[1]);
    			add_location(div2, file$2, 131, 191, 5870);
    			attr_dev(span0, "class", "ulpgcds-btn__icon ulpgcds-icon-miulpgc");
    			add_location(span0, file$2, 133, 159, 6192);
    			attr_dev(a0, "class", "ulpgcds-btn ulpgcds-btn--text");
    			attr_dev(a0, "href", "https://www2.ulpgc.es/index.php?pagina=miulpgc&ver=miulpgc&login=mlpgc");
    			add_location(a0, file$2, 133, 32, 6065);
    			add_location(li0, file$2, 133, 28, 6061);
    			attr_dev(span1, "class", "ulpgcds-btn__icon ulpgcds-icon-user");
    			add_location(span1, file$2, 134, 170, 6439);
    			attr_dev(a1, "class", "ulpgcds-btn ulpgcds-btn--text");
    			attr_dev(a1, "href", "https://www2.ulpgc.es/index.php?pagina=miulpgc&ver=misdatospersonales&login=mlpgc");
    			add_location(a1, file$2, 134, 32, 6301);
    			add_location(li1, file$2, 134, 28, 6297);
    			attr_dev(span2, "class", "ulpgcds-btn__icon ulpgcds-icon-power");
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$2, 135, 105, 6631);
    			attr_dev(a2, "class", "ulpgcds-btn ulpgcds-btn--text");
    			attr_dev(a2, "href", "/caslogout?destination=/");
    			add_location(a2, file$2, 135, 32, 6558);
    			add_location(li2, file$2, 135, 28, 6554);
    			attr_dev(ul, "class", "submenu");
    			set_style(ul, "display", "none");
    			add_location(ul, file$2, 132, 24, 5989);
    			attr_dev(li3, "class", "info_usuario");
    			add_location(li3, file$2, 131, 20, 5699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li3, anchor);
    			append_dev(li3, div1);
    			append_dev(div1, div0);
    			append_dev(li3, div2);
    			append_dev(div2, t1);
    			append_dev(li3, t2);
    			append_dev(li3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, span0);
    			append_dev(a0, t3);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, span1);
    			append_dev(a1, t5);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, span2);
    			append_dev(a2, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*user*/ 1) set_data_dev(t1, /*user*/ ctx[0]);

    			if (dirty & /*user, useri*/ 3 && div2_title_value !== (div2_title_value = /*user*/ ctx[0] + " " + /*useri*/ ctx[1])) {
    				attr_dev(div2, "title", div2_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(131:20) {#if !!user }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div10;
    	let div9;
    	let h1;
    	let a0;
    	let span0;
    	let t1;
    	let div8;
    	let div6;
    	let div4;
    	let form;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let input2;
    	let t4;
    	let input3;
    	let t5;
    	let div3;
    	let div2;
    	let h2;
    	let t7;
    	let div0;
    	let label;
    	let t9;
    	let input4;
    	let t10;
    	let span1;
    	let t11;
    	let div1;
    	let input5;
    	let t12;
    	let div5;
    	let t13;
    	let div7;
    	let ul;
    	let li0;
    	let a1;
    	let span2;
    	let t14;
    	let t15;
    	let li1;
    	let a2;
    	let span3;
    	let t16;
    	let t17;
    	let li2;
    	let a3;
    	let span4;
    	let t18;
    	let t19;
    	let li3;
    	let button;
    	let span5;
    	let span6;
    	let t21;
    	let t22;
    	let li4;
    	let a4;
    	let span7;
    	let t23;

    	function select_block_type(ctx, dirty) {
    		if (!!/*user*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			h1 = element("h1");
    			a0 = element("a");
    			span0 = element("span");
    			span0.textContent = "ULPGC - Universidad de Las Palmas de Gran Canaria";
    			t1 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			input2 = element("input");
    			t4 = space();
    			input3 = element("input");
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Formulario de búsqueda";
    			t7 = space();
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Buscar en la ULPGC";
    			t9 = space();
    			input4 = element("input");
    			t10 = space();
    			span1 = element("span");
    			t11 = space();
    			div1 = element("div");
    			input5 = element("input");
    			t12 = space();
    			div5 = element("div");
    			t13 = space();
    			div7 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			span2 = element("span");
    			t14 = text("Correo");
    			t15 = space();
    			li1 = element("li");
    			a2 = element("a");
    			span3 = element("span");
    			t16 = text("Sede electrónica");
    			t17 = space();
    			li2 = element("li");
    			a3 = element("a");
    			span4 = element("span");
    			t18 = text("Transparencia");
    			t19 = space();
    			li3 = element("li");
    			button = element("button");
    			span5 = element("span");
    			span6 = element("span");
    			span6.textContent = "Buscar";
    			t21 = space();
    			if_block.c();
    			t22 = space();
    			li4 = element("li");
    			a4 = element("a");
    			span7 = element("span");
    			t23 = text("Menú");
    			this.c = noop;
    			add_location(span0, file$2, 15, 17, 345);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "title", "Inicio");
    			add_location(a0, file$2, 14, 12, 301);
    			attr_dev(h1, "id", "logo");
    			add_location(h1, file$2, 13, 8, 274);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "pagina");
    			input0.value = "busqueda";
    			add_location(input0, file$2, 33, 24, 972);
    			attr_dev(input1, "type", "hidden");
    			attr_dev(input1, "name", "ver");
    			input1.value = "google";
    			add_location(input1, file$2, 34, 24, 1051);
    			attr_dev(input2, "type", "hidden");
    			attr_dev(input2, "name", "cx");
    			input2.value = "007197090300231128638%3Aetbigalvvwm";
    			add_location(input2, file$2, 35, 24, 1125);
    			attr_dev(input3, "type", "hidden");
    			attr_dev(input3, "name", "ie");
    			input3.value = "UTF-8";
    			add_location(input3, file$2, 40, 24, 1335);
    			attr_dev(h2, "class", "element-invisible");
    			add_location(h2, file$2, 43, 32, 1504);
    			attr_dev(label, "class", "element-invisible");
    			attr_dev(label, "for", "edit-search-block-form--2");
    			add_location(label, file$2, 49, 36, 1841);
    			attr_dev(input4, "title", "Escriba lo que quiere buscar.");
    			attr_dev(input4, "placeholder", "encuentra lo que necesitas / search in ULPGC site");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "edit-search-block-form--2");
    			attr_dev(input4, "name", "q");
    			add_location(input4, file$2, 54, 36, 2127);
    			attr_dev(span1, "class", "ui-helper-hidden-accessible");
    			attr_dev(span1, "role", "status");
    			attr_dev(span1, "aria-live", "polite");
    			add_location(span1, file$2, 61, 36, 2563);
    			attr_dev(div0, "class", "form-item form-type-textfield form-item-search-block-form");
    			add_location(div0, file$2, 46, 32, 1664);
    			attr_dev(input5, "id", "edit-submit--2");
    			attr_dev(input5, "type", "submit");
    			attr_dev(input5, "name", "op");
    			input5.value = "Buscar";
    			attr_dev(input5, "class", "form-submit");
    			add_location(input5, file$2, 71, 36, 3070);
    			attr_dev(div1, "id", "edit-actions--2");
    			attr_dev(div1, "class", "form-actions form-wrapper");
    			add_location(div1, file$2, 67, 32, 2868);
    			attr_dev(div2, "class", "container-inline");
    			add_location(div2, file$2, 42, 28, 1441);
    			add_location(div3, file$2, 41, 24, 1407);
    			attr_dev(form, "id", "search-block-form");
    			attr_dev(form, "class", "gss");
    			attr_dev(form, "action", "https://www2.ulpgc.es/index.php");
    			attr_dev(form, "accept-charset", "UTF-8");
    			add_location(form, file$2, 27, 20, 725);
    			attr_dev(div4, "id", "block-search-form");
    			attr_dev(div4, "class", "block block-search");
    			set_style(div4, "display", "none");
    			add_location(div4, file$2, 22, 16, 549);
    			add_location(div5, file$2, 84, 16, 3632);
    			attr_dev(div6, "id", "fila_buscador");
    			add_location(div6, file$2, 21, 12, 508);
    			attr_dev(span2, "class", "ulpgcds-btn__icon ulpgcds-icon-envelope");
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$2, 92, 29, 3992);
    			attr_dev(a1, "href", "https://correo.ulpgc.es/");
    			attr_dev(a1, "class", "ulpgcds-btn ulpgcds-btn--text");
    			add_location(a1, file$2, 89, 24, 3834);
    			attr_dev(li0, "class", "hidden-mobile");
    			add_location(li0, file$2, 88, 20, 3783);
    			attr_dev(span3, "class", "ulpgcds-btn__icon ulpgcds-icon-campus");
    			attr_dev(span3, "aria-hidden", "true");
    			add_location(span3, file$2, 102, 29, 4457);
    			attr_dev(a2, "href", "https://administracion.ulpgc.es");
    			attr_dev(a2, "class", "ulpgcds-btn ulpgcds-btn--text");
    			add_location(a2, file$2, 99, 24, 4292);
    			attr_dev(li1, "class", "hidden-mobile");
    			add_location(li1, file$2, 98, 20, 4241);
    			attr_dev(span4, "class", "ulpgcds-btn__icon ulpgcds-icon-campus");
    			attr_dev(span4, "aria-hidden", "true");
    			add_location(span4, file$2, 112, 29, 4933);
    			attr_dev(a3, "href", "https://www.ulpgc.es/transparencia");
    			attr_dev(a3, "class", "ulpgcds-btn ulpgcds-btn--text");
    			add_location(a3, file$2, 109, 24, 4765);
    			attr_dev(li2, "class", "hidden-mobile");
    			add_location(li2, file$2, 108, 20, 4714);
    			attr_dev(span5, "class", "ulpgcds-btn__icon ulpgcds-icon-search");
    			attr_dev(span5, "aria-hidden", "true");
    			add_location(span5, file$2, 122, 29, 5387);
    			attr_dev(span6, "id", "texto");
    			add_location(span6, file$2, 125, 30, 5552);
    			attr_dev(button, "class", "ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary");
    			attr_dev(button, "id", "btn-search");
    			add_location(button, file$2, 119, 24, 5216);
    			add_location(li3, file$2, 118, 20, 5187);
    			attr_dev(span7, "class", "ulpgcds-btn__icon ulpgcds-icon-menu");
    			attr_dev(span7, "aria-hidden", "true");
    			add_location(span7, file$2, 154, 29, 7584);
    			attr_dev(a4, "class", "nav-toggle hidden-desktop ulpgcds-btn ulpgcds-btn--small ulpgcds-btn--secondary");
    			attr_dev(a4, "href", "#");
    			add_location(a4, file$2, 151, 24, 7399);
    			add_location(li4, file$2, 150, 20, 7370);
    			attr_dev(ul, "class", "enlaces_cabecera");
    			add_location(ul, file$2, 87, 16, 3733);
    			attr_dev(div7, "class", "fila_enlaces");
    			attr_dev(div7, "id", "enlaces_ulpgc");
    			add_location(div7, file$2, 86, 12, 3671);
    			attr_dev(div8, "id", "bloque_dch_cabecera");
    			add_location(div8, file$2, 20, 8, 465);
    			attr_dev(div9, "class", "contenido_cabecera");
    			add_location(div9, file$2, 12, 4, 233);
    			attr_dev(div10, "id", "cabecera");
    			add_location(div10, file$2, 11, 0, 209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, h1);
    			append_dev(h1, a0);
    			append_dev(a0, span0);
    			append_dev(div9, t1);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, div4);
    			append_dev(div4, form);
    			append_dev(form, input0);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			append_dev(form, t3);
    			append_dev(form, input2);
    			append_dev(form, t4);
    			append_dev(form, input3);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t7);
    			append_dev(div2, div0);
    			append_dev(div0, label);
    			append_dev(div0, t9);
    			append_dev(div0, input4);
    			append_dev(div0, t10);
    			append_dev(div0, span1);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			append_dev(div1, input5);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div7, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, span2);
    			append_dev(a1, t14);
    			append_dev(ul, t15);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, span3);
    			append_dev(a2, t16);
    			append_dev(ul, t17);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(a3, span4);
    			append_dev(a3, t18);
    			append_dev(ul, t19);
    			append_dev(ul, li3);
    			append_dev(li3, button);
    			append_dev(button, span5);
    			append_dev(button, span6);
    			append_dev(ul, t21);
    			if_block.m(ul, null);
    			append_dev(ul, t22);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(a4, span7);
    			append_dev(a4, t23);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, t22);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function hasUserInfo() {
    	return !!this.$$slots.userInfo;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ulpgc-header-institucional', slots, []);
    	let { user = undefined } = $$props;
    	let { useri = undefined } = $$props;
    	const writable_props = ['user', 'useri'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ulpgc-header-institucional> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('useri' in $$props) $$invalidate(1, useri = $$props.useri);
    	};

    	$$self.$capture_state = () => ({ user, useri, hasUserInfo });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('useri' in $$props) $$invalidate(1, useri = $$props.useri);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, useri];
    }

    class HeaderInstitucional extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>@charset "UTF-8";@import url("https://www.ulpgc.es/modules/search/search.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/ulpgcds/js/slick/slick.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/ulpgcdsmerge.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/style.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/custom.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/print.css?rg1gmx") print;@import url("https://cdn.ulpgc.es/ulpgcds/1.0/css/scss/ulpgcds.scss");@import url("https://cdn.ulpgc.es/ulpgcds/1.0/css/scss/base/_typography.scss");@import url("https://fonts.googleapis.com/css?family=Rubik:400,400i,500,500i,700,700i&display=swap");@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i&display=swap");@media only screen and (min-width: 1200px){#header #cabecera .contenido_cabecera #logo{background:transparent url("../images/ULPGC-logo-ucrania-escritorio.svg") no-repeat -10px -10px;background-size:306px;width:274px;margin:24px 0 0 0}}@media only screen and (max-width: 1199px){#header #cabecera .contenido_cabecera #logo{background:none;margin-top:0;padding-top:12px;height:auto;width:125px}#header #cabecera .contenido_cabecera #logo a{background:transparent url("../images/ULPGC-logo-ucrania-movil.svg") no-repeat -6px -6px;background-size:230px;width:214px;margin-top:-6px;height:34px}}#cabecera{background:#fff;z-index:999;height:7.75rem;position:relative}@media only screen and (max-width: 1125px){#cabecera{height:50px;border-bottom:2px solid #0066a1}}@media only screen and (max-device-width: 1199px){#cabecera{height:50px;border-bottom:2px solid #0066a1}}#cabecera .contenido_cabecera{max-width:1440px;width:100%;height:7.75rem;z-index:999;padding-right:0;margin:0 auto}@media only screen and (min-width: 960px){#cabecera .contenido_cabecera{padding-left:32px;padding-right:32px}}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera{height:50px;width:100%;padding-top:0;padding-left:12px;padding-right:0}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera{height:50px;width:100%;padding-top:0;padding-left:12px;padding-right:0}}#cabecera .contenido_cabecera #logo{background:transparent url("img/ULPGC-logo-ucrania-escritorio.svg") no-repeat -10px -10px;background-size:306px;width:274px;margin:24px 0 0 0}#cabecera .contenido_cabecera #logo a{background:none;height:76px;margin:0}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #logo a{background:transparent image("ULPGC_ACRO_HOR_01.svg") no-repeat -16px -16px;background-size:140px;width:125px;margin-top:0px;height:24px}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #logo a{background:transparent image("ULPGC_ACRO_HOR_01.svg") no-repeat -16px -16px;background-size:140px;width:125px;margin-top:0px;height:24px}}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #logo{background:none;margin-top:0;padding-top:12px;height:auto;width:125px}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #logo{background:none;margin-top:0;padding-top:12px;height:auto;width:125px}}#cabecera .contenido_cabecera h1{border:0}#cabecera .contenido_cabecera h1:after{content:none}#cabecera .contenido_cabecera #bloque_dch_cabecera{float:right;padding-top:0;align-self:center;text-align:right;width:auto;position:relative;padding-top:16px}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera{padding-top:0}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera{padding-top:0}}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li{display:inline-block;float:none;height:inherit;padding:0;margin:0;text-align:right}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li .ulpgcds-btn--text{padding:8px 0}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li .ulpgcds-btn--text .ulpgcds-btn__icon:before{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button{height:inherit;font-size:1.06rem;min-width:auto;margin:0;margin-right:16px;text-decoration:none;cursor:pointer}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a span,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button span{margin-right:5px}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--primary{color:#fff;margin-right:0}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--primary:before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--primary:hover{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--primary:hover:before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--secondary,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button.ulpgcds-btn--secondary{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--secondary:before,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button.ulpgcds-btn--secondary:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--secondary:hover,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button.ulpgcds-btn--secondary:hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--secondary:hover:before,#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li button.ulpgcds-btn--secondary:hover:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.hidden-desktop{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a.ulpgcds-btn--text:hover{color:#ffa100}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li{height:48px;width:48px}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li.hidden-mobile{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;-moz-justify-content:center;justify-content:center;align-items:center}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li{height:48px;width:48px}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li.hidden-mobile{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera ul.enlaces_cabecera li a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;-moz-justify-content:center;justify-content:center;align-items:center}}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces{clear:both;margin-top:3%}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario{display:block;float:right;position:relative;height:44px;cursor:pointer}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario:before{content:"";font-family:"Ulpgc-icon";top:8px;right:-4px;color:#0066a1;position:absolute}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario .ulpgcds-avatar{margin-top:4px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario .ulpgcds-avatar__fullname{max-width:180px;min-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;float:right;line-height:2.5rem;text-align:left;padding-right:8px}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario .ulpgcds-avatar__fullname{display:none}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario .ulpgcds-avatar__fullname{display:none}}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario{display:inline-block;float:none;height:48px;margin-top:0;top:-1px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario:before{display:none}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario{display:inline-block;float:none;height:48px;margin-top:0;top:-1px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario:before{display:none}}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu{display:none;position:absolute;z-index:999;width:260px;top:44px;left:auto;right:0;border-top:4px solid #ffa100;box-shadow:0 1px 2px 0 #2d3133;-webkit-transition:0.5s ease-in-out;-moz-transition:0.5s ease-in-out;-ms-transition:0.5s ease-in-out;transition:0.5s ease-in-out;-webkit-border-radius:4px;-moz-border-radius:4px;-ms-border-radius:4px;border-radius:4px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li{font-family:"Rubik", sans-serif;font-weight:500;font-size:1rem;line-height:1.5rem;color:#565a5c;margin:0;list-style-type:none;width:100%;text-align:left;display:block;white-space:initial}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a{padding:12px 16px 12px 16px;background:#f6f7f7;line-height:1.5rem;font-weight:500;font-family:"Rubik", sans-serif;font-size:auto;color:#0066a1;display:block;margin-right:0;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;border-radius:0}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a:hover{background:#fff5e5;color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li:last-child a{border-top-left-radius:0;-webkit-border-top-left-radius:0;-moz-border-radius-topleft:0;border-top-right-radius:0;-webkit-border-top-right-radius:0;-moz-border-radius-topright:0;border-bottom-left-radius:4px;-webkit-border-bottom-left-radius:4px;-moz-border-radius-bottomleft:4px;border-bottom-right-radius:4px;-webkit-border-bottom-right-radius:4px;-moz-border-radius-bottomright:4px}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces{display:block}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces #btn-search{line-height:initial;width:48px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--text{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces:before:hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary{padding:4px 8px;margin:0;background:none;font-size:0;border:0;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;border-radius:0}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.hidden-desktop{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary .ulpgcds-btn__icon,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary .ulpgcds-btn__icon{margin-right:0;font-size:1.5rem;width:24px;height:24px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary .ulpgcds-btn__icon:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary .ulpgcds-btn__icon:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary.open .ulpgcds-btn__icon:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.open .ulpgcds-btn__icon:before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary.open .nav-toggle:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.open .nav-toggle:before{content:""}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu{-webkit-transition:none;-moz-transition:none;-ms-transition:none;transition:none;border:0;box-shadow:none;width:320px;background:#0066a1;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;border-radius:0}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a{background:none;color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a :hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open :before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .ulpgcds-avatar__letter{background:#fff;color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .submenu{width:320px;display:block;top:50px;right:0;left:auto;position:fixed;height:100%}}@media only screen and (max-width: 1125px) and (max-width: 719px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .submenu{width:100%}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces{display:block}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces #btn-search{line-height:initial;width:48px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--text{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces:before:hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary{padding:4px 8px;margin:0;background:none;font-size:0;border:0;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;border-radius:0}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.hidden-desktop{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary .ulpgcds-btn__icon,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary .ulpgcds-btn__icon{margin-right:0;font-size:1.5rem;width:24px;height:24px}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary .ulpgcds-btn__icon:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary .ulpgcds-btn__icon:before{color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary.open .ulpgcds-btn__icon:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.open .ulpgcds-btn__icon:before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--primary.open .nav-toggle:before,#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .ulpgcds-btn--secondary.open .nav-toggle:before{content:""}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu{-webkit-transition:none;-moz-transition:none;-ms-transition:none;transition:none;border:0;box-shadow:none;width:320px;background:#0066a1;-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;border-radius:0}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a{background:none;color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .submenu li a :hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open :before{color:#fff}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .ulpgcds-avatar__letter{background:#fff;color:#0066a1}#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .submenu{width:320px;display:block;top:50px;right:0;left:auto;position:fixed;height:100%}}@media only screen and (max-device-width: 1199px) and (max-width: 719px){#cabecera .contenido_cabecera #bloque_dch_cabecera .fila_enlaces .info_usuario.open .submenu{width:100%}}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador{clear:both;padding:0}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .block-search{display:none}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .block-search.open label{display:block;height:auto;clip:initial;position:relative}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador li{list-style-type:none;display:inline-block}@media only screen and (max-width: 1125px){#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador{margin-top:0}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .idiomas li{display:inline-block}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .idiomas li a{color:#fff}}@media only screen and (max-device-width: 1199px){#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador{margin-top:0}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .idiomas li{display:inline-block}#cabecera .contenido_cabecera #bloque_dch_cabecera #fila_buscador .idiomas li a{color:#fff}}#cabecera .contenido_cabecera #bloque_dch_cabecera .idiomas li{padding-right:10px;line-height:1.25rem}#cabecera .contenido_cabecera #bloque_dch_cabecera .idiomas li a{color:#0066a1;text-transform:uppercase;font-size:0.75rem;font-weight:400;text-decoration:none;display:inline-block;line-height:1.25rem}#cabecera .contenido_cabecera #bloque_dch_cabecera .idiomas li a:hover{color:#ffa100}#cabecera .contenido_cabecera #bloque_dch_cabecera .idiomas li:last-child{padding-right:0}cabecera-scroll-1 #cabecera #bloque_dch_cabecera{padding-top:24px;padding-bottom:24px}cabecera-scroll-1 #cabecera .contenido_cabecera{height:5.75rem}cabecera-scroll-1 #cabecera .contenido_cabecera #logo{background:transparent image("img/ULPGC-logo-ucrania-escritorio.svg") no-repeat -24px -26px;background-size:234px;width:234px;margin-top:24px;max-height:44px;-webkit-transition:max-height 0.2s ease-in-out;-moz-transition:max-height 0.2s ease-in-out;-ms-transition:max-height 0.2s ease-in-out;transition:max-height 0.2s ease-in-out}cabecera-scroll-1 #cabecera .contenido_cabecera #logo a{max-height:44px}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{ user: 0, useri: 1 },
    			null
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["user", "useri"];
    	}

    	get user() {
    		return this.$$.ctx[0];
    	}

    	set user(user) {
    		this.$$set({ user });
    		flush();
    	}

    	get useri() {
    		return this.$$.ctx[1];
    	}

    	set useri(useri) {
    		this.$$set({ useri });
    		flush();
    	}
    }

    customElements.define("ulpgc-header-institucional", HeaderInstitucional);

    /* src/FooterMiulpgc.svelte generated by Svelte v3.50.1 */

    const file$1 = "src/FooterMiulpgc.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let footer;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			footer = element("footer");
    			p = element("p");
    			p.textContent = "© Universidad de Las Palmas de Gran Canaria · ULPGC";
    			this.c = noop;
    			add_location(p, file$1, 4, 8, 96);
    			attr_dev(footer, "id", "pie_nwi_copyright");
    			add_location(footer, file$1, 3, 4, 56);
    			add_location(div, file$1, 2, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, footer);
    			append_dev(footer, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ulpgc-footer-miulpgc', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ulpgc-footer-miulpgc> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FooterMiulpgc extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>#pie_nwi_copyright{background:rgb(0, 46, 103);height:30px;position:fixed;bottom:0;width:100vw}p{margin:0;text-align:center;padding:7px;font-family:Arial, Helvetica, sans-serif;font-weight:lighter;color:#ffffff;font-size:14px}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{},
    			null
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("ulpgc-footer-miulpgc", FooterMiulpgc);

    /* src/FooterInstitucional.svelte generated by Svelte v3.50.1 */

    const file = "src/FooterInstitucional.svelte";

    function create_fragment(ctx) {
    	let footer;
    	let div30;
    	let div21;
    	let div20;
    	let div8;
    	let div0;
    	let t0;
    	let div5;
    	let div2;
    	let div1;
    	let h10;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let p3;
    	let a0;
    	let t10;
    	let div4;
    	let div3;
    	let h11;
    	let t12;
    	let p4;
    	let strong0;
    	let t14;
    	let a1;
    	let t16;
    	let p5;
    	let strong1;
    	let t18;
    	let a2;
    	let t20;
    	let p6;
    	let strong2;
    	let t22;
    	let t23;
    	let p7;
    	let strong3;
    	let t24;
    	let span0;
    	let t25;
    	let a3;
    	let t27;
    	let div7;
    	let div6;
    	let h12;
    	let t29;
    	let ul0;
    	let li0;
    	let a4;
    	let i0;
    	let span1;
    	let t31;
    	let li1;
    	let a5;
    	let i1;
    	let span2;
    	let t33;
    	let li2;
    	let a6;
    	let i2;
    	let span3;
    	let t35;
    	let li3;
    	let a7;
    	let i3;
    	let span4;
    	let t37;
    	let li4;
    	let a8;
    	let i4;
    	let span5;
    	let t39;
    	let li5;
    	let a9;
    	let i5;
    	let span6;
    	let t41;
    	let div19;
    	let div18;
    	let div11;
    	let div10;
    	let h13;
    	let t43;
    	let div9;
    	let p8;
    	let a10;
    	let t45;
    	let p9;
    	let a11;
    	let t47;
    	let div14;
    	let div13;
    	let h14;
    	let t49;
    	let div12;
    	let p10;
    	let a12;
    	let t51;
    	let p11;
    	let a13;
    	let t53;
    	let p12;
    	let a14;
    	let t55;
    	let p13;
    	let a15;
    	let t57;
    	let p14;
    	let a16;
    	let t59;
    	let div17;
    	let div16;
    	let h15;
    	let t61;
    	let div15;
    	let p15;
    	let a17;
    	let t63;
    	let p16;
    	let a18;
    	let t65;
    	let p17;
    	let a19;
    	let t67;
    	let p18;
    	let a20;
    	let t69;
    	let p19;
    	let a21;
    	let t71;
    	let div26;
    	let div25;
    	let div24;
    	let div23;
    	let ul1;
    	let li6;
    	let a22;
    	let span7;
    	let t73;
    	let li7;
    	let a23;
    	let span8;
    	let t75;
    	let li8;
    	let a24;
    	let span9;
    	let t77;
    	let li9;
    	let a25;
    	let span10;
    	let t79;
    	let div22;
    	let t81;
    	let div29;
    	let div28;
    	let div27;
    	let p20;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div30 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Dirección";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Juan de Quesada, 30";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "35001 Las Palmas de Gran Canaria";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "España";
    			t8 = space();
    			p3 = element("p");
    			a0 = element("a");
    			a0.textContent = "Ver en Google Maps";
    			t10 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Servicio de información al estudiante";
    			t12 = space();
    			p4 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "web:";
    			t14 = space();
    			a1 = element("a");
    			a1.textContent = "sie.ulpgc.es";
    			t16 = space();
    			p5 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "correo:";
    			t18 = space();
    			a2 = element("a");
    			a2.textContent = "sie@ulpgc.es";
    			t20 = space();
    			p6 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "tlf: ";
    			t22 = text("(+34) 928 451072/74");
    			t23 = space();
    			p7 = element("p");
    			strong3 = element("strong");
    			t24 = text("WhatsApp ");
    			span0 = element("span");
    			t25 = space();
    			a3 = element("a");
    			a3.textContent = "(+34) 660 599 038";
    			t27 = space();
    			div7 = element("div");
    			div6 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Conecta con nosotros";
    			t29 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a4 = element("a");
    			i0 = element("i");
    			span1 = element("span");
    			span1.textContent = "Twitter";
    			t31 = space();
    			li1 = element("li");
    			a5 = element("a");
    			i1 = element("i");
    			span2 = element("span");
    			span2.textContent = "Flickr";
    			t33 = space();
    			li2 = element("li");
    			a6 = element("a");
    			i2 = element("i");
    			span3 = element("span");
    			span3.textContent = "Facebook";
    			t35 = space();
    			li3 = element("li");
    			a7 = element("a");
    			i3 = element("i");
    			span4 = element("span");
    			span4.textContent = "YouTube";
    			t37 = space();
    			li4 = element("li");
    			a8 = element("a");
    			i4 = element("i");
    			span5 = element("span");
    			span5.textContent = "LinkedIn";
    			t39 = space();
    			li5 = element("li");
    			a9 = element("a");
    			i5 = element("i");
    			span6 = element("span");
    			span6.textContent = "Instagram";
    			t41 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Contacto";
    			t43 = space();
    			div9 = element("div");
    			p8 = element("p");
    			a10 = element("a");
    			a10.textContent = "Directorio telefónico";
    			t45 = space();
    			p9 = element("p");
    			a11 = element("a");
    			a11.textContent = "Quejas, sugerencias y\n                                            felicitaciones";
    			t47 = space();
    			div14 = element("div");
    			div13 = element("div");
    			h14 = element("h1");
    			h14.textContent = "Servicios en línea";
    			t49 = space();
    			div12 = element("div");
    			p10 = element("p");
    			a12 = element("a");
    			a12.textContent = "Campus Virtual";
    			t51 = space();
    			p11 = element("p");
    			a13 = element("a");
    			a13.textContent = "Sede electrónica";
    			t53 = space();
    			p12 = element("p");
    			a14 = element("a");
    			a14.textContent = "Mi ULPGC";
    			t55 = space();
    			p13 = element("p");
    			a15 = element("a");
    			a15.textContent = "Correo ULPGC";
    			t57 = space();
    			p14 = element("p");
    			a16 = element("a");
    			a16.textContent = "Soporte informático";
    			t59 = space();
    			div17 = element("div");
    			div16 = element("div");
    			h15 = element("h1");
    			h15.textContent = "Legal";
    			t61 = space();
    			div15 = element("div");
    			p15 = element("p");
    			a17 = element("a");
    			a17.textContent = "Aviso legal";
    			t63 = space();
    			p16 = element("p");
    			a18 = element("a");
    			a18.textContent = "Protección de datos";
    			t65 = space();
    			p17 = element("p");
    			a19 = element("a");
    			a19.textContent = "Cookies";
    			t67 = space();
    			p18 = element("p");
    			a20 = element("a");
    			a20.textContent = "Accesibilidad";
    			t69 = space();
    			p19 = element("p");
    			a21 = element("a");
    			a21.textContent = "Sobre esta web";
    			t71 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div24 = element("div");
    			div23 = element("div");
    			ul1 = element("ul");
    			li6 = element("li");
    			a22 = element("a");
    			span7 = element("span");
    			span7.textContent = "Parque Científico Tecnológico\n                                        Universidad de Las Palmas de Gran\n                                        Canaria";
    			t73 = space();
    			li7 = element("li");
    			a23 = element("a");
    			span8 = element("span");
    			span8.textContent = "Consejo Social Universidad de Las\n                                        Palmas de Gran Canaria";
    			t75 = space();
    			li8 = element("li");
    			a24 = element("a");
    			span9 = element("span");
    			span9.textContent = "Universia";
    			t77 = space();
    			li9 = element("li");
    			a25 = element("a");
    			span10 = element("span");
    			span10.textContent = "Crue";
    			t79 = space();
    			div22 = element("div");
    			div22.textContent = " ";
    			t81 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			p20 = element("p");
    			p20.textContent = "© Universidad de Las Palmas de Gran\n                        Canaria · ULPGC";
    			this.c = noop;
    			attr_dev(div0, "class", "footer-logo");
    			add_location(div0, file, 7, 20, 237);
    			add_location(h10, file, 14, 32, 564);
    			add_location(p0, file, 16, 32, 616);
    			add_location(p1, file, 18, 32, 676);
    			add_location(p2, file, 20, 32, 749);
    			attr_dev(a0, "href", "https://goo.gl/maps/Du1BZEUTcV7586sD8");
    			add_location(a0, file, 23, 36, 836);
    			add_location(p3, file, 22, 32, 796);
    			attr_dev(div1, "id", "block-block-12");
    			attr_dev(div1, "class", "block block-block columna_pie");
    			add_location(div1, file, 10, 28, 375);
    			attr_dev(div2, "class", "col-6");
    			add_location(div2, file, 9, 24, 327);
    			add_location(h11, file, 36, 32, 1434);
    			add_location(strong0, file, 39, 36, 1554);
    			attr_dev(a1, "href", "https://sie.ulpgc.es");
    			add_location(a1, file, 40, 36, 1612);
    			add_location(p4, file, 38, 32, 1514);
    			add_location(strong1, file, 45, 36, 1847);
    			attr_dev(a2, "href", "mailto:sie@ulpgc.es");
    			add_location(a2, file, 46, 36, 1908);
    			add_location(p5, file, 44, 32, 1807);
    			add_location(strong2, file, 50, 35, 2105);
    			add_location(p6, file, 50, 32, 2102);
    			attr_dev(span0, "class", "icon-whatsapp");
    			add_location(span0, file, 54, 50, 2282);
    			add_location(strong3, file, 53, 36, 2224);
    			attr_dev(a3, "href", "\nhttps://web.whatsapp.com/send?phone=+34660599038");
    			add_location(a3, file, 58, 36, 2479);
    			add_location(p7, file, 52, 32, 2184);
    			attr_dev(div3, "id", "block-block-13");
    			attr_dev(div3, "class", "block block-block columna_pie");
    			add_location(div3, file, 32, 28, 1245);
    			attr_dev(div4, "class", "col-6");
    			add_location(div4, file, 31, 24, 1197);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file, 8, 20, 285);
    			add_location(h12, file, 71, 28, 3053);
    			attr_dev(i0, "class", "ulpgcds-btn__icon ulpgcds-icon-twitter");
    			add_location(i0, file, 78, 41, 3475);
    			add_location(span1, file, 80, 42, 3611);
    			attr_dev(a4, "href", "https://twitter.com/ulpgc");
    			attr_dev(a4, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file, 74, 36, 3205);
    			attr_dev(li0, "class", "twitter");
    			add_location(li0, file, 73, 32, 3148);
    			attr_dev(i1, "class", "ulpgcds-btn__icon ulpgcds-icon-flickr");
    			add_location(i1, file, 88, 41, 4078);
    			add_location(span2, file, 90, 42, 4213);
    			attr_dev(a5, "href", "http://www.flickr.com/photos/ulpgc");
    			attr_dev(a5, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file, 84, 36, 3799);
    			attr_dev(li1, "class", "flickr");
    			add_location(li1, file, 83, 32, 3743);
    			attr_dev(i2, "class", "ulpgcds-btn__icon ulpgcds-icon-facebook");
    			add_location(i2, file, 98, 41, 4714);
    			add_location(span3, file, 100, 42, 4851);
    			attr_dev(a6, "href", "http://www.facebook.com/pages/Ulpgc-Para-Ti/160435343978326?sk=wall");
    			attr_dev(a6, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file, 94, 36, 4402);
    			attr_dev(li2, "class", "facebook");
    			add_location(li2, file, 93, 32, 4344);
    			attr_dev(i3, "class", "ulpgcds-btn__icon ulpgcds-icon-youtube");
    			add_location(i3, file, 108, 41, 5314);
    			add_location(span4, file, 110, 42, 5450);
    			attr_dev(a7, "href", "http://www.youtube.com/ulpgc");
    			attr_dev(a7, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file, 104, 36, 5041);
    			attr_dev(li3, "class", "youtube");
    			add_location(li3, file, 103, 32, 4984);
    			attr_dev(i4, "class", "ulpgcds-btn__icon ulpgcds-icon-linkedin");
    			add_location(i4, file, 118, 41, 5943);
    			add_location(span5, file, 120, 42, 6080);
    			attr_dev(a8, "href", "http://www.linkedin.com/groups?mostPopular=&gid=148332");
    			attr_dev(a8, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file, 114, 36, 5640);
    			attr_dev(li4, "class", "linkedin");
    			add_location(li4, file, 113, 32, 5582);
    			attr_dev(i5, "class", "ulpgcds-btn__icon ulpgcds-icon-instagram");
    			add_location(i5, file, 128, 41, 6556);
    			add_location(span6, file, 130, 42, 6694);
    			attr_dev(a9, "href", "https://www.instagram.com/ulpgc_para_ti");
    			attr_dev(a9, "class", "ulpgcds-btn ulpgcds-btn--ghost ulpgcds-btn--icon");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file, 124, 36, 6272);
    			attr_dev(li5, "class", "instagram");
    			add_location(li5, file, 123, 32, 6213);
    			add_location(ul0, file, 72, 28, 3111);
    			attr_dev(div6, "id", "block-block-2");
    			attr_dev(div6, "class", "block block-block");
    			add_location(div6, file, 70, 24, 2974);
    			attr_dev(div7, "class", "new-redes");
    			add_location(div7, file, 69, 20, 2926);
    			attr_dev(div8, "class", "col-6");
    			add_location(div8, file, 6, 16, 197);
    			add_location(h13, file, 145, 32, 7298);
    			attr_dev(a10, "href", "http://www2.ulpgc.es/index.php?pagina=presentacion&ver=contacto");
    			add_location(a10, file, 149, 40, 7435);
    			add_location(p8, file, 148, 36, 7391);
    			attr_dev(a11, "href", "/sori/sistema-quejas-sugerencias-y-felicitaciones");
    			add_location(a11, file, 156, 40, 7791);
    			add_location(p9, file, 155, 36, 7747);
    			add_location(div9, file, 147, 32, 7349);
    			attr_dev(div10, "id", "block-block-24");
    			attr_dev(div10, "class", "block block-block columna_pie");
    			add_location(div10, file, 141, 28, 7109);
    			attr_dev(div11, "class", "col-4");
    			add_location(div11, file, 140, 24, 7061);
    			add_location(h14, file, 171, 32, 8518);
    			attr_dev(a12, "href", "/campusvirtual");
    			add_location(a12, file, 175, 40, 8665);
    			add_location(p10, file, 174, 36, 8621);
    			attr_dev(a13, "href", "https://administracion.ulpgc.es/");
    			add_location(a13, file, 181, 40, 8917);
    			add_location(p11, file, 180, 36, 8873);
    			attr_dev(a14, "href", "https://mi.ulpgc.es");
    			add_location(a14, file, 188, 40, 9233);
    			add_location(p12, file, 187, 36, 9189);
    			attr_dev(a15, "href", "https://correo.ulpgc.es/");
    			add_location(a15, file, 194, 40, 9484);
    			add_location(p13, file, 193, 36, 9440);
    			attr_dev(a16, "href", "http://www.si.ulpgc.es/contacto");
    			add_location(a16, file, 200, 40, 9744);
    			add_location(p14, file, 199, 36, 9700);
    			add_location(div12, file, 173, 32, 8579);
    			attr_dev(div13, "id", "block-block-25");
    			attr_dev(div13, "class", "block block-block columna_pie");
    			add_location(div13, file, 167, 28, 8329);
    			attr_dev(div14, "class", "col-4");
    			add_location(div14, file, 166, 24, 8281);
    			add_location(h15, file, 214, 32, 10399);
    			attr_dev(a17, "href", "/sobre-esta-web/aviso-legal");
    			add_location(a17, file, 218, 40, 10533);
    			add_location(p15, file, 217, 36, 10489);
    			attr_dev(a18, "href", "/sobre-esta-web/tratamiento-datos-personales");
    			add_location(a18, file, 224, 40, 10795);
    			add_location(p16, file, 223, 36, 10751);
    			attr_dev(a19, "href", "/sobre-esta-web/cookies");
    			add_location(a19, file, 231, 40, 11126);
    			add_location(p17, file, 230, 36, 11082);
    			attr_dev(a20, "href", "/sobre-esta-web/accesibilidad");
    			add_location(a20, file, 237, 40, 11380);
    			add_location(p18, file, 236, 36, 11336);
    			attr_dev(a21, "href", "/sobre-esta-web");
    			add_location(a21, file, 243, 40, 11646);
    			add_location(p19, file, 242, 36, 11602);
    			add_location(div15, file, 216, 32, 10447);
    			attr_dev(div16, "id", "block-block-14");
    			attr_dev(div16, "class", "block block-block columna_pie ultima");
    			add_location(div16, file, 210, 28, 10203);
    			attr_dev(div17, "class", "col-4");
    			add_location(div17, file, 209, 24, 10155);
    			attr_dev(div18, "class", "row");
    			add_location(div18, file, 139, 20, 7019);
    			attr_dev(div19, "class", "col-6 align-logo");
    			add_location(div19, file, 138, 16, 6968);
    			attr_dev(div20, "class", "row");
    			add_location(div20, file, 5, 12, 163);
    			attr_dev(div21, "id", "pie_top");
    			attr_dev(div21, "class", "wrapper");
    			add_location(div21, file, 4, 8, 116);
    			add_location(span7, file, 263, 37, 12478);
    			attr_dev(a22, "href", "https://fpct.ulpgc.es");
    			attr_dev(a22, "target", "_blank");
    			add_location(a22, file, 262, 32, 12393);
    			attr_dev(li6, "class", "parque_cientifico");
    			add_location(li6, file, 261, 28, 12330);
    			add_location(span8, file, 274, 37, 13043);
    			attr_dev(a23, "href", "http://www.csocial.ulpgc.es");
    			attr_dev(a23, "target", "_blank");
    			add_location(a23, file, 271, 32, 12880);
    			attr_dev(li7, "class", "consejo_social");
    			add_location(li7, file, 270, 28, 12820);
    			add_location(span9, file, 282, 37, 13470);
    			attr_dev(a24, "href", "https://universia.net");
    			attr_dev(a24, "target", "_blank");
    			add_location(a24, file, 281, 32, 13385);
    			attr_dev(li8, "class", "universia");
    			add_location(li8, file, 280, 28, 13330);
    			add_location(span10, file, 287, 37, 13729);
    			attr_dev(a25, "href", "https://www.crue.org");
    			attr_dev(a25, "target", "_blank");
    			add_location(a25, file, 286, 32, 13645);
    			attr_dev(li9, "class", "mecenas");
    			add_location(li9, file, 285, 28, 13592);
    			attr_dev(ul1, "class", "colaboradores");
    			add_location(ul1, file, 260, 24, 12275);
    			attr_dev(div22, "class", "clearer");
    			add_location(div22, file, 291, 24, 13872);
    			attr_dev(div23, "id", "block-block-15");
    			attr_dev(div23, "class", "block block-block");
    			add_location(div23, file, 259, 20, 12199);
    			attr_dev(div24, "class", "contenido_logos clearfix");
    			add_location(div24, file, 258, 16, 12140);
    			attr_dev(div25, "class", "wrapper");
    			add_location(div25, file, 257, 12, 12102);
    			attr_dev(div26, "id", "pie_colaboradores");
    			add_location(div26, file, 256, 8, 12061);
    			add_location(p20, file, 302, 20, 14285);
    			attr_dev(div27, "id", "block-block-4");
    			attr_dev(div27, "class", "block block-block");
    			add_location(div27, file, 301, 16, 14214);
    			attr_dev(div28, "class", "wrapper");
    			add_location(div28, file, 299, 12, 14069);
    			attr_dev(div29, "id", "pie_final");
    			add_location(div29, file, 298, 8, 14036);
    			attr_dev(div30, "id", "pie_pagina");
    			attr_dev(div30, "class", "site-footer");
    			add_location(div30, file, 3, 4, 66);
    			add_location(footer, file, 2, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div30);
    			append_dev(div30, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div5);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h10);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(div1, t6);
    			append_dev(div1, p2);
    			append_dev(div1, t8);
    			append_dev(div1, p3);
    			append_dev(p3, a0);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h11);
    			append_dev(div3, t12);
    			append_dev(div3, p4);
    			append_dev(p4, strong0);
    			append_dev(p4, t14);
    			append_dev(p4, a1);
    			append_dev(div3, t16);
    			append_dev(div3, p5);
    			append_dev(p5, strong1);
    			append_dev(p5, t18);
    			append_dev(p5, a2);
    			append_dev(div3, t20);
    			append_dev(div3, p6);
    			append_dev(p6, strong2);
    			append_dev(p6, t22);
    			append_dev(div3, t23);
    			append_dev(div3, p7);
    			append_dev(p7, strong3);
    			append_dev(strong3, t24);
    			append_dev(strong3, span0);
    			append_dev(p7, t25);
    			append_dev(p7, a3);
    			append_dev(div8, t27);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, h12);
    			append_dev(div6, t29);
    			append_dev(div6, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a4);
    			append_dev(a4, i0);
    			append_dev(a4, span1);
    			append_dev(ul0, t31);
    			append_dev(ul0, li1);
    			append_dev(li1, a5);
    			append_dev(a5, i1);
    			append_dev(a5, span2);
    			append_dev(ul0, t33);
    			append_dev(ul0, li2);
    			append_dev(li2, a6);
    			append_dev(a6, i2);
    			append_dev(a6, span3);
    			append_dev(ul0, t35);
    			append_dev(ul0, li3);
    			append_dev(li3, a7);
    			append_dev(a7, i3);
    			append_dev(a7, span4);
    			append_dev(ul0, t37);
    			append_dev(ul0, li4);
    			append_dev(li4, a8);
    			append_dev(a8, i4);
    			append_dev(a8, span5);
    			append_dev(ul0, t39);
    			append_dev(ul0, li5);
    			append_dev(li5, a9);
    			append_dev(a9, i5);
    			append_dev(a9, span6);
    			append_dev(div20, t41);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div11);
    			append_dev(div11, div10);
    			append_dev(div10, h13);
    			append_dev(div10, t43);
    			append_dev(div10, div9);
    			append_dev(div9, p8);
    			append_dev(p8, a10);
    			append_dev(div9, t45);
    			append_dev(div9, p9);
    			append_dev(p9, a11);
    			append_dev(div18, t47);
    			append_dev(div18, div14);
    			append_dev(div14, div13);
    			append_dev(div13, h14);
    			append_dev(div13, t49);
    			append_dev(div13, div12);
    			append_dev(div12, p10);
    			append_dev(p10, a12);
    			append_dev(div12, t51);
    			append_dev(div12, p11);
    			append_dev(p11, a13);
    			append_dev(div12, t53);
    			append_dev(div12, p12);
    			append_dev(p12, a14);
    			append_dev(div12, t55);
    			append_dev(div12, p13);
    			append_dev(p13, a15);
    			append_dev(div12, t57);
    			append_dev(div12, p14);
    			append_dev(p14, a16);
    			append_dev(div18, t59);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, h15);
    			append_dev(div16, t61);
    			append_dev(div16, div15);
    			append_dev(div15, p15);
    			append_dev(p15, a17);
    			append_dev(div15, t63);
    			append_dev(div15, p16);
    			append_dev(p16, a18);
    			append_dev(div15, t65);
    			append_dev(div15, p17);
    			append_dev(p17, a19);
    			append_dev(div15, t67);
    			append_dev(div15, p18);
    			append_dev(p18, a20);
    			append_dev(div15, t69);
    			append_dev(div15, p19);
    			append_dev(p19, a21);
    			append_dev(div30, t71);
    			append_dev(div30, div26);
    			append_dev(div26, div25);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, ul1);
    			append_dev(ul1, li6);
    			append_dev(li6, a22);
    			append_dev(a22, span7);
    			append_dev(ul1, t73);
    			append_dev(ul1, li7);
    			append_dev(li7, a23);
    			append_dev(a23, span8);
    			append_dev(ul1, t75);
    			append_dev(ul1, li8);
    			append_dev(li8, a24);
    			append_dev(a24, span9);
    			append_dev(ul1, t77);
    			append_dev(ul1, li9);
    			append_dev(li9, a25);
    			append_dev(a25, span10);
    			append_dev(div23, t79);
    			append_dev(div23, div22);
    			append_dev(div30, t81);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, p20);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ulpgc-footer-institucional', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ulpgc-footer-institucional> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FooterInstitucional extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>@import url("https://www.ulpgc.es/modules/search/search.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/ulpgcds/js/slick/slick.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/ulpgcdsmerge.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/style.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/custom.css?rg1gmx");@import url("https://www.ulpgc.es/sites/all/themes/ulpgc/css/print.css?rg1gmx") print;</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{},
    			null
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("ulpgc-footer-institucional", FooterInstitucional);

})();
//# sourceMappingURL=ulpgc-components.js.map
