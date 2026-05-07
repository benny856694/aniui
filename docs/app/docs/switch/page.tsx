import { Heading } from "@/components/heading";
import { PreviewSwitch } from "@/components/preview/switch";
import { ComponentPlayground } from "@/components/highlighted-playground";
import { CodeBlock } from "@/components/code-block-server";
import { PropsTable } from "@/components/props-table";

import { AddComponentTabs } from "@/components/package-manager-tabs";
import { PreviewToggle } from "@/components/preview-toggle";
const installCode = `npx @aniui/cli add switch`;
const usageCode = `import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function MyScreen() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch value={enabled} onValueChange={setEnabled} />
  );
}`;
const sourceCode = `import React from "react";
import { View, Switch as RNSwitch, useColorScheme } from "react-native";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RNSwitch> {
  className?: string;
  trackColorOff?: string;
  trackColorOn?: string;
  thumbColor?: string;
}

export function Switch({ className, trackColorOff, trackColorOn, thumbColor, value, ...props }: SwitchProps) {
  const dark = useColorScheme() === "dark";
  const off = trackColorOff ?? (dark ? "#27272a" : "#e4e4e7");
  const on = trackColorOn ?? (dark ? "#fafafa" : "#18181b");
  // Thumb must contrast with the track in every state. In dark mode the ON
  // track is near-white, so a default white thumb would disappear on iOS.
  const thumb = thumbColor ?? (value ? (dark ? "#18181b" : "#ffffff") : "#ffffff");

  return (
    <View className={cn("", className)}>
      <RNSwitch
        value={value}
        trackColor={{ false: off, true: on }}
        thumbColor={thumb}
        ios_backgroundColor={off}
        accessibilityRole="switch"
        {...props}
      />
    </View>
  );
}`;
export default function SwitchPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Switch</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Toggle switch for boolean settings.
        </p>
      </div>
      {/* Preview */}
      <PreviewToggle>
        <ComponentPlayground code={usageCode}>
          <div className="flex items-center gap-4">
            <PreviewSwitch />
          </div>
        </ComponentPlayground>
      </PreviewToggle>
      {/* Installation */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Installation</Heading>
        <AddComponentTabs names="switch" />
      </div>
      {/* Usage */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Usage</Heading>
        <CodeBlock code={usageCode} title="app/index.tsx" />
      </div>
      {/* Props */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Props</Heading>
        <PropsTable props={[
          { name: "value", type: "boolean", default: "false" },
          { name: "onValueChange", type: "(value: boolean) => void" },
          { name: "trackColorOff", type: "string", description: "Override the off-state track color. Defaults adapt to light/dark mode." },
          { name: "trackColorOn", type: "string", description: "Override the on-state track color. Defaults adapt to light/dark mode." },
          { name: "thumbColor", type: "string", description: "Override the thumb color. Defaults to a value that contrasts with the active track on both iOS and Android." },
          { name: "className", type: "string" },
        ]} />
        <p className="text-sm text-muted-foreground">
          Also accepts all <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">Switch</code> props from React Native.
        </p>
      </div>
      {/* Accessibility */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Accessibility</Heading>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li><code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">accessibilityRole="switch"</code> wrapping the native React Native <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">Switch</code>.</li>
          <li>On/off state is announced automatically by the platform.</li>
        </ul>
      </div>
      {/* Source */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Source</Heading>
        <CodeBlock code={sourceCode} title="components/ui/switch.tsx" />
      </div>
    </div>
  );
}
