"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  Star,
  Store,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Pill,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

const storeData = {
  "healthplus-medical-store": {
    id: "healthplus-medical-store",
    name: "HealthPlus Medical Store",
    location: "Saheed Nagar, Bhubaneswar",
    rating: 4.8,
    reviews: 245,
    openHours: "8AM – 10PM",
    image: "/placeholder.jpg",
    isOpen: true,
    description: "Your trusted pharmacy for quality medicines and healthcare products",
    medicines: [
      {
        id: "paracetamol-650mg",
        name: "Paracetamol 650mg",
        price: 35,
        description: "For fever and body ache",
        image: "/placeholder.jpg",
        inStock: true,
        category: "Pain Relief"
      },
      {
        id: "ors-powder",
        name: "ORS Powder",
        price: 20,
        description: "Rehydration powder",
        image: "/placeholder.jpg",
        inStock: true,
        category: "Electrolyte"
      },
      {
        id: "cough-syrup",
        name: "Cough Syrup (100ml)",
        price: 110,
        description: "Relief for cough and cold",
        image: "/placeholder.jpg",
        inStock: true,
        category: "Cough & Cold"
      }
    ]
  }
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function MedicineStoreDetailPage() {
  const params = useParams()
  const storeId = params.id as string

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const store = storeData[storeId as keyof typeof storeData]

  useEffect(() => {
    // Initialize quantities to 0
    const initialQuantities: Record<string, number> = {}
    store?.medicines.forEach(medicine => {
      initialQuantities[medicine.id] = 0
    })
    setQuantities(initialQuantities)
  }, [store])

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4 sm:p-6 text-center">
            <Store className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 professional-heading">
              Store Not Found
            </h2>
            <p className="text-muted-foreground mb-4 professional-body text-sm sm:text-base">
              The medicine store you're looking for doesn't exist.
            </p>
            <Link href="/medicine-store">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Stores
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const updateQuantity = (medicineId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [medicineId]: Math.max(0, newQuantity)
    }))
  }

  const addToCart = (medicine: any) => {
    const quantity = quantities[medicine.id]
    if (quantity > 0) {
      const existingItem = cart.find(item => item.id === medicine.id)
      if (existingItem) {
        setCart(prev => prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ))
      } else {
        setCart(prev => [...prev, {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: quantity,
          image: medicine.image
        }])
      }
      setQuantities(prev => ({ ...prev, [medicine.id]: 0 }))
      setShowCart(true)
    }
  }

  const updateCartQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== medicineId))
    } else {
      setCart(prev => prev.map(item =>
        item.id === medicineId
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/medicine-store">
              <Button variant="ghost" className="btn-outline text-sm sm:text-base">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Stores
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setShowCart(!showCart)}
              className="relative btn-outline text-sm sm:text-base"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Cart ({getTotalItems()})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Store Header */}
            <Card className="mb-6 sm:mb-8">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="relative w-full md:w-32 lg:w-48 h-32 sm:h-48 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={store.image}
                      alt={store.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground professional-heading mb-2">
                          {store.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                          <span className="font-medium text-sm sm:text-base">{store.rating}</span>
                          <span className="text-muted-foreground text-sm">({store.reviews} reviews)</span>
                          <Badge variant={store.isOpen ? "default" : "secondary"} className={`${store.isOpen ? "bg-green-500 hover:bg-green-600" : ""} text-xs`}>
                            {store.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>{store.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span>{store.openHours}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground professional-body text-sm sm:text-base">
                      {store.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicines Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground professional-heading mb-4 sm:mb-6">
                Available Medicines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {store.medicines.map((medicine) => (
                  <Card key={medicine.id} className="card-elevated">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-card-foreground professional-heading mb-1 text-sm sm:text-base lg:text-lg">
                            {medicine.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                            {medicine.description}
                          </p>
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">₹{medicine.price}</span>
                            <Badge variant="outline" className="text-xs">
                              {medicine.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(medicine.id, quantities[medicine.id] - 1)}
                                disabled={quantities[medicine.id] === 0}
                                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 p-0"
                              >
                                <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <span className="w-5 sm:w-6 lg:w-8 text-center font-medium text-xs sm:text-sm lg:text-base">
                                {quantities[medicine.id]}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(medicine.id, quantities[medicine.id] + 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 p-0"
                              >
                                <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                            <Button
                              onClick={() => addToCart(medicine)}
                              disabled={quantities[medicine.id] === 0}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-4 py-1 sm:py-2"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className={`lg:col-span-1 ${showCart ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 professional-heading text-lg sm:text-xl">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Your Cart ({getTotalItems()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground professional-body text-sm sm:text-base">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden bg-primary/10 flex items-center justify-center">
                          <Pill className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-xs sm:text-sm professional-heading">{item.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                          >
                            <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="w-4 sm:w-6 text-center text-xs sm:text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                          >
                            <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium">₹50</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base sm:text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₹{getTotalPrice() + 50}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-primary text-sm sm:text-base py-2 sm:py-3">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
