document.forms[0].addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const email = document.getElementsByName('emaillog')[0].value;
  const password = document.getElementsByName('passwordlog')[0].value;

  const response = await fetch('/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const result = await response.json();
  if (result.status) { window.location = '/';}
  else {
    document.getElementsByName('status-text')[0].innerText = 'Введен неверный username или e-mail';
  }
});

