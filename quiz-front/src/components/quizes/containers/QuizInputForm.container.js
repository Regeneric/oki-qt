import React from "react";

const QuizInputForm = props => {
    const categories = () => {
        let sorted = props.state.publicQuestions.map(pq => pq.qstCategory);
        sorted = [...new Set(sorted)];

        return(<select 
            className="form-control mt-4 quiz-input-form-right w-100"
            onChange={props.onChangeCategory}>
                <option value='' selected disabled hidden>Wybierz kategorię</option>
                {sorted.map(pq => (
                    pq.length > 50 
                        ? <option>{pq.replace(/^(.{50}[^\s]*).*/, "$1")+"..."}</option>
                        : <option>{pq.replace(/^(.{50}[^\s]*).*/, "$1")}</option>
                ))}
        </select>);
    };

    const questions = () => {
        const unique = props.state.publicQuestions.filter((v, i, s) => s.map(x => x.qstBody).indexOf(v.qstBody) == i);

        return(<select 
            className="form-control mt-2 quiz-input-form-right w-100"
            onChange={props.onChangePublicQuestion}>
                <option value='' selected disabled hidden>Wybierz pytanie</option>
                {unique.map(pq => pq.qstCategory === props.state.category ? 
                    <option title={pq.qstBody}>{pq.qstBody.replace(/^(.{45}[^\s]*).*/, "$1")}</option> : 
                    null)}  
        </select>);
    };

    if(!props.state.isQuestionOpen) {
        return(
            <section className="d-flex flex-column align-items-center">
                <section className="my-3 d-flex quiz-input-form-container">
                    <section className="mx-3 text-center">
                        <input 
                            className="form-control mt-4"
                            type="text"
                            placeholder="Kategoria..."
                            value={props.state.category}
                            onChange={props.onChangeCategory}
                        />
    
                        <textarea 
                            className="form-control mt-2"
                            type="text"
                            placeholder="Nowe pytanie..."
                            value={props.state.question}
                            onChange={props.onChangeQuestion}
                        />
    
                        <section className="d-flex mt-4 w-100">
                            <input 
                                className="form-control mr-2"
                                type="text"
                                placeholder="Odpowiedź A... (Wymagane)"
                                value={props.state.anA}
                                onChange={props.onChangeAnswer}
                                name="a"
                            />
    
                            <input 
                                className="form-control ml-2"
                                type="text"
                                placeholder="Odpowiedź B... (Wymagane)"
                                value={props.state.anB}
                                onChange={props.onChangeAnswer}
                                name="b"
                            />
                        </section>
    
                        <section className="d-flex mt-2 w-100">
                            <input 
                                className="form-control mr-2"
                                type="text"
                                placeholder="Odpowiedź C... (Opcjonalne)"
                                value={props.state.anC}
                                onChange={props.onChangeAnswer}
                                name="c"
                            />
    
                            <input 
                                className="form-control ml-2"
                                type="text"
                                placeholder="Odpowiedź D... (Opcjonalne)"
                                value={props.state.anD}
                                onChange={props.onChangeAnswer}
                                name="d"
                            />
                        </section>
    
                        <div className="d-flex flex-column align-items-center">
                            <p className="p-0 m-0 mt-4 mb-3 text-light">Pytanie otwarte</p>
                            <input type="checkbox" checked={props.state.isQuestionOpen} onChange={props.onChangeQuestionOpen} disabled />
    
                            <button type="button" name="new" className="btn btn-primary mt-4 mb-3" onClick={props.onClickAddQuestion}>Dodaj pytanie</button>
                        </div>
                    </section>
    
                    <section className="mx-3 text-center">
                        {categories()}
    
                        {questions()}
    
                        <button type="button" name="exist" className="btn btn-primary mt-4 mb-3" onClick={props.onClickAddQuestion}>Wybierz pytanie</button>
                    </section>
                </section>
    
            </section>
        );
    } else {
        return(
            <section className="d-flex flex-column align-items-center">
                <section className="my-3 d-flex">
                    <section className="mx-3 text-center">
                        <input 
                            className="form-control mt-4 w-100"
                            type="text"
                            placeholder="Kategoria..."
                            value={props.state.category}
                            onChange={props.onChangeCategory}
                        />
    
                        <textarea 
                            className="form-control mt-2"
                            type="text"
                            placeholder="Nowe pytanie..."
                            value={props.state.question}
                            onChange={props.onChangeQuestion}
                        />
    
                        <section className="d-flex mt-4 w-100">
                            <input 
                                className="form-control mr-2"
                                type="text"
                                placeholder="Odpowiedź... (Wymagane)"
                                value={props.state.anA}
                                onChange={props.onChangeAnswer}
                                name="a"
                            />

                            <input 
                                className="form-control ml-2"
                                type="text"
                                placeholder="Odpowiedź... (Opcjonalne)"
                                value={props.state.anB}
                                onChange={props.onChangeAnswer}
                                name="b"
                                disabled
                            />
                        </section>

                        <section className="d-flex mt-2 w-100">
                            <input 
                                className="form-control mr-2"
                                type="text"
                                placeholder="Odpowiedź... (Opcjonalne)"
                                value={props.state.anC}
                                onChange={props.onChangeAnswer}
                                name="c"
                                disabled
                            />

                            <input 
                                className="form-control ml-2"
                                type="text"
                                placeholder="Odpowiedź... (Opcjonalne)"
                                value={props.state.anD}
                                onChange={props.onChangeAnswer}
                                name="d"
                                disabled
                            />
                        </section>
    
                        <div className="d-flex flex-column align-items-center">
                            <p className="p-0 m-0 mt-4 mb-3 text-light">Pytanie otwarte</p>
                            <input type="checkbox" checked={props.state.isQuestionOpen} onChange={props.onChangeQuestionOpen} />
    
                            <button type="button" name="new" className="btn btn-primary mt-4 mb-3" onClick={props.onClickAddQuestion}>Dodaj pytanie</button>
                        </div>
                    </section>
    
                    <section className="mx-3 text-center">
                        {categories()}
    
                        {questions()}
    
                        <button type="button" name="exist" className="btn btn-primary mt-4 mb-3" onClick={props.onClickAddQuestion}>Wybierz pytanie</button>
                    </section>
                </section>
    
            </section>
        );
    }
}; export default QuizInputForm;