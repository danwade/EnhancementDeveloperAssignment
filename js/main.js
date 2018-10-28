'use strict';

var localstore={s:window.localStorage,type:"localStorage",set:function(e,t){return this.s.setItem(e,JSON.stringify(t)),t},get:function(e){var t=this.s.getItem(e);if("string"!=typeof t)return void 0;try{return JSON.parse(t)}catch(o){return t||void 0}},remove:function(e){this.s.removeItem(e)},removeAll:function(){this.s.clear()},getAll:function(){for(var e={},t=0;t<this.s.length;t++){var o=this.s.key(t);e[o]=this.get(o)}return e}},
  sessionstore={s:window.sessionStorage,type:"sessionStorage",set:localstore.set,get:localstore.get,remove:localstore.remove,removeAll:localstore.removeAll,getAll:localstore.getAll},
  cookiestore={s:document.cookie,type:"cookie",set:function(e,t,o,r,s){if(void 0!==t&&"object"==typeof t)var n=JSON.stringify(t);else var n=encodeURIComponent(t);document.cookie=e+"="+n+(o?"; expires="+new Date(o).toUTCString():"")+"; path="+(r||"/")+(s?"; secure":"")},get:function(e){var t=this.getAllRawOrProcessed(!1);return t.hasOwnProperty(e)?this.processValue(t[e]):void 0},processValue:function(e){if("{"==e.substring(0,1))try{return JSON.parse(e)}catch(t){return e}return"undefined"==e?void 0:decodeURIComponent(e)},getAllRawOrProcessed:function(e){var t=document.cookie.split("; "),o={};if(1===t.length&&""===t[0])return o;for(var r=0;r<t.length;r++){var s=t[r].split("=");o[s[0]]=e?this.processValue(s[1]):s[1]}return o},getAll:function(){return this.getAllRawOrProcessed(!0)},remove:function(e){this.set(e,"",-1)},removeAll:function(){var e=this.getAll();for(var t in e)this.remove(t);return this.getAll()}};
window.store="undefined"!=typeof Storage?localstore:cookiestore;
//# sourceMappingURL=strg.min.js.map

let EDA = (function () {

  let productData = null;
  let pageContainer = document.getElementsByClassName('product-container')[0];
  let modalWindow = document.getElementsByClassName('overlay')[0];
  let modalCloseButton = modalWindow.getElementsByTagName('button')[0];
  const SAVED_PRODUCT_METHOD_KEY = 'SavedProductMethod';
  const SAVED_PRODUCT_KEY = 'SavedProducts';
  const LOCAL_STORAGE_VALUE = 'local';
  const SESSION_STORAGE_VALUE = 'session';
  const SELECTED_BUTTON_CLASS = 'selected';

  let saveStorage = localstore; //DEFAULT IS LOCAL STORAGE

  if(saveStorage.get(SAVED_PRODUCT_METHOD_KEY) === undefined) {
    saveStorage.set(SAVED_PRODUCT_METHOD_KEY, 'local');
    saveStorage = localstore;
  } else {
    saveStorage.get(SAVED_PRODUCT_METHOD_KEY) === 'local' ? saveStorage = localstore : saveStorage = sessionstore;
  }

  let localStorageButton = document.getElementById('localStorage');
  let sessionStorageButton = document.getElementById('sessionStorage');

  //GET DATA, BIND EVENTS
  let init = function () {

    fetch('./data/products.json').then(response => {
      return response.json();
    }).then(data => {
      productData = data.groups;
      // console.log(productData);
      buildPage();
    }).catch(err => {
      console.log('Error fetching product data!')
    });

    pageContainer.addEventListener('ontouchstart' in window ? 'touchend' : 'click', function (event) {
      if (event.target.tagName.toLowerCase() === 'img') {
        saveProduct(event.target.getAttribute('id'), event.target);
      }
    });

    modalCloseButton.addEventListener('click', toggleModal);
    localStorageButton.addEventListener('click', toggleStorage);
    sessionStorageButton.addEventListener('click', toggleStorage);

  };

  let saveProduct = function (id, product) {

    //CHECK IF LOCAL STORAGE EXISTS
    if (saveStorage.get(SAVED_PRODUCT_KEY) === undefined) {
      saveStorage.set(SAVED_PRODUCT_KEY, id);
      product.parentNode.classList.add('saved');
      toggleModal('saved');
    } else {
      let savedProducts = saveStorage.get(SAVED_PRODUCT_KEY);
      if (savedProducts.indexOf(id) > -1) {
        //remove product
        saveStorage.set(SAVED_PRODUCT_KEY, removeProduct(id));
        product.parentNode.classList.remove('saved');
        toggleModal('removed');
      } else {
        //add product
        savedProducts.length === 0 ? savedProducts += id : savedProducts += ',' + id;
        saveStorage.set(SAVED_PRODUCT_KEY, savedProducts);
        product.parentNode.classList.add('saved');
        toggleModal('saved');
      }
    }
  };

  let removeProduct = function(id) {
    let savedProductsArr = saveStorage.get(SAVED_PRODUCT_KEY).split(',');
    let index = savedProductsArr.indexOf(id);
    if(index > -1) {
      savedProductsArr.splice(index, 1);
    }
    return savedProductsArr.toString();
  };

  let buildPage = function () {
    productData.forEach(function (product, index) {

      //MESSY HERE. PRODUCT PRICE WAS NOT CONSISTENT. SOME HAD PRICE AND OTHERS HAD PRICERANGE
      let price = 'NA';
      if (product.price !== undefined) {
        price = product.price.selling;
      } else if (product.priceRange !== undefined) {
        price = product.priceRange.selling.high;
      }

      pageContainer.innerHTML += '<div class="product"><span class="saved-icon"></span><img id="' + product.id + '" src="' + product.thumbnail.href + '" alt="' + product.name + '" /><p>' + product.name + '<br />$' + price + '.00</p></div>';
    });


    setupNavigation();
    checkForSavedProducts();

  };

  let setupNavigation = function() {
    saveStorage.get(SAVED_PRODUCT_METHOD_KEY) == LOCAL_STORAGE_VALUE ? localStorageButton.classList.add('selected') : sessionStorageButton.classList.add('selected');
  };

  let checkForSavedProducts = function() {
    if(saveStorage.get(SAVED_PRODUCT_KEY) !== undefined && saveStorage.get(SAVED_PRODUCT_KEY) !== '') {
      let savedProductsArr = saveStorage.get(SAVED_PRODUCT_KEY).split(',');
      for(let i=0; i<savedProductsArr.length; i++) {
        document.getElementById(savedProductsArr[i]).parentNode.classList.add('saved');
      }
    }
  };

  let toggleModal = function (message) {
    document.getElementById('modalMessage').innerHTML = message;
    modalWindow.classList.toggle('hidden');
  };

  let toggleStorage = function (event) {
    let clicked = event.target.id;

    if(clicked == 'sessionStorage') {
      saveStorage = sessionstore;
      localstore.set(SAVED_PRODUCT_METHOD_KEY, SESSION_STORAGE_VALUE);
      sessionStorageButton.classList.add(SELECTED_BUTTON_CLASS);
      localStorageButton.classList.remove(SELECTED_BUTTON_CLASS);
    } else {
      saveStorage = localstore;
      localstore.set(SAVED_PRODUCT_METHOD_KEY, LOCAL_STORAGE_VALUE);
      sessionStorageButton.classList.remove(SELECTED_BUTTON_CLASS);
      localStorageButton.classList.add(SELECTED_BUTTON_CLASS);
    }

    window.location.reload(true);

  };

  init();

})();