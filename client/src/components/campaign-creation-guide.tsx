
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ExternalLink, Lock, Tag, Calendar, Percent, Link2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CampaignCreationGuide() {
  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Tag className="h-5 w-5" />
            Campaign Creation Guide
          </CardTitle>
          <CardDescription className="text-blue-800 dark:text-blue-200">
            Follow these steps to create an effective promotional campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">1</span>
              Basic Campaign Information
            </h4>
            <div className="ml-8 space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Campaign Name:</strong> A descriptive title for your campaign</p>
              <p className="text-xs pl-4">Example: "Summer Sale 2025" or "New Customer Discount"</p>
              
              <p className="pt-2"><strong>URL Slug:</strong> Creates your unique campaign link</p>
              <p className="text-xs pl-4">Example: "summer-sale" becomes yoursite.com/c/summer-sale</p>
              <p className="text-xs pl-4">Rules: Only lowercase letters, numbers, and hyphens (-)</p>
              
              <p className="pt-2"><strong>Promo Code:</strong> The code customers will enter</p>
              <p className="text-xs pl-4">Example: "SUMMER25" or "SAVE10"</p>
              <p className="text-xs pl-4">Tip: Make it easy to remember and type</p>
            </div>
          </div>

          {/* Discount Settings */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">2</span>
              Discount Configuration
            </h4>
            <div className="ml-8 space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Discount Percentage:</strong> How much discount customers receive (1-100%)</p>
              <p className="text-xs pl-4">Example: Enter "25" for 25% off</p>
            </div>
          </div>

          {/* Checkout URLs - Most Important */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">3</span>
              Checkout URLs (CRITICAL)
            </h4>
            <Alert className="ml-8 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                These URLs are the core of your campaign. Make sure they are correct!
              </AlertDescription>
            </Alert>
            
            <div className="ml-8 space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="space-y-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-green-600" />
                  Discounted Checkout URL
                </p>
                <p className="text-xs">This is your checkout page WITH the discount already applied.</p>
                <p className="text-xs font-semibold pt-2">How to get this URL:</p>
                <ol className="text-xs space-y-1 pl-4">
                  <li>1. Go to your online store (Shopify, WooCommerce, etc.)</li>
                  <li>2. Create a discount code in your store admin (same as your promo code)</li>
                  <li>3. Add items to cart and go to checkout</li>
                  <li>4. Apply the discount code at checkout</li>
                  <li>5. Copy the complete checkout URL from your browser</li>
                </ol>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
                  Example: https://yourstore.com/checkout?discount=SUMMER25
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 pt-2">
                  ✓ Customer sees discount automatically applied<br/>
                  ✓ No need to manually enter code at checkout
                </p>
              </div>

              <div className="space-y-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-gray-600" />
                  Normal Checkout URL
                </p>
                <p className="text-xs">This is your regular checkout page WITHOUT any discount.</p>
                <p className="text-xs font-semibold pt-2">How to get this URL:</p>
                <ol className="text-xs space-y-1 pl-4">
                  <li>1. Go to your online store</li>
                  <li>2. Add items to cart and go to checkout</li>
                  <li>3. Copy the checkout URL (without any discount code)</li>
                </ol>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
                  Example: https://yourstore.com/checkout
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 pt-2">
                  ✗ Used when promo code is invalid or wrong<br/>
                  ✗ Customer pays full price
                </p>
              </div>

              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                  <strong>How it works:</strong><br/>
                  • Customer visits your campaign page and enters the promo code<br/>
                  • If code is CORRECT → They get the Discounted Checkout URL<br/>
                  • If code is WRONG → They get the Normal Checkout URL<br/>
                  • This prevents unauthorized access to discounts
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Expiration */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">4</span>
              Campaign Duration
            </h4>
            <div className="ml-8 space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Expiration Date:</strong> When the campaign ends</p>
              <p className="text-xs pl-4">After this date, the campaign page will show as expired</p>
              <p className="text-xs pl-4">Tip: Set a clear deadline to create urgency</p>
            </div>
          </div>

          {/* Common Mistakes */}
          <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Common Mistakes to Avoid:</strong>
              <ul className="text-xs mt-2 space-y-1 list-disc pl-4">
                <li>Using the same URL for both discounted and normal checkout</li>
                <li>Forgetting to create the discount code in your store first</li>
                <li>Using an expired or invalid discount code URL</li>
                <li>Not testing both URLs before launching the campaign</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
