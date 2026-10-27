import fs from "node:fs";

// Structured data for search engines, built from site.json so it stays in sync.
const site = JSON.parse(fs.readFileSync(new URL("./site.json", import.meta.url)));

export default {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${site.url}/#practice`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/2024/08/meaningful_psychiatry_logo_sq.webp`,
  image: `${site.url}/images/2025/12/DR_Badeea_Qureshi.webp`,
  telephone: "+1-425-272-5931",
  email: site.email,
  medicalSpecialty: "Psychiatric",
  description: "Online psychiatry for children, teens, and adults across Washington State. Medication management and psychotherapy by telehealth.",
  isAcceptingNewPatients: true,
  // Washington-wide telehealth, with the Eastside cities we most often serve named explicitly.
  areaServed: [
    { "@type": "State", name: "Washington", sameAs: "https://en.wikipedia.org/wiki/Washington_(state)" },
    ...["Bellevue", "Kirkland", "Issaquah", "Mercer Island", "Newcastle", "Renton"].map((name) => ({
      "@type": "City",
      name,
      sameAs: `https://en.wikipedia.org/wiki/${name.replace(/ /g, "_")},_Washington`,
    })),
  ],
  availableService: [
    { "@type": "MedicalTherapy", name: "Medication management" },
    { "@type": "MedicalTherapy", name: "Psychotherapy" },
  ],
  sameAs: [site.social.facebook, site.social.instagram, site.profiles.psychologyToday, site.profiles.webmd],
  employee: [
    { "@type": "Physician", name: "Badeea Qureshi, MD", medicalSpecialty: "Psychiatric", sameAs: [site.profiles.psychologyToday, site.profiles.webmd] },
    { "@type": "Person", name: "Francis Agbotse, PMHNP", jobTitle: "Psychiatric Mental Health Nurse Practitioner", hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: site.credentials.agbotseLicense } },
  ],
};
