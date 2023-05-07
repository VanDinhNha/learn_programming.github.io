let arrRank = [];
loadAllClassify().catch(handleError);

async function loadAllClassify(){
    const response = await fetch(urlClassify);
    const data = await response.json();
    if(data !== null){
        data.forEach((item)=>{
            arrRank.push(item.RANK);
        });
    }
    showValueMenu(getUrlVars(url)["id"]).catch(handleError);
}

async function showValueMenu(id){
    const response = await fetch(urlClassify + id);
    const data = await response.json();
    document.querySelector("#name").value = data.NAME;
    document.querySelector("#rank").value = data.RANK;
    const index = arrRank.indexOf(Number(data.RANK));
    arrRank.splice(index, 1)
    closeLoad();
}

document.querySelector("#rank").addEventListener("keyup", debounceFn(function (e) {
    arrRank.includes(Number(rank.value)) ? 
    document.querySelector("#rank").setAttribute("style", "border-color: red") : 
    document.querySelector("#rank").removeAttribute("style")
}, 100))

document.querySelector("#form_edit_classify").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = this.elements["name"].value;
    const rank = this.elements["rank"].value;
    if(name === "" || name === null){
        showNotification('warning', 'chưa nhập tên');
        return;
    }
    if(rank === "" || rank === null){
        showNotification('warning', 'chưa nhập rank');
        return;
    }
    if(arrRank.includes(Number(rank))){
        if(confirm('cấp độ này đã tồn tại, bạn có muốn sắp sếp lại cấp độ menu không') === false){
            return;
        }
    }
    editMenu(getUrlVars(url)["id"], name, rank).catch(handleError);
});

async function editMenu(id, name, rank){
    showLoad();
    const respomse = await fetch(urlClassify,{
        method: "PATCH",
        body: JSON.stringify({
            "ID": id, "NAME": name, "RANK": rank
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    closeLoad();
    respomse.status === 200 ? showNotification('success', 'Sửa thành công') : showNotification('error', 'Sửa thất bại')
}