'use strict';

let Main = (function () {

//  vars
  let productData = null;
  let pageContainer = document.getElementsByClassName('page-container')[0];

//  methods
  let init = function () {
    console.log('init called');
    // Pull in product data
    fetch('./data/products.json').then(response => {
      return response.json();
    }).then(data => {
      // Work with JSON data here
      productData = data.groups;
      // console.log(productData);
      buildPage();

    }).catch(err => {
      console.log('Error fetching product data!')
    });
  };

  let buildPage = function() {
    console.log('build page called');
    let counter = 0;
    let injectHTML = '';
    let injectHTMLFinal = '';
    productData.forEach(function (product, index) {

      if(index === 0) {
        injectHTML += '<div class="flex-grid-thirds">';
      }
      injectHTML += '<div class="col"><img src="'+product.thumbnail.href+'" alt="'+product.name+'" /> '+product.name+'</div>';

      if(index !== 0 && index % 3 === 0 && index !== (productData.length -1)) {
        injectHTML += '</div><div class="flex-grid-thirds">'
      } else {
        injectHTML += '</div>';
      }


      if(index === (productData.length-1)) {
        pageContainer.innerHTML = injectHTMLFinal;
      }
      //
      console.log(injectHTML);
      injectHTMLFinal = injectHTML;
      // injectHTML = '';
    })
  };

  init();

  return {
    foo: function () {
      console.log('foo');
    }
  }

})();

Main.foo();