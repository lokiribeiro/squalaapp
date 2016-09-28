import { Template } from 'meteor/templating';

import { body } from '../../index.html';

/*Template.body.rendered = function () {

    window.loading_screen = window.pleaseWait({
      logo: "../../assets/img/logo2.png",
      backgroundColor: '#f1f1f1',
      //loadingHtml: "<div class='sk-cube-grid'><div class='sk-cube sk-cube1'></div><div class='sk-cube sk-cube2'></div><div class='sk-cube sk-cube3'></div><div class='sk-cube sk-cube4'></div><div class='sk-cube sk-cube5'></div><div class='sk-cube sk-cube6'></div><div class='sk-cube sk-cube7'></div><div class='sk-cube sk-cube8'></div><div class='sk-cube sk-cube9'></div></div>"
      loadingHtml: spinner
    });

    window.onload=function(){
      //console.log('daan dito');
       //window.setTimeout(function(){
       loading_screen.finish();
    //},3000);
    }

};

Template.body.destroyed = function () {
  if ( this.loading ) {
    this.loading.finish();
  }
};*/

var message = '<h1 style="font-weight: normal;"> Loading </h1>';
var spinner = '<div class="sk-double-bounce"><div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div></div>';
