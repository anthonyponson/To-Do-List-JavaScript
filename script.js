const listContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteButton = document.querySelector('[data-delete-button]')
const clearButton = document.querySelector('[data-clear-button]')
const taskListContainer = document.querySelector('[data-task-list-container]')
const taskTitle = document.querySelector('[data-list-title]')
const taskCount = document.querySelector('[data-list-count]')
const taskContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.querySelector('#task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = 'task.selectedList'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListIdKey = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY)

let isEditMode = false
let editTaskId = null

// add new list form
newListForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

// add new task form

newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return

  if (isEditMode) {
    // Editing an existing task
    updateTask(taskName)
  } else {
    // Adding a new task
    const task = createTask(taskName)
    const selectedList = lists.find((list) => list.id === selectedListIdKey)
    selectedList.tasks.push(task)
  }

  // Reset edit mode and task ID
  isEditMode = false
  editTaskId = null

  newTaskForm.reset()
  saveAndRender()
})

// select list
listContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListIdKey = e.target.dataset.listId
    saveAndRender()
  }
})

// select task
taskContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find((list) => list.id === selectedListIdKey)
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    )
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

//delete tasks container

deleteButton.addEventListener('click', (e) => {
  lists = lists.filter((list) => list.id != selectedListIdKey)
  selectedListIdKey = null
  saveAndRender()
})

// clear completed task
clearButton.addEventListener('click', (e) => {
  const selectedList = lists.find((list) => list.id === selectedListIdKey)
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete)
  saveAndRender()
})

// create new list id
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}
// create new task id
function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

// save in local storage

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY, selectedListIdKey)
}

// task list render

function render() {
  clearElement(listContainer)
  renderLists()

  const selectedList = lists.find((list) => list.id === selectedListIdKey)
  if (selectedListIdKey == null) {
    taskListContainer.style.display = 'none'
  } else {
    taskListContainer.style.display = ''
    taskTitle.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(taskContainer)
    renderTasks(selectedList)
  }
}

// render tasks
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)

    // Add delete button
    const deleteButton = taskElement.querySelector('.delete-button')
    deleteButton.addEventListener('click', () => {
      deleteTask(selectedList, task.id)
      saveAndRender()
    })

    function deleteTask(selectedList, taskId) {
      selectedList.tasks = selectedList.tasks.filter(
        (task) => task.id !== taskId
      )
    }

    // Add edit button
    const editButton = taskElement.querySelector('.edit-button')
    editButton.addEventListener('click', () => {
      editTask(selectedList, task.id)
      saveAndRender()
    })

    taskContainer.appendChild(taskElement)
  })
}

function editTask(selectedList, taskId) {
  isEditMode = true
  editTaskId = taskId

  const task = selectedList.tasks.find((task) => task.id === taskId)
  if (task) {
    newTaskInput.value = task.name
    newTaskInput.focus()
  }
}

function updateTask(newName) {
  const selectedList = lists.find((list) => list.id === selectedListIdKey)
  const task = selectedList.tasks.find((task) => task.id === editTaskId)
  if (task) {
    task.name = newName
  }
}

// create task count
function renderTaskCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length
  const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks'
  taskCount.innerText = ` ${incompleteTasksCount} ${taskString} remaining`
}

// render lists

function renderLists() {
  lists.forEach((list) => {
    const listElemnt = document.createElement('li')
    listElemnt.dataset.listId = list.id
    listElemnt.classList.add('list-name')
    listElemnt.innerText = list.name
    if (list.id === selectedListIdKey) {
      listElemnt.classList.add('active-list')
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

