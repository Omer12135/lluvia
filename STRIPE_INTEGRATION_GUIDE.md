# Stripe Plan Yükseltme ve Kullanıcı Kayıt Entegrasyonu

Bu dokümantasyon, Stripe üzerinden plan yükseltme işlemi gerçekleştiğinde kullanıcının mail adresinin Supabase'e kaydedilmesi ve otomatik plan atama işlevselliğini açıklar.

## 🎯 Özellikler

### ✅ Tamamlanan Özellikler

1. **Stripe Webhook Entegrasyonu**
   - `checkout.session.completed` event'ini yakalar
   - Email tabanlı kullanıcı kayıt işlemi
   - Otomatik plan atama (Basic/Pro)

2. **Kullanıcı Kayıt Sistemi**
   - Email ile mevcut kullanıcı arama
   - Yeni kullanıcı oluşturma (email onaylı)
   - Kullanıcı profil oluşturma

3. **Plan Yönetimi**
   - Basic Plan: $0.50-$2.00 (10 otomasyon, 100 AI mesaj)
   - Pro Plan: $30.00-$50.00 (50 otomasyon, 1000 AI mesaj)
   - Esnek fiyat aralıkları

4. **Admin Panel Entegrasyonu**
   - Stripe ödeme yönetimi
   - Kullanıcı plan güncelleme
   - Webhook test aracı

## 🔧 Teknik Detaylar

### Webhook İşleyişi

```typescript
// supabase/functions/stripe-webhook/index.ts
async function processEmailBasedPlanUpgrade(
  customerId: string, 
  customerEmail: string | null, 
  amountTotal: number, 
  checkoutSessionId: string
) {
  // 1. Email ile kullanıcı ara
  // 2. Kullanıcı yoksa oluştur
  // 3. Plan belirle (fiyat bazlı)
  // 4. Kullanıcı profilini güncelle
  // 5. Stripe kayıtlarını oluştur
}
```

### Plan Belirleme Mantığı

```typescript
// Fiyat kontrolü - esnek aralık
if (amountTotal >= 50 && amountTotal <= 200) { // $0.50 - $2.00
  newPlan = 'basic';
  automationsLimit = 10;
  aiMessagesLimit = 100;
} else if (amountTotal >= 3000 && amountTotal <= 5000) { // $30.00 - $50.00
  newPlan = 'pro';
  automationsLimit = 50;
  aiMessagesLimit = 1000;
}
```

### Veritabanı Yapısı

#### Yeni Tablolar
- `stripe_customers`: Supabase kullanıcıları ile Stripe müşterilerini bağlar
- `stripe_orders`: Ödeme kayıtlarını saklar
- `stripe_subscriptions`: Abonelik bilgilerini yönetir

#### Güncellenen Tablolar
- `user_profiles`: 'basic' plan desteği eklendi

## 📊 Admin Panel Özellikleri

### 1. Stripe Ödeme Yönetimi
- Tüm Stripe ödemelerini görüntüleme
- Kullanıcı bilgileri ile eşleştirme
- Ödeme detaylarını inceleme
- CSV dışa aktarma

### 2. Kullanıcı Plan Yönetimi
- Manuel plan güncelleme
- Basic, Pro, Custom plan desteği
- Otomasyon limitleri yönetimi

### 3. Webhook Test Aracı
- Test senaryoları çalıştırma
- Webhook işleyişini doğrulama
- Hata ayıklama desteği

## 🚀 Kurulum ve Kullanım

### 1. Veritabanı Migrasyonu
```sql
-- supabase/migrations/20250112000000_add_basic_plan_support.sql
-- Bu migration'ı çalıştırın
```

### 2. Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Webhook URL
```
https://your-project.supabase.co/functions/v1/stripe-webhook
```

## 🔄 İş Akışı

### Otomatik İşlem
1. Kullanıcı Stripe'da ödeme yapar
2. Stripe webhook'u tetiklenir
3. Email ile kullanıcı aranır
4. Kullanıcı yoksa oluşturulur
5. Plan otomatik atanır
6. Kullanıcı profil güncellenir

### Manuel İşlem
1. Admin panelden "Stripe Ödemeleri" bölümüne gidin
2. Ödeme kayıtlarını inceleyin
3. Gerekirse kullanıcı planını manuel güncelleyin

## 🧪 Test Etme

### Webhook Test Aracı
1. Admin panelden "Webhook Tester" bölümüne gidin
2. "Test Başlat" butonuna tıklayın
3. Test sonuçlarını inceleyin

### Manuel Test
```bash
# Webhook endpoint'ini test et
curl -X POST https://your-project.supabase.co/functions/v1/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test_signature" \
  -d '{"type": "checkout.session.completed", "data": {...}}'
```

## 📝 Loglar ve Monitoring

### Webhook Logları
```typescript
console.log(`✅ Stripe payment processed successfully:
  - Customer ID: ${customerId}
  - Email: ${customerEmail}
  - Amount: ${amountTotal} cents
  - Plan: ${newPlan}
  - User ID: ${userId}
  - New User: ${isNewUser}
  - Session ID: ${checkoutSessionId}`);
```

### Supabase Logs
- Supabase Dashboard > Logs bölümünden webhook loglarını inceleyin
- Hata durumlarını takip edin

## 🔒 Güvenlik

### Webhook Doğrulama
- Stripe signature doğrulaması
- HTTPS zorunluluğu
- Rate limiting

### Veri Koruma
- Email onayı otomatik
- Kullanıcı verileri şifrelenmiş
- RLS (Row Level Security) aktif

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **Webhook çalışmıyor**
   - Stripe webhook URL'ini kontrol edin
   - Environment variables'ları doğrulayın
   - Supabase function loglarını inceleyin

2. **Kullanıcı oluşturulmuyor**
   - Supabase service role key'ini kontrol edin
   - Email formatını doğrulayın
   - Veritabanı izinlerini kontrol edin

3. **Plan atanmıyor**
   - Fiyat aralıklarını kontrol edin
   - Webhook payload'ını inceleyin
   - Kullanıcı profil güncellemelerini kontrol edin

### Debug Adımları
1. Supabase Dashboard > Logs
2. Admin Panel > Webhook Tester
3. Browser Developer Tools > Network
4. Stripe Dashboard > Webhooks

## 📈 Gelecek Geliştirmeler

- [ ] Email bildirimleri
- [ ] Plan yükseltme geçmişi
- [ ] Otomatik plan yenileme
- [ ] Çoklu para birimi desteği
- [ ] Gelişmiş raporlama

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Logları kontrol edin
2. Webhook Tester'ı kullanın
3. Admin panel üzerinden manuel işlem yapın

---

**Not**: Bu sistem production ortamında test edilmiştir ve güvenli bir şekilde çalışmaktadır.
