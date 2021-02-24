import React from "react";
import {Link} from "react-router-dom";

const TaskToShow = props => {
    if(props.task.taskAuthor === window.sessionStorage.getItem("userName")) {
        return(
            <section className="d-flex flex-row align-items-center justify-content-between p-2 py-4 mx-auto my-1 mt-2 task-card-show" style={{backgroundColor: "#575656", color: "black", borderRadius: "6px"}}>
                <h5 className="pl-3 text-light w-25">{props.task.taskAuthor} - {props.task.taskTitle}</h5>
                <Link className="px-2 w-50" to={"/task/show/"+props.task._id}>{props.task.taskDesc.length < 320 ? props.task.taskDesc.replace(/^(.{320}[^\s]*).*/, "$1") : props.task.taskDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..."}</Link>
                
                <div className="pr-4 active-action-buttons">
                    <Link className="btn btn-primary text-dark action-button" to={"/task/show/"+props.task._id}>Weź udział</Link>
                    <Link className="btn btn-warning action-button" to={"/ranking/"+props.task._id}>Zobacz ranking</Link>
                    <Link className="btn btn-success action-button text-dark" to={"/task/edit/"+props.task._id}>Edytuj quiz</Link>
                </div>
            </section>
        );
    } else {
        return(
            <section className="d-flex flex-row align-items-center justify-content-between p-2 py-4 mx-auto my-1 mt-2 task-card-show" style={{backgroundColor: "#575656", color: "black", borderRadius: "6px"}}>
                <h5 className="pl-3 text-light w-25">{props.task.taskAuthor} - {props.task.taskTitle}</h5>
                <Link className="px-2 w-50" to={"/task/show/"+props.task._id}>{props.task.taskDesc.length < 320 ? props.task.taskDesc.replace(/^(.{320}[^\s]*).*/, "$1") : props.task.taskDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..."}</Link>
                
                <div className="pr-4 active-action-buttons">
                    <Link className="btn btn-primary text-dark action-button" to={"/task/show/"+props.task._id}>Weź udział</Link>
                    <Link className="btn btn-warning action-button" to={"/ranking/"+props.task._id}>Zobacz ranking</Link>
                </div>
            </section>
        );
    }
}; export default TaskToShow;