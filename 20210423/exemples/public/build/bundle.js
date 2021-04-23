
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
  class Adder {
    constructor() {
      this._partials = new Float64Array(32);
      this._n = 0;
    }
    add(x) {
      const p = this._partials;
      let i = 0;
      for (let j = 0; j < this._n && j < 32; j++) {
        const y = p[j],
          hi = x + y,
          lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
        if (lo) p[i++] = lo;
        x = hi;
      }
      p[i] = x;
      this._n = i + 1;
      return this;
    }
    valueOf() {
      const p = this._partials;
      let n = this._n, x, y, lo, hi = 0;
      if (n > 0) {
        hi = p[--n];
        while (n > 0) {
          x = hi;
          y = p[--n];
          hi = x + y;
          lo = y - (hi - x);
          if (lo) break;
        }
        if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
          y = lo * 2;
          x = hi + y;
          if (y == x - hi) hi = x;
        }
      }
      return hi;
    }
  }

  function* flatten(arrays) {
    for (const array of arrays) {
      yield* array;
    }
  }

  function merge(arrays) {
    return Array.from(flatten(arrays));
  }

  var noop$1 = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames$1(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames$1(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get$1(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$1(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array(group);
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection$1(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return this.children;
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$1(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection$1(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {
    if (!(selection instanceof Selection$1)) throw new Error("invalid merge");

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection$1(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection$1(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS$1(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction$1(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS$1(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction$1(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove$1 : typeof value === "function"
              ? styleFunction$1
              : styleConstant$1)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction$1
            : textConstant$1)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection$1(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection$1([[document.documentElement]], root);
  }

  function selection_selection() {
    return this;
  }

  Selection$1.prototype = selection.prototype = {
    constructor: Selection$1,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
        : new Selection$1([[selector]], root);
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }

  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var constant = x => () => x;

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var degrees$1 = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees$1,
      skewX: Math.atan(skewX) * degrees$1,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var svgNode;

  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var frame = 0, // is an animation frame pending?
      timeout$1 = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout$1 = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout$1) timeout$1 = clearTimeout(timeout$1);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection = selection.prototype.constructor;

  function transition_selection() {
    return new Selection(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction(tweenValue(this, "text", value))
        : textConstant(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  var epsilon = 1e-6;
  var epsilon2 = 1e-12;
  var pi = Math.PI;
  var halfPi = pi / 2;
  var quarterPi = pi / 4;
  var tau = pi * 2;

  var degrees = 180 / pi;
  var radians = pi / 180;

  var abs = Math.abs;
  var atan = Math.atan;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var sin = Math.sin;
  var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  var sqrt = Math.sqrt;

  function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
  }

  function asin(x) {
    return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
  }

  function noop() {}

  function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
      streamGeometryType[geometry.type](geometry, stream);
    }
  }

  var streamObjectType = {
    Feature: function(object, stream) {
      streamGeometry(object.geometry, stream);
    },
    FeatureCollection: function(object, stream) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) streamGeometry(features[i].geometry, stream);
    }
  };

  var streamGeometryType = {
    Sphere: function(object, stream) {
      stream.sphere();
    },
    Point: function(object, stream) {
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
    },
    LineString: function(object, stream) {
      streamLine(object.coordinates, stream, 0);
    },
    MultiLineString: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamLine(coordinates[i], stream, 0);
    },
    Polygon: function(object, stream) {
      streamPolygon(object.coordinates, stream);
    },
    MultiPolygon: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamPolygon(coordinates[i], stream);
    },
    GeometryCollection: function(object, stream) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) streamGeometry(geometries[i], stream);
    }
  };

  function streamLine(coordinates, stream, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    stream.lineStart();
    while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    stream.lineEnd();
  }

  function streamPolygon(coordinates, stream) {
    var i = -1, n = coordinates.length;
    stream.polygonStart();
    while (++i < n) streamLine(coordinates[i], stream, 1);
    stream.polygonEnd();
  }

  function geoStream(object, stream) {
    if (object && streamObjectType.hasOwnProperty(object.type)) {
      streamObjectType[object.type](object, stream);
    } else {
      streamGeometry(object, stream);
    }
  }

  function spherical(cartesian) {
    return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
  }

  function cartesian(spherical) {
    var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
    return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
  }

  function cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cartesianCross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  // TODO return a
  function cartesianAddInPlace(a, b) {
    a[0] += b[0], a[1] += b[1], a[2] += b[2];
  }

  function cartesianScale(vector, k) {
    return [vector[0] * k, vector[1] * k, vector[2] * k];
  }

  // TODO return d
  function cartesianNormalizeInPlace(d) {
    var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l, d[1] /= l, d[2] /= l;
  }

  function compose(a, b) {

    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }

    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };

    return compose;
  }

  function rotationIdentity(lambda, phi) {
    return [abs(lambda) > pi ? lambda + Math.round(-lambda / tau) * tau : lambda, phi];
  }

  rotationIdentity.invert = rotationIdentity;

  function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
    return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
      : rotationLambda(deltaLambda))
      : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
      : rotationIdentity);
  }

  function forwardRotationLambda(deltaLambda) {
    return function(lambda, phi) {
      return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
    };
  }

  function rotationLambda(deltaLambda) {
    var rotation = forwardRotationLambda(deltaLambda);
    rotation.invert = forwardRotationLambda(-deltaLambda);
    return rotation;
  }

  function rotationPhiGamma(deltaPhi, deltaGamma) {
    var cosDeltaPhi = cos(deltaPhi),
        sinDeltaPhi = sin(deltaPhi),
        cosDeltaGamma = cos(deltaGamma),
        sinDeltaGamma = sin(deltaGamma);

    function rotation(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaPhi + x * sinDeltaPhi;
      return [
        atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
        asin(k * cosDeltaGamma + y * sinDeltaGamma)
      ];
    }

    rotation.invert = function(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaGamma - y * sinDeltaGamma;
      return [
        atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
        asin(k * cosDeltaPhi - x * sinDeltaPhi)
      ];
    };

    return rotation;
  }

  // Generates a circle centered at [0°, 0°], with a given radius and precision.
  function circleStream(stream, radius, delta, direction, t0, t1) {
    if (!delta) return;
    var cosRadius = cos(radius),
        sinRadius = sin(radius),
        step = direction * delta;
    if (t0 == null) {
      t0 = radius + direction * tau;
      t1 = radius - step / 2;
    } else {
      t0 = circleRadius(cosRadius, t0);
      t1 = circleRadius(cosRadius, t1);
      if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
    }
    for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
      point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
      stream.point(point[0], point[1]);
    }
  }

  // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
  function circleRadius(cosRadius, point) {
    point = cartesian(point), point[0] -= cosRadius;
    cartesianNormalizeInPlace(point);
    var radius = acos(-point[1]);
    return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
  }

  function clipBuffer() {
    var lines = [],
        line;
    return {
      point: function(x, y, m) {
        line.push([x, y, m]);
      },
      lineStart: function() {
        lines.push(line = []);
      },
      lineEnd: noop,
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      },
      result: function() {
        var result = lines;
        lines = [];
        line = null;
        return result;
      }
    };
  }

  function pointEqual(a, b) {
    return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
  }

  function Intersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other; // another intersection
    this.e = entry; // is an entry?
    this.v = false; // visited
    this.n = this.p = null; // next & previous
  }

  // A generalized polygon clipping algorithm: given a polygon that has been cut
  // into its visible line segments, and rejoins the segments by interpolating
  // along the clip edge.
  function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
    var subject = [],
        clip = [],
        i,
        n;

    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n], x;

      if (pointEqual(p0, p1)) {
        if (!p0[2] && !p1[2]) {
          stream.lineStart();
          for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
          stream.lineEnd();
          return;
        }
        // handle degenerate cases by moving the point
        p1[0] += 2 * epsilon;
      }

      subject.push(x = new Intersection(p0, segment, null, true));
      clip.push(x.o = new Intersection(p0, null, x, false));
      subject.push(x = new Intersection(p1, segment, null, false));
      clip.push(x.o = new Intersection(p1, null, x, true));
    });

    if (!subject.length) return;

    clip.sort(compareIntersection);
    link(subject);
    link(clip);

    for (i = 0, n = clip.length; i < n; ++i) {
      clip[i].e = startInside = !startInside;
    }

    var start = subject[0],
        points,
        point;

    while (1) {
      // Find first unvisited intersection.
      var current = start,
          isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      stream.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, stream);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, stream);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      stream.lineEnd();
    }
  }

  function link(array) {
    if (!(n = array.length)) return;
    var n,
        i = 0,
        a = array[0],
        b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }

  function longitude(point) {
    if (abs(point[0]) <= pi)
      return point[0];
    else
      return sign(point[0]) * ((abs(point[0]) + pi) % tau - pi);
  }

  function polygonContains(polygon, point) {
    var lambda = longitude(point),
        phi = point[1],
        sinPhi = sin(phi),
        normal = [sin(lambda), -cos(lambda), 0],
        angle = 0,
        winding = 0;

    var sum = new Adder();

    if (sinPhi === 1) phi = halfPi + epsilon;
    else if (sinPhi === -1) phi = -halfPi - epsilon;

    for (var i = 0, n = polygon.length; i < n; ++i) {
      if (!(m = (ring = polygon[i]).length)) continue;
      var ring,
          m,
          point0 = ring[m - 1],
          lambda0 = longitude(point0),
          phi0 = point0[1] / 2 + quarterPi,
          sinPhi0 = sin(phi0),
          cosPhi0 = cos(phi0);

      for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
        var point1 = ring[j],
            lambda1 = longitude(point1),
            phi1 = point1[1] / 2 + quarterPi,
            sinPhi1 = sin(phi1),
            cosPhi1 = cos(phi1),
            delta = lambda1 - lambda0,
            sign = delta >= 0 ? 1 : -1,
            absDelta = sign * delta,
            antimeridian = absDelta > pi,
            k = sinPhi0 * sinPhi1;

        sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
        angle += antimeridian ? delta + sign * tau : delta;

        // Are the longitudes either side of the point’s meridian (lambda),
        // and are the latitudes smaller than the parallel (phi)?
        if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
          var arc = cartesianCross(cartesian(point0), cartesian(point1));
          cartesianNormalizeInPlace(arc);
          var intersection = cartesianCross(normal, arc);
          cartesianNormalizeInPlace(intersection);
          var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
          if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
            winding += antimeridian ^ delta >= 0 ? 1 : -1;
          }
        }
      }
    }

    // First, determine whether the South pole is inside or outside:
    //
    // It is inside if:
    // * the polygon winds around it in a clockwise direction.
    // * the polygon does not (cumulatively) wind around it, but has a negative
    //   (counter-clockwise) area.
    //
    // Second, count the (signed) number of times a segment crosses a lambda
    // from the point to the South pole.  If it is zero, then the point is the
    // same side as the South pole.

    return (angle < -epsilon || angle < epsilon && sum < -epsilon2) ^ (winding & 1);
  }

  function clip(pointVisible, clipLine, interpolate, start) {
    return function(sink) {
      var line = clipLine(sink),
          ringBuffer = clipBuffer(),
          ringSink = clipLine(ringBuffer),
          polygonStarted = false,
          polygon,
          segments,
          ring;

      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = merge(segments);
          var startInside = polygonContains(polygon, start);
          if (segments.length) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            clipRejoin(segments, compareIntersection, startInside, interpolate, sink);
          } else if (startInside) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            interpolate(null, null, 1, sink);
            sink.lineEnd();
          }
          if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          sink.polygonStart();
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
          sink.polygonEnd();
        }
      };

      function point(lambda, phi) {
        if (pointVisible(lambda, phi)) sink.point(lambda, phi);
      }

      function pointLine(lambda, phi) {
        line.point(lambda, phi);
      }

      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }

      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }

      function pointRing(lambda, phi) {
        ring.push([lambda, phi]);
        ringSink.point(lambda, phi);
      }

      function ringStart() {
        ringSink.lineStart();
        ring = [];
      }

      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringSink.lineEnd();

        var clean = ringSink.clean(),
            ringSegments = ringBuffer.result(),
            i, n = ringSegments.length, m,
            segment,
            point;

        ring.pop();
        polygon.push(ring);
        ring = null;

        if (!n) return;

        // No intersections.
        if (clean & 1) {
          segment = ringSegments[0];
          if ((m = segment.length - 1) > 0) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
            sink.lineEnd();
          }
          return;
        }

        // Rejoin connected segments.
        // TODO reuse ringBuffer.rejoin()?
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

        segments.push(ringSegments.filter(validSegment));
      }

      return clip;
    };
  }

  function validSegment(segment) {
    return segment.length > 1;
  }

  // Intersections are sorted along the clip edge. For both antimeridian cutting
  // and circle clipping, the same comparison is used.
  function compareIntersection(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
         - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
  }

  var clipAntimeridian = clip(
    function() { return true; },
    clipAntimeridianLine,
    clipAntimeridianInterpolate,
    [-pi, -halfPi]
  );

  // Takes a line and cuts into visible segments. Return values: 0 - there were
  // intersections or the line was empty; 1 - no intersections; 2 - there were
  // intersections, and the first and last segments should be rejoined.
  function clipAntimeridianLine(stream) {
    var lambda0 = NaN,
        phi0 = NaN,
        sign0 = NaN,
        clean; // no intersections

    return {
      lineStart: function() {
        stream.lineStart();
        clean = 1;
      },
      point: function(lambda1, phi1) {
        var sign1 = lambda1 > 0 ? pi : -pi,
            delta = abs(lambda1 - lambda0);
        if (abs(delta - pi) < epsilon) { // line crosses a pole
          stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          stream.point(lambda1, phi0);
          clean = 0;
        } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
          if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
          if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
          phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          clean = 0;
        }
        stream.point(lambda0 = lambda1, phi0 = phi1);
        sign0 = sign1;
      },
      lineEnd: function() {
        stream.lineEnd();
        lambda0 = phi0 = NaN;
      },
      clean: function() {
        return 2 - clean; // if intersections, rejoin first and last segments
      }
    };
  }

  function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
    var cosPhi0,
        cosPhi1,
        sinLambda0Lambda1 = sin(lambda0 - lambda1);
    return abs(sinLambda0Lambda1) > epsilon
        ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
            - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
            / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
        : (phi0 + phi1) / 2;
  }

  function clipAntimeridianInterpolate(from, to, direction, stream) {
    var phi;
    if (from == null) {
      phi = direction * halfPi;
      stream.point(-pi, phi);
      stream.point(0, phi);
      stream.point(pi, phi);
      stream.point(pi, 0);
      stream.point(pi, -phi);
      stream.point(0, -phi);
      stream.point(-pi, -phi);
      stream.point(-pi, 0);
      stream.point(-pi, phi);
    } else if (abs(from[0] - to[0]) > epsilon) {
      var lambda = from[0] < to[0] ? pi : -pi;
      phi = direction * lambda / 2;
      stream.point(-lambda, phi);
      stream.point(0, phi);
      stream.point(lambda, phi);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function clipCircle(radius) {
    var cr = cos(radius),
        delta = 6 * radians,
        smallRadius = cr > 0,
        notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

    function interpolate(from, to, direction, stream) {
      circleStream(stream, radius, delta, direction, from, to);
    }

    function visible(lambda, phi) {
      return cos(lambda) * cos(phi) > cr;
    }

    // Takes a line and cuts into visible segments. Return values used for polygon
    // clipping: 0 - there were intersections or the line was empty; 1 - no
    // intersections 2 - there were intersections, and the first and last segments
    // should be rejoined.
    function clipLine(stream) {
      var point0, // previous point
          c0, // code for previous point
          v0, // visibility of previous point
          v00, // visibility of first point
          clean; // no intersections
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(lambda, phi) {
          var point1 = [lambda, phi],
              point2,
              v = visible(lambda, phi),
              c = smallRadius
                ? v ? 0 : code(lambda, phi)
                : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
          if (!point0 && (v00 = v0 = v)) stream.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2))
              point1[2] = 1;
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              // outside going in
              stream.lineStart();
              point2 = intersect(point1, point0);
              stream.point(point2[0], point2[1]);
            } else {
              // inside going out
              point2 = intersect(point0, point1);
              stream.point(point2[0], point2[1], 2);
              stream.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            // If the codes for two points are different, or are both zero,
            // and there this segment intersects with the small circle.
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                stream.lineStart();
                stream.point(t[0][0], t[0][1]);
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
              } else {
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
                stream.lineStart();
                stream.point(t[0][0], t[0][1], 3);
              }
            }
          }
          if (v && (!point0 || !pointEqual(point0, point1))) {
            stream.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) stream.lineEnd();
          point0 = null;
        },
        // Rejoin first and last segments if there were intersections and the first
        // and last points were visible.
        clean: function() {
          return clean | ((v00 && v0) << 1);
        }
      };
    }

    // Intersects the great circle between a and b with the clip circle.
    function intersect(a, b, two) {
      var pa = cartesian(a),
          pb = cartesian(b);

      // We have two planes, n1.p = d1 and n2.p = d2.
      // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
      var n1 = [1, 0, 0], // normal
          n2 = cartesianCross(pa, pb),
          n2n2 = cartesianDot(n2, n2),
          n1n2 = n2[0], // cartesianDot(n1, n2),
          determinant = n2n2 - n1n2 * n1n2;

      // Two polar points.
      if (!determinant) return !two && a;

      var c1 =  cr * n2n2 / determinant,
          c2 = -cr * n1n2 / determinant,
          n1xn2 = cartesianCross(n1, n2),
          A = cartesianScale(n1, c1),
          B = cartesianScale(n2, c2);
      cartesianAddInPlace(A, B);

      // Solve |p(t)|^2 = 1.
      var u = n1xn2,
          w = cartesianDot(A, u),
          uu = cartesianDot(u, u),
          t2 = w * w - uu * (cartesianDot(A, A) - 1);

      if (t2 < 0) return;

      var t = sqrt(t2),
          q = cartesianScale(u, (-w - t) / uu);
      cartesianAddInPlace(q, A);
      q = spherical(q);

      if (!two) return q;

      // Two intersection points.
      var lambda0 = a[0],
          lambda1 = b[0],
          phi0 = a[1],
          phi1 = b[1],
          z;

      if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

      var delta = lambda1 - lambda0,
          polar = abs(delta - pi) < epsilon,
          meridian = polar || delta < epsilon;

      if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

      // Check that the first point is between a and b.
      if (meridian
          ? polar
            ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
            : phi0 <= q[1] && q[1] <= phi1
          : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
        var q1 = cartesianScale(u, (-w + t) / uu);
        cartesianAddInPlace(q1, A);
        return [q, spherical(q1)];
      }
    }

    // Generates a 4-bit vector representing the location of a point relative to
    // the small circle's bounding box.
    function code(lambda, phi) {
      var r = smallRadius ? radius : pi - radius,
          code = 0;
      if (lambda < -r) code |= 1; // left
      else if (lambda > r) code |= 2; // right
      if (phi < -r) code |= 4; // below
      else if (phi > r) code |= 8; // above
      return code;
    }

    return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
  }

  function clipLine(a, b, x0, y0, x1, y1) {
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1],
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay,
        r;

    r = x0 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dx > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }

    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dx > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }

    r = y0 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dy > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }

    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dy > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }

    if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
    if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
    return true;
  }

  var clipMax = 1e9, clipMin = -clipMax;

  // TODO Use d3-polygon’s polygonContains here for the ring check?
  // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

  function clipRectangle(x0, y0, x1, y1) {

    function visible(x, y) {
      return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    }

    function interpolate(from, to, direction, stream) {
      var a = 0, a1 = 0;
      if (from == null
          || (a = corner(from, direction)) !== (a1 = corner(to, direction))
          || comparePoint(from, to) < 0 ^ direction > 0) {
        do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
        while ((a = (a + direction + 4) % 4) !== a1);
      } else {
        stream.point(to[0], to[1]);
      }
    }

    function corner(p, direction) {
      return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
          : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
          : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
          : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
    }

    function compareIntersection(a, b) {
      return comparePoint(a.x, b.x);
    }

    function comparePoint(a, b) {
      var ca = corner(a, 1),
          cb = corner(b, 1);
      return ca !== cb ? ca - cb
          : ca === 0 ? b[1] - a[1]
          : ca === 1 ? a[0] - b[0]
          : ca === 2 ? a[1] - b[1]
          : b[0] - a[0];
    }

    return function(stream) {
      var activeStream = stream,
          bufferStream = clipBuffer(),
          segments,
          polygon,
          ring,
          x__, y__, v__, // first point
          x_, y_, v_, // previous point
          first,
          clean;

      var clipStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: polygonStart,
        polygonEnd: polygonEnd
      };

      function point(x, y) {
        if (visible(x, y)) activeStream.point(x, y);
      }

      function polygonInside() {
        var winding = 0;

        for (var i = 0, n = polygon.length; i < n; ++i) {
          for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
            a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
            if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
            else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
          }
        }

        return winding;
      }

      // Buffer geometry within a polygon and then clip it en masse.
      function polygonStart() {
        activeStream = bufferStream, segments = [], polygon = [], clean = true;
      }

      function polygonEnd() {
        var startInside = polygonInside(),
            cleanInside = clean && startInside,
            visible = (segments = merge(segments)).length;
        if (cleanInside || visible) {
          stream.polygonStart();
          if (cleanInside) {
            stream.lineStart();
            interpolate(null, null, 1, stream);
            stream.lineEnd();
          }
          if (visible) {
            clipRejoin(segments, compareIntersection, startInside, interpolate, stream);
          }
          stream.polygonEnd();
        }
        activeStream = stream, segments = polygon = ring = null;
      }

      function lineStart() {
        clipStream.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }

      // TODO rather than special-case polygons, simply handle them separately.
      // Ideally, coincident intersection points should be jittered to avoid
      // clipping issues.
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferStream.rejoin();
          segments.push(bufferStream.result());
        }
        clipStream.point = point;
        if (v_) activeStream.lineEnd();
      }

      function linePoint(x, y) {
        var v = visible(x, y);
        if (polygon) ring.push([x, y]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
          }
        } else {
          if (v && v_) activeStream.point(x, y);
          else {
            var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
                b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
            if (clipLine(a, b, x0, y0, x1, y1)) {
              if (!v_) {
                activeStream.lineStart();
                activeStream.point(a[0], a[1]);
              }
              activeStream.point(b[0], b[1]);
              if (!v) activeStream.lineEnd();
              clean = false;
            } else if (v) {
              activeStream.lineStart();
              activeStream.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }

      return clipStream;
    };
  }

  var identity = x => x;

  var areaSum = new Adder(),
      areaRingSum = new Adder(),
      x00$2,
      y00$2,
      x0$3,
      y0$3;

  var areaStream = {
    point: noop,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: function() {
      areaStream.lineStart = areaRingStart;
      areaStream.lineEnd = areaRingEnd;
    },
    polygonEnd: function() {
      areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop;
      areaSum.add(abs(areaRingSum));
      areaRingSum = new Adder();
    },
    result: function() {
      var area = areaSum / 2;
      areaSum = new Adder();
      return area;
    }
  };

  function areaRingStart() {
    areaStream.point = areaPointFirst;
  }

  function areaPointFirst(x, y) {
    areaStream.point = areaPoint;
    x00$2 = x0$3 = x, y00$2 = y0$3 = y;
  }

  function areaPoint(x, y) {
    areaRingSum.add(y0$3 * x - x0$3 * y);
    x0$3 = x, y0$3 = y;
  }

  function areaRingEnd() {
    areaPoint(x00$2, y00$2);
  }

  var x0$2 = Infinity,
      y0$2 = x0$2,
      x1 = -x0$2,
      y1 = x1;

  var boundsStream = {
    point: boundsPoint,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: noop,
    polygonEnd: noop,
    result: function() {
      var bounds = [[x0$2, y0$2], [x1, y1]];
      x1 = y1 = -(y0$2 = x0$2 = Infinity);
      return bounds;
    }
  };

  function boundsPoint(x, y) {
    if (x < x0$2) x0$2 = x;
    if (x > x1) x1 = x;
    if (y < y0$2) y0$2 = y;
    if (y > y1) y1 = y;
  }

  // TODO Enforce positive area for exterior, negative area for interior?

  var X0 = 0,
      Y0 = 0,
      Z0 = 0,
      X1 = 0,
      Y1 = 0,
      Z1 = 0,
      X2 = 0,
      Y2 = 0,
      Z2 = 0,
      x00$1,
      y00$1,
      x0$1,
      y0$1;

  var centroidStream = {
    point: centroidPoint,
    lineStart: centroidLineStart,
    lineEnd: centroidLineEnd,
    polygonStart: function() {
      centroidStream.lineStart = centroidRingStart;
      centroidStream.lineEnd = centroidRingEnd;
    },
    polygonEnd: function() {
      centroidStream.point = centroidPoint;
      centroidStream.lineStart = centroidLineStart;
      centroidStream.lineEnd = centroidLineEnd;
    },
    result: function() {
      var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
          : Z1 ? [X1 / Z1, Y1 / Z1]
          : Z0 ? [X0 / Z0, Y0 / Z0]
          : [NaN, NaN];
      X0 = Y0 = Z0 =
      X1 = Y1 = Z1 =
      X2 = Y2 = Z2 = 0;
      return centroid;
    }
  };

  function centroidPoint(x, y) {
    X0 += x;
    Y0 += y;
    ++Z0;
  }

  function centroidLineStart() {
    centroidStream.point = centroidPointFirstLine;
  }

  function centroidPointFirstLine(x, y) {
    centroidStream.point = centroidPointLine;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function centroidPointLine(x, y) {
    var dx = x - x0$1, dy = y - y0$1, z = sqrt(dx * dx + dy * dy);
    X1 += z * (x0$1 + x) / 2;
    Y1 += z * (y0$1 + y) / 2;
    Z1 += z;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function centroidLineEnd() {
    centroidStream.point = centroidPoint;
  }

  function centroidRingStart() {
    centroidStream.point = centroidPointFirstRing;
  }

  function centroidRingEnd() {
    centroidPointRing(x00$1, y00$1);
  }

  function centroidPointFirstRing(x, y) {
    centroidStream.point = centroidPointRing;
    centroidPoint(x00$1 = x0$1 = x, y00$1 = y0$1 = y);
  }

  function centroidPointRing(x, y) {
    var dx = x - x0$1,
        dy = y - y0$1,
        z = sqrt(dx * dx + dy * dy);

    X1 += z * (x0$1 + x) / 2;
    Y1 += z * (y0$1 + y) / 2;
    Z1 += z;

    z = y0$1 * x - x0$1 * y;
    X2 += z * (x0$1 + x);
    Y2 += z * (y0$1 + y);
    Z2 += z * 3;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function PathContext(context) {
    this._context = context;
  }

  PathContext.prototype = {
    _radius: 4.5,
    pointRadius: function(_) {
      return this._radius = _, this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._context.closePath();
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._context.moveTo(x, y);
          this._point = 1;
          break;
        }
        case 1: {
          this._context.lineTo(x, y);
          break;
        }
        default: {
          this._context.moveTo(x + this._radius, y);
          this._context.arc(x, y, this._radius, 0, tau);
          break;
        }
      }
    },
    result: noop
  };

  var lengthSum = new Adder(),
      lengthRing,
      x00,
      y00,
      x0,
      y0;

  var lengthStream = {
    point: noop,
    lineStart: function() {
      lengthStream.point = lengthPointFirst;
    },
    lineEnd: function() {
      if (lengthRing) lengthPoint(x00, y00);
      lengthStream.point = noop;
    },
    polygonStart: function() {
      lengthRing = true;
    },
    polygonEnd: function() {
      lengthRing = null;
    },
    result: function() {
      var length = +lengthSum;
      lengthSum = new Adder();
      return length;
    }
  };

  function lengthPointFirst(x, y) {
    lengthStream.point = lengthPoint;
    x00 = x0 = x, y00 = y0 = y;
  }

  function lengthPoint(x, y) {
    x0 -= x, y0 -= y;
    lengthSum.add(sqrt(x0 * x0 + y0 * y0));
    x0 = x, y0 = y;
  }

  function PathString() {
    this._string = [];
  }

  PathString.prototype = {
    _radius: 4.5,
    _circle: circle(4.5),
    pointRadius: function(_) {
      if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
      return this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._string.push("Z");
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._string.push("M", x, ",", y);
          this._point = 1;
          break;
        }
        case 1: {
          this._string.push("L", x, ",", y);
          break;
        }
        default: {
          if (this._circle == null) this._circle = circle(this._radius);
          this._string.push("M", x, ",", y, this._circle);
          break;
        }
      }
    },
    result: function() {
      if (this._string.length) {
        var result = this._string.join("");
        this._string = [];
        return result;
      } else {
        return null;
      }
    }
  };

  function circle(radius) {
    return "m0," + radius
        + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
        + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
        + "z";
  }

  function geoPath(projection, context) {
    var pointRadius = 4.5,
        projectionStream,
        contextStream;

    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        geoStream(object, projectionStream(contextStream));
      }
      return contextStream.result();
    }

    path.area = function(object) {
      geoStream(object, projectionStream(areaStream));
      return areaStream.result();
    };

    path.measure = function(object) {
      geoStream(object, projectionStream(lengthStream));
      return lengthStream.result();
    };

    path.bounds = function(object) {
      geoStream(object, projectionStream(boundsStream));
      return boundsStream.result();
    };

    path.centroid = function(object) {
      geoStream(object, projectionStream(centroidStream));
      return centroidStream.result();
    };

    path.projection = function(_) {
      return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
    };

    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return path;
    };

    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };

    return path.projection(projection).context(context);
  }

  function transformer(methods) {
    return function(stream) {
      var s = new TransformStream;
      for (var key in methods) s[key] = methods[key];
      s.stream = stream;
      return s;
    };
  }

  function TransformStream() {}

  TransformStream.prototype = {
    constructor: TransformStream,
    point: function(x, y) { this.stream.point(x, y); },
    sphere: function() { this.stream.sphere(); },
    lineStart: function() { this.stream.lineStart(); },
    lineEnd: function() { this.stream.lineEnd(); },
    polygonStart: function() { this.stream.polygonStart(); },
    polygonEnd: function() { this.stream.polygonEnd(); }
  };

  function fit(projection, fitBounds, object) {
    var clip = projection.clipExtent && projection.clipExtent();
    projection.scale(150).translate([0, 0]);
    if (clip != null) projection.clipExtent(null);
    geoStream(object, projection.stream(boundsStream));
    fitBounds(boundsStream.result());
    if (clip != null) projection.clipExtent(clip);
    return projection;
  }

  function fitExtent(projection, extent, object) {
    return fit(projection, function(b) {
      var w = extent[1][0] - extent[0][0],
          h = extent[1][1] - extent[0][1],
          k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
          x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
          y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  function fitSize(projection, size, object) {
    return fitExtent(projection, [[0, 0], size], object);
  }

  function fitWidth(projection, width, object) {
    return fit(projection, function(b) {
      var w = +width,
          k = w / (b[1][0] - b[0][0]),
          x = (w - k * (b[1][0] + b[0][0])) / 2,
          y = -k * b[0][1];
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  function fitHeight(projection, height, object) {
    return fit(projection, function(b) {
      var h = +height,
          k = h / (b[1][1] - b[0][1]),
          x = -k * b[0][0],
          y = (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  var maxDepth = 16, // maximum depth of subdivision
      cosMinDistance = cos(30 * radians); // cos(minimum angular distance)

  function resample(project, delta2) {
    return +delta2 ? resample$1(project, delta2) : resampleNone(project);
  }

  function resampleNone(project) {
    return transformer({
      point: function(x, y) {
        x = project(x, y);
        this.stream.point(x[0], x[1]);
      }
    });
  }

  function resample$1(project, delta2) {

    function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0,
          dy = y1 - y0,
          d2 = dx * dx + dy * dy;
      if (d2 > 4 * delta2 && depth--) {
        var a = a0 + a1,
            b = b0 + b1,
            c = c0 + c1,
            m = sqrt(a * a + b * b + c * c),
            phi2 = asin(c /= m),
            lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
            p = project(lambda2, phi2),
            x2 = p[0],
            y2 = p[1],
            dx2 = x2 - x0,
            dy2 = y2 - y0,
            dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > delta2 // perpendicular projected distance
            || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
            || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
        }
      }
    }
    return function(stream) {
      var lambda00, x00, y00, a00, b00, c00, // first point
          lambda0, x0, y0, a0, b0, c0; // previous point

      var resampleStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
        polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
      };

      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }

      function lineStart() {
        x0 = NaN;
        resampleStream.point = linePoint;
        stream.lineStart();
      }

      function linePoint(lambda, phi) {
        var c = cartesian([lambda, phi]), p = project(lambda, phi);
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }

      function lineEnd() {
        resampleStream.point = point;
        stream.lineEnd();
      }

      function ringStart() {
        lineStart();
        resampleStream.point = ringPoint;
        resampleStream.lineEnd = ringEnd;
      }

      function ringPoint(lambda, phi) {
        linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resampleStream.point = linePoint;
      }

      function ringEnd() {
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
        resampleStream.lineEnd = lineEnd;
        lineEnd();
      }

      return resampleStream;
    };
  }

  var transformRadians = transformer({
    point: function(x, y) {
      this.stream.point(x * radians, y * radians);
    }
  });

  function transformRotate(rotate) {
    return transformer({
      point: function(x, y) {
        var r = rotate(x, y);
        return this.stream.point(r[0], r[1]);
      }
    });
  }

  function scaleTranslate(k, dx, dy, sx, sy) {
    function transform(x, y) {
      x *= sx; y *= sy;
      return [dx + k * x, dy - k * y];
    }
    transform.invert = function(x, y) {
      return [(x - dx) / k * sx, (dy - y) / k * sy];
    };
    return transform;
  }

  function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
    if (!alpha) return scaleTranslate(k, dx, dy, sx, sy);
    var cosAlpha = cos(alpha),
        sinAlpha = sin(alpha),
        a = cosAlpha * k,
        b = sinAlpha * k,
        ai = cosAlpha / k,
        bi = sinAlpha / k,
        ci = (sinAlpha * dy - cosAlpha * dx) / k,
        fi = (sinAlpha * dx + cosAlpha * dy) / k;
    function transform(x, y) {
      x *= sx; y *= sy;
      return [a * x - b * y + dx, dy - b * x - a * y];
    }
    transform.invert = function(x, y) {
      return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
    };
    return transform;
  }

  function projectionMutator(projectAt) {
    var project,
        k = 150, // scale
        x = 480, y = 250, // translate
        lambda = 0, phi = 0, // center
        deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
        alpha = 0, // post-rotate angle
        sx = 1, // reflectX
        sy = 1, // reflectX
        theta = null, preclip = clipAntimeridian, // pre-clip angle
        x0 = null, y0, x1, y1, postclip = identity, // post-clip extent
        delta2 = 0.5, // precision
        projectResample,
        projectTransform,
        projectRotateTransform,
        cache,
        cacheStream;

    function projection(point) {
      return projectRotateTransform(point[0] * radians, point[1] * radians);
    }

    function invert(point) {
      point = projectRotateTransform.invert(point[0], point[1]);
      return point && [point[0] * degrees, point[1] * degrees];
    }

    projection.stream = function(stream) {
      return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
    };

    projection.preclip = function(_) {
      return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
    };

    projection.postclip = function(_) {
      return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
    };

    projection.clipAngle = function(_) {
      return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
    };

    projection.clipExtent = function(_) {
      return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    };

    projection.scale = function(_) {
      return arguments.length ? (k = +_, recenter()) : k;
    };

    projection.translate = function(_) {
      return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
    };

    projection.center = function(_) {
      return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
    };

    projection.rotate = function(_) {
      return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
    };

    projection.angle = function(_) {
      return arguments.length ? (alpha = _ % 360 * radians, recenter()) : alpha * degrees;
    };

    projection.reflectX = function(_) {
      return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
    };

    projection.reflectY = function(_) {
      return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
    };

    projection.precision = function(_) {
      return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
    };

    projection.fitExtent = function(extent, object) {
      return fitExtent(projection, extent, object);
    };

    projection.fitSize = function(size, object) {
      return fitSize(projection, size, object);
    };

    projection.fitWidth = function(width, object) {
      return fitWidth(projection, width, object);
    };

    projection.fitHeight = function(height, object) {
      return fitHeight(projection, height, object);
    };

    function recenter() {
      var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
          transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
      rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
      projectTransform = compose(project, transform);
      projectRotateTransform = compose(rotate, projectTransform);
      projectResample = resample(projectTransform, delta2);
      return reset();
    }

    function reset() {
      cache = cacheStream = null;
      return projection;
    }

    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return recenter();
    };
  }

  function conicProjection(projectAt) {
    var phi0 = 0,
        phi1 = pi / 3,
        m = projectionMutator(projectAt),
        p = m(phi0, phi1);

    p.parallels = function(_) {
      return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
    };

    return p;
  }

  function cylindricalEqualAreaRaw(phi0) {
    var cosPhi0 = cos(phi0);

    function forward(lambda, phi) {
      return [lambda * cosPhi0, sin(phi) / cosPhi0];
    }

    forward.invert = function(x, y) {
      return [x / cosPhi0, asin(y * cosPhi0)];
    };

    return forward;
  }

  function conicEqualAreaRaw(y0, y1) {
    var sy0 = sin(y0), n = (sy0 + sin(y1)) / 2;

    // Are the parallels symmetrical around the Equator?
    if (abs(n) < epsilon) return cylindricalEqualAreaRaw(y0);

    var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;

    function project(x, y) {
      var r = sqrt(c - 2 * n * sin(y)) / n;
      return [r * sin(x *= n), r0 - r * cos(x)];
    }

    project.invert = function(x, y) {
      var r0y = r0 - y,
          l = atan2(x, abs(r0y)) * sign(r0y);
      if (r0y * n < 0)
        l -= pi * sign(x) * sign(r0y);
      return [l / n, asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
    };

    return project;
  }

  function conicEqualArea() {
    return conicProjection(conicEqualAreaRaw)
        .scale(155.424)
        .center([0, 33.6442]);
  }

  function geoAlbers() {
    return conicEqualArea()
        .parallels([29.5, 45.5])
        .scale(1070)
        .translate([480, 250])
        .rotate([96, 0])
        .center([-0.6, 38.7]);
  }

  var type = "FeatureCollection";
  var features = [
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-45.154757656421026,
  						-78.04706960058674
  					],
  					[
  						-43.33326677099711,
  						-80.02612273551293
  					],
  					[
  						-51.8531343247422,
  						-79.94772958772609
  					],
  					[
  						-48.66061601418244,
  						-78.0470187315987
  					],
  					[
  						-45.154757656421026,
  						-78.04706960058674
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-58.614142829001025,
  						-64.15246713013323
  					],
  					[
  						-62.5117602199671,
  						-65.09302987427762
  					],
  					[
  						-62.120078701410904,
  						-66.1903256226748
  					],
  					[
  						-65.50842485214048,
  						-67.58161020926883
  					],
  					[
  						-61.5129064601974,
  						-71.08904469821518
  					],
  					[
  						-60.69026933454316,
  						-73.166178894187
  					],
  					[
  						-61.963369920485604,
  						-74.4398479208848
  					],
  					[
  						-70.60072384304635,
  						-76.63449432388845
  					],
  					[
  						-77.92585812041938,
  						-78.37841888444225
  					],
  					[
  						-75.36009741891175,
  						-80.25954518017527
  					],
  					[
  						-63.25603003605087,
  						-81.74875660596248
  					],
  					[
  						-57.00811682801802,
  						-82.86569101351908
  					],
  					[
  						-49.761349860215546,
  						-81.72917123812384
  					],
  					[
  						-28.549802212018704,
  						-80.33793832796209
  					],
  					[
  						-29.685805223090966,
  						-79.26022633251506
  					],
  					[
  						-35.777009650198636,
  						-78.339248148765
  					],
  					[
  						-28.88277930349139,
  						-76.67366505956564
  					],
  					[
  						-21.224693772861798,
  						-75.90947397883339
  					],
  					[
  						-15.701490851290174,
  						-74.49860402440072
  					],
  					[
  						-15.446855231171952,
  						-73.14654184991616
  					],
  					[
  						-10.295774298534184,
  						-71.2654163616273
  					],
  					[
  						-7.416621873392444,
  						-71.69650115980613
  					],
  					[
  						0.868195428072994,
  						-71.30463877373688
  					],
  					[
  						9.525134718472202,
  						-70.01133270276813
  					],
  					[
  						19.259372592860103,
  						-69.89376881930411
  					],
  					[
  						27.09372643403725,
  						-70.46205454521788
  					],
  					[
  						32.754052768695345,
  						-69.38429087333856
  					],
  					[
  						33.87041873549671,
  						-68.50258758557466
  					],
  					[
  						38.6494035174168,
  						-69.7762049358401
  					],
  					[
  						40.02043094255245,
  						-69.10994069430103
  					],
  					[
  						52.614132521378934,
  						-66.05317637137213
  					],
  					[
  						56.355041131419995,
  						-65.97478322358539
  					],
  					[
  						58.744507684163835,
  						-67.28767466239267
  					],
  					[
  						62.38748945501183,
  						-68.01269500744765
  					],
  					[
  						64.05234907415914,
  						-67.40523854585669
  					],
  					[
  						68.8900382831628,
  						-67.9343018596609
  					],
  					[
  						69.55594078967582,
  						-69.67822642021471
  					],
  					[
  						67.81273969917405,
  						-70.30526824964429
  					],
  					[
  						71.02489505400465,
  						-72.08841522230776
  					],
  					[
  						73.86487674346913,
  						-69.87418345146557
  					],
  					[
  						77.6449044127551,
  						-69.4626840211254
  					],
  					[
  						79.11385867708393,
  						-68.32621592216245
  					],
  					[
  						82.77642581577041,
  						-67.20928151460592
  					],
  					[
  						87.4770174499038,
  						-66.8761752320525
  					],
  					[
  						99.71818240763506,
  						-67.24850392671549
  					],
  					[
  						102.83241092327253,
  						-65.5632837932452
  					],
  					[
  						106.18156050010882,
  						-66.93493133556831
  					],
  					[
  						113.60467329310737,
  						-65.8768047079599
  					],
  					[
  						115.60238081264643,
  						-66.69980356864036
  					],
  					[
  						120.87099979053218,
  						-67.18969614676729
  					],
  					[
  						122.32036868702235,
  						-66.5626543173377
  					],
  					[
  						128.80328047090242,
  						-66.75861134858847
  					],
  					[
  						135.8738049663734,
  						-66.0335910035335
  					],
  					[
  						137.46027143773395,
  						-66.95456837983924
  					],
  					[
  						145.49042728086502,
  						-66.91534596772976
  					],
  					[
  						146.64606733620823,
  						-67.89513112398362
  					],
  					[
  						152.50224734925243,
  						-68.87481292737299
  					],
  					[
  						154.28456749899917,
  						-68.56129201265819
  					],
  					[
  						159.18101281151874,
  						-69.59983327242796
  					],
  					[
  						162.68689700749624,
  						-70.73635304782312
  					],
  					[
  						168.42561648994106,
  						-70.97148081475115
  					],
  					[
  						171.20679039945745,
  						-71.69650115980613
  					],
  					[
  						169.2873209984081,
  						-73.65601979588172
  					],
  					[
  						166.09480268784844,
  						-74.3810401409367
  					],
  					[
  						163.48989708887981,
  						-77.06557912206718
  					],
  					[
  						166.99578128485732,
  						-78.75074757910517
  					],
  					[
  						161.76638471908117,
  						-79.16224781688967
  					],
  					[
  						159.78821089094825,
  						-80.94539478955305
  					],
  					[
  						180.00000000000014,
  						-84.71338
  					],
  					[
  						180.00000000000014,
  						-90.00000000000003
  					],
  					[
  						-180,
  						-90.00000000000003
  					],
  					[
  						-180,
  						-84.71338
  					],
  					[
  						-179.94249935617904,
  						-84.72144337355249
  					],
  					[
  						-167.02209937240343,
  						-84.57049651482791
  					],
  					[
  						-148.5330728830716,
  						-85.60903777459777
  					],
  					[
  						-142.89227943237563,
  						-84.57049651482791
  					],
  					[
  						-153.5862011383002,
  						-83.68868987419944
  					],
  					[
  						-152.86151669005505,
  						-82.04269215283864
  					],
  					[
  						-147.2207498850195,
  						-80.67104461051545
  					],
  					[
  						-149.5319008046251,
  						-79.35820484814045
  					],
  					[
  						-155.32937639058576,
  						-79.06426930126429
  					],
  					[
  						-156.97457312724606,
  						-77.30075856542751
  					],
  					[
  						-151.3337804839943,
  						-77.3987370810529
  					],
  					[
  						-144.32203712281108,
  						-75.53719696060277
  					],
  					[
  						-135.2145826956913,
  						-74.30269866958224
  					],
  					[
  						-116.2163116117835,
  						-74.24389088963403
  					],
  					[
  						-113.94433142785516,
  						-73.71482757582984
  					],
  					[
  						-107.55934648316813,
  						-75.18445363377842
  					],
  					[
  						-100.64553076862231,
  						-75.30201751724243
  					],
  					[
  						-100.31252783893346,
  						-72.75467946384683
  					],
  					[
  						-96.33659481482894,
  						-73.61684906020446
  					],
  					[
  						-88.42395117872962,
  						-73.0093925986135
  					],
  					[
  						-76.22187944202707,
  						-73.96954071059652
  					],
  					[
  						-68.93591590033134,
  						-73.0093925986135
  					],
  					[
  						-67.25154842799387,
  						-71.6377450562903
  					],
  					[
  						-68.48545244004302,
  						-70.10931121839351
  					],
  					[
  						-67.74118262395925,
  						-67.32684539806995
  					],
  					[
  						-63.00139441593248,
  						-64.64230803182787
  					],
  					[
  						-58.614142829001025,
  						-64.15246713013323
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-67.74999999999994,
  						-53.85
  					],
  					[
  						-65.50000000000003,
  						-55.19999999999996
  					],
  					[
  						-68.14862999999997,
  						-55.61182999999988
  					],
  					[
  						-71.00567999999996,
  						-55.05383000000004
  					],
  					[
  						-70.26747999999998,
  						-52.93123
  					],
  					[
  						-67.74999999999994,
  						-53.85
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						145.3979781434949,
  						-40.79254851660599
  					],
  					[
  						148.28906782449607,
  						-40.87543751400213
  					],
  					[
  						148.3598645367359,
  						-42.062445163746446
  					],
  					[
  						146.04837772032036,
  						-43.54974456153889
  					],
  					[
  						144.71807132383069,
  						-41.1625517718158
  					],
  					[
  						145.3979781434949,
  						-40.79254851660599
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						173.02037479074082,
  						-40.919052422856424
  					],
  					[
  						174.24851688058945,
  						-41.770008233406756
  					],
  					[
  						171.45292524646365,
  						-44.24251881284374
  					],
  					[
  						170.61669721911662,
  						-45.90892872495971
  					],
  					[
  						169.33233117093428,
  						-46.641235446967855
  					],
  					[
  						166.67688602118423,
  						-46.219917494492265
  					],
  					[
  						167.04642418850327,
  						-45.11094125750867
  					],
  					[
  						173.02037479074082,
  						-40.919052422856424
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						174.61200890533055,
  						-36.15639739354056
  					],
  					[
  						177.97046023997936,
  						-39.166342868812976
  					],
  					[
  						176.0124402204403,
  						-41.28962411882151
  					],
  					[
  						173.8240466657442,
  						-39.50885426204351
  					],
  					[
  						174.5748018740804,
  						-38.797683200842755
  					],
  					[
  						174.61200890533055,
  						-36.15639739354056
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						50.05651085795725,
  						-13.555761407122006
  					],
  					[
  						50.476536899625586,
  						-15.226512139550593
  					],
  					[
  						49.49861209493409,
  						-17.106035658438316
  					],
  					[
  						48.54854088724815,
  						-20.49688811613413
  					],
  					[
  						47.09576134622668,
  						-24.94162973399048
  					],
  					[
  						45.40950768411048,
  						-25.60143442149308
  					],
  					[
  						44.03972049334973,
  						-24.98834522878228
  					],
  					[
  						43.25418704608106,
  						-22.05741301848417
  					],
  					[
  						44.374325392439715,
  						-20.072366224856353
  					],
  					[
  						43.963084344261034,
  						-17.409944756746754
  					],
  					[
  						44.44651736835149,
  						-16.216219170804536
  					],
  					[
  						46.31224327981724,
  						-15.780018405828855
  					],
  					[
  						48.845060255738844,
  						-13.089174899958692
  					],
  					[
  						50.05651085795725,
  						-13.555761407122006
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						143.56181115130002,
  						-13.763655694232213
  					],
  					[
  						145.37472374896348,
  						-14.984976495018373
  					],
  					[
  						146.38747846901967,
  						-18.95827402107591
  					],
  					[
  						148.84841352762325,
  						-20.39120981209726
  					],
  					[
  						149.67833703023067,
  						-22.342511895438392
  					],
  					[
  						152.85519738180594,
  						-25.26750131602303
  					],
  					[
  						153.56946902894416,
  						-28.110066827102116
  					],
  					[
  						152.8915775901394,
  						-31.640445651986056
  					],
  					[
  						151.70911746643677,
  						-33.04134205498643
  					],
  					[
  						150.07521203023228,
  						-36.420205580390515
  					],
  					[
  						149.99728397033616,
  						-37.42526051203524
  					],
  					[
  						148.30462243061592,
  						-37.80906137466698
  					],
  					[
  						146.31792199115486,
  						-39.035756524411454
  					],
  					[
  						144.48568240781404,
  						-38.08532358169927
  					],
  					[
  						143.6099735861961,
  						-38.80946542740533
  					],
  					[
  						140.6385787294133,
  						-38.01933277766257
  					],
  					[
  						139.5741475770653,
  						-36.13836231867067
  					],
  					[
  						138.12074791885632,
  						-35.612296237939404
  					],
  					[
  						134.2739026226171,
  						-32.61723357516698
  					],
  					[
  						131.32633060112093,
  						-31.495803318001066
  					],
  					[
  						126.14871382050123,
  						-32.21596607842061
  					],
  					[
  						124.22164798390494,
  						-32.95948658623607
  					],
  					[
  						123.65966678273074,
  						-33.890179131812744
  					],
  					[
  						119.89369510302825,
  						-33.976065362281815
  					],
  					[
  						118.02497195848954,
  						-35.064732761374714
  					],
  					[
  						115.0268087097796,
  						-34.19651702243894
  					],
  					[
  						115.80164513556397,
  						-32.20506235120703
  					],
  					[
  						115.04003787644635,
  						-29.461095472940798
  					],
  					[
  						114.17357913620847,
  						-28.11807667410733
  					],
  					[
  						113.39352339076268,
  						-24.38476449961327
  					],
  					[
  						114.64776207891882,
  						-21.829519952077007
  					],
  					[
  						116.71161543179156,
  						-20.701681817306834
  					],
  					[
  						120.85622033089672,
  						-19.68370777758919
  					],
  					[
  						122.24166548064184,
  						-18.197648614171854
  					],
  					[
  						122.31277225147542,
  						-17.254967136303463
  					],
  					[
  						125.68579634003052,
  						-14.230655612853838
  					],
  					[
  						127.06586714081735,
  						-13.817967624570926
  					],
  					[
  						128.35968997610897,
  						-14.869169610252271
  					],
  					[
  						129.40960005098302,
  						-14.420669854391122
  					],
  					[
  						130.61779503796706,
  						-12.536392103732481
  					],
  					[
  						133.5508459819891,
  						-11.786515394745138
  					],
  					[
  						136.95162031468502,
  						-12.351958916882836
  					],
  					[
  						135.42866417861123,
  						-14.7154322241839
  					],
  					[
  						139.26057498591823,
  						-17.371600843986187
  					],
  					[
  						140.87546349503927,
  						-17.369068698803943
  					],
  					[
  						141.70218305884467,
  						-15.044921156476931
  					],
  					[
  						141.68699018775087,
  						-12.407614434461152
  					],
  					[
  						142.51526004452498,
  						-10.668185723516729
  					],
  					[
  						143.56181115130002,
  						-13.763655694232213
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						108.62347863162901,
  						-6.777673841990691
  					],
  					[
  						112.61481123255643,
  						-6.946035658397605
  					],
  					[
  						113.4647335144609,
  						-8.348947442257426
  					],
  					[
  						108.27776329959639,
  						-7.766657403192582
  					],
  					[
  						105.36548628135554,
  						-6.851416110871256
  					],
  					[
  						106.05164594932708,
  						-5.8959188777945
  					],
  					[
  						108.62347863162901,
  						-6.777673841990691
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						134.1433679546478,
  						-1.1518673641035946
  					],
  					[
  						134.4226273947531,
  						-2.7691846655423973
  					],
  					[
  						135.45760298069476,
  						-3.367752780779128
  					],
  					[
  						136.2933142437188,
  						-2.3070423315561897
  					],
  					[
  						138.3297274110448,
  						-1.7026864559027501
  					],
  					[
  						144.58397098203326,
  						-3.861417738463402
  					],
  					[
  						146.9709053895949,
  						-6.721656589386356
  					],
  					[
  						149.782310012002,
  						-10.393267103723943
  					],
  					[
  						147.91301842670802,
  						-10.130440769087471
  					],
  					[
  						146.04848107318494,
  						-8.06741423913131
  					],
  					[
  						144.74416792213808,
  						-7.630128269077474
  					],
  					[
  						143.28637576718435,
  						-8.245491224809072
  					],
  					[
  						142.62843143124425,
  						-9.326820570516503
  					],
  					[
  						141.0338517600139,
  						-9.117892754760518
  					],
  					[
  						138.6686214540148,
  						-7.320224704623087
  					],
  					[
  						137.92783979711086,
  						-5.393365573756
  					],
  					[
  						135.16459760959972,
  						-4.462931410340872
  					],
  					[
  						131.9898043153162,
  						-2.8205510392405557
  					],
  					[
  						132.3801164084168,
  						-0.3695378556369775
  					],
  					[
  						134.1433679546478,
  						-1.1518673641035946
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						125.24050052297159,
  						1.4198361271176054
  					],
  					[
  						124.43703535369744,
  						0.4278811710589565
  					],
  					[
  						120.18308312386276,
  						0.23724681233420597
  					],
  					[
  						120.04086958219548,
  						-0.5196578914448651
  					],
  					[
  						121.50827355355554,
  						-1.9044829240024228
  					],
  					[
  						123.17096276254657,
  						-4.683693129091722
  					],
  					[
  						122.62851525277873,
  						-5.634591159694494
  					],
  					[
  						120.30545291552991,
  						-2.9316036922357256
  					],
  					[
  						120.43071658740539,
  						-5.528241062037779
  					],
  					[
  						119.36690555224496,
  						-5.379878024927805
  					],
  					[
  						119.49883548388598,
  						-3.4944117163265247
  					],
  					[
  						118.76776899625284,
  						-2.801999200047689
  					],
  					[
  						120.03570193896635,
  						0.5664773624657045
  					],
  					[
  						120.88577925016764,
  						1.309222723796836
  					],
  					[
  						124.0775224142429,
  						0.9171019555661388
  					],
  					[
  						125.24050052297159,
  						1.4198361271176054
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						105.81765506390937,
  						-5.852355645372413
  					],
  					[
  						104.71038414919153,
  						-5.873284600450646
  					],
  					[
  						102.58426069540698,
  						-4.220258884298204
  					],
  					[
  						100.14198082886068,
  						-0.6503475887109715
  					],
  					[
  						98.60135135294311,
  						1.8235065779655315
  					],
  					[
  						95.38087609251355,
  						4.97078217205366
  					],
  					[
  						97.4848820332771,
  						5.246320909033912
  					],
  					[
  						100.64143354696168,
  						2.0993812117556985
  					],
  					[
  						101.65801232300745,
  						2.083697414555189
  					],
  					[
  						103.07684044801314,
  						0.5613613956688397
  					],
  					[
  						103.43764529827499,
  						-0.7119458960029448
  					],
  					[
  						104.88789269411407,
  						-2.340425306816755
  					],
  					[
  						106.10859337771271,
  						-3.0617766251789504
  					],
  					[
  						105.81765506390937,
  						-5.852355645372413
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						117.87562706916597,
  						1.827640692548897
  					],
  					[
  						117.52164350796662,
  						-0.8037232397533103
  					],
  					[
  						116.56004845587952,
  						-1.487660821136231
  					],
  					[
  						116.00085778204911,
  						-3.657037448749108
  					],
  					[
  						114.86480309454456,
  						-4.106984144714417
  					],
  					[
  						113.25699425664757,
  						-3.1187757299969547
  					],
  					[
  						110.223846063276,
  						-2.9340324845534838
  					],
  					[
  						110.07093550012436,
  						-1.592874037282499
  					],
  					[
  						109.09187381392255,
  						-0.4595065242571508
  					],
  					[
  						109.06913618371411,
  						1.3419339054376422
  					],
  					[
  						109.6632601257738,
  						2.006466986494985
  					],
  					[
  						112.99561486211527,
  						3.1023949243248694
  					],
  					[
  						114.59996137904872,
  						4.9000112980299235
  					],
  					[
  						116.22074100145105,
  						6.143191229675523
  					],
  					[
  						119.18190392463995,
  						5.407835598162151
  					],
  					[
  						117.31323245653354,
  						3.234428208830579
  					],
  					[
  						117.87562706916597,
  						1.827640692548897
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						126.37681359263749,
  						8.414706325713254
  					],
  					[
  						126.53742394420058,
  						7.189380601424574
  					],
  					[
  						124.21978763234242,
  						6.161355495626168
  					],
  					[
  						123.29607140512528,
  						7.418875637232773
  					],
  					[
  						123.48768761606354,
  						8.693009751821194
  					],
  					[
  						126.22271447154318,
  						9.286074327018838
  					],
  					[
  						126.37681359263749,
  						8.414706325713254
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						81.2180196471443,
  						6.197141424988303
  					],
  					[
  						80.34835696810447,
  						5.968369859232141
  					],
  					[
  						79.69516686393516,
  						8.200843410673372
  					],
  					[
  						80.83881798698664,
  						9.268426825391174
  					],
  					[
  						81.78795901889143,
  						7.523055324733178
  					],
  					[
  						81.2180196471443,
  						6.197141424988303
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						121.3213082215236,
  						18.504064642810903
  					],
  					[
  						122.51565392465338,
  						17.093504746971973
  					],
  					[
  						121.66278608610824,
  						15.9310175643501
  					],
  					[
  						121.72882856657728,
  						14.328376369682246
  					],
  					[
  						120.07042850146641,
  						14.970869452367197
  					],
  					[
  						120.39004723519176,
  						17.59908112229951
  					],
  					[
  						121.3213082215236,
  						18.504064642810903
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-72.57967281766363,
  						19.871500555902344
  					],
  					[
  						-70.80670610216168,
  						19.88028554939197
  					],
  					[
  						-68.31794328476892,
  						18.612197577381636
  					],
  					[
  						-71.70830481635795,
  						18.044997056546208
  					],
  					[
  						-72.69493709989067,
  						18.44579946540179
  					],
  					[
  						-72.57967281766363,
  						19.871500555902344
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-79.6795236884603,
  						22.765303249598816
  					],
  					[
  						-78.3474344550564,
  						22.512166246017074
  					],
  					[
  						-76.52382483590844,
  						21.206819566324327
  					],
  					[
  						-75.63468014189462,
  						19.873774318923154
  					],
  					[
  						-77.7554809231531,
  						19.85548086189189
  					],
  					[
  						-79.6795236884603,
  						22.765303249598816
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						15.520376010813834,
  						38.23115509699156
  					],
  					[
  						15.099988234119536,
  						36.6199872909954
  					],
  					[
  						12.431003859108785,
  						37.612949937483705
  					],
  					[
  						15.520376010813834,
  						38.23115509699156
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						140.9763875673053,
  						37.14207428644016
  					],
  					[
  						140.25327925024519,
  						35.138113918593746
  					],
  					[
  						137.21759891169128,
  						34.60628591566177
  					],
  					[
  						135.7929830262689,
  						33.46480520276671
  					],
  					[
  						135.07943484918277,
  						34.59654490817482
  					],
  					[
  						132.15677086805132,
  						33.90493337659652
  					],
  					[
  						131.33279015515737,
  						31.450354519164847
  					],
  					[
  						129.40846316947253,
  						33.29605581311759
  					],
  					[
  						132.61767296766251,
  						35.43339305270939
  					],
  					[
  						135.67753787652893,
  						35.527134100886826
  					],
  					[
  						139.4264046571429,
  						38.215962225897556
  					],
  					[
  						139.88337934789988,
  						40.56331248632361
  					],
  					[
  						141.3689734234267,
  						41.378559882160374
  					],
  					[
  						141.88460086483505,
  						39.18086456965142
  					],
  					[
  						140.9763875673053,
  						37.14207428644016
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						143.91016198137956,
  						44.17409983985374
  					],
  					[
  						143.18384972551726,
  						41.99521474869917
  					],
  					[
  						141.38054894426008,
  						43.38882477474638
  					],
  					[
  						141.967644891528,
  						45.55148346616136
  					],
  					[
  						143.91016198137956,
  						44.17409983985374
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-56.13403581401704,
  						50.687009792679305
  					],
  					[
  						-55.82240108908101,
  						49.58712860777899
  					],
  					[
  						-53.47654944519127,
  						49.24913890237406
  					],
  					[
  						-52.6480987209041,
  						47.53554840757559
  					],
  					[
  						-53.06915829121834,
  						46.655498765645035
  					],
  					[
  						-56.250798712780636,
  						47.63254507098739
  					],
  					[
  						-59.26601518414688,
  						47.6033478867424
  					],
  					[
  						-57.35868974468596,
  						50.71827403421594
  					],
  					[
  						-56.13403581401704,
  						50.687009792679305
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-6.788856573910806,
  						52.260117906292436
  					],
  					[
  						-8.561616583683502,
  						51.6693012558994
  					],
  					[
  						-9.688524542672383,
  						53.88136261658536
  					],
  					[
  						-7.572167934590993,
  						55.13162221945498
  					],
  					[
  						-5.661948614921926,
  						54.554603176483766
  					],
  					[
  						-6.788856573910806,
  						52.260117906292436
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-3.0050048486351955,
  						58.635000108466244
  					],
  					[
  						-1.959280564776833,
  						57.68479970969949
  					],
  					[
  						-2.0850093245430514,
  						55.909998480851186
  					],
  					[
  						0.4699768408317766,
  						52.92999949809189
  					],
  					[
  						0.5503336930456726,
  						50.765738837276075
  					],
  					[
  						-3.6174480859423284,
  						50.22835561787272
  					],
  					[
  						-5.2672957015088855,
  						51.99140045837467
  					],
  					[
  						-3.6300054589893307,
  						54.615012925833014
  					],
  					[
  						-5.58639767091114,
  						55.31114614523682
  					],
  					[
  						-6.149980841486354,
  						56.78500967063346
  					],
  					[
  						-5.009998745127575,
  						58.63001333275005
  					],
  					[
  						-3.0050048486351955,
  						58.635000108466244
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-85.16130794954995,
  						65.6572846543929
  					],
  					[
  						-83.10879757356506,
  						64.1018757188398
  					],
  					[
  						-86.35275977247127,
  						64.03583323837071
  					],
  					[
  						-85.16130794954995,
  						65.6572846543929
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-14.508695441129134,
  						66.45589223903139
  					],
  					[
  						-13.609732224979695,
  						65.12667104761994
  					],
  					[
  						-18.656245896874964,
  						63.496382961675835
  					],
  					[
  						-22.76297197111009,
  						63.96017894149537
  					],
  					[
  						-23.650514695723075,
  						66.26251902939524
  					],
  					[
  						-20.57628373867948,
  						65.73211212835153
  					],
  					[
  						-14.508695441129134,
  						66.45589223903139
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-175.0142500000001,
  						66.58435000000003
  					],
  					[
  						-171.85731000000004,
  						66.91307999999995
  					],
  					[
  						-173.89184000000003,
  						64.28259999999995
  					],
  					[
  						-178.35993000000008,
  						65.39051999999995
  					],
  					[
  						-180,
  						64.97970870219845
  					],
  					[
  						-180,
  						68.96363636363645
  					],
  					[
  						-174.92825000000005,
  						67.20589000000004
  					],
  					[
  						-175.0142500000001,
  						66.58435000000003
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-90.54711914062494,
  						69.49768066406259
  					],
  					[
  						-88.0195922851562,
  						68.61511230468756
  					],
  					[
  						-85.52191162109378,
  						69.88208007812497
  					],
  					[
  						-81.28039550781247,
  						69.16210937500003
  					],
  					[
  						-81.38647460937491,
  						67.11090087890622
  					],
  					[
  						-86.06762695312497,
  						66.05627441406261
  					],
  					[
  						-88.48291015624997,
  						64.09912109375009
  					],
  					[
  						-93.15698242187497,
  						62.024719238281364
  					],
  					[
  						-94.62927246093741,
  						60.110290527343835
  					],
  					[
  						-92.29699707031244,
  						57.08709716796881
  					],
  					[
  						-90.89770507812497,
  						57.284729003906335
  					],
  					[
  						-85.01177978515616,
  						55.30267333984389
  					],
  					[
  						-82.27282714843741,
  						55.148315429687585
  					],
  					[
  						-81.4006958007812,
  						52.15789794921878
  					],
  					[
  						-79.91290283203122,
  						51.208496093750085
  					],
  					[
  						-78.60192871093741,
  						52.56207275390628
  					],
  					[
  						-79.1242065429687,
  						54.14147949218764
  					],
  					[
  						-76.54138183593747,
  						56.5343017578125
  					],
  					[
  						-78.5169067382812,
  						58.80468750000006
  					],
  					[
  						-77.33666992187497,
  						59.85272216796878
  					],
  					[
  						-78.10681152343753,
  						62.31970214843753
  					],
  					[
  						-73.83990478515622,
  						62.44390869140631
  					],
  					[
  						-71.37371826171872,
  						61.13708496093747
  					],
  					[
  						-69.5903930664062,
  						61.061523437500114
  					],
  					[
  						-69.2879028320312,
  						58.95727539062506
  					],
  					[
  						-66.20178222656241,
  						58.76727294921878
  					],
  					[
  						-64.58349609374991,
  						60.33569335937506
  					],
  					[
  						-59.56958007812494,
  						55.2041015625
  					],
  					[
  						-57.333190917968665,
  						54.62652587890639
  					],
  					[
  						-55.756286621093665,
  						53.27050781250006
  					],
  					[
  						-55.68328857421872,
  						52.146728515625085
  					],
  					[
  						-60.03308105468747,
  						50.24291992187503
  					],
  					[
  						-66.39898681640616,
  						50.228881835937585
  					],
  					[
  						-65.05621337890616,
  						49.23291015625014
  					],
  					[
  						-64.47210693359366,
  						46.238525390625085
  					],
  					[
  						-61.03979492187497,
  						45.26531982421878
  					],
  					[
  						-65.36407470703116,
  						43.54528808593753
  					],
  					[
  						-67.13739013671872,
  						45.13751220703125
  					],
  					[
  						-70.11608886718747,
  						43.68408203124997
  					],
  					[
  						-70.64001464843744,
  						41.475097656250085
  					],
  					[
  						-73.9819946289062,
  						40.62811279296889
  					],
  					[
  						-75.72198486328122,
  						37.93707275390625
  					],
  					[
  						-75.7274780273437,
  						35.550720214843864
  					],
  					[
  						-78.55432128906247,
  						33.86132812500006
  					],
  					[
  						-81.33630371093741,
  						31.44049072265628
  					],
  					[
  						-81.49041748046866,
  						30.730102539062642
  					],
  					[
  						-80.05651855468744,
  						26.880126953125142
  					],
  					[
  						-81.17211914062494,
  						25.201293945312642
  					],
  					[
  						-82.85528564453122,
  						27.88629150390625
  					],
  					[
  						-83.70959472656247,
  						29.93670654296875
  					],
  					[
  						-85.10882568359372,
  						29.63629150390625
  					],
  					[
  						-86.40002441406241,
  						30.400085449218835
  					],
  					[
  						-89.60491943359372,
  						30.176330566406307
  					],
  					[
  						-91.62670898437497,
  						29.67712402343753
  					],
  					[
  						-94.69000244140622,
  						29.48010253906253
  					],
  					[
  						-97.36999511718744,
  						27.38012695312503
  					],
  					[
  						-97.14019775390614,
  						25.86950683593753
  					],
  					[
  						-97.87237548828128,
  						22.44427490234378
  					],
  					[
  						-97.1892700195312,
  						20.635498046875
  					],
  					[
  						-95.90087890624997,
  						18.82812500000003
  					],
  					[
  						-94.4257202148437,
  						18.144287109375142
  					],
  					[
  						-90.7717895507812,
  						19.284118652343892
  					],
  					[
  						-90.27862548828116,
  						20.999877929687557
  					],
  					[
  						-87.05187988281241,
  						21.543518066406364
  					],
  					[
  						-88.35540771484372,
  						16.5308837890625
  					],
  					[
  						-88.93060302734366,
  						15.887329101562642
  					],
  					[
  						-84.36822509765616,
  						15.8350830078125
  					],
  					[
  						-83.14721679687497,
  						14.995910644531307
  					],
  					[
  						-83.85540771484372,
  						11.373291015625057
  					],
  					[
  						-83.4022827148437,
  						10.395507812499986
  					],
  					[
  						-81.43920898437491,
  						8.786315917968764
  					],
  					[
  						-79.57330322265622,
  						9.611694335937585
  					],
  					[
  						-76.83660888671878,
  						8.638671875
  					],
  					[
  						-75.67462158203116,
  						9.44329833984385
  					],
  					[
  						-75.4804077148437,
  						10.619079589843764
  					],
  					[
  						-73.41467285156247,
  						11.227111816406236
  					],
  					[
  						-71.7540893554687,
  						12.437316894531406
  					],
  					[
  						-71.40057373046878,
  						10.969116210937543
  					],
  					[
  						-68.88299560546872,
  						11.443481445312557
  					],
  					[
  						-68.19409179687491,
  						10.554687500000085
  					],
  					[
  						-64.31799316406241,
  						10.641479492187585
  					],
  					[
  						-61.58868408203119,
  						9.87310791015625
  					],
  					[
  						-59.101684570312415,
  						7.99932861328125
  					],
  					[
  						-57.147399902343665,
  						5.973083496093864
  					],
  					[
  						-55.033203124999915,
  						6.0253295898438495
  					],
  					[
  						-52.882080078125,
  						5.409912109375
  					],
  					[
  						-51.31707763671872,
  						4.203491210937656
  					],
  					[
  						-49.94708251953119,
  						1.0463256835937926
  					],
  					[
  						-50.38818359374994,
  						-0.07836914062498579
  					],
  					[
  						-48.62048339843747,
  						-0.23541259765620737
  					],
  					[
  						-44.90570068359369,
  						-1.5516967773437216
  					],
  					[
  						-44.41760253906244,
  						-2.137695312499943
  					],
  					[
  						-41.47259521484372,
  						-2.911987304687443
  					],
  					[
  						-39.97857666015625,
  						-2.8729858398437074
  					],
  					[
  						-37.22320556640622,
  						-4.820922851562415
  					],
  					[
  						-35.235412597656165,
  						-5.464904785156222
  					],
  					[
  						-34.72998046874994,
  						-7.343200683593665
  					],
  					[
  						-35.12817382812497,
  						-8.996398925781165
  					],
  					[
  						-37.0465087890625,
  						-11.040710449218679
  					],
  					[
  						-38.95318603515625,
  						-13.793395996093679
  					],
  					[
  						-38.88232421874997,
  						-15.666992187499943
  					],
  					[
  						-39.76080322265619,
  						-19.59912109374997
  					],
  					[
  						-40.94470214843744,
  						-21.937316894531207
  					],
  					[
  						-41.988281249999915,
  						-22.970092773437486
  					],
  					[
  						-44.64782714843744,
  						-23.35198974609378
  					],
  					[
  						-46.47210693359369,
  						-24.08898925781253
  					],
  					[
  						-48.495483398437415,
  						-25.87701416015618
  					],
  					[
  						-48.88842773437494,
  						-28.674072265624957
  					],
  					[
  						-50.69689941406247,
  						-30.98437499999997
  					],
  					[
  						-52.256103515624915,
  						-32.24530029296871
  					],
  					[
  						-53.806396484374915,
  						-34.39678955078121
  					],
  					[
  						-54.93579101562497,
  						-34.95257568359378
  					],
  					[
  						-57.13970947265628,
  						-34.430480957031236
  					],
  					[
  						-56.78820800781247,
  						-36.90148925781243
  					],
  					[
  						-57.749084472656165,
  						-38.18389892578118
  					],
  					[
  						-59.23181152343747,
  						-38.7202148437499
  					],
  					[
  						-62.335876464843665,
  						-38.82769775390615
  					],
  					[
  						-62.145996093749915,
  						-40.676879882812415
  					],
  					[
  						-65.11798095703122,
  						-41.064270019531165
  					],
  					[
  						-64.37878417968747,
  						-42.873474121093665
  					],
  					[
  						-65.565185546875,
  						-45.03680419921868
  					],
  					[
  						-67.58050537109366,
  						-46.30169677734371
  					],
  					[
  						-65.64099121093747,
  						-47.23608398437493
  					],
  					[
  						-69.13848876953122,
  						-50.73248291015622
  					],
  					[
  						-68.81549072265622,
  						-51.77111816406246
  					],
  					[
  						-72.55792236328116,
  						-53.53137207031242
  					],
  					[
  						-74.94677734374991,
  						-52.26269531249992
  					],
  					[
  						-75.64440917968741,
  						-46.64758300781253
  					],
  					[
  						-74.6920776367187,
  						-45.763977050781165
  					],
  					[
  						-73.67712402343747,
  						-39.94219970703128
  					],
  					[
  						-73.1666870117187,
  						-37.123779296874915
  					],
  					[
  						-71.43847656249997,
  						-32.41888427734372
  					],
  					[
  						-71.48980712890616,
  						-28.86138916015622
  					],
  					[
  						-70.90509033203122,
  						-27.640380859375043
  					],
  					[
  						-70.09118652343744,
  						-21.39331054687493
  					],
  					[
  						-70.37249755859366,
  						-18.34790039062497
  					],
  					[
  						-71.46197509765616,
  						-17.363403320312457
  					],
  					[
  						-76.0092163085937,
  						-14.649291992187415
  					],
  					[
  						-77.10620117187491,
  						-12.222717285156207
  					],
  					[
  						-79.76049804687494,
  						-7.194274902343707
  					],
  					[
  						-81.24999999999991,
  						-6.136779785156236
  					],
  					[
  						-81.41088867187491,
  						-4.736694335937486
  					],
  					[
  						-80.30249023437497,
  						-3.404785156249986
  					],
  					[
  						-80.93359375000003,
  						-1.0573730468749432
  					],
  					[
  						-80.09057617187497,
  						0.7684936523438637
  					],
  					[
  						-78.85528564453122,
  						1.3809204101563353
  					],
  					[
  						-78.42761230468741,
  						2.629699707031378
  					],
  					[
  						-77.12768554687494,
  						3.8496704101564063
  					],
  					[
  						-77.47668457031241,
  						6.691101074218778
  					],
  					[
  						-79.12030029296872,
  						8.996093749999986
  					],
  					[
  						-80.48071289062494,
  						8.090270996093892
  					],
  					[
  						-82.96569824218744,
  						8.225097656250128
  					],
  					[
  						-83.63262939453122,
  						9.051513671875085
  					],
  					[
  						-85.7974243164062,
  						10.134887695312585
  					],
  					[
  						-85.71252441406241,
  						11.088500976562528
  					],
  					[
  						-87.9041137695312,
  						13.149108886718878
  					],
  					[
  						-91.23242187500003,
  						13.927917480468736
  					],
  					[
  						-93.35937499999991,
  						15.615478515625114
  					],
  					[
  						-94.69158935546878,
  						16.20111083984375
  					],
  					[
  						-96.55737304687494,
  						15.65350341796875
  					],
  					[
  						-100.82952880859378,
  						17.171081542968835
  					],
  					[
  						-103.50097656249996,
  						18.292297363281392
  					],
  					[
  						-104.99200439453116,
  						19.316284179687585
  					],
  					[
  						-106.02868652343744,
  						22.77368164062503
  					],
  					[
  						-108.40191650390621,
  						25.172302246093892
  					],
  					[
  						-109.2916259765624,
  						26.442871093750057
  					],
  					[
  						-112.22821044921868,
  						28.954528808593864
  					],
  					[
  						-113.14868164062491,
  						31.171081542968892
  					],
  					[
  						-114.77642822265618,
  						31.799682617187585
  					],
  					[
  						-114.67388916015615,
  						30.1627197265625
  					],
  					[
  						-111.61651611328116,
  						26.66290283203122
  					],
  					[
  						-110.29498291015624,
  						23.43109130859372
  					],
  					[
  						-112.18200683593747,
  						24.738525390625114
  					],
  					[
  						-112.30072021484371,
  						26.012084960937642
  					],
  					[
  						-114.4656982421874,
  						27.14208984375003
  					],
  					[
  						-114.16198730468753,
  						28.56610107421878
  					],
  					[
  						-115.51867675781243,
  						29.556274414062585
  					],
  					[
  						-117.29589843749997,
  						33.046325683593835
  					],
  					[
  						-118.51989746093753,
  						34.027893066406364
  					],
  					[
  						-120.3677978515624,
  						34.447082519531335
  					],
  					[
  						-123.72711181640615,
  						38.951721191406364
  					],
  					[
  						-124.39801025390622,
  						40.31329345703131
  					],
  					[
  						-124.53277587890615,
  						42.76611328125003
  					],
  					[
  						-123.89892578124996,
  						45.52349853515639
  					],
  					[
  						-124.68719482421866,
  						48.18450927734378
  					],
  					[
  						-122.97418212890615,
  						49.002685546875114
  					],
  					[
  						-127.43560791015628,
  						50.830688476562614
  					],
  					[
  						-127.85028076171879,
  						52.32971191406247
  					],
  					[
  						-129.12969970703116,
  						52.75549316406253
  					],
  					[
  						-130.53607177734366,
  						54.80267333984381
  					],
  					[
  						-131.96722412109372,
  						55.497924804687585
  					],
  					[
  						-134.0780029296874,
  						58.12310791015625
  					],
  					[
  						-137.79998779296872,
  						58.500122070312614
  					],
  					[
  						-139.8677978515625,
  						59.537902832031335
  					],
  					[
  						-143.9588012695312,
  						59.99932861328139
  					],
  					[
  						-147.11437988281244,
  						60.884704589843864
  					],
  					[
  						-148.01800537109378,
  						59.97827148437506
  					],
  					[
  						-154.23248291015614,
  						58.146484375000085
  					],
  					[
  						-157.72277832031244,
  						57.57012939453139
  					],
  					[
  						-161.87408447265614,
  						59.63372802734375
  					],
  					[
  						-163.81829833984378,
  						59.798095703125114
  					],
  					[
  						-166.1213989257812,
  						61.50012207031253
  					],
  					[
  						-164.56249999999991,
  						63.14648437499997
  					],
  					[
  						-160.9583129882812,
  						64.22290039062509
  					],
  					[
  						-166.42529296874997,
  						64.68670654296878
  					],
  					[
  						-168.11047363281241,
  						65.67010498046875
  					],
  					[
  						-164.47467041015616,
  						66.57672119140628
  					],
  					[
  						-165.39019775390616,
  						68.0429077148438
  					],
  					[
  						-161.9088745117188,
  						70.33331298828136
  					],
  					[
  						-156.5808105468749,
  						71.35791015625009
  					],
  					[
  						-152.2700195312499,
  						70.60009765625006
  					],
  					[
  						-143.58941650390625,
  						70.15252685546889
  					],
  					[
  						-136.50360107421866,
  						68.89807128906264
  					],
  					[
  						-127.44708251953121,
  						70.37731933593756
  					],
  					[
  						-125.75628662109378,
  						69.48071289062509
  					],
  					[
  						-121.47229003906253,
  						69.79791259765634
  					],
  					[
  						-113.89788818359366,
  						68.39892578124997
  					],
  					[
  						-109.94610595703121,
  						67.98107910156253
  					],
  					[
  						-106.15002441406247,
  						68.80010986328128
  					],
  					[
  						-104.33789062499993,
  						68.0181274414063
  					],
  					[
  						-98.44317626953122,
  						67.78167724609386
  					],
  					[
  						-94.23278808593744,
  						69.06909179687509
  					],
  					[
  						-96.47131347656241,
  						70.08990478515634
  					],
  					[
  						-92.87811279296872,
  						71.3187255859375
  					],
  					[
  						-90.54711914062494,
  						69.49768066406259
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-114.16716999999998,
  						73.12145000000001
  					],
  					[
  						-111.05039000000004,
  						72.45040000000003
  					],
  					[
  						-105.40246,
  						72.67258999999999
  					],
  					[
  						-104.46476000000003,
  						70.99297000000007
  					],
  					[
  						-100.98078,
  						70.0243200000001
  					],
  					[
  						-102.4302399999999,
  						68.7528200000001
  					],
  					[
  						-105.96000000000006,
  						69.18000000000006
  					],
  					[
  						-113.31320000000008,
  						68.53553999999997
  					],
  					[
  						-116.10794000000003,
  						69.16821000000004
  					],
  					[
  						-119.40198999999998,
  						71.55859000000007
  					],
  					[
  						-117.86642,
  						72.70594000000008
  					],
  					[
  						-114.16716999999998,
  						73.12145000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-86.56217851433405,
  						73.15744700793854
  					],
  					[
  						-82.31559017610107,
  						73.75095083281067
  					],
  					[
  						-71.20001542833512,
  						70.92001251899723
  					],
  					[
  						-62.16317684594222,
  						66.16025136988961
  					],
  					[
  						-65.3201676093012,
  						64.38273712834615
  					],
  					[
  						-66.16556820338016,
  						61.93089712182589
  					],
  					[
  						-71.02343705919392,
  						62.91070811629584
  					],
  					[
  						-77.89728105336204,
  						65.3091922064747
  					],
  					[
  						-74.29388342964955,
  						65.81177134872931
  					],
  					[
  						-72.65116716173941,
  						67.28457550726387
  					],
  					[
  						-77.28736996123703,
  						69.76954010688328
  					],
  					[
  						-84.94470618359858,
  						69.9666340196444
  					],
  					[
  						-89.51341956252304,
  						70.7620376654809
  					],
  					[
  						-90.20516028518193,
  						72.23507436796072
  					],
  					[
  						-86.56217851433405,
  						73.15744700793854
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-100.35642000000006,
  						73.84389000000002
  					],
  					[
  						-97.12000000000006,
  						73.47000000000008
  					],
  					[
  						-96.71999999999991,
  						71.65999999999997
  					],
  					[
  						-102.50000000000004,
  						72.51000000000002
  					],
  					[
  						-100.35642000000006,
  						73.84389000000002
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-120.46000000000002,
  						71.39999999999995
  					],
  					[
  						-125.92896000000007,
  						71.86868000000004
  					],
  					[
  						-121.53787999999999,
  						74.44892999999996
  					],
  					[
  						-115.51081000000006,
  						73.47519
  					],
  					[
  						-119.22000000000007,
  						72.5200000000001
  					],
  					[
  						-120.46000000000002,
  						71.39999999999995
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						145.08628500000006,
  						75.56262499999997
  					],
  					[
  						138.95544000000004,
  						74.61148000000009
  					],
  					[
  						137.51176,
  						75.94916999999998
  					],
  					[
  						145.08628500000006,
  						75.56262499999997
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-108.21141000000001,
  						76.20167999999995
  					],
  					[
  						-106.31347000000001,
  						75.00526999999994
  					],
  					[
  						-112.22307000000004,
  						74.41695999999993
  					],
  					[
  						-117.71039999999999,
  						75.22220000000004
  					],
  					[
  						-115.40486999999997,
  						76.47887000000003
  					],
  					[
  						-108.21141000000001,
  						76.20167999999995
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						57.5356925799924,
  						70.72046397570224
  					],
  					[
  						53.6773751157842,
  						70.76265778266855
  					],
  					[
  						51.45575361512422,
  						72.01488108996514
  					],
  					[
  						55.631932814359715,
  						75.08141225859717
  					],
  					[
  						58.47708214705338,
  						74.30905630156283
  					],
  					[
  						55.4193359719109,
  						72.37126760526607
  					],
  					[
  						57.5356925799924,
  						70.72046397570224
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-94.68408586299947,
  						77.09787832305838
  					],
  					[
  						-89.1870828925999,
  						75.61016551380763
  					],
  					[
  						-81.12853084992429,
  						75.713983466282
  					],
  					[
  						-79.83393286814842,
  						74.9231273464872
  					],
  					[
  						-88.15035030796034,
  						74.39230703398508
  					],
  					[
  						-92.42244096552943,
  						74.83775788034109
  					],
  					[
  						-94.68408586299947,
  						77.09787832305838
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						106.97027587890628,
  						76.97430419921875
  					],
  					[
  						111.07727050781253,
  						76.71008300781253
  					],
  					[
  						113.88549804687509,
  						75.327880859375
  					],
  					[
  						109.40008544921884,
  						74.18011474609372
  					],
  					[
  						113.96887207031253,
  						73.5949096679688
  					],
  					[
  						126.97650146484384,
  						73.56549072265625
  					],
  					[
  						128.46008300781253,
  						71.9801025390625
  					],
  					[
  						131.28869628906253,
  						70.78710937500006
  					],
  					[
  						133.85772705078134,
  						71.38647460937503
  					],
  					[
  						139.86987304687509,
  						71.4879150390625
  					],
  					[
  						140.46807861328128,
  						72.84948730468753
  					],
  					[
  						149.50012207031253,
  						72.20007324218756
  					],
  					[
  						152.96887207031259,
  						70.84228515625
  					],
  					[
  						157.00689697265628,
  						71.031494140625
  					],
  					[
  						160.94067382812503,
  						69.43731689453125
  					],
  					[
  						167.83569335937509,
  						69.58270263671878
  					],
  					[
  						170.45349121093753,
  						70.09710693359378
  					],
  					[
  						175.72412109374997,
  						69.87731933593747
  					],
  					[
  						180.00000000000014,
  						68.96372213254719
  					],
  					[
  						180.00000000000014,
  						64.97958425748152
  					],
  					[
  						178.31311035156264,
  						64.07592773437497
  					],
  					[
  						179.37048339843759,
  						62.98272705078122
  					],
  					[
  						173.68011474609384,
  						61.65270996093753
  					],
  					[
  						170.69848632812503,
  						60.3363037109375
  					],
  					[
  						166.29510498046878,
  						59.7886962890625
  					],
  					[
  						163.53930664062509,
  						59.86871337890625
  					],
  					[
  						162.01727294921878,
  						58.2432861328125
  					],
  					[
  						163.19189453125009,
  						57.61511230468753
  					],
  					[
  						162.11749267578134,
  						54.85528564453128
  					],
  					[
  						156.78991699218753,
  						51.01110839843753
  					],
  					[
  						155.43371582031253,
  						55.381103515625
  					],
  					[
  						156.81048583984384,
  						57.83209228515628
  					],
  					[
  						158.36431884765628,
  						58.05572509765628
  					],
  					[
  						160.12152099609384,
  						60.5443115234375
  					],
  					[
  						159.30230712890628,
  						61.77410888671878
  					],
  					[
  						156.72070312500003,
  						61.43450927734378
  					],
  					[
  						154.21807861328128,
  						59.75830078125
  					],
  					[
  						151.26568603515628,
  						58.78088378906253
  					],
  					[
  						145.48730468750009,
  						59.33648681640625
  					],
  					[
  						142.19787597656259,
  						59.04010009765628
  					],
  					[
  						135.12628173828128,
  						54.72967529296878
  					],
  					[
  						137.19348144531259,
  						53.977294921875
  					],
  					[
  						139.90148925781253,
  						54.189697265625
  					],
  					[
  						141.34527587890628,
  						53.0897216796875
  					],
  					[
  						140.06207275390628,
  						48.44671630859381
  					],
  					[
  						138.21972656250009,
  						46.30792236328122
  					],
  					[
  						134.86950683593753,
  						43.39831542968753
  					],
  					[
  						132.27807617187509,
  						43.28448486328122
  					],
  					[
  						129.66748046875009,
  						41.60107421875
  					],
  					[
  						129.70532226562509,
  						40.88287353515625
  					],
  					[
  						127.53350830078128,
  						39.75689697265628
  					],
  					[
  						129.46051025390634,
  						36.78430175781253
  					],
  					[
  						129.09149169921878,
  						35.08251953125
  					],
  					[
  						126.48571777343759,
  						34.39007568359375
  					],
  					[
  						126.17468261718753,
  						37.74969482421878
  					],
  					[
  						124.71228027343759,
  						38.10827636718753
  					],
  					[
  						125.38671875000009,
  						39.38787841796872
  					],
  					[
  						124.26568603515634,
  						39.92852783203125
  					],
  					[
  						122.13153076171884,
  						39.17047119140625
  					],
  					[
  						121.37689208984384,
  						39.75030517578125
  					],
  					[
  						117.53271484375009,
  						38.7376708984375
  					],
  					[
  						119.70288085937503,
  						37.156494140625
  					],
  					[
  						120.82348632812509,
  						37.87048339843747
  					],
  					[
  						122.35791015625003,
  						37.45452880859378
  					],
  					[
  						119.15130615234384,
  						34.909912109375
  					],
  					[
  						120.22747802734378,
  						34.36047363281247
  					],
  					[
  						121.90808105468759,
  						31.69232177734375
  					],
  					[
  						122.09210205078128,
  						29.832519531250057
  					],
  					[
  						121.12567138671878,
  						28.13568115234375
  					],
  					[
  						118.65692138671884,
  						24.5474853515625
  					],
  					[
  						115.89068603515634,
  						22.78289794921875
  					],
  					[
  						111.84368896484384,
  						21.55047607421875
  					],
  					[
  						108.52288818359384,
  						21.71527099609375
  					],
  					[
  						106.71508789062509,
  						20.69689941406247
  					],
  					[
  						105.66210937500003,
  						19.058288574218807
  					],
  					[
  						107.36187744140634,
  						16.697509765625
  					],
  					[
  						108.87707519531259,
  						15.276672363281307
  					],
  					[
  						109.33532714843759,
  						13.426086425781222
  					],
  					[
  						109.20007324218759,
  						11.6668701171875
  					],
  					[
  						105.15832519531259,
  						8.59967041015625
  					],
  					[
  						105.07629394531259,
  						9.918518066406264
  					],
  					[
  						103.49731445312509,
  						10.632690429687486
  					],
  					[
  						102.58508300781253,
  						12.186706542968736
  					],
  					[
  						100.97851562500003,
  						13.412719726562543
  					],
  					[
  						100.01867675781259,
  						12.307128906250057
  					],
  					[
  						99.15368652343759,
  						9.963073730468778
  					],
  					[
  						100.45928955078134,
  						7.429687499999986
  					],
  					[
  						101.62310791015628,
  						6.740722656250057
  					],
  					[
  						103.38128662109378,
  						4.855102539062543
  					],
  					[
  						103.51971435546884,
  						1.2263183593749858
  					],
  					[
  						101.39068603515628,
  						2.7609252929687784
  					],
  					[
  						100.19671630859378,
  						5.312500000000057
  					],
  					[
  						100.30627441406253,
  						6.040710449218793
  					],
  					[
  						98.50390625000003,
  						8.38232421875
  					],
  					[
  						98.50970458984384,
  						13.122497558593778
  					],
  					[
  						97.16467285156253,
  						16.92871093750003
  					],
  					[
  						95.36932373046884,
  						15.714477539062528
  					],
  					[
  						94.18890380859378,
  						16.038085937500057
  					],
  					[
  						94.32489013671884,
  						18.21350097656253
  					],
  					[
  						92.36853027343753,
  						20.6708984375
  					],
  					[
  						91.41711425781259,
  						22.76507568359375
  					],
  					[
  						90.27288818359384,
  						21.83648681640625
  					],
  					[
  						86.97570800781253,
  						21.49548339843753
  					],
  					[
  						86.49932861328128,
  						20.151672363281307
  					],
  					[
  						83.94110107421878,
  						18.30212402343747
  					],
  					[
  						80.32489013671878,
  						15.8992919921875
  					],
  					[
  						80.28631591796884,
  						13.006286621093736
  					],
  					[
  						79.85809326171884,
  						10.357299804687514
  					],
  					[
  						77.53991699218759,
  						7.965515136718793
  					],
  					[
  						76.59307861328128,
  						8.899291992187486
  					],
  					[
  						74.86492919921878,
  						12.741882324218778
  					],
  					[
  						74.44390869140634,
  						14.617309570312557
  					],
  					[
  						73.53430175781259,
  						15.99072265625
  					],
  					[
  						72.82092285156253,
  						19.20831298828122
  					],
  					[
  						72.63067626953134,
  						21.35607910156247
  					],
  					[
  						70.47052001953134,
  						20.877319335937557
  					],
  					[
  						69.16412353515628,
  						22.08929443359375
  					],
  					[
  						69.34967041015634,
  						22.843322753906307
  					],
  					[
  						67.44372558593753,
  						23.94488525390628
  					],
  					[
  						66.37292480468753,
  						25.425292968750057
  					],
  					[
  						61.497497558593835,
  						25.07830810546875
  					],
  					[
  						57.397277832031335,
  						25.73992919921872
  					],
  					[
  						56.492126464843835,
  						27.14331054687503
  					],
  					[
  						54.71508789062503,
  						26.48071289062503
  					],
  					[
  						51.52087402343753,
  						27.86572265625003
  					],
  					[
  						50.115112304687585,
  						30.147888183593807
  					],
  					[
  						48.94128417968753,
  						30.317077636718807
  					],
  					[
  						48.093872070312585,
  						29.306274414062557
  					],
  					[
  						48.80767822265628,
  						27.689697265625057
  					],
  					[
  						51.589111328125085,
  						25.80108642578125
  					],
  					[
  						51.79449462890628,
  						24.0198974609375
  					],
  					[
  						54.008117675781335,
  						24.12188720703128
  					],
  					[
  						55.439086914062585,
  						25.4390869140625
  					],
  					[
  						57.40350341796878,
  						23.878723144531307
  					],
  					[
  						58.72930908203128,
  						23.565673828125
  					],
  					[
  						59.80627441406253,
  						22.31048583984378
  					],
  					[
  						57.78869628906253,
  						19.06768798828128
  					],
  					[
  						55.27490234375003,
  						17.228271484375057
  					],
  					[
  						52.385314941406335,
  						16.38250732421875
  					],
  					[
  						52.168273925781335,
  						15.597473144531278
  					],
  					[
  						49.57470703125003,
  						14.708679199218722
  					],
  					[
  						48.67932128906253,
  						14.003295898437514
  					],
  					[
  						43.48309326171878,
  						12.636901855468793
  					],
  					[
  						42.64971923828128,
  						16.77471923828122
  					],
  					[
  						40.93927001953128,
  						19.48651123046875
  					],
  					[
  						39.13952636718753,
  						21.29187011718753
  					],
  					[
  						38.49291992187503,
  						23.68847656249997
  					],
  					[
  						35.130310058593835,
  						28.0634765625
  					],
  					[
  						33.34887695312503,
  						27.69989013671878
  					],
  					[
  						35.692504882812585,
  						23.926696777343807
  					],
  					[
  						35.52612304687503,
  						23.10247802734375
  					],
  					[
  						36.866271972656335,
  						22.0001220703125
  					],
  					[
  						37.481872558593835,
  						18.61407470703122
  					],
  					[
  						38.410095214843835,
  						17.99829101562497
  					],
  					[
  						39.266113281250085,
  						15.9227294921875
  					],
  					[
  						41.17932128906253,
  						14.4910888671875
  					],
  					[
  						43.317871093750085,
  						12.390075683593778
  					],
  					[
  						44.117919921875085,
  						10.445678710937486
  					],
  					[
  						46.64550781250003,
  						10.816528320312543
  					],
  					[
  						51.111328125000085,
  						12.024719238281278
  					],
  					[
  						51.04528808593753,
  						10.640930175781264
  					],
  					[
  						49.452697753906335,
  						6.804687500000028
  					],
  					[
  						48.594482421875085,
  						5.339111328125057
  					],
  					[
  						46.564880371093835,
  						2.855285644531236
  					],
  					[
  						43.136108398437585,
  						0.29229736328125
  					],
  					[
  						41.58508300781253,
  						-1.6832275390625
  					],
  					[
  						40.26312255859378,
  						-2.573120117187514
  					],
  					[
  						38.74047851562503,
  						-5.90887451171875
  					],
  					[
  						39.44012451171878,
  						-6.840026855468736
  					],
  					[
  						39.18652343750003,
  						-8.485473632812472
  					],
  					[
  						40.478515625000085,
  						-10.765380859375014
  					],
  					[
  						40.77551269531253,
  						-14.691711425781236
  					],
  					[
  						39.45269775390628,
  						-16.720886230468764
  					],
  					[
  						37.41107177734378,
  						-17.586303710937486
  					],
  					[
  						34.786499023437585,
  						-19.78399658203128
  					],
  					[
  						35.562683105468835,
  						-22.09002685546872
  					],
  					[
  						35.45867919921878,
  						-24.12261962890625
  					],
  					[
  						33.01330566406253,
  						-25.357482910156207
  					],
  					[
  						32.46228027343753,
  						-28.301025390624986
  					],
  					[
  						30.055725097656335,
  						-31.14019775390622
  					],
  					[
  						28.21972656250003,
  						-32.77191162109379
  					],
  					[
  						25.78070068359375,
  						-33.94458007812497
  					],
  					[
  						22.57427978515628,
  						-33.86407470703121
  					],
  					[
  						19.61651611328125,
  						-34.81909179687497
  					],
  					[
  						18.24450683593753,
  						-33.86767578125003
  					],
  					[
  						18.2216796875,
  						-31.661621093750014
  					],
  					[
  						15.210510253906307,
  						-27.090881347656207
  					],
  					[
  						14.257690429687557,
  						-22.111206054687486
  					],
  					[
  						12.608703613281307,
  						-19.04528808593753
  					],
  					[
  						11.64007568359375,
  						-16.673095703125014
  					],
  					[
  						12.175720214843807,
  						-14.449096679687486
  					],
  					[
  						13.63372802734375,
  						-12.038574218749972
  					],
  					[
  						13.236511230468722,
  						-8.562622070312472
  					],
  					[
  						11.915100097656222,
  						-5.037902832031278
  					],
  					[
  						8.798095703125057,
  						-1.1113281250000142
  					],
  					[
  						9.7952880859375,
  						3.073486328124986
  					],
  					[
  						8.50030517578125,
  						4.7720947265625
  					],
  					[
  						5.898315429687528,
  						4.262512207031222
  					],
  					[
  						4.32568359375,
  						6.27069091796875
  					],
  					[
  						1.06011962890625,
  						5.92889404296875
  					],
  					[
  						-1.9647216796874716,
  						4.710510253906278
  					],
  					[
  						-4.008789062499943,
  						5.179870605468736
  					],
  					[
  						-7.518920898437472,
  						4.338317871093793
  					],
  					[
  						-9.004821777343693,
  						4.832519531250057
  					],
  					[
  						-12.948974609375,
  						7.798706054687528
  					],
  					[
  						-13.24652099609375,
  						8.903076171875043
  					],
  					[
  						-14.839477539062443,
  						10.876708984375043
  					],
  					[
  						-16.61376953125,
  						12.170898437500014
  					],
  					[
  						-17.18518066406247,
  						14.919494628906278
  					],
  					[
  						-16.463012695312443,
  						16.13507080078128
  					],
  					[
  						-16.27777099609375,
  						20.09252929687503
  					],
  					[
  						-17.06341552734375,
  						20.99987792968747
  					],
  					[
  						-15.98260498046875,
  						23.7235107421875
  					],
  					[
  						-15.089294433593722,
  						24.52032470703128
  					],
  					[
  						-14.439880371093778,
  						26.254516601562557
  					],
  					[
  						-12.618774414062472,
  						28.03833007812503
  					],
  					[
  						-11.68890380859375,
  						28.14868164062503
  					],
  					[
  						-9.564819335937443,
  						29.93371582031247
  					],
  					[
  						-9.814697265624972,
  						31.177673339843807
  					],
  					[
  						-8.657409667968722,
  						33.24029541015622
  					],
  					[
  						-6.912475585937472,
  						34.11047363281253
  					],
  					[
  						-5.929992675781222,
  						35.76007080078131
  					],
  					[
  						-2.169921874999943,
  						35.16851806640631
  					],
  					[
  						1.4669189453125568,
  						36.60571289062497
  					],
  					[
  						9.510070800781278,
  						37.35009765625
  					],
  					[
  						10.93951416015625,
  						35.6990966796875
  					],
  					[
  						10.149719238281278,
  						34.33068847656253
  					],
  					[
  						11.108520507812528,
  						33.29327392578128
  					],
  					[
  						15.2457275390625,
  						32.26507568359372
  					],
  					[
  						15.713928222656278,
  						31.37628173828125
  					],
  					[
  						19.08648681640628,
  						30.2664794921875
  					],
  					[
  						20.8544921875,
  						32.70690917968747
  					],
  					[
  						26.49530029296878,
  						31.585693359375
  					],
  					[
  						28.91351318359375,
  						30.870117187500057
  					],
  					[
  						30.97692871093753,
  						31.55590820312497
  					],
  					[
  						32.993896484375085,
  						31.02410888671878
  					],
  					[
  						34.265502929687585,
  						31.219482421875
  					],
  					[
  						35.99847412109378,
  						34.6448974609375
  					],
  					[
  						36.14990234375003,
  						35.82147216796878
  					],
  					[
  						34.71447753906253,
  						36.79547119140628
  					],
  					[
  						32.50927734375003,
  						36.10748291015628
  					],
  					[
  						30.621704101562585,
  						36.67791748046872
  					],
  					[
  						29.700073242187585,
  						36.14428710937503
  					],
  					[
  						27.64129638671875,
  						36.65887451171875
  					],
  					[
  						26.31829833984378,
  						38.20812988281253
  					],
  					[
  						26.170898437500057,
  						39.46368408203122
  					],
  					[
  						29.240112304687585,
  						41.2200927734375
  					],
  					[
  						31.145874023437585,
  						41.08770751953122
  					],
  					[
  						33.51330566406253,
  						42.01910400390628
  					],
  					[
  						35.16772460937503,
  						42.04028320312503
  					],
  					[
  						38.347717285156335,
  						40.94873046875006
  					],
  					[
  						41.554077148437585,
  						41.53570556640628
  					],
  					[
  						41.45349121093753,
  						42.64508056640625
  					],
  					[
  						37.53912353515628,
  						44.65728759765631
  					],
  					[
  						38.233093261718835,
  						46.24090576171875
  					],
  					[
  						37.42510986328128,
  						47.02227783203128
  					],
  					[
  						33.29870605468753,
  						46.0806884765625
  					],
  					[
  						30.74890136718753,
  						46.58312988281256
  					],
  					[
  						28.837890625,
  						44.91387939453125
  					],
  					[
  						27.673889160156307,
  						42.57788085937503
  					],
  					[
  						28.115478515625,
  						41.6229248046875
  					],
  					[
  						26.358093261718807,
  						40.15209960937503
  					],
  					[
  						22.84967041015625,
  						39.6593017578125
  					],
  					[
  						24.040100097656307,
  						37.65509033203128
  					],
  					[
  						21.67010498046878,
  						36.84509277343747
  					],
  					[
  						21.12011718750003,
  						38.31030273437506
  					],
  					[
  						19.4061279296875,
  						40.25091552734378
  					],
  					[
  						19.540100097656307,
  						41.7200927734375
  					],
  					[
  						16.015502929687557,
  						43.50732421875003
  					],
  					[
  						14.901672363281278,
  						45.07611083984378
  					],
  					[
  						13.1417236328125,
  						45.7366943359375
  					],
  					[
  						12.589294433593778,
  						44.09149169921872
  					],
  					[
  						15.8892822265625,
  						41.54107666015622
  					],
  					[
  						17.519287109375,
  						40.87707519531253
  					],
  					[
  						16.44873046875003,
  						39.79547119140622
  					],
  					[
  						12.106689453125057,
  						41.70452880859372
  					],
  					[
  						8.888916015625,
  						44.36627197265625
  					],
  					[
  						6.529296875000057,
  						43.12890625000003
  					],
  					[
  						3.1005249023437784,
  						43.07531738281253
  					],
  					[
  						3.0394897460937784,
  						41.89208984375003
  					],
  					[
  						0.8104858398437784,
  						41.01470947265628
  					],
  					[
  						-0.6834106445312784,
  						37.64227294921872
  					],
  					[
  						-2.14642333984375,
  						36.67407226562506
  					],
  					[
  						-8.898803710937472,
  						36.86889648437503
  					],
  					[
  						-9.526489257812472,
  						38.73748779296875
  					],
  					[
  						-8.768676757812443,
  						40.76068115234372
  					],
  					[
  						-8.984375,
  						42.5928955078125
  					],
  					[
  						-7.978210449218722,
  						43.74847412109375
  					],
  					[
  						-1.9013061523437216,
  						43.42291259765628
  					],
  					[
  						-1.19378662109375,
  						46.014892578125
  					],
  					[
  						-2.963195800781193,
  						47.5703125
  					],
  					[
  						-0.9893798828124432,
  						49.34747314453122
  					],
  					[
  						1.33868408203125,
  						50.1273193359375
  					],
  					[
  						3.830322265625057,
  						51.6204833984375
  					],
  					[
  						4.70611572265625,
  						53.0919189453125
  					],
  					[
  						9.939697265625028,
  						54.59667968749997
  					],
  					[
  						14.119689941406307,
  						53.75708007812497
  					],
  					[
  						17.622924804687557,
  						54.85168457031256
  					],
  					[
  						19.66070556640628,
  						54.42608642578125
  					],
  					[
  						21.26849365234378,
  						55.19049072265628
  					],
  					[
  						21.09051513671875,
  						56.78387451171875
  					],
  					[
  						27.98107910156247,
  						59.47552490234375
  					],
  					[
  						28.070129394531307,
  						60.50347900390625
  					],
  					[
  						22.86968994140625,
  						59.84649658203125
  					],
  					[
  						21.322326660156307,
  						60.72027587890628
  					],
  					[
  						21.059326171875,
  						62.60748291015625
  					],
  					[
  						25.3980712890625,
  						65.11151123046872
  					],
  					[
  						22.183288574218807,
  						65.72387695312497
  					],
  					[
  						21.36968994140628,
  						64.41369628906256
  					],
  					[
  						17.847900390625057,
  						62.74951171875003
  					],
  					[
  						17.11968994140625,
  						61.34130859375003
  					],
  					[
  						18.78771972656253,
  						60.08190917968753
  					],
  					[
  						16.829284667968807,
  						58.71990966796872
  					],
  					[
  						15.879882812500057,
  						56.10430908203128
  					],
  					[
  						12.6251220703125,
  						56.30712890625
  					],
  					[
  						10.356689453125057,
  						59.46990966796875
  					],
  					[
  						8.382080078125028,
  						58.31329345703125
  					],
  					[
  						5.6658935546875,
  						58.58807373046878
  					],
  					[
  						4.99212646484375,
  						61.97113037109378
  					],
  					[
  						10.5277099609375,
  						64.48608398437506
  					],
  					[
  						14.761291503906278,
  						67.81072998046875
  					],
  					[
  						19.184082031250057,
  						69.81750488281256
  					],
  					[
  						28.16552734375,
  						71.18548583984375
  					],
  					[
  						33.775512695312585,
  						69.301513671875
  					],
  					[
  						40.29248046875003,
  						67.93249511718747
  					],
  					[
  						41.12609863281253,
  						66.7916870117188
  					],
  					[
  						38.38287353515628,
  						65.99951171875
  					],
  					[
  						34.81488037109378,
  						65.90008544921878
  					],
  					[
  						34.94390869140628,
  						64.41448974609372
  					],
  					[
  						43.949890136718835,
  						66.06909179687506
  					],
  					[
  						53.717529296875085,
  						68.85748291015625
  					],
  					[
  						57.317077636718835,
  						68.46630859375003
  					],
  					[
  						63.50408935546878,
  						69.54748535156253
  					],
  					[
  						66.93011474609384,
  						69.45471191406253
  					],
  					[
  						66.69470214843753,
  						71.02911376953128
  					],
  					[
  						69.94012451171878,
  						73.04010009765625
  					],
  					[
  						75.68347167968753,
  						72.30047607421878
  					],
  					[
  						79.65209960937509,
  						72.32012939453128
  					],
  					[
  						80.51110839843759,
  						73.64831542968756
  					],
  					[
  						86.82232666015634,
  						73.93688964843753
  					],
  					[
  						87.16687011718759,
  						75.11651611328122
  					],
  					[
  						98.92248535156253,
  						76.44689941406247
  					],
  					[
  						104.35168457031253,
  						77.69787597656253
  					],
  					[
  						106.97027587890628,
  						76.97430419921875
  					]
  				],
  				[
  					[
  						49.11029052734378,
  						41.28228759765625
  					],
  					[
  						49.618896484375085,
  						40.57287597656253
  					],
  					[
  						49.19970703125003,
  						37.5828857421875
  					],
  					[
  						50.842285156250085,
  						36.87292480468756
  					],
  					[
  						53.825927734375085,
  						36.965087890625
  					],
  					[
  						53.88092041015628,
  						38.95208740234378
  					],
  					[
  						52.69409179687503,
  						40.03369140624997
  					],
  					[
  						54.736877441406335,
  						40.95111083984381
  					],
  					[
  						53.72167968750003,
  						42.12329101562497
  					],
  					[
  						51.34252929687503,
  						43.13311767578131
  					],
  					[
  						51.31689453125003,
  						45.24609374999997
  					],
  					[
  						53.040893554687585,
  						45.25909423828125
  					],
  					[
  						53.04272460937503,
  						46.85308837890628
  					],
  					[
  						51.192077636718835,
  						47.04870605468753
  					],
  					[
  						47.675903320312585,
  						45.64147949218756
  					],
  					[
  						46.68212890625003,
  						44.60931396484381
  					],
  					[
  						47.492492675781335,
  						42.9866943359375
  					],
  					[
  						49.11029052734378,
  						41.28228759765625
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						18.25183000000007,
  						79.70175000000009
  					],
  					[
  						19.027370000000047,
  						78.56260000000006
  					],
  					[
  						13.762590000000046,
  						77.38034999999996
  					],
  					[
  						10.4445300000001,
  						79.65239000000003
  					],
  					[
  						18.25183000000007,
  						79.70175000000009
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-87.02000000000007,
  						79.65999999999997
  					],
  					[
  						-92.87668999999994,
  						78.34332999999995
  					],
  					[
  						-96.70972000000006,
  						80.15777000000011
  					],
  					[
  						-87.02000000000007,
  						79.65999999999997
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-68.50000000000006,
  						83.10632151676583
  					],
  					[
  						-61.89388000000005,
  						82.36165
  					],
  					[
  						-71.18000000000004,
  						79.8000000000001
  					],
  					[
  						-79.75951000000006,
  						77.20967999999999
  					],
  					[
  						-80.56125000000006,
  						76.17812000000006
  					],
  					[
  						-89.49068000000003,
  						76.47238999999999
  					],
  					[
  						-85.09494999999995,
  						79.34543000000005
  					],
  					[
  						-91.58701999999997,
  						81.89429000000004
  					],
  					[
  						-79.30663999999999,
  						83.13056000000003
  					],
  					[
  						-68.50000000000006,
  						83.10632151676583
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-27.10045999999997,
  						83.51966000000004
  					],
  					[
  						-12.208549999999917,
  						81.29154000000005
  					],
  					[
  						-19.70498999999998,
  						78.7512800000001
  					],
  					[
  						-18.472849999999937,
  						76.98565000000002
  					],
  					[
  						-19.37280999999996,
  						74.29561000000007
  					],
  					[
  						-23.442959999999943,
  						72.08016000000006
  					],
  					[
  						-22.349019999999967,
  						70.12945999999997
  					],
  					[
  						-27.74736999999999,
  						68.47046000000006
  					],
  					[
  						-32.81105000000002,
  						67.73547000000005
  					],
  					[
  						-36.3528399999999,
  						65.97890000000007
  					],
  					[
  						-39.81221999999997,
  						65.45848000000004
  					],
  					[
  						-43.37840000000003,
  						60.097720000000095
  					],
  					[
  						-48.26293999999996,
  						60.85842999999994
  					],
  					[
  						-51.63324999999992,
  						63.62690999999998
  					],
  					[
  						-53.96910999999989,
  						67.18899000000008
  					],
  					[
  						-52.980399999999946,
  						68.35759000000002
  					],
  					[
  						-54.68335999999994,
  						69.61002999999994
  					],
  					[
  						-54.00422000000003,
  						71.54718999999997
  					],
  					[
  						-58.58515999999989,
  						75.51727000000011
  					],
  					[
  						-68.50438,
  						76.06140999999997
  					],
  					[
  						-73.15937999999989,
  						78.43270999999996
  					],
  					[
  						-62.651159999999976,
  						81.77042000000006
  					],
  					[
  						-46.76378999999997,
  						82.62795999999994
  					],
  					[
  						-38.622139999999945,
  						83.54904999999997
  					],
  					[
  						-27.10045999999997,
  						83.51966000000004
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	}
  ];
  var collection = {
  	type: type,
  	features: features
  };

  const WIDTH = 1000;
    const HEIGHT = 500;
    
    const svg = select('#map').append('svg')
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
    
    const paths = svg.selectAll('path')
      .data(collection.features)
      .enter()
      .append('path');
    
    paths.on('mouseover', e => {
      select(e.target).attr('fill', 'red');
    });
    
    paths.on('mouseout', e => {
      select(e.target).attr('fill', 'black');
    });
    
    let rotate = [0, 0, 0];
    
    const tick = () => {
      rotate = [rotate[0] + 0.5, 0, 0];
      const projection = geoAlbers()
        .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
        .rotate(rotate);
      const pathCreator = geoPath().projection(projection);
      paths.attr('d', pathCreator);
    };
    
    timer(tick);

}());
