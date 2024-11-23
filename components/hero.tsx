"use client"

import { useState } from 'react'
import { Wrench, Code, Zap } from 'lucide-react' // Removed ChevronDown as it was not used
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const features = [
  { icon: Code, text: "Modern Syntax Highlighting" },
  { icon: Zap, text: "Lightning-fast Performance" },
  { icon: Wrench, text: "Customizable Tools" },
]

export function Hero() {
  const [showMore, setShowMore] = useState(false) // This state is now used to toggle the visibility of additional features

  return (
    <div className="container mx-auto text-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Wrench className="w-16 h-16 mx-auto mb-6 text-primary" />
      </motion.div>
      <motion.h1 
        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="block text-foreground">Developer Tools</span>
        <span className="block text-primary">Simplified</span>
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Badge variant="secondary" className="text-sm mb-4">New Release v0.2</Badge>
      </motion.div>
      <motion.p 
        className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Quick and reliable tools for developers, all in one place. Built with
        modern web standards and designed for efficiency.
      </motion.p>
      <motion.div
        className="mt-8 flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button size="lg" onClick={() => setShowMore(!showMore)}>Get Started</Button>
      </motion.div>
      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
      </motion.div>
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{feature.text}</h3>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

