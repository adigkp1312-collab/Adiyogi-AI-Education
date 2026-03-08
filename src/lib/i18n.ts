import type { SupportedLanguage } from "@/types";

type TranslationKey =
  | "appName"
  | "tagline"
  | "subtitle"
  | "placeholder"
  | "generate"
  | "generating"
  | "speakNow"
  | "listening"
  | "stopListening"
  | "weekLabel"
  | "resources"
  | "markComplete"
  | "completed"
  | "progress"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "selectLanguage"
  | "selectLevel"
  | "weeks"
  | "startLearning"
  | "poweredBy"
  | "freeForever"
  | "voiceFirst"
  | "noResults";

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: {
    appName: "Adiyogi AI",
    tagline: "Learn Anything For Free",
    subtitle: "Tell me what you want to learn — in any language",
    placeholder: "e.g., Machine Learning, Web Development, Data Science...",
    generate: "Generate Course Plan",
    generating: "Creating your personalized plan...",
    speakNow: "Tap to Speak",
    listening: "Listening...",
    stopListening: "Tap to Stop",
    weekLabel: "Week",
    resources: "Resources",
    markComplete: "Mark Complete",
    completed: "Completed",
    progress: "Progress",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    selectLanguage: "Select Language",
    selectLevel: "Skill Level",
    weeks: "weeks",
    startLearning: "Start Learning",
    poweredBy: "Powered by AWS Bedrock + Sarvam AI",
    freeForever: "100% Free Forever",
    voiceFirst: "Voice-First AI Education",
    noResults: "No resources found. Try a different search.",
  },
  hi: {
    appName: "आदियोगी AI",
    tagline: "कुछ भी मुफ्त में सीखें",
    subtitle: "मुझे बताइए आप क्या सीखना चाहते हैं — किसी भी भाषा में",
    placeholder: "जैसे: मशीन लर्निंग, वेब डेवलपमेंट, डेटा साइंस...",
    generate: "कोर्स प्लान बनाएं",
    generating: "आपका व्यक्तिगत प्लान बना रहे हैं...",
    speakNow: "बोलने के लिए टैप करें",
    listening: "सुन रहा हूँ...",
    stopListening: "रुकने के लिए टैप करें",
    weekLabel: "सप्ताह",
    resources: "संसाधन",
    markComplete: "पूरा करें",
    completed: "पूरा हुआ",
    progress: "प्रगति",
    beginner: "शुरुआती",
    intermediate: "मध्यम",
    advanced: "उन्नत",
    selectLanguage: "भाषा चुनें",
    selectLevel: "कौशल स्तर",
    weeks: "सप्ताह",
    startLearning: "सीखना शुरू करें",
    poweredBy: "AWS Bedrock + Sarvam AI द्वारा संचालित",
    freeForever: "हमेशा 100% मुफ्त",
    voiceFirst: "वॉइस-फर्स्ट AI शिक्षा",
    noResults: "कोई संसाधन नहीं मिला। कुछ और खोजें।",
  },
  ta: {
    appName: "ஆதியோகி AI",
    tagline: "எதையும் இலவசமாகக் கற்றுக்கொள்ளுங்கள்",
    subtitle: "நீங்கள் என்ன கற்க விரும்புகிறீர்கள் என்று சொல்லுங்கள்",
    placeholder: "எ.கா., இயந்திர கற்றல், வலை மேம்பாடு...",
    generate: "பாடத்திட்டம் உருவாக்கு",
    generating: "உங்கள் திட்டத்தை உருவாக்குகிறது...",
    speakNow: "பேச தட்டவும்",
    listening: "கேட்கிறது...",
    stopListening: "நிறுத்த தட்டவும்",
    weekLabel: "வாரம்",
    resources: "வளங்கள்",
    markComplete: "முடிந்தது எனக் குறி",
    completed: "முடிந்தது",
    progress: "முன்னேற்றம்",
    beginner: "தொடக்கநிலை",
    intermediate: "இடைநிலை",
    advanced: "மேம்பட்ட",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLevel: "திறன் நிலை",
    weeks: "வாரங்கள்",
    startLearning: "கற்கத் தொடங்குங்கள்",
    poweredBy: "AWS Bedrock + Sarvam AI மூலம் இயக்கப்படுகிறது",
    freeForever: "எப்போதும் 100% இலவசம்",
    voiceFirst: "குரல்-முதல் AI கல்வி",
    noResults: "வளங்கள் எதுவும் கிடைக்கவில்லை.",
  },
  te: {
    appName: "ఆదియోగి AI",
    tagline: "ఏదైనా ఉచితంగా నేర్చుకోండి",
    subtitle: "మీరు ఏమి నేర్చుకోవాలనుకుంటున్నారో చెప్పండి",
    placeholder: "ఉదా., మెషిన్ లెర్నింగ్, వెబ్ డెవలప్మెంట్...",
    generate: "కోర్సు ప్లాన్ రూపొందించు",
    generating: "మీ ప్లాన్‌ను రూపొందిస్తోంది...",
    speakNow: "మాట్లాడటానికి నొక్కండి",
    listening: "వింటోంది...",
    stopListening: "ఆపడానికి నొక్కండి",
    weekLabel: "వారం",
    resources: "వనరులు",
    markComplete: "పూర్తయినట్లు గుర్తించు",
    completed: "పూర్తయింది",
    progress: "ప్రగతి",
    beginner: "ప్రారంభ",
    intermediate: "మధ్యస్థ",
    advanced: "అధునాతన",
    selectLanguage: "భాష ఎంచుకోండి",
    selectLevel: "నైపుణ్య స్థాయి",
    weeks: "వారాలు",
    startLearning: "నేర్చుకోవడం ప్రారంభించండి",
    poweredBy: "AWS Bedrock + Sarvam AI ద్వారా",
    freeForever: "ఎల్లప్పుడూ 100% ఉచితం",
    voiceFirst: "వాయిస్-ఫస్ట్ AI విద్య",
    noResults: "వనరులు కనుగొనబడలేదు.",
  },
  bn: {
    appName: "আদিযোগী AI",
    tagline: "যেকোনো কিছু বিনামূল্যে শিখুন",
    subtitle: "আপনি কী শিখতে চান তা বলুন",
    placeholder: "যেমন, মেশিন লার্নিং, ওয়েব ডেভেলপমেন্ট...",
    generate: "কোর্স প্ল্যান তৈরি করুন",
    generating: "আপনার প্ল্যান তৈরি হচ্ছে...",
    speakNow: "বলতে ট্যাপ করুন",
    listening: "শুনছি...",
    stopListening: "থামতে ট্যাপ করুন",
    weekLabel: "সপ্তাহ",
    resources: "সম্পদ",
    markComplete: "সম্পূর্ণ চিহ্নিত করুন",
    completed: "সম্পন্ন",
    progress: "অগ্রগতি",
    beginner: "প্রাথমিক",
    intermediate: "মধ্যবর্তী",
    advanced: "উন্নত",
    selectLanguage: "ভাষা নির্বাচন করুন",
    selectLevel: "দক্ষতার স্তর",
    weeks: "সপ্তাহ",
    startLearning: "শেখা শুরু করুন",
    poweredBy: "AWS Bedrock + Sarvam AI দ্বারা চালিত",
    freeForever: "চিরকাল ১০০% বিনামূল্যে",
    voiceFirst: "ভয়েস-ফার্স্ট AI শিক্ষা",
    noResults: "কোনো সম্পদ পাওয়া যায়নি।",
  },
  mr: {
    appName: "आदियोगी AI", tagline: "काहीही मोफत शिका", subtitle: "तुम्हाला काय शिकायचे आहे ते सांगा",
    placeholder: "उदा., मशीन लर्निंग...", generate: "कोर्स प्लॅन तयार करा", generating: "तुमचा प्लॅन तयार करत आहे...",
    speakNow: "बोलण्यासाठी टॅप करा", listening: "ऐकत आहे...", stopListening: "थांबवण्यासाठी टॅप करा",
    weekLabel: "आठवडा", resources: "साधने", markComplete: "पूर्ण म्हणून चिन्हांकित करा",
    completed: "पूर्ण", progress: "प्रगती", beginner: "प्रारंभिक", intermediate: "मध्यम", advanced: "प्रगत",
    selectLanguage: "भाषा निवडा", selectLevel: "कौशल्य पातळी", weeks: "आठवडे",
    startLearning: "शिकणे सुरू करा", poweredBy: "AWS Bedrock + Sarvam AI द्वारा", freeForever: "कायम 100% मोफत",
    voiceFirst: "व्हॉइस-फर्स्ट AI शिक्षण", noResults: "कोणतीही साधने सापडली नाहीत.",
  },
  gu: {
    appName: "આદિયોગી AI", tagline: "કંઈપણ મફતમાં શીખો", subtitle: "તમે શું શીખવા માંગો છો તે કહો",
    placeholder: "દા.ત., મશીન લર્નિંગ...", generate: "કોર્સ પ્લાન બનાવો", generating: "તમારો પ્લાન બનાવી રહ્યા છે...",
    speakNow: "બોલવા ટેપ કરો", listening: "સાંભળી રહ્યા છે...", stopListening: "રોકવા ટેપ કરો",
    weekLabel: "અઠવાડિયું", resources: "સંસાધનો", markComplete: "પૂર્ણ તરીકે ચિહ્નિત કરો",
    completed: "પૂર્ણ", progress: "પ્રગતિ", beginner: "શરૂઆતી", intermediate: "મધ્યમ", advanced: "અદ્યતન",
    selectLanguage: "ભાષા પસંદ કરો", selectLevel: "કુશળતા સ્તર", weeks: "અઠવાડિયા",
    startLearning: "શીખવાનું શરૂ કરો", poweredBy: "AWS Bedrock + Sarvam AI દ્વારા", freeForever: "હંમેશા 100% મફત",
    voiceFirst: "વોઇસ-ફર્સ્ટ AI શિક્ષણ", noResults: "કોઈ સંસાધનો મળ્યા નથી.",
  },
  kn: {
    appName: "ಆದಿಯೋಗಿ AI", tagline: "ಏನನ್ನಾದರೂ ಉಚಿತವಾಗಿ ಕಲಿಯಿರಿ", subtitle: "ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಹೇಳಿ",
    placeholder: "ಉದಾ., ಮೆಷಿನ್ ಲರ್ನಿಂಗ್...", generate: "ಕೋರ್ಸ್ ಪ್ಲ್ಯಾನ್ ರಚಿಸಿ", generating: "ನಿಮ್ಮ ಪ್ಲ್ಯಾನ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    speakNow: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", listening: "ಕೇಳುತ್ತಿದೆ...", stopListening: "ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    weekLabel: "ವಾರ", resources: "ಸಂಪನ್ಮೂಲಗಳು", markComplete: "ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ", progress: "ಪ್ರಗತಿ", beginner: "ಆರಂಭಿಕ", intermediate: "ಮಧ್ಯಮ", advanced: "ಮುಂದುವರಿದ",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", selectLevel: "ಕೌಶಲ ಮಟ್ಟ", weeks: "ವಾರಗಳು",
    startLearning: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ", poweredBy: "AWS Bedrock + Sarvam AI ಮೂಲಕ", freeForever: "ಯಾವಾಗಲೂ 100% ಉಚಿತ",
    voiceFirst: "ವಾಯ್ಸ್-ಫಸ್ಟ್ AI ಶಿಕ್ಷಣ", noResults: "ಯಾವುದೇ ಸಂಪನ್ಮೂಲಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
  },
  ml: {
    appName: "ആദിയോഗി AI", tagline: "എന്തും സൗജന്യമായി പഠിക്കൂ", subtitle: "നിങ്ങൾ എന്താണ് പഠിക്കാൻ ആഗ്രഹിക്കുന്നതെന്ന് പറയൂ",
    placeholder: "ഉദാ., മെഷീൻ ലേണിംഗ്...", generate: "കോഴ്സ് പ്ലാൻ ഉണ്ടാക്കുക", generating: "നിങ്ങളുടെ പ്ലാൻ ഉണ്ടാക്കുന്നു...",
    speakNow: "സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക", listening: "കേൾക്കുന്നു...", stopListening: "നിർത്താൻ ടാപ്പ് ചെയ്യുക",
    weekLabel: "ആഴ്ച", resources: "വിഭവങ്ങൾ", markComplete: "പൂർത്തിയായി അടയാളപ്പെടുത്തുക",
    completed: "പൂർത്തിയായി", progress: "പുരോഗതി", beginner: "തുടക്കക്കാരൻ", intermediate: "ഇടനിലക്കാരൻ", advanced: "വിപുലമായ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക", selectLevel: "കഴിവ് നില", weeks: "ആഴ്ചകൾ",
    startLearning: "പഠിക്കാൻ ആരംഭിക്കുക", poweredBy: "AWS Bedrock + Sarvam AI വഴി", freeForever: "എപ്പോഴും 100% സൗജന്യം",
    voiceFirst: "വോയ്സ്-ഫസ്റ്റ് AI വിദ്യാഭ്യാസം", noResults: "വിഭവങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.",
  },
  pa: {
    appName: "ਆਦਿਯੋਗੀ AI", tagline: "ਕੁਝ ਵੀ ਮੁਫ਼ਤ ਸਿੱਖੋ", subtitle: "ਦੱਸੋ ਤੁਸੀਂ ਕੀ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ",
    placeholder: "ਜਿਵੇਂ, ਮਸ਼ੀਨ ਲਰਨਿੰਗ...", generate: "ਕੋਰਸ ਪਲਾਨ ਬਣਾਓ", generating: "ਤੁਹਾਡਾ ਪਲਾਨ ਬਣਾ ਰਹੇ ਹਾਂ...",
    speakNow: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ", listening: "ਸੁਣ ਰਹੇ ਹਾਂ...", stopListening: "ਰੁਕਣ ਲਈ ਟੈਪ ਕਰੋ",
    weekLabel: "ਹਫ਼ਤਾ", resources: "ਸਰੋਤ", markComplete: "ਪੂਰਾ ਚਿੰਨ੍ਹਿਤ ਕਰੋ",
    completed: "ਪੂਰਾ ਹੋਇਆ", progress: "ਤਰੱਕੀ", beginner: "ਸ਼ੁਰੂਆਤੀ", intermediate: "ਮੱਧ", advanced: "ਉੱਨਤ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ", selectLevel: "ਹੁਨਰ ਪੱਧਰ", weeks: "ਹਫ਼ਤੇ",
    startLearning: "ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ", poweredBy: "AWS Bedrock + Sarvam AI ਦੁਆਰਾ", freeForever: "ਹਮੇਸ਼ਾ 100% ਮੁਫ਼ਤ",
    voiceFirst: "ਵੌਇਸ-ਫਸਟ AI ਸਿੱਖਿਆ", noResults: "ਕੋਈ ਸਰੋਤ ਨਹੀਂ ਮਿਲੇ।",
  },
  or: {
    appName: "ଆଦିଯୋଗୀ AI", tagline: "ଯେକୌଣସି ଜିନିଷ ମାଗଣାରେ ଶିଖ", subtitle: "ତୁମେ କ'ଣ ଶିଖିବାକୁ ଚାହଁ କୁହ",
    placeholder: "ଯେପରି, ମେସିନ ଲର୍ଣିଂ...", generate: "କୋର୍ସ ପ୍ଲାନ ତିଆରି କର", generating: "ତୁମ ପ୍ଲାନ ତିଆରି ହେଉଛି...",
    speakNow: "କହିବାକୁ ଟ୍ୟାପ କର", listening: "ଶୁଣୁଛି...", stopListening: "ଅଟକିବାକୁ ଟ୍ୟାପ କର",
    weekLabel: "ସପ୍ତାହ", resources: "ସମ୍ପଦ", markComplete: "ସମ୍ପୂର୍ଣ୍ଣ ଚିହ୍ନିତ କର",
    completed: "ସମ୍ପୂର୍ଣ୍ଣ", progress: "ପ୍ରଗତି", beginner: "ଆରମ୍ଭିକ", intermediate: "ମଧ୍ୟବର୍ତ୍ତୀ", advanced: "ଉନ୍ନତ",
    selectLanguage: "ଭାଷା ବାଛ", selectLevel: "ଦକ୍ଷତା ସ୍ତର", weeks: "ସପ୍ତାହ",
    startLearning: "ଶିଖିବା ଆରମ୍ଭ କର", poweredBy: "AWS Bedrock + Sarvam AI ଦ୍ୱାରା", freeForever: "ସର୍ବଦା 100% ମାଗଣା",
    voiceFirst: "ଭଏସ-ଫର୍ଷ୍ଟ AI ଶିକ୍ଷା", noResults: "କୌଣସି ସମ୍ପଦ ମିଳିଲା ନାହିଁ।",
  },
  as: {
    appName: "আদিযোগী AI", tagline: "যিকোনো বস্তু বিনামূলীয়াকৈ শিকক", subtitle: "আপুনি কি শিকিব বিচাৰে কওক",
    placeholder: "যেনে, মেচিন লাৰ্নিং...", generate: "কোৰ্ছ প্লেন বনাওক", generating: "আপোনাৰ প্লেন বনাই আছে...",
    speakNow: "কবলৈ টেপ কৰক", listening: "শুনি আছে...", stopListening: "ৰখাবলৈ টেপ কৰক",
    weekLabel: "সপ্তাহ", resources: "সম্পদ", markComplete: "সম্পূৰ্ণ চিহ্নিত কৰক",
    completed: "সম্পূৰ্ণ", progress: "প্ৰগতি", beginner: "আৰম্ভণি", intermediate: "মধ্যম", advanced: "উন্নত",
    selectLanguage: "ভাষা বাছক", selectLevel: "দক্ষতাৰ স্তৰ", weeks: "সপ্তাহ",
    startLearning: "শিকিবলৈ আৰম্ভ কৰক", poweredBy: "AWS Bedrock + Sarvam AI দ্বাৰা", freeForever: "সদায় 100% বিনামূলীয়া",
    voiceFirst: "ভইচ-ফাৰ্ষ্ট AI শিক্ষা", noResults: "কোনো সম্পদ পোৱা নগল।",
  },
  ur: {
    appName: "آدیوگی AI", tagline: "مفت میں کچھ بھی سیکھیں", subtitle: "بتائیں آپ کیا سیکھنا چاہتے ہیں",
    placeholder: "جیسے مشین لرننگ...", generate: "کورس پلان بنائیں", generating: "آپ کا پلان بن رہا ہے...",
    speakNow: "بولنے کے لیے ٹیپ کریں", listening: "سن رہا ہے...", stopListening: "رکنے کے لیے ٹیپ کریں",
    weekLabel: "ہفتہ", resources: "وسائل", markComplete: "مکمل نشان زد کریں",
    completed: "مکمل", progress: "پیش رفت", beginner: "ابتدائی", intermediate: "درمیانی", advanced: "اعلی درجے کا",
    selectLanguage: "زبان منتخب کریں", selectLevel: "ہنر کی سطح", weeks: "ہفتے",
    startLearning: "سیکھنا شروع کریں", poweredBy: "AWS Bedrock + Sarvam AI کے زیر انتظام", freeForever: "ہمیشہ 100% مفت",
    voiceFirst: "وائس فرسٹ AI تعلیم", noResults: "کوئی وسائل نہیں ملے۔",
  },
};

export function t(key: TranslationKey, language: SupportedLanguage = "en"): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

export function getTranslations(language: SupportedLanguage) {
  return translations[language] || translations.en;
}
