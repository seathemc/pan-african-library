"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { Mail, Sparkles, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
      } else {
        setSent(true)
      }
    } catch {
      setError("Failed to send magic link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <Badge variant="secondary">Pan-African Library</Badge>
      </div>

      {errorParam && (
        <Card className="w-full border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              {errorParam === "missing-token" && "Invalid login link"}
              {errorParam === "Token expired" && "Your login link has expired. Please request a new one."}
              {errorParam === "Invalid token" && "Invalid login link. Please request a new one."}
              {errorParam === "verification-failed" && "Verification failed. Please try again."}
            </p>
          </CardContent>
        </Card>
      )}

      {!sent ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link. No password needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base">
              We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link in your email to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The link will expire in 15 minutes. If you don&apos;t see the email, check your spam folder.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSent(false)}
            >
              Try a different email
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-sm">
        By signing in, you&apos;ll be able to save collections and track your reading journey through pan-African literature.
      </p>
    </div>
  )
}
