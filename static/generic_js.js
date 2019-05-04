function deepCopy(data) {
    let copy;

    if (data === null) {
        copy = null;

    } else if (Object.prototype.toString.call(data) == '[object Array]') {
        copy = [];
        data.forEach((item, index) => copy.push(deepCopy(item)));

    } else if (typeof data == 'object') {
        copy = {};
        Object.keys(data).forEach(key => copy[key]=deepCopy(data[key]));

    } else {
        copy = data;

    }
    return copy;
}


async function request(url='', method, token=null, data={}, onSuccess=null, onFail=null) {

    //define arguments
    let kwargs = {
        method: method, 
        mode: 'cors', 
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        }
    }

    //add body in arguments
    if (method.toUpperCase()!=='GET') 
        Object.assign(kwargs, {body: JSON.stringify(data)});

    //make request
    try {
        let response = await fetch(url, kwargs);
        let status = response.status;
        data = await response.json();
        if (status>=200 && status<=299)
            onSuccess && onSuccess(status, data);
        else
            throw ({status:status, message:data});

    //handle errors
    } catch(err) { 
        alert(err.status+':'+JSON.stringify(err.message));
        onFail && onFail(err.status, err.message);
    }

}