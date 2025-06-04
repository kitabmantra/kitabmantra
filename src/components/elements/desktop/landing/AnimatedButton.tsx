import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

export function AnimatedButton({ children, className, variant = "default", type = "button", onClick }: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button className={className} variant={variant} type={type} onClick={onClick}>
        <motion.span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
        {children}
      </Button>
    </motion.div>
  )
} 