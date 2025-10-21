function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-button");

  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(tabName + "-tab").classList.add("active");
  event.target.classList.add("active");
}

let debounceTimer;

function updatePreview() {
  const nama = document.getElementById("preview_nama").value;
  const kelas = document.getElementById("preview_kelas").value;
  const peringkat = document.getElementById("preview_peringkat").value;
  const wali = document.getElementById("preview_wali").value;
  const pimpinan = document.getElementById("preview_pimpinan").value;

  const nama_y = document.getElementById("nama_y_slider").value;
  const peringkat_y = document.getElementById("peringkat_y_slider").value;
  const wali_y = document.getElementById("wali_y_slider").value;
  const pimpinan_y = document.getElementById("pimpinan_y_slider").value;

  const nama_x_value = document.getElementById("nama_x_value").textContent;
  const nama_x =
    nama_x_value === "Auto"
      ? null
      : document.getElementById("nama_x_slider").value;
  const peringkat_x_value =
    document.getElementById("peringkat_x_value").textContent;
  const peringkat_x =
    peringkat_x_value === "Auto"
      ? null
      : document.getElementById("peringkat_x_slider").value;
  const wali_x_value = document.getElementById("wali_x_value").textContent;
  const wali_x =
    wali_x_value === "Auto"
      ? null
      : document.getElementById("wali_x_slider").value;
  const pimpinan_x_value =
    document.getElementById("pimpinan_x_value").textContent;
  const pimpinan_x =
    pimpinan_x_value === "Auto"
      ? null
      : document.getElementById("pimpinan_x_slider").value;

  const iframe = document.getElementById("pdf-preview");
  const placeholder = document.querySelector(".preview-placeholder");

  const payload = {
    nama: nama,
    kelas: kelas,
    peringkat: peringkat,
    wali_kelas: wali,
    pimpinan_ponpes: pimpinan,
    nama_y: nama_y,
    peringkat_y: peringkat_y,
    wali_y: wali_y,
    pimpinan_y: pimpinan_y,
  };

  if (nama_x !== null) payload.nama_x = nama_x;
  if (peringkat_x !== null) payload.peringkat_x = peringkat_x;
  if (wali_x !== null) payload.wali_x = wali_x;
  if (pimpinan_x !== null) payload.pimpinan_x = pimpinan_x;

  fetch("/preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      iframe.src = url;
      iframe.classList.add("loaded");
      placeholder.classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal membuat preview. Silakan coba lagi.");
    });
}

function resetPositions() {
  document.getElementById("nama_y_slider").value = 310;
  document.getElementById("peringkat_y_slider").value = 235;
  document.getElementById("wali_y_slider").value = 100;
  document.getElementById("pimpinan_y_slider").value = 100;

  document.getElementById("nama_y_value").textContent = 310;
  document.getElementById("peringkat_y_value").textContent = 235;
  document.getElementById("wali_y_value").textContent = 100;
  document.getElementById("pimpinan_y_value").textContent = 100;

  // Reset X to auto
  clearXSlider("nama");
  clearXSlider("peringkat");
  clearXSlider("wali");
  clearXSlider("pimpinan");

  updatePreview();
}

function clearXSlider(type) {
  const valueSpan = document.getElementById(type + "_x_value");
  valueSpan.textContent = "Auto";
  valueSpan.setAttribute("data-auto", "true");
}

function setupSliders() {
  const ySliders = [
    { slider: "nama_y_slider", value: "nama_y_value" },
    { slider: "peringkat_y_slider", value: "peringkat_y_value" },
    { slider: "wali_y_slider", value: "wali_y_value" },
    { slider: "pimpinan_y_slider", value: "pimpinan_y_value" },
  ];

  const xSliders = [
    { slider: "nama_x_slider", value: "nama_x_value" },
    { slider: "peringkat_x_slider", value: "peringkat_x_value" },
    { slider: "wali_x_slider", value: "wali_x_value" },
    { slider: "pimpinan_x_slider", value: "pimpinan_x_value" },
  ];

  ySliders.forEach((item) => {
    const slider = document.getElementById(item.slider);
    const valueDisplay = document.getElementById(item.value);

    if (slider && valueDisplay) {
      slider.addEventListener("input", function () {
        valueDisplay.textContent = this.value;
      });
    }
  });

  xSliders.forEach((item) => {
    const slider = document.getElementById(item.slider);
    const valueDisplay = document.getElementById(item.value);

    if (slider && valueDisplay) {
      valueDisplay.setAttribute("data-auto", "true");
      slider.addEventListener("input", function () {
        valueDisplay.textContent = this.value;
        valueDisplay.setAttribute("data-auto", "false");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupSliders();
  const singleForm = document.getElementById("certificateForm");
  const bulkForm = document.getElementById("bulkForm");

  if (singleForm) {
    singleForm.addEventListener("submit", function (e) {
      const nama = document.getElementById("nama").value.trim();
      const kelas = document.getElementById("kelas").value.trim();
      const peringkat = document.getElementById("peringkat").value;
      const waliKelas = document.getElementById("wali_kelas").value.trim();
      const pimpinanPonpes = document
        .getElementById("pimpinan_ponpes")
        .value.trim();

      if (!nama || !kelas || !peringkat || !waliKelas || !pimpinanPonpes) {
        e.preventDefault();
        alert("Mohon lengkapi semua field yang diperlukan!");
        return false;
      }

      const generateBtn = singleForm.querySelector(".btn-generate");
      generateBtn.textContent = " Sedang Membuat PDF...";
      generateBtn.disabled = true;

      setTimeout(() => {
        generateBtn.textContent = "Generate Piagam Penghargaan";
        generateBtn.disabled = false;
      }, 3000);
    });
  }

  if (bulkForm) {
    bulkForm.addEventListener("submit", function (e) {
      const fileInput = document.getElementById("excel_file");

      if (!fileInput.files || !fileInput.files[0]) {
        e.preventDefault();
        alert("Mohon pilih file Excel terlebih dahulu!");
        return false;
      }

      const file = fileInput.files[0];
      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 10) {
        e.preventDefault();
        alert("File terlalu besar! Maksimal 10MB");
        return false;
      }

      if (!file.name.endsWith(".xlsx")) {
        e.preventDefault();
        alert("Format file harus .xlsx!");
        return false;
      }

      // Show loading state
      const generateBtn = bulkForm.querySelector(".btn-generate");
      const originalText = generateBtn.textContent;
      generateBtn.textContent = " Memproses... Jangan tutup halaman!";
      generateBtn.disabled = true;

      // Create a hidden status message
      let statusMsg = document.getElementById("bulk-status-msg");
      if (!statusMsg) {
        statusMsg = document.createElement("div");
        statusMsg.id = "bulk-status-msg";
        statusMsg.style.cssText =
          "margin-top: 15px; padding: 15px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; text-align: center; font-weight: 600; color: #856404;";
        generateBtn.parentElement.appendChild(statusMsg);
      }
      statusMsg.textContent =
        " Sedang membuat sertifikat... Download akan dimulai otomatis.";
      statusMsg.style.display = "block";

      // Reset button after 2 minutes (extended timeout)
      setTimeout(() => {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
        if (statusMsg) {
          statusMsg.style.display = "none";
        }
      }, 120000); // 2 minutes timeout
    });
  }

  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    if (input.type !== "file") {
      input.addEventListener("input", function () {
        this.style.borderColor = this.value ? "#4caf50" : "#a5d6a7";
      });
    }
  });

  const fileInput = document.getElementById("excel_file");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const fileName = this.files[0].name;
        const fileSize = (this.files[0].size / 1024).toFixed(2);
        console.log(`File selected: ${fileName} (${fileSize} KB)`);
      }
    });
  }
});
