import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

const Question = props => {
        if(props.page === "make") {
            if((!props.question.anB && !props.question.anC && !props.question.anD) && props.question.isOpen) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>
                        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e)}}
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
                    </section>
                );
            }


            if(!props.question.anC && !props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>
                        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
                    </section>
                );
            }
        
            if(props.question.anC && !props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anC}
                            <input type="checkbox" 
                                name={props.question.anC} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anC, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anC)}
                            />
                        </label>
                    </section>
                );
            }
        
            if(!props.question.anC && props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anD}
                            <input type="checkbox" 
                                name={props.question.anD} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anD, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anD)}
                            />
                        </label>
                    </section>
                );
            }
        
            if(props.question.anC && props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anC}
                            <input type="checkbox" 
                                name={props.question.anC} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anC, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anC)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{minWidth: "50vw", backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anD}
                            <input type="checkbox" 
                                name={props.question.anD} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anD, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anD)}
                            />
                        </label>
                    </section>
                );
            }
        } else if(props.page === "take") {
            if(props.question.isOpen) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black", width: "50vw"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                        </div>
                        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            <input type="text" 
                                className="w-100"
                                placeholder="Odpowiedź..."
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswerOpen(props.question.id, props.question.anA, e)}}                      
                            />
                        </label>
                    </section>
                );
            }


            if(!props.question.anC && !props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e)}}                      
                            />
                        </label>
                    </section>
                );
            }
        
            if(props.question.anC && !props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anC}
                            <input type="checkbox" 
                                name={props.question.anC} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anC, e)}}                      
                            />
                        </label>
                    </section>
                );
            }
        
            if(!props.question.anC && props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anD}
                            <input type="checkbox" 
                                name={props.question.anD} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anD, e)}}                      
                            />
                        </label>
                    </section>
                );
            }
        
            if(props.question.anC && props.question.anD) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 ">
                        <div className="text-dark p-3 mb-2 d-flex flex-column question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anC}
                            <input type="checkbox" 
                                name={props.question.anC} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anC, e)}}                      
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100 answer-box" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anD}
                            <input type="checkbox" 
                                name={props.question.anD} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anD, e)}}                      
                            />
                        </label>
                    </section>
                );
            }
        }
}; export default Question;