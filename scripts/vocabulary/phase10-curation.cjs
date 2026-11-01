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
# Phase 10.2: administration, services, work, education, housing, health, travel, and daily life
appointments-services|Abo|subscription
feelings-opinions|Abschied|farewell
school-education|Abschnitt|section / passage
media-communication|Absender|sender
society-community|Aktion|campaign / activity
leisure-sport|Aktivität|activity
problems-solutions|Alarm|alarm
shopping-money|Anbieter|provider
home-living|Anlage|facility / installation
media-communication|Anruf|phone call
city-services|Anspruch|entitlement / claim
adjectives-adverbs|Anzahl|number / quantity
work-profession|Anzug|suit
adjectives-adverbs|Art|kind / type
holidays-accommodation|Aufenthalt|stay
appointments-services|Aufforderung|request / instruction
media-communication|Ausdruck|expression / printout
shopping-money|Ausgabe|expense / issue
travel-transport|Ausgang|exit
travel-transport|Ausland|foreign country / abroad
school-education|Aussprache|pronunciation
plans-goals-time|Auswahl|selection / choice
shopping-money|Automat|machine / vending machine
travel-transport|Bahn|railway / train
shopping-money|Bankleitzahl|bank code
home-living|Bau|construction
city-services|Beamte|civil servant
shopping-money|Bedarf|need / demand
school-education|Bedeutung|meaning / significance
technology-internet|Bedienungsanleitung|instruction manual
appointments-services|Bedingung|condition / requirement
feelings-opinions|Begründung|reason / justification
society-community|Beitrag|contribution
travel-transport|Benzin|petrol / gasoline
adjectives-adverbs|Bereich|area / field
media-communication|Beschreibung|description
work-profession|Beschäftigung|employment / occupation
health-body|Besserung|improvement / recovery
family-relationships|Besuch|visit / visitor
family-relationships|Betreuung|care / supervision
home-living|Bewohner|resident
media-communication|Bild|picture / image
appointments-services|Bitte|request
feelings-opinions|Blick|look / view
environment-weather|Blitz|lightning
home-living|Boden|floor / ground
travel-transport|Bremse|brake
city-services|Briefmarke|postage stamp
media-communication|Briefumschlag|envelope
travel-transport|Brücke|bridge
shopping-money|Buchhandlung|bookshop
school-education|Buchstabe|letter / character
society-community|Bundesland|federal state
work-profession|Büro|office
school-education|Cafeteria|cafeteria
plans-goals-time|Chance|chance / opportunity
media-communication|Dialekt|dialect
media-communication|Dialog|dialogue
city-services|Dieb|thief
school-education|Diplom|diploma / degree
work-profession|Direktor|director / head teacher
travel-transport|Distanz|distance
home-living|Dorf|village
health-body|Droge|drug
health-body|Drogerie|chemist's / drugstore
media-communication|Druck|pressure / print
adjectives-adverbs|Durchschnitt|average
travel-transport|E-Bike|electric bicycle
home-living|Ecke|corner
city-services|Einbrecher|burglar
city-services|Einbruch|burglary
home-living|Einfahrt|driveway / entrance
school-education|Einführung|introduction
city-services|Eingang|entrance
work-profession|Einkommen|income
media-communication|Einleitung|introduction / opening
shopping-money|Einnahme|income / receipt
shopping-money|Einzahlung|deposit / payment
adjectives-adverbs|Einzelheit|detail
feelings-opinions|Empfehlung|recommendation
media-communication|Empfänger|recipient
work-profession|Entlassung|dismissal / discharge
feelings-opinions|Entschuldigung|apology / excuse
plans-goals-time|Entwicklung|development
technology-internet|Erfindung|invention
work-profession|Erfolg|success
holidays-accommodation|Erholung|rest / recreation
shopping-money|Erhöhung|increase
feelings-opinions|Erinnerung|memory / reminder
school-education|Erklärung|explanation
city-services|Erlaubnis|permission
feelings-opinions|Erlebnis|experience
shopping-money|Ermäßigung|discount / reduction
family-relationships|Erziehung|upbringing / education
school-education|Erzählung|story / narrative
appointments-services|Eröffnung|opening
home-living|Etage|floor / storey
work-profession|Experte|expert
work-profession|Export|export
work-profession|Fabrik|factory
work-profession|Fachleute|specialists
travel-transport|Fahrbahn|roadway / carriageway
adjectives-adverbs|Faktor|factor
problems-solutions|Fall|case / instance
adjectives-adverbs|Farbe|colour
leisure-sport|Feier|celebration
plans-goals-time|Feiertag|public holiday
environment-weather|Feld|field
technology-internet|Fernbedienung|remote control
media-communication|Fernseher|television set
leisure-sport|Fest|festival / celebration
environment-weather|Feuer|fire
daily-life|Feuerzeug|lighter
health-body|Fitness|fitness
food-eating-out|Flasche|bottle
shopping-money|Flohmarkt|flea market
problems-solutions|Flucht|escape / flight
travel-transport|Flug|flight
health-body|Flüssigkeit|liquid
plans-goals-time|Folge|consequence / episode
problems-solutions|Forderung|demand / claim
media-communication|Form|form / shape
school-education|Forschung|research
media-communication|Fortsetzung|continuation
technology-internet|Forum|forum
media-communication|Foto|photo
media-communication|Fotograf|photographer
society-community|Friede|peace
personal-identity|Frisur|hairstyle
environment-weather|Frühjahr|spring season
environment-weather|Frühling|spring
travel-transport|Fußgänger|pedestrian
travel-transport|Fußgängerzone|pedestrian zone
school-education|Förderung|support / funding
school-education|Gedicht|poem
travel-transport|Gegend|area / neighbourhood
feelings-opinions|Gegensatz|contrast / opposite
feelings-opinions|Gegenteil|opposite
feelings-opinions|Geheimnis|secret
shopping-money|Geldautomat|cash machine / ATM
shopping-money|Geldbörse|wallet / purse
society-community|Generation|generation
school-education|Geschichte|history / story
health-body|Gesicht|face
health-body|Gewicht|weight
shopping-money|Gewinn|profit / prize
feelings-opinions|Gewissen|conscience
shopping-money|Girokonto|current account
feelings-opinions|Glückwunsch|congratulations
media-communication|Grafik|graphic / chart
feelings-opinions|Gratulation|congratulations
travel-transport|Grenze|border
home-living|Grundstück|plot of land / property
society-community|Gruppe|group
travel-transport|Hafen|harbour / port
leisure-sport|Halle|hall
leisure-sport|Hallenbad|indoor swimming pool
travel-transport|Halt|stop / halt
work-profession|Handel|trade / commerce
family-relationships|Haustier|pet
health-body|Haut|skin
personal-identity|Heimat|home country / homeland
work-profession|Hersteller|manufacturer
health-body|Hilfsmittel|aid / assistive device
environment-weather|Hitze|heat
environment-weather|Holz|wood
adjectives-adverbs|Höhe|height
environment-weather|Hügel|hill
food-eating-out|Imbiss|snack bar / snack
work-profession|Industrie|industry
media-communication|Inhalt|content
home-living|Inserat|advertisement
school-education|Institut|institute
school-education|Intelligenz|intelligence
school-education|Intensivkurs|intensive course
work-profession|Job|job
media-communication|Journalist|journalist
society-community|Jugend|youth
society-community|Jugendliche|young person / teenager
travel-transport|Kabine|cabin / cubicle
society-community|Kampf|struggle / fight
media-communication|Kanal|channel
work-profession|Kandidat|candidate
work-profession|Kantine|canteen
school-education|Kapitel|chapter
problems-solutions|Katastrophe|disaster
travel-transport|Kennzeichen|licence plate / identifier
family-relationships|Kindertagesstätte (Kita)|day-care centre
school-education|Klasse|class
shopping-money|Kleidung|clothing
home-living|Klingel|doorbell
health-body|Klinik|clinic
health-body|Knie|knee
health-body|Knochen|bone
media-communication|Kommentar|comment
media-communication|Kommunikation|communication
problems-solutions|Kompromiss|compromise
work-profession|Konferenz|conference
work-profession|Konkurrenz|competition
shopping-money|Konsum|consumption
media-communication|Kontakt|contact
problems-solutions|Kontrolle|check / inspection
work-profession|Kopie|copy
health-body|Kraft|strength
leisure-sport|Kunst|art
environment-weather|Kunststoff|plastic / synthetic material
school-education|Kursleiter|course instructor
environment-weather|Kälte|cold
shopping-money|Käufer|buyer / customer
home-living|Lage|location / situation
work-profession|Lager|warehouse / storage
work-profession|Leistung|performance / achievement
work-profession|Leitung|management / line
plans-goals-time|Liste|list
school-education|Literatur|literature
media-communication|Mailbox|voicemail box
work-profession|Manager|manager
shopping-money|Marke|brand
work-profession|Maschine|machine
work-profession|Material|material
media-communication|Medien|media
media-communication|Meldung|report / notification
shopping-money|Menge|quantity / amount
work-profession|Messe|trade fair
work-profession|Metall|metal
society-community|Migrant|migrant
travel-transport|Mobilität|mobility
adjectives-adverbs|Modell|model
school-education|Modul|module
technology-internet|Monitor|monitor
travel-transport|Motor|engine / motor
school-education|Muttersprache|native language
problems-solutions|Mühe|effort / trouble
environment-weather|Mülltonne|rubbish bin
shopping-money|Nachfrage|demand / enquiry
school-education|Nachhilfe|private tutoring
media-communication|Neuigkeit|news item
city-services|Notausgang|emergency exit
daily-life|Ordnung|order / tidiness
appointments-services|Paket|parcel
work-profession|Personal|staff / personnel
city-services|Postleitzahl|postal code
shopping-money|Produkt|product
shopping-money|Qualität|quality
feelings-opinions|Reaktion|reaction
society-community|Regel|rule
work-profession|Rente|pension / retirement
society-community|Rücksicht|consideration
shopping-money|Schulden|debts
problems-solutions|Schutz|protection
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
# Phase 10.2 compact format: category | lemma | English action | use | separable prefix
media-communication|abonnieren|subscribe to|t|
plans-goals-time|achten|pay attention|i|
daily-life|anhaben|wear / have on|t|an
appointments-services|annehmen|accept / assume|t|an
media-communication|ansehen|look at / watch|t|an
leisure-sport|aufführen|perform / stage|t|auf
daily-life|aufheben|pick up / keep|t|auf
problems-solutions|auflösen|dissolve / resolve|t|auf
media-communication|aufnehmen|record / admit|t|auf
daily-life|aufpassen|pay attention / look after|i|auf
problems-solutions|auftreten|occur / appear|i|auf
leisure-sport|ausgehen|go out|i|aus
daily-life|ausmachen|switch off / arrange|t|aus
problems-solutions|ausreichen|be sufficient|i|aus
media-communication|ausrichten|pass on / organise|t|aus
personal-identity|aussehen|look / appear|i|aus
plans-goals-time|auswählen|select / choose|t|aus
food-eating-out|backen|bake|t|
daily-life|baden|bathe / swim|i|
leisure-sport|basteln|do crafts|t|
home-living|bauen|build|t|
appointments-services|beachten|observe / follow|t|
society-community|begegnen|meet / encounter|i|
plans-goals-time|beginnen|begin|t|
travel-transport|begleiten|accompany|t|
society-community|begrüßen|greet / welcome|t|
shopping-money|behalten|keep|t|
health-body|beißen|bite|t|
appointments-services|benötigen|need / require|t|
media-communication|beobachten|observe|t|
work-profession|besetzen|fill / occupy|t|
work-profession|besprechen|discuss|t|
city-services|bestrafen|punish|t|
family-relationships|besuchen|visit|t|
shopping-money|betrügen|cheat / defraud|t|
health-body|bewegen|move|t|
shopping-money|bieten|offer / provide|t|
media-communication|bloggen|blog|i|
food-eating-out|braten|fry / roast|t|
media-communication|chatten|chat online|i|
technology-internet|checken|check|t|
feelings-opinions|danken|thank|i|
home-living|dekorieren|decorate|t|
daily-life|drehen|turn / rotate|t|
technology-internet|drücken|press|t|
media-communication|duzen|address informally|t|
city-services|einbrechen|break in|i|ein
plans-goals-time|einfallen|occur to / come to mind|i|ein
work-profession|einführen|introduce / implement|t|ein
family-relationships|einladen|invite|t|ein
health-body|einnehmen|take / consume|t|ein
travel-transport|einpacken|pack|t|ein
work-profession|einsetzen|deploy / use|t|ein
society-community|eintreten|enter / join|i|ein
shopping-money|einzahlen|deposit / pay in|t|ein
plans-goals-time|enden|end|i|
home-living|entfernen|remove|t|
shopping-money|enthalten|contain / include|t|
environment-weather|entsorgen|dispose of|t|
plans-goals-time|entstehen|arise / develop|i|
work-profession|entwickeln|develop|t|
media-communication|erfahren|find out / learn|t|
work-profession|erfordern|require|t|
plans-goals-time|erfüllen|fulfil / meet|t|
shopping-money|erhöhen|increase|t|
media-communication|erkennen|recognise|t|
feelings-opinions|erleben|experience|t|
problems-solutions|erleichtern|make easier / relieve|t|
plans-goals-time|erwarten|expect|t|
work-profession|eröffnen|open / inaugurate|t|
problems-solutions|fallen|fall / drop|i|
leisure-sport|fangen|catch|t|
problems-solutions|fassen|grasp / make|t|
media-communication|festhalten|record / hold on to|t|fest
plans-goals-time|feststehen|be certain / fixed|i|fest
plans-goals-time|fortsetzen|continue|t|fort
work-profession|führen|lead / manage|t|
family-relationships|füttern|feed|t|
daily-life|gebrauchen|use / need|t|
feelings-opinions|gefallen|please / appeal to|i|
travel-transport|gehen|go / walk|i|
plans-goals-time|gelingen|succeed|i|
problems-solutions|genügen|be enough|i|
plans-goals-time|geschehen|happen|i|
daily-life|gewöhnen|get used to|t|
technology-internet|googeln|search online|t|
feelings-opinions|gratulieren|congratulate|i|
daily-life|greifen|grab / reach|t|
media-communication|grüßen|greet / send regards|t|
work-profession|herstellen|produce / manufacture|t|her
media-communication|hinterlassen|leave behind / leave a message|t|
media-communication|hinweisen|point out / refer|i|hin
travel-transport|hupen|sound the horn|i|
media-communication|hören|hear / listen|t|
personal-identity|kennen|know / be familiar with|t|
society-community|kennenlernen|get to know|t|kennen
problems-solutions|klagen|complain / sue|i|
problems-solutions|klappen|work out / fold|i|
daily-life|kleben|stick / glue|t|
home-living|klingeln|ring|i|
feelings-opinions|klingen|sound|i|
home-living|klopfen|knock|i|
shopping-money|konsumieren|consume|t|
family-relationships|küssen|kiss|t|
health-body|laufen|run / walk|i|
daily-life|leben|live|i|
home-living|legen|lay / put|t|
health-body|leiden|suffer|i|
shopping-money|leihen|lend / borrow|t|
feelings-opinions|loben|praise|t|
feelings-opinions|lächeln|smile|i|
media-communication|lügen|lie|i|
media-communication|merken|notice / remember|t|
food-eating-out|mischen|mix|t|
feelings-opinions|nachdenken|think about / reflect|i|nach
daily-life|nützen|be useful / benefit|t|
work-profession|ordnen|organise / sort|t|
plans-goals-time|passen|fit / suit|i|
feelings-opinions|raten|advise / guess|t|
health-body|rauchen|smoke|i|
media-communication|reagieren|react|i|
plans-goals-time|realisieren|realise / implement|t|
environment-weather|reduzieren|reduce|t|
health-body|rennen|run|i|
appointments-services|reservieren|reserve / book|t|
health-body|riechen|smell|i|
media-communication|sagen|say / tell|t|
daily-life|sammeln|collect|t|
problems-solutions|schaffen|manage / accomplish|t|
media-communication|schauen|look / watch|t|
feelings-opinions|scheinen|seem / shine|i|
family-relationships|schenken|give as a gift|t|
home-living|schieben|push / slide|t|
leisure-sport|schießen|shoot / score|t|
feelings-opinions|schimpfen|scold / complain|i|
problems-solutions|schlagen|hit / beat|t|
personal-identity|schminken|apply make-up|t|
feelings-opinions|schreien|shout / scream|i|
media-communication|schweigen|remain silent|i|
feelings-opinions|schätzen|estimate / appreciate|t|
daily-life|schütteln|shake|t|
leisure-sport|sich amüsieren|enjoy oneself|r|
work-profession|sich anstrengen|make an effort|r|an
feelings-opinions|sich bedanken|thank someone|r|
travel-transport|sich befinden|be located / be situated|r|
work-profession|sich bemühen|make an effort / strive|r|
health-body|sich duschen|take a shower|r|
plans-goals-time|sich eignen|be suitable|r|
plans-goals-time|sich entschließen|decide / resolve|r|
plans-goals-time|sich ereignen|occur / happen|r|
problems-solutions|sich irren|be mistaken|r|
school-education|sich konzentrieren|concentrate|r|
feelings-opinions|sich langweilen|be bored|r|
shopping-money|sich lohnen|be worthwhile|r|
travel-transport|sich nähern|approach|r|
daily-life|sich rasieren|shave|r|
daily-life|sich setzen|sit down|r|
feelings-opinions|sich streiten|argue|r|
travel-transport|sich umdrehen|turn around|r|um
daily-life|sich umziehen|change clothes|r|um
family-relationships|sich verabreden|arrange to meet|r|
media-communication|sich verabschieden|say goodbye|r|
school-education|sich verbessern|improve|r|
society-community|sich verhalten|behave|r|
feelings-opinions|sich verlieben|fall in love|r|
problems-solutions|sich verstecken|hide|r|
plans-goals-time|sich verändern|change|r|
school-education|sich vorbereiten|prepare oneself|r|vor
health-body|sich waschen|wash oneself|r|
plans-goals-time|sich wünschen|wish for|r|
`);

const verbExampleRows = rows(`
# Phase 10.2 lemma | original German example | original English translation
abonnieren|Ich habe den monatlichen Newsletter der Stadt abonniert.|I subscribed to the city's monthly newsletter.
achten|Achten Sie bitte auf die Frist im Schreiben.|Please pay attention to the deadline in the letter.
anhaben|Beim Vorstellungsgespräch hatte er einen dunklen Anzug an.|He wore a dark suit to the job interview.
annehmen|Die Kundin nahm das neue Angebot nach kurzer Überlegung an.|The customer accepted the new offer after a brief consideration.
ansehen|Wir sehen uns vor dem Kauf mehrere Wohnungen an.|We are viewing several apartments before buying.
aufführen|Die Theatergruppe führt am Freitag ein neues Stück auf.|The theatre group is performing a new play on Friday.
aufheben|Bitte heben Sie die Quittung für den Umtausch auf.|Please keep the receipt for the exchange.
auflösen|Nach dem Gespräch konnten wir das Missverständnis auflösen.|After the conversation, we were able to resolve the misunderstanding.
aufnehmen|Das Gerät nimmt die mündliche Antwort automatisch auf.|The device records the oral answer automatically.
aufpassen|Kannst du morgen zwei Stunden auf die Kinder aufpassen?|Can you look after the children for two hours tomorrow?
auftreten|Das technische Problem tritt nur bei älteren Geräten auf.|The technical problem occurs only on older devices.
ausgehen|Am Samstag gehen wir mit einigen Kollegen aus.|On Saturday, we are going out with some colleagues.
ausmachen|Bitte machen Sie das Licht aus, wenn Sie den Raum verlassen.|Please switch off the light when you leave the room.
ausreichen|Für die Anmeldung reicht eine Kopie des Ausweises aus.|A copy of the identity card is sufficient for registration.
ausrichten|Können Sie Frau Klein bitte einen Gruß von mir ausrichten?|Could you please pass on my regards to Ms Klein?
aussehen|Die neue Kollegin sieht ihrer Schwester sehr ähnlich aus.|The new colleague looks very similar to her sister.
auswählen|Für die Prüfung können Sie eines von drei Themen auswählen.|You can choose one of three topics for the exam.
backen|Für das Schulfest backen wir einen großen Apfelkuchen.|We are baking a large apple cake for the school festival.
baden|Im Sommer baden viele Familien in diesem See.|Many families swim in this lake in summer.
basteln|Die Kinder basteln aus Papier kleine Laternen.|The children are making small lanterns from paper.
bauen|Die Gemeinde baut neben dem Bahnhof neue Wohnungen.|The municipality is building new apartments next to the station.
beachten|Beachten Sie bitte die Hinweise auf der Rückseite.|Please follow the instructions on the back.
begegnen|Auf dem Weg zur Arbeit begegnete ich meiner Nachbarin.|On the way to work, I met my neighbour.
beginnen|Der Intensivkurs beginnt am ersten Montag im März.|The intensive course begins on the first Monday in March.
begleiten|Eine Mitarbeiterin begleitet die Besucher durch die Fabrik.|An employee accompanies the visitors through the factory.
begrüßen|Der Kursleiter begrüßt alle neuen Teilnehmenden persönlich.|The course instructor welcomes all new participants personally.
behalten|Sie dürfen die Unterlagen nach der Beratung behalten.|You may keep the documents after the consultation.
beißen|Der Hund hat den Briefträger in die Hand gebissen.|The dog bit the postal worker on the hand.
benötigen|Für den Antrag benötigen wir zwei aktuelle Passfotos.|We need two recent passport photos for the application.
beobachten|Die Forschenden beobachten die Entwicklung über mehrere Monate.|The researchers are observing the development over several months.
besetzen|Das Unternehmen möchte die freie Stelle im April besetzen.|The company wants to fill the vacant position in April.
besprechen|Wir besprechen die Ergebnisse morgen im Team.|We will discuss the results with the team tomorrow.
bestrafen|Falschparker werden in dieser Straße konsequent bestraft.|Illegal parkers are consistently penalised on this street.
besuchen|Während der Reise besuchen wir auch das historische Rathaus.|During the trip, we are also visiting the historic town hall.
betrügen|Der Anbieter hat mehrere Kunden mit falschen Rechnungen betrogen.|The provider defrauded several customers with false invoices.
bewegen|Nach der Operation soll sie das Knie vorsichtig bewegen.|After the operation, she should move her knee carefully.
bieten|Die Volkshochschule bietet am Abend günstige Sprachkurse an.|The adult education centre offers affordable language courses in the evening.
bloggen|Er bloggt regelmäßig über nachhaltiges Reisen.|He regularly blogs about sustainable travel.
braten|Braten Sie das Gemüse fünf Minuten bei mittlerer Hitze.|Fry the vegetables over medium heat for five minutes.
chatten|Die Projektgruppe chattet jeden Abend über die nächsten Aufgaben.|The project group chats every evening about the next tasks.
checken|Ich checke vor der Fahrt noch einmal die Zugverbindung.|I am checking the train connection once more before the journey.
danken|Ich danke Ihnen für die schnelle Rückmeldung.|Thank you for the prompt response.
dekorieren|Wir dekorieren den Saal mit Blumen und bunten Lichtern.|We are decorating the hall with flowers and colourful lights.
drehen|Drehen Sie den Schalter langsam nach rechts.|Turn the switch slowly to the right.
drücken|Drücken Sie diese Taste, um das Formular zu speichern.|Press this button to save the form.
duzen|In unserem kleinen Team duzen sich alle Kolleginnen und Kollegen.|Everyone in our small team addresses one another informally.
einbrechen|In der Nacht ist jemand in das Büro eingebrochen.|Someone broke into the office during the night.
einfallen|Mir ist eine einfachere Lösung für das Problem eingefallen.|I thought of a simpler solution to the problem.
einführen|Die Firma führt ab Januar flexible Arbeitszeiten ein.|The company is introducing flexible working hours in January.
einladen|Wir laden die neuen Nachbarn am Sonntag zum Kaffee ein.|We are inviting the new neighbours for coffee on Sunday.
einnehmen|Nehmen Sie die Tabletten morgens nach dem Frühstück ein.|Take the tablets in the morning after breakfast.
einpacken|Ich packe für die Reise nur warme Kleidung ein.|I am packing only warm clothes for the trip.
einsetzen|Die Schule setzt im Unterricht neue Lernsoftware ein.|The school uses new learning software in lessons.
eintreten|Nach kurzer Wartezeit durften wir in den Saal eintreten.|After a short wait, we were allowed to enter the hall.
einzahlen|Sie können den Betrag am Automaten auf Ihr Konto einzahlen.|You can deposit the amount into your account at the machine.
enden|Die Bewerbungsfrist endet am kommenden Freitag.|The application deadline ends next Friday.
entfernen|Bitte entfernen Sie vor der Nutzung die Schutzfolie.|Please remove the protective film before use.
enthalten|Der Preis enthält Frühstück und die Nutzung des Schwimmbads.|The price includes breakfast and use of the swimming pool.
entsorgen|Alte Batterien müssen getrennt entsorgt werden.|Old batteries must be disposed of separately.
entstehen|Durch die Verspätung entstanden zusätzliche Kosten.|The delay resulted in additional costs.
entwickeln|Das Team entwickelt eine App für den öffentlichen Verkehr.|The team is developing an app for public transport.
erfahren|Den neuen Termin habe ich erst gestern erfahren.|I only found out the new date yesterday.
erfordern|Diese Aufgabe erfordert Geduld und genaue Planung.|This task requires patience and careful planning.
erfüllen|Die Bewerberin erfüllt alle Voraussetzungen für die Stelle.|The applicant meets all the requirements for the position.
erhöhen|Der Vermieter darf die Miete nicht ohne Begründung erhöhen.|The landlord may not increase the rent without giving a reason.
erkennen|Auf dem kleinen Foto konnte ich die Person kaum erkennen.|I could hardly recognise the person in the small photo.
erleben|Auf unserer Reise haben wir viele interessante Dinge erlebt.|We experienced many interesting things on our trip.
erleichtern|Eine klare Aufgabenverteilung erleichtert die Zusammenarbeit.|A clear division of tasks makes collaboration easier.
erwarten|Wir erwarten die schriftliche Bestätigung bis Mittwoch.|We expect the written confirmation by Wednesday.
eröffnen|Die Stadt eröffnet im Frühjahr eine neue Bibliothek.|The city is opening a new library in spring.
fallen|Wegen der Kälte sind die Temperaturen unter null Grad gefallen.|Because of the cold, temperatures have fallen below zero degrees.
fangen|Der Torwart fing den Ball kurz vor der Linie.|The goalkeeper caught the ball just before the line.
fassen|Nach der Diskussion fasste die Gruppe einen gemeinsamen Beschluss.|After the discussion, the group reached a joint decision.
festhalten|Bitte halten Sie die wichtigsten Ergebnisse schriftlich fest.|Please record the most important results in writing.
feststehen|Der genaue Prüfungstermin steht noch nicht fest.|The exact exam date has not yet been fixed.
fortsetzen|Nach der Pause setzen wir die Besprechung fort.|We will continue the meeting after the break.
führen|Sie führt seit zwei Jahren ein internationales Team.|She has led an international team for two years.
füttern|Während des Urlaubs füttert unser Nachbar die Katze.|Our neighbour feeds the cat while we are on holiday.
gebrauchen|Für die Reparatur kann ich dieses Werkzeug gut gebrauchen.|I can make good use of this tool for the repair.
gefallen|Der neue Kursplan gefällt den Teilnehmenden.|The participants like the new course schedule.
gehen|Vom Bahnhof gehen wir ungefähr zehn Minuten zu Fuß.|We walk for about ten minutes from the station.
gelingen|Mit guter Vorbereitung gelingt uns die Präsentation.|With good preparation, we will succeed with the presentation.
genügen|Eine Kopie des Ausweises genügt der Behörde nicht.|A copy of the identity card is not sufficient for the authority.
geschehen|Der Unfall geschah am frühen Morgen an einer Kreuzung.|The accident happened at a junction early in the morning.
gewöhnen|Nach einigen Wochen gewöhnte sie sich an die neue Arbeitszeit.|After a few weeks, she got used to the new working hours.
googeln|Vor der Buchung googeln wir die Adresse des Hotels.|We search online for the hotel's address before booking.
gratulieren|Wir gratulieren dir zur bestandenen Prüfung.|We congratulate you on passing the exam.
greifen|Greifen Sie im Notfall nach dem roten Hebel.|In an emergency, reach for the red lever.
grüßen|Bitte grüßen Sie Ihre Familie herzlich von mir.|Please give my warm regards to your family.
herstellen|Der Betrieb stellt medizinische Geräte her.|The company manufactures medical devices.
hinterlassen|Bitte hinterlassen Sie nach dem Signal eine Nachricht.|Please leave a message after the signal.
hinweisen|Die Mitarbeiterin weist auf die neue Regel hin.|The employee points out the new rule.
hupen|Vor dem Krankenhaus darf man nicht unnötig hupen.|You must not sound the horn unnecessarily outside the hospital.
hören|Im Hörtext hören Sie ein Gespräch am Bahnhof.|In the listening text, you hear a conversation at the station.
kennen|Ich kenne diese Gegend noch nicht besonders gut.|I do not know this area particularly well yet.
kennenlernen|Im Sprachkurs habe ich Menschen aus vielen Ländern kennengelernt.|I met people from many countries in the language course.
klagen|Viele Fahrgäste klagen über die langen Wartezeiten.|Many passengers complain about the long waiting times.
klappen|Die Anmeldung hat trotz des technischen Problems geklappt.|Registration worked despite the technical problem.
kleben|Kleben Sie die Briefmarke oben rechts auf den Umschlag.|Stick the stamp on the top right of the envelope.
klingeln|Bitte klingeln Sie bei Müller im zweiten Stock.|Please ring Müller on the second floor.
klingen|Der Vorschlag klingt praktisch und gut vorbereitet.|The proposal sounds practical and well prepared.
klopfen|Bevor Sie das Büro betreten, klopfen Sie bitte an.|Please knock before entering the office.
konsumieren|Viele Jugendliche konsumieren Nachrichten vor allem online.|Many young people consume news mainly online.
küssen|Zum Abschied küsste sie ihren Partner auf die Wange.|She kissed her partner on the cheek when saying goodbye.
laufen|Nach der Therapie kann er wieder ohne Schmerzen laufen.|After the therapy, he can walk again without pain.
leben|Meine Großeltern leben seit vielen Jahren auf dem Land.|My grandparents have lived in the countryside for many years.
legen|Legen Sie die ausgefüllten Formulare auf den Schreibtisch.|Place the completed forms on the desk.
leiden|Er leidet seit Tagen unter starken Kopfschmerzen.|He has been suffering from severe headaches for days.
leihen|Kannst du mir dein Fahrrad bis morgen leihen?|Can you lend me your bicycle until tomorrow?
loben|Die Chefin lobte das Team für die gute Zusammenarbeit.|The manager praised the team for working well together.
lächeln|Die Verkäuferin lächelte freundlich und bot ihre Hilfe an.|The sales assistant smiled kindly and offered her help.
lügen|Im Bewerbungsformular darf man nicht lügen.|You must not lie on the application form.
merken|Ich habe erst später gemerkt, dass die Adresse falsch war.|I only noticed later that the address was wrong.
mischen|Mischen Sie das Mehl langsam mit dem Wasser.|Mix the flour slowly with the water.
nachdenken|Ich möchte noch einen Tag über das Angebot nachdenken.|I would like to think about the offer for one more day.
nützen|Die zusätzliche Übung nützt besonders den neuen Teilnehmenden.|The additional exercise particularly benefits the new participants.
ordnen|Vor der Abgabe ordnen wir alle Unterlagen nach Datum.|Before submission, we sort all documents by date.
passen|Der neue Termin passt gut zu meinem Arbeitsplan.|The new appointment fits well with my work schedule.
raten|Die Ärztin rät mir zu einer kurzen Pause.|The doctor advises me to take a short break.
rauchen|In öffentlichen Gebäuden darf man nicht rauchen.|Smoking is not allowed in public buildings.
reagieren|Der Kundendienst reagierte schnell auf meine Nachricht.|Customer service responded quickly to my message.
realisieren|Das Projekt lässt sich nur mit zusätzlicher Förderung realisieren.|The project can only be implemented with additional funding.
reduzieren|Mit besserer Isolierung können wir den Energieverbrauch reduzieren.|We can reduce energy consumption with better insulation.
rennen|Er rannte zum Bahnsteig, erreichte den Zug aber nicht mehr.|He ran to the platform but did not catch the train.
reservieren|Ich habe für Freitagabend einen Tisch reserviert.|I reserved a table for Friday evening.
riechen|Die Küche riecht nach frischem Brot.|The kitchen smells of fresh bread.
sagen|Können Sie mir sagen, wann der nächste Bus fährt?|Can you tell me when the next bus leaves?
sammeln|Die Initiative sammelt Geld für einen neuen Spielplatz.|The initiative is collecting money for a new playground.
schaffen|Wir haben es geschafft, den Bericht rechtzeitig abzugeben.|We managed to submit the report on time.
schauen|Am Wochenende schauen wir gemeinsam einen deutschen Film.|At the weekend, we watch a German film together.
scheinen|Nach dem Gespräch scheint eine Einigung möglich.|After the conversation, an agreement seems possible.
schenken|Zum Abschied schenkte das Team ihr ein Buch.|The team gave her a book as a farewell gift.
schieben|Schieben Sie den schweren Karton nicht allein.|Do not push the heavy box by yourself.
schießen|In der letzten Minute schoss die Mannschaft das entscheidende Tor.|The team scored the decisive goal in the final minute.
schimpfen|Der Kunde schimpfte über die lange Wartezeit.|The customer complained angrily about the long waiting time.
schlagen|Der Arzt schlug eine andere Behandlung vor.|The doctor suggested a different treatment.
schminken|Für die Feier schminkt sie sich nur leicht.|She applies only light make-up for the celebration.
schreien|Bitte schreien Sie nicht, sondern erklären Sie das Problem ruhig.|Please do not shout; explain the problem calmly instead.
schweigen|Auf die schwierige Frage schwieg der Zeuge zunächst.|The witness initially remained silent in response to the difficult question.
schätzen|Wir schätzen die Reparaturkosten auf etwa fünfhundert Euro.|We estimate the repair costs at around five hundred euros.
schütteln|Vor dem Öffnen müssen Sie die Flasche kräftig schütteln.|You must shake the bottle well before opening it.
sich amüsieren|Auf dem Sommerfest haben sich alle Gäste gut amüsiert.|All the guests enjoyed themselves at the summer festival.
sich anstrengen|Wenn du dich anstrengst, kannst du die Prüfung schaffen.|If you make an effort, you can pass the exam.
sich bedanken|Sie bedankt sich bei ihrem Kollegen für die Hilfe.|She thanks her colleague for the help.
sich befinden|Das Bürgeramt befindet sich gegenüber dem Bahnhof.|The citizens' office is located opposite the station.
sich bemühen|Wir bemühen uns um eine schnelle Lösung.|We are striving for a quick solution.
sich duschen|Nach dem Sport duscht sie sich in der Umkleidekabine.|After exercising, she takes a shower in the changing room.
sich eignen|Der Raum eignet sich gut für kleine Gruppen.|The room is well suited to small groups.
sich entschließen|Nach langer Suche entschloss er sich für die kleinere Wohnung.|After a long search, he decided on the smaller apartment.
sich ereignen|Der Unfall ereignete sich am frühen Montagmorgen.|The accident occurred early on Monday morning.
sich irren|Entschuldigung, ich habe mich bei der Hausnummer geirrt.|Sorry, I was mistaken about the house number.
sich konzentrieren|Konzentrieren Sie sich auf die wichtigsten Aussagen.|Concentrate on the most important statements.
sich langweilen|Während der langen Wartezeit langweilten sich die Kinder.|The children were bored during the long wait.
sich lohnen|Die frühe Buchung lohnt sich wegen des niedrigeren Preises.|Booking early is worthwhile because of the lower price.
sich nähern|Der Zug nähert sich langsam dem Hauptbahnhof.|The train is slowly approaching the main station.
sich rasieren|Vor dem Vorstellungsgespräch rasierte er sich sorgfältig.|He shaved carefully before the job interview.
sich setzen|Bitte setzen Sie sich im Wartezimmer auf einen freien Platz.|Please sit in an available seat in the waiting room.
sich streiten|Die Nachbarn streiten sich über den Lärm.|The neighbours are arguing about the noise.
sich umdrehen|Sie drehte sich um, als jemand ihren Namen rief.|She turned around when someone called her name.
sich umziehen|Nach der Arbeit zieht sie sich für das Training um.|After work, she changes clothes for training.
sich verabreden|Ich habe mich mit einer Kollegin zum Mittagessen verabredet.|I arranged to meet a colleague for lunch.
sich verabschieden|Vor der Abreise verabschiedeten wir uns von unseren Gastgebern.|Before leaving, we said goodbye to our hosts.
sich verbessern|Durch tägliches Üben hat sich seine Aussprache verbessert.|His pronunciation improved through daily practice.
sich verhalten|Bitte verhalten Sie sich im Krankenhaus ruhig.|Please behave quietly in the hospital.
sich verlieben|Sie hat sich während des Studiums in Berlin verliebt.|She fell in love with Berlin while studying.
sich verstecken|Das Kind versteckte sich hinter der offenen Tür.|The child hid behind the open door.
sich verändern|Die Arbeitswelt hat sich durch digitale Technik stark verändert.|The world of work has changed significantly through digital technology.
sich vorbereiten|Die Gruppe bereitet sich auf die mündliche Prüfung vor.|The group is preparing for the oral exam.
sich waschen|Vor dem Essen wäscht sich das Kind gründlich die Hände.|The child washes their hands thoroughly before eating.
sich wünschen|Zum Geburtstag wünsche ich mir ein gutes Wörterbuch.|I would like a good dictionary for my birthday.
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
# Phase 10.2 format: category | adjective | English meaning | original example | translation
work-profession|aktiv|active|Sie ist im Betriebsrat sehr aktiv.|She is very active on the works council.
personal-identity|allein|alone|Nach dem Umzug wohnt er zum ersten Mal allein.|After moving, he is living alone for the first time.
work-profession|anstrengend|demanding / exhausting|Die Nachtschicht war anstrengend, aber gut organisiert.|The night shift was demanding but well organised.
feelings-opinions|ausgezeichnet|excellent|Die Beratung im Kundenzentrum war ausgezeichnet.|The consultation at the customer centre was excellent.
school-education|ausreichend|sufficient|Für die Prüfung ist eine ausreichende Vorbereitung nötig.|Sufficient preparation is necessary for the exam.
leisure-sport|beliebt|popular|Der Stadtpark ist bei Familien besonders beliebt.|The city park is especially popular with families.
media-communication|berühmt|famous|Die Autorin ist für ihre kurzen Erzählungen berühmt.|The author is famous for her short stories.
plans-goals-time|bestimmt|certain / specific|Für den Antrag gilt eine bestimmte Frist.|A specific deadline applies to the application.
shopping-money|billig|cheap|Das billigste Angebot enthält keinen Kundenservice.|The cheapest offer does not include customer service.
adjectives-adverbs|bunt|colourful|Auf dem Markt stehen viele bunte Blumen.|There are many colourful flowers at the market.
society-community|demokratisch|democratic|Die Mitglieder treffen die Entscheidung demokratisch.|The members make the decision democratically.
home-living|dicht|sealed / dense|Das neue Fenster ist endlich dicht.|The new window is finally properly sealed.
shopping-money|doppelt|double|Für den Expressversand zahlen wir den doppelten Preis.|We pay double the price for express delivery.
feelings-opinions|ehrlich|honest|Bitte geben Sie mir eine ehrliche Rückmeldung.|Please give me honest feedback.
work-profession|einheitlich|consistent / uniform|Alle Filialen verwenden ein einheitliches Formular.|All branches use a consistent form.
personal-identity|elegant|elegant|Für die Feier trägt sie ein elegantes Kleid.|She is wearing an elegant dress for the celebration.
technology-internet|elektrisch|electric|Die Firma stellt auf elektrische Lieferwagen um.|The company is switching to electric delivery vans.
plans-goals-time|endgültig|final|Die endgültige Entscheidung fällt am Montag.|The final decision will be made on Monday.
holidays-accommodation|entspannend|relaxing|Der Spaziergang am See war sehr entspannend.|The walk by the lake was very relaxing.
feelings-opinions|ernst|serious|Wir müssen dieses Problem ernst nehmen.|We must take this problem seriously.
personal-identity|erwachsen|adult / grown-up|Erwachsene Teilnehmende können den Abendkurs besuchen.|Adult participants can attend the evening course.
work-profession|fair|fair|Das Unternehmen bietet faire Arbeitsbedingungen.|The company offers fair working conditions.
problems-solutions|falsch|wrong / incorrect|Auf der Rechnung steht eine falsche Adresse.|There is an incorrect address on the invoice.
plans-goals-time|fertig|finished / ready|Der Bericht ist morgen früh fertig.|The report will be ready tomorrow morning.
environment-weather|feucht|damp / humid|Im Keller ist die Luft zu feucht.|The air in the basement is too damp.
home-living|flach|flat / shallow|Das Gebäude hat ein flaches Dach.|The building has a flat roof.
school-education|fließend|fluent|Für die Stelle sind fließende Deutschkenntnisse erwünscht.|Fluent German skills are desired for the position.
society-community|frei|free / available|Im Sprachkurs sind noch drei Plätze frei.|There are still three places available in the language course.
personal-identity|fremd|foreign / unfamiliar|Am Anfang war mir die Stadt völlig fremd.|At first, the city was completely unfamiliar to me.
food-eating-out|frisch|fresh|Im Restaurant wird täglich frisches Gemüse verarbeitet.|The restaurant uses fresh vegetables every day.
society-community|gerecht|fair / just|Die Aufgaben sollen gerecht verteilt werden.|The tasks should be distributed fairly.
shopping-money|gering|low / small|Für Studierende gilt eine geringere Gebühr.|A lower fee applies to students.
home-living|gemütlich|comfortable / cosy|Das kleine Wohnzimmer ist hell und gemütlich.|The small living room is bright and cosy.
food-eating-out|haltbar|long-lasting / non-perishable|Die Milch ist ungeöffnet noch eine Woche haltbar.|The unopened milk will keep for another week.
work-profession|hart|hard / tough|Sie arbeitet hart für ihren beruflichen Abschluss.|She works hard for her professional qualification.
environment-weather|heiß|hot|An heißen Tagen bleibt das Büro nachmittags geschlossen.|On hot days, the office remains closed in the afternoon.
home-living|hell|bright / light|Wir suchen eine helle Wohnung mit Balkon.|We are looking for a bright apartment with a balcony.
society-community|historisch|historical|Das Rathaus steht im historischen Stadtzentrum.|The town hall is in the historic city centre.
media-communication|höflich|polite|Eine höfliche Anrede ist in formellen E-Mails wichtig.|A polite form of address is important in formal emails.
plans-goals-time|ideal|ideal|Der frühe Termin ist für Berufstätige nicht ideal.|The early appointment is not ideal for working people.
city-services|illegal|illegal|Das Parken auf dem Radweg ist illegal.|Parking in the cycle lane is illegal.
school-education|intensiv|intensive|Vor der Prüfung besuche ich einen intensiven Vorbereitungskurs.|I am attending an intensive preparation course before the exam.
media-communication|interessant|interesting|Der Vortrag über nachhaltige Mobilität war interessant.|The talk about sustainable mobility was interesting.
feelings-opinions|interessiert|interested|Viele Jugendliche sind an dem Austauschprogramm interessiert.|Many young people are interested in the exchange programme.
society-community|interkulturell|intercultural|Das Zentrum organisiert einen interkulturellen Abend.|The centre is organising an intercultural evening.
personal-identity|jung|young|Das junge Unternehmen bildet jedes Jahr Lehrlinge aus.|The young company trains apprentices every year.
environment-weather|kalt|cold|Bei kaltem Wetter fahren weniger Menschen mit dem Fahrrad.|Fewer people cycle in cold weather.
problems-solutions|kaputt|broken|Der Aufzug ist seit gestern kaputt.|The lift has been broken since yesterday.
media-communication|klar|clear|Die Anleitung ist kurz und klar geschrieben.|The instructions are written briefly and clearly.
school-education|klug|clever / wise|Das war eine kluge Lösung für ein schwieriges Problem.|That was a clever solution to a difficult problem.
plans-goals-time|knapp|tight / scarce|Wegen der knappen Zeit teilen wir die Aufgaben auf.|Because time is tight, we are dividing the tasks.
appointments-services|komplett|complete|Bitte schicken Sie uns die kompletten Unterlagen.|Please send us the complete documents.
technology-internet|künstlich|artificial|Das System erkennt künstlich erzeugte Bilder.|The system detects artificially generated images.
home-living|leer|empty|Die Wohnung steht seit zwei Monaten leer.|The apartment has been empty for two months.
society-community|menschlich|human / humane|Trotz des Fehlers blieb die Reaktion menschlich und fair.|Despite the mistake, the response remained humane and fair.
home-living|möbliert|furnished|Für das Praktikum mietet sie ein möbliertes Zimmer.|She is renting a furnished room for the internship.
society-community|national|national|Die nationale Regelung gilt ab Januar.|The national regulation applies from January.
city-services|offiziell|official|Die offizielle Bestätigung kommt per Post.|The official confirmation will arrive by post.
personal-identity|persönlich|personal|Für die Anmeldung ist ein persönliches Gespräch vorgesehen.|A personal meeting is planned for registration.
shopping-money|preiswert|good value / inexpensive|Das Mittagessen in der Kantine ist frisch und preiswert.|Lunch in the canteen is fresh and inexpensive.
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
adjectives-adverbs|ausschließlich|exclusively / only|Die Beratung ist ausschließlich nach Terminvereinbarung möglich.|The consultation is available only by appointment.
home-living|außen|outside / on the exterior|Das Gebäude wird zuerst außen renoviert.|The building is being renovated on the outside first.
adjectives-adverbs|bloß|simply / merely|Das war bloß ein Missverständnis.|That was simply a misunderstanding.
connectors-prepositions|da|there / since|Da der Eingang gesperrt ist, benutzen wir die Seitentür.|Since the entrance is closed, we are using the side door.
travel-transport|dahin|there / to that place|Wie komme ich am schnellsten dahin?|How do I get there most quickly?
adjectives-adverbs|daneben|next to it / wrong|Die Apotheke ist gleich daneben.|The pharmacy is right next to it.
plans-goals-time|dauernd|constantly|Der Termin wird dauernd verschoben.|The appointment keeps being postponed.
travel-transport|dort|there|Dort können Sie direkt in die U-Bahn umsteigen.|You can change directly to the underground there.
travel-transport|drüben|over there|Die Bushaltestelle liegt drüben auf der anderen Straßenseite.|The bus stop is over there on the other side of the street.
adjectives-adverbs|eben|just / simply|Dann müssen wir eben eine andere Lösung finden.|Then we simply have to find another solution.
connectors-prepositions|ebenso|likewise / equally|Die Sicherheit ist ebenso wichtig wie der Preis.|Safety is just as important as the price.
adjectives-adverbs|eher|rather / more likely|Ich würde eher den späteren Zug nehmen.|I would rather take the later train.
adjectives-adverbs|eigentlich|actually|Eigentlich wollte ich den Antrag online stellen.|I actually wanted to submit the application online.
plans-goals-time|einmal|once / one time|Lesen Sie den Text bitte noch einmal.|Please read the text once more.
connectors-prepositions|einschließlich|including|Der Preis beträgt achtzig Euro einschließlich Frühstück.|The price is eighty euros including breakfast.
adjectives-adverbs|etwa|approximately / perhaps|Die Reparatur dauert etwa zwei Stunden.|The repair takes approximately two hours.
adjectives-adverbs|extra|separately / especially|Für den Versand müssen Sie extra bezahlen.|You have to pay separately for shipping.
adjectives-adverbs|gar|at all / even|Ohne Bestätigung kann ich gar nichts planen.|I cannot plan anything at all without confirmation.
plans-goals-time|gerade|just now / currently|Die zuständige Kollegin ist gerade in einer Besprechung.|The responsible colleague is currently in a meeting.
plans-goals-time|gestern|yesterday|Gestern ist die schriftliche Zusage angekommen.|The written confirmation arrived yesterday.
adjectives-adverbs|insgesamt|in total / overall|Insgesamt nehmen vierzig Personen an der Fortbildung teil.|A total of forty people are taking part in the training.
plans-goals-time|irgendwann|at some point|Irgendwann möchte ich im Ausland arbeiten.|At some point, I would like to work abroad.
adjectives-adverbs|jeweils|in each case / respectively|Die Gruppen haben jeweils zwanzig Minuten Zeit.|Each group has twenty minutes.
society-community|miteinander|with one another|Im Team müssen alle offen miteinander sprechen.|Everyone on the team must speak openly with one another.
plans-goals-time|möglichst|as far as possible|Bitte schicken Sie die Unterlagen möglichst früh.|Please send the documents as early as possible.
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
weil|because|Wir fahren mit der Bahn, weil die Autobahn gesperrt ist.|We are travelling by train because the motorway is closed.|de-b1-subordinate-clauses
da|since / because|Da noch Fragen offen sind, vereinbaren wir einen zweiten Termin.|Since some questions remain open, we are arranging a second appointment.|de-b1-subordinate-clauses
zum einen ... zum anderen|on the one hand ... on the other hand|Zum einen spart der Plan Zeit, zum anderen senkt er die Kosten.|On the one hand, the plan saves time; on the other hand, it reduces costs.|de-b1-cohesive-connectors|andererseits
darüber hinaus|furthermore|Der Kurs ist praxisnah; darüber hinaus bietet er flexible Termine.|The course is practical; furthermore, it offers flexible dates.|de-b1-cohesive-connectors|außerdem
im Gegensatz dazu|in contrast|Viele fahren mit dem Auto; im Gegensatz dazu nutze ich meist die Bahn.|Many people drive; in contrast, I usually take the train.|de-b1-cohesive-connectors|Gegensatz
aus diesem Grund|for this reason|Die Frist endet heute; aus diesem Grund antworte ich sofort.|The deadline ends today; for this reason, I am replying immediately.|de-b1-main-clause-connectors|Grund
beispielsweise|for example|Viele Aufgaben, beispielsweise die Anmeldung, lassen sich online erledigen.|Many tasks, such as registration, can be completed online.|de-b1-cohesive-connectors|Beispiel
dadurch|as a result / thereby|Wir teilen die Aufgaben; dadurch sind wir schneller fertig.|We divide the tasks; as a result, we finish more quickly.|de-b1-main-clause-connectors|damit
schließlich|finally / after all|Wir haben lange verglichen und schließlich das günstigere Angebot gewählt.|We compared for a long time and finally chose the cheaper offer.|de-b1-main-clause-connectors
weshalb|which is why / why|Der Zug fällt aus, weshalb wir einen Ersatzbus nehmen.|The train is cancelled, which is why we are taking a replacement bus.|de-b1-subordinate-clauses
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
ohne|without|Ohne gültigen Ausweis ist die Abholung nicht möglich.|Collection is not possible without a valid identity card.|de-b1-case-articles
von|from / of|Die Bestätigung kommt direkt von der Behörde.|The confirmation comes directly from the public authority.|de-b1-case-articles
vor|in front of / before|Vor dem Gespräch bereite ich meine Fragen vor.|I prepare my questions before the meeting.|de-b1-two-way-local-temporal-prepositions
zwischen|between|Die Praxis liegt zwischen der Bank und der Post.|The medical practice is between the bank and the post office.|de-b1-two-way-local-temporal-prepositions
über|over / about|Wir sprechen über die neuen Arbeitszeiten.|We are talking about the new working hours.|de-b1-two-way-local-temporal-prepositions
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
bezug-auf-ihre-anzeige|With reference to your advertisement|Ich nehme Bezug auf Ihre Anzeige vom ...|Ich nehme Bezug auf Ihre Anzeige vom 12. Oktober.|I am writing with reference to your advertisement of 12 October.|Anzeige|de-b1-noun-verb-writing
ich-schreibe-ihnen-weil|I am writing to you because|Ich schreibe Ihnen, weil ...|Ich schreibe Ihnen, weil ich weitere Informationen zum Kurs brauche.|I am writing to you because I need more information about the course.|schreiben|de-b1-subordinate-clauses
waere-ihnen-dankbar|I would be grateful if|Ich wäre Ihnen dankbar, wenn ...|Ich wäre Ihnen dankbar, wenn Sie mir den Termin bestätigen könnten.|I would be grateful if you could confirm the appointment.|dankbar|de-b1-konjunktiv-ii
leider-mitteilen|Unfortunately, I have to inform you that|Leider muss ich Ihnen mitteilen, dass ...|Leider muss ich Ihnen mitteilen, dass ich die Reise absagen muss.|Unfortunately, I have to inform you that I must cancel the trip.|mitteilen|de-b1-subordinate-clauses
aufgrund-von|Due to|Aufgrund von ...|Aufgrund von Krankheit kann ich morgen nicht teilnehmen.|Due to illness, I cannot take part tomorrow.|Grund|de-b1-genitive-basics
entschuldigen-unannehmlichkeiten|Please excuse the inconvenience|Bitte entschuldigen Sie die Unannehmlichkeiten.|Bitte entschuldigen Sie die Unannehmlichkeiten durch die kurzfristige Änderung.|Please excuse the inconvenience caused by the last-minute change.|Entschuldigung|de-b1-noun-verb-writing
bitte-um-ersatz|I therefore request a replacement|Daher bitte ich um Ersatz.|Das Gerät funktioniert nicht; daher bitte ich um Ersatz.|The device does not work, so I am requesting a replacement.|Ersatz|de-b1-prepositional-verbs
erwarte-antwort|I look forward to a prompt reply|Ich erwarte Ihre baldige Antwort.|Ich erwarte Ihre baldige Antwort zu meiner Beschwerde.|I look forward to a prompt reply to my complaint.|Antwort|de-b1-noun-verb-writing
im-voraus-bedanken|I would like to thank you in advance|Im Voraus möchte ich mich für ... bedanken.|Im Voraus möchte ich mich für Ihre Hilfe bedanken.|I would like to thank you in advance for your help.|Dank|de-b1-prepositional-verbs
fuer-rueckfragen|I am available for further questions|Für Rückfragen stehe ich gern zur Verfügung.|Für Rückfragen stehe ich Ihnen telefonisch zur Verfügung.|I am available by telephone if you have any further questions.|Frage|de-b1-prepositional-verbs
meiner-erfahrung-nach|In my experience|Meiner Erfahrung nach ...|Meiner Erfahrung nach lernt man in kleinen Gruppen schneller.|In my experience, people learn more quickly in small groups.|Erfahrung|de-b1-cohesive-connectors
meiner-auffassung-nach|In my view|Meiner Auffassung nach ...|Meiner Auffassung nach sollte die Stadt mehr Radwege bauen.|In my view, the city should build more cycle paths.|Meinung|de-b1-cohesive-connectors
halte-es-fuer-sinnvoll|I consider it sensible to|Ich halte es für sinnvoll, ... zu ...|Ich halte es für sinnvoll, die Öffnungszeiten zu verlängern.|I consider it sensible to extend the opening hours.|halten|de-b1-purpose-um-zu-damit
was-mich-betrifft|As far as I am concerned|Was mich betrifft, ...|Was mich betrifft, ist der spätere Termin besser.|As far as I am concerned, the later appointment is better.|Meinung|de-b1-cohesive-connectors
hinzu-kommt|In addition|Hinzu kommt, dass ...|Hinzu kommt, dass die Fahrt am Wochenende günstiger ist.|In addition, the journey is cheaper at the weekend.|kommen|de-b1-subordinate-clauses
beispiel-dafuer|An example of this is|Ein Beispiel dafür ist ...|Ein Beispiel dafür ist das neue Leihfahrradsystem.|An example of this is the new bicycle-sharing system.|Beispiel|de-b1-cohesive-connectors
hauptvorteil-besteht|The main advantage is|Der Hauptvorteil besteht darin, dass ...|Der Hauptvorteil besteht darin, dass alle flexibel bleiben.|The main advantage is that everyone remains flexible.|Vorteil|de-b1-subordinate-clauses
nachteil-besteht|One disadvantage is|Ein Nachteil besteht darin, dass ...|Ein Nachteil besteht darin, dass zusätzliche Kosten entstehen.|One disadvantage is that additional costs arise.|Nachteil|de-b1-subordinate-clauses
entscheidend-ist|The decisive point is|Entscheidend ist, dass ...|Entscheidend ist, dass die Lösung für alle bezahlbar bleibt.|The decisive point is that the solution remains affordable for everyone.|Entscheidung|de-b1-subordinate-clauses
zusammenfassend-bin-ich|In conclusion, I believe that|Zusammenfassend bin ich der Meinung, dass ...|Zusammenfassend bin ich der Meinung, dass die Vorteile überwiegen.|In conclusion, I believe that the advantages outweigh the disadvantages.|Meinung|de-b1-subordinate-clauses
schlage-folgendes-vor|I suggest the following|Ich schlage Folgendes vor: ...|Ich schlage Folgendes vor: Wir treffen uns um neun Uhr am Bahnhof.|I suggest the following: We meet at nine o'clock at the station.|Vorschlag|de-b1-noun-verb-writing
waere-das-moeglich|Would that be possible for you|Wäre ... für dich möglich?|Wäre ein Treffen am Donnerstagabend für dich möglich?|Would a meeting on Thursday evening be possible for you?|Vorschlag|de-b1-konjunktiv-ii
was-haeltst-du-davon|What do you think of|Was hältst du davon, wenn ...?|Was hältst du davon, wenn wir die Aufgaben teilen?|What do you think of dividing the tasks?|halten|de-b1-indirect-questions
darauf-einigen-dass|Let us agree that|Lass uns darauf einigen, dass ...|Lass uns darauf einigen, dass jeder einen Teil vorbereitet.|Let us agree that everyone prepares one part.|einig-|de-b1-subordinate-clauses
ich-uebernehme|I will take care of|Ich übernehme ...|Ich übernehme die Reservierung und informiere die Gruppe.|I will take care of the reservation and inform the group.|übernehmen|de-b1-noun-verb-writing
koenntest-du-dich-kuemmern|Could you take care of|Könntest du dich um ... kümmern?|Könntest du dich um die Einladungen kümmern?|Could you take care of the invitations?|sich kümmern|de-b1-prepositional-verbs
zuerst-dann-schliesslich|First, then, and finally|Zuerst ..., dann ..., und schließlich ...|Zuerst sammeln wir Ideen, dann verteilen wir die Aufgaben, und schließlich prüfen wir den Plan.|First we collect ideas, then we assign the tasks, and finally we check the plan.|schließlich|de-b1-cohesive-connectors
darf-ich-nachfragen|May I ask briefly|Darf ich kurz nachfragen, ...?|Darf ich kurz nachfragen, wann die Sitzung beginnt?|May I ask briefly when the meeting begins?|fragen|de-b1-indirect-questions
wenn-richtig-verstehe|If I understand you correctly|Wenn ich Sie richtig verstehe, ...|Wenn ich Sie richtig verstehe, findet der Kurs online statt.|If I understand you correctly, the course takes place online.|Verständnis|de-b1-subordinate-clauses
damit-meinen-sie|Do you mean by that that|Meinen Sie damit, dass ...?|Meinen Sie damit, dass wir die Unterlagen noch einmal schicken sollen?|Do you mean that we should send the documents again?|meinen|de-b1-indirect-questions
`);

module.exports = {
  nounRows,
  verbRows,
  verbExampleRows,
  adjectiveRows,
  adverbRows,
  connectorRows,
  prepositionRows,
  phraseRows,
};
