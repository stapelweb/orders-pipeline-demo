/* Компоненты дизайн-системы, переведённые из JSX в обычный JS при сборке.
   Собрано ds_split.py + ds_precompile.js, править здесь нечего:
   правка идёт в исходники .jsx внутри страницы, дальше пересборка. */
window.__dsCompiled = {
"components/core/Icon.jsx": function (React, NS) { with (NS) {
const BASE = "https://unpkg.com/lucide-static@0.417.0/icons";

/** Lucide-иконка как маска: цвет наследуется от currentColor. */
function Icon({
  name,
  size = 16,
  style,
  title
}) {
  const url = `${BASE}/${name}.svg`;
  return /*#__PURE__*/React.createElement("span", {
    role: title ? "img" : "presentation",
    "aria-label": title,
    style: {
      display: "inline-block",
      flex: "0 0 auto",
      width: size,
      height: size,
      background: "currentColor",
      WebkitMask: `url("${url}") center / contain no-repeat`,
      mask: `url("${url}") center / contain no-repeat`,
      ...style
    }
  });
}
;return {Icon,BASE};
} },
"components/core/Button.jsx": function (React, NS) { with (NS) {
const SIZES = {
  sm: {
    height: "var(--control-sm)",
    padding: "0 8px",
    font: "var(--type-label)"
  },
  md: {
    height: "var(--control-md)",
    padding: "0 12px",
    font: "var(--weight-medium) var(--text-sm) / 1 var(--font-ui)"
  },
  lg: {
    height: "var(--control-lg)",
    padding: "0 16px",
    font: "var(--weight-medium) var(--text-md) / 1 var(--font-ui)"
  }
};
const TONES = {
  primary: {
    background: "var(--accent)",
    color: "var(--text-on-accent)",
    border: "1px solid transparent"
  },
  secondary: {
    background: "var(--surface-3)",
    color: "var(--text-strong)",
    border: "1px solid var(--border-default)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-body)",
    border: "1px solid transparent"
  },
  outline: {
    background: "transparent",
    color: "var(--text-strong)",
    border: "1px solid var(--border-strong)"
  },
  danger: {
    background: "var(--signal-stop-bg)",
    color: "var(--signal-stop)",
    border: "1px solid var(--signal-stop)"
  }
};
function Button({
  children,
  tone = "secondary",
  size = "md",
  icon,
  iconEnd,
  block,
  disabled,
  loading,
  type = "button",
  onClick,
  title
}) {
  const [hover, setHover] = React.useState(false);
  const t = TONES[tone] || TONES.secondary;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    title: title,
    disabled: disabled || loading,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: block ? "flex" : "inline-flex",
      width: block ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: "var(--radius-sm)",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      whiteSpace: "nowrap",
      transition: "var(--transition-control)",
      filter: hover && !disabled && !loading ? "brightness(1.14)" : "none",
      ...SIZES[size],
      ...t
    }
  }, loading ? /*#__PURE__*/React.createElement(Icon, {
    name: "loader",
    size: size === "sm" ? 12 : 14
  }) : icon ? /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === "sm" ? 12 : 14
  }) : null, children, iconEnd ? /*#__PURE__*/React.createElement(Icon, {
    name: iconEnd,
    size: size === "sm" ? 12 : 14
  }) : null);
}
;return {Button,SIZES,TONES};
} },
"components/core/IconButton.jsx": function (React, NS) { with (NS) {
function IconButton({
  name,
  label,
  size = "md",
  tone = "ghost",
  active,
  disabled,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const box = size === "sm" ? 24 : size === "lg" ? 36 : 30;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: label,
    "aria-label": label,
    "aria-pressed": active,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: box,
      height: box,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-sm)",
      border: tone === "outline" ? "1px solid var(--border-default)" : "1px solid transparent",
      background: active ? "var(--surface-selected)" : hover && !disabled ? "var(--surface-hover)" : "transparent",
      color: active ? "var(--text-strong)" : "var(--text-muted)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: size === "sm" ? 13 : size === "lg" ? 18 : 15
  }));
}
;return {IconButton};
} },
"components/core/Badge.jsx": function (React, NS) { with (NS) {
const SIGNALS = {
  good: ["var(--signal-good)", "var(--signal-good-bg)"],
  info: ["var(--signal-info)", "var(--signal-info-bg)"],
  watch: ["var(--signal-watch)", "var(--signal-watch-bg)"],
  stop: ["var(--signal-stop)", "var(--signal-stop-bg)"],
  work: ["var(--signal-work)", "var(--signal-work-bg)"],
  idle: ["var(--signal-idle)", "var(--signal-idle-bg)"]
};
function Badge({
  children,
  signal = "idle",
  icon,
  solid,
  mono
}) {
  const [fg, bg] = SIGNALS[signal] || SIGNALS.idle;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      height: 20,
      padding: "0 7px",
      borderRadius: "var(--radius-sm)",
      background: solid ? fg : bg,
      color: solid ? "var(--text-on-accent)" : fg,
      border: solid ? "1px solid transparent" : `1px solid color-mix(in oklch, ${fg} 35%, transparent)`,
      font: mono ? "var(--weight-semibold) var(--text-xs) / 1 var(--font-mono)" : "var(--weight-medium) var(--text-xs) / 1 var(--font-ui)",
      fontVariantNumeric: mono ? "tabular-nums" : undefined,
      whiteSpace: "nowrap"
    }
  }, icon ? /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 11
  }) : null, children);
}
;return {Badge,SIGNALS};
} },
"components/core/Tag.jsx": function (React, NS) { with (NS) {
function Tag({
  children,
  onRemove,
  muted,
  matched
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 22,
      padding: onRemove ? "0 4px 0 8px" : "0 8px",
      borderRadius: "var(--radius-sm)",
      background: matched ? "var(--accent-quiet)" : "var(--surface-3)",
      border: `1px solid ${matched ? "color-mix(in oklch, var(--accent) 45%, transparent)" : "var(--border-hairline)"}`,
      color: muted ? "var(--text-faint)" : matched ? "var(--accent)" : "var(--text-body)",
      font: "var(--weight-regular) var(--text-xs) / 1 var(--font-mono)",
      whiteSpace: "nowrap"
    }
  }, children, onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u0423\u0431\u0440\u0430\u0442\u044C",
    onClick: onRemove,
    style: {
      display: "inline-flex",
      border: 0,
      background: "transparent",
      color: "inherit",
      cursor: "pointer",
      padding: 2,
      borderRadius: "var(--radius-xs)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 11
  })) : null);
}
;return {Tag};
} },
"components/core/Card.jsx": function (React, NS) { with (NS) {
function Card({
  children,
  title,
  meta,
  actions,
  tone = "default",
  padding = "var(--space-6)",
  inset
}) {
  const accent = {
    default: null,
    good: "var(--signal-good)",
    watch: "var(--signal-watch)",
    stop: "var(--signal-stop)",
    info: "var(--signal-info)"
  }[tone];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: inset ? "var(--surface-inset)" : "var(--surface-1)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden"
    }
  }, accent ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: accent
    }
  }) : null, title || actions ? /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "10px var(--space-6)",
      borderBottom: "1px solid var(--border-hairline)",
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading)",
      color: "var(--text-strong)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, title), meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-faint)",
      marginTop: 2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, meta) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: "var(--space-3)",
      flex: "0 0 auto"
    }
  }, actions)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
;return {Card};
} },
"components/forms/Input.jsx": function (React, NS) { with (NS) {
const shell = invalid => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "var(--surface-inset)",
  border: `1px solid ${invalid ? "var(--signal-stop)" : "var(--border-default)"}`,
  borderRadius: "var(--radius-sm)",
  padding: "0 8px"
});
function Input({
  value,
  onChange,
  placeholder,
  label,
  hint,
  icon,
  suffix,
  mono,
  invalid,
  disabled,
  size = "md",
  block
}) {
  const [focus, setFocus] = React.useState(false);
  const height = size === "sm" ? "var(--control-sm)" : size === "lg" ? "var(--control-lg)" : "var(--control-md)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: block ? "block" : "inline-block",
      width: block ? "100%" : undefined
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "caps",
    style: {
      display: "block",
      marginBottom: 5
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      ...shell(invalid),
      height,
      opacity: disabled ? 0.5 : 1,
      boxShadow: focus ? "0 0 0 2px color-mix(in oklch, var(--border-focus) 35%, transparent)" : "none",
      borderColor: focus && !invalid ? "var(--border-focus)" : undefined,
      transition: "var(--transition-control)"
    }
  }, icon ? /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 13,
    style: {
      color: "var(--text-faint)"
    }
  }) : null, /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: "none",
      background: "transparent",
      color: "var(--text-strong)",
      font: mono ? "var(--type-mono)" : "var(--weight-regular) var(--text-sm) / 1 var(--font-ui)"
    }
  }), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-mono)",
      color: "var(--text-faint)"
    }
  }, suffix) : null), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4,
      font: "var(--type-body-sm)",
      color: invalid ? "var(--signal-stop)" : "var(--text-faint)"
    }
  }, hint) : null);
}
;return {Input,shell};
} },
"components/forms/Textarea.jsx": function (React, NS) { with (NS) {
function Textarea({
  value,
  onChange,
  placeholder,
  label,
  hint,
  rows = 6,
  counter,
  maxLength,
  mono,
  invalid,
  disabled
}) {
  const [focus, setFocus] = React.useState(false);
  const len = (value || "").length;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block"
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "caps",
    style: {
      display: "block",
      marginBottom: 5
    }
  }, label) : null, /*#__PURE__*/React.createElement("textarea", {
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    maxLength: maxLength,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      resize: "vertical",
      padding: "8px 10px",
      background: "var(--surface-inset)",
      border: `1px solid ${invalid ? "var(--signal-stop)" : focus ? "var(--border-focus)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-sm)",
      color: "var(--text-strong)",
      font: mono ? "var(--weight-regular) var(--text-sm) / 1.55 var(--font-mono)" : "var(--weight-regular) var(--text-md) / var(--leading-normal) var(--font-ui)",
      outline: "none",
      boxShadow: focus ? "0 0 0 2px color-mix(in oklch, var(--border-focus) 35%, transparent)" : "none",
      opacity: disabled ? 0.5 : 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      marginTop: 4,
      font: "var(--type-body-sm)",
      color: "var(--text-faint)"
    }
  }, hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: invalid ? "var(--signal-stop)" : undefined
    }
  }, hint) : null, counter ? /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      marginLeft: "auto"
    }
  }, len, maxLength ? ` / ${maxLength}` : "") : null));
}
;return {Textarea};
} },
"components/forms/Select.jsx": function (React, NS) { with (NS) {
function Select({
  value,
  onChange,
  options = [],
  label,
  size = "md",
  block,
  disabled
}) {
  const height = size === "sm" ? "var(--control-sm)" : size === "lg" ? "var(--control-lg)" : "var(--control-md)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: block ? "block" : "inline-block",
      width: block ? "100%" : undefined
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "caps",
    style: {
      display: "block",
      marginBottom: 5
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      appearance: "none",
      width: "100%",
      height,
      padding: "0 26px 0 8px",
      background: "var(--surface-3)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-sm)",
      color: "var(--text-strong)",
      font: "var(--weight-medium) var(--text-sm) / 1 var(--font-ui)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 13,
    style: {
      position: "absolute",
      right: 8,
      color: "var(--text-faint)",
      pointerEvents: "none"
    }
  })));
}
;return {Select};
} },
"components/forms/Checkbox.jsx": function (React, NS) { with (NS) {
function Checkbox({
  checked,
  onChange,
  label,
  hint,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 15,
      height: 15,
      marginTop: 1,
      flex: "0 0 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xs)",
      background: checked ? "var(--accent)" : "var(--surface-inset)",
      border: `1px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
      color: "var(--text-on-accent)",
      transition: "var(--transition-control)"
    }
  }, checked ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11
  }) : null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-body)"
    }
  }, label), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      font: "var(--type-body-sm)",
      color: "var(--text-faint)"
    }
  }, hint) : null));
}
;return {Checkbox};
} },
"components/forms/Switch.jsx": function (React, NS) { with (NS) {
function Switch({
  checked,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 18,
      borderRadius: "var(--radius-pill)",
      padding: 2,
      background: checked ? "var(--accent)" : "var(--surface-3)",
      border: `1px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
      display: "inline-flex",
      justifyContent: checked ? "flex-end" : "flex-start",
      transition: "background-color var(--duration-fast) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--text-on-accent)" : "var(--ink-400)"
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-body)"
    }
  }, label) : null);
}
;return {Switch};
} },
"components/data/ScoreGauge.jsx": function (React, NS) { with (NS) {
/** Балл скоринга 0–100. Порог решает цвет: 70+ берём, 45–69 смотрим, ниже — мимо. */
function bandOf(score) {
  if (score >= 70) return ["var(--signal-good)", "берём"];
  if (score >= 45) return ["var(--signal-watch)", "под вопросом"];
  return ["var(--signal-idle)", "мимо"];
}
function ScoreGauge({
  score = 0,
  size = "md",
  showBand,
  label = "балл"
}) {
  const [color, band] = bandOf(score);
  const big = size === "lg";
  const w = big ? 120 : size === "sm" ? 56 : 84;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: w
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: big ? "var(--weight-semibold) var(--text-3xl) / 1 var(--font-mono)" : size === "sm" ? "var(--type-mono)" : "var(--type-mono-lg)",
      color,
      fontVariantNumeric: "tabular-nums"
    }
  }, score), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-regular) var(--text-xs) / 1 var(--font-mono)",
      color: "var(--text-faint)"
    }
  }, "/100")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: big ? 5 : 3,
      background: "var(--surface-3)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(0, Math.min(100, score))}%`,
      height: "100%",
      background: color,
      transition: "width var(--duration-normal) var(--ease-out)"
    }
  })), showBand ? /*#__PURE__*/React.createElement("span", {
    className: "caps",
    style: {
      color
    }
  }, band, " \xB7 ", label) : null);
}
;return {bandOf,ScoreGauge};
} },
"components/data/Meter.jsx": function (React, NS) { with (NS) {
function Meter({
  value = 0,
  max = 100,
  signal = "info",
  label,
  valueText,
  height = 4
}) {
  const color = `var(--signal-${signal})`;
  const pct = Math.max(0, Math.min(100, value / (max || 1) * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0
    }
  }, label || valueText ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      font: "var(--type-body-sm)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      marginLeft: "auto",
      color: "var(--text-body)"
    }
  }, valueText)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: "var(--surface-3)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: color
    }
  })));
}
;return {Meter};
} },
"components/data/StatusDot.jsx": function (React, NS) { with (NS) {
function StatusDot({
  signal = "idle",
  label,
  pulse
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      font: "var(--type-body-sm)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "var(--radius-pill)",
      background: `var(--signal-${signal})`,
      boxShadow: pulse ? `0 0 0 3px color-mix(in oklch, var(--signal-${signal}) 25%, transparent)` : "none",
      flex: "0 0 auto"
    }
  }), label);
}
;return {StatusDot};
} },
"components/data/KeyValue.jsx": function (React, NS) { with (NS) {
function KeyValue({
  items = [],
  columns = 2,
  dense
}) {
  return /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: dense ? "var(--space-4) var(--space-7)" : "var(--space-5) var(--space-8)"
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("dt", {
    className: "caps",
    style: {
      marginBottom: 3
    }
  }, it.key), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      font: it.mono ? "var(--type-mono)" : "var(--weight-medium) var(--text-md) / 1.3 var(--font-ui)",
      color: it.signal ? `var(--signal-${it.signal})` : "var(--text-strong)",
      overflowWrap: "anywhere"
    }
  }, it.value))));
}
;return {KeyValue};
} },
"components/data/DataTable.jsx": function (React, NS) { with (NS) {
function DataTable({
  columns = [],
  rows = [],
  selectedId,
  onRowClick,
  tall,
  zebra
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "scroll-thin",
    style: {
      overflowX: "auto",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-1)"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 1,
      textAlign: c.align || "left",
      width: c.width,
      padding: "0 10px",
      height: 28,
      background: "var(--surface-2)",
      borderBottom: "1px solid var(--border-default)",
      font: "var(--weight-medium) var(--text-2xs) / 1 var(--font-ui)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, c.label, c.sorted ? /*#__PURE__*/React.createElement(Icon, {
    name: c.sorted === "asc" ? "arrow-up" : "arrow-down",
    size: 10
  }) : null))))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => {
    const active = selectedId != null && r.id === selectedId;
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id ?? ri,
      onMouseEnter: () => setHover(r.id ?? ri),
      onMouseLeave: () => setHover(null),
      onClick: () => onRowClick && onRowClick(r),
      style: {
        height: tall ? "var(--row-height-tall)" : "var(--row-height)",
        background: active ? "var(--surface-selected)" : hover === (r.id ?? ri) ? "var(--surface-hover)" : zebra && ri % 2 ? "var(--surface-2)" : "transparent",
        cursor: onRowClick ? "pointer" : "default",
        transition: "background-color var(--duration-instant) var(--ease-standard)",
        boxShadow: active ? "inset 2px 0 0 0 var(--signal-info)" : "none"
      }
    }, columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: "0 10px",
        textAlign: c.align || "left",
        borderBottom: "1px solid var(--border-hairline)",
        font: c.mono ? "var(--weight-regular) var(--text-sm) / 1.2 var(--font-mono)" : "var(--weight-regular) var(--text-sm) / 1.3 var(--font-ui)",
        fontVariantNumeric: c.mono ? "tabular-nums" : undefined,
        color: c.strong ? "var(--text-strong)" : "var(--text-body)",
        whiteSpace: c.wrap ? "normal" : "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, c.render ? c.render(r) : r[c.key])));
  }))));
}
;return {DataTable};
} },
"components/feedback/Callout.jsx": function (React, NS) { with (NS) {
const ICONS = {
  good: "circle-check",
  info: "info",
  watch: "triangle-alert",
  stop: "octagon-x",
  work: "clock",
  idle: "info"
};
function Callout({
  children,
  signal = "info",
  title,
  icon,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 12px",
      background: `var(--signal-${signal}-bg)`,
      border: `1px solid color-mix(in oklch, var(--signal-${signal}) 35%, transparent)`,
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || ICONS[signal],
    size: 15,
    style: {
      color: `var(--signal-${signal})`,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-medium) var(--text-sm) / 1.3 var(--font-ui)",
      color: `var(--signal-${signal})`,
      marginBottom: 3
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-body)"
    }
  }, children)), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      flex: "0 0 auto"
    }
  }, actions) : null);
}
;return {Callout,ICONS};
} },
"components/feedback/Toast.jsx": function (React, NS) { with (NS) {
function Toast({
  children,
  signal = "good",
  icon,
  action,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 8px 8px 12px",
      background: "var(--surface-3)",
      border: `1px solid color-mix(in oklch, var(--signal-${signal}) 40%, var(--border-default))`,
      borderLeft: `3px solid var(--signal-${signal})`,
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-pop)",
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || "circle-check",
    size: 14,
    style: {
      color: `var(--signal-${signal})`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-strong)",
      flex: 1
    }
  }, children), action, /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    label: "\u0421\u043A\u0440\u044B\u0442\u044C",
    size: "sm",
    onClick: onClose
  }));
}
;return {Toast};
} },
"components/feedback/Tooltip.jsx": function (React, NS) { with (NS) {
function Tooltip({
  children,
  text,
  side = "top"
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    left: {
      right: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      ...pos,
      zIndex: 30,
      padding: "5px 8px",
      maxWidth: 260,
      width: "max-content",
      background: "var(--ink-820)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-pop)",
      font: "var(--weight-regular) var(--text-xs) / 1.35 var(--font-ui)",
      color: "var(--text-strong)"
    }
  }, text) : null);
}
;return {Tooltip};
} },
"components/feedback/Dialog.jsx": function (React, NS) { with (NS) {
function Dialog({
  open = true,
  title,
  meta,
  children,
  footer,
  width = 560,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      background: "oklch(0.10 0.02 250 / 0.62)",
      padding: "var(--space-8)",
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width,
      maxWidth: "100%",
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-modal)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "12px var(--space-6)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-heading)",
      color: "var(--text-strong)"
    }
  }, title), meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-faint)",
      marginTop: 2
    }
  }, meta) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    label: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-6)",
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--space-4)",
      padding: "12px var(--space-6)",
      borderTop: "1px solid var(--border-hairline)",
      background: "var(--surface-2)"
    }
  }, footer) : null));
}
;return {Dialog};
} },
"components/feedback/EmptyState.jsx": function (React, NS) { with (NS) {
function EmptyState({
  icon = "inbox",
  title,
  children,
  action,
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: compact ? "var(--space-8)" : "var(--space-11) var(--space-8)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: compact ? 20 : 26,
    style: {
      color: "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-medium) var(--text-md) / 1.3 var(--font-ui)",
      color: "var(--text-strong)"
    }
  }, title), children ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-faint)",
      maxWidth: 380
    }
  }, children) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, action) : null);
}
;return {EmptyState};
} },
"components/navigation/Tabs.jsx": function (React, NS) { with (NS) {
function Tabs({
  items = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 2,
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, items.map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": active,
      type: "button",
      onClick: () => onChange && onChange(it.value),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: "0 10px",
        border: 0,
        background: "transparent",
        color: active ? "var(--text-strong)" : "var(--text-muted)",
        font: "var(--weight-medium) var(--text-sm) / 1 var(--font-ui)",
        boxShadow: active ? "inset 0 -2px 0 0 var(--accent)" : "none",
        cursor: "pointer",
        transition: "var(--transition-control)"
      }
    }, it.icon ? /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 13
    }) : null, it.label, it.count != null ? /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        font: "var(--weight-medium) var(--text-xs) / 1 var(--font-mono)",
        color: "var(--text-faint)"
      }
    }, it.count) : null);
  }));
}
;return {Tabs};
} },
"components/navigation/SegmentedControl.jsx": function (React, NS) { with (NS) {
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  block
}) {
  const height = size === "sm" ? "var(--control-sm)" : "var(--control-md)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: block ? "flex" : "inline-flex",
      width: block ? "100%" : undefined,
      padding: 2,
      gap: 2,
      background: "var(--surface-inset)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)"
    }
  }, options.map(o => {
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      onClick: () => onChange && onChange(o.value),
      style: {
        flex: block ? 1 : undefined,
        height,
        padding: "0 10px",
        border: 0,
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--surface-3)" : "transparent",
        color: active ? "var(--text-strong)" : "var(--text-muted)",
        font: "var(--weight-medium) var(--text-sm) / 1 var(--font-ui)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: active ? "inset 0 0 0 1px var(--border-default)" : "none",
        transition: "var(--transition-control)"
      }
    }, o.label);
  }));
}
;return {SegmentedControl};
} },
"components/navigation/Toolbar.jsx": function (React, NS) { with (NS) {
function Toolbar({
  children,
  right,
  sticky,
  title,
  dense
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      minHeight: dense ? 38 : 46,
      padding: dense ? "0 var(--space-5)" : "0 var(--page-pad)",
      background: "var(--surface-2)",
      borderBottom: "1px solid var(--border-hairline)",
      position: sticky ? "sticky" : "static",
      top: 0,
      zIndex: 10
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-semibold) var(--text-sm) / 1 var(--font-ui)",
      color: "var(--text-strong)",
      marginRight: "var(--space-3)"
    }
  }, title) : null, children, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)"
    }
  }, right));
}
;return {Toolbar};
} },
"overview.demo.jsx": function (React, NS) { with (NS) {
function Group({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "caps",
    style: {
      display: "block",
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "block stack"
  }, children));
}
function Demo() {
  const [tab, setTab] = React.useState("feed");
  const [txt, setTxt] = React.useState("Соберу каталог в таблицу: артикул, цена, наличие. Срок 3 дня.");
  const rows = [{
    id: 1,
    score: 88,
    title: "Политика 152-ФЗ и cookie-баннер",
    budget: "12 000 ₽",
    st: "good"
  }, {
    id: 2,
    score: 74,
    title: "Сценарий скринкаста для YouTube",
    budget: "90 000 ₽",
    st: "work"
  }, {
    id: 3,
    score: 52,
    title: "Правки по сайту на WordPress",
    budget: "3 000 ₽",
    st: "watch"
  }, {
    id: 4,
    score: 0,
    title: "Отзывы на сайт, 100 шт.",
    budget: "20 000 ₽",
    st: "stop"
  }];
  const label = {
    good: "берём",
    work: "в работе",
    watch: "смотрим",
    stop: "отсев"
  };
  const cols = [{
    key: "score",
    label: "Балл",
    width: 56,
    mono: true,
    align: "right",
    sorted: "desc",
    render: r => /*#__PURE__*/React.createElement("span", {
      style: {
        color: r.score >= 70 ? "var(--signal-good)" : r.score >= 45 ? "var(--signal-watch)" : "var(--signal-idle)"
      }
    }, r.score || "—")
  }, {
    key: "title",
    label: "Заказ",
    strong: true
  }, {
    key: "budget",
    label: "Бюджет",
    width: 100,
    mono: true,
    align: "right"
  }, {
    key: "st",
    label: "Решение",
    width: 120,
    render: r => /*#__PURE__*/React.createElement(Badge, {
      signal: r.st
    }, label[r.st])
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Group, {
    title: "\u043E\u0441\u043D\u043E\u0432\u0430"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Button, {
    tone: "primary",
    icon: "send"
  }, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u043A\u043B\u0438\u043A"), /*#__PURE__*/React.createElement(Button, {
    icon: "file-text"
  }, "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A"), /*#__PURE__*/React.createElement(Button, {
    tone: "ghost",
    icon: "filter"
  }, "\u0424\u0438\u043B\u044C\u0442\u0440"), /*#__PURE__*/React.createElement(Button, {
    tone: "outline",
    size: "sm"
  }, "\u041E\u0442\u0441\u0435\u0432"), /*#__PURE__*/React.createElement(Button, {
    tone: "danger",
    size: "sm",
    icon: "octagon-x"
  }, "\u041D\u0435 \u0431\u0435\u0440\u0451\u043C"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    disabled: true
  }, "\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E"), /*#__PURE__*/React.createElement(IconButton, {
    name: "refresh-cw",
    label: "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E"
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "star",
    label: "\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435",
    active: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Badge, {
    signal: "good",
    icon: "circle-check"
  }, "\u041E\u0442\u043A\u043B\u0438\u043A \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D"), /*#__PURE__*/React.createElement(Badge, {
    signal: "watch",
    icon: "clock"
  }, "\u0416\u0434\u0451\u043C \u043E\u0442\u0432\u0435\u0442\u0430"), /*#__PURE__*/React.createElement(Badge, {
    signal: "stop",
    icon: "octagon-x"
  }, "\u041E\u0442\u0441\u0435\u0432"), /*#__PURE__*/React.createElement(Badge, {
    signal: "work",
    icon: "loader"
  }, "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435"), /*#__PURE__*/React.createElement(Badge, {
    signal: "info",
    mono: true
  }, "74/100"), /*#__PURE__*/React.createElement(Badge, {
    signal: "good",
    solid: true
  }, "\u0421\u0434\u0430\u043D\u043E"), /*#__PURE__*/React.createElement(Tag, {
    matched: true
  }, "\u0441\u0431\u043E\u0440 \u0434\u0430\u043D\u043D"), /*#__PURE__*/React.createElement(Tag, null, "\u0442\u0430\u0431\u043B\u0438\u0446"), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "\u0431\u044E\u0434\u0436\u0435\u0442 \u2265 5 000 \u20BD"))), /*#__PURE__*/React.createElement(Group, {
    title: "\u0444\u043E\u0440\u043C\u044B"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u041C\u0438\u043D. \u0431\u044E\u0434\u0436\u0435\u0442",
    value: "5000",
    suffix: "\u20BD",
    mono: true,
    block: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u041F\u043E\u0440\u043E\u0433 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439",
    value: "1",
    invalid: true,
    hint: "\u041C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u2014 \u0438\u043D\u0430\u0447\u0435 \u043F\u0440\u043E\u0439\u0434\u0451\u0442 \u043C\u0443\u0441\u043E\u0440",
    mono: true,
    block: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\u0410\u0433\u0435\u043D\u0442",
    value: "docs",
    options: [{
      value: "docs",
      label: "Документы и данные"
    }, {
      value: "webdev",
      label: "Веб-разработчик"
    }],
    block: true
  })), /*#__PURE__*/React.createElement(Textarea, {
    label: "\u0422\u0435\u043A\u0441\u0442 \u043E\u0442\u043A\u043B\u0438\u043A\u0430",
    rows: 3,
    counter: true,
    maxLength: 1500,
    value: txt,
    onChange: setTxt
  }), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: true,
    label: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043E\u0442\u0441\u0435\u044F\u043D\u043D\u044B\u0435",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: true,
    label: "\u0410\u0432\u0442\u043E\u0441\u0431\u043E\u0440 \u043A\u0430\u0436\u0434\u044B\u0435 15 \u043C\u0438\u043D",
    onChange: () => {}
  }))), /*#__PURE__*/React.createElement(Group, {
    title: "\u0434\u0430\u043D\u043D\u044B\u0435"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 26,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(ScoreGauge, {
    score: 88,
    size: "lg",
    showBand: true
  }), /*#__PURE__*/React.createElement(ScoreGauge, {
    score: 52,
    showBand: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement(Meter, {
    label: "\u0434\u0430\u043D\u043D\u044B\u0435",
    value: 7,
    max: 15,
    valueText: "7",
    signal: "good"
  }), /*#__PURE__*/React.createElement(Meter, {
    label: "\u043E\u0442\u0441\u0435\u044F\u043D\u043E",
    value: 11,
    max: 15,
    valueText: "11",
    signal: "stop"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    signal: "good",
    label: "FL.ru \xB7 59 \u0437\u0430\u043A\u0430\u0437\u043E\u0432",
    pulse: true
  }), /*#__PURE__*/React.createElement(StatusDot, {
    signal: "idle",
    label: "Kwork \xB7 \u043D\u0435\u0442 \u0444\u0438\u0434\u0430"
  }))), /*#__PURE__*/React.createElement(KeyValue, {
    columns: 5,
    dense: true,
    items: [{
      key: "бюджет",
      value: "12 000 ₽",
      mono: true,
      signal: "good"
    }, {
      key: "услуга",
      value: "персональные данные"
    }, {
      key: "агент",
      value: "Веб-разработчик"
    }, {
      key: "срок",
      value: "3 дня"
    }, {
      key: "откликов",
      value: "2",
      mono: true,
      signal: "good"
    }]
  }), /*#__PURE__*/React.createElement(DataTable, {
    columns: cols,
    rows: rows,
    selectedId: 1,
    onRowClick: () => {}
  })), /*#__PURE__*/React.createElement(Group, {
    title: "\u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0432\u044F\u0437\u044C"
  }, /*#__PURE__*/React.createElement(Callout, {
    signal: "stop",
    title: "\u0421\u0442\u043E\u043F-\u0441\u043B\u043E\u0432\u043E: \xAB\u043E\u0442\u0437\u044B\u0432\u043E\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\xBB"
  }, "\u0417\u0430\u043A\u0430\u0437\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B \u043D\u0435 \u0431\u0435\u0440\u0451\u043C: \u0437\u0430 \u044D\u0442\u043E \u0441\u043D\u0438\u043C\u0430\u044E\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442, \u0430 \u043E\u0442\u0437\u044B\u0432 \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F."), /*#__PURE__*/React.createElement(Callout, {
    signal: "watch",
    title: "\u0411\u044E\u0434\u0436\u0435\u0442 \u043D\u0438\u0436\u0435 \u043F\u043E\u0440\u043E\u0433\u0430 \u0443\u0441\u043B\u0443\u0433\u0438"
  }, "3 000 \u20BD \u043F\u0440\u0438 \u043F\u043E\u0440\u043E\u0433\u0435 5 000 \u20BD. \u041C\u043E\u0436\u043D\u043E \u0432\u0437\u044F\u0442\u044C \u0440\u0430\u0434\u0438 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043E\u0442\u0437\u044B\u0432\u0430."), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Toast, {
    signal: "good"
  }, "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u043E\u0442\u043A\u043B\u0438\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 outbox/"), /*#__PURE__*/React.createElement(Tooltip, {
    text: "\u0412\u0435\u0441 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435 \u2014 3, \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438 \u2014 1"
  }, /*#__PURE__*/React.createElement(Badge, {
    signal: "info",
    mono: true
  }, "\xD73"))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    compact: true,
    title: "\u041D\u043E\u0432\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0435\u0442",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "refresh-cw"
    }, "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441")
  }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0441\u0431\u043E\u0440 \u2014 12 \u043C\u0438\u043D\u0443\u0442 \u043D\u0430\u0437\u0430\u0434, 0 \u0438\u0437 41 \u043F\u0440\u043E\u0448\u043B\u0438 \u043E\u0442\u0431\u043E\u0440."))), /*#__PURE__*/React.createElement(Group, {
    title: "\u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: "feed",
      label: "Лента",
      icon: "list",
      count: 15
    }, {
      value: "drop",
      label: "Отсев",
      icon: "filter",
      count: 26
    }, {
      value: "registry",
      label: "Реестр работ",
      icon: "table-2",
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    value: "48",
    onChange: () => {},
    options: [{
      value: "24",
      label: "24 ч"
    }, {
      value: "48",
      label: "48 ч"
    }, {
      value: "all",
      label: "всё"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Toolbar, {
    title: "\u041B\u0435\u043D\u0442\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432",
    right: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      tone: "primary",
      icon: "refresh-cw"
    }, "\u0421\u043E\u0431\u0440\u0430\u0442\u044C")
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "\u043F\u043E\u0438\u0441\u043A",
    icon: "search"
  })))));
}
;return {Group,Demo};
} }
};
