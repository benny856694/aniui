import { Heading } from "@/components/heading";
import { ComponentPlayground } from "@/components/highlighted-playground";
import { CodeBlock } from "@/components/code-block-server";
import { PropsTable } from "@/components/props-table";
import { AddComponentTabs } from "@/components/package-manager-tabs";
import { PreviewToggle } from "@/components/preview-toggle";
import { ToastDemo } from "./_demos";

const usageCode = `import { ToastProvider, useToast } from "@/components/ui/toast";
// Wrap your app with ToastProvider
export function App() {
  return (
    <ToastProvider>
      <MyScreen />
    </ToastProvider>
  );
}
function MyScreen() {
  const { toast } = useToast();
  return (
    <Button
      onPress={() =>
        toast({ title: "Success!", description: "Your action was completed." })
      }
    >
      Show Toast
    </Button>
  );
}`;
const variantsCode = `// Default toast
toast({ title: "Notification", description: "Something happened." });
// Destructive toast
toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
// Success toast
toast({ title: "Saved", description: "Changes saved successfully.", variant: "success" });`;
const positionsCode = `// Two independent concerns:
//   position — where the toast RESTS on screen ("top" | "bottom", default "top")
//   from     — which side it SLIDES IN FROM ("top" | "bottom" | "left" | "right",
//              defaults to match position so the natural pairing just works)

// Default — drops down from above into the top resting position.
toast({ title: "Heads up" });

// Pinned to the bottom, rises in from below.
toast({ title: "Saved", position: "bottom" });

// Pinned to top but flies in from the right edge.
toast({ title: "New message", position: "top", from: "right" });

// App-wide defaults on the provider.
<ToastProvider defaultPosition="bottom" defaultFrom="left">
  <App />
</ToastProvider>`;
const sourceCode = `import React, { createContext, useCallback, useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Portal } from "@rn-primitives/portal";
import { entering, exiting } from "@/components/ui/animate";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "destructive" | "success";
export type ToastPosition = "top" | "bottom";
export type ToastFrom = "top" | "bottom" | "left" | "right";
type ToastData = {
  id: string; title: string; description?: string;
  variant?: ToastVariant; position?: ToastPosition; from?: ToastFrom;
};

const ToastContext = createContext<{ toast: (data: Omit<ToastData, "id">) => void }>({ toast: () => {} });
export function useToast() { return useContext(ToastContext); }

export interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultFrom?: ToastFrom;
}

const animationFor: Record<ToastFrom, { enter: typeof entering.slideInUp; exit: typeof exiting.slideOutUp }> = {
  top:    { enter: entering.slideInUp,    exit: exiting.slideOutUp },
  bottom: { enter: entering.slideInDown,  exit: exiting.slideOutDown },
  left:   { enter: entering.slideInLeft,  exit: exiting.slideOutLeft },
  right:  { enter: entering.slideInRight, exit: exiting.slideOutRight },
};

const containerStyles: Record<ToastPosition, string> = {
  top:    "absolute top-14 start-4 end-4 gap-2 z-50",
  bottom: "absolute bottom-14 start-4 end-4 gap-2 z-50",
};

const positions: ToastPosition[] = ["top", "bottom"];

export function ToastProvider({ children, defaultPosition = "top", defaultFrom }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toast = useCallback((data: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    const position = data.position ?? defaultPosition;
    const from = data.from ?? defaultFrom ?? position;
    setToasts((prev) => [...prev, { ...data, id, position, from }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, [defaultPosition, defaultFrom]);
  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Portal name="aniui-toast">
        {positions.map((pos) => {
          const items = toasts.filter((t) => t.position === pos);
          if (items.length === 0) return null;
          return (
            <View key={pos} className={containerStyles[pos]} pointerEvents="box-none">
              {items.map((t) => (
                <ToastItem key={t.id} data={t} onDismiss={() => dismiss(t.id)} />
              ))}
            </View>
          );
        })}
      </Portal>
    </ToastContext.Provider>
  );
}

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-card border-border",
  destructive: "bg-destructive border-destructive",
  success: "bg-green-600 border-green-600",
};

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const variant = data.variant ?? "default";
  const isDefault = variant === "default";
  const { enter, exit } = animationFor[data.from ?? "top"];
  return (
    <Animated.View entering={enter} exiting={exit}>
      <Pressable
        className={cn("rounded-lg border p-4 shadow-lg", variantStyles[variant])}
        onPress={onDismiss}
        accessible={true}
        accessibilityRole="alert"
      >
        <Text className={cn("text-sm font-semibold", isDefault ? "text-foreground" : "text-white")}>{data.title}</Text>
        {data.description && (
          <Text className={cn("text-xs mt-1", isDefault ? "text-muted-foreground" : "text-white/80")}>{data.description}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}`;
export default function ToastPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Toast</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Notification toast with slide-in animation and auto-dismiss. Toasts rest at the top or bottom of the screen and can slide in from any of the four sides — position and animation direction are independent.
        </p>
      </div>
      {/* Preview */}
      <PreviewToggle>
        <ComponentPlayground code={usageCode}>
          <div className="w-full max-w-sm">
            <ToastDemo />
          </div>
        </ComponentPlayground>
      </PreviewToggle>
      {/* Installation */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Installation</Heading>
        <AddComponentTabs names="toast" />
        <p className="text-sm text-muted-foreground">
          Toast renders through a Portal so it always anchors to the screen instead of the nearest positioned ancestor (otherwise wrapping <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">ToastProvider</code> inside a ScrollView would make toasts scroll with the content). The CLI adds <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">&lt;PortalHost /&gt;</code> to your root layout automatically. Requires <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">react-native-reanimated</code> for the slide animations and <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">@rn-primitives/portal</code> for the portal host.
        </p>
      </div>
      {/* Usage */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Usage</Heading>
        <CodeBlock code={usageCode} title="app/index.tsx" />
      </div>
      {/* Variants */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Variants</Heading>
        <CodeBlock code={variantsCode} title="app/index.tsx" />
      </div>
      {/* Position & slide direction */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Position &amp; slide direction</Heading>
        <p className="text-sm text-muted-foreground">
          A toast has two independent controls:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ms-2">
          <li><code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">position</code> — where the toast rests on screen (<code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"top"</code> or <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"bottom"</code>). Both span the full width with consistent margins.</li>
          <li><code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">from</code> — which edge the toast slides in from (<code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"top"</code>, <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"bottom"</code>, <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"left"</code>, or <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">"right"</code>). Defaults to match <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">position</code>, so the natural pairing just works.</li>
        </ul>
        <CodeBlock code={positionsCode} title="app/index.tsx" />
      </div>
      {/* Props */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Props</Heading>
        <Heading as="h3" className="text-lg font-medium text-foreground">useToast</Heading>
        <p className="text-sm text-muted-foreground">
          Returns an object with a <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">toast</code> function.
        </p>
        <PropsTable props={[
          { name: "title", type: "string", default: "required" },
          { name: "description", type: "string" },
          { name: "variant", type: "\"default\" | \"destructive\" | \"success\"", default: "\"default\"" },
          { name: "position", type: "\"top\" | \"bottom\"", default: "provider default (\"top\")", description: "Where the toast rests on screen." },
          { name: "from", type: "\"top\" | \"bottom\" | \"left\" | \"right\"", default: "matches position", description: "Which edge the toast slides in from. Defaults to match position so the natural pairing just works." },
        ]} />
        <Heading as="h3" className="text-lg font-medium text-foreground mt-6">ToastProvider</Heading>
        <PropsTable props={[
          { name: "children", type: "React.ReactNode", default: "required" },
          { name: "defaultPosition", type: "\"top\" | \"bottom\"", default: "\"top\"", description: "App-wide default resting position." },
          { name: "defaultFrom", type: "\"top\" | \"bottom\" | \"left\" | \"right\"", default: "matches defaultPosition", description: "App-wide default slide-in direction." },
        ]} />
      </div>
      {/* Accessibility */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Accessibility</Heading>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Uses React Context provider with auto-dismiss timer</li>
          <li><code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">accessibilityRole="alert"</code> on each toast for screen reader announcements.</li>
        </ul>
      </div>
      {/* Source */}
      <div className="space-y-4">
        <Heading as="h2" className="text-2xl font-semibold tracking-tight text-foreground">Source</Heading>
        <CodeBlock code={sourceCode} title="components/ui/toast.tsx" />
      </div>
    </div>
  );
}
