# Vieraskirja (Guestbook)

Tämä on moderni Fullstack-sovellus, joka on rakennettu käyttäen **T3 Stackia**. Sovellus toimii vieraskirjana, johon käyttäjät voivat jättää nimensä ja viestinsä. Viestit tallentuvat tietokantaan ja näkyvät reaaliaikaisesti listalla.

## ✨ Ominaisuudet

✅ **Toteutettu:**
- **Lomakkeen validointi & virheidenkäsittely** - Asiakaspuolen validointi Zodilla, reaaliaikainen virhepalaute, merkkimäärälaskuri ja saavutettavuusominaisuudet
- **Sivutus** - Infinite scroll cursor-pohjaisella sivutuksella, "Lataa lisää" -painike ja sulava latausanimaatio
- **Tuotantotietokanta** - PostgreSQL-tuki täydellisellä migraatiotyökalulla
- **Moderni UI/UX** - Gradienttitaustat, sulavia animaatioita, responsiivinen suunnittelu ja suomen kielen tuki
- **Tyyppiturvallinen** - End-to-end tyyppiturvallinen tRPC:n ja TypeScriptin kanssa
- **Sähköposti-ilmoitukset** - Automaattiset sähköposti-ilmoitukset uusista vieraskirjamerkinnöistä (valinnainen, käyttää Resendiä)
- **Moderointi/Admin-paneeli** - Sisällön moderointijärjestelmä hallintapaneelilla viestien tarkistamiseen ja hyväksymiseen/hylkäämiseen
- **Käyttäjä-avatarit** - Automaattisesti generoidut käyttäjä-avatarit DiceBear-palvelun kautta
- **Hakutoiminto** - Viestien hakeminen nimen perusteella
- **Tumma tila** - Vaihdettava tumma/vaalea teema

## 🛠 Teknologiat (The T3 Stack)

-   **Framework:** [Next.js](https://nextjs.org) 15.2.3 (App Router)
-   **Kieli:** [TypeScript](https://www.typescriptlang.org) 5.8.2
-   **Tyylittely:** [Tailwind CSS](https://tailwindcss.com) 4.0.15
-   **API:** [tRPC](https://trpc.io) 11.0.0 (End-to-end tyyppiturvallisuus)
-   **Tietokanta & ORM:** [Prisma](https://prisma.io) 6.6.0
-   **Validointi:** [Zod](https://zod.dev) 3.24.2
-   **Tilanhallinnan:** [TanStack React Query](https://tanstack.com/query) 5.69.0
-   **Sähköposti:** [Resend](https://resend.com) (Valinnainen)

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
# Tietokanta (pakollinen)
# PostgreSQL (suositus tuotantoon):
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Tai SQLite (kehitykseen):
# DATABASE_URL="file:./db.sqlite"

# Sähköposti-ilmoitukset (valinnainen)
# Luo ilmainen tili osoitteessa https://resend.com
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
EMAIL_TO="sinun-sahkoposti@example.com"

# Admin-paneelin salasana (valinnainen, oletus: "admin123")
# HUOM: Aseta vahva salasana tuotantoon!
NEXT_PUBLIC_ADMIN_KEY="turvallinen-admin-salasana"

```

**Huomioita:**
- Jos et aseta `RESEND_API_KEY` -muuttujaa, sovellus toimii normaalisti, mutta ei lähetä sähköposti-ilmoituksia
- Jos et aseta `NEXT_PUBLIC_ADMIN_KEY` -muuttujaa, admin-paneeli käyttää oletussalasanaa "admin123" (vain kehitykseen!)
- Tuotantoon suositellaan PostgreSQL-tietokantaa (esim. [Vercel Postgres](https://vercel.com/storage/postgres) tai [Neon](https://neon.tech))

### 4. Tietokannan alustus

Aja Prisman komento luodaksesi tietokantataulut:

```bash
npx prisma db push

```

*Tämä luo `Post`-taulun tietokantaan, joka sisältää kentät: id, name, message, avatarSeed, moderationStatus, createdAt, updatedAt.*

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

## 🔧 Käytettävissä olevat skriptit

- `npm run dev` - Käynnistä kehityspalvelin Turbo-tilassa
- `npm run build` - Rakenna tuotantoversiota varten
- `npm run start` - Käynnistä tuotantopalvelin
- `npm run lint` - Suorita ESLint
- `npm run lint:fix` - Korjaa linttausvirheet automaattisesti
- `npm run typecheck` - Suorita TypeScript-tyyppitarkistus
- `npm run check` - Suorita sekä lint että typecheck
- `npm run format:check` - Tarkista koodin muotoilu
- `npm run format:write` - Muotoile koodi Prettierillä
- `npm run db:push` - Vie skeemamuutokset tietokantaan
- `npm run db:studio` - Avaa Prisma Studio (tietokannan GUI)
- `npm run db:generate` - Generoi migraatiot
- `npm run db:migrate` - Suorita migraatiot

## 🛡️ Admin-paneeli

Sovellus sisältää sisällön moderointijärjestelmän admin-paneelin kautta.

**Käyttö:**
1. Siirry osoitteeseen `/admin` selaimessasi
2. Syötä admin-salasana (oletus: "admin123" kehityksessä)
3. Tarkista ja moderoi viestejä

**Ominaisuudet:**
- Tarkastele kaikkia viestejä (odottavat, hyväksytyt, hylätyt)
- Hyväksy tai hylkää viestejä
- Suodata viestejä tilan mukaan
- Näe moderointitilastot

**Huom:** Tuotannossa aseta vahva `NEXT_PUBLIC_ADMIN_KEY` ympäristömuuttuja!

## 🗂 Projektin rakenne

* `src/app` - Frontend-sivut ja komponentit (Next.js App Router)
* `src/app/admin` - Admin-paneeli moderointia varten
* `src/app/_components` - Jaetut komponentit (esim. `post.tsx`)
* `src/server/api/routers` - Backend-logiikka ja tRPC-routerit (esim. `post.ts`)
* `src/server/db.ts` - Prisman tietokantayhteys
* `src/server/email.ts` - Sähköposti-ilmoitusten apufunktiot
* `prisma/schema.prisma` - Tietokannan skeema ja mallit
* `src/trpc` - tRPC-konfiguraatio ja React Query -integraatio

## 🧪 Testaus

Projekti sisältää valmiudet testaukseen:

* Linttaus: `npm run lint`
* Tyyppitarkistus: `npm run typecheck`
* Koodin laadun tarkistus: `npm run check`

## 📚 Lisätietoa

Katso yksityiskohtainen tekninen dokumentaatio tiedostosta `CLAUDE.md`.

---

