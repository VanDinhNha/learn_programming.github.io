loadDataMenu().catch(handleError);

const copy_code = (opj) => {
    navigator.clipboard.writeText(opj.parentElement.childNodes[2].childNodes[1].textContent)
}

function showMenuData(name = "", listNenu = []){
    const menu_ul_li = document.querySelector(".menu-ul-li");
    let template_menu_child = "";
    let template_menu = "";
    listNenu.forEach(itemMenu => {
        if(itemMenu.MENU_CHILD.length > 0){
            itemMenu.MENU_CHILD.forEach(itemMenuChild =>{
                template_menu_child += `<a href="/?id-menu=${itemMenu.ID}&id-content=${itemMenuChild.ID_CONTENT}" id="${itemMenu.ID}_${itemMenuChild.ID_CONTENT}" class="menu-item__link">
                    ${itemMenuChild.NAME}
                </a>`;
            })
        }
        template_menu += `<li class="menu-item" id="${itemMenu.ID}" onclick="showMenuChild(this)">
            <div class="menu-item__parent">
                <span class="menu-item__parent--line"></span>
                ${itemMenu.ICON}
                <span class="menu-item__name">${itemMenu.NAME}</span>
                <span class="hover-text" aria-hidden="true">${itemMenu.NAME}</span>
            </div>
            <div class="menu-item__child">
                ${template_menu_child}
            </div>
        </li>`
        template_menu_child = '';
    })
    const templateClassify = ` <span class="classify-menu">
        ${name}
    </span>
    <ul id="menu_list">
        ${template_menu}
    </ul>`
    menu_ul_li.innerHTML += templateClassify; 
}

async function loadDataMenu(){
    const response = await fetch(urlMenu);
    const menu_item = await response.json();
    if(menu_item !== null){
        menu_item.forEach(itemClassify => {
            showMenuData(itemClassify.NAME, itemClassify.MENU);
        });
    }
    loadDataContent(getUrlVars(url)).catch(handleError);
}


//&lt;
function showDataContent(value, obj_id){
    const content_body = document.querySelector(".content-body");
    let template = `<div class="content-body-name">
            <span class="content-body-name--text">
                ${value.NAME}
            </span>
        </div>
        <p class="content-body--describe">${value.DESCRIBE}</p>
        `
    if(value.IMAGES.length > 0){
        value.IMAGES.forEach(image =>{
            template += `<img src="${image.IMAGE}" alt="image" class="content-body--image"/>`
            if(image.DESCRIBE !== null && image.DESCRIBE !== ""){
                template += `<p class="content-body--describe-image">${image.DESCRIBE}</p>`;
            }
        })
    }
    if(value.NOTE !== null && value.NOTE !== ""){
        template += `<P class="content-body--attention">Lưu ý: ${value.NOTE}</P>`
    }
    if(value.CODE.length > 0){
        value.CODE.forEach(itemDetail => {
            template += `<div class="content-body-detail">`
            if(itemDetail.TITLE !== null){
                template += `<label class="content-body-detail__title--text">${itemDetail.TITLE}</label>`
            }
            template += `<div class="content-body-detail__code">`
            if(itemDetail.CODE !== null && itemDetail.CODE !== "" && itemDetail.LANGUAGE !== null && itemDetail.LANGUAGE !== ""){
                template += `<button class="btn-copy" style="display: none;" onclick="copy_code(this)">
                        <svg width="20px" height="20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"></path><path fill="#ffffff" d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"></path></g></svg>
                    </button>
                    <deckgo-highlight-code class="loading-code" language="${itemDetail.LANGUAGE}">
                    <code slot="code">${itemDetail.CODE}</code>
                    </deckgo-highlight-code>`
            }
            if(itemDetail.DESCRIBE !== null){
                template += `<p class="content-body-detail__code--describe">${itemDetail.DESCRIBE}</p>`
            }
            if(itemDetail.IMAGES !== null && itemDetail.IMAGES.length > 0){
                itemDetail.IMAGES.forEach(image =>{
                    template += `<img src="${image.IMAGE}" alt="image" class="content-body-detail__image"/>`
                    if(image.DESCRIBE){
                        template += `<p class="content-body-detail--describe-image">${image.DESCRIBE}</p>`
                    }
                })
            }
            if(itemDetail.NOTE !== null && itemDetail.NOTE !== ""){
                template += `<P class="content-body-detail__code--attention">Lưu ý: ${itemDetail.NOTE}</P>`
            }
        template += ` </div>
    </div>`
        })
    }
    content_body.innerHTML = template
    const acctiveMenu = document.getElementById(obj_id["id-menu"]);
    showMenuChild(acctiveMenu, obj_id);
}

async function loadDataContent(id){
    if(Object.keys(id).length > 0){
        const response = await fetch(urlContent + id["id-content"]);
        const content_item = await response.json();
        showDataContent(content_item, id);
    }
    closeLoad();
    //kiểm tra thư viện tải xong chưa
    const btn_copy = document.querySelectorAll(".btn-copy")
    const highlight_code = document.querySelectorAll("deckgo-highlight-code")
    let script = document.createElement('script');
    script.src = 'https://unpkg.com/@deckdeckgo/highlight-code@latest/dist/deckdeckgo-highlight-code/deckdeckgo-highlight-code.esm.js';
    script.onload = function() {
      for(let i = 0; i < highlight_code.length; i++){
        highlight_code[i].classList.toggle("loading-code");
      }
        for(let i = 0; i < btn_copy.length; i++){
            btn_copy[i].removeAttribute("style");
        }
    };
    script.onerror = function() {
        handleError();
    };
    document.head.appendChild(script);
}


