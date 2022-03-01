
document.addEventListener("DOMContentLoaded", function(event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // Stockage des informations de notre localstorage.
        let localStorageArray = GetlocalStorageProduct();

        // Appel de nos fonctions.
        
            // Fonction d'affichage dans notre panier.
            displayCart(localStorageArray);

            // Fonction d'affichage du calcul quantité + le prix qui est dans notre localstorage.
            displayTotalPrice(localStorageArray);

            // Fonction principal d'écoute.
            listen();

            // Fonction Verification Regex
            validation();
    }
  
    main();

    
    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    function GetlocalStorageProduct() {
        let getLocalStorage = [];
        // recuperation tableau localstorage tant qu'il y a une valeur
        for (let i = 0; i < localStorage.length; i++) {
        // une cle par produit
        getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        return getLocalStorage;
    }
    
    //-------------------Fonction Affichage de nos produits-------------------//
    //-----------------------------------------------------------------------//
    function displayCart(GetlocalStorageProduct) {

        //Boucle for avec un of pour afficher chaque produit récupérer de notre localstorage.
        for (product of GetlocalStorageProduct) {
            // On stock notre balise Html.
            const domCreation = document.getElementById("cart__items");
            // On push nos nouvels informations dans notre Html.
            domCreation.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="${product.id}">
                            <div class="cart__item__img">
                                <img src="${product.imgurl}" alt="${product.alt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${product.name} ${product.color}</h2>
                                    <p>${product.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
            );
        }
    }
    
    //-------------------Fonction d'affichage du calcul quantité + le prix-------------------//
    //--------------------------------------------------------------------------------------//
    function displayTotalPrice(GetlocalStorageProduct) {

        // Initialisation des variables.
        let totalPrice = 0;
        let totalQty = 0;

        // Boucle for of pour pouvoir récupérer nos information dans 1 product.
        for (product of GetlocalStorageProduct) {
            // On multiplie la quantité du produit fois le prix de notre produit.
            totalPrice += parseInt(product.qty * product.price, 10);
            // On ajoute la quantité de notre produit à 0.
            totalQty += parseInt(product.qty, 10);
        }

        // On récupére nos parents ou on va injecter nos nouvels valeurs.
        const DTotalQty = document.getElementById("totalQuantity");
        const DTotalPrice = document.getElementById("totalPrice");

        // On inject nos nouvels valeurs.
        DTotalQty.innerText = totalQty;
        DTotalPrice.innerText = totalPrice;
    }
    
    //-------------------Fonction principal d'écoute-------------------//
    //----------------------------------------------------------------//
    function listen() {
        // Fonction si changement dans notre input quantity.
        ecoutequantity();
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct();
    }
    
    //-------------------Fonction ecoute de la quantité pour qté total + prix-------------------//
    //-----------------------------------------------------------------------------------------//

    function ecoutequantity() {

        // On stock notre <input>.
        let qtyInput = document.querySelectorAll(".itemQuantity");
        // ForEach sur notre Input.
        qtyInput.forEach(function (input) {
            // On écoute notre input.
            input.addEventListener("input", function (inputevent) {
                // On Stock notre nouvel valeur.
                let inputQty = inputevent.target.value;
                // Conditionnelle si la quantité est supérieur ou = à 1 && inférieure ou = à 100.
                if (inputQty >= 1 && inputQty <= 100) {
                    // Récuperation de notre key pour le localstorage.
                    const productName = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__titlePrice > h2").innerText;
                    // On save notre quantité après la modification de notre input.
                    let localStorageKey = JSON.parse(localStorage.getItem(productName));
                    // On lui dit que maintenant il est = à notre nouvel quantity
                    localStorageKey.qty = inputQty;
                    // On inject notre nouvel quantity dans le localstorage.
                    localStorage.setItem(productName, JSON.stringify(localStorageKey));
                    // On récupérer nos produit du localstorage maitenant qu'ils sont modifié.
                    let localStorageArray = GetlocalStorageProduct();
                    // On refait notre affichage des produits du localstorage.
                    displayTotalPrice(localStorageArray);
                } else {
                alert("Veuillez choisir une quantité entre 1 et 100.");
                }
            });
        });
    }
    
    //-------------------Fonction de Suppréssion dans le panier-------------------//
    //---------------------------------------------------------------------------//

    function ecoutedeleteProduct() {

        // On stock notre <p>.
        let deleteLink = document.querySelectorAll(".deleteItem");
        // ForEach sur notre p.
        deleteLink.forEach(function (input) {
            // On écoute notre input au click.
            input.addEventListener("click", function () {
                // Récuperation de notre key pour le localstorage.
                const productName = input
                .closest("div.cart__item__content")
                .querySelector("div.cart__item__content__titlePrice > h2").innerText;
                // On supprime notre key donc notre produit du localstorage.
                localStorage.removeItem(productName);
                // On supprime notre Product du Html.
                input.closest("div.cart__item__content").parentNode.remove();
                // On récupérer nos produit du localstorage maitenant qu'ils sont modifié.
                let localStorageArray = GetlocalStorageProduct();
                // On refait notre affichage des produits du localstorage.
                displayTotalPrice(localStorageArray);
            });
        });
    }
    
    //-------------------Fonction de Vérification pour Form-------------------//
    //-----------------------------------------------------------------------//

    function validationRegex(form) {
        // Initialisation de nos variables de test.
        const stringRegex = /^[a-zA-Z-]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        let control = true;

        // Si une des valeurs dans nos inputs de notre Form on affiche un méssage d'érreur.
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
        // Sinon on affiche rien
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }
        if (!form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
            control = false;
        // Sinon on affiche rien
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }
        if (!form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
            control = false;
        // Sinon on affiche rien
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
        }
        if (!form.city.value.match(stringRegex)) {
            document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
            control = false;
        // Sinon on affiche rien
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }
        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvais email";
            control = false;
        // Sinon on affiche rien
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }
        if (control) {
            return true;
        } else {
            return false;
        }
    }
    
    //-------------------Fonction d'envois de notre formulaire Après vérification-------------------//
    //---------------------------------------------------------------------------------------------//

    function validation() {

        // On récupére notre bouton envoyer formulaire.
        let orderButton = document.getElementById("order");
        // Au click de notre bouton.
        orderButton.addEventListener("click", function (event) {
            // On récupération nos valeurs du formulaire.
            let form = document.querySelector(".cart__order__form");
            // L'action par défaut ne doit pas être exécutée.
            event.preventDefault();
            // Conditionelle si la longueur de notre localstorage est différent de 0.
            if (localStorage.length !== 0) {
                // Si notre fonction de verification regex nous réponds true.
                if (validationRegex(form)) {

                    // On créer un object avec nos valeurs du formulaire.
                    let formInfo = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value,
                    };

                    // Initialisation de notre array à vide. 
                    let product = [];

                    // Boucle for pour récupérer nos éléments du localstorage.
                    for (let i = 0; i < localStorage.length; i++) {
                        product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
                    }

                    // On créer un object avec notre formulaire validé + nos product du localstorage.
                    const order = {
                        contact: formInfo,
                        products: product,
                    };

                    // Méthode Appel Ajax en POST en inculant notre commande(order). 
                    const options = {
                        method: "POST",
                        body: JSON.stringify(order),
                        headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        },
                };

                // On fait un appel fetch sur notre url d'API en lui passant nos options.
                fetch("http://localhost:3000/api/products/order", options)
                    .then((res) => res.json())
                    .then(function (data) {
                        // On envoie vers la page confirmation avec l'id de la commande concaténé.
                        window.location.href = "confirmation.html?id=" + data.orderId;
                    })
                    .catch(function (err) {
                        alert("error");
                    });
                } else {
                    event.preventDefault();
                    alert("Le formulaire est mal remplis.");
                }
            } else {
                event.preventDefault();
                alert("Votre panier est vide.");
            }
        });
    }
});
