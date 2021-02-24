import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

const Question = props => {
        if(props.page === "make") {
            if((!props.question.anB && !props.question.anC && !props.question.anD) && props.question.isOpen) {
                return(
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>
                        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>
                        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
			//xd
			//
			//
                        <label className="max-w-screen-lg xl:w-1/2 lg:w-2/3 md:w-2/3 w-full  xl:mx-1 lg:mx-1 md:mx-1 mx-5  xl:mt-8 lg:mt-8 md:md-6 mt-3  xl:py-4 lg:py-4 p-2  shadow-md bg-gray-100 rounded text-black flex flex-col items-center mb-5" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.answer.body}
                            <input type="checkbox" 
                                name={props.question.answer.id} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.answer.id, e);}}  
                                checked={[...props.question.correct].some(c => c === props.question.answer.id)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
                            <div className="text-center mb-2"><h5 className="m-0">{props.question.category}</h5></div>
                            <p className="m-0 text-center">{props.question.text}</p>
                            <FontAwesomeIcon 
                                icon={faTrash} style={{cursor: props.cursor, color: props.faColor, marginTop: "10px"}} 
                                onClick={() => {console.log("hello"); props.deleteQuestion(props.question.id, props.question.new)}}
                            />
                        </div>

                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anA}
                            <input type="checkbox" 
                                name={props.question.anA} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anA, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anA)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anB}
                            <input type="checkbox" 
                                name={props.question.anB} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anB, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anB)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
                            {props.question.anC}
                            <input type="checkbox" 
                                name={props.question.anC} 
                                onChange={(e) => {props.markAnswer(props.question.id, props.question.anC, e);}}  
                                checked={Array.from(props.question.correct).some(c => c === props.question.anC)}
                            />
                        </label>
        
                        <label className="p-3 text-dark d-flex justify-content-between align-items-center w-100" 
                            style={{backgroundColor: "#c5c6c6", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
                        <div className="text-dark p-3 mb-2 d-flex flex-column align-items-center question-box" style={{border: "none", backgroundColor: "#fdd400", boxShadow: "2px 2px 2px black"}}>
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
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
                    <section className="d-flex flex-column align-items-center my-3 question-section">
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
