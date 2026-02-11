import { COMPONENT_WHITELIST } from "./component-registry";

// Build the preview HTML for the sandboxed iframe
export function buildPreviewHTML(code: string): string {
  // Strip 'export default' - not valid in browser script context
  let cleanCode = code
    .replace(/export\s+default\s+function/g, "function")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+function/g, "function")
    .replace(/export\s+const/g, "const")
    .replace(/export\s+\{[^}]*\};?/g, "");

  // Also remove any import statements (not valid in script tags)
  cleanCode = cleanCode.replace(/^import\s+.*$/gm, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js" crossorigin><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0a0a0a; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    #error-display { display: none; position: fixed; top: 0; left: 0; right: 0; padding: 12px 16px; background: #fee2e2; border-bottom: 2px solid #ef4444; color: #991b1b; font-size: 13px; z-index: 9999; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div id="error-display"></div>
  <div id="root"></div>
  <script>
    // Recharts fallback - if CDN fails, provide stub components
    if (typeof Recharts === 'undefined') {
      var noop = function(props) { return React.createElement('div', null, props.children); };
      window.Recharts = {
        ResponsiveContainer: noop, BarChart: noop, LineChart: noop, AreaChart: noop, PieChart: noop,
        Bar: noop, Line: noop, Area: noop, Pie: noop, Cell: noop,
        XAxis: noop, YAxis: noop, CartesianGrid: noop, Tooltip: noop, Legend: noop
      };
    }
  <\/script>
  <script type="text/babel" data-type="module">
    ${getComponentDefinitions()}

    ${cleanCode}

    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(typeof GeneratedUI !== 'undefined' ? GeneratedUI : function() { return React.createElement('div', {style:{padding:'20px',color:'#991b1b'}}, 'Error: GeneratedUI function not found in generated code'); }));
    } catch (err) {
      document.getElementById('error-display').style.display = 'block';
      document.getElementById('error-display').textContent = 'Render Error: ' + err.message;
    }
  <\/script>
  <script>
    window.addEventListener('error', function(e) {
      var el = document.getElementById('error-display');
      if (el) { el.style.display = 'block'; el.textContent = 'Error: ' + (e.message || e); }
    });
  <\/script>
</body>
</html>`;
}

function getComponentDefinitions(): string {
  return `
// ─── Button Component ─────────────────────────────────
function Button({ children, variant = "primary", size = "md", disabled = false, onClick, icon, fullWidth = false, type = "button" }) {
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200",
    outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2.5",
  };
  return React.createElement("button", {
    type, disabled, onClick,
    className: \`inline-flex items-center justify-center font-medium transition-all duration-150 \${variantStyles[variant] || variantStyles.primary} \${sizeStyles[size] || sizeStyles.md} \${fullWidth ? "w-full" : ""} \${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}\`
  }, icon && React.createElement("span", null, icon), children);
}

// ─── Card Component ───────────────────────────────────
function Card({ title, subtitle, children, footer, variant = "default", padding = "md" }) {
  const variantStyles = { default: "bg-white border border-slate-200", outlined: "bg-transparent border-2 border-slate-300", elevated: "bg-white shadow-lg shadow-slate-200/50" };
  const paddingStyles = { sm: "p-3", md: "p-5", lg: "p-7" };
  return React.createElement("div", { className: \`rounded-xl overflow-hidden \${variantStyles[variant]}\` },
    React.createElement("div", { className: paddingStyles[padding] },
      title && React.createElement("div", { className: "mb-3" },
        React.createElement("h3", { className: "text-lg font-semibold text-slate-900" }, title),
        subtitle && React.createElement("p", { className: "text-sm text-slate-500 mt-0.5" }, subtitle)
      ),
      children
    ),
    footer && React.createElement("div", { className: "px-5 py-3 bg-slate-50 border-t border-slate-200" }, footer)
  );
}

// ─── Input Component ──────────────────────────────────
function Input({ label, placeholder, type = "text", error, helperText, disabled = false, value, onChange, icon }) {
  return React.createElement("div", { className: "w-full" },
    label && React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label),
    React.createElement("div", { className: "relative" },
      icon && React.createElement("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" }, icon),
      React.createElement("input", {
        type, placeholder, disabled, value, onChange,
        className: \`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 \${icon ? "pl-9" : ""} \${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"} \${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}\`
      })
    ),
    error && React.createElement("p", { className: "mt-1.5 text-xs text-red-600" }, error),
    helperText && !error && React.createElement("p", { className: "mt-1.5 text-xs text-slate-500" }, helperText)
  );
}

// ─── Table Component ──────────────────────────────────
function Table({ columns, data, striped = false, hoverable = true, compact = false }) {
  return React.createElement("div", { className: "w-full overflow-x-auto rounded-xl border border-slate-200" },
    React.createElement("table", { className: "w-full text-sm text-left" },
      React.createElement("thead", null,
        React.createElement("tr", { className: "bg-slate-50 border-b border-slate-200" },
          columns.map(function(col) {
            return React.createElement("th", { key: col.key, className: \`font-semibold text-slate-600 uppercase tracking-wider text-xs \${compact ? "px-3 py-2" : "px-4 py-3"}\`, style: col.width ? { width: col.width } : undefined }, col.header);
          })
        )
      ),
      React.createElement("tbody", null,
        data.map(function(row, i) {
          return React.createElement("tr", { key: i, className: \`border-b border-slate-100 last:border-0 transition-colors \${striped && i % 2 === 1 ? "bg-slate-50" : "bg-white"} \${hoverable ? "hover:bg-indigo-50/50" : ""}\` },
            columns.map(function(col) {
              return React.createElement("td", { key: col.key, className: \`text-slate-700 \${compact ? "px-3 py-1.5" : "px-4 py-3"}\` }, row[col.key]);
            })
          );
        }),
        data.length === 0 && React.createElement("tr", null, React.createElement("td", { colSpan: columns.length, className: "px-4 py-8 text-center text-slate-400" }, "No data available"))
      )
    )
  );
}

// ─── Modal Component ──────────────────────────────────
function Modal({ isOpen, onClose, title, children, footer, size = "md" }) {
  const sizeStyles = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" };
  if (!isOpen) return null;
  return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center" },
    React.createElement("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm", onClick: onClose }),
    React.createElement("div", { className: \`relative bg-white rounded-2xl shadow-2xl w-full mx-4 \${sizeStyles[size]} animate-[fadeIn_0.2s_ease-out]\` },
      title && React.createElement("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-200" },
        React.createElement("h2", { className: "text-lg font-semibold text-slate-900" }, title),
        React.createElement("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none" }, "✕")
      ),
      React.createElement("div", { className: "px-6 py-5" }, children),
      footer && React.createElement("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end gap-2" }, footer)
    )
  );
}

// ─── Sidebar Component ────────────────────────────────
function Sidebar({ items, collapsed = false, header, footer }) {
  function renderItem(item, depth) {
    depth = depth || 0;
    return React.createElement("div", { key: item.label },
      React.createElement("a", { href: item.href || "#", className: \`flex items-center gap-3 rounded-lg transition-all duration-150 \${collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"} \${depth > 0 ? "ml-4" : ""} \${item.active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}\` },
        item.icon && React.createElement("span", { className: "text-lg flex-shrink-0" }, item.icon),
        !collapsed && React.createElement("span", { className: "text-sm" }, item.label)
      ),
      item.children && !collapsed && item.children.map(function(child) { return renderItem(child, depth + 1); })
    );
  }
  return React.createElement("div", { className: \`flex flex-col bg-white border-r border-slate-200 h-full \${collapsed ? "w-16" : "w-64"} transition-all duration-200\` },
    header && React.createElement("div", { className: "px-4 py-4 border-b border-slate-200" }, header),
    React.createElement("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto" }, items.map(function(item) { return renderItem(item); })),
    footer && React.createElement("div", { className: "px-4 py-3 border-t border-slate-200" }, footer)
  );
}

// ─── Navbar Component ─────────────────────────────────
function Navbar({ brand, items = [], actions, sticky = true }) {
  return React.createElement("nav", { className: \`w-full bg-white border-b border-slate-200 z-40 \${sticky ? "sticky top-0" : ""}\` },
    React.createElement("div", { className: "flex items-center justify-between px-6 h-16" },
      React.createElement("div", { className: "flex items-center gap-8" },
        brand && React.createElement("div", { className: "text-lg font-bold text-slate-900" }, brand),
        React.createElement("div", { className: "flex items-center gap-1" },
          items.map(function(item) {
            return React.createElement("a", { key: item.label, href: item.href || "#", className: \`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 \${item.active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}\` }, item.label);
          })
        )
      ),
      actions && React.createElement("div", { className: "flex items-center gap-3" }, actions)
    )
  );
}

// ─── Chart Component ──────────────────────────────────
function Chart({ type = "bar", data, title, xKey = "name", yKey = "value", color = "#6366f1" }) {
  var COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  var RC = Recharts;
  function renderChart() {
    switch (type) {
      case "line":
        return React.createElement(RC.LineChart, { data: data },
          React.createElement(RC.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }),
          React.createElement(RC.XAxis, { dataKey: xKey, tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.YAxis, { tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.Tooltip, { contentStyle: { borderRadius: "8px", border: "1px solid #e2e8f0" } }),
          React.createElement(RC.Line, { type: "monotone", dataKey: yKey, stroke: color, strokeWidth: 2, dot: { r: 4, fill: color } })
        );
      case "pie":
        return React.createElement(RC.PieChart, null,
          React.createElement(RC.Pie, { data: data, cx: "50%", cy: "50%", outerRadius: 80, dataKey: yKey, label: true },
            data.map(function(_, i) { return React.createElement(RC.Cell, { key: i, fill: COLORS[i % COLORS.length] }); })
          ),
          React.createElement(RC.Tooltip, null)
        );
      case "area":
        return React.createElement(RC.AreaChart, { data: data },
          React.createElement(RC.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }),
          React.createElement(RC.XAxis, { dataKey: xKey, tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.YAxis, { tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.Tooltip, null),
          React.createElement(RC.Area, { type: "monotone", dataKey: yKey, stroke: color, fill: color + "33", strokeWidth: 2 })
        );
      default:
        return React.createElement(RC.BarChart, { data: data },
          React.createElement(RC.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }),
          React.createElement(RC.XAxis, { dataKey: xKey, tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.YAxis, { tick: { fontSize: 12 }, stroke: "#94a3b8" }),
          React.createElement(RC.Tooltip, { contentStyle: { borderRadius: "8px", border: "1px solid #e2e8f0" } }),
          React.createElement(RC.Bar, { dataKey: yKey, fill: color, radius: [4, 4, 0, 0] })
        );
    }
  }
  return React.createElement("div", { className: "w-full" },
    title && React.createElement("h4", { className: "text-sm font-semibold text-slate-700 mb-3" }, title),
    React.createElement("div", { className: "w-full h-64" },
      React.createElement(RC.ResponsiveContainer, { width: "100%", height: "100%" }, renderChart())
    )
  );
}

// ─── Badge Component ──────────────────────────────────
function Badge({ children, variant = "default", size = "md" }) {
  var variantStyles = { default: "bg-slate-100 text-slate-700", success: "bg-emerald-100 text-emerald-700", warning: "bg-amber-100 text-amber-700", error: "bg-red-100 text-red-700", info: "bg-blue-100 text-blue-700" };
  var sizeStyles = { sm: "px-2 py-0.5 text-xs", md: "px-2.5 py-1 text-xs" };
  return React.createElement("span", { className: \`inline-flex items-center font-medium rounded-full \${variantStyles[variant]} \${sizeStyles[size]}\` }, children);
}

// ─── Avatar Component ─────────────────────────────────
function Avatar({ src, alt = "", size = "md", fallback, status }) {
  var sizeStyles = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" };
  var statusColors = { online: "bg-emerald-400", offline: "bg-slate-400", away: "bg-amber-400" };
  return React.createElement("div", { className: "relative inline-flex" },
    src ?
      React.createElement("img", { src: src, alt: alt, className: \`rounded-full object-cover \${sizeStyles[size]}\` }) :
      React.createElement("div", { className: \`rounded-full flex items-center justify-center font-medium bg-indigo-100 text-indigo-700 \${sizeStyles[size]}\` }, fallback || "?"),
    status && React.createElement("span", { className: \`absolute bottom-0 right-0 block rounded-full ring-2 ring-white \${statusColors[status]} \${size === "sm" ? "w-2 h-2" : "w-3 h-3"}\` })
  );
}

// ─── Tabs Component ───────────────────────────────────
function Tabs({ tabs, defaultIndex = 0, variant = "underline" }) {
  var _s = React.useState(defaultIndex), activeIndex = _s[0], setActiveIndex = _s[1];
  var tabStyleFns = {
    underline: function(active) { return active ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 border-b-2 border-transparent hover:text-slate-700"; },
    pills: function(active) { return active ? "bg-indigo-600 text-white rounded-lg" : "text-slate-600 hover:bg-slate-100 rounded-lg"; },
    enclosed: function(active) { return active ? "bg-white text-slate-900 border border-slate-200 border-b-white rounded-t-lg -mb-px" : "text-slate-500 hover:text-slate-700"; }
  };
  return React.createElement("div", { className: "w-full" },
    React.createElement("div", { className: \`flex gap-1 \${variant !== "pills" ? "border-b border-slate-200" : ""}\` },
      tabs.map(function(tab, i) {
        return React.createElement("button", { key: i, onClick: function() { setActiveIndex(i); }, className: \`px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-2 \${tabStyleFns[variant](i === activeIndex)}\` },
          tab.icon && React.createElement("span", null, tab.icon), tab.label);
      })
    ),
    React.createElement("div", { className: "py-4" }, tabs[activeIndex] && tabs[activeIndex].content)
  );
}

// ─── Alert Component ──────────────────────────────────
function Alert({ variant = "info", title, children, dismissible = false, onDismiss }) {
  var _s = React.useState(true), visible = _s[0], setVisible = _s[1];
  var styles = { success: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "✓", title: "text-emerald-800" }, warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠", title: "text-amber-800" }, error: { bg: "bg-red-50", border: "border-red-200", icon: "✕", title: "text-red-800" }, info: { bg: "bg-blue-50", border: "border-blue-200", icon: "ℹ", title: "text-blue-800" } };
  var s = styles[variant];
  if (!visible) return null;
  return React.createElement("div", { className: \`rounded-xl border p-4 \${s.bg} \${s.border}\` },
    React.createElement("div", { className: "flex gap-3" },
      React.createElement("span", { className: "text-lg flex-shrink-0" }, s.icon),
      React.createElement("div", { className: "flex-1 min-w-0" },
        title && React.createElement("h4", { className: \`text-sm font-semibold \${s.title}\` }, title),
        children && React.createElement("div", { className: \`text-sm mt-1 \${s.title} opacity-80\` }, children)
      ),
      dismissible && React.createElement("button", { onClick: function() { setVisible(false); onDismiss && onDismiss(); }, className: \`text-sm \${s.title} opacity-60 hover:opacity-100 flex-shrink-0\` }, "✕")
    )
  );
}

// ─── Divider Component ────────────────────────────────
function Divider({ label, orientation = "horizontal" }) {
  if (orientation === "vertical") return React.createElement("div", { className: "w-px bg-slate-200 self-stretch mx-2" });
  if (label) return React.createElement("div", { className: "flex items-center gap-3 my-4" },
    React.createElement("div", { className: "flex-1 h-px bg-slate-200" }),
    React.createElement("span", { className: "text-xs font-medium text-slate-400 uppercase tracking-wider" }, label),
    React.createElement("div", { className: "flex-1 h-px bg-slate-200" })
  );
  return React.createElement("div", { className: "w-full h-px bg-slate-200 my-4" });
}

// ─── Select Component ─────────────────────────────────
function Select({ label, options, value, onChange, placeholder, error, disabled = false }) {
  return React.createElement("div", { className: "w-full" },
    label && React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label),
    React.createElement("select", { value: value, onChange: onChange, disabled: disabled, className: \`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 appearance-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 \${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"} \${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}\` },
      placeholder && React.createElement("option", { value: "", disabled: true }, placeholder),
      options.map(function(opt) { return React.createElement("option", { key: opt.value, value: opt.value }, opt.label); })
    ),
    error && React.createElement("p", { className: "mt-1.5 text-xs text-red-600" }, error)
  );
}

// ─── Textarea Component ───────────────────────────────
function Textarea({ label, placeholder, rows = 4, value, onChange, error, disabled = false, maxLength }) {
  return React.createElement("div", { className: "w-full" },
    label && React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label),
    React.createElement("textarea", { placeholder: placeholder, rows: rows, value: value, onChange: onChange, disabled: disabled, maxLength: maxLength, className: \`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 resize-y focus:outline-none focus:ring-2 focus:ring-offset-0 \${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"} \${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}\` }),
    error && React.createElement("p", { className: "mt-1.5 text-xs text-red-600" }, error)
  );
}

// ─── Toggle Component ─────────────────────────────────
function Toggle({ checked = false, onChange, label, disabled = false, size = "md" }) {
  var sizes = { sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" }, md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" } };
  var s = sizes[size];
  return React.createElement("label", { className: \`inline-flex items-center gap-3 select-none \${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}\` },
    React.createElement("button", { role: "switch", disabled: disabled, onClick: function() { onChange && onChange(!checked); }, className: \`relative inline-flex flex-shrink-0 rounded-full transition-colors duration-200 \${s.track} \${checked ? "bg-indigo-600" : "bg-slate-300"}\` },
      React.createElement("span", { className: \`inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 \${s.thumb} \${checked ? s.translate : "translate-x-0.5"} mt-0.5\` })
    ),
    label && React.createElement("span", { className: "text-sm text-slate-700" }, label)
  );
}

// ─── Tooltip Component ────────────────────────────────
function Tooltip({ content, children, position = "top" }) {
  var _s = React.useState(false), visible = _s[0], setVisible = _s[1];
  var posStyles = { top: "bottom-full left-1/2 -translate-x-1/2 mb-2", bottom: "top-full left-1/2 -translate-x-1/2 mt-2", left: "right-full top-1/2 -translate-y-1/2 mr-2", right: "left-full top-1/2 -translate-y-1/2 ml-2" };
  return React.createElement("div", { className: "relative inline-flex", onMouseEnter: function() { setVisible(true); }, onMouseLeave: function() { setVisible(false); } },
    children,
    visible && React.createElement("div", { className: \`absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg whitespace-nowrap shadow-lg \${posStyles[position]}\` }, content)
  );
}

// ─── ProgressBar Component ────────────────────────────
function ProgressBar({ value, variant = "default", size = "md", showLabel = false }) {
  var colors = { default: "bg-indigo-600", success: "bg-emerald-500", warning: "bg-amber-500", error: "bg-red-500" };
  var sizes = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  var v = Math.min(100, Math.max(0, value));
  return React.createElement("div", { className: "w-full" },
    showLabel && React.createElement("div", { className: "flex justify-between items-center mb-1.5" },
      React.createElement("span", { className: "text-xs font-medium text-slate-600" }, "Progress"),
      React.createElement("span", { className: "text-xs font-semibold text-slate-700" }, v + "%")
    ),
    React.createElement("div", { className: \`w-full bg-slate-200 rounded-full overflow-hidden \${sizes[size]}\` },
      React.createElement("div", { className: \`\${colors[variant]} rounded-full transition-all duration-500 ease-out h-full\`, style: { width: v + "%" } })
    )
  );
}

// ─── Stat Component ───────────────────────────────────
function Stat({ label, value, change, changeType, icon }) {
  return React.createElement("div", { className: "bg-white rounded-xl border border-slate-200 p-5" },
    React.createElement("div", { className: "flex items-start justify-between" },
      React.createElement("div", null,
        React.createElement("p", { className: "text-sm font-medium text-slate-500" }, label),
        React.createElement("p", { className: "mt-1 text-2xl font-bold text-slate-900" }, value)
      ),
      icon && React.createElement("div", { className: "flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-lg" }, icon)
    ),
    change && React.createElement("div", { className: "mt-3 flex items-center gap-1" },
      React.createElement("span", { className: \`text-xs font-semibold \${changeType === "increase" ? "text-emerald-600" : "text-red-600"}\` }, (changeType === "increase" ? "↑" : "↓") + " " + change),
      React.createElement("span", { className: "text-xs text-slate-400" }, "vs last period")
    )
  );
}
`;
}
