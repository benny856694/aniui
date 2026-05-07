import React from "react";
import { View, Pressable, Text, useColorScheme } from "react-native";

const heights = { sm: 36, md: 44, lg: 56 } as const;

export interface SegmentedControlProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

export function SegmentedControl({ size = "md", className, options, value, onValueChange, ...props }: SegmentedControlProps) {
  const dark = useColorScheme() === "dark";
  const activeBg = dark ? "#27272a" : "#ffffff";
  const activeFg = dark ? "#fafafa" : "#09090b";
  const inactiveFg = dark ? "#a1a1aa" : "#71717a";
  return (
    <View
      className="rounded-lg bg-muted"
      style={{ height: heights[size], padding: 4, flexDirection: "row", borderRadius: 8 }}
      accessibilityRole="tablist"
      {...props}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: active ? activeBg : "transparent",
              ...(active ? { shadowColor: "#000", shadowOpacity: dark ? 0.4 : 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : {}),
            }}
            onPress={() => onValueChange(option)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: active ? activeFg : inactiveFg }}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
