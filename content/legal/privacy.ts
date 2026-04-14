import type { LegalDocument } from "@/content/types";

export const privacyHy: LegalDocument = {
  metaTitle: "Գաղտնիության քաղաքականություն — Red Auto",
  metaDescription: "Ինչ տվյալներ է հավաքում Red Auto հավելվածը և ինչպես ենք օգտագործում դրանք։",
  pageTitle: "Գաղտնիության քաղաքականություն",
  lastUpdated: "2026-04-14",
  sections: [
    {
      heading: "Ընդհանուր",
      paragraphs: [
        "Այս փաստաթուղթը նկարագրում է, թե ինչ տեղեկություններ կարող է մշակել Red Auto շարժական հավելվածը (այսուհետ՝ «Հավելված»)։ Տեքստը նախատեսված է որպես նախնական նախագծային տարբերակ. նախքան հրապարակումը խորհուրդ է տրվում իրավաբանական վերանայում։",
        "Հավելվածը կապում է գնորդներին և վաճառողներին ավտոպահեստամասերի պահանջների շուրջ։ Մենք չենք մշակում վճարումներ և չենք կազմակերպում առաքում հավելվածի միջոցով։",
      ],
    },
    {
      heading: "Որ տվյալներն ենք հավաքում",
      paragraphs: [
        "Հաշվի տվյալներ. հեռախոսահամար, OTP-ով հաստատում, JWT սեսիայի տokens հավելվածում։",
        "Պրոֆիլ և խանութ. անուն, հասցե, հեռախոս, պատկերանշան (եթե կա), վաճառողի դիմումի դաշտեր։",
        "Պահանջներ և առաջարկներ. տեքստ, լուսանկարներ, մասի համարներ, ընտրված մեքենայի տվյալներ (ներառյալ VIN, եթե մուտքագրեք)։",
        "Ծանուցումներ. սարքի push token (եթե միացնեք ծանուցումները)։",
        "Տեխնիկական տեղեկություններ. API հարցումներ, սխալների լոգեր (ըստ ձեր backend կարգավորումների)։",
      ],
    },
    {
      heading: "Ինչու ենք օգտագործում",
      paragraphs: [
        "Հաշվի ստեղծում և մուտք, պահանջների/առաջարկների ցուցադրում, վաճառողի հաստատում, ադմինիստրացիա և անվտանգություն։",
        "Ձեր կողմից ընտրած լեզվով UI ցուցադրում։",
      ],
    },
    {
      heading: "Պահպանում և փոխանցում",
      paragraphs: [
        "Տվյալները պահվում են ձեր Red Auto backend-ի և տվյալների բազայի կարգավորումներին համապատասխան (օր. PostgreSQL, օբյեկտային պահեստ լուսանկարների համար)։",
        "Մենք չենք վաճառում անձնական տվյալները երրորդ անձանց «գովազդային բրոքերների»։ Երրորդ ծառայություններ (SMS, push, հոսթինգ) կարող են մշակել տվյալներ ձեր պայմանագրերի շրջանակներում։",
      ],
    },
    {
      heading: "Ձեր իրավունքները",
      paragraphs: [
        "Կարող եք խնդրել ուղղել, թարմացնել կամ ջնջել հաշվի հետ կապված տեղեկությունները, եթե դա համապատասխանում է ձեր իրավական ռեժիմին և backend-ի հնարավորություններին։",
      ],
    },
    {
      heading: "Կապ",
      paragraphs: [
        "Թարմացրեք այս բաժինը աջակցման էլ. փոստով կամ կայքի URL-ով։",
      ],
    },
  ],
};

export const privacyEn: LegalDocument = {
  metaTitle: "Privacy Policy — Red Auto",
  metaDescription:
    "What data the Red Auto mobile app may process and how it is used (draft for review).",
  pageTitle: "Privacy Policy",
  lastUpdated: "2026-04-14",
  sections: [
    {
      heading: "Overview",
      paragraphs: [
        "This page describes information that the Red Auto mobile application (“App”) may process. This text is a draft for product/legal review before publication.",
        "Red Auto connects buyers and sellers around auto part requests. The platform does not process in-app payments or arrange shipping.",
      ],
    },
    {
      heading: "Data we may collect",
      paragraphs: [
        "Account data: phone number, OTP verification, session tokens stored on the device.",
        "Profile and shop: name, address, phone, optional logo, seller application fields.",
        "Requests and offers: text, photos, part numbers, vehicle context (including VIN if you enter it).",
        "Notifications: device push token if you enable notifications.",
        "Technical data: API traffic and error logs as configured on your backend and hosting.",
      ],
    },
    {
      heading: "Why we use it",
      paragraphs: [
        "To authenticate users, show requests and offers, operate seller approval and moderation, and keep the service secure.",
        "To display the UI in the language you select in the app.",
      ],
    },
    {
      heading: "Storage and processors",
      paragraphs: [
        "Data is stored according to your Red Auto API configuration (for example PostgreSQL and object storage for photos).",
        "We do not sell personal data to data brokers. Third-party providers (SMS, push delivery, hosting) may process data under their own terms where you integrate them.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You may request access, correction, or deletion of account-related information where supported by your jurisdiction and backend capabilities.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: ["Replace this section with a support email or web contact URL."],
    },
  ],
};

export const privacyRu: LegalDocument = {
  metaTitle: "Политика конфиденциальности — Red Auto",
  metaDescription:
    "Какие данные может обрабатывать мобильное приложение Red Auto и как они используются (черновик).",
  pageTitle: "Политика конфиденциальности",
  lastUpdated: "2026-04-14",
  sections: [
    {
      heading: "Общие положения",
      paragraphs: [
        "Этот документ описывает информацию, которую может обрабатывать мобильное приложение Red Auto («Приложение»). Текст является проектом и должен быть проверен юристом перед публикацией.",
        "Red Auto соединяет покупателей и продавцов вокруг запросов на автозапчасти. Платформа не проводит оплату внутри приложения и не организует доставку.",
      ],
    },
    {
      heading: "Какие данные мы можем собирать",
      paragraphs: [
        "Данные аккаунта: номер телефона, подтверждение по OTP, токены сессии на устройстве.",
        "Профиль и магазин: имя, адрес, телефон, логотип (если есть), поля заявки продавца.",
        "Запросы и предложения: текст, фото, номера деталей, данные автомобиля (включая VIN, если вы его вводите).",
        "Уведомления: push-токен устройства, если вы включили уведомления.",
        "Технические данные: API-трафик и журналы ошибок в соответствии с настройками backend и хостинга.",
      ],
    },
    {
      heading: "Зачем мы используем данные",
      paragraphs: [
        "Чтобы аутентифицировать пользователей, показывать запросы и предложения, проводить модерацию и одобрение продавцов, а также обеспечивать безопасность сервиса.",
        "Чтобы показывать интерфейс на языке, выбранном в приложении.",
      ],
    },
    {
      heading: "Хранение и передача",
      paragraphs: [
        "Данные хранятся в соответствии с конфигурацией вашего API Red Auto (например PostgreSQL и объектное хранилище для фото).",
        "Мы не продаём персональные данные брокерам. Сторонние сервисы (SMS, push, хостинг) могут обрабатывать данные по своим условиям, если вы их подключаете.",
      ],
    },
    {
      heading: "Ваши права",
      paragraphs: [
        "Вы можете запросить доступ, исправление или удаление информации, связанной с аккаунтом, если это предусмотрено применимым правом и возможностями backend.",
      ],
    },
    {
      heading: "Контакты",
      paragraphs: [
        "Замените этот раздел на email поддержки или URL контактной формы.",
      ],
    },
  ],
};
