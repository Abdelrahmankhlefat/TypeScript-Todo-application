import { v4 as uuidV4 } from 'uuid';

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
  const buttonContainer = document.createElement('div'); // Container for buttons
  const deleteBtn = document.createElement('button');
  const editBtn = document.createElement('button');

  // Set up the delete button
  deleteBtn.innerHTML = 'Delete';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', () => deleteItems(task.id));

  // Set up the edit button
  editBtn.innerHTML = 'Edit';
  editBtn.classList.add('edit');
  editBtn.addEventListener('click', () => editTask(task, label));

  // Set up the checkbox
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
  });

  // Append elements to the label and item
  label.append(checkbox, '  ' + task.title);
  item.append(label);

  // Append buttons to the container
  buttonContainer.append(editBtn, deleteBtn);
  buttonContainer.classList.add('button-container'); // Add a class for styling

  // Append the button container to the item
  item.append(buttonContainer);
  item.classList.add('item');
  item.style.listStyleType = 'none';

  // Append the item to the list
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('TASKS');
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}

function deleteItems(id: string) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  window.location.reload();
}

function editTask(task: Task, label: HTMLLabelElement) {
  // Get the text node from the label (the task title)
  const textNode = Array.from(label.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE
  );

  if (!textNode) return;

  // Create an input field for editing
  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.title;

  const listItem = label.closest('li');
  const editBtn = listItem?.querySelector('.edit');
  const buttonContainer = listItem?.querySelector('.button-container');

  if (editBtn && buttonContainer) {
    // Hide the edit button
    editBtn.classList.add('d-none');

    // Create a "Complete Edit" button
    const completeEditBtn = document.createElement('button');
    completeEditBtn.innerHTML = 'Done editing';
    completeEditBtn.classList.add('complete-edit');
    buttonContainer.prepend(completeEditBtn);

    completeEditBtn.addEventListener('click', () => {
      const newTitle = input.value.trim();
      if (newTitle) {
        task.title = newTitle;
        saveTasks();

        label.removeChild(input);
        textNode.textContent = '  ' + newTitle;

        completeEditBtn.remove();
        editBtn.classList.remove('d-none');
      }
    });
  }

  textNode.textContent = '';
  label.appendChild(input);
  input.focus();
}