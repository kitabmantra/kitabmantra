import { Suspense } from "react"
import AuthErrorPage from "./errorpage"


export default function ErrorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <AuthErrorPage />
    </Suspense>
  )
}