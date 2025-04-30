/*eslint-disable*/
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Session } from "next-auth"
import toast from "react-hot-toast"
import { createUser } from "@/lib/actions/user/post/createUser"

export default function OnboardingForm({sessionData} : {sessionData : Session}) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await createUser({userName : username, phoneNumber, email : sessionData.user?.email!, name : sessionData.user?.name!, userId : sessionData.user?.id!, image  :sessionData.user?.image || "" })

      if(response.success && response.message){
        toast.success(response.message)
        router.push("/dashboard")
      }else if(response.error){
        toast.error(response.error as string)
      }
     
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error:", error)
      toast.error(error as string || "something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Complete Your Profile
        </CardTitle>
        <CardDescription className="text-center">
          Please provide some additional information to complete your profile
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Complete Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 