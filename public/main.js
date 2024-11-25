document.querySelector('.delete').addEventListener('click', deleteAccount)

function deleteAccount() {
  fetch('profile', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    window.location.reload(true); 
  });
}

document.querySelector('.edit').addEventListener('click', editButton)

function editButton() {
  document.querySelector('.newRole').classList.toggle('showInput')
  document.querySelector('.submit').classList.toggle('showInput')
  document.querySelector('.newBusinessName').classList.toggle('showInput')
}

document.querySelector('.submit').addEventListener('click', submitChanges)

function submitChanges() {
  fetch('profileupdated', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'role': document.querySelector('.role').innerText,
      'newRole': document.querySelector('.newRole').value,
      'businessName': document.querySelector('.businessName').innerText,
      'newBusinessName': document.querySelector('.newBusinessName').value
      
    })
    
  })
  .then(response => {
    if (response.ok) return response.json();
  })
  .then(data => {
    console.log(data);
    window.location.reload(true); 
  });
}