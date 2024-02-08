import React, { useState } from 'react';

function Login(props){
    const [user,setUser]=useState({
        email:"",
        password:""
    });
    function handleInputChange(event){
        const {name,value}=event.target;
        setUser((prevValue)=>{
            return {
                ...prevValue,
                [name]:value
            };
        });
    }
    function handleSubmit(event){
        event.preventDefault();
        props.onSubmit(user);
    }
    return (
        <div className="container">
      <div className="heading">
      <h1>To-Do List</h1>
      </div>
      <div className="form">
      <form onSubmit={handleSubmit}>
            <h3>Email:</h3>
          <input type="text" name="email" value={user.email} onChange={handleInputChange} />
          <h3>Password:</h3>
          <input type="password" name="password" value={user.password} onChange={handleInputChange} />
        <button type="submit">
          <span>Submit</span>
        </button>
      </form>
      </div>
    </div>
    )

}

export default Login;