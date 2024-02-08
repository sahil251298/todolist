import React,{useState} from "react";


function Item(props){
    const [value,setValue]=useState(props.itemName);
    const [editMode,setEditMode]=useState(false);
    function handleInputChange(event){
        setValue(event.target.value);
    }
    return (
        (editMode)?
        <div className="form">
        <form onSubmit={(event)=>{
            event.preventDefault();
            props.onSubmit(props.id,value);
            setEditMode(false);
        }}>
          <input type="text" value={value}  onChange={handleInputChange} />
        <button type="submit"><span>Done</span></button>
      </form>
      </div>
       :
       <div className="item-container">
        <input 
    type="checkbox"
    onChange={()=>{
        props.onDelete(props.id);
    }}
  />
        <li>{props.itemName}</li>
      <span
            className="edit-symbol"
            onClick={() => {
              setEditMode(true);
            }}
          >
            ✎ 
          </span>
       </div>
       
    )
}

export default Item;