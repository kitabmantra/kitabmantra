/*eslint-disable*/
"use client"
import { Session } from 'next-auth'
import React, { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useUploadThing } from '@/lib/utils/uploadthing-client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { checkUserName } from '@/lib/actions/user/get/checkUserName'
import { createUser } from '@/lib/actions/user/post/createUser'
import { removeMultipleImages } from '@/lib/actions/uploadthing/delete-images'

function OnboardingForm({ session }: { session: Session }) {
  const user = session?.user
  const [files, setFiles] = useState<File[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>(session?.user?.name || '')
  const [userName, setUserName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader")

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const file = selectedFiles[0]
    setFiles([file])

    const previewUrl = URL.createObjectURL(file)
    setPreviewImage(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }


  const handleCreateUser = 
    async () => {
      if (!session?.user) return;
      setIsLoading(true)
      try {
        const userData = {
          userId: user?.id!,
          name: name!,
          email: user?.email!,
          userName: userName!,
          phoneNumber,
          image: user?.image || undefined,
        }
        console.log("this is userData : ", userData)
        const userNameValid = await checkUserName(userName.trim())
        if (!userNameValid) {
          toast.error("Username is already used")
          return;
        }
        if (files.length > 0) {
          const result = await startUpload(files)
          if (result && result[0]?.ufsUrl) {
            userData.image = result[0].ufsUrl;
            setImageUrl(result[0].ufsUrl)
          }
        }

        const response = await createUser(userData)
        if (response.success && response.message) {
          toast.success(response.message)
          router.push("/")
        } else if (response.error) {
         toast.error(response.error as string)
        }
      } catch (error) {
        console.error("Error creating user:", error)
        if (imageUrl) {
          await removeMultipleImages([imageUrl])
        }
        toast.error(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
        setPreviewImage(null)
        setFiles([])
        setImageUrl(null)
      }
    }

  const getInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.split(' ')
    return names.map(name => name[0].toUpperCase()).join('')
  }

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (imageUrl) {
        await removeMultipleImages([imageUrl]);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [imageUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-col items-center">
          <div className="relative mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              className="w-24 h-24 rounded-full border-4 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors overflow-hidden flex items-center justify-center bg-gray-200"
              onClick={handleAvatarClick}
            >
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                  priority
                />
              ) : user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <span className="text-2xl font-bold text-gray-700">
                  {getInitials()}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              defaultValue={user?.name || ''}
              className="border-gray-300 focus:border-gray-500"
              required
              minLength={3}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              className="border-gray-300 focus:border-gray-500"
              required
              minLength={3}
              placeholder='Enter your username'
              maxLength={30}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel" // or "number" if you prefer mobile number keyboards
              pattern="[0-9]*" // Ensures only numbers are allowed
              placeholder="Enter your phone number"
              minLength={10}
              maxLength={20}
              required
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPhoneNumber(value);
              }}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleCreateUser}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium"
            disabled={isLoading || !name || !userName}
          >
            {isLoading ? "Creating..." : "Complete Profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OnboardingForm
