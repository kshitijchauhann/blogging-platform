"use client"
import type { SpanProps } from "@chakra-ui/react"
import { Span } from "@chakra-ui/react"
import * as React from "react"

export interface ColorModeProviderProps {
  children?: React.ReactNode
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <Span
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      {...props}
    />
  )
}

export type ColorMode = "light"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  return {
    colorMode: "light",
    setColorMode: () => {},
    toggleColorMode: () => {},
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  return light
}

export function ColorModeIcon() {
  return null
}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, {}>(
  function ColorModeButton(props, ref) {
    return null
  },
)

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return <Span display="contents" ref={ref} {...props} />
  },
)
