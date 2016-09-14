$(function () {
  $(".payup-cart").on('click', '#payup-toggle-cart', function (e) {
    $(".payup-cart").toggleClass("active");
  });

  $(".payup-cart").on('click', '[data-payup-cart-remove]', function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-cart-remove');
    $.get(url).done(function () {
      refreshCart();
    });
  });

  $("[data-payup-cart-add]").on("click", function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).data('payup-cart-add');
    $.get(url).done(function () {
      refreshCart();
    });
  });
  
  $(".payup-cart").on('click', '#payup-checkout-button', function () {
    $("#payup-checkout-modal").show();
    var checkoutUrl = $("[data-payup-checkout-url]").data('payup-checkout-url');
    console.log(checkoutUrl);
    $.get(checkoutUrl).done(function (data) {
      $("#payup-checkout-modal").html(data);
      componentHandler.upgradeAllRegistered();
    });
  });

  $(".payup-cart").on('click', '.payup-checkout-close', function(e) {
    e.preventDefault();
    $("#payup-checkout-modal").hide();
  });

  $(".payup-cart").on('click', '[data-tab]', function(e) {
    var tab = $(this).data('tab');
    var currentTabClass = '.' + tab;
    $('.cart-tab').not(currentTabClass).css('left', '-100%');
    $(currentTabClass).css('left', 0).css('right', 0);
  });

});

function refreshCart() {
  var url = $("#cart-reload-url").val();
  $.get(url).done(function (data) {
    $(".cart-content").html($(data).find(".cart-content").html());
    $(".payup-toggle-cart-wrapper").html($(data).find(".payup-toggle-cart-wrapper").html());

  })
}
