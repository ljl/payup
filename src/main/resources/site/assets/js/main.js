$(function () {
  $("#payup-toggle-cart").on('click', function (e) {
    $(".payup-drawer").toggleClass("active");
    $(e.currentTarget).toggleClass("active");
  });

  $(".payup-cart").on('click', '[data-payup-cart-remove]', function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-cart-remove');
    $.get(url).done(function () {
      refreshCart();
    });
  });

  $(".payup-cart").on("click", '[data-payup-cart-add]', function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-cart-add');
    $.get(url).done(function () {
      refreshCart();
    });
  });
})

function refreshCart() {
  var url = $("#cart-reload-url").val();
  $.get(url).done(function (data) {
    $(".cart-content").html($(data).find(".cart-content"));
  })
}
