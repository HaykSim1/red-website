import type { ContactDocument } from "@/content/types";

export const contactRu: ContactDocument = {
  metaTitle: "Контакты — Red Auto",
  metaDescription: "Как связаться с поддержкой Red Auto.",
  pageTitle: "Контакты",
  intro:
    "Заполните форму — мы доставим сообщение на info@red-auto.store. Также можно написать напрямую на почту.",
  emailLabel: "Электронная почта (напрямую)",
  form: {
    sectionTitle: "Написать нам",
    nameLabel: "Имя",
    phoneLabel: "Телефон",
    emailLabel: "Эл. почта",
    messageLabel: "Сообщение",
    submit: "Отправить",
    sending: "Отправка…",
    success: "Спасибо. Ваше сообщение отправлено.",
    errorGeneric: "Не удалось отправить. Попробуйте снова или напишите на info@red-auto.store.",
    errorNotConfigured: "На сервере не настроена отправка почты. Обратитесь к администратору сайта.",
    rateLimited: "Слишком много запросов. Попробуйте позже.",
    val: {
      nameMin: "Имя должно быть не короче 2 символов.",
      nameMax: "Имя слишком длинное.",
      phoneMin: "Телефон должен быть не короче 6 символов.",
      phoneMax: "Телефон слишком длинный.",
      phoneInvalid: "Введите корректный телефон (цифры, +, пробелы, скобки).",
      emailInvalid: "Введите корректный адрес эл. почты.",
      emailMax: "Адрес слишком длинный.",
      messageMin: "Сообщение должно быть не короче 10 символов.",
      messageMax: "Сообщение слишком длинное.",
      localeInvalid: "Некорректный язык.",
    },
  },
};
