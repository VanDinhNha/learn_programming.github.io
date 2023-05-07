let arrRank = []
getAllRankMenu()//.catch(handleError);
async function getAllRankMenu(){
    const response = await fetch(urlClassify);
    const listClassify = await response.json();
    if(listClassify !== null){
        listClassify.forEach((item)=>{
            arrRank.push(item.RANK);
        });
    }
    closeLoad();
}

document.querySelector("#rank").addEventListener("keyup", debounceFn(function (e) {
    arrRank.includes(Number(e.target.value)) ? 
    document.querySelector("#rank").setAttribute("style", "border-color: red") : 
    document.querySelector("#rank").removeAttribute("style")
}, 500));

document.querySelector("#form_add_classify").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = this.elements["name"].value;
    const rank = this.elements["rank"].value;
    if(name === ""){
        showNotification('warning', 'chưa nhập tên');
        return;
    }
    if(rank === ""){
        showNotification('warning', 'chưa nhập cấp độ');
        return;
    }
    if(arrRank.includes(Number(rank))){
        if(confirm('cấp độ này đã tồn tại, bạn có muốn sắp sếp lại cấp độ menu không') === false){
            return;
        }
    }
    addMenu(name, rank).catch(handleError);
});

async function addMenu(name, rank){
    showLoad();
    const respomse = await fetch(urlClassify,{
        method: "POST",
        body: JSON.stringify({
           "NAME": name, "RANK": rank,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    closeLoad();
    respomse.status === 200 ? 
        showNotification('success', 'Thêm thành công') : 
        showNotification('error', 'Thêm thất bại')
}