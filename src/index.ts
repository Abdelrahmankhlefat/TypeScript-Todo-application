import { v4 as uuidV4 } from 'uuid';
// console.log(uuidV4());

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector('#new-task-form') as HTMLFormElement | null;
const input = document.querySelector('#new-task-title') as HTMLInputElement;
const dateTitle = document.querySelector('.date') as HTMLParagraphElement;
let tasks: Task[] = loadTasks();
tasks.forEach(addListItem);
var today = new Date();
dateTitle.innerHTML = today.toDateString();
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input?.value == '' || input?.value == null) return;

  const task: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);
  saveTasks();

  addListItem(task);
  input.value = '';
});
function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  var deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'Delete';
  deleteBtn.classList.add('delete');

  var editBtn = document.createElement('button');
  editBtn.classList.add('edit');
  editBtn.innerHTML = 'edit';

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
  });

  deleteBtn.addEventListener('click', () => deleteItems(task.id));

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, '  ' + task.title);
  item.append(label);
  item.classList.add('item');
  list?.append(item);
  item.style.listStyleType = 'none';
  item.append(deleteBtn);
}

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function searchItemIndex(id: string) {
  var items = loadTasks();
  for (var item in items) {
    if (items[item].id == id) {
      return item;
    }
  }
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('TASKS');
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}

function deleteItems(id: string) {
  var items = loadTasks();
  var a = window.confirm('Are you sure you want to delete this item ?');
  if (a == true) {
    var i = searchItemIndex(id);
    items.splice(i, 1);
    localStorage.setItem('TASKS', JSON.stringify(items));
    window.location.reload();
  } else {
    alert('Failed to delete');
  }
}
