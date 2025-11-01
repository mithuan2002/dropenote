import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  description: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappGroupLink: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function InfluencerProfile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["/api/influencer/profile"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      businessName: "",
      phone: "",
      description: "",
      whatsappNumber: "",
      whatsappGroupLink: "",
    },
  });

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest("POST", "/api/influencer/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/influencer/profile"] });
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });
      setLocation("/influencer");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/influencer">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Influencer Profile</h1>
            <p className="text-sm text-muted-foreground">
              Set up your profile information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">
                This information will be visible to your followers
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        data-testid="input-name"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business/Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Business"
                        {...field}
                        data-testid="input-business-name"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        {...field}
                        data-testid="input-phone"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell your followers about your business..."
                        {...field}
                        data-testid="input-description"
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} data-testid="input-whatsapp-number" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappGroupLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Group Invitation Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://chat.whatsapp.com/..." {...field} data-testid="input-whatsapp-group-link" className="h-12" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Followers will receive this link when you invite them to your community
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Link href="/influencer">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  data-testid="button-save-profile"
                >
                  {mutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}