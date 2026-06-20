import React from "react";
import { ShoppingBag, ShoppingCart, CreditCard, Receipt, Wallet, Tag, Trash2, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EcommerceRenderers: Record<string, React.FC<{ props: any, blockId: string }>> = {
  ecommerce_product_grid: ({ props }) => (
    <div className="w-full my-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Featured Products</h3>
        <Button variant="link">View All</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="overflow-hidden group hover:shadow-md transition-all">
            <div className="w-full aspect-square bg-muted relative">
              <Badge className="absolute top-2 left-2 z-10">New</Badge>
              <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Category</div>
              <h4 className="font-bold text-sm truncate">Premium Smart Watch {i}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold">${(199.99 * i).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground line-through">${(249.99 * i).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full h-8 text-xs"><ShoppingCart className="w-3 h-3 mr-2" /> Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  ),
  ecommerce_cart: ({ props }) => (
    <div className="w-full my-4 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Shopping Cart (3 Items)</h3>
       </div>
       <div className="p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
             {[1, 2].map(i => (
                <div key={i} className="flex gap-4 items-center">
                   <div className="w-20 h-20 bg-muted rounded-xl shrink-0 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80`} alt="Product" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-sm">Wireless Headphones</h4>
                      <div className="text-xs text-muted-foreground mt-1">Color: Black | Size: One Size</div>
                      <div className="font-bold text-primary mt-2">$299.00</div>
                   </div>
                   <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                      <Button variant="ghost" size="icon" className="w-6 h-6"><Minus className="w-3 h-3" /></Button>
                      <span className="text-xs font-bold w-4 text-center">1</span>
                      <Button variant="ghost" size="icon" className="w-6 h-6"><Plus className="w-3 h-3" /></Button>
                   </div>
                   <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
             ))}
          </div>
          <div className="w-full md:w-80 bg-muted/20 rounded-xl p-6 border border-border">
             <h4 className="font-bold mb-4">Order Summary</h4>
             <div className="space-y-2 text-sm text-muted-foreground mb-4 border-b border-border pb-4">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground font-medium">$598.00</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-foreground font-medium">$15.00</span></div>
                <div className="flex justify-between"><span>Tax</span><span className="text-foreground font-medium">$42.00</span></div>
             </div>
             <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>$655.00</span></div>
             <Button className="w-full py-6">Proceed to Checkout</Button>
          </div>
       </div>
    </div>
  ),
  ecommerce_checkout: ({ props }) => (
    <div className="w-full my-4 bg-card border border-border rounded-2xl shadow-sm p-8">
       <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
          <CreditCard className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-black tracking-tight">Secure Checkout</h3>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
             <div>
                <h4 className="font-bold mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span> Shipping Details</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>First Name</Label><Input placeholder="John" /></div>
                   <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Doe" /></div>
                   <div className="space-y-2 col-span-2"><Label>Address</Label><Input placeholder="123 Main St" /></div>
                   <div className="space-y-2"><Label>City</Label><Input placeholder="New York" /></div>
                   <div className="space-y-2"><Label>ZIP Code</Label><Input placeholder="10001" /></div>
                </div>
             </div>
             <div>
                <h4 className="font-bold mb-4 flex items-center gap-2 mt-8"><span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span> Payment Method</h4>
                <div className="space-y-4">
                   <div className="border border-primary bg-primary/5 rounded-xl p-4 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-primary" /><span className="font-bold text-sm">Credit Card</span></div>
                      <div className="w-4 h-4 rounded-full border-[5px] border-primary" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2"><Label>Card Number</Label><Input placeholder="0000 0000 0000 0000" /></div>
                      <div className="space-y-2"><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                      <div className="space-y-2"><Label>CVC</Label><Input placeholder="123" /></div>
                   </div>
                </div>
             </div>
          </div>
          <div>
             <div className="bg-muted/30 border border-border rounded-2xl p-6 sticky top-24">
                <h4 className="font-bold mb-6">Order Summary</h4>
                <div className="space-y-4 mb-6">
                   {[1, 2].map(i => (
                      <div key={i} className="flex gap-4">
                         <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0"><img src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80`} alt="Product" className="w-full h-full object-cover" /></div>
                         <div className="flex-1"><h5 className="text-sm font-bold">Product Name</h5><p className="text-xs text-muted-foreground mt-1">Qty: 1</p></div>
                         <div className="font-bold text-sm">$299.00</div>
                      </div>
                   ))}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4 border-y border-border py-4">
                   <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground font-medium">$598.00</span></div>
                   <div className="flex justify-between"><span>Shipping</span><span className="text-foreground font-medium">Free</span></div>
                </div>
                <div className="flex justify-between font-black text-xl mb-6"><span>Total</span><span>$598.00</span></div>
                <Button className="w-full py-6 text-lg rounded-xl shadow-lg shadow-primary/20">Pay $598.00</Button>
             </div>
          </div>
       </div>
    </div>
  ),
  finance_invoice: ({ props }) => (
    <div className="w-full max-w-3xl mx-auto my-8 bg-card border border-border rounded-xl shadow-sm p-12">
       <div className="flex justify-between items-start mb-12 border-b border-border pb-8">
          <div>
             <div className="w-12 h-12 bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center rounded-xl mb-4">A</div>
             <h3 className="font-bold text-xl">Acme Corp Inc.</h3>
             <p className="text-sm text-muted-foreground mt-1">123 Business Rd.<br/>Tech City, TC 10101</p>
          </div>
          <div className="text-right">
             <h2 className="text-3xl font-black text-muted-foreground/30 mb-2 uppercase tracking-widest">Invoice</h2>
             <p className="font-bold text-lg">INV-2026-001</p>
             <p className="text-sm text-muted-foreground mt-1">Date: Jun 19, 2026</p>
          </div>
       </div>
       <div className="w-full mb-8">
          <div className="grid grid-cols-4 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">
             <div className="col-span-2">Description</div>
             <div className="text-center">Qty</div>
             <div className="text-right">Amount</div>
          </div>
          {[1, 2].map(i => (
             <div key={i} className="grid grid-cols-4 py-3 border-b border-border/50 text-sm">
                <div className="col-span-2 font-medium">Enterprise Software License {i}</div>
                <div className="text-center text-muted-foreground">{i}</div>
                <div className="text-right font-medium">${(i * 1500).toFixed(2)}</div>
             </div>
          ))}
       </div>
       <div className="flex justify-end">
          <div className="w-64 space-y-3">
             <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">$4,500.00</span></div>
             <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (10%)</span><span className="font-medium">$450.00</span></div>
             <div className="flex justify-between text-lg font-black pt-3 border-t border-border"><span>Total</span><span className="text-primary">$4,950.00</span></div>
          </div>
       </div>
    </div>
  ),
  finance_wallet: ({ props }) => (
    <Card className="my-4 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative border-0 shadow-xl">
      <div className="absolute top-0 right-0 p-6 opacity-10"><Wallet className="w-32 h-32" /></div>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-400">Available Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black mb-6 tracking-tighter">$12,431.00</div>
        <div className="flex gap-4">
           <Button className="flex-1 bg-white text-black hover:bg-gray-200">Add Funds</Button>
           <Button variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700 bg-transparent">Withdraw</Button>
        </div>
      </CardContent>
    </Card>
  ),
  finance_pricing: ({ props }) => (
    <div className="w-full my-8 grid grid-cols-1 md:grid-cols-3 gap-8">
       {['Basic', 'Pro', 'Enterprise'].map((plan, i) => (
          <Card key={i} className={`relative overflow-hidden ${i === 1 ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
             {i === 1 && <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-[10px] font-bold py-1 uppercase tracking-widest">Most Popular</div>}
             <CardHeader className={`text-center ${i === 1 ? 'pt-8' : ''}`}>
                <h3 className="font-bold text-lg mb-2">{plan}</h3>
                <div className="flex items-center justify-center font-black tracking-tighter">
                   <span className="text-2xl mr-1 text-muted-foreground">$</span>
                   <span className="text-5xl">{i === 0 ? '0' : i === 1 ? '29' : '99'}</span>
                   <span className="text-sm text-muted-foreground ml-1 self-end mb-1">/mo</span>
                </div>
             </CardHeader>
             <CardContent className="space-y-4 mt-4">
                {[1, 2, 3, 4].map(f => (
                   <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">✓</div>
                      Feature inclusion {f}
                   </div>
                ))}
             </CardContent>
             <CardFooter>
                <Button className="w-full" variant={i === 1 ? 'default' : 'outline'}>{i === 0 ? 'Get Started' : 'Upgrade'}</Button>
             </CardFooter>
          </Card>
       ))}
    </div>
  ),
};
