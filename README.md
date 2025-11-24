# 📷 Gallery Manager

Aplikasi mobile untuk mengelola foto dan video di gallery dengan sistem swipe seperti Tinder. Swipe kiri untuk menyimpan (KEEP), swipe kanan untuk menghapus (DELETE) secara permanen.

## ✨ Features

- 🎯 **Swipe Gestures** - Interface intuitif seperti Tinder
  - ← Swipe Kiri = KEEP foto
  - → Swipe Kanan = DELETE foto (dengan konfirmasi)
- 🗑️ **Permanent Delete** - Hapus file langsung dari device
- 📊 **Statistics** - Track berapa foto yang disimpan/dihapus
- 🔄 **Auto Gallery Load** - Otomatis load semua foto saat app dibuka
- 🎨 **Dark Theme** - UI modern dengan tema gelap
- 📱 **OTA Updates** - Update kode tanpa install ulang APK

## 🚀 Tech Stack

- **React Native** + **Expo**
- **TypeScript**
- **Zustand** - State management
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Swipe gestures
- **Expo Media Library** - Access gallery
- **EAS Build & Update** - Build dan OTA updates

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Expo CLI
- EAS CLI
- Android device atau emulator

## 🛠️ Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd gallery-manager
```

### 2. Install dependencies

```bash
npm install
# atau
yarn install
```

### 3. Install Expo & EAS CLI (jika belum)

```bash
npm install -g expo-cli eas-cli
```

### 4. Login ke Expo account

```bash
eas login
```

## ⚙️ Configuration

### 1. Configure EAS Update

```bash
eas update:configure
```

Ini akan update `app.json` dengan project ID.

### 2. Update `app.json`

Pastikan ada konfigurasi berikut:

```json
{
  "expo": {
    "name": "Gallery Manager",
    "slug": "gallery-manager",
    "version": "1.0.0",
    "runtimeVersion": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "ACCESS_MEDIA_LOCATION"
      ]
    }
  }
}
```

### 3. Update `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "channel": "production",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🏗️ Build

### Development Build (dengan hot reload)

```bash
# Build APK development
eas build --profile development --platform android

# Install APK ke device

# Jalankan development server
npx expo start --dev-client
```

### Production Build

```bash
# Build APK production
eas build --profile production --platform android

# Download dan install APK ke device
```

## 🔄 Development Workflow

### Setelah Install Development Build:

```bash
# 1. Jalankan dev server
npx expo start --dev-client

# 2. Edit kode
# 3. Simpan → Hot reload otomatis!
```

### Setelah Install Production Build:

```bash
# 1. Edit kode
# 2. Push update (tidak perlu build ulang!)
eas update --channel production -m "fix swipe bugs"

# 3. Di device: tutup app → buka lagi → update otomatis
```

## 📱 Permissions

Aplikasi memerlukan permission berikut:

- **READ_MEDIA_IMAGES** - Membaca foto dari gallery
- **READ_MEDIA_VIDEO** - Membaca video dari gallery
- **ACCESS_MEDIA_LOCATION** - Akses metadata lokasi
- **READ_EXTERNAL_STORAGE** - Akses storage (Android < 13)
- **WRITE_EXTERNAL_STORAGE** - Hapus file (Android < 10)

Permission akan diminta otomatis saat app pertama kali dibuka.

## 🎮 Usage

1. **Buka aplikasi** - Permission request akan muncul
2. **Grant permission** - Allow akses ke Photos and Videos
3. **Gallery auto-load** - Semua foto/video akan dimuat
4. **Swipe gestures:**
   - ← **Swipe kiri** = KEEP (simpan foto)
   - → **Swipe kanan** = DELETE (muncul konfirmasi)
5. **Confirm delete** - Tekan "Hapus" untuk delete permanent
6. **Track progress** - Lihat statistik di header (✓ 10 | ✗ 5)

## 📁 Project Structure

```
gallery-manager/
├── app/
│   ├── _layout.tsx           # Root layout dengan GestureHandler
│   ├── index.tsx             # Home screen
│   ├── components/
│   │   ├── ImageCard.tsx     # Swipeable card component
│   │   ├── ImageStack.tsx    # Card stack container
│   │   ├── NoMorePhotos.tsx  # Empty state
│   │   └── ErrorBoundary.tsx # Error handling
│   └── store/
│       └── useGalleryStore.ts # Zustand store
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
├── babel.config.js           # Babel config (reanimated plugin)
├── package.json
└── tsconfig.json
```

## 🐛 Troubleshooting

### Permission ditolak saat buka app

```bash
# Pastikan permissions ada di app.json
# Uninstall app → build ulang → install lagi
```

### OTA Update tidak bekerja

```bash
# Pastikan APK dibuild dengan channel
eas build --profile production --platform android

# Lalu update dengan channel yang sama
eas update --channel production -m "message"
```

### App crash setelah swipe

```bash
# Clear cache dan rebuild
rm -rf node_modules .expo android/app/build
npm install
eas build --profile production --platform android
```

### Hot reload tidak bekerja (dev build)

```bash
# Restart dev server
npx expo start --dev-client --clear
```

## 📦 Build Commands

| Command | Description |
|---------|-------------|
| `eas build --profile development --platform android` | Build development APK dengan hot reload |
| `eas build --profile production --platform android` | Build production APK |
| `eas update --channel production -m "message"` | Push OTA update (tanpa build ulang) |
| `npx expo start --dev-client` | Run development server |
| `npx expo start --dev-client --clear` | Run dengan clear cache |

## 🔐 Security Notes

⚠️ **Warning:** Aplikasi ini menghapus file **PERMANEN** dari device. File yang dihapus **tidak bisa dikembalikan**.

Selalu pastikan:
- Backup foto penting sebelum menggunakan app
- Baca dialog konfirmasi dengan teliti sebelum delete
- Gunakan dengan hati-hati

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, buka issue dulu untuk diskusi.

## 📮 Support

Jika ada bug atau pertanyaan, buka issue di repository ini.

---

**Made with ❤️ using Expo & React Native**