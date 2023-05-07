const menu_main = document.querySelector("#menu_main");
let arrClassify = [];

getAPILassify().catch(handleError);

async function getAPILassify(){
    const response = await fetch(urlMenu);
    arrClassify = await response.json();
    arrClassify === null ? arrClassify = [] : ""
    loadDatacLassify();
}

function loadDatacLassify(){    
    let count = 0;
    menu_main.innerHTML = `<option value="NONE">Chọn ...</option>`;
    document.querySelector("#classify_menu").innerHTML = `<option value="NONE">Chọn ...</option>`;
    arrClassify.forEach(element => {
        document.querySelector("#classify_menu").innerHTML += `<option value="${count}">${element.NAME}</option>`
        count++;
    });
    closeLoad();
}

document.querySelector("#classify_menu",).addEventListener("change", (e) => {
    e.preventDefault();
    let count = 0;
    menu_main.innerHTML = `<option value="NONE">Chọn ...</option>`;
    if(e.target.value !== "NONE"){
        arrClassify[e.target.value].MENU.forEach(item => {
            menu_main.innerHTML += `<option value="${count}">${item.NAME}</option>`
            count++;
        })
    }
});

document.querySelector("#menu_main").addEventListener("change", (e) => {
    e.preventDefault();
    const table = document.querySelector("#table_content");
    const classify_menu = document.querySelector("#classify_menu");
    table.childNodes[3].innerHTML = '';
    arrClassify[classify_menu.value].MENU[e.target.value].MENU_CHILD.forEach((item, i) => {
        showTableContent(i, item.ID_CONTENT, item.NAME, item.RANK, item.ID_CONTENT);
    })
});

function showTableContent(i, ID, NAME, RANK, ID_CONTENT){
    const table = document.querySelector("#table_content");
    let template = `<tr id="item_menu_${ID}">
        <td>${i+1}</td>
        <td>${NAME}</td>
        <td>${RANK}</td>
        <td>
            <a href="/admin/content/edit-content.html?id=${ID}" target="_blank" class="btn bg-green">sửa</a>
            <button onclick="showModal('${ID}','Xóa Nội Dung', 'Bạn có chắc muốn xóa nội dung ${NAME} không ?');" class="btn bg-red">Xóa</button>
            <a href="/?id-menu=${ID}&id-content=${ID_CONTENT}" target="_blank" class="btn bg-blue">Xem</a>
        </td>
    </tr>`
    table.childNodes[3].innerHTML += template;
}

async function Delete(id){
    if(id !== null){
       showLoad();
        closeModal();
        const respomse = await fetch(urlContent + id,{
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        closeLoad();
        if(respomse.status === 200){
            const tr_menu = document.querySelector("#item_menu_"+id);
            tr_menu.remove();
            getAPILassify().catch(handleError);
        }
        else{
            showNotification('error', 'Xóa thất bại')
        }
    }
}