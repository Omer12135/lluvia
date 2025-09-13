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
    description: 'Basic Workflow - 1 free automation to get started with workflow automation',
    price: 0.00,
    mode: 'payment'
  },
  {
    id: 'prod_T2eC5v6BDh4AFg',
    priceId: 'price_basic_plan',
    name: 'Basic Plan',
    description: 'Basic Workflow - 10 automations for small projects',
    price: 1.00,
    mode: 'payment'
  },
  {
    id: 'prod_SvYxlNBSq72PNA',
    priceId: 'price_1Rs2mPK4TeoPEcnVVGOmeNcs',
    name: 'Pro Plan',
    description: 'Complex Workflow - Advanced automation features for teams and businesses',
    price: 39.00,
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};