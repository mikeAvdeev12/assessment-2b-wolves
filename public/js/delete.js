const entries = document.getElementsByClassName('entry');
for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    let del = entry.getElementsByClassName('delete')[0];
    del.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        let id = event.target.id;
        const response = await fetch(`events/${event.target.id}`, {
            method: 'delete',
            headers: {
                "Content-Type": 'aplication/json',
            },
            body: JSON.stringify({
                id: id
            })
        });
        const result = await response.json();
        console.log(result);
        entry.remove()
    });
};


























// document.body.addEventListener("click", async e => {
//     if (e.target.id === "test") {
//       e.preventDefault();
//       const id = e.target.parentNode.parentNode.id;
//       const resp = await fetch(`/delete/${id}`, {
//         method: "DELETE"
//       });
//       const data = await resp.json();
//       const elem = document.getElementById(data._id);
//       elem.remove();
//     }
//   });
