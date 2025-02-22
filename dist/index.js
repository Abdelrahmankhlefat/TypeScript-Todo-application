"use strict";
export const __esModule = true;
import { v4 } from "uuid";
var list = document.querySelector('#list');
var form = document.querySelector('#new-task-form');
var input = document.querySelector('#new-task-title');
var dateTitle = document.querySelector('.date');
var tasks = loadTasks();
tasks.forEach(addListItem);
var today = new Date();
dateTitle.innerHTML = today.toDateString();
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
    e.preventDefault();
    if ((input === null || input === void 0 ? void 0 : input.value) == '' || (input === null || input === void 0 ? void 0 : input.value) == null)
        return;
    var task = {
        id: (0, v4)(),
        title: input.value,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(task);
    saveTasks();
    addListItem(task);
    input.value = '';
});
function addListItem(task) {
    var item = document.createElement('li');
    var label = document.createElement('label');
    var checkbox = document.createElement('input');
    var buttonContainer = document.createElement('div'); // Container for buttons
    var deleteBtn = document.createElement('button');
    var editBtn = document.createElement('button');
    // Set up the delete button
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', function () { return deleteItems(task.id); });
    // Set up the edit button
    editBtn.innerHTML = 'Edit';
    editBtn.classList.add('edit');
    editBtn.addEventListener('click', function () { return editTask(task, label); });
    // Set up the checkbox
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
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
    list === null || list === void 0 ? void 0 : list.append(item);
}
function saveTasks() {
    localStorage.setItem('TASKS', JSON.stringify(tasks));
}
function loadTasks() {
    var taskJSON = localStorage.getItem('TASKS');
    if (taskJSON == null)
        return [];
    return JSON.parse(taskJSON);
}
function deleteItems(id) {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    window.location.reload();
}
function editTask(task, label) {
    // Get the text node from the label (the task title)
    var textNode = Array.from(label.childNodes).find(function (node) { return node.nodeType === Node.TEXT_NODE; });
    if (!textNode)
        return;
    // Create an input field for editing
    var input = document.createElement('input');
    input.type = 'text';
    input.value = task.title;
    // Find the edit button and button container associated with this task
    var listItem = label.closest('li');
    var editBtn = listItem === null || listItem === void 0 ? void 0 : listItem.querySelector('.edit');
    var buttonContainer = listItem === null || listItem === void 0 ? void 0 : listItem.querySelector('.button-container');
    if (editBtn && buttonContainer) {
        // Hide the edit button
        editBtn.classList.add('d-none');
        // Create a "Complete Edit" button
        var completeEditBtn_1 = document.createElement('button');
        completeEditBtn_1.innerHTML = 'Complete Edit';
        completeEditBtn_1.classList.add('complete-edit');
        // Append the "Complete Edit" button to the button container
        buttonContainer.prepend(completeEditBtn_1);
        // Save the updated task when the "Complete Edit" button is clicked
        completeEditBtn_1.addEventListener('click', function () {
            var newTitle = input.value.trim();
            if (newTitle) {
                task.title = newTitle;
                saveTasks();
                // Remove the input field and restore the text node
                label.removeChild(input);
                textNode.textContent = '  ' + newTitle;
                // Remove the "Complete Edit" button and show the edit button again
                completeEditBtn_1.remove();
                editBtn.classList.remove('d-none');
            }
        });
    }
    // Hide the text node and show the input field
    textNode.textContent = ''; // Clear the text node
    label.appendChild(input); // Add the input field
    input.focus();
}
