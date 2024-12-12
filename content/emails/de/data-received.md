---
category: Daten erhalten
title: Wir sind dran!
subject: Wir übernehmen ab hier das Steuer!
---

Hey {{ $doc.client.firstName }},

vielen Dank für die Beauftragung!

Wir prüfen jetzt einen möglichen Entschädigungsanspruch aufgrund deiner Angaben und melden uns nach Abschluss der Prüfung bei dir.

Nachfolgend haben wir die übermittelten Daten noch einmal zusammengefasst. Bitte prüfe, ob die Daten korrekt sind und teile uns zeitnah per E-Mail mit, wenn etwas nicht stimmt. Es ist wichtig, dass die Angaben wahrheitsgemäß, vollständig und ordnungsgemäß sind. Wenn alle Daten korrekt sind, brauchst du nichts weiter zu unternehmen.

Übermittelte Daten:
{{ $doc }}

Mit den folgenden Daten kannst du immer den Stand der Bearbeitung einsehen:
Fallnummer: **{{ $doc.id }}**
Buchungsnummer: **{{ $doc.booking.number }}**

Mit freundlichen Grüßen,
Dein RightsPlus-Team