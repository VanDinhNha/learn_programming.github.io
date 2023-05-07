
let arrClassify = [];

function showTableMenu(i, ID, ICON, NAME, RANK, ID_CLASSIFY){
    let template = `<tr id="item_menu_${ID}">
        <td>${i+1}</td>
        <td>${NAME}</td>
        <td>${RANK}</td>
        <td>
            <span style="display: flex; justify-content: center;">${ICON}</span>
            </td>
        <td>
            <a href="/admin/menu/edit-menu.html?id-classify=${ID_CLASSIFY}&id-menu=${ID}" target="_blank" class="btn bg-green">sửa</a>
            <button onclick="showModal('${ID}','Xóa Menu', 'Bạn có chắc muốn xóa menu ${NAME} không ?');" class="btn bg-red">Xóa</button>
        </td>
    </tr>`;
    document.querySelector("#table_menu").childNodes[3].innerHTML += template;
}

async function loadDataClassify(value = -1, callBack = null){
    const classify_menu = document.querySelector("#classify_menu");
    classify_menu.innerHTML = `<option value="NONE">Chọn...</option>`
    let count = 0;
    const response = await fetch(urlMenu);
    arrClassify = await response.json();
    if(arrClassify!== null){
        arrClassify.forEach(element => {
            classify_menu.innerHTML += `<option ${
                Number(value) + 1 === Number(element.ID) ? "selected" : ""
            } value="${count}">${element.NAME}</option>`
            count++;
        });
    }
    if(callBack !== null){
        callBack(value);
    }
    closeLoad();
}
loadDataClassify().catch(handleError);

document.querySelector("#classify_menu").addEventListener("change", (e) => {
    handleShowTable(e.target.value)
});

function handleShowTable(value){
    if(value !== "NONE"){
        document.querySelector("#table_menu").childNodes[3].innerHTML = '';
        arrClassify[value].MENU.forEach((item, i) => {
            showTableMenu(i, item.ID, item.ICON, item.NAME, item.RANK, arrClassify[value].ID);
        })
    }
}

async function Delete(id){
    if(id !== null){
        showLoad();
        closeModal();
        const respomse = await fetch(urlMenu + id,{
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
       closeLoad();
        const tr_menu = document.querySelector("#item_menu_"+id);
        tr_menu.remove();
    }
}

document.querySelector("#btn_reset").addEventListener("click", () => {
    showLoad();
    const value = document.querySelector("#classify_menu").value;
    loadDataClassify(value, handleShowTable).catch(handleError);
    //handleShowTable(value)
})

