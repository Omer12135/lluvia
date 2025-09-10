# Stripe Webhook Configuration

## Webhook Endpoint Setup

### 1. Stripe Dashboard'da Webhook Oluşturun

1. **Stripe Dashboard'a gidin**: https://dashboard.stripe.com/webhooks
2. **"Add endpoint"** butonuna tıklayın
3. **Endpoint URL'i girin**: 
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
   (Production'da gerçek domain'inizi kullanın)

### 2. Webhook Events Seçin

Aşağıdaki event'leri seçin:

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 3. Webhook Secret'i Alın

1. Webhook oluşturduktan sonra **"Reveal"** butonuna tıklayın
2. **Webhook signing secret'i** kopyalayın
3. Environment variable olarak ekleyin:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Environment Variables

Production'da aşağıdaki environment variable'ları ekleyin:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Test Webhook

Webhook'u test etmek için:

1. **Stripe CLI** kullanın (development için):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **Test payment** yapın:
   ```bash
   stripe trigger checkout.session.completed
   ```

### 6. Product Configuration

Güncel Product ID: `prod_SvYxlNBSq72PNA`

Bu ID `src/stripe-config.ts` dosyasında güncellenmiştir.

### 7. Webhook Event Handling

Webhook şu event'leri handle eder:

- **checkout.session.completed**: Ödeme tamamlandığında kullanıcıya Pro Plan verir
- **customer.subscription.updated**: Abonelik güncellendiğinde plan durumunu günceller
- **customer.subscription.deleted**: Abonelik iptal edildiğinde Free Plan'a döner
- **invoice.payment_succeeded**: Aylık ödeme başarılı olduğunda kredileri yeniler
- **invoice.payment_failed**: Ödeme başarısız olduğunda uyarı verir

### 8. Database Schema

Webhook aşağıdaki tabloları günceller:

- `user_profiles`: Plan ve limit bilgileri
- `stripe_customers`: Stripe customer bilgileri
- `stripe_subscriptions`: Abonelik bilgileri
- `stripe_orders`: Sipariş geçmişi

### 9. Troubleshooting

**Webhook çalışmıyor mu?**

1. **Logs kontrol edin**: Stripe Dashboard > Webhooks > Endpoint > Logs
2. **Signature verification**: Webhook secret doğru mu?
3. **Event types**: Doğru event'ler seçildi mi?
4. **URL**: Endpoint URL doğru mu?

**Test için:**

```bash
# Stripe CLI ile test
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test event trigger
stripe trigger checkout.session.completed
```

### 10. Production Checklist

- [ ] Webhook endpoint URL doğru
- [ ] Webhook secret environment variable'da
- [ ] Stripe secret key production key'i
- [ ] Tüm gerekli event'ler seçildi
- [ ] Database connection çalışıyor
- [ ] Supabase RLS policies doğru
