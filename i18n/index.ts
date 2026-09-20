export const languages=[["en","English"],["hi","हिन्दी"],["es","Español"],["fr","Français"],["de","Deutsch"],["pt","Português"],["ar","العربية"],["ja","日本語"],["ko","한국어"],["zh","简体中文"]] as const;
export type Lang=typeof languages[number][0];
const en={generator:"Generator",frames:"Frames",scanner:"Scanner",bulk:"Bulk generator",tools:"Developer tools",title:"A little code. Endless possibilities.",subtitle:"Create a QR code that feels like you. Free, personal, and ready for anywhere.",library:"My library"};
export type Messages=typeof en;
export const messages:Record<Lang,Messages>={en,
hi:{generator:"क्यूआर जनरेटर",frames:"फ़्रेम",scanner:"स्कैनर",bulk:"बल्क जनरेटर",tools:"डेवलपर टूल",title:"एक छोटा कोड। अनंत संभावनाएँ।",subtitle:"अपना क्यूआर कोड बनाएँ और डाउनलोड करें। मुफ़्त और निजी।",library:"मेरी लाइब्रेरी"},
es:{generator:"Generador",frames:"Marcos",scanner:"Escáner",bulk:"Generación masiva",tools:"Herramientas",title:"Un pequeño código. Infinitas posibilidades.",subtitle:"Crea un código QR a tu estilo. Gratis, personal y listo para compartir.",library:"Mi biblioteca"},
fr:{generator:"Générateur",frames:"Cadres",scanner:"Scanner",bulk:"Création en lot",tools:"Outils",title:"Un petit code. Des possibilités infinies.",subtitle:"Créez un code QR à votre image. Gratuit, personnel et prêt à partager.",library:"Ma bibliothèque"},
de:{generator:"Generator",frames:"Rahmen",scanner:"Scanner",bulk:"Stapelgenerator",tools:"Entwicklertools",title:"Ein kleiner Code. Unendliche Möglichkeiten.",subtitle:"Erstelle deinen persönlichen QR-Code. Kostenlos und bereit zum Teilen.",library:"Meine Bibliothek"},
pt:{generator:"Gerador",frames:"Molduras",scanner:"Scanner",bulk:"Gerador em lote",tools:"Ferramentas",title:"Um pequeno código. Infinitas possibilidades.",subtitle:"Crie um código QR com seu estilo. Grátis, pessoal e pronto para compartilhar.",library:"Minha biblioteca"},
ar:{generator:"إنشاء رمز",frames:"الإطارات",scanner:"الماسح",bulk:"إنشاء متعدد",tools:"أدوات المطور",title:"رمز صغير. إمكانيات لا حدود لها.",subtitle:"أنشئ رمز QR يعبر عنك. مجاني وخاص وجاهز للمشاركة.",library:"مكتبتي"},
ja:{generator:"作成",frames:"フレーム",scanner:"スキャナー",bulk:"一括作成",tools:"開発ツール",title:"小さなコード。無限の可能性。",subtitle:"あなたらしいQRコードを。無料で、手軽に、どこへでも。",library:"ライブラリ"},
ko:{generator:"생성기",frames:"프레임",scanner:"스캐너",bulk:"일괄 생성",tools:"개발 도구",title:"작은 코드. 무한한 가능성.",subtitle:"나만의 QR 코드를 만들어 보세요. 무료로 간편하게 공유하세요.",library:"내 라이브러리"},
zh:{generator:"生成器",frames:"边框",scanner:"扫描器",bulk:"批量生成",tools:"开发工具",title:"小小二维码，无限可能。",subtitle:"创建属于你的二维码。免费、私密，随时分享。",library:"我的图库"}};
