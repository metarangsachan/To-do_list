let tasks = [];
const taskList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

console.log('Working');

async function fetchTodos(){
	/*fetch('https://jsonplaceholder.typicode.com/todos')
	.then(function(response){
		console.log(response);
		return response.json();
	}).then(function(data)
	{
		tasks=data.slice(0,10);
		renderList();
	})
	.catch(function(error)
	{
		console.log('error',error);
	})*/
	try{
		const response=await fetch('https://jsonplaceholder.typicode.com/todos');
	const data=await response.json();
	tasks=data.slice(0,10);
		renderList();
	}
	catch(error){
		console.log(error);
	}

}
function addTaskToDOM(task)
{
	const li=document.createElement('li');
	li.innerHTML=`<li>
          <input type="checkbox" id="${task.id}" ${task.completed ? 'checked': ''} class="custom-checkbox">
          <label for="${task.id}">${task.title}</label>
          <img src="bin.svg" class="delete" data-id="${task.id}" />
        </li>`;

        taskList.append(li);
}

function renderList () {
	taskList.innerHTML='';
	for(let i=0;i<tasks.length;i++)
	{
		addTaskToDOM(tasks[i]);
	}

	tasksCounter.innerHTML=tasks.length;
}

function toggleTask (taskId) {
	const task= tasks.filter(function(task){
			return task.id===Number(taskId);
	})
	if(tasks.length>0)
	{
		const current=tasks[0];
		current.completed = !current.completed;
		renderList();
		showNotification('marked successfully');
		return;
	}	
	showNotification('Couldnt mark it');
}

function deleteTask (taskId) {
	const newTasks = tasks.filter(function(task){
			return task.id != Number(taskId);
	});
	tasks = newTasks;
	renderList();
	showNotification('Task deleted succcessfully');
}

function addTask (task) {
	if(task)
	{
		fetch('https://jsonplaceholder.typicode.com/todos',{
			method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
		}).then(function(response){
		return response.json();
	}).then(function(data)
	{
		console.log(data);
		tasks.push(task);
		renderList();
		showNotification('Task has been added successfully');
	})
	.catch(function(error)
	{
		console.log('error',error);
	})
	}

//	showNotification('error');
}

function showNotification(text) {
	alert(text);
}

function handleInputKeypress(a)
{
		if(a.key==='Enter')
		{
			const text=a.target.value;
			console.log('text',text);
			if(!text)
			{
				showNotification('Task cannot be empty');
				return;
			}
			const task={
				title: text,
				id: Date.now(),
				completed:false
			}

			a.target.value='';
			addTask(task);
		}
}
function handleClickListener(e)
{
	const target=e.target;
	console.log(target);
	if(target.className==='delete')
	{
		const taskId= target.id;
		deleteTask(taskId);
		return;
	}
	else if(target.className==='custom-checkbox')
	{
		const taskId= target.dataset.id;
		toggleTask(taskId);
		return;
	}
}
addTaskInput.addEventListener('keyup',handleInputKeypress);
document.addEventListener('click',handleClickListener);