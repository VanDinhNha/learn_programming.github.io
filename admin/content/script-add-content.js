const file_upload = document.querySelector(".file-upload");
const btn_upload = document.querySelector(".btn-upload");
const file_upload_input = document.querySelector("#file-upload-input");
const review_image = document.querySelector('.review-image');
const detail = document.querySelector('.detail');
const listFileImage = [];
const listDetail = [];
let arrRank = [];
let storageCapacity = 0;

let arrMenu = {};


loadDatacLassifyMenu().catch(handleError);

async function getAllRank(id){
    const response = await fetch(urlRankMenuChild + id);
    arrRank = await response.json();
    checkRank();
}

document.querySelector('#menu_main').addEventListener('change', function(e) {
    getAllRank(e.target.value);
})

function checkRank(){
    const menu_main = document.querySelector("#menu_main");
    const rank_menu_child = document.querySelector('#rank_menu_child');
    menu_main.value !== "NONE" ?
        arrRank.includes(Number(rank_menu_child.value)) ? 
        rank_menu_child.setAttribute("style", "border-color: red") : 
        rank_menu_child.removeAttribute("style")
    :
    rank_menu_child.setAttribute("style", "border-color: red")
}

document.querySelector("#rank_menu_child").addEventListener("keyup", debounceFn(function() {
    checkRank();
}, 500))

async function loadDatacLassifyMenu(){
    const classify_menu= document.querySelector("#classify_menu");
    const response = await fetch(urlMenu);
    const menu_item = await response.json();
    menu_item.forEach(item => {
        arrMenu[item.ID] = item.MENU;
        classify_menu.innerHTML += `<option value="${item.ID}">${item.NAME}</option>`;
    });
    closeLoad();
}

document.querySelector("#classify_menu").addEventListener('change', function(e) {
    e.preventDefault();
    const menu_main= document.querySelector("#menu_main");
    menu_main.innerHTML = '<option value="NONE">Chọn ...</option>';
    arrMenu[e.target.value].forEach(item => {
        menu_main.innerHTML += `<option value="${item.ID}">${item.NAME}</option>`
    });
    closeLoad();
})

file_upload.addEventListener('dragover', (event) => {
    event.preventDefault();
    document.querySelector(".title-file-upload").textContent = 'Thả ra để tải ảnh lên';
})

file_upload.addEventListener('dragleave', (event) => {
    event.preventDefault();
    document.querySelector(".title-file-upload").textContent = 'Kéo thả hình ảnh vào đây'
})

file_upload.addEventListener('drop', (event) => {
    event.preventDefault();
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const image = event.dataTransfer.files[i];
        show_file_upload(image);
    }
    document.querySelector(".title-file-upload").textContent = 'Kéo thả hình ảnh vào đây'
})

btn_upload.addEventListener('click', () => {
    file_upload_input.click();
})

file_upload_input.addEventListener('change', () => {
    for (let i = 0; i < file_upload_input.files.length; i++) {
        const image = file_upload_input.files[i];
        show_file_upload(image);
    }
    file_upload_input.value = ''
})

function show_file_upload(Image){
    const limitedCapacity = 524288000;//byte, 500MB
    const review_image = document.querySelector(".review-image");
    if(Image.type.substring(0, 6) === "image/"){
        storageCapacity += Image.size;
        if(storageCapacity <= limitedCapacity){
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageBase64 = reader.result;
                listFileImage.push({
                    ["IMAGE"]: imageBase64,
                    ["DESCRIBE"]: null,
                    ["TYPE"]: Image.type
                })
                const template = `<div class="item-image">
                    <img class="image" src="${imageBase64}" alt="image">
                    <div class="image-infomation">
                        <p class="name-image">${Image.name}</p>
                        <p class="size-image">${(Image.size / 1024).toFixed(1)} kb</p>
                        <input type="text" class="form-control describe-image" spellcheck="false">
                    </div>
                    <button type="button" id="btn_remove_img" class="btn bg-red btn-remove-image">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
                    </button>
                </div>`
                review_image.insertAdjacentHTML("beforeend", template);
            }
            reader.readAsDataURL(Image);
        }
        else{
            showNotification('warning', 'Giới hạn dung lượng tất cả ảnh phải thấp hơn 500MB');
            return;
        }
    }
    else{
        const template = `<div class="item-image-error">
                            <div class="image-infomation">
                                <p class="name-image">File ${Image.name} không được hỗ trợ</p>
                            </div>
                            <button type="button" class="btn bg-red btn-remove-image">
                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
                            </button>
                            <span class="tooltip">File ${Image.name} không được hỗ trợ</span>
                        </div>`
        review_image.insertAdjacentHTML("beforeend", template);       
    }
}

const observerCallback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    handleDescribeImage(node.querySelector('.describe-image'));
                    removeImage(node.querySelector('.btn-remove-image'));
                }
            }
        }
    }
};

const observer = new MutationObserver(observerCallback);

observer.observe(review_image, { childList: true, subtree: true });

function handleDescribeImage(element){
    element.addEventListener("input", debounceFn(function (e) {
        const arrElement = document.querySelectorAll('.describe-image');
        const elementIndex = Array.prototype.indexOf.call(arrElement, e.target);
        listFileImage[elementIndex]["DESCRIBE"] = e.target.value;
    }, 500));
}

function removeImage(element){
    element.addEventListener("click", (e) => {
        const arrElement = document.querySelectorAll('.btn-remove-image');
        const elementIndex = Array.prototype.indexOf.call(arrElement, e.target.closest('.btn-remove-image'));
        element.parentNode.className === 'item-image' ?
            elementIndex >= 0 ?
                listFileImage.splice(elementIndex, 1) &&
                element.parentNode.remove()
            :
                showNotification('error', 'Xóa hình thất bại')
        :
            element.parentNode.remove();
    });
}
//-------------------------detail--------------------------
document.querySelector('#addDetail').addEventListener('click', () => {
    const detail = document.querySelector(".detail");
    const template = `<div class="content--detail">
        <button type="button" class="btn bg-red btn-remove--detail">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
        </button>
        <h2 class="text-center color-text">Nội Dung Chi Tiết</h2>
        <div class="layout--detail">
            <div class="layout-item--detail">
                <label class="color-text">Tiêu Đề</label>
                <input class="form-control TITLE" autocomplete="off" spellcheck="false" type="text">
            </div>
            <div class="layout-item--detail">
                <label class="color-text">Ngôn Ngữ</label> 
                <input type="text" class="form-control LANGUAGE" spellcheck="false" name="LANGUAGE">
            </div>
            <div class="layout-item--detail">
                <label class="color-text">CODE</label>
                <textarea class="form-control CODE" spellcheck="false" rows="3"></textarea>
            </div>
            <div class="layout-item--detail">
                <label class="color-text">Mô tả</label>
                <textarea class="form-control DESCRIBE" spellcheck="false" rows="3"></textarea>
            </div>
            <div class="layout-item--detail">
                <label class="color-text">Ghi Chú</label>
                <textarea class="form-control NOTE" spellcheck="false" rows="3"></textarea>
            </div>
            <div class="layout-item--detail">
                <div class="file-upload-container--detail">
                    <div class="file-upload--detail">
                        <div class="center" style="line-height: 40px;">
                            <p class="title-file-upload--detail">Kéo thả hình vào đây</p>
                            <p class="text-center color-text">Hoặc</p>
                            <button type="button" class="btn-upload--detail">
                                Chọn Hình
                                <span>
                                    <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M771.676772 844.966484l-493.818868-2.409202C155.877326 826.595933 63.123554 722.814917 63.123554 597.698178c0-130.716368 102.592286-238.521254 231.509687-246.711313 49.19257-103.481018 153.09031-169.576911 268.529285-169.576911 163.496056 0 296.588862 132.64332 297.338346 295.968388 60.968276 35.243157 98.267394 99.284112 98.267394 170.402163 0 97.314157-71.032044 179.008943-165.167037 194.371318l-21.924457 2.814661z m-459.914953-43.849937l458.661718-0.48225c81.031308-4.62489 144.493769-71.770266 144.493768-152.854816 0-59.084327-33.145216-111.895308-86.501928-137.82418l-12.921432-6.284608 0.888732-19.292047c0.127986-1.87371 0.267234-3.736158 0.267234-5.63137 0-139.772633-113.715776-253.488409-253.488409-253.488409-102.463276 0-194.264834 61.086022-233.875886 155.627498l-5.598605 13.370918-14.495144 0.086007c-111.499064 0.653239-202.219399 91.876302-202.2194 203.353864 0 108.704881 85.142208 197.830003 193.825588 202.904379l10.963764 0.515014z" fill="#ffffff"></path><path d="M532.875998 390.961396L370.321916 553.516502l34.921657 34.921657 102.935287-102.935287V711.5317h49.385061V485.502872l102.934263 102.935287 34.93292-34.921657z" fill="#abd3f2"></path></g></svg>
                                </span>
                            </button>
                            <input class="file-upload-input" type="file" multiple accept="image/*" id="file-upload-input--detail" name="file-upload-input--detail" />
                        </div>
                    </div>
                    <div class="review-image--detail"></div>
                </div>
            </div>
        </div>
    </div>`;
    detail.insertAdjacentHTML("beforeend", template);
     listDetail.push({
        "TITLE": null,
        "LANGUAGE": null,
        "CODE": null,
        "DESCRIBE": null,
        "NOTE": null,
        "IMAGE_DATA": []
    });
});

const observerDetailCallback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const describeImage = node.querySelector('.describe-image--detail');
                    const titleDetail = node.querySelector('.TITLE');
                    const languageDetail = node.querySelector('.LANGUAGE');
                    const codeDetail = node.querySelector('.CODE');
                    const describeDetail = node.querySelector('.DESCRIBE');
                    const noteDetail = node.querySelector('.NOTE');
                    const imageDetail = node.querySelector('.file-upload--detail');
                    const uploadImageDetail = node.querySelector('.btn-upload--detail');
                    const btnRemoveDetail = node.querySelector('.btn-remove--detail');
                    const btnRemoveImageDetail = node.querySelector('.btn-remove-image--detail');
                    if(titleDetail !== null){
                        handlerDetailValue(titleDetail);
                    }
                    if(languageDetail !== null){
                        handlerDetailValue(languageDetail);
                    }
                    if(codeDetail !== null){
                        handlerDetailValue(codeDetail);
                    }
                    if(describeDetail !== null){
                        handlerDetailValue(describeDetail);
                    }
                    if(noteDetail !== null){
                        handlerDetailValue(noteDetail);
                    }
                    if(imageDetail !== null){
                        handlerImageDetail(imageDetail);
                    }
                    if(uploadImageDetail !== null){
                        handleUploadImageDetail(uploadImageDetail);
                    }
                    if(btnRemoveDetail !== null){
                        removeDelail(btnRemoveDetail);
                    }
                    if (describeImage !== null) {
                        handleDescribeImageDetail(describeImage);
                    }
                    if(btnRemoveImageDetail !== null){
                        removeImageDetail(btnRemoveImageDetail);
                    }
                }
            }
        }
    }
};

const observerDetail = new MutationObserver(observerDetailCallback);

observerDetail.observe(detail, { childList: true, subtree: true });

function handlerDetailValue(element){
    element.addEventListener("input", debounceFn(function(e) {
        e.preventDefault();
        const elementNAME = element.classList[1];
        const arrElement = document.querySelectorAll('.' + elementNAME)
        const elementIndex = Array.prototype.indexOf.call(arrElement, e.target);
        listDetail[elementIndex][elementNAME] = e.target.value;  
    }, 500));
}

function handlerImageDetail(element){
    element.addEventListener("dragover", (e) => {
        e.preventDefault();
        element.childNodes[1].childNodes[1].textContent = 'Thả ra để tải ảnh lên';
    });
    element.addEventListener("dragleave", (e) => {
        e.preventDefault();
        element.childNodes[1].childNodes[1].textContent = 'Kéo thả hình vào đây';
    });
    element.addEventListener("drop", (e) => {
        e.preventDefault();
        const arrElement = document.querySelectorAll('.file-upload--detail');
        const elementIndex = Array.prototype.indexOf.call(arrElement, e.target);
        const elementReview = element.nextElementSibling;
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const image = e.dataTransfer.files[i];
            showFileUploadDetail(elementIndex, image, elementReview)
        }
        element.childNodes[1].childNodes[1].textContent = 'Kéo thả hình vào đây';
        e.dataTransfer.value = '';
    });
}

function handleUploadImageDetail(element){
        const inputFIle = element.nextElementSibling;
        element.addEventListener('click', (e) => {
            e.preventDefault();
            inputFIle.click();
        });
        inputFIle.addEventListener('change', (e) => {
            e.preventDefault();
            const arrElement = document.querySelectorAll('.btn-upload--detail');
            const elementIndex = Array.prototype.indexOf.call(arrElement, element);
            for (let i = 0; i < inputFIle.files.length; i++) {
              const image = inputFIle.files[i];
              const elementReview = element.parentNode.parentNode.nextElementSibling;
              showFileUploadDetail(elementIndex, image, elementReview);
            }
            inputFIle.value = '';
        });
}
function showFileUploadDetail(Index, Image, elementReview){
    const limitedCapacity = 524288000;//byte, 500MB
    if(Image.type.substring(0, 6) === "image/"){
        storageCapacity += Image.size;
        if(storageCapacity <= limitedCapacity){
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageBase64 = reader.result;
                listDetail[Index]["IMAGE_DATA"].push({
                    ["IMAGE"]: imageBase64,
                    ["DESCRIBE"]: null,
                    ["TYPE"]: Image.type
                });
                const template = `<div class="item-image">
                    <img class="image" src="${imageBase64}" alt="image">
                    <div class="image-infomation">
                        <p class="name-image">${Image.name}</p>
                        <p class="size-image">${(Image.size / 1024).toFixed(1)} kb</p>
                        <input type="text" class="form-control describe-image--detail" spellcheck="false">
                    </div>
                    <button class="btn bg-red btn-remove-image btn-remove-image--detail">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
                    </button>
                </div>`
                elementReview.insertAdjacentHTML("beforeend", template);
            }
            reader.readAsDataURL(Image);
        }
    }
    else{
        const template = `<div class="item-image-error">
            <div class="image-infomation">
                <p class="name-image">File ${Image.name} không được hỗ trợ</p>
            </div>
            <button class="btn bg-red btn-remove-image btn-remove-image--detail">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
            </button>
        </div>`;
        elementReview.insertAdjacentHTML("beforeend", template);   
    }
}

function handleDescribeImageDetail(element){
    element.addEventListener("input", debounceFn(function (e) {
        e.preventDefault();
        const arrElementReview = document.querySelectorAll('.review-image--detail');
        const elementReview = element.parentNode.parentNode.parentNode;
        const elementReviewIndex = Array.prototype.indexOf.call(arrElementReview, elementReview);
        const arrElementItem = elementReview.childNodes;
        const elementItem = element.parentNode.parentNode;
        const elementIndex = Array.prototype.indexOf.call(arrElementItem, elementItem);
        listDetail[elementReviewIndex]["IMAGE_DATA"][elementIndex]["DESCRIBE"] = e.target.value;
    }, 500));
}

function removeDelail(element){
    element.addEventListener("click", (e) => {
        e.preventDefault();
        const arrElement = document.querySelectorAll('.btn-remove--detail');
        const elementIndex = Array.prototype.indexOf.call(arrElement, e.target.closest('.btn-remove--detail'));
        elementIndex >= 0 ?
            listDetail.splice(elementIndex, 1) &&
            element.parentNode.remove()
        :
        showNotification('error', 'Xóa nội dung thất bại')
    });
}

function removeImageDetail(element){
    element.addEventListener("click", (e) => {
        e.preventDefault();
        const arrElementReview = document.querySelectorAll('.review-image--detail');
        const elementReview = element.parentNode.parentNode;
        const elementReviewIndex = Array.prototype.indexOf.call(arrElementReview, elementReview);
        const arrElementItem = elementReview.childNodes;
        const elementItem = element.parentNode;
        const elementIndex = Array.prototype.indexOf.call(arrElementItem, elementItem);
        element.parentNode.className === 'item-image' ?
            elementIndex >= 0 ?
                listDetail[elementReviewIndex]["IMAGE_DATA"].splice(elementIndex, 1) &&
                element.parentNode.remove()
            :
                showNotification('error', 'Xóa hình thất bại')
        :
            element.parentNode.remove();
    });
}
document.querySelector("#form_add_content").addEventListener("submit", function (e) {
    e.preventDefault();
    const ID_MENU = this.elements["menu_main"].value;
    const ID_CLASSIFY = this.elements["classify_menu"].value;
    const NAME = this.elements["name_menu_child"].value;
    const RANK = this.elements["rank_menu_child"].value;
    const DESCRIBE = this.elements["describe"].value;
    const NOTE = this.elements["note"].value;
    if(ID_CLASSIFY === "NONE"){
        showNotification('error', 'Chưa chọn phân loại menu')
        return;
    }
    if(ID_MENU === "NONE"){
        showNotification('error', 'Chưa chọn menu')
        return;
    }
    if(NAME === ""){
        showNotification('error', 'Chưa nhập tên menu con')
        return;
    }
    if(RANK === ""){
        showNotification('error', 'Chưa nhập tên thứ tự')
        return;
    }
    if(arrRank.includes(Number(RANK.value))){
        if(confirm('cấp độ này đã tồn tại, bạn có muốn sắp sếp lại cấp độ không') === false){
            return;
        }
    }
    addContent(ID_MENU, NAME, RANK, DESCRIBE, NOTE)//.catch(handleError);
});
async function addContent(ID_MENU, NAME, RANK, DESCRIBE, NOTE){
    showLoad();
    const respomse = await fetch(urlContent,{
        method: "POST",
        body: JSON.stringify({
            "ID_MENU": ID_MENU,
            "RANK": RANK,
            "NAME": NAME, 
            "DESCRIBE": DESCRIBE, 
            "NOTE": NOTE, 
            "IMAGES": JSON.stringify(listFileImage),
            "DETAIL": JSON.stringify(listDetail)
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    closeLoad()
    respomse.status === 200 ? showNotification('success', 'Thên thành công')  : showNotification('error', 'Thêm thất bại')
}//& location.reload()

