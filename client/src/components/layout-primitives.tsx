import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="mx-auto w-full max-w-screen-md px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight truncate">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium inline-flex items-center gap-1",
                trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 opacity-50">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}

export function BottomActionBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 md:relative md:z-auto",
      "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
      "md:border-0 md:bg-transparent md:backdrop-blur-none",
      "p-4 md:p-0 md:mt-6",
      "shadow-lg md:shadow-none",
      "animate-slide-in md:animate-none",
      className
    )}>
      <div className="mx-auto max-w-screen-md flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  backButton,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  backButton?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 pb-6", className)}>
      {backButton && <div className="mb-2">{backButton}</div>}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 opacity-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="h-4 w-1/3 bg-muted animate-skeleton rounded" />
          <div className="h-8 w-2/3 bg-muted animate-skeleton rounded" />
          <div className="h-3 w-1/2 bg-muted animate-skeleton rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
