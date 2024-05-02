const PROD_SERVER_ADRESS = "https://example.onrender.com";
const TEST_SERVER_ADRESS = "http://localhost:3001";

type StringIndexedObject<T> = {[key: string]: T}; // whatthefuck
export type StringObject = StringIndexedObject<string>;

export const bindInput = (callback: CallableFunction) => {
    return (e: any) => { // todo: fix explicit any (will never fix lol)
        e.target.value = e.target.value.toUpperCase();
        e.target.value = e.target.value.replace(/[^A-Z0-9]/g, "");
        callback(e.target.value);
    };
};

export const createRequestForm = (endpoint: string, params: StringObject) => {
    let form = TEST_SERVER_ADRESS + "/" + endpoint + "?";
    for (const [name, value] of Object.entries(params)) {
      form += name + "=" + value + "&";
    }
    // if (["?", "&"].includes(form[form.length - 1])) {
    //   form = form.substring(0, form.length - 1);
    // }
    if (form[-1] === "&" || form[-1] === "?") { // prevents fail condition
        form = form.substring(0, form.length - 1);
    }
    return form;
};

export const queryBackend = (endpoint: string, params: StringObject, callback: CallableFunction) => {

    const form = createRequestForm(endpoint, params);
    fetch(form).then(response => {

        response.json().then(unpacked => {;

            console.log("QueryBackend ResponseStatus: " + response.status);
            console.log("QueryBackend ResponseJSON: " + JSON.stringify(unpacked));

            if (response.status >= 200 && response.status <= 300) { // successful responses, should include 100s too? 
                callback(unpacked);
            } else {
                alert(" " + (unpacked.error ?? "No error message") + " (" + response.status + ")");
            }
        });
    });
}

// const unpacked = response.json();

// console.log("QueryBackend ResponseStatus: " + response.status);
// console.log("QueryBackend ResponseJSON: " + unpacked);

// if (response.status === 200) {
//     unpacked.then(data => {
//         callback(data);
//     });
// } else {
//     unpacked.then(data => {
//         alert("Error " + response.status + " -- " + (data.error ?? "No error message"));
//     });
// }


