$(function () {
  $("#payup-toggle-cart").on('click', function (e) {
    $(".payup-drawer").toggleClass("active");
    $(e.currentTarget).toggleClass("active");
    console.log("12")
  });

  $("[data-payup-cart-remove]").on('click', function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-target');
    $.get(url);
  });

  $("[data-payup-cart-add]").on("click", function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-cart-add');
    $.get(url);
  });
})
