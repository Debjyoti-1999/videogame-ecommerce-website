const PUBLISHABLE_KEY="pk_test_51Hx9nWEopJKnvNij5VLCQLQ5kXzT4f2Gu6BlTzvh4S0Oy1ZsvxKenmMsAYaDs9u4fGeiSS4rmcRXomJxZojprWQN00ZqBuajKT";
const SECRET_KEY="sk_test_51Hx9nWEopJKnvNijs6akgLbmAQaBKWOXNndgkmZU1fXYL7bhmxjx9fuEoNqWEvXYTd34ppD3NXTU5FpF5cvhqy5M001bmWMpHm";
const stripe=require('stripe')(SECRET_KEY);

Stripe.setPublishableKey('pk_test_51Hx9nWEopJKnvNij5VLCQLQ5kXzT4f2Gu6BlTzvh4S0Oy1ZsvxKenmMsAYaDs9u4fGeiSS4rmcRXomJxZojprWQN00ZqBuajKT');
$form=document.getElementById('checkout-form');
$form.addEventListener('submit',myscript);

function stripeResponseHandler(status,response){
    if (response.error) { // Problem!
    alert("yass3");
    document.getElementById('charge-error').textContent=response.error.message;
    document.getElementById('charge-error').classList.remove("hidden");
    document.getElementById('button').setAttribute('disabled',false); // Re-enable submission
  }else { // Token was created
    alert("yass2");
    var token = response.id;
    var inp=document.createElement('input');
    inp.setAttribute("type","hidden");
    inp.setAttribute("name","stripeToken");
    inp.value=token;
    $form.appendChild(inp);
   //$form.append($('<input type="hidden" name="stripeToken" />').val(token));
    $form.get(0).submit();
  }
}
function myscript(){
  alert('yass!!');
  document.getElementById('button').setAttribute('disabled',true);
  Stripe.card.createToken({
  number: document.getElementById('card-number').value,
  cvc: document.getElementById('card-cvc').value,
  exp_month: document.getElementById('card-expiry-month').value,
  exp_year: document.getElementById('card-expiry-year').value,
  }, stripeResponseHandler);
  return false;
}
