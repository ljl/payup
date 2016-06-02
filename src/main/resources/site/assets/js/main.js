$(function () {
  console.log("jquery in tha house");
  $("#payup-toggle-cart").on('click', function () {
    $(".payup-drawer").toggleClass("active");
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
