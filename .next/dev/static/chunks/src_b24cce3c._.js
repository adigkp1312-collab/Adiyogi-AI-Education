(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/store/course-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCourseStore",
    ()=>useCourseStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useCourseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        currentCourse: null,
        isGenerating: false,
        error: null,
        language: 'hi',
        query: '',
        setQuery: (query)=>set({
                query
            }),
        setLanguage: (language)=>set({
                language
            }),
        setGenerating: (generating)=>set({
                isGenerating: generating
            }),
        setCourse: (course)=>set({
                currentCourse: course
            }),
        setError: (error)=>set({
                error
            }),
        generateCourse: async (query, level)=>{
            set({
                isGenerating: true,
                error: null
            });
            try {
                const response = await fetch('/api/course/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query,
                        level,
                        language: get().language
                    })
                });
                if (!response.ok) throw new Error('Failed to generate course');
                const course = await response.json();
                set({
                    currentCourse: course,
                    isGenerating: false,
                    query: ''
                });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : 'Something went wrong',
                    isGenerating: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LANGUAGE_NAMES",
    ()=>LANGUAGE_NAMES,
    "SUPPORTED_LANGUAGES",
    ()=>SUPPORTED_LANGUAGES
]);
const SUPPORTED_LANGUAGES = [
    {
        code: "en",
        name: "English",
        nativeName: "English"
    },
    {
        code: "hi",
        name: "Hindi",
        nativeName: "हिन्दी"
    },
    {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்"
    },
    {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు"
    },
    {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা"
    },
    {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी"
    },
    {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી"
    },
    {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ"
    },
    {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം"
    },
    {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ"
    },
    {
        code: "or",
        name: "Odia",
        nativeName: "ଓଡ଼ିଆ"
    },
    {
        code: "as",
        name: "Assamese",
        nativeName: "অসমীয়া"
    }
];
const LANGUAGE_NAMES = {
    en: "English",
    hi: "हिन्दी",
    ta: "தமிழ்",
    te: "తెలుగు",
    bn: "বাংলা",
    mr: "मराठी",
    gu: "ગુજરાતી",
    kn: "ಕನ್ನಡ",
    ml: "മലയാളം",
    pa: "ਪੰਜਾਬੀ",
    or: "ଓଡ଼ିଆ",
    as: "অসমীয়া"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store/course-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Header() {
    _s();
    const { language, setLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto px-4 py-3 flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                            children: "A"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Header.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-lg font-bold text-gray-900 leading-tight",
                                    children: "Adiyogi AI"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Header.tsx",
                                    lineNumber: 17,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-orange-600 -mt-0.5",
                                    children: "Learn Anything Free"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Header.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/Header.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/Header.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: language,
                    onChange: (e)=>setLanguage(e.target.value),
                    className: "text-sm bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400",
                    children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_NAMES"]).slice(0, 4).map(([code, name])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: code,
                            children: name
                        }, code, false, {
                            fileName: "[project]/src/components/ui/Header.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Header.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/Header.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Header.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_s(Header, "wjkDBbUXW8AlDo6ZtwJWharziKU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTranslations",
    ()=>getTranslations,
    "t",
    ()=>t
]);
const translations = {
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
        noResults: "No resources found. Try a different search."
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
        noResults: "कोई संसाधन नहीं मिला। कुछ और खोजें।"
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
        noResults: "வளங்கள் எதுவும் கிடைக்கவில்லை."
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
        noResults: "వనరులు కనుగొనబడలేదు."
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
        noResults: "কোনো সম্পদ পাওয়া যায়নি।"
    },
    mr: {
        appName: "आदियोगी AI",
        tagline: "काहीही मोफत शिका",
        subtitle: "तुम्हाला काय शिकायचे आहे ते सांगा",
        placeholder: "उदा., मशीन लर्निंग...",
        generate: "कोर्स प्लॅन तयार करा",
        generating: "तुमचा प्लॅन तयार करत आहे...",
        speakNow: "बोलण्यासाठी टॅप करा",
        listening: "ऐकत आहे...",
        stopListening: "थांबवण्यासाठी टॅप करा",
        weekLabel: "आठवडा",
        resources: "साधने",
        markComplete: "पूर्ण म्हणून चिन्हांकित करा",
        completed: "पूर्ण",
        progress: "प्रगती",
        beginner: "प्रारंभिक",
        intermediate: "मध्यम",
        advanced: "प्रगत",
        selectLanguage: "भाषा निवडा",
        selectLevel: "कौशल्य पातळी",
        weeks: "आठवडे",
        startLearning: "शिकणे सुरू करा",
        poweredBy: "AWS Bedrock + Sarvam AI द्वारा",
        freeForever: "कायम 100% मोफत",
        voiceFirst: "व्हॉइस-फर्स्ट AI शिक्षण",
        noResults: "कोणतीही साधने सापडली नाहीत."
    },
    gu: {
        appName: "આદિયોગી AI",
        tagline: "કંઈપણ મફતમાં શીખો",
        subtitle: "તમે શું શીખવા માંગો છો તે કહો",
        placeholder: "દા.ત., મશીન લર્નિંગ...",
        generate: "કોર્સ પ્લાન બનાવો",
        generating: "તમારો પ્લાન બનાવી રહ્યા છે...",
        speakNow: "બોલવા ટેપ કરો",
        listening: "સાંભળી રહ્યા છે...",
        stopListening: "રોકવા ટેપ કરો",
        weekLabel: "અઠવાડિયું",
        resources: "સંસાધનો",
        markComplete: "પૂર્ણ તરીકે ચિહ્નિત કરો",
        completed: "પૂર્ણ",
        progress: "પ્રગતિ",
        beginner: "શરૂઆતી",
        intermediate: "મધ્યમ",
        advanced: "અદ્યતન",
        selectLanguage: "ભાષા પસંદ કરો",
        selectLevel: "કુશળતા સ્તર",
        weeks: "અઠવાડિયા",
        startLearning: "શીખવાનું શરૂ કરો",
        poweredBy: "AWS Bedrock + Sarvam AI દ્વારા",
        freeForever: "હંમેશા 100% મફત",
        voiceFirst: "વોઇસ-ફર્સ્ટ AI શિક્ષણ",
        noResults: "કોઈ સંસાધનો મળ્યા નથી."
    },
    kn: {
        appName: "ಆದಿಯೋಗಿ AI",
        tagline: "ಏನನ್ನಾದರೂ ಉಚಿತವಾಗಿ ಕಲಿಯಿರಿ",
        subtitle: "ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಹೇಳಿ",
        placeholder: "ಉದಾ., ಮೆಷಿನ್ ಲರ್ನಿಂಗ್...",
        generate: "ಕೋರ್ಸ್ ಪ್ಲ್ಯಾನ್ ರಚಿಸಿ",
        generating: "ನಿಮ್ಮ ಪ್ಲ್ಯಾನ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
        speakNow: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
        listening: "ಕೇಳುತ್ತಿದೆ...",
        stopListening: "ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
        weekLabel: "ವಾರ",
        resources: "ಸಂಪನ್ಮೂಲಗಳು",
        markComplete: "ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ",
        completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
        progress: "ಪ್ರಗತಿ",
        beginner: "ಆರಂಭಿಕ",
        intermediate: "ಮಧ್ಯಮ",
        advanced: "ಮುಂದುವರಿದ",
        selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
        selectLevel: "ಕೌಶಲ ಮಟ್ಟ",
        weeks: "ವಾರಗಳು",
        startLearning: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ",
        poweredBy: "AWS Bedrock + Sarvam AI ಮೂಲಕ",
        freeForever: "ಯಾವಾಗಲೂ 100% ಉಚಿತ",
        voiceFirst: "ವಾಯ್ಸ್-ಫಸ್ಟ್ AI ಶಿಕ್ಷಣ",
        noResults: "ಯಾವುದೇ ಸಂಪನ್ಮೂಲಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
    },
    ml: {
        appName: "ആദിയോഗി AI",
        tagline: "എന്തും സൗജന്യമായി പഠിക്കൂ",
        subtitle: "നിങ്ങൾ എന്താണ് പഠിക്കാൻ ആഗ്രഹിക്കുന്നതെന്ന് പറയൂ",
        placeholder: "ഉദാ., മെഷീൻ ലേണിംഗ്...",
        generate: "കോഴ്സ് പ്ലാൻ ഉണ്ടാക്കുക",
        generating: "നിങ്ങളുടെ പ്ലാൻ ഉണ്ടാക്കുന്നു...",
        speakNow: "സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക",
        listening: "കേൾക്കുന്നു...",
        stopListening: "നിർത്താൻ ടാപ്പ് ചെയ്യുക",
        weekLabel: "ആഴ്ച",
        resources: "വിഭവങ്ങൾ",
        markComplete: "പൂർത്തിയായി അടയാളപ്പെടുത്തുക",
        completed: "പൂർത്തിയായി",
        progress: "പുരോഗതി",
        beginner: "തുടക്കക്കാരൻ",
        intermediate: "ഇടനിലക്കാരൻ",
        advanced: "വിപുലമായ",
        selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
        selectLevel: "കഴിവ് നില",
        weeks: "ആഴ്ചകൾ",
        startLearning: "പഠിക്കാൻ ആരംഭിക്കുക",
        poweredBy: "AWS Bedrock + Sarvam AI വഴി",
        freeForever: "എപ്പോഴും 100% സൗജന്യം",
        voiceFirst: "വോയ്സ്-ഫസ്റ്റ് AI വിദ്യാഭ്യാസം",
        noResults: "വിഭവങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല."
    },
    pa: {
        appName: "ਆਦਿਯੋਗੀ AI",
        tagline: "ਕੁਝ ਵੀ ਮੁਫ਼ਤ ਸਿੱਖੋ",
        subtitle: "ਦੱਸੋ ਤੁਸੀਂ ਕੀ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ",
        placeholder: "ਜਿਵੇਂ, ਮਸ਼ੀਨ ਲਰਨਿੰਗ...",
        generate: "ਕੋਰਸ ਪਲਾਨ ਬਣਾਓ",
        generating: "ਤੁਹਾਡਾ ਪਲਾਨ ਬਣਾ ਰਹੇ ਹਾਂ...",
        speakNow: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
        listening: "ਸੁਣ ਰਹੇ ਹਾਂ...",
        stopListening: "ਰੁਕਣ ਲਈ ਟੈਪ ਕਰੋ",
        weekLabel: "ਹਫ਼ਤਾ",
        resources: "ਸਰੋਤ",
        markComplete: "ਪੂਰਾ ਚਿੰਨ੍ਹਿਤ ਕਰੋ",
        completed: "ਪੂਰਾ ਹੋਇਆ",
        progress: "ਤਰੱਕੀ",
        beginner: "ਸ਼ੁਰੂਆਤੀ",
        intermediate: "ਮੱਧ",
        advanced: "ਉੱਨਤ",
        selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
        selectLevel: "ਹੁਨਰ ਪੱਧਰ",
        weeks: "ਹਫ਼ਤੇ",
        startLearning: "ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ",
        poweredBy: "AWS Bedrock + Sarvam AI ਦੁਆਰਾ",
        freeForever: "ਹਮੇਸ਼ਾ 100% ਮੁਫ਼ਤ",
        voiceFirst: "ਵੌਇਸ-ਫਸਟ AI ਸਿੱਖਿਆ",
        noResults: "ਕੋਈ ਸਰੋਤ ਨਹੀਂ ਮਿਲੇ।"
    },
    or: {
        appName: "ଆଦିଯୋଗୀ AI",
        tagline: "ଯେକୌଣସି ଜିନିଷ ମାଗଣାରେ ଶିଖ",
        subtitle: "ତୁମେ କ'ଣ ଶିଖିବାକୁ ଚାହଁ କୁହ",
        placeholder: "ଯେପରି, ମେସିନ ଲର୍ଣିଂ...",
        generate: "କୋର୍ସ ପ୍ଲାନ ତିଆରି କର",
        generating: "ତୁମ ପ୍ଲାନ ତିଆରି ହେଉଛି...",
        speakNow: "କହିବାକୁ ଟ୍ୟାପ କର",
        listening: "ଶୁଣୁଛି...",
        stopListening: "ଅଟକିବାକୁ ଟ୍ୟାପ କର",
        weekLabel: "ସପ୍ତାହ",
        resources: "ସମ୍ପଦ",
        markComplete: "ସମ୍ପୂର୍ଣ୍ଣ ଚିହ୍ନିତ କର",
        completed: "ସମ୍ପୂର୍ଣ୍ଣ",
        progress: "ପ୍ରଗତି",
        beginner: "ଆରମ୍ଭିକ",
        intermediate: "ମଧ୍ୟବର୍ତ୍ତୀ",
        advanced: "ଉନ୍ନତ",
        selectLanguage: "ଭାଷା ବାଛ",
        selectLevel: "ଦକ୍ଷତା ସ୍ତର",
        weeks: "ସପ୍ତାହ",
        startLearning: "ଶିଖିବା ଆରମ୍ଭ କର",
        poweredBy: "AWS Bedrock + Sarvam AI ଦ୍ୱାରା",
        freeForever: "ସର୍ବଦା 100% ମାଗଣା",
        voiceFirst: "ଭଏସ-ଫର୍ଷ୍ଟ AI ଶିକ୍ଷା",
        noResults: "କୌଣସି ସମ୍ପଦ ମିଳିଲା ନାହିଁ।"
    },
    as: {
        appName: "আদিযোগী AI",
        tagline: "যিকোনো বস্তু বিনামূলীয়াকৈ শিকক",
        subtitle: "আপুনি কি শিকিব বিচাৰে কওক",
        placeholder: "যেনে, মেচিন লাৰ্নিং...",
        generate: "কোৰ্ছ প্লেন বনাওক",
        generating: "আপোনাৰ প্লেন বনাই আছে...",
        speakNow: "কবলৈ টেপ কৰক",
        listening: "শুনি আছে...",
        stopListening: "ৰখাবলৈ টেপ কৰক",
        weekLabel: "সপ্তাহ",
        resources: "সম্পদ",
        markComplete: "সম্পূৰ্ণ চিহ্নিত কৰক",
        completed: "সম্পূৰ্ণ",
        progress: "প্ৰগতি",
        beginner: "আৰম্ভণি",
        intermediate: "মধ্যম",
        advanced: "উন্নত",
        selectLanguage: "ভাষা বাছক",
        selectLevel: "দক্ষতাৰ স্তৰ",
        weeks: "সপ্তাহ",
        startLearning: "শিকিবলৈ আৰম্ভ কৰক",
        poweredBy: "AWS Bedrock + Sarvam AI দ্বাৰা",
        freeForever: "সদায় 100% বিনামূলীয়া",
        voiceFirst: "ভইচ-ফাৰ্ষ্ট AI শিক্ষা",
        noResults: "কোনো সম্পদ পোৱা নগল।"
    }
};
function t(key, language = "en") {
    return translations[language]?.[key] || translations.en[key] || key;
}
function getTranslations(language) {
    return translations[language] || translations.en;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/voice/VoiceInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VoiceInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function VoiceInput({ language, onTranscript, disabled }) {
    _s();
    const [isListening, setIsListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceInput.useCallback[startListening]": async ()=>{
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "audio/webm;codecs=opus"
                });
                mediaRecorderRef.current = mediaRecorder;
                chunksRef.current = [];
                mediaRecorder.ondataavailable = ({
                    "VoiceInput.useCallback[startListening]": (e)=>{
                        if (e.data.size > 0) chunksRef.current.push(e.data);
                    }
                })["VoiceInput.useCallback[startListening]"];
                mediaRecorder.onstop = ({
                    "VoiceInput.useCallback[startListening]": async ()=>{
                        stream.getTracks().forEach({
                            "VoiceInput.useCallback[startListening]": (track)=>track.stop()
                        }["VoiceInput.useCallback[startListening]"]);
                        const audioBlob = new Blob(chunksRef.current, {
                            type: "audio/webm"
                        });
                        setIsProcessing(true);
                        try {
                            // Convert blob to base64
                            const reader = new FileReader();
                            const base64 = await new Promise({
                                "VoiceInput.useCallback[startListening]": (resolve)=>{
                                    reader.onloadend = ({
                                        "VoiceInput.useCallback[startListening]": ()=>{
                                            const result = reader.result;
                                            resolve(result.split(",")[1]);
                                        }
                                    })["VoiceInput.useCallback[startListening]"];
                                    reader.readAsDataURL(audioBlob);
                                }
                            }["VoiceInput.useCallback[startListening]"]);
                            // Send to Sarvam STT
                            const res = await fetch("/api/voice/stt", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    audio: base64,
                                    language
                                })
                            });
                            if (res.ok) {
                                const data = await res.json();
                                if (data.text) onTranscript(data.text);
                            } else {
                                // Fallback: use Web Speech API
                                fallbackWebSpeech();
                            }
                        } catch  {
                            fallbackWebSpeech();
                        } finally{
                            setIsProcessing(false);
                        }
                    }
                })["VoiceInput.useCallback[startListening]"];
                mediaRecorder.start();
                setIsListening(true);
            } catch  {
                // Microphone not available, fallback to Web Speech API
                fallbackWebSpeech();
            }
        }
    }["VoiceInput.useCallback[startListening]"], [
        language,
        onTranscript
    ]);
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceInput.useCallback[stopListening]": ()=>{
            if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            setIsListening(false);
        }
    }["VoiceInput.useCallback[stopListening]"], []);
    const fallbackWebSpeech = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VoiceInput.useCallback[fallbackWebSpeech]": ()=>{
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return;
            const recognition = new SpeechRecognition();
            const langMap = {
                en: "en-IN",
                hi: "hi-IN",
                ta: "ta-IN",
                te: "te-IN",
                bn: "bn-IN",
                mr: "mr-IN",
                gu: "gu-IN",
                kn: "kn-IN",
                ml: "ml-IN",
                pa: "pa-IN"
            };
            recognition.lang = langMap[language] || "en-IN";
            recognition.interimResults = false;
            recognition.onresult = ({
                "VoiceInput.useCallback[fallbackWebSpeech]": (event)=>{
                    const text = event.results[0][0].transcript;
                    onTranscript(text);
                }
            })["VoiceInput.useCallback[fallbackWebSpeech]"];
            recognition.onerror = ({
                "VoiceInput.useCallback[fallbackWebSpeech]": ()=>setIsListening(false)
            })["VoiceInput.useCallback[fallbackWebSpeech]"];
            recognition.onend = ({
                "VoiceInput.useCallback[fallbackWebSpeech]": ()=>setIsListening(false)
            })["VoiceInput.useCallback[fallbackWebSpeech]"];
            recognition.start();
            setIsListening(true);
        }
    }["VoiceInput.useCallback[fallbackWebSpeech]"], [
        language,
        onTranscript
    ]);
    const toggleListening = ()=>{
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: toggleListening,
                disabled: disabled || isProcessing,
                className: `relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? "bg-red-500 mic-active scale-110" : "bg-gradient-to-br from-orange-400 to-orange-600 hover:scale-105"} ${disabled || isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
                "aria-label": isListening ? "Stop listening" : "Start listening",
                children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-8 h-8 text-white animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/voice/VoiceInput.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/voice/VoiceInput.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/voice/VoiceInput.tsx",
                    lineNumber: 144,
                    columnNumber: 11
                }, this) : isListening ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        0,
                        1,
                        2,
                        3,
                        4
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "voice-bar bg-white",
                            style: {
                                height: `${8 + Math.random() * 20}px`,
                                animationDelay: `${i * 0.1}s`,
                                animation: "voice-wave 0.8s ease-in-out infinite"
                            }
                        }, i, false, {
                            fileName: "[project]/src/components/voice/VoiceInput.tsx",
                            lineNumber: 166,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/voice/VoiceInput.tsx",
                    lineNumber: 164,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-8 h-8 text-white",
                    fill: "currentColor",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/voice/VoiceInput.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/voice/VoiceInput.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/voice/VoiceInput.tsx",
                    lineNumber: 178,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/voice/VoiceInput.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-slate-500 font-medium",
                children: isProcessing ? "Processing..." : isListening ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"])("listening", language) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"])("speakNow", language)
            }, void 0, false, {
                fileName: "[project]/src/components/voice/VoiceInput.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/voice/VoiceInput.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_s(VoiceInput, "rHY1LyigeJk9mEfrW44T9NXQ74E=");
_c = VoiceInput;
var _c;
__turbopack_context__.k.register(_c, "VoiceInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/course/ResourceList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResourceList",
    ()=>ResourceList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function ResourceList({ resources }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
                children: "Resources"
            }, void 0, false, {
                fileName: "[project]/src/components/course/ResourceList.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            resources.map((resource, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: resource.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group",
                    children: [
                        resource.thumbnail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: resource.thumbnail,
                            alt: "",
                            className: "w-24 h-14 object-cover rounded-md flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/course/ResourceList.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2",
                                    children: resource.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/course/ResourceList.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500",
                                            children: resource.channel
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/course/ResourceList.tsx",
                                            lineNumber: 31,
                                            columnNumber: 15
                                        }, this),
                                        resource.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-400",
                                            children: resource.duration
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/course/ResourceList.tsx",
                                            lineNumber: 33,
                                            columnNumber: 17
                                        }, this),
                                        resource.views ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-400",
                                            children: resource.views > 1000000 ? (resource.views / 1000000).toFixed(1) + 'M views' : resource.views > 1000 ? (resource.views / 1000).toFixed(0) + 'K views' : resource.views + ' views'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/course/ResourceList.tsx",
                                            lineNumber: 36,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/course/ResourceList.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block mt-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium uppercase",
                                    children: resource.type
                                }, void 0, false, {
                                    fileName: "[project]/src/components/course/ResourceList.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/course/ResourceList.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/components/course/ResourceList.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/course/ResourceList.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = ResourceList;
var _c;
__turbopack_context__.k.register(_c, "ResourceList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/course/ModuleCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModuleCard",
    ()=>ModuleCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$ResourceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/course/ResourceList.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ModuleCard({ module, language }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border border-gray-200 rounded-xl overflow-hidden hover:border-orange-200 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "w-full px-5 py-4 flex items-center justify-between text-left hover:bg-orange-50/50 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold",
                                children: module.week
                            }, void 0, false, {
                                fileName: "[project]/src/components/course/ModuleCard.tsx",
                                lineNumber: 22,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900",
                                        children: language === 'hi' ? module.titleHindi || module.title : module.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                                        lineNumber: 26,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-0.5",
                                        children: [
                                            module.topics.length,
                                            " topics · ",
                                            module.estimatedHours,
                                            "h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                                        lineNumber: 29,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/course/ModuleCard.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: 'w-5 h-5 text-gray-400 transition-transform ' + (isOpen ? 'rotate-180' : ''),
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/course/ModuleCard.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/course/ModuleCard.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pb-4 border-t border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: module.topics.map((topic, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs",
                                    children: topic
                                }, i, false, {
                                    fileName: "[project]/src/components/course/ModuleCard.tsx",
                                    lineNumber: 49,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/course/ModuleCard.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    module.resources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$ResourceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResourceList"], {
                        resources: module.resources
                    }, void 0, false, {
                        fileName: "[project]/src/components/course/ModuleCard.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/course/ModuleCard.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/course/ModuleCard.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(ModuleCard, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c = ModuleCard;
var _c;
__turbopack_context__.k.register(_c, "ModuleCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/voice/TextToSpeechPlayer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextToSpeechPlayer",
    ()=>TextToSpeechPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function TextToSpeechPlayer({ text, language }) {
    _s();
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const playAudio = async ()=>{
        setIsPlaying(true);
        try {
            const response = await fetch('/api/voice/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    language
                })
            });
            const data = await response.json();
            if (data.audio) {
                // Sarvam API returned base64 audio
                const audioSrc = 'data:audio/wav;base64,' + data.audio;
                const audio = new Audio(audioSrc);
                audio.onended = ()=>setIsPlaying(false);
                audio.play();
            } else {
                // Fallback to browser TTS
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
                utterance.onend = ()=>setIsPlaying(false);
                speechSynthesis.speak(utterance);
            }
        } catch  {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
            utterance.onend = ()=>setIsPlaying(false);
            speechSynthesis.speak(utterance);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: playAudio,
        disabled: isPlaying,
        className: "inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: 'w-4 h-4' + (isPlaying ? ' animate-pulse' : ''),
                fill: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                }, void 0, false, {
                    fileName: "[project]/src/components/voice/TextToSpeechPlayer.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/voice/TextToSpeechPlayer.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            isPlaying ? 'Playing...' : 'Listen'
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/voice/TextToSpeechPlayer.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(TextToSpeechPlayer, "dxr5RgzQJlMZkbQdHY9iHZ+FF0w=");
_c = TextToSpeechPlayer;
var _c;
__turbopack_context__.k.register(_c, "TextToSpeechPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/course/CourseOutline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CourseOutline",
    ()=>CourseOutline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$ModuleCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/course/ModuleCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$voice$2f$TextToSpeechPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/voice/TextToSpeechPlayer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store/course-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CourseOutline({ course }) {
    _s();
    const { language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-4 py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-gray-900",
                                        children: language === 'hi' ? course.titleHindi || course.title : course.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                                        lineNumber: 20,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mt-2",
                                        children: course.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                                        lineNumber: 23,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$voice$2f$TextToSpeechPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextToSpeechPlayer"], {
                                text: language === 'hi' ? course.titleHindi || course.title : course.title,
                                language: language
                            }, void 0, false, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium",
                                children: course.duration
                            }, void 0, false, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium capitalize",
                                children: course.level
                            }, void 0, false, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium",
                                children: [
                                    course.totalHours,
                                    " hours"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium",
                                children: "100% Free"
                            }, void 0, false, {
                                fileName: "[project]/src/components/course/CourseOutline.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    course.prerequisites.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 p-3 bg-yellow-50 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-yellow-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Prerequisites: "
                                }, void 0, false, {
                                    fileName: "[project]/src/components/course/CourseOutline.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this),
                                course.prerequisites.join(', ')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/course/CourseOutline.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/course/CourseOutline.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: course.modules.map((module, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$ModuleCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModuleCard"], {
                        module: module,
                        language: language
                    }, index, false, {
                        fileName: "[project]/src/components/course/CourseOutline.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/course/CourseOutline.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/course/CourseOutline.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(CourseOutline, "uSfCRaF1MkmXS3h0gvNoibODN/o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"]
    ];
});
_c = CourseOutline;
var _c;
__turbopack_context__.k.register(_c, "CourseOutline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Loading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeneratingAnimation",
    ()=>GeneratingAnimation,
    "LoadingSkeleton",
    ()=>LoadingSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LoadingSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-pulse space-y-4 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 bg-orange-100 rounded-lg w-3/4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 bg-gray-100 rounded w-1/2"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 5,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3 mt-8",
                children: [
                    1,
                    2,
                    3,
                    4
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-gray-100 rounded-xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 bg-gray-100 rounded w-2/3 mb-3"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Loading.tsx",
                                lineNumber: 9,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 bg-gray-50 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Loading.tsx",
                                lineNumber: 10,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 bg-gray-50 rounded w-4/5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Loading.tsx",
                                lineNumber: 11,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/ui/Loading.tsx",
                        lineNumber: 8,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Loading.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = LoadingSkeleton;
function GeneratingAnimation() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center py-16 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-20 h-20 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-full border-4 border-orange-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Loading.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Loading.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-3 rounded-full border-4 border-green-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Loading.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-3 rounded-full border-4 border-green-500 border-t-transparent animate-spin",
                        style: {
                            animationDirection: 'reverse',
                            animationDuration: '1.5s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Loading.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-semibold text-gray-800 mb-2",
                children: "Creating Your Course"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 text-center text-sm max-w-xs",
                children: "AI is designing a personalized learning path with the best free resources..."
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Loading.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Loading.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c1 = GeneratingAnimation;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoadingSkeleton");
__turbopack_context__.k.register(_c1, "GeneratingAnimation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$voice$2f$VoiceInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/voice/VoiceInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$CourseOutline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/course/CourseOutline.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Loading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store/course-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const EXAMPLE_QUERIES = [
    {
        hi: "Python programming seekho",
        en: "Learn Python programming"
    },
    {
        hi: "Data Science kya hai",
        en: "What is Data Science"
    },
    {
        hi: "Web development seekho",
        en: "Learn Web Development"
    },
    {
        hi: "Machine Learning basics",
        en: "Machine Learning basics"
    },
    {
        hi: "Digital marketing seekho",
        en: "Learn Digital Marketing"
    },
    {
        hi: "English speaking practice",
        en: "English speaking practice"
    }
];
function HomePage() {
    _s();
    const [inputText, setInputText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [level, setLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("beginner");
    const { currentCourse, isGenerating, error, language, generateCourse, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"])();
    const handleSubmit = async ()=>{
        if (!inputText.trim()) return;
        await generateCourse(inputText.trim(), level);
    };
    const handleVoiceTranscript = (text)=>{
        setInputText(text);
    };
    const handleExampleClick = (query)=>{
        const text = language === "hi" ? query.hi : query.en;
        setInputText(text);
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };
    if (isGenerating) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-b from-orange-50 to-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeneratingAnimation"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    if (currentCourse) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-b from-orange-50 to-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-4 px-4 flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"].getState().setCourse(null),
                        className: "text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 19l-7-7 7-7"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            "New Search"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$course$2f$CourseOutline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CourseOutline"], {
                    course: currentCourse
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-b from-orange-50 to-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-2xl mx-auto px-4 pt-12 pb-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl sm:text-4xl font-bold text-gray-900 mb-3",
                                children: language === "hi" ? "कुछ भी सीखो, मुफ़्त में" : "Learn Anything, For Free"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-lg",
                                children: language === "hi" ? "AI से बना structured course plan — YouTube, NPTEL, Khan Academy से" : "AI-powered structured courses from YouTube, NPTEL, Khan Academy"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl shadow-lg shadow-orange-100/50 border border-orange-100 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: language === "hi" ? "आप क्या सीखना चाहते हैं?" : "What do you want to learn?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: inputText,
                                                onChange: (e)=>setInputText(e.target.value),
                                                onKeyDown: handleKeyDown,
                                                placeholder: language === "hi" ? "उदाहरण: मुझे Python programming सीखना है..." : "Example: I want to learn Python programming...",
                                                rows: 2,
                                                className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none text-gray-800 placeholder:text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 99,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$voice$2f$VoiceInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        language: language,
                                        onTranscript: handleVoiceTranscript,
                                        disabled: isGenerating
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-500",
                                        children: language === "hi" ? "स्तर:" : "Level:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        "beginner",
                                        "intermediate",
                                        "advanced"
                                    ].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setLevel(l),
                                            className: "px-3 py-1 rounded-full text-sm transition-colors " + (level === l ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"),
                                            children: l === "beginner" ? language === "hi" ? "शुरुआती" : "Beginner" : l === "intermediate" ? language === "hi" ? "मध्यम" : "Intermediate" : language === "hi" ? "उन्नत" : "Advanced"
                                        }, l, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSubmit,
                                disabled: !inputText.trim() || isGenerating,
                                className: "w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]",
                                children: language === "hi" ? "Course बनाओ" : "Generate Course"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setError(null),
                                        className: "text-red-500 hover:text-red-700",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 153,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 text-center mb-3",
                                children: language === "hi" ? "या कोई example try करो:" : "Or try an example:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap justify-center gap-2",
                                children: EXAMPLE_QUERIES.map((q, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleExampleClick(q),
                                        className: "px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors",
                                        children: language === "hi" ? q.hi : q.en
                                    }, i, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-16 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400",
                                children: language === "hi" ? "YouTube, NPTEL, Khan Academy, MIT OCW से मुफ्त content" : "Free content from YouTube, NPTEL, Khan Academy, MIT OCW"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center gap-4 mt-3 opacity-40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-gray-500",
                                        children: "YouTube"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-gray-500",
                                        children: "NPTEL"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-gray-500",
                                        children: "Khan Academy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-gray-500",
                                        children: "MIT OCW"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(HomePage, "Esw8FxxKhPQLofGf0HkbErVSJdI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2f$course$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCourseStore"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b24cce3c._.js.map