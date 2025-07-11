# 🚀 دليل رفع المشروع على GitHub Pages

## الخطوة 1: إنشاء Repository على GitHub

1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على "New repository" (مستودع جديد)
3. اختر اسماً للمستودع مثل: `arabic-puzzle-game`
4. تأكد من أن Repository عام (Public)
5. انقر على "Create repository"

## الخطوة 2: رفع الملفات

### في Terminal أو Command Prompt:

```bash
# تحميل الملفات (إذا لم تكن موجودة محلياً)
git clone https://github.com/YOUR_USERNAME/arabic-puzzle-game.git
cd arabic-puzzle-game

# نسخ ملفات المشروع إلى المجلد
# (انسخ جميع الملفات من مشروع Replit إلى هذا المجلد)

# إضافة الملفات إلى Git
git add .
git commit -m "Add Arabic Puzzle Game"
git push origin main
```

## الخطوة 3: تفعيل GitHub Pages

1. اذهب إلى Repository في GitHub
2. انقر على "Settings" (الإعدادات)
3. اختر "Pages" من القائمة الجانبية
4. في قسم "Source" اختر "GitHub Actions"
5. احفظ الإعدادات

## الخطوة 4: انتظار النشر

- سيتم بناء اللعبة تلقائياً
- يمكنك متابعة التقدم في تبويب "Actions"
- بعد انتهاء العملية، ستحصل على رابط مثل:
  `https://YOUR_USERNAME.github.io/arabic-puzzle-game`

## الملفات المطلوبة للنشر

### ملف `.github/workflows/deploy.yml` (موجود مسبقاً):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/public
```

## مميزات اللعبة المنشورة

✅ **تعمل على الهاتف والكمبيوتر**
✅ **واجهة عربية كاملة**
✅ **6 أنواع مختلفة من الألغاز**
✅ **3 مستويات صعوبة**
✅ **حفظ النقاط العالية**
✅ **رسوميات ثلاثية الأبعاد**
✅ **أصوات اللعبة**

## الأنواع الستة من الألغاز

1. **🧠 ألغاز الذاكرة** - احفظ التسلسل وأعد تكراره
2. **🎨 ألغاز الألوان** - طابق الألوان بأسمائها العربية
3. **🔢 ألغاز الأرقام** - حل مسائل رياضية وتسلسل
4. **🔍 ألغاز الأنماط** - احفظ النمط الهندسي وأعد رسمه
5. **🧩 ألغاز المنطق** - حل التحديات المنطقية والقياس
6. **⚡ ألغاز السرعة** - تحديات سرعة الاستجابة

## استكشاف الأخطاء

### إذا فشل البناء:
- تأكد من وجود جميع الملفات
- تحقق من ملف `package.json`
- راجع تبويب "Actions" في GitHub لمعرفة الخطأ

### إذا لم تظهر اللعبة:
- انتظر بضع دقائق للنشر
- تأكد من إعدادات GitHub Pages
- امسح cache المتصفح

## الدعم

إذا واجهت مشاكل، تحقق من:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**بالتوفيق في نشر لعبتك! 🎮**