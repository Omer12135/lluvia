# Supabase Kurulum ve Konfigürasyon Rehberi

Bu rehber, Lluvia Automation Platform projesi için Supabase veritabanı kurulumunu ve konfigürasyonunu açıklar.

## 📋 İçindekiler

1. [Supabase Projesi Oluşturma](#supabase-projesi-oluşturma)
2. [Veritabanı Migration'ları](#veritabanı-migrationları)
3. [Environment Değişkenleri](#environment-değişkenleri)
4. [Güvenlik Ayarları](#güvenlik-ayarları)
5. [Test Verileri](#test-verileri)
6. [Sorun Giderme](#sorun-giderme)

## 🚀 Supabase Projesi Oluşturma

### 1. Supabase Hesabı Oluşturma
1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. Yeni bir organizasyon oluşturun

### 2. Yeni Proje Oluşturma
1. "New Project" butonuna tıklayın
2. Proje adı: `lluvia-automation-platform`
3. Database Password: Güçlü bir şifre oluşturun (örn: `Lluvia2024!`)
4. Region: En yakın bölgeyi seçin (örn: `West Europe`)
5. Pricing Plan: Free tier ile başlayın
6. "Create new project" butonuna tıklayın

### 3. Proje Ayarları
1. Proje oluşturulduktan sonra Settings > API bölümüne gidin
2. Aşağıdaki bilgileri not edin:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ Veritabanı Migration'ları

### 1. Migration Dosyalarını Çalıştırma
Supabase Dashboard'da SQL Editor'ü açın ve sırasıyla aşağıdaki migration'ları çalıştırın:

#### a) Automation Usage Tracking
```sql
-- 20250101000000_automation_usage_tracking.sql dosyasının içeriğini çalıştırın
```

#### b) Blog Posts
```sql
-- 20250102000000_blog_posts.sql dosyasının içeriğini çalıştırın
```

#### c) User Profiles Setup
```sql
-- 20250103000000_user_profiles_setup.sql dosyasının içeriğini çalıştırın
```

### 2. Migration Kontrolü
Migration'lar başarıyla çalıştırıldıktan sonra aşağıdaki tablolar oluşmuş olmalı:
- `user_profiles`
- `automation_requests`
- `automation_usage_history`
- `blog_posts`

## 🔧 Environment Değişkenleri

### 1. .env Dosyası Oluşturma
Proje kök dizininde `.env` dosyası oluşturun:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Webhook Configuration
VITE_WEBHOOK_URL=https://lluviaomer.app.n8n.cloud/webhook/lluvia

# App Configuration
VITE_APP_NAME=Lluvia Automation Platform
VITE_APP_VERSION=1.0.0
```

### 2. Environment Değişkenlerini Kontrol Etme
```bash
# Proje dizininde
npm run dev
```

Console'da hata mesajları olmamalı.

## 🔒 Güvenlik Ayarları

### 1. Row Level Security (RLS)
Tüm tablolarda RLS aktif olmalı. Supabase Dashboard'da:
1. Authentication > Policies bölümüne gidin
2. Her tablo için politikaların doğru ayarlandığını kontrol edin

### 2. Admin Erişimi
Admin kullanıcıları için özel politikalar:
- Email domain: `@admin.lluvia.ai`
- Veya özel admin email: `admin@lluvia.ai`

### 3. API Güvenliği
1. Settings > API > API Settings
2. "Enable Row Level Security" aktif olmalı
3. "Enable Realtime" aktif olmalı

## 📊 Test Verileri

### 1. Örnek Kullanıcılar
Migration'lar çalıştırıldıktan sonra aşağıdaki test kullanıcıları otomatik olarak oluşturulur:

| Email | Plan | Status | Auth Provider |
|-------|------|--------|---------------|
| demo@lluvia.ai | Free | Active | Email |
| pro@lluvia.ai | Pro | Active | Google |
| enterprise@lluvia.ai | Custom | Active | Email |
| suspended@lluvia.ai | Free | Suspended | Email |
| pending@lluvia.ai | Free | Pending | GitHub |

### 2. Test Verilerini Kontrol Etme
Supabase Dashboard'da Table Editor'ü açın ve `user_profiles` tablosunu kontrol edin.

## 🔍 Veritabanı Yapısı

### User Profiles Tablosu
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free',
  automations_used integer DEFAULT 0,
  automations_limit integer DEFAULT 1,
  ai_messages_used integer DEFAULT 0,
  ai_messages_limit integer DEFAULT 0,
  current_month_automations_used integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  monthly_automations_used integer DEFAULT 0,
  phone text,
  country text,
  email_verified boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  status text DEFAULT 'pending',
  auth_provider text DEFAULT 'email',
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Automation Requests Tablosu
```sql
CREATE TABLE automation_requests (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  automation_name text NOT NULL,
  automation_description text NOT NULL,
  webhook_payload jsonb,
  webhook_response jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  n8n_execution_id text
);
```

## 🚨 Sorun Giderme

### 1. Bağlantı Hatası
```
Error: Cannot read properties of null (reading 'from')
```
**Çözüm**: Environment değişkenlerini kontrol edin ve Supabase URL/Key'in doğru olduğundan emin olun.

### 2. RLS Hatası
```
Error: new row violates row-level security policy
```
**Çözüm**: Supabase Dashboard'da RLS politikalarını kontrol edin ve admin kullanıcısının doğru ayarlandığından emin olun.

### 3. Migration Hatası
```
Error: function update_updated_at_column() does not exist
```
**Çözüm**: Supabase'de `update_updated_at_column()` fonksiyonunu oluşturun:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 4. Auth Hatası
```
Error: JWT expired
```
**Çözüm**: Kullanıcıyı yeniden giriş yaptırın veya token'ı yenileyin.

## 📈 Monitoring ve Analytics

### 1. Supabase Dashboard
- **Database**: Tablo boyutları ve performans
- **Auth**: Kullanıcı girişleri ve kayıtlar
- **Logs**: API çağrıları ve hatalar
- **Storage**: Dosya yüklemeleri

### 2. Custom Analytics
```sql
-- Günlük kullanıcı kayıtları
SELECT DATE(created_at) as date, COUNT(*) as new_users
FROM user_profiles
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Plan dağılımı
SELECT plan, COUNT(*) as user_count
FROM user_profiles
GROUP BY plan;

-- Otomasyon kullanımı
SELECT user_id, COUNT(*) as automation_count
FROM automation_requests
GROUP BY user_id
ORDER BY automation_count DESC;
```

## 🔄 Güncellemeler

### 1. Migration Güncellemeleri
Yeni migration'lar eklemek için:
1. `supabase/migrations/` dizininde yeni dosya oluşturun
2. Dosya adı: `YYYYMMDDHHMMSS_description.sql`
3. Migration'ı Supabase Dashboard'da çalıştırın

### 2. Schema Değişiklikleri
Büyük schema değişiklikleri için:
1. Yedek alın
2. Migration oluşturun
3. Test ortamında deneyin
4. Production'a uygulayın

## 📞 Destek

Sorun yaşarsanız:
1. Supabase Discord: [discord.gg/supabase](https://discord.gg/supabase)
2. Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
3. GitHub Issues: Proje repository'sinde issue açın

---

**Not**: Bu rehber Lluvia Automation Platform v1.0.0 için hazırlanmıştır. Güncellemeler için proje repository'sini kontrol edin.
