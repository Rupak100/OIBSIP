// selectors :
const inp=document.querySelector(".ToDo-input");
const butt=document.querySelector(".ToDo-button");
const list=document.querySelector(".todo-List");


//eventListenors :
butt.addEventListener("click",addToDo);
list.addEventListener("click",deleteToDo);


//functions :
function addToDo(event) {
    console.log("lbsdkjcbjSD");
    event.preventDefault();
    //creating ToDo div
    const toDoDiv=document.createElement("div");
    toDoDiv.classList.add("toDo");
    //list Item
     const newToDo=document.createElement('li');
     newToDo.innerText=inp.value;
     newToDo.classList.add("toDo-item");
     toDoDiv.appendChild(newToDo);
     //buttons:
     const completeBtn=document.createElement('button');
     
     completeBtn.innerHTML='<i class="fas fa-check"></i>';
     completeBtn.classList.add("complete-btn");
     toDoDiv.appendChild(completeBtn);
     //trash button :
     const trashBtn=document.createElement('button');
     trashBtn.innerHTML='<i class="fas fa-trash"></i>';
     trashBtn.classList.add("trash-btn");
     toDoDiv.appendChild(trashBtn);
     //append the three attribute into toDo list:
     list.appendChild(toDoDiv);
     inp.value="";

}
function deleteToDo(e) {
    const item=e.target;
    if(item.classList[0]==="trash-btn"){
        const todo=item.parentElement;
        // const xfgx=item.parentElement;
        todo.classList.add("fall");
       todo.addEventListener("transitionend",function(){
        todo.remove();
       });


    }
    if(item.classList[0]==="complete-btn"){
        const todo=item.parentElement;
        // const xfgx=item.parentElement;
        // todo.remove();
        todo.classList.toggle("completed")


    }
}

