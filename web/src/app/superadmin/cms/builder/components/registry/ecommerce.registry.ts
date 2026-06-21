import { 
  ShoppingBag, ShoppingCart, CreditCard, Receipt, 
  Wallet, Tag, Percent
} from "lucide-react";
import { ComponentDefinition } from "./types";

export const EcommerceRegistry: ComponentDefinition[] = [
  // Ecommerce
  { id: 'ecommerce_product_grid', type: 'ecommerce_product_grid', displayName: 'Product Grid', label: 'Product Grid', category: 'Ecommerce', icon: ShoppingBag, defaultProps: {} },
  { id: 'ecommerce_cart', type: 'ecommerce_cart', displayName: 'Shopping Cart', label: 'Shopping Cart', category: 'Shopping', icon: ShoppingCart, defaultProps: {} },
  { id: 'ecommerce_checkout', type: 'ecommerce_checkout', displayName: 'Checkout Form', label: 'Checkout Form', category: 'Shopping', icon: CreditCard, defaultProps: {} },
  
  // Financial
  { id: 'finance_invoice', type: 'finance_invoice', displayName: 'Invoice Template', label: 'Invoice Template', category: 'Financial', icon: Receipt, defaultProps: {} },
  { id: 'finance_wallet', type: 'finance_wallet', displayName: 'Wallet Card', label: 'Wallet Card', category: 'Financial', icon: Wallet, defaultProps: {} },
  { id: 'finance_pricing', type: 'finance_pricing', displayName: 'Pricing Table', label: 'Pricing Table', category: 'Financial', icon: Tag, defaultProps: {} },
];
