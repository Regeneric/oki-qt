import React from "react";

const TaskInputForm = props => {
    const toolTipsCSS = `#tooltip-login, #tooltip-password {
        visibility: hidden;
        background-color: #222;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        overflow-wrap: break-word;
        position: fixed;
        z-index: 999;
        max-width: 385px;
    }`;

    return(
        <section className="mx-3 text-center">
            <div class="input-group mt-4">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Tytuł zadania</span>
                    </div>
                </div>
                <input className="form form-control" type="text" placeholder="Tytuł zadania..."
                    value={props.state.taskTitle}
                    onChange={props.onChangeTitle}
                />
            </div>



            <section className="d-flex flex-column mt-2 w-100">
                <div class="input-group mt-1">
                    <div class="input-group-prepend">
                        <div class="input-group-text" id="login-info">
                            ?
                            <span id="tooltip-login">Tagi zadania <wbr/>(minimum 3, oddziel spacją)</span>
                        </div>
                    </div>
                    <input 
                        className="form form-control"
                        type="text"
                        placeholder="Tagi... (oddziel spacją)"
                        onChange={props.onChangeTags}
                    />
                </div>

                <div class="input-group mt-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text" id="login-info">
                            ?
                            <span id="tooltip-login">Poziom trudności (1-5)</span>
                        </div>
                    </div>
                    <input 
                        className="form form-control"
                        type="number"
                        placeholder="Poziom trudności... (1-5)"
                        value={props.state.difficultyLevel}
                        onChange={props.onChangeDifficulty}
                    />
                </div>
            </section>

            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Czas działania (ms)</span>
                    </div>
                </div>
                <input 
                    className="form form-control"
                    type="number"
                    placeholder="Czas działania... (ms)"
                    value={props.state.runTime}
                    onChange={props.onChangeRunTime}
                />
            </div>

            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Krótki opis zadania</span>
                    </div>
                </div>
                <textarea 
                    className="form-control"
                    type="text"
                    placeholder="Krótki opis zadania..."
                    value={props.state.taskDesc}
                    onChange={props.onChangeDesc}
                />
            </div>

            <section className="d-flex mt-4 w-100 task-input-buttons">
                <div>
                    <input 
                        className="d-none"
                        type="file"
                        accept=".pdf"
                        name="task-body"
                        id="task-body"
                        onChange={props.onChangeSingleFile}
                    />
                    <label htmlFor="task-body" className="d-flex align-items-center justify-content-center btn btn-primary text-dark py-2">
                        <p className="p-2 m-0 ">{props.state.taskLabel}</p>
                    </label>

                    <input 
                        className="d-none"
                        type="file"
                        accept=".cpp"
                        name="cpp-code"
                        id="cpp-code"
                        onChange={props.onChangeSingleFile}
                    />
                    <label htmlFor="cpp-code" className="d-flex align-items-center justify-content-center btn btn-primary text-dark py-2">
                        <p className="p-2 m-0 ">{props.state.codeLabel}</p>
                    </label>
                </div>
                <div>
                    <input 
                        className="d-none"
                        type="file"
                        accept=".in"
                        multiple
                        name="in-files"
                        id="in-files"
                        onChange={props.onChangeMultipleFiles}
                    />
                    <label htmlFor="in-files" className="d-flex align-items-center justify-content-center btn btn-warning text-dark py-2">
                        <p className="p-2 m-0 ">{props.state.inFilesLabel}</p>
                    </label>

                    <input 
                        className="d-none"
                        type="file"
                        accept=".out"
                        multiple
                        name="out-files"
                        id="out-files"
                        onChange={props.onChangeMultipleFiles}
                    />
                    <label htmlFor="out-files" className="d-flex align-items-center justify-content-center btn btn-warning text-dark py-2">
                        <p className="p-2 m-0 ">{props.state.outFilesLabel}</p>
                    </label>
                </div>
            </section>

            <div className="d-flex flex-column align-items-center">
                <p className="p-0 m-0 my-2 text-light">Zadanie publiczne</p>
                <input type="checkbox" checked={props.state.isPublic} onChange={props.onChangePublic} />
            </div>
        </section>
    );
}; export default TaskInputForm;