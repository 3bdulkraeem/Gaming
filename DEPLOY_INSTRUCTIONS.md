# 🚀 تعليمات الاستضافة على GitHub

## طريقة الاستضافة على GitHub Pages

### 1. إنشاء Repository جديد
```bash
git init
git add .
git commit -m "Initial commit: Arabic Puzzle Game"
git branch -M main
git remote add origin https://github.com/[username]/arabic-puzzle-game.git
git push -u origin main
```

### 2. تفعيل GitHub Pages
1. اذهب إلى Settings في الـ repository
2. اختر Pages من القائمة الجانبية
3. اختر "GitHub Actions" كمصدر

### 3. الاستضافة ستتم تلقائياً
- سيتم بناء ونشر اللعبة تلقائياً عند كل push
- الرابط سيكون: `https://[username].github.io/arabic-puzzle-game`

## طريقة الاستضافة على Vercel

### 1. ربط GitHub بـ Vercel
1. اذهب إلى vercel.com
2. قم بتسجيل الدخول باستخدام GitHub
3. اختر "Import Project"
4. اختر الـ repository الخاص بك

### 2. إعدادات البناء
- **Framework**: React
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`

### 3. النشر
- سيتم النشر تلقائياً
- ستحصل على رابط مثل: `https://arabic-puzzle-game.vercel.app`

## طريقة الاستضافة على Netlify

### 1. ربط GitHub بـ Netlify
1. اذهب إلى netlify.com
2. اختر "New site from Git"
3. اختر GitHub واربط الـ repository

### 2. إعدادات البناء
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/public`

### 3. النشر
- سيتم النشر تلقائياً
- ستحصل على رابط مثل: `https://arabic-puzzle-game.netlify.app`

## ملاحظات مهمة

### ملفات الأصوات
- أضف ملفات الأصوات في `client/public/sounds/`
- الأسماء المطلوبة: `background.mp3`, `hit.mp3`, `success.mp3`

### تحسين الأداء
- اللعبة محسنة للهواتف وأجهزة الكمبيوتر
- تدعم اللغة العربية بالكامل
- رسوميات ثلاثية الأبعاد سريعة

### الدومين المخصص
يمكنك استخدام دومين مخصص مع أي من هذه الخدمات:
- GitHub Pages: أضف ملف CNAME
- Vercel: اذهب إلى إعدادات المشروع
- Netlify: اذهب إلى إعدادات الدومين

## استكشاف الأخطاء

### مشكلة في البناء
```bash
# تأكد من تثبيت المتطلبات
npm install

# جرب البناء محلياً
npm run build
```

### مشكلة في الأصوات
- تأكد من وجود ملفات الأصوات في المجلد الصحيح
- استخدم أصوات بصيغة MP3 أو OGG

### مشكلة في الخطوط العربية
- الخطوط محملة من Google Fonts
- تأكد من اتصال الإنترنت

---

**بالتوفيق في استضافة لعبتك! 🎮**