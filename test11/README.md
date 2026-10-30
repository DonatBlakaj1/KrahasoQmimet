# Çmimi.ks - Krahasimi i Çmimeve të Supermarketeve në Kosovë

Një platformë moderne, profesionale dhe e përshtatshme për pajisje mobile, tablet dhe kompjuterë, e krijuar për krahasimin e çmimeve të artikujve ushqimorë ndërmjet supermarketeve kryesore në Kosovë.

---

## 🚀 Teknologjitë e Përdorura

- **React 19** me **Vite** dhe **TypeScript**
- **Tailwind CSS v4** për dizajn modern, të shpejtë dhe të pastër
- **Lucide React** për ikona intuitive
- **HTML5 & Vanilla CSS** për semantikë dhe performancë maksimale
- **LocalStorage API** për ruajtjen e të dhënave dhe sinkronizimin në kohë reale

---

## ✨ Funksionalitetet Kryesore

1. **Ballina (Homepage):**
   - Shirit kërkimi me sugjerime të shpejta (p.sh. *Qumësht Vita, Floil, Miell Finnesa, Vezë Konsumi, Devolli Prince*).
   - Departamente dhe kategori kryesore me numërues artikujsh.
   - Seksioni i zbritjeve dhe ofertave të ditës.
   - Produktet më të kërkuara me theksim të çmimit më të ulët.
   - Rrjetet e supermarketeve partnere me lidhje të drejtpërdrejta.

2. **Katalogu i Produkteve (Catalog):**
   - Kërkim i menjëhershëm me emër, markë dhe barkod.
   - Filtrim sipas kategorisë, supermarketit, çmimit maksimal dhe vetëm artikujve me zbritje.
   - Renditje sipas: Çmimi më i ulët, Çmimi më i lartë, Kursimi më i madh, Emri A-Z.
   - Kalim ndërmjet pamjes në rrjetë (Grid) dhe pamjes në listë (List).

3. **Tabela e Krahasimit (Comparison):**
   - Krahasim direkt i deri në 4 artikujve krah për krah.
   - Matrica e plotë e të gjitha produkteve sipas 6 supermarketeve (*Viva Fresh Store, ETC, Super Viva, Interex, Meridian Express, Maxi Market*).
   - Theksim i qartë i çmimit më të lirë me simbol dallues dhe llogaritje e diferencës së çmimit.

4. **Lista e Blerjeve & Llogaritësi i Kursimeve (Shopping List):**
   - Shtim artikujsh me menaxhim sasie.
   - **Llogaritja e faturës totale për çdo supermarket veç e veç** (p.sh. Viva Fresh: €18.40 vs ETC: €17.60).
   - **Shporta Inteligjente e Optimizuar:** llogarit faturën minimale nëse blini çdo artikull në dyqanin më të lirë, duke treguar përqindjen e kursimit (deri në 28%).
   - Mundësi dërgimi të listës në **WhatsApp / Mesazh** me tekst të formatuar gati për blerje.
   - Opsion për printim të pastër të listës.

5. **Drejtoria e Supermarketeve (Supermarket Directory):**
   - Profile të detajuara për 6 rrjetet e mëdha në Kosovë.
   - Numri i pikave të shitjes, qytetet ku operojnë, numri i kujdesit ndaj klientit dhe faqja zyrtare.
   - Shfletimi i katalogut të artikujve me çmimet specifike për atë supermarket.

6. **Detajet e Produktit (Product Detail Modal):**
   - Kartelë e pasur me foto me rezolucion të lartë, barkod, paketim dhe përshkrim.
   - Radhitje e të gjitha çmimeve nga më i ulëti tek më i larti.
   - Shënimi i datës së përditësimit dhe statusit të zbritjes.

7. **Paneli Administrativ (Admin Dashboard):**
   - Menaxhimi i artikujve (shtim, modifikim, fshirje).
   - Menaxhimi i supermarketeve.
   - Regjistrimi dhe përditësimi i çmimeve me opsion për zbritje.
   - Butoni **Rivendos Të Dhënat Fillestare** për demonstrim dhe testim të shpejtë.

8. **Transparenca dhe Vërejtja Orientuese:**
   - Shirit informues i qartë që shpjegon natyrën demonstrative të të dhënave orientuese.

---

## 🛠️ Udhëzime për Ekzekutim Lokal

### 1. Kërkesat paraprake
Sigurohuni që keni të instaluar **Node.js** (versioni 18 ose më i ri).

### 2. Instalimi i varësive
```bash
npm install
```

### 3. Nisja e serverit lokal për zhvillim
```bash
npm run dev
```
Hapni shfletuesin në adresën: [http://localhost:5173/](http://localhost:5173/)

### 4. Ndërtimi për prodhim (Production Build)
```bash
npm run build
```

### 5. Shikimi paraprak i ndërtimit të prodhimit
```bash
npm run preview
```

### 6. Kontrolli i kodit (Linting)
```bash
npm run lint
```
