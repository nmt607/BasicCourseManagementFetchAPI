var courseAPI = "http://localhost:3000/courses"

function start() {
    getCourse(renderCourse) //gọi hàm để xử lý dữ liệu    
    handleCreateCourse()

}

start()

// course constructor
function course(name, desc) {
    this.name = name,
        this.desc = desc
}

// render
function renderCourse(course) {
    var blockListCourse = document.querySelector('#listCourse')
    var html = course.reduce((html, item) => {
        return html + `
        <li class="course__item" data-id ="${item.id}">
            <span class="course__item-title h4 me-5">${item.name}</span> 
            <button onclick = "handleDeleteCourse(${item.id})" class="course__item-delete btn btn-danger" id="courseDelete">Xóa</button>           
            <button onclick = "handleUpdateCourse(${item.id})" class="course__item-update btn btn-primary" id="courseUpdate">Sửa</button>           
            <button onclick = "handleSubmitCourse(${item.id})" class="course__item-submit btn btn-success" id="courseSubmit">Gửi thông tin</button>           
            <p class="course__item-desc">${item.desc}</p>
        </li>
        `
    }, "")
    blockListCourse.innerHTML = html
}

// function call API and send request
function getCourse(callback) {
    fetch(courseAPI) // call API
        .then((res) => {
            return res.json()
        }) //API trả về chuỗi Json và sau đó render ra dạng biến JS
        .then(callback)// lấy dữ liệu trả về từ then phía trên sau đó gọi callback để xử lý
}
function createCourse(data, callback) {
    fetch(courseAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(callback)
}
function deleteCourse(id, callback) {
    fetch(courseAPI + "/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(callback)
}
function UpdateCourse(id, data, callback) {
    fetch(courseAPI + "/" + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(callback)
}

// handle after API respon
function handleCreateCourse() {
    var createCourseBtn = document.querySelector('#createCourseBtn')
    createCourseBtn.addEventListener('click', function (e) {
        var courseName = document.querySelector("#courseNameInput").value
        var courseDesc = document.querySelector("#courseDescInput").value
        var data = new course(courseName, courseDesc)
        createCourse(data, () => {
            getCourse(renderCourse)
        })
    })
}
function handleDeleteCourse(id) {
    var courseDelete = document.querySelector(`.course__item[data-id="${id}"]`)
    if (courseDelete) {
        deleteCourse(id, function () {
            courseDelete.remove()
        })
    }

}
function handleUpdateCourse(id) {
    var courseItem = document.querySelector(`.course__item[data-id="${id}"]`)
    var courseSubmitbBtn = courseItem.querySelector('.course__item-submit')
    courseSubmitbBtn.style.display = "inline-block"
    var courseName = courseItem.querySelector('.course__item-title')
    courseName.setAttribute("contenteditable", "true")
    var courseDesc = courseItem.querySelector('.course__item-desc')
    courseDesc.setAttribute("contenteditable", "true")
}

function handleSubmitCourse(id) {
    var courseItem = document.querySelector(`.course__item[data-id="${id}"]`)
    var courseName = courseItem.querySelector('.course__item-title')
    courseName.setAttribute("contenteditable", "false")
    var courseDesc = courseItem.querySelector('.course__item-desc')
    courseDesc.setAttribute("contenteditable", "false")
    var data = new course(courseName.innerHTML, courseDesc.innerHTML)
    UpdateCourse(id, data, function () {
        getCourse(renderCourse)
    })
}