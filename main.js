function fillTable(data) {
    let members = data.results[0].members;
    let tbody = document.getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    for (let i = 0; i < members.length; i++) {
        addRow(tbody, members[i])
    }
}

function addRow(tbody, member) {
    let newRow = tbody.insertRow();
    addLinkCell(newRow, member.last_name + " " + member.first_name, member.url)
    addTextCell(newRow, member.party)
    addTextCell(newRow, member.state)
    addTextCell(newRow, member.seniority)
    addTextCell(newRow, member.votes_with_party_pct)
}

function addTextCell(newRow, text) {
    let newCell = newRow.insertCell();
    let newText = document.createTextNode(text);
    newCell.appendChild(newText);
}

function addLinkCell(newRow, text, href) {
    let newCell = newRow.insertCell();
    let a = document.createElement('a');
    let link = document.createTextNode(text);
    a.appendChild(link);
    a.href = href
    newCell.appendChild(a);
}

function getAllStates() {
    let members = data.results[0].members;
    let states = members.map(member => member.state)
    return [...new Set(states)]
}

function fillSelectState() {
    let states = getAllStates();
    let select = document.getElementById('select-state');

    // Default option
    let option = document.createElement('option');
    option.innerHTML = "";
    select.appendChild(option);

    states.forEach(state => {
        let option = document.createElement('option');
        option.innerHTML = state;
        select.appendChild(option);
    });
}

function filter(event) {
    let filteredData = JSON.parse(JSON.stringify(data));
    let state = document.getElementById('select-state').value;

    let checkbox_r = document.getElementById('checkbox-r').checked;
    let checkbox_r_value = checkbox_r ? "R" : "";
    let checkbox_d = document.getElementById('checkbox-d').checked;
    let checkbox_d_value = checkbox_d ? "D" : "";
    let checkbox_i = document.getElementById('checkbox-i').checked;
    let checkbox_i_value = checkbox_i ? "I" : "";

    if (state != "") {
        let filteredMembers = filteredData.results[0].members.filter(member => member.state == state);
        filteredData.results[0].members = filteredMembers;
        fillTable(filteredData);
    }

    if (checkbox_r || checkbox_d || checkbox_i) {
        let filteredMembers = filteredData.results[0].members.filter(member => member.party == checkbox_r_value || member.party == checkbox_d_value || member.party == checkbox_i_value);
        filteredData.results[0].members = filteredMembers;
        fillTable(filteredData);
    }

    if (state == "" || !checkbox_r || !checkbox_d || !checkbox_i) {
        fillTable(filteredData);
    }
}

fillTable(data);
fillSelectState();




