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
    name: 'Free Plan',
    description: '2 free automations to get started with workflow automation',
    price: 0.00,
    mode: 'payment'
  },
  {
    id: 'prod_Sne4tG5dYu1o4G',
    priceId: 'price_1Rs2mPK4TeoPEcnVVGOmeNcs',
    name: 'Pro Plan',
    description: 'Advanced automation features for teams and businesses',
    price: 39.00,
    mode: 'subscription'
  },
  {
    id: 'prod_CustomPlan123',
    priceId: 'price_CustomPlan123',
    name: 'Custom Plan',
    description: 'Enterprise solutions with custom workflows and dedicated support',
    price: 497.00,
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};