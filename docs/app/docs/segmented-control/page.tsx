import { Heading } from "@/components/heading";
import { ComponentPlayground } from "@/components/highlighted-playground";
import { CodeBlock } from "@/components/code-block-server";
import { PropsTable } from "@/components/props-table";
import { AddComponentTabs } from "@/components/package-manager-tabs";
import { PreviewToggle } from "@/components/preview-toggle";
import { SegmentedControlDemo, SizesDemo } from "./_demos";

const installCode = `npx @aniui/cli add segmented-control`;
const usageCode = `import { SegmentedControl } from "@/components/ui/segmented-control";

const [view, setView] = useState("List");
<SegmentedControl options={["List", "Grid", "Map"]} value={view} onValueChange={setView} />`;
const sizesCode = `<SegmentedControl size="sm" options={["S", "M", "L"]} value={size} onValueChange={setSize} />
<SegmentedControl size="md" options={["S", "M", "L"]} value={size} onValueChange={setSize} />
<SegmentedControl size="lg" options={["S", "M", "L"]} value={size} onValueChange={setSize} />`;
const enumCode = `// SegmentedControl is generic over the value type, so it binds cleanly to enums or string unions.
enum Model { P0 = "p0", P1 = "p1", Litter = "litter", A3 = "a3" }
const [model, setModel] = useState<Model>(Model.P0);

<SegmentedControl<Model>
  options={Object.values(Model)}
  labels={[t("p0"), t("p1"), "猫砂盆", "A3"]}
  value={model}
  onValueChange={setModel}
/>`;
const objectCode = `// Pair each value with its label in one array — safest for i18n (no index-drift risk).
<SegmentedControl<Model>
  options={[
    { value: Model.P0,     label: t("p0") },
    { value: Model.P1,     label: t("p1"), disabled: true },
    { value: Model.Litter, label: "猫砂盆" },
    { value: Model.A3,     label: "A3" },
  ]}
  value={model}
  onValueChange={setModel}
/>`;
const sourceCode = `import React from "react";
import { View, Pressable, Text, useColorScheme } from "react-native";
import { cn } from "@/lib/utils";

const heights = { sm: 36, md: 44, lg: 56 } as const;

export type SegmentedOption<T extends string | number> = {
  value: T;
  label?: string;
  disabled?: boolean;
};

export interface SegmentedControlProps<T extends string | number = string>
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  className?: string;
  options: T[] | SegmentedOption<T>[];
  labels?: string[];
  value: T;
  onValueChange: (value: T) => void;
  size?: "sm" | "md" | "lg";
}

function isOptionObject<T extends string | number>(o: T | SegmentedOption<T>): o is SegmentedOption<T> {
  return typeof o === "object" && o !== null && "value" in (o as object);
}

export function SegmentedControl<T extends string | number = string>({
  size = "md", className, style, options, labels, value, onValueChange, ...rest
}: SegmentedControlProps<T>) {
  const dark = useColorScheme() === "dark";
  const activeBg = dark ? "#27272a" : "#ffffff";
  const activeFg = dark ? "#fafafa" : "#09090b";
  const inactiveFg = dark ? "#a1a1aa" : "#71717a";
  const disabledFg = dark ? "#52525b" : "#d4d4d8";

  const items: SegmentedOption<T>[] = options.map((o, i) =>
    isOptionObject(o)
      ? { value: o.value, label: o.label ?? String(o.value), disabled: o.disabled }
      : { value: o, label: labels?.[i] ?? String(o) }
  );

  return (
    <View
      className={cn("rounded-lg bg-muted", className)}
      style={[{ height: heights[size], padding: 4, flexDirection: "row", borderRadius: 8 }, style]}
      accessibilityRole="tablist"
      {...rest}
    >
      {items.map(({ value: v, label, disabled }) => {
        const active = v === value;
        return (
          <Pressable
            key={String(v)}
            disabled={disabled}
            style={{
              flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 6,
              opacity: disabled ? 0.5 : 1,
              backgroundColor: active ? activeBg : "transparent",
              ...(active ? { shadowColor: "#000", shadowOpacity: dark ? 0.4 : 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : {}),
            }}
            onPress={() => { if (!active) onValueChange(v); }}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: !!disabled }}
          >
            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "500", color: disabled ? disabledFg : active ? activeFg : inactiveFg }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}`;
export default function SegmentedControlPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Segmented Control</h1>
        <p className="text-muted-foreground text-lg">iOS-style segmented control for switching between views or filter options. Generic over the value type — binds cleanly to enums and string unions.</p>
      </div>
      <PreviewToggle>
        <ComponentPlayground code={usageCode}>
          <SegmentedControlDemo />
        </ComponentPlayground>
      </PreviewToggle>
      <div>
        <Heading as="h2" className="text-xl font-semibold mb-3">Installation</Heading>
        <AddComponentTabs names="segmented-control" />
      </div>
      <div>
        <Heading as="h2" className="text-xl font-semibold mb-3">Sizes</Heading>
        <ComponentPlayground code={sizesCode}>
          <SizesDemo />
        </ComponentPlayground>
      </div>
      <div className="space-y-4">
        <Heading as="h2" className="text-xl font-semibold">Generic value type and i18n</Heading>
        <p className="text-sm text-muted-foreground">
          Bind to an enum or string union by passing the type parameter. Use the parallel <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">labels</code> array when you already have <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">Object.values(MyEnum)</code>.
        </p>
        <CodeBlock code={enumCode} />
        <p className="text-sm text-muted-foreground">
          Or pass an array of objects so each value is paired with its label — safer for i18n since the two cannot drift out of order. The object form also accepts <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">disabled</code> per item.
        </p>
        <CodeBlock code={objectCode} />
      </div>
      <div>
        <Heading as="h2" className="text-xl font-semibold mb-3">Props</Heading>
        <PropsTable props={[
          { name: "options", type: "T[] | { value: T; label?: string; disabled?: boolean }[]", description: "Either a list of values, or a list of objects pairing each value with its label." },
          { name: "labels", type: "string[]", description: "Parallel labels array. Only used when options is T[]. Indices must align with options." },
          { name: "value", type: "T", description: "Currently selected value. Inferred from the options type." },
          { name: "onValueChange", type: "(value: T) => void", description: "Fires only when a different segment is tapped." },
          { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"" },
          { name: "className", type: "string" },
        ]} />
        <p className="text-sm text-muted-foreground mt-3">
          Also accepts all <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">View</code> props (testID, onLayout, accessibilityHint, style, etc.).
        </p>
      </div>
      {/* Accessibility */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Accessibility</Heading>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Tab-like control with selected state announced to screen readers.</li>
          <li>Each segment has <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">accessibilityState</code> for selected, unselected, and disabled.</li>
          <li>Long labels are truncated to one line so layout stays stable across locales.</li>
        </ul>
      </div>
      <div>
        <Heading as="h2" className="text-xl font-semibold mb-3">Source</Heading>
        <CodeBlock code={sourceCode} title="components/ui/segmented-control.tsx" />
      </div>
    </div>
  );
}
