"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Truck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

const doctorData = {
  "dr-aarav-mehta": {
    id: "dr-aarav-mehta",
    name: "Dr. Aarav Mehta",
    specialization: "General Physician",
    experience: "7+ years",
    location: "Bhubaneswar, Odisha",
    rate: 499,
    image: "/placeholder-user.jpg",
    rating: 4.8
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('doctor')
  const amount = searchParams.get('amount')

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const doctor = doctorId ? doctorData[doctorId as keyof typeof doctorData] : null

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsCompleted(true)
    }, 2000)
  }

  if (!doctor || !amount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4 sm:p-6 text-center">
            <Store className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 professional-heading">
              Invalid Payment Request
            </h2>
            <p className="text-muted-foreground mb-4 professional-body text-sm sm:text-base">
              The payment details are missing or invalid.
            </p>
            <Link href="/medicine-store">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Medicine Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-2 professional-heading">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground mb-6 professional-body text-sm sm:text-base">
              Your order has been placed successfully.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/user">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/medicine-store">
                <Button variant="outline" className="w-full btn-outline text-sm sm:text-base">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link href="/medicine-store">
            <Button variant="ghost" className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Medicine Store
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="professional-heading text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/placeholder.jpg"
                      alt="Medicine"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground professional-heading">
                      Sample Medicine
                    </h3>
                    <p className="text-primary font-medium professional-body text-sm sm:text-base">₹{amount}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                      <span>Qty: 1</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{amount}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">₹50</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{parseInt(amount || '0') + 50}</span>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-card-foreground professional-heading text-sm sm:text-base">What happens next?</p>
                      <ul className="text-xs sm:text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Order confirmation via SMS/email</li>
                        <li>• Medicines will be delivered within 2-3 hours</li>
                        <li>• Track your order in real-time</li>
                        <li>• Cash on delivery available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 professional-heading text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base font-medium">Select Payment Method</Label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="flex flex-col items-center gap-1 sm:gap-2 h-auto py-3 sm:py-4 text-xs sm:text-sm"
                    >
                      <CreditCard className="h-4 w-4 sm:h-6 sm:w-6" />
                      <span>Card</span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('upi')}
                      className="flex flex-col items-center gap-1 sm:gap-2 h-auto py-3 sm:py-4 text-xs sm:text-sm"
                    >
                      <Smartphone className="h-4 w-4 sm:h-6 sm:w-6" />
                      <span>UPI</span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('netbanking')}
                      className="flex flex-col items-center gap-1 sm:gap-2 h-auto py-3 sm:py-4 text-xs sm:text-sm"
                    >
                      <Truck className="h-4 w-4 sm:h-6 sm:w-6" />
                      <span>COD</span>
                    </Button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm sm:text-base">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-sm sm:text-base">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="mt-1 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm sm:text-base">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="mt-1 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-sm sm:text-base">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        className="mt-1 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                      />
                    </div>
                  </div>
                )}

                {/* UPI Payment */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="upiId" className="text-sm sm:text-base">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        className="mt-1 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                        inputMode="email"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@ybl)
                    </p>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">Cash on Delivery Selected</span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700 mt-1">
                        Pay when your order is delivered to your doorstep
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-primary text-sm sm:text-base py-3 sm:py-6"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Pay ₹{parseInt(amount || '0') + 50}
                    </>
                  )}
                </Button>

                <div className="text-center text-xs sm:text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
