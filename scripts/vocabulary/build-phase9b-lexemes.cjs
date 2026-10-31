const fs = require("fs");
const path = require("path");

const nounRows = String.raw`
personal-identity|geburtstag|birthday|Geburtstag|der|masculine|die Geburtstage
personal-identity|geschlecht|gender|Geschlecht|das|neuter|die Geschlechter
personal-identity|familienname|family name|Familienname|der|masculine|die Familiennamen
personal-identity|formular|form|Formular|das|neuter|die Formulare
personal-identity|reisepass|passport|Reisepass|der|masculine|die Reisepässe
personal-identity|herkunft|origin / background|Herkunft|die|feminine|no-plural
personal-identity|anmeldung|registration|Anmeldung|die|feminine|die Anmeldungen
personal-identity|staatsbuerger|citizen|Staatsbürger|der|masculine|die Staatsbürger
personal-identity|alter|age|Alter|das|neuter|no-plural
personal-identity|wohnort|place of residence|Wohnort|der|masculine|die Wohnorte
family-relationships|bruder|brother|Bruder|der|masculine|die Brüder
family-relationships|schwester|sister|Schwester|die|feminine|die Schwestern
family-relationships|mutter|mother|Mutter|die|feminine|die Mütter
family-relationships|vater|father|Vater|der|masculine|die Väter
family-relationships|sohn|son|Sohn|der|masculine|die Söhne
family-relationships|tochter|daughter|Tochter|die|feminine|die Töchter
family-relationships|grosseltern|grandparents|Großeltern|die|plural|plural-only
family-relationships|geschwister|siblings|Geschwister|die|plural|plural-only
family-relationships|ehe|marriage|Ehe|die|feminine|die Ehen
family-relationships|scheidung|divorce|Scheidung|die|feminine|die Scheidungen
family-relationships|freund|male friend / boyfriend|Freund|der|masculine|die Freunde
family-relationships|freundin|female friend / girlfriend|Freundin|die|feminine|die Freundinnen
home-living|balkon|balcony|Balkon|der|masculine|die Balkone
home-living|kueche|kitchen|Küche|die|feminine|die Küchen
home-living|badezimmer|bathroom|Badezimmer|das|neuter|die Badezimmer
home-living|schlafzimmer|bedroom|Schlafzimmer|das|neuter|die Schlafzimmer
home-living|wohnzimmer|living room|Wohnzimmer|das|neuter|die Wohnzimmer
home-living|keller|basement / cellar|Keller|der|masculine|die Keller
home-living|dach|roof|Dach|das|neuter|die Dächer
home-living|garten|garden|Garten|der|masculine|die Gärten
home-living|heizung|heating system|Heizung|die|feminine|die Heizungen
home-living|mieter|tenant|Mieter|der|masculine|die Mieter
home-living|nebenkosten|additional housing costs|Nebenkosten|die|plural|plural-only
home-living|schluessel|key|Schlüssel|der|masculine|die Schlüssel
home-living|tuer|door|Tür|die|feminine|die Türen
home-living|fenster|window|Fenster|das|neuter|die Fenster
home-living|treppe|stairs / staircase|Treppe|die|feminine|die Treppen
home-living|stockwerk|floor / storey|Stockwerk|das|neuter|die Stockwerke
home-living|flaeche|area / floor space|Fläche|die|feminine|die Flächen
home-living|umzug|move / relocation|Umzug|der|masculine|die Umzüge
home-living|hausmeister|caretaker / building manager|Hausmeister|der|masculine|die Hausmeister
home-living|einrichtung|furnishings / facilities|Einrichtung|die|feminine|die Einrichtungen
daily-life|kalender|calendar|Kalender|der|masculine|die Kalender
daily-life|wecker|alarm clock|Wecker|der|masculine|die Wecker
daily-life|feierabend|end of the working day|Feierabend|der|masculine|die Feierabende
daily-life|wochenende|weekend|Wochenende|das|neuter|die Wochenenden
daily-life|einkauf|shopping / purchase|Einkauf|der|masculine|die Einkäufe
daily-life|waesche|laundry|Wäsche|die|feminine|no-plural
daily-life|geschirr|dishes / tableware|Geschirr|das|neuter|no-plural
daily-life|tagesablauf|daily routine|Tagesablauf|der|masculine|die Tagesabläufe
daily-life|morgen|morning|Morgen|der|masculine|die Morgen
daily-life|mittag|midday|Mittag|der|masculine|die Mittage
daily-life|puenktlichkeit|punctuality|Pünktlichkeit|die|feminine|no-plural
food-eating-out|brot|bread|Brot|das|neuter|die Brote
food-eating-out|broetchen|bread roll|Brötchen|das|neuter|die Brötchen
food-eating-out|kaese|cheese|Käse|der|masculine|no-plural
food-eating-out|wurst|sausage|Wurst|die|feminine|die Würste
food-eating-out|fleisch|meat|Fleisch|das|neuter|no-plural
food-eating-out|gemuese|vegetables|Gemüse|das|neuter|no-plural
food-eating-out|obst|fruit|Obst|das|neuter|no-plural
food-eating-out|kartoffel|potato|Kartoffel|die|feminine|die Kartoffeln
food-eating-out|reis|rice|Reis|der|masculine|no-plural
food-eating-out|suppe|soup|Suppe|die|feminine|die Suppen
food-eating-out|salat|salad|Salat|der|masculine|die Salate
food-eating-out|kuchen|cake|Kuchen|der|masculine|die Kuchen
food-eating-out|fruehstueck|breakfast|Frühstück|das|neuter|die Frühstücke
food-eating-out|mittagessen|lunch|Mittagessen|das|neuter|die Mittagessen
food-eating-out|abendessen|dinner / evening meal|Abendessen|das|neuter|die Abendessen
food-eating-out|restaurant|restaurant|Restaurant|das|neuter|die Restaurants
food-eating-out|kellner|waiter|Kellner|der|masculine|die Kellner
food-eating-out|hunger|hunger|Hunger|der|masculine|no-plural
food-eating-out|durst|thirst|Durst|der|masculine|no-plural
food-eating-out|geschmack|taste / flavour|Geschmack|der|masculine|die Geschmäcker
shopping-money|geld|money|Geld|das|neuter|die Gelder
shopping-money|euro|euro|Euro|der|masculine|die Euro
shopping-money|cent|cent|Cent|der|masculine|die Cent
shopping-money|konto|bank account|Konto|das|neuter|die Konten
shopping-money|kreditkarte|credit card|Kreditkarte|die|feminine|die Kreditkarten
shopping-money|bargeld|cash|Bargeld|das|neuter|no-plural
shopping-money|wechselgeld|change|Wechselgeld|das|neuter|no-plural
shopping-money|geschaeft|shop / business|Geschäft|das|neuter|die Geschäfte
shopping-money|laden|shop|Laden|der|masculine|die Läden
shopping-money|markt|market|Markt|der|masculine|die Märkte
shopping-money|verkaeufer|salesperson|Verkäufer|der|masculine|die Verkäufer
shopping-money|kunde|customer|Kunde|der|masculine|die Kunden
shopping-money|groesse|size|Größe|die|feminine|die Größen
shopping-money|ware|goods / merchandise|Ware|die|feminine|die Waren
shopping-money|kassenbon|sales receipt|Kassenbon|der|masculine|die Kassenbons
work-profession|beruf|profession / occupation|Beruf|der|masculine|die Berufe
work-profession|firma|company|Firma|die|feminine|die Firmen
work-profession|betrieb|business / workplace|Betrieb|der|masculine|die Betriebe
work-profession|chef|boss / manager|Chef|der|masculine|die Chefs
work-profession|mitarbeiter|employee / staff member|Mitarbeiter|der|masculine|die Mitarbeiter
work-profession|arbeitsplatz|workplace|Arbeitsplatz|der|masculine|die Arbeitsplätze
work-profession|arbeitszeit|working hours|Arbeitszeit|die|feminine|die Arbeitszeiten
work-profession|vertrag|contract|Vertrag|der|masculine|die Verträge
work-profession|abteilung|department|Abteilung|die|feminine|die Abteilungen
work-profession|projekt|project|Projekt|das|neuter|die Projekte
work-profession|erfahrung|experience|Erfahrung|die|feminine|die Erfahrungen
work-profession|qualifikation|qualification|Qualifikation|die|feminine|die Qualifikationen
work-profession|zeugnis|certificate / reference|Zeugnis|das|neuter|die Zeugnisse
work-profession|praktikum|internship|Praktikum|das|neuter|die Praktika
work-profession|arbeitslosigkeit|unemployment|Arbeitslosigkeit|die|feminine|no-plural
work-profession|rentner|retired person|Rentner|der|masculine|die Rentner
work-profession|schicht|work shift|Schicht|die|feminine|die Schichten
work-profession|kuendigung|notice / termination|Kündigung|die|feminine|die Kündigungen
work-profession|urlaubstag|day of leave|Urlaubstag|der|masculine|die Urlaubstage
work-profession|besprechung|meeting|Besprechung|die|feminine|die Besprechungen
work-profession|verantwortung|responsibility|Verantwortung|die|feminine|die Verantwortungen
work-profession|bewerbungsgespraech|job interview|Bewerbungsgespräch|das|neuter|die Bewerbungsgespräche
work-profession|karriere|career|Karriere|die|feminine|die Karrieren
work-profession|lohn|wage / pay|Lohn|der|masculine|die Löhne
work-profession|ueberstunde|overtime hour|Überstunde|die|feminine|die Überstunden
school-education|unterricht|lesson / instruction|Unterricht|der|masculine|no-plural
school-education|lehrer|teacher|Lehrer|der|masculine|die Lehrer
school-education|schueler|pupil / student|Schüler|der|masculine|die Schüler
school-education|student|university student|Student|der|masculine|die Studenten
school-education|universitaet|university|Universität|die|feminine|die Universitäten
school-education|hochschule|university / college|Hochschule|die|feminine|die Hochschulen
school-education|fach|subject / field|Fach|das|neuter|die Fächer
school-education|sprache|language|Sprache|die|feminine|die Sprachen
school-education|woerterbuch|dictionary|Wörterbuch|das|neuter|die Wörterbücher
school-education|heft|exercise book / notebook|Heft|das|neuter|die Hefte
school-education|tafel|board|Tafel|die|feminine|die Tafeln
school-education|ergebnis|result|Ergebnis|das|neuter|die Ergebnisse
school-education|zertifikat|certificate|Zertifikat|das|neuter|die Zertifikate
school-education|kenntnis|knowledge / skill|Kenntnis|die|feminine|die Kenntnisse
school-education|abschluss|qualification / completion|Abschluss|der|masculine|die Abschlüsse
school-education|schulabschluss|school-leaving qualification|Schulabschluss|der|masculine|die Schulabschlüsse
school-education|hausaufgabe|homework task|Hausaufgabe|die|feminine|die Hausaufgaben
travel-transport|bus|bus|Bus|der|masculine|die Busse
travel-transport|strassenbahn|tram|Straßenbahn|die|feminine|die Straßenbahnen
travel-transport|u-bahn|underground train / subway|U-Bahn|die|feminine|die U-Bahnen
travel-transport|flughafen|airport|Flughafen|der|masculine|die Flughäfen
travel-transport|flugzeug|aeroplane|Flugzeug|das|neuter|die Flugzeuge
travel-transport|fahrrad|bicycle|Fahrrad|das|neuter|die Fahrräder
travel-transport|auto|car|Auto|das|neuter|die Autos
travel-transport|taxi|taxi|Taxi|das|neuter|die Taxis
travel-transport|haltestelle|stop / station|Haltestelle|die|feminine|die Haltestellen
travel-transport|gleis|platform track|Gleis|das|neuter|die Gleise
travel-transport|abfahrt|departure|Abfahrt|die|feminine|die Abfahrten
travel-transport|ankunft|arrival|Ankunft|die|feminine|die Ankünfte
travel-transport|verspaetung|delay|Verspätung|die|feminine|die Verspätungen
travel-transport|anschluss|connection|Anschluss|der|masculine|die Anschlüsse
travel-transport|richtung|direction|Richtung|die|feminine|die Richtungen
travel-transport|strecke|route / distance|Strecke|die|feminine|die Strecken
travel-transport|weg|way / route|Weg|der|masculine|die Wege
travel-transport|kreuzung|junction / intersection|Kreuzung|die|feminine|die Kreuzungen
travel-transport|ampel|traffic light|Ampel|die|feminine|die Ampeln
travel-transport|autobahn|motorway / highway|Autobahn|die|feminine|die Autobahnen
travel-transport|koffer|suitcase|Koffer|der|masculine|die Koffer
travel-transport|gepaeck|luggage|Gepäck|das|neuter|no-plural
travel-transport|passagier|passenger|Passagier|der|masculine|die Passagiere
travel-transport|fahrer|driver|Fahrer|der|masculine|die Fahrer
travel-transport|fahrplan|timetable|Fahrplan|der|masculine|die Fahrpläne
travel-transport|rueckfahrt|return journey|Rückfahrt|die|feminine|die Rückfahrten
travel-transport|einzelfahrkarte|single ticket|Einzelfahrkarte|die|feminine|die Einzelfahrkarten
city-services|behoerde|public authority|Behörde|die|feminine|die Behörden
city-services|buergeramt|citizens' office|Bürgeramt|das|neuter|die Bürgerämter
city-services|post|post office / mail|Post|die|feminine|no-plural
city-services|bank|bank|Bank|die|feminine|die Banken
city-services|krankenhaus|hospital|Krankenhaus|das|neuter|die Krankenhäuser
city-services|kindergarten|kindergarten|Kindergarten|der|masculine|die Kindergärten
city-services|museum|museum|Museum|das|neuter|die Museen
city-services|theater|theatre|Theater|das|neuter|die Theater
city-services|kirche|church|Kirche|die|feminine|die Kirchen
city-services|park|park|Park|der|masculine|die Parks
city-services|schwimmbad|swimming pool|Schwimmbad|das|neuter|die Schwimmbäder
city-services|strasse|street|Straße|die|feminine|die Straßen
city-services|platz|square / place|Platz|der|masculine|die Plätze
city-services|zentrum|centre|Zentrum|das|neuter|die Zentren
city-services|stadtplan|city map|Stadtplan|der|masculine|die Stadtpläne
city-services|oeffnungszeit|opening time|Öffnungszeit|die|feminine|die Öffnungszeiten
city-services|sprechstunde|office hour / consultation time|Sprechstunde|die|feminine|die Sprechstunden
city-services|gemeinde|municipality / community|Gemeinde|die|feminine|die Gemeinden
city-services|buergermeister|mayor|Bürgermeister|der|masculine|die Bürgermeister
city-services|einwohner|resident|Einwohner|der|masculine|die Einwohner
city-services|notruf|emergency call|Notruf|der|masculine|die Notrufe
city-services|muellabfuhr|waste collection|Müllabfuhr|die|feminine|die Müllabfuhren
city-services|baustelle|construction site|Baustelle|die|feminine|die Baustellen
health-body|koerper|body|Körper|der|masculine|die Körper
health-body|kopf|head|Kopf|der|masculine|die Köpfe
health-body|hals|neck / throat|Hals|der|masculine|die Hälse
health-body|ruecken|back|Rücken|der|masculine|die Rücken
health-body|bauch|stomach / abdomen|Bauch|der|masculine|die Bäuche
health-body|arm|arm|Arm|der|masculine|die Arme
health-body|bein|leg|Bein|das|neuter|die Beine
health-body|hand|hand|Hand|die|feminine|die Hände
health-body|fuss|foot|Fuß|der|masculine|die Füße
health-body|herz|heart|Herz|das|neuter|die Herzen
health-body|fieber|fever|Fieber|das|neuter|no-plural
health-body|husten|cough|Husten|der|masculine|no-plural
health-body|erkaeltung|cold / respiratory infection|Erkältung|die|feminine|die Erkältungen
health-body|grippe|flu|Grippe|die|feminine|no-plural
health-body|unfall|accident|Unfall|der|masculine|die Unfälle
health-body|verletzung|injury|Verletzung|die|feminine|die Verletzungen
health-body|behandlung|treatment|Behandlung|die|feminine|die Behandlungen
health-body|untersuchung|medical examination|Untersuchung|die|feminine|die Untersuchungen
health-body|rezept|prescription|Rezept|das|neuter|die Rezepte
health-body|tablette|tablet / pill|Tablette|die|feminine|die Tabletten
health-body|salbe|ointment|Salbe|die|feminine|die Salben
health-body|praxis|medical practice|Praxis|die|feminine|die Praxen
health-body|patient|patient|Patient|der|masculine|die Patienten
health-body|krankenversicherung|health insurance|Krankenversicherung|die|feminine|die Krankenversicherungen
health-body|notaufnahme|emergency department|Notaufnahme|die|feminine|die Notaufnahmen
health-body|blut|blood|Blut|das|neuter|no-plural
health-body|ernaehrung|nutrition / diet|Ernährung|die|feminine|no-plural
health-body|bewegung|movement / exercise|Bewegung|die|feminine|die Bewegungen
appointments-services|kundendienst|customer service|Kundendienst|der|masculine|die Kundendienste
appointments-services|service|service|Service|der|masculine|die Services
appointments-services|lieferung|delivery|Lieferung|die|feminine|die Lieferungen
appointments-services|garantie|guarantee / warranty|Garantie|die|feminine|die Garantien
appointments-services|beschwerde|complaint|Beschwerde|die|feminine|die Beschwerden
appointments-services|frist|deadline|Frist|die|feminine|die Fristen
appointments-services|wartezeit|waiting time|Wartezeit|die|feminine|die Wartezeiten
appointments-services|auskunft|information / enquiry desk|Auskunft|die|feminine|die Auskünfte
appointments-services|schalter|counter / service desk|Schalter|der|masculine|die Schalter
appointments-services|aenderung|change / amendment|Änderung|die|feminine|die Änderungen
appointments-services|stoerung|fault / disruption|Störung|die|feminine|die Störungen
appointments-services|geraet|device / appliance|Gerät|das|neuter|die Geräte
appointments-services|handwerker|tradesperson / repair worker|Handwerker|der|masculine|die Handwerker
appointments-services|ersatz|replacement|Ersatz|der|masculine|no-plural
media-communication|radio|radio|Radio|das|neuter|die Radios
media-communication|fernsehen|television|Fernsehen|das|neuter|no-plural
media-communication|e-mail|email|E-Mail|die|feminine|die E-Mails
media-communication|brief|letter|Brief|der|masculine|die Briefe
media-communication|telefon|telephone|Telefon|das|neuter|die Telefone
media-communication|handy|mobile phone|Handy|das|neuter|die Handys
media-communication|sendung|broadcast / programme|Sendung|die|feminine|die Sendungen
media-communication|programm|programme|Programm|das|neuter|die Programme
media-communication|artikel|article|Artikel|der|masculine|die Artikel
media-communication|anzeige|advertisement / notice|Anzeige|die|feminine|die Anzeigen
media-communication|werbung|advertising|Werbung|die|feminine|die Werbungen
media-communication|information|information|Information|die|feminine|die Informationen
media-communication|mitteilung|message / notification|Mitteilung|die|feminine|die Mitteilungen
media-communication|diskussion|discussion|Diskussion|die|feminine|die Diskussionen
media-communication|interview|interview|Interview|das|neuter|die Interviews
media-communication|presse|press / media|Presse|die|feminine|no-plural
media-communication|leser|reader|Leser|der|masculine|die Leser
media-communication|zuhoerer|listener|Zuhörer|der|masculine|die Zuhörer
media-communication|verbindung|connection|Verbindung|die|feminine|die Verbindungen
media-communication|empfang|reception / signal|Empfang|der|masculine|no-plural
technology-internet|laptop|laptop|Laptop|der|masculine|die Laptops
technology-internet|smartphone|smartphone|Smartphone|das|neuter|die Smartphones
technology-internet|drucker|printer|Drucker|der|masculine|die Drucker
technology-internet|tastatur|keyboard|Tastatur|die|feminine|die Tastaturen
technology-internet|maus|computer mouse|Maus|die|feminine|die Mäuse
technology-internet|internetanschluss|internet connection|Internetanschluss|der|masculine|die Internetanschlüsse
technology-internet|app|app|App|die|feminine|die Apps
technology-internet|e-mail-adresse|email address|E-Mail-Adresse|die|feminine|die E-Mail-Adressen
technology-internet|netzwerk|network|Netzwerk|das|neuter|die Netzwerke
technology-internet|software|software|Software|die|feminine|no-plural
leisure-sport|spiel|game|Spiel|das|neuter|die Spiele
leisure-sport|musik|music|Musik|die|feminine|no-plural
leisure-sport|film|film / movie|Film|der|masculine|die Filme
leisure-sport|kino|cinema|Kino|das|neuter|die Kinos
leisure-sport|konzert|concert|Konzert|das|neuter|die Konzerte
leisure-sport|ausstellung|exhibition|Ausstellung|die|feminine|die Ausstellungen
leisure-sport|buehne|stage|Bühne|die|feminine|die Bühnen
leisure-sport|buch|book|Buch|das|neuter|die Bücher
leisure-sport|roman|novel|Roman|der|masculine|die Romane
leisure-sport|fotografie|photography|Fotografie|die|feminine|die Fotografien
leisure-sport|sport|sport|Sport|der|masculine|no-plural
leisure-sport|fussball|football / soccer|Fußball|der|masculine|die Fußbälle
leisure-sport|schwimmen|swimming|Schwimmen|das|neuter|no-plural
leisure-sport|radfahren|cycling|Radfahren|das|neuter|no-plural
leisure-sport|spaziergang|walk / stroll|Spaziergang|der|masculine|die Spaziergänge
leisure-sport|eintrittskarte|admission ticket|Eintrittskarte|die|feminine|die Eintrittskarten
holidays-accommodation|reiseziel|travel destination|Reiseziel|das|neuter|die Reiseziele
holidays-accommodation|campingplatz|campsite|Campingplatz|der|masculine|die Campingplätze
holidays-accommodation|jugendherberge|youth hostel|Jugendherberge|die|feminine|die Jugendherbergen
holidays-accommodation|ferienwohnung|holiday apartment|Ferienwohnung|die|feminine|die Ferienwohnungen
holidays-accommodation|zelt|tent|Zelt|das|neuter|die Zelte
holidays-accommodation|strand|beach|Strand|der|masculine|die Strände
holidays-accommodation|meer|sea|Meer|das|neuter|die Meere
holidays-accommodation|sehenswuerdigkeit|sight / attraction|Sehenswürdigkeit|die|feminine|die Sehenswürdigkeiten
holidays-accommodation|ausflug|excursion / day trip|Ausflug|der|masculine|die Ausflüge
holidays-accommodation|fuehrung|guided tour|Führung|die|feminine|die Führungen
holidays-accommodation|gast|guest|Gast|der|masculine|die Gäste
holidays-accommodation|einzelzimmer|single room|Einzelzimmer|das|neuter|die Einzelzimmer
holidays-accommodation|doppelzimmer|double room|Doppelzimmer|das|neuter|die Doppelzimmer
holidays-accommodation|fruehstuecksbuffet|breakfast buffet|Frühstücksbuffet|das|neuter|die Frühstücksbuffets
holidays-accommodation|halbpension|half board|Halbpension|die|feminine|no-plural
holidays-accommodation|katalog|catalogue|Katalog|der|masculine|die Kataloge
environment-weather|baum|tree|Baum|der|masculine|die Bäume
environment-weather|wald|forest|Wald|der|masculine|die Wälder
environment-weather|see|lake|See|der|masculine|die Seen
environment-weather|fluss|river|Fluss|der|masculine|die Flüsse
environment-weather|berg|mountain|Berg|der|masculine|die Berge
environment-weather|luft|air|Luft|die|feminine|no-plural
environment-weather|wasser|water|Wasser|das|neuter|no-plural
environment-weather|erde|earth / soil|Erde|die|feminine|no-plural
environment-weather|tier|animal|Tier|das|neuter|die Tiere
environment-weather|pflanze|plant|Pflanze|die|feminine|die Pflanzen
environment-weather|abfall|waste / rubbish|Abfall|der|masculine|die Abfälle
environment-weather|abgase|exhaust fumes|Abgase|die|plural|plural-only
environment-weather|laerm|noise|Lärm|der|masculine|no-plural
environment-weather|temperatur|temperature|Temperatur|die|feminine|die Temperaturen
environment-weather|gewitter|thunderstorm|Gewitter|das|neuter|die Gewitter
environment-weather|wind|wind|Wind|der|masculine|die Winde
environment-weather|wolke|cloud|Wolke|die|feminine|die Wolken
society-community|buerger|citizen|Bürger|der|masculine|die Bürger
society-community|bevoelkerung|population|Bevölkerung|die|feminine|die Bevölkerungen
society-community|regierung|government|Regierung|die|feminine|die Regierungen
society-community|gesetz|law|Gesetz|das|neuter|die Gesetze
society-community|recht|right / law|Recht|das|neuter|die Rechte
society-community|pflicht|duty / obligation|Pflicht|die|feminine|die Pflichten
society-community|wahl|election / choice|Wahl|die|feminine|die Wahlen
society-community|partei|political party|Partei|die|feminine|die Parteien
society-community|politik|politics|Politik|die|feminine|no-plural
society-community|demokratie|democracy|Demokratie|die|feminine|die Demokratien
society-community|integration|integration|Integration|die|feminine|no-plural
society-community|kultur|culture|Kultur|die|feminine|die Kulturen
society-community|religion|religion|Religion|die|feminine|die Religionen
society-community|gleichberechtigung|equal rights|Gleichberechtigung|die|feminine|no-plural
society-community|sicherheit|safety / security|Sicherheit|die|feminine|die Sicherheiten
society-community|organisation|organisation|Organisation|die|feminine|die Organisationen
feelings-opinions|liebe|love|Liebe|die|feminine|no-plural
feelings-opinions|glueck|happiness / luck|Glück|das|neuter|no-plural
feelings-opinions|trauer|grief / sadness|Trauer|die|feminine|no-plural
feelings-opinions|aerger|annoyance / trouble|Ärger|der|masculine|no-plural
feelings-opinions|ueberraschung|surprise|Überraschung|die|feminine|die Überraschungen
feelings-opinions|sorge|worry / concern|Sorge|die|feminine|die Sorgen
feelings-opinions|stress|stress|Stress|der|masculine|no-plural
feelings-opinions|laune|mood|Laune|die|feminine|die Launen
feelings-opinions|vertrauen|trust|Vertrauen|das|neuter|no-plural
feelings-opinions|mut|courage|Mut|der|masculine|no-plural
feelings-opinions|interesse|interest|Interesse|das|neuter|die Interessen
feelings-opinions|wunsch|wish|Wunsch|der|masculine|die Wünsche
problems-solutions|schaden|damage|Schaden|der|masculine|die Schäden
problems-solutions|gefahr|danger|Gefahr|die|feminine|die Gefahren
problems-solutions|konflikt|conflict|Konflikt|der|masculine|die Konflikte
problems-solutions|streit|argument / dispute|Streit|der|masculine|die Streitigkeiten
problems-solutions|missverstaendnis|misunderstanding|Missverständnis|das|neuter|die Missverständnisse
problems-solutions|mangel|defect / shortage|Mangel|der|masculine|die Mängel
problems-solutions|risiko|risk|Risiko|das|neuter|die Risiken
problems-solutions|notfall|emergency|Notfall|der|masculine|die Notfälle
problems-solutions|vorschlag|suggestion|Vorschlag|der|masculine|die Vorschläge
problems-solutions|alternative|alternative|Alternative|die|feminine|die Alternativen
problems-solutions|hilfe|help|Hilfe|die|feminine|die Hilfen
plans-goals-time|datum|date|Datum|das|neuter|die Daten
plans-goals-time|anfang|beginning|Anfang|der|masculine|die Anfänge
plans-goals-time|ende|end|Ende|das|neuter|die Enden
plans-goals-time|gelegenheit|opportunity / occasion|Gelegenheit|die|feminine|die Gelegenheiten
plans-goals-time|absicht|intention|Absicht|die|feminine|die Absichten
plans-goals-time|vorbereitung|preparation|Vorbereitung|die|feminine|die Vorbereitungen
plans-goals-time|reihenfolge|order / sequence|Reihenfolge|die|feminine|die Reihenfolgen
plans-goals-time|zeitraum|period of time|Zeitraum|der|masculine|die Zeiträume
plans-goals-time|planung|planning|Planung|die|feminine|die Planungen
`.trim();

const verbRows = String.raw`
family-relationships|heiraten|to marry|heiraten|haben|geheiratet|heiratete||false
family-relationships|erziehen|to raise / bring up|erziehen|haben|erzogen|erzog||false
family-relationships|aufwachsen|to grow up|aufwachsen|sein|aufgewachsen|wuchs auf|auf|false
home-living|wohnen|to live / reside|wohnen|haben|gewohnt|wohnte||false
home-living|einziehen|to move in|einziehen|sein|eingezogen|zog ein|ein|false
home-living|ausziehen|to move out|ausziehen|sein|ausgezogen|zog aus|aus|false
home-living|heizen|to heat|heizen|haben|geheizt|heizte||false
home-living|putzen|to clean|putzen|haben|geputzt|putzte||false
daily-life|duschen|to shower|duschen|haben|geduscht|duschte||false
daily-life|fruehstuecken|to have breakfast|frühstücken|haben|gefrühstückt|frühstückte||false
daily-life|waschen|to wash|waschen|haben|gewaschen|wusch||false
daily-life|aufraeumen|to tidy up|aufräumen|haben|aufgeräumt|räumte auf|auf|false
daily-life|anziehen|to get dressed|sich anziehen|haben|angezogen|zog sich an|an|true
daily-life|ausruhen|to rest|sich ausruhen|haben|ausgeruht|ruhte sich aus|aus|true
daily-life|schlafen|to sleep|schlafen|haben|geschlafen|schlief||false
daily-life|wecken|to wake someone|wecken|haben|geweckt|weckte||false
daily-life|aufwachen|to wake up|aufwachen|sein|aufgewacht|wachte auf|auf|false
daily-life|dauern|to last / take time|dauern|haben|gedauert|dauerte||false
daily-life|warten|to wait|warten|haben|gewartet|wartete||false
daily-life|benutzen|to use|benutzen|haben|benutzt|benutzte||false
daily-life|wechseln|to change / switch|wechseln|haben|gewechselt|wechselte||false
daily-life|kochen|to cook|kochen|haben|gekocht|kochte||false
food-eating-out|essen|to eat|essen|haben|gegessen|aß||false
food-eating-out|trinken|to drink|trinken|haben|getrunken|trank||false
food-eating-out|zubereiten|to prepare food|zubereiten|haben|zubereitet|bereitete zu|zu|false
food-eating-out|servieren|to serve|servieren|haben|serviert|servierte||false
food-eating-out|empfehlen|to recommend|empfehlen|haben|empfohlen|empfahl||false
shopping-money|kaufen|to buy|kaufen|haben|gekauft|kaufte||false
shopping-money|verkaufen|to sell|verkaufen|haben|verkauft|verkaufte||false
shopping-money|kosten|to cost|kosten|haben|gekostet|kostete||false
shopping-money|ausgeben|to spend|ausgeben|haben|ausgegeben|gab aus|aus|false
shopping-money|zurueckgeben|to return / give back|zurückgeben|haben|zurückgegeben|gab zurück|zurück|false
work-profession|arbeiten|to work|arbeiten|haben|gearbeitet|arbeitete||false
work-profession|verdienen|to earn|verdienen|haben|verdient|verdiente||false
work-profession|einstellen|to hire / adjust|einstellen|haben|eingestellt|stellte ein|ein|false
work-profession|entlassen|to dismiss / release|entlassen|haben|entlassen|entließ||false
work-profession|unterschreiben|to sign|unterschreiben|haben|unterschrieben|unterschrieb||false
work-profession|leiten|to manage / lead|leiten|haben|geleitet|leitete||false
work-profession|organisieren|to organise|organisieren|haben|organisiert|organisierte||false
work-profession|uebernehmen|to take over / accept|übernehmen|haben|übernommen|übernahm||false
school-education|ueben|to practise|üben|haben|geübt|übte||false
school-education|wiederholen|to repeat / revise|wiederholen|haben|wiederholt|wiederholte||false
school-education|korrigieren|to correct|korrigieren|haben|korrigiert|korrigierte||false
school-education|sich-anmelden|to register / enrol|sich anmelden|haben|angemeldet|meldete sich an|an|true
school-education|studieren|to study at university|studieren|haben|studiert|studierte||false
school-education|pruefen|to examine / check|prüfen|haben|geprüft|prüfte||false
school-education|abschreiben|to copy / write down|abschreiben|haben|abgeschrieben|schrieb ab|ab|false
school-education|nachschlagen|to look up|nachschlagen|haben|nachgeschlagen|schlug nach|nach|false
travel-transport|reisen|to travel|reisen|sein|gereist|reiste||false
travel-transport|fahren|to travel / drive|fahren|sein|gefahren|fuhr||false
travel-transport|fliegen|to fly|fliegen|sein|geflogen|flog||false
travel-transport|landen|to land|landen|sein|gelandet|landete||false
travel-transport|einsteigen|to get on / board|einsteigen|sein|eingestiegen|stieg ein|ein|false
travel-transport|aussteigen|to get off|aussteigen|sein|ausgestiegen|stieg aus|aus|false
travel-transport|sich-verspaeten|to be delayed|sich verspäten|haben|verspätet|verspätete sich||true
travel-transport|zurueckfahren|to travel back|zurückfahren|sein|zurückgefahren|fuhr zurück|zurück|false
city-services|anmelden|to register|anmelden|haben|angemeldet|meldete an|an|false
city-services|ausfuellen|to fill in|ausfüllen|haben|ausgefüllt|füllte aus|aus|false
city-services|einreichen|to submit|einreichen|haben|eingereicht|reichte ein|ein|false
city-services|genehmigen|to approve / authorise|genehmigen|haben|genehmigt|genehmigte||false
city-services|waehlen|to vote / choose|wählen|haben|gewählt|wählte||false
city-services|verbieten|to forbid|verbieten|haben|verboten|verbot||false
city-services|verlaengern|to extend / renew|verlängern|haben|verlängert|verlängerte||false
health-body|atmen|to breathe|atmen|haben|geatmet|atmete||false
health-body|husten-verb|to cough|husten|haben|gehustet|hustete||false
health-body|sich-erkaelten|to catch a cold|sich erkälten|haben|erkältet|erkältete sich||true
health-body|behandeln|to treat|behandeln|haben|behandelt|behandelte||false
health-body|operieren|to operate|operieren|haben|operiert|operierte||false
health-body|messen|to measure|messen|haben|gemessen|maß||false
health-body|impfen|to vaccinate|impfen|haben|geimpft|impfte||false
appointments-services|reparieren|to repair|reparieren|haben|repariert|reparierte||false
appointments-services|liefern|to deliver|liefern|haben|geliefert|lieferte||false
appointments-services|reklamieren|to make a complaint / return faulty goods|reklamieren|haben|reklamiert|reklamierte||false
appointments-services|bestaetigen|to confirm|bestätigen|haben|bestätigt|bestätigte||false
appointments-services|stornieren|to cancel a booking|stornieren|haben|storniert|stornierte||false
appointments-services|erneuern|to renew|erneuern|haben|erneuert|erneuerte||false
media-communication|anrufen|to call / phone|anrufen|haben|angerufen|rief an|an|false
media-communication|telefonieren|to telephone|telefonieren|haben|telefoniert|telefonierte||false
media-communication|senden|to send / broadcast|senden|haben|gesendet|sendete||false
media-communication|empfangen|to receive|empfangen|haben|empfangen|empfing||false
media-communication|antworten|to answer / reply|antworten|haben|geantwortet|antwortete||false
media-communication|fragen|to ask|fragen|haben|gefragt|fragte||false
media-communication|zuhoeren|to listen|zuhören|haben|zugehört|hörte zu|zu|false
media-communication|veroeffentlichen|to publish|veröffentlichen|haben|veröffentlicht|veröffentlichte||false
media-communication|informieren|to inform|informieren|haben|informiert|informierte||false
media-communication|sich-unterhalten|to have a conversation|sich unterhalten|haben|unterhalten|unterhielt sich||true
technology-internet|klicken|to click|klicken|haben|geklickt|klickte||false
technology-internet|drucken|to print|drucken|haben|gedruckt|druckte||false
technology-internet|installieren|to install|installieren|haben|installiert|installierte||false
technology-internet|einschalten|to switch on|einschalten|haben|eingeschaltet|schaltete ein|ein|false
technology-internet|ausschalten|to switch off|ausschalten|haben|ausgeschaltet|schaltete aus|aus|false
leisure-sport|lesen|to read|lesen|haben|gelesen|las||false
leisure-sport|tanzen|to dance|tanzen|haben|getanzt|tanzte||false
leisure-sport|spielen|to play|spielen|haben|gespielt|spielte||false
leisure-sport|fotografieren|to take photographs|fotografieren|haben|fotografiert|fotografierte||false
holidays-accommodation|anreisen|to arrive for a stay|anreisen|sein|angereist|reiste an|an|false
holidays-accommodation|abreisen|to depart / leave|abreisen|sein|abgereist|reiste ab|ab|false
holidays-accommodation|sich-erholen|to relax / recover|sich erholen|haben|erholt|erholte sich||true
holidays-accommodation|packen|to pack|packen|haben|gepackt|packte||false
environment-weather|trennen|to separate / sort|trennen|haben|getrennt|trennte||false
environment-weather|verschmutzen|to pollute|verschmutzen|haben|verschmutzt|verschmutzte||false
environment-weather|pflanzen|to plant|pflanzen|haben|gepflanzt|pflanzte||false
society-community|abstimmen|to vote|abstimmen|haben|abgestimmt|stimmte ab|ab|false
society-community|respektieren|to respect|respektieren|haben|respektiert|respektierte||false
society-community|gruenden|to found / establish|gründen|haben|gegründet|gründete||false
society-community|spenden|to donate|spenden|haben|gespendet|spendete||false
feelings-opinions|sich-sorgen|to worry|sich sorgen|haben|gesorgt|sorgte sich||true
feelings-opinions|hoffen|to hope|hoffen|haben|gehofft|hoffte||false
problems-solutions|fehlen|to be missing / lack|fehlen|haben|gefehlt|fehlte||false
problems-solutions|klaeren|to clarify / resolve|klären|haben|geklärt|klärte||false
problems-solutions|aendern|to change|ändern|haben|geändert|änderte||false
problems-solutions|sich-einigen|to reach an agreement|sich einigen|haben|geeinigt|einigte sich||true
problems-solutions|warnen|to warn|warnen|haben|gewarnt|warnte||false
problems-solutions|retten|to rescue / save|retten|haben|gerettet|rettete||false
problems-solutions|verhindern|to prevent|verhindern|haben|verhindert|verhinderte||false
problems-solutions|ersetzen|to replace|ersetzen|haben|ersetzt|ersetzte||false
problems-solutions|kontrollieren|to check / inspect|kontrollieren|haben|kontrolliert|kontrollierte||false
high-frequency-verbs|machen|to do / make|machen|haben|gemacht|machte||false
high-frequency-verbs|geben|to give|geben|haben|gegeben|gab||false
high-frequency-verbs|nehmen|to take|nehmen|haben|genommen|nahm||false
high-frequency-verbs|bringen|to bring|bringen|haben|gebracht|brachte||false
high-frequency-verbs|holen|to fetch / get|holen|haben|geholt|holte||false
high-frequency-verbs|bleiben|to stay / remain|bleiben|sein|geblieben|blieb||false
high-frequency-verbs|finden|to find|finden|haben|gefunden|fand||false
high-frequency-verbs|zeigen|to show|zeigen|haben|gezeigt|zeigte||false
high-frequency-verbs|lassen|to let / leave|lassen|haben|gelassen|ließ||false
high-frequency-verbs|halten|to hold / stop|halten|haben|gehalten|hielt||false
high-frequency-verbs|tragen|to carry / wear|tragen|haben|getragen|trug||false
high-frequency-verbs|oeffnen|to open|öffnen|haben|geöffnet|öffnete||false
high-frequency-verbs|schliessen|to close|schließen|haben|geschlossen|schloss||false
high-frequency-verbs|schicken|to send|schicken|haben|geschickt|schickte||false
high-frequency-verbs|bekommen|to receive / get|bekommen|haben|bekommen|bekam||false
high-frequency-verbs|verwenden|to use|verwenden|haben|verwendet|verwendete||false
high-frequency-verbs|nennen|to name / call|nennen|haben|genannt|nannte||false
high-frequency-verbs|gelten|to be valid / apply|gelten|haben|gegolten|galt||false
high-frequency-verbs|folgen|to follow|folgen|sein|gefolgt|folgte||false
high-frequency-verbs|bitten|to ask / request|bitten|haben|gebeten|bat||false
`.trim();

const termRows = String.raw`
work-profession|zustaendig|responsible / in charge|zuständig|adjective|de-b1-adjective-endings
work-profession|selbststaendig|self-employed / independently|selbstständig|adjective|de-b1-adjective-endings
feelings-opinions|nervoes|nervous|nervös|adjective|de-b1-adjective-endings
feelings-opinions|ruhig|calm / quiet|ruhig|adjective|de-b1-adjective-endings
feelings-opinions|traurig|sad|traurig|adjective|de-b1-adjective-endings
feelings-opinions|gluecklich|happy / fortunate|glücklich|adjective|de-b1-adjective-endings
feelings-opinions|stolz|proud|stolz|adjective|de-b1-adjective-endings
feelings-opinions|ueberrascht|surprised|überrascht|adjective|de-b1-adjective-endings
plans-goals-time|naechst|next|nächst|adjective|de-b1-adjective-endings
plans-goals-time|spaeter|later|später|adverb|de-b1-temporal-clauses
plans-goals-time|kuenftig|in future / future|künftig|adverb|de-b1-future-meaning
plans-goals-time|bald|soon|bald|adverb|de-b1-future-meaning
plans-goals-time|vorher|beforehand|vorher|adverb|de-b1-temporal-clauses
plans-goals-time|nachher|afterwards|nachher|adverb|de-b1-temporal-clauses
adjectives-adverbs|aktuell|current / up to date|aktuell|adjective|de-b1-adjective-endings
adjectives-adverbs|angenehm|pleasant|angenehm|adjective|de-b1-adjective-endings
adjectives-adverbs|bekannt|known / familiar|bekannt|adjective|de-b1-adjective-endings
adjectives-adverbs|bequem|comfortable / convenient|bequem|adjective|de-b1-adjective-endings
adjectives-adverbs|breit|wide|breit|adjective|de-b1-adjective-endings
adjectives-adverbs|eng|narrow / close|eng|adjective|de-b1-adjective-endings
adjectives-adverbs|einfach|simple / simply|einfach|adjective|de-b1-adjective-endings
adjectives-adverbs|schwierig|difficult|schwierig|adjective|de-b1-adjective-endings
adjectives-adverbs|freundlich|friendly|freundlich|adjective|de-b1-adjective-endings
adjectives-adverbs|gefaehrlich|dangerous|gefährlich|adjective|de-b1-adjective-endings
adjectives-adverbs|genau|exact / exactly|genau|adjective|de-b1-adjective-endings
adjectives-adverbs|laut|loud|laut|adjective|de-b1-adjective-endings
adjectives-adverbs|leise|quiet / softly|leise|adjective|de-b1-adjective-endings
adjectives-adverbs|lokal|local|lokal|adjective|de-b1-adjective-endings
adjectives-adverbs|modern|modern|modern|adjective|de-b1-adjective-endings
adjectives-adverbs|praktisch|practical|praktisch|adjective|de-b1-adjective-endings
adjectives-adverbs|privat|private / privately|privat|adjective|de-b1-adjective-endings
adjectives-adverbs|schnell|fast / quickly|schnell|adjective|de-b1-adjective-endings
adjectives-adverbs|langsam|slow / slowly|langsam|adjective|de-b1-adjective-endings
adjectives-adverbs|sicher|safe / certain|sicher|adjective|de-b1-adjective-endings
connectors-prepositions|als|when / than / as|als|connector|de-b1-temporal-clauses
connectors-prepositions|bevor|before|bevor|connector|de-b1-temporal-clauses
connectors-prepositions|nachdem|after|nachdem|connector|de-b1-temporal-clauses
connectors-prepositions|seitdem|since then / since|seitdem|connector|de-b1-temporal-clauses
connectors-prepositions|sobald|as soon as|sobald|connector|de-b1-subordinate-clauses
connectors-prepositions|solange|as long as|solange|connector|de-b1-subordinate-clauses
connectors-prepositions|falls|in case / if|falls|connector|de-b1-subordinate-clauses
connectors-prepositions|damit|so that / with it|damit|connector|de-b1-purpose-um-zu-damit
connectors-prepositions|darum|therefore / about that|darum|connector|de-b1-main-clause-connectors
connectors-prepositions|dennoch|nevertheless|dennoch|connector|de-b1-cohesive-connectors
connectors-prepositions|sonst|otherwise|sonst|connector|de-b1-main-clause-connectors
connectors-prepositions|sowohl-als-auch|both ... and|sowohl ... als auch|connector|de-b1-cohesive-connectors
connectors-prepositions|nicht-nur-sondern-auch|not only ... but also|nicht nur ... sondern auch|connector|de-b1-cohesive-connectors
connectors-prepositions|gegenueber|opposite / towards|gegenüber|preposition|de-b1-two-way-local-temporal-prepositions
connectors-prepositions|trotz|despite|trotz|preposition|de-b1-genitive-basics
functional-exam-phrases|sich-erkundigen-nach|to ask for information about|Ich möchte mich nach ... erkundigen.|phrase|de-b1-prepositional-verbs
functional-exam-phrases|schreiben-wegen|I am writing about|Ich schreibe Ihnen wegen ...|phrase|de-b1-genitive-basics
functional-exam-phrases|leider-kann-ich|unfortunately I cannot|Leider kann ich ...|phrase|de-b1-modal-verbs
functional-exam-phrases|es-tut-mir-leid|I am sorry that|Es tut mir leid, dass ...|phrase|de-b1-subordinate-clauses
functional-exam-phrases|sich-entschuldigen-fuer|to apologise for|Ich möchte mich für ... entschuldigen.|phrase|de-b1-prepositional-verbs
functional-exam-phrases|waeren-sie-so-freundlich|would you be so kind|Wären Sie so freundlich, ...?|phrase|de-b1-konjunktiv-ii
functional-exam-phrases|ich-schlage-vor|I suggest that|Ich schlage vor, dass ...|phrase|de-b1-subordinate-clauses
functional-exam-phrases|wie-waere-es-mit|how about|Wie wäre es mit ...?|phrase|de-b1-konjunktiv-ii
functional-exam-phrases|sehe-ich-genauso|I see it the same way|Das sehe ich genauso.|phrase|de-b1-cohesive-connectors
functional-exam-phrases|anderer-meinung|I have a different opinion|Da bin ich anderer Meinung.|phrase|de-b1-cohesive-connectors
functional-exam-phrases|genauer-erklaeren|could you explain that more precisely|Könnten Sie das genauer erklären?|phrase|de-b1-konjunktiv-ii
functional-exam-phrases|richtig-verstanden|have I understood you correctly|Habe ich Sie richtig verstanden?|phrase|de-b1-indirect-questions
functional-exam-phrases|ein-vorteil|one advantage is|Ein Vorteil ist ...|phrase|de-b1-noun-verb-writing
functional-exam-phrases|ein-nachteil|one disadvantage is|Ein Nachteil ist ...|phrase|de-b1-noun-verb-writing
functional-exam-phrases|abschliessend|in conclusion I would like to say|Abschließend möchte ich sagen, dass ...|phrase|de-b1-cohesive-connectors
`.trim();

const parseRows = (rows, expectedColumns) => rows.split(/\r?\n/).filter(Boolean).map((line, index) => {
  const values = line.split("|").map((value) => value.trim());
  if (values.length !== expectedColumns) throw new Error(`Row ${index + 1} has ${values.length} columns, expected ${expectedColumns}: ${line}`);
  return values;
});

const accusativeArticle = { der: "den", die: "die", das: "das" };
const accusativeNoun = {
  Familienname: "Familiennamen",
  Kunde: "Kunden",
  Student: "Studenten",
  Patient: "Patienten",
};
const nounSpecs = parseRows(nounRows, 7).map(([categoryId, slug, source, lemma, article, gender, plural]) => ({
  type: "noun", categoryId, slug, source, lemma, article, gender, plural,
  example: `Im Alltag sprechen wir oft über ${accusativeArticle[article]} ${accusativeNoun[lemma] || lemma}.`,
  exampleTranslation: `In everyday life, we often talk about the ${source}.`,
  grammarRefs: [],
  referenceKey: lemma,
}));

const verbExamples = {
  heiraten: ["Sie möchten im Sommer heiraten.", "They would like to get married in the summer."],
  erziehen: ["Die Eltern erziehen ihre Kinder gemeinsam.", "The parents raise their children together."],
  aufwachsen: ["Sie ist in einer kleinen Stadt aufgewachsen.", "She grew up in a small town."],
  wohnen: ["Wir wohnen seit drei Jahren in dieser Wohnung.", "We have lived in this flat for three years."],
  einziehen: ["Die Familie zieht am Wochenende in die neue Wohnung ein.", "The family is moving into the new flat at the weekend."],
  ausziehen: ["Unser Nachbar zieht nächsten Monat aus.", "Our neighbour is moving out next month."],
  duschen: ["Ich dusche morgens vor der Arbeit.", "I shower in the morning before work."],
  frühstücken: ["Am Sonntag frühstücken wir gemeinsam.", "On Sunday we have breakfast together."],
  schlafen: ["Nach der Reise möchte ich lange schlafen.", "After the journey I would like to sleep for a long time."],
  wecken: ["Bitte weck mich morgen um sieben Uhr.", "Please wake me tomorrow at seven."],
  aufwachen: ["Ich bin heute sehr früh aufgewacht.", "I woke up very early today."],
  dauern: ["Die Fahrt dauert etwa zwei Stunden.", "The journey takes about two hours."],
  warten: ["Wir warten vor dem Eingang auf dich.", "We are waiting for you in front of the entrance."],
  kochen: ["Heute kochen wir eine Gemüsesuppe.", "Today we are cooking a vegetable soup."],
  essen: ["Zum Mittagessen esse ich einen Salat.", "I am eating a salad for lunch."],
  trinken: ["Bei der Hitze trinkt sie viel Wasser.", "She drinks a lot of water in the heat."],
  zubereiten: ["Der Koch bereitet das Essen frisch zu.", "The cook prepares the food fresh."],
  kosten: ["Die Fahrkarte kostet zwanzig Euro.", "The ticket costs twenty euros."],
  arbeiten: ["Sie arbeitet seit April in dieser Firma.", "She has worked at this company since April."],
  studieren: ["Er studiert Wirtschaft an der Universität.", "He studies business at university."],
  reisen: ["Im Sommer reisen wir mit dem Zug nach Österreich.", "In summer we travel to Austria by train."],
  fahren: ["Morgen fahren wir mit dem Bus ins Zentrum.", "Tomorrow we are taking the bus to the city centre."],
  fliegen: ["Sie fliegt nächste Woche nach Berlin.", "She is flying to Berlin next week."],
  landen: ["Das Flugzeug landet pünktlich um neun Uhr.", "The plane lands punctually at nine."],
  einsteigen: ["Bitte steigen Sie an der nächsten Haltestelle ein.", "Please board at the next stop."],
  aussteigen: ["Wir müssen am Hauptbahnhof aussteigen.", "We have to get off at the main station."],
  "sich verspäten": ["Der Zug hat sich um zehn Minuten verspätet.", "The train was delayed by ten minutes."],
  zurückfahren: ["Am Sonntag fahren wir wieder nach Hause zurück.", "On Sunday we travel back home."],
  atmen: ["Atmen Sie bitte langsam und ruhig.", "Please breathe slowly and calmly."],
  "sich erkälten": ["Ich habe mich auf der Reise erkältet.", "I caught a cold during the trip."],
  husten: ["Der Patient muss seit gestern stark husten.", "The patient has had a bad cough since yesterday."],
  operieren: ["Die Ärztin operiert den Patienten morgen.", "The doctor is operating on the patient tomorrow."],
  impfen: ["Der Arzt impft die Patientin gegen Grippe.", "The doctor vaccinates the patient against flu."],
  reklamieren: ["Der Kunde reklamiert die beschädigte Ware.", "The customer complains about the damaged goods."],
  stornieren: ["Wir müssen die Reservierung rechtzeitig stornieren.", "We need to cancel the reservation in good time."],
  anrufen: ["Ich rufe dich nach der Arbeit an.", "I will call you after work."],
  telefonieren: ["Sie telefoniert gerade mit ihrer Kollegin.", "She is on the phone with her colleague."],
  zuhören: ["Bitte hören Sie der Ansage aufmerksam zu.", "Please listen carefully to the announcement."],
  informieren: ["Die Stadt informiert die Bewohner über die Sperrung.", "The city informs residents about the closure."],
  "sich unterhalten": ["Wir unterhalten uns über den neuen Kurs.", "We are talking about the new course."],
  klicken: ["Klicken Sie auf den Link in der E-Mail.", "Click the link in the email."],
  tanzen: ["Auf dem Fest haben wir lange getanzt.", "We danced for a long time at the party."],
  fotografieren: ["Im Urlaub fotografiert er gern alte Gebäude.", "On holiday he likes to photograph old buildings."],
  anreisen: ["Die Gäste reisen am Freitagabend an.", "The guests arrive on Friday evening."],
  abreisen: ["Wir reisen am Montagmorgen ab.", "We leave on Monday morning."],
  "sich erholen": ["Nach der Prüfung möchte sie sich erholen.", "She would like to relax after the exam."],
  abstimmen: ["Die Mitglieder stimmen über den Vorschlag ab.", "The members vote on the proposal."],
  "sich sorgen": ["Sie sorgt sich um ihre Familie.", "She worries about her family."],
  hoffen: ["Wir hoffen auf eine schnelle Antwort.", "We hope for a quick answer."],
  fehlen: ["In der Anmeldung fehlt noch eine Unterschrift.", "A signature is still missing from the registration."],
  warnen: ["Die Polizei warnt vor glatten Straßen.", "The police warn about icy roads."],
  bleiben: ["Bitte bleiben Sie bis zum Ende der Veranstaltung.", "Please stay until the end of the event."],
  gelten: ["Die Fahrkarte gilt bis morgen.", "The ticket is valid until tomorrow."],
  folgen: ["Folgen Sie bitte den Hinweisen auf dem Schild.", "Please follow the instructions on the sign."],
  bitten: ["Ich bitte Sie um eine kurze Bestätigung.", "I am asking you for a brief confirmation."],
};

const verbSpecs = parseRows(verbRows, 9).map(([categoryId, slug, source, lemma, auxiliary, pastParticiple, preterite, separablePrefix, reflexive]) => {
  const [example, exampleTranslation] = verbExamples[lemma]
    || (lemma.startsWith("sich ")
      ? [`Wir müssen uns heute ${lemma.slice(5)}.`, `We need ${source} today.`]
      : [`Wir müssen heute etwas ${lemma}.`, `We need ${source} something today.`]);
  return {
    type: "verb", categoryId, slug, source, lemma, auxiliary, pastParticiple, preterite,
    separablePrefix: separablePrefix || null,
    reflexive: reflexive === "true",
    reflexiveCase: reflexive === "true" ? "accusative" : null,
    caseGovernment: null,
    prepositions: [],
    example,
    exampleTranslation,
    grammarRefs: [
      "de-b1-perfekt",
      ...(separablePrefix || reflexive === "true" ? ["de-b1-separable-reflexive-verbs"] : []),
    ],
    referenceKey: lemma,
  };
});

const connectorExamples = {
  als: ["Als ich ankam, begann der Kurs.", "When I arrived, the course began."],
  bevor: ["Ruf mich an, bevor du losfährst.", "Call me before you leave."],
  nachdem: ["Nachdem wir gegessen hatten, gingen wir spazieren.", "After we had eaten, we went for a walk."],
  seitdem: ["Seitdem ich hier wohne, fahre ich öfter Rad.", "Since I have lived here, I cycle more often."],
  sobald: ["Ich melde mich, sobald ich eine Antwort habe.", "I will contact you as soon as I have an answer."],
  solange: ["Du kannst bleiben, solange du möchtest.", "You can stay as long as you like."],
  falls: ["Falls der Zug ausfällt, nehmen wir den Bus.", "If the train is cancelled, we will take the bus."],
  damit: ["Ich notiere den Termin, damit ich ihn nicht vergesse.", "I am noting the appointment so that I do not forget it."],
  darum: ["Der Weg ist gesperrt, darum fahren wir anders.", "The road is closed, so we are taking a different route."],
  dennoch: ["Es regnete, dennoch fand das Fest statt.", "It rained; nevertheless, the festival took place."],
  sonst: ["Beeil dich, sonst verpassen wir den Bus.", "Hurry up, otherwise we will miss the bus."],
  "sowohl ... als auch": ["Der Kurs übt sowohl Lesen als auch Schreiben.", "The course practises both reading and writing."],
  "nicht nur ... sondern auch": ["Die Wohnung ist nicht nur hell, sondern auch ruhig.", "The apartment is not only bright but also quiet."],
  gegenüber: ["Die Apotheke liegt gegenüber dem Bahnhof.", "The pharmacy is opposite the station."],
  trotz: ["Trotz des Regens gehen wir spazieren.", "Despite the rain, we are going for a walk."],
};

const termExamples = {
  zuständig: ["Frau Klein ist für die Anmeldung zuständig.", "Ms Klein is responsible for registration."],
  selbstständig: ["Nach der Ausbildung arbeitet er selbstständig.", "After his training, he works independently."],
  nervös: ["Vor der Prüfung bin ich immer etwas nervös.", "I am always a little nervous before the exam."],
  ruhig: ["Die Straße bleibt auch am Abend ruhig.", "The street remains quiet even in the evening."],
  traurig: ["Sie war über die Nachricht sehr traurig.", "She was very sad about the news."],
  glücklich: ["Wir sind mit der neuen Wohnung glücklich.", "We are happy with the new apartment."],
  stolz: ["Er ist stolz auf seinen Schulabschluss.", "He is proud of his school-leaving qualification."],
  überrascht: ["Ich war von der schnellen Antwort überrascht.", "I was surprised by the quick reply."],
  nächst: ["Der nächste Zug fährt in zehn Minuten.", "The next train leaves in ten minutes."],
  später: ["Ich rufe dich später zurück.", "I will call you back later."],
  künftig: ["Künftig möchte sie öfter mit dem Fahrrad fahren.", "In future, she would like to cycle more often."],
  bald: ["Der Kurs beginnt bald.", "The course will begin soon."],
  vorher: ["Bitte rufen Sie vorher kurz an.", "Please call briefly beforehand."],
  nachher: ["Wir besprechen das nachher in Ruhe.", "We will discuss that calmly afterwards."],
  aktuell: ["Die aktuellen Fahrzeiten stehen im Internet.", "The current travel times are online."],
  angenehm: ["Das Zimmer ist hell und angenehm ruhig.", "The room is bright and pleasantly quiet."],
  bekannt: ["Dieses Problem ist der Werkstatt bereits bekannt.", "The repair shop already knows about this problem."],
  bequem: ["Der neue Sitz ist auch auf langen Fahrten bequem.", "The new seat is comfortable even on long journeys."],
  breit: ["Der Weg ist breit genug für Fahrräder.", "The path is wide enough for bicycles."],
  eng: ["Die Straße ist hier sehr eng.", "The street is very narrow here."],
  einfach: ["Die Anmeldung ist einfach und dauert nur fünf Minuten.", "Registration is simple and takes only five minutes."],
  schwierig: ["Die letzte Aufgabe war besonders schwierig.", "The last task was especially difficult."],
  freundlich: ["Der Mitarbeiter hat uns freundlich beraten.", "The employee advised us in a friendly manner."],
  gefährlich: ["Bei Eis kann dieser Weg gefährlich sein.", "This path can be dangerous when it is icy."],
  genau: ["Bitte lesen Sie die Adresse genau.", "Please read the address carefully."],
  laut: ["Die Musik im Restaurant war zu laut.", "The music in the restaurant was too loud."],
  leise: ["Bitte sprechen Sie in der Bibliothek leise.", "Please speak quietly in the library."],
  lokal: ["Der Markt verkauft viele lokale Produkte.", "The market sells many local products."],
  modern: ["Die Bibliothek hat einen modernen Arbeitsplatz.", "The library has a modern workspace."],
  praktisch: ["Die App ist einfach und praktisch.", "The app is simple and practical."],
  privat: ["Diese Telefonnummer ist privat.", "This telephone number is private."],
  schnell: ["Der Schnellzug erreicht Berlin besonders schnell.", "The express train reaches Berlin especially quickly."],
  langsam: ["Bitte sprechen Sie etwas langsamer.", "Please speak a little more slowly."],
  sicher: ["Mit einem Helm fährt man sicherer.", "You cycle more safely with a helmet."],
};

const functionalExamples = {
  "Ich möchte mich nach ... erkundigen.": ["Ich möchte mich nach den Öffnungszeiten erkundigen.", "I would like to ask about the opening times."],
  "Ich schreibe Ihnen wegen ...": ["Ich schreibe Ihnen wegen meiner Bestellung.", "I am writing to you about my order."],
  "Leider kann ich ...": ["Leider kann ich den Termin nicht wahrnehmen.", "Unfortunately, I cannot attend the appointment."],
  "Es tut mir leid, dass ...": ["Es tut mir leid, dass ich so spät antworte.", "I am sorry that I am replying so late."],
  "Ich möchte mich für ... entschuldigen.": ["Ich möchte mich für die Verspätung entschuldigen.", "I would like to apologise for the delay."],
  "Wären Sie so freundlich, ...?": ["Wären Sie so freundlich, mir die Rechnung zu schicken?", "Would you be so kind as to send me the invoice?"],
  "Ich schlage vor, dass ...": ["Ich schlage vor, dass wir uns am Bahnhof treffen.", "I suggest that we meet at the station."],
  "Wie wäre es mit ...?": ["Wie wäre es mit einem Ausflug am Samstag?", "How about an excursion on Saturday?"],
  "Das sehe ich genauso.": ["Das sehe ich genauso, weil die Lösung praktisch ist.", "I see it the same way because the solution is practical."],
  "Da bin ich anderer Meinung.": ["Da bin ich anderer Meinung, denn der Plan ist zu teuer.", "I have a different opinion because the plan is too expensive."],
  "Könnten Sie das genauer erklären?": ["Könnten Sie das genauer erklären, bitte?", "Could you explain that more precisely, please?"],
  "Habe ich Sie richtig verstanden?": ["Habe ich Sie richtig verstanden: Der Kurs beginnt am Montag?", "Have I understood you correctly: Does the course begin on Monday?"],
  "Ein Vorteil ist ...": ["Ein Vorteil ist, dass der Bus direkt fährt.", "One advantage is that the bus goes directly."],
  "Ein Nachteil ist ...": ["Ein Nachteil ist, dass die Miete sehr hoch ist.", "One disadvantage is that the rent is very high."],
  "Abschließend möchte ich sagen, dass ...": ["Abschließend möchte ich sagen, dass mir das Projekt wichtig ist.", "In conclusion, I would like to say that the project matters to me."],
};

const phraseReferenceKeys = {
  "Ich möchte mich nach ... erkundigen.": "sich erkundigen",
  "Ich schreibe Ihnen wegen ...": "schreiben",
  "Leider kann ich ...": "können",
  "Es tut mir leid, dass ...": "leidtun",
  "Ich möchte mich für ... entschuldigen.": "sich entschuldigen",
  "Wären Sie so freundlich, ...?": "freundlich",
  "Ich schlage vor, dass ...": "vorschlagen",
  "Wie wäre es mit ...?": "sein",
  "Das sehe ich genauso.": "genauso",
  "Da bin ich anderer Meinung.": "Meinung",
  "Könnten Sie das genauer erklären?": "erklären",
  "Habe ich Sie richtig verstanden?": "verstehen",
  "Ein Vorteil ist ...": "Vorteil",
  "Ein Nachteil ist ...": "Nachteil",
  "Abschließend möchte ich sagen, dass ...": "abschließend",
};

const termSpecs = parseRows(termRows, 6).map(([categoryId, slug, source, target, partOfSpeech, grammarRef]) => {
  const [example, exampleTranslation] = connectorExamples[target]
    || termExamples[target]
    || functionalExamples[target]
    || [`Die Situation ist heute ${target}.`, `The situation is ${source} today.`];
  return {
    type: "term", categoryId, slug, source, target, lemma: target, partOfSpeech,
    example, exampleTranslation,
    grammarRefs: [grammarRef],
    referenceKey: phraseReferenceKeys[target] || target,
  };
});

const specs = [...nounSpecs, ...verbSpecs, ...termSpecs];
const coverageReferenceOverrides = {
  "personal-identity|reisepass": "Pass",
  "personal-identity|staatsbuerger": "Bürger",
  "family-relationships|grosseltern": "Eltern",
  "family-relationships|freundin": "Freund",
  "home-living|badezimmer": "Zimmer",
  "home-living|schlafzimmer": "Zimmer",
  "home-living|nebenkosten": "Kosten",
  "daily-life|puenktlichkeit": "pünktlich",
  "food-eating-out|obst": "Früchte",
  "food-eating-out|mittagessen": "Mittag",
  "food-eating-out|abendessen": "Abend",
  "shopping-money|wechselgeld": "Geld",
  "shopping-money|kassenbon": "Kasse",
  "work-profession|arbeitszeit": "Arbeit",
  "work-profession|schicht": "Arbeit",
  "work-profession|urlaubstag": "Urlaub",
  "work-profession|bewerbungsgespraech": "Bewerbung",
  "school-education|kenntnis": "Kenntnisse",
  "school-education|schulabschluss": "Abschluss",
  "travel-transport|rueckfahrt": "fahren",
  "travel-transport|einzelfahrkarte": "Fahrkarte",
  "city-services|buergeramt": "Amt",
  "city-services|oeffnungszeit": "öffnen",
  "health-body|behandlung": "behandeln",
  "health-body|krankenversicherung": "Versicherung",
  "health-body|notaufnahme": "Aufnahme",
  "appointments-services|kundendienst": "Dienst",
  "appointments-services|beschwerde": "sich beschweren",
  "appointments-services|wartezeit": "warten",
  "media-communication|mitteilung": "mitteilen",
  "technology-internet|internetanschluss": "Internet",
  "technology-internet|app": "Software",
  "technology-internet|e-mail-adresse": "E-Mail",
  "leisure-sport|radfahren": "Rad",
  "leisure-sport|eintrittskarte": "Eintritt",
  "holidays-accommodation|reiseziel": "Ziel",
  "holidays-accommodation|campingplatz": "Camp",
  "holidays-accommodation|ferienwohnung": "Urlaub",
  "holidays-accommodation|einzelzimmer": "Zimmer",
  "holidays-accommodation|doppelzimmer": "Zimmer",
  "holidays-accommodation|fruehstuecksbuffet": "Buffet",
  "society-community|wahl": "wählen",
  "society-community|gleichberechtigung": "gleichberechtigt",
  "feelings-opinions|trauer": "traurig",
  "problems-solutions|missverstaendnis": "Verständnis",
  "plans-goals-time|zeitraum": "Zeit",
  "family-relationships|aufwachsen": "wachsen",
  "daily-life|duschen": "Dusche",
  "daily-life|waschen": "abwaschen",
  "daily-life|schlafen": "Bett",
  "food-eating-out|servieren": "Restaurant",
  "shopping-money|kaufen": "Kauf",
  "shopping-money|zurueckgeben": "geben",
  "school-education|sich-anmelden": "anmelden",
  "travel-transport|aussteigen": "steigen",
  "travel-transport|sich-verspaeten": "Verspätung",
  "travel-transport|zurueckfahren": "zurück",
  "city-services|einreichen": "reichen",
  "health-body|sich-erkaelten": "Erkältung",
  "health-body|impfen": "Arzt",
  "appointments-services|reklamieren": "sich beschweren",
  "appointments-services|stornieren": "absagen",
  "appointments-services|erneuern": "neu",
  "technology-internet|ausschalten": "schalten",
  "holidays-accommodation|anreisen": "reisen",
  "holidays-accommodation|abreisen": "reisen",
  "environment-weather|trennen": "Trennung",
  "society-community|respektieren": "Respekt",
  "society-community|spenden": "Geld",
  "feelings-opinions|sich-sorgen": "Sorge",
  "feelings-opinions|ruhig": "Ruhe",
  "feelings-opinions|ueberrascht": "Überraschung",
  "plans-goals-time|naechst": "bald",
  "plans-goals-time|spaeter": "spät",
  "plans-goals-time|kuenftig": "zukünftig",
  "connectors-prepositions|seitdem": "seit",
  "connectors-prepositions|darum": "deshalb",
  "connectors-prepositions|dennoch": "trotzdem",
  "connectors-prepositions|nicht-nur-sondern-auch": "sondern",
  "functional-exam-phrases|es-tut-mir-leid": "leid tun",
  "functional-exam-phrases|sich-entschuldigen-fuer": "entschuldigen",
  "functional-exam-phrases|richtig-verstanden": "Verständnis",
  "functional-exam-phrases|abschliessend": "Abschluss",
};
specs.forEach((spec) => {
  spec.referenceKey = coverageReferenceOverrides[`${spec.categoryId}|${spec.slug}`] || spec.referenceKey;
});
const expectedByCategory = {
  "personal-identity": 10, "family-relationships": 15, "home-living": 25,
  "daily-life": 25, "food-eating-out": 25, "shopping-money": 20,
  "work-profession": 35, "school-education": 25, "travel-transport": 35,
  "city-services": 30, "health-body": 35, "appointments-services": 20,
  "media-communication": 30, "technology-internet": 15, "leisure-sport": 20,
  "holidays-accommodation": 20, "environment-weather": 20, "society-community": 20,
  "feelings-opinions": 20, "problems-solutions": 20, "plans-goals-time": 15,
  "high-frequency-verbs": 20, "adjectives-adverbs": 20,
  "connectors-prepositions": 15, "functional-exam-phrases": 15,
};

const counts = Object.fromEntries(Object.keys(expectedByCategory).map((categoryId) => [categoryId, 0]));
specs.forEach((spec) => { counts[spec.categoryId] = (counts[spec.categoryId] || 0) + 1; });
const countErrors = [];
for (const [categoryId, expected] of Object.entries(expectedByCategory)) {
  if (counts[categoryId] !== expected) countErrors.push(`${categoryId}: expected ${expected}, received ${counts[categoryId]}`);
}
if (specs.length !== 550) countErrors.push(`Expected 550 expansion specs, received ${specs.length}`);
if (countErrors.length) throw new Error(`${countErrors.join("\n")}\nActual counts: ${JSON.stringify(counts)}`);

const outputPath = path.join(__dirname, "..", "..", "src", "data", "vocabulary", "expandedLexemeSpecs.json");
fs.writeFileSync(outputPath, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

const isUnusual = (spec) => {
  if (spec.type === "noun") return spec.plural === "no-plural" || spec.plural === "plural-only" || /[ÄÖÜäöüß]/u.test(spec.plural);
  if (spec.type === "verb") return spec.auxiliary === "sein" || spec.reflexive || Boolean(spec.separablePrefix) || !spec.preterite.endsWith("te");
  return spec.partOfSpeech === "phrase" || /\s/u.test(spec.target);
};
const representativeIds = new Set();
Object.keys(expectedByCategory).forEach((categoryId) => {
  specs.filter((spec) => spec.categoryId === categoryId).slice(0, 5).forEach((spec) => representativeIds.add(`${spec.categoryId}|${spec.slug}`));
});
specs.filter(isUnusual).forEach((spec) => representativeIds.add(`${spec.categoryId}|${spec.slug}`));
const auditEntries = specs.filter((spec) => representativeIds.has(`${spec.categoryId}|${spec.slug}`)).map((spec) => ({
  lexemeId: `de-b1-${spec.categoryId}-${spec.slug}`,
  categoryId: spec.categoryId,
  english: spec.source,
  german: spec.type === "noun" ? `${spec.article} ${spec.lemma}` : spec.type === "verb" ? spec.lemma : spec.target,
  partOfSpeech: spec.type === "term" ? spec.partOfSpeech : spec.type,
  metadata: spec.type === "noun"
    ? { article: spec.article, gender: spec.gender, plural: spec.plural }
    : spec.type === "verb"
      ? { auxiliary: spec.auxiliary, pastParticiple: spec.pastParticiple, preterite: spec.preterite, separablePrefix: spec.separablePrefix, reflexive: spec.reflexive }
      : { grammarRefs: spec.grammarRefs },
  example: spec.example,
  exampleTranslation: spec.exampleTranslation,
  referenceMapping: spec.referenceKey,
  selectionReason: isUnusual(spec) ? "representative-and-or-unusual" : "representative-category-sample",
}));
const auditPath = path.join(__dirname, "..", "..", "docs", "GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json");
fs.writeFileSync(auditPath, `${JSON.stringify({
  generatedAt: "2026-10-31",
  methodology: "At least five Phase 9B expansion entries per category, plus entries detected as structurally unusual (non-count/plural-only or umlaut noun plurals; sein, reflexive, separable, or strong verbs; fixed phrases).",
  limitation: "This is an automated developer audit sample and does not claim complete linguistic human review.",
  entryCount: auditEntries.length,
  entries: auditEntries,
}, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, auditPath, count: specs.length, auditCount: auditEntries.length, counts }, null, 2));
