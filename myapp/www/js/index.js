function ajouterTache() {
  const task = document.getElementById('task');

  if (task.value) {
      const taskList = document.getElementById('taskList');
      const newItem = document.createElement('li');
      newItem.innerHTML = task.value;
      /*taskList.innerHTML += <li>${task.value}</li>;
      $(taskList).listview('refresh');
      task.selected();*/
      
      $(newItem).on('swiperight', function() {
          $(this).addClass('termine'); 
          $('#completedTaskList').append(this); 
          $('#completedTaskList').listview('refresh');
      });

      /*$(newItem).on('swiperight', function() {
          $(this).toggleClass('taskList')
      });*/
      
      $(newItem).on('swipeleft', function() {
          $(this).hide('slow')
      });

      taskList.append(newItem);
      $(taskList).Listview('refresh');

      
      task.selected();
  }
}

function reinitialiserListe() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const task = document.getElementById('task');
  task.value = ""; 
  task.focus();
}