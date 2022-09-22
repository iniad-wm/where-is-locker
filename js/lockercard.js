function makeBasicAuth(userid, userpw) {
    let token = userid + ':' + userpw;
    let hash = btoa(token);
    return "Basic " + hash;
}

function handleErrors(response) {
    if (response.status >= 500 && response.status <= 599) {
        let error = {
            status: response.status,
            statusText: response.statusText
        };
        throw (error);
    }
    return response.json();
}

function callLockerPositionAPI(url, method, userid, userpw, callback) {
    fetch(url, {
            method: method,
            headers: {
                'Authorization': makeBasicAuth(userid, userpw)
            }
        })
        .then(handleErrors)
        .then(function (json) {
            if ('status' in json) {
                if (json.status === 'error') {
                    let error = {
                        status: json.status,
                        statusText: json.description
                    };
                    throw (error);
                }
            }
            callback({
                status: 'success',
                description: 'Succeeded getting locker information',
                lockerAddress: json.name,
                lockerFloor: json.floor
            });
        })
        .catch(function (error) {
            if (error.status === 503) {
                callback({
                    status: 'success',
                    description: 'Below is dummy data for test purposes',
                    lockerAddress: "32XXXX",
                    lockerFloor: "3"
                });
            } else {
                callback({
                    status: 'fail',
                    description: '[Error] ' + error.statusText,
                    lockerAddress: null,
                    lockerFloor: null
                });
            }
        });
}

function callRegisteredIccardAPI(url, method, userid, userpw, callback) {
    fetch(url, {
            method: method,
            headers: {
                'Authorization': makeBasicAuth(userid, userpw)
            }
        })
        .then(handleErrors)
        .then(function (json) {
            console.log(json);
            if ('status' in json) {
                if (json.status === 'error') {
                    let error = {
                        status: json.status,
                        statusText: json.description
                    };
                    throw (error);
                }
            }
            callback({
                status: 'success',
                description: 'Succeeded getting IC card information',
                iccardId: json[0].uid,
                iccardComment: json[0].comment
            });
        })
        .catch(function (error) {
            if (error.status === 503) {
                callback({
                    status: 'success',
                    description: 'Below is dummy data for test purposes',
                    iccardId: "XXXXXXXXXXXXXXXX",
                    iccardComment: "dummy comment"
                });
            } else {
                callback({
                    status: 'fail',
                    description: '[Error] ' + error.statusText,
                    iccardId: null,
                    iccardComment: null
                });
            }
        });
}

function callIccardAPI(url, method, data, userid, userpw, callback) {
    let newUrl = url;
    let successMsg = 'Succeeded registering IC card';
    if (method == 'DELETE') {
        newUrl += '/1';
        successMsg = 'Succeeded deleting IC card';
    }
    console.log(data);
    fetch(newUrl, {
            method: method,
            headers: {
                'Authorization': makeBasicAuth(userid, userpw),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
        .then(handleErrors)
        .then(function (json) {
            if ('status' in json) {
                if (json.status === 'error') {
                    let error = {
                        status: json.status,
                        statusText: json.description
                    };
                    throw (error);
                }
            }
            callback({
                status: 'success',
                description: successMsg,
            });
        })
        .catch(function (error) {
            if (error.status === 503) {
                if ((method.toUpperCase() === "POST") && data.uid && data.comment) {
                    callback({
                        status: 'success',
                        description: "This is a dummy message for registering IC card",
                    });
                } else if (method.toUpperCase() === "DELETE") {
                    callback({
                        status: 'success',
                        description: "This is a dummy message for deleting IC card",
                    });
                } else {
                    callback({
                        status: 'fail',
                        description: "[Error] Bad or Invalid Request",
                    });
                }
            } else {
                callback({
                    status: 'fail',
                    description: '[Error] ' + error.statusText,
                    lockerAddress: null,
                    lockerFloor: null
                });
            }
        });
}

function getRegisteredIccard() {
    let BASE_URL = "https://edu-iot.iniad.org/api/v1";
    let userid = document.getElementById('user').value;
    let userpw = document.getElementById('pass').value;
    let url = BASE_URL + "/iccards";
    callRegisteredIccardAPI(url, 'GET', userid, userpw, displayIccardInformation);
    console.log("getRegisteredIccard() called");

}



function displayIccardInformation(result) {
    let iccardId = document.getElementById("card-id");
    let iccardComment = document.getElementById("comment");
    if (result.status === "success") {
        iccardId.textContent = result.iccardId;
        iccardComment.textContent = result.iccardComment;
    } else {
        iccardId.textContent = "none";
        iccardComment.textContent = "none";
    }
}