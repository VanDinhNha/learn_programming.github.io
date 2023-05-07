let arrRank = [];
getAllRank(getUrlVars(url)["id-classify"]).catch(handleError);

async function getAllClassify(id){
    const list_classify = document.querySelector("#classify");
    const response = await fetch(urlClassify);
    const classify_item = await response.json();
    classify_item.forEach(item => {
        list_classify.innerHTML += `<option value="${item.ID}" ${
            item.ID === id ? "selected" : ""
        }>${item.NAME}</option>`
    });
    closeLoad();
}

async function getAllRank(id){
    const response = await fetch(urlRankMenu+id);
    arrRank = await response.json();
    showValueMenu(getUrlVars(url)["id-menu"]).catch(handleError);
}

async function showValueMenu(id){
    const response = await fetch(urlMenu + id);
    const data = await response.json();
    getAllClassify(data.ID_CLASSIFY_MENU).catch(handleError);
    document.querySelector("#name").value = data.NAME;
    document.querySelector("#rank").value = data.RANK;
    document.querySelector("#icon").value = data.ICON;
    document.querySelector(".review-icon").innerHTML = data.ICON;
    const index = arrRank.indexOf(Number(data.RANK));
    arrRank.splice(index, 1)
    closeLoad();
}

document.querySelector("#rank").addEventListener("keyup", debounceFn(function (e) {
    arrRank.includes(Number(rank.value)) ? 
    document.querySelector("#rank").setAttribute("style", "border-color: red") : 
    document.querySelector("#rank").removeAttribute("style")
}, 100))

document.querySelector('#icon').addEventListener('input', debounceFn(function (e) {
    document.querySelector(".review-icon").innerHTML = e.target.value;
}, 500))

document.querySelector("#form_edit_menu").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = this.elements["name"].value;
    const rank = this.elements["rank"].value;
    const icon = this.elements["icon"].value;
    const classify = this.elements["classify"].value;
    if(classify === "NONE" || classify === null){
        showNotification('warning', 'chưa chọn phân loại menu')
        return;
    }
    if(name === "" || name === null){
        showNotification('warning', 'chưa nhập tên');
        return;
    }
    if(rank === "" || rank === null){
        showNotification('warning', 'chưa nhập rank');
        return;
    }
    if(icon === "" || icon === null){
        showNotification('warning', 'chưa nhập icon');
        return;
    }
    if(arrRank.includes(Number(rank))){
        if(confirm('cấp độ này đã tồn tại, bạn có muốn sắp sếp lại cấp độ menu không') === false){
            return;
        }
    }
    editMenu(getUrlVars(url)["id-menu"], name, rank, icon, classify).catch(handleError);
});

async function editMenu(id, name, rank, icon, classify){
    showLoad();
    const respomse = await fetch(urlMenu,{
        method: "PATCH",
        body: JSON.stringify({
            "ID": id, "NAME": name, "RANK": rank, "ICON": icon, "ID_CLASSIFY_MENU": classify
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    closeLoad();
    respomse.status === 200 ? showNotification('success', 'Sửa thành công') : showNotification('error', 'Sửa thất bại')
}