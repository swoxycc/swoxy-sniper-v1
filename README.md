# 🚀 Discord Vanity URL Sniper

**Discord Vanity URL Sniper**, belirli bir Discord sunucusunda (veya birden fazla sunucuda) istenen vanity URL'leri gözlemlemek ve kullanılabilir hale geldiğinde bunları otomatik olarak almak için tasarlanmış bir bottur. Bu araç, Discord API'si üzerinden çalışarak, sunucu güncellemelerini dinler ve hedeflenen URL'ler için anında bir talepte bulunur.

## ✨ Özellikler

- 👀 Sunucuların vanity URL'lerini sürekli olarak gözlemleme.
- ⚡ URL değişikliklerini algılayarak hedef URL'yi anında çekme.
- 📊 Çekim sonuçlarını Discord webhook'u aracılığıyla raporlama.
- 🔄 Otomatik yeniden bağlanma mekanizması.

## ⚙️ Gereksinimler

- 🟢 Node.js (v14 veya üstü)
- 📦 NPM (Node Package Manager)
- `node-fetch`, `ws`, ve `colors` modülleri

## 🚧 Kurulum

### 1. 📥 Depoyu Klonlayın

```bash
git clone https://github.com/swoxycan/swoxy-sniper-v1.git
cd swoxy-sniper-v1
```

### 2. 📦 Gerekli Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. 📝 Yapılandırma Dosyasını Oluşturun

`config.json` adında bir dosya oluşturun ve aşağıdaki örneği kullanarak doldurun:

```json
{
  "yetkili_token": "YOUR_DISCORD_AUTH_TOKEN",
  "sunucu_id": "YOUR_SERVER_ID",
  "webhook": "YOUR_DISCORD_WEBHOOK_URL",
  "c": "Ekstra bir yapılandırma değeri (isteğe bağlı)"
}
```

- **🔑 yetkili_token**: Discord botunuzun veya selfbot'unuzun erişim tokeni.
- **🆔 sunucu_id**: Vanity URL'sini çekmek istediğiniz sunucu ID'si.
- **🌐 webhook**: Sonuçların raporlanacağı Discord webhook URL'si.
- **📝 c**: İsteğe bağlı bir değer; ek bilgi için kullanılabilir.

### 4. ▶️ Kullanım

Projeyi başlatmak için aşağıdaki komutu çalıştırın:

```bash
node index.js
```

Başlatma işleminden sonra, bot Discord gateway'ine bağlanacak ve belirttiğiniz sunucudaki URL'leri izlemeye başlayacaktır.

## 🔍 Çalışma Mekanizması

1. **🔗 Bağlantı**: Bot, Discord Gateway'e WebSocket bağlantısı kurar ve `READY` olayını bekler.
2. **🎧 Olay Dinleme**: Bot, sunucu güncellemelerini (`GUILD_UPDATE`, `GUILD_CREATE`, `GUILD_DELETE`) dinler ve sunuculardaki vanity URL değişikliklerini algılar.
3. **🎯 URL Çekimi**: Vanity URL'nin değiştiği tespit edilirse, bot URL'yi almak için bir API isteği yapar.
4. **📤 Sonuç Raporlama**: Başarılı veya başarısız sonuçlar, yapılandırmada belirtilen webhook URL'sine gönderilir.

## 🛠️ Hata Ayıklama ve Sorun Giderme

- **🔄 Bağlantı Sorunları**: Bağlantı kapandığında bot otomatik olarak yeniden bağlanır.
- **❗ Webhook Hataları**: Webhook hatası durumunda, hata mesajı konsolda görüntülenecektir.
- **🛑 API Hataları**: API isteği başarısız olursa, hata detayları ve durum kodu konsolda görüntülenir.

## 📷 Proje Örnekleri 
![SNİPER](https://github.com/user-attachments/assets/14bfaa6a-fc1e-42b9-bf3d-7e39222e1174)

![BAŞARILI](https://github.com/user-attachments/assets/12af1884-7159-417a-8d02-4b02d4fbe56d)

