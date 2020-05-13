
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/lib/index.svelte generated by Svelte v3.22.2 */
    const file = "src/lib/index.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let div1_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Cep:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			add_location(label, file, 46, 4, 951);
    			attr_dev(input, "type", "text");
    			add_location(input, file, 47, 4, 976);
    			attr_dev(div0, "class", "form-group svelte-10mno17");
    			add_location(div0, file, 45, 2, 922);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*ClassName*/ ctx[1]) + " svelte-10mno17"));
    			add_location(div1, file, 44, 0, 896);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*cepValue*/ ctx[0]);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    				listen_dev(input, "blur", /*onBlur*/ ctx[2], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cepValue*/ 1 && input.value !== /*cepValue*/ ctx[0]) {
    				set_input_value(input, /*cepValue*/ ctx[0]);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[9], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null));
    				}
    			}

    			if (!current || dirty & /*ClassName*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*ClassName*/ ctx[1]) + " svelte-10mno17"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
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

    function instance($$self, $$props, $$invalidate) {
    	let { value } = $$props;
    	let { cepValue = "" } = $$props;
    	let { streetValue = "" } = $$props;
    	let { neighborhoodValue = "" } = $$props;
    	let { ClassName = "default" } = $$props;
    	let statusCode = 200;
    	const dispatch = createEventDispatcher();

    	function sendCallback(message) {
    		dispatch("callback", message);
    	}

    	function onBlur() {
    		if (cepValue !== "") {
    			fetch(`https://viacep.com.br/ws/${cepValue}/json/`).then(response => {
    				statusCode = response.status;
    				return response.json();
    			}).then(data => {
    				$$invalidate(3, streetValue = data.logradouro);
    				$$invalidate(4, neighborhoodValue = data.bairro);
    				sendCallback({ status: 200, data });
    			}).catch(error => {
    				sendCallback({ status: statusCode, message: error });
    			});
    		}
    	}

    	const writable_props = ["value", "cepValue", "streetValue", "neighborhoodValue", "ClassName"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lib> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Lib", $$slots, ['default']);

    	function input_input_handler() {
    		cepValue = this.value;
    		$$invalidate(0, cepValue);
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(5, value = $$props.value);
    		if ("cepValue" in $$props) $$invalidate(0, cepValue = $$props.cepValue);
    		if ("streetValue" in $$props) $$invalidate(3, streetValue = $$props.streetValue);
    		if ("neighborhoodValue" in $$props) $$invalidate(4, neighborhoodValue = $$props.neighborhoodValue);
    		if ("ClassName" in $$props) $$invalidate(1, ClassName = $$props.ClassName);
    		if ("$$scope" in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		value,
    		cepValue,
    		streetValue,
    		neighborhoodValue,
    		ClassName,
    		statusCode,
    		dispatch,
    		sendCallback,
    		onBlur
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(5, value = $$props.value);
    		if ("cepValue" in $$props) $$invalidate(0, cepValue = $$props.cepValue);
    		if ("streetValue" in $$props) $$invalidate(3, streetValue = $$props.streetValue);
    		if ("neighborhoodValue" in $$props) $$invalidate(4, neighborhoodValue = $$props.neighborhoodValue);
    		if ("ClassName" in $$props) $$invalidate(1, ClassName = $$props.ClassName);
    		if ("statusCode" in $$props) statusCode = $$props.statusCode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		cepValue,
    		ClassName,
    		onBlur,
    		streetValue,
    		neighborhoodValue,
    		value,
    		statusCode,
    		dispatch,
    		sendCallback,
    		$$scope,
    		$$slots,
    		input_input_handler
    	];
    }

    class Lib extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			value: 5,
    			cepValue: 0,
    			streetValue: 3,
    			neighborhoodValue: 4,
    			ClassName: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lib",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[5] === undefined && !("value" in props)) {
    			console.warn("<Lib> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cepValue() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cepValue(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get streetValue() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set streetValue(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get neighborhoodValue() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set neighborhoodValue(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ClassName() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ClassName(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/AdressAutocomplete.svelte generated by Svelte v3.22.2 */
    const file$1 = "src/lib/AdressAutocomplete.svelte";
    const get_cep_slot_changes = dirty => ({});
    const get_cep_slot_context = ctx => ({});

    // (49:19)     
    function fallback_block(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "missing");
    			add_location(input, file$1, 49, 3, 1005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(49:19)     ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let input0;
    	let t0;
    	let div0;
    	let t1;
    	let input1;
    	let t2;
    	let input2;
    	let current;
    	let dispose;
    	const cep_slot_template = /*$$slots*/ ctx[9].cep;
    	const cep_slot = create_slot(cep_slot_template, ctx, /*$$scope*/ ctx[8], get_cep_slot_context);
    	const cep_slot_or_fallback = cep_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			div0 = element("div");
    			if (cep_slot_or_fallback) cep_slot_or_fallback.c();
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			input2 = element("input");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$1, 45, 2, 896);
    			attr_dev(div0, "class", "from-group");
    			add_location(div0, file$1, 47, 1, 957);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$1, 53, 2, 1052);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$1, 54, 2, 1099);
    			attr_dev(div1, "class", /*ClassName*/ ctx[3]);
    			add_location(div1, file$1, 43, 0, 869);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input0);
    			set_input_value(input0, /*cepValue*/ ctx[0]);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			if (cep_slot_or_fallback) {
    				cep_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*streetValue*/ ctx[1]);
    			append_dev(div1, t2);
    			append_dev(div1, input2);
    			set_input_value(input2, /*neighborhoodValue*/ ctx[2]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    				listen_dev(input0, "blur", /*onBlur*/ ctx[4], false, false, false),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[12])
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cepValue*/ 1 && input0.value !== /*cepValue*/ ctx[0]) {
    				set_input_value(input0, /*cepValue*/ ctx[0]);
    			}

    			if (cep_slot) {
    				if (cep_slot.p && dirty & /*$$scope*/ 256) {
    					cep_slot.p(get_slot_context(cep_slot_template, ctx, /*$$scope*/ ctx[8], get_cep_slot_context), get_slot_changes(cep_slot_template, /*$$scope*/ ctx[8], dirty, get_cep_slot_changes));
    				}
    			}

    			if (dirty & /*streetValue*/ 2 && input1.value !== /*streetValue*/ ctx[1]) {
    				set_input_value(input1, /*streetValue*/ ctx[1]);
    			}

    			if (dirty & /*neighborhoodValue*/ 4 && input2.value !== /*neighborhoodValue*/ ctx[2]) {
    				set_input_value(input2, /*neighborhoodValue*/ ctx[2]);
    			}

    			if (!current || dirty & /*ClassName*/ 8) {
    				attr_dev(div1, "class", /*ClassName*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cep_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cep_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (cep_slot_or_fallback) cep_slot_or_fallback.d(detaching);
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { cepValue = "" } = $$props;
    	let { streetValue = "" } = $$props;
    	let { neighborhoodValue = "" } = $$props;
    	let { ClassName = "default" } = $$props;
    	let statusCode = 200;
    	const dispatch = createEventDispatcher();

    	function sendCallback(message) {
    		dispatch("callback", message);
    	}

    	function onBlur() {
    		if (cepValue !== "") {
    			fetch(`https://viacep.com.br/ws/${cepValue}/json/`).then(response => {
    				statusCode = response.status;
    				return response.json();
    			}).then(data => {
    				$$invalidate(1, streetValue = data.logradouro);
    				$$invalidate(2, neighborhoodValue = data.bairro);
    				sendCallback({ status: 200, data });
    			}).catch(error => {
    				sendCallback({ status: 400, message: error });
    			});
    		}
    	}

    	const writable_props = ["cepValue", "streetValue", "neighborhoodValue", "ClassName"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AdressAutocomplete> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AdressAutocomplete", $$slots, ['cep']);

    	function input0_input_handler() {
    		cepValue = this.value;
    		$$invalidate(0, cepValue);
    	}

    	function input1_input_handler() {
    		streetValue = this.value;
    		$$invalidate(1, streetValue);
    	}

    	function input2_input_handler() {
    		neighborhoodValue = this.value;
    		$$invalidate(2, neighborhoodValue);
    	}

    	$$self.$set = $$props => {
    		if ("cepValue" in $$props) $$invalidate(0, cepValue = $$props.cepValue);
    		if ("streetValue" in $$props) $$invalidate(1, streetValue = $$props.streetValue);
    		if ("neighborhoodValue" in $$props) $$invalidate(2, neighborhoodValue = $$props.neighborhoodValue);
    		if ("ClassName" in $$props) $$invalidate(3, ClassName = $$props.ClassName);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		cepValue,
    		streetValue,
    		neighborhoodValue,
    		ClassName,
    		statusCode,
    		dispatch,
    		sendCallback,
    		onBlur
    	});

    	$$self.$inject_state = $$props => {
    		if ("cepValue" in $$props) $$invalidate(0, cepValue = $$props.cepValue);
    		if ("streetValue" in $$props) $$invalidate(1, streetValue = $$props.streetValue);
    		if ("neighborhoodValue" in $$props) $$invalidate(2, neighborhoodValue = $$props.neighborhoodValue);
    		if ("ClassName" in $$props) $$invalidate(3, ClassName = $$props.ClassName);
    		if ("statusCode" in $$props) statusCode = $$props.statusCode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		cepValue,
    		streetValue,
    		neighborhoodValue,
    		ClassName,
    		onBlur,
    		statusCode,
    		dispatch,
    		sendCallback,
    		$$scope,
    		$$slots,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class AdressAutocomplete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			cepValue: 0,
    			streetValue: 1,
    			neighborhoodValue: 2,
    			ClassName: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdressAutocomplete",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get cepValue() {
    		throw new Error("<AdressAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cepValue(value) {
    		throw new Error("<AdressAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get streetValue() {
    		throw new Error("<AdressAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set streetValue(value) {
    		throw new Error("<AdressAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get neighborhoodValue() {
    		throw new Error("<AdressAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set neighborhoodValue(value) {
    		throw new Error("<AdressAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ClassName() {
    		throw new Error("<AdressAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ClassName(value) {
    		throw new Error("<AdressAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/dev/App.svelte generated by Svelte v3.22.2 */
    const file$2 = "src/dev/App.svelte";

    // (25:4) <AdressAutocomplete on:callback={handleCallback} ClassName="newName">
    function create_default_slot_1(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Rua:";
    			t1 = space();
    			input = element("input");
    			add_location(label, file$2, 26, 8, 552);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "rua");
    			add_location(input, file$2, 27, 8, 581);
    			attr_dev(div, "class", "form-group svelte-176uubx");
    			add_location(div, file$2, 25, 6, 519);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*autocompleteObj*/ ctx[1].logradouro);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*autocompleteObj*/ 2 && input.value !== /*autocompleteObj*/ ctx[1].logradouro) {
    				set_input_value(input, /*autocompleteObj*/ ctx[1].logradouro);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(25:4) <AdressAutocomplete on:callback={handleCallback} ClassName=\\\"newName\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:4) <input type="password" bind:value={cepValue} slot="inputcep">
    function create_inputcep_slot(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "password");
    			attr_dev(input, "slot", "inputcep");
    			add_location(input, file$2, 34, 4, 785);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*cepValue*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[6]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cepValue*/ 1 && input.value !== /*cepValue*/ ctx[0]) {
    				set_input_value(input, /*cepValue*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_inputcep_slot.name,
    		type: "slot",
    		source: "(35:4) <input type=\\\"password\\\" bind:value={cepValue} slot=\\\"inputcep\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let div;
    	let h10;
    	let t1;
    	let t2;
    	let h11;
    	let t4;
    	let current;

    	const adressautocomplete = new Lib({
    			props: {
    				ClassName: "newName",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	adressautocomplete.$on("callback", /*handleCallback*/ ctx[2]);

    	const adressautocompletetwo = new AdressAutocomplete({
    			props: {
    				$$slots: { inputcep: [create_inputcep_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	adressautocompletetwo.$on("callback", /*handleCallbackTwo*/ ctx[3]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Teste 1";
    			t1 = space();
    			create_component(adressautocomplete.$$.fragment);
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "Teste 2";
    			t4 = space();
    			create_component(adressautocompletetwo.$$.fragment);
    			add_location(h10, file$2, 23, 4, 420);
    			attr_dev(div, "class", "row svelte-176uubx");
    			add_location(div, file$2, 22, 2, 398);
    			add_location(h11, file$2, 32, 2, 705);
    			attr_dev(main, "class", "svelte-176uubx");
    			add_location(main, file$2, 21, 0, 389);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			mount_component(adressautocomplete, div, null);
    			append_dev(main, t2);
    			append_dev(main, h11);
    			append_dev(main, t4);
    			mount_component(adressautocompletetwo, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const adressautocomplete_changes = {};

    			if (dirty & /*$$scope, autocompleteObj*/ 130) {
    				adressautocomplete_changes.$$scope = { dirty, ctx };
    			}

    			adressautocomplete.$set(adressautocomplete_changes);
    			const adressautocompletetwo_changes = {};

    			if (dirty & /*$$scope, cepValue*/ 129) {
    				adressautocompletetwo_changes.$$scope = { dirty, ctx };
    			}

    			adressautocompletetwo.$set(adressautocompletetwo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(adressautocomplete.$$.fragment, local);
    			transition_in(adressautocompletetwo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(adressautocomplete.$$.fragment, local);
    			transition_out(adressautocompletetwo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(adressautocomplete);
    			destroy_component(adressautocompletetwo);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let cepValue = "";
    	let streetValue = "";
    	let autocompleteObj = {};

    	function handleCallback(event) {
    		$$invalidate(1, autocompleteObj = event.detail.data);
    	}

    	function handleCallbackTwo(event) {
    		$$invalidate(1, autocompleteObj = event.detail.data);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		autocompleteObj.logradouro = this.value;
    		$$invalidate(1, autocompleteObj);
    	}

    	function input_input_handler_1() {
    		cepValue = this.value;
    		$$invalidate(0, cepValue);
    	}

    	$$self.$capture_state = () => ({
    		AdressAutocomplete: Lib,
    		AdressAutocompleteTwo: AdressAutocomplete,
    		cepValue,
    		streetValue,
    		autocompleteObj,
    		handleCallback,
    		handleCallbackTwo
    	});

    	$$self.$inject_state = $$props => {
    		if ("cepValue" in $$props) $$invalidate(0, cepValue = $$props.cepValue);
    		if ("streetValue" in $$props) streetValue = $$props.streetValue;
    		if ("autocompleteObj" in $$props) $$invalidate(1, autocompleteObj = $$props.autocompleteObj);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		cepValue,
    		autocompleteObj,
    		handleCallback,
    		handleCallbackTwo,
    		streetValue,
    		input_input_handler,
    		input_input_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: "world"
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
