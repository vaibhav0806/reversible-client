'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, CheckCircle, RefreshCcw, Shield } from 'lucide-react'
import { Modal } from "./components/modal"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Crypto Transactions with Peace of Mind
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-200 md:text-xl">
                  Introducing the first DeFi platform that allows you to reverse transactions. Never worry about sending to the wrong address again.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-black hover:bg-zinc-200">Get Started</Button>
                <Button variant="outline" className="border-white bg-black text-white">
                  Learn More
                </Button>
              </div>
              <div className="pt-2">
                <Modal />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <RefreshCcw className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Reversible Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  Undo mistaken transactions within a set timeframe, providing an extra layer of security for your assets.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Enhanced Security</CardTitle>
                </CardHeader>
                <CardContent>
                  State-of-the-art encryption and multi-factor authentication to keep your funds safe.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>User-Friendly Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  Intuitive design makes managing your crypto assets easier than ever, even for beginners.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Initiate Transaction</h3>
                <p>Send crypto to any address using our secure platform.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Review Period</h3>
                <p>Transaction enters a brief review period before finalization.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Confirm or Reverse</h3>
                <p>Choose to confirm the transaction or reverse it if a mistake was made.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>John D.</CardTitle>
                  <CardDescription>Crypto Enthusiast</CardDescription>
                </CardHeader>
                <CardContent>
                  "This platform saved me from losing a significant amount due to a typo. The ability to reverse transactions is a game-changer in the crypto world."
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sarah M.</CardTitle>
                  <CardDescription>DeFi Investor</CardDescription>
                </CardHeader>
                <CardContent>
                  "I feel so much more confident making transactions now. The user interface is intuitive, and the added security gives me peace of mind."
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long do I have to reverse a transaction?</AccordionTrigger>
                <AccordionContent>
                  You have a 30-minute window to reverse a transaction after it's initiated. This provides ample time to catch mistakes while ensuring timely processing of correct transactions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a fee for reversing transactions?</AccordionTrigger>
                <AccordionContent>
                  There is a small fee associated with reversing transactions to cover the cost of processing. However, this fee is significantly less than potentially losing funds due to an incorrect transaction.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What cryptocurrencies do you support?</AccordionTrigger>
                <AccordionContent>
                  We currently support major cryptocurrencies including Bitcoin, Ethereum, and several popular ERC-20 tokens. We're constantly working on adding support for more currencies.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Secure Your Crypto Transactions?</h2>
                <p className="mx-auto max-w-[600px] text-zinc-200 md:text-xl">
                  Join thousands of users who trust our platform for safe and reversible crypto transactions.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-white text-black"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-zinc-400">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

