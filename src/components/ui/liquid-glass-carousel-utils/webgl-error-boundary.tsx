"use client";

import React, { Component, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGL Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export function WebGLFallback({
  className,
  message = "WebGL is not supported or encountered an issue in this browser.",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center text-sm text-deep/60 bg-cream rounded-2xl",
        className
      )}
    >
      <p>{message}</p>
    </div>
  );
}
