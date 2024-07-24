document.addEventListener("deviceready", onDeviceReady, false);

let activeContactId = 0;

function onDeviceReady() {
    findContact();

    document.querySelector("a[href='#homepage']").addEventListener("click", findContact);
    document.querySelector("#button-add").addEventListener("click", createContact);
}

function findContact() {
    let options = new ContactFindOptions();
    options.filter = ""; // Filter to all contacts
    options.multiple = true;
    let fields = ["*"]; // We want all contact fields
    navigator.contacts.find(fields, displayContacts, onContactError, options);
}

function displayContacts(contacts) {
    let listHtml = "";
    contacts.forEach(function(contact) {
        listHtml += `
            <li>
                <a href='#detailscontactpage' data-id='${contact.id}' class='allContact'>
                    <img src='img/contacts.jpeg' alt='contact'>
                    <h2>${contact.displayName}</h2>
                    <p>${contact.phoneNumbers ? contact.phoneNumbers[0].value : ''}</p>
                </a>
            </li>
        `;
    });

    let contactList = document.querySelector("#contacList");
    contactList.innerHTML = listHtml;
    $(contactList).listview('refresh');

    document.querySelectorAll(".allContact").forEach(function(element) {
        element.addEventListener("click", function(event) {
            activeContactId = element.getAttribute('data-id');
            viewContact(activeContactId);
        });
    });
}

function createContact(event) {
    event.preventDefault();
    
    let form = document.querySelector("#addcontactform");
    let nom = form.querySelector("input[name='nom']").value;
    let prenom = form.querySelector("input[name='prenom']").value;
    let adresse = form.querySelector("input[name='address']").value;
    let numero = form.querySelector("input[name='numero']").value;

    if (!numero) {
        onContactError("Veuillez entrer le numéro");
    } else {
        let newContact = navigator.contacts.create();
        newContact.displayName = nom + ' ' + prenom;
        newContact.nickname = nom + ' ' + prenom;
        
        let phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', numero, true);
        newContact.phoneNumbers = phoneNumbers;

        let addresses = [];
        addresses[0] = new ContactAddress();
        addresses[0].formatted = adresse;
        newContact.addresses = addresses;

        newContact.save(function() {
            resetInput();
            alert("Contact ajouté avec succès.");
            viewContact(newContact.id); // Afficher le nouveau contact après ajout
            homePage();
        }, function(error) {
            onContactError("Erreur lors de la création du contact : " + error.code);
        });
    }
}

function viewContact(contactId) {
    let options = new ContactFindOptions();
    options.filter = contactId.toString(); // Convertir en chaîne
    options.multiple = false;
    let fields = ["*"];

    navigator.contacts.find(fields, function(contacts) {
        let contact = contacts[0];
        if (contact) {
            const form = document.querySelector("#detailcontactform");
            form.querySelector("input[name='nom']").value = contact.displayName || "";
            form.querySelector("input[name='prenom']").value = contact.nickname || "";
            form.querySelector("input[name='address']").value = contact.addresses?.[0]?.formatted || "";
            form.querySelector("input[name='numero']").value = contact.phoneNumbers?.[0]?.value || "";

            document.querySelector("#buton-update").addEventListener("click", updateContact);
            document.querySelector("#buton-delete").addEventListener("click", function(event) {
                event.preventDefault();
                if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
                    deleteContact(contact.id);
                }
            });
        } else {
            onContactError("Contact non trouvé");
            homePage();
        }
    }, onContactError, options);
}

function updateContact(event) {
    event.preventDefault();

    let form = document.querySelector("#detailcontactform");
    let nom = form.querySelector("input[name='nom']").value;
    let prenom = form.querySelector("input[name='prenom']").value;
    let adresse = form.querySelector("input[name='address']").value;
    let numero = form.querySelector("input[name='numero']").value;

    let options = new ContactFindOptions();
    options.filter = activeContactId.toString(); // Convertir en chaîne
    options.multiple = false;
    let fields = ["*"];

    navigator.contacts.find(fields, function(contacts) {
        let contact = contacts[0];
        if (contact) {
            contact.displayName = nom + ' ' + prenom;
            contact.nickname = nom + ' ' + prenom;
            
            let phoneNumbers = [];
            phoneNumbers[0] = new ContactField('mobile', numero, true);
            contact.phoneNumbers = phoneNumbers;

            let addresses = [];
            addresses[0] = new ContactAddress();
            addresses[0].formatted = adresse;
            contact.addresses = addresses;

            contact.save(function() {
                alert("Contact mis à jour avec succès.");
                homePage();
            }, function(error) {
                onContactError("Erreur lors de la mise à jour du contact : " + error.code);
            });
        } else {
            onContactError("Contact non trouvé");
            homePage();
        }
    }, onContactError, options);
}

function deleteContact(contactId) {
    let options = new ContactFindOptions();
    options.filter = contactId.toString(); // Convertir en chaîne
    options.multiple = false;
    let fields = ["id"];

    navigator.contacts.find(fields, function(contacts) {
        let contact = contacts[0];
        if (contact) {
            contact.remove(function() {
                alert("Contact supprimé avec succès.");
                homePage();
            }, function(error) {
                onContactError("Erreur lors de la suppression du contact : " + error.code);
            });
        } else {
            onContactError("Contact non trouvé");
            homePage();
        }
    }, onContactError, options);
}

function resetInput() {
    document.querySelectorAll("form").forEach(function(form) {
        form.reset();
    });
}

function onContactError(error) {
    alert("Erreur: " + error);
}

function homePage() {
    let link = document.querySelector("a[href='#homepage']");
    link.click();
}
