const listContainer = document.querySelector("[data-lists]")
const newListForm = document.querySelector("[data-new-list-form]")
const newListInput = document.querySelector("[data-new-list-input]")
const deleteButton = document.querySelector("[data-delete-button]")
const clearButton = document.querySelector("[data-clear-button]")
const taskListContainer = document.querySelector("[data-task-list-container]")
const taskTitle = document.querySelector("[data-list-title]")
const taskCount = document.querySelector("[data-list-count]")
const taskContainer = document.querySelector("[data-tasks]")
const taskTemplate = document.querySelector("#task-template")
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = "task.selectedList"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListIdKey = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_ID_LIST_KEY
);

newListForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === "") return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === "") return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListIdKey)
  selectedList.tasks.push(task) 
  saveAndRender()
});


listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListIdKey = e.target.dataset.listId
    saveAndRender()
  }
});

taskContainer.addEventListener('click', e =>{
   if(e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedListIdKey)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
   }
})

deleteButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id != selectedListIdKey);
  selectedListIdKey = null
  saveAndRender();
});

clearButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListIdKey)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(),name: name,tasks: [], }
}

function createTask(name){
  return { id: Date.now().toString(),name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY, selectedListIdKey)
}

function render() {
  clearElement(listContainer)
  renderLists()

  const selectedList = lists.find((list) => list.id === selectedListIdKey)
  if (selectedListIdKey == null) {
    taskListContainer.style.display = "none"
  } else {
    taskListContainer.style.display = ""
    taskTitle.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(taskContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector("input")
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector("label")
    label.htmlFor = task.id
    label.append(task.name)
    taskContainer.appendChild(taskElement)
  });
}

function renderTaskCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length
  const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
  taskCount.innerText = ` ${incompleteTasksCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach((list) => {
    const listElemnt = document.createElement("li")
    listElemnt.dataset.listId = list.id
    listElemnt.classList.add("list-name")
    listElemnt.innerText = list.name
    if (list.id === selectedListIdKey) {
      listElemnt.classList.add("active-list")
    }
    listContainer.appendChild(listElemnt)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
render()