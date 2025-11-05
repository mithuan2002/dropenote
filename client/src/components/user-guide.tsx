import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface UserGuideProps {
  title: string;
  steps: string[];
  tips?: string[];
  defaultExpanded?: boolean;
}

export function UserGuide({ title, steps, tips, defaultExpanded = false }: UserGuideProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-base text-blue-900 dark:text-blue-100">
              {title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            data-testid="button-toggle-guide"
          >
            {isExpanded ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How to use:
              </h4>
              <ol className="space-y-1.5 text-sm text-blue-800 dark:text-blue-200">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-semibold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {tips && tips.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Tips:
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}