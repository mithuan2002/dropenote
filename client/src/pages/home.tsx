import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Store, Tag, UserCircle } from "lucide-react";

export default function Home() {
  const roles = [
    {
      title: "Influencer",
      description: "Create campaigns and track performance",
      icon: UserCircle,
      path: "/influencer",
      testId: "link-influencer"
    },
    {
      title: "Store Staff",
      description: "Verify and redeem coupon codes",
      icon: Store,
      path: "/staff",
      testId: "link-staff"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-app-title">
            Dropnote
          </h1>
          <p className="text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {roles.map((role) => (
            <Link key={role.path} href={role.path}>
              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer h-32 flex flex-col items-center justify-center text-center" data-testid={role.testId}>
                <role.icon className="w-8 h-8 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}