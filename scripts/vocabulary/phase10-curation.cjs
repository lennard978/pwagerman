const rows = (value) => String.raw({ raw: [value] })
  .trim()
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

const nounRows = rows(`
# category | reference lemma | English meaning
personal-identity|Angabe|piece of information
personal-identity|Anrede|form of address
personal-identity|Dokument|document
personal-identity|Personalien|personal details
personal-identity|Wohnsitz|place of residence
family-relationships|Angehörige|relative
family-relationships|Ehepaar|married couple
family-relationships|Enkel|grandchild
family-relationships|Freundschaft|friendship
family-relationships|Kindheit|childhood
family-relationships|Neffe|nephew
home-living|Abfalleimer|rubbish bin
home-living|Aufzug|lift / elevator
home-living|Badewanne|bathtub
home-living|Briefkasten|letterbox
home-living|Erdgeschoss|ground floor
home-living|Garage|garage
home-living|Herd|cooker / stove
home-living|Klimaanlage|air conditioning
home-living|Schrank|cupboard / wardrobe
home-living|Steckdose|power socket
daily-life|Gegenstand|object / item
daily-life|Lebensmittel|food products
daily-life|Notiz|note
daily-life|Werkzeug|tool
food-eating-out|Appetit|appetite
food-eating-out|Marille|apricot (Austria)
food-eating-out|Dessert|dessert
food-eating-out|Gewürz|spice
food-eating-out|Honig|honey
food-eating-out|Menü|set menu
food-eating-out|Portion|portion
food-eating-out|Saft|juice
food-eating-out|Salz|salt
food-eating-out|Zwiebel|onion
shopping-money|Beleg|receipt / proof of purchase
shopping-money|Betrag|amount
shopping-money|Kredit|loan / credit
shopping-money|Mahnung|payment reminder
shopping-money|Mehrwertsteuer|value-added tax
shopping-money|Münze|coin
shopping-money|Umtausch|exchange
shopping-money|Zahlung|payment
work-profession|Angestellte|employee
work-profession|Arbeitserlaubnis|work permit
work-profession|Arbeitsstelle|job / position
work-profession|Auftrag|assignment / order
work-profession|Aushilfe|temporary worker
work-profession|Azubi|trainee
work-profession|Betriebsrat|works council
work-profession|Fortbildung|professional training
work-profession|Gewerkschaft|trade union
work-profession|Ingenieur|engineer
work-profession|Praktikant|intern
work-profession|Tätigkeit|occupation / activity
school-education|Abitur|school-leaving qualification
school-education|Antwortbogen|answer sheet
school-education|Berufsschule|vocational school
school-education|Fachhochschule|university of applied sciences
school-education|Fähigkeit|ability / skill
school-education|Fremdsprache|foreign language
school-education|Grundschule|primary school
school-education|Gymnasium|academic secondary school
school-education|Klassenarbeit|class test
school-education|Methode|method
school-education|Referat|class presentation
school-education|Seminar|seminar
travel-transport|Ausfahrt|exit / motorway exit
travel-transport|Bahnsteig|platform
travel-transport|Einbahnstraße|one-way street
travel-transport|Entfernung|distance
travel-transport|Fähre|ferry
travel-transport|Velo|bicycle (Switzerland)
travel-transport|Fahrzeug|vehicle
travel-transport|Führerschein|driving licence
travel-transport|Geschwindigkeit|speed
travel-transport|Hauptbahnhof|main railway station
travel-transport|Landung|landing
travel-transport|Panne|breakdown
travel-transport|Perron|platform (Switzerland)
travel-transport|Terminal|terminal
city-services|Anwalt|lawyer
city-services|Bescheid|official notice
city-services|Botschaft|embassy
city-services|Denkmal|monument
city-services|Fundbüro|lost-property office
city-services|Gebühr|fee
city-services|Gefängnis|prison
city-services|Konsulat|consulate
city-services|Steuer|tax
city-services|Verwaltung|administration
health-body|Atem|breath
health-body|Diät|diet
health-body|Infektion|infection
health-body|Krankenkasse|health insurance fund
health-body|Krankenpfleger|nurse
health-body|Krankenwagen|ambulance
health-body|Medizin|medicine
health-body|Operation|operation
health-body|Pflaster|plaster / bandage
health-body|Schmerzmittel|painkiller
health-body|Therapie|therapy
health-body|Versichertenkarte|health insurance card
appointments-services|Anleitung|instructions
appointments-services|Bestätigung|confirmation
appointments-services|Gebrauchsanweisung|instruction manual
appointments-services|Reinigung|cleaning service
appointments-services|Rückmeldung|response / feedback
appointments-services|Vermittlung|arrangement / placement service
media-communication|Abbildung|illustration
media-communication|Anrufbeantworter|answering machine
media-communication|Ansage|announcement
media-communication|Aussage|statement
media-communication|Autor|author
media-communication|Blog|blog
media-communication|Broschüre|brochure
media-communication|Darstellung|presentation / depiction
media-communication|Durchsage|public announcement
media-communication|Recherche|research
technology-internet|Akku|rechargeable battery
technology-internet|Batterie|battery
technology-internet|Chipkarte|smart card
technology-internet|E-Book|e-book
technology-internet|Festplatte|hard drive
technology-internet|Kabel|cable
technology-internet|Laufwerk|drive
technology-internet|Lautsprecher|speaker
technology-internet|Plattform|platform
technology-internet|Rechner|computer
leisure-sport|Abenteuer|adventure
leisure-sport|Auftritt|performance
leisure-sport|Ballett|ballet
leisure-sport|Festival|festival
leisure-sport|Galerie|gallery
leisure-sport|Instrument|instrument
leisure-sport|Orchester|orchestra
leisure-sport|Publikum|audience
holidays-accommodation|Apartment|apartment
holidays-accommodation|Aussicht|view / outlook
holidays-accommodation|Gasthaus|guest house / inn
holidays-accommodation|Insel|island
holidays-accommodation|Pension|guest house
holidays-accommodation|Souvenir|souvenir
environment-weather|Gebirge|mountain range
environment-weather|Gras|grass
environment-weather|Kraftwerk|power station
environment-weather|Landschaft|landscape
environment-weather|Landwirtschaft|agriculture
environment-weather|Ozean|ocean
environment-weather|Umweltschutz|environmental protection
environment-weather|Wiese|meadow
society-community|Asyl|asylum
society-community|Einfluss|influence
society-community|Freiheit|freedom
society-community|Gewalt|violence
society-community|Mehrheit|majority
society-community|Minderheit|minority
society-community|Migration|migration
society-community|Parlament|parliament
society-community|Protest|protest
society-community|Reform|reform
feelings-opinions|Ahnung|idea / clue
feelings-opinions|Gedanke|thought
feelings-opinions|Geduld|patience
feelings-opinions|Heimweh|homesickness
feelings-opinions|Humor|sense of humour
feelings-opinions|Langeweile|boredom
problems-solutions|Ausnahme|exception
problems-solutions|Beweis|proof / evidence
problems-solutions|Herausforderung|challenge
problems-solutions|Krise|crisis
problems-solutions|Kritik|criticism
problems-solutions|Schuld|fault / blame
problems-solutions|Strafe|penalty
problems-solutions|Verlust|loss
problems-solutions|Verdacht|suspicion
problems-solutions|Vorwurf|accusation
plans-goals-time|Beginn|beginning
plans-goals-time|Ereignis|event
plans-goals-time|Fortschritt|progress
plans-goals-time|Moment|moment
plans-goals-time|Schluss|end / conclusion
plans-goals-time|Start|start
plans-goals-time|Voraussetzung|prerequisite
plans-goals-time|Zweck|purpose
`);

const verbRows = rows(`
# category | lemma | English action | Partizip II | Präteritum | auxiliary | separable prefix | use
work-profession|akzeptieren|accept|akzeptiert|akzeptierte|haben||t
work-profession|anerkennen|recognise / acknowledge|anerkannt|erkannte an|haben|an|t
work-profession|anbieten|offer|angeboten|bot an|haben|an|t
work-profession|anstellen|employ|angestellt|stellte an|haben|an|t
work-profession|auffordern|ask / require|aufgefordert|forderte auf|haben|auf|t
work-profession|beraten|advise|beraten|beriet|haben||t
work-profession|beschäftigen|employ / occupy|beschäftigt|beschäftigte|haben||t
work-profession|betreuen|supervise / support|betreut|betreute|haben||t
work-profession|finanzieren|finance|finanziert|finanzierte|haben||t
work-profession|fordern|demand|gefordert|forderte|haben||t
work-profession|fördern|support / promote|gefördert|förderte|haben||t
work-profession|garantieren|guarantee|garantiert|garantierte|haben||t
work-profession|handeln|act / deal|gehandelt|handelte|haben||i
work-profession|jobben|work a temporary job|gejobbt|jobbte|haben||i
work-profession|leisten|perform / provide|geleistet|leistete|haben||t
work-profession|produzieren|produce|produziert|produzierte|haben||t
work-profession|streiken|go on strike|gestreikt|streikte|haben||i
work-profession|vertreten|represent / stand in for|vertreten|vertrat|haben||t
school-education|analysieren|analyse|analysiert|analysierte|haben||t
school-education|anwenden|apply / use|angewendet|wandte an|haben|an|t
school-education|beantworten|answer|beantwortet|beantwortete|haben||t
school-education|begründen|justify / give reasons for|begründet|begründete|haben||t
school-education|beschreiben|describe|beschrieben|beschrieb|haben||t
school-education|beweisen|prove|bewiesen|bewies|haben||t
school-education|buchstabieren|spell|buchstabiert|buchstabierte|haben||t
school-education|darstellen|present / portray|dargestellt|stellte dar|haben|dar|t
school-education|entdecken|discover|entdeckt|entdeckte|haben||t
school-education|ergänzen|complete / add|ergänzt|ergänzte|haben||t
school-education|erfinden|invent|erfunden|erfand|haben||t
school-education|erstellen|create / compile|erstellt|erstellte|haben||t
school-education|markieren|mark|markiert|markierte|haben||t
school-education|rechnen|calculate|gerechnet|rechnete|haben||i
school-education|testen|test|getestet|testete|haben||t
school-education|unterrichten|teach|unterrichtet|unterrichtete|haben||t
school-education|unterscheiden|distinguish|unterschieden|unterschied|haben||t
school-education|unterstreichen|underline / emphasise|unterstrichen|unterstrich|haben||t
travel-transport|abbiegen|turn off|abgebogen|bog ab|sein|ab|i
travel-transport|abheben|take off|abgehoben|hob ab|sein|ab|i
travel-transport|anschnallen|fasten a seat belt|angeschnallt|schnallte an|haben|an|t
travel-transport|ausfallen|be cancelled / fail|ausgefallen|fiel aus|sein|aus|i
travel-transport|bremsen|brake|gebremst|bremste|haben||i
travel-transport|fliehen|flee|geflohen|floh|sein||i
travel-transport|losfahren|set off|losgefahren|fuhr los|sein|los|i
travel-transport|parken|park|geparkt|parkte|haben||t
travel-transport|starten|depart / start|gestartet|startete|sein||i
travel-transport|tanken|refuel|getankt|tankte|haben||t
travel-transport|überholen|overtake|überholt|überholte|haben||t
travel-transport|überqueren|cross|überquert|überquerte|haben||t
travel-transport|verreisen|go away / travel|verreist|verreiste|sein||i
travel-transport|verschwinden|disappear|verschwunden|verschwand|sein||i
travel-transport|sich verlaufen|get lost|verlaufen|verlief sich|haben||r
travel-transport|zurechtkommen|manage / find one's way|zurechtgekommen|kam zurecht|sein|zurecht|i
travel-transport|wenden|turn around|gewendet|wendete|haben||t
travel-transport|winken|wave|gewinkt|winkte|haben||i
city-services|abgeben|hand in / submit|abgegeben|gab ab|haben|ab|t
city-services|angeben|state / provide|angegeben|gab an|haben|an|t
city-services|ankreuzen|tick / mark|angekreuzt|kreuzte an|haben|an|t
city-services|anzeigen|report / display|angezeigt|zeigte an|haben|an|t
city-services|ausstellen|issue|ausgestellt|stellte aus|haben|aus|t
city-services|eintragen|enter / register|eingetragen|trug ein|haben|ein|t
city-services|erhalten|receive|erhalten|erhielt|haben||t
city-services|festsetzen|set / determine|festgesetzt|setzte fest|haben|fest|t
city-services|melden|report / register|gemeldet|meldete|haben||t
city-services|regeln|regulate / settle|geregelt|regelte|haben||t
city-services|sichern|secure|gesichert|sicherte|haben||t
city-services|überweisen|transfer money|überwiesen|überwies|haben||t
city-services|verhaften|arrest|verhaftet|verhaftete|haben||t
city-services|verurteilen|sentence / condemn|verurteilt|verurteilte|haben||t
city-services|zahlen|pay|gezahlt|zahlte|haben||t
health-body|abnehmen|lose weight / decrease|abgenommen|nahm ab|haben|ab|i
health-body|bluten|bleed|geblutet|blutete|haben||i
health-body|brechen|break|gebrochen|brach|haben||t
health-body|ernähren|feed / nourish|ernährt|ernährte|haben||t
health-body|frieren|feel cold / freeze|gefroren|fror|haben||i
health-body|fühlen|feel|gefühlt|fühlte|haben||t
health-body|pflegen|care for|gepflegt|pflegte|haben||t
health-body|schwitzen|sweat|geschwitzt|schwitzte|haben||i
health-body|spüren|feel / notice|gespürt|spürte|haben||t
health-body|sterben|die|gestorben|starb|sein||i
health-body|sich schneiden|cut oneself|geschnitten|schnitt sich|haben||r
health-body|sich stoßen|bump oneself|gestoßen|stieß sich|haben||r
health-body|sich verbrennen|burn oneself|verbrannt|verbrannte sich|haben||r
health-body|verschreiben|prescribe|verschrieben|verschrieb|haben||t
health-body|wehtun|hurt|wehgetan|tat weh|haben|weh|i
appointments-services|abmachen|arrange|abgemacht|machte ab|haben|ab|t
appointments-services|ablehnen|decline / reject|abgelehnt|lehnte ab|haben|ab|t
appointments-services|anschließen|connect|angeschlossen|schloss an|haben|an|t
appointments-services|bedienen|serve / operate|bedient|bediente|haben||t
appointments-services|beenden|finish / terminate|beendet|beendete|haben||t
appointments-services|berechnen|calculate / charge|berechnet|berechnete|haben||t
appointments-services|beschädigen|damage|beschädigt|beschädigte|haben||t
appointments-services|besorgen|obtain / take care of|besorgt|besorgte|haben||t
appointments-services|einrichten|set up / furnish|eingerichtet|richtete ein|haben|ein|t
appointments-services|festlegen|set / determine|festgelegt|legte fest|haben|fest|t
appointments-services|reinigen|clean|gereinigt|reinigte|haben||t
appointments-services|tauschen|exchange|getauscht|tauschte|haben||t
appointments-services|verlangen|request / demand|verlangt|verlangte|haben||t
appointments-services|verpacken|pack|verpackt|verpackte|haben||t
appointments-services|zusagen|accept / confirm|zugesagt|sagte zu|haben|zu|i
media-communication|ankündigen|announce|angekündigt|kündigte an|haben|an|t
media-communication|ansprechen|address / approach|angesprochen|sprach an|haben|an|t
media-communication|ausdrucken|print out|ausgedruckt|druckte aus|haben|aus|t
media-communication|aussprechen|pronounce / express|ausgesprochen|sprach aus|haben|aus|t
media-communication|behaupten|claim|behauptet|behauptete|haben||t
media-communication|bekannt geben|announce / make known|bekannt gegeben|gab bekannt|haben|bekannt|t
media-communication|bemerken|notice / remark|bemerkt|bemerkte|haben||t
media-communication|erzählen|tell / narrate|erzählt|erzählte|haben||t
media-communication|sprechen|speak / talk|gesprochen|sprach|haben||i
media-communication|kritisieren|criticise|kritisiert|kritisierte|haben||t
media-communication|mailen|email|gemailt|mailte|haben||t
media-communication|meinen|mean / think|gemeint|meinte|haben||t
media-communication|reden|talk|geredet|redete|haben||i
media-communication|rufen|call / shout|gerufen|rief|haben||t
media-communication|übertragen|transmit / transfer|übertragen|übertrug|haben||t
technology-internet|anklicken|click on|angeklickt|klickte an|haben|an|t
technology-internet|anschaffen|acquire / purchase|angeschafft|schaffte an|haben|an|t
technology-internet|aufladen|charge / upload|aufgeladen|lud auf|haben|auf|t
technology-internet|einfügen|insert / paste|eingefügt|fügte ein|haben|ein|t
technology-internet|hochladen|upload|hochgeladen|lud hoch|haben|hoch|t
technology-internet|nutzen|use|genutzt|nutzte|haben||t
technology-internet|surfen|browse / surf|gesurft|surfte|haben||i
technology-internet|tippen|type|getippt|tippte|haben||t
appointments-services|sich kümmern|take care of|gekümmert|kümmerte sich|haben||r
technology-internet|verbinden|connect|verbunden|verband|haben||t
feelings-opinions|sich interessieren|be interested|interessiert|interessierte sich|haben||r
leisure-sport|campen|camp|gecampt|campte|haben||i
leisure-sport|feiern|celebrate|gefeiert|feierte|haben||t
leisure-sport|grillen|barbecue / grill|gegrillt|grillte|haben||t
leisure-sport|joggen|jog|gejoggt|joggte|sein||i
leisure-sport|klettern|climb|geklettert|kletterte|sein||i
leisure-sport|malen|paint / draw|gemalt|malte|haben||t
leisure-sport|reiten|ride a horse|geritten|ritt|sein||i
leisure-sport|singen|sing|gesungen|sang|haben||t
leisure-sport|trainieren|train / practise|trainiert|trainierte|haben||i
leisure-sport|zelten|camp in a tent|gezeltet|zeltete|haben||i
leisure-sport|faulenzen|relax / laze around|gefaulenzt|faulenzte|haben||i
leisure-sport|nähen|sew|genäht|nähte|haben||t
leisure-sport|tauchen|dive|getaucht|tauchte|sein||i
environment-weather|blitzen|flash / be lightning|geblitzt|blitzte|haben||i
environment-weather|blühen|bloom|geblüht|blühte|haben||i
environment-weather|brennen|burn|gebrannt|brannte|haben||i
environment-weather|donnern|thunder|gedonnert|donnerte|haben||i
environment-weather|fließen|flow|geflossen|floss|sein||i
environment-weather|gießen|water / pour|gegossen|goss|haben||t
environment-weather|hageln|hail|gehagelt|hagelte|haben||i
environment-weather|schneien|snow|geschneit|schneite|haben||i
environment-weather|verbrauchen|consume|verbraucht|verbrauchte|haben||t
environment-weather|zerstören|destroy|zerstört|zerstörte|haben||t
society-community|beeinflussen|influence|beeinflusst|beeinflusste|haben||t
society-community|beschließen|decide / pass|beschlossen|beschloss|haben||t
society-community|integrieren|integrate|integriert|integrierte|haben||t
society-community|protestieren|protest|protestiert|protestierte|haben||i
society-community|verteilen|distribute|verteilt|verteilte|haben||t
society-community|sich beteiligen|participate / become involved|beteiligt|beteiligte sich|haben||r
society-community|kämpfen|fight / campaign|gekämpft|kämpfte|haben||i
society-community|dienen|serve|gedient|diente|haben||i
feelings-opinions|beleidigen|insult / offend|beleidigt|beleidigte|haben||t
feelings-opinions|beruhigen|calm / reassure|beruhigt|beruhigte|haben||t
feelings-opinions|denken|think|gedacht|dachte|haben||i
feelings-opinions|enttäuschen|disappoint|enttäuscht|enttäuschte|haben||t
feelings-opinions|sich erinnern|remember|erinnert|erinnerte sich|haben||r
feelings-opinions|erschrecken|be startled|erschrocken|erschrak|sein||i
feelings-opinions|genießen|enjoy|genossen|genoss|haben||t
feelings-opinions|hassen|hate|gehasst|hasste|haben||t
feelings-opinions|lieben|love|geliebt|liebte|haben||t
feelings-opinions|lachen|laugh|gelacht|lachte|haben||i
feelings-opinions|sich fürchten|be afraid|gefürchtet|fürchtete sich|haben||r
feelings-opinions|sich wundern|be surprised / wonder|gewundert|wunderte sich|haben||r
problems-solutions|abhängen|depend|abgehangen|hing ab|haben|ab|i
problems-solutions|auffallen|stand out / be noticeable|aufgefallen|fiel auf|sein|auf|i
problems-solutions|aufgeben|give up / submit|aufgegeben|gab auf|haben|auf|t
problems-solutions|aufhalten|delay / stop|aufgehalten|hielt auf|haben|auf|t
problems-solutions|sich aufregen|get upset|aufgeregt|regte sich auf|haben|auf|r
problems-solutions|ausschließen|exclude / rule out|ausgeschlossen|schloss aus|haben|aus|t
problems-solutions|verursachen|cause|verursacht|verursachte|haben||t
problems-solutions|verwechseln|confuse / mix up|verwechselt|verwechselte|haben||t
problems-solutions|verzeihen|forgive|verziehen|verzieh|haben||t
problems-solutions|unterbrechen|interrupt|unterbrochen|unterbrach|haben||t
problems-solutions|sich weigern|refuse|geweigert|weigerte sich|haben||r
problems-solutions|feststellen|determine / notice|festgestellt|stellte fest|haben|fest|t
`);

const adjectiveRows = rows(`
# category | adjective | English meaning
work-profession|abhängig|dependent
work-profession|abwesend|absent
work-profession|anwesend|present
work-profession|arbeitslos|unemployed
work-profession|ausgebildet|trained / qualified
work-profession|berufstätig|employed / working
work-profession|bereit|ready / willing
work-profession|erfolgreich|successful
work-profession|flexibel|flexible
work-profession|finanziell|financial
work-profession|zuverlässig|reliable
work-profession|verantwortlich|responsible
work-profession|verpflichtet|obliged
work-profession|geeignet|suitable
work-profession|erforderlich|required
school-education|aufmerksam|attentive
school-education|eindeutig|clear / unambiguous
school-education|fleißig|hard-working
school-education|gründlich|thorough
school-education|intelligent|intelligent
school-education|kreativ|creative
school-education|mündlich|oral / spoken
school-education|schriftlich|written
school-education|theoretisch|theoretical
school-education|verständlich|understandable
travel-transport|direkt|direct
travel-transport|gültig|valid
travel-transport|international|international
travel-transport|mobil|mobile
travel-transport|regional|regional
travel-transport|zentral|central
travel-transport|zugänglich|accessible
travel-transport|nördlich|northern / north of
travel-transport|südlich|southern / south of
travel-transport|östlich|eastern / east of
health-body|fit|fit / healthy
health-body|körperlich|physical
health-body|erschöpft|exhausted
health-body|blind|blind
health-body|taub|deaf
health-body|wach|awake
health-body|müde|tired
health-body|schädlich|harmful
health-body|mager|lean / underweight
health-body|schlank|slim
feelings-opinions|begeistert|enthusiastic
feelings-opinions|dankbar|grateful
feelings-opinions|entschlossen|determined
feelings-opinions|gespannt|curious / eager
feelings-opinions|froh|glad
feelings-opinions|neugierig|curious
feelings-opinions|optimistisch|optimistic
feelings-opinions|peinlich|embarrassing
feelings-opinions|realistisch|realistic
feelings-opinions|ängstlich|anxious
feelings-opinions|ärgerlich|annoying / annoyed
feelings-opinions|wütend|angry
feelings-opinions|vergnügt|cheerful
feelings-opinions|mutig|brave
feelings-opinions|einsam|lonely
problems-solutions|begrenzt|limited
problems-solutions|befriedigend|satisfactory
problems-solutions|kompliziert|complicated
problems-solutions|korrekt|correct
problems-solutions|kostenlos|free of charge
problems-solutions|mangelhaft|inadequate / defective
problems-solutions|rechtlich|legal
problems-solutions|verboten|forbidden
problems-solutions|verdächtig|suspicious
problems-solutions|vergeblich|unsuccessful / in vain
problems-solutions|vernünftig|reasonable
problems-solutions|untersagt|prohibited
problems-solutions|nötig|necessary
problems-solutions|fällig|due
problems-solutions|unentschieden|undecided / tied
adjectives-adverbs|alltäglich|everyday / ordinary
adjectives-adverbs|allgemein|general
adjectives-adverbs|alternativ|alternative
adjectives-adverbs|automatisch|automatic
adjectives-adverbs|durchschnittlich|average
adjectives-adverbs|elektronisch|electronic
adjectives-adverbs|individuell|individual
adjectives-adverbs|kulturell|cultural
adjectives-adverbs|politisch|political
adjectives-adverbs|sozial|social
adjectives-adverbs|staatlich|state / public-sector
adjectives-adverbs|technisch|technical
adjectives-adverbs|traditionell|traditional
adjectives-adverbs|virtuell|virtual
adjectives-adverbs|weltweit|worldwide
`);

const adverbRows = rows(`
# category | adverb | English meaning | original example | translation
plans-goals-time|abends|in the evenings|Abends plane ich den nächsten Tag.|In the evenings, I plan the next day.
connectors-prepositions|allerdings|however|Der Kurs ist gut, allerdings ist er ziemlich teuer.|The course is good; however, it is quite expensive.
adjectives-adverbs|anders|differently|Beim nächsten Mal machen wir es anders.|Next time, we will do it differently.
plans-goals-time|beinahe|almost|Ich hätte den Termin beinahe vergessen.|I almost forgot the appointment.
plans-goals-time|bereits|already|Die Anmeldung ist bereits abgeschlossen.|Registration has already closed.
plans-goals-time|bisher|so far|Bisher hat alles gut funktioniert.|So far, everything has worked well.
plans-goals-time|damals|at that time|Damals wohnte ich noch auf dem Land.|At that time, I still lived in the countryside.
plans-goals-time|danach|afterwards|Danach besprechen wir die Ergebnisse.|Afterwards, we will discuss the results.
travel-transport|draußen|outside|Wir warten draußen vor dem Bahnhof.|We are waiting outside the station.
connectors-prepositions|ebenfalls|likewise / also|Meine Kollegin nimmt ebenfalls an der Sitzung teil.|My colleague is also taking part in the meeting.
plans-goals-time|endlich|finally|Endlich ist die Bestätigung angekommen.|The confirmation has finally arrived.
plans-goals-time|eventuell|possibly|Eventuell verschieben wir den Termin auf Freitag.|We may possibly move the appointment to Friday.
adjectives-adverbs|fast|almost|Der Bericht ist fast fertig.|The report is almost finished.
plans-goals-time|früher|earlier / formerly|Früher bin ich jeden Tag mit dem Bus gefahren.|I used to take the bus every day.
plans-goals-time|gleichzeitig|at the same time|Beide Kurse beginnen gleichzeitig.|Both courses begin at the same time.
feelings-opinions|hoffentlich|hopefully|Hoffentlich bekommen wir bald eine Antwort.|Hopefully, we will receive an answer soon.
adjectives-adverbs|häufig|frequently|Dieses Problem tritt häufig auf.|This problem occurs frequently.
plans-goals-time|jederzeit|at any time|Sie können uns jederzeit anrufen.|You can call us at any time.
adjectives-adverbs|kaum|hardly|Die kleine Schrift ist kaum lesbar.|The small print is hardly legible.
plans-goals-time|kürzlich|recently|Ich habe kürzlich eine Fortbildung besucht.|I recently attended a training course.
feelings-opinions|leider|unfortunately|Leider kann ich an dem Treffen nicht teilnehmen.|Unfortunately, I cannot take part in the meeting.
adjectives-adverbs|gewöhnlich|usually / ordinarily|Gewöhnlich fahre ich mit dem Fahrrad zur Arbeit.|I usually cycle to work.
adjectives-adverbs|mindestens|at least|Die Bearbeitung dauert mindestens drei Tage.|Processing takes at least three days.
plans-goals-time|mittlerweile|by now / meanwhile|Mittlerweile kenne ich die Strecke sehr gut.|By now, I know the route very well.
daily-life|morgens|in the mornings|Morgens lese ich zuerst meine Nachrichten.|In the mornings, I read my messages first.
daily-life|nachmittags|in the afternoons|Nachmittags ist das Bürgeramt geschlossen.|The public office is closed in the afternoons.
daily-life|nachts|at night|Nachts fahren nur wenige Busse.|Only a few buses run at night.
home-living|nebenan|next door|Nebenan ist eine neue Familie eingezogen.|A new family has moved in next door.
plans-goals-time|neulich|the other day|Neulich habe ich meinen früheren Lehrer getroffen.|The other day, I met my former teacher.
adjectives-adverbs|normalerweise|normally|Normalerweise dauert die Fahrt eine halbe Stunde.|The journey normally takes half an hour.
media-communication|offenbar|apparently|Offenbar wurde die Nachricht nicht verschickt.|Apparently, the message was not sent.
plans-goals-time|plötzlich|suddenly|Plötzlich fiel der Strom aus.|The power suddenly went out.
plans-goals-time|sofort|immediately|Bitte melden Sie den Schaden sofort.|Please report the damage immediately.
adjectives-adverbs|sogar|even|Der Kurs ist sogar am Samstag geöffnet.|The course is even open on Saturday.
plans-goals-time|spätestens|no later than|Bitte antworten Sie spätestens bis Montag.|Please reply no later than Monday.
daily-life|tagsüber|during the day|Tagsüber ist die Straße sehr belebt.|The street is very busy during the day.
feelings-opinions|vermutlich|presumably / probably|Vermutlich kommt der Zug zehn Minuten später.|The train will probably arrive ten minutes later.
plans-goals-time|voraussichtlich|expectedly / probably|Die Reparatur ist voraussichtlich morgen fertig.|The repair is expected to be finished tomorrow.
plans-goals-time|vorhin|a short while ago|Vorhin hat die Werkstatt angerufen.|The repair shop called a short while ago.
plans-goals-time|vorläufig|temporarily / for now|Der Eingang bleibt vorläufig geschlossen.|The entrance will remain closed for now.
adjectives-adverbs|wenigstens|at least|Wenigstens haben wir rechtzeitig Bescheid bekommen.|At least we were informed in time.
adjectives-adverbs|wirklich|really|Die neue Regelung ist wirklich praktisch.|The new rule is really practical.
plans-goals-time|zuerst|first|Zuerst füllen Sie bitte dieses Formular aus.|First, please complete this form.
plans-goals-time|zuletzt|last / most recently|Zuletzt prüfen wir alle Angaben noch einmal.|Finally, we check all the information once more.
media-communication|übrigens|by the way|Übrigens beginnt die Veranstaltung eine Stunde früher.|By the way, the event begins an hour earlier.
`);

const connectorRows = rows(`
# connector | English meaning | original example | translation | grammar lesson
aber|but|Ich würde gern kommen, aber ich muss länger arbeiten.|I would like to come, but I have to work longer.|de-b1-cohesive-connectors
allerdings|however|Die Wohnung ist hell, allerdings liegt sie weit außerhalb.|The apartment is bright; however, it is far outside the city.|de-b1-main-clause-connectors
also|so / therefore|Der Bus fährt nicht, also gehen wir zu Fuß.|The bus is not running, so we are walking.|de-b1-main-clause-connectors
andererseits|on the other hand|Das Angebot ist günstig, andererseits passt der Termin nicht.|The offer is affordable; on the other hand, the date does not work.|de-b1-cohesive-connectors
dabei|at the same time / in doing so|Sie arbeitet und hört dabei leise Musik.|She works and listens to quiet music at the same time.|de-b1-cohesive-connectors
dafür|for that / in favour of it|Der Kurs kostet mehr, dafür bietet er kleine Gruppen.|The course costs more, but in return it offers small groups.|de-b1-cohesive-connectors
dagegen|against that / by contrast|Viele fahren mit dem Auto; ich benutze dagegen meist die Bahn.|Many people drive; by contrast, I usually take the train.|de-b1-cohesive-connectors
daher|therefore|Die Straße ist gesperrt, daher nehmen wir einen anderen Weg.|The road is closed; therefore, we are taking another route.|de-b1-main-clause-connectors
dann|then|Zuerst prüfen wir die Adresse, dann schicken wir den Brief ab.|First we check the address, then we send the letter.|de-b1-cohesive-connectors
dass|that|Ich hoffe, dass die Reparatur heute fertig wird.|I hope that the repair will be finished today.|de-b1-subordinate-clauses
denn|because / for|Ich gehe früh, denn morgen beginnt der Kurs um acht.|I am leaving early because the course begins at eight tomorrow.|de-b1-cohesive-connectors
doch|but / however|Der Weg ist lang, doch die Aussicht lohnt sich.|The path is long, but the view is worth it.|de-b1-cohesive-connectors
indem|by doing / while|Man spart Energie, indem man das Licht ausschaltet.|You save energy by switching off the light.|de-b1-subordinate-clauses
jedoch|however|Die Aufgabe war schwierig, jedoch konnten wir sie lösen.|The task was difficult; however, we were able to solve it.|de-b1-main-clause-connectors
nämlich|because / namely|Ich komme später, ich habe nämlich noch einen Termin.|I am coming later because I still have an appointment.|de-b1-main-clause-connectors
ob|whether|Können Sie mir sagen, ob noch Plätze frei sind?|Can you tell me whether there are still places available?|de-b1-indirect-questions
oder|or|Wir können den Bus nehmen oder zu Fuß gehen.|We can take the bus or walk.|de-b1-cohesive-connectors
sodass|so that / with the result that|Der Zug hatte Verspätung, sodass wir den Anschluss verpassten.|The train was delayed, so we missed the connection.|de-b1-subordinate-clauses
sondern|but rather|Wir treffen uns nicht am Bahnhof, sondern vor dem Rathaus.|We are not meeting at the station, but rather in front of the town hall.|de-b1-cohesive-connectors
und|and|Sie liest den Bericht und notiert die wichtigsten Punkte.|She reads the report and notes the most important points.|de-b1-cohesive-connectors
wenn|if / whenever|Wenn du Zeit hast, können wir gemeinsam lernen.|If you have time, we can study together.|de-b1-subordinate-clauses
zwar|admittedly / indeed|Der Kurs ist zwar anstrengend, aber sehr hilfreich.|The course is demanding, but very helpful.|de-b1-cohesive-connectors
je ... desto ...|the ... the ...|Je früher wir buchen, desto günstiger sind die Fahrkarten.|The earlier we book, the cheaper the tickets are.|de-b1-comparative-superlative
deswegen|therefore / because of that|Mein Fahrrad ist kaputt, deswegen fahre ich heute mit dem Bus.|My bicycle is broken, so I am taking the bus today.|de-b1-main-clause-connectors
umso|all the more|Nach der langen Pause war die Freude umso größer.|After the long break, the joy was all the greater.|de-b1-comparative-superlative
`);

const prepositionRows = rows(`
# preposition | English meaning | original example | translation | grammar lesson
ab|from / starting at|Ab Montag gelten neue Öffnungszeiten.|New opening hours apply from Monday.|de-b1-case-articles
an|at / on|Am Eingang hängt ein aktueller Fahrplan.|A current timetable is displayed at the entrance.|de-b1-two-way-local-temporal-prepositions
auf|on / at|Die Unterlagen liegen auf dem Schreibtisch.|The documents are on the desk.|de-b1-two-way-local-temporal-prepositions
aus|from / out of|Sie kommt direkt aus der Berufsschule.|She is coming directly from vocational school.|de-b1-case-articles
bei|at / with|Bei Fragen wenden Sie sich bitte an den Kundendienst.|If you have questions, please contact customer service.|de-b1-case-articles
bis|until / as far as|Die Anmeldung ist bis Freitag möglich.|Registration is possible until Friday.|de-b1-case-articles
durch|through / by|Wir fahren durch die Innenstadt.|We are driving through the city centre.|de-b1-case-articles
entlang|along|Wir gehen den Fluss entlang.|We are walking along the river.|de-b1-case-articles
für|for|Dieses Angebot gilt nur für Mitglieder.|This offer applies only to members.|de-b1-case-articles
gegen|against / around|Das Medikament hilft gegen die Schmerzen.|The medicine helps against the pain.|de-b1-case-articles
hinter|behind|Der Parkplatz liegt hinter dem Gebäude.|The car park is behind the building.|de-b1-two-way-local-temporal-prepositions
in|in / into|Die Besprechung findet in Raum zwölf statt.|The meeting takes place in room twelve.|de-b1-two-way-local-temporal-prepositions
mit|with / by|Ich fahre heute mit der S-Bahn.|I am travelling by suburban train today.|de-b1-case-articles
nach|after / to|Nach dem Kurs gehe ich direkt nach Hause.|After the course, I am going straight home.|de-b1-case-articles
neben|next to / beside|Neben der Apotheke befindet sich ein Geldautomat.|There is a cash machine next to the pharmacy.|de-b1-two-way-local-temporal-prepositions
`);

const phraseRows = rows(`
# slug | English meaning | learner-facing phrase | original example | translation | reference key | grammar lesson
sehr-geehrte-damen-und-herren|Dear Sir or Madam|Sehr geehrte Damen und Herren,|Sehr geehrte Damen und Herren, ich interessiere mich für Ihren Sprachkurs.|Dear Sir or Madam, I am interested in your language course.|Gruß|de-b1-noun-verb-writing
sehr-geehrte-frau|Dear Ms ...|Sehr geehrte Frau ...,|Sehr geehrte Frau Berger, vielen Dank für Ihre Nachricht.|Dear Ms Berger, thank you for your message.|Gruß|de-b1-noun-verb-writing
sehr-geehrter-herr|Dear Mr ...|Sehr geehrter Herr ...,|Sehr geehrter Herr Klein, ich habe eine Frage zu meiner Rechnung.|Dear Mr Klein, I have a question about my invoice.|Gruß|de-b1-noun-verb-writing
danke-fuer-ihre-nachricht|Thank you for your message|Vielen Dank für Ihre Nachricht.|Vielen Dank für Ihre Nachricht und die hilfreichen Informationen.|Thank you for your message and the helpful information.|Nachricht|de-b1-noun-verb-writing
ich-wende-mich-an-sie|I am contacting you because|Ich wende mich an Sie, weil ...|Ich wende mich an Sie, weil meine Bestellung noch nicht angekommen ist.|I am contacting you because my order has not arrived yet.|wenden|de-b1-subordinate-clauses
darueber-informieren|I would like to inform you that|Ich möchte Sie darüber informieren, dass ...|Ich möchte Sie darüber informieren, dass ich den Termin nicht wahrnehmen kann.|I would like to inform you that I cannot attend the appointment.|informieren|de-b1-subordinate-clauses
frage-zu|I have a question about|Ich habe eine Frage zu ...|Ich habe eine Frage zu den Teilnahmebedingungen.|I have a question about the conditions of participation.|Frage|de-b1-noun-verb-writing
kurze-rueckmeldung|I am asking for a brief response|Ich bitte Sie um eine kurze Rückmeldung.|Ich bitte Sie um eine kurze Rückmeldung bis Freitag.|I am asking you for a brief response by Friday.|Rückmeldung|de-b1-prepositional-verbs
mitteilen-ob|Could you please tell me whether|Könnten Sie mir bitte mitteilen, ob ...?|Könnten Sie mir bitte mitteilen, ob noch Plätze frei sind?|Could you please tell me whether there are still places available?|mitteilen|de-b1-indirect-questions
nicht-zufrieden|Unfortunately I am not satisfied with|Leider bin ich mit ... nicht zufrieden.|Leider bin ich mit dem Kundenservice nicht zufrieden.|Unfortunately, I am not satisfied with customer service.|zufrieden|de-b1-prepositional-verbs
hiermit-beschweren|I hereby wish to complain about|Hiermit möchte ich mich über ... beschweren.|Hiermit möchte ich mich über die lange Wartezeit beschweren.|I hereby wish to complain about the long waiting time.|sich beschweren|de-b1-prepositional-verbs
grund-dafuer|The reason for this is that|Der Grund dafür ist, dass ...|Der Grund dafür ist, dass der Zug ausgefallen ist.|The reason is that the train was cancelled.|Grund|de-b1-subordinate-clauses
bitte-um-verstaendnis|I ask for your understanding that|Ich bitte um Verständnis dafür, dass ...|Ich bitte um Verständnis dafür, dass ich später komme.|I ask for your understanding that I will arrive later.|Verständnis|de-b1-subordinate-clauses
hoffe-loesung|I hope that we can find a solution|Ich hoffe, dass wir eine Lösung finden.|Ich hoffe, dass wir gemeinsam eine faire Lösung finden.|I hope that we can find a fair solution together.|Lösung|de-b1-subordinate-clauses
bitte-bestaetigen|Please confirm to me|Bitte bestätigen Sie mir ...|Bitte bestätigen Sie mir den neuen Termin schriftlich.|Please confirm the new appointment to me in writing.|bestätigen|de-b1-noun-verb-writing
unterstuetzung-bedanken|Thank you for your support|Für Ihre Unterstützung bedanke ich mich.|Für Ihre schnelle Unterstützung bedanke ich mich herzlich.|Thank you very much for your prompt support.|Unterstützung|de-b1-prepositional-verbs
freue-mich-auf-antwort|I look forward to your reply|Ich freue mich auf Ihre Antwort.|Ich freue mich auf Ihre Antwort und weitere Informationen.|I look forward to your reply and further information.|Antwort|de-b1-prepositional-verbs
mit-freundlichen-gruessen|Yours sincerely|Mit freundlichen Grüßen|Mit freundlichen Grüßen, Maria Novak|Yours sincerely, Maria Novak|Gruß|de-b1-noun-verb-writing
liebe-lieber|Dear ...|Liebe ... / Lieber ...,|Liebe Anna, danke für deine Einladung.|Dear Anna, thank you for your invitation.|lieb|de-b1-adjective-endings
viele-gruesse|Best wishes|Viele Grüße|Viele Grüße und bis bald, Daniel|Best wishes and see you soon, Daniel.|Gruß|de-b1-noun-verb-writing
entschuldige-bitte|Please excuse me for|Entschuldige bitte, dass ...|Entschuldige bitte, dass ich mich so spät melde.|Please excuse me for getting in touch so late.|entschuldigen|de-b1-subordinate-clauses
danke-fuer-einladung|Thank you for your invitation|Danke für deine Einladung.|Danke für deine Einladung zu deinem Geburtstag.|Thank you for inviting me to your birthday.|Einladung|de-b1-case-articles
gern-komme-ich|I would be happy to come to|Gern komme ich zu ...|Gern komme ich zu deiner Feier am Samstag.|I would be happy to come to your party on Saturday.|kommen|de-b1-word-order-foundation
leider-nicht-teilnehmen|Unfortunately I cannot participate|Leider kann ich nicht teilnehmen.|Leider kann ich wegen eines Termins nicht teilnehmen.|Unfortunately, I cannot participate because of an appointment.|teilnehmen|de-b1-modal-verbs
termin-verschieben|Could we move the appointment|Könnten wir den Termin verschieben?|Könnten wir den Termin auf nächsten Dienstag verschieben?|Could we move the appointment to next Tuesday?|verschieben|de-b1-konjunktiv-ii
gib-bescheid|Please let me know|Gib mir bitte Bescheid.|Gib mir bitte Bescheid, sobald du angekommen bist.|Please let me know as soon as you have arrived.|Bescheid geben|de-b1-subordinate-clauses
so-bald-wie-moeglich|I will get back to you as soon as possible|Ich melde mich so bald wie möglich.|Ich melde mich so bald wie möglich mit einer Entscheidung.|I will get back to you with a decision as soon as possible.|melden|de-b1-cohesive-connectors
bis-bald|See you soon|Bis bald!|Danke für deine Nachricht und bis bald!|Thank you for your message, and see you soon!|bald|de-b1-cohesive-connectors
herzliche-gruesse|Warm regards|Herzliche Grüße|Herzliche Grüße aus Berlin, Lena|Warm regards from Berlin, Lena.|Gruß|de-b1-adjective-endings
was-meinst-du|What do you think about that|Was meinst du dazu?|Was meinst du dazu: Sollen wir früher beginnen?|What do you think: Should we start earlier?|meinen|de-b1-indirect-questions
wie-sehen-sie-das|How do you see it|Wie sehen Sie das?|Wie sehen Sie das: Wäre ein späterer Termin besser?|How do you see it: Would a later appointment be better?|sehen|de-b1-indirect-questions
ich-bin-dafuer|I am in favour|Ich bin dafür.|Ich bin dafür, weil der Vorschlag praktisch ist.|I am in favour because the suggestion is practical.|dafür|de-b1-main-clause-connectors
ich-bin-dagegen|I am against it|Ich bin dagegen.|Ich bin dagegen, weil die Lösung zu teuer ist.|I am against it because the solution is too expensive.|dagegen|de-b1-main-clause-connectors
sehe-etwas-anders|I see that somewhat differently|Das sehe ich etwas anders.|Das sehe ich etwas anders, denn nicht alle können teilnehmen.|I see that somewhat differently because not everyone can participate.|anders|de-b1-cohesive-connectors
stimme-dir-zu|I agree with you|Da stimme ich dir zu.|Da stimme ich dir zu, besonders beim Thema Verkehr.|I agree with you, especially about transport.|zustimmen|de-b1-prepositional-verbs
nicht-ganz-zu|I do not entirely agree with you|Da stimme ich Ihnen nicht ganz zu.|Da stimme ich Ihnen nicht ganz zu, weil die Kosten steigen.|I do not entirely agree with you because the costs are rising.|zustimmen|de-b1-prepositional-verbs
verstehe-deinen-punkt|I understand your point, but|Ich verstehe deinen Punkt, aber ...|Ich verstehe deinen Punkt, aber wir brauchen eine schnellere Lösung.|I understand your point, but we need a faster solution.|Verständnis|de-b1-cohesive-connectors
weiterer-punkt|Another important point is|Ein weiterer wichtiger Punkt ist ...|Ein weiterer wichtiger Punkt ist die gute Erreichbarkeit.|Another important point is good accessibility.|Punkt|de-b1-adjective-endings
dafuer-spricht|A point in favour is that|Dafür spricht, dass ...|Dafür spricht, dass der Kurs am Abend stattfindet.|A point in favour is that the course takes place in the evening.|dafür|de-b1-subordinate-clauses
dagegen-spricht|A point against is that|Dagegen spricht, dass ...|Dagegen spricht, dass die Anfahrt sehr lang ist.|A point against is that the journey is very long.|dagegen|de-b1-subordinate-clauses
ich-wuerde-vorschlagen|I would suggest that|Ich würde vorschlagen, dass ...|Ich würde vorschlagen, dass wir zuerst die Aufgaben verteilen.|I would suggest that we distribute the tasks first.|vorschlagen|de-b1-konjunktiv-ii
wir-koennten-auch|We could also|Wir könnten auch ...|Wir könnten auch einen Raum in der Bibliothek reservieren.|We could also reserve a room in the library.|können|de-b1-konjunktiv-ii
sollen-wir-vielleicht|Perhaps we should|Sollen wir vielleicht ...?|Sollen wir vielleicht am Bahnhof einen Treffpunkt vereinbaren?|Perhaps we should arrange a meeting point at the station.|sollen|de-b1-modal-verbs
lass-uns-zuerst|Let us first|Lass uns zuerst ...|Lass uns zuerst die wichtigsten Fragen sammeln.|Let us collect the most important questions first.|zuerst|de-b1-word-order-foundation
klingt-gute-idee|That sounds like a good idea|Das klingt nach einer guten Idee.|Ein gemeinsames Treffen klingt nach einer guten Idee.|A meeting together sounds like a good idea.|Idee|de-b1-prepositional-verbs
damit-einverstanden|I agree with that|Damit bin ich einverstanden.|Mit diesem Zeitplan bin ich einverstanden.|I agree with this schedule.|einverstanden|de-b1-prepositional-verbs
darauf-einigen|Can we agree on that|Können wir uns darauf einigen?|Können wir uns darauf einigen, um zehn Uhr zu beginnen?|Can we agree to begin at ten o'clock?|einverstanden|de-b1-prepositional-verbs
bitte-wiederholen|Could you please repeat that|Könntest du das bitte wiederholen?|Könntest du die letzte Zahl bitte wiederholen?|Could you please repeat the last number?|wiederholen|de-b1-konjunktiv-ii
was-genau-meinst-du|What exactly do you mean by|Was genau meinst du mit ...?|Was genau meinst du mit einer flexiblen Lösung?|What exactly do you mean by a flexible solution?|meinen|de-b1-indirect-questions
richtig-verstanden-frage|Have I understood that correctly|Habe ich das richtig verstanden?|Habe ich das richtig verstanden: Der Termin ist am Donnerstag?|Have I understood correctly that the appointment is on Thursday?|Verständnis|de-b1-indirect-questions
ich-meine-damit|What I mean is that|Ich meine damit, dass ...|Ich meine damit, dass alle eine Aufgabe übernehmen.|What I mean is that everyone takes on a task.|meinen|de-b1-subordinate-clauses
anders-gesagt|In other words|Anders gesagt ...|Anders gesagt brauchen wir einen neuen Plan.|In other words, we need a new plan.|anders|de-b1-cohesive-connectors
thema-zurueckzukommen|To return to the topic|Um auf das Thema zurückzukommen ...|Um auf das Thema zurückzukommen: Wann beginnen wir?|To return to the topic: When do we begin?|Thema|de-b1-purpose-um-zu-damit
naechsten-punkt|Let us move to the next point|Kommen wir zum nächsten Punkt.|Kommen wir zum nächsten Punkt: der Aufgabenverteilung.|Let us move to the next point: the distribution of tasks.|Punkt|de-b1-adjective-endings
zuerst-erlaeutern|First I would like to explain|Zuerst möchte ich ... erläutern.|Zuerst möchte ich die aktuelle Situation erläutern.|First I would like to explain the current situation.|erklären|de-b1-noun-verb-writing
danach-eingehen|After that I will address|Danach gehe ich auf ... ein.|Danach gehe ich auf die wichtigsten Vorteile ein.|After that, I will address the most important advantages.|Thema|de-b1-prepositional-verbs
zum-schluss-betonen|Finally I would like to emphasise|Zum Schluss möchte ich betonen, dass ...|Zum Schluss möchte ich betonen, dass Zusammenarbeit wichtig ist.|Finally, I would like to emphasise that cooperation is important.|Schluss|de-b1-subordinate-clauses
zusammenfassend-laesst-sich-sagen|In summary it can be said that|Zusammenfassend lässt sich sagen, dass ...|Zusammenfassend lässt sich sagen, dass der Plan realistisch ist.|In summary, it can be said that the plan is realistic.|zusammenfassen|de-b1-passive-voice
aus-meiner-sicht|From my point of view|Aus meiner Sicht ...|Aus meiner Sicht ist die zweite Lösung besser.|From my point of view, the second solution is better.|Meinung|de-b1-cohesive-connectors
wichtigsten-gruende|One of the most important reasons is|Einer der wichtigsten Gründe ist ...|Einer der wichtigsten Gründe ist die gute Verbindung.|One of the most important reasons is the good connection.|Grund|de-b1-genitive-basics
`);

module.exports = {
  nounRows,
  verbRows,
  adjectiveRows,
  adverbRows,
  connectorRows,
  prepositionRows,
  phraseRows,
};
