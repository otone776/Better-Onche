// ==UserScript==
// @name                   Better'Onche
// @namespace          github/otone776
// @version                 0.1
// @description           simplifie l´interface - rendu plus compact - ajoute petits trucs
// @author                  otone
// @match                   https://onche.org/*
// @icon                      https://zupimages.net/up/23/28/826r.png
// @downloadURL      https://github.com/otone776/Better-Onche/raw/main/Better'Onche.user.js
// @updateURL           https://github.com/otone776/Better-Onche/raw/main/Better'Onche.user.js
// @grant                     none
// ==/UserScript==


//!\\ Rendez-vous ligne 366 pour supprimer des fonctions //!\\


"use strict";


///////////////PAGE D´ACCUEIL///////////////


/////Déplacer "Mes Dernier messages" en bas de page

function moveMyLastMessages() {
    const findElementWithText = (selector, text) => {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.trim() === text) {
                return elements[i];
            }
        }
        return null;
    };
    const topSubjects = findElementWithText(".bloc .title", "Top sujets de la semaine");
    const myLastMessages = findElementWithText(".bloc .title", "Mes derniers messages");
    if (topSubjects && myLastMessages) {
        const topSubjectsParent = topSubjects.closest(".bloc");
        const myLastMessagesParent = myLastMessages.closest(".bloc");
        topSubjectsParent.insertAdjacentElement("afterend", myLastMessagesParent);
    }
}


///////////////LISTE DES SUJETS///////////////


/////Masquer la barre orange des topics feu

function hideFireBar() {
const style = document.createElement('style');
style.textContent = `
    .topic.hot::before {
        display: none;
    }
`;
document.head.appendChild(style);
}


///////////////SUJETS///////////////


/////Désactiver la bordure bleue de OP

function disableOpBorder() {
    const opElements = document.querySelectorAll('.message-op');
    opElements.forEach(element => {
        element.style.border = 'none';
    });
}

/////Masquer les badges

function hideBadges() {
    const badges = document.querySelectorAll('.message-badges');
    badges.forEach(badge => {
        badge.style.visibility = 'hidden';
    });
}

/////Réduire la taille de la signature

function reduceSignatureSize() {
    var signatures = document.querySelectorAll('.signature');
    for (var i = 0; i < signatures.length; i++) {
        signatures[i].style.fontSize = '11px';
        var childElements = signatures[i].querySelectorAll('*');
        for (var j = 0; j < childElements.length; j++) {
            childElements[j].style.fontSize = '11px';
        }
    }
}

/////Masquer l´arrière-plan de la date

function hideDateBackground() {
    document.querySelectorAll('.message-date').forEach(function (messageDate) {
        messageDate.style.backgroundColor = 'transparent';
    });
}

/////Masquer l'arrière-plan des réactions (nouvel affichage de l´interaction)

function hideReactionBackground() {
    function applyBlueStyleToLikedButton(button) {
        if (button.classList.contains('-liked')) {
            addBlueStyle(button);
        } else {
            button.style.color = '';
        }
    }
    function addBlueStyle(element) {
        element.style.color = '#71c2fb';
    }
    function applyTransparentStyle(element) {
        element.style.background = 'transparent';
    }
    function applyTransparentStyleToChildren(element) {
        const children = element.querySelectorAll('*');
        children.forEach(function (child) {
            applyTransparentStyle(child);
        });
    }
    function observeLikeButtons(buttons) {
        buttons.forEach(function (button) {
            const observer = new MutationObserver(function (mutationsList) {
                mutationsList.forEach(function (mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        applyBlueStyleToLikedButton(button);
                    }
                });
            });
            observer.observe(button, { attributes: true });
        });
    }
    function observeChildrenMutations(button) {
        const observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            applyTransparentStyle(node);
                        }
                    });
                    mutation.removedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            node.style.background = '';
                        }
                    });
                }
            });
        });
        const children = button.querySelectorAll('*');
        children.forEach(function (child) {
            observer.observe(child, { childList: true });
        });
    }
    function applyStylesToLikeButtons(buttons) {
        buttons.forEach(function (button) {
            applyTransparentStyle(button);
            applyTransparentStyleToChildren(button);
            applyBlueStyleToLikedButton(button);
            observeChildrenMutations(button);
        });
    }
    const likeButtons = document.querySelectorAll('.likeButton__reaction');
    applyStylesToLikeButtons(likeButtons);
    observeLikeButtons(likeButtons);
    const reactButtons = document.querySelectorAll('.likeButton__react');
    reactButtons.forEach(function (button) {
        applyTransparentStyle(button);
    });
    const mutationObserver = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                const addedButtons = Array.from(mutation.addedNodes).filter(node => node.matches && node.matches('.likeButton__reaction'));
                applyStylesToLikeButtons(addedButtons);
                observeLikeButtons(addedButtons);
                const addedReactButtons = Array.from(mutation.addedNodes).filter(node => node.matches && node.matches('.likeButton__react'));
                addedReactButtons.forEach(function (button) {
                    applyTransparentStyle(button);
                });
            }
        });
    });
    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
}

/////Trier les réactions par ordre de popularité

function sortReactionsByPopularity() {
    function compareButtons(a, b) {
        const totalA = parseInt(a.querySelector('.likeButton__reaction__total').textContent, 10);
        const totalB = parseInt(b.querySelector('.likeButton__reaction__total').textContent, 10);
        return totalB - totalA;
    }
    const parents = document.querySelectorAll('.likeButton__reactions');
    parents.forEach(parent => {
        const buttons = parent.querySelectorAll('.likeButton__reaction');
        const buttonsArray = Array.from(buttons);
        buttonsArray.sort(compareButtons);
        buttonsArray.forEach(button => parent.appendChild(button));
        const reactContainer = parent.querySelector('.likeButton__react');
        if (reactContainer) {
            parent.appendChild(reactContainer);
        }
    });
}

/////Changer le format par défaut de la date avec un clic et afficher les PEMT

function switchDateFormatAndShowPEMT() {
    function extractDateAndTime(title) {
        const match = /(\d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}:\d{2})/.exec(title);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }
    const messageDateElements = document.querySelectorAll('.message .message-date');
    messageDateElements.forEach(messageDateElement => {
        messageDateElement.setAttribute('data-original-text', messageDateElement.textContent);
    });
    let currentState = localStorage.getItem('messageDateState') || 'original';
    function checkSimilarDates() {
        const dateOccurrences = {};
        messageDateElements.forEach(messageDateElement => {
            const date = extractDateAndTime(messageDateElement.getAttribute('title'));
            if (date) {
                if (!dateOccurrences[date]) {
                    dateOccurrences[date] = [];
                }
                dateOccurrences[date].push(messageDateElement);
            }
        });
        messageDateElements.forEach(messageDateElement => {
            const date = extractDateAndTime(messageDateElement.getAttribute('title'));
            if (date && dateOccurrences[date] && dateOccurrences[date].length > 1) {
                const firstOccurrence = dateOccurrences[date][0] === messageDateElement;
                const pemtText = firstOccurrence ? 'PEMT ↓ ' : 'PEMT ↑ ';
                if (!messageDateElement.textContent.includes(pemtText.trim())) {
                    messageDateElement.textContent = pemtText + messageDateElement.textContent;
                }
            }
        });
    }
    function updateElements() {
        messageDateElements.forEach(messageDateElement => {
            const originalText = messageDateElement.getAttribute('data-original-text');
            const extractedText = extractDateAndTime(messageDateElement.getAttribute('title'));
            if (currentState === 'original') {
                messageDateElement.textContent = originalText;
            } else if (currentState === 'extracted' && extractedText) {
                messageDateElement.textContent = extractedText;
            }
            checkSimilarDates();
        });
    }
    function toggleExtraction() {
        currentState = currentState === 'original' ? 'extracted' : 'original';
        localStorage.setItem('messageDateState', currentState);
        updateElements();
    }
    updateElements();
    messageDateElements.forEach(messageDateElement => {
        messageDateElement.addEventListener('click', toggleExtraction);
    });
}

/////Réduire la barre bleue qui lie les citations

 function reduceQuoteBar() {
  var style = document.createElement('style');
  style.type = 'text/css';
  var css = `
    body.forum .message .message-history .message.answer {
      margin-bottom: -7px;
      margin-top: -7px;
    }
    body.forum .message .message-history .history-step {
      height: 18px;
      border-radius: 0px;
    }
    body.forum .message .message-history .history-more>button {
      margin: 0 auto 0px auto;
    }
  `;
  var messageAnswers = document.querySelectorAll('.message.answer');

  messageAnswers.forEach(function(messageAnswer) {
    messageAnswer.style.margin = '-6px 0px 0.8em';
  });
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  document.head.appendChild(style);
}

/////Réduire le bas du message, décaler la date dans son coin

function reduceMessageBottomAndMoveDate() {
    var messages = document.querySelectorAll('.message');
    messages.forEach(function (message) {
        message.style.paddingBottom = '9px';
    });
    document.querySelectorAll('.message-date').forEach(function (messageDate) {
        messageDate.style.marginRight = '-12.5px';
        messageDate.style.marginBottom = '-2px';
    });
}

/////Rendre les messages et les blocs légèrement plus compacts (PC uniquement)

function makeMessagesAndBlocksCompactOnDesktop() {
    var isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    if (isDesktop) {
        var style = document.createElement('style');
        style.innerHTML = `
            #content #right {
                padding-left: 0.8em;
            }
            .bloc {
                margin: 0 0 0.8em;
            }
        `;
        document.head.appendChild(style);
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.margin = '0 0 0.8em';
        });
    }
}

/////Rendre les blocs légèrement plus compacts (Mobile uniquement)

function makeBlocksCompactOnMobile() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        var elements = document.getElementsByClassName("bloc");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.marginTop = "0.3rem";
            elements[i].style.marginBottom = "0.9rem";
        }
    }
}


///////////////OPTIMISATIONS///////////////


/////Attendre que le contenu de la page soit chargé

function onDocumentReady(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(callback, 1);
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}
onDocumentReady(() => {

//!\\ Supprimez ici la ligne de la fonction déplaisante //!\\

    moveMyLastMessages();

    hideFireBar();

    hideBadges();

    disableOpBorder();

    reduceSignatureSize();

    hideDateBackground();

    hideReactionBackground();

    sortReactionsByPopularity();

    switchDateFormatAndShowPEMT();

    reduceMessageBottomAndMoveDate();

    makeMessagesAndBlocksCompactOnDesktop();

    makeBlocksCompactOnMobile();

    reduceQuoteBar();

});




