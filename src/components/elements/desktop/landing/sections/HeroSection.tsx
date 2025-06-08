import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedButton } from "../AnimatedButton"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  const { scrollYProgress } = useScroll()
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1E3A8A]/5 to-[#0D9488]/5">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{ y: bgY }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/kitabmantra.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/10 via-white/95 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{ y: bgY }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-[#1E3A8A]/20 to-[#0D9488]/10 blur-3xl transform translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#0D9488]/20 to-[#1E3A8A]/10 blur-3xl transform -translate-x-1/3 translate-y-1/2" />
      </motion.div>

      {/* Hero content */}
      <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/5 via-white/95 to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('/abstract-pattern.png')] bg-repeat opacity-5"
        />
      </motion.div>

      <div className="container relative z-10 px-4 py-12 md:px-6 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-8 max-w-xl"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-block"
              >
                <motion.span
                  className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#1E3A8A]/20 to-[#0D9488]/20 text-[#1E3A8A] text-sm font-medium backdrop-blur-sm"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(30, 58, 138, 0.1), 0 8px 10px -6px rgba(30, 58, 138, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Welcome to Kitab Mantra
                </motion.span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-5xl font-bold tracking-tighter text-[#1E3A8A] sm:text-6xl md:text-7xl lg:text-8xl">
                  Discover Your Next
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="block bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent"
                  >
                    Favorite Book
                  </motion.span>
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-xl text-[#4B5563] md:text-2xl"
                >
                  Explore our vast collection of bestsellers, classics, and hidden gems. Your literary journey begins here.
                </motion.p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col gap-4 min-[400px]:flex-row"
            >
              <Link href="/marketplace">
                <AnimatedButton className="h-14 w-full min-[400px]:w-auto bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/90 text-white hover:from-[#0D9488] hover:to-[#0D9488]/90 transition-all duration-300 text-lg px-10 relative overflow-hidden group shadow-lg hover:shadow-xl">
                  Browse Books
                </AnimatedButton>
              </Link>
              <Link href="#about">
                <AnimatedButton
                  variant="outline"
                  className="h-14 w-full min-[400px]:w-auto border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#F9FAFB] hover:text-[#0D9488] hover:border-[#0D9488] transition-all duration-300 text-lg px-10 relative overflow-hidden group shadow-sm hover:shadow-md"
                >
                  About Us
                </AnimatedButton>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#1E3A8A]/20 to-[#0D9488]/20 flex items-center justify-center"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -4px rgba(30, 58, 138, 0.1)",
                    }}
                  >
                    <span className="text-xs font-medium text-[#1E3A8A]">{i}</span>
                  </motion.div>
                ))}
              </div>
              <motion.p className="text-base text-[#4B5563]" whileHover={{ scale: 1.05 }}>
                Join <span className="font-medium text-[#1E3A8A]">1,000+</span> happy readers
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex items-center justify-end"
          >
            <motion.div
              className="relative w-full max-w-lg aspect-square"
              whileHover={{
                scale: 1.03,
                rotate: 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1E3A8A]/20 to-[#0D9488]/20 transform rotate-6 scale-95" />
              <div className="absolute inset-0 rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('/book-texture.png')] opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <Image
                      src="/kitabmantra.png"
                      alt="Book illustration"
                      fill
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#1E3A8A]/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-8 h-12 rounded-full border-2 border-[#1E3A8A] flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
} 