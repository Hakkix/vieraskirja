# Vieraskirja (Guestbook)

Tämä on moderni Fullstack-sovellus, joka on rakennettu käyttäen **T3 Stackia**. Sovellus toimii vieraskirjana, johon käyttäjät voivat jättää nimensä ja viestin. Viestit tallentuvat tietokantaan ja näkyvät reaaliaikaisesti listalla.

## 🛠 Teknologiat (The T3 Stack)

-   **Framework:** [Next.js](https://nextjs.org) (App Router)
-   **Kieli:** [TypeScript](https://www.typescriptlang.org)
-   **Tyylittely:** [Tailwind CSS](https://tailwindcss.com)
-   **API:** [tRPC](https://trpc.io) (End-to-end tyyppiturvallisuus)
-   **Tietokanta & ORM:** [Prisma](https://prisma.io)
-   **Validointi:** [Zod](https://zod.dev)

## 🚀 Käynnistys (Kehitysympäristö)

Seuraa näitä ohjeita saadaksesi sovelluksen pyörimään omalla koneellasi.

### 1. Esivaatimukset
Varmista, että koneeltasi löytyy **Node.js** (versio 18 tai uudempi) ja **npm**.

### 2. Asennus
Kloonaa repositorio ja asenna riippuvuudet:

```bash
git clone [https://github.com/Hakkix/vieraskirja.git](https://github.com/Hakkix/vieraskirja.git)
cd vieraskirja
npm install

```

### 3. Ympäristömuuttujat (.env)

Luo projektin juureen tiedosto nimeltä `.env`. Voit kopioida pohjan tiedostosta `.env.example`, jos sellainen on, tai luoda uuden:

```bash
# Esimerkki .env tiedostosta
# Jos käytät paikallista SQLiteä (oletus):
DATABASE_URL="file:./db.sqlite"

# Jos käytät Postgresia (esim. Neon/Supabase/Docker):
# DATABASE_URL="postgres://user:password@host:5432/db"

```

### 4. Tietokannan alustus

Aja Prisman komento luodaksesi tietokantataulut:

```bash
npx prisma db push

```

*Tämä luo `GuestbookEntry`-taulun tietokantaan.*

### 5. Käynnistä sovellus

```bash
npm run dev

```

Sovellus aukeaa osoitteeseen [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

---

## 📦 Tuotantoon vienti (Deployment)

### Vaihtoehto A: Vercel (Suositus)

Tämä projekti on optimoitu Verceliä varten.

1. Vie koodi GitHubiin.
2. Kirjaudu [Verceliin](https://vercel.com) ja importtaa projekti.
3. Aseta **Environment Variables** -kohtaan `DATABASE_URL` (osoittaa esim. Neon.tech Postgres-kantaan).
4. Paina **Deploy**.

### Vaihtoehto B: Docker

Projekti tukee Docker-kontitusta. Varmista, että `next.config.js` sisältää `output: "standalone"`.

1. Rakenna image:

```bash
docker build -t vieraskirja .

```

2. Aja kontti (syötä oikea tietokannan URL):

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  vieraskirja

```

---

## 🗂 Projektin rakenne

* `src/app` - Frontend-sivut ja komponentit (Next.js App Router).
* `src/server/api/routers` - Backend-logiikka ja tRPC-routerit (esim. `guestbook.ts`).
* `src/server/db.ts` - Prisman tietokantayhteys.
* `prisma/schema.prisma` - Tietokannan skeema ja mallit.

## 🧪 Testaus

Projekti sisältää valmiudet testaukseen (jos konfiguroitu):

* Linttaus: `npm run lint`
* Tyyppitarkistus: `npx tsc --noEmit`

---

