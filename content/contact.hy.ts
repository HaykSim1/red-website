import type { ContactDocument } from "@/content/types";

export const contactHy: ContactDocument = {
  metaTitle: "Կապ — Red Auto",
  metaDescription: "Ինչպես կապվել Red Auto-ի աջակցության հետ։",
  pageTitle: "Կապ",
  intro:
    "Լրացրեք ձևը՝ մենք կստանանք ձեր հաղորդագրությունը info@red-auto.store հասցեին։ Կարող եք նաև ուղղակի գրել էլ. փոստով։",
  emailLabel: "Էլ. փոստ (ուղղակի)",
  form: {
    sectionTitle: "Գրել մեզ",
    nameLabel: "Անուն",
    phoneLabel: "Հեռախոս",
    emailLabel: "Էլ. փոստ",
    messageLabel: "Հաղորդագրություն",
    submit: "Ուղարկել",
    sending: "Ուղարկվում է…",
    success: "Շնորհակալություն։ Ձեր հաղորդագրությունն ուղարկված է։",
    errorGeneric: "Չհաջողվեց ուղարկել։ Փորձեք կրկին կամ գրեք info@red-auto.store։",
    errorNotConfigured: "Սերվերը դեռ չի կարգավորէլ փոստի ուղարկման համար։ Կապվեք ադմինիստրատորի հետ։",
    rateLimited: "Չափազանց շատ հարցումներ։ Փորձեք ավելի ուշ։",
    val: {
      nameMin: "Անունը պետք է լինի առնվազն 2 նիշ։",
      nameMax: "Անունը չափազանց երկար է։",
      phoneMin: "Հեռախոսը պետք է լինի առնվազն 6 նիշ։",
      phoneMax: "Հեռախոսը չափազանց երկար է։",
      phoneInvalid: "Մուտքագրեք վավեր հեռախոսահամար (թվեր, +, բացատ, վանդակներ)։",
      emailInvalid: "Մուտքագրեք վավեր էլ. փոստ։",
      emailMax: "Էլ. փոստը չափազանց երկար է։",
      messageMin: "Հաղորդագրությունը պետք է լինի առնվազն 10 նիշ։",
      messageMax: "Հաղորդագրությունը չափազանց երկար է։",
      localeInvalid: "Անվավեր լեզու։",
    },
  },
};
