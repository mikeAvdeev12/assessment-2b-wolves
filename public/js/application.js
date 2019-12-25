document.forms[0].addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const username = document.getElementsByName('username')[0].value;
  const password = document.getElementsByName('password')[0].value;
  const email = document.getElementsByName('email')[0].value;

  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });
  const result = await response.json();
  if (result.status) { window.location = '/';}
  else {
    document.getElementsByName('status-text')[0].innerText = 'Введен неверный username или e-mail';
  }
});
