import type { MarketingContent } from "@/content/types";

export const marketingRu: MarketingContent = {
  metaTitle: "Red Auto — площадка автозапчастей",
  metaDescription:
    "Рынок автозапчастей в Армении. Создайте запрос, получайте структурированные предложения от продавцов и связывайтесь напрямую.",
  nav: {
    home: "Главная",
    privacy: "Конфиденциальность",
    terms: "Условия",
    faq: "Вопросы",
    trust: "Доверие",
    howItWorks: "Как это работает",
    forBuyers: "Для покупателей",
    forSellers: "Для продавцов",
    contactUs: "Связаться",
  },
  langSwitcher: { hy: "Հայ", en: "EN", ru: "RU" },
  heroTitle: "Запросите деталь. Выберите предложение.",
  heroSubtitle:
    "Эффективная площадка автозапчастей в Армении. Мы соединяем покупателей с прямыми продавцами для точных автомобильных закупок.",
  heroCtaHowItWorks: "Как это работает",
  heroCtaDownload: "Скачать приложение",
  features: [
    {
      title: "Для Армении",
      body: "Разработан специально для местного рынка, обеспечивая доступ к нужным запчастям там, где вы находитесь.",
    },
    {
      title: "Структурированные предложения",
      body: "Получайте прозрачные цены и детальные отчёты о состоянии (новый, б/у, восстановленный) по каждому запросу.",
    },
    {
      title: "Прямые сделки",
      body: "Никаких посреднических сборов. Связывайтесь напрямую с продавцами для оплаты и доставки.",
    },
  ],
  howItWorks: {
    title: "Простой рабочий процесс",
    steps: [
      {
        title: "Создайте запрос",
        body: "Опишите что нужно. VIN, название детали или фотографии.",
      },
      {
        title: "Получите предложения",
        body: "Местные продавцы откликаются на ваш запрос в течение минут.",
      },
      {
        title: "Сравните",
        body: "Оценивайте по цене, состоянию и рейтингу продавца.",
      },
      {
        title: "Свяжитесь",
        body: "Напишите продавцу и закройте сделку вне приложения.",
      },
    ],
  },
  audiences: {
    title: "Для кого Red Auto",
    buyersTitle: "Для покупателей",
    buyersSubtitle:
      "Хватит обзванивать всех подряд. Один запрос охватывает десятки специализированных продавцов запчастей по всей Армении.",
    buyersBullets: [
      "Экономьте часы поиска",
      "Доступ к скрытым запасам",
      "Проверенная история продавцов",
    ],
    sellersTitle: "Для продавцов",
    sellersSubtitle:
      "Получайте качественные лиды прямо на телефон. Превратите простаивающий запас в доход без дорогой рекламы.",
    sellersBullets: [
      "Ежедневные целевые запросы",
      "Прямое общение с покупателями",
      "Таргетинг по конкретному инвентарю",
    ],
  },
  homeFaqTeaser: {
    title: "Остались вопросы?",
    body: "Изучите наш подробный гид о том, как мы обрабатываем запросы и проверяем продавцов.",
    cta: "Все вопросы",
  },
  disclaimerLine:
    "Оплата и доставка проходят вне приложения.",
  screenshotsSectionTitle: "Точность в вашем кармане",
  screenshotsEmpty: "Скриншоты будут добавлены позже.",
  screenshots: [
    {
      src: "/screenshots/home.jpg",
      title: "Главная",
      alt: "Главный экран приложения Red Auto",
    },
    {
      src: "/screenshots/requests.jpg",
      title: "Запросы",
      alt: "Список запросов на запчасти",
    },
    {
      src: "/screenshots/market.jpg",
      title: "Рынок",
      alt: "Лента открытых запросов для продавцов",
    },
  ],
  downloadSectionTitle: "Скачать приложение",
  downloadAppStore: "App Store",
  downloadGooglePlay: "Google Play",
  downloadAppStoreBadgeAlt: "Скачать в App Store",
  downloadGooglePlayBadgeAlt: "Доступно в Google Play",
  downloadSoon: "Ссылки появятся после публикации в магазинах.",
  footerTagline: "© 2024 Red Auto. Высокоточные автомобильные закупки для Армении.",
  footerRights: "© Red Auto. Все права защищены.",
  footerFollowUs: "Мы в соцсетях",
  footerResourcesLabel: "Ресурсы",
  footerHelpLabel: "Помощь",
  contactSection: {
    title: "Связаться с нами",
    introLeft: "Заполните форму — сообщение будет отправлено на info@red-auto.store.",
    infoTitle: "Реквизиты",
    phoneLabel: "Телефон",
    emailLabel: "Эл. почта",
    addressLabel: "Адрес",
    phone: "+374 10 00 00 00", // TODO: replace with real phone number
    address: "Ереван, Армения",
    supportTitle: "Служба поддержки",
    businessTitle: "Деловые запросы",
    businessSubtitle: "Партнёрство и продавцы",
    businessEmail: "partners@redauto.am",
    officeHoursTitle: "Часы работы",
    officeHoursMF: "Понедельник - пятница: 10:00 - 19:00",
    officeHoursSat: "Суббота: 11:00 - 16:00",
  },
};
