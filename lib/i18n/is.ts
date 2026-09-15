import type { Dictionary } from "./types";

export const is: Dictionary = {
  nav: {
    about: "Um",
    featuresSafety: "Eiginleikar & Öryggi",
    supportFaq: "Aðstoð & FAQ",
    downloads: "Niðurhal",
    getEarlyAccess: "Fá snemmbúinn aðgang",
    openMenu: "Opna valmynd",
    closeMenu: "Loka valmynd",
    themeToLight: "Skipta yfir í ljóst þema",
    themeToDark: "Skipta yfir í dökkt þema",
  },
  app: {
    name: "SpectRoom",
    tagline: "Öruggt rými fyrir merkingarbær tengsl",
    supportEmail: "spectroom.support@gmail.com",
  },
  hero: {
    badge: "🎁 Ókeypis í beta",
    titleLine1: "Velkomin(n) í",
    titleLine2: "SpectRoom",
    subtitle: "Öruggt, skilningsríkt rými byggt utan um þig",
    description:
      "Tengstu fólki sem metur einstaka sýn þína - á þínum eigin hraða.",
    notice:
      "SpectRoom er í early access og algjörlega ókeypis. Sem snemmkominn meðlimur hjálparðu okkur að byggja betra samfélag!",
    primaryCta: "Byrja",
    secondaryCta: "Hvernig það virkar",
  },
  about: {
    heading: "Um SpectRoom",
    paragraphs: [
      "SpectRoom er stefnumóta- og tengingaapp sem er hugsað sérstaklega fyrir fullorðna á einhverfurófi og breiðara taugafjölbreytilegt samfélag.",
      "Við trúum að allir eigi skilið rými þar sem samskiptastílar eru skildir, skynjunarþarfir virtar og einstaklingseðli fagnað - án dóma, þrýstings eða misskilnings.",
    ],
    sections: [
      {
        title: "SpectRoom leggur áherslu á skýrleika, öryggi og þægindi.",
        body: "Hönnun okkar tekur tillit til einstakra þarfa taugafjölbreytilegra notenda, svo sem minni skynjunarofhleðslu, skipulagðra samskipta, skýrra marka og persónulegra stuðningsstillinga. Hvort sem þú leitar vináttu, stefnumóta eða dýpri tengsla, býður SpectRoom upp á rólegt og styðjandi umhverfi þar sem þú getur tjáð þig á þínum eigin hraða.",
      },
      {
        title: "Markmið okkar er einfalt:",
        body: "Að skapa merkingarbært, inklúsíft rými þar sem taugafjölbreytilegt fólk getur tengst á einlægan hátt - og fundið fyrir öryggi á sama tíma.",
      },
      {
        title:
          "SpectRoom er byggt með virðingu, samkennd og aðgengi í kjarnanum.",
        body: "Þú ert velkomin(n) hingað.",
      },
    ],
    studio: {
      heading: "Um Abashelari Productions",
      paragraphs: [
        "Abashelari Productions er sjálfstætt tækni- og skapandi þróunarstúdíó með aðsetur í Stokkhólmi.",
        "Við sérhæfum okkur í vel hugsuðum stafrænum upplifunum með áherslu á aðgengi, menntun og valdeflingu í daglegu lífi. Verkefni okkar spanna farsímaöpp, gagnvirk verkfæri og efni sem gerir lífið einfaldara, inklúsífara og skemmtilegra fyrir notendur af öllum bakgrunni.",
      ],
      sections: [
        {
          title:
            "Stofnað á ástríðu fyrir nýsköpun og mannmiðaðri hönnun þróar Abashelari Productions vörur sem sameina tæknilegan áreiðanleika og tilfinningagreind.",
          body: "Við trúum á að byggja hugbúnað sem virðir notendur, einfaldar flóknar áskoranir og skapar raunverulegt gildi í lífi fólks.",
        },
        {
          title: "",
          body: "Frá fræðsluleikjum fyrir börn til samfélagsdrifinna vettvanga eins og SpectRoom er markmið okkar að skapa merkingarbærar stafrænar vörur sem hafa jákvæð áhrif - eitt app í einu.",
        },
      ],
      visitLink: "Heimsækja abashelari.com",
    },
  },
  features: {
    heading: "Byggt fyrir traust og raunveruleg tengsl",
    subtitle:
      "Sama upplifun og í SpectRoom-appinu - róleg uppgötvun, þægileg spjall og öryggi sem stendur ekki í vegi.",
    items: [
      {
        title: "Sérsníddu prófílinn þinn",
        subtitle: "Deildu hvernig þú tengist best",
        body: "Bættu við áhugamálum og skynjunarkjörstillingum í prófílinn. Það hjálpar öðrum að sjá hvað skiptir þig máli og hvernig samskipti geta verið auðveld.",
        image: "/assets/carousel-profile.png",
        imageAlt: "SpectRoom skjár til að breyta prófíl",
      },
      {
        title: "Uppgötvaðu tengsl",
        subtitle: "Einföld pörun án þrýstings",
        body: "Skoðaðu allt að 10 prófíla á dag á þínum eigin hraða. Ýttu eða strjúktu til hægri ef þú finnur tengingu, eða slepptu án óþæginda.",
        image: "/assets/carousel-discover.png",
        imageAlt: "SpectRoom uppgötvunarskjár",
      },
      {
        title: "Spjallaðu hvenær sem er",
        subtitle: "Enginn þrýstingur, enginn flýtir",
        body: "Tengstu með beinum skilaboðum og innbyggðum verkfærum sem gera það þægilegt að byrja og stjórna hraða samtala.",
        image: "/assets/carousel-chat.png",
        imageAlt: "SpectRoom spjallskjár",
      },
    ],
    trust: [
      {
        icon: "shield",
        title: "Verndar öryggi þitt",
        body: "Prófílmoderation, tilkynningartól á hverjum prófíl og skilaboðum, og skjótar aðgerðir við brot. Við þolum ekki áreitni, mismunun, hatursorðræðu eða misnotkun.",
      },
      {
        icon: "lock",
        title: "Gögnin þín, stjórnin þín",
        body: "Þú velur hvað þú deilir. Viðkvæmar upplýsingar eru alltaf valfrjálsar. Við seljum aldrei gögnin þín til þriðja aðila.",
      },
      {
        icon: "heart",
        title: "Samskipti & mörk",
        body: "Tengstu á þínum eigin hraða. Lokaðu, tilkynntu eða takmarkaðu hver getur haft samband hvenær sem er - þægindi þín koma fyrst.",
      },
    ],
  },
  privacy: {
    heading: "Persónuvernd & Öryggi",
    intro:
      "Persónuvernd, þægindi og öryggi þitt eru okkar hæstu forgangsatriði. Appið okkar er hannað til að styðja taugafjölbreytilegt fólk á virðingarfullan, öruggan og gagnsæjan hátt. Eftirfarandi meginreglur útskýra hvernig við verndum upplýsingar þínar og hvernig þú getur verið örugg(ur) á vettvanginum.",
    sections: [
      {
        title: "1. Gögnin þín, stjórnin þín",
        paragraphs: [
          "Þú velur hvaða persónulegu upplýsingum þú deilir í prófílnum þínum.",
          "Viðkvæmar upplýsingar - svo sem aðgengisþarfir, stuðningsstig, heilsutengdar upplýsingar eða samskiptakjörstillingar - eru alltaf valfrjálsar.",
          "Þú getur breytt eða fjarlægt upplýsingar þínar hvenær sem er í prófílstillingum.",
          "Þú getur eytt reikningnum þínum hvenær sem er og öll tengd gögn verða fjarlægð varanlega af þjónum okkar innan sanngjarns tíma.",
        ],
      },
      {
        title: "2. Hvernig við notum upplýsingar þínar",
        lead: "Við notum upplýsingarnar sem þú gefur til að:",
        paragraphs: [
          "Búa til prófílinn þinn",
          "Para þig við samhæfa notendur",
          "Bæta upplifun þína í appinu",
          "Viðhalda öruggu og styðjandi samfélagi",
        ],
        closing:
          "Við seljum aldrei gögnin þín til þriðja aðila. Við deilum aðeins gögnum með traustum þjónustuaðilum sem hjálpa okkur að reka appið (t.d. öruggir þjónar, greiningar). Þessir aðilar fylgja ströngum persónuverndar- og öryggisstöðlum.",
      },
      {
        title: "3. Verndun öryggis þíns",
        lead: "Við notum nokkrar aðferðir til að halda þér örugg(um), þar á meðal:",
        paragraphs: [
          "Prófílmoderation og sjálfvirka greiningu á skaðlegri hegðun",
          "Tilkynningartól á hverjum prófíl og skilaboðum",
          "Valfrjálsa reikningsstaðfestingu",
          "Innri yfirferð tilkynninga og skjótar aðgerðir við brot",
        ],
        closing:
          "Við þolum ekki áreitni, mismunun, hatursorðræðu eða misnotkun af neinu tagi.",
      },
      {
        title: "4. Viðkvæmar upplýsingar",
        lead: "Vegna þess að samfélag okkar nær til taugafjölbreytilegra notenda og fólks með aðgengisþarfir geturðu valið að deila persónulegum upplýsingum. Ef þú gerir það, mundu:",
        paragraphs: [
          "Deiling er alltaf valfrjáls",
          "Þú stjórnar hver getur séð viðkvæma hluta prófílsins",
          "Viðkvæmar upplýsingar eru aldrei notaðar í auglýsingar eða seldar til þriðja aðila",
          "Vertu varkár þegar þú deilir persónulegum upplýsingum með öðrum",
        ],
      },
      {
        title: "5. Samskipti & mörk",
        lead: "Eiga alltaf samskipti á þínum eigin hraða og þægindastigi. Við hvetjum til:",
        paragraphs: [
          "Skýrra samskipta",
          "Virðingar fyrir ólíkum samskiptastílum",
          "Þolinmæði og skilnings",
        ],
        closingLead: "Ef einhver lætur þér líða óþægilega geturðu:",
        closingItems: [
          "Lokað á notandann",
          "Tilkynnt prófílinn",
          "Takmarkað hver getur haft samband í stillingum þínum",
        ],
      },
      {
        title: "6. Að hitta í eigin persónu",
        lead: "Ef þú ákveður að hitta einhvern:",
        paragraphs: [
          "Hitta á almennum stað",
          "Segðu vini eða fjölskyldumeðlimi hvert þú ert að fara",
          "Íhugaðu innritunaraðgerð appsins (ef hún er í boði)",
          "Treystu innsæi þínu - ef eitthvað finnst rangt, farðu strax",
        ],
        closing: "Öryggi þitt kemur alltaf fyrst.",
      },
      {
        title: "7. Öryggisráðstafanir",
        lead: "Við notum iðnaðarstaðla til að vernda upplýsingar þínar, þar á meðal:",
        paragraphs: [
          "Dulkóðaða gagnaflutning",
          "Örugga geymslu lykilorða",
          "Kerfi til að greina svik",
          "Stöðuga öryggiseftirlit",
        ],
        closing:
          "Ef gagnavandamál eða öryggismál greinist tilkynnum við þér fljótt og gagnsætt.",
      },
      {
        title: "8. Ábyrgð þín",
        lead: "Við vinnum hörðum höndum að öruggu umhverfi, en þú gegnir líka mikilvægu hlutverki. Vinsamlegast:",
        paragraphs: [
          "Haltu persónulegum upplýsingum (heimilisfang, fjármál, vinnuupplýsingar) einkum",
          "Vertu varkár með að deila myndum eða myndskeiðum",
          "Tilkynntu grunsamlega eða skaðlega hegðun",
        ],
        closing: "Saman getum við viðhaldið virðingarfullu og öruggu samfélagi.",
      },
      {
        title: "9. Samband & stuðningur",
        lead: "Ef þú hefur spurningar um persónuvernd, þarft að tilkynna vandamál eða vilt aðstoð:",
        paragraphs: [
          "Aðstoð í appinu → Hjálp & Öryggi",
          "Eða sendu okkur tölvupóst: spectroom.support@gmail.com",
        ],
        closing: "Við erum hér til að hjálpa og svörum eins fljótt og auðið er.",
      },
    ],
    questionsPrefix: "Spurningar? Sendu tölvupóst",
  },
  steps: {
    heading: "Byrjaðu í fjórum einföldum skrefum",
    items: [
      {
        step: 1,
        title: "Búa til reikning",
        detail: "Netfang & lykilorð",
        image: "/assets/step-signup.png",
        imageAlt: "SpectRoom skráningarskjár",
      },
      {
        step: 2,
        title: "Staðfestu netfangið þitt",
        detail:
          "Staðfestu netfangið áður en við virkjum SMS 2 factor authentication",
        image: "/assets/step-email.png",
        imageAlt: "SpectRoom netfangsstaðfesting",
      },
      {
        step: 3,
        title: "Öryggiskóði",
        detail: "Sláðu inn 6 stafa staðfestingarkóðann sem sendur var í símann þinn",
        image: "/assets/step-sms.png",
        imageAlt: "SpectRoom SMS-öryggiskóði",
      },
      {
        step: 4,
        title: "Byrja",
        detail: "Ljúktu við prófílinn og byrjaðu að tengjast",
        image: "/assets/step-welcome.png",
        imageAlt: "SpectRoom velkominnskjár",
      },
    ],
  },
  faq: {
    heading: "Aðstoð & FAQ",
    subtitle:
      "Svör um staðfestingu, persónuvernd, notkun á SpectRoom og early access.",
    searchLabel: "Leita í FAQ",
    searchPlaceholder: "Leita að spurningum…",
    empty: "Engar samsvarandi spurningar. Prófaðu annað leitarorð.",
    tabs: [
      {
        id: "account",
        label: "Reikningur & Staðfesting",
        items: [
          {
            question: "Af hverju þarf ég að staðfesta bæði netfang og símanúmer?",
            answer:
              "Við staðfestum netfangið fyrst og virkjum síðan SMS 2 factor authentication með 6 stafa kóða. Tvöföld staðfesting hjálpar til að halda reikningum raunverulegum og SpectRoom öruggara fyrir alla.",
          },
          {
            question: "Mun símanúmerið mitt sjást á opinberum prófílnum mínum?",
            answer:
              "Aldrei. Síminn er notaður til öryggis og er aldrei deilt. Netfanginu þínu er heldur aldrei deilt.",
          },
          {
            question:
              "Ég fékk ekki 6 stafa staðfestingarkóðann. Hvað á ég að gera?",
            answer:
              "Athugaðu að númerið innihaldi rétt landsnúmer og ýttu síðan á Senda aftur. Bíddu nokkrar sekúndur áður en þú biður um nýjan kóða - afhending getur tekið stund.",
          },
          {
            question: "Get ég breytt netfangi eða símanúmeri síðar?",
            answer:
              "Já. Þú getur uppfært reikningsupplýsingar í prófílstillingum. Af öryggisástæðum geta sumar breytingar krafist þess að þú staðfestir nýja netfangið eða símanúmerið aftur.",
          },
          {
            question: "Hvernig endurstilli ég lykilorðið mitt?",
            answer:
              "Á innskráningarskjánum velurðu gleymt lykilorð og fylgir skrefunum sem send eru á staðfesta netfangið þitt. Þarftu meiri hjálp? Sendu tölvupóst á spectroom.support@gmail.com.",
          },
          {
            question: "Hvernig eyði ég reikningnum mínum?",
            answer:
              "Þú getur eytt reikningnum þínum hvenær sem er í prófílstillingum. Tengd gögn eru fjarlægð varanlega af þjónum okkar innan sanngjarns tíma.",
          },
        ],
      },
      {
        id: "using",
        label: "Að nota SpectRoom",
        items: [
          {
            question: "Fyrir hvern er SpectRoom?",
            answer:
              "SpectRoom er hugsað sérstaklega fyrir fullorðna á einhverfurófi og breiðara taugafjölbreytilegt samfélag. Allir sem vilja rólegri og skýrari leið til að tengjast - til vináttu, stefnumóta eða dýpri tengsla - eru velkomnir.",
          },
          {
            question: "Hvernig virkar uppgötvun og pörun?",
            answer:
              "Þú getur skoðað allt að 10 prófíla á dag á þínum eigin hraða. Ýttu eða strjúktu til hægri ef þú finnur tengingu, eða slepptu án óþæginda. Pör opna bein skilaboð þegar báðir hafa áhuga.",
          },
          {
            question: "Þarf ég að svara skilaboðum strax?",
            answer:
              "Nei. SpectRoom er byggt fyrir lítinn þrýsting. Spjallaðu þegar það finnst þægilegt - enginn flýtir og engar refsingar fyrir að taka þér tíma.",
          },
          {
            question: "Get ég deilt skynjunarkjörstillingum eða samskiptaþörfum?",
            answer:
              "Já. Þú getur bætt við áhugamálum og skynjunarkjörstillingum í prófílinn svo aðrir skilji hvernig þú tengist best. Viðkvæmar upplýsingar eru alltaf valfrjálsar og þú stjórnar því sem sést.",
          },
          {
            question: "Er SpectRoom aðeins fyrir stefnumót?",
            answer:
              "Nei. Þú getur notað SpectRoom til vináttu, stefnumóta eða dýpri tengsla. Settu ætlun þína skýrt fram á prófílnum svo aðrir viti hvað þú leitar að.",
          },
        ],
      },
      {
        id: "safety",
        label: "Persónuvernd & Öryggi",
        items: [
          {
            question: "Hvernig verndar SpectRoom persónuupplýsingar mínar?",
            answer:
              "Persónuvernd, þægindi og öryggi þitt eru okkar hæstu forgangsatriði. Þú velur hvað þú deilir, viðkvæmar upplýsingar eru alltaf valfrjálsar, og við seljum aldrei gögnin þín til þriðja aðila. Við notum dulkóðaða gagnaflutning, örugga geymslu lykilorða, svikagreiningu og stöðugt öryggiseftirlit.",
          },
          {
            question: "Hvernig tilkynni ég eða loka á notanda?",
            answer:
              "Ef einhver lætur þér líða óþægilega geturðu lokað á notandann, tilkynnt prófílinn eða takmarkað hver getur haft samband í stillingum þínum. Tilkynningartól eru á hverjum prófíl og skilaboðum, og við yfirförum tilkynningar með skjótum aðgerðum við brot.",
          },
          {
            question: "Eru spjöllin mín einkamál?",
            answer:
              "Skilaboð eru milli þín og þess sem þú spjallar við. Við seljum ekki innihald samtala. Við getum yfirfarið tilkynningar eða rannsakað öryggismál þegar þörf er á til að vernda samfélagið.",
          },
          {
            question: "Hvað ætti ég að vita áður en ég hitta einhvern í eigin persónu?",
            answer:
              "Hitta á almennum stað, segðu vini eða fjölskyldumeðlimi hvert þú ert að fara, og treystu innsæi þínu. Ef eitthvað finnst rangt, farðu strax. Öryggi þitt kemur alltaf fyrst.",
          },
          {
            question: "Hvern get ég haft samband við um persónuvernd eða öryggi?",
            answer:
              "Notaðu aðstoð í appinu → Hjálp & Öryggi, eða sendu tölvupóst á spectroom.support@gmail.com. Við erum hér til að hjálpa og svörum eins fljótt og auðið er.",
          },
        ],
      },
      {
        id: "beta",
        label: "Early Access & Aðstoð",
        items: [
          {
            question: "Er SpectRoom ókeypis í early access?",
            answer:
              "Já. SpectRoom er í early access og algjörlega ókeypis. Staðlaðir eiginleikar verða áfram ókeypis, en við gætum kynnt valfrjálsa greidda þjónustu síðar.",
          },
          {
            question: "Hvar get ég sótt SpectRoom?",
            answer:
              "Notaðu Niðurhal-hlutann á þessari síðu fyrir iOS og Android. Verslunartenglar birtast um leið og hver útgáfa er tilbúin.",
          },
          {
            question: "Hvaða vettvangur eru studdir?",
            answer:
              "SpectRoom er í boði á iOS, og Android er að rúlla út. Skoðaðu Niðurhal fyrir nýjustu stöðu.",
          },
          {
            question: "Hvernig deili ég ábendingum eða tilkynni villu?",
            answer:
              "Við fögnum ábendingum frá snemmkomnum meðlimum. Sendu tölvupóst á spectroom.support@gmail.com með villum, hugmyndum eða aðgengisathugasemdum - framlag þitt hjálpar okkur að bæta appið.",
          },
          {
            question: "Hvernig hef ég samband við þjónustuver?",
            answer:
              "Við viljum gjarnan heyra frá þér. Sendu tölvupóst á spectroom.support@gmail.com vegna öryggismála, villa, ábendinga eða reikningshjálpar.",
          },
        ],
      },
    ],
  },
  footer: {
    quickLinksTitle: "Flýtitenglar",
    supportTitle: "Aðstoð & Samband",
    needHelp: "Þarftu hjálp? Sendu tölvupóst",
    privacyPolicy: "Persónuverndarstefna",
    terms: "Notkunarskilmálar",
    guidelines: "Samfélagsreglur",
    safetyCenter: "Öryggismiðstöð",
    copyright: "© 2026 SpectRoom. Öll réttindi áskilin.",
    badge2fa: "Staðfest 2 factor authentication",
    badgePrivacy: "End-to-end persónuvernd",
  },
  modal: {
    eyebrow: "iOS Public Beta",
    title: "Byrja",
    steps: [
      "Settu upp TestFlight úr App Store",
      "Opnaðu boðstengilinn og samþykktu",
      "Settu upp SpectRoom og staðfestu reikninginn þinn",
    ],
    cta: "Opna TestFlight-boð",
    note: "Í boði á iOS núna. Android kemur fljótlega.",
    close: "Loka",
  },
  carousel: {
    region: "SpectRoom app-skjámyndir",
    previous: "Fyrri skjámynd",
    next: "Næsta skjámynd",
    goTo: "Fara á skjámynd",
  },
  downloads: {
    heading: "Niðurhal",
    subtitle: "Sæktu SpectRoom í símann þinn og byrjaðu að tengjast á þínum eigin hraða.",
    iosLabel: "Sækja í",
    iosStore: "App Store",
    androidLabel: "Fáðu það á",
    androidStore: "Google Play",
  },
};
