// src/App.js
import React, { useEffect, useState } from 'react';
import Item from './Item';
import Login from "./Login";

var  user={email:"",password:""};
function App() {
  const [items, setItems] = useState([]);
  const [newItem,setNewItem]=useState("");
  const [isLoggedIn,setisLoggedIn]=useState(false);


   async function fetchData() {
    console.log("Fetch data called");
    console.log("Email:",user.email);
    try {
      const apiUrl = 'http://localhost:8000/getItems';
    const queryParams = {
      email: user.email
    };

    const url = new URL(apiUrl);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

      const response = await fetch(url);
      const data =   await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async function handleEdit(id,value){
    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('item', value);
    formData.append('email',user.email);
    console.log(formData)
    const response =  await fetch('http://localhost:8000/updateItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      console.log(response);
      if(response.ok){
        console.log("Update successful")
      }
      else if(response.status===400||response.status===422){
        alert("Item name cannot be empty")
      }
      else{
        alert("Error in Updation. Try again");
      }
      setItems([]);
      fetchData();
  }
  async function handleDelete(id){
    const formData = new URLSearchParams();
      formData.append('id', id);
      formData.append('email',user.email);
      const response =  await fetch('http://localhost:8000/deleteItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if(response.ok){
        console.log("Ok")
      }
      else{
        alert("Error in deletion. Try again");
      }
      console.log("Deleted");
      fetchData();
  }
  function handleInputChange(event){
    setNewItem(event.target.value);
  }
   async function handleSubmit(event) {
    event.preventDefault();

    const formData = new URLSearchParams();
      formData.append('item', newItem);
      console.log("Email in handleSubmit",user.email);
      formData.append('email',user.email);
      const response =  await fetch('http://localhost:8000/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if(response.ok){
        console.log("Ok")
      }
      else if(response.status===400||response.status===422){
        alert("Item name cannot be empty")
      }
      else{
        alert("Internal error. Try again");
      }
      fetchData();
      setNewItem("");

  };
  async function handleLogin(User){
    const formData = new URLSearchParams();
    formData.append('email', User.email);
      formData.append('password',User.password);
      const response =  await fetch('http://localhost:8000/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
    if(response.ok){
      setisLoggedIn(true);
      console.log("Email entered:",User.email);
    user.email=User.email;
    user.password=User.password;
    console.log(user);
    fetchData();
    }
    else{
      alert("Incorrect credentials");
    }
  }
  

  return (

    (isLoggedIn)?
    <div className="container">
      <div className="heading">
      <h1>To-Do List</h1>
      </div>
      <div className="form">
      <form onSubmit={handleSubmit}>
          <input type="text" value={newItem} onChange={handleInputChange} />
        <button type="submit">
          <span>Add</span>
        </button>
      </form>
      </div>
      <ul>
        {items.map((item) => (
          <div>
            <Item key={(item.id)?item.id:item._id} id={(item.id)?item.id:item._id}  itemName={item.item}  onSubmit={handleEdit} onDelete={handleDelete} />
            </div>
          
        ))}
      </ul>
    </div>:<Login onSubmit={handleLogin}/>
  );
}

export default App;
