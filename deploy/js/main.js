var Test;

Test = (function() {
  function Test() {
    console.log("hello grunt template from Test");
  }

  return Test;

})();

var Main;

Main = (function() {
  function Main() {
    console.log("hello grunt template");
    console.log("test without grabCoffee");
    new Test();
  }

  return Main;

})();

new Main();
