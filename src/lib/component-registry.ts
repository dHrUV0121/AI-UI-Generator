// Component Registry - Central registry of all allowed components
// This is the SINGLE SOURCE OF TRUTH for the component whitelist

export interface ComponentProp {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
    options?: string[];
}

export interface ComponentDefinition {
    name: string;
    description: string;
    props: ComponentProp[];
    category: "layout" | "input" | "display" | "feedback" | "navigation" | "data";
}

export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
    Button: {
        name: "Button",
        description: "Interactive action trigger button with multiple variants and sizes",
        category: "input",
        props: [
            { name: "children", type: "ReactNode", required: true, description: "Button label content" },
            { name: "variant", type: "string", required: false, default: "primary", description: "Visual style variant", options: ["primary", "secondary", "danger", "ghost", "outline"] },
            { name: "size", type: "string", required: false, default: "md", description: "Button size", options: ["sm", "md", "lg"] },
            { name: "disabled", type: "boolean", required: false, default: "false", description: "Whether button is disabled" },
            { name: "onClick", type: "function", required: false, description: "Click handler" },
            { name: "icon", type: "string", required: false, description: "Icon emoji or text to display" },
            { name: "fullWidth", type: "boolean", required: false, default: "false", description: "Whether button takes full width" },
        ],
    },
    Card: {
        name: "Card",
        description: "Content container with optional title, subtitle, and footer",
        category: "layout",
        props: [
            { name: "title", type: "string", required: false, description: "Card heading" },
            { name: "subtitle", type: "string", required: false, description: "Secondary text below title" },
            { name: "children", type: "ReactNode", required: false, description: "Card body content" },
            { name: "footer", type: "ReactNode", required: false, description: "Card footer content" },
            { name: "variant", type: "string", required: false, default: "default", description: "Card style", options: ["default", "outlined", "elevated"] },
            { name: "padding", type: "string", required: false, default: "md", description: "Internal padding", options: ["sm", "md", "lg"] },
        ],
    },
    Input: {
        name: "Input",
        description: "Form input field with label, validation, and icon support",
        category: "input",
        props: [
            { name: "label", type: "string", required: false, description: "Input label above the field" },
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "type", type: "string", required: false, default: "text", description: "HTML input type", options: ["text", "email", "password", "number", "search"] },
            { name: "error", type: "string", required: false, description: "Error message text" },
            { name: "helperText", type: "string", required: false, description: "Helper text below input" },
            { name: "disabled", type: "boolean", required: false, default: "false", description: "Whether input is disabled" },
            { name: "value", type: "string", required: false, description: "Input value" },
            { name: "onChange", type: "function", required: false, description: "Change handler" },
            { name: "icon", type: "string", required: false, description: "Icon to display in input" },
        ],
    },
    Table: {
        name: "Table",
        description: "Tabular data display with configurable columns and row styling",
        category: "data",
        props: [
            { name: "columns", type: "array", required: true, description: "Column definitions with key, header, and optional width. Format: [{key: string, header: string, width?: string}]" },
            { name: "data", type: "array", required: true, description: "Array of row objects with keys matching column keys" },
            { name: "striped", type: "boolean", required: false, default: "false", description: "Alternating row colors" },
            { name: "hoverable", type: "boolean", required: false, default: "true", description: "Row hover effect" },
            { name: "compact", type: "boolean", required: false, default: "false", description: "Compact row height" },
        ],
    },
    Modal: {
        name: "Modal",
        description: "Dialog overlay with backdrop, title, content, and footer actions",
        category: "feedback",
        props: [
            { name: "isOpen", type: "boolean", required: true, description: "Whether modal is visible" },
            { name: "onClose", type: "function", required: true, description: "Close handler" },
            { name: "title", type: "string", required: false, description: "Modal title in header" },
            { name: "children", type: "ReactNode", required: false, description: "Modal body content" },
            { name: "footer", type: "ReactNode", required: false, description: "Footer content (usually action buttons)" },
            { name: "size", type: "string", required: false, default: "md", description: "Modal width", options: ["sm", "md", "lg", "xl"] },
        ],
    },
    Sidebar: {
        name: "Sidebar",
        description: "Vertical navigation panel with items, sections, and collapsible state",
        category: "navigation",
        props: [
            { name: "items", type: "array", required: true, description: "Navigation items. Format: [{label: string, icon?: string, href?: string, active?: boolean, children?: SidebarItem[]}]" },
            { name: "collapsed", type: "boolean", required: false, default: "false", description: "Collapsed to icon-only mode" },
            { name: "header", type: "ReactNode", required: false, description: "Sidebar header content" },
            { name: "footer", type: "ReactNode", required: false, description: "Sidebar footer content" },
        ],
    },
    Navbar: {
        name: "Navbar",
        description: "Horizontal top navigation bar with brand, links, and action buttons",
        category: "navigation",
        props: [
            { name: "brand", type: "ReactNode", required: false, description: "Brand/logo content on the left" },
            { name: "items", type: "array", required: false, description: "Nav items. Format: [{label: string, href?: string, active?: boolean}]" },
            { name: "actions", type: "ReactNode", required: false, description: "Right-side action elements" },
            { name: "sticky", type: "boolean", required: false, default: "true", description: "Stick to top on scroll" },
        ],
    },
    Chart: {
        name: "Chart",
        description: "Data visualization chart supporting bar, line, pie, and area types",
        category: "data",
        props: [
            { name: "type", type: "string", required: false, default: "bar", description: "Chart type", options: ["bar", "line", "pie", "area"] },
            { name: "data", type: "array", required: true, description: "Chart data. Format: [{name: string, value: number, ...}]" },
            { name: "title", type: "string", required: false, description: "Chart title" },
            { name: "xKey", type: "string", required: false, default: "name", description: "Data key for X axis" },
            { name: "yKey", type: "string", required: false, default: "value", description: "Data key for Y axis" },
            { name: "color", type: "string", required: false, default: "#6366f1", description: "Primary chart color (hex)" },
        ],
    },
    Badge: {
        name: "Badge",
        description: "Small label for status or category indication",
        category: "display",
        props: [
            { name: "children", type: "ReactNode", required: true, description: "Badge text content" },
            { name: "variant", type: "string", required: false, default: "default", description: "Color variant", options: ["success", "warning", "error", "info", "default"] },
            { name: "size", type: "string", required: false, default: "md", description: "Badge size", options: ["sm", "md"] },
        ],
    },
    Avatar: {
        name: "Avatar",
        description: "User profile image or initials with optional status indicator",
        category: "display",
        props: [
            { name: "src", type: "string", required: false, description: "Image URL" },
            { name: "alt", type: "string", required: false, description: "Alt text for image" },
            { name: "size", type: "string", required: false, default: "md", description: "Avatar size", options: ["sm", "md", "lg", "xl"] },
            { name: "fallback", type: "string", required: false, description: "Initials to show when no image" },
            { name: "status", type: "string", required: false, description: "Online status indicator", options: ["online", "offline", "away"] },
        ],
    },
    Tabs: {
        name: "Tabs",
        description: "Tabbed content interface with multiple style variants",
        category: "navigation",
        props: [
            { name: "tabs", type: "array", required: true, description: "Tab definitions. Format: [{label: string, content: ReactNode, icon?: string}]" },
            { name: "defaultIndex", type: "number", required: false, default: "0", description: "Initially active tab index" },
            { name: "variant", type: "string", required: false, default: "underline", description: "Tab style", options: ["underline", "pills", "enclosed"] },
        ],
    },
    Alert: {
        name: "Alert",
        description: "Notification banner for showing status messages",
        category: "feedback",
        props: [
            { name: "variant", type: "string", required: false, default: "info", description: "Alert type", options: ["success", "warning", "error", "info"] },
            { name: "title", type: "string", required: false, description: "Alert heading" },
            { name: "children", type: "ReactNode", required: false, description: "Alert message body" },
            { name: "dismissible", type: "boolean", required: false, default: "false", description: "Show dismiss button" },
            { name: "onDismiss", type: "function", required: false, description: "Dismiss callback" },
        ],
    },
    Divider: {
        name: "Divider",
        description: "Horizontal or vertical separator line with optional label",
        category: "layout",
        props: [
            { name: "label", type: "string", required: false, description: "Optional text in the divider" },
            { name: "orientation", type: "string", required: false, default: "horizontal", description: "Direction", options: ["horizontal", "vertical"] },
        ],
    },
    Select: {
        name: "Select",
        description: "Dropdown select menu with label and error support",
        category: "input",
        props: [
            { name: "label", type: "string", required: false, description: "Select label" },
            { name: "options", type: "array", required: true, description: "Options list. Format: [{value: string, label: string}]" },
            { name: "value", type: "string", required: false, description: "Selected value" },
            { name: "onChange", type: "function", required: false, description: "Change handler" },
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "error", type: "string", required: false, description: "Error message" },
            { name: "disabled", type: "boolean", required: false, default: "false", description: "Disabled state" },
        ],
    },
    Textarea: {
        name: "Textarea",
        description: "Multi-line text input with label and character count",
        category: "input",
        props: [
            { name: "label", type: "string", required: false, description: "Textarea label" },
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "rows", type: "number", required: false, default: "4", description: "Number of visible rows" },
            { name: "value", type: "string", required: false, description: "Current value" },
            { name: "onChange", type: "function", required: false, description: "Change handler" },
            { name: "error", type: "string", required: false, description: "Error message" },
            { name: "disabled", type: "boolean", required: false, default: "false", description: "Disabled state" },
            { name: "maxLength", type: "number", required: false, description: "Maximum character count" },
        ],
    },
    Toggle: {
        name: "Toggle",
        description: "On/off switch toggle with optional label",
        category: "input",
        props: [
            { name: "checked", type: "boolean", required: false, default: "false", description: "Toggle state" },
            { name: "onChange", type: "function", required: false, description: "Change handler receiving new boolean value" },
            { name: "label", type: "string", required: false, description: "Label text" },
            { name: "disabled", type: "boolean", required: false, default: "false", description: "Disabled state" },
            { name: "size", type: "string", required: false, default: "md", description: "Toggle size", options: ["sm", "md"] },
        ],
    },
    Tooltip: {
        name: "Tooltip",
        description: "Hover tooltip showing additional information",
        category: "display",
        props: [
            { name: "content", type: "string", required: true, description: "Tooltip text" },
            { name: "children", type: "ReactNode", required: true, description: "Element to attach tooltip to" },
            { name: "position", type: "string", required: false, default: "top", description: "Tooltip position", options: ["top", "bottom", "left", "right"] },
        ],
    },
    ProgressBar: {
        name: "ProgressBar",
        description: "Horizontal progress indicator with percentage",
        category: "feedback",
        props: [
            { name: "value", type: "number", required: true, description: "Progress percentage (0-100)" },
            { name: "variant", type: "string", required: false, default: "default", description: "Color variant", options: ["default", "success", "warning", "error"] },
            { name: "size", type: "string", required: false, default: "md", description: "Bar thickness", options: ["sm", "md", "lg"] },
            { name: "showLabel", type: "boolean", required: false, default: "false", description: "Show percentage label" },
        ],
    },
    Stat: {
        name: "Stat",
        description: "Key metric display with label, value, and trend indicator",
        category: "data",
        props: [
            { name: "label", type: "string", required: true, description: "Metric label" },
            { name: "value", type: "string | number", required: true, description: "Metric value" },
            { name: "change", type: "string", required: false, description: "Change amount text (e.g. '+12%')" },
            { name: "changeType", type: "string", required: false, description: "Direction of change", options: ["increase", "decrease"] },
            { name: "icon", type: "string", required: false, description: "Icon emoji" },
        ],
    },
};

// Whitelist of allowed component names
export const COMPONENT_WHITELIST = Object.keys(COMPONENT_REGISTRY);

// Generate component catalog string for prompts
export function getComponentCatalog(): string {
    return Object.values(COMPONENT_REGISTRY)
        .map((comp) => {
            const propsStr = comp.props
                .map((p) => {
                    let line = `    - ${p.name}${p.required ? " (required)" : ""}: ${p.type}`;
                    if (p.options) line += ` — one of: ${p.options.join(", ")}`;
                    if (p.default) line += ` — default: ${p.default}`;
                    line += ` — ${p.description}`;
                    return line;
                })
                .join("\n");
            return `  ${comp.name} [${comp.category}]: ${comp.description}\n  Props:\n${propsStr}`;
        })
        .join("\n\n");
}

// Validate that code only uses whitelisted components
export function validateComponentUsage(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Match JSX component tags (capitalized)
    const tagRegex = /<([A-Z][a-zA-Z]*)\b/g;
    let match;
    const usedComponents = new Set<string>();

    while ((match = tagRegex.exec(code)) !== null) {
        usedComponents.add(match[1]);
    }

    // Check against whitelist (allow React fragments/common React elements)
    const allowed = COMPONENT_WHITELIST.concat(["Fragment", "React"]);

    Array.from(usedComponents).forEach((comp) => {
        if (!allowed.includes(comp)) {
            errors.push(`Component <${comp}> is not in the allowed whitelist. Allowed: ${COMPONENT_WHITELIST.join(", ")}`);
        }
    });

    // Check for inline styles
    if (/style\s*=\s*\{/g.test(code)) {
        errors.push("Inline styles (style={...}) are not allowed. Use component props only.");
    }

    // Check for className usage (outside component definitions)
    if (/className\s*=\s*["'`{]/g.test(code)) {
        errors.push("Custom className is not allowed. Use component props for styling.");
    }

    return { valid: errors.length === 0, errors };
}
