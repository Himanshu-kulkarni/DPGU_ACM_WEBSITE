"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Mail, User, Send } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("membership");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim() || !email.includes("@")) errs.email = "Please provide a valid email address.";
    if (!message.trim()) errs.message = "Message content cannot be blank.";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
      }, 700);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Send an Inquiry</CardTitle>
        <CardDescription>
          We usually respond within 24 to 48 hours during academic terms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="py-6 space-y-4">
            <Toast
              variant="success"
              title="Message Recorded"
              message="Thank you for reaching out! A chapter officer will contact you shortly."
              onDismiss={() => setSubmitted(false)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setName("");
                setEmail("");
                setMessage("");
                setSubmitted(false);
              }}
            >
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="student@dpgu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <Select
              label="Inquiry Type"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={[
                { value: "membership", label: "Student Chapter Membership Application" },
                { value: "events", label: "Events & Hackathons Ticketing" },
                { value: "sponsorship", label: "Industry Collaboration & Sponsorship" },
                { value: "general", label: "General Chapter Questions" },
              ]}
            />

            <Textarea
              label="Message"
              placeholder="How can our chapter team assist you?"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={errors.message}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
