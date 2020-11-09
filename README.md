### Auswertung für die CoP-DEV

Javascript Webapp zum Abrufen der Ergebnisse der CoP-DEV-Umfrage.  

Enthalten: 
- Google-SignIn-Authentifizierung, damit Daten nicht von extern abgerufen werden können
- Google-ID-Token wird gegen AWS-Credentials ausgetauscht, damit mit dem Lambda kommuniziert werden kann, welches die Daten über eine REST-Schnittstelle ausliefert
- Ergebnisse werden mithilfe der D3-Bibliothek visualisiert