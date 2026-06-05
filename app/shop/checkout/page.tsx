'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, ChevronRight, ChevronLeft, CreditCard, Truck, MapPin, Check, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { useRouter } from 'next/navigation'
import { useDefaultRegion, getSDK } from '@/app/lib/medusa'
import type { MedusaCart, MedusaLineItem } from '@/app/lib/medusa-types'

// ========== Types ==========

interface ShippingAddress {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

interface ShippingOption {
  id: string
  name: string
  amount: number
  provider_id: string
}

interface PaymentProvider {
  id: string
  is_enabled: boolean
}

type CheckoutStep = 'info' | 'shipping' | 'payment' | 'confirm'

// ========== Constants ==========

const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

// ========== Page ==========

export default function CheckoutPage() {
  const router = useRouter()
  const { regionId } = useDefaultRegion()

  // Cart state
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [cartLoading, setCartLoading] = useState(true)

  // Step state
  const [step, setStep] = useState<CheckoutStep>('info')
  const [stepError, setStepError] = useState('')

  // Shipping address
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<ShippingAddress>({
    first_name: '', last_name: '', address_1: '', city: '',
    postal_code: '', country_code: 'us', province: '',
  })

  // Shipping options
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [shippingLoading, setShippingLoading] = useState(false)

  // Payment
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([])
  const [selectedPayment, setSelectedPayment] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Place order
  const [placing, setPlacing] = useState(false)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [orderError, setOrderError] = useState('')

  // Load cart from localStorage
  useEffect(() => {
    const cartId = localStorage.getItem('cart_id')
    if (!cartId) {
      setCartLoading(false)
      return
    }
    getSDK()
      .store.cart.retrieve(cartId)
      .then(({ cart }: any) => {
        setCart(cart as MedusaCart)
        if (cart.email) setEmail(cart.email)
        if (cart.shipping_address) {
          const sa = cart.shipping_address
          setAddress({
            first_name: sa.first_name || '',
            last_name: sa.last_name || '',
            company: sa.company || '',
            address_1: sa.address_1 || '',
            address_2: sa.address_2 || '',
            city: sa.city || '',
            province: sa.province || '',
            postal_code: sa.postal_code || '',
            country_code: sa.country_code || 'us',
            phone: sa.phone || '',
          })
        }
        if (cart.shipping_methods?.length) {
          setSelectedShipping(cart.shipping_methods[0].shipping_option_id || '')
        }
      })
      .catch(() => localStorage.removeItem('cart_id'))
      .finally(() => setCartLoading(false))
  }, [])

  // Sync cart updates to state
  const updateCartState = useCallback((updatedCart: MedusaCart) => {
    setCart(updatedCart)
    if (updatedCart.shipping_methods?.length) {
      setSelectedShipping(updatedCart.shipping_methods[0].shipping_option_id || '')
    }
  }, [])

  // Load shipping options when cart has address
  useEffect(() => {
    if (!cart?.id || !address.address_1) return
    setShippingLoading(true)
    getSDK()
      .store.fulfillment.listCartOptions({ cart_id: cart.id })
      .then((response: any) => {
        setShippingOptions(response.shipping_options || [])
      })
      .catch(() => {})
      .finally(() => setShippingLoading(false))
  }, [cart?.id, address.address_1])

  // Load payment providers when region is known
  useEffect(() => {
    if (!regionId) return
    getSDK()
      .store.payment.listPaymentProviders({ region_id: regionId })
      .then((response: any) => {
        setPaymentProviders(response.payment_providers || [])
      })
      .catch(() => {})
  }, [regionId])

  // ---- Step Navigation ----

  const goToStep = (s: CheckoutStep) => {
    setStepError('')
    setStep(s)
    window.scrollTo(0, 0)
  }

  // ---- Save Shipping Info ----

  const saveShippingInfo = async () => {
    if (!email) { setStepError('Please enter your email'); return }
    if (!address.first_name || !address.last_name) { setStepError('Please enter your name'); return }
    if (!address.address_1 || !address.city || !address.postal_code) { setStepError('Please fill in your address'); return }

    setStepError('')
    const cartId = cart?.id || localStorage.getItem('cart_id')
    if (!cartId) { setStepError('Cart not found'); return }

    try {
      const { cart: updated } = await getSDK().store.cart.update(cartId, {
        email,
        shipping_address: address,
      })
      updateCartState(updated as MedusaCart)
      goToStep('shipping')
    } catch (err: any) {
      setStepError(err?.message || 'Failed to save shipping info')
    }
  }

  // ---- Save Shipping Method ----

  const saveShippingMethod = async () => {
    if (!selectedShipping) { setStepError('Please select a shipping method'); return }
    setStepError('')
    const cartId = cart?.id
    if (!cartId) return

    try {
      const { cart: updated } = await getSDK().store.cart.addShippingMethod(cartId, {
        option_id: selectedShipping,
      })
      updateCartState(updated as MedusaCart)
      goToStep('payment')
    } catch (err: any) {
      setStepError(err?.message || 'Failed to save shipping method')
    }
  }

  // ---- Initiate Payment ----

  const savePayment = async () => {
    if (!selectedPayment) { setStepError('Please select a payment method'); return }
    setStepError('')
    setPaymentLoading(true)
    try {
      await getSDK().store.payment.initiatePaymentSession(
        cart as any,
        { provider_id: selectedPayment }
      )
      goToStep('confirm')
    } catch (err: any) {
      setStepError(err?.message || 'Failed to initialize payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  // ---- Place Order ----

  const placeOrder = async () => {
    setPlacing(true)
    setOrderError('')
    try {
      const data: any = await getSDK().store.cart.complete(cart!.id)
      if (data.type === 'cart') {
        setOrderError(data.error?.message || data.error || 'Order could not be completed')
        return
      }
      setOrderResult(data)
      localStorage.removeItem('cart_id')
    } catch (err: any) {
      setOrderError(err?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  // ---- Loading State ----

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-rice pt-16">
        <Navigation solid />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
          <Loader2 size="32" className="animate-spin text-bronze mx-auto mb-4" />
          <p className="text-ink/50">Loading your cart...</p>
        </div>
      </div>
      </div>
    )
  }

  // ---- Empty Cart ----

  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-screen bg-rice pt-16">
        <Navigation solid />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShoppingCart size={48} className="text-ink/20 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-ink mb-2">Your cart is empty</h1>
          <p className="text-ink/50 mb-6">Add some items to your cart before checking out.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-bronze text-rice px-6 py-3 rounded-sm hover:bg-bronze/80 transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  // ---- Order Success ----

  if (orderResult) {
    const order = orderResult.order || orderResult
    return (
      <div className="min-h-screen bg-rice pt-16">
        <Navigation solid />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-ink mb-2">Order Placed!</h1>
          <p className="text-ink/60 mb-1">Thank you for your purchase.</p>
          {order.id && (
            <p className="text-sm text-ink/40 mb-6">Order ID: <span className="font-mono">{order.id}</span></p>
          )}
          <Link href="/shop" className="inline-flex items-center gap-2 bg-bronze text-rice px-6 py-3 rounded-sm hover:bg-bronze/80 transition-colors">
            Continue Shopping
          </Link>
        </div>
        </div>
      </div>
    )
  }

  // ---- Main Checkout ----

  const items: MedusaLineItem[] = cart.items || []
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const shippingCost = cart.shipping_methods?.reduce((sum, sm) => sum + (sm.amount || 0), 0) || 0
  const total = subtotal + shippingCost

  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      {/* Step Indicators */}
      <div className="bg-white border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-8 text-sm">
            {(['info', 'shipping', 'payment', 'confirm'] as CheckoutStep[]).map((s, i) => {
              const labels: Record<CheckoutStep, string> = { info: 'Information', shipping: 'Shipping', payment: 'Payment', confirm: 'Confirmation' }
              const isActive = step === s
              const isDone = ['info', 'shipping', 'payment', 'confirm'].indexOf(step) > i
              return (
                <div key={s} className={`flex items-center gap-2 ${isActive ? 'text-ink' : isDone ? 'text-green-600' : 'text-ink/30'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2
                    ${isActive ? 'border-bronze bg-bronze text-rice' : isDone ? 'border-green-500 bg-green-500 text-white' : 'border-ink/20'}`}>
                    {isDone ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`hidden md:inline ${isActive ? 'font-medium' : ''}`}>{labels[s]}</span>
                  {i < 3 && <ChevronRight size={16} className="hidden md:inline text-ink/20" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">

            {/* ---- STEP 1: INFORMATION ---- */}
            {step === 'info' && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-6">Contact & Shipping</h2>

                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                    />
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">First Name</label>
                      <input
                        value={address.first_name}
                        onChange={e => setAddress({ ...address, first_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Last Name</label>
                      <input
                        value={address.last_name}
                        onChange={e => setAddress({ ...address, last_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Company (optional)</label>
                    <input
                      value={address.company || ''}
                      onChange={e => setAddress({ ...address, company: e.target.value })}
                      className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Address</label>
                    <input
                      value={address.address_1}
                      onChange={e => setAddress({ ...address, address_1: e.target.value })}
                      placeholder="Street address"
                      className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white mb-3"
                    />
                    <input
                      value={address.address_2 || ''}
                      onChange={e => setAddress({ ...address, address_2: e.target.value })}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">City</label>
                      <input
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">State</label>
                      <select
                        value={address.province}
                        onChange={e => setAddress({ ...address, province: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      >
                        <option value="">Select state</option>
                        {Object.entries(US_STATES).map(([code, name]) => (
                          <option key={code} value={code}>{name} ({code})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ZIP + Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">ZIP Code</label>
                      <input
                        value={address.postal_code}
                        onChange={e => setAddress({ ...address, postal_code: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Phone (optional)</label>
                      <input
                        type="tel"
                        value={address.phone || ''}
                        onChange={e => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-ink/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-bronze bg-white"
                      />
                    </div>
                  </div>
                </div>

                {stepError && <p className="mt-4 text-sm text-cinnabar flex items-center gap-1"><AlertCircle size={14} />{stepError}</p>}

                <button
                  onClick={saveShippingInfo}
                  className="mt-6 w-full bg-bronze text-rice py-3 rounded-sm text-sm font-medium hover:bg-bronze/80 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Shipping <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ---- STEP 2: SHIPPING METHOD ---- */}
            {step === 'shipping' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif text-ink">Shipping Method</h2>
                  <button onClick={() => goToStep('info')} className="text-xs text-ink/40 hover:text-ink underline">Edit address</button>
                </div>

                <div className="bg-white border border-ink/10 rounded-sm p-4 mb-6 flex items-start gap-3 text-sm">
                  <MapPin size={16} className="text-ink/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink">{address.first_name} {address.last_name}</p>
                    <p className="text-ink/60">{address.address_1}{address.address_2 ? `, ${address.address_2}` : ''}</p>
                    <p className="text-ink/60">{address.city}, {address.province} {address.postal_code}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {shippingLoading ? (
                    <div className="text-center py-8 text-sm text-ink/40 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Loading shipping options...
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-ink/50 text-sm mb-2">No shipping options available</p>
                      <p className="text-xs text-ink/30">Please check your shipping address</p>
                    </div>
                  ) : (
                    shippingOptions.map(opt => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                          selectedShipping === opt.id
                            ? 'border-bronze bg-bronze/5'
                            : 'border-ink/10 bg-white hover:border-ink/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={selectedShipping === opt.id}
                            onChange={() => setSelectedShipping(opt.id)}
                            className="accent-bronze"
                          />
                          <div>
                            <p className="text-sm font-medium text-ink">{opt.name}</p>
                            <p className="text-xs text-ink/40">Estimated delivery</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-ink">${(opt.amount || 0).toFixed(2)}</span>
                      </label>
                    ))
                  )}
                </div>

                {stepError && <p className="mt-4 text-sm text-cinnabar flex items-center gap-1"><AlertCircle size={14} />{stepError}</p>}

                <div className="mt-6 flex gap-3">
                  <button onClick={() => goToStep('info')} className="px-6 py-3 border border-ink/20 rounded-sm text-sm text-ink/60 hover:text-ink transition-colors flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={saveShippingMethod}
                    disabled={!selectedShipping}
                    className="flex-1 bg-bronze text-rice py-3 rounded-sm text-sm font-medium hover:bg-bronze/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ---- STEP 3: PAYMENT ---- */}
            {step === 'payment' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif text-ink">Payment</h2>
                  <button onClick={() => goToStep('shipping')} className="text-xs text-ink/40 hover:text-ink underline">Edit shipping</button>
                </div>

                <div className="space-y-3">
                  {paymentProviders.length === 0 ? (
                    <p className="text-sm text-ink/50">No payment methods available</p>
                  ) : (
                    paymentProviders.map(pp => {
                      const isPayPal = pp.id.includes('paypal')
                      const isStripe = pp.id.includes('stripe')
                      return (
                        <label
                          key={pp.id}
                          className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                            selectedPayment === pp.id
                              ? 'border-bronze bg-bronze/5'
                              : 'border-ink/10 bg-white hover:border-ink/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value={pp.id}
                              checked={selectedPayment === pp.id}
                              onChange={() => setSelectedPayment(pp.id)}
                              className="accent-bronze"
                            />
                            <div className="flex items-center gap-2">
                              <CreditCard size={18} className="text-ink/40" />
                              <div>
                                <p className="text-sm font-medium text-ink">{isPayPal ? 'PayPal' : isStripe ? 'Credit Card (Stripe)' : pp.id}</p>
                                <p className="text-xs text-ink/40">
                                  {isPayPal ? 'Pay with your PayPal account' : isStripe ? 'Pay with credit/debit card' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-ink/30">{isPayPal ? '🅿' : isStripe ? '💳' : ''}</span>
                        </label>
                      )
                    })
                  )}
                </div>

                {stepError && <p className="mt-4 text-sm text-cinnabar flex items-center gap-1"><AlertCircle size={14} />{stepError}</p>}

                <div className="mt-6 flex gap-3">
                  <button onClick={() => goToStep('shipping')} className="px-6 py-3 border border-ink/20 rounded-sm text-sm text-ink/60 hover:text-ink transition-colors flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={savePayment}
                    disabled={!selectedPayment || paymentLoading}
                    className="flex-1 bg-bronze text-rice py-3 rounded-sm text-sm font-medium hover:bg-bronze/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Continue to Review <ChevronRight size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* ---- STEP 4: CONFIRMATION ---- */}
            {step === 'confirm' && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-6">Review Your Order</h2>

                {/* Contact */}
                <div className="bg-white border border-ink/10 rounded-sm p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-ink">Contact</h3>
                    <button onClick={() => goToStep('info')} className="text-xs text-bronze hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-ink/60">{email}</p>
                </div>

                {/* Ship to */}
                <div className="bg-white border border-ink/10 rounded-sm p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-ink">Ship to</h3>
                    <button onClick={() => goToStep('info')} className="text-xs text-bronze hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-ink/60">{address.first_name} {address.last_name}</p>
                  <p className="text-sm text-ink/60">{address.address_1}</p>
                  <p className="text-sm text-ink/60">{address.city}, {address.province} {address.postal_code}</p>
                </div>

                {/* Shipping method */}
                <div className="bg-white border border-ink/10 rounded-sm p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-ink">Shipping Method</h3>
                    <button onClick={() => goToStep('shipping')} className="text-xs text-bronze hover:underline">Edit</button>
                  </div>
                  {cart.shipping_methods?.map(sm => (
                    <p key={sm.id} className="text-sm text-ink/60">{sm.name}</p>
                  ))}
                </div>

                {/* Payment method */}
                <div className="bg-white border border-ink/10 rounded-sm p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-ink">Payment Method</h3>
                    <button onClick={() => goToStep('payment')} className="text-xs text-bronze hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-ink/60">
                    {selectedPayment.includes('paypal') ? 'PayPal' : selectedPayment.includes('stripe') ? 'Credit Card (Stripe)' : selectedPayment}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white border border-ink/10 rounded-sm p-4">
                  <h3 className="text-sm font-medium text-ink mb-3">Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-sm bg-rice overflow-hidden shrink-0 relative">
                          {(item.thumbnail) ? (
                            <Image src={item.thumbnail} alt={item.title} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-ink/5 to-ink/10 flex items-center justify-center rounded-sm">
                              <span className="text-[10px] font-serif text-gold/40">
                                {(item.product_title || item.title).split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink truncate">{item.title}</p>
                          <p className="text-xs text-ink/40">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm text-ink">${(item.unit_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {orderError && <p className="mt-4 text-sm text-cinnabar flex items-center gap-1"><AlertCircle size={14} />{orderError}</p>}

                <div className="mt-6 flex gap-3">
                  <button onClick={() => goToStep('payment')} className="px-6 py-3 border border-ink/20 rounded-sm text-sm text-ink/60 hover:text-ink transition-colors flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="flex-1 bg-cinnabar text-rice py-3 rounded-sm text-sm font-medium hover:bg-cinnabar/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {placing ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : <>Place Order — ${total.toFixed(2)}</>}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ---- Order Summary Sidebar ---- */}
          <div className="md:col-span-1">
            <div className="bg-white border border-ink/10 rounded-sm p-5 sticky top-8">
              <h3 className="text-sm font-medium text-ink mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-sm bg-rice overflow-hidden shrink-0 relative">
                      {(item.thumbnail) ? (
                        <Image src={item.thumbnail} alt={item.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-ink/5 to-ink/10 flex items-center justify-center rounded-sm">
                          <span className="text-xs font-serif text-gold/40">
                            {(item.product_title || item.title).split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{item.title}</p>
                      <p className="text-xs text-ink/40">Qty: {item.quantity}</p>
                      <p className="text-sm text-gold font-serif">${(item.unit_price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="text-ink">${subtotal.toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Shipping</span>
                    <span className="text-ink">${shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium border-t border-ink/10 pt-2">
                  <span className="text-ink">Total</span>
                  <span className="text-gold text-lg font-serif">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
