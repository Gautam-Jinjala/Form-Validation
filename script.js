document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  const dataList = document.getElementById("dataList");
  const submitBtn = document.getElementById("submitBtn");

  let editIndex = -1;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const dropdown = form.dropdown.value;
    const radio = form.radio.value;
    const checkboxes = Array.from(form.querySelectorAll('input[name="checkbox"]:checked')).map(cb => cb.value);

    if (name && email && dropdown && radio) {
      const data = { name, email, dropdown, radio, checkboxes };
      if (editIndex === -1) {
        addData(data);
      } else {
        updateData(editIndex, data);
      }

      form.reset();
      editIndex = -1;
      submitBtn.textContent = "Add";
    } else {
      console.log("Please fill out all required fields.");
    }
  });

  const addData = (data) => {
    const dataListArray = getDataList();
    dataListArray.push(data);
    saveDataList(dataListArray);
    renderDataList();
  };

  const updateData = (index, data) => {
    const dataListArray = getDataList();
    dataListArray[index] = data;
    saveDataList(dataListArray);
    renderDataList();
  };

  const deleteData = (index) => {
    const dataListArray = getDataList();
    dataListArray.splice(index, 1);
    saveDataList(dataListArray);
    renderDataList();
  };

  const editData = (index) => {
    const dataListArray = getDataList();
    const data = dataListArray[index];
    form.name.value = data.name;
    form.email.value = data.email;
    form.dropdown.value = data.dropdown;
    form.querySelector(`input[name="radio"][value="${data.radio}"]`).checked = true;
    data.checkboxes.forEach(value => {
      form.querySelector(`input[name="checkbox"][value="${value}"]`).checked = true;
    });
    editIndex = index;
    submitBtn.textContent = "Update";
  };

  const getDataList = () => JSON.parse(localStorage.getItem("dataList")) || [];

  const saveDataList = (dataList) => {
    localStorage.setItem("dataList", JSON.stringify(dataList));
  };

  const renderDataList = () => {
    dataList.innerHTML = "";
    const dataListArray = getDataList();

    dataListArray.forEach((data, index) => {
      const dataItem = document.createElement("div");
      dataItem.className = "data-item";
      dataItem.innerHTML = `
                <p>Name: ${data.name}</p>
                <p>Email: ${data.email}</p>
                <p>Dropdown: ${data.dropdown}</p>
                <p>Radio: ${data.radio}</p>
                <p>Checkboxes: ${data.checkboxes.join(", ")}</p>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            `;
      dataList.appendChild(dataItem);
    });

    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", () => {
        editData(button.dataset.index);
      });
    });

    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", () => {
        deleteData(button.dataset.index);
      });
    });
  };

  renderDataList();
});
