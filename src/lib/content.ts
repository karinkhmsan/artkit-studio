// The donate feature is OFF unless NEXT_PUBLIC_DONATE_ENABLED is exactly "true".
export const donateEnabled = process.env.NEXT_PUBLIC_DONATE_ENABLED === "true";

export type Language = "en" | "th";
export type ToolId = "timer" | "palette" | "prompt";
export type InfoId = "about" | "privacy" | "terms" | "how-to-use";

export const toolIds: ToolId[] = ["timer", "palette", "prompt"];
export const infoIds: InfoId[] = ["about", "privacy", "terms", "how-to-use"];

export const infoLabelKey = { about: "about", privacy: "privacy", terms: "terms", "how-to-use": "howToUse" } as const;

const translations = {
  en: {
    navLabel: "Studio tools", languageLabel: "Language", themeLabel: "Switch color theme", lightMode: "Switch to light mode", darkMode: "Switch to dark mode",
    timer: "Gesture Timer", palette: "Palette & Value", prompt: "Drawing Prompts",
    timerFull: "Gesture Timer", paletteFull: "Palette & Value Checker", promptFull: "Drawing Prompt & Share",
    workspace: "YOUR WORKSPACE", explore: "EXPLORE TOOLS", littleSpace: "A little space to", create: "make art.",
    heroDescription: "Thoughtful tools for the messy, wonderful process of creating. Settle in, find your flow, and make something yours.",
    privateBadge: "Made for your creative flow", selectedTool: "SELECTED TOOL", ready: "READY",
    timerTitle: "Every great sketch starts somewhere.", timerDescription: "Set a pose length, press start, and draw. A soft chime warns you 5 seconds before each pose ends.",
    paletteTitle: "See color in a new light.", paletteDescription: "Drop in a reference image to pull out its main colors and see its values. Everything runs in your browser.",
    promptTitle: "A spark for your next idea.", promptDescription: "Roll a random drawing prompt. When you finish, upload your drawing and share it with the prompt and a link.",
    timerStep: "01 / WARM UP",
    paletteStep: "02 / EXPLORE COLOR",
    promptStep: "03 / FIND INSPIRATION",
    builtFor: "BUILT FOR THE WAY YOU CREATE", everything: "Everything in its right place.",
    featureOneTitle: "A quieter workspace", featureOneBody: "Just the tools you need, without the visual noise.",
    featureTwoTitle: "Your work stays yours", featureTwoBody: "Designed for browser-only processing. No accounts or uploads to a server.",
    featureThreeTitle: "Create in your language", featureThreeBody: "Switch between English and Thai whenever you like.",
    adLabel: "ADVERTISEMENT", adReserved: "Reserved ad space", adNotice: "Ads are not currently displayed here.",
    footerDescription: "A thoughtful little corner of the internet for artists.", footerNav: "EXPLORE", footerLegal: "INFORMATION",
    about: "About", privacy: "Privacy Policy", terms: "Terms of Service", howToUse: "How to Use",
    copyright: "Made with care for artists everywhere.", footerNote: "Create at your own pace.", backToStudio: "Back to studio",
    donate: {
      button: "Support", buttonLabel: "Support the creator", footerLink: "Support the creator", close: "Close",
      title: "Support the creator",
      body: [
        "Thanks for using ArtKit Studio! It's a small passion project made for artists like you.",
        "Donations help keep the tools free and cover hosting. Giving is totally optional, and every bit is appreciated.",
      ],
      cta: "Donate via Easy Donate", newTab: "(opens in a new tab)", later: "Maybe later",
      note: "Donations are handled by Easy Donate. This site never sees your payment details.",
    },
    info: {
      about: { eyebrow: "OUR STORY", title: "A little more room for creativity.", intro: "ArtKit Studio is a simple, distraction-free home for the small rituals that help artists make things.", sections: [
        { title: "Why we're here", body: "Good creative tools should make room for the work, not get in its way. This studio brings gesture practice, color exploration, and idea planning into one calm place." },
        { title: "Designed with intention", body: "The interface uses gentle contrast, generous space, and a neutral background to help you focus on your own colors and ideas. English and Thai are both supported." },
        { title: "Ready to use", body: "The gesture timer, palette and value checker, and drawing prompt generator all work now, right in your browser." },
      ] },
      privacy: { eyebrow: "YOUR PRIVACY", title: "Your creative space stays yours.", intro: "ArtKit Studio is designed around browser-based tools and a small footprint. This page describes the current preview.", sections: [
        { title: "What this site stores", body: "Your language and appearance preferences are saved in your browser's localStorage. You can clear them at any time through your browser settings." },
        { title: "Your artwork", body: "The palette checker and the share card read your image inside your browser. The image is never uploaded to our servers and is gone when you close or refresh the page. If you choose to share, the post is made on X, Facebook or Instagram under their own privacy policies." },
        { title: "Advertising and third parties", body: "This site can show ads through Google AdSense when ads are switched on. Google may use cookies or similar technology to show and measure ads, under its own privacy policy. Ad areas stay empty when ads are off. Please add a cookie consent notice if you serve ads to visitors in regions that require it." },
        { title: "Reference photos", body: "If you choose Pexels photos in the timer, your browser loads pictures from Pexels, which can see your IP address under its own privacy policy. Pictures you choose from your own device never leave your browser." },
        ...(donateEnabled ? [{ title: "Donations", body: "If you choose to donate, you are taken to Easy Donate, which processes the payment under its own terms and privacy policy. This site does not collect or store any payment information." }] : []),
        { title: "Questions", body: "This is a preview project. No user accounts, contact form, or personal-data collection service is offered here." },
      ] },
      terms: { eyebrow: "THE DETAILS", title: "Simple terms, clearly stated.", intro: "By using this preview of ArtKit Studio, you agree to these basic terms.", sections: [
        { title: "Use of the site", body: "You may use the tools for lawful personal or professional creative work." },
        { title: "Your content", body: "You retain ownership of anything you create. Images you open in the palette checker stay in your browser and are not received or stored by us." },
        { title: "Availability", body: "The site is provided as-is and may change or be unavailable without notice. Do not rely on it for time-sensitive work." },
      ] },
      "how-to-use": { eyebrow: "GETTING STARTED", title: "Make yourself at home.", intro: "A quick guide to finding your way around the ArtKit Studio preview.", sections: [
        { title: "Choose a workspace", body: "Select Gesture Timer, Palette & Value Checker, or Drawing Prompt & Share using the navigation at the top or the tool list beside the workspace." },
        { title: "Make it yours", body: "Use the EN / TH switch to change language instantly, and the sun or moon button to change between light and dark themes. Your preferences are remembered in this browser." },
        { title: "What's available now", body: "Use the timer to run gesture sessions, drop in an image to see its colors and values, roll a drawing prompt, then share your finished drawing. Keyboard shortcuts are listed under each tool." },
        { title: "Your work stays private", body: "The tools work entirely in your browser, so your artwork stays on your device instead of being uploaded to a server." },
      ] },
    },
  },
  th: {
    navLabel: "เครื่องมือในสตูดิโอ", languageLabel: "ภาษา", themeLabel: "เปลี่ยนธีมสี", lightMode: "เปลี่ยนเป็นโหมดสว่าง", darkMode: "เปลี่ยนเป็นโหมดมืด",
    timer: "จับเวลาวาด", palette: "สีและค่าน้ำหนัก", prompt: "โจทย์วาดรูป",
    timerFull: "ฝึกวาดจับเวลา", paletteFull: "ดึงคู่สีและเช็กค่าน้ำหนักแสงเงา", promptFull: "สุ่มโจทย์วาดรูปและแชร์ผลงาน",
    workspace: "พื้นที่สร้างสรรค์ของคุณ", explore: "สำรวจเครื่องมือ", littleSpace: "พื้นที่เล็ก ๆ สำหรับ", create: "สร้างงานศิลป์",
    heroDescription: "เครื่องมือที่ใส่ใจทุกขั้นตอนของการสร้างสรรค์ ลองพักใจ หาแรงบันดาลใจ แล้วสร้างผลงานในแบบของคุณ",
    privateBadge: "ออกแบบมาเพื่อจังหวะสร้างสรรค์ของคุณ", selectedTool: "เครื่องมือที่เลือก", ready: "พร้อมใช้งาน",
    timerTitle: "ทุกภาพร่างที่ยอดเยี่ยมมีจุดเริ่มต้น", timerDescription: "ตั้งเวลาต่อท่า กดเริ่ม แล้วลงมือวาด เสียงเตือนเบา ๆ จะดังก่อนหมดเวลาแต่ละท่า 5 วินาที",
    paletteTitle: "มองสีในมุมใหม่", paletteDescription: "ใส่รูปอ้างอิงเพื่อดึงชุดสีหลักและดูค่าน้ำหนักแสงเงา ทุกอย่างทำงานในเบราว์เซอร์ของคุณ",
    promptTitle: "จุดประกายไอเดียใหม่", promptDescription: "สุ่มโจทย์วาดรูป พอวาดเสร็จก็อัปโหลดรูปแล้วแชร์พร้อมโจทย์และลิงก์เว็บได้เลย",
    timerStep: "01 / อุ่นเครื่อง",
    paletteStep: "02 / สำรวจสี",
    promptStep: "03 / หาแรงบันดาลใจ",
    builtFor: "ออกแบบเพื่อวิธีสร้างสรรค์ของคุณ", everything: "ทุกอย่างอยู่ในที่ที่ลงตัว",
    featureOneTitle: "พื้นที่ทำงานที่สงบขึ้น", featureOneBody: "มีเฉพาะเครื่องมือที่ต้องการ ไม่มีสิ่งรบกวนสายตา",
    featureTwoTitle: "ผลงานของคุณยังเป็นของคุณ", featureTwoBody: "ออกแบบให้ประมวลผลในเบราว์เซอร์ ไม่ต้องสมัครบัญชีหรืออัปโหลดไปยังเซิร์ฟเวอร์",
    featureThreeTitle: "สร้างสรรค์ในภาษาของคุณ", featureThreeBody: "สลับระหว่างภาษาอังกฤษและภาษาไทยได้ทุกเมื่อ",
    adLabel: "พื้นที่โฆษณา", adReserved: "พื้นที่สำรองสำหรับโฆษณา", adNotice: "ขณะนี้ยังไม่มีโฆษณาแสดงในพื้นที่นี้",
    footerDescription: "มุมเล็ก ๆ ที่ใส่ใจสำหรับศิลปินบนโลกออนไลน์", footerNav: "สำรวจ", footerLegal: "ข้อมูล",
    about: "เกี่ยวกับเรา", privacy: "นโยบายความเป็นส่วนตัว", terms: "ข้อกำหนดการใช้งาน", howToUse: "วิธีใช้งาน",
    copyright: "สร้างด้วยความใส่ใจเพื่อศิลปินทุกคน", footerNote: "สร้างสรรค์ในจังหวะของคุณ", backToStudio: "กลับไปที่สตูดิโอ",
    donate: {
      button: "สนับสนุน", buttonLabel: "สนับสนุนผู้สร้าง", footerLink: "ร่วมสนับสนุนผู้สร้าง", close: "ปิด",
      title: "ร่วมสนับสนุนผู้สร้าง",
      body: [
        "ขอบคุณที่แวะมาใช้ ArtKit Studio นะ เว็บนี้เป็นโปรเจกต์เล็ก ๆ ที่ทำขึ้นเพื่อศิลปินอย่างคุณ",
        "ทุกการสนับสนุนช่วยให้เครื่องมือใช้งานฟรีต่อไปได้ และช่วยค่าโฮสติ้งของเว็บ จะสนับสนุนหรือไม่ก็ได้ทั้งนั้น ได้ใช้งานก็ดีใจแล้ว",
      ],
      cta: "สนับสนุนผ่าน Easy Donate", newTab: "(เปิดในแท็บใหม่)", later: "ไว้คราวหน้า",
      note: "การบริจาคดำเนินการโดย Easy Donate เว็บไซต์นี้ไม่เห็นข้อมูลการชำระเงินของคุณ",
    },
    info: {
      about: { eyebrow: "เรื่องราวของเรา", title: "เพิ่มพื้นที่ให้ความคิดสร้างสรรค์", intro: "ArtKit Studio คือพื้นที่เรียบง่ายไร้สิ่งรบกวน สำหรับกิจวัตรเล็ก ๆ ที่ช่วยให้ศิลปินสร้างผลงาน", sections: [
        { title: "ทำไมเราจึงสร้างที่นี่", body: "เครื่องมือที่ดีควรเปิดพื้นที่ให้ผลงาน ไม่ใช่ขัดขวางการทำงาน สตูดิโอนี้รวมการฝึกวาด การสำรวจสี และการวางแผนไอเดียไว้ในที่เดียว" },
        { title: "ออกแบบอย่างตั้งใจ", body: "หน้าตาเว็บไซต์ใช้ความต่างของสีที่สบายตา พื้นที่โปร่ง และพื้นหลังสีกลาง เพื่อให้คุณจดจ่อกับสีและความคิดของตัวเอง พร้อมรองรับทั้งภาษาไทยและอังกฤษ" },
        { title: "พร้อมใช้งานแล้ว", body: "เครื่องมือจับเวลาวาด ดึงชุดสีและเช็กค่าน้ำหนัก และสุ่มโจทย์วาดรูป ใช้งานได้แล้วในเบราว์เซอร์ของคุณ" },
      ] },
      privacy: { eyebrow: "ความเป็นส่วนตัวของคุณ", title: "พื้นที่สร้างสรรค์เป็นของคุณ", intro: "ArtKit Studio ออกแบบโดยคำนึงถึงเครื่องมือที่ทำงานในเบราว์เซอร์และการเก็บข้อมูลให้น้อยที่สุด หน้านี้อธิบายรุ่นตัวอย่างปัจจุบัน", sections: [
        { title: "ข้อมูลที่เว็บไซต์จัดเก็บ", body: "การตั้งค่าภาษาและธีมจะบันทึกใน localStorage ของเบราว์เซอร์คุณ คุณลบข้อมูลนี้ได้ทุกเมื่อผ่านการตั้งค่าเบราว์เซอร์" },
        { title: "ผลงานของคุณ", body: "เครื่องมือเช็กสีและการ์ดแชร์อ่านรูปภายในเบราว์เซอร์ของคุณเท่านั้น รูปไม่ถูกอัปโหลดไปยังเซิร์ฟเวอร์ของเรา และจะหายไปเมื่อคุณปิดหรือรีเฟรชหน้า หากเลือกแชร์ โพสต์จะเกิดบน X, Facebook หรือ Instagram ตามนโยบายความเป็นส่วนตัวของแต่ละแพลตฟอร์ม" },
        { title: "โฆษณาและบุคคลภายนอก", body: "เว็บไซต์นี้อาจแสดงโฆษณาผ่าน Google AdSense เมื่อเปิดใช้โฆษณา Google อาจใช้คุกกี้หรือเทคโนโลยีใกล้เคียงเพื่อแสดงและวัดผลโฆษณา ตามนโยบายความเป็นส่วนตัวของ Google หากปิดโฆษณา พื้นที่โฆษณาจะว่างเปล่า โปรดเพิ่มแบนเนอร์ขอความยินยอมคุกกี้หากแสดงโฆษณาให้ผู้เข้าชมในภูมิภาคที่กฎหมายกำหนด" },
        { title: "รูปอ้างอิง", body: "หากเลือกรูปจาก Pexels ในเครื่องมือจับเวลา เบราว์เซอร์ของคุณจะโหลดรูปจาก Pexels ซึ่งอาจเห็นที่อยู่ IP ของคุณตามนโยบายความเป็นส่วนตัวของ Pexels ส่วนรูปที่เลือกจากเครื่องของคุณจะไม่ออกจากเบราว์เซอร์" },
        ...(donateEnabled ? [{ title: "การบริจาค", body: "หากคุณเลือกสนับสนุน ระบบจะพาไปยัง Easy Donate ซึ่งดำเนินการชำระเงินตามข้อกำหนดและนโยบายความเป็นส่วนตัวของ Easy Donate เอง เว็บไซต์นี้ไม่เก็บรวบรวมหรือจัดเก็บข้อมูลการชำระเงินใด ๆ" }] : []),
        { title: "ข้อสงสัย", body: "นี่คือโครงการรุ่นตัวอย่าง ยังไม่มีบัญชีผู้ใช้ แบบฟอร์มติดต่อ หรือบริการเก็บข้อมูลส่วนบุคคล" },
      ] },
      terms: { eyebrow: "รายละเอียด", title: "ข้อกำหนดที่เรียบง่ายและชัดเจน", intro: "การใช้งาน ArtKit Studio รุ่นตัวอย่างนี้ถือว่าคุณยอมรับข้อกำหนดพื้นฐานต่อไปนี้", sections: [
        { title: "การใช้งานเว็บไซต์", body: "คุณสามารถใช้เครื่องมือเพื่องานสร้างสรรค์ส่วนตัวหรือเชิงอาชีพโดยชอบด้วยกฎหมาย" },
        { title: "เนื้อหาของคุณ", body: "คุณยังคงเป็นเจ้าของผลงานที่สร้างขึ้น รูปที่เปิดในเครื่องมือเช็กสีจะอยู่ในเบราว์เซอร์ของคุณ เราไม่ได้รับหรือจัดเก็บรูปนั้น" },
        { title: "ความพร้อมให้บริการ", body: "เว็บไซต์ให้บริการตามสภาพและอาจเปลี่ยนแปลงหรือหยุดให้บริการโดยไม่แจ้งล่วงหน้า ไม่ควรใช้กับงานที่มีข้อจำกัดด้านเวลาอย่างเข้มงวด" },
      ] },
      "how-to-use": { eyebrow: "เริ่มต้นใช้งาน", title: "ยินดีต้อนรับสู่พื้นที่ของคุณ", intro: "คู่มือสั้น ๆ สำหรับสำรวจ ArtKit Studio รุ่นตัวอย่าง", sections: [
        { title: "เลือกพื้นที่ทำงาน", body: "เลือกฝึกวาดจับเวลา ดึงคู่สีและเช็กค่าน้ำหนักแสงเงา หรือสุ่มโจทย์วาดรูปและแชร์ผลงาน ผ่านเมนูด้านบนหรือรายการเครื่องมือข้างพื้นที่ทำงาน" },
        { title: "ปรับให้เป็นแบบของคุณ", body: "ใช้ปุ่ม EN / TH เพื่อเปลี่ยนภาษาได้ทันที และปุ่มรูปดวงอาทิตย์หรือดวงจันทร์เพื่อสลับโหมดสว่างกับโหมดมืด เบราว์เซอร์นี้จะจดจำการตั้งค่าของคุณ" },
        { title: "สิ่งที่ใช้ได้ตอนนี้", body: "ใช้จับเวลาฝึกวาด ใส่รูปเพื่อดูสีและค่าน้ำหนัก สุ่มโจทย์วาดรูปแล้วแชร์ผลงานที่วาดเสร็จ ปุ่มลัดแสดงอยู่ใต้แต่ละเครื่องมือ" },
        { title: "งานของคุณเป็นส่วนตัว", body: "เครื่องมือทำงานในเบราว์เซอร์ทั้งหมด ผลงานจึงอยู่บนอุปกรณ์ของคุณแทนที่จะอัปโหลดไปยังเซิร์ฟเวอร์" },
      ] },
    },
  },
} as const;

export function getCopy(language: Language) { return translations[language]; }