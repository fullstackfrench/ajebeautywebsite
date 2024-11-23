
document.querySelector('#btn-lg').addEventListener('click', professionalform())

function professionalform() {
  fetch('professionalform', {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'nameofsalon': document.querySelector('#business-name').innerText,
      'role': document.querySelector('#role select option:checked').value,
      //I will add other inputs from the form
  
      
      
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
}





document.querySelector('.edit').addEventListener('click', edit())

function edit() {
  fetch('editpage', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'nameofsalon': document.querySelector('#business-name').innerText,
      'newnameofsalon': document.querySelector('#new-business-name').value,
      'role': document.querySelector('#role select option:checked').value,
      'newrole': document.querySelector('#role select option:checked').value
      //I will add other inputs from the form
  
      
      
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
}


fetch('profilepage', {
  method: 'delete',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    'nameofsalon': document.querySelector('#business-name').innerText,
    'newnameofsalon': document.querySelector('#new-business-name').value,
    'role': document.querySelector('#role select option:checked').value,
    'newrole': document.querySelector('#role select option:checked').value
    //I will add other inputs from the form
  })
})
.then(response => {
  window.location.reload(true); 
});

document.querySelector('.search-button').addEventListener('click', showsearchresults())

function showsearchresults() {
  fetch('searchresults', {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'nameofsalon': document.querySelector('#business-name').innerText,
      'role': document.querySelector('#role select option:checked').value,
      //I will add other inputs from the form
  
      
      
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
}

document.querySelector('.reviews').addEventListener('click', showreviews())

function showsearchresults() {
  fetch('reviews', {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'nameofsalon': document.querySelector('#business-name').innerText,
      'role': document.querySelector('#role select option:checked').value,
      //I will add other inputs from the form
  
      
      
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
}