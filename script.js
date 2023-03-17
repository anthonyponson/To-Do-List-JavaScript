const taskContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteButton = document.querySelector('[data-delete-button]')
const clearButton = document.querySelector('[data-clear-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = 'task.selectedList'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] 
let selectedListIdKey = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY)

newListForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const listName = newListInput.value
  if(listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null 
  lists.push(list)
  saveAndRender()
})

taskContainer.addEventListener('click', e =>{
  if(e.target.tagName.toLowerCase() === 'li'){
    selectedListIdKey = e.target.dataset.listId
    saveAndRender()
  }
})


deleteButton.addEventListener('click', e =>{
  lists = lists.filter(list => list.id != selectedListIdKey)
  selectedListIdKey = null
  saveAndRender()
})

function createList(name){
 return { id: Date.now().toString(), name: name, tasks:[] }
}

function saveAndRender(){
  save()
  render()
}

function save(){
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY , selectedListIdKey)
}

function render() {
  clearElement(taskContainer)
  lists.forEach((list) => {
    const listElemnt = document.createElement('li')
    listElemnt.dataset.listId = list.id
    listElemnt.classList.add('list-name')
    if(list.id === selectedListIdKey){
      listElemnt.classList.add('active-list')
    }
    listElemnt.innerText = list.name
    taskContainer.appendChild(listElemnt)
  })
}

function clearElement(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
  }

}
render()
