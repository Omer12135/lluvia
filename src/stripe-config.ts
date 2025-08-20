export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'subscription' | 'payment';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SneCt1kgIN2csV',
    priceId: 'price_1Rs2uSK4TeoPEcnVpJo9DVHV',
    name: 'Basic Plan',
    description: '2 free automations to get started with workflow automation',
    price: 0.00,
    mode: 'payment'
  },
  {
    id: 'prod_Sne4NREyHwP4Mv',
    priceId: 'price_1Rs2m2K4TeoPEcnV1SfYNA4H',
    name: 'Starter Plan',
    description: 'Perfect for small teams and growing businesses with advanced automation needs',
    price: 19.00,
    mode: 'subscription'
  },
  {
    id: 'prod_Sne4tG5dYu1o4G',
    priceId: 'price_1Rs2mPK4TeoPEcnVVGOmeNcs',
    name: 'Pro Plan',
    description: 'Advanced automation features for large teams and enterprises',
    price: 99.00,
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};