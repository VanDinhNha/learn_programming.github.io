loadDataClassify().catch(handleError);

function showTableclassify(i, ID, NAME, RANK){
    let template = `<tr id="item_classify_${ID}">
        <td>${i+1}</td>
        <td>${NAME}</td>
        <td>${RANK}</td>
        <td>
            <a href="/admin/classify-menu/edit-classify.html?id=${ID}" target="_blank" class="btn bg-green">sửa</a>
            <button onclick="showModal('${ID}','Xóa Phân Loại', 'Bạn có chắc muốn xóa phân loại ${NAME} không ?');" class="btn bg-red">Xóa</button>
        </td>
    </tr>`;
    document.querySelector("#table_classify").childNodes[3].innerHTML += template;
}

async function loadDataClassify(){
    let count = 0;
    const response = await fetch(urlClassify);
    arrClassify = await response.json();
    if(arrClassify!== null){
        arrClassify.forEach((item, i) => {
            showTableclassify(i, item.ID, item.NAME, item.RANK);
        });
    }
    closeLoad();
}

async function Delete(id){
    if(id !== null){
        showLoad();
        closeModal();
        const respomse = await fetch(urlClassify + id,{
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
       closeLoad();
        const tr_menu = document.querySelector("#item_classify_"+id);
        tr_menu.remove();
    }
}

