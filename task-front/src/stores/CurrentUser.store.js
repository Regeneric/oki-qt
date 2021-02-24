const CurrentUser = (() => {
    let fn = '';

    const getName = () => (fn);
    const setName = name => {fn = name};

    return {
        getName: getName,
        setName: setName,
    };
})(); export default CurrentUser;