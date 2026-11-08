const form = document.getElementById("formMahasiswa");
const tempatData = document.getElementById("datamahasiswa");

let idEdit = null;

// READ: Menampilkan data mahasiswa
async function tampilkanMahasiswa() {
  try {
    const response = await fetch("http://localhost:3000/mahasiswa");
    const mahasiswa = await response.json();

    tempatData.innerHTML = "";

    mahasiswa.forEach(function (mhs) {
      const item = document.createElement("div");
      item.className = "item-mahasiswa";

      const nama = document.createElement("p");
      nama.textContent = "Nama: " + mhs.nama;

      const nim = document.createElement("p");
      nim.textContent = "NIM: " + mhs.nim;

      const tombolEdit = document.createElement("button");
      tombolEdit.textContent = "Edit";
      tombolEdit.type = "button";

      tombolEdit.addEventListener("click", function () {
        idEdit = mhs.id;

        document.getElementById("nama").value = mhs.nama;
        document.getElementById("nim").value = mhs.nim;

        form.querySelector("button[type='submit']").textContent =
          "Simpan Perubahan";
      });

      const tombolHapus = document.createElement("button");
      tombolHapus.textContent = "Hapus";
      tombolHapus.type = "button";
      tombolHapus.style.backgroundColor = "#dc2626";

      tombolHapus.addEventListener("click", async function () {
        const yakin = confirm(
          "Yakin ingin menghapus mahasiswa " + mhs.nama + "?",
        );

        if (!yakin) return;

        try {
          const response = await fetch(
            `http://localhost:3000/mahasiswa/${mhs.id}`,
            { method: "DELETE" },
          );

          const hasil = await response.json();

          if (!response.ok) {
            throw new Error(hasil.pesan || "Gagal menghapus data");
          }

          await tampilkanMahasiswa();
          alert(hasil.pesan);
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          alert(error.message || "Gagal menghapus data");
        }
      });

      item.append(nama, nim, tombolEdit, tombolHapus);
      tempatData.appendChild(item);
    });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}

// CREATE dan UPDATE
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const nim = document.getElementById("nim").value.trim();

  if (!nama || !nim) {
    alert("Nama dan NIM wajib diisi!");
    return;
  }

  const sedangEdit = idEdit !== null;

  try {
    const response = await fetch(
      sedangEdit
        ? `http://localhost:3000/mahasiswa/${idEdit}`
        : "http://localhost:3000/mahasiswa",
      {
        method: sedangEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, nim }),
      },
    );

    const hasil = await response.json();

    if (!response.ok) {
      throw new Error(hasil.pesan || "Gagal menyimpan data");
    }

    form.reset();
    idEdit = null;

    form.querySelector("button[type='submit']").textContent = "Tambah";

    await tampilkanMahasiswa();
    alert(hasil.pesan);
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    alert(error.message || "Gagal menyimpan data");
  }
});

// Jalankan saat halaman dibuka
tampilkanMahasiswa();
