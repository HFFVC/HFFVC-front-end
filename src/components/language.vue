<template>
  <div class="lang-wrap">
    <!-- <div class="label-lang mr-3">Choose your language:</div> -->
    <div class="lang-radio">
      <!-- <div>
 v-for="lang in this.$polyglot.languagesAvailable"
      v-bind:key="lang"
    </div> -->
      <label @click="showAppIn('en')">
        <input
          class="lang-radio-btn"
          type="radio"
          name="langRadio"
          :checked="selectedLanguage == 'en'"
        />
        <img
          src="../assets/images/flag_us.png"
          title="English"
          alt=""
          srcset=""
          class="flagImg"
          :class="selectedLanguage == 'en' ? 'border-bottom' : ''"
        />
      </label>
      <label @click="showAppIn('fr')">
        <input
          class="lang-radio-btn"
          type="radio"
          name="langRadio"
          :checked="selectedLanguage == 'fr'"
        />
        <img
          src="../assets/images/flag_fr.png"
          title="French"
          alt=""
          srcset=""
          class="flagImg"
          :class="selectedLanguage == 'fr' ? 'border-bottom' : ''"
        />
      </label>
      <label @click="showAppIn('ht')">
        <input
          class="lang-radio-btn"
          type="radio"
          name="langRadio"
          :checked="selectedLanguage == 'ht'"
        />
        <img
          src="../assets/images/flag_ht.png"
          title="Haitian Creole"
          alt=""
          srcset=""
          class="flagImg"
          :class="selectedLanguage == 'ht' ? 'border-bottom' : ''"
        />
      </label>
      <!-- <div class="lang-radio-label">{{ lang }}</div> -->
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Polyglot from "vue-polyglot";

import firebase, { functions } from "firebase";
Vue.use(Polyglot, {
  defaultLanguage: "en",
  languagesAvailable: ["en", "fr", "ht"],
});

Vue.locales({
  fr: {
"Payment Date":"Date de paiement",
"Name of Account Owner":"Nom du titulaire du compte",
"Tax Id/ National Identification":"Numéro d'identification fiscale / identification nationale",
"Locality":"Localité",
"Address":"Adresse",
"Zip Code":"Code postal",
"Service Rendered":"Service rendu",
"Payment Amount":"Montant du paiement",
"Transactions":"Transactions",
"Auditor":"Auditeur",
"Excel Download":"Télécharger Excel",
"Logistic / Cold Chain Service Provider":"Fournisseur de services logistiques / chaîne du froid",
"Financial Services":"Services financiers",
"Extension Services":"Services d'extension",
"Technology Service Provider":"Fournisseur de services technologiques",
"Root Authority":"Autorité racine",
"Auditor":"Auditeur",
"You are trying to delete the SPOC user, please change the SPOC user for the organization and try again.":"Vous essayez de supprimer l'utilisateur SPOC, veuillez modifier l'utilisateur SPOC de l'organisation et réessayer.",
"User deleted":"Utilisateur supprimé",
"Please select a role.":"Veuillez sélectionner un rôle.",
"Please enter a valid email address.":"S'il vous plaît, mettez une adresse email valide.",
"New user has been added.":"Un nouvel utilisateur a été ajouté.",
"User details updated.":"Détails de l'utilisateur mis à jour.",
"Failed to update user details.":"Échec de la mise à jour des détails de l'utilisateur.",
"System can have only one Technology Service Provider":"Le système ne peut avoir qu'un seul fournisseur de services technologiques",
"System can have only one Root Authority Organization":"Le système ne peut avoir qu'une seule organisation d'autorité racine",
"You don't have permission to edit the Technology Service Provider Data.":"Vous n'êtes pas autorisé à modifier les données du fournisseur de services technologiques.",
"Please add broker margin.":"Veuillez ajouter la marge du courtier.",
"Please enter % Distribution.":"Veuillez saisir% Distribution.",
"Please enter at least one distribution.":"Veuillez saisir au moins une distribution.",
"Please enter a valid organization email address.":"Veuillez saisir une adresse e-mail d'organisation valide.",
"Please enter a valid SPOC email address.":"Veuillez saisir une adresse e-mail SPOC valide.",
"SPOC email id already in use, try another email id.":"Identifiant de messagerie SPOC déjà utilisé, essayez un autre identifiant de messagerie.",
"Select Product":"Sélectionner un produit",
"Root Authority-Dashboard":"Tableau de bord de l'autorité racine",
"Technology Service Provider-Dashboard":"Tableau de bord du fournisseur de services technologiques",
"Login as Auditor":"Connectez-vous en tant qu'auditeur",
    "Dashboard - MCI": "Tableau de bord - MCI",
    "Manage Fruit Flow": "Gérer le flux de fruits",
    "Organization Name / Email": "Nom de l'organisation / e-mail",
    "Organization Name": "Nom de l'organisation",
    "Organization Info": "Informations sur l'organisation",
    "Organization Type": "Type d'Organisation",
    "Zip Code": "Code postal",
    "SPOC Details": "Détails SPOC",
    "Select Organization": "Sélectionnez une organisation",
    Organization: "Organisation",
    "Identification No.": "Numéro d'identification.",
    Organization: "Organisation",
    "Account Details": "Détails du compte",
    "Bank Account Currency": "Devise du compte bancaire",
    Fruits: "Fruits",
    "Used for calculations": "Utilisé pour les calculs",
    "Ambient Temperature": "Température ambiante",
    Attachments: "Pièces jointes",
    "Internal Fruit Temperature": "Température interne des fruits",
    "Transfer To Cold Storage": "Transfert vers une chambre froide",
    "Removal from Cold Storage": "Retrait de l'entrepôt frigorifique",
    "Feed Packing Line Conveyor Belt":
      "Bande transporteuse de ligne d'emballage d'alimentation",
    "Fruits Removed": "Fruits supprimés",
    "Start QR Code Fruits": "Démarrer QR Code Fruits",
    "End QR Code Fruits": "Fin QR Code Fruits",
    "Start QR Code Boxes": "Démarrer les boîtes de code QR",
    "End QR Code Boxes": "Terminer les boîtes de code QR",
    "Temperature Reading For Packed Lot":
      "Lecture de température pour le lot emballé",
    "Ambient Temperature": "Température ambiante",
    "Internal Fruit Temperature": "Température interne des fruits",
    "Airflow Temperature": "Température du flux d'air",
    "Removal from Forced Air Cooling": "Retrait du refroidissement à air forcé",
    "Fruit Temperature on Exit": "Température des fruits à la sortie",
    "Cold Storage In": "Entreposage frigorifique dans",
    "Airflow Temperature": "Température du flux d'air",
    "Cold Storage Out": "Entreposage frigorifique",
    Timestamp: "Horodatage",
    "Pre Cooling Reefers": "Pré-refroidissement Reefers",
    Container: "Récipient",
    "Destination Date And Time": "Date et heure de destination",
    Destination: "Destination",
    transport: "transport",
    "Departure Date and Time": "Date et heure de départ",
    "PH Level": "Niveau de PH",
    "Water Temperature": "La température de l'eau",
    "Cleaning And Trimming": "Nettoyage et taille",
    "Search Query": "Requête de recherche",
    Filter: "Filtre",
    Feedback: "Retour d'information",
    "Total Weight of Fruits Sold (in Kg)":
      "Poids total des fruits vendus (en kg)",
    Distribution: "Distribution",
    "% Distribution": "% Distribution",
    Lots: "Lots",
    Avacado: "Avocat",
    Mango: "Mangue",
    Pineapple: "Ananas",
    "Search Query": "Requête de recherche",
    "First Name": "Prénom",
    "Last Name": "Nom de famille",
    Department: "département",
    Town: "Ville",
    "Phone Number": "Numéro de téléphone",
    Location: "Emplacement",
    "Proposed By": "Proposé par",
    Reject: "Rejeter",
    "Manage LSP Users": "Gérer les utilisateurs LSP",
    "Packhouse Incharge": "Packhouse en charge",
    "Login as Packhouse Incharge":
      "Connectez-vous en tant que Packhouse en charge",
    Organization: "Organisation",
    "Select Roles": "Sélectionnez les rôles",
    "Harvest Planner": "Planificateur de récolte",
    Collector: "Collectionneur",
    "Truck Registered": "Camion enregistré",
    Town: "Ville",
    Organization: "Organisation",
    "No Data": "Pas de données",

    Logout: "Se déconnecter",
    "Calender-View": "test",
    // _____________  Collector ___________
    "PickUp Requested On": "Ramassage Demandé le",
    Produce: "Produire",
    "Collect at": "Collecté à",
    "Drop Off At": "Déposé à",
    "Current Status": "Statut Actuel",
    "Additional Notes": "Notes Aditionnelles",
    "Please Select a Pickup from the list to update Status":
      "Veuillez sélectionner un ramassage dans la liste pour mettre à jour le statut",
    "Status - Enroute Producer": "Statut - Vers Packhouse",
    Dashboard: "Tableau de Bord",
    Cancel: "Annuler",
    Save: "Sauvegarder",
    "Enroute Producer": "Vers Packhouse",
    Temperature: "Température",
    "Ambient Temp": "Temp Ambiante",
    "Crates (Full)": "Caisses (Pleines)",
    "Select Crates Part": "Selectionner Caisses Partielles",
    "Fruit Harvested": "Fruits Récoltés",
    "Fruit Rejected": "Fruits Rejetés",
    "Start QR Code": "Début QR Code",
    "End QR Code": "Fin QR Code",
    "Status - With Producer": "Statut - Avec Producteur",
    Reject: "Rejeter",
    "Attach Start QR Code": "Joindre Début QR Code",
    "Attach End QR Code": "Joindre Fin QR Code",
    "Drop-Off location": "Lieu de Dépot",
    "Status - Enroute Packhouse": "Statut - Vers Packhouse",
    "Planned Pickups": "Ramassage Plannifié",
    "Transport Cost": "Cout Transport",
    "Time of Admittence": "Heure d'admission",
    "Status - Arrived At Packhouse": "Statut - Arrivé au PackHouse",
    Assigned: "Attribué",
    "Collector Dashboard": "Tableau de bord du collecteur",
    "Dashboard - MCI": "Tableau de bord du - MCI",
    "Collector-Dashboard": "collecteur - Tableau de bord du",
    "Powered By AgriLedger": "Propulsé par Agriledger",
    "Select Crates Part - Creole missing":
      "Sélectionnez la partie Crates - Créole manquant",
    Wire: "Câble",
    Mobile: "Mobile",
    Cash: "En espèces",
    "Is ready to pay to NGO?": "Est-il prêt à payer à une ONG?",
    "Reason for Rejection": "Raison du rejet",
    "No Attachments yet": "Pas encore de pièces jointes",
    "Attach (doubt if its possible)": "Joindre (doute si c'est possible)",
    "Rejection Criteria": "Critères de rejet",
    "Drop file here": "Déposer le fichier ici",
    "Please enter temperature": "Veuillez saisir la température",
    "Please enter ambient temp": "Veuillez saisir la température ambiante",
    "Please enter crates": "Veuillez entrer les caisses",
    "Please enter fruit harvested": "Veuillez saisir les fruits récoltés",
    "Please enter fruit rejected": "Veuillez saisir le fruit rejeté",
    "Please Select a Reason for Rejected Fruits.":
      "Veuillez sélectionner une raison pour les fruits rejetés.",
    "You can select only two images.":
      "Vous ne pouvez sélectionner que deux images.",
    "Please enter a valid fruit count":
      "Veuillez saisir un nombre de fruits valide",
    "Please enter advance given": "Veuillez saisir l'avance donnée",
    "Please scan/enter the QR codes.":
      "Veuillez scanner / saisir les codes QR.",
    "Please select currency": "Veuillez sélectionner la devise",
    "Please select payment method": "Veuillez sélectionner le mode de paiement",
    "Please select NGO": "Veuillez sélectionner une ONG",
    "Please select bank": "Veuillez sélectionner la banque",
    "Please enter valid account number":
      "Veuillez saisir un numéro de compte valide",
    "Please select drop off location": "Veuillez sélectionner le lieu de dépôt",
    "There seems to no Internet connectivity. Your data will be automatically synchronized the moment connectivity is established. You can continue to work with the application in the meanwhile":
      "Il ne semble pas y avoir de connectivité Internet. Vos données seront automatiquement synchronisées au moment où la connectivité sera établie. Vous pouvez continuer à travailler avec l'application en attendant",
    "Application is offline now": "L'application est maintenant hors ligne",
    Collector: "Collectionneur",
    "Enroute Producer": "En route Producteur",
    "Enroute Packhouse": "En route Station de conditionnement",
    "With Producer": "Avec le producteur",
    "Arrived at Packhouse": "Arrivé à Station de conditionnement",
    "Arrived At Packhouse": "Arrivé à Station de conditionnement",
    "Choose your language": "Choisissez votre langue",
    Quality: "Qualité",
    Maturity: "Maturité",
    Quantity: "Quantité",

    // ________________________
    // _____________  Sae ___________
    Producer: "Producteur",
    Fruit: "Fruit",
    "New Service Request": "Nouvelle Requête de Service",
    "GPS Location": "Position GPS",
    "Estimated Fruits": "Fruits estimés",
    "Manage Users": "gérer les utilisateurs",
    "Start Typing Producer": "Commencer à taper Producer",
    Mango: "Mangue",
    Pineapple: "Ananas",
    Avocado: "Avocat",
    Mots: "Mots",
    Pays: "Pays",
    "Lieu le plus proche": "Lieu le plus proche",
    Cancel: "Annuler",
    "Submit Request": "Envoyer la demande",
    "Mandatory Fields": "Champs obligatoires",

    "List of Producers (KOBO)": "Liste de Producteurs (KOBO)",
    "List of Producers": "Liste de Producteurs",
    Town: "Ville",
    "Producer Name / Depart / Town": "Nom Producteur / Depart / Ville",
    "Manage Service Requests": "Gérer les Requêtes de Service",
    Select: "Selectionner",
    "Display Id": "id",
    "Department / Town": "Département / Ville",
    Department: "Département",
    "Estimated Fruits #": "Fruits Estimés #",
    Product: "Produit",
    "Created By": "Créé par",
    Location: "Lieu",
    Edit: "Editer",
    Status: "Statut",
    "View More": "Voir plus",
    "Order Requested On": "Commande passée le",
    // ________________________________

    // _________  LSP  ____________________
    "Service Request Id": "Id Requête de Service",
    Plan: "Planifier",
    Collector: "Collecteur",
    "Collection point": "Lieu de collection",
    "No matching records": "Aucun résultat correspondant",
    "Collection Requested On": "Collection demandée le",
    "Date of Pickup": "Date de collection",
    "Drop Off At Packhouse": "Déposer au packhouse",
    "Collection Point": "Lieu de collection",
    Save: "Enregistrer",
    "Pickup Requested On": "Ramassage Demandé le",
    "Collect at": "Collecté à",
    Produce: "Produire",
    "Drop Off At": "Déposé à",
    "Current Status": "Statut Actuel",
    "Fruit Flow": "Progression Fruits",
    "Lots at Packhouse": "Lots au PackHouse",
    "Flow Milestones": "Etape Clé",
    Warning: "Alerte",
    "Are you sure you want to proceed to the next stage without saving?":
      "Êtes-vous sûr de vouloir continuer à la prochaine étape sans sauvegarder?",
    "Transport Details": "Détails Transport",
    "Transport Details *": "Détails Transport *",
    "Container Inspection": "Inspection de Container",
    "Container Inspection *": "Inspection de Container *",
    "Larvae Testing": "Test de Larves",
    "Larvae Testing *": "Test de Larves *",
    "Temperature Measurement": "Prise de Température",
    "Temperature Measurement *": "Prise de Température *",
    "Ambient Temp": "Temp Ambiante",
    "Internal Fruit Temp": "Temp Interne du Fruit",
    Attachment: "Pièces Jointes",
    "Quality Inspection": "Inspection Qualité",
    "Quality Inspection *": "Inspection Qualité *",
    "Quality Instpection Results": "Résultats Inspection Qualité",
    "Fruits Accepted": "Fruits Acceptés",
    "Fruits Rejected": "Fruits Rejetés",
    "Fruit Washing": "Lavage Fruits",
    "Fruit Washing *": "Lavage Fruits *",
    "Water Temp": "Temp Eau",
    "Ph Level": "Niveau Ph",
    "Chlorine Level": "Niveau Chlore",
    Sizing: "Dimensionnement",
    "Sizing Results": "Résultats Dimensionnement",
    Sizing: "Dimensionnement",
    "Sizing *": "Dimensionnement *",
    "Hot Water Treatment Entry": "Traitement eau chaude - entrée",
    "Hot Water Treatment Entry *": "Traitement eau chaude - entrée *",
    "Time of Entry": "Heure d'Entrée",
    "Hot Water Treatment Exit": "Traitement eau chaude - Sortie",
    "Hot Water Treatment Exit *": "Traitement eau chaude - Sortie *",
    "Duration of Treatment": "Durée Traitement",
    "Time of Exit": "Heure de Sortie",
    "Hydro Cooling Entry": "Refroidissement Hydraulique - Entrée",
    "Hydro Cooling Entry *": "Refroidissement Hydraulique - Entrée *",
    "Hydro Cooling Exit": "Refroidissement Hydraulique - Entrée",
    "Hydro Cooling Exit *": "Refroidissement Hydraulique - Entrée *",
    "Feed Packing Line Conveyor Belt": "Feed Packing Line Conveyor Belt",
    "Feed Packing Line Conveyor Belt *": "Feed Packing Line Conveyor Belt *",
    "Packing Line - Time of Entry": "Ligne d'Emballage - Heure d'Entrée",
    Grading: "Classement",
    "Grading Results": "Résultats Classement",
    Grading: "Classement",
    "Grading *": "Classement *",
    "Number of removed fruit": "Nombre de fruits enlevés",
    "Second Sizing Results": "Seconds Résultats Dimensionnement",
    "Carton Filling + Palletizing": "Remplissage de Carton + Paletisation",
    "Carton Filling + Palletizing *": "Remplissage de Carton + Paletisation *",
    "Carton Filling": "Remplissage de Carton",
    "Carton Filling *": "Remplissage de Carton *",
    "Start QR Code # - Fruits": "Début # QR Code - Fruits",
    "End QR Code # - Fruits": "Fin # QR Code - Fruits",
    "Start QR Code # - Boxes": "Début QR Code # - Fruits",
    "End QR Code # - Boxes": "Début QR Code # - Fruits",
    "Temperature Readings for Packed Lot":
      "Lecture de Température pour Lot Emballé",
    "Temperature Readings for Packed Lot *":
      "Lecture de Température pour Lot Emballé *",
    "Forced Air Cooling Entry": "Refroidissement Forcé à l'Air - Entrée",
    "Forced Air Cooling Entry *": "Refroidissement Forcé à l'Air - Entrée *",
    "Entry Time": "Heure d'Entrée",
    "Fruit Temperature at Entry": "Température Fruit à l'Entrée",
    "Airflow Temperature RH": "Température du Flux d'Air",
    "Removal from Forced Air Cooling":
      "Retrait du Refroidissement Forcé à l'Air",
    "Removal from Forced Air Cooling *":
      "Retrait du Refroidissement Forcé à l'Air *",
    "Removal Time": "Heure Retrait",
    "Fruit Temperature at Removal": "Temperature Fruit au Retrait",
    "Cold Room Storage In": "Stockage en Chambre Froide - Entrée",
    "Cold Room Storage In *": "Stockage en Chambre Froide - Entrée *",
    "Fruit Temp": "Temp Fruit",
    "Storage Time In": "Heure Stockage - Entrée",
    "Cold Room Storage Out": "Stockage en Chambre Froide - Sortie",
    "Cold Room Storage Out *": "Stockage en Chambre Froide - Sortie *",
    "Storage Time Out": "Heure Stockage - Sortie",
    "Upload Product Certification": "Télécharger Certifications Produits",
    Sampling: "Echantillonnage",
    "Samples Taken": "Echantillons Pris",
    Temperature: "Température",
    "Date & Time of Sampling": "Date et Heure Echantillonage",
    "Shipping Details": "Détails Livraison",
    "Shipping Details *": "Détails Livraison *",
    "Shipment by Air": "Livraison par Voie Aérienne",
    "Shipment by Sea": "Livraison par Voie Maritime",
    "Transport Details": "Détails Transport",
    "Transport Details *": "Détails Transport *",
    "Departure Date/Time": "Départ Date/Heure",
    Destination: "Destination",
    "No Attachment Yet": "Pas Encore de Pièce Jointe",
    "Fruits Rejected at Collection Point":
      "Fruits Rejetés au Point de Collection",
    Proceed: "Continuer",
    "Start QR Code# - Pallets": "Début QR Code# - Palettes",
    "End QR Code# - Pallets": "Fin QR Code# - Palettes",
    Lots: "Lots",
    "No of Boxes": "Nombre de Boites",
    "Fruit Flow Completed On": "Progression Fruit Completée Le",
    Shipping: "Livraison",
    "Create Batch": "Créer Batch",
    Desitination: "Destination",
    "First Name": "Prénom",
    "Last Name": "Nom",
    "Name / Email": "Nom / Email",
    "Email address": "Adresse Email",
    "Contact Number": "Numéro Contact",
    "Enrolled Collectors": "Collecteurs Inscrits",
    "Collector Details": "Détails du Collecteur",
    "Create New Collector": "Créer Nouveau Collecteur",
    "Select a Collector to Edit & Update OR Create a New Collector":
      "Selectionner un Collecteur pour Editer et Mettre à jour OU Créer un Nouveau Collecteur",
    "Batch Id": "Id Batch",
    "Batch Created On": "Batch créé le",
    "No. of Lots": "No. de Lots",
    "Plan/Generate Invoice": "Générer Facture",
    "Proforma No.": "No. Proforma",
    "Seller Name": "Nom du Vendeur",
    Packhouse: "Station de Conditionnement",
    Currency: "Monnaie",
    "Unit Price Per Kg": "Prix Unitaire Par Kg",
    "Selling to": "Vendu à",
    "Broker Name": "Nom du Courtier",
    Email: "Email",
    "Address Line 1": "Ligne Adresse 1",
    "Address Line 2": "Ligne Adresse 2",
    "Address Line 3": "Ligne Adresse 3",
    "Total No Of Boxes": "Nombre total de Boites",
    "Proforma Invoice": "Proforma",
    "Select Currency": "Selectionner Monnaie",
    // newly added
    "Active Service Requests": "Demandes de service actives",
    "Schedule Pickup": "Planifier le ramassage",
    "Plan and Schedule Pickup": "Planifier et programmer le ramassage",
    "Please select Collector.": "Veuillez sélectionner Collecteur",
    "Please select Date.": "Veuillez sélectionner la date.",
    "Please select Collection Point.":
      "Veuillez sélectionner un point de collecte.",
    "Please select Drop Off At Packhouse.":
      "Veuillez sélectionner déposer à Station de Conditionnement",
    "7 days penalty levied.": "Pénalité de 7 jours imposée.",
    "10 days penalty levied.": "Pénalité de 7 jours imposée.",
    "Request and lot got rejected, becuase pick up scheduling after 10 days.":
      "La demande et le lot ont été rejetés, car la planification de la cueillette après 10 jours.",
    "Pickup scheduled successfully.": "Ramassage planifié avec succès.",
    "Previous Service Requests": "Demandes de service précédentes",
    "Collection Point Name": "Nom du point de collecte",
    "Collector Name": "Nom du collecteur",
    "Pre-Cooling Reefers": "Reefers de pré-refroidissement",
    "Pre-Cooling Reefers *": "Reefers de pré-refroidissement *",
    "Cold Tunnel Loading": "Chargement du tunnel froid",
    "Cold Tunnel Loading *": "Chargement du tunnel froid *",
    "Date & Time": "Date et heure",
    "Cold Storage Time In": "Temps de stockage à froid dans",
    "Cold Storage Time out": "Délai de stockage à froid",
    "Attach QR Code": "Joindre le code QR",
    "View attached": "Voir ci-joint",
    "Reefer Wall Temperature": "Température du mur Reefer",
    "Destination Date/Time": "Date / heure de destination",
    "Transport Conditions": "Conditions de transport",
    "Are you sure you want to proceed to update the Larvae Testing as 'failed'":
      "Êtes-vous sûr de vouloir mettre à jour le test des larves comme 'échoué'",
    "Attached QR Codes": "Codes QR joints",
    Warning: "Attention",
    "Temperature entered is outside the defined critical limits. Are you sure you want to proceed":
      "La température entrée est en dehors des limites critiques définies. Êtes-vous sur de vouloir continuer",
    "Hold Camera/Scanner Steady":
      "Maintenez l'appareil photo / scanner en place",
    Done: "Terminé",
    "Temperature Measurement details saved successfully.":
      "Les détails de la mesure de température ont été enregistrés avec succès.",
    "Upload Product Certifications saved successfully.":
      "Importez les certifications de produit enregistrées avec succès.",
    "Container Inspection details saved successfully.":
      "Les détails de l'inspection des conteneurs ont été enregistrés avec succès.",
    "Transport Details saved successfully.":
      "Détails du transport enregistrés avec succès.",
    "Select Larvae Testing Results":
      "Sélectionnez les résultats du test des larves",
    "Larvae Testing details saved successfully.":
      "Les détails du test des larves ont été enregistrés avec succès.",
    "Ambient Temperature is needed.": "La température ambiante est nécessaire.",
    "Internal Fruit Temperature is needed.":
      "La température interne des fruits est nécessaire.",
    "Please add attachments.": "Veuillez ajouter des pièces jointes.",
    "Temperature Measurement details saved successfully.":
      "Les détails de la mesure de température ont été enregistrés avec succès.",
    "Enter Fruits Accepted.": "Entrez Fruits Acceptés.",
    "Enter Fruits Rejected.": " Entrez Fruits Rejetés.",
    "Enter Quality Inspection Results.":
      "Entrez les résultats du contrôle qualité.",
    "Quality Inspection details saved successfully.":
      "Les détails de l'inspection qualité ont été enregistrés avec succès.",
    "Please check the fruit count.": "Veuillez vérifier le nombre de fruits.",
    "Please fill duration of treatment.":
      "Veuillez indiquer la durée du traitement.",
    "Please fill time of exit.": "Veuillez indiquer l'heure de sortie.",
    "Hot Water Treatment Exit details saved successfully.":
      "Les détails de la sortie du traitement de l'eau chaude ont été enregistrés avec succès.",
    "Please fill PH Level.": "Veuillez remplir le niveau de PH.",
    "Please fill chlorine level.": "Veuillez remplir le niveau de chlore.",
    "Please fill time of entry.": "Veuillez indiquer l'heure d'entrée.",
    "Please fill water temperature": "Veuillez remplir la température de l'eau",
    "Hot Water Treatment Entry details saved successfully.":
      "Les détails de l'entrée du traitement de l'eau chaude ont été enregistrés avec succès.",
    "Hydro Cooling Entry details saved successfully.":
      "Les détails de l'entrée Hydro Cooling ont été enregistrés avec succès.",
    "Please fill in internal fruit temperature.":
      "Veuillez indiquer la température interne des fruits.",
    "Please fill in duration": "Veuillez indiquer la durée",
    "Hydro Cooling Exit details saved successfully.":
      "Les détails de la sortie Hydro Cooling ont été enregistrés avec succès.",
    "Please select files to upload.":
      "Veuillez sélectionner les fichiers à télécharger.",
    "Nothing to upload.": "Rien à télécharger.",
    "Please fill in all the details.": "Veuillez remplir tous les détails.",
    "Cleaning & Trimming details saved successfully.":
      "Les détails de nettoyage et de coupe ont été enregistrés avec succès.",
    "Cleaning & Trimming": "Nettoyage et taille",
    "Cleaning & Trimming *": "Nettoyage et taille *",
    "Sizing details saved successfully.":
      "Les détails de dimensionnement ont été enregistrés avec succès.",
    "Fruit Washing details saved successfully.":
      "Les détails du lavage des fruits ont été enregistrés avec succès.",
    "Please fill storage time in":
      "Veuillez indiquer la durée de stockage dans",
    "Please fill in temperature": "Veuillez indiquer la température",
    "Transfer to Cold Storage details saved successfully.":
      "Les détails du transfert vers la chambre froide ont été enregistrés avec succès.",
    "Please fill in storage time out.":
      "Veuillez indiquer le délai de stockage.",
    "Removal from Cold Storage details saved successfully.":
      "Les détails de la suppression de Cold Storage ont été enregistrés avec succès.",
    "Feed Packing Line Conveyor Belt details saved successfully.":
      "Détails de la bande transporteuse de la ligne d'emballage d'alimentation enregistrés avec succès.",
    "Please fill in weight of the fruits removed":
      "Veuillez indiquer le poids des fruits retirés",
    "Please fill in grading results":
      "Veuillez remplir les résultats de notation",
    "Grading details saved successfully.":
      "Les détails de notation ont bien été enregistrés.",
    "Sizing details saved successfully.":
      "Les détails de dimensionnement ont été enregistrés avec succès.",
    "Please fill in fruits start QR Code":
      "Veuillez remplir le code QR de démarrage des fruits",
    "Please fill in fruits end QR Code":
      "Veuillez remplir le code QR de fin de fruits",
    "Please fill in box start QR Code":
      "Veuillez remplir la case commencer le code QR",
    "Please fill in box end QR Code":
      "Veuillez remplir le code QR de fin de boîte",
    "Carton Filling + Palletizing details saved successfully.":
      "Remplissage de carton + détails de palettisation enregistrés avec succès.",
    "Carton Filling + Palletizing details not updated.":
      "Remplissage de carton + détails de palettisation non mis à jour.",
    "Carton Filling + Palletizing details not updated.":
      "Remplissage de carton + détails de palettisation non mis à jour.",
    "Box start and end QR Code length must be same.":
      "La longueur du code QR de début et de fin de la boîte doit être la même.",
    "Fruit start and end QR Code length must be same.":
      "La longueur du code QR de début et de fin du fruit doit être la même.",
    "Please fill in ambient temperature":
      "Veuillez indiquer la température ambiante",
    "Please fill in internal fruit temperature":
      "Veuillez indiquer la température interne des fruits",
    "Temperature Readings for Packed Lot details saved successfully.":
      "Les relevés de température pour les détails des lots emballés ont été enregistrés avec succès.",
    "Error updating data to firebase.":
      "Erreur lors de la mise à jour des données vers Firebase.",
    "Please fill in airflow temperature":
      "Veuillez indiquer la température du flux d'air",
    "Please fill in fruit temperature at entry":
      "Veuillez indiquer la température des fruits à l'entrée",
    "Please fill in time of entry": "Veuillez indiquer l'heure d'entrée",
    "Forced Air Cooling Entry details saved successfully.":
      "Les détails de l'entrée de refroidissement à air forcé ont été enregistrés avec succès.",
    "Please fill in fruit temperature":
      "Veuillez indiquer la température des fruits",
    "Please fill in time of removal":
      "Veuillez indiquer l'heure de suppression",
    "Removal from Forced Air Cooling details saved successfully.":
      "Suppression des détails du refroidissement à air forcé enregistrés avec succès.",
    "Please fill in storage time": "Veuillez indiquer le temps de stockage",
    "Cold Room Storage In details saved successfully.":
      "Stockage chambre froide les détails Entrant enregistrés avec succès. .",
    "Please fill in storage time out.":
      "Veuillez indiquer le délai de stockage.",
    "Cold Room Storage Out details saved successfully.":
      "Stockage chambre froide les détails Sortants ont été enregistrés avec succès.",
    "Please attach files": "Veuillez joindre des fichiers",
    "Please enter samples taken": "Veuillez saisir les échantillons prélevés",
    "Please enter sampling temperature":
      "Veuillez saisir la température d'échantillonnage",
    "Please enter date and time of sampling":
      "Veuillez saisir la date et l'heure de l'échantillonnage",
    "Sampling details saved successfully.":
      "Les détails de l'échantillonnage ont été enregistrés avec succès.",
    Sampling: "échantillonnage",
    "Sampling *": "échantillonnage *",
    "Please enter reefer wall temperature":
      "Veuillez saisir la température du mur réfrigéré",
    "Pre-Cooling Reefers details saved successfully.":
      "Les détails du pré-refroidissement Reefers ont été enregistrés avec succès.",
    "Please enter destination date and time":
      "Veuillez saisir la date et l'heure de destination",
    "Please enter refer wall temperature":
      "Veuillez saisir la température du mur de référence",
    "Cold Tunnel Loading details saved successfully.":
      "Les détails du chargement du tunnel froid ont été enregistrés avec succès.",
    "Please enter shipping details": "Veuillez saisir les détails de livraison",
    "Shipping Details saved successfully.":
      "Détails de livraison enregistrés avec succès.",
    "Please select currency": "Veuillez sélectionner la devise",
    "Please enter departure date and time":
      "Veuillez saisir la date et l'heure de départ",
    "Please enter destination": "Veuillez entrer la destination",
    "Please enter transport temperature":
      "Veuillez saisir la température de transport",
    "Please enter transport conditions":
      "Veuillez saisir les conditions de transport",
    "Please enter transport cost": "Veuillez saisir les frais de transport",
    "Transport Details saved successfully.":
      "Détails du transport enregistrés avec succès.",
    "Please complete previous stages to update Transport Details.":
      "Veuillez terminer les étapes précédentes pour mettre à jour les détails du transport.",
    "Please fill Shipping Details.":
      "Veuillez remplir les détails d'expédition.",
    "Please fill Carton Filling + Palletizing Details.":
      "Veuillez remplir les détails de remplissage du carton + de palettisation.",
    "Temperature Measurement details saved successfully.":
      "Les détails de la mesure de température ont été enregistrés avec succès.",
    "Error fetching data.": "Erreur lors de la récupération des données.",
    "Error updating data to firebase.":
      "Erreur lors de la mise à jour des données vers Firebase.",
    "Please select one or more lots to create batch.":
      "Veuillez sélectionner un ou plusieurs unités pour créer un lot.",
    "Product and Shipping mode has to be same for creating batch.":
      "Le produit et le mode d'expédition doivent être les mêmes pour créer un lot.",
    "Batch created successfully.": "Le lot a été créé avec succès.",
    "Something went wrong!! Please try again!!":
      "Une erreur s'est produite. Veuillez réessayer !!",
    "Email sent.": "Email envoyé.",
    "Please enter a valid email address.":
      "S'il vous plaît, mettez une adresse email valide.",
    "New collector has been added.": "Un nouveau collectionneur a été ajouté.",
    "Failed to add new user.": "Échec de l'ajout d'un nouvel utilisateur.",
    "Collector Details updated.": "Détails du collecteur mis à jour.",
    "Failed to update User Details.":
      "Échec de la mise à jour des détails de l'utilisateur.",
    "Email sent successfully.": "E-mail envoyé avec succès.",
    "Please enter all the fields marked with *":
      "Veuillez saisir tous les champs marqués d'un *",
    "Proforma details saved successfully. Email with invoice details sent":
      "Les détails pro forma ont bien été enregistrés. E-mail avec les détails de la facture envoyés",

    //__________ LSP END __________________

    //__________ Broker __________________
    "No Attachments yet": "Pas Encore de Pièce Jointe",
    "Active Batches": "Les Batch Actifs",
    "No Of Lots": "Nombre de Lots",
    "No. of Lots": "Nombre de Lots",
    View: "Vair",
    Maintain: "Maintenir",
    Sell: "Vendre",
    Invoice: "Facture",
    Payment: "Paiement",
    "View Batch Details": "Voir Details Batch",
    "Batch Details": "Details Batch",
    "Batch No": "No Batch",
    "Product Type": "Type Procduit",
    "Departure Timestamp": "Heure Départ",
    "Departure Temperature": "Température au Départ",
    "Lot No": "No Lot",
    "No of Boxes": "Nombre de Boites",
    "Total Number Of Boxes": "Nombre Total de Boites",
    "Proforma No": "No Proforma",
    Proforma: "Proforma",
    "Full Name": "Nom Complet",
    "Unit Price": "Prix Unitaire",
    "Arrival & Destination": "Arrivée et Destination",
    "Arrival Timestamp": "Heure Arrivée",
    "Additional Comments": "Commentaires Aditionnels",
    "Upload Image": "Ajouter Image",
    "Cold Storage": "Stockage Froid",
    "Ethylene Level": "Niveau Ethylène",
    "CO2 Level": "Niveau CO2",
    "Cold Storage In Timestamp": "Stockage Froid en Heure",
    "Cost of Ripening": "Coût de maturation",
    "Sale Id": "Id Vente",
    Sale: "Vente",
    "Buyer's Name": "Nom Acheteur",
    "Buyer Name": "Nom Achtè",
    "Total No Of Boxes Sold": "Nombre Total de Boites Vendues",
    "Ship Order & Unloading": "Livraison, Commande et Déchargement",
    "Create New Sale": "Créer Nouvelle Vente",
    "Buyer's Contact Details": "Détails Contact Acheteur",
    "Buyer's Email": "Email Acheteur",
    "Date of Sale": "Date Vente",
    "No of Boxes": "Nombre de Boites",
    "P O": "P O",
    "Generate Invoice": "Générer Facture",
    "Please select a lot to proceed with Box selections":
      "Veuillez choisir un lot pour poursuivre avec les selections de Boites",
    Next: "Suivant",
    "Enter Buyer Details": "Entrer Détails Acheteur",
    "Buyer Details": "Détails Acheteur",
    "Sale Transaction Details": "Détails Transaction de Vente",
    "Select Boxes": "Selectionner Boites",
    Back: "Précédent",
    "View Invoice": "Voir Facture",
    "Download Invoice": "Télécharger Facture",
    Details: "Détails",
    Name: "Nom",
    Organization: "Organisation",
    "Broker Organization": "Organisation Courtier",
    Address: "Adresse",
    "Contact Details": "Détails Contact",
    Date: "Date",
    "Price Per Kg": "Prix par Kg",
    "Invoice No": "No. Facture",
    "Billing Date": "Date Facturation",
    "Nr of Boxes Purchased": "Nombre de Boites Achetées",
    "Apporximate Weight of Product Sold": "Poids Approxiamtif Produits Vendus",
    "Net Sales": "Ventes Nettes",
    "Net Receivable": "Créance Nette",
    "Was the Invoice Factored": "Facture Transmise",
    "View Purchase Order": "Voir Commande",
    "Product Type": "Type Procduit",
    Documents: "Documents",
    "Payment Confirmed On": "Paiement Confirmé Le",
    "Active Batches": "Lots actifs",
    "Unsuccessful Batches": "Lots infructueux",
    "Payment History": "historique de paiement",
    "Batch Details": "Détails du lot",
    "Loading/Unloading information has not been furnished for this batch":
      "Les informations de chargement / déchargement n'ont pas été fournies pour ce lot",
    "Total Number Of Lots": "Nombre total de lots",
    "Exceeded Time limit": "Délai dépassé",
    "Unsold No of Boxes": "Non invendu de boîtes",
    "Back To List": "Retour à la liste",
    "Select all unsold boxes": "Sélectionnez toutes les boîtes invendues",
    "Unselect all boxes": "Désélectionner toutes les cases",
    Done: "Terminé",
    "Weight(Kg) Per Box": "Poids (Kg) par boîte",
    "Broker Margin": "Marge du courtier",
    "Sales Price Per Kg": "Prix de vente par kg",
    "Weight(Kg) Per Box": "Poids (Kg) par boîte",
    "Unsold No of Boxes": "Non invendu de boîtes",
    "Boxes Selected": "Boîtes sélectionnées",
    "Box Selection": "Sélection de boîte",
    "Sales Price Per Kg": "Prix de vente par kg",
    "Sale Placed Successfully": "Vente réussie",
    "Ship Order": "Commande d'expédition",
    "Unloading at Buyer's Place": "Déchargement chez l'acheteur",
    "Date & Time of UnLoading": "Date et heure de déchargement",
    "Total No of Boxes UnLoaded": "Nombre total de boîtes non chargées",
    "Upload Purchase Order": "Télécharger le bon de commande",
    "Cost of Transportation": "Coût du transport",
    "Buyer's Location": "Emplacement de l'acheteur",
    "Invoice Details": "Détails de la facture",
    "Buyer Organization": "Organisation acheteur",
    "Unsuccessful Batches": "Lots infructueux",
    "Total Number Of Lots": "Nombre total de lots",
    "Payment History": "historique de paiement",
    "View Collection Point Details":
      "Afficher les détails du point de collecte",
    "Collection Time Stamp": "Horodatage de la collecte",
    "Fruits Rejected at CP": "Fruits rejetés au CP",
    "Fruits Collected": "Fruits récoltés",
    "Internal temp. of Fruit @ CP": "Temp interne. de Fruit @ CP",
    "Arrival at Packhouse": "Arrivée à Station de conditionnement",
    "View Shipment Details": "Afficher les détails de l'envoi",
    "No. of boxes shipped": "Nombre de boîtes expédiées",
    "Weight of Fruits Shipped (in Kgs)": "Poids des fruits expédiés (en kg)",
    "Fruits rejected at Packhouse":
      "Fruits rejetés à Station de conditionnement",
    "Date of shipment (Pro-forma creation Date)":
      "Date d'expédition (Date de création pro-forma)",
    "View Payment Details": "Afficher les détails du paiement",
    "Sold On": "Vendu sur",
    "Weight of Fruits Sold (in Kgs)": "Poids des fruits vendus (en Kgs)",
    "Payment to Broker": "Paiement au courtier",
    "Payment confirmed.": "Paiement accepté.",
    "Arrival and destination details saved successfully.":
      "Les détails d'arrivée et de destination ont été enregistrés avec succès.",
    "Please upload document.": "Veuillez télécharger le document.",
    "Quality Inspection details saved successfully.":
      "Les détails de l'inspection qualité ont été enregistrés avec succès.",
    "Cold Storage details saved successfully.":
      "Les détails de Chambre Froide ont été enregistrés avec succès.",
    "Cost of Maturation details saved successfully.":
      "Les détails du coût de maturation ont été enregistrés avec succès.",
    "Total no. of boxes unloaded should be less than total no. of boxes loaded.":
      "Nombre total de cartons déchargés doit être inférieur au nombre total de boîtes chargées.",
    "Please enter all the fields marked with *":
      "Veuillez saisir tous les champs marqués d'un *",
    "Sell placed successfully.": "Vente placé avec succès.",
    "Boxes selected should be less than corresponding Unsold No. of Boxes.":
      "Les boîtes sélectionnées doivent être inférieures au nombre de boîtes invendues correspondant.",
    "Enter number Of boxes to buy.": "Entrez le nombre de boîtes à acheter.",
    "Documents uploaded successfully.": "Documents téléchargés avec succès.",
    "Quality Inspection details saved successfully.":
      "Les détails de l'inspection qualité ont été enregistrés avec succès.",
    "Please complete the Ship Order and Unloading to generate the invoice.":
      "Veuillez compléter la commande d'expédition et le déchargement pour générer la facture.",
    "Generated invoice successfully. Email with invoice link sent to the buyer.":
      "Facture générée avec succès. E-mail contenant le lien de la facture envoyé à l'acheteur.",
    "Please fill all the fields.": "Veuillez remplir tous les champs.",
    "Please check the internet connection":
      "Veuillez vérifier la connexion Internet",
    "Error updating data to firebase":
      "Erreur lors de la mise à jour des données vers Firebase",
    "Payment confirmed successfully.": "Paiement confirmé avec succès.",
    "Error updating data corda blockchain.":
      "Erreur lors de la mise à jour de la blockchain de données corda.",
    "Successfully uploaded the Purchase Order.":
      "Le téléchargement du bon de commande a bien été effectué.",
    "Error updating Sold Out Status in firebase":
      "Erreur lors de la mise à jour de l'état épuisé dans Firebase",
    "Cost of Ripening details saved successfully.":
      "Détails du coût de maturation enregistrés avec succès.",
    "Invalid email address.": "Adresse e-mail invalide.",
    "Boxes loaded cannot be more than boxes sold.":
      "Les boîtes chargées ne peuvent pas être plus que les boîtes vendues.",
    "Total no. of boxes unloaded should be less than total no. of boxes loaded.":
      "Le nombre total de boîtes déchargées doit être inférieur au nombre total de boîtes chargées.",
    "Unloading at buyer's place details saved successfully.":
      "Déchargement chez l'acheteur des détails enregistrés avec succès.",
    "Please select boxes.": "Veuillez sélectionner des cases.",
    "Status updated successfully.": "Statut mis à jour avec succès.",
    "Cold Storage details saved successfully.":
      "Les détails de Chambre Froide ont été enregistrés avec succès.",
    "Penalties (If any)": "Pénalités (le cas échéant)",

    //__________ Broker END __________________

    //__________ Observer __________________
    "Order Requested": "Commande Solicitée",
    "Sold On": "Vendu Le",
    "Total Weight Of Fruits Sold (In Kgs)": "Poids Total Fruits Vendus (Kg)",
    "Net Sale in USD": "Vente Nette en USD",
    Distribution: "Distribution",
    "Sold On": "Vendu Le",
    "Weight of Fruits Sold (in Kg)": "Poids Fruits Vendus (Kg)",
    "Payment to LSP": "Paiement à LSP",
    "Payment to Harvest Planner": "Paiement à Planificateur de récolte",
    "Payment to Broker": "Paiement à Courtier",
    "Bank Transaction Fee": "Frais Transaction Bancaire",
    "Broker Margin": "Marge Courtier",
    "Broker Transport": "Transport Courtier",
    "Producer Name": "Nom Producteur",
    "Payment To Producer": "Paiement à Producteur",
    NGO: "ONG",
    "Payment To NGO": "Paiement à ONG",
    Penalties: "Pénalités",
    Type: "Type",
    "Calculated On": "Calculé Le",
    Amount: "Montant",
    "Levied On": "Prélevé Le",
    "View Distribution": "Voir Distribution",
    "All payments are in USD": "Tous les Paiements sont en USD",
    "Payment Breakdown": "Ventilation des Paiements",
    "View Lots": "Voir Lots",
    "Download as PDF": "Télécharger en PDF",
    "Attachment 1": "Pièces Jointes 1",
    "Attachment 2": "Pièces Jointes 2",
    "Attachment 3": "Pièces Jointes 3",

    //__________ Ob;server END __________________
    //____________ super admin ___________________

    "Dashboard - ADMIN": "Tableau de bord - ADMIN",
    "Manage Packhouses": "Gérer les station de conditionnement",
    "Manage Collection Points": "Gérer les points de collecte",
    "Manage NGOs": "Gérer les ONG",
    "Manage Bank Accounts": "Gérer les comptes bancaires",
    "Manage Harvest Planner Distribution":
      "Gérer la distribution Planificateur de récolte",
    "Manage Products": "Gérer les produits",
    "Login as Harvest Planner":
      "Connectez-vous en tant qu'Planificateur de récolte",
    "Login as LSP": "Connectez-vous en tant que LSP",
    "Login as LSP SPOC": "Connectez-vous en tant que LSP SPOC",
    "Login as Collector": "Connectez-vous en tant que collectionneur",
    "Login as Broker": "Connectez-vous en tant que courtier",
    "Login as Broker SPOC": "Connectez-vous en tant que courtier SPOC",
    "Login as TPA": "Connectez-vous en tant que TPA",
    "Login as OP-Admin": "Connectez-vous en tant qu'OP-Admin",
    "Login as Observer": "Connectez-vous en tant qu'observateur",
    "Login as Admin": "Connectez-vous en tant qu'administrateur",
    "Login as Observer-MCI": "Connectez-vous en tant qu'observateur-MCI",
    "Login as Harvest Planner":
      "Connectez-vous en tant qu' Planificateur de récolte",
    "Payment Reporting": "Rapports de paiement",
    "Unsuccessful Sale": "Vente infructueuse",
    "Manage Organizations": "Gérer les organisations",
    "Manage Fruit Flow": "Gérer les fruits flow",
    "Approve/Reject Proposed Producer":
      "Approuver / rejeter le producteur proposé",
    "Manage Users": "Gérer les Utilisateurs",
    "Enrolled Users": "Utilisateurs inscrits",
    "Create New User": "Créer un nouveau utilisateur",
    "Select a User to Edit": "Sélectionnez un utilisateur à modifier",
    "Role Description (Eg. Input Pickup Request)":
      "Description du rôle (par exemple, entrée demande de collecte)",
    Function: "Fonction",
    "Broker Margin In %": "Marge du courtier en %",
    Organization: "Organisation",
    "Grant All Privileges": "Accorder tous les privilèges",
    "SA-Dashboard": "Tableau de bord SA",
    "MCI-Dashboard": "Tableau de bord MCI",
    "Manage Users": "Gérer les Utilisateurs",
    "Edit User Details": "Modifier les détails de l'utilisateur",
    "User Details": "Détails de l'utilisateur",
    "Edit User Details": "Modifier les détails de l'utilisateur",
    "New User Details": "Détails du nouvel utilisateur",
    "New User Details": "Détails du nouvel utilisateur",
    "User details updated.": "Détails de l'utilisateur mis à jour.",
    "Failed to update user details.":
      "Échec de la mise à jour des détails de l'utilisateur.",
    "Email sent successfully.": "E-mail envoyé avec succès.",
    "Couldn't send an email.": "Impossible d'envoyer un e-mail.",
    "Please enter a valid email address.":
      "S'il vous plaît, mettez une adresse email valide.",
    "New user has been added.": "Un nouvel utilisateur a été ajouté.",
    "Failed to add new user.": "Échec de l'ajout d'un nouvel utilisateur.",
    "Please fill all the fields.": "Veuillez remplir tous les champs.",
    "Manage Packhouses": "Gérer les dépôts",
    "Registered Packhouses": "Station de conditionnement enregistrés",
    "Create New Packhouse": "Créer un nouveau packhouse",
    "Select a Packhouse to Edit":
      "Sélectionnez une station de conditionnement à modifier",
    "Packhouse Name": "Nom de station de conditionnement",
    Address: "Adresse",
    "Contact Number": "Numéro de contact",
    "Lump rate per kg of Fruit for Shipment by Air":
      "Taux forfaitaire par kg de fruits expédiés par avion",
    "Lump rate per kg of Fruit for Shipment by Sea":
      "Taux forfaitaire par kg de fruits expédiés par voie maritime",
    "Observer-MCI-Dashboard": "Tableau de bord Observer-MCI",
    "Manage Packhouses": "Gérer les dépôts",
    "Packhouse Details": "Détails de Station de conditionnement",
    "New Packhouse Details":
      "Détails de la nouvelle station de conditionnement",
    "Edit Packhouse Details	Modifier":
      "les détails de station de conditionnement",
    "New packhouse has been added.":
      "Une nouvelle station de conditionnement a été ajouté.",
    "Error adding new packhouse.":
      "Erreur lors de l'ajout d'une nouvelle station de conditionnement",
    "Invalid email address.": "Adresse e-mail invalide.",
    "Packhouse details updated.":
      "Détails de station de conditionnement mis à jour.",
    "Manage Collection Points": "Gérer les points de collecte",
    "Registered Collection Points": "Points de collecte enregistrés",
    "Create Collection Point": "Créer un point de collecte",
    "Select a Collection Point to Edit":
      "Sélectionnez un point de collecte à modifier",
    "Collection Point Name": "Nom du point de collecte",
    "Collection Point - Map-View": "Point de collecte - Vue de la carte",
    "Manage Collection Points": "Gérer les points de collecte",
    "Collection Point Details": "Détails du point de collecte",
    "Edit Collection Point Details":
      "Modifier les détails du point de collecte",
    "New Collection Point Details": "Détails du nouveau point de collecte",
    "New collection data inserted.": "Nouvelles données de collecte insérées.",
    "Error creating new collection point.":
      "Erreur lors de la création d'un nouveau point de collecte.",
    "Collection point details updated.":
      "Détails du point de collecte mis à jour.",
    "Failed to update collection point details.":
      "Échec de la mise à jour des détails du point de collecte.",
    "Please enter a valid latitude and longitude.":
      "Veuillez saisir une latitude et une longitude valides.",
    "Manage NGOs": "Gérer les ONG",
    NGOs: "ONG",
    "Create New NGO": "Créer une nouvelle ONG",
    "Select a NGO to Edit": "Sélectionnez une ONG à modifier",
    "NGO Name": "Nom de l'ONG",
    "Identification Number": "Numéro d'identification",
    "Account Owner": "Propriétaire du compte",
    "Contact Number": "Numéro de contact",
    "Account Details": "Détails du compte",
    "Select Bank *": "Sélectionnez la banque *",
    "Type of Account": "Type de compte",
    Savings: "économies",
    Current: "Actuel",
    "Account Number": "Numéro de compte",
    "Select currency": "Sélectionnez la devise",
    "% Distribution": "% Distribution",
    Address: "Adresse",
    "Manage NGOs": "Gérer les ONG",
    "NGO Details": "Détails de l'ONG",
    "New NGO Details": "Nouveaux détails sur l'ONG",
    "Edit NGO Details	Modifier": "les détails de l'ONG",
    "New NGO has been added.": "Une nouvelle ONG a été ajoutée.",
    "Error adding new NGO.": "Erreur lors de l'ajout d'une nouvelle ONG.",
    "Please fill out all the fields.": "Veuillez remplir tous les champs.",
    "NGO details updated.": "Détails des ONG mis à jour.",
    "Manage Bank Accounts": "Gérer les comptes bancaires",
    "Registered Bank Accounts": "Comptes bancaires enregistrés",
    "No data to display": "aucune donnée à afficher",
    "Create New Bank Account": "Créer un nouveau compte bancaire",
    "User Type": "Type d'utilisateur",
    "Account Owner": "Propriétaire du compte",
    "Contact No.": "N ° de contact",
    "Bank Name": "Nom de banque",
    "Type of Account": "Type de compte",
    "Manage Bank Accounts": "Gérer les comptes bancaires",
    "Bank Account Details": "Détails de compte en banque",
    "Bank Account Details": "Détails de compte en banque",
    "New bank account details has been added.":
      "De nouveaux détails de compte bancaire ont été ajoutés.",
    "Error adding new bank account details.":
      "Erreur lors de l'ajout de nouveaux détails de compte bancaire.",
    "Bank account details already exists. Select from the list to edit.":
      "Les coordonnées bancaires existent déjà. Sélectionnez dans la liste à modifier.",
    "Bank account details updated.": "Détails du compte bancaire mis à jour.",
    "Bank account details already exists. Select from the list to edit.":
      "Les coordonnées bancaires existent déjà. Sélectionnez dans la liste à modifier.",
    "Manage Harvest Planner Distribution":
      "Gérer la distribution Planificateur de récolte",
    "Harvest Planner Distributions": "Distributions Planificateur de récolte",
    "Percentage Distribution": "Distribution en pourcentage",
    "Create New Harvest Planner Distribution":
      "Créer une nouvelle distribution planificateur de récolte",
    "Manage Harvest Planner Distribution":
      "Gérer la distribution Planificateur de récolte",
    "Harvest Planner Distribution Details":
      "Détails de la distribution Planificateur de récolte",
    "New Harvest Planner distribution details has been added.":
      "De nouveaux détails de distribution Planificateur de récolte ont été ajoutés.",
    "Harvest Planner Distribution details updated.":
      "Mise à jour des détails de la distribution Planificateur de récolte.",
    "Failed to update Harvest Planner Distribution details.":
      "Échec de la mise à jour des détails de distribution Planificateur de récolte.",
    "Manage Products": "Gérer les produits",
    Products: "Produits",
    "Average weight of the fruits/box": "Poids moyen des fruits / boîte",
    "Create New Product": "Créer un nouveau produit",
    "Average weight of fruits/box": "Poids moyen de fruits / boîte",
    "Manage Harvest Planner Distribution":
      "Gérer la distribution Planificateur de récolte",
    "Product Details": "détails du produit",
    "New product details has been added.":
      "De nouveaux détails sur le produit ont été ajoutés.",
    "Error adding new product details.":
      "Erreur lors de l'ajout de nouveaux détails sur le produit.",
    "Product details updated.": "Détails du produit mis à jour.",
    "Manage Organizations": "Gérer les organisations",
    "Registered Organizations": "Organisations enregistrées",
    "Create New Organization": "Créer une nouvelle organisation",
    "Contact No.": "N ° de contact",
    "Account Details": "Détails du compte",
    "Organization Currency": "Devise de l'organisation",
    "Manage Organizations": "Gérer les organisations",
    "Organization Details": "Détails de l'organisation",
    "New organization details has been added.":
      "De nouveaux détails d'organisation ont été ajoutés.",
    "Organization details already exists. Select from the list to edit.":
      "Les détails de l'organisation existent déjà. Sélectionnez dans la liste à modifier.",
    "Failed to update organization details.":
      "Échec de la mise à jour des détails de l'organisation.",
    "Manage Fruits": "Gérer les fruits",
    Fruits: "Fruits",
    "Carton Filling And Palletizing": "Remplissage et palettisation de carton",
    "Manage Fruit  Flow": "Gérer les fruit",
    "Fruit Flow Stages": "Étapes du flux de fruits",
    "Details Updated Successfully": "Détails mis à jour avec succès",
    // ____________ super admin end _______________

    "View Previous Requests": "Voir les demandes précédentes",
    "Create Batches": "Créer des lots",
    "Add Collector": "Ajouter un collecteur",
    "View Batches": "Voir les lots",
    "Propose Producer": "Proposer un producteur",
    "Manage Collection Points": "Gérer les points de collecte",
    "Manage Harvest Planner": "Gérer le planificateur de récolte",
    "Active Service Request - Map-View":
      "Demande de service actif - Vue de la carte",
    "Calender-View": "Vue-Calendrier",
    "Previous Service Request - Map-View":
      "Demande de service précédente - Vue de la carte",
    "Calender-View": "Vue-Calendrier",
    "Proposed Producers": "Producteurs proposés",
    "Propose New Producer": "Proposer un nouveau producteur",
    "Select a Producer to Edit & Update or Propose a New Producer":
      "Sélectionnez un producteur pour modifier et mettre à jour ou proposer un nouveau producteur",
    NIF: "NIF",
    CIN: "CIN",
    "Longitude,Latitude": "Longitude latitude",
    "Click here to view profile pic":
      "Cliquez ici pour voir la photo de profil",
    "Propose Producer": "Proposer un producteur",
    "Email sent.": "Email envoyé.",
    "Edit Producer Details": "Modifier les détails du producteur",
    "New Producer Details": "Détails du nouveau producteur",
    "Please fill all the mandatory fields.":
      "Veuillez remplir tous les champs obligatoires.",
    "Producer proposed successfully": "Producteur proposé avec succès",
    "Dashboard - Observer": "Tableau de bord - Observateur",
    "View Service Request": "Afficher la demande de service",
    "Payment Reporting": "Rapports de paiement",
    "Unsuccessful Sale": "Vente infructueuse",
    "Observer-Dashboard": "Tableau de bord d'observateur	",
    "Dashboard - Observer-MCI": "Tableau de bord - Observateur-MCI",
    "Manage Packhouse": "Gérer Station de conditionnement",
    "Observer-MCI-Dashboard": "Tableau de bord-Observateur-MCI",
    "Harvest Planner": "Planificateur de récolte",
    "Harvest Planner Distributions":
      "Distributions du planificateur de récolte",
    "Harvest Planner Distributions Details":
      "Détails des distributions du planificateur de récolte",
    "SA-Dashboard/Harvest Planner-Dashboard":
      "SA-Dashboard/Harvest Planner-Dashboard",
    "Harvest Planner-Dashboard": "Harvest Planner-Dashboard",
    "Dashboard - Harvest Planner": "Tableau de bord - Planificateur de récolte",
    "View Producers": "Voir les producteurs",
    "Search Query": "Requête de recherche",
    "Harvest Planner - Dashboard": "Planificateur de récolte - Tableau de bord",
    "Service request heading": "En-tête de demande de service",
    "SA-Dashboard / LSP-Dashboard": "Tableau de bord SA / Tableau de bord LSP",
    "SA-Dashboard": "Tableau de bord SA",
    "LSP-Dashboard": "Tableau de bord LSP",
    "Work Flow": "Flux de travail",
    "Active Service Requests": "Demandes de service actives",
    "No Matching Records": "Aucun enregistrement correspondant",
    "Passed & Failed": "Réussi et échoué",
    Passed: "Réussi",
    Failed: "échoué",
    "Attach button": "Bouton Joindre",
    "Quality Inspection Results": "Résultats de l'inspection de la qualité",
    "Transfer to cold storage": "Transfert en chambre froide",
    "Transfer to Cold Storage *": "Transfert en chambre froide *",
    Temperature: "Température",
    "Removal from cold storage": "Retrait de la chambre froide",
    "Removal from Cold Storage": "Retrait de la chambre froide",
    "Removal from Cold Storage *": "Retrait de la chambre froide *",
    "Feed Packing Line conveyor Belt":
      "Bande transporteuse de ligne d'emballage d'alimentation",
    "Feed Packing Line conveyor Belt *":
      "Bande transporteuse de ligne d'emballage d'alimentation *",
    "Fruits per box": "Fruits par boîte",
    "Fruits Per Box": "Fruits par boîte",
    "Add more button": "Ajouter plus de bouton",
    "Add More": "Ajouter plus",
    "Fruit Temperature": "Température des fruits",
    "Upload Product Certifications":
      "Télécharger les certifications du produit (2 emplacements)",
    "Upload Product Certifications *":
      "Télécharger les certifications du produit (2 emplacements) *",
    "Filled Inspection form": "Formulaire d'inspection rempli",
    "No Attachments yet": "Pas encore d'attachements",
    "Attach Filled Inspection form button":
      "Bouton Joindre le formulaire d'inspection rempli",
    Destination: "Destination",
    "All statuses needs to be translated":
      "Tous les statuts doivent être traduits",
    Destination: "Destination",
    "No matching Records": "Aucun enregistrement correspondant",
    "Email Address": "Adresse électronique",
    Batches: "Lots",
    "Search Query": "Requête de recherche",
    "Producer Details": "Détails du producteur",
    "Attach button": "Bouton Joindre",
    Attach: "Joindre",
    "Enrolled Harvest Planners": "Planificateurs de récolte inscrits",
    "Harvest Planner Details": "Détails du planificateur de récolte",
    "Select a Harvest Planner to Edit & Update OR Create a New Harvest Planner":
      "Sélectionnez un planificateur de récolte à modifier et mettre à jour OU créez un nouveau planificateur de récolte",
    "Create new harvest planner button":
      "Créer un nouveau bouton de planificateur de récolte",
    "Create New Harvest Planner button":
      "Créer un nouveau bouton de planificateur de récolte",
    Temperature: "Température",
    "Advance Given to Producer": "avance accordée au producteur",
    "Advance Given to LSP": "avance donnée à lsp",
    "Payment Method": "Mode de paiement",
    "Status - Arrived at Packhouse":
      "Statut-Arrivé a la station de conditionnement",
    "Back To List button": "Bouton retour à la liste",
    "Back To List": "retour à la liste",
    "Column Headers needs to be translated":
      "Les en-têtes de colonne doivent être traduits",
    "No. Of boxes purchased": "Nbre de boîtes achetées",
    "No. of Boxes Sold": "Nbre de boîtes vendues",
    Filter: "Filtre",
    "Payment Reporting": "Rapports de paiement",
    "Payment Details": "Détails du paiement",
    "Login as Harvest Planner":
      "Connectez-vous en tant que planificateur de récolte",
    "Login as LSP": "Connectez-vous en tant que LSP",
    "Login as Collector": "Connectez-vous en tant que collectionneur",
    "Login as Broker": "Connectez-vous en tant que courtier",
    "Payment Reporting": "Rapports de paiement",
    "Unsuccessful Sale": "Vente infructueuse",
    "SA-Dashboard/OP-Admin-Dashboard":
      "SA-Tableau de bord / OP-Admin-Tableau de bord",
    "OP-Admin-Dashboard": "OP-Admin-Tableau de bord",
    "Admin-Dashboard": "Admin-Tableau de bord",
    "TPA-Dashboard": "TPA-Tableau de bord",
    "Dashboard-OP-Admin": "Tableau de bord-OP-Admin",
    "Dashboard-Super User Heading":
      "Tableau de bord - En-tête du super utilisateur",
    "Manage Packhouses": "Gérer les dépôts",
    "Manage Collection Points": "Gérer les points de collecte",
    "Login as Harvest Planner":
      "Connectez-vous en tant que planificateur de récolte",
    "Login as LSP": "Connectez-vous en tant que LSP",
    "Login as Collector": "Connectez-vous en tant que collectionneur",
    "Login as Broker": "Connectez-vous en tant que courtier",
    "Login as TPA": "Connectez-vous en tant que TPA",
    "Payment Reporting": "Rapports de paiement",
    "Unsuccessful Sale": "Vente infructueuse",
    "Hold Camera/Scanner Steady": "Maintenez l'appareil photo / scanner stable",
    "Login as Extension Services":
      "Connectez-vous en tant que services d'extension",
    Distribution: "Distribution",
    "Account Details": "Détails du compte",
    "Bank Account Currency": "Devise du compte bancaire",
    "The fields marked * are mandatory and the values need to be updated.":
      "Les champs marqués * sont obligatoires et les valeurs doivent être mises à jour.",
    "Feed Packing Line Conveyor Belt":
      "Bande transporteuse de ligne d'emballage d'alimentation",
    Fruits: "Des fruits",
    Save: "sauver",
    Cancel: "Annuler",
    "Search Query": "Requête de recherche",
    Filter: "Filtre",
    Records: "Registres",
    "Search Query": "Requête de recherche",
    Filter: "Filtre",
    "Matching Records": "Enregistrements correspondants",
    "First Name": "Prénom",
    "Last Name": "Nom de famille",
    Department: "département",
    Town: "Ville",
    "Phone Number": "Numéro de téléphone",
    Location: "Emplacement",
    "Proposed By": "Proposé par",
    Reject: "Rejeter",
    "Are you sure you want to proceed to reject this producer ?":
      "Voulez-vous vraiment refuser ce producteur?",
    Longitude: "Longitude",
    Latitude: "Latitude",
    "Select Bank": "Sélectionnez une banque",
    "Mobile Payment Operator": "Opérateur de paiement mobile",
    "Mobile Payment Number": "Numéro de paiement mobile",
    "Phone Number": "Numéro de téléphone",
    Temperature: "Température",
    "matching records": "enregistrements correspondants",
    "Search Query": "Requête de recherche",
    Records: "Registres",
    "Service Requests": "Demandes de service",
    "Active Service Request": "Demande de service actif",
    "Map View": "Vue de la carte",
    "matching records": "enregistrements correspondants",
    "Search Query": "Requête de recherche",
    Records: "Registres",
    "Previous Service Request": "Demande de service précédente",
    "Map View": "Vue de la carte",
    "matching records": "enregistrements correspondants",
    "Search Query": "Requête de recherche",
    Records: "Registres",
    Passed: "Passé",
    Failed: "Échoué",
    Attach: "Attacher",
    "Transfer to Cold Storage": "Transfert vers une chambre froide",
    Temparature: "Temparature",
    "Feed Packing Line Conveyor Belt":
      "Bande transporteuse de ligne d'emballage d'alimentation",
    "Carton Filling details saved successfully":
      "Les détails de remplissage du carton ont été enregistrés avec succès",
    "Carton Filling details t updated":
      "Détails du remplissage du carton mis à jour",
    "Please fill Carton Filling Details":
      "Veuillez remplir les détails de remplissage du carton",
    "Attachment yet": "Attachement encore",
    "Attach Filled Inspection Form":
      "Joindre le formulaire d'inspection rempli",
    "Login As Auditor": "Connexion en tant qu'auditeur",
    "Batch Proforma Completed": "Batch Proforma terminé",
    Cancelled: "Annulé",
    "Sold Out": "Épuisé",
    "Service Requests": "Demandes de service",
    "Packhouse Incharge-Dashboard": "Packhouse en charge- tableau de bord",
    "Work Flow": "Flux de travail",
    Available: "Disponible",
    "Date & Time of Loading	Date": "et heure de chargement",
    "Total . Of Boxes Loaded": "Total . De boîtes chargées",
    "Transportation Order": "Ordre de transport",
    "Confirm Payment": "Confirmer le paiement",
    ". Of Boxed Sold": ". De boîte vendu",
    "Net Receivables": "Créances nettes",
    "Amount Factored": "Montant factorisé",
    "Factoring Entity": "Entité d'affacturage",
    "Factoring Agent": "Agent d'affacturage",
    "Factoring Charges": "Frais d'affacturage",
    "Unsuccessful Batches": "Lots infructueux",
  },
  ht: {
"Payment Date":"Dat Peman",
"Name of Account Owner":"Non Pwopriyetè Kont lan",
"Tax Id/ National":"Identification	NIF",
"Locality":"Lokalite",
"Address":"Adrès",
"Zip Code":"Kòd postal",
"Service Rendered":"Sèvis rann",
"Payment Amount":"Montan Peman",
"Transactions":"Tranzaksyon yo",
"Auditor":"Oditè",
"Excel Download":"Excel telechaje",
"Logistic / Cold Chain Service Provider":"Lojistik / Founisè Sèvis Chèn Fwad",
"Financial Services":"Sèvis finansye",
"Extension Services":"Sèvis Ekstansyon",
"Technology Service Provider":"Founisè Sèvis Teknolojik",
"Root Authority":"Otorite Rasin",
"Auditor":"Oditè",
"You are trying to delete the SPOC user, please change the SPOC user for the organization and try again.":"Ou ap eseye efase itilizatè SPOC, tanpri chanje itilizatè SPOC pou òganizasyon an epi eseye ankò.",
"User deleted":"Itilizatè efase",
"Please select a role.":"Tanpri chwazi yon wòl.",
"Please enter a valid email address.":"Tanpri antre yon adrès imel valab.",
"New user has been added.":"Nouvo itilizatè te ajoute.",
"User details updated.":"Detay itilizatè mis ajou.",
"Failed to update user details.":"Echwe pou mete ajou detay itilizatè yo.",
"System can have only one Technology Service Provider":"Sistèm ka gen yon sèl Founisè Sèvis Teknoloji",
"System can have only one Root Authority Organization":"Sistèm ka gen yon sèl Oganizasyon Otorite Rasin",
"You don't have permission to edit the Technology Service Provider Data.":"Ou pa gen pèmisyon pou edite done founisè sèvis teknoloji a.",
"Please add broker margin.":"Tanpri ajoute maj koutye.",
"Please enter % Distribution.":"Tanpri antre % Distribisyon.",
"Please enter at least one distribution.":"Tanpri antre omwen yon distribisyon.",
"Please enter a valid organization email address.":"Tanpri antre adrès imel yon òganizasyon ki valab.",
"Please enter a valid SPOC email address.":"Tanpri antre yon adrès imèl SPOC valab.",
"SPOC email id already in use, try another email id.":"SPOC id imèl deja nan itilize, eseye yon lòt id imel.",
"Select Product":"Chwazi pwodwi",
"Root Authority-Dashboard":"Otorite Rasin-Dachbord",
"Technology Service Provider-Dashboard":"Founisè Sèvis Teknoloji-tablodbò",
"Login as Auditor":"Login kòm Oditè",

    "Dashboard - MCI": "Dachbord - MCI",
    "Manage Fruit Flow": "Jere flux fwi",
    "Organization Name / Email": "Non oganizasyon / Imèl",
    "Organization Name": "Non oganizasyon",
    "Registered Organizations": "Organizasyon ki anrejistre",
    "Organization Details": "Detay Organization an",
    "No data to display": "Pa gen done yo montre",
    "Create New Organization": "Kreye Nouvo Organization",
    "Organization Details": "Detay Organization an",
    "Organization Info": "Info Organization",
    "Organization Type": "Kalite Organization an",
    "Zip Code": "Kòd postal",
    "SPOC Details": "Detay SPOC",
    "Bank Name": "Non Bank",
    "Account Number": "Nimewo KONT",
    "Organization Currency": "Organization Lajan",
    "Select Organization": "Chwazi Organization",
    Organization: "Organization",
    "New NGO Details": "Nouvo Detay ONG yo",
    Distribution: "Distribisyon",
    Savings: "Ekonomi",
    Current: "Kouran",
    "Select Currency": "Chwazi Lajan",
    "Identification No.": "Nimewo idantifikasyon",
    "Account Details": "Detay Kont",
    "No data to display": "Pa gen done pou montre",
    "Bank Account Currency": "Lajan kont labank",
    "Contact No.": "No. Kontak",
    Fruits: "Fwi",
    "Fruit Flow Stages": "Etap sikilasyon Fwi",
    "Used for calculations": "Itilize pou kalkil",
    "Ambient Temperature": "Tanperati anbyen",
    Attachments: "Atachman",
    "Internal Fruit Temperature": "Tanperati Entèn Fwi",
    "Transfer To Cold Storage": "Transfere nan depo frèt",
    "Removal From Cold Storage": "Retire soti nan depo frèt",
    "Feed Packing Line Conveyor Belt": "Pran swen anbalaj Liy CONVEYOR",
    "Carton Filling And Palletizing": "Carton ranpli ak palèt",
    "Fruits Removed": "Fwi Retire",
    "Start QR Code Fruits": "Kòmanse Kòd QR Fwi",
    "End QR Code Fruits": "Fini Kòd QR Fwi",
    "Start QR Code Boxes": "Kòmanse bwat kòd QR yo",
    "End QR Code Boxes": "Fen Bwat Kòd QR yo",
    "Temperature Reading For Packed Lot": "Lekti Tanperati Pou lo",
    "Ambient Temperature": "Tanperati anbyen",
    "Internal Fruit Temperature": "Tanperati Fwi Entèn",
    "Airflow Temperature": "Tanperati Airflow",
    "Removal From Forced Air Cooling":
      "Retire soti nan refwadisman ak gwo vantilate",
    "Fruit Temperature on Exit": "Tanperati fwi sou sòti",
    "Cold Storage In": "Depo frèt nan antre",
    "Airflow Temperature": "Tanperati Airflow",
    "Cold Storage Out": "Depo frèt soti",
    Timestamp: "Timestamp",
    "Pre Cooling Reefers": "Pre Refwadisman kontene refrigere",
    "Destination Date And Time": "Dat ak Lè Destinasyon",
    "Departure Date and Time": "Dat ak lè Depa",
    "PH Level": "Nivo PH",
    "Water Temperature": "Tanperati Dlo",
    "Cleaning And Trimming": "Netwayaj ak taye",
    "Search Query": "Rechèch",
    Filter: "Filtre",
    Feedback: "fidbak",
    Avacado: "Zaboka",
    Mango: "Mango",
    Pineapple: "Anana",
    "Payment Breakdown": "Peman",
    "Search Query": "Rechèch",
    Filter: "Filtre",
    "First Name": "Premye Non",
    "Last Name": "Siyati",
    Department: "Depatman",
    Town: "Vil",
    "Phone Number": "Nimewo telefòn",
    Location: "Lokasyon",
    "Proposed By": "Pwopoze pa",
    Reject: "Rejte",
    "Manage LSP Users": "Jere LSP Itilizatè yo",
    "Login as Packhouse Incharge": "Login kòm Packhouse en charge",
    "Select Roles": "Chwazi Wòl",
    "Harvest Planner": "Planifikatè Harvest",
    Collector: "Pèseptè",
    "Packhouse Incharge": "Packhouse en charge",
    "Truck Registered": "Kamyon anrejistre",
    Town: "Vil",
    "Select a Producer to Edit & Update or Propose a New Producer":
      "Chwazi yon pwodiktè pou edite & mete ajou oswa pwopoze yon nouvo pwodiktè",
    "No Data": "Pa gen done",

    Logout: "Dekonekte",
    // _____________  Collector ___________
    "PickUp Requested On": "Lè Yo Mande Ramasaj la",
    Produce: "Pwodwi",
    "Collect at": "Kote yo kolekte",
    "Drop Off At": "Kote Yo Depoze",
    "Current Status": "Stati Aktyèl",
    "Additional Notes": "Lòt Nòt",
    "Please Select a Pickup from the list to update Status":
      "Chwazi yon Ramasaj nan list la pouw ka chanje stati a",
    "Status - Enroute Producer": "Stati - Al Nan Izin Kondisyònman",
    Dashboard: "Dachbòd",
    Cancel: "Anile",
    Save: "Anrejistre",
    Temperature: "Tanperati",
    "Ambient Temp": "Tanperati Espas la",
    "Crates (Full)": "Kès (Plen)",
    "Fruit Harvested": "Fwi Rekòlte",
    "Fruit Rejected": "Fwi Ki Rejte",
    "Start QR Code": "Kòmansman QR Kòd",
    "End QR Code": "Finisman QR Kòd",
    "Status - With Producer": "Stati - Ak Pwodiktè",
    Reject: "Jete",
    "Attach Start QR Code": "Mete Kòmansman QR Kòd",
    "Attach End QR Code": "MeteFinisman QR Kòd",
    "Drop-Off location": "Kote yo Depoze",
    "Status - Enroute Packhouse": "Stati - Al Nan Izin Kondisyònman",
    "Planned Pickups": "Ramasaj Planifye",
    "Transport Cost": "Pri Transpò",
    "Time of Admittence": "Lè yo Admèt Li",
    "Status - Arrived at Packhouse": "Stati - Lè Li Rive Nan Izin Kondisyònman",
    "Arrived At Packhouse": "Lè Li Rive Nan Izin Kondisyònman",

    // ________________________________
    // ____________ SAE ____________
    Producer: "Pwodiktè",
    Fruit: "Fwi",
    "New Service Request": "Nouvo Demann Sèvis",
    "GPS Location": "Pozisyon GPS",
    "Estimated Fruits": "Fwi Ki Estime",
    "New Service Request": "Nouvo Demann Sèvis",
    "Manage Users": "Jere Itilizatè yo",
    "Start Typing Producer": "Komanse tape pwodiktè a",
    Mango: "Mango",
    Pineapple: "Anana",
    Avocado: "Zaboka",
    Mots: "Mo",
    Pays: "Peyi",
    "Lieu le plus proche": "Kote ki pi prè a",
    Cancel: "Anile",
    "Submit Request": "Voye demann lan",
    "Mandatory Fields": "Espas obligatwa",

    "List of Producers (KOBO)": "Lis Pwodiktè yo (KOBO)",
    "List of Producers": "Lis Pwodiktè yo",
    Town: "Vil",
    "Producer Name / Depart / Town": "Non Pwodiktè / Depatman / Vil",
    "Manage Service Requests": "Jere demann sèvis yo",
    Select: "Chwazi",
    "Display Id": "id",
    "Department / Town": "Depatman / Vil",
    Department: "Depatman",
    "Estimated Fruits #": "Fwi Ki Estime #",
    Product: "Pwodwi",
    "Created By": "Moun ki kreyel",
    Location: "Kibò",
    Edit: "Modifye",
    Status: "Stati",
    "View More": "Wè plis",
    "Order Requested On": "Lè komann lan te fèt",
    //______________________________

    // _________  LSP  ____________________
    "Service Request Id": "Id Demann Sèvis la",
    Plan: "Planifye",
    Collector: "Kolektè",
    "Collection point": "Kote koleksyon an fèt",
    "No matching records": "Pa gen rezilta ki koresponn",
    "Collection Requested On": "Lè yo Mande koleksyon an",
    "Date of Pickup": "Dat koleksyon an",
    "Drop Off At Packhouse": "Mete nan Izin Kondisyònman",
    "Collection Point": "Kote koleksyon an fèt",
    Save: "Anrejistre",
    "Pickup Requested On": "Lè Yo Mande Ramasaj la",
    "Order Requested On": "Lè komann lan te fèt",
    "Collect at": "Kote yo kolekte",
    Produce: "Pwodwi",
    "Drop Off At": "Kote Yo Depoze",
    "Current Status": "Stati Atyèl",
    "Fruit Flow": "Etap Fwi",
    "Lots at Packhouse": "Lo Nan Izin Kondisyònman",
    "Flow Milestones": "Etap Enpòtan",
    Warning: "Atansyon",
    "Are you sure you want to proceed to the next stage without saving?":
      "Eske ou vle kontinye nan lòt etap la san ou pa anrejistre?",
    "Transport Details": "Detay Transpò",
    "Transport Details *": "Detay Transpò *",
    "Container Inspection": "Enspeksyon Konntenè",
    "Container Inspection *": "Enspeksyon Konntenè *",
    "Larvae Testing": "Tès Lav",
    "Larvae Testing *": "Tès Lav *",
    "Temperature Measurement": "Pran Tanperati",
    "Temperature Measurement *": "Pran Tanperati *",
    "Ambient Temp": "Tanperati Espas la",
    "Internal Fruit Temp": "Tanperati Entèn Fwi a",
    Attachment: "Fichye Atache",
    "Quality Inspection": "Enpeksyon Kalite",
    "Quality Inspection *": "Enpeksyon Kalite *",
    "Quality Instpection Results": "Rezilta Enpeksyon Kalite",
    "Fruits Accepted": "Fwi Ki Aksepte",
    "Fruits Rejected": "Fwi Ki Rejte",
    "Fruit Washing": "Lavaj Fwi",
    "Fruit Washing *": "Lavaj Fwi *",
    "Water Temp": "Tanperati Dlo",
    "Ph Level": "Nivo Oh",
    "Chlorine Level": "Nivo Klò",
    Sizing: "Dimansyònman",
    "Sizing Results": "Rezilta Dimansyònman",
    Sizing: "Dimansyònman",
    "Sizing *": "Dimansyònman *",
    "Hot Water Treatment Entry": "Trètman Dlo Cho - Antre",
    "Hot Water Treatment Entry *": "Trètman Dlo Cho - Antre *",
    "Time of Entry": "Lè Li Antre",
    "Hot Water Treatment Exit": "Trètman Dlo Cho - Sòti",
    "Hot Water Treatment Exit *": "Trètman Dlo Cho - Sòti *",
    "Duration of Treatment": "Tan Trètman An Pran",
    "Time of Exit": "Lè Li Sòti",
    "Hydro Cooling Entry": "Refwadisman - Antre",
    "Hydro Cooling Entry *": "Refwadisman - Antre *",
    "Hydro Cooling Exit": "Refwadisman - Antre",
    "Hydro Cooling Exit *": "Refwadisman - Antre *",
    "Feed Packing Line Conveyor Belt": "Feed Packing Line Conveyor Belt",
    "Feed Packing Line Conveyor Belt *": "Feed Packing Line Conveyor Belt *",
    "Packing Line - Time of Entry": "Liy Anbalaj - Lè Li Antre",
    Grading: "Klasman",
    "Grading Results": "Rezilta Klasman",
    Grading: "Klasman",
    "Grading *": "Klasman *",
    "Number of removed fruit": "Kantite Fwi ki retire",
    "Second Sizing Results": "Dezyèm Rezilta Dimansyònman",
    "Carton Filling + Palletizing": "Ranplisaj Katon + Paletizasyon",
    "Carton Filling + Palletizing *": "Ranplisaj Katon + Paletizasyon *",
    "Carton Filling": "Ranplisaj Katon",
    "Carton Filling *": "Ranplisaj Katon *",
    "Start QR Code # - Fruits": "Kòmansman # QR Kòd - Fwi",
    "End QR Code # - Fruits": "Finisman # QR Kòd - Fwi",
    "Start QR Code # - Boxes": "Kòmansman QR Kòd # - Fwi",
    "End QR Code # - Boxes": "Kòmansman QR Kòd # - Fwi",
    "Temperature Readings for Packed Lot": "Lekti Tanperati pou Lo Ki Anbale",
    "Temperature Readings for Packed Lot *":
      "Lekti Tanperati pou Lo Ki Anbale *",
    "Forced Air Cooling Entry": "Refwadisman Nan Van Fre - Antre",
    "Entry Time": "Lè Li Antre",
    "Forced Air Cooling Entry *": "Refwadisman Nan Van Fre - Antre",
    "Entry Time": "Lè Li Antre *",
    "Fruit Temperature at Entry": "Tanperati Fwi Lè Li Antre A",
    "Airflow Temperature RH": "Tanperati Van Fre A",
    "Removal from Forced Air Cooling": "Retire Nan Refwadisman Nan Van Fre a",
    "Removal from Forced Air Cooling *":
      "Retire Nan Refwadisman Nan Van Fre a *",
    "Removal Time": "Lè yo Retirel",
    "Fruit Temperature at Removal": "Tanperati Fwi Lè yo Retirel",
    "Cold Room Storage In": "Stokaj Nan Chanm Fwad - Antre",
    "Cold Room Storage In *": "Stokaj Nan Chanm Fwad - Antre *",
    "Fruit Temp": "Tanperati Fwi",
    "Storage Time In": "Lè li Antre Nan Stokaj",
    "Cold Room Storage Out": "Stokaj Nan Chanm Fwad - Soti",
    "Cold Room Storage Out *": "Stokaj Nan Chanm Fwad - Soti *",
    "Storage Time Out": "Lè li Soti Nan Stokaj",
    "Upload Product Certification": "Telechaje Sètifikasyon Pwodwi",
    Sampling: "Echantiyon",
    "Samples Taken": "Echantiyon Chwazi",
    Temperature: "Tanperati",
    "Date & Time of Sampling": "Dat ak Lè Echantiyon",
    "Shipping Details": "Detay Livrezon",
    "Shipping Details *": "Detay Livrezon *",
    "Shipment by Air": "Livrezon Anlè",
    "Shipment by Sea": "Livrezon Sou Lanmè",
    "Transport Details": "Detay Transpò",
    "Transport Details *": "Detay Transpò *",
    "Departure Date/Time": "Depa Dat/Lè",
    Destination: "Destinasyon",
    "No Attachment Yet": "Poko Gen Fichye",
    "Fruits Rejected at Collection Point": "Fwi Ki Rejte Kote Yap Kolekte A",
    Proceed: "Kontinye",
    "Start QR Code# - Pallets": "Kòmansman QR Kòd# - Palèt",
    "End QR Code# - Pallets": "Finisman QR Kòd# - Palèt",
    Lots: "Lo",
    "No of Boxes": "Kantite Bwat",
    "Fruit Flow Completed On": "Lè tout Etap Fwi a Fini",
    Shipping: "Livrezon",
    "Create Batch": "Kreye Batch",
    Desitination: "Destinasyon",
    "First Name": "Non",
    "Last Name": "Siyati",
    "Name / Email": "Non / Imel",
    "Email address": "Adrès Imel",
    "Contact Number": "Nimewo Kontak",
    "Enrolled Collectors": "Kolektè ki Enskri",
    "Collector Details": "Enfòmasyon sou Kolektè a",
    "Create New Collector": "Kreye Nouvo Kolektè",
    "Select a Collector to Edit & Update OR Create a New Collector":
      "Chwazi yon Kolektè pou Modifye OSWA Kreye yon Nouvo Kolektè",
    "Batch Id": "Id Batch",
    "Batch Created On": "Lè Batch la kreye",
    "No. of Lots": "Kantite Lo",
    "Plan/Generate Invoice": "Fè Fakti",
    "Proforma No.": "Nimewo Pwofòma",
    "Seller Name": "Non Machann lan",
    Packhouse: "Izin Kondisyònman",
    Currency: "Lajan",
    "Unit Price Per Kg": "Pri yon Kg",
    "Selling to": "Vann Bay",
    "Broker Name": "Non Koutye a",
    Email: "Imel",
    "Address Line 1": "Liy Adrès 1",
    "Address Line 2": "Liy Adrès 2",
    "Address Line 3": "Liy Adrès 3",
    "Total No Of Boxes": "Kantite Bwat Antou",
    "Proforma Invoice": "Fakti Pwofòma",
    "Select Currency": "Chwazi Lajan",

    //__________ LSP END __________________

    //__________ Broker __________________
    "No Attachments yet": "Poko Gen Fichye",
    "Active Batches": "Batch ki Aktif yo",
    "No Of Lots": "Kantite Lo",
    View: "Wè",
    Maintain: "Jere",
    Sell: "Vann",
    Invoice: "Fakti",
    Payment: "Pèman",
    "View Batch Details": "Wè Detay Batch",
    "Batch Details": "Detay Batch",
    "Batch No": "Nimewo Batch",
    "Product Type": "Tip Pwodwi",
    "Departure Timestamp": "Lè Depa",
    "Departure Temperature": "Tanperati Nan Depa A",
    "Lot No": "Nimewo Lo",
    "No of Boxes": "Kantite Bwat",
    "Total Number Of Boxes": "Kantite Bwat Antou",
    "Proforma No": "Nimewo Pwofòma",
    Proforma: "Pwofòma",
    "Full Name": "Non Konplè",
    "Unit Price": "Pri Youn",
    "Arrival & Destination": "Destinasyon",
    "Arrival Timestamp": "Lè Li Rive",
    "Additional Comments": "Lòt Kòmantè",
    "Upload Image": "Mete Imaj",
    "Cold Storage": "Stokaj Kote Ki Frèt",
    "Ethylene Level": "Nivo Etilèn",
    "CO2 Level": "Nivo CO2",
    "Cold Storage In Timestamp": "Lè Stokaj Frèt La",
    "Cost of Ripening": "Pri Matirasyon",
    "Sale Id": "Id Lavant",
    Sale: "Lavant",
    "Buyer's Name": "Nom Achtè",
    "Buyer Name": "Nom Achtè",
    "Total No Of Boxes Sold": "Kantite Bwat Ki Vann Antou",
    "Ship, Order & Unloading": "Livrezon, Kòmann ak Dechajman",
    "Create New Sale": "Kreye Nouvo Lavant",
    "Buyer's Contact Details": "Detay Kontak Achtè",
    "Buyer's Email": "Imel Achtè",
    "Date of Sale": "Dat Yo Vann lan",
    "No of Boxes": "Kantite Bwat",
    "P O": "P O",
    "Generate Invoice": "Fè Fakti",
    "Please select a lot to proceed with Box selections":
      "Chwazi yon lo pouw ka pran Bwat",
    Next: "Aprè",
    "Enter Buyer Details": "Mete Detay sou Achtè",
    "Buyer Details": "Detay sou Achtè",
    "Sale Transaction Details": "Detay Tranzaksyon Lavant",
    "Select Boxes": "Chwazi Bwat",
    Back: "Retounen",
    "View Invoice": "Wè Fakti",
    "Download Invoice": "Telechaje Fakti",
    Details: "Detay",
    Name: "Nom",
    Organization: "Òganizasyon",
    "Broker Organization": "Òganizasyon Koutye",
    Address: "Adrès",
    "Contact Details": "Detay Kontak",
    Date: "Dat",
    "Price Per Kg": "Pri Yon Kg",
    "Invoice No": "Nimewo Fakti",
    "Billing Date": "Dat Faktirasyon",
    "Nr of Boxes Purchased": "Kantite Bwat Ki Achte",
    "Apporximate Weight of Product Sold": "Pwa Prodwi ki Vann yo",
    "Net Sales": "Lavant Yo",
    "Net Receivable": "Sa ki Dwe",
    "Was the Invoice Factored": "Fakti te Bay",
    "View Purchase Order": "Wè Kòmann Lan",
    "Product Type": "Tip Pwodwi",
    Documents: "Dokiman",
    "Payment Confirmed On": "Lè Pèman An Konfime",

    //__________ Broker END __________________

    //__________ Observer __________________
    "Order Requested": "Kòmann ki Fèt",
    "Sold On": "Lè Li Vann",
    "Total Weight Of Fruits Sold (In Kgs)": "Pwa Total Fwi Ki Vann Yo (Kg)",
    "Net Sale in USD": "Lavant An Dola US",
    Distribution: "Distribisyon",
    "% Distribution": "% Distribisyon",
    "Sold On": "Lè Li Vann",
    "Weight of Fruits Sold (in Kg)": "Pwa Fwi Ki Vann Yo (Kg)",
    "Payment to LSP": "Pèman LSP",
    "Payment to Harvest Planner": "Pèman Planificateur de récolte",
    "Payment to Broker": "Pèman Koutye",
    "Bank Transaction Fee": "Frè Tranzaksyon Bank",
    "Broker Margin": "Maj Koutye A",
    "Broker Transport": "Transpò Koutye",
    "Producer Name": "Non Pwodiktè",
    "Payment To Producer": "Pèman Pwodiktè",
    NGO: "ONG",
    "Payment To NGO": "Pèman ONG",
    Penalties: "Penalite",
    Type: "Tip",
    "Calculated On": "Lè Li Kalkile",
    Amount: "Konbyen",
    "Levied On": "Lè Yo Pranl",
    "View Distribution": "Wè Distribisyon",
    "All payments are in USD": "Repatisyon Pèman",
    "View Lots": "Wè Lo",
    "Download as PDF": "Telechaje sou Foma PDF",
    "Attachment 1": "Fichye Atache 1",
    "Attachment 2": "Fichye Atache 2",
    "Attachment 3": "Fichye Atache 3",

    //__________ Observer END __________________

    //____________ super admin ___________________
    "Super Admin Dashboard": "Super Admin tablodbò",
    "Dashboard - ADMIN": "Tablodbò - ADMIN",
    "Manage Packhouses": "Jere estasyon procesna",
    "Manage Collection Points": "Jere pwen koleksyon yo",
    "Manage NGOs": "Jere ONG yo",
    "Manage Bank Accounts": "Jere kont labank",
    "Manage Harvest Planner Distribution":
      "Jere distribisyon Planifikatè rekòt",
    "Manage Products": "Jere pwodwi yo",
    "Login as Harvest Planner": "Ouvri Sesyon an kòm Planifikatè rekòt",
    "Login as LSP": "Ouvri Sesyon an kòm LSP",
    "Login as Collector": "Ouvri Sesyon an kòm yon pèseptè",
    "Login as Broker": "Ouvri Sesyon an kòm yon koutye",
    "Login as TPA": "Ouvri Sesyon an kòm TPA",
    "Login as OP-Admin": "Ouvri Sesyon an kòm OP-Admin",
    "Login as Observer": "Ouvri Sesyon an kòm yon obsèvatè",
    "Login as Admin": "Ouvri Sesyon an kòm administratè",
    "Login as Observer-MCI": "Ouvri Sesyon an kòm obsèvatè-MCI",
    "Login as Harvest Planner": "Ouvri Sesyon an kòm Planifikatè rekòt",
    "Payment Reporting": "Peman rapò",
    "Unsuccessful Sale": "Vann san siksè",
    "Manage Organizations": "Jere òganizasyon yo",
    "Manage Fruits": "Jere fwi yo",
    "Approve/Reject Proposed Producer": "Apwouve / rejte pwodiktè yo pwopoze a",
    "Manage Users": "Jere Itilizatè yo",
    "Enrolled Users": "Itilizatè ki anrejistre",
    "Create New User": "Kreye yon nouvo itilizatè",
    "Select a User to Edit": "Chwazi yon itilizatè pou edite",
    "Role Description (Eg. Input Pickup Request)":
      "Wòl deskripsyon (pou egzanp, antre demann de koleksyon)",
    Function: "Fonksyon",
    "Broker Margin In %": "Koutye Marge nan%",
    Organization: "Organizationganizasyon",
    "Grant All Privileges": "Bay tout privilèj",
    "SA-Dashboard": "SA-tablodbò",
    "Manage Users": "Jere Itilizatè yo",
    "Edit User Details": "Edite detay itilizatè yo",
    "User Details": "Itilizatè detay",
    "Edit User Details": "Edite detay itilizatè yo",
    "New User Details": "Nouvo detay itilizatè",
    "New User Details": "Nouvo detay itilizatè",
    "User details updated.": "Mizajou detay itilizatè.",
    "Failed to update user details.": "Echwe pou mete ajou detay itilizatè yo.",
    "Email sent successfully.": "Imèl voye avèk siksè.",
    "Couldn't send an email.": "Kapab voye e-mail.",
    "Please enter a valid email address.": "Tanpri antre yon adrès imel valab.",
    "New user has been added.": "Yon nouvo itilizatè te ajoute.",
    "Failed to add new user.": "Echwe pou ajoute nouvo itilizatè.",
    "Please fill all the fields.": "Tanpri ranpli tout antre done.",
    "Manage Packhouses": "Jere depo",
    "Registered Packhouses": "Anrejistre estasyon procesna",
    "Create New Packhouse": "Kreye yon nouvo pake",
    "Select a Packhouse to Edit": "Chwazi yon estasyon procesna modifye",
    "Packhouse Name": "Non estasyon procesna",
    Address: "Adrès",
    "Contact Number": "Nimewo kontak",
    "Lump rate per kg of Fruit for Shipment by Air":
      "Flat pousantaj pou chak kg nan fwi anbake pa lè",
    "Lump rate per kg of Fruit for Shipment by Sea":
      "Flat pousantaj pou chak kg nan fwi anbake pa lanmè",
    "Observer-MCI-Dashboard": "Obsèvatè-MCI tablodbò",
    "Manage Packhouses": "Jere depo",
    "Packhouse Details": "Anbalaj estasyon detay",
    "New Packhouse Details": "Detay sou nouvo estasyon procesna",
    "Edit Packhouse Details": "Edit detay estasyon procesna",
    "New packhouse has been added.": "Yon nouvo estasyon procesna te ajoute.",
    "Error adding new packhouse.": "Erè lè ajoute yon nouvo estasyon procesna",
    "Invalid email address.": "Adrès imèl ki pa valab.",
    "Packhouse details updated.": "Mizajou detay estasyon procesna.",
    "Manage Collection Points": "Jere pwen koleksyon yo",
    "Registered Collection Points": "Pwen koleksyon anrejistre",
    "Create Collection Point": "Kreye yon pwen koleksyon",
    "Select a Collection Point to Edit":
      "Chwazi yon pwen koleksyon pou modifye",
    "Collection Point Name": "Non pwen koleksyon an",
    "Collection Point - Map-View": "Pwen koleksyon - wè kat jeyografik",
    "Manage Collection Points": "Jere pwen koleksyon yo",
    "Collection Point Details": "Koleksyon pwen detay",
    "Edit Collection Point Details": "Edite detay pwen koleksyon yo",
    "New Collection Point Details": "Detay sou nouvo pwen koleksyon an",
    "New collection data inserted.": "Done koleksyon nouvo eleman.",
    "Error creating new collection point.":
      "Erè nan kreye yon nouvo pwen koleksyon.",
    "Collection point details updated.": "Mizajou detay pwen koleksyon.",
    "Failed to update collection point details.":
      "Echwe pou mete ajou detay pwen koleksyon yo.",
    "Please enter a valid latitude and longitude.":
      "Tanpri antre yon latitid ak lonjitid valab.",
    "Manage NGOs": "Jere ONG yo",
    NGOs: "ONG",
    "Create New NGO": "Kreye yon nouvo ONG",
    "Select a NGO to Edit": "Chwazi yon ONG pou edite",
    "NGO Name": "Non ONG la",
    "Identification Number": "Nimewo ID",
    "Account Owner": "Pwopriyetè kont",
    "Contact Number": "Nimewo kontak",
    "Account Details": "Detay kont lan",
    "Select Bank *": "Chwazi bank lan *",
    "Type of Account": "Kalite kont",

    // ____________ super admin end _______________

    "Active Service Requests": "Demann sèvis aktif",
    "Schedule Pickup": "Orè vin chèche",
    "Plan and Schedule Pickup": "Planifye ak orè vin chèche",
    "Please select Collector.": "Tanpri chwazi Pèseptè.",
    "Please select Date.": "Tanpri chwazi dat la.",
    "Please select Collection Point.": "Tanpri chwazi yon pwen koleksyon.",
    "Please select Drop Off At Packhouse.":
      "Tanpri chwazi depoze nan estasyon anbalaj.",
    "7 days penalty levied.": "7 jou penalite enpoze.",
    "10 days penalty levied.": "10 jou penalite enpoze.",
    "Request and lot got rejected, because pick up scheduling after 10 days.":
      "Demann lan ak pakèt la te rejte paske orè davwa a te apre 10 jou.",
    "Pickup scheduled successfully.": "Ramase avèk siksè planifye.",
    "Previous Service Requests": "Demann sèvis anvan yo",
    "Collection Point Name": "Non pwen koleksyon an",
    "Collector Name": "Non pèseptè",
    "Pre-Cooling Reefers": "pre-refwadisman kontenè refrijere",
    "Pre-Cooling Reefers *": "pre-refwadisman kontenè refrijere *",
    "Cold Tunnel Loading": "chajeman tinèl frèt",
    "Cold Tunnel Loading *": "chajeman tinèl frèt *",
    "Date & Time": "Dat ak lè",
    "Cold Storage Time In": "Tan depo nan chanm frèt",
    "Cold Storage Time out": "Tan depo frèt",
    "Attach QR Code": "Tache kòd QR la",
    "View attached": "Gade atachman",
    "Reefer Wall Temperature": "Tanperati mi nan kontenè refrijere",
    "Destination Date/Time": "Dat/lè destinasyon",
    "Transport Conditions": "Kondisyon transpò",
    "Are you sure you want to proceed to update the Larvae Testing as failed":
      "Èske ou sèten ou vle mete ajou tès lav kòm echwe",
    "Attached QR Codes": "Kòd QR tache",
    Warning: "Avètisman",
    "Temperature entered is outside the defined critical limits. Are you sure you want to proceed":
      "Tanperati ki antre a andeyò limit kritik defini yo. Èske ou sèten ou vle kontinye",
    "Hold Camera/Scanner Steady": "Kenbe kamera / scanner a an plas",
    Done: "Fini",
    "Temperature Measurement details saved successfully.":
      "Detay yo de mezi tanperati a te sove avèk siksè.",
    "Upload Product Certifications saved successfully.":
      "Enpòte avèk siksè sètifikasyon pwodwi anrejistre.",
    "Container Inspection details saved successfully.":
      "Detay enspeksyon veso yo te enskri avèk siksè.",
    "Transport Details saved successfully.": "Detay transpò sove avèk siksè.",
    "Select Larvae Testing Results": "Chwazi rezilta tès lav la",
    "Larvae Testing details saved successfully":
      "Detay yo nan tès la lav yo te avèk siksè anrejistre.",
    "Ambient Temperature is needed.": "Tanperati chanm obligatwa.",
    "Internal Fruit Temperature is needed.": "Tanperati entèn fwi a nesesè.",
    "Please add attachments.": "Tanpri ajoute atachman.",
    "Temperature Measurement details saved successfully.":
      "Detay yo de mezi tanperati a te sove avèk siksè.",
    "Enter Fruits Accepted.": "Mete fwi aksepte",
    "Enter Fruits Rejected.": "Mete fwi rejte yo.",
    "Enter Quality Inspection Results.":
      "Mete rezilta yo nan kontwòl kalite a.",
    "Quality Inspection details saved successfully.":
      "Detay enspeksyon kalite yo te enskri avèk siksè.",
    "Please check the fruit count.": "Tanpri tcheke kantite fwi yo.",
    "Please fill duration of treatment.": "Tanpri endike dire tretman an.",
    "Please fill time of exit.": "Tanpri endike lè depa a.",
    "Hot Water Treatment Exit details saved successfully.":
      "Detay yo nan pwodiksyon an tretman dlo cho yo te sove avèk siksè.",
    "Please fill PH Level.": "Tanpri ranpli nivo PH la.",
    "Please fill chlorine level.": "Tanpri ranpli nivo klò a.",
    "Please fill time of entry.": "Tanpri endike lè antre a.",
    "Please fill water temperature": "Tanpri ranpli tanperati dlo a",
    "Hot Water Treatment Entry details saved successfully.":
      "Detay yo sou opinyon tretman dlo cho yo te sove avèk siksè.",
    "Hydro Cooling Entry details saved successfully.":
      "Detay yo sou antre nan glas dlo refwadisman yo te avèk siksè anrejistre.",
    "Please fill in internal fruit temperature.":
      "Tanpri endike tanperati entèn fwi a.",
    "Please fill in duration": "Tanpri endike dire a",
    "Hydro Cooling Exit details saved successfully.":
      "Detay yo nan pwodiksyon an glas dlo refwadisman yo te avèk siksè anrejistre.",
    "Please select files to upload.": "Tanpri chwazi dosye yo telechaje.",
    "Nothing to upload.": "Pa gen anyen pou telechaje.",
    "Please fill in all the details.": "Tanpri ranpli tout detay yo.",
    "Cleaning & Trimming details saved successfully.":
      "Netwayaj ak koupe detay yo te sove avèk siksè.",
    "Cleaning & Trimming": "Netwayaj & Taye",
    "Cleaning & Trimming *": "Netwayaj & Taye *",
    "Sizing details saved successfully.":
      "Detay yo gwosè yo te sove avèk siksè.",
    "Fruit Washing details saved successfully.":
      "Detay sou lave fwi yo te avèk siksè anrejistre.",
    "Please fill storage time in": "Tanpri endike peryòd depo a",
    "Please fill in temperature": "Tanpri endike tanperati",
    "Transfer to Cold Storage details saved successfully.":
      "Detay yo nan transfè a nan chanm nan frèt yo te sove avèk siksè.",
    "Please fill in storage time out.": "Tanpri endike tan depo a.",
    "Removal from Cold Storage details saved successfully.":
      "Detay yo nan retire chanm frèt yo te sove avèk siksè.",
    "Feed Packing Line Conveyor Belt details saved successfully.":
      "Manje anbalaj liy senti CONVEYOR detay sove avèk siksè.",
    "Please fill in weight of the fruits removed":
      "Tanpri endike pwa fwi yo retire a",
    "Please fill in grading results": "Tanpri ranpli rezilta nòt yo",
    "Grading details saved successfully.": "Detay Rating yo te sove.",
    "Sizing details saved successfully.":
      "Detay yo gwosè yo te sove avèk siksè.",
    "Please fill in fruits start QR Code":
      "Tanpri ranpli kòd fwi kòmanse QR la",
    "Please fill in fruits end QR Code": "Tanpri ranpli nan fen QR kòd fwi",
    "Please fill in box start QR Code":
      "Tanpri ranpli nan bwat kòmansman kòd QR la",
    "Please fill in box end QR Code": "Tanpri ranpli bwat fen kòd QR la",
    "Carton Filling + Palletizing details saved successfully.":
      "Bwat katon ranpli + detay palletizing avèk siksè anrejistre.",
    "Carton Filling + Palletizing details not updated.":
      "Bwat katon ranpli + detay palletizing pa mete ajou.",
    "Carton Filling + Palletizing details not updated.":
      "Bwat katon ranpli + detay palletizing pa mete ajou.",
    "Box start and end QR Code length must be same.":
      "Longè kòmansman ak fen kòd QR bwat la dwe menm.",
    "Fruit start and end QR Code length must be same.":
      "Longè kòmansman ak fen kòd QR fwi a dwe menm.",
    "Please fill in ambient temperature": "Tanpri endike tanperati a anbyen",
    "Please fill in internal fruit temperature":
      "Tanpri endike tanperati entèn fwi a",
    "Temperature Readings for Packed Lot details saved successfully.":
      "Lekti tanperati pou anpil detay pake yo te anrejistre avèk siksè.",
    "Error updating data to firebase.": "Erè mete ajou done nan Firebase.",
    "Please fill in airflow temperature":
      "Tanpri endike tanperati vantilasyon an",
    "Please fill in fruit temperature at entry":
      "Tanpri endike tanperati fwi a nan papòt la",
    "Please fill in time of entry": "Tanpri endike lè antre a",
    "Forced Air Cooling Entry details saved successfully.":
      "Detay yo nan fòse lè refwadisman inlet la te sove avèk siksè.",
    "Please fill in fruit temperature": "Tanpri endike tanperati fwi a",
    "Please fill in time of removal": "Tanpri endike tan sipresyon an",
    "Removal from Forced Air Cooling details saved successfully.":
      "Efase detay yo nan refwadisman lè fòse sove avèk siksè.",
    "Please fill in storage time": "Tanpri endike tan depo",
    "Cold Room Storage In details saved successfully.":
      "Depo chanm frèt an detay sove avèk siksè.",
    "Please fill in storage time out.": "Tanpri endike tan depo a.",
    "Cold Room Storage Out details saved successfully.":
      "Detay yo nan depo a deyò chanm nan frèt yo te avèk siksè anrejistre.",
    "Please attach files": "Tanpri tache dosye",
    "Please enter samples taken": "Tanpri antre echantiyon yo pran",
    "Please enter sampling temperature": "Tanpri antre tanperati echantiyon an",
    "Please enter date and time of sampling":
      "Tanpri antre dat ak lè echantiyon an",
    "Sampling details saved successfully.":
      "Detay echantiyon yo te sove avèk siksè.",
    Sampling: "pran echantiyon",
    "Sampling *": "pran echantiyon *",
    "Please enter reefer wall temperature":
      "Tanpri antre tanperati miray frijidè a",
    "Pre-Cooling Reefers details saved successfully.":
      "Detay yo nan Reefers pre-refwadisman yo te avèk siksè anrejistre.",
    "Please enter destination date and time":
      "Tanpri antre dat ak lè destinasyon an",
    "Please enter refer wall temperature":
      "Tanpri antre tanperati referans miray la",
    "Cold Tunnel Loading details saved successfully.":
      "Detay yo nan loading tinèl la frèt yo te avèk siksè anrejistre.",
    "Please enter shipping details": "Tanpri antre detay livrezon",
    "Shipping Details saved successfully.": "Detay livrezon sove avèk siksè.",
    "Please select currency": "Tanpri chwazi lajan",
    "Please enter departure date and time": "Tanpri antre dat ak lè depa",
    "Please enter destination": "Tanpri antre destinasyon",
    "Please enter transport temperature": "Tanpri antre tanperati transpò a",
    "Please enter transport conditions":
      "Tanpri antre nan kondisyon transpò yo",
    "Please enter transport cost": "Tanpri antre nan depans anbake",
    "Transport Details saved successfully.": "Detay transpò sove avèk siksè.",
    "Please complete previous stages to update Transport Details.":
      "Tanpri ranpli etap sa yo anvan yo mete ajou detay transpò yo.",
    "Please fill Shipping Details.": "Tanpri ranpli detay anbakè yo.",
    "Please fill Carton Filling + Palletizing Details.":
      "Tanpri ranpli detay yo nan ranpli katon + palèt.",
    "Temperature Measurement details saved successfully.":
      "Detay yo de mezi tanperati a te sove avèk siksè.",
    "Error fetchinbg data.": "Erè rekipere done yo.",
    "Error updating data to firebase.": "Erè mete ajou done nan Firebase.",
    "Please select one or more lots to create batch.":
      "Tanpri chwazi youn oswa plis anpil pou kreye anpil.",
    "`Product and Shipping mode has to be same for creating batch.`":
      "Pwodwi ak metòd anbake yo dwe menm bagay la tou yo kreye yon pakèt.",
    "Batch created successfully.": "Te pakèt la te kreye avèk siksè.",
    "Something went wrong!! Please try again!!": "Yon erè te fèt. Eseye anko!!",
    "Email sent.": "Imèl voye.",
    "Please enter a valid email address.": "Tanpri antre yon adrès imel valab.",
    "New collector has been added.": "Yon nouvo pèseptè te ajoute.",
    "Failed to add new user.": "Echwe pou ajoute nouvo itilizatè.",
    "Collector Details updated.": "Pèseptè detay mete ajou.",
    "Failed to update User Details.": "Echwe pou mete ajou detay itilizatè yo.",
    "Email sent successfully.": "Imèl voye avèk siksè.",
    "Please enter all the fields marked with *":
      "Tanpri antre nan tout jaden ki make ak *",
    "Proforma details saved successfully. Email with invoice details sent":
      "Detay yo pro forma yo te anrejistre. Imèl ak detay fakti voye",
    "Active Batches": "Lo aktif",
    "Unsuccessful Batches": "Lo san siksè",
    "Payment History": "Istwa peman",
    "Batch Details": "Detay lo",
    "Loading/Unloading information has not been furnished for this batch":
      "enfòmasyon Chaje / dechaje pa te bay pou pakèt sa",
    "Total Number Of Lots": "Kantite total lo yo",
    "Exceeded Time limit": "Delè",
    "Unsold No of Boxes": "Pa envandu nan bwat",
    "Back To List": "tounen nan lis la",
    "Select all unsold boxes": "Chwazi tout bwat envandu yo",
    "Unselect all boxes": "Deselekte tout bwat yo",
    Done: "Fini",
    "Weight(Kg) Per Box": "Pwa (Kg) pou chak bwat",
    "Broker Margin": "Koutye Marge",
    "Sales Price Per Kg": "Pri vant lan pou chak kg",
    "Weight(Kg) Per Box	Pwa (Kg)": "pou chak bwat",
    "Unsold No of Boxes": "Pa envandu nan bwat",
    "Boxes Selected": "Bwat yo chwazi",
    "Box Selection": "Seleksyon bwat",
    "Sales Price Per Kg": "Pri vant lan pou chak kg",
    "Sale Placed Successfully": "Vann siksè",
    "Ship Order": "Lòd Shipping",
    "Unloading at Buyer's Place": "Dechaje nan achtè a",
    "Date & Time of UnLoading": "Dat ak lè dechaje",
    "Total No of Boxes UnLoaded": "Total kantite bwat dechaje",
    "Upload Purchase Order": "Telechaje fòm lòd la",
    "Cost of Transportation": "Pri transpò",
    "Buyer's Location": "Kote achtè a",
    "Invoice Details": "Detay fakti",
    "Buyer Organization": "Organizationganizasyon achtè",
    "Unsuccessful Batches": "Anpil san siksè",
    "Total Number Of Lots": "Kantite total lo yo",
    "Payment History": "istwa peman",
    "View Collection Point Details": "Gade detay sou pwen koleksyon yo",
    "Collection Time Stamp": "Koleksyon timestamp",
    "Fruits Rejected at CP": "Fwi rejte nan CP",
    "Fruits Collected": "Fwi rekolt",
    "Internal temp. of Fruit @ CP": "Tan entèn. pa Fwi @ CP",
    "Arrival at Packhouse": "Arive nan estasyon procesna",
    "View Shipment Details": "View detay chajman",
    "No. of boxes shipped": "Nimewo nan bwat anbake",
    "Weight of Fruits Shipped (in Kgs)": "Pwa nan fwi anbake (nan kg)",
    "Fruits rejected at Packhouse": "Fwi rejte nan estasyon procesna",
    "Date of shipment (Pro-forma creation Date)":
      "Dat Shipment (Pro-forma dat kreyasyon)",
    "View Payment Details": "View detay peman",
    "Sold On": "Vann nan",
    "Weight of Fruits Sold (in Kgs)": "Pwa nan fwi vann (nan kg)",
    "Payment to Broker": "Peman koutye",
    "Payment confirmed.": "Aksepte peman.",
    "Arrival and destination details saved successfully.":
      "Detay sou arive ak destinasyon yo te sove avèk siksè.",
    "Please upload document.": "Tanpri telechaje dokiman an.",
    "Quality Inspection details saved successfully.":
      "Detay enspeksyon kalite yo te enskri avèk siksè.",
    "Cold Storage details saved successfully.":
      "Detay chanm frèt yo te sove avèk siksè.",
    "Cost of Maturation details saved successfully.":
      "Pri nan detay spirasyon sove avèk siksè.",
    "Total no. of boxes unloaded should be less than total no. of boxes loaded.":
      "Kantite total bwat dechaje yo dwe mwens pase kantite total bwat yo chaje.",
    "Please enter all the fields marked with *":
      "Tanpri antre nan tout jaden ki make ak *",
    "Sale placed successfully.": "vant anrejistre avèk siksè.",
    "Boxes selected should be less than corresponding Unsold No. of Boxes.":
      "Bwat yo chwazi yo dwe mwens pase kantite bwat korespondan envandu yo.",
    "Enter number Of boxes to buy.": "Mete kantite bwat yo achte.",
    "Documents uploaded successfully.": "Dokiman telechaje avèk siksè.",
    "Quality Inspection details saved successfully.":
      "Detay enspeksyon kalite yo te enskri avèk siksè.",
    "Please complete the Ship Order and Unloading to generate the invoice.":
      "Tanpri ranpli lòd la anbakman ak dechaje jenere fakti a.",
    "Generated invoice successfully. Email with invoice link sent to the buyer.":
      "Bòdwo pwodwi avèk siksè. Imèl ki gen lyen ki mennen nan fakti a voye bay achtè a.",
    "Please fill all the fields.": "Tanpri ranpli tout jaden yo.",
    "Please check the internet connection":
      "Tanpri tcheke koneksyon entènèt la",
    "Error updating data to firebase": "Erè mete ajou done nan Firebase",
    "Payment confirmed successfully.": "Peman konfime avèk siksè.",
    "Error updating data corda blockchain.":
      "Erè mete ajou kòd done blokchain.",
    "Successfully uploaded the Purchase Order.":
      "Fòm lòd la te telechaje avèk siksè.",
    "Error updating Sold Out Status in firebase":
      "Erè mete ajou eta fin itilize nan Firebase",
    "Cost of Ripening details saved successfully.":
      "Detay pri nan matrité sove avèk siksè",
    "Invalid email address.": "Adrès imèl ki pa valab.",
    "Boxes loaded cannot be more than boxes sold.":
      "Bwat chaje pa ka plis pase bwat vann.",
    "Total no. of boxes unloaded should be less than total no. of boxes loaded.":
      "Kantite total bwat ki dechaje yo dwe mwens pase kantite total bwat yo chaje.",
    "Unloading at buyer's place details saved successfully.":
      "Detay avèk siksè dechaje achtè a.",
    "Please select boxes.": "Tanpri chwazi bwat.",
    "Status updated successfully.": "Estati mete ajou avèk siksè.",
    "Cold Storage details saved successfully.":
      "Detay chanm frèt yo te sove avèk siksè.",
    "Penalties (If any)": "Sanksyon (si sa aplikab)",
    Assigned: "Asiyen",
    "Collector Dashboard": "Pèseptè Dach",
    "Powered By AgriLedger": "Patrone pa Agriledger",
    "Select Crates Part": "missing	Chwazi Kès",
    Wire: "Fil",
    Mobile: "Mobil",
    Cash: "Lajan Kach",
    "Is ready to pay to NGO?": "Èske pare pou peye ONG?",
    "Reason for Rejection": "Rezon pou rejè",
    "No Attachments yet": "Pa gen Atachman ankò",
    "Attach (doubt if its possible)": "Tache (dout si sa posib)",
    "Rejection Criteria": "Kritè pou rejè",
    "Drop file here": "Drop dosye isit la",
    "Please enter temperature": "Tanpri antre tanperati",
    "Please enter ambient temp": "Tanpri antre tanperati anbyen",
    "Please enter crates": "Tanpri antre kès",
    "Please enter fruit harvested": "Tanpri antre fwi rekolt",
    "Please enter fruit rejected": "Tanpri antre fwi rejte",
    "Please Select a Reason for Rejected Fruits.":
      "Tanpri chwazi yon rezon pou fwi rejte.",
    "You can select only two images.": "Ou ka chwazi de imaj sèlman .",
    "Please enter a valid fruit count": "Tanpri antre nonb fwi valab",
    "Please enter advance given": "Tanpri antre davans yo bay la",
    "Please scan/enter the QR codes.": "Tanpri eskane / antre kòd QR yo.",
    "Please select currency": "Tanpri chwazi ",
    "Please select payment method": "Tanpri chwazi metòd peman",
    "Please select NGO": "Tanpri chwazi ONG",
    "Please select bank": "Tanpri chwazi bank",
    "Please enter valid account number": "Tanpri antre nimewo kont valab",
    "Please select drop off location": "Tanpri chwazi kote depoze a",
    "There seems to no Internet connectivity. Your data will be automatically synchronized the moment connectivity is established. You can continue to work with the application in the meanwhile":
      "Sanble pa gen okenn koneksyon entènèt. Done ou yo pral otomatikman senkronize moman sa a koneksyon etabli. Ou ka kontinye travay avèk aplikasyon an pandan se tan",
    "Application is offline now": "App la offline kounye a",
    Collector: "Pèseptè",
    "Enroute Producer": "Sou wout a pwodiktè",
    "Enroute Packhouse": "Sou wout estasyon anbalaj la",
    "With Producer": "Avèk pwodiktè a",
    "Arrived at Packhouse": "Te rive nan estasyon procesna",
    "Arrived At Packhouse": "Te rive nan estasyon procesna",
    "Choose your language": "Chwazi lang ou",
    Quality: "Kalite",
    Maturity: "Matirite",
    Quantity: "Kantite lajan",

    "View Previous Requests": "Gade Demann anvan yo",
    "Create Batches": "Kreye lo",
    "Add Collector": "Add Pèseptè",
    "View Batches": "Wè lo",
    "Propose Producer": "Pwopoze Pwodiktè",
    "Manage Collection Points": "Jere Pwen Koleksyon",
    "Manage Harvest Planner": "Jere Planifikatè rekòt",
    "Active Service Request - Map-View": "Aktif Sèvis Demann - Vi Kat la",
    "Calender-View": "Vi Kalendriye",
    "Previous Service Request - Map-View": "Demann sèvis anvan - Vi kat la",
    "Calender-View": "Vi Kalendriye",
    "Proposed Producers": "Pwopoze pwodiktè yo",
    "Propose New Producer": "Sijere yon nouvo pwodiktè",
    "Select a Producer to Edit & Update or Propose a New Producer'":
      "Chwazi yon pwodiktè pou modifye epi mete ajou oswa pwopoze yon nouvo pwodiktè '",
    NIF: "NIF",
    CIN: "CIN",
    "Longitude,Latitude": "Lonjitid latitid",
    "Click here to view profile pic": "Klike la a pou wè foto pwofil la",
    "Propose Producer": "Sijere yon pwodiktè",
    "Email sent.": "Imèl voye.",
    "Edit Producer Details": "Edit Detay Pwodiktè",
    "New Producer Details": "Nouvo Detay Pwodiktè",
    "Please fill all the mandatory fields.":
      "Tanpri ranpli tout jaden obligatwa yo.",
    "Producer proposed successfully": "Pwopoze avèk siksè pwodiktè",
    "Dashboard - Observer": "Tablodbò - Obsèvatè",
    "View Service Request": "Wè demann sèvis",
    "Payment Reporting": "rapò Peman",
    "Unsuccessful Sale": "Vant san siksè",
    "Observer-Dashboard": "Tablodbò obsèvatè",
    "Dashboard - Observer-MCI": "Tablodbò - Obsèvatè-MCI",
    "Manage Packhouse": "Jere estasyon anbalaj",
    "Observer-MCI-Dashboard": "Dachbord-Obsèvatè-MCI",
    "Harvest Planner": "Planifikatè rekòt",
    "Harvest Planner Distributions": "Distribisyon Planifikatè rekòt",
    "Harvest Planner Distributions Details":
      "Detay Distribisyon Planifikasyon rekòt",
    "SA-Dashboard/Harvest Planner-Dashboard":
      "SA-Dachbord/Harvest Planifikatè-Dachbord",
    "Harvest Planner-Dashboard": "Harvest Planifikatè-Dachbord",
    "Dashboard - Harvest Planner": "Tablodbò - Planifikatè rekòt",
    "View Producers": "Gade pwodiktè yo",
    "Search Query": "Rechèch rechèch",
    Filter: "Filtre",
    "Harvest Planner - Dashboard": "Harvest Planifikatè - tablodbò",
    "Service request heading": "Tit demann sèvis la",
    "SA-Dashboard/LSP-Dashboard": "SA tablodbò / tablodbò LSP",
    "SA-Dashboard": "SA tablodbò",
    "LSP-Dashboard": "tablodbò LSP",
    "Work Flow": "Work flow",
    "Active Service Requests": "Demann sèvis aktif",
    "No Matching Records": "Pa gen dosye ki matche",
    "Passed & Failed": "Pase ak echwe",
    Passed: "Pase",
    Failed: "echwe",
    Attach: "Tache",
    "Quality Inspection Results": "Rezilta enspeksyon kalite",
    "Transfer to cold storage": "Transfere nan chanm frèt",
    "Transfer to cold storage *": "Transfere nan chanm frèt *",
    "Transfer to Cold Storage": "Transfere nan chanm frèt",
    "Transfer to Cold Storage *": "Transfere nan chanm frèt *",
    Temperature: "Tanperati",
    "Removal from cold storage": "Retire chanm nan frèt",
    "Removal from cold storage *": "Retire chanm nan frèt *",
    "Removal from Cold Storage": "Retire chanm nan frèt",
    "Removal from Cold Storage *": "Retire chanm nan frèt *",
    Temperature: "Tanperati",
    "Feed Packing Line conveyor Belt": "Pouvwa anbalaj Liy CONVEYOR senti",
    "Feed Packing Line conveyor Belt *": "Pouvwa anbalaj Liy CONVEYOR senti *",
    "Fruits per box": "Fwi pou chak bwat",
    "Fruits Per Box": "Fwi pou chak bwat",
    "Add more button": "Ajoute plis bouton",
    "Add More": "Ajoute plis",
    "Fruit Temperature": "Tanperati fwi",
    "Upload Product Certifications": "telechaje sètifikasyon pwodwi (2 kote)",
    "Upload Product Certifications *":
      "telechaje sètifikasyon pwodwi (2 kote) *",
    "Filled Inspection form": "Ranpli fòm enspeksyon",
    "No ATtachments yet": "Pa gen atachman ankò",
    "Attach Filled Inspection form button":
      "Tache bouton fòm enspeksyon ranpli a",
    Destination: "Destinasyon",
    "Previous Service request heading on click of map button":
      "Sèvis header demann anvan an klike sou bouton kat la",
    "All statuses needs to be translated": "Tout lwa yo dwe tradwi",
    Destination: "Destinasyon",
    "No matching Records": "Pa gen dosye matche",
    "Email Address": "adrès imel",
    Batches: "Anpil",
    "Producer Details": "Detay Pwodiktè",
    "Attach button": "Tache bouton",
    Attach: "Tache",
    "Enrolled Harvest Planners": "Anrejistre Planifikatè Harvest",
    "Harvest Planner Details": "Detay planifikatè Harvest",
    "Select a Harvest Planner to Edit & Update OR Create":
      "a New Harvest Planner	Chwazi yon planifikatè rekòt pou edite epi mete ajou OSWA kreye yon nouvo planifikatè rekòt",
    "Create new harvest planner button":
      "Kreye yon nouvo bouton planifikatè rekòt",
    "Create New Harvest Planner": "Kreye yon nouvo bouton planifikatè rekòt",
    Temperature: "Tanperati",
    "Advance Given to Producer": "davans akòde pwodiktè la",
    "Advance Given to LSP": "	davans bay lsp",
    "Payment Method": "Metòd peman",
    "Status - Arrived at Packhouse":
      "Ki dènye nouvèl-rive nan estasyon procesna la",
    "Back To List button": "Retounen nan lis bouton",
    "Back To List": "Retounen nan lis",
    "Column Headers needs to be translated": "Tèt kolòn yo dwe tradui",
    "No. Of boxes purchased": "Nan bwat achte",
    "No. of Boxes Sold": "Nan bwat vann",
    "Payment Reporting": "Peman rapò",
    "Payment Details": "Tit Detay Peman",
    "Login as Harvest Planner": "Log in kòm yon planifikatè rekòt yo",
    "Login as LSP": "Log in kòm LSP",
    "Login as Collector": "Log in kòm yon pèseptè",
    "Collector-Dashboard": "Pèseptè-Tablodbò",
    "Login as Broker": "Ouvri Sesyon an kòm yon koutye",
    "Payment Reporting": "Peman rapò",
    "Unsuccessful Sale": "Vann san siksè",
    "SA-Dashboard": "SA-Tablodbò",
    "MCI-Dashboard": "MCI-Tablodbò",
    "SA-Dashboard/OP-Admin-Dashboard": "SA-Tablodbò / OP-Admin-Tablodbò",
    "Admin-Dashboard": "Admin-Tablodbò",
    "TPA-Dashboard": "TPA-Tablodbò",
    "Dashboard-OP-Admin": "Tablodbò OP-Admin",
    "Dashboard-Super User Heading": "Tablodbò - Tit Super itilizatè ",
    "Manage Packhouses": "Jere depo",
    "Manage Collection Points": "Jere pwen koleksyon yo",
    "Login as Harvest Planner": "Ouvri sesyon an kòm yon planifikatè rekòt yo",
    "Login as LSP": "Ouvri sesyon an kòm LSP",
    "Login as Collector": "Ouvri sesyon an kòm yon pèseptè",
    "Login as Broker": "Ouvri sesyon an kòm yon koutye",
    "Login as TPA": "Ouvri sesyon an kòm TPA",
    "Payment Reporting": "Peman rapò",
    "Unsuccessful Sale": "Vann san siksè",
    "Hold Camera/Scanner Steady": "Kenbe kamera a/scanner fiks",
    "Login as LSP SPOC": "Ouvri sesyon an kòm LSP SPOC",
    "Login as Broker SPOC": "Ouvri sesyon an kòm yon koutye SPOC",
    "Registered Bank Accounts": "Kont anrejistre labank",
    "Create New Bank Account": "kreye nouvo kont labank",
    "Bank Account Details": "Detay kont labank",
    "Dashboard - MCI": "Tablodbò - MCI",
    "Login as Extension Services": "ouvri sesyon an kòm sèvis ekstansyon",
    Distribution: "distribisyon",
    "Select Currency": "Chwazi monnen",
    "Account Details": "Detay Kont",
    "Bank Account Currency": "monnen kont labank",
    "User Type": "Kalite Itilizatè",
    "The fields marked * are mandatory and the values need to be updated.":
      "Jaden ki make * yo obligatwa epi valè yo bezwen mete ajou.",
    Save: "Sove",
    Cancel: "Anile",
    "Search Query": "Rechèch",
    Filter: "Filtre",
    Records: "Dosye",
    "Total Weight of Fruits Sold (in Kg)": "Total pwa fwi vann (in Kg)",
    "Search Query": "Rechèch",
    Filter: "Filtre",
    "Matching Records": "Matche Dosye",
    "First Name": "Non",
    "Last Name": "Siyati",
    Department: "Depatman",
    Town: "Vil",
    "Phone Number": "Nimewo telefòn",
    Location: "Anplasman",
    "Proposed By": "Pwopoze pa",
    Reject: "Rejte",
    "Are you sure you want to proceed to reject this producer ?":
      "Èske ou sèten ou vle kontinye rejte pwodiktè sa a?",
    "Select Bank": "Chwazi Bank",
    "Mobile Payment Operator": "Operatè peman mobil",
    "Mobile Payment Number": "Nimewo Peman mobil",
    "Phone Number": "Nimewo telefòn",
    Temperature: "Tanperati",
    "matching records": "matche dosye",
    "Search Query": "Rechèch",
    Records: "Dosye",
    "Service Requests": "Demann Sèvis",
    "Active Service Request": "Demann Sèvis aktif",
    "Map View": "Kat View",
    "matching records": "matche dosye",
    "Search Query": "Rechèch",
    Records: "Dosye",
    "Previous Service Request": "Demann Sèvis presedan",
    "Map View": "Vi Kat",
    "matching records": "matche dosye",
    "Search Query": "Rechèch",
    Records: "Dosye",
    Passed: "Pase",
    Failed: "Echwe",
    Attach: "Tache",
    "Transfer to Cold Storage": "Transfere nan depo frèt",
    Temparature: "Tanperati",
    "Carton Filling details saved successfully":
      "Detay ranplisage Carton sove avèk siksè",
    "Carton Filling details t updated": "Detay ranplisage Katon  yo mete ajou",
    "Please fill Carton Filling Details":
      "Tanpri ranpli detay ranplisage katon",
    "Attachment yet": "Atachman ankò",
    "Attach Filled Inspection form": "Tache Fòm Enspeksyon Ranpli",
    "Login As Auditor": "Login Kòm verifikatè",
    "Batch Proforma Completed": "Proforma Pakèt Konplete",
    Cancelled: "Anile",
    "Sold Out": "Vann deyò",
    "Service Requests": "Demann Sèvis",
    "Packhouse Incharge-Dashboard": "Packhouse en charge- tablodbò",
    Available: "Disponib",
    "Date & Time of Loading": "Dat & Lè chaje",
    "Total .No Of Boxes Loaded": "Total.No  bwat chaje",
    "Transportation Order": "Lòd Transpò",
    "Confirm Payment": "Konfime Peman",
    ". Of Boxed Sold": ". Nan bwat vann",
    "Amount Factored": "Kantite lajan faktè",
    "Factoring Entity": "Antite faktè",
    "Factoring Agent": "Ajan faktè",
    "Factoring Charges": "Frè faktè",
    "Unsuccessful Batches": "Pakèt san siksè",
  },
});
export default {
  name: "language",
  data: function () {
    return {
      selectedLanguage: "en",
    };
  },
  computed: {
    // userName: function() {
    //   return this.$t("userName", "{userName}", {
    //     userName: this.userName
    //   });
    // }
  },
  mounted() {
    if (
      localStorage.getItem("language") != undefined &&
      localStorage.getItem("language") != null
    ) {
      this.selectedLanguage = localStorage.getItem("language");
    }
    this.$polyglot.setLang({ lang: this.selectedLanguage });
    var userEmailId = localStorage.emailId;
    if (userEmailId != undefined && userEmailId != null) {
      var ref = firebase
        .database()
        .ref()
        .child("profile")
        .orderByChild("email")
        .equalTo(userEmailId);
      ref.on("child_added", (snapshot) => {
        if (
          snapshot.val().language != undefined &&
          snapshot.val().language != null
        ) {
          this.$polyglot.setLang({ lang: snapshot.val().language });
          this.selectedLanguage = snapshot.val().language;
          localStorage.setItem("language", snapshot.val().language);
        }
      });
    }
  },
  methods: {
    showAppIn: function (lang) {
      this.$polyglot.setLang({ lang: lang });
      this.$router.go();
      var userEmailId = localStorage.emailId;
      var item = {
        language: lang,
      };
      if (userEmailId != undefined && userEmailId != null) {
        var ref = firebase
          .database()
          .ref()
          .child("profile")
          .orderByChild("email")
          .equalTo(userEmailId)
          .on("child_added", (snapshot) => {
            var refEmail = firebase.database().ref("profile/" + snapshot.key);
            refEmail.update(item).then(() => {
              console.log("success");
            });
          });

        localStorage.language = lang;
      }
    },
  },
};
</script>
<style>
.lang-radio-btn {
  position: relative;
  width: 20px;
  height: 17px;
}

.lang-radio,
.label-lang,
.lang-radio-label {
  display: inline-block;
  position: relative;
  color: #fff;
}
.flagImg {
  height: auto;
  width: 25px;
  cursor: pointer;
}
.label-lang {
  text-transform: none;
}
.lang-wrap {
  position: relative;
  display: inline-block;
}
.flag-border {
  border-bottom: 1px solid #fff;
}
</style>
