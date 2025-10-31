"use client"
import { ArrowRight, Heart, Brain, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <span className="text-2xl font-bold text-foreground">Mindwell</span>
        </div>
        <Link
          href="/chat"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Your AI Mental Wellness Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Real-time emotion detection, personalized wellness recommendations, and compassionate AI support for your
          mental health journey.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
        >
          Start Conversation <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <Brain className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Emotion Detection</h3>
            <p className="text-muted-foreground">
              Real-time AI analysis detects your emotions during conversations and provides instant insights.
            </p>
          </div>
          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <Zap className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Smart Recommendations</h3>
            <p className="text-muted-foreground">
              Personalized wellness suggestions including meditation, breathing exercises, and journaling.
            </p>
          </div>
          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <Heart className="w-10 h-10 text-rose-500 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              Your conversations and emotional data are completely private and never stored permanently.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
