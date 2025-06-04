import { motion } from "framer-motion"
import { AnimatedButton } from "../AnimatedButton"
import Image from "next/image"
import Link from "next/link"

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1E3A8A] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#0D9488] blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container px-4 md:px-6 relative z-10"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center order-2 lg:order-1"
          >
            <div className="relative w-full max-w-lg aspect-square">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1E3A8A]/20 to-[#0D9488]/20 transform rotate-3 scale-95"
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/kitabmantra.png"
                  alt="Bookstore staff arranging books"
                  width={500}
                  height={500}
                  className="rounded-2xl object-cover"
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/30 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-6 order-1 lg:order-2"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#1E3A8A]/10 to-[#0D9488]/10 text-[#1E3A8A] text-sm font-medium"
              >
                About Us
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold tracking-tighter text-[#1E3A8A] md:text-4xl lg:text-5xl"
              >
                Our Story
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-[#4B5563]"
              >
                Kitab Mantra was founded in 2005 with a simple mission: to connect readers with stories that inspire,
                educate, and entertain.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[#4B5563]"
              >
                What started as a small corner shop has grown into a beloved community hub for book lovers. We carefully
                curate our collection to include diverse voices and perspectives, ensuring there&apos;s something for every
                reader.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-[#4B5563]"
              >
                Our knowledgeable staff are passionate about literature and always ready to help you find your next great
                read. We also host regular events, book clubs, and author signings to foster a vibrant literary community.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="#contact">
                <AnimatedButton className="h-12 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/90 text-white hover:from-[#0D9488] hover:to-[#0D9488]/90 transition-all duration-300 text-lg px-8 shadow-lg hover:shadow-xl">
                  Visit Us
                </AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 